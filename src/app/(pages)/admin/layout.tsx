'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

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

  // Essential menu categories
  const menuCategories = [
    {
      category: 'CORE & INSTITUTIONAL',
      items: [
        { name: 'Dashboard Overview', path: '/admin', active: pathname === '/admin' },
        { name: 'About Us & Former CAGs', path: '/admin/about', active: pathname === '/admin/about' },
        { name: 'Global Site Settings & Texts', path: '/admin/site-settings', active: pathname === '/admin/site-settings' },
      ]
    },
    {
      category: 'REPORTS & PUBLICATIONS',
      items: [
        { name: 'Audit Reports & Accounts', path: '/admin/reports', active: pathname === '/admin/reports' },
        { name: 'State Finance Accounts', path: '/admin/state-accounts', active: pathname === '/admin/state-accounts' },
      ]
    },
    {
      category: 'PRESENCE & RELATIONS',
      items: [
        { name: 'State Level Offices Cards', path: '/admin/offices', active: pathname === '/admin/offices' },
        { name: 'Global Relations (INTOSAI/UN)', path: '/admin/global', active: pathname === '/admin/global' },
      ]
    },
    {
      category: 'MEDIA & ANNOUNCEMENTS',
      items: [
        { name: 'News & Press Releases', path: '/admin/news', active: pathname === '/admin/news' },
        { name: 'Home Banner Slideshows', path: '/admin/banners', active: pathname === '/admin/banners' },
      ]
    },
    {
      category: 'CIRCULARS & TENDERS',
      items: [
        { name: 'Circulars & Office Orders', path: '/admin/circulars', active: pathname === '/admin/circulars' },
        { name: 'Tenders & Procurement', path: '/admin/tenders', active: pathname === '/admin/tenders' },
      ]
    },
    {
      category: 'SYSTEM MASTERS',
      items: [
        { name: 'Master Data Dictionaries', path: '/admin/masters', active: pathname === '/admin/masters' },
      ]
    }
  ];

  // Map route paths to clear breadcrumbs
  const getBreadcrumb = () => {
    if (pathname === '/admin') return 'Home > Dashboard Overview';
    if (pathname === '/admin/banners') return 'Home > Home Page Hero Banners';
    if (pathname === '/admin/reports') return 'Home > Audit Reports & Accounts';
    if (pathname === '/admin/about') return 'Home > About Us & Former CAGs';
    if (pathname === '/admin/offices') return 'Home > State Level Offices Cards';
    if (pathname === '/admin/global') return 'Home > Global Relations (INTOSAI)';
    if (pathname === '/admin/news') return 'Home > News & Press Releases';
    if (pathname === '/admin/state-accounts') return 'Home > State Finance Accounts';
    if (pathname === '/admin/circulars') return 'Home > Circulars & Regulations';
    if (pathname === '/admin/tenders') return 'Home > Tenders & Procurement';
    if (pathname === '/admin/masters') return 'Home > Master Data Dictionaries';
    if (pathname === '/admin/site-settings') return 'Home > Global Site Settings & Texts';
    return 'Home';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-zinc-800 font-sans text-[14px]">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-[#e2e5e7] flex items-center justify-between px-6 py-2.5 z-10 shrink-0 shadow-xs">
        
        {/* Left Crest & Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png" 
            alt="CAG Emblem Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-[#751639]">
              Comptroller & Auditor General of India
            </h1>
            <p className="text-[10px] text-zinc-400 font-medium leading-none">
              Supreme Audit Institution of India — Admin Control Panel
            </p>
          </div>
        </div>

        {/* Right Admin Details / Language */}
        <div className="flex items-center gap-4 text-xs">
          <div className="relative">
            <select className="bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-700 outline-none">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1.5 font-semibold text-[#751639] py-1">
              <span>( Administrator )</span>
              <span className="text-[10px]">▼</span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 shadow-lg rounded-md py-1 w-40 hidden group-hover:block z-50">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-zinc-50 text-red-600 font-semibold"
              >
                Logout / Sign Out
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Main Body container (Sidebar + Content) */}
      <div className="flex flex-grow overflow-hidden">
        
        {/* Solid Rich Solid CAG Burgundy Sidebar with High-Contrast Bold Text */}
        <aside className="w-[280px] bg-[#751639] overflow-y-auto shrink-0 flex flex-col justify-between border-r border-[#5c102c] shadow-xl">
          <div>
            {/* Side Panel Header */}
            <div className="px-5 py-4 border-b border-white/20 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></span>
                <span className="text-xs uppercase tracking-wider font-extrabold text-white">CAG Control Suite</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-pulse" title="Active Admin Session"></span>
            </div>

            {/* Navigation Category Groups */}
            <nav className="py-4 space-y-4 pr-3">
              {menuCategories.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-1">
                  <div className="px-5 text-[11px] font-extrabold text-[#ffe6ed] tracking-widest uppercase border-b border-white/10 pb-1 mb-1.5">
                    {cat.category}
                  </div>
                  {cat.items.map((item, idx) => (
                    <div key={idx}>
                      <Link 
                        href={item.path}
                        target="_self"
                        className={`block py-3 px-5 transition-all text-[13.5px] ${
                          item.active 
                            ? 'bg-white text-[#751639] font-extrabold pl-6 shadow-md rounded-r-md border-l-4 border-l-[#ffb3c6]' 
                            : 'text-white font-bold hover:bg-white/15 rounded-r-md'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-grow flex flex-col overflow-y-auto p-6 justify-between">
          <div>
            
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-semibold mb-6">
              <span>🏠</span>
              <span>{getBreadcrumb()}</span>
            </div>

            {/* Dynamic Page Content */}
            <div className="animate-fadeIn">
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
