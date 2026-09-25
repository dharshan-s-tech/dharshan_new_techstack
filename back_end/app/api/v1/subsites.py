from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any

from app.core.database import get_db
from app.services.subsites_service import SubsitesService

router = APIRouter()


@router.get("/{subsite_code}")
async def get_subsite_info(
    subsite_code: str,
    culture: Optional[str] = Query("en", alias="culture"),
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    lang = language or culture or "en"
    data = SubsitesService.get_subsite_info(subsite_code, culture=lang, db=db)
    if not data:
        raise HTTPException(status_code=404, detail=f"Subsite '{subsite_code}' not found")
    return data


@router.get("/{subsite_code}/menus")
async def get_subsite_menus(
    subsite_code: str,
    culture: Optional[str] = Query("en", alias="culture"),
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    lang = language or culture or "en"
    menus = SubsitesService.get_subsite_menus(subsite_code, culture=lang, db=db)
    return menus


@router.get("/{subsite_code}/pages/{page_slug:path}")
async def get_subsite_page(
    subsite_code: str,
    page_slug: str,
    culture: Optional[str] = Query("en", alias="culture"),
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    lang = language or culture or "en"
    page_data = SubsitesService.get_subsite_page(subsite_code, page_slug, culture=lang, db=db)
    if not page_data:
        raise HTTPException(status_code=404, detail=f"Page '{page_slug}' not found for subsite '{subsite_code}'")
    return page_data


@router.get("/{subsite_code}/photos")
async def get_subsite_photos(
    subsite_code: str,
    culture: Optional[str] = Query("en", alias="culture"),
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    lang = language or culture or "en"
    photos = SubsitesService.get_subsite_photos(subsite_code, culture=lang, db=db)
    return photos

