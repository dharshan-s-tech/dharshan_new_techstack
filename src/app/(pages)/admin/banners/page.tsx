'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, BannerItem } from '@/lib/dataManager';
import { Search, RotateCcw, Plus, SquarePen, Trash2 } from 'lucide-react';

export default function AdminBanners() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Status Filters
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleHi, setSubtitleHi] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png');
  const [linkUrl, setLinkUrl] = useState('#');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const loadData = () => {
    setLoading(true);
    let list = dataManager.getBanners();
    if (appliedSearch) {
      list = list.filter((item) => 
        item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        item.subtitle_en?.toLowerCase().includes(appliedSearch.toLowerCase())
      );
    }
    if (statusFilter === 'Active') {
      list = list.filter((item) => item.is_active);
    } else if (statusFilter === 'Inactive') {
      list = list.filter((item) => !item.is_active);
    }
    setBanners(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleBannersChange = () => loadData();
    window.addEventListener('bannersChange', handleBannersChange);
    return () => window.removeEventListener('bannersChange', handleBannersChange);
  }, [appliedSearch, statusFilter]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setStatusFilter('All');
    setAppliedSearch('');
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setSubtitleEn('');
    setSubtitleHi('');
    setImageUrl('/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png');
    setLinkUrl('#');
    setDisplayOrder(banners.length + 1);
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    const item = banners.find((b) => b.id === id);
    if (!item) return;

    setEditingId(id);
    setTitleEn(item.title_en || '');
    setTitleHi(item.title_hi || '');
    setSubtitleEn(item.subtitle_en || '');
    setSubtitleHi(item.subtitle_hi || '');
    setImageUrl(item.image_url || '');
    setLinkUrl(item.link_url || '#');
    setDisplayOrder(item.display_order || 1);
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

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

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    dataManager.deleteBanner(id);
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: BannerItem = {
      id: editingId || Date.now(),
      title_en: titleEn,
      title_hi: titleHi || undefined,
      subtitle_en: subtitleEn || undefined,
      subtitle_hi: subtitleHi || undefined,
      image_url: imageUrl,
      link_url: linkUrl,
      display_order: displayOrder,
      is_active: isActive
    };

    dataManager.saveBanner(newRecord);
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-800">Search &amp; Filter</h2>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-sm rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-zinc-600 font-semibold mb-1.5 text-[12px]">Search For</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchFor}
                onChange={(e) => setSearchFor(e.target.value)}
                placeholder="Enter keywords..."
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-[#751639] focus:ring-2 focus:ring-[#751639]/15"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-600 font-semibold mb-1.5 text-[12px]">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearchReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#751639]/40 text-[#751639] bg-[#fff5f8] hover:bg-[#fde8ef] transition-colors font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={handleSearchGo}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-white font-semibold shadow-sm hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE GRID PANEL */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-zinc-800 text-[16px]">Banners</h3>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Displaying {banners.length === 0 ? 0 : 1}–{banners.length} of {banners.length}.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f8fa] border-b border-zinc-100 text-left">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-20">ID</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-36">Image</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500">Title</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-48">Subtitle</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-24 text-center">Order</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 w-28 text-center">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-zinc-500 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    Retrieving active banner images...
                  </td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    No active banners registered.
                  </td>
                </tr>
              ) : (
                banners.map((banner, idx) => (
                  <tr key={banner.id} className="border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors text-zinc-800">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#751639]">#{banner.id ?? idx + 1}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <img 
                        src={banner.image_url || '/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png'} 
                        alt={banner.title_en}
                        className="h-10 w-24 object-cover border border-zinc-200 rounded"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-zinc-800 max-w-sm truncate">{banner.title_en}</td>
                    <td className="px-4 py-3.5 text-zinc-500 max-w-xs truncate">{banner.subtitle_en || '—'}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-zinc-600">{banner.display_order}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        banner.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${banner.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(banner.id)}
                          className="p-1.5 text-zinc-500 hover:text-[#751639] hover:bg-[#751639]/5 rounded-lg"
                          title="Edit"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete"
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
      </div>

      {/* Details Slide Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-zinc-200 max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-base font-bold"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
              {editingId ? 'Edit Banner Details' : 'Register New Home Banner'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Banner Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="Headline title"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Banner Title (Hindi)</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="हिंदी शीर्षक"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Subtitle Description (English)</label>
                  <input
                    type="text"
                    value={subtitleEn}
                    onChange={(e) => setSubtitleEn(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="Short description"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Subtitle Description (Hindi)</label>
                  <input
                    type="text"
                    value={subtitleHi}
                    onChange={(e) => setSubtitleHi(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="हिंदी विवरण"
                  />
                </div>
              </div>

              {/* UPLOAD IMAGE SECTION */}
              <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-2">
                <label className="block font-bold text-zinc-800 text-xs mb-1">
                  Upload Banner Image File or Enter URL *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="cursor-pointer bg-[#751639] hover:bg-[#5f122d] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5">
                    <span>📁 Choose File to Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-grow w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="or paste image URL"
                  />
                </div>
                {imageUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-zinc-500">Live Preview:</span>
                    <img
                      src={imageUrl}
                      alt="Banner preview"
                      className="h-16 w-32 object-cover border border-zinc-300 shadow-xs"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Active Status</label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Slide Redirect URL</label>
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
                  style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
                >
                  Save Banner
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
