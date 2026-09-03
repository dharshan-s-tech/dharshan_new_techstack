from sqlalchemy import Column, String, Text
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    sector = Column(String, nullable=False)
    admin_level = Column(String, nullable=False)
    report_type = Column(String, nullable=False)
    published_date = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    description = Column(Text, nullable=True)
