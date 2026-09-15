'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isStateSubsite = pathname?.startsWith('/states');

  if (isAdmin || isStateSubsite) {
    return <main className="min-h-screen bg-white">{children}</main>;
  }

  const isReports = pathname?.startsWith('/Reports');
  const isHome = pathname === '/' || pathname?.startsWith('/Home-page');
  const isOurPresence = pathname?.toLowerCase().includes('our-presence');
  const showGlobalBreadcrumbWrapper =
    !isHome &&
    !isReports &&
    !isOurPresence &&
    !pathname?.toLowerCase().includes('global-relations');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        {showGlobalBreadcrumbWrapper && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[64px] pt-6 pb-0">
            <Breadcrumb />
          </div>
        )}
        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
