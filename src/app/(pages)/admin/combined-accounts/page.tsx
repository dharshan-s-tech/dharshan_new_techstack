'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, CombinedAccountItem as LocalCombinedItem } from '@/lib/dataManager';
import { Pencil, Eye, Trash2, ExternalLink } from 'lucide-react';

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

    // Local sorting
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
    } else {
      localList.sort((a, b) => parseId(b.id) - parseId(a.id));
    }

    const formatted: CombinedAccountDisplayItem[] = localList.map((item, idx) => ({
      id: idx + 1,
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

    setTotalCount(formatted.length);
    setTotalPages(Math.ceil(formatted.length / pageSize) || 1);
    setAccounts(formatted.slice((page - 1) * pageSize, page * pageSize));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('combinedAccountsChange', handleUpdate);
    return () => window.removeEventListener('combinedAccountsChange', handleUpdate);
  }, [page, pageSize, appliedSearch, statusFilter, categoryFilter, yearFilter, sortFilter]);

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
    setCategory('combined');
    setAccountYear('2024 - 25');
    setVolume('Full Comprehensive Volume');
    setSize('18.5 MB');
    setFileUrl('https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf');
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
    setUploadedFileSize(item.size || '');
    setIsActive(item.is_active);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (rawId: string) => {
    if (!confirm('Are you sure you want to delete this document record?')) return;
    
    try {
      await fetch(`${API_URL}/api/combined-accounts/${rawId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('DELETE failed:', err);
    }

    const numId = parseInt(rawId);
    if (!isNaN(numId)) {
      dataManager.deleteCombinedAccount(numId);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('combinedAccountsChange'));
    }
    await loadData();
    if (viewingItem?.rawId === rawId) {
      setViewingItem(null);
    }
  };

  const handleToggleActive = async (item: CombinedAccountDisplayItem) => {
    const updatedStatus = !item.is_active;
    try {
      await fetch(`${API_URL}/api/combined-accounts/${item.rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_active: updatedStatus,
          status: updatedStatus ? 'Active' : 'Inactive'
        })
      });
    } catch (err) {
      console.warn('Toggle status failed:', err);
    }

    const numId = parseInt(item.rawId);
    if (!isNaN(numId)) {
      dataManager.saveCombinedAccount({
        id: numId,
        title_en: item.title_en,
        title_hi: item.title_hi,
        category: item.category,
        account_year: item.account_year,
        volume: item.volume,
        size: item.size,
        file_url: item.file_url,
        is_active: updatedStatus
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('combinedAccountsChange'));
    }
    await loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingId || `${Date.now()}`;

    const payload = {
      id: targetId,
      title: titleEn,
      title_en: titleEn,
      title_hi: titleHi || null,
      category: category,
      account_year: accountYear,
      year: accountYear,
      volume: volume,
      size: size,
      file_name: uploadedFileName || (fileUrl ? fileUrl.split('/').pop() : ''),
      file_url: fileUrl,
      pdf_url: fileUrl,
      is_active: isActive
    };

    let finalId = targetId;
    try {
      const url = editingId
        ? `${API_URL}/api/combined-accounts/${editingId}`
        : `${API_URL}/api/combined-accounts`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (json.id || json.rawId)) {
          finalId = String(json.id || json.rawId);
        }
      }
    } catch (err) {
      console.warn('Backend error saving combined account, saving in dataManager:', err);
      const localRecord: LocalCombinedItem = {
        id: parseInt(finalId) || Date.now(),
        title_en: titleEn,
        title_hi: titleHi,
        category: category,
        account_year: accountYear,
        volume: volume,
        size: size,
        file_url: fileUrl,
        is_active: isActive
      };
      dataManager.saveCombinedAccount(localRecord);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('combinedAccountsChange'));
    }
    setIsDrawerOpen(false);
    loadData();
  };


  return (
    <div className="space-y-4 text-xs text-zinc-700 font-sans">
      
      {/* 1. TOP HEADER & FILTER PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#751639]">
              Combined Finance Accounts &amp; Conference Materials
            </h2>
            <p className="text-[11px] text-zinc-500 font-medium">
              Manage Combined Finance &amp; Revenue Accounts and State Finance Secretaries Conference compendiums
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add Document Record</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-1">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search Keyword / Title:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
              placeholder="Search by title or year..."
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Publish Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Document Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Categories</option>
              <option value="combined">Combined Finance &amp; Revenue Accounts</option>
              <option value="conference">Conference Materials</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Fiscal / Accounting Year:</label>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Fiscal Years</option>
              <option value="2024">2024 - 25</option>
              <option value="2023">2023 - 24</option>
              <option value="2022">2022 - 23</option>
              <option value="2021">2021 - 22</option>
              <option value="2020">2020 - 21</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Sort Order:</label>
            <select
              value={sortFilter}
              onChange={(e) => {
                setSortFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="newest">Newly Added First</option>
              <option value="year_desc">Year (Newest first)</option>
              <option value="year_asc">Year (Oldest first)</option>
              <option value="oldest">Oldest Added First</option>
              <option value="title_asc">Title (A to Z)</option>
              <option value="title_desc">Title (Z to A)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-150">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSearchGo}
              className="border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-5 py-1.5 rounded-none transition-colors font-bold bg-white cursor-pointer shadow-xs"
            >
              Apply Filter
            </button>
            <button
              onClick={handleSearchReset}
              className="px-5 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 py-1.5 rounded-none transition-colors font-medium bg-white cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 font-medium">
            Source: <span className="text-emerald-700 font-bold">PostgreSQL combined_accounts + Local CMS</span>
          </div>
        </div>
      </div>

      {/* 2. DATA TABLE */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3 bg-[#fafbfc]">
          <div className="font-bold text-zinc-800 text-sm">
            Records Registry [ Displaying {accounts.length} of {totalCount.toLocaleString()} ]
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-zinc-300 px-2 py-1 bg-white text-zinc-800"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <button
              onClick={() => {
                setEditingId(null);
                setTitleEn('');
                setTitleHi('');
                setCategory('combined');
                setAccountYear('2024 - 25');
                setVolume('Full Comprehensive Volume');
                setSize('18.5 MB');
                setFileUrl('#');
                setIsActive(true);
                setIsDrawerOpen(true);
              }}
              className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add Combined Record</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-3 py-3 border-r border-white/20 w-12 text-center">#</th>
                <th className="px-4 py-3 border-r border-white/20">Document Title</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Category</th>
                <th className="px-3 py-3 border-r border-white/20 w-28 text-center">Fiscal Year</th>
                <th className="px-3 py-3 border-r border-white/20 w-36">Volume</th>
                <th className="px-3 py-3 border-r border-white/20 w-24 text-center">File Size</th>
                <th className="px-3 py-3 border-r border-white/20 w-24 text-center">Status</th>
                <th className="px-3 py-3 text-center min-w-[240px] w-64">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading documents registry...</span>
                    </div>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    No documents matching the current filter.
                  </td>
                </tr>
              ) : (
                accounts.map((item) => (
                  <tr key={item.rawId} className="hover:bg-zinc-50/70 transition-colors text-zinc-800">
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400 text-[11px]">{item.id}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">
                      <div className="line-clamp-2 cursor-pointer hover:underline" onClick={() => setViewingItem(item)} title="Click to view details">
                        {item.title_en}
                      </div>
                      {item.title_hi && <div className="text-[11px] text-zinc-500 font-normal mt-0.5">{item.title_hi}</div>}
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7]">
                      <span className={`inline-block px-2 py-0.5 text-[10.5px] font-bold rounded ${
                        item.category === 'combined' 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.category === 'combined' ? 'Combined Accounts' : 'Conference Compendium'}
                      </span>
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-700 font-bold">{item.account_year}</td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-zinc-600 font-medium">{item.volume || 'Full Volume'}</td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center text-zinc-500 font-mono">{item.size}</td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          item.is_active ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-zinc-300 hover:bg-zinc-400 text-zinc-700'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap space-x-1">
                      {/* View */}
                      <button
                        onClick={() => setViewingItem(item)}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>View</span>
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Edit Record"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-800" />
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.rawId)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>

                      {/* PDF Download Link */}
                      {item.file_url && item.file_url !== '#' && (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-1.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-[11px] inline-flex items-center gap-0.5 shadow-2xs transition-colors"
                          title="Download CloudFront PDF ↗"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-600" />
                          <span>PDF</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#e2e5e7] bg-[#fafbfc] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount.toLocaleString()} documents)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11px]"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11px]"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. VIEW DETAILS MODAL */}
      {/* 3. VIEW DETAILS FULL-PAGE VIEW PANEL */}
      {viewingItem && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Full Page Header */}
          <div 
            className="px-6 py-4 text-white flex justify-between items-center shrink-0 shadow-md"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewingItem(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Back to Combined Accounts Table"
              >
                <span>← Back</span>
              </button>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-pink-200">
                  Document Record Details [ID: {viewingItem.rawId}]
                </div>
                <h2 className="text-base sm:text-lg font-bold leading-tight">
                  {viewingItem.title_en}
                </h2>
                {viewingItem.title_hi && (
                  <p className="text-xs text-pink-100 font-medium mt-0.5 font-hindi">
                    {viewingItem.title_hi}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setViewingItem(null)}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/30 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Close</span>
              <span className="text-sm leading-none">✕</span>
            </button>
          </div>

          {/* Full Page Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
            <div className="max-w-5xl mx-auto bg-white border border-[#ced4da] shadow-xs p-6 md:p-8 space-y-6">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-zinc-200">
                <span className={`px-3 py-1 font-bold text-xs rounded-xs ${
                  viewingItem.category === 'combined'
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}>
                  Category: {viewingItem.category === 'combined' ? 'Combined Finance & Revenue Accounts' : 'Conference Compendium'}
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-xs rounded-xs">
                  Fiscal Year: {viewingItem.account_year}
                </span>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-700 border border-zinc-300 text-xs rounded-xs">
                  Volume: {viewingItem.volume}
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-mono rounded-xs">
                  Size: {viewingItem.size}
                </span>
                <span className={`ml-auto px-3 py-1 text-xs font-bold rounded-full ${
                  viewingItem.is_active ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-zinc-200 text-zinc-600'
                }`}>
                  {viewingItem.is_active ? '● PUBLISHED' : '○ UNPUBLISHED'}
                </span>
              </div>

              {/* Document Download Panel */}
              <div className="bg-zinc-50 border border-zinc-200 p-6 space-y-3">
                <div className="font-bold text-zinc-900 text-sm">Official Document File &amp; Asset</div>
                <p className="text-xs text-zinc-500 font-mono break-all bg-white p-3 border border-zinc-200">
                  {viewingItem.file_url || 'No cloud document attached'}
                </p>
                <div className="pt-2">
                  <a
                    href={viewingItem.file_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>📥 Download Complete Volume (PDF)</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Full Page Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
            <Link
              href="/Reports/accounts"
              target="_blank"
              className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-none transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Page ↗</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const item = viewingItem;
                  setViewingItem(null);
                  handleOpenEdit(item);
                }}
                className="px-5 py-2 bg-[#751639] hover:bg-[#5a102c] text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </button>
              <button
                onClick={() => {
                  const idToDelete = viewingItem.rawId;
                  setViewingItem(null);
                  handleDelete(idToDelete);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-semibold text-xs rounded-none cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CREATE / EDIT FULL-PAGE EDITOR PANEL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div
            className="px-6 py-4 text-white flex justify-between items-center shrink-0 shadow-md"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2.5 py-1 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {editingId ? `Edit Document Record [ID: ${editingId}]` : 'Add New Document Record'}
                </h3>
                <p className="text-[11px] text-white/70">
                  Provide publication parameters and file attachments
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="text-white/70 hover:text-white text-xl font-bold p-1 cursor-pointer"
              title="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Body Form */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white border border-[#ced4da] shadow-xs p-6 md:p-8 space-y-5">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Document Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter document title in English"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Document Title (Hindi)
                </label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="दस्तावेज़ का शीर्षक हिंदी में दर्ज करें"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="combined">Combined Finance Accounts</option>
                    <option value="conference">Conference Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Account Year *</label>
                  <input
                    type="text"
                    required
                    value={accountYear}
                    onChange={(e) => setAccountYear(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="e.g. 2024 - 25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Volume Name</label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="e.g. Vol I or Full Compendium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="e.g. 18.5 MB"
                  />
                </div>
              </div>

              {/* PDF DOCUMENT UPLOAD PANEL */}
              <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-zinc-800 text-xs uppercase tracking-wide text-[#751639]">
                    PDF Document File &amp; Attachment *
                  </label>
                  {isUploading && (
                    <span className="text-[11px] text-[#751639] font-bold flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></span>
                      Uploading PDF...
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="cursor-pointer bg-[#751639] hover:bg-[#5f122d] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5 rounded-none">
                    <span>📁 Upload PDF Document</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="flex-grow w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-mono"
                    placeholder="or paste CloudFront PDF Link / URL"
                  />
                </div>

                {/* Attached File Preview Badge */}
                {uploadedFileName && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-900">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-emerald-700">📄 Attached PDF:</span>
                      <span className="font-mono truncate">{uploadedFileName}</span>
                      {uploadedFileSize && <span className="text-[11px] text-emerald-600 font-semibold">({uploadedFileSize})</span>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {fileUrl && fileUrl !== '#' && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#751639] hover:underline font-bold text-[11px]"
                        >
                          Preview ↗
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName('');
                          setUploadedFileSize('');
                          setFileUrl('#');
                        }}
                        className="text-zinc-500 hover:text-red-600 font-bold ml-2 cursor-pointer"
                        title="Remove attached file"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* 1-Click Sample CloudFront Document Presets */}
                <div className="pt-1">
                  <div className="text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">
                    Or select verified CloudFront PDF Presets:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'CFRA Full Book (PDF)', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf', size: '18.5 MB' },
                      { name: 'Conference Material (PDF)', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf', size: '12.3 MB' },
                      { name: 'CFRA Volume II (PDF)', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf', size: '15.8 MB' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setFileUrl(preset.url);
                          setUploadedFileName(preset.name);
                          setUploadedFileSize(preset.size);
                          setSize(preset.size);
                        }}
                        className={`text-[10.5px] px-2.5 py-1 border transition-all cursor-pointer ${
                          fileUrl === preset.url
                            ? 'bg-[#751639] text-white border-[#751639] font-bold'
                            : 'bg-white text-zinc-700 border-zinc-300 hover:border-[#751639] hover:text-[#751639]'
                        }`}
                      >
                        {preset.name} ({preset.size})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 font-bold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#751639] accent-[#751639]"
                  />
                  <span>Publish &amp; Display on Public Accounts Portal</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs cursor-pointer"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save &amp; Publish Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-2.5 border border-zinc-350 text-zinc-700 font-medium hover:bg-zinc-100 transition-colors bg-white cursor-pointer"
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

export default function AdminCombinedAccounts() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639] font-medium">Loading Combined Accounts Registry...</div>}>
      <AdminCombinedAccountsContent />
    </Suspense>
  );
}
