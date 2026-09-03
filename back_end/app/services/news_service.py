from sqlalchemy.orm import Session
from app.repositories.news_repository import NewsRepository

class NewsService:
    def __init__(self, db: Session):
        self.repo = NewsRepository(db)

    def get_news(self):
        return self.repo.get_all()
