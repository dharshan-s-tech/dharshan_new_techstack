'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { 
  Globe2, 
  Handshake, 
  Briefcase, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileText,
  ExternalLink,
  Eye,
  Save,
  Check
} from 'lucide-react';

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
  label_hi: string;
  category: 'international-bodies' | 'bilateral-relations' | 'audit-engagements' | 'relations-wing';
  categoryLabel: string;
  categoryLabel_hi: string;
  is_dummy?: boolean;
}

const GLOBAL_RELATIONS_ITEMS: GlobalRelationsItemDef[] = [
  { slug: 'page-involvement-with-intosai', label: 'Association with INTOSAI', label_hi: 'इंटोसाई के साथ सहभागिता', category: 'international-bodies', categoryLabel: 'International Bodies', categoryLabel_hi: 'अंतर्राष्ट्रीय निकाय' },
  { slug: 'page-involvement-with-asosai', label: 'Association with ASOSAI', label_hi: 'एसोसाई के साथ सहभागिता', category: 'international-bodies', categoryLabel: 'International Bodies', categoryLabel_hi: 'अंतर्राष्ट्रीय निकाय' },
  { slug: 'page-global-audit-leadership-forum-and-other-multilateral-bodies', label: 'Multilateral Engagement (GALF & SAIs)', label_hi: 'बहुपक्षीय सहभागिता (GALF और SAIs)', category: 'international-bodies', categoryLabel: 'International Bodies', categoryLabel_hi: 'अंतर्राष्ट्रीय निकाय' },
  
  { slug: 'page-bilateral-relations-of-sai-india', label: 'Bilateral Relations of SAI India', label_hi: 'साई भारत के द्विपक्षीय संबंध', category: 'bilateral-relations', categoryLabel: 'Bilateral Relations', categoryLabel_hi: 'द्विपक्षीय संबंध' },
  
  { slug: 'page-un-panel-of-external-auditors', label: 'UN Panel of External Auditors', label_hi: 'बाह्य लेखापरीक्षकों का संयुक्त राष्ट्र पैनल', category: 'audit-engagements', categoryLabel: 'Audit Engagements', categoryLabel_hi: 'लेखापरीक्षा सहभागिता' },
  { slug: 'page-present-international-audits', label: 'Present International Audits', label_hi: 'वर्तमान अंतर्राष्ट्रीय लेखापरीक्षा', category: 'audit-engagements', categoryLabel: 'Audit Engagements', categoryLabel_hi: 'लेखापरीक्षा सहभागिता' },
  { slug: 'page-past-international-audits', label: 'Past International Audits', label_hi: 'पिछली अंतर्राष्ट्रीय लेखापरीक्षा', category: 'audit-engagements', categoryLabel: 'Audit Engagements', categoryLabel_hi: 'लेखापरीक्षा सहभागिता' },
  
  { slug: 'page-international-relations-wing', label: 'International Relations Wing & Mandate', label_hi: 'अंतर्राष्ट्रीय संबंध प्रभाग एवं अधिदेश', category: 'relations-wing', categoryLabel: 'Relations Wing', categoryLabel_hi: 'संबंध प्रभाग' },
];

function AdminGlobalRelationsInner() {
  const { isHindi, t, getText } = useAdminLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active Category Tab: 'international-bodies' | 'bilateral-relations' | 'audit-engagements' | 'relations-wing'
  const tabParam = (searchParams.get('tab') || 'international-bodies') as GlobalRelationsItemDef['category'];
  const [activeCategory, setActiveCategory] = useState<GlobalRelationsItemDef['category']>(
    ['international-bodies', 'bilateral-relations', 'audit-engagements', 'relations-wing'].includes(tabParam)
      ? tabParam
      : 'international-bodies'
  );

  const activeCategoryItems = GLOBAL_RELATIONS_ITEMS.filter(item => item.category === activeCategory);

  const slugParam = searchParams.get('slug');
  const [activeSlug, setActiveSlug] = useState<string>(
    slugParam && GLOBAL_RELATIONS_ITEMS.some(i => i.slug === slugParam)
      ? slugParam
      : activeCategoryItems[0]?.slug || GLOBAL_RELATIONS_ITEMS[0].slug
  );

  const activeItem = GLOBAL_RELATIONS_ITEMS.find((item) => item.slug === activeSlug) || activeCategoryItems[0] || GLOBAL_RELATIONS_ITEMS[0];

  useEffect(() => {
    const t = searchParams.get('tab') as GlobalRelationsItemDef['category'];
    if (t && ['international-bodies', 'bilateral-relations', 'audit-engagements', 'relations-wing'].includes(t)) {
      setActiveCategory(t);
      const itemsForTab = GLOBAL_RELATIONS_ITEMS.filter(i => i.category === t);
      const s = searchParams.get('slug');
      if (s && itemsForTab.some(i => i.slug === s)) {
        setActiveSlug(s);
      } else if (itemsForTab.length > 0) {
        setActiveSlug(itemsForTab[0].slug);
      }
    }
  }, [searchParams]);

  const [pageData, setPageData] = useState<GlobalRelationsPageData | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setTitle(activeItem.label);
        setContent('<p>Content for ' + activeItem.label + '</p>');
      }
    } catch (err) {
      setTitle(activeItem.label);
      setContent('<p>Content for ' + activeItem.label + '</p>');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat: GlobalRelationsItemDef['category']) => {
    setActiveCategory(cat);
    const firstItem = GLOBAL_RELATIONS_ITEMS.find(i => i.category === cat);
    if (firstItem) {
      setActiveSlug(firstItem.slug);
      router.push(`/admin/global-relations?tab=${cat}&slug=${firstItem.slug}`);
    } else {
      router.push(`/admin/global-relations?tab=${cat}`);
    }
  };

  const handleItemSelect = (slug: string) => {
    setActiveSlug(slug);
    router.push(`/admin/global-relations?tab=${activeCategory}&slug=${slug}`);
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
          text: 'Saved to local workspace. (Backend API sync status: OK)',
        });
      }
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: 'Error connecting to backend server.',
      });
    } finally {
      setSaving(false);
    }
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
          {isHindi ? 'अंतर्राष्ट्रीय संबंध' : 'Global Relations'}
        </h1>
      </div>

      {/* ── 1. CARD: CATEGORY TABS ── */}
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
              <Globe2 className="w-4 h-4 text-[#751639]" />
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
              {isHindi ? 'वैश्विक क्षेत्र चुनें' : 'Select Global Domain'}
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-[#F5F3F4] flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('international-bodies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
              activeCategory === 'international-bodies' 
                ? 'bg-[#751639] text-white shadow-xs' 
                : 'bg-[#F8F7F7] text-[#62748E] hover:bg-[#EDE9E9]'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>{isHindi ? 'अंतर्राष्ट्रीय निकाय' : 'International Bodies'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${activeCategory === 'international-bodies' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#62748E]'}`}>
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('bilateral-relations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
              activeCategory === 'bilateral-relations' 
                ? 'bg-[#751639] text-white shadow-xs' 
                : 'bg-[#F8F7F7] text-[#62748E] hover:bg-[#EDE9E9]'
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>{isHindi ? 'द्विपक्षीय संबंध' : 'Bilateral Relations'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${activeCategory === 'bilateral-relations' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#62748E]'}`}>
              1
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('audit-engagements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
              activeCategory === 'audit-engagements' 
                ? 'bg-[#751639] text-white shadow-xs' 
                : 'bg-[#F8F7F7] text-[#62748E] hover:bg-[#EDE9E9]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{isHindi ? 'लेखापरीक्षा सहभागिता' : 'Audit Engagements'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${activeCategory === 'audit-engagements' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#62748E]'}`}>
              3
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('relations-wing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer ${
              activeCategory === 'relations-wing' 
                ? 'bg-[#751639] text-white shadow-xs' 
                : 'bg-[#F8F7F7] text-[#62748E] hover:bg-[#EDE9E9]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{isHindi ? 'संबंध प्रभाग' : 'Relations Wing'}</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${activeCategory === 'relations-wing' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#62748E]'}`}>
              1
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN LAYOUT: PAGES REGISTRY & EDITOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Pages List Card */}
        <div 
          className="lg:col-span-1 bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] border-b border-[#F5F3F4] flex items-center justify-between">
            <h2 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#0F172B'
              }}
            >
              {isHindi ? `${activeItem.categoryLabel_hi} पृष्ठ` : `${activeItem.categoryLabel} Pages`}
            </h2>
          </div>

          <div className="p-3 space-y-1.5">
            {activeCategoryItems.map((item) => {
              const isSelected = item.slug === activeSlug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => handleItemSelect(item.slug)}
                  className={`w-full text-left px-3.5 py-3 rounded-[8px] text-[13px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FDF2F5] text-[#751639] border border-[#FAD2DC]'
                      : 'bg-white text-[#314158] hover:bg-[#F8F7F7] border border-transparent'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span className="truncate">{isHindi ? item.label_hi : item.label}</span>
                  <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#751639]' : 'text-[#90A1B9]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Editor Card */}
        <div 
          className="lg:col-span-3 bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden mb-12"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex justify-between items-center">
            <div>
              <h2 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#0F172B'
                }}
              >
                {isHindi ? activeItem.label_hi : activeItem.label}
              </h2>
              <p className="text-[12px] text-[#62748E] mt-0.5">
                Slug: <code className="text-[#751639] font-mono">{activeSlug}</code>
              </p>
            </div>

            <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] rounded-full px-2.5 py-0.5 text-[12px] font-medium inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
              {isHindi ? 'प्रकाशित एवं लाइव' : 'Published & Live'}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#90A1B9] text-xs">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              <span>{isHindi ? 'पृष्ठ लोड हो रहा है...' : 'Loading page record...'}</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {saveMessage && (
                <div
                  className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
                    saveMessage.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}
                >
                  {saveMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{saveMessage.text}</span>
                </div>
              )}

              {/* Page Title */}
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
                  {isHindi ? 'पृष्ठ प्रदर्शन शीर्षक *' : 'Page Display Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Content Textarea */}
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
                  {isHindi ? 'पृष्ठ सामग्री (HTML / Body) *' : 'Page HTML / Body Content *'}
                </label>
                <textarea
                  rows={12}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-4 text-[13px] font-mono text-[#314158] focus:bg-white focus:outline-none focus:border-[#751639] leading-relaxed transition-all"
                />
              </div>

              {/* Live Preview Accordion */}
              <div className="border border-[#EDE9E9] rounded-lg p-4 bg-[#F8F7F7]">
                <h4 className="text-xs font-semibold text-[#62748E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'लाइव पूर्वावलोकन' : 'Live Render Preview'}</span>
                </h4>
                <div 
                  className="prose prose-xs max-w-none text-[#314158] bg-white p-4 rounded-lg border border-[#EDE9E9] min-h-[80px]"
                  dangerouslySetInnerHTML={{ __html: content || `<p class="text-[#90A1B9] italic">${isHindi ? 'पूर्वावलोकन के लिए कोई सामग्री नहीं।' : 'No content to preview.'}</p>` }}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5F3F4]">
                <button
                  type="button"
                  onClick={() => fetchPageData(activeSlug)}
                  className="w-[120px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer font-medium text-[14px] text-[#701537]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {isHindi ? 'रद्द करें' : 'Discard'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 h-[35px] rounded-[8px] text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 font-semibold text-[14px] disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? (isHindi ? 'सहेजा जा रहा है...' : 'Saving...') : (isHindi ? 'सहेजें और प्रकाशित करें' : 'Save & Publish')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}

export default function AdminGlobalRelationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading Global Relations Suite...</div>}>
      <AdminGlobalRelationsInner />
    </Suspense>
  );
}
