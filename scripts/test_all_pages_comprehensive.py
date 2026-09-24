import os
import glob
import re
import requests
import json
from dotenv import load_dotenv

load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')

import sys
sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')
from app.core.database import engine
from sqlalchemy import text

def run_comprehensive_audit():
    print("=================================================================")
    print("      COMPREHENSIVE CAG WEBSITE ALL-PAGES DATA AUDIT            ")
    print("=================================================================\n")

    # 1. Test all CMS slugs in DB
    cms_slugs_to_test = [
        "page-cag-of-india",
        "page-our-vision-mission-values",
        "page-history-of-indian-audit-and-accounts-department",
        "page-audit-advisory-board",
        "page-constitutional-provisions",
        "page-duties-power-and-conditions-of-services-act",
        "page-cag-audit-regulations",
        "page-international-relations",
        "page-involvement-with-intosai",
        "page-involvement-with-asosai",
        "page-global-audit-leadership-forum-and-other-multilateral-bodies",
        "page-bilateral-relations-of-sai-india",
        "page-international-audit-assignments",
        "page-cag-s-auditing-standards-2017",
        "page-citizen-s-charter",
        "page-overview",
        "page-accounts"
    ]

    backend_url = "http://127.0.0.1:8000"
    
    print("--- 1. TESTING BACKEND /api/v1/pages/get_page_by_slug ENDPOINT ---")
    for slug in cms_slugs_to_test:
        for culture in ["en", "hi"]:
            try:
                r = requests.get(f"{backend_url}/api/v1/pages/get_page_by_slug?slug={slug}&culture={culture}", timeout=3)
                if r.status_code == 200:
                    data = r.json()
                    content = data.get("content") or ""
                    title = data.get("title") or ""
                    print(f"[{r.status_code}] Slug: {slug:<45} | Lang: {culture} | Title: {title[:30]:<30} | Content Len: {len(content)}")
                else:
                    print(f"[{r.status_code} ERROR] Slug: {slug:<45} | Lang: {culture} -> {r.text[:60]}")
            except Exception as e:
                print(f"[FAIL] Slug: {slug:<45} | Lang: {culture} -> {e}")

    print("\n--- 2. CHECKING DATABASE FOR ALL PAGES IN cag_revamp.pages ---")
    with engine.connect() as conn:
        all_pages = conn.execute(text("""
            SELECT p.id, p.slug, p.title, p.status,
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            GROUP BY p.id, p.slug, p.title, p.status, p.content
            ORDER BY p.id ASC
        """)).mappings().fetchall()

        print(f"Total pages in DB: {len(all_pages)}")
        # Group by slug patterns
        main_pages = [p for p in all_pages if not p['slug'].startswith('page-rti-') and not p['slug'].startswith('page-subsite-')]
        subsite_pages = [p for p in all_pages if p['slug'].startswith('page-rti-') or p['slug'].startswith('page-subsite-')]
        
        print(f"\nMain Portal Pages in DB ({len(main_pages)}):")
        for p in main_pages:
            print(f"  ID: {p['id']:<4} | Slug: {p['slug']:<48} | Base Len: {p['p_len']:<6} | EN Len: {p['en_len']:<6} | HI Len: {p['hi_len']:<6} | Title: {p['title'][:40]}")

    print("\n--- 3. CHECKING ALL FRONTEND PAGE ROUTES & THEIR DATA SOURCES ---")
    app_dir = r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app'
    for root, dirs, files in os.walk(app_dir):
        for f in files:
            if f == 'page.tsx':
                full_p = os.path.join(root, f)
                rel_p = os.path.relpath(full_p, app_dir)
                with open(full_p, 'r', encoding='utf-8', errors='ignore') as pf:
                    c = pf.read()
                
                # Check how data is fetched
                endpoints = re.findall(r'(/api/v1/[a-zA-Z0-9_\-\/]+)', c)
                uses_hardcoded_arrays = ('const data =' in c or 'const items =' in c or 'const mock' in c or 'const cards =' in c)
                
                # Print summary if page is relevant
                print(f"Page: {rel_p}")
                if endpoints:
                    print(f"  -> Endpoints: {list(set(endpoints))}")
                if uses_hardcoded_arrays:
                    print(f"  -> Note: Contains local state / hardcoded arrays")

if __name__ == '__main__':
    run_comprehensive_audit()
