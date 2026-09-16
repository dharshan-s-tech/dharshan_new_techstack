import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, Eye, Pencil, Search, Filter, RotateCcw } from 'lucide-react';
import { DeleteErrorAlert, PaginationLinks, DeleteButton, FilePreviewAction } from './ListClientHelpers';

// ─── Shared rendering helpers ─────────────────────────────────────────────────

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
      ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function fmt(val: any, type?: string): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-gray-300">—</span>;
  if (type === 'boolean') return <StatusBadge active={!!val} />;
  if (type === 'date') return <span className="text-xs text-gray-500">{val ? new Date(val).toLocaleDateString('en-IN') : '—'}</span>;
  if (type === 'image') {
    return val ? (
      <div className="flex items-center gap-2">
        <img src={val} alt="" className="w-8 h-8 object-cover rounded shadow-sm border border-gray-100 flex-shrink-0" />
        <FilePreviewAction url={val} type="image" />
      </div>
    ) : <span className="text-gray-300">—</span>;
  }
  if (type === 'link' || type === 'file') {
    return val ? <FilePreviewAction url={val} type="file" /> : <span className="text-gray-300">—</span>;
  }
  return <span className="max-w-xs truncate block">{String(val)}</span>;
}

// ─── Generic list page component ──────────────────────────────────────────────
interface Col { key: string; label: string; type?: string; render?: (row: any) => React.ReactNode }
interface GenListPageProps {
  moduleKey?: string;
  title: string;
  table: string;
  addHref: string;
  editBase: string;
  viewBase?: string;
  searchCol: string;
  cols: Col[];
  page: number;
  search: string;
  lang?: string;
  status?: string;
  sort?: string;
  website_id?: string;
  role_id?: string;
  wings_id?: string;
  extraQuery?: string;
  extraParams?: any[];
}

const USER_MGMT_MODULES = [
  { key: 'users', label: 'Users Management', href: '/admin/users', icon: '👥' },
  { key: 'roles', label: 'Roles & RBAC', href: '/admin/roles', icon: '🛡️' },
  { key: 'wings', label: 'CAG Wings', href: '/admin/wings', icon: '🌿' },
  { key: 'roles-permissions', label: 'Role Permissions', href: '/admin/roles-permissions', icon: '🔐' },
  { key: 'user-offices', label: 'User Offices', href: '/admin/user-offices', icon: '🏢' },
  { key: 'modules', label: 'System Modules & ACL', href: '/admin/modules', icon: '🗂️' },
  { key: 'audit-trail', label: 'Audit Trail Logs', href: '/admin/audit-trail', icon: '📜' },
];

export async function GenListPage({
  moduleKey,
  title,
  table,
  addHref,
  editBase,
  viewBase,
  searchCol,
  cols,
  page,
  search,
  lang = 'all',
  status = 'all',
  sort = 'newest',
  website_id = 'all',
  role_id = 'all',
  wings_id = 'all',
  extraQuery,
  extraParams
}: GenListPageProps) {
  let rows: any[] = [];
  let total = 0;
  let subsiteOptions: { value: string; label: string }[] = [];
  let roleOptions: { value: string; label: string }[] = [];
  let wingOptions: { value: string; label: string }[] = [];

  // Fetch dynamic filter options from backend
  try {
    const [subsitesRes, rolesRes, wingsRes] = await Promise.allSettled([
      fetch('http://127.0.0.1:8000/api/admin/options?type=subsites', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/admin/options?type=roles', { cache: 'no-store' }),
      fetch('http://127.0.0.1:8000/api/admin/options?type=wings', { cache: 'no-store' }),
    ]);

    if (subsitesRes.status === 'fulfilled' && subsitesRes.value.ok) {
      subsiteOptions = await subsitesRes.value.json();
    }
    if (rolesRes.status === 'fulfilled' && rolesRes.value.ok) {
      roleOptions = await rolesRes.value.json();
    }
    if (wingsRes.status === 'fulfilled' && wingsRes.value.ok) {
      wingOptions = await wingsRes.value.json();
    }
  } catch (optErr) {
    // Keep fallback empty options
  }

  try {
    const params = new URLSearchParams();
    params.set('table', table);
    params.set('page', String(page));
    params.set('limit', '20');
    if (search) {
      params.set('search', search);
      params.set('searchCol', searchCol);
    }
    if (lang && lang !== 'all') params.set('language', lang);
    if (status && status !== 'all') params.set('status', status);
    if (sort) params.set('sort', sort);
    if (website_id && website_id !== 'all') params.set('website_id', website_id);
    if (role_id && role_id !== 'all') params.set('role_id', role_id);
    if (wings_id && wings_id !== 'all') params.set('wings_id', wings_id);

    const apiBase = process.env.API_INTERNAL_URL || 'http://127.0.0.1:8000';
    const res = await fetch(`${apiBase}/api/admin/crud?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const json = await res.json();
    rows = Array.isArray(json.data) ? json.data : [];
    total = json.total || rows.length || 0;
  } catch (e) {
    console.error('Error fetching admin data in GenListPage:', e);
    rows = [];
    total = 0;
  }

  const totalPages = Math.ceil(total / 20) || 1;
  const basePath = addHref.replace('/add', '');
  const isUserMgmtGroup = USER_MGMT_MODULES.some(m => m.key === moduleKey || m.key === table);

  const hasFilters =
    search ||
    (lang && lang !== 'all') ||
    (status && status !== 'all') ||
    (sort && sort !== 'newest') ||
    (website_id && website_id !== 'all') ||
    (role_id && role_id !== 'all') ||
    (wings_id && wings_id !== 'all');

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={title} subtitle={`${total.toLocaleString()} total records connected to database`} />
      <main className="flex-1 p-6 space-y-4">
        <DeleteErrorAlert />

        {/* ─── User Management Sub-Modules Tab Ribbon ─── */}
        {isUserMgmtGroup && (
          <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">User Management Sub-Modules</span>
              </div>
              <span className="text-[11px] bg-red-50 text-[#751639] px-2 py-0.5 rounded-full font-semibold border border-red-100">
                Multi-Tenant Scoped
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              {USER_MGMT_MODULES.map((m) => {
                const isActive = moduleKey === m.key || table === m.key;
                return (
                  <Link
                    key={m.key}
                    href={m.href}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                      ${isActive
                        ? 'bg-[#751639] text-white shadow-sm font-semibold'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                      }
                    `}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Advanced Filter Toolbar with Subsite, Role, and Wing Scoping ─── */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <form method="GET" className="flex flex-col gap-3">
            {/* Top Row: Search & Subsite Selector */}
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[300px]">
                {/* Search Box */}
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="search"
                    defaultValue={search}
                    placeholder={`Search ${title.toLowerCase()} by ${searchCol.replace('_', ' ')}...`}
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 w-full bg-gray-50/50 focus:bg-white transition-colors"
                  />
                </div>

                {/* Subsite / Website Filter Dropdown */}
                {subsiteOptions.length > 0 && (
                  <div className="min-w-[220px] max-w-[320px]">
                    <select
                      name="website_id"
                      defaultValue={website_id}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 bg-white text-gray-800 font-medium truncate"
                      title="Filter by Subsite / Website"
                    >
                      <option value="all">🌐 All Subsites / Websites ({subsiteOptions.length})</option>
                      {subsiteOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Role Filter (for Users and Role-Permissions) */}
                {roleOptions.length > 0 && (moduleKey === 'users' || moduleKey === 'roles-permissions' || table === 'users') && (
                  <div className="min-w-[160px]">
                    <select
                      name="role_id"
                      defaultValue={role_id}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 bg-white text-gray-800"
                      title="Filter by Role"
                    >
                      <option value="all">🛡️ All Roles</option>
                      {roleOptions.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Wing Filter (for Users) */}
                {wingOptions.length > 0 && (moduleKey === 'users' || table === 'users') && (
                  <div className="min-w-[150px]">
                    <select
                      name="wings_id"
                      defaultValue={wings_id}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 bg-white text-gray-800"
                      title="Filter by Wing"
                    >
                      <option value="all">🌿 All CAG Wings</option>
                      {wingOptions.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Filter */}
                <select
                  name="status"
                  defaultValue={status}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 bg-white text-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Status</option>
                  <option value="inactive">Inactive Status</option>
                </select>

                {/* Sort Order Filter */}
                <select
                  name="sort"
                  defaultValue={sort}
                  className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 bg-white text-gray-700"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="asc">Sort: A-Z</option>
                  <option value="desc">Sort: Z-A</option>
                </select>

                {/* Submit & Reset Buttons */}
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5" /> Apply Filter
                </button>

                {hasFilters && (
                  <Link
                    href={basePath}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </Link>
                )}
              </div>

              {/* Add New Action */}
              {table !== 'audit_trail_log' && (
                <Link
                  href={addHref}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs rounded-lg font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* ─── Data Table ─── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-12">#</th>
                  {cols.map(c => (
                    <th key={c.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      {c.label}
                    </th>
                  ))}
                  {table !== 'audit_trail_log' && (
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={cols.length + 2} className="text-center py-16 text-gray-400 text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-2xl">🔍</span>
                        <p className="font-medium text-gray-600">No records found</p>
                        <p className="text-xs text-gray-400">Try adjusting your subsite or search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row: any, idx: number) => (
                    <tr key={row.id || idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{(page - 1) * 20 + idx + 1}</td>
                      {cols.map(c => (
                        <td key={c.key} className="px-4 py-3 text-gray-700 text-sm">
                          {c.render ? c.render(row) : fmt(row[c.key], c.type)}
                        </td>
                      ))}
                      {table !== 'audit_trail_log' && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {viewBase && (
                              <Link
                                href={`${viewBase}/${row.id}`}
                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}
                            <Link
                              href={`${editBase}/${row.id}/edit`}
                              className="p-1.5 text-[#751639] hover:bg-[#751639]/5 rounded-lg transition-colors"
                              title="Edit Record"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <DeleteButton table={table} id={row.id} editBase={editBase} />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">{(page - 1) * 20 + 1}</span> to{' '}
                <span className="font-semibold text-gray-700">{Math.min(page * 20, total)}</span> of{' '}
                <span className="font-semibold text-gray-700">{total.toLocaleString()}</span> records (Page {page} of {totalPages})
              </p>
              <PaginationLinks page={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
