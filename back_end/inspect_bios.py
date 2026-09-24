import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

rows = db.execute(text("""
    SELECT id, prefix_name, full_name, designation_id, profile_image, email, mobile_no, brief_description
    FROM cag_revamp.subsites_org_struct
    WHERE id IN (49, 52, 59, 77, 79, 83)
    ORDER BY id ASC;
""")).mappings().all()

for r in rows:
    d = dict(r)
    print(f"\n================ Officer ID {d['id']} ================")
    print("Name:", d['full_name'])
    print("Prefix:", d['prefix_name'])
    print("Desig ID:", d['designation_id'])
    print("Photo:", d['profile_image'])
    print("Email:", d['email'], "Phone:", d['mobile_no'])
    print("Bio Preview:", (d['brief_description'] or "")[:300])

db.close()
