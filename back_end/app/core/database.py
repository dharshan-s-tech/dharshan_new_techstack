import logging
from urllib.parse import quote_plus
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

logger = logging.getLogger("uvicorn")

def create_resilient_engine():
    candidates = [
        # 1. Configured target (10.10.182.66:5434 or from env)
        {
            "host": settings.DB_HOST,
            "port": settings.DB_PORT,
            "user": settings.DB_USER,
            "password": settings.DB_PASSWORD,
            "dbname": settings.DB_NAME,
            "schema": settings.DB_SCHEMA
        },
        # 2. Local tunnel on 5434
        {
            "host": "127.0.0.1",
            "port": 5434,
            "user": "test",
            "password": "Test@123",
            "dbname": "cag_db_final",
            "schema": "cag_revamp"
        },
        # 3. Local PostgreSQL on 5432
        {
            "host": "127.0.0.1",
            "port": 5432,
            "user": "postgres",
            "password": "password",
            "dbname": "cag_db",
            "schema": "public"
        }
    ]

    for c in candidates:
        try:
            pwd = quote_plus(c["password"])
            url = f"postgresql+psycopg2://{c['user']}:{pwd}@{c['host']}:{c['port']}/{c['dbname']}"
            connect_args = {}
            if c["schema"]:
                connect_args["options"] = f"-csearch_path={c['schema']},public"
            pg_engine = create_engine(
                url,
                pool_pre_ping=True,
                pool_recycle=300,
                connect_args=connect_args,
            )
            with pg_engine.connect() as conn:
                logger.info(f"[Database] Connected successfully to PostgreSQL at {c['host']}:{c['port']}/{c['dbname']} (schema: {c['schema']})")
                return pg_engine
        except Exception as exc:
            pass

    logger.warning("[Database] All PostgreSQL candidates failed. Falling back to local SQLite: cag_dev.db")
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
