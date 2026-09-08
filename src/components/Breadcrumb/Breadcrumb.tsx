'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ROUTE_MAPPINGS: Record<string, string> = {
  '/About': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
  '/About/About-Us': '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
  '/About/Index-Menu-About': '/About/Index-Menu-About/Overview',
  '/About/Index-Menu-About/Global-relations': '/About/Index-Menu-About/Global-relations/Association with INTOSAI',
  '/Our-Presence': '/Our-Presence/Index-Menu/State-Level-Offices',
  '/Our-Presence/Index-Menu': '/Our-Presence/Index-Menu/State-Level-Offices',
};

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === '/' || pathname.toLowerCase().includes('global-relations')) return null;


  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="text-[12px] leading-[16px] font-['Noto_Sans',sans-serif] text-[#565656] flex items-center gap-[8px] h-[16px]">
      <Link href="/" className="text-[#565656] hover:text-[#751639] font-normal">Home</Link>
      {paths.map((path, idx) => {
        const url = `/${paths.slice(0, idx + 1).join('/')}`;
        const resolvedUrl = ROUTE_MAPPINGS[url] || url;
        const isLast = idx === paths.length - 1;
        let displayName = decodeURIComponent(path).replace(/-/g, ' ');
        if (displayName.toLowerCase() === 'cag of india') displayName = 'CAG of India';

        return (
          <React.Fragment key={path}>
            <svg className="w-[10px] h-[10px] text-[#565656] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {isLast ? (
              <span className="text-[#2e2e31] font-semibold">{displayName}</span>
            ) : (
              <Link href={resolvedUrl} className="text-[#565656] hover:text-[#751639] font-normal">{displayName}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
