'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

interface VolumeItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn?: string;
  descHi?: string;
  size: string;
}

interface SectionItem {
  id: string;
  titleEn: string;
  titleHi: string;
  subEn?: string;
  subHi?: string;
  iconPath: string;
  volumes: VolumeItem[];
}

const HISTORY_SECTIONS: SectionItem[] = [
  {
    id: 'analytical',
    titleEn: 'CAG of India - Analytical History 1947-1989',
    titleHi: 'भारत के सीएजी - विश्लेषणात्मक इतिहास 1947-1989',
    iconPath: '/assets/Images/history of iaad/Analytical History 1.svg',
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
    titleHi: 'एक विषयगत इतिहास 1990-2007 (भाग - 1)',
    subEn: 'The Comptroller & Auditor General of India - "A Thematic History 1990-2007" VOL-I',
    subHi: 'भारत के नियंत्रक और महालेखापरीक्षक - "एक विषयगत इतिहास 1990-2007" भाग-I',
    iconPath: '/assets/Images/history of iaad/Analytical History2.svg',
    volumes: [
      { id: 't1-1', titleEn: 'Forward', titleHi: 'प्रस्तावना', size: '34.7 MB' },
      { id: 't1-2', titleEn: 'Preface', titleHi: 'भूमिका', size: '34.7 MB' },
      { id: 't1-3', titleEn: 'Brief Profile of Former C&AsG', titleHi: 'पूर्व सीएजी का संक्षिप्त परिचय', size: '34.7 MB' },
      { id: 't1-4', titleEn: 'DAIs during the period 1990-2007', titleHi: '1990-2007 की अवधि के दौरान डीएआई', size: '34.7 MB' },
      { id: 't1-5', titleEn: 'General Abbreviations', titleHi: 'सामान्य संक्षिप्ताक्षर', size: '34.7 MB' },
      { id: 't1-6', titleEn: 'Contents', titleHi: 'विषय-सूची', size: '34.7 MB' },
      { id: 't1-7', titleEn: 'Ch 1 - Overview', titleHi: 'अध्याय 1 - अवलोकन', size: '34.7 MB' },
      { id: 't1-8', titleEn: 'Ch 2 - Developments in Government Policies and Public Administration and tdeirimpact on C&AG\'s Audit and Organization.', titleHi: 'अध्याय 2 - सरकारी नीतियों और लोक प्रशासन में विकास तथा सीएजी के लेखापरीक्षा एवं संगठन पर उनका प्रभाव', size: '34.7 MB' },
      { id: 't1-9', titleEn: 'Ch 3 - Organization of C&AG', titleHi: 'अध्याय 3 - सीएजी का संगठन', size: '34.7 MB' },
      { id: 't1-10', titleEn: 'Ch 4 - Developments in Auditing', titleHi: 'अध्याय 4 - लेखापरीक्षा में विकास', size: '34.7 MB' },
      { id: 't1-11', titleEn: 'Ch 5 - Audit Reports (Civil)', titleHi: 'अध्याय 5 - लेखापरीक्षा रिपोर्ट (नागरिक)', size: '34.7 MB' },
      { id: 't1-12', titleEn: 'Ch 6 - Audit of Receipts', titleHi: 'अध्याय 6 - प्राप्तियों की लेखापरीक्षा', size: '34.7 MB' },
      { id: 't1-13', titleEn: 'Ch 7 - Commercial Audit', titleHi: 'अध्याय 7 - वाणिज्यिक लेखापरीक्षा', size: '34.7 MB' },
      { id: 't1-14', titleEn: 'Ch 8 - Defence Audit', titleHi: 'अध्याय 8 - रक्षा लेखापरीक्षा', size: '34.7 MB' },
      { id: 't1-15', titleEn: 'Ch 9 - Post and Telecommunications', titleHi: 'अध्याय 9 - डाक और दूरसंचार', size: '34.7 MB' },
      { id: 't1-16', titleEn: 'Photographs', titleHi: 'तस्वीरें', size: '34.7 MB' }
    ]
  },
  {
    id: 'thematic-2',
    titleEn: 'A Thematic History 1990-2007 (Vol - 2)',
    titleHi: 'एक विषयगत इतिहास 1990-2007 (भाग - 2)',
    iconPath: '/assets/Images/history of iaad/Analytical History 3.svg',
    volumes: [
      { id: 't2-1', titleEn: 'Ch 10 - Railway Audit', titleHi: 'अध्याय 10 - रेलवे लेखापरीक्षा', size: '34.7 MB' },
      { id: 't2-2', titleEn: 'Ch 11 - Audit of Scientific Departments', titleHi: 'अध्याय 11 - वैज्ञानिक विभागों की लेखापरीक्षा', size: '34.7 MB' },
      { id: 't2-3', titleEn: 'Ch 12 - Performance Audit', titleHi: 'अध्याय 12 - निष्पादन लेखापरीक्षा', size: '34.7 MB' },
      { id: 't2-4', titleEn: 'Ch 13 - Audit of Autonomous Bodies', titleHi: 'अध्याय 13 - स्वायत्त निकायों की लेखापरीक्षा', size: '34.7 MB' },
      { id: 't2-5', titleEn: 'Ch 14 - Audit of Local Bodies - A Collaborative Approach', titleHi: 'अध्याय 14 - स्थानीय निकायों की लेखापरीक्षा - एक सहयोगी दृष्टिकोण', size: '34.7 MB' }
    ]
  }
];

const FigmaAnalyticalHistoryIcon = () => (
  <div className="w-[24px] h-[24px] flex items-center justify-center relative">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rectangle 34625711 (Stroke) */}
      <rect x="2" y="2" width="17.95" height="17.84" rx="2" stroke="#FFFFFF" strokeWidth="1.2" />
      
      {/* Line 1594 (Stroke) */}
      <line x1="2.2" y1="6" x2="19.75" y2="6" stroke="#FFFFFF" strokeWidth="0.8" />
      
      {/* Ellipse 780, 781, 782 */}
      <circle cx="13.08" cy="4" r="0.6" fill="#FFFFFF" />
      <circle cx="15.21" cy="4" r="0.6" fill="#FFFFFF" />
      <circle cx="17.34" cy="4" r="0.6" fill="#FFFFFF" />
      
      {/* Vector 604 (Stroke) Trend Line */}
      <path d="M6.9 10.4L9.3 7.6L11.7 9.5L14.3 7.6" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Rectangle 34625712 (Stroke) */}
      <rect x="6.23" y="9.57" width="9.42" height="3.66" rx="0.5" stroke="#FFFFFF" strokeWidth="0.8" />
      
      {/* Line 1595, 1596 (Stroke) Bars */}
      <line x1="8.64" y1="13.2" x2="8.64" y2="11.14" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="11.61" y1="13.2" x2="11.61" y2="12.12" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" />
      
      {/* Ellipse 779 & Line 1597 (Stroke) */}
      <circle cx="4.92" cy="15.7" r="0.55" fill="#FFFFFF" />
      <line x1="6.48" y1="15.7" x2="12.5" y2="15.7" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      
      {/* History Clock Shield & Ring (Ellipse 778 & Vector 605) */}
      <circle cx="17.6" cy="17.6" r="4.6" fill="#751639" />
      <circle cx="17.6" cy="17.6" r="4.3" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M17.6 14.8V17.6H19.3" stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const FigmaThematicHistoryIcon = () => (
  <div className="w-[24px] h-[24px] flex items-center justify-center relative">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rectangle 34625713 (Stroke) top right tab */}
      <rect x="17.53" y="2" width="4.46" height="7.59" rx="1" stroke="#FFFFFF" strokeWidth="0.85" />
      
      {/* Rectangle 34625714 (Stroke) bottom page */}
      <rect x="2" y="10" width="15.93" height="6.05" rx="1" stroke="#FFFFFF" strokeWidth="0.85" />
      
      {/* Rectangle 34625715 (Stroke) main book page */}
      <rect x="5.15" y="2" width="14.71" height="15.79" rx="1.5" stroke="#FFFFFF" strokeWidth="1.1" fill="#751639" />
      
      {/* Para Vectors 606, 607, 608, 609 */}
      <line x1="8.1" y1="7" x2="16.1" y2="7" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
      <line x1="8.1" y1="9.2" x2="16.1" y2="9.2" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
      <line x1="8.1" y1="11.4" x2="14.8" y2="11.4" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
      <line x1="8.1" y1="13.6" x2="13.2" y2="13.6" stroke="#FFFFFF" strokeWidth="0.85" strokeLinecap="round" />
      
      {/* History Clock Shield & Ring (Ellipse 778 & Vector 605) */}
      <circle cx="18.8" cy="12.8" r="3.2" fill="#751639" />
      <circle cx="18.8" cy="12.8" r="2.6" stroke="#FFFFFF" strokeWidth="0.85" />
      <path d="M18.8 11.2V12.8H19.9" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const RedPdfIcon = () => (
  <img 
    src="/assets/pdf-red-icon.png" 
    alt="PDF Icon" 
    width={27} 
    height={32} 
    className="w-[27px] h-[32px] object-contain flex-shrink-0"
  />
);

export default function HistoryPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'analytical': true,
    'thematic-1': true,
    'thematic-2': true
  });
  const [previewVolume, setPreviewVolume] = useState<VolumeItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    dataManager.fetchPageData('page-history-of-indian-audit-and-accounts-department', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      dataManager.fetchPageData('page-history-of-indian-audit-and-accounts-department', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
        if (isMounted && res) setPageData(res);
      });
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => {
      isMounted = false;
      window.removeEventListener('languageChange', handleLangChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';
  const pageTitle = pageData?.title || (isHindi ? 'भारतीय लेखापरीक्षा और लेखा विभाग का इतिहास' : 'History of Indian Audit and Accounts Department');

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AboutLayout title={pageTitle}>
      <div className="flex flex-col items-start w-full max-w-[978px]">
        {/* Main Section Title matching Figma CSS */}
        <h1 
          className="text-2xl font-bold mb-6 text-left self-start"
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '160%',
            color: '#751639'
          }}
        >
          {pageTitle}
        </h1>

        {/* Sections Listing */}
        <div className="flex flex-col gap-6 w-full">
          {HISTORY_SECTIONS.map(section => {
            const isOpen = openSections[section.id] !== false;
            const secTitle = isHindi ? section.titleHi : section.titleEn;
            const secSub = isHindi ? section.subHi : section.subEn;

            return (
              <div 
                key={section.id} 
                className="w-full flex flex-col gap-3"
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-2 border-b border-[#D7D7D7] cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    {/* Local SVG icon exported from Figma */}
                    <img 
                      src={section.iconPath} 
                      alt="" 
                      width={32} 
                      height={32} 
                      className="w-[32px] h-[32px] rounded-full flex-shrink-0 object-contain" 
                    />

                    <h2 
                      className="text-base font-bold text-[#2E2E31] m-0"
                      style={{
                        fontFamily: 'Noto Sans, sans-serif',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '22px',
                        color: '#2E2E31'
                      }}
                    >
                      {secTitle}
                    </h2>
                  </div>

                  {/* Chevron Icon */}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#2A2A2A" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="relative w-full pt-2 pb-1">
                    {/* Left Vertical Line matching Figma Line 1599 / Line 1600 / Line 1601 (#751639) */}
                    <div 
                      className="absolute top-0 bottom-0 left-[15.5px] w-[1.5px] bg-[#751639] z-0 pointer-events-none" 
                      aria-hidden="true"
                    />

                    <div className="flex flex-col gap-3 w-full pl-[36px]">
                      {/* Optional Subtitle */}
                      {secSub && (
                        <h3 
                          className="text-sm font-semibold text-[#000000] my-1"
                          style={{
                            fontFamily: 'Noto Sans, sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '19px'
                          }}
                        >
                          {secSub}
                        </h3>
                      )}

                      {/* PDF Items List */}
                      <div className="flex flex-col gap-2 w-full">
                        {section.volumes.map(vol => {
                          const volTitle = isHindi ? vol.titleHi : vol.titleEn;
                          const volDesc = isHindi ? vol.descHi : vol.descEn;

                          return (
                            <div 
                              key={vol.id}
                              className="w-full min-h-[56px] bg-[#FAFAFA] border-l-2 border-[#FAFAFA] hover:border-[#500C25] rounded px-4 py-2 flex items-center justify-between gap-4 transition-colors duration-150"
                            >
                              {/* Left Text */}
                              <div className="flex flex-col justify-center text-left max-w-[75%]">
                                <span 
                                  className="text-sm font-semibold text-[#000000] block"
                                  style={{
                                    fontFamily: 'Noto Sans, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    lineHeight: '19px',
                                    color: '#000000'
                                  }}
                                >
                                  {volTitle}
                                </span>
                                {volDesc && (
                                  <span 
                                    className="text-xs font-normal text-[#565656] block mt-0.5"
                                    style={{
                                      fontFamily: 'Noto Sans, sans-serif',
                                      fontWeight: 400,
                                      fontSize: '12px',
                                      lineHeight: '16px',
                                      color: '#565656'
                                    }}
                                  >
                                    {volDesc}
                                  </span>
                                )}
                              </div>

                              {/* Right PDF Block */}
                              <div className="flex items-center gap-2 shrink-0">
                                <RedPdfIcon />
                                
                                <div className="flex flex-col items-start justify-center gap-[2px]">
                                  <span 
                                    className="text-[10px] font-normal text-[#565656] block"
                                    style={{
                                      fontFamily: 'Noto Sans, sans-serif',
                                      fontSize: '10px',
                                      lineHeight: '16px',
                                      color: '#565656'
                                    }}
                                  >
                                    {vol.size}
                                  </span>
                                  <button
                                    onClick={() => setPreviewVolume(vol)}
                                    className="text-xs text-[#0D61AE] underline font-normal bg-transparent border-none p-0 cursor-pointer hover:text-blue-800"
                                    style={{
                                      fontFamily: 'Noto Sans, sans-serif',
                                      fontSize: '12px',
                                      lineHeight: '160%',
                                      color: '#0D61AE',
                                      textDecoration: 'underline'
                                    }}
                                  >
                                    {isHindi ? 'पीडीएफ देखें' : 'View PDF'}
                                  </button>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Document PDF Viewer Modal */}
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
            {/* Modal Header */}
            <div className="p-4 bg-zinc-900 border-b border-zinc-700 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <RedPdfIcon />
                <div className="flex flex-col text-left">
                  <h4 className="text-sm font-bold m-0 leading-snug truncate max-w-[280px] md:max-w-md">
                    {isHindi ? previewVolume.titleHi : previewVolume.titleEn}
                  </h4>
                  <span className="text-[10px] text-zinc-400">
                    {previewVolume.size}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setPreviewVolume(null)}
                className="text-zinc-400 hover:text-white focus:outline-none p-1"
                aria-label="Close PDF viewer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Document Content View */}
            <div className="flex-grow bg-zinc-700 overflow-y-auto p-8 flex justify-center custom-scrollbar">
              <div className="w-full max-w-[595px] min-h-[842px] bg-white border border-zinc-200 p-12 text-zinc-900 shadow-lg flex flex-col gap-6 text-left relative">
                
                <div className="flex flex-col items-center justify-center text-center gap-2 border-b border-zinc-300 pb-6 w-full">
                  <span className="text-[10px] tracking-[4px] uppercase text-zinc-500 font-bold block">
                    SUPREME AUDIT INSTITUTION OF INDIA
                  </span>
                  <h1 className="text-base font-bold uppercase tracking-wider text-[#751639] m-0">
                    COMPTROLLER AND AUDITOR GENERAL OF INDIA
                  </h1>
                  <span className="text-[11px] text-zinc-400">
                    History of Indian Audit and Accounts Department
                  </span>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <h2 className="text-xl font-bold text-[#751639] border-b border-zinc-200 pb-2 m-0">
                    {isHindi ? previewVolume.titleHi : previewVolume.titleEn}
                  </h2>

                  <p className="text-xs leading-relaxed text-zinc-700 mt-2">
                    {isHindi
                      ? 'यह दस्तावेज़ भारत के नियंत्रक और महालेखापरीक्षक कार्यालय के आधिकारिक प्रकाशनों और ऐतिहासिक अभिलेखों का एक हिस्सा है। इसे केवल शैक्षणिक, संगठनात्मक लेखा परीक्षा समीक्षा और संदर्भ के लिए प्रस्तुत किया गया है।'
                      : 'This document constitutes an official archival record of the Office of the Comptroller and Auditor General of India. It has been digitized and presented for institutional record, administrative auditing references, and public transparency studies.'}
                  </p>
                </div>

                {/* Footer Stamp */}
                <div className="absolute bottom-12 left-12 right-12 border-t border-zinc-200 pt-4 flex justify-between items-center text-[10px] text-zinc-400">
                  <span>© Office of CAG of India</span>
                  <span>Document Preview</span>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </AboutLayout>
  );
}
