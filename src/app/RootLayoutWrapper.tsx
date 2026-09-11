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
  const showGlobalBreadcrumbWrapper =
    !isHome &&
    !isReports &&
    !pathname?.toLowerCase().includes('global-relations');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header />
        {showGlobalBreadcrumbWrapper && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb />
          </div>
        )}
        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
