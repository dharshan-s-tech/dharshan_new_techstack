'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, GlobalRelationItem } from '@/lib/dataManager';

export default function AdminGlobalPage() {
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

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">Global Relations</h2>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add Global Relation Record
          </button>
        </div>
      </div>

      {/* 2. TABLE GRID PANEL */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-zinc-800 text-[16px]">Global Relations</h3>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Displaying {relations.length === 0 ? 0 : 1}–{relations.length} of {relations.length}.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8fa] border-b border-zinc-100 text-left">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-20">ID</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">Title</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-36">Category</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">Description</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">Loading international audit records...</td>
                </tr>
              ) : relations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">No international relation records registered.</td>
                </tr>
              ) : (
                relations.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-[#751639] max-w-sm">{item.title}</td>
                    <td className="px-4 py-3 font-mono text-zinc-600 capitalize">{item.category}</td>
                    <td className="px-4 py-3 text-zinc-600 max-w-md">{item.desc}</td>
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
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

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-zinc-200 max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-base font-bold">✕</button>
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
              {editingId ? 'Edit International Audit Record' : 'Add New International Audit Record'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Organization / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="e.g. INTOSAI Governing Board"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
                >
                  <option value="Multilateral">Multilateral (INTOSAI)</option>
                  <option value="UN Audit">UN Audit Board</option>
                  <option value="Regional">Regional (ASOSAI)</option>
                  <option value="Bilateral">Bilateral Relations</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter engagement details"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">External Link URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Record
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
