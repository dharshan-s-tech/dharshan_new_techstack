'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, NewsItem as DataNewsItem } from '@/lib/dataManager';
import { 
  Pencil, 
  Trash2, 
  Newspaper, 
  Video, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  PlayCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { FilePreviewAction } from '@/components/admin/ListClientHelpers';
import { useAdminLanguage } from '@/lib/useAdminLanguage';

interface NewsDisplayItem {
  id: string;
  title_en: string;
  desc_en: string;
  news_type: string;
  tag: string;
  publish_date: string;
  is_active: boolean;
  is_primary_site?: boolean;
  image_url?: string;
}

interface VideoGalleryItem {
  id: string;
  title_en: string;
  title_hi?: string;
  duration: string;
  publish_date: string;
  thumbnail_url: string;
  video_url: string;
  show_in_whats_new: boolean;
  is_active: boolean;
}

const DEFAULT_VIDEOS: VideoGalleryItem[] = [
  {
    id: 'vg-1',
    title_en: 'Documentary on 160+ Years Journey of Indian Audit and Accounts Department (IAAD)',
    title_hi: 'भारतीय लेखापरीक्षा और लेखा विभाग (आईएएडी) की 160+ वर्षों की यात्रा पर वृत्तचित्र',
    duration: '18:45',
    publish_date: '16 Nov 2023',
    thumbnail_url: '/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png',
    video_url: 'https://www.youtube.com/embed/SWSXKcJ4irQ',
    show_in_whats_new: true,
    is_active: true
  },
  {
    id: 'vg-2',
    title_en: 'Digital Auditing Paradigm: Implementation of One IAAD One System (OIOS)',
    title_hi: 'डिजिटल लेखापरीक्षा प्रतिमान: वन आईएएडी वन सिस्टम (ओआईओएस) का कार्यान्वयन',
    duration: '12:20',
    publish_date: '10 Feb 2024',
    thumbnail_url: '/assets/9e9d6d62858888b5ecf0a28f41e57c6b546d16f8.png',
    video_url: 'https://www.youtube.com/embed/SWSXKcJ4irQ',
    show_in_whats_new: false,
    is_active: true
  },
  {
    id: 'vg-3',
    title_en: 'Environmental Auditing & Sustainable Development Goals - SAI India at INTOSAI WGEA',
    title_hi: 'पर्यावरण लेखापरीक्षा और सतत विकास लक्ष्य - इंटोसाई डब्ल्यूजीईए में साई भारत',
    duration: '15:10',
    publish_date: '24 Apr 2024',
    thumbnail_url: '/assets/557f9ea1496a79ee82b683efb1c0eb7040fd8522.png',
    video_url: 'https://www.youtube.com/embed/SWSXKcJ4irQ',
    show_in_whats_new: true,
    is_active: true
  },
  {
    id: 'vg-4',
    title_en: 'Public Financial Management & The Role of Supreme Audit Institutions',
    title_hi: 'सार्वजनिक वित्तीय प्रबंधन और सर्वोच्च लेखापरीक्षा संस्थानों की भूमिका',
    duration: '22:05',
    publish_date: '15 Dec 2023',
    thumbnail_url: '/assets/c5aee22d7d8f5cb4eb5f78ee9d1a3c7ddac67cf6.png',
    video_url: 'https://www.youtube.com/embed/SWSXKcJ4irQ',
    show_in_whats_new: false,
    is_active: true
  }
];

function AdminNewsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = getApiBaseUrl();
  const { isHindi, t } = useAdminLanguage();

  // Active Tab ('news' | 'videos')
  const tabParam = searchParams.get('tab') || 'news';
  const [activeTab, setActiveTab] = useState<'news' | 'videos'>(tabParam === 'videos' ? 'videos' : 'news');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'videos') {
      setActiveTab('videos');
    } else {
      setActiveTab('news');
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

  // ── 1. NEWS STATE ──
  const [news, setNews] = useState<NewsDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // News Form
  const [isNewsFormOpen, setIsNewsFormOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsDescEn, setNewsDescEn] = useState('');
  const [newsType, setNewsType] = useState<'trending' | 'featured'>('trending');
  const [newsTag, setNewsTag] = useState('General');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsIsPrimarySite, setNewsIsPrimarySite] = useState(true);
  const [newsIsActive, setNewsIsActive] = useState(true);

  // ── 2. VIDEO GALLERY STATE ──
  const [videos, setVideos] = useState<VideoGalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cag_video_gallery_items');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_VIDEOS;
  });
  const [videoSearch, setVideoSearch] = useState('');
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoTitleEn, setVideoTitleEn] = useState('');
  const [videoTitleHi, setVideoTitleHi] = useState('');
  const [videoDuration, setVideoDuration] = useState('15:00');
  const [videoDate, setVideoDate] = useState('June 2026');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png');
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/SWSXKcJ4irQ');
  const [videoShowWhatsNew, setVideoShowWhatsNew] = useState(false);
  const [videoIsActive, setVideoIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== 'All' ? `status=${statusFilter.toLowerCase()}` : 'status=all';
      const res = await fetch(`${API_URL}/api/news?${statusParam}`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();

      let rawList: any[] = Array.isArray(data) && data.length > 0 ? data : dataManager.getNews();
      let formatted: NewsDisplayItem[] = rawList.map((item: any) => ({
        id: item.id?.toString() || Math.random().toString(),
        title_en: item.title_en || item.title || '',
        desc_en: item.content_en || item.desc || '',
        news_type: item.news_type || item.type || 'trending',
        tag: item.tag || 'General',
        publish_date: item.publish_date || item.date || 'June 2026',
        is_active: item.is_active !== undefined ? item.is_active : true,
        is_primary_site: item.is_primary_site !== undefined ? item.is_primary_site : true,
        image_url: item.image_url || item.image || ''
      }));

      if (appliedSearch) {
        formatted = formatted.filter((item) =>
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      if (typeFilter !== 'All') {
        formatted = formatted.filter((item) => item.news_type === typeFilter);
      }

      if (sortFilter === 'title_asc') {
        formatted.sort((a, b) => (a.title_en || '').localeCompare(b.title_en || ''));
      } else if (sortFilter === 'title_desc') {
        formatted.sort((a, b) => (b.title_en || '').localeCompare(a.title_en || ''));
      } else if (sortFilter === 'oldest') {
        formatted.sort((a, b) => (new Date(a.publish_date).getTime() || 0) - (new Date(b.publish_date).getTime() || 0));
      } else {
        formatted.sort((a, b) => (new Date(b.publish_date).getTime() || 0) - (new Date(a.publish_date).getTime() || 0));
      }

      setNews(formatted);
    } catch (err) {
      const localData = dataManager.getNews();
      let formatted: NewsDisplayItem[] = localData.map((item) => ({
        id: item.id,
        title_en: item.title,
        desc_en: item.desc,
        news_type: item.type,
        tag: item.tag || 'General',
        publish_date: item.date,
        is_active: true,
        is_primary_site: true,
        image_url: item.image_url || ''
      }));

      if (appliedSearch) {
        formatted = formatted.filter((item) =>
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      if (typeFilter !== 'All') {
        formatted = formatted.filter((item) => item.news_type === typeFilter);
      }

      setNews(formatted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleNewsChange = () => loadData();
    window.addEventListener('newsChange', handleNewsChange);
    return () => window.removeEventListener('newsChange', handleNewsChange);
  }, [appliedSearch, statusFilter, typeFilter, sortFilter]);

  // News Handlers
  const handleOpenCreateNews = () => {
    setEditingNewsId(null);
    setNewsTitleEn('');
    setNewsDescEn('');
    setNewsType('trending');
    setNewsTag('General');
    setNewsImageUrl('');
    setNewsIsPrimarySite(true);
    setNewsIsActive(true);
    setIsNewsFormOpen(true);
  };

  const handleOpenEditNews = (id: string) => {
    const item = news.find((n) => n.id === id);
    if (!item) return;

    setEditingNewsId(id);
    setNewsTitleEn(item.title_en || '');
    setNewsDescEn(item.desc_en || '');
    setNewsType((item.news_type as any) || 'trending');
    setNewsTag(item.tag || 'General');
    setNewsImageUrl(item.image_url || '');
    setNewsIsPrimarySite(item.is_primary_site !== undefined ? item.is_primary_site : true);
    setNewsIsActive(item.is_active);
    setIsNewsFormOpen(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news notice?')) return;
    dataManager.deleteNews(id);
    loadData();
    setToast({ type: 'success', text: 'Notice deleted successfully.' });
  };

  const handleSubmitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const record: DataNewsItem = {
      id: editingNewsId || `news-${Date.now()}`,
      title: newsTitleEn,
      desc: newsDescEn,
      date: 'June 4, 2026',
      type: newsType,
      tag: newsTag,
      image_url: newsImageUrl
    };

    dataManager.saveNews(record);
    setIsNewsFormOpen(false);
    loadData();
    setToast({ type: 'success', text: editingNewsId ? 'Notice updated successfully.' : 'New notice published successfully.' });
  };

  // Video Gallery Handlers
  const handleOpenCreateVideo = () => {
    setEditingVideoId(null);
    setVideoTitleEn('');
    setVideoTitleHi('');
    setVideoDuration('15:00');
    setVideoDate('June 2026');
    setVideoThumbnailUrl('/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png');
    setVideoUrl('https://www.youtube.com/embed/SWSXKcJ4irQ');
    setVideoShowWhatsNew(false);
    setVideoIsActive(true);
    setIsVideoFormOpen(true);
  };

  const handleOpenEditVideo = (v: VideoGalleryItem) => {
    setEditingVideoId(v.id);
    setVideoTitleEn(v.title_en);
    setVideoTitleHi(v.title_hi || '');
    setVideoDuration(v.duration);
    setVideoDate(v.publish_date);
    setVideoThumbnailUrl(v.thumbnail_url);
    setVideoUrl(v.video_url);
    setVideoShowWhatsNew(v.show_in_whats_new);
    setVideoIsActive(v.is_active);
    setIsVideoFormOpen(true);
  };

  const handleDeleteVideo = (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_video_gallery_items', JSON.stringify(updated));
    }
    setToast({ type: 'success', text: 'Video deleted from gallery.' });
  };

  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const record: VideoGalleryItem = {
      id: editingVideoId || `vg-${Date.now()}`,
      title_en: videoTitleEn,
      title_hi: videoTitleHi,
      duration: videoDuration,
      publish_date: videoDate,
      thumbnail_url: videoThumbnailUrl,
      video_url: videoUrl,
      show_in_whats_new: videoShowWhatsNew,
      is_active: videoIsActive
    };

    let updated: VideoGalleryItem[];
    if (editingVideoId) {
      updated = videos.map(v => v.id === editingVideoId ? record : v);
    } else {
      updated = [record, ...videos];
    }
    setVideos(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_video_gallery_items', JSON.stringify(updated));
    }
    setIsVideoFormOpen(false);
    setToast({ type: 'success', text: editingVideoId ? 'Video updated successfully.' : 'New video added to gallery.' });
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* Toast */}
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

      {/* ── TOP PAGE TITLE ── */}
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
          {isHindi ? (activeTab === 'news' ? 'समाचार और कार्यक्रम' : 'वीडियो गैलरी') : (activeTab === 'news' ? 'News & Events' : 'Video Gallery')}
        </h1>
      </div>

      {/* ── TAB 1: NEWS & EVENTS ── */}
      {activeTab === 'news' && (
        <>
          {/* ── 1. CARD: SEARCH & FILTER ── */}
          <div 
            className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
            style={{
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box'
            }}
          >
            <div className="px-5 py-4 h-[60px] flex items-center justify-between">
              <div className="flex items-center gap-3">
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

            <div className="p-5 border-t border-[#F5F3F4] space-y-4">
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

                {/* Notice Type */}
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
                    {isHindi ? 'नोटिस प्रकार' : 'Notice Type'}
                  </label>
                  <div className="relative w-full">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <option value="All">{t.all}</option>
                      <option value="trending">{isHindi ? 'ट्रेंडिंग समाचार' : 'Trending News'}</option>
                      <option value="featured">{isHindi ? 'प्रमुख सुर्खियाँ' : 'Featured Headlines'}</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="border-t border-[#F5F3F4] pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14px', color: '#45556C' }}>
                    {t.rowsPerPage}
                  </span>
                  <div className="relative">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
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

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => { setSearchFor(''); setAppliedSearch(''); setStatusFilter('All'); setTypeFilter('All'); setSortFilter('newest'); }}
                    className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer font-medium text-[14px] text-[#701537]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {t.reset}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppliedSearch(searchFor)}
                    className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 font-semibold text-[14px]"
                    style={{
                      background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {t.search}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── 2. CARD: TABLE DATA REGISTRY ── */}
          <div 
            className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden mb-12"
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
                {isHindi ? 'समाचार और कार्यक्रम' : 'News & Events'}
              </h2>

              <button
                type="button"
                onClick={handleOpenCreateNews}
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
                    <th className="px-6 py-3 w-20">{t.sNo}</th>
                    <th className="px-4 py-3 w-28">{t.image}</th>
                    <th className="px-6 py-3">{t.title}</th>
                    <th className="px-4 py-3 w-28 text-center">{t.category}</th>
                    <th className="px-4 py-3 w-24">{isHindi ? 'टैग' : 'TAG'}</th>
                    <th className="px-4 py-3 w-28 font-mono">{t.date}</th>
                    <th className="px-4 py-3 w-32 text-center">{t.status}</th>
                    <th className="px-6 py-3 w-28 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F3F4]">
                  {loading ? (
                    <tr><td colSpan={8} className="px-8 py-12 text-center text-zinc-400 font-sans">{t.loading}</td></tr>
                  ) : news.length === 0 ? (
                    <tr><td colSpan={8} className="px-8 py-12 text-center text-zinc-400 font-sans">{t.noData}</td></tr>
                  ) : (
                    news.slice((page - 1) * pageSize, page * pageSize).map((item, idx) => (
                      <tr key={item.id} className="h-[64px] hover:bg-zinc-50/50 transition-colors">
                        <td 
                          className="px-6 py-3 whitespace-nowrap font-bold"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#751639' }}
                        >
                          #{(page - 1) * pageSize + idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <FilePreviewAction 
                            url={item.image_url || '/assets/news-1.jpg'} 
                            type="image" 
                            showThumbnail={true} 
                            alt={item.title_en} 
                          />
                        </td>
                        <td className="px-6 py-3 max-w-md">
                          <div className="font-semibold text-[#1D293D] line-clamp-1" style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
                            {item.title_en}
                          </div>
                          <div className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{item.desc_en}</div>
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 bg-[#F1F5F9] rounded-[6px] text-xs font-semibold text-[#62748E] capitalize">
                            {item.news_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-600 text-sm">{item.tag}</td>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-500">{item.publish_date}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div 
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-[50px] ${
                              item.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                            }`}
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px' }}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'}`} />
                            <span>{item.is_active ? t.active : t.inactive}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-4">
                            <button 
                              onClick={() => handleOpenEditNews(item.id)} 
                              className="text-[#666666] hover:text-[#751639] transition-colors cursor-pointer"
                              title={t.edit}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteNews(item.id)} 
                              className="text-[#E41818] hover:text-[#B91C1C] transition-colors cursor-pointer"
                              title={t.delete}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-4 border-t border-[#F5F3F4] flex flex-col sm:flex-row justify-between items-center gap-4">
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14px', color: '#90A1B9' }}>
                {t.showing} {news.length > 0 ? (page - 1) * pageSize + 1 : 0} {t.to} {Math.min(page * pageSize, news.length)} {t.of} {news.length} {t.entries}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#90A1B9] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title={t.previous}
                >
                  ‹
                </button>
                <span className="px-3 h-8 rounded-[8px] flex items-center justify-center text-[13px] font-medium bg-[rgba(117,22,57,0.1)] text-[#751639]">
                  {isHindi ? `पृष्ठ ${page} / ${Math.ceil(news.length / pageSize) || 1}` : `Page ${page} of ${Math.ceil(news.length / pageSize) || 1}`}
                </span>
                <button
                  disabled={page >= Math.ceil(news.length / pageSize)}
                  onClick={() => setPage(p => Math.min(Math.ceil(news.length / pageSize), p + 1))}
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

      {/* ── TAB 2: VIDEO GALLERY ── */}
      {activeTab === 'videos' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden mb-12"
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
              Video Gallery
            </h2>

            <button
              onClick={handleOpenCreateVideo}
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
                  <th className="px-6 py-3 w-20">ID</th>
                  <th className="px-4 py-3 w-36 text-center">PREVIEW</th>
                  <th className="px-6 py-3">VIDEO TITLE</th>
                  <th className="px-4 py-3 w-28 text-center">WHAT'S NEW</th>
                  <th className="px-4 py-3 w-24 text-center">DURATION</th>
                  <th className="px-4 py-3 w-28 font-mono">DATE</th>
                  <th className="px-4 py-3 w-24 text-center">STATUS</th>
                  <th className="px-6 py-3 w-28 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {videos.map((v, idx) => (
                  <tr key={v.id} className="h-[64px] hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap font-bold text-[#751639]">#{idx + 1}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="relative inline-block w-24 h-14 bg-zinc-900 rounded-[6px] overflow-hidden border border-zinc-200">
                        <img src={v.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <PlayCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-[#1D293D]">{v.title_en}</div>
                      {v.title_hi && <div className="text-xs text-zinc-500 mt-0.5">{v.title_hi}</div>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-[4px] text-xs font-semibold ${
                        v.show_in_whats_new ? 'bg-amber-100 text-amber-900' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {v.show_in_whats_new ? '★ Active' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-sm">{v.duration}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{v.publish_date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[50px] text-xs font-semibold ${
                        v.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${v.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'}`} />
                        {v.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-4">
                        <button onClick={() => handleOpenEditVideo(v)} className="text-[#666666] hover:text-[#751639] transition-colors cursor-pointer">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteVideo(v.id)} className="text-[#E41818] hover:text-[#B91C1C] transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
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

      {/* ── MODAL: NEWS EDIT / CREATE ── */}
      {isNewsFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border border-[#ced4da] max-w-2xl w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsNewsFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 text-base font-bold cursor-pointer">✕</button>
            <h3 className="text-sm font-bold text-zinc-900 border-b pb-3 mb-4">
              {editingNewsId ? 'Edit News / Notice Record' : 'Add New Announcement'}
            </h3>
            <form onSubmit={handleSubmitNews} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={newsTitleEn}
                  onChange={(e) => setNewsTitleEn(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                  placeholder="Enter notice title"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description / Summary</label>
                <textarea
                  rows={3}
                  value={newsDescEn}
                  onChange={(e) => setNewsDescEn(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                  placeholder="Enter details"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Notice Type</label>
                  <select
                    value={newsType}
                    onChange={(e) => setNewsType(e.target.value as any)}
                    className="w-full border border-zinc-300 px-2.5 py-1.5 focus:border-[#751639] outline-none"
                  >
                    <option value="trending">Trending News Ticker</option>
                    <option value="featured">Featured News Headline</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={newsTag}
                    onChange={(e) => setNewsTag(e.target.value)}
                    className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                    placeholder="e.g. Audit / General"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Photo / Thumbnail URL</label>
                <input
                  type="text"
                  value={newsImageUrl}
                  onChange={(e) => setNewsImageUrl(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                  placeholder="e.g. /assets/news-1.jpg"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2 border-t border-zinc-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={newsIsPrimarySite}
                    onChange={(e) => setNewsIsPrimarySite(e.target.checked)}
                    className="w-4 h-4 text-[#751639] focus:ring-[#751639] border-zinc-300"
                  />
                  <span>Display on Primary CAG Site</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={newsIsActive}
                    onChange={(e) => setNewsIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#751639] focus:ring-[#751639] border-zinc-300"
                  />
                  <span>Active &amp; Published</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3 border-t border-zinc-200">
                <button
                  type="submit"
                  className="flex-1 py-2 text-white font-bold cursor-pointer"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Notice Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewsFormOpen(false)}
                  className="px-5 py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: VIDEO GALLERY EDIT / CREATE ── */}
      {isVideoFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border border-[#ced4da] max-w-2xl w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsVideoFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 text-base font-bold cursor-pointer">✕</button>
            <h3 className="text-sm font-bold text-zinc-900 border-b pb-3 mb-4">
              {editingVideoId ? 'Edit Video Feature' : 'Add New Video to Gallery'}
            </h3>
            <form onSubmit={handleSubmitVideo} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Video Title (English) *</label>
                <input
                  type="text"
                  required
                  value={videoTitleEn}
                  onChange={(e) => setVideoTitleEn(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                  placeholder="Enter documentary or seminar title"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Video Title (हिन्दी)</label>
                <input
                  type="text"
                  value={videoTitleHi}
                  onChange={(e) => setVideoTitleHi(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                  placeholder="वीडियो शीर्षक दर्ज करें"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Duration (mm:ss)</label>
                  <input
                    type="text"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none font-mono"
                    placeholder="e.g. 18:45"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Publish Date Label</label>
                  <input
                    type="text"
                    value={videoDate}
                    onChange={(e) => setVideoDate(e.target.value)}
                    className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none font-mono"
                    placeholder="e.g. 16 Nov 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Video Embed URL (YouTube or MP4) *</label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none font-mono text-blue-700"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Thumbnail Cover Image URL</label>
                <input
                  type="text"
                  value={videoThumbnailUrl}
                  onChange={(e) => setVideoThumbnailUrl(e.target.value)}
                  className="w-full border border-zinc-300 px-3 py-1.5 focus:border-[#751639] outline-none"
                  placeholder="/assets/..."
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 pt-2 border-t border-zinc-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={videoShowWhatsNew}
                    onChange={(e) => setVideoShowWhatsNew(e.target.checked)}
                    className="w-4 h-4 text-[#751639] focus:ring-[#751639] border-zinc-300"
                  />
                  <span>Show in "What's New" Section</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={videoIsActive}
                    onChange={(e) => setVideoIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#751639] focus:ring-[#751639] border-zinc-300"
                  />
                  <span>Active &amp; Visible</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3 border-t border-zinc-200">
                <button
                  type="submit"
                  className="flex-1 py-2 text-white font-bold cursor-pointer"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Video Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsVideoFormOpen(false)}
                  className="px-5 py-2 border border-zinc-300 text-zinc-700 hover:bg-zinc-100 cursor-pointer"
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

export default function AdminNews() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading News &amp; Media Suite...</div>}>
      <AdminNewsInner />
    </Suspense>
  );
}
