'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Users, Shield, Newspaper, Bell, Image, FileText,
  BarChart3, Archive, BookOpen, FileSearch, FileClock, FolderOpen,
  AlertCircle, ChevronDown, ChevronRight, LogOut, Menu, X,
  GraduationCap, Megaphone, Images, Video, Mic, CalendarDays, Mail,
  Phone, UserCheck, List, UserMinus, Heart, Globe, QrCode,
  ScrollText, Link2, ExternalLink, Sliders, LayoutGrid, HelpCircle,
  IndianRupee, Eye, Upload, Settings, Building2, Tag, Calendar,
  ClipboardList, FileCog, Receipt, FileBarChart, TrendingUp, BookMarked,
  CheckSquare, Package, Monitor, Activity, Scissors, Map, Languages,
  FileInput, AlertTriangle, UserCog, MessageSquare, Layers, Wallet,
  PiggyBank, Coins, Building, ClipboardCheck, FileQuestion, BookCopy,
  Briefcase, Library, MessageCircleQuestion, GitBranch, Compass, Landmark,
  Scale, Award
} from 'lucide-react';

interface NavItem { label: string; href: string; icon: any; }
interface NavSubSection { title: string; items: NavItem[]; }
interface NavGroup { 
  group: string; 
  icon: any; 
  items?: NavItem[];
  subsections?: NavSubSection[];
}

const NAV: NavGroup[] = [
  {
    group: 'Dashboard', icon: LayoutDashboard, items: [
      { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'User Management', href: '/admin/users?tab=users', icon: Users },
      { label: 'Audit Log', href: '/admin/audit-log', icon: ScrollText },
    ]
  },
  {
    group: 'About Us', icon: Landmark, items: [
      { label: 'About Us Management', href: '/admin/about', icon: Landmark },
      { label: 'Pages / CMS', href: '/admin/pages', icon: FileText },
    ]
  },
  {
    group: 'Reports', icon: FileBarChart, items: [
      { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
      { label: 'Accounts', href: '/admin/accounts', icon: Receipt },
    ]
  },
  {
    group: 'Content & Media', icon: FileText, items: [
      { label: 'Banners', href: '/admin/banners', icon: Image },
      { label: 'News & Press', href: '/admin/news', icon: Newspaper },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Media Gallery', href: '/admin/media-gallery', icon: Images },
      { label: 'Events & Seminars', href: '/admin/events', icon: CalendarDays },
      { label: 'Publications', href: '/admin/publications', icon: BookOpen },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    ]
  },
  {
    group: 'Settings & Master', icon: Settings, items: [
      { label: 'Offices Directory', href: '/admin/offices', icon: Building2 },
      { label: 'States & UTs', href: '/admin/states', icon: Map },
      { label: 'Government Types', href: '/admin/government-types', icon: Tag },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'About Us': true,
    'Dashboard': true,
    'Reports': false
  });
  const [collapsed, setCollapsed] = useState(false);

  // Auto-open group containing active route
  useEffect(() => {
    NAV.forEach(group => {
      let isInside = false;
      if (group.items && group.items.some(item => pathname.startsWith(item.href))) {
        isInside = true;
      }
      if (group.subsections) {
        group.subsections.forEach(sub => {
          if (sub.items.some(item => pathname.startsWith(item.href))) {
            isInside = true;
          }
        });
      }
      if (isInside) {
        setOpenGroups(prev => ({ ...prev, [group.group]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <aside 
      className={`
        ${collapsed ? 'w-16' : 'w-72'} 
        h-screen max-h-screen sticky top-0 text-white flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 select-none z-30 overflow-hidden
      `}
      style={{ background: 'linear-gradient(232deg, #8a1e45 1.4%, #5a102b 59.7%, #1a050d 172%)' }}
    >
      {/* Header / Logo */}
      <div className={`flex items-center ${collapsed ? 'flex-col gap-2 py-4 px-2 justify-center' : 'gap-3 px-4 py-4'} border-b border-white/10 min-h-[64px]`}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
            title="Expand Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : (
          <>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-0.5 border border-white/20">
              <img src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png" alt="CAG Emblem" className="w-full h-full object-contain" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-extrabold text-white leading-tight tracking-wider">CAG ADMIN</p>
              <p className="text-[9px] text-white/70 leading-tight">Supreme Audit Institution</p>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Collapse Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Tree */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin scrollbar-thumb-white/10">
        {NAV.map((group) => {
          const isOpen = openGroups[group.group];
          const GroupIcon = group.icon;

          return (
            <div key={group.group} className="mb-2">
              {/* Group Accordion Header */}
              <button
                onClick={() => toggleGroup(group.group)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors rounded-lg cursor-pointer
                  ${isOpen ? 'bg-white/10 text-white font-semibold' : 'text-white/80 hover:bg-white/5 hover:text-white'}
                `}
              >
                <GroupIcon className="w-4 h-4 shrink-0 text-white/80" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-xs font-semibold tracking-wide uppercase">{group.group}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {/* Group Content */}
              {!collapsed && isOpen && (
                <div className="mt-1 space-y-1 pl-1">
                  {/* Flat Items (if any) */}
                  {group.items && (
                    <div className="space-y-0.5 pl-2 border-l border-white/10 ml-2">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const ItemIcon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                              flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors
                              ${isActive ? 'bg-white text-[#751639] font-bold shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                            `}
                          >
                            <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Nested Subsections (e.g. for About Us) */}
                  {group.subsections && group.subsections.map((subsection) => (
                    <div key={subsection.title} className="mt-2 pt-1">
                      <div className="px-3 py-1 text-[10px] font-bold text-amber-200/90 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                        {subsection.title}
                      </div>
                      <div className="space-y-0.5 pl-2 border-l border-amber-300/20 ml-3.5 mt-0.5">
                        {subsection.items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                          const ItemIcon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`
                                flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors
                                ${isActive ? 'bg-white text-[#751639] font-bold shadow-sm' : 'text-white/85 hover:bg-white/10 hover:text-white'}
                              `}
                            >
                              <ItemIcon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-3 border-t border-white/10 flex items-center justify-between">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">Administrator</p>
                <p className="text-[10px] text-white/60 truncate">admin@cag.gov.in</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex justify-center p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
