'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import SearchableStateSelect from '@/components/admin/SearchableStateSelect';
import { 
  Building2, 
  Globe, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  X, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Shield, 
  GraduationCap, 
  Train, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface WebsiteOfficeItem {
  id: string;
  rawId: string;
  parent_id?: number;
  title: string;
  title_hi: string;
  state_title?: string;
  state_id: number | null;
  state_name: string;
  department_id: number | null;
  department_name: string;
  url: string;
  email: string;
  theme?: string;
  logo?: string;
  status: number;
  is_active: boolean;
  is_system?: boolean;
  created_at?: string | null;
  modified_at?: string | null;
}

interface StateLookup {
  id: string | number;
  name: string;
  slug?: string;
}

interface DepartmentLookup {
  id: string | number;
  title: string;
  slug?: string;
  status?: number;
}

import { useAdminLanguage } from '@/lib/useAdminLanguage';

function AdminPresenceContent() {
  const API_URL = getApiBaseUrl();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isHindi, t } = useAdminLanguage();

  // ── Master Data States ──
  const [offices, setOffices] = useState<WebsiteOfficeItem[]>([]);
  const [states, setStates] = useState<StateLookup[]>([]);
  const [departments, setDepartments] = useState<DepartmentLookup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Pagination States ──
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  // ── Filter States ──
  const [searchFor, setSearchFor] = useState<string>('');
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [subsiteTypeFilter, setSubsiteTypeFilter] = useState<string>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [scopeFilter, setScopeFilter] = useState<string>('All');
  const [sortFilter, setSortFilter] = useState<string>('newest');

  // ── Modal States ──
  const [viewingOffice, setViewingOffice] = useState<WebsiteOfficeItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingRawId, setEditingRawId] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<WebsiteOfficeItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // ── Form Input States ──
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formDeptId, setFormDeptId] = useState<string>('1');
  const [formStateId, setFormStateId] = useState<string>('0');
  const [formStateTitle, setFormStateTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTheme, setFormTheme] = useState('default');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // ── Sync URL Search Parameters (e.g. ?type=defence, ?type=ae, etc.) ──
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const deptParam = searchParams.get('dept');
    const stateParam = searchParams.get('state');

    if (typeParam) {
      const t = typeParam.toLowerCase();
      if (t === 'ae') {
        setCategoryFilter('State Level Offices');
        setDepartmentFilter('7');
      } else if (t === 'audit') {
        setCategoryFilter('State Level Offices');
        setDepartmentFilter('1');
      } else if (t === 'defence' || t === 'defense') {
        setCategoryFilter('Central Audit Offices');
        setDepartmentFilter('9');
      } else if (t === 'railway') {
        setCategoryFilter('Central Audit Offices');
        setDepartmentFilter('6');
      } else if (t === 'ministries') {
        setCategoryFilter('Central Audit Offices');
        setDepartmentFilter('8');
      } else if (t === 'overseas') {
        setCategoryFilter('Central Audit Offices');
        setSubsiteTypeFilter('Overseas Office');
      } else if (t === 'rti') {
        setCategoryFilter('Training Institutes');
        setDepartmentFilter('5');
      } else if (t === 'iced' || t === 'icisa' || t === 'naaa' || t === 'ical') {
        setCategoryFilter('Training Institutes');
        setSubsiteTypeFilter(t.toUpperCase());
      }
    }

    if (deptParam) setDepartmentFilter(deptParam);
    if (stateParam) setStateFilter(stateParam);
    setPage(1);
  }, [searchParams]);

  // ── Load Lookups (States & Departments from DB) ──
  const loadLookups = useCallback(async () => {
    try {
      const [statesRes, deptsRes] = await Promise.all([
        fetch('/api/admin/crud?table=states', { cache: 'no-store' }),
        fetch('/api/admin/crud?table=departments', { cache: 'no-store' })
      ]);

      if (statesRes.ok) {
        const sData = await statesRes.json();
        setStates(sData.data || []);
      }
      if (deptsRes.ok) {
        const dData = await deptsRes.json();
        setDepartments(dData.data || []);
      }
    } catch (err) {
      console.warn('Could not load lookup states/departments:', err);
    }
  }, []);

  // ── Load Offices Data ──
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/crud?table=websites&limit=1000', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setOffices(json.data || []);
      } else {
        setToastMessage({ type: 'error', text: `Failed to load presence offices (Status ${res.status})` });
      }
    } catch (err: any) {
      console.error('Error loading presence offices:', err);
      setToastMessage({ type: 'error', text: err?.message || 'Failed to connect to backend' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLookups();
    loadData();
  }, [loadLookups, loadData]);

  // ── Apply Filters & Search ──
  const handleSearchGo = () => {
    setAppliedSearch(searchFor.trim());
    setPage(1);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setDepartmentFilter('All');
    setSubsiteTypeFilter('All');
    setStateFilter('All');
    setScopeFilter('All');
    setSortFilter('newest');
    setPage(1);
    router.push('/admin/offices');
  };

  // ── Filtering Logic ──
  const filteredOffices = useMemo(() => {
    return offices.filter((item) => {
      // 1. Keyword / Applied Search
      if (appliedSearch) {
        const q = appliedSearch.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesTitleHi = item.title_hi?.toLowerCase().includes(q);
        const matchesState = item.state_name?.toLowerCase().includes(q) || item.state_title?.toLowerCase().includes(q);
        const matchesDept = item.department_name?.toLowerCase().includes(q);
        const matchesUrl = item.url?.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesId = item.id?.toString() === q;
        if (!matchesTitle && !matchesTitleHi && !matchesState && !matchesDept && !matchesUrl && !matchesEmail && !matchesId) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && !item.is_active) return false;
        if (statusFilter === 'Inactive' && item.is_active) return false;
      }

      // 3. Department Filter
      if (departmentFilter !== 'All') {
        if (String(item.department_id) !== departmentFilter) return false;
      }

      // 4. State / UT Filter
      if (stateFilter !== 'All') {
        if (String(item.state_id) !== stateFilter && String(item.state_name).toLowerCase() !== stateFilter.toLowerCase()) {
          return false;
        }
      }

      // 5. Presence Wing / Category Filter
      const deptId = item.department_id;
      const titleLower = (item.title || '').toLowerCase();
      const urlLower = (item.url || '').toLowerCase();

      if (categoryFilter === 'State Level Offices') {
        if (deptId !== 1 && deptId !== 7) return false;
      } else if (categoryFilter === 'Central Audit Offices') {
        const isCentral = deptId === 9 || deptId === 6 || deptId === 8 || deptId === 2 || 
          urlLower.includes('/pda/') || urlLower.includes('/mab/') || titleLower.includes('overseas') || 
          titleLower.includes('defence') || titleLower.includes('defense') || titleLower.includes('railway');
        if (!isCentral) return false;
      } else if (categoryFilter === 'Training Institutes') {
        const isTraining = deptId === 5 || urlLower.includes('/rti/') || urlLower.includes('/iced') || 
          urlLower.includes('/icisa') || urlLower.includes('/naaa') || urlLower.includes('/coefa') || 
          titleLower.includes('training') || titleLower.includes('academy') || titleLower.includes('iced') || 
          titleLower.includes('icisa') || titleLower.includes('capacity');
        if (!isTraining) return false;
      }

      // 6. Subsite Type Filter
      if (subsiteTypeFilter !== 'All') {
        const st = subsiteTypeFilter.toLowerCase();
        if (st.includes('audit') && deptId !== 1) return false;
        if (st.includes('a&e') && deptId !== 7) return false;
        if (st.includes('defence') && deptId !== 9 && !titleLower.includes('defen')) return false;
        if (st.includes('railway') && deptId !== 6 && !titleLower.includes('railway')) return false;
        if (st.includes('overseas') && !urlLower.includes('/pda/') && !titleLower.includes('overseas') && !titleLower.includes('london') && !titleLower.includes('washington')) return false;
        if (st.includes('rti') && deptId !== 5 && !urlLower.includes('/rti/') && !titleLower.includes('rti')) return false;
        if (st.includes('iced') && !urlLower.includes('/iced') && !titleLower.includes('iced')) return false;
        if (st.includes('icisa') && !urlLower.includes('/icisa') && !titleLower.includes('icisa')) return false;
        if (st.includes('naaa') && !urlLower.includes('/naaa') && !titleLower.includes('naaa')) return false;
      }

      // 7. Administrative Scope
      if (scopeFilter !== 'All') {
        if (scopeFilter === 'State Level' && deptId !== 1 && deptId !== 7) return false;
        if (scopeFilter === 'Central Government' && deptId !== 9 && deptId !== 6 && deptId !== 8 && deptId !== 2) return false;
        if (scopeFilter === 'Overseas' && !urlLower.includes('/pda/') && !titleLower.includes('overseas') && !titleLower.includes('london')) return false;
        if (scopeFilter === 'Training Academy' && deptId !== 5 && !titleLower.includes('training') && !titleLower.includes('academy')) return false;
      }

      return true;
    });
  }, [offices, appliedSearch, statusFilter, departmentFilter, stateFilter, categoryFilter, subsiteTypeFilter, scopeFilter]);

  // ── Sorting Logic ──
  const sortedOffices = useMemo(() => {
    const list = [...filteredOffices];
    const parseId = (val: any) => {
      const match = String(val || '').match(/\d+/g);
      return match ? parseInt(match.join(''), 10) : 0;
    };

    switch (sortFilter) {
      case 'newest':
        return list.sort((a, b) => parseId(b.id || b.rawId) - parseId(a.id || a.rawId));
      case 'oldest':
        return list.sort((a, b) => parseId(a.id || a.rawId) - parseId(b.id || b.rawId));
      case 'title_asc':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title_desc':
        return list.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'state_asc':
        return list.sort((a, b) => (a.state_name || '').localeCompare(b.state_name || ''));
      case 'dept_asc':
        return list.sort((a, b) => (a.department_name || '').localeCompare(b.department_name || ''));
      default:
        return list.sort((a, b) => parseId(a.id || a.rawId) - parseId(b.id || b.rawId));
    }
  }, [filteredOffices, sortFilter]);

  // ── Pagination Calculation ──
  const totalCount = sortedOffices.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedOffices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedOffices.slice(start, start + pageSize);
  }, [sortedOffices, page, pageSize]);

  // ── Open View Details Modal ──
  const handleOpenView = (item: WebsiteOfficeItem) => {
    setViewingOffice(item);
  };

  // ── Open Create Modal ──
  const handleOpenCreate = () => {
    setEditingRawId(null);
    setFormTitleEn('');
    setFormTitleHi('');
    setFormDeptId('1');
    setFormStateId('0');
    setFormStateTitle('');
    setFormUrl('');
    setFormEmail('');
    setFormTheme('default');
    setFormIsActive(true);
    setIsFormOpen(true);
  };

  // ── Open Edit Modal ──
  const handleOpenEdit = (item: WebsiteOfficeItem) => {
    setEditingRawId(item.id);
    setFormTitleEn(item.title || '');
    setFormTitleHi(item.title_hi || '');
    setFormDeptId(item.department_id ? String(item.department_id) : '0');
    setFormStateId(item.state_id ? String(item.state_id) : '0');
    setFormStateTitle(item.state_title || '');
    setFormUrl(item.url || '');
    setFormEmail(item.email || '');
    setFormTheme(item.theme || 'default');
    setFormIsActive(item.is_active ?? true);
    setIsFormOpen(true);
  };

  // ── Delete Handler ──
  const handleDelete = async (id: string) => {
    const target = offices.find(o => o.id === id);
    if (!target) return;
    setDeleteCandidate(target);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/crud?table=websites&id=${deleteCandidate.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setToastMessage({ type: 'success', text: `Office "${deleteCandidate.title}" deleted successfully.` });
        setDeleteCandidate(null);
        if (viewingOffice?.id === deleteCandidate.id) {
          setViewingOffice(null);
        }
        await loadData();
      } else {
        const errData = await res.json().catch(() => ({}));
        setToastMessage({ type: 'error', text: errData.detail || 'Failed to delete office.' });
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err?.message || 'Network error occurred.' });
    } finally {
      setDeleting(false);
    }
  };

  // ── Save / Update Form Handler ──
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) {
      alert('Office Title (English) is required.');
      return;
    }

    setFormSubmitting(true);
    const payload = {
      title: formTitleEn.trim(),
      title_hi: formTitleHi.trim() || formTitleEn.trim(),
      department_id: formDeptId && formDeptId !== '0' ? parseInt(formDeptId, 10) : null,
      state_id: formStateId && formStateId !== '0' ? parseInt(formStateId, 10) : null,
      state_title: formStateTitle.trim() || undefined,
      url: formUrl.trim(),
      email: formEmail.trim(),
      theme: formTheme,
      is_active: formIsActive,
      status: formIsActive ? 1 : 0
    };

    try {
      if (editingRawId) {
        const res = await fetch(`/api/admin/crud?table=websites&id=${editingRawId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        });
        if (res.ok) {
          setToastMessage({ type: 'success', text: `Office #${editingRawId} updated successfully!` });
          setIsFormOpen(false);
          await loadData();
        } else {
          const errData = await res.json().catch(() => ({}));
          setToastMessage({ type: 'error', text: errData.detail || 'Failed to update office.' });
        }
      } else {
        const res = await fetch('/api/admin/crud?table=websites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload })
        });
        if (res.ok) {
          const resData = await res.json();
          setToastMessage({ type: 'success', text: `New Office #${resData.id || ''} created successfully!` });
          setIsFormOpen(false);
          await loadData();
        } else {
          const errData = await res.json().catch(() => ({}));
          setToastMessage({ type: 'error', text: errData.detail || 'Failed to create office.' });
        }
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', text: err?.message || 'Network error occurred.' });
    } finally {
      setFormSubmitting(false);
    }
  };

  // ── Quick 1-Click Status Toggle ──
  const handleToggleStatus = async (office: WebsiteOfficeItem) => {
    const newStatus = !office.is_active;
    try {
      const res = await fetch(`/api/admin/crud?table=websites&id=${office.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            is_active: newStatus,
            status: newStatus ? 1 : 0
          }
        })
      });
      if (res.ok) {
        setOffices(prev => prev.map(o => o.id === office.id ? { ...o, is_active: newStatus, status: newStatus ? 1 : 0 } : o));
        setToastMessage({
          type: 'success',
          text: `Office #${office.id} is now ${newStatus ? 'Active' : 'Inactive'}.`
        });
      }
    } catch (e) {
      setToastMessage({ type: 'error', text: 'Could not toggle status.' });
    }
  };

  // ── Category Badge Helper ──
  const getDeptBadgeStyle = (deptId: number | null, deptName: string) => {
    if (deptId === 1) {
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'State Audit' };
    }
    if (deptId === 7) {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Accounts & Entitlement' };
    }
    if (deptId === 9 || deptName.toLowerCase().includes('defen')) {
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Defence Audit' };
    }
    if (deptId === 6 || deptName.toLowerCase().includes('railway')) {
      return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: 'Railway Audit' };
    }
    if (deptId === 5 || deptName.toLowerCase().includes('training') || deptName.toLowerCase().includes('rti')) {
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Training Institute' };
    }
    if (deptName.toLowerCase().includes('overseas') || deptName.toLowerCase().includes('london')) {
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Overseas Audit' };
    }
    return { bg: 'bg-zinc-100 text-zinc-700 border-zinc-200', label: deptName || 'Central Audit' };
  };

  if (viewingOffice) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white rounded-[10px] border border-[#EDE9E9] p-6 flex flex-col justify-start animate-fadeIn">
        <div className="w-full max-w-[1526.2px] bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] overflow-hidden">
          
          {/* Header */}
          <div 
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewingOffice(null)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← Back</span>
              </button>
              <div>
                <h3 className="font-semibold text-[16px] flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Office Profile Details
                </h3>
                <p className="text-[12px] text-white/80">Database Record ID: #{viewingOffice.id}</p>
              </div>
            </div>
            <button
              onClick={() => setViewingOffice(null)}
              className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 text-sm">
            
            <div className="bg-[#F8F7F7] p-4 rounded-lg border border-[#EDE9E9] space-y-1.5">
              <span className="text-[11px] font-semibold text-[#62748E] uppercase tracking-wider block">Office Title (English):</span>
              <p className="text-[16px] font-bold text-[#751639]">{viewingOffice.title}</p>
              {viewingOffice.title_hi && (
                <div className="pt-2 border-t border-[#EDE9E9] mt-2">
                  <span className="text-[11px] font-semibold text-[#62748E] uppercase tracking-wider block">Office Title (हिन्दी):</span>
                  <p className="text-[14px] font-medium text-[#314158]">{viewingOffice.title_hi}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">Department Category:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDeptBadgeStyle(viewingOffice.department_id, viewingOffice.department_name).bg}`}>
                  {viewingOffice.department_name || `Dept #${viewingOffice.department_id}`}
                </span>
              </div>

              <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">State / Location:</span>
                <div className="flex items-center gap-1.5 font-medium text-[#314158]">
                  <MapPin className="w-4 h-4 text-[#90A1B9]" />
                  <span>{viewingOffice.state_name || viewingOffice.state_title || 'Union / National'}</span>
                </div>
              </div>

              <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">Subsite Route / URL:</span>
                {viewingOffice.url ? (
                  <a
                    href={viewingOffice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#751639] hover:underline font-mono text-[12px] flex items-center gap-1 break-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span>{viewingOffice.url}</span>
                  </a>
                ) : (
                  <span className="text-[#90A1B9] italic">None</span>
                )}
              </div>

              <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">Official Email Address:</span>
                {viewingOffice.email ? (
                  <a
                    href={`mailto:${viewingOffice.email}`}
                    className="text-[#314158] hover:text-[#751639] flex items-center gap-1.5 font-medium text-[13px]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#90A1B9]" />
                    <span>{viewingOffice.email}</span>
                  </a>
                ) : (
                  <span className="text-[#90A1B9] italic">None</span>
                )}
              </div>

              <div className="p-3.5 border border-[#EDE9E9] rounded-lg bg-white">
                <span className="text-[11px] font-semibold text-[#62748E] uppercase block mb-1">Publishing Status:</span>
                {viewingOffice.is_active ? (
                  <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                    Active &amp; Live
                  </span>
                ) : (
                  <span className="bg-[#FDF4F0] text-[#E11D48] border border-[#FFE4E6] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                    Inactive / Draft
                  </span>
                )}
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#F8F7F7] border-t border-[#EDE9E9] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                const target = viewingOffice;
                setViewingOffice(null);
                handleOpenEdit(target);
              }}
              className="px-4 py-2 rounded-[8px] bg-[#751639] text-white font-medium text-xs hover:opacity-90 cursor-pointer"
            >
              Edit This Office
            </button>
            <button
              type="button"
              onClick={() => setViewingOffice(null)}
              className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-white cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white rounded-[10px] border border-[#EDE9E9] p-6 flex flex-col justify-start animate-fadeIn">
        <div className="w-full max-w-[1526.2px] bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] overflow-hidden">
          
          {/* Header */}
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
                <span>← Back</span>
              </button>
              <div>
                <h3 className="font-semibold text-[16px]">
                  {editingRawId ? `Edit Office #${editingRawId}` : 'Add New Office / Subsite'}
                </h3>
                <p className="text-[12px] text-white/80">Configure office registry record and subsite portal link</p>
              </div>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
            
            {/* Title EN */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                Office Title (English) *
              </label>
              <input
                type="text"
                required
                value={formTitleEn}
                onChange={(e) => setFormTitleEn(e.target.value)}
                placeholder="e.g. Principal Accountant General (Audit-I), Maharashtra"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Title HI */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                Office Title (हिन्दी)
              </label>
              <input
                type="text"
                value={formTitleHi}
                onChange={(e) => setFormTitleHi(e.target.value)}
                placeholder="e.g. प्रधान महालेखाकार (लेखापरीक्षा-I), महाराष्ट्र"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                Department Category *
              </label>
              <div className="relative w-full">
                <select
                  value={formDeptId}
                  onChange={(e) => setFormDeptId(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="1">State Audit Offices</option>
                  <option value="7">State Accounts &amp; Entitlement (A&amp;E) Offices</option>
                  <option value="9">Defence Audit Offices</option>
                  <option value="6">Railway Audit Offices</option>
                  <option value="8">Other Ministries / Commercial Audit</option>
                  <option value="5">Training Institutes (RTI / RTC)</option>
                  {departments.filter(d => ![1, 7, 9, 6, 8, 5].includes(Number(d.id))).map((d) => (
                    <option key={d.id} value={String(d.id)}>{d.title}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* State Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                State / Union Territory
              </label>
              <SearchableStateSelect
                value={formStateId}
                onChange={(val) => setFormStateId(val)}
                states={states.map(s => ({ id: s.id, name: s.name }))}
                placeholder="Select State / UT"
                allLabel="National / Central (No State)"
                allowAll={true}
                size="md"
              />
            </div>

            {/* Subsite URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                Subsite Route / URL
              </label>
              <input
                type="text"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="e.g. /states/maharashtra/audit-1 or https://..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                Official Email Address
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g. agaumaharashtra1@cag.gov.in"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="formIsActive"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="w-4 h-4 accent-[#751639] cursor-pointer"
              />
              <label htmlFor="formIsActive" className="text-[13px] font-semibold text-[#314158] cursor-pointer">
                Publish to Live Website Portal
              </label>
            </div>

            {/* Form Actions */}
            <div className="border-t border-[#EDE9E9] pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-[#F8F7F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-6 py-2 rounded-[8px] text-white font-semibold text-xs shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                {formSubmitting ? 'Saving...' : (editingRawId ? 'Update Office' : 'Create Office')}
              </button>
            </div>

          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* ── TOAST NOTIFICATIONS ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-xs font-semibold ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-red-50 text-red-800 border-red-300'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-3 text-zinc-400 hover:text-zinc-600 font-bold"
            >
              &times;
            </button>
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
          {isHindi ? 'हमारी उपस्थिति एवं क्षेत्रीय कार्यालय' : 'Our Presence & Field Offices'}
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
          
          {/* Row 1: Search, Status, Category, Department */}
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
                placeholder={isHindi ? 'कार्यालय, यूआरएल, ईमेल खोजें...' : 'Search offices, URL, email...'}
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

            {/* Presence Wing / Category */}
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
                {t.category}
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
                  <option value="All">{t.all}</option>
                  <option value="State Level Offices">{isHindi ? 'राज्य स्तरीय कार्यालय' : 'State Level Offices'}</option>
                  <option value="Central Audit Offices">{isHindi ? 'केंद्रीय लेखापरीक्षा कार्यालय' : 'Central Audit Offices'}</option>
                  <option value="Training Institutes">{isHindi ? 'प्रशिक्षण संस्थान' : 'Training Institutes'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Department Category */}
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
                {isHindi ? 'विभाग' : 'Department'}
              </label>
              <div className="relative w-full">
                <select
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={String(d.id)}>{d.title}</option>
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

          {/* Row 2: Subsite Classification, State/UT, Scope, Sort */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2 border-t border-[#F5F3F4]">
            
            {/* Subsite Classification */}
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
                {isHindi ? 'वर्गीकरण' : 'Classification'}
              </label>
              <div className="relative w-full">
                <select
                  value={subsiteTypeFilter}
                  onChange={(e) => {
                    setSubsiteTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  <option value="State Audit">{isHindi ? 'राज्य लेखापरीक्षा (PAG/AG)' : 'State Audit (PAG/AG)'}</option>
                  <option value="A&E">{isHindi ? 'लेखा एवं हकदारी (A&E)' : 'Accounts & Entitlement (A&E)'}</option>
                  <option value="Defence">{isHindi ? 'रक्षा लेखापरीक्षा निदेशालय' : 'Defence Audit Directorates'}</option>
                  <option value="Railway">{isHindi ? 'रेलवे लेखापरीक्षा कार्यालय' : 'Railway Audit Offices'}</option>
                  <option value="Overseas Office">{isHindi ? 'विदेशी लेखापरीक्षा' : 'Overseas Audit'}</option>
                  <option value="RTI">{isHindi ? 'क्षेत्रीय प्रशिक्षण (RTI/RTC)' : 'Regional Training (RTI/RTC)'}</option>
                  <option value="ICED">iCED</option>
                  <option value="ICISA">iCISA</option>
                  <option value="NAAA">NAAA</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* State Select */}
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
                {t.state}
              </label>
              <SearchableStateSelect
                value={stateFilter}
                onChange={(val) => {
                  setStateFilter(val);
                  setPage(1);
                }}
                states={states.map(s => ({ id: s.id, name: s.name }))}
                placeholder={isHindi ? 'सभी राज्य और केंद्र शासित प्रदेश' : 'All States & UTs'}
                allLabel={isHindi ? 'सभी राज्य और केंद्र शासित प्रदेश' : 'All States & UTs'}
                allowAll={true}
                size="sm"
              />
            </div>

            {/* Administrative Scope */}
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
                {isHindi ? 'क्षेत्र / दायरा' : 'Scope'}
              </label>
              <div className="relative w-full">
                <select
                  value={scopeFilter}
                  onChange={(e) => {
                    setScopeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  <option value="State Level">{isHindi ? 'राज्य स्तर' : 'State Level'}</option>
                  <option value="Central Government">{isHindi ? 'केंद्र सरकार' : 'Central Government'}</option>
                  <option value="Overseas">{isHindi ? 'विदेश' : 'Overseas'}</option>
                  <option value="Training Academy">{isHindi ? 'प्रशिक्षण अकादमी' : 'Training Academy'}</option>
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
                {isHindi ? 'क्रम' : 'Sort Order'}
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
                  <option value="newest">{isHindi ? 'नवीनतम पहले' : 'Newly Added First'}</option>
                  <option value="oldest">{isHindi ? 'पुरातन पहले' : 'Oldest Added First'}</option>
                  <option value="title_asc">{isHindi ? 'कार्यालय नाम (A से Z)' : 'Office Title (A to Z)'}</option>
                  <option value="title_desc">{isHindi ? 'कार्यालय नाम (Z से A)' : 'Office Title (Z to A)'}</option>
                  <option value="state_asc">{isHindi ? 'राज्य नाम (A से Z)' : 'State Name (A to Z)'}</option>
                  <option value="dept_asc">{isHindi ? 'विभाग (A से Z)' : 'Department (A to Z)'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Filter Controls: Rows per page & Action Buttons */}
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
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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
            {isHindi ? 'हमारी उपस्थिति एवं क्षेत्रीय कार्यालय' : 'Our Presence & Field Offices'}
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
            <span>{t.addNewOffice}</span>
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
                    <span>{t.officeName}</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.category}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.state}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'वेबसाइट / यूआरएल' : 'ROUTE / URL'}
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
              ) : paginatedOffices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#90A1B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.noData}
                  </td>
                </tr>
              ) : (
                paginatedOffices.map((office) => {
                  const badge = getDeptBadgeStyle(office.department_id, office.department_name);

                  return (
                    <tr key={office.rawId || office.id} className="hover:bg-[#FDFBFC] transition-colors">
                      
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
                          #{office.id}
                        </span>
                      </td>

                      {/* Office Title */}
                      <td className="px-6 py-4">
                        <div 
                          className="cursor-pointer hover:underline"
                          onClick={() => handleOpenView(office)}
                          title="Click to view details"
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
                            {isHindi ? (office.title_hi || office.title) : office.title}
                          </div>
                          {office.title_hi && office.title_hi !== office.title && !isHindi && (
                            <div className="text-[12px] text-[#62748E] line-clamp-1 mt-0.5">
                              {office.title_hi}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Department / Category */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* State / Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] text-[#314158]">
                          <MapPin className="w-3.5 h-3.5 text-[#90A1B9] shrink-0" />
                          <span className="truncate">{office.state_name || office.state_title || (isHindi ? 'केंद्रीय / राष्ट्रीय' : 'Union / National')}</span>
                        </div>
                      </td>

                      {/* URL / Subsite Route */}
                      <td className="px-6 py-4">
                        {office.url ? (
                          <a
                            href={office.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#751639] hover:underline text-[13px] flex items-center gap-1 truncate max-w-[200px]"
                            title={office.url}
                          >
                            <span className="truncate">{office.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-[#90A1B9] italic text-[13px]">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(office)}
                          className="cursor-pointer"
                          title="Click to toggle status"
                        >
                          {office.is_active ? (
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
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenView(office)}
                            className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                            title={t.view}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(office)}
                            className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                            title={t.edit}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(office.id)}
                            className="text-[#EF4444] hover:text-[#B91C1C] transition-colors cursor-pointer"
                            title={t.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
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
            {t.showing} {paginatedOffices.length > 0 ? (page - 1) * pageSize + 1 : 0} {t.to} {Math.min(page * pageSize, totalCount)} {t.of} {totalCount} {t.entries}
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

      {/* ── 6. DELETE CONFIRMATION MODAL (Confined to content pane) ── */}
      {deleteCandidate && (
        <div className="absolute inset-0 z-30 bg-black/20 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[12px] shadow-2xl border border-[#EDE9E9] max-w-md w-full overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-[16px] text-[#0F172B]">Delete Office Record?</h3>
                <p className="text-[12px] text-[#62748E]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-[13px] text-[#314158]">
              Are you sure you want to permanently delete <strong className="text-[#751639]">"{deleteCandidate.title}"</strong> (ID #{deleteCandidate.id})?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-[#F8F7F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-[8px] bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminPresencePage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-zinc-400">
        <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Our Presence module...</span>
      </div>
    }>
      <AdminPresenceContent />
    </Suspense>
  );
}
