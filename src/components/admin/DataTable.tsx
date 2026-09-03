'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, Pencil, Eye, Trash2, Plus, Filter, RefreshCw } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  pageSize?: number;
  searchValue?: string;
  addHref?: string;
  addLabel?: string;
  onSearch?: (q: string) => void;
  onPageChange?: (p: number) => void;
  onDelete?: (row: T) => void;
  onEdit?: (row: T) => string;
  onView?: (row: T) => string;
  isLoading?: boolean;
  title?: string;
  extraActions?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends { id: string | number }>({
  data, columns, total, page, pageSize = 20,
  searchValue = '', addHref, addLabel = 'Add New',
  onSearch, onPageChange, onDelete, onEdit, onView,
  isLoading, title, extraActions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState(searchValue);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(search);
  };

  const handleDelete = async (row: T) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    setDeletingId(row.id);
    try { await onDelete?.(row); } finally { setDeletingId(null); }
  };

  const getValue = (row: T, key: string): any => {
    return key.split('.').reduce((obj: any, k) => obj?.[k], row);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#751639]/20 focus:border-[#751639]"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-[#751639] text-white rounded-lg hover:bg-[#5f0f2d] transition-colors text-sm">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); onSearch?.(''); }}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600">
              Clear
            </button>
          )}
        </form>
        {addHref && (
          <Link href={addHref}
            className="flex items-center gap-2 px-4 py-2 bg-[#751639] text-white rounded-lg hover:bg-[#5f0f2d] transition-colors text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" />
            {addLabel}
          </Link>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-500 mb-3">
        Showing {data.length} of {total} records
        {total > 0 && ` · Page ${page} of ${totalPages}`}
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
                {columns.map(col => (
                  <th key={String(col.key)} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    style={col.width ? { width: col.width } : {}}>
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || onView || extraActions) && (
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={columns.length + 2} className="text-center py-16 text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#751639]/20 border-t-[#751639] rounded-full animate-spin" />
                    Loading...
                  </div>
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={columns.length + 2} className="text-center py-16 text-gray-400">
                  No records found
                </td></tr>
              ) : data.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * pageSize + idx + 1}</td>
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row) : String(getValue(row, String(col.key)) ?? '—')}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView || extraActions) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {extraActions?.(row)}
                        {onView && (
                          <Link href={onView(row)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        {onEdit && (
                          <Link href={onEdit(row)}
                            className="p-1.5 text-[#751639] hover:bg-[#751639]/5 rounded-lg transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                        )}
                        {onDelete && (
                          <button onClick={() => handleDelete(row)}
                            disabled={deletingId === row.id}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange?.(page - 1)} disabled={page <= 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 7) {
                if (page <= 4) p = i + 1;
                else if (page >= totalPages - 3) p = totalPages - 6 + i;
                else p = page - 3 + i;
              }
              return (
                <button key={p} onClick={() => onPageChange?.(p)}
                  className={`w-8 h-8 text-xs rounded-lg border transition-colors
                    ${page === p ? 'bg-[#751639] text-white border-[#751639]' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => onPageChange?.(page + 1)} disabled={page >= totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
