'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

interface SidebarLink {
  nameEn: string;
  nameHi: string;
  href: string;
}

interface SidebarGroup {
  mainTitleEn: string;
  mainTitleHi: string;
  groupHeadingEn: string;
  groupHeadingHi: string;
  links: SidebarLink[];
}

function getActiveGroup(pathname: string): SidebarGroup {
  const decodedPath = decodeURIComponent(pathname || '').toLowerCase();

  // 1. Leadership & Legacy
  if (
    decodedPath.includes('former-comptroller-and-auditors-general') ||
    decodedPath.includes('history-of-indian-audit-ans-accounts-department') ||
    decodedPath.includes('audit-advisory-board') ||
    decodedPath.includes('leadership-&-legacy')
  ) {
    return {
      mainTitleEn: 'About Us',
      mainTitleHi: 'हमारे बारे में',
      groupHeadingEn: 'Leadership & Legacy',
      groupHeadingHi: 'नेतृत्व और विरासत',
      links: [
        {
          nameEn: 'Former CAGs',
          nameHi: 'पूर्व सीएजी गैलरी',
          href: '/About/About-Us/Former-Comptroller-and-Auditors-General'
        },
        {
          nameEn: 'History of IAAD',
          nameHi: 'आईएएडी का इतिहास',
          href: '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department'
        },
        {
          nameEn: 'Audit Advisory Board',
          nameHi: 'लेखा परीक्षा सलाहकार बोर्ड',
          href: '/About/About-Us/Audit-Advisory-Board'
        }
      ]
    };
  }

  // 2. Governance & Mandate
  if (
    decodedPath.includes('constitutional-provisions') ||
    decodedPath.includes('duties-&-powers-act') ||
    decodedPath.includes('audit-regulation') ||
    decodedPath.includes('governance-&-mandate')
  ) {
    return {
      mainTitleEn: 'About Us',
      mainTitleHi: 'हमारे बारे में',
      groupHeadingEn: 'Governance & Mandate',
      groupHeadingHi: 'शासन और अधिदेश',
      links: [
        {
          nameEn: 'Constitutional Provisions',
          nameHi: 'संवैधानिक प्रावधान',
          href: '/About/About-Us/Constitutional-Provisions'
        },
        {
          nameEn: 'Duties & Powers Act',
          nameHi: 'कर्तव्य और शक्तियां अधिनियम',
          href: '/About/About-Us/Duties-&-Powers-Act'
        },
        {
          nameEn: 'Audit Regulation',
          nameHi: 'लेखा परीक्षा विनियम',
          href: '/About/About-Us/Audit-Regulation'
        }
      ]
    };
  }

  // 3. Global Relations
  if (decodedPath.includes('global-relations') || decodedPath.includes('international-relations')) {
    if (
      decodedPath.includes('un panel') ||
      decodedPath.includes('present international') ||
      decodedPath.includes('past international') ||
      decodedPath.includes('overseas')
    ) {
      return {
        mainTitleEn: 'Global Relations',
        mainTitleHi: 'वैश्विक संबंध',
        groupHeadingEn: 'Audit Engagements',
        groupHeadingHi: 'लेखा परीक्षा सहभागिता',
        links: [
          { nameEn: 'UN Panel of External Auditors', nameHi: 'संयुक्त राष्ट्र पैनल', href: '/About/Index-Menu-About/Global-relations/UN%20Panel%20of%20External%20Auditors' },
          { nameEn: 'Present International Audits', nameHi: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा', href: '/About/Index-Menu-About/Global-relations/Present%20International%20Audits' },
          { nameEn: 'Past International Audits', nameHi: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा', href: '/About/Index-Menu-About/Global-relations/Past%20International%20Audits' },
          { nameEn: 'Overseas Audit Offices', nameHi: 'विदेशी लेखा परीक्षा कार्यालय', href: '/About/Index-Menu-About/Global-relations/Overseas%20Audit%20Offices' }
        ]
      };
    }
    if (
      decodedPath.includes('iced') ||
      decodedPath.includes('icisa') ||
      decodedPath.includes('naaa') ||
      decodedPath.includes('ical')
    ) {
      return {
        mainTitleEn: 'Global Relations',
        mainTitleHi: 'वैश्विक संबंध',
        groupHeadingEn: 'Training Institutes',
        groupHeadingHi: 'प्रशिक्षण संस्थान',
        links: [
          { nameEn: 'iCED', nameHi: 'iCED', href: '/About/Index-Menu-About/Global-relations/iCED' },
          { nameEn: 'iCISA', nameHi: 'iCISA', href: '/About/Index-Menu-About/Global-relations/iCISA' },
          { nameEn: 'NAAA', nameHi: 'NAAA', href: '/About/Index-Menu-About/Global-relations/NAAA' },
          { nameEn: 'iCAL', nameHi: 'iCAL', href: '/About/Index-Menu-About/Global-relations/iCAL' }
        ]
      };
    }
    return {
      mainTitleEn: 'Global Relations',
      mainTitleHi: 'वैश्विक संबंध',
      groupHeadingEn: 'International Bodies',
      groupHeadingHi: 'अंतर्राष्ट्रीय निकाय',
      links: [
        { nameEn: 'Association with INTOSAI', nameHi: 'INTOSAI के साथ जुड़ाव', href: '/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI' },
        { nameEn: 'Association with ASOSAI', nameHi: 'ASOSAI के साथ जुड़ाव', href: '/About/Index-Menu-About/Global-relations/Association%20with%20ASOSAI' },
        { nameEn: 'Multilateral Engagement', nameHi: 'बहुपक्षीय सहभागिता', href: '/About/Index-Menu-About/Global-relations/Multilateral%20Engagement' }
      ]
    };
  }

  // 4. Default: Who We Are
  return {
    mainTitleEn: 'About Us',
    mainTitleHi: 'हमारे बारे में',
    groupHeadingEn: 'Who We Are',
    groupHeadingHi: 'हम कौन हैं',
    links: [
      {
        nameEn: 'CAG of India',
        nameHi: 'भारत के सीएजी',
        href: '/About/About-Us/Cag-Of-India'
      },
      {
        nameEn: 'Our Vision, Mission and Core Values',
        nameHi: 'हमारा दृष्टिकोण, ध्येय और मूल मूल्य',
        href: '/About/About-Us/Our-Vision,-Mission-&-Core-Values'
      },
      {
        nameEn: 'Organisation Chart',
        nameHi: 'संगठन चार्ट',
        href: '/About/About-Us/Organisation-Chart'
      }
    ]
  };
}

function isLinkActive(linkHref: string, currentPathname: string): boolean {
  const decodedCurrent = decodeURIComponent(currentPathname || '').toLowerCase();
  const decodedLink = decodeURIComponent(linkHref || '').toLowerCase();

  if (decodedCurrent === decodedLink) return true;

  if (decodedLink.includes('former-comptroller-and-auditors-general') && decodedCurrent.includes('former-comptroller-and-auditors-general')) return true;
  if (decodedLink.includes('history-of-indian-audit-ans-accounts-department') && decodedCurrent.includes('history-of-indian-audit-ans-accounts-department')) return true;
  if (decodedLink.includes('audit-advisory-board') && decodedCurrent.includes('audit-advisory-board')) return true;
  if (decodedLink.includes('cag-of-india') && decodedCurrent.includes('cag-of-india')) return true;
  if (decodedLink.includes('our-vision,-mission-&-core-values') && decodedCurrent.includes('our-vision,-mission-&-core-values')) return true;
  if (decodedLink.includes('organisation-chart') && decodedCurrent.includes('organisation-chart')) return true;
  if (decodedLink.includes('constitutional-provisions') && decodedCurrent.includes('constitutional-provisions')) return true;
  if (decodedLink.includes('duties-&-powers-act') && decodedCurrent.includes('duties-&-powers-act')) return true;
  if (decodedLink.includes('audit-regulation') && decodedCurrent.includes('audit-regulation')) return true;

  return false;
}

export default function AboutusSidemenu() {
  const pathname = usePathname();
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
  const groupData = getActiveGroup(pathname);

  return (
    <div className="about-sidebar about-sidebar--flat" data-name="Side Menu">
      <h2 className="about-sidebar__heading text-left">
        {isHindi ? groupData.mainTitleHi : groupData.mainTitleEn}
      </h2>
      <div className="about-sidebar__divider"></div>
      <div className="w-full">
        <h3 className="about-sidebar__group-heading text-left">
          {isHindi ? groupData.groupHeadingHi : groupData.groupHeadingEn}
        </h3>
        <nav className="flex flex-col gap-1 w-full" aria-label={`${groupData.groupHeadingEn} Navigation`}>
          {groupData.links.map((link) => {
            const isActive = isLinkActive(link.href, pathname);
            
            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`about-sidebar__link ${isActive ? 'about-sidebar__link--active' : ''}`}
              >
                {isHindi ? link.nameHi : link.nameEn}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

