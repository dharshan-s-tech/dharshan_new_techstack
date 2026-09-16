'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface GlobalRelationsPageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  status?: number;
  is_dummy?: boolean;
}

interface GlobalRelationsItemDef {
  slug: string;
  label: string;
  category: string;
  is_dummy?: boolean;
}

const GLOBAL_RELATIONS_ITEMS: GlobalRelationsItemDef[] = [
  { slug: 'page-involvement-with-intosai', label: 'Association with INTOSAI', category: 'International Bodies' },
  { slug: 'page-involvement-with-asosai', label: 'Association with ASOSAI', category: 'International Bodies' },
  { slug: 'page-global-audit-leadership-forum-and-other-multilateral-bodies', label: 'Multilateral Engagement', category: 'International Bodies' },
  { slug: 'page-bilateral-relations-of-sai-india', label: 'Bilateral Relations of SAI India', category: 'Bilateral Relations' },
  { slug: 'page-un-panel-of-external-auditors', label: 'UN Panel of External Auditors', category: 'Audit Engagements' },
  { slug: 'page-present-international-audits', label: 'Present International Audits', category: 'Audit Engagements' },
  { slug: 'page-past-international-audits', label: 'Past International Audits', category: 'Audit Engagements' },
];

export default function AdminGlobalRelationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSlug = searchParams.get('slug') || 'page-involvement-with-intosai';

  const [pageData, setPageData] = useState<GlobalRelationsPageData | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeItem = GLOBAL_RELATIONS_ITEMS.find((item) => item.slug === activeSlug) || GLOBAL_RELATIONS_ITEMS[0];

  useEffect(() => {
    fetchPageData(activeSlug);
  }, [activeSlug]);

  const fetchPageData = async (slug: string) => {
    setLoading(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/global-relations/pages/${slug}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPageData(json.data);
          setTitle(json.data.title || activeItem.label);
          setContent(json.data.content || '');
        }
      } else {
        // Fallback for UI if server error
        setTitle(activeItem.label);
        setContent(activeItem.is_dummy ? '<p>Dummy Module Content</p>' : '');
      }
    } catch (err) {
      console.warn('API Error fetching page data:', err);
      setTitle(activeItem.label);
      setContent(activeItem.is_dummy ? '<p>Dummy Module Content</p>' : '');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/admin/global-relations/pages/${activeSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const json = await res.json();
        setSaveMessage({
          type: 'success',
          text: json.message || 'Page content updated successfully in database!',
        });
      } else {
        setSaveMessage({
          type: 'error',
          text: 'Failed to update page in database. Please check connection.',
        });
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage({
        type: 'error',
        text: 'Error connecting to backend server.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Module Title Header */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#6d1538] text-white text-xs font-bold px-2.5 py-0.5 rounded">
              Global Relations Module
            </span>
            {activeItem.is_dummy && (
              <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded border border-amber-300">
                Dummy Module (No DB Record)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            {activeItem.label}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Category: <strong className="text-zinc-700">{activeItem.category}</strong> | Slug: <code className="bg-zinc-100 px-1 py-0.5 rounded text-[#6d1538] font-mono text-[11px]">{activeSlug}</code>
          </p>
        </div>
      </div>

      {/* Main Content Editor Box */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-zinc-500 text-sm">
            Fetching record from PostgreSQL database...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {saveMessage && (
              <div
                className={`p-4 rounded-md text-sm font-medium border ${saveMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
              >
                {saveMessage.text}
              </div>
            )}

            {/* Page HTML Content Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Page Content (HTML Code / Rich Text)
                </label>
                <span className="text-[11px] text-zinc-400">
                  Pre-populated live from database record
                </span>
              </div>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-md p-4 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6d1538] leading-relaxed"
                placeholder="Enter page HTML content here..."
              />
            </div>

            {/* Live HTML Preview Box */}
            <div className="border border-zinc-200 rounded-md p-4 bg-zinc-50">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Live Content Preview
              </h3>
              <div
                className="prose prose-sm max-w-none text-zinc-800 bg-white p-4 rounded border border-zinc-200 min-h-[100px]"
                dangerouslySetInnerHTML={{ __html: content || '<p className="text-zinc-400 italic">No content to display preview</p>' }}
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => fetchPageData(activeSlug)}
                className="px-4 py-2 border border-zinc-300 rounded-md text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
                disabled={saving}
              >
                Discard / Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#6d1538] text-white rounded-md text-xs font-bold hover:bg-[#58112d] transition-colors shadow-xs flex items-center gap-2"
              >
                {saving ? 'Saving to DB...' : 'Save & Update Database'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
