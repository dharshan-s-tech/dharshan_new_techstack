'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import FigmaAdminSidebar from '@/components/admin/FigmaAdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes inactivity timeout

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

    // Initialize last activity timestamp if missing
    if (!localStorage.getItem('cag_admin_last_activity')) {
      localStorage.setItem('cag_admin_last_activity', Date.now().toString());
    }

    setAuthorized(true);
    setLoading(false);

    // Silent background session inactivity checker
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

    // Update activity timestamp ONLY on user clicks, keystrokes, touch
    const updateActivity = () => {
      if (localStorage.getItem('cag_admin_token')) {
        localStorage.setItem('cag_admin_last_activity', Date.now().toString());
      }
    };

    checkSessionExpiry();
    const interval = setInterval(checkSessionExpiry, 3000);

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

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center text-sm text-zinc-550">
        Loading Admin Suite...
      </div>
    );
  }

  if (!authorized) return null;

  // Map route paths to clear breadcrumbs matching Super Admin hierarchy
  const getBreadcrumb = () => {
    if (pathname === '/admin') return 'SUPER ADMIN > Dashboard';
    if (pathname === '/admin/banners') return 'SUPER ADMIN > Main CAG Website > Home Page';
    if (pathname === '/admin/reports') return 'SUPER ADMIN > Main CAG Website > Reports > Audit Reports';
    if (pathname === '/admin/state-accounts') return 'SUPER ADMIN > Main CAG Website > Reports > State & UT Accounts';
    if (pathname === '/admin/combined-accounts') return 'SUPER ADMIN > Main CAG Website > Reports > Combined Accounts & Conferences';
    if (pathname === '/admin/offices') return 'SUPER ADMIN > Main CAG Website > Our Presence > Offices & Institutes';
    if (pathname === '/admin/global') return 'SUPER ADMIN > Main CAG Website > Global Relations';
    if (pathname === '/admin/circulars') return 'SUPER ADMIN > Main CAG Website > Resources';
    if (pathname === '/admin/about') return 'SUPER ADMIN > Main CAG Website > About Us';
    if (pathname === '/admin/news') return 'SUPER ADMIN > Main CAG Website > News & Events';
    if (pathname === '/admin/site-settings') return 'SUPER ADMIN > Main CAG Website > Contact';
    if (pathname === '/admin/masters') return 'SUPER ADMIN > Shared Content';
    if (pathname === '/admin/users') return 'SUPER ADMIN > Administration > User Management';
    return 'SUPER ADMIN > Main CAG Website';
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-[#f4f6f9] text-zinc-800 font-sans text-[14px]">
      
      {/* Top Header Bar - Fixed at top matching Figma Frame 1000005174 */}
      <header className="h-[80px] w-full bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-between px-6 z-30 shrink-0 sticky top-0 select-none">
        
        {/* Left Crest & Logo */}
        <div className="flex items-center gap-4">
          <img 
            src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png" 
            alt="CAG Emblem Logo" 
            className="h-[60px] w-auto object-contain"
          />
          <div className="leading-tight">
            <h1 className="text-[17px] font-bold text-[#751639] tracking-tight">
              Comptroller &amp; Auditor General of India
            </h1>
            <p className="text-[11px] text-zinc-500 font-medium">
              Supreme Audit Institution of India — Admin Control Panel
            </p>
          </div>
        </div>

        {/* Right Header Controls matching Figma */}
        <div className="flex items-center gap-5">
          
          {/* Language Selector Button */}
          <div className="flex items-center gap-2 border border-[#EDE9E9] rounded-[12px] px-3 py-1.5 text-[14px] text-[#45556C] font-medium bg-white">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#45556C" strokeWidth="1.3"/>
              <ellipse cx="8" cy="8" rx="3.2" ry="7" stroke="#45556C" strokeWidth="1.3"/>
              <path d="M1 8H15" stroke="#45556C" strokeWidth="1.3"/>
            </svg>
            <span>English</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" opacity="0.6">
              <path d="M4 6L8 10L12 6" stroke="#45556C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Vertical Divider */}
          <div className="h-[36px] w-[1px] bg-[#D8D8D8]"></div>

          {/* Admin User Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2.5 py-1 text-left cursor-pointer outline-none">
              {/* Gradient Circle with 'A' */}
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-[#9F385E] to-[#741739] text-white flex items-center justify-center font-semibold text-[14px] shadow-xs">
                A
              </div>

              {/* Admin Label */}
              <span className="font-semibold text-[14px] leading-[20px] text-[#751639]">
                Admin
              </span>

              {/* Dropdown Chevron */}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#BBBBBB]">
                <path d="M1 1L5 5L9 1" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 bg-white border border-zinc-200 shadow-xl rounded-[12px] py-1.5 w-44 hidden group-hover:block z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-zinc-100">
                <p className="text-[13px] font-bold text-zinc-800">Super Administrator</p>
                <p className="text-[11px] text-zinc-400">admin@cag.gov.in</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-semibold text-[13px] transition-colors flex items-center gap-2"
              >
                <span>Logout / Sign Out</span>
              </button>
            </div>
          </div>

        </div>

      </header>

      {/* Main Body container (Figma Burgundy Sidebar + Scrollable Content) */}
      <div className="flex-1 w-full flex flex-row overflow-hidden">
        
        {/* Figma 355px Tree Navigation Sidebar - Fixed on left with its own scroll */}
        <FigmaAdminSidebar />

        {/* Right Main Content Panel - Independently scrollable */}
        <main className="flex-1 h-full overflow-y-auto p-6 flex flex-col justify-between">
          <div>
            
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-semibold mb-6">
              <span>🏠</span>
              <span>{getBreadcrumb()}</span>
            </div>

            {/* Dynamic Page Content */}
            <div className="animate-fadeIn pb-8">
              {children}
            </div>

          </div>

          {/* Footer Bar */}
          <footer className="mt-12 pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-500 font-medium shrink-0">
            <div>
              Copyright © 2026 Comptroller and Auditor General of India. All Rights Reserved.
            </div>
            <div>
              Admin Suite v2.0
            </div>
          </footer>

        </main>

      </div>

    </div>
  );
}
