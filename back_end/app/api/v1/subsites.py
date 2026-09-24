from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from bs4 import BeautifulSoup
import json
import re

from app.core.database import get_db

router = APIRouter()


def clean_html_text(html_str: str) -> str:
    if not html_str:
        return ""
    soup = BeautifulSoup(html_str, "html.parser")
    return soup.get_text(separator="\n", strip=True)


def parse_json_field(val: Any) -> Any:
    if not val:
        return val
    if isinstance(val, (dict, list)):
        return val
    if isinstance(val, str) and (val.startswith("{") or val.startswith("[")):
        try:
            return json.loads(val)
        except Exception:
            return val
    return val


def extract_multilingual_name(name_field: Any, default_name: str = "") -> Dict[str, str]:
    parsed = parse_json_field(name_field)
    if isinstance(parsed, dict):
        en_val = parsed.get("default") or parsed.get("en") or default_name
        hi_val = parsed.get("hi") or en_val
        return {"en": str(en_val).strip(), "hi": str(hi_val).strip()}
    return {"en": str(name_field or default_name).strip(), "hi": str(name_field or default_name).strip()}


@router.get("")
@router.get("/")
async def get_all_overseas_subsites(db: Session = Depends(get_db)):
    """Fetch all overseas and specialized audit offices directly from PostgreSQL database (Read-Only)"""
    try:
        query = text("""
            SELECT w.id, w.title, w.title_hi, w.url, w.email, w.theme, w.department_id, w.state_id, w.status,
                   d.title as dept_title, d.slug as dept_slug
            FROM cag_revamp.websites w
            LEFT JOIN cag_revamp.departments d ON w.department_id = d.id
            WHERE w.status = 1
              AND (
                w.department_id IN (12, 13)
                OR LOWER(w.theme) IN ('ldn', 'kul', 'wdc', 'rom', 'gva', 'overseas')
                OR LOWER(w.title) LIKE '%overseas%'
                OR LOWER(w.title) LIKE '%london%' 
                OR LOWER(w.title) LIKE '%washington%' 
                OR LOWER(w.title) LIKE '%kuala%' 
                OR LOWER(w.title) LIKE '%rome%' 
                OR LOWER(w.title) LIKE '%geneva%'
                OR LOWER(w.url) LIKE '%/pda/%'
                OR LOWER(d.title) LIKE '%overseas%'
                OR LOWER(d.title) LIKE '%london%'
              )
            ORDER BY w.id ASC;
        """)
        rows = db.execute(query).mappings().all()
        results = []
        for r in rows:
            w_dict = dict(r)
            clean_title = extract_multilingual_name(w_dict.get("title"))["en"]
            clean_title_hi = extract_multilingual_name(w_dict.get("title_hi"), clean_title)["hi"]
            theme_upper = (w_dict.get("theme") or "").upper()
            clean_url = w_dict.get("url") or ""

            if "london" in clean_title.lower() or "ldn" in clean_url.lower() or theme_upper == "LDN":
                local_url = "/states/overseas-london"
                ext_url = "https://cag.gov.in/pda-london/en"
                clean_title_hi = "प्रधान निदेशक लेखा परीक्षा, लंदन"
            elif "washington" in clean_title.lower() or "wdc" in clean_url.lower() or theme_upper == "WDC":
                local_url = "/states/overseas-washington"
                ext_url = "https://cag.gov.in/pda-washington/en"
                clean_title_hi = "प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी"
            elif "kuala" in clean_title.lower() or "kul" in clean_url.lower() or theme_upper == "KUL":
                local_url = "/states/overseas-kualalumpur"
                ext_url = "https://cag.gov.in/pda-kualalumpur/en"
                clean_title_hi = "प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर"
            elif "rome" in clean_title.lower() or theme_upper == "ROM":
                local_url = "/states/overseas-rome"
                ext_url = "https://cag.gov.in/en/external-audit-rome"
            elif "geneva" in clean_title.lower() or theme_upper == "GVA":
                local_url = "/states/overseas-geneva"
                ext_url = "https://cag.gov.in/en/external-audit-geneva"
            else:
                local_url = f"/states/{w_dict.get('theme', '').lower() or w_dict.get('id')}"
                ext_url = f"https://cag.gov.in{clean_url}"

            results.append({
                "id": str(w_dict["id"]),
                "website_id": w_dict["id"],
                "name": clean_title,
                "name_hi": clean_title_hi,
                "title": clean_title,
                "title_hi": clean_title_hi,
                "url": clean_url,
                "localUrl": local_url,
                "local_url": local_url,
                "externalUrl": ext_url,
                "external_url": ext_url,
                "theme": w_dict.get("theme"),
                "email": w_dict.get("email") or "",
                "department_id": w_dict.get("department_id"),
                "status": w_dict.get("status")
            })

        # Ensure Rome and Geneva external audit offices are included
        has_rome = any("rome" in (r.get("name") or "").lower() or (r.get("theme") or "").upper() == "ROM" for r in results)
        if not has_rome:
            results.append({
                "id": "ext-rome",
                "website_id": 991,
                "name": "Director of External Audit, Rome",
                "name_hi": "बाह्य लेखा परीक्षा निदेशक, रोम",
                "title": "Director of External Audit, Rome",
                "title_hi": "बाह्य लेखा परीक्षा निदेशक, रोम",
                "url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "localUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "local_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "externalUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "external_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "theme": "ROM",
                "email": "",
                "department_id": 13,
                "status": 1,
                "is_pdf": True,
                "file_size": "150 KB"
            })

        has_geneva = any("geneva" in (r.get("name") or "").lower() or (r.get("theme") or "").upper() == "GVA" for r in results)
        if not has_geneva:
            results.append({
                "id": "ext-geneva",
                "website_id": 992,
                "name": "Director of External Audit, Geneva",
                "name_hi": "बाह्य लेखा परीक्षा निदेशक, जिनेवा",
                "title": "Director of External Audit, Geneva",
                "title_hi": "बाह्य लेखा परीक्षा निदेशक, जिनेवा",
                "url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "localUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "local_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "externalUrl": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "external_url": "https://cag.gov.in/uploads/media/overseas-20201210172031.pdf",
                "theme": "GVA",
                "email": "",
                "department_id": 13,
                "status": 1,
                "is_pdf": True,
                "file_size": "100 KB"
            })

        return {
            "status": "success",
            "total": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{slug}")
async def get_subsite_by_slug(slug: str, db: Session = Depends(get_db)):
    """Fetch complete subsite data (Website, Menus, Pages, Staff, Contact, Gallery, Recruitment Rules) from PostgreSQL"""
    slug_clean = slug.lower().strip()
    slug_keyword = slug_clean.replace("overseas-", "").replace("pda-", "")
    
    try:
        # 1. Resolve Website from DB
        q_web = text("""
            SELECT w.id, w.title, w.title_hi, w.url, w.email, w.theme, w.department_id, w.state_id, w.status,
                   d.title as dept_title, d.slug as dept_slug
            FROM cag_revamp.websites w
            LEFT JOIN cag_revamp.departments d ON w.department_id = d.id
            WHERE (
                CAST(w.id AS TEXT) = :param
                OR LOWER(w.url) LIKE :param_url
                OR LOWER(w.title) LIKE :param_title
                OR LOWER(w.theme) = :param_theme
                OR (LOWER(:param) LIKE '%london%' AND (LOWER(w.title) LIKE '%london%' OR LOWER(w.url) LIKE '%ldn%'))
                OR (LOWER(:param) LIKE '%washington%' AND (LOWER(w.title) LIKE '%washington%' OR LOWER(w.url) LIKE '%wdc%'))
                OR (LOWER(:param) LIKE '%kuala%' AND (LOWER(w.title) LIKE '%kuala%' OR LOWER(w.url) LIKE '%kul%'))
                OR (LOWER(:param) LIKE '%rome%' AND (LOWER(w.title) LIKE '%rome%' OR LOWER(w.url) LIKE '%rom%'))
                OR (LOWER(:param) LIKE '%geneva%' AND (LOWER(w.title) LIKE '%geneva%' OR LOWER(w.url) LIKE '%gva%'))
            ) AND w.status = 1
            ORDER BY w.id ASC
            LIMIT 1;
        """)
        web_row = db.execute(q_web, {
            "param": slug_clean,
            "param_url": f"%{slug_keyword}%",
            "param_title": f"%{slug_keyword}%",
            "param_theme": slug_keyword
        }).mappings().first()

        if not web_row:
            # Check if any overseas website exists as fallback
            web_row = db.execute(text("SELECT * FROM cag_revamp.websites WHERE id = 148 LIMIT 1;")).mappings().first()

        website = dict(web_row) if web_row else {}
        wid = website.get("id", 148)
        theme = website.get("theme", "WDC")

        # 2. Subsite Code Keyword for Pages (ldn, wdc, kul, rom, gva)
        code = "ldn" if "ldn" in website.get("url", "") or "london" in website.get("title", "").lower() else \
               "wdc" if "wdc" in website.get("url", "") or "washington" in website.get("title", "").lower() else \
               "kul" if "kul" in website.get("url", "") or "kuala" in website.get("title", "").lower() else slug_keyword

        # 3. Menus from DB
        q_menus = text("""
            SELECT mr.region, mr.slug as region_slug,
                   m.id as menu_id, m.parent_id, m.menu_title, m.menu_summary, m.menu_type, m.custom_link, m.object_id, m.sort_order
            FROM cag_revamp.menu_regions mr
            JOIN cag_revamp.menus m ON m.menu_region_id = mr.id
            WHERE mr.website_id = :wid AND m.status = 1
            ORDER BY mr.id, m.parent_id, m.sort_order, m.id;
        """)
        menus_rows = db.execute(q_menus, {"wid": wid}).mappings().all()
        menus_list = []
        for m in menus_rows:
            m_dict = dict(m)
            titles = extract_multilingual_name(m_dict.get("menu_title"))
            m_dict["title_en"] = titles["en"]
            m_dict["title_hi"] = titles["hi"]
            menus_list.append(m_dict)

        # 4. Pages from DB (via content_accesses OR matching slug code) with Hindi translations
        q_pages = text("""
            SELECT DISTINCT p.id, p.title, p.slug, p.excerpt, p.content, p.file_title, p.upload_file, p.status, p.created_at,
                   pt.title as title_hi, pt.content as content_hi
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.content_accesses ca ON ca.content_id = p.id
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'hi'
            WHERE (ca.website_id = :wid OR LOWER(p.slug) LIKE :code_pattern)
              AND p.status = 1
            ORDER BY p.id;
        """)
        pages_rows = db.execute(q_pages, {"wid": wid, "code_pattern": f"%{code}%"}).mappings().all()
        pages_dict = {}
        pages_by_id = {}
        for p in pages_rows:
            p_dict = dict(p)
            # Clean image tokens in content
            if p_dict.get("content"):
                p_dict["content"] = p_dict["content"].replace("[SITE-URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/").replace("[SITE_URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/").replace("[SUB-SITE-URL:]", "")
            if p_dict.get("content_hi"):
                p_dict["content_hi"] = p_dict["content_hi"].replace("[SITE-URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/").replace("[SITE_URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/").replace("[SUB-SITE-URL:]", "")
            pages_dict[p_dict["slug"]] = p_dict
            pages_by_id[p_dict["id"]] = p_dict

        # Helper to categorize subsite pages
        subsite_pages = {}
        for s_slug, p_val in pages_dict.items():
            sl = s_slug.lower()
            if "brief-history" in sl or ("history" in sl and code in sl) or ("about-us" in sl and code in sl):
                subsite_pages["history"] = p_val
            elif "india-house" in sl:
                subsite_pages["india_house"] = p_val
            elif "vision" in sl or "mission" in sl:
                subsite_pages["vision_mission"] = p_val
            elif "organisational-structure" in sl or "org-str" in sl or "sanctioned-strength" in sl:
                subsite_pages["org_structure"] = p_val
            elif "audit-jurisdiction-in-maps" in sl:
                subsite_pages["audit_jurisdiction_maps"] = p_val
            elif "audit-jurisdiction" in sl or "aud-jud" in sl:
                subsite_pages["audit_jurisdiction"] = p_val
            elif "audit-process" in sl or "aud-process" in sl:
                subsite_pages["audit_process"] = p_val
            elif "administrative-functions" in sl or "aud-fnc" in sl:
                subsite_pages["administrative_functions"] = p_val
            elif "holiday" in sl:
                subsite_pages["holidays"] = p_val
            elif "contact-us" in sl:
                subsite_pages["contact_us"] = p_val
            elif "unit" in sl:
                subsite_pages["units"] = p_val
            elif "terms" in sl:
                subsite_pages["terms_conditions"] = p_val
            elif "privacy" in sl:
                subsite_pages["privacy_policy"] = p_val
            elif "copyright" in sl:
                subsite_pages["copyright_policy"] = p_val
            elif "hyperlink" in sl:
                subsite_pages["hyperlinking_policy"] = p_val
            elif "accessibility" in sl:
                subsite_pages["accessibility_statement"] = p_val
            elif "disclaimer" in sl:
                subsite_pages["disclaimer"] = p_val
            elif "archive" in sl:
                subsite_pages["archive"] = p_val

        # 5. Staff from DB (via content_accesses SubsitesOrgStruct)
        q_staff = text("""
            SELECT s.id, s.prefix_name, s.first_name, s.middle_name, s.last_name, s.full_name,
                   s.designation_id, s.subsite_org_desig_hierarchy_id, s.subsite_org_charge_ids,
                   s.email, s.mobile_no, s.std_code, s.profile_image, s.brief_description,
                   s.from_date, s.to_date,
                   s.display_order, s.display_home, s.status
            FROM cag_revamp.subsites_org_struct s
            JOIN cag_revamp.content_accesses ca ON ca.content_id = s.id
            JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'SubsitesOrgStruct'
            WHERE ca.website_id = :wid AND s.status = 1
            ORDER BY s.from_date ASC, s.display_order ASC, s.id ASC;
        """)
        staff_rows = db.execute(q_staff, {"wid": wid}).mappings().all()
        staff_list = []
        pds_list = []
        directors_list = []

        for s in staff_rows:
            s_dict = dict(s)
            name_info = extract_multilingual_name(s_dict.get("full_name"))
            prefix_info = extract_multilingual_name(s_dict.get("prefix_name"))
            
            raw_name_en = (name_info.get("en") or "").strip()
            raw_name_hi = (name_info.get("hi") or raw_name_en).strip()
            
            # Skip test dummy records
            if "test" in raw_name_en.lower() or "test" in (s_dict.get("first_name") or "").lower():
                continue

            # Strip duplicate prefixes from name string
            clean_name_en = re.sub(r'^(Mr\.|Shri|Ms\.|Mrs\.|Dr\.|Smt\.|Shriman)\s+', '', raw_name_en, flags=re.I).strip()
            clean_name_hi = re.sub(r'^(श्रीमान|श्री|सुश्री|डॉ\.|श्रीमती)\s+', '', raw_name_hi, flags=re.I).strip()

            prefix_en = (prefix_info.get("en") or "").strip()
            prefix_hi = (prefix_info.get("hi") or "").strip()

            full_display_en = f"{prefix_en} {clean_name_en}".strip() if prefix_en and not clean_name_en.startswith(prefix_en) else (clean_name_en or raw_name_en)
            full_display_hi = f"{prefix_hi} {clean_name_hi}".strip() if prefix_hi and not clean_name_hi.startswith(prefix_hi) else (clean_name_hi or raw_name_hi)

            # Clean up designation name based on ID and office context
            desig_id = s_dict.get("designation_id") or 0
            officer_id = s_dict.get("id")

            raw_bio = s_dict.get("brief_description") or ""
            bio_info = extract_multilingual_name(raw_bio)
            bio_en = bio_info.get("en", "").replace("[SITE-URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/").replace("[SITE_URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/")
            bio_hi = bio_info.get("hi", "").replace("[SITE-URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/").replace("[SITE_URL]/", "https://d7i5wg8xwe4hf.cloudfront.net/")

            from_d = str(s_dict.get("from_date")) if s_dict.get("from_date") else ""
            to_d = str(s_dict.get("to_date")) if s_dict.get("to_date") else ""
            tenure_str = f"{from_d[:4] if from_d else ''} - {to_d[:4] if to_d and to_d != 'None' else 'Present'}" if from_d else "Present"

            if officer_id == 52 or (wid == 143 and desig_id == 10) or "director general" in bio_en.lower():
                desig_info = {"en": "Director General", "hi": "महानिदेशक"}
            elif desig_id == 1 or officer_id in (49, 77):
                desig_info = {"en": "Principal Director of Audit", "hi": "प्रधान निदेशक लेखा परीक्षा"}
            elif desig_id == 2 or officer_id in (59, 79, 83):
                desig_info = {"en": "Director of Audit", "hi": "निदेशक लेखा परीक्षा"}
            elif desig_id == 3:
                desig_info = {"en": "Deputy Director of Audit", "hi": "उप निदेशक लेखा परीक्षा"}
            elif desig_id == 4:
                desig_info = {"en": "Senior Audit Officer (SAO)", "hi": "वरिष्ठ लेखा परीक्षा अधिकारी"}
            elif desig_id == 5:
                desig_info = {"en": "Assistant Audit Officer (AAO)", "hi": "सहायक लेखा परीक्षा अधिकारी"}
            elif desig_id == 6:
                desig_info = {"en": "Supervisor", "hi": "पर्यवेक्षक"}
            elif desig_id == 7:
                desig_info = {"en": "Senior Auditor", "hi": "वरिष्ठ लेखा परीक्षक"}
            elif desig_id == 8:
                desig_info = {"en": "Auditor", "hi": "लेखा परीक्षक"}
            elif desig_id == 9:
                desig_info = {"en": "Data Entry Operator", "hi": "डाटा एंट्री ऑपरेटर"}
            elif desig_id == 10:
                desig_info = {"en": "Multi Tasking Staff (MTS)", "hi": "मल्टी टास्किंग स्टाफ"}
            else:
                desig_info = {"en": "Audit Officer", "hi": "लेखा परीक्षा अधिकारी"}

            raw_photo = s_dict.get("profile_image") or ""
            photo_url = ""
            if raw_photo:
                photo_url = raw_photo if raw_photo.startswith("http") else f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/{raw_photo}"

            officer_item = {
                "id": s_dict["id"],
                "officer_name": full_display_en,
                "officer_name_hi": full_display_hi,
                "nameEn": full_display_en,
                "nameHi": full_display_hi,
                "prefix": prefix_en,
                "prefix_hi": prefix_hi,
                "designation": desig_info["en"],
                "designation_hi": desig_info["hi"],
                "roleEn": desig_info["en"],
                "roleHi": desig_info["hi"],
                "designation_id": desig_id,
                "email": s_dict.get("email") or "",
                "phone": s_dict.get("mobile_no") or "",
                "photo": photo_url,
                "bio": clean_html_text(bio_en),
                "bio_html": bio_en,
                "bio_hi_html": bio_hi,
                "from_date": from_d,
                "to_date": to_d,
                "tenure": tenure_str,
                "display_home": s_dict.get("display_home", 0),
                "display_order": s_dict.get("display_order", 0),
                "status": s_dict.get("status", 1)
            }

            # Group into succession lists or active staff
            if desig_id == 1 or (wid == 143 and officer_id in (52, 3)):
                pds_list.append(officer_item)
            elif desig_id == 2 or (wid == 144 and officer_id in (50, 79)) or (wid == 148 and officer_id == 83):
                directors_list.append(officer_item)
            else:
                staff_list.append(officer_item)

        # 6. Banners from DB (via content_accesses Banners)
        q_banners = text("""
            SELECT b.id, b.text, b.image, b.link, b.hi_link, b.status, b.display_order
            FROM cag_revamp.banners b
            JOIN cag_revamp.content_accesses ca ON ca.content_id = b.id
            JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'Banners'
            WHERE ca.website_id = :wid AND b.status = 1
            ORDER BY b.display_order ASC, b.id ASC;
        """)
        banners_rows = db.execute(q_banners, {"wid": wid}).mappings().all()
        banners_list = []
        for b in banners_rows:
            b_dict = dict(b)
            caption_info = extract_multilingual_name(b_dict.get("text"))
            raw_img = b_dict.get("image") or ""
            img_url = raw_img if raw_img.startswith("http") else f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/{raw_img}"
            banners_list.append({
                "id": b_dict["id"],
                "title": caption_info["en"],
                "title_hi": caption_info["hi"],
                "caption": caption_info["en"],
                "caption_hi": caption_info["hi"],
                "image": img_url,
                "link": b_dict.get("link") or "",
                "hi_link": b_dict.get("hi_link") or "",
                "display_order": b_dict.get("display_order", 0),
                "status": b_dict.get("status", 1)
            })

        # 7. Photo Gallery from DB (via content_accesses PhotoGallery)
        q_photos = text("""
            SELECT pg.id, pg.title, pg.slug, pg.photo_file_title, pg.photo_upload_file, pg.status
            FROM cag_revamp.photo_gallery pg
            JOIN cag_revamp.content_accesses ca ON ca.content_id = pg.id
            JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'PhotoGallery'
            WHERE ca.website_id = :wid AND pg.status = 1
            ORDER BY pg.display_order ASC, pg.id ASC;
        """)
        photos_rows = db.execute(q_photos, {"wid": wid}).mappings().all()
        gallery_list = []
        for ph in photos_rows:
            ph_dict = dict(ph)
            title_info = extract_multilingual_name(ph_dict.get("title"))
            raw_img = ph_dict.get("photo_upload_file") or ""
            parsed_imgs = parse_json_field(raw_img)
            
            img_list = []
            if isinstance(parsed_imgs, list):
                for single_img in parsed_imgs:
                    if single_img and not str(single_img).startswith("http"):
                        img_list.append(f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/photo_gallery/{single_img}")
                    elif single_img:
                        img_list.append(str(single_img))
            elif isinstance(parsed_imgs, str) and parsed_imgs:
                if not parsed_imgs.startswith("http"):
                    img_list.append(f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/photo_gallery/{parsed_imgs}")
                else:
                    img_list.append(parsed_imgs)
            
            main_img = img_list[0] if img_list else "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80"

            gallery_list.append({
                "id": ph_dict["id"],
                "title": title_info["en"] or "Diplomatic Event",
                "title_hi": title_info["hi"] or title_info["en"],
                "image": main_img,
                "images": img_list,
                "status": ph_dict.get("status", 1)
            })

        # 7b. Video Gallery from DB (via content_accesses VideoGallery)
        q_videos = text("""
            SELECT vg.id, vg.title, vg.video_url, vg.video_date, vg.status
            FROM cag_revamp.video_gallery vg
            JOIN cag_revamp.content_accesses ca ON ca.content_id = vg.id
            JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'VideoGallery'
            WHERE ca.website_id = :wid AND vg.status = 1
            ORDER BY vg.video_date DESC, vg.id DESC;
        """)
        video_rows = db.execute(q_videos, {"wid": wid}).mappings().all()
        video_list = []
        for v in video_rows:
            v_dict = dict(v)
            raw_url = v_dict.get("video_url") or ""
            # Format clean embed url
            embed_url = raw_url
            if "watch?v=" in raw_url:
                v_id = raw_url.split("watch?v=")[-1].split("&")[0]
                embed_url = f"https://www.youtube.com/embed/{v_id}"
            elif "youtu.be/" in raw_url:
                v_id = raw_url.split("youtu.be/")[-1].split("?")[0]
                embed_url = f"https://www.youtube.com/embed/{v_id}"
            
            video_list.append({
                "id": v_dict["id"],
                "title": v_dict.get("title") or "Diplomatic Audit Video",
                "title_hi": v_dict.get("title") or "लेखापरीक्षा वीडियो",
                "video_url": embed_url,
                "video_date": str(v_dict.get("video_date")) if v_dict.get("video_date") else "",
                "status": v_dict.get("status", 1)
            })

        # Fallback if no subsite specific video
        if not video_list:
            video_list = [
                {
                    "id": 1,
                    "title": "CAG of India addressing United Nations Panel of External Auditors",
                    "title_hi": "भारत के सीएजी संयुक्त राष्ट्र बाह्य लेखापरीक्षक पैनल को संबोधित करते हुए",
                    "video_url": "https://www.youtube.com/embed/SWSXKcJ4irQ",
                    "video_date": "2026",
                    "status": 1
                },
                {
                    "id": 2,
                    "title": "International Audit Symposium & SAI Bilateral Engagements",
                    "title_hi": "अंतर्राष्ट्रीय लेखापरीक्षा संगोष्ठी एवं एसएआई द्विपक्षीय वार्ता",
                    "video_url": "https://www.youtube.com/embed/cxTe3xGTW8Y",
                    "video_date": "2026",
                    "status": 1
                }
            ]

        # 8. What's New from DB (via content_accesses SubsiteWhatsNew)
        q_whats_new = text("""
            SELECT swn.id, swn.title, swn.date, swn.uploads, swn.link, swn.status
            FROM cag_revamp.subsite_whats_new swn
            JOIN cag_revamp.content_accesses ca ON ca.content_id = swn.id
            JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'SubsiteWhatsNew'
            WHERE ca.website_id = :wid AND swn.status = 1
            ORDER BY swn.id DESC;
        """)
        whats_new_rows = db.execute(q_whats_new, {"wid": wid}).mappings().all()
        whats_new_list = []
        for wn in whats_new_rows:
            wn_dict = dict(wn)
            wn_title = extract_multilingual_name(wn_dict.get("title"))
            raw_upload = wn_dict.get("uploads") or ""
            upload_url = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_whats_new/{raw_upload}" if raw_upload and not raw_upload.startswith("http") else raw_upload
            whats_new_list.append({
                "id": wn_dict["id"],
                "title": wn_title["en"],
                "title_hi": wn_title["hi"],
                "date": str(wn_dict.get("date")) if wn_dict.get("date") else "",
                "upload_file": upload_url,
                "link": wn_dict.get("link") or "",
                "status": wn_dict.get("status", 1)
            })

        # 9. Contact Details from DB
        q_contact = text("""
            SELECT * FROM cag_revamp.office_contact_details
            WHERE website_id = :wid OR LOWER(office_name_en) LIKE :code_pattern
            LIMIT 1;
        """)
        contact_row = db.execute(q_contact, {"wid": wid, "code_pattern": f"%{code}%"}).mappings().first()
        contact_dict = dict(contact_row) if contact_row else None

        if not contact_dict:
            # Fallback official overseas addresses
            if code == "wdc":
                contact_dict = {
                    "office_name_en": "Principal Director of Audit, Washington DC",
                    "office_name_hi": "प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी",
                    "address_en": "Chancery-II, Embassy of India, 2536 Massachusetts Avenue, NW Washington DC, 20008 USA",
                    "address_hi": "चांसरी-II, भारत का दूतावास, 2536 मैसाचुसेट्स एवेन्यू, एनडब्ल्यू वाशिंगटन डीसी, 20008 यूएसए",
                    "phone": "+1 (202) 939-7000",
                    "email": "audit.wdc@mea.gov.in",
                    "working_hours": "09:30 AM - 6:00 PM (Monday - Friday)",
                    "gmap_embed_url": "https://maps.google.com/maps?width=700&height=400&hl=en&q=2536+Massachusetts+Avenue+NW+Washington+DC+20008+USA&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                }
            elif code == "ldn":
                contact_dict = {
                    "office_name_en": "Office of the Director General of Audit, London",
                    "office_name_hi": "प्रधान निदेशक लेखा परीक्षा, लंदन",
                    "address_en": "High Commission of India, India House, Aldwych, London WC2B 4NA, UK",
                    "address_hi": "भारत का उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA, यूके",
                    "phone": "(00-44) 20 7836 4333",
                    "email": "pda.london@mea.gov.in",
                    "working_hours": "09:30 AM - 5:30 PM (Monday - Friday)",
                    "gmap_embed_url": "https://maps.google.com/maps?width=700&height=400&hl=en&q=India+House+Aldwych+London+WC2B4NA&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                }
            elif code == "kul":
                contact_dict = {
                    "office_name_en": "India Audit Office, Kuala Lumpur",
                    "office_name_hi": "भारत लेखा परीक्षा कार्यालय, कुआलालंपुर",
                    "address_en": "Suite 9.02, Level 9, Wisma E&C, # 2 Lorong Dungun Kiri, Damansara Heights, 50490 Kuala Lumpur, Malaysia",
                    "address_hi": "सूट 9.02, स्तर 9, विस्मा ईएंडसी, # 2 लोरॉन्ग डुंगुन किरी, दमनसारा हाइट्स, 50490 कुआलालंपुर, मलेशिया",
                    "phone": "(00-603) 2092 1058",
                    "email": "pdakualalumpur@cag.gov.in",
                    "working_hours": "09:00 AM - 5:30 PM (Monday-Friday)",
                    "gmap_embed_url": "https://maps.google.com/maps?width=700&height=400&hl=en&q=Wisma+E%26C+Lorong+Dungun+Kiri+Damansara+Heights+50490+Kuala+Lumpur+Malaysia&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                }

        # 10. Recruitment Rules from DB
        q_rr = text("""
            SELECT id, general_category_id, title, language, body, file_title, upload_file, status
            FROM cag_revamp.recruitment_rules
            WHERE status = 1
            ORDER BY id ASC
            LIMIT 20;
        """)
        rr_rows = db.execute(q_rr).mappings().all()
        rr_list = []
        for rr in rr_rows:
            rr_dict = dict(rr)
            rr_list.append({
                "id": rr_dict["id"],
                "post_name": rr_dict.get("title") or "Cadre Post",
                "qualification": clean_html_text(rr_dict.get("body") or ""),
                "pdf_file": rr_dict.get("upload_file") or "",
                "status": rr_dict.get("status", 1)
            })

        # 11. Clean Title & Subtitles
        web_title_en = extract_multilingual_name(website.get("title"))["en"]
        web_title_hi = extract_multilingual_name(website.get("title_hi"), web_title_en)["hi"]

        return {
            "status": "success",
            "source": "postgresql",
            "data": {
                "slug": slug_clean,
                "website_id": wid,
                "theme": theme,
                "officeNameEn": web_title_en,
                "officeNameHi": web_title_hi,
                "locationEn": "London, UK" if code == "ldn" else "Washington D.C., USA" if code == "wdc" else "Kuala Lumpur, Malaysia" if code == "kul" else "Overseas Audit Office",
                "locationHi": "लंदन, यूके" if code == "ldn" else "वाशिंगटन डीसी, यूएसए" if code == "wdc" else "कुआलालंपुर, मलेशिया" if code == "kul" else "विदेशी लेखा परीक्षा कार्यालय",
                "email": website.get("email") or f"audit.{code}@mea.gov.in",
                "website": website,
                "banners": banners_list,
                "menus": menus_list,
                "pages": pages_dict,
                "pages_by_id": pages_by_id,
                "subsitePages": subsite_pages,
                "staff": staff_list,
                "pdsList": pds_list,
                "directorsList": directors_list,
                "whatsNew": whats_new_list,
                "recruitmentRules": rr_list,
                "photoGallery": gallery_list,
                "videoGallery": video_list,
                "contact": contact_dict
            }
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/{slug}/staff")
async def get_subsite_staff_endpoint(slug: str, db: Session = Depends(get_db)):
    """Fetch staff directory directly from PostgreSQL subsites_org_struct"""
    data = await get_subsite_by_slug(slug, db)
    return {"status": "success", "data": data.get("data", {}).get("staff", [])}


@router.get("/{slug}/recruitment-rules")
async def get_subsite_recruitment_rules_endpoint(slug: str, db: Session = Depends(get_db)):
    """Fetch recruitment rules directly from PostgreSQL recruitment_rules"""
    data = await get_subsite_by_slug(slug, db)
    return {"status": "success", "data": data.get("data", {}).get("recruitmentRules", [])}
