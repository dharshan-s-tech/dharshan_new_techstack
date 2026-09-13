'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourcesLayout from './ResourcesLayout';
import { dataManager } from '@/lib/dataManager';

interface ResourceCategory {
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  href: string;
  count: number;
  items: { nameEn: string; nameHi: string; href: string }[];
}

const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    titleEn: 'Policies',
    titleHi: 'नीतियां',
    descEn: 'Official recruitment rules, citizen charter mandates, RTI proactive disclosures, and departmental guidelines.',
    descHi: 'आधिकारिक भर्ती नियम, नागरिक अधिकार पत्र जनादेश, आरटीआई सक्रिय प्रकटीकरण और विभागीय दिशानिर्देश।',
    href: '/Resources/Recruitment-Policy',
    count: 6,
    items: [
      { nameEn: 'Recruitment Policy', nameHi: 'भर्ती नीति', href: '/Resources/Recruitment-Policy' },
      { nameEn: 'Citizen Charter', nameHi: 'नागरिक अधिकार पत्र', href: '/Resources/Citizen-Charter' },
      { nameEn: 'Right to Information Policy', nameHi: 'सूचना का अधिकार नीति', href: '/Resources/Right-to-Information-Policy' },
      { nameEn: 'Administrative Information Policy', nameHi: 'प्रशासनिक सूचना नीति', href: '/Resources/Administrative-Information-Policy' },
      { nameEn: 'Social Media Policy', nameHi: 'सोशल मीडिया नीति', href: '/Resources/Social-Media-Policy' },
      { nameEn: 'PIDPI Policy for Circulation', nameHi: 'पीआईडीपीआई नीति', href: '/Resources/PIDPI-Policy-for-Circulation' }
    ]
  },
  {
    titleEn: 'Publications',
    titleHi: 'प्रकाशन',
    descEn: 'Annual institutional reports, international peer reviews, State PSU accounts, and bilingual journals.',
    descHi: 'वार्षिक संस्थागत प्रतिवेदन, अंतर्राष्ट्रीय पीयर समीक्षाएं, राज्य पीएसयू खाते और द्विभाषी पत्रिकाएं।',
    href: '/Resources/Annual-Report',
    count: 5,
    items: [
      { nameEn: 'Annual Report', nameHi: 'वार्षिक प्रतिवेदन', href: '/Resources/Annual-Report' },
      { nameEn: 'Peer Review Report', nameHi: 'पीयर रिव्यू रिपोर्ट', href: '/Resources/Peer-Review-Report' },
      { nameEn: 'Status of Accounts of State PSUs', nameHi: 'राज्य पीएसयू खातों की स्थिति', href: '/Resources/Status-of-Accounts-of-State-PSUs' },
      { nameEn: 'Study Reports & Compendia', nameHi: 'अध्ययन रिपोर्ट एवं संग्रह', href: '/Resources/Study-Reports-and-Compendia' },
      { nameEn: 'Rajbhasha e-Patrika', nameHi: 'राजभाषा ई-पत्रिका', href: '/Resources/Rajbhasha-e-Patrika' }
    ]
  },
  {
    titleEn: 'Standards & Guidance',
    titleHi: 'मानक एवं मार्गदर्शन',
    descEn: 'Standing orders, auditing standards (GASAB), practice guides, performance guidelines, and MSO manuals.',
    descHi: 'स्थायी आदेश, लेखापरीक्षा मानक (GASAB), अभ्यास गाइड, निष्पादन दिशानिर्देश और एमएसओ नियमावली।',
    href: '/Resources/Standing-Orders',
    count: 4,
    items: [
      { nameEn: 'Standing Orders', nameHi: 'स्थायी आदेश', href: '/Resources/Standing-Orders' },
      { nameEn: 'Guidelines', nameHi: 'दिशा-निर्देश', href: '/Resources/Guidelines' },
      { nameEn: 'Guidance Notes & Practice Guides', nameHi: 'मार्गदर्शन नोट एवं अभ्यास गाइड', href: '/Resources/Guidance-Notes' },
      { nameEn: 'Manuals (MSO Audit & Admin)', nameHi: 'नियमावली (एमएसओ)', href: '/Resources/Manuals' }
    ]
  },
  {
    titleEn: 'Media & Archives',
    titleHi: 'मीडिया एवं पुरालेख',
    descEn: 'Official press statements, speeches by CAG leadership, photographic archives, and video documentaries.',
    descHi: 'आधिकारिक प्रेस वक्तव्य, सीएजी नेतृत्व के भाषण, फोटो पुरालेख और वीडियो वृत्तचित्र।',
    href: '/Resources/Press-Releases',
    count: 4,
    items: [
      { nameEn: 'Press Releases', nameHi: 'प्रेस विज्ञप्तियां', href: '/Resources/Press-Releases' },
      { nameEn: 'Speeches', nameHi: 'भाषण एवं वक्तव्य', href: '/Resources/Speeches' },
      { nameEn: 'Photo Gallery', nameHi: 'फोटो गैलरी', href: '/Resources/Photo-Gallery' },
      { nameEn: 'Video Gallery', nameHi: 'वीडियो गैलरी', href: '/Resources/Video-Gallery' }
    ]
  }
];

export default function ResourcesMainPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const filteredCategories = RESOURCE_CATEGORIES.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleEn = cat.titleEn.toLowerCase();
    const titleHi = cat.titleHi.toLowerCase();
    const descEn = cat.descEn.toLowerCase();
    const itemMatch = cat.items.some(
      (item) => item.nameEn.toLowerCase().includes(q) || item.nameHi.toLowerCase().includes(q)
    );
    return titleEn.includes(q) || titleHi.includes(q) || descEn.includes(q) || itemMatch;
  });

  return (
    <ResourcesLayout
      categoryTitle="Resources"
      categoryTitleHi="संसाधन"
      pageTitle="Knowledge & Resource Hub"
      pageTitleHi="ज्ञान एवं संसाधन केंद्र"
    >
      <div className="w-full flex flex-col gap-6 font-['Noto_Sans',sans-serif]">
        
        {/* Hero Header Banner (972px × 142px) */}
        <div 
          className="relative w-full h-[142px] rounded-[8px] overflow-hidden flex items-center px-8 shadow-sm"
          style={{
            background: 'linear-gradient(108deg, #751639 0%, #8b1e46 55%, #59102b 100%)'
          }}
        >
          {/* Subtle Background Pattern Geometry */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="res-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#res-pattern)" />
            </svg>
          </div>

          <div 
            className="absolute -right-16 top-0 bottom-0 w-[300px] bg-white/10 skew-x-[-24deg] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h1 className="text-[24px] md:text-[28px] font-bold leading-[38px] text-[#FFFFFF] tracking-tight">
              {isHindi ? 'संसाधन एवं ज्ञान केंद्र' : 'Resources & Knowledge Hub'}
            </h1>
            <p className="text-[14px] font-medium text-white/80 mt-1">
              {isHindi 
                ? 'आधिकारिक नीतियां, लेखापरीक्षा नियमावली, प्रकाशन एवं संस्थागत दिशानिर्देश' 
                : 'Official Policies, Audit Manuals, Publications & Institutional Guidelines'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-[#EAEAEA]">
          <div className="relative w-full sm:w-[350px]">
            <input
              type="search"
              placeholder={isHindi ? 'संसाधनों में खोजें...' : 'Search across all resources...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] pl-4 pr-10 bg-white border border-[#4D4D4D] rounded-[8px] text-[14px] text-[#2A2A2A] placeholder-[#717171] focus:outline-none focus:ring-1 focus:ring-[#751639]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4D4D4D]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="#4D4D4D" strokeWidth="1.3"/>
                <path d="M10.5 10.5L14 14" stroke="#4D4D4D" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <span className="text-[12px] text-zinc-500 font-medium">
            {filteredCategories.length} {isHindi ? 'श्रेणियां उपलब्ध' : 'categories available'}
          </span>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {filteredCategories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] border border-[#E6E6E6] rounded-[8px] p-6 shadow-xs hover:shadow-md hover:border-[#751639]/40 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-[18px] font-bold text-[#751639]">
                    {isHindi ? cat.titleHi : cat.titleEn}
                  </h2>
                  <span className="text-[11px] font-semibold bg-[#751639]/10 text-[#751639] px-2.5 py-0.5 rounded-full">
                    {cat.count} {isHindi ? 'दस्तावेज' : 'sections'}
                  </span>
                </div>
                
                <p className="text-[13px] text-zinc-600 leading-[20px] mb-4">
                  {isHindi ? cat.descHi : cat.descEn}
                </p>

                {/* Sub-links list */}
                <div className="flex flex-col gap-1.5 pt-3 border-t border-zinc-100">
                  {cat.items.slice(0, 4).map((item, i) => (
                    <Link
                      key={i}
                      href={item.href}
                      className="text-[13px] text-zinc-700 hover:text-[#751639] hover:underline flex items-center gap-1.5 font-medium"
                    >
                      <span className="text-[#751639] text-[10px]">›</span>
                      <span>{isHindi ? item.nameHi : item.nameEn}</span>
                    </Link>
                  ))}
                  {cat.items.length > 4 && (
                    <span className="text-[11px] text-zinc-400 italic">
                      +{cat.items.length - 4} {isHindi ? 'अन्य...' : 'more...'}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100">
                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#751639] hover:underline"
                >
                  <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ResourcesLayout>
  );
}
