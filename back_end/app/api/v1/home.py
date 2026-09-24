import json
import re
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional, Dict, Any, List
import logging

from app.core.database import get_db, engine
from app.services.about_service import AboutAdminService

logger = logging.getLogger("uvicorn")

router = APIRouter()
presence_router = APIRouter()
banners_router = APIRouter()
officers_router = APIRouter()
about_router = APIRouter()
gov_types_router = APIRouter()


@router.get("")
@router.get("/")
async def get_home_data():
    return {
        "hero_title": "Comptroller and Auditor General of India",
        "hero_subtitle": "Supreme Audit Institution of India",
        "stats": [
            {"label": "Years of Excellence", "value": "150+"},
            {"label": "Reports Tabled Annually", "value": "700+"}
        ],
        "cag_message": {
            "name": "Shri K. Sanjay Murthy",
            "title": "Comptroller and Auditor General of India",
            "message": "Welcome to the official portal of the Comptroller and Auditor General of India..."
        }
    }


def _clean_banner_text(raw_text: Any) -> tuple[str, str]:
    if not raw_text:
        return ("Comptroller & Auditor General of India", "")
    s = str(raw_text).strip()
    t_en, t_hi = s, ""
    if s.startswith("{") and s.endswith("}"):
        try:
            j = json.loads(s)
            if isinstance(j, dict):
                t_en = j.get("default") or j.get("en") or ""
                t_hi = j.get("hi") or ""
        except Exception:
            m_en = re.search(r'"default"\s*:\s*"((?:[^"\\]|\\.)*)"', s)
            m_hi = re.search(r'"hi"\s*:\s*"((?:[^"\\]|\\.)*)"', s)
            if m_en:
                t_en = m_en.group(1).encode().decode('unicode_escape', errors='ignore')
            if m_hi:
                t_hi = m_hi.group(1).encode().decode('unicode_escape', errors='ignore')

    def _strip(txt: str) -> str:
        if not txt:
            return ""
        c = txt.replace("\ufffd", '"')
        c = re.sub(r"<[^>]+>", " ", c)
        c = c.replace("&nbsp;", " ").replace("&amp;", "&").replace("&quot;", '"').replace("&#39;", "'")
        c = re.sub(r"[\r\n\t]+", " ", c)
        c = re.sub(r"\s+", " ", c).strip()
        return c

    clean_en = _strip(t_en) or "Comptroller & Auditor General of India"
    clean_hi = _strip(t_hi)
    return (clean_en, clean_hi)


@banners_router.get("")
@banners_router.get("/")
async def get_banners(db: Session = Depends(get_db)):
    if db and engine.dialect.name == "postgresql":
        try:
            q = text("""
                SELECT id, text, image, link, status, display_order 
                FROM cag_revamp.banners 
                WHERE status = 1 
                ORDER BY display_order ASC, id DESC 
                LIMIT 20;
            """)
            rows = db.execute(q).mappings().fetchall()
            if rows:
                banners = []
                for r in rows:
                    img = r.get("image") or ""
                    if img and not (img.startswith("http://") or img.startswith("https://") or img.startswith("/assets/")):
                        img = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/{img}"
                    elif not img:
                        img = "/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png"

                    title_en, title_hi = _clean_banner_text(r.get("text"))

                    banners.append({
                        "id": r.get("id"),
                        "title_en": title_en,
                        "title_hi": title_hi,
                        "text": title_en,
                        "subtitle_en": "Supreme Audit Institution of India",
                        "subtitle_hi": "भारत का सर्वोच्च लेखापरीक्षा संस्थान",
                        "image_url": img,
                        "image": img,
                        "link_url": r.get("link") or "#",
                        "link": r.get("link") or "#",
                        "display_order": r.get("display_order") if r.get("display_order") is not None else 1,
                        "is_active": (r.get("status") == 1),
                        "status": r.get("status")
                    })
                return banners
        except Exception as e:
            logger.warning(f"Error fetching banners from db: {e}")

    return [
        {
            "id": 1,
            "title_en": "Comptroller & Auditor General of India",
            "title_hi": "भारत के नियंत्रक एवं महालेखापरीक्षक",
            "subtitle_en": "Supreme Audit Institution of India",
            "subtitle_hi": "भारत का सर्वोच्च लेखापरीक्षा संस्थान",
            "image_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1601187063.jpg",
            "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1601187063.jpg",
            "link_url": "#",
            "link": "#",
            "display_order": 1,
            "is_active": True,
            "status": 1
        }
    ]


@banners_router.post("")
@banners_router.post("/")
async def create_banner(payload: Dict[str, Any], db: Session = Depends(get_db)):
    text_val = payload.get("text") or payload.get("title_en") or "CAG of India"
    img_val = payload.get("image") or payload.get("image_url") or ""
    if img_val and "uploads/banner/" in img_val:
        img_val = img_val.split("uploads/banner/")[-1]
    link_val = payload.get("link") or payload.get("link_url") or "#"
    status_val = 1 if payload.get("is_active", True) else 0
    display_order = payload.get("display_order", 1)

    try:
        q = text("""
            INSERT INTO cag_revamp.banners (
                category_id, text, image, link, status, display_order,
                created_at, created_by, modified_at, modified_by
            ) VALUES (
                1, :text, :image, :link, :status, :display_order,
                NOW(), 1, NOW(), 1
            ) RETURNING id;
        """)
        new_id = db.execute(q, {
            "text": text_val,
            "image": img_val,
            "link": link_val,
            "status": status_val,
            "display_order": display_order
        }).scalar()
        db.commit()
        return {"success": True, "id": new_id}
    except Exception as e:
        db.rollback()
        logger.error(f"[Banners] Create banner failed: {e}")
        return {"success": False, "error": str(e)}


@banners_router.put("/{banner_id}")
async def update_banner(banner_id: int, payload: Dict[str, Any], db: Session = Depends(get_db)):
    text_val = payload.get("text") or payload.get("title_en")
    img_val = payload.get("image") or payload.get("image_url")
    if img_val and "uploads/banner/" in img_val:
        img_val = img_val.split("uploads/banner/")[-1]
    link_val = payload.get("link") or payload.get("link_url")
    status_val = 1 if payload.get("is_active", True) else 0
    display_order = payload.get("display_order")

    try:
        q = text("""
            UPDATE cag_revamp.banners
            SET text = COALESCE(:text, text),
                image = COALESCE(:image, image),
                link = COALESCE(:link, link),
                status = :status,
                display_order = COALESCE(:display_order, display_order),
                modified_at = NOW()
            WHERE id = :id;
        """)
        db.execute(q, {
            "id": banner_id,
            "text": text_val,
            "image": img_val,
            "link": link_val,
            "status": status_val,
            "display_order": display_order
        })
        db.commit()
        return {"success": True, "id": banner_id}
    except Exception as e:
        db.rollback()
        logger.error(f"[Banners] Update banner failed: {e}")
        return {"success": False, "error": str(e)}


@banners_router.delete("/{banner_id}")
async def delete_banner(banner_id: int, db: Session = Depends(get_db)):
    try:
        db.execute(text("UPDATE cag_revamp.banners SET status = 0, modified_at = NOW() WHERE id = :id;"), {"id": banner_id})
        db.commit()
        return {"success": True, "id": banner_id}
    except Exception as e:
        db.rollback()
        return {"success": False, "error": str(e)}


@presence_router.get("")
@presence_router.get("/")
async def get_presence(db: Session = Depends(get_db)):
    offices = []
    states_data = []
    if db and engine.dialect.name == "postgresql":
        try:
            q_states = text("SELECT id, name, slug FROM cag_revamp.states WHERE parent_id = 0 OR parent_id IS NULL ORDER BY name;")
            rows_st = db.execute(q_states).mappings().fetchall()
            states_data = [
                {
                    "id": r["slug"] if r.get("slug") else str(r["name"]).lower().replace(" ", "-"),
                    "name": r["name"],
                    "state_id": r["id"]
                }
                for r in rows_st
            ]
        except Exception as e:
            logger.warning(f"Error fetching states: {e}")

    return {
        "offices": offices,
        "states": states_data
    }


@officers_router.get("")
@officers_router.get("/")
async def get_officers():
    return {
        "id": "1",
        "name": "Shri K. Sanjay Murthy",
        "designation": "Comptroller & Auditor General of India",
        "email": "cagindia@cag.gov.in",
        "phone": "+91-11-23235790",
        "tier": 1,
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
        "children": []
    }


@gov_types_router.get("")
@gov_types_router.get("/")
async def get_government_types():
    return [
        {"id": 1, "name_en": "Union Government", "name_hi": "संघ सरकार"},
        {"id": 2, "name_en": "State Government", "name_hi": "राज्य सरकार"},
        {"id": 3, "name_en": "Union Territory", "name_hi": "केंद्र शासित प्रदेश"}
    ]


@about_router.get("")
@about_router.get("/")
async def get_about_data(
    category: Optional[str] = None,
    subtopic: Optional[str] = None,
    language: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db)
):
    return AboutAdminService.get_all_about_records(
        db=db,
        category=category,
        subtopic=subtopic,
        language=language,
        page=page,
        page_size=page_size
    )



# Convenience routes directly mounted under /home/...
@router.get("/banners")
async def get_home_banners(db: Session = Depends(get_db)):
    return await get_banners(db=db)


@router.get("/presence")
async def get_home_presence(db: Session = Depends(get_db)):
    return await get_presence(db=db)


@router.get("/officers")
async def get_home_officers():
    return await get_officers()


@router.get("/government-types")
async def get_home_gov_types():
    return await get_government_types()


@router.get("/about")
async def get_home_about(
    category: Optional[str] = None,
    subtopic: Optional[str] = None,
    language: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db)
):
    return await get_about_data(
        category=category,
        subtopic=subtopic,
        language=language,
        page=page,
        page_size=page_size,
        db=db
    )


@router.get("/former-cags")
@router.get("/former-cag")
async def get_home_former_cags(
    language: Optional[str] = Query("en", alias="culture"),
    db: Session = Depends(get_db)
):
    from app.services.former_cag_service import FormerCagService
    return FormerCagService.get_former_cags(culture=language or "en", db=db)

