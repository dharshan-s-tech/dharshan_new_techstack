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
  if (pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="text-xs font-sans text-[#565656] flex items-center gap-2">
      <Link href="/" className="text-[#565656] hover:text-[#0a3d30] font-normal">Home</Link>
      {paths.map((path, idx) => {
        const url = `/${paths.slice(0, idx + 1).join('/')}`;
        const resolvedUrl = ROUTE_MAPPINGS[url] || url;
        const isLast = idx === paths.length - 1;
        const displayName = decodeURIComponent(path).replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <span className="text-[#565656] font-normal">/</span>
            {isLast ? (
              <span className="capitalize text-[#2e2e31] font-semibold">{displayName}</span>
            ) : (
              <Link href={resolvedUrl} className="text-[#565656] hover:text-[#0a3d30] capitalize font-normal">{displayName}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
