import os
import sys
from dotenv import load_dotenv

# Set UTF-8 encoding for stdout on Windows
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')
sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')

from app.core.database import SessionLocal, engine
from app.services.pages_service import PagesService
from app.services.about_service import AboutAdminService
from app.services.former_cag_service import FormerCagService
from app.services.organisation_chart_service import OrganisationChartService
from app.services.reports_service import ReportsService
from app.services.resources_service import ResourcesService
from app.services.presence_service import PresenceService
from sqlalchemy import text

def test_all():
    db = SessionLocal()
    print("=================================================================")
    print("     TESTING ALL BACKEND SERVICES & DB DATA RESOLUTION          ")
    print("=================================================================\n")

    # 1. Test All Core CMS Pages
    print("=== 1. Core CMS Pages via PagesService ===")
    test_slugs = [
        ("page-cag-of-india", "CAG of India"),
        ("page-our-vision-mission-values", "Vision, Mission & Core Values"),
        ("page-history-of-indian-audit-and-accounts-department", "History of IAAD"),
        ("page-audit-advisory-board", "Audit Advisory Board"),
        ("page-constitutional-provisions", "Constitutional Provisions"),
        ("page-duties-power-and-conditions-of-services-act", "DPC Act"),
        ("page-cag-audit-regulations", "Audit Regulations"),
        ("page-cag-s-auditing-standards-2017", "Auditing Standards"),
        ("page-citizen-s-charter", "Citizen's Charter"),
        ("page-overview", "Overview"),
        ("page-international-relations", "International Relations"),
        ("page-involvement-with-intosai", "Involvement with INTOSAI"),
        ("page-involvement-with-asosai", "Involvement with ASOSAI"),
        ("page-global-audit-leadership-forum-and-other-multilateral-bodies", "GALF / Multilateral Bodies"),
        ("page-bilateral-relations-of-sai-india", "Bilateral Relations"),
        ("page-international-audit-assignments", "International Audit Assignments"),
        ("page-accounts", "Accounts / Overview"),
    ]

    for slug, label in test_slugs:
        for cult in ["en", "hi"]:
            res = PagesService.get_page_by_slug_or_id(slug, culture=cult, db=db)
            if res:
                content_len = len(res.get("content") or "")
                title = res.get("title") or ""
                file_url = res.get("upload_file_url") or ""
                print(f"[{cult.upper()}] {label:<32} (slug: {slug:<45}) -> Title: '{title[:25]}', ContentLen: {content_len}, File: {bool(file_url)}")
            else:
                print(f"[{cult.upper()} FAIL] {label:<32} (slug: {slug}) -> NOT FOUND (404)")

    # 2. Test About Admin Service Records
    print("\n=== 2. About Admin Records via AboutAdminService ===")
    try:
        about_data = AboutAdminService.get_all_about_records(db=db, page=1, page_size=50)
        records = about_data.get("records", [])
        print(f"Total About Admin records returned: {len(records)} (Total count: {about_data.get('total', 0)})")
        for rec in records[:15]:
            print(f"  ID: {rec.get('id')} | Category: {rec.get('category')} | Subtopic: {rec.get('subtopic')} | Title EN: {rec.get('title_en')[:30]} | ContentLen: {len(rec.get('content_en') or '')}")
    except Exception as e:
        print(f"AboutAdminService error: {e}")

    # 3. Test Former CAG Service
    print("\n=== 3. Former CAGs via FormerCagService ===")
    try:
        former_cags = FormerCagService.get_all_former_cags(db=db)
        print(f"Former CAGs count: {len(former_cags)}")
        for fc in former_cags[:5]:
            print(f"  ID: {fc.get('id')} | Name: {fc.get('name_en')} | Term: {fc.get('tenure_en')} | Photo: {bool(fc.get('photo_url'))}")
    except Exception as e:
        print(f"FormerCagService error: {e}")

    # 4. Test Organisation Chart Service
    print("\n=== 4. Organisation Chart via OrganisationChartService ===")
    try:
        org_data = OrganisationChartService.get_chart_data(db=db, culture="en")
        print(f"Org chart hierarchy keys: {list(org_data.keys()) if isinstance(org_data, dict) else len(org_data)}")
    except Exception as e:
        print(f"OrganisationChartService error: {e}")

    # 5. Test Reports Service
    print("\n=== 5. Reports Service ===")
    try:
        reports = ReportsService.get_reports(db=db, limit=5)
        print(f"Reports returned: {len(reports.get('items', []) if isinstance(reports, dict) else reports)}")
    except Exception as e:
        print(f"ReportsService error: {e}")

    # 6. Test Resources Service
    print("\n=== 6. Resources Service ===")
    try:
        resources = ResourcesService.get_all_resources(db=db, limit=5)
        print(f"Resources returned: {len(resources.get('items', []) if isinstance(resources, dict) else resources)}")
    except Exception as e:
        print(f"ResourcesService error: {e}")

    # 7. Test Presence Service
    print("\n=== 7. Presence Service ===")
    try:
        presence = PresenceService.get_all_offices(db=db)
        print(f"Presence offices count: {len(presence.get('items', []) if isinstance(presence, dict) else presence)}")
    except Exception as e:
        print(f"PresenceService error: {e}")

    db.close()

if __name__ == '__main__':
    test_all()
