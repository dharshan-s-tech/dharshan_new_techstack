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

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-200 text-white/90 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
  >
    <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FigmaAdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hierarchy matches Dashboard - Admin.png
  const menuItems: MenuItem[] = [
    {
      type: 'submenu',
      id: 'main-cag-website',
      name: 'Main CAG Website',
      children: [
        { type: 'leaf', id: 'homepage', name: 'Homepage', path: '/admin/banners' },
        {
          type: 'submenu',
          id: 'reports',
          name: 'Reports',
          children: [
            { type: 'leaf', id: 'rep-audit', name: 'Audit Reports', path: '/admin/reports' },
            { type: 'leaf', id: 'rep-accounts', name: 'Accounts Reports', path: '/admin/accounts' },
            { type: 'leaf', id: 'rep-state-acc', name: 'State & UT Accounts', path: '/admin/state-accounts' },
            { type: 'leaf', id: 'rep-comb-acc', name: 'Combined Accounts & Conf.', path: '/admin/combined-accounts' },
          ],
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
                  name: 'State Accounts & Entitlement Offices',
                  path: '/admin/offices?type=ae',
                },
                {
                  type: 'leaf',
                  id: 'state-audit-offices',
                  name: 'State Audit Offices',
                  path: '/admin/offices?type=audit',
                },
              ],
            },
            {
              type: 'submenu',
              id: 'central-audit-offices',
              name: 'Central Audit Offices',
              children: [
                { type: 'leaf', id: 'cao-defence', name: 'Defence', path: '/admin/offices?type=defence' },
                { type: 'leaf', id: 'cao-railway', name: 'Railway', path: '/admin/offices?type=railway' },
                { type: 'leaf', id: 'cao-other-ministries', name: 'Other Ministries', path: '/admin/offices?type=ministries' },
                { type: 'leaf', id: 'cao-overseas', name: 'Overseas', path: '/admin/offices?type=overseas' },
              ],
            },
            {
              type: 'submenu',
              id: 'training-institutes',
              name: 'Training Institutes',
              children: [
                { type: 'leaf', id: 'ti-regional', name: 'Regional Training Institutes', path: '/admin/offices?type=rti' },
                { type: 'leaf', id: 'ti-iced', name: 'iCED', path: '/admin/offices?type=iced' },
                { type: 'leaf', id: 'ti-icisa', name: 'iCISA', path: '/admin/offices?type=icisa' },
                { type: 'leaf', id: 'ti-naaa', name: 'NAAA', path: '/admin/offices?type=naaa' },
                { type: 'leaf', id: 'ti-ical', name: 'iCAL', path: '/admin/offices?type=ical' },
              ],
            },
          ],
        },
        {
          type: 'submenu',
          id: 'global-relations',
          name: 'Global Relations',
          children: [
            {
              type: 'submenu',
              id: 'gr-international-bodies',
              name: 'International Bodies',
              children: [
                {
                  type: 'leaf',
                  id: 'gr-intosai',
                  name: 'Association with INTOSAI',
                  path: '/admin/global-relations?slug=page-involvement-with-intosai',
                },
                {
                  type: 'leaf',
                  id: 'gr-asosai',
                  name: 'Association with ASOSAI',
                  path: '/admin/global-relations?slug=page-involvement-with-asosai',
                },
                {
                  type: 'leaf',
                  id: 'gr-multilateral',
                  name: 'Multilateral Engagement',
                  path: '/admin/global-relations?slug=page-global-audit-leadership-forum-and-other-multilateral-bodies',
                },
              ],
            },
            {
              type: 'submenu',
              id: 'gr-bilateral',
              name: 'Bilateral Relations',
              children: [
                {
                  type: 'leaf',
                  id: 'gr-bilateral-sai',
                  name: 'Bilateral Relations of SAI India',
                  path: '/admin/global-relations?slug=page-bilateral-relations-of-sai-india',
                },
              ],
            },
            {
              type: 'submenu',
              id: 'gr-audit-engagements',
              name: 'Audit Engagements',
              children: [
                {
                  type: 'leaf',
                  id: 'gr-un-panel',
                  name: 'UN Panel of External Auditors',
                  path: '/admin/global-relations?slug=page-un-panel-of-external-auditors',
                },
                {
                  type: 'leaf',
                  id: 'gr-present-audits',
                  name: 'Present International Audits',
                  path: '/admin/global-relations?slug=page-present-international-audits',
                },
                {
                  type: 'leaf',
                  id: 'gr-past-audits',
                  name: 'Past International Audits',
                  path: '/admin/global-relations?slug=page-past-international-audits',
                },
              ],
            },
          ],
        },
        { type: 'leaf', id: 'resources', name: 'Resources', path: '/admin/circulars' },
        { type: 'leaf', id: 'careers-engagement', name: 'Careers & Engagement', path: '/admin/about?tab=recruitment' },
        {
          type: 'submenu',
          id: 'about-us',
          name: 'About Us',
          children: [
            {
              type: 'submenu',
              id: 'about-who-we-are',
              name: 'Who We Are',
              children: [
                {
                  type: 'leaf',
                  id: 'about-cag-profile',
                  name: 'CAG of India Profile',
                  path: '/admin/about?category=Who%20We%20Are&topic=cag-of-india',
                },
                {
                  type: 'leaf',
                  id: 'about-vision',
                  name: 'Vision, Mission & Core Values',
                  path: '/admin/about?category=Who%20We%20Are&topic=our-vision-mission-values',
                },
                {
                  type: 'leaf',
                  id: 'about-org-chart',
                  name: 'Organisation Chart',
                  path: '/admin/about?category=Who%20We%20Are&topic=organisation-chart',
                },
              ],
            },
            {
              type: 'submenu',
              id: 'about-leadership',
              name: 'Leadership & Legacy',
              children: [
                {
                  type: 'leaf',
                  id: 'about-former-cags',
                  name: 'Former CAGs',
                  path: '/admin/about?category=Leadership%20%26%20Legacy&topic=former-cags',
                },
                {
                  type: 'leaf',
                  id: 'about-history',
                  name: 'History of IAAD',
                  path: '/admin/about?category=Leadership%20%26%20Legacy&topic=history-of-indian-audit-and-accounts-department',
                },
                {
                  type: 'leaf',
                  id: 'about-aab',
                  name: 'Audit Advisory Board',
                  path: '/admin/about?category=Leadership%20%26%20Legacy&topic=audit-advisory-board',
                },
              ],
            },
            {
              type: 'submenu',
              id: 'about-governance',
              name: 'Governance & Mandate',
              children: [
                {
                  type: 'leaf',
                  id: 'about-constitutional',
                  name: 'Constitutional Provisions',
                  path: '/admin/about?category=Governance%20%26%20Mandate&topic=constitutional-provisions',
                },
                {
                  type: 'leaf',
                  id: 'about-duties',
                  name: 'Duties & Powers Act',
                  path: '/admin/about?category=Governance%20%26%20Mandate&topic=duties-power-and-conditions-of-services-act',
                },
                {
                  type: 'leaf',
                  id: 'about-audit-reg',
                  name: 'Audit Regulation',
                  path: '/admin/about?category=Governance%20%26%20Mandate&topic=cag-audit-regulations',
                },
              ],
            },
          ],
        },
        { type: 'leaf', id: 'news-events', name: 'News & Events', path: '/admin/news' },
        { type: 'leaf', id: 'contact', name: 'Contact', path: '/admin/site-settings?tab=contact' },
      ],
    },
    {
      type: 'submenu',
      id: 'shared-content',
      name: 'Shared Content',
      children: [
        { type: 'leaf', id: 'masters', name: 'Masters / Lookups', path: '/admin/masters' },
        { type: 'leaf', id: 'banners-shared', name: 'Banners', path: '/admin/banners' },
        { type: 'leaf', id: 'tenders', name: 'Tenders', path: '/admin/tenders' },
      ],
    },
    {
      type: 'submenu',
      id: 'administration',
      name: 'Administration',
      children: [
        { type: 'leaf', id: 'um-users', name: 'Users', path: '/admin/users?tab=users' },
        { type: 'leaf', id: 'um-roles', name: 'Roles', path: '/admin/users?tab=roles' },
        { type: 'leaf', id: 'um-wings', name: 'Wings', path: '/admin/users?tab=wings' },
        { type: 'leaf', id: 'site-settings', name: 'Site Settings', path: '/admin/site-settings' },
      ],
    },
  ];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'main-cag-website': true,
    reports: true,
    'our-presence': false,
    'state-level-offices': false,
    'central-audit-offices': false,
    'training-institutes': false,
    'global-relations': false,
    'gr-international-bodies': false,
    'gr-bilateral': false,
    'gr-audit-engagements': false,
    'about-us': false,
    'about-who-we-are': false,
    'about-leadership': false,
    'about-governance': false,
    'shared-content': false,
    administration: false,
  });

  useEffect(() => {
    const next = { ...expanded, 'main-cag-website': true };

    if (
      pathname === '/admin/reports' ||
      pathname === '/admin/accounts' ||
      pathname === '/admin/state-accounts' ||
      pathname === '/admin/combined-accounts'
    ) {
      next.reports = true;
    } else if (pathname === '/admin/offices') {
      next['our-presence'] = true;
      const type = searchParams.get('type');
      if (type === 'ae' || type === 'audit') next['state-level-offices'] = true;
      else if (['defence', 'railway', 'ministries', 'overseas'].includes(type || '')) next['central-audit-offices'] = true;
      else if (['rti', 'iced', 'icisa', 'naaa', 'ical'].includes(type || '')) next['training-institutes'] = true;
    } else if (pathname === '/admin/global' || pathname === '/admin/global-relations') {
      next['global-relations'] = true;
      const slug = searchParams.get('slug') || '';
      if (slug.includes('intosai') || slug.includes('asosai') || slug.includes('multilateral') || slug.includes('leadership-forum')) {
        next['gr-international-bodies'] = true;
      } else if (slug.includes('bilateral')) {
        next['gr-bilateral'] = true;
      } else if (slug.includes('un-panel') || slug.includes('international-audits')) {
        next['gr-audit-engagements'] = true;
      } else {
        next['gr-international-bodies'] = true;
      }
    } else if (pathname === '/admin/about') {
      next['about-us'] = true;
      const category = decodeURIComponent(searchParams.get('category') || '');
      if (category.includes('Who We Are')) next['about-who-we-are'] = true;
      else if (category.includes('Leadership')) next['about-leadership'] = true;
      else if (category.includes('Governance')) next['about-governance'] = true;
      else next['about-who-we-are'] = true;
    } else if (pathname === '/admin/users' || pathname === '/admin/site-settings') {
      next.administration = true;
    } else if (pathname === '/admin/masters' || pathname === '/admin/tenders') {
      next['shared-content'] = true;
    }

    setExpanded(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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
        if (pathname === '/admin/about' && key === 'category') {
          if (decodeURIComponent(currentVal || '') !== decodeURIComponent(val)) matches = false;
          return;
        }
        if (currentVal !== val) matches = false;
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

  const renderLeaf = (leaf: LeafItem, depth = 0) => {
    const isActive = checkIsActive(leaf.path);
    return (
      <div key={leaf.id} className="w-full">
        <Link
          href={leaf.path}
          target={leaf.isExternal ? '_blank' : '_self'}
          className={`flex items-center w-full text-left transition-all duration-150 truncate ${
            isActive
              ? 'bg-white/15 border border-white/80 text-white font-semibold rounded-lg px-3 py-1.5'
              : 'px-3 py-1.5 text-white/85 hover:text-white hover:bg-white/10 rounded-lg border border-transparent'
          }`}
          style={{
            fontSize: depth >= 2 ? '12.5px' : '13px',
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {leaf.name}
        </Link>
      </div>
    );
  };

  const renderSubMenu = (sub: SubMenuItem, depth = 0) => {
    const isOpen = !!expanded[sub.id];
    const isTop = depth === 0;

    return (
      <div key={sub.id} className="w-full flex flex-col">
        <button
          type="button"
          onClick={() => toggleExpand(sub.id)}
          className={`flex items-center justify-between w-full rounded-lg text-left transition-colors cursor-pointer hover:bg-white/10 ${
            isTop ? 'py-2 px-3' : 'py-1.5 px-3'
          }`}
          style={{
            fontSize: isTop ? '13.5px' : '13px',
            fontWeight: isTop ? 600 : 500,
            color: '#FFFFFF',
          }}
        >
          <span className="truncate">{sub.name}</span>
          <ChevronIcon isOpen={isOpen} />
        </button>

        {isOpen && (
          <div className="border-l border-white/25 ml-3 pl-2.5 flex flex-col gap-0.5 my-1">
            {sub.children.map((child) =>
              child.type === 'leaf' ? renderLeaf(child, depth + 1) : renderSubMenu(child, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className="h-full max-h-full flex flex-col flex-shrink-0 select-none overflow-hidden"
      style={{
        width: '280px',
        minWidth: '280px',
        maxWidth: '280px',
        padding: '14px 10px 12px',
        background: '#751639',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#FFFFFF',
      }}
    >
      <nav className="flex-1 overflow-y-auto overscroll-contain py-1 space-y-1 w-full pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map((item) => (item.type === 'leaf' ? renderLeaf(item, 0) : renderSubMenu(item, 0)))}
      </nav>
    </aside>
  );
}
