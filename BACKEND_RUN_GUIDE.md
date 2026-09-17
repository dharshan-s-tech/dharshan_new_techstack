# CAG Website - Backend Setup & Run Guide

This guide provides step-by-step instructions for running the FastAPI backend service to load live PostgreSQL database data into the frontend.

---

## 1. Prerequisites
- **Python 3.10+** installed
- **pip** package manager

---

## 2. Step-by-Step Instructions

### Step 1: Open Terminal & Navigate to `back_end` Directory
```bash
# From project root:
cd CAG_Website_v2/back_end
```

---

### Step 2: (Recommended) Create & Activate Virtual Environment

#### Windows (PowerShell):
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Windows (CMD):
```cmd
python -m venv venv
.\venv\Scripts\activate.bat
```

#### Linux / macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

> **Packages installed**: `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`, `sqlalchemy`, `psycopg2-binary`, `httpx`

---

### Step 4: Verify `.env` Database Configuration
Ensure the file `back_end/.env` exists with the following configuration:

```ini
DB_HOST=15.252.41.241
DB_PORT=5432
DB_NAME=cag_new
DB_USER=kreethi
DB_PASSWORD=kreethi@123
DB_SCHEMA=cag_revamp
SECURITY_SALT=c3fd7183d431b3f8967db69db1d089200427fa226185a9af60e16a1d19312368
ENCRYPTION_KEY=wt1U5MACWJFTXGenFoZosTtLGrCSdbHA
```

---

### Step 5: Start the Backend Server
Run the FastAPI application on **port 8000**:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 3. Verify Backend & Data Loading

1. **Interactive API Documentation (Swagger)**:
   Open in browser:
   👉 [http://localhost:8000/docs](http://localhost:8000/docs)

2. **Verify Live Data Endpoints**:
   - Audit Reports: [http://localhost:8000/api/reports](http://localhost:8000/api/reports)
   - Tenders: [http://localhost:8000/api/tenders](http://localhost:8000/api/tenders)
   - Circulars: [http://localhost:8000/api/circulars](http://localhost:8000/api/circulars)
   - Organisation Chart: [http://localhost:8000/api/officers/organisation-chart](http://localhost:8000/api/officers/organisation-chart)
   - Former CAGs: [http://localhost:8000/api/former-cag](http://localhost:8000/api/former-cag)

---

## 4. How Frontend & Backend Connect

```
┌───────────────────────────────┐         ┌───────────────────────────────┐         ┌───────────────────────────────┐
│       Next.js Frontend        │         │        FastAPI Backend        │         │      PostgreSQL Database      │
│     http://localhost:3333     │ ──────> │     http://127.0.0.1:8000     │ ──────> │      15.252.41.241:5432       │
│  (Proxies /api/* requests)    │         │  (Serves REST & CRUD APIs)    │         │     (Schema: cag_revamp)      │
└───────────────────────────────┘         └───────────────────────────────┘         └───────────────────────────────┘
```

- When the backend is running on `port 8000`, the Next.js frontend running on `port 3333` automatically proxies all `/api/*` requests to the backend and renders live database data.
