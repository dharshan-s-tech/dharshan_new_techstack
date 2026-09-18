from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.services.pages_service import PagesService

router = APIRouter()


@router.get("")
@router.get("/")
async def get_page_by_query(
    slug: Optional[str] = Query(None),
    id: Optional[str] = Query(None),
    language: Optional[str] = Query("en", alias="culture"),
    db: Session = Depends(get_db)
):
    target = slug or id or "overview"
    page_data = PagesService.get_page_by_slug_or_id(target, culture=language or "en", db=db)
    if not page_data:
        raise HTTPException(status_code=404, detail=f"Page '{target}' not found")
    return page_data

@router.get("/{slug_or_id}")
async def get_page(
    slug_or_id: str,
    language: Optional[str] = Query("en", alias="culture"),
    db: Session = Depends(get_db)
):
    page_data = PagesService.get_page_by_slug_or_id(slug_or_id, culture=language or "en", db=db)
    if not page_data:
        raise HTTPException(status_code=404, detail="Page not found")
    return page_data


@router.get("/by-id/{page_id}")
async def get_page_by_id(
    page_id: int,
    language: Optional[str] = Query("en", alias="culture"),
    db: Session = Depends(get_db)
):
    page_data = PagesService.get_page_by_slug_or_id(str(page_id), culture=language or "en", db=db)
    if not page_data:
        raise HTTPException(status_code=404, detail="Page not found")
    return page_data
