from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.schemas.state import StateSubsiteResponse, StateSubsiteBase

router = APIRouter()

STATE_SUBSITES_DB: Dict[str, Dict[str, Any]] = {
    "andhra-pradesh": {
        "id": "ap-1",
        "slug": "andhra-pradesh",
        "state_name": "Andhra Pradesh",
        "office_title": "Principal Accountant General (A&E), Andhra Pradesh, Vijayawada",
        "pension_title": "About Pension",
        "pension_desc": "The PAG (A&E) authorises the pensionary benefits for the following categories: 1. State Government employees covered under the AP RPR Rules, 1980 2. AIS officers borne on the Andhra Pradesh cadre (excepting those who have opted to receive their pensions from the Central Pension Payment Authority). 3. Constitutional authorities such as Hon'ble Judges of the AP High Court, Lok Ayukta and AP Administrative Tribunal, Members of AP Public Service Commission 4. Political (Freedom Fighters) Pensions",
        "pension_case_status_date": "10/06/2026",
        "gpf_title": "About General Provident Fund",
        "gpf_desc": "The Principal Accountant General (A&E) maintains the individual GPF accounts of nearly 2.29 lakh employees of the AP State Governments as per the rules and procedures contained in the GPF (AP) Rules 1935 and AIS (PF) Rules 1955 respectively. The Provident Fund Group in the Office is headed by an IA & AS Officer in the rank of Deputy Accountant General who is assisted by Accounts Officers.",
        "account_title": "Account",
        "account_desc": "The Accounts Group of this office is headed by an IA & AS officer of the rank of Deputy Accountant General (DAG/Sr.DAG). The accounts of the Government of Andhra Pradesh are compiled based on the initial accounts rendered by 13 Districts...",
        "account_cards": [
            {"id": "ac-1", "title": "Monthly Key Indicators", "url": "/Reports"},
            {"id": "ac-2", "title": "Appropriation Accounts", "url": "/Reports"},
            {"id": "ac-3", "title": "Finance Account", "url": "/Reports"},
            {"id": "ac-4", "title": "Accounts at a Glance", "url": "/Reports"}
        ],
        "quick_links": [
            {"id": "ql-1", "title": "Pension Adalat in Amritsar on 09/03/2026 and in Ferozepur on 10/03/2026", "url": "/Resources"},
            {"id": "ql-2", "title": "National Online Essay Writing Competition 2025", "url": "/Resources"},
            {"id": "ql-3", "title": "Location of AG Office for essay writing competition", "url": "/Resources"},
            {"id": "ql-4", "title": "National Essay Writing Competition 2024", "url": "/Resources"}
        ],
        "whats_new": [
            {"id": "wn-1", "date": "24 Jun", "title": "25 Split Air Conditioner", "url": "/#news-events-heading"},
            {"id": "wn-2", "date": "24 Jun", "title": "Purchase & Installation of CCTV Camera", "url": "/#news-events-heading"},
            {"id": "wn-3", "date": "03 Oct", "title": "Bid for Mobile Storage Compactors (Q3)", "url": "/#news-events-heading"},
            {"id": "wn-4", "date": "14 May", "title": "Public Notice regarding Pension Adalat", "url": "/#news-events-heading"}
        ]
    }
}

@router.get("", response_model=List[StateSubsiteResponse])
async def get_all_state_subsites():
    """Get list of all configured state subsites"""
    return list(STATE_SUBSITES_DB.values())

@router.get("/{state_slug}", response_model=StateSubsiteResponse)
async def get_state_subsite(state_slug: str):
    """Get state subsite details by slug (e.g. andhra-pradesh)"""
    state_data = STATE_SUBSITES_DB.get(state_slug.lower())
    if not state_data:
        return {
            "id": f"state-{state_slug}",
            "slug": state_slug,
            "state_name": state_slug.replace("-", " ").title(),
            "office_title": f"Principal Accountant General (A&E), {state_slug.replace('-', ' ').title()}",
            "pension_title": "About Pension",
            "pension_desc": "State Government employees covered under local RPR rules.",
            "pension_case_status_date": "10/06/2026",
            "gpf_title": "About General Provident Fund",
            "gpf_desc": "Maintains individual GPF accounts for state government employees.",
            "account_title": "Account",
            "account_desc": "Accounts compiled from initial district accounts.",
            "account_cards": [
                {"id": "ac-1", "title": "Monthly Key Indicators", "url": "/Reports"},
                {"id": "ac-2", "title": "Appropriation Accounts", "url": "/Reports"},
                {"id": "ac-3", "title": "Finance Account", "url": "/Reports"},
                {"id": "ac-4", "title": "Accounts at a Glance", "url": "/Reports"}
            ],
            "quick_links": [],
            "whats_new": []
        }
    return state_data

@router.put("/{state_slug}", response_model=StateSubsiteResponse)
async def update_state_subsite(state_slug: str, payload: StateSubsiteBase):
    """Update or create a state subsite page from Admin panel"""
    data = payload.dict()
    data["id"] = STATE_SUBSITES_DB.get(state_slug, {}).get("id", f"state-{state_slug}")
    STATE_SUBSITES_DB[state_slug.lower()] = data
    return data
