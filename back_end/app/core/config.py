from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "CAG Website API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    DB_HOST: str = "15.252.41.241"
    DB_PORT: int = 5432
    DB_NAME: str = "cag_new"
    DB_USER: str = "kreethi"
    DB_PASSWORD: str = "kreethi@123"
    DB_SCHEMA: str = "cag_revamp"
    SECURITY_SALT: str = "c3fd7183d431b3f8967db69db1d089200427fa226185a9af60e16a1d19312368"
    ENCRYPTION_KEY: str = "wt1U5MACWJFTXGenFoZosTtLGrCSdbHA"
    DATABASE_URL: str | None = None

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        password = quote_plus(self.DB_PASSWORD)
        return (
            f"postgresql+psycopg2://{self.DB_USER}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
