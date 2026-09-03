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
    db: Session = Depends(get_db)
):
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

    items = MOCK_MODULE_STORE.get(table, [])
    found_idx = -1
    for idx, item in enumerate(items):
        if str(item.get("id")) == str(id):
            found_idx = idx
            break

    if found_idx == -1:
        # Create item if not exists
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
