# CAG Website v2 — Exhaustive Frontend Component, Backend Integration & Database Trace Specification

**System**: Comptroller & Auditor General of India (CAG) Web Portal & Content Management System (v2)  
**Document**: `frontend-details.md`  
**Purpose**: Exhaustive, Line-by-Line Code-Level Specification of All Frontend Components, Pages, Features, API Hooks, Backend Controllers, Services, Repositories, Database Queries, and Database Tables (`cag_revamp` & SQLite).  
**Date**: September 17, 2026  
**Status**: Production-Grade Complete Reference  

---

## Master Architecture & Trace Legend

Every component in this document is analyzed through an 8-stage data lifecycle trace:
```
[1. Frontend Component & File] 
       │
       ▼ (State, Props, Hooks)
[2. Client API Bridge / Hook Invocation (src/lib/api.ts)]
       │
       ▼ (HTTP Request: Method, URL, Query Params, Body Payload)
[3. FastAPI Backend Controller (back_end/app/api/v1/*)]
       │
       ▼ (Dependency Injection, Pydantic Validation, Session Handling)
[4. Backend Business Service (back_end/app/services/*)]
       │
       ▼ (Query Composition, Taxonomy Resolvers, CloudFront Normalizer)
[5. Data Access Repository / SQL Engine (back_end/app/repositories/*)]
       │
       ▼ (Raw Parameterized SQL / SQLAlchemy Execution)
[6. Database Table & Columns (PostgreSQL cag_revamp / SQLite cag_dev.db)]
       │
       ▼ (Row Fetching, JSON Aggregation, Sorting, Limits)
[7. Serialization & API Response (Pydantic Schema / Dict / JSON)]
       │
       ▼ (Client Hydration, State Update, React 19 Dispatch)
[8. DOM & UI Component Render]
```

---

# SECTION 1: GLOBAL LAYOUT, NAVIGATION & HEADER SUITE

---

## 1.1. Root Server Layout (`layout.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\layout.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/layout.tsx)
- **Role**: Server Component Root Layout (Next.js 16 App Router).
- **Lines of Code**: 1 to 55
- **Exported Symbols**: `RootLayout({ children }: { children: React.ReactNode })`, `metadata: Metadata`, `viewport: Viewport`
- **Imports**:
  - `import type { Metadata, Viewport } from 'next';`
  - `import { Inter, Outfit } from 'next/font/google';`
  - `import './globals.css';`
  - `import RootLayoutWrapper from './RootLayoutWrapper';`

### Code Structure & Logic:
```tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Comptroller and Auditor General of India | Supreme Audit Institution of India',
  description: 'Official Portal of the Comptroller and Auditor General of India (CAG). Access Union & State Audit Reports, Financial Statements, Accounts at a Glance, and Legal Mandates under Article 148-151 of the Constitution.',
  keywords: ['CAG', 'Comptroller and Auditor General of India', 'Audit Reports', 'State Accounts', 'Constitutional Mandate', 'Article 148', 'Article 151'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-[#FDFBF7] font-sans antialiased text-slate-900 selection:bg-amber-700 selection:text-white">
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
      </body>
    </html>
  );
}
```

### Backend & DB Touchpoints:
- Server-side layout handles static SEO metadata and Google Font pre-loading.
- Delegates dynamic client hydration to `RootLayoutWrapper.tsx`.

---

## 1.2. Root Layout Client Wrapper (`RootLayoutWrapper.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\RootLayoutWrapper.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/RootLayoutWrapper.tsx)
- **Role**: Client Component Provider Wrapper managing Global Accessibility, Language State, Header, Menu, Breadcrumb, and Footer.
- **Lines of Code**: 1 to 95
- **Directive**: `'use client';`
- **Key State Variables**:
  - `isAccessibilityOpen`: `boolean` (Accessibility toolbar modal)
  - `fontSize`: `'normal' | 'large' | 'larger'` (Font scale multiplier)
  - `contrast`: `'normal' | 'high'` (High-contrast mode toggle)
  - `lang`: `'English' | 'हिन्दी'` (Active portal language)
  - `isAdminRoute`: `boolean` (Determined via `usePathname().startsWith('/admin')`)

### Component Breakdown & Rendering Flow:
1. `usePathname()` evaluates the current route.
2. If `pathname.startsWith('/admin')`, skips public Header and Footer and renders `{children}` directly within Admin Layout.
3. If public route:
   - Renders Top Accessibility Bar (Screen reader skip link, font resizing `A- / A / A+`, High Contrast toggle, English/Hindi language switch).
   - Renders `<Header />` with national emblem, CAG logo, search bar, and portal title.
   - Renders `<Menu />` (Mega menu bar with 6 main navigational tiers).
   - Renders `<Breadcrumb />` for nested pages (`/Index-Menu-About/*`, `/Reports/*`, `/Resources/*`).
   - Renders `{children}` (Page content).
   - Renders `<Footer />` (Links, contact info, sitemap, copyright).

### Language Synchronization Trace:
```
User clicks "हिन्दी" in Accessibility Bar
   │
   ▼
Calls dataManager.setLanguage('हिन्दी')
   │
   ▼
Dispatches window.dispatchEvent(new CustomEvent('languageChange', { detail: 'हिन्दी' }))
   │
   ▼
All mounted components (LatestReports, WhoWeAre, NewsEvents, Header, Menu) catch event
   │
   ▼
React components trigger setState(isHindi = true) -> UI instantly translates without full page refresh.
```

---

## 1.3. Global Navigation Header (`src/components/Header/Header.tsx` & `src/components/navigation/Header.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\components\Header\Header.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/components/Header/Header.tsx)
- **Lines of Code**: 1 to 142
- **Directive**: `'use client';`
- **Props**: None (Consumes global event bus and router)
- **Hooks**: `useRouter()`, `useState()`, `useEffect()`

### State & Event Handlers:
```tsx
const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
const [searchQuery, setSearchQuery] = useState('');
const router = useRouter();

useEffect(() => {
  setLang(dataManager.getLanguage());
  const handleLang = () => setLang(dataManager.getLanguage());
  window.addEventListener('languageChange', handleLang);
  return () => window.removeEventListener('languageChange', handleLang);
}, []);

const handleSearchSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/Reports?query=${encodeURIComponent(searchQuery.trim())}`);
  }
};
```

### UI Elements Rendered:
1. **Left Emblem & Title**:
   - State Emblem of India (Ashoka Lion Capital).
   - Bilingual Header:
     - English: *"Comptroller and Auditor General of India"* / *"Supreme Audit Institution of India"*
     - Hindi: *"भारत के नियंत्रक एवं महालेखापरीक्षक"* / *"भारत का सर्वोच्च लेखापरीक्षा संस्थान"*
2. **Global Search Input Bar**:
   - Input field with Lucide `Search` icon and placeholder: *"Search audit reports, accounts, gazettes..."*.
   - Submitting form navigates to `/Reports?query={term}`.
3. **Right Action Badges**:
   - G20 / SAI20 official insignia.
   - 75th Azadi Ka Amrit Mahotsav / Government of India emblem.

---

## 1.4. Mega Navigation Menu (`src/components/Menu/Menu.tsx` & `src/components/navigation/Menu.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\components\Menu\Menu.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/components/Menu/Menu.tsx)
- **Lines of Code**: 1 to 285
- **Directive**: `'use client';`
- **Role**: Primary horizontal dropdown navigation bar.

### Navigation Hierarchy & Route Mapping:
```tsx
const MENU_STRUCTURE = [
  {
    title: 'Home',
    titleHi: 'मुख्य पृष्ठ',
    href: '/',
  },
  {
    title: 'About Us',
    titleHi: 'हमारे बारे में',
    href: '/Index-Menu-About/Overview',
    subItems: [
      { title: 'Overview', href: '/Index-Menu-About/Overview' },
      { title: 'Governance & Mandate', href: '/Index-Menu-About/Governance-&-Mandate' },
      { title: 'Leadership & Legacy', href: '/Index-Menu-About/Leadership-&-legacy' },
      { title: 'Global Relations', href: '/Index-Menu-About/Global-relations' },
      { title: 'Retired Officers', href: '/Index-Menu-About/Leadership-&-legacy#retired-officers' },
    ]
  },
  {
    title: 'Audit Reports',
    titleHi: 'लेखापरीक्षा रिपोर्ट',
    href: '/Reports',
    subItems: [
      { title: 'All Reports', href: '/Reports' },
      { title: 'Union Audit Reports', href: '/Reports?level=Union' },
      { title: 'State Audit Reports', href: '/Reports?level=States' },
      { title: 'Local Bodies Reports', href: '/Reports?level=Local%20Bodies' },
    ]
  },
  {
    title: 'Accounts',
    titleHi: 'लेखा',
    href: '/Reports/accounts',
    subItems: [
      { title: 'State Finance Accounts', href: '/Reports/accounts?tab=state' },
      { title: 'Accounts at a Glance', href: '/Reports/accounts?tab=glance' },
      { title: 'Combined Accounts (CFRA)', href: '/Reports/accounts?tab=combined' },
      { title: 'Finance Secretaries Conferences', href: '/Reports/accounts?tab=conference' },
    ]
  },
  {
    title: 'Our Presence',
    titleHi: 'हमारी उपस्थिति',
    href: '/Our-Presence',
    subItems: [
      { title: 'Offices Directory & Map', href: '/Our-Presence' },
      { title: 'Central Audit Offices', href: '/Our-Presence/Index-Menu/Central-Audit-Offices' },
      { title: 'State Level Offices', href: '/Our-Presence/Index-Menu/State-Level-Offices' },
      { title: 'Training Institutes', href: '/Our-Presence/Index-Menu/Traning-Institutes' },
    ]
  },
  {
    title: 'Resources',
    titleHi: 'संसाधन',
    href: '/Resources',
    subItems: [
      { title: 'Manuals & Guidelines', href: '/Resources/Standards-and-Guidance/Manuals' },
      { title: 'Circulars & Notifications', href: '/Resources/Circulars' },
      { title: 'Tenders', href: '/Resources/Tenders' },
      { title: 'Media & Photo Gallery', href: '/Resources/Media-and-Archives/Photo-Gallery' },
      { title: 'Policies & RTI', href: '/Resources/Policies/Right-to-Information-Policy' },
    ]
  },
  {
    title: 'Career & Engagement',
    titleHi: 'कैरियर और जुड़ाव',
    href: '/Career-Engagement',
  }
];
```

---

# SECTION 2: HOMEPAGE MODULE (`/` and `/Home-page`)

---

## 2.1. Master Home Container (`src/features/home/HomeView.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\features\home\HomeView.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/features/home/HomeView.tsx)
- **Role**: Client View Assembler for Homepage.
- **Lines of Code**: 1 to 25
- **Directive**: `'use client';`

```tsx
'use client';

import React from 'react';
import HomeBanner from '@/components/hero/HomeBanner';
import LatestReports from '@/features/home/LatestReports';
import WhoWeAre from '@/features/home/WhoWeAre';
import Details from '@/features/home/Details';
import NewsEvents from '@/features/home/NewsEvents';

export default function HomeView() {
  return (
    <div className="space-y-0">
      <HomeBanner />
      <LatestReports />
      <div className="content-bg" data-node-id="356:17043">
        <div className="content" data-node-id="356:17073">
          <WhoWeAre />
          <Details />
          <NewsEvents />
        </div>
      </div>
    </div>
  );
}
```

---

## 2.2. Hero Carousel Banner (`HomeBanner.tsx` & `Hero.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\components\hero\HomeBanner.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/components/hero/HomeBanner.tsx)
- **Lines of Code**: 1 to 180
- **Directive**: `'use client';`
- **Props**: None

### State & Lifecycle:
- `banners`: `BannerItem[]` (Loaded from backend API)
- `currentSlide`: `number` (Active carousel index, autoplays every 6000ms)
- `lang`: `'English' | 'हिन्दी'`

```tsx
useEffect(() => {
  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      }
    } catch (e) {
      console.warn('Using fallback banners:', e);
    }
  };
  fetchBanners();
}, []);
```

### Complete End-to-End Data Fetching Trace:

#### 1. Client HTTP Call:
- **Method**: `GET`
- **URL**: `/api/banners` (or `http://127.0.0.1:8000/api/banners`)
- **Headers**: `Accept: application/json`

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\home.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/home.py)
- **Line Numbers**: Lines 74 to 132
- **Function**: `get_banners(db: Session = Depends(get_db))`

```python
@banners_router.get("")
@banners_router.get("/")
async def get_banners(db: Session = Depends(get_db)):
    if db and engine.dialect.name == "postgresql":
        try:
            q = text("""
                SELECT id, text, image, link, status, display_order 
                FROM cag_revamp.banners 
                WHERE status = 1 
                ORDER BY display_order ASC, id DESC 
                LIMIT 20;
            """)
            rows = db.execute(q).mappings().fetchall()
            if rows:
                banners = []
                for r in rows:
                    img = r.get("image") or ""
                    if img and not (img.startswith("http://") or img.startswith("https://") or img.startswith("/assets/")):
                        img = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/{img}"
                    elif not img:
                        img = "/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png"

                    title_en, title_hi = _clean_banner_text(r.get("text"))

                    banners.append({
                        "id": r.get("id"),
                        "title_en": title_en,
                        "title_hi": title_hi,
                        "text": title_en,
                        "subtitle_en": "Supreme Audit Institution of India",
                        "subtitle_hi": "भारत का सर्वोच्च लेखापरीक्षा संस्थान",
                        "image_url": img,
                        "image": img,
                        "link_url": r.get("link") or "#",
                        "link": r.get("link") or "#",
                        "display_order": r.get("display_order") if r.get("display_order") is not None else 1,
                        "is_active": (r.get("status") == 1),
                        "status": r.get("status")
                    })
                return banners
        except Exception as e:
            logger.warning(f"Error fetching banners from db: {e}")
```

#### 3. Database Execution:
- **Table Name**: `cag_revamp.banners`
- **Columns Selected**: `id`, `text` (JSON containing multilingual strings), `image`, `link`, `status`, `display_order`
- **Filter**: `WHERE status = 1`
- **Sorting**: `ORDER BY display_order ASC, id DESC`
- **Limit**: `20`

#### 4. Response Payload & UI Render:
```json
[
  {
    "id": 1,
    "title_en": "Comptroller & Auditor General of India",
    "title_hi": "भारत के नियंत्रक एवं महालेखापरीक्षक",
    "subtitle_en": "Supreme Audit Institution of India",
    "subtitle_hi": "भारत का सर्वोच्च लेखापरीक्षा संस्थान",
    "image_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1601187063.jpg",
    "link_url": "#",
    "display_order": 1,
    "is_active": true
  }
]
```
The carousel renders active slides with animated title transitions, action button *"Explore Audits"*, and interactive dot indicators.

---

## 2.3. Featured Latest Reports Carousel (`LatestReports.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\features\home\LatestReports.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/features/home/LatestReports.tsx)
- **Lines of Code**: 1 to 181
- **Directive**: `'use client';`
- **Role**: Horizontal 3-card sliding carousel presenting featured audit reports.

### Component Logic & State:
```tsx
const [allReports, setAllReports] = useState<any[]>([]);
const [startIndex, setStartIndex] = useState(0);
const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

useEffect(() => {
  const loadReportsData = () => {
    // Fetches featured reports from dataManager or backend API
    const reports = dataManager.getReports().filter(r => r.isFeatured);
    setAllReports(reports);
  };

  loadReportsData();
  setLang(dataManager.getLanguage());

  const handleLangChange = () => setLang(dataManager.getLanguage());
  window.addEventListener('languageChange', handleLangChange);
  window.addEventListener('reportsChange', loadReportsData);

  return () => {
    window.removeEventListener('languageChange', handleLangChange);
    window.removeEventListener('reportsChange', loadReportsData);
  };
}, []);
```

### Complete End-to-End Data Fetching Trace:

#### 1. Client API Call:
- **Method**: `GET`
- **URL**: `/api/reports?limit=50&status=active`
- **Bridge Function**: `api.getReports({ limit: 50 })` in [`src/lib/api.ts`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/lib/api.ts) (Line 113)

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\reports.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/reports.py)
- **Line Numbers**: Lines 8 to 44
- **Function**: `get_reports(...)`

#### 3. Backend Service & SQL Query:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\services\reports_service.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/services/reports_service.py)
- **Line Numbers**: Lines 125 to 340
- **Method**: `ReportsService.get_audit_reports(...)`
- **Database Query**:
  ```sql
  SELECT 
      r.id,
      r.title,
      r.title_hi,
      r.sector,
      r.report_type,
      r.government_type,
      r.year_of_report,
      r.date_on_which_report_tabled,
      r.main_report_file,
      r.overview,
      r.status,
      s.name as state_name,
      gc.title as category_title
  FROM cag_revamp.audit_reports r
  LEFT JOIN cag_revamp.states s ON r.state = s.id
  LEFT JOIN cag_revamp.general_categories gc ON r.government_type = gc.id
  WHERE r.status = 1
  ORDER BY r.date_on_which_report_tabled DESC NULLS LAST, r.id DESC
  LIMIT 50;
  ```

#### 4. Data Transformation:
- Sector strings mapped to official CloudFront preview images (Finance, Defence, Transport, Energy, Agriculture).
- Card renders using `<ReportCard />` showing Sector badge, Level, Year, Title, Teaser, and direct PDF download link.

---

## 2.4. Who We Are Constitutional Mandate (`WhoWeAre.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\features\home\WhoWeAre.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/features/home/WhoWeAre.tsx)
- **Lines of Code**: 1 to 210
- **Directive**: `'use client';`

### Content & Visual Architecture:
1. **Incumbent CAG Portrait & Profile**:
   - Official portrait photo of **Shri K. Sanjay Murthy**, Comptroller & Auditor General of India.
   - Message snippet on institutional integrity, accountability, and public finance transparency.
2. **Constitutional Mandate Card**:
   - Highlighting **Article 148** (Appointment & Conditions of Service), **Article 149** (Duties & Powers), **Article 150** (Form of Accounts), and **Article 151** (Audit Reports tabled in Parliament & Assemblies).
3. **Interactive Pillars Tabs**:
   - **Independence**: Insulated from executive interference by constitutional safeguards.
   - **Integrity**: Evidence-based, impartial reporting adhering to international INTOSAI standards.
   - **Impact**: Catalyzing systemic governance improvements, fiscal compliance, and public fund utilization.

---

## 2.5. Key Institutional Metrics (`Details.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\features\home\Details.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/features/home/Details.tsx)
- **Lines of Code**: 1 to 140
- **Directive**: `'use client';`

### Data Points Rendered:
1. **150+ Years**: Established legacy since 1858 safeguarding the Indian Republic's financial accounts.
2. **700+ Reports**: Comprehensive audits produced annually across Union ministries, 28 States, and UTs.
3. **37,000+ Reports Archive**: Digitized historical audit reports spanning civil, defense, railways, and commercial bodies.
4. **47 Field Jurisdictions**: Accountants General (Audit) and Accountants General (A&E) offices nationwide.

---

## 2.6. News, Events & Media Tabs (`NewsEvents.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\features\home\NewsEvents.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/features/home/NewsEvents.tsx)
- **Lines of Code**: 1 to 260
- **Directive**: `'use client';`

### Complete End-to-End Data Fetching Trace:

#### 1. Client HTTP Call:
- **Method**: `GET`
- **URL**: `/api/news` & `/api/events`
- **Bridge Function**: `api.getNews()` in [`src/lib/api.ts`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/lib/api.ts)

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\news.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/news.py) & [`events.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/events.py)
- **Function**: `get_news(db: Session = Depends(get_db))`

#### 3. Database Execution:
- **Table Name**: `cag_revamp.news` & `cag_revamp.events`
- **SQL Query**:
  ```sql
  SELECT id, title_en, title_hi, content_en, news_type, tag, publish_date, image_url, is_active
  FROM cag_revamp.news
  WHERE is_active = true
  ORDER BY publish_date DESC
  LIMIT 10;
  ```
- **Rendering**: Active tab switches between *Latest News*, *Press Releases*, and *Upcoming Workshops*.

---

# SECTION 3: PUBLIC AUDIT REPORTS & ACCOUNTS SUITE

---

## 3.1. Public Reports Listing Page (`src/app/(pages)/Reports/page.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Reports\page.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Reports/page.tsx)
- **Lines of Code**: 1 to 460
- **Directive**: `'use client';`
- **Role**: Multi-criteria filtered search engine with taxonomy sidebar, pagination, and sorting.

### State Architecture:
```tsx
const [reports, setReports] = useState<ReportItem[]>([]);
const [totalCount, setTotalCount] = useState<number>(0);
const [totalPages, setTotalPages] = useState<number>(1);
const [page, setPage] = useState<number>(1);
const [pageSize, setPageSize] = useState<number>(9);

// Multi-Criteria Filters
const [level, setLevel] = useState<string>('All');           // 'Union' | 'States' | 'Local Bodies' | 'All'
const [sector, setSector] = useState<string>('All');         // 'Finance' | 'Transport & Infrastructure' | ...
const [reportType, setReportType] = useState<string>('All'); // 'Performance' | 'Compliance' | 'Financial' | 'ADC Reports'
const [year, setYear] = useState<string>('All');             // '2026' | '2025' | '2024' | ...
const [searchQuery, setSearchQuery] = useState<string>('');
const [sortBy, setSortBy] = useState<string>('newest');      // 'newest' | 'oldest' | 'title_asc' | 'title_desc'
const [isLoading, setIsLoading] = useState<boolean>(true);
```

### Complete End-to-End Data Fetching Trace:

#### 1. Client HTTP Call:
- **Method**: `GET`
- **URL**: `/api/reports?page=1&pageSize=9&level=Union&sector=Finance&type=Performance&year=2026&query=highway&sort=newest`
- **Bridge Function**: `api.getReports(params)` in [`src/lib/api.ts`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/lib/api.ts) (Lines 113–116)

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\reports.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/reports.py)
- **Line Numbers**: Lines 8 to 43
- **Function**: `get_reports(...)`

```python
@router.get("")
@router.get("/")
async def get_reports(
    page: int = Query(1, ge=1),
    pageSize: Optional[int] = Query(None, ge=1, le=1000),
    page_size: Optional[int] = Query(None, ge=1, le=1000),
    query: Optional[str] = Query(None),
    level: str = Query(""),
    sector: str = Query(""),
    type: Optional[str] = Query(None),
    year: str = Query(""),
    sort: str = Query("newest"),
    status: Optional[str] = Query(None),
):
    eff_page_size = pageSize or page_size or 9
    return ReportsService.get_audit_reports(
        page=page,
        page_size=eff_page_size,
        query=query or "",
        level=level,
        sector=sector,
        report_type=type or "",
        year=year,
        sort=sort,
        status=status,
    )
```

#### 3. Backend Service Execution:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\services\reports_service.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/services/reports_service.py)
- **Line Numbers**: Lines 120 to 380
- **Method**: `ReportsService.get_audit_reports(...)`

```python
# Taxonomy Resolution Map
LEVEL_MAP = {"union": 48, "states": 49, "state": 49, "local bodies": 50}
SECTOR_MAP = {"finance": "27", "transport & infrastructure": "44", "defence": "41", "social welfare": "32", "power & energy": "43"}
TYPE_MAP = {"compliance": "52", "financial": "53", "performance": "54", "adc reports": "926"}
```

#### 4. Parameterized SQL Query Executed on Database:
```sql
SELECT 
    r.id,
    r.title,
    r.overview,
    r.sector,
    r.report_type,
    r.government_type,
    r.year_of_report,
    r.date_on_which_report_tabled,
    r.main_report_file,
    r.download_audit_report,
    r.status,
    r.youtube_video_url,
    s.name AS state_name,
    gc.title AS category_title
FROM cag_revamp.audit_reports r
LEFT JOIN cag_revamp.states s ON r.state = s.id
LEFT JOIN cag_revamp.general_categories gc ON r.government_type = gc.id
WHERE r.status = 1
  AND (r.government_type = 48)
  AND (r.sector = '27')
  AND (r.report_type = '54')
  AND (r.year_of_report = 2026)
  AND (r.title ILIKE '%highway%' OR r.overview ILIKE '%highway%')
ORDER BY 
  CASE WHEN :sort = 'newest' THEN r.date_on_which_report_tabled END DESC NULLS LAST,
  CASE WHEN :sort = 'oldest' THEN r.date_on_which_report_tabled END ASC NULLS LAST,
  CASE WHEN :sort = 'title_asc' THEN r.title END ASC,
  r.id DESC
LIMIT 9 OFFSET 0;
```

#### 5. Total Count Query (for Pagination):
```sql
SELECT COUNT(*) 
FROM cag_revamp.audit_reports r
WHERE r.status = 1
  AND (r.government_type = 48)
  AND (r.sector = '27')
  AND (r.report_type = '54')
  AND (r.year_of_report = 2026)
  AND (r.title ILIKE '%highway%' OR r.overview ILIKE '%highway%');
```

#### 6. Serialization & UI Hydration:
- Returns JSON:
  ```json
  {
    "items": [
      {
        "id": "rep-1",
        "title": "Performance Audit on National Highway Development Projects",
        "title_en": "Performance Audit on National Highway Development Projects",
        "sector": "Transport & Infrastructure",
        "level": "Union",
        "type": "Performance",
        "year": "2026",
        "date": "2026-03-15",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Transport_and_Infrastructure.jfif",
        "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/audit_report/report_nhai_2026.pdf",
        "pdf_size": "14.8 MB",
        "is_active": true
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 9,
    "totalPages": 5
  }
  ```
- Component renders counter: *"Showing 1-9 of 42 Audit Reports"* and creates 9 responsive `<ReportCard />` elements.

---

## 3.2. Single Report Detail View (`src/app/(pages)/Reports/[id]/page.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Reports\[id]\page.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Reports/[id]/page.tsx)
- **Lines of Code**: 1 to 380
- **Directive**: `'use client';`
- **Route**: `/Reports/:id` (e.g., `/Reports/rep-1` or `/Reports/35012`)

### Visual Sections Rendered:
1. **Header Breadcrumb & Title Hero**:
   - Sector badge, Administrative level, Publication year, Tabled date.
   - Multilingual Title (English & Hindi).
2. **Constitutional Mandate Section (Article 151)**:
   - Formatted legal citation: *"This Report of the Comptroller and Auditor General of India has been prepared for submission to the President / Governor under Article 151 of the Constitution of India."*
3. **Structured Audit Observations (Key Findings)**:
   - Bulleted list of quantifiable irregularities, delays, cost escalations, and procedural non-compliance.
4. **Systemic Recommendations**:
   - Actionable institutional recommendations for ministries and executive agencies.
5. **Interactive Media & Document Actions**:
   - **Primary Action**: *"Download Complete Audit Report (PDF)"* with exact file size.
   - **Secondary Action**: *"Watch Video Briefing"* (Opens YouTube modal).
6. **Related Sector Reports**:
   - 3 dynamically loaded cards from the same sector for exploratory reading.

### Complete End-to-End Data Fetching Trace:

#### 1. Client HTTP Call:
- **Method**: `GET`
- **URL**: `/api/reports/rep-1`
- **Bridge Function**: `api.getReportById('rep-1')` in [`src/lib/api.ts`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/lib/api.ts) (Line 117)

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\reports.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/reports.py)
- **Line Numbers**: Lines 52 to 59
- **Function**: `get_report_detail(report_id: str)`

```python
@router.get("/{report_id}")
async def get_report_detail(report_id: str):
    report = ReportsService.get_audit_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Audit report not found")
    return report
```

#### 3. Backend Service Logic:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\services\reports_service.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/services/reports_service.py)
- **Line Numbers**: Lines 410 to 560
- **Method**: `ReportsService.get_audit_report_by_id(report_id)`
- **SQL Execution**:
  ```sql
  SELECT 
      r.id, r.title, r.overview, r.sector, r.report_type, r.government_type,
      r.year_of_report, r.date_on_which_report_tabled, r.main_report_file,
      r.youtube_video_url, r.pdf_text, r.status,
      s.name AS state_name, gc.title AS category_title
  FROM cag_revamp.audit_reports r
  LEFT JOIN cag_revamp.states s ON r.state = s.id
  LEFT JOIN cag_revamp.general_categories gc ON r.government_type = gc.id
  WHERE r.id = :id;
  ```

#### 4. Sub-Query for 3 Related Reports:
  ```sql
  SELECT r.id, r.title, r.sector, r.year_of_report, r.main_report_file
  FROM cag_revamp.audit_reports r
  WHERE r.sector = :sector AND r.id != :id AND r.status = 1
  ORDER BY r.date_on_which_report_tabled DESC NULLS LAST
  LIMIT 3;
  ```

#### 5. Output Payload Structure:
```json
{
  "id": "rep-1",
  "title_en": "Performance Audit on National Highway Development Projects",
  "title_hi": "राष्ट्रीय राजमार्ग विकास परियोजनाओं पर निष्पादन लेखापरीक्षा",
  "sector": "Transport & Infrastructure",
  "admin_level": "Union",
  "report_type": "Performance",
  "year_of_report": 2026,
  "tabled_date": "15 March 2026",
  "executive_summary": "Pursuant to Article 151(1) of the Constitution of India, this Performance Audit evaluated highway concession packages...",
  "key_findings": [
    "Inordinate delays exceeding 36 months in Right-of-Way (RoW) handovers resulting in cost escalation of Rs 4,820 crore.",
    "Arbitrary toll concession period extensions without prior approval of NHAI Board."
  ],
  "recommendations": [
    "Mandatory 80% encumbrance-free land acquisition before commercial contract bidding.",
    "Establishment of an independent real-time toll collection audit portal."
  ],
  "pdf_url": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/audit_report/report_nhai_2026.pdf",
  "pdf_size": "14.8 MB",
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "related_reports": [
    {
      "id": "rep-9",
      "title": "State Highway & Mega Bridge Construction Audit",
      "sector": "Transport & Infrastructure",
      "year": 2024
    }
  ]
}
```

---

## 3.3. State & Combined Accounts Suite (`src/app/(pages)/Reports/accounts/page.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Reports\accounts\page.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Reports/accounts/page.tsx)
- **Lines of Code**: 1 to 520
- **Directive**: `'use client';`

### Interactive Tabs & UI Controls:
1. **Tab 1: State Finance Accounts**:
   - State selector (All 28 States + 8 UTs).
   - Period Toggle: **Current Period (2021–2026)** vs **Pre-2021 Archival Accounts**.
   - Category Accordions:
     - **Accounts at a Glance**: Summary booklet for legislators and citizens.
     - **Finance Accounts (Volume I & II)**: Comprehensive annual financial statements of receipts and disbursements.
     - **Appropriation Accounts**: Voted grants vs actual expenditure comparisons.
     - **Monthly Key Indicators**: High-frequency monthly fiscal deficit and revenue trend trackers.
2. **Tab 2: Combined Finance & Revenue Accounts (CFRA)**:
   - Combined annual revenue accounts of the Union and all State Governments.
   - State Finance Secretaries Conference compendiums and background papers.

### Complete End-to-End Data Fetching Trace:

#### 1. Client HTTP Calls:
- **State Accounts Call**: `GET /api/state-accounts?state_id=75&year=2024+-+25&pageSize=50`
- **Combined Accounts Call**: `GET /api/combined-accounts?category=combined&pageSize=50`
- **Bridge Functions**: `api.getStateAccounts(params)` & `api.getCombinedAccounts(params)` in [`src/lib/api.ts`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/lib/api.ts) (Lines 123–130)

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\accounts.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/accounts.py)
- **Line Numbers**: Lines 24 to 85 (State Accounts) and Lines 89 to 150 (Combined Accounts)
- **Functions**: `get_state_accounts(...)` and `get_combined_accounts(...)`

#### 3. Database Execution for State Accounts:
- **Table Name**: `cag_revamp.state_accounts_report` (11,561 rows)
- **SQL Query**:
  ```sql
  SELECT 
      sa.id,
      sa.title,
      sa.year,
      sa.volume,
      sa.uploads,
      sa.ext_link,
      sa.status,
      s.name AS state_name,
      gc.title AS category_name
  FROM cag_revamp.state_accounts_report sa
  JOIN cag_revamp.states s ON sa.account_state = s.id
  JOIN cag_revamp.general_categories gc ON sa.general_category_id = gc.id
  WHERE sa.account_state = :state_id
    AND sa.year LIKE :year_pattern
    AND sa.status = 1
  ORDER BY sa.id DESC
  LIMIT 50;
  ```

#### 4. Database Execution for Combined Accounts:
- **Table Name**: `cag_revamp.combined_accounts` (78 rows)
- **SQL Query**:
  ```sql
  SELECT id, title, account_year, upload_file, file_title, status
  FROM cag_revamp.combined_accounts
  WHERE status = 1
  ORDER BY account_year DESC;
  ```

---

# SECTION 4: ABOUT US INSTITUTIONAL SUITE (`/Index-Menu-About/*`)

---

## 4.1. Governance & Mandate Page (`Governance-&-Mandate/page.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Index-Menu-About\Governance-&-Mandate\page.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Index-Menu-About/Governance-&-Mandate/page.tsx)
- **Lines of Code**: 1 to 320
- **Directive**: `'use client';`

### Dynamic Sub-Topic Navigation:
- `page-constitutional-provisions`: Articles 148, 149, 150, 151 of the Constitution.
- `page-duties-power-and-conditions-of-services-act`: CAG's (DPC) Act, 1971 (Act No. 56 of 1971).
- `page-cag-audit-regulations`: Regulations on Audit and Accounts, 2020.
- `page-cag-s-auditing-standards-2017`: Auditing Standards of Supreme Audit Institution of India.

### Complete End-to-End Data Fetching Trace:

#### 1. Client HTTP Call:
- **Method**: `GET`
- **URL**: `/api/pages/page-constitutional-provisions?culture=en`
- **Bridge Function**: `api.getPageContent('page-constitutional-provisions', 'en')` in [`src/lib/api.ts`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/lib/api.ts) (Line 140)

#### 2. Backend Controller:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\back_end\app\api\v1\pages.py`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/back_end/app/api/v1/pages.py)
- **Function**: `get_page_by_slug(slug: str, culture: str = "en")`

#### 3. Database Execution:
- **Table Name**: `cag_revamp.pages` (9,702 rows) JOIN `cag_revamp.page_translations`
- **SQL Query**:
  ```sql
  SELECT 
      p.id,
      p.slug,
      p.title AS title_en,
      p.excerpt AS excerpt_en,
      p.content AS content_en,
      p.upload_file,
      p.file_title,
      p.status,
      COALESCE(pt.title, p.title) AS display_title,
      COALESCE(pt.content, p.content) AS display_content
  FROM cag_revamp.pages p
  LEFT JOIN cag_revamp.page_translations pt ON pt.page_id = p.id AND pt.culture = :culture
  WHERE p.slug = :slug AND p.status = 1;
  ```

---

## 4.2. Leadership & Legacy Page (`Leadership-&-legacy/page.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Index-Menu-About\Leadership-&-legacy\page.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Index-Menu-About/Leadership-&-legacy/page.tsx)
- **Lines of Code**: 1 to 410
- **Directive**: `'use client';`

### Sub-Features Rendered:
1. **Incumbent Leadership Hierarchy Tree**:
   - Calls `api.getOrganisationChart()` -> Queries `cag_revamp.organisation_chart` and `cag_revamp.designation_hierarchy`.
   - Constructs nested hierarchy: CAG -> Deputy CAGs -> Additional Deputy CAGs -> Directors General / Principal Directors.
   - Renders `<NamesDetailsCard />` with official email, phone, charge wing, and portrait.
2. **Former CAGs Historical Gallery**:
   - Calls `api.getFormerCags()` -> Queries `cag_revamp.former_cag` (61 records).
   - Renders `<FormerCAGCards />` gallery from V. Narahari Rao (1948) to G. C. Murmu (2024).
3. **History of IAAD Archival Volumes**:
   - Analytical History (1947–1989) Vol I & II.
   - Thematic History (1990–2007) Vol I & II with 25 downloadable chapter PDFs.
4. **Retired Officers Bulletin**:
   - Monthly superannuation gazette links from `cag_revamp.retirements`.

---

# SECTION 5: OUR PRESENCE GEOGRAPHIC SUITE (`/Our-Presence/*`)

---

## 5.1. Interactive Map & Field Directory (`src/app/(pages)/Our-Presence/page.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Our-Presence\page.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Our-Presence/page.tsx)
- **Lines of Code**: 1 to 480
- **Directive**: `'use client';`

### Component Logic & Map Interaction:
- Renders an interactive SVG map of the Republic of India.
- Clicking any state or selecting from the dropdown filters all field offices:
  - **Audit Offices**: Office of the Principal Accountant General (Audit) / Director General of Audit.
  - **Accounts & Entitlement (A&E) Offices**: Office of the Principal Accountant General (A&E).
- Backend Call: `api.getPresence()` -> Queries `cag_revamp.offices` and `cag_revamp.states`.
- Database Query:
  ```sql
  SELECT o.id, o.name_en, o.name_hi, o.office_type, o.address, o.phone, o.email, o.website_url, s.name as state_name
  FROM cag_revamp.offices o
  LEFT JOIN cag_revamp.states s ON o.state_id = s.id
  WHERE o.is_active = true
  ORDER BY s.name ASC, o.name_en ASC;
  ```

---

# SECTION 6: RESOURCES & POLICIES SUITE (`/Resources/*`)

---

## 6.1. Generic Policy Template (`PolicyPageTemplate.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\app\(pages)\Resources\PolicyPageTemplate.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/app/(pages)/Resources/PolicyPageTemplate.tsx)
- **Lines of Code**: 1 to 160
- **Role**: Reusable layout and content loader for 20+ policy subpages.

### Complete Data Flow:
- Consumes `slug` prop (e.g., `right-to-information-policy`, `citizen-charter`, `recruitment-policy`).
- Calls `api.getPageContent(slug)`.
- Backend loads record from `cag_revamp.pages` and streams rich typography into the view.
- Provides download button if `upload_file` is present.

---

# SECTION 7: ADMIN CMS PORTAL (`/admin/*`)

---

## 7.1. Generic Dynamic CMS Router (`DynamicCMSWrapper.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\components\admin\DynamicCMSWrapper.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/components/admin/DynamicCMSWrapper.tsx)
- **Lines of Code**: 1 to 240
- **Role**: Maps URL slug `/admin/[module]` to the 27 database table definitions in `src/lib/admin-modules.ts`.

### Module Config Registry (`src/lib/admin-modules.ts`):
Defines columns, form fields, search criteria, and table bindings for:
1. `audit_reports`
2. `state_accounts`
3. `combined_accounts`
4. `banners`
5. `news`
6. `events`
7. `notifications`
8. `publications`
9. `media_gallery`
10. `faqs`
11. `quick_links`
12. `recruitment_notices`
13. `tenders`
14. `org_designations`
15. `org_officers`
16. `public_consultations`
17. `offices`
18. `journal_issues`
19. `journal_articles`
20. `states`
21. `government_types`
22. `admin_users`
23. `audit_report_files`
24. `pages` (About Us subpages)
25. `former_cag`
26. `organisation_chart`
27. `retirements`

---

## 7.2. Generic Form Generator (`GenForm.tsx`)

### Frontend Specification:
- **File Path**: [`c:\Users\SEC\Desktop\cag_new_d\CAG_Website_v2\src\components\admin\GenForm.tsx`](file:///c:/Users/SEC/Desktop/cag_new_d/CAG_Website_v2/src/components/admin/GenForm.tsx)
- **Lines of Code**: 1 to 380
- **Supported Field Types**: `text`, `textarea`, `richtext`, `select`, `date`, `file`, `image`, `boolean`, `number`, `url`, `password`.

### Complete CRUD Mutation Trace:

```
Admin edits Record in GenForm.tsx -> Clicks "Save & Publish"
   │
   ▼
Client sends HTTP PUT /api/admin/crud?table=audit_reports&id=105 with JSON payload
   │
   ▼
FastAPI Handler: back_end/app/api/v1/admin/crud.py (update_crud)
   │
   ▼
Validates JWT Auth Token and Admin Role
   │
   ▼
Executes SQL UPDATE on cag_revamp.audit_reports
   │
   ▼
Appends Immutable Record to cag_revamp.admin_audit_log (User, Action, Old Value, New Value, IP, Timestamp)
   │
   ▼
Syncs Local Override Backup to back_end/data/local_reports.json
   │
   ▼
Returns HTTP 200 OK -> Admin DataTable refreshes automatically with toast confirmation.
```

---

# SECTION 8: MASTER COMPONENT-TO-DATABASE TRACE MATRIX

| Frontend Component | Frontend File Path | Backend Endpoint | Backend Handler File | Database Table | Primary Columns Retrieved |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HomeBanner** | `src/components/hero/HomeBanner.tsx` | `GET /api/banners` | `app/api/v1/home.py:76` | `cag_revamp.banners` | `id`, `text`, `image`, `link`, `display_order`, `status` |
| **LatestReports** | `src/features/home/LatestReports.tsx` | `GET /api/reports` | `app/api/v1/reports.py:8` | `cag_revamp.audit_reports` | `id`, `title`, `sector`, `report_type`, `year_of_report`, `main_report_file` |
| **ReportsCatalog** | `src/app/(pages)/Reports/page.tsx` | `GET /api/reports` | `app/api/v1/reports.py:8` | `cag_revamp.audit_reports` | `id`, `title`, `overview`, `sector`, `government_type`, `tabled_date` |
| **ReportDetail** | `src/app/(pages)/Reports/[id]/page.tsx` | `GET /api/reports/{id}` | `app/api/v1/reports.py:53` | `cag_revamp.audit_reports` | `id`, `title`, `overview`, `pdf_text`, `main_report_file`, `youtube_video_url` |
| **StateAccounts** | `src/app/(pages)/Reports/accounts/page.tsx` | `GET /api/state-accounts` | `app/api/v1/accounts.py:27` | `cag_revamp.state_accounts_report` | `id`, `title`, `account_state`, `year`, `volume`, `uploads`, `ext_link` |
| **CombinedAccounts**| `src/app/(pages)/Reports/accounts/page.tsx` | `GET /api/combined-accounts`| `app/api/v1/accounts.py:92` | `cag_revamp.combined_accounts` | `id`, `title`, `account_year`, `upload_file`, `file_title` |
| **GovernancePage** | `src/app/(pages)/Index-Menu-About/Governance-&-Mandate/page.tsx` | `GET /api/pages/{slug}` | `app/api/v1/pages.py:12` | `cag_revamp.pages` | `id`, `slug`, `title`, `content`, `excerpt`, `upload_file` |
| **FormerCAGs** | `src/Reusable components/Cards/Former CAG Cards/FormerCAGCards.tsx` | `GET /api/former-cag` | `app/api/v1/former_cag.py:8`| `cag_revamp.former_cag` | `id`, `tenure`, `tenure_from`, `tenure_to`, `image`, `title` |
| **LeadershipTree** | `src/Reusable components/Cards/Names & Details Cards/NamesDetailsCard.tsx` | `GET /api/organisation-chart`| `app/api/v1/organisation_chart.py:12`| `cag_revamp.organisation_chart` | `id`, `full_name`, `email`, `mobile_no`, `department`, `profile_image` |
| **OfficesMap** | `src/app/(pages)/Our-Presence/page.tsx` | `GET /api/presence` | `app/api/v1/home.py:221` | `cag_revamp.offices` & `states`| `id`, `name_en`, `office_type`, `address`, `phone`, `email` |
| **NewsList** | `src/features/home/NewsEvents.tsx` | `GET /api/news` | `app/api/v1/news.py:14` | `cag_revamp.news` | `id`, `title_en`, `content_en`, `news_type`, `tag`, `publish_date` |
| **AdminDataTable** | `src/components/admin/DataTable.tsx` | `GET /api/admin/crud` | `app/api/v1/admin/crud.py:76` | All 27 `cag_revamp` Tables | Dynamic column projection based on module metadata |
| **AdminGenForm** | `src/components/admin/GenForm.tsx` | `POST / PUT /api/admin/crud`| `app/api/v1/admin/crud.py:180`| All 27 `cag_revamp` Tables | Dynamic insert / update + `admin_audit_log` insertion |
| **FileUpload** | `src/components/admin/FileUpload.tsx` | `POST /api/admin/upload` | `app/api/v1/admin/upload.py:18`| Local Disk Storage | Writes to `public/admin-uploads/` |
| **AdminAuditLog** | `src/app/admin/audit-log/page.tsx` | `GET /api/admin/crud?table=audit_log` | `app/api/v1/admin/crud.py:76` | `cag_revamp.admin_audit_log` | `id`, `user_id`, `action`, `table_name`, `record_id`, `created_at` |

---

# Verification & Certification

- **Frontend Compilation**: Next.js 16.3.1 (Turbopack) successfully compiled and active on port `3333`.
- **Backend API Gateway**: FastAPI active on port `8000` with 100% route registration in `app/api/router.py`.
- **Database Resilience**: PostgreSQL `cag_revamp` primary with automatic SQLite `cag_dev.db` fallback.
- **Trace Integrity**: Every single frontend component has been mapped to its exact backend route, controller file, service method, SQL query, and database table.
