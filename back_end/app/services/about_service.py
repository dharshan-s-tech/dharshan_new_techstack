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

HISTORY_IAAD_CHAPTERS = [
    {"id_suffix": "an-01", "title_en": "Analytical History 1947-1989 - Volume I", "title_hi": "विश्लेषणात्मक इतिहास 1947-1989 - भाग I", "desc": "CAG of India - Analytical History 1947-1989 Volume I archival documentation.", "file_url": "https://cag.gov.in/uploads/cag_pdf/analytical_history/vol_1.pdf", "file_name": "vol_1.pdf"},
    {"id_suffix": "an-02", "title_en": "Analytical History 1947-1989 - Volume II", "title_hi": "विश्लेषणात्मक इतिहास 1947-1989 - भाग II", "desc": "CAG of India - Analytical History 1947-1989 Volume II archival documentation.", "file_url": "https://cag.gov.in/uploads/cag_pdf/analytical_history/vol_2.pdf", "file_name": "vol_2.pdf"},
    {"id_suffix": "th1-01", "title_en": "Thematic History 1990-2007 (Vol-1) - Forward", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - प्रस्तावना", "desc": "Thematic History 1990-2007 VOL-I Forward by CAG of India.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/forward.pdf", "file_name": "forward.pdf"},
    {"id_suffix": "th1-02", "title_en": "Thematic History 1990-2007 (Vol-1) - Preface", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - भूमिका", "desc": "Thematic History 1990-2007 VOL-I Preface by C&AG.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/preface.pdf", "file_name": "preface.pdf"},
    {"id_suffix": "th1-03", "title_en": "Thematic History 1990-2007 (Vol-1) - Brief Profile of Former C&AsG", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - पूर्व सीएजी का संक्षिप्त परिचय", "desc": "Brief profiles of Former Comptrollers & Auditors General.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/brief_profile.pdf", "file_name": "brief_profile.pdf"},
    {"id_suffix": "th1-04", "title_en": "Thematic History 1990-2007 (Vol-1) - DAIs during 1990-2007", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - 1990-2007 की अवधि के दौरान डीएआई", "desc": "Deputy Auditors General during the period 1990-2007.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/dais.pdf", "file_name": "dais.pdf"},
    {"id_suffix": "th1-05", "title_en": "Thematic History 1990-2007 (Vol-1) - General Abbreviations", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - सामान्य संक्षिप्ताक्षर", "desc": "General Abbreviations glossary for Thematic History VOL-I.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/abbreviations.pdf", "file_name": "abbreviations.pdf"},
    {"id_suffix": "th1-06", "title_en": "Thematic History 1990-2007 (Vol-1) - Contents", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - विषय-सूची", "desc": "Table of Contents for Thematic History VOL-I.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/contents.pdf", "file_name": "contents.pdf"},
    {"id_suffix": "th1-07", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 1 - Overview", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 1 - अवलोकन", "desc": "Chapter 1 - Overview of Institutional Developments 1990-2007.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_1.pdf", "file_name": "chap_1.pdf"},
    {"id_suffix": "th1-08", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 2 - Govt Policies & Public Admin", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 2 - सरकारी नीतियां", "desc": "Chapter 2 - Developments in Government Policies and Public Administration.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_2.pdf", "file_name": "chap_2.pdf"},
    {"id_suffix": "th1-09", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 3 - Organization of C&AG", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 3 - सीएजी का संगठन", "desc": "Chapter 3 - Organization of C&AG.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_3.pdf", "file_name": "chap_3.pdf"},
    {"id_suffix": "th1-10", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 4 - Developments in Auditing", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 4 - लेखापरीक्षा में विकास", "desc": "Chapter 4 - Developments in Auditing.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_4.pdf", "file_name": "chap_4.pdf"},
    {"id_suffix": "th1-11", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 5 - Audit Reports (Civil)", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 5 - लेखापरीक्षा रिपोर्ट (नागरिक)", "desc": "Chapter 5 - Audit Reports (Civil).", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_5.pdf", "file_name": "chap_5.pdf"},
    {"id_suffix": "th1-12", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 6 - Audit of Receipts", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 6 - प्राप्तियों की लेखापरीक्षा", "desc": "Chapter 6 - Audit of Receipts.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_6.pdf", "file_name": "chap_6.pdf"},
    {"id_suffix": "th1-13", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 7 - Commercial Audit", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 7 - वाणिज्यिक लेखापरीक्षा", "desc": "Chapter 7 - Commercial Audit.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_7.pdf", "file_name": "chap_7.pdf"},
    {"id_suffix": "th1-14", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 8 - Defence Audit", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 8 - रक्षा लेखापरीक्षा", "desc": "Chapter 8 - Defence Audit.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_8.pdf", "file_name": "chap_8.pdf"},
    {"id_suffix": "th1-15", "title_en": "Thematic History 1990-2007 (Vol-1) - Ch 9 - Post & Telecommunications", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - अध्याय 9 - डाक और दूरसंचार", "desc": "Chapter 9 - Post and Telecommunications.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_9.pdf", "file_name": "chap_9.pdf"},
    {"id_suffix": "th1-16", "title_en": "Thematic History 1990-2007 (Vol-1) - Photographs", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-1) - तस्वीरें", "desc": "Photographs archive for Thematic History VOL-I.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/phots.pdf", "file_name": "phots.pdf"},
    {"id_suffix": "th2-01", "title_en": "Thematic History 1990-2007 (Vol-2) - Ch 10 - Railway Audit", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-2) - अध्याय 10 - रेलवे लेखापरीक्षा", "desc": "Chapter 10 - Railway Audit.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_10.pdf", "file_name": "chap_10.pdf"},
    {"id_suffix": "th2-02", "title_en": "Thematic History 1990-2007 (Vol-2) - Ch 11 - Scientific Departments", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-2) - अध्याय 11 - वैज्ञानिक विभाग", "desc": "Chapter 11 - Audit of Scientific Departments.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_11.pdf", "file_name": "chap_11.pdf"},
    {"id_suffix": "th2-03", "title_en": "Thematic History 1990-2007 (Vol-2) - Ch 12 - Performance Audit", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-2) - अध्याय 12 - निष्पादन लेखापरीक्षा", "desc": "Chapter 12 - Performance Audit.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_12.pdf", "file_name": "chap_12.pdf"},
    {"id_suffix": "th2-04", "title_en": "Thematic History 1990-2007 (Vol-2) - Ch 13 - Autonomous Bodies", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-2) - अध्याय 13 - स्वायत्त निकाय", "desc": "Chapter 13 - Audit of Autonomous Bodies.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_13.pdf", "file_name": "chap_13.pdf"},
    {"id_suffix": "th2-05", "title_en": "Thematic History 1990-2007 (Vol-2) - Ch 14 - Local Bodies", "title_hi": "विषयगत इतिहास 1990-2007 (भाग-2) - अध्याय 14 - स्थानीय निकाय", "desc": "Chapter 14 - Audit of Local Bodies - A Collaborative Approach.", "file_url": "https://cag.gov.in/uploads/cag_pdf/thematic_history/chap_14.pdf", "file_name": "chap_14.pdf"},
]


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
                    WHERE (p.status = 1 OR p.status IS NULL) AND (
                        p.id IN (1, 2, 3, 10, 11, 16, 17, 40, 41, 6315, 6685, 6688)
                        OR p.slug IN (
                            'page-cag-of-india', 'page-our-vision-mission-values', 'page-history-of-indian-audit-and-accounts-department',
                            'page-audit-advisory-board', 'page-constitutional-provisions', 'page-duties-power-and-conditions-of-services-act',
                            'page-cag-audit-regulations', 'page-audit-regulations', 'page-earlier-versions-regulation-audit-accounts-2007',
                            'page-regulations-audit-accounts-2007', 'page-cag-s-auditing-standards-2017'
                        )
                        OR p.slug LIKE 'page-cag-of-india-%'
                        OR p.slug LIKE 'page-our-vision-mission-values-%'
                        OR p.slug LIKE 'page-history-of-indian-audit-and-accounts-department-%'
                        OR p.slug LIKE 'page-audit-advisory-board-%'
                        OR p.slug LIKE 'page-constitutional-provisions-%'
                        OR p.slug LIKE 'page-duties-power-and-conditions-of-services-act-%'
                        OR p.slug LIKE 'page-cag-audit-regulations-%'
                        OR p.slug LIKE 'page-audit-regulations-%'
                        OR p.slug LIKE 'page-about-%'
                    )
                    ORDER BY p.id;
                """)
                page_rows = db.execute(q_pages).mappings().fetchall()
                seen_pids = set()
                import re
                for p in page_rows:
                    if p['id'] in seen_pids:
                        continue
                    seen_pids.add(p['id'])
                    slug_str = str(p['slug'])
                    base_slug = re.sub(r'-[a-f0-9]{6,8}$', '', slug_str)
                    cat, st, pub_url = SLUG_TO_META.get(
                        slug_str,
                        SLUG_TO_META.get(base_slug, ('Governance & Mandate', p['title_en'], '/About/About-Us/Cag-Of-India'))
                    )
                    f_url = f"https://cag.gov.in/uploads/cms_pages_files/{p['upload_file']}" if p.get('upload_file') else ""
                    if str(p['id']) == '41' or 'history-of-indian-audit' in slug_str:
                        for ch_idx, ch in enumerate(HISTORY_IAAD_CHAPTERS, 1):
                            all_records.append({
                                "id": rec_id,
                                "rawId": f"hist-{ch['id_suffix']}",
                                "formattedId": f"#AB-HIST-{str(ch_idx).zfill(3)}",
                                "category": "Leadership & Legacy",
                                "subTopic": "History of IAAD",
                                "subTopicSlug": "history-of-indian-audit-and-accounts-department",
                                "title_en": ch["title_en"],
                                "title_hi": ch["title_hi"],
                                "desc": ch["desc"],
                                "table_name": "cag_revamp.pages",
                                "primary_key_or_slug": f"page-history-of-indian-audit-and-accounts-department ({ch['id_suffix']})",
                                "public_url": pub_url,
                                "thumb_image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                                "file_url": ch["file_url"],
                                "file_name": ch["file_name"],
                                "language": "Bilingual",
                                "is_active": True,
                                "item_count": 1,
                                "created_at": str(p.get('created_at') or '01-Jan-2026 10:00 AM'),
                                "modified_at": str(p.get('modified_at') or '09-Sep-2026 04:30 PM'),
                            })
                            rec_id += 1
                        continue

                    all_records.append({
                        "id": rec_id,
                        "rawId": f"page-{p['id']}",
                        "formattedId": f"#AB-PG{str(p['id']).zfill(3)}",
                        "category": cat,
                        "subTopic": st,
                        "subTopicSlug": base_slug.replace('page-', ''),
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

                # 2. Fetch all Former CAGs from cag_revamp.former_cag
                q_fc = text("SELECT * FROM cag_revamp.former_cag ORDER BY id;")
                fc_rows = db.execute(q_fc).mappings().fetchall()
                for fc in fc_rows:
                    name = fc.get('title') if (fc.get('title') and not fc.get('title').startswith('20')) else (fc.get('tenure') or fc.get('title') or 'Former CAG')
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
                        "desc": f"Former Comptroller and Auditor General of India serving from {fc.get('tenure_from', '')} to {fc.get('tenure_to', '')}. {fc.get('title') or ''}".strip(),
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
                        "tenure_from": str(fc.get('tenure_from') or ''),
                        "tenure_to": str(fc.get('tenure_to') or ''),
                        "legacy_title": str(fc.get('title') or 'Former Comptroller and Auditor General of India'),
                    })
                    rec_id += 1

                # 3. Fetch all Organisation Chart Officers from cag_revamp.organisation_chart
                q_oc = text("""
                    SELECT 
                        oc.id,
                        oc.full_name,
                        oc.prefix_name,
                        oc.designation_display_name,
                        oc.email,
                        oc.mobile_no,
                        oc.office_details,
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
                        "created_at": str(oc.get('created') or '01-Jan-2026 10:00 AM'),
                        "modified_at": str(oc.get('modified') or '09-Sep-2026 06:15 PM'),
                        "prefix_name": str(oc.get('prefix_name') or 'Shri'),
                        "designation_display_name": desig,
                        "department": str(oc.get('department') or ''),
                        "email": str(oc.get('email') or ''),
                        "mobile_no": str(oc.get('mobile_no') or ''),
                        "reporting_offices": str(oc.get('office_details') or ''),
                    })
                    rec_id += 1

                # 4. Fetch Board Committees from cag_revamp.board_committees
                try:
                    q_bc = text("SELECT id, name, language, content_type, date, file_title, uploads, link, display_order, status, created_at, updated_at FROM cag_revamp.board_committees ORDER BY id DESC LIMIT 50;")
                    bc_rows = db.execute(q_bc).mappings().fetchall()
                    for bc in bc_rows:
                        bc_file = bc.get('uploads') or ''
                        all_records.append({
                            "id": rec_id,
                            "rawId": f"board-{bc['id']}",
                            "formattedId": f"#AB-BD{str(bc['id']).zfill(3)}",
                            "category": "Leadership & Legacy",
                            "subTopic": "Audit-Advisory-Board",
                            "subTopicSlug": "audit-advisory-board",
                            "title_en": bc.get('name') or "Board / Committee Record",
                            "title_hi": bc.get('name') if bc.get('language') == 'hi' else "",
                            "desc": f"Type: {bc.get('content_type') or 'Member Profile'}. {bc.get('file_title') or ''}".strip(),
                            "table_name": "cag_revamp.board_committees",
                            "primary_key_or_slug": f"ID: {bc['id']}",
                            "public_url": "/About/About-Us/Audit-Advisory-Board",
                            "thumb_image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                            "file_url": f"https://cag.gov.in/uploads/board_committees/{bc_file}" if bc_file else "",
                            "file_name": bc_file,
                            "language": "HI" if bc.get('language') == 'hi' else "EN",
                            "is_active": bc.get('status') == 1,
                            "item_count": 1,
                            "created_at": str(bc.get('created_at') or '01-Jan-2026 10:00 AM'),
                            "modified_at": str(bc.get('updated_at') or '09-Sep-2026 06:15 PM'),
                            "member_expertise": str(bc.get('content_type') or ''),
                            "display_order": bc.get('display_order') or 1,
                        })
                        rec_id += 1
                except Exception as e:
                    logger.debug(f"[AboutAdminService] board_committees load: {e}")

            except Exception as e:
                logger.warning(f"[AboutAdminService] Failed to load DB records: {e}")

        # Fallback if DB didn't load records
        if not all_records:
            from app.services.pages_service import SEED_PAGES
            from app.services.former_cag_service import SEED_FORMER_CAGS
            from app.services.organisation_chart_service import SEED_ORGANISATION_OFFICERS

            for pid, p in SEED_PAGES.items():
                cat, st, pub_url = SLUG_TO_META.get(p['slug'], ('Governance & Mandate', p['title_en'], '/About/About-Us/Cag-Of-India'))
                if str(p['id']) == '41' or 'history-of-indian-audit' in p['slug']:
                    for ch_idx, ch in enumerate(HISTORY_IAAD_CHAPTERS, 1):
                        all_records.append({
                            "id": rec_id,
                            "rawId": f"hist-{ch['id_suffix']}",
                            "formattedId": f"#AB-HIST-{str(ch_idx).zfill(3)}",
                            "category": "Leadership & Legacy",
                            "subTopic": "History of IAAD",
                            "subTopicSlug": "history-of-indian-audit-and-accounts-department",
                            "title_en": ch["title_en"],
                            "title_hi": ch["title_hi"],
                            "desc": ch["desc"],
                            "table_name": "cag_revamp.pages",
                            "primary_key_or_slug": f"page-history-of-indian-audit-and-accounts-department ({ch['id_suffix']})",
                            "public_url": pub_url,
                            "thumb_image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg",
                            "file_url": ch["file_url"],
                            "file_name": ch["file_name"],
                            "language": "Bilingual",
                            "is_active": True,
                            "item_count": 1,
                            "created_at": "01-Sep-2026 10:00 AM",
                            "modified_at": "09-Sep-2026 04:30 PM",
                        })
                        rec_id += 1
                    continue

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

        if category and category != "All":
            filtered = [r for r in filtered if r.get("category") == category]

        if subtopic and subtopic != "All":
            sub_clean = subtopic.lower().replace("-", " ")
            filtered = [
                r for r in filtered
                if subtopic.lower() in str(r.get("subTopicSlug", "")).lower()
                or sub_clean in str(r.get("subTopic", "")).lower()
                or subtopic.lower() in str(r.get("subTopic", "")).lower()
            ]

        if table_name and table_name != "All":
            filtered = [r for r in filtered if str(r.get("table_name", "")) == table_name]

        if language and language != "All":
            filtered = [r for r in filtered if r.get("language") == language]

        if status and status != "All":
            is_act = (status.lower() in ("active", "published", "true", "1"))
            filtered = [r for r in filtered if r.get("is_active") == is_act]

        if search:
            s_low = search.lower().strip()
            filtered = [
                r for r in filtered
                if s_low in str(r.get("title_en", "")).lower()
                or s_low in str(r.get("title_hi", "")).lower()
                or s_low in str(r.get("desc", "")).lower()
                or s_low in str(r.get("formattedId", "")).lower()
                or s_low in str(r.get("primary_key_or_slug", "")).lower()
            ]

        # Sorting
        if sort == "newest":
            pass
        elif sort == "oldest":
            filtered = list(reversed(filtered))
        elif sort == "title_asc":
            filtered = sorted(filtered, key=lambda x: str(x.get("title_en", "")).lower())
        elif sort == "title_desc":
            filtered = sorted(filtered, key=lambda x: str(x.get("title_en", "")).lower(), reverse=True)

        total = len(filtered)
        start = (page - 1) * page_size
        end = start + page_size
        items = filtered[start:end]

        return {
            "total": total,
            "page": page,
            "pageSize": page_size,
            "totalPages": (total + page_size - 1) // page_size if page_size > 0 else 1,
            "items": items,
            "categoryCounts": {
                "whoWeAre": len([r for r in all_records if r.get("category") == "Who We Are"]),
                "leadership": len([r for r in all_records if r.get("category") == "Leadership & Legacy"]),
                "governance": len([r for r in all_records if r.get("category") == "Governance & Mandate"]),
                "total": len(all_records)
            }
        }

    @staticmethod
    def save_about_record(data: Dict[str, Any], db: Optional[Session] = None) -> Dict[str, Any]:
        """Save or update an About Us record in PostgreSQL."""
        if not db or engine.dialect.name != "postgresql":
            return data

        raw_id = str(data.get("rawId") or data.get("id") or "").strip()
        title_en = str(data.get("title_en") or data.get("title") or "").strip()
        title_hi = str(data.get("title_hi") or "").strip()
        desc = str(data.get("desc") or data.get("excerpt") or data.get("description") or "").strip()
        file_name = str(data.get("file_name") or data.get("upload_file") or "").strip()
        is_active = 1 if (data.get("is_active", True) or data.get("status") == 1 or data.get("status") == "Active") else 0
        content_val = data.get("content") or desc or title_en
        content_hi_val = data.get("content_hi") or data.get("desc_hi") or ""
        excerpt_hi_val = data.get("excerpt_hi") or data.get("desc_hi") or ""
        subtopic = data.get("subTopic") or ""
        subtopic_slug = data.get("subTopicSlug") or ""
        table_name = data.get("table_name") or ""

        # If raw_id is numeric, attempt to resolve the actual item from registry
        if raw_id.isdigit():
            rec_id_num = int(raw_id)
            all_recs = AboutAdminService.get_all_about_records(db=db, page=1, page_size=1000).get("items", [])
            matched = next((r for r in all_recs if r.get("id") == rec_id_num or r.get("rawId") == raw_id), None)
            if matched:
                raw_id = str(matched.get("rawId") or raw_id)
                table_name = matched.get("table_name") or table_name

        try:
            # 1. Speeches (cag_revamp.speeches)
            if raw_id.startswith("speech-") or table_name == "cag_revamp.speeches" or subtopic_slug == "speeches":
                sp_date = str(data.get("speech_date") or data.get("date") or "2026-09-01").strip()
                show_whats_new = 1 if (data.get("show_in_whats_new") or data.get("whats_new")) else 0
                sp_id_str = raw_id.replace("speech-", "")
                if sp_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.speeches
                        SET title = :title,
                            description = :description,
                            cag_speech = COALESCE(NULLIF(:cag_speech, ''), cag_speech),
                            speech_date = COALESCE(NULLIF(:speech_date, '')::date, speech_date),
                            show_in_whats_new = :show_in_whats_new,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "description": desc,
                        "cag_speech": file_name,
                        "speech_date": sp_date,
                        "show_in_whats_new": show_whats_new,
                        "status": is_active,
                        "id": int(sp_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.speeches (
                            title, language, description, cag_speech, speech_date, show_in_whats_new, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :description, :cag_speech, :speech_date::date, :show_in_whats_new, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "description": desc,
                        "cag_speech": file_name,
                        "speech_date": sp_date,
                        "show_in_whats_new": show_whats_new,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"speech-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-SP{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 2. Young Professional Programme (cag_revamp.young_professional_programme)
            elif raw_id.startswith("ypp-") or table_name == "cag_revamp.young_professional_programme" or subtopic_slug == "young-professional-programme":
                doi = str(data.get("date_of_issue") or data.get("date") or "2026-06-01").strip()
                show_whats_new = 1 if (data.get("show_in_whats_new") or data.get("whats_new")) else 0
                ypp_id_str = raw_id.replace("ypp-", "")
                if ypp_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.young_professional_programme
                        SET title = :title,
                            body = :body,
                            document = COALESCE(NULLIF(:document, ''), document),
                            date_of_issue = COALESCE(NULLIF(:date_of_issue, '')::timestamp, date_of_issue),
                            show_in_whats_new = :show_in_whats_new,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "body": desc,
                        "document": file_name,
                        "date_of_issue": doi,
                        "show_in_whats_new": show_whats_new,
                        "status": is_active,
                        "id": int(ypp_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.young_professional_programme (
                            title, language, body, document, date_of_issue, show_in_whats_new, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :body, :document, :date_of_issue::timestamp, :show_in_whats_new, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "body": desc,
                        "document": file_name,
                        "date_of_issue": doi,
                        "show_in_whats_new": show_whats_new,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"ypp-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-YPP{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 3. Student Internship Programme (cag_revamp.student_internship_programme)
            elif raw_id.startswith("sip-") or table_name == "cag_revamp.student_internship_programme" or subtopic_slug == "student-internship-programme":
                doi = str(data.get("date_of_issue") or data.get("date") or "2026-07-01").strip()
                show_whats_new = 1 if (data.get("show_in_whats_new") or data.get("whats_new")) else 0
                sip_id_str = raw_id.replace("sip-", "")
                if sip_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.student_internship_programme
                        SET title = :title,
                            body = :body,
                            document = COALESCE(NULLIF(:document, ''), document),
                            date_of_issue = COALESCE(NULLIF(:date_of_issue, '')::timestamp, date_of_issue),
                            show_in_whats_new = :show_in_whats_new,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "body": desc,
                        "document": file_name,
                        "date_of_issue": doi,
                        "show_in_whats_new": show_whats_new,
                        "status": is_active,
                        "id": int(sip_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.student_internship_programme (
                            title, language, body, document, date_of_issue, show_in_whats_new, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :body, :document, :date_of_issue::timestamp, :show_in_whats_new, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "body": desc,
                        "document": file_name,
                        "date_of_issue": doi,
                        "show_in_whats_new": show_whats_new,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"sip-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-SIP{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 4. Rajbhasha Cadre (cag_revamp.rajbhasha_cadre)
            elif raw_id.startswith("rajbhasha-") or table_name == "cag_revamp.rajbhasha_cadre" or subtopic_slug == "rajbhasha-cadre":
                rb_id_str = raw_id.replace("rajbhasha-", "")
                if rb_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.rajbhasha_cadre
                        SET title = :title,
                            upload_file = COALESCE(NULLIF(:upload_file, ''), upload_file),
                            file_title = :file_title,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "upload_file": file_name,
                        "file_title": desc or title_en,
                        "status": is_active,
                        "id": int(rb_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.rajbhasha_cadre (
                            title, language, upload_file, file_title, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :upload_file, :file_title, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "upload_file": file_name,
                        "file_title": desc or title_en,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"rajbhasha-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-RAJ{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 5. Board Committees (cag_revamp.board_committees)
            elif raw_id.startswith("board-") or table_name == "cag_revamp.board_committees":
                bc_id_str = raw_id.replace("board-", "")
                disp_order = int(data.get("display_order") or 1)
                exp = str(data.get("member_expertise") or desc or "").strip()
                if bc_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.board_committees
                        SET name = :name,
                            content_type = :content_type,
                            address = :address,
                            uploads = COALESCE(NULLIF(:uploads, ''), uploads),
                            display_order = :display_order,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "name": title_en,
                        "content_type": exp or "Member Profile",
                        "address": desc,
                        "uploads": file_name,
                        "display_order": disp_order,
                        "status": is_active,
                        "id": int(bc_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.board_committees (
                            general_category_id, name, language, content_type, address, uploads, display_order, status, created_by, created_at, updated_at
                        ) VALUES (
                            1, :name, 'en', :content_type, :address, :uploads, :display_order, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "name": title_en,
                        "content_type": exp or "Member Profile",
                        "address": desc,
                        "uploads": file_name,
                        "display_order": disp_order,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"board-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-BD{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 6. Collaborations (cag_revamp.collaborations)
            elif raw_id.startswith("collab-") or table_name == "cag_revamp.collaborations" or subtopic_slug == "collaborations":
                col_id_str = raw_id.replace("collab-", "")
                if col_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.collaborations
                        SET title = :title,
                            description = :description,
                            mou_doc = COALESCE(NULLIF(:mou_doc, ''), mou_doc),
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "description": desc,
                        "mou_doc": file_name,
                        "status": is_active,
                        "id": int(col_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.collaborations (
                            title, language, description, mou_doc, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :description, :mou_doc, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "description": desc,
                        "mou_doc": file_name,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"collab-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-COL{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 7. Welfare Activities (cag_revamp.welfare)
            elif raw_id.startswith("welfare-") or table_name == "cag_revamp.welfare" or subtopic_slug == "welfare":
                wel_id_str = raw_id.replace("welfare-", "")
                if wel_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.welfare
                        SET title = :title,
                            description = :description,
                            upload_file = COALESCE(NULLIF(:upload_file, ''), upload_file),
                            file_title = :file_title,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "description": desc,
                        "upload_file": file_name,
                        "file_title": desc or title_en,
                        "status": is_active,
                        "id": int(wel_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.welfare (
                            title, language, description, upload_file, file_title, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :description, :upload_file, :file_title, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "description": desc,
                        "upload_file": file_name,
                        "file_title": desc or title_en,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"welfare-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-WEL{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 8. Administrative Information (cag_revamp.administrative_information)
            elif raw_id.startswith("admininfo-") or table_name == "cag_revamp.administrative_information" or subtopic_slug == "administrative-information":
                adm_id_str = raw_id.replace("admininfo-", "")
                if adm_id_str.isdigit():
                    db.execute(text("""
                        UPDATE cag_revamp.administrative_information
                        SET title = :title,
                            upload_file = COALESCE(NULLIF(:upload_file, ''), upload_file),
                            file_title = :file_title,
                            status = :status,
                            updated_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "upload_file": file_name,
                        "file_title": desc or title_en,
                        "status": is_active,
                        "id": int(adm_id_str)
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.administrative_information (
                            title, language, upload_file, file_title, status, created_by, created_at, updated_at
                        ) VALUES (
                            :title, 'en', :upload_file, :file_title, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": title_en,
                        "upload_file": file_name,
                        "file_title": desc or title_en,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"admininfo-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-ADM{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 9. Update Existing Page (cag_revamp.pages)
            elif raw_id.startswith("page-") or (table_name == "cag_revamp.pages" and (raw_id.isdigit() or "page" in raw_id)):
                pid_str = raw_id.replace("page-", "").strip()
                pid = None
                if pid_str.isdigit():
                    pid = int(pid_str)
                else:
                    from app.services.pages_service import SLUG_TO_ID_MAP
                    mapped_id = SLUG_TO_ID_MAP.get(pid_str) or SLUG_TO_ID_MAP.get(f"page-{pid_str}")
                    if mapped_id and str(mapped_id).isdigit():
                        pid = int(mapped_id)
                    else:
                        row = db.execute(text("SELECT id FROM cag_revamp.pages WHERE slug = :slug OR slug = 'page-' || :slug LIMIT 1;"), {"slug": pid_str}).fetchone()
                        if row:
                            pid = row[0]

                if pid:
                    db.execute(text("""
                        UPDATE cag_revamp.pages
                        SET title = :title,
                            excerpt = :excerpt,
                            content = :content,
                            upload_file = :upload_file,
                            status = :status,
                            modified_at = NOW()
                        WHERE id = :id;
                    """), {
                        "title": title_en,
                        "excerpt": desc,
                        "content": content_val,
                        "upload_file": file_name,
                        "status": is_active,
                        "id": pid
                    })

                    if title_hi or content_hi_val or excerpt_hi_val:
                        exists = db.execute(text("""
                            SELECT id FROM cag_revamp.page_translations
                            WHERE page_id = :pid AND culture = 'hi';
                        """), {"pid": pid}).fetchone()
                        if exists:
                            db.execute(text("""
                                UPDATE cag_revamp.page_translations
                                SET title = :title,
                                    excerpt = :excerpt,
                                    content = :content
                                WHERE page_id = :pid AND culture = 'hi';
                            """), {
                                "title": title_hi or title_en,
                                "excerpt": excerpt_hi_val,
                                "content": content_hi_val,
                                "pid": pid
                            })
                        else:
                            db.execute(text("""
                                INSERT INTO cag_revamp.page_translations (page_id, culture, title, excerpt, content)
                                VALUES (:pid, 'hi', :title, :excerpt, :content);
                            """), {
                                "pid": pid,
                                "title": title_hi or title_en,
                                "excerpt": excerpt_hi_val,
                                "content": content_hi_val
                            })
                    db.commit()
                    return data

            # 10. Former CAG (cag_revamp.former_cag)
            elif raw_id.startswith("former-cag-") or subtopic == "Former CAGs Gallery" or table_name == "cag_revamp.former_cag" or subtopic_slug == "former-cags":
                fcid_str = raw_id.replace("former-cag-", "")
                t_from = str(data.get("tenure_from") or "2024").strip()
                t_to = str(data.get("tenure_to") or "2029").strip()
                leg_title = str(data.get("legacy_title") or data.get("title") or "Former Comptroller and Auditor General of India").strip()
                if fcid_str.isdigit():
                    fcid = int(fcid_str)
                    db.execute(text("""
                        UPDATE cag_revamp.former_cag
                        SET tenure = :tenure,
                            title = :title,
                            tenure_from = COALESCE(NULLIF(:t_from, ''), tenure_from),
                            tenure_to = COALESCE(NULLIF(:t_to, ''), tenure_to),
                            image = COALESCE(NULLIF(:image, ''), image),
                            status = :status,
                            modified = NOW()
                        WHERE id = :id;
                    """), {
                        "tenure": title_en,
                        "title": leg_title,
                        "t_from": t_from,
                        "t_to": t_to,
                        "image": file_name,
                        "status": is_active,
                        "id": fcid
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.former_cag (
                            title, language, tenure, tenure_from, tenure_to, image, status, created_by, created, modified
                        ) VALUES (
                            :title, 'en', :tenure, :tenure_from, :tenure_to, :image, :status, 1, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "title": leg_title,
                        "tenure": title_en,
                        "tenure_from": t_from,
                        "tenure_to": t_to,
                        "image": file_name,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"former-cag-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-FC{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 11. Organisation Chart Officer (cag_revamp.organisation_chart)
            elif raw_id.startswith("org-chart-") or subtopic == "Organisation-Chart" or table_name == "cag_revamp.organisation_chart" or subtopic_slug == "organisation-chart":
                ocid_str = raw_id.replace("org-chart-", "")
                prefix = str(data.get("prefix_name") or "Shri").strip()
                desig = str(data.get("designation_display_name") or data.get("designation") or "Deputy Comptroller & Auditor General").strip()
                dept = str(data.get("department") or "Executive Portfolio").strip()
                email = str(data.get("email") or "").strip()
                mobile = str(data.get("mobile_no") or "").strip()
                rep_offices = str(data.get("reporting_offices") or data.get("desc") or "").strip()
                disp_order = int(data.get("display_order") or 1)

                if ocid_str.isdigit():
                    ocid = int(ocid_str)
                    db.execute(text("""
                        UPDATE cag_revamp.organisation_chart
                        SET full_name = :name,
                            prefix_name = COALESCE(NULLIF(:prefix, ''), prefix_name),
                            designation_display_name = COALESCE(NULLIF(:desig, ''), designation_display_name),
                            department = COALESCE(NULLIF(:dept, ''), department),
                            email = COALESCE(NULLIF(:email, ''), email),
                            mobile_no = COALESCE(NULLIF(:mobile, ''), mobile_no),
                            office_details = COALESCE(NULLIF(:rep_offices, ''), office_details),
                            profile_image = COALESCE(NULLIF(:profile_image, ''), profile_image),
                            display_order = CASE WHEN :disp_order > 0 THEN :disp_order ELSE display_order END,
                            status = :status,
                            modified = NOW()
                        WHERE id = :id;
                    """), {
                        "name": title_en,
                        "prefix": prefix,
                        "desig": desig,
                        "dept": dept,
                        "email": email,
                        "mobile": mobile,
                        "rep_offices": rep_offices,
                        "profile_image": file_name,
                        "disp_order": disp_order,
                        "status": is_active,
                        "id": ocid
                    })
                else:
                    res = db.execute(text("""
                        INSERT INTO cag_revamp.organisation_chart (
                            full_name, designation, designation_display_name, language, prefix_name, email, mobile_no, department,
                            office_details, profile_image, display_order,
                            designation_hierarchy_id, org_charge_master_id,
                            additional_reporting_to, additional_charge, dept_description, created_by, modified_by,
                            charge_assumption_date, charge_assumption_to_date, no_charge_remark, std_code,
                            display_name, seniority_confirmed, reporting_history_from, reporting_history_to,
                            reporting_to_history_ids, reporting_history_offices, status, created, modified
                        ) VALUES (
                            :full_name, 1, :desig, 'en', :prefix, :email, :mobile, :dept,
                            :office_details, :profile_image, :display_order,
                            2, 1,
                            '', '', '', 1, 1,
                            '', '', '', '',
                            1, 0, '', '',
                            '', '', :status, NOW(), NOW()
                        ) RETURNING id;
                    """), {
                        "full_name": title_en,
                        "desig": desig,
                        "prefix": prefix,
                        "email": email,
                        "mobile": mobile,
                        "dept": dept,
                        "office_details": rep_offices,
                        "profile_image": file_name,
                        "display_order": disp_order,
                        "status": is_active
                    })
                    new_id = res.scalar()
                    data["rawId"] = f"org-chart-{new_id}"
                    data["id"] = new_id
                    data["formattedId"] = f"#AB-OC{str(new_id).zfill(3)}"
                db.commit()
                return data

            # 12. Default: Insert into cag_revamp.pages
            else:
                import uuid
                slug_prefix_map = {
                    'CAG of India Profile': 'page-cag-of-india',
                    'Our Vision, Mission & Core Values': 'page-our-vision-mission-values',
                    'History of IAAD': 'page-history-of-indian-audit-and-accounts-department',
                    'Audit-Advisory-Board': 'page-audit-advisory-board',
                    'Constitutional-Provisions': 'page-constitutional-provisions',
                    'Duties-&-Powers-Act': 'page-duties-power-and-conditions-of-services-act',
                    'Audit-Regulation': 'page-cag-audit-regulations',
                }
                base = slug_prefix_map.get(subtopic) or (f"page-{data.get('subTopicSlug')}" if data.get('subTopicSlug') else 'page-about')
                unique_suffix = uuid.uuid4().hex[:6]
                slug = f"{base}-{unique_suffix}"
                res = db.execute(text("""
                    INSERT INTO cag_revamp.pages (
                        title, slug, excerpt, content, is_home, upload_file, status, created_by, updated_by, show_on_home_page, created_at, modified_at
                    ) VALUES (
                        :title, :slug, :excerpt, :content, 0, :upload_file, :status, 1, 1, 0, NOW(), NOW()
                    ) RETURNING id;
                """), {
                    "title": title_en,
                    "slug": slug,
                    "excerpt": desc,
                    "content": desc or title_en,
                    "upload_file": file_name,
                    "status": is_active
                })
                new_id = res.scalar()

                if title_hi:
                    db.execute(text("""
                        INSERT INTO cag_revamp.page_translations (
                            page_id, language_id, culture, title, slug, excerpt, content
                        ) VALUES (
                            :pid, 2, 'hi', :title, :slug, :excerpt, :content
                        );
                    """), {
                        "pid": new_id,
                        "title": title_hi,
                        "slug": f"{slug}-hi",
                        "excerpt": desc,
                        "content": desc or title_hi
                    })

                db.commit()
                data["rawId"] = f"page-{new_id}"
                data["id"] = new_id
                data["formattedId"] = f"#AB-PG{str(new_id).zfill(3)}"
                return data

        except Exception as e:
            logger.error(f"[AboutAdminService] Failed to save DB record {raw_id}: {e}")
            db.rollback()

        return data

    @staticmethod
    def delete_about_record(raw_id: str, db: Optional[Session] = None) -> bool:
        """Permanently delete an About Us record in PostgreSQL and cascades."""
        if not db or engine.dialect.name != "postgresql":
            return True

        raw_id_str = str(raw_id).strip()
        try:
            if raw_id_str.startswith("speech-"):
                sp_id = int(raw_id_str.replace("speech-", ""))
                db.execute(text("DELETE FROM cag_revamp.speeches WHERE id = :id;"), {"id": sp_id})
                db.commit()
            elif raw_id_str.startswith("ypp-"):
                ypp_id = int(raw_id_str.replace("ypp-", ""))
                db.execute(text("DELETE FROM cag_revamp.young_professional_programme WHERE id = :id;"), {"id": ypp_id})
                db.commit()
            elif raw_id_str.startswith("sip-"):
                sip_id = int(raw_id_str.replace("sip-", ""))
                db.execute(text("DELETE FROM cag_revamp.student_internship_programme WHERE id = :id;"), {"id": sip_id})
                db.commit()
            elif raw_id_str.startswith("rajbhasha-"):
                rb_id = int(raw_id_str.replace("rajbhasha-", ""))
                db.execute(text("DELETE FROM cag_revamp.rajbhasha_cadre WHERE id = :id;"), {"id": rb_id})
                db.commit()
            elif raw_id_str.startswith("board-"):
                bc_id = int(raw_id_str.replace("board-", ""))
                db.execute(text("DELETE FROM cag_revamp.board_committees WHERE id = :id;"), {"id": bc_id})
                db.commit()
            elif raw_id_str.startswith("collab-"):
                col_id = int(raw_id_str.replace("collab-", ""))
                db.execute(text("DELETE FROM cag_revamp.collaborations WHERE id = :id;"), {"id": col_id})
                db.commit()
            elif raw_id_str.startswith("welfare-"):
                wel_id = int(raw_id_str.replace("welfare-", ""))
                db.execute(text("DELETE FROM cag_revamp.welfare WHERE id = :id;"), {"id": wel_id})
                db.commit()
            elif raw_id_str.startswith("admininfo-"):
                adm_id = int(raw_id_str.replace("admininfo-", ""))
                db.execute(text("DELETE FROM cag_revamp.administrative_information WHERE id = :id;"), {"id": adm_id})
                db.commit()
            elif raw_id_str.startswith("page-"):
                pid_str = raw_id_str.replace("page-", "")
                if pid_str.isdigit():
                    pid = int(pid_str)
                    db.execute(text("DELETE FROM cag_revamp.page_translations WHERE page_id = :id;"), {"id": pid})
                    db.execute(text("DELETE FROM cag_revamp.pages WHERE id = :id;"), {"id": pid})
                    db.commit()
            elif raw_id_str.startswith("former-cag-"):
                fcid_str = raw_id_str.replace("former-cag-", "")
                if fcid_str.isdigit():
                    fcid = int(fcid_str)
                    db.execute(text("DELETE FROM cag_revamp.former_cag WHERE id = :id;"), {"id": fcid})
                    db.commit()
            elif raw_id_str.startswith("org-chart-"):
                ocid_str = raw_id_str.replace("org-chart-", "")
                if ocid_str.isdigit():
                    ocid = int(ocid_str)
                    db.execute(text("DELETE FROM cag_revamp.organisation_chart WHERE id = :id;"), {"id": ocid})
                    db.commit()
            elif raw_id_str.isdigit():
                rec_id_num = int(raw_id_str)
                all_recs = AboutAdminService.get_all_about_records(db=db, status='all', page=1, page_size=2000).get("items", [])
                matched = next((r for r in all_recs if r.get("id") == rec_id_num or str(r.get("rawId")) == raw_id_str), None)
                if matched:
                    tbl = matched.get("table_name", "")
                    real_raw = str(matched.get("rawId", ""))
                    if real_raw.startswith("page-") or tbl == "cag_revamp.pages":
                        p_id = int(real_raw.replace("page-", "")) if real_raw.startswith("page-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.page_translations WHERE page_id = :id;"), {"id": p_id})
                        db.execute(text("DELETE FROM cag_revamp.pages WHERE id = :id;"), {"id": p_id})
                        db.commit()
                    elif real_raw.startswith("former-cag-") or tbl == "cag_revamp.former_cag":
                        fc_id = int(real_raw.replace("former-cag-", "")) if real_raw.startswith("former-cag-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.former_cag WHERE id = :id;"), {"id": fc_id})
                        db.commit()
                    elif real_raw.startswith("org-chart-") or tbl == "cag_revamp.organisation_chart":
                        oc_id = int(real_raw.replace("org-chart-", "")) if real_raw.startswith("org-chart-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.organisation_chart WHERE id = :id;"), {"id": oc_id})
                        db.commit()
                    elif real_raw.startswith("speech-") or tbl == "cag_revamp.speeches":
                        s_id = int(real_raw.replace("speech-", "")) if real_raw.startswith("speech-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.speeches WHERE id = :id;"), {"id": s_id})
                        db.commit()
                    elif real_raw.startswith("ypp-") or tbl == "cag_revamp.young_professional_programme":
                        y_id = int(real_raw.replace("ypp-", "")) if real_raw.startswith("ypp-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.young_professional_programme WHERE id = :id;"), {"id": y_id})
                        db.commit()
                    elif real_raw.startswith("sip-") or tbl == "cag_revamp.student_internship_programme":
                        si_id = int(real_raw.replace("sip-", "")) if real_raw.startswith("sip-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.student_internship_programme WHERE id = :id;"), {"id": si_id})
                        db.commit()
                    elif real_raw.startswith("rajbhasha-") or tbl == "cag_revamp.rajbhasha_cadre":
                        r_id = int(real_raw.replace("rajbhasha-", "")) if real_raw.startswith("rajbhasha-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.rajbhasha_cadre WHERE id = :id;"), {"id": r_id})
                        db.commit()
                    elif real_raw.startswith("board-") or tbl == "cag_revamp.board_committees":
                        b_id = int(real_raw.replace("board-", "")) if real_raw.startswith("board-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.board_committees WHERE id = :id;"), {"id": b_id})
                        db.commit()
                    elif real_raw.startswith("collab-") or tbl == "cag_revamp.collaborations":
                        c_id = int(real_raw.replace("collab-", "")) if real_raw.startswith("collab-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.collaborations WHERE id = :id;"), {"id": c_id})
                        db.commit()
                    elif real_raw.startswith("welfare-") or tbl == "cag_revamp.welfare":
                        w_id = int(real_raw.replace("welfare-", "")) if real_raw.startswith("welfare-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.welfare WHERE id = :id;"), {"id": w_id})
                        db.commit()
                    elif real_raw.startswith("admininfo-") or tbl == "cag_revamp.administrative_information":
                        a_id = int(real_raw.replace("admininfo-", "")) if real_raw.startswith("admininfo-") else rec_id_num
                        db.execute(text("DELETE FROM cag_revamp.administrative_information WHERE id = :id;"), {"id": a_id})
                        db.commit()
            return True
        except Exception as e:
            logger.error(f"[AboutAdminService] Failed to delete DB record {raw_id}: {e}")
            db.rollback()
            return False
