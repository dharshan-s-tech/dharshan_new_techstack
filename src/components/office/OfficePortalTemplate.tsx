'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

export interface OfficePortalProps {
  officeNameEn?: string;
  officeNameHi?: string;
  locationEn?: string;
  locationHi?: string;
  themeColor?: string; // Default: #1D2E6B (Central/Overseas) or #0A3D30 (State Audit)
  externalOfficialUrl?: string; // Link to official cag.gov.in external portal
  showBottomDeepSection?: boolean;
}

export default function OfficePortalTemplate({
  officeNameEn = 'Principal Accountant General (A&E)',
  officeNameHi = 'प्रधान महालेखाकार (लेखा एवं हकदारी)',
  locationEn = 'Andhra Pradesh, Vijayawada',
  locationHi = 'आंध्र प्रदेश, विजयवाड़ा',
  themeColor = '#0A3D30',
  externalOfficialUrl,
  showBottomDeepSection
}: OfficePortalProps) {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme styling helpers
  const isGreenTheme = themeColor === '#0A3D30' || themeColor === '#1D6B57' || themeColor === '#024023';
  const primaryThemeColor = isGreenTheme ? '#0A3D30' : '#1D2E6B';
  const activeIndicatorColor = isGreenTheme ? '#1D6B57' : '#1D2E6B';
  const segmentActiveColor = isGreenTheme ? '#024023' : '#1D2E6B';
  const upperFooterColor = isGreenTheme ? 'rgba(10, 61, 48, 0.9)' : 'rgba(29, 46, 107, 0.9)';
  
  // By default, bottom section is always rendered (matching Figma 14-4148 and 14-4407)
  const shouldRenderBottomSection = showBottomDeepSection !== false;
  
  // Section 1: Audit Reports / Sectors Tab
  const [reportsTab, setReportsTab] = useState<'reports' | 'sectors'>('sectors');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Section 2: What's new? / Press release Tab
  const [newsTab, setNewsTab] = useState<'whats_new' | 'press_release'>('whats_new');

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState(8);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const toggleLanguage = () => {
    const nextLang = lang === 'English' ? 'हिन्दी' : 'English';
    dataManager.setLanguage(nextLang);
    setLang(nextLang);
  };

  // 3 Feature Cards Data matching Figma Node 14-4407
  const reportCards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
      tag: isHindi ? 'नागरिक' : 'Civil',
      category: isHindi ? 'नागरिक' : 'Civic',
      date: isHindi ? '4 जून, 2026' : 'Jun 4, 2026',
      title: isHindi 
        ? 'लेखापरीक्षा रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है' 
        : 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
      desc: isHindi
        ? 'संबंधित विभागों और वित्तीय दायित्वों के संबंध में विस्तृत रिपोर्ट का सार यहाँ दिया गया है...'
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
      tag: isHindi ? 'तमिलनाडु' : 'Tamil Nadu',
      category: isHindi ? 'तमिलनाडु' : 'Tamil Nadu',
      date: isHindi ? '4 जून, 2026' : 'Jun 4, 2026',
      title: isHindi 
        ? 'राज्य अनुपालन एवं वित्तीय प्रदर्शन पर विस्तृत रिपोर्ट' 
        : 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
      desc: isHindi
        ? 'राज्य सरकार के वित्तीय लेखा-जोखा और विनियोग मदों का विस्तृत विश्लेषण...'
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
      tag: isHindi ? 'आंध्र प्रदेश' : 'Andhra Pradesh',
      category: isHindi ? 'आंध्र प्रदेश' : 'Andhra Pradesh',
      date: isHindi ? '4 जून, 2026' : 'Jun 4, 2026',
      title: isHindi 
        ? 'आंध्र प्रदेश राजस्व एवं व्यय प्रबंधन विश्लेषण रिपोर्ट' 
        : 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
      desc: isHindi
        ? 'राज्य संचित निधि और सार्वजनिक उपक्रमों के निष्पादन की समीक्षा...'
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
    }
  ];

  // What's New items
  const whatsNewItems = [
    { id: 1, date: isHindi ? '24 जून' : '24 Jun', title: isHindi ? '25 स्प्लिट एयर कंडीशनर टेंडर' : '25 Split Air Conditioner' },
    { id: 2, date: isHindi ? '24 जून' : '24 Jun', title: isHindi ? 'सीसीटीवी कैमरों की खरीद और स्थापना' : 'Purchase & Installation of CCTV Camera' },
    { id: 3, date: isHindi ? '03 अक्तूबर' : '03 Oct', title: isHindi ? 'मोबाइल स्टोरेज कॉम्पैक्टर (Q3) की बोली' : 'Bid for Mobile Storage Compactors (Q3)' },
    { id: 4, date: isHindi ? '14 मई' : '14 May', title: isHindi ? 'पेंशन अदालत के संबंध में सार्वजनिक सूचना' : 'Public Notice regarding Pension Adalat' },
  ];

  const pressReleaseItems = [
    { id: 1, date: isHindi ? '18 जुलाई' : '18 Jul', title: isHindi ? 'वार्षिक वित्त लेखा रिपोर्ट जारी' : 'Release of Annual Finance Accounts Report' },
    { id: 2, date: isHindi ? '12 जून' : '12 Jun', title: isHindi ? 'राज्य स्तरीय लेखा परीक्षा सेमिनार का आयोजन' : 'State Level Audit Conference Inauguration' },
    { id: 3, date: isHindi ? '05 मई' : '05 May', title: isHindi ? 'डिजिटल पेंशन प्रबंधन प्रणाली का शुभारंभ' : 'Launch of Digital Pension Processing System' },
    { id: 4, date: isHindi ? '20 अप्रैल' : '20 Apr', title: isHindi ? 'सार्वजनिक खरीद दिशानिर्देश अधिसूचना' : 'Public Procurement Compliance Notification' },
  ];

  // Calendar Helpers (August 2026)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const currentMonthLabel = isHindi ? `${monthNamesHi[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}` : `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`;

  const changeMonth = (offset: number) => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  return (
    <div className="w-full min-h-screen bg-white font-['Noto_Sans',sans-serif] text-[#2A2A2A] antialiased overflow-x-hidden selection:bg-[#1D2E6B] selection:text-white">
      
      {/* =========================================================================
          1. TOP HEADER BAR (#0A3D30 or #1D2E6B)
         ========================================================================= */}
      <header className="w-full relative z-30 shadow-sm">
        <div 
          className="w-full text-white h-[40px] px-4 md:px-16 flex justify-between items-center text-xs relative"
          style={{ background: themeColor === '#0A3D30' ? '#0A3D30' : '#1D2E6B' }}
        >
          {/* Left: Office Title */}
          <div className="flex items-center gap-2 pl-[110px] md:pl-[120px] truncate max-w-[60%]">
            <span className="font-normal text-[11px] text-white/90 truncate">
              {isHindi ? officeNameHi : officeNameEn},
            </span>
            <span className="font-bold text-[11px] text-white truncate">
              {isHindi ? locationHi : locationEn}
            </span>
          </div>

          {/* Right: Utility Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-normal text-white shrink-0">
            <Link href="/Resources" className="hover:underline transition-colors hidden sm:inline">
              {isHindi ? 'ज्ञान केंद्र' : 'Knowledge Hub'}
            </Link>
            <Link href="/admin" target="_blank" className="hover:underline font-semibold text-white">
              {isHindi ? 'कर्मचारी पोर्टल' : 'Employee Portal'}
            </Link>
            <Link href="/#news-events-heading" className="hover:underline transition-colors hidden md:inline">
              {isHindi ? 'समाचार एवं कार्यक्रम' : 'News & Events'}
            </Link>
            <Link href="/Career-Engagement" className="hover:underline transition-colors hidden md:inline">
              {isHindi ? 'करियर' : 'Careers'}
            </Link>

            {/* External Official Portal Link */}
            {externalOfficialUrl && (
              <a
                href={externalOfficialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/15 hover:bg-white/25 border border-white/40 rounded px-2 py-0.5 text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors"
                title={isHindi ? 'आधिकारिक CAG पोर्टल खोलें' : 'Open Official Portal (cag.gov.in)'}
              >
                <span>{isHindi ? 'आधिकारिक पोर्टल' : 'Official Portal'}</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}

            {/* Accessibility Box (A) */}
            <div className="flex items-center border border-white/40 rounded px-2 py-0.5 text-[11px] gap-1 cursor-pointer hover:bg-white/10">
              <span className="font-semibold">A</span>
              <span className="text-[8px]">▼</span>
            </div>

            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="bg-transparent border border-white/30 rounded px-2 py-0.5 text-white cursor-pointer hover:bg-white/10 text-[11px] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>{lang}</span>
              <span className="text-[8px]">▼</span>
            </button>
          </div>
        </div>

        {/* Main White Navigation Menu Bar (Height: 80px) */}
        <div className="w-full bg-white border-b border-[#D7D7D7] h-[80px] px-4 md:px-16 flex justify-between items-center relative">
          {/* Overlapping Official CAG Crest Emblem Logo */}
          <Link href="/" className="absolute left-[4.44%] top-[-32px] z-40 block">
            <img
              src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png"
              alt="Comptroller and Auditor General of India Crest"
              className="h-[104px] w-auto object-contain drop-shadow-md"
            />
          </Link>

          {/* Navigation Dropdowns */}
          <nav className="hidden xl:flex items-center gap-[24px] text-[14px] leading-[19px] font-normal text-[#4D4D4D] pl-[130px]">
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors">
              <span>{isHindi ? 'हमारे बारे में' : 'About Us'}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 text-[#1D2E6B] font-semibold">
              <span>{isHindi ? 'राज्य के खाते' : 'State Accounts'}</span>
              <span className="text-[9px] text-[#1D2E6B]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors">
              <span>{isHindi ? 'जीपीएफ' : 'GPF'}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors">
              <span>{isHindi ? 'पेंशन' : 'Pension'}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors">
              <span>{isHindi ? 'कर्मचारी कोना' : 'Employee Corner'}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors">
              <span>{isHindi ? 'सूचना का अधिकार' : 'RTI'}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <Link href="/Resources" className="hover:text-[#1D2E6B] transition-colors">
              {isHindi ? 'नागरिक चार्टर' : 'Citizen Charter'}
            </Link>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors">
              <span>{isHindi ? 'संपर्क करें' : 'Contact Us'}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
          </nav>

          {/* Search Box */}
          <div className="flex items-center border border-[#D7D7D7] rounded-[4px] px-3 py-1 bg-white w-[220px] h-[32px] focus-within:border-[#1D2E6B] transition-colors shrink-0 ml-auto xl:ml-0">
            <input
              type="text"
              placeholder={isHindi ? 'खोजें...' : 'Search'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[14px] leading-[19px] text-[#717171] placeholder:text-[#717171]"
            />
            <svg className="w-[14px] h-[14px] text-[#4D4D4D] shrink-0 cursor-pointer hover:text-[#1D2E6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO BANNER SECTION (Figma Specs: 1440px x 560px)
         ========================================================================= */}
      <section className="relative w-full h-[560px] flex items-center justify-start overflow-hidden bg-[#090C1E]">
        {/* Background Meeting Photo Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png')` }}
        />

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.01) 20%, rgba(9, 12, 30, 0.7) 50%, #090C1E 100%)',
            opacity: 0.95
          }}
        />

        {/* Hero Content (Left 120px) */}
        <div className="relative z-20 pl-6 sm:pl-16 lg:pl-[120px] pr-6 flex flex-col items-start gap-[36px] max-w-[680px]">
          <div className="flex flex-col items-start gap-[16px]">
            {/* Gold Accent Bar */}
            <div className="w-[93px] h-[0px] border-b-2 border-[#FFCE7B]" />

            {/* Headline Line 1 */}
            <p className="text-[20px] sm:text-[24px] leading-[36px] tracking-[1px] font-normal text-white font-['Noto_Sans']">
              {isHindi ? 'सुनिश्चित करना' : 'Ensuring'}
            </p>

            {/* Headline Line 2 & 3 */}
            <h1 className="text-[34px] sm:text-[44px] font-bold leading-[46px] sm:leading-[54px] text-white font-['Noto_Sans']">
              {isHindi ? 'पारदर्शिता, सत्यनिष्ठा एवं' : 'Transparency, Integrity &'}{' '}
              <span className="text-[#FFCE7B]">
                {isHindi ? 'जवाबदेही' : 'Accountability'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] sm:text-[19px] leading-[28px] sm:leading-[30px] font-normal text-white/95 mt-1 font-['Noto_Sans']">
              {isHindi
                ? 'भारत की सर्वोच्च लेखापरीक्षा संस्था से लेखापरीक्षा रिपोर्ट, खाते और संस्थागत संसाधन प्राप्त करें।'
                : "Access audit reports, accounts, and institutional resources from India's Supreme Audit Institution."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-[20px]">
            <Link
              href="/Reports"
              className="w-[152px] h-[48px] bg-white text-[16px] leading-[22px] font-semibold rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-all shadow-md shrink-0 cursor-pointer"
              style={{ color: primaryThemeColor }}
            >
              {isHindi ? 'रिपोर्ट देखें' : 'Explore Reports'}
            </Link>

            <Link
              href="/About/About-Us/Organisation-Chart"
              className="w-[160px] h-[48px] border border-white bg-black/40 text-white text-[16px] leading-[22px] font-medium rounded-[8px] flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-md shrink-0 cursor-pointer"
            >
              <span className="text-white font-medium drop-shadow">
                {isHindi ? 'सीएजी के बारे में जानें' : 'Learn about CAG'}
              </span>
            </Link>
          </div>
        </div>

        {/* Carousel Indicator Bars (Left 120px, Bottom 36px) */}
        <div className="absolute left-6 sm:left-16 lg:left-[120px] bottom-[36px] z-20 flex items-center gap-[8px]">
          <div 
            className="w-[50px] rounded-full" 
            style={{ borderBottom: `6px solid ${activeIndicatorColor}` }}
          />
          <div className="w-[50px] border-b-[3px] border-[#B1B1B1] rounded-full" />
          <div className="w-[50px] border-b-[3px] border-white rounded-full" />
          <div className="w-[50px] border-b-[3px] border-white rounded-full" />
        </div>

        {/* Floating Grey Bar & Quick Link Button (Bottom Right) */}
        <div className="absolute right-[40px] sm:right-[60px] bottom-[20px] z-30 flex items-end">
          <div className="w-[340px] h-[52px] bg-[#5B5C5F] backdrop-blur-md rounded-t-[10px] hidden lg:block" />
          <button
            aria-label="Quick links"
            className="w-[80px] h-[80px] border border-[#797979] rounded-full shadow-[4px_4px_20px_10px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform translate-y-[-10px] ml-[-40px]"
            style={{ background: primaryThemeColor }}
          >
            <svg className="w-[36px] h-[28px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. LATEST AUDIT REPORTS & ACCOUNTS SECTION (Figma: Top 704px - 1309px)
         ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 pt-[48px] pb-[64px] flex flex-col items-start gap-[32px]">
        
        {/* Segment Control Tab Pill (Width: 272px, Height: 32px) */}
        <div className="w-[272px] h-[32px] bg-[#F5F4F7] border border-[#EDEDED] rounded-[8px] p-[2px] flex items-center relative">
          <button
            type="button"
            onClick={() => setReportsTab('reports')}
            className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
              reportsTab === 'reports'
                ? 'text-white font-semibold shadow-xs'
                : 'text-[#565656] hover:text-[#2A2A2A]'
            }`}
            style={reportsTab === 'reports' ? { background: segmentActiveColor } : {}}
          >
            {isHindi ? 'लेखापरीक्षा रिपोर्ट' : 'Audit reports'}
          </button>
          <button
            type="button"
            onClick={() => setReportsTab('sectors')}
            className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
              reportsTab === 'sectors'
                ? 'text-white font-semibold shadow-xs'
                : 'text-[#565656] hover:text-[#2A2A2A]'
            }`}
            style={reportsTab === 'sectors' ? { background: segmentActiveColor } : {}}
          >
            {isHindi ? 'क्षेत्र (Sectors)' : 'sectors'}
          </button>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full items-stretch">
          {reportCards.map((card) => (
            <div
              key={card.id}
              className="w-full bg-white rounded-[8px] overflow-hidden border border-[#EDE9E9] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] flex flex-col hover:shadow-[0px_6px_20px_rgba(0,0,0,0.1)] transition-shadow duration-200"
            >
              {/* Card Banner with Tag Overlay */}
              <div className="relative w-full h-[248px] bg-zinc-200 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Black Tag (Top Right) */}
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] font-semibold rounded-[4px] uppercase tracking-wider">
                    {card.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-3">
                  {/* Category & Date Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#2A2A2A] font-semibold text-[16px]">
                      <span className="text-[#2A2A2A]">→</span>
                      <span>{card.category}</span>
                    </div>
                    <div className="px-2.5 py-1 bg-[#F3F3F3] text-[#2A2A2A] text-[14px] font-semibold rounded-[4px]">
                      {card.date}
                    </div>
                  </div>

                  {/* 2-Line Title */}
                  <h3 
                    className="text-[22px] sm:text-[24px] font-semibold leading-[30px] text-[#2A2A2A] line-clamp-2 transition-colors cursor-pointer font-['Noto_Sans']"
                    onMouseEnter={(e) => (e.currentTarget.style.color = primaryThemeColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#2A2A2A')}
                  >
                    {card.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[15px] sm:text-[16px] leading-[22px] font-normal text-[#565656] line-clamp-2 font-['Noto_Sans']">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Bottom Right) */}
        <div className="w-full flex justify-end items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setCarouselIndex(p => Math.max(0, p - 1))}
            className="w-[48px] h-[48px] bg-[#F5F5F5] rounded-[8px] flex items-center justify-center text-[#C0C0C0] hover:bg-zinc-200 transition-colors cursor-pointer"
            title="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setCarouselIndex(p => p + 1)}
            className="w-[48px] h-[48px] bg-white border border-[#2E2E31] rounded-[8px] flex items-center justify-center text-[#2E2E31] hover:bg-zinc-50 transition-colors cursor-pointer"
            title="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. OPTIONAL BOTTOM SECTION (What's New, Calendar & Tenders)
         ========================================================================= */}
      {shouldRenderBottomSection && (
        <section 
          className="w-full py-[64px] px-4 sm:px-10 lg:px-16 flex flex-col items-center"
          style={{ background: primaryThemeColor }}
        >
          <div className="w-full max-w-[1280px] flex flex-col gap-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
              
              {/* ── COLUMN 1: WHAT'S NEW? / PRESS RELEASE (4 Cols) ── */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                {/* Tab Selector Pill */}
                <div className="w-[272px] h-[32px] bg-[#F5F4F7] border border-[#EDEDED] rounded-[8px] p-[2px] flex items-center">
                  <button
                    type="button"
                    onClick={() => setNewsTab('whats_new')}
                    className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                      newsTab === 'whats_new'
                        ? 'text-white font-semibold shadow-xs'
                        : 'text-[#565656]'
                    }`}
                    style={newsTab === 'whats_new' ? { background: segmentActiveColor } : {}}
                  >
                    {isHindi ? 'नया क्या है?' : "What's new?"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsTab('press_release')}
                    className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                      newsTab === 'press_release'
                        ? 'text-white font-semibold shadow-xs'
                        : 'text-[#565656]'
                    }`}
                    style={newsTab === 'press_release' ? { background: segmentActiveColor } : {}}
                  >
                    {isHindi ? 'प्रेस विज्ञप्ति' : 'press release'}
                  </button>
                </div>

                {/* White Content Box */}
                <div className="w-full bg-white border border-[#D7D7D7] rounded-[8px] py-[24px] px-0 shadow-sm flex flex-col justify-between min-h-[317px]">
                  <div className="w-full border-b border-[#B1B1B1] pb-2 px-6">
                    <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider">
                      {newsTab === 'whats_new' ? (isHindi ? 'नवीनतम सूचनाएँ' : 'Recent Announcements') : (isHindi ? 'प्रेस अपडेट' : 'Media Releases')}
                    </span>
                  </div>

                  <div className="px-6 py-4 flex flex-col gap-[20px] flex-1">
                    {(newsTab === 'whats_new' ? whatsNewItems : pressReleaseItems).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 bg-[#EAF7EE] text-[#094E3D] font-bold text-[14px] leading-[24px] rounded-[4px] shrink-0">
                          {item.date}
                        </span>
                        <span className="text-[14px] leading-[24px] font-normal text-[#2A2A2A] truncate">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── COLUMN 2: DATE OF TABLING OF REPORTS / CALENDAR (4 Cols) ── */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <h3 className="text-white text-[20px] font-bold leading-[27px] font-['Noto_Sans']">
                  {isHindi ? 'रिपोर्टों के पटल पर रखने की तिथि' : 'Date of Tabling of Reports'}
                </h3>

                {/* Calendar Container */}
                <div className="w-full bg-white rounded-[8px] p-5 shadow-sm min-h-[317px] flex flex-col justify-between">
                  {/* Calendar Header with Navigation */}
                  <div className="flex justify-between items-center pb-3 border-b border-[#F0F0F0]">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      className="w-9 h-9 border border-[#E5E5EA] rounded-[8px] flex items-center justify-center text-[#2E2E31] hover:bg-zinc-50 cursor-pointer"
                      title="Previous Month"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <span className="font-bold text-[16px] text-[#2E2E31]">
                      {currentMonthLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      className="w-9 h-9 border border-[#E5E5EA] rounded-[8px] flex items-center justify-center text-[#2E2E31] hover:bg-zinc-50 cursor-pointer"
                      title="Next Month"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 text-center pt-2 text-[13px] font-semibold">
                    <span className="text-[#751639]">Su</span>
                    <span className="text-[#8A8A8F]">Mo</span>
                    <span className="text-[#8A8A8F]">Tu</span>
                    <span className="text-[#8A8A8F]">We</span>
                    <span className="text-[#8A8A8F]">Th</span>
                    <span className="text-[#8A8A8F]">Fr</span>
                    <span className="text-[#751639]">Sa</span>
                  </div>

                  {/* August 2026 Sample Day Matrix matching Figma spec */}
                  <div className="grid grid-cols-7 gap-y-1 text-center text-[14px] pt-1 items-center">
                    {/* Row 1 (26-31 of Prev month, 1) */}
                    <span className="text-[#8E8E93] text-xs">26</span>
                    <span className="text-[#8E8E93] text-xs">27</span>
                    <span className="text-[#8E8E93] text-xs">28</span>
                    <span className="text-[#8E8E93] text-xs">29</span>
                    <span className="text-[#8E8E93] text-xs">30</span>
                    <span className="text-[#8E8E93] text-xs">31</span>
                    <span className="text-[#2E2E31] font-medium">1</span>

                    {/* Row 2 (2 to 8 - with 8 highlighted in primaryThemeColor) */}
                    <span className="text-[#2E2E31] font-medium">2</span>
                    <span className="text-[#2E2E31] font-medium">3</span>
                    <span className="text-[#2E2E31] font-medium">4</span>
                    <span className="text-[#2E2E31] font-medium">5</span>
                    <span className="text-[#2E2E31] font-medium">6</span>
                    <span className="text-[#2E2E31] font-medium">7</span>
                    <div className="flex justify-center items-center">
                      <span 
                        className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
                        style={{ background: primaryThemeColor }}
                      >
                        8
                      </span>
                    </div>

                    {/* Row 3 (9 to 15) */}
                    <span className="text-[#2E2E31] font-medium">9</span>
                    <span className="text-[#2E2E31] font-medium">10</span>
                    <span className="text-[#2E2E31] font-medium">11</span>
                    <span className="text-[#2E2E31] font-medium">12</span>
                    <span className="text-[#2E2E31] font-medium">13</span>
                    <span className="text-[#2E2E31] font-medium">14</span>
                    <span className="text-[#2E2E31] font-medium">15</span>

                    {/* Row 4 (16 to 22) */}
                    <span className="text-[#2E2E31] font-medium">16</span>
                    <span className="text-[#2E2E31] font-medium">17</span>
                    <span className="text-[#2E2E31] font-medium">18</span>
                    <span className="text-[#2E2E31] font-medium">19</span>
                    <span className="text-[#2E2E31] font-medium">20</span>
                    <span className="text-[#2E2E31] font-medium">21</span>
                    <span className="text-[#2E2E31] font-medium">22</span>

                    {/* Row 5 (23 to 29) */}
                    <span className="text-[#2E2E31] font-medium">23</span>
                    <span className="text-[#2E2E31] font-medium">24</span>
                    <span className="text-[#2E2E31] font-medium">25</span>
                    <span className="text-[#2E2E31] font-medium">26</span>
                    <span className="text-[#2E2E31] font-medium">27</span>
                    <span className="text-[#2E2E31] font-medium">28</span>
                    <span className="text-[#2E2E31] font-medium">29</span>

                    {/* Row 6 (30, 31, Next month 1-5) */}
                    <span className="text-[#2E2E31] font-medium">30</span>
                    <span className="text-[#2E2E31] font-medium">31</span>
                    <span className="text-[#8E8E93] text-xs">1</span>
                    <span className="text-[#8E8E93] text-xs">2</span>
                    <span className="text-[#8E8E93] text-xs">3</span>
                    <span className="text-[#8E8E93] text-xs">4</span>
                    <span className="text-[#8E8E93] text-xs">5</span>
                  </div>
                </div>
              </div>

              {/* ── COLUMN 3: TENDERS & CONTRACTS (4 Cols) ── */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <h3 className="text-white text-[20px] font-bold leading-[27px] font-['Noto_Sans']">
                  {isHindi ? 'निविदाएं एवं अनुबंध' : 'Tenders & Contracts'}
                </h3>

                {/* White Tender Card */}
                <div className="w-full bg-white rounded-[8px] p-6 shadow-sm min-h-[317px] flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <p className="text-[17px] leading-[26px] text-[#000000] font-normal font-['Noto_Sans']">
                      {isHindi
                        ? 'प्रधान महालेखाकार (लेखापरीक्षा), आंध्र प्रदेश के कार्यालय के लिए वर्ष 2026-27 की अवधि हेतु लेखापरीक्षा रिपोर्टों, पुस्तिकाओं/ब्रोशर की डिजाइनिंग, फॉर्मेटिंग और मुद्रण हेतु एजेंसी को नियुक्त करने की निविदा...'
                        : 'Hiring of Printing Agency from Vijayawada, Hyderabad Region for designing, formatting and printing of Audit Reports, booklet/brochure along with (CD-ROM) for the period 202627 for Office of the Principal Accountant General (Audit), Andhra Pradesh'}
                    </p>
                    <p className="text-[14px] text-zinc-500 font-medium">
                      09 Jan 2026 (PDF, 887.85 KB)
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#F0F0F0]">
                    <Link
                      href="/Resources/Tenders"
                      className="font-bold text-[15px] hover:underline flex items-center gap-1.5"
                      style={{ color: primaryThemeColor }}
                    >
                      <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          5. FOOTER (Matching Figma Double Bar: rgba(10, 61, 48, 0.9) & #2A2A2A)
         ========================================================================= */}
      <footer className="w-full flex flex-col">
        {/* Upper Footer Row */}
        <div 
          className="w-full min-h-[72px] px-6 sm:px-16 flex justify-center items-center py-4"
          style={{ background: upperFooterColor }}
        >
          <div className="flex flex-wrap justify-center items-center gap-6 text-[15px] sm:text-[16px] leading-[22px] font-normal text-white">
            <Link href="/" className="hover:underline">{isHindi ? 'कॉपीराइट नीति' : 'Copyright Policy'}</Link>
            <Link href="/" className="hover:underline">{isHindi ? 'सहायता' : 'Help'}</Link>
            <Link href="/" className="hover:underline">{isHindi ? 'हाइपरलिंकिंग नीति' : 'Hyper linking Policy'}</Link>
            <Link href="/" className="hover:underline">{isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</Link>
            <Link href="/" className="hover:underline">{isHindi ? 'नियम एवं शर्तें' : 'Terms & Conditions'}</Link>
            <Link href="/" className="hover:underline">{isHindi ? 'संग्रह' : 'Archive'}</Link>
          </div>
        </div>

        {/* Lower Copyright Row (#2A2A2A) */}
        <div className="w-full bg-[#2A2A2A] min-h-[40px] px-6 sm:px-16 py-2 flex flex-col sm:flex-row justify-between items-center text-[13px] sm:text-[14px] leading-[19px] font-normal text-white gap-2">
          <span className="text-center sm:text-left">
            {isHindi
              ? `© कॉपीराइट 2026 - सामग्री का स्वामित्व ${officeNameHi}, ${locationHi} के पास है। सर्वाधिकार सुरक्षित।`
              : `© Copyright 2026 - Content Owned by ${officeNameEn}, ${locationEn}. All rights reserved.`}
          </span>
          <span className="text-center sm:text-right shrink-0">
            {isHindi ? 'पृष्ठ अंतिम बार अपडेट किया गया: 27 जुलाई 2026' : 'Page last updated: 27 Jul 2026'}
          </span>
        </div>
      </footer>

    </div>
  );
}
