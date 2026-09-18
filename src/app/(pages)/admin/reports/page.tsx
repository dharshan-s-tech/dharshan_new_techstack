'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, ReportItem as DataReportItem } from '@/lib/dataManager';
import SearchableStateSelect from '@/components/admin/SearchableStateSelect';
import { Eye, Trash2, ExternalLink, Filter, ArrowUpDown, Search, RotateCcw, Plus, SquarePen, Upload } from 'lucide-react';
import { AdminPagination } from '@/components/admin/AdminPagination';

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
      videoUrl: videoUrl
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
          state_id: selectedStateId ? parseInt(selectedStateId) : undefined
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


  return (
    <div className="space-y-5 text-sm text-zinc-700 font-sans">
      
      {/* 1. Search & Filter — Dashboard Admin mockup */}
      <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4 text-[#751639]" />
          <h2 className="text-[15px] font-bold text-zinc-800">Search &amp; Filter</h2>
        </div>
        
        {/* Row 1: Search, Status, Sector, Level, Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Search For</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
              placeholder="Enter keywords..."
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none placeholder-zinc-400 focus:border-[#751639] focus:ring-2 focus:ring-[#751639]/15"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Sector</label>
            <select
              value={sectorFilter}
              onChange={(e) => {
                setSectorFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Level</label>
            <select
              value={levelFilter}
              onChange={(e) => {
                setLevelFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All</option>
              <option value="Union">Union Government</option>
              <option value="States">State Government</option>
              <option value="Local Bodies">Local Bodies (PRI / ULB)</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Report Type</label>
            <select
              value={reportTypeFilter}
              onChange={(e) => {
                setReportTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All</option>
              {reportTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Year, State, Sort By, Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">State / UT</label>
            <SearchableStateSelect
              value={stateFilter}
              onChange={(val) => {
                setStateFilter(val);
                setPage(1);
              }}
              states={states}
              placeholder="All States & UTs"
              allLabel="All States & UTs"
              allowAll={true}
              size="sm"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-zinc-600 mb-1.5">Sort</label>
            <select
              value={sortFilter}
              onChange={(e) => {
                setSortFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-[#751639]"
            >
              <option value="newest">Newly Added First</option>
              <option value="year_desc">Year (Newest first)</option>
              <option value="year_asc">Year (Oldest first)</option>
              <option value="oldest">Oldest Added First</option>
              <option value="title_asc">Title (A to Z)</option>
              <option value="title_desc">Title (Z to A)</option>
            </select>
          </div>

          <div className="flex items-end justify-end gap-2">
            <button
              onClick={handleSearchReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#751639]/40 text-[#751639] bg-[#fff5f8] hover:bg-[#fde8ef] transition-colors font-semibold text-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={handleSearchGo}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-white transition-opacity font-semibold text-sm cursor-pointer shadow-sm hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE — Dashboard Admin mockup */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mb-12">
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="font-bold text-zinc-800 text-[16px]">Audit Reports</h3>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Displaying {reports.length === 0 ? 0 : ((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount.toLocaleString()}.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[12px] text-zinc-600">
              <span className="font-semibold">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-zinc-200 rounded-md px-2 py-1.5 bg-white text-zinc-800"
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#751639]/35 bg-white text-sm font-semibold text-[#751639] hover:bg-[#fff5f8]"
            >
              <Upload className="w-4 h-4" /> Export
            </button>

            <button
              onClick={handleOpenCreate}
              className="text-white px-4 py-2 font-semibold transition-all shadow-sm rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #751639 0%, #5C1130 100%)' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add New
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7f7f9] border-b border-zinc-100 text-zinc-500">
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide w-20">
                  <span className="inline-flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
                </th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wide w-24">Thumb</th>
                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide min-w-[240px]">
                  <span className="inline-flex items-center gap-1">Title <ArrowUpDown className="w-3 h-3 opacity-50" /></span>
                </th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wide w-36">Sector</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wide w-28 text-center">Type</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wide w-20 text-center">Year</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wide w-24 text-center">Status</th>
                <th className="px-3 py-3 text-[11px] font-bold uppercase tracking-wide text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrieving reports records...</span>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-zinc-400">
                    No matching report records found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.rawId} className="hover:bg-zinc-50/70 transition-colors text-zinc-800 border-b border-zinc-100">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#751639]">#{report.id}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <img 
                        src={report.image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'} 
                        alt="" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg';
                        }}
                        className="h-10 w-16 object-cover border border-zinc-200 rounded bg-gray-100" 
                      />
                    </td>
                    <td className="px-4 py-3.5 font-medium text-zinc-800 max-w-md">
                      <div className="line-clamp-2 cursor-pointer hover:text-[#751639] hover:underline" onClick={() => handleOpenView(report)} title="Click to view details">
                        {report.title_en}
                      </div>
                      {report.desc && <div className="text-[11px] text-zinc-500 font-normal mt-0.5 line-clamp-1">{report.desc}</div>}
                    </td>
                    <td className="px-3 py-3.5 font-medium text-zinc-700">
                      <span className="truncate block max-w-[130px]" title={report.sector}>{report.sector}</span>
                    </td>
                    <td className="px-3 py-3.5 text-center capitalize text-zinc-600">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-zinc-700">
                        {report.report_type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center text-zinc-600 font-medium">{report.year_of_report}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        report.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${report.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {report.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenView(report)}
                        className="p-1.5 text-zinc-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg inline-flex"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(report)}
                        className="p-1.5 text-zinc-500 hover:text-[#751639] hover:bg-[#751639]/5 rounded-lg inline-flex"
                        title="Edit"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.rawId)}
                        className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg inline-flex"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/Reports/${report.rawId}`}
                        target="_blank"
                        className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex"
                        title="Live page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setPage}
          noun="records"
        />
      </div>

      {/* 3. VIEW DETAILS MODAL */}
      {viewingReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-zinc-200 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div 
              className="p-4 text-white flex justify-between items-start"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-pink-200 mb-1">
                  Audit Report Record Details [ID: {viewingReport.rawId}]
                </div>
                <h2 className="text-base font-bold leading-snug">
                  {viewingReport.title_en}
                </h2>
                {viewingReport.title_hi && (
                  <p className="text-xs text-pink-100 font-medium mt-1">
                    {viewingReport.title_hi}
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewingReport(null)}
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
                  {viewingReport.sector}
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px] rounded-xs">
                  Level: {viewingReport.level || 'Union'}
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px] rounded-xs">
                  Type: {viewingReport.report_type}
                </span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[11px] rounded-xs">
                  Year: {viewingReport.year_of_report}
                </span>
                {viewingReport.tabled_date && (
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-[11px] rounded-xs">
                    Tabled: {viewingReport.tabled_date}
                  </span>
                )}
                <span className="ml-auto px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] rounded-full">
                  ● ACTIVE
                </span>
              </div>

              {/* Banner & Preview */}
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-zinc-50 p-4 border border-zinc-200">
                <img
                  src={viewingReport.image || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg'}
                  alt="Banner"
                  className="h-24 w-36 object-cover border border-zinc-300 shadow-xs bg-white shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg';
                  }}
                />
                <div className="space-y-1.5 flex-1">
                  <div className="font-bold text-zinc-900 text-xs">Banner Asset & CloudFront Link</div>
                  <p className="text-[11px] text-zinc-500 break-all font-mono">
                    {viewingReport.image || 'Default Civil Sector Banner'}
                  </p>
                  <div className="pt-2">
                    <a
                      href={viewingReport.pdf_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <span>📥 Download Full Report (PDF)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Scope Overview Narrative */}
              <div>
                <h4 className="font-bold text-zinc-900 text-xs mb-1.5 uppercase tracking-wide text-[#751639]">
                  Executive Summary &amp; Scope Overview
                </h4>
                <div className="bg-zinc-50 border border-zinc-200 p-3.5 text-zinc-700 leading-relaxed text-xs">
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
                  <h4 className="font-bold text-zinc-900 text-xs mb-1.5 uppercase tracking-wide text-[#751639]">
                    Report Chapters &amp; Individual Files ({viewingReport.chapters.length})
                  </h4>
                  <div className="border border-zinc-200 max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-200">
                        <tr>
                          <th className="px-3 py-2 w-10 text-center">#</th>
                          <th className="px-3 py-2">Chapter Title</th>
                          <th className="px-3 py-2 w-20 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        {viewingReport.chapters.map((ch, cidx) => (
                          <tr key={ch.id || cidx} className="hover:bg-zinc-50">
                            <td className="px-3 py-2 text-center text-zinc-400 font-mono">{cidx + 1}</td>
                            <td className="px-3 py-2 font-medium text-zinc-800">{ch.title}</td>
                            <td className="px-3 py-2 text-center">
                              <a
                                href={ch.file_url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#751639] hover:underline font-bold text-[11px]"
                              >
                                PDF ↗
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
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
                    className="px-4 py-2 bg-[#751639] hover:bg-[#5a102c] text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                    <span>Edit Record</span>
                  </button>
                  <button
                    onClick={() => {
                      const idToDelete = viewingReport.rawId;
                      setViewingReport(null);
                      handleDelete(idToDelete);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-none flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                  <button
                    onClick={() => setViewingReport(null)}
                    className="px-4 py-2 border border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-medium text-xs rounded-none cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. CREATE / EDIT MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-zinc-200 max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-base font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
              {editingRawId ? `Edit Audit Report [ID: ${editingRawId}]` : 'Register New Audit Report Card (Local CMS)'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Report Headline Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter full Report Title"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Report Title (Hindi)
                </label>
                <input
                  type="text"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="रिपोर्ट का शीर्षक (हिंदी)"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Description / Overview Scope Summary
                </label>
                <textarea
                  rows={3}
                  value={overviewEn}
                  onChange={(e) => setOverviewEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter audit scope and key findings narrative"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Administrative Level</label>
                  <select
                    value={govLevel}
                    onChange={(e) => setGovLevel(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="Union">Union Government</option>
                    <option value="States">State Government</option>
                    <option value="Local Bodies">Local Bodies (PRI / ULB)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Report Type</label>
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

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs cursor-pointer"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Record
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
      )}
    </div>
  );
}

export default function AdminReports() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639] font-medium">Loading...</div>}>
      <AdminReportsContent />
    </Suspense>
  );
}
