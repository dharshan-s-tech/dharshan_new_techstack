'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FigmaAdminSidebar from '@/components/admin/FigmaAdminSidebar';
import { dataManager } from '@/lib/dataManager';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Language switcher state
  const [language, setLanguage] = useState<'English' | 'हिन्दी'>('English');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes session timeout

  useEffect(() => {
    // Initialize language from dataManager
    setLanguage(dataManager.getLanguage());

    const handleLanguageChange = () => {
      setLanguage(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('cag_admin_token');
    if (!token) {
      setAuthorized(false);
      setLoading(false);
      router.push('/admin/login');
      return;
    }

    if (!localStorage.getItem('cag_admin_last_activity')) {
      localStorage.setItem('cag_admin_last_activity', Date.now().toString());
    }

    setAuthorized(true);
    setLoading(false);

    const checkSessionExpiry = () => {
      const currentToken = localStorage.getItem('cag_admin_token');
      const lastActivityStr = localStorage.getItem('cag_admin_last_activity');

      if (!currentToken) {
        setAuthorized(false);
        router.push('/admin/login');
        return;
      }

      if (lastActivityStr) {
        const elapsed = Date.now() - parseInt(lastActivityStr, 10);
        if (elapsed >= SESSION_TIMEOUT_MS) {
          localStorage.removeItem('cag_admin_token');
          localStorage.removeItem('cag_admin_last_activity');
          setAuthorized(false);
          router.push('/admin/login');
        }
      }
    };

    const updateActivity = () => {
      if (localStorage.getItem('cag_admin_token')) {
        localStorage.setItem('cag_admin_last_activity', Date.now().toString());
      }
    };

    checkSessionExpiry();
    const interval = setInterval(checkSessionExpiry, 5000);

    window.addEventListener('click', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('cag_admin_token');
    localStorage.removeItem('cag_admin_last_activity');
    setAuthorized(false);
    router.push('/admin/login');
  };

  const handleSelectLanguage = (newLang: 'English' | 'हिन्दी') => {
    setLanguage(newLang);
    dataManager.setLanguage(newLang);
    setIsLangDropdownOpen(false);
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F7] flex items-center justify-center text-sm text-zinc-500 font-sans">
        Loading Admin Suite...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-[#F8F7F7] text-zinc-800 font-sans">
      
      {/* ── Top Header Bar (Exact match to Figma Frame 1000005174) ── */}
      <header 
        className="w-full bg-white flex items-center justify-between z-30 shrink-0 sticky top-0 select-none border-b border-[#EDE9E9]"
        style={{
          height: '80px',
          padding: '12px 20px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
          boxSizing: 'border-box'
        }}
      >
        {/* Left Crest & Logo (CAG Logo: width 72.23px, height 75.12px) */}
        <div 
          style={{
            width: '72.23px',
            height: '75.12px',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img 
            src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png" 
            alt="CAG Logo" 
            style={{
              width: '72.23px',
              height: '75.12px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Right Header Controls (Figma Frame 1000005221) */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0px',
            gap: '24px',
            width: '390px',
            height: '42px',
            flex: 'none',
            order: 1,
            flexGrow: 0
          }}
        >
          {/* Language Selector Button with Dropdown (Figma Button) */}
          <div className="relative" ref={langDropdownRef} style={{ flex: 'none', order: 0, flexGrow: 0 }}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(prev => !prev)}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '6px 12px',
                gap: '6px',
                width: '111px',
                height: '28px',
                borderRadius: '12px',
                border: '1px solid #EDE9E9',
                background: isLangDropdownOpen ? '#FDF2F5' : '#FFFFFF',
                flex: 'none',
                cursor: 'pointer',
                outline: 'none'
              }}
              className="hover:bg-zinc-50 transition-colors"
              title="Change Language"
            >
              {/* GlobeIcon (14px x 14px) */}
              <div style={{ width: '14px', height: '14px', flex: 'none', order: 0, flexGrow: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="5.6875" stroke="#45556C" strokeWidth="1.3125"/>
                  <ellipse cx="7" cy="7" rx="2.1875" ry="5.6875" stroke="#45556C" strokeWidth="1.3125"/>
                  <line x1="1.3125" y1="7" x2="12.6875" y2="7" stroke="#45556C" strokeWidth="1.3125"/>
                </svg>
              </div>

              {/* Text: English / हिन्दी (49px x 16px) */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0px',
                  width: '49px',
                  height: '16px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
              >
                <span 
                  style={{
                    width: '49px',
                    height: '16px',
                    fontFamily: "'Inter', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    color: '#45556C',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {language}
                </span>
              </div>

              {/* ChevronIcon (12px x 12px, opacity 0.5) */}
              <div 
                style={{
                  width: '12px',
                  height: '12px',
                  opacity: 0.5,
                  flex: 'none',
                  order: 2,
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isLangDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#45556C" strokeWidth="1.2375" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Language Dropdown Menu */}
            {isLangDropdownOpen && (
              <div 
                className="absolute left-0 mt-1 bg-white border border-[#EDE9E9] shadow-lg rounded-[8px] py-1 w-36 z-50 animate-in fade-in"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('English')}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between cursor-pointer transition-colors ${
                    language === 'English' ? 'bg-[#FDF2F5] text-[#751639] font-bold' : 'text-[#314158] hover:bg-[#F8F7F7]'
                  }`}
                >
                  <span>English</span>
                  {language === 'English' && <span className="text-[#751639] text-xs">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectLanguage('हिन्दी')}
                  className={`w-full text-left px-3 py-2 text-[13px] flex items-center justify-between cursor-pointer transition-colors ${
                    language === 'हिन्दी' ? 'bg-[#FDF2F5] text-[#751639] font-bold' : 'text-[#314158] hover:bg-[#F8F7F7]'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'हिन्दी' && <span className="text-[#751639] text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Line 1523 (Vertical Divider: width 42px rotated 90deg, border 1px solid #D8D8D8) */}
          <div 
            style={{
              width: '42px',
              height: '0px',
              border: '1px solid #D8D8D8',
              transform: 'rotate(90deg)',
              flex: 'none',
              order: 1,
              flexGrow: 0
            }}
          />

          {/* Frame 1000005216 (Admin User Badge + Dropdown) */}
          <div className="relative group" style={{ flex: 'none', order: 2, flexGrow: 0 }}>
            <button 
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px 12px',
                gap: '4px',
                width: '133px',
                height: '35px',
                flex: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {/* Frame 1000005214 (Avatar + Admin text) */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  isolation: 'isolate',
                  width: '94px',
                  height: '35px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                  position: 'relative'
                }}
              >
                {/* Group 1000004855 / image 1412 (35px x 35px Gradient Circle) */}
                <div 
                  style={{
                    width: '35px',
                    height: '35px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    zIndex: 0,
                    background: 'linear-gradient(135.48deg, #9F385E 5.24%, #741739 94.25%)',
                    borderRadius: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Letter A */}
                  <span 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    A
                  </span>
                </div>

                {/* Frame 1000005213 / Frame 1000005610 / Admin */}
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '10px',
                    width: '44px',
                    height: '20px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    zIndex: 1
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '10px',
                      width: '44px',
                      height: '20px',
                      borderRadius: '50px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <span 
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#751639',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                      }}
                    >
                      {language === 'हिन्दी' ? 'प्रशासक' : 'Admin'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Frame 1000005212 / Chevron Vector (11px x 6px) */}
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '3px',
                  width: '11px',
                  height: '6px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
              >
                <svg 
                  width="11" 
                  height="6" 
                  viewBox="0 0 11 6" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 1L5.5 5L10 1" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 bg-white border border-zinc-200 shadow-xl rounded-[12px] py-1.5 w-44 hidden group-hover:block z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-zinc-100">
                <p className="text-[13px] font-bold text-zinc-800 font-sans">
                  {language === 'हिन्दी' ? 'मुख्य व्यवस्थापक' : 'Super Administrator'}
                </p>
                <p className="text-[11px] text-zinc-400 font-sans">admin@cag.gov.in</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-semibold text-[13px] transition-colors flex items-center gap-2 cursor-pointer font-sans"
              >
                <span>{language === 'हिन्दी' ? 'लॉग आउट' : 'Logout / Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Main Layout Container (Sidebar + Content Canvas) */}
      <div className="flex-1 w-full flex flex-row overflow-hidden">
        
        {/* 355px Sidebar matching Figma */}
        <FigmaAdminSidebar />

        {/* Right Main Content Panel with #F8F7F7 background */}
        <main className="flex-1 h-full overflow-y-auto p-8 bg-[#F8F7F7]">
          <div className="w-full">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}
