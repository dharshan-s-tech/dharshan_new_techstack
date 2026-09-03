from fastapi import APIRouter, Query

router = APIRouter()

MOCK_OPTIONS = {
    "government_type_id": [
        {"value": "1", "label": "Union Government"},
        {"value": "2", "label": "State Government"},
        {"value": "3", "label": "Union Territory"}
    ],
    "state_id": [
        {"value": "1", "label": "Delhi"},
        {"value": "2", "label": "Maharashtra"},
        {"value": "3", "label": "Tamil Nadu"},
        {"value": "4", "label": "Karnataka"}
    ],
    "designation_id": [
        {"value": "1", "label": "Comptroller and Auditor General"},
        {"value": "2", "label": "Deputy Comptroller and Auditor General"},
        {"value": "3", "label": "Director General of Audit"}
    ],
    "issue_id": [
        {"value": "1", "label": "Vol 45 Issue 1 (2026)"},
        {"value": "2", "label": "Vol 44 Issue 4 (2025)"}
    ],
    "report_id": [
        {"value": "1", "label": "State Finances Audit Report 2025-26"},
        {"value": "2", "label": "Union Government Accounts Audit 2025-26"}
    ]
}

@router.get("")
async def get_options(type: str = Query(...)):
    return MOCK_OPTIONS.get(type, [])
