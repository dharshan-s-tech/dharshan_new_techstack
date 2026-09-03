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
  Briefcase, Library, MessageCircleQuestion, GitBranch
} from 'lucide-react';

interface NavItem { label: string; href: string; icon: any; }
interface NavGroup { group: string; icon: any; items: NavItem[]; }

const NAV: NavGroup[] = [
  {
    group: 'Core', icon: LayoutDashboard, items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Admin Users', href: '/admin/users', icon: Users },
    ]
  },
  {
    group: 'Content', icon: FileText, items: [
      { label: 'Banners', href: '/admin/banners', icon: Image },
      { label: 'Pages / CMS', href: '/admin/pages', icon: FileText },
      { label: 'News', href: '/admin/news', icon: Newspaper },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Quick Links', href: '/admin/quick-links', icon: ExternalLink },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    ]
  },
  {
    group: 'Audit Reports', icon: FileBarChart, items: [
      { label: 'Audit Reports', href: '/admin/audit-reports', icon: FileBarChart },
      { label: 'Audit Report Files', href: '/admin/audit-report-files', icon: Archive },
      { label: 'State Accounts', href: '/admin/state-accounts', icon: Receipt },
    ]
  },
  {
    group: 'Publications', icon: BookOpen, items: [
      { label: 'Publications', href: '/admin/publications', icon: BookOpen },
      { label: 'Journal Issues', href: '/admin/journal-issues', icon: Layers },
      { label: 'Journal Articles', href: '/admin/journal-articles', icon: FileText },
    ]
  },
  {
    group: 'Media & Events', icon: Images, items: [
      { label: 'Media Gallery', href: '/admin/media-gallery', icon: Images },
      { label: 'Events', href: '/admin/events', icon: CalendarDays },
    ]
  },
  {
    group: 'Organisation', icon: GitBranch, items: [
      { label: 'Org Designations', href: '/admin/org-designations', icon: GitBranch },
      { label: 'Org Officers', href: '/admin/org-officers', icon: Users },
      { label: 'Former CAGs', href: '/admin/former-cags', icon: UserCheck },
    ]
  },
  {
    group: 'Recruitment & Tenders', icon: Megaphone, items: [
      { label: 'Recruitment Notices', href: '/admin/recruitment-notices', icon: Megaphone },
      { label: 'Tenders', href: '/admin/tenders', icon: ScrollText },
    ]
  },
  {
    group: 'Engagement', icon: UserCog, items: [
      { label: 'Public Consultations', href: '/admin/public-consultations', icon: UserCog },
      { label: 'Contact Submissions', href: '/admin/contact-submissions', icon: Phone },
    ]
  },
  {
    group: 'Settings', icon: Settings, items: [
      { label: 'Offices', href: '/admin/offices', icon: Building2 },
      { label: 'States', href: '/admin/states', icon: Map },
      { label: 'Government Types', href: '/admin/government-types', icon: Tag },
      { label: 'Audit Log', href: '/admin/audit-log', icon: ScrollText },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  // Auto-open the group that contains the active route
  useEffect(() => {
    NAV.forEach(group => {
      if (group.items.some(item => pathname.startsWith(item.href))) {
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
        ${collapsed ? 'w-16' : 'w-64'} 
        min-h-screen text-white flex flex-col transition-all duration-300 ease-in-out flex-shrink-0
      `}
      style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'flex-col gap-2 py-4 px-2 justify-center' : 'gap-3 px-4 py-4'} border-b border-white/10 min-h-[64px]`}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="text-white/60 hover:text-white transition-colors p-1"
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
              <p className="text-[10px] font-extrabold text-white leading-tight tracking-wide">CAG INDIA</p>
              <p className="text-[8px] text-white/70 leading-tight">Supreme Audit Institution</p>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto text-white/50 hover:text-white transition-colors"
              title="Collapse Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-white/10">
        {NAV.map((group) => {
          const isOpen = openGroups[group.group];
          const GroupIcon = group.icon;
          const hasActive = group.items.some(item => pathname.startsWith(item.href));

          return (
            <div key={group.group} className="mb-1">
              <button
                onClick={() => toggleGroup(group.group)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${hasActive ? 'text-white' : 'text-white/60 hover:text-white'}
                  hover:bg-white/5 rounded-lg mx-1 w-[calc(100%-8px)]
                `}
              >
                <GroupIcon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-wider flex-1">{group.group}</span>
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="ml-4 border-l border-white/10 pl-2 mt-1 space-y-0.5">
                  {group.items.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`
                          flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all
                          ${isActive
                            ? 'bg-white/15 text-white font-semibold'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                          }
                        `}
                      >
                        <ItemIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-xs">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
