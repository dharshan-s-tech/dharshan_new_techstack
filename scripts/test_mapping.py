import sys
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\.env')
sys.path.append(r'c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end')

from app.core.database import engine
from sqlalchemy import text

mapping = {
    'cag-profile': (1014, 6306, 17, 632),
    'vision-mission': (486, 487, 490, 576, 10),
    'history-iaad': (41, 7569, 2714),
    'advisory-board': (40, 7351, 5794),
    'constitutional-provisions': (2, 5102, 7334),
    'dpc-act': (2608, 1277, 5433, 3),
    'audit-regulations': (6315, 4537, 6688, 6685),
    'auditing-standards': (11, 8770),
    'citizen-charter': (16, 3983),
    'international-relations': (4,),
    'intosai': (6,),
    'asosai': (7,),
    'galf': (8,),
    'bilateral': (5,),
    'international-audits': (9, 6678, 257),
    'accounts': (6277, 822, 730),
    'overview': (1, 7166, 3063),
}

with engine.connect() as conn:
    for topic, ids in mapping.items():
        id_str = ','.join(str(i) for i in ids)
        query = f"""
            SELECT p.id, p.slug, p.title,
                   COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), '') as content_en,
                   COALESCE(NULLIF(pth.content, ''), NULLIF(p.content, ''), '') as content_hi
            FROM cag_revamp.pages p
            LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = 'en'
            LEFT JOIN cag_revamp.page_translations pth ON pth.page_id = p.id AND pth.culture = 'hi'
            WHERE p.id IN ({id_str})
            ORDER BY LENGTH(COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), '')) DESC
            LIMIT 1;
        """
        row = conn.execute(text(query)).mappings().fetchone()
        if row:
            print(f"Topic: {topic:<25} -> Best ID: {row['id']:<5} | Slug: {row['slug']:<45} | EN_len: {len(row['content_en']):<7} | HI_len: {len(row['content_hi']):<7} | Title: {row['title']}")
        else:
            print(f"Topic: {topic:<25} -> NOT FOUND")
