from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CAG Website API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "sqlite:///./cag_website.db"

settings = Settings()
