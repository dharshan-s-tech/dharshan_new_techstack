'use client';

import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, CircularItem as DataCircularItem } from '@/lib/dataManager';
import { useAdminLanguage } from '@/lib/useAdminLanguage';

export default function AdminCirculars() {
  const API_URL = getApiBaseUrl();
  const { isHindi, t } = useAdminLanguage();
  const [circulars, setCirculars] = useState<DataCircularItem[]>([]);
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
  const [circularNo, setCircularNo] = useState('');
  const [fileUrl, setFileUrl] = useState('#');
  const [issueDate, setIssueDate] = useState('2026-08-15');
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter !== 'All' ? `status=${statusFilter.toLowerCase()}` : 'status=all';
      const res = await fetch(`${API_URL}/api/circulars?${statusParam}`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      
      let filtered = Array.isArray(data) && data.length > 0 ? data : dataManager.getCirculars();
      if (appliedSearch) {
        filtered = filtered.filter((item: any) => 
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          item.circular_no?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      setCirculars(filtered);
    } catch (err) {
      let filtered = dataManager.getCirculars();
      if (appliedSearch) {
        filtered = filtered.filter((item: any) => 
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          item.circular_no?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      setCirculars(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleCircularsChange = () => loadData();
    window.addEventListener('circularsChange', handleCircularsChange);
    return () => window.removeEventListener('circularsChange', handleCircularsChange);
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
    setCircularNo(`Cir-${circulars.length + 10}/IAAD/2026`);
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
      const token = localStorage.getItem('cag_admin_token');
      await fetch(`${API_URL}/api/admin/circulars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      // Ignore API offline
    }

    dataManager.deleteCircular(id);
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DataCircularItem = {
      id: editingId || Date.now(),
      title_en: titleEn,
      title_hi: titleHi || undefined,
      circular_no: circularNo,
      issue_date: issueDate,
      file_url: fileUrl,
      is_active: isActive
    };

    try {
      const token = localStorage.getItem('cag_admin_token');
      const url = editingId
        ? `${API_URL}/api/admin/circulars/${editingId}`
        : `${API_URL}/api/admin/circulars`;
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

    dataManager.saveCircular(newRecord);
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* ── TOP PAGE TITLE ── */}
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
          {isHindi ? 'परिपत्र एवं संसाधन प्रबंधन' : 'Resources & Circulars'}
        </h1>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="#751639" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search For */}
            <div className="flex flex-col gap-1.5">
              <label 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#62748E'
                }}
              >
                {t.searchFor}
              </label>
              <input
                type="text"
                value={searchFor}
                onChange={(e) => setSearchFor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
                placeholder={isHindi ? 'परिपत्र संख्या या शीर्षक दर्ज करें…' : 'Enter circular number or title…'}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#62748E'
                }}
              >
                {t.status}
              </label>
              <div className="relative w-full">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.allStatus}</option>
                  <option value="Active">{t.active}</option>
                  <option value="Inactive">{t.inactive}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F5F3F4] pt-4 mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleSearchReset}
              className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer font-medium text-[14px] text-[#701537]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {t.reset}
            </button>

            <button
              type="button"
              onClick={handleSearchGo}
              className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 font-semibold text-[14px]"
              style={{
                background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {t.search}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. CARD: TABLE DATA REGISTRY ── */}
      <div 
        className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden mb-12"
        style={{
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex justify-between items-center">
          <h2 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#0F172B'
            }}
          >
            {isHindi ? 'परिपत्र एवं संसाधन' : 'Resources & Circulars'}
          </h2>

          <button
            onClick={handleOpenCreate}
            className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '16px'
            }}
          >
            <span className="text-base font-bold">+</span>
            <span>{t.addNew}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="h-[45px] text-[#90A1B9]"
                style={{
                  background: 'rgba(117, 22, 57, 0.04)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                <th className="px-6 py-3 w-20">{t.sNo}</th>
                <th className="px-6 py-3 w-48">{isHindi ? 'परिपत्र संख्या' : 'CIRCULAR NO'}</th>
                <th className="px-6 py-3">{t.title}</th>
                <th className="px-6 py-3 w-36">{isHindi ? 'जारी तिथि' : 'ISSUE DATE'}</th>
                <th className="px-6 py-3 w-32 text-center">{t.status}</th>
                <th className="px-6 py-3 w-28 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-zinc-400 font-sans">
                    {t.loading}
                  </td>
                </tr>
              ) : circulars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-zinc-400 font-sans">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                circulars.map((item, idx) => (
                  <tr key={item.id} className="h-[64px] hover:bg-zinc-50/50 transition-colors">
                    <td 
                      className="px-6 py-3 whitespace-nowrap font-bold text-[#751639]"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                    >
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-3 font-mono text-zinc-800 font-semibold text-sm">
                      {item.circular_no || '-'}
                    </td>
                    <td className="px-6 py-3 font-semibold text-[#1D293D] max-w-md">
                      {isHindi ? (item.title_hi || item.title_en) : item.title_en}
                    </td>
                    <td className="px-6 py-3 font-mono text-zinc-600 text-sm">
                      {item.issue_date || '-'}
                    </td>
                    <td className="px-6 py-3 text-center whitespace-nowrap">
                      <div 
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-[50px] ${
                          item.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px' }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'}`} />
                        <span>{item.is_active ? t.active : t.inactive}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handleOpenEdit(item.id)}
                          className="text-[#666666] hover:text-[#751639] transition-colors cursor-pointer"
                          title={t.edit}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-[#E41818] hover:text-[#B91C1C] transition-colors cursor-pointer"
                          title={t.delete}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

      {/* CREATE / EDIT FULL-PAGE EDITOR PANEL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div
            className="px-6 py-4 text-white flex justify-between items-center shrink-0 shadow-md"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2.5 py-1 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {editingId ? 'Edit Circular Notice' : 'Register New Circular Notice'}
                </h3>
                <p className="text-[11px] text-white/70">
                  {editingId ? `Editing Record ID #${editingId}` : 'Publish new internal circular notice to CAG registry'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-white/70 hover:text-white text-xl font-bold p-1 cursor-pointer"
              title="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white border border-[#ced4da] shadow-xs p-6 md:p-8 space-y-5">
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
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs cursor-pointer"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Circular Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 border border-zinc-350 text-zinc-700 font-medium hover:bg-zinc-100 transition-colors bg-white cursor-pointer"
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
