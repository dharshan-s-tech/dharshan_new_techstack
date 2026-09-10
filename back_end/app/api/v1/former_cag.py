from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.services.former_cag_service import FormerCagService

router = APIRouter()


@router.get("")
async def get_former_cags(
    language: Optional[str] = Query("en", alias="culture"),
    db: Session = Depends(get_db)
):
    return FormerCagService.get_former_cags(culture=language or "en", db=db)
