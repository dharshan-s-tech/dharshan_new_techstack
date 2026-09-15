# CAG Website - About Us Comprehensive Frontend Guide & Code Mechanics

Welcome to the **About Us Frontend Guide** for the CAG Website project. This document explains the full architecture, connected code components, and the step-by-step working functionality of the code blocks across the **About Us** section.

---

## 1. System Connections & Flow Diagram

The diagram below illustrates how a user request flows from the global app shell down to the page components and state managers:

```
                               ┌────────────────────────────────────────┐
                               │        RootLayoutWrapper.tsx           │
                               │  (App Shell & Route Filtering Router)  │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │             Breadcrumb.tsx             │
                               │     (Dynamic Route Path Parser)        │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │            AboutLayout.tsx             │
                               │ (Outer Container & DOM TreeWalker i18n)│
                               └───────┬────────────────────────┬───────┘
                                       │                        │
                                       ▼                        ▼
                         ┌───────────────────────────┐    ┌───────────────────────────┐
                         │    AboutusSidemenu.tsx    │    │    Active About Page      │
                         │ (Active Path Highlighter) │    │  (e.g., Cag-Of-India)     │
                         └─────────────┬─────────────┘    └─────────────┬─────────────┘
                                       │                                │
                                       └────────────────┬───────────────┘
                                                        │
                                                        ▼
                                         ┌─────────────────────────────┐
                                         │       dataManager.ts        │
                                         │ (State & Language Events)   │
                                         └─────────────────────────────┘
```

---

## 2. Connected Code Components & Their Inner Workings

---

### Component A: App Shell & Route Filter ([RootLayoutWrapper.tsx](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/RootLayoutWrapper.tsx))

**What it does**: Wraps the entire application. It inspects the current URL route and determines whether to show the global `Header`, `Breadcrumb`, and `Footer` or to render an isolated view for Admin and State Subsites.

```tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isStateSubsite = pathname?.startsWith('/states');

  // Bypass global Header/Footer for Admin dashboard and State Subsites
  if (isAdmin || isStateSubsite) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  const showGlobalBreadcrumbWrapper = pathname !== '/' && !pathname?.toLowerCase().includes('global-relations');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        {showGlobalBreadcrumbWrapper && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb />
          </div>
        )}
        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
```

#### How the code executes:
1. `usePathname()` grabs the current browser URL path (e.g. `/About/About-Us/Cag-Of-India`).
2. Checks if `pathname` starts with `/admin` or `/states`. If true, it returns `children` directly.
3. For standard site pages, it renders `<Header />`, checks if breadcrumbs should be displayed, renders `<Breadcrumb />`, wraps page content in `<main className="flex-grow">`, and places `<Footer />` at the bottom.

---

### Component B: Dynamic Breadcrumb Trail ([Breadcrumb.tsx](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/components/Breadcrumb/Breadcrumb.tsx))

**What it does**: Converts the current URL path string into a clickable, formatted breadcrumb trail (e.g. `Home > About > About Us > CAG of India`).

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ROUTE_MAPPINGS: Record<string, string> = {
  '/About': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
  '/About/About-Us': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
};

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === '/' || pathname.toLowerCase().includes('global-relations')) return null;

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="text-[12px] font-['Noto_Sans',sans-serif] text-[#565656] flex items-center gap-[8px]">
      <Link href="/" className="hover:text-[#751639]">Home</Link>
      {paths.map((path, idx) => {
        const url = `/${paths.slice(0, idx + 1).join('/')}`;
        const resolvedUrl = ROUTE_MAPPINGS[url] || url;
        const isLast = idx === paths.length - 1;
        let displayName = decodeURIComponent(path).replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <svg className="w-[10px] h-[10px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
            </svg>
            {isLast ? (
              <span className="text-[#2e2e31] font-semibold">{displayName}</span>
            ) : (
              <Link href={resolvedUrl} className="hover:text-[#751639]">{displayName}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
```

#### How the code executes:
1. Splits the URL by `/` into segment tokens (e.g., `["About", "About-Us", "Cag-Of-India"]`).
2. Iterates over each segment using `.map()`, converting dashes to spaces (`replace(/-/g, ' ')`).
3. Replaces parent fallback URLs using `ROUTE_MAPPINGS` so clicking parent breadcrumbs redirects to valid pages.
4. Renders interactive SVG arrows between links, highlighting the last element as non-clickable bold text (`font-semibold`).

---

### Component C: Centralized Language Event Dispatcher ([dataManager.ts](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/lib/dataManager.ts))

**What it does**: Handles global language state (`English` vs `हिन्दी`), saves user preferences to `localStorage`, and broadcasts custom events to all subscribers.

```typescript
export const dataManager = {
  getLanguage(): 'English' | 'हिन्दी' {
    if (typeof window === 'undefined') return 'English';
    return (localStorage.getItem('cag_language') as any) || 'English';
  },

  setLanguage(lang: 'English' | 'हिन्दी') {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cag_language', lang);
    // Broadcast custom event across the window object
    window.dispatchEvent(new Event('languageChange'));
  }
};
```

#### How the code executes:
1. When a user clicks the top language toggle button in `Header.tsx`, `dataManager.setLanguage('हिन्दी')` is called.
2. The language choice is stored in `localStorage` under key `'cag_language'`.
3. `window.dispatchEvent(new Event('languageChange'))` broadcasts a custom event.
4. All subscribed components receive this notification and update state instantly without needing a full page reload.

---

### Component D: About Section Outer Layout & DOM i18n Engine ([AboutLayout.tsx](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About/AboutLayout.tsx))

**What it does**: Provides a shared 2-column container layout (`lg:flex-row gap-10`), includes the left side navigation menu (`AboutusSidemenu`), and runs a fallback DOM `TreeWalker` translation engine.

```tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import AboutusSidemenu from '@/Reusable components/Side Menu/Aboutus_sidemenu/AboutusSidemenu';
import { dataManager } from '@/lib/dataManager';

const DICTIONARY: Record<string, string> = {
  'CAG of India': 'भारत के नियंत्रक और महालेखापरीक्षक',
  'Our Vision, Mission & Core Values': 'हमारा दृष्टिकोण, ध्येय और मूल मूल्य',
  'Organisation-Chart': 'संगठन चार्ट',
  'History-of-Indian-Audit-ans-Accounts-Department': 'आईएएडी का इतिहास',
  'Audit-Advisory-Board': 'लेखा परीक्षा सलाहकार बोर्ड',
  'Constitutional-Provisions': 'संवैधानिक प्रावधान',
};

export default function AboutLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());

    const translateDOM = () => {
      const currentLang = dataManager.getLanguage();
      setLang(currentLang);
      const isHindi = currentLang === 'हिन्दी';
      if (!containerRef.current) return;

      // TreeWalker scans raw DOM text nodes inside containerRef
      const walk = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walk.nextNode())) {
        const text = node.nodeValue || '';
        const trimmed = text.trim();
        if (trimmed && DICTIONARY[trimmed]) {
          const original = node.parentElement?.getAttribute('data-original-text') || text;
          if (node.parentElement && !node.parentElement.getAttribute('data-original-text')) {
            node.parentElement.setAttribute('data-original-text', original);
          }
          node.nodeValue = isHindi ? DICTIONARY[trimmed] : original;
        }
      }
    };

    translateDOM();
    window.addEventListener('languageChange', translateDOM);
    return () => window.removeEventListener('languageChange', translateDOM);
  }, [children]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-16 py-6" ref={containerRef}>
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <aside className="w-full lg:w-[310px] shrink-0">
          <AboutusSidemenu />
        </aside>
        <main className="flex-grow w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### How the code executes:
1. Renders a responsive 2-column flexbox container (`lg:flex-row`).
2. Places `<AboutusSidemenu />` in the left `<aside>` ($310\text{px}$ width).
3. The `translateDOM()` function instantiates `document.createTreeWalker()` to traverse all raw text nodes within `containerRef`.
4. If a text string matches a key in `DICTIONARY`, it saves the original text in `data-original-text` and replaces `node.nodeValue` with Hindi when language is set to `'हिन्दी'`.

---

### Component E: Contextual Side Menu ([AboutusSidemenu.tsx](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/Reusable%20components/Side%20Menu/Aboutus_sidemenu/AboutusSidemenu.tsx))

**What it does**: Dynamically detects the current URL path using Next.js `usePathname()`, groups links into categories (**Leadership & Legacy**, **Governance & Mandate**, **Global Relations**), highlights active links, and translates sidebar text.

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

export default function AboutusSidemenu() {
  const pathname = usePathname();
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLang = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const activeGroup = getActiveGroup(pathname);
  const isHindi = lang === 'हिन्दी';

  return (
    <div className="w-full bg-[#F9F9F9] border border-[#EAEAEA] rounded-lg p-5">
      <h3 className="text-[#751639] font-bold text-lg mb-4 border-b border-[#D7D7D7] pb-2">
        {isHindi ? activeGroup.groupHeadingHi : activeGroup.groupHeadingEn}
      </h3>
      <ul className="flex flex-col gap-2">
        {activeGroup.links.map((link) => {
          const isActive = pathname?.toLowerCase() === link.href.toLowerCase();
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded text-sm transition-colors ${
                  isActive 
                    ? 'bg-[#751639] text-white font-semibold' 
                    : 'text-[#333333] hover:bg-[#EAEAEA]'
                }`}
              >
                {isHindi ? link.nameHi : link.nameEn}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

#### How the code executes:
1. `usePathname()` reads the browser path (e.g. `/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department`).
2. `getActiveGroup(pathname)` checks URL substring matches to return the corresponding category links.
3. Compares `pathname === link.href` to set `isActive`.
4. If `isActive` is true, applies solid maroon background (`bg-[#751639] text-white font-semibold`); otherwise, applies hover styling.

---

## 3. Working Code Functionalities for All 6 About Us Pages

---

### Page 1: CAG of India
* **File Location**: [`src/app/(pages)/About-Us/Cag-Of-India/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Cag-Of-India/page.tsx)

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import { dataManager } from '@/lib/dataManager';

export default function CagOfIndiaPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <AboutLayout title={isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'CAG of India'}>
      <div className="w-full flex flex-col items-start">
        <h1 className="text-2xl font-bold mb-6 text-[#751639]">
          {isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'CAG of India'}
        </h1>

        {/* Profile Card Banner with SVG Blur Geometry */}
        <div className="relative w-full max-w-[978px] h-[200px] bg-white rounded-lg border border-[#EAEAEA] shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden flex items-center px-6 gap-6 mb-8">
          
          {/* Slanted Rectangle Background Graphics */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <svg viewBox="0 0 978 200" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
              <defs>
                <filter id="ellipse-blur-2" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="35" />
                </filter>
              </defs>
              <ellipse cx="1013" cy="231" rx="199.28" ry="189.5" fill="rgba(222, 222, 222, 0.7)" filter="url(#ellipse-blur-2)" />
              <g transform="skewX(-25)">
                <rect x="674.09" y="-50" width="220.84" height="300" fill="#D9D9D9" opacity="0.2" />
                <rect x="726.66" y="-50" width="220.84" height="300" fill="#FFFFFF" opacity="1.0" />
                <rect x="779.24" y="-50" width="220.84" height="300" fill="#D9D9D9" opacity="0.4" />
              </g>
            </svg>
          </div>

          {/* Photo & Info */}
          <div className="relative z-10 w-[210px] h-[150px] rounded-md overflow-hidden shrink-0 border border-[#EAEAEA]">
            <img src="/assets/cag-desk-photo.png" alt="CAG Photo" className="w-full h-full object-cover" />
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

        {/* Biography Paragraphs */}
        <div className="w-full max-w-[978px] flex flex-col gap-5 text-[#2E2E31] text-[16px] leading-[24px]">
          {isHindi ? (
            <p><strong>श्री के. संजय मूर्ति</strong> ने 21 नवंबर 2024 को भारत के नियंत्रक और महालेखापरीक्षक के रूप में शपथ ली...</p>
          ) : (
            <p><strong>Shri K. Sanjay Murthy</strong> was sworn in as the Comptroller and Auditor General of India on 21st November 2024...</p>
          )}
        </div>
      </div>
    </AboutLayout>
  );
}
```

#### Under-the-hood Execution:
1. `CagOfIndiaPage` mounts and registers the `'languageChange'` event listener.
2. Renders `<AboutLayout>`, which mounts the left sidebar and container wrapper.
3. Renders the banner card with SVG `<filter id="ellipse-blur-2">` and `<g transform="skewX(-25)">` to draw slanted background bars matching Figma vector specs.
4. Reads `isHindi` state to render Shri K. Sanjay Murthy's profile photo, designation, and biography paragraphs in English or Hindi.

---

### Page 2: Our Vision, Mission and Core Values
* **File Location**: [`src/app/(pages)/About-Us/Our-Vision,-Mission-&-Core-Values/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Our-Vision,-Mission-&-Core-Values/page.tsx)

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import { dataManager } from '@/lib/dataManager';

const LOCAL_DICTS = {
  English: {
    visionTitle: 'Vision',
    visionDesc: 'Continue to provide independent and credible assurance on public resources...',
    visionSvgTitle: 'Vision Illustration',
    visionSvgDesc: 'A graphical compass needle indicating strategic direction.'
  },
  'हिन्दी': {
    visionTitle: 'दृष्टिकोण (Vision)',
    visionDesc: 'सार्वजनिक संसाधनों पर स्वतंत्र और विश्वसनीय आश्वासन प्रदान करना जारी रखना...',
    visionSvgTitle: 'दृष्टिकोण चित्रण',
    visionSvgDesc: 'रणनीतिक दिशा को दर्शाने वाली कम्पास सुई।'
  }
};

export default function VisionMissionPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLang = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const text = LOCAL_DICTS[lang] || LOCAL_DICTS.English;

  return (
    <AboutLayout title={lang === 'हिन्दी' ? 'हमारा दृष्टिकोण, ध्येय और मूल मूल्य' : 'Our Vision, Mission & Core Values'}>
      <div className="flex flex-col gap-6 w-full">
        
        {/* Interactive Vision Card */}
        <section className="relative group flex flex-col md:flex-row gap-10 p-6 items-center justify-between border bg-white rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#E0EAFC] hover:shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden">
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(212.12deg, rgba(0, 64, 35, 0) 43.81%, rgba(0, 64, 35, 0.05) 101.12%)' }} />

          <div className="relative z-10 flex-grow flex flex-col gap-5 text-left md:max-w-[70%]">
            <h3 className="text-xl font-semibold text-zinc-800 group-hover:text-[#004023]">
              {text.visionTitle}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              {text.visionDesc}
            </p>
          </div>

          {/* Compass Inline SVG Illustration */}
          <div className="relative z-10 w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" role="img" aria-labelledby="vision-svg-title vision-svg-desc" className="text-[#E3E3E3] group-hover:text-[#004023] transition-colors duration-300">
              <title id="vision-svg-title">{text.visionSvgTitle}</title>
              <desc id="vision-svg-desc">{text.visionSvgDesc}</desc>
              <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="4" />
              <path d="M90 28 L102 90 L90 152 L78 90 Z" stroke="currentColor" strokeWidth="4" transform="rotate(45 90 90)" />
            </svg>
          </div>
        </section>
      </div>
    </AboutLayout>
  );
}
```

#### Under-the-hood Execution:
1. Picks localized text from `LOCAL_DICTS[lang]`.
2. Applies Tailwind hover micro-animations (`group-hover:opacity-100`, `hover:-translate-y-1`).
3. Uses accessible SVGs with embedded `<title>` and `<desc>` linked via `aria-labelledby` for accessibility compliance.

---

### Page 3: Organisation Chart
* **File Location**: [`src/app/(pages)/About-Us/Organisation-Chart/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Organisation-Chart/page.tsx)

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

export default function OrganisationChartPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLang = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLang);
    return () => window.removeEventListener('languageChange', handleLang);
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <AboutLayout title={isHindi ? 'संगठन चार्ट' : 'Organisation Chart'}>
      <div className="w-full flex flex-col items-start">
        <h1 className="text-2xl font-bold mb-4 text-[#751639]">
          {isHindi ? 'संगठन चार्ट' : 'Organisation Chart'}
        </h1>

        {/* Scrollable Container enforcing 792px math grid */}
        <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
          <div className="w-[792px] mx-auto flex flex-col items-center relative">
            
            {/* Top Node: CAG (Center aligned at 396px) */}
            <div className="w-[792px] flex justify-center">
              <div className="w-[356px]">
                {/* CAG Officer Card */}
              </div>
            </div>

            {/* Tree Vector 602 Connector Line (396px Center to 614px Secretary Card) */}
            <div className="w-[792px] h-[60px] relative pointer-events-none" aria-hidden="true">
              <div className="absolute left-[396px] top-0 bottom-0 w-[1.5px] bg-[#D7D7D7] -translate-x-1/2" />
              <div className="absolute left-[396px] top-0 w-[225px] h-[60px]">
                <svg width="225" height="60" viewBox="0 0 225 60" fill="none" className="overflow-visible">
                  <path d="M 0 0 V 16 Q 0 24 8 24 H 210 Q 218 24 218 32 V 58" stroke="#D7D7D7" strokeWidth="1.5" fill="none" />
                  <path d="M 213 52 L 218 59 L 223 52" stroke="#D7D7D7" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AboutLayout>
  );
}
```

#### Under-the-hood Execution:
1. Enforces a fixed $792\text{px}$ container math grid ($356\text{px left card} + 80\text{px gap} + 356\text{px right card} = 792\text{px}$).
2. Fixes the central vertical trunk line at exactly $396\text{px}$.
3. Renders `Vector 602` SVG path using quadratic Bezier curves (`Q 0 24 8 24`) and arrowhead markers to cleanly connect hierarchy nodes across devices.

---

### Page 4: History of IAAD
* **File Location**: [`src/app/(pages)/About-Us/History-of-Indian-Audit-ans-Accounts-Department/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/History-of-Indian-Audit-ans-Accounts-Department/page.tsx)

```tsx
{/* Iterating Publication Sections & Volume Cards */}
{HISTORY_SECTIONS.map((section) => (
  <div key={section.id} className="flex flex-col gap-4 mb-6">
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
          <span className="text-xs font-medium px-2.5 py-1 bg-zinc-100 rounded text-zinc-700">
            {vol.size}
          </span>
        </div>
      ))}
    </div>
  </div>
))}
```

#### Under-the-hood Execution:
1. Loops through `HISTORY_SECTIONS` array (Analytical History 1947-1989, Thematic History 1990-2007).
2. Maps each volume to a styled download card displaying title, description, and file size badge (`34.7 MB`).

---

### Page 5: Audit Advisory Board
* **File Location**: [`src/app/(pages)/About-Us/Audit-Advisory-Board/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Audit-Advisory-Board/page.tsx)

```tsx
{/* Mapping Advisory Board Categories & Members */}
{BOARD_SECTIONS.map((section) => (
  <div key={section.id} className="flex flex-col gap-3 mb-6">
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

#### Under-the-hood Execution:
1. Loops through `BOARD_SECTIONS` (Chairman, External Members, Internal Ex-officio, Secretary).
2. Renders member titles and localized designations inside a 2-column grid.

---

### Page 6: Constitutional Provisions
* **File Location**: [`src/app/(pages)/About-Us/Constitutional-Provisions/page.tsx`](file:///Users/purnimadwivedi/Desktop/cag%20UI%20/CAG_Website_v2/src/app/(pages)/About-Us/Constitutional-Provisions/page.tsx)

```tsx
export default function ConstitutionalProvisionsPage() {
  return (
    <AboutLayout title="Constitutional-Provisions">
      <div className="space-y-8">
        <section className="border-b border-[#e6e6e6] pb-6">
          <h3 className="text-xl font-bold text-[#751639] mb-4">
            Article 148 — Comptroller and Auditor-General of India
          </h3>
          <ul className="list-disc pl-5 space-y-3 text-zinc-700 text-sm leading-relaxed">
            <li>There shall be a Comptroller and Auditor-General of India who shall be appointed by the President by warrant under his hand and seal...</li>
            <li>Every person appointed to be the Comptroller and Auditor-General of India shall, before he enters upon his office, make and subscribe an oath...</li>
          </ul>
        </section>

        <section className="border-b border-[#e6e6e6] pb-6">
          <h3 className="text-xl font-bold text-[#751639] mb-4">
            Article 149 — Duties and Powers of the Comptroller and Auditor-General
          </h3>
          <p className="text-zinc-700 text-sm leading-relaxed">
            The Comptroller and Auditor-General shall perform such duties and exercise such powers in relation to the accounts of the Union and of the States...
          </p>
        </section>
      </div>
    </AboutLayout>
  );
}
```

#### Under-the-hood Execution:
1. Uses semantic HTML elements (`<section>`, `<h3>`, `<ul>`, `<li>`).
2. Heading strings passed to `AboutLayout` are scanned by `document.createTreeWalker()` to replace text nodes with Hindi translations when the user toggles the language switch.
