# CAG Website v2 — Developer CSS Class & CMS Parameter Reference Manual

> **Comprehensive Developer Guide**: All CSS class names, exact CSS parameters/properties, usage locations, element purposes, and Backend CMS configurable parameters for the Comptroller and Auditor General of India (CAG) Website Version 2.

---

## Table of Contents

1. [Architectural Overview & BEM Standard](#1-architectural-overview--bem-standard)
2. [Global Design Tokens & Color Palette](#2-global-design-tokens--color-palette)
3. [Section 1: App Shell & Global Layout](#3-section-1-app-shell--global-layout)
   - 1.1 [Root Layout & Page Backgrounds](#11-root-layout--page-backgrounds)
   - 1.2 [Site Header & Utility Bar](#12-site-header--utility-bar)
   - 1.3 [Primary Navigation & Mega Menus](#13-primary-navigation--mega-menus)
   - 1.4 [Site Footer](#14-site-footer)
   - 1.5 [Global Breadcrumbs](#15-global-breadcrumbs)
4. [Section 2: Home Page Core Components](#4-section-2-home-page-core-components)
   - 2.1 [Home Banner / Hero Carousel](#21-home-banner--hero-carousel)
   - 2.2 [Latest Reports Carousel](#22-latest-reports-carousel)
   - 2.3 [Who We Are & Quick Links](#23-who-we-are--quick-links)
   - 2.4 [CAG Message & Profile Card](#24-cag-message--profile-card)
   - 2.5 [News, Events & Media Cards](#25-news-events--media-cards)
   - 2.6 [Generic Hero](#26-generic-hero)
5. [Section 3: About Us & Global Relations](#5-section-3-about-us--global-relations)
   - 3.1 [Sub-Site Banner (CMS Model Pattern)](#31-sub-site-banner-cms-model-pattern)
   - 3.2 [About Us Sidebar Navigation](#32-about-us-sidebar-navigation)
   - 3.3 [Dual Flag Stand](#33-dual-flag-stand)
   - 3.4 [Former CAG Cards](#34-former-cag-cards)
   - 3.5 [Names & Details Cards](#35-names--details-cards)
   - 3.6 [About Us Page Layout](#36-about-us-page-layout)
6. [Section 4: Our Presence](#6-section-4-our-presence)
   - 4.1 [Our Presence Layout](#41-our-presence-layout)
   - 4.2 [State-Level Offices Grid & Cards](#42-state-level-offices-grid--cards)
   - 4.3 [Central Audit & Training Institutes Cards](#43-central-audit--training-institutes-cards)
7. [Section 5: Audit Reports & Publications](#7-section-5-audit-reports--publications)
   - 5.1 [Reports Search & Layout](#51-reports-search--layout)
   - 5.2 [Filters Sidemenu](#52-filters-sidemenu)
   - 5.3 [Report Listing Cards](#53-report-listing-cards)
   - 5.4 [Report Detail Page & Archive Drawer](#54-report-detail-page--archive-drawer)
   - 5.5 [Accounts & Financial Statements](#55-accounts--financial-statements)
8. [Section 6: Resources, Tenders, Circulars & Career](#8-section-6-resources-tenders-circulars--career)
   - 6.1 [Resources Page](#61-resources-page)
   - 6.2 [Tenders & Circulars Data Tables](#62-tenders--circulars-data-tables)
   - 6.3 [Career & Engagement](#63-career--engagement)
9. [Section 7: State Subsites Template](#9-section-7-state-subsites-template)
10. [Section 8: Global Utility Classes & Modals](#10-section-8-global-utility-classes--modals)
11. [Backend CMS Integration Parameter Dictionary](#11-backend-cms-integration-parameter-dictionary)

---

## 1. Architectural Overview & BEM Standard

### A. The BEM Naming Convention
All styles in `src/app/globals.css` follow the standard **BEM (Block Element Modifier)** methodology:
* **Block (`.block`)**: Standalone entity that is meaningful on its own (e.g. `.sub-site-banner`, `.report-card`, `.site-header`).
* **Element (`.block__element`)**: Part of a block tied to its parent (e.g. `.sub-site-banner__title`, `.report-card__body`, `.site-header__logo`).
* **Modifier (`.block--modifier` or `.block__element--modifier`)**: Flag that changes appearance or state (e.g. `.about-sidebar--flat`, `.nav-item--active`, `.btn--white`).

### B. Component Source Map & Active Files
The codebase contains 3 component directories. Developers and CMS engineers must use the **Active File Path** listed in the table below:

| Component Type | Active Directory Path | Note |
|---|---|---|
| **App Shell & Global Layout** | `src/components/` | Header, Footer, Menu, Breadcrumbs, Hero |
| **Reusable Cards & Menus** | `src/Reusable components/` *(Actively imported)* | `Side Menu/Aboutus_sidemenu/`, `Side Menu/Filters_sidemenu/`, `Cards/` |
| **Home Page Sections** | `src/features/home/` | HomeView, LatestReports, WhoWeAre, Details, NewsEvents |
| **Page Route Files** | `src/app/(pages)/` | Route definitions with sub-site banners and layouts |

> [!IMPORTANT]
> Always target BEM class names defined in `src/app/globals.css`. Do not add arbitrary Tailwind styles to core layout blocks to keep CMS style overrides predictable.

---

## 2. Global Design Tokens & Color Palette

The design system uses standard tokens defined across `globals.css` and Tailwind config:

| Token Name | Hex / CSS Value | Description & Common Usage |
|---|---|---|
| **Primary Maroon** | `#751639` / `rgb(117, 22, 57)` | CAG signature maroon; primary CTAs, active links, brand headers |
| **Dark Navy** | `#0b2545` / `#142954` | Hero backgrounds, primary footer background, dark headings |
| **Text Dark** | `#212529` / `#1D2939` | Primary body typography, card headings, main text |
| **Text Muted** | `#667085` / `#6c757d` | Secondary subtitles, timestamps, metadata labels |
| **Border Gray** | `#E4E7EC` / `#EAEAEA` | Card outlines, dividers, container borders |
| **Surface Off-White**| `#F8F9FA` / `#F9FAFB` | Section backgrounds, card hover surfaces, sidebar containers |
| **Gold / Ochre Accent**| `#D4AF37` / `#D97706` | Badges, highlight dots, focus rings, award accents |
| **Gutter Width** | `64px` (`left: 64px`, `px-16`) | Standard side margin on desktop page containers |
| **Max Container Width**| `1200px` (`max-w-[1200px]`) | Global desktop content wrapper |

---

## 3. Section 1: App Shell & Global Layout

### 1.1 Root Layout & Page Backgrounds

* **File Location**: [`src/app/RootLayoutWrapper.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/RootLayoutWrapper.tsx)
* **Purpose**: Orchestrates global layout shell, conditionally displays global Header/Footer (suppressed on `/admin` and `/states`), and provides global background wrappers.
* **Where Used**: Wraps every single page route in Next.js App Router.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.content-bg` | Block | `background-color: #F8F9FA`, `min-height: 100vh`, `width: 100%` | Provides uniform off-white page background behind cards and sections. |
| `.content` | Block | `max-width: 1200px`, `margin: 0 auto`, `padding: 0 16px` | Centers page content on wide screens with standard gutters. |
| `.home-section-divider` | Element | `height: 1px`, `background: #E4E7EC`, `margin: 40px 0` | Horizontal line separating consecutive home sections. |

---

### 1.2 Site Header & Utility Bar

* **File Location**: [`src/components/Header/Header.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/components/Header/Header.tsx)
* **Purpose**: Topmost government navigation bar containing accessibility controls (font size, contrast), language toggle (English/Hindi), CAG of India branding/emblem, and quick search.
* **Where Used**: Fixed at the top of all public pages via `RootLayoutWrapper`.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.site-header` | Block | `width: 100%`, `background: #ffffff`, `border-bottom: 1px solid #EAEAEA`, `position: sticky`, `top: 0`, `z-index: 50` | Fixed header container anchoring navigation and utilities. |
| `.utility-bar` | Element | `background: #F8F9FA`, `border-bottom: 1px solid #E4E7EC`, `padding: 6px 64px`, `display: flex`, `justify-content: space-between`, `align-items: center` | Top utility row for accessibility toggles, language, and Gov links. |
| `.utility-links` | Element | `display: flex`, `gap: 16px`, `align-items: center` | Flex container for government portal links ("Government of India", "Skip to Main Content"). |
| `.utility-link` | Element | `font-size: 12px`, `color: #667085`, `text-decoration: none`, `transition: color 0.2s` | Individual top utility text link. |
| `.accessibility` | Element | `display: flex`, `align-items: center`, `gap: 8px` | Controls for Font Size (-A, A, +A) and High Contrast toggle. |
| `.a11y-toggle` | Element | `display: inline-flex`, `border: 1px solid #D0D5DD`, `border-radius: 4px`, `overflow: hidden` | Grouped button container for text size switches. |
| `.a11y-toggle__btn` | Element | `padding: 2px 8px`, `font-size: 12px`, `font-weight: 500`, `background: transparent`, `cursor: pointer` | Individual button toggling font magnification (100%, 110%, 120%). |
| `.lang-select` | Element | `display: flex`, `align-items: center`, `gap: 4px`, `cursor: pointer`, `font-size: 13px`, `font-weight: 600`, `color: #751639` | Language switcher button (English / हिन्दी) triggering `languageChange` event. |
| `.main-nav` | Element | `display: flex`, `justify-content: space-between`, `align-items: center`, `padding: 12px 64px`, `background: #ffffff` | Primary branding row containing Emblem, Title, and Search. |
| `.cag-logo` | Element | `display: flex`, `align-items: center`, `gap: 16px` | National Emblem of India + Comptroller & Auditor General bilingual logo typography. |
| `.search-box` | Block | `position: relative`, `width: 260px`, `height: 38px` | Header search input bar navigating to `/Reports?query=...`. |
| `.search-box__inner` | Element | `display: flex`, `align-items: center`, `border: 1px solid #D0D5DD`, `border-radius: 20px`, `padding: 0 12px`, `background: #F9FAFB` | Rounded pill input container with smooth focus ring. |
| `.search-box__input` | Element | `width: 100%`, `border: none`, `outline: none`, `font-size: 13px`, `background: transparent` | Input field for typing report keywords. |
| `.search-box__icon` | Element | `width: 16px`, `height: 16px`, `color: #98A2B3`, `margin-right: 8px` | Magnifying glass search icon. |
| `.nav-toggle` | Element | `display: none` (desktop), `display: block` (mobile), `cursor: pointer` | Hamburger icon triggering mobile navigation drawer on screens `< 1024px`. |

#### CMS Parameters (Backend Config)
* `emblemUrl`: String (URL to Ashoka Emblem SVG/PNG)
* `siteTitleEn`: String (Default: `"Comptroller and Auditor General of India"`)
* `siteTitleHi`: String (Default: `"भारत के नियंत्रक एवं महालेखापरीक्षक"`)
* `utilityLinks`: Array of `{ label: string, url: string, target?: string }`

---

### 1.3 Primary Navigation & Mega Menus

* **File Location**: [`src/components/navigation/Menu.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/components/navigation/Menu.tsx)
* **Purpose**: Full-width primary mega-menu bar supporting multi-level hover dropdowns for About, Our Presence, Reports, Global Relations, and Careers.
* **Where Used**: Rendered beneath `Header.tsx` on all pages.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.primary-nav` | Block | `background: #751639`, `display: flex`, `align-items: center`, `padding: 0 64px`, `height: 48px`, `position: relative` | Primary maroon horizontal menu container. |
| `.nav-item` | Element | `color: #ffffff`, `font-size: 14px`, `font-weight: 500`, `padding: 0 16px`, `height: 48px`, `display: flex`, `align-items: center`, `cursor: pointer`, `transition: background 0.2s` | Individual top-level menu link item. |
| `.nav-item--active` | Modifier | `background: rgba(0, 0, 0, 0.15)`, `border-bottom: 3px solid #D4AF37`, `font-weight: 600` | Highlights currently active route or active menu tab. |
| `.about-menu` | Block | `position: absolute`, `top: 48px`, `left: 0`, `width: 100%`, `background: #ffffff`, `box-shadow: 0 10px 25px rgba(0,0,0,0.15)`, `padding: 24px 64px`, `z-index: 100` | Full-width dropdown mega-menu overlay for rich sub-navigation. |
| `.about-menu__columns` | Element | `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 24px` | 4-column layout organizing sub-menu items logically. |
| `.about-menu__column` | Element | `display: flex`, `flex-direction: column`, `gap: 8px` | Single column of navigational sub-links. |
| `.about-menu__heading` | Element | `font-size: 14px`, `font-weight: 700`, `color: #751639`, `border-bottom: 1px solid #EAEAEA`, `padding-bottom: 6px`, `margin-bottom: 8px` | Category header inside mega dropdown. |
| `.about-menu__list` | Element | `list-style: none`, `padding: 0`, `margin: 0`, `display: flex`, `flex-direction: column`, `gap: 6px` | Unordered list of links under category. |
| `.grm-desc-box` | Block | `background: #F8F9FA`, `border-radius: 6px`, `padding: 16px`, `border-left: 3px solid #751639` | Informational callout card inside Global Relations mega menu. |
| `.grm-column` | Block | `display: flex`, `flex-direction: column`, `gap: 12px` | Column wrapper for bilateral/multilateral international bodies. |

---

### 1.4 Site Footer

* **File Location**: [`src/components/Footer/Footer.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/components/Footer/Footer.tsx)
* **Purpose**: Global institutional footer containing national emblem, address, grievance portals, legal policies, copyright notice, and STQC compliance badge.
* **Where Used**: Rendered at bottom of every standard page via `RootLayoutWrapper`.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.site-footer` | Block | `background: #142954`, `color: #ffffff`, `padding: 48px 64px 24px`, `position: relative` | Dark navy institutional footer container. |
| `.site-footer__crest` | Element | `display: flex`, `align-items: center`, `gap: 20px`, `margin-bottom: 32px` | White National Emblem + CAG typography emblem container. |
| `.site-footer__logo` | Element | `width: 60px`, `height: auto`, `filter: brightness(0) invert(1)` | SVG emblem formatted in pure white for dark background. |
| `.site-footer__links` | Element | `display: grid`, `grid-template-columns: repeat(4, 1fr)`, `gap: 32px`, `margin-bottom: 32px` | 4-column footer links grid (About, Reports, Portals, Legal). |
| `.site-footer__divider` | Element | `height: 1px`, `background: rgba(255, 255, 255, 0.15)`, `margin: 24px 0` | Translucent divider line separating columns from copyright row. |
| `.site-footer__copyright`| Element | `display: flex`, `justify-content: space-between`, `align-items: center`, `font-size: 13px`, `color: rgba(255, 255, 255, 0.7)` | Bottom bar with copyright year and developer credits. |
| `.site-footer__badge` | Element | `display: inline-flex`, `align-items: center`, `gap: 8px`, `border: 1px solid rgba(255,255,255,0.3)`, `border-radius: 4px`, `padding: 4px 8px` | STQC / GIGW compliance certification badge. |

#### CMS Parameters (Backend Config)
* `officeAddress`: String (Physical headquarters address)
* `contactPhone`: String & `contactEmail`: String
* `copyrightText`: String (e.g. `"© 2026 Comptroller and Auditor General of India. All Rights Reserved."`)
* `policyLinks`: Array of `{ label_en: string, label_hi: string, url: string, modalContent?: string }`

---

### 1.5 Global Breadcrumbs

* **File Location**: [`src/components/Breadcrumb/Breadcrumb.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/components/Breadcrumb/Breadcrumb.tsx)
* **Purpose**: Shows user navigation trail from Home down to current subpage; supports both standard route links and Global Relations / Report Detail variants.
* **Where Used**: Rendered above main page content on all subpages.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.breadcrumbs` | Block | `display: flex`, `align-items: center`, `gap: 8px`, `padding: 16px 64px`, `font-size: 13px`, `color: #667085` | Outer breadcrumb bar anchored at 64px left gutter. |
| `.breadcrumbs__trail` | Element | `display: flex`, `align-items: center`, `gap: 6px`, `flex-wrap: wrap` | Container holding individual path links and separators. |
| `.breadcrumbs__item` | Element | `color: #751639`, `text-decoration: none`, `font-weight: 500`, `transition: opacity 0.2s` | Clickable ancestral page link. |
| `.breadcrumbs__sep` | Element | `color: #D0D5DD`, `font-size: 12px`, `user-select: none` | Slash (`/`) or chevron (`>`) separator between route items. |
| `.breadcrumbs__current` | Element | `color: #1D2939`, `font-weight: 600`, `pointer-events: none` | Bold, non-clickable current page title. |
| `.breadcrumbs__back` | Element | `display: inline-flex`, `align-items: center`, `gap: 6px`, `color: #751639`, `font-weight: 600`, `cursor: pointer` | "Back" button icon for fast return to previous listing. |

---

## 4. Section 2: Home Page Core Components

### 2.1 Home Banner / Hero Carousel

* **File Location**: [`src/components/hero/HomeBanner.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/components/hero/HomeBanner.tsx)
* **Purpose**: Full-width animated carousel on the homepage with high-resolution imagery, headline, bilingual descriptions, quick actions, and interactive quick-links popover.
* **Where Used**: Top of Home Page (`/` or `HomeView.tsx`).

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.hero` | Block | `position: relative`, `width: 100%`, `min-height: 520px`, `background: #0b2545`, `color: #ffffff`, `overflow: hidden` | Dark hero container providing contrast for slider imagery. |
| `.hero__carousel` | Element | `position: absolute`, `inset: 0`, `width: 100%`, `height: 100%`, `display: flex` | Slides container with CSS fade/slide transitions. |
| `.hero__bg` | Element | `width: 100%`, `height: 100%`, `object-fit: cover`, `opacity: 0.35` | Background banner photo with dark overlay. |
| `.hero__content` | Element | `position: relative`, `z-index: 10`, `max-width: 1200px`, `margin: 0 auto`, `padding: 80px 64px 60px`, `display: flex`, `flex-direction: column`, `gap: 20px` | Foreground container for headline and CTA buttons. |
| `.hero__title` | Element | `font-size: 44px`, `font-weight: 800`, `line-height: 1.15`, `color: #ffffff`, `text-shadow: 0 2px 4px rgba(0,0,0,0.5)` | Hero primary title banner (English / Hindi). |
| `.hero__subtitle` | Element | `font-size: 18px`, `font-weight: 400`, `line-height: 1.5`, `color: rgba(255,255,255,0.9)`, `max-width: 720px` | Explanatory subtext below hero title. |
| `.hero__ctas` | Element | `display: flex`, `gap: 16px`, `align-items: center`, `margin-top: 12px` | Flex container for "Explore Reports", "Learn More", and "Quick Links". |
| `.hero__accent-line` | Element | `width: 64px`, `height: 4px`, `background: #D4AF37`, `border-radius: 2px` | Gold horizontal accent line beneath title. |
| `.hero__carousel-dot` | Element | `width: 10px`, `height: 10px`, `border-radius: 50%`, `background: rgba(255,255,255,0.4)`, `cursor: pointer`, `transition: all 0.3s` | Pagination indicator dot for slider. |
| `.hero__carousel-dot--active`| Modifier | `background: #D4AF37`, `width: 28px`, `border-radius: 10px` | Stretched gold active indicator dot. |
| `.quick-links-popover` | Block | `position: absolute`, `background: #ffffff`, `border-radius: 8px`, `box-shadow: 0 12px 32px rgba(0,0,0,0.2)`, `padding: 20px`, `z-index: 50` | Floating modal list of quick shortcuts on hero button click. |
| `.quick-links-popover__item`| Element | `display: flex`, `align-items: center`, `gap: 12px`, `padding: 10px`, `color: #1D2939`, `border-radius: 6px`, `text-decoration: none`, `transition: background 0.2s` | Individual shortcut item inside popup. |

#### CMS Parameters (Backend Config)
* `slides`: Array of:
  ```json
  {
    "id": "slide-1",
    "imageUrl": "/hero/cag-building.jpg",
    "titleEn": "Supreme Audit Institution of India",
    "titleHi": "भारत का सर्वोच्च लेखापरीक्षा संस्थान",
    "subtitleEn": "Promoting accountability, transparency and good governance through independent audit.",
    "ctaText": "View Latest Reports",
    "ctaUrl": "/Reports"
  }
  ```

---

### 2.2 Latest Reports Carousel

* **File Location**: [`src/features/home/LatestReports.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/features/home/LatestReports.tsx)
* **Purpose**: Displays a dynamic swipeable carousel of recently tabled Union & State Audit Reports with department tags, tabling date, and direct download links.
* **Where Used**: Homepage section 2.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.reports` | Block | `padding: 60px 64px`, `background: #ffffff`, `position: relative` | Outer container for Latest Reports section. |
| `.reports__inner` | Element | `max-width: 1200px`, `margin: 0 auto`, `display: flex`, `flex-direction: column`, `gap: 32px` | Content wrapper aligning heading and carousel. |
| `.reports__heading` | Element | `font-size: 28px`, `font-weight: 700`, `color: #1D2939`, `position: relative` | Section heading title with bottom maroon accent. |
| `.reports__description` | Element | `font-size: 15px`, `color: #667085`, `margin-top: -20px` | Sub-heading explaining the tabling authority. |
| `.reports__cards` | Element | `display: flex`, `gap: 24px`, `overflow-x: auto`, `scroll-behavior: smooth`, `padding-bottom: 12px` | Horizontal flex row holding report cards. |
| `.reports__nav-controls`| Element | `display: flex`, `gap: 12px`, `justify-content: flex-end`, `align-items: center` | Container for Previous / Next arrow buttons. |
| `.reports__nav-btn` | Element | `width: 40px`, `height: 40px`, `border-radius: 50%`, `border: 1px solid #D0D5DD`, `background: #ffffff`, `display: flex`, `align-items: center`, `justify-content: center`, `cursor: pointer` | Circular arrow button for scrolling carousel. |
| `.latest-report-card` | Block | `width: 320px`, `flex-shrink: 0`, `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `overflow: hidden`, `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`, `transition: transform 0.2s, box-shadow 0.2s` | Individual card wrapper on homepage carousel. |
| `.latest-report-card__banner`| Element | `width: 100%`, `height: 180px`, `position: relative`, `background: #142954`, `overflow: hidden` | Top cover image container with document graphic. |
| `.latest-report-card__body` | Element | `padding: 16px`, `display: flex`, `flex-direction: column`, `gap: 8px` | Card content area. |
| `.latest-report-card__meta` | Element | `display: flex`, `justify-content: space-between`, `align-items: center`, `font-size: 12px`, `color: #667085` | Row displaying Report Category and State tags. |
| `.latest-report-card__date` | Element | `font-size: 12px`, `font-weight: 500`, `color: #751639` | Formatted tabling date (e.g. `"14 Aug 2026"`). |
| `.latest-report-card__desc` | Element | `font-size: 14px`, `font-weight: 600`, `color: #1D2939`, `line-height: 1.4`, `display: -webkit-box`, `-webkit-line-clamp: 2`, `overflow: hidden` | 2-line truncated report title. |

---

### 2.3 Who We Are & Quick Links

* **File Location**: [`src/features/home/WhoWeAre.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/features/home/WhoWeAre.tsx)
* **Purpose**: Visual presentation of Constitutional Mandate (Articles 148-151), organizational statistics (e.g. 150+ Years, 45,000+ Personnel, 60+ Field Offices), and quick service shortcuts.
* **Where Used**: Homepage section 3.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.who-we-are` | Block | `padding: 60px 64px`, `background: #F8F9FA` | Light grey background section for institutional overview. |
| `.who-we-are__intro` | Element | `display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 48px`, `align-items: center` | 2-column layout: Mandate text on left, Stat cards on right. |
| `.who-we-are__details` | Element | `font-size: 15px`, `line-height: 1.7`, `color: #344054` | Rich explanatory paragraphs on CAG constitutional status. |
| `.cag-card` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 24px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.05)` | Card container for mandate features. |
| `.cag-card__icon` | Element | `width: 48px`, `height: 48px`, `background: rgba(117, 22, 57, 0.08)`, `color: #751639`, `border-radius: 8px`, `display: flex`, `align-items: center`, `justify-content: center` | Tinted icon badge. |
| `.cag-card__title` | Element | `font-size: 18px`, `font-weight: 700`, `color: #1D2939`, `margin-top: 12px` | Card feature header. |
| `.cag-card__desc` | Element | `font-size: 14px`, `color: #667085`, `line-height: 1.5`, `margin-top: 6px` | Card feature explanation text. |
| `.stats` | Block | `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 20px`, `margin-top: 40px` | 3-column statistics banner. |
| `.stat` | Element | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 20px`, `text-align: center` | Single KPI metric card. |
| `.stat__number` | Element | `font-size: 36px`, `font-weight: 800`, `color: #751639`, `line-height: 1` | Big bold numerical metric (e.g. `"150+"`, `"45,000+"`). |
| `.stat__caption` | Element | `font-size: 13px`, `color: #667085`, `margin-top: 6px`, `font-weight: 500` | Metric label below number. |
| `.quick-link` | Block | `display: flex`, `align-items: center`, `gap: 12px`, `padding: 14px 18px`, `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `color: #1D2939`, `text-decoration: none`, `transition: all 0.2s` | Quick service button card. |
| `.quick-link--active`| Modifier | `border-color: #751639`, `background: rgba(117, 22, 57, 0.04)`, `color: #751639` | Active/hover state with maroon border. |

---

### 2.4 CAG Message & Profile Card

* **File Location**: [`src/features/home/Details.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/features/home/Details.tsx)
* **Purpose**: Official welcome message and portrait of the incumbent Comptroller & Auditor General of India.
* **Where Used**: Homepage section 4.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.message-cag` | Block | `padding: 60px 64px`, `background: #ffffff` | Full section container for CAG message. |
| `.message-cag__card` | Element | `display: grid`, `grid-template-columns: 320px 1fr`, `gap: 48px`, `background: #F8F9FA`, `border: 1px solid #E4E7EC`, `border-radius: 12px`, `padding: 40px`, `align-items: center` | Two-column profile layout: Photo on left, Quote on right. |
| `.message-cag__photo` | Element | `width: 280px`, `height: 340px`, `border-radius: 8px`, `object-fit: cover`, `border: 4px solid #ffffff`, `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` | Portrait photograph of incumbent CAG. |
| `.message-cag__heading` | Element | `font-size: 24px`, `font-weight: 700`, `color: #751639`, `margin-bottom: 8px` | "Message from the CAG of India" heading. |
| `.message-cag__name` | Element | `font-size: 20px`, `font-weight: 700`, `color: #1D2939` | Full name and honorifics of the incumbent CAG. |
| `.message-cag__subheading`| Element | `font-size: 14px`, `color: #667085`, `margin-bottom: 16px` | Designation ("Comptroller and Auditor General of India"). |
| `.message-cag__body` | Element | `font-size: 15px`, `line-height: 1.8`, `color: #344054`, `font-style: italic` | Excerpt from official message / quote. |
| `.message-cag__divider` | Element | `width: 48px`, `height: 3px`, `background: #751639`, `margin: 16px 0` | Maroon horizontal accent beneath designation. |

#### CMS Parameters (Backend Config)
* `cagName`: String (e.g. `"Shri K. Sanjay Murthy"`)
* `cagPhotoUrl`: String (URL to official high-res portrait)
* `cagMessageEn`: String (English message body)
* `cagMessageHi`: String (Hindi message body)
* `readMoreUrl`: String (Link to `/About/About-Us/Cag-Of-India`)

---

### 2.5 News, Events & Media Cards

* **File Location**: [`src/features/home/NewsEvents.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/features/home/NewsEvents.tsx)
* **Purpose**: Multimedia hub displaying featured press releases, trending announcements, and YouTube video audit briefings.
* **Where Used**: Homepage section 5.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.news-events` | Block | `padding: 60px 64px`, `background: #F8F9FA` | Multimedia section container. |
| `.news-events__grid` | Element | `display: grid`, `grid-template-columns: 1.2fr 1fr`, `gap: 32px` | Grid splitting Featured News and Trending List. |
| `.featured-news` | Block | `position: relative`, `border-radius: 8px`, `overflow: hidden`, `background: #142954`, `color: #ffffff`, `min-height: 360px`, `display: flex`, `flex-direction: column`, `justify-content: flex-end`, `padding: 24px` | Hero image card for primary press release. |
| `.featured-news__photo`| Element | `position: absolute`, `inset: 0`, `width: 100%`, `height: 100%`, `object-fit: cover`, `opacity: 0.5` | Background photo for top news story. |
| `.featured-news__headline`| Element | `position: relative`, `z-index: 10`, `font-size: 20px`, `font-weight: 700`, `line-height: 1.3`, `color: #ffffff` | Main news headline text. |
| `.featured-news__date` | Element | `position: relative`, `z-index: 10`, `font-size: 12px`, `color: #D4AF37`, `margin-bottom: 6px` | Gold date tag on featured news. |
| `.trending-news` | Block | `display: flex`, `flex-direction: column`, `gap: 16px` | List of secondary trending updates. |
| `.trending-card` | Block | `display: flex`, `gap: 16px`, `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 12px`, `align-items: center`, `transition: transform 0.2s` | Compact horizontal story item. |
| `.trending-card__thumb`| Element | `width: 80px`, `height: 80px`, `border-radius: 6px`, `object-fit: cover`, `flex-shrink: 0` | Thumbnail photo. |
| `.trending-card__title`| Element | `font-size: 14px`, `font-weight: 600`, `color: #1D2939`, `line-height: 1.4` | Story headline. |
| `.videos` | Block | `margin-top: 40px` | Container for video gallery row. |
| `.video-card` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `overflow: hidden` | Video card with embedded thumbnail and play icon. |
| `.video-banner` | Element | `position: relative`, `width: 100%`, `height: 160px`, `background: #000000`, `display: flex`, `align-items: center`, `justify-content: center` | Video preview thumbnail container. |
| `.video-banner__play` | Element | `width: 48px`, `height: 48px`, `border-radius: 50%`, `background: rgba(117, 22, 57, 0.9)`, `color: #ffffff`, `display: flex`, `align-items: center`, `justify-content: center`, `cursor: pointer` | Circular play button overlay. |

---

## 5. Section 3: About Us & Global Relations

### 3.1 Sub-Site Banner (CMS Model Pattern)

* **File Location**: [`src/app/(pages)/Index-Menu-About/Global-relations/[slug]/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Index-Menu-About/Global-relations/[slug]/page.tsx)
* **Purpose**: Standardized top hero banner for all sub-sites and international engagement pages (INTOSAI, ASOSAI, SAI20, Bilateral Relations), featuring the partner organization logo, title, and navy geometric background.
* **Where Used**: All Global Relations slug pages and sub-site landing routes.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.sub-site-banner` | Block | `position: relative`, `width: 100%`, `height: 200px`, `background: #142954`, `border-radius: 8px`, `overflow: hidden`, `margin-bottom: 32px`, `display: flex`, `align-items: center`, `padding: 0 40px` | Outer banner card with dark navy foundation and smooth rounded corners. |
| `.sub-site-banner__bg` | Element | `position: absolute`, `inset: 0`, `width: 100%`, `height: 100%`, `pointer-events: none`, `z-index: 1` | Background decorative layer containing SVG geometric swooshes and gradient blurs. |
| `.sub-site-banner__content` | Element | `position: relative`, `z-index: 10`, `display: flex`, `align-items: center`, `gap: 24px` | Content row holding logo container and title text. |
| `.sub-site-banner__logo-wrapper`| Element | `width: 96px`, `height: 96px`, `background: #ffffff`, `border-radius: 8px`, `padding: 8px`, `display: flex`, `align-items: center`, `justify-content: center`, `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` | High-contrast white square frame highlighting partner organization logo. |
| `.sub-site-banner__logo` | Element | `max-width: 100%`, `max-height: 100%`, `object-fit: contain` | Organization logo image (e.g. INTOSAI, ASOSAI emblem). |
| `.sub-site-banner__title` | Element | `font-size: 28px`, `font-weight: 700`, `color: #ffffff`, `line-height: 1.2`, `text-shadow: 0 2px 4px rgba(0,0,0,0.3)` | Main banner title heading. |

#### Code Implementation Example
```tsx
{/* Sub-Site Banner Component */}
<div className="sub-site-banner">
  <div className="sub-site-banner__bg">
    <svg viewBox="0 0 978 200" className="w-full h-full" preserveAspectRatio="none">
      <path d="M0,0 L978,0 L978,200 L0,200 Z" fill="#142954" />
      <circle cx="850" cy="100" r="120" fill="rgba(255,255,255,0.05)" />
    </svg>
  </div>
  <div className="sub-site-banner__content">
    <div className="sub-site-banner__logo-wrapper">
      <img src={data.logo} alt={data.title} className="sub-site-banner__logo" />
    </div>
    <h1 className="sub-site-banner__title">{data.title}</h1>
  </div>
</div>
```

#### CMS Parameters (Backend Config)
```json
{
  "slug": "intosai",
  "title": "International Organization of Supreme Audit Institutions (INTOSAI)",
  "logo": "/images/global-relations/intosai-logo.png",
  "bannerBgColor": "#142954",
  "accentColor": "#D4AF37"
}
```

---

### 3.2 About Us Sidebar Navigation

* **File Location**: [`src/Reusable components/Side Menu/Aboutus_sidemenu/AboutusSidemenu.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/Reusable%20components/Side%20Menu/Aboutus_sidemenu/AboutusSidemenu.tsx)
* **Purpose**: Fixed left sticky sidebar for multi-tier About Us pages (CAG of India, Constitutional Mandate, Former CAGs, Audit Advisory Board, Organization Structure).
* **Where Used**: All subpages under `/About/About-Us/*`.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.about-sidebar` | Block | `width: 310px`, `background: #ffffff`, `border: 1px solid #EAEAEA`, `border-radius: 8px`, `padding: 24px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.04)` | Standard sidebar card container. |
| `.about-sidebar--flat` | Modifier | `width: 310px`, `background: #ffffff`, `border: 1px solid #EAEAEA`, `border-radius: 8px`, `padding: 24px`, `box-shadow: none` | Flat variant specified for Audit Advisory Board and specific subpages. |
| `.about-sidebar__heading` | Element | `font-size: 18px`, `font-weight: 700`, `color: #751639`, `margin-bottom: 16px` | Sidebar top section title ("About Us"). |
| `.about-sidebar__divider` | Element | `height: 1px`, `background: #EAEAEA`, `margin: 12px 0` | Subtle line separating navigation groups. |
| `.about-sidebar__group-heading`| Element | `font-size: 12px`, `font-weight: 600`, `color: #667085`, `text-transform: uppercase`, `letter-spacing: 0.5px`, `margin: 12px 0 6px` | Category label above related links. |
| `.about-sidebar__link` | Element | `display: flex`, `align-items: center`, `justify-content: space-between`, `padding: 10px 12px`, `border-radius: 6px`, `font-size: 14px`, `color: #344054`, `text-decoration: none`, `transition: all 0.2s` | Individual sidebar navigation link. |
| `.about-sidebar__link--active`| Modifier | `background: rgba(117, 22, 57, 0.08)`, `color: #751639`, `font-weight: 600`, `border-left: 3px solid #751639` | Highlights current active page in sidebar. |
| `.about-sidebar__sublist` | Element | `padding-left: 16px`, `margin-top: 4px`, `display: flex`, `flex-direction: column`, `gap: 4px` | Nested sub-tier navigation tree. |

---

### 3.3 Dual Flag Stand

* **File Location**: [`src/components/DualFlagStand.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/components/DualFlagStand.tsx)
* **Purpose**: High-fidelity bilateral diplomatic desk stand displaying the Indian Tricolour paired with partner nation flag (e.g. USA, UK, Japan, Australia, UAE) with polished brass base.
* **Where Used**: Bilateral Relations pages under Global Relations.

#### BEM Classes Specification

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.dual-flag` | Block | `display: flex`, `flex-direction: column`, `align-items: center`, `padding: 24px`, `position: relative` | Root stand container. |
| `.dual-flag__pole` | Element | `width: 3px`, `height: 140px`, `background: linear-gradient(180deg, #D4AF37 0%, #AA820A 100%)` | Brass metal flagpole. |
| `.dual-flag__flag--india` | Element | `width: 90px`, `height: 60px`, `box-shadow: 0 2px 6px rgba(0,0,0,0.2)` | Official SVG National Flag of India. |
| `.dual-flag__flag--partner`| Element | `width: 90px`, `height: 60px`, `box-shadow: 0 2px 6px rgba(0,0,0,0.2)` | Official SVG partner country flag. |
| `.dual-flag__base` | Element | `width: 120px`, `height: 16px`, `background: radial-gradient(circle, #D4AF37 0%, #8A6508 100%)`, `border-radius: 8px` | Polished brass circular desktop pedestal. |

---

### 3.4 Former CAG Cards

* **File Location**: [`src/Reusable components/Cards/Former CAG Cards/FormerCAGCards.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/Reusable%20components/Cards/Former%20CAG%20Cards/FormerCAGCards.tsx)
* **Purpose**: Historical gallery grid celebrating all former Comptrollers & Auditors General of India since 1948 with formal portraits and exact tenure dates.
* **Where Used**: `/About/About-Us/Former-Cags`.

#### BEM Classes Specification

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.former-cag-card` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `overflow: hidden`, `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`, `display: flex`, `flex-direction: column`, `transition: transform 0.2s` | Individual card container for historical leader. |
| `.former-cag-card__photo` | Element | `width: 100%`, `height: 240px`, `object-fit: cover`, `background: #F2F4F7` | Monochrome or color archival portrait photo. |
| `.former-cag-card__info-bar`| Element | `padding: 16px`, `display: flex`, `flex-direction: column`, `gap: 6px`, `text-align: center` | Bottom metadata bar. |
| `.former-cag-card__name` | Element | `font-size: 16px`, `font-weight: 700`, `color: #1D2939`, `line-height: 1.3` | Full name of former CAG (e.g. `"V. Narahari Rao"`). |
| `.former-cag-card__tenure`| Element | `font-size: 13px`, `color: #751639`, `font-weight: 600` | Tenure date range (e.g. `"1948 - 1954"`). |

---

### 3.5 Names & Details Cards

* **File Location**: [`src/Reusable components/Cards/Names & Details Cards/NamesDetailsCard.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/Reusable%20components/Cards/Names%20%26%20Details%20Cards/NamesDetailsCard.tsx)
* **Purpose**: Versatile card template used for Leadership bios, Audit Officers, Central Audit Directors, and Training Institute Heads.
* **Where Used**: Central-Audit-Offices, Traning-Institutes, Resources, Career pages.

#### BEM Classes Specification

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.detail-card` | Block | `display: flex`, `gap: 20px`, `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 20px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.05)` | Horizontal leadership & officer profile card. |
| `.detail-card__image` | Element | `width: 100px`, `height: 120px`, `border-radius: 6px`, `object-fit: cover`, `flex-shrink: 0` | Officer photo or organizational crest. |
| `.detail-card__body` | Element | `display: flex`, `flex-direction: column`, `gap: 6px`, `flex: 1` | Bio and contact information container. |
| `.detail-card__title` | Element | `font-size: 16px`, `font-weight: 700`, `color: #1D2939` | Officer name or office title. |
| `.detail-card__designation`| Element| `font-size: 13px`, `font-weight: 600`, `color: #751639` | Official government rank / designation. |
| `.detail-card__desc` | Element | `font-size: 13px`, `color: #667085`, `line-height: 1.5` | Scope of audit / responsibilities. |
| `.detail-card__cta` | Element | `margin-top: 8px`, `font-size: 13px`, `color: #751639`, `font-weight: 600`, `text-decoration: underline`, `cursor: pointer` | "View Profile" or "Contact Office" link. |

---

## 6. Section 4: Our Presence

### 4.1 Our Presence Layout & State Offices

* **File Location**: [`src/app/(pages)/Our-Presence/Index-Menu/State-Level-Offices/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Our-Presence/Index-Menu/State-Level-Offices/page.tsx)
* **Purpose**: Interactive directory of all 28 States & 8 Union Territories with State Accountant General (AG) offices, central audit directorates, and training academies.
* **Where Used**: All routes under `/Our-Presence/*`.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.op-page` | Block | `padding: 40px 64px`, `background: #ffffff` | Root page container for Our Presence directory. |
| `.op-page__title` | Element | `font-size: 28px`, `font-weight: 700`, `color: #1D2939`, `margin-bottom: 8px` | Main heading ("Our Presence Across India"). |
| `.op-page__divider` | Element | `height: 1px`, `background: #EAEAEA`, `margin: 20px 0 32px` | Horizontal separator below title. |
| `.op-states` | Block | `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 20px` | 3-column grid of state office cards. |
| `.op-state` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 20px`, `display: flex`, `gap: 16px`, `align-items: flex-start`, `transition: all 0.2s` | Individual State / UT office container. |
| `.op-state__icon` | Element | `width: 40px`, `height: 40px`, `background: rgba(117, 22, 57, 0.08)`, `color: #751639`, `border-radius: 8px`, `display: flex`, `align-items: center`, `justify-content: center` | Location pin or building icon. |
| `.op-state__name` | Element | `font-size: 16px`, `font-weight: 700`, `color: #1D2939` | State name (e.g. `"Maharashtra"`, `"Tamil Nadu"`). |
| `.op-state__office` | Element | `font-size: 13px`, `color: #667085`, `margin-top: 4px` | Office title (e.g. `"Office of the Principal Accountant General (Audit-I)"`). |
| `.op-state__details` | Element | `font-size: 12px`, `color: #98A2B3`, `margin-top: 6px` | Address & contact details. |
| `.op-state__link-icon` | Element | `color: #751639`, `font-size: 14px`, `margin-left: auto` | Arrow icon leading to State Subsite. |

---

## 7. Section 5: Audit Reports & Publications

### 7.1 Reports Search & Layout

* **File Location**: [`src/app/(pages)/Reports/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Reports/page.tsx)
* **Purpose**: Primary repository search engine for thousands of tabled CAG reports, supporting multi-facet filtering (Union/State, Financial Year, Sector, Report Type), keyword search, and pagination.
* **Where Used**: `/Reports` page.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.reports-page` | Block | `padding: 32px 64px`, `background: #F8F9FA`, `min-height: 100vh` | Page wrapper for report search engine. |
| `.reports-layout` | Block | `display: grid`, `grid-template-columns: 310px 1fr`, `gap: 32px` | 2-column layout: Sticky filters on left, Card grid on right. |
| `.card-grid` | Block | `display: grid`, `grid-template-columns: repeat(2, 1fr)`, `gap: 24px` | 2-column responsive grid rendering Report Cards. |
| `.page-title` | Block | `display: flex`, `justify-content: space-between`, `align-items: center`, `margin-bottom: 24px` | Header bar showing search title and result counter. |
| `.page-title__heading` | Element | `font-size: 24px`, `font-weight: 700`, `color: #1D2939` | Page title ("Audit Reports"). |
| `.page-title__count` | Element | `font-size: 14px`, `color: #667085`, `font-weight: 500` | Results counter (e.g. `"Showing 1,248 Reports"`). |
| `.page-search` | Block | `position: relative`, `width: 100%`, `margin-bottom: 20px` | Main keyword search input above filters. |
| `.page-search__input` | Element | `width: 100%`, `height: 44px`, `border: 1px solid #D0D5DD`, `border-radius: 8px`, `padding: 0 44px 0 16px`, `font-size: 14px`, `background: #ffffff` | Search bar input field. |
| `.page-search__icon` | Element | `position: absolute`, `right: 14px`, `top: 14px`, `color: #98A2B3` | Search icon button. |

---

### 7.2 Filters Sidemenu

* **File Location**: [`src/Reusable components/Side Menu/Filters_sidemenu/FiltersSidemenu.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/Reusable%20components/Side%20Menu/Filters_sidemenu/FiltersSidemenu.tsx)
* **Purpose**: Advanced multi-select faceted filter sidebar with Union/State segment tabs, expandable accordion groups, custom checkboxes, date ranges, and state search.
* **Where Used**: Left column of `/Reports` page.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.filters-panel` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 20px`, `box-shadow: 0 1px 3px rgba(0,0,0,0.05)` | Root filters container. |
| `.filters-panel__heading`| Element| `font-size: 16px`, `font-weight: 700`, `color: #1D2939`, `display: flex`, `justify-content: space-between`, `align-items: center` | "Filters" title row with Clear All button. |
| `.segmented-control` | Block | `display: flex`, `background: #F2F4F7`, `border-radius: 6px`, `padding: 4px`, `margin: 16px 0` | Pill container for Union vs State toggle. |
| `.segmented-control__btn`| Element| `flex: 1`, `padding: 8px`, `border: none`, `border-radius: 4px`, `font-size: 13px`, `font-weight: 600`, `color: #667085`, `background: transparent`, `cursor: pointer` | Individual toggle tab ("Union", "State"). |
| `.segmented-control__btn--active`| Modifier | `background: #ffffff`, `color: #751639`, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` | Active white tab with maroon text. |
| `.filter-group` | Block | `border-bottom: 1px solid #F2F4F7`, `padding: 16px 0` | Collapsible accordion section (Sector, Report Type, Year). |
| `.filter-group__header` | Element | `display: flex`, `justify-content: space-between`, `align-items: center`, `cursor: pointer` | Accordion clickable header. |
| `.filter-group__title` | Element | `font-size: 14px`, `font-weight: 600`, `color: #344054` | Accordion title text. |
| `.filter-group__chevron`| Element| `width: 16px`, `height: 16px`, `transition: transform 0.2s` | Arrow indicating open/collapsed state. |
| `.filter-group__list` | Element | `margin-top: 12px`, `display: flex`, `flex-direction: column`, `gap: 8px`, `max-height: 220px`, `overflow-y: auto` | Scrollable list of checkbox options. |
| `.filter-checkbox` | Block | `display: flex`, `align-items: center`, `gap: 10px`, `cursor: pointer` | Custom checkbox row item. |
| `.filter-checkbox__box` | Element | `width: 16px`, `height: 16px`, `border: 1px solid #D0D5DD`, `border-radius: 4px`, `display: flex`, `align-items: center`, `justify-content: center` | Checkbox square indicator. |
| `.filter-checkbox__label`| Element| `font-size: 13px`, `color: #475467` | Filter label text with count. |
| `.clear-all` | Block | `font-size: 12px`, `color: #751639`, `font-weight: 600`, `background: transparent`, `border: none`, `cursor: pointer` | Button resetting all active filters. |

---

### 7.3 Report Listing Cards

* **File Location**: [`src/app/(pages)/Reports/ReportListingCard.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Reports/ReportListingCard.tsx)
* **Purpose**: Primary card design for audit reports in search listings, featuring report cover art, metadata badges, title, summary, and download icon.
* **Where Used**: Report search listings and category pages.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.report-card` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `overflow: hidden`, `box-shadow: 0 1px 3px rgba(0,0,0,0.05)`, `display: flex`, `flex-direction: column`, `transition: all 0.2s` | Master card container for audit report. |
| `.report-card__banner` | Element | `width: 100%`, `height: 160px`, `position: relative`, `background: #142954`, `overflow: hidden` | Top visual thumbnail banner. |
| `.report-card__banner-img`| Element | `width: 100%`, `height: 100%`, `object-fit: cover` | Official report cover image. |
| `.report-card__body` | Element | `padding: 20px`, `display: flex`, `flex-direction: column`, `gap: 10px`, `flex: 1` | Content body containing title and meta. |
| `.report-card__caption` | Element | `font-size: 15px`, `font-weight: 700`, `color: #1D2939`, `line-height: 1.4` | Full official report title. |
| `.report-card__arrow-svg`| Element | `width: 18px`, `height: 18px`, `color: #751639`, `margin-left: auto` | Arrow icon leading to Report Detail page. |

---

### 7.4 Report Detail Page & Archive Drawer

* **File Location**: [`src/app/(pages)/Reports/[id]/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Reports/[id]/page.tsx)
* **Purpose**: Comprehensive view of a single Audit Report with executive summary, chapter breakdowns, full PDF download CTAs, and slide-out Archive Drawer for previous years.
* **Where Used**: `/Reports/[id]` dynamic route.

#### CSS Classes & Parameters

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.report-detail-heading` | Block | `margin-bottom: 32px`, `display: flex`, `flex-direction: column`, `gap: 12px` | Header block for single report title and metadata. |
| `.report-detail-card` | Block | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 12px`, `padding: 32px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.05)` | Main content card holding executive overview. |
| `.report-detail-card__col-img`| Element | `width: 240px`, `border-radius: 8px`, `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` | High-resolution 3D report cover mockup. |
| `.report-detail-card__paragraph`| Element | `font-size: 15px`, `line-height: 1.8`, `color: #344054`, `margin-bottom: 16px` | Audit findings paragraph text. |
| `.report-detail-cta` | Block | `display: inline-flex`, `align-items: center`, `gap: 10px`, `background: #751639`, `color: #ffffff`, `padding: 12px 24px`, `border-radius: 6px`, `font-weight: 600`, `cursor: pointer` | Primary PDF Download button. |
| `.archive-drawer` | Block | `position: fixed`, `top: 0`, `right: 0`, `width: 380px`, `height: 100vh`, `background: #ffffff`, `box-shadow: -4px 0 24px rgba(0,0,0,0.15)`, `z-index: 100`, `padding: 24px` | Slide-out drawer listing historical report editions. |
| `.year-row` | Block | `display: flex`, `justify-content: space-between`, `align-items: center`, `padding: 12px`, `border-bottom: 1px solid #F2F4F7` | Single year historical edition link. |

---

## 8. Section 6: Resources, Tenders, Circulars & Career

### 8.1 Tenders & Circulars Data Tables

* **File Location**: [`src/app/(pages)/Resources/Tenders/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Resources/Tenders/page.tsx) & [`Circulars/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/Resources/Circulars/page.tsx)
* **Purpose**: Tabular data grids for official government procurement notices, tenders, circulars, and recruitment notifications with live search and PDF attachments.
* **Where Used**: All legal notices and procurement pages.

#### BEM Classes Specification

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.data-table` | Block | `width: 100%`, `border-collapse: collapse`, `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `overflow: hidden` | Clean government data grid. |
| `.data-table__header` | Element | `background: #F8F9FA`, `border-bottom: 2px solid #E4E7EC`, `font-size: 13px`, `font-weight: 700`, `color: #344054`, `padding: 14px 16px`, `text-align: left` | Table header cell. |
| `.data-table__row` | Element | `border-bottom: 1px solid #F2F4F7`, `transition: background 0.15s` | Table row with light hover tint. |
| `.data-table__cell` | Element | `padding: 14px 16px`, `font-size: 14px`, `color: #1D2939` | Table data cell. |
| `.data-table--striped` | Modifier | `nth-child(even) { background: #FAFAFA }` | Alternating zebra stripe table rows. |

---

## 9. Section 7: State Subsites Template

* **File Location**: [`src/app/(pages)/states/andhra-pradesh/page.tsx`](file:///c:/newtechstack/CAG_Website_v2/src/app/(pages)/states/andhra-pradesh/page.tsx)
* **Purpose**: Dedicated micro-site template for state-level Accountant General offices with custom state hero, state AG leadership, state-specific reports, and local notifications.
* **Where Used**: `/states/[slug]` routes.

#### BEM Classes Specification

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.state-subsite` | Block | `width: 100%`, `min-height: 100vh`, `background: #F8F9FA` | Outer wrapper for state subsite portal. |
| `.state-subsite__hero` | Element | `height: 240px`, `background: linear-gradient(135deg, #142954 0%, #0b2545 100%)`, `color: #ffffff`, `padding: 40px 64px`, `display: flex`, `align-items: center` | State portal hero banner. |
| `.state-subsite__nav` | Element | `background: #751639`, `padding: 0 64px`, `height: 44px`, `display: flex`, `align-items: center`, `gap: 20px` | State subsite navigation menu. |
| `.state-subsite__card` | Element | `background: #ffffff`, `border: 1px solid #E4E7EC`, `border-radius: 8px`, `padding: 24px` | Content card for state news or audit findings. |

---

## 10. Section 8: Global Utility Classes & Modals

### 8.1 Buttons & Interactive Controls

| Class Name | Type | Key CSS Parameters / Properties | Purpose / Why It Is Used |
|---|---|---|---|
| `.btn` | Block | `display: inline-flex`, `align-items: center`, `justify-content: center`, `gap: 8px`, `padding: 10px 20px`, `border-radius: 6px`, `font-size: 14px`, `font-weight: 600`, `cursor: pointer`, `transition: all 0.2s` | Base button class across entire application. |
| `.btn--white` | Modifier | `background: #ffffff`, `color: #751639`, `border: 1px solid #ffffff`, `hover: background: #F8F9FA` | Solid white button used on dark hero banners. |
| `.btn--outline-white`| Modifier | `background: transparent`, `color: #ffffff`, `border: 1.5px solid #ffffff`, `hover: background: rgba(255,255,255,0.1)` | Outlined button on dark hero banners. |
| `.btn--outline-dark` | Modifier | `background: transparent`, `color: #1D2939`, `border: 1.5px solid #D0D5DD`, `hover: border-color: #751639` | Outlined dark button on light content pages. |
| `.icon-btn` | Block | `width: 36px`, `height: 36px`, `border-radius: 50%`, `display: flex`, `align-items: center`, `justify-content: center`, `border: 1px solid #D0D5DD`, `background: #ffffff`, `cursor: pointer` | Circular icon action button. |
| `.icon-btn--disabled`| Modifier | `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none` | Disabled state for pagination arrow buttons. |

---

## 11. Backend CMS Integration Parameter Dictionary

This dictionary defines the exact JSON schema and parameter mapping for backend developers configuring the CAG CMS:

| CMS Parameter Name | JSON Key | Data Type | Default Value | Target CSS Class / Component |
|---|---|---|---|---|
| **Sub-Site Title** | `title` | String | `"Bilateral Relations"` | `.sub-site-banner__title` |
| **Sub-Site Logo URL** | `logoUrl` | String | `"/logos/cag.png"` | `.sub-site-banner__logo` |
| **Banner Theme Color**| `bannerBg` | Hex Color | `"#142954"` | `.sub-site-banner` background |
| **Hero Slider List** | `heroSlides`| Array<Object>| `[...]` | `.hero__carousel`, `.hero__title` |
| **CAG Incumbent Name**| `cagName` | String | `"Shri K. Sanjay Murthy"`| `.message-cag__name` |
| **CAG Portrait URL** | `cagPhoto` | String | `"/officers/cag.jpg"` | `.message-cag__photo` |
| **CAG Welcome Quote**| `cagQuote` | String | `"Welcome to CAG..."` | `.message-cag__body` |
| **Key Statistics** | `stats` | Array<{num, label}>| `[{"num":"150+","label":"Years"}]` | `.stat__number`, `.stat__caption` |
| **Footer Address** | `address` | String | `"Deen Dayal Upadhyaya Marg..."`| `.site-footer` |
| **Policy Modal Text**| `policyHtml`| HTML String | `"<p>Terms of Use...</p>"` | `.policy-modal` body |
| **Report Filter Categories**| `categories`| Array<String> | `["Civil", "Commercial", "Defence"]`| `.filter-checkbox__label` |

---

## Quick Reference: Top 10 Most Common Classes

```css
/* 1. Sub-Site Banner */
.sub-site-banner { ... }
.sub-site-banner__title { ... }
.sub-site-banner__logo { ... }

/* 2. Sidebar Menu */
.about-sidebar { ... }
.about-sidebar__link { ... }
.about-sidebar__link--active { ... }

/* 3. Reports & Cards */
.report-card { ... }
.report-card__body { ... }
.report-card__caption { ... }

/* 4. Global Shell */
.site-header { ... }
.primary-nav { ... }
.site-footer { ... }
```

---

*Authored for the CAG Website v2 Development & Backend CMS Integration Team.*
