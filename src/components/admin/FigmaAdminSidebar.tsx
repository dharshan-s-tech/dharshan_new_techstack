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

// Crisp Chevron component matching Figma vector (16x16, stroke 2)
const ChevronIcon = ({ isOpen, strokeColor = '#FFFFFF' }: { isOpen: boolean; strokeColor?: string }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 18 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
  >
    <path 
      d="M4.5 6.75L9 11.25L13.5 6.75" 
      stroke={strokeColor} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default function FigmaAdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Clean navigation tree without excess sub-dropdowns, keeping rich filters on pages
  const menuItems: MenuItem[] = [
    {
      type: 'leaf',
      id: 'dashboard',
      name: 'Dashboard',
      path: '/admin'
    },
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
      id: 'tenders',
      name: 'Tenders & Notices',
      path: '/admin/tenders'
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
      id: 'shared-masters',
      name: 'Shared Masters',
      path: '/admin/masters'
    },
    {
      type: 'leaf',
      id: 'contact',
      name: 'Contact & Settings',
      path: '/admin/site-settings?tab=contact'
    },
    {
      type: 'submenu',
      id: 'user-management',
      name: 'User Management',
      children: [
        {
          type: 'leaf',
          id: 'um-roles',
          name: 'Roles',
          path: '/admin/users?tab=roles'
        },
        {
          type: 'leaf',
          id: 'um-wings',
          name: 'Wings',
          path: '/admin/users?tab=wings'
        },
        {
          type: 'leaf',
          id: 'um-users',
          name: 'Users',
          path: '/admin/users?tab=users'
        }
      ]
    }
  ];

  // State to track expanded submenus
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'reports': false,
    'our-presence': false,
    'state-level-offices': false,
    'central-audit-offices': false,
    'training-institutes': false,
    'global-relations': false,
    'user-management': true
  });

  // Auto-expand submenus when active route changes
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
    } else if (pathname === '/admin/users') {
      newExpanded['user-management'] = true;
    }

    setExpanded(newExpanded);
  }, [pathname, searchParams]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper to check active state accurately
  const checkIsActive = (targetPath: string) => {
    if (targetPath === '/admin/users?tab=users' || targetPath === '/admin/users') {
      if (pathname !== '/admin/users') return false;
      const tab = searchParams.get('tab');
      return !tab || tab === 'users';
    }

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

  // Helper to render leaf navigation items
  const renderLeaf = (leaf: LeafItem) => {
    const isActive = checkIsActive(leaf.path);

    return (
      <div key={leaf.id} className="w-full">
        <Link
          href={leaf.path}
          target={leaf.isExternal ? '_blank' : '_self'}
          className={`flex items-center justify-between w-full transition-all duration-150 ${
            isActive
              ? 'bg-white/20 shadow-[0px_1px_3px_rgba(0,0,0,0.2)] rounded-[8px] px-3.5 py-2.5 font-medium'
              : 'px-3.5 py-2 hover:bg-white/10 rounded-[8px]'
          }`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#FFFFFF'
          }}
        >
          <span className="truncate" style={{ color: '#FFFFFF' }}>{leaf.name}</span>
        </Link>
      </div>
    );
  };

  // Helper to render nested submenus (Level 0, Level 1, Level 2)
  const renderSubMenu = (sub: SubMenuItem) => {
    const isOpen = !!expanded[sub.id];

    return (
      <div key={sub.id} className="w-full flex flex-col gap-1">
        {/* Submenu Trigger Header */}
        <button
          type="button"
          onClick={() => toggleExpand(sub.id)}
          className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-[8px] text-left transition-colors cursor-pointer group hover:bg-white/10"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#FFFFFF'
          }}
        >
          <span className="truncate font-medium" style={{ color: '#FFFFFF' }}>
            {sub.name}
          </span>
          <ChevronIcon isOpen={isOpen} strokeColor="#FFFFFF" />
        </button>

        {/* Nested Submenu Children with Left Vertical Border Line */}
        {isOpen && (
          <div className="border-l border-white/40 ml-3.5 pl-2 py-1 flex flex-col gap-1.5 w-full">
            {sub.children.map(child => {
              if (child.type === 'leaf') {
                return renderLeaf(child);
              }
              return renderSubMenu(child);
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
        width: '320px',
        minWidth: '320px',
        maxWidth: '320px',
        padding: '20px 16px',
        background: '#751639',
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '100%',
        letterSpacing: '0%',
        color: '#FFFFFF'
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/20 w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-white flex items-center justify-center text-sm text-[#751639] font-black shadow-xs">
            CAG
          </div>
          <div>
            <span 
              className="text-[14px] uppercase tracking-wider font-bold block"
              style={{ fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
            >
              SUPER ADMIN
            </span>
            <span 
              className="text-[11px] block font-normal text-white/80"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Management Portal
            </span>
          </div>
        </div>
        <span 
          className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Live
        </span>
      </div>

      {/* Main Navigation Tree - Scrollable to End */}
      <nav className="flex-1 overflow-y-auto overscroll-contain py-3 space-y-1 w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map(item => {
          if (item.type === 'leaf') {
            return renderLeaf(item);
          }
          return renderSubMenu(item);
        })}
      </nav>

      {/* Bottom Info Footer */}
      <div 
        className="pt-3 border-t border-white/20 text-xs flex flex-col gap-1.5 w-full shrink-0 mt-auto"
        style={{ fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
      >
        <div className="flex justify-between items-center text-[11px]" style={{ color: '#FFFFFF' }}>
          <span style={{ color: '#FFFFFF' }}>Admin Suite v2.0</span>
          <span style={{ color: '#FFFFFF' }}>Article 148–151</span>
        </div>
      </div>
    </aside>
  );
}
