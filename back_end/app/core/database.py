import logging
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

logger = logging.getLogger("uvicorn")
ACTIVE_DB_PORT = settings.DB_PORT


def _try_postgres(port: int):
    url = settings.sqlalchemy_database_url
    if port != settings.DB_PORT:
        password = settings.DB_PASSWORD
        from urllib.parse import quote_plus
        encoded = quote_plus(password)
        url = (
            f"postgresql+psycopg2://{settings.DB_USER}:{encoded}"
            f"@{settings.DB_HOST}:{port}/{settings.DB_NAME}"
        )
    pg_engine = create_engine(url, pool_pre_ping=True)
    with pg_engine.connect() as conn:
        conn.exec_driver_sql(f'SET search_path TO "{settings.DB_SCHEMA}", public')
    global ACTIVE_DB_PORT
    ACTIVE_DB_PORT = port
    logger.info(
        f"[Database] Connected to PostgreSQL {settings.DB_HOST}:{port}/{settings.DB_NAME} schema={settings.DB_SCHEMA}"
    )
    return pg_engine


def create_resilient_engine():
    ports = [settings.DB_PORT]
    if 5432 not in ports:
        ports.append(5432)
    if 5434 not in ports:
        ports.append(5434)

    last_error = None
    for port in ports:
        try:
            return _try_postgres(port)
        except Exception as exc:
            last_error = exc
            logger.warning(
                f"[Database] PostgreSQL {settings.DB_HOST}:{port}/{settings.DB_NAME} failed: {exc}"
            )

    logger.error(
        f"[Database] All PostgreSQL ports failed ({last_error}). Falling back to empty SQLite — UI will have no live data."
    )
    return create_engine(
        "sqlite:///./cag_dev.db",
        connect_args={"check_same_thread": False},
    )

engine = create_resilient_engine()


@event.listens_for(engine, "connect")
def set_search_path(dbapi_connection, connection_record):
    if engine.dialect.name != "postgresql":
        return
    schema = settings.DB_SCHEMA
    if not schema:
        return
    cursor = dbapi_connection.cursor()
    cursor.execute(f'SET search_path TO "{schema}", public')
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_psycopg2_connection():
    import psycopg2
    return psycopg2.connect(
        host=settings.DB_HOST,
        port=ACTIVE_DB_PORT,
        dbname=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        options=f'-c search_path="{settings.DB_SCHEMA}",public',
    )

