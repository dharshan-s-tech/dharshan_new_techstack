import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

rows = db.execute(text("""
    SELECT ca.*, m.controller, m.action, w.title, w.theme, w.id as website_id
    FROM cag_revamp.content_accesses ca
    LEFT JOIN cag_revamp.modules m ON ca.module_id = m.id
    LEFT JOIN cag_revamp.websites w ON ca.website_id = w.id
    WHERE ca.content_id IN (49, 52, 59, 79, 89, 92)
""")).mappings().all()

for r in rows:
    print(dict(r))

db.close()
