import logging
import json
from typing import Optional, List, Dict, Any
from sqlalchemy import text
from app.core.database import SessionLocal

logger = logging.getLogger("uvicorn")

CDN_BASE_URL = "https://d7i5wg8xwe4hf.cloudfront.net/uploads"

def extract_clean_filename(val: Any) -> Optional[str]:
    if not val:
        return None
    s = str(val).strip()
    if not s or s.lower() in ('none', 'null'):
        return None
    if s.startswith('[') or s.startswith('{'):
        try:
            parsed = json.loads(s)
            if isinstance(parsed, list) and len(parsed) > 0:
                first = parsed[0]
                if isinstance(first, dict):
                    return first.get('name') or first.get('upload_file') or first.get('file') or first.get('tmp_name')
                return str(first)
            elif isinstance(parsed, dict):
                return parsed.get('name') or parsed.get('upload_file') or parsed.get('file') or parsed.get('default')
        except Exception:
            pass
    return s

def normalize_file_url(folder: str, filename: Optional[str]) -> Optional[str]:
    raw = extract_clean_filename(filename)
    if not raw:
        return None
    cleaned = str(raw).strip()
    if not cleaned or cleaned.lower() in ('none', 'null'):
        return None
    if cleaned.startswith("http://") or cleaned.startswith("https://"):
        return cleaned
    if cleaned.startswith("www."):
        return f"https://{cleaned}"
    cleaned = cleaned.lstrip("/")
    if cleaned.startswith("uploads/"):
        return f"https://d7i5wg8xwe4hf.cloudfront.net/{cleaned}"
    return f"{CDN_BASE_URL}/{folder}/{cleaned}"

def safe_extract_year(dt: Any, default: str = "2025") -> str:
    if not dt:
        return default
    if hasattr(dt, "year"):
        return str(dt.year)
    s = str(dt).strip()
    if len(s) >= 4 and s[:4].isdigit():
        return s[:4]
    return default

def safe_format_date(dt: Any, default: str = "") -> str:
    if not dt:
        return default
    if hasattr(dt, "strftime"):
        return dt.strftime("%Y-%m-%d")
    s = str(dt).strip()
    if len(s) >= 10:
        return s[:10]
    return s

def safe_extract_title(val: Any, culture: str = "en") -> tuple[str, str]:
    """
    Returns (title_en, title_hi) safely handling plain strings or JSON blobs.
    """
    if not val:
        return ("", "")
    s = str(val).strip()
    if s.startswith("{") and s.endswith("}"):
        try:
            parsed = json.loads(s)
            if isinstance(parsed, dict):
                t_en = parsed.get("default") or parsed.get("en") or list(parsed.values())[0] or ""
                t_hi = parsed.get("hi") or t_en
                return (str(t_en), str(t_hi))
        except Exception:
            pass
    return (s, s)

class ResourcesService:

    @staticmethod
    def get_resource_items(
        slug: str,
        query: Optional[str] = None,
        culture: str = "en",
        sort_by: str = "newest",
        page: int = 1,
        page_size: int = 50
    ) -> Dict[str, Any]:
        """
        Generic resource resolver mapping category slugs to their respective PostgreSQL tables.
        """
        slug_lower = slug.lower().strip().replace("_", "-")
        db = SessionLocal()
        try:
            db.execute(text("SET search_path TO cag_revamp, public;"))
            
            if slug_lower in ["recruitment-policy", "recruitment-rules", "recruitment"]:
                return ResourcesService._fetch_recruitment_rules(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["recruitment-notices", "recruitment-notice", "notices-recruitment", "career-notices"]:
                return ResourcesService._fetch_recruitment_notices(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["deputation", "deputation-circulars", "deputation-notices"]:
                return ResourcesService._fetch_deputation(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["young-professional-programme", "internships", "student-internship-programme", "young-professionals", "internship"]:
                return ResourcesService._fetch_internships(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["administrative-information-policy", "administrative-information"]:
                return ResourcesService._fetch_administrative_info(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["guidelines", "policy-guidelines"]:
                return ResourcesService._fetch_guidelines(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["guidance-notes", "guidance-notes-and-practice-guides"]:
                return ResourcesService._fetch_guidance_notes(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["manuals", "office-manuals", "act-and-manuals"]:
                return ResourcesService._fetch_manuals(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["standing-orders", "standing-order"]:
                return ResourcesService._fetch_standing_orders(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["press-releases", "press-release"]:
                return ResourcesService._fetch_press_releases(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["tenders", "tender", "procurement"]:
                return ResourcesService._fetch_tenders(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["circulars", "circular", "office-orders"]:
                return ResourcesService._fetch_circulars(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["speeches", "speech"]:
                return ResourcesService._fetch_speeches(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["photo-gallery", "photos"]:
                return ResourcesService._fetch_photo_gallery(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["video-gallery", "videos"]:
                return ResourcesService._fetch_video_gallery(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["study-reports", "study-reports-and-compendia"]:
                return ResourcesService._fetch_study_reports(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["rajbhasha-e-patrika", "rajbhasha"]:
                return ResourcesService._fetch_rajbhasha(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["annual-report", "annual-reports", "peer-review-report", "status-of-accounts-of-state-psus"]:
                return ResourcesService._fetch_ag_reports(db, slug_lower, query, culture, sort_by, page, page_size)
            elif slug_lower in ["right-to-information-policy", "rti-disclosure", "rti"]:
                return ResourcesService._fetch_rti(db, query, culture, sort_by, page, page_size)
            elif slug_lower in ["social-media-policy", "pidpi-policy-for-circulation", "citizen-charter"]:
                return ResourcesService._fetch_pages_policy(db, slug_lower, query, culture, sort_by, page, page_size)
            else:
                return ResourcesService._fetch_pages_policy(db, slug_lower, query, culture, sort_by, page, page_size)
        except Exception as e:
            logger.error(f"[ResourcesService] Error fetching '{slug}': {e}", exc_info=True)
            return {"items": [], "total": 0, "page": page, "page_size": page_size}
        finally:
            db.close()

    @staticmethod
    def _fetch_recruitment_rules(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.recruitment_rules {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, upload_file, created_at, status FROM cag_revamp.recruitment_rules {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created_at ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created_at DESC NULLS LAST, id DESC"
        
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"rr-{r['id']}",
                "title": t_en or "Recruitment Rule Document",
                "titleHi": t_hi or "भर्ती नियम दस्तावेज़",
                "category": "Recruitment Rules",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "1.2 MB",
                "fileUrl": normalize_file_url("recruitment_rules", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_recruitment_notices(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR document_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.recruitment_notices {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, document_title, document_uploaded, upload_file, recruitment_notice_date, close_date, created_at, status FROM cag_revamp.recruitment_notices {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY recruitment_notice_date ASC NULLS LAST, created_at ASC"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY recruitment_notice_date DESC NULLS LAST, id DESC"
        
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["document_uploaded"] or r["document_title"]
            ndate = r["recruitment_notice_date"] or r["created_at"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"rn-{r['id']}",
                "title": t_en or "Recruitment Notification",
                "titleHi": t_hi or "भर्ती सूचना",
                "category": "Recruitment Notice",
                "year": safe_extract_year(ndate),
                "date": safe_format_date(ndate),
                "closeDate": safe_format_date(r["close_date"]),
                "fileSize": "1.5 MB",
                "fileUrl": normalize_file_url("recruitment_notices", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_deputation(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND title ILIKE :q"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.deputation {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, pdf_file, created, modified, status FROM cag_revamp.deputation {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created DESC NULLS LAST, id DESC"
        
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["pdf_file"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"dep-{r['id']}",
                "title": t_en or "Deputation Notification Circular",
                "titleHi": t_hi or "प्रतिनियुक्ति अधिसूचना परिपत्र",
                "category": "Deputation Circular",
                "year": safe_extract_year(r["created"]),
                "date": safe_format_date(r["created"]),
                "fileSize": "1.1 MB",
                "fileUrl": normalize_file_url("deputation", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_internships(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.young_professional_programme {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, document, date_of_issue, created_at, status FROM cag_revamp.young_professional_programme {base_where} ORDER BY date_of_issue DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["document"] or r["file_title"]
            idate = r["date_of_issue"] or r["created_at"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"ypp-{r['id']}",
                "title": t_en or "Young Professionals & Student Internship Scheme",
                "titleHi": t_hi or "युवा पेशेवर और छात्र इंटर्नशिप योजना",
                "category": "Internship Programme",
                "year": safe_extract_year(idate),
                "date": safe_format_date(idate),
                "fileSize": "900 KB",
                "fileUrl": normalize_file_url("young_professional_programme", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_administrative_info(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.administrative_information {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, upload_file, link, html_data, created_at, status FROM cag_revamp.administrative_information {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created_at ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created_at DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            furl = normalize_file_url("administrative_information", fname) if fname else r["link"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"admin-{r['id']}",
                "title": t_en or "Administrative Policy Instruction",
                "titleHi": t_hi or "प्रशासनिक नीति निर्देश",
                "category": "Administrative Information",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "1.4 MB",
                "fileUrl": furl or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_guidelines(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.guidelines {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, upload_file, created_at, status FROM cag_revamp.guidelines {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created_at ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created_at DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"guide-{r['id']}",
                "title": t_en or "CAG Audit Guideline",
                "titleHi": t_hi or "सीएजी लेखा परीक्षा दिशा-निर्देश",
                "category": "Guidelines",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "2.1 MB",
                "fileUrl": normalize_file_url("guidelines", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_guidance_notes(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.guidance_notes_practice_guides {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, type, file_title, upload_file, created_at, status FROM cag_revamp.guidance_notes_practice_guides {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created_at ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created_at DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"gn-{r['id']}",
                "title": t_en or "Guidance Note & Practice Guide",
                "titleHi": t_hi or "मार्गदर्शन नोट एवं अभ्यास गाइड",
                "category": r["type"] or "Guidance Notes",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "1.8 MB",
                "fileUrl": normalize_file_url("guidance_notes_practice_guides", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_manuals(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.manuals {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, upload_file, created_at, status FROM cag_revamp.manuals {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created_at ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created_at DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"man-{r['id']}",
                "title": t_en or "Manual of Audit Procedures",
                "titleHi": t_hi or "लेखा परीक्षा प्रक्रिया नियमावली",
                "category": "Manuals",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "3.5 MB",
                "fileUrl": normalize_file_url("manuals", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_standing_orders(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_upload ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.office_mannual {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_upload, created, status FROM cag_revamp.office_mannual {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY created ASC NULLS LAST"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY created DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["file_upload"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"so-{r['id']}",
                "title": t_en or "Official Standing Order",
                "titleHi": t_hi or "आधिकारिक स्थायी आदेश",
                "category": "Standing Orders",
                "year": safe_extract_year(r["created"]),
                "date": safe_format_date(r["created"]),
                "fileSize": "1.5 MB",
                "fileUrl": normalize_file_url("office_mannual", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_press_releases(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q OR press_release_upload ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.press_release {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, press_release_date, press_release_upload, file_title, created, status FROM cag_revamp.press_release {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY press_release_date ASC NULLS LAST, created ASC"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY press_release_date DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["press_release_upload"] or r["file_title"]
            rdate = r["press_release_date"] or r["created"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"pr-{r['id']}",
                "title": t_en or "Official Press Release",
                "titleHi": t_hi or "आधिकारिक प्रेस विज्ञप्ति",
                "category": "Press Releases",
                "year": safe_extract_year(rdate),
                "date": safe_format_date(rdate),
                "fileSize": "850 KB",
                "fileUrl": normalize_file_url("press_release", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_tenders(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (tender_title ILIKE :q OR tender_refrence_no ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.tenders {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, tender_title, tender_refrence_no, file_title, uploads, issue_date, submission_date, tender_last_date, created, status FROM cag_revamp.tenders {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY issue_date ASC NULLS LAST, created ASC"
        elif sort_by == "title_asc":
            sql += " ORDER BY tender_title ASC"
        else:
            sql += " ORDER BY issue_date DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["uploads"] or r["file_title"]
            tdate = r["issue_date"] or r["created"]
            ref_info = f"Ref: {r['tender_refrence_no']}" if r["tender_refrence_no"] else "Tender Notification"
            t_en, t_hi = safe_extract_title(r["tender_title"])
            items.append({
                "id": f"tnd-{r['id']}",
                "title": t_en or "Official CAG Tender Notification",
                "titleHi": t_hi or "आधिकारिक सीएजी निविदा सूचना",
                "category": ref_info,
                "year": safe_extract_year(tdate),
                "date": safe_format_date(tdate),
                "fileSize": "1.2 MB",
                "fileUrl": normalize_file_url("tenders", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_circulars(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR circular_reference_no ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.circulars {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, circular_reference_no, upload_file, circular_order_date, year, file_title, created_at, status FROM cag_revamp.circulars {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY circular_order_date ASC NULLS LAST, created_at ASC"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY circular_order_date DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            cdate = r["circular_order_date"] or r["created_at"]
            ref_info = f"Ref: {r['circular_reference_no']}" if r["circular_reference_no"] else "Circular"
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"circ-{r['id']}",
                "title": t_en or "Official Circular / Office Order",
                "titleHi": t_hi or "आधिकारिक परिपत्र / कार्यालय आदेश",
                "category": ref_info,
                "year": r["year"] or safe_extract_year(cdate),
                "date": safe_format_date(cdate),
                "fileSize": "950 KB",
                "fileUrl": normalize_file_url("circulars", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_speeches(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR cag_speech_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.speeches {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, cag_speech_title, cag_speech, speech_date, created_at, status FROM cag_revamp.speeches {base_where}"
        if sort_by == "oldest":
            sql += " ORDER BY speech_date ASC NULLS LAST, created_at ASC"
        elif sort_by == "title_asc":
            sql += " ORDER BY title ASC"
        else:
            sql += " ORDER BY speech_date DESC NULLS LAST, id DESC"
            
        sql += " LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["cag_speech"]
            sdate = r["speech_date"] or r["created_at"]
            raw_title = r["title"] or r["cag_speech_title"] or "Address by Comptroller & Auditor General of India"
            t_en, t_hi = safe_extract_title(raw_title)
            items.append({
                "id": f"sp-{r['id']}",
                "title": t_en,
                "titleHi": t_hi or "भारत के नियंत्रक एवं महालेखापरीक्षक का सम्बोधन",
                "category": "Speeches",
                "year": safe_extract_year(sdate),
                "date": safe_format_date(sdate),
                "fileSize": "650 KB",
                "fileUrl": normalize_file_url("speeches", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_photo_gallery(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR photo_file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.photo_gallery {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, photo_file_title, photo_upload_file, created_at, status FROM cag_revamp.photo_gallery {base_where} ORDER BY created_at DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["photo_upload_file"] or r["photo_file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"photo-{r['id']}",
                "title": t_en or "CAG Event Photo Gallery",
                "titleHi": t_hi or "सीएजी कार्यक्रम फोटो गैलरी",
                "category": "Photo Gallery",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "1.5 MB",
                "fileUrl": normalize_file_url("photo_gallery", fname) or "/assets/dummy.pdf",
                "imageUrl": normalize_file_url("photo_gallery", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_video_gallery(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR video_url ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.video_gallery {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, video_url, video_date, created_at, status FROM cag_revamp.video_gallery {base_where} ORDER BY video_date DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            t_en, t_hi = safe_extract_title(r["title"])
            vdate = r["video_date"] or r["created_at"]
            items.append({
                "id": f"vid-{r['id']}",
                "title": t_en or "CAG Official Video Feature",
                "titleHi": t_hi or "सीएजी आधिकारिक वीडियो",
                "category": "Video Gallery",
                "year": safe_extract_year(vdate),
                "date": safe_format_date(vdate),
                "fileSize": "Video Stream",
                "fileUrl": r["video_url"] or "/assets/dummy.pdf",
                "videoUrl": r["video_url"] or ""
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_study_reports(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.study_reports {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, upload_file, published_date, created_at, status FROM cag_revamp.study_reports {base_where} ORDER BY published_date DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            pdate = r["published_date"] or r["created_at"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"study-{r['id']}",
                "title": t_en or "Research Study Report & Compendium",
                "titleHi": t_hi or "अध्ययन रिपोर्ट एवं संग्रह",
                "category": "Study Reports & Compendia",
                "year": safe_extract_year(pdate),
                "date": safe_format_date(pdate),
                "fileSize": "2.8 MB",
                "fileUrl": normalize_file_url("study_reports", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_rajbhasha(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.rajbhasha_cadre {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, file_title, upload_file, created_at, status FROM cag_revamp.rajbhasha_cadre {base_where} ORDER BY created_at DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"raj-{r['id']}",
                "title": t_en or "Rajbhasha e-Patrika / Hindi Journal",
                "titleHi": t_hi or "राजभाषा ई-पत्रिका",
                "category": "Rajbhasha e-Patrika",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "3.1 MB",
                "fileUrl": normalize_file_url("rajbhasha_cadre", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_ag_reports(db, slug, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND title ILIKE :q"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.ag_other_reports {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, year, upload_file, created, status FROM cag_revamp.ag_other_reports {base_where} ORDER BY created DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"]
            cat_name = "Annual Report" if "annual" in slug else ("Peer Review" if "peer" in slug else "State PSU Accounts")
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"agr-{r['id']}",
                "title": t_en or f"{cat_name} Document",
                "titleHi": t_hi or f"{cat_name} दस्तावेज़",
                "category": cat_name,
                "year": r["year"] or safe_extract_year(r["created"]),
                "date": safe_format_date(r["created"]),
                "fileSize": "2.4 MB",
                "fileUrl": normalize_file_url("ag_other_reports", fname) or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_rti(db, query, culture, sort_by, page, page_size):
        base_where = " WHERE (status IS NULL OR status = 1)"
        params = {}
        if query:
            base_where += " AND (title ILIKE :q OR filename ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.rti_disclosure {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, filename, url, created, status FROM cag_revamp.rti_disclosure {base_where} ORDER BY created DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["filename"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"rti-{r['id']}",
                "title": t_en or "Right to Information Statutory Disclosure",
                "titleHi": t_hi or "सूचना का अधिकार वैधानिक प्रकटीकरण",
                "category": "RTI Disclosure",
                "year": safe_extract_year(r["created"]),
                "date": safe_format_date(r["created"]),
                "fileSize": "1.1 MB",
                "fileUrl": normalize_file_url("rti_disclosure", fname) or r["url"] or "/assets/dummy.pdf"
            })
        return {"items": items, "total": total, "page": page, "page_size": page_size}

    @staticmethod
    def _fetch_pages_policy(db, slug, query, culture, sort_by, page, page_size):
        base_where = " WHERE (slug ILIKE :s OR title ILIKE :s) AND (status IS NULL OR status = 1)"
        params = {"s": f"%{slug}%"}
        if query:
            base_where += " AND (title ILIKE :q OR file_title ILIKE :q)"
            params["q"] = f"%{query}%"

        count_sql = f"SELECT COUNT(*) FROM cag_revamp.pages {base_where};"
        total = db.execute(text(count_sql), params).scalar() or 0

        sql = f"SELECT id, title, slug, file_title, upload_file, created_at, status FROM cag_revamp.pages {base_where} ORDER BY created_at DESC NULLS LAST, id DESC LIMIT :limit OFFSET :offset;"
        params["limit"] = page_size
        params["offset"] = (page - 1) * page_size
        
        rows = db.execute(text(sql), params).mappings().all()
        items = []
        for r in rows:
            fname = r["upload_file"] or r["file_title"]
            t_en, t_hi = safe_extract_title(r["title"])
            items.append({
                "id": f"pg-{r['id']}",
                "title": t_en or "Official CAG Institutional Policy",
                "titleHi": t_hi or "आधिकारिक सीएजी संस्थागत नीति",
                "category": "Policy & Charter",
                "year": safe_extract_year(r["created_at"]),
                "date": safe_format_date(r["created_at"]),
                "fileSize": "1.2 MB",
                "fileUrl": normalize_file_url("pages", fname) or "/assets/dummy.pdf"
            })
        
        # If no items found in pages, fallback to policy_and_guidelines table
        if not items:
            p_rows = db.execute(text("SELECT id, title, upload, url, created_at FROM cag_revamp.policy_and_guidelines WHERE status = 1 ORDER BY id ASC LIMIT :limit;"), {"limit": page_size}).mappings().all()
            for r in p_rows:
                t_en, t_hi = safe_extract_title(r["title"])
                items.append({
                    "id": f"pol-{r['id']}",
                    "title": t_en or "Institutional Policy Guideline",
                    "titleHi": t_hi or "संस्थागत नीति दिशा-निर्देश",
                    "category": "Institutional Policy",
                    "year": safe_extract_year(r["created_at"]),
                    "date": safe_format_date(r["created_at"]),
                    "fileSize": "1.5 MB",
                    "fileUrl": normalize_file_url("policy_and_guidelines", r["upload"]) or r["url"] or "/assets/dummy.pdf"
                })
            total = len(items)

        return {"items": items, "total": total, "page": page, "page_size": page_size}
