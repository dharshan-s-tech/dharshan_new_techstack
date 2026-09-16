'use client';

import React, { useEffect, useState } from 'react';

interface NewsDisplayItem {
  id: string;
  title_en: string;
  desc_en: string;
  news_type: string;
  tag: string;
  publish_date: string;
  is_active: boolean;
}

export default function AdminNews() {
  const [news, setNews] = useState<NewsDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Search Filters
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');

  const [appliedSearch, setAppliedSearch] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [newsType, setNewsType] = useState<'trending' | 'featured'>('trending');
  const [tag, setTag] = useState('General');
  const [isActive, setIsActive] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        table: 'notification',
        page: page.toString(),
        limit: '20'
      });
      if (appliedSearch.trim()) {
        params.append('search', appliedSearch.trim());
      }
      if (statusFilter !== 'All') {
        params.append('status', statusFilter === 'Active' ? '1' : '0');
      }

      const res = await fetch(`/api/admin/crud?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const rawList: any[] = json.data || json.items || [];
        let formatted: NewsDisplayItem[] = rawList.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          title_en: item.title_en || item.title || item.name || `Notification #${item.id}`,
          desc_en: item.description || item.desc_en || item.content_en || item.desc || '',
          news_type: item.news_type || item.type || (item.is_trending ? 'trending' : 'featured'),
          tag: item.tag || item.category || 'General',
          publish_date: item.publish_date || item.created_at || '—',
          is_active: item.status === 1 || item.is_active === true || item.is_active === '1'
        }));

        if (typeFilter !== 'All') {
          formatted = formatted.filter((item) => item.news_type === typeFilter);
        }

        if (sortFilter === 'title_asc') {
          formatted.sort((a, b) => (a.title_en || '').localeCompare(b.title_en || ''));
        } else if (sortFilter === 'title_desc') {
          formatted.sort((a, b) => (b.title_en || '').localeCompare(a.title_en || ''));
        } else if (sortFilter === 'oldest') {
          formatted.sort((a, b) => (new Date(a.publish_date).getTime() || 0) - (new Date(b.publish_date).getTime() || 0));
        } else {
          formatted.sort((a, b) => (new Date(b.publish_date).getTime() || 0) - (new Date(a.publish_date).getTime() || 0));
        }

        setNews(formatted);
        setTotalCount(json.total || formatted.length);
        setTotalPages(json.totalPages || Math.ceil((json.total || formatted.length) / 20) || 1);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, appliedSearch, statusFilter, typeFilter, sortFilter]);

  const handleSearchGo = () => {
    setPage(1);
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
    setSortFilter('newest');
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setDescEn('');
    setNewsType('trending');
    setTag('General');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const item = news.find((n) => n.id === id);
    if (!item) return;

    setEditingId(id);
    setTitleEn(item.title_en);
    setDescEn(item.desc_en);
    setNewsType(item.news_type as 'trending' | 'featured');
    setTag(item.tag);
    setIsActive(item.is_active);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news update?')) return;
    try {
      await fetch(`/api/admin/crud?table=notification&id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert('Failed to delete news item');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: titleEn,
      title_en: titleEn,
      description: descEn,
      news_type: newsType,
      tag: tag,
      status: isActive ? 1 : 0
    };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/admin/crud?table=notification&id=${editingId}` 
        : `/api/admin/crud?table=notification`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload })
      });
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save notification');
    }
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">News & Press Releases Management (AeNotices)</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Manage trending news tickers, featured notices, and public announcements.</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add New Notice
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-zinc-555 font-bold mb-1">Search Headline:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              placeholder="Enter Keywords"
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
            />
          </div>

          <div>
            <label className="block text-zinc-555 font-bold mb-1">Notice Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Types</option>
              <option value="trending">Trending News</option>
              <option value="featured">Featured Headlines</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-555 font-bold mb-1">Sort Order:</label>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none focus:border-[#751639]"
            >
              <option value="newest">Publish Date (Newest first)</option>
              <option value="oldest">Publish Date (Oldest first)</option>
              <option value="title_asc">Title (A to Z)</option>
              <option value="title_desc">Title (Z to A)</option>
            </select>
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
            AeNotices Records [ Displaying {news.length} of {news.length} ]
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
                <th className="px-4 py-3.5 border-r border-white/20">Notice Title</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-32">Type</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-28">Tag</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-32">Publish Date</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    Loading news and announcements...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    No news items registered.
                  </td>
                </tr>
              ) : (
                news.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">
                      <div>{item.title_en}</div>
                      <div className="text-[11px] text-zinc-500 font-normal mt-0.5 truncate">{item.desc_en}</div>
                    </td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] capitalize font-medium">{item.news_type}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-zinc-600">{item.tag}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-mono text-zinc-500">{item.publish_date}</td>
                    
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
            Page {page} of {totalPages} ({totalCount} total news & notices)
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
              {editingId ? 'Edit Notice Record' : 'Register New Announcement'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter notice title"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Short Description / Summary</label>
                <textarea
                  rows={3}
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter notice details"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Notice Type *</label>
                  <select
                    value={newsType}
                    onChange={(e) => setNewsType(e.target.value as any)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="trending">Trending News Ticker</option>
                    <option value="featured">Featured News Headline</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                    placeholder="e.g. Audit / General"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Notice Record
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
