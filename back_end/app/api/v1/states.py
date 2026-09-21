from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.presence_service import PresenceService

router = APIRouter()

STATE_SUBSITES_CUSTOM: Dict[str, Dict[str, Any]] = {}


@router.get("")
@router.get("/")
async def get_all_states_or_subsites(db: Session = Depends(get_db)):
    """Get list of all Indian States with office counts and configuration"""
    data = PresenceService.get_all_presence_data(db)
    return data.get("state_level_offices", [])


@router.get("/{state_slug}")
async def get_state_subsite(state_slug: str, db: Session = Depends(get_db)):
    """Get dynamic state subsite details by slug (e.g. andhra-pradesh)"""
    slug_clean = state_slug.lower().strip()
    if slug_clean in STATE_SUBSITES_CUSTOM:
        return STATE_SUBSITES_CUSTOM[slug_clean]
    
    return PresenceService.get_state_subsite_detail(db, state_slug=slug_clean)


@router.put("/{state_slug}")
async def update_state_subsite(state_slug: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    """Update or customize a state subsite page from Admin panel"""
    slug_clean = state_slug.lower().strip()
    STATE_SUBSITES_CUSTOM[slug_clean] = payload
    return payload
