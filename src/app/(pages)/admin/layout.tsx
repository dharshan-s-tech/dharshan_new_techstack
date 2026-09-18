'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FigmaAdminSidebar from '@/components/admin/FigmaAdminSidebar';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
      <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center text-sm text-zinc-500">
        Loading Admin Suite...
      </div>
    );
  }

  if (!authorized) return null;

  const getBreadcrumb = () => {
    const segments: { label: string; href?: string }[] = [{ label: 'Home', href: '/admin' }];
    if (pathname === '/admin') return [{ label: 'Home' }];
    if (pathname === '/admin/banners') segments.push({ label: 'Homepage' });
    else if (pathname === '/admin/reports') segments.push({ label: 'Audit Reports' });
    else if (pathname === '/admin/accounts') segments.push({ label: 'Accounts' });
    else if (pathname === '/admin/state-accounts') segments.push({ label: 'State Accounts' });
    else if (pathname === '/admin/combined-accounts') segments.push({ label: 'Combined Accounts' });
    else if (pathname === '/admin/offices') segments.push({ label: 'Our Presence' });
    else if (pathname === '/admin/global' || pathname === '/admin/global-relations') {
      segments.push({ label: 'Global Relations', href: '/admin/global-relations' });
      const slug = searchParams.get('slug') || '';
      const grLabels: Record<string, string> = {
        'page-involvement-with-intosai': 'INTOSAI',
        'page-involvement-with-asosai': 'ASOSAI',
        'page-global-audit-leadership-forum-and-other-multilateral-bodies': 'Multilateral Engagement',
        'page-bilateral-relations-of-sai-india': 'Bilateral Relations',
        'page-un-panel-of-external-auditors': 'UN Panel',
        'page-present-international-audits': 'Present Audits',
        'page-past-international-audits': 'Past Audits',
      };
      if (slug && grLabels[slug]) segments.push({ label: grLabels[slug] });
    } else if (pathname === '/admin/circulars') segments.push({ label: 'Resources' });
    else if (pathname === '/admin/about') {
      const topic = searchParams.get('topic');
      const category = searchParams.get('category');
      segments.push({ label: 'About Us', href: '/admin/about' });
      if (topic === 'former-cags') segments.push({ label: 'Former CAG' });
      else if (topic) segments.push({ label: topic.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) });
      else if (category) segments.push({ label: decodeURIComponent(category) });
    } else if (pathname === '/admin/news') segments.push({ label: 'News & Events' });
    else if (pathname === '/admin/site-settings') segments.push({ label: 'Contact' });
    else if (pathname === '/admin/masters') segments.push({ label: 'Shared Content' });
    else if (pathname === '/admin/users') segments.push({ label: 'User Management' });
    else if (pathname === '/admin/tenders') segments.push({ label: 'Tenders' });
    else segments.push({ label: 'Main CAG Website' });
    return segments;
  };

  const crumbs = getBreadcrumb();

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden flex flex-col bg-[#f4f6f9] text-zinc-800 font-sans text-[14px]">
      <header className="h-[72px] w-full bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.12)] flex items-center justify-between px-5 z-30 shrink-0 sticky top-0 select-none">
        <div className="flex items-center h-full py-1">
          <img
            src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png"
            alt="Comptroller and Auditor General of India"
            className="h-full w-auto max-h-[64px] object-contain object-left"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-[#EDE9E9] rounded-lg px-2.5 py-1 text-[13px] text-[#45556C] font-medium bg-white">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="#45556C" strokeWidth="1.3" />
              <ellipse cx="8" cy="8" rx="3.2" ry="7" stroke="#45556C" strokeWidth="1.3" />
              <path d="M1 8H15" stroke="#45556C" strokeWidth="1.3" />
            </svg>
            <span>English</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" opacity="0.6">
              <path d="M4 6L8 10L12 6" stroke="#45556C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="h-[36px] w-[1px] bg-[#D8D8D8]" />

          <div className="relative group">
            <button type="button" className="flex items-center gap-2.5 py-1 text-left cursor-pointer outline-none">
              <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#9F385E] to-[#741739] text-white flex items-center justify-center font-semibold text-[14px] shadow-xs">
                A
              </div>
              <span className="font-semibold text-[14px] leading-[20px] text-[#751639]">Admin</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#BBBBBB]">
                <path d="M1 1L5 5L9 1" stroke="#BBBBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute right-0 top-full mt-2 bg-white border border-zinc-200 shadow-xl rounded-[12px] py-1.5 w-44 hidden group-hover:block z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-zinc-100">
                <p className="text-[13px] font-bold text-zinc-800">Super Administrator</p>
                <p className="text-[11px] text-zinc-400">admin@cag.gov.in</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-semibold text-[13px] transition-colors flex items-center gap-2"
              >
                <span>Logout / Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full flex flex-row overflow-hidden">
        <FigmaAdminSidebar />

        <main className="flex-1 h-full overflow-y-auto p-6 flex flex-col justify-between bg-[#f4f6f9]">
          <div>
            <nav className="flex items-center gap-1.5 text-[13px] text-zinc-500 font-medium mb-5" aria-label="Breadcrumb">
              {crumbs.map((crumb, idx) => (
                <span key={`${crumb.label}-${idx}`} className="inline-flex items-center gap-1.5">
                  {idx > 0 && <span className="text-zinc-300">›</span>}
                  {crumb.href && idx < crumbs.length - 1 ? (
                    <Link href={crumb.href} className="hover:text-[#751639] transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={idx === crumbs.length - 1 ? 'text-zinc-800 font-semibold' : ''}>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>

            <div className="animate-fadeIn pb-8">{children}</div>
          </div>

          <footer className="mt-12 pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] text-zinc-500 font-medium shrink-0">
            <div>Copyright © 2026 Comptroller and Auditor General of India. All Rights Reserved.</div>
            <div>Admin Suite v2.0</div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#eef2f5] flex items-center justify-center text-sm text-zinc-500">
          Loading Admin Suite...
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
