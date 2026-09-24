import sys
import json
from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print("--- Subsite Org Desig Hierarchy ---")
try:
    rows = db.execute(text('SELECT * FROM cag_revamp.subsite_org_desig_hierarchy;')).mappings().all()
    for r in rows:
        print(dict(r))
except Exception as e:
    print(e)
    db.rollback()

print("\n--- Subsite Org Charge Master ---")
try:
    rows = db.execute(text('SELECT * FROM cag_revamp.subsite_org_charge_master;')).mappings().all()
    for r in rows:
        print(dict(r))
except Exception as e:
    print(e)
    db.rollback()

print("\n--- Subsite Staff for 143, 144, 148 ---")
try:
    rows = db.execute(text("""
        SELECT s.id, s.prefix_name, s.full_name, s.designation_id, s.subsite_org_desig_hierarchy_id, 
               s.display_home, ca.website_id, w.theme, s.status, s.profile_image, s.email, s.mobile_no, s.brief_description
        FROM cag_revamp.subsites_org_struct s
        JOIN cag_revamp.content_accesses ca ON ca.content_id = s.id
        JOIN cag_revamp.modules m ON ca.module_id = m.id AND m.controller = 'SubsitesOrgStruct'
        JOIN cag_revamp.websites w ON w.id = ca.website_id
        WHERE ca.website_id IN (143, 144, 148)
        ORDER BY ca.website_id, s.display_order, s.id;
    """)).mappings().all()
    for r in rows:
        d = dict(r)
        print(f"wid={d['website_id']} theme={d['theme']} id={d['id']} desig_id={d['designation_id']} hier={d['subsite_org_desig_hierarchy_id']} disp_home={d['display_home']}")
        print(f"  Name: {repr(d['full_name'])}")
        print(f"  Prefix: {repr(d['prefix_name'])}")
        print(f"  Img: {d['profile_image']}")
        print(f"  Email: {d['email']}, Phone: {d['mobile_no']}")
        print(f"  Bio length: {len(d['brief_description'] or '')}")
except Exception as e:
    print(e)
    db.rollback()

db.close()
