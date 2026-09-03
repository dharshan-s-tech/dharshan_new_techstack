import AdminHeader from '@/components/admin/AdminHeader';
import Link from 'next/link';
import { Plus, Eye, Pencil, Search } from 'lucide-react';
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
  title: string; table: string; addHref: string; editBase: string; viewBase?: string;
  searchCol: string; cols: Col[]; page: number; search: string;
  extraQuery?: string; extraParams?: any[];
}

export async function GenListPage({
  title, table, addHref, editBase, viewBase, searchCol, cols, page, search, extraQuery, extraParams
}: GenListPageProps) {
  let rows: any[] = [];
  let total = 0;

  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}&searchCol=${searchCol}` : '';
    const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?table=${table}&page=${page}&limit=20${searchParam}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const json = await res.json();
    rows = Array.isArray(json.data) ? json.data : [];
    total = json.total || 0;
  } catch (e) {
    rows = [];
    total = 0;
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title={title} subtitle={`${total} total records`} />
      <main className="flex-1 p-6">
        <DeleteErrorAlert />
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
          <form className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input name="search" defaultValue={search} placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 w-56" />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#751639] hover:bg-[#5f0f2d] text-white text-sm rounded-lg transition-colors">Search</button>
            {search && <Link href={addHref.replace('/add', '')} className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Clear</Link>}
          </form>
          <Link href={addHref} className="flex items-center gap-2 px-4 py-2 bg-[#751639] hover:bg-[#5f0f2d] text-white text-sm rounded-lg font-medium whitespace-nowrap transition-colors">
            <Plus className="w-4 h-4" /> Add New
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-10">#</th>
                  {cols.map(c => <th key={c.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{c.label}</th>)}
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={cols.length + 2} className="text-center py-16 text-gray-400 text-sm">No records found</td></tr>
                ) : rows.map((row: any, idx: number) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * 20 + idx + 1}</td>
                    {cols.map(c => (
                      <td key={c.key} className="px-4 py-3 text-gray-700 text-sm">
                        {c.render ? c.render(row) : fmt(row[c.key], c.type)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {viewBase && <Link href={`${viewBase}/${row.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="View"><Eye className="w-4 h-4" /></Link>}
                        <Link href={`${editBase}/${row.id}/edit`} className="p-1.5 text-[#751639] hover:bg-[#751639]/5 rounded-lg" title="Edit"><Pencil className="w-4 h-4" /></Link>
                        <DeleteButton table={table} id={row.id} editBase={editBase} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
              <PaginationLinks page={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
