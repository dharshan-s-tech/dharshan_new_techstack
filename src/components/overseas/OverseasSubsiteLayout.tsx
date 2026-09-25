'use client';

import React from 'react';
import OverseasSubsiteHeader from './OverseasSubsiteHeader';
import OverseasSubsiteFooter from './OverseasSubsiteFooter';

interface OverseasSubsiteLayoutProps {
  officeId: 'kul' | 'ldn' | 'wdc';
  lang?: string;
  subsiteData?: any;
  children: React.ReactNode;
}

export default function OverseasSubsiteLayout({
  officeId,
  lang = 'en',
  subsiteData,
  children,
}: OverseasSubsiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
      <OverseasSubsiteHeader officeId={officeId} lang={lang} subsiteData={subsiteData} />
      <div className="flex-1 w-full">
        {children}
      </div>
      <OverseasSubsiteFooter officeId={officeId} lang={lang} subsiteData={subsiteData} />
    </div>
  );
}
