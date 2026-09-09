# Global Relations Only - Isolated Feature Integration Guide

This guide contains **ONLY** the specific isolated additions and updates for **Global Relations** and its **Admin Panel modules**. Applying these snippets will **NOT** affect or overwrite any other existing pages, reports, tenders, or components in your project.

---

## 📌 Summary of Targeted Files to Update:

1. `src/app/(pages)/About/Index-Menu-About/Global-relations/[slug]/page.tsx` *(Replace File)*
2. `src/app/globals.css` *(Append CSS Rules)*
3. `src/Components/Menu/Menu.tsx` *(Add Active Route Check)*
4. `src/lib/admin-modules.ts` *(Add 3 Config Keys)*
5. `src/components/admin/Sidebar.tsx` *(Add Nav Group)*
6. `src/lib/dataManager.ts` *(Add Getter/Setter Methods & Interfaces)*

---

## 🚀 STEP 1: Global Relations Page Component
**File to replace entirely:** `src/app/(pages)/About/Index-Menu-About/Global-relations/[slug]/page.tsx`
*(This file only controls `/Global-relations/*` routes and does not affect any other page).*

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

interface SidebarLink {
  name: string;
  hindiName: string;
  slug: string;
}

interface SidebarGroup {
  heading: string;
  hindiHeading: string;
  links: SidebarLink[];
}

export default function GlobalRelationsDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slugDecoded = decodeURIComponent(resolvedParams.slug).toLowerCase();
  
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [officers, setOfficers] = useState(() => dataManager.getInternationalOfficers());
  const [bilateralCountriesList, setBilateralCountriesList] = useState(() => dataManager.getBilateralCountries());

  useEffect(() => {
    setLang(dataManager.getLanguage());
    setOfficers(dataManager.getInternationalOfficers());
    setBilateralCountriesList(dataManager.getBilateralCountries());

    const handleLangChange = () => setLang(dataManager.getLanguage());
    const handleOfficerChange = () => setOfficers(dataManager.getInternationalOfficers());
    const handleCountryChange = () => setBilateralCountriesList(dataManager.getBilateralCountries());

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('internationalOfficersChange', handleOfficerChange);
    window.addEventListener('bilateralCountriesChange', handleCountryChange);
    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('internationalOfficersChange', handleOfficerChange);
      window.removeEventListener('bilateralCountriesChange', handleCountryChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const groups: SidebarGroup[] = [
    {
      heading: 'International Bodies',
      hindiHeading: 'अंतर्राष्ट्रीय निकाय',
      links: [
        { name: 'Association with INTOSAI', hindiName: 'INTOSAI के साथ जुड़ाव', slug: 'association with intosai' },
        { name: 'Association with ASOSAI', hindiName: 'ASOSAI के साथ जुड़ाव', slug: 'association with asosai' },
        { name: 'Multilateral Engagement', hindiName: 'बहुपक्षीय सहभागिता', slug: 'multilateral engagement' }
      ]
    },
    {
      heading: 'Bilateral Relations',
      hindiHeading: 'द्विपक्षीय संबंध',
      links: [
        { name: 'Bilateral Relations', hindiName: 'द्विपक्षीय संबंध', slug: 'bilateral relations' }
      ]
    },
    {
      heading: 'Audit Engagements',
      hindiHeading: 'लेखा परीक्षा सहभागिता',
      links: [
        { name: 'UN Panel of External Auditors', hindiName: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल', slug: 'un panel of external auditors' },
        { name: 'Present International Audits', hindiName: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा', slug: 'present international audits' },
        { name: 'Past International Audits', hindiName: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा', slug: 'past international audits' },
        { name: 'Overseas Audit Offices', hindiName: 'विदेशी लेखा परीक्षा कार्यालय', slug: 'overseas audit offices' }
      ]
    },
    {
      heading: 'Training Institutes',
      hindiHeading: 'प्रशिक्षण संस्थान',
      links: [
        { name: 'iCED', hindiName: 'iCED', slug: 'iced' },
        { name: 'iCISA', hindiName: 'iCISA', slug: 'icisa' },
        { name: 'NAAA', hindiName: 'NAAA', slug: 'naaa' },
        { name: 'iCAL', hindiName: 'iCAL', slug: 'ical' }
      ]
    },
    {
      heading: 'Contact',
      hindiHeading: 'संपर्क',
      links: [
        { name: 'International Relations Wing', hindiName: 'अंतर्राष्ट्रीय संबंध विंग', slug: 'international relations wing' }
      ]
    }
  ];

  const activeGroup = groups.find(g => g.links.some(l => l.slug === slugDecoded)) || groups[0];

  const formattedTitle = slugDecoded === 'association with intosai' ? 'Association with INTOSAI'
    : slugDecoded === 'association with asosai' ? 'Association with ASOSAI'
    : slugDecoded === 'multilateral engagement' ? 'Engagement with Multilateral Forums'
    : slugDecoded === 'bilateral relations' ? 'Bilateral Relations'
    : slugDecoded === 'un panel of external auditors' ? 'UN Panel of External Auditors'
    : slugDecoded === 'present international audits' ? 'Present International Audits'
    : slugDecoded === 'past international audits' ? 'Past International Audits'
    : slugDecoded === 'overseas audit offices' ? 'Overseas Audit Offices'
    : slugDecoded === 'iced' ? 'International Centre for Environment Audit and Sustainable Development (iCED)'
    : slugDecoded === 'icisa' ? 'International Centre for Information Systems and Audit (iCISA)'
    : slugDecoded === 'naaa' ? 'National Academy of Audit and Accounts (NAAA)'
    : slugDecoded === 'ical' ? 'International Centre for Local Governance and Audit (iCAL)'
    : 'International relation wing';

  const logoImageSrc = slugDecoded === 'association with intosai' ? '/assets/CAG of India-1_img_2.png'
    : slugDecoded === 'association with asosai' ? '/assets/CAG of India-10_img_2.png'
    : slugDecoded === 'un panel of external auditors' ? '/assets/CAG of India-2_img_2.png'
    : slugDecoded === 'present international audits' ? '/assets/CAG of India-3_img_2.png'
    : slugDecoded === 'past international audits' ? '/assets/CAG of India-4_img_2.png'
    : slugDecoded === 'overseas audit offices' ? '/assets/CAG of India-5_img_2.png'
    : slugDecoded === 'iced' ? '/assets/CAG of India-6_img_2.png'
    : slugDecoded === 'icisa' ? '/assets/CAG of India-7_img_2.png'
    : slugDecoded === 'naaa' ? '/assets/CAG of India-8_img_2.png'
    : '/assets/CAG of India-1_img_2.png';

  const showSidebar = slugDecoded !== 'bilateral relations';

  return (
    <div className="w-full min-h-screen bg-white font-['Noto_Sans',sans-serif] text-[#2A2A2A] pb-[80px]">
      <div className="max-w-[1440px] mx-auto px-[64px] pt-[24px] flex flex-col gap-[24px]">

        <nav className="flex items-center gap-[8px] text-[12px] leading-[16px] text-[#565656]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#751639] transition-colors">
            {isHindi ? 'गृह' : 'Home'}
          </Link>
          <span className="text-[#565656] font-normal">&gt;</span>
          <Link href="/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI" className="hover:text-[#751639] transition-colors">
            {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
          </Link>
          <span className="text-[#565656] font-normal">&gt;</span>
          <span className="font-semibold text-[#2E2E31]">
            {formattedTitle}
          </span>
        </nav>

        <div className="w-full flex flex-col lg:flex-row items-start gap-[30px]">

          {showSidebar && (
            <aside className="about-sidebar">
              <h2 className="about-sidebar__heading">
                {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
              </h2>
              <div className="about-sidebar__divider" />
              <div className="w-full flex flex-col">
                <div className="about-sidebar__group-heading">
                  <span>
                    {isHindi ? activeGroup.hindiHeading : activeGroup.heading}
                  </span>
                </div>
                <div className="about-sidebar__sublist">
                  {activeGroup.links.map((link) => {
                    const isActive = slugDecoded === link.slug;
                    return (
                      <Link
                        key={link.slug}
                        href={`/About/Index-Menu-About/Global-relations/${encodeURIComponent(link.name)}`}
                        className={`about-sidebar__link ${isActive ? 'about-sidebar__link--active' : ''}`}
                      >
                        <span className="truncate">
                          {isHindi ? link.hindiName : link.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          <main className="flex-1 w-full flex flex-col gap-[24px]">

            {showSidebar && (
              <div className="relative w-full max-w-[929.1px] h-[141.33px] bg-[#751639] rounded-[8px] overflow-hidden flex items-center justify-between shadow-sm">
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{
                    backgroundImage: 'radial-gradient(circle at 80% 50%, #ffffff 1px, transparent 1px)',
                    backgroundSize: '12px 12px'
                  }}
                />
                <h1 className="relative z-10 pl-[37.48px] pr-4 text-[24px] leading-[34px] font-bold text-white font-['Noto_Sans'] max-w-[650px] text-left">
                  {formattedTitle}
                </h1>
                <div 
                  className="relative z-10 w-[206px] h-[141px] bg-white flex items-center justify-center shrink-0"
                  style={{
                    clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)'
                  }}
                >
                  <div className="w-[100px] h-[80px] flex items-center justify-center p-2">
                    <img 
                      src={logoImageSrc} 
                      alt={formattedTitle} 
                      className="max-w-[85px] max-h-[70px] object-contain" 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className={`w-full ${showSidebar ? 'max-w-[957.24px]' : 'max-w-[1312px]'} text-[14px] leading-[24px] font-[500] text-[#2A2A2A] flex flex-col gap-[16px] text-left pt-2`}>

              {/* Bilateral Relations */}
              {slugDecoded === 'bilateral relations' && (
                <div className="w-full flex flex-col gap-4">
                  <p className="font-bold text-[#000000] text-[16px] leading-[24px]">
                    Presently SAI India has MoUs/twinning arrangements with 29 Supreme Audit Institutions viz.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 my-2">
                    {bilateralCountriesList.map((country, idx) => (
                      <div key={country.id || idx} className="w-full h-[170px] border border-[#E6E6E6] rounded-[8px] bg-white p-3 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-[80px] h-[70px] flex items-center justify-center pt-2">
                          {country.flag_image_url ? (
                            <img src={country.flag_image_url} alt={country.country_name} className="max-h-[50px] max-w-[70px] object-contain" />
                          ) : (
                            <svg className="w-16 h-12 text-[#751639]" viewBox="0 0 64 48" fill="none">
                              <path d="M12 8L28 32M28 32L32 38M28 32L12 38" stroke="#B38B4D" strokeWidth="2.5" strokeLinecap="round"/>
                              <path d="M52 8L36 32M36 32L32 38M28 32L12 38" stroke="#B38B4D" strokeWidth="2.5" strokeLinecap="round"/>
                              <rect x="6" y="10" width="16" height="10" fill="#FF9933" rx="1"/>
                              <rect x="6" y="13.3" width="16" height="3.4" fill="#FFFFFF"/>
                              <rect x="6" y="16.6" width="16" height="3.4" fill="#138808"/>
                              <rect x="42" y="10" width="16" height="10" fill="#751639" rx="1"/>
                            </svg>
                          )}
                        </div>

                        <div className="w-full border-t border-[#E6E6E6] my-1" />

                        <span className="font-semibold text-[#2A2A2A] text-[14px] text-center">
                          {isHindi && country.country_name_hi ? country.country_name_hi : country.country_name}
                        </span>
                      </div>
                    ))}

                    <div className="w-full h-[170px] border border-[#E6E6E6] rounded-[8px] bg-white p-3 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                      <span className="font-semibold text-[#2A2A2A] text-[13px] leading-[18px]">
                        INTOSAI<br />Development<br />Initiative (IDI)
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold text-[#2A2A2A] text-[14px] leading-[22px] mt-2">
                    Regular bilateral exchanges like bilateralseminars, training programmes, secondments, capacity building workshops, hand holding for specific audits etc. are held under these arrangements.
                  </p>
                </div>
              )}

              {/* International Relations Wing */}
              {(slugDecoded === 'international relations wing' || ['association with intosai', 'association with asosai', 'multilateral engagement', 'bilateral relations', 'un panel of external auditors', 'present international audits', 'past international audits', 'overseas audit offices', 'iced', 'icisa', 'naaa', 'ical'].indexOf(slugDecoded) === -1) && (
                <div className="w-full flex flex-col gap-[24px] text-left pt-2">
                  <div className="flex flex-col gap-[14px] text-[#751639] font-medium text-[14px] leading-[24px] mb-2">
                    <p>Comptroller and Auditor General of India Supreme Audit Institution of India</p>
                    <p>International Relations Division</p>
                  </div>

                  <div className="w-full flex flex-col gap-[22px]">
                    {officers.map((officer, i) => (
                      <div 
                        key={officer.id || i} 
                        className="w-full max-w-[929px] min-h-[183px] border border-black/17 rounded-[4px] flex items-center overflow-hidden bg-white shadow-sm"
                      >
                        <div className="w-[179px] h-[183px] shrink-0 bg-zinc-100 overflow-hidden">
                          <img 
                            src={officer.photo_url || '/assets/officer_subramanian.png'} 
                            alt={officer.officer_name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        <div className="p-6 flex flex-col justify-between flex-1 gap-2">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-[18px] leading-[24px] font-semibold text-[#2A2A2A]">
                              {officer.officer_name}
                            </h3>
                            <p className="text-[14px] leading-[24px] font-normal text-[#2A2A2A]">
                              {officer.designation}
                            </p>
                          </div>
                          <a 
                            href={`mailto:${officer.email}`} 
                            className="text-[15px] leading-[24px] font-normal text-[#751639] hover:underline"
                            style={{ color: '#751639' }}
                          >
                            Email: {officer.email}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 STEP 2: CSS Rules
**File to append to:** `src/app/globals.css`
*(Add these CSS classes at the bottom of `globals.css`)*

```css
/* Global Relations Side Menu Figma Parity */
.about-sidebar {
  width: 310px;
  min-height: 320px;
  background: #FFFFFF;
  border: 1px solid #E6E6E6;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.about-sidebar__heading {
  font-family: 'Noto Sans', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #000000;
}

.about-sidebar__divider {
  width: 100%;
  height: 1px;
  background: #D7D7D7;
}

.about-sidebar__group-heading {
  font-family: 'Noto Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #2A2A2A;
  padding-bottom: 8px;
}

.about-sidebar__sublist {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.about-sidebar__link {
  font-family: 'Noto Sans', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #2A2A2A;
  padding: 8px 12px;
  border-left: 1px solid #D7D7D7;
  transition: all 0.2s ease;
}

.about-sidebar__link--active {
  background: rgba(117, 22, 57, 0.08);
  border-radius: 4px;
  color: #751639;
  font-weight: 600;
  border-left: none !important;
}
```

---

## 🚀 STEP 3: Admin Modules Registration
**File to append to:** `src/lib/admin-modules.ts`
*(Add these 3 module configs inside the `ADMIN_MODULES` object in `admin-modules.ts`)*

```typescript
  'global-relations': {
    table: 'global_relations_pages',
    title: 'Global Relations Pages',
    addTitle: 'Add Page',
    searchColumn: 'formatted_title',
    columns: [
      { key: 'formatted_title', label: 'Page Title' },
      { key: 'slug', label: 'Slug / Route' },
      { key: 'category_heading', label: 'Group Heading' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'slug', label: 'URL Slug (e.g. association-with-intosai)', type: 'text', required: true },
      { name: 'formatted_title', label: 'Page Title', type: 'text', required: true },
      { name: 'category_heading', label: 'Parent Group', type: 'select', required: true, options: [
        { value: 'International Bodies', label: 'International Bodies' },
        { value: 'Bilateral Relations', label: 'Bilateral Relations' },
        { value: 'Audit Engagements', label: 'Audit Engagements' },
        { value: 'Training Institutes', label: 'Training Institutes' },
        { value: 'Contact', label: 'Contact' }
      ]},
      { name: 'logo_image_url', label: 'Emblem Logo Badge', type: 'image' },
      { name: 'body_content_en', label: 'Body Content (English)', type: 'richtext' },
      { name: 'body_content_hi', label: 'Body Content (Hindi)', type: 'richtext', isHindi: true },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'bilateral-countries': {
    table: 'bilateral_countries',
    title: 'Bilateral Countries',
    addTitle: 'Add Country',
    searchColumn: 'country_name',
    columns: [
      { key: 'country_name', label: 'Country Name' },
      { key: 'flag_image_url', label: 'Flag Emblem', type: 'image' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'country_name', label: 'Country Name (English)', type: 'text', required: true },
      { name: 'country_name_hi', label: 'Country Name (Hindi)', type: 'text', isHindi: true },
      { name: 'flag_image_url', label: 'Flag Image', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
  'international-officers': {
    table: 'international_officers',
    title: 'International Officers',
    addTitle: 'Add Officer',
    searchColumn: 'officer_name',
    columns: [
      { key: 'officer_name', label: 'Officer Name' },
      { key: 'designation', label: 'Designation' },
      { key: 'email', label: 'Email' },
      { key: 'photo_url', label: 'Photo', type: 'image' },
      { key: 'display_order', label: 'Order' },
      { key: 'is_active', label: 'Status', type: 'boolean' },
    ],
    formFields: [
      { name: 'officer_name', label: 'Officer Name', type: 'text', required: true },
      { name: 'designation', label: 'Designation', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'text', required: true },
      { name: 'photo_url', label: 'Photo Image', type: 'image' },
      { name: 'display_order', label: 'Display Order', type: 'number' },
      { name: 'is_active', label: 'Active', type: 'boolean' },
    ]
  },
```

---

## 🚀 STEP 4: Admin Navigation Sidebar
**File to update:** `src/components/admin/Sidebar.tsx`
*(Add this navigation group into the `NAV` array in `Sidebar.tsx`)*

```typescript
  {
    group: 'Global Relations', icon: Globe, items: [
      { label: 'Global Relations Pages', href: '/admin/global-relations', icon: Globe },
      { label: 'Bilateral Countries', href: '/admin/bilateral-countries', icon: Map },
      { label: 'International Officers', href: '/admin/international-officers', icon: Users },
    ]
  },
```

---

## 🚀 STEP 5: Data Manager Helper Methods
**File to append to:** `src/lib/dataManager.ts`
*(Add these methods into the `dataManager` object in `dataManager.ts`)*

```typescript
  getBilateralCountries(): BilateralCountryItem[] {
    if (typeof window === 'undefined') return DEFAULT_BILATERAL_COUNTRIES;
    try {
      const stored = localStorage.getItem('cag_bilateral_countries');
      if (!stored) {
        localStorage.setItem('cag_bilateral_countries', JSON.stringify(DEFAULT_BILATERAL_COUNTRIES));
        return DEFAULT_BILATERAL_COUNTRIES;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_BILATERAL_COUNTRIES;
    } catch (e) {
      return DEFAULT_BILATERAL_COUNTRIES;
    }
  },

  saveBilateralCountry(item: BilateralCountryItem) {
    if (typeof window === 'undefined') return;
    const list = this.getBilateralCountries();
    const idx = list.findIndex(b => b.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_bilateral_countries', JSON.stringify(list));
    window.dispatchEvent(new Event('bilateralCountriesChange'));
  },

  deleteBilateralCountry(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getBilateralCountries().filter(b => b.id !== id);
    localStorage.setItem('cag_bilateral_countries', JSON.stringify(list));
    window.dispatchEvent(new Event('bilateralCountriesChange'));
  },

  getInternationalOfficers(): InternationalOfficerItem[] {
    if (typeof window === 'undefined') return DEFAULT_INTERNATIONAL_OFFICERS;
    try {
      const stored = localStorage.getItem('cag_international_officers');
      if (!stored) {
        localStorage.setItem('cag_international_officers', JSON.stringify(DEFAULT_INTERNATIONAL_OFFICERS));
        return DEFAULT_INTERNATIONAL_OFFICERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_INTERNATIONAL_OFFICERS;
    } catch (e) {
      return DEFAULT_INTERNATIONAL_OFFICERS;
    }
  },

  saveInternationalOfficer(item: InternationalOfficerItem) {
    if (typeof window === 'undefined') return;
    const list = this.getInternationalOfficers();
    const idx = list.findIndex(o => o.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_international_officers', JSON.stringify(list));
    window.dispatchEvent(new Event('internationalOfficersChange'));
  },

  deleteInternationalOfficer(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getInternationalOfficers().filter(o => o.id !== id);
    localStorage.setItem('cag_international_officers', JSON.stringify(list));
    window.dispatchEvent(new Event('internationalOfficersChange'));
  },
```
