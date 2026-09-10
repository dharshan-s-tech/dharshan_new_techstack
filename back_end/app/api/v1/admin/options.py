from fastapi import APIRouter, Query
from app.services.reports_service import ReportsService

router = APIRouter()

STATIC_OPTIONS = {
    "government_type_id": [
        {"value": "1", "label": "Union Government"},
        {"value": "2", "label": "State Government"},
        {"value": "3", "label": "Union Territory"},
        {"value": "4", "label": "Local Bodies"}
    ],
    "designation_id": [
        {"value": "1", "label": "Comptroller and Auditor General of India"},
        {"value": "2", "label": "Deputy Comptroller and Auditor General"},
        {"value": "3", "label": "Director General of Audit"},
        {"value": "4", "label": "Principal Accountant General"}
    ],
    "issue_id": [
        {"value": "1", "label": "Vol 45 Issue 1 (2026)"},
        {"value": "2", "label": "Vol 44 Issue 4 (2025)"}
    ]
}

@router.get("")
async def get_options(type: str = Query(...)):
    filters = ReportsService.get_filter_options()

    if type == "state_id" or type == "states":
        return [{"value": str(s["id"]), "label": s["name"]} for s in filters.get("states", [])]
    
    if type == "sector" or type == "sectors":
        return [{"value": s, "label": s} for s in filters.get("sectors", []) if s != "All Sectors"]

    if type == "report_type" or type == "report_types":
        return [{"value": t, "label": t} for t in filters.get("report_types", []) if t != "All"]

    if type == "year" or type == "years":
        return [{"value": y, "label": y} for y in filters.get("years", [])]

    return STATIC_OPTIONS.get(type, [])

