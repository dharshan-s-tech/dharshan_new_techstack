'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, ReportItem as DataReportItem } from '@/lib/dataManager';
import SearchableStateSelect from '@/components/admin/SearchableStateSelect';
import { Pencil, Eye, Trash2, ExternalLink, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilePreviewAction } from '@/components/admin/ListClientHelpers';
import { useAdminLanguage } from '@/lib/useAdminLanguage';

interface StateLookup {
  id: number;
  name: string;
}

interface ChapterItem {
  id: number | string;
  title: string;
  file_name?: string;
  file_url?: string;
  size?: string;
}

interface ReportDisplayItem {
  id: number | string;
  rawId: string;
  title_en: string;
  title_hi?: string;
  report_type: string;
  sector: string;
  level?: string;
  year_of_report: number | string;
  tabled_date?: string;
  is_active: boolean;
  image?: string;
  desc?: string;
  pdf_url?: string;
  file_name?: string;
  video_url?: string;
  source?: string;
  chapters?: ChapterItem[];
}

function AdminReportsContent() {
  const API_URL = getApiBaseUrl();
  const { isHindi, t } = useAdminLanguage();
  const [reports, setReports] = useState<ReportDisplayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  
  // Filter Fields
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [reportTypeFilter, setReportTypeFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('newest');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Sync URL Query Parameters to Filter States
  useEffect(() => {
    const levelParam = searchParams.get('level');
    const typeParam = searchParams.get('type');
    const sectorParam = searchParams.get('sector');
    if (levelParam) setLevelFilter(levelParam);
    if (typeParam) setReportTypeFilter(typeParam);
    if (sectorParam) setSectorFilter(sectorParam);
    if (!levelParam && !typeParam && !sectorParam) {
      setLevelFilter('All');
      setReportTypeFilter('All');
      setSectorFilter('All');
    }
    setPage(1);
  }, [searchParams]);

  // Dropdown Lookups
  const [sectors, setSectors] = useState<string[]>([
    'Finance', 'Transport & Infrastructure', 'Education, Health & Family Welfare', 
    'Environment and Sustainable Development', 'IT Audit', 'Defence and National Security', 
    'Commercial', 'Agriculture and Rural Development', 'Local Bodies'
  ]);
  const [reportTypes, setReportTypes] = useState<string[]>(['Compliance', 'Financial', 'Performance', 'ADC reports']);
  const [states, setStates] = useState<StateLookup[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([
    '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'
  ]);

  // View Details Modal State
  const [viewingReport, setViewingReport] = useState<ReportDisplayItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Form State (Create / Edit Drawer)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRawId, setEditingRawId] = useState<string | null>(null);
  
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [overviewEn, setOverviewEn] = useState('');
  const [govLevel, setGovLevel] = useState('Union');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [reportType, setReportType] = useState('Performance');
  const [sector, setSector] = useState('Finance');
  const [yearOfReport, setYearOfReport] = useState(new Date().getFullYear());
  const [cardImage, setCardImage] = useState('https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
  const [mainReportFile, setMainReportFile] = useState('#');
  const [uploadedPdfName, setUploadedPdfName] = useState('');
  const [uploadedPdfSize, setUploadedPdfSize] = useState('');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [highlightQuote, setHighlightQuote] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [portraitImage, setPortraitImage] = useState('');
  const [formChapters, setFormChapters] = useState<{ id: string; title: string; pdf_url: string; size?: string }[]>([]);

  // Load Filters & Lookup dictionaries
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reports/filters`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.sectors) && data.sectors.length > 0) {
            setSectors(data.sectors.filter((s: string) => s !== 'All Sectors'));
          }
          if (Array.isArray(data.report_types) && data.report_types.length > 0) {
            setReportTypes(data.report_types.filter((t: string) => t !== 'All'));
          }
          if (Array.isArray(data.states) && data.states.length > 0) {
            setStates(data.states);
          }
          if (Array.isArray(data.years) && data.years.length > 0) {
            setAvailableYears(data.years.filter((y: string) => y && y !== 'All Years'));
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic filters:', err);
      }
    };
    loadLookups();
  }, [API_URL]);

  const loadData = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      if (appliedSearch) params.set('query', appliedSearch);
      if (statusFilter !== 'All') params.set('status', statusFilter.toLowerCase());
      else params.set('status', 'all');
      if (sectorFilter !== 'All') params.set('sector', sectorFilter);
      if (levelFilter !== 'All') params.set('level', levelFilter);
      if (reportTypeFilter !== 'All') params.set('type', reportTypeFilter);
      if (yearFilter !== 'All') params.set('year', yearFilter);
      if (stateFilter !== 'All') params.set('state_id', stateFilter);
      if (sortFilter) params.set('sort', sortFilter);

      const res = await fetch(`${API_URL}/api/reports?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const items: ReportDisplayItem[] = (data.items || []).map((r: any, idx: number) => ({
          id: (page - 1) * pageSize + idx + 1,
          rawId: r.id,
          title_en: r.title,
          title_hi: r.title_hi,
          report_type: r.report_type || r.type || 'Performance',
          sector: r.sector || 'Finance',
          level: r.level || 'Union',
          year_of_report: r.year || '2026',
          tabled_date: r.tabled_date,
          is_active: r.is_active !== undefined ? Boolean(r.is_active) : (r.status === 1 || r.status === 'Active' || r.status === true),
          image: r.image,
          desc: r.overview || r.desc,
          pdf_url: r.pdf_url,
          file_name: r.file_name,
          video_url: r.video_url,
          source: r.source,
          chapters: r.chapters || []
        }));

        setReports(items);
        setTotalCount(data.total || 0);
        setTotalPages(data.total_pages || 1);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('API error, falling back to local store:', err);
    }

    // Local fallback
    const localReports = dataManager.getReports();
    let formatted: ReportDisplayItem[] = localReports.map((r, idx) => ({
      id: idx + 1,
      rawId: r.id,
      title_en: r.title,
      title_hi: r.title_hi,
      report_type: r.type || 'Performance',
      sector: r.sector || 'Finance',
      level: r.level || 'Union',
      year_of_report: parseInt(r.year) || 2026,
      tabled_date: r.tabledDate,
      is_active: true,
      image: r.image,
      desc: r.desc,
      pdf_url: r.pdfUrl,
      video_url: r.videoUrl
    }));

    if (appliedSearch) {
      formatted = formatted.filter(r => r.title_en.toLowerCase().includes(appliedSearch.toLowerCase()));
    }
    if (sectorFilter !== 'All') {
      formatted = formatted.filter(r => r.sector.toLowerCase() === sectorFilter.toLowerCase());
    }
    if (levelFilter !== 'All') {
      formatted = formatted.filter(r => (r.level || '').toLowerCase() === levelFilter.toLowerCase());
    }
    if (reportTypeFilter !== 'All') {
      formatted = formatted.filter(r => (r.report_type || '').toLowerCase() === reportTypeFilter.toLowerCase());
    }
    if (yearFilter !== 'All') {
      formatted = formatted.filter(r => r.year_of_report?.toString() === yearFilter);
    }

    // Local sorting
    const parseId = (val: any) => {
      const match = String(val || '').match(/\d+/g);
      return match ? parseInt(match.join(''), 10) : 0;
    };
    const parseYear = (val: any) => {
      const match = String(val || '').match(/\d{4}/);
      return match ? parseInt(match[0], 10) : 0;
    };

    if (sortFilter === 'newest') {
      formatted.sort((a, b) => parseId(b.rawId || b.id) - parseId(a.rawId || a.id));
    } else if (sortFilter === 'oldest') {
      formatted.sort((a, b) => parseId(a.rawId || a.id) - parseId(b.rawId || b.id));
    } else if (sortFilter === 'year_desc') {
      formatted.sort((a, b) => (parseYear(b.year_of_report) - parseYear(a.year_of_report)) || (parseId(b.rawId || b.id) - parseId(a.rawId || a.id)));
    } else if (sortFilter === 'year_asc') {
      formatted.sort((a, b) => (parseYear(a.year_of_report) - parseYear(b.year_of_report)) || (parseId(a.rawId || a.id) - parseId(b.rawId || b.id)));
    } else if (sortFilter === 'title_asc') {
      formatted.sort((a, b) => (a.title_en || '').localeCompare(b.title_en || ''));
    } else if (sortFilter === 'title_desc') {
      formatted.sort((a, b) => (b.title_en || '').localeCompare(a.title_en || ''));
    } else {
      formatted.sort((a, b) => parseId(b.rawId || b.id) - parseId(a.rawId || a.id));
    }

    setTotalCount(formatted.length);
    setTotalPages(Math.ceil(formatted.length / pageSize) || 1);
    setReports(formatted.slice((page - 1) * pageSize, page * pageSize));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, appliedSearch, statusFilter, sectorFilter, levelFilter, reportTypeFilter, yearFilter, stateFilter, sortFilter]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCardImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please select a valid PDF document (.pdf).');
      return;
    }

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setUploadedPdfName(file.name);
    setUploadedPdfSize(formattedSize);
    setIsUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setMainReportFile(data.url);
          setIsUploadingPdf(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend upload failed, using Data URL fallback:', err);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setMainReportFile(event.target.result as string);
      }
      setIsUploadingPdf(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
    setPage(1);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
    setSectorFilter('All');
    setLevelFilter('All');
    setReportTypeFilter('All');
    setYearFilter('All');
    setStateFilter('All');
    setSortFilter('newest');
    setPage(1);
  };

  const handleOpenView = async (item: ReportDisplayItem) => {
    setViewingReport(item);
    setLoadingDetails(true);
    try {
      const res = await fetch(`${API_URL}/api/reports/${item.rawId}`);
      if (res.ok) {
        const full = await res.json();
        setViewingReport(prev => prev ? {
          ...prev,
          title_en: full.title || prev.title_en,
          title_hi: full.title_hi || prev.title_hi,
          desc: full.overview || full.desc || prev.desc,
          sector: full.sector || prev.sector,
          level: full.level || prev.level,
          report_type: full.report_type || full.type || prev.report_type,
          year_of_report: full.year || prev.year_of_report,
          tabled_date: full.tabled_date || prev.tabled_date,
          pdf_url: full.pdf_url || prev.pdf_url,
          video_url: full.video_url || prev.video_url,
          chapters: full.chapters || prev.chapters || []
        } : null);
      }
    } catch (err) {
      console.warn('Could not fetch complete report details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingRawId(null);
    setTitleEn('');
    setTitleHi('');
    setOverviewEn('');
    setGovLevel('Union');
    setSelectedStateId('');
    setReportType('Performance');
    setSector('Finance');
    setYearOfReport(new Date().getFullYear());
    setCardImage('https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
    setMainReportFile('https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf');
    setUploadedPdfName('');
    setUploadedPdfSize('');
    setVideoUrl('');
    setIsActive(true);
    setHighlightQuote('');
    setRecommendations('');
    setPortraitImage('');
    setFormChapters([]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ReportDisplayItem) => {
    setEditingRawId(item.rawId);
    setTitleEn(item.title_en);
    setTitleHi(item.title_hi || '');
    setOverviewEn(item.desc || '');
    setGovLevel(item.level || 'Union');
    setSelectedStateId('');
    setReportType(item.report_type || 'Performance');
    setSector(item.sector || 'Finance');
    setYearOfReport(parseInt(item.year_of_report?.toString() || '2026') || 2026);
    setCardImage(item.image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg');
    setMainReportFile(item.pdf_url || '#');
    setUploadedPdfName(item.pdf_url ? item.pdf_url.split('/').pop() || '' : '');
    setUploadedPdfSize('');
    setVideoUrl(item.video_url || '');
    setIsActive(item.is_active ?? true);
    setHighlightQuote((item as any).highlight_quote || (item as any).quote || '');
    setRecommendations((item as any).recommendations || '');
    setPortraitImage((item as any).portrait_image || '');
    setFormChapters((item.chapters || []).map((ch: any) => ({
      id: String(ch.id || `ch-${Date.now()}`),
      title: ch.title,
      pdf_url: ch.file_url || ch.pdf_url || '#',
      size: ch.size || '12.4 MB'
    })));
    setIsFormOpen(true);
  };

  const handleDelete = async (rawId: string) => {
    if (!confirm('Are you sure you want to delete this audit report card?')) return;
    
    try {
      await fetch(`${API_URL}/api/reports/${rawId}`, { method: 'DELETE' });
    } catch {}

    dataManager.deleteReport(rawId);
    loadData();
    if (viewingReport?.rawId === rawId) {
      setViewingReport(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingRawId || `rep-local-${Date.now()}`;

    const record: DataReportItem = {
      id: targetId,
      title: titleEn,
      title_hi: titleHi,
      image: cardImage,
      tag: sector || 'Finance',
      date: 'Jun 4, 2026',
      year: yearOfReport.toString(),
      sector: sector,
      level: govLevel,
      type: reportType,
      isFeatured: true,
      label: sector,
      desc: overviewEn || titleEn,
      pdfUrl: mainReportFile,
      videoUrl: videoUrl,
      chapters: formChapters
    };

    let finalId = targetId;
    // 1. Send to Backend API
    try {
      const method = editingRawId ? 'PUT' : 'POST';
      const endpoint = editingRawId ? `${API_URL}/api/reports/${editingRawId}` : `${API_URL}/api/reports`;
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          overview: overviewEn,
          status: isActive ? 1 : 0,
          is_active: isActive,
          state_id: selectedStateId ? parseInt(selectedStateId) : undefined,
          highlight_quote: highlightQuote,
          recommendations: recommendations,
          portrait_image: portraitImage,
          chapters: formChapters
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (json.id || json.rawId)) {
          finalId = String(json.id || json.rawId);
        }
      }
    } catch (err) {
      console.warn('Could not post to backend, saving in local dataManager:', err);
      dataManager.saveReport({
        ...record,
        id: finalId
      });
    }

    setIsFormOpen(false);
    loadData();
  };


  // ── 1. FULL CONTENT PAGE: VIEW DETAILS ──
  if (viewingReport) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white flex flex-col rounded-[12px] shadow-sm border border-[#EDE9E9] overflow-hidden animate-fadeIn font-sans">
        {/* Header */}
        <div 
          className="px-6 py-4 text-white flex justify-between items-center shrink-0 shadow-md"
          style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewingReport(null)}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Back to Reports Table"
            >
              <span>← Back</span>
            </button>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-pink-200">
                Audit Report Record Details [ID: {viewingReport.rawId}]
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                {viewingReport.title_en}
              </h2>
              {viewingReport.title_hi && (
                <p className="text-xs text-pink-100 font-medium mt-0.5 font-hindi">
                  {viewingReport.title_hi}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setViewingReport(null)}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/30 text-white rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Close</span>
            <span className="text-sm leading-none">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
          <div className="max-w-6xl mx-auto bg-white border border-[#ced4da] shadow-xs p-6 md:p-8 space-y-6">
            
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-zinc-200">
              <span className="px-3 py-1 bg-[#751639] text-white font-bold text-xs rounded-xs">
                {viewingReport.sector}
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-xs rounded-xs">
                Level: {viewingReport.level || 'Union'}
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xs">
                Type: {viewingReport.report_type}
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-xs rounded-xs">
                Year: {viewingReport.year_of_report}
              </span>
              {viewingReport.tabled_date && (
                <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs rounded-xs">
                  Tabled: {viewingReport.tabled_date}
                </span>
              )}
              <span className="ml-auto px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-full">
                ● ACTIVE
              </span>
            </div>

            {/* Banner & Preview */}
            <div className="flex flex-col md:flex-row gap-6 items-start bg-zinc-50 p-5 border border-zinc-200">
              <img
                src={viewingReport.image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'}
                alt="Banner"
                className="h-36 w-56 object-cover border border-zinc-300 shadow-xs bg-white shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg';
                }}
              />
              <div className="space-y-2 flex-1">
                <div className="font-bold text-zinc-900 text-sm">Banner Asset &amp; CloudFront Link</div>
                <p className="text-xs text-zinc-500 break-all font-mono bg-white p-2.5 border border-zinc-200">
                  {viewingReport.image || 'Default Civil Sector Banner'}
                </p>
                <div className="pt-2">
                  <a
                    href={viewingReport.pdf_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>📥 Download Full Report (PDF)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Scope Overview Narrative */}
            <div>
              <h4 className="font-bold text-zinc-900 text-xs mb-2 uppercase tracking-wide text-[#751639]">
                Executive Summary &amp; Scope Overview
              </h4>
              <div className="bg-zinc-50 border border-zinc-200 p-5 text-zinc-700 leading-relaxed text-sm">
                {viewingReport.desc ? (
                  <p>{viewingReport.desc}</p>
                ) : (
                  <p className="italic text-zinc-400">No narrative overview available for this report.</p>
                )}
              </div>
            </div>

            {/* Chapters List (If Available) */}
            {viewingReport.chapters && viewingReport.chapters.length > 0 && (
              <div>
                <h4 className="font-bold text-zinc-900 text-xs mb-2 uppercase tracking-wide text-[#751639]">
                  Report Chapters &amp; Individual Files ({viewingReport.chapters.length})
                </h4>
                <div className="border border-zinc-200 max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5 w-12 text-center">#</th>
                        <th className="px-4 py-2.5">Chapter Title</th>
                        <th className="px-4 py-2.5 w-28 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {viewingReport.chapters.map((ch, cidx) => (
                        <tr key={ch.id || cidx} className="hover:bg-zinc-50">
                          <td className="px-4 py-2.5 text-center text-zinc-400 font-mono">{cidx + 1}</td>
                          <td className="px-4 py-2.5 font-medium text-zinc-800 text-xs">{ch.title}</td>
                          <td className="px-4 py-2.5 text-center">
                            <a
                              href={ch.file_url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#751639] hover:underline font-bold text-xs inline-flex items-center gap-1"
                            >
                              <span>PDF</span>
                              <span>↗</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
          <Link
            href={`/Reports/${viewingReport.rawId}`}
            target="_blank"
            className="px-4 py-2 border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-none transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Page ↗</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const r = viewingReport;
                setViewingReport(null);
                handleOpenEdit(r);
              }}
              className="px-5 py-2 bg-[#751639] hover:bg-[#5a102c] text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={() => {
                const idToDelete = viewingReport.rawId;
                setViewingReport(null);
                handleDelete(idToDelete);
              }}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Record</span>
            </button>
            <button
              onClick={() => setViewingReport(null)}
              className="px-5 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-semibold text-xs rounded-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. FULL CONTENT PAGE: CREATE / EDIT AUDIT REPORT ──
  if (isFormOpen) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white flex flex-col rounded-[12px] shadow-sm border border-[#EDE9E9] overflow-hidden animate-fadeIn font-sans">
        {/* Header */}
        <div
          className="px-6 py-4 text-white flex justify-between items-center shrink-0 shadow-md"
          style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2.5 py-1 transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <h3 className="font-serif text-lg font-bold">
                {editingRawId ? 'Edit Audit Report' : 'Add New Audit Report'}
              </h3>
              <p className="text-[11px] text-white/70">
                {editingRawId ? `Editing Record ID #${editingRawId}` : 'Register new audit publication to CAG registry'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="text-white/70 hover:text-white text-xl font-bold p-1 cursor-pointer"
            title="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#f8f9fa]">
          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white border border-[#ced4da] shadow-xs p-6 md:p-8 space-y-5">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Report Title (English) *</label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                placeholder="Report of the Comptroller and Auditor General of India..."
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Report Title (Hindi)</label>
              <input
                type="text"
                value={titleHi}
                onChange={(e) => setTitleHi(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                placeholder="भारत के नियंत्रक एवं महालेखापरीक्षक का प्रतिवेदन..."
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Executive Summary / Description</label>
              <textarea
                rows={3}
                value={overviewEn}
                onChange={(e) => setOverviewEn(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                placeholder="Overview of audit findings and scope..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Government Level</label>
                <select
                  value={govLevel}
                  onChange={(e) => setGovLevel(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                >
                  <option value="Union">Union (National)</option>
                  <option value="State">State Government</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Audit Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                >
                  {reportTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Audit Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                >
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Publish Status</label>
                <select
                  value={isActive ? 'Active' : 'Inactive'}
                  onChange={(e) => setIsActive(e.target.value === 'Active')}
                  className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Report Year *</label>
                <input
                  type="number"
                  required
                  value={yearOfReport}
                  onChange={(e) => setYearOfReport(parseInt(e.target.value) || 2026)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">State (If State Level)</label>
                <SearchableStateSelect
                  value={selectedStateId}
                  onChange={(val) => setSelectedStateId(val === 'All' ? '' : val)}
                  states={states}
                  placeholder="National / Not Applicable"
                  allLabel="National / Not Applicable"
                  allowAll={true}
                  size="sm"
                />
              </div>
            </div>

            {/* CARD IMAGE FILE UPLOAD */}
            <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-2">
              <label className="block font-bold text-zinc-800 text-xs mb-1">
                Card Banner Picture (File Upload or URL) *
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="cursor-pointer bg-[#751639] hover:bg-[#5f122d] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5">
                  <span>📁 Upload Image</span>
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
                  value={cardImage}
                  onChange={(e) => setCardImage(e.target.value)}
                  className="flex-grow w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="or enter image URL"
                />
              </div>

              {/* 1-Click Sector & Department Asset Presets from live CloudFront CDN */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Or select verified live CDN Asset (from /en/home):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Recent Report', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/01-recent-report-logo.jpg' },
                    { name: 'Digital Report', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/digital_report.png' },
                    { name: 'Health & Welfare', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png' },
                    { name: 'Defence & Security', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png' },
                    { name: 'Transport & Infra', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Transport_and_Infrastructure.jfif' },
                    { name: 'Taxes & Duties', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Taxes_and_duties.png' },
                    { name: 'Local Bodies', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Local_Bodies.jpg' },
                    { name: 'IT & Telecom', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/information_and_communication.jfif' },
                    { name: 'Power & Energy', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/power_and_energy.jpg' },
                    { name: 'Industry & Commerce', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Industry_and_commerce.png' },
                    { name: 'Social Welfare', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/social_welfare.jpeg' },
                    { name: 'Finance', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Finance.png' },
                    { name: 'Environment', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Environment_and_Sustainable_Development.png' },
                    { name: 'Agriculture & Rural', url: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Agriculture_and_Rural_Development.jfif' },
                    { name: 'Civil Dept', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg' },
                    { name: 'Railway Dept', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg' },
                    { name: 'Commercial Dept', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/commercial.jpg' }
                  ].map((dept) => (
                    <button
                      key={dept.name}
                      type="button"
                      onClick={() => setCardImage(dept.url)}
                      className={`text-[10.5px] px-2 py-1 border transition-all cursor-pointer ${
                        cardImage === dept.url
                          ? 'bg-[#751639] text-white border-[#751639] font-bold'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:border-[#751639] hover:text-[#751639]'
                      }`}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </div>

              {cardImage && (
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-[11px] font-bold text-zinc-500">Live Preview:</span>
                  <img
                    src={cardImage}
                    alt="Report Card preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg';
                    }}
                    className="h-14 w-24 object-cover border border-zinc-300 shadow-xs"
                  />
                </div>
              )}
            </div>

            {/* MAIN REPORT PDF DOCUMENT UPLOAD */}
            <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-zinc-800 text-xs uppercase tracking-wide text-[#751639]">
                  Main Report PDF File &amp; Attachment *
                </label>
                {isUploadingPdf && (
                  <span className="text-[11px] text-[#751639] font-bold flex items-center gap-1">
                    <span className="w-3 h-3 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></span>
                    Uploading PDF...
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="cursor-pointer bg-[#751639] hover:bg-[#5f122d] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5 rounded-none">
                  <span>📁 Upload PDF Document</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  required
                  value={mainReportFile}
                  onChange={(e) => setMainReportFile(e.target.value)}
                  className="flex-grow w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs font-mono"
                  placeholder="or paste CloudFront PDF Link / URL"
                />
              </div>

              {/* Attached File Preview Badge */}
              {uploadedPdfName && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-emerald-700">📄 Attached PDF:</span>
                    <span className="font-mono truncate">{uploadedPdfName}</span>
                    {uploadedPdfSize && <span className="text-[11px] text-emerald-600 font-semibold">({uploadedPdfSize})</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {mainReportFile && mainReportFile !== '#' && (
                      <a
                        href={mainReportFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#751639] hover:underline font-bold text-[11px]"
                      >
                        Preview ↗
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPdfName('');
                        setUploadedPdfSize('');
                        setMainReportFile('#');
                      }}
                      className="text-zinc-500 hover:text-red-600 font-bold ml-2 cursor-pointer"
                      title="Remove attached file"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* 1-Click Sample CloudFront Document Presets */}
              <div className="pt-1">
                <div className="text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Or select verified CloudFront PDF Presets:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Full Union Audit Report (PDF)', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf', size: '24.5 MB' },
                    { name: 'State Compliance Report (PDF)', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf', size: '12.8 MB' },
                    { name: 'Performance Audit Report (PDF)', url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf', size: '15.2 MB' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setMainReportFile(preset.url);
                        setUploadedPdfName(preset.name);
                        setUploadedPdfSize(preset.size);
                      }}
                      className={`text-[10.5px] px-2.5 py-1 border transition-all cursor-pointer ${
                        mainReportFile === preset.url
                          ? 'bg-[#751639] text-white border-[#751639] font-bold'
                          : 'bg-white text-zinc-700 border-zinc-300 hover:border-[#751639] hover:text-[#751639]'
                      }`}
                    >
                      {preset.name} ({preset.size})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">YouTube / Media Stream URL (Optional)</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                placeholder="https://youtube.com/..."
              />
            </div>

            {/* DETAIL PAGE CUSTOMIZATIONS */}
            <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-3">
              <div className="font-bold text-xs uppercase tracking-wide text-[#751639] border-b border-zinc-200 pb-1">
                Detail Page Custom Text &amp; Portrait
              </div>
              
              <div>
                <label className="block font-bold text-zinc-700 text-xs mb-1">Highlight Callout Quote</label>
                <textarea
                  rows={2}
                  value={highlightQuote}
                  onChange={(e) => setHighlightQuote(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                  placeholder="Independent constitutional audit empowers democratic governance..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 text-xs mb-1">Key Recommendations &amp; Remedial Actions</label>
                <textarea
                  rows={2}
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                  placeholder="The report underscores key corrective measures including automated ledger reconciliation..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 text-xs mb-1">Side Portrait Image (URL or CloudFront link)</label>
                <input
                  type="text"
                  value={portraitImage}
                  onChange={(e) => setPortraitImage(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639] text-xs"
                  placeholder="Leave empty for default heritage monument photo"
                />
              </div>
            </div>

            {/* REPORT VOLUMES / CHAPTERS MANAGER */}
            <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-1">
                <div className="font-bold text-xs uppercase tracking-wide text-[#751639]">
                  Multi-Part Volumes &amp; Chapter PDFs ({formChapters.length})
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormChapters(prev => [
                      ...prev,
                      {
                        id: `ch-${Date.now()}`,
                        title: `Chapter ${prev.length + 1}: Detailed Volume`,
                        pdf_url: mainReportFile !== '#' ? mainReportFile : 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf',
                        size: '12.4 MB'
                      }
                    ]);
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-[#751639] text-white hover:bg-[#5f122d] transition-colors cursor-pointer"
                >
                  + Add Chapter / Annexure
                </button>
              </div>

              {formChapters.length === 0 ? (
                <p className="text-xs text-zinc-500 italic m-0">No separate chapter PDFs added. Main Report File will be used.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formChapters.map((ch, chIdx) => (
                    <div key={ch.id || chIdx} className="bg-white border border-zinc-200 p-2.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-400 min-w-[20px]">#{chIdx + 1}</span>
                      <input
                        type="text"
                        value={ch.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormChapters(prev => prev.map((item, i) => i === chIdx ? { ...item, title: val } : item));
                        }}
                        placeholder="Chapter Title"
                        className="flex-1 px-2 py-1 text-xs border border-zinc-300 outline-none focus:border-[#751639]"
                      />
                      <input
                        type="text"
                        value={ch.pdf_url}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormChapters(prev => prev.map((item, i) => i === chIdx ? { ...item, pdf_url: val } : item));
                        }}
                        placeholder="PDF URL"
                        className="flex-1 px-2 py-1 text-xs border border-zinc-300 outline-none focus:border-[#751639] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setFormChapters(prev => prev.filter((_, i) => i !== chIdx))}
                        className="text-zinc-400 hover:text-red-600 font-bold px-1.5 cursor-pointer"
                        title="Remove Chapter"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
              <button
                type="submit"
                className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs cursor-pointer"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                Save to Local CMS Registry
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 border border-zinc-350 text-zinc-700 font-medium hover:bg-zinc-100 transition-colors bg-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── 3. LIST / TABLE VIEW ──
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
          {isHindi ? 'लेखापरीक्षा रिपोर्ट प्रबंधन' : 'Reports'}
        </h1>
      </div>

      {/* ── 1. CARD: SEARCH & FILTER (Figma Container / Frame 2147227423) ── */}
      <div 
        className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
        style={{
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        {/* Card Header */}
        <div className="px-5 py-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="#751639" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
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
              {t.searchAndFilter}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 border-t border-[#F5F3F4] space-y-4">
          {/* Row 1: 4 Column Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search For */}
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
                {t.searchFor}
              </label>
              <input
                type="text"
                value={searchFor}
                onChange={(e) => setSearchFor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
                placeholder={t.enterKeywords}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Sector */}
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
                {t.sector}
              </label>
              <div className="relative w-full">
                <select
                  value={sectorFilter}
                  onChange={(e) => {
                    setSectorFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Level */}
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
                {t.level}
              </label>
              <div className="relative w-full">
                <select
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  <option value="Union">{isHindi ? 'केंद्रीय सरकार' : 'Union Government'}</option>
                  <option value="States">{isHindi ? 'राज्य सरकार' : 'State Government'}</option>
                  <option value="Local Bodies">{isHindi ? 'स्थानीय निकाय' : 'Local Bodies'}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Status */}
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
                {t.status}
              </label>
              <div className="relative w-full">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.allStatus}</option>
                  <option value="Active">{t.active}</option>
                  <option value="Inactive">{t.inactive}</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Secondary Filters & Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#F5F3F4]">
            
            {/* Report Type */}
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
                {t.reportType}
              </label>
              <div className="relative w-full">
                <select
                  value={reportTypeFilter}
                  onChange={(e) => {
                    setReportTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  {reportTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Year */}
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
                {t.year}
              </label>
              <div className="relative w-full">
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] appearance-none focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value="All">{t.all}</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* State */}
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
                {t.state}
              </label>
              <SearchableStateSelect
                value={stateFilter}
                onChange={(val) => {
                  setStateFilter(val);
                  setPage(1);
                }}
                states={states}
                placeholder={isHindi ? 'सभी राज्य और केंद्र शासित प्रदेश' : 'All States & UTs'}
                allLabel={isHindi ? 'सभी राज्य और केंद्र शासित प्रदेश' : 'All States & UTs'}
                allowAll={true}
                size="sm"
              />
            </div>

          </div>

          {/* Row 3: Action Bar (Rows per page + Reset / Search) */}
          <div className="border-t border-[#F5F3F4] pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Rows per page */}
            <div className="flex items-center gap-3">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#45556C'
                }}
              >
                {t.rowsPerPage}
              </span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] w-[61px] h-[30px] px-2 text-[14px] text-[#314158] appearance-none focus:outline-none cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Reset & Search Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleSearchReset}
                className="w-[71px] h-[35px] rounded-[8px] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-colors flex items-center justify-center cursor-pointer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#701537'
                }}
              >
                {t.reset}
              </button>

              <button
                type="button"
                onClick={handleSearchGo}
                className="w-[132px] h-[35px] rounded-[8px] text-white flex items-center justify-center cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
                style={{
                  background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '16px'
                }}
              >
                {t.search}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ── 2. CARD: TABLE DATA REGISTRY (Figma Container / Frame 2147227418) ── */}
      <div 
        className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden mb-12"
        style={{
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        {/* Table Card Header */}
        <div className="px-6 py-4 h-[75.8px] border-b border-[#F5F3F4] flex justify-between items-center">
          <h2 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#0F172B'
            }}
          >
            {isHindi ? 'लेखापरीक्षा रिपोर्ट रजिस्ट्री' : 'Audit Reports Management Registry'}
          </h2>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="w-[160px] h-[35px] rounded-[8px] text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0px_4px_12px_rgba(117,22,57,0.28)] hover:opacity-95"
            style={{
              background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '16px'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewReport}</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="h-[45px] text-[#90A1B9]"
                style={{
                  background: 'rgba(117, 22, 57, 0.04)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                <th className="px-6 py-3 w-20">{t.sNo}</th>
                <th className="px-4 py-3 w-28">{t.image}</th>
                <th className="px-6 py-3">{t.title}</th>
                <th className="px-4 py-3 w-36">{t.sector}</th>
                <th className="px-4 py-3 w-28 text-center">{t.reportType}</th>
                <th className="px-4 py-3 w-20 text-center">{t.year}</th>
                <th className="px-4 py-3 w-24 text-center">{t.level}</th>
                <th className="px-4 py-3 w-32 text-center">{t.status}</th>
                <th className="px-6 py-3 w-36 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-8 py-12 text-center text-zinc-400 font-sans">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.loading}</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-8 py-12 text-center text-zinc-400 font-sans">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.rawId} className="h-[64px] hover:bg-zinc-50/50 transition-colors">
                    {/* ID */}
                    <td 
                      className="px-6 py-3 whitespace-nowrap font-bold"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#751639' }}
                    >
                      #{report.id}
                    </td>

                    {/* Preview Thumbnail */}
                    <td className="px-4 py-3">
                      <FilePreviewAction 
                        url={report.image || report.pdf_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'} 
                        type={report.image ? "image" : "file"} 
                        showThumbnail={true} 
                        alt={report.title_en} 
                      />
                    </td>

                    {/* Title & Summary */}
                    <td className="px-6 py-3 max-w-md">
                      <div 
                        className="font-semibold text-[#1D293D] hover:text-[#751639] cursor-pointer line-clamp-2 transition-colors"
                        onClick={() => handleOpenView(report)}
                        title="Click to view full details"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', lineHeight: '18px' }}
                      >
                        {isHindi ? (report.title_hi || report.title_en) : report.title_en}
                      </div>
                      {report.desc && (
                        <div className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                          {report.desc}
                        </div>
                      )}
                    </td>

                    {/* Sector */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-zinc-700 truncate block max-w-[130px]" title={report.sector}>
                        {report.sector}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center px-2.5 py-1 bg-[#F1F5F9] rounded-[6px]">
                        <span 
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            color: '#62748E'
                          }}
                        >
                          {report.report_type}
                        </span>
                      </div>
                    </td>

                    {/* Year */}
                    <td className="px-4 py-3 text-center whitespace-nowrap font-semibold text-zinc-700 text-sm">
                      {report.year_of_report}
                    </td>

                    {/* Level */}
                    <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-zinc-600">
                      {report.level || 'Union'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div 
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-[50px] ${
                          report.is_active ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FDF4F0] text-[#E41818]'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '13px' }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${report.is_active ? 'bg-[#16A34A]' : 'bg-[#E41818]'}`} />
                        <span>{report.is_active ? t.active : t.inactive}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenView(report)}
                          className="text-[#62748E] hover:text-[#751639] transition-colors cursor-pointer"
                          title={t.view}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(report)}
                          className="text-[#666666] hover:text-[#751639] transition-colors cursor-pointer"
                          title={t.edit}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(report.rawId)}
                          className="text-[#E41818] hover:text-[#B91C1C] transition-colors cursor-pointer"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/Reports/${report.rawId}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Live Preview"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination matching Image 2 */}
        <div className="px-8 py-4 border-t border-[#F5F3F4] flex flex-col sm:flex-row justify-between items-center gap-4">
          <span 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '16px',
              color: '#90A1B9'
            }}
          >
            {t.showing} {reports.length > 0 ? (page - 1) * pageSize + 1 : 0} {t.to} {Math.min(page * pageSize, totalCount)} {t.of} {totalCount.toLocaleString()} {t.entries}
          </span>

          {/* Page Buttons */}
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#94A3B8] hover:bg-zinc-50 hover:border-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
              title={t.previous}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers (Sliding window of max 5 pages) */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              let pageNum = idx + 1;
              if (totalPages > 5) {
                if (page > 3 && page < totalPages - 2) {
                  pageNum = page - 2 + idx;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                }
              }

              const isActive = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer flex items-center justify-center ${
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

            {/* Next */}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="w-9 h-9 rounded-[8px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#475569] hover:bg-zinc-50 hover:border-[#CBD5E1] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
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

export default function AdminReports() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639] font-medium">Loading Reports Registry...</div>}>
      <AdminReportsContent />
    </Suspense>
  );
}
