'use client';

import React, { useEffect, useState } from 'react';

export interface CircularItem {
  id: number;
  title_en: string;
  title_hi?: string;
  circular_no: string;
  file_url: string;
  issue_date: string;
  is_active: boolean;
}

export default function AdminCirculars() {
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search Filters
  const [searchFor, setSearchFor] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [circularNo, setCircularNo] = useState('');
  const [fileUrl, setFileUrl] = useState('#');
  const [issueDate, setIssueDate] = useState('2026-08-15');
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        table: 'circulars',
        page: page.toString(),
        limit: '20'
      });
      if (appliedSearch.trim()) {
        params.append('search', appliedSearch.trim());
      }
      const res = await fetch(`/api/admin/crud?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const rawItems = json.data || json.items || [];
        const items: CircularItem[] = rawItems.map((item: any) => ({
          id: typeof item.id === 'string' ? parseInt(item.id, 10) || item.id : item.id,
          title_en: item.title_en || item.title || item.name || `Circular #${item.id}`,
          title_hi: item.title_hi || '',
          circular_no: item.circular_no || item.order_no || `CIR-${item.id}`,
          file_url: item.file_url || item.document || '#',
          issue_date: item.issue_date || item.created_at || '—',
          is_active: item.status === 1 || item.is_active === true || item.is_active === '1'
        }));
        setCirculars(items);
        setTotalCount(json.total || items.length);
        setTotalPages(json.totalPages || Math.ceil((json.total || items.length) / 20) || 1);
      }
    } catch (err) {
      console.error('Error loading circulars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, appliedSearch]);

  const handleSearchGo = () => {
    setPage(1);
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setCircularNo(`Cir-${totalCount + 10}/IAAD/2026`);
    setFileUrl('#');
    setIssueDate('2026-08-15');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    const item = circulars.find((c) => c.id === id);
    if (!item) return;

    setEditingId(id);
    setTitleEn(item.title_en || '');
    setTitleHi(item.title_hi || '');
    setCircularNo(item.circular_no || '');
    setFileUrl(item.file_url || '#');
    setIssueDate(item.issue_date || '2026-08-15');
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this circular notice?')) return;
    try {
      await fetch(`/api/admin/crud?table=circulars&id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Failed to delete circular');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: titleEn,
      title_en: titleEn,
      title_hi: titleHi,
      circular_no: circularNo,
      issue_date: issueDate,
      file_url: fileUrl,
      status: isActive ? 1 : 0
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/admin/crud?table=circulars&id=${editingId}` 
        : `/api/admin/crud?table=circulars`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload })
      });
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save circular');
    }
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">Circulars & Recruitment Regulations Management</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Manage administrative circulars, official notifications, and PDF attachments.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add New Circular
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-zinc-555 font-bold mb-1">Search Circulars:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              placeholder="Circular No / Title"
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none focus:border-[#751639]"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearchGo}
              className="border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-5 py-1.5 rounded-none transition-colors font-medium bg-white"
            >
              GO
            </button>
            <button
              onClick={handleSearchReset}
              className="border border-zinc-400 text-zinc-700 hover:bg-zinc-100 px-5 py-1.5 rounded-none transition-colors font-medium bg-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE GRID PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex justify-between items-center bg-[#fafbfc]">
          <h3 className="font-semibold text-zinc-800">
            Circulars Registry [ Displaying {circulars.length} of {circulars.length} ]
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-4 py-3.5 border-r border-white/20 w-12 text-center">#</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-44">Circular No</th>
                <th className="px-4 py-3.5 border-r border-white/20">Circular Title</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-36">Issue Date</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    Loading circulars registry...
                  </td>
                </tr>
              ) : circulars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    No circular notices registered.
                  </td>
                </tr>
              ) : (
                circulars.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-mono text-zinc-700 font-bold">{item.circular_no || '-'}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">{item.title_en}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-mono text-zinc-600">{item.issue_date || '-'}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center">
                      <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold ${
                        item.is_active 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-zinc-100 text-zinc-650'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(item.id)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 border border-red-200 hover:bg-red-50 text-red-600 inline-flex items-center justify-center w-7 h-7"
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-[#e2e5e7] bg-[#fafbfc] flex items-center justify-between text-xs text-zinc-600">
          <span>
            Page {page} of {totalPages} ({totalCount} total circulars)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-zinc-300 bg-white hover:bg-zinc-100 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-zinc-300 bg-white hover:bg-zinc-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Form Slide Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-base font-bold"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
              {editingId ? 'Edit Circular Notice' : 'Register New Circular Notice'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Circular Number *</label>
                  <input
                    type="text"
                    required
                    value={circularNo}
                    onChange={(e) => setCircularNo(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Circular Title (English) *</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter circular title"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">PDF File Link URL</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Circular Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 border border-zinc-350 text-zinc-700 font-medium hover:bg-zinc-100 transition-colors bg-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
