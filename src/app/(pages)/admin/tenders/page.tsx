'use client';

import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, TenderItem as DataTenderItem } from '@/lib/dataManager';

export default function AdminTenders() {
  const API_URL = getApiBaseUrl();
  const [tenders, setTenders] = useState<DataTenderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [fileUrl, setFileUrl] = useState('#');
  const [closingDate, setClosingDate] = useState('2026-10-01');
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tenders`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      
      let filtered = Array.isArray(data) && data.length > 0 ? data : dataManager.getTenders();
      if (appliedSearch) {
        filtered = filtered.filter((item: any) => 
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          item.reference_no?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      setTenders(filtered);
    } catch (err) {
      let filtered = dataManager.getTenders();
      if (appliedSearch) {
        filtered = filtered.filter((item: any) => 
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          item.reference_no?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      setTenders(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleTendersChange = () => loadData();
    window.addEventListener('tendersChange', handleTendersChange);
    return () => window.removeEventListener('tendersChange', handleTendersChange);
  }, [appliedSearch, statusFilter]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setReferenceNo(`CAG/TD/${new Date().getFullYear()}/${tenders.length + 1}`);
    setFileUrl('#');
    setClosingDate('2026-10-01');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    const item = tenders.find((t) => t.id === id);
    if (!item) return;

    setEditingId(id);
    setTitleEn(item.title_en || '');
    setTitleHi(item.title_hi || '');
    setReferenceNo(item.reference_no || '');
    setFileUrl(item.tender_file_url || '#');
    setClosingDate(item.closing_date || '2026-10-01');
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tender Notice?')) return;
    try {
      const token = localStorage.getItem('cag_admin_token');
      await fetch(`${API_URL}/api/admin/tenders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      // Ignore API offline
    }

    dataManager.deleteTender(id);
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DataTenderItem = {
      id: editingId || Date.now(),
      title_en: titleEn,
      title_hi: titleHi || undefined,
      reference_no: referenceNo,
      closing_date: closingDate,
      tender_file_url: fileUrl,
      is_active: isActive
    };

    try {
      const token = localStorage.getItem('cag_admin_token');
      const url = editingId
        ? `${API_URL}/api/admin/tenders/${editingId}`
        : `${API_URL}/api/admin/tenders`;
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newRecord),
      });
    } catch (err) {
      // Ignore API offline
    }

    dataManager.saveTender(newRecord);
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">Tenders & Procurement Notices Management</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Manage active tender notices, CA empanelments, and procurement file links.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add New Tender
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-zinc-555 font-bold mb-1">Search Keywords:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              placeholder="Ref No / Title"
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
            Tenders [ Displaying {tenders.length} of {tenders.length} ]
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
                <th className="px-4 py-3.5 border-r border-white/20 w-44">Reference No</th>
                <th className="px-4 py-3.5 border-r border-white/20">Tender Title</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-36">Closing Date</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    Loading active tenders registry...
                  </td>
                </tr>
              ) : tenders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    No tender notices registered.
                  </td>
                </tr>
              ) : (
                tenders.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-mono text-zinc-700 font-bold">{item.reference_no || '-'}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">{item.title_en}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-mono text-zinc-600">{item.closing_date || '-'}</td>
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
              {editingId ? 'Edit Tender Notice' : 'Register New Tender Notice'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Closing Submission Date</label>
                  <input
                    type="date"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Tender Title (English) *</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter tender title"
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
                  Save Tender Record
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
