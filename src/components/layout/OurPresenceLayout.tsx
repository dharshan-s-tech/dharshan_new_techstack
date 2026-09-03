'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarLink {
  name: string;
  href: string;
  filterKey?: string;
}

interface SidebarGroup {
  heading: string;
  links: SidebarLink[];
}

export default function OurPresenceLayout({ 
  title, 
  activeTab = '', 
  children 
}: { 
  title: string; 
  activeTab?: string; 
  children: React.ReactNode 
}) {
  const groups: SidebarGroup[] = [
    {
      heading: 'State-Level-Offices',
      links: [
        { name: 'State Account & Entitlement', href: '/Our-Presence/Index-Menu/State-Level-Offices?filter=ae', filterKey: 'ae' },
        { name: 'State Audit Offices', href: '/Our-Presence/Index-Menu/State-Level-Offices?filter=audit', filterKey: 'audit' }
      ]
    },
    {
      heading: 'Central-Audit-Offices',
      links: [
        { name: 'Defense', href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=defense', filterKey: 'defense' },
        { name: 'Railway', href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=railway', filterKey: 'railway' },
        { name: 'Other Ministries', href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=other', filterKey: 'other' },
        { name: 'Overseas', href: '/Our-Presence/Index-Menu/Central-Audit-Offices?filter=overseas', filterKey: 'overseas' }
      ]
    },
    {
      heading: 'Training Institutes',
      links: [
        { name: 'Regional Capacity Building', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=regional', filterKey: 'regional' },
        { name: 'iCED (Environment)', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=iced', filterKey: 'iced' },
        { name: 'iCISA (Info Systems)', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=icisa', filterKey: 'icisa' },
        { name: 'NAAA (National Academy)', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=naaa', filterKey: 'naaa' },
        { name: 'iCAL (Local Governance)', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=ical', filterKey: 'ical' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 op-page">
      <h1 className="page-heading op-page__title">{title}</h1>
      <div className="op-page__divider" aria-hidden="true"></div>
      
      <div className="about-layout flex flex-col lg:flex-row gap-8 items-start">
        <aside className="about-sidebar w-full lg:w-80 shrink-0">
          <div className="about-sidebar__divider" aria-hidden="true"></div>
          <div className="about-sidebar__menus" data-name="Menus">
            {groups.map((grp, idx) => (
              <div key={idx} data-name={grp.heading}>
                <p className="about-sidebar__group-heading text-left">{grp.heading}</p>
                <div className="about-sidebar__sublist" data-name="Sub Menus">
                  {grp.links.map((link) => {
                    const isTabActive = activeTab === link.filterKey;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`about-sidebar__link ${isTabActive ? 'about-sidebar__link--active' : ''}`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
        
        <main className="about-content flex-grow w-full bg-white border border-[#e6e6e6] rounded-xl p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
