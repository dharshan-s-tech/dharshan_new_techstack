# Antigravity AI Agent Instruction Guide: CAG Website Frontend & Figma UI Conversion

> **Target Audience:** Google Antigravity AI Coding Assistant  
> **Purpose:** Authoritative reference for converting Figma CSS/UI designs into pixel-perfect Next.js (Turbopack) & Tailwind CSS components across all pages of the CAG website codebase.

---

## 1. System Architecture & Routing Conventions

### Route Scoping & Layout Wrapping
* **Global App Shell:** `src/app/RootLayoutWrapper.tsx`
  * Checks route prefix using `usePathname()`.
  * Bypasses global `Header` & `Footer` for `/admin/*` and `/states/*` routes so state subsites and admin tools render isolated headers.
* **Dynamic Route Parameter Unwrapping:**
  * In Next.js 16+, route `params` are asynchronous Promises.
  * Must be unwrapped using `React.use(params)`:
    ```tsx
    export default function Page({ params }: { params: Promise<{ slug: string }> }) {
      const resolvedParams = React.use(params);
      const slug = decodeURIComponent(resolvedParams.slug).toLowerCase();
    }
    ```

---

## 2. Complete Inventory of All Frontend Functions & Methods

### A. State & Language Management Functions

| Function Name | Location / File | Function Signature / Code | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `dataManager.getLanguage()` | `src/lib/dataManager.ts` | `getLanguage(): 'English' \| 'हिन्दी'` | Retrieves current active UI language from localStorage or memory fallback. |
| `dataManager.setLanguage(lang)` | `src/lib/dataManager.ts` | `setLanguage(lang: 'English' \| 'हिन्दी'): void` | Saves new language and dispatches custom `'languageChange'` browser event. |
| `toggleLanguage()` | `Header.tsx`, State pages | `const toggleLanguage = () => { dataManager.setLanguage(lang === 'English' ? 'हिन्दी' : 'English'); };` | Handler for top header language switcher button (`English ∨` / `हिन्दी ∨`). |
| `handleLangChange()` | Event listener callback | `const handleLangChange = () => { setLang(dataManager.getLanguage()); };` | State synchronization function triggered whenever `languageChange` event fires. |
| `toggleHighContrast()` | `Header.tsx` | `const toggleHighContrast = () => { setHighContrast(!highContrast); document.documentElement.classList.toggle('high-contrast'); };` | Accessibility toggle adding/removing high-contrast CSS class on root element. |

```tsx
// Complete Language Switcher Hook Pattern
useEffect(() => {
  setLang(dataManager.getLanguage());
  const handleLangChange = () => setLang(dataManager.getLanguage());
  window.addEventListener('languageChange', handleLangChange);
  return () => window.removeEventListener('languageChange', handleLangChange);
}, []);
```

---

### B. Navigation, Menu & Event Handler Functions

| Function Name | Location / File | Code Snippet | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `toggleMobileMenu()` | `Header.tsx` | `const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);` | Opens and closes mobile navigation hamburger menu drawer. |
| `handleTopicClick(e, type)` | `Menu.tsx` | `const handleTopicClick = (e: React.MouseEvent, type: 'about' \| ...) => { e.stopPropagation(); setActiveMega(type); };` | Opens target mega-menu dropdown and prevents event bubbling to document. |
| `handleOutsideClick(e)` | `Menu.tsx` | `const handleOutsideClick = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('.primary-nav')) setActiveMega(null); };` | Event listener closing active mega-menus when clicking anywhere outside. |
| `handleKeyDown(e)` | `Menu.tsx`, `Header.tsx` | `const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMega(null); };` | Listens for keyboard `Escape` press to dismiss open mega-dropdowns or modals. |

---

### C. Search & Modal Submission Functions

| Function Name | Location / File | Code Snippet | Purpose & Description |
| :--- | :--- | :--- | :--- |
| `executeSearch()` | `Header.tsx` | `const executeSearch = () => { if (searchVal.trim()) router.push('/Reports?query=' + encodeURIComponent(searchVal.trim())); };` | Validates search query input and redirects user to Reports page with query param. |
| `handleSearchKeyDown(e)` | `Header.tsx` | `const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') executeSearch(); };` | Submits search query when user presses `Enter` key inside search text field. |
| `handleEmployeeLogin(e)` | `Header.tsx` | `const handleEmployeeLogin = (e: React.FormEvent) => { e.preventDefault(); alert('Access Granted'); setEmployeeModalOpen(false); };` | Handles intranet modal sign-in form submission and closes modal overlay. |

---

### D. API Integration Methods (`src/lib/api.ts`)

| Function Name | Endpoint | Return Type | Description |
| :--- | :--- | :--- | :--- |
| `api.getStateSubsite(slug)` | `GET /api/states/{slug}` | `Promise<StateSubsiteResponse>` | Fetches live state subsite page data from Python FastAPI backend on port 8000. |
| `api.updateStateSubsite(slug, data)` | `PUT /api/states/{slug}` | `Promise<StateSubsiteResponse>` | Sends updated state subsite content payload to Python FastAPI backend. |
| `api.getAllStates()` | `GET /api/states` | `Promise<StateSubsiteResponse[]>` | Retrieves array of all registered state subsites for directory lists and dropdowns. |
| `api.getReports(filters)` | `GET /api/reports` | `Promise<Report[]>` | Queries audit and accounting report catalog with search filters. |

```typescript
// Example FastAPI Client Call in Next.js
export const api = {
  async getStateSubsite(slug: string): Promise<StateSubsiteResponse> {
    const res = await fetch(`http://localhost:8000/api/states/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch state subsite');
    return res.json();
  }
};
```

---

### E. Built-in Next.js & React Helper Functions

| Function / Hook | Library Source | Usage Pattern | Purpose |
| :--- | :--- | :--- | :--- |
| `usePathname()` | `next/navigation` | `const pathname = usePathname();` | Returns current route path string for active menu links and layout switching. |
| `useRouter()` | `next/navigation` | `const router = useRouter();` | Enables client-side navigation (`router.push('/url')`). |
| `React.use(params)` | `react` | `const resolvedParams = React.use(params);` | Unwraps Next.js 16 async route parameters Promise. |
| `notFound()` | `next/navigation` | `if (!pageData) notFound();` | Renders Next.js 404 boundary when dynamic slug matches no data dictionary. |
| `encodeURIComponent(str)` | JavaScript Standard | `encodeURIComponent('Association with INTOSAI')` | Converts spaces and special characters into valid URL slug parameter (`Association%20with%20INTOSAI`). |
| `decodeURIComponent(str)` | JavaScript Standard | `decodeURIComponent(params.slug)` | Decodes URL slug parameters back into standard readable text string. |

---

## 3. Comprehensive Error Clearance Techniques & Troubleshooting Protocols

### Diagnostic & Inspection Methods Used to Clear Errors

1. **Empirical HTTP 200 Verification:**
   * Never declare a UI feature or bug fix complete without running a PowerShell request:
     ```powershell
     powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:3333/states/andhra-pradesh' -UseBasicParsing).StatusCode"
     ```
   * Must return `200` before finalizing the turn.

2. **Silent Log Diagnostics Inspection:**
   * When Next.js or Uvicorn returns a 500 error, inspect the specific task log:
     `C:\Users\SEC\.gemini\antigravity-ide\brain\<conversation-id>\.system_generated\tasks\task-*.log`
   * Read exact stack trace to pinpoint broken import paths or missing default exports.

3. **Asset Hash Matching Script:**
   * Figma designs use generic names (`image.png`), whereas `public/assets/` uses SHA-1 hashes (e.g. `17a8a6edf588630a0c7494a054fb34e604c4f41c.png`).
   * Diagnostic script to inspect PNG dimensions and match visual elements:
     ```python
     import os, glob
     for f in glob.glob(r"c:\Users\SEC\Desktop\cag_dna\public\assets\*.png"):
         print(f"{os.path.basename(f)}: {os.path.getsize(f)/1024:.1f} KB")
     ```

4. **Git History File Recovery:**
   * If a component file (e.g. `src/components/Header/Header.tsx`) is cleared or corrupted during staging, restore it instantly from recent commit history:
     ```bash
     git checkout 3d90205^ -- src/components/Header/Header.tsx
     ```

5. **PowerShell Execution & Command Chaining:**
   * On Windows PowerShell, avoid Bash `&&` operators. Use `;` for sequential execution:
     ```powershell
     git add file.tsx; git commit -m "feat: message"; git push origin dhar
     ```
   * Bypass PowerShell `.ps1` execution policy blocks on NPM by calling:
     ```cmd
     cmd /c npm run dev
     ```

---

### Specific Errors Encountered & Exact Fixes

#### Error 1: Double Headers / Double Footers on Subsite Pages (`/states/*`)
* **Symptom:** State pages (e.g. `/states/andhra-pradesh`) rendered both the main CAG website header AND the state subsite header.
* **Root Cause:** `RootLayoutWrapper.tsx` unconditionally rendered global `Header` and `Footer`.
* **Resolution:** Added path check:
  ```tsx
  const isStateSubsite = pathname?.startsWith('/states');
  if (isAdmin || isStateSubsite) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }
  ```

#### Error 2: React Runtime Error — "Element type is invalid: expected a string or class/function but got: object"
* **Symptom:** Next.js throws 500 error pointing to `<Header />` inside `RootLayoutWrapper.tsx`.
* **Root Cause:** `src/components/Header/Header.tsx` was empty (0 bytes) or imported via inconsistent case alias (`@/Components/Header/Header`), resolving to an empty object `{}`.
* **Resolution:** 
  1. Restored full component exporting `export default function Header()`.
  2. Standardized import paths to lowercase `@/components/Header/Header`.

#### Error 3: Figma Image ID to Asset File Discrepancy
* **Symptom:** Figma CSS specifies `background: url(image.png)`. Loading wrong image hash in `public/assets/` resulted in wrong photo (e.g. train image instead of meeting photograph).
* **Root Cause:** Asset files use SHA-1 hashes (e.g. `17a8a6edf588630a0c7494a054fb34e604c4f41c.png`).
* **Resolution:**
  * Meeting Photo Banner: `/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png`
  * CAG Emblem Crest: `/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png`

#### Error 4: "Read More" Link Underline Alignment & Width
* **Symptom:** `w-[82px] border-b` placed the underline too far below text or stretched unevenly on mobile viewports.
* **Root Cause:** Fixed container height with bottom border does not align with text baseline across browsers.
* **Resolution:** Use native Tailwind underline decoration:
  ```tsx
  <Link
    href="/Reports"
    className="text-[16px] leading-[30px] font-normal text-[#0D61AE] underline decoration-[#0D61AE] decoration-1 underline-offset-[2px] hover:opacity-80 transition-opacity cursor-pointer shrink-0 font-['Noto_Sans']"
  >
    {t.readMore}
  </Link>
  ```

#### Error 5: Ghost Button Text Contrast Over Dark Background Banners
* **Symptom:** Secondary CTA button text ("Learn about CAG") appeared dark/illegible over dark background photograph banners.
* **Root Cause:** Default link text colors inheriting dark theme variables.
* **Resolution:** Explicitly define white text and semi-transparent backdrop:
  ```tsx
  <Link
    href="/About/..."
    className="w-[160px] h-[48px] border border-white bg-black/40 text-white text-[16px] font-medium rounded-[8px] flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
  >
    <span className="text-white font-medium drop-shadow">{t.heroBtn2}</span>
  </Link>
  ```

#### Error 6: Card Emblem Badges
* **Symptom:** Cards rendering generic icons instead of circular red-bordered emblem badges.
* **Root Cause:** Standard SVG stroke vs double-layer white fill badge inside red ring.
* **Resolution:** Construct exact circular emblem badge:
  ```tsx
  <div className="w-[80px] h-[80px] rounded-full bg-white border border-red-500 flex flex-col items-center justify-center p-1 shrink-0">
    <svg className="w-[30px] h-[30px] text-red-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.5 5 9 6.5 9 9c0 2.5 1.5 4 3 5 1.5-1 3-2.5 3-5 0-2.5-1.5-4-3-7z" fill="#DC2626"/>
      <path d="M12 8c-1.5 2-2 3.5-2 5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.5-3-2-5-1 2-2 2.5-4 0z" fill="#EF4444"/>
    </svg>
    <span className="text-[8px] font-bold text-red-600 tracking-tighter leading-none mt-[-2px]">ICSSR</span>
  </div>
  ```

---

## 4. Figma CSS Tokens to Tailwind Conversion Reference

| Figma CSS Property | Value / Color | Tailwind Class |
| :--- | :--- | :--- |
| `background: #0A3D30` | CAG Dark Green | `bg-[#0A3D30]` |
| `color: #751639` | CAG Dark Maroon | `text-[#751639]` |
| `background: rgba(117, 22, 57, 0.08)` | Light Maroon Tint | `bg-[rgba(117,22,57,0.08)]` |
| `color: #0D61AE` | Primary Link Blue | `text-[#0D61AE]` |
| `border: 2px solid #FFCE7B` | Gold Accent Line | `border-b-2 border-[#FFCE7B]` |
| `box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.09)` | Soft Card Shadow | `shadow-[0px_0px_20px_rgba(0,0,0,0.09)]` |
| `font-family: 'Noto Sans'` | Primary Font | `font-['Noto_Sans',sans-serif]` |
| `border-radius: 8px` | Card Radius | `rounded-[8px]` |

---

## 5. Mandatory Rules & Guidelines for Future Antigravity AI Developers

1. **Bilingual Requirement (English ↔ Hindi):**
   * Every new page or component MUST include a translation dictionary `t` bound to `lang === 'हिन्दी'` and listen to `window.addEventListener('languageChange', ...)`.

2. **Strict Null & Undefined Guards:**
   * Always guard property access on dynamic objects (`card?.title || ''`, `card.url || '/Reports'`) to prevent NullPointer or ReferenceError runtime crashes.

3. **Dynamic Layout Math:**
   * Never hardcode arbitrary static pixel offsets for dynamic containers; compute exact container bounds from wrapped elements.

4. **Component Export Integrity:**
   * Every component file inside `src/components/` MUST have a clean default export (`export default function ComponentName()`). Never leave empty files.

5. **Runtime Verification Checklist:**
   * After any code change, run `powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:3333/...' -UseBasicParsing).StatusCode"` to ensure 200 OK before declaring success.
