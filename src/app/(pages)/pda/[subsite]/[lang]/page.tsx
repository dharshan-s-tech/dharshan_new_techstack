import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { OVERSEAS_OFFICES } from '@/data/overseas/overseasOffices';
import OverseasSubsiteLayout from '@/components/overseas/OverseasSubsiteLayout';
import OverseasHeroBanner from '@/components/overseas/OverseasHeroBanner';

import { api } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subsite: string; lang: string }>;
}): Promise<Metadata> {
  const { subsite, lang } = await params;
  const officeKey = (subsite.toLowerCase() as 'kul' | 'ldn' | 'wdc') in OVERSEAS_OFFICES
    ? (subsite.toLowerCase() as 'kul' | 'ldn' | 'wdc')
    : 'ldn';
  const subsiteData = await api.getOverseasSubsite(officeKey, lang);
  const office = subsiteData || OVERSEAS_OFFICES[officeKey];

  return {
    title: `${office.title} | Comptroller and Auditor General of India`,
    description: (office as any).jurisdiction || office.title,
  };
}

export default async function PdaSubsiteHomePage({
  params,
}: {
  params: Promise<{ subsite: string; lang: string }>;
}) {
  const { subsite, lang } = await params;
  const isHi = lang === 'hi';
  const officeKey = (subsite.toLowerCase() as 'kul' | 'ldn' | 'wdc') in OVERSEAS_OFFICES
    ? (subsite.toLowerCase() as 'kul' | 'ldn' | 'wdc')
    : 'ldn';

  // 1. Fetch live subsite data directly from the PostgreSQL Database via backend API
  const subsiteData = await api.getOverseasSubsite(officeKey, lang);
  const office = subsiteData || OVERSEAS_OFFICES[officeKey];

  return (
    <OverseasSubsiteLayout officeId={officeKey} lang={lang} subsiteData={subsiteData}>
      {/* 1. Hero Banner with Dark Gradient, Meeting Room Photo, CTAs and Floating Link */}
      <OverseasHeroBanner officeId={officeKey} lang={lang} />

      {/* 2. Middle Section: Office Title, Address & 3 Contact Cards */}
      <section
        className="w-full py-16 px-4 sm:px-8 lg:px-16"
        style={{
          background:
            'linear-gradient(54.83deg, rgba(29, 46, 107, 0.05) -17.9%, rgba(255, 255, 255, 0.35) 42.97%, rgba(29, 46, 107, 0.05) 116.79%)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header: Office of Principal Director of Audit */}
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h2 className="text-[28px] sm:text-[32px] font-['Noto_Sans',sans-serif] font-bold text-[#2A2A2A] leading-[44px]">
              {isHi ? ((office as any).title_hi || (office as any).titleHi) : office.title}
            </h2>
            <p className="text-[15px] sm:text-[16px] font-['Noto_Sans',sans-serif] font-normal text-[#565656] leading-[30px] mt-2">
              {isHi ? ((office as any).address_hi || (office as any).addressHi) : office.address}
            </p>
          </div>

          {/* 3 Floating Contact Cards (width: 416px, height: 155px, shadow 0px 0px 20px rgba(0,0,0,0.09)) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Card 1: Working Hours */}
            <div className="bg-white rounded-[8px] p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center text-center gap-4 min-h-[155px] border border-slate-100 transition-all hover:shadow-lg">
              {/* Clock Icon (44px, #64B5F6) */}
              <div className="w-11 h-11 flex items-center justify-center text-[#64B5F6]">
                <svg className="w-11 h-11" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <circle cx="22" cy="22" r="18" />
                  <polyline points="22 12 22 22 16 22" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Text */}
              <div className="text-[18px] sm:text-[20px] lg:text-[22px] font-['Noto_Sans',sans-serif] font-bold text-[#2A2A2A] leading-[30px]">
                {isHi ? ((office as any).working_hours_hi || '09:00 AM - 5:30 PM (सोमवार-शुक्रवार)') : ((office as any).working_hours || '09:00 AM - 5:30 PM (Monday-Friday)')}
              </div>
            </div>

            {/* Card 2: Telephony */}
            <div className="bg-white rounded-[8px] p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center text-center gap-4 min-h-[155px] border border-slate-100 transition-all hover:shadow-lg">
              {/* Phone Icon (44px, #64B5F6) */}
              <div className="w-11 h-11 flex items-center justify-center text-[#64B5F6]">
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>

              {/* Text */}
              <a
                href={`tel:${(office.phone || '').replace(/[^0-9+]/g, '')}`}
                className="text-[18px] sm:text-[20px] lg:text-[22px] font-['Noto_Sans',sans-serif] font-bold text-[#2A2A2A] leading-[30px] hover:text-[#1D2E6B] transition-colors"
              >
                {office.phone}
              </a>
            </div>

            {/* Card 3: Email */}
            <div className="bg-white rounded-[8px] p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.09)] flex flex-col items-center justify-center text-center gap-4 min-h-[155px] border border-slate-100 transition-all hover:shadow-lg">
              {/* Mail Icon (46px, #64B5F6) */}
              <div className="w-11 h-11 flex items-center justify-center text-[#64B5F6]">
                <svg
                  className="w-11 h-11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              {/* Text */}
              <a
                href={`mailto:${office.email}`}
                className="text-[18px] sm:text-[20px] lg:text-[22px] font-['Noto_Sans',sans-serif] font-bold text-[#2A2A2A] leading-[30px] underline hover:text-[#1D2E6B] transition-colors break-all"
              >
                {office.email}
              </a>
            </div>
          </div>

          {/* 3. Centered Map Graphic (image 1669, 762px x 498px) */}
          <div className="mt-14 mb-6 flex justify-center">
            <div className="w-full max-w-[762px] bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden group">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  (office.title || '') + ' ' + (office.address || '')
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title={isHi ? 'गूगल मैप्स पर देखें' : 'Open in Google Maps'}
                className="block relative overflow-hidden"
              >
                <img
                  src="/assets/overseas/cag-office-map-hq.png"
                  alt="Comptroller and Auditor General Office Map"
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold text-slate-800 shadow flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>{isHi ? 'गूगल मैप्स खोलें' : 'View on Google Maps'}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </OverseasSubsiteLayout>
  );
}
