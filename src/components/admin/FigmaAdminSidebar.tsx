'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export interface LeafItem {
  type: 'leaf';
  id: string;
  name: string;
  path: string;
  isExternal?: boolean;
}

export interface SubMenuItem {
  type: 'submenu';
  id: string;
  name: string;
  children: (LeafItem | SubMenuItem)[];
}

export type MenuItem = LeafItem | SubMenuItem;

// Minimalist thin-stroke Chevron matching the Figma UI (12x12) with depth-aware opacity
const ChevronIcon = ({ isOpen, depth = 0 }: { isOpen: boolean; depth?: number }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 14 14" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-200 ${
      depth === 0 ? 'text-white' : depth === 1 ? 'text-white/80 group-hover:text-white' : 'text-white/70 group-hover:text-white'
    } ${isOpen ? 'rotate-180' : 'rotate-0'}`}
  >
    <path 
      d="M3 5L7 9L11 5" 
      stroke="currentColor" 
      strokeWidth={depth === 0 ? "2" : "1.75"} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default function FigmaAdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Preserved original module tree structure
  const menuItems: MenuItem[] = [
    {
      type: 'leaf',
      id: 'home-page',
      name: 'Home Page',
      path: '/admin/banners'
    },
    {
      type: 'submenu',
      id: 'reports',
      name: 'Reports & Accounts',
      children: [
        {
          type: 'leaf',
          id: 'rep-audit',
          name: 'Audit Reports',
          path: '/admin/reports'
        },
        {
          type: 'leaf',
          id: 'rep-accounts',
          name: 'Accounts Reports',
          path: '/admin/accounts'
        },
        {
          type: 'leaf',
          id: 'rep-state-acc',
          name: 'State & UT Accounts',
          path: '/admin/state-accounts'
        },
        {
          type: 'leaf',
          id: 'rep-comb-acc',
          name: 'Combined Accounts & Conf.',
          path: '/admin/combined-accounts'
        }
      ]
    },
    {
      type: 'submenu',
      id: 'our-presence',
      name: 'Our Presence',
      children: [
        {
          type: 'submenu',
          id: 'state-level-offices',
          name: 'State Level Offices',
          children: [
            {
              type: 'leaf',
              id: 'ae-offices',
              name: 'Accounts & Entitlement Offices',
              path: '/admin/offices?type=ae'
            },
            {
              type: 'leaf',
              id: 'state-audit-offices',
              name: 'State Audit Offices',
              path: '/admin/offices?type=audit'
            }
          ]
        },
        {
          type: 'submenu',
          id: 'central-audit-offices',
          name: 'Central Audit Offices',
          children: [
            {
              type: 'leaf',
              id: 'cao-defence',
              name: 'Defence',
              path: '/admin/offices?type=defence'
            },
            {
              type: 'leaf',
              id: 'cao-railway',
              name: 'Railway',
              path: '/admin/offices?type=railway'
            },
            {
              type: 'leaf',
              id: 'cao-other-ministries',
              name: 'Other Ministries',
              path: '/admin/offices?type=ministries'
            },
            {
              type: 'leaf',
              id: 'cao-overseas',
              name: 'Overseas',
              path: '/admin/offices?type=overseas'
            }
          ]
        },
        {
          type: 'submenu',
          id: 'training-institutes',
          name: 'Training Institutes',
          children: [
            {
              type: 'leaf',
              id: 'ti-regional',
              name: 'Regional Training Institutes',
              path: '/admin/offices?type=rti'
            },
            {
              type: 'leaf',
              id: 'ti-iced',
              name: 'iCED',
              path: '/admin/offices?type=iced'
            },
            {
              type: 'leaf',
              id: 'ti-icisa',
              name: 'iCISA',
              path: '/admin/offices?type=icisa'
            },
            {
              type: 'leaf',
              id: 'ti-naaa',
              name: 'NAAA',
              path: '/admin/offices?type=naaa'
            },
            {
              type: 'leaf',
              id: 'ti-ical',
              name: 'iCAL',
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
      children: [
        {
          type: 'leaf',
          id: 'gr-intl-bodies',
          name: 'International Bodies',
          path: '/admin/global?tab=international'
        },
        {
          type: 'leaf',
          id: 'gr-bilateral',
          name: 'Bilateral Relations',
          path: '/admin/global?tab=bilateral'
        },
        {
          type: 'leaf',
          id: 'gr-audit-engagements',
          name: 'Audit Engagements',
          path: '/admin/global?tab=engagements'
        },
        {
          type: 'leaf',
          id: 'gr-relations-wing',
          name: 'Relations Wing',
          path: '/admin/global?tab=wing'
        }
      ]
    },
    {
      type: 'leaf',
      id: 'resources',
      name: 'Resources',
      path: '/admin/circulars'
    },
    {
      type: 'leaf',
      id: 'careers-engagement',
      name: 'Careers & Engagement',
      path: '/admin/about?tab=recruitment'
    },
    {
      type: 'leaf',
      id: 'about-us',
      name: 'About Us',
      path: '/admin/about'
    },
    {
      type: 'leaf',
      id: 'news-events',
      name: 'News & Events',
      path: '/admin/news'
    },
    {
      type: 'leaf',
      id: 'contact',
      name: 'Contact',
      path: '/admin/site-settings?tab=contact'
    }
  ];

  // State to track expanded submenus
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'reports': true,
    'our-presence': false,
    'state-level-offices': false,
    'central-audit-offices': false,
    'training-institutes': false,
    'global-relations': false
  });

  // Auto-expand submenus based on active route
  useEffect(() => {
    const newExpanded = { ...expanded };

    if (
      pathname === '/admin/reports' || 
      pathname === '/admin/accounts' || 
      pathname === '/admin/state-accounts' || 
      pathname === '/admin/combined-accounts'
    ) {
      newExpanded['reports'] = true;
    } else if (pathname === '/admin/offices') {
      newExpanded['our-presence'] = true;
      const type = searchParams.get('type');
      if (type === 'ae' || type === 'audit') {
        newExpanded['state-level-offices'] = true;
      } else if (['defence', 'railway', 'ministries', 'overseas'].includes(type || '')) {
        newExpanded['central-audit-offices'] = true;
      } else if (['rti', 'iced', 'icisa', 'naaa', 'ical'].includes(type || '')) {
        newExpanded['training-institutes'] = true;
      }
    } else if (pathname === '/admin/global') {
      newExpanded['global-relations'] = true;
    }

    setExpanded(newExpanded);
  }, [pathname, searchParams]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Check active state
  const checkIsActive = (targetPath: string) => {
    if (targetPath.includes('?')) {
      const [pathBase, queryString] = targetPath.split('?');
      if (pathname !== pathBase) return false;
      const targetParams = new URLSearchParams(queryString);
      let matches = true;
      targetParams.forEach((val, key) => {
        if (searchParams.get(key) !== val) matches = false;
      });
      return matches;
    }

    if (targetPath === '/admin/accounts') {
      if (pathname !== '/admin/accounts') return false;
      const sub = searchParams.get('subtopic');
      return !sub || sub === 'all';
    }

    return pathname === targetPath;
  };

  // Render Leaf Navigation Item
  const renderLeaf = (leaf: LeafItem, depth: number = 0) => {
    const isActive = checkIsActive(leaf.path);

    // Precise font colors based on depth
    const inactiveColor = depth >= 2 ? '#D9BFC9' : '#E2CCD5'; // Soft rose-tinted white for nested leaf items
    const fontSize = depth >= 2 ? '13px' : '13.5px';

    return (
      <div key={leaf.id} className="w-full">
        <Link
          href={leaf.path}
          target={leaf.isExternal ? '_blank' : '_self'}
          className={`flex items-center justify-between w-full transition-all duration-150 text-left ${
            isActive
              ? 'bg-white/20 text-white font-semibold shadow-xs rounded-[8px] px-3.5 py-2'
              : 'px-3.5 py-1.5 hover:text-white hover:bg-white/10 rounded-[6px]'
          }`}
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: fontSize,
            lineHeight: '1.4',
            letterSpacing: '0.01em',
            color: isActive ? '#FFFFFF' : inactiveColor,
            fontWeight: isActive ? 600 : 400,
          }}
        >
          <span className="truncate">{leaf.name}</span>
        </Link>
      </div>
    );
  };

  // Render Submenu Header and its nested children with the exact Figma vertical line & dropdown styling
  const renderSubMenu = (sub: SubMenuItem, depth: number = 0) => {
    const isOpen = !!expanded[sub.id];

    // Typography & colors based on hierarchy level (Main Title vs Dropdown vs Sub-Dropdown)
    const isMainTitle = depth === 0;
    const isDropdown = depth === 1;
    
    const textColor = isMainTitle 
      ? '#FFFFFF' 
      : isDropdown 
      ? '#F1E3E8' 
      : '#E5D2DC'; // Sub-dropdown

    const fontSize = isMainTitle 
      ? '14.5px' 
      : isDropdown 
      ? '14px' 
      : '13.5px';

    const fontWeight = isMainTitle ? 600 : 500;

    return (
      <div key={sub.id} className="w-full flex flex-col">
        {/* Accordion Dropdown Trigger */}
        <button
          type="button"
          onClick={() => toggleExpand(sub.id)}
          className={`flex items-center justify-between w-full rounded-[6px] text-left transition-colors cursor-pointer group select-none hover:bg-white/10 ${
            isMainTitle ? 'py-2 px-3' : 'py-1.5 px-3'
          }`}
          style={{
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: fontSize,
            fontWeight: fontWeight,
            letterSpacing: '0.01em',
            color: textColor
          }}
        >
          <span className="truncate">{sub.name}</span>
          <ChevronIcon isOpen={isOpen} depth={depth} />
        </button>

        {/* Nested Dropdown Container with Vertical Guide Line */}
        {isOpen && (
          <div className="border-l border-white/20 ml-3 pl-2.5 flex flex-col gap-1 w-full my-1">
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
        width: '280px',
        minWidth: '280px',
        maxWidth: '280px',
        padding: '16px 12px',
        background: 'rgba(117, 22, 57, 1)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#FFFFFF'
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-white/15 w-full shrink-0 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[6px] bg-white flex items-center justify-center text-xs text-[#751639] font-black shadow-xs tracking-tight">
            CAG
          </div>
          <div>
            <span 
              className="text-[13px] uppercase tracking-wider font-bold block leading-none text-white"
            >
              SUPER ADMIN
            </span>
            <span 
              className="text-[10px] block font-normal text-white/70 mt-0.5 leading-none"
            >
              Management Portal
            </span>
          </div>
        </div>
        <span 
          className="px-2 py-0.5 text-[9.5px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full"
        >
          Live
        </span>
      </div>

      {/* Main Navigation Tree - Scrollable with Styled Themed Scrollbar */}
      <nav className="flex-1 overflow-y-auto overscroll-contain py-1 space-y-0.5 w-full pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map(item => {
          if (item.type === 'leaf') {
            return renderLeaf(item, 0);
          }
          return renderSubMenu(item, 0);
        })}
      </nav>

      {/* Bottom Info Footer */}
      <div 
        className="pt-2.5 border-t border-white/15 text-[10.5px] flex justify-between items-center w-full shrink-0 mt-auto px-1 text-white/70"
      >
        <span>Admin Suite v2.0</span>
        <span>Article 148–151</span>
      </div>
    </aside>
  );
}
