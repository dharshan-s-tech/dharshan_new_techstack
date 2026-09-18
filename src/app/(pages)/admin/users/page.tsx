'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  AlertCircle
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

      setFormMsg({ type: 'success', text: viewMode === 'edit_user' ? 'User updated successfully!' : 'User created successfully!' });
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

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: ADD / EDIT ROLE VIEW
  // ─────────────────────────────────────────────────────────────────────────────
  if (viewMode === 'add_role' || viewMode === 'edit_role') {
    return (
      <div className="w-full space-y-4 max-w-5xl mx-auto py-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Admin</span>
          <span>/</span>
          <button 
            type="button" 
            onClick={() => { setViewMode('list'); setFormMsg(null); }}
            className="text-[#751639] hover:underline font-medium"
          >
            User Management
          </button>
          <span>/</span>
          <span className="text-zinc-800 font-semibold">{viewMode === 'edit_role' ? 'Edit Role' : 'Add New Role'}</span>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-6">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ced4da]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#751639]" />
              <h2 className="text-base font-bold text-zinc-900">
                {viewMode === 'edit_role' ? 'Edit Role Details' : 'Create New System Role'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="px-3 py-1.5 border border-[#ced4da] bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Roles</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveRole} className="space-y-6 text-xs">
            {formMsg && (
              <div className={`p-3 rounded-none text-xs font-semibold flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formMsg.text}</span>
              </div>
            )}

            {/* Superior Role */}
            <div className="space-y-1.5">
              <label className="block text-zinc-700 font-bold">
                Superior Role <span className="text-red-600">*</span>
              </label>
              <select
                value={roleFormParentId}
                onChange={(e) => setRoleFormParentId(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
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
            <div className="space-y-1.5">
              <label className="block text-zinc-700 font-bold">
                Role Name (English) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={roleFormNameEn}
                onChange={(e) => setRoleFormNameEn(e.target.value)}
                placeholder="e.g. Audit Officer / Subsite Admin"
                required
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
              />
            </div>

            {/* Role Name (Hindi) */}
            <div className="space-y-1.5">
              <label className="block text-zinc-700 font-bold">
                Role Name in Hindi (हिंदी में)
              </label>
              <input
                type="text"
                value={roleFormNameHi}
                onChange={(e) => setRoleFormNameHi(e.target.value)}
                placeholder="रोल का नाम हिंदी में दर्ज करें"
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
              />
            </div>

            {/* Permissions Section Header */}
            <div className="pt-2 border-t border-zinc-200">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-[#751639]" />
                <h3 className="text-sm font-bold text-[#751639]">
                  Subsite Access &amp; Permissions
                </h3>
              </div>

              {/* Website Multi-Select Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-600">Select applicable subsites / offices:</span>
                  <input
                    type="text"
                    value={roleFormWebsiteSearch}
                    onChange={(e) => setRoleFormWebsiteSearch(e.target.value)}
                    placeholder="Filter websites..."
                    className="px-2.5 py-1 text-xs border border-zinc-300 rounded-none w-56 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div className="w-full border border-[#ced4da] rounded-none max-h-60 overflow-y-auto p-2.5 bg-zinc-50/50 space-y-1 divide-y divide-zinc-200">
                  {filteredWebsites.map((site) => {
                    const isChecked = roleFormWebsites.includes(site.value) || (site.value !== '0' && roleFormWebsites.includes('0'));
                    return (
                      <label
                        key={site.value}
                        className={`flex items-start gap-2.5 px-2 py-1.5 text-xs rounded-none hover:bg-white cursor-pointer transition-colors ${
                          roleFormWebsites.includes(site.value) ? 'bg-[#f7f0f3] font-semibold text-[#751639]' : 'text-zinc-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleWebsiteSelection(site.value)}
                          className="mt-0.5 rounded-none border-zinc-300 text-[#751639] focus:ring-[#751639]"
                        />
                        <span className="leading-snug">{site.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="block text-zinc-700 font-bold">
                Publish Status <span className="text-red-600">*</span>
              </label>
              <select
                value={roleFormStatus}
                onChange={(e) => setRoleFormStatus(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#ced4da]">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{submitting ? 'Saving Role...' : 'Save Role'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-[#ced4da] text-xs font-semibold rounded-none transition-colors cursor-pointer"
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
      <div className="w-full space-y-4 max-w-5xl mx-auto py-2">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Admin</span>
          <span>/</span>
          <button 
            type="button" 
            onClick={() => { setViewMode('list'); setFormMsg(null); }}
            className="text-[#751639] hover:underline font-medium"
          >
            User Management
          </button>
          <span>/</span>
          <span className="text-zinc-800 font-semibold">{viewMode === 'edit_user' ? 'Edit User Profile' : 'Add New User'}</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-6">
          {/* Card Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#ced4da]">
            <div className="flex items-center gap-2.5">
              <UserIcon className="w-5 h-5 text-[#751639]" />
              <h2 className="text-base font-bold text-zinc-900">
                {viewMode === 'edit_user' ? 'Edit User Profile' : 'Add New System User'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="px-3 py-1.5 border border-[#ced4da] bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Users</span>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveUser} className="space-y-6 text-xs">
            {formMsg && (
              <div className={`p-3 rounded-none text-xs font-semibold flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formMsg.text}</span>
              </div>
            )}

            {/* SECTION 1: Full Name */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#751639] pb-1 border-b border-zinc-200">
                1. Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    First Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={userFormFirstName}
                    onChange={(e) => setUserFormFirstName(e.target.value)}
                    required
                    placeholder="e.g. Ramesh"
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={userFormMiddleName}
                    onChange={(e) => setUserFormMiddleName(e.target.value)}
                    placeholder="e.g. Kumar"
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userFormLastName}
                    onChange={(e) => setUserFormLastName(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={userFormMobile}
                      onChange={(e) => setUserFormMobile(e.target.value)}
                      required
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border border-zinc-300 rounded-none pl-9 pr-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Role Assignment */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#751639] pb-1 border-b border-zinc-200">
                2. Role Assignment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Assigned Role <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={userFormRoleId}
                    onChange={(e) => setUserFormRoleId(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
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
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#751639] pb-1 border-b border-zinc-200">
                3. Login Credentials &amp; Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Login ID / Username <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={userFormLoginId}
                      onChange={(e) => setUserFormLoginId(e.target.value)}
                      required
                      placeholder="e.g. ramesh.sharma"
                      className="w-full bg-[#fdf8f9] border border-[#d8a8b8] rounded-none pl-9 pr-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Official Email <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={userFormEmail}
                      onChange={(e) => setUserFormEmail(e.target.value)}
                      required
                      placeholder="user@cag.gov.in"
                      className="w-full bg-white border border-zinc-300 rounded-none pl-9 pr-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">
                    Password {viewMode === 'add_user' && <span className="text-red-600">*</span>}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={userFormPassword}
                      onChange={(e) => setUserFormPassword(e.target.value)}
                      placeholder={viewMode === 'edit_user' ? 'Leave blank to keep unchanged' : 'Min 8 chars (1 upper, 1 num, 1 special)'}
                      required={viewMode === 'add_user'}
                      className="w-full bg-[#fdf8f9] border border-[#d8a8b8] rounded-none pl-9 pr-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>
              </div>

              {/* Status (Active) Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={userFormIsActive}
                    onChange={(e) => setUserFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded-none border-zinc-300 text-[#751639] focus:ring-[#751639]"
                  />
                  <span>Active User Account</span>
                </label>
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#ced4da]">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{submitting ? 'Saving User...' : 'Save User Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-[#ced4da] text-xs font-semibold rounded-none transition-colors cursor-pointer"
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
      <div className="w-full space-y-4 max-w-4xl mx-auto py-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Admin</span>
          <span>/</span>
          <button 
            type="button" 
            onClick={() => { setViewMode('list'); setFormMsg(null); }}
            className="text-[#751639] hover:underline font-medium"
          >
            User Management
          </button>
          <span>/</span>
          <span className="text-zinc-800 font-semibold">{viewMode === 'edit_wing' ? 'Edit CAG Wing' : 'Add New CAG Wing'}</span>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#ced4da]">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-[#751639]" />
              <h2 className="text-base font-bold text-zinc-900">
                {viewMode === 'edit_wing' ? 'Edit CAG Wing' : 'Add New CAG Wing'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="px-3 py-1.5 border border-[#ced4da] bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Wings</span>
            </button>
          </div>

          <form onSubmit={handleSaveWing} className="space-y-6 text-xs">
            {formMsg && (
              <div className={`p-3 rounded-none text-xs font-semibold flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formMsg.text}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-zinc-700 font-bold">
                Wing Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={wingFormTitle}
                onChange={(e) => setWingFormTitle(e.target.value)}
                placeholder="e.g. Information Systems Wing (IS Wing)"
                required
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-700 font-bold">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                value={wingFormStatus}
                onChange={(e) => setWingFormStatus(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#ced4da]">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{submitting ? 'Saving Wing...' : 'Save Wing'}</span>
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-[#ced4da] text-xs font-semibold rounded-none transition-colors cursor-pointer"
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
    <div className="space-y-4 text-xs text-zinc-700 font-sans">
      
      {/* 1. TOP SUBMODULE TABS & ACTION HEADER */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Tab Badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-none transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'users'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-zinc-700 border-[#ced4da] hover:bg-zinc-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
            }`}>
              {userTotalCount || users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('roles')}
            className={`px-4 py-2 text-xs font-bold rounded-none transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'roles'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-zinc-700 border-[#ced4da] hover:bg-zinc-50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Roles</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'roles' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
            }`}>
              {roles.length || roleOptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('wings')}
            className={`px-4 py-2 text-xs font-bold rounded-none transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'wings'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-zinc-700 border-[#ced4da] hover:bg-zinc-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Wings</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
              activeTab === 'wings' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
            }`}>
              {wings.length || wingOptions.length}
            </span>
          </button>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'users' && (
            <button
              type="button"
              onClick={handleOpenAddUser}
              className="px-4 py-2 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New User</span>
            </button>
          )}
          {activeTab === 'roles' && (
            <button
              type="button"
              onClick={handleOpenAddRole}
              className="px-4 py-2 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Role</span>
            </button>
          )}
          {activeTab === 'wings' && (
            <button
              type="button"
              onClick={handleOpenAddWing}
              className="px-4 py-2 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Wing</span>
            </button>
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 1: USERS LIST
          ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col space-y-4 p-4">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-zinc-700 font-bold mb-1">Search Users:</label>
              <div className="relative">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  placeholder="Search login ID, name, email..."
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
                />
              </div>
            </div>

            {/* Subsite / Website Filter */}
            <div>
              <label className="block text-zinc-700 font-bold mb-1">Subsite / Office:</label>
              <select
                value={userWebsiteFilter}
                onChange={(e) => { setUserWebsiteFilter(e.target.value); setUserPage(1); }}
                className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639] truncate"
              >
                <option value="all">All Subsites ({websiteOptions.length})</option>
                {websiteOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-zinc-700 font-bold mb-1">Assigned Role:</label>
              <select
                value={userRoleFilter}
                onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639] truncate"
              >
                <option value="all">All Roles ({roleOptions.length})</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter & Filter Button */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-zinc-700 font-bold mb-1">Status:</label>
                <select
                  value={userStatusFilter}
                  onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                >
                  <option value="all">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <button
                type="button"
                onClick={fetchUsers}
                className="px-3.5 py-1.5 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors cursor-pointer"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#ced4da]">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead className="bg-[#751639] text-white uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Login ID</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Full Name</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Email</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Mobile</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Role</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ced4da]">
                {usersLoading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-zinc-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#751639]" />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500 font-medium">
                      No users match your criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#fcf8fa] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-zinc-900 border-r border-zinc-200">
                        {u.username}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-zinc-800 border-r border-zinc-200">
                        {u.name || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-600 border-r border-zinc-200">{u.email || '—'}</td>
                      <td className="py-2.5 px-3 text-zinc-600 border-r border-zinc-200">{u.mobile || '—'}</td>
                      <td className="py-2.5 px-3 border-r border-zinc-200">
                        <span className="px-2 py-0.5 rounded-none text-[11px] font-semibold bg-[#f7f0f3] text-[#751639] border border-[#d8a8b8]">
                          {u.role_name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-zinc-200">
                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                          u.is_active 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                        }`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1 hover:bg-[#f7f0f3] text-[#751639] rounded-none transition-colors cursor-pointer"
                            title="Edit User Profile"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded-none transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
          <div className="pt-2 flex items-center justify-between text-xs text-zinc-600">
            <span>
              Showing Page <strong>{userPage}</strong> of <strong>{userTotalPages}</strong> ({userTotalCount} total users registered in DB)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={userPage <= 1}
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 border border-[#ced4da] rounded-none bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer font-semibold"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={userPage >= userTotalPages}
                onClick={() => setUserPage(p => p + 1)}
                className="px-3 py-1 border border-[#ced4da] rounded-none bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 2: ROLES LIST
          ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col space-y-4 p-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px] max-w-sm">
                <input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRoles()}
                  placeholder="Search role name..."
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
                />
              </div>

              {/* Subsite Filter */}
              <select
                value={roleWebsiteFilter}
                onChange={(e) => setRoleWebsiteFilter(e.target.value)}
                className="bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639] max-w-[240px] truncate"
              >
                <option value="all">All Subsites ({websiteOptions.length})</option>
                {websiteOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={roleStatusFilter}
                onChange={(e) => setRoleStatusFilter(e.target.value)}
                className="bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchRoles}
                className="px-3.5 py-1.5 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors cursor-pointer"
              >
                Filter
              </button>
            </div>

            <div className="text-xs text-zinc-500">
              Total Database Roles: <strong className="text-zinc-800">{roles.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#ced4da]">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead className="bg-[#751639] text-white uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-16 border-r border-[#8c234a]">ID</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Role Name</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Superior / Parent Role</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ced4da]">
                {rolesLoading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-zinc-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#751639]" />
                        <span>Loading roles...</span>
                      </div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 font-medium">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r.id} className="hover:bg-[#fcf8fa] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-zinc-500 border-r border-zinc-200">{r.id}</td>
                      <td className="py-2.5 px-3 font-bold text-zinc-900 border-r border-zinc-200">
                        {r.name}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-600 border-r border-zinc-200">
                        {r.parent_name || 'Top Level'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-zinc-200">
                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                          r.is_active 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                        }`}>
                          {r.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditRole(r)}
                            className="p-1 hover:bg-[#f7f0f3] text-[#751639] rounded-none transition-colors cursor-pointer"
                            title="Edit Role"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {!r.is_system && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r.id, r.name)}
                              className="p-1 hover:bg-red-50 text-red-600 rounded-none transition-colors cursor-pointer"
                              title="Delete Role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 3: WINGS LIST
          ═════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'wings' && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden flex flex-col space-y-4 p-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px] max-w-sm">
                <input
                  type="text"
                  value={wingSearch}
                  onChange={(e) => setWingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWings()}
                  placeholder="Search wing title..."
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={wingStatusFilter}
                onChange={(e) => setWingStatusFilter(e.target.value)}
                className="bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchWings}
                className="px-3.5 py-1.5 bg-[#751639] hover:bg-[#5a0e28] text-white text-xs font-bold rounded-none transition-colors cursor-pointer"
              >
                Filter
              </button>
            </div>

            <div className="text-xs text-zinc-500">
              Total Database Wings: <strong className="text-zinc-800">{wings.length}</strong>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-[#ced4da]">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead className="bg-[#751639] text-white uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-16 border-r border-[#8c234a]">ID</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Wing Title</th>
                  <th className="py-2.5 px-3 border-r border-[#8c234a]">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ced4da]">
                {wingsLoading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-zinc-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#751639]" />
                        <span>Loading wings...</span>
                      </div>
                    </td>
                  </tr>
                ) : wings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500 font-medium">
                      No wings found.
                    </td>
                  </tr>
                ) : (
                  wings.map((w) => (
                    <tr key={w.id} className="hover:bg-[#fcf8fa] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-zinc-500 border-r border-zinc-200">{w.id}</td>
                      <td className="py-2.5 px-3 font-bold text-zinc-900 border-r border-zinc-200">{w.title}</td>
                      <td className="py-2.5 px-3 border-r border-zinc-200">
                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                          w.is_active 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                        }`}>
                          {w.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditWing(w)}
                            className="p-1 hover:bg-[#f7f0f3] text-[#751639] rounded-none transition-colors cursor-pointer"
                            title="Edit Wing"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWing(w.id, w.title)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded-none transition-colors cursor-pointer"
                            title="Delete Wing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500 font-medium">Loading User Management Hub...</div>}>
      <UserManagementContent />
    </Suspense>
  );
}
