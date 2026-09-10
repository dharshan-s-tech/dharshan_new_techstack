from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from app.services.reports_service import ReportsService

router = APIRouter()


@router.get("")
@router.get("/")
async def get_reports(
    page: int = Query(1, ge=1),
    pageSize: Optional[int] = Query(None, ge=1, le=100),
    page_size: Optional[int] = Query(None, ge=1, le=100),
    query: Optional[str] = Query(None, description="Search term in title or overview"),
    search: Optional[str] = Query(None, description="Alternative search parameter"),
    level: str = Query("", description="Government level (Union, States, Local Bodies)"),
    sector: str = Query("", description="Sector/Ministry"),
    type: Optional[str] = Query(None, description="Report Type (Compliance, Financial, Performance, ADC)"),
    report_type: Optional[str] = Query(None, description="Alternative report type parameter"),
    year: str = Query("", description="Report Year"),
    state_id: Optional[int] = Query(None, description="State ID"),
    language: str = Query("en", description="Language code"),
    sort: str = Query("newest", description="Sort order (newest, oldest, title_asc, title_desc)"),
):
    """Retrieve paginated audit reports matching filters."""
    eff_page_size = pageSize or page_size or 9
    eff_query = query if query is not None else (search or "")
    eff_type = type if type is not None else (report_type or "")
    return ReportsService.get_audit_reports(
        page=page,
        page_size=eff_page_size,
        query=eff_query,
        level=level,
        sector=sector,
        report_type=eff_type,
        year=year,
        state_id=state_id,
        language=language,
        sort=sort,
    )



@router.get("/filters")
async def get_report_filters():
    """Retrieve dynamic filter taxonomy for public and admin side menus."""
    return ReportsService.get_filter_options()


@router.get("/{report_id}")
async def get_report_detail(report_id: str):
    """Get complete report details for the detail view page."""
    report = ReportsService.get_audit_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Audit report not found")
    return report


# Admin CMS Endpoints (Saves strictly to local store, NEVER modifies remote DB)
@router.post("")
@router.post("/")
async def create_report(payload: Dict[str, Any]):
    """Create a new report card via the CMS admin drawer."""
    return ReportsService.save_local_report(payload)


@router.put("/{report_id}")
async def update_report(report_id: str, payload: Dict[str, Any]):
    """Update an existing report via the CMS admin drawer."""
    payload["id"] = report_id
    return ReportsService.save_local_report(payload)


@router.delete("/{report_id}")
async def delete_report(report_id: str):
    """Delete a report card locally via CMS admin."""
    success = ReportsService.delete_local_report(report_id)
    return {"success": success, "id": report_id}
