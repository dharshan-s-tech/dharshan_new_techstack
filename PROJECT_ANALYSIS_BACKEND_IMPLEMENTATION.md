# CAG Website v2 — Backend Architecture & Implementation Blueprint
**Focus**: FastAPI REST Engine, PostgreSQL / SQLite Resilient ORM, Admin Drawer CRUD, and Public Reports & Accounts Suites  
**Date**: September 9, 2026  
**Status**: Comprehensive Technical Analysis & Execution Blueprint Complete  

---

## 1. Executive Summary

This document provides the exhaustive architectural specification, technical gap analysis, and implementation roadmap for upgrading the **FastAPI Backend (`back_end/`)** of the **Comptroller & Auditor General of India (CAG) Website (v2)**.

The frontend has already been enhanced with a **Figma-inspired slide-out side panel drawer** for reports management, dedicated subpage management for **Combined Accounts & Conferences**, a **multi-criteria filtered public reports engine** with pagination, dynamic counters, and rich constitutional audit narratives (Article 151 mandate, Key Findings, Recommendations).

This blueprint establishes the corresponding production-grade backend architecture to replace empty stubs and ephemeral in-memory dictionaries with a robust, persistent, and performant data layer.

### System Comparison Matrix

| Component | Current Backend State | Frontend / Admin UI Requirement | Target Backend Architecture |
| :--- | :--- | :--- | :--- |
| **Audit Reports API** (`/api/v1/reports`) | Empty stub returning `{"items": [], "total": 0}`. | Multi-criteria filtering (Level, Sector, Type, Year, Status, Search), 9-item pagination, dynamic counter, sorting (`newest`, `oldest`, `title_asc`). | **`ReportRepository` & `ReportService`** with dynamic SQLAlchemy query composition, case-insensitive ILIKE search, and pagination. |
| **Report Details API** (`/api/v1/reports/{id}`) | Non-existent; frontend falls back to hardcoded dummy text. | Structured CAG audit sections: Constitutional Executive Summary (Article 151), Key Findings list, Recommendations, PDF link, Video modal, Related Reports. | **`GET /api/v1/reports/{id}`** returning enriched audit narrative and dynamically computing 3 related sector reports. |
| **State Accounts API** (`/api/v1/state-accounts`) | Returns static 2-line JSON dict; no states, years, or docs. | 28 States + 5 UTs selection, fiscal periods (*Current 2021–2026 vs Pre-2021 Archive*), 4 document categories (Finance, Glance, Indicators, Appropriation). | **`StateAccount` ORM Model & API** supporting state lookups, volume hierarchy, period categorization, and download metadata. |
| **Combined Accounts API** (`/api/v1/combined-accounts`) | Non-existent route. | Admin CRUD drawer and public access for Combined Finance & Revenue Accounts and State Finance Secretaries Conferences. | **`CombinedAccount` ORM Model & API** with category toggling, volume grouping, and PDF download links. |
| **Admin Reports CRUD** (`/api/v1/admin/crud`) | Writes to ephemeral Python dictionary (`MOCK_MODULE_STORE`); lost on server restart. | Slide-out side panel drawer saving 22 fields across 4 tabs (Metadata, Findings, Media, Status) with audit logging. | **PostgreSQL/SQLite ORM Persistence** via unified CRUD service with transaction safety and `AdminAuditLog` tracking. |
| **File & Media Storage** (`/api/v1/admin/upload`) | Uploads saved to local folder without static mounting; no public URL routing. | Uploading card cover banners (PNG/JPG/WEBP) and audit report documents (PDF) with live thumbnail and size display. | **FastAPI `StaticFiles` mounting** (`/admin-uploads`, `/static`) with MIME validation, size limits, and persistent disk storage. |
| **Data Models (ORM)** | Basic 8-column `Report` model lacking bilingual, narrative, and media fields. | 22 fields matching the admin drawer and public report details page. | **22-column `Report` model**, plus dedicated `StateAccount` and `CombinedAccount` models with timestamps. |
| **Database Resilience & Seeding** | Server crashes if PostgreSQL authentication fails. No initial data. | Immediate developer availability out of the box with the 12 master audit reports from `dataManager.ts`. | **Dual-Engine Resilience** (PostgreSQL primary with seamless SQLite fallback) + automatic startup seeder (`seed.py`). |

---

## 2. High-Level Backend Architecture

```mermaid
flowchart TD
    subgraph Client Layer ["Client Layer (Next.js 15)"]
        UI_Reports["Public Reports (/Reports)"]
        UI_Detail["Report Details (/Reports/:id)"]
        UI_Accounts["State & Combined Accounts (/Reports/accounts)"]
        Admin_Drawer["Admin Slide-Out Drawer (/admin/reports)"]
        Admin_Accounts["Admin State & Combined Accounts (/admin/*)"]
    end

    subgraph APILayer ["FastAPI API Gateway (/api/v1)"]
        Router_Reports["/api/v1/reports"]
        Router_StateAcc["/api/v1/state-accounts"]
        Router_CombAcc["/api/v1/combined-accounts"]
        Router_AdminCRUD["/api/v1/admin/crud"]
        Router_Upload["/api/v1/admin/upload"]
    end

    subgraph ServiceLayer ["Business Logic & Service Layer"]
        Service_Report["ReportService"]
        Service_StateAcc["StateAccountService"]
        Service_CombAcc["CombinedAccountService"]
        Service_Upload["UploadService"]
    end

    subgraph RepoLayer ["Data Access & Repository Layer"]
        Repo_Report["ReportRepository"]
        Repo_StateAcc["StateAccountRepository"]
        Repo_CombAcc["CombinedAccountRepository"]
        Repo_Audit["AuditLogRepository"]
    end

    subgraph StorageLayer ["Persistence & Storage Layer"]
        DB_Engine[{"Database Engine Router"}]
        DB_Postgres[("PostgreSQL (d_cag / cag_new)")]
        DB_SQLite[("SQLite Dev Fallback (cag_dev.db)")]
        Disk_Media[("Local Disk (/public/admin-uploads)")]
    end

    UI_Reports --> Router_Reports
    UI_Detail --> Router_Reports
    UI_Accounts --> Router_StateAcc
    UI_Accounts --> Router_CombAcc
    Admin_Drawer --> Router_AdminCRUD
    Admin_Drawer --> Router_Upload
    Admin_Accounts --> Router_AdminCRUD

    Router_Reports --> Service_Report
    Router_StateAcc --> Service_StateAcc
    Router_CombAcc --> Service_CombAcc
    Router_AdminCRUD --> Service_Report
    Router_AdminCRUD --> Service_StateAcc
    Router_AdminCRUD --> Service_CombAcc
    Router_Upload --> Service_Upload

    Service_Report --> Repo_Report
    Service_StateAcc --> Repo_StateAcc
    Service_CombAcc --> Repo_CombAcc
    Service_Report --> Repo_Audit
    Service_Upload --> Disk_Media

    Repo_Report --> DB_Engine
    Repo_StateAcc --> DB_Engine
    Repo_CombAcc --> DB_Engine
    Repo_Audit --> DB_Engine

    DB_Engine -->|Credentials OK| DB_Postgres
    DB_Engine -->|Fallback Mode| DB_SQLite
```

---

## 3. Database Layer & ORM Models Specification

### A. Dual-Engine Resilience Configuration (`app/core/database.py`)
To prevent server startup failures when PostgreSQL credentials differ across environments, the database engine implements automatic dual-mode resilience:
1. **Primary**: Connects to PostgreSQL using `settings.sqlalchemy_database_url`. If connected, it sets the search path to `cag_new` schema.
2. **Fallback**: If PostgreSQL connection fails (authentication failure, server offline), it automatically initializes a local SQLite database (`sqlite:///./cag_dev.db`), logs a warning, and creates all tables without crashing.

### B. Comprehensive `Report` Model (`app/models/report.py`)
```python
class Report(Base):
    __tablename__ = "audit_reports"

    # Tab 1: Classification & Metadata
    id = Column(String, primary_key=True, index=True) # e.g. 'rep-1' or UUID
    title_en = Column(String(500), nullable=False, index=True)
    title_hi = Column(String(500), nullable=True)
    sector = Column(String(100), nullable=False, index=True) 
    # e.g., 'Finance', 'Transport & Infrastructure', 'IT Audit', 'Defence', 'Environment', 'Social Welfare', 'Tax and Duties'
    admin_level = Column(String(50), nullable=False, index=True) # 'Union', 'States', 'Local Bodies'
    state_id = Column(Integer, nullable=True, index=True)
    state_name = Column(String(100), nullable=True)
    report_type = Column(String(50), nullable=False, index=True) # 'Performance', 'Compliance', 'Financial', 'ADC Reports'
    year_of_report = Column(Integer, nullable=False, index=True) # e.g., 2026
    ministry_dept = Column(String(255), nullable=True) # e.g., 'Ministry of Road Transport and Highways'
    tabled_date = Column(String(50), nullable=True) # e.g., '2026-03-15'
    tag = Column(String(100), nullable=True) # Category badge label

    # Tab 2: Findings & Narrative
    summary_teaser = Column(Text, nullable=True) # Card teaser summary
    executive_summary = Column(Text, nullable=True) # Constitutional scope under Article 151
    key_findings = Column(Text, nullable=True) # Serialized JSON or bullet points of audit observations
    recommendations = Column(Text, nullable=True) # Serialized JSON or bullet points of systemic recommendations

    # Tab 3: Media & Attachments
    card_image_url = Column(String(500), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    pdf_size = Column(String(50), nullable=True) # e.g., '14.8 MB'
    video_url = Column(String(500), nullable=True) # YouTube video briefing link

    # Tab 4: Publishing & Portal Status
    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### C. `StateAccount` Model (`app/models/state_account.py`)
```python
class StateAccount(Base):
    __tablename__ = "state_accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title_en = Column(String(500), nullable=False)
    title_hi = Column(String(500), nullable=True)
    state_id = Column(Integer, nullable=False, index=True)
    state_name = Column(String(100), nullable=False, index=True)
    account_year = Column(Integer, nullable=False, index=True) # e.g. 2026
    month = Column(String(50), nullable=True) # e.g. 'January', 'July', 'Annual'
    volume = Column(String(100), nullable=True) # e.g. 'Vol I', 'Vol II', 'Accounts at a Glance'
    account_type = Column(String(100), nullable=False, index=True) 
    # 'finance_accounts', 'accounts_at_a_glance', 'monthly_indicators', 'appropriation_accounts'
    period_type = Column(String(50), default="current", index=True) # 'current' (2021-2026) vs 'archive' (pre-2021)
    file_url = Column(String(500), nullable=False)
    file_size = Column(String(50), nullable=True)
    external_link = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### D. `CombinedAccount` Model (`app/models/combined_account.py`)
```python
class CombinedAccount(Base):
    __tablename__ = "combined_accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title_en = Column(String(500), nullable=False)
    title_hi = Column(String(500), nullable=True)
    category = Column(String(100), nullable=False, index=True) # 'combined' vs 'conference'
    fiscal_year = Column(String(50), nullable=False, index=True) # e.g. '2024-25'
    volume_no = Column(String(100), nullable=True) # e.g. 'Volume I', 'Compendium'
    description = Column(Text, nullable=True)
    pdf_url = Column(String(500), nullable=False)
    file_size = Column(String(50), nullable=True) # e.g. '8.4 MB'
    is_active = Column(Boolean, default=True, index=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## 4. API Endpoints Specification

### A. Public Reports Suite (`/api/v1/reports`)

#### 1. Paginated Filtered Listing
- **Endpoint**: `GET /api/v1/reports`
- **Query Parameters**:
  - `page` (int, default: `1`)
  - `limit` (int, default: `9`)
  - `level` (str: `Union`, `States`, `Local Bodies`, `All`)
  - `sector` (str: e.g. `Finance`, `Transport & Infrastructure`, `All`)
  - `type` (str: `Performance`, `Compliance`, `Financial`, `ADC Reports`, `All`)
  - `year` (str / int: e.g. `2026`, `All`)
  - `query` (str: search keyword across title, ministry, executive summary)
  - `sort` (str: `newest` [tabled_date desc], `oldest`, `title_asc`)
  - `status` (str: `active` [default for public] or `all` [for admin])
- **Response Format**:
  ```json
  {
    "items": [
      {
        "id": "rep-1",
        "title": "Performance Audit on National Highway Development Projects",
        "title_en": "Performance Audit on National Highway Development Projects",
        "title_hi": "राष्ट्रीय राजमार्ग विकास परियोजनाओं पर निष्पादन लेखापरीक्षा",
        "sector": "Transport & Infrastructure",
        "level": "Union",
        "type": "Performance",
        "year": "2026",
        "date": "2026-03-15",
        "tag": "Transport & Infra",
        "desc": "Comprehensive audit assessing highway concession agreements and lane utilization.",
        "image": "/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png",
        "pdf_url": "/admin-uploads/uploads/sample_report.pdf",
        "pdf_size": "14.8 MB",
        "isFeatured": true,
        "is_active": true
      }
    ],
    "total": 12,
    "page": 1,
    "limit": 9,
    "totalPages": 2
  }
  ```

#### 2. Detailed Report with Constitutional Audit Narrative
- **Endpoint**: `GET /api/v1/reports/{id}`
- **Response Format**:
  ```json
  {
    "id": "rep-1",
    "title_en": "Performance Audit on National Highway Development Projects",
    "title_hi": "राष्ट्रीय राजमार्ग विकास परियोजनाओं पर निष्पादन लेखापरीक्षा",
    "sector": "Transport & Infrastructure",
    "admin_level": "Union",
    "report_type": "Performance",
    "year_of_report": 2026,
    "ministry_dept": "Ministry of Road Transport and Highways",
    "tabled_date": "15 March 2026",
    "summary_teaser": "Comprehensive audit evaluating expressway toll concessions...",
    "executive_summary": "Pursuant to Article 151(1) of the Constitution of India, this Performance Audit was conducted...",
    "key_findings": [
      "Inordinate delays exceeding 36 months in land acquisition packages resulting in cost escalation of Rs 4,820 crore.",
      "Arbitrary toll concession extensions granted without prior approval of NHAI Board."
    ],
    "recommendations": [
      "Mandatory 80% encumbrance-free right of way verification prior to commercial bidding.",
      "Establishment of an independent real-time toll audit dashboard."
    ],
    "card_image_url": "/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png",
    "pdf_url": "/admin-uploads/uploads/sample_report.pdf",
    "pdf_size": "14.8 MB",
    "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "related_reports": [
      {
        "id": "rep-9",
        "title": "State Highway & Mega Bridge Construction Audit",
        "sector": "Transport & Infrastructure",
        "year": "2024"
      }
    ]
  }
  ```

#### 3. Audit Metrics Summary
- **Endpoint**: `GET /api/v1/reports/metrics/summary`
- **Response Format**:
  ```json
  {
    "total": 12,
    "active": 11,
    "union": 4,
    "states": 5,
    "local_bodies": 3
  }
  ```

---

### B. State Accounts Suite (`/api/v1/state-accounts`)
- **Endpoint**: `GET /api/v1/state-accounts`
- **Query Parameters**: `state_id`, `year`, `period_type` (`current` vs `archive`), `account_type`, `search`
- **Response**: Array of `StateAccount` objects with full volume breakdown and PDF metadata.

---

### C. Combined Accounts Suite (`/api/v1/combined-accounts`)
- **Endpoint**: `GET /api/v1/combined-accounts`
- **Query Parameters**: `category` (`combined` vs `conference`), `year`, `search`
- **Response**: Array of `CombinedAccount` documents with volume titles and file links.

---

### D. Admin Drawer CRUD & Media Uploads

#### 1. Admin Reports Drawer Mutations
- **Create**: `POST /api/v1/admin/crud?table=audit_reports`
- **Update**: `PUT /api/v1/admin/crud?table=audit_reports&id={id}`
- **Delete**: `DELETE /api/v1/admin/crud?table=audit_reports&id={id}`
- **Persistence**: Handled directly by `ReportRepository` saving to database and appending a record to `admin_audit_log`.

#### 2. Media & Document Upload
- **Endpoint**: `POST /api/v1/admin/upload`
- **Supported File Types**:
  - Images: `PNG`, `JPG`, `JPEG`, `WEBP` (stored in `public/admin-uploads/images/`)
  - Documents: `PDF`, `DOCX`, `XLSX` (stored in `public/admin-uploads/uploads/`)
- **Response**: `{ "url": "/admin-uploads/images/172587...png", "name": "banner.png", "size": 245019 }`
- **Static Mounting**: Configured in FastAPI:
  ```python
  app.mount("/admin-uploads", StaticFiles(directory="public/admin-uploads"), name="admin-uploads")
  ```

---

## 5. Database Seeding & Startup Automation (`app/core/seed.py`)

To ensure immediate developer availability without relying on manual entry, `app/core/seed.py` pre-populates the database upon initial boot if the `audit_reports` table is empty:
- **12 Master Reports (`rep-1` to `rep-12`)**:
  - Transferred from `dataManager.ts` master registry with full bilingual titles, sector categorization, executive summaries, bulleted audit findings, and systemic recommendations.
- **Initial State Accounts**:
  - Sample records for Gujarat, Maharashtra, Tamil Nadu, and Delhi across Finance Accounts and Accounts at a Glance.
- **Combined Accounts & Conferences**:
  - Sample Combined Revenue Accounts Vol I/II and State Finance Secretaries Conference compendiums.
- **Admin User**:
  - Default administrative account with hashed credentials for local testing.

---

## 6. Next.js Frontend Bridge (`src/lib/api.ts`)

The frontend API client is configured with **dual-mode live synchronization**:
1. When FastAPI is running on `http://127.0.0.1:8000`, all queries for reports, single report details, state accounts, and combined accounts fetch live data from the backend.
2. If the backend is unreachable or offline, `fetchJson()` automatically catches the network exception and returns fallback data from `dataManager.ts`, guaranteeing zero broken screens.

---

## 7. Step-by-Step Implementation Roadmap & Action Checklist

### Phase 1: Database Engine & ORM Models
- [ ] Implement dual-engine fallback in `back_end/app/core/database.py` (PostgreSQL primary with seamless SQLite `cag_dev.db` fallback).
- [ ] Update `back_end/app/core/config.py` with fallback database URL and static upload directory settings.
- [ ] Expand `back_end/app/models/report.py` to the full 22-attribute schema.
- [ ] Create `back_end/app/models/state_account.py`.
- [ ] Create `back_end/app/models/combined_account.py`.
- [ ] Create `back_end/app/models/__init__.py` exporting all models.

### Phase 2: Pydantic Validation & Serialization Schemas
- [ ] Create `back_end/app/schemas/report.py` with `ReportCreate`, `ReportUpdate`, `ReportItemResponse`, `ReportDetailResponse`, `ReportPaginationResponse`, `ReportMetricsResponse`.
- [ ] Create `back_end/app/schemas/state_account.py`.
- [ ] Create `back_end/app/schemas/combined_account.py`.

### Phase 3: Repositories & Business Logic Services
- [ ] Create `back_end/app/repositories/report_repository.py` with multi-criteria filtering, ILIKE search, sorting, and related reports logic.
- [ ] Create `back_end/app/repositories/state_account_repository.py`.
- [ ] Create `back_end/app/repositories/combined_account_repository.py`.
- [ ] Implement `back_end/app/services/report_service.py` with pagination wrappers, metrics calculations, and drawer update operations.
- [ ] Create `back_end/app/services/state_account_service.py`.
- [ ] Create `back_end/app/services/combined_account_service.py`.

### Phase 4: API Routers & File Upload
- [ ] Overhaul `back_end/app/api/v1/reports.py` with live paginated listing, single detail route, and metrics summary.
- [ ] Create `back_end/app/api/v1/state_accounts.py`.
- [ ] Create `back_end/app/api/v1/combined_accounts.py`.
- [ ] Update `back_end/app/api/v1/admin/crud.py` to persist directly to database tables via ORM models.
- [ ] Update `back_end/app/api/v1/admin/upload.py` and mount static directory in `main.py`.
- [ ] Register all routers in `back_end/app/api/router.py`.

### Phase 5: Database Seeding & Startup Integration
- [ ] Create `back_end/app/core/seed.py` with the 12 master audit reports from `dataManager.ts`.
- [ ] Hook seeder into `lifespan` in `back_end/app/main.py`.
- [ ] Update `src/lib/api.ts` in the frontend to forward query parameters to FastAPI.

---

## 8. How to Run & Verify Locally

### 1. Start the FastAPI Backend
```powershell
cd back_end
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Documentation: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/health`

### 2. Start the Next.js Frontend
```powershell
npm run dev
```
- Frontend Portal: `http://localhost:3333`

### 3. Key Endpoints for Verification
| Feature | Endpoint / URL | Verification Action |
| :--- | :--- | :--- |
| **Swagger API Docs** | `http://127.0.0.1:8000/docs` | Execute `GET /api/reports` with `sector=Finance` and `page=1`. Verify paginated JSON response. |
| **Audit Narrative Detail** | `http://127.0.0.1:8000/api/reports/rep-1` | Verify `executive_summary`, `key_findings`, and `related_reports` are populated. |
| **Admin Reports Drawer** | `http://localhost:3333/admin/reports` | Click "Edit" on a report, modify fields across the 4 tabs, and click "Save & Publish". Verify database persistence. |
| **Public Reports Listing** | `http://localhost:3333/Reports` | Test top dropdown toolbar (Year, Sector, Level, Sort) and sidebar checkboxes. |
| **Public Report Detail** | `http://localhost:3333/Reports/rep-1` | Verify live constitutional executive summary, audit findings, and working PDF download. |
