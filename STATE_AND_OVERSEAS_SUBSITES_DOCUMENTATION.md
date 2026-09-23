# CAG State & Overseas Audit Office Subsites Documentation

This document details all files added, modified, and configured for the **State Audit Office Portal** (Figma Node `14-4148`) and **Central/Overseas Audit Office Portal** (Figma Node `14-4407`), including instructions for cloning and creating new subsites.

---

## 1. Summary of Changes

| Type | File Path | Description |
| :--- | :--- | :--- |
| **NEW** | `src/components/office/OfficePortalTemplate.tsx` | Reusable, pixel-perfect master portal component supporting both State Green (`#0A3D30`) and Overseas Blue (`#1D2E6B`) themes, interactive tabs, 3-card carousel, month calendar, announcement badges, and double footer. |
| **NEW** | `src/app/(pages)/states/[slug]/page.tsx` | Dynamic router for `/states/[slug]` handling automatic metadata mapping, theme resolution, and fallback support for any state or overseas subsite. |
| **MODIFIED** | `src/app/(pages)/states/andhra-pradesh/page.tsx` | Explicit state subsite route rendering `OfficePortalTemplate` with Andhra Pradesh metadata and green theme (`#0A3D30`). |
| **MODIFIED** | `src/app/(pages)/Our-Presence/Index-Menu/State-Level-Offices/page.tsx` | State-level office directory connected to open local state subsites in a new tab (`target="_blank"`). |
| **MODIFIED** | `src/app/(pages)/Our-Presence/Index-Menu/Central-Audit-Offices/page.tsx` | Overseas offices directory connected to open local overseas subsites in a new tab (`target="_blank"`). |

---

## 2. Detailed File Breakdown

### A. `src/components/office/OfficePortalTemplate.tsx` (New Master Template)
- **Design Specifications Implemented**:
  - **Top Bar Header (40px)**:
    - Background dynamically controlled by `themeColor`: `#0A3D30` (State) or `#1D2E6B` (Overseas).
    - Left side: Bilingual office title and location name.
    - Right side: Quick links (`Knowledge Hub`, `Employee Portal`, `News & Events`, `Careers`), Accessibility toggle (`A ▼`), Language toggle (`English` / `हिन्दी`), and external official CAG portal button (`Official Portal ↗`).
  - **White Navigation Header (80px)**:
    - Overlapping official CAG crest emblem (`/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png`).
    - Navigation dropdown menus (`About Us`, `State Accounts`, `GPF`, `Pension`, `Employee Corner`, `RTI`, `Citizen Charter`, `Contact Us`).
    - Search box with magnifying glass icon.
  - **Hero Banner (560px)**:
    - Background meeting photo with dark gradient overlay (`rgba(9, 12, 30, 0.9)`).
    - Gold accent bar (`#FFCE7B`), headline ("Ensuring Transparency, Integrity & Accountability"), and action buttons ("Explore Reports" and "Learn about CAG").
    - Active carousel indicator line (`border: 6px solid #1D6B57` for State or `#1D2E6B` for Overseas).
    - Floating circular Quick Links button (`80px x 80px`) with drop shadow.
  - **Section 1: Latest Audit Reports & Sectors**:
    - Segment Control pill (`Audit reports` | `sectors`) with active state (`#024023` for State, `#1D2E6B` for Overseas).
    - 3-Card Carousel:
      1. **Civil / Civic**: Construction engineers banner + date badge + excerpt.
      2. **Tamil Nadu**: Vivekananda rock memorial in ocean banner + date badge + excerpt.
      3. **Andhra Pradesh**: Heritage architecture / Charminar banner + date badge + excerpt.
    - Previous (`#F5F5F5`) and Next (`#FFFFFF` with `#2E2E31` border) navigation buttons.
  - **Section 2: Deep Color Bottom Section (`#0A3D30` or `#1D2E6B`)**:
    - **Card 1 (What's new? | press release)**: Tab selector with 4 announcements and green date badges (`#EAF7EE` / `#094E3D`).
    - **Card 2 (Date of Tabling of Reports)**: Interactive month calendar (August 2026, day 8 highlighted in theme badge, previous/next month navigation).
    - **Card 3 (Tenders & Contracts)**: Tender notice details, PDF metadata (`09 Jan 2026, 887.85 KB`), and `View All` arrow link.
  - **Double Footer**:
    - Upper bar: `rgba(10, 61, 48, 0.9)` (State) or `rgba(29, 46, 107, 0.9)` (Overseas) with policy links (`Copyright Policy`, `Help`, `Hyper linking Policy`, `Privacy Policy`, `Terms & Conditions`, `Archive`).
    - Lower bar: `#2A2A2A` with dynamic office copyright notice and page last updated timestamp.

### B. `src/app/(pages)/states/[slug]/page.tsx` (Dynamic Routing Engine)
- Dynamically parses the URL parameter `params.slug` (e.g. `/states/overseas-washington`, `/states/tamil-nadu`, `/states/karnataka`, etc.).
- Maps metadata for all overseas offices and state offices.
- Automatically selects the appropriate theme color:
  - Slugs starting with `overseas-`: `#1D2E6B` (Navy Blue)
  - Other state slugs: `#0A3D30` (Forest Green)
- Passes `externalOfficialUrl` for direct access to official `cag.gov.in` sites.

### C. Directory Index Pages
1. **`src/app/(pages)/Our-Presence/Index-Menu/Central-Audit-Offices/page.tsx`**:
   - Overseas office cards list (`?filter=overseas`) configured to open `/states/overseas-[slug]` in a **new tab** (`target="_blank"`).
2. **`src/app/(pages)/Our-Presence/Index-Menu/State-Level-Offices/page.tsx`**:
   - State audit offices list (`?filter=audit`) configured to open `/states/[state-slug]` in a **new tab** (`target="_blank"`).

---

## 3. How to Clone / Add a New State or Overseas Subsite

To add a new subsite (e.g. `kerala`, `maharashtra`, or a new overseas office):

### Method 1: Using the Dynamic Route (Zero New Files Needed)
Simply add the metadata mapping to `OFFICE_METADATA_MAP` in `src/app/(pages)/states/[slug]/page.tsx`:

```tsx
'kerala': {
  officeNameEn: 'Principal Accountant General (Audit-I)',
  officeNameHi: 'प्रधान महालेखाकार (लेखापरीक्षा-I)',
  locationEn: 'Kerala, Thiruvananthapuram',
  locationHi: 'केरल, तिरुवनंतपुरम',
  themeColor: '#0A3D30',
  externalOfficialUrl: 'https://cag.gov.in/ag/kerala/en'
}
```
Now visiting `http://localhost:3333/states/kerala` will immediately render the complete subsite!

### Method 2: Creating a Dedicated Explicit Route (Optional)
If you want an explicit folder route, create `src/app/(pages)/states/kerala/page.tsx`:

```tsx
'use client';

import React from 'react';
import OfficePortalTemplate from '@/components/office/OfficePortalTemplate';

export default function KeralaSubsitePage() {
  return (
    <OfficePortalTemplate
      officeNameEn="Principal Accountant General (Audit-I)"
      officeNameHi="प्रधान महालेखाकार (लेखापरीक्षा-I)"
      locationEn="Kerala, Thiruvananthapuram"
      locationHi="केरल, तिरुवनंतपुरम"
      themeColor="#0A3D30"
      externalOfficialUrl="https://cag.gov.in/ag/kerala/en"
    />
  );
}
```

---

## 4. Props Reference for `OfficePortalTemplate`

| Prop Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `officeNameEn` | `string` | `"Principal Accountant General (A&E)"` | Office designation in English |
| `officeNameHi` | `string` | `"प्रधान महालेखाकार (लेखा एवं हकदारी)"` | Office designation in Hindi |
| `locationEn` | `string` | `"Andhra Pradesh, Vijayawada"` | Office location in English |
| `locationHi` | `string` | `"आंध्र प्रदेश, विजयवाड़ा"` | Office location in Hindi |
| `themeColor` | `string` | `"#0A3D30"` | Portal theme color (`#0A3D30` for State Green, `#1D2E6B` for Overseas Blue) |
| `externalOfficialUrl` | `string` | `undefined` | Live URL on `cag.gov.in` for the "Official Portal ↗" header link |
| `showBottomDeepSection` | `boolean` | `true` | Controls rendering of the What's New, Calendar & Tenders section |

---

## 5. Branch and Deployment Instructions
- **Git Branch**: `subsites_d`
- **Dev Server Port**: `3333`
- **Validation**: `npx tsc --noEmit` (0 errors)
