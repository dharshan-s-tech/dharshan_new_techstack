'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { dataManager, BannerItem } from '@/lib/dataManager';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { 
  Plus, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

interface QuickLinkItem {
  id: string;
  title_en: string;
  title_hi: string;
  desc_en?: string;
  url: string;
  icon?: string;
  is_active: boolean;
  display_order: number;
}

interface StatItem {
  id: string;
  value: string;
  label_en: string;
  label_hi: string;
  display_order: number;
  is_active: boolean;
}

interface WhoWeAreContent {
  heading_en: string;
  heading_hi: string;
  body_en: string;
  body_hi: string;
  cta_text_en: string;
  cta_text_hi: string;
  cta_link: string;
}

interface CagMessageContent {
  cag_name_en: string;
  cag_name_hi: string;
  cag_title_en: string;
  cag_title_hi: string;
  heading_en: string;
  heading_hi: string;
  subheading_en: string;
  subheading_hi: string;
  body_en: string;
  body_hi: string;
  photo_url: string;
}

const DEFAULT_QUICK_LINKS: QuickLinkItem[] = [
  { id: 'ql-1', title_en: 'Audit Reports', title_hi: 'लेखापरीक्षा रिपोर्ट', desc_en: 'Access Union & State audit reports tabled in Parliament and Legislatures.', url: '/Reports', is_active: true, display_order: 1 },
  { id: 'ql-2', title_en: 'State Accounts', title_hi: 'राज्य खाते', desc_en: 'Finance Accounts, Appropriation Accounts, and Accounts at a Glance.', url: '/Reports/state-accounts', is_active: true, display_order: 2 },
  { id: 'ql-3', title_en: 'Our Presence', title_hi: 'हमारी उपस्थिति', desc_en: 'Directory of 150+ field offices, central directorates & training academies.', url: '/Our-Presence/Index-Menu/State-Level-Offices', is_active: true, display_order: 3 },
  { id: 'ql-4', title_en: 'Tenders & Notices', title_hi: 'निविदाएं एवं नोटिस', desc_en: 'Active procurement notices, RFPs, and expression of interests.', url: '/Resources/Tenders', is_active: true, display_order: 4 },
  { id: 'ql-5', title_en: 'Careers & Recruitment', title_hi: 'करियर एवं भर्ती', desc_en: 'Job notifications, deputations, and consultant engagements.', url: '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department', is_active: true, display_order: 5 },
  { id: 'ql-6', title_en: 'Right to Information (RTI)', title_hi: 'सूचना का अधिकार', desc_en: 'RTI proactive disclosures and appellate authority details.', url: '/Resources/Circulars', is_active: true, display_order: 6 }
];

const DEFAULT_STATS: StatItem[] = [
  { id: 'st-1', value: '150+', label_en: 'Years of Constitutional Excellence', label_hi: 'संवैधानिक उत्कृष्टता के वर्ष', display_order: 1, is_active: true },
  { id: 'st-2', value: '700+', label_en: 'Audit & Accounts Reports Tabled Annually', label_hi: 'वार्षिक प्रस्तुत लेखापरीक्षा रिपोर्टें', display_order: 2, is_active: true },
  { id: 'st-3', value: '150+', label_en: 'Field Offices & Training Academies', label_hi: 'क्षेत्रीय कार्यालय और प्रशिक्षण अकादमियां', display_order: 3, is_active: true },
  { id: 'st-4', value: '50,000+', label_en: 'Dedicated Audit & Accounts Professionals', label_hi: 'समर्पित लेखापरीक्षा पेशेवर', display_order: 4, is_active: true }
];

const DEFAULT_WHO_WE_ARE: WhoWeAreContent = {
  heading_en: 'Who We Are',
  heading_hi: 'हम कौन हैं',
  body_en: 'The Comptroller and Auditor General of India is the Supreme Audit Institution of India, mandated by the Constitution under Articles 148 to 151 to uphold transparency, integrity, and accountability in financial governance and public administration across Union and State Governments.',
  body_hi: 'भारत के नियंत्रक एवं महालेखापरीक्षक भारत का सर्वोच्च लेखापरीक्षा संस्थान है, जिसे संविधान के अनुच्छेद 148 से 151 के तहत केंद्र और राज्य सरकारों में वित्तीय शासन और सार्वजनिक प्रशासन में पारदर्शिता, सत्यनिष्ठा और जवाबदेही बनाए रखने का अधिकार प्राप्त है।',
  cta_text_en: 'Explore About Us',
  cta_text_hi: 'हमारे बारे में और जानें',
  cta_link: '/About/About-Us/Cag-Of-India'
};

const DEFAULT_CAG_MESSAGE: CagMessageContent = {
  cag_name_en: 'Shri K. Sanjay Murthy',
  cag_name_hi: 'श्री के. संजय मूर्ति',
  cag_title_en: 'Comptroller & Auditor General of India',
  cag_title_hi: 'भारत के नियंत्रक एवं महालेखापरीक्षक',
  heading_en: 'Message from the Comptroller & Auditor General of India',
  heading_hi: 'भारत के नियंत्रक एवं महालेखापरीक्षक का संदेश',
  subheading_en: 'Strengthening Accountability. Enabling Better Governance.',
  subheading_hi: 'जवाबदेही को मजबूत करना। बेहतर शासन को सक्षम बनाना।',
  body_en: 'As India’s Supreme Audit Institution, we uphold transparency, integrity, and accountability in public administration, fostering trust in democratic institutions and contributing to effective governance for the nation.',
  body_hi: 'भारत के सर्वोच्च लेखापरीक्षा संस्थान के रूप में, हम सार्वजनिक प्रशासन में पारदर्शिता, सत्यनिष्ठा और जवाबदेही बनाए रखते हैं, संस्थानों में विश्वास को बढ़ावा देते हैं और राष्ट्र के लिए प्रभावी शासन में योगदान देते हैं।',
  photo_url: '/assets/cag-murthy-official.png'
};

function SortIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="inline-block ml-1 text-[#90A1B9] opacity-70">
      <path d="M5 1L8 4.5H2L5 1Z" fill="currentColor"/>
      <path d="M5 11L2 7.5H8L5 11Z" fill="currentColor"/>
    </svg>
  );
}

function AdminBannersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isHindi, t } = useAdminLanguage();

  // Active Tab ('hero' | 'quick-links' | 'who-we-are' | 'statistics' | 'cag-message')
  const tabParam = searchParams.get('tab') || 'hero';
  const [activeTab, setActiveTab] = useState<string>(
    ['hero', 'quick-links', 'who-we-are', 'statistics', 'cag-message'].includes(tabParam) ? tabParam : 'hero'
  );

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && ['hero', 'quick-links', 'who-we-are', 'statistics', 'cag-message'].includes(t)) {
      setActiveTab(t);
    } else if (!t) {
      setActiveTab('hero');
    }
  }, [searchParams]);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ── 1. Hero Banners State ──
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [searchFor, setSearchFor] = useState('');
  const [websiteFilter, setWebsiteFilter] = useState('Main CAG Website');
  const [statusFilter, setStatusFilter] = useState('All');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [bannerTitleEn, setBannerTitleEn] = useState('');
  const [bannerTitleHi, setBannerTitleHi] = useState('');
  const [bannerSubtitleEn, setBannerSubtitleEn] = useState('');
  const [bannerSubtitleHi, setBannerSubtitleHi] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('#');
  const [bannerDisplayOrder, setBannerDisplayOrder] = useState(1);
  const [bannerIsActive, setBannerIsActive] = useState(true);

  // ── 2. Quick Links State ──
  const [quickLinks, setQuickLinks] = useState<QuickLinkItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cag_home_quick_links');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_QUICK_LINKS;
  });
  const [isQlFormOpen, setIsQlFormOpen] = useState(false);
  const [editingQlId, setEditingQlId] = useState<string | null>(null);
  const [qlTitleEn, setQlTitleEn] = useState('');
  const [qlTitleHi, setQlTitleHi] = useState('');
  const [qlDescEn, setQlDescEn] = useState('');
  const [qlUrl, setQlUrl] = useState('');
  const [qlOrder, setQlOrder] = useState(1);
  const [qlIsActive, setQlIsActive] = useState(true);

  // ── 3. Who We Are State ──
  const [whoWeAre, setWhoWeAre] = useState<WhoWeAreContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cag_home_who_we_are');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_WHO_WE_ARE;
  });

  // ── 4. Statistics State ──
  const [stats, setStats] = useState<StatItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cag_home_statistics');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_STATS;
  });
  const [isStatFormOpen, setIsStatFormOpen] = useState(false);
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [statValue, setStatValue] = useState('');
  const [statLabelEn, setStatLabelEn] = useState('');
  const [statLabelHi, setStatLabelHi] = useState('');
  const [statOrder, setStatOrder] = useState(1);
  const [statIsActive, setStatIsActive] = useState(true);

  // ── 5. CAG Message State ──
  const [cagMessage, setCagMessage] = useState<CagMessageContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cag_home_cag_message');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_CAG_MESSAGE;
  });

  // Load Banners
  const loadBanners = () => {
    setBannersLoading(true);
    let list = dataManager.getBanners();
    if (appliedSearch) {
      list = list.filter((item) => 
        item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        item.subtitle_en?.toLowerCase().includes(appliedSearch.toLowerCase())
      );
    }
    if (statusFilter === 'Active') {
      list = list.filter((item) => item.is_active);
    } else if (statusFilter === 'Inactive') {
      list = list.filter((item) => !item.is_active);
    }
    setBanners(list);
    setBannersLoading(false);
  };

  useEffect(() => {
    loadBanners();
    const handleBannersChange = () => loadBanners();
    window.addEventListener('bannersChange', handleBannersChange);
    return () => window.removeEventListener('bannersChange', handleBannersChange);
  }, [appliedSearch, statusFilter]);

  // Handlers for Banners
  const handleOpenCreateBanner = () => {
    setEditingBannerId(null);
    setBannerTitleEn('');
    setBannerTitleHi('');
    setBannerSubtitleEn('');
    setBannerSubtitleHi('');
    setBannerImageUrl('/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png');
    setBannerLinkUrl('#');
    setBannerDisplayOrder(banners.length + 1);
    setBannerIsActive(true);
    setIsBannerFormOpen(true);
  };

  const handleOpenEditBanner = (id: number) => {
    const item = banners.find((b) => b.id === id);
    if (!item) return;

    setEditingBannerId(id);
    setBannerTitleEn(item.title_en || '');
    setBannerTitleHi(item.title_hi || '');
    setBannerSubtitleEn(item.subtitle_en || '');
    setBannerSubtitleHi(item.subtitle_hi || '');
    setBannerImageUrl(item.image_url || '');
    setBannerLinkUrl(item.link_url || '#');
    setBannerDisplayOrder(item.display_order || 1);
    setBannerIsActive(item.is_active);
    setIsBannerFormOpen(true);
  };

  const handleDeleteBanner = (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    dataManager.deleteBanner(id);
    loadBanners();
    setToast({ type: 'success', text: 'Banner deleted successfully.' });
  };

  const handleSubmitBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: BannerItem = {
      id: editingBannerId || Date.now(),
      title_en: bannerTitleEn,
      title_hi: bannerTitleHi || undefined,
      subtitle_en: bannerSubtitleEn || undefined,
      subtitle_hi: bannerSubtitleHi || undefined,
      image_url: bannerImageUrl,
      link_url: bannerLinkUrl,
      display_order: bannerDisplayOrder,
      is_active: bannerIsActive
    };

    dataManager.saveBanner(newRecord);
    setIsBannerFormOpen(false);
    loadBanners();
    setToast({ type: 'success', text: editingBannerId ? 'Banner updated successfully.' : 'New banner published successfully.' });
  };

  // Handlers for Quick Links
  const handleSaveQl = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: QuickLinkItem[];
    if (editingQlId) {
      updated = quickLinks.map(q => q.id === editingQlId ? {
        ...q,
        title_en: qlTitleEn,
        title_hi: qlTitleHi,
        desc_en: qlDescEn,
        url: qlUrl,
        display_order: qlOrder,
        is_active: qlIsActive
      } : q);
    } else {
      const newItem: QuickLinkItem = {
        id: `ql-${Date.now()}`,
        title_en: qlTitleEn,
        title_hi: qlTitleHi,
        desc_en: qlDescEn,
        url: qlUrl,
        display_order: qlOrder,
        is_active: qlIsActive
      };
      updated = [...quickLinks, newItem];
    }
    setQuickLinks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_home_quick_links', JSON.stringify(updated));
    }
    setIsQlFormOpen(false);
    setToast({ type: 'success', text: 'Quick link card saved successfully.' });
  };

  const handleDeleteQl = (id: string) => {
    if (!confirm('Are you sure you want to delete this quick link?')) return;
    const updated = quickLinks.filter(q => q.id !== id);
    setQuickLinks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_home_quick_links', JSON.stringify(updated));
    }
    setToast({ type: 'success', text: 'Quick link deleted.' });
  };

  // Handlers for Stats
  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: StatItem[];
    if (editingStatId) {
      updated = stats.map(s => s.id === editingStatId ? {
        ...s,
        value: statValue,
        label_en: statLabelEn,
        label_hi: statLabelHi,
        display_order: statOrder,
        is_active: statIsActive
      } : s);
    } else {
      const newItem: StatItem = {
        id: `st-${Date.now()}`,
        value: statValue,
        label_en: statLabelEn,
        label_hi: statLabelHi,
        display_order: statOrder,
        is_active: statIsActive
      };
      updated = [...stats, newItem];
    }
    setStats(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_home_statistics', JSON.stringify(updated));
    }
    setIsStatFormOpen(false);
    setToast({ type: 'success', text: 'Statistic card saved successfully.' });
  };

  const handleDeleteStat = (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;
    const updated = stats.filter(s => s.id !== id);
    setStats(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_home_statistics', JSON.stringify(updated));
    }
    setToast({ type: 'success', text: 'Statistic deleted.' });
  };

  // Handlers for Who We Are
  const handleSaveWhoWeAre = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_home_who_we_are', JSON.stringify(whoWeAre));
    }
    setToast({ type: 'success', text: 'Who We Are content saved successfully.' });
  };

  // Handlers for CAG Message
  const handleSaveCagMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_home_cag_message', JSON.stringify(cagMessage));
    }
    setToast({ type: 'success', text: 'CAG Message content saved successfully.' });
  };

  const totalPages = Math.ceil(banners.length / rowsPerPage) || 1;
  const paginatedBanners = banners.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'quick-links': return 'Quick Link Cards';
      case 'who-we-are': return 'Who we are';
      case 'statistics': return 'Statistics';
      case 'cag-message': return 'CAG Message';
      default: return 'Banners';
    }
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-[8px] shadow-lg border text-xs font-semibold ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-red-50 text-red-800 border-red-300'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-3 text-zinc-400 hover:text-zinc-600 font-bold">&times;</button>
          </div>
        </div>
      )}

      {/* ── TOP PAGE TITLE (Exact match to Figma Banners Title) ── */}
      <div>
        <h1 
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '20px',
            color: '#751639'
          }}
        >
          {getPageTitle()}
        </h1>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 1: BANNERS (HERO) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <>
          {/* ── 1. CARD: SEARCH & FILTER (Figma Container / Frame 2147227423) ── */}
          <div 
            className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
            style={{
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box'
            }}
          >
            {/* Card Header (Button) */}
            <div className="px-5 py-4 h-[60px] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Filter Icon in pink rounded square (Container) */}
                <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4H14M4 8H12M6 12H10" stroke="#751639" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <span 
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#0F172B'
                  }}
                >
                  {t.searchAndFilter}
                </span>
              </div>
            </div>

            {/* Card Body (Container) */}
            <div className="p-5 border-t border-[#F5F3F4] space-y-4">
              {/* Row 1: 3 Column Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Search For */}
                <div className="flex flex-col gap-1.5">
                  <label 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#62748E'
                    }}
                  >
                    {t.searchFor}
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchFor}
                      onChange={(e) => setSearchFor(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setAppliedSearch(searchFor)}
                      placeholder={t.enterKeywords}
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Websites */}
                <div className="flex flex-col gap-1.5">
                  <label 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#62748E'
                    }}
                  >
                    {t.websites}
                  </label>
                  <div className="relative w-full">
                    <select
                      value={websiteFilter}
                      onChange={(e) => setWebsiteFilter(e.target.value)}
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="Main CAG Website">{t.mainCagWebsite}</option>
                      <option value="State A&E Offices">{t.stateAeOffices}</option>
                      <option value="State Audit Offices">{t.stateAuditOffices}</option>
                      <option value="Central Audit Offices">{t.centralAuditOffices}</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#62748E'
                    }}
                  >
                    {t.status}
                  </label>
                  <div className="relative w-full">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="All">{t.allStatus}</option>
                      <option value="Active">{t.active}</option>
                      <option value="Inactive">{t.inactive}</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Action Bar (Rows per page + Reset / Search) */}
              <div className="border-t border-[#F5F3F4] pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                
                {/* Rows per page */}
                <div className="flex items-center gap-3">
                  <span 
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#45556C'
                    }}
                  >
                    {t.rowsPerPage}
                  </span>
                  <div className="relative">
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] w-[61px] h-[30px] px-2 text-[14px] text-[#314158] appearance-none focus:outline-none cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Reset & Search Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFor('');
                      setAppliedSearch('');
                      setStatusFilter('All');
                    }}
                    className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#701537'
                    }}
                  >
                    {t.reset}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppliedSearch(searchFor)}
                    className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
                    style={{
                      background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '16px'
                    }}
                  >
                    {t.search}
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* ── 2. CARD: TABLE DATA REGISTRY (Figma Container / Frame 2147227418) ── */}
          <div 
            className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
            style={{
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box'
            }}
          >
            {/* Table Card Header (Banner + Add New) */}
            <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex justify-between items-center">
              <h2 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#0F172B'
                }}
              >
                {isHindi ? 'बैनर' : 'Banner'}
              </h2>

              <button
                type="button"
                onClick={handleOpenCreateBanner}
                className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
                style={{
                  background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '16px'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>{t.addNew}</span>
              </button>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* Table Header matching Figma Table Header */}
                <thead>
                  <tr 
                    className="h-[45px] text-[#90A1B9]"
                    style={{
                      background: 'rgba(117, 22, 57, 0.04)',
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: '12px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    <th className="px-8 py-3 w-28 select-none">
                      <span>{t.sNo}</span>
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 w-40 select-none">
                      <span>{t.image}</span>
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 w-32 select-none">
                      <span>{t.title}</span>
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 select-none">
                      <span>{t.subtitle}</span>
                      <SortIcon />
                    </th>
                    <th className="px-6 py-3 w-40 text-center select-none">
                      <span>{t.status}</span>
                      <SortIcon />
                    </th>
                    <th className="px-8 py-3 w-32 text-right">{t.actions}</th>
                  </tr>
                </thead>

                {/* Table Body matching Figma Table Rows */}
                <tbody className="divide-y divide-[#F5F3F4]">
                  {bannersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-zinc-400 font-sans">
                        {t.loading}
                      </td>
                    </tr>
                  ) : paginatedBanners.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-zinc-400 font-sans">
                        {t.noData}
                      </td>
                    </tr>
                  ) : (
                    paginatedBanners.map((banner) => (
                      <tr 
                        key={banner.id}
                        className="h-[62px] hover:bg-zinc-50/50 transition-colors"
                      >
                        {/* ID */}
                        <td 
                          className="px-8 py-3 whitespace-nowrap"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '14px',
                            lineHeight: '16px',
                            color: '#751639'
                          }}
                        >
                          #{banner.id || 103}
                        </td>

                        {/* IMAGE / TITLE PREVIEW */}
                        <td 
                          className="px-6 py-3 whitespace-nowrap"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '16px',
                            color: '#1D293D'
                          }}
                        >
                          <span className="truncate max-w-[160px] block">
                            {isHindi ? (banner.title_hi || banner.title_en) : (banner.title_en || 'Banner')}
                          </span>
                        </td>

                        {/* TITLE (EN / HI badge) */}
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="inline-flex items-center justify-center px-3 py-1 bg-[#F1F5F9] rounded-[6px]">
                            <span 
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: '14px',
                                lineHeight: '14px',
                                letterSpacing: '0.25px',
                                textTransform: 'uppercase',
                                color: '#62748E'
                              }}
                            >
                              {banner.title_hi ? 'HI' : 'EN'}
                            </span>
                          </div>
                        </td>

                        {/* SUBTITLE */}
                        <td className="px-6 py-3">
                          <div className="inline-flex items-center gap-2 max-w-md">
                            <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FFF1F3] flex items-center justify-center shrink-0">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 2H10L13 5V14H3V2Z" stroke="#E41818" strokeWidth="1.2" strokeLinejoin="round"/>
                                <path d="M10 2V5H13" stroke="#E41818" strokeWidth="1.2" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span 
                              className="truncate max-w-xs block"
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '16px',
                                color: '#62748E'
                              }}
                            >
                              {isHindi ? (banner.subtitle_hi || banner.subtitle_en) : (banner.subtitle_en || '')}
                            </span>
                          </div>
                        </td>

                        {/* STATUS (Pill with dot) */}
                        <td className="px-6 py-3 text-center whitespace-nowrap">
                          <div 
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-[50px] ${
                              banner.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                            }`}
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '14px'
                            }}
                          >
                            <span 
                              className={`w-1.5 h-1.5 rounded-full ${
                                banner.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'
                              }`}
                            />
                            <span>{banner.is_active ? t.active : t.inactive}</span>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-8 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-5">
                            {/* Edit Icon */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditBanner(banner.id)}
                              className="text-[#666666] hover:text-[#751639] transition-colors cursor-pointer"
                              title={t.edit}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>

                            {/* Delete Icon */}
                            <button
                              type="button"
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="text-[#E41818] hover:text-[#B91C1C] transition-colors cursor-pointer"
                              title={t.delete}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Pagination matching Figma */}
            <div className="px-8 py-4 border-t border-[#F5F3F4] flex flex-col sm:flex-row justify-between items-center gap-4">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#90A1B9'
                }}
              >
                {t.showing} {paginatedBanners.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} {t.to} {Math.min(currentPage * rowsPerPage, banners.length)} {t.of} {banners.length} {t.entries}
              </span>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#90A1B9] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title={t.previous}
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                  const isActive = num === currentPage;
                  return (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-[13px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[rgba(117,22,57,0.1)] text-[#751639]'
                          : 'text-[#64748B] hover:bg-zinc-100'
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {num}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#90A1B9] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title={t.next}
                >
                  ›
                </button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 2: QUICK LINK CARDS */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'quick-links' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex justify-between items-center">
            <h2 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                color: '#0F172B'
              }}
            >
              Quick Link Cards
            </h2>

            <button
              type="button"
              onClick={() => {
                setEditingQlId(null);
                setQlTitleEn('');
                setQlTitleHi('');
                setQlDescEn('');
                setQlUrl('');
                setQlOrder(quickLinks.length + 1);
                setQlIsActive(true);
                setIsQlFormOpen(true);
              }}
              className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
              style={{
                background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '16px'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr 
                  className="h-[45px] text-[#90A1B9]"
                  style={{
                    background: 'rgba(117, 22, 57, 0.04)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}
                >
                  <th className="px-8 py-3 w-28">ID</th>
                  <th className="px-6 py-3">TITLE (EN / HI)</th>
                  <th className="px-6 py-3">DESTINATION LINK</th>
                  <th className="px-6 py-3 w-28 text-center">ORDER</th>
                  <th className="px-6 py-3 w-40 text-center">STATUS</th>
                  <th className="px-8 py-3 w-32 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {quickLinks.map((ql, idx) => (
                  <tr key={ql.id} className="h-[62px] hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-3 font-bold text-[#751639]">#{idx + 1}</td>
                    <td className="px-6 py-3">
                      <p className="font-semibold text-[#1D293D]">{ql.title_en}</p>
                      {ql.title_hi && <p className="text-xs text-zinc-500 mt-0.5">{ql.title_hi}</p>}
                    </td>
                    <td className="px-6 py-3 text-zinc-600 text-sm font-mono">{ql.url}</td>
                    <td className="px-6 py-3 text-center font-bold text-zinc-700">{ql.display_order}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[50px] text-xs font-semibold ${
                        ql.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ql.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'}`} />
                        {ql.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => {
                            setEditingQlId(ql.id);
                            setQlTitleEn(ql.title_en);
                            setQlTitleHi(ql.title_hi);
                            setQlDescEn(ql.desc_en || '');
                            setQlUrl(ql.url);
                            setQlOrder(ql.display_order);
                            setQlIsActive(ql.is_active);
                            setIsQlFormOpen(true);
                          }}
                          className="text-[#666666] hover:text-[#751639] cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteQl(ql.id)}
                          className="text-[#E41818] hover:text-[#B91C1C] cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 3: WHO WE ARE */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'who-we-are' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-6 py-4 h-[60px] border-b border-[#F5F3F4] flex items-center justify-between">
            <h2 className="font-semibold text-[16px] text-[#0F172B]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Who We Are Content Editor
            </h2>
          </div>
          <form onSubmit={handleSaveWhoWeAre} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Heading (English) *</label>
                <input
                  type="text"
                  required
                  value={whoWeAre.heading_en}
                  onChange={(e) => setWhoWeAre({ ...whoWeAre, heading_en: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Heading (हिन्दी)</label>
                <input
                  type="text"
                  value={whoWeAre.heading_hi}
                  onChange={(e) => setWhoWeAre({ ...whoWeAre, heading_hi: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Body Narrative (English) *</label>
              <textarea
                rows={4}
                required
                value={whoWeAre.body_en}
                onChange={(e) => setWhoWeAre({ ...whoWeAre, body_en: e.target.value })}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Body Narrative (हिन्दी)</label>
              <textarea
                rows={4}
                value={whoWeAre.body_hi}
                onChange={(e) => setWhoWeAre({ ...whoWeAre, body_hi: e.target.value })}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">CTA Button Label (English)</label>
                <input
                  type="text"
                  value={whoWeAre.cta_text_en}
                  onChange={(e) => setWhoWeAre({ ...whoWeAre, cta_text_en: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">CTA Button Label (हिन्दी)</label>
                <input
                  type="text"
                  value={whoWeAre.cta_text_hi}
                  onChange={(e) => setWhoWeAre({ ...whoWeAre, cta_text_hi: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">CTA Destination Link</label>
                <input
                  type="text"
                  value={whoWeAre.cta_link}
                  onChange={(e) => setWhoWeAre({ ...whoWeAre, cta_link: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F5F3F4] flex justify-end">
              <button
                type="submit"
                className="w-[150px] h-[38px] rounded-[8px] text-white font-semibold text-sm cursor-pointer shadow-md transition-all hover:opacity-95"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 4: STATISTICS */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'statistics' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex justify-between items-center">
            <h2 className="font-semibold text-[16px] text-[#0F172B]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Key Portal Statistics
            </h2>

            <button
              type="button"
              onClick={() => {
                setEditingStatId(null);
                setStatValue('');
                setStatLabelEn('');
                setStatLabelHi('');
                setStatOrder(stats.length + 1);
                setStatIsActive(true);
                setIsStatFormOpen(true);
              }}
              className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
              style={{
                background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '16px'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr 
                  className="h-[45px] text-[#90A1B9]"
                  style={{
                    background: 'rgba(117, 22, 57, 0.04)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}
                >
                  <th className="px-8 py-3 w-28">ID</th>
                  <th className="px-6 py-3 w-40">STAT VALUE</th>
                  <th className="px-6 py-3">LABEL (ENGLISH / हिन्दी)</th>
                  <th className="px-6 py-3 w-28 text-center">ORDER</th>
                  <th className="px-6 py-3 w-40 text-center">STATUS</th>
                  <th className="px-8 py-3 w-32 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {stats.map((st, idx) => (
                  <tr key={st.id} className="h-[62px] hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-3 font-bold text-[#751639]">#{idx + 1}</td>
                    <td className="px-6 py-3 font-extrabold text-[#751639] text-base">{st.value}</td>
                    <td className="px-6 py-3">
                      <p className="font-semibold text-[#1D293D]">{st.label_en}</p>
                      {st.label_hi && <p className="text-xs text-zinc-500 mt-0.5">{st.label_hi}</p>}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-zinc-700">{st.display_order}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[50px] text-xs font-semibold ${
                        st.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'}`} />
                        {st.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => {
                            setEditingStatId(st.id);
                            setStatValue(st.value);
                            setStatLabelEn(st.label_en);
                            setStatLabelHi(st.label_hi);
                            setStatOrder(st.display_order);
                            setStatIsActive(st.is_active);
                            setIsStatFormOpen(true);
                          }}
                          className="text-[#666666] hover:text-[#751639] cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteStat(st.id)}
                          className="text-[#E41818] hover:text-[#B91C1C] cursor-pointer"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 5: CAG MESSAGE */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'cag-message' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-6 py-4 h-[60px] border-b border-[#F5F3F4] flex items-center justify-between">
            <h2 className="font-semibold text-[16px] text-[#0F172B]" style={{ fontFamily: "'Inter', sans-serif" }}>
              CAG Official Message Editor
            </h2>
          </div>
          <form onSubmit={handleSaveCagMessage} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">CAG Name (English) *</label>
                <input
                  type="text"
                  required
                  value={cagMessage.cag_name_en}
                  onChange={(e) => setCagMessage({ ...cagMessage, cag_name_en: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">CAG Name (हिन्दी)</label>
                <input
                  type="text"
                  value={cagMessage.cag_name_hi}
                  onChange={(e) => setCagMessage({ ...cagMessage, cag_name_hi: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Official Title (English)</label>
                <input
                  type="text"
                  value={cagMessage.cag_title_en}
                  onChange={(e) => setCagMessage({ ...cagMessage, cag_title_en: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Official Title (हिन्दी)</label>
                <input
                  type="text"
                  value={cagMessage.cag_title_hi}
                  onChange={(e) => setCagMessage({ ...cagMessage, cag_title_hi: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Subheading / Motto (English)</label>
                <input
                  type="text"
                  value={cagMessage.subheading_en}
                  onChange={(e) => setCagMessage({ ...cagMessage, subheading_en: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Subheading / Motto (हिन्दी)</label>
                <input
                  type="text"
                  value={cagMessage.subheading_hi}
                  onChange={(e) => setCagMessage({ ...cagMessage, subheading_hi: e.target.value })}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Message Body (English) *</label>
              <textarea
                rows={4}
                required
                value={cagMessage.body_en}
                onChange={(e) => setCagMessage({ ...cagMessage, body_en: e.target.value })}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Message Body (हिन्दी)</label>
              <textarea
                rows={4}
                value={cagMessage.body_hi}
                onChange={(e) => setCagMessage({ ...cagMessage, body_hi: e.target.value })}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Photo Asset Path</label>
              <input
                type="text"
                value={cagMessage.photo_url}
                onChange={(e) => setCagMessage({ ...cagMessage, photo_url: e.target.value })}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-4 py-2.5 text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div className="pt-4 border-t border-[#F5F3F4] flex justify-end">
              <button
                type="submit"
                className="w-[150px] h-[38px] rounded-[8px] text-white font-semibold text-sm cursor-pointer shadow-md transition-all hover:opacity-95"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                Save Message
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── CREATE / EDIT BANNER MODAL ── */}
      {isBannerFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-[#EDE9E9] rounded-[12px] max-w-2xl w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsBannerFormOpen(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-base font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 
              className="text-base font-bold text-[#751639] border-b pb-3 mb-5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {editingBannerId ? 'Edit Hero Banner' : 'Create New Hero Banner'}
            </h3>

            <form onSubmit={handleSubmitBanner} className="space-y-4">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">
                  Headline Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={bannerTitleEn}
                  onChange={(e) => setBannerTitleEn(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  placeholder="Enter banner headline"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">
                  Headline Title (हिन्दी)
                </label>
                <input
                  type="text"
                  value={bannerTitleHi}
                  onChange={(e) => setBannerTitleHi(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  placeholder="बैनर शीर्षक हिंदी में दर्ज करें"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={bannerSubtitleEn}
                  onChange={(e) => setBannerSubtitleEn(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  placeholder="Enter supporting subtitle text"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">
                    Banner Image Asset URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">
                    Redirect Destination Link
                  </label>
                  <input
                    type="text"
                    value={bannerLinkUrl}
                    onChange={(e) => setBannerLinkUrl(e.target.value)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-zinc-100">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-zinc-700 text-[13px]">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#751639] border-zinc-300 rounded"
                  />
                  <span>Active &amp; Published in Carousel</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3 border-t border-zinc-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-white font-semibold text-[14px] rounded-[8px] transition-all shadow-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  Save Banner
                </button>
                <button
                  type="button"
                  onClick={() => setIsBannerFormOpen(false)}
                  className="px-5 py-2.5 border border-zinc-300 text-zinc-700 font-medium text-[14px] rounded-[8px] hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT QUICK LINK MODAL ── */}
      {isQlFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-[#EDE9E9] rounded-[12px] max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsQlFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-base font-bold cursor-pointer">✕</button>
            <h3 className="text-base font-bold text-[#751639] border-b pb-3 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              {editingQlId ? 'Edit Quick Link Card' : 'Create Quick Link Card'}
            </h3>
            <form onSubmit={handleSaveQl} className="space-y-4">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={qlTitleEn}
                  onChange={(e) => setQlTitleEn(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Title (हिन्दी)</label>
                <input
                  type="text"
                  value={qlTitleHi}
                  onChange={(e) => setQlTitleHi(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Destination URL *</label>
                <input
                  type="text"
                  required
                  value={qlUrl}
                  onChange={(e) => setQlUrl(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Display Order</label>
                  <input
                    type="number"
                    value={qlOrder}
                    onChange={(e) => setQlOrder(Number(e.target.value))}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-zinc-700 text-[13px]">
                    <input
                      type="checkbox"
                      checked={qlIsActive}
                      onChange={(e) => setQlIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#751639] rounded"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3 border-t border-zinc-100">
                <button
                  type="submit"
                  className="flex-1 py-2 text-white font-semibold text-[14px] rounded-[8px] shadow-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  Save Quick Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsQlFormOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-[8px] hover:bg-zinc-100 cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT STAT MODAL ── */}
      {isStatFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-[#EDE9E9] rounded-[12px] max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsStatFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-base font-bold cursor-pointer">✕</button>
            <h3 className="text-base font-bold text-[#751639] border-b pb-3 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              {editingStatId ? 'Edit Statistic' : 'Create Statistic'}
            </h3>
            <form onSubmit={handleSaveStat} className="space-y-4">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Statistic Value (e.g. 150+, 700+) *</label>
                <input
                  type="text"
                  required
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Label (English) *</label>
                <input
                  type="text"
                  required
                  value={statLabelEn}
                  onChange={(e) => setStatLabelEn(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div>
                <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Label (हिन्दी)</label>
                <input
                  type="text"
                  value={statLabelHi}
                  onChange={(e) => setStatLabelHi(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1 text-[13px]">Display Order</label>
                  <input
                    type="number"
                    value={statOrder}
                    onChange={(e) => setStatOrder(Number(e.target.value))}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3.5 py-2 text-[14px] text-zinc-900 focus:bg-white focus:outline-none focus:border-[#751639]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-zinc-700 text-[13px]">
                    <input
                      type="checkbox"
                      checked={statIsActive}
                      onChange={(e) => setStatIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#751639] rounded"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex gap-3 border-t border-zinc-100">
                <button
                  type="submit"
                  className="flex-1 py-2 text-white font-semibold text-[14px] rounded-[8px] shadow-md cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  Save Statistic
                </button>
                <button
                  type="button"
                  onClick={() => setIsStatFormOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-[8px] hover:bg-zinc-100 cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminBanners() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400 font-sans">Loading Banners Suite…</div>}>
      <AdminBannersContent />
    </Suspense>
  );
}
