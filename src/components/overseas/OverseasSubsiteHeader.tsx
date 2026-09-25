'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OVERSEAS_OFFICES } from '@/data/overseas/overseasOffices';
import { getOverseasNav, NavItem } from '@/data/overseas/overseasNav';
import { api } from '@/lib/api';

interface OverseasSubsiteHeaderProps {
  officeId: 'kul' | 'ldn' | 'wdc';
  lang?: string;
  subsiteData?: any;
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

export default function OverseasSubsiteHeader({
  officeId,
  lang = 'en',
  subsiteData,
  onLanguageChange,
}: OverseasSubsiteHeaderProps) {
  const isHi = lang === 'hi';
  const router = useRouter();

  const [dbSubsite, setDbSubsite] = useState<any>(subsiteData || null);

  useEffect(() => {
    if (subsiteData) {
      setDbSubsite(subsiteData);
    } else {
      api.getOverseasSubsite(officeId, lang).then((data) => {
        if (data) setDbSubsite(data);
      }).catch(() => {});
    }
  }, [officeId, lang, subsiteData]);

  const office = dbSubsite || OVERSEAS_OFFICES[officeId] || OVERSEAS_OFFICES.kul;
  const navItems: any[] = dbSubsite?.menus?.main?.length
    ? dbSubsite.menus.main
    : getOverseasNav(officeId, lang);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuId: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveMenu(menuId);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleLanguageSwitch = (targetLang: 'en' | 'hi') => {
    setLangDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(targetLang);
    } else {
      router.push(`/pda/${officeId}/${targetLang}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pda/${officeId}/${lang}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('larger');
    else setFontSize('normal');
  };

  return (
    <header className="w-full bg-white relative z-50">
      {/* 1. Top Utility Header Bar (#1D2E6B, 40px height) */}
      <div className="w-full bg-[#1D2E6B] text-white min-h-[40px] px-4 sm:px-8 lg:px-16 flex items-center justify-between">
        {/* Office Title on Left */}
        <div className="flex items-center space-x-2 py-1.5">
          <span className="text-[11px] font-normal tracking-wide text-white font-['Noto_Sans',sans-serif]">
            {isHi ? office.titleHi : office.title}
          </span>
        </div>

        {/* Utility Gateways & Tools on Right */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-[10px] sm:text-[11px] font-['Noto_Sans',sans-serif] text-white">
          <Link
            href="https://cag.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all hidden sm:inline"
          >
            {isHi ? 'नॉलेज हब' : 'Knowledge Hub'}
          </Link>
          <span className="text-white/40 hidden sm:inline">|</span>

          <Link
            href="https://cag.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-all hidden sm:inline"
          >
            {isHi ? 'कर्मचारी पोर्टल' : 'Employee Portal'}
          </Link>
          <span className="text-white/40 hidden sm:inline">|</span>

          <Link
            href={`/pda/${officeId}/${lang}/page-pda-${officeId}-list-of-holidays`}
            className="hover:underline transition-all hidden md:inline"
          >
            {isHi ? 'समाचार एवं कार्यक्रम' : 'News & Events'}
          </Link>
          <span className="text-white/40 hidden md:inline">|</span>

          <Link
            href={`/pda/${officeId}/${lang}/page-pda-${officeId}-contact-us`}
            className="hover:underline transition-all"
          >
            {isHi ? 'संपर्क करें' : 'Contact'}
          </Link>

          {/* Accessibility Font Size Toggle: [A ▾] */}
          <button
            onClick={toggleFontSize}
            title={isHi ? 'फ़ॉन्ट आकार बदलें' : 'Adjust Font Size'}
            className="w-6 h-6 border border-white/50 hover:border-white rounded-[2px] flex items-center justify-center text-[12px] font-medium text-white transition-colors"
          >
            A
          </button>

          {/* Language Selector: [English ▾] */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1 text-[12px] text-white hover:text-amber-200 transition-colors py-1"
            >
              <span>{isHi ? 'हिन्दी' : 'English'}</span>
              <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white text-slate-800 rounded shadow-lg border border-slate-200 py-1 min-w-[100px] z-50">
                <button
                  onClick={() => handleLanguageSwitch('en')}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 ${!isHi ? 'font-bold text-[#1D2E6B]' : 'text-slate-700'}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageSwitch('hi')}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 ${isHi ? 'font-bold text-[#1D2E6B]' : 'text-slate-700'}`}
                >
                  हिन्दी
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (#FFFFFF, 80px height, border-b #D7D7D7) */}
      <nav className="w-full bg-white border-b border-[#D7D7D7] min-h-[80px] px-4 sm:px-8 lg:px-16 flex items-center justify-between">
        {/* Left: Official CAG National Emblem Logo */}
        <div className="flex-shrink-0 flex items-center py-1">
          <Link href={`/pda/${officeId}/${lang}`} className="flex items-center">
            <img
              src="/CAG-01.png"
              alt="Comptroller and Auditor General of India"
              className="h-16 sm:h-[72px] w-auto object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.src.includes('/assets/')) {
                  img.src = '/assets/CAG-01.png';
                }
              }}
            />
          </Link>
        </div>

        {/* Center: Preserved Overseas Menu Topics */}
        <div className="hidden lg:flex items-center justify-center flex-1 px-4">
          <ul className="flex items-center space-x-1 xl:space-x-3 text-[14px] font-['Noto_Sans',sans-serif]">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = activeMenu === item.id;

              return (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href || '#'}
                    className={`inline-flex items-center px-2 py-6 text-[14px] transition-colors ${
                      isOpen
                        ? 'text-[#1D2E6B] font-semibold'
                        : 'text-[#4D4D4D] hover:text-[#1D2E6B]'
                    }`}
                  >
                    <span>{isHi ? (item.title_hi || item.titleHi || item.title) : (item.title_en || item.title)}</span>
                    {hasChildren && (
                      <svg
                        className={`w-2.5 h-2.5 ml-1 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#1D2E6B]' : 'text-[#4D4D4D]'
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasChildren && isOpen && (
                    <div className="absolute left-0 top-full w-64 bg-white text-slate-800 shadow-xl rounded-b-md border border-slate-200 overflow-hidden z-50">
                      <div className="py-2">
                        {item.children?.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={sub.href || '#'}
                            className="block px-4 py-2.5 text-[13px] text-[#4D4D4D] hover:bg-slate-50 hover:text-[#1D2E6B] hover:font-medium transition-colors"
                            onClick={() => setActiveMenu(null)}
                          >
                            {isHi ? (sub.title_hi || sub.titleHi || sub.title) : (sub.title_en || sub.title)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Search Box (220px x 32px, border #D7D7D7, rounded 4px) */}
        <div className="flex items-center space-x-3">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#1D2E6B]"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center w-[180px] md:w-[220px] h-[32px] border border-[#D7D7D7] rounded-[4px] px-2.5 bg-white transition-all focus-within:border-[#1D2E6B]"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'खोजें...' : 'Search'}
              className="w-full text-[14px] text-[#2A2A2A] placeholder-[#717171] bg-transparent outline-none font-['Noto_Sans',sans-serif]"
            />
            <button type="submit" className="text-[#4D4D4D] hover:text-[#1D2E6B] ml-1 flex-shrink-0" aria-label="Search">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="mb-3 flex items-center h-9 border border-[#D7D7D7] rounded px-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? 'खोजें...' : 'Search'}
              className="w-full text-sm outline-none"
            />
            <button type="submit" className="text-slate-600">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>

          <div className="space-y-1 divide-y divide-slate-100">
            {navItems.map((item: any) => (
              <div key={item.id} className="pt-2">
                <Link
                  href={item.href || '#'}
                  className="block text-[#2A2A2A] font-medium py-1.5 hover:text-[#1D2E6B]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isHi ? (item.title_hi || item.titleHi || item.title) : (item.title_en || item.title)}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2 space-y-1">
                    {item.children.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={sub.href || '#'}
                        className="block text-xs text-[#565656] py-1 hover:text-[#1D2E6B]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {isHi ? (sub.title_hi || sub.titleHi || sub.title) : (sub.title_en || sub.title)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
