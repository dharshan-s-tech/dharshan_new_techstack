from sqlalchemy import Column, String, Text
from app.core.database import Base

class Page(Base):
    __tablename__ = "pages"

    id = Column(String, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    content_html = Column(Text, nullable=False)
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
