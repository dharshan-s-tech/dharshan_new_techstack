import os
import glob
import re
import requests
import sys
from dotenv import load_dotenv

# Load env before importing app modules
load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')

sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')
from app.core.database import engine
from sqlalchemy import text

def analyze():
    app_dir = r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app'
    page_files = glob.glob(os.path.join(app_dir, '**', 'page.tsx'), recursive=True)

    print(f"=== ANALYZING {len(page_files)} Next.js PAGES ===")
    
    # Check DB connection
    with engine.connect() as conn:
        db_pages = conn.execute(text("""
            SELECT p.id, p.slug, p.title, p.status,
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            GROUP BY p.id, p.slug, p.title, p.status, p.content
        """)).mappings().fetchall()
        
    print(f"Loaded {len(db_pages)} DB pages from PostgreSQL database.\n")

    # Check each page.tsx
    for pf in sorted(page_files):
        rel = os.path.relpath(pf, app_dir)
        with open(pf, 'r', encoding='utf-8', errors='ignore') as f:
            code = f.read()
        
        # Look for API endpoints, pages/get_page_by_slug, etc.
        urls = re.findall(r'[\'"`](/api/v1/[^\'"`]+)[\'"`]', code)
        slug_matches = re.findall(r'page-[a-zA-Z0-9\-]+', code)
        
        # Test if it fetches from backend or hardcodes
        print(f"Page: {rel}")
        if urls:
            print(f"   API Endpoints: {list(set(urls))}")
        if slug_matches:
            print(f"   Slugs: {list(set(slug_matches))}")
        if not urls and not slug_matches:
            print(f"   (No direct /api/v1 call or slug found in page file)")

if __name__ == '__main__':
    analyze()
