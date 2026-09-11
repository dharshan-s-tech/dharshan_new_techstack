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
                LIMIT 10;
            """)
            rows = db.execute(q).mappings().fetchall()
            if rows:
                banners = []
                for r in rows:
                    img = r.get("image") or ""
                    if img and not img.startswith("http"):
                        img = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/{img}"
                    banners.append({
                        "id": r.get("id"),
                        "text": r.get("text"),
                        "image": img,
                        "link": r.get("link") or "#",
                        "status": r.get("status")
                    })
                return banners
        except Exception as e:
            logger.warning(f"Error fetching banners from db: {e}")

    return [
        {
            "id": 1,
            "text": "Comptroller & Auditor General of India",
            "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1601187063.jpg",
            "link": "#",
            "status": 1
        }
    ]


@presence_router.get("")
@presence_router.get("/")
async def get_presence(db: Session = Depends(get_db)):
    offices = []
    states_data = []
    if db and engine.dialect.name == "postgresql":
        try:
            q_states = text("SELECT state_id, state_name FROM cag_revamp.states WHERE status = 1 ORDER BY state_name;")
            rows_st = db.execute(q_states).mappings().fetchall()
            states_data = [{"id": r["state_id"], "name": r["state_name"]} for r in rows_st]
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

