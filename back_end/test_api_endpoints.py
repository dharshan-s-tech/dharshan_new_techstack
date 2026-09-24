import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

for slug in ['overseas-london', 'overseas-kualalumpur', 'overseas-washington']:
    url = f"http://127.0.0.1:8000/api/v1/subsites/{slug}"
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            data = res.get("data", {})
            print(f"\n==================== {slug} ====================")
            print("Office:", data.get("officeNameEn"), "/", data.get("officeNameHi"))
            print("Location:", data.get("locationEn"), "/", data.get("locationHi"))
            print("Staff Count:", len(data.get("staff", [])))
            for s in data.get("staff", []):
                print(f"  - [{s.get('id')}] {s.get('prefix')} {s.get('officer_name')} | {s.get('designation')} | display_home={s.get('display_home')} | photo={s.get('photo')}")
    except Exception as e:
        print(f"Error fetching {slug}: {e}")
