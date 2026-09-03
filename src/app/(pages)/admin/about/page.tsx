'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, FormerCAGItem } from '@/lib/dataManager';

export default function AdminAboutPage() {
  const [formerCags, setFormerCags] = useState<FormerCAGItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [tenure, setTenure] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const loadData = () => {
    setLoading(true);
    setFormerCags(dataManager.getFormerCags());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleCagsChange = () => loadData();
    window.addEventListener('formerCagsChange', handleCagsChange);
    return () => window.removeEventListener('formerCagsChange', handleCagsChange);
  }, []);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setTenure('(2024-2028)');
    setImageUrl('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: FormerCAGItem) => {
    setEditingId(item.id);
    setName(item.name);
    setTenure(item.tenure);
    setImageUrl(item.image_url || '');
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, nameStr: string) => {
    if (!confirm(`Are you sure you want to delete "${nameStr}" from Former CAGs listing?`)) return;
    dataManager.deleteFormerCag(id);
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: FormerCAGItem = {
      id: editingId || `fc-${Date.now()}`,
      name: name.trim(),
      tenure: tenure.trim(),
      image_url: imageUrl.trim()
    };
    dataManager.saveFormerCag(record);
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">About Us Page Management (Former CAGs Cards Desk)</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Upload portrait picture files, edit CAG names, tenures, and card details.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add Former CAG Record
          </button>
        </div>
      </div>

      {/* 2. TABLE GRID PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex justify-between items-center bg-[#fafbfc]">
          <h3 className="font-semibold text-zinc-800">
            Registered Former CAGs [ Showing {formerCags.length} records ]
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
                <th className="px-4 py-3.5 border-r border-white/20 w-28">Portrait</th>
                <th className="px-4 py-3.5 border-r border-white/20">CAG Official Name</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-44">Tenure Period</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">Loading Former CAG records...</td>
                </tr>
              ) : formerCags.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">No Former CAG records registered.</td>
                </tr>
              ) : (
                formerCags.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7]">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-10 w-10 object-cover rounded-full border border-zinc-200" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">👤</div>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639]">{item.name}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-mono text-zinc-600">{item.tenure}</td>
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
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
          <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-base font-bold">✕</button>
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
              {editingId ? 'Edit Former CAG Record' : 'Add New Former CAG Record'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Official Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="e.g. Girish Chandra Murmu"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Tenure Period *</label>
                <input
                  type="text"
                  required
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="e.g. (2020-2024)"
                />
              </div>

              {/* UPLOAD PORTRAIT IMAGE */}
              <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-2">
                <label className="block font-bold text-zinc-800 text-xs mb-1">
                  Upload Portrait Picture File or Enter URL
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="cursor-pointer bg-[#751639] hover:bg-[#5f122d] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5">
                    <span>📁 Choose Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-grow w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="or paste portrait image URL"
                  />
                </div>
                {imageUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-zinc-500">Live Preview:</span>
                    <img
                      src={imageUrl}
                      alt="Portrait preview"
                      className="h-12 w-12 rounded-full object-cover border border-zinc-300 shadow-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save CAG Record
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
