import Link from 'next/link';
import {
  Plus, Eye, SquarePen, Search, Filter, RotateCcw, Download, FileText, Upload
} from 'lucide-react';
import { DeleteErrorAlert, PaginationLinks, DeleteButton, FilePreviewAction } from './ListClientHelpers';

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        active
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function LangBadge({ value }: { value: unknown }) {
  const raw = String(value || 'EN').toUpperCase();
  const code = raw.includes('HI') || raw.includes('हिं') ? 'HI' : 'EN';
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-sky-50 text-sky-700 border border-sky-200">
      {code}
    </span>
  );
}

function fmt(val: any, type?: string): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-zinc-300">—</span>;
  if (type === 'boolean') return <StatusBadge active={!!val} />;
  if (type === 'language') return <LangBadge value={val} />;
  if (type === 'date') {
    const d = val ? new Date(val) : null;
    if (!d || Number.isNaN(d.getTime())) return <span className="text-zinc-300">—</span>;
    return (
      <span className="text-[12px] text-zinc-500 whitespace-nowrap">
        {d.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </span>
    );
  }
  if (type === 'image') {
    return val ? (
      <div className="flex items-center gap-2">
        <img src={val} alt="" className="w-8 h-8 object-cover rounded border border-zinc-100" />
        <FilePreviewAction url={val} type="image" />
      </div>
    ) : <span className="text-zinc-300">—</span>;
  }
  if (type === 'link' || type === 'file') {
    if (!val) return <span className="text-zinc-300">—</span>;
    const name = String(val).split('/').pop() || 'file';
    return (
      <a
        href={val}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[#751639] hover:underline max-w-[180px]"
        title={name}
      >
        <FileText className="w-4 h-4 shrink-0 text-rose-600" />
        <span className="truncate text-[12px] font-medium">{name}</span>
      </a>
    );
  }
  return <span className="max-w-xs truncate block text-zinc-700">{String(val)}</span>;
}

interface Col { key: string; label: string; type?: string; render?: (row: any) => React.ReactNode }
interface GenListPageProps {
  title: string; table: string; addHref: string; editBase: string; viewBase?: string;
  searchCol: string; cols: Col[]; page: number; search: string;
  lang?: string; status?: string; sort?: string;
  extraQuery?: string; extraParams?: any[];
}

export async function GenListPage({
  title, table, addHref, editBase, viewBase, searchCol, cols, page, search, lang = 'all', status = 'all', sort = 'newest', extraQuery, extraParams
}: GenListPageProps) {
  let rows: any[] = [];
  let total = 0;
  const pageSize = 10;

  try {
    const params = new URLSearchParams();
    params.set('table', table);
    params.set('page', String(page));
    params.set('limit', String(pageSize));
    if (search) {
      params.set('search', search);
      params.set('searchCol', searchCol);
    }
    if (lang && lang !== 'all') params.set('language', lang);
    if (status && status !== 'all') params.set('status', status);
    if (sort) params.set('sort', sort);

    const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?${params.toString()}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    const json = await res.json();
    rows = Array.isArray(json.data) ? json.data : [];
    total = json.total || rows.length || 0;
  } catch {
    rows = [];
    total = 0;
  }

  if (lang && lang !== 'all') {
    rows = rows.filter(r => !r.language || r.language === lang);
  }
  if (status && status !== 'all') {
    const isAct = status === 'active';
    rows = rows.filter(r => r.is_active === undefined || r.is_active === isAct || r.status === (isAct ? 1 : 0));
  }

  const totalPages = Math.ceil(total / pageSize) || 1;
  const basePath = addHref.replace('/add', '');
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="space-y-5 font-sans text-[14px] text-zinc-800">
      <DeleteErrorAlert />

      {/* Search & Filter — Dashboard Admin mockup */}
      <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#751639]" />
          <h2 className="text-[15px] font-bold text-zinc-800">Search &amp; Filter</h2>
        </div>

        <form method="GET" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Search For</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Enter keywords..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#751639]/20 focus:border-[#751639]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Language</label>
              <select
                name="lang"
                defaultValue={lang}
                className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#751639]/20"
              >
                <option value="all">All</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Status</label>
              <select
                name="status"
                defaultValue={status}
                className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#751639]/20"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-[12px] text-zinc-600">
              <span className="font-semibold">Rows per page</span>
              <select
                name="limit"
                defaultValue="10"
                className="px-2 py-1.5 border border-zinc-200 rounded-md bg-white text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <input type="hidden" name="sort" value={sort || 'newest'} />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={basePath}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#751639]/40 text-[#751639] bg-[#fff5f8] text-sm font-semibold hover:bg-[#fde8ef] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                <Search className="w-3.5 h-3.5" /> Search
              </button>
              <Link
                href={addHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                <Plus className="w-4 h-4" /> Add New
              </Link>
            </div>
          </div>
        </form>
      </section>

      {/* Data table card */}
      <section className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-zinc-800">{title}</h3>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Displaying {start}–{end} of {total.toLocaleString()}.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#751639]/35 bg-white text-sm font-semibold text-[#751639] hover:bg-[#fff5f8]"
          >
            <Upload className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f7f8fa] border-b border-zinc-100 text-left">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-20">ID</th>
                {cols.map((c) => (
                  <th key={c.key} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 text-right w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={cols.length + 2} className="text-center py-16 text-zinc-400 text-sm">
                    No records found matching the criteria
                  </td>
                </tr>
              ) : (
                rows.map((row: any, idx: number) => (
                  <tr key={row.id || idx} className="border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#751639]">#{row.id ?? (page - 1) * pageSize + idx + 1}</span>
                    </td>
                    {cols.map((c) => (
                      <td key={c.key} className="px-4 py-3.5">
                        {c.render ? c.render(row) : fmt(row[c.key], c.type)}
                      </td>
                    ))}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {viewBase && (
                          <Link
                            href={`${viewBase}/${row.id}`}
                            className="p-1.5 text-zinc-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`${editBase}/${row.id}/edit`}
                          className="p-1.5 text-zinc-500 hover:text-[#751639] hover:bg-[#751639]/5 rounded-lg"
                          title="Edit"
                        >
                          <SquarePen className="w-4 h-4" />
                        </Link>
                        <DeleteButton table={table} id={row.id} editBase={editBase} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationLinks page={page} totalPages={totalPages} totalCount={total} />
      </section>
    </div>
  );
}
