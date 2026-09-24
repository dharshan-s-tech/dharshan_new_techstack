# CAG State & Overseas Audit Office Subsites Documentation
## CakePHP Functional Migration & Next.js Architecture (LDN, KUL, WDC, ROM, GVA, ERSA, GSSA Themes)

This document details the complete migration of the CakePHP overseas and state subsite architecture (`overseas.md`) to the Next.js CAG application. The implementation provides full functional parity with CakePHP subsite modules while preserving 100% pixel-fidelity to the Figma UI layout (Nodes `14-4148` for State and `14-4407` for Overseas/Central).

---

## 1. Summary of Changes & Architecture Matrix

| Module / Component | CakePHP Origin (`overseas.md`) | Next.js / FastAPI Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Overseas Theme Routing** | `plugins/Themes/LDN`, `KUL` | `src/app/(pages)/states/[slug]/page.tsx` + `src/lib/subsitesData.ts` | Complete |
| **Staff Org Hierarchy** | `SubsitesOrgStructController.php` | `SubsiteOrgStructItem[]` + Interactive Staff Hierarchy Modal | Complete |
| **Recruitment Rules** | `RecruitmentRulesController.php` | `RecruitmentRuleItem[]` + Cadre Regulations Table Modal | Complete |
| **Contact Box & Hours** | `LDN/templates/Home/index.php` | `09:00 AM - 05:30 PM (Mon-Fri)` Contact Card with copy button | Complete |
| **Anti-Spam Email** | `audit[dot]london[at]mea[dot]gov[dot]in` | Anti-spam notation with 1-click clipboard copy & mailto | Complete |
| **Google Maps Embed** | Embedded `iframe` (Aldwych WC2B 4NA) | Interactive responsive Google Maps `iframe` for all locations | Complete |
| **Audit Scope & Operations** | Diplomatic Mission Expenditure & Defense | Interactive Audit Pillars Modal (Foreign Mission, Defense, PSU) | Complete |
| **Diplomatic FAQs** | `LDN/templates/Faqs/` | Interactive collapsible FAQ accordion | Complete |
| **REST API Endpoints** | CakePHP JSON Views | `/api/subsites/[slug]`, `/staff`, `/recruitment-rules` | Complete |

---

## 2. File Modification & Creation Inventory

| File Path | Change Type | Purpose |
| :--- | :--- | :--- |
| `src/types/index.ts` | **MODIFIED** | Added TypeScript interfaces: `SubsiteOrgStructItem`, `RecruitmentRuleItem`, and `OverseasOfficeData`. |
| `src/lib/subsitesData.ts` | **NEW** | Comprehensive subsite database store and helper getters (`getSubsiteOfficeData`, `getSubsiteOrgStruct`, `getSubsiteRecruitmentRules`). |
| `src/components/office/OfficePortalTemplate.tsx` | **MODIFIED** | Master portal template with interactive modals (Contact & Google Maps, Staff Directory, Audit Scope, Recruitment Rules, FAQs, Quick Actions) without altering Figma UI layout. |
| `src/app/(pages)/states/[slug]/page.tsx` | **MODIFIED** | Dynamic subsite router passing `slug` and metadata mapping for all overseas and state audit offices. |
| `src/app/(pages)/states/andhra-pradesh/page.tsx` | **MODIFIED** | Explicit subsite route for Andhra Pradesh (`#0A3D30` theme). |
| `src/app/api/subsites/[slug]/route.ts` | **NEW** | Next.js REST API route for complete subsite data. |
| `src/app/api/subsites/[slug]/staff/route.ts` | **NEW** | Next.js REST API route for staff directory (`SubsitesOrgStruct`). |
| `src/app/api/subsites/[slug]/recruitment-rules/route.ts` | **NEW** | Next.js REST API route for recruitment rules (`RecruitmentRules`). |
| `back_end/app/api/v1/subsites.py` | **NEW** | FastAPI backend endpoint for subsites metadata, officer rosters, and recruitment rules. |
| `back_end/app/api/router.py` | **MODIFIED** | Registered `subsites.router` in FastAPI `api_router`. |
| `overseas.md` | **NEW** | Added CakePHP overseas architecture specification for future reference. |

---

## 3. Subsite Themes & Jurisdictions

### 3.1 PDA – WDC Overseas Menu Tree Specification

All overseas audit subsite portals implement the complete **PDA – WDC** hierarchical menu tree:

```
PDA – WDC / Overseas Portals
│
├── Home
│   └── /states/[slug] (or https://cag.gov.in/pda/wdc/en)
│
├── About Us (Dropdown)
│   ├── Brief History of Office
│   │   └── Interactive History Modal with constitutional mandate (Arts. 148-151)
│   ├── List Of Directors
│   │   └── Tabular Directory of Past & Present Directors of Audit
│   └── List Of PDs (Principal Directors)
│       └── Historical Roster of Principal Directors of Audit
│
├── Organisational Structure (Dropdown)
│   ├── Organizational Structure
│   │   └── Structural Hierarchy Diagram & Functional Wings
│   └── Staff details
│       └── Officer Cadre Roster & Download Official PDF (cag.gov.in/uploads/media/...)
│
├── Audit Functions (Dropdown)
│   ├── Administrative Function
│   │   └── HQ Clearance, Embassy Liaison, Annual Audit Planning
│   ├── Audit Jurisdiction
│   │   └── Accredited Diplomatic Missions, UN PMI NY, Consulates & World Bank Accounts
│   └── Audit Process
│       └── 6-Stage Audit Methodology (Plan -> Entry Conf -> Field Audit -> Queries -> Exit Conf -> IRs)
│
├── Gallery (Dropdown / Button)
│   └── Photo Gallery
│       └── Interactive Diplomatic Event Galleries with Fullscreen Lightbox Preview
│
├── List Of Holidays
│   └── 2026 Diplomatic & Federal Holiday Calendar with Closed/Federal category filter
│
└── Contact Us
    └── Physical Address, Office Hours (09:00 AM - 05:30 PM, Mon-Fri), Direct Lines, Anti-Spam Email & Google Maps Embed
```

---

## 4. Subsite Themes & Jurisdictions

### 4.1 International Audit Offices (Navy Theme `#1D2E6B`)
1. **London (`/states/overseas-london`)**:
   - **Theme**: `LDN`
   - **Address**: High Commission of India, India House, Aldwych, London WC2B 4NA, UK
   - **Phone**: `+44 20 7632 3053 / +44 20 7632 3054`
   - **Email**: `audit.london@mea.gov.in` (`audit[dot]london[at]mea[dot]gov[dot]in`)
   - **Scope**: Foreign Mission Expenditure, Defense Attaché Accounts, Overseas PSUs in Western/Northern Europe.

2. **Washington DC (`/states/overseas-washington`)**:
   - **Theme**: `WDC`
   - **Address**: Embassy of India, 2107 Massachusetts Ave NW, Washington, DC 20008, USA
   - **Phone**: `+1 202 939 7000 / +1 202 939 7069`
   - **Email**: `audit.washington@mea.gov.in` (`audit[dot]washington[at]mea[dot]gov[dot]in`)
   - **Scope**: North & South America Missions, Permanent Mission of India to UN (New York), World Bank/IMF Accounts.

3. **Kuala Lumpur (`/states/overseas-kualalumpur`)**:
   - **Theme**: `KUL`
   - **Address**: High Commission of India, Menara 1 Mon't Kiara, No. 1, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur, Malaysia
   - **Phone**: `+60 3 2093 1000 / +60 3 2093 1002`
   - **Email**: `audit.kualalumpur@mea.gov.in` (`audit[dot]kualalumpur[at]mea[dot]gov[dot]in`)
   - **Scope**: ASEAN & Australasia Regional Audit Headquarters.

4. **Rome (`/states/overseas-rome`)**:
   - **Theme**: `ROM`
   - **Address**: Embassy of India, Via XX Settembre, 5, 00187 Roma RM, Italy
   - **Scope**: UN Specialized Agencies External Audit (FAO, WFP, IFAD) & Southern Europe Missions.

5. **Geneva (`/states/overseas-geneva`)**:
   - **Theme**: `GVA`
   - **Address**: Permanent Mission of India, 9 Rue du Valais, 1202 Genève, Switzerland
   - **Scope**: UN Specialized Agencies External Audit (WHO, ILO, WTO, WIPO, ITU, IPU).

---

## 5. State Audit Offices (Forest Green Theme `#0A3D30`)
1. **Andhra Pradesh (`/states/andhra-pradesh`)**:
   - **Theme**: `ERSA` / `GSSA`
   - **Address**: Principal Accountant General (A&E) / (Audit), Vijayawada & Hyderabad
   - **Features**: State Accounts tab, GPF, Pension, Cadre Recruitment Rules (SAO, AAO, Auditor, DEO, MTS), RTI Framework.

---

## 5. API Endpoints Reference

### 5.1 Subsite Data API
- `GET /api/subsites/{slug}`
  - Returns `{ status: "success", data: { office, staff, recruitmentRules } }`
- `GET /api/subsites/{slug}/staff`
  - Returns list of officers sorted by `seniority_order`
- `GET /api/subsites/{slug}/recruitment-rules`
  - Returns cadre recruitment regulations and PDF links

---

## 6. How to Clone or Add a New Subsite

### Step 1: Add Metadata to `src/lib/subsitesData.ts`
```typescript
'overseas-tokyo': {
  slug: 'overseas-tokyo',
  theme: 'LDN',
  officeNameEn: 'Principal Director of Audit, Tokyo',
  officeNameHi: 'प्रधान निदेशक लेखा परीक्षा, टोक्यो',
  locationEn: 'Tokyo, Japan',
  locationHi: 'टोक्यो, जापान',
  addressEn: 'Embassy of India, 2-2-11 Kudan-Minami, Chiyoda-ku, Tokyo 102-0074, Japan',
  addressHi: 'भारत का दूतावास, 2-2-11 कुदान-मिनामी, चियोदा-कु, टोक्यो 102-0074, जापान',
  officeHoursEn: '09:00 AM - 05:30 PM (Monday - Friday)',
  officeHoursHi: 'प्रातः 09:00 - सायं 05:30 (सोमवार - शुक्रवार)',
  phone: '+81 3 3262 2391',
  email: 'audit.tokyo@mea.gov.in',
  obfuscatedEmail: 'audit[dot]tokyo[at]mea[dot]gov[dot]in',
  gmapEmbedUrl: 'https://maps.google.com/maps?q=Embassy%20of%20India%20Tokyo&output=embed',
  gmapQuery: 'Embassy of India Tokyo',
  externalOfficialUrl: 'https://cag.gov.in/pda-tokyo/en',
  themeColor: '#1D2E6B',
  mandateEn: 'Auditing Indian diplomatic missions in East Asia.',
  mandateHi: 'पूर्वी एशिया में भारतीय राजनयिक मिशनों की लेखापरीक्षा।',
  auditScopes: [...],
  faqs: [...]
}
```

### Step 2: Access the Subsite
Navigate to:
`http://localhost:3333/states/overseas-tokyo`

---

## 7. Build and Verification
- **TypeScript**: `npx tsc --noEmit` -> **0 errors**
- **Git Branch**: `subsites_d`
- **Frontend Port**: `3333`
- **FastAPI Port**: `8000`
