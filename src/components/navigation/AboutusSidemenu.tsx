'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

interface SidebarLink {
  name: string;
  hindiName: string;
  href: string;
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

  const links: SidebarLink[] = [
    { 
      name: 'CAG of India', 
      hindiName: 'भारत के सीएजी', 
      href: '/About/About-Us/Cag-Of-India' 
    },
    { 
      name: 'Our Vision, Mission and Core Values', 
      hindiName: 'दृष्टिकोण, ध्येय और मूल्य', 
      href: '/About/About-Us/Our-Vision,-Mission-&-Core-Values' 
    },
    { 
      name: 'Organisation Chart', 
      hindiName: 'संगठन चार्ट', 
      href: '/About/About-Us/Organisation-Chart' 
    },
    { 
      name: 'History of Indian Audit and Accounts Department', 
      hindiName: 'भारतीय लेखापरीक्षा और लेखा विभाग का इतिहास', 
      href: '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department' 
    },
    { 
      name: 'Former Comptroller and Auditors General', 
      hindiName: 'पूर्व नियंत्रक और महालेखापरीक्षक', 
      href: '/About/About-Us/Former-Comptroller-and-Auditors-General' 
    },
    { 
      name: 'International Relations', 
      hindiName: 'अंतर्राष्ट्रीय संबंध', 
      href: '/About/About-Us/International-Relations' 
    },
    { 
      name: 'Audit Advisory Board', 
      hindiName: 'लेखा परीक्षा सलाहकार बोर्ड', 
      href: '/About/About-Us/Audit-Advisory-Board' 
    }
  ];

  return (
    <div className="about-sidebar about-sidebar--flat" data-name="Side Menu">
      <h2 className="about-sidebar__heading text-left">
        {isHindi ? 'हमारे बारे में' : 'About Us'}
      </h2>
      <div className="about-sidebar__divider"></div>
      <nav className="flex flex-col gap-1 w-full" aria-label="About Us Navigation">
        {links.map((link) => {
          const isActive = decodeURIComponent(pathname).toLowerCase() === link.href.toLowerCase();
          
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`about-sidebar__link ${isActive ? 'about-sidebar__link--active' : ''}`}
            >
              {isHindi ? link.hindiName : link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
