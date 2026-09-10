from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.services.organisation_chart_service import OrganisationChartService

router = APIRouter()


@router.get("")
async def get_organisation_chart(
    language: Optional[str] = Query("en", alias="culture"),
    db: Session = Depends(get_db)
):
    return OrganisationChartService.get_organisation_chart(culture=language or "en", db=db)
