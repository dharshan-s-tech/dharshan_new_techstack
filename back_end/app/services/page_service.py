from sqlalchemy.orm import Session
from app.repositories.page_repository import PageRepository

class PageService:
    def __init__(self, db: Session):
        self.repo = PageRepository(db)

    def get_page(self, slug: str):
        return self.repo.get_by_slug(slug)
