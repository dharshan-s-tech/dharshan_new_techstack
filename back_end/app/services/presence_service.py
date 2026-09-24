import json
import re
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc, text, func

from app.models.presence import State, Department, WebsiteOffice
from app.services.user_management_service import clean_json_str


HINDI_STATE_TRANSLATIONS = {
    "Andhra Pradesh": "आंध्र प्रदेश",
    "Arunachal Pradesh": "अरुणाचल प्रदेश",
    "Assam": "असम",
    "Bihar": "बिहार",
    "Chhattisgarh": "छत्तीसगढ़",
    "Delhi": "दिल्ली",
    "Goa": "गोवा",
    "Gujarat": "गुजरात",
    "Haryana": "हरियाणा",
    "Himachal Pradesh": "हिमाचल प्रदेश",
    "Jammu and Kashmir": "जम्मू और कश्मीर",
    "Jammu and Kashmir State (Upto 30-Oct-2019)": "जम्मू और कश्मीर",
    "Jammu and Kashmir UT (31-Oct-2019 Onwards)": "जम्मू और कश्मीर",
    "Jharkhand": "झारखंड",
    "Karnataka": "कर्नाटक",
    "Kerala": "केरल",
    "Madhya Pradesh": "मध्य प्रदेश",
    "Maharashtra": "महाराष्ट्र",
    "Manipur": "मणिपुर",
    "Meghalaya": "मेघालय",
    "Mizoram": "मिजोरम",
    "Nagaland": "नागालैंड",
    "Odisha": "ओडिशा",
    "Punjab": "पंजाब",
    "Rajasthan": "राजस्थान",
    "Sikkim": "सिक्किम",
    "Tamil Nadu": "तमिलनाडु",
    "Telangana": "तेलंगाना",
    "Tripura": "त्रिपुरा",
    "Uttar Pradesh": "उत्तर प्रदेश",
    "Uttarakhand": "उत्तराखंड",
    "West Bengal": "पश्चिम बंगाल",
    "Pondicherry": "पुडुचेरी",
    "Puducherry": "पुडुचेरी",
    "Ladakh": "लद्दाख",
    "Ladakh (UT)": "लद्दाख",
    "Chandigarh": "चंडीगढ़",
    "Chandigarh (UT)": "चंडीगढ़"
}


class PresenceService:

    @staticmethod
    def get_all_presence_data(db: Session, language: str = "en") -> Dict[str, Any]:
        """
        Unified aggregator for the Our Presence module:
        - 28 States & 8 Union Territories
        - 151 Live CAG Field & Central Websites / Offices
        - 16 Department Classifications
        """
        all_states_rows = db.query(State).order_by(State.name.asc()).all()
        dept_rows = db.query(Department).filter(Department.status == 1).order_by(Department.id.asc()).all()
        websites_rows = db.query(WebsiteOffice).filter(WebsiteOffice.status == 1).order_by(WebsiteOffice.id.asc()).all()

        dept_map = {d.id: d for d in dept_rows}
        state_map = {s.id: s for s in all_states_rows}
        state_parent_map = {s.id: (s.parent_id or 0) for s in all_states_rows}

        # 1. Initialize State-Level Office Cards (Top Level States/UTs with parent_id == 0)
        # ---------------------------------------------------------------------------------
        state_cards_dict: Dict[int, Dict[str, Any]] = {}
        for s in all_states_rows:
            if s.parent_id and s.parent_id != 0:
                continue  # Skip sub-region records in top list

            s_name = s.name.strip()
            # Clean up display name
            disp_name = "Jammu and Kashmir" if "Jammu and Kashmir" in s_name else s_name
            hi_name = HINDI_STATE_TRANSLATIONS.get(s_name, HINDI_STATE_TRANSLATIONS.get(disp_name, disp_name))

            state_cards_dict[s.id] = {
                "id": str(s.id),
                "stateId": s.id,
                "name": disp_name,
                "nameHindi": hi_name,
                "slug": s.slug or disp_name.lower().replace(" ", "-"),
                "image": s.image or f"{disp_name.lower().replace(' ', '')}.png",
                "auditDetails": [],
                "aeDetails": []
            }

        # 2. Categorized Central Audit & Training Offices
        # ---------------------------------------------------------------------------------
        central_defense: List[Dict[str, Any]] = []
        central_railway: List[Dict[str, Any]] = []
        central_other: List[Dict[str, Any]] = []
        central_overseas: List[Dict[str, Any]] = []

        training_regional: List[Dict[str, Any]] = []
        training_iced: List[Dict[str, Any]] = []
        training_icisa: List[Dict[str, Any]] = []
        training_naaa: List[Dict[str, Any]] = []
        training_cdma: List[Dict[str, Any]] = []

        flat_offices: List[Dict[str, Any]] = []

        for w in websites_rows:
            title_clean = clean_json_str(w.title) or ""
            if not title_clean or w.id == 1:  # Skip main national CAG portal
                continue

            title_hi_clean = clean_json_str(w.title_hi) or title_clean
            dept = dept_map.get(w.department_id)
            state = state_map.get(w.state_id)
            dept_title = dept.title.strip() if dept else ""
            dept_slug = dept.slug if dept else ""
            state_name = state.name.strip() if state else (w.state_title or "")
            state_hi = HINDI_STATE_TRANSLATIONS.get(state_name, state_name)

            clean_url = w.url or ""
            if clean_url and not clean_url.startswith("http") and not clean_url.startswith("/"):
                clean_url = f"/{clean_url}"

            item_data = {
                "id": str(w.id),
                "title": title_clean,
                "title_hi": title_hi_clean,
                "name": title_clean,
                "name_hi": title_hi_clean,
                "url": clean_url,
                "email": w.email or "",
                "state_id": w.state_id,
                "state_name": state_name,
                "state_name_hi": state_hi,
                "department_id": w.department_id,
                "department_title": dept_title,
                "department_slug": dept_slug,
                "status": w.status,
                "logo": w.logo or "",
                "theme": w.theme or ""
            }

            # Resolve top parent state if assigned to sub-region
            eff_state_id = w.state_id
            visited = set()
            while eff_state_id and eff_state_id in state_parent_map and state_parent_map[eff_state_id] != 0:
                if eff_state_id in visited:
                    break
                visited.add(eff_state_id)
                eff_state_id = state_parent_map[eff_state_id]

            # ── State Audit & A&E Routing ──
            if w.department_id == 1:  # State Audit Offices
                item_data["type"] = "state"
                item_data["category"] = "audit"
                if eff_state_id and eff_state_id in state_cards_dict:
                    state_cards_dict[eff_state_id]["auditDetails"].append({
                        "id": str(w.id),
                        "label": title_clean,
                        "labelHindi": title_hi_clean,
                        "url": clean_url,
                        "email": w.email or ""
                    })
            elif w.department_id == 7:  # State Accounts & Entitlement (A&E) Offices
                item_data["type"] = "state"
                item_data["category"] = "ae"
                if eff_state_id and eff_state_id in state_cards_dict:
                    state_cards_dict[eff_state_id]["aeDetails"].append({
                        "id": str(w.id),
                        "label": title_clean,
                        "labelHindi": title_hi_clean,
                        "url": clean_url,
                        "email": w.email or ""
                    })

            # ── Central Audit Routing ──
            elif w.department_id == 9:  # Defence
                item_data["type"] = "central"
                item_data["category"] = "defense"
                central_defense.append(item_data)
            elif w.department_id == 6:  # Railway
                item_data["type"] = "central"
                item_data["category"] = "railway"
                central_railway.append(item_data)
            elif (
                w.department_id in (12, 13) 
                or "overseas" in dept_title.lower() 
                or "london" in dept_title.lower() 
                or "washington" in title_clean.lower() 
                or "kuala lumpur" in title_clean.lower() 
                or "/pda/" in clean_url 
                or (w.theme and w.theme.upper() in ('LDN', 'KUL', 'WDC', 'ROM', 'GVA'))
            ):
                item_data["type"] = "central"
                item_data["category"] = "overseas"

                # Generate dynamic local & external URLs based on DB data
                theme_upper = (w.theme or "").upper()
                if "london" in title_clean.lower() or "ldn" in clean_url.lower() or theme_upper == "LDN":
                    item_data["localUrl"] = "/states/overseas-london"
                    item_data["local_url"] = "/states/overseas-london"
                    item_data["externalUrl"] = "https://cag.gov.in/pda-london/en"
                    item_data["external_url"] = "https://cag.gov.in/pda-london/en"
                    if not title_hi_clean or title_hi_clean == title_clean:
                        item_data["title_hi"] = "प्रधान निदेशक लेखा परीक्षा, लंदन"
                        item_data["name_hi"] = "प्रधान निदेशक लेखा परीक्षा, लंदन"
                elif "washington" in title_clean.lower() or "wdc" in clean_url.lower() or theme_upper == "WDC":
                    item_data["localUrl"] = "/states/overseas-washington"
                    item_data["local_url"] = "/states/overseas-washington"
                    item_data["externalUrl"] = "https://cag.gov.in/pda-washington/en"
                    item_data["external_url"] = "https://cag.gov.in/pda-washington/en"
                    if not title_hi_clean or title_hi_clean == title_clean:
                        item_data["title_hi"] = "प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी"
                        item_data["name_hi"] = "प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी"
                elif "kuala" in title_clean.lower() or "kul" in clean_url.lower() or theme_upper == "KUL":
                    item_data["localUrl"] = "/states/overseas-kualalumpur"
                    item_data["local_url"] = "/states/overseas-kualalumpur"
                    item_data["externalUrl"] = "https://cag.gov.in/pda-kualalumpur/en"
                    item_data["external_url"] = "https://cag.gov.in/pda-kualalumpur/en"
                    if not title_hi_clean or title_hi_clean == title_clean:
                        item_data["title_hi"] = "प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर"
                        item_data["name_hi"] = "प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर"
                elif "rome" in title_clean.lower() or theme_upper == "ROM":
                    item_data["localUrl"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["local_url"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["externalUrl"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["external_url"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["is_pdf"] = True
                    item_data["file_size"] = "150 KB"
                elif "geneva" in title_clean.lower() or theme_upper == "GVA":
                    item_data["localUrl"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["local_url"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["externalUrl"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["external_url"] = "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf"
                    item_data["is_pdf"] = True
                    item_data["file_size"] = "100 KB"
                else:
                    item_data["localUrl"] = f"/states/{w.theme.lower() if w.theme else w.id}"
                    item_data["local_url"] = item_data["localUrl"]
                    item_data["externalUrl"] = f"https://cag.gov.in{clean_url}"
                    item_data["external_url"] = item_data["externalUrl"]

                central_overseas.append(item_data)
            elif w.department_id in (2, 8) or "commercial" in dept_title.lower() or "ministries" in dept_title.lower() or "/mab/" in clean_url:
                item_data["type"] = "central"
                item_data["category"] = "other"
                central_other.append(item_data)

            # ── Training Institutes Routing ──
            elif "iced" in title_clean.lower() or "environment audit" in title_clean.lower() or "/iced" in clean_url:
                item_data["type"] = "training"
                item_data["category"] = "iced"
                training_iced.append(item_data)
            elif "icisa" in title_clean.lower() or "information systems" in title_clean.lower() or "/icisa" in clean_url:
                item_data["type"] = "training"
                item_data["category"] = "icisa"
                training_icisa.append(item_data)
            elif "naaa" in title_clean.lower() or "national academy" in title_clean.lower() or "/naaa" in clean_url:
                item_data["type"] = "training"
                item_data["category"] = "naaa"
                training_naaa.append(item_data)
            elif "coefa" in title_clean.lower() or "cdma" in title_clean.lower() or "financial audit" in title_clean.lower() or "data management" in title_clean.lower() or "/coefa" in clean_url or "/journal" in clean_url:
                item_data["type"] = "training"
                item_data["category"] = "cdma"
                training_cdma.append(item_data)
            elif w.department_id == 5 or "/rti/" in clean_url or "regional" in title_clean.lower():
                item_data["type"] = "training"
                item_data["category"] = "regional"
                training_regional.append(item_data)
            else:
                item_data["type"] = "central"
                item_data["category"] = "other"
                central_other.append(item_data)

            flat_offices.append(item_data)

        # Ensure Rome and Geneva External Audit offices are included
        has_rome = any("rome" in (o.get("name") or "").lower() or (o.get("theme") or "").upper() == "ROM" for o in central_overseas)
        if not has_rome:
            rome_office = {
                "id": "ext-rome",
                "title": "Director of External Audit, Rome",
                "title_hi": "बाह्य लेखा परीक्षा निदेशक, रोम",
                "name": "Director of External Audit, Rome",
                "name_hi": "बाह्य लेखा परीक्षा निदेशक, रोम",
                "url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "localUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "local_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "externalUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "external_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "email": "",
                "state_id": None,
                "state_name": "Overseas",
                "state_name_hi": "विदेशी",
                "department_id": 13,
                "department_title": "Overseas Audit Offices",
                "department_slug": "overseas-audit-offices",
                "status": 1,
                "logo": "",
                "theme": "ROM",
                "type": "central",
                "category": "overseas",
                "is_pdf": True,
                "file_size": "150 KB"
            }
            central_overseas.append(rome_office)
            flat_offices.append(rome_office)

        has_geneva = any("geneva" in (o.get("name") or "").lower() or (o.get("theme") or "").upper() == "GVA" for o in central_overseas)
        if not has_geneva:
            geneva_office = {
                "id": "ext-geneva",
                "title": "Director of External Audit, Geneva",
                "title_hi": "बाह्य लेखा परीक्षा निदेशक, जिनेवा",
                "name": "Director of External Audit, Geneva",
                "name_hi": "बाह्य लेखा परीक्षा निदेशक, जिनेवा",
                "url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "localUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "local_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "externalUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "external_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "email": "",
                "state_id": None,
                "state_name": "Overseas",
                "state_name_hi": "विदेशी",
                "department_id": 13,
                "department_title": "Overseas Audit Offices",
                "department_slug": "overseas-audit-offices",
                "status": 1,
                "logo": "",
                "theme": "GVA",
                "type": "central",
                "category": "overseas",
                "is_pdf": True,
                "file_size": "100 KB"
            }
            central_overseas.append(geneva_office)
            flat_offices.append(geneva_office)

        # Sort state cards alphabetically
        sorted_state_cards = sorted(list(state_cards_dict.values()), key=lambda x: x["name"])

        return {
            "state_level_offices": sorted_state_cards,
            "central_audit_offices": {
                "defense": central_defense,
                "railway": central_railway,
                "other": central_other,
                "overseas": central_overseas
            },
            "training_institutes": {
                "regional": training_regional,
                "iced": training_iced,
                "icisa": training_icisa,
                "naaa": training_naaa,
                "cdma": training_cdma
            },
            "states": [
                {
                    "id": s.id,
                    "name": s.name,
                    "name_hi": HINDI_STATE_TRANSLATIONS.get(s.name, s.name),
                    "slug": s.slug,
                    "image": s.image
                } for s in all_states_rows if not s.parent_id
            ],
            "departments": [
                {
                    "id": d.id,
                    "title": d.title.strip(),
                    "slug": d.slug
                } for d in dept_rows
            ],
            "offices": flat_offices,
            "total_offices": len(flat_offices)
        }

    @staticmethod
    def get_state_offices(db: Session, filter_type: str = "audit") -> List[Dict[str, Any]]:
        """Returns list of state office cards with either auditDetails or aeDetails populated."""
        data = PresenceService.get_all_presence_data(db)
        return data.get("state_level_offices", [])

    @staticmethod
    def get_central_offices(db: Session, category: str = "defense") -> List[Dict[str, Any]]:
        """Returns list of central audit offices for a category: defense | railway | other | overseas."""
        data = PresenceService.get_all_presence_data(db)
        central_groups = data.get("central_audit_offices", {})
        cat_clean = category.lower().strip()
        return central_groups.get(cat_clean, central_groups.get("defense", []))

    @staticmethod
    def get_training_institutes(db: Session, category: str = "regional") -> List[Dict[str, Any]]:
        """Returns list of training institutes for a category: regional | iced | icisa | naaa | cdma."""
        data = PresenceService.get_all_presence_data(db)
        training_groups = data.get("training_institutes", {})
        cat_clean = category.lower().strip()
        return training_groups.get(cat_clean, training_groups.get("regional", []))

    @staticmethod
    def get_state_subsite_detail(db: Session, state_slug: str) -> Dict[str, Any]:
        """Returns full subsite configuration and active offices for a state (e.g. andhra-pradesh)."""
        slug_clean = state_slug.lower().strip()
        state = db.query(State).filter(or_(State.slug == slug_clean, State.name.ilike(slug_clean.replace("-", " ")))).first()
        
        state_name = state.name.strip() if state else slug_clean.replace("-", " ").title()
        state_hi = HINDI_STATE_TRANSLATIONS.get(state_name, state_name)
        state_id = state.id if state else None

        # Fetch child states too if any
        child_state_ids = [s.id for s in db.query(State.id).filter(State.parent_id == state_id).all()] if state_id else []
        all_query_ids = ([state_id] + child_state_ids) if state_id else []

        websites = db.query(WebsiteOffice).filter(
            WebsiteOffice.state_id.in_(all_query_ids),
            WebsiteOffice.status == 1
        ).all() if all_query_ids else []

        audit_offices = [clean_json_str(w.title) for w in websites if w.department_id == 1]
        ae_offices = [clean_json_str(w.title) for w in websites if w.department_id == 7]

        office_title = (
            ae_offices[0] if ae_offices else
            audit_offices[0] if audit_offices else
            f"Principal Accountant General (A&E), {state_name}"
        )

        return {
            "id": f"state-{slug_clean}",
            "slug": slug_clean,
            "state_name": state_name,
            "state_name_hi": state_hi,
            "state_id": state_id,
            "image": state.image if state else f"{slug_clean}.png",
            "office_title": office_title,
            "audit_offices": audit_offices,
            "ae_offices": ae_offices,
            "pension_title": "About Pension",
            "pension_desc": f"The PAG (A&E) authorises the pensionary benefits for State Government employees of {state_name}.",
            "pension_case_status_date": datetime.utcnow().strftime("%d/%m/%Y"),
            "gpf_title": "About General Provident Fund",
            "gpf_desc": f"Maintains individual GPF accounts for employees of the {state_name} Government.",
            "account_title": "Account",
            "account_desc": f"The accounts of the Government of {state_name} are compiled based on initial district accounts.",
            "account_cards": [
                {"id": "ac-1", "title": "Monthly Key Indicators", "url": "/Reports"},
                {"id": "ac-2", "title": "Appropriation Accounts", "url": "/Reports"},
                {"id": "ac-3", "title": "Finance Account", "url": "/Reports"},
                {"id": "ac-4", "title": "Accounts at a Glance", "url": "/Reports"}
            ],
            "quick_links": [
                {"id": "ql-1", "title": f"Pension Adalat / Grievance Redressal in {state_name}", "url": "/Resources"},
                {"id": "ql-2", "title": "National Online Essay Writing Competition", "url": "/Resources"},
                {"id": "ql-3", "title": f"Location of AG Office in {state_name}", "url": f"/Our-Presence/Index-Menu/State-Level-Offices?filter=ae"}
            ],
            "whats_new": [
                {"id": "wn-1", "date": datetime.utcnow().strftime("%d %b"), "title": f"Public Notice regarding {state_name} AG Office updates", "url": f"/Our-Presence/Index-Menu/State-Level-Offices?filter=audit"}
            ]
        }

    # ─────────────────────────────────────────────────────────────────────────────
    # ADMIN CRUD METHODS
    # ─────────────────────────────────────────────────────────────────────────────

    @staticmethod
    def get_offices_crud(
        db: Session,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        department_id: Optional[str] = None,
        state_id: Optional[str] = None,
        status: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        query = db.query(WebsiteOffice)

        office_type = kwargs.get("office_type") or kwargs.get("type")
        if office_type and str(office_type).lower() != "all":
            ot = str(office_type).lower().strip()
            if ot in ("overseas", "overseas_offices", "overseas-offices"):
                query = query.filter(
                    or_(
                        WebsiteOffice.department_id.in_([12, 13]),
                        WebsiteOffice.theme.in_(["LDN", "WDC", "KUL", "ROM", "GVA", "ldn", "wdc", "kul", "rom", "gva", "overseas"]),
                        WebsiteOffice.title.ilike("%overseas%"),
                        WebsiteOffice.title.ilike("%london%"),
                        WebsiteOffice.title.ilike("%washington%"),
                        WebsiteOffice.title.ilike("%kuala%"),
                        WebsiteOffice.title.ilike("%rome%"),
                        WebsiteOffice.title.ilike("%geneva%"),
                        WebsiteOffice.url.ilike("%/pda/%")
                    )
                )
            elif ot in ("ae", "a&e"):
                query = query.filter(WebsiteOffice.department_id == 1)
            elif ot == "audit":
                query = query.filter(WebsiteOffice.department_id == 4)
            elif ot in ("defence", "defense"):
                query = query.filter(WebsiteOffice.department_id == 3)
            elif ot == "railway":
                query = query.filter(WebsiteOffice.department_id == 7)
            elif ot in ("ministries", "other_ministries", "commercial"):
                query = query.filter(WebsiteOffice.department_id.in_([2, 8]))
            elif ot in ("rti", "rtis", "regional"):
                query = query.filter(WebsiteOffice.department_id == 5)
            elif ot == "iced":
                query = query.filter(or_(WebsiteOffice.title.ilike("%iced%"), WebsiteOffice.title.ilike("%environment%")))
            elif ot == "icisa":
                query = query.filter(or_(WebsiteOffice.title.ilike("%icisa%"), WebsiteOffice.title.ilike("%information%")))
            elif ot == "naaa":
                query = query.filter(or_(WebsiteOffice.title.ilike("%naaa%"), WebsiteOffice.title.ilike("%national academy%")))
            elif ot in ("ical", "coefa", "cdma"):
                query = query.filter(or_(WebsiteOffice.title.ilike("%ical%"), WebsiteOffice.title.ilike("%coefa%"), WebsiteOffice.title.ilike("%data management%")))

        if department_id and department_id != "all":
            try:
                query = query.filter(WebsiteOffice.department_id == int(department_id))
            except Exception:
                pass

        if state_id and state_id != "all":
            try:
                query = query.filter(WebsiteOffice.state_id == int(state_id))
            except Exception:
                pass

        if status and status != "all":
            if status in ("1", "active", "true"):
                query = query.filter(WebsiteOffice.status == 1)
            elif status in ("0", "inactive", "false"):
                query = query.filter(WebsiteOffice.status == 0)

        if search:
            s_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    WebsiteOffice.title.ilike(s_term),
                    WebsiteOffice.title_hi.ilike(s_term),
                    WebsiteOffice.state_title.ilike(s_term),
                    WebsiteOffice.url.ilike(s_term),
                    WebsiteOffice.email.ilike(s_term)
                )
            )

        query = query.order_by(asc(WebsiteOffice.id))
        total = query.count()
        rows = query.offset((page - 1) * limit).limit(limit).all()

        dept_map = {d.id: d.title.strip() for d in db.query(Department).all()}
        state_map = {s.id: s.name.strip() for s in db.query(State).all()}

        formatted = []
        for w in rows:
            clean_t = clean_json_str(w.title)
            clean_t_hi = clean_json_str(w.title_hi) or clean_t
            d_name = dept_map.get(w.department_id, f"Department #{w.department_id}")
            s_name = state_map.get(w.state_id, w.state_title or "National / Union")
            formatted.append({
                "id": str(w.id),
                "rawId": str(w.id),
                "parent_id": w.parent_id,
                "title": clean_t,
                "title_en": clean_t,
                "title_hi": clean_t_hi,
                "name_en": clean_t,
                "name_hi": clean_t_hi,
                "office_name_en": clean_t,
                "office_name_hi": clean_t_hi,
                "office_type": d_name,
                "state_title": w.state_title or "",
                "state_id": w.state_id,
                "state_name": s_name,
                "department_id": w.department_id,
                "department_name": d_name,
                "url": w.url or "",
                "email": w.email or "",
                "phone": "+91 (011) 2323 5790" if not w.email else w.email,
                "theme": w.theme or "",
                "logo": w.logo or "",
                "status": w.status,
                "is_active": w.status == 1,
                "is_system": w.is_system == 1,
                "created_at": w.created_at.isoformat() if w.created_at else None,
                "modified_at": w.modified_at.isoformat() if w.modified_at else None,
            })

        # Ensure Rome and Geneva exist in overseas listing
        if (office_type and str(office_type).lower() in ("overseas", "overseas_offices", "overseas-offices")) or (department_id in ("12", "13")):
            has_rome = any("rome" in (o.get("title") or "").lower() for o in formatted)
            if not has_rome:
                formatted.append({
                    "id": "ext-rome",
                    "rawId": "991",
                    "title": "Director of External Audit, Rome",
                    "title_en": "Director of External Audit, Rome",
                    "title_hi": "बाह्य लेखा परीक्षा निदेशक, रोम",
                    "name_en": "Director of External Audit, Rome",
                    "name_hi": "बाह्य लेखा परीक्षा निदेशक, रोम",
                    "office_type": "Overseas Audit Offices",
                    "department_id": 13,
                    "department_name": "Overseas Audit Offices",
                    "state_id": None,
                    "state_name": "Rome, Italy",
                    "url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                    "email": "audit.rome@mea.gov.in",
                    "phone": "+39 06 488 4642",
                    "theme": "ROM",
                    "status": 1,
                    "is_active": True
                })
            has_geneva = any("geneva" in (o.get("title") or "").lower() for o in formatted)
            if not has_geneva:
                formatted.append({
                    "id": "ext-geneva",
                    "rawId": "992",
                    "title": "Director of External Audit, Geneva",
                    "title_en": "Director of External Audit, Geneva",
                    "title_hi": "बाह्य लेखा परीक्षा निदेशक, जिनेवा",
                    "name_en": "Director of External Audit, Geneva",
                    "name_hi": "बाह्य लेखा परीक्षा निदेशक, जिनेवा",
                    "office_type": "Overseas Audit Offices",
                    "department_id": 13,
                    "department_name": "Overseas Audit Offices",
                    "state_id": None,
                    "state_name": "Geneva, Switzerland",
                    "url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                    "email": "audit.geneva@mea.gov.in",
                    "phone": "+41 22 906 8686",
                    "theme": "GVA",
                    "status": 1,
                    "is_active": True
                })

        return {
            "data": formatted,
            "total": total if not (office_type and str(office_type).lower() in ("overseas", "overseas_offices", "overseas-offices")) else len(formatted),
            "page": page,
            "totalPages": (total + limit - 1) // limit if limit > 0 else 1
        }

    @staticmethod
    def get_office_by_id(db: Session, office_id: str) -> Optional[Dict[str, Any]]:
        try:
            wid = int(office_id)
        except Exception:
            return None
        w = db.query(WebsiteOffice).filter(WebsiteOffice.id == wid).first()
        if not w:
            return None

        dept = db.query(Department).filter(Department.id == w.department_id).first() if w.department_id else None
        state = db.query(State).filter(State.id == w.state_id).first() if w.state_id else None

        return {
            "id": str(w.id),
            "rawId": str(w.id),
            "parent_id": w.parent_id,
            "title": clean_json_str(w.title),
            "title_hi": clean_json_str(w.title_hi) or clean_json_str(w.title),
            "state_title": w.state_title or "",
            "state_id": w.state_id,
            "state_name": state.name if state else w.state_title or "",
            "department_id": w.department_id,
            "department_name": dept.title.strip() if dept else "",
            "url": w.url or "",
            "email": w.email or "",
            "theme": w.theme or "",
            "logo": w.logo or "",
            "status": w.status,
            "is_active": w.status == 1,
            "is_system": w.is_system == 1,
            "created_at": w.created_at.isoformat() if w.created_at else None,
            "modified_at": w.modified_at.isoformat() if w.modified_at else None,
        }

    @staticmethod
    def create_office(db: Session, data: Dict[str, Any], actor_id: int = 1) -> Dict[str, Any]:
        title = (data.get("title") or data.get("title_en") or data.get("name") or "").strip()
        if not title:
            raise ValueError("Office title is required.")

        max_id = db.query(func.max(WebsiteOffice.id)).scalar() or 0
        new_id = max_id + 1

        state_id = int(data["state_id"]) if data.get("state_id") and str(data["state_id"]) != "0" else None
        dept_id = int(data["department_id"]) if data.get("department_id") and str(data["department_id"]) != "0" else None

        state_title_val = data.get("state_title") or ""
        state_title_hi_val = data.get("state_title_hi") or HINDI_STATE_TRANSLATIONS.get(state_title_val, state_title_val)

        office = WebsiteOffice(
            id=new_id,
            parent_id=int(data.get("parent_id") or 0),
            title=title,
            title_hi=data.get("title_hi") or title,
            state_title=state_title_val,
            state_title_hi=state_title_hi_val,
            state_image=data.get("state_image") or "",
            url=data.get("url") or "",
            email=data.get("email") or "",
            theme=data.get("theme") or "default",
            logo=data.get("logo") or "",
            state_id=state_id,
            department_id=dept_id,
            status=1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true", "active")) else 0,
            is_system=0,
            created_by=actor_id or 1,
            created_at=datetime.utcnow(),
            modified_by=actor_id or 1,
            modified_at=datetime.utcnow()
        )
        db.add(office)
        db.commit()
        return {"id": str(new_id), "success": True}

    @staticmethod
    def update_office(db: Session, office_id: str, data: Dict[str, Any], actor_id: int = 1) -> Dict[str, Any]:
        wid = int(office_id)
        office = db.query(WebsiteOffice).filter(WebsiteOffice.id == wid).first()
        if not office:
            raise ValueError("Office not found.")

        if "title" in data or "title_en" in data or "name" in data:
            office.title = (data.get("title") or data.get("title_en") or data.get("name")).strip()
        if "title_hi" in data:
            office.title_hi = data["title_hi"].strip()
        if "state_title" in data:
            office.state_title = data["state_title"] or ""
        if "state_title_hi" in data:
            office.state_title_hi = data["state_title_hi"] or ""
        if "state_image" in data:
            office.state_image = data["state_image"] or ""
        if "url" in data:
            office.url = data["url"].strip()
        if "email" in data:
            office.email = data["email"].strip() if data["email"] else ""
        if "theme" in data:
            office.theme = data["theme"] or "default"
        if "logo" in data:
            office.logo = data["logo"] or ""
        if "state_id" in data:
            office.state_id = int(data["state_id"]) if data["state_id"] and str(data["state_id"]) != "0" else None
        if "department_id" in data:
            office.department_id = int(data["department_id"]) if data["department_id"] and str(data["department_id"]) != "0" else None
        if "status" in data or "is_active" in data:
            office.status = 1 if (data.get("is_active") is True or str(data.get("status")) in ("1", "true", "active")) else 0

        office.modified_at = datetime.utcnow()
        office.modified_by = actor_id or 1
        db.commit()
        return {"success": True}

    @staticmethod
    def delete_office(db: Session, office_id: str) -> Dict[str, Any]:
        wid = int(office_id)
        office = db.query(WebsiteOffice).filter(WebsiteOffice.id == wid).first()
        if not office:
            raise ValueError("Office not found.")
        db.delete(office)
        db.commit()
        return {"success": True}
