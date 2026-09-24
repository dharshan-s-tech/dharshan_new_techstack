import json
import codecs
from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Hierarchies
hier_rows = db.execute(text('SELECT id, title, parent_id, status FROM cag_revamp.subsite_org_desig_hierarchy;')).mappings().all()
hiers = {r['id']: r['title'] for r in hier_rows}

# Staff across all overseas subsites
rows = db.execute(text("""
    SELECT s.id, s.prefix_name, s.full_name, s.designation_id, s.subsite_org_desig_hierarchy_id, 
           s.display_home, ca.website_id, w.theme, w.title as web_title, s.status, s.profile_image, s.email, s.mobile_no, s.brief_description
    FROM cag_revamp.subsites_org_struct s
    LEFT JOIN cag_revamp.content_accesses ca ON ca.content_id = s.id AND ca.module_id = 7
    LEFT JOIN cag_revamp.websites w ON w.id = ca.website_id
    WHERE s.status = 1
    ORDER BY ca.website_id, s.display_order, s.id;
""")).mappings().all()

out = {
    "hierarchies": hiers,
    "staff": [dict(r) for r in rows]
}

with open("staff_dump.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2, default=str)

print("Saved", len(rows), "staff records to staff_dump.json")
