# CAG Website - Frontend Functionalities & Code Mechanics Guide (About Us Pages)

Welcome to the comprehensive frontend developer guide for the **CAG Website (Version 2)** project. This document provides a simple, beginner-friendly explanation of how the frontend works, the **exact major code blocks solely responsible for each page**, and **how pages fetch data and connect with each other**.

---

## 1. How Pages Connect With Each Other & Fetch Data

### A. Navigation & Inter-Page Connections
Pages in this application are connected through three primary mechanisms:

1. **Next.js `Link` Navigation (`next/link`)**:
   Used in navigation components like [AboutusSidemenu.tsx](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/Reusable%20components/Side%20Menu/Aboutus_sidemenu/AboutusSidemenu.tsx) and header mega-menus. Clicking a link triggers instant client-side transitions without refreshing the browser:
   ```tsx
   <Link href="/About/About-Us/Cag-Of-India" className="hover:text-[#751639]">
     CAG of India
   </Link>
   ```

2. **Programmatic Router Navigation (`useRouter()`)**:
   Used in interactive elements like the Header search bar or cards to push users to target pages dynamically:
   ```tsx
   const router = useRouter();
   const executeSearch = () => {
     if (searchVal.trim()) {
       router.push(`/Reports?query=${encodeURIComponent(searchVal.trim())}`);
     }
   };
   ```

3. **Global App Shell & Route Scoping ([RootLayoutWrapper.tsx](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/RootLayoutWrapper.tsx))**:
   The root layout checks the active route path using `usePathname()`. If the user is on standard pages, it renders global `Header` & `Footer`. If the user visits `/admin/*` or `/states/*`, it bypasses global headers to render an isolated administration or state subsite header.

---

### B. Data Fetching & Event-Driven Real-Time Synchronization

Data fetching in this project operates on two levels:

1. **Local Data & Admin Sync (`src/lib/dataManager.ts`)**:
   - For all About Us pages, content can be modified via the Admin CMS (`/admin`).
   - Content is stored in `localStorage` with fallback defaults (`DEFAULT_CAG_PROFILE`, `DEFAULT_ORG_OFFICERS`, etc.).
   - Whenever data or language changes, `dataManager` fires a custom browser event:
     ```typescript
     // Inside dataManager.ts
     setLanguage(lang: 'English' | 'हिन्दी') {
       localStorage.setItem('cag_language', lang);
       window.dispatchEvent(new Event('languageChange')); // Triggers real-time update
     }
     ```
   - Pages listen for this event in a React `useEffect` hook to update UI instantly without reloading:
     ```tsx
     useEffect(() => {
       setLang(dataManager.getLanguage());
       const handleLangChange = () => setLang(dataManager.getLanguage());
       window.addEventListener('languageChange', handleLangChange);
       return () => window.removeEventListener('languageChange', handleLangChange);
     }, []);
     ```

2. **Backend API Integration (`src/lib/api.ts`)**:
   - For live dynamic endpoints (e.g. State Subsites or Reports catalog), frontend methods call the Python FastAPI backend (running on port `8000`) using standard HTTP `fetch()`:
     ```typescript
     export const api = {
       async getStateSubsite(slug: string): Promise<StateSubsiteResponse> {
         const res = await fetch(`http://localhost:8000/api/states/${slug}`, { cache: 'no-store' });
         if (!res.ok) throw new Error('Failed to fetch state subsite');
         return res.json();
       }
     };
     ```

---

## 2. Major Code Blocks Solely Responsible For Each Page

---

### Page 1: CAG of India
* **File Path**: [`src/app/(pages)/About-Us/Cag-Of-India/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Cag-Of-India/page.tsx)
* **Core Responsible Code**: Profile card banner rendering with custom SVG slanted vector geometry.

```tsx
{/* Major Code Block: Figma Profile Card Banner with SVG Background Blur Geometry */}
<div 
  className="relative w-full max-w-[978px] h-[200px] bg-white rounded-lg border border-[#EAEAEA] shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden flex items-center px-6 gap-6 mb-8 shrink-0"
>
  {/* Right Side Background Geometric Pattern */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
    <svg viewBox="0 0 978 200" className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none">
      <defs>
        <filter id="ellipse-blur-2" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="35" />
        </filter>
      </defs>
      <ellipse cx="1013" cy="231" rx="199.28" ry="189.5" fill="rgba(222, 222, 222, 0.7)" filter="url(#ellipse-blur-2)" />
      {/* Slanted Parallel Rectangles */}
      <g transform="skewX(-25)">
        <rect x="674.09" y="-50" width="220.84" height="300" fill="#D9D9D9" opacity="0.2" />
        <rect x="726.66" y="-50" width="220.84" height="300" fill="#FFFFFF" opacity="1.0" />
        <rect x="779.24" y="-50" width="220.84" height="300" fill="#D9D9D9" opacity="0.4" />
      </g>
    </svg>
  </div>

  {/* Photo Frame & Officer Info */}
  <div className="relative z-10 w-[210px] h-[150px] rounded-md overflow-hidden shrink-0 border border-[#EAEAEA]">
    <img src="/assets/cag-desk-photo.png" alt="Shri K. Sanjay Murthy" className="w-full h-full object-cover" />
  </div>
  <div className="relative z-10 flex flex-col justify-center text-left">
    <h2 className="text-[32px] font-bold text-[#751639]">
      {isHindi ? 'श्री के संजय मूर्ति' : 'Shri K Sanjay Murthy'}
    </h2>
    <p className="text-[16px] text-[#333333]">
      {isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'Comptroller and Auditor General of India'}
    </p>
  </div>
</div>
```

**Why it matters**: This block guarantees pixel-exact alignment with Figma designs while rendering soft radial blur glows and dynamic language switching.

---

### Page 2: Our Vision, Mission and Core Values
* **File Path**: [`src/app/(pages)/About-Us/Our-Vision,-Mission-&-Core-Values/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Our-Vision,-Mission-&-Core-Values/page.tsx)
* **Core Responsible Code**: Identity card component with hover elevation, gradient overlay, and accessible inline SVGs.

```tsx
{/* Major Code Block: Vision Card with Micro-Animations & Accessible Vector Illustration */}
<section className="relative group flex flex-col md:flex-row gap-10 p-6 items-center justify-between border bg-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#E0EAFC] hover:shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden">
  
  {/* Smooth Gradient Overlay background */}
  <div 
    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    style={{ background: 'linear-gradient(212.12deg, rgba(0, 64, 35, 0) 43.81%, rgba(0, 64, 35, 0.05) 101.12%)' }}
  />

  <div className="relative z-10 flex-grow flex flex-col gap-5 text-left md:max-w-[70%]">
    <h3 className="text-xl font-semibold text-zinc-800 group-hover:text-[#004023]">
      {text.visionTitle}
    </h3>
    <p className="text-sm leading-relaxed text-zinc-600">
      {text.visionDesc}
    </p>
  </div>
  
  {/* Accessible Inline Compass SVG */}
  <div className="relative z-10 w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center">
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" role="img" aria-labelledby="vision-svg-title vision-svg-desc" className="text-[#E3E3E3] group-hover:text-[#004023] transition-colors duration-300">
      <title id="vision-svg-title">{text.visionSvgTitle}</title>
      <desc id="vision-svg-desc">{text.visionSvgDesc}</desc>
      <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="4" />
      <path d="M90 28 L102 90 L90 152 L78 90 Z" stroke="currentColor" strokeWidth="4" transform="rotate(45 90 90)" />
    </svg>
  </div>
</section>
```

**Why it matters**: This pattern couples smooth CSS transitions with fully accessible SVGs and localized dictionary mapping (`LOCAL_DICTS`).

---

### Page 3: Organisation Chart
* **File Path**: [`src/app/(pages)/About-Us/Organisation-Chart/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Organisation-Chart/page.tsx)
* **Core Responsible Code**: Precision SVG tree connectors (`Vector 602`) and fixed $792\text{px}$ container math alignment.

```tsx
{/* Major Code Block: Laser-Straight Tree Connector Math & Vector 602 Path */}
<div className="w-[792px] mx-auto flex flex-col items-center relative">

  {/* Tier 1: Top CAG Node (Centered at 396px) */}
  <div className="w-[792px] flex justify-center">
    <div className="w-[356px]">
      {renderOfficerCardWithDetails(OFFICERS_DATA.cag, 'center')}
    </div>
  </div>

  {/* Vector 602 Connector Area (Starts at 396px center, runs to 614px Secretary card) */}
  <div className="w-[792px] h-[60px] relative pointer-events-none" aria-hidden="true">
    {/* Straight Vertical Center Trunk line at 396px */}
    <div className="absolute left-[396px] top-0 bottom-0 w-[1.5px] bg-[#D7D7D7] -translate-x-1/2" />

    {/* Curved Path Connector with Arrowhead */}
    <div className="absolute left-[396px] top-0 w-[225px] h-[60px]">
      <svg width="225" height="60" viewBox="0 0 225 60" fill="none" className="overflow-visible">
        <path d="M 0 0 V 16 Q 0 24 8 24 H 210 Q 218 24 218 32 V 58" stroke="#D7D7D7" strokeWidth="1.5" fill="none" />
        <path d="M 213 52 L 218 59 L 223 52" stroke="#D7D7D7" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  </div>
</div>
```

**Why it matters**: This exact mathematical alignment ($356\text{px left} + 80\text{px gap} + 356\text{px right} = 792\text{px}$) keeps vertical connector lines straight across all screen sizes.

---

### Page 4: History of IAAD
* **File Path**: [`src/app/(pages)/About-Us/History-of-Indian-Audit-ans-Accounts-Department/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/History-of-Indian-Audit-ans-Accounts-Department/page.tsx)
* **Core Responsible Code**: Catalog data mapping and volume download card rendering.

```tsx
{/* Major Code Block: Iterating History Sections & Volume Download Cards */}
{HISTORY_SECTIONS.map((section) => (
  <div key={section.id} className="flex flex-col gap-4">
    <h2 className="text-lg font-bold text-[#751639]">
      {isHindi ? section.titleHi : section.titleEn}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {section.volumes.map((vol) => (
        <div key={vol.id} className="p-4 border rounded-lg bg-white flex justify-between items-center hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-semibold text-zinc-800">{isHindi ? vol.titleHi : vol.titleEn}</h3>
            <p className="text-xs text-zinc-500">{isHindi ? vol.descHi : vol.descEn}</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-zinc-100 rounded text-zinc-600">
            {vol.size}
          </span>
        </div>
      ))}
    </div>
  </div>
))}
```

**Why it matters**: Maps static/dynamic archival documents into accessible, downloadable volume cards with file size indicators.

---

### Page 5: Audit Advisory Board
* **File Path**: [`src/app/(pages)/About-Us/Audit-Advisory-Board/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Audit-Advisory-Board/page.tsx)
* **Core Responsible Code**: Board sections iteration and member profile grid.

```tsx
{/* Major Code Block: Mapping Advisory Board Categories & Members */}
{BOARD_SECTIONS.map((section) => (
  <div key={section.id} className="flex flex-col gap-3">
    <h3 className="text-md font-semibold text-[#751639] border-b pb-1">
      {isHindi ? section.titleHi : section.titleEn}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {section.members.map((member) => (
        <div key={member.id} className="p-3 border rounded bg-slate-50 flex flex-col">
          <span className="font-bold text-zinc-900">{isHindi ? member.nameHi : member.nameEn}</span>
          <span className="text-xs text-zinc-600">{isHindi ? member.desigHi : member.desigEn}</span>
        </div>
      ))}
    </div>
  </div>
))}
```

**Why it matters**: Cleanly renders external specialists, ex-officio internal members, and the chairman in organized section blocks.

---

### Page 6: Constitutional Provisions
* **File Path**: [`src/app/(pages)/About-Us/Constitutional-Provisions/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Constitutional-Provisions/page.tsx)
* **Core Responsible Code**: Semantic legal layout integrated with `AboutLayout`'s DOM `TreeWalker` translation dictionary.

```tsx
{/* Major Code Block: Semantic Legal Provisions Structure */}
<AboutLayout title="Constitutional-Provisions">
  <div className="space-y-8">
    <section className="border-b border-[#e6e6e6] pb-6">
      <h3 className="text-xl font-bold text-[#751639] mb-4">
        Article 148 — Comptroller and Auditor-General of India
      </h3>
      <ul className="list-disc pl-5 space-y-3 text-zinc-700 text-sm leading-relaxed">
        <li>There shall be a Comptroller and Auditor-General of India who shall be appointed by the President by warrant...</li>
        <li>The salary and other conditions of service of the Comptroller and Auditor-General shall be such as may be determined by Parliament...</li>
      </ul>
    </section>
  </div>
</AboutLayout>
```

**Why it matters**: Relies on clean semantic HTML while [`AboutLayout.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About/AboutLayout.tsx) uses a DOM `TreeWalker` to dynamically translate raw text nodes when the user switches to Hindi.

---

## 3. Summary Diagram of System Connections

```
                     ┌────────────────────────────────────────┐
                     │        Global RootLayoutWrapper        │
                     │  (App Shell & Route Filter for Header) │
                     └───────────────────┬────────────────────┘
                                         │
                                         ▼
                     ┌────────────────────────────────────────┐
                     │              AboutLayout               │
                     │  (Provides Sidebar & DOM TreeWalker)   │
                     └───────┬────────────────────────┬───────┘
                             │                        │
                             ▼                        ▼
               ┌───────────────────────────┐    ┌───────────────────────────┐
               │    AboutusSidemenu        │    │    Active About Page      │
               │  (Active Route Highlight) │    │  (e.g., Cag-Of-India)     │
               └─────────────┬─────────────┘    └─────────────┬─────────────┘
                             │                                │
                             └────────────────┬───────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │       dataManager.ts        │
                               │ (Language Events & Local)   │
                               └─────────────────────────────┘
```
