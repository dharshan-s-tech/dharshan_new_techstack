from sqlalchemy import Column, Integer, String, Text, SmallInteger, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    file_title = Column(String, nullable=True)
    upload_file = Column(String, nullable=True)
    is_home = Column(SmallInteger, default=0)
    status = Column(SmallInteger, default=1)
    created_at = Column(DateTime, default=func.now())
    created_by = Column(Integer, default=1)
    modified_at = Column(DateTime, onupdate=func.now())
    updated_by = Column(Integer, nullable=True)
    show_on_home_page = Column(SmallInteger, default=0)

    translations = relationship("PageTranslation", back_populates="page", cascade="all, delete-orphan")


class PageTranslation(Base):
    __tablename__ = "page_translations"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False, index=True)
    culture = Column(String, nullable=False, index=True)  # 'en' or 'hi'
    title = Column(String, nullable=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    file_title = Column(String, nullable=True)
    upload_file = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    modified_at = Column(DateTime, onupdate=func.now())

    page = relationship("Page", back_populates="translations")
