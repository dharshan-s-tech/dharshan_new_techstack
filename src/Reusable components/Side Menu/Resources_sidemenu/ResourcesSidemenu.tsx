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

export const RESOURCES_SECTIONS: Record<string, SidebarGroup> = {
  policies: {
    mainTitleEn: 'Resources',
    mainTitleHi: 'संसाधन',
    groupHeadingEn: 'Policies',
    groupHeadingHi: 'नीतियां',
    links: [
      {
        nameEn: 'Recruitment Policy',
        nameHi: 'भर्ती नीति',
        href: '/Resources/Recruitment-Policy'
      },
      {
        nameEn: 'Citizen Charter',
        nameHi: 'नागरिक अधिकार पत्र (सिटिज़न चार्टर)',
        href: '/Resources/Citizen-Charter'
      },
      {
        nameEn: 'Right to Information Policy',
        nameHi: 'सूचना का अधिकार नीति',
        href: '/Resources/Right-to-Information-Policy'
      },
      {
        nameEn: 'Administrative Information Policy',
        nameHi: 'प्रशासनिक सूचना नीति',
        href: '/Resources/Administrative-Information-Policy'
      },
      {
        nameEn: 'Social Media Policy',
        nameHi: 'सोशल मीडिया नीति',
        href: '/Resources/Social-Media-Policy'
      },
      {
        nameEn: 'PIDPI Policy for Circulation',
        nameHi: 'प्रसार के लिए पीआईडीपीआई नीति',
        href: '/Resources/PIDPI-Policy-for-Circulation'
      }
    ]
  },
  publications: {
    mainTitleEn: 'Resources',
    mainTitleHi: 'संसाधन',
    groupHeadingEn: 'Publications',
    groupHeadingHi: 'प्रकाशन',
    links: [
      {
        nameEn: 'Annual Report',
        nameHi: 'वार्षिक प्रतिवेदन',
        href: '/Resources/Annual-Report'
      },
      {
        nameEn: 'Peer Review Report',
        nameHi: 'पीयर रिव्यू रिपोर्ट',
        href: '/Resources/Peer-Review-Report'
      },
      {
        nameEn: 'Status of Accounts of State PSUs',
        nameHi: 'राज्य सार्वजनिक उपक्रमों के खातों की स्थिति',
        href: '/Resources/Status-of-Accounts-of-State-PSUs'
      },
      {
        nameEn: 'Study Reports & Compendia Compendium on Audit of the Education Sector in India',
        nameHi: 'भारत में शिक्षा क्षेत्र के लेखापरीक्षा पर अध्ययन रिपोर्ट एवं संग्रह',
        href: '/Resources/Study-Reports-and-Compendia'
      },
      {
        nameEn: 'Rajbhasha e-Patrika',
        nameHi: 'राजभाषा ई-पत्रिका',
        href: '/Resources/Rajbhasha-e-Patrika'
      }
    ]
  },
  standards: {
    mainTitleEn: 'Resources',
    mainTitleHi: 'संसाधन',
    groupHeadingEn: 'Standards & Guidance',
    groupHeadingHi: 'मानक एवं मार्गदर्शन',
    links: [
      {
        nameEn: 'Standing Orders',
        nameHi: 'स्थायी आदेश',
        href: '/Resources/Standing-Orders'
      },
      {
        nameEn: 'Guidelines',
        nameHi: 'दिशा-निर्देश',
        href: '/Resources/Guidelines'
      },
      {
        nameEn: 'Guidance Notes, Practice Guides & Concept Notes',
        nameHi: 'मार्गदर्शन नोट, अभ्यास गाइड और अवधारणा नोट',
        href: '/Resources/Guidance-Notes'
      },
      {
        nameEn: 'Manuals',
        nameHi: 'नियमावली (मैनुअल)',
        href: '/Resources/Manuals'
      }
    ]
  },
  media: {
    mainTitleEn: 'Resources',
    mainTitleHi: 'संसाधन',
    groupHeadingEn: 'Media & Archives',
    groupHeadingHi: 'मीडिया एवं पुरालेख',
    links: [
      {
        nameEn: 'Press Releases',
        nameHi: 'प्रेस विज्ञप्तियां',
        href: '/Resources/Press-Releases'
      },
      {
        nameEn: 'Speeches',
        nameHi: 'भाषण एवं वक्तव्य',
        href: '/Resources/Speeches'
      },
      {
        nameEn: 'Photo Gallery',
        nameHi: 'फोटो गैलरी',
        href: '/Resources/Photo-Gallery'
      },
      {
        nameEn: 'Video Gallery',
        nameHi: 'वीडियो गैलरी',
        href: '/Resources/Video-Gallery'
      }
    ]
  }
};

function getActiveResourceGroup(pathname: string): SidebarGroup {
  const decodedPath = decodeURIComponent(pathname || '').toLowerCase();

  // Publications
  if (
    decodedPath.includes('annual-report') ||
    decodedPath.includes('peer-review-report') ||
    decodedPath.includes('status-of-accounts') ||
    decodedPath.includes('study-reports') ||
    decodedPath.includes('rajbhasha') ||
    decodedPath.includes('publications')
  ) {
    return RESOURCES_SECTIONS.publications;
  }

  // Standards & Guidance
  if (
    decodedPath.includes('standing-orders') ||
    decodedPath.includes('guidelines') ||
    decodedPath.includes('guidance-notes') ||
    decodedPath.includes('manuals') ||
    decodedPath.includes('standards')
  ) {
    return RESOURCES_SECTIONS.standards;
  }

  // Media & Archives
  if (
    decodedPath.includes('press-releases') ||
    decodedPath.includes('speeches') ||
    decodedPath.includes('photo-gallery') ||
    decodedPath.includes('video-gallery') ||
    decodedPath.includes('media-and-archives')
  ) {
    return RESOURCES_SECTIONS.media;
  }

  // Default: Policies
  return RESOURCES_SECTIONS.policies;
}

function isLinkActive(linkHref: string, currentPathname: string): boolean {
  const decodedCurrent = decodeURIComponent(currentPathname || '').toLowerCase().replace(/\/$/, '');
  const decodedLink = decodeURIComponent(linkHref || '').toLowerCase().replace(/\/$/, '');
  
  if (decodedCurrent === decodedLink) return true;
  
  const currentSlug = decodedCurrent.split('/').filter(Boolean).pop();
  const linkSlug = decodedLink.split('/').filter(Boolean).pop();
  
  if (currentSlug && linkSlug && currentSlug === linkSlug) return true;
  
  return false;
}

export default function ResourcesSidemenu() {
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
  const groupData = getActiveResourceGroup(pathname);

  return (
    <aside 
      className="w-[310px] min-h-[379px] bg-[#FFFFFF] border border-[#E6E6E6] rounded-[8px] p-6 shadow-[4px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-4 shrink-0 font-['Noto_Sans',sans-serif]"
      data-name="Side Menu"
      aria-label="Resources Navigation"
    >
      {/* Side Menu Header */}
      <h2 className="w-full text-[20px] font-semibold leading-[27px] text-[#000000] tracking-tight">
        {isHindi ? groupData.mainTitleHi : groupData.mainTitleEn}
      </h2>

      {/* Line 1586 */}
      <div className="w-full h-0 border-b border-[#D7D7D7]" aria-hidden="true" />

      {/* Menus Section */}
      <div className="w-full flex flex-col gap-4">
        {/* Active Group Heading */}
        <h3 className="w-full text-[16px] font-bold leading-[22px] text-[#2A2A2A]">
          {isHindi ? groupData.groupHeadingHi : groupData.groupHeadingEn}
        </h3>

        {/* Sub Menus List */}
        <nav className="w-full flex flex-col gap-1" aria-label={`${groupData.groupHeadingEn} Submenu`}>
          {groupData.links.map((link) => {
            const isActive = isLinkActive(link.href, pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full min-h-[35px] py-2 px-4 flex items-center text-[14px] leading-[19px] transition-all duration-150 ${
                  isActive
                    ? 'bg-[#751639]/[0.08] text-[#751639] font-semibold rounded-[4px] border-l-0'
                    : 'bg-[#FFFFFF] text-[#2A2A2A] font-normal border-l border-[#D7D7D7] rounded-none hover:bg-zinc-50 hover:text-[#751639]'
                }`}
                style={isActive ? { backgroundColor: 'rgba(117, 22, 57, 0.08)', color: '#751639' } : {}}
              >
                <span className="line-clamp-2">{isHindi ? link.nameHi : link.nameEn}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Other Categories Switcher */}
      <div className="pt-2 border-t border-[#EAEAEA] mt-auto">
        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
          {isHindi ? 'अन्य संसाधन श्रेणियां' : 'All Resource Categories'}
        </p>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          {Object.entries(RESOURCES_SECTIONS).map(([key, section]) => {
            const isCurrentSection = section.groupHeadingEn === groupData.groupHeadingEn;
            if (isCurrentSection) return null;
            return (
              <Link
                key={key}
                href={section.links[0].href}
                className="px-2 py-1.5 rounded bg-zinc-50 text-zinc-600 hover:text-[#751639] hover:bg-[#751639]/5 font-medium truncate"
              >
                {isHindi ? section.groupHeadingHi : section.groupHeadingEn}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
