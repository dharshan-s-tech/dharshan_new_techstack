from sqlalchemy.orm import Session
from app.models.page import Page

class PageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_slug(self, slug: str) -> Page | None:
        return self.db.query(Page).filter(Page.slug == slug).first()

    def get_all(self) -> list[Page]:
        return self.db.query(Page).all()
