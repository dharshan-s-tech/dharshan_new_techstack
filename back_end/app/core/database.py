from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

engine = create_engine(
    settings.sqlalchemy_database_url,
    pool_pre_ping=True,
)


@event.listens_for(engine, "connect")
def set_search_path(dbapi_connection, connection_record):
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
