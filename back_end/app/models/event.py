from sqlalchemy import Column, String, Text
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    date = Column(String, nullable=False)
    description = Column(Text, nullable=True)
