import asyncio
import sys
sys.stdout.reconfigure(encoding='utf-8')

from app.api.v1.subsites import get_subsite_by_slug
from app.core.database import SessionLocal

db = SessionLocal()
res = asyncio.run(get_subsite_by_slug('overseas-london', db))
print('London staff count:', len(res['data']['staff']))
for s in res['data']['staff']:
    if s['display_home'] == 1 or s['id'] in (52, 59):
        print(f"  [{s['id']}] {s['officer_name']} | {s['designation']} | disp_home={s['display_home']} | bio len={len(s['bio'])}")

print('\nKUL staff count:', len(res.get('data', {}).get('staff', [])))
res_kul = asyncio.run(get_subsite_by_slug('overseas-kualalumpur', db))
for s in res_kul['data']['staff']:
    print(f"  [{s['id']}] {s['officer_name']} | {s['designation']} | disp_home={s['display_home']}")

db.close()
