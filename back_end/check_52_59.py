import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

rows = db.execute(text("""
    SELECT s.id, s.prefix_name, s.full_name, s.designation_id, s.subsite_org_desig_hierarchy_id,
           s.display_home, s.display_order, s.profile_image, s.email, s.mobile_no,
           ca.website_id, ca.module_id, m.controller
    FROM cag_revamp.subsites_org_struct s
    JOIN cag_revamp.content_accesses ca ON ca.content_id = s.id
    JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'SubsitesOrgStruct'
    WHERE s.id IN (52, 59)
""")).mappings().all()

for r in rows:
    print(dict(r))

db.close()
