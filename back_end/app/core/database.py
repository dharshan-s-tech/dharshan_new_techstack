import logging
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

logger = logging.getLogger("uvicorn")

def create_resilient_engine():
    try:
        pg_engine = create_engine(
            settings.sqlalchemy_database_url,
            pool_pre_ping=True,
        )
        # Test connection
        with pg_engine.connect() as conn:
            pass
        return pg_engine
    except Exception as exc:
        logger.warning(
            f"[Database] PostgreSQL connection failed ({exc}). Falling back to local SQLite: cag_dev.db"
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
    if settings.DATABASE_URL:
        url = settings.DATABASE_URL.replace("postgresql+psycopg2://", "postgresql://")
        return psycopg2.connect(url)
    return psycopg2.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        dbname=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
    )

