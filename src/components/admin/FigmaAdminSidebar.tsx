'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAdminLanguage } from '@/lib/useAdminLanguage';

export interface LeafItem {
  type: 'leaf';
  id: string;
  name: string;
  name_hi?: string;
  path: string;
  isExternal?: boolean;
}

export interface SubMenuItem {
  type: 'submenu';
  id: string;
  name: string;
  name_hi?: string;
  children: (LeafItem | SubMenuItem)[];
}

export type MenuItem = LeafItem | SubMenuItem;

export interface TopSectionGroup {
  id: string;
  title: string;
  title_hi?: string;
  items: MenuItem[];
}

// Minimalist thin-stroke Chevron matching the Figma design
const ChevronIcon = ({ isOpen, color = 'rgba(255, 255, 255, 0.8)' }: { isOpen: boolean; color?: string }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 18 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
    style={{ color }}
  >
    <path 
      d="M4.5 6.75L9 11.25L13.5 6.75" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default function FigmaAdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isHindi } = useAdminLanguage();

  // Complete Navigation Structure matching Figma hierarchy with Hindi translations
  const sectionGroups: TopSectionGroup[] = [
    {
      id: 'main-cag-website',
      title: 'Main CAG Website',
      title_hi: 'मुख्य सीएजी वेबसाइट',
      items: [
        {
          type: 'submenu',
          id: 'home-page',
          name: 'Home Page',
          name_hi: 'मुख्य पृष्ठ',
          children: [
            {
              type: 'leaf',
              id: 'hp-hero-banner',
              name: 'Banners',
              name_hi: 'बैनर',
              path: '/admin/banners?tab=hero'
            },
            {
              type: 'leaf',
              id: 'hp-quick-links',
              name: 'Quick Link Cards',
              name_hi: 'त्वरित लिंक कार्ड',
              path: '/admin/banners?tab=quick-links'
            },
            {
              type: 'leaf',
              id: 'hp-who-we-are',
              name: 'Who we are',
              name_hi: 'हम कौन हैं',
              path: '/admin/banners?tab=who-we-are'
            },
            {
              type: 'leaf',
              id: 'hp-statistics',
              name: 'Statistics',
              name_hi: 'सांख्यिकी',
              path: '/admin/banners?tab=statistics'
            },
            {
              type: 'leaf',
              id: 'hp-cag-message',
              name: 'CAG Message',
              name_hi: 'सीएजी संदेश',
              path: '/admin/banners?tab=cag-message'
            }
          ]
        },
        {
          type: 'submenu',
          id: 'reports',
          name: 'Reports & Accounts',
          name_hi: 'रिपोर्ट एवं लेखे',
          children: [
            {
              type: 'leaf',
              id: 'rep-reports',
              name: 'Audit Reports',
              name_hi: 'लेखापरीक्षा रिपोर्ट',
              path: '/admin/reports'
            },
            {
              type: 'leaf',
              id: 'rep-accounts',
              name: 'Accounts Hub',
              name_hi: 'लेखे प्रबंधन (Hub)',
              path: '/admin/accounts'
            },
            {
              type: 'leaf',
              id: 'rep-state-accounts',
              name: 'State Accounts',
              name_hi: 'राज्य के सरकारी लेखे',
              path: '/admin/state-accounts'
            },
            {
              type: 'leaf',
              id: 'rep-combined-accounts',
              name: 'Combined Finance & Revenue',
              name_hi: 'संयुक्त वित्त एवं राजस्व लेखे',
              path: '/admin/combined-accounts'
            }
          ]
        },
        {
          type: 'submenu',
          id: 'our-presence',
          name: 'Our Presence',
          name_hi: 'हमारी उपस्थिति',
          children: [
            {
              type: 'submenu',
              id: 'state-level-offices',
              name: 'State Level Offices',
              name_hi: 'राज्य स्तरीय कार्यालय',
              children: [
                {
                  type: 'leaf',
                  id: 'ae-offices',
                  name: 'State A&E Offices',
                  name_hi: 'राज्य लेखा एवं हकदारी कार्यालय',
                  path: '/admin/offices?type=ae'
                },
                {
                  type: 'leaf',
                  id: 'state-audit-offices',
                  name: 'State Audit Offices',
                  name_hi: 'राज्य लेखापरीक्षा कार्यालय',
                  path: '/admin/offices?type=audit'
                }
              ]
            },
            {
              type: 'submenu',
              id: 'central-audit-offices',
              name: 'Central Audit Offices',
              name_hi: 'केंद्रीय लेखापरीक्षा कार्यालय',
              children: [
                {
                  type: 'leaf',
                  id: 'cao-defence',
                  name: 'Defence',
                  name_hi: 'रक्षा',
                  path: '/admin/offices?type=defence'
                },
                {
                  type: 'leaf',
                  id: 'cao-railway',
                  name: 'Railway',
                  name_hi: 'रेलवे',
                  path: '/admin/offices?type=railway'
                },
                {
                  type: 'leaf',
                  id: 'cao-other-ministries',
                  name: 'Other Ministries',
                  name_hi: 'अन्य मंत्रालय',
                  path: '/admin/offices?type=ministries'
                },
                {
                  type: 'leaf',
                  id: 'cao-overseas',
                  name: 'Overseas',
                  name_hi: 'विदेशी कार्यालय',
                  path: '/admin/offices?type=overseas'
                }
              ]
            },
            {
              type: 'submenu',
              id: 'training-institutes',
              name: 'Training Institutes',
              name_hi: 'प्रशिक्षण संस्थान',
              children: [
                {
                  type: 'leaf',
                  id: 'ti-regional',
                  name: 'Regional Training Institutes',
                  name_hi: 'क्षेत्रीय प्रशिक्षण संस्थान (RTIs)',
                  path: '/admin/offices?type=rti'
                },
                {
                  type: 'leaf',
                  id: 'ti-iced',
                  name: 'iCED',
                  name_hi: 'आईसीईडी (जयपुर)',
                  path: '/admin/offices?type=iced'
                },
                {
                  type: 'leaf',
                  id: 'ti-icisa',
                  name: 'iCISA',
                  name_hi: 'आईसीआईएसए (नोएडा)',
                  path: '/admin/offices?type=icisa'
                },
                {
                  type: 'leaf',
                  id: 'ti-naaa',
                  name: 'NAAA',
                  name_hi: 'एनएएए (शिमला)',
                  path: '/admin/offices?type=naaa'
                },
                {
                  type: 'leaf',
                  id: 'ti-ical',
                  name: 'iCAL',
                  name_hi: 'आईसीएल (कोझिकोड)',
                  path: '/admin/offices?type=ical'
                }
              ]
            }
          ]
        },
        {
          type: 'submenu',
          id: 'global-relations',
          name: 'Global Relations',
          name_hi: 'वैश्विक संबंध',
          children: [
            {
              type: 'leaf',
              id: 'gr-intl-bodies',
              name: 'International Bodies',
              name_hi: 'अंतर्राष्ट्रीय निकाय (INTOSAI/ASOSAI)',
              path: '/admin/global-relations?tab=international-bodies'
            },
            {
              type: 'leaf',
              id: 'gr-bilateral',
              name: 'Bilateral Relations',
              name_hi: 'द्विपक्षीय संबंध',
              path: '/admin/global-relations?tab=bilateral-relations'
            },
            {
              type: 'leaf',
              id: 'gr-audit-engagements',
              name: 'Audit Engagements',
              name_hi: 'लेखापरीक्षा सहभागिता',
              path: '/admin/global-relations?tab=audit-engagements'
            },
            {
              type: 'leaf',
              id: 'gr-relations-wing',
              name: 'Relations Wing',
              name_hi: 'अंतर्राष्ट्रीय संबंध प्रभाग',
              path: '/admin/global-relations?tab=relations-wing'
            }
          ]
        },
        {
          type: 'leaf',
          id: 'resources',
          name: 'Resources',
          name_hi: 'संसाधन एवं परिपत्र',
          path: '/admin/circulars'
        },
        {
          type: 'leaf',
          id: 'careers-engagement',
          name: 'Careers & Engagement',
          name_hi: 'कैरियर एवं सहभागिता',
          path: '/admin/about?tab=recruitment'
        },
        {
          type: 'submenu',
          id: 'about-us',
          name: 'About Us',
          name_hi: 'हमारे बारे में',
          children: [
            {
              type: 'leaf',
              id: 'abt-all',
              name: 'All Sections Registry',
              name_hi: 'सभी अनुभाग रजिस्ट्री',
              path: '/admin/about'
            },
            {
              type: 'leaf',
              id: 'abt-who-we-are',
              name: 'Who We Are',
              name_hi: 'हम कौन हैं (प्रोफाइल/दृष्टिकोण/चार्ट)',
              path: '/admin/about?category=Who+We+Are'
            },
            {
              type: 'leaf',
              id: 'abt-leadership',
              name: 'Leadership & Legacy',
              name_hi: 'नेतृत्व एवं विरासत (पूर्व सीएजी/इतिहास)',
              path: '/admin/about?category=Leadership+%26+Legacy'
            },
            {
              type: 'leaf',
              id: 'abt-governance',
              name: 'Governance & Mandate',
              name_hi: 'शासन एवं अधिदेश (संविधान/अधिनियम/विनियम)',
              path: '/admin/about?category=Governance+%26+Mandate'
            }
          ]
        },
        {
          type: 'submenu',
          id: 'news-media',
          name: 'News & Media',
          name_hi: 'समाचार एवं मीडिया',
          children: [
            {
              type: 'leaf',
              id: 'nm-news-events',
              name: 'News & Events',
              name_hi: 'समाचार एवं कार्यक्रम',
              path: '/admin/news'
            },
            {
              type: 'leaf',
              id: 'nm-video-gallery',
              name: 'Video Gallery',
              name_hi: 'वीडियो गैलरी',
              path: '/admin/news?tab=videos'
            }
          ]
        },
        {
          type: 'leaf',
          id: 'contact',
          name: 'Contact',
          name_hi: 'संपर्क सूत्र',
          path: '/admin/site-settings?tab=contact'
        }
      ]
    },
    {
      id: 'menu-management',
      title: 'Menu Management',
      title_hi: 'मेनू प्रबंधन',
      items: [
        {
          type: 'leaf',
          id: 'mm-super-admin',
          name: 'Super Admin',
          name_hi: 'सुपर एडमिन मास्टर्स',
          path: '/admin/masters?tab=super-admin'
        },
        {
          type: 'leaf',
          id: 'mm-website-menu',
          name: 'Website Menu',
          name_hi: 'वेबसाइट नेविगेशन मेनू',
          path: '/admin/masters?tab=website-menu'
        }
      ]
    },
    {
      id: 'administration',
      title: 'Administration',
      title_hi: 'प्रशासन एवं उपयोगकर्ता',
      items: [
        {
          type: 'leaf',
          id: 'adm-users',
          name: 'Users',
          name_hi: 'प्रशासनिक उपयोगकर्ता',
          path: '/admin/users?tab=users'
        },
        {
          type: 'leaf',
          id: 'adm-wings',
          name: 'Wings',
          name_hi: 'लेखापरीक्षा विंग',
          path: '/admin/users?tab=wings'
        },
        {
          type: 'leaf',
          id: 'adm-roles',
          name: 'Roles',
          name_hi: 'सुरक्षा भूमिकाएं (Roles)',
          path: '/admin/users?tab=roles'
        }
      ]
    }
  ];

  // Expanded state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'main-cag-website': true,
    'home-page': true,
    'reports': false,
    'our-presence': false,
    'state-level-offices': false,
    'central-audit-offices': false,
    'training-institutes': false,
    'global-relations': false,
    'news-media': false,
    'menu-management': false,
    'administration': false
  });

  useEffect(() => {
    const newExpanded = { ...expanded };

    if (pathname === '/admin/banners') {
      newExpanded['main-cag-website'] = true;
      newExpanded['home-page'] = true;
    } else if (
      pathname === '/admin/reports' || 
      pathname === '/admin/accounts' || 
      pathname === '/admin/state-accounts' || 
      pathname === '/admin/combined-accounts'
    ) {
      newExpanded['main-cag-website'] = true;
      newExpanded['reports'] = true;
    } else if (pathname === '/admin/offices') {
      newExpanded['main-cag-website'] = true;
      newExpanded['our-presence'] = true;
      const type = searchParams.get('type') || '';
      if (['rti', 'iced', 'icisa', 'naaa', 'ical'].includes(type.toLowerCase())) {
        newExpanded['training-institutes'] = true;
      } else if (type === 'ae' || type === 'audit') {
        newExpanded['state-level-offices'] = true;
      } else if (['defence', 'defense', 'railway', 'ministries', 'overseas'].includes(type.toLowerCase())) {
        newExpanded['central-audit-offices'] = true;
      }
    } else if (pathname === '/admin/global' || pathname === '/admin/global-relations') {
      newExpanded['main-cag-website'] = true;
      newExpanded['global-relations'] = true;
    } else if (pathname === '/admin/news') {
      newExpanded['main-cag-website'] = true;
      newExpanded['news-media'] = true;
    } else if (pathname === '/admin/masters') {
      newExpanded['menu-management'] = true;
    } else if (pathname === '/admin/users') {
      newExpanded['administration'] = true;
    } else if (
      pathname === '/admin/circulars' || 
      pathname === '/admin/about' || 
      pathname === '/admin/site-settings'
    ) {
      newExpanded['main-cag-website'] = true;
    }

    setExpanded(newExpanded);
  }, [pathname, searchParams]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkIsActive = (targetPath: string) => {
    if (targetPath.includes('?')) {
      const [pathBase, queryString] = targetPath.split('?');
      if (pathname !== pathBase) return false;
      const targetParams = new URLSearchParams(queryString);
      let matches = true;
      targetParams.forEach((val, key) => {
        const currentVal = searchParams.get(key);
        if (pathname === '/admin/users' && key === 'tab' && !currentVal && val === 'users') return;
        if (pathname === '/admin/banners' && key === 'tab' && !currentVal && val === 'hero') return;
        if (currentVal !== val) matches = false;
      });
      return matches;
    }

    if (targetPath === '/admin/banners') {
      return pathname === '/admin/banners' && (!searchParams.get('tab') || searchParams.get('tab') === 'hero');
    }
    if (targetPath === '/admin/accounts') {
      if (pathname !== '/admin/accounts') return false;
      const sub = searchParams.get('subtopic');
      return !sub || sub === 'all';
    }
    if (targetPath === '/admin/about') {
      return pathname === '/admin/about' && !searchParams.get('tab');
    }
    if (targetPath === '/admin/news') {
      return pathname === '/admin/news' && !searchParams.get('tab');
    }

    return pathname === targetPath;
  };

  // Render Leaf Navigation Item
  const renderLeaf = (leaf: LeafItem, depth: number = 0) => {
    const isActive = checkIsActive(leaf.path);
    const label = isHindi && leaf.name_hi ? leaf.name_hi : leaf.name;

    return (
      <div key={leaf.id} className="w-full">
        <Link
          href={leaf.path}
          target={leaf.isExternal ? '_blank' : '_self'}
          className={`flex items-center justify-between w-full transition-all duration-150 text-left cursor-pointer ${
            isActive
              ? 'bg-[rgba(255,255,255,0.15)] text-white font-medium rounded-[12px] px-4 py-2.5 h-[43px]'
              : 'px-4 py-2.5 h-[43px] text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.08)] rounded-[10px]'
          }`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            lineHeight: '19px',
            fontWeight: 500,
            color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <span className="truncate">{label}</span>
        </Link>
      </div>
    );
  };

  // Render Submenu Header and its nested children
  const renderSubMenu = (sub: SubMenuItem, depth: number = 0) => {
    const isOpen = !!expanded[sub.id];
    const label = isHindi && sub.name_hi ? sub.name_hi : sub.name;
    
    return (
      <div key={sub.id} className="w-full flex flex-col gap-1">
        {/* Accordion Trigger */}
        <button
          type="button"
          onClick={() => toggleExpand(sub.id)}
          className="flex items-center justify-between w-full h-[43px] px-4 rounded-[10px] text-left transition-colors cursor-pointer group select-none hover:bg-[rgba(255,255,255,0.08)]"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            lineHeight: '19px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <span className="truncate">{label}</span>
          <ChevronIcon isOpen={isOpen} color="rgba(255, 255, 255, 0.8)" />
        </button>

        {/* Nested Children Container with Left Vertical Line */}
        {isOpen && (
          <div className="border-l border-[rgba(255,255,255,0.5)] ml-4 pl-3 flex flex-col gap-1 w-full my-0.5">
            {sub.children.map(child => {
              if (child.type === 'leaf') {
                return renderLeaf(child, depth + 1);
              }
              return renderSubMenu(child, depth + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="h-full max-h-full flex flex-col flex-shrink-0 select-none overflow-hidden"
      style={{
        boxSizing: 'border-box',
        width: '355px',
        minWidth: '355px',
        maxWidth: '355px',
        padding: '24px',
        background: '#751639',
        fontFamily: "'Inter', sans-serif",
        color: '#FFFFFF'
      }}
    >
      {/* Scrollable Navigation Tree */}
      <nav className="flex-1 overflow-y-auto overscroll-contain py-1 space-y-4 w-full pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {sectionGroups.map((group) => {
          const isGroupOpen = !!expanded[group.id];
          const groupTitle = isHindi && group.title_hi ? group.title_hi : group.title;

          return (
            <div key={group.id} className="w-full flex flex-col gap-1">
              {/* Top-Level Section Header */}
              <button
                type="button"
                onClick={() => toggleExpand(group.id)}
                className="flex items-center justify-between w-full h-[43px] px-2 rounded-[10px] text-left transition-colors cursor-pointer group select-none hover:bg-[rgba(255,255,255,0.08)]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '16px',
                  lineHeight: '19px',
                  fontWeight: 500,
                  color: '#FFFFFF'
                }}
              >
                <span className="truncate">{groupTitle}</span>
                <ChevronIcon isOpen={isGroupOpen} color="#FFFFFF" />
              </button>

              {/* Children of Top-Level Section with continuous left line */}
              {isGroupOpen && (
                <div className="border-l border-[rgba(255,255,255,0.5)] ml-3 pl-3 flex flex-col gap-1 w-full my-0.5">
                  {group.items.map((item) => {
                    if (item.type === 'leaf') {
                      return renderLeaf(item, 1);
                    }
                    return renderSubMenu(item, 0);
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
