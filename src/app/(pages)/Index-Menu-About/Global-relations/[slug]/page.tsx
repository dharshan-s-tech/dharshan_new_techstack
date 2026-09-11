'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import DualFlagStand from '@/components/DualFlagStand';

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

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  // Sidebar menu definition
  const groups: SidebarGroup[] = [
    {
      heading: 'International Bodies',
      hindiHeading: 'अंतर्राष्ट्रीय निकाय',
      links: [
        { name: 'Association with INTOSAI', hindiName: 'INTOSAI के साथ जुड़ाव', slug: 'association with intosai' },
        { name: 'Association with ASOSAI', hindiName: 'ASOSAI के साथ जुड़ाव', slug: 'association with asosai' },
        { name: 'Multilateral Engagement', hindiName: 'बहुपक्षीय सहभागिता', slug: 'multilateral engagement' }
      ]
    }
  ];

  // Dynamic page title computation
  const isIntosai = slugDecoded === 'association with intosai';
  const isAsosai = slugDecoded === 'association with asosai';
  const isMultilateral = slugDecoded === 'multilateral engagement';
  const isBilateral = slugDecoded === 'bilateral relations';
  const isPresentAudits = slugDecoded === 'present audits' || slugDecoded === 'present international audits' || slugDecoded.includes('present');
  const isPastAudits = slugDecoded === 'past audits' || slugDecoded === 'past international audits' || slugDecoded.includes('past');
  const isUnPanel = slugDecoded === 'un panel' || slugDecoded === 'un panel of external auditors' || slugDecoded.includes('panel');

  let pageTitle = rawSlug;
  let heroTitle = rawSlug;

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
    if (c === 'bhutan') return '/assets/Images/flags/bhutan.svg';
    if (c === 'brazil') return '/assets/Images/flags/brazil.svg';
    if (c === 'cambodia') return '/assets/Images/flags/cambodia.svg';
    if (c === 'chile') return '/assets/Images/flags/Chile.svg';
    if (c === 'china') return '/assets/Images/flags/China.svg';
    if (c === 'indonesia') return '/assets/Images/flags/Indonesia.svg';
    if (c === 'israel') return '/assets/Images/flags/Israel.svg';
    if (c === 'kazakhstan') return '/assets/Images/flags/Kazakhstan.svg';
    if (c === 'korea') return '/assets/Images/flags/Korea.svg';
    if (c === 'kuwait') return '/assets/Images/flags/Kuwait.svg';
    if (c === 'maldives') return '/assets/Images/flags/Maldives.svg';
    if (c === 'iran') return '/assets/Images/flags/Iran.svg';
    if (c === 'russia') return '/assets/Images/flags/Russia.svg';
    if (c === 'bahrain') return '/assets/Images/flags/Bahrain.svg';
    return `/assets/Images/flags/${countryName}.svg`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[64px] pt-2 pb-[96px] font-['Noto_Sans'] tracking-normal">
      {/* Dynamic Breadcrumbs */}
      <nav className="breadcrumbs mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-[12px] leading-[16px] font-['Noto_Sans'] tracking-normal">
          <li>
            <Link href="/" className="text-[#565656] hover:text-[#751639] transition-colors">
              {isHindi ? 'गृह' : 'Home'}
            </Link>
          </li>
          <li className="text-[#565656] flex items-center">
            <svg className="w-2.5 h-2.5 text-[#565656] transform -rotate-90" viewBox="0 0 10 6" fill="none" stroke="currentColor">
              <path d="M1 1L5 5L9 1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </li>
          <li>
            <Link href="/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI" className="text-[#565656] hover:text-[#751639] transition-colors">
              {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
            </Link>
          </li>
          <li className="text-[#565656] flex items-center">
            <svg className="w-2.5 h-2.5 text-[#565656] transform -rotate-90" viewBox="0 0 10 6" fill="none" stroke="currentColor">
              <path d="M1 1L5 5L9 1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </li>
          <li className="font-bold text-[#2A2A2A]">
            {pageTitle}
          </li>
        </ol>
      </nav>

      {isBilateral ? (
        /* BILATERAL RELATIONS PAGE FULL WIDTH LAYOUT (1312px) */
        <main className="w-full">
          {/* Top Heading */}
          <h1 className="font-['Noto_Sans'] font-semibold text-[16px] leading-[22px] text-[#000000] mb-6">
            {isHindi 
              ? 'वर्तमान में SAI भारत के 29 सर्वोच्च लेखा परीक्षा संस्थानों के साथ समझौता ज्ञापन/जुड़वां व्यवस्थाएं हैं:' 
              : 'Presently SAI India has MoUs/twinning arrangements with 29 Supreme Audit Institutions viz.'}
          </h1>

          {/* 6-Column Flag Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-8">
            {countries.map((countryName, idx) => (
              <div 
                key={idx}
                className="w-full flex items-center justify-center transition-transform hover:-translate-y-1 hover:drop-shadow-md cursor-pointer"
              >
                <img 
                  src={getFlagSvgPath(countryName)} 
                  alt={`${countryName} Bilateral Relations`} 
                  className="w-full h-auto object-contain"
                />
              </div>
            ))}

            {/* Special Card: INTOSAI Development Initiative (IDI) */}
            <div className="bg-white border border-[#E6E6E6] rounded-[8px] p-4 flex flex-col items-center justify-center shadow-[4px_4px_4px_rgba(0,0,0,0.02)] min-h-[186px] h-full transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
              <p className="font-['Noto_Sans'] font-semibold text-[16px] leading-[22px] text-[#2A2A2A] text-center">
                INTOSAI<br />Development<br />Initiative (IDI)
              </p>
            </div>
          </div>

          {/* Bottom Closing Paragraph */}
          <p className="font-['Noto_Sans'] font-semibold text-[16px] leading-[24px] text-[#000000]">
            {isHindi 
              ? 'इन व्यवस्थाओं के तहत द्विपक्षीय सेमिनार, प्रशिक्षण कार्यक्रम, प्रतिनियुक्ति, क्षमता निर्माण कार्यशालाएं, विशिष्ट लेखापरीक्षाओं के लिए मार्गदर्शन आदि जैसे नियमित द्विपक्षीय आदान-प्रदान आयोजित किए जाते हैं।' 
              : 'Regular bilateral exchanges like bilateralseminars, training programmes, secondments, capacity building workshops, hand holding for specific audits etc. are held under these arrangements.'}
          </p>
        </main>
      ) : (
        /* OTHER PAGES WITH SIDEBAR (INTOSAI, ASOSAI, MULTILATERAL) */
        <div className="flex flex-col lg:flex-row gap-[24px] items-start">
          {/* Left Side Menu */}
          <aside className="w-full lg:w-[310px] shrink-0 bg-white border border-[#E6E6E6] rounded-[8px] p-[24px] shadow-[4px_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="font-semibold text-[20px] leading-[27px] text-[#000000] pb-3 border-b border-[#D7D7D7] mb-4">
              {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
            </h2>
            <div className="space-y-4">
              {groups.map((grp, idx) => (
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
            {/* Top Hero Banner (Frame 2147227447) */}
            <div className="relative w-full h-[141.33px] bg-white rounded-[8px] overflow-hidden mb-6 shadow-sm">
              {/* SVG ClipPath Definition for Burgundy Background */}
              <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                  <clipPath id="header-burgundy-clip" clipPathUnits="objectBoundingBox">
                    <path d="M 0 0 L 0.817 0 C 0.805 0.35, 0.780 0.70, 0.758 1 L 0 1 Z" />
                  </clipPath>
                </defs>
              </svg>

              {/* Background SVG exported from Figma (Clipped to expose white section on right) */}
              <img 
                src="/assets/Images/page-header-bg.svg" 
                alt="Header Background" 
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  clipPath: 'url(#header-burgundy-clip)',
                  WebkitClipPath: 'url(#header-burgundy-clip)'
                }}
              />

              {/* Left Title */}
              <div className="absolute left-[37px] top-1/2 -translate-y-1/2 z-10 max-w-[650px]">
                <h1 className="font-['Noto_Sans'] font-bold text-[24px] leading-[38px] text-white drop-shadow-sm">
                  {heroTitle}
                </h1>
              </div>

              {/* Right Logo Section (Centered in White Background Area) */}
              <div className="absolute right-0 top-0 bottom-0 w-[205px] z-10 flex items-center justify-center">
                <img 
                  src={
                    isIntosai 
                      ? "/assets/Images/INTOSAI-logo.svg"
                      : ((isPresentAudits || isPastAudits)
                          ? "/assets/Images/presentIA-logo.svg"
                          : (isUnPanel
                              ? "/assets/Images/unpanel-logo.svg"
                              : (isMultilateral 
                                  ? "/assets/Images/multilateral-logo.svg" 
                                  : (isAsosai ? "/assets/Images/ASOSAI-logo.svg" : "/assets/Images/INTOSAI-logo.svg"))))
                  } 
                  alt="Organization Logo" 
                  className={
                    isIntosai 
                      ? "w-[80px] h-[77px] object-contain"
                      : ((isPresentAudits || isPastAudits)
                          ? "w-[167px] h-[120px] object-contain"
                          : (isUnPanel
                              ? "w-[141px] h-[101px] object-contain"
                              : (isMultilateral 
                                  ? "w-[103px] h-[103px] object-contain" 
                                  : (isAsosai ? "w-[126px] h-[40px] object-contain" : "w-[80px] h-[77px] object-contain"))))
                  }
                />
              </div>
            </div>

            {/* Main Article Body Text */}
            <div className="text-[14px] leading-[24px] tracking-normal space-y-4 text-justify font-['Noto_Sans']">
              {isMultilateral ? (
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
