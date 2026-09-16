import json
import re
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
import bcrypt
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc, text, func

from app.models.user_management import (
    User, Role, RolePermission, UserOffice, Module,
    AuditTrailLog, Wing, Website, PasswordHistory, LoginAttempt
)


def clean_json_str(val: Any) -> str:
    """Extract readable text from a multilingual JSON string or return raw string."""
    if not val:
        return ""
    if isinstance(val, dict):
        return val.get("default") or val.get("en") or next(iter(val.values()), "")
    str_val = str(val).strip()
    # Try parsing JSON
    if (str_val.startswith("{") and str_val.endswith("}")) or (str_val.startswith('"') and str_val.endswith('"')):
        try:
            d = json.loads(str_val)
            if isinstance(d, dict):
                return d.get("default") or d.get("en") or next(iter(d.values()), "")
            elif isinstance(d, str):
                return clean_json_str(d)
        except Exception:
            pass
    # Strip any accidental redundant surrounding quotes
    if str_val.startswith('"') and str_val.endswith('"') and len(str_val) >= 2:
        str_val = str_val[1:-1]
    return str_val.replace('\\"', '"').strip()


def validate_password_policy(password: str) -> tuple[bool, str]:
    """
    Validates CAG Password Policy:
    - Length: 8 to 12 characters
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    - At least 1 special character (!@#$%^&*)
    """
    if not (8 <= len(password) <= 20):
        return False, "Password length must be between 8 and 20 characters."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."
    if not re.search(r"[@$!%*?&#^]", password):
        return False, "Password must contain at least one special character (@$!%*?&#^)."
    return True, ""


def hash_password_bcrypt(password: str) -> str:
    """Hashes password using Bcrypt with CakePHP-compatible $2y$ salt format."""
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    # Convert standard $2b$ to $2y$ for full CakePHP database backward compatibility
    if hashed.startswith("$2b$"):
        hashed = "$2y$" + hashed[4:]
    return hashed


def verify_password_bcrypt(plain_password: str, stored_hash: str) -> bool:
    """Verifies plain password against stored hash (supporting $2y$, $2b$, $2a$, and plain/sha256)."""
    if not stored_hash or not plain_password:
        return False
    try:
        # Normalize $2y$ to $2b$ for python bcrypt
        py_hash = stored_hash
        if py_hash.startswith("$2y$"):
            py_hash = "$2b$" + py_hash[4:]
        if py_hash.startswith("$2a$") or py_hash.startswith("$2b$"):
            return bcrypt.checkpw(plain_password.encode("utf-8"), py_hash.encode("utf-8"))
    except Exception:
        pass
    
    # Fallback to plain equality or SHA256 if needed
    import hashlib
    sha_hash = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return stored_hash == plain_password or stored_hash == sha_hash


class UserManagementService:

    # ──────────────────────────────────────────
    # USERS
    # ──────────────────────────────────────────

    @staticmethod
    def get_users(
        db: Session,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        role_id: Optional[str] = None,
        wings_id: Optional[str] = None,
        website_id: Optional[str] = None,
        status: Optional[str] = None,
        sort: Optional[str] = "newest"
    ) -> Dict[str, Any]:
        query = db.query(User)

        # Website isolation filter via roles_permissions
        if website_id and website_id != "all" and website_id != "0":
            try:
                w_id = int(website_id)
                allowed_roles = db.query(RolePermission.role_id).filter(
                    or_(RolePermission.website_id == w_id, RolePermission.website_id == 0)
                ).subquery()
                query = query.filter(User.role_id.in_(allowed_roles))
            except Exception:
                pass

        if role_id and role_id != "all":
            try:
                query = query.filter(User.role_id == int(role_id))
            except Exception:
                pass

        if wings_id and wings_id != "all":
            try:
                query = query.filter(User.wings_id == int(wings_id))
            except Exception:
                pass

        if status and status != "all":
            if status in ("1", "active", "true"):
                query = query.filter(User.status == 1)
            elif status in ("0", "inactive", "false"):
                query = query.filter(User.status == 0)

        if search:
            s_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    User.username.ilike(s_term),
                    User.email.ilike(s_term),
                    User.mobile.ilike(s_term),
                    User.first_name.ilike(s_term),
                    User.last_name.ilike(s_term),
                    User.name.ilike(s_term),
                    User.full_name.ilike(s_term),
                    User.designation.ilike(s_term)
                )
            )

        if sort == "oldest":
            query = query.order_by(asc(User.id))
        else:
            query = query.order_by(desc(User.id))

        total = query.count()
        offset = (page - 1) * limit
        rows = query.offset(offset).limit(limit).all()

        # Cache roles and wings for human-readable labels
        role_map = {r.id: clean_json_str(r.name) for r in db.query(Role.id, Role.name).all()}
        wing_map = {w.id: w.title for w in db.query(Wing.id, Wing.title).all()}

        formatted = []
        for u in rows:
            name_disp = clean_json_str(u.full_name) or clean_json_str(u.name) or f"{clean_json_str(u.first_name)} {clean_json_str(u.last_name)}".strip() or u.username or "—"
            formatted.append({
                "id": str(u.id),
                "username": u.username or "",
                "name": name_disp,
                "first_name": clean_json_str(u.first_name),
                "last_name": clean_json_str(u.last_name),
                "email": u.email or "",
                "mobile": u.mobile or "",
                "role_id": u.role_id,
                "role_name": role_map.get(u.role_id, f"Role #{u.role_id}" if u.role_id else "—"),
                "wings_id": u.wings_id,
                "wing_title": wing_map.get(u.wings_id, "—") if u.wings_id else "—",
                "designation": u.designation or "",
                "posted_office": u.posted_office or "",
                "gender": u.gender or "",
                "status": u.status,
                "is_active": u.status == 1,
                "avatar": u.avatar or "",
                "created_at": u.created_at.isoformat() if u.created_at else None,
            })

        return {
            "data": formatted,
            "total": total,
            "page": page,
            "totalPages": (total + limit - 1) // limit if limit > 0 else 1
        }

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[Dict[str, Any]]:
        try:
            uid = int(user_id)
        except Exception:
            return None
        u = db.query(User).filter(User.id == uid).first()
        if not u:
            return None

        role = db.query(Role).filter(Role.id == u.role_id).first() if u.role_id else None
        wing = db.query(Wing).filter(Wing.id == u.wings_id).first() if u.wings_id else None

        name_disp = clean_json_str(u.full_name) or clean_json_str(u.name) or f"{clean_json_str(u.first_name)} {clean_json_str(u.last_name)}".strip() or u.username or "—"

        return {
            "id": str(u.id),
            "username": u.username or "",
            "name": name_disp,
            "first_name": clean_json_str(u.first_name),
            "middle_name": clean_json_str(u.middle_name),
            "last_name": clean_json_str(u.last_name),
            "email": u.email or "",
            "mobile": u.mobile or "",
            "role_id": u.role_id,
            "role_name": clean_json_str(role.name) if role else "—",
            "wings_id": u.wings_id,
            "wing_title": wing.title if wing else "—",
            "kms_categories_id": u.kms_categories_id,
            "circular_categories_id": u.circular_categories_id,
            "designation": u.designation or "",
            "posted_office": u.posted_office or "",
            "gender": u.gender or "",
            "date_of_birth": u.date_of_birth or "",
            "status": u.status,
            "is_active": u.status == 1,
            "avatar": u.avatar or "",
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "modified_at": u.modified_at.isoformat() if u.modified_at else None,
        }

    @staticmethod
    def create_user(db: Session, data: Dict[str, Any], actor_id: int = 1, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        # Validate unique username/email
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip()
        if not username:
            raise ValueError("Username is required.")
        if db.query(User).filter(User.username == username).first():
            raise ValueError(f"Username '{username}' already exists.")
        if email and db.query(User).filter(User.email == email).first():
            raise ValueError(f"Email '{email}' already registered.")

        # Password validation & hashing
        raw_password = data.get("password") or "Cag@2026!Admin"
        valid, msg = validate_password_policy(raw_password)
        if not valid:
            raise ValueError(msg)
        hashed_pwd = hash_password_bcrypt(raw_password)

        first_name = (data.get("first_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()
        full_name = f"{first_name} {last_name}".strip() or username

        # Multilingual JSON format for names
        name_json = json.dumps({"default": full_name, "hi": data.get("name_hi") or full_name})
        fn_json = json.dumps({"default": first_name, "hi": data.get("first_name_hi") or first_name})
        ln_json = json.dumps({"default": last_name, "hi": data.get("last_name_hi") or last_name})

        # Calculate next ID
        max_id = db.query(func.max(User.id)).scalar() or 0
        new_id = max_id + 1

        status_val = 1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true", "active")) else 0

        user = User(
            id=new_id,
            role_id=int(data.get("role_id")) if data.get("role_id") else None,
            wings_id=int(data.get("wings_id")) if data.get("wings_id") else None,
            kms_categories_id=int(data.get("kms_categories_id")) if data.get("kms_categories_id") else None,
            circular_categories_id=int(data.get("circular_categories_id")) if data.get("circular_categories_id") else None,
            username=username,
            password=hashed_pwd,
            email=email,
            mobile=(data.get("mobile") or "").strip(),
            first_name=fn_json,
            last_name=ln_json,
            name=name_json,
            full_name=name_json,
            designation=data.get("designation") or "",
            posted_office=data.get("posted_office") or "",
            gender=data.get("gender") or "Male",
            avatar=data.get("avatar") or "",
            status=status_val,
            created_at=datetime.utcnow(),
            created_by=actor_id
        )
        db.add(user)
        db.flush()

        # Record initial password in password_history
        now_dt = datetime.utcnow()
        db.execute(
            text("INSERT INTO cag_revamp.password_history (user_id, user_type, password, created_at, updated_at) VALUES (:u_id, :u_type, :pwd, :c_at, :u_at)"),
            {
                "u_id": new_id,
                "u_type": str(user.role_id or 1),
                "pwd": hashed_pwd,
                "c_at": now_dt,
                "u_at": now_dt
            }
        )

        # Audit log
        audit = AuditTrailLog(
            user_id=actor_id,
            action="add",
            action_status="success",
            username_email=username,
            ip_address=ip_address,
            data=json.dumps({"username": username, "email": email, "role_id": user.role_id}),
            table_alias="Users",
            action_datetime=datetime.utcnow()
        )
        db.add(audit)
        db.commit()

        return {"id": str(new_id), "success": True}

    @staticmethod
    def update_user(db: Session, user_id: str, data: Dict[str, Any], actor_id: int = 1, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        uid = int(user_id)
        user = db.query(User).filter(User.id == uid).first()
        if not user:
            raise ValueError("User not found.")

        if "username" in data and data["username"]:
            user.username = data["username"].strip()
        if "email" in data:
            user.email = data["email"].strip()
        if "mobile" in data:
            user.mobile = data["mobile"].strip()
        if "designation" in data:
            user.designation = data["designation"]
        if "posted_office" in data:
            user.posted_office = data["posted_office"]
        if "gender" in data:
            user.gender = data["gender"]
        if "avatar" in data:
            user.avatar = data["avatar"]
        if "role_id" in data and data["role_id"]:
            user.role_id = int(data["role_id"])
        if "wings_id" in data and data["wings_id"]:
            user.wings_id = int(data["wings_id"])

        if "first_name" in data or "last_name" in data:
            fn = data.get("first_name") or clean_json_str(user.first_name)
            ln = data.get("last_name") or clean_json_str(user.last_name)
            fln = f"{fn} {ln}".strip()
            user.first_name = json.dumps({"default": fn, "hi": data.get("first_name_hi") or fn})
            user.last_name = json.dumps({"default": ln, "hi": data.get("last_name_hi") or ln})
            user.name = json.dumps({"default": fln, "hi": fln})
            user.full_name = json.dumps({"default": fln, "hi": fln})

        if "is_active" in data or "status" in data:
            user.status = 1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true", "active")) else 0

        # Handle password change if provided
        raw_password = data.get("password")
        if raw_password and raw_password.strip():
            valid, msg = validate_password_policy(raw_password)
            if not valid:
                raise ValueError(msg)

            # Check password history (last 3)
            recent_hist = db.query(PasswordHistory).filter(
                PasswordHistory.user_id == uid
            ).order_by(desc(PasswordHistory.id)).limit(3).all()

            for h in recent_hist:
                if verify_password_bcrypt(raw_password, h.password):
                    raise ValueError("Password was used recently. Please choose a different password (cannot reuse last 3 passwords).")

            hashed_pwd = hash_password_bcrypt(raw_password)
            user.password = hashed_pwd

            now_dt = datetime.utcnow()
            db.execute(
                text("INSERT INTO cag_revamp.password_history (user_id, user_type, password, created_at, updated_at) VALUES (:u_id, :u_type, :pwd, :c_at, :u_at)"),
                {
                    "u_id": uid,
                    "u_type": str(user.role_id or 1),
                    "pwd": hashed_pwd,
                    "c_at": now_dt,
                    "u_at": now_dt
                }
            )

        user.modified_at = datetime.utcnow()
        user.modified_by = actor_id

        # Audit log
        audit = AuditTrailLog(
            user_id=actor_id,
            action="edit",
            action_status="success",
            username_email=user.username,
            ip_address=ip_address,
            data=json.dumps({"updated_fields": list(data.keys())}),
            table_alias="Users",
            action_datetime=datetime.utcnow()
        )
        db.add(audit)
        db.commit()

        return {"success": True}

    @staticmethod
    def delete_user(db: Session, user_id: str, actor_id: int = 1, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        uid = int(user_id)
        if uid == actor_id:
            raise ValueError("You cannot delete your own account.")

        user = db.query(User).filter(User.id == uid).first()
        if not user:
            raise ValueError("User not found.")

        # Record audit log before deleting
        audit = AuditTrailLog(
            user_id=actor_id,
            action="delete",
            action_status="success",
            username_email=user.username,
            ip_address=ip_address,
            data=json.dumps({"deleted_user_id": uid, "username": user.username}),
            table_alias="Users",
            action_datetime=datetime.utcnow()
        )
        db.add(audit)

        db.delete(user)
        db.commit()
        return {"success": True}

    # ──────────────────────────────────────────
    # ROLES & RBAC
    # ──────────────────────────────────────────

    @staticmethod
    def get_roles(db: Session, page: int = 1, limit: int = 50, search: Optional[str] = None, website_id: Optional[str] = None, status: Optional[str] = None) -> Dict[str, Any]:
        query = db.query(Role)
        if website_id and website_id != "all" and website_id != "0":
            try:
                w_id = int(website_id)
                allowed_roles = db.query(RolePermission.role_id).filter(
                    or_(RolePermission.website_id == w_id, RolePermission.website_id == 0)
                ).subquery()
                query = query.filter(Role.id.in_(allowed_roles))
            except Exception:
                pass

        if status and status != "all":
            if status in ("1", "active", "true"):
                query = query.filter(Role.status == 1)
            elif status in ("0", "inactive", "false"):
                query = query.filter(Role.status == 0)

        if search:
            query = query.filter(Role.name.ilike(f"%{search.strip()}%"))
        query = query.order_by(asc(Role.id))

        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        role_map = {r.id: clean_json_str(r.name) for r in db.query(Role.id, Role.name).all()}

        formatted = []
        for r in rows:
            formatted.append({
                "id": str(r.id),
                "name": clean_json_str(r.name),
                "raw_name": r.name,
                "parent_id": r.parent_id,
                "parent_name": role_map.get(r.parent_id, "None (Top Level)" if r.parent_id == 0 else f"Role #{r.parent_id}"),
                "status": r.status,
                "is_active": r.status == 1,
                "is_system": r.is_system == 1,
                "is_display": r.is_display == 1,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            })

        return {"data": formatted, "total": total, "page": page, "totalPages": (total + limit - 1) // limit if limit > 0 else 1}

    @staticmethod
    def create_role(db: Session, data: Dict[str, Any], actor_id: int = 1, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        name_str = (data.get("name") or "").strip()
        if not name_str:
            raise ValueError("Role name is required.")

        name_json = json.dumps({"default": name_str, "hi": data.get("name_hi") or name_str})
        max_id = db.query(func.max(Role.id)).scalar() or 0
        new_id = max_id + 1

        max_rght = db.query(func.max(Role.rght)).scalar() or 0

        role = Role(
            id=new_id,
            parent_id=int(data.get("parent_id") or 0),
            lft=max_rght + 1,
            rght=max_rght + 2,
            name=name_json,
            status=1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true", "active")) else 0,
            is_system=0,
            is_display=1,
            created_by=actor_id,
            created_at=datetime.utcnow()
        )
        db.add(role)

        # Handle website permissions
        website_ids = data.get("website_ids") or data.get("websites") or []
        if isinstance(website_ids, (list, tuple)):
            for wid in website_ids:
                try:
                    w_int = int(wid)
                    max_p_id = db.query(func.max(RolePermission.id)).scalar() or 0
                    perm = RolePermission(
                        id=max_p_id + 1,
                        role_id=new_id,
                        website_id=w_int,
                        state_id=0,
                        department_id=0
                    )
                    db.add(perm)
                    db.flush()
                except Exception:
                    pass

        audit = AuditTrailLog(
            user_id=actor_id,
            action="add",
            action_status="success",
            username_email="admin",
            ip_address=ip_address,
            data=json.dumps({"role_name": name_str}),
            table_alias="Roles",
            action_datetime=datetime.utcnow()
        )
        db.add(audit)
        db.commit()
        return {"id": str(new_id), "success": True}

    @staticmethod
    def update_role(db: Session, role_id: str, data: Dict[str, Any], actor_id: int = 1, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        rid = int(role_id)
        role = db.query(Role).filter(Role.id == rid).first()
        if not role:
            raise ValueError("Role not found.")

        if "name" in data and data["name"]:
            name_str = data["name"].strip()
            role.name = json.dumps({"default": name_str, "hi": data.get("name_hi") or name_str})
        if "parent_id" in data:
            role.parent_id = int(data["parent_id"] or 0)
        if "is_active" in data or "status" in data:
            role.status = 1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true", "active")) else 0

        # Update website permissions if provided
        if "website_ids" in data or "websites" in data:
            website_ids = data.get("website_ids") or data.get("websites") or []
            db.query(RolePermission).filter(RolePermission.role_id == rid).delete()
            if isinstance(website_ids, (list, tuple)):
                for wid in website_ids:
                    try:
                        w_int = int(wid)
                        max_p_id = db.query(func.max(RolePermission.id)).scalar() or 0
                        perm = RolePermission(
                            id=max_p_id + 1,
                            role_id=rid,
                            website_id=w_int,
                            state_id=0,
                            department_id=0
                        )
                        db.add(perm)
                        db.flush()
                    except Exception:
                        pass

        role.modified_at = datetime.utcnow()
        role.modified_by = actor_id

        audit = AuditTrailLog(
            user_id=actor_id,
            action="edit",
            action_status="success",
            username_email="admin",
            ip_address=ip_address,
            data=json.dumps({"updated_role_id": rid}),
            table_alias="Roles",
            action_datetime=datetime.utcnow()
        )
        db.add(audit)
        db.commit()
        return {"success": True}

    @staticmethod
    def delete_role(db: Session, role_id: str, actor_id: int = 1, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        rid = int(role_id)
        role = db.query(Role).filter(Role.id == rid).first()
        if not role:
            raise ValueError("Role not found.")
        if role.is_system == 1:
            raise ValueError("System protected roles cannot be deleted.")

        # Check if users are assigned to this role
        user_count = db.query(User).filter(User.role_id == rid).count()
        if user_count > 0:
            raise ValueError(f"Cannot delete role: {user_count} user(s) are currently assigned to it.")

        db.delete(role)
        db.commit()
        return {"success": True}

    # ──────────────────────────────────────────
    # USER OFFICES
    # ──────────────────────────────────────────

    @staticmethod
    def get_user_offices(db: Session, page: int = 1, limit: int = 20, search: Optional[str] = None) -> Dict[str, Any]:
        query = db.query(UserOffice)
        if search:
            query = query.filter(or_(
                UserOffice.title.ilike(f"%{search.strip()}%"),
                UserOffice.location.ilike(f"%{search.strip()}%")
            ))
        query = query.order_by(asc(UserOffice.id))
        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        formatted = []
        for o in rows:
            formatted.append({
                "id": str(o.id),
                "title": o.title or "",
                "language": o.language or "en",
                "location": o.location or "—",
                "status": o.status,
                "is_active": o.status == 1,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            })
        return {"data": formatted, "total": total, "page": page, "totalPages": (total + limit - 1) // limit if limit > 0 else 1}

    @staticmethod
    def create_user_office(db: Session, data: Dict[str, Any], actor_id: int = 1) -> Dict[str, Any]:
        title = (data.get("title") or "").strip()
        if not title:
            raise ValueError("Office title is required.")
        max_id = db.query(func.max(UserOffice.id)).scalar() or 0
        new_id = max_id + 1

        office = UserOffice(
            id=new_id,
            title=title,
            language=data.get("language") or "en",
            location=data.get("location") or "",
            status=1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true")) else 0,
            created_by=actor_id,
            created_at=datetime.utcnow()
        )
        db.add(office)
        db.commit()
        return {"id": str(new_id), "success": True}

    @staticmethod
    def update_user_office(db: Session, office_id: str, data: Dict[str, Any], actor_id: int = 1) -> Dict[str, Any]:
        oid = int(office_id)
        office = db.query(UserOffice).filter(UserOffice.id == oid).first()
        if not office:
            raise ValueError("Office not found.")
        if "title" in data:
            office.title = data["title"].strip()
        if "location" in data:
            office.location = data["location"]
        if "language" in data:
            office.language = data["language"]
        if "is_active" in data or "status" in data:
            office.status = 1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true")) else 0
        office.updated_at = datetime.utcnow()
        office.updated_by = actor_id
        db.commit()
        return {"success": True}

    @staticmethod
    def delete_user_office(db: Session, office_id: str) -> Dict[str, Any]:
        oid = int(office_id)
        office = db.query(UserOffice).filter(UserOffice.id == oid).first()
        if not office:
            raise ValueError("Office not found.")
        db.delete(office)
        db.commit()
        return {"success": True}

    # ──────────────────────────────────────────
    # MODULES & ACL
    # ──────────────────────────────────────────

    @staticmethod
    def get_modules(db: Session, page: int = 1, limit: int = 50, search: Optional[str] = None) -> Dict[str, Any]:
        query = db.query(Module)
        if search:
            query = query.filter(or_(
                Module.module_name.ilike(f"%{search.strip()}%"),
                Module.controller.ilike(f"%{search.strip()}%")
            ))
        query = query.order_by(asc(Module.id))
        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        formatted = []
        for m in rows:
            formatted.append({
                "id": str(m.id),
                "module_name": clean_json_str(m.module_name),
                "controller": m.controller or "",
                "action": m.action or "",
                "sub_actions": m.sub_actions or "",
                "prefix": m.prefix or "",
                "plugin": m.plugin or "",
                "status": m.status,
                "is_active": m.status == 1,
            })
        return {"data": formatted, "total": total, "page": page, "totalPages": 1}

    # ──────────────────────────────────────────
    # AUDIT TRAIL LOGS
    # ──────────────────────────────────────────

    @staticmethod
    def get_audit_trail_logs(db: Session, page: int = 1, limit: int = 20, search: Optional[str] = None) -> Dict[str, Any]:
        query = db.query(AuditTrailLog)
        if search:
            s = f"%{search.strip()}%"
            query = query.filter(or_(
                AuditTrailLog.username_email.ilike(s),
                AuditTrailLog.action.ilike(s),
                AuditTrailLog.table_alias.ilike(s),
                AuditTrailLog.ip_address.ilike(s)
            ))
        query = query.order_by(desc(AuditTrailLog.action_datetime), desc(AuditTrailLog.id))
        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        formatted = []
        for log in rows:
            formatted.append({
                "id": str(log.id),
                "action": (log.action or "UNKNOWN").upper(),
                "action_status": log.action_status or "success",
                "username_email": log.username_email or "System",
                "ip_address": log.ip_address or "127.0.0.1",
                "table_alias": log.table_alias or "—",
                "action_datetime": log.action_datetime.isoformat() if log.action_datetime else None,
                "data": log.data or "",
            })
        return {"data": formatted, "total": total, "page": page, "totalPages": (total + limit - 1) // limit if limit > 0 else 1}

    # ──────────────────────────────────────────
    # WINGS
    # ──────────────────────────────────────────

    @staticmethod
    def get_wings(db: Session, page: int = 1, limit: int = 20, search: Optional[str] = None, status: Optional[str] = None) -> Dict[str, Any]:
        query = db.query(Wing)
        if status and status != "all":
            if status in ("1", "active", "true"):
                query = query.filter(Wing.status == 1)
            elif status in ("0", "inactive", "false"):
                query = query.filter(Wing.status == 0)

        if search:
            query = query.filter(Wing.title.ilike(f"%{search.strip()}%"))
        query = query.order_by(asc(Wing.id))
        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        formatted = []
        for w in rows:
            formatted.append({
                "id": str(w.id),
                "title": w.title or "",
                "status": w.status,
                "is_active": w.status == 1,
                "created": w.created.isoformat() if w.created else None,
            })
        return {"data": formatted, "total": total, "page": page, "totalPages": (total + limit - 1) // limit if limit > 0 else 1}

    @staticmethod
    def create_wing(db: Session, data: Dict[str, Any], actor_id: int = 1) -> Dict[str, Any]:
        title = (data.get("title") or "").strip()
        if not title:
            raise ValueError("Wing title is required.")
        max_id = db.query(func.max(Wing.id)).scalar() or 0
        new_id = max_id + 1

        wing = Wing(
            id=new_id,
            title=title,
            status=1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true")) else 0,
            created=datetime.utcnow(),
            created_by=actor_id
        )
        db.add(wing)
        db.commit()
        return {"id": str(new_id), "success": True}

    @staticmethod
    def update_wing(db: Session, wing_id: str, data: Dict[str, Any], actor_id: int = 1) -> Dict[str, Any]:
        wid = int(wing_id)
        wing = db.query(Wing).filter(Wing.id == wid).first()
        if not wing:
            raise ValueError("Wing not found.")
        if "title" in data:
            wing.title = data["title"].strip()
        if "is_active" in data or "status" in data:
            wing.status = 1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true")) else 0
        wing.modified = datetime.utcnow()
        wing.modified_by = actor_id
        db.commit()
        return {"success": True}

    @staticmethod
    def delete_wing(db: Session, wing_id: str) -> Dict[str, Any]:
        wid = int(wing_id)
        wing = db.query(Wing).filter(Wing.id == wid).first()
        if not wing:
            raise ValueError("Wing not found.")
        db.delete(wing)
        db.commit()
        return {"success": True}

    # ──────────────────────────────────────────
    # ROLE PERMISSIONS
    # ──────────────────────────────────────────

    @staticmethod
    def get_role_permissions(db: Session, page: int = 1, limit: int = 50, search: Optional[str] = None, website_id: Optional[str] = None, role_id: Optional[str] = None) -> Dict[str, Any]:
        query = db.query(RolePermission)
        if website_id and website_id != "all":
            try:
                query = query.filter(RolePermission.website_id == int(website_id))
            except Exception:
                pass
        if role_id and role_id != "all":
            try:
                query = query.filter(RolePermission.role_id == int(role_id))
            except Exception:
                pass
        query = query.order_by(asc(RolePermission.id))
        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        role_map = {r.id: clean_json_str(r.name) for r in db.query(Role.id, Role.name).all()}
        site_map = {w.id: clean_json_str(w.title) for w in db.query(Website.id, Website.title).all()}

        formatted = []
        for rp in rows:
            formatted.append({
                "id": str(rp.id),
                "role_id": rp.role_id,
                "role_name": role_map.get(rp.role_id, f"Role #{rp.role_id}"),
                "website_id": rp.website_id,
                "website_title": site_map.get(rp.website_id, "All Websites (Super Admin)" if rp.website_id == 0 else f"Website #{rp.website_id}"),
                "state_id": rp.state_id,
                "department_id": rp.department_id
            })
        return {"data": formatted, "total": total, "page": page, "totalPages": (total + limit - 1) // limit if limit > 0 else 1}
