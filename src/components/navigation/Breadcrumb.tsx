'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

const ROUTE_MAPPINGS: Record<string, string> = {
  '/About': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
  '/About/About-Us': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
  '/About-Us': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
  '/About/Index-Menu-About': '/About/Index-Menu-About/Global-relations/UN Panel of External Auditors',
  '/About/Index-Menu-About/Global-relations': '/About/Index-Menu-About/Global-relations/UN Panel of External Auditors',
  '/Index-Menu-About/Global-relations': '/About/Index-Menu-About/Global-relations/UN Panel of External Auditors',
  '/Global-relations': '/About/Index-Menu-About/Global-relations/UN Panel of External Auditors',
  '/Our-Presence': '/Our-Presence/Index-Menu/State-Level-Offices',
  '/Our-Presence/Index-Menu': '/Our-Presence/Index-Menu/State-Level-Offices',
  '/Resources': '/Resources/Tenders',
  '/Career-Engagement': '/Career-Engagement',
};

const ROUTE_GROUP_MAP: Record<string, { en: string; hi: string }> = {
  'un panel of external auditors': { en: 'Audit Engagements', hi: 'लेखा परीक्षा सहभागिता' },
  'present international audits': { en: 'Audit Engagements', hi: 'लेखा परीक्षा सहभागिता' },
  'past international audits': { en: 'Audit Engagements', hi: 'लेखा परीक्षा सहभागिता' },
  'overseas audit offices': { en: 'Audit Engagements', hi: 'लेखा परीक्षा सहभागिता' },
  'overseas-audit-offices': { en: 'Audit Engagements', hi: 'लेखा परीक्षा सहभागिता' },
  'association with intosai': { en: 'International Bodies', hi: 'अंतर्राष्ट्रीय निकाय' },
  'association with asosai': { en: 'International Bodies', hi: 'अंतर्राष्ट्रीय निकाय' },
  'multilateral engagement': { en: 'International Bodies', hi: 'अंतर्राष्ट्रीय निकाय' },
  'bilateral relations': { en: 'Bilateral Relations', hi: 'द्विपक्षीय संबंध' },
  'iced': { en: 'Training Institutes', hi: 'प्रशिक्षण संस्थान' },
  'icisa': { en: 'Training Institutes', hi: 'प्रशिक्षण संस्थान' },
  'naaa': { en: 'Training Institutes', hi: 'प्रशिक्षण संस्थान' },
  'ical': { en: 'Training Institutes', hi: 'प्रशिक्षण संस्थान' },
  'international-relations-wing': { en: 'Contact', hi: 'संपर्क' },
  'international relations wing': { en: 'Contact', hi: 'संपर्क' },
  'international-relation-wing': { en: 'Contact', hi: 'संपर्क' },
  'international relation wing': { en: 'Contact', hi: 'संपर्क' },
};

const SEGMENT_DISPLAY_NAMES_EN: Record<string, string> = {
  'home': 'Home',
  'about': 'About Us',
  'about-us': 'About Us',
  'about us': 'About Us',
  'global-relations': 'Global Relations',
  'global relations': 'Global Relations',
  'our-presence': 'Our Presence',
  'our presence': 'Our Presence',
  'reports': 'Reports',
  'resources': 'Resources',
  'career-engagement': 'Careers & Engagement',
  'career engagement': 'Careers & Engagement',
  'careers-&-engagement': 'Careers & Engagement',
  'audit-regulation': 'Audit Regulation',
  'audit regulation': 'Audit Regulation',
  'constitutional-provisions': 'Constitutional Provisions',
  'constitutional provisions': 'Constitutional Provisions',
  'duties-&-powers-act': 'Duties & Powers Act',
  'duties & powers act': 'Duties & Powers Act',
  'our-vision,-mission-&-core-values': 'Our Vision, Mission & Core Values',
  'former-comptroller-and-auditors-general': 'Former CAGs Gallery',
  'history-of-indian-audit-ans-accounts-department': 'History of IAAD',
  'audit-advisory-board': 'Audit Advisory Board',
  'organisation-chart': 'Organisation Chart',
  'cag-of-india': 'CAG of India Profile',
  'overseas audit offices': 'Audit Engagements',
  'overseas-audit-offices': 'Audit Engagements',
  'un panel of external auditors': 'Audit Engagements',
  'present international audits': 'Audit Engagements',
  'past international audits': 'Audit Engagements',
  'association with intosai': 'International Bodies',
  'association with asosai': 'International Bodies',
  'multilateral engagement': 'International Bodies',
  'bilateral relations': 'Bilateral Relations',
  'iced': 'Training Institutes',
  'icisa': 'Training Institutes',
  'naaa': 'Training Institutes',
  'ical': 'Training Institutes',
  'state-level-offices': 'State Level Offices',
  'central-audit-offices': 'Central Audit Offices',
  'traning-institutes': 'Training Institutes',
  'training-institutes': 'Training Institutes',
  'international-relations-wing': 'Contact',
  'international relations wing': 'Contact',
  'international-relation-wing': 'Contact',
  'international relation wing': 'Contact',
};

const SEGMENT_DISPLAY_NAMES_HI: Record<string, string> = {
  'home': 'मुख्य पृष्ठ',
  'about': 'हमारे बारे में',
  'about-us': 'हमारे बारे में',
  'about us': 'हमारे बारे में',
  'global-relations': 'वैश्विक संबंध',
  'global relations': 'वैश्विक संबंध',
  'our-presence': 'हमारी उपस्थिति',
  'our presence': 'हमारी उपस्थिति',
  'reports': 'रिपोर्ट',
  'resources': 'संसाधन',
  'career-engagement': 'करियर और जुड़ाव',
  'career engagement': 'करियर और जुड़ाव',
  'audit-regulation': 'लेखा परीक्षा विनियम',
  'audit regulation': 'लेखा परीक्षा विनियम',
  'constitutional-provisions': 'संवैधानिक प्रावधान',
  'constitutional provisions': 'संवैधानिक प्रावधान',
  'duties-&-powers-act': 'कर्तव्य और शक्तियां अधिनियम',
  'duties & powers act': 'कर्तव्य और शक्तियां अधिनियम',
  'our-vision,-mission-&-core-values': 'दृष्टिकोण, ध्येय और मूल्य',
  'former-comptroller-and-auditors-general': 'पूर्व सीएजी गैलरी',
  'history-of-indian-audit-ans-accounts-department': 'आईएएडी का इतिहास',
  'audit-advisory-board': 'लेखा परीक्षा सलाहकार बोर्ड',
  'organisation-chart': 'संगठन चार्ट',
  'cag-of-india': 'भारत के सीएजी की प्रोफाइल',
  'overseas audit offices': 'लेखा परीक्षा सहभागिता',
  'overseas-audit-offices': 'लेखा परीक्षा सहभागिता',
  'un panel of external auditors': 'लेखा परीक्षा सहभागिता',
  'present international audits': 'लेखा परीक्षा सहभागिता',
  'past international audits': 'लेखा परीक्षा सहभागिता',
  'association with intosai': 'अंतर्राष्ट्रीय निकाय',
  'association with asosai': 'अंतर्राष्ट्रीय निकाय',
  'multilateral engagement': 'अंतर्राष्ट्रीय निकाय',
  'bilateral relations': 'द्विपक्षीय संबंध',
  'iced': 'प्रशिक्षण संस्थान',
  'icisa': 'प्रशिक्षण संस्थान',
  'naaa': 'प्रशिक्षण संस्थान',
  'ical': 'प्रशिक्षण संस्थान',
  'state-level-offices': 'राज्य स्तरीय कार्यालय',
  'central-audit-offices': 'केंद्रीय लेखा परीक्षा कार्यालय',
  'traning-institutes': 'प्रशिक्षण संस्थान',
  'training-institutes': 'प्रशिक्षण संस्थान',
  'international-relations-wing': 'संपर्क',
  'international relations wing': 'संपर्क',
  'international-relation-wing': 'संपर्क',
  'international relation wing': 'संपर्क',
};

export default function Breadcrumb() {
  const pathname = usePathname();
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  if (pathname === '/' || pathname === '/Home-page') return null;

  const rawPaths = (pathname || '').split('/').filter(Boolean);

  // Filter out internal routing wrappers: 'Index-Menu-About', 'Index-Menu', and redundant 'About'
  const filteredPaths: { segment: string; url: string }[] = [];
  
  for (let i = 0; i < rawPaths.length; i++) {
    const seg = rawPaths[i];
    const segLower = seg.toLowerCase();
    const nextSegLower = rawPaths[i + 1]?.toLowerCase();

    // Skip technical folder names
    if (segLower === 'index-menu-about' || segLower === 'index-menu' || segLower === 'overview') {
      continue;
    }
    // Skip 'About' if followed by 'about-us', 'global-relations', or 'index-menu-about'
    if (segLower === 'about' && (nextSegLower === 'about-us' || nextSegLower === 'global-relations' || nextSegLower === 'index-menu-about')) {
      continue;
    }

    filteredPaths.push({
      segment: seg,
      url: `/${rawPaths.slice(0, i + 1).join('/')}`,
    });
  }

  const isHindi = lang === 'हिन्दी';

  return (
    <nav 
      className="text-[12px] font-['Noto_Sans',sans-serif] text-[#565656] flex items-center gap-[8px]" 
      aria-label="Breadcrumb"
      style={{
        height: '16px',
        opacity: 1,
        transform: 'rotate(0deg)',
      }}
    >
      <Link href="/" className="text-[#565656] hover:text-[#751639] font-normal text-[12px] leading-[16px] font-['Noto_Sans',sans-serif] transition-colors">
        {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
      </Link>
      {filteredPaths.map((item, idx) => {
        const resolvedUrl = ROUTE_MAPPINGS[item.url] || item.url;
        const isLast = idx === filteredPaths.length - 1;
        const decoded = decodeURIComponent(item.segment);
        const normalizedKey = decoded.replace(/-/g, ' ').toLowerCase();
        
        let displayName = isHindi
          ? (SEGMENT_DISPLAY_NAMES_HI[normalizedKey] || SEGMENT_DISPLAY_NAMES_HI[decoded.toLowerCase()] || decoded.replace(/-/g, ' '))
          : (SEGMENT_DISPLAY_NAMES_EN[normalizedKey] || SEGMENT_DISPLAY_NAMES_EN[decoded.toLowerCase()] || decoded.replace(/-/g, ' '));

        return (
          <React.Fragment key={item.url + idx}>
            <svg
              className="w-2.5 h-2.5 text-[#565656] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            {isLast ? (
              <span className="text-[#1A1A1A] font-bold text-[12px] leading-[16px] font-['Noto_Sans',sans-serif]">{displayName}</span>
            ) : (
              <Link
                href={resolvedUrl}
                className="text-[#565656] hover:text-[#751639] font-normal text-[12px] leading-[16px] font-['Noto_Sans',sans-serif] transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
