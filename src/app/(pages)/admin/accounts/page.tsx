'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Upload, 
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';

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
  { id: 'all', label: 'All Subtopics / Categories', label_hi: 'सभी उपविषय / श्रेणियाँ' },
  { id: 'finance', label: 'Finance Accounts (Vol I & Vol II)', label_hi: 'वित्त लेखे (खंड I और खंड II)' },
  { id: 'glance', label: 'Accounts at a Glance', label_hi: 'एक नज़र में लेखे' },
  { id: 'appropriation', label: 'Appropriation Accounts', label_hi: 'विनियोग लेखे' },
  { id: 'monthly', label: 'Monthly Key Indicators', label_hi: 'मासिक मुख्य संकेतक' },
  { id: 'faaa', label: 'FA&AA Data', label_hi: 'एफए एवं एए डेटा' },
  { id: 'ut', label: 'Union Territories Accounts', label_hi: 'केंद्र शासित प्रदेश लेखे' },
  { id: 'combined', label: 'Combined Finance & Revenue Accounts', label_hi: 'संयुक्त वित्त एवं राजस्व लेखे' },
  { id: 'conference', label: 'State Finance Secretaries Conf.', label_hi: 'राज्य वित्त सचिव सम्मेलन' },
];

const UT_NAMES = ['Puducherry', 'Jammu & Kashmir', 'Delhi', 'Ladakh', 'Chandigarh'];

function AdminAccountsManagementHubContent() {
  const { isHindi, t, getText } = useAdminLanguage();
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active subtopic tab & filters
  const [activeSubtopic, setActiveSubtopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('All');
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

  // Batch / Bulk Add Modal State
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [batchStateId, setBatchStateId] = useState('');
  const [batchStateName, setBatchStateName] = useState('Andhra Pradesh');
  const [batchYear, setBatchYear] = useState('2026-27');
  const [batchCategory, setBatchCategory] = useState('Monthly Key Indicators');
  const [batchBaseFileUrl, setBatchBaseFileUrl] = useState('https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf');
  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);

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

  // Load Accounts Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const isCentral = activeSubtopic === 'combined' || activeSubtopic === 'conference' || levelFilter === 'Central';
      const endpoint = isCentral ? '/api/combined-accounts' : '/api/state-accounts';
      
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      
      if (appliedSearch) params.set('query', appliedSearch);
      if (statusFilter !== 'All') params.set('status', statusFilter.toLowerCase());
      else params.set('status', 'all');
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
    setLoading(false);
  }, [API_URL, activeSubtopic, levelFilter, page, pageSize, appliedSearch, statusFilter, yearFilter, sortFilter, stateFilter, reportTypeFilter]);

  useEffect(() => {
    loadData();
    const handleStateUpdate = () => loadData();
    const handleCombinedUpdate = () => loadData();
    window.addEventListener('stateAccountsChange', handleStateUpdate);
    window.addEventListener('combinedAccountsChange', handleCombinedUpdate);
    return () => {
      window.removeEventListener('stateAccountsChange', handleStateUpdate);
      window.removeEventListener('combinedAccountsChange', handleCombinedUpdate);
    };
  }, [loadData]);

  const handleApplyFilter = () => {
    setAppliedSearch(searchKeyword.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setAppliedSearch('');
    setStatusFilter('All');
    setLevelFilter('All');
    setReportTypeFilter('All');
    setYearFilter('All');
    setStateFilter('All');
    setSortFilter('newest');
    setActiveSubtopic('all');
    setPage(1);
    router.push('/admin/accounts');
  };

  const handleSubtopicChange = (subId: string) => {
    setActiveSubtopic(subId);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    const isCentral = activeSubtopic === 'combined' || activeSubtopic === 'conference';
    setFormSubtopic(isCentral ? 'combined' : 'state');
    setTitleEn('');
    setTitleHi('');
    setFormStateId(states.length > 0 ? states[0].id.toString() : '');
    setFormStateName(states.length > 0 ? states[0].name : '');
    setFormCategory(
      activeSubtopic === 'conference' ? 'State Finance Secretaries Conference' :
      activeSubtopic === 'combined' ? 'Combined Finance & Revenue' :
      activeSubtopic === 'glance' ? 'Accounts at a Glance' :
      activeSubtopic === 'appropriation' ? 'Appropriation Accounts' :
      activeSubtopic === 'monthly' ? 'Monthly Key Indicators' :
      activeSubtopic === 'faaa' ? 'FA&AA Data' : 'Finance Accounts'
    );
    setFormYear(new Date().getFullYear().toString());
    setFormMonth('Annual');
    setFormVolume('Vol I');
    setFileUrl('https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf');
    setUploadedFileName('');
    setUploadedFileSize('');
    setExternalLink('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: AccountItem) => {
    setEditingId(item.rawId);
    setFormSubtopic(item.subtopic_type === 'state' ? 'state' : 'combined');
    setTitleEn(item.title_en || '');
    setTitleHi(item.title_hi || '');
    setFormStateId(item.state_id ? item.state_id.toString() : '');
    setFormStateName(item.state_name || '');
    setFormCategory(item.category_name || 'Finance Accounts');
    setFormYear(item.account_year?.toString() || item.year || '2026');
    setFormMonth(item.month || 'Annual');
    setFormVolume(item.volume || 'Vol I');
    setFileUrl(item.file_url || item.pdf_url || '');
    setUploadedFileName(item.file_name || '');
    setExternalLink(item.external_link || '');
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

  const handleDelete = async (item: AccountItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title_en}"?`)) return;
    try {
      const endpoint = item.subtopic_type === 'state' ? 'state-accounts' : 'combined-accounts';
      await fetch(`${API_URL}/api/${endpoint}/${item.rawId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete account:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(item.subtopic_type === 'state' ? 'stateAccountsChange' : 'combinedAccountsChange'));
    }
    await loadData();
    if (viewingItem?.rawId === item.rawId) {
      setViewingItem(null);
    }
  };

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
      console.warn('Save failed on server:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(isState ? 'stateAccountsChange' : 'combinedAccountsChange'));
    }
    setIsFormOpen(false);
    loadData();
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBatchSubmitting(true);

    const stName = batchStateName || (states.find(s => String(s.id) === String(batchStateId))?.name) || 'Andhra Pradesh';
    const isMonthly = batchCategory.toLowerCase().includes('monthly');
    const itemsToCreate: any[] = [];

    if (isMonthly) {
      const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
      months.forEach((m) => {
        itemsToCreate.push({
          title_en: `${m}, ${batchYear} - Monthly Key Indicators of ${stName}`,
          title_hi: `${m}, ${batchYear} - ${stName} के मासिक मुख्य संकेतक`,
          state_id: batchStateId || undefined,
          state_name: stName,
          category_name: 'Monthly Key Indicators',
          account_year: batchYear,
          year: batchYear,
          month: m,
          volume: m,
          file_url: batchBaseFileUrl,
          pdf_url: batchBaseFileUrl,
          is_active: true
        });
      });
    } else {
      ['Finance Accounts Vol I', 'Finance Accounts Vol II'].forEach((vol) => {
        itemsToCreate.push({
          title_en: `${vol} of ${stName} for ${batchYear}`,
          title_hi: `${batchYear} के लिए ${stName} के वित्त खाते ${vol.replace('Finance Accounts ', '')}`,
          state_id: batchStateId || undefined,
          state_name: stName,
          category_name: 'Finance Accounts',
          account_year: batchYear,
          year: batchYear,
          volume: vol,
          file_url: batchBaseFileUrl,
          pdf_url: batchBaseFileUrl,
          is_active: true
        });
      });
    }

    try {
      for (const item of itemsToCreate) {
        await fetch(`${API_URL}/api/state-accounts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
    } catch (err) {
      console.warn('Batch submit warning:', err);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stateAccountsChange'));
    }

    setIsBatchSubmitting(false);
    setIsBatchOpen(false);
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
          {isHindi ? 'लेखा प्रबंधन' : 'Accounts Management'}
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
          
          {/* Row 1: Search, Status, Subtopic Category, Admin Level */}
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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                placeholder={isHindi ? 'लेखा पंजिका में खोजें...' : 'Search accounts registry...'}
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

            {/* Subtopic Category */}
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
                {isHindi ? 'उपविषय / श्रेणी' : 'Subtopic / Category'}
              </label>
              <div className="relative w-full">
                <select
                  value={activeSubtopic}
                  onChange={(e) => handleSubtopicChange(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {SUBTOPIC_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{isHindi ? opt.label_hi : opt.label}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Administrative Level */}
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
                {isHindi ? 'प्रशासनिक स्तर' : 'Administrative Level'}
              </label>
              <div className="relative w-full">
                <select
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{isHindi ? 'सभी स्तर' : 'All Levels'}</option>
                  <option value="State">{isHindi ? 'राज्य सरकार के लेखे' : 'State Government Accounts'}</option>
                  <option value="UT">{isHindi ? 'केंद्र शासित प्रदेश लेखे' : 'Union Territories Accounts'}</option>
                  <option value="Central">{isHindi ? 'संघ एवं केंद्रीय संकलन' : 'Union & Central Compilations'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Report Type, Report Year, State / UT, Sort */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2 border-t border-[#F5F3F4]">
            
            {/* Report Type */}
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
                {isHindi ? 'रिपोर्ट प्रकार / खंड' : 'Report Type / Volume'}
              </label>
              <div className="relative w-full">
                <select
                  value={reportTypeFilter}
                  onChange={(e) => {
                    setReportTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{isHindi ? 'सभी रिपोर्ट प्रकार' : 'All Report Types'}</option>
                  <option value="Finance Vol I">{isHindi ? 'वित्त लेखे (खंड I)' : 'Finance Accounts (Volume I)'}</option>
                  <option value="Finance Vol II">{isHindi ? 'वित्त लेखे (खंड II)' : 'Finance Accounts (Volume II)'}</option>
                  <option value="Glance">{isHindi ? 'एक नज़र में लेखे' : 'Accounts at a Glance'}</option>
                  <option value="Appropriation">{isHindi ? 'विनियोग लेखे' : 'Appropriation Accounts'}</option>
                  <option value="Monthly">{isHindi ? 'मासिक मुख्य संकेतक' : 'Monthly Key Indicators'}</option>
                  <option value="FA&AA">{isHindi ? 'पूरक एफए एवं एए डेटा' : 'FA&AA Supplementary Data'}</option>
                  <option value="Combined">{isHindi ? 'संयुक्त वित्त एवं राजस्व' : 'Combined Finance & Revenue'}</option>
                  <option value="Conference">{isHindi ? 'सम्मेलन कार्यवाही' : 'Conference Proceedings'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Year Filter */}
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
                {t.year}
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
                  {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'].map((yr) => (
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

            {/* State Filter */}
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
                  <option value="newest">{isHindi ? 'नवीनतम जोड़ा गया पहले' : 'Newly Added First'}</option>
                  <option value="year_desc">{isHindi ? 'वर्ष (नवीनतम पहले)' : 'Year (Newest first)'}</option>
                  <option value="year_asc">{isHindi ? 'वर्ष (पुरातन पहले)' : 'Year (Oldest first)'}</option>
                  <option value="title_asc">{isHindi ? 'शीर्षक (अ से ज्ञ)' : 'Title (A to Z)'}</option>
                  <option value="state_asc">{isHindi ? 'राज्य (अ से ज्ञ)' : 'State (A to Z)'}</option>
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
                onClick={handleResetFilters}
                className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer font-medium text-[14px] text-[#701537]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {t.reset}
              </button>

              <button
                type="button"
                onClick={handleApplyFilter}
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
        <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex flex-wrap justify-between items-center gap-4">
          <h2 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#0F172B'
            }}
          >
            {isHindi ? 'लेखा पंजिका' : 'Accounts Registry'}
          </h2>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsBatchOpen(true)}
              className="h-[36px] px-3.5 rounded-[8px] text-[#701537] bg-[rgba(108,20,54,0.06)] hover:bg-[rgba(108,20,54,0.12)] text-[13px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Generate 12 monthly statements or multi-volume accounts in 1 click"
            >
              <span>{isHindi ? '⚡ बैच जोड़ें' : '⚡ Batch Add'}</span>
            </button>

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
              <span>{isHindi ? '+ नया लेखा जोड़ें' : '+ Add Account'}</span>
            </button>
          </div>
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
                  {isHindi ? 'अधिकार क्षेत्र' : 'JURISDICTION'}
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

                    {/* Jurisdiction */}
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
                        {item.account_year || item.year}
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
                          onClick={() => setViewingItem(item)}
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
                          onClick={() => handleDelete(item)}
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
                  {isHindi ? 'लेखा विवरण जानकारी' : 'Account Statement Details'}
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
                    {isHindi ? 'अधिकार क्षेत्र / राज्य:' : 'Jurisdiction / State:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingItem.state_name}</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'श्रेणी:' : 'Category:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingItem.category_name}</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'वित्तीय वर्ष:' : 'Financial Year:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingItem.account_year || viewingItem.year}</span>
                </div>

                <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">
                    {isHindi ? 'खंड / माह:' : 'Volume / Month:'}
                  </span>
                  <span className="text-[14px] font-medium text-[#314158]">{viewingItem.volume} ({viewingItem.month})</span>
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
                {isHindi ? 'खाता संपादित करें' : 'Edit Account'}
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
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EDE9E9] max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div>
                <h3 className="font-semibold text-[16px]">
                  {editingId ? (isHindi ? `लेखा विवरण #${editingId} संपादित करें` : `Edit Account Statement #${editingId}`) : (isHindi ? 'नया लेखा विवरण जोड़ें' : 'Add Account Statement')}
                </h3>
                <p className="text-[12px] text-white/80">
                  {isHindi ? 'लेखा डेटासेट और सार्वजनिक पोर्टल पीडीएफ लिंक कॉन्फ़िगर करें' : 'Configure accounts dataset and public portal PDF link'}
                </p>
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
                  placeholder="e.g. Finance Accounts Vol I of Maharashtra 2026-27"
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
                  placeholder="उदा. महाराष्ट्र के वित्त खाते भाग I"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {formSubtopic === 'state' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'राज्य / केंद्र शासित प्रदेश *' : 'State / Union Territory *'}
                  </label>
                  <SearchableStateSelect
                    value={formStateId}
                    onChange={(val) => {
                      setFormStateId(val);
                      const st = states.find(s => s.id.toString() === val);
                      if (st) setFormStateName(st.name);
                    }}
                    states={states}
                    placeholder={isHindi ? 'राज्य / केंद्र शासित प्रदेश चुनें' : 'Select State / UT'}
                    allowAll={false}
                    size="md"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'रिपोर्ट श्रेणी *' : 'Report Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="Finance Accounts">{isHindi ? 'वित्त लेखे' : 'Finance Accounts'}</option>
                    <option value="Accounts at a Glance">{isHindi ? 'एक नज़र में लेखे' : 'Accounts at a Glance'}</option>
                    <option value="Appropriation Accounts">{isHindi ? 'विनियोग लेखे' : 'Appropriation Accounts'}</option>
                    <option value="Monthly Key Indicators">{isHindi ? 'मासिक मुख्य संकेतक' : 'Monthly Key Indicators'}</option>
                    <option value="FA&AA Data">{isHindi ? 'एफए एवं एए डेटा' : 'FA&AA Data'}</option>
                    <option value="Combined Finance and Revenue Accounts">{isHindi ? 'संयुक्त वित्त एवं राजस्व' : 'Combined Finance & Revenue'}</option>
                    <option value="Annual Conference of State Finance Secretaries">{isHindi ? 'सम्मेलन कार्यवाही' : 'Conference Proceedings'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'वित्तीय वर्ष *' : 'Financial Year *'}
                  </label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="2026-27"
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
                  placeholder="https://d7i5wg8xwe4hf.cloudfront.net/..."
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveAccount"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#751639] cursor-pointer"
                />
                <label htmlFor="isActiveAccount" className="text-[13px] font-semibold text-[#314158] cursor-pointer">
                  {isHindi ? 'लाइव लेखा पंजिका में प्रकाशित करें' : 'Publish to Live Accounts Registry'}
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
      )}

      {/* ── 6. BATCH ADD MODAL ── */}
      {isBatchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EDE9E9] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div>
                <h3 className="font-semibold text-[16px]">
                  {isHindi ? '⚡ 1-क्लिक बैच खाता जेनरेटर' : '⚡ 1-Click Batch Account Generator'}
                </h3>
                <p className="text-[12px] text-white/80">
                  {isHindi ? '12 मासिक संकेतक या बहु-खंड सेट बैच में बनाएँ' : 'Batch create 12 monthly indicators or multi-volume sets'}
                </p>
              </div>
              <button
                onClick={() => setIsBatchOpen(false)}
                className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleBatchSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'राज्य / अधिकार क्षेत्र' : 'State / Jurisdiction'}
                </label>
                <SearchableStateSelect
                  value={batchStateId}
                  onChange={(val) => {
                    setBatchStateId(val);
                    const st = states.find(s => s.id.toString() === val);
                    if (st) setBatchStateName(st.name);
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
                    {isHindi ? 'रिपोर्ट श्रेणी' : 'Report Category'}
                  </label>
                  <select
                    value={batchCategory}
                    onChange={(e) => setBatchCategory(e.target.value)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="Monthly Key Indicators">{isHindi ? '12 महीने के संकेतक (अप्रैल - मार्च)' : '12 Months Indicators (Apr - Mar)'}</option>
                    <option value="Finance Accounts">{isHindi ? 'वित्त लेखे (खंड I और खंड II)' : 'Finance Accounts (Vol I & Vol II)'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'वित्तीय वर्ष' : 'Financial Year'}
                  </label>
                  <input
                    type="text"
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    placeholder="2026-27"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              <div className="border-t border-[#EDE9E9] pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(false)}
                  className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-[#F8F7F7] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isBatchSubmitting}
                  className="px-6 py-2 rounded-[8px] text-white font-semibold text-xs shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  {isBatchSubmitting ? (isHindi ? 'जेनरेट हो रहा है...' : 'Generating...') : (isHindi ? 'बैच बनाएँ' : 'Generate Batch')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminAccountsManagementHub() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-zinc-400">
        <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Accounts module...</span>
      </div>
    }>
      <AdminAccountsManagementHubContent />
    </Suspense>
  );
}
