'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, BannerItem } from '@/lib/dataManager';

export default function AdminBanners() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [searchFor, setSearchFor] = useState('');
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
        item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase())
      );
    }
    setBanners(list);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleBannersChange = () => loadData();
    window.addEventListener('bannersChange', handleBannersChange);
    return () => window.removeEventListener('bannersChange', handleBannersChange);
  }, [appliedSearch]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
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
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">Home Banners & Carousel Slideshow Management</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Upload banner image files, edit hero headlines, display order, and redirect links.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add New Banner
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-zinc-555 font-bold mb-1">Search For:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              placeholder="Enter Keywords"
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
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
            Banners & Slideshows [ Displaying {banners.length} of {banners.length} ]
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
                <th className="px-4 py-3.5 border-r border-white/20 w-36">Image Preview</th>
                <th className="px-4 py-3.5 border-r border-white/20">Banner Headline Title</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-48">Subtitle</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-24 text-center">Order No</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
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
                  <tr key={banner.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7]">
                      <img 
                        src={banner.image_url || '/assets/0a49806ee3dbb7eb472a11bdfed5e0037a544c20.png'} 
                        alt={banner.title_en}
                        className="h-10 w-24 object-cover border border-zinc-200"
                      />
                    </td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-sm truncate">{banner.title_en}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-zinc-550 max-w-xs truncate">{banner.subtitle_en || '-'}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono">{banner.display_order}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center">
                      <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold ${
                        banner.is_active 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-zinc-100 text-zinc-650'
                      }`}>
                        {banner.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(banner.id)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
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

      {/* Details Slide Modal Form */}
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
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Banner Record
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
