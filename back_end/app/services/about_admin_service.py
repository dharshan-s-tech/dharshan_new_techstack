import logging
import json
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import engine

logger = logging.getLogger("uvicorn")

SLUG_TO_META = {
    'page-cag-of-india': ('Who We Are', 'CAG of India Profile', '/About/About-Us/Cag-Of-India'),
    'page-our-vision-mission-values': ('Who We Are', 'Our Vision, Mission & Core Values', '/About/About-Us/Our-Vision,-Mission-&-Core-Values'),
    'page-history-of-indian-audit-and-accounts-department': ('Leadership & Legacy', 'History of IAAD', '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department'),
    'page-audit-advisory-board': ('Leadership & Legacy', 'Audit-Advisory-Board', '/About/About-Us/Audit-Advisory-Board'),
    'page-constitutional-provisions': ('Governance & Mandate', 'Constitutional-Provisions', '/About/About-Us/Constitutional-Provisions'),
    'page-duties-power-and-conditions-of-services-act': ('Governance & Mandate', 'Duties-&-Powers-Act', '/About/About-Us/Duties-&-Powers-Act'),
    'page-cag-audit-regulations': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-audit-regulations': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-earlier-versions-regulation-audit-accounts-2007': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-regulations-audit-accounts-2007': ('Governance & Mandate', 'Audit-Regulation', '/About/About-Us/Audit-Regulation'),
    'page-international-relations': ('Leadership & Legacy', 'International Relations', '/About/About-Us/International-Relations'),
    'page-cag-s-auditing-standards-2017': ('Governance & Mandate', 'Auditing Standards', '/About/About-Us/Audit-Regulation'),
    'page-citizen-s-charter': ('Governance & Mandate', 'Citizen Charter', '/About/About-Us/Constitutional-Provisions'),
}


class AboutAdminService:
    @staticmethod
    def get_all_records(db: Optional[Session] = None) -> List[Dict[str, Any]]:
        records = []
        rec_id = 1

        if db and engine.dialect.name == "postgresql":
            try:
                # 1. Fetch Pages from cag_revamp.pages
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
                    WHERE p.id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 16, 17, 40, 41, 6315, 6685, 6688)
                       OR p.slug IN (
                           'page-cag-of-india', 'page-our-vision-mission-values', 'page-history-of-indian-audit-and-accounts-department',
                           'page-audit-advisory-board', 'page-constitutional-provisions', 'page-duties-power-and-conditions-of-services-act',
                           'page-cag-audit-regulations', 'page-audit-regulations', 'page-international-relations'
                       )
                    ORDER BY p.id;
                """)
                page_rows = db.execute(q_pages).mappings().fetchall()
                seen_pids = set()
                for p in page_rows:
                    if p['id'] in seen_pids:
                        continue
                    seen_pids.add(p['id'])
                    cat, subtopic, pub_url = SLUG_TO_META.get(
                        p['slug'],
                        ('Governance & Mandate', p['title_en'] or p['slug'], '/About/About-Us/Cag-Of-India')
                    )
                    file_url = f"https://cag.gov.in/uploads/cms_pages_files/{p['upload_file']}" if p.get('upload_file') else ""
                    records.append({
                        "id": rec_id,
                        "rawId": f"page-{p['id']}",
                        "formattedId": f"#AB-PG{str(p['id']).zfill(3)}",
                        "category": cat,
                        "subTopic": subtopic,
                        "subTopicSlug": p['slug'].replace('page-', ''),
                        "title_en": p['title_en'] or p['slug'],
                        "title_hi": p.get('title_hi') or '',
                        "desc": p.get('excerpt_en') or f"Statutory CMS content for {p['title_en']} from cag_revamp.pages",
                        "table_name": "cag_revamp.pages",
                        "primary_key_or_slug": f"{p['slug']} (ID: {p['id']})",
                        "public_url": pub_url,
                        "thumb_image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                        "file_url": file_url,
                        "file_name": p.get('upload_file') or '',
                        "language": "Bilingual" if p.get('title_hi') else "EN",
                        "is_active": p.get('status') == 1,
                        "item_count": 1,
                        "created_at": str(p.get('created_at') or '2026-01-01'),
                        "modified_at": str(p.get('modified_at') or '2026-09-01'),
                    })
                    rec_id += 1

                # 2. Fetch Former CAGs from cag_revamp.former_cag (all 62 rows)
                q_fc = text("SELECT * FROM cag_revamp.former_cag ORDER BY id;")
                fc_rows = db.execute(q_fc).mappings().fetchall()
                for fc in fc_rows:
                    name = fc.get('tenure') or fc.get('title') or 'Former CAG'
                    img = fc.get('image') or ''
                    img_url = f"https://cag.gov.in/uploads/former_cag/{img}" if img else ""
                    lang = "HI" if fc.get('language') == 'hi' else "EN"
                    
                    records.append({
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
                        "created_at": str(fc.get('created') or '2020-01-01'),
                        "modified_at": str(fc.get('modified') or '2026-09-01'),
                    })
                    rec_id += 1

                # 3. Fetch Org Chart Officers from cag_revamp.organisation_chart (all 74 rows)
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
                    
                    desig = oc.get('designation_display_name') or oc.get('dh_title') or 'Officer'
                    if isinstance(desig, str) and desig.startswith('{'):
                        try:
                            d_json = json.loads(desig)
                            desig = d_json.get('default') or d_json.get('en') or desig
                        except:
                            pass

                    img = oc.get('profile_image') or ''
                    img_url = f"https://cag.gov.in/uploads/cag_emp_profile_pic/{img}" if img else ""
                    is_active = (oc.get('status') == 1 and oc.get('retired') != 1)

                    records.append({
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
                        "created_at": str(oc.get('created') or '2020-01-01'),
                        "modified_at": str(oc.get('modified') or '2026-09-01'),
                    })
                    rec_id += 1

                return records
            except Exception as e:
                logger.error(f"[AboutAdminService] Failed to load from DB: {e}")

        # Fallback local mock
        return []
