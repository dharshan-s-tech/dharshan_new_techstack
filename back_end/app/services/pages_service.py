import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine

logger = logging.getLogger("uvicorn")

BASE_URL = getattr(settings, "BASE_URL", "https://cag.gov.in")

# Resilient fallback seed data matching the official cag_revamp.pages specifications
SEED_PAGES: Dict[str, Dict[str, Any]] = {
    # Page 1: Duties, Powers and Conditions of Services Act (DPC Act) - ID 3
    "3": {
        "id": 3,
        "slug": "page-duties-power-and-conditions-of-services-act",
        "title_en": "Duties, Powers and Conditions of Services Act",
        "title_hi": "कर्तव्य, शक्तियां और सेवा की शर्तें अधिनियम",
        "excerpt_en": "Comptroller and Auditor General's (Duties, Powers and Conditions of Service) Act, 1971",
        "excerpt_hi": "भारत के नियंत्रक और महालेखापरीक्षक (कर्तव्य, शक्तियां और सेवा की शर्तें) अधिनियम, 1971",
        "file_title": "DPC Act 1971",
        "upload_file": "dpc-act-1971.pdf",
        "status": 1
    },
    # Page 2: CAG Audit Regulations - ID 6685
    "6685": {
        "id": 6685,
        "slug": "page-cag-audit-regulations",
        "title_en": "Audit Regulation",
        "title_hi": "लेखा परीक्षा विनियम",
        "excerpt_en": "Regulations on Audit and Accounts notified by the CAG of India",
        "excerpt_hi": "भारत के सीएजी द्वारा अधिसूचित लेखापरीक्षा और लेखा विनियम",
        "file_title": "Regulations on Audit and Accounts 2020",
        "upload_file": "Regulations-on-Audit-and-Accounts-2020-Gazette-60b73c4d7d91e8-78235251.pdf",
        "status": 1
    },
    # Page 3: Constitutional Provisions - ID 2
    "2": {
        "id": 2,
        "slug": "page-constitutional-provisions",
        "title_en": "Constitutional Provisions",
        "title_hi": "संवैधानिक प्रावधान",
        "excerpt_en": "Articles 148 to 151, 279, Third and Sixth Schedules of the Constitution of India",
        "excerpt_hi": "भारत के संविधान के अनुच्छेद 148 से 151, 279, तीसरी और छठी अनुसूचियां",
        "file_title": "Constitutional Provisions",
        "upload_file": "constitutional-provisions.pdf",
        "status": 1
    },
    # Page 4: Our Vision, Mission and Values - ID 10
    "10": {
        "id": 10,
        "slug": "page-our-vision-mission-values",
        "title_en": "Our Vision, Mission & Core Values",
        "title_hi": "हमारा दृष्टिकोण, ध्येय और मूल मूल्य",
        "excerpt_en": "Vision, Mission and Core Values of SAI India",
        "excerpt_hi": "साईं इंडिया का दृष्टिकोण, ध्येय और मूल मूल्य",
        "file_title": "Vision Mission Values",
        "upload_file": "",
        "status": 1
    },
    # Page 5: CAG of India - ID 17
    "17": {
        "id": 17,
        "slug": "page-cag-of-india",
        "title_en": "Comptroller & Auditor General of India Profile",
        "title_hi": "भारत के नियंत्रक एवं महालेखा परीक्षक की प्रोफाइल",
        "excerpt_en": "Profile and biography of Shri K. Sanjay Murthy, CAG of India",
        "excerpt_hi": "श्री के. संजय मूर्ति, भारत के सीएजी की प्रोफाइल और जीवनी",
        "file_title": "CAG Profile",
        "upload_file": "cag-profile.pdf",
        "status": 1
    },
    # Page 7: History of IA&AD - ID 41
    "41": {
        "id": 41,
        "slug": "page-history-of-indian-audit-and-accounts-department",
        "title_en": "History of Indian Audit and Accounts Department",
        "title_hi": "भारतीय लेखापरीक्षा और लेखा विभाग का इतिहास",
        "excerpt_en": "History of Indian Audit and Accounts Department from 1858 to present",
        "excerpt_hi": "1858 से वर्तमान तक भारतीय लेखापरीक्षा और लेखा विभाग का इतिहास",
        "file_title": "History of IAAD",
        "upload_file": "history-iaad.pdf",
        "status": 1
    },
    # Page 9: Audit Advisory Board - ID 40
    "40": {
        "id": 40,
        "slug": "page-audit-advisory-board",
        "title_en": "Audit Advisory Board",
        "title_hi": "लेखा परीक्षा सलाहकार बोर्ड",
        "excerpt_en": "Constitution, role and members of the Audit Advisory Board",
        "excerpt_hi": "लेखापरीक्षा सलाहकार बोर्ड का गठन, भूमिका और सदस्य",
        "file_title": "Audit Advisory Board Notification",
        "upload_file": "audit-advisory-board.pdf",
        "status": 1
    },
    # Page 10: Overview - ID 1
    "1": {
        "id": 1,
        "slug": "page-overview",
        "title_en": "Overview of Supreme Audit Institution of India",
        "title_hi": "भारत के सर्वोच्च लेखापरीक्षा संस्थान का अवलोकन",
        "excerpt_en": "The Comptroller and Auditor General of India is the Supreme Audit Institution of India, mandated by the Constitution of India.",
        "excerpt_hi": "भारत के नियंत्रक और महालेखापरीक्षक भारत का सर्वोच्च लेखापरीक्षा संस्थान है।",
        "file_title": "Overview",
        "upload_file": "",
        "status": 1
    }
}

SLUG_TO_ID_MAP: Dict[str, str] = {
    "overview": "1",
    "page-overview": "1",
    "page-duties-power-and-conditions-of-services-act": "3",
    "duties-power-and-conditions-of-services-act": "3",
    "duties-&-powers-act": "3",
    "duties-powers-act": "3",
    "page-cag-audit-regulations": "6685",
    "cag-audit-regulations": "6685",
    "audit-regulation": "6685",
    "audit-regulations": "6685",
    "page-constitutional-provisions": "2",
    "constitutional-provisions": "2",
    "governance-&-mandate": "2",
    "governance-and-mandate": "2",
    "page-our-vision-mission-values": "10",
    "our-vision-mission-values": "10",
    "our-vision,-mission-&-core-values": "10",
    "page-cag-of-india": "17",
    "cag-of-india": "17",
    "leadership-&-legacy": "17",
    "leadership-and-legacy": "17",
    "page-history-of-indian-audit-and-accounts-department": "41",
    "history-of-indian-audit-and-accounts-department": "41",
    "history-of-indian-audit-ans-accounts-department": "41",
    "history-of-iaad": "41",
    "page-audit-advisory-board": "40",
    "audit-advisory-board": "40",
    "page-international-relations": "4",
    "international-relations": "4",
    "global-relations": "4",
    "page-cag-s-auditing-standards-2017": "11",
    "auditing-standards": "11",
    "page-citizen-s-charter": "16",
    "citizen-charter": "16",
    "citizen-s-charter": "16"
}


class PagesService:
    @staticmethod
    def get_page_by_slug_or_id(slug_or_id: str, culture: str = "en", db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
        clean_key = slug_or_id.strip().lower()
        target_id = SLUG_TO_ID_MAP.get(clean_key) or clean_key

        # 1. Attempt PostgreSQL Query
        if db and engine.dialect.name == "postgresql":
            try:
                query = text("""
                    SELECT
                        p.id,
                        p.slug,
                        COALESCE(NULLIF(pt.title, ''), p.title) AS title,
                        COALESCE(NULLIF(pt.excerpt, ''), p.excerpt) AS excerpt,
                        COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), NULLIF(pt.excerpt, ''), p.excerpt) AS content,
                        COALESCE(NULLIF(pt.file_title, ''), p.file_title) AS file_title,
                        COALESCE(NULLIF(pt.upload_file, ''), p.upload_file) AS upload_file,
                        p.created_at,
                        p.modified_at
                    FROM cag_revamp.pages p
                    LEFT JOIN cag_revamp.page_translations pt
                        ON pt.page_id = p.id AND pt.culture = :culture
                    WHERE p.status = 1
                    AND (
                        p.slug = :raw_key 
                        OR p.slug = 'page-' || :raw_key 
                        OR p.slug LIKE :raw_key || '-%'
                        OR p.slug LIKE 'page-' || :raw_key || '-%'
                        OR CAST(p.id AS VARCHAR) = :target_id
                    )
                    ORDER BY 
                        (CASE 
                            WHEN CAST(p.id AS VARCHAR) = :target_id THEN 1
                            WHEN p.slug = :raw_key OR p.slug = 'page-' || :raw_key THEN 2
                            ELSE 3 
                         END), 
                        p.id ASC
                    LIMIT 1;
                """)
                row = db.execute(query, {
                    "culture": culture,
                    "raw_key": clean_key,
                    "target_id": str(target_id)
                }).mappings().fetchone()

                if row:
                    data = dict(row)
                    # Post-processing steps
                    if data.get("content"):
                        data["content"] = data["content"].replace("[SITE-URL]/", f"{BASE_URL}/").replace("[SITE-URL]", BASE_URL)
                    if data.get("upload_file"):
                        data["upload_file_url"] = f"{BASE_URL}/uploads/cms_pages_files/{data['upload_file']}"
                    return data
            except Exception as e:
                logger.warning(f"[PagesService] DB query failed ({e}). Falling back to resilient seed data.")

        # 2. Resilient Fallback Resolution
        seed = SEED_PAGES.get(str(target_id))
        if not seed:
            # Fallback search by slug
            for s_id, pdata in SEED_PAGES.items():
                if pdata["slug"] == clean_key or pdata["slug"] == f"page-{clean_key}":
                    seed = pdata
                    break

        if seed:
            is_hi = culture == "hi"
            title = seed.get("title_hi") if is_hi else seed.get("title_en")
            excerpt = seed.get("excerpt_hi") if is_hi else seed.get("excerpt_en")
            upload_file = seed.get("upload_file", "")
            return {
                "id": seed["id"],
                "slug": seed["slug"],
                "title": title or seed.get("title_en"),
                "excerpt": excerpt or seed.get("excerpt_en"),
                "content": f"<p>{title}</p>",
                "file_title": seed.get("file_title"),
                "upload_file": upload_file,
                "upload_file_url": f"{BASE_URL}/uploads/cms_pages_files/{upload_file}" if upload_file else "",
                "status": seed.get("status", 1)
            }

        return None
