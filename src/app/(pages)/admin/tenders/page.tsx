'use client';

import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, TenderItem as DataTenderItem } from '@/lib/dataManager';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  ExternalLink, 
  FileText, 
  Calendar, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminTenders() {
  const { isHindi, t, getText } = useAdminLanguage();
  const API_URL = getApiBaseUrl();
  const [tenders, setTenders] = useState<DataTenderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');
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
      const statusParam = statusFilter !== 'All' ? `status=${statusFilter.toLowerCase()}` : 'status=all';
      const res = await fetch(`${API_URL}/api/tenders?${statusParam}`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      
      let filtered = Array.isArray(data) && data.length > 0 ? data : dataManager.getTenders();
      if (appliedSearch) {
        filtered = filtered.filter((item: any) => 
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          item.reference_no?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }

      if (sortFilter === 'title_asc') {
        filtered.sort((a: any, b: any) => (a.title_en || '').localeCompare(b.title_en || ''));
      } else if (sortFilter === 'title_desc') {
        filtered.sort((a: any, b: any) => (b.title_en || '').localeCompare(a.title_en || ''));
      } else if (sortFilter === 'oldest') {
        filtered.sort((a: any, b: any) => (new Date(a.closing_date).getTime() || 0) - (new Date(b.closing_date).getTime() || 0));
      } else {
        filtered.sort((a: any, b: any) => (new Date(b.closing_date).getTime() || 0) - (new Date(a.closing_date).getTime() || 0));
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

      if (sortFilter === 'title_asc') {
        filtered.sort((a: any, b: any) => (a.title_en || '').localeCompare(b.title_en || ''));
      } else if (sortFilter === 'title_desc') {
        filtered.sort((a: any, b: any) => (b.title_en || '').localeCompare(a.title_en || ''));
      } else if (sortFilter === 'oldest') {
        filtered.sort((a: any, b: any) => (new Date(a.closing_date).getTime() || 0) - (new Date(b.closing_date).getTime() || 0));
      } else {
        filtered.sort((a: any, b: any) => (new Date(b.closing_date).getTime() || 0) - (new Date(a.closing_date).getTime() || 0));
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
  }, [appliedSearch, statusFilter, sortFilter]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
    setSortFilter('newest');
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
    if (!confirm(isHindi ? 'क्या आप वाकई इस निविदा सूचना को हटाना चाहते हैं?' : 'Are you sure you want to delete this tender Notice?')) return;
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
          {isHindi ? 'निविदाएं और सूचनाएं' : 'Tenders & Notices'}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                placeholder={isHindi ? 'संदर्भ संख्या या शीर्षक कीवर्ड दर्ज करें...' : 'Enter reference no or title keyword...'}
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

            {/* Sort Order */}
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
                {isHindi ? 'क्रमबद्ध करें' : 'Sort Order'}
              </label>
              <div className="relative w-full">
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="newest">{isHindi ? 'अंतिम तिथि (दूरस्थ पहले)' : 'Closing Date (Furthest first)'}</option>
                  <option value="oldest">{isHindi ? 'अंतिम तिथि (जल्द समाप्त)' : 'Closing Date (Closing soonest)'}</option>
                  <option value="title_asc">{isHindi ? 'शीर्षक (अ से ज्ञ)' : 'Title (A to Z)'}</option>
                  <option value="title_desc">{isHindi ? 'शीर्षक (ज्ञ से अ)' : 'Title (Z to A)'}</option>
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
            {isHindi ? 'निविदा सूचना पंजिका' : 'Tender Notices Registry'}
          </h2>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="h-[36px] px-4 rounded-[8px] text-white text-[14px] font-medium shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewTender}</span>
          </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#F5F3F4]">
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-16" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>{t.sNo}</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'संदर्भ संख्या' : 'REF NUMBER'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider min-w-[280px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>{isHindi ? 'निविदा / सूचना शीर्षक' : 'TENDER / NOTICE TITLE'}</span>
                    <span className="text-[10px]">⇅</span>
                  </div>
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'अंतिम तिथि' : 'CLOSING DATE'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'स्थिति' : 'STATUS'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'कार्रवाइयाँ' : 'ACTIONS'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#90A1B9]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span style={{ fontFamily: "'Inter', sans-serif" }}>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : tenders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#90A1B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.noData}
                  </td>
                </tr>
              ) : (
                tenders.map((tender) => (
                  <tr key={tender.id} className="hover:bg-[#FDFBFC] transition-colors">
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span 
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: '14px',
                          color: '#751639'
                        }}
                      >
                        #{tender.id}
                      </span>
                    </td>

                    {/* Reference No */}
                    <td className="px-6 py-4 font-mono text-[13px] text-[#314158]">
                      {tender.reference_no}
                    </td>

                    {/* Tender Title */}
                    <td className="px-6 py-4">
                      <div 
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: '#0F172B'
                        }}
                      >
                        {getText(tender.title_en, tender.title_hi)}
                      </div>
                      {isHindi ? (
                        tender.title_en && tender.title_hi && (
                          <div className="text-[12px] text-[#62748E] line-clamp-1 mt-0.5">
                            {tender.title_en}
                          </div>
                        )
                      ) : (
                        tender.title_hi && (
                          <div className="text-[12px] text-[#62748E] line-clamp-1 mt-0.5">
                            {tender.title_hi}
                          </div>
                        )
                      )}
                    </td>

                    {/* Closing Date */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 text-[13px] text-[#314158]">
                        <Calendar className="w-3.5 h-3.5 text-[#90A1B9]" />
                        <span>{tender.closing_date}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      {tender.is_active ? (
                        <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                          {t.active}
                        </span>
                      ) : (
                        <span className="bg-[#FDF4F0] text-[#E11D48] border border-[#FFE4E6] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                          {t.inactive}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(tender.id)}
                          className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                          title={isHindi ? 'संपादित करें' : 'Edit Tender'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tender.id)}
                          className="text-[#EF4444] hover:text-[#B91C1C] transition-colors cursor-pointer"
                          title={isHindi ? 'हटाएँ' : 'Delete Tender'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── 3. PAGINATION FOOTER ── */}
        <div className="px-6 py-4 border-t border-[#F5F3F4] flex flex-wrap items-center justify-between gap-4">
          <div 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#62748E'
            }}
          >
            {t.showing} 1 {t.to} {tenders.length} {t.of} {tenders.length} {t.entries}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled
              className="w-8 h-8 rounded-[6px] border border-[#EDE9E9] flex items-center justify-center text-[#62748E] opacity-40 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-[6px] text-[13px] font-medium bg-[#751639] text-white flex items-center justify-center shadow-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              1
            </button>
            <button
              disabled
              className="w-8 h-8 rounded-[6px] border border-[#EDE9E9] flex items-center justify-center text-[#62748E] opacity-40 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ── 4. CREATE / EDIT MODAL ── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EDE9E9] max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div 
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <div>
                <h3 className="font-semibold text-[16px]">
                  {editingId ? (isHindi ? `निविदा सूचना #${editingId} संपादित करें` : `Edit Tender Notice #${editingId}`) : (isHindi ? 'नई निविदा सूचना जोड़ें' : 'Add New Tender Notice')}
                </h3>
                <p className="text-[12px] text-white/80">
                  {isHindi ? 'निविदा संदर्भ और खरीद दस्तावेज़ कॉन्फ़िगर करें' : 'Configure tender reference and procurement documents'}
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'निविदा शीर्षक (अंग्रेज़ी) *' : 'Tender Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Supply and Installation of Servers at Headquarters"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'निविदा शीर्षक (हिन्दी)' : 'Tender Title (हिन्दी)'}
                </label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  placeholder="उदा. मुख्यालय में सर्वर की आपूर्ति और स्थापना"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'संदर्भ संख्या *' : 'Reference Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. CAG/TD/2026/01"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#314158]">
                    {isHindi ? 'अंतिम तिथि *' : 'Closing Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[#314158]">
                  {isHindi ? 'दस्तावेज़ / पीडीएफ लिंक' : 'Document / PDF Link'}
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveTender"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#751639] cursor-pointer"
                />
                <label htmlFor="isActiveTender" className="text-[13px] font-semibold text-[#314158] cursor-pointer">
                  {isHindi ? 'लाइव निविदा नोटिस बोर्ड पर प्रकाशित करें' : 'Publish to Live Tenders Notice Board'}
                </label>
              </div>

              <div className="border-t border-[#EDE9E9] pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-xs hover:bg-[#F8F7F7] cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-[8px] text-white font-semibold text-xs shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  {editingId ? (isHindi ? 'अद्यतन करें' : 'Update Tender') : (isHindi ? 'निविदा बनाएँ' : 'Create Tender')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

