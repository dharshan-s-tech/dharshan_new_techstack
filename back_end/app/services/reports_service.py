import os
import re
import json
import logging
import urllib.parse
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional

from app.core.config import settings

logger = logging.getLogger("uvicorn")


def _get_pg_config():
    return {
        "host": settings.DB_HOST,
        "port": settings.DB_PORT,
        "dbname": settings.DB_NAME,
        "user": settings.DB_USER,
        "password": settings.DB_PASSWORD,
        "connect_timeout": 5,
        "options": f"-c search_path={settings.DB_SCHEMA},public",
    }


LOCAL_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
LOCAL_REPORTS_FILE = os.path.join(LOCAL_DATA_DIR, "local_reports.json")
LOCAL_STATE_ACCOUNTS_FILE = os.path.join(LOCAL_DATA_DIR, "local_state_accounts.json")
LOCAL_COMBINED_ACCOUNTS_FILE = os.path.join(LOCAL_DATA_DIR, "local_combined_accounts.json")

os.makedirs(LOCAL_DATA_DIR, exist_ok=True)

CDN_BASE = "https://d7i5wg8xwe4hf.cloudfront.net/uploads"

DEPARTMENT_ASSETS = {
    "civil": f"{CDN_BASE}/union_department/civil.jpg",
    "railway": f"{CDN_BASE}/union_department/railway.jpg",
    "commercial": f"{CDN_BASE}/union_department/commercial.jpg",
    "tax": f"{CDN_BASE}/union_department/tax.jpg",
    "indirect_tax": f"{CDN_BASE}/union_department/indirect-tax.jpg",
    "defence": f"{CDN_BASE}/union_department/defence.jpg",
    "scientific": f"{CDN_BASE}/union_department/scientific.jpg",
    "it": f"{CDN_BASE}/union_department/it-communication.jpg",
}

# Live verified sector-wise images from http://d7i5wg8xwe4hf.cloudfront.net/en/home
SECTOR_WISE_IMAGES = {
    "24": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Local_Bodies.jpg",
    "26": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Environment_and_Sustainable_Development.png",
    "27": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Finance.png",
    "28": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Science_and_Technology.png",
    "29": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Industry_and_commerce.png",
    "30": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Agriculture_and_Rural_Development.jfif",
    "31": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Art_Culture_and_Sports.png",
    "32": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/social_welfare.jpeg",
    "34": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Social_infrastructure.jfif",
    "35": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png",
    "36": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/general_sector_ministry_and_constitutional_bodies.jfif",
    "41": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png",
    "42": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/information_and_communication.jfif",
    "43": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/power_and_energy.jpg",
    "44": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Transport_and_Infrastructure.jfif",
    "45": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Taxes_and_duties.png",
    "928": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/information_and_communication.jfif",
}

SECTOR_MAP: Dict[str, str] = {
    "finance": "27",
    "taxes and duties": "45",
    "tax and duties": "45",
    "taxes": "45",
    "transport & infrastructure": "44",
    "transport and infrastructure": "44",
    "transport": "44",
    "social welfare": "32",
    "power & energy": "43",
    "power and energy": "43",
    "power": "43",
    "energy": "43",
    "general sector ministries and constitutional bodies": "36",
    "general sector": "36",
    "agriculture and rural development": "30",
    "agriculture": "30",
    "social infrastructure": "34",
    "industry and commerce": "29",
    "industry & commerce": "29",
    "commerce": "29",
    "education, health & family welfare": "35",
    "education and health": "35",
    "education": "35",
    "health": "35",
    "environment and sustainable development": "26",
    "environment": "26",
    "art, culture and sports": "31",
    "art and culture": "31",
    "information and communication": "42",
    "it audit": "928",
    "local bodies": "24",
    "science and technology": "28",
    "science & technology": "28",
    "defence and national security": "41",
    "defence & national security": "41",
    "defence": "41",
    "defense": "41",
}

TYPE_MAP: Dict[str, str] = {
    "compliance": "52",
    "financial": "53",
    "performance": "54",
    "adc reports": "926",
    "adc": "926",
}

_CATEGORIES_CACHE: Optional[Dict[int, str]] = None


def _get_category_cache() -> Dict[int, str]:
    global _CATEGORIES_CACHE
    if _CATEGORIES_CACHE is not None:
        return _CATEGORIES_CACHE
    conn = _get_remote_conn()
    if not conn:
        return {}
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, title FROM cag_revamp.general_categories WHERE status = 1;")
        _CATEGORIES_CACHE = {row[0]: row[1] for row in cur.fetchall()}
        cur.close()
        conn.close()
    except Exception as exc:
        logger.warning(f"Could not preload categories cache: {exc}")
        if conn:
            conn.close()
        _CATEGORIES_CACHE = {}
    return _CATEGORIES_CACHE


def resolve_report_image(
    sector: str = "",
    title: str = "",
    thumb_img: str = "",
    dept_img: str = "",
    state_name: str = "",
    sector_id: str = "",
    index: int = 0,
) -> str:
    """Resolve report image using CloudFront CDN sector images, union department assets or state crests."""
    if thumb_img and str(thumb_img).strip():
        ti = str(thumb_img).strip()
        if ti.startswith("http://") or ti.startswith("https://"):
            return ti
        if not ti.startswith("/"):
            return f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/report_thumb_img/{ti}"
        return ti

    # Check direct sector ID
    if sector_id and str(sector_id) in SECTOR_WISE_IMAGES:
        return SECTOR_WISE_IMAGES[str(sector_id)]

    # Check dept image
    if dept_img and str(dept_img).strip():
        di = str(dept_img).strip()
        if di.startswith("http://") or di.startswith("https://"):
            return di
        return f"{CDN_BASE}/union_department/{di}"

    # Map text keywords to CloudFront sector images
    combined = f"{sector or ''} {title or ''}".lower()
    if any(k in combined for k in ["health", "medic", "vaccin", "polio", "family welfare", "education", "school"]):
        return SECTOR_WISE_IMAGES["35"]
    elif any(k in combined for k in ["defence", "defense", "military", "army", "air force", "navy", "security", "border"]):
        return SECTOR_WISE_IMAGES["41"]
    elif any(k in combined for k in ["railway", "train", "transport", "highway", "traffic", "road", "toll"]):
        return SECTOR_WISE_IMAGES["44"]
    elif any(k in combined for k in ["tax", "duty", "duties", "revenue", "indirect", "gst", "excise", "customs"]):
        return SECTOR_WISE_IMAGES["45"]
    elif any(k in combined for k in ["power", "energy", "solar", "electricity", "grid", "renewable"]):
        return SECTOR_WISE_IMAGES["43"]
    elif any(k in combined for k in ["local bodies", "municipal", "civic", "panchayat", "waste"]):
        return SECTOR_WISE_IMAGES["24"]
    elif any(k in combined for k in ["environment", "sustainable", "pollution", "coastal", "climate", "forest"]):
        return SECTOR_WISE_IMAGES["26"]
    elif any(k in combined for k in ["it audit", "information technology", "cyber", "telecom", "communication", "digital", "software"]):
        return SECTOR_WISE_IMAGES["42"]
    elif any(k in combined for k in ["commercial", "psu", "enterprise", "trade", "industry", "mining", "mineral", "corporate"]):
        return SECTOR_WISE_IMAGES["29"]
    elif any(k in combined for k in ["agriculture", "rural", "irrigation", "canal", "farming", "krishi"]):
        return SECTOR_WISE_IMAGES["30"]
    elif any(k in combined for k in ["art", "culture", "sport"]):
        return SECTOR_WISE_IMAGES["31"]
    elif any(k in combined for k in ["social infrastructure"]):
        return SECTOR_WISE_IMAGES["34"]
    elif any(k in combined for k in ["social welfare", "social", "welfare"]):
        return SECTOR_WISE_IMAGES["32"]
    elif any(k in combined for k in ["scientific", "science", "atomic", "space", "nuclear"]):
        return SECTOR_WISE_IMAGES["28"]
    elif any(k in combined for k in ["adc", "autonomous district", "constitutional", "general sector"]):
        return SECTOR_WISE_IMAGES["36"]
    elif any(k in combined for k in ["finance", "treasury", "accounts", "fiscal"]):
        return SECTOR_WISE_IMAGES["27"]
    elif state_name and str(state_name).strip():
        s_clean = str(state_name).strip()
        return f"https://d7i5wg8xwe4hf.cloudfront.net/assets/images/states_images/{urllib.parse.quote(s_clean)}.png"
    else:
        # Rotational sequence from Figma design screenshot
        figma_sequence = [
            SECTOR_WISE_IMAGES["35"],
            SECTOR_WISE_IMAGES["41"],
            DEPARTMENT_ASSETS["railway"],
        ]
        return figma_sequence[index % len(figma_sequence)]


_LAST_DB_FAIL_TIME = 0
_FAIL_CACHE_TTL = 6


def _get_remote_conn():
    global _LAST_DB_FAIL_TIME
    import time
    now = time.time()
    if now - _LAST_DB_FAIL_TIME < _FAIL_CACHE_TTL:
        return None

    try:
        cfg = _get_pg_config()
        conn = psycopg2.connect(**cfg)
        conn.set_session(readonly=True, autocommit=True)
        _LAST_DB_FAIL_TIME = 0
        return conn
    except Exception as e:
        _LAST_DB_FAIL_TIME = time.time()
        logger.warning(f"[RemoteDB] Could not connect to PostgreSQL DB ({e}). Falling back to local data.")
        return None


def _get_write_conn():
    try:
        cfg = _get_pg_config()
        conn = psycopg2.connect(**cfg)
        conn.set_session(readonly=False, autocommit=True)
        return conn
    except Exception as e:
        logger.warning(f"[RemoteDB Write] Could not connect to PostgreSQL DB for write ({e}). Falling back to local data.")
        return None


def _load_json(file_path: str, default_val: Any) -> Any:
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default_val
    return default_val


def _save_json(file_path: str, data: Any):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


SAMPLE_CURATED_CHAPTERS = [
    {
        "id": 1,
        "title": "Title page, TOC, Preface & Executive Summary",
        "file_name": "1.-CA-Report_23-24_TOC,-Summary-06a6734385f8554.43534489.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/1.-CA-Report_23-24_TOC,-Summary-06a6734385f8554.43534489.pdf"
    },
    {
        "id": 2,
        "title": "Chapter 1: Overview of State Finances and Institutional Architecture",
        "file_name": "2.-CA-Report_23-24_Ch-1-06a67343945c979.47150989.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/2.-CA-Report_23-24_Ch-1-06a67343945c979.47150989.pdf"
    },
    {
        "id": 3,
        "title": "Chapter 2: Financial Performance and Budgetary Compliance",
        "file_name": "3.-CA-Report_23-24_Ch-2-06a6734394de0f1.97070649.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/3.-CA-Report_23-24_Ch-2-06a6734394de0f1.97070649.pdf"
    },
    {
        "id": 4,
        "title": "Chapter 3: Quality of Accounts and Financial Reporting Practices",
        "file_name": "4.-CA-Report_23-24_Ch-3-06a673439577eb7.82678278.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/4.-CA-Report_23-24_Ch-3-06a673439577eb7.82678278.pdf"
    },
    {
        "id": 5,
        "title": "Annexures, Glossary of Technical Terms & Statistical Statements",
        "file_name": "6.-CA-Report_23-24_Annexure-06a6734396feb03.37866974.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/6.-CA-Report_23-24_Annexure-06a6734396feb03.37866974.pdf"
    }
]

SAMPLE_CURATED_FILES = [
    {
        "id": 101,
        "title": "Key Findings Summary and Highlights Brochure (English)",
        "file_name": "CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"
    }
]

FIGMA_CURATED_REPORTS = [
    {
        "id": "rep-1",
        "title": "Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png",
        "tag": "Finance",
        "date": "Jun 4, 2026",
        "year": "2026",
        "sector": "Finance | Information and Communication",
        "level": "States",
        "report_type": "Performance",
        "label": "Download Full Report",
        "desc": "Review of vaccine distribution logistics, primary health center infrastructure, and public health fund implementation.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-2",
        "title": "Annual Marketing Strategy Overview with insights into trends and projections",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png",
        "tag": "Marketing",
        "date": "Jul 15, 2026",
        "year": "2026",
        "sector": "Finance | Information and Communication",
        "level": "Union",
        "report_type": "Compliance",
        "label": "Download Full Report",
        "desc": "Detailed compliance assessment of security hardware acquisitions and modernized systems.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/Report-of-the-Comptroller-and-Auditor-General-of-India-on-State-Finances-for-the-year-2024-25-(Report-No.-1-of-2026)-English-06a61f5a988c626.20176437.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-3",
        "title": "Emerging Tech Innovations and their Impact on the Industry Landscape",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg",
        "tag": "Technology",
        "date": "Aug 30, 2026",
        "year": "2026",
        "sector": "Finance",
        "level": "Union",
        "report_type": "Performance",
        "label": "Download Full Report",
        "desc": "Signaling upgrade projects review evaluating budget allocations and system reliability.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/Report-No.2-of-the-year-2026---State-Finances-Audit-Report-06a61fb3bbcafb0.98697767.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-4",
        "title": "Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png",
        "tag": "Finance",
        "date": "Jun 4, 2026",
        "year": "2026",
        "sector": "Finance",
        "level": "Union",
        "report_type": "Compliance",
        "label": "Download Full Report",
        "desc": "Audit evaluating compliance of corporate tax exemptions and direct receipt accounts clearance.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/Bihar_CA-Civil_Report-No-01-of-2026_English-06a62eaa0de6998.45230907.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-5",
        "title": "Annual Marketing Strategy Overview with insights into trends and projections",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg",
        "tag": "Marketing",
        "date": "Jul 15, 2026",
        "year": "2026",
        "sector": "Finance",
        "level": "Local Bodies",
        "report_type": "Compliance",
        "label": "Download Full Report",
        "desc": "Review of local property assessments, GIS survey implementation, and municipal development funds.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/MP-JJM-Report-No.-5-of-2026-Bhopal---English-06a674f93c3faf1.25493877.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-6",
        "title": "Emerging Tech Innovations and their Impact on the Industry Landscape",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png",
        "tag": "Technology",
        "date": "Aug 30, 2026",
        "year": "2026",
        "sector": "Tax and Duties",
        "level": "Union",
        "report_type": "Performance",
        "label": "Download Full Report",
        "desc": "Audit reviewing custom software deployments and processing performance benchmarks.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/MP-Report-No.-04-of-2026--MGNREGA-Hindi-06a61c6dad33e00.92220812.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-7",
        "title": "Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg",
        "tag": "Finance",
        "date": "Jun 4, 2026",
        "year": "2026",
        "sector": "Environment and Sustainable Development",
        "level": "Union",
        "report_type": "Performance",
        "label": "Download Full Report",
        "desc": "Evaluation of transmission corridor development and renewable energy infrastructure.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-8",
        "title": "Annual Marketing Strategy Overview with insights into trends and projections",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png",
        "tag": "Marketing",
        "date": "Jul 15, 2026",
        "year": "2026",
        "sector": "Finance",
        "level": "States",
        "report_type": "Performance",
        "label": "Download Full Report",
        "desc": "Review of toll concession agreements and electronic toll collection audit trails.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/Report-of-the-Comptroller-and-Auditor-General-of-India-on-State-Finances-for-the-year-2024-25-(Report-No.-1-of-2026)-English-06a61f5a988c626.20176437.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
    {
        "id": "rep-9",
        "title": "Emerging Tech Innovations and their Impact on the Industry Landscape",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png",
        "tag": "Technology",
        "date": "Aug 30, 2026",
        "year": "2026",
        "sector": "Finance",
        "level": "Union",
        "report_type": "Compliance",
        "label": "Download Full Report",
        "desc": "Financial position and operational viability of state government owned enterprises.",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/Report-No.2-of-the-year-2026---State-Finances-Audit-Report-06a61fb3bbcafb0.98697767.pdf",
        "chapters": SAMPLE_CURATED_CHAPTERS,
        "files": SAMPLE_CURATED_FILES,
        "source": "curated"
    },
]


class ReportsService:
    @staticmethod
    def get_audit_reports(
        page: int = 1,
        page_size: int = 9,
        query: str = "",
        level: str = "",
        sector: str = "",
        report_type: str = "",
        year: str = "",
        state_id: Optional[int] = None,
        language: str = "en",
        sort: str = "newest",
    ) -> Dict[str, Any]:
        """Fetch standalone audit reports (parent_id = 0) with multi-criteria filtering and CloudFront CDN assets."""
        page = max(1, page)
        page_size = max(1, min(page_size, 100))
        offset = (page - 1) * page_size

        # Local CMS overrides
        local_reports = _load_json(LOCAL_REPORTS_FILE, [])
        filtered_local = []
        for r in local_reports:
            if r.get("is_deleted"):
                continue
            if query and query.lower() not in r.get("title", "").lower() and query.lower() not in r.get("overview", "").lower():
                continue
            if level and level != "All":
                lvl_list = [l.strip().lower() for l in level.split(",") if l.strip() and l.strip().lower() != "all"]
                if lvl_list and not any(l in str(r.get("level", "")).lower() for l in lvl_list):
                    continue
            if sector and sector not in ("All", "All Sectors"):
                sec_list = [s.strip().lower() for s in sector.split(",") if s.strip() and s.strip().lower() not in ("all", "all sectors")]
                if sec_list and not any(s in str(r.get("sector", "")).lower() or str(r.get("sector", "")).lower() in s for s in sec_list):
                    continue
            if report_type and report_type != "All":
                tp_list = [t.strip().lower() for t in report_type.split(",") if t.strip() and t.strip().lower() != "all"]
                if tp_list and not any(t in str(r.get("report_type", "")).lower() for t in tp_list):
                    continue
            if year and str(r.get("year", "")) != str(year):
                continue
            filtered_local.append(r)

        # Sort filtered local CMS items matching the requested sort order
        if sort in ("oldest", "year_asc"):
            filtered_local.sort(key=lambda x: (int(str(x.get("year", 0)).strip() or 0), str(x.get("tabled_date", "")), str(x.get("id", ""))))
        elif sort == "title_asc":
            filtered_local.sort(key=lambda x: str(x.get("title", "")).lower())
        elif sort == "title_desc":
            filtered_local.sort(key=lambda x: str(x.get("title", "")).lower(), reverse=True)
        else:
            filtered_local.sort(key=lambda x: (int(str(x.get("year", 0)).strip() or 0), str(x.get("tabled_date", "")), str(x.get("id", ""))), reverse=True)

        category_cache = _get_category_cache()
        conn = _get_remote_conn()
        remote_items = []
        remote_total = 0

        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)

                # Filter only active standalone main reports (not individual chapters/annexures)
                where_clauses = ["ar.status = 1", "(ar.parent_id = 0 OR ar.parent_id IS NULL)"]
                params: List[Any] = []

                if language:
                    where_clauses.append("ar.language = %s")
                    params.append(language)

                if query:
                    q_term = f"%{query}%"
                    where_clauses.append("""(
                        ar.title ILIKE %s 
                        OR ar.overview ILIKE %s 
                        OR ar.main_report_file ILIKE %s
                        OR gc_dept.title ILIKE %s
                        OR s.name ILIKE %s
                    )""")
                    params.extend([q_term, q_term, q_term, q_term, q_term])

                # Multi-level support (e.g. "Union,States")
                if level and level != "All":
                    levels_list = [l.strip() for l in level.split(",") if l.strip() and l.strip() != "All"]
                    if levels_list:
                        lvl_clauses = []
                        for lvl in levels_list:
                            lvl_clauses.append("gc_gov.title ILIKE %s")
                            params.append(f"%{lvl}%")
                        where_clauses.append(f"({' OR '.join(lvl_clauses)})")

                # Multi-sector support (e.g. "Finance,Transport & Infrastructure")
                if sector and sector not in ("All", "All Sectors"):
                    secs_list = [s.strip() for s in sector.split(",") if s.strip() and s.strip() not in ("All", "All Sectors")]
                    if secs_list:
                        sec_clauses = []
                        for sec in secs_list:
                            sec_id = SECTOR_MAP.get(sec.lower())
                            if sec_id:
                                sec_clauses.append("(%s = ANY(string_to_array(ar.sector, ',')) OR gc_sec.title ILIKE %s)")
                                params.extend([sec_id, f"%{sec}%"])
                            else:
                                sec_clauses.append("gc_sec.title ILIKE %s")
                                params.append(f"%{sec}%")
                        where_clauses.append(f"({' OR '.join(sec_clauses)})")

                # Multi-type support (e.g. "Compliance,Performance")
                if report_type and report_type != "All":
                    types_list = [t.strip() for t in report_type.split(",") if t.strip() and t.strip() != "All"]
                    if types_list:
                        type_clauses = []
                        for tp in types_list:
                            tp_id = TYPE_MAP.get(tp.lower())
                            if tp_id:
                                type_clauses.append("(%s = ANY(string_to_array(ar.report_type, ',')) OR gc_rep.title ILIKE %s)")
                                params.extend([tp_id, f"%{tp}%"])
                            else:
                                type_clauses.append("gc_rep.title ILIKE %s")
                                params.append(f"%{tp}%")
                        where_clauses.append(f"({' OR '.join(type_clauses)})")

                if year:
                    try:
                        yr_int = int(year)
                        where_clauses.append("ar.year_of_report = %s")
                        params.append(yr_int)
                    except ValueError:
                        pass

                if state_id:
                    where_clauses.append("ar.state = %s")
                    params.append(state_id)

                where_sql = " AND ".join(where_clauses)

                # Total count
                count_sql = f"""
                    SELECT count(*) FROM cag_revamp.audit_reports ar
                    LEFT JOIN cag_revamp.states s ON ar.state = s.id
                    LEFT JOIN cag_revamp.general_categories gc_gov ON ar.government_type = gc_gov.id
                    LEFT JOIN cag_revamp.general_categories gc_rep ON gc_rep.id::text = split_part(ar.report_type, ',', 1)
                    LEFT JOIN cag_revamp.general_categories gc_sec ON gc_sec.id::text = split_part(ar.sector, ',', 1)
                    LEFT JOIN cag_revamp.general_categories gc_dept ON ar.union_department_type = gc_dept.id
                    WHERE {where_sql};
                """
                cur.execute(count_sql, params)
                remote_total = cur.fetchone()["count"]

                if sort in ("newest", "newly_added", "latest"):
                    order_by_sql = "ORDER BY ar.id DESC"
                elif sort == "oldest":
                    order_by_sql = "ORDER BY ar.id ASC"
                elif sort == "year_desc":
                    order_by_sql = "ORDER BY NULLIF(ar.year_of_report, 0) DESC NULLS LAST, ar.date_on_which_report_tabled DESC NULLS LAST, ar.id DESC"
                elif sort == "year_asc":
                    order_by_sql = "ORDER BY NULLIF(ar.year_of_report, 0) ASC NULLS LAST, ar.date_on_which_report_tabled ASC NULLS LAST, ar.id ASC"
                elif sort == "title_asc":
                    order_by_sql = "ORDER BY LOWER(TRIM(ar.title)) ASC, ar.id DESC"
                elif sort == "title_desc":
                    order_by_sql = "ORDER BY LOWER(TRIM(ar.title)) DESC, ar.id DESC"
                else:
                    order_by_sql = "ORDER BY ar.id DESC"

                query_sql = f"""
                    SELECT 
                        ar.id,
                        ar.title,
                        ar.language,
                        ar.overview,
                        ar.year_of_report as year,
                        ar.date_on_which_report_tabled as tabled_date,
                        ar.main_report_file,
                        ar.download_audit_report,
                        ar.youtube_video_url,
                        ar.digital_report,
                        ar.report_thumb_img,
                        ar.sector as raw_sector,
                        ar.report_type as raw_report_type,
                        s.id as state_id,
                        s.name as state_name,
                        gc_gov.title as level,
                        gc_rep.title as single_rep_type,
                        gc_sec.title as single_sector,
                        gc_dept.title as dept_name,
                        gc_dept.image as dept_image
                    FROM cag_revamp.audit_reports ar
                    LEFT JOIN cag_revamp.states s ON ar.state = s.id
                    LEFT JOIN cag_revamp.general_categories gc_gov ON ar.government_type = gc_gov.id
                    LEFT JOIN cag_revamp.general_categories gc_rep ON gc_rep.id::text = split_part(ar.report_type, ',', 1)
                    LEFT JOIN cag_revamp.general_categories gc_sec ON gc_sec.id::text = split_part(ar.sector, ',', 1)
                    LEFT JOIN cag_revamp.general_categories gc_dept ON ar.union_department_type = gc_dept.id
                    WHERE {where_sql}
                    {order_by_sql}
                    LIMIT %s OFFSET %s;
                """
                cur.execute(query_sql, params + [page_size, offset])

                rows = cur.fetchall()

                for idx, r in enumerate(rows):
                    main_file = r.get("main_report_file") or r.get("download_audit_report") or ""
                    # Guaranteed CloudFront asset delivery
                    pdf_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/{main_file}" if main_file else "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"

                    # Resolve multi-sector IDs into readable title sequence
                    raw_sec = r.get("raw_sector") or ""
                    sec_ids = [int(x.strip()) for x in raw_sec.split(",") if x.strip().isdigit()]
                    sec_titles = [category_cache[sid] for sid in sec_ids if sid in category_cache]
                    formatted_sector = " | ".join(sec_titles) if sec_titles else (r.get("single_sector") or "Finance")
                    primary_sec_id = str(sec_ids[0]) if sec_ids else ""

                    # Resolve multi report types
                    raw_type = r.get("raw_report_type") or ""
                    type_ids = [int(x.strip()) for x in raw_type.split(",") if x.strip().isdigit()]
                    type_titles = [category_cache[tid] for tid in type_ids if tid in category_cache]
                    formatted_type = ", ".join(type_titles) if type_titles else (r.get("single_rep_type") or "Compliance")

                    # Extract primary tag
                    tag = sec_titles[0] if sec_titles else (r.get("single_sector") or "Finance")

                    # Clean video URL
                    raw_video = r.get("youtube_video_url") or ""
                    video_url = ""
                    if raw_video and raw_video not in ('[""]', '[]', 'None'):
                        video_url = raw_video.strip('[]"\' ')

                    # Date presentation
                    tabled = str(r.get("tabled_date") or "")
                    year_val = str(r.get("year") or "")
                    date_str = tabled if tabled else year_val if year_val else "2026"

                    card_image = resolve_report_image(
                        sector=formatted_sector,
                        sector_id=primary_sec_id,
                        title=r.get("title") or "",
                        thumb_img=r.get("report_thumb_img") or "",
                        dept_img=r.get("dept_image") or "",
                        state_name=r.get("state_name") or "",
                        index=(offset + idx),
                    )

                    label = "Download Full Report"


                    remote_items.append({
                        "id": str(r["id"]),
                        "title": r.get("title") or "Audit Report",
                        "language": r.get("language") or "en",
                        "overview": r.get("overview") or "",
                        "desc": r.get("overview") or "",
                        "year": year_val,
                        "tabled_date": tabled,
                        "date": date_str,
                        "level": r.get("level") or "Union",
                        "report_type": formatted_type,
                        "sector": formatted_sector,
                        "tag": tag,
                        "state_name": r.get("state_name") or "",
                        "state_id": r.get("state_id"),
                        "image": card_image,
                        "pdf_url": pdf_url,
                        "file_name": main_file,
                        "video_url": video_url,
                        "label": label,
                        "source": "remote_db",
                    })

                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB] Query failed: {e}")
                if conn:
                    conn.close()

        deleted_ids = {str(r.get("id")) for r in local_reports if r.get("is_deleted")}

        def _parse_report_id(x):
            raw = str(x.get("rawId") or x.get("id") or "0")
            digits = "".join(ch for ch in raw if ch.isdigit())
            base_val = int(digits) if digits else 0
            if not x.get("is_seed"):
                return 1000000000 + base_val
            return base_val

        def _parse_report_year(x):
            raw = str(x.get("year") or x.get("year_of_report") or "0")
            digits = "".join(ch for ch in raw if ch.isdigit())
            return int(digits[:4]) if digits else 0

        def _sort_items(items_list):
            if sort in ("newest", "newly_added", "latest"):
                items_list.sort(key=lambda x: _parse_report_id(x), reverse=True)
            elif sort == "oldest":
                items_list.sort(key=lambda x: _parse_report_id(x))
            elif sort == "year_desc":
                items_list.sort(key=lambda x: (_parse_report_year(x), _parse_report_id(x)), reverse=True)
            elif sort == "year_asc":
                items_list.sort(key=lambda x: (_parse_report_year(x), _parse_report_id(x)))
            elif sort == "title_asc":
                items_list.sort(key=lambda x: str(x.get("title", "")).strip().lower())
            elif sort == "title_desc":
                items_list.sort(key=lambda x: str(x.get("title", "")).strip().lower(), reverse=True)
            else:
                items_list.sort(key=lambda x: _parse_report_id(x), reverse=True)

        if remote_items or remote_total > 0:
            # When remote DB is connected, only include custom user-created/edited CMS items, not offline seeds
            user_local = [r for r in filtered_local if not r.get("is_seed") and str(r.get("id")) not in deleted_ids]
            user_local_ids = {str(r.get("id")) for r in user_local}
            filtered_remote = [
                r for r in remote_items
                if str(r.get("id")) not in deleted_ids and str(r.get("id")) not in user_local_ids
            ]
            all_items = user_local + filtered_remote
            _sort_items(all_items)
            total = len(user_local) + max(0, remote_total - len(deleted_ids.intersection({str(r.get("id")) for r in remote_items})))
            result_items = all_items[:page_size]
        else:
            # When remote DB is offline, serve full rich local dataset with offset pagination
            all_items = [r for r in filtered_local if str(r.get("id")) not in deleted_ids]
            if not all_items:
                all_items = list(FIGMA_CURATED_REPORTS)
            _sort_items(all_items)
            total = len(all_items)
            result_items = all_items[offset : offset + page_size]

        return {
            "items": result_items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if page_size else 1,
        }

    @staticmethod
    def get_audit_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve single audit report details by ID, including child chapters and attachments."""
        # 1. Check local CMS first
        local_reports = _load_json(LOCAL_REPORTS_FILE, [])
        for r in local_reports:
            if str(r.get("id")) == str(report_id):
                if r.get("is_deleted"):
                    return None
                return r

        # 2. Check Figma curated reports
        for cr in FIGMA_CURATED_REPORTS:
            if str(cr.get("id")) == str(report_id):
                return cr

        # 3. Check remote DB
        category_cache = _get_category_cache()
        conn = _get_remote_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                query_sql = """
                    SELECT 
                        ar.id,
                        ar.title,
                        ar.language,
                        ar.overview,
                        ar.year_of_report as year,
                        ar.date_on_which_report_tabled as tabled_date,
                        ar.main_report_file,
                        ar.download_audit_report,
                        ar.youtube_video_url,
                        ar.digital_report,
                        ar.report_thumb_img,
                        ar.sector as raw_sector,
                        ar.report_type as raw_report_type,
                        s.id as state_id,
                        s.name as state_name,
                        gc_gov.title as level,
                        gc_rep.title as single_rep_type,
                        gc_sec.title as single_sector,
                        gc_dept.title as dept_name,
                        gc_dept.image as dept_image
                    FROM cag_revamp.audit_reports ar
                    LEFT JOIN cag_revamp.states s ON ar.state = s.id
                    LEFT JOIN cag_revamp.general_categories gc_gov ON ar.government_type = gc_gov.id
                    LEFT JOIN cag_revamp.general_categories gc_rep ON gc_rep.id::text = split_part(ar.report_type, ',', 1)
                    LEFT JOIN cag_revamp.general_categories gc_sec ON gc_sec.id::text = split_part(ar.sector, ',', 1)
                    LEFT JOIN cag_revamp.general_categories gc_dept ON ar.union_department_type = gc_dept.id
                    WHERE ar.id::text = %s
                    LIMIT 1;
                """
                cur.execute(query_sql, [str(report_id)])
                r = cur.fetchone()

                if r:
                    main_file = r.get("main_report_file") or r.get("download_audit_report") or ""
                    pdf_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/{main_file}" if main_file else "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"

                    raw_sec = r.get("raw_sector") or ""
                    sec_ids = [int(x.strip()) for x in raw_sec.split(",") if x.strip().isdigit()]
                    sec_titles = [category_cache[sid] for sid in sec_ids if sid in category_cache]
                    formatted_sector = " | ".join(sec_titles) if sec_titles else (r.get("single_sector") or "Finance")
                    primary_sec_id = str(sec_ids[0]) if sec_ids else ""

                    raw_type = r.get("raw_report_type") or ""
                    type_ids = [int(x.strip()) for x in raw_type.split(",") if x.strip().isdigit()]
                    type_titles = [category_cache[tid] for tid in type_ids if tid in category_cache]
                    formatted_type = ", ".join(type_titles) if type_titles else (r.get("single_rep_type") or "Compliance")

                    tag = sec_titles[0] if sec_titles else (r.get("single_sector") or "Finance")

                    raw_video = r.get("youtube_video_url") or ""
                    video_url = ""
                    if raw_video and raw_video not in ('[""]', '[]', 'None'):
                        video_url = raw_video.strip('[]"\' ')

                    # Fetch child chapters
                    cur.execute("""
                        SELECT id, title, main_report_file, download_audit_report, year_of_report
                        FROM cag_revamp.audit_reports
                        WHERE parent_id = %s AND status = 1
                        ORDER BY id ASC;
                    """, (r["id"],))
                    chapters = []
                    for ch in cur.fetchall():
                        cf = ch.get("main_report_file") or ch.get("download_audit_report") or ""
                        chapters.append({
                            "id": ch["id"],
                            "title": ch.get("title") or "Chapter",
                            "file_name": cf,
                            "pdf_url": f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/{cf}" if cf else "#",
                        })

                    # Fetch supplementary files
                    cur.execute("""
                        SELECT id, file_title, download_audit_report
                        FROM cag_revamp.audit_report_file
                        WHERE audit_reports_id = %s AND status = 1
                        ORDER BY id ASC;
                    """, (r["id"],))
                    files = []
                    for f in cur.fetchall():
                        cf = f.get("download_audit_report") or ""
                        files.append({
                            "id": f["id"],
                            "title": f.get("file_title") or "Supplementary Document",
                            "file_name": cf,
                            "pdf_url": f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/{cf}" if cf else "#",
                        })

                    cur.close()
                    conn.close()

                    tabled = str(r.get("tabled_date") or "")
                    year_val = str(r.get("year") or "")
                    date_str = tabled if tabled else year_val if year_val else "2026"

                    card_image = resolve_report_image(
                        sector=formatted_sector,
                        sector_id=primary_sec_id,
                        title=r.get("title") or "",
                        thumb_img=r.get("report_thumb_img") or "",
                        dept_img=r.get("dept_image") or "",
                        state_name=r.get("state_name") or "",
                    )

                    return {
                        "id": str(r["id"]),
                        "title": r.get("title") or "Audit Report",
                        "language": r.get("language") or "en",
                        "overview": r.get("overview") or "",
                        "desc": r.get("overview") or "",
                        "year": year_val,
                        "tabled_date": tabled,
                        "date": date_str,
                        "level": r.get("level") or "Union",
                        "report_type": formatted_type,
                        "sector": formatted_sector,
                        "tag": tag,
                        "state_name": r.get("state_name") or "",
                        "state_id": r.get("state_id"),
                        "image": card_image,
                        "pdf_url": pdf_url,
                        "file_name": main_file,
                        "video_url": video_url,
                        "chapters": chapters,
                        "files": files,
                        "source": "remote_db",
                    }
                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB] Fetch by id failed: {e}")
                if conn:
                    conn.close()

        # Fallback check
        for fb in ReportsService._get_fallback_reports():
            if str(fb["id"]) == str(report_id):
                return fb

        return None

    @staticmethod
    def get_filter_options() -> Dict[str, Any]:
        """Return distinct levels, sectors, report types, years, and states for the side menu filters."""
        conn = _get_remote_conn()
        levels = ["All", "Union", "States", "Local Bodies"]
        sectors = [
            "All Sectors",
            "Finance",
            "Transport & Infrastructure",
            "Education, Health & Family Welfare",
            "Environment and Sustainable Development",
            "IT Audit",
            "Defence and National Security",
            "Commercial",
            "Power & Energy",
            "Taxes and Duties",
            "Agriculture and Rural Development",
            "Local Bodies",
            "Science and Technology",
        ]
        report_types = ["All", "Compliance", "Financial", "Performance", "ADC reports"]
        states_list: List[Dict[str, Any]] = []

        if conn:
            try:
                cur = conn.cursor()
                cur.execute("SELECT title FROM cag_revamp.general_categories WHERE parent_id = 6 AND status = 1 ORDER BY title;")
                db_sectors = [row[0] for row in cur.fetchall() if row[0]]
                if db_sectors:
                    sectors = ["All Sectors"] + sorted(list(set(db_sectors)))

                cur.execute("SELECT title FROM cag_revamp.general_categories WHERE parent_id = 5 AND status = 1 ORDER BY title;")
                db_types = [row[0] for row in cur.fetchall() if row[0]]
                if db_types:
                    report_types = ["All"] + sorted(list(set(db_types)))

                cur.execute("SELECT id, name, slug FROM cag_revamp.states ORDER BY name;")
                states_list = [{"id": r[0], "name": r[1], "slug": r[2]} for r in cur.fetchall()]

                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB] Filter options failed: {e}")
                if conn:
                    conn.close()

        years = [str(y) for y in range(2026, 2014, -1)]

        return {
            "levels": levels,
            "sectors": sectors,
            "report_types": report_types,
            "years": years,
            "states": states_list,
        }

    @staticmethod
    def save_report(data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new or updated report to PostgreSQL remote DB and local store."""
        raw_id = data.get("id") or data.get("rawId")
        title = data.get("title") or data.get("title_en") or "Audit Report"
        title_hi = data.get("title_hi") or ""
        overview = data.get("overview") or data.get("desc") or ""

        # Parse year
        year_raw = data.get("year") or data.get("year_of_report") or 2026
        try:
            year_int = int(year_raw)
        except Exception:
            year_int = 2026

        # Parse sector
        sector_str = str(data.get("sector") or "Finance").strip()
        sector_id = SECTOR_MAP.get(sector_str.lower(), sector_str)

        # Parse report type
        type_str = str(data.get("report_type") or data.get("type") or "Performance").strip()
        type_id = TYPE_MAP.get(type_str.lower(), type_str)

        # Parse level
        level_str = str(data.get("level") or "Union").strip().lower()
        if "state" in level_str:
            gov_type = 2
        elif "local" in level_str:
            gov_type = 3
        else:
            gov_type = 1

        # Parse state
        state_id = data.get("state_id") or data.get("state")
        try:
            state_int = int(state_id) if state_id else None
        except Exception:
            state_int = None

        main_file = data.get("main_report_file") or data.get("download_audit_report") or data.get("file_name") or ""
        if not main_file and (data.get("pdfUrl") or data.get("pdf_url")):
            full_pdf = data.get("pdfUrl") or data.get("pdf_url")
            main_file = full_pdf.split("/")[-1] if "/" in full_pdf else full_pdf

        video_url = data.get("video_url") or data.get("videoUrl") or ""
        is_active = 1 if data.get("is_active", True) else 0

        created_or_updated_id = None

        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                is_numeric_id = False
                if raw_id is not None:
                    try:
                        int(raw_id)
                        is_numeric_id = True
                    except ValueError:
                        is_numeric_id = False

                if is_numeric_id:
                    # Check if row exists in DB
                    cur.execute("SELECT id FROM cag_revamp.audit_reports WHERE id = %s;", (int(raw_id),))
                    exists = cur.fetchone()
                    if exists:
                        cur.execute("""
                            UPDATE cag_revamp.audit_reports
                            SET title = %s,
                                overview = %s,
                                year_of_report = %s,
                                sector = %s,
                                report_type = %s,
                                government_type = %s,
                                state = %s,
                                main_report_file = %s,
                                download_audit_report = %s,
                                youtube_video_url = %s,
                                status = %s,
                                updated_at = NOW()
                            WHERE id = %s
                            RETURNING id;
                        """, (
                            title, overview, year_int, str(sector_id), str(type_id),
                            gov_type, state_int, main_file, main_file, video_url, is_active, int(raw_id)
                        ))
                        row = cur.fetchone()
                        if row:
                            created_or_updated_id = str(row["id"])
                    else:
                        is_numeric_id = False

                if not is_numeric_id or not created_or_updated_id:
                    # INSERT new record
                    cur.execute("""
                        INSERT INTO cag_revamp.audit_reports (
                            title, language, overview, year_of_report, sector, report_type,
                            government_type, state, main_report_file, download_audit_report,
                            youtube_video_url, status, created_at, updated_at
                        ) VALUES (
                            %s, 'en', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                        )
                        RETURNING id;
                    """, (
                        title, overview, year_int, str(sector_id), str(type_id),
                        gov_type, state_int, main_file, main_file, video_url, is_active
                    ))
                    row = cur.fetchone()
                    if row:
                        created_or_updated_id = str(row["id"])

                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] save_report error: {e}")
                if conn:
                    conn.close()

        final_id = created_or_updated_id or raw_id or f"rep-local-{len(_load_json(LOCAL_REPORTS_FILE, [])) + 1}"
        data["id"] = str(final_id)
        data["rawId"] = str(final_id)
        data["source"] = "remote_db" if created_or_updated_id else "local_cms"

        # Also sync to local JSON
        local_reports = _load_json(LOCAL_REPORTS_FILE, [])
        updated = False
        for idx, item in enumerate(local_reports):
            if str(item.get("id")) == str(final_id):
                local_reports[idx] = data
                updated = True
                break
        if not updated:
            local_reports.insert(0, data)
        _save_json(LOCAL_REPORTS_FILE, local_reports)

        return data

    @staticmethod
    def save_report(data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a new or updated report to PostgreSQL remote DB and local store."""
        raw_id = data.get("id") or data.get("rawId")
        title = data.get("title") or data.get("title_en") or "Audit Report"
        title_hi = data.get("title_hi") or ""
        overview = data.get("overview") or data.get("desc") or ""

        # Parse year
        year_raw = data.get("year") or data.get("year_of_report") or 2026
        try:
            year_int = int(year_raw)
        except Exception:
            year_int = 2026

        # Parse sector
        sector_str = str(data.get("sector") or "Finance").strip()
        sector_id = SECTOR_MAP.get(sector_str.lower(), sector_str)

        # Parse report type
        type_str = str(data.get("report_type") or data.get("type") or "Performance").strip()
        type_id = TYPE_MAP.get(type_str.lower(), type_str)

        # Parse level
        level_str = str(data.get("level") or "Union").strip().lower()
        if "state" in level_str:
            gov_type = 2
        elif "local" in level_str:
            gov_type = 3
        else:
            gov_type = 1

        # Parse state
        state_id = data.get("state_id") or data.get("state")
        try:
            state_int = int(state_id) if state_id else None
        except Exception:
            state_int = None

        main_file = data.get("main_report_file") or data.get("download_audit_report") or data.get("file_name") or ""
        if not main_file and (data.get("pdfUrl") or data.get("pdf_url")):
            full_pdf = data.get("pdfUrl") or data.get("pdf_url")
            main_file = full_pdf.split("/")[-1] if "/" in full_pdf else full_pdf

        video_url = data.get("video_url") or data.get("videoUrl") or ""
        is_active = 1 if data.get("is_active", True) else 0

        created_or_updated_id = None

        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                is_numeric_id = False
                if raw_id is not None:
                    try:
                        int(raw_id)
                        is_numeric_id = True
                    except ValueError:
                        is_numeric_id = False

                if is_numeric_id:
                    cur.execute("SELECT id FROM cag_revamp.audit_reports WHERE id = %s;", (int(raw_id),))
                    exists = cur.fetchone()
                    if exists:
                        cur.execute("""
                            UPDATE cag_revamp.audit_reports
                            SET title = %s,
                                overview = %s,
                                year_of_report = %s,
                                sector = %s,
                                report_type = %s,
                                government_type = %s,
                                state = %s,
                                main_report_file = %s,
                                download_audit_report = %s,
                                youtube_video_url = %s,
                                status = %s,
                                updated_at = NOW()
                            WHERE id = %s
                            RETURNING id;
                        """, (
                            title, overview, year_int, str(sector_id), str(type_id),
                            gov_type, state_int, main_file, main_file, video_url, is_active, int(raw_id)
                        ))
                        row = cur.fetchone()
                        if row:
                            created_or_updated_id = str(row["id"])
                    else:
                        is_numeric_id = False

                if not is_numeric_id or not created_or_updated_id:
                    cur.execute("""
                        INSERT INTO cag_revamp.audit_reports (
                            title, language, overview, year_of_report, sector, report_type,
                            government_type, state, main_report_file, download_audit_report,
                            youtube_video_url, status, created_at, updated_at
                        ) VALUES (
                            %s, 'en', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                        )
                        RETURNING id;
                    """, (
                        title, overview, year_int, str(sector_id), str(type_id),
                        gov_type, state_int, main_file, main_file, video_url, is_active
                    ))
                    row = cur.fetchone()
                    if row:
                        created_or_updated_id = str(row["id"])

                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] save_report error: {e}")
                if conn:
                    conn.close()

        final_id = created_or_updated_id or raw_id or f"rep-local-{len(_load_json(LOCAL_REPORTS_FILE, [])) + 1}"
        data["id"] = str(final_id)
        data["rawId"] = str(final_id)
        data["source"] = "remote_db" if created_or_updated_id else "local_cms"

        local_reports = _load_json(LOCAL_REPORTS_FILE, [])
        updated = False
        for idx, item in enumerate(local_reports):
            if str(item.get("id")) == str(final_id):
                local_reports[idx] = data
                updated = True
                break
        if not updated:
            local_reports.insert(0, data)
        _save_json(LOCAL_REPORTS_FILE, local_reports)

        return data

    @staticmethod
    def save_local_report(data: Dict[str, Any]) -> Dict[str, Any]:
        """Backward-compatible alias for save_report."""
        return ReportsService.save_report(data)

    @staticmethod
    def delete_report(report_id: str) -> bool:
        """Mark a report deleted in remote DB (status=0) and local store."""
        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor()
                if str(report_id).isdigit():
                    cur.execute("UPDATE cag_revamp.audit_reports SET status = 0, updated_at = NOW() WHERE id = %s;", (int(report_id),))
                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] delete_report error: {e}")
                if conn:
                    conn.close()

        local_reports = _load_json(LOCAL_REPORTS_FILE, [])
        found = False
        for idx, item in enumerate(local_reports):
            if str(item.get("id")) == str(report_id):
                local_reports[idx]["is_deleted"] = True
                found = True
                break

        if not found:
            local_reports.append({"id": str(report_id), "is_deleted": True})

        _save_json(LOCAL_REPORTS_FILE, local_reports)
        return True

    @staticmethod
    def delete_local_report(report_id: str) -> bool:
        """Backward-compatible alias for delete_report."""
        return ReportsService.delete_report(report_id)

    @staticmethod
    def get_state_account_by_id(account_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single state account record."""
        local = _load_json(LOCAL_STATE_ACCOUNTS_FILE, [])
        for a in local:
            if str(a.get("id")) == str(account_id):
                if a.get("is_deleted"):
                    return None
                return a

        conn = _get_remote_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                cur.execute("""
                    SELECT 
                        sar.id, sar.title, sar.year, sar.month, sar.volume, sar.uploads, sar.created,
                        s.id as state_id, s.name as state_name,
                        gc.id as category_id, gc.title as category_name
                    FROM cag_revamp.state_accounts_report sar
                    LEFT JOIN cag_revamp.states s ON sar.account_state = s.id
                    LEFT JOIN cag_revamp.general_categories gc ON sar.general_category_id = gc.id
                    WHERE sar.id::text = %s AND sar.status = 1
                    LIMIT 1;
                """, [str(account_id)])
                r = cur.fetchone()
                cur.close()
                conn.close()
                if r:
                    fname = r.get("uploads") or ""
                    return {
                        "id": r["id"],
                        "title": r.get("title") or "State Account Statement",
                        "title_en": r.get("title") or "State Account Statement",
                        "year": r.get("year") or "",
                        "account_year": r.get("year") or "",
                        "month": r.get("month") or "",
                        "volume": r.get("volume") or "",
                        "file_name": fname,
                        "file_url": f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_account_report/{fname}" if fname else "",
                        "pdf_url": f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_account_report/{fname}" if fname else "",
                        "state_id": r.get("state_id"),
                        "state_name": r.get("state_name") or "",
                        "category_id": r.get("category_id"),
                        "category_name": r.get("category_name") or "Accounts at a Glance",
                        "created_at": str(r.get("created") or ""),
                        "is_active": True,
                        "source": "remote_db"
                    }
            except Exception as e:
                logger.error(f"[RemoteDB] Get state account by id error: {e}")
                if conn:
                    conn.close()
        return None

    @staticmethod
    def save_state_account(data: Dict[str, Any]) -> Dict[str, Any]:
        """Save state account to PostgreSQL remote DB and local store."""
        raw_id = data.get("id") or data.get("rawId")
        title = data.get("title") or data.get("title_en") or "State Account Statement"
        state_id = data.get("state_id") or data.get("account_state") or 1
        try:
            state_int = int(state_id)
        except Exception:
            state_int = 1

        cat_name = data.get("category_name") or "Accounts at a Glance"
        cat_id = 923
        if "appropriation" in str(cat_name).lower():
            cat_id = 924
        elif "finance" in str(cat_name).lower():
            cat_id = 925
        elif "monthly" in str(cat_name).lower():
            cat_id = 927

        year_str = str(data.get("year") or data.get("account_year") or "2024-25").strip()
        try:
            m = re.search(r'\d{4}', year_str)
            ac_year = int(m.group(0)) if m else 2024
        except Exception:
            ac_year = 2024

        month = str(data.get("month") or "Annual").strip()
        volume = str(data.get("volume") or "Vol I").strip()
        uploads = data.get("file_name") or data.get("uploads") or ""
        if not uploads and (data.get("file_url") or data.get("pdf_url")):
            fu = data.get("file_url") or data.get("pdf_url")
            uploads = fu.split("/")[-1] if "/" in fu else fu
        if not uploads:
            uploads = "CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"

        is_active = 1 if data.get("is_active", True) else 0

        created_or_updated_id = None
        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                is_numeric_id = False
                if raw_id is not None:
                    try:
                        int(raw_id)
                        is_numeric_id = True
                    except ValueError:
                        is_numeric_id = False

                if is_numeric_id:
                    cur.execute("SELECT id FROM cag_revamp.state_accounts_report WHERE id = %s;", (int(raw_id),))
                    exists = cur.fetchone()
                    if exists:
                        cur.execute("""
                            UPDATE cag_revamp.state_accounts_report
                            SET title = %s,
                                account_state = %s,
                                general_category_id = %s,
                                year = %s,
                                ac_year = %s,
                                month = %s,
                                volume = %s,
                                uploads = %s,
                                status = %s,
                                modified = NOW()
                            WHERE id = %s
                            RETURNING id;
                        """, (
                            title, state_int, cat_id, year_str, ac_year, month, volume, uploads, is_active, int(raw_id)
                        ))
                        row = cur.fetchone()
                        if row:
                            created_or_updated_id = str(row["id"])
                    else:
                        is_numeric_id = False

                if not is_numeric_id or not created_or_updated_id:
                    cur.execute("""
                        INSERT INTO cag_revamp.state_accounts_report (
                            title, language, is_state_ut, account_state, general_category_id,
                            year, ac_year, month, volume, uploads, status, created_by, created, modified
                        ) VALUES (
                            %s, 'en', 's', %s, %s, %s, %s, %s, %s, %s, %s, 1, NOW(), NOW()
                        )
                        RETURNING id;
                    """, (
                        title, state_int, cat_id, year_str, ac_year, month, volume, uploads, is_active
                    ))
                    row = cur.fetchone()
                    if row:
                        created_or_updated_id = str(row["id"])

                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] save_state_account error: {e}")
                if conn:
                    conn.close()

        final_id = created_or_updated_id or raw_id or f"sa-local-{len(_load_json(LOCAL_STATE_ACCOUNTS_FILE, [])) + 1}"
        data["id"] = str(final_id)
        data["rawId"] = str(final_id)
        data["source"] = "remote_db" if created_or_updated_id else "local_cms"

        local = _load_json(LOCAL_STATE_ACCOUNTS_FILE, [])
        updated = False
        for idx, item in enumerate(local):
            if str(item.get("id")) == str(final_id):
                local[idx] = data
                updated = True
                break
        if not updated:
            local.insert(0, data)
        _save_json(LOCAL_STATE_ACCOUNTS_FILE, local)

        return data

    @staticmethod
    def save_local_state_account(data: Dict[str, Any]) -> Dict[str, Any]:
        """Backward-compatible alias for save_state_account."""
        return ReportsService.save_state_account(data)

    @staticmethod
    def delete_state_account(account_id: str) -> bool:
        """Mark a state account deleted in remote DB (status=0) and local store."""
        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor()
                if str(account_id).isdigit():
                    cur.execute("UPDATE cag_revamp.state_accounts_report SET status = 0, modified = NOW() WHERE id = %s;", (int(account_id),))
                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] delete_state_account error: {e}")
                if conn:
                    conn.close()

        local = _load_json(LOCAL_STATE_ACCOUNTS_FILE, [])
        found = False
        for idx, item in enumerate(local):
            if str(item.get("id")) == str(account_id):
                local[idx]["is_deleted"] = True
                found = True
                break

        if not found:
            local.append({"id": str(account_id), "is_deleted": True})

        _save_json(LOCAL_STATE_ACCOUNTS_FILE, local)
        return True

    @staticmethod
    def delete_local_state_account(account_id: str) -> bool:
        """Backward-compatible alias for delete_state_account."""
        return ReportsService.delete_state_account(account_id)

    @staticmethod
    def get_state_accounts(
        page: int = 1,
        page_size: int = 20,
        state_id: Optional[int] = None,
        state: str = "",
        category_name: str = "",
        year: str = "",
        query: str = "",
        sort: str = "year_desc",
    ) -> Dict[str, Any]:
        """Fetch state accounts reports from cag_revamp.state_accounts_report and local CMS."""
        page = max(1, page)
        page_size = max(1, min(page_size, 100))
        offset = (page - 1) * page_size

        # Local CMS overrides
        local_items = _load_json(LOCAL_STATE_ACCOUNTS_FILE, [])
        filtered_local = []
        for a in local_items:
            if a.get("is_deleted"):
                continue
            if query and query.lower() not in (a.get("title", "") or a.get("title_en", "")).lower():
                continue
            if year and year != "All" and year not in str(a.get("year", "") or a.get("account_year", "")):
                continue
            if category_name and category_name != "All":
                cat_lower = category_name.lower()
                item_cat = str(a.get("category_name", "")).lower()
                if "glance" in cat_lower:
                    if "glance" not in item_cat:
                        continue
                elif "appropriation" in cat_lower:
                    if "appropriation" not in item_cat:
                        continue
                elif "finance" in cat_lower:
                    if "finance" not in item_cat:
                        continue
                elif "monthly" in cat_lower:
                    if "monthly" not in item_cat:
                        continue
                elif "faaa" in cat_lower or "fa&aa" in cat_lower:
                    if "fa" not in item_cat and "fa&aa" not in item_cat:
                        continue
                elif cat_lower not in item_cat and item_cat not in cat_lower:
                    continue

            if state_id and str(a.get("state_id")) != str(state_id):
                continue
            if state and state != "All":
                st_clean = state.lower().replace('&', 'and').strip()
                item_st = str(a.get("state_name", "")).lower().replace('&', 'and').strip()
                if "puducherry" in st_clean or "pondicherry" in st_clean:
                    if "puducherry" not in item_st and "pondicherry" not in item_st:
                        continue
                elif "jammu" in st_clean or "kashmir" in st_clean:
                    if "jammu" not in item_st and "kashmir" not in item_st:
                        continue
                elif st_clean not in item_st and item_st not in st_clean:
                    continue
            filtered_local.append(a)

        # Sort filtered local CMS items
        if sort in ("year_asc", "oldest"):
            filtered_local.sort(key=lambda x: (str(x.get("account_year", x.get("year", ""))).strip(), str(x.get("id", ""))))
        elif sort == "title_asc":
            filtered_local.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).lower())
        elif sort == "title_desc":
            filtered_local.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).lower(), reverse=True)
        elif sort == "state_asc":
            filtered_local.sort(key=lambda x: str(x.get("state_name", "")).lower())
        else:
            filtered_local.sort(key=lambda x: (str(x.get("account_year", x.get("year", ""))).strip(), str(x.get("id", ""))), reverse=True)

        conn = _get_remote_conn()
        remote_items = []
        remote_total = 0

        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                where_clauses = ["sar.status = 1"]
                params: List[Any] = []

                if state_id:
                    where_clauses.append("sar.account_state = %s")
                    params.append(state_id)
                elif state and state != "All":
                    if str(state).isdigit():
                        where_clauses.append("sar.account_state = %s")
                        params.append(int(state))
                    else:
                        clean_state = state.replace('&', 'and').strip()
                        state_slug = state.lower().replace('&', 'and').replace(' ', '-')
                        if 'puducherry' in clean_state.lower() or 'pondicherry' in clean_state.lower():
                            where_clauses.append("(s.name ILIKE %s OR s.name ILIKE %s OR s.slug ILIKE %s)")
                            params.extend(['%puducherry%', '%pondicherry%', '%pondi%'])
                        elif 'jammu' in clean_state.lower() or 'kashmir' in clean_state.lower():
                            where_clauses.append("(s.name ILIKE %s OR s.slug ILIKE %s)")
                            params.extend(['%jammu%', '%jammu%'])
                        elif 'chandigarh' in clean_state.lower():
                            where_clauses.append("(s.name ILIKE %s OR s.slug ILIKE %s)")
                            params.extend(['%chandigarh%', '%chandigarh%'])
                        else:
                            where_clauses.append("(s.name ILIKE %s OR s.name ILIKE %s OR s.slug ILIKE %s)")
                            params.extend([f"%{state}%", f"%{clean_state}%", f"%{state_slug}%"])

                if category_name and category_name != "All":
                    cat_term = category_name.strip().lower()
                    if "glance" in cat_term:
                        where_clauses.append("gc.title ILIKE %s")
                        params.append("%glance%")
                    elif "appropriation" in cat_term:
                        where_clauses.append("gc.title ILIKE %s")
                        params.append("%appropriation%")
                    elif "finance" in cat_term:
                        where_clauses.append("gc.title ILIKE %s")
                        params.append("%finance%")
                    elif "monthly" in cat_term:
                        where_clauses.append("gc.title ILIKE %s")
                        params.append("%monthly%")
                    elif "faaa" in cat_term or "fa&aa" in cat_term:
                        where_clauses.append("(gc.title ILIKE %s OR gc.title ILIKE %s)")
                        params.extend(["%fa%aa%", "%fa&aa%"])
                    else:
                        where_clauses.append("gc.title ILIKE %s")
                        params.append(f"%{category_name}%")

                if year and year != "All":
                    where_clauses.append("sar.year ILIKE %s")
                    params.append(f"%{year}%")

                if query:
                    where_clauses.append("sar.title ILIKE %s")
                    params.append(f"%{query}%")

                where_sql = " AND ".join(where_clauses)

                cur.execute(f"""
                    SELECT count(*) FROM cag_revamp.state_accounts_report sar
                    LEFT JOIN cag_revamp.states s ON sar.account_state = s.id
                    LEFT JOIN cag_revamp.general_categories gc ON sar.general_category_id = gc.id
                    WHERE {where_sql};
                """, params)
                remote_total = cur.fetchone()["count"]

                if sort in ("newest", "newly_added", "latest"):
                    order_by_sql = "ORDER BY sar.id DESC"
                elif sort == "oldest":
                    order_by_sql = "ORDER BY sar.id ASC"
                elif sort == "year_desc":
                    order_by_sql = "ORDER BY NULLIF(TRIM(sar.year), '') DESC NULLS LAST, sar.id DESC"
                elif sort == "year_asc":
                    order_by_sql = "ORDER BY NULLIF(TRIM(sar.year), '') ASC NULLS LAST, sar.id ASC"
                elif sort == "title_asc":
                    order_by_sql = "ORDER BY LOWER(TRIM(sar.title)) ASC, sar.id DESC"
                elif sort == "title_desc":
                    order_by_sql = "ORDER BY LOWER(TRIM(sar.title)) DESC, sar.id DESC"
                elif sort == "state_asc":
                    order_by_sql = "ORDER BY LOWER(TRIM(s.name)) ASC NULLS LAST, sar.id DESC"
                else:
                    order_by_sql = "ORDER BY sar.id DESC"

                cur.execute(f"""
                    SELECT 
                        sar.id,
                        sar.title,
                        sar.year,
                        sar.month,
                        sar.volume,
                        sar.uploads,
                        sar.created,
                        s.id as state_id,
                        s.name as state_name,
                        gc.id as category_id,
                        gc.title as category_name
                    FROM cag_revamp.state_accounts_report sar
                    LEFT JOIN cag_revamp.states s ON sar.account_state = s.id
                    LEFT JOIN cag_revamp.general_categories gc ON sar.general_category_id = gc.id
                    WHERE {where_sql}
                    {order_by_sql}
                    LIMIT %s OFFSET %s;
                """, params + [page_size, offset])
                for r in cur.fetchall():
                    file_name = r.get("uploads") or ""
                    pdf_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_account_report/{file_name}" if file_name else "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"
                    remote_items.append({
                        "id": r["id"],
                        "rawId": str(r["id"]),
                        "title": r.get("title") or "State Account Statement",
                        "title_en": r.get("title") or "State Account Statement",
                        "year": r.get("year") or "",
                        "account_year": r.get("year") or "",
                        "month": r.get("month") or "",
                        "volume": r.get("volume") or "",
                        "file_name": file_name,
                        "file_url": pdf_url,
                        "pdf_url": pdf_url,
                        "state_id": r.get("state_id"),
                        "state_name": r.get("state_name") or "",
                        "category_id": r.get("category_id"),
                        "category_name": r.get("category_name") or "Accounts at a Glance",
                        "created_at": str(r.get("created") or ""),
                        "is_active": True,
                        "source": "remote_db",
                    })
                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB] State accounts query error: {e}")
                if conn:
                    conn.close()

        deleted_ids = {str(a.get("id")) for a in local_items if a.get("is_deleted")}

        def _parse_sa_id(x):
            raw = str(x.get("rawId") or x.get("id") or "0")
            digits = "".join(ch for ch in raw if ch.isdigit())
            base_val = int(digits) if digits else 0
            if not x.get("is_seed"):
                return 1000000000 + base_val
            return base_val

        def _parse_sa_year(x):
            raw = str(x.get("account_year") or x.get("year") or "0")
            digits = "".join(ch for ch in raw if ch.isdigit())
            return int(digits[:4]) if digits else 0

        def _sort_sa_items(items_list):
            if sort in ("newest", "newly_added", "latest"):
                items_list.sort(key=lambda x: _parse_sa_id(x), reverse=True)
            elif sort == "oldest":
                items_list.sort(key=lambda x: _parse_sa_id(x))
            elif sort == "year_desc":
                items_list.sort(key=lambda x: (_parse_sa_year(x), _parse_sa_id(x)), reverse=True)
            elif sort == "year_asc":
                items_list.sort(key=lambda x: (_parse_sa_year(x), _parse_sa_id(x)))
            elif sort == "title_asc":
                items_list.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).strip().lower())
            elif sort == "title_desc":
                items_list.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).strip().lower(), reverse=True)
            elif sort == "state_asc":
                items_list.sort(key=lambda x: str(x.get("state_name", "")).strip().lower())
            else:
                items_list.sort(key=lambda x: _parse_sa_id(x), reverse=True)

        if remote_items or remote_total > 0:
            # When remote DB is connected, only include custom user-created/edited CMS items, not offline seeds
            user_local = [a for a in filtered_local if not a.get("is_seed") and str(a.get("id")) not in deleted_ids]
            user_local_ids = {str(a.get("id")) for a in user_local}
            filtered_remote = [
                r for r in remote_items
                if str(r.get("id")) not in deleted_ids and str(r.get("id")) not in user_local_ids
            ]
            all_items = user_local + filtered_remote
            _sort_sa_items(all_items)
            total = len(user_local) + max(0, remote_total - len(deleted_ids.intersection({str(r.get("id")) for r in remote_items})))
            result_items = all_items[:page_size]
        else:
            # When remote DB is offline, serve full rich local dataset with offset pagination
            all_items = [a for a in filtered_local if str(a.get("id")) not in deleted_ids]
            _sort_sa_items(all_items)
            total = len(all_items)
            result_items = all_items[offset : offset + page_size]

        return {
            "items": result_items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if page_size else 1,
        }

    @staticmethod
    def get_combined_account_by_id(account_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single combined account record."""
        local = _load_json(LOCAL_COMBINED_ACCOUNTS_FILE, [])
        for a in local:
            if str(a.get("id")) == str(account_id):
                if a.get("is_deleted"):
                    return None
                return a

        conn = _get_remote_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                cur.execute("""
                    SELECT id, title, account_year, upload_file, created_at
                    FROM cag_revamp.combined_accounts
                    WHERE id::text = %s AND status = 1
                    LIMIT 1;
                """, [str(account_id)])
                r = cur.fetchone()
                cur.close()
                conn.close()
                if r:
                    fname = r.get("upload_file") or ""
                    return {
                        "id": r["id"],
                        "title": r.get("title") or "Combined Finance Account",
                        "title_en": r.get("title") or "Combined Finance Account",
                        "account_year": r.get("account_year") or "",
                        "file_name": fname,
                        "file_url": f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/combined_accounts/{fname}" if fname else "",
                        "pdf_url": f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/combined_accounts/{fname}" if fname else "",
                        "category": "conference" if "conference" in (r.get("title") or "").lower() else "combined",
                        "size": "18.5 MB",
                        "created_at": str(r.get("created_at") or ""),
                        "is_active": True,
                        "source": "remote_db"
                    }
            except Exception as e:
                logger.error(f"[RemoteDB] Get combined account by id error: {e}")
                if conn:
                    conn.close()
        return None

    @staticmethod
    def save_combined_account(data: Dict[str, Any]) -> Dict[str, Any]:
        """Save combined account to PostgreSQL DB and local store."""
        raw_id = data.get("id") or data.get("rawId")
        title = data.get("title") or data.get("title_en") or "Combined Finance Account"
        account_year = str(data.get("account_year") or data.get("year") or "2024 - 25").strip()
        upload_file = data.get("file_name") or data.get("upload_file") or ""
        if not upload_file and (data.get("file_url") or data.get("pdf_url")):
            fu = data.get("file_url") or data.get("pdf_url")
            upload_file = fu.split("/")[-1] if "/" in fu else fu
        if not upload_file:
            upload_file = "CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"

        is_active = 1 if data.get("is_active", True) else 0

        created_or_updated_id = None
        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                is_numeric_id = False
                if raw_id is not None:
                    try:
                        int(raw_id)
                        is_numeric_id = True
                    except ValueError:
                        is_numeric_id = False

                if is_numeric_id:
                    cur.execute("SELECT id FROM cag_revamp.combined_accounts WHERE id = %s;", (int(raw_id),))
                    exists = cur.fetchone()
                    if exists:
                        cur.execute("""
                            UPDATE cag_revamp.combined_accounts
                            SET title = %s,
                                account_year = %s,
                                upload_file = %s,
                                status = %s,
                                updated_at = NOW()
                            WHERE id = %s
                            RETURNING id;
                        """, (title, account_year, upload_file, is_active, int(raw_id)))
                        row = cur.fetchone()
                        if row:
                            created_or_updated_id = str(row["id"])
                    else:
                        is_numeric_id = False

                if not is_numeric_id or not created_or_updated_id:
                    cur.execute("""
                        INSERT INTO cag_revamp.combined_accounts (
                            title, language, account_year, upload_file, status, created_at, updated_at
                        ) VALUES (
                            %s, 'en', %s, %s, %s, NOW(), NOW()
                        )
                        RETURNING id;
                    """, (title, account_year, upload_file, is_active))
                    row = cur.fetchone()
                    if row:
                        created_or_updated_id = str(row["id"])

                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] save_combined_account error: {e}")
                if conn:
                    conn.close()

        final_id = created_or_updated_id or raw_id or f"ca-local-{len(_load_json(LOCAL_COMBINED_ACCOUNTS_FILE, [])) + 1}"
        data["id"] = str(final_id)
        data["rawId"] = str(final_id)
        data["source"] = "remote_db" if created_or_updated_id else "local_cms"

        local = _load_json(LOCAL_COMBINED_ACCOUNTS_FILE, [])
        updated = False
        for idx, item in enumerate(local):
            if str(item.get("id")) == str(final_id):
                local[idx] = data
                updated = True
                break
        if not updated:
            local.insert(0, data)
        _save_json(LOCAL_COMBINED_ACCOUNTS_FILE, local)

        return data

    @staticmethod
    def save_local_combined_account(data: Dict[str, Any]) -> Dict[str, Any]:
        """Backward-compatible alias for save_combined_account."""
        return ReportsService.save_combined_account(data)

    @staticmethod
    def delete_combined_account(account_id: str) -> bool:
        """Mark a combined account deleted in remote DB (status=0) and local store."""
        conn = _get_write_conn()
        if conn:
            try:
                cur = conn.cursor()
                if str(account_id).isdigit():
                    cur.execute("UPDATE cag_revamp.combined_accounts SET status = 0, updated_at = NOW() WHERE id = %s;", (int(account_id),))
                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB Write] delete_combined_account error: {e}")
                if conn:
                    conn.close()

        local = _load_json(LOCAL_COMBINED_ACCOUNTS_FILE, [])
        found = False
        for idx, item in enumerate(local):
            if str(item.get("id")) == str(account_id):
                local[idx]["is_deleted"] = True
                found = True
                break

        if not found:
            local.append({"id": str(account_id), "is_deleted": True})

        _save_json(LOCAL_COMBINED_ACCOUNTS_FILE, local)
        return True

    @staticmethod
    def delete_local_combined_account(account_id: str) -> bool:
        """Backward-compatible alias for delete_combined_account."""
        return ReportsService.delete_combined_account(account_id)

    @staticmethod
    def get_combined_accounts(
        page: int = 1,
        page_size: int = 20,
        year: str = "",
        query: str = "",
        category: str = "",
        sort: str = "year_desc",
    ) -> Dict[str, Any]:
        """Fetch combined accounts (CFRA) and conference documents."""
        page = max(1, page)
        page_size = max(1, min(page_size, 100))
        offset = (page - 1) * page_size

        # Local CMS overrides
        local_items = _load_json(LOCAL_COMBINED_ACCOUNTS_FILE, [])
        filtered_local = []
        for a in local_items:
            if a.get("is_deleted"):
                continue
            if query and query.lower() not in (a.get("title", "") or a.get("title_en", "")).lower():
                continue
            if year and year != "All" and year not in str(a.get("year", "") or a.get("account_year", "")):
                continue
            if category and category != "All" and category.lower() not in str(a.get("category", "")).lower():
                continue
            filtered_local.append(a)

        # Sort filtered local CMS items
        if sort in ("year_asc", "oldest"):
            filtered_local.sort(key=lambda x: (str(x.get("account_year", x.get("year", ""))).strip(), str(x.get("id", ""))))
        elif sort == "title_asc":
            filtered_local.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).lower())
        elif sort == "title_desc":
            filtered_local.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).lower(), reverse=True)
        else:
            filtered_local.sort(key=lambda x: (str(x.get("account_year", x.get("year", ""))).strip(), str(x.get("id", ""))), reverse=True)

        conn = _get_remote_conn()
        remote_items = []
        remote_total = 0

        if conn:
            try:
                cur = conn.cursor(cursor_factory=RealDictCursor)
                where_clauses = ["status = 1"]
                params: List[Any] = []

                if year and year != "All":
                    where_clauses.append("account_year ILIKE %s")
                    params.append(f"%{year}%")

                if query:
                    where_clauses.append("title ILIKE %s")
                    params.append(f"%{query}%")

                if category and category != "All":
                    if category == "conference":
                        where_clauses.append("title ILIKE %s")
                        params.append("%conference%")
                    elif category == "combined":
                        where_clauses.append("title NOT ILIKE %s")
                        params.append("%conference%")

                where_sql = " AND ".join(where_clauses)

                cur.execute(f"SELECT count(*) FROM cag_revamp.combined_accounts WHERE {where_sql};", params)
                remote_total = cur.fetchone()["count"]

                if sort in ("newest", "newly_added", "latest"):
                    order_by_sql = "ORDER BY id DESC"
                elif sort == "oldest":
                    order_by_sql = "ORDER BY id ASC"
                elif sort == "year_desc":
                    order_by_sql = "ORDER BY NULLIF(TRIM(account_year), '') DESC NULLS LAST, id DESC"
                elif sort == "year_asc":
                    order_by_sql = "ORDER BY NULLIF(TRIM(account_year), '') ASC NULLS LAST, id ASC"
                elif sort == "title_asc":
                    order_by_sql = "ORDER BY LOWER(TRIM(title)) ASC, id DESC"
                elif sort == "title_desc":
                    order_by_sql = "ORDER BY LOWER(TRIM(title)) DESC, id DESC"
                else:
                    order_by_sql = "ORDER BY id DESC"

                cur.execute(f"""
                    SELECT id, title, account_year, upload_file, created_at
                    FROM cag_revamp.combined_accounts
                    WHERE {where_sql}
                    {order_by_sql}
                    LIMIT %s OFFSET %s;
                """, params + [page_size, offset])
                for r in cur.fetchall():
                    fname = r.get("upload_file") or ""
                    pdf_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/combined_accounts/{fname}" if fname else "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf"
                    cat_val = "conference" if "conference" in (r.get("title") or "").lower() else "combined"
                    remote_items.append({
                        "id": r["id"],
                        "rawId": str(r["id"]),
                        "title": r.get("title") or "Combined Finance Account",
                        "title_en": r.get("title") or "Combined Finance Account",
                        "account_year": r.get("account_year") or "",
                        "file_name": fname,
                        "file_url": pdf_url,
                        "pdf_url": pdf_url,
                        "category": cat_val,
                        "size": "18.5 MB",
                        "created_at": str(r.get("created_at") or ""),
                        "is_active": True,
                        "source": "remote_db",
                    })
                cur.close()
                conn.close()
            except Exception as e:
                logger.error(f"[RemoteDB] Combined accounts query error: {e}")
                if conn:
                    conn.close()

        deleted_ids = {str(a.get("id")) for a in local_items if a.get("is_deleted")}

        def _parse_ca_id(x):
            raw = str(x.get("rawId") or x.get("id") or "0")
            digits = "".join(ch for ch in raw if ch.isdigit())
            base_val = int(digits) if digits else 0
            if not x.get("is_seed"):
                return 1000000000 + base_val
            return base_val

        def _parse_ca_year(x):
            raw = str(x.get("account_year") or x.get("year") or "0")
            digits = "".join(ch for ch in raw if ch.isdigit())
            return int(digits[:4]) if digits else 0

        def _sort_ca_items(items_list):
            if sort in ("newest", "newly_added", "latest"):
                items_list.sort(key=lambda x: _parse_ca_id(x), reverse=True)
            elif sort == "oldest":
                items_list.sort(key=lambda x: _parse_ca_id(x))
            elif sort == "year_desc":
                items_list.sort(key=lambda x: (_parse_ca_year(x), _parse_ca_id(x)), reverse=True)
            elif sort == "year_asc":
                items_list.sort(key=lambda x: (_parse_ca_year(x), _parse_ca_id(x)))
            elif sort == "title_asc":
                items_list.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).strip().lower())
            elif sort == "title_desc":
                items_list.sort(key=lambda x: str(x.get("title_en", x.get("title", ""))).strip().lower(), reverse=True)
            else:
                items_list.sort(key=lambda x: _parse_ca_id(x), reverse=True)

        if remote_items or remote_total > 0:
            # When remote DB is connected, only include custom user-created/edited CMS items, not offline seeds
            user_local = [a for a in filtered_local if not a.get("is_seed") and str(a.get("id")) not in deleted_ids]
            user_local_ids = {str(a.get("id")) for a in user_local}
            filtered_remote = [
                r for r in remote_items
                if str(r.get("id")) not in deleted_ids and str(r.get("id")) not in user_local_ids
            ]
            all_items = user_local + filtered_remote
            _sort_ca_items(all_items)
            total = len(user_local) + max(0, remote_total - len(deleted_ids.intersection({str(r.get("id")) for r in remote_items})))
            result_items = all_items[:page_size]
        else:
            # When remote DB is offline, serve full rich local dataset with offset pagination
            all_items = [a for a in filtered_local if str(a.get("id")) not in deleted_ids]
            _sort_ca_items(all_items)
            total = len(all_items)
            result_items = all_items[offset : offset + page_size]

        return {
            "items": result_items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if page_size else 1,
        }

    @staticmethod
    def _get_fallback_reports() -> List[Dict[str, Any]]:
        return FIGMA_CURATED_REPORTS

