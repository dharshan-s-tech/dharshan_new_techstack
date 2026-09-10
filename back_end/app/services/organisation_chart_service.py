import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import engine

logger = logging.getLogger("uvicorn")

# Seed data for Organisation Chart matching the official hierarchy
SEED_ORGANISATION_OFFICERS = [
    {
        "id": 1,
        "name_en": "Shri K. Sanjay Murthy",
        "name_hi": "श्री के. संजय मूर्ति",
        "designation_en": "Comptroller and Auditor General of India",
        "designation_hi": "भारत के नियंत्रक और महालेखापरीक्षक",
        "level": 0,
        "email": "cagoffice@cag.gov.in",
        "phone": "+91-11-23235797",
        "profile_image": "/assets/cag-desk-photo.png",
        "charge_en": "Head of Supreme Audit Institution of India",
        "charge_hi": "भारत के सर्वोच्च लेखापरीक्षा संस्थान के प्रमुख",
        "display_order": 1
    },
    {
        "id": 2,
        "name_en": "Secretary to CAG",
        "name_hi": "सीएजी के सचिव",
        "designation_en": "Secretary to CAG",
        "designation_hi": "सीएजी के सचिव",
        "level": 1,
        "email": "secy-cag@cag.gov.in",
        "phone": "+91-11-23235798",
        "profile_image": "/assets/officers/secy.png",
        "charge_en": "Coordination & Secretariat",
        "charge_hi": "समन्वय और सचिवालय",
        "display_order": 2
    },
    {
        "id": 3,
        "name_en": "Ms. Rebecca Mathai",
        "name_hi": "सुश्री रेबेका मथाई",
        "designation_en": "Deputy Comptroller & Auditor General",
        "designation_hi": "उप नियंत्रक एवं महालेखा परीक्षक",
        "level": 2,
        "email": "rebeccam@cag.gov.in",
        "phone": "+91-11-23235701",
        "profile_image": "/assets/officers/rebecca.png",
        "charge_en": "Report Central & Human Resources",
        "charge_hi": "रिपोर्ट केंद्रीय एवं मानव संसाधन",
        "display_order": 3
    },
    {
        "id": 4,
        "name_en": "Shri Anand Mohan Bajaj",
        "name_hi": "श्री आनंद मोहन बजाज",
        "designation_en": "Deputy Comptroller & Auditor General",
        "designation_hi": "उप नियंत्रक एवं महालेखा परीक्षक",
        "level": 2,
        "email": "bajajam@cag.gov.in",
        "phone": "+91-11-23235702",
        "profile_image": "/assets/officers/bajaj.png",
        "charge_en": "Commercial Audits & Accounts",
        "charge_hi": "वाणिज्यिक लेखापरीक्षा और खाते",
        "display_order": 4
    },
    {
        "id": 5,
        "name_en": "Shri K. R. Sriram",
        "name_hi": "श्री के. आर. श्रीराम",
        "designation_en": "Additional Deputy CAG",
        "designation_hi": "अपर उप सीएजी",
        "level": 3,
        "email": "sriramkr@cag.gov.in",
        "phone": "+91-11-23235703",
        "profile_image": "/assets/officers/sriram.png",
        "charge_en": "Defence & International Relations",
        "charge_hi": "रक्षा और अंतर्राष्ट्रीय संबंध",
        "display_order": 5
    },
    {
        "id": 6,
        "name_en": "Ms. Swati Pandey",
        "name_hi": "सुश्री स्वाति पांडे",
        "designation_en": "Principal Director",
        "designation_hi": "प्रधान निदेशक",
        "level": 4,
        "email": "swatip@cag.gov.in",
        "phone": "+91-11-23235704",
        "profile_image": "/assets/officers/swati.png",
        "charge_en": "Personnel, SMU & Coordination",
        "charge_hi": "कार्मिक, एसएमयू और समन्वय",
        "display_order": 6
    }
]


class OrganisationChartService:
    @staticmethod
    def get_organisation_chart(culture: str = "en", db: Optional[Session] = None) -> Dict[str, Any]:
        is_hi = culture == "hi"

        # 1. Attempt PostgreSQL Query
        if db and engine.dialect.name == "postgresql":
            try:
                query = text("""
                    SELECT
                        oc.id,
                        oc.designation_hierarchy_id,
                        oc.full_name,
                        oc.email,
                        oc.mobile_no,
                        oc.profile_image,
                        oc.org_charge_master_id,
                        oc.additional_charge,
                        oc.display_order,
                        dh.title AS designation_title,
                        dh.level AS designation_level,
                        ocm.title AS charge_title
                    FROM cag_revamp.organisation_chart oc
                    LEFT JOIN cag_revamp.designation_hierarchy dh ON dh.id = oc.designation_hierarchy_id
                    LEFT JOIN cag_revamp.org_charge_master ocm ON ocm.id = oc.org_charge_master_id
                    WHERE oc.status = 1
                    AND oc.retired = 0
                    AND oc.seniority_confirmed = 1
                    AND oc.display_order > 0
                    ORDER BY oc.display_order ASC;
                """)
                rows = db.execute(query).mappings().fetchall()

                if rows:
                    officers = []
                    for r in rows:
                        fn = r.get("full_name") or {}
                        if isinstance(fn, str):
                            import json
                            try:
                                fn = json.loads(fn)
                            except:
                                fn = {"default": fn}
                        
                        name = fn.get("hi" if is_hi else "default") or fn.get("default") or ""
                        img = r.get("profile_image") or ""
                        if img and not img.startswith("/"):
                            img = f"/uploads/cag_emp_profile_pic/{img}"

                        officers.append({
                            "id": r.get("id"),
                            "name": name,
                            "email": r.get("email"),
                            "phone": r.get("mobile_no"),
                            "profile_image": img,
                            "designation": r.get("designation_title") or "",
                            "level": r.get("designation_level") or 2,
                            "charge": r.get("charge_title") or "",
                            "display_order": r.get("display_order")
                        })
                    
                    return {
                        "officers": officers,
                        "disclaimer": "The organisation chart depicts senior executive portfolios in the Comptroller and Auditor General of India."
                    }
            except Exception as e:
                logger.warning(f"[OrganisationChartService] DB query failed ({e}). Falling back to seed.")

        # 2. Resilient Fallback Data
        formatted = []
        for o in SEED_ORGANISATION_OFFICERS:
            formatted.append({
                "id": o["id"],
                "name": o["name_hi"] if is_hi else o["name_en"],
                "name_en": o["name_en"],
                "name_hi": o["name_hi"],
                "designation": o["designation_hi"] if is_hi else o["designation_en"],
                "designation_en": o["designation_en"],
                "designation_hi": o["designation_hi"],
                "level": o["level"],
                "email": o["email"],
                "phone": o["phone"],
                "profile_image": o["profile_image"],
                "charge": o["charge_hi"] if is_hi else o["charge_en"],
                "display_order": o["display_order"]
            })

        return {
            "officers": formatted,
            "disclaimer": "The organisation chart depicts senior executive portfolios in the Comptroller and Auditor General of India."
        }
