from sqlalchemy.orm import Session
from app.models.news import News

class NewsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[News]:
        return self.db.query(News).all()
