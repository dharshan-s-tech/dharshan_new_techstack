'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

interface SidebarLink {
  name: string;
  nameHi: string;
  href: string;
  filterKey?: string;
}

interface SidebarGroup {
  heading: string;
  headingHi: string;
  links: SidebarLink[];
}

export default function OurPresenceLayout({ 
  title, 
  activeTab = '', 
  children 
}: { 
  title: string; 
  activeTab?: string; 
  children: React.ReactNode 
}) {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const groups: SidebarGroup[] = [
    {
      heading: 'State Level Offices',
      headingHi: 'राज्य स्तरीय कार्यालय',
      links: [
        { 
          name: 'State Account & Entitlement', 
          nameHi: 'राज्य लेखा एवं हकदारी', 
          href: '/Our-Presence/Index-Menu/State-Level-Offices?filter=ae', 
          filterKey: 'ae' 
        },
        { 
          name: 'State Audit Offices', 
          nameHi: 'राज्य लेखा परीक्षा कार्यालय', 
          href: '/Our-Presence/Index-Menu/State-Level-Offices?filter=audit', 
          filterKey: 'audit' 
        }
      ]
    },
    {
      heading: 'Central Audit Offices',
      headingHi: 'केंद्रीय लेखा परीक्षा कार्यालय',
      links: [
        { 
          name: 'Defense', 
          nameHi: 'रक्षा', 
          href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=defense', 
          filterKey: 'defense' 
        },
        { 
          name: 'Railway', 
          nameHi: 'रेलवे', 
          href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=railway', 
          filterKey: 'railway' 
        },
        { 
          name: 'Other Ministries', 
          nameHi: 'अन्य मंत्रालय', 
          href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=other', 
          filterKey: 'other' 
        },
        { 
          name: 'Overseas', 
          nameHi: 'विदेशी', 
          href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=overseas', 
          filterKey: 'overseas' 
        }
      ]
    },
    {
      heading: 'Training Institutes',
      headingHi: 'प्रशिक्षण संस्थान',
      links: [
        { 
          name: 'Regional Capacity Building and Knowledge Institutes...', 
          nameHi: 'क्षेत्रीय क्षमता निर्माण और ज्ञान संस्थान...', 
          href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=regional', 
          filterKey: 'regional' 
        },
        { 
          name: 'International Centre for Environment Audit and...', 
          nameHi: 'पर्यावरण लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र...', 
          href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=iced', 
          filterKey: 'iced' 
        },
        { 
          name: 'International Centre for Information Systems and Audit...', 
          nameHi: 'सूचना प्रणाली और लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र...', 
          href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=icisa', 
          filterKey: 'icisa' 
        },
        { 
          name: 'National Academy of Audit &Accounts (NAAA)', 
          nameHi: 'राष्ट्रीय लेखा परीक्षा और लेखा अकादमी (NAAA)', 
          href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=naaa', 
          filterKey: 'naaa' 
        },
        { 
          name: 'International Centre for Audit of Local Governance (iCAL)', 
          nameHi: 'स्थानीय शासन लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCAL)', 
          href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=ical', 
          filterKey: 'ical' 
        }
      ]
    }
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-8 op-page">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Menu matching Figma spec */}
        <aside 
          className="w-full lg:w-[310px] shrink-0 bg-white border border-[#E6E6E6] rounded-[8px] p-6 shadow-[4px_4px_20px_rgba(0,0,0,0.04)]"
          aria-label="Sidebar Menu"
        >
          <div className="flex flex-col gap-4">
            <div className="w-full border-t border-[#D7D7D7]" aria-hidden="true" />

            <div className="flex flex-col gap-4" data-name="Menus">
              {groups.map((grp, idx) => (
                <div key={idx} data-name={grp.heading} className="flex flex-col gap-1">
                  <h2 className="font-bold text-[16px] leading-[22px] text-[#2A2A2A] px-4 py-2 text-left font-['Noto_Sans']">
                    {isHindi ? grp.headingHi : grp.heading}
                  </h2>
                  <div className="flex flex-col gap-1 pl-4" data-name="Sub Menus">
                    {grp.links.map((link) => {
                      const isTabActive = activeTab === link.filterKey;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`text-left text-[14px] leading-[19px] px-4 py-2 font-['Noto_Sans'] transition-all ${
                            isTabActive
                              ? 'bg-[#751639] text-white font-semibold border-l-0'
                              : 'text-[#2A2A2A] font-normal border-l border-[#D7D7D7] hover:underline bg-white'
                          }`}
                        >
                          {isHindi ? link.nameHi : link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-grow w-full min-w-0">
          <h1 className="text-[24px] leading-[38px] font-bold text-[#751639] text-left font-['Noto_Sans']">
            {title}
          </h1>
          <div className="w-full h-[1px] bg-[#B0B0B0] my-4" aria-hidden="true" />
          {children}
        </main>
      </div>
    </div>
  );
}
