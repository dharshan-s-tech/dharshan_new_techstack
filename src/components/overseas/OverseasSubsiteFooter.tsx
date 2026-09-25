'use client';

import React from 'react';
import Link from 'next/link';
import { OVERSEAS_OFFICES } from '@/data/overseas/overseasOffices';

interface OverseasSubsiteFooterProps {
  officeId: 'kul' | 'ldn' | 'wdc';
  lang?: string;
  subsiteData?: any;
}

export default function OverseasSubsiteFooter({ officeId, lang = 'en', subsiteData }: OverseasSubsiteFooterProps) {
  const isHi = lang === 'hi';
  const office = subsiteData || OVERSEAS_OFFICES[officeId] || OVERSEAS_OFFICES.kul;
  const prefix = `/pda/${officeId}/${lang}`;
  const footerLinks: any[] = subsiteData?.menus?.footer?.length
    ? subsiteData.menus.footer
    : [
        { href: `${prefix}/page-pda-${officeId}-terms-conditions`, title: 'Copyright Policy', title_hi: 'कॉपीराइट नीति' },
        { href: `${prefix}/page-pda-${officeId}-contact-us`, title: 'Help', title_hi: 'सहायता' },
        { href: `${prefix}/page-pda-${officeId}-terms-conditions`, title: 'Hyperlinking Policy', title_hi: 'हाइपरलिंकिंग नीति' },
        { href: `${prefix}/page-pda-${officeId}-privacy-policy`, title: 'Privacy Policy', title_hi: 'गोपनीयता नीति' },
        { href: `${prefix}/page-pda-${officeId}-terms-conditions`, title: 'Terms & Conditions', title_hi: 'नियम एवं शर्तें' },
        { href: `${prefix}/archive`, title: 'Archive', title_hi: 'संग्रह' },
      ];

  return (
    <footer className="w-full">
      {/* Tier 1: Blue Footer Bar (#1D2E6B, 72px height) */}
      <div className="w-full bg-[#1D2E6B] min-h-[72px] py-4 px-4 sm:px-8 lg:px-16 flex items-center justify-center">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 lg:gap-x-10 gap-y-2 text-[14px] sm:text-[16px] font-['Noto_Sans',sans-serif] text-white">
          {footerLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href || '#'}
              className="hover:underline hover:text-amber-200 transition-colors"
            >
              {isHi ? (item.title_hi || item.titleHi || item.title) : (item.title_en || item.title)}
            </Link>
          ))}
        </nav>
      </div>


      {/* Tier 2: Dark Bottom Footer Bar (#2A2A2A, 40px height) */}
      <div className="w-full bg-[#2A2A2A] min-h-[40px] py-2.5 px-4 sm:px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-2 text-white text-[12px] sm:text-[14px] font-['Noto_Sans',sans-serif]">
        {/* Left: Content Ownership Notice */}
        <div className="text-center md:text-left text-white/90">
          <span>© Copyright 2026 - Content Owned by </span>
          <strong className="text-white font-bold">
            {isHi ? office.titleHi : office.title}
          </strong>
          <span>. All rights reserved.</span>
        </div>

        {/* Right: Last Updated Date */}
        <div className="text-center md:text-right text-white/90 whitespace-nowrap">
          <span>{isHi ? 'अंतिम अद्यतन: ' : 'Page last updated: '}</span>
          <strong className="text-white font-bold">27 Jul 2026</strong>
        </div>
      </div>
    </footer>
  );
}
