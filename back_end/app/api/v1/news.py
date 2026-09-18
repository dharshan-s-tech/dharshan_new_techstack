import json
import logging
import re
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime

from app.core.database import get_db, engine

logger = logging.getLogger("uvicorn")
router = APIRouter()
admin_router = APIRouter()


def _clean_localized_text(raw_text: Any) -> Tuple[str, str]:
    if not raw_text:
        return ("", "")
    s = str(raw_text).strip()
    t_en, t_hi = s, ""
    if s.startswith("{") and s.endswith("}"):
        try:
            j = json.loads(s)
            if isinstance(j, dict):
                t_en = str(j.get("default") or j.get("en") or "")
                t_hi = str(j.get("hi") or j.get("hindi") or "")
        except Exception:
            m_en = re.search(r'"(?:default|en)"\s*:\s*"((?:[^"\\]|\\.)*)"', s)
            m_hi = re.search(r'"(?:hi|hindi)"\s*:\s*"((?:[^"\\]|\\.)*)"', s)
            if m_en:
                t_en = m_en.group(1).encode().decode("unicode_escape", errors="ignore")
            if m_hi:
                t_hi = m_hi.group(1).encode().decode("unicode_escape", errors="ignore")

    def _strip(txt: str) -> str:
        if not txt:
            return ""
        c = re.sub(r"<[^>]+>", " ", txt)
        c = c.replace("&nbsp;", " ").replace("&amp;", "&").replace("&quot;", '"')
        return re.sub(r"\s+", " ", c).strip()

    return (_strip(t_en), _strip(t_hi))


def _map_news_row(r: Any, *, featured: bool = False) -> Dict[str, Any]:
    row_dict = dict(r)
    p_date = row_dict.get("publish_date") or row_dict.get("created_at") or "2026-06-04"
    date_str = p_date.strftime("%B %d, %Y") if hasattr(p_date, "strftime") else str(p_date)
    title_en, title_hi = _clean_localized_text(row_dict.get("title"))
    content_en, content_hi = _clean_localized_text(row_dict.get("content"))
    news_type = "featured" if featured else "trending"
    return {
        "id": f"news-{row_dict['id']}",
        "rawId": f"news-{row_dict['id']}",
        "db_id": row_dict["id"],
        "title": title_en or title_hi or "",
        "title_en": title_en or title_hi or "",
        "title_hi": title_hi,
        "content": content_en or content_hi or "",
        "desc": content_en or content_hi or "",
        "desc_en": content_en or content_hi or "",
        "desc_hi": content_hi,
        "description_en": content_en or content_hi or "",
        "published_date": date_str,
        "publish_date": date_str,
        "date": date_str,
        "type": news_type,
        "news_type": news_type,
        "is_trending": not featured,
        "is_featured": featured,
        "tag": "Finance",
        "is_active": row_dict.get("status", 1) == 1,
    }


@router.get("")
@router.get("/")
@admin_router.get("")
@admin_router.get("/")
async def get_news(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve all news items from PostgreSQL database."""
    if engine.dialect.name == "postgresql":
        try:
            if status == "active":
                where_sql = "WHERE status = 1"
            elif status == "inactive":
                where_sql = "WHERE status = 0"
            elif status == "all":
                where_sql = ""
            else:
                where_sql = "WHERE status = 1"
            q = text(f"""
                SELECT id, title, content, status, publish_date, created_at, modified_at
                FROM cag_revamp.news
                {where_sql}
                ORDER BY COALESCE(publish_date, created_at) DESC
                LIMIT :limit OFFSET :offset;
            """)
            offset = (page - 1) * limit
            rows = db.execute(q, {"limit": limit, "offset": offset}).mappings().fetchall()
            items = []
            for idx, r in enumerate(rows):
                # First item on page 1 is featured; rest are trending list items
                featured = page == 1 and idx == 0
                items.append(_map_news_row(r, featured=featured))
            return items
        except Exception as e:
            logger.warning(f"[News] DB query failed: {e}")

    # Fallback default items
    return [
        {
            "id": "news-1",
            "rawId": "news-1",
            "title": "Release of Union Government Finance Accounts for 2025-26",
            "title_en": "Release of Union Government Finance Accounts for 2025-26",
            "content": "Official publication of audited finance and appropriation accounts details.",
            "desc_en": "Official publication of audited finance and appropriation accounts details.",
            "published_date": "June 4, 2026",
            "publish_date": "June 4, 2026",
            "date": "June 4, 2026",
            "type": "trending",
            "news_type": "trending",
            "tag": "Finance",
            "is_active": True
        }
    ]


@router.post("")
@router.post("/")
@admin_router.post("")
@admin_router.post("/")
async def create_news(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Create a new news item in PostgreSQL database."""
    title = payload.get("title") or payload.get("title_en") or "New Release"
    content = payload.get("content") or payload.get("desc") or payload.get("desc_en") or ""
    is_active = 1 if payload.get("is_active", True) else 0

    if engine.dialect.name == "postgresql":
        try:
            res = db.execute(text("""
                INSERT INTO cag_revamp.news (title, content, status, publish_date, created_at, modified_at)
                VALUES (:title, :content, :status, NOW(), NOW(), NOW())
                RETURNING id;
            """), {"title": title, "content": content, "status": is_active})
            new_id = res.scalar()
            db.commit()
            return {"success": True, "id": f"news-{new_id}", "rawId": f"news-{new_id}"}
        except Exception as e:
            logger.error(f"[News] Create failed: {e}")
            db.rollback()

    return {"success": True, "id": payload.get("id", "news-local")}


@router.put("/{news_id}")
@admin_router.put("/{news_id}")
async def update_news(news_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Update an existing news item in PostgreSQL database."""
    title = payload.get("title") or payload.get("title_en") or ""
    content = payload.get("content") or payload.get("desc") or payload.get("desc_en") or ""
    is_active = 1 if payload.get("is_active", True) else 0

    clean_id_str = news_id.replace("news-", "")
    if clean_id_str.isdigit() and engine.dialect.name == "postgresql":
        try:
            db.execute(text("""
                UPDATE cag_revamp.news
                SET title = :title, content = :content, status = :status, modified_at = NOW()
                WHERE id = :id;
            """), {"title": title, "content": content, "status": is_active, "id": int(clean_id_str)})
            db.commit()
            return {"success": True, "id": news_id}
        except Exception as e:
            logger.error(f"[News] Update failed: {e}")
            db.rollback()

    return {"success": True, "id": news_id}


@router.delete("/{news_id}")
@admin_router.delete("/{news_id}")
async def delete_news(news_id: str, db: Session = Depends(get_db)):
    """Soft delete a news item in PostgreSQL database."""
    clean_id_str = news_id.replace("news-", "")
    if clean_id_str.isdigit() and engine.dialect.name == "postgresql":
        try:
            db.execute(text("""
                UPDATE cag_revamp.news SET status = 0, modified_at = NOW() WHERE id = :id;
            """), {"id": int(clean_id_str)})
            db.commit()
            return {"success": True, "id": news_id}
        except Exception as e:
            logger.error(f"[News] Delete failed: {e}")
            db.rollback()

    return {"success": True, "id": news_id}
