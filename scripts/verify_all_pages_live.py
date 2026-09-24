import sys
import requests
import json

sys.stdout.reconfigure(encoding='utf-8')

BASE_API = "http://127.0.0.1:8000/api/v1"
BASE_FRONTEND = "http://localhost:3333"

def run_checks():
    print("=========================================================================")
    print("      LIVE VERIFICATION OF ALL CAG PORTAL & ADMIN DATA ENDPOINTS         ")
    print("=========================================================================\n")

    # 1. Test All Core CMS Pages
    print("--- 1. CORE CMS PAGES (ENGLISH & HINDI) ---")
    cms_slugs = [
        ("page-cag-of-india", "CAG Profile (Shri K. Sanjay Murthy)"),
        ("page-our-vision-mission-values", "Vision, Mission & Core Values"),
        ("page-history-of-indian-audit-and-accounts-department", "History of IAAD"),
        ("page-audit-advisory-board", "Audit Advisory Board"),
        ("page-constitutional-provisions", "Constitutional Provisions"),
        ("page-duties-power-and-conditions-of-services-act", "DPC Act 1971"),
        ("page-cag-audit-regulations", "Audit Regulations"),
        ("page-cag-s-auditing-standards-2017", "Auditing Standards 2017"),
        ("page-citizen-s-charter", "Citizen's Charter"),
        ("page-overview", "Overview of SAI India"),
        ("page-accounts", "Structure of Accounts"),
        ("page-international-relations", "International Relations"),
        ("page-involvement-with-intosai", "Involvement with INTOSAI"),
        ("page-involvement-with-asosai", "Involvement with ASOSAI"),
        ("page-global-audit-leadership-forum-and-other-multilateral-bodies", "GALF & Multilateral Bodies"),
        ("page-bilateral-relations-of-sai-india", "Bilateral Relations of SAI India"),
        ("page-international-audit-assignments", "International Audit Assignments"),
    ]

    all_passed = True
    for slug, label in cms_slugs:
        for cult in ["en", "hi"]:
            url = f"{BASE_API}/pages/get_page_by_slug?slug={slug}&culture={cult}"
            try:
                r = requests.get(url, timeout=5)
                if r.status_code == 200:
                    d = r.json()
                    c_len = len(d.get("content") or "")
                    title = (d.get("title") or "")[:28]
                    has_file = bool(d.get("upload_file_url"))
                    print(f"[{r.status_code} OK] [{cult.upper()}] {label:<35} | Title: '{title:<28}' | Content Len: {c_len:<6} | File: {has_file}")
                else:
                    all_passed = False
                    print(f"[{r.status_code} ERROR] [{cult.upper()}] {label:<35} -> {r.text[:50]}")
            except Exception as e:
                all_passed = False
                print(f"[FAIL] [{cult.upper()}] {label:<35} -> {e}")

    # 2. Test Other Dynamic Modules
    print("\n--- 2. DYNAMIC MODULES & PORTALS ---")
    endpoints = [
        ("/former-cags?culture=en", "Former CAGs List (EN)"),
        ("/former-cags?culture=hi", "Former CAGs List (HI)"),
        ("/organisation-chart?culture=en", "Organisation Chart (EN)"),
        ("/organisation-chart?culture=hi", "Organisation Chart (HI)"),
        ("/reports?limit=10", "Audit Reports"),
        ("/reports/filters", "Audit Reports Filters"),
        ("/state-accounts?limit=10", "State Accounts Statements"),
        ("/combined-accounts?limit=10", "Combined Finance Accounts"),
        ("/presence", "Our Presence / State Offices"),
        ("/banners", "Home Hero Banners"),
        ("/news", "Latest News & Updates"),
        ("/tenders", "Active Tenders"),
        ("/circulars", "Circulars & Office Orders"),
    ]

    for ep, label in endpoints:
        url = f"{BASE_API}{ep}"
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                data = r.json()
                count = len(data) if isinstance(data, list) else (len(data.get("items", [])) if "items" in data else len(data.get("officers", [])) if "officers" in data else len(data))
                print(f"[{r.status_code} OK] {label:<35} | Count / Size: {count}")
            else:
                print(f"[{r.status_code} ERROR] {label:<35} -> {r.text[:50]}")
        except Exception as e:
            print(f"[FAIL] {label:<35} -> {e}")

    # 3. Test Next.js Frontend Pages
    print("\n--- 3. FRONTEND NEXT.JS CORE ROUTES ---")
    frontend_routes = [
        ("/", "Home Page"),
        ("/About/About-Us/Cag-Of-India", "CAG Profile Page"),
        ("/About/About-Us/Our-Vision,-Mission-&-Core-Values", "Vision & Mission Page"),
        ("/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department", "History of IAAD Page"),
        ("/About/About-Us/Audit-Advisory-Board", "Audit Advisory Board Page"),
        ("/About/About-Us/Constitutional-Provisions", "Constitutional Provisions Page"),
        ("/About/About-Us/Duties-&-Powers-Act", "Duties & Powers Page"),
        ("/About/About-Us/Audit-Regulation", "Audit Regulation Page"),
        ("/About/About-Us/Former-Comptroller-and-Auditors-General", "Former CAGs Page"),
        ("/About/About-Us/Organisation-Chart", "Organisation Chart Page"),
        ("/About/About-Us/International-Relations", "International Relations Page"),
        ("/Reports", "Reports Hub Page"),
        ("/Reports/accounts", "Accounts Page"),
        ("/Our-Presence", "Our Presence Hub"),
        ("/states/andhra-pradesh", "State Portal (Andhra Pradesh)"),
        ("/admin/about", "Admin About Registry"),
    ]

    for route, label in frontend_routes:
        url = f"{BASE_FRONTEND}{route}"
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                print(f"[{r.status_code} OK] {label:<35} ({route})")
            else:
                print(f"[{r.status_code} ERROR] {label:<35} ({route})")
        except Exception as e:
            print(f"[FAIL] {label:<35} ({route}) -> {e}")

    print("\n=========================================================================")
    print("                       VERIFICATION COMPLETE                             ")
    print("=========================================================================")

if __name__ == '__main__':
    run_checks()
