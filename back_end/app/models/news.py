from sqlalchemy import Column, String, Text
from app.core.database import Base

class News(Base):
    __tablename__ = "news"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    published_date = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    url = Column(String, nullable=True)
    news_type = Column(String, default="trending")
