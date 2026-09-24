'use client';

import React, { useState } from 'react';
import StateSubsiteHeader from './StateSubsiteHeader';
import StateSubsiteFooter from './StateSubsiteFooter';
import StateSubsiteSidebar from './StateSubsiteSidebar';
import StateSubsiteBreadcrumbs from './StateSubsiteBreadcrumbs';
import { SubsitePageData } from '@/data/stateSubsites/andhraPradeshPages';
import PhotoContentTemplate from './templates/PhotoContentTemplate';
import DocumentListTemplate from './templates/DocumentListTemplate';
import ReportsGridTemplate from './templates/ReportsGridTemplate';
import GrievanceFormTemplate from './templates/GrievanceFormTemplate';

interface StateSubsiteLayoutProps {
  pageData: SubsitePageData;
  stateSlug?: string;
  prefix?: 'ae' | 'ag';
  officeLocation?: string;
  officeLocationHi?: string;
  logoUrl?: string;
}

export default function StateSubsiteLayout({
  pageData,
  stateSlug = 'andhra-pradesh',
  prefix = 'ae',
  officeLocation,
  officeLocationHi,
  logoUrl
}: StateSubsiteLayoutProps) {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  const isHindi = lang === 'हिन्दी';

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'English' ? 'हिन्दी' : 'English'));
  };

  const renderTemplate = () => {
    switch (pageData.templateType) {
      case 'photo-content':
        return <PhotoContentTemplate page={pageData} isHindi={isHindi} />;
      case 'document-list':
        return <DocumentListTemplate page={pageData} isHindi={isHindi} />;
      case 'reports-grid':
        return <ReportsGridTemplate page={pageData} isHindi={isHindi} />;
      case 'form':
        return <GrievanceFormTemplate isHindi={isHindi} />;
      default:
        return <PhotoContentTemplate page={pageData} isHindi={isHindi} />;
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F9FAFB] font-['Noto_Sans',sans-serif] text-[#2A2A2A] antialiased">
      {/* 1. Subsite Header */}
      <StateSubsiteHeader
        lang={lang}
        onToggleLanguage={toggleLanguage}
        stateSlug={stateSlug}
        prefix={prefix}
        officeLocation={officeLocation}
        officeLocationHi={officeLocationHi}
        logoUrl={logoUrl}
      />

      {/* 2. Breadcrumbs */}
      <StateSubsiteBreadcrumbs items={pageData.breadcrumbs} isHindi={isHindi} />

      {/* 3. Main Body Container */}
      <main className="w-full flex-1 max-w-[1440px] mx-auto py-8 px-4 lg:px-6">
        {pageData.templateType === 'reports-grid' ? (
          /* Reports Grid handles its own left filter sidebar */
          renderTemplate()
        ) : (
          /* 2-Column Layout: Left Contextual Sidebar + Right Template */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <StateSubsiteSidebar
              heading={pageData.sidebar.heading}
              headingHi={pageData.sidebar.headingHi}
              items={pageData.sidebar.items}
              isHindi={isHindi}
            />
            <div className="flex-1 w-full min-w-0">
              {renderTemplate()}
            </div>
          </div>
        )}
      </main>

      {/* 4. Subsite Footer */}
      <StateSubsiteFooter 
        isHindi={isHindi} 
        officeTitle={officeLocation ? `Principal Accountant General (A&E), ${officeLocation}` : undefined}
        officeTitleHi={officeLocationHi}
      />
    </div>
  );
}
