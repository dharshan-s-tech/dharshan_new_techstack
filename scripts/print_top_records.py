import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')
sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')

from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    topics = [
        ('CAG Profile', ['%cag-of-india%', '%profile%', '%sanjay%']),
        ('Vision & Mission', ['%vision%', '%mission%', '%value%']),
        ('History of IAAD', ['%history%']),
        ('Audit Advisory Board', ['%advisory%']),
        ('Constitutional Provisions', ['%constitution%']),
        ('DPC Act', ['%duties%', '%powers%']),
        ('Audit Regulations', ['%regulation%']),
    ]
    for title, patterns in topics:
        print(f"\n=== {title} ===")
        where_clauses = ' OR '.join([f"p.slug ILIKE '{pat}' OR p.title ILIKE '{pat}'" for pat in patterns])
        query = f"""
            SELECT p.id, p.slug, p.title, 
                   LENGTH(COALESCE(p.content, '')) as p_len,
                   MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as en_len,
                   MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END) as hi_len,
                   COALESCE(NULLIF(p.upload_file, ''), '') as upload_file
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id
            WHERE ({where_clauses})
            AND (p.status = 1 OR p.status IS NULL)
            GROUP BY p.id, p.slug, p.title, p.content, p.upload_file
            ORDER BY GREATEST(
                LENGTH(COALESCE(p.content, '')), 
                MAX(CASE WHEN pt.culture = 'en' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END),
                MAX(CASE WHEN pt.culture = 'hi' THEN LENGTH(COALESCE(pt.content, '')) ELSE 0 END)
            ) DESC
            LIMIT 5
        """
        for r in conn.execute(text(query)).mappings():
            print(f"  ID: {r['id']:<5} | P_len: {r['p_len']:<6} | EN_len: {r['en_len']:<6} | HI_len: {r['hi_len']:<6} | File: {r['upload_file']:<20} | Slug: {r['slug']:<45} | Title: {r['title']}")
