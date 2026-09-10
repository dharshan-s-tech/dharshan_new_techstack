from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any
from app.services.reports_service import ReportsService

router = APIRouter()
state_router = APIRouter()
combined_router = APIRouter()


@router.get("")
@router.get("/")
async def get_accounts_summary():
    """Summary metadata for accounts portal."""
    return {
        "title": "Union and State Government Accounts Suite",
        "description": "Financial Accounts, Appropriation Accounts, Accounts at a Glance and Monthly Key Indicators",
        "states_count": 47
    }


# ==========================================
# STATE ACCOUNTS CRUD & QUERIES
# ==========================================
@router.get("/state-accounts")
@state_router.get("")
@state_router.get("/")
async def get_state_accounts(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=1000),
    state_id: Optional[int] = Query(None, description="State ID"),
    state: str = Query("", description="State Name or Slug"),
    category: str = Query("", description="Account Category (Accounts at a Glance, Appropriation, Finance, Monthly)"),
    year: str = Query("", description="Accounting Year"),
    query: str = Query("", description="Search term"),
    sort: str = Query("year_desc", description="Sort order (year_desc, year_asc, title_asc, title_desc, state_asc)"),
):
    """Retrieve state accounts statements with state, category, volume, and download link."""
    return ReportsService.get_state_accounts(
        page=page,
        page_size=pageSize,
        state_id=state_id,
        state=state,
        category_name=category,
        year=year,
        query=query,
        sort=sort,
    )


@router.get("/state-accounts/{account_id}")
@state_router.get("/{account_id}")
async def get_state_account_detail(account_id: str):
    """Get single state account record."""
    item = ReportsService.get_state_account_by_id(account_id)
    if not item:
        raise HTTPException(status_code=404, detail="State account statement not found")
    return item


@router.post("/state-accounts")
@state_router.post("")
@state_router.post("/")
async def create_state_account(payload: Dict[str, Any]):
    """Create a new state account record in local CMS."""
    return ReportsService.save_local_state_account(payload)


@router.put("/state-accounts/{account_id}")
@state_router.put("/{account_id}")
async def update_state_account(account_id: str, payload: Dict[str, Any]):
    """Update state account record in local CMS."""
    payload["id"] = account_id
    return ReportsService.save_local_state_account(payload)


@router.delete("/state-accounts/{account_id}")
@state_router.delete("/{account_id}")
async def delete_state_account(account_id: str):
    """Delete state account record locally."""
    success = ReportsService.delete_local_state_account(account_id)
    return {"success": success, "id": account_id}


# ==========================================
# COMBINED ACCOUNTS CRUD & QUERIES
# ==========================================
@router.get("/combined-accounts")
@combined_router.get("")
@combined_router.get("/")
async def get_combined_accounts(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=1000),
    year: str = Query("", description="Accounting Year"),
    query: str = Query("", description="Search term"),
    category: str = Query("", description="combined or conference"),
    sort: str = Query("year_desc", description="Sort order (year_desc, year_asc, title_asc, title_desc)"),
):
    """Retrieve Combined Finance & Revenue Accounts (CFRA) and Annual Conference Materials."""
    return ReportsService.get_combined_accounts(
        page=page,
        page_size=pageSize,
        year=year,
        query=query,
        category=category,
        sort=sort,
    )


@router.get("/combined-accounts/{account_id}")
@combined_router.get("/{account_id}")
async def get_combined_account_detail(account_id: str):
    """Get single combined account record."""
    item = ReportsService.get_combined_account_by_id(account_id)
    if not item:
        raise HTTPException(status_code=404, detail="Combined account not found")
    return item


@router.post("/combined-accounts")
@combined_router.post("")
@combined_router.post("/")
async def create_combined_account(payload: Dict[str, Any]):
    """Create a new combined account record in local CMS."""
    return ReportsService.save_local_combined_account(payload)


@router.put("/combined-accounts/{account_id}")
@combined_router.put("/{account_id}")
async def update_combined_account(account_id: str, payload: Dict[str, Any]):
    """Update combined account record in local CMS."""
    payload["id"] = account_id
    return ReportsService.save_local_combined_account(payload)


@router.delete("/combined-accounts/{account_id}")
@combined_router.delete("/{account_id}")
async def delete_combined_account(account_id: str):
    """Delete combined account record locally."""
    success = ReportsService.delete_local_combined_account(account_id)
    return {"success": success, "id": account_id}


@router.get("/states")
async def get_states():
    """Retrieve all states and union territories for accounts selector."""
    filters = ReportsService.get_filter_options()
    return filters.get("states", [])
