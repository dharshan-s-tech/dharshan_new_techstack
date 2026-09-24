import os
import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')
sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')

from app.core.database import engine
from sqlalchemy import text

def deep_inspect():
    with engine.connect() as conn:
        print("=== 1. SEARCHING FOR ALL PAGES RELATED TO VISION, MISSION, VALUES ===")
        res = conn.execute(text("""
            SELECT p.id, p.slug, p.title, 
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            WHERE p.slug ILIKE '%vision%' OR p.slug ILIKE '%mission%' OR p.title ILIKE '%vision%'
            GROUP BY p.id, p.slug, p.title, p.content
            ORDER BY GREATEST(LENGTH(COALESCE(p.content, '')), MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END)) DESC
        """)).mappings().fetchall()
        for r in res:
            print(f"  ID {r['id']:<5} | p_len: {r['p_len']:<5} | en_len: {r['en_len']:<5} | hi_len: {r['hi_len']:<5} | slug: {r['slug']:<40} | title: {r['title']}")

        print("\n=== 2. SEARCHING FOR ALL PAGES RELATED TO CONSTITUTIONAL PROVISIONS ===")
        res = conn.execute(text("""
            SELECT p.id, p.slug, p.title, 
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len,
                   p.upload_file
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            WHERE p.slug ILIKE '%constitution%' OR p.title ILIKE '%constitution%'
            GROUP BY p.id, p.slug, p.title, p.content, p.upload_file
            ORDER BY p.id ASC
        """)).mappings().fetchall()
        for r in res:
            print(f"  ID {r['id']:<5} | p_len: {r['p_len']:<5} | en_len: {r['en_len']:<5} | hi_len: {r['hi_len']:<5} | file: {r['upload_file']} | slug: {r['slug']:<40} | title: {r['title']}")

        print("\n=== 3. SEARCHING FOR ALL PAGES RELATED TO DPC ACT & AUDIT REGULATIONS ===")
        res = conn.execute(text("""
            SELECT p.id, p.slug, p.title, 
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len,
                   p.upload_file
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            WHERE p.slug ILIKE '%duties%' OR p.slug ILIKE '%regulation%' OR p.title ILIKE '%duties%' OR p.title ILIKE '%regulation%'
            GROUP BY p.id, p.slug, p.title, p.content, p.upload_file
            ORDER BY GREATEST(LENGTH(COALESCE(p.content, '')), MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END)) DESC
        """)).mappings().fetchall()
        for r in res:
            print(f"  ID {r['id']:<5} | p_len: {r['p_len']:<6} | en_len: {r['en_len']:<6} | hi_len: {r['hi_len']:<6} | file: {r['upload_file']} | slug: {r['slug']:<40} | title: {r['title']}")

        print("\n=== 4. SEARCHING FOR OVERVIEW & ACCOUNTS PAGES ===")
        res = conn.execute(text("""
            SELECT p.id, p.slug, p.title, 
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            WHERE p.slug ILIKE '%overview%' OR p.slug ILIKE '%account%' OR p.title ILIKE '%overview%' OR p.title ILIKE '%accounts%'
            GROUP BY p.id, p.slug, p.title, p.content
            ORDER BY p.id ASC
        """)).mappings().fetchall()
        for r in res:
            print(f"  ID {r['id']:<5} | p_len: {r['p_len']:<6} | en_len: {r['en_len']:<6} | hi_len: {r['hi_len']:<6} | slug: {r['slug']:<40} | title: {r['title']}")

        print("\n=== 5. CHECKING OTHER TABLES IN cag_revamp SCHEMA ===")
        tables = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'cag_revamp'
            ORDER BY table_name ASC
        """)).fetchall()
        print(f"Tables in cag_revamp: {[t[0] for t in tables]}")

if __name__ == '__main__':
    deep_inspect()
