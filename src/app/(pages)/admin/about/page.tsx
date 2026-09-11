'use client';

import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { ALL_ABOUT_DB_RECORDS, AboutRecord } from '@/data/aboutAdminData';
import { 
  Landmark, UserCheck, Compass, GitBranch, Award, Library, Users, 
  Scale, ScrollText, BookOpen, Search, Filter, RotateCcw, ExternalLink, 
  Pencil, Eye, Plus, CheckCircle2, FileText, ChevronRight, Layers, 
  ArrowUpDown, X, Check, Globe, RefreshCw, AlertCircle, Trash2, Database
} from 'lucide-react';

function AdminAboutRegistryContent() {
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();

  const [records, setRecords] = useState<AboutRecord[]>([]);
  const [allAboutRecords, setAllAboutRecords] = useState<AboutRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cag_admin_about_records');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
        }
      } catch (e) {}
    }
    return ALL_ABOUT_DB_RECORDS;
  });

  const [totalCount, setTotalCount] = useState<number>(ALL_ABOUT_DB_RECORDS.length);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [loading, setLoading] = useState<boolean>(false);

  // ─── Filter States matching Reports & Accounts Figma UI ───
  const [searchFor, setSearchFor] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subTopicFilter, setSubTopicFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tableFilter, setTableFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('default');

  // Lookups & Subtopics grouped by Category (9 canonical About Us sections)
  const categories = ['Who We Are', 'Leadership & Legacy', 'Governance & Mandate'];
  const SUBTOPICS_BY_CATEGORY: Record<string, { label: string; value: string; defaultSlug: string; defaultUrl: string }[]> = {
    'Who We Are': [
      { label: 'CAG of India Profile', value: 'cag-of-india', defaultSlug: 'page-cag-of-india', defaultUrl: '/About/About-Us/Cag-Of-India' },
      { label: 'Our Vision, Mission & Core Values', value: 'our-vision-mission-values', defaultSlug: 'page-our-vision-mission-values', defaultUrl: '/About/About-Us/Our-Vision,-Mission-&-Core-Values' },
      { label: 'Organisation-Chart', value: 'organisation-chart', defaultSlug: 'organisation-chart', defaultUrl: '/About/About-Us/Organisation-Chart' },
    ],
    'Leadership & Legacy': [
      { label: 'Former CAGs Gallery', value: 'former-cags', defaultSlug: 'former-cags', defaultUrl: '/About/About-Us/Former-Comptroller-and-Auditors-General' },
      { label: 'History of IAAD', value: 'history-of-indian-audit-and-accounts-department', defaultSlug: 'page-history-of-indian-audit-and-accounts-department', defaultUrl: '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department' },
      { label: 'Audit-Advisory-Board', value: 'audit-advisory-board', defaultSlug: 'page-audit-advisory-board', defaultUrl: '/About/About-Us/Audit-Advisory-Board' },
    ],
    'Governance & Mandate': [
      { label: 'Constitutional-Provisions', value: 'constitutional-provisions', defaultSlug: 'page-constitutional-provisions', defaultUrl: '/About/About-Us/Constitutional-Provisions' },
      { label: 'Duties-&-Powers-Act', value: 'duties-power-and-conditions-of-services-act', defaultSlug: 'page-duties-power-and-conditions-of-services-act', defaultUrl: '/About/About-Us/Duties-&-Powers-Act' },
      { label: 'Audit-Regulation', value: 'cag-audit-regulations', defaultSlug: 'page-cag-audit-regulations', defaultUrl: '/About/About-Us/Audit-Regulation' },
    ]
  };
  const tables = [
    { label: 'All DB Tables (155)', value: 'All' },
    { label: 'cag_revamp.pages (19 Pages)', value: 'cag_revamp.pages' },
    { label: 'cag_revamp.former_cag (62 Records)', value: 'cag_revamp.former_cag' },
    { label: 'cag_revamp.organisation_chart (74 Officers)', value: 'cag_revamp.organisation_chart' },
  ];

  // Dynamic category and table counts from live state
  const categoryStats = useMemo(() => {
    return {
      total: allAboutRecords.length,
      whoWeAre: allAboutRecords.filter(r => r.category === 'Who We Are').length,
      leadership: allAboutRecords.filter(r => r.category === 'Leadership & Legacy').length,
      governance: allAboutRecords.filter(r => r.category === 'Governance & Mandate').length,
      pagesCount: allAboutRecords.filter(r => r.table_name.includes('pages')).length,
      formerCagCount: allAboutRecords.filter(r => r.table_name.includes('former_cag')).length,
      orgChartCount: allAboutRecords.filter(r => r.table_name.includes('organisation_chart')).length,
    };
  }, [allAboutRecords]);

  // Dynamic Sub-Topic options filtered strictly by current selected categoryFilter
  const subTopicOptions = useMemo(() => {
    if (categoryFilter === 'All') {
      const allList: { label: string; value: string }[] = [
        { label: `All Sub-Topics (${allAboutRecords.length})`, value: 'All' }
      ];
      categories.forEach((cat) => {
        (SUBTOPICS_BY_CATEGORY[cat] || []).forEach((st) => {
          const count = allAboutRecords.filter(r => 
            r.category === cat && (
              r.subTopicSlug.toLowerCase().includes(st.value.toLowerCase()) || 
              r.subTopic.toLowerCase().includes(st.value.toLowerCase()) ||
              r.subTopic.toLowerCase().includes(st.label.toLowerCase()) ||
              st.value.toLowerCase().includes(r.subTopicSlug.toLowerCase())
            )
          ).length;
          allList.push({
            label: `${st.label} (${count})`,
            value: st.value
          });
        });
      });
      return allList;
    }

    const currentList = SUBTOPICS_BY_CATEGORY[categoryFilter] || [];
    const catRecords = allAboutRecords.filter(r => r.category === categoryFilter);
    const result = [{ label: `All ${categoryFilter} Sub-Topics (${catRecords.length})`, value: 'All' }];

    currentList.forEach((st) => {
      const count = catRecords.filter(r => 
        r.subTopicSlug.toLowerCase().includes(st.value.toLowerCase()) || 
        r.subTopic.toLowerCase().includes(st.value.toLowerCase()) ||
        r.subTopic.toLowerCase().includes(st.label.toLowerCase()) ||
        st.value.toLowerCase().includes(r.subTopicSlug.toLowerCase())
      ).length;
      result.push({
        label: `${st.label} (${count})`,
        value: st.value
      });
    });

    return result;
  }, [categoryFilter, allAboutRecords]);

  // Sync URL Params
  useEffect(() => {
    const cat = searchParams.get('category');
    const topic = searchParams.get('topic');
    const tbl = searchParams.get('table');
    if (cat) setCategoryFilter(cat);
    if (topic) setSubTopicFilter(topic);
    if (tbl) setTableFilter(tbl);
    setPage(1);
  }, [searchParams]);

  // View Details Modal State
  const [viewingRecord, setViewingRecord] = useState<AboutRecord | null>(null);

  // Form State (Add / Edit Drawer)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRawId, setEditingRawId] = useState<string | null>(null);

  const [formCategory, setFormCategory] = useState<'Who We Are' | 'Leadership & Legacy' | 'Governance & Mandate'>('Who We Are');
  const [formSubTopic, setFormSubTopic] = useState('CAG of India Profile');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTable, setFormTable] = useState('cag_revamp.pages');
  const [formSlug, setFormSlug] = useState('page-custom');
  const [formPublicUrl, setFormPublicUrl] = useState('/About/About-Us/Cag-Of-India');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formThumbImage, setFormThumbImage] = useState('https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
  const [formLanguage, setFormLanguage] = useState<'EN' | 'HI' | 'Bilingual'>('Bilingual');
  const [formIsActive, setFormIsActive] = useState(true);

  // Load Data with Backend API & Fast In-Memory Fallback
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      // Try to query the backend API first
      const params = new URLSearchParams();
      params.set('table', 'about');
      params.set('page', page.toString());
      params.set('limit', pageSize.toString());
      if (appliedSearch.trim()) params.set('search', appliedSearch.trim());
      if (categoryFilter !== 'All') params.set('category', categoryFilter);
      if (subTopicFilter !== 'All') params.set('subtopic', subTopicFilter);
      if (tableFilter !== 'All') params.set('db_table', tableFilter);
      if (languageFilter !== 'All') params.set('language', languageFilter);
      if (statusFilter !== 'All') params.set('status', statusFilter);
      if (sortFilter !== 'default') params.set('sort', sortFilter);

      const res = await fetch(`${API_URL}/api/admin/crud?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.total !== undefined) {
          setRecords(json.data);
          setTotalCount(json.total);
          setTotalPages(json.totalPages || Math.ceil(json.total / pageSize) || 1);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API request failed, filtering local 155-record dataset:', err);
    }

    // Fallback: Perform local filtering across all 155 real database items
    let result = [...allAboutRecords];

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(r => r.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sub-topic filter
    if (subTopicFilter !== 'All') {
      const qTopic = subTopicFilter.toLowerCase();
      result = result.filter(r => 
        r.subTopicSlug.toLowerCase().includes(qTopic) ||
        r.subTopic.toLowerCase().includes(qTopic) ||
        r.rawId.toLowerCase().includes(qTopic)
      );
    }

    // Language filter
    if (languageFilter !== 'All') {
      result = result.filter(r => r.language === languageFilter);
    }

    // Status filter
    if (statusFilter !== 'All') {
      const act = statusFilter === 'Active';
      result = result.filter(r => r.is_active === act);
    }

    // Database Table filter
    if (tableFilter !== 'All') {
      result = result.filter(r => r.table_name.includes(tableFilter));
    }

    // Applied Search query
    if (appliedSearch.trim()) {
      const q = appliedSearch.toLowerCase();
      result = result.filter(r => 
        r.title_en.toLowerCase().includes(q) ||
        (r.title_hi && r.title_hi.toLowerCase().includes(q)) ||
        (r.desc && r.desc.toLowerCase().includes(q)) ||
        r.subTopic.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.formattedId.toLowerCase().includes(q) ||
        r.primary_key_or_slug.toLowerCase().includes(q) ||
        r.table_name.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortFilter === 'title_asc') {
      result.sort((a, b) => a.title_en.localeCompare(b.title_en));
    } else if (sortFilter === 'title_desc') {
      result.sort((a, b) => b.title_en.localeCompare(a.title_en));
    } else if (sortFilter === 'id_asc') {
      result.sort((a, b) => Number(a.id) - Number(b.id));
    } else if (sortFilter === 'id_desc') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortFilter === 'category_asc') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortFilter === 'newest') {
      result.sort((a, b) => b.modified_at.localeCompare(a.modified_at));
    } else if (sortFilter === 'oldest') {
      result.sort((a, b) => a.modified_at.localeCompare(b.modified_at));
    }

    setTotalCount(result.length);
    setTotalPages(Math.ceil(result.length / pageSize) || 1);
    setRecords(result.slice((page - 1) * pageSize, page * pageSize));
    setLoading(false);
  }, [API_URL, allAboutRecords, page, pageSize, appliedSearch, categoryFilter, subTopicFilter, languageFilter, statusFilter, tableFilter, sortFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
    setPage(1);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setCategoryFilter('All');
    setSubTopicFilter('All');
    setLanguageFilter('All');
    setStatusFilter('All');
    setTableFilter('All');
    setSortFilter('default');
    setPage(1);
  };

  const handleOpenView = (item: AboutRecord) => {
    setViewingRecord(item);
  };

  const handleOpenCreate = () => {
    setEditingRawId(null);
    setFormCategory('Who We Are');
    setFormSubTopic('CAG of India Profile');
    setFormTitleEn('');
    setFormTitleHi('');
    setFormDesc('');
    setFormTable('cag_revamp.pages');
    setFormSlug('page-new-section');
    setFormPublicUrl('/About/About-Us/Cag-Of-India');
    setFormFileUrl('');
    setFormFileName('');
    setFormThumbImage('https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
    setFormLanguage('Bilingual');
    setFormIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: AboutRecord) => {
    setEditingRawId(item.rawId);
    setFormCategory(item.category);
    setFormSubTopic(item.subTopic);
    setFormTitleEn(item.title_en);
    setFormTitleHi(item.title_hi || '');
    setFormDesc(item.desc || '');
    setFormTable(item.table_name);
    setFormSlug(item.primary_key_or_slug);
    setFormPublicUrl(item.public_url);
    setFormFileUrl(item.file_url || '');
    setFormFileName(item.file_name || '');
    setFormThumbImage(item.thumb_image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
    setFormLanguage(item.language);
    setFormIsActive(item.is_active);
    setIsFormOpen(true);
  };

  const handleDelete = async (rawId: string) => {
    if (!confirm('Are you sure you want to delete / archive this About Us record?')) return;
    try {
      await fetch(`${API_URL}/api/admin/crud?table=about&id=${encodeURIComponent(rawId)}`, {
        method: 'DELETE',
      });
    } catch (e) {}

    const updated = allAboutRecords.filter(r => r.rawId !== rawId);
    setAllAboutRecords(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_admin_about_records', JSON.stringify(updated));
    }
    if (viewingRecord?.rawId === rawId) setViewingRecord(null);
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRawId = editingRawId || `ab-${Date.now()}`;

    const newRecord: AboutRecord = {
      id: editingRawId ? (allAboutRecords.find(r => r.rawId === editingRawId)?.id || allAboutRecords.length + 1) : allAboutRecords.length + 1,
      rawId: targetRawId,
      formattedId: editingRawId ? (allAboutRecords.find(r => r.rawId === editingRawId)?.formattedId || `#AB-${String(allAboutRecords.length + 1).padStart(3, '0')}`) : `#AB-${String(allAboutRecords.length + 1).padStart(3, '0')}`,
      category: formCategory,
      subTopic: formSubTopic,
      subTopicSlug: formSubTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title_en: formTitleEn,
      title_hi: formTitleHi,
      desc: formDesc,
      table_name: formTable,
      primary_key_or_slug: formSlug,
      public_url: formPublicUrl,
      thumb_image: formThumbImage,
      file_url: formFileUrl,
      file_name: formFileName,
      language: formLanguage,
      is_active: formIsActive,
      item_count: 1,
      created_at: '01-Sep-2026 10:00 AM',
      modified_at: 'Just now (Updated)',
    };

    let updated: AboutRecord[];
    if (editingRawId) {
      updated = allAboutRecords.map(r => r.rawId === editingRawId ? newRecord : r);
      try {
        await fetch(`${API_URL}/api/admin/crud?table=about&id=${encodeURIComponent(editingRawId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        });
      } catch (e) {}
    } else {
      updated = [newRecord, ...allAboutRecords];
      try {
        await fetch(`${API_URL}/api/admin/crud?table=about`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        });
      } catch (e) {}
    }

    setAllAboutRecords(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_admin_about_records', JSON.stringify(updated));
    }

    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-4 text-xs text-zinc-700 font-sans">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">About Us Management</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Manage pages, former CAG profiles, and organisation hierarchy records.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/About/About-Us/Cag-Of-India"
              target="_blank"
              className="border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs rounded-none flex items-center gap-1.5 cursor-pointer bg-white"
            >
              <span>Live Public Portal ↗</span>
            </Link>
            <button
              onClick={handleOpenCreate}
              className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add New Section Record</span>
            </button>
          </div>
        </div>

        {/* Row 1: Search, Category, Sub-Topic, Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search within Title / Summary / Officer:</label>
            <input
              type="text"
              placeholder="e.g. Constitutional, DPC, Murmu, Director..."
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Hierarchy Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubTopicFilter('All');
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Categories (3 Tiers - {categoryStats.total})</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Sub-Topic / Section:</label>
            <select
              value={subTopicFilter}
              onChange={(e) => {
                setSubTopicFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              {subTopicOptions.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Content Language:</label>
            <select
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Languages</option>
              <option value="Bilingual">Bilingual (English + Hindi)</option>
              <option value="EN">English Only (EN)</option>
              <option value="HI">हिन्दी Only (HI)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Database Table, Publish Status, Sort By, Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 border-t border-zinc-150">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Database Table Source:</label>
            <select
              value={tableFilter}
              onChange={(e) => {
                setTableFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              {tables.map((tbl) => (
                <option key={tbl.value} value={tbl.value}>{tbl.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Publish Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active (Published)</option>
              <option value="Inactive">Inactive (Draft)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 font-bold mb-1">Sort Order:</label>
            <select
              value={sortFilter}
              onChange={(e) => {
                setSortFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="default">Default DB Order</option>
              <option value="id_asc">Record ID (Ascending)</option>
              <option value="id_desc">Record ID (Descending)</option>
              <option value="title_asc">Title / Name (A to Z)</option>
              <option value="title_desc">Title / Name (Z to A)</option>
              <option value="category_asc">Category (Hierarchy)</option>
              <option value="newest">Last Updated (Newest)</option>
              <option value="oldest">Last Updated (Oldest)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearchGo}
              className="flex-1 border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-4 py-1.5 rounded-none transition-colors font-bold bg-white cursor-pointer shadow-xs"
            >
              Apply Filter
            </button>
            <button
              onClick={handleSearchReset}
              className="px-4 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 py-1.5 rounded-none transition-colors font-medium bg-white cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Active Filter Summary Bar */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-100 gap-2">
          <span>
            Active Filter: <strong>{categoryFilter}</strong> | Sub-Topic: <strong>{subTopicFilter}</strong> | Table: <strong>{tableFilter}</strong> | Status: <strong>{statusFilter}</strong>
          </span>
          <span>
            Data Source: <strong className="text-emerald-700">PostgreSQL cag_db_final (155 DB Records)</strong>
          </span>
        </div>
      </div>

      {/* ─── 4. TABLE GRID PANEL (Figma Burgundy Header Gradient) ─── */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3 bg-[#fafbfc]">
          <h3 className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <span>About Us Section Registry</span>
            <span className="text-zinc-500 font-normal">[ Displaying {records.length} of {totalCount} records ]</span>
          </h3>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-zinc-300 px-2 py-1 bg-white text-zinc-800"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreate}
              className="text-white px-3.5 py-1.5 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add New Record</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-3 py-3 border-r border-white/20 w-16 text-center">#</th>
                <th className="px-3 py-3 border-r border-white/20 w-16 text-center">Thumb</th>
                <th className="px-4 py-3 border-r border-white/20 min-w-[280px]">About Us Title &amp; Summary</th>
                <th className="px-3 py-3 border-r border-white/20 w-36">Category</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Sub-Topic / Key</th>
                <th className="px-3 py-3 border-r border-white/20 w-36 font-mono">DB Table</th>
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Lang</th>
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-3 py-3 text-center w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving About Us records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-zinc-400">
                    No matching About Us records found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                records.map((item, idx) => (
                  <tr key={item.rawId ? `${item.rawId}-${item.id || idx}` : `about-${idx}`} className="hover:bg-zinc-50/70 transition-colors text-zinc-800">
                    {/* ID */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-500 font-bold text-[11px]">
                      {item.formattedId}
                    </td>

                    {/* Thumbnail */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <img 
                        src={item.thumb_image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'} 
                        alt="" 
                        className="h-9 w-12 object-cover border border-zinc-200 bg-gray-100 mx-auto shadow-2xs" 
                      />
                    </td>

                    {/* Title & Summary */}
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">
                      <div 
                        className="line-clamp-1 cursor-pointer hover:underline text-sm" 
                        onClick={() => handleOpenView(item)} 
                        title="Click to view full record details"
                      >
                        {item.title_en}
                      </div>
                      {item.title_hi && (
                        <div className="text-[11px] text-zinc-500 font-normal font-hindi line-clamp-1 mt-0.5">
                          {item.title_hi}
                        </div>
                      )}
                      {item.desc && (
                        <div className="text-[11px] text-zinc-500 font-normal mt-0.5 line-clamp-1">
                          {item.desc}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] font-medium text-zinc-700">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-block ${
                        item.category === 'Who We Are' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        item.category === 'Leadership & Legacy' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Sub-Topic / Slug */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] font-medium text-zinc-700">
                      <div className="font-bold text-zinc-800 line-clamp-1">{item.subTopic}</div>
                      <div className="text-[10px] text-zinc-400 font-mono truncate">{item.primary_key_or_slug}</div>
                    </td>

                    {/* DB Table */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] font-mono text-[11px] text-zinc-600">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        item.table_name.includes('pages') ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        item.table_name.includes('former_cag') ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {item.table_name.replace('cag_revamp.', '')}
                      </span>
                    </td>

                    {/* Language */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center text-zinc-600 font-semibold text-[11px]">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px]">
                        {item.language}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 text-center space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenView(item)}
                        className="p-1 border border-emerald-300 hover:bg-emerald-50 text-emerald-700 inline-flex items-center justify-center w-7 h-7 text-xs cursor-pointer shadow-2xs"
                        title="View Full Record Details"
                      >
                        👁️
                      </button>

                      <Link
                        href={item.public_url}
                        target="_blank"
                        className="p-1 border border-blue-200 hover:bg-blue-50 text-blue-600 inline-flex items-center justify-center w-7 h-7 text-xs shadow-2xs"
                        title="Preview Public Page ↗"
                      >
                        ↗
                      </Link>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7 text-xs cursor-pointer shadow-2xs"
                        title="Edit Record"
                      >
                        📝
                      </button>

                      <button
                        onClick={() => handleDelete(item.rawId)}
                        className="p-1 border border-red-200 hover:bg-red-50 text-red-600 inline-flex items-center justify-center w-7 h-7 text-xs cursor-pointer shadow-2xs"
                        title="Delete / Archive Record"
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

        {/* ─── Pagination Bar ─── */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#e2e5e7] bg-[#fafbfc] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total records)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11px]"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11px]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── 5. VIEW DETAILS MODAL ─── */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full border border-zinc-300 shadow-2xl p-6 rounded-none animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#751639] text-white flex items-center justify-center font-bold text-sm">
                  {viewingRecord.formattedId.replace('#AB-', '')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#751639]">{viewingRecord.title_en}</h3>
                  <p className="text-xs text-zinc-500 font-hindi">{viewingRecord.title_hi}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 pt-4 text-xs">
              {/* Category & Sub-Topic */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-3 border border-zinc-200">
                <div>
                  <span className="text-zinc-400 block font-bold">Hierarchy Category:</span>
                  <span className="font-bold text-zinc-800">{viewingRecord.category}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-bold">Sub-Topic Section:</span>
                  <span className="font-bold text-zinc-800">{viewingRecord.subTopic}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-zinc-400 block font-bold mb-1">Executive Summary / Description:</span>
                <p className="bg-zinc-50 p-3 border border-zinc-200 text-zinc-700 leading-relaxed font-normal">
                  {viewingRecord.desc}
                </p>
              </div>

              {/* Database & Technical Info */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-3 border border-zinc-200">
                <div>
                  <span className="text-zinc-400 block font-bold">Database Table:</span>
                  <span className="font-mono text-zinc-800 font-semibold">{viewingRecord.table_name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-bold">Record Slug / Key:</span>
                  <span className="font-mono text-zinc-800 truncate block">{viewingRecord.primary_key_or_slug}</span>
                </div>
              </div>

              {/* Attachment File */}
              {viewingRecord.file_url && (
                <div className="bg-blue-50/70 border border-blue-200 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-900">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span className="font-bold">{viewingRecord.file_name || 'Attached Reference Document (PDF)'}</span>
                  </div>
                  <a
                    href={viewingRecord.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-none text-xs"
                  >
                    Open PDF ↗
                  </a>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-150">
                <span>Created: {viewingRecord.created_at}</span>
                <span>Last Modified: {viewingRecord.modified_at}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-5 border-t border-zinc-200 mt-5">
              <Link
                href={viewingRecord.public_url}
                target="_blank"
                className="px-4 py-2 border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white font-bold rounded-none transition-colors"
              >
                Open Public Page ↗
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const item = viewingRecord;
                    setViewingRecord(null);
                    handleOpenEdit(item);
                  }}
                  className="px-4 py-2 bg-[#751639] hover:bg-[#5a102c] text-white font-bold rounded-none"
                >
                  Edit This Record 📝
                </button>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="px-4 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-medium rounded-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. CREATE / EDIT FORM DRAWER (Figma Burgundy Styling) ─── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-xl shadow-2xl p-6 border-l border-zinc-300 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="font-bold text-lg text-[#751639]">
                  {editingRawId ? 'Edit About Us Record' : 'Add New About Us Record'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
                {/* Hierarchy Category */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Hierarchy Category:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as any;
                      setFormCategory(newCat);
                      const defTopic = SUBTOPICS_BY_CATEGORY[newCat]?.[0];
                      if (defTopic) {
                        setFormSubTopic(defTopic.label);
                        setFormSlug(defTopic.defaultSlug);
                        setFormPublicUrl(defTopic.defaultUrl);
                      }
                    }}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="Who We Are">Who We Are</option>
                    <option value="Leadership & Legacy">Leadership & Legacy</option>
                    <option value="Governance & Mandate">Governance & Mandate</option>
                  </select>
                </div>

                {/* Sub-Topic Section */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Sub-Topic / Section:</label>
                  <select
                    value={formSubTopic}
                    onChange={(e) => {
                      const topicLabel = e.target.value;
                      setFormSubTopic(topicLabel);
                      const found = (SUBTOPICS_BY_CATEGORY[formCategory] || []).find(st => st.label === topicLabel);
                      if (found) {
                        setFormSlug(found.defaultSlug);
                        setFormPublicUrl(found.defaultUrl);
                      }
                    }}
                    required
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    {(SUBTOPICS_BY_CATEGORY[formCategory] || []).map(st => (
                      <option key={st.value} value={st.label}>{st.label}</option>
                    ))}
                  </select>
                </div>

                {/* English Title */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Record Title / Officer Name (English):</label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    required
                    placeholder="Enter full English title or officer name"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* Hindi Title */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Record Title / Officer Name (हिन्दी):</label>
                  <input
                    type="text"
                    value={formTitleHi}
                    onChange={(e) => setFormTitleHi(e.target.value)}
                    placeholder="Enter Hindi title or officer name"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639] font-hindi"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Executive Summary / Overview / Designation:</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Enter summary description"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* Database Table & Slug */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Database Table:</label>
                    <input
                      type="text"
                      value={formTable}
                      onChange={(e) => setFormTable(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Key / Slug / Hierarchy:</label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Public URL & Document Link */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Public URL:</label>
                    <input
                      type="text"
                      value={formPublicUrl}
                      onChange={(e) => setFormPublicUrl(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Document Attachment URL:</label>
                    <input
                      type="text"
                      value={formFileUrl}
                      onChange={(e) => setFormFileUrl(e.target.value)}
                      placeholder="https://.../document.pdf"
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Language & Publish Status */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Language Mode:</label>
                    <select
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value as any)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850"
                    >
                      <option value="Bilingual">Bilingual (EN + HI)</option>
                      <option value="EN">English Only</option>
                      <option value="HI">Hindi Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-bold mb-1">Publish Status:</label>
                    <select
                      value={formIsActive ? 'Active' : 'Inactive'}
                      onChange={(e) => setFormIsActive(e.target.value === 'Active')}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850"
                    >
                      <option value="Active">Active (Published)</option>
                      <option value="Inactive">Inactive (Draft)</option>
                    </select>
                  </div>
                </div>

                {/* Drawer Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-medium rounded-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-white font-bold rounded-none shadow-xs cursor-pointer"
                    style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                  >
                    {editingRawId ? 'Save Changes' : 'Create Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAboutRegistry() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639] font-medium">Loading About Us Admin Registry...</div>}>
      <AdminAboutRegistryContent />
    </Suspense>
  );
}
