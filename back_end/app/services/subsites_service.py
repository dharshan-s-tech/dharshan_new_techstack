import logging
import json
import re
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine

logger = logging.getLogger("uvicorn")
BASE_URL = getattr(settings, "BASE_URL", "https://cag.gov.in")
CDN_BASE_URL = getattr(settings, "CLOUDFRONT_BASE_URL", "https://d7i5wg8xwe4hf.cloudfront.net")


CODE_TO_WEBSITE_ID = {
    "ldn": 143,
    "london": 143,
    "143": 143,
    "kul": 144,
    "kuala-lumpur": 144,
    "kualalumpur": 144,
    "144": 144,
    "wdc": 148,
    "washington": 148,
    "washington-dc": 148,
    "148": 148
}

WEBSITE_ID_TO_CODE = {
    143: "ldn",
    144: "kul",
    148: "wdc"
}

# Verified default fallbacks matching actual cag_revamp DB records
STATIC_SUBSITE_FALLBACKS = {
    "ldn": {
        "code": "ldn",
        "website_id": 143,
        "title": "Office of the Director General of Audit, London",
        "title_hi": "लेखापरीक्षा महानिदेशक का कार्यालय, लंदन",
        "short_title": "DGA London",
        "theme": "LDN",
        "phone": "+44 20 7632 3053/54",
        "email": "audit.london@mea.gov.in",
        "address": "India Audit Office, High Commission of India, Aldwych, London WC2B4NA",
        "address_hi": "इंडिया ऑडिट ऑफिस, भारतीय उच्चायोग, ऑल्डविच, लन्दन WC2B4NA",
        "working_hours": "09:00 AM - 5:30 PM (Monday - Friday)",
        "working_hours_hi": "09:00 प्रात: - 5:30 सांयकाल (सोमवार से शुक्रवार)",
        "google_maps_url": "https://maps.google.com/maps?width=700&height=400&hl=en&q=india+house+Aldwych,+London+WC2B4NA+london&t=&z=14&ie=UTF8&iwloc=B&output=embed"
    },
    "kul": {
        "code": "kul",
        "website_id": 144,
        "title": "Principal Director of Audit, Kuala Lumpur",
        "title_hi": "प्रधान लेखापरीक्षा निदेशक, कुआलालंपुर",
        "short_title": "PDA Kuala Lumpur",
        "theme": "KUL",
        "phone": "(00-603) 2092 1058",
        "email": "pdakualalumpur@cag.gov.in",
        "address": "India Audit Office, Suite 9.02, Level 9, Wisma E&C, 2 Lorong Dungun Kiri, Damansara Heights, 50490 Kuala Lumpur, Malaysia",
        "address_hi": "इंडिया ऑडिट ऑफिस, सुइट 9.02, लेवल 9, विस्मा ईएंडसी, 2 लोरॉन्ग डुंगुन किरी, दमनसारा हाइट्स, 50490 कुआलालंपुर, मलेशिया",
        "working_hours": "09:00 AM - 5:30 PM (Monday - Friday)",
        "working_hours_hi": "09:00 पूर्वाह्न - 05:30 अपराह्न (सोमवार - शुक्रवार)",
        "google_maps_url": "https://maps.google.com/maps?q=Wisma+E%26C+Kuala+Lumpur"
    },
    "wdc": {
        "code": "wdc",
        "website_id": 148,
        "title": "Principal Director of Audit, Washington DC",
        "title_hi": "प्रधान निदेशक लेखापरीक्षा , वाशिंगटन डी.सी",
        "short_title": "PDA Washington DC",
        "theme": "WDC",
        "phone": "+1 202-939-9857",
        "email": "pdawashington@cag.gov.in",
        "address": "Office of Principal Director of Audit, Chancery-II, Embassy of India, 2536 Massachusetts Avenue, NW Washington DC 20008, USA",
        "address_hi": "लेखा परीक्षा के प्रधान निदेशक का कार्यालय, चांसरी-II, भारतीय दूतावास, 2536 मैसाचुसेट्स एवेन्यू, उत्तर-पश्चिम वाशिंगटन डीसी 20008, यूएसए",
        "working_hours": "09:30 AM - 6:00 PM (Monday - Friday)",
        "working_hours_hi": "सुबह 9:30 बजे से शाम 6:00 बजे तक (सोमवार - शुक्रवार)",
        "google_maps_url": "https://www.google.com/maps/place/2536+Massachusetts+Ave+NW,+Washington,+DC+20008"
    }
}


class SubsitesService:
    @staticmethod
    def get_website_id(code_or_id: str) -> Optional[int]:
        key = str(code_or_id).strip().lower()
        return CODE_TO_WEBSITE_ID.get(key)

    @staticmethod
    def get_subsite_info(code_or_id: str, culture: str = "en", db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
        w_id = SubsitesService.get_website_id(code_or_id)
        if not w_id:
            return None
        code = WEBSITE_ID_TO_CODE.get(w_id, "ldn")

        data = dict(STATIC_SUBSITE_FALLBACKS.get(code, {}))

        if db and engine.dialect.name == "postgresql":
            try:
                # 1. Fetch website row
                w_row = db.execute(text("""
                    SELECT id, title, title_hi, url, email, theme 
                    FROM cag_revamp.websites 
                    WHERE id = :wid LIMIT 1;
                """), {"wid": w_id}).mappings().fetchone()

                if w_row:
                    if w_row.get("title"):
                        data["title"] = w_row["title"]
                    if w_row.get("title_hi"):
                        data["title_hi"] = w_row["title_hi"]
                    if w_row.get("theme"):
                        data["theme"] = w_row["theme"]

                # 2. Fetch contact info from pages table
                c_row = db.execute(text("""
                    SELECT p.content, pt.content as content_hi
                    FROM cag_revamp.pages p
                    LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'hi'
                    WHERE p.slug IN (
                        'page-pda-' || :code || '-contact-us',
                        'page-pda-' || :code || '-contact-us-home'
                    )
                    LIMIT 1;
                """), {"code": code}).mappings().fetchone()

                if c_row and c_row.get("content"):
                    html = c_row["content"]
                    # Extract phone
                    ph_match = re.search(r'(?:Tel No:|Ph:|Phone\s*-|Phone:)\s*([+0-9\s\-/()]{8,30})', html, re.IGNORECASE)
                    if ph_match:
                        data["phone"] = ph_match.group(1).strip()

                    # Extract email
                    em_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', html)
                    if em_match:
                        data["email"] = em_match.group(1).strip()
            except Exception as e:
                logger.warning(f"[SubsitesService] Error fetching info from DB: {e}")

        # Also attach full menus
        data["menus"] = SubsitesService.get_subsite_menus(code, culture=culture, db=db)
        return data

    @staticmethod
    def get_subsite_menus(code_or_id: str, culture: str = "en", db: Optional[Session] = None) -> Dict[str, List[Dict[str, Any]]]:
        w_id = SubsitesService.get_website_id(code_or_id)
        if not w_id:
            return {"main": [], "footer": [], "top": []}
        code = WEBSITE_ID_TO_CODE.get(w_id, "ldn")

        if not db or engine.dialect.name != "postgresql":
            return {"main": [], "footer": [], "top": []}

        try:
            # Pre-fetch all pages for this subsite to match custom_link or titles to actual slugs
            pages_rows = db.execute(text("""
                SELECT id, slug, title 
                FROM cag_revamp.pages 
                WHERE slug ILIKE :pat;
            """), {"pat": f"%pda-{code}%"}).mappings().fetchall()

            page_by_title: Dict[str, str] = {}
            for p in pages_rows:
                clean_t = re.sub(r'[^a-zA-Z0-9]', '', (p["title"] or "").lower())
                page_by_title[clean_t] = p["slug"]

            # Query DB menus for this website
            menu_rows = db.execute(text("""
                SELECT mr.region, m.id, m.parent_id, m.menu_title, m.custom_link, m.sort_order
                FROM cag_revamp.menu_regions mr
                JOIN cag_revamp.menus m ON m.menu_region_id = mr.id
                WHERE mr.website_id = :wid
                ORDER BY mr.region, m.parent_id, m.sort_order;
            """), {"wid": w_id}).fetchall()

            items_by_id: Dict[int, Dict[str, Any]] = {}
            children_by_parent: Dict[int, List[Dict[str, Any]]] = {}

            for r in menu_rows:
                region, m_id, parent_id, title_raw, custom_link, sort_order = r
                try:
                    t_obj = json.loads(title_raw) if title_raw and title_raw.startswith('{') else {"default": title_raw or ""}
                except Exception:
                    t_obj = {"default": title_raw or ""}

                title_text = t_obj.get("hi") if culture == "hi" and t_obj.get("hi") else t_obj.get("default", "")
                if not title_text:
                    title_text = t_obj.get("default", "")

                clean_title = re.sub(r'[^a-zA-Z0-9]', '', (t_obj.get("default") or "").lower())
                href = "#"

                if custom_link:
                    link = custom_link.strip()
                    link = link.replace("/[website:]/[language:]/", f"/pda/{code}/{culture}/")
                    link = link.replace("[website:]", f"pda/{code}")
                    link = link.replace("[language:]", culture)
                    link = link.replace("/[website:]", f"/pda/{code}")
                    link = link.replace("/[language:]", f"/{culture}")
                    link = link.replace(f"/pda/{code}/[language:]/", f"/pda/{code}/{culture}/")
                    if link.startswith("/uploads/"):
                        link = f"https://cag.gov.in{link}"
                    href = link
                elif "photogallery" in clean_title:
                    href = f"/pda/{code}/{culture}/photo-gallery"
                elif "videogallery" in clean_title:
                    href = f"/pda/{code}/{culture}/video-gallery"
                elif clean_title in page_by_title:
                    href = f"/pda/{code}/{culture}/{page_by_title[clean_title]}"
                else:
                    for pt, slug in page_by_title.items():
                        if pt and (pt in clean_title or clean_title in pt):
                            href = f"/pda/{code}/{culture}/{slug}"
                            break

                # Specific overrides for staff list & organization structure links
                if "listofpds" in clean_title or "pdstafflist" in clean_title:
                    if code == "ldn":
                        href = f"/pda/{code}/{culture}/subsites-org-struct/pd-staff-list"
                    elif code == "kul":
                        href = f"/pda/{code}/{culture}/page-pda-kul-list-of-pds"
                    elif code == "wdc":
                        href = f"/pda/{code}/{culture}/subsites-org-struct/pd-staff-list"
                elif "listofdirectors" in clean_title or "dstafflist" in clean_title:
                    if code == "ldn":
                        href = f"/pda/{code}/{culture}/subsites-org-struct/d-staff-list"
                    elif code == "kul":
                        href = f"/pda/{code}/{culture}/page-pda-kul-list-of-directors"
                    elif code == "wdc":
                        href = f"/pda/{code}/{culture}/subsites-org-struct/d-staff-list"
                elif "staffdetails" in clean_title:
                    if code == "ldn":
                        href = f"/pda/{code}/{culture}/subsites-org-struct"
                    elif code == "kul":
                        href = f"/pda/{code}/{culture}/page-pda-kul-staff-details"
                    elif code == "wdc":
                        href = f"/pda/{code}/{culture}/page-pda-wdc-orgstructure-staffdetails"
                elif "organisationalstructure" in clean_title or "organizationalstructure" in clean_title:
                    if code == "ldn":
                        href = f"/pda/{code}/{culture}/page-pda-ldn-organisational-structure"
                    elif code == "kul":
                        href = f"/pda/{code}/{culture}/page-pda-kul-organization-structure-and-sanctioned-strength"
                    elif code == "wdc":
                        href = f"/pda/{code}/{culture}/page-pda-wdc-org-str"

                item = {
                    "id": m_id,
                    "parent_id": parent_id,
                    "region": region,
                    "title": title_text,
                    "title_en": t_obj.get("default", ""),
                    "title_hi": t_obj.get("hi", ""),
                    "href": href,
                    "sort_order": sort_order or 0,
                    "children": []
                }
                items_by_id[m_id] = item
                children_by_parent.setdefault(parent_id, []).append(item)

            for item in items_by_id.values():
                if item["id"] in children_by_parent:
                    item["children"] = sorted(children_by_parent[item["id"]], key=lambda x: x["sort_order"])

            main_items: List[Dict[str, Any]] = []
            footer_items: List[Dict[str, Any]] = []
            top_items: List[Dict[str, Any]] = []

            for item in children_by_parent.get(0, []):
                r_lower = item["region"].lower()
                if "main" in r_lower:
                    main_items.append(item)
                elif "footer" in r_lower:
                    footer_items.append(item)
                elif "top" in r_lower:
                    top_items.append(item)

            return {
                "main": sorted(main_items, key=lambda x: x["sort_order"]),
                "footer": sorted(footer_items, key=lambda x: x["sort_order"]),
                "top": sorted(top_items, key=lambda x: x["sort_order"])
            }
        except Exception as exc:
            logger.error(f"[SubsitesService] Error loading menus: {exc}")
            return {"main": [], "footer": [], "top": []}

    @staticmethod
    def get_subsite_page(code_or_id: str, slug: str, culture: str = "en", db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
        w_id = SubsitesService.get_website_id(code_or_id)
        if not w_id:
            return None
        code = WEBSITE_ID_TO_CODE.get(w_id, "ldn")

        clean_slug = slug.strip().lower()

        # Handle special virtual or org-struct routes
        if clean_slug in ("subsites-org-struct/pd-staff-list", "pd-staff-list", "list-of-pds"):
            return SubsitesService._build_leadership_page(code, role="pd", culture=culture, db=db)
        if clean_slug in ("subsites-org-struct/d-staff-list", "d-staff-list", "list-of-directors"):
            return SubsitesService._build_leadership_page(code, role="director", culture=culture, db=db)
        if clean_slug in ("subsites-org-struct", "staff-details"):
            # Check if there is an explicit DB page first
            if code == "kul":
                p = SubsitesService._query_page("page-pda-kul-staff-details", culture, db)
                if p:
                    return p
            elif code == "wdc":
                p = SubsitesService._query_page("page-pda-wdc-orgstructure-staffdetails", culture, db)
                if p:
                    return p
            return SubsitesService._build_leadership_page(code, role="staff", culture=culture, db=db)

        # 1. Search in cag_revamp.pages
        # Try candidate slugs
        candidates = [
            clean_slug,
            f"page-{clean_slug}",
            f"page-pda-{code}-{clean_slug}",
            f"page-pda-{code}-{clean_slug.replace('page-', '')}"
        ]

        # Specific alias mapping for clean URLs
        if "holiday" in clean_slug:
            if code == "ldn":
                candidates.insert(0, "page-pda-ldn-list-of-holidays-to-be-observed-during-2023")
            elif code == "wdc":
                candidates.insert(0, "page-pda-wdc-holidays")
            elif code == "kul":
                candidates.insert(0, "page-pda-kul-list-of-holidays")
        elif "jurisdiction" in clean_slug:
            if code == "wdc":
                candidates.insert(0, "page-pda-wdc-aud-jud")
            elif code == "ldn":
                candidates.insert(0, "page-pda-ldn-audit-jurisdiction")
            elif code == "kul":
                candidates.insert(0, "page-pda-kul-audit-jurisdiction")
        elif "administrative" in clean_slug:
            if code == "wdc":
                candidates.insert(0, "page-pda-wdc-aud-fnc")
            elif code == "ldn":
                candidates.insert(0, "page-pda-ldn-administrative-functions")
            elif code == "kul":
                candidates.insert(0, "page-pda-kul-administrative-functions")
        elif "process" in clean_slug:
            if code == "wdc":
                candidates.insert(0, "page-pda-wdc-aud-process")
            elif code == "ldn":
                candidates.insert(0, "page-pda-ldn-audit-process")
            elif code == "kul":
                candidates.insert(0, "page-pda-kul-audit-process")
        elif "history" in clean_slug or "about-us" in clean_slug:
            if code == "wdc":
                candidates.insert(0, "page-pda-wdc-history")
            elif code == "ldn":
                candidates.insert(0, "page-pda-ldn-brief-history-of-the-office")
            elif code == "kul":
                candidates.insert(0, "page-pda-kul-about-us")
        elif "organisation" in clean_slug or "organization" in clean_slug:
            if code == "wdc":
                candidates.insert(0, "page-pda-wdc-org-str")
            elif code == "ldn":
                candidates.insert(0, "page-pda-ldn-organisational-structure")
            elif code == "kul":
                candidates.insert(0, "page-pda-kul-organization-structure-and-sanctioned-strength")

        for cand in candidates:
            page_data = SubsitesService._query_page(cand, culture, db)
            if page_data:
                return page_data

        return None

    @staticmethod
    def _query_page(target_slug: str, culture: str = "en", db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
        if not db or engine.dialect.name != "postgresql":
            return None

        try:
            query = text("""
                SELECT
                    p.id,
                    p.slug,
                    COALESCE(NULLIF(pt.title, ''), p.title) AS title,
                    COALESCE(NULLIF(pt.excerpt, ''), p.excerpt) AS excerpt,
                    COALESCE(NULLIF(pt.content, ''), p.content) AS content,
                    COALESCE(NULLIF(pt.file_title, ''), p.file_title) AS file_title,
                    COALESCE(NULLIF(pt.upload_file, ''), p.upload_file) AS upload_file,
                    p.created_at,
                    p.modified_at
                FROM cag_revamp.pages p
                LEFT JOIN cag_revamp.page_translations pt
                    ON pt.page_id = p.id AND pt.culture = :culture
                WHERE p.slug = :target_slug
                LIMIT 1;
            """)
            row = db.execute(query, {
                "culture": culture,
                "target_slug": target_slug
            }).mappings().fetchone()

            if row:
                data = dict(row)
                if data.get("content"):
                    data["content"] = data["content"].replace("[SITE-URL]/", f"{BASE_URL}/").replace("[SITE-URL]", BASE_URL)
                if data.get("upload_file"):
                    data["upload_file_url"] = f"{BASE_URL}/uploads/cms_pages_files/{data['upload_file']}"
                return data
        except Exception as e:
            logger.warning(f"[SubsitesService] Error in _query_page for {target_slug}: {e}")
        return None

    @staticmethod
    def _build_leadership_page(code: str, role: str, culture: str = "en", db: Optional[Session] = None) -> Dict[str, Any]:
        """Dynamically assemble Former PDs, Former Directors, or Staff from subsites_org_struct."""
        is_hi = culture == "hi"
        desig_id = 1 if role == "pd" else (2 if role == "director" else None)

        title = "List of Principal Directors" if role == "pd" else ("List of Directors" if role == "director" else "Staff Details")
        title_hi = "प्रधान निदेशकों की सूची" if role == "pd" else ("निदेशकों की सूची" if role == "director" else "स्टाफ का विवरण")

        table_rows = []
        if db and engine.dialect.name == "postgresql":
            try:
                where_clause = "WHERE status = 1"
                params = {}
                if desig_id is not None:
                    where_clause += " AND designation_id = :desig_id"
                    params["desig_id"] = desig_id
                else:
                    where_clause += " AND designation_id IN (3, 4, 5, 6, 7, 8, 9, 10)"

                # Fetch matching officers ordered by from_date or display_order
                officers = db.execute(text(f"""
                    SELECT id, full_name, prefix_name, first_name, last_name, designation_id,
                           profile_image, brief_description, email, mobile_no, from_date, to_date
                    FROM cag_revamp.subsites_org_struct
                    {where_clause}
                    ORDER BY from_date DESC NULLS LAST, id ASC;
                """), params).mappings().fetchall()

                for idx, off in enumerate(officers, start=1):
                    # Parse full name
                    fn_raw = off.get("full_name") or ""
                    try:
                        fn_obj = json.loads(fn_raw) if fn_raw.startswith("{") else {"default": fn_raw}
                    except Exception:
                        fn_obj = {"default": fn_raw}
                    name = fn_obj.get("hi") if is_hi and fn_obj.get("hi") else fn_obj.get("default", "")

                    f_date = str(off.get("from_date") or "—")
                    t_date = str(off.get("to_date") or ("Till date" if not is_hi else "वर्तमान तक"))
                    period = f"{f_date} to {t_date}"

                    table_rows.append(f"""
                        <tr>
                            <td align="center" style="padding: 10px; border: 1px solid #d7d7d7;">{idx}</td>
                            <td style="padding: 10px; border: 1px solid #d7d7d7; font-weight: 600;">{name}</td>
                            <td align="center" style="padding: 10px; border: 1px solid #d7d7d7;">{period}</td>
                        </tr>
                    """)
            except Exception as e:
                logger.warning(f"[SubsitesService] Error assembling leadership page: {e}")

        table_html = f"""
            <div class="leadership-table-wrapper" style="overflow-x: auto; margin-top: 20px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;" border="1">
                    <thead>
                        <tr style="background-color: #f7f7f7;">
                            <th style="padding: 12px; border: 1px solid #d7d7d7; width: 60px; text-align: center;">{'क्र.सं.' if is_hi else 'Sl. No.'}</th>
                            <th style="padding: 12px; border: 1px solid #d7d7d7;">{'नाम' if is_hi else 'Name'}</th>
                            <th style="padding: 12px; border: 1px solid #d7d7d7; text-align: center;">{'कार्यकाल' if is_hi else 'Tenure Period'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {''.join(table_rows) if table_rows else '<tr><td colspan="3" align="center" style="padding: 20px;">No records found.</td></tr>'}
                    </tbody>
                </table>
            </div>
        """

        return {
            "id": 0,
            "slug": f"page-pda-{code}-{role}",
            "title": title_hi if is_hi else title,
            "excerpt": title,
            "content": table_html,
            "file_title": None,
            "upload_file": None,
            "upload_file_url": None
        }

    @staticmethod
    def get_subsite_photos(code: str, culture: str = "en", db: Session = None) -> Dict[str, Any]:
        """Fetch real photo albums from cag_revamp.photo_gallery for overseas subsite."""
        if not db:
            db = SessionLocal()

        code = code.lower().strip()
        is_hi = culture.lower() == "hi"

        kw_map = {
            "ldn": ["ldn", "london"],
            "kul": ["kul", "kuala"],
            "wdc": ["wdc", "washington"]
        }
        keywords = kw_map.get(code, [code])

        conditions = []
        for kw in keywords:
            conditions.append(f"slug ILIKE '%{kw}%' OR title ILIKE '%{kw}%'")

        sql = f"""
            SELECT id, title, slug, photo_file_title, photo_upload_file, created_at 
            FROM cag_revamp.photo_gallery 
            WHERE {' OR '.join(conditions)}
            ORDER BY created_at DESC NULLS LAST
        """
        try:
            rows = db.execute(text(sql)).mappings().all()
            items = []
            for r in rows:
                fname = r["photo_upload_file"] or r["photo_file_title"]
                clean_f = fname
                if fname and (fname.startswith('[') or fname.startswith('{')):
                    try:
                        parsed = json.loads(fname)
                        if isinstance(parsed, list) and len(parsed) > 0:
                            clean_f = parsed[0]
                    except Exception:
                        pass

                t_en, t_hi = "", ""
                if r["title"]:
                    try:
                        parsed_t = json.loads(r["title"])
                        if isinstance(parsed_t, dict):
                            t_en = parsed_t.get("default", "")
                            t_hi = parsed_t.get("hi", "")
                        else:
                            t_en = str(parsed_t)
                    except Exception:
                        t_en = str(r["title"])

                img_url = f"{CDN_BASE_URL}/uploads/photo_gallery/{clean_f}" if clean_f else "/assets/placeholder-photo.jpg"
                title = (t_hi if is_hi and t_hi else t_en) or "Subsite Photo"

                items.append({
                    "id": r["id"],
                    "title": title,
                    "title_en": t_en,
                    "title_hi": t_hi,
                    "slug": r["slug"],
                    "image_url": img_url,
                    "date": str(r["created_at"])[:10] if r["created_at"] else ""
                })

            return {"items": items, "total": len(items)}
        except Exception as e:
            logger.error(f"[SubsitesService] Error fetching subsite photos: {e}")
            return {"items": [], "total": 0}

