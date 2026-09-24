import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')
sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')

from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    print("=== INSPECTING VISION & MISSION IDs ===")
    for pid in [10, 576, 486, 487, 490]:
        row = conn.execute(text(f"""
            SELECT p.id, p.slug, p.title, p.content, pt.content as hi_content, pt.title as hi_title
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'hi'
            WHERE p.id = {pid}
        """)).mappings().fetchone()
        if row:
            print(f"ID {row['id']} | Title: {row['title']} | Content: {str(row['content'])[:200]}...")

    print("\n=== INSPECTING CONSTITUTIONAL PROVISIONS IDs ===")
    for pid in [2, 5102, 7334, 9575, 5160, 3180]:
        row = conn.execute(text(f"""
            SELECT p.id, p.slug, p.title, p.content, pt.content as hi_content, pt.title as hi_title
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'hi'
            WHERE p.id = {pid}
        """)).mappings().fetchone()
        if row:
            print(f"ID {row['id']} | Title: {row['title']} | Content: {str(row['content'])[:200]}...")

    print("\n=== INSPECTING OVERVIEW IDs ===")
    for pid in [1, 7166, 3063]:
        row = conn.execute(text(f"""
            SELECT p.id, p.slug, p.title, p.content, pt.content as hi_content, pt.title as hi_title
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'hi'
            WHERE p.id = {pid}
        """)).mappings().fetchone()
        if row:
            print(f"ID {row['id']} | Title: {row['title']} | Content: {str(row['content'])[:200]}...")
