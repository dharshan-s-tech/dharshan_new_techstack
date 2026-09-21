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

function AdminPresenceContent() {
  const API_URL = getApiBaseUrl();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Master Data States ──
  const [offices, setOffices] = useState<WebsiteOfficeItem[]>([]);
  const [states, setStates] = useState<StateLookup[]>([]);
  const [departments, setDepartments] = useState<DepartmentLookup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Pagination States (Matching Reports Module) ──
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  // ── Filter States (Matching Reports Module Layout) ──
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
      return { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'State Audit' };
    }
    if (deptId === 7) {
      return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Accounts & Entitlement' };
    }
    if (deptId === 9 || deptName.toLowerCase().includes('defen')) {
      return { bg: 'bg-purple-50 text-purple-800 border-purple-200', label: 'Defence Audit' };
    }
    if (deptId === 6 || deptName.toLowerCase().includes('railway')) {
      return { bg: 'bg-cyan-50 text-cyan-800 border-cyan-200', label: 'Railway Audit' };
    }
    if (deptId === 5 || deptName.toLowerCase().includes('training') || deptName.toLowerCase().includes('rti')) {
      return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Training Institute' };
    }
    if (deptName.toLowerCase().includes('overseas') || deptName.toLowerCase().includes('london')) {
      return { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', label: 'Overseas Audit' };
    }
    return { bg: 'bg-zinc-100 text-zinc-800 border-zinc-200', label: deptName || 'Central Audit' };
  };

  return (
    <div className="space-y-4 text-xs text-zinc-700 font-sans">
      
      {/* ── TOAST NOTIFICATIONS ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-none shadow-lg border text-xs font-semibold ${
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

      {/* ── 1. TOP FILTERS PANEL (Exact Reports Module Layout) ── */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        
        {/* Row 1: Search, Status, Category Wing, Department, Subsite Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          
          {/* 1. Keyword / Title Search */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search Keyword / Title:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
              placeholder="Search offices registry..."
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
            />
          </div>

          {/* 2. Publish Status */}
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
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* 3. Presence Wing / Category */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Presence Category / Wing:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Categories</option>
              <option value="State Level Offices">State Level Offices</option>
              <option value="Central Audit Offices">Central Audit Offices</option>
              <option value="Training Institutes">Training Institutes</option>
            </select>
          </div>

          {/* 4. Department Category */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Department Category:</label>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>{d.title}</option>
              ))}
            </select>
          </div>

          {/* 5. Subsite Type / Classification */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Subsite Classification:</label>
            <select
              value={subsiteTypeFilter}
              onChange={(e) => {
                setSubsiteTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Subsite Types</option>
              <option value="State Audit">State Audit Offices (PAG/AG)</option>
              <option value="A&E">Accounts &amp; Entitlement (A&amp;E)</option>
              <option value="Defence">Defence Audit Directorates</option>
              <option value="Railway">Railway Audit Offices</option>
              <option value="Overseas Office">Overseas Audit (London/Washington/KL)</option>
              <option value="RTI">Regional Training Institutes (RTI/RTC)</option>
              <option value="ICED">iCED (Environment Audit - Jaipur)</option>
              <option value="ICISA">iCISA (Information Systems - Noida)</option>
              <option value="NAAA">NAAA (National Academy - Shimla)</option>
            </select>
          </div>

        </div>

        {/* Row 2: State / UT, Scope, Sort By, Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 border-t border-zinc-150">
          
          {/* State Select */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1">State / Union Territory:</label>
            <SearchableStateSelect
              value={stateFilter}
              onChange={(val) => {
                setStateFilter(val);
                setPage(1);
              }}
              states={states.map(s => ({ id: s.id, name: s.name }))}
              placeholder="All States &amp; UTs"
              allLabel="All States &amp; UTs"
              allowAll={true}
              size="sm"
            />
          </div>

          {/* Administrative Scope */}
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Administrative Scope:</label>
            <select
              value={scopeFilter}
              onChange={(e) => {
                setScopeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Administrative Scopes</option>
              <option value="State Level">State Level Offices</option>
              <option value="Central Government">Central Government Audit</option>
              <option value="Overseas">Overseas / International</option>
              <option value="Training Academy">Training Academy &amp; RTIs</option>
            </select>
          </div>

          {/* Sort Order */}
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
              <option value="newest">Newly Added First (ID Desc)</option>
              <option value="oldest">Oldest Added First (ID Asc)</option>
              <option value="title_asc">Office Title (A to Z)</option>
              <option value="title_desc">Office Title (Z to A)</option>
              <option value="state_asc">State Name (A to Z)</option>
              <option value="dept_asc">Department Category (A to Z)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearchGo}
              className="flex-1 border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-4 py-1.5 rounded-none transition-colors font-bold bg-white cursor-pointer shadow-xs"
            >
              Apply Filter
            </button>
            <button
              onClick={handleSearchReset}
              className="px-4 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 py-1.5 rounded-none transition-colors font-medium bg-white cursor-pointer"
            >
              Reset
            </button>
          </div>

        </div>

        {/* Bottom Summary Strip */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 gap-2">
          <span>
            Active Filter: <strong>{categoryFilter}</strong> | Department: <strong>{departmentFilter === 'All' ? 'All Departments' : `Dept #${departmentFilter}`}</strong> | Status: <strong>{statusFilter}</strong> | State: <strong>{stateFilter === 'All' ? 'All States' : stateFilter}</strong>
          </span>
          <span>
            Source: <strong className="text-emerald-700">PostgreSQL cag_revamp.websites ({offices.length} live offices) + Field Subsites</strong>
          </span>
        </div>

      </div>

      {/* ── 2. TABLE GRID PANEL (Exact Reports Module Layout) ── */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        
        {/* Table Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3 bg-[#fafbfc]">
          <h3 className="font-bold text-zinc-800 text-sm">
            Our Presence &amp; Field Offices Management Registry [ Displaying {paginatedOffices.length} of {totalCount.toLocaleString()} ]
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
                className="border border-zinc-300 px-2 py-1 bg-white text-zinc-800 focus:outline-none"
              >
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreate}
              className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add New Office / Subsite</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-3 py-3 border-r border-white/20 w-12 text-center">#</th>
                <th className="px-4 py-3 border-r border-white/20 min-w-[260px]">Office / Subsite Title &amp; Hindi Translation</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Category / Department</th>
                <th className="px-3 py-3 border-r border-white/20 w-36">State / Territory</th>
                <th className="px-3 py-3 border-r border-white/20 w-48">Subsite Route / URL</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Official Email</th>
                <th className="px-3 py-3 border-r border-white/20 w-24 text-center">Status</th>
                <th className="px-3 py-3 text-center min-w-[220px] w-60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving live presence offices &amp; websites records...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedOffices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    No matching office or subsite records found. Try adjusting your filters or search keywords.
                  </td>
                </tr>
              ) : (
                paginatedOffices.map((office) => {
                  const badge = getDeptBadgeStyle(office.department_id, office.department_name);

                  return (
                    <tr key={office.rawId || office.id} className="hover:bg-zinc-50/70 transition-colors text-zinc-800">
                      
                      {/* ID */}
                      <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400 text-[11px]">
                        {office.id}
                      </td>

                      {/* Title & Hindi Translation */}
                      <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">
                        <div 
                          className="line-clamp-2 cursor-pointer hover:underline text-[13px]" 
                          onClick={() => handleOpenView(office)} 
                          title="Click to view details"
                        >
                          {office.title}
                        </div>
                        {office.title_hi && office.title_hi !== office.title && (
                          <div className="text-[11px] font-normal text-zinc-500 line-clamp-1 mt-0.5">
                            {office.title_hi}
                          </div>
                        )}
                        {office.is_system && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.2 bg-zinc-100 text-zinc-600 rounded-none border border-zinc-200">
                            System Default Portal
                          </span>
                        )}
                      </td>

                      {/* Department / Category */}
                      <td className="px-3 py-3 border-r border-[#e2e5e7]">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-semibold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* State / Location */}
                      <td className="px-3 py-3 border-r border-[#e2e5e7] text-zinc-700">
                        <div className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">{office.state_name || office.state_title || 'National / Union'}</span>
                        </div>
                      </td>

                      {/* Subsite Route */}
                      <td className="px-3 py-3 border-r border-[#e2e5e7]">
                        {office.url ? (
                          <a
                            href={office.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 hover:underline font-mono text-[11px] flex items-center gap-1 truncate max-w-[180px]"
                            title={office.url}
                          >
                            <ExternalLink className="w-3 h-3 shrink-0 text-blue-500" />
                            <span className="truncate">{office.url}</span>
                          </a>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-3 py-3 border-r border-[#e2e5e7]">
                        {office.email ? (
                          <a
                            href={`mailto:${office.email}`}
                            className="text-zinc-700 hover:text-[#751639] flex items-center gap-1 text-[11px] truncate max-w-[160px]"
                            title={office.email}
                          >
                            <Mail className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="truncate">{office.email}</span>
                          </a>
                        ) : (
                          <span className="text-zinc-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                        <button
                          onClick={() => handleToggleStatus(office)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            office.is_active 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${office.is_active ? 'bg-emerald-600' : 'bg-zinc-400'}`} />
                          <span>{office.is_active ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Action Links (Matching Reports Module actions layout) */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-3 text-xs">
                          <button
                            onClick={() => handleOpenView(office)}
                            className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer"
                            title="View Office Details"
                          >
                            View
                          </button>
                          <span className="text-zinc-300">|</span>
                          <button
                            onClick={() => handleOpenEdit(office)}
                            className="text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer"
                            title="Edit Office"
                          >
                            Edit
                          </button>
                          <span className="text-zinc-300">|</span>
                          <button
                            onClick={() => handleDelete(office.id)}
                            className="text-red-700 hover:text-red-900 font-bold hover:underline cursor-pointer"
                            title="Delete Office"
                          >
                            Delete
                          </button>
                          {office.url && (
                            <>
                              <span className="text-zinc-300">|</span>
                              <a
                                href={office.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#751639] hover:underline font-bold flex items-center gap-0.5"
                                title="Open Subsite Portal"
                              >
                                Subsite ↗
                              </a>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 3. PAGINATION (Exact Reports Module Layout) ── */}
        <div className="px-5 py-3.5 bg-white border-t border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3">
          <div className="text-zinc-500 text-xs">
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount.toLocaleString()} total registered offices)
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 7) {
                if (page > 4 && page < totalPages - 3) {
                  pageNum = page - 3 + idx;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + idx;
                }
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 border text-xs font-bold transition-colors cursor-pointer rounded-none ${
                    page === pageNum
                      ? 'bg-[#751639] text-white border-[#751639]'
                      : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* ── 4. VIEW DETAILS MODAL (Exact Reports Module Layout) ── */}
      {viewingOffice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-none shadow-2xl border border-zinc-300 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Office Profile Details
                </h3>
                <p className="text-[11px] text-white/80">Database Record ID: #{viewingOffice.id}</p>
              </div>
              <button
                onClick={() => setViewingOffice(null)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              <div className="bg-zinc-50 p-4 border border-zinc-200 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Office Title (English):</span>
                  <p className="text-base font-bold text-[#751639]">{viewingOffice.title}</p>
                </div>
                {viewingOffice.title_hi && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Office Title (हिन्दी):</span>
                    <p className="text-sm font-medium text-zinc-800">{viewingOffice.title_hi}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-3 border border-zinc-200 bg-white">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Department Category:</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-none font-semibold border ${getDeptBadgeStyle(viewingOffice.department_id, viewingOffice.department_name).bg}`}>
                    {viewingOffice.department_name || `Dept #${viewingOffice.department_id}`}
                  </span>
                </div>

                <div className="p-3 border border-zinc-200 bg-white">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">State / Territory:</span>
                  <div className="flex items-center gap-1 font-medium text-zinc-800">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{viewingOffice.state_name || viewingOffice.state_title || 'Union / National'}</span>
                  </div>
                </div>

                <div className="p-3 border border-zinc-200 bg-white">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Subsite Route / URL:</span>
                  {viewingOffice.url ? (
                    <a
                      href={viewingOffice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:underline font-mono text-[11px] flex items-center gap-1 break-all"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span>{viewingOffice.url}</span>
                    </a>
                  ) : (
                    <span className="text-zinc-400 italic">None</span>
                  )}
                </div>

                <div className="p-3 border border-zinc-200 bg-white">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Official Email Address:</span>
                  {viewingOffice.email ? (
                    <a
                      href={`mailto:${viewingOffice.email}`}
                      className="text-zinc-800 hover:text-[#751639] flex items-center gap-1.5 font-medium"
                    >
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{viewingOffice.email}</span>
                    </a>
                  ) : (
                    <span className="text-zinc-400 italic">None</span>
                  )}
                </div>

                <div className="p-3 border border-zinc-200 bg-white">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Publishing Status:</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    viewingOffice.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${viewingOffice.is_active ? 'bg-emerald-600' : 'bg-zinc-400'}`} />
                    {viewingOffice.is_active ? 'Active & Live' : 'Inactive / Draft'}
                  </span>
                </div>

                <div className="p-3 border border-zinc-200 bg-white">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Theme Configuration:</span>
                  <span className="font-mono text-zinc-700">{viewingOffice.theme || 'Default Theme'}</span>
                </div>

              </div>

              {(viewingOffice.created_at || viewingOffice.modified_at) && (
                <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-150 flex justify-between">
                  {viewingOffice.created_at && <span>Created: {new Date(viewingOffice.created_at).toLocaleString()}</span>}
                  {viewingOffice.modified_at && <span>Modified: {new Date(viewingOffice.modified_at).toLocaleString()}</span>}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  const target = viewingOffice;
                  setViewingOffice(null);
                  handleOpenEdit(target);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-none text-xs transition-colors cursor-pointer"
              >
                Edit Office Record
              </button>
              <button
                onClick={() => setViewingOffice(null)}
                className="px-4 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 rounded-none text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 5. ADD / EDIT MODAL (Exact Reports Module Layout) ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-none shadow-2xl border border-zinc-300 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  {editingRawId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingRawId ? `Edit Office / Subsite Record (#${editingRawId})` : 'Add New Office / Subsite Card'}
                </h3>
                <p className="text-[11px] text-white/80">
                  Target Database Table: <code className="bg-black/20 px-1 py-0.2 rounded-none font-mono">cag_revamp.websites</code>
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                
                {/* Title En */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Office / Subsite Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Principal Accountant General (Audit-I), Maharashtra"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 text-xs focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* Title Hi */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Office / Subsite Title (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={formTitleHi}
                    onChange={(e) => setFormTitleHi(e.target.value)}
                    placeholder="e.g. प्रधान महालेखाकार (लेखापरीक्षा-I), महाराष्ट्र"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 text-xs focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* Grid: Department & State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Department */}
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      Department Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formDeptId}
                      onChange={(e) => setFormDeptId(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 text-xs focus:outline-none focus:border-[#751639]"
                    >
                      <option value="0">-- Select Department --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={String(d.id)}>
                          {d.title} (ID: #{d.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State Select */}
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      Associated State / UT / Location
                    </label>
                    <select
                      value={formStateId}
                      onChange={(e) => setFormStateId(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 text-xs focus:outline-none focus:border-[#751639]"
                    >
                      <option value="0">-- National / Central / None --</option>
                      {states.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.name} (ID: #{s.id})
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* URL Route */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Subsite Route / Internal URL
                  </label>
                  <input
                    type="text"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="e.g. /ae/andhra-pradesh or /defence/new-delhi or /rti/chennai"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 font-mono text-zinc-900 text-xs focus:outline-none focus:border-[#751639]"
                  />
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Prefix with forward slash (e.g. <code className="bg-zinc-100 px-1">/ae/bihar</code>) or enter full external link.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. agauditmaharashtra@cag.gov.in"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 text-xs focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* Status & Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-150">
                  
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      Publishing Status:
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="w-4 h-4 text-[#751639] rounded-none focus:ring-[#751639]"
                      />
                      <span className="font-semibold text-zinc-800">
                        {formIsActive ? 'Active & Published on Portal' : 'Inactive / Hidden'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">
                      Theme Configuration:
                    </label>
                    <select
                      value={formTheme}
                      onChange={(e) => setFormTheme(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 text-xs focus:outline-none"
                    >
                      <option value="default">Default Theme</option>
                      <option value="classic">Classic Government Portal</option>
                      <option value="training">Training Institute Layout</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* Form Footer */}
              <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 rounded-none text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="text-white px-5 py-1.5 rounded-none text-xs font-bold shadow-xs transition-all hover:opacity-95 cursor-pointer disabled:opacity-50"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  {formSubmitting ? 'Saving...' : (editingRawId ? 'Update Office' : 'Save Office Record')}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ── 6. DELETE CONFIRMATION MODAL ── */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-none shadow-2xl border border-zinc-300 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-zinc-900">Delete Office Record?</h3>
              <p className="text-xs text-zinc-600">
                Are you sure you want to delete <strong className="text-zinc-900">"{deleteCandidate.title}"</strong> (ID: #{deleteCandidate.id}) from the database?
              </p>
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-none text-[11px] text-amber-800 text-left">
                ⚠️ This action cannot be undone. Associated public subsite links may become inaccessible.
              </div>
            </div>

            <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={deleting}
                className="px-4 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 rounded-none text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-none text-xs transition-colors cursor-pointer disabled:opacity-50"
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

export default function AdminOfficesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[400px] flex items-center justify-center text-xs text-zinc-500">
        <div className="w-5 h-5 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mr-2"></div>
        Loading Our Presence Admin Module...
      </div>
    }>
      <AdminPresenceContent />
    </Suspense>
  );
}
