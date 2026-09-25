'use client';

import React from 'react';
import Link from 'next/link';

interface OverseasHeroBannerProps {
  officeId: 'kul' | 'ldn' | 'wdc';
  lang?: string;
}

export default function OverseasHeroBanner({ officeId, lang = 'en' }: OverseasHeroBannerProps) {
  const isHi = lang === 'hi';
  const prefix = `/pda/${officeId}/${lang}`;


  return (
    <section className="relative w-full h-[560px] overflow-hidden bg-[#090C1E]">
      {/* Background Image: High-res Executive Office Meeting Photo */}
      <div
        className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-[center_right] sm:bg-[right_10%_center]"
        style={{
          backgroundImage: "url('/assets/overseas/hero-banner-clean.png')",
        }}
      />

      {/* Dark Multi-stop Gradient Overlay matching Figma:
          linear-gradient(270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.01) 20%, rgba(9, 12, 30, 0.7) 50%, #090C1E 100%) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'linear-gradient(270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.05) 25%, rgba(9, 12, 30, 0.75) 50%, rgba(9, 12, 30, 0.95) 75%, #090C1E 100%)',
        }}
      />

      {/* Hero Content Frame (Banner Info) */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 sm:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-[580px] space-y-4">
          {/* Gold Accent Line (width: 93px, border: 2px solid #FFCE7B) */}
          <div className="w-[93px] h-[3px] bg-[#FFCE7B] rounded-full mb-3" />

          {/* Subtitle ("Ensuring") */}
          <div className="text-[20px] sm:text-[24px] font-['Noto_Sans',sans-serif] font-normal tracking-[1px] text-[#FEFEFE]">
            {isHi ? 'सुनिश्चित करते हुए' : 'Ensuring'}
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-['Noto_Sans',sans-serif] font-bold text-[#FEFEFE] leading-[1.25] tracking-tight">
            <span>{isHi ? 'पारदर्शिता, सत्यनिष्ठा एवं ' : 'Transparency, Integrity & '}</span>
            <span className="text-[#FFCE7B] block sm:inline">
              {isHi ? 'जवाबदेही' : 'Accountability'}
            </span>
          </h1>

          {/* Paragraph Description */}
          <p className="text-[16px] sm:text-[18px] font-['Noto_Sans',sans-serif] font-normal leading-[28px] sm:leading-[32px] text-[#FEFEFE]/90 pt-1 pb-2">
            {isHi
              ? 'भारत की सर्वोच्च लेखापरीक्षा संस्था से लेखापरीक्षा रिपोर्ट, लेखे और संस्थागत संसाधनों तक पहुंच प्राप्त करें।'
              : "Access audit reports, accounts, and institutional resources from India's Supreme Audit Institution."}
          </p>

          {/* CTAs (Buttons) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            {/* Primary Button: Explore Reports (#FFFFFF, text #1D2E6B, rounded 8px) */}
            <Link
              href={`${prefix}/page-pda-${officeId}-audit-jurisdiction`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-[8px] bg-white hover:bg-slate-100 text-[#1D2E6B] font-['Noto_Sans',sans-serif] font-medium text-[16px] shadow transition-all hover:scale-105"
            >
              {isHi ? 'रिपोर्ट देखें' : 'Explore Reports'}
            </Link>

            {/* Secondary Button: Learn about CAG (border 1px solid #FFFFFF, text #FFFFFF) */}
            <Link
              href={`${prefix}/page-pda-${officeId}-about-us`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-[8px] border border-white hover:bg-white/10 text-white font-['Noto_Sans',sans-serif] font-medium text-[16px] transition-all hover:scale-105"
            >
              {isHi ? 'सीएजी के बारे में जानें' : 'Learn about CAG'}
            </Link>
          </div>

          {/* Carousel Indicators (Bottom-left: 4 horizontal bars) */}
          <div className="pt-8 sm:pt-10 flex items-center gap-2">
            {/* Line 1 (Active, #1D2E6B, 6px height) */}
            <div className="w-[50px] h-[6px] bg-[#1D2E6B] rounded-full" />
            {/* Line 2 (#B1B1B1, 3px height) */}
            <div className="w-[50px] h-[3px] bg-[#B1B1B1] rounded-full" />
            {/* Line 3 (#FFFFFF, 3px height) */}
            <div className="w-[50px] h-[3px] bg-white rounded-full opacity-80" />
            {/* Line 4 (#FFFFFF, 3px height) */}
            <div className="w-[50px] h-[3px] bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>

      {/* Bottom Right Gray Dock Bar (Rectangle 34625654, width: 432px, height: 52px, bg: #5B5C5F) */}
      <div className="hidden lg:block absolute right-0 bottom-0 w-[360px] xl:w-[432px] h-[52px] bg-[#5B5C5F]/90 rounded-tl-[10px] pointer-events-none z-10" />

      {/* Floating Quick Link Circular Button (width: 80px, height: 80px, bg: #FFCE7B) */}
      <div className="hidden sm:flex absolute right-8 sm:right-16 lg:right-24 bottom-3 sm:bottom-4 z-20">
        <Link
          href={`${prefix}/page-pda-${officeId}-contact-us`}
          title={isHi ? 'त्वरित संपर्क' : 'Chancery Quick Links & Contact'}
          className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] bg-[#FFCE7B] hover:bg-[#fed28b] border border-[#797979] rounded-full shadow-[4px_4px_20px_10px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        >
          {/* Chain Link Vector Icon (#000000) */}
          <svg
            className="w-8 h-8 sm:w-9 sm:h-9 text-black transition-transform group-hover:rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
