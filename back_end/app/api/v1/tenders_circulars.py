import os
import json
import logging
from fastapi import APIRouter, HTTPException, Query, Request
from typing import Optional, Dict, Any, List

logger = logging.getLogger("uvicorn")

tenders_router = APIRouter()
admin_tenders_router = APIRouter()
circulars_router = APIRouter()
admin_circulars_router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)
TENDERS_FILE = os.path.join(DATA_DIR, "local_tenders.json")
CIRCULARS_FILE = os.path.join(DATA_DIR, "local_circulars.json")

DEFAULT_TENDERS = [
    {
        "id": 1,
        "rawId": "tender-1",
        "title_en": "Supply, Installation and Commissioning of IT Hardware and Network Equipment",
        "title_hi": "आईटी हार्डवेयर और नेटवर्क उपकरणों की आपूर्ति, स्थापना और कमीशनिंग",
        "reference_no": "CAG/IT/2026/04/HW-01",
        "closing_date": "2026-07-15",
        "tender_file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    },
    {
        "id": 2,
        "rawId": "tender-2",
        "title_en": "Annual Maintenance Contract for Data Center Infrastructure at CAG Headquarters",
        "title_hi": "कैग मुख्यालय में डेटा सेंटर अवसंरचना के लिए वार्षिक रखरखाव अनुबंध",
        "reference_no": "CAG/DC/AMC/2026/08",
        "closing_date": "2026-08-01",
        "tender_file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    }
]

DEFAULT_CIRCULARS = [
    {
        "id": 1,
        "rawId": "circ-1",
        "title_en": "Guidelines on Preparation of State Finance Accounts and Appropriation Accounts 2025-26",
        "title_hi": "राज्य वित्त खाते और विनियोग खाते 2025-26 की तैयारी पर दिशानिर्देश",
        "circular_no": "CAG/A&E/2026/CIR-01",
        "date": "2026-05-15",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    },
    {
        "id": 2,
        "rawId": "circ-2",
        "title_en": "Standard Operating Procedure for Compliance Audit and Field Inspections 2026",
        "title_hi": "अनुपालन लेखापरीक्षा और क्षेत्रीय निरीक्षण 2026 के लिए मानक संचालन प्रक्रिया",
        "circular_no": "CAG/AUD/SOP/2026/12",
        "date": "2026-06-01",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    }
]

def _load_data(path: str, default: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return list(default)

def _save_data(path: str, data: List[Dict[str, Any]]):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ==================== TENDERS ====================
@tenders_router.get("")
@tenders_router.get("/")
@admin_tenders_router.get("")
@admin_tenders_router.get("/")
async def get_tenders():
    items = _load_data(TENDERS_FILE, DEFAULT_TENDERS)
    return [i for i in items if not i.get("is_deleted")]

@tenders_router.post("")
@tenders_router.post("/")
@admin_tenders_router.post("")
@admin_tenders_router.post("/")
async def create_tender(payload: Dict[str, Any]):
    items = _load_data(TENDERS_FILE, DEFAULT_TENDERS)
    new_id = payload.get("id") or (max([int(i.get("id", 0)) for i in items if str(i.get("id")).isdigit()] or [0]) + 1)
    payload["id"] = new_id
    payload["rawId"] = f"tender-{new_id}"
    items.insert(0, payload)
    _save_data(TENDERS_FILE, items)
    return {"success": True, "id": new_id, "rawId": f"tender-{new_id}"}

@tenders_router.put("/{tender_id}")
@admin_tenders_router.put("/{tender_id}")
async def update_tender(tender_id: str, payload: Dict[str, Any]):
    items = _load_data(TENDERS_FILE, DEFAULT_TENDERS)
    for idx, item in enumerate(items):
        if str(item.get("id")) == str(tender_id) or str(item.get("rawId")) == str(tender_id):
            items[idx] = {**item, **payload, "id": item.get("id")}
            _save_data(TENDERS_FILE, items)
            return {"success": True, "id": tender_id}
    payload["id"] = tender_id
    items.insert(0, payload)
    _save_data(TENDERS_FILE, items)
    return {"success": True, "id": tender_id}

@tenders_router.delete("/{tender_id}")
@admin_tenders_router.delete("/{tender_id}")
async def delete_tender(tender_id: str):
    items = _load_data(TENDERS_FILE, DEFAULT_TENDERS)
    for idx, item in enumerate(items):
        if str(item.get("id")) == str(tender_id) or str(item.get("rawId")) == str(tender_id):
            items[idx]["is_deleted"] = True
            _save_data(TENDERS_FILE, items)
            return {"success": True, "id": tender_id}
    return {"success": True, "id": tender_id}

# ==================== CIRCULARS ====================
@circulars_router.get("")
@circulars_router.get("/")
@admin_circulars_router.get("")
@admin_circulars_router.get("/")
async def get_circulars():
    items = _load_data(CIRCULARS_FILE, DEFAULT_CIRCULARS)
    return [i for i in items if not i.get("is_deleted")]

@circulars_router.post("")
@circulars_router.post("/")
@admin_circulars_router.post("")
@admin_circulars_router.post("/")
async def create_circular(payload: Dict[str, Any]):
    items = _load_data(CIRCULARS_FILE, DEFAULT_CIRCULARS)
    new_id = payload.get("id") or (max([int(i.get("id", 0)) for i in items if str(i.get("id")).isdigit()] or [0]) + 1)
    payload["id"] = new_id
    payload["rawId"] = f"circ-{new_id}"
    items.insert(0, payload)
    _save_data(CIRCULARS_FILE, items)
    return {"success": True, "id": new_id, "rawId": f"circ-{new_id}"}

@circulars_router.put("/{circular_id}")
@admin_circulars_router.put("/{circular_id}")
async def update_circular(circular_id: str, payload: Dict[str, Any]):
    items = _load_data(CIRCULARS_FILE, DEFAULT_CIRCULARS)
    for idx, item in enumerate(items):
        if str(item.get("id")) == str(circular_id) or str(item.get("rawId")) == str(circular_id):
            items[idx] = {**item, **payload, "id": item.get("id")}
            _save_data(CIRCULARS_FILE, items)
            return {"success": True, "id": circular_id}
    payload["id"] = circular_id
    items.insert(0, payload)
    _save_data(CIRCULARS_FILE, items)
    return {"success": True, "id": circular_id}

@circulars_router.delete("/{circular_id}")
@admin_circulars_router.delete("/{circular_id}")
async def delete_circular(circular_id: str):
    items = _load_data(CIRCULARS_FILE, DEFAULT_CIRCULARS)
    for idx, item in enumerate(items):
        if str(item.get("id")) == str(circular_id) or str(item.get("rawId")) == str(circular_id):
            items[idx]["is_deleted"] = True
            _save_data(CIRCULARS_FILE, items)
            return {"success": True, "id": circular_id}
    return {"success": True, "id": circular_id}
