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
      heading: 'State Level Offices',
      links: [
        { name: 'State Account & Entitlement', href: '/Our-Presence/Index-Menu/State-Level-Offices?filter=ae', filterKey: 'ae' },
        { name: 'State Audit Offices', href: '/Our-Presence/Index-Menu/State-Level-Offices?filter=audit', filterKey: 'audit' }
      ]
    },
    {
      heading: 'Central Audit Offices',
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
        { name: 'Regional Capacity Building and Knowledge Institutes...', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=regional', filterKey: 'regional' },
        { name: 'International Centre for Environment Audit and...', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=iced', filterKey: 'iced' },
        { name: 'International Centre for Information Systems and Audit...', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=icisa', filterKey: 'icisa' },
        { name: 'National Academy of Audit &Accounts (NAAA)', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=naaa', filterKey: 'naaa' },
        { name: 'Centre for Data Management and Analytics (CDMA)...', href: '/Our-Presence/Index-Menu/Traning-Institutes?filter=cdma', filterKey: 'cdma' }
      ]
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 op-page">
      <div className="about-layout flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Menu */}
        <aside className="about-sidebar w-full lg:w-[260px] shrink-0">
          <div className="about-sidebar__menus" data-name="Menus">
            {groups.map((grp, idx) => (
              <div key={idx} data-name={grp.heading} className="mb-4">
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
        
        {/* Main Content Area */}
        <main className="about-content flex-grow w-full min-w-0">
          <h1 className="text-2xl font-bold text-[#000000] text-left mb-3 font-sans tracking-tight">{title}</h1>
          <div className="w-full h-[1px] bg-[#EFEFEF] mb-6" aria-hidden="true"></div>
          {children}
        </main>
      </div>
    </div>
  );
}
