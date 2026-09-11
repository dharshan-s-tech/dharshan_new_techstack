import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
import json
from app.core.database import engine

logger = logging.getLogger("uvicorn")

SLUG_TO_META = {
    'page-cag-of-india': ('Who We Are', 'CAG of India Profile', '/About/About-Us/Cag-Of-India'),
    'page-our-vision-mission-values': ('Who We Are', 'Our Vision, Mission & Core Values', '/About/About-Us/Our-Vision,-Mission-&-Core-Values'),
    'page-history-of-indian-audit-and-accounts-department': ('Leadership & Legacy', 'History of IAAD', '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department'),
    'page-audit-advisory-board': ('Leadership & Legacy', 'Audit-Advisory-Board', '/About/About-Us/Audit-Advisory-Board'),
    'page-constitutional-provisions': ('Governance & Mandate', 'Constitutional-Provisions', '/About/About-Us/Constitutional-Provisions'),
    'page-duties-power-and-conditions-of-services-act': ('Governance & Mandate', 'Duties-&-Powers-Act', '/About/About-Us/Duties-&-Powers-Act'),
    'page-citizen-s-charter': ('Governance & Mandate', 'Duties-&-Powers-Act', '/About/About-Us/Duties-&-Powers-Act'),
    'page-cag-audit-regulations': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-audit-regulations': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-earlier-versions-regulation-audit-accounts-2007': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-regulations-audit-accounts-2007': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-cag-s-auditing-standards-2017': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
}


class AboutAdminService:
    @staticmethod
    def get_all_about_records(
        db: Optional[Session] = None,
        category: Optional[str] = None,
        subtopic: Optional[str] = None,
        table_name: Optional[str] = None,
        language: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
        sort: Optional[str] = "newest",
        page: int = 1,
        page_size: int = 15
    ) -> Dict[str, Any]:
        all_records: List[Dict[str, Any]] = []
        rec_id = 1

        if db and engine.dialect.name == "postgresql":
            try:
                # 1. Fetch relevant CMS pages (cag_revamp.pages)
                q_pages = text("""
                    SELECT DISTINCT ON (p.id)
                        p.id,
                        p.slug,
                        p.title as title_en,
                        p.excerpt as excerpt_en,
                        p.file_title,
                        p.upload_file,
                        p.status,
                        p.created_at,
                        p.modified_at,
                        COALESCE(pt.title, '') as title_hi,
                        COALESCE(pt.excerpt, '') as excerpt_hi
                    FROM cag_revamp.pages p
                    LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'hi'
                    WHERE p.id IN (1, 2, 3, 10, 11, 16, 17, 40, 41, 6315, 6685, 6688)
                       OR p.slug IN (
                           'page-cag-of-india', 'page-our-vision-mission-values', 'page-history-of-indian-audit-and-accounts-department',
                           'page-audit-advisory-board', 'page-constitutional-provisions', 'page-duties-power-and-conditions-of-services-act',
                           'page-cag-audit-regulations', 'page-audit-regulations'
                       )
                    ORDER BY p.id;
                """)
                page_rows = db.execute(q_pages).mappings().fetchall()
                seen_pids = set()
                for p in page_rows:
                    if p['id'] in seen_pids:
                        continue
                    seen_pids.add(p['id'])
                    cat, st, pub_url = SLUG_TO_META.get(p['slug'], ('Governance & Mandate', p['title_en'], '/About/About-Us/Cag-Of-India'))
                    f_url = f"https://cag.gov.in/uploads/cms_pages_files/{p['upload_file']}" if p.get('upload_file') else ""
                    all_records.append({
                        "id": rec_id,
                        "rawId": f"page-{p['id']}",
                        "formattedId": f"#AB-PG{str(p['id']).zfill(3)}",
                        "category": cat,
                        "subTopic": st,
                        "subTopicSlug": p['slug'].replace('page-', ''),
                        "title_en": p['title_en'] or p['slug'],
                        "title_hi": p.get('title_hi') or '',
                        "desc": p.get('excerpt_en') or f"Statutory CMS content for {p['title_en']} from cag_revamp.pages",
                        "table_name": "cag_revamp.pages",
                        "primary_key_or_slug": f"{p['slug']} (ID: {p['id']})",
                        "public_url": pub_url,
                        "thumb_image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                        "file_url": f_url,
                        "file_name": p.get('upload_file') or '',
                        "language": "Bilingual" if p.get('title_hi') else "EN",
                        "is_active": p.get('status') == 1,
                        "item_count": 1,
                        "created_at": str(p.get('created_at') or '01-Jan-2026 10:00 AM'),
                        "modified_at": str(p.get('modified_at') or '09-Sep-2026 04:30 PM'),
                    })
                    rec_id += 1

                # 2. Fetch all Former CAGs from cag_revamp.former_cag (all 62 rows)
                q_fc = text("SELECT * FROM cag_revamp.former_cag ORDER BY id;")
                fc_rows = db.execute(q_fc).mappings().fetchall()
                for fc in fc_rows:
                    name = fc.get('tenure') or fc.get('title') or 'Former CAG'
                    img = fc.get('image') or ''
                    img_url = f"https://cag.gov.in/uploads/former_cag/{img}" if img else ""
                    lang = "HI" if fc.get('language') == 'hi' else "EN"

                    all_records.append({
                        "id": rec_id,
                        "rawId": f"former-cag-{fc['id']}",
                        "formattedId": f"#AB-FC{str(fc['id']).zfill(3)}",
                        "category": "Leadership & Legacy",
                        "subTopic": "Former CAGs Gallery",
                        "subTopicSlug": "former-cags",
                        "title_en": name if lang == 'EN' else f"Former CAG ({fc.get('tenure_from')}-{fc.get('tenure_to')})",
                        "title_hi": name if lang == 'HI' else '',
                        "desc": f"Former Comptroller and Auditor General of India serving from {fc.get('tenure_from', '')} to {fc.get('tenure_to', '')}.",
                        "table_name": "cag_revamp.former_cag",
                        "primary_key_or_slug": f"ID: {fc['id']} ({fc.get('tenure_from')}-{fc.get('tenure_to')})",
                        "public_url": "/About/About-Us/Former-Comptroller-and-Auditors-General",
                        "thumb_image": img_url or "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                        "file_url": "",
                        "file_name": img,
                        "language": lang,
                        "is_active": fc.get('status') == 1,
                        "item_count": 1,
                        "created_at": str(fc.get('created') or '02-Dec-2019 11:20 AM'),
                        "modified_at": str(fc.get('modified') or '09-Sep-2026 06:10 PM'),
                    })
                    rec_id += 1

                # 3. Fetch all Organisation Chart Officers from cag_revamp.organisation_chart (all 74 rows)
                q_oc = text("""
                    SELECT 
                        oc.id,
                        oc.full_name,
                        oc.prefix_name,
                        oc.designation_display_name,
                        oc.email,
                        oc.mobile_no,
                        oc.profile_image,
                        oc.department,
                        oc.additional_charge,
                        oc.display_order,
                        oc.retired,
                        oc.status,
                        oc.created,
                        oc.modified,
                        dh.title as dh_title,
                        dh.level as dh_level
                    FROM cag_revamp.organisation_chart oc
                    LEFT JOIN cag_revamp.designation_hierarchy dh ON dh.id = oc.designation_hierarchy_id
                    ORDER BY oc.id;
                """)
                oc_rows = db.execute(q_oc).mappings().fetchall()
                for oc in oc_rows:
                    fn_raw = oc.get('full_name') or ''
                    name_en = ''
                    name_hi = ''
                    if isinstance(fn_raw, str):
                        try:
                            fn_json = json.loads(fn_raw)
                            name_en = fn_json.get('default') or fn_json.get('en') or fn_raw
                            name_hi = fn_json.get('hi') or ''
                        except:
                            name_en = fn_raw

                    desig = oc.get('designation_display_name') or oc.get('dh_title') or 'Executive Officer'
                    if isinstance(desig, str) and desig.startswith('{'):
                        try:
                            d_json = json.loads(desig)
                            desig = d_json.get('default') or d_json.get('en') or desig
                        except:
                            pass

                    img = oc.get('profile_image') or ''
                    img_url = f"https://cag.gov.in/uploads/cag_emp_profile_pic/{img}" if img else ""
                    is_active = (oc.get('status') == 1 and oc.get('retired') != 1)

                    all_records.append({
                        "id": rec_id,
                        "rawId": f"org-chart-{oc['id']}",
                        "formattedId": f"#AB-OC{str(oc['id']).zfill(3)}",
                        "category": "Who We Are",
                        "subTopic": "Organisation-Chart",
                        "subTopicSlug": "organisation-chart",
                        "title_en": f"{name_en} - {desig}".strip(' -'),
                        "title_hi": name_hi,
                        "desc": f"Executive Portfolio: {oc.get('department') or desig}. Email: {oc.get('email') or 'N/A'}, Phone: {oc.get('mobile_no') or 'N/A'}. Level: {oc.get('dh_level', 2)}",
                        "table_name": "cag_revamp.organisation_chart",
                        "primary_key_or_slug": f"ID: {oc['id']} (Level {oc.get('dh_level', 2)})",
                        "public_url": "/About/About-Us/Organisation-Chart",
                        "thumb_image": img_url or "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                        "file_url": "",
                        "file_name": img,
                        "language": "Bilingual" if name_hi else "EN",
                        "is_active": is_active,
                        "item_count": 1,
                        "created_at": str(oc.get('created') or '01-Jan-2020 10:00 AM'),
                        "modified_at": str(oc.get('modified') or '09-Sep-2026 06:10 PM'),
                    })
                    rec_id += 1

            except Exception as e:
                logger.warning(f"[AboutAdminService] Failed to load DB records: {e}")

        # Fallback if DB didn't load records
        if not all_records:
            from app.services.pages_service import SEED_PAGES
            from app.services.former_cag_service import SEED_FORMER_CAGS
            from app.services.organisation_chart_service import SEED_ORGANISATION_OFFICERS

            for pid, p in SEED_PAGES.items():
                cat, st, pub_url = SLUG_TO_META.get(p['slug'], ('Governance & Mandate', p['title_en'], '/About/About-Us/Cag-Of-India'))
                all_records.append({
                    "id": rec_id,
                    "rawId": f"page-{p['id']}",
                    "formattedId": f"#AB-PG{str(p['id']).zfill(3)}",
                    "category": cat,
                    "subTopic": st,
                    "subTopicSlug": p['slug'].replace('page-', ''),
                    "title_en": p['title_en'],
                    "title_hi": p.get('title_hi', ''),
                    "desc": p.get('excerpt_en', ''),
                    "table_name": "cag_revamp.pages",
                    "primary_key_or_slug": f"{p['slug']} (ID: {p['id']})",
                    "public_url": pub_url,
                    "thumb_image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                    "file_url": "",
                    "file_name": p.get('upload_file', ''),
                    "language": "Bilingual",
                    "is_active": True,
                    "item_count": 1,
                    "created_at": "01-Sep-2026 10:00 AM",
                    "modified_at": "09-Sep-2026 04:30 PM",
                })
                rec_id += 1

            for fc in SEED_FORMER_CAGS:
                all_records.append({
                    "id": rec_id,
                    "rawId": f"former-cag-{fc['id']}",
                    "formattedId": f"#AB-FC{str(fc['id']).zfill(3)}",
                    "category": "Leadership & Legacy",
                    "subTopic": "Former CAGs Gallery",
                    "subTopicSlug": "former-cags",
                    "title_en": fc["name_en"],
                    "title_hi": fc["name_hi"],
                    "desc": f"Former Comptroller and Auditor General of India serving from {fc.get('tenure_from', '')} to {fc.get('tenure_to', '')}.",
                    "table_name": "cag_revamp.former_cag",
                    "primary_key_or_slug": f"ID: {fc['id']} ({fc.get('tenure_from')}-{fc.get('tenure_to')})",
                    "public_url": "/About/About-Us/Former-Comptroller-and-Auditors-General",
                    "thumb_image": fc.get("image") or "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                    "file_url": "",
                    "file_name": fc.get("image", ""),
                    "language": "Bilingual",
                    "is_active": True,
                    "item_count": 1,
                    "created_at": "02-Dec-2019 11:20 AM",
                    "modified_at": "09-Sep-2026 06:10 PM",
                })
                rec_id += 1

            for oc in SEED_ORGANISATION_OFFICERS:
                all_records.append({
                    "id": rec_id,
                    "rawId": f"org-chart-{oc['id']}",
                    "formattedId": f"#AB-OC{str(oc['id']).zfill(3)}",
                    "category": "Who We Are",
                    "subTopic": "Organisation-Chart",
                    "subTopicSlug": "organisation-chart",
                    "title_en": f"{oc['name_en']} - {oc['designation_en']}",
                    "title_hi": f"{oc['name_hi']} - {oc['designation_hi']}",
                    "desc": f"Executive Portfolio: {oc.get('charge_en')}. Level: {oc.get('level', 2)}",
                    "table_name": "cag_revamp.organisation_chart",
                    "primary_key_or_slug": f"ID: {oc['id']} (Level {oc.get('level', 2)})",
                    "public_url": "/About/About-Us/Organisation-Chart",
                    "thumb_image": oc.get("profile_image") or "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                    "file_url": "",
                    "file_name": oc.get("profile_image", ""),
                    "language": "Bilingual",
                    "is_active": True,
                    "item_count": 1,
                    "created_at": "01-Jan-2020 10:00 AM",
                    "modified_at": "09-Sep-2026 06:10 PM",
                })
                rec_id += 1

        # Apply Filters
        filtered = all_records

        if category and category.lower() != 'all':
            filtered = [r for r in filtered if r['category'].lower() == category.lower()]

        if subtopic and subtopic.lower() != 'all':
            st_low = subtopic.lower()
            filtered = [
                r for r in filtered 
                if st_low in r['subTopicSlug'].lower() 
                or st_low in r['subTopic'].lower() 
                or r['subTopicSlug'].lower() == st_low 
                or r['subTopic'].lower() == st_low 
                or r['rawId'].lower() == st_low
            ]

        if table_name and table_name.lower() != 'all':
            filtered = [r for r in filtered if table_name.lower() in r['table_name'].lower()]

        if language and language.lower() != 'all':
            filtered = [r for r in filtered if r['language'].lower() == language.lower()]

        if status and status.lower() != 'all':
            act = status.lower() == 'active'
            filtered = [r for r in filtered if r['is_active'] == act]

        if search and search.strip():
            q = search.lower().strip()
            filtered = [
                r for r in filtered
                if q in r['title_en'].lower()
                or (r.get('title_hi') and q in r['title_hi'].lower())
                or (r.get('desc') and q in r['desc'].lower())
                or q in r['subTopic'].lower()
                or q in r['category'].lower()
                or q in r['formattedId'].lower()
                or q in r['primary_key_or_slug'].lower()
            ]

        # Sorting
        if sort == 'title_asc':
            filtered.sort(key=lambda x: x['title_en'])
        elif sort == 'title_desc':
            filtered.sort(key=lambda x: x['title_en'], reverse=True)
        elif sort == 'id_asc':
            filtered.sort(key=lambda x: int(x['id']))
        elif sort == 'id_desc':
            filtered.sort(key=lambda x: int(x['id']), reverse=True)
        elif sort == 'category_asc':
            filtered.sort(key=lambda x: x['category'])
        elif sort == 'newest':
            filtered.sort(key=lambda x: str(x.get('modified_at', '')), reverse=True)
        elif sort == 'oldest':
            filtered.sort(key=lambda x: str(x.get('modified_at', '')))

        total = len(filtered)
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1
        start = (page - 1) * page_size
        end = start + page_size
        paginated = filtered[start:end]

        return {
            "items": paginated,
            "total": total,
            "page": page,
            "pageSize": page_size,
            "totalPages": total_pages,
            "categoryCounts": {
                "Who We Are": len([r for r in all_records if r['category'] == 'Who We Are']),
                "Leadership & Legacy": len([r for r in all_records if r['category'] == 'Leadership & Legacy']),
                "Governance & Mandate": len([r for r in all_records if r['category'] == 'Governance & Mandate']),
                "Total": len(all_records)
            }
        }

    @staticmethod
    def save_about_record(data: Dict[str, Any], db: Optional[Session] = None) -> Dict[str, Any]:
        """Save or update an About Us record in PostgreSQL."""
        if not db or engine.dialect.name != "postgresql":
            return data

        raw_id = str(data.get("rawId") or data.get("id") or "")
        is_active = 1 if data.get("is_active", True) else 0

        try:
            if raw_id.startswith("page-"):
                pid_str = raw_id.replace("page-", "")
                if pid_str.isdigit():
                    pid = int(pid_str)
                    title_en = data.get("title_en") or data.get("title") or ""
                    title_hi = data.get("title_hi") or ""
                    desc = data.get("desc") or data.get("excerpt") or ""
                    file_name = data.get("file_name") or data.get("upload_file") or ""

                    db.execute(text("""
                        UPDATE cag_revamp.pages
                        SET title = :title,
                            excerpt = :excerpt,
                            upload_file = COALESCE(NULLIF(:upload_file, ''), upload_file),
                            status = :status,
                            modified_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "excerpt": desc,
                        "upload_file": file_name,
                        "status": is_active,
                        "id": pid
                    })

                    if title_hi:
                        # Check if translation exists
                        exists = db.execute(text("""
                            SELECT id FROM cag_revamp.page_translations
                            WHERE page_id = :pid AND culture = 'hi';
                        """), {"pid": pid}).fetchone()
                        if exists:
                            db.execute(text("""
                                UPDATE cag_revamp.page_translations
                                SET title = :title,
                                    excerpt = :excerpt
                                WHERE page_id = :pid AND culture = 'hi';
                            """), {"title": title_hi, "excerpt": desc, "pid": pid})
                        else:
                            db.execute(text("""
                                INSERT INTO cag_revamp.page_translations (page_id, culture, title, excerpt)
                                VALUES (:pid, 'hi', :title, :excerpt);
                            """), {"pid": pid, "title": title_hi, "excerpt": desc})
                    db.commit()

            elif raw_id.startswith("former-cag-"):
                fcid_str = raw_id.replace("former-cag-", "")
                if fcid_str.isdigit():
                    fcid = int(fcid_str)
                    title_en = data.get("title_en") or data.get("title") or ""
                    file_name = data.get("file_name") or data.get("image") or ""
                    db.execute(text("""
                        UPDATE cag_revamp.former_cag
                        SET tenure = :tenure,
                            image = COALESCE(NULLIF(:image, ''), image),
                            status = :status,
                            modified = NOW()
                        WHERE id = :id;
                    """), {
                        "tenure": title_en,
                        "image": file_name,
                        "status": is_active,
                        "id": fcid
                    })
                    db.commit()

            elif raw_id.startswith("org-chart-"):
                ocid_str = raw_id.replace("org-chart-", "")
                if ocid_str.isdigit():
                    ocid = int(ocid_str)
                    title_en = data.get("title_en") or data.get("full_name") or ""
                    file_name = data.get("file_name") or data.get("profile_image") or ""
                    db.execute(text("""
                        UPDATE cag_revamp.organisation_chart
                        SET full_name = :name,
                            profile_image = COALESCE(NULLIF(:profile_image, ''), profile_image),
                            status = :status,
                            modified = NOW()
                        WHERE id = :id;
                    """), {
                        "name": title_en,
                        "profile_image": file_name,
                        "status": is_active,
                        "id": ocid
                    })
                    db.commit()

        except Exception as e:
            logger.error(f"[AboutAdminService] Failed to save DB record {raw_id}: {e}")
            db.rollback()

        return data

    @staticmethod
    def delete_about_record(raw_id: str, db: Optional[Session] = None) -> bool:
        """Soft delete (status = 0) an About Us record in PostgreSQL."""
        if not db or engine.dialect.name != "postgresql":
            return True

        try:
            if raw_id.startswith("page-"):
                pid_str = raw_id.replace("page-", "")
                if pid_str.isdigit():
                    db.execute(text("UPDATE cag_revamp.pages SET status = 0, modified_at = NOW() WHERE id = :id;"), {"id": int(pid_str)})
                    db.commit()
            elif raw_id.startswith("former-cag-"):
                fcid_str = raw_id.replace("former-cag-", "")
                if fcid_str.isdigit():
                    db.execute(text("UPDATE cag_revamp.former_cag SET status = 0, modified = NOW() WHERE id = :id;"), {"id": int(fcid_str)})
                    db.commit()
            elif raw_id.startswith("org-chart-"):
                ocid_str = raw_id.replace("org-chart-", "")
                if ocid_str.isdigit():
                    db.execute(text("UPDATE cag_revamp.organisation_chart SET status = 0, modified = NOW() WHERE id = :id;"), {"id": int(ocid_str)})
                    db.commit()
            return True
        except Exception as e:
            logger.error(f"[AboutAdminService] Failed to delete DB record {raw_id}: {e}")
            db.rollback()
            return False

