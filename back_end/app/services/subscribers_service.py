import logging
import base64
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy import text
from app.core.database import SessionLocal
from app.core.security import encrypt_payload, decrypt_payload

logger = logging.getLogger("uvicorn")

class SubscribersService:
    @staticmethod
    def subscribe(email: str, ip_address: Optional[str] = "127.0.0.1") -> Dict[str, Any]:
        email = email.strip().lower()
        if not email or "@" not in email:
            return {"status": "error", "message": "Invalid email address."}
        
        db = SessionLocal()
        try:
            # Check if subscriber already exists
            query_check = text("SELECT id, email, verified FROM cag_revamp.subscribers WHERE lower(email) = :email LIMIT 1")
            existing = db.execute(query_check, {"email": email}).fetchone()
            
            if existing:
                sub_id, sub_email, verified = existing[0], existing[1], existing[2]
                if verified == 1:
                    return {
                        "status": "success",
                        "message": "Email is already subscribed and verified.",
                        "subscriber_id": sub_id,
                        "verified": True
                    }
            else:
                # Insert new subscriber
                insert_query = text("""
                    INSERT INTO cag_revamp.subscribers (email, ip_address, verified, created, modified)
                    VALUES (:email, :ip_address, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    RETURNING id
                """)
                res = db.execute(insert_query, {"email": email, "ip_address": ip_address or "127.0.0.1"})
                db.commit()
                sub_id = res.fetchone()[0]

            # Generate secure verification token using 256-bit AES ENCRYPTION_KEY
            token = encrypt_payload(str(sub_id))
            
            return {
                "status": "success",
                "message": "Subscription initiated. Please verify your email.",
                "subscriber_id": sub_id,
                "token": token,
                "verification_link": f"/subscribers/verify/{token}"
            }
        except Exception as e:
            db.rollback()
            logger.error(f"[SubscribersService] subscribe error: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            db.close()

    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        if not token:
            return {"status": "error", "message": "Token is missing."}
        
        try:
            decrypted = decrypt_payload(token)
            if not decrypted:
                return {"status": "error", "message": "Invalid or tampered verification token."}
            
            # Handle direct ID string or base64-encoded ID
            sub_id = None
            if decrypted.isdigit():
                sub_id = int(decrypted)
            else:
                try:
                    decoded_b64 = base64.b64decode(decrypted).decode("utf-8")
                    if decoded_b64.isdigit():
                        sub_id = int(decoded_b64)
                except Exception:
                    pass
            
            if not sub_id:
                return {"status": "error", "message": "Malformed token payload."}

            db = SessionLocal()
            try:
                # Find subscriber
                query = text("SELECT id, email, verified FROM cag_revamp.subscribers WHERE id = :sub_id LIMIT 1")
                row = db.execute(query, {"sub_id": sub_id}).fetchone()
                
                if not row:
                    return {"status": "error", "message": "Subscriber record not found."}
                
                # Update verified flag
                update_query = text("""
                    UPDATE cag_revamp.subscribers 
                    SET verified = 1, modified = CURRENT_TIMESTAMP
                    WHERE id = :sub_id
                """)
                db.execute(update_query, {"sub_id": sub_id})
                db.commit()
                
                return {
                    "status": "success",
                    "message": "Email successfully verified. You are now subscribed to CAG updates!",
                    "subscriber_id": sub_id,
                    "email": row[1]
                }
            finally:
                db.close()
        except Exception as e:
            logger.error(f"[SubscribersService] verify error: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_subscribers(page: int = 1, page_size: int = 20, query: Optional[str] = None, status: Optional[str] = None) -> Dict[str, Any]:
        """
        CMS / Admin listing of newsletter subscribers from cag_revamp.subscribers
        """
        db = SessionLocal()
        try:
            where_clauses = []
            params: Dict[str, Any] = {"limit": page_size, "offset": (page - 1) * page_size}

            if query:
                where_clauses.append("lower(email) LIKE :q")
                params["q"] = f"%{query.strip().lower()}%"

            if status is not None and status != "" and status != "all":
                if status in ("1", "verified", "true"):
                    where_clauses.append("verified = 1")
                elif status in ("0", "unverified", "pending", "false"):
                    where_clauses.append("verified = 0")

            where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

            count_query = text(f"SELECT COUNT(*) FROM cag_revamp.subscribers {where_sql}")
            total = db.execute(count_query, params).scalar() or 0

            select_query = text(f"""
                SELECT id, email, ip_address, verified, created, modified
                FROM cag_revamp.subscribers
                {where_sql}
                ORDER BY id DESC
                LIMIT :limit OFFSET :offset
            """)
            rows = db.execute(select_query, params).fetchall()

            items = []
            for r in rows:
                token = encrypt_payload(str(r.id))
                items.append({
                    "id": r.id,
                    "email": r.email,
                    "ip_address": r.ip_address,
                    "verified": bool(r.verified == 1),
                    "status_label": "Verified" if r.verified == 1 else "Pending",
                    "verification_token": token,
                    "verification_link": f"/subscribers/verify/{token}",
                    "created_at": str(r.created) if r.created else "",
                    "modified_at": str(r.modified) if r.modified else ""
                })

            return {
                "items": items,
                "total": total,
                "page": page,
                "page_size": page_size,
                "totalPages": (total + page_size - 1) // page_size if page_size > 0 else 1
            }
        except Exception as e:
            logger.error(f"[SubscribersService] get_subscribers error: {e}")
            return {"items": [], "total": 0, "page": page, "page_size": page_size, "totalPages": 1}
        finally:
            db.close()

    @staticmethod
    def toggle_subscriber_status(sub_id: int, verified: bool) -> bool:
        """
        CMS toggle subscriber status
        """
        db = SessionLocal()
        try:
            val = 1 if verified else 0
            query = text("UPDATE cag_revamp.subscribers SET verified = :val, modified = CURRENT_TIMESTAMP WHERE id = :id")
            db.execute(query, {"val": val, "id": sub_id})
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"[SubscribersService] toggle error: {e}")
            return False
        finally:
            db.close()

    @staticmethod
    def delete_subscriber(sub_id: int) -> bool:
        """
        CMS delete subscriber record
        """
        db = SessionLocal()
        try:
            query = text("DELETE FROM cag_revamp.subscribers WHERE id = :id")
            db.execute(query, {"id": sub_id})
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"[SubscribersService] delete error: {e}")
            return False
        finally:
            db.close()

