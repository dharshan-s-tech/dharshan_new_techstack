import logging
import json
import re
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import engine

logger = logging.getLogger("uvicorn")


def parse_json_lang(val: Any, lang: str = "en") -> str:
    if not val:
        return ""
    if isinstance(val, dict):
        return val.get("hi" if lang == "hi" else "default") or val.get("en") or val.get("default") or ""
    if isinstance(val, str):
        s = val.strip()
        if s.startswith("{"):
            try:
                j = json.loads(s)
                return j.get("hi" if lang == "hi" else "default") or j.get("en") or j.get("default") or ""
            except Exception:
                pass
        return s
    return str(val)


def clean_html(raw_html: str) -> str:
    if not raw_html:
        return ""
    clean = re.sub(r"<[^>]+>", "\n", raw_html)
    clean = re.sub(r"&nbsp;", " ", clean)
    clean = re.sub(r"&amp;", "&", clean)
    clean = re.sub(r"\n+", "\n", clean).strip()
    return clean


class OrganisationChartService:
    @staticmethod
    def get_organisation_chart(culture: str = "en", db: Optional[Session] = None) -> Dict[str, Any]:
        is_hi = culture == "hi"

        # 1. Attempt PostgreSQL Query from cag_revamp
        if db and engine.dialect.name == "postgresql":
            try:
                # A. Fetch charge masters dictionary
                q_charges = text("SELECT id, title FROM cag_revamp.org_charge_master;")
                ch_rows = db.execute(q_charges).mappings().fetchall()
                charges_dict = {r["id"]: r["title"] for r in ch_rows}

                # B. Fetch reporting offices dictionary
                q_reporting = text("SELECT id, title FROM cag_revamp.org_reporting_to;")
                rep_rows = db.execute(q_reporting).mappings().fetchall()
                reporting_dict = {r["id"]: r["title"] for r in rep_rows}

                # C. Query all organisation chart officers
                query = text("""
                    SELECT 
                        oc.id,
                        oc.designation_hierarchy_id,
                        oc.full_name,
                        oc.prefix_name,
                        oc.designation_display_name,
                        oc.department,
                        oc.org_charge_master_id,
                        oc.dept_description,
                        oc.email,
                        oc.mobile_no,
                        oc.std_code,
                        oc.profile_image,
                        oc.display_order,
                        oc.brief_description,
                        oc.status,
                        oc.retired,
                        dh.title AS dh_title,
                        dh.level AS dh_level
                    FROM cag_revamp.organisation_chart oc
                    LEFT JOIN cag_revamp.designation_hierarchy dh ON dh.id = oc.designation_hierarchy_id
                    WHERE oc.status = 1
                      AND oc.id <= 165
                    ORDER BY 
                        CASE WHEN oc.id = 1 THEN 0
                             WHEN oc.id = 2 THEN 1
                             ELSE 2 END ASC,
                        oc.retired ASC,
                        COALESCE(dh.level, 2) ASC,
                        oc.display_order ASC,
                        oc.id ASC;
                """)
                rows = db.execute(query).mappings().fetchall()

                if rows:
                    officers: List[Dict[str, Any]] = []
                    for r in rows:
                        name_en = parse_json_lang(r["full_name"], "en")
                        name_hi = parse_json_lang(r["full_name"], "hi") or name_en

                        desig_raw = r["designation_display_name"] or r["dh_title"] or ""
                        desig_en = parse_json_lang(desig_raw, "en") or "Deputy Comptroller & Auditor General"
                        desig_hi = parse_json_lang(desig_raw, "hi") or "उप नियंत्रक एवं महालेखापरीक्षक"
                        desig_en = desig_en.replace("&amp;", "&").replace("&amp", "&")
                        desig_hi = desig_hi.replace("&amp;", "&").replace("&amp", "&")

                        # Charge resolution
                        charge_titles_en = []
                        charge_titles_hi = []
                        ch_ids = []
                        raw_ch = r.get("org_charge_master_id")
                        if raw_ch:
                            try:
                                if isinstance(raw_ch, str) and raw_ch.startswith("["):
                                    ch_ids = json.loads(raw_ch)
                                elif isinstance(raw_ch, (int, str)):
                                    ch_ids = [raw_ch]
                            except Exception:
                                pass

                        for cid in ch_ids:
                            try:
                                cid_int = int(cid)
                                if cid_int in charges_dict:
                                    ct_en = parse_json_lang(charges_dict[cid_int], "en")
                                    ct_hi = parse_json_lang(charges_dict[cid_int], "hi") or ct_en
                                    if ct_en:
                                        charge_titles_en.append(ct_en.strip("() "))
                                    if ct_hi:
                                        charge_titles_hi.append(ct_hi.strip("() "))
                            except Exception:
                                pass

                        charge_en = ", ".join(charge_titles_en) if charge_titles_en else parse_json_lang(r["department"], "en")
                        charge_hi = ", ".join(charge_titles_hi) if charge_titles_hi else (parse_json_lang(r["department"], "hi") or charge_en)

                        # Reporting offices resolution
                        rep_list_en = []
                        rep_list_hi = []
                        if r.get("dept_description"):
                            rep_ids = [s.strip() for s in str(r["dept_description"]).split(",") if s.strip()]
                            for rid in rep_ids:
                                try:
                                    rid_int = int(rid)
                                    if rid_int in reporting_dict:
                                        rt_en = clean_html(parse_json_lang(reporting_dict[rid_int], "en"))
                                        rt_hi = clean_html(parse_json_lang(reporting_dict[rid_int], "hi")) or rt_en
                                        if rt_en:
                                            rep_list_en.append(rt_en)
                                        if rt_hi:
                                            rep_list_hi.append(rt_hi)
                                except Exception:
                                    pass

                        brief_en = clean_html(parse_json_lang(r["brief_description"], "en"))
                        brief_hi = clean_html(parse_json_lang(r["brief_description"], "hi")) or brief_en

                        reporting_en = "\n".join(rep_list_en) if rep_list_en else brief_en
                        reporting_hi = "\n".join(rep_list_hi) if rep_list_hi else brief_hi

                        phone = f"{r['std_code'] or ''}-{r['mobile_no'] or ''}".strip("- ")

                        img = r.get("profile_image") or ""
                        if img and not img.startswith(("http://", "https://", "/")):
                            img = f"https://cag.gov.in/uploads/cag_emp_profile_pic/{img}"

                        level = r["dh_level"] if r["dh_level"] is not None else 2
                        if r["id"] == 1:
                            level = 0
                            if not phone:
                                phone = "011-23235790"
                            if not r.get("email"):
                                email = "cagindia@cag.gov.in"
                            else:
                                email = r["email"]
                            if not reporting_en:
                                reporting_en = "All departments, state audit offices, and central audit divisions within the Indian Audit and Accounts Department."
                                reporting_hi = "भारतीय लेखापरीक्षा और लेखा विभाग के भीतर सभी विभाग, राज्य लेखापरीक्षा कार्यालय और केंद्रीय लेखापरीक्षा प्रभाग।"
                        elif r["id"] == 2:
                            level = 1
                            email = r["email"] or "sec-cag@cag.gov.in"
                            if not reporting_en:
                                reporting_en = "Administrative secretariat, public relations, executive coordination, and direct support to the CAG."
                                reporting_hi = "प्रशासनिक सचिवालय, जनसंपर्क, समन्वय और सीएजी को प्रत्यक्ष सहायता।"
                        else:
                            email = r.get("email") or ""

                        officers.append({
                            "id": str(r["id"]),
                            "name": name_hi if is_hi else name_en,
                            "name_en": name_en,
                            "name_hi": name_hi,
                            "designation": desig_hi if is_hi else desig_en,
                            "designation_en": desig_en,
                            "designation_hi": desig_hi,
                            "charge": charge_hi if is_hi else charge_en,
                            "charge_en": charge_en,
                            "charge_hi": charge_hi,
                            "email": email,
                            "phone": phone,
                            "profile_image": img or "/assets/user-avatar-circle.png",
                            "level": level,
                            "reporting": reporting_hi if is_hi else reporting_en,
                            "reporting_en": reporting_en,
                            "reporting_hi": reporting_hi,
                            "display_order": r.get("display_order") or 0,
                            "retired": r.get("retired") or 0,
                            "status": r.get("status") or 1,
                        })

                    return {
                        "officers": officers,
                        "total": len(officers),
                        "disclaimer": "The organisation chart depicts senior executive portfolios in the Comptroller and Auditor General of India."
                    }
            except Exception as e:
                logger.warning(f"[OrganisationChartService] DB query failed ({e}). Falling back to static data.")

        return {
            "officers": [],
            "total": 0,
            "disclaimer": "The organisation chart depicts senior executive portfolios in the Comptroller and Auditor General of India."
        }
