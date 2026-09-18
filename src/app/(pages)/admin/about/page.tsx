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
  ArrowUpDown, X, Check, Globe, RefreshCw, AlertCircle, Trash2, Database, Shield,
  Upload, Image as ImageIcon, Paperclip, FileUp, Lock, Sparkles
} from 'lucide-react';
import VisualDocumentEditor from './VisualDocumentEditor';

export const SINGLETON_SUBTOPICS = [
  'cag-of-india',
  'our-vision-mission-values',
  'constitutional-provisions',
  'duties-power-and-conditions-of-services-act'
];

function AdminAboutRegistryContent() {
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();

  const [records, setRecords] = useState<AboutRecord[]>([]);
  const [visualEditingRecord, setVisualEditingRecord] = useState<AboutRecord | null>(null);
  const [allAboutRecords, setAllAboutRecords] = useState<AboutRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cag_admin_about_records');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
        }
      } catch (e) { }
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
  const [sortFilter, setSortFilter] = useState('newest');

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

  // Form State (Add / Edit Modal)
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

  // File Upload State
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Subtopic-Specific Dynamic Form States
  // 1. Organisation Chart States
  const [formPrefix, setFormPrefix] = useState('Shri');
  const [formDesignationEn, setFormDesignationEn] = useState('Deputy Comptroller & Auditor General');
  const [formDesignationHi, setFormDesignationHi] = useState('उप नियंत्रक एवं महालेखापरीक्षक');
  const [formDepartmentEn, setFormDepartmentEn] = useState('');
  const [formDepartmentHi, setFormDepartmentHi] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formReportingOfficesEn, setFormReportingOfficesEn] = useState('');
  const [formReportingOfficesHi, setFormReportingOfficesHi] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);

  // 2. Former CAG States
  const [formTenureFrom, setFormTenureFrom] = useState('');
  const [formTenureTo, setFormTenureTo] = useState('');
  const [formLegacyTitle, setFormLegacyTitle] = useState('Former Comptroller and Auditor General of India');

  // 3. History of IAAD States
  const [formHistoryVolume, setFormHistoryVolume] = useState('Analytical History 1947-1989');
  const [formChapterNumber, setFormChapterNumber] = useState('Ch 1');

  // 4. Audit Advisory Board States
  const [formBoardType, setFormBoardType] = useState<'Member Profile' | 'Board Term Session'>('Member Profile');
  const [formMemberExpertiseEn, setFormMemberExpertiseEn] = useState('');
  const [formMemberExpertiseHi, setFormMemberExpertiseHi] = useState('');

  // 5. Audit Regulations States
  const [formRegulationClass, setFormRegulationClass] = useState('Regulations on Audit & Accounts');
  const [formGazetteRef, setFormGazetteRef] = useState('');
  const [formGazetteYear, setFormGazetteYear] = useState('2020');

  const docInputRef = React.useRef<HTMLInputElement>(null);
  const imgInputRef = React.useRef<HTMLInputElement>(null);

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'file');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormFileUrl(data.url);
        setFormFileName(data.name || file.name);
      } else {
        const err = await res.json();
        setUploadError(err.error || 'Failed to upload document');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Document upload failed');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setFormThumbImage(data.url);
      } else {
        const err = await res.json();
        setUploadError(err.error || 'Failed to upload image');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

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
    setSortFilter('newest');
    setPage(1);
  };

  const handleOpenView = (item: AboutRecord) => {
    setViewingRecord(item);
  };

  const handleOpenCreate = () => {
    setEditingRawId(null);
    const activeSub = subTopicFilter !== 'All' ? subTopicFilter : 'cag-of-india';
    
    // Determine category and subtopic based on active subtopic filter
    let cat: 'Who We Are' | 'Leadership & Legacy' | 'Governance & Mandate' = 'Who We Are';
    let sub = 'Organisation-Chart';
    let defUrl = '/About/About-Us/Organisation-Chart';
    let tbl = 'cag_revamp.organisation_chart';

    if (activeSub === 'former-cags' || categoryFilter === 'Leadership & Legacy') {
      cat = 'Leadership & Legacy';
      sub = 'Former CAGs Gallery';
      defUrl = '/About/About-Us/Former-Comptroller-and-Auditors-General';
      tbl = 'cag_revamp.former_cag';
    } else if (activeSub === 'history-of-indian-audit-and-accounts-department') {
      cat = 'Leadership & Legacy';
      sub = 'History of IAAD';
      defUrl = '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department';
      tbl = 'cag_revamp.pages';
    } else if (activeSub === 'audit-advisory-board') {
      cat = 'Leadership & Legacy';
      sub = 'Audit-Advisory-Board';
      defUrl = '/About/About-Us/Audit-Advisory-Board';
      tbl = 'cag_revamp.pages';
    } else if (activeSub === 'cag-audit-regulations' || categoryFilter === 'Governance & Mandate') {
      cat = 'Governance & Mandate';
      sub = 'Audit-Regulation';
      defUrl = '/About/About-Us/Audit-Regulation';
      tbl = 'cag_revamp.pages';
    }

    setFormCategory(cat);
    setFormSubTopic(sub);
    setFormTitleEn('');
    setFormTitleHi('');
    setFormDesc('');
    setFormTable(tbl);
    setFormSlug(`record-${Date.now()}`);
    setFormPublicUrl(defUrl);
    setFormFileUrl('');
    setFormFileName('');
    setFormThumbImage('https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
    setFormLanguage('Bilingual');
    setFormIsActive(true);

    // Subtopic defaults
    setFormPrefix('Shri');
    setFormDesignationEn('Deputy Comptroller & Auditor General');
    setFormDesignationHi('उप नियंत्रक एवं महालेखापरीक्षक');
    setFormDepartmentEn('');
    setFormDepartmentHi('');
    setFormEmail('');
    setFormPhone('');
    setFormReportingOfficesEn('');
    setFormReportingOfficesHi('');
    setFormDisplayOrder(1);
    setFormTenureFrom('2024');
    setFormTenureTo('2029');
    setFormLegacyTitle('Former Comptroller and Auditor General of India');
    setFormHistoryVolume('Analytical History 1947-1989');
    setFormChapterNumber('Ch 1');
    setFormBoardType('Member Profile');
    setFormMemberExpertiseEn('');
    setFormMemberExpertiseHi('');
    setFormRegulationClass('Regulations on Audit & Accounts');
    setFormGazetteRef('');
    setFormGazetteYear('2020');

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

    // Populate subtopic specific attributes
    setFormPrefix(item.prefix_name || 'Shri');
    setFormDesignationEn(item.designation_display_name || '');
    setFormDesignationHi(item.designation_hi || '');
    setFormDepartmentEn(item.department || '');
    setFormDepartmentHi(item.department_hi || '');
    setFormEmail(item.email || '');
    setFormPhone(item.mobile_no || '');
    setFormReportingOfficesEn(item.reporting_offices || '');
    setFormReportingOfficesHi(item.reporting_offices_hi || '');
    setFormDisplayOrder(item.display_order || 1);
    setFormTenureFrom(item.tenure_from || '');
    setFormTenureTo(item.tenure_to || '');
    setFormLegacyTitle(item.legacy_title || 'Former Comptroller and Auditor General of India');
    setFormHistoryVolume(item.history_volume || 'Analytical History 1947-1989');
    setFormChapterNumber(item.chapter_number || 'Ch 1');
    setFormBoardType(item.member_expertise ? 'Member Profile' : 'Board Term Session');
    setFormMemberExpertiseEn(item.member_expertise || '');
    setFormMemberExpertiseHi(item.member_expertise_hi || '');
    setFormRegulationClass('Regulations on Audit & Accounts');
    setFormGazetteRef(item.gazette_ref || '');
    setFormGazetteYear(item.gazette_year || '2020');

    setIsFormOpen(true);
  };

  const isSingletonRecord = (item: AboutRecord) => {
    const slug = (item.subTopicSlug || item.primary_key_or_slug || '').toLowerCase();
    const raw = (item.rawId || '').toLowerCase();
    const topic = (item.subTopic || '').toLowerCase();
    return (
      slug.includes('cag-of-india') ||
      slug.includes('our-vision-mission') ||
      slug.includes('constitutional-provisions') ||
      slug.includes('duties-power') ||
      raw === 'page-17' || raw === 'page-10' || raw === 'page-2' || raw === 'page-3' ||
      SINGLETON_SUBTOPICS.some(s => slug.includes(s) || raw.includes(s) || topic.includes(s))
    );
  };

  const handleVisualSaved = (updatedRecord: AboutRecord) => {
    const updated = allAboutRecords.map(r => r.rawId === updatedRecord.rawId ? updatedRecord : r);
    setAllAboutRecords(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_admin_about_records', JSON.stringify(updated));
    }
    loadData();
  };

  const handleDelete = async (rawId: string) => {
    if (!confirm('Are you sure you want to delete this About Us record?')) return;
    try {
      await fetch(`${API_URL}/api/admin/crud?table=about&id=${encodeURIComponent(rawId)}`, {
        method: 'DELETE',
      });
    } catch (e) { }

    const updated = allAboutRecords.filter(r => r.rawId !== rawId);
    setAllAboutRecords(updated);
    setRecords(prev => prev.filter(r => r.rawId !== rawId));
    setTotalCount(prev => Math.max(0, prev - 1));
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_admin_about_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('organisationOfficersChange'));
      window.dispatchEvent(new Event('aboutDataChange'));
    }
    if (viewingRecord?.rawId === rawId) setViewingRecord(null);
    await loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetRawId = editingRawId || `ab-${Date.now()}`;

    // Derive display title for Organisation Chart or Former CAG
    let finalTitleEn = formTitleEn;
    if (formSubTopic === 'Organisation-Chart' || formTable === 'cag_revamp.organisation_chart') {
      finalTitleEn = formTitleEn;
    }

    const newRecord: AboutRecord = {
      id: editingRawId ? (allAboutRecords.find(r => r.rawId === editingRawId)?.id || allAboutRecords.length + 1) : allAboutRecords.length + 1,
      rawId: targetRawId,
      formattedId: editingRawId ? (allAboutRecords.find(r => r.rawId === editingRawId)?.formattedId || `#AB-${String(allAboutRecords.length + 1).padStart(3, '0')}`) : `#AB-${String(allAboutRecords.length + 1).padStart(3, '0')}`,
      category: formCategory,
      subTopic: formSubTopic,
      subTopicSlug: formSubTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title_en: finalTitleEn,
      title_hi: formTitleHi,
      desc: formDesc || (formSubTopic === 'Organisation-Chart' ? `Executive Portfolio: ${formDepartmentEn || formDesignationEn}` : formDesc),
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

      // Subtopic specific payload
      prefix_name: formPrefix,
      designation_display_name: formDesignationEn,
      designation_hi: formDesignationHi,
      department: formDepartmentEn,
      department_hi: formDepartmentHi,
      email: formEmail,
      mobile_no: formPhone,
      reporting_offices: formReportingOfficesEn,
      reporting_offices_hi: formReportingOfficesHi,
      display_order: formDisplayOrder,
      tenure_from: formTenureFrom,
      tenure_to: formTenureTo,
      legacy_title: formLegacyTitle,
      history_volume: formHistoryVolume,
      chapter_number: formChapterNumber,
      gazette_ref: formGazetteRef,
      gazette_year: formGazetteYear,
      member_expertise: formMemberExpertiseEn,
      member_expertise_hi: formMemberExpertiseHi,
    };

    let updated: AboutRecord[];
    if (editingRawId) {
      try {
        await fetch(`${API_URL}/api/admin/crud?table=about&id=${encodeURIComponent(editingRawId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        });
      } catch (e) { }
      updated = allAboutRecords.map(r => r.rawId === editingRawId ? newRecord : r);
    } else {
      try {
        const res = await fetch(`${API_URL}/api/admin/crud?table=about`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRecord),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.id || resData.rawId) {
            newRecord.rawId = resData.rawId || `ab-${resData.id}`;
            newRecord.id = resData.id || newRecord.id;
            newRecord.formattedId = resData.formattedId || newRecord.formattedId;
          }
        }
      } catch (e) { }
      updated = [newRecord, ...allAboutRecords];
    }

    setAllAboutRecords(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_admin_about_records', JSON.stringify(updated));
      window.dispatchEvent(new Event('organisationOfficersChange'));
      window.dispatchEvent(new Event('aboutDataChange'));
    }

    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-4 text-xs text-zinc-700 font-sans">

      {/* 1. TOP FILTERS PANEL (Figma Burgundy Header matching Reports) */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">About Us Management Registry</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Manage Who We Are profiles, Leadership & Legacy galleries, and Governance hierarchy content published on the CAG portal.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/About/About-Us/Cag-Of-India"
              target="_blank"
              className="border border-[#751639] text-[#751639] hover:bg-[#751639] hover:text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs rounded-none flex items-center gap-1.5 cursor-pointer bg-white"
            >
              <span>Live Public Portal ↗</span>
            </Link>
            {SINGLETON_SUBTOPICS.includes(subTopicFilter) ? (
              <div className="border border-amber-400 bg-amber-50 text-amber-900 px-3.5 py-1.5 text-xs font-bold shadow-xs rounded-none flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Statutory Master Page (Edit Only)</span>
              </div>
            ) : (
              <button
                onClick={handleOpenCreate}
                className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <span>+ Add New Section Record</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 1: Search, Category, Sub-Topic, Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-zinc-700 font-bold mb-1">Search Keyword / Title / Officer:</label>
            <input
              type="text"
              placeholder="Search by title, overview, officer name..."
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none placeholder-zinc-400 focus:border-[#751639]"
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

        {/* Row 2: Publish Status, Sort By, Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 pt-1 border-t border-zinc-150">
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
              <option value="newest">Newly Added First</option>
              <option value="title_asc">Title / Name (A to Z)</option>
              <option value="title_desc">Title / Name (Z to A)</option>
              <option value="category_asc">Category (Hierarchy)</option>
              <option value="id_asc">Record ID (Ascending)</option>
              <option value="id_desc">Record ID (Descending)</option>
              <option value="oldest">Oldest Added First</option>
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
            Active Filter: <strong>{categoryFilter}</strong> | Sub-Topic: <strong>{subTopicFilter}</strong> | Status: <strong>{statusFilter}</strong>
          </span>
          <span>
            Source: <strong className="text-emerald-700">PostgreSQL cag_db_final (155 DB Records) + Local CMS</strong>
          </span>
        </div>
      </div>

      {/* ─── 2. TABLE GRID PANEL (Figma Burgundy Header Gradient matching Reports) ─── */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex flex-wrap justify-between items-center gap-3 bg-[#fafbfc]">
          <h3 className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <span>About Us Section Registry</span>
            <span className="text-zinc-500 font-normal">[ Displaying {records.length} of {totalCount.toLocaleString()} records ]</span>
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

            {!SINGLETON_SUBTOPICS.includes(subTopicFilter) && (
              <button
                onClick={handleOpenCreate}
                className="text-white px-4 py-2 font-bold transition-all shadow-xs rounded-none text-xs flex items-center gap-1.5 cursor-pointer"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <span>+ Add New Section Record</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-3 py-3 border-r border-white/20 w-12 text-center">#</th>
                <th className="px-4 py-3 border-r border-white/20 min-w-[280px]">About Us Title &amp; Summary</th>
                <th className="px-3 py-3 border-r border-white/20 w-36">Category</th>
                <th className="px-3 py-3 border-r border-white/20 w-44">Sub-Topic / Section</th>
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Lang</th>
                <th className="px-3 py-3 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-3 py-3 text-center min-w-[240px] w-64">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving About Us records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-zinc-400">
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

                    {/* Title & Summary */}
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-md">
                      <div
                        className="line-clamp-2 cursor-pointer hover:underline text-sm"
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
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-block rounded-xs ${item.category === 'Who We Are' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
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

                    {/* Language */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center text-zinc-600 font-semibold text-[11px]">
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px]">
                        {item.language}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 border-r border-[#e2e5e7] text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                        {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2 text-center whitespace-nowrap space-x-1">
                      {isSingletonRecord(item) ? (
                        <>
                          {/* Visual Live UI Editor */}
                          <button
                            onClick={() => setVisualEditingRecord(item)}
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-900 border border-amber-400 font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                            title="Open Visual Document / PDF Canvas Editor"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-800" />
                            <span>Visual Live Edit</span>
                          </button>

                          {/* Quick Metadata View */}
                          <button
                            onClick={() => handleOpenView(item)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="View Full Record Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Details</span>
                          </button>

                          {/* Delete Option */}
                          <button
                            onClick={() => handleDelete(item.rawId)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="Delete / Archive Record"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* View */}
                          <button
                            onClick={() => handleOpenView(item)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="View Full Record Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>View</span>
                          </button>

                          {/* Edit Form */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-800" />
                            <span>Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.rawId)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-semibold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            title="Delete / Archive Record"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}

                      {/* Live Link */}
                      {item.public_url && (
                        <Link
                          href={item.public_url}
                          target="_blank"
                          className="px-1.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-[11px] inline-flex items-center gap-0.5 shadow-2xs transition-colors"
                          title="Preview Public Page ↗"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-600" />
                          <span>Live</span>
                        </Link>
                      )}
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
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount.toLocaleString()} total records)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11px]"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-zinc-300 rounded-none bg-white text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-[11px]"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. VIEW DETAILS MODAL (Figma Burgundy Header Gradient matching Reports) ─── */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div
              className="p-4 text-white flex justify-between items-start"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-pink-200 mb-1">
                  About Us Record Details [ID: {viewingRecord.formattedId || viewingRecord.rawId}]
                </div>
                <h2 className="text-base font-bold leading-snug">
                  {viewingRecord.title_en}
                </h2>
                {viewingRecord.title_hi && (
                  <p className="text-xs text-pink-100 font-medium mt-1 font-hindi">
                    {viewingRecord.title_hi}
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                className="text-white/80 hover:text-white text-xl font-bold ml-4 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-zinc-800">

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-zinc-200">
                <span className="px-2.5 py-1 bg-[#751639] text-white font-bold text-[11px] rounded-xs">
                  {viewingRecord.category}
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px] rounded-xs">
                  Sub-Topic: {viewingRecord.subTopic}
                </span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[11px] rounded-xs">
                  Language: {viewingRecord.language}
                </span>
                <span className={`ml-auto px-2.5 py-0.5 rounded-full font-bold text-[10px] ${viewingRecord.is_active ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                  {viewingRecord.is_active ? '● ACTIVE' : '○ INACTIVE'}
                </span>
              </div>

              {/* Banner & Preview */}
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-zinc-50 p-4 border border-zinc-200">
                <img
                  src={viewingRecord.thumb_image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'}
                  alt="Card Preview"
                  className="h-24 w-36 object-cover border border-zinc-300 shadow-xs bg-white shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg';
                  }}
                />
                <div className="space-y-1.5 flex-1">
                  <div className="font-bold text-zinc-900 text-xs">Section Card Image / Photo</div>
                  <p className="text-[11px] text-zinc-500 break-all font-mono">
                    {viewingRecord.thumb_image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'}
                  </p>
                  {viewingRecord.file_url && (
                    <div className="pt-2">
                      <a
                        href={viewingRecord.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Download Attached Reference Document ({viewingRecord.file_name || 'PDF'})</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Executive Summary & Scope Overview */}
              <div>
                <h4 className="font-bold text-zinc-900 text-xs mb-1.5 uppercase tracking-wide text-[#751639]">
                  Executive Summary &amp; Content Narrative
                </h4>
                <div className="bg-zinc-50 border border-zinc-200 p-3.5 text-zinc-700 leading-relaxed text-xs">
                  {viewingRecord.desc ? (
                    <p>{viewingRecord.desc}</p>
                  ) : (
                    <p className="italic text-zinc-400">No narrative summary available for this section.</p>
                  )}
                </div>
              </div>

              {/* Routing & Record Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-3.5 border border-zinc-200">
                <div>
                  <span className="text-zinc-500 block font-bold text-[10px] uppercase">Live Public Route:</span>
                  <span className="font-mono text-zinc-800 font-semibold text-xs truncate block">{viewingRecord.public_url}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-bold text-[10px] uppercase">Record Code / ID:</span>
                  <span className="font-mono text-zinc-800 font-semibold text-xs">{viewingRecord.formattedId || viewingRecord.rawId}</span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-150">
                <span>Created: {viewingRecord.created_at}</span>
                <span>Last Modified: {viewingRecord.modified_at}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 pt-0 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 mt-4">
              <Link
                href={viewingRecord.public_url}
                target="_blank"
                className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-none transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Public Page ↗</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const item = viewingRecord;
                    setViewingRecord(null);
                    handleOpenEdit(item);
                  }}
                  className="px-4 py-2 bg-[#751639] hover:bg-[#5a102c] text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>
                <button
                  onClick={() => {
                    const idToDelete = viewingRecord.rawId;
                    setViewingRecord(null);
                    handleDelete(idToDelete);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="px-4 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-medium text-xs rounded-none cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. CREATE / EDIT MODAL FORM (Accessible, Document & Image Upload Enabled) ─── */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none max-w-3xl w-full p-0 shadow-2xl relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div
              className="p-4 text-white flex justify-between items-center shrink-0"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <div className="flex items-center gap-2.5">
                <FileUp className="w-5 h-5 text-pink-200" />
                <div>
                  <h3 className="text-sm font-bold leading-snug">
                    {editingRawId ? `Edit About Us Record [ID: ${editingRawId}]` : 'Register New About Us Section Record'}
                  </h3>
                  <p className="text-[11px] text-pink-100 font-normal">
                    Update CMS content, upload documents (PDF/DOCX), manage card images, and configure public links.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Error Notification Banner */}
            {uploadError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Section 1: Classification & Dynamic Sub-Topic Specific Form Engine */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#751639]" />
                    <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wide">
                      1. Content Classification &amp; Section Profile
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#751639]/10 text-[#751639] rounded">
                    {formSubTopic}
                  </span>
                </div>

                {/* Statutory Master Page Banner */}
                {isSingletonRecord({ rawId: editingRawId || '', subTopic: formSubTopic, subTopicSlug: formSubTopic, category: formCategory } as any) && (
                  <div className="p-3 bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-xs">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Statutory Singleton Page (Edit-Only Master):</span>
                        <p className="text-[11px] text-amber-800">
                          This core constitutional page renders live with high-fidelity styling. You can edit text &amp; photos directly on the live frontend canvas.
                        </p>
                      </div>
                    </div>
                    {editingRawId && (
                      <button
                        type="button"
                        onClick={() => {
                          const rec = allAboutRecords.find(r => r.rawId === editingRawId);
                          if (rec) {
                            setIsFormOpen(false);
                            setVisualEditingRecord(rec);
                          }
                        }}
                        className="shrink-0 px-3 py-1.5 bg-[#751639] hover:bg-[#5f122d] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                        <span>Open Visual Live Canvas</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Category & Sub-Topic Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="formCategory" className="block font-bold text-zinc-700 mb-1 text-xs">
                      Hierarchy Category *
                    </label>
                    <select
                      id="formCategory"
                      value={formCategory}
                      onChange={(e) => {
                        const newCat = e.target.value as any;
                        setFormCategory(newCat);
                        const defTopic = SUBTOPICS_BY_CATEGORY[newCat]?.[0];
                        if (defTopic) {
                          setFormSubTopic(defTopic.label);
                          setFormSlug(defTopic.defaultSlug);
                          setFormPublicUrl(defTopic.defaultUrl);
                          if (defTopic.value === 'organisation-chart') setFormTable('cag_revamp.organisation_chart');
                          else if (defTopic.value === 'former-cags') setFormTable('cag_revamp.former_cag');
                          else setFormTable('cag_revamp.pages');
                        }
                      }}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-medium"
                    >
                      <option value="Who We Are">Who We Are</option>
                      <option value="Leadership & Legacy">Leadership & Legacy</option>
                      <option value="Governance & Mandate">Governance & Mandate</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="formSubTopic" className="block font-bold text-zinc-700 mb-1 text-xs">
                      Sub-Topic / Section *
                    </label>
                    <select
                      id="formSubTopic"
                      value={formSubTopic}
                      onChange={(e) => {
                        const topicLabel = e.target.value;
                        setFormSubTopic(topicLabel);
                        const found = (SUBTOPICS_BY_CATEGORY[formCategory] || []).find(st => st.label === topicLabel);
                        if (found) {
                          setFormSlug(found.defaultSlug);
                          setFormPublicUrl(found.defaultUrl);
                          if (found.value === 'organisation-chart') setFormTable('cag_revamp.organisation_chart');
                          else if (found.value === 'former-cags') setFormTable('cag_revamp.former_cag');
                          else setFormTable('cag_revamp.pages');
                        }
                      }}
                      required
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-medium"
                    >
                      {(SUBTOPICS_BY_CATEGORY[formCategory] || []).map(st => (
                        <option key={st.value} value={st.label}>{st.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ─── DYNAMIC SUBTOPIC 1: ORGANISATION CHART ─── */}
                {(formSubTopic === 'Organisation-Chart' || formTable === 'cag_revamp.organisation_chart') && (
                  <div className="space-y-3 p-3.5 bg-blue-50/50 border border-blue-200 rounded-none">
                    <div className="flex items-center gap-1.5 text-[#751639] font-bold text-xs">
                      <span>🏢 Organisation Chart Officer Hierarchy Details</span>
                    </div>

                    {/* Honorific Prefix + Full Name (EN & HI) */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Prefix</label>
                        <select
                          value={formPrefix}
                          onChange={(e) => setFormPrefix(e.target.value)}
                          className="w-full bg-white border border-zinc-300 px-2 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        >
                          <option value="Shri">Shri</option>
                          <option value="Smt.">Smt.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Prof.">Prof.</option>
                        </select>
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Officer Full Name (English) *</label>
                        <input
                          type="text"
                          required
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          placeholder="e.g. K. Sanjay Murthy / V. S. Venkataraman"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Officer Full Name (हिन्दी)</label>
                        <input
                          type="text"
                          value={formTitleHi}
                          onChange={(e) => setFormTitleHi(e.target.value)}
                          placeholder="अधिकारी का पूरा नाम (हिंदी)"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 font-hindi focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    {/* Designation (EN & HI) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Official Designation (English) *</label>
                        <input
                          type="text"
                          required
                          value={formDesignationEn}
                          onChange={(e) => setFormDesignationEn(e.target.value)}
                          placeholder="e.g. Deputy Comptroller & Auditor General (DAI) - Defence"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Official Designation (हिन्दी)</label>
                        <input
                          type="text"
                          value={formDesignationHi}
                          onChange={(e) => setFormDesignationHi(e.target.value)}
                          placeholder="पदनाम (हिंदी)"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 font-hindi focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    {/* Department / Portfolio (EN & HI) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Department / Sector Portfolio (English)</label>
                        <input
                          type="text"
                          value={formDepartmentEn}
                          onChange={(e) => setFormDepartmentEn(e.target.value)}
                          placeholder="e.g. Defence & Autonomous Bodies / Commercial Audit"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Department / Sector Portfolio (हिन्दी)</label>
                        <input
                          type="text"
                          value={formDepartmentHi}
                          onChange={(e) => setFormDepartmentHi(e.target.value)}
                          placeholder="विभाग / प्रभाग (हिंदी)"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 font-hindi focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    {/* Email, Phone & Seniority Display Order */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Official Email Address</label>
                        <input
                          type="email"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="officer@cag.gov.in"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 font-mono focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Telephone / Intercom / Room</label>
                        <input
                          type="text"
                          value={formPhone}
                          onChange={(e) => setFormPhone(e.target.value)}
                          placeholder="011-23235790 / Room 402"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Display Order (Hierarchy Rank)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formDisplayOrder}
                          onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    {/* Subordinate Reporting Portfolios / Offices */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">Subordinate Reporting Portfolios &amp; Nodal Field Offices</label>
                      <textarea
                        rows={2}
                        value={formReportingOfficesEn}
                        onChange={(e) => setFormReportingOfficesEn(e.target.value)}
                        placeholder="e.g. DG Audit (Defence Services), PD Audit (Navy), PD Audit (Air Force)"
                        className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                      />
                    </div>
                  </div>
                )}

                {/* ─── DYNAMIC SUBTOPIC 2: FORMER CAGs GALLERY ─── */}
                {(formSubTopic === 'Former CAGs Gallery' || formTable === 'cag_revamp.former_cag') && (
                  <div className="space-y-3 p-3.5 bg-amber-50/50 border border-amber-200 rounded-none">
                    <div className="flex items-center gap-1.5 text-[#751639] font-bold text-xs">
                      <span>🏛️ Former Comptroller and Auditor General Record</span>
                    </div>

                    {/* Former CAG Name (EN & HI) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Former CAG Name (English) *</label>
                        <input
                          type="text"
                          required
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          placeholder="e.g. Shri V. Narahari Rao / Shri Vinod Rai"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Former CAG Name (हिन्दी)</label>
                        <input
                          type="text"
                          value={formTitleHi}
                          onChange={(e) => setFormTitleHi(e.target.value)}
                          placeholder="पूर्व कैग का नाम (हिंदी)"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 font-hindi focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    {/* Tenure Dates & Legacy Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Tenure From Year / Date *</label>
                        <input
                          type="text"
                          required
                          value={formTenureFrom}
                          onChange={(e) => setFormTenureFrom(e.target.value)}
                          placeholder="e.g. 1948 or 15-Aug-1948"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Tenure To Year / Date *</label>
                        <input
                          type="text"
                          required
                          value={formTenureTo}
                          onChange={(e) => setFormTenureTo(e.target.value)}
                          placeholder="e.g. 1954 or 15-Aug-1954"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Legacy Designation Title</label>
                        <input
                          type="text"
                          value={formLegacyTitle}
                          onChange={(e) => setFormLegacyTitle(e.target.value)}
                          placeholder="Former Comptroller and Auditor General of India"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    {/* Career Biography / Audit Highlights */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">Career Biography &amp; Major Audit Contributions</label>
                      <textarea
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Served as 1st Comptroller and Auditor General of Independent India. Established key accounting and auditing canons for the new republic."
                        className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                      />
                    </div>
                  </div>
                )}

                {/* ─── DYNAMIC SUBTOPIC 3: HISTORY OF IAAD ─── */}
                {formSubTopic === 'History of IAAD' && (
                  <div className="space-y-3 p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-none">
                    <div className="flex items-center gap-1.5 text-[#751639] font-bold text-xs">
                      <span>📜 History of IAAD Archival Chapter</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">History Volume Collection</label>
                        <select
                          value={formHistoryVolume}
                          onChange={(e) => setFormHistoryVolume(e.target.value)}
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        >
                          <option value="Analytical History 1947-1989">Analytical History (1947-1989)</option>
                          <option value="Thematic History Vol 1 (1990-2007)">Thematic History Vol 1 (1990-2007)</option>
                          <option value="Thematic History Vol 2 (1990-2007)">Thematic History Vol 2 (1990-2007)</option>
                          <option value="Chronological Milestones (1858-1947)">Chronological Milestones (1858-1947)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Chapter Identifier</label>
                        <input
                          type="text"
                          value={formChapterNumber}
                          onChange={(e) => setFormChapterNumber(e.target.value)}
                          placeholder="e.g. Chapter 1 / Volume I"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Chapter Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          placeholder="e.g. Constitutional Foundations of IAAD"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">Archival Summary &amp; Historical Themes</label>
                      <textarea
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Summary narrative of department expansion, statutory evolutions, and parliamentary oversight history."
                        className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                      />
                    </div>
                  </div>
                )}

                {/* ─── DYNAMIC SUBTOPIC 4: AUDIT ADVISORY BOARD ─── */}
                {formSubTopic === 'Audit-Advisory-Board' && (
                  <div className="space-y-3 p-3.5 bg-purple-50/50 border border-purple-200 rounded-none">
                    <div className="flex items-center gap-1.5 text-[#751639] font-bold text-xs">
                      <span>👥 Audit Advisory Board Record</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Record Type</label>
                        <select
                          value={formBoardType}
                          onChange={(e) => setFormBoardType(e.target.value as any)}
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        >
                          <option value="Member Profile">External Board Member Profile</option>
                          <option value="Board Term Session">Advisory Board Term Session</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Member Name / Term Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          placeholder="e.g. Dr. Ashok Lahiri / 9th Audit Advisory Board"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Domain / Field of Expertise</label>
                        <input
                          type="text"
                          value={formMemberExpertiseEn}
                          onChange={(e) => setFormMemberExpertiseEn(e.target.value)}
                          placeholder="e.g. Eminent Economist / Public Policy Specialist"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">Mandate Scope / Member Bio / Meeting Minutes Summary</label>
                      <textarea
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Overview of counsel provided on emerging audit methodologies, environmental accounting, and technology adoption."
                        className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                      />
                    </div>
                  </div>
                )}

                {/* ─── DYNAMIC SUBTOPIC 5: AUDIT REGULATION ─── */}
                {formSubTopic === 'Audit-Regulation' && (
                  <div className="space-y-3 p-3.5 bg-rose-50/50 border border-rose-200 rounded-none">
                    <div className="flex items-center gap-1.5 text-[#751639] font-bold text-xs">
                      <span>⚖️ Audit Regulations &amp; Standards</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Regulation Classification</label>
                        <select
                          value={formRegulationClass}
                          onChange={(e) => setFormRegulationClass(e.target.value)}
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        >
                          <option value="Regulations on Audit & Accounts">Regulations on Audit &amp; Accounts</option>
                          <option value="Auditing Standards">Auditing Standards</option>
                          <option value="Gazette Notification">Gazette Notification</option>
                          <option value="Amendment Order">Amendment Order</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Statutory Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          placeholder="e.g. Regulations on Audit and Accounts (Amendments) 2020"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-700 mb-1">Gazette Notification Ref &amp; Year</label>
                        <input
                          type="text"
                          value={formGazetteRef}
                          onChange={(e) => setFormGazetteRef(e.target.value)}
                          placeholder="e.g. No. 128-Audit / 2020"
                          className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">Executive Summary &amp; Legal Scope</label>
                      <textarea
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Official notification detailing statutory regulations made under Section 23 of the CAG's (DPC) Act, 1971."
                        className="w-full bg-white border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#751639]"
                      />
                    </div>
                  </div>
                )}

                {/* ─── STANDARD SUBTOPIC FALLBACK (Generic Section Record) ─── */}
                {formSubTopic !== 'Organisation-Chart' && formSubTopic !== 'Former CAGs Gallery' && formSubTopic !== 'History of IAAD' && formSubTopic !== 'Audit-Advisory-Board' && formSubTopic !== 'Audit-Regulation' && formTable !== 'cag_revamp.organisation_chart' && formTable !== 'cag_revamp.former_cag' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="formTitleEn" className="block font-bold text-zinc-700 mb-1 text-xs">
                          Record Title / Section Heading (English) *
                        </label>
                        <input
                          id="formTitleEn"
                          type="text"
                          required
                          value={formTitleEn}
                          onChange={(e) => setFormTitleEn(e.target.value)}
                          className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                          placeholder="e.g. Comptroller and Auditor General Profile"
                        />
                      </div>

                      <div>
                        <label htmlFor="formTitleHi" className="block font-bold text-zinc-700 mb-1 text-xs">
                          Record Title / Section Heading (हिन्दी)
                        </label>
                        <input
                          id="formTitleHi"
                          type="text"
                          value={formTitleHi}
                          onChange={(e) => setFormTitleHi(e.target.value)}
                          className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] font-hindi text-xs"
                          placeholder="शीर्षक या मुख्य भाग (हिंदी)"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="formDesc" className="block font-bold text-zinc-700 mb-1 text-xs">
                        Executive Summary / Paragraph Content / Mandate Scope
                      </label>
                      <textarea
                        id="formDesc"
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs leading-relaxed"
                        placeholder="Enter summary narrative or statutory content"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Document & PDF Attachments */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-200">
                  <Paperclip className="w-4 h-4 text-[#751639]" />
                  <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wide">
                    2. Document &amp; Reference Attachments (PDF / DOCX)
                  </h4>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-4 space-y-3">
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                    onChange={handleDocUpload}
                    className="hidden"
                  />

                  {/* Document Upload Button & State */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={uploadingDoc}
                      onClick={() => docInputRef.current?.click()}
                      className="px-4 py-2 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {uploadingDoc ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading Document...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Document (PDF / DOCX)</span>
                        </>
                      )}
                    </button>

                    {formFileUrl && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate max-w-xs">{formFileName || 'Document Attached'}</span>
                        <a
                          href={formFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-[11px] ml-1"
                        >
                          Preview ↗
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setFormFileUrl('');
                            setFormFileName('');
                          }}
                          className="text-rose-600 hover:text-rose-800 ml-1 cursor-pointer font-bold"
                          title="Remove attached document"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label htmlFor="formFileName" className="block text-[11px] font-bold text-zinc-600 mb-1">
                        Document Display Name
                      </label>
                      <input
                        id="formFileName"
                        type="text"
                        value={formFileName}
                        onChange={(e) => setFormFileName(e.target.value)}
                        placeholder="e.g. Audit_Regulations_2020.pdf"
                        className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="formFileUrl" className="block text-[11px] font-bold text-zinc-600 mb-1">
                        Direct Document URL / CloudFront Link
                      </label>
                      <input
                        id="formFileUrl"
                        type="text"
                        value={formFileUrl}
                        onChange={(e) => setFormFileUrl(e.target.value)}
                        placeholder="https://.../document.pdf or /admin-uploads/..."
                        className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Photo & Thumbnail Image */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-200">
                  <ImageIcon className="w-4 h-4 text-[#751639]" />
                  <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wide">
                    3. Card Image &amp; Officer Photo
                  </h4>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-4 flex flex-col sm:flex-row gap-4 items-start">
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Thumbnail Preview Container */}
                  <div className="relative group shrink-0">
                    <img
                      src={formThumbImage || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'}
                      alt="Thumbnail Preview"
                      className="w-36 h-24 object-cover border border-zinc-300 shadow-xs bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg';
                      }}
                    />
                    <div className="text-[10px] text-zinc-400 text-center mt-1">Live Image Preview</div>
                  </div>

                  {/* Image Controls & URL Input */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingImg}
                        onClick={() => imgInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {uploadingImg ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Image...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image (PNG / JPG / WEBP)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormThumbImage('/assets/cag-desk-photo.png')}
                        className="px-2.5 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-medium cursor-pointer"
                      >
                        Use Default Banner
                      </button>
                    </div>

                    <div>
                      <label htmlFor="formThumbImage" className="block text-[11px] font-bold text-zinc-600 mb-1">
                        Direct Image URL / Asset Link
                      </label>
                      <input
                        id="formThumbImage"
                        type="text"
                        value={formThumbImage}
                        onChange={(e) => setFormThumbImage(e.target.value)}
                        placeholder="https://.../photo.jpg or /assets/..."
                        className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Public Route & Publication Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1.5 border-b border-zinc-200">
                  <Globe className="w-4 h-4 text-[#751639]" />
                  <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wide">
                    4. Public Website Link &amp; Publishing Status
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="formPublicUrl" className="block font-bold text-zinc-700 mb-1 text-xs">
                      Public Website Route Path *
                    </label>
                    <input
                      id="formPublicUrl"
                      type="text"
                      required
                      value={formPublicUrl}
                      onChange={(e) => setFormPublicUrl(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] font-mono text-xs"
                      placeholder="/About/About-Us/..."
                    />
                  </div>

                  <div>
                    <label htmlFor="formLanguage" className="block font-bold text-zinc-700 mb-1 text-xs">
                      Language Mode
                    </label>
                    <select
                      id="formLanguage"
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value as any)}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-medium"
                    >
                      <option value="Bilingual">Bilingual (English + Hindi)</option>
                      <option value="EN">English Only</option>
                      <option value="HI">हिन्दी Only</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="formIsActive" className="block font-bold text-zinc-700 mb-1 text-xs">
                      Publication Status
                    </label>
                    <select
                      id="formIsActive"
                      value={formIsActive ? 'Active' : 'Inactive'}
                      onChange={(e) => setFormIsActive(e.target.value === 'Active')}
                      className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-medium"
                    >
                      <option value="Active">Active (Published on Live Site)</option>
                      <option value="Inactive">Inactive (Draft / Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-medium rounded-none text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc || uploadingImg}
                  className="px-6 py-2 text-white font-bold rounded-none text-xs shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingRawId ? 'Save & Update Record' : 'Register Section Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 5. VISUAL LIVE DOCUMENT / PDF CANVAS EDITOR ─── */}
      {visualEditingRecord && (
        <VisualDocumentEditor
          record={visualEditingRecord}
          onClose={() => setVisualEditingRecord(null)}
          onSaved={handleVisualSaved}
          onDelete={handleDelete}
        />
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
