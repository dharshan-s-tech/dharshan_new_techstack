import os
import json
import logging
from fastapi import APIRouter, HTTPException, Query, Request, Depends
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db, engine

logger = logging.getLogger("uvicorn")

tenders_router = APIRouter()
admin_tenders_router = APIRouter()
circulars_router = APIRouter()
admin_circulars_router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)
TENDERS_FILE = os.path.join(DATA_DIR, "local_tenders.json")
CIRCULARS_FILE = os.path.join(DATA_DIR, "local_circulars.json")


def _parse_lang_json(val: Any, lang: str = "en") -> str:
    if not val:
        return ""
    if isinstance(val, dict):
        return val.get(lang) or val.get("default") or val.get("en") or ""
    if isinstance(val, str):
        s = val.strip()
        if s.startswith("{"):
            try:
                j = json.loads(s)
                return j.get(lang) or j.get("default") or j.get("en") or ""
            except Exception:
                pass
        return s
    return str(val)


# ==================== TENDERS ====================
@tenders_router.get("")
@tenders_router.get("/")
@admin_tenders_router.get("")
@admin_tenders_router.get("/")
async def get_tenders(
    page: int = 1,
    limit: int = 50,
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        if status == "active":
            where_clauses = ["status = 1"]
        elif status == "inactive":
            where_clauses = ["status = 0"]
        elif status == "all":
            where_clauses = ["1=1"]
        else:
            where_clauses = ["status = 1"]
        params = {}
        if search and isinstance(search, str) and search.strip():
            where_clauses.append("(tender_title ILIKE :search OR tender_refrence_no ILIKE :search)")
            params["search"] = f"%{search.strip()}%"

        where_sql = " AND ".join(where_clauses)
        offset = (page - 1) * limit
        params["limit"] = limit
        params["offset"] = offset

        q = text(f"""
            SELECT id, tender_title, tender_refrence_no, uploads, 
                   submission_date, tender_last_date, status, created, modified
            FROM cag_revamp.tenders
            WHERE {where_sql}
            ORDER BY id DESC
            LIMIT :limit OFFSET :offset;
        """)
        rows = db.execute(q, params).mappings().fetchall()
        if rows:
            items = []
            for r in rows:
                t_en = _parse_lang_json(r["tender_title"], "en")
                t_hi = _parse_lang_json(r["tender_title"], "hi")
                closing = str(r["submission_date"] or r["tender_last_date"] or "").split(" ")[0]
                up = r["uploads"] or ""
                file_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/tender/{up}" if up else ""
                items.append({
                    "id": r["id"],
                    "rawId": f"tender-{r['id']}",
                    "title": t_en or "Tender Notice",
                    "title_en": t_en or "Tender Notice",
                    "title_hi": t_hi,
                    "reference_no": r["tender_refrence_no"] or f"CAG/TENDER/{r['id']}",
                    "tenderNo": r["tender_refrence_no"] or f"CAG/TENDER/{r['id']}",
                    "closing_date": closing or "Open",
                    "closingDate": closing or "Open",
                    "tender_file_url": file_url,
                    "docUrl": file_url,
                    "file_name": up,
                    "status": "Active" if r["status"] == 1 else "Inactive",
                    "is_active": r["status"] == 1,
                    "created_at": str(r["created"] or ""),
                    "modified_at": str(r["modified"] or "")
                })
            return items
    except Exception as e:
        logger.warning(f"[Tenders] DB query failed ({e}), using local file fallback.")

    return []


@tenders_router.post("")
@tenders_router.post("/")
@admin_tenders_router.post("")
@admin_tenders_router.post("/")
async def create_tender(payload: Dict[str, Any], db: Session = Depends(get_db)):
    title_en = payload.get("title_en") or payload.get("title") or "Tender Notice"
    title_hi = payload.get("title_hi") or ""
    ref_no = payload.get("reference_no") or payload.get("tenderNo") or "CAG/TENDER"
    upload_file = payload.get("file_name") or payload.get("uploads") or ""
    is_active = 1 if payload.get("is_active", True) else 0

    title_val = title_en
    if title_hi:
        title_val = json.dumps({"default": title_en, "en": title_en, "hi": title_hi}, ensure_ascii=False)

    try:
        q = text("""
            INSERT INTO cag_revamp.tenders (
                tender_title, language, tender_refrence_no, file_title, uploads,
                status, created_by, created, updated_by, modified
            ) VALUES (
                :title, 'en', :ref_no, :title_en, :uploads,
                :status, 1, NOW(), 1, NOW()
            ) RETURNING id;
        """)
        new_id = db.execute(q, {
            "title": title_val,
            "ref_no": ref_no,
            "title_en": title_en,
            "uploads": upload_file,
            "status": is_active
        }).scalar()
        db.commit()
        return {"success": True, "id": new_id, "rawId": f"tender-{new_id}"}
    except Exception as e:
        db.rollback()
        logger.error(f"[Tenders] Create tender failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@tenders_router.put("/{tender_id}")
@admin_tenders_router.put("/{tender_id}")
async def update_tender(tender_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    title_en = payload.get("title_en") or payload.get("title")
    title_hi = payload.get("title_hi")
    ref_no = payload.get("reference_no") or payload.get("tenderNo")
    upload_file = payload.get("file_name") or payload.get("uploads")
    is_active = 1 if payload.get("is_active", True) else 0

    clean_id = tender_id.replace("tender-", "")
    if clean_id.isdigit():
        try:
            title_val = title_en
            if title_hi:
                title_val = json.dumps({"default": title_en, "en": title_en, "hi": title_hi}, ensure_ascii=False)

            q = text("""
                UPDATE cag_revamp.tenders
                SET tender_title = COALESCE(:title, tender_title),
                    tender_refrence_no = COALESCE(:ref_no, tender_refrence_no),
                    uploads = COALESCE(:uploads, uploads),
                    status = :status,
                    modified = NOW()
                WHERE id = :id;
            """)
            db.execute(q, {
                "id": int(clean_id),
                "title": title_val,
                "ref_no": ref_no,
                "uploads": upload_file,
                "status": is_active
            })
            db.commit()
            return {"success": True, "id": clean_id}
        except Exception as e:
            db.rollback()
            logger.error(f"[Tenders] Update tender failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    return {"success": True, "id": tender_id}


@tenders_router.delete("/{tender_id}")
@admin_tenders_router.delete("/{tender_id}")
async def delete_tender(tender_id: str, db: Session = Depends(get_db)):
    clean_id = tender_id.replace("tender-", "")
    if clean_id.isdigit():
        try:
            db.execute(text("UPDATE cag_revamp.tenders SET status = 0, modified = NOW() WHERE id = :id;"), {"id": int(clean_id)})
            db.commit()
            return {"success": True, "id": clean_id}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    return {"success": True, "id": tender_id}


# ==================== CIRCULARS ====================
@circulars_router.get("")
@circulars_router.get("/")
@admin_circulars_router.get("")
@admin_circulars_router.get("/")
async def get_circulars(
    page: int = 1,
    limit: int = 50,
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        if status == "active":
            where_clauses = ["status = 1"]
        elif status == "inactive":
            where_clauses = ["status = 0"]
        elif status == "all":
            where_clauses = ["1=1"]
        else:
            where_clauses = ["status = 1"]
        params = {}
        if search and isinstance(search, str) and search.strip():
            where_clauses.append("(title ILIKE :search OR circular_reference_no ILIKE :search)")
            params["search"] = f"%{search.strip()}%"

        where_sql = " AND ".join(where_clauses)
        offset = (page - 1) * limit
        params["limit"] = limit
        params["offset"] = offset

        q = text(f"""
            SELECT id, title, circular_reference_no, upload_file, circular_order_date,
                   status, created_at, updated_at
            FROM cag_revamp.circulars
            WHERE {where_sql}
            ORDER BY id DESC
            LIMIT :limit OFFSET :offset;
        """)
        rows = db.execute(q, params).mappings().fetchall()
        if rows:
            items = []
            for r in rows:
                t_en = _parse_lang_json(r["title"], "en")
                t_hi = _parse_lang_json(r["title"], "hi")
                dt = str(r["circular_order_date"] or "").split(" ")[0]
                up = r["upload_file"] or ""
                file_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/circular/{up}" if up else ""
                items.append({
                    "id": r["id"],
                    "rawId": f"circ-{r['id']}",
                    "title": t_en or "Circular Notice",
                    "title_en": t_en or "Circular Notice",
                    "title_hi": t_hi,
                    "circular_no": r["circular_reference_no"] or f"CAG/CIR/{r['id']}",
                    "refNo": r["circular_reference_no"] or f"CAG/CIR/{r['id']}",
                    "date": dt or "2026",
                    "issue_date": dt or "2026",
                    "file_url": file_url,
                    "docUrl": file_url,
                    "file_name": up,
                    "status": "Active" if r["status"] == 1 else "Inactive",
                    "is_active": r["status"] == 1,
                    "created_at": str(r["created_at"] or ""),
                    "modified_at": str(r["updated_at"] or "")
                })
            return items
    except Exception as e:
        logger.warning(f"[Circulars] DB query failed ({e}), using fallback.")

    return []


@circulars_router.post("")
@circulars_router.post("/")
@admin_circulars_router.post("")
@admin_circulars_router.post("/")
async def create_circular(payload: Dict[str, Any], db: Session = Depends(get_db)):
    title_en = payload.get("title_en") or payload.get("title") or "Circular Notice"
    title_hi = payload.get("title_hi") or ""
    ref_no = payload.get("circular_no") or payload.get("refNo") or "CAG/CIR"
    upload_file = payload.get("file_name") or payload.get("upload_file") or ""
    is_active = 1 if payload.get("is_active", True) else 0

    title_val = title_en
    if title_hi:
        title_val = json.dumps({"default": title_en, "en": title_en, "hi": title_hi}, ensure_ascii=False)

    try:
        q = text("""
            INSERT INTO cag_revamp.circulars (
                title, language, circular_reference_no, upload_file,
                status, created_by, created_at, updated_by, updated_at
            ) VALUES (
                :title, 'en', :ref_no, :uploads,
                :status, 1, NOW(), 1, NOW()
            ) RETURNING id;
        """)
        new_id = db.execute(q, {
            "title": title_val,
            "ref_no": ref_no,
            "uploads": upload_file,
            "status": is_active
        }).scalar()
        db.commit()
        return {"success": True, "id": new_id, "rawId": f"circ-{new_id}"}
    except Exception as e:
        db.rollback()
        logger.error(f"[Circulars] Create circular failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@circulars_router.put("/{circular_id}")
@admin_circulars_router.put("/{circular_id}")
async def update_circular(circular_id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    title_en = payload.get("title_en") or payload.get("title")
    title_hi = payload.get("title_hi")
    ref_no = payload.get("circular_no") or payload.get("refNo")
    upload_file = payload.get("file_name") or payload.get("upload_file")
    is_active = 1 if payload.get("is_active", True) else 0

    clean_id = circular_id.replace("circ-", "")
    if clean_id.isdigit():
        try:
            title_val = title_en
            if title_hi:
                title_val = json.dumps({"default": title_en, "en": title_en, "hi": title_hi}, ensure_ascii=False)

            q = text("""
                UPDATE cag_revamp.circulars
                SET title = COALESCE(:title, title),
                    circular_reference_no = COALESCE(:ref_no, circular_reference_no),
                    upload_file = COALESCE(:uploads, upload_file),
                    status = :status,
                    updated_at = NOW()
                WHERE id = :id;
            """)
            db.execute(q, {
                "id": int(clean_id),
                "title": title_val,
                "ref_no": ref_no,
                "uploads": upload_file,
                "status": is_active
            })
            db.commit()
            return {"success": True, "id": clean_id}
        except Exception as e:
            db.rollback()
            logger.error(f"[Circulars] Update circular failed: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    return {"success": True, "id": circular_id}


@circulars_router.delete("/{circular_id}")
@admin_circulars_router.delete("/{circular_id}")
async def delete_circular(circular_id: str, db: Session = Depends(get_db)):
    clean_id = circular_id.replace("circ-", "")
    if clean_id.isdigit():
        try:
            db.execute(text("UPDATE cag_revamp.circulars SET status = 0, updated_at = NOW() WHERE id = :id;"), {"id": int(clean_id)})
            db.commit()
            return {"success": True, "id": clean_id}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    return {"success": True, "id": circular_id}
