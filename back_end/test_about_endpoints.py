import urllib.request
import json

endpoints = [
    "/api/pages/page-constitutional-provisions?culture=en",
    "/api/pages/page-constitutional-provisions?culture=hi",
    "/api/pages/page-duties-power-and-conditions-of-services-act?culture=en",
    "/api/pages/page-cag-audit-regulations?culture=en",
    "/api/pages/page-history-of-indian-audit-and-accounts-department?culture=en",
    "/api/pages/page-audit-advisory-board?culture=en",
    "/api/pages/page-international-relations?culture=en",
    "/api/pages/page-involvement-with-intosai?culture=en",
    "/api/pages/page-involvement-with-asosai?culture=en",
    "/api/pages/page-global-audit-leadership-forum-and-other-multilateral-bodies?culture=en",
    "/api/pages/page-bilateral-relations-of-sai-india?culture=en",
    "/api/pages/page-international-audit-assignments?culture=en",
    "/api/admin/crud?table=about&limit=5"
]

def main():
    base = "http://127.0.0.1:8000"
    for ep in endpoints:
        url = base + ep
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.getcode()
                data = json.loads(response.read().decode('utf-8'))
                title = data.get('title') or (data.get('data')[0].get('title_en') if isinstance(data.get('data'), list) and len(data.get('data')) > 0 else 'N/A')
                print(f"[OK 200] {ep} -> Title/Result: {title}")
        except Exception as e:
            print(f"[FAIL] {ep} -> Error: {e}")

if __name__ == '__main__':
    main()
