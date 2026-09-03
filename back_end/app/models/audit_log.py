from sqlalchemy import Column, String, Text, DateTime
from datetime import datetime
from app.core.database import Base

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_log"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    table_name = Column(String, nullable=False)
    record_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    old_data = Column(Text, nullable=True)
    new_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
