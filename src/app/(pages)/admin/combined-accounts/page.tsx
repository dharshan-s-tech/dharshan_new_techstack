'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, CombinedAccountItem as LocalCombinedItem } from '@/lib/dataManager';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { 
  Pencil, 
  Eye, 
  Trash2, 
  ExternalLink, 
  Plus, 
  FileText, 
  X, 
  Upload, 
  Paperclip,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface CombinedAccountDisplayItem {
  id: number | string;
  rawId: string;
  title_en: string;
  title_hi?: string;
  category: 'combined' | 'conference';
  account_year: string;
  volume?: string;
  size: string;
  file_url: string;
  is_active: boolean;
  source?: string;
}

function AdminCombinedAccountsContent() {
  const { isHindi, t, getText } = useAdminLanguage();
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<CombinedAccountDisplayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('year_desc');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Sync URL Query Parameters to Filter States
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategoryFilter(catParam);
    } else {
      setCategoryFilter('All');
    }
    setPage(1);
  }, [searchParams]);

  // View Details Modal State
  const [viewingItem, setViewingItem] = useState<CombinedAccountDisplayItem | null>(null);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [category, setCategory] = useState<'combined' | 'conference'>('combined');
  const [accountYear, setAccountYear] = useState('2024 - 25');
  const [volume, setVolume] = useState('Full Comprehensive Volume');
  const [size, setSize] = useState('18.5 MB');
  const [fileUrl, setFileUrl] = useState('#');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please select a valid PDF document (.pdf).');
      return;
    }

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setUploadedFileName(file.name);
    setUploadedFileSize(formattedSize);
    setSize(formattedSize);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setFileUrl(data.url);
          setIsUploading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend upload failed, using local Data URL fallback:', err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileUrl(event.target.result as string);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      if (appliedSearch) params.set('query', appliedSearch);
      if (statusFilter !== 'All') params.set('status', statusFilter.toLowerCase());
      else params.set('status', 'all');
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (yearFilter !== 'All') params.set('year', yearFilter);
      if (sortFilter) params.set('sort', sortFilter);

      const res = await fetch(`${API_URL}/api/combined-accounts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data) ? data : (data.items || []);
        
        const formatted: CombinedAccountDisplayItem[] = rawItems.map((item: any, idx: number) => ({
          id: (page - 1) * pageSize + idx + 1,
          rawId: item.id?.toString() || `${idx + 1}`,
          title_en: item.title_en || item.title || 'Combined Finance Account',
          title_hi: item.title_hi || '',
          category: (item.category === 'conference' || (item.title || '').toLowerCase().includes('conference')) ? 'conference' : 'combined',
          account_year: item.account_year || item.year || '2024 - 25',
          volume: item.volume || 'Full Volume',
          size: item.size || '18.5 MB',
          file_url: item.file_url || item.pdf_url || '#',
          is_active: item.is_active ?? true,
          source: item.source || 'remote_db'
        }));

        setAccounts(formatted);
        setTotalCount(data.total || formatted.length);
        setTotalPages(data.total_pages || Math.ceil((data.total || formatted.length) / pageSize) || 1);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('API error for combined-accounts, falling back to local dataManager:', err);
    }

    // Local dataManager fallback
    let localList = dataManager.getCombinedAccounts();

    if (appliedSearch) {
      localList = localList.filter(item =>
        item.title_en.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        (item.title_hi && item.title_hi.toLowerCase().includes(appliedSearch.toLowerCase()))
      );
    }

    if (categoryFilter !== 'All') {
      localList = localList.filter(item => item.category === categoryFilter);
    }

    if (yearFilter !== 'All') {
      localList = localList.filter(item => item.account_year.includes(yearFilter));
    }

    const parseId = (val: any) => {
      const match = String(val || '').match(/\d+/g);
      return match ? parseInt(match.join(''), 10) : 0;
    };
    const parseYear = (val: any) => {
      const match = String(val || '').match(/\d{4}/);
      return match ? parseInt(match[0], 10) : 0;
    };

    if (sortFilter === 'newest') {
      localList.sort((a, b) => parseId(b.id) - parseId(a.id));
    } else if (sortFilter === 'oldest') {
      localList.sort((a, b) => parseId(a.id) - parseId(b.id));
    } else if (sortFilter === 'year_desc') {
      localList.sort((a, b) => (parseYear(b.account_year) - parseYear(a.account_year)) || (parseId(b.id) - parseId(a.id)));
    } else if (sortFilter === 'year_asc') {
      localList.sort((a, b) => (parseYear(a.account_year) - parseYear(b.account_year)) || (parseId(a.id) - parseId(b.id)));
    } else if (sortFilter === 'title_asc') {
      localList.sort((a, b) => (a.title_en || '').localeCompare(b.title_en || ''));
    } else if (sortFilter === 'title_desc') {
      localList.sort((a, b) => (b.title_en || '').localeCompare(a.title_en || ''));
    }

    const start = (page - 1) * pageSize;
    const paginated = localList.slice(start, start + pageSize).map((item, idx) => ({
      id: start + idx + 1,
      rawId: item.id.toString(),
      title_en: item.title_en,
      title_hi: item.title_hi,
      category: item.category,
      account_year: item.account_year,
      volume: item.volume,
      size: item.size,
      file_url: item.file_url,
      is_active: item.is_active,
      source: 'local_cms'
    }));

    setAccounts(paginated);
    setTotalCount(localList.length);
    setTotalPages(Math.ceil(localList.length / pageSize) || 1);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('combinedAccountsChange', handleUpdate);
    return () => window.removeEventListener('combinedAccountsChange', handleUpdate);
  }, [appliedSearch, statusFilter, categoryFilter, yearFilter, sortFilter, page, pageSize]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
    setPage(1);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setYearFilter('All');
    setSortFilter('year_desc');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setCategory(categoryFilter === 'conference' ? 'conference' : 'combined');
    setAccountYear('2024 - 25');
    setVolume('Full Comprehensive Volume');
    setSize('18.5 MB');
    setFileUrl('#');
    setUploadedFileName('');
    setUploadedFileSize('');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: CombinedAccountDisplayItem) => {
    setEditingId(item.rawId);
    setTitleEn(item.title_en);
    setTitleHi(item.title_hi || '');
    setCategory(item.category);
    setAccountYear(item.account_year);
    setVolume(item.volume || 'Full Volume');
    setSize(item.size);
    setFileUrl(item.file_url);
    setUploadedFileName(item.file_url ? item.file_url.split('/').pop() || '' : '');
    setUploadedFileSize('');
    setIsActive(item.is_active);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (rawId: string) => {
    if (!confirm('Are you sure you want to delete this Combined Accounts / Conference record?')) return;
    try {
      await fetch(`${API_URL}/api/combined-accounts/${rawId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete combined account:', err);
    }
    const numId = parseInt(rawId);
    if (!isNaN(numId)) {
      dataManager.deleteCombinedAccount(numId);
    }
    await loadData();
    if (viewingItem?.rawId === rawId) {
      setViewingItem(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingId ? (parseInt(editingId) || Date.now()) : Date.now();

    const record: LocalCombinedItem = {
      id: targetId,
      title_en: titleEn,
      title_hi: titleHi || undefined,
      category: category,
      account_year: accountYear,
      volume: volume,
      size: size,
      file_url: fileUrl,
      is_active: isActive
    };

    try {
      const url = editingId
        ? `${API_URL}/api/combined-accounts/${editingId}`
        : `${API_URL}/api/combined-accounts`;
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.warn('Backend save error, updating local dataManager:', err);
    }

    dataManager.saveCombinedAccount(record);
    setIsDrawerOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
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
          {isHindi ? 'संयुक्त वित्त एवं राजस्व लेखे और सम्मेलन' : 'Combined Accounts & Conferences'}
        </h1>
      </div>

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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Search Keyword */}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
                placeholder={isHindi ? 'शीर्षक कीवर्ड दर्ज करें...' : 'Enter title keyword...'}
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
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
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

            {/* Category Filter */}
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
                {isHindi ? 'श्रेणी' : 'Category'}
              </label>
              <div className="relative w-full">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{isHindi ? 'सभी श्रेणियाँ' : 'All Categories'}</option>
                  <option value="combined">{isHindi ? 'संयुक्त वित्त एवं राजस्व लेखे' : 'Combined Finance & Revenue Accounts'}</option>
                  <option value="conference">{isHindi ? 'राज्य वित्त सचिव सम्मेलन' : 'State Finance Secretaries Conference'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Order */}
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
                {isHindi ? 'क्रमबद्ध करें' : 'Sort Order'}
              </label>
              <div className="relative w-full">
                <select
                  value={sortFilter}
                  onChange={(e) => {
                    setSortFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="year_desc">{isHindi ? 'वित्तीय वर्ष (नवीनतम पहले)' : 'Financial Year (Newest first)'}</option>
                  <option value="year_asc">{isHindi ? 'वित्तीय वर्ष (पुरातन पहले)' : 'Financial Year (Oldest first)'}</option>
                  <option value="newest">{isHindi ? 'नवीनतम जोड़ा गया' : 'Newly Added (ID Desc)'}</option>
                  <option value="oldest">{isHindi ? 'पुरातन जोड़ा गया' : 'Oldest Added (ID Asc)'}</option>
                  <option value="title_asc">{isHindi ? 'शीर्षक (अ से ज्ञ)' : 'Title (A to Z)'}</option>
                  <option value="title_desc">{isHindi ? 'शीर्षक (ज्ञ से अ)' : 'Title (Z to A)'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Filter Controls */}
          <div className="border-t border-[#F5F3F4] pt-4 mt-2 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#62748E'
                }}
              >
                {t.rowsPerPage}
              </span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[35px] px-3 pr-8 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleSearchReset}
                className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer font-medium text-[14px] text-[#701537]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {t.reset}
              </button>

              <button
                type="button"
                onClick={handleSearchGo}
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
            {isHindi ? 'संयुक्त वित्त एवं राजस्व लेखे और सम्मेलन पंजिका' : 'Combined Accounts & Conferences Registry'}
          </h2>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="h-[36px] px-4 rounded-[8px] text-white text-[14px] font-medium shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? '+ नया विवरण जोड़ें' : '+ Add Statement'}</span>
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#F5F3F4]">
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-16" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>{t.sNo}</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider min-w-[280px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>{isHindi ? 'विवरण शीर्षक' : 'STATEMENT TITLE'}</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'श्रेणी' : 'CATEGORY'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.year}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'आकार' : 'SIZE'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.status}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#90A1B9]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span style={{ fontFamily: "'Inter', sans-serif" }}>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#90A1B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.noData}
                  </td>
                </tr>
              ) : (
                accounts.map((item) => (
                  <tr key={item.rawId} className="hover:bg-[#FDFBFC] transition-colors">
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span 
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#751639'
                        }}
                      >
                        #{item.id}
                      </span>
                    </td>

                    {/* Statement Title */}
                    <td className="px-6 py-4">
                      <div 
                        className="cursor-pointer hover:underline"
                        onClick={() => setViewingItem(item)}
                        title={isHindi ? 'विवरण देखने के लिए क्लिक करें' : 'Click to view details'}
                      >
                        <div 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#0F172B'
                          }}
                        >
                          {getText(item.title_en, item.title_hi)}
                        </div>
                        {isHindi ? (
                          item.title_en && item.title_hi && (
                            <div className="text-[12px] text-[#62748E] line-clamp-1 mt-0.5">
                              {item.title_en}
                            </div>
                          )
                        ) : (
                          item.title_hi && (
                            <div className="text-[12px] text-[#62748E] line-clamp-1 mt-0.5">
                              {item.title_hi}
                            </div>
                          )
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${
                        item.category === 'conference'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.category === 'conference' 
                          ? (isHindi ? 'राज्य वित्त सचिव सम्मेलन' : 'Conference') 
                          : (isHindi ? 'संयुक्त वित्त एवं राजस्व लेखे' : 'Combined Accounts')}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-[13px] font-semibold text-[#0F172B]">
                        {item.account_year}
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-6 py-4 text-center text-[13px] text-[#62748E]">
                      {item.size || 'PDF'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      {item.is_active ? (
                        <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                          {t.active}
                        </span>
                      ) : (
                        <span className="bg-[#FDF4F0] text-[#E11D48] border border-[#FFE4E6] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                          {t.inactive}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                          title={isHindi ? 'विवरण देखें' : 'View Details'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                          title={isHindi ? 'संपादित करें' : 'Edit Account'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.rawId)}
                          className="text-[#EF4444] hover:text-[#B91C1C] transition-colors cursor-pointer"
                          title={isHindi ? 'हटाएँ' : 'Delete Account'}
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

        {/* ── 3. PAGINATION FOOTER ── */}
        <div className="px-6 py-4 border-t border-[#F5F3F4] flex flex-wrap items-center justify-between gap-4">
          <div 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#62748E'
            }}
          >
            {t.showing} {accounts.length > 0 ? (page - 1) * pageSize + 1 : 0} {t.to} {Math.min(page * pageSize, totalCount)} {t.of} {totalCount} {t.entries}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-8 h-8 rounded-[6px] border border-[#EDE9E9] flex items-center justify-center text-[#62748E] hover:bg-[#F8F7F7] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 5) {
                if (page > 3 && page < totalPages - 2) {
                  pageNum = page - 2 + idx;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                }
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                    page === pageNum
                      ? 'bg-[#751639] text-white shadow-xs'
                      : 'text-[#62748E] hover:bg-[#F8F7F7]'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-8 h-8 rounded-[6px] border border-[#EDE9E9] flex items-center justify-center text-[#62748E] hover:bg-[#F8F7F7] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ── 4. VIEW DETAILS MODAL ── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EDE9E9] max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div>
                <h3 className="font-semibold text-[16px] flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {isHindi ? 'विवरण प्रोफ़ाइल जानकारी' : 'Statement Profile Details'}
                </h3>
                <p className="text-[12px] text-white/80">ID: #{viewingItem.rawId}</p>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              <div className="bg-[#F8F7F7] p-4 rounded-lg border border-[#EDE9E9] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#62748E] uppercase tracking-wider block">
                  {isHindi ? 'शीर्षक (अंग्रेज़ी):' : 'Title (English):'}
                </span>
                <p className="text-[16px] font-bold text-[#751639]">{viewingItem.title_en}</p>
                {viewingItem.title_hi && (
                  <div className="pt-2 border-t border-[#EDE9E9] mt-2">
                    <span className="text-[11px] font-semibold text-[#62748E] uppercase tracking-wider block">
                      {isHindi ? 'शीर्षक (हिन्दी):' : 'Title (हिन्दी):'}
                    </span>
                    <p className="text-[14px] font-medium text-[#314158]">{viewingItem.title_hi}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'श्रेणी:' : 'Category:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">
                    {viewingItem.category === 'conference' 
                      ? (isHindi ? 'राज्य वित्त सचिव सम्मेलन' : 'State Finance Secretaries Conference') 
                      : (isHindi ? 'संयुक्त वित्त एवं राजस्व लेखे' : 'Combined Finance and Revenue Accounts')}
                  </span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'वित्तीय वर्ष:' : 'Financial Year:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingItem.account_year}</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'दस्तावेज़ लिंक:' : 'Document Link:'}
                  </span>
                  {viewingItem.file_url ? (
                    <a
                      href={viewingItem.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#751639] hover:underline text-[13px] flex items-center gap-1"
                    >
                      <span>{t.download}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#90A1B9] italic">{isHindi ? 'उपलब्ध नहीं' : 'None'}</span>
                  )}
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {t.status}:
                  </span>
                  {viewingItem.is_active ? (
                    <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                      {t.active}
                    </span>
                  ) : (
                    <span className="bg-[#FDF4F0] text-[#E11D48] border border-[#FFE4E6] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                      {t.inactive}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#F8F7F7] border-t border-[#EDE9E9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = viewingItem;
                  setViewingItem(null);
                  handleOpenEdit(target);
                }}
                className="px-4 py-2 rounded-[8px] bg-[#751639] text-white font-medium text-xs hover:opacity-90 cursor-pointer"
              >
                {isHindi ? 'विवरण संपादित करें' : 'Edit Statement'}
              </button>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-white cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. CREATE / EDIT DRAWER MODAL ── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EDE9E9] max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div>
                <h3 className="font-semibold text-[16px]">
                  {editingId ? (isHindi ? `विवरण #${editingId} संपादित करें` : `Edit Statement #${editingId}`) : (isHindi ? 'नया विवरण जोड़ें' : 'Add New Statement')}
                </h3>
                <p className="text-[12px] text-white/80">
                  {isHindi ? 'संयुक्त वित्त खाते / सम्मेलन रिकॉर्ड कॉन्फ़िगर करें' : 'Configure Combined Accounts / Conference record'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'विवरण शीर्षक (अंग्रेज़ी) *' : 'Statement Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Combined Finance and Revenue Accounts of Union and State Governments 2024-25"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'विवरण शीर्षक (हिन्दी)' : 'Statement Title (हिन्दी)'}
                </label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="उदा. संघ और राज्य सरकारों के संयुक्त वित्त और राजस्व खाते"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'श्रेणी *' : 'Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="combined">{isHindi ? 'संयुक्त वित्त एवं राजस्व लेखे' : 'Combined Finance & Revenue'}</option>
                    <option value="conference">{isHindi ? 'राज्य वित्त सचिव सम्मेलन' : 'State Finance Secretaries Conference'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'वित्तीय वर्ष *' : 'Financial Year *'}
                  </label>
                  <input
                    type="text"
                    value={accountYear}
                    onChange={(e) => setAccountYear(e.target.value)}
                    placeholder="2024 - 25"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'खंड विनिर्देश' : 'Volume Specification'}
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="e.g. Vol I or Full Book"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'फ़ाइल का आकार' : 'File Size'}
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 18.5 MB"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'पीडीएफ / दस्तावेज़ डाउनलोड यूआरएल' : 'PDF / Document Download URL'}
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCombinedAccount"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#751639] cursor-pointer"
                />
                <label htmlFor="isActiveCombinedAccount" className="text-[13px] font-semibold text-[#314158] cursor-pointer">
                  {isHindi ? 'लाइव पंजिका में प्रकाशित करें' : 'Publish to Live Registry'}
                </label>
              </div>

              <div className="border-t border-[#EDE9E9] pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-[#F8F7F7] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-[8px] text-white font-semibold text-xs shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  {editingId ? (isHindi ? 'अद्यतन करें' : 'Update Statement') : (isHindi ? 'सहेजें' : 'Save Statement')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminCombinedAccountsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-zinc-400">
        <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Combined Accounts module...</span>
      </div>
    }>
      <AdminCombinedAccountsContent />
    </Suspense>
  );
}
