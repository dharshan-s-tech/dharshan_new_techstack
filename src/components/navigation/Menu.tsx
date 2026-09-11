'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Menu({ mobileMenuOpen, language }: { mobileMenuOpen: boolean; language?: 'English' | 'हिन्दी' }) {
  const pathname = usePathname() || '';
  const decodedPath = decodeURIComponent(pathname || '').toLowerCase();
  const [activeMega, setActiveMega] = useState<'about' | 'global' | 'presence' | 'resources' | 'careers' | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavEnter = (type: 'about' | 'global' | 'presence' | 'resources' | 'careers' | 'reports') => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (type === 'reports') {
      setHoveredItem('reports');
    } else {
      setHoveredItem(type);
      setActiveMega(type);
    }
  };

  const handleNavLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setHoveredItem(null);
      setActiveMega(null);
    }, 250);
  };

  const handleTopicClick = (e: React.MouseEvent, type: 'about' | 'global' | 'presence' | 'resources' | 'careers') => {
    e.stopPropagation();
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveMega(activeMega === type ? null : type);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeMega) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.primary-nav') &&
        !target.closest('.about-menu') &&
        !target.closest('.global-relations-menu')
      ) {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        setActiveMega(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        setActiveMega(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMega]);

  const isHindi = language === 'हिन्दी';
  const labelReports = isHindi ? 'रिपोर्ट' : 'Reports';
  const labelPresence = isHindi ? 'हमारी उपस्थिति' : 'Our Presence';
  const labelGlobal = isHindi ? 'वैश्विक संबंध' : 'Global Relations';
  const labelResources = isHindi ? 'संसाधन' : 'Resources';
  const labelCareers = isHindi ? 'करियर और जुड़ाव' : 'Careers & Engagement';
  const labelAbout = isHindi ? 'हमारे बारे में' : 'About Us';

  const isReportsActive = pathname === '/Reports' || hoveredItem === 'reports';
  const isPresenceActive = pathname.startsWith('/Our-Presence') || activeMega === 'presence' || hoveredItem === 'presence';
  const isGlobalActive = decodedPath.includes('global-relations') || decodedPath.includes('global relations') || activeMega === 'global' || hoveredItem === 'global';
  const isResourcesActive = pathname.startsWith('/Resources') || activeMega === 'resources' || hoveredItem === 'resources';
  const isCareersActive = pathname.startsWith('/Career-Engagement') || activeMega === 'careers' || hoveredItem === 'careers';
  const isAboutActive = (((pathname.startsWith('/About') || pathname.startsWith('/About-Us') || decodedPath.includes('about-us') || decodedPath.startsWith('/about')) && !isGlobalActive) || activeMega === 'about' || hoveredItem === 'about');

  const activeLinkClass = "text-[#751639] !text-[#751639] font-medium text-[14px] leading-[19px] tracking-normal underline decoration-[#751639] underline-offset-[5px] decoration-[1.5px] transition-colors";
  const inactiveLinkClass = "text-[#4d4d4d] font-normal text-[14px] leading-[19px] tracking-normal transition-colors";

  return (
    <nav className={`primary-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Primary" id="primary-nav">
      <div className="nav-item">
        <Link 
          href="/Reports" 
          className={isReportsActive ? activeLinkClass : inactiveLinkClass}
          style={{ color: isReportsActive ? '#751639' : '#4d4d4d', textDecoration: isReportsActive ? 'underline' : 'none' }}
          onMouseEnter={() => handleNavEnter('reports')}
          onMouseLeave={handleNavLeave}
          onClick={() => {
            if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
            setActiveMega(null);
          }}
        >
          {labelReports}
        </Link>
      </div>
      
      {/* Our Presence dropdown */}
      <div 
        className="nav-item relative cursor-pointer flex items-center gap-1" 
        onMouseEnter={() => handleNavEnter('presence')}
        onMouseLeave={handleNavLeave}
      >
        <Link 
          href="/Our-Presence/Index-Menu/State-Level-Offices?filter=audit" 
          className={isPresenceActive ? activeLinkClass : inactiveLinkClass}
          style={{ color: isPresenceActive ? '#751639' : '#4d4d4d', textDecoration: isPresenceActive ? 'underline' : 'none' }}
          onClick={(e) => handleTopicClick(e, 'presence')}
        >
          {labelPresence}
        </Link>
        <img 
          src="/assets/32d6d59de0cd297086b7b32eb17e03e23b4ac03d.svg" 
          alt="" 
          className={`chevron ${isPresenceActive ? 'rotate-180' : ''}`} 
        />
        {activeMega === 'presence' && (
          <div 
            className="absolute top-[80%] left-0 pt-3 w-56 z-[1050]"
            onMouseEnter={() => handleNavEnter('presence')}
            onMouseLeave={handleNavLeave}
          >
            <div className="bg-white border border-[#d7d7d7] py-2 shadow-lg rounded-b-lg">
              <Link href="/Our-Presence/Index-Menu/State-Level-Offices?filter=audit" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'राज्य लेखा परीक्षा कार्यालय' : 'State Audit Offices'}
              </Link>
              <Link href="/Our-Presence/Index-Menu/State-Level-Offices?filter=ae" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'राज्य लेखा एवं हकदारी कार्यालय' : 'State Account & Entitlement'}
              </Link>
              <Link href="/Our-Presence/Index-Menu/Central-Audit-Offices" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'केंद्रीय लेखा परीक्षा कार्यालय' : 'Central Audit Offices'}
              </Link>
              <Link href="/Our-Presence/Index-Menu/Traning-Institutes" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'प्रशिक्षण संस्थान' : 'Training Institutes'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Global Relations mega-menu trigger */}
      <div 
        className="nav-item cursor-pointer flex items-center gap-1"
        onMouseEnter={() => handleNavEnter('global')}
        onMouseLeave={handleNavLeave}
      >
        <Link 
          href="/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI" 
          id="global-relations-trigger"
          className={isGlobalActive ? activeLinkClass : inactiveLinkClass}
          style={isGlobalActive ? { color: '#751639', textDecoration: 'underline', textUnderlineOffset: '5px', textDecorationColor: '#751639' } : {}}
          onClick={(e) => handleTopicClick(e, 'global')}
          aria-expanded={activeMega === 'global'}
        >
          {labelGlobal}
        </Link>
        <img 
          src="/assets/32d6d59de0cd297086b7b32eb17e03e23b4ac03d.svg" 
          alt="" 
          className={`chevron ${isGlobalActive ? 'rotate-180' : ''}`} 
          style={isGlobalActive ? { filter: 'brightness(0) saturate(100%) invert(13%) sepia(61%) saturate(3736%) hue-rotate(323deg) brightness(85%) contrast(97%)' } : {}}
        />
        
        {activeMega === 'global' && (
          <div 
            className="global-relations-menu" 
            id="global-relations-menu" 
            role="menu"
            onMouseEnter={() => handleNavEnter('global')}
            onMouseLeave={handleNavLeave}
          >
            <h2 className="grm-title text-left">{isHindi ? 'वैश्विक संबंध' : 'Global Relations'}</h2>
            <div className="grm-divider" aria-hidden="true"></div>
            <div className="grm-columns">
              <div className="grm-column">
                <p className="grm-column__heading text-left">{isHindi ? 'अंतर्राष्ट्रीय निकाय' : 'International Bodies'}</p>
                <div className="grm-link-group">
                  <Link href="/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'INTOSAI के साथ जुड़ाव' : 'Association with INTOSAI'}</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/Association%20with%20ASOSAI" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'ASOSAI के साथ जुड़ाव' : 'Association with ASOSAI'}</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/Multilateral%20Engagement" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'बहुपक्षीय सहभागिता' : 'Multilateral Engagement'}</Link>
                </div>
              </div>
              <div className="grm-column">
                <p className="grm-column__heading text-left">{isHindi ? 'द्विपक्षीय संबंध' : 'Bilateral Relations'}</p>
                <div className="grm-desc-box">
                  <p className="grm-desc-box__text text-left">
                    {isHindi 
                      ? 'SAI भारत की द्विपक्षीय साझेदारी और अन्य देशों के लेखा परीक्षा संस्थानों के साथ अंतर्राष्ट्रीय सहयोग का पता लगाएं' 
                      : 'Explore SAI India\'s bilateral partnerships and international cooperation with audit institutions across countries'}
                  </p>
                  <Link href="/About/Index-Menu-About/Global-relations/Bilateral%20Relations" className="grm-desc-box__cta text-left" onClick={() => setActiveMega(null)}>
                    {isHindi ? 'सभी देश देखें' : 'View all countries'} &rarr;
                  </Link>
                </div>
              </div>
              <div className="grm-column">
                <p className="grm-column__heading text-left">{isHindi ? 'लेखा परीक्षा सहभागिता' : 'Audit Engagements'}</p>
                <div className="grm-link-group">
                  <Link href="/About/Index-Menu-About/Global-relations/UN%20Panel%20of%20External%20Auditors" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल' : 'UN Panel of External Auditors'}</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/Present%20International%20Audits" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा' : 'Present International Audits'}</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/Past%20International%20Audits" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'विगत अंतर्राष्ट्रीय लेखा परीक्षा' : 'Past International Audits'}</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/Overseas%20Audit%20Offices" className="grm-link-box" onClick={() => setActiveMega(null)}>{isHindi ? 'विदेशी लेखा परीक्षा कार्यालय' : 'Overseas Audit Offices'}</Link>
                </div>
              </div>
              <div className="grm-column">
                <p className="grm-column__heading text-left">{isHindi ? 'प्रशिक्षण संस्थान' : 'Training Institutes'}</p>
                <div className="grm-link-group">
                  <Link href="/About/Index-Menu-About/Global-relations/iCED" className="grm-link-box" onClick={() => setActiveMega(null)}>iCED</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/iCISA" className="grm-link-box" onClick={() => setActiveMega(null)}>iCISA</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/NAAA" className="grm-link-box" onClick={() => setActiveMega(null)}>NAAA</Link>
                  <Link href="/About/Index-Menu-About/Global-relations/iCAL" className="grm-link-box" onClick={() => setActiveMega(null)}>iCAL</Link>
                </div>
              </div>
              <div className="grm-column">
                <p className="grm-column__heading text-left">{isHindi ? 'संपर्क' : 'Contact'}</p>
                <div className="grm-desc-box">
                  <p className="grm-desc-box__text text-left">
                    {isHindi 
                      ? 'वैश्विक साझेदारी और पहलों पर जानकारी के लिए अंतर्राष्ट्रीय संबंध विंग से जुड़ें' 
                      : 'Connect with the International Relations Wing for information on global partnerships, engagements and international initiative'}
                  </p>
                  <Link href="/About/Index-Menu-About/Global-relations/International%20Relations%20Wing" className="grm-desc-box__cta text-left" onClick={() => setActiveMega(null)}>
                    {isHindi ? 'अंतर्राष्ट्रीय संबंध विंग से संपर्क करें' : 'Contact Intl. Relations Wing'} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resources dropdown */}
      <div 
        className="nav-item relative cursor-pointer flex items-center gap-1"
        onMouseEnter={() => handleNavEnter('resources')}
        onMouseLeave={handleNavLeave}
      >
        <Link 
          href="/Resources" 
          className={isResourcesActive ? activeLinkClass : inactiveLinkClass}
          style={{ color: isResourcesActive ? '#751639' : '#4d4d4d', textDecoration: isResourcesActive ? 'underline' : 'none' }}
          onClick={(e) => handleTopicClick(e, 'resources')}
        >
          {labelResources}
        </Link>
        <img 
          src="/assets/32d6d59de0cd297086b7b32eb17e03e23b4ac03d.svg" 
          alt="" 
          className={`chevron ${isResourcesActive ? 'rotate-180' : ''}`} 
        />
        {activeMega === 'resources' && (
          <div 
            className="absolute top-[80%] left-0 pt-3 w-64 z-[1050]"
            onMouseEnter={() => handleNavEnter('resources')}
            onMouseLeave={handleNavLeave}
          >
            <div className="bg-white border border-[#d7d7d7] py-2 shadow-lg rounded-b-lg">
              <Link href="/Resources#manuals" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'लेखा परीक्षा नियमावली और तकनीकी गाइड' : 'Audit Manuals & Technical Guides'}
              </Link>
              <Link href="/Resources#standards" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'मार्गदर्शन नोट और लेखा मानक' : 'Guidance Notes & Accounting Standards'}
              </Link>
              <Link href="/Resources#regulations" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'राजपत्र अधिसूचनाएं और विनियम' : 'Gazette Notifications & Regulations'}
              </Link>
              <Link href="/Resources#circulars" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'विभागीय परिपत्र और नियम' : 'Departmental Circulars & Rules'}
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Careers dropdown */}
      <div 
        className="nav-item relative cursor-pointer flex items-center gap-1"
        onMouseEnter={() => handleNavEnter('careers')}
        onMouseLeave={handleNavLeave}
      >
        <Link 
          href="/Career-Engagement" 
          className={isCareersActive ? activeLinkClass : inactiveLinkClass}
          style={{ color: isCareersActive ? '#751639' : '#4d4d4d', textDecoration: isCareersActive ? 'underline' : 'none' }}
          onClick={(e) => handleTopicClick(e, 'careers')}
        >
          {labelCareers}
        </Link>
        <img 
          src="/assets/32d6d59de0cd297086b7b32eb17e03e23b4ac03d.svg" 
          alt="" 
          className={`chevron ${isCareersActive ? 'rotate-180' : ''}`} 
        />
        {activeMega === 'careers' && (
          <div 
            className="absolute top-[80%] left-0 pt-3 w-64 z-[1050]"
            onMouseEnter={() => handleNavEnter('careers')}
            onMouseLeave={handleNavLeave}
          >
            <div className="bg-white border border-[#d7d7d7] py-2 shadow-lg rounded-b-lg">
              <Link href="/Career-Engagement" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'भारतीय लेखा परीक्षा और लेखा सेवा (IA&AS)' : 'Indian Audit & Accounts Service (IA&AS)'}
              </Link>
              <Link href="/Career-Engagement" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'एसएससी (SSC) के माध्यम से सीधी भर्ती' : 'Direct Recruitment via SSC'}
              </Link>
              <Link href="/Career-Engagement" className="block px-4 py-2 text-xs text-[#2a2a2a] hover:bg-[#eee] transition-colors" onClick={() => setActiveMega(null)}>
                {isHindi ? 'युवा पेशेवर और इंटर्नशिप कार्यक्रम' : 'Young Professional & Internship Programs'}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* About Us mega-menu trigger */}
      <div 
        className="nav-item cursor-pointer flex items-center gap-1"
        onMouseEnter={() => handleNavEnter('about')}
        onMouseLeave={handleNavLeave}
      >
        <Link 
          href="/About/About-Us/Cag-Of-India" 
          id="about-us-trigger"
          className={isAboutActive ? activeLinkClass : inactiveLinkClass}
          style={isAboutActive ? { color: '#751639', textDecoration: 'underline', textUnderlineOffset: '5px', textDecorationColor: '#751639' } : {}}
          onClick={(e) => handleTopicClick(e, 'about')}
          aria-expanded={activeMega === 'about'}
        >
          {labelAbout}
        </Link>
        <img 
          src="/assets/32d6d59de0cd297086b7b32eb17e03e23b4ac03d.svg" 
          alt="" 
          className={`chevron ${isAboutActive ? 'rotate-180' : ''}`} 
          style={isAboutActive ? { filter: 'brightness(0) saturate(100%) invert(13%) sepia(61%) saturate(3736%) hue-rotate(323deg) brightness(85%) contrast(97%)' } : {}}
        />

        {activeMega === 'about' && (
          <div 
            className="about-menu" 
            id="about-menu" 
            role="menu"
            onMouseEnter={() => handleNavEnter('about')}
            onMouseLeave={handleNavLeave}
          >
            <h2 className="about-menu__title text-left">{isHindi ? 'हमारे बारे में' : 'About Us'}</h2>
            <div className="about-menu__divider" aria-hidden="true"></div>
            <div className="about-menu__columns">
              <div className="about-menu__column">
                <p className="about-menu__heading text-left">{isHindi ? 'हम कौन हैं' : 'Who We Are'}</p>
                <ul className="about-menu__list">
                  <li><Link href="/About/About-Us/Cag-Of-India" onClick={() => setActiveMega(null)}>{isHindi ? 'भारत के सीएजी की प्रोफाइल' : 'CAG of India Profile'}</Link></li>
                  <li><Link href="/About/About-Us/Our-Vision,-Mission-&-Core-Values" onClick={() => setActiveMega(null)}>{isHindi ? 'दृष्टिकोण, ध्येय और मूल्य' : 'Our Vision, Mission & Core Values'}</Link></li>
                  <li><Link href="/About/About-Us/Organisation-Chart" onClick={() => setActiveMega(null)}>{isHindi ? 'संगठन चार्ट' : 'Organisation-Chart'}</Link></li>
                </ul>
              </div>
              <div className="about-menu__column">
                <p className="about-menu__heading text-left">{isHindi ? 'नेतृत्व और विरासत' : 'Leadership & Legacy'}</p>
                <ul className="about-menu__list">
                  <li><Link href="/About/About-Us/Former-Comptroller-and-Auditors-General" onClick={() => setActiveMega(null)}>{isHindi ? 'पूर्व सीएजी गैलरी' : 'Former CAGs Gallery'}</Link></li>
                  <li><Link href="/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department" onClick={() => setActiveMega(null)}>{isHindi ? 'आईएएडी का इतिहास' : 'History of IAAD'}</Link></li>
                  <li><Link href="/About/About-Us/Audit-Advisory-Board" onClick={() => setActiveMega(null)}>{isHindi ? 'लेखा परीक्षा सलाहकार बोर्ड' : 'Audit-Advisory-Board'}</Link></li>
                </ul>
              </div>
              <div className="about-menu__column">
                <p className="about-menu__heading text-left">{isHindi ? 'शासन और अधिदेश' : 'Governance & Mandate'}</p>
                <ul className="about-menu__list">
                  <li><Link href="/About/About-Us/Constitutional-Provisions" onClick={() => setActiveMega(null)}>{isHindi ? 'संवैधानिक प्रावधान' : 'Constitutional-Provisions'}</Link></li>
                  <li><Link href="/About/About-Us/Duties-&-Powers-Act" onClick={() => setActiveMega(null)}>{isHindi ? 'कर्तव्य और शक्तियां अधिनियम' : 'Duties-&-Powers-Act'}</Link></li>
                  <li><Link href="/About/About-Us/Audit-Regulation" onClick={() => setActiveMega(null)}>{isHindi ? 'लेखा परीक्षा विनियम' : 'Audit-Regulation'}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
