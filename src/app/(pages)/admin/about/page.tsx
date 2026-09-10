'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { 
  Landmark, UserCheck, Compass, GitBranch, Award, Library, Users, 
  Scale, ScrollText, BookOpen, Search, Filter, RotateCcw, ExternalLink, 
  Pencil, Eye, Plus, CheckCircle2, FileText, ChevronRight, Layers, 
  ArrowUpDown, X, Check, Globe, RefreshCw, AlertCircle, Trash2
} from 'lucide-react';

export interface AboutRecord {
  id: number | string;
  rawId: string;
  formattedId: string;
  category: 'Who We Are' | 'Leadership & Legacy' | 'Governance & Mandate';
  subTopic: string;
  subTopicSlug: string;
  title_en: string;
  title_hi?: string;
  desc?: string;
  table_name: string;
  primary_key_or_slug: string;
  public_url: string;
  thumb_image?: string;
  file_url?: string;
  file_name?: string;
  language: 'EN' | 'HI' | 'Bilingual';
  is_active: boolean;
  item_count?: number;
  created_at: string;
  modified_at: string;
}

const INITIAL_ABOUT_RECORDS: AboutRecord[] = [
  // ─── 1. Who We Are ───
  {
    id: 1,
    rawId: 'cag-of-india',
    formattedId: '#AB-001',
    category: 'Who We Are',
    subTopic: 'CAG of India Profile',
    subTopicSlug: 'cag-of-india',
    title_en: 'Profile of Comptroller and Auditor General of India',
    title_hi: 'भारत के नियंत्रक एवं महालेखापरीक्षक का जीवन वृत्त एवं कार्यभार',
    desc: 'Biographical profile, career milestones, statutory responsibilities, and constitutional role of Shri K. Sanjay Murthy, Comptroller and Auditor General of India.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-cag-of-india (ID: 17)',
    public_url: '/About/About-Us/Cag-Of-India',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/cag-profile-document.pdf',
    file_name: 'cag-profile-official-gazette.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '01-Sep-2026 10:00 AM',
    modified_at: '09-Sep-2026 04:30 PM',
  },
  {
    id: 2,
    rawId: 'our-vision-mission-values',
    formattedId: '#AB-002',
    category: 'Who We Are',
    subTopic: 'Our Vision, Mission & Core Values',
    subTopicSlug: 'our-vision-mission-values',
    title_en: 'Vision, Mission and Core Values of IA&AD',
    title_hi: 'भारतीय लेखापरीक्षा और लेखा विभाग का विजन, मिशन और मूल मूल्य',
    desc: 'Constitutional vision, mission statement, and core institutional values: Independence, Objectivity, Integrity, Reliability, Professional Excellence, Transparency, Positive Approach.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-our-vision-mission-values (ID: 10)',
    public_url: '/About/About-Us/Our-Vision,-Mission-&-Core-Values',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/vision-mission-values.pdf',
    file_name: 'iaad-vision-mission-charter.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '01-Sep-2026 10:00 AM',
    modified_at: '08-Sep-2026 11:15 AM',
  },
  {
    id: 3,
    rawId: 'organisation-chart',
    formattedId: '#AB-003',
    category: 'Who We Are',
    subTopic: 'Organisation-Chart',
    subTopicSlug: 'organisation-chart',
    title_en: 'Executive Hierarchy & Headquarters Leadership Directory',
    title_hi: 'संगठन संरचना, पदानुक्रम एवं वरिष्ठ अधिकारी निर्देशिका',
    desc: 'Complete organizational tree from Level 0 (CAG) through Level 1 (Secretary), Level 2 (Deputy CAGs), Level 3 (Addl. Deputy CAGs), and Level 4 (Directors General & Principal Directors).',
    table_name: 'cag_revamp.organisation_chart',
    primary_key_or_slug: 'Hierarchy Levels 0 to 4 (12 Officers)',
    public_url: '/About/About-Us/Organisation-Chart',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/cag-organisation-chart.pdf',
    file_name: 'iaad-headquarters-org-chart-2026.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 12,
    created_at: '02-Sep-2026 09:30 AM',
    modified_at: '09-Sep-2026 06:10 PM',
  },

  // ─── 2. Leadership & Legacy ───
  {
    id: 4,
    rawId: 'former-cags',
    formattedId: '#AB-004',
    category: 'Leadership & Legacy',
    subTopic: 'Former CAGs Gallery',
    subTopicSlug: 'former-cags',
    title_en: 'Historical Gallery & Biographies of Former CAGs',
    titleHi: 'पूर्व नियंत्रक एवं महालेखापरीक्षक ऐतिहासिक दीर्घा (1948 से वर्तमान)',
    desc: 'Archive and photo gallery documenting all past Comptrollers and Auditors General of Independent India from Shri V. Narahari Rao (1948) to Shri Girish Chandra Murmu (2024).',
    table_name: 'cag_revamp.former_cag',
    primary_key_or_slug: '15 Former CAGs Gallery Records',
    public_url: '/About/About-Us/Former-Comptroller-and-Auditors-General',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/former-cags-compendium.pdf',
    file_name: 'former-cags-tenure-compendium.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 15,
    created_at: '02-Sep-2026 11:00 AM',
    modified_at: '07-Sep-2026 02:45 PM',
  },
  {
    id: 5,
    rawId: 'history-of-iaad',
    formattedId: '#AB-005',
    category: 'Leadership & Legacy',
    subTopic: 'History of IAAD',
    subTopicSlug: 'history-of-indian-audit-and-accounts-department',
    title_en: 'Historical Evolution of Indian Audit & Accounts Department',
    title_hi: 'भारतीय लेखापरीक्षा और लेखा विभाग का गौरवशाली इतिहास (1858 से अब तक)',
    desc: 'Comprehensive chronicle from the establishment of the Office of the Auditor General of India in 1858, transformation under the Montagu-Chelmsford reforms and GoI Act 1935, to the modern digital SAI.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-history-of-indian-audit-and-accounts-department (ID: 41)',
    public_url: '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/history-of-iaad.pdf',
    file_name: 'history-of-iaad-evolution-monograph.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '03-Sep-2026 02:15 PM',
    modified_at: '05-Sep-2026 09:20 AM',
  },
  {
    id: 6,
    rawId: 'audit-advisory-board',
    formattedId: '#AB-006',
    category: 'Leadership & Legacy',
    subTopic: 'Audit-Advisory-Board',
    subTopicSlug: 'audit-advisory-board',
    title_en: 'Audit Advisory Board Constitution & Strategic Terms',
    title_hi: 'लेखापरीक्षा सलाहकार बोर्ड का गठन, कार्यक्षेत्र एवं विचारार्थ विषय',
    desc: 'Constitutional advisory council comprising eminent external experts in public finance, governance, law, and administration providing strategic guidance on emerging audit priorities.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-audit-advisory-board (ID: 40)',
    public_url: '/About/About-Us/Audit-Advisory-Board',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/audit-advisory-board-notification.pdf',
    file_name: 'audit-advisory-board-gazette-notification.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '03-Sep-2026 04:00 PM',
    modified_at: '04-Sep-2026 03:00 PM',
  },

  // ─── 3. Governance & Mandate ───
  {
    id: 7,
    rawId: 'constitutional-provisions',
    formattedId: '#AB-007',
    category: 'Governance & Mandate',
    subTopic: 'Constitutional-Provisions',
    subTopicSlug: 'constitutional-provisions',
    title_en: 'Constitutional Provisions: Articles 148, 149, 150 & 151',
    title_hi: 'संवैधानिक प्रावधान: अनुच्छेद 148, 149, 150 एवं 151',
    desc: 'Foundational provisions of Part V, Chapter V of the Constitution of India establishing independence, conditions of service, duties, accounts format, and submission of audit reports to Parliament.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-constitutional-provisions (ID: 2)',
    public_url: '/About/About-Us/Constitutional-Provisions',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/constitutional-provisions-cag.pdf',
    file_name: 'constitution-of-india-cag-articles.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '04-Sep-2026 10:30 AM',
    modified_at: '09-Sep-2026 12:00 PM',
  },
  {
    id: 8,
    rawId: 'duties-powers-act',
    formattedId: '#AB-008',
    category: 'Governance & Mandate',
    subTopic: 'Duties-&-Powers-Act',
    subTopicSlug: 'duties-power-and-conditions-of-services-act',
    title_en: 'CAG\'s (Duties, Powers & Conditions of Service) Act, 1971',
    title_hi: 'सीएजी (कर्तव्य, शक्तियां और सेवा की शर्तें) अधिनियम, 1971 (DPC Act)',
    desc: 'Parliamentary enactment (Act No. 56 of 1971) defining comprehensive audit jurisdiction, compilation of accounts, audit of receipts, stores, grants, and corporations.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-duties-power-and-conditions-of-services-act (ID: 3)',
    public_url: '/About/About-Us/Duties-&-Powers-Act',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/cag-dpc-act-1971.pdf',
    file_name: 'cag-dpc-act-1971-bare-act.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '04-Sep-2026 11:45 AM',
    modified_at: '08-Sep-2026 05:15 PM',
  },
  {
    id: 9,
    rawId: 'cag-audit-regulations',
    formattedId: '#AB-009',
    category: 'Governance & Mandate',
    subTopic: 'Audit-Regulation',
    subTopicSlug: 'cag-audit-regulations',
    title_en: 'Regulations on Audit and Accounts (Official Gazette 2020)',
    title_hi: 'लेखापरीक्षा एवं लेखा विनियम (आधिकारिक राजपत्र अधिसूचना 2020)',
    desc: 'Notified statutory regulations on Audit and Accounts under Section 23 of the CAG\'s (DPC) Act, 1971 guiding audit scope, evidence, standards, responses, and reporting mechanisms.',
    table_name: 'cag_revamp.pages',
    primary_key_or_slug: 'page-cag-audit-regulations (ID: 6685)',
    public_url: '/About/About-Us/Audit-Regulation',
    thumb_image: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    file_url: 'https://cag.gov.in/uploads/media/cag-audit-regulations-2020.pdf',
    file_name: 'regulations-on-audit-and-accounts-2020.pdf',
    language: 'Bilingual',
    is_active: true,
    item_count: 1,
    created_at: '04-Sep-2026 01:20 PM',
    modified_at: '07-Sep-2026 01:10 PM',
  },
];

export default function AdminAboutRegistry() {
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();

  const [records, setRecords] = useState<AboutRecord[]>(INITIAL_ABOUT_RECORDS);
  const [totalCount, setTotalCount] = useState(INITIAL_ABOUT_RECORDS.length);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // ─── Filter States matching Reports & Accounts Figma UI ───
  const [searchFor, setSearchFor] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subTopicFilter, setSubTopicFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tableFilter, setTableFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('default');

  // Lookups
  const categories = ['Who We Are', 'Leadership & Legacy', 'Governance & Mandate'];
  const subTopics = [
    { label: 'CAG of India Profile', value: 'cag-of-india' },
    { label: 'Our Vision, Mission & Core Values', value: 'our-vision-mission-values' },
    { label: 'Organisation-Chart', value: 'organisation-chart' },
    { label: 'Former CAGs Gallery', value: 'former-cags' },
    { label: 'History of IAAD', value: 'history-of-indian-audit-and-accounts-department' },
    { label: 'Audit-Advisory-Board', value: 'audit-advisory-board' },
    { label: 'Constitutional-Provisions', value: 'constitutional-provisions' },
    { label: 'Duties-&-Powers-Act', value: 'duties-power-and-conditions-of-services-act' },
    { label: 'Audit-Regulation', value: 'cag-audit-regulations' },
  ];
  const tables = ['cag_revamp.pages', 'cag_revamp.former_cag', 'cag_revamp.organisation_chart'];

  // Sync URL Params
  useEffect(() => {
    const cat = searchParams.get('category');
    const topic = searchParams.get('topic');
    if (cat) setCategoryFilter(cat);
    if (topic) setSubTopicFilter(topic);
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

  // Load / Filter Data
  const loadData = () => {
    setLoading(true);

    let result = [...INITIAL_ABOUT_RECORDS];

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(r => r.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sub-topic filter
    if (subTopicFilter !== 'All') {
      result = result.filter(r => 
        r.subTopicSlug.toLowerCase() === subTopicFilter.toLowerCase() ||
        r.subTopic.toLowerCase() === subTopicFilter.toLowerCase() ||
        r.rawId.toLowerCase() === subTopicFilter.toLowerCase()
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
        r.primary_key_or_slug.toLowerCase().includes(q)
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
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, appliedSearch, categoryFilter, subTopicFilter, languageFilter, statusFilter, tableFilter, sortFilter]);

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

  const handleDelete = (rawId: string) => {
    if (!confirm('Are you sure you want to delete / archive this About Us section record?')) return;
    setRecords(prev => prev.filter(r => r.rawId !== rawId));
    setTotalCount(prev => Math.max(0, prev - 1));
    if (viewingRecord?.rawId === rawId) setViewingRecord(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRawId = editingRawId || `ab-${Date.now()}`;

    const newRecord: AboutRecord = {
      id: editingRawId ? (records.find(r => r.rawId === editingRawId)?.id || records.length + 1) : records.length + 1,
      rawId: targetRawId,
      formattedId: editingRawId ? (records.find(r => r.rawId === editingRawId)?.formattedId || `#AB-${String(records.length + 1).padStart(3, '0')}`) : `#AB-${String(records.length + 1).padStart(3, '0')}`,
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

    if (editingRawId) {
      setRecords(prev => prev.map(r => r.rawId === editingRawId ? newRecord : r));
    } else {
      setRecords(prev => [newRecord, ...prev]);
      setTotalCount(prev => prev + 1);
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ─── 1. TOP HEADER BANNER (Figma Burgundy Left-Border) ─── */}
      <div className="px-6 py-4 bg-white border border-[#ced4da] border-l-4 border-l-[#751639] rounded-none shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#751639] tracking-tight flex items-center gap-2">
            <span>About Us Management Registry</span>
            <span className="text-xs bg-[#751639]/10 text-[#751639] font-bold px-2.5 py-0.5 rounded-none uppercase tracking-wider">
              3 Tiers • 9 Subpages
            </span>
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Admin Registry for Who We Are, Leadership &amp; Legacy, and Governance &amp; Mandate statutory pages
          </p>
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

      {/* ─── 2. FIGMA 2-ROW FILTER & SORT CONTROL PANEL ─── */}
      <div className="bg-white p-5 border border-[#ced4da] rounded-none shadow-xs space-y-4 text-xs">
        {/* Row 1: Search, Category, Sub-Topic, Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search within Title / Summary:</label>
            <input
              type="text"
              placeholder="e.g. Constitutional, DPC Act, Vision..."
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
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Categories (3 Tiers)</option>
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
              <option value="All">All 9 Subpages</option>
              {subTopics.map((st) => (
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
            <label className="block text-zinc-700 font-bold mb-1">Database Table:</label>
            <select
              value={tableFilter}
              onChange={(e) => {
                setTableFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All DB Tables</option>
              {tables.map((tbl) => (
                <option key={tbl} value={tbl}>{tbl}</option>
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
              <option value="default">Default Registry Order</option>
              <option value="id_asc">Section ID (Ascending)</option>
              <option value="id_desc">Section ID (Descending)</option>
              <option value="title_asc">Title (A to Z)</option>
              <option value="title_desc">Title (Z to A)</option>
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
            Active Filter: <strong>{categoryFilter}</strong> | Sub-Topic: <strong>{subTopicFilter}</strong> | Status: <strong>{statusFilter}</strong> | Sort: <strong>{sortFilter}</strong>
          </span>
          <span>
            Data Source: <strong className="text-emerald-700">PostgreSQL cag_db_final (pages, former_cag, organisation_chart)</strong>
          </span>
        </div>
      </div>

      {/* ─── 3. TABLE GRID PANEL (Figma Burgundy Header Gradient) ─── */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3 bg-[#fafbfc]">
          <h3 className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <span>About Us Section Registry</span>
            <span className="text-zinc-500 font-normal">[ Displaying {records.length} of {totalCount} records ]</span>
          </h3>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="text-white px-3.5 py-1.5 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <span>+ Add New Section Record</span>
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
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Thumb</th>
                <th className="px-4 py-3 border-r border-white/20 min-w-[280px]">About Us Title &amp; Summary</th>
                <th className="px-3 py-3 border-r border-white/20 w-36">Category</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Sub-Topic / Slug</th>
                <th className="px-3 py-3 border-r border-white/20 w-32 font-mono">DB Table</th>
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
                      <span>Retrieving About Us records...</span>
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
                records.map((item) => (
                  <tr key={item.rawId} className="hover:bg-zinc-50/70 transition-colors text-zinc-800">
                    {/* ID */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-500 font-bold text-[11px]">
                      {item.formattedId}
                    </td>

                    {/* Thumbnail */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <img 
                        src={item.thumb_image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'} 
                        alt="" 
                        className="h-9 w-14 object-cover border border-zinc-200 bg-gray-100 mx-auto shadow-2xs" 
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
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-zinc-700">{item.table_name.replace('cag_revamp.', '')}</span>
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
                        title="View Full Section Details"
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

      {/* ─── 4. VIEW DETAILS DRAWER / MODAL ─── */}
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

      {/* ─── 5. CREATE / EDIT FORM DRAWER (Figma Burgundy Styling) ─── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-xl shadow-2xl p-6 border-l border-zinc-300 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h3 className="font-bold text-lg text-[#751639]">
                  {editingRawId ? 'Edit About Us Section Record' : 'Add New About Us Section Record'}
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
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="Who We Are">Who We Are</option>
                    <option value="Leadership & Legacy">Leadership & Legacy</option>
                    <option value="Governance & Mandate">Governance & Mandate</option>
                  </select>
                </div>

                {/* Sub-Topic Section */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Sub-Topic / Subpage:</label>
                  <input
                    type="text"
                    value={formSubTopic}
                    onChange={(e) => setFormSubTopic(e.target.value)}
                    required
                    placeholder="e.g. Constitutional-Provisions"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* English Title */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Section Title (English):</label>
                  <input
                    type="text"
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    required
                    placeholder="Enter full English title"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                {/* Hindi Title */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Section Title (हिन्दी):</label>
                  <input
                    type="text"
                    value={formTitleHi}
                    onChange={(e) => setFormTitleHi(e.target.value)}
                    placeholder="Enter Hindi title"
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-2 text-zinc-850 focus:outline-none focus:border-[#751639] font-hindi"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">Executive Summary / Overview:</label>
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
                    <label className="block text-zinc-700 font-bold mb-1">Key / Slug:</label>
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
