from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
import hashlib

from app.core.database import get_db
from app.models.admin_user import AdminUser
from app.models.audit_log import AdminAuditLog

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    id: str
    name: str
    email: str
    username: str
    role: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(
        AdminUser.username == payload.username,
        AdminUser.is_active == True
    ).first()

    # Fallback default admin user for initial setup/demo
    if not user and payload.username == "admin" and payload.password == "admin123":
        user_id = str(uuid.uuid4())
        user = AdminUser(
            id=user_id,
            username="admin",
            full_name="System Administrator",
            email="admin@cag.gov.in",
            password_hash=hash_password("admin123"),
            role="super_admin",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Simple password verify (supports plain hash matching)
    hashed_input = hash_password(payload.password)
    if user.password_hash != payload.password and user.password_hash != hashed_input:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user.last_login = datetime.utcnow()
    
    # Audit log
    audit_entry = AdminAuditLog(
        id=str(uuid.uuid4()),
        user_id=user.id,
        action="LOGIN",
        table_name="admin_users",
        record_id=user.id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        new_data=f'{{"login_time": "{datetime.utcnow().isoformat()}"}}'
    )
    db.add(audit_entry)
    db.commit()

    return LoginResponse(
        id=user.id,
        name=user.full_name,
        email=user.email,
        username=user.username,
        role=user.role
    )
