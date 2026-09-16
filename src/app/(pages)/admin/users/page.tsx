'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminUserItem {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'auditor' | 'editor';
  designation?: string;
  department?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

const DEFAULT_ADMIN_USERS: AdminUserItem[] = [
  {
    id: 'u-1',
    username: 'superadmin',
    full_name: 'Super Administrator',
    email: 'admin@cag.gov.in',
    role: 'super_admin',
    designation: 'Principal Director (IS)',
    department: 'Information Systems Wing',
    is_active: true,
    last_login: '2026-09-10 12:45',
    created_at: '2025-01-15'
  },
  {
    id: 'u-2',
    username: 'audit_nodal',
    full_name: 'Rajesh Sharma',
    email: 'rajesh.sharma@cag.gov.in',
    role: 'admin',
    designation: 'Senior Audit Officer',
    department: 'Report Central Wing',
    is_active: true,
    last_login: '2026-09-09 16:30',
    created_at: '2025-03-10'
  },
  {
    id: 'u-3',
    username: 'state_accounts_admin',
    full_name: 'Priyanka Sen',
    email: 'priyanka.sen@cag.gov.in',
    role: 'editor',
    designation: 'Assistant Accounts Officer',
    department: 'State Accounts & Entitlement',
    is_active: true,
    last_login: '2026-09-08 10:15',
    created_at: '2025-04-02'
  },
  {
    id: 'u-4',
    username: 'global_auditor',
    full_name: 'Dr. Amitav Ghosh',
    email: 'amitav.ghosh@cag.gov.in',
    role: 'auditor',
    designation: 'Director (International Relations)',
    department: 'Global Relations & INTOSAI Wing',
    is_active: true,
    last_login: '2026-09-07 14:00',
    created_at: '2025-05-18'
  },
  {
    id: 'u-5',
    username: 'media_editor',
    full_name: 'Sunita Verma',
    email: 'sunita.verma@cag.gov.in',
    role: 'editor',
    designation: 'Public Relations Officer',
    department: 'Media & Communications',
    is_active: true,
    last_login: '2026-09-06 11:20',
    created_at: '2025-06-01'
  }
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'super_admin' | 'admin' | 'auditor' | 'editor'>('admin');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [isActive, setIsActive] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/crud?table=users&limit=50&search=${encodeURIComponent(searchTerm)}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          setUsers(json.data);
          setLoading(false);
          return;
        }
      }
      const stored = localStorage.getItem('cag_admin_users');
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        setUsers(DEFAULT_ADMIN_USERS);
      }
    } catch (e) {
      setUsers(DEFAULT_ADMIN_USERS);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const saveUsersToStorage = (updatedUsers: AdminUserItem[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('cag_admin_users', JSON.stringify(updatedUsers));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setUsername('');
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setDesignation('');
    setDepartment('Central Audit Wing');
    setIsActive(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (user: AdminUserItem) => {
    setEditingId(user.id);
    setUsername(user.username);
    setFullName(user.full_name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setDesignation(user.designation || '');
    setDepartment(user.department || '');
    setIsActive(user.is_active);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (id === 'u-1') {
      alert('Default Super Administrator account cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to remove user "${name}"?`)) return;
    const filtered = users.filter(u => u.id !== id);
    saveUsersToStorage(filtered);
  };

  const handleToggleStatus = (id: string) => {
    if (id === 'u-1') {
      alert('Default Super Administrator account status cannot be deactivated.');
      return;
    }
    const updated = users.map(u => (u.id === id ? { ...u, is_active: !u.is_active } : u));
    saveUsersToStorage(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !fullName.trim() || !email.trim()) {
      alert('Please fill in all required fields (Username, Full Name, Email).');
      return;
    }

    if (editingId) {
      const updated = users.map(u => {
        if (u.id === editingId) {
          return {
            ...u,
            username: username.trim(),
            full_name: fullName.trim(),
            email: email.trim(),
            role,
            designation: designation.trim(),
            department: department.trim(),
            is_active: isActive
          };
        }
        return u;
      });
      saveUsersToStorage(updated);
    } else {
      const newUser: AdminUserItem = {
        id: `u-${Date.now()}`,
        username: username.trim().toLowerCase().replace(/\s+/g, '_'),
        full_name: fullName.trim(),
        email: email.trim(),
        role,
        designation: designation.trim() || 'Officer',
        department: department.trim() || 'General Administration',
        is_active: isActive,
        created_at: new Date().toISOString().split('T')[0]
      };
      saveUsersToStorage([newUser, ...users]);
    }
    setIsDrawerOpen(false);
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      u.username.toLowerCase().includes(q) ||
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department || '').toLowerCase().includes(q);

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'active' && u.is_active) ||
      (statusFilter === 'inactive' && !u.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (r: string) => {
    switch (r) {
      case 'super_admin':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#751639]/10 text-[#751639] border border-[#751639]/20">Admin</span>;
      case 'auditor':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">Auditor</span>;
      case 'editor':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">Editor</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700">User</span>;
    }
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700 font-['Inter',sans-serif]">
      {/* Header Banner */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base">👥</span>
            <h2 className="text-base font-bold text-[#751639] uppercase tracking-wide">
              User Management &amp; Access Control
            </h2>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Super Administrator console for managing staff accounts, audit wing permissions, and publishing roles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-[#751639] hover:bg-[#5c102c] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>➕ Add New User</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#ced4da] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search User / Email / Dept:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, email or username..."
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Role Permission:</label>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="auditor">Auditor</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Account Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#ced4da] shadow-xs overflow-hidden">
        <div className="p-3 bg-[#fafbfc] border-b border-[#ced4da] flex justify-between items-center text-xs font-semibold text-zinc-700">
          <span>Registered System Users ({filteredUsers.length} accounts)</span>
          <span className="text-zinc-400 font-normal">Active Session: Super Admin</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f2f4f7] border-b border-[#ced4da] text-zinc-700 font-bold">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">User &amp; Full Name</th>
                <th className="py-2.5 px-3">Official Email</th>
                <th className="py-2.5 px-3">Department / Designation</th>
                <th className="py-2.5 px-3 text-center">Role</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Last Login</th>
                <th className="py-2.5 px-3 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400">
                    No users found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-2.5 px-3 text-center text-zinc-400">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-zinc-850">{u.full_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">@{u.username}</div>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-700 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-zinc-800">{u.department || 'General Administration'}</div>
                      <div className="text-[10px] text-zinc-400">{u.designation || 'Staff'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                          u.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                        }`}
                      >
                        {u.is_active ? '● Active' : '○ Inactive'}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-center text-[11px] text-zinc-500 font-mono">
                      {u.last_login || 'Never'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-none text-[11px] font-semibold transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        {u.id !== 'u-1' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.full_name)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-none text-[11px] font-semibold transition-colors"
                          >
                            🗑️ Delete
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

      {/* Add / Edit User Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-end z-50 animate-fadeIn">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-zinc-300">
            {/* Drawer Header */}
            <div className="p-4 bg-[#751639] text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm tracking-wide">
                {editingId ? 'Edit User Account' : 'Register New System User'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Username (Login Handle) *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingId && editingId === 'u-1'}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. j_doe or auditor_railway"
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] disabled:bg-zinc-100 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Full Official Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Shri Rajesh Kumar Sharma"
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. name@cag.gov.in"
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  {editingId ? 'Password (Leave blank to keep unchanged)' : 'Initial Password *'}
                </label>
                <input
                  type="password"
                  required={!editingId}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Role / Access Level *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639] text-xs"
                  >
                    <option value="super_admin">Super Administrator</option>
                    <option value="admin">Administrator</option>
                    <option value="auditor">Auditor / Reviewer</option>
                    <option value="editor">Content Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Account Status</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={e => setIsActive(e.target.value === 'true')}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639] text-xs"
                  >
                    <option value="true">Active</option>
                    <option value="false">Suspended / Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Audit Officer / Director"
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Department / Audit Wing</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Central Audit / State Accounts / INTOSAI"
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                />
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#751639] hover:bg-[#5c102c] text-white font-bold transition-colors cursor-pointer"
                >
                  {editingId ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
