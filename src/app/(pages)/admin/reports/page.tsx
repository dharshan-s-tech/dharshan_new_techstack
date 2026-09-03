'use client';

import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api';
import { dataManager, ReportItem as DataReportItem } from '@/lib/dataManager';

interface GovtType {
  id: number;
  name_en: string;
}

interface StateLookup {
  id: number;
  name_en: string;
}

interface ReportDisplayItem {
  id: number;
  rawId: string;
  title_en: string;
  report_type: string;
  sector: string;
  year_of_report: number;
  is_active: boolean;
  image?: string;
  desc?: string;
}

const MOCK_STATES: StateLookup[] = [
  { id: 1, name_en: 'Andhra Pradesh' },
  { id: 2, name_en: 'Arunachal Pradesh' },
  { id: 3, name_en: 'Assam' },
  { id: 4, name_en: 'Bihar' },
  { id: 5, name_en: 'Chattisgarh' },
  { id: 6, name_en: 'Gujarat' },
  { id: 7, name_en: 'Haryana' },
  { id: 8, name_en: 'Himachal Pradesh' },
  { id: 9, name_en: 'Jammu & Kashmir' },
  { id: 10, name_en: 'Jharkhand' },
  { id: 11, name_en: 'Karnataka' },
  { id: 12, name_en: 'Kerala' },
  { id: 13, name_en: 'Madhya Pradesh' },
  { id: 14, name_en: 'Maharashtra' },
  { id: 15, name_en: 'Manipur' },
  { id: 16, name_en: 'Meghalaya' },
  { id: 17, name_en: 'Mizoram' },
  { id: 18, name_en: 'Nagaland' },
  { id: 19, name_en: 'Odisha' },
  { id: 20, name_en: 'Punjab' },
  { id: 21, name_en: 'Rajasthan' },
  { id: 22, name_en: 'Sikkim' },
  { id: 23, name_en: 'Tamil Nadu' },
  { id: 24, name_en: 'Telangana' },
  { id: 25, name_en: 'Tripura' },
  { id: 26, name_en: 'Uttar Pradesh' },
  { id: 27, name_en: 'Uttarakhand' },
  { id: 28, name_en: 'West Bengal' }
];

export default function AdminReports() {
  const API_URL = getApiBaseUrl();
  const [reports, setReports] = useState<ReportDisplayItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  
  // Filter Fields
  const [searchFor, setSearchFor] = useState('');
  const [searchBy, setSearchBy] = useState('Title');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');

  const [appliedSearch, setAppliedSearch] = useState('');

  // Dropdown Lookups
  const [states, setStates] = useState<StateLookup[]>(MOCK_STATES);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [titleEn, setTitleEn] = useState('');
  const [overviewEn, setOverviewEn] = useState('');
  const [govTypeId, setGovTypeId] = useState('');
  const [reportType, setReportType] = useState('performance');
  const [sector, setSector] = useState('Finance');
  const [yearOfReport, setYearOfReport] = useState(new Date().getFullYear());
  const [cardImage, setCardImage] = useState('/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png');
  const [mainReportFile, setMainReportFile] = useState('#');

  const loadData = () => {
    setLoading(true);
    const localReports = dataManager.getReports();
    let formatted: ReportDisplayItem[] = localReports.map((r, idx) => ({
      id: idx + 1,
      rawId: r.id,
      title_en: r.title,
      report_type: r.type || 'Performance',
      sector: r.sector || 'Finance',
      year_of_report: parseInt(r.year) || 2026,
      is_active: true,
      image: r.image,
      desc: r.desc
    }));

    if (appliedSearch) {
      formatted = formatted.filter(r => r.title_en.toLowerCase().includes(appliedSearch.toLowerCase()));
    }
    if (sectorFilter !== 'All') {
      formatted = formatted.filter(r => r.sector.toLowerCase() === sectorFilter.toLowerCase());
    }

    setReports(formatted);
    setTotalCount(formatted.length);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleReportsChange = () => loadData();
    window.addEventListener('reportsChange', handleReportsChange);
    return () => window.removeEventListener('reportsChange', handleReportsChange);
  }, [page, pageSize, appliedSearch, sectorFilter]);

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

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
    setPage(1);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setPage(1);
    setStatusFilter('All');
    setSectorFilter('All');
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setOverviewEn('');
    setGovTypeId('');
    setReportType('performance');
    setSector('Finance');
    setYearOfReport(new Date().getFullYear());
    setCardImage('/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png');
    setMainReportFile('#');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    const local = dataManager.getReports();
    const item = local[id - 1] || local[0];

    setEditingId(id);
    setTitleEn(item?.title || `Audit Report #${id}`);
    setOverviewEn(item?.desc || '');
    setGovTypeId('');
    setReportType(item?.type || 'performance');
    setSector(item?.sector || 'Finance');
    setYearOfReport(parseInt(item?.year || '2026'));
    setCardImage(item?.image || '/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png');
    setMainReportFile('#');
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this audit report?')) return;
    const local = dataManager.getReports();
    if (local[id - 1]) {
      dataManager.deleteReport(local[id - 1].id);
    }
    loadData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const local = dataManager.getReports();
    const targetId = editingId ? (local[editingId - 1]?.id || `rep-${editingId}`) : `rep-${Date.now()}`;

    const record: DataReportItem = {
      id: targetId,
      title: titleEn,
      image: cardImage,
      tag: sector || 'Finance',
      date: 'Jun 4, 2026',
      year: yearOfReport.toString(),
      sector: sector,
      level: govTypeId === '1' ? 'Union' : 'States',
      type: reportType,
      isFeatured: true,
      label: sector,
      desc: overviewEn || titleEn
    };

    dataManager.saveReport(record);
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="space-y-4 text-xs text-zinc-700">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        
        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
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

          <div>
            <label className="block text-zinc-555 font-bold mb-1">Department (Sector):</label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none focus:border-[#751639]"
            >
              <option value="All">All Sectors</option>
              <option value="Finance">Finance</option>
              <option value="Defence">Defence</option>
              <option value="Transport">Transport</option>
              <option value="Social Welfare">Social Welfare</option>
              <option value="Environment">Environment</option>
            </select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2">
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
            Audit Reports Records [ Displaying {reports.length} of {totalCount} ]
          </h3>
          
          <button
            onClick={handleOpenCreate}
            className="text-white px-4 py-1.5 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add New Audit Report Card
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-4 py-3.5 border-r border-white/20 w-12 text-center">#</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-28">Image</th>
                <th className="px-4 py-3.5 border-r border-white/20">Audit Report Headline Title</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-32">Sector</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-28 text-center">Report Type</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-20 text-center">Year</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    Retrieving reports registry...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                    No matching report records found.
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <tr key={report.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7]">
                      <img src={report.image || '/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png'} alt="" className="h-10 w-16 object-cover border border-zinc-200" />
                    </td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639] max-w-sm">
                      <div>{report.title_en}</div>
                      {report.desc && <div className="text-[11px] text-zinc-500 font-normal mt-0.5 truncate">{report.desc}</div>}
                    </td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-medium text-zinc-700">{report.sector}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center capitalize text-zinc-600">{report.report_type}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-550">{report.year_of_report}</td>
                    
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(report.id)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
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

      {/* Input / Details Modal Form */}
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
              {editingId ? 'Edit Audit Report Card' : 'Register New Audit Report Card'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Report Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter Report Headline Title"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Description / Overview Summary
                </label>
                <textarea
                  rows={3}
                  value={overviewEn}
                  onChange={(e) => setOverviewEn(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  placeholder="Enter audit report summary text"
                />
              </div>

              {/* CARD IMAGE FILE UPLOAD */}
              <div className="bg-[#fafbfc] border border-zinc-200 p-4 space-y-2">
                <label className="block font-bold text-zinc-800 text-xs mb-1">
                  Upload Card Banner Picture or Enter Image URL *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="cursor-pointer bg-[#751639] hover:bg-[#5f122d] text-white px-4 py-2 text-xs font-bold transition-colors shrink-0 shadow-xs flex items-center gap-1.5">
                    <span>📁 Choose Image File to Upload</span>
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
                    placeholder="or paste image URL"
                  />
                </div>
                {cardImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-[11px] font-bold text-zinc-500">Live Preview:</span>
                    <img
                      src={cardImage}
                      alt="Report Card preview"
                      className="h-16 w-24 object-cover border border-zinc-300 shadow-xs"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="performance">Performance</option>
                    <option value="compliance">Compliance</option>
                    <option value="financial">Financial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Audit Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-850 focus:outline-none focus:border-[#751639]"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Defence">Defence</option>
                    <option value="Transport">Transport</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="Environment">Environment</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Report Year *</label>
                  <input
                    type="number"
                    required
                    value={yearOfReport}
                    onChange={(e) => setYearOfReport(parseInt(e.target.value))}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Main Report File Link (PDF URL)</label>
                <input
                  type="text"
                  value={mainReportFile}
                  onChange={(e) => setMainReportFile(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save Report Card Record
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
