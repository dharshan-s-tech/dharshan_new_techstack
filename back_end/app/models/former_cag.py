from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, func
from app.core.database import Base


class FormerCag(Base):
    __tablename__ = "former_cag"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Former CAG")
    language = Column(String, default="en")  # 'en' or 'hi'
    tenure = Column(String, nullable=False)  # Officer's Full Name in DB schema
    tenure_from = Column(String, nullable=False)  # e.g. "2020" or full date
    tenure_to = Column(String, nullable=False)    # e.g. "2024" or full date
    image = Column(String, nullable=True)         # Filename in /uploads/former_cag/
    status = Column(SmallInteger, default=1)
    created = Column(DateTime, default=func.now())
    created_by = Column(Integer, default=1)
    modified = Column(DateTime, onupdate=func.now())
    updated_by = Column(Integer, nullable=True)
