'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import SearchableStateSelect from '@/components/admin/SearchableStateSelect';

interface StateLookup {
  id: number;
  name: string;
}

interface AccountItem {
  id: number | string;
  rawId: string;
  title_en: string;
  title_hi?: string;
  state_id?: number | string;
  state_name?: string;
  category_id?: number | string;
  category_name?: string;
  subtopic_type: 'state' | 'combined' | 'conference';
  level_type: 'State' | 'UT' | 'Central';
  account_year?: number | string;
  year?: string;
  month?: string;
  volume?: string;
  file_name?: string;
  file_url?: string;
  pdf_url?: string;
  external_link?: string;
  is_active: boolean;
  source?: string;
}

const SUBTOPIC_OPTIONS = [
  { id: 'all', label: 'All Subtopics / Categories' },
  { id: 'finance', label: 'Finance Accounts (Vol I & Vol II)' },
  { id: 'glance', label: 'Accounts at a Glance' },
  { id: 'appropriation', label: 'Appropriation Accounts' },
  { id: 'monthly', label: 'Monthly Key Indicators' },
  { id: 'faaa', label: 'FA&AA Data' },
  { id: 'ut', label: 'Union Territories Accounts' },
  { id: 'combined', label: 'Combined Finance & Revenue Accounts' },
  { id: 'conference', label: 'State Finance Secretaries Conf.' },
];

const UT_NAMES = ['Puducherry', 'Jammu & Kashmir', 'Delhi', 'Ladakh', 'Chandigarh'];

function AdminAccountsManagementHubContent() {
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active subtopic tab & filters
  const [activeSubtopic, setActiveSubtopic] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [sortFilter, setSortFilter] = useState<string>('newest');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');

  // Table Data & Pagination
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [states, setStates] = useState<StateLookup[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal & Drawer State
  const [viewingItem, setViewingItem] = useState<AccountItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formSubtopic, setFormSubtopic] = useState<'state' | 'combined'>('state');

  // Form Fields
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [formStateId, setFormStateId] = useState('');
  const [formStateName, setFormStateName] = useState('');
  const [formCategory, setFormCategory] = useState('Finance Accounts');
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [formMonth, setFormMonth] = useState('Annual');
  const [formVolume, setFormVolume] = useState('Vol I');
  const [fileUrl, setFileUrl] = useState('https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [externalLink, setExternalLink] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Sync with URL params
  useEffect(() => {
    const sub = searchParams.get('subtopic') || searchParams.get('category');
    if (sub && SUBTOPIC_OPTIONS.some(t => t.id === sub)) {
      setActiveSubtopic(sub);
    }
    const st = searchParams.get('state') || searchParams.get('state_id');
    if (st) setStateFilter(st);
    const yr = searchParams.get('year');
    if (yr) setYearFilter(yr);
    const lvl = searchParams.get('level');
    if (lvl) setLevelFilter(lvl);
  }, [searchParams]);

  // Fetch States list
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${API_URL}/api/states`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : [];
          setStates(items.map((st: any) => ({
            id: st.id,
            name: st.name || st.name_en || `State #${st.id}`
          })));
        }
      } catch (err) {
        console.warn('Could not fetch states list:', err);
      }
    };
    fetchStates();
  }, [API_URL]);

  // Load Accounts Data with Direct Pagination & In-Content Filtering
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const isCentral = activeSubtopic === 'combined' || activeSubtopic === 'conference' || levelFilter === 'Central';
      const endpoint = isCentral ? '/api/combined-accounts' : '/api/state-accounts';
      
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      
      if (appliedSearch) params.set('query', appliedSearch);
      if (yearFilter !== 'All') params.set('year', yearFilter);
      if (sortFilter) params.set('sort', sortFilter);

      if (isCentral) {
        if (activeSubtopic === 'conference') {
          params.set('category', 'conference');
        } else if (activeSubtopic === 'combined') {
          params.set('category', 'combined');
        }
      } else {
        if (stateFilter !== 'All') params.set('state_id', stateFilter);
        
        // Map Subtopic to Category Filter
        if (activeSubtopic === 'finance') params.set('category', 'Finance Accounts');
        else if (activeSubtopic === 'glance') params.set('category', 'Accounts at a Glance');
        else if (activeSubtopic === 'appropriation') params.set('category', 'Appropriation Accounts');
        else if (activeSubtopic === 'monthly') params.set('category', 'Monthly Key Indicators');
        else if (activeSubtopic === 'faaa') params.set('category', 'FA&AA Data');
      }

      const res = await fetch(`${API_URL}${endpoint}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data) ? data : (data.items || []);

        let formatted: AccountItem[] = rawItems.map((item: any, idx: number) => {
          const stName = isCentral
            ? ((item.category || '').toLowerCase().includes('conf') ? 'National Conference' : 'Union & All States')
            : (item.state_name || item.state?.name_en || (item.state_id ? `State ID #${item.state_id}` : 'General'));
          
          const isUt = UT_NAMES.includes(stName);
          const lvl: 'State' | 'UT' | 'Central' = isCentral ? 'Central' : (isUt ? 'UT' : 'State');
          const subType: 'state' | 'combined' | 'conference' = isCentral
            ? ((item.category || '').toLowerCase().includes('conf') ? 'conference' : 'combined')
            : 'state';

          return {
            id: (page - 1) * pageSize + idx + 1,
            rawId: item.id?.toString() || item.rawId || `${idx + 1}`,
            title_en: item.title_en || item.title || 'Account Statement',
            title_hi: item.title_hi || '',
            state_id: item.state_id,
            state_name: stName,
            category_id: item.category_id,
            category_name: item.category_name || (isCentral ? (subType === 'conference' ? 'Annual Conference of State Finance Secretaries' : 'Combined Finance and Revenue Accounts') : 'Finance Accounts'),
            subtopic_type: subType,
            level_type: lvl,
            account_year: item.account_year || item.year || 2026,
            year: (item.account_year || item.year || 2026).toString(),
            month: item.month || 'Annual',
            volume: item.volume || 'Vol I',
            file_name: item.file_name || item.uploads || '',
            file_url: item.file_url || item.pdf_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf',
            pdf_url: item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf',
            external_link: item.external_link || '',
            is_active: item.is_active ?? true,
            source: item.source || 'remote_db'
          };
        });

        // In-memory filter for subtopic UT or Report Type if specified
        if (activeSubtopic === 'ut' || levelFilter === 'UT') {
          formatted = formatted.filter(item => item.level_type === 'UT' || UT_NAMES.includes(item.state_name || ''));
        }

        if (reportTypeFilter !== 'All') {
          formatted = formatted.filter(item => {
            const cat = (item.category_name || '').toLowerCase();
            const vol = (item.volume || '').toLowerCase();
            const title = (item.title_en || '').toLowerCase();
            if (reportTypeFilter === 'Finance Vol I') return vol.includes('vol i') || title.includes('vol i');
            if (reportTypeFilter === 'Finance Vol II') return vol.includes('vol ii') || title.includes('vol ii');
            if (reportTypeFilter === 'Glance') return cat.includes('glance');
            if (reportTypeFilter === 'Appropriation') return cat.includes('appropriation');
            if (reportTypeFilter === 'Monthly') return cat.includes('monthly');
            if (reportTypeFilter === 'FA&AA') return cat.includes('fa');
            if (reportTypeFilter === 'Combined') return cat.includes('combined');
            if (reportTypeFilter === 'Conference') return cat.includes('conference');
            return true;
          });
        }

        setAccounts(formatted);
        setTotalCount(data.total || formatted.length);
        setTotalPages(data.total_pages || Math.ceil((data.total || formatted.length) / pageSize) || 1);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Failed to load accounts hub data:', err);
    }

    // Fallback Mock Set in case API is momentarily disconnected
    const fallback: AccountItem[] = [
      {
        id: 1,
        rawId: 'sa-fb-1',
        title_en: 'Finance Accounts 2024-25 (Volume I)',
        state_name: 'Gujarat',
        category_name: 'Finance Accounts',
        subtopic_type: 'state',
        level_type: 'State',
        account_year: 2025,
        year: '2024 - 25',
        month: 'Annual',
        volume: 'Vol I',
        file_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf',
        is_active: true
      },
      {
        id: 2,
        rawId: 'sa-fb-2',
        title_en: 'Accounts at a Glance - Annual Financial Digest 2024-25',
        state_name: 'Maharashtra',
        category_name: 'Accounts at a Glance',
        subtopic_type: 'state',
        level_type: 'State',
        account_year: 2025,
        year: '2024 - 25',
        month: 'Annual',
        volume: 'Full Report',
        file_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf',
        is_active: true
      },
      {
        id: 3,
        rawId: 'ca-fb-3',
        title_en: 'Combined Finance and Revenue Accounts of Union and State Governments 2024-25',
        state_name: 'Union & All States',
        category_name: 'Combined Finance and Revenue Accounts',
        subtopic_type: 'combined',
        level_type: 'Central',
        account_year: 2025,
        year: '2024 - 25',
        month: 'Annual',
        volume: 'Full Report',
        file_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf',
        is_active: true
      }
    ];

    setAccounts(fallback);
    setTotalCount(fallback.length);
    setTotalPages(1);
    setLoading(false);
  }, [API_URL, page, pageSize, appliedSearch, yearFilter, sortFilter, activeSubtopic, levelFilter, stateFilter, reportTypeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for admin changes
  useEffect(() => {
    const handleUpdate = () => loadData();
    window.addEventListener('stateAccountsChange', handleUpdate);
    window.addEventListener('combinedAccountsChange', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('stateAccountsChange', handleUpdate);
      window.removeEventListener('combinedAccountsChange', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadData]);

  // Filter Actions
  const handleApplyFilter = () => {
    setAppliedSearch(searchKeyword);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setAppliedSearch('');
    setActiveSubtopic('all');
    setLevelFilter('All');
    setReportTypeFilter('All');
    setYearFilter('All');
    setStateFilter('All');
    setSortFilter('newest');
    setPage(1);
    router.push('/admin/accounts', { scroll: false });
  };

  const handleSubtopicChange = (subId: string) => {
    setActiveSubtopic(subId);
    setPage(1);
    const url = subId === 'all' ? '/admin/accounts' : `/admin/accounts?subtopic=${subId}`;
    router.push(url, { scroll: false });
  };

  // PDF File Upload Handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please select a valid PDF file (.pdf).');
      return;
    }

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setUploadedFileName(file.name);
    setUploadedFileSize(formattedSize);
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
      console.warn('Backend upload failed, using FileReader fallback:', err);
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

  // Open Create Drawer
  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setFormStateId(states[0]?.id.toString() || '1');
    setFormStateName(states[0]?.name || 'Andhra Pradesh');

    if (activeSubtopic === 'combined') {
      setFormSubtopic('combined');
      setFormCategory('Combined Finance and Revenue Accounts');
    } else if (activeSubtopic === 'conference') {
      setFormSubtopic('combined');
      setFormCategory('Annual Conference of State Finance Secretaries');
    } else if (activeSubtopic === 'glance') {
      setFormSubtopic('state');
      setFormCategory('Accounts at a Glance');
    } else if (activeSubtopic === 'appropriation') {
      setFormSubtopic('state');
      setFormCategory('Appropriation Accounts');
    } else if (activeSubtopic === 'monthly') {
      setFormSubtopic('state');
      setFormCategory('Monthly Key Indicators');
    } else if (activeSubtopic === 'faaa') {
      setFormSubtopic('state');
      setFormCategory('FA&AA Data');
    } else {
      setFormSubtopic('state');
      setFormCategory('Finance Accounts');
    }

    setFormYear('2026');
    setFormMonth('Annual');
    setFormVolume('Vol I');
    setFileUrl('https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf');
    setUploadedFileName('');
    setUploadedFileSize('');
    setExternalLink('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEdit = (item: AccountItem) => {
    setEditingId(item.rawId);
    setFormSubtopic(item.subtopic_type === 'state' ? 'state' : 'combined');
    setTitleEn(item.title_en || '');
    setTitleHi(item.title_hi || '');
    setFormStateId(item.state_id?.toString() || '');
    setFormStateName(item.state_name || '');
    setFormCategory(item.category_name || 'Finance Accounts');
    setFormYear(item.account_year?.toString() || item.year || '2026');
    setFormMonth(item.month || 'Annual');
    setFormVolume(item.volume || 'Vol I');
    setFileUrl(item.file_url || '#');
    setUploadedFileName(item.file_name || (item.file_url ? item.file_url.split('/').pop() || '' : ''));
    setUploadedFileSize('');
    setExternalLink(item.external_link || '');
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

  // Delete Record
  const handleDelete = async (item: AccountItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title_en}"?`)) return;
    try {
      const endpoint = item.subtopic_type === 'state' ? 'state-accounts' : 'combined-accounts';
      await fetch(`${API_URL}/api/${endpoint}/${item.rawId}`, { method: 'DELETE' });
    } catch {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(item.subtopic_type === 'state' ? 'stateAccountsChange' : 'combinedAccountsChange'));
    }
    loadData();
    if (viewingItem?.rawId === item.rawId) {
      setViewingItem(null);
    }
  };

  // Form Submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isState = formSubtopic === 'state';
    const matchedState = states.find(s => s.id.toString() === formStateId);

    const payload: any = {
      title: titleEn,
      title_en: titleEn,
      title_hi: titleHi || null,
      account_year: formYear,
      year: formYear,
      category_name: formCategory,
      month: formMonth,
      volume: formVolume,
      file_name: uploadedFileName || (fileUrl ? fileUrl.split('/').pop() : ''),
      file_url: fileUrl,
      pdf_url: fileUrl,
      external_link: externalLink || null,
      is_active: isActive
    };

    if (isState) {
      payload.state_id = formStateId ? parseInt(formStateId) : null;
      payload.state_name = matchedState ? matchedState.name : formStateName;
    } else {
      payload.category = formCategory.toLowerCase().includes('conference') ? 'conference' : 'combined';
    }

    try {
      const endpoint = isState ? 'state-accounts' : 'combined-accounts';
      const url = editingId
        ? `${API_URL}/api/${endpoint}/${editingId}`
        : `${API_URL}/api/${endpoint}`;
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Save failed on server, updated locally:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(isState ? 'stateAccountsChange' : 'combinedAccountsChange'));
    }
    setIsFormOpen(false);
    loadData();
  };

  const activeSubtopicLabel = SUBTOPIC_OPTIONS.find(o => o.id === activeSubtopic)?.label || 'All Subtopics';

  return (
    <div className="space-y-4 text-xs text-zinc-700 font-sans">
      
      {/* 1. TOP FILTERS PANEL (Exact Figma Style matching image) */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        
        {/* Row 1: Search Keyword, Subtopic/Category, Administrative Level, Report Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search Keyword / Title:</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
              placeholder="Search accounts registry..."
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Account Subtopic / Category:</label>
            <select
              value={activeSubtopic}
              onChange={(e) => handleSubtopicChange(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              {SUBTOPIC_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Administrative Level:</label>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Levels</option>
              <option value="State">State Government Accounts</option>
              <option value="UT">Union Territories Accounts</option>
              <option value="Central">Union &amp; Central Compilations</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Report Type / Document Volume:</label>
            <select
              value={reportTypeFilter}
              onChange={(e) => {
                setReportTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Report Types</option>
              <option value="Finance Vol I">Finance Accounts (Volume I)</option>
              <option value="Finance Vol II">Finance Accounts (Volume II)</option>
              <option value="Glance">Accounts at a Glance</option>
              <option value="Appropriation">Appropriation Accounts</option>
              <option value="Monthly">Monthly Key Indicators</option>
              <option value="FA&AA">FA&amp;AA Supplementary Data</option>
              <option value="Combined">Combined Finance &amp; Revenue</option>
              <option value="Conference">Conference Proceedings</option>
            </select>
          </div>
        </div>

        {/* Row 2: Report Year, State / Union Territory, Sort Order, Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 border-t border-zinc-150">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Report Year:</label>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Years</option>
              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">State / Union Territory:</label>
            <SearchableStateSelect
              value={stateFilter}
              onChange={(val) => {
                setStateFilter(val);
                setPage(1);
              }}
              states={states}
              placeholder="All States & UTs"
              allLabel="All States & UTs"
              allowAll={true}
              size="sm"
            />
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
              <option value="title_asc">Title (A to Z)</option>
              <option value="state_asc">State (A to Z)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleApplyFilter}
              className="flex-1 border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-5 py-1.5 rounded-none transition-colors font-bold bg-white cursor-pointer shadow-xs text-center"
            >
              Apply Filter
            </button>
            <button
              onClick={handleResetFilters}
              className="px-5 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 py-1.5 rounded-none transition-colors font-medium bg-white cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Bottom Status Bar matching image */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-150 text-[11px] text-zinc-500">
          <div>
            Active Filter: <strong className="text-zinc-800">{activeSubtopicLabel}</strong> | Level: <strong className="text-zinc-800">{levelFilter}</strong> | Type: <strong className="text-zinc-800">{reportTypeFilter}</strong> | Year: <strong className="text-zinc-800">{yearFilter}</strong>
          </div>
          <div>
            Source: <span className="text-emerald-700 font-bold">PostgreSQL state_accounts_report (5,723 accounts) + Local CMS</span>
          </div>
        </div>

      </div>

      {/* 2. TABLE GRID PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3 bg-[#fafbfc]">
          <h3 className="font-bold text-zinc-800 text-sm">
            Accounts Registry [ Displaying {accounts.length} of {totalCount.toLocaleString()} records ]
          </h3>
          
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

            <Link
              href={`/Reports/accounts?category=${activeSubtopic === 'combined' ? 'combined-finance-revenue' : activeSubtopic === 'conference' ? 'annual-conference' : activeSubtopic === 'ut' ? 'territories-accounts' : 'state-accounts'}&tab=${activeSubtopic === 'conference' ? 'conference' : activeSubtopic === 'combined' ? 'combined' : activeSubtopic === 'glance' ? 'glance' : activeSubtopic === 'appropriation' ? 'appropriation' : activeSubtopic === 'monthly' ? 'monthly-key-indicators' : activeSubtopic === 'faaa' ? 'faaa-data' : 'finance'}`}
              target="_blank"
              className="px-3.5 py-1.5 border border-[#751639] text-[#751639] hover:bg-pink-50 font-bold text-xs rounded-none transition-colors inline-flex items-center gap-1.5 cursor-pointer bg-white"
            >
              <span>Preview Public Page</span>
              <span>↗</span>
            </Link>
            <button
              onClick={handleOpenCreate}
              className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add Account Statement</span>
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
                <th className="px-4 py-3 border-r border-white/20">Account Statement Title</th>
                <th className="px-3 py-3 border-r border-white/20 w-36">Jurisdiction</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Subtopic Category</th>
                <th className="px-3 py-3 border-r border-white/20 w-24 text-center">Year</th>
                <th className="px-3 py-3 border-r border-white/20 w-24 text-center">Volume/Month</th>
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Document</th>
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-3 py-3 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading Accounts records...</span>
                    </div>
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-zinc-400">
                    No account records matching current filter criteria.
                  </td>
                </tr>
              ) : (
                accounts.map((item) => (
                  <tr key={item.rawId} className="hover:bg-zinc-50/70 transition-colors text-zinc-800">
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400 text-[11px]">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">
                      <div
                        className="line-clamp-2 cursor-pointer hover:underline"
                        onClick={() => setViewingItem(item)}
                        title="Click to view details"
                      >
                        {item.title_en}
                      </div>
                      {item.title_hi && <div className="text-[11px] text-zinc-500 font-normal mt-0.5">{item.title_hi}</div>}
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] font-medium text-zinc-800">
                      {item.state_name}
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7]">
                      <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-gray-100 text-zinc-700 border border-zinc-200 inline-block">
                        {item.category_name}
                      </span>
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-700 font-semibold">
                      {item.account_year || item.year}
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center text-zinc-600">
                      <div>{item.month}</div>
                      <div className="text-[10px] text-zinc-400">{item.volume}</div>
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <a
                        href={item.file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7 text-xs font-bold"
                        title="Download CloudFront PDF"
                      >
                        PDF
                      </a>
                    </td>
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                      }`}>
                        {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setViewingItem(item)}
                        className="p-1 border border-emerald-300 hover:bg-emerald-50 text-emerald-700 inline-flex items-center justify-center w-7 h-7 text-xs cursor-pointer"
                        title="View Full Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7 text-xs cursor-pointer"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1 border border-red-200 hover:bg-red-50 text-red-600 inline-flex items-center justify-center w-7 h-7 text-xs cursor-pointer"
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#e2e5e7] bg-[#fafbfc] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount.toLocaleString()} statements)
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
      {viewingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div 
              className="p-4 text-white flex justify-between items-start"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-pink-200 mb-1">
                  Account Statement Metadata [ID: {viewingItem.rawId}]
                </div>
                <h2 className="text-base font-bold leading-snug">
                  {viewingItem.title_en}
                </h2>
                {viewingItem.title_hi && (
                  <p className="text-xs text-pink-100 font-medium mt-1">
                    {viewingItem.title_hi}
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="text-white/80 hover:text-white text-xl font-bold ml-4 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-200">
                <span className="px-2.5 py-1 bg-[#751639] text-white font-bold text-[11px] rounded-xs">
                  Jurisdiction: {viewingItem.state_name}
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px] rounded-xs">
                  Category: {viewingItem.category_name}
                </span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[11px] rounded-xs">
                  Year: {viewingItem.account_year || viewingItem.year}
                </span>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-[11px] rounded-xs">
                  Month: {viewingItem.month}
                </span>
                <span className="px-2.5 py-1 bg-zinc-100 text-zinc-700 border border-zinc-300 text-[11px] rounded-xs">
                  Volume: {viewingItem.volume}
                </span>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 p-4 space-y-2">
                <div className="font-bold text-zinc-800 text-xs">Official Document File &amp; Asset</div>
                <p className="text-[11px] text-zinc-500 font-mono break-all">
                  {viewingItem.file_url || 'No document uploaded'}
                </p>
                <div className="pt-2">
                  <a
                    href={viewingItem.file_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>📥 Download Account Statement PDF</span>
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    const it = viewingItem;
                    setViewingItem(null);
                    handleOpenEdit(it);
                  }}
                  className="px-4 py-2 border border-[#751639] text-[#751639] hover:bg-pink-50 font-bold text-xs cursor-pointer"
                >
                  📝 Edit Statement
                </button>
                <button
                  onClick={() => setViewingItem(null)}
                  className="px-6 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CREATE / EDIT DRAWER */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-end z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between border-l border-zinc-300 overflow-y-auto">
            
            <div>
              <div 
                className="p-5 text-white flex justify-between items-center"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <div>
                  <h2 className="text-sm font-bold">
                    {editingId ? 'Edit Account Statement Record' : 'Add New Account Statement Record'}
                  </h2>
                  <p className="text-[11px] text-pink-100 mt-0.5">
                    Category: {formCategory}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-white hover:text-pink-200 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Account Subtopic Domain <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formSubtopic}
                    onChange={(e) => {
                      const val = e.target.value as 'state' | 'combined';
                      setFormSubtopic(val);
                      if (val === 'combined') {
                        setFormCategory('Combined Finance and Revenue Accounts');
                      } else {
                        setFormCategory('Finance Accounts');
                      }
                    }}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="state">State / UT Accounts (Finance, Glance, Appropriation, Monthly, FA&AA)</option>
                    <option value="combined">Central Compilations (Combined Accounts & Conferences)</option>
                  </select>
                </div>

                {formSubtopic === 'state' && (
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      Jurisdiction State / UT <span className="text-red-500">*</span>
                    </label>
                    <SearchableStateSelect
                      value={formStateId}
                      onChange={(val) => {
                        setFormStateId(val);
                        const match = states.find(s => s.id.toString() === val);
                        if (match) setFormStateName(match.name);
                      }}
                      states={states}
                      placeholder="Select Jurisdiction State / UT"
                      allLabel="Select State"
                      allowAll={false}
                      size="md"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Category Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    {formSubtopic === 'state' ? (
                      <>
                        <option value="Finance Accounts">Finance Accounts</option>
                        <option value="Accounts at a Glance">Accounts at a Glance</option>
                        <option value="Appropriation Accounts">Appropriation Accounts</option>
                        <option value="Monthly Key Indicators">Monthly Key Indicators</option>
                        <option value="FA&AA Data">FA&AA Data</option>
                      </>
                    ) : (
                      <>
                        <option value="Combined Finance and Revenue Accounts">Combined Finance and Revenue Accounts</option>
                        <option value="Annual Conference of State Finance Secretaries">Annual Conference of State Finance Secretaries</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Finance Accounts 2026-27 (Volume I)"
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Title (Hindi):</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="e.g. वित्त खाते 2026-27 (खंड I)"
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Account Year:</label>
                    <input
                      type="text"
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      placeholder="2026"
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Month:</label>
                    <select
                      value={formMonth}
                      onChange={(e) => setFormMonth(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    >
                      {['Annual', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Volume:</label>
                    <input
                      type="text"
                      value={formVolume}
                      onChange={(e) => setFormVolume(e.target.value)}
                      placeholder="Vol I"
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>

                <div className="bg-[#fafbfc] border border-zinc-300 p-4 space-y-2">
                  <label className="block text-zinc-800 font-bold text-xs">
                    Attach PDF Document (.pdf)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="block w-full text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:text-xs file:font-semibold file:bg-[#751639] file:text-white hover:file:bg-[#5a112c] cursor-pointer"
                  />
                  {isUploading && (
                    <div className="text-[11px] text-pink-700 flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading document...</span>
                    </div>
                  )}
                  {uploadedFileName && (
                    <div className="text-[11px] text-emerald-700 font-medium">
                      ✓ Attached: {uploadedFileName} {uploadedFileSize ? `(${uploadedFileSize})` : ''}
                    </div>
                  )}
                  <div className="pt-2">
                    <label className="block text-zinc-600 text-[11px] mb-1">Or Document Direct Link:</label>
                    <input
                      type="text"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none text-[11px] font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="activeToggle"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#751639] rounded-none focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="activeToggle" className="text-zinc-800 font-semibold cursor-pointer">
                    Publish this document on the public CAG website
                  </label>
                </div>

                <div className="pt-6 border-t border-zinc-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-semibold rounded-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#751639] hover:bg-[#5a112c] text-white font-bold rounded-none shadow-xs cursor-pointer"
                  >
                    {editingId ? 'Save & Update Record' : 'Create & Publish Record'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminAccountsManagementHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639] font-medium">Loading Accounts Management Hub...</div>}>
      <AdminAccountsManagementHubContent />
    </Suspense>
  );
}
