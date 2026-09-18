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

    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "cag_new"
    DB_USER: str = ""
    DB_PASSWORD: str = ""
    DB_SCHEMA: str = "cag_revamp"
    SECURITY_SALT: str = ""
    ENCRYPTION_KEY: str = ""
    DATABASE_URL: str | None = None
    CLOUDFRONT_BASE_URL: str = "https://d7i5wg8xwe4hf.cloudfront.net"

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        if not self.DB_USER or not self.DB_HOST:
            return "sqlite:///./cag_dev.db"
        password = quote_plus(self.DB_PASSWORD) if self.DB_PASSWORD else ""
        auth = f"{self.DB_USER}:{password}@" if self.DB_USER else ""
        return (
            f"postgresql+psycopg2://{auth}"
            f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    def validate_security_compliance(self):
        """
        CERT-In security compliance enforcement:
        In production, ENCRYPTION_KEY and SECURITY_SALT must not be empty or default.
        """
        if self.ENVIRONMENT.lower() == "production":
            if not self.ENCRYPTION_KEY or self.ENCRYPTION_KEY == "cag_default_dev_encryption_key32":
                raise RuntimeError("CERT-In Violation: ENCRYPTION_KEY environment variable must be set in production")
            if not self.SECURITY_SALT:
                raise RuntimeError("CERT-In Violation: SECURITY_SALT environment variable must be set in production")


@lru_cache
def get_settings() -> Settings:
    s = Settings()
    s.validate_security_compliance()
    return s


settings = get_settings()
