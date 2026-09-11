from fastapi import APIRouter, HTTPException, Depends, Request, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
import json

from app.core.database import get_db
from app.models.audit_log import AdminAuditLog
from app.models.admin_user import AdminUser
from app.services.reports_service import ReportsService

router = APIRouter()


# In-memory mock store for dynamic admin modules if DB table doesn't exist yet
MOCK_MODULE_STORE: Dict[str, List[Dict[str, Any]]] = {
    "audit_reports": [
        {
            "id": "1",
            "title_en": "State Finances Audit Report 2025-26",
            "title_hi": "राज्य वित्त लेखापरीक्षा रिपोर्ट 2025-26",
            "year_of_report": 2026,
            "report_type": "Compliance",
            "sector": "Finance",
            "is_active": True,
            "created_at": "2026-06-01T10:00:00"
        }
    ],
    "news": [
        {
            "id": "1",
            "title_en": "Release of Union Government Finance Accounts for 2025-26",
            "title_hi": "केंद्रीय सरकार के वित्त खातों का विमोचन",
            "news_type": "general",
            "tag": "Finance",
            "publish_date": "2026-06-04",
            "is_active": True
        }
    ]
}

@router.get("/dashboard-stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    tables = [
        "audit_reports", "news", "notifications", "admin_users",
        "media_gallery", "publications", "pages", "events",
        "recruitment_notices", "tenders", "public_consultations", "contact_submissions"
    ]
    
    counts = {}
    for t in tables:
        counts[t] = len(MOCK_MODULE_STORE.get(t, []))

    recent_logs = db.query(AdminAuditLog).order_by(AdminAuditLog.created_at.desc()).limit(10).all()
    logs_data = []
    for log in recent_logs:
        logs_data.append({
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "table_name": log.table_name,
            "record_id": log.record_id,
            "ip_address": log.ip_address,
            "created_at": log.created_at.isoformat() if log.created_at else None,
            "full_name": "Administrator"
        })

    return {
        "counts": counts,
        "recentLogs": logs_data
    }

@router.get("")
async def list_or_get_crud(
    table: str = Query(...),
    id: Optional[str] = Query(None),
    page: int = Query(1),
    limit: int = Query(15),
    search: Optional[str] = Query(None),
    searchCol: Optional[str] = Query(None),
    sort: Optional[str] = Query("newest"),
    category: Optional[str] = Query(None),
    subtopic: Optional[str] = Query(None),
    db_table: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    eff_sort = sort or "newest"
    if table in ("about", "about_us", "about_records"):
        from app.services.about_service import AboutAdminService
        if id:
            all_data = AboutAdminService.get_all_about_records(db=db, page=1, page_size=1000)
            found = [r for r in all_data.get("items", []) if str(r.get("id")) == str(id) or str(r.get("rawId")) == str(id)]
            return {"data": found}
        result = AboutAdminService.get_all_about_records(
            db=db,
            category=category,
            subtopic=subtopic,
            table_name=db_table,
            language=language,
            status=status,
            search=search,
            sort=eff_sort,
            page=page,
            page_size=limit
        )
        return {
            "data": result.get("items", []),
            "total": result.get("total", 0),
            "page": page,
            "totalPages": result.get("totalPages", 1),
            "categoryCounts": result.get("categoryCounts", {})
        }

    if table == "audit_reports":
        if id:
            rep = ReportsService.get_audit_report_by_id(str(id))
            return {"data": [rep] if rep else []}

        result = ReportsService.get_audit_reports(
            page=page,
            page_size=limit,
            query=search if (not searchCol or searchCol in ("title", "title_en", "overview", "desc")) else "",
            sector=search if searchCol == "sector" else "",
            sort=eff_sort,
        )
        formatted = []
        for item in result.get("items", []):
            formatted.append({
                "id": item.get("id"),
                "rawId": item.get("id"),
                "title_en": item.get("title"),
                "title_hi": item.get("title_hi", item.get("title")),
                "year_of_report": item.get("year"),
                "report_type": item.get("report_type"),
                "sector": item.get("sector"),
                "level": item.get("level", "Union"),
                "image": item.get("image"),
                "desc": item.get("overview") or item.get("desc"),
                "pdf_url": item.get("pdf_url"),
                "is_active": True,
            })
        return {
            "data": formatted,
            "total": result.get("total", 0),
            "page": page,
            "totalPages": result.get("total_pages", 1)
        }

    if table in ("state_accounts", "state_accounts_report"):
        if id:
            item = ReportsService.get_state_account_by_id(str(id))
            return {"data": [item] if item else []}
        result = ReportsService.get_state_accounts(
            page=page,
            page_size=limit,
            query=search or "",
            sort=eff_sort,
        )
        return {
            "data": result.get("items", []),
            "total": result.get("total", 0),
            "page": page,
            "totalPages": result.get("total_pages", 1)
        }

    if table == "combined_accounts":
        if id:
            item = ReportsService.get_combined_account_by_id(str(id))
            return {"data": [item] if item else []}
        result = ReportsService.get_combined_accounts(
            page=page,
            page_size=limit,
            query=search or "",
            sort=eff_sort,
        )
        return {
            "data": result.get("items", []),
            "total": result.get("total", 0),
            "page": page,
            "totalPages": result.get("total_pages", 1)
        }

    if table == "pages":
        from app.services.pages_service import SEED_PAGES, PagesService
        if id:
            page_item = PagesService.get_page_by_slug_or_id(str(id), db=db)
            return {"data": [page_item] if page_item else []}
        page_list = []
        for pid, pdata in SEED_PAGES.items():
            page_list.append({
                "id": pdata["id"],
                "slug": pdata["slug"],
                "title_en": pdata["title_en"],
                "title_hi": pdata.get("title_hi", ""),
                "section": "About Us",
                "is_active": True
            })
        return {
            "data": page_list,
            "total": len(page_list),
            "page": 1,
            "totalPages": 1
        }

    if table == "former_cag":
        from app.services.former_cag_service import FormerCagService
        cags = FormerCagService.get_former_cags(db=db)
        if id:
            found = [c for c in cags if str(c.get("id")) == str(id)]
            return {"data": found}
        return {
            "data": cags,
            "total": len(cags),
            "page": 1,
            "totalPages": 1
        }

    if table == "organisation_chart":
        from app.services.organisation_chart_service import OrganisationChartService
        chart = OrganisationChartService.get_organisation_chart(db=db)
        officers = chart.get("officers", [])
        if id:
            found = [o for o in officers if str(o.get("id")) == str(id)]
            return {"data": found}
        return {
            "data": officers,
            "total": len(officers),
            "page": 1,
            "totalPages": 1
        }

    items = MOCK_MODULE_STORE.get(table, [])
    
    if id:
        found = [item for item in items if str(item.get("id")) == str(id)]
        return {"data": found}

    if search and searchCol:
        items = [
            item for item in items 
            if search.lower() in str(item.get(searchCol, "")).lower()
        ]

    total = len(items)
    start = (page - 1) * limit
    end = start + limit
    paginated = items[start:end]

    return {
        "data": paginated,
        "total": total,
        "page": page,
        "totalPages": (total + limit - 1) // limit if limit > 0 else 1
    }

@router.post("")
async def create_crud(
    request: Request,
    table: str = Query(...),
    db: Session = Depends(get_db)
):
    body = await request.json()
    data = body.get("data", body)
    
    if not table or not data:
        raise HTTPException(status_code=400, detail="Table and data are required")

    if table == "audit_reports":
        saved = ReportsService.save_local_report(data)
        record_id = str(saved.get("id"))
    elif table in ("state_accounts", "state_accounts_report"):
        saved = ReportsService.save_local_state_account(data)
        record_id = str(saved.get("id"))
    elif table == "combined_accounts":
        saved = ReportsService.save_local_combined_account(data)
        record_id = str(saved.get("id"))
    elif table in ("about", "about_us", "about_records"):
        from app.services.about_service import AboutAdminService
        saved = AboutAdminService.save_about_record(data, db=db)
        record_id = str(saved.get("rawId") or saved.get("id") or uuid.uuid4())
    else:
        record_id = str(uuid.uuid4())
        data["id"] = record_id
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()

        if table not in MOCK_MODULE_STORE:
            MOCK_MODULE_STORE[table] = []
        
        MOCK_MODULE_STORE[table].append(data)

    # Audit log
    audit_entry = AdminAuditLog(
        id=str(uuid.uuid4()),
        user_id="2",
        action="CREATE",
        table_name=table,
        record_id=record_id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        new_data=json.dumps({"fields": list(data.keys())})
    )
    db.add(audit_entry)
    db.commit()

    return {"success": True, "id": record_id}

@router.put("")
async def update_crud(
    request: Request,
    table: str = Query(...),
    id: str = Query(...),
    db: Session = Depends(get_db)
):
    body = await request.json()
    data = body.get("data", body)

    if not table or not id or not data:
        raise HTTPException(status_code=400, detail="Table, ID and data are required")

    if table == "audit_reports":
        data["id"] = str(id)
        ReportsService.save_local_report(data)
    elif table in ("state_accounts", "state_accounts_report"):
        data["id"] = str(id)
        ReportsService.save_local_state_account(data)
    elif table == "combined_accounts":
        data["id"] = str(id)
        ReportsService.save_local_combined_account(data)
    elif table in ("about", "about_us", "about_records"):
        from app.services.about_service import AboutAdminService
        AboutAdminService.save_about_record({**data, "rawId": id}, db=db)
    else:
        items = MOCK_MODULE_STORE.get(table, [])
        found_idx = -1
        for idx, item in enumerate(items):
            if str(item.get("id")) == str(id):
                found_idx = idx
                break

        if found_idx == -1:
            data["id"] = id
            data["updated_at"] = datetime.utcnow().isoformat()
            if table not in MOCK_MODULE_STORE:
                MOCK_MODULE_STORE[table] = []
            MOCK_MODULE_STORE[table].append(data)
        else:
            updated_item = {**items[found_idx], **data, "id": id, "updated_at": datetime.utcnow().isoformat()}
            MOCK_MODULE_STORE[table][found_idx] = updated_item

    # Audit log
    audit_entry = AdminAuditLog(
        id=str(uuid.uuid4()),
        user_id="2",
        action="UPDATE",
        table_name=table,
        record_id=id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        new_data=json.dumps({"updated_fields": list(data.keys())})
    )
    db.add(audit_entry)
    db.commit()

    return {"success": True}

@router.delete("")
async def delete_crud(
    request: Request,
    table: str = Query(...),
    id: str = Query(...),
    db: Session = Depends(get_db)
):
    if not table or not id:
        raise HTTPException(status_code=400, detail="Table and ID are required")

    if table == "audit_reports":
        ReportsService.delete_local_report(str(id))
    elif table in ("state_accounts", "state_accounts_report"):
        ReportsService.delete_local_state_account(str(id))
    elif table == "combined_accounts":
        ReportsService.delete_local_combined_account(str(id))
    elif table in ("about", "about_us", "about_records"):
        from app.services.about_service import AboutAdminService
        AboutAdminService.delete_about_record(str(id), db=db)
    else:
        items = MOCK_MODULE_STORE.get(table, [])
        MOCK_MODULE_STORE[table] = [item for item in items if str(item.get("id")) != str(id)]

    # Audit log
    audit_entry = AdminAuditLog(
        id=str(uuid.uuid4()),
        user_id="2",
        action="DELETE",
        table_name=table,
        record_id=id,
        ip_address=request.client.host if request.client else "127.0.0.1",
        old_data=json.dumps({"deleted_id": id})
    )
    db.add(audit_entry)
    db.commit()

    return {"success": True}


# Path-based routes for /api/admin/{table_name}
@router.get("/{table_name}")
async def list_by_path(
    table_name: str,
    page: int = Query(1),
    limit: int = Query(50),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return await list_or_get_crud(table=table_name, page=page, limit=limit, search=search, db=db)


@router.get("/{table_name}/{record_id}")
async def get_by_path(
    table_name: str,
    record_id: str,
    db: Session = Depends(get_db)
):
    return await list_or_get_crud(table=table_name, id=record_id, db=db)


@router.post("/{table_name}")
async def create_by_path(
    table_name: str,
    request: Request,
    db: Session = Depends(get_db)
):
    return await create_crud(request=request, table=table_name, db=db)


@router.put("/{table_name}/{record_id}")
async def update_by_path(
    table_name: str,
    record_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    return await update_crud(request=request, table=table_name, id=record_id, db=db)


@router.delete("/{table_name}/{record_id}")
async def delete_by_path(
    table_name: str,
    record_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    return await delete_crud(request=request, table=table_name, id=record_id, db=db)


