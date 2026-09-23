'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, GlobalRelationItem } from '@/lib/dataManager';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Globe2, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';

export default function AdminGlobalPage() {
  const { isHindi, t } = useAdminLanguage();
  const [relations, setRelations] = useState<GlobalRelationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Multilateral');
  const [desc, setDesc] = useState('');
  const [linkUrl, setLinkUrl] = useState('#');

  const loadData = () => {
    setLoading(true);
    setRelations(dataManager.getGlobalRelations());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleGlobalChange = () => loadData();
    window.addEventListener('globalRelationsChange', handleGlobalChange);
    return () => window.removeEventListener('globalRelationsChange', handleGlobalChange);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Multilateral');
    setDesc('');
    setLinkUrl('#');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: GlobalRelationItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setDesc(item.desc);
    setLinkUrl(item.link_url || '#');
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, titleStr: string) => {
    if (!confirm(`Are you sure you want to delete "${titleStr}"?`)) return;
    dataManager.deleteGlobalRelation(id);
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: GlobalRelationItem = {
      id: editingId || `gr-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      desc: desc.trim(),
      link_url: linkUrl.trim()
    };
    dataManager.saveGlobalRelation(record);
    setIsFormOpen(false);
    loadData();
  };

  if (isFormOpen) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white rounded-[10px] border border-[#EDE9E9] p-6 flex flex-col justify-start animate-fadeIn">
        <div className="w-full max-w-[1526.2px] bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] overflow-hidden">
          <div 
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-md text-xs font-semibold text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                ← {isHindi ? 'वापस' : 'Back'}
              </button>
              <div>
                <h3 className="font-semibold text-[16px]">
                  {editingId ? (isHindi ? 'रिकॉर्ड संपादित करें' : 'Edit International Audit Record') : (isHindi ? 'नया रिकॉर्ड जोड़ें' : 'Add New Record')}
                </h3>
                <p className="text-[12px] text-white/80">
                  {isHindi ? 'अंतर्राष्ट्रीय सहभागिता कॉन्फ़िगर करें' : 'Configure international engagement'}
                </p>
              </div>
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
                {isHindi ? 'संगठन / शीर्षक *' : 'Organization / Title *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. INTOSAI Governing Board"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                {isHindi ? 'श्रेणी *' : 'Category *'}
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Multilateral or Bilateral"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                {isHindi ? 'विवरण सारांश' : 'Description Summary'}
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Summary of engagement..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-3 text-[13px] text-[#314158] focus:outline-none focus:border-[#751639]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#314158]">
                {isHindi ? 'बाहरी लिंक यूआरएल' : 'External Link URL'}
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
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
                {editingId ? (isHindi ? 'अद्यतन करें' : 'Update Record') : (isHindi ? 'सहेजें' : 'Create Record')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
          {isHindi ? 'अंतर्राष्ट्रीय सहभागिता' : 'International Engagements'}
        </h1>
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
            {isHindi ? 'अंतर्राष्ट्रीय सहभागिता पंजिका' : 'International Engagements Registry'}
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
            <span>{isHindi ? 'नया रिकॉर्ड जोड़ें' : 'Add Global Relation'}</span>
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
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider min-w-[280px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'संगठन / शीर्षक' : 'ORGANIZATION / TITLE'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'श्रेणी' : 'CATEGORY'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {isHindi ? 'विवरण' : 'DESCRIPTION'}
                </th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#90A1B9]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span style={{ fontFamily: "'Inter', sans-serif" }}>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : relations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#90A1B9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t.noData}
                  </td>
                </tr>
              ) : (
                relations.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-[#FDFBFC] transition-colors">
                    
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
                        #{idx + 1}
                      </span>
                    </td>

                    {/* Title */}
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
                        {item.title}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#F8F7F7] text-[#314158] border border-[#EDE9E9]">
                        {item.category}
                      </span>
                    </td>

                    {/* Desc */}
                    <td className="px-6 py-4 text-[13px] text-[#62748E] max-w-md truncate">
                      {item.desc}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="text-[#64748B] hover:text-[#751639] transition-colors cursor-pointer"
                          title={isHindi ? 'संपादित करें' : 'Edit Record'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          className="text-[#EF4444] hover:text-[#B91C1C] transition-colors cursor-pointer"
                          title={isHindi ? 'हटाएँ' : 'Delete Record'}
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
            {t.showing} 1 {t.to} {relations.length} {t.of} {relations.length} {t.entries}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#94A3B8] opacity-40 cursor-not-allowed shadow-xs"
              title={t.previous}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 rounded-[8px] text-[14px] font-medium bg-[#751639] text-white flex items-center justify-center shadow-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              1
            </button>
            <button
              disabled
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] opacity-40 cursor-not-allowed shadow-xs"
              title={t.next}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

          </div>
  );
}
