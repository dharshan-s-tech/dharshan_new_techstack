'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import { dataManager } from '@/lib/dataManager';

interface VolumeItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  size: string;
}

interface SectionItem {
  id: string;
  titleEn: string;
  titleHi: string;
  subEn?: string;
  subHi?: string;
  iconType: 'analytical' | 'thematic';
  volumes: VolumeItem[];
}

const HISTORY_SECTIONS: SectionItem[] = [
  {
    id: 'analytical',
    titleEn: 'CAG of India-Analytical History 1947-1989',
    titleHi: 'भारत के सीएजी - विश्लेषणात्मक इतिहास 1947-1989',
    iconType: 'analytical',
    volumes: [
      {
        id: 'a-1',
        titleEn: 'Volume I',
        titleHi: 'भाग I',
        descEn: 'Analytical History 1947-1989',
        descHi: 'विश्लेषणात्मक इतिहास 1947-1989',
        size: '34.7 MB'
      },
      {
        id: 'a-2',
        titleEn: 'Volume II',
        titleHi: 'भाग II',
        descEn: 'Analytical History 1947-1989',
        descHi: 'विश्लेषणात्मक इतिहास 1947-1989',
        size: '34.7 MB'
      }
    ]
  },
  {
    id: 'thematic-1',
    titleEn: 'A Thematic History 1990-2007 (Vol - 1)',
    titleHi: 'एक विषयगत इतिहास 1990-2007 (भाग - १)',
    subEn: 'The Comptroller & Auditor General of India - "A Thematic History 1990-2007" VOL-I',
    subHi: 'भारत के नियंत्रक और महालेखापरीक्षक - "एक विषयगत इतिहास 1990-2007" भाग-I',
    iconType: 'thematic',
    volumes: [
      {
        id: 't1-1',
        titleEn: 'Forward',
        titleHi: 'प्रस्तावना',
        descEn: 'A Thematic History 1990-2007 Vol 1',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग १',
        size: '34.7 MB'
      },
      {
        id: 't1-2',
        titleEn: 'Preface',
        titleHi: 'भूमिका',
        descEn: 'A Thematic History 1990-2007 Vol 1',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग १',
        size: '34.7 MB'
      },
      {
        id: 't1-3',
        titleEn: 'Brief Profile of Former C&AsG',
        titleHi: 'पूर्व सीएजी का संक्षिप्त परिचय',
        descEn: 'A Thematic History 1990-2007 Vol 1',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग १',
        size: '34.7 MB'
      },
      {
        id: 't1-4',
        titleEn: 'DAIs during the period 1990-2007',
        titleHi: '१९९०-२००७ की अवधि के दौरान डीएआई',
        descEn: 'A Thematic History 1990-2007 Vol 1',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग १',
        size: '34.7 MB'
      },
      {
        id: 't1-5',
        titleEn: 'General Abbreviations',
        titleHi: 'सामान्य संक्षिप्ताक्षर',
        descEn: 'A Thematic History 1990-2007 Vol 1',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग १',
        size: '34.7 MB'
      }
    ]
  },
  {
    id: 'thematic-2',
    titleEn: 'A Thematic History 1990-2007 (Vol - 2)',
    titleHi: 'एक विषयगत इतिहास 1990-2007 (भाग - २)',
    iconType: 'thematic',
    volumes: [
      {
        id: 't2-1',
        titleEn: 'Ch 10 - Railway Audit',
        titleHi: 'अध्याय १० - रेलवे ऑडिट',
        descEn: 'A Thematic History 1990-2007 Vol 2',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग २',
        size: '34.7 MB'
      },
      {
        id: 't2-2',
        titleEn: 'Ch 11 - Audit of Scientific Departments',
        titleHi: 'अध्याय ११ - वैज्ञानिक विभागों का ऑडिट',
        descEn: 'A Thematic History 1990-2007 Vol 2',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग २',
        size: '34.7 MB'
      },
      {
        id: 't2-3',
        titleEn: 'Ch 12 - Performance Audit',
        titleHi: 'अध्याय १२ - प्रदर्शन ऑडिट',
        descEn: 'A Thematic History 1990-2007 Vol 2',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग २',
        size: '34.7 MB'
      },
      {
        id: 't2-4',
        titleEn: 'Ch 13 - Audit of Autonomous Bodies',
        titleHi: 'अध्याय १३ - स्वायत्त निकायों का ऑडिट',
        descEn: 'A Thematic History 1990-2007 Vol 2',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग २',
        size: '34.7 MB'
      },
      {
        id: 't2-5',
        titleEn: 'Ch 14 - Audit of Local Bodies - A Collaborative Approach',
        titleHi: 'अध्याय १४ - स्थानीय निकायों का ऑडिट - एक सहयोगी दृष्टिकोण',
        descEn: 'A Thematic History 1990-2007 Vol 2',
        descHi: 'एक विषयगत इतिहास 1990-2007 भाग २',
        size: '34.7 MB'
      }
    ]
  }
];

export default function HistoryPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [previewVolume, setPreviewVolume] = useState<VolumeItem | null>(null);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const filteredSections = activeTab === 'all'
    ? HISTORY_SECTIONS
    : HISTORY_SECTIONS.filter(sec => sec.id === activeTab);

  const renderIcon = (type: 'analytical' | 'thematic') => {
    if (type === 'analytical') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="6" x2="15" y2="6" strokeLinecap="round" />
          <line x1="9" y1="10" x2="15" y2="10" strokeLinecap="round" />
          <line x1="9" y1="14" x2="13" y2="14" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 17V9" />
        <path d="M12 17V7" />
        <path d="M15 17V11" />
      </svg>
    );
  };

  return (
    <AboutLayout title={isHindi ? 'भारतीय लेखापरीक्षा और लेखा विभाग का इतिहास' : 'History of Indian Audit and Accounts Department'}>
      <div className="flex flex-col gap-6 w-full text-left">
        
        <p className="text-sm leading-relaxed text-zinc-600 m-0">
          {isHindi
            ? 'भारतीय लेखापरीक्षा और लेखा विभाग (IA&AD) का इतिहास आधुनिक भारत में सरकारी लेखांकन और वित्तीय नियंत्रण के विकास के साथ निकटता से जुड़ा हुआ है। नीचे इसके संस्थागत इतिहास का लेखा-जोखा देने वाले आधिकारिक ऐतिहासिक रिपोर्ट खंड दिए गए हैं:'
            : 'The history of the Indian Audit and Accounts Department (IA&AD) is closely linked to the evolution of government accounting and financial controls in modern India. Below are the official historical report volumes documenting its institutional history:'}
        </p>

        {/* Selection Tabs / Chips */}
        <div className="flex flex-wrap gap-3 items-center" role="tablist">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#2A2A2A] border-[#2A2A2A] text-white shadow-sm'
                : 'bg-white border-[#D7D7D7] text-[#2A2A2A] hover:bg-zinc-50'
            }`}
            role="tab"
            aria-selected={activeTab === 'all'}
          >
            {isHindi ? 'सभी देखें' : 'Show All'}
          </button>
          {HISTORY_SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 cursor-pointer ${
                activeTab === sec.id
                  ? 'bg-[#2A2A2A] border-[#2A2A2A] text-white shadow-sm'
                  : 'bg-white border-[#D7D7D7] text-[#2A2A2A] hover:bg-zinc-50'
              }`}
              role="tab"
              aria-selected={activeTab === sec.id}
            >
              {isHindi ? sec.titleHi : sec.titleEn}
            </button>
          ))}
        </div>

        {/* Sections Listing */}
        <div className="flex flex-col gap-6 w-full">
          {filteredSections.map(section => {
            const secTitle = isHindi ? section.titleHi : section.titleEn;
            const secSub = isHindi ? section.subHi : section.subEn;
            
            return (
              <section 
                key={section.id} 
                className="w-full bg-white border border-[#E6E6E6] rounded-lg p-6 shadow-[4px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-5 text-left"
                aria-labelledby={`sec-heading-${section.id}`}
              >
                {/* Section Header */}
                <div className="flex items-center gap-4">
                  {/* Styled Circle with white outline SVG */}
                  <div className="w-8 h-8 rounded-full bg-[#751639] flex items-center justify-center text-white flex-shrink-0" aria-hidden="true">
                    {renderIcon(section.iconType)}
                  </div>
                  <h3 id={`sec-heading-${section.id}`} className="text-lg md:text-xl font-bold text-[#2E2E31] m-0" style={{ fontFamily: 'Noto Sans' }}>
                    {secTitle}
                  </h3>
                </div>

                {/* Horizontal Line Divider */}
                <div className="w-full h-[1px] bg-[#D7D7D7] m-0" aria-hidden="true" />

                {/* Optional Subtitle */}
                {secSub && (
                  <h4 className="text-sm md:text-base font-semibold text-zinc-900 m-0 leading-snug">
                    {secSub}
                  </h4>
                )}

                {/* Volume/Chapter PDF list */}
                <div className="flex flex-col gap-4 w-full">
                  {section.volumes.map(vol => {
                    const volTitle = isHindi ? vol.titleHi : vol.titleEn;
                    const volDesc = isHindi ? vol.descHi : vol.descEn;
                    
                    return (
                      <div 
                        key={vol.id}
                        className="w-full p-3 px-4 bg-[#FAFAFA] border-l-2 border-[#751639] flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-r-lg"
                      >
                        {/* Text Details */}
                        <div className="flex flex-col gap-1 text-left">
                          <strong className="text-sm font-semibold text-black m-0 leading-tight">
                            {volTitle}
                          </strong>
                          <span className="text-xs text-[#565656] m-0">
                            {volDesc}
                          </span>
                        </div>

                        {/* PDF Action block */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* File PDF graphic */}
                          <svg width="24" height="30" viewBox="0 0 24 32" fill="none" className="text-red-600 flex-shrink-0" aria-hidden="true">
                            <path d="M4 2 H14 L20 8 V30 H4 Z" fill="#F4F4F4" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                            <path d="M14 2 V8 H20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
                            <text x="12" y="22" fill="currentColor" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PDF</text>
                          </svg>
                          
                          {/* Size & Action triggers */}
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[10px] text-[#565656] m-0 leading-none">
                              {vol.size}
                            </span>
                            <button
                              onClick={() => setPreviewVolume(vol)}
                              className="text-xs text-[#0D61AE] underline font-normal bg-transparent border-none p-0 cursor-pointer hover:text-blue-800 focus:outline-none"
                            >
                              {isHindi ? 'पीडीएफ देखें' : 'View PDF'}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </section>
            );
          })}
        </div>

      </div>

      {/* Simulated Premium Document PDF Viewer Modal */}
      {previewVolume && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
          onClick={() => setPreviewVolume(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full max-w-4xl bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh] relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Toolbar Header */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-700 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <svg width="20" height="26" viewBox="0 0 24 32" fill="none" className="text-red-500" aria-hidden="true">
                  <path d="M4 2 H14 L20 8 V30 H4 Z" fill="#F4F4F4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M14 2 V8 H20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col text-left">
                  <h4 className="text-sm font-bold m-0 leading-snug truncate max-w-[280px] md:max-w-md">
                    {isHindi ? previewVolume.titleHi : previewVolume.titleEn}
                  </h4>
                  <span className="text-[10px] text-zinc-400">
                    {isHindi ? previewVolume.descHi : previewVolume.descEn} ({previewVolume.size})
                  </span>
                </div>
              </div>

              {/* Toolbar Buttons */}
              <div className="flex items-center gap-3">
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Downloading file is simulated.'); }}
                  className="bg-[#751639] hover:bg-[#500c25] text-white text-xs px-3 py-1.5 rounded font-semibold transition-all flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  {isHindi ? 'डाउनलोड करें' : 'Download'}
                </a>
                
                <button 
                  onClick={() => setPreviewVolume(null)}
                  className="text-zinc-400 hover:text-white focus:outline-none"
                  aria-label="Close PDF viewer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Document Content Scroll View */}
            <div className="flex-grow bg-zinc-700 overflow-y-auto p-8 flex justify-center custom-scrollbar">
              
              {/* Simulated Paper Sheet */}
              <div className="w-full max-w-[595px] min-h-[842px] bg-white border border-zinc-200 p-12 text-zinc-900 shadow-lg flex flex-col gap-6 text-left relative">
                
                {/* Government Header Stamp */}
                <div className="flex flex-col items-center justify-center text-center gap-2 border-b border-zinc-300 pb-6 w-full">
                  <span className="text-[10px] tracking-[4px] uppercase text-zinc-500 font-bold block">
                    SUPREME AUDIT INSTITUTION OF INDIA
                  </span>
                  <h1 className="text-base font-bold uppercase tracking-wider text-[#751639] m-0">
                    COMPTROLLER AND AUDITOR GENERAL OF INDIA
                  </h1>
                  <span className="text-[11px] text-zinc-400">
                    Official Historical Archive Publications
                  </span>
                </div>

                {/* Content Details */}
                <div className="flex flex-col gap-4 mt-4">
                  <h2 className="text-xl font-bold text-[#751639] border-b border-zinc-200 pb-2 m-0">
                    {isHindi ? previewVolume.titleHi : previewVolume.titleEn}
                  </h2>
                  <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                    {isHindi ? previewVolume.descHi : previewVolume.descEn}
                  </span>

                  <p className="text-xs leading-relaxed text-zinc-700 mt-2">
                    {isHindi
                      ? 'यह दस्तावेज़ भारत के नियंत्रक और महालेखापरीक्षक कार्यालय के आधिकारिक प्रकाशनों और ऐतिहासिक अभिलेखों का एक हिस्सा है। इसे केवल शैक्षणिक, संगठनात्मक लेखा परीक्षा समीक्षा और संदर्भ के लिए प्रस्तुत किया गया है।'
                      : 'This document constitutes an official archival record of the Office of the Comptroller and Auditor General of India. It has been digitized and presented for institutional record, administrative auditing references, and public transparency studies.'}
                  </p>

                  <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200 mt-4 flex flex-col gap-3">
                    <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                      {isHindi ? 'सार संक्षेप और विषयवस्तु:' : 'Executive Summary & Contents:'}
                    </span>
                    <ol className="list-decimal pl-5 text-xs text-zinc-600 space-y-2">
                      <li>
                        <strong>{isHindi ? 'अध्याय १: संगठनात्मक शुरुआत' : 'Chapter 1: Institutional Origins'}</strong>
                        <p className="m-0 mt-0.5 text-zinc-500">
                          {isHindi ? 'लेखापरीक्षा संवर्ग का उदय और ईस्ट इंडिया कंपनी से ब्रिटिश क्राउन को सत्ता हस्तांतरण।' : 'The birth of unified audit cadres and transitional controls from the East India Company to the British Crown.'}
                        </p>
                      </li>
                      <li>
                        <strong>{isHindi ? 'अध्याय २: संवैधानिक जनादेश' : 'Chapter 2: Constitutional Mandates'}</strong>
                        <p className="m-0 mt-0.5 text-zinc-500">
                          {isHindi ? 'अनुच्छेद १४८ के तहत नियंत्रक एवं महालेखापरीक्षक के कार्यालय की स्थापना।' : 'Designation of the CAG under Article 148 and statutory independence regulations.'}
                        </p>
                      </li>
                      <li>
                        <strong>{isHindi ? 'अध्याय ३: लेखापरीक्षा प्रणाली में सुधार' : 'Chapter 3: Auditing Reforms'}</strong>
                        <p className="m-0 mt-0.5 text-zinc-500">
                          {isHindi ? 'लेखा और लेखापरीक्षा का पृथक्करण, रेलवे और रक्षा लेखापरीक्षा का विकास।' : 'Separation of accounts from audits, defense audits, and railway board review standards.'}
                        </p>
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Footer Stamp */}
                <div className="absolute bottom-12 left-12 right-12 border-t border-zinc-200 pt-4 flex justify-between items-center text-[10px] text-zinc-400">
                  <span>© Office of CAG of India</span>
                  <span>Simulated PDF Preview - Page 1 of 465</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </AboutLayout>
  );
}
