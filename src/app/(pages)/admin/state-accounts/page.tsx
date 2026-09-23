'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import SearchableStateSelect from '@/components/admin/SearchableStateSelect';
import { 
  Pencil, 
  Eye, 
  Trash2, 
  ExternalLink, 
  Plus, 
  FileText, 
  Building2, 
  X, 
  Upload, 
  Paperclip,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StateLookup {
  id: number;
  name: string;
}

interface StateAccountItem {
  id: number | string;
  rawId: string;
  title_en: string;
  title_hi?: string;
  state_id?: number | string;
  state_name?: string;
  category_id?: number | string;
  category_name?: string;
  account_year?: number | string;
  month?: string;
  volume?: string;
  file_name?: string;
  file_url?: string;
  pdf_url?: string;
  external_link?: string;
  is_active: boolean;
  source?: string;
}

function AdminStateAccountsContent() {
  const { isHindi, t, getText } = useAdminLanguage();
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<StateAccountItem[]>([]);
  const [states, setStates] = useState<StateLookup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  // Search & Filter Fields
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('year_desc');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Sync URL Query Parameters to Filter States
  useEffect(() => {
    const catParam = searchParams.get('category');
    const stateParam = searchParams.get('state_id') || searchParams.get('state');
    if (catParam) {
      setCategoryFilter(catParam);
    } else {
      setCategoryFilter('All');
    }
    if (stateParam) {
      setStateFilter(stateParam);
    } else {
      setStateFilter('All');
    }
    setPage(1);
  }, [searchParams]);

  // View Details Modal State
  const [viewingAccount, setViewingAccount] = useState<StateAccountItem | null>(null);

  // Form State (Add / Edit Drawer)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [stateId, setStateId] = useState('');
  const [stateName, setStateName] = useState('');
  const [categoryName, setCategoryName] = useState('Accounts at a Glance');
  const [accountYear, setAccountYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('Annual');
  const [volume, setVolume] = useState('Vol I');
  const [fileUrl, setFileUrl] = useState('#');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [externalLink, setExternalLink] = useState('');
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

  const CATEGORIES = [
    'Accounts at a Glance',
    'Appropriation Accounts',
    'Finance Accounts',
    'Monthly Key Indicators'
  ];

  const MONTHS = [
    'Annual', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      if (appliedSearch) params.set('query', appliedSearch);
      if (statusFilter !== 'All') params.set('status', statusFilter.toLowerCase());
      else params.set('status', 'all');
      if (stateFilter !== 'All') params.set('state_id', stateFilter);
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (yearFilter !== 'All') params.set('year', yearFilter);
      if (sortFilter) params.set('sort', sortFilter);

      const res = await fetch(`${API_URL}/api/state-accounts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const rawItems = Array.isArray(data) ? data : (data.items || []);
        
        let formatted: StateAccountItem[] = rawItems.map((item: any, idx: number) => ({
          id: (page - 1) * pageSize + idx + 1,
          rawId: item.id?.toString() || `${idx + 1}`,
          title_en: item.title_en || item.title || 'State Account Statement',
          title_hi: item.title_hi || '',
          state_id: item.state_id,
          state_name: item.state_name || item.state?.name_en || (item.state_id ? `State ID #${item.state_id}` : 'General'),
          category_id: item.category_id,
          category_name: item.category_name || 'Accounts at a Glance',
          account_year: item.account_year || item.year || 2026,
          month: item.month || 'Annual',
          volume: item.volume || 'Vol I',
          file_name: item.file_name || item.uploads || '',
          file_url: item.file_url || item.pdf_url || '#',
          pdf_url: item.pdf_url || item.file_url || '#',
          external_link: item.external_link || '',
          is_active: item.is_active ?? true,
          source: item.source || 'remote_db'
        }));

        if (monthFilter !== 'All') {
          formatted = formatted.filter(item => (item.month || '').toLowerCase() === monthFilter.toLowerCase());
        }

        setAccounts(formatted);
        setTotalCount(data.total || formatted.length);
        setTotalPages(data.total_pages || Math.ceil((data.total || formatted.length) / pageSize) || 1);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Could not load remote state accounts, using empty list:', err);
    }
    setLoading(false);
  };

  const loadStates = async () => {
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
      console.warn('Could not load states for dropdown:', err);
    }
  };

  useEffect(() => {
    loadStates();
  }, [API_URL]);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('stateAccountsChange', handleUpdate);
    return () => window.removeEventListener('stateAccountsChange', handleUpdate);
  }, [appliedSearch, statusFilter, stateFilter, categoryFilter, yearFilter, monthFilter, sortFilter, page, pageSize]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
    setPage(1);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
    setStateFilter('All');
    setCategoryFilter('All');
    setYearFilter('All');
    setMonthFilter('All');
    setSortFilter('year_desc');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setStateId(states.length > 0 ? states[0].id.toString() : '');
    setStateName(states.length > 0 ? states[0].name : '');
    setCategoryName('Accounts at a Glance');
    setAccountYear(new Date().getFullYear());
    setMonth('Annual');
    setVolume('Vol I');
    setFileUrl('#');
    setUploadedFileName('');
    setUploadedFileSize('');
    setExternalLink('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: StateAccountItem) => {
    setEditingId(item.rawId);
    setTitleEn(item.title_en || '');
    setTitleHi(item.title_hi || '');
    setStateId(item.state_id?.toString() || '');
    setStateName(item.state_name || '');
    setCategoryName(item.category_name || 'Accounts at a Glance');
    setAccountYear(parseInt(item.account_year?.toString() || '2026') || 2026);
    setMonth(item.month || 'Annual');
    setVolume(item.volume || 'Vol I');
    setFileUrl(item.file_url || '#');
    setUploadedFileName(item.file_name || (item.file_url ? item.file_url.split('/').pop() || '' : ''));
    setUploadedFileSize('');
    setExternalLink(item.external_link || '');
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

  const handleDelete = async (rawId: string) => {
    if (!confirm('Are you sure you want to delete this state account statement record?')) return;
    try {
      await fetch(`${API_URL}/api/state-accounts/${rawId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete state account:', err);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stateAccountsChange'));
    }
    await loadData();
    if (viewingAccount?.rawId === rawId) {
      setViewingAccount(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingId || `sa-local-${Date.now()}`;
    const matchedState = states.find(s => s.id.toString() === stateId);

    const payload = {
      id: targetId,
      title: titleEn,
      title_en: titleEn,
      title_hi: titleHi || null,
      state_id: stateId ? parseInt(stateId) : null,
      state_name: matchedState ? matchedState.name : stateName,
      category_name: categoryName,
      account_year: accountYear,
      year: accountYear.toString(),
      month: month,
      volume: volume,
      file_name: uploadedFileName || (fileUrl ? fileUrl.split('/').pop() : ''),
      file_url: fileUrl,
      pdf_url: fileUrl,
      external_link: externalLink || null,
      is_active: isActive
    };

    try {
      const url = editingId
        ? `${API_URL}/api/state-accounts/${editingId}`
        : `${API_URL}/api/state-accounts`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (json.id || json.rawId)) {
          payload.id = String(json.id || json.rawId);
        }
      }
    } catch (err) {
      console.warn('Backend save error, updating locally:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stateAccountsChange'));
    }
    setIsFormOpen(false);
    loadData();
  };

  // ── 1. FULL CONTENT PAGE: VIEW DETAILS ──
  if (viewingAccount) {
    return (
<div className="absolute inset-0 z-20 bg-[#F8F7F7] flex flex-col p-1 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] w-full max-w-[1526.2px] overflow-hidden">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewingAccount(null)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>← {isHindi ? 'पीछे' : 'Back'}</span>
                </button>
                <div>
                  <h3 className="font-semibold text-[16px] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {isHindi ? 'राज्य लेखा विवरण' : 'State Account Details'}
                  </h3>
                  <p className="text-[12px] text-white/80">ID: #{viewingAccount.rawId}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingAccount(null)}
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
                <p className="text-[16px] font-bold text-[#751639]">{viewingAccount.title_en}</p>
                {viewingAccount.title_hi && (
                  <div className="pt-2 border-t border-[#EDE9E9] mt-2">
                    <span className="text-[11px] font-semibold text-[#62748E] uppercase tracking-wider block">
                      {isHindi ? 'शीर्षक (हिन्दी):' : 'Title (हिन्दी):'}
                    </span>
                    <p className="text-[14px] font-medium text-[#314158]">{viewingAccount.title_hi}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'राज्य / क्षेत्र:' : 'State / Territory:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingAccount.state_name}</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'श्रेणी:' : 'Category:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingAccount.category_name}</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'वर्ष एवं खंड:' : 'Year & Volume:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingAccount.account_year} - {viewingAccount.volume} ({viewingAccount.month})</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'दस्तावेज़ लिंक:' : 'Document Link:'}
                  </span>
                  {viewingAccount.file_url ? (
                    <a
                      href={viewingAccount.file_url}
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
              </div>
            </div>

            <div className="px-6 py-4 bg-[#F8F7F7] border-t border-[#EDE9E9] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const target = viewingAccount;
                  setViewingAccount(null);
                  handleOpenEdit(target);
                }}
                className="px-4 py-2 rounded-[8px] bg-[#751639] text-white font-medium text-xs hover:opacity-90 cursor-pointer"
              >
                {isHindi ? 'खाता संपादित करें' : 'Edit Account'}
              </button>
              <button
                type="button"
                onClick={() => setViewingAccount(null)}
                className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-white cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
    );
  }

  // ── 2. FULL CONTENT PAGE: CREATE / EDIT ──
  if (isFormOpen) {
    return (
<div className="absolute inset-0 z-20 bg-[#F8F7F7] flex flex-col p-1 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] w-full max-w-[1526.2px] overflow-hidden">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>← {isHindi ? 'पीछे' : 'Back'}</span>
                </button>
                <div>
                  <h3 className="font-semibold text-[16px]">
                    {editingId ? (isHindi ? `राज्य लेखा #${editingId} संपादित करें` : `Edit State Account #${editingId}`) : (isHindi ? 'नया राज्य लेखा जोड़ें' : 'Add State Account')}
                  </h3>
                  <p className="text-[12px] text-white/80">
                    {isHindi ? 'राज्य लेखा रिकॉर्ड कॉन्फ़िगर करें' : 'Configure state account record'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
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
                  placeholder="e.g. Accounts at a Glance of Maharashtra 2026-27"
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
                  placeholder="उदा. महाराष्ट्र का एक नजर में लेखा"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'राज्य / केंद्र शासित प्रदेश *' : 'State / Union Territory *'}
                </label>
                <SearchableStateSelect
                  value={stateId}
                  onChange={(val) => {
                    setStateId(val);
                    const st = states.find(s => s.id.toString() === val);
                    if (st) setStateName(st.name);
                  }}
                  states={states}
                  placeholder={isHindi ? 'राज्य / केंद्र शासित प्रदेश चुनें' : 'Select State / UT'}
                  allowAll={false}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'श्रेणी *' : 'Category *'}
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'वित्तीय वर्ष *' : 'Financial Year *'}
                  </label>
                  <input
                    type="number"
                    value={accountYear}
                    onChange={(e) => setAccountYear(parseInt(e.target.value) || 2026)}
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
                  id="isActiveStateAccount"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#751639] cursor-pointer"
                />
                <label htmlFor="isActiveStateAccount" className="text-[13px] font-semibold text-[#314158] cursor-pointer">
                  {isHindi ? 'लाइव राज्य लेखा पंजिका में प्रकाशित करें' : 'Publish to Live State Accounts Registry'}
                </label>
              </div>

              <div className="border-t border-[#EDE9E9] pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-[#F8F7F7] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-[8px] text-white font-semibold text-xs shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  {editingId ? (isHindi ? 'अद्यतन करें' : 'Update Account') : (isHindi ? 'सहेजें' : 'Save Account')}
                </button>
              </div>
            </form>
          </div>
        </div>
    );
  }

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
          {isHindi ? 'राज्य लेखा प्रबंधन' : 'State Accounts'}
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
          
          {/* Row 1: Search, Status, State, Category */}
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

            {/* State */}
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
                {isHindi ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}
              </label>
              <SearchableStateSelect
                value={stateFilter}
                onChange={(val) => {
                  setStateFilter(val);
                  setPage(1);
                }}
                states={states}
                placeholder={isHindi ? 'सभी राज्य और केंद्र शासित प्रदेश' : 'All States & UTs'}
                allLabel={isHindi ? 'सभी राज्य और केंद्र शासित प्रदेश' : 'All States & UTs'}
                allowAll={true}
                size="sm"
              />
            </div>

            {/* Category */}
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
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Year, Month, Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[#F5F3F4]">
            
            {/* Year */}
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
                {isHindi ? 'वित्तीय वर्ष' : 'Financial Year'}
              </label>
              <div className="relative w-full">
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{isHindi ? 'सभी वर्ष' : 'All Years'}</option>
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Month */}
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
                {isHindi ? 'माह' : 'Month'}
              </label>
              <div className="relative w-full">
                <select
                  value={monthFilter}
                  onChange={(e) => {
                    setMonthFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{isHindi ? 'सभी माह' : 'All Months'}</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort */}
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
                  <option value="year_desc">{isHindi ? 'वर्ष (नवीनतम पहले)' : 'Year (Newest first)'}</option>
                  <option value="year_asc">{isHindi ? 'वर्ष (पुरातन पहले)' : 'Year (Oldest first)'}</option>
                  <option value="title_asc">{isHindi ? 'शीर्षक (अ से ज्ञ)' : 'Title (A to Z)'}</option>
                  <option value="title_desc">{isHindi ? 'शीर्षक (ज्ञ से अ)' : 'Title (Z to A)'}</option>
                  <option value="state_asc">{isHindi ? 'राज्य नाम (अ से ज्ञ)' : 'State Name (A to Z)'}</option>
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
            {isHindi ? 'राज्य लेखा पंजिका' : 'State Accounts Registry'}
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
            <span>{isHindi ? 'नया राज्य लेखा जोड़ें' : 'Add State Account'}</span>
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
                  {isHindi ? 'राज्य / केंद्र शासित प्रदेश' : 'STATE / UT'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'श्रेणी' : 'CATEGORY'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.year}
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
                        onClick={() => setViewingAccount(item)}
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

                    {/* State / UT */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[13px] text-[#314158]">
                        <Building2 className="w-3.5 h-3.5 text-[#90A1B9] shrink-0" />
                        <span>{item.state_name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#F8F7F7] text-[#314158] border border-[#EDE9E9]">
                        {item.category_name}
                      </span>
                    </td>

                    {/* Year & Volume */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-[13px] font-semibold text-[#0F172B]">
                        {item.account_year}
                      </div>
                      <div className="text-[11px] text-[#62748E]">
                        {item.volume || item.month}
                      </div>
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
                          onClick={() => setViewingAccount(item)}
                          className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                          title={isHindi ? 'खाता विवरण देखें' : 'View Account Details'}
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#94A3B8] hover:bg-zinc-50 hover:border-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              title={t.previous}
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

              const isActive = page === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-[8px] text-[14px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-[#751639] text-white font-semibold shadow-xs'
                      : 'text-[#1D4ED8] hover:bg-zinc-100'
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
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] hover:bg-zinc-50 hover:border-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              title={t.next}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function AdminStateAccountsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-zinc-400">
        <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading State Accounts module...</span>
      </div>
    }>
      <AdminStateAccountsContent />
    </Suspense>
  );
}



