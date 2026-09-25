'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import DualFlagStand from '@/components/DualFlagStand';
import { getCloudFrontUrl, transformHtmlAssetUrls } from '@/lib/cdnUtils';

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
  // Next.js 16 Dynamic Route Parameter Unwrapping via React.use()
  const resolvedParams = React.use(params);
  const rawSlug = decodeURIComponent(resolvedParams.slug);
  const slugDecoded = rawSlug.toLowerCase();
  
  // Dynamic Language Synchronization (English ↔ हिन्दी)
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [dbContent, setDbContent] = useState<string | null>(null);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    const getBackendSlug = (s: string) => {
      const lower = s.toLowerCase();
      if (lower.includes('intosai')) return 'page-involvement-with-intosai';
      if (lower.includes('asosai')) return 'page-involvement-with-asosai';
      if (lower.includes('multilateral')) return 'page-global-audit-leadership-forum-and-other-multilateral-bodies';
      if (lower.includes('bilateral')) return 'page-bilateral-relations-of-sai-india';
      if (lower.includes('un panel')) return 'page-un-panel-of-external-auditors';
      if (lower.includes('present')) return 'page-present-international-audits';
      if (lower.includes('past')) return 'page-past-international-audits';
      return s;
    };

    const backendSlug = getBackendSlug(slugDecoded);
    fetch(`http://127.0.0.1:8000/api/v1/admin/global-relations/pages/${backendSlug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.data && json.data.content) {
          setDbContent(json.data.content);
        }
      })
      .catch((err) => console.warn('Could not fetch DB content for page:', err));
  }, [slugDecoded]);

  const isHindi = lang === 'हिन्दी';

  // Complete Sidebar menu definition for Global Relations
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
      heading: 'Audit Engagements',
      hindiHeading: 'लेखा परीक्षा सहभागिता',
      links: [
        { name: 'UN Panel of External Auditors', hindiName: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल', slug: 'un panel of external auditors' },
        { name: 'Present International Audits', hindiName: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा', slug: 'present international audits' },
        { name: 'Past International Audits', hindiName: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा', slug: 'past international audits' },
        { name: 'Overseas Audit Offices', hindiName: 'विदेशी लेखा परीक्षा कार्यालय', slug: 'overseas audit offices' }
      ]
    }
  ];

  // Filter groups to display only the relevant group for the current section (e.g. Audit Engagements for UN Panel)
  const activeGroups = groups.filter(grp => grp.links.some(link => link.slug === slugDecoded));
  const groupsToDisplay = activeGroups.length > 0 ? activeGroups : [groups[0]];

  // Dynamic page title computation
  const isIntosai = slugDecoded === 'association with intosai';
  const isAsosai = slugDecoded === 'association with asosai';
  const isMultilateral = slugDecoded === 'multilateral engagement';
  const isBilateral = slugDecoded === 'bilateral relations';
  const isUnPanel = slugDecoded === 'un panel of external auditors';
  const isPresentAudits = slugDecoded === 'present international audits';
  const isPastAudits = slugDecoded === 'past international audits';
  const isOverseas = slugDecoded === 'overseas audit offices';

  let pageTitle = rawSlug;
  let heroTitle = rawSlug;
  let breadcrumbParent = isHindi ? 'वैश्विक संबंध' : 'Global Relations';

  if (isIntosai) {
    pageTitle = isHindi ? 'INTOSAI के साथ जुड़ाव' : 'Association with INTOSAI';
    heroTitle = pageTitle;
  } else if (isAsosai) {
    pageTitle = isHindi ? 'ASOSAI के साथ जुड़ाव' : 'Association with ASOSAI';
    heroTitle = pageTitle;
  } else if (isMultilateral) {
    pageTitle = isHindi ? 'बहुपक्षीय सहभागिता' : 'Multilateral Engagement';
    heroTitle = isHindi ? 'बहुपक्षीय मंचों के साथ सहभागिता' : 'Engagement with Multilateral Forums';
  } else if (isBilateral) {
    pageTitle = isHindi ? 'द्विपक्षीय संबंध' : 'Bilateral Relations';
    heroTitle = pageTitle;
  } else if (isUnPanel) {
    pageTitle = isHindi ? 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल' : 'UN Panel of External Auditors';
    heroTitle = pageTitle;
    breadcrumbParent = isHindi ? 'लेखा परीक्षा सहभागिता' : 'Audit Engagements';
  } else if (isPresentAudits) {
    pageTitle = isHindi ? 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा' : 'Present International Audits';
    heroTitle = pageTitle;
    breadcrumbParent = isHindi ? 'लेखा परीक्षा सहभागिता' : 'Audit Engagements';
  } else if (isPastAudits) {
    pageTitle = isHindi ? 'विगत अंतर्राष्ट्रीय लेखा परीक्षा' : 'Past International Audits';
    heroTitle = pageTitle;
    breadcrumbParent = isHindi ? 'लेखा परीक्षा सहभागिता' : 'Audit Engagements';
  } else if (isOverseas) {
    pageTitle = isHindi ? 'विदेशी लेखा परीक्षा कार्यालय' : 'Overseas Audit Offices';
    heroTitle = pageTitle;
    breadcrumbParent = isHindi ? 'लेखा परीक्षा सहभागिता' : 'Audit Engagements';
  }

  // Hyperlink inline style to force visible underline for web URLs (Black)
  const linkStyle: React.CSSProperties = {
    color: '#2A2A2A',
    textDecoration: 'underline',
    textDecorationColor: '#2A2A2A',
    textDecorationThickness: '1.5px',
    textUnderlineOffset: '3px',
    cursor: 'pointer'
  };

  // Black Hyperlink inline style for speeches & meeting images bullet list items
  const blackLinkStyle: React.CSSProperties = {
    color: '#2A2A2A',
    textDecoration: 'underline',
    textDecorationColor: '#2A2A2A',
    textDecorationThickness: '1px',
    textUnderlineOffset: '2px',
    cursor: 'pointer'
  };

  // Exact 24 countries sequence matching Figma design reference grid
  const countries = [
    'Bhutan', 'Brazil', 'Cambodia', 'Chile', 'China', 'Indonesia',
    'Israel', 'Kazakhstan', 'Korea', 'Kuwait', 'Maldives', 'Iran',
    'Russia', 'Bahrain', 'Korea', 'Kuwait', 'Maldives', 'Iran',
    'Israel', 'Kazakhstan', 'Korea', 'Kuwait', 'Maldives', 'Iran'
  ];

  // Helper to map country names to exact SVG flag assets exported from Figma
  const getFlagSvgPath = (countryName: string) => {
    const c = countryName.toLowerCase();
    if (c.includes('bhutan')) return '/assets/Images/flags/bhutan.svg';
    if (c.includes('brazil')) return '/assets/Images/flags/brazil.svg';
    if (c.includes('cambodia')) return '/assets/Images/flags/cambodia.svg';
    if (c.includes('chile')) return '/assets/Images/flags/Chile.svg';
    if (c.includes('china')) return '/assets/Images/flags/China.svg';
    if (c.includes('indonesia')) return '/assets/Images/flags/Indonesia.svg';
    if (c.includes('israel')) return '/assets/Images/flags/Israel.svg';
    if (c.includes('kazakhstan')) return '/assets/Images/flags/Kazakhstan.svg';
    if (c.includes('korea')) return '/assets/Images/flags/Korea.svg';
    if (c.includes('kuwait')) return '/assets/Images/flags/Kuwait.svg';
    if (c.includes('maldives')) return '/assets/Images/flags/Maldives.svg';
    if (c.includes('iran')) return '/assets/Images/flags/Iran.svg';
    if (c.includes('russia')) return '/assets/Images/flags/Russia.svg';
    if (c.includes('bahrain')) return '/assets/Images/flags/Bahrain.svg';
    return null;
  };

  // Dynamically parse DB content for Bilateral Relations grid items and text (Read-Only)
  const parsedBilateralData = React.useMemo(() => {
    if (!dbContent || typeof window === 'undefined') return null;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(dbContent, 'text/html');

      const paragraphs = Array.from(doc.querySelectorAll('p'));
      const topHeadingEl = paragraphs.find(p => p.textContent?.toLowerCase().includes('presently sai india') || p.textContent?.toLowerCase().includes('mou'));
      const topHeading = topHeadingEl ? topHeadingEl.textContent?.trim() : null;

      const bottomParaEl = paragraphs.find(p => p.textContent?.toLowerCase().includes('regular bilateral exchanges') || p.textContent?.toLowerCase().includes('bilateral exchanges'));
      const bottomPara = bottomParaEl ? bottomParaEl.textContent?.trim() : null;

      const listItems = Array.from(doc.querySelectorAll('li'));
      const parsedCountries: { name: string; link?: string; imgSrc?: string; isIdi: boolean }[] = [];

      listItems.forEach((li) => {
        const text = li.textContent?.trim() || '';
        if (!text) return;
        if (
          text.includes('Involvement with') ||
          text.includes('Global Audit Leadership') ||
          text.includes('International Audit Assignments') ||
          text.includes('Bilateral Relations Of SAI India')
        ) {
          return;
        }

        const aTag = li.querySelector('a[href]') || li.querySelector('a');
        let rawLink = aTag?.getAttribute('href') || aTag?.getAttribute('media') || undefined;
        let link = rawLink ? getCloudFrontUrl(rawLink) : undefined;

        const imgTag = li.querySelector('img');
        const rawImgSrc = imgTag?.getAttribute('src') || undefined;
        let imgSrc = rawImgSrc ? getCloudFrontUrl(rawImgSrc) : undefined;

        let name = text;
        const pTag = li.querySelector('p');
        if (pTag && pTag.textContent?.trim()) {
          name = pTag.textContent.trim();
        } else if (aTag && aTag.textContent?.trim()) {
          name = aTag.textContent.trim();
        }

        if (name) {
          const isIdi = name.toLowerCase().includes('intosai development') || name.toLowerCase().includes('idi');
          parsedCountries.push({ name, link, imgSrc, isIdi });
        }
      });

      return {
        topHeading: topHeading || (isHindi 
          ? 'वर्तमान में SAI भारत के 29 सर्वोच्च लेखा परीक्षा संस्थानों के साथ समझौता ज्ञापन/जुड़वां व्यवस्थाएं हैं:' 
          : 'Presently SAI India has MoUs/twinning arrangements with 29 Supreme Audit Institutions viz.'),
        bottomPara: bottomPara || (isHindi 
          ? 'इन व्यवस्थाओं के तहत द्विपक्षीय सेमिनार, प्रशिक्षण कार्यक्रम, प्रतिनियुक्ति, क्षमता निर्माण कार्यशालाएं, विशिष्ट लेखापरीक्षाओं के लिए मार्गदर्शन आदि जैसे नियमित द्विपक्षीय आदान-प्रदान आयोजित किए जाते हैं।' 
          : 'Regular bilateral exchanges like bilateralseminars, training programmes, secondments, capacity building workshops, hand holding for specific audits etc. are held under these arrangements.'),
        countries: parsedCountries
      };
    } catch (e) {
      console.warn('Failed to parse bilateral DB content:', e);
      return null;
    }
  }, [dbContent, isHindi]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        paddingTop: '24px',
        paddingBottom: '220px',
        paddingLeft: '64px',
        paddingRight: '64px',
        boxSizing: 'border-box',
        fontFamily: "'Noto Sans', sans-serif"
      }}
    >
      {/* Dynamic Breadcrumbs (Figma: width 286px, height 16px, left 64px, top 144px, gap 8px) */}
      <nav
        aria-label="Breadcrumb"
        className="global-relations-breadcrumbs"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px',
          gap: '8px',
          height: '16px',
          marginBottom: isBilateral ? '32px' : '24px',
          fontFamily: "'Noto Sans', sans-serif"
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 400,
            color: '#565656',
            textDecoration: 'none',
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}
          className="hover:underline"
        >
          {isHindi ? 'गृह' : 'Home'}
        </Link>

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, flex: 'none', order: 1, flexGrow: 0 }}>
          <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <Link
          href="/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI"
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 400,
            color: '#565656',
            textDecoration: 'none',
            flex: 'none',
            order: 2,
            flexGrow: 0
          }}
          className="hover:underline"
        >
          {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
        </Link>

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, flex: 'none', order: 3, flexGrow: 0 }}>
          <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <span
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 600,
            color: '#2E2E31',
            whiteSpace: 'nowrap',
            flex: 'none',
            order: 4,
            flexGrow: 0
          }}
        >
          {pageTitle}
        </span>
      </nav>

      {isBilateral ? (
        /* BILATERAL RELATIONS PAGE FULL WIDTH LAYOUT (1312px) - POPULATED DYNAMICALLY FROM DB */
        <main className="w-full">
          {/* Top Heading from DB */}
          <h1 className="font-['Noto_Sans'] font-semibold text-[16px] leading-[22px] text-[#000000] mb-6">
            {parsedBilateralData?.topHeading || (isHindi 
              ? 'वर्तमान में SAI भारत के 29 सर्वोच्च लेखा परीक्षा संस्थानों के साथ समझौता ज्ञापन/जुड़वां व्यवस्थाएं हैं:' 
              : 'Presently SAI India has MoUs/twinning arrangements with 29 Supreme Audit Institutions viz.')}
          </h1>

          {/* 6-Column Flag Cards Grid populated dynamically from DB content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-8">
            {(parsedBilateralData?.countries && parsedBilateralData.countries.length > 0 
              ? parsedBilateralData.countries 
              : countries.map(c => ({ name: c, isIdi: false, link: undefined, imgSrc: undefined }))
            ).map((countryItem, idx) => {
              if (countryItem.isIdi) {
                return (
                  <div key={idx} className="bg-white border border-[#E6E6E6] rounded-[8px] p-4 flex flex-col items-center justify-center shadow-[4px_4px_4px_rgba(0,0,0,0.02)] min-h-[186px] h-full transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                    <p className="font-['Noto_Sans'] font-semibold text-[16px] leading-[22px] text-[#2A2A2A] text-center">
                      {countryItem.name}
                    </p>
                  </div>
                );
              }

              const svgPath = getFlagSvgPath(countryItem.name);
              const cdnImgSrc = svgPath || countryItem.imgSrc;

              const cardContent = svgPath ? (
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform hover:-translate-y-1 hover:drop-shadow-md cursor-pointer"
                >
                  <img 
                    src={svgPath} 
                    alt={`${countryItem.name} Bilateral Relations`} 
                    className="w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div 
                  className="bg-white border border-[#E6E6E6] rounded-[8px] p-4 flex flex-col items-center justify-center shadow-[4px_4px_4px_rgba(0,0,0,0.02)] min-h-[186px] h-full transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer w-full"
                >
                  <div className="flex-1 flex items-center justify-center mb-2 w-full">
                    {cdnImgSrc ? (
                      <img 
                        src={cdnImgSrc} 
                        alt={`${countryItem.name} Bilateral Relations`} 
                        className="w-full h-auto max-h-[120px] object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const fallbackEl = target.nextElementSibling as HTMLElement;
                          if (fallbackEl) fallbackEl.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-full items-center justify-center" 
                      style={{ display: cdnImgSrc ? 'none' : 'flex' }}
                    >
                      <DualFlagStand country={countryItem.name} />
                    </div>
                  </div>
                  <div className="w-full pt-2 border-t border-[#E6E6E6]">
                    <p className="font-['Noto_Sans'] font-semibold text-[14px] leading-[18px] text-[#2A2A2A] text-center">
                      {countryItem.name}
                    </p>
                  </div>
                </div>
              );

              if (countryItem.link) {
                return (
                  <a key={idx} href={countryItem.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    {cardContent}
                  </a>
                );
              }
              return <React.Fragment key={idx}>{cardContent}</React.Fragment>;
            })}
          </div>

          {/* Bottom Closing Paragraph from DB */}
          <p className="font-['Noto_Sans'] font-semibold text-[16px] leading-[24px] text-[#000000]">
            {parsedBilateralData?.bottomPara || (isHindi 
              ? 'इन व्यवस्थाओं के तहत द्विपक्षीय सेमिनार, प्रशिक्षण कार्यक्रम, प्रतिनियुक्ति, क्षमता निर्माण कार्यशालाएं, विशिष्ट लेखापरीक्षाओं के लिए मार्गदर्शन आदि जैसे नियमित द्विपक्षीय आदान-प्रदान आयोजित किए जाते हैं।' 
              : 'Regular bilateral exchanges like bilateralseminars, training programmes, secondments, capacity building workshops, hand holding for specific audits etc. are held under these arrangements.')}
          </p>
        </main>
      ) : (
        /* OTHER PAGES WITH SIDEBAR (INTOSAI, ASOSAI, MULTILATERAL, UN PANEL) */
        <div className="flex flex-col lg:flex-row gap-[24px] items-start">
          {/* Left Side Menu */}
          <aside className="w-full lg:w-[310px] shrink-0 bg-white border border-[#E6E6E6] rounded-[8px] p-[24px] shadow-[4px_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="font-semibold text-[20px] leading-[27px] text-[#000000] pb-3 border-b border-[#D7D7D7] mb-4">
              {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
            </h2>
            <div className="space-y-4">
              {groupsToDisplay.map((grp, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="font-bold text-[16px] leading-[22px] text-[#2A2A2A] px-2 py-1">
                    {isHindi ? grp.hindiHeading : grp.heading}
                  </p>
                  <div className="space-y-[4px]">
                    {grp.links.map((link) => {
                      const isActive = slugDecoded === link.slug;
                      return (
                        <Link
                          key={link.slug}
                          href={`/About/Index-Menu-About/Global-relations/${encodeURIComponent(link.name)}`}
                          className={`block text-[14px] leading-[19px] py-2 px-4 rounded-[0px] transition-colors ${
                            isActive
                              ? 'bg-[rgba(117,22,57,0.08)] font-semibold border-l border-[#751639]'
                              : 'bg-white font-normal border-l border-[#D7D7D7] hover:bg-slate-50'
                          }`}
                          style={{
                            color: isActive ? '#751639' : '#2A2A2A',
                            fontWeight: isActive ? 600 : 400
                          }}
                        >
                          {isHindi ? link.hindiName : link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            {/* Top Hero Banner (Frame 2147227446) */}
            <div className="sub-site-banner relative w-full h-[141.33px] bg-white rounded-[8px] overflow-hidden mb-6 shadow-sm">
              {/* Background Banner Image */}
              <img 
                src="/assets/Images/banner.png" 
                alt="Header Background" 
                className="sub-site-banner__bg absolute inset-0 w-full h-full object-cover"
              />

              {/* Left Title */}
              <div className="sub-site-banner__content absolute left-[37px] top-1/2 -translate-y-1/2 z-10 max-w-[650px]">
                <h1 className="sub-site-banner__title font-['Noto_Sans'] font-bold text-[24px] leading-[38px] text-white drop-shadow-sm">
                  {heroTitle}
                </h1>
              </div>

              {/* Right Logo Section (Centered in White Background Area) */}
              {isUnPanel ? (
                <img 
                  src="/assets/Images/unpanel-logo.svg" 
                  alt="UN Panel of External Auditors Logo" 
                  className="sub-site-banner__logo absolute z-10"
                  style={{
                    position: 'absolute',
                    width: '141.39px',
                    height: '101.24px',
                    right: '32px',
                    top: '20.05px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div className="sub-site-banner__logo-wrapper absolute right-0 top-0 bottom-0 w-[205px] z-10 flex items-center justify-center">
                  <img 
                    src={
                      isIntosai 
                        ? "/assets/Images/INTOSAI-logo.svg"
                        : ((isPresentAudits || isPastAudits)
                            ? "/assets/Images/presentIA-logo.svg"
                            : (isMultilateral 
                                ? "/assets/Images/multilateral-logo.svg" 
                                : (isAsosai ? "/assets/Images/ASOSAI-logo.svg" : "/assets/Images/INTOSAI-logo.svg")))
                    } 
                    alt="Organization Logo" 
                    className={`sub-site-banner__logo ${
                      isIntosai 
                        ? "w-[80px] h-[77px] object-contain"
                        : ((isPresentAudits || isPastAudits)
                            ? "w-[167px] h-[120px] object-contain"
                            : (isMultilateral 
                                ? "w-[103px] h-[103px] object-contain" 
                                : (isAsosai ? "w-[126px] h-[40px] object-contain" : "w-[80px] h-[77px] object-contain")))
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Main Article Body Text */}
            <div className="text-[14px] leading-[24px] tracking-normal space-y-4 text-justify font-['Noto_Sans']">
              {dbContent ? (
                <div
                  className="w-full text-[#2A2A2A] font-['Noto_Sans'] space-y-4 leading-[24px]"
                  dangerouslySetInnerHTML={{ __html: transformHtmlAssetUrls(dbContent) }}
                />
              ) : isOverseas ? (
                /* OVERSEAS AUDIT OFFICES DIRECTORY */
                <div className="space-y-6 text-left not-prose font-['Noto_Sans']">
                  <p className="text-[14px] leading-[24px] text-[#2A2A2A]">
                    {isHindi
                      ? 'भारत के संविधान के अनुच्छेद 148, 149 और 151 के अंतर्गत नियंत्रक एवं महालेखापरीक्षक (सीएजी) विदेश स्थित भारत सरकार के सभी लेन-देन का सर्वोच्च संवैधानिक लेखापरीक्षक है। विदेशी मिशनों, कल्याणकारी निधियों (आईसीडब्ल्यूएफ) और विदेशी संपत्तियों के लेखापरीक्षा हेतु तीन क्षेत्रीय कमान मुख्यालय कार्यरत हैं:'
                      : 'Under Articles 148, 149, and 151 of the Constitution of India, read with the CAG (DPC) Act 1971, the Comptroller and Auditor General of India is the supreme constitutional auditor of all transactions of the Government of India abroad. Overseas audit operations are executed through three strategic regional command directorates overseeing 180+ diplomatic missions, consulates general, and specialized representations worldwide:'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                    {/* London Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-bold text-emerald-800">LDN</span>
                          <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                            98 Missions
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">
                          {isHindi ? 'महानिदेशक लेखापरीक्षा का कार्यालय, लंदन' : 'Office of the Director General of Audit, London'}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          {isHindi
                            ? 'यूनाइटेड किंगडम, यूरोप, रूस, मध्य पूर्व और अफ्रीका में 98 राजनयिक एवं रक्षा खरीद मिशन।'
                            : '98 diplomatic and defence procurement missions across the UK, Europe, Russia, Africa, and Middle East.'}
                        </p>
                        <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                          <strong>Location:</strong> India House, Aldwych, London
                        </div>
                      </div>
                      <div className="pt-4 mt-4">
                        <Link
                          href="/pda/ldn/en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full py-2 px-3 rounded-md bg-[#0a3d30] hover:bg-[#124235] text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          <span>{isHindi ? 'लंदन उप-साइट खोलें' : 'Visit London Subsite'}</span>
                          <span className="ml-1">➔</span>
                        </Link>
                      </div>
                    </div>

                    {/* Kuala Lumpur Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-bold text-emerald-800">KUL</span>
                          <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                            54 Missions
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">
                          {isHindi ? 'प्रधान निदेशक लेखापरीक्षा का कार्यालय, कुआलालंपुर' : 'Office of the Principal Director of Audit, Kuala Lumpur'}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          {isHindi
                            ? 'दक्षिण-पूर्व एशिया, पूर्व एशिया, ऑस्ट्रेलेशिया और ओशिनिया में 54 राजनयिक मिशन एवं एक्ट ईस्ट अनुदान।'
                            : '54 diplomatic missions, Act East grants, and ICWF welfare funds across Southeast Asia, East Asia, and Australasia.'}
                        </p>
                        <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                          <strong>Location:</strong> Mont Kiara, Kuala Lumpur
                        </div>
                      </div>
                      <div className="pt-4 mt-4">
                        <Link
                          href="/pda/kul/en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full py-2 px-3 rounded-md bg-[#0a3d30] hover:bg-[#124235] text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          <span>{isHindi ? 'कुआलालंपुर उप-साइट खोलें' : 'Visit Kuala Lumpur Subsite'}</span>
                          <span className="ml-1">➔</span>
                        </Link>
                      </div>
                    </div>

                    {/* Washington DC Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-bold text-emerald-800">WDC</span>
                          <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                            68 Missions
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base mb-1">
                          {isHindi ? 'प्रधान निदेशक लेखापरीक्षा का कार्यालय, वाशिंगटन डीसी' : 'Office of the Principal Director of Audit, Washington DC'}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">
                          {isHindi
                            ? 'उत्तरी व दक्षिणी अमेरिका, संयुक्त राष्ट्र मिशन (पीएमआई न्यूयॉर्क) और एफएमएस रक्षा खरीद एस्क्रो।'
                            : '68 diplomatic missions across the Americas, UN Missions (PMI NY), and Foreign Military Sales (FMS) escrows.'}
                        </p>
                        <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                          <strong>Location:</strong> Embassy Row, Washington, DC
                        </div>
                      </div>
                      <div className="pt-4 mt-4">
                        <Link
                          href="/pda/wdc/en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full py-2 px-3 rounded-md bg-[#0a3d30] hover:bg-[#124235] text-white text-xs font-bold transition-colors shadow-sm"
                        >
                          <span>{isHindi ? 'वाशिंगटन डीसी उप-साइट खोलें' : 'Visit Washington DC Subsite'}</span>
                          <span className="ml-1">➔</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isPastAudits ? (
                /* PAST INTERNATIONAL AUDITS PAGE CONTENT */
                isHindi ? (
                  <>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      संयुक्त राष्ट्र लेखा परीक्षकों का बोर्ड
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक (सीएजी) अतीत में निम्नानुसार प्रत्येक 6 वर्ष के दो कार्यकालों के लिए संयुक्त राष्ट्र लेखा परीक्षक बोर्ड के सदस्य रहे हैं:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1 text-[#2A2A2A] font-normal my-2">
                      <li>1993-1999</li>
                      <li>2014-2020</li>
                    </ol>
                    <p className="text-[#2A2A2A] font-normal">
                      सीएजी 2017 और 2018 के दौरान संयुक्त राष्ट्र लेखा परीक्षक बोर्ड के अध्यक्ष रहे हैं।
                    </p>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      अन्य संयुक्त राष्ट्र निकाय / एजेंसियां
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक अतीत में निम्नलिखित संयुक्त राष्ट्र निकायों / एजेंसियों के बाह्य लेखा परीक्षक रहे हैं:
                    </p>

                    {/* Data Table */}
                    <div className="w-full overflow-x-auto my-4 border border-[#D7D7D7] rounded-[4px] shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#751639] text-white font-medium text-[16px] leading-[26px]">
                            <th className="py-3 px-4 text-center w-[90px] border-r border-white/20">Sr. No.</th>
                            <th className="py-3 px-6 border-r border-white/20">Organization</th>
                            <th className="py-3 px-6 text-center w-[180px]">Period</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6E6E6] text-[14px] leading-[24px] text-[#2A2A2A]">
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">1</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">World Health Organization (WHO)</td>
                            <td className="py-3 px-6 text-center">2004 to 2012</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">2</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Maritime Organization (IMO)</td>
                            <td className="py-3 px-6 text-center">2000 to 2012</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">3</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Centre for Genetic Engineering and Biotechnology (ICGEB)</td>
                            <td className="py-3 px-6 text-center">1996 to 2004</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">4</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">Food and Agriculture Organization (FAO)</td>
                            <td className="py-3 px-6 text-center">2002 to 2008</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">5</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">Organisation for Prohibition of Chemical Weapons (OPCW)</td>
                            <td className="py-3 px-6 text-center">1997 to 2003</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">6</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">UN World Tourism Organisation (UNWTO)</td>
                            <td className="py-3 px-6 text-center">2000 to 2015</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">7</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">World Food Programme (WFP)</td>
                            <td className="py-3 px-6 text-center">2010 to 2016</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">8</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Atomic Energy Agency (IAEA)</td>
                            <td className="py-3 px-6 text-center">2012 to 2016</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">9</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Organization for Migration (IOM)</td>
                            <td className="py-3 px-6 text-center">2010 to 2016</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">10</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">World Intellectual Property Organisation (WIPO)</td>
                            <td className="py-3 px-6 text-center">2012 to 2017</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-[#2A2A2A] font-normal">
                      उपरोक्त के अलावा, सीएजी ने 2011 में अंतर्राष्ट्रीय थर्मोन्यूक्लियर प्रायोगिक रिएक्टर (ITER) का प्रबंधन मूल्यांकन भी किया।
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      United Nations Board of Auditors
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India (CAG) has been the Member in the UN Board of Auditors for two terms of 6 years each in the past as per details below:
                    </p>
                    <ol className="list-decimal pl-6 space-y-1 text-[#2A2A2A] font-normal my-2">
                      <li>1993-1999</li>
                      <li>2014-2020</li>
                    </ol>
                    <p className="text-[#2A2A2A] font-normal">
                      CAG has been the Chair of UN Board of Auditors during 2017 and 2018.
                    </p>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      Other UN Bodies / Agencies
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India has been the external auditor of the following UN Bodies / Agencies in the past:
                    </p>

                    {/* Data Table */}
                    <div className="w-full overflow-x-auto my-4 border border-[#D7D7D7] rounded-[4px] shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#751639] text-white font-medium text-[16px] leading-[26px]">
                            <th className="py-3 px-4 text-center w-[90px] border-r border-white/20">Sr. No.</th>
                            <th className="py-3 px-6 border-r border-white/20">Organization</th>
                            <th className="py-3 px-6 text-center w-[180px]">Period</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6E6E6] text-[14px] leading-[24px] text-[#2A2A2A]">
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">1</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">World Health Organization (WHO)</td>
                            <td className="py-3 px-6 text-center">2004 to 2012</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">2</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Maritime Organization (IMO)</td>
                            <td className="py-3 px-6 text-center">2000 to 2012</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">3</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Centre for Genetic Engineering and Biotechnology (ICGEB)</td>
                            <td className="py-3 px-6 text-center">1996 to 2004</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">4</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">Food and Agriculture Organization (FAO)</td>
                            <td className="py-3 px-6 text-center">2002 to 2008</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">5</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">Organisation for Prohibition of Chemical Weapons (OPCW)</td>
                            <td className="py-3 px-6 text-center">1997 to 2003</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">6</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">UN World Tourism Organisation (UNWTO)</td>
                            <td className="py-3 px-6 text-center">2000 to 2015</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">7</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">World Food Programme (WFP)</td>
                            <td className="py-3 px-6 text-center">2010 to 2016</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">8</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Atomic Energy Agency (IAEA)</td>
                            <td className="py-3 px-6 text-center">2012 to 2016</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">9</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">International Organization for Migration (IOM)</td>
                            <td className="py-3 px-6 text-center">2010 to 2016</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-center border-r border-[#E6E6E6]">10</td>
                            <td className="py-3 px-6 border-r border-[#E6E6E6]">World Intellectual Property Organisation (WIPO)</td>
                            <td className="py-3 px-6 text-center">2012 to 2017</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-[#2A2A2A] font-normal">
                      Apart from the above, CAG also conducted Management Assessment of the International Thermonuclear Experimental Reactor (ITER) in 2011.
                    </p>
                  </>
                )
              ) : isPresentAudits ? (
                /* PRESENT INTERNATIONAL AUDITS PAGE CONTENT */
                isHindi ? (
                  <>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      अंतर्राष्ट्रीय परमाणु ऊर्जा एजेंसी (IAEA), विएना
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक को 2022 से 2027 तक छह वर्ष की अवधि के लिए अंतर्राष्ट्रीय परमाणु ऊर्जा एजेंसी (IAEA), विएना का बाह्य लेखा परीक्षक चुना गया है। सीएजी ने इंडोनेशिया गणराज्य के लेखा परीक्षा बोर्ड से पदभार ग्रहण किया।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      IAEA परमाणु क्षेत्र में सहयोग का वैश्विक केंद्र है। यह संयुक्त राष्ट्र परिवार के भीतर &quot;शांति के लिए परमाणु&quot; संगठन के रूप में स्थापित किया गया था। IAEA की वेबसाइट है:{' '}
                      <a href="https://www.iaea.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.iaea.org/
                      </a>
                    </p>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      खाद्य एवं कृषि संगठन (FAO), रोम
                    </h2>
                    <p className="font-normal text-[20px] leading-[31px] text-[#2A2A2A] my-3">
                      भारत के नियंत्रक और महालेखापरीक्षक पिछले पांच वर्षों से खाद्य एवं कृषि संगठन (FAO), रोम के बाह्य लेखा परीक्षक के रूप में कार्य कर रहे हैं। SAI भारत को 2020-2025 तक की अवधि के लिए FAO के बाह्य लेखा परीक्षक के रूप में चुना गया था।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      FAO संयुक्त राष्ट्र की एक विशेष एजेंसी है जो भूख को हराने के अंतर्राष्ट्रीय प्रयासों का नेतृत्व करती है। FAO की वेबसाइट है:{' '}
                      <a href="http://www.fao.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.fao.org/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      सीएजी ने रोम स्थित एफएओ मुख्यालय में बाह्य लेखा परीक्षा निदेशक (डीईए) के रूप में एक वरिष्ठ आईएएएस अधिकारी को तैनात किया है।
                    </p>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      विश्व स्वास्थ्य संगठन (WHO), जेनेवा
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक ने मई/जून 2020 में SAI फिलीपींस से इस लेखा परीक्षा का पदभार लेने के बाद 2020-2023 से चार साल के कार्यकाल के लिए विश्व स्वास्थ्य संगठन (WHO) के बाह्य लेखा परीक्षक के रूप में कार्य किया। सीएजी को 2024-2027 से आगे के चार साल के कार्यकाल के लिए पुनः नियुक्त किया गया है।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      WHO संयुक्त राष्ट्र की एक विशेष एजेंसी है जो स्वास्थ्य को बढ़ावा देने और दुनिया को सुरक्षित रखने के लिए राष्ट्रों को जोड़ती है। WHO की वेबसाइट है:{' '}
                      <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.who.int/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      सीएजी ने जेनेवा में डब्ल्यूएचओ मुख्यालय में बाह्य लेखा परीक्षा निदेशक (डीईए) के रूप में एक वरिष्ठ आईएएएस अधिकारी को तैनात किया है।
                    </p>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      रासायनिक हथियार निषेध संगठन (OPCW), हेग
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक को लगातार दूसरे तीन साल के कार्यकाल (2024-2026) के लिए OPCW के बाह्य लेखा परीक्षक के रूप में पुनः नियुक्त किया गया है।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      OPCW रासायनिक हथियार सम्मेलन के लिए कार्यान्वयन निकाय है। OPCW की वेबसाइट है:{' '}
                      <a href="https://www.opcw.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.opcw.org/
                      </a>
                    </p>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      अंतर्राष्ट्रीय श्रम संगठन (ILO)
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक को 79वें और 80वें वित्तीय काल के लिए ILO का बाह्य लेखा परीक्षक चुना गया है।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      ILO संयुक्त राष्ट्र की एक एजेंसी है जिसका जनादेश अंतर्राष्ट्रीय श्रम मानकों को स्थापित करना है। ILO की वेबसाइट है:{' '}
                      <a href="https://www.ilo.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.ilo.org/
                      </a>
                    </p>
                  </>
                ) : (
                  <>
                    {/* Section 1: IAEA */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      International Atomic Energy Agency (IAEA), Vienna
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India, has been elected as External Auditor of the International Atomic Energy Agency (IAEA), Vienna for a six-year term from 2022 to 2027. The Comptroller &amp; Auditor General took over from the  then incumbent External Auditor of IAEA, Audit Board of the Republic of Indonesia.
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      The IAEA is the world&apos;s centre for cooperation in the nuclear field. It was set up as the world&apos;s &quot;Atoms for Peace&quot; organization within the United Nations family. The Agency works with its Member States and multiple partners worldwide to promote a safe, secure and peaceful use of nuclear technologies. Website of IAEA is{' '}
                      <a href="https://www.iaea.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.iaea.org/
                      </a>
                    </p>

                    {/* Section 2: FAO */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      Food and Agriculture Organization (FAO), Rome
                    </h2>

                    {/* Large Highlight Paragraph matching Figma (20px font-size, 31px line-height, #2A2A2A) */}
                    <p className="font-normal text-[20px] leading-[31px] text-[#2A2A2A] my-3">
                      The Comptroller and Auditor General of India is serving as External Auditor of Food and Agriculture Organization (FAO), Rome from last five years. SAI India was elected as the External Auditor of FAO for a term from 2020-2025 and took over this audit from SAI Philippines in May/June 2020.
                    </p>

                    {/* FAO Paragraph 1 */}
                    <p className="text-[#2A2A2A] font-normal">
                      FAO is a specialized agency of the United Nations that leads international efforts to defeat hunger, and is headquartered in Rome, Italy. FAO’s goal is to achieve food security for all and make sure that people have regular access to enough high quality food to lead active healthy lives. Website of FAO is{' '}
                      <a href="http://www.fao.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.fao.org/
                      </a>
                    </p>

                    {/* FAO Paragraph 2 */}
                    <p className="text-[#2A2A2A] font-normal">
                      CAG has posted a senior IAAS officer as Director of External Audit (DEA) in FAO headquarters in Rome. The DEA is responsible for Risk Assessment, Audit Planning, Quality Assurance of audit deliverables, interfacing with the FAO management, hose Charged with Governance (TCWG) and internal audit.
                    </p>

                    {/* Section 3: WHO */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      World Health Organization (WHO), Geneva
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India served as the External Auditor of World Health Organization (WHO) for a four-year term from 2020-2023 after taking over this audit from SAI Philippines in May/June 2020.The CAG has been reappointed as the External Auditor of WHO for a further four-year term from 2024-2027.
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      WHO, headquartered in Geneva, Switzerland is a specialized agency of the United Nations that connects nations, partners and people to promote health, keep the world safe and serve the vulnerable – so everyone, everywhere can attain the highest level of health. WHO leads global efforts to expand universal health coverage. It directs and coordinates the world’s response to health emergencies. Website of WHO is{' '}
                      <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.who.int/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      CAG has posted a senior IAAS officer as Director of External Audit (DEA) in WHO headquarters in Geneva. The DEA is responsible for Risk Assessment, Audit Planning, Quality Assurance of audit deliverables, interfacing with the WHO management, Those Charged with Governance (TCWG) and internal audit.
                    </p>

                    {/* Section 4: OPCW */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      Organization for Prohibition of Chemical Weapons (OPCW), Hague
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India has been re-appointed as External auditor of OPCW for  a second consecutive three  year term  (2024-2026). Previously, the CAG of India served in this role for the 2021- 2023 term.
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      OPCW, headquartered at the Hague, Netherlands, is the implementing body for the Chemical Weapons Convention, which entered into force on 29 April 1997. The OPCW oversees the global endeavour to permanently and verifiably eliminate chemical weapons. Website of OPCW is{' '}
                      <a href="https://www.opcw.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.opcw.org/
                      </a>
                    </p>

                    {/* Section 5: ILO */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6">
                      International labour Organization (ILO),
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India has been selected as the External Auditor of the ILO for the 79th and 80th financial periods. The appointment commenced on 1 April 2024 for a term of four years (2024-2027).
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      The ILO is a United Nations agency whose mandate is to advance social and economic justice by setting international labour standards. Founded in October 1919 under the League of Nations, it is one of the first and oldest specialized agencies of the UN. Website of ILO is{' '}
                      <a href="https://www.ilo.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.ilo.org/
                      </a>
                    </p>
                  </>
                )
              ) : isUnPanel ? (
                /* UN PANEL OF EXTERNAL AUDITORS PAGE CONTENT */
                isHindi ? (
                  <>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      भारत के CAG- बाह्य लेखा परीक्षकों के संयुक्त राष्ट्र पैनल के अध्यक्ष (2020 और 2021)
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के सीएजी वर्ष 2020 से बाह्य लेखा परीक्षकों के संयुक्त राष्ट्र पैनल के अध्यक्ष हैं। अतीत में भी, सीएजी दिसंबर 2011 से दिसंबर 2013 तक पैनल अध्यक्ष थे और 2019 में उपाध्यक्ष थे।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      संयुक्त राष्ट्र महासभा ने 1959 में संयुक्त राष्ट्र, विशिष्ट एजेंसियों और अंतर्राष्ट्रीय परमाणु ऊर्जा एजेंसी के बाह्य लेखा परीक्षकों के पैनल की स्थापना की, जिसमें संयुक्त राष्ट्र प्रणाली के व्यक्तिगत बाह्य लेखा परीक्षक शामिल हैं, जो सर्वोच्च लेखा परीक्षा संस्थानों के प्रमुख भी हैं। पैनल के सदस्य एक चल रही प्रक्रिया के आधार पर अनुभवों और पद्धतियों को साझा करते हैं ताकि पूरे संयुक्त राष्ट्र प्रणाली में बाह्य लेखा परीक्षा प्रथाओं की यथासंभव एकरूपता सुनिश्चित की जा सके।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      पैनल के सदस्य सदस्य राज्यों और अन्य हितधारकों को संगठनों के संसाधनों के उचित उपयोग के साथ-साथ उनके आर्थिक, कुशल और प्रभावी उपयोग के संबंध में स्वतंत्र आश्वासन प्रदान करते हैं। वे संगठनों को उनके संचालन और उनकी आंतरिक नियंत्रण गतिविधियों में सुधार करने में सहायता करने में भी महत्वपूर्ण भूमिका निभाते हैं। पैनल के सदस्यों के निष्कर्षों और सिफारिशों को गंभीरता से लिया जाता है, और समय पर और प्रभावी कार्यान्वयन सुनिश्चित करने के लिए सिफारिशों की स्थिति की बारीकी से निगरानी की जाती है। इस प्रकार, पैनल के सदस्य संयुक्त राष्ट्र के चार्टर की पूर्ति में महत्वपूर्ण योगदान देते हैं।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      बाह्य लेखा परीक्षकों के संयुक्त राष्ट्र पैनल की वेबसाइट है:{' '}
                      <a href="https://www.un.org/en/auditors/panel/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.un.org/en/auditors/panel/
                      </a>
                    </p>
                  </>
                ) : (
                  <>
                    {/* Opening Subheading */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      CAG of India-Chair of the UN Panel of External Auditors (2020 &amp; 2021)
                    </h2>

                    {/* Paragraph 1 */}
                    <p className="text-[#2A2A2A] font-normal">
                      CAG of India is the Chair of the UN Panel of External Auditors since the year 2020. In the past also, CAG has been Panel Chair from December 2011 to December 2013 and was the Vice- Chair in 2019.
                    </p>

                    {/* Paragraph 2 */}
                    <p className="text-[#2A2A2A] font-normal">
                      The United Nations General Assembly in 1959 established the Panel of External Auditors of the United Nations, the Specialized Agencies and the International Atomic Energy Agency, comprising the individual external auditors of the United Nations system, who are also Heads of Supreme Audit Institutions. Panel Members share experiences and methodologies on an on-going basis so as to ensure as far as possible uniformity of external audit practices throughout the United Nations system.
                    </p>

                    {/* Paragraph 3 */}
                    <p className="text-[#2A2A2A] font-normal">
                      Panel Members provide independent assurance to Member States and other stakeholders in relation to the proper use of the Organizations’ resources as well as their economic, efficient and effective use. They also play a significant role in assisting the Organizations to improve their operations and their internal control activities. The findings and recommendations of Panel Members are taken seriously, and the status of recommendations is closely monitored to ensure timely and effective implementation. In this way, Panel Members contribute significantly to the fulfilment of the Charter of the United Nations.
                    </p>

                    {/* Paragraph 4: Website Link */}
                    <p className="text-[#2A2A2A] font-normal">
                      Website of UN Panel of External Auditors is:{' '}
                      <a href="https://www.un.org/en/auditors/panel/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.un.org/en/auditors/panel/
                      </a>
                    </p>
                  </>
                )
              ) : isMultilateral ? (
                /* MULTILATERAL ENGAGEMENT PAGE CONTENT */
                isHindi ? (
                  <>
                    <p className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      बहुपक्षीय मंचों के साथ सहभागिता
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      1) BRICS
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      ब्रिक्स सर्वोच्च लेखा परीक्षा संस्थान (SAI) मंच ब्रिक्स सदस्य देशों - ब्राजील, रूस, भारत, चीन और दक्षिण अफ्रीका - के साथ-साथ नए सदस्यों मिस्र, इथियोपिया, ईरान, संयुक्त अरब अमीरात और सऊदी अरब के लेखा परीक्षा संस्थानों का एक सहयोगात्मक मंच है। इसका उद्देश्य ज्ञान साझा करने की सुविधा प्रदान करके, आधुनिक लेखा परीक्षा पद्धतियों को विकसित करके और संस्थागत क्षमता का निर्माण करके पारदर्शिता, जवाबदेही और सुशासन को बढ़ावा देना है।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      2026 में भारत द्वारा ब्रिक्स की अध्यक्षता संभालने के बाद, भारत के नियंत्रक और महालेखापरीक्षक ने मई 2026 के दौरान बेंगलुरु भारत में 5वें ब्रिक्स SAI लीडर्स समिट 2026 की अध्यक्षता और मेजबानी की। शिखर सम्मेलन का विषय &quot;शहरी गतिशीलता पर ध्यान केंद्रित करने के साथ जीवन की सुगमता&quot; था।
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      2) शंघाई सहयोग संगठन (SCO)
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक शंघाई सहयोग संगठन (SCO) के सदस्य हैं। SCO भौगोलिक दायरे और जनसंख्या की दृष्टि से विश्व का सबसे बड़ा क्षेत्रीय संगठन है। SCO के सदस्य देश चीन, कजाकिस्तान, किर्गिस्तान, रूस, ताजिकिस्तान, उज्बेकिस्तान, भारत और पाकिस्तान हैं।
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      3) SAI20 एंगेजमेंट ग्रुप
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      SAI20 एंगेजमेंट ग्रुप G20 और संयुक्त राष्ट्र सतत विकास लक्ष्यों के अनुरूप पारदर्शिता, जवाबदेही और शासन को बढ़ाने के लिए एक रणनीतिक मंच के रूप में कार्य करते हुए G20 सदस्य देशों के भाग लेने वाले SAI को एक साथ लाता है।
                    </p>
                  </>
                ) : (
                  <>
                    {/* Opening Statement */}
                    <p className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      Engagement with Multilateral Forums
                    </p>

                    {/* Section 1: BRICS */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      1) BRICS
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The BRICS Supreme Audit Institutions (SAIs) forum is a collaborative platform comprising the audit institutions of BRICS member countries – Brazil, Russia, India, China, and South Africa – along with new members Egypt, Ethiopia, Iran, and United Arab Emirates, and Saudi Arabia. It aims to promote transparency, accountability, and good governance by facilitating knowledge sharing, developing modern auditing methodologies, and building institutional capacity. BRICS SAIs periodically meet to exchange knowledge, share best practices, and strengthen cooperation in public sector auditing. These engagements focus on key themes including audit innovation, sustainable development, capacity building, and technological integration. They often culminate in joint declarations or action plans to enhance audit methodologies and address governance challenges shared by the member states. Comptroller and Auditor General of India previously hosted 3rd BRICS SAI Leaders’ Summit in New Delhi in October 2022. The 4th BRICS SAI Leaders&apos; Summit had been hosted by SAI Russia in July 2024.
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      Consequent to India assuming the Chairmanship of BRICS in 2026, the Comptroller and Auditor General of India chaired and hosted the 5th BRICS SAI Leaders’ Summit 2026 in Bengaluru India during May 2026. The theme of the Summit was “Ease of Living with a focus on Urban Mobility”, with the sub-themes (i) Ease of Living: Audit of the Urban Sector and (ii) Ease of Living: Audit of Urban Mobility. A total of 41 delegates from nine BRICS SAI member countries (including SAI India) participated in the Summit. SAI India is scheduled to organise a webinar on “Water and Sanitation” in 2027.
                    </p>

                    {/* Section 2: Shanghai Cooperation Organization (SCO) */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      2) Shanghai Cooperation Organization(SCO)
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India is the member of the Shanghai Cooperation Organization (SCO). The SCO is a world&apos;s largest regional organization in geographic scope and population. The member countries of SCO are China, Kazakhstan, Kyrgyzstan, Russia, Tajikistan, Uzbekistan, India and Pakistan. The previous i.e. 7th meeting of the Heads of SAIs of SCO member states took place in Dushanbe under the Chairmanship of SAI Tajikistan. Representatives of SAI India participated in this meeting. As per the SCO Action Plan 2025-27 finalized during the 7th SCO SAIs meeting, SAI India had organized a webinar on “Audit of solid municipal waste management” at International Centre for Environment Audit and Sustainable Development (iCED) Jaipur in August 2025, wherein representatives of SCO SAIs members participated.
                    </p>

                    {/* Section 3: The SAI20 Engagement Group */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      3) The SAI20 Engagemnet Group
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      The SAI20 engagement group brings together the participating SAIs of G20 member countries, serving as a strategic platform to enhance transparency, accountability, and governance in line with G20 and UN Sustainable Development Goals. Key participants include SAIs from India, Brazil, South Africa, Indonesia, Korea, Russia, Saudi Arabia, Türkiye, Australia, and others. SAI India had hosted the Senior Officials Meeting and Summit of SAI20 engagement group during India’s G20 presidency in 2023-focusing on priority themes like the Blue Economy and Responsible AI. The 2025 SAI20 Summit-has been hosted by SAI South Africa in June 2025, which was advancing discussions on infrastructure financing and workforce skills under the overarching G20 theme of solidarity, equality, and sustainability. Representatives of SAI India had actively participated in the SAI20 Summit in South Africa.
                    </p>
                  </>
                )
              ) : isAsosai ? (
                /* ASOSAI PAGE CONTENT */
                isHindi ? (
                  <>
                    <p className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      भारत के नियंत्रक और महालेखापरीक्षक एशियाई सर्वोच्च लेखा परीक्षा संस्थानों के संगठन (ASOSAI) के शासी बोर्ड के सदस्य हैं।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      एशियाई सर्वोच्च लेखा परीक्षा संस्थानों का संगठन (ASOSAI) (
                      <a href="http://www.asosai.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.asosai.org/
                      </a>
                      ) 1978 में स्थापित, INTOSAI के सात क्षेत्रीय कार्य समूहों में से एक है। भारत ASOSAI का संस्थापक सदस्य है। भारत के सीएजी ने 2012-2015 तक ASOSAI के अध्यक्ष के रूप में कार्य किया।
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      CAG को 2024-2027 के लिए ASOSAI के अध्यक्ष के रूप में चुना गया है
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      56वें शासी बोर्ड ने भारत के तत्कालीन नियंत्रक और महालेखापरीक्षक को 2024 में ASOSAI की 16वीं असेंबली के मेजबान और 2024-2027 तक ASOSAI के अध्यक्ष के रूप में चुना।
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      CAG के भाषण यहाँ उपलब्ध हैं:-
                    </h2>
                    <ul className="list-none pl-4 space-y-[8px] my-3 text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          9th ASOSAI Symposium Opening Address by CAG of India
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Closing Address for 9th Symposium
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Welcome Speech 60th Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          61st GB Meeting Opening Address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          61st GB Meeting Closing Address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Acceptance speech by SAI India 16th ASOSAI Assembly First Plenary
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Welcome Address by CAG of India at the Opening Ceremony of 16th ASOSAI Assembly
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Second Plenary opening address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Second Plenary closing address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          15th ASOSAI Assembly- Speech on ASOSAI Journal and Journal Award
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          15th ASOSAI Assembly
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          57th Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          56th Governing Board Meeting
                        </a>
                      </li>
                    </ul>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      बैठक की छवियां यहां उपलब्ध हैं
                    </h2>
                    <ul className="list-none pl-4 space-y-[8px] my-3 text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          16th ASOSAI Assembly and 60th & 61st Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          56th Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          15th ASOSAI Assembly and 57th Governing Board Meeting (Virtual 6-8 September, 2021)
                        </a>
                      </li>
                    </ul>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      ASOSAI जर्नल
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      ASOSAI जर्नल यानी एशियन जर्नल ऑफ गवर्नमेंट ऑडिट के संपादकीय बोर्ड के अध्यक्ष के रूप में, SAI भारत अंग्रेजी भाषा में वर्ष में दो बार ASOSAI जर्नल प्रकाशित करता है। जर्नल को यहाँ देखा जा सकता है:{' '}
                      <a href="http://www.asosaijournal.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.asosaijournal.org/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      ASOSAI जर्नल वेबसाइट का नया रूप जनता की पहुंच के लिए खुला है जिसमें मोबाइल और टैबलेट अनुकूलता, बेहतर पठनीयता के लिए लेखों की पेशेवर पीडीएफ डिजाइनिंग जैसी आधुनिक सुविधाएं शामिल हैं।
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      ASOSAI अनुसंधान परियोजना (ARP)
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      भारत के नियंत्रक और महालेखापरीक्षक ने ASOSAI द्वारा अब तक शुरू की गई सभी तेरह अनुसंधान परियोजनाओं में महत्वपूर्ण भूमिका निभाई है। &quot;सार्वजनिक लेखा परीक्षा में दक्षता और प्रभावशीलता बढ़ाने के लिए कृत्रिम बुद्धिमत्ता का लाभ उठाना&quot; पर 14वीं ASOSAI अनुसंधान परियोजना प्रगति पर है और SAI भारत इसमें सक्रिय रूप से भाग ले रहा है।
                    </p>
                  </>
                ) : (
                  <>
                    {/* Opening Statement */}
                    <p className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      The Comptroller and Auditor General of India is the Governing Board member of Asian Organization of Supreme Audit Institutions (ASOSAI).
                    </p>

                    {/* Overview Paragraph with Hyperlink */}
                    <p className="text-[#2A2A2A] font-normal">
                      The Asian Organization of Supreme Audit Institutions (ASOSAI) (
                      <a href="http://www.asosai.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.asosai.org/
                      </a>
                      ) established in 1978, is one of the seven regional working groups of INTOSAI. India is a charter member of ASOSAI. The CAG of India served as the Chair of ASOSAI from 2012-2015. The CAG of India has been granted ex-officio membership on the Governing Board of ASOSAI by virtue of being the Chair, Board of Editors of the ASOSAI Journal.
                    </p>

                    {/* Subheading 1 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      CAG has been elected as the Chair of ASOSAI from 2024-2027
                    </h2>

                    <p className="text-[#2A2A2A] font-normal">
                      The 56th Governing Board elected Shri Girish Chandra Murmu, the then Comptroller and Auditor General of India (C&AG), as the host of the 16th Assembly of Asian Organization of Supreme Audit Institutions (ASOSAI) in 2024 and the Chair of ASOSAI from 2024-2027. The 15th Assembly of ASOSAI approved the election on 7 September 2021. C&AG, as the Chairman, is the Chief Executive of ASOSAI and represent ASOSAI in its dealings with national and international organizations.
                    </p>

                    {/* Subheading 2 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      Speeches of CAG are available here:-
                    </h2>

                    {/* Bullet List 1: Speeches as BLACK underlined hyperlinks */}
                    <ul className="list-none pl-4 space-y-[8px] my-3 text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          9th ASOSAI Symposium Opening Address by CAG of India
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Closing Address for 9th Symposium
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Welcome Speech 60th Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          61st GB Meeting Opening Address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          61st GB Meeting Closing Address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Acceptance speech by SAI India 16th ASOSAI Assembly First Plenary
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Welcome Address by CAG of India at the Opening Ceremony of 16th ASOSAI Assembly
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Second Plenary opening address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          Second Plenary closing address
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          15th ASOSAI Assembly- Speech on ASOSAI Journal and Journal Award
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          15th ASOSAI Assembly
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          57th Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          56th Governing Board Meeting
                        </a>
                      </li>
                    </ul>

                    {/* Subheading 3 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      Images of the meeting are available here
                    </h2>

                    {/* Bullet List 2: Meeting Images as BLACK underlined hyperlinks */}
                    <ul className="list-none pl-4 space-y-[8px] my-3 text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          16th ASOSAI Assembly and 60th & 61st Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          56th Governing Board Meeting
                        </a>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <a href="#" style={blackLinkStyle} className="hover:text-[#751639] transition-colors">
                          15th ASOSAI Assembly and 57th Governing Board Meeting which was held virtually from 6-8 September, 2021
                        </a>
                      </li>
                    </ul>

                    {/* Subheading 4 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      ASOSAI Journal
                    </h2>

                    <p className="text-[#2A2A2A] font-normal">
                      As the Chair of the Editorial Board of ASOSAI Journal i.e. Asian Journal of Government Audit, SAI India publishes the ASOSAI Journal twice a year in English language. The journal can be viewed at{' '}
                      <a href="http://www.asosaijournal.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.asosaijournal.org/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      The new revamped version of the ASOSAI Journal website is open for public access which includes model features like mobile and tablet friendliness, professional PDF designing of articles for better readability, social media presence (X handle- @AsosaiJournal).
                    </p>

                    {/* Subheading 5 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      ASOSAI Research Project (ARP)
                    </h2>

                    <p className="text-[#2A2A2A] font-normal">
                      The Comptroller and Auditor General of India has played a vital role in all the thirteen research projects undertaken so far by ASOSAI. The 14th ASOSAI Research Project on “Leveraging Artificial Intelligence to Enhance Efficiency and Effectiveness in Public Auditing” is under progress and SAI India is actively participating in it. The report of the 14th ASOSAI Research Project would be adopted during the 17th ASOSAI Assembly scheduled in Saudi Arabia in 2027.
                    </p>
                  </>
                )
              ) : (
                /* INTOSAI PAGE CONTENT */
                isHindi ? (
                  <>
                    <p className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      भारत के नियंत्रक और महालेखापरीक्षक सर्वोच्च लेखा परीक्षा संस्थानों के अंतर्राष्ट्रीय संगठन (INTOSAI) के शासी बोर्ड के सदस्य हैं।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      सुप्रीम ऑडिट संस्थानों का अंतर्राष्ट्रीय संगठन (INTOSAI) बाहरी सरकारी लेखा परीक्षा समुदाय के लिए एक छत्र संगठन के रूप में काम करता है। INTOSAI एक स्वायत्त, स्वतंत्र और गैर-राजनीतिक संगठन है। यह संयुक्त राष्ट्र के आर्थिक और सामाजिक परिषद (ECOSOC) के साथ विशेष सलाहकार स्थिति वाला एक गैर-सरकारी संगठन है। INTOSAI शासी बोर्ड INTOSAI गतिविधियों की रणनीतिक नेतृत्व, प्रबंधन और निरंतरता प्रदान करने के लिए प्रतिवर्ष बैठक करता है।
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      INTOSAI के चार मुख्य समितियां हैं जो इसके चार रणनीतिक लक्ष्यों की प्राप्ति के वाहन हैं:
                    </p>
                    <ul className="list-none pl-4 space-y-[8px] my-3 text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Professional Standards Committee (PSC) (Goal 1) (
                          <a href="https://www.psc-intosai.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            https://www.psc-intosai.org/
                          </a>)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Capacity Building Committee (CBC) (Goal 2) (
                          <a href="https://www.intosaicbc.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            https://www.intosaicbc.org/
                          </a>)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Knowledge Sharing and Knowledge Services Committee (KSC) (Goal 3) (
                          <a href="https://www.intosaicommunity.net" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            https://www.intosaicommunity.net
                          </a>)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Policy, Finance and Administrative Committee (PFAC) (Goal 4) (
                          <a href="http://www.intosaipfac.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            http://www.intosaipfac.org/
                          </a>)
                        </span>
                      </li>
                    </ul>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      भारत के नियंत्रक और महालेखापरीक्षक ज्ञान साझाकरण और ज्ञान सेवा समिति (KSC) और इसकी संचालन समिति (KSC SC) के अध्यक्ष हैं।
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      KSC का उद्देश्य ज्ञान विकास, ज्ञान साझाकरण और ज्ञान सेवाओं के माध्यम से SAI सहयोग और निरंतर सुधार को बढ़ावा देना है। KSC के तहत 12 कार्य समूह हैं:
                    </p>
                    <ul className="list-none pl-4 space-y-[8px] my-3 italic text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Public Debt (WGPD) (Chair: SAI Philippines)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Information Technology Audit (WGITA) (Chair: SAI India)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Environmental Auditing (WGEA) (Chair: SAI Thailand)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Evaluation of Public Policies and Programmes (WGEPPP) (Chair: SAI Switzerland)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on the Fight Against Corruption and Money Laundering (WGFACML) (Chair: SAI Egypt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on SDGs and Key Sustainable Development Indicators (WGSDG KSDI) (Chair: SAI Russia)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Financial and Economic Stability (WGFES) (Chair: SAI USA)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Audit of Extractive Industries (WGEI) (Chair: SAI Uganda)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Public Procurement Audit (WGPPA) (Chair: SAI Russia)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Big Data (WGBD) (Chair: SAI China)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Impact of Science and Technology on Auditing (WGISTA) (Chair: SAI Egypt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Follow-Up Audit (WGFA) (Chair: SAI Malaysia)</span>
                      </li>
                    </ul>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      भारत के नियंत्रक और महालेखापरीक्षक IT लेखा परीक्षा पर INTOSAI कार्य समूह (WGITA) के अध्यक्ष हैं।
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      IT ऑडिट पर वर्किंग ग्रुप (WGITA) का गठन 1989 में IT ऑडिट के क्षेत्र में SAI के हितों को संबोधित करने के लिए किया गया था।
                    </p>
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      भारत के नियंत्रक और महालेखापरीक्षक INTOSAI अनुपालन लेखा परीक्षा उपसमिति (CAS) के भी अध्यक्ष हैं।
                    </h2>
                    <p className="text-[#2A2A2A] font-normal">
                      2017 से, भारत के नियंत्रक और महालेखापरीक्षक अनुपालन लेखा परीक्षा उपसमिति (CAS) के अध्यक्ष हैं।
                    </p>
                  </>
                ) : (
                  <>
                    {/* Opening Statement */}
                    <p className="font-medium text-[#751639] text-[14px] leading-[24px]">
                      The Comptroller and Auditor General of India is a member of the Governing Board of the International Organization of Supreme Audit Institutions (INTOSAI).
                    </p>

                    {/* Overview Paragraph */}
                    <p className="text-[#2A2A2A] font-normal">
                      The International Organization of Supreme Audit Institutions (INTOSAI) operates as an umbrella organization for the external government audit community. INTOSAI is an autonomous, independent and non-political organization. It is a non-governmental organization with special consultative status with the Economic and Social Council (ECOSOC) of the United Nations. The INTOSAI Governing Board meets annually to provide strategic leadership, stewardship, and continuity of INTOSAI activities between International Congresses of Supreme Audit Institutions (INCOSAI). The INTOSAI Congress (INCOSAI) is the supreme organ of INTOSAI and is composed of all the members. On a triennial basis, it holds regular meetings, which is chaired by the hosting SAI. Participants include delegations of member SAIs as well as representatives of the United Nations, the World Bank and other international and professional organizations. INTOSAI has four main Committees which are the vehicles for the achievement of its four strategic goals. These Committees are:
                    </p>

                    {/* Bullet List 1 */}
                    <ul className="list-none pl-4 space-y-[8px] my-3 text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Professional Standards Committee (PSC) (Goal 1) (
                          <a href="https://www.psc-intosai.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            https://www.psc-intosai.org/
                          </a>)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Capacity Building Committee (CBC) (Goal 2) (
                          <a href="https://www.intosaicbc.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            https://www.intosaicbc.org/
                          </a>)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Knowledge Sharing and Knowledge Services Committee (KSC) (Goal 3) (
                          <a href="https://www.intosaicommunity.net" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            https://www.intosaicommunity.net
                          </a>)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] select-none">•</span>
                        <span>
                          Policy, Finance and Administrative Committee (PFAC) (Goal 4) (
                          <a href="http://www.intosaipfac.org/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                            http://www.intosaipfac.org/
                          </a>)
                        </span>
                      </li>
                    </ul>

                    <p className="text-[#2A2A2A] font-normal">
                      SAI India is an active player in the standard setting, capacity building and knowledge sharing activities of INTOSAI through our position of leadership in the KSC, INTOSAI Working Group on IT Audit (WGITA) and INTOSAI Compliance Audit Subcommittee (CAS) as well as our participation in the activities of the other organs including the INTOSAI Development Initiative and the INTOSAI Governing Board.
                    </p>

                    {/* Subheading 2 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      The Comptroller and Auditor General of India is the Chair of INTOSAI Committee on Knowledge Sharing and Knowledge Services – (KSC) and its Steering Committee (KSC SC).
                    </h2>

                    <p className="text-[#2A2A2A] font-normal">
                      The objective of KSC is to encourage SAI cooperation, collaboration, and continuous improvement through knowledge development, knowledge sharing and knowledge services, including (i) producing and revising INTOSAI products (ii) providing benchmarks and operating a community portal and (iii) conducting best practice studies and performing research on issues of mutual concern. The Comptroller and Auditor General of India is the Chair of KSC since its inception. The KSC main committee today has 125 members and four observers. There are 12 Working Groups under KSC, and the websites of the Knowledge Sharing and Knowledge Services Committee (INTOSAI Community Portal & KSC Working Groups) can be accessed at{' '}
                      <a href="https://www.intosaicommunity.net/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://www.intosaicommunity.net/
                      </a>
                      . The details of the Working Groups is as follows:
                    </p>

                    {/* Bullet List 2 */}
                    <ul className="list-none pl-4 space-y-[8px] my-3 italic text-[#2A2A2A] font-normal">
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Public Debt (WGPD) (Chair: SAI Philippines)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Information Technology Audit (WGITA) (Chair: SAI India)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Environmental Auditing (WGEA) (Chair: SAI Thailand)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Evaluation of Public Policies and Programmes (WGEPPP) (Chair: SAI Switzerland)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on the Fight Against Corruption and Money Laundering (WGFACML) (Chair: SAI Egypt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on SDGs and Key Sustainable Development Indicators (WGSDG KSDI) (Chair: SAI Russia)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Financial and Economic Stability (WGFES) (Chair: SAI USA)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Audit of Extractive Industries (WGEI) (Chair: SAI Uganda)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Public Procurement Audit (WGPPA) (Chair: SAI Russia)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Big Data (WGBD) (Chair: SAI China)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Impact of Science and Technology on Auditing (WGISTA) (Chair: SAI Egypt)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#751639] font-bold text-[14px] leading-[24px] not-italic select-none">•</span>
                        <span>Working Group on Follow-Up Audit (WGFA) (Chair: SAI Malaysia)</span>
                      </li>
                    </ul>

                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      The Comptroller and Auditor General of India is the Chair of the INTOSAI Working Group on IT Audit (WGITA).
                    </h2>

                    <p className="text-[#2A2A2A] font-normal">
                      The Working Group on IT Audit (WGITA) was created in 1989 to address interests of SAIs in the area of IT Audit. WGITA aims to support SAIs in developing their knowledge and skills in the use and audit of information technology by providing information and facilities for exchange of experiences, and encouraging bilateral and regional cooperation. The Comptroller and Auditor General of India is the Chair of WGITA since its inception. Presently, WGITA has 58 members and 7 observers. Details are available at the WGITA website:{' '}
                      <a href="https://wgita.intosaicommunity.net/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        https://wgita.intosaicommunity.net/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      The 34th annual meeting of WGITA was held in Hyderabad, India on 10 September 2025. The Comptroller and Auditor General of India, as the Chair of WGITA, inaugurated the meeting.
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      According to the practice of hosting a seminar/webinar in conjunction with the WGITA meetings, this year, the WGITA meeting was followed by WGITA Summit on the topic ‘AI and Emerging Technologies for Supreme Audit Institutions – A Dialogue on Leveraging Technology and Enhancing Sustainable Audit Practices’ on 11 September 2025 in Hyderabad, India.
                    </p>

                    {/* Subheading 4 */}
                    <h2 className="font-medium text-[#751639] text-[14px] leading-[24px] mt-6 mb-2">
                      The Comptroller and Auditor General of India is also the Chair of the INTOSAI Compliance Audit Subcommittee (CAS).
                    </h2>

                    <p className="text-[#2A2A2A] font-normal">
                      Since 2017, the Comptroller and Auditor General of India is the Chair of the Compliance Audit Subcommittee (CAS), which was established as one of the four standard setting committees under the INTOSAI’s Professional Standards Committee (PSC). The other sub-committees under PSC are the Financial Auditing and Accounting Sub-committee (FAAS), The Performance Audit Sub-committee (PAS), and the Internal Control Sub-committee (ICS). The mandate for the CAS is to elaborate on and clarify the term &quot;compliance audit&quot;, provide an overview of the different mandates SAIs have regarding compliance audits, give practical guidance on how compliance audit should be planned, executed and reported on, and to develop INTOSAI guidelines for compliance audit. CAS has 22 members and 2 observers. Details are available at the following link:{' '}
                      <a href="http://www.psc-intosai.org/committee/compliance-audit-subcommittee/" target="_blank" rel="noopener noreferrer" style={linkStyle} className="hover:opacity-80 transition-opacity">
                        http://www.psc-intosai.org/committee/compliance-audit-subcommittee/
                      </a>
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      The 22nd Annual meeting of INTOSAI CAS was held online on 26th November 2025. The Comptroller and Auditor General of India, as the Chair of CAS, inaugurated the meeting through video message.
                    </p>
                    <p className="text-[#2A2A2A] font-normal">
                      SAI India is also a member of other INTOSAI Goal committees, two other INTOSAI Subcommittees under PSC, two INTOSAI Task Forces and INTOSAI Donor Cooperation Steering Committee.
                    </p>
                  </>
                )
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
