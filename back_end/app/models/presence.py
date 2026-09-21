from sqlalchemy import Column, Integer, SmallInteger, String, Text, DateTime
from datetime import datetime
from app.core.database import Base


class State(Base):
    __tablename__ = "states"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=True)
    parent_id = Column(Integer, default=0, nullable=True)
    name = Column(Text, nullable=False)
    slug = Column(String, nullable=True, index=True)
    image = Column(String, nullable=True)


class Department(Base):
    __tablename__ = "departments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, nullable=True, index=True)
    image = Column(String, nullable=True)
    status = Column(SmallInteger, default=1)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_by = Column(Integer, nullable=True)
    updated_at = Column(DateTime, nullable=True)


class WebsiteOffice(Base):
    __tablename__ = "websites"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, default=0, nullable=True)
    title = Column(Text, nullable=False)
    title_hi = Column(String, nullable=True)
    state_title = Column(String, nullable=True)
    state_title_hi = Column(String, nullable=True)
    state_image = Column(String, nullable=True)
    url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    state_id = Column(Integer, nullable=True, index=True)
    department_id = Column(Integer, nullable=True, index=True)
    status = Column(SmallInteger, default=1)
    is_system = Column(SmallInteger, default=0)
    created_by = Column(Integer, nullable=True)
    created_at = Column(DateTime, nullable=True)
    modified_by = Column(Integer, nullable=True)
    modified_at = Column(DateTime, nullable=True)


# Backwards compatibility alias
Website = WebsiteOffice
