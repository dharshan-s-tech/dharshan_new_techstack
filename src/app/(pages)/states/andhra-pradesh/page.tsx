'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AndhraPradeshSubsitePage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [subsiteData, setSubsiteData] = useState<any>(null);

  useEffect(() => {
    api.getStateSubsite('andhra-pradesh').then((data) => {
      if (data) setSubsiteData(data);
    });
  }, []);

  const isHindi = lang === 'हिन्दी';

  const toggleLanguage = () => {
    setLang(prev => (prev === 'English' ? 'हिन्दी' : 'English'));
  };

  // Translations dictionary
  const t = {
    officePrefix: isHindi ? 'प्रधान महालेखाकार (लेखा एवं हकदारी),' : 'Principal Accountant General (A&E),',
    officeLocation: isHindi ? 'आंध्र प्रदेश, विजयवाड़ा' : 'Andhra Pradesh, Vijayawada',
    knowledgeHub: isHindi ? 'ज्ञान केंद्र' : 'Knowledge Hub',
    employeePortal: isHindi ? 'कर्मचारी पोर्टल' : 'Employee Portal',
    newsEvents: isHindi ? 'समाचार एवं कार्यक्रम' : 'News & Events',
    contact: isHindi ? 'संपर्क करें' : 'Contact',
    searchPlaceholder: isHindi ? 'खोजें...' : 'Search',
    navAbout: isHindi ? 'हमारे बारे में' : 'About Us',
    navAccounts: isHindi ? 'राज्य के खाते' : 'State Accounts',
    navGpf: isHindi ? 'जीपीएफ' : 'GPF',
    navPension: isHindi ? 'पेंशन' : 'Pension',
    navEmployee: isHindi ? 'कर्मचारी कोना' : 'Employee Corner',
    navRti: isHindi ? 'सूचना का अधिकार' : 'RTI',
    navCharter: isHindi ? 'नागरिक चार्टर' : 'Citizen Charter',
    navContactUs: isHindi ? 'हमसे संपर्क करें' : 'Contact Us',
    heroEnsuring: isHindi ? 'सुनिश्चित करना' : 'Ensuring',
    heroTitleLine1: isHindi ? 'पारदर्शिता, सत्यनिष्ठा एवं' : 'Transparency, Integrity &',
    heroTitleLine2: isHindi ? 'जवाबदेही' : 'Accountability',
    heroSubtitle: isHindi ? 'भारत की सर्वोच्च लेखापरीक्षा संस्था से लेखापरीक्षा रिपोर्ट, खाते और संस्थागत संसाधन प्राप्त करें।' : "Access audit reports, accounts, and institutional resources from India's Supreme Audit Institution.",
    heroBtn1: isHindi ? 'रिपोर्ट देखें' : 'Explore Reports',
    heroBtn2: isHindi ? 'सीएजी के बारे में जानें' : 'Learn about CAG',
    pensionTitle: isHindi ? 'पेंशन के बारे में' : (subsiteData?.pension_title || 'About Pension'),
    pensionDesc: isHindi
      ? 'प्रधान महालेखाकार (लेखा एवं हकदारी) निम्नलिखित श्रेणियों के लिए पेंशन लाभों को अधिकृत करता है: 1. आंध्र प्रदेश आरपीआर नियम 1980 के तहत कवर किए गए राज्य सरकार के कर्मचारी 2. आंध्र प्रदेश कैडर के एआईएस अधिकारी 3. आंध्र प्रदेश उच्च न्यायालय, लोकायुक्त और एपी प्रशासनिक न्यायाधिकरण के माननीय न्यायाधीश, एपी लोक सेवा आयोग के सदस्य 4. राजनीतिक (स्वतंत्रता सेनानी) पेंशन।'
      : (subsiteData?.pension_desc || 'The PAG (A&E) authorises the pensionary benefits for the following categories: 1. State Government employees covered under the AP RPR Rules, 1980 2. AIS officers borne on the Andhra Pradesh cadre (excepting those who have opted to receive their pensions from the Central Pension Payment Authority). 3.Constitutional authorities such as Hon’ble Judges of the AP High Court, Lok Ayukta and AP Administrative Tribunal, Members of AP Public Service Commission 4. Political (Freedom Fighters) Pensions'),
    pensionCardTitle: isHindi ? 'अपनी पेंशन मामले की स्थिति जानें' : 'Know your Pension Case Status',
    pensionCardDate: isHindi ? `10/06/2026 को अपनी स्थिति जानें` : `Know your status on ${subsiteData?.pension_case_status_date || '10/06/2026'}`,
    readMore: isHindi ? 'और पढ़ें' : 'Read More',
    gpfTitle: isHindi ? 'सामान्य भविष्य निधि के बारे में' : (subsiteData?.gpf_title || 'About General Provident Fund'),
    gpfDesc: isHindi
      ? 'प्रधान महालेखाकार (लेखा एवं हकदारी) जीपीएफ नियम 1935 और एआईएस नियम 1955 के तहत आंध्र प्रदेश राज्य सरकार के लगभग 2.29 लाख कर्मचारियों के व्यक्तिगत जीपीएफ खातों का रखरखाव करता है।'
      : (subsiteData?.gpf_desc || 'The Principal Accountant General (A&E) maintains the individual GPF accounts of nearly 2.29 lakh employees of the AP State Governments as per the rules and procedures contained in the GPF (AP) Rules 1935 and AIS (PF) Rules 1955 respectively. The Provident Fund Group in the Office is headed by an IA & AS Officer in the rank of Deputy Accountant General who is assisted by Accounts Officers.'),
    gpfCardTitle: isHindi ? 'जीपीएफ वार्षिक खाता विवरण' : 'GPF Annual Account Statements',
    gpfCardSubtitle: isHindi ? 'उपर्युक्त लिंक में प्रासंगिक सीएजी लेखापरीक्षा रिपोर्टों की विषय-वार पहुंच प्रदान की गई है।' : 'Theme-wise access to relevant CAG Audit Reports relating to Punjab is provided in link given above.',
    accountTitle: isHindi ? 'लेखा (खाता)' : (subsiteData?.account_title || 'Account'),
    accountDesc: isHindi
      ? 'इस कार्यालय के लेखा समूह का नेतृत्व उप महालेखाकार (डीएजी/वरिष्ठ डीएजी) स्तर के एक आईएएंडएएस अधिकारी द्वारा किया जाता है। आंध्र प्रदेश सरकार के खाते 13 जिलों द्वारा प्रस्तुत शुरुआती खातों के आधार पर संकलित किए जाते हैं...'
      : (subsiteData?.account_desc || 'The Accounts Group of this office is headed by an IA &AS officer of the rank of Deputy Accountant General (DAG/Sr.DAG).The accounts of the Government of Andhra Pradesh  are compiled based on the initial accounts rendered by 13 Districts...'),
    accountCards: [
      { id: 'ac-1', title: isHindi ? 'मासिक मुख्य संकेतकों की जानकारी' : 'Monthly Key Indicators', url: '/Reports' },
      { id: 'ac-2', title: isHindi ? 'विनियोग लेखा' : 'Appropriation Accounts', url: '/Reports' },
      { id: 'ac-3', title: isHindi ? 'वित्त लेखा' : 'Finance Account', url: '/Reports' },
      { id: 'ac-4', title: isHindi ? 'एक नजर में खाते' : 'Accounts at a Glance', url: '/Reports' }
    ],
    quickLinksTitle: isHindi ? 'त्वरित लिंक' : 'Quick Links',
    quickLinksItems: [
      { id: 'ql-1', title: isHindi ? '09/03/2026 को अमृतसर में और 10/03/2026 को फिरोजपुर में पेंशन अदालत' : 'Pension Adalat in Amritsar on 09/03/2026 and in Ferozepur on 10/03/2026' },
      { id: 'ql-2', title: isHindi ? 'राष्ट्रीय ऑनलाइन निबंध लेखन प्रतियोगिता 2025' : 'National Online Essay Writing Competition 2025' },
      { id: 'ql-3', title: isHindi ? 'निबंध लेखन प्रतियोगिता के लिए एजी कार्यालय का स्थान' : 'Location of AG Office for essay writing competition' },
      { id: 'ql-4', title: isHindi ? 'राष्ट्रीय निबंध लेखन प्रतियोगिता 2024' : 'National Essay Writing Competition 2024' }
    ],
    whatsNewTitle: isHindi ? 'नया क्या है?' : 'What’s New?',
    whatsNewItems: [
      { id: 'wn-1', date: isHindi ? '24 जून' : '24 Jun', title: isHindi ? '25 स्प्लिट एयर कंडीशनर टेंडर' : '25 Split Air Conditioner' },
      { id: 'wn-2', date: isHindi ? '24 जून' : '24 Jun', title: isHindi ? 'सीसीटीवी कैमरों की खरीद और स्थापना' : 'Purchase & Installation of CCTV Camera' },
      { id: 'wn-3', date: isHindi ? '03 अक्तूबर' : '03 Oct', title: isHindi ? 'मोबाइल स्टोरेज कॉम्पैक्टर (Q3) की बोली' : 'Bid for Mobile Storage Compactors (Q3)' },
      { id: 'wn-4', date: isHindi ? '14 मई' : '14 May', title: isHindi ? 'पेंशन अदालत के संबंध में सार्वजनिक सूचना' : 'Public Notice regarding Pension Adalat' }
    ],
    viewAll: isHindi ? 'सभी देखें' : 'View All',
    copyrightPolicy: isHindi ? 'कॉपीराइट नीति' : 'Copyright Policy',
    help: isHindi ? 'सहायता' : 'Help',
    hyperlinkingPolicy: isHindi ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy',
    privacyPolicy: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy',
    termsConditions: isHindi ? 'नियम एवं शर्तें' : 'Terms & Conditions',
    archive: isHindi ? 'संग्रह' : 'Archive',
    copyrightFooter: isHindi ? '© सर्वाधिकार सुरक्षित 2020 - सामग्री प्रधान महालेखाकार (लेखा एवं हकदारी), आंध्र प्रदेश, विजयवाड़ा के पास है।' : '© Copyright 2020 - Content owned by Principal Accountant General (A&E), Andhra Pradesh, Vijayawada. All rights reserved.',
    lastUpdated: isHindi ? 'पृष्ठ अंतिम बार अपडेट किया गया: 27 जुलाई 2026' : 'Page last updated : 27 Jul 2026'
  };

  return (
    <div className="w-full min-h-screen bg-white font-['Noto_Sans',sans-serif] text-[#2A2A2A] antialiased overflow-x-hidden">
      {/* ==========================================
          1. HEADER (Top Bar + Main Nav Menu)
         ========================================== */}
      <header className="w-full relative z-30 shadow-sm">
        {/* Top Dark Green Sub-Header Bar (#0A3D30, Height: 40px) */}
        <div className="w-full bg-[#0A3D30] text-white h-[40px] px-6 md:px-16 flex justify-between items-center text-xs relative">
          {/* Left: Emblem Title */}
          <div className="flex items-center gap-2 pl-[110px] md:pl-[120px]">
            <span className="font-normal text-[11px] text-white/90">
              {t.officePrefix}
            </span>
            <span className="font-bold text-[11px] text-white">
              {t.officeLocation}
            </span>
          </div>

          {/* Right: Utility Links */}
          <div className="flex items-center gap-6 text-[11px] font-normal text-white">
            <Link href="/Resources" className="hover:underline transition-colors">{t.knowledgeHub}</Link>
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-semibold text-white"
              onClick={(e) => {
                e.preventDefault();
                window.open('/admin', '_blank');
              }}
            >
              {t.employeePortal}
            </a>
            <Link href="/#news-events-heading" className="hover:underline transition-colors">{t.newsEvents}</Link>
            <Link href="/About/Index-Menu-About/Global-relations/International%20Relations%20Wing" className="hover:underline transition-colors">{t.contact}</Link>

            {/* Accessibility Button Box */}
            <div className="flex items-center border border-white/40 rounded px-2 py-0.5 text-[11px] gap-1 cursor-pointer hover:bg-white/10">
              <span>A</span>
              <span className="text-[8px]">▼</span>
            </div>

            {/* Language Selector Button */}
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
        <div className="w-full bg-white border-b border-[#D7D7D7] h-[80px] px-6 md:px-16 flex justify-between items-center relative">
          {/* Overlapping Official CAG Crest Emblem Logo */}
          <Link href="/" className="absolute left-[4.44%] top-[-32px] z-40 block">
            <img
              src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png"
              alt="Comptroller and Auditor General of India Emblem"
              className="h-[104px] w-auto object-contain drop-shadow-md"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-[24px] text-[14px] leading-[19px] font-normal text-[#4D4D4D] pl-[130px]">
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#0A3D30] transition-colors">
              <span>{t.navAbout}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 text-[#0A3D30] font-semibold">
              <span>{t.navAccounts}</span>
              <span className="text-[9px] text-[#0A3D30]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#0A3D30] transition-colors">
              <span>{t.navGpf}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#0A3D30] transition-colors">
              <span>{t.navPension}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#0A3D30] transition-colors">
              <span>{t.navEmployee}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#0A3D30] transition-colors">
              <span>{t.navRti}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
            <Link href="/Resources" className="hover:text-[#0A3D30] transition-colors">{t.navCharter}</Link>
            <div className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#0A3D30] transition-colors">
              <span>{t.navContactUs}</span>
              <span className="text-[9px] text-[#4D4D4D]">▼</span>
            </div>
          </nav>

          {/* Search Box */}
          <div className="flex items-center border border-[#D7D7D7] rounded-[4px] px-3 py-1 bg-white w-[220px] h-[32px] focus-within:border-[#0A3D30] transition-colors shrink-0">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[14px] leading-[19px] text-[#717171] placeholder:text-[#717171]"
            />
            <svg className="w-[14px] h-[14px] text-[#4D4D4D] shrink-0 cursor-pointer hover:text-[#0A3D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* ==========================================
          2. HERO BANNER SECTION (Matching Image 1 Specs 100%)
         ========================================== */}
      <section className="relative w-full h-[560px] flex items-center justify-start overflow-hidden bg-[#090C1E]">
        {/* Background Meeting Photo Image (17a8a6edf588630a0c7494a054fb34e604c4f41c.png) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png')` }}
        />

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.3) 30%, rgba(9, 12, 30, 0.8) 65%, #090C1E 100%)'
          }}
        />

        {/* Hero Content (Left 120px) */}
        <div className="relative z-20 pl-[120px] pr-6 flex flex-col items-start gap-[36px] max-w-[650px]">
          <div className="flex flex-col items-start gap-[16px]">
            {/* Gold Accent Line (Line 1602: width 93px, border 2px solid #FFCE7B) */}
            <div className="w-[93px] h-[0px] border-b-2 border-[#FFCE7B]" />

            {/* Headline Line 1 */}
            <p className="text-[24px] leading-[36px] tracking-[1px] font-normal text-white">
              {t.heroEnsuring}
            </p>

            {/* Headline Line 2 & 3 */}
            <h1 className="text-[38px] md:text-[44px] font-bold leading-[54px] text-white">
              {t.heroTitleLine1} <br />
              <span className="text-[#FFCE7B]">{t.heroTitleLine2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[18px] md:text-[20px] leading-[30px] font-normal text-white/95 mt-1">
              {t.heroSubtitle}
            </p>
          </div>

          {/* CTAs Row */}
          <div className="flex items-center gap-[24px]">
            {/* Button 1: Explore Reports (White fill, dark green text) */}
            <Link
              href="/Reports"
              className="w-[152px] h-[48px] bg-white text-[#0A3D30] text-[16px] leading-[22px] font-semibold rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-md shrink-0"
            >
              {t.heroBtn1}
            </Link>

            {/* Button 2: Learn about CAG (White border, 100% WHITE TEXT, semi-transparent fill) */}
            <Link
              href="/About/Index-Menu-About/Global-relations/International%20Relations%20Wing"
              className="w-[160px] h-[48px] border border-white bg-black/40 text-white text-[16px] leading-[22px] font-medium rounded-[8px] flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md shrink-0"
            >
              <span className="text-white font-medium drop-shadow">{t.heroBtn2}</span>
            </Link>
          </div>
        </div>

        {/* Carousel Indicator Bars (Left 120px, Bottom 36px) */}
        <div className="absolute left-[120px] bottom-[36px] z-20 flex items-center gap-[8px]">
          <div className="w-[50px] border-b-[6px] border-[#008060] rounded-full" />
          <div className="w-[50px] border-b-[3px] border-[#B1B1B1] rounded-full" />
          <div className="w-[50px] border-b-[3px] border-white rounded-full" />
          <div className="w-[50px] border-b-[3px] border-white rounded-full" />
        </div>

        {/* Floating Grey Bar & Quick Link Button (Bottom Right, matching screenshot 100%) */}
        <div className="absolute right-[60px] bottom-[20px] z-30 flex items-end">
          <div className="w-[360px] h-[52px] bg-[#4A4B4D]/80 backdrop-blur-md rounded-t-[10px] hidden md:block" />
          <button
            aria-label="Quick links"
            className="w-[80px] h-[80px] bg-[#0A3D30] border border-white/20 rounded-full shadow-[0px_4px_20px_rgba(0,0,0,0.35)] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform translate-y-[-10px] ml-[-40px]"
          >
            <svg className="w-[36px] h-[28px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </section>

      {/* ==========================================
          3. ABOUT PENSION SECTION
         ========================================== */}
      <section className="w-full bg-[#F7FFF8] py-[64px] px-[80px] flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-[40px]">
          <div className="w-full flex flex-col items-center gap-[16px] text-center max-w-[1000px]">
            <h2 className="w-full text-[32px] leading-[44px] font-bold text-[#2A2A2A]">
              {t.pensionTitle}
            </h2>

            <p className="w-full text-[16px] leading-[30px] font-normal text-[#565656]">
              {t.pensionDesc}
            </p>
          </div>

          {/* Pension Card (Matching User Screenshot 100%) */}
          <div className="w-[582px] max-w-full h-[244px] bg-white rounded-[8px] p-[24px] shadow-[0px_0px_20px_rgba(0,0,0,0.09)] flex flex-col items-start justify-between">
            {/* image 1638 Badge (80px x 80px: White circle with thin red border & ICSSR emblem) */}
            <div className="w-[80px] h-[80px] rounded-full bg-white border border-red-500 flex flex-col items-center justify-center p-1 shrink-0">
              <svg className="w-[30px] h-[30px] text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 5 9 6.5 9 9c0 2.5 1.5 4 3 5 1.5-1 3-2.5 3-5 0-2.5-1.5-4-3-7z" fill="#DC2626"/>
                <path d="M12 8c-1.5 2-2 3.5-2 5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.5-3-2-5-1 2-2 2.5-4 0z" fill="#EF4444"/>
              </svg>
              <span className="text-[8px] font-bold text-red-600 tracking-tighter leading-none mt-[-2px]">ICSSR</span>
            </div>

            {/* Title & Subtitle Container */}
            <div className="w-full flex flex-col items-start gap-[8px] mt-2">
              <h3 className="text-[22px] leading-[30px] font-bold text-[#2A2A2A] font-['Noto_Sans']">
                {t.pensionCardTitle}
              </h3>
              <p className="text-[14px] leading-[24px] font-normal text-[#565656] font-['Noto_Sans']">
                {t.pensionCardDate}
              </p>
            </div>

            {/* Read More Link (Matching user image 100% with native blue underline) */}
            <Link
              href="/Reports"
              className="text-[16px] leading-[30px] font-normal text-[#0D61AE] underline decoration-[#0D61AE] decoration-1 underline-offset-[2px] hover:opacity-80 transition-opacity cursor-pointer shrink-0 font-['Noto_Sans'] mt-2"
            >
              {t.readMore}
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. ABOUT GENERAL PROVIDENT FUND SECTION
         ========================================== */}
      <section className="w-full bg-gradient-to-b from-[#FAF5ED] to-white py-[64px] px-[80px] flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-[40px]">
          <div className="w-full flex flex-col items-center gap-[16px] text-center max-w-[1000px]">
            <h2 className="w-full text-[32px] leading-[44px] font-bold text-[#2A2A2A]">
              {t.gpfTitle}
            </h2>

            <p className="w-full text-[16px] leading-[30px] font-normal text-[#565656]">
              {t.gpfDesc}
            </p>
          </div>

          {/* GPF Card (Matching User Screenshot 100%) */}
          <div className="w-[582px] max-w-full h-[278px] bg-white rounded-[8px] p-[24px] shadow-[0px_0px_20px_rgba(0,0,0,0.09)] flex flex-col items-start justify-between">
            {/* image 1638 Badge (80px x 80px: White circle with thin red border & ICSSR emblem) */}
            <div className="w-[80px] h-[80px] rounded-full bg-white border border-red-500 flex flex-col items-center justify-center p-1 shrink-0">
              <svg className="w-[30px] h-[30px] text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 5 9 6.5 9 9c0 2.5 1.5 4 3 5 1.5-1 3-2.5 3-5 0-2.5-1.5-4-3-7z" fill="#DC2626"/>
                <path d="M12 8c-1.5 2-2 3.5-2 5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.5-3-2-5-1 2-2 2.5-4 0z" fill="#EF4444"/>
              </svg>
              <span className="text-[8px] font-bold text-red-600 tracking-tighter leading-none mt-[-2px]">ICSSR</span>
            </div>

            {/* Description Container */}
            <div className="w-full flex flex-col items-start gap-[8px] mt-2">
              <h3 className="text-[22px] leading-[30px] font-bold text-[#2A2A2A] font-['Noto_Sans']">
                {t.gpfCardTitle}
              </h3>
              <p className="text-[14px] leading-[19px] font-normal text-[#565656] font-['Noto_Sans']">
                {t.gpfCardSubtitle}
              </p>
            </div>

            {/* Read More Link */}
            <Link
              href="/Reports"
              className="text-[16px] leading-[30px] font-normal text-[#0D61AE] underline decoration-[#0D61AE] decoration-1 underline-offset-[2px] hover:opacity-80 transition-opacity cursor-pointer shrink-0 font-['Noto_Sans'] mt-2"
            >
              {t.readMore}
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. ACCOUNT SECTION
         ========================================== */}
      <section className="w-full bg-white py-[64px] px-[80px] flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-col items-center gap-[40px]">
          <div className="w-full flex flex-col items-center gap-[16px] text-center max-w-[1000px]">
            <h2 className="w-full text-[32px] leading-[44px] font-bold text-[#2A2A2A]">
              {t.accountTitle}
            </h2>

            <p className="w-full text-[16px] leading-[30px] font-normal text-[#565656]">
              {t.accountDesc}
            </p>
          </div>

          <div className="w-full flex flex-wrap lg:flex-nowrap justify-center items-start gap-[16px]">
            {t.accountCards.map((card: any, idx: number) => (
              <div 
                key={card.id || idx}
                className="w-full sm:w-[308px] h-[204px] bg-white rounded-[8px] p-[20px] shadow-[0px_0px_20px_rgba(0,0,0,0.09)] flex flex-col items-start justify-between shrink-0"
              >
                {/* image 1638 Badge (80px x 80px: White circle with thin red border & ICSSR emblem) */}
                <div className="w-[80px] h-[80px] rounded-full bg-white border border-red-500 flex flex-col items-center justify-center p-1 shrink-0">
                  <svg className="w-[28px] h-[28px] text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C10.5 5 9 6.5 9 9c0 2.5 1.5 4 3 5 1.5-1 3-2.5 3-5 0-2.5-1.5-4-3-7z" fill="#DC2626"/>
                    <path d="M12 8c-1.5 2-2 3.5-2 5 0 2.2 1.8 4 4 4s4-1.8 4-4c0-1.5-.5-3-2-5-1 2-2 2.5-4 0z" fill="#EF4444"/>
                  </svg>
                  <span className="text-[7px] font-bold text-red-600 tracking-tighter leading-none mt-[-2px]">ICSSR</span>
                </div>

                <div className="w-full h-[30px] flex items-center">
                  <h3 className="text-[22px] leading-[30px] font-bold text-[#2A2A2A] truncate font-['Noto_Sans']">
                    {card.title}
                  </h3>
                </div>

                <Link
                  href={card.url || '/Reports'}
                  className="text-[16px] leading-[30px] font-normal text-[#0D61AE] underline decoration-[#0D61AE] decoration-1 underline-offset-[2px] hover:opacity-80 transition-opacity cursor-pointer shrink-0 font-['Noto_Sans']"
                >
                  {t.readMore}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. QUICK LINKS & WHAT'S NEW SECTION
         ========================================== */}
      <section className="w-full bg-[#F7FFF8] py-[64px] px-[80px] flex flex-col items-center">
        <div className="w-full max-w-[1280px] flex flex-wrap lg:flex-nowrap justify-between items-center gap-[25px]">
          {/* Quick Links Card */}
          <div className="w-full lg:w-[627.5px] h-[324px] bg-white border border-[#D7D7D7] rounded-[8px] py-[24px] px-0 flex flex-col justify-between items-start gap-[24px] shadow-sm">
            <div className="w-full flex flex-col items-start gap-[24px]">
              <div className="w-full px-[24px] flex items-center gap-[16px]">
                <div className="w-[24px] h-[24px] bg-[#0A3D30] rounded-[2px] flex items-center justify-center shrink-0">
                  <svg className="w-[12px] h-[12px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <h3 className="text-[14px] leading-[24px] font-bold text-[#2A2A2A]">
                  {t.quickLinksTitle}
                </h3>
              </div>

              <div className="w-full border-b border-[#B1B1B1]" />

              <div className="w-full px-[24px] flex flex-col gap-[20px]">
                {t.quickLinksItems.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="w-full flex items-center gap-[10px]">
                    <div className="w-[18px] h-[0px] border-b-2 border-black shrink-0" />
                    <span className="text-[14px] leading-[24px] font-normal text-[#2A2A2A] truncate">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full px-[24px] flex justify-end items-center gap-[8px]">
              <Link href="/Resources" className="text-[14px] leading-[24px] font-medium text-[#0D61AE] flex items-center gap-[6px] hover:underline">
                <span>{t.viewAll}</span>
                <span className="text-[14px]">→</span>
              </Link>
            </div>
          </div>

          {/* What's New? Card */}
          <div className="w-full lg:w-[627.5px] h-[324px] bg-white border border-[#D7D7D7] rounded-[8px] py-[24px] px-0 flex flex-col justify-between items-start gap-[24px] shadow-sm">
            <div className="w-full flex flex-col items-start gap-[24px]">
              <div className="w-full px-[24px] flex items-center gap-[16px]">
                <div className="w-[24px] h-[24px] bg-[#0A3D30] rounded-[2px] flex items-center justify-center shrink-0">
                  <svg className="w-[12px] h-[12px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <h3 className="text-[14px] leading-[24px] font-bold text-[#2A2A2A]">
                  {t.whatsNewTitle}
                </h3>
              </div>

              <div className="w-full border-b border-[#B1B1B1]" />

              <div className="w-full px-[24px] flex flex-col gap-[20px]">
                {t.whatsNewItems.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="w-full flex items-center gap-[16px]">
                    <span className="w-[55px] text-[14px] leading-[24px] font-semibold text-[#0A3D30] shrink-0">
                      {item.date}
                    </span>
                    <span className="text-[14px] leading-[24px] font-normal text-[#2A2A2A] truncate">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full px-[24px] flex justify-end items-center gap-[8px]">
              <Link href="/#news-events-heading" className="text-[14px] leading-[24px] font-medium text-[#0D61AE] flex items-center gap-[6px] hover:underline">
                <span>{t.viewAll}</span>
                <span className="text-[14px]">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. SUBSITE FOOTER
         ========================================== */}
      <footer className="w-full flex flex-col">
        <div className="w-full bg-[#0A3D30] min-h-[72px] px-[64px] flex justify-center items-center">
          <div className="flex flex-wrap justify-center items-center gap-[24px] text-[16px] leading-[22px] font-normal text-white">
            <Link href="/" className="hover:underline">{t.copyrightPolicy}</Link>
            <Link href="/" className="hover:underline">{t.help}</Link>
            <Link href="/" className="hover:underline">{t.hyperlinkingPolicy}</Link>
            <Link href="/" className="hover:underline">{t.privacyPolicy}</Link>
            <Link href="/" className="hover:underline">{t.termsConditions}</Link>
            <Link href="/" className="hover:underline">{t.archive}</Link>
          </div>
        </div>

        <div className="w-full bg-[#2A2A2A] min-h-[40px] px-[64px] flex flex-wrap justify-between items-center text-[14px] leading-[19px] font-normal text-white">
          <span>{t.copyrightFooter}</span>
          <span>{t.lastUpdated}</span>
        </div>
      </footer>
    </div>
  );
}
