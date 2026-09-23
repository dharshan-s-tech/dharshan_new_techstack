'use client';

import React, { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { ALL_ABOUT_DB_RECORDS, AboutRecord } from '@/data/aboutAdminData';
import { dataManager, OrgChartOfficer } from '@/lib/dataManager';
import {
  Landmark, UserCheck, Compass, GitBranch, Award, Library, Users,
  Scale, ScrollText, BookOpen, Search, Filter, RotateCcw, ExternalLink,
  Pencil, Eye, Plus, CheckCircle2, FileText, ChevronRight, Layers,
  ArrowUpDown, X, Check, Globe, RefreshCw, AlertCircle, Trash2, Database, Shield,
  Upload, Image as ImageIcon, Paperclip, FileUp, Lock, Sparkles, SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';
import VisualDocumentEditor from './VisualDocumentEditor';
import { FilePreviewAction } from '@/components/admin/ListClientHelpers';

export const SINGLETON_SUBTOPICS = [
  'cag-of-india',
  'our-vision-mission-values',
  'constitutional-provisions',
  'duties-power-and-conditions-of-services-act',
  'audit-advisory-board'
];

function AdminAboutRegistryContent() {
  const { isHindi, t, getText } = useAdminLanguage();
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

  // ─── Filter States ───
  const [searchFor, setSearchFor] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subTopicFilter, setSubTopicFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tableFilter, setTableFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');

  // Lookups & Subtopics grouped by Category
  const categories = ['Who We Are', 'Leadership & Legacy', 'Governance & Mandate'];
  const SUBTOPICS_BY_CATEGORY: Record<string, { label: string; value: string; defaultSlug: string; defaultUrl: string; defaultTable: string }[]> = {
    'Who We Are': [
      { label: 'CAG of India Profile', value: 'cag-of-india', defaultSlug: 'page-cag-of-india', defaultUrl: '/About/About-Us/Cag-Of-India', defaultTable: 'cag_revamp.pages' },
      { label: 'Our Vision, Mission & Core Values', value: 'our-vision-mission-values', defaultSlug: 'page-our-vision-mission-values', defaultUrl: '/About/About-Us/Our-Vision,-Mission-&-Core-Values', defaultTable: 'cag_revamp.pages' },
      { label: 'Organisation-Chart', value: 'organisation-chart', defaultSlug: 'organisation-chart', defaultUrl: '/About/About-Us/Organisation-Chart', defaultTable: 'cag_revamp.organisation_chart' },
    ],
    'Leadership & Legacy': [
      { label: 'Former CAGs Gallery', value: 'former-cags', defaultSlug: 'former-cags', defaultUrl: '/About/About-Us/Former-Comptroller-and-Auditors-General', defaultTable: 'cag_revamp.former_cag' },
      { label: 'History of IAAD', value: 'history-of-indian-audit-and-accounts-department', defaultSlug: 'page-history-of-indian-audit-and-accounts-department', defaultUrl: '/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department', defaultTable: 'cag_revamp.pages' },
      { label: 'Audit-Advisory-Board', value: 'audit-advisory-board', defaultSlug: 'page-audit-advisory-board', defaultUrl: '/About/About-Us/Audit-Advisory-Board', defaultTable: 'cag_revamp.board_committees' },
    ],
    'Governance & Mandate': [
      { label: 'Constitutional-Provisions', value: 'constitutional-provisions', defaultSlug: 'page-constitutional-provisions', defaultUrl: '/About/About-Us/Constitutional-Provisions', defaultTable: 'cag_revamp.pages' },
      { label: 'Duties-&-Powers-Act', value: 'duties-power-and-conditions-of-services-act', defaultSlug: 'page-duties-power-and-conditions-of-services-act', defaultUrl: '/About/About-Us/Duties-&-Powers-Act', defaultTable: 'cag_revamp.pages' },
      { label: 'Audit-Regulation', value: 'cag-audit-regulations', defaultSlug: 'page-cag-audit-regulations', defaultUrl: '/About/About-Us/Audit-Regulation', defaultTable: 'cag_revamp.pages' },
    ]
  };

  // Dynamic category and table counts
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

  // Organisation Chart States
  const [formLevel, setFormLevel] = useState<number>(2);
  const [formPosition, setFormPosition] = useState<'center' | 'left' | 'right'>('left');
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

  // Former CAG States
  const [formTenureFrom, setFormTenureFrom] = useState('');
  const [formTenureTo, setFormTenureTo] = useState('');
  const [formLegacyTitle, setFormLegacyTitle] = useState('Former Comptroller and Auditor General of India');

  // History of IAAD States
  const [formHistoryVolume, setFormHistoryVolume] = useState('Analytical History 1947-1989');
  const [formChapterNumber, setFormChapterNumber] = useState('Ch 1');

  // Audit Advisory Board States
  const [formMemberExpertiseEn, setFormMemberExpertiseEn] = useState('');
  const [formMemberExpertiseHi, setFormMemberExpertiseHi] = useState('');

  // Audit Regulations States
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

  // Main Data Query & Filter Engine
  const fetchRecords = useCallback(() => {
    setLoading(true);
    try {
      let filtered = [...allAboutRecords];

      // 1. Text Search Filter
      if (appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase().trim();
        filtered = filtered.filter(item => {
          return (
            item.title_en?.toLowerCase().includes(q) ||
            item.title_hi?.toLowerCase().includes(q) ||
            item.desc?.toLowerCase().includes(q) ||
            item.subTopic?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q) ||
            item.primary_key_or_slug?.toLowerCase().includes(q) ||
            item.formattedId?.toLowerCase().includes(q) ||
            item.designation_display_name?.toLowerCase().includes(q)
          );
        });
      }

      // 2. Category Filter
      if (categoryFilter !== 'All') {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }

      // 3. Sub-Topic Filter
      if (subTopicFilter !== 'All') {
        filtered = filtered.filter(item => {
          const st = subTopicFilter.toLowerCase();
          return (
            item.subTopicSlug.toLowerCase().includes(st) ||
            item.subTopic.toLowerCase().includes(st) ||
            st.includes(item.subTopicSlug.toLowerCase())
          );
        });
      }

      // 4. Status Filter
      if (statusFilter !== 'All') {
        const wantActive = statusFilter === 'Active';
        filtered = filtered.filter(item => item.is_active === wantActive);
      }

      // 5. Language Filter
      if (languageFilter !== 'All') {
        if (languageFilter === 'Bilingual') {
          filtered = filtered.filter(item => item.title_hi && item.title_hi.trim() !== '');
        } else if (languageFilter === 'EN') {
          filtered = filtered.filter(item => !item.title_hi || item.title_hi.trim() === '');
        } else if (languageFilter === 'HI') {
          filtered = filtered.filter(item => item.title_hi && item.title_hi.trim() !== '');
        }
      }

      // 6. DB Table Filter
      if (tableFilter !== 'All') {
        filtered = filtered.filter(item => item.table_name === tableFilter);
      }

      // 7. Sorting
      filtered.sort((a, b) => {
        if (sortFilter === 'newest') return Number(b.id || 0) - Number(a.id || 0);
        if (sortFilter === 'oldest') return Number(a.id || 0) - Number(b.id || 0);
        if (sortFilter === 'title_asc') return (a.title_en || '').localeCompare(b.title_en || '');
        if (sortFilter === 'title_desc') return (b.title_en || '').localeCompare(a.title_en || '');
        if (sortFilter === 'category_asc') return (a.category || '').localeCompare(b.category || '');
        if (sortFilter === 'id_asc') return Number(a.id || 0) - Number(b.id || 0);
        if (sortFilter === 'id_desc') return Number(b.id || 0) - Number(a.id || 0);
        return 0;
      });

      setTotalCount(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize) || 1);

      // Pagination slice
      const startIndex = (page - 1) * pageSize;
      const paginated = filtered.slice(startIndex, startIndex + pageSize);
      setRecords(paginated);
    } catch (error) {
      console.error('Error filtering about records:', error);
    } finally {
      setLoading(false);
    }
  }, [allAboutRecords, appliedSearch, categoryFilter, subTopicFilter, statusFilter, languageFilter, tableFilter, sortFilter, page, pageSize]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Persist Local State Changes
  const saveAllRecordsToLocal = (newRecords: AboutRecord[]) => {
    setAllAboutRecords(newRecords);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cag_admin_about_records', JSON.stringify(newRecords));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
    }
  };

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

  // Open Create Form Drawer
  const handleOpenCreate = () => {
    setEditingRawId(null);
    const isOrgTopic = subTopicFilter.toLowerCase().includes('organisation') || subTopicFilter.toLowerCase().includes('org');
    setFormCategory(isOrgTopic ? 'Who We Are' : (categoryFilter !== 'All' ? categoryFilter as any : 'Who We Are'));
    setFormSubTopic(isOrgTopic ? 'Organisation-Chart' : 'CAG of India Profile');
    setFormTitleEn('');
    setFormTitleHi('');
    setFormDesc('');
    setFormTable(isOrgTopic ? 'cag_revamp.organisation_chart' : 'cag_revamp.pages');
    setFormSlug(isOrgTopic ? 'organisation-chart' : 'page-custom');
    setFormPublicUrl(isOrgTopic ? '/About/About-Us/Organisation-Chart' : '/About/About-Us/Cag-Of-India');
    setFormFileUrl('');
    setFormFileName('');
    setFormThumbImage('');
    setFormLanguage('Bilingual');
    setFormIsActive(true);
    setFormLevel(2);
    setFormPosition('left');
    setFormPrefix('Shri');
    setFormDesignationEn(isOrgTopic ? 'Deputy Comptroller & Auditor General' : 'Deputy Comptroller & Auditor General');
    setFormDesignationHi(isOrgTopic ? 'उप नियंत्रक एवं महालेखापरीक्षक' : 'उप नियंत्रक एवं महालेखापरीक्षक');
    setFormDepartmentEn('');
    setFormDepartmentHi('');
    setFormEmail('');
    setFormPhone('');
    setFormReportingOfficesEn('');
    setFormReportingOfficesHi('');
    setFormDisplayOrder(isOrgTopic ? dataManager.getOrgChartOfficers().length + 1 : 1);
    setFormTenureFrom('');
    setFormTenureTo('');
    setFormLegacyTitle('Former Comptroller and Auditor General of India');
    setFormHistoryVolume('Analytical History 1947-1989');
    setFormChapterNumber('Ch 1');
    setFormMemberExpertiseEn('');
    setFormMemberExpertiseHi('');
    setFormGazetteRef('');
    setFormGazetteYear('2020');
    setIsFormOpen(true);
  };

  // Open Edit Form Drawer
  const handleOpenEdit = (record: AboutRecord) => {
    setEditingRawId(record.rawId);
    setFormCategory(record.category || 'Who We Are');
    setFormSubTopic(record.subTopic || 'CAG of India Profile');
    setFormTitleEn(record.title_en || '');
    setFormTitleHi(record.title_hi || '');
    setFormDesc(record.desc || '');
    setFormTable(record.table_name || 'cag_revamp.pages');
    setFormSlug(record.primary_key_or_slug || '');
    setFormPublicUrl(record.public_url || '');
    setFormFileUrl(record.file_url || '');
    setFormFileName(record.file_name || '');
    setFormThumbImage(record.thumb_image || '');
    setFormLanguage(record.language || (record.title_hi ? 'Bilingual' : 'EN'));
    setFormIsActive(record.is_active);
    setFormDesignationEn(record.designation_display_name || '');
    setFormDesignationHi(record.designation_hi || '');
    setFormDepartmentEn(record.department || '');
    setFormDepartmentHi(record.department_hi || '');
    setFormEmail(record.email || '');
    setFormPhone(record.mobile_no || '');
    setFormReportingOfficesEn(record.reporting_offices || '');
    setFormReportingOfficesHi(record.reporting_offices_hi || '');
    setFormDisplayOrder(record.display_order || 1);
    setFormTenureFrom(record.tenure_from || '');
    setFormTenureTo(record.tenure_to || '');
    setFormLegacyTitle(record.legacy_title || '');
    setFormHistoryVolume(record.history_volume || 'Analytical History 1947-1989');
    setFormChapterNumber(record.chapter_number || 'Ch 1');
    setFormMemberExpertiseEn(record.member_expertise || '');
    setFormMemberExpertiseHi(record.member_expertise_hi || '');
    setFormGazetteRef(record.gazette_ref || '');
    setFormGazetteYear(record.gazette_year || '2020');

    // If Org Chart, lookup officer from dataManager
    const isOrg = record.subTopic === 'Organisation-Chart' || record.table_name === 'cag_revamp.organisation_chart' || record.rawId?.startsWith('org-chart-');
    if (isOrg) {
      const officers = dataManager.getOrgChartOfficers();
      const officerId = record.rawId?.replace('org-chart-', '') || String(record.id);
      const matched = officers.find(o => o.id === officerId || o.id === record.rawId || (record.title_en && record.title_en.includes(o.nameEn)));
      if (matched) {
        setFormLevel(matched.level ?? 2);
        setFormPosition(matched.position || 'left');
        setFormDisplayOrder(matched.display_order || record.display_order || 1);
        setFormTitleEn(matched.nameEn || '');
        setFormTitleHi(matched.nameHi || '');
        setFormDesignationEn(matched.desigEn || '');
        setFormDesignationHi(matched.desigHi || '');
        setFormDepartmentEn(matched.subEn || '');
        setFormDepartmentHi(matched.subHi || '');
        setFormEmail(matched.email || '');
        setFormPhone(matched.phone || '');
        setFormReportingOfficesEn(matched.reportingEn || '');
        setFormReportingOfficesHi(matched.reportingHi || '');
        setFormThumbImage(matched.photo_url || record.thumb_image || '');
      } else {
        const isL0 = record.primary_key_or_slug?.includes('Level 0') || record.chart_position === 'center' || record.chart_position === 'top';
        const isL1 = record.primary_key_or_slug?.includes('Level 1') || record.designation_display_name?.toLowerCase().includes('secretary') || record.chart_position === 'secretary';
        setFormLevel(isL0 ? 0 : (isL1 ? 1 : (record.level ?? 2)));
        const normalizedPos: 'center' | 'left' | 'right' = record.chart_position === 'center' || record.chart_position === 'right' || record.chart_position === 'left'
          ? record.chart_position
          : (isL0 ? 'center' : (isL1 ? 'right' : 'left'));
        setFormPosition(normalizedPos);
        setFormDisplayOrder(record.display_order || 1);
        setFormTitleEn(record.title_en?.split(' - ')[0] || record.title_en || '');
      }
    }

    setIsFormOpen(true);
  };

  const handleOpenView = (record: AboutRecord) => {
    setViewingRecord(record);
  };

  const handleDelete = (rawId: string) => {
    if (!confirm('Are you sure you want to permanently delete this About Us section record?')) {
      return;
    }
    const updated = allAboutRecords.filter(r => r.rawId !== rawId);
    saveAllRecordsToLocal(updated);
    if (rawId.startsWith('org-chart-')) {
      dataManager.deleteOrgChartOfficer(rawId.replace('org-chart-', ''));
    }
    if (viewingRecord?.rawId === rawId) setViewingRecord(null);
    if (visualEditingRecord?.rawId === rawId) setVisualEditingRecord(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isOrg = formSubTopic === 'Organisation-Chart' || formTable === 'cag_revamp.organisation_chart';

    if (isOrg) {
      const officerId = editingRawId ? editingRawId.replace('org-chart-', '') : `officer-${Date.now()}`;
      const officerObj: OrgChartOfficer = {
        id: officerId,
        nameEn: formTitleEn,
        nameHi: formTitleHi,
        desigEn: formDesignationEn,
        desigHi: formDesignationHi,
        subEn: formDepartmentEn,
        subHi: formDepartmentHi,
        email: formEmail,
        phone: formPhone,
        reportingEn: formReportingOfficesEn,
        reportingHi: formReportingOfficesHi,
        level: Number(formLevel),
        position: formPosition,
        display_order: Number(formDisplayOrder),
        photo_url: formThumbImage,
        is_active: formIsActive
      };
      dataManager.saveOrgChartOfficer(officerObj);
    }

    if (editingRawId) {
      // Update existing record
      const updated = allAboutRecords.map(r => {
        if (r.rawId === editingRawId) {
          return {
            ...r,
            category: formCategory,
            subTopic: formSubTopic,
            title_en: isOrg ? `${formTitleEn} - ${formDesignationEn}` : formTitleEn,
            title_hi: formTitleHi,
            desc: isOrg ? `Level ${formLevel} (${formPosition}): ${formDepartmentEn}. Email: ${formEmail || 'N/A'}` : formDesc,
            table_name: formTable,
            primary_key_or_slug: isOrg ? `ID: ${editingRawId.replace('org-chart-', '')} (Level ${formLevel})` : formSlug,
            public_url: formPublicUrl,
            file_url: formFileUrl,
            file_name: formFileName,
            thumb_image: formThumbImage,
            photo_url: formThumbImage,
            is_active: formIsActive,
            language: formLanguage,
            designation_display_name: formDesignationEn,
            designation_hi: formDesignationHi,
            department: formDepartmentEn,
            department_hi: formDepartmentHi,
            email: formEmail,
            mobile_no: formPhone,
            reporting_offices: formReportingOfficesEn,
            reporting_offices_hi: formReportingOfficesHi,
            chart_position: formPosition,
            level: Number(formLevel),
            display_order: formDisplayOrder,
            tenure_from: formTenureFrom,
            tenure_to: formTenureTo,
            legacy_title: formLegacyTitle,
            history_volume: formHistoryVolume,
            chapter_number: formChapterNumber,
            member_expertise: formMemberExpertiseEn,
            member_expertise_hi: formMemberExpertiseHi,
            gazette_ref: formGazetteRef,
            gazette_year: formGazetteYear,
            modified_at: new Date().toISOString()
          };
        }
        return r;
      });
      saveAllRecordsToLocal(updated);
    } else {
      // Create new record
      const newId = Math.max(...allAboutRecords.map(r => Number(r.id) || 0), 0) + 1;
      const customRawId = isOrg ? `org-chart-officer-${Date.now()}` : `about-custom-${Date.now()}`;
      const newRecord: AboutRecord = {
        rawId: customRawId,
        id: newId,
        formattedId: `#AB-${String(newId).padStart(3, '0')}`,
        category: formCategory,
        subTopic: formSubTopic,
        subTopicSlug: isOrg ? 'organisation-chart' : (formSlug || 'custom-section'),
        title_en: isOrg ? `${formTitleEn} - ${formDesignationEn}` : formTitleEn,
        title_hi: formTitleHi,
        desc: isOrg ? `Level ${formLevel} (${formPosition}): ${formDepartmentEn}. Email: ${formEmail || 'N/A'}` : formDesc,
        table_name: formTable,
        primary_key_or_slug: isOrg ? `ID: ${customRawId.replace('org-chart-', '')} (Level ${formLevel})` : (formSlug || `page-${Date.now()}`),
        public_url: formPublicUrl || (isOrg ? '/About/About-Us/Organisation-Chart' : '/About/About-Us'),
        file_url: formFileUrl,
        file_name: formFileName,
        thumb_image: formThumbImage,
        photo_url: formThumbImage,
        is_active: formIsActive,
        language: formLanguage,
        designation_display_name: formDesignationEn,
        designation_hi: formDesignationHi,
        department: formDepartmentEn,
        department_hi: formDepartmentHi,
        email: formEmail,
        mobile_no: formPhone,
        reporting_offices: formReportingOfficesEn,
        reporting_offices_hi: formReportingOfficesHi,
        chart_position: formPosition,
        level: Number(formLevel),
        display_order: formDisplayOrder,
        tenure_from: formTenureFrom,
        tenure_to: formTenureTo,
        legacy_title: formLegacyTitle,
        history_volume: formHistoryVolume,
        chapter_number: formChapterNumber,
        member_expertise: formMemberExpertiseEn,
        member_expertise_hi: formMemberExpertiseHi,
        gazette_ref: formGazetteRef,
        gazette_year: formGazetteYear,
        created_at: new Date().toISOString(),
        modified_at: new Date().toISOString()
      };
      saveAllRecordsToLocal([newRecord, ...allAboutRecords]);
    }
    setIsFormOpen(false);
  };

  const handleVisualSaved = (updatedRecord: AboutRecord) => {
    const updated = allAboutRecords.map(r => r.rawId === updatedRecord.rawId ? updatedRecord : r);
    saveAllRecordsToLocal(updated);
    setVisualEditingRecord(null);
  };

  // ─── 1. FULL CONTENT PAGE: VISUAL LIVE EDITOR ───
  if (visualEditingRecord) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] flex flex-col font-sans relative">
        <VisualDocumentEditor
          record={visualEditingRecord}
          onClose={() => setVisualEditingRecord(null)}
          onSaved={handleVisualSaved}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  // ─── 2. FULL CONTENT PAGE: VIEW DETAILS ───
  if (viewingRecord) {
    const isOrg = viewingRecord.subTopic === 'Organisation-Chart' || 
      viewingRecord.table_name === 'cag_revamp.organisation_chart' || 
      viewingRecord.rawId?.startsWith('org-chart-') ||
      (viewingRecord.subTopicSlug || '').toLowerCase().includes('org');

    const isFormer = viewingRecord.subTopic === 'Former CAGs Gallery' ||
      viewingRecord.table_name === 'cag_revamp.former_cag' ||
      viewingRecord.rawId?.startsWith('former-cag-') ||
      (viewingRecord.subTopicSlug || '').toLowerCase().includes('former');

    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white flex flex-col rounded-[12px] shadow-sm border border-[#EDE9E9] overflow-hidden animate-fadeIn font-sans">
        <div className="px-6 py-4 border-b border-[#EDE9E9] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewingRecord(null)}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>← {isHindi ? 'पीछे' : 'Back'}</span>
            </button>
            <span className="text-xs font-bold text-[#751639] bg-[#FDF2F5] px-2.5 py-1 rounded-[6px]">
              {viewingRecord.formattedId}
            </span>
            <h3 className="font-semibold text-[#0F172B] text-[16px] truncate max-w-xl">
              {getText(viewingRecord.title_en, viewingRecord.title_hi)}
            </h3>
          </div>
          <button
            onClick={() => setViewingRecord(null)}
            className="p-1.5 text-[#62748E] hover:text-[#0F172B] hover:bg-[#F8F7F7] rounded-[6px] transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Org Chart Officer Specialized View Card */}
          {isOrg ? (
            <div className="bg-[#FAF9F9] border border-[#EDE9E9] rounded-[12px] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-5 border-b border-[#EDE9E9]">
                {/* Photo Avatar */}
                {viewingRecord.thumb_image || viewingRecord.photo_url ? (
                  <img
                    src={viewingRecord.thumb_image || viewingRecord.photo_url}
                    alt={viewingRecord.title_en}
                    className="w-20 h-20 rounded-full object-cover border-3 border-[#751639] shadow-md shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#FDF2F5] border-2 border-[#751639] flex items-center justify-center shrink-0 shadow-xs">
                    <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="14.5" stroke="#751639" strokeWidth="1.3" />
                      <circle cx="16" cy="11.5" r="4.5" stroke="#751639" strokeWidth="1.3" />
                      <path d="M8 25C9.2 20.8 12.2 19 16 19C19.8 19 22.8 20.8 24 25" stroke="#751639" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                )}

                {/* Officer Titles & Badges */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#751639] text-white">
                      Level {viewingRecord.level ?? 2}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-800 capitalize">
                      {viewingRecord.chart_position || 'Left Column'} Position
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      Order #{viewingRecord.display_order || 1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      viewingRecord.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingRecord.is_active ? 'Active on Tree' : 'Inactive / Hidden'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#751639] leading-snug">
                    {viewingRecord.title_en?.split(' - ')[0] || viewingRecord.title_en}
                  </h2>
                  {viewingRecord.title_hi && (
                    <div className="text-[15px] font-hindi font-semibold text-zinc-700">
                      {viewingRecord.title_hi}
                    </div>
                  )}
                  <div className="text-[14px] font-semibold text-zinc-600">
                    {viewingRecord.designation_display_name || 'Deputy Comptroller & Auditor General'}
                    {viewingRecord.designation_hi && (
                      <span className="font-hindi text-zinc-500 ml-2">({viewingRecord.designation_hi})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolio & Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="bg-white p-4 rounded-[8px] border border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold mb-1">Executive Portfolio / Charges (EN)</span>
                  <p className="font-medium text-[#314158]">{viewingRecord.department || 'N/A'}</p>
                </div>
                <div className="bg-white p-4 rounded-[8px] border border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold mb-1">प्रभार / कार्यक्षेत्र (HI)</span>
                  <p className="font-medium text-[#314158] font-hindi">{viewingRecord.department_hi || viewingRecord.department || 'N/A'}</p>
                </div>

                <div className="bg-white p-4 rounded-[8px] border border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold mb-1">Official Email Address</span>
                  {viewingRecord.email ? (
                    <a href={`mailto:${viewingRecord.email}`} className="text-[#751639] font-medium hover:underline flex items-center gap-1.5">
                      <span>{viewingRecord.email}</span>
                    </a>
                  ) : (
                    <span className="text-zinc-400">N/A</span>
                  )}
                </div>

                <div className="bg-white p-4 rounded-[8px] border border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold mb-1">Telephone / Mobile</span>
                  {viewingRecord.mobile_no ? (
                    <a href={`tel:${viewingRecord.mobile_no}`} className="text-[#314158] font-medium hover:underline">
                      {viewingRecord.mobile_no}
                    </a>
                  ) : (
                    <span className="text-zinc-400">N/A</span>
                  )}
                </div>
              </div>

              {/* Reporting Offices */}
              <div className="bg-white p-4 rounded-[8px] border border-[#EDE9E9] text-[13px] space-y-3">
                <div>
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold mb-1">Reporting Offices & Field Directorates (English)</span>
                  <p className="text-[#314158] leading-relaxed whitespace-pre-line">
                    {viewingRecord.reporting_offices || 'No specific reporting offices specified.'}
                  </p>
                </div>
                {viewingRecord.reporting_offices_hi && (
                  <div className="pt-2 border-t border-zinc-100">
                    <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold mb-1">रिपोर्टिंग कार्यालय एवं क्षेत्र निदेशालय (हिन्दी)</span>
                    <p className="text-[#314158] font-hindi leading-relaxed whitespace-pre-line">
                      {viewingRecord.reporting_offices_hi}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Standard View Details for Other Subtopics */
            <>
              {/* Image Preview if present */}
              {viewingRecord.thumb_image && (
                <div className="rounded-[8px] overflow-hidden border border-[#EDE9E9] bg-zinc-50 max-h-56 flex items-center justify-center">
                  <img
                    src={viewingRecord.thumb_image}
                    alt={viewingRecord.title_en}
                    className="max-h-56 object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">{t.category}</span>
                  <span className="font-medium text-[#314158]">{viewingRecord.category}</span>
                </div>
                <div>
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">Sub-Topic</span>
                  <span className="font-medium text-[#314158]">{viewingRecord.subTopic}</span>
                </div>
                <div>
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">{t.status}</span>
                  <span className={viewingRecord.is_active ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {viewingRecord.is_active ? t.active : t.inactive}
                  </span>
                </div>
                <div>
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">Public Route</span>
                  <span className="font-mono text-[#751639]">{viewingRecord.public_url || 'N/A'}</span>
                </div>
              </div>

              {viewingRecord.title_hi && (
                <div className="pt-2 border-t border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">हिन्दी शीर्षक (Hindi Title)</span>
                  <span className="font-hindi text-[14px] text-[#314158] font-medium">{viewingRecord.title_hi}</span>
                </div>
              )}

              {viewingRecord.desc && (
                <div className="pt-2 border-t border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">{t.description}</span>
                  <p className="text-[#314158] whitespace-pre-wrap leading-relaxed mt-1">{viewingRecord.desc}</p>
                </div>
              )}

              {/* Extra Dynamic Subtopic Fields */}
              {isFormer && (
                <div className="pt-2 border-t border-[#EDE9E9] grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">Tenure Period</span>
                    <span className="font-medium text-[#314158]">{viewingRecord.tenure_from || 'N/A'} - {viewingRecord.tenure_to || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">Legacy Title</span>
                    <span className="font-medium text-[#314158]">{viewingRecord.legacy_title || 'Former CAG of India'}</span>
                  </div>
                </div>
              )}

              {viewingRecord.file_url && (
                <div className="pt-2 border-t border-[#EDE9E9]">
                  <span className="text-[#90A1B9] block text-[11px] uppercase font-semibold">Attached Document</span>
                  <a href={viewingRecord.file_url} target="_blank" rel="noopener noreferrer" className="text-[#751639] underline font-medium text-xs mt-1 inline-block">
                    {viewingRecord.file_name || 'Download / View PDF'}
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#EDE9E9] flex items-center justify-between bg-[#F8F7F7] rounded-b-[12px]">
          {viewingRecord.public_url ? (
            <Link
              href={viewingRecord.public_url}
              target="_blank"
              className="px-3 py-1.5 rounded-[6px] bg-white border border-[#EDE9E9] text-[#314158] hover:text-[#751639] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isOrg ? 'View on Live Tree Chart' : 'View on Public Site'}</span>
            </Link>
          ) : <div />}

          <div className="flex items-center gap-2">
            {(() => {
              const sub = (viewingRecord.subTopicSlug || viewingRecord.subTopic || '').toLowerCase();
              const rawId = (viewingRecord.rawId || '').toLowerCase();
              const isStaticPage = !sub.includes('former') && !rawId.includes('former') && !sub.includes('organisation') && !sub.includes('organization') && !rawId.includes('org-');

              if (isStaticPage) {
                return (
                  <button
                    onClick={() => {
                      const rec = viewingRecord;
                      setViewingRecord(null);
                      setVisualEditingRecord(rec);
                    }}
                    className="px-4 py-2 rounded-[8px] bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-300 shadow-xs font-semibold text-[13px] flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{isHindi ? 'विजुअल लाइव संपादन' : 'Visual Live Edit'}</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={() => {
                    const rec = viewingRecord;
                    setViewingRecord(null);
                    handleOpenEdit(rec);
                  }}
                  className="px-4 py-2 rounded-[8px] bg-[#751639] text-white text-[13px] font-semibold hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{t.edit}</span>
                </button>
              );
            })()}

            <button
              onClick={() => setViewingRecord(null)}
              className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] text-[13px] font-medium hover:bg-white cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 3. FULL CONTENT PAGE: ADD / EDIT RECORD ───
  if (isFormOpen) {
    const isOrgTopic = formSubTopic === 'Organisation-Chart' ||
      formSubTopic.toLowerCase().includes('organisation') ||
      formSubTopic.toLowerCase().includes('org') ||
      formTable === 'cag_revamp.organisation_chart';

    const isFormerCag = formSubTopic === 'Former CAGs Gallery' ||
      formSubTopic.toLowerCase().includes('former') ||
      formTable === 'cag_revamp.former_cag';

    const isHistory = formSubTopic === 'History of IAAD' ||
      formSubTopic.toLowerCase().includes('history');

    const isBoard = formSubTopic === 'Audit-Advisory-Board' ||
      formSubTopic.toLowerCase().includes('advisory');

    const isActsOrRegulations = formSubTopic === 'Audit-Regulation' ||
      formSubTopic === 'Duties-&-Powers-Act' ||
      formSubTopic === 'Constitutional-Provisions' ||
      formSubTopic.toLowerCase().includes('regulation') ||
      formSubTopic.toLowerCase().includes('duties');

    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white flex flex-col rounded-[12px] shadow-sm border border-[#EDE9E9] overflow-hidden animate-fadeIn font-sans">
        <div className="px-6 py-4 border-b border-[#EDE9E9] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>← {isHindi ? 'पीछे' : 'Back'}</span>
            </button>
            <h3 className="font-semibold text-[#0F172B] text-[16px] flex items-center gap-2">
              <span>
                {editingRawId
                  ? (isHindi ? 'अनुभाग / अधिकारी संपादित करें' : 'Edit Section / Officer Record')
                  : (isHindi ? 'नया अनुभाग / अधिकारी जोड़ें' : 'Add New Section / Officer Record')}
              </span>
              {isOrgTopic && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FDF2F5] text-[#751639] border border-[#EDE9E9]">
                  Organisation Chart
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={() => setIsFormOpen(false)}
            className="p-1.5 text-[#62748E] hover:text-[#0F172B] hover:bg-[#F8F7F7] rounded-[6px] transition-colors cursor-pointer"
            title={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Category & Subtopic Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {t.category} *
              </label>
              <select
                value={formCategory}
                onChange={(e) => {
                  const newCat = e.target.value as any;
                  setFormCategory(newCat);
                  const defaultSt = SUBTOPICS_BY_CATEGORY[newCat]?.[0];
                  if (defaultSt) {
                    setFormSubTopic(defaultSt.label);
                    setFormSlug(defaultSt.defaultSlug);
                    setFormPublicUrl(defaultSt.defaultUrl);
                    setFormTable(defaultSt.defaultTable);
                  }
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                Sub-Topic *
              </label>
              <select
                value={formSubTopic}
                onChange={(e) => {
                  const st = e.target.value;
                  setFormSubTopic(st);
                  const matched = SUBTOPICS_BY_CATEGORY[formCategory]?.find(s => s.label === st);
                  if (matched) {
                    setFormSlug(matched.defaultSlug);
                    setFormPublicUrl(matched.defaultUrl);
                    setFormTable(matched.defaultTable);
                  }
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
              >
                {(SUBTOPICS_BY_CATEGORY[formCategory] || []).map((s) => (
                  <option key={s.value} value={s.label}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SPECIALIZED ORG CHART OFFICER CONTROLS (Levels, Positions, Pics, etc.) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {isOrgTopic ? (
            <div className="space-y-6 pt-2 border-t border-[#EDE9E9]">
              {/* SECTION 1: Hierarchy Level & Tree Position Placement */}
              <div className="bg-[#FAF9F9] border border-[#EDE9E9] rounded-[10px] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#751639] text-white flex items-center justify-center text-xs font-bold">1</div>
                  <h4 className="text-[14px] font-bold text-[#0F172B]">
                    {isHindi ? 'पदानुक्रम स्तर और वृक्ष स्थिति नियंत्रण' : 'Officer Hierarchy Level & Tree Card Placement'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Level Dropdown */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Hierarchy Level *
                    </label>
                    <select
                      value={formLevel}
                      onChange={(e) => {
                        const lvl = Number(e.target.value);
                        setFormLevel(lvl);
                        if (lvl === 0) {
                          setFormPosition('center');
                          setFormDesignationEn('Comptroller and Auditor General of India');
                          setFormDesignationHi('भारत के नियंत्रक और महालेखापरीक्षक');
                        } else if (lvl === 1) {
                          setFormPosition('right');
                          setFormDesignationEn('Secretary to CAG');
                          setFormDesignationHi('नियंत्रक एवं महालेखापरीक्षक के सचिव');
                        } else if (lvl === 2) {
                          setFormDesignationEn('Deputy Comptroller & Auditor General');
                          setFormDesignationHi('उप नियंत्रक एवं महालेखापरीक्षक');
                        } else if (lvl === 3) {
                          setFormDesignationEn('Additional Deputy Comptroller & Auditor General');
                          setFormDesignationHi('अपर उप नियंत्रक एवं महालेखापरीक्षक');
                        } else if (lvl === 4) {
                          setFormDesignationEn('Director General / Principal Director');
                          setFormDesignationHi('महानिदेशक / प्रधान निदेशक');
                        } else {
                          setFormDesignationEn('Director / Deputy Director');
                          setFormDesignationHi('निदेशक / उप निदेशक');
                        }
                      }}
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] font-medium focus:outline-none focus:border-[#751639]"
                    >
                      <option value={0}>Level 0: CAG of India (Top Apex Card)</option>
                      <option value={1}>Level 1: Secretary to CAG (Executive Secretariat)</option>
                      <option value={2}>Level 2: Deputy CAG (DAI - Constitutional Rank)</option>
                      <option value={3}>Level 3: Additional Deputy CAG (ADAI / Principal)</option>
                      <option value={4}>Level 4: Director General / Principal Director (DG/PD)</option>
                      <option value={5}>Level 5: Director / Deputy Director / Section Head</option>
                    </select>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      Determines vertical seniority in tree calculation
                    </span>
                  </div>

                  {/* Placement Column */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Tree Column Placement *
                    </label>
                    <select
                      value={formPosition}
                      onChange={(e) => setFormPosition(e.target.value as any)}
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] font-medium focus:outline-none focus:border-[#751639]"
                    >
                      <option value="center">Center (Apex - Level 0 / 1 Top)</option>
                      <option value="left">Left Column (Left Wing of Trunk)</option>
                      <option value="right">Right Column (Right Wing of Trunk)</option>
                    </select>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      Controls left/right SVG connection branch
                    </span>
                  </div>

                  {/* Display Order Sequence */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Display Order / Sequence # *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(Number(e.target.value) || 1)}
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] font-medium focus:outline-none focus:border-[#751639]"
                    />
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                      Order within level (1, 2, 3...)
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Officer Photo Upload & Live Avatar Preview */}
              <div className="bg-[#FAF9F9] border border-[#EDE9E9] rounded-[10px] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#751639] text-white flex items-center justify-center text-xs font-bold">2</div>
                  <h4 className="text-[14px] font-bold text-[#0F172B]">
                    {isHindi ? 'अधिकारी का प्रोफाइल फोटो / चित्र' : 'Officer Profile Photo & Avatar'}
                  </h4>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Circular Avatar Preview */}
                  <div className="relative shrink-0">
                    {formThumbImage ? (
                      <div className="relative group">
                        <img
                          src={formThumbImage}
                          alt="Officer Preview"
                          className="w-20 h-20 rounded-full object-cover border-3 border-[#751639] shadow-md bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setFormThumbImage('')}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-sm hover:bg-red-700 transition-colors"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#FDF2F5] border-2 border-dashed border-[#751639]/40 flex flex-col items-center justify-center text-[#751639]">
                        <ImageIcon className="w-6 h-6 opacity-60" />
                        <span className="text-[10px] font-medium mt-0.5">Avatar</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions & URL input */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        ref={imgInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingImg}
                        onClick={() => imgInputRef.current?.click()}
                        className="px-4 py-2 bg-white border border-[#EDE9E9] rounded-[8px] text-[13px] font-semibold text-[#751639] hover:bg-[#FDF2F5] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImg ? 'Uploading...' : 'Upload Officer Photo'}</span>
                      </button>
                      <span className="text-xs text-zinc-500">or paste image URL below:</span>
                    </div>

                    <input
                      type="text"
                      value={formThumbImage}
                      onChange={(e) => setFormThumbImage(e.target.value)}
                      placeholder="https://.../officer-photo.jpg (Direct Image URL)"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[12px] font-mono text-[#314158] focus:outline-none focus:border-[#751639]"
                    />
                    <p className="text-[11px] text-zinc-500">
                      Supports JPG, PNG, WebP. Leaves clean vector SVG icon fallback if empty.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Officer Identity & Titles (Bilingual) */}
              <div className="bg-[#FAF9F9] border border-[#EDE9E9] rounded-[10px] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#751639] text-white flex items-center justify-center text-xs font-bold">3</div>
                  <h4 className="text-[14px] font-bold text-[#0F172B]">
                    {isHindi ? 'अधिकारी का नाम एवं पदनाम (द्विभाषी)' : 'Officer Name & Designation (Bilingual)'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name EN */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Officer Full Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitleEn}
                      onChange={(e) => setFormTitleEn(e.target.value)}
                      placeholder="e.g. Shri Subir Mallick"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] font-medium focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  {/* Name HI */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      अधिकारी का नाम (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={formTitleHi}
                      onChange={(e) => setFormTitleHi(e.target.value)}
                      placeholder="उदा. श्री सुबीर मल्लिक"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] font-hindi font-medium focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  {/* Designation EN */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Designation / Rank (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formDesignationEn}
                      onChange={(e) => setFormDesignationEn(e.target.value)}
                      placeholder="e.g. Deputy Comptroller & Auditor General"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  {/* Designation HI */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      पदनाम (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={formDesignationHi}
                      onChange={(e) => setFormDesignationHi(e.target.value)}
                      placeholder="उदा. उप नियंत्रक एवं महालेखापरीक्षक"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] font-hindi focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Portfolio Charges & Contact Information */}
              <div className="bg-[#FAF9F9] border border-[#EDE9E9] rounded-[10px] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#751639] text-white flex items-center justify-center text-xs font-bold">4</div>
                  <h4 className="text-[14px] font-bold text-[#0F172B]">
                    {isHindi ? 'कार्य प्रभार और संपर्क विवरण' : 'Executive Portfolio Charges & Contact Details'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Portfolio EN */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Executive Portfolio / Charges (English) *
                    </label>
                    <input
                      type="text"
                      value={formDepartmentEn}
                      onChange={(e) => setFormDepartmentEn(e.target.value)}
                      placeholder="e.g. Defence / Commercial & IT / Central Revenue"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  {/* Portfolio HI */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      कार्य प्रभार (हिन्दी)
                    </label>
                    <input
                      type="text"
                      value={formDepartmentHi}
                      onChange={(e) => setFormDepartmentHi(e.target.value)}
                      placeholder="उदा. रक्षा / वाणिज्यिक और आईटी / केंद्रीय राजस्व"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] font-hindi focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Official Email ID
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="e.g. officer@cag.gov.in"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] font-mono text-[#314158] focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Official Telephone / Intercom
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 011-23239821"
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[13px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: Reporting Offices / Field Directorates (Bilingual) */}
              <div className="bg-[#FAF9F9] border border-[#EDE9E9] rounded-[10px] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#751639] text-white flex items-center justify-center text-xs font-bold">5</div>
                  <h4 className="text-[14px] font-bold text-[#0F172B]">
                    {isHindi ? 'रिपोर्टिंग कार्यालय एवं क्षेत्र निदेशालय' : 'Reporting Offices & Field Directorates'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      Offices / Officers Reporting (English)
                    </label>
                    <textarea
                      rows={3}
                      value={formReportingOfficesEn}
                      onChange={(e) => setFormReportingOfficesEn(e.target.value)}
                      placeholder="Enter field directorates, regional audit offices, or subordinate wings reporting to this officer..."
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] p-3 text-[13px] text-[#314158] focus:outline-none focus:border-[#751639]"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-[#314158] mb-1">
                      रिपोर्टिंग कार्यालय/अधिकारी (हिन्दी)
                    </label>
                    <textarea
                      rows={3}
                      value={formReportingOfficesHi}
                      onChange={(e) => setFormReportingOfficesHi(e.target.value)}
                      placeholder="इस अधिकारी को रिपोर्ट करने वाले क्षेत्रीय लेखापरीक्षा कार्यालय या अधीनस्थ विंग दर्ज करें..."
                      className="w-full bg-white border border-[#EDE9E9] rounded-[8px] p-3 text-[13px] text-[#314158] font-hindi focus:outline-none focus:border-[#751639]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : isFormerCag ? (
            /* ═══════════════════════════════════════════════════════════ */
            /* SPECIALIZED FORMER CAG CONTROLS */
            /* ═══════════════════════════════════════════════════════════ */
            <div className="space-y-4 pt-2 border-t border-[#EDE9E9]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                    Former CAG Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="e.g. Shri V. Narahari Rao"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                    पूर्व सीएजी का नाम (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={formTitleHi}
                    onChange={(e) => setFormTitleHi(e.target.value)}
                    placeholder="उदा. श्री वी. नरहरि राव"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] font-hindi focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                    Tenure From (Start Date)
                  </label>
                  <input
                    type="text"
                    value={formTenureFrom}
                    onChange={(e) => setFormTenureFrom(e.target.value)}
                    placeholder="e.g. 15 August 1948"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                    Tenure To (End Date)
                  </label>
                  <input
                    type="text"
                    value={formTenureTo}
                    onChange={(e) => setFormTenureTo(e.target.value)}
                    placeholder="e.g. 15 August 1954"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                  Biographical Overview / Legacy Summary
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Enter tenure highlights, institutional reforms, and notable contributions..."
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════ */
            /* STANDARD / GENERIC SUBTOPIC FORM */
            /* ═══════════════════════════════════════════════════════════ */
            <div className="space-y-4 pt-2 border-t border-[#EDE9E9]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                    {t.title} (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    placeholder="Enter title in English"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                    {t.title} (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={formTitleHi}
                    onChange={(e) => setFormTitleHi(e.target.value)}
                    placeholder="हिन्दी शीर्षक दर्ज करें"
                    className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] font-hindi focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                  {t.description} / Summary
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Enter detailed content overview or summary..."
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
                />
              </div>
            </div>
          )}

          {/* Public URL & Publication Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EDE9E9]">
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                Public Website Route
              </label>
              <input
                type="text"
                value={formPublicUrl}
                onChange={(e) => setFormPublicUrl(e.target.value)}
                placeholder="/About/About-Us/..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] font-mono text-[#314158] focus:outline-none focus:border-[#751639]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {t.status}
              </label>
              <select
                value={formIsActive ? 'Active' : 'Inactive'}
                onChange={(e) => setFormIsActive(e.target.value === 'Active')}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639]"
              >
                <option value="Active">{t.active}</option>
                <option value="Inactive">{t.inactive}</option>
              </select>
            </div>
          </div>

          {/* Non-Org File Attachments (Thumb Image & PDF) */}
          {!isOrgTopic && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EDE9E9]">
              <div>
                <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                  Thumbnail Image
                </label>
                <input
                  ref={imgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploadingImg}
                    onClick={() => imgInputRef.current?.click()}
                    className="px-3 py-2 bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] text-[13px] font-medium text-[#751639] hover:bg-[#FDF2F5] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImg ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                  <input
                    type="text"
                    value={formThumbImage}
                    onChange={(e) => setFormThumbImage(e.target.value)}
                    placeholder="Image URL..."
                    className="flex-1 bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[12px] font-mono text-[#314158] focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                  Attached PDF / Document
                </label>
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xlsx"
                  onChange={handleDocUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={uploadingDoc}
                    onClick={() => docInputRef.current?.click()}
                    className="px-3 py-2 bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] text-[13px] font-medium text-[#751639] hover:bg-[#FDF2F5] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>{uploadingDoc ? 'Uploading...' : 'Upload PDF'}</span>
                  </button>
                  <input
                    type="text"
                    value={formFileUrl}
                    onChange={(e) => setFormFileUrl(e.target.value)}
                    placeholder="Document URL..."
                    className="flex-1 bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[12px] font-mono text-[#314158] focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-[#EDE9E9] pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-[8px] border border-[#EDE9E9] text-[#62748E] font-medium text-[13px] hover:bg-[#F8F7F7] cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={uploadingDoc || uploadingImg}
              className="px-6 py-2 rounded-[8px] text-white font-semibold text-[13px] shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              {editingRawId ? (isOrgTopic ? 'Update Officer & Tree' : t.update) : (isOrgTopic ? 'Add Officer to Tree' : t.save)}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ─── 4. LIST / TABLE VIEW ───
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* ─── Top Burgundy Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#EDE9E9]">
        <div>
          <h1 className="text-[20px] font-semibold text-[#751639] leading-tight">
            {isHindi ? 'हमारे बारे में प्रबंधन' : 'About Us Management'}
          </h1>
          <p className="text-[13px] text-[#62748E] mt-1">
            {isHindi ? 'सभी संगठनात्मक विवरण, नीतियां, अधिनियम और प्रशासनिक रिकॉर्ड प्रबंधित करें' : 'Manage organizational details, vision, history, mandate, acts, and institutional policies'}
          </p>
        </div>

        {/* Dynamic Category Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-[8px] bg-[#FDF2F5] border border-[#EDE9E9] text-xs font-semibold text-[#751639] flex items-center gap-1.5">
            <span>{isHindi ? 'कुल रिकॉर्ड' : 'Total Records'}:</span>
            <span className="bg-[#751639] text-white px-2 py-0.5 rounded-full text-[11px] font-bold">{categoryStats.total}</span>
          </div>
          <div className="px-3 py-1.5 rounded-[8px] bg-white border border-[#EDE9E9] text-xs font-medium text-[#62748E] flex items-center gap-1.5">
            <span>{isHindi ? 'हम कौन हैं' : 'Who We Are'}:</span>
            <span className="font-bold text-[#314158]">{categoryStats.whoWeAre}</span>
          </div>
          <div className="px-3 py-1.5 rounded-[8px] bg-white border border-[#EDE9E9] text-xs font-medium text-[#62748E] flex items-center gap-1.5">
            <span>{isHindi ? 'नेतृत्व और विरासत' : 'Leadership & Legacy'}:</span>
            <span className="font-bold text-[#314158]">{categoryStats.leadership}</span>
          </div>
          <div className="px-3 py-1.5 rounded-[8px] bg-white border border-[#EDE9E9] text-xs font-medium text-[#62748E] flex items-center gap-1.5">
            <span>{isHindi ? 'शासन और अधिदेश' : 'Governance & Mandate'}:</span>
            <span className="font-bold text-[#314158]">{categoryStats.governance}</span>
          </div>
        </div>
      </div>

      {/* ─── CARD 1: Search & Filter (Figma Design) ─── */}
      <div className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden shadow-[0px_1px_4px_rgba(0,0,0,0.04)]">
        <div className="h-[60px] px-6 border-b border-[#EDE9E9] flex items-center gap-3">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center text-[#751639]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <span className="text-[14px] font-semibold text-[#0F172B]">
            {t.searchAndFilter}
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {t.searchFor}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.enterKeywords}
                  value={searchFor}
                  onChange={(e) => setSearchFor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] transition-all"
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#90A1B9] pointer-events-none" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {t.category}
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSubTopicFilter('All');
                  setPage(1);
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] transition-all cursor-pointer"
              >
                <option value="All">{isHindi ? 'सभी श्रेणियां' : 'All Categories'}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub-Topic Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {isHindi ? 'उप-विषय / अनुभाग' : 'Sub-Topic / Section'}
              </label>
              <select
                value={subTopicFilter}
                onChange={(e) => {
                  setSubTopicFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] transition-all cursor-pointer"
              >
                {subTopicOptions.map((st) => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>

            {/* Publication Status */}
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {t.status}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] transition-all cursor-pointer"
              >
                <option value="All">{t.allStatuses}</option>
                <option value="Active">{t.active}</option>
                <option value="Inactive">{t.inactive}</option>
              </select>
            </div>
          </div>

          {/* Second Row: Language, Sort, and Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#EDE9E9]">
            {/* Language Mode */}
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {isHindi ? 'भाषा' : 'Language Mode'}
              </label>
              <select
                value={languageFilter}
                onChange={(e) => {
                  setLanguageFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] transition-all cursor-pointer"
              >
                <option value="All">{isHindi ? 'सभी भाषाएं' : 'All Languages'}</option>
                <option value="Bilingual">{isHindi ? 'द्विभाषी (अंग्रेजी + हिन्दी)' : 'Bilingual (EN + HI)'}</option>
                <option value="EN">{isHindi ? 'केवल अंग्रेजी' : 'English Only'}</option>
                <option value="HI">{isHindi ? 'केवल हिन्दी' : 'हिन्दी Only'}</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[13px] font-medium text-[#314158] mb-1.5">
                {isHindi ? 'क्रमबद्ध करें' : 'Sort Order'}
              </label>
              <select
                value={sortFilter}
                onChange={(e) => {
                  setSortFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] transition-all cursor-pointer"
              >
                <option value="newest">{isHindi ? 'नवीनतम पहले' : 'Newly Added First'}</option>
                <option value="title_asc">{isHindi ? 'शीर्षक (A to Z)' : 'Title / Name (A to Z)'}</option>
                <option value="title_desc">{isHindi ? 'शीर्षक (Z to A)' : 'Title / Name (Z to A)'}</option>
                <option value="category_asc">{isHindi ? 'श्रेणी अनुसार' : 'Category (Hierarchy)'}</option>
                <option value="id_asc">{isHindi ? 'आईडी (आरोही)' : 'Record ID (Ascending)'}</option>
                <option value="id_desc">{isHindi ? 'आईडी (अवरोही)' : 'Record ID (Descending)'}</option>
                <option value="oldest">{isHindi ? 'पुरातन पहले' : 'Oldest Added First'}</option>
              </select>
            </div>

            <div className="lg:col-span-2 flex items-end justify-end gap-3">
              <button
                type="button"
                onClick={handleSearchReset}
                className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] text-[#701537] font-medium text-[14px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.reset}</span>
              </button>
              <button
                type="button"
                onClick={handleSearchGo}
                className="w-[132px] h-[35px] rounded-[8px] text-white shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 font-semibold text-[14px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t.search}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CARD 2: Table Data Registry (Figma Design) ─── */}
      <div className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden shadow-[0px_1px_4px_rgba(0,0,0,0.04)] mb-12">
        {/* Table Card Header */}
        <div className="px-6 py-4 border-b border-[#EDE9E9] flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-[#0F172B]">
              {isHindi ? 'हमारे बारे में अनुभाग रजिस्ट्री' : 'About Us Section Registry'}
            </h2>
            <span className="text-[13px] text-[#62748E] font-normal">
              ({totalCount.toLocaleString()} {isHindi ? 'रिकॉर्ड' : 'records'})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[13px] text-[#62748E]">
              <span>{t.rowsPerPage}:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#F8F7F7] border border-[#EDE9E9] rounded-[6px] px-2 py-1 text-[13px] text-[#314158] focus:outline-none focus:border-[#751639] cursor-pointer"
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
                className="h-[35px] px-4 rounded-[8px] text-white shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95 font-semibold text-[13px] transition-all cursor-pointer flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? 'नया अनुभाग जोड़ें' : 'Add Section Record'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center w-16">
                  {t.sNo}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-24 text-center">
                  {t.image}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider min-w-[280px]">
                  {t.title}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-40">
                  {t.category}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-48">
                  {isHindi ? 'अनुभाग' : 'Sub-Topic'}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-24 text-center">
                  {isHindi ? 'भाषा' : 'Lang'}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider w-28 text-center">
                  {t.status}
                </th>
                <th className="px-4 py-3.5 text-[12px] font-semibold text-[#90A1B9] uppercase tracking-wider text-center min-w-[220px]">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE9E9]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-[#62748E]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin" />
                      <span>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-[#62748E]">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                records.map((item, idx) => (
                  <tr key={item.rawId ? `${item.rawId}-${item.id || idx}` : `about-${idx}`} className="hover:bg-[#FDFBFC] transition-colors">
                    {/* ID */}
                    <td className="px-4 py-3.5 text-center font-bold text-[#751639] text-[13px]">
                      {item.formattedId || `#${(page - 1) * pageSize + idx + 1}`}
                    </td>

                    {/* Photo / Thumbnail Preview */}
                    <td className="px-4 py-3.5 text-center">
                      <FilePreviewAction
                        url={item.thumb_image || item.file_url || ''}
                        type={item.thumb_image ? 'image' : (item.file_url ? 'file' : undefined)}
                        showThumbnail={true}
                        alt={getText(item.title_en, item.title_hi)}
                      />
                    </td>

                    {/* Title & Subtitle */}
                    <td className="px-4 py-3.5">
                      <div
                        className="font-medium text-[14px] text-[#0F172B] hover:text-[#751639] cursor-pointer line-clamp-2"
                        onClick={() => handleOpenView(item)}
                        title="Click to view details"
                      >
                        {getText(item.title_en, item.title_hi)}
                      </div>
                      {item.title_hi && isHindi !== true && (
                        <div className="text-[12px] text-[#62748E] font-hindi line-clamp-1 mt-0.5">
                          {item.title_hi}
                        </div>
                      )}
                      {item.desc && (
                        <div className="text-[12px] text-[#90A1B9] line-clamp-1 mt-0.5">
                          {item.desc}
                        </div>
                      )}
                    </td>

                    {/* Category Badge */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#F8F7F7] border border-[#EDE9E9] text-[#314158]">
                        {item.category}
                      </span>
                    </td>

                    {/* Subtopic */}
                    <td className="px-4 py-3.5 text-[13px] text-[#62748E]">
                      {item.subTopic}
                    </td>

                    {/* Language Badge */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.title_hi
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.title_hi ? 'Bilingual' : 'EN'}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                        item.is_active
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'
                          : 'bg-[#FDF4F0] text-[#DC2626] border border-[#FEE2E2]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`} />
                        {item.is_active ? t.active : t.inactive}
                      </span>
                    </td>

                    {/* Action Icons */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Modal */}
                        <button
                          onClick={() => handleOpenView(item)}
                          className="p-1.5 rounded-[6px] hover:bg-[#F8F7F7] text-[#62748E] transition-colors cursor-pointer"
                          title={t.view}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Unique Edit Button: Distinct Visual Live Edit for static pages, Standard Edit for collections */}
                        {(() => {
                          const sub = (item.subTopicSlug || item.subTopic || '').toLowerCase();
                          const rawId = (item.rawId || '').toLowerCase();
                          const isStaticPage = !sub.includes('former') && !rawId.includes('former') && !sub.includes('organisation') && !sub.includes('organization') && !rawId.includes('org-');

                          if (isStaticPage) {
                            return (
                              <button
                                onClick={() => setVisualEditingRecord(item)}
                                className="px-2 py-1 rounded-[6px] bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 border border-amber-200/90 shadow-xs transition-all cursor-pointer flex items-center gap-1 group"
                                title={isHindi ? 'विजुअल लाइव एडिटर खोलें' : 'Open Visual Live WYSIWYG Editor'}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-semibold tracking-tight">
                                  {isHindi ? 'लाइव एडिट' : 'Live Edit'}
                                </span>
                              </button>
                            );
                          }

                          return (
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-[6px] hover:bg-[#FDF2F5] text-[#751639] transition-colors cursor-pointer"
                              title={t.edit}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          );
                        })()}

                        {/* Public Link */}
                        {item.public_url && (
                          <Link
                            href={item.public_url}
                            target="_blank"
                            className="p-1.5 rounded-[6px] hover:bg-[#F8F7F7] text-[#62748E] transition-colors cursor-pointer"
                            title="Open public page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.rawId)}
                          className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                          title={t.delete}
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#EDE9E9] flex flex-wrap items-center justify-between gap-4">
          <div className="text-[13px] text-[#62748E]">
            {t.showing} {records.length > 0 ? (page - 1) * pageSize + 1 : 0} {t.to} {Math.min(page * pageSize, totalCount)} {t.of} {totalCount} {t.entries}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#94A3B8] hover:bg-zinc-50 hover:border-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              title={t.previous}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 5) {
                if (page > 3 && page < totalPages - 2) {
                  pageNum = page - 2 + idx;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                }
              }

              const isActive = page === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-[8px] text-[14px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-[#751639] text-white font-semibold shadow-xs'
                      : 'text-[#1D4ED8] hover:bg-zinc-100'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] hover:bg-zinc-50 hover:border-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              title={t.next}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAboutRegistry() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-[#62748E]">
        <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading About Us Admin Registry...</span>
      </div>
    }>
      <AdminAboutRegistryContent />
    </Suspense>
  );
}
