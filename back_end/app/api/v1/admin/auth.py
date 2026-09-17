from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
import uuid
import logging

from app.core.database import get_db
from app.core.security import verify_password, hash_password

logger = logging.getLogger("uvicorn")
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
    u_input = payload.username.strip()
    p_input = payload.password

    # 1. First check cag_revamp.users table from PostgreSQL
    try:
        query = text("""
            SELECT id, username, email, password, role_id, status, 
                   COALESCE(full_name, name, username) as full_name
            FROM cag_revamp.users
            WHERE (lower(username) = lower(:u) OR lower(email) = lower(:u))
            LIMIT 1;
        """)
        pg_user = db.execute(query, {"u": u_input}).mappings().first()

        if pg_user and pg_user["password"]:
            if verify_password(p_input, pg_user["password"]):
                user_id = str(pg_user["id"])
                role_name = "super_admin" if pg_user["role_id"] == 1 else ("admin" if pg_user["role_id"] == 2 else "auditor")
                
                logger.info(f"[Auth] Successful login for user '{pg_user['username']}' (role: {role_name})")
                return LoginResponse(
                    id=user_id,
                    name=pg_user["full_name"] or pg_user["username"],
                    email=pg_user["email"] or f"{pg_user['username']}@cag.gov.in",
                    username=pg_user["username"],
                    role=role_name
                )
    except Exception as e:
        logger.warning(f"[Auth] Error checking cag_revamp.users: {e}")
        db.rollback()

    # 2. Check local SQLite AdminUser table if exists
    try:
        from app.models.admin_user import AdminUser
        user = db.query(AdminUser).filter(
            AdminUser.username == u_input,
            AdminUser.is_active == True
        ).first()

        if user and verify_password(p_input, user.password_hash):
            user.last_login = datetime.utcnow()
            db.commit()
            return LoginResponse(
                id=user.id,
                name=user.full_name,
                email=user.email,
                username=user.username,
                role=user.role
            )
    except Exception:
        db.rollback()

    # 3. Default dev admin fallback for local development / testing
    if (u_input == "admin" and p_input in ("admin123", "admin", "cag@123")) or (u_input == "superadmin" and p_input in ("admin123", "admin", "superadmin")):
        return LoginResponse(
            id="admin-root-1",
            name="Super Administrator",
            email="admin@cag.gov.in",
            username=u_input,
            role="super_admin"
        )

    raise HTTPException(status_code=401, detail="Invalid username or password")
