'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import {
  Users,
  Shield,
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  Check,
  X,
  Globe,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  RefreshCw,
  Eye,
  AlertCircle,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

interface UserItem {
  id: string;
  username: string;
  name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email: string;
  mobile: string;
  role_id: number | null;
  role_name: string;
  wings_id: number | null;
  wing_title: string;
  designation?: string;
  posted_office?: string;
  gender?: string;
  is_active: boolean;
  status: number;
  created_at: string | null;
}

interface RoleItem {
  id: string;
  name: string;
  raw_name?: string;
  name_hi?: string;
  parent_id: number;
  parent_name: string;
  website_ids?: number[];
  is_active: boolean;
  status: number;
  is_system?: boolean;
  is_display?: boolean;
  created_at?: string | null;
}

interface WingItem {
  id: string;
  title: string;
  is_active: boolean;
  status: number;
  created?: string | null;
}

interface OptionItem {
  value: string;
  label: string;
}

function UserManagementContent() {
  const { isHindi, t, getText } = useAdminLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Submodule Tab ('users' | 'roles' | 'wings')
  const initialTab = searchParams.get('tab') || 'users';
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'wings'>(
    initialTab === 'roles' ? 'roles' : initialTab === 'wings' ? 'wings' : 'users'
  );

  // Synchronize state when URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'roles' || tabParam === 'wings' || tabParam === 'users') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Master lookup data (dynamic from DB)
  const [roleOptions, setRoleOptions] = useState<OptionItem[]>([]);
  const [wingOptions, setWingOptions] = useState<OptionItem[]>([]);
  const [websiteOptions, setWebsiteOptions] = useState<OptionItem[]>([]);

  // Users State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userWebsiteFilter, setUserWebsiteFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userWingFilter, setUserWingFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userTotalCount, setUserTotalCount] = useState(0);

  // Roles State
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [roleSearch, setRoleSearch] = useState('');
  const [roleWebsiteFilter, setRoleWebsiteFilter] = useState('all');
  const [roleStatusFilter, setRoleStatusFilter] = useState('all');

  // Wings State
  const [wings, setWings] = useState<WingItem[]>([]);
  const [wingsLoading, setWingsLoading] = useState(true);
  const [wingSearch, setWingSearch] = useState('');
  const [wingStatusFilter, setWingStatusFilter] = useState('all');

  // View Mode: 'list' | 'add_user' | 'edit_user' | 'add_role' | 'edit_role' | 'add_wing' | 'edit_wing'
  const [viewMode, setViewMode] = useState<string>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- User Form State ---
  const [userFormFirstName, setUserFormFirstName] = useState('');
  const [userFormMiddleName, setUserFormMiddleName] = useState('');
  const [userFormLastName, setUserFormLastName] = useState('');
  const [userFormMobile, setUserFormMobile] = useState('');
  const [userFormRoleId, setUserFormRoleId] = useState('');
  const [userFormWingsId, setUserFormWingsId] = useState('');
  const [userFormLoginId, setUserFormLoginId] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormIsActive, setUserFormIsActive] = useState(true);

  // --- Role Form State ---
  const [roleFormParentId, setRoleFormParentId] = useState('0');
  const [roleFormNameEn, setRoleFormNameEn] = useState('');
  const [roleFormNameHi, setRoleFormNameHi] = useState('');
  const [roleFormWebsites, setRoleFormWebsites] = useState<string[]>(['0']);
  const [roleFormWebsiteSearch, setRoleFormWebsiteSearch] = useState('');
  const [roleFormStatus, setRoleFormStatus] = useState('Active');

  // --- Wing Form State ---
  const [wingFormTitle, setWingFormTitle] = useState('');
  const [wingFormStatus, setWingFormStatus] = useState('Active');

  // Submission message / error
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. FETCH DYNAMIC MASTER OPTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchMasterOptions = async () => {
    try {
      // Roles options from DB
      const rRes = await fetch('/api/admin/options?type=roles');
      if (rRes.ok) {
        const rData = await rRes.json();
        setRoleOptions(Array.isArray(rData) ? rData : []);
      }

      // Wings options from DB
      const wRes = await fetch('/api/admin/options?type=wings');
      if (wRes.ok) {
        const wData = await wRes.json();
        setWingOptions(Array.isArray(wData) ? wData : []);
      }

      // Websites options from DB for role permissions
      const sRes = await fetch('/api/admin/options?type=websites');
      if (sRes.ok) {
        const sData = await sRes.json();
        setWebsiteOptions(Array.isArray(sData) ? sData : []);
      }
    } catch (err) {
      console.error('Error fetching master options:', err);
    }
  };

  useEffect(() => {
    fetchMasterOptions();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. FETCH USERS
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        table: 'users',
        page: userPage.toString(),
        limit: '20',
      });
      if (userSearch.trim()) params.append('search', userSearch.trim());
      if (userWebsiteFilter !== 'all') params.append('website_id', userWebsiteFilter);
      if (userRoleFilter !== 'all') params.append('role_id', userRoleFilter);
      if (userWingFilter !== 'all') params.append('wings_id', userWingFilter);
      if (userStatusFilter !== 'all') params.append('status', userStatusFilter);

      const res = await fetch(`/api/admin/crud?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
        setUserTotalPages(json.totalPages || 1);
        setUserTotalCount(json.total || (json.data ? json.data.length : 0));
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. FETCH ROLES
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const params = new URLSearchParams({
        table: 'roles',
        page: '1',
        limit: '200',
      });
      if (roleSearch.trim()) params.append('search', roleSearch.trim());
      if (roleWebsiteFilter !== 'all') params.append('website_id', roleWebsiteFilter);
      if (roleStatusFilter !== 'all') params.append('status', roleStatusFilter);

      const res = await fetch(`/api/admin/crud?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setRoles(json.data || []);
      }
    } catch (err) {
      console.error('Error loading roles:', err);
    } finally {
      setRolesLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. FETCH WINGS
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchWings = async () => {
    setWingsLoading(true);
    try {
      const params = new URLSearchParams({
        table: 'wings',
        page: '1',
        limit: '100',
      });
      if (wingSearch.trim()) params.append('search', wingSearch.trim());
      if (wingStatusFilter !== 'all') params.append('status', wingStatusFilter);

      const res = await fetch(`/api/admin/crud?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setWings(json.data || []);
      }
    } catch (err) {
      console.error('Error loading wings:', err);
    } finally {
      setWingsLoading(false);
    }
  };

  // Trigger loads based on active tab & filters
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'roles') {
      fetchRoles();
    } else if (activeTab === 'wings') {
      fetchWings();
    }
  }, [activeTab, userPage, userWebsiteFilter, userRoleFilter, userWingFilter, userStatusFilter, roleWebsiteFilter, roleStatusFilter, wingStatusFilter]);

  const switchTab = (tab: 'users' | 'roles' | 'wings') => {
    setActiveTab(tab);
    setViewMode('list');
    setEditingId(null);
    setFormMsg(null);
    router.replace(`/admin/users?tab=${tab}`, { scroll: false });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // USER FORM ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenAddUser = () => {
    setUserFormFirstName('');
    setUserFormMiddleName('');
    setUserFormLastName('');
    setUserFormMobile('');
    setUserFormRoleId(roleOptions.length > 0 ? roleOptions[0].value : '1');
    setUserFormLoginId('');
    setUserFormEmail('');
    setUserFormPassword('');
    setUserFormIsActive(true);
    setEditingId(null);
    setFormMsg(null);
    setViewMode('add_user');
  };

  const handleOpenEditUser = (u: UserItem) => {
    setUserFormFirstName(u.first_name || '');
    setUserFormMiddleName(u.middle_name || '');
    setUserFormLastName(u.last_name || '');
    setUserFormMobile(u.mobile || '');
    setUserFormRoleId(u.role_id ? u.role_id.toString() : '');
    setUserFormLoginId(u.username || '');
    setUserFormEmail(u.email || '');
    setUserFormPassword('');
    setUserFormIsActive(u.is_active);
    setEditingId(u.id);
    setFormMsg(null);
    setViewMode('edit_user');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!userFormLoginId.trim()) {
      setFormMsg({ type: 'error', text: 'Login ID / Username is required.' });
      return;
    }
    if (!userFormEmail.trim()) {
      setFormMsg({ type: 'error', text: 'Email Address is required.' });
      return;
    }
    if (viewMode === 'add_user' && !userFormPassword.trim()) {
      setFormMsg({ type: 'error', text: 'Password is required for new users.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        username: userFormLoginId.trim(),
        email: userFormEmail.trim(),
        first_name: userFormFirstName.trim(),
        middle_name: userFormMiddleName.trim(),
        last_name: userFormLastName.trim(),
        mobile: userFormMobile.trim(),
        role_id: userFormRoleId ? parseInt(userFormRoleId, 10) : 1,
        is_active: userFormIsActive,
      };

      if (userFormPassword.trim()) {
        payload.password = userFormPassword.trim();
      }

      const method = viewMode === 'edit_user' && editingId ? 'PUT' : 'POST';
      const url = viewMode === 'edit_user' && editingId 
        ? `/api/admin/crud?table=users&id=${editingId}` 
        : `/api/admin/crud?table=users`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.detail || 'Failed to save user.');
      }

      setFormMsg({ type: 'success', text: viewMode === 'edit_user' ? 'User profile updated successfully!' : 'User account created successfully!' });
      await fetchUsers();
      setTimeout(() => {
        setViewMode('list');
        setEditingId(null);
      }, 1000);
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'An error occurred while saving user.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/crud?table=users&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || 'Failed to delete user.');
        return;
      }
      fetchUsers();
    } catch (err) {
      alert('Error deleting user.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ROLE FORM ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenAddRole = () => {
    setRoleFormParentId('0');
    setRoleFormNameEn('');
    setRoleFormNameHi('');
    setRoleFormWebsites(['0']);
    setRoleFormWebsiteSearch('');
    setRoleFormStatus('Active');
    setEditingId(null);
    setFormMsg(null);
    setViewMode('add_role');
  };

  const handleOpenEditRole = (r: RoleItem) => {
    setRoleFormParentId(r.parent_id.toString());
    setRoleFormNameEn(r.name);
    setRoleFormNameHi(r.name_hi || '');
    setRoleFormWebsites(r.website_ids && r.website_ids.length > 0 ? r.website_ids.map(String) : ['0']);
    setRoleFormWebsiteSearch('');
    setRoleFormStatus(r.is_active ? 'Active' : 'Inactive');
    setEditingId(r.id);
    setFormMsg(null);
    setViewMode('edit_role');
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!roleFormNameEn.trim()) {
      setFormMsg({ type: 'error', text: 'Role name is required.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: roleFormNameEn.trim(),
        name_hi: roleFormNameHi.trim() || roleFormNameEn.trim(),
        parent_id: parseInt(roleFormParentId, 10) || 0,
        website_ids: roleFormWebsites.map(id => parseInt(id, 10)).filter(n => !isNaN(n)),
        is_active: roleFormStatus === 'Active',
      };

      const method = viewMode === 'edit_role' && editingId ? 'PUT' : 'POST';
      const url = viewMode === 'edit_role' && editingId 
        ? `/api/admin/crud?table=roles&id=${editingId}` 
        : `/api/admin/crud?table=roles`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.detail || 'Failed to save role.');
      }

      setFormMsg({ type: 'success', text: viewMode === 'edit_role' ? 'Role updated successfully!' : 'New role created and applied across the system!' });
      
      await fetchMasterOptions();
      await fetchRoles();

      setTimeout(() => {
        setViewMode('list');
        setEditingId(null);
      }, 1000);
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'An error occurred while saving role.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete role "${name}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/crud?table=roles&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || 'Failed to delete role.');
        return;
      }
      await fetchMasterOptions();
      fetchRoles();
    } catch (err) {
      alert('Error deleting role.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // WING FORM ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOpenAddWing = () => {
    setWingFormTitle('');
    setWingFormStatus('Active');
    setEditingId(null);
    setFormMsg(null);
    setViewMode('add_wing');
  };

  const handleOpenEditWing = (w: WingItem) => {
    setWingFormTitle(w.title);
    setWingFormStatus(w.is_active ? 'Active' : 'Inactive');
    setEditingId(w.id);
    setFormMsg(null);
    setViewMode('edit_wing');
  };

  const handleSaveWing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    if (!wingFormTitle.trim()) {
      setFormMsg({ type: 'error', text: 'Wing title is required.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: wingFormTitle.trim(),
        is_active: wingFormStatus === 'Active',
      };

      const method = viewMode === 'edit_wing' && editingId ? 'PUT' : 'POST';
      const url = viewMode === 'edit_wing' && editingId 
        ? `/api/admin/crud?table=wings&id=${editingId}` 
        : `/api/admin/crud?table=wings`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.detail || 'Failed to save wing.');
      }

      setFormMsg({ type: 'success', text: viewMode === 'edit_wing' ? 'Wing updated successfully!' : 'New wing created and applied across the system!' });
      
      await fetchMasterOptions();
      await fetchWings();

      setTimeout(() => {
        setViewMode('list');
        setEditingId(null);
      }, 1000);
    } catch (err: any) {
      setFormMsg({ type: 'error', text: err.message || 'An error occurred while saving wing.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWing = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete wing "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/crud?table=wings&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || 'Failed to delete wing.');
        return;
      }
      await fetchMasterOptions();
      fetchWings();
    } catch (err) {
      alert('Error deleting wing.');
    }
  };

  // Filter websites for multi-select
  const filteredWebsites = useMemo(() => {
    if (!roleFormWebsiteSearch.trim()) return websiteOptions;
    return websiteOptions.filter(w => 
      w.label.toLowerCase().includes(roleFormWebsiteSearch.toLowerCase())
    );
  }, [websiteOptions, roleFormWebsiteSearch]);

  const toggleWebsiteSelection = (val: string) => {
    if (val === '0') {
      if (roleFormWebsites.includes('0')) {
        setRoleFormWebsites([]);
      } else {
        setRoleFormWebsites(['0']);
      }
      return;
    }

    let next = roleFormWebsites.filter(id => id !== '0');
    if (next.includes(val)) {
      next = next.filter(id => id !== val);
    } else {
      next.push(val);
    }
    setRoleFormWebsites(next);
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    if (activeTab === 'users') {
      setUserSearch('');
      setUserWebsiteFilter('all');
      setUserRoleFilter('all');
      setUserWingFilter('all');
      setUserStatusFilter('all');
      setUserPage(1);
    } else if (activeTab === 'roles') {
      setRoleSearch('');
      setRoleWebsiteFilter('all');
      setRoleStatusFilter('all');
    } else if (activeTab === 'wings') {
      setWingSearch('');
      setWingStatusFilter('all');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: ADD / EDIT ROLE VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewMode === 'add_role' || viewMode === 'edit_role') {
    return (
      <div className="w-full space-y-6 max-w-5xl mx-auto pb-16 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="w-8 h-8 rounded-[8px] bg-white border border-[#EDE9E9] flex items-center justify-center text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '20px',
                color: '#751639'
              }}
            >
              {viewMode === 'edit_role' ? 'Edit Security Role' : 'Create New System Role'}
            </h1>
          </div>
        </div>

        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#751639]" />
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
                Role Configuration &amp; Subsite Scope
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveRole} className="p-6 space-y-5 text-[14px]">
            {formMsg && (
              <div className={`p-3 rounded-[8px] text-[13px] font-medium flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
              }`}>
                {formMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formMsg.text}</span>
              </div>
            )}

            {/* Superior Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">
                Superior Role <span className="text-red-500">*</span>
              </label>
              <select
                value={roleFormParentId}
                onChange={(e) => setRoleFormParentId(e.target.value)}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:border-[#751639] focus:bg-white outline-none transition-all"
              >
                <option value="0">Select superior role (Top Level / None)</option>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Name (EN) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">
                Role Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={roleFormNameEn}
                onChange={(e) => setRoleFormNameEn(e.target.value)}
                placeholder="e.g. Audit Officer / Subsite Admin"
                required
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Role Name (Hindi) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">
                Role Name in Hindi (हिंदी में)
              </label>
              <input
                type="text"
                value={roleFormNameHi}
                onChange={(e) => setRoleFormNameHi(e.target.value)}
                placeholder="रोल का नाम हिंदी में दर्ज करें"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Subsite Access & Permissions */}
            <div className="pt-3 border-t border-[#F5F3F4] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#62748E]">
                  Applicable Subsite &amp; Office Permissions
                </label>
                <input
                  type="text"
                  value={roleFormWebsiteSearch}
                  onChange={(e) => setRoleFormWebsiteSearch(e.target.value)}
                  placeholder="Filter subsites..."
                  className="bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[32px] px-3 text-[12px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] outline-none"
                />
              </div>

              <div className="w-full border border-[#EDE9E9] rounded-[8px] max-h-56 overflow-y-auto p-3 bg-[#F8F7F7] space-y-1.5 divide-y divide-[#EDE9E9]">
                {filteredWebsites.map((site) => {
                  const isChecked = roleFormWebsites.includes(site.value) || (site.value !== '0' && roleFormWebsites.includes('0'));
                  return (
                    <label
                      key={site.value}
                      className={`flex items-start gap-2.5 px-2 py-1.5 text-[13px] rounded-[6px] hover:bg-white cursor-pointer transition-colors ${
                        roleFormWebsites.includes(site.value) ? 'bg-[#FDF2F5] font-semibold text-[#751639]' : 'text-[#314158]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWebsiteSelection(site.value)}
                        className="mt-0.5 rounded text-[#751639] accent-[#751639]"
                      />
                      <span className="leading-snug">{site.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">
                Publish Status <span className="text-red-500">*</span>
              </label>
              <select
                value={roleFormStatus}
                onChange={(e) => setRoleFormStatus(e.target.value)}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:border-[#751639] focus:bg-white outline-none transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#F5F3F4]">
              <button
                type="submit"
                disabled={submitting}
                className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
                }}
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{submitting ? 'Saving Role...' : 'Save Role'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="h-[38.6px] px-6 rounded-[8px] border border-[#EDE9E9] text-[#62748E] hover:bg-[#F8F7F7] cursor-pointer font-medium text-[14px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: ADD / EDIT USER VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewMode === 'add_user' || viewMode === 'edit_user') {
    return (
      <div className="w-full space-y-6 max-w-5xl mx-auto pb-16 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="w-8 h-8 rounded-[8px] bg-white border border-[#EDE9E9] flex items-center justify-center text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '20px',
                color: '#751639'
              }}
            >
              {viewMode === 'edit_user' ? 'Edit User Profile' : 'Add New System User'}
            </h1>
          </div>
        </div>

        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4 text-[#751639]" />
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
                User Profile &amp; Login Credentials
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveUser} className="p-6 space-y-6 text-[14px]">
            {formMsg && (
              <div className={`p-3 rounded-[8px] text-[13px] font-medium flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
              }`}>
                {formMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formMsg.text}</span>
              </div>
            )}

            {/* SECTION 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-[14px] font-bold text-[#751639] pb-2 border-b border-[#F5F3F4]">
                1. Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userFormFirstName}
                    onChange={(e) => setUserFormFirstName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={userFormMiddleName}
                    onChange={(e) => setUserFormMiddleName(e.target.value)}
                    placeholder="e.g. Kumar"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userFormLastName}
                    onChange={(e) => setUserFormLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#90A1B9] absolute left-3.5 top-2.5" />
                    <input
                      type="tel"
                      value={userFormMobile}
                      onChange={(e) => setUserFormMobile(e.target.value)}
                      required
                      placeholder="9876543210"
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] pl-10 pr-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Role Assignment */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[14px] font-bold text-[#751639] pb-2 border-b border-[#F5F3F4]">
                2. Role &amp; Access Assignment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Assigned Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={userFormRoleId}
                    onChange={(e) => setUserFormRoleId(e.target.value)}
                    required
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:border-[#751639] focus:bg-white outline-none transition-all"
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Login Credentials */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[14px] font-bold text-[#751639] pb-2 border-b border-[#F5F3F4]">
                3. Login Credentials &amp; Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Login ID / Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#90A1B9] absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      value={userFormLoginId}
                      onChange={(e) => setUserFormLoginId(e.target.value)}
                      required
                      placeholder="e.g. ramesh.sharma"
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] pl-10 pr-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#90A1B9] absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      value={userFormEmail}
                      onChange={(e) => setUserFormEmail(e.target.value)}
                      required
                      placeholder="user@cag.gov.in"
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] pl-10 pr-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#62748E]">
                    Password {viewMode === 'add_user' && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#90A1B9] absolute left-3.5 top-2.5" />
                    <input
                      type="password"
                      value={userFormPassword}
                      onChange={(e) => setUserFormPassword(e.target.value)}
                      placeholder={viewMode === 'edit_user' ? 'Leave blank to keep unchanged' : 'Min 8 chars'}
                      required={viewMode === 'add_user'}
                      className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] pl-10 pr-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-[13px] text-[#0F172B]">
                  <input
                    type="checkbox"
                    checked={userFormIsActive}
                    onChange={(e) => setUserFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#751639] accent-[#751639]"
                  />
                  <span>Active User Account</span>
                </label>
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#F5F3F4]">
              <button
                type="submit"
                disabled={submitting}
                className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
                }}
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{submitting ? 'Saving User...' : 'Save User Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="h-[38.6px] px-6 rounded-[8px] border border-[#EDE9E9] text-[#62748E] hover:bg-[#F8F7F7] cursor-pointer font-medium text-[14px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: ADD / EDIT WING VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewMode === 'add_wing' || viewMode === 'edit_wing') {
    return (
      <div className="w-full space-y-6 max-w-4xl mx-auto pb-16 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="w-8 h-8 rounded-[8px] bg-white border border-[#EDE9E9] flex items-center justify-center text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '20px',
                color: '#751639'
              }}
            >
              {viewMode === 'edit_wing' ? 'Edit Audit Wing' : 'Add New CAG Audit Wing'}
            </h1>
          </div>
        </div>

        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-[#751639]" />
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
                Audit Wing Configuration
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveWing} className="p-6 space-y-5 text-[14px]">
            {formMsg && (
              <div className={`p-3 rounded-[8px] text-[13px] font-medium flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
              }`}>
                {formMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{formMsg.text}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">
                Wing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={wingFormTitle}
                onChange={(e) => setWingFormTitle(e.target.value)}
                placeholder="e.g. Information Systems Wing (IS Wing)"
                required
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:border-[#751639] focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={wingFormStatus}
                onChange={(e) => setWingFormStatus(e.target.value)}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:border-[#751639] focus:bg-white outline-none transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#F5F3F4]">
              <button
                type="submit"
                disabled={submitting}
                className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
                }}
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{submitting ? 'Saving Wing...' : 'Save Wing'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="h-[38.6px] px-6 rounded-[8px] border border-[#EDE9E9] text-[#62748E] hover:bg-[#F8F7F7] cursor-pointer font-medium text-[14px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: MAIN LIST VIEW WITH SUBMODULE FILTER TABS
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* ── TOP PAGE TITLE & SUBMODULE TABS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            {isHindi ? 'प्रशासन और अभिगम नियंत्रण' : 'Administration & Access Control'}
          </h1>
          <p className="text-[13px] text-[#62748E] mt-1">
            {isHindi 
              ? 'प्रशासनिक उपयोगकर्ता खाते, भूमिकाएं और उप-साइट अनुमतियां, और क्षेत्र लेखापरीक्षा विंग संरचना प्रबंधित करें।' 
              : 'Manage administrative user accounts, roles & subsite permissions, and field audit wing structures.'}
          </p>
        </div>

        {/* Submodule Badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchTab('users')}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'users'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-[#314158] border-[#EDE9E9] hover:bg-[#F8F7F7]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isHindi ? 'उपयोगकर्ता' : 'Users'}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#314158]'
            }`}>
              {userTotalCount || users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('roles')}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'roles'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-[#314158] border-[#EDE9E9] hover:bg-[#F8F7F7]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{isHindi ? 'भूमिकाएं (Roles)' : 'Roles'}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'roles' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#314158]'
            }`}>
              {roles.length || roleOptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('wings')}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'wings'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-[#314158] border-[#EDE9E9] hover:bg-[#F8F7F7]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isHindi ? 'प्रभाग (Wings)' : 'Wings'}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'wings' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#314158]'
            }`}>
              {wings.length || wingOptions.length}
            </span>
          </button>
        </div>
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
              <SlidersHorizontal className="w-4 h-4 text-[#751639]" />
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
          {/* TAB 1: USERS FILTERS */}
          {activeTab === 'users' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'उपयोगकर्ता खोजें' : 'Search Users'}</label>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  placeholder={isHindi ? 'उपयोगकर्ता नाम, नाम, ईमेल...' : 'Username, name, email...'}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'उप-साइट / कार्यालय' : 'Subsite / Office'}</label>
                <select
                  value={userWebsiteFilter}
                  onChange={(e) => { setUserWebsiteFilter(e.target.value); setUserPage(1); }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer truncate"
                >
                  <option value="all">{isHindi ? `सभी उप-साइटें (${websiteOptions.length})` : `All Subsites (${websiteOptions.length})`}</option>
                  {websiteOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'सौंपी गई भूमिका' : 'Assigned Role'}</label>
                <select
                  value={userRoleFilter}
                  onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer truncate"
                >
                  <option value="all">{isHindi ? `सभी भूमिकाएं (${roleOptions.length})` : `All Roles (${roleOptions.length})`}</option>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{t.status}</label>
                <select
                  value={userStatusFilter}
                  onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="all">{t.allStatus}</option>
                  <option value="1">{t.active}</option>
                  <option value="0">{t.inactive}</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: ROLES FILTERS */}
          {activeTab === 'roles' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'भूमिका खोजें' : 'Search Roles'}</label>
                <input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRoles()}
                  placeholder={isHindi ? 'भूमिका का नाम...' : 'Role name...'}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'उप-साइट दायरा' : 'Subsite Scope'}</label>
                <select
                  value={roleWebsiteFilter}
                  onChange={(e) => setRoleWebsiteFilter(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer truncate"
                >
                  <option value="all">{isHindi ? `सभी उप-साइटें (${websiteOptions.length})` : `All Subsites (${websiteOptions.length})`}</option>
                  {websiteOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{t.status}</label>
                <select
                  value={roleStatusFilter}
                  onChange={(e) => setRoleStatusFilter(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="all">{t.allStatus}</option>
                  <option value="1">{t.active}</option>
                  <option value="0">{t.inactive}</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: WINGS FILTERS */}
          {activeTab === 'wings' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'प्रभाग खोजें' : 'Search Wings'}</label>
                <input
                  type="text"
                  value={wingSearch}
                  onChange={(e) => setWingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWings()}
                  placeholder={isHindi ? 'प्रभाग का नाम...' : 'Wing title...'}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{t.status}</label>
                <select
                  value={wingStatusFilter}
                  onChange={(e) => setWingStatusFilter(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="all">{t.allStatus}</option>
                  <option value="1">{t.active}</option>
                  <option value="0">{t.inactive}</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-[#751639] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-all cursor-pointer"
            >
              {t.reset}
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'users') fetchUsers();
                else if (activeTab === 'roles') fetchRoles();
                else if (activeTab === 'wings') fetchWings();
              }}
              className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:opacity-95"
              style={{
                background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
              }}
            >
              <Search className="w-4 h-4" />
              <span>{t.search}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. CARD: DATA REGISTRY TABLE ── */}
      
      {/* TAB 1: USERS REGISTRY */}
      {activeTab === 'users' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#0F172B'
                }}
              >
                {isHindi ? `पंजीकृत व्यवस्थापक उपयोगकर्ता (${userTotalCount || users.length})` : `Registered Admin Users (${userTotalCount || users.length})`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenAddUser}
              className="h-[38.6px] px-5 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
              style={{
                background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? '+ नया उपयोगकर्ता जोड़ें' : '+ Add New User'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'लॉगिन आईडी' : 'Login ID'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'पूरा नाम' : 'Full Name'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'ईमेल' : 'Email'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'मोबाइल' : 'Mobile'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'भूमिका' : 'Role'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-center">{t.status}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-24 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {usersLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#751639]" />
                        <span>{t.loading}</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">
                      {t.noData}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-[14px] text-[#751639]">
                        {u.username}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-[14px] text-[#0F172B]">
                        {u.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#62748E]">{u.email || '—'}</td>
                      <td className="px-5 py-3.5 text-[13px] font-mono text-[#62748E]">{u.mobile || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-[6px] text-[12px] font-semibold bg-[#FDF2F5] text-[#751639] border border-[#F9D2DC]">
                          {u.role_name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5 ${
                          u.is_active 
                            ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' 
                            : 'bg-[#FDF4F0] text-[#EA580C] border border-[#FFEDD5]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-[#16A34A]' : 'bg-[#EA580C]'}`}></span>
                          {u.is_active ? t.active : t.inactive}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'उपयोगकर्ता प्रोफ़ाइल संपादित करें' : 'Edit User Profile'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="p-1.5 text-[#62748E] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'उपयोगकर्ता हटाएँ' : 'Delete User'}
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

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-[#EDE9E9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#62748E]">
            <span>
              {isHindi ? `पृष्ठ ${userPage} / ${userTotalPages} (${userTotalCount} पंजीकृत उपयोगकर्ता)` : `Showing Page ${userPage} of ${userTotalPages} (${userTotalCount} registered admin users)`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={userPage <= 1}
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 border border-[#EDE9E9] rounded-[8px] bg-white hover:bg-[#F8F7F7] disabled:opacity-40 cursor-pointer font-medium text-[13px]"
              >
                {t.previous}
              </button>
              <button
                type="button"
                disabled={userPage >= userTotalPages}
                onClick={() => setUserPage(p => p + 1)}
                className="px-3.5 py-1.5 border border-[#EDE9E9] rounded-[8px] bg-white hover:bg-[#F8F7F7] disabled:opacity-40 cursor-pointer font-medium text-[13px]"
              >
                {t.next}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES REGISTRY */}
      {activeTab === 'roles' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#0F172B'
                }}
              >
                {isHindi ? `सुरक्षा भूमिका पदानुक्रम (${roles.length})` : `Security Roles Hierarchy (${roles.length})`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenAddRole}
              className="h-[38.6px] px-5 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
              style={{
                background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? '+ नई भूमिका जोड़ें' : '+ Add New Role'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-16 text-center">{t.sNo}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'भूमिका का नाम' : 'Role Name'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'वरिष्ठ / मूल भूमिका' : 'Superior / Parent Role'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-center">{t.status}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-24 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {rolesLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#751639]" />
                        <span>{t.loading}</span>
                      </div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">
                      {t.noData}
                    </td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5 text-center text-[13px] font-bold text-[#751639]">#{r.id}</td>
                      <td className="px-5 py-3.5 font-bold text-[14px] text-[#0F172B]">
                        {isHindi && r.name_hi ? r.name_hi : r.name}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#62748E]">
                        {r.parent_name || (isHindi ? 'शीर्ष स्तर' : 'Top Level')}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5 ${
                          r.is_active 
                            ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' 
                            : 'bg-[#FDF4F0] text-[#EA580C] border border-[#FFEDD5]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.is_active ? 'bg-[#16A34A]' : 'bg-[#EA580C]'}`}></span>
                          {r.is_active ? t.active : t.inactive}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditRole(r)}
                            className="p-1.5 text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'संपादित करें' : 'Edit Role'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {!r.is_system && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r.id, r.name)}
                              className="p-1.5 text-[#62748E] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors cursor-pointer"
                              title={isHindi ? 'हटाएँ' : 'Delete Role'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WINGS REGISTRY */}
      {activeTab === 'wings' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#0F172B'
                }}
              >
                {isHindi ? `क्षेत्रीय लेखापरीक्षा प्रभाग (${wings.length})` : `Field Audit Wings (${wings.length})`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenAddWing}
              className="h-[38.6px] px-5 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
              style={{
                background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? '+ नया प्रभाग जोड़ें' : '+ Add New Wing'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-16 text-center">{t.sNo}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'प्रभाग का नाम' : 'Wing Title'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-center">{t.status}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-24 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {wingsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#751639]" />
                        <span>{t.loading}</span>
                      </div>
                    </td>
                  </tr>
                ) : wings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">
                      {t.noData}
                    </td>
                  </tr>
                ) : (
                  wings.map((w) => (
                    <tr key={w.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5 text-center text-[13px] font-bold text-[#751639]">#{w.id}</td>
                      <td className="px-5 py-3.5 font-bold text-[14px] text-[#0F172B]">{w.title}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5 ${
                          w.is_active 
                            ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' 
                            : 'bg-[#FDF4F0] text-[#EA580C] border border-[#FFEDD5]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${w.is_active ? 'bg-[#16A34A]' : 'bg-[#EA580C]'}`}></span>
                          {w.is_active ? t.active : t.inactive}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditWing(w)}
                            className="p-1.5 text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'संपादित करें' : 'Edit Wing'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWing(w.id, w.title)}
                            className="p-1.5 text-[#62748E] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'हटाएँ' : 'Delete Wing'}
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
        </div>
      )}

    </div>
  );
}

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[13px] text-[#90A1B9]">Loading User Management Hub...</div>}>
      <UserManagementContent />
    </Suspense>
  );
}
