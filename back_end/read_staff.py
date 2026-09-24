import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('staff_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Hierarchies:")
for k, v in data['hierarchies'].items():
    print(f"  {k}: {v}")

print("\nStaff matching overseas or key people:")
for s in data['staff']:
    wid = s.get('website_id')
    name = s.get('full_name') or ''
    if wid in [143, 144, 148] or any(x in name.lower() for x in ['sunilraj', 'deepak', 'hari', 'gaurav', 'raghu', 'somarajan']):
        print(f"ID: {s['id']}, wid: {wid}, theme: {s.get('theme')}, desig_id: {s.get('designation_id')}, hier_id: {s.get('subsite_org_desig_hierarchy_id')}, disp_home: {s.get('display_home')}")
        print(f"  Name: {name}")
        print(f"  Prefix: {s.get('prefix_name')}")
        print(f"  Image: {s.get('profile_image')}")
        print(f"  Email: {s.get('email')}, Phone: {s.get('mobile_no')}")
        print()
