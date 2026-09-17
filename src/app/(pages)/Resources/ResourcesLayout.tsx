'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourcesSidemenu from '@/Reusable components/Side Menu/Resources_sidemenu/ResourcesSidemenu';
import { dataManager } from '@/lib/dataManager';

interface ResourcesLayoutProps {
  categoryTitle?: string;
  categoryTitleHi?: string;
  pageTitle: string;
  pageTitleHi?: string;
  children: React.ReactNode;
}

export default function ResourcesLayout({
  categoryTitle = 'Resources',
  categoryTitleHi = 'संसाधन',
  pageTitle,
  pageTitleHi,
  children
}: ResourcesLayoutProps) {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] font-['Noto_Sans',sans-serif]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 py-6 md:py-8 space-y-6">
        
        {/* Breadcrumbs - Matching exact Figma specs */}
        <nav 
          aria-label="Breadcrumb"
          className="flex flex-row items-center gap-2 text-[12px] leading-[16px] text-[#565656]"
        >
          <Link href="/" className="hover:text-[#751639] transition-colors font-normal text-[#565656]">
            {isHindi ? 'होम' : 'Home'}
          </Link>
          
          {/* Chevron */}
          <span className="inline-flex items-center text-zinc-400" aria-hidden="true">
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L5 5L1 1" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>

          <Link href="/Resources" className="hover:text-[#751639] transition-colors font-normal text-[#565656]">
            {isHindi ? categoryTitleHi : categoryTitle}
          </Link>

          {pageTitle && (
            <>
              <span className="inline-flex items-center text-zinc-400" aria-hidden="true">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L5 5L1 1" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-semibold text-[#2E2E31]" aria-current="page">
                {isHindi && pageTitleHi ? pageTitleHi : pageTitle}
              </span>
            </>
          )}
        </nav>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          {/* Left Side Menu (310px) */}
          <ResourcesSidemenu />

          {/* Right Main Content Area (978px) */}
          <main className="w-full lg:max-w-[978px] flex-1 flex flex-col gap-6">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
