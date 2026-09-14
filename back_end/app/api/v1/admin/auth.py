from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.admin_user import AdminUser
from app.models.audit_log import AdminAuditLog
from app.core.security import verify_password, hash_password

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

@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    # 1. Check local AdminUser table
    user = db.query(AdminUser).filter(
        AdminUser.username == payload.username,
        AdminUser.is_active == True
    ).first()

    if user:
        if not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        user.last_login = datetime.utcnow()
        db.commit()

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

    # 2. Check cag_revamp.users table from PostgreSQL
    try:
        pg_user = db.execute(text("""
            SELECT id, username, email, password, role_id, status
            FROM cag_revamp.users
            WHERE (username = :u OR email = :u)
            LIMIT 1;
        """), {"u": payload.username}).mappings().first()

        if pg_user and pg_user["password"]:
            if verify_password(payload.password, pg_user["password"]):
                user_id = str(pg_user["id"])
                role_name = "super_admin" if pg_user["role_id"] == 1 else f"role_{pg_user['role_id']}"
                
                return LoginResponse(
                    id=user_id,
                    name=pg_user["username"],
                    email=pg_user["email"] or f"{pg_user['username']}@cag.gov.in",
                    username=pg_user["username"],
                    role=role_name
                )
    except Exception as e:
        # If remote postgres fails or table does not exist in local dev sqlite
        pass

    # 3. Default dev admin fallback for offline / initial development
    if payload.username == "admin" and payload.password == "admin123":
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

        return LoginResponse(
            id=user.id,
            name=user.full_name,
            email=user.email,
            username=user.username,
            role=user.role
        )

    raise HTTPException(status_code=401, detail="Invalid username or password")
