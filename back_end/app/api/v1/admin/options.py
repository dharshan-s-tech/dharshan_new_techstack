from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user_management import Role, Website, Wing, UserOffice
from app.services.reports_service import ReportsService
from app.services.user_management_service import clean_json_str

router = APIRouter()

STATIC_OPTIONS = {
    "government_type_id": [
        {"value": "1", "label": "Union Government"},
        {"value": "2", "label": "State Government"},
        {"value": "3", "label": "Union Territory"},
        {"value": "4", "label": "Local Bodies"}
    ],
    "gender": [
        {"value": "Male", "label": "Male"},
        {"value": "Female", "label": "Female"},
        {"value": "Other", "label": "Other"}
    ],
    "language": [
        {"value": "en", "label": "English"},
        {"value": "hi", "label": "Hindi"}
    ],
    "designation_id": [
        {"value": "1", "label": "Comptroller and Auditor General of India"},
        {"value": "2", "label": "Deputy Comptroller and Auditor General"},
        {"value": "3", "label": "Director General of Audit"},
        {"value": "4", "label": "Principal Accountant General"}
    ]
}


@router.get("")
async def get_options(type: str | None = Query(None), db: Session = Depends(get_db)):
    # If no type specified or "all", return aggregated options dictionary
    if not type or type == "all":
        try:
            roles = db.query(Role).order_by(Role.id.asc()).all()
            role_options = [{"value": str(r.id), "label": clean_json_str(r.name)} for r in roles]
        except Exception:
            role_options = []

        try:
            sites = db.query(Website).filter(Website.status == 1).order_by(Website.id.asc()).all()
            site_options = [{"value": "0", "label": "All Subsites (National)"}]
            for w in sites:
                lbl = clean_json_str(w.title)
                if lbl:
                    site_options.append({"value": str(w.id), "label": f"{lbl}"})
        except Exception:
            site_options = [{"value": "0", "label": "All Subsites (National)"}]

        try:
            wings = db.query(Wing).order_by(Wing.id.asc()).all()
            wing_options = [{"value": str(w.id), "label": clean_json_str(w.title)} for w in wings]
        except Exception:
            wing_options = []

        try:
            offices = db.query(UserOffice).order_by(UserOffice.id.asc()).all()
            office_options = [{"value": str(o.id), "label": f"{o.title} ({o.location})" if o.location else o.title} for o in offices]
        except Exception:
            office_options = []

        return {
            "subsites": site_options,
            "roles": role_options,
            "wings": wing_options,
            "offices": office_options,
            "government_type_id": STATIC_OPTIONS["government_type_id"],
            "gender": STATIC_OPTIONS["gender"],
            "language": STATIC_OPTIONS["language"],
            "designation_id": STATIC_OPTIONS["designation_id"],
        }

    # Roles from DB
    if type in ("role_id", "roles", "parent_id"):
        try:
            roles = db.query(Role).order_by(Role.id.asc()).all()
            return [{"value": str(r.id), "label": clean_json_str(r.name)} for r in roles]
        except Exception:
            return []

    # Websites / Subsites from DB
    if type in ("website_id", "websites", "subsites", "subsite_id"):
        try:
            sites = db.query(Website).filter(Website.status == 1).order_by(Website.id.asc()).all()
            site_options = [{"value": "0", "label": "All Subsites (National)"}]
            for w in sites:
                lbl = clean_json_str(w.title)
                if lbl:
                    site_options.append({"value": str(w.id), "label": f"{lbl}"})
            return site_options
        except Exception:
            return [{"value": "0", "label": "All Subsites (National)"}]

    # Wings from DB
    if type in ("wings_id", "wings"):
        try:
            wings = db.query(Wing).order_by(Wing.id.asc()).all()
            return [{"value": str(w.id), "label": clean_json_str(w.title)} for w in wings]
        except Exception:
            return []

    # User Offices from DB
    if type in ("user_offices", "offices", "posted_office"):
        try:
            offices = db.query(UserOffice).order_by(UserOffice.id.asc()).all()
            return [{"value": str(o.id), "label": f"{o.title} ({o.location})" if o.location else o.title} for o in offices]
        except Exception:
            return []

    # Reports Filters
    filters = ReportsService.get_filter_options()

    if type in ("state_id", "states"):
        return [{"value": str(s["id"]), "label": s["name"]} for s in filters.get("states", [])]
    
    if type in ("sector", "sectors"):
        return [{"value": s, "label": s} for s in filters.get("sectors", []) if s != "All Sectors"]

    if type in ("report_type", "report_types"):
        return [{"value": t, "label": t} for t in filters.get("report_types", []) if t != "All"]

    if type in ("year", "years"):
        return [{"value": y, "label": y} for y in filters.get("years", [])]

    return STATIC_OPTIONS.get(type, [])
