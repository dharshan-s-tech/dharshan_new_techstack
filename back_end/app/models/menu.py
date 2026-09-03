from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Menu(Base):
    __tablename__ = "menu_items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey("menu_items.id"), nullable=True)

    children = relationship("Menu", backref="parent", remote_side=[id])
