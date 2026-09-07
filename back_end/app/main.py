from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import Base, engine
from app.api.router import api_router

# Ensure models are registered before create_all
from app.models import admin_user, audit_log, news, page, report, event, menu  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    with engine.begin() as conn:
        schema = settings.DB_SCHEMA
        if schema:
            conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema}"'))
        Base.metadata.create_all(bind=conn)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "db": f"{settings.DB_HOST}/{settings.DB_NAME}",
        "schema": settings.DB_SCHEMA,
    }
