import json
import os

data_dir = r"c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\data"
sa_file = os.path.join(data_dir, "local_state_accounts.json")
ca_file = os.path.join(data_dir, "local_combined_accounts.json")

states = [
    "Andhra Pradesh", "Maharashtra", "Gujarat", "Tamil Nadu", "Karnataka",
    "Rajasthan", "Uttar Pradesh", "Kerala", "Bihar", "Odisha",
    "Puducherry", "Jammu & Kashmir", "Delhi", "Chandigarh"
]

existing_sa = []
if os.path.exists(sa_file):
    try:
        with open(sa_file, "r", encoding="utf-8") as f:
            existing_sa = json.load(f)
    except Exception:
        pass

user_items = [it for it in existing_sa if not it.get("is_seed")]

seed_sa = []
id_counter = 1000

for st_idx, st in enumerate(states):
    st_id = st_idx + 1
    # Finance Accounts
    for yr in ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21", "2019-20"]:
        id_counter += 1
        clean_name = st.lower().replace(" ", "_").replace("&", "and")
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"{st} Finance Accounts Vol I",
            "title_en": f"{st} Finance Accounts Vol I",
            "state_id": st_id,
            "state_name": st,
            "category_name": "Finance Accounts",
            "account_year": yr,
            "year": yr,
            "volume": "Vol I",
            "file_name": f"{clean_name}_finance_vol_1_{yr}.pdf",
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })
        id_counter += 1
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"{st} Finance Accounts Vol II",
            "title_en": f"{st} Finance Accounts Vol II",
            "state_id": st_id,
            "state_name": st,
            "category_name": "Finance Accounts",
            "account_year": yr,
            "year": yr,
            "volume": "Vol II",
            "file_name": f"{clean_name}_finance_vol_2_{yr}.pdf",
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })

    # Monthly Key Indicators
    for m in ["July", "June", "May", "April"]:
        id_counter += 1
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"Monthly Key Indicators for {m}, 2026",
            "title_en": f"Monthly Key Indicators for {m}, 2026",
            "state_id": st_id,
            "state_name": st,
            "category_name": "Monthly Key Indicators",
            "account_year": "2026-27",
            "year": "2026-27",
            "month": m,
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })
    for m in ["March", "February", "January", "December"]:
        id_counter += 1
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"Monthly Key Indicators for {m}, 2025/2026",
            "title_en": f"Monthly Key Indicators for {m}, 2025/2026",
            "state_id": st_id,
            "state_name": st,
            "category_name": "Monthly Key Indicators",
            "account_year": "2025-26",
            "year": "2025-26",
            "month": m,
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })

    # Accounts at a Glance
    for yr in ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"]:
        id_counter += 1
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"Accounts at a Glance - {yr}",
            "title_en": f"Accounts at a Glance - {yr}",
            "state_id": st_id,
            "state_name": st,
            "category_name": "Accounts at a Glance",
            "account_year": yr,
            "year": yr,
            "size": "5.97 MB",
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })

    # Appropriation Accounts
    for yr in ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"]:
        id_counter += 1
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"Appropriation Accounts - {yr}",
            "title_en": f"Appropriation Accounts - {yr}",
            "state_id": st_id,
            "state_name": st,
            "category_name": "Appropriation Accounts",
            "account_year": yr,
            "year": yr,
            "size": "5.97 MB",
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })

    # FA&AA data
    for yr in ["2024-25", "2023-24", "2022-23"]:
        id_counter += 1
        seed_sa.append({
            "id": str(id_counter),
            "rawId": str(id_counter),
            "title": f"{yr} FA&AA Report",
            "title_en": f"{yr} FA&AA Report",
            "state_id": st_id,
            "state_name": st,
            "category_name": "FA&AA data",
            "account_year": yr,
            "year": yr,
            "size": "1.45 MB",
            "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
            "is_active": True,
            "is_seed": True
        })

with open(sa_file, "w", encoding="utf-8") as f:
    json.dump(user_items + seed_sa, f, indent=2)

print("Wrote", len(user_items + seed_sa), "state accounts to", sa_file)

seed_ca = [
    {
        "id": "89929",
        "rawId": "89929",
        "title": "Combined Finance and Revenue Accounts of Union and State Governments",
        "title_en": "Combined Finance and Revenue Accounts of Union and State Governments",
        "category": "combined",
        "account_year": "2024-25",
        "year": "2024-25",
        "size": "18.5 MB",
        "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    },
    {
        "id": "89928",
        "rawId": "89928",
        "title": "Combined Finance and Revenue Accounts of Union and State Governments",
        "title_en": "Combined Finance and Revenue Accounts of Union and State Governments",
        "category": "combined",
        "account_year": "2023-24",
        "year": "2023-24",
        "size": "17.2 MB",
        "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    },
    {
        "id": "89927",
        "rawId": "89927",
        "title": "Combined Finance and Revenue Accounts of Union and State Governments",
        "title_en": "Combined Finance and Revenue Accounts of Union and State Governments",
        "category": "combined",
        "account_year": "2022-23",
        "year": "2022-23",
        "size": "16.8 MB",
        "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    },
    {
        "id": "89926",
        "rawId": "89926",
        "title": "Proceedings of 34th Conference of State Finance Secretaries",
        "title_en": "Proceedings of 34th Conference of State Finance Secretaries",
        "category": "conference",
        "account_year": "2024",
        "year": "2024",
        "size": "4.5 MB",
        "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    },
    {
        "id": "89925",
        "rawId": "89925",
        "title": "Proceedings of 33rd Conference of State Finance Secretaries",
        "title_en": "Proceedings of 33rd Conference of State Finance Secretaries",
        "category": "conference",
        "account_year": "2023",
        "year": "2023",
        "size": "3.8 MB",
        "file_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf",
        "is_active": True
    }
]

with open(ca_file, "w", encoding="utf-8") as f:
    json.dump(seed_ca, f, indent=2)

print("Wrote", len(seed_ca), "combined accounts to", ca_file)
