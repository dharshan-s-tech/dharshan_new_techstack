'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

  // ──────────────────────────────────────────
  // 1. FETCH DYNAMIC MASTER OPTIONS
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // 2. FETCH USERS
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // 3. FETCH ROLES
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // 4. FETCH WINGS
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // USER FORM ACTIONS
  // ──────────────────────────────────────────
  const handleOpenAddUser = () => {
    setUserFormFirstName('');
    setUserFormMiddleName('');
    setUserFormLastName('');
    setUserFormMobile('');
    setUserFormRoleId(roleOptions.length > 0 ? roleOptions[0].value : '1');
    setUserFormWingsId(wingOptions.length > 0 ? wingOptions[0].value : '1');
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
    setUserFormWingsId(u.wings_id ? u.wings_id.toString() : '');
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
        wings_id: userFormWingsId ? parseInt(userFormWingsId, 10) : 1,
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

  // ──────────────────────────────────────────
  // ROLE FORM ACTIONS
  // ──────────────────────────────────────────
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
      
      // Refresh options dynamically across the app
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

  // ──────────────────────────────────────────
  // WING FORM ACTIONS
  // ──────────────────────────────────────────
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

  // ──────────────────────────────────────────
  // RENDER: ADD / EDIT ROLE VIEW (Screenshot 2 Match)
  // ──────────────────────────────────────────
  if (viewMode === 'add_role' || viewMode === 'edit_role') {
    return (
      <div className="w-full bg-[#f4f6f9] p-4 md:p-6 flex flex-col gap-4 max-w-7xl mx-auto min-h-screen">
        <div className="bg-white rounded-[6px] shadow-xs border border-zinc-200 overflow-hidden">
          {/* Card Header matching Screenshot 2 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
            <h2 className="text-[17px] font-semibold text-zinc-900">
              {viewMode === 'edit_role' ? 'Edit Role' : 'Add New Role'}
            </h2>
            <button
              type="button"
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
              title="Back"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveRole} className="p-6 space-y-6">
            {formMsg && (
              <div className={`p-3 rounded-md text-sm font-medium ${
                formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {formMsg.text}
              </div>
            )}

            {/* Superior Role */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">
                Superior Role <span className="text-red-500">*</span>
              </label>
              <select
                value={roleFormParentId}
                onChange={(e) => setRoleFormParentId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-zinc-800">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={roleFormNameEn}
                onChange={(e) => setRoleFormNameEn(e.target.value)}
                placeholder="Enter role name in English"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Role Name In (हिन्दी) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">
                Name In (हिन्दी)
              </label>
              <input
                type="text"
                value={roleFormNameHi}
                onChange={(e) => setRoleFormNameHi(e.target.value)}
                placeholder="रोल का नाम हिन्दी में"
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Permissions Section Header in Orange */}
            <div className="pt-2">
              <h3 className="text-[17px] font-semibold text-[#f37021]">
                Permissions
              </h3>
            </div>

            {/* Website Multi-Select Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-zinc-800">
                  Website
                </label>
                <input
                  type="text"
                  value={roleFormWebsiteSearch}
                  onChange={(e) => setRoleFormWebsiteSearch(e.target.value)}
                  placeholder="Filter websites..."
                  className="px-2.5 py-1 text-xs border border-zinc-300 rounded-[4px] w-48 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* Scrollable list matching Screenshot 2 */}
              <div className="w-full border border-zinc-300 rounded-[4px] max-h-60 overflow-y-auto p-2 bg-white space-y-1 divide-y divide-zinc-100">
                {filteredWebsites.map((site) => {
                  const isChecked = roleFormWebsites.includes(site.value) || (site.value !== '0' && roleFormWebsites.includes('0'));
                  return (
                    <label
                      key={site.value}
                      className={`flex items-start gap-2.5 px-2 py-1.5 text-sm rounded-[3px] hover:bg-zinc-50 cursor-pointer transition-colors ${
                        roleFormWebsites.includes(site.value) ? 'bg-blue-50/70 font-medium text-blue-900' : 'text-zinc-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWebsiteSelection(site.value)}
                        className="mt-0.5 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="leading-snug">{site.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Status (Active) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">
                Status (Active) <span className="text-red-500">*</span>
              </label>
              <select
                value={roleFormStatus}
                onChange={(e) => setRoleFormStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 text-sm font-medium rounded-[4px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // RENDER: ADD / EDIT USER VIEW (Screenshot 3 Match)
  // ──────────────────────────────────────────
  if (viewMode === 'add_user' || viewMode === 'edit_user') {
    return (
      <div className="w-full bg-[#f4f6f9] p-4 md:p-6 flex flex-col gap-4 max-w-7xl mx-auto min-h-screen">
        {/* Breadcrumb Header matching Screenshot 3 */}
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <div className="flex items-center gap-1.5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-zinc-600">Home</span>
            <span>&gt;</span>
            <span className="text-zinc-600">Users</span>
            <span>&gt;</span>
            <span className="font-semibold text-zinc-800">
              {viewMode === 'edit_user' ? 'Edit User' : 'Add New User'}
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[6px] shadow-xs border border-zinc-200 overflow-hidden">
          {/* Card Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
            <h2 className="text-[17px] font-semibold text-zinc-900">
              {viewMode === 'edit_user' ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              type="button"
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="px-4 py-1.5 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveUser} className="p-6 space-y-7">
            {formMsg && (
              <div className={`p-3 rounded-md text-sm font-medium ${
                formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {formMsg.text}
              </div>
            )}

            {/* SECTION 1: Name of User in Orange */}
            <div className="space-y-4">
              <h3 className="text-[17px] font-semibold text-[#f37021]">
                Name of User
              </h3>

              {/* 3 Columns: First Name, Middle Name, Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userFormFirstName}
                    onChange={(e) => setUserFormFirstName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={userFormMiddleName}
                    onChange={(e) => setUserFormMiddleName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userFormLastName}
                    onChange={(e) => setUserFormLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={userFormMobile}
                    onChange={(e) => setUserFormMobile(e.target.value)}
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Login Detail in Orange */}
            <div className="space-y-4 pt-2">
              <h3 className="text-[17px] font-semibold text-[#f37021]">
                Login Detail
              </h3>

              {/* Role Dropdown (Dynamically loaded from DB) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-800">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={userFormRoleId}
                  onChange={(e) => setUserFormRoleId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CAG Wing Dropdown (Dynamically loaded from DB) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-800">
                  CAG Wing
                </label>
                <select
                  value={userFormWingsId}
                  onChange={(e) => setUserFormWingsId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Wing</option>
                  {wingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3 Columns: Login ID, Email, Password */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    Login ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userFormLoginId}
                    onChange={(e) => setUserFormLoginId(e.target.value)}
                    required
                    placeholder="e.g. tyokesh"
                    className="w-full px-3.5 py-2.5 bg-[#f0f5ff] border border-blue-200 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={userFormEmail}
                    onChange={(e) => setUserFormEmail(e.target.value)}
                    required
                    placeholder="user@cag.gov.in"
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-zinc-800">
                    Password {viewMode === 'add_user' && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={userFormPassword}
                    onChange={(e) => setUserFormPassword(e.target.value)}
                    placeholder={viewMode === 'edit_user' ? 'Leave blank to keep unchanged' : 'Min 8 chars: 1 upper, 1 lower, 1 num, 1 special'}
                    required={viewMode === 'add_user'}
                    className="w-full px-3.5 py-2.5 bg-[#f0f5ff] border border-blue-200 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status (Active) Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-800">
                  <input
                    type="checkbox"
                    checked={userFormIsActive}
                    onChange={(e) => setUserFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Status (Active)</span>
                </label>
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 text-sm font-medium rounded-[4px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // RENDER: ADD / EDIT WING VIEW
  // ──────────────────────────────────────────
  if (viewMode === 'add_wing' || viewMode === 'edit_wing') {
    return (
      <div className="w-full bg-[#f4f6f9] p-4 md:p-6 flex flex-col gap-4 max-w-7xl mx-auto min-h-screen">
        <div className="bg-white rounded-[6px] shadow-xs border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
            <h2 className="text-[17px] font-semibold text-zinc-900">
              {viewMode === 'edit_wing' ? 'Edit CAG Wing' : 'Add New CAG Wing'}
            </h2>
            <button
              type="button"
              onClick={() => { setViewMode('list'); setFormMsg(null); }}
              className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSaveWing} className="p-6 space-y-6">
            {formMsg && (
              <div className={`p-3 rounded-md text-sm font-medium ${
                formMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {formMsg.text}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">
                Wing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={wingFormTitle}
                onChange={(e) => setWingFormTitle(e.target.value)}
                placeholder="e.g. Information Systems Wing (IS Wing)"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">
                Status (Active) <span className="text-red-500">*</span>
              </label>
              <select
                value={wingFormStatus}
                onChange={(e) => setWingFormStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-[4px] text-sm text-zinc-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('list'); setFormMsg(null); }}
                className="px-5 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 text-sm font-medium rounded-[4px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // RENDER: MAIN LIST VIEW WITH SUBMODULE FILTER TABS
  // ──────────────────────────────────────────
  return (
    <div className="w-full bg-[#f4f6f9] p-4 md:p-6 flex flex-col gap-5 max-w-7xl mx-auto min-h-screen">
      
      {/* Top Header & Submodule Tabs Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-[6px] border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-2">
          {/* Submodule Filter Tabs */}
          <button
            type="button"
            onClick={() => switchTab('users')}
            className={`px-4 py-2 text-sm font-semibold rounded-[6px] transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#751639] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <span>Users</span>
            <span className={`text-[11px] px-2 py-0.2 rounded-full ${
              activeTab === 'users' ? 'bg-white/25 text-white' : 'bg-zinc-300 text-zinc-800'
            }`}>
              {userTotalCount || users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('roles')}
            className={`px-4 py-2 text-sm font-semibold rounded-[6px] transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-[#751639] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <span>Roles</span>
            <span className={`text-[11px] px-2 py-0.2 rounded-full ${
              activeTab === 'roles' ? 'bg-white/25 text-white' : 'bg-zinc-300 text-zinc-800'
            }`}>
              {roles.length || roleOptions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('wings')}
            className={`px-4 py-2 text-sm font-semibold rounded-[6px] transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'wings'
                ? 'bg-[#751639] text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            <span>Wings</span>
            <span className={`text-[11px] px-2 py-0.2 rounded-full ${
              activeTab === 'wings' ? 'bg-white/25 text-white' : 'bg-zinc-300 text-zinc-800'
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
              className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium rounded-[4px] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add New User</span>
            </button>
          )}
          {activeTab === 'roles' && (
            <button
              type="button"
              onClick={handleOpenAddRole}
              className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium rounded-[4px] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add New Role</span>
            </button>
          )}
          {activeTab === 'wings' && (
            <button
              type="button"
              onClick={handleOpenAddWing}
              className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-medium rounded-[4px] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add New Wing</span>
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TAB 1: USERS LIST
          ══════════════════════════════════════════ */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-[6px] border border-zinc-200 shadow-xs overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  placeholder="Search username, name, email..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-2 text-zinc-400">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>

              {/* Subsite / Website Filter */}
              <select
                value={userWebsiteFilter}
                onChange={(e) => { setUserWebsiteFilter(e.target.value); setUserPage(1); }}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500 max-w-[220px] truncate"
                title="Filter by Subsite / Website"
              >
                <option value="all">🌐 All Subsites ({websiteOptions.length})</option>
                {websiteOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Dynamic Role Filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500 max-w-[180px] truncate"
              >
                <option value="all">🛡️ All Roles ({roleOptions.length})</option>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>

              {/* Dynamic Wing Filter */}
              <select
                value={userWingFilter}
                onChange={(e) => { setUserWingFilter(e.target.value); setUserPage(1); }}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500 max-w-[150px] truncate"
              >
                <option value="all">🌿 All Wings ({wingOptions.length})</option>
                {wingOptions.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={userStatusFilter}
                onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchUsers}
                className="px-3 py-1.5 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead className="bg-[#751639] text-white uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Login ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">CAG Wing</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {usersLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-500">
                      Loading users from database...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-zinc-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                        {u.username}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-800">
                        {u.name || '—'}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">{u.email || '—'}</td>
                      <td className="py-3 px-4 text-zinc-600">{u.mobile || '—'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          {u.role_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-600">{u.wing_title || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          u.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-[3px] transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded-[3px] transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
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
          <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-600">
            <span>
              Showing Page {userPage} of {userTotalPages} ({userTotalCount} total users)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={userPage <= 1}
                onClick={() => setUserPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-[3px] bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={userPage >= userTotalPages}
                onClick={() => setUserPage(p => p + 1)}
                className="px-2.5 py-1 border border-zinc-300 rounded-[3px] bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TAB 2: ROLES LIST
          ══════════════════════════════════════════ */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-[6px] border border-zinc-200 shadow-xs overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRoles()}
                  placeholder="Search role name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-2 text-zinc-400">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>

              {/* Subsite Filter */}
              <select
                value={roleWebsiteFilter}
                onChange={(e) => setRoleWebsiteFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500 max-w-[220px] truncate"
                title="Filter Roles by Subsite"
              >
                <option value="all">🌐 All Subsites ({websiteOptions.length})</option>
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
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchRoles}
                className="px-3 py-1.5 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
              >
                Filter
              </button>
            </div>

            <div className="text-xs text-zinc-500">
              Total Database Roles: <span className="font-semibold text-zinc-800">{roles.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead className="bg-[#751639] text-white uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-16">ID</th>
                  <th className="py-3 px-4">Role Name</th>
                  <th className="py-3 px-4">Superior Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {rolesLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      Loading roles from database...
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-zinc-500">{r.id}</td>
                      <td className="py-3 px-4 font-medium text-zinc-900">
                        {r.name}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {r.parent_name || 'Top Level'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          r.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}>
                          {r.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditRole(r)}
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-[3px] transition-colors cursor-pointer"
                            title="Edit Role"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          {!r.is_system && (
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(r.id, r.name)}
                              className="p-1 hover:bg-red-50 text-red-600 rounded-[3px] transition-colors cursor-pointer"
                              title="Delete Role"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
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

      {/* ══════════════════════════════════════════
          TAB 3: WINGS LIST
          ══════════════════════════════════════════ */}
      {activeTab === 'wings' && (
        <div className="bg-white rounded-[6px] border border-zinc-200 shadow-xs overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <input
                  type="text"
                  value={wingSearch}
                  onChange={(e) => setWingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchWings()}
                  placeholder="Search wing title..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500"
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-2.5 top-2 text-zinc-400">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>

              {/* Status Filter */}
              <select
                value={wingStatusFilter}
                onChange={(e) => setWingStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-[4px] text-xs text-zinc-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>

              <button
                type="button"
                onClick={fetchWings}
                className="px-3 py-1.5 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-medium rounded-[4px] transition-colors cursor-pointer"
              >
                Filter
              </button>
            </div>

            <div className="text-xs text-zinc-500">
              Total Database Wings: <span className="font-semibold text-zinc-800">{wings.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead className="bg-[#751639] text-white uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-16">ID</th>
                  <th className="py-3 px-4">Wing Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {wingsLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500">
                      Loading wings from database...
                    </td>
                  </tr>
                ) : wings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-zinc-500">
                      No wings found.
                    </td>
                  </tr>
                ) : (
                  wings.map((w) => (
                    <tr key={w.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-zinc-500">{w.id}</td>
                      <td className="py-3 px-4 font-medium text-zinc-900">{w.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          w.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}>
                          {w.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditWing(w)}
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-[3px] transition-colors cursor-pointer"
                            title="Edit Wing"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteWing(w.id, w.title)}
                            className="p-1 hover:bg-red-50 text-red-600 rounded-[3px] transition-colors cursor-pointer"
                            title="Delete Wing"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
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
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading User Management...</div>}>
      <UserManagementContent />
    </Suspense>
  );
}
