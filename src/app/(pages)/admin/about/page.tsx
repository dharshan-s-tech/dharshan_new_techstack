'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { dataManager, FormerCAGItem } from '@/lib/dataManager';

// Extended item interface for the Figma Former CAG table schema
interface FormerCAGTableRecord {
  id: string;
  formattedId: string;
  name: string;
  tenure: string;
  language: 'EN' | 'HI';
  fileName: string;
  fileUrl: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  modifiedAt: string;
  imageUrl?: string;
}

// Sample filenames and dates to populate realistic government audit document data
const SAMPLE_FILES = [
  'former-cag-gazette-notification-c6a9bcd3.pdf',
  'tenure-biography-compendium-a4-size-5131133.pdf',
  'constitutional-appointment-warrant-record.pdf',
  'speech-and-audit-reforms-historical-record.pdf',
];

export default function AdminFormerCAGPage() {
  const [records, setRecords] = useState<FormerCAGTableRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State matching Figma Frame
  const [searchFor, setSearchFor] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const [sortField, setSortField] = useState<'id' | 'name' | 'language' | 'status' | 'createdAt' | 'modifiedAt'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal / Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formTenure, setFormTenure] = useState('');
  const [formLanguage, setFormLanguage] = useState<'EN' | 'HI'>('EN');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formFileName, setFormFileName] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Load and format records from dataManager
  const loadData = () => {
    setLoading(true);
    const rawCags = dataManager.getFormerCags();
    
    // Transform into table records with stable metadata
    const formatted: FormerCAGTableRecord[] = rawCags.map((item, idx) => {
      const numId = 100 + idx + 1;
      return {
        id: item.id,
        formattedId: `#${numId}`,
        name: item.name,
        tenure: item.tenure || '(Tenure info)',
        language: idx % 4 === 1 ? 'HI' : 'EN',
        fileName: SAMPLE_FILES[idx % SAMPLE_FILES.length],
        fileUrl: '#',
        status: idx % 6 === 2 ? 'Inactive' : 'Active',
        createdAt: `05-Sep-2026 ${String(10 + (idx % 8)).padStart(2, '0')}:35 PM`,
        modifiedAt: `07-Sep-2026 ${String(1 + (idx % 6)).padStart(2, '0')}:47 AM`,
        imageUrl: item.image_url,
      };
    });

    setRecords(formatted);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleCagsChange = () => loadData();
    window.addEventListener('formerCagsChange', handleCagsChange);
    return () => window.removeEventListener('formerCagsChange', handleCagsChange);
  }, []);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Keyword search
      if (appliedSearch) {
        const query = appliedSearch.toLowerCase();
        const matchesQuery = 
          r.name.toLowerCase().includes(query) ||
          r.tenure.toLowerCase().includes(query) ||
          r.formattedId.toLowerCase().includes(query) ||
          r.fileName.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Language filter
      if (languageFilter !== 'All' && r.language !== languageFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All' && r.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [records, appliedSearch, languageFilter, statusFilter]);

  // Sorting
  const sortedRecords = useMemo(() => {
    const list = [...filteredRecords];
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'id') {
        valA = parseInt(a.formattedId.replace('#', ''), 10);
        valB = parseInt(b.formattedId.replace('#', ''), 10);
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredRecords, sortField, sortAsc]);

  // Pagination calculations
  const totalEntries = sortedRecords.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchFor);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setLanguageFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName('');
    setFormTenure('(2024 - 2028)');
    setFormLanguage('EN');
    setFormStatus('Active');
    setFormFileName('former-cag-record.pdf');
    setFormImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: FormerCAGTableRecord) => {
    setEditingId(rec.id);
    setFormName(rec.name);
    setFormTenure(rec.tenure);
    setFormLanguage(rec.language);
    setFormStatus(rec.status);
    setFormFileName(rec.fileName);
    setFormImageUrl(rec.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from Former CAG records?`)) return;
    dataManager.deleteFormerCag(id);
    loadData();
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a name for the Former CAG.');
      return;
    }

    const item: FormerCAGItem = {
      id: editingId || `fc-${Date.now()}`,
      name: formName.trim(),
      tenure: formTenure.trim() || '(Tenure info)',
      image_url: formImageUrl.trim() || '/assets/Images/former cag/image 1.svg',
    };

    dataManager.saveFormerCag(item);
    setIsModalOpen(false);
    loadData();
  };

  // CSV Export function
  const handleExport = () => {
    const csvContent = [
      ['ID', 'Name', 'Tenure', 'Language', 'Document File', 'Status', 'Created', 'Modified'].join(','),
      ...sortedRecords.map(r => [
        `"${r.formattedId}"`,
        `"${r.name}"`,
        `"${r.tenure}"`,
        `"${r.language}"`,
        `"${r.fileName}"`,
        `"${r.status}"`,
        `"${r.createdAt}"`,
        `"${r.modifiedAt}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `former_cags_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-5 text-zinc-800 font-['Inter',sans-serif]">

      {/* Breadcrumb matching Figma Home > Former CAG */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#666666] font-normal">
        <span className="cursor-pointer hover:underline">Home</span>
        <span>&gt;</span>
        <span className="text-[#666666] font-medium">Former CAG</span>
      </div>

      {/* 1. SEARCH & FILTER CARD (Figma Container Frame) */}
      <div 
        className="w-full bg-white border border-[#EDE9E9] rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.04)] overflow-hidden"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Card Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F5F3F4]">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="#751639" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-semibold text-[14px] leading-[20px] text-[#0F172B]">
              Search &amp; Filter
            </h2>
          </div>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSearchSubmit} className="p-5 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            
            {/* Search For Keywords */}
            <div className="md:col-span-6 flex flex-col gap-1.5">
              <label className="font-medium text-[14px] leading-[16px] text-[#62748E]">
                Search For
              </label>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#90A1B9] pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="7" r="5" stroke="#90A1B9" strokeWidth="1.3"/>
                    <path d="M11 11L14.5 14.5" stroke="#90A1B9" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchFor}
                  onChange={(e) => setSearchFor(e.target.value)}
                  placeholder="Enter keywords…"
                  className="w-full h-[38.6px] bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] pl-9 pr-3 text-[14px] text-[#314158] placeholder-[#90A1B9] outline-none focus:border-[#751639] transition-all"
                />
              </div>
            </div>

            {/* Language Dropdown */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label className="font-medium text-[14px] leading-[16px] text-[#62748E]">
                Language
              </label>
              <div className="relative w-full">
                <select
                  value={languageFilter}
                  onChange={(e) => {
                    setLanguageFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-[38.6px] bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3 text-[14px] text-[#314158] outline-none appearance-none cursor-pointer focus:border-[#751639]"
                >
                  <option value="All">All Languages</option>
                  <option value="EN">English (EN)</option>
                  <option value="HI">Hindi (HI)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label className="font-medium text-[14px] leading-[16px] text-[#62748E]">
                Status
              </label>
              <div className="relative w-full">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-[38.6px] bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-3 text-[14px] text-[#314158] outline-none appearance-none cursor-pointer focus:border-[#751639]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Action Row matching Figma */}
          <div className="pt-4 border-t border-[#F5F3F4] flex flex-row justify-between items-center flex-wrap gap-4">
            
            {/* Rows Per Page */}
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[14px] leading-[16px] text-[#45556C]">
                Rows per page
              </span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setCurrentPage(1);
                  }}
                  className="h-[30px] w-[65px] bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] px-2 text-[14px] text-[#314158] font-normal outline-none appearance-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#314158]">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#314158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Buttons: Reset & Search */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="h-[35px] px-4 bg-[rgba(108,20,54,0.05)] rounded-[8px] font-medium text-[14px] text-[#701537] hover:bg-[rgba(108,20,54,0.1)] transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                className="h-[35px] px-5 bg-gradient-to-r from-[#751639] to-[#5C1130] shadow-[0px_4px_12px_rgba(117,22,57,0.28)] rounded-[8px] font-semibold text-[14px] text-white hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
              >
                Search
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* 2. FORMER CAG TABLE CARD (Figma Container Frame) */}
      <div 
        className="w-full bg-white border border-[#EDE9E9] rounded-[12px] shadow-[0px_1px_4px_rgba(0,0,0,0.04)] overflow-hidden"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Table Top Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#F5F3F4] flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-[16px] leading-[20px] text-[#0F172B]">
              Former Cag
            </h3>
            <span className="font-medium text-[14px] leading-[16px] text-[#90A1B9]">
              Displaying {totalEntries === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + rowsPerPage, totalEntries)} of {totalEntries}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="h-[35px] px-4 bg-gradient-to-r from-[#751639] to-[#5C1130] text-white rounded-[10px] font-semibold text-[13.5px] shadow-sm hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <span>+ Add Former CAG</span>
            </button>

            <button
              onClick={handleExport}
              className="h-[35px] px-3.5 border border-[#EDE9E9] rounded-[12px] font-semibold text-[14px] text-[#45556C] hover:bg-zinc-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 11V13.5H13.5V11M8 2.5V10M8 2.5L4.5 6M8 2.5L11.5 6" stroke="#45556C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* The Table View */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            {/* Table Header matching Figma background rgba(117, 22, 57, 0.04) */}
            <thead>
              <tr className="bg-[rgba(117,22,57,0.04)] h-[45px] border-b border-[#F5F3F4]">
                
                {/* ID */}
                <th 
                  onClick={() => handleSort('id')} 
                  className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <span className="opacity-40 text-[10px]">▲▼</span>
                  </div>
                </th>

                {/* TITLE */}
                <th 
                  onClick={() => handleSort('name')} 
                  className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>TITLE</span>
                    <span className="opacity-40 text-[10px]">▲▼</span>
                  </div>
                </th>

                {/* LANGUAGE */}
                <th 
                  onClick={() => handleSort('language')} 
                  className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>LANGUAGE</span>
                    <span className="opacity-40 text-[10px]">▲▼</span>
                  </div>
                </th>

                {/* FILE UPLOAD */}
                <th className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase">
                  FILE UPLOAD
                </th>

                {/* STATUS */}
                <th 
                  onClick={() => handleSort('status')} 
                  className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>STATUS</span>
                    <span className="opacity-40 text-[10px]">▲▼</span>
                  </div>
                </th>

                {/* CREATED */}
                <th 
                  onClick={() => handleSort('createdAt')} 
                  className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>CREATED</span>
                    <span className="opacity-40 text-[10px]">▲▼</span>
                  </div>
                </th>

                {/* MODIFIED */}
                <th 
                  onClick={() => handleSort('modifiedAt')} 
                  className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>MODIFIED</span>
                    <span className="opacity-40 text-[10px]">▲▼</span>
                  </div>
                </th>

                {/* ACTIONS */}
                <th className="py-3 px-6 text-[12px] font-bold text-[#90A1B9] tracking-[1px] uppercase text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#90A1B9] text-[14px]">
                    No Former CAG records match your filters.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => (
                  <tr 
                    key={item.id} 
                    className="h-[62px] border-b border-[#F5F3F4] hover:bg-zinc-50/60 transition-colors"
                  >
                    {/* ID */}
                    <td className="py-3 px-6 text-[14px] font-bold text-[#751639] whitespace-nowrap">
                      {item.formattedId}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-6 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[14px] text-[#1D293D]">{item.name}</span>
                        <span className="text-[11px] text-[#90A1B9]">{item.tenure}</span>
                      </div>
                    </td>

                    {/* Language Badge */}
                    <td className="py-3 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-[#F1F5F9] rounded-[6px] text-[14px] font-bold uppercase tracking-[0.25px] text-[#62748E]">
                        {item.language}
                      </span>
                    </td>

                    {/* File Upload PDF Link */}
                    <td className="py-3 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-[260px]">
                        {/* Pink PDF Container Box */}
                        <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FFF1F3] flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 1.5H10.5L13.5 4.5V14.5H3V1.5Z" stroke="#E41818" strokeWidth="1.2"/>
                            <path d="M10.5 1.5V4.5H13.5" stroke="#E41818" strokeWidth="1.2"/>
                            <path d="M5 9H11M5 11.5H9" stroke="#E41818" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <span className="text-[14px] text-[#62748E] truncate" title={item.fileName}>
                          {item.fileName}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-6 whitespace-nowrap">
                      {item.status === 'Active' ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0FDF4] rounded-full text-[14px] font-medium text-[#16A34A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDF4F0] rounded-full text-[14px] font-medium text-[#E41818]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E41818]"></span>
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="py-3 px-6 text-[14px] font-medium text-[#90A1B9] whitespace-nowrap">
                      {item.createdAt}
                    </td>

                    {/* Modified */}
                    <td className="py-3 px-6 text-[14px] font-medium text-[#90A1B9] whitespace-nowrap">
                      {item.modifiedAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-4">
                        {/* Edit button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="text-[#666666] hover:text-[#751639] transition-colors p-1"
                          title="Edit Former CAG Record"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-[#E41818] hover:text-red-700 transition-colors p-1"
                          title="Delete Record"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination matching Figma Frame */}
        <div className="p-5 border-t border-[#F5F3F4] flex flex-row justify-between items-center flex-wrap gap-4">
          <span className="font-medium text-[14px] leading-[16px] text-[#90A1B9]">
            Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalEntries)} of {totalEntries} entries
          </span>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[16px] text-[#90A1B9] disabled:opacity-30 hover:bg-zinc-100 transition-colors"
            >
              ‹
            </button>

            {/* Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isPageActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-[8px] text-[13px] font-medium transition-all ${
                    isPageActive
                      ? 'bg-[rgba(117,22,57,0.1)] text-[#751639]'
                      : 'text-[#64748B] hover:bg-zinc-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next */}
            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[16px] text-[#90A1B9] disabled:opacity-30 hover:bg-zinc-100 transition-colors"
            >
              ›
            </button>
          </div>
        </div>

      </div>

      {/* 3. ADD / EDIT RECORD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-[16px] max-w-lg w-full shadow-2xl overflow-hidden border border-[#EDE9E9]">
            <div className="px-6 py-4 border-b border-[#F5F3F4] flex items-center justify-between bg-zinc-50/50">
              <h3 className="font-bold text-[16px] text-[#751639]">
                {editingId ? 'Edit Former CAG Record' : 'Add New Former CAG'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Girish Chandra Murmu"
                  className="w-full h-10 px-3 border border-[#EDE9E9] rounded-lg text-sm outline-none focus:border-[#751639]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Tenure Period *</label>
                <input
                  type="text"
                  required
                  value={formTenure}
                  onChange={(e) => setFormTenure(e.target.value)}
                  placeholder="e.g. (2020 - 2024)"
                  className="w-full h-10 px-3 border border-[#EDE9E9] rounded-lg text-sm outline-none focus:border-[#751639]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as any)}
                    className="w-full h-10 px-3 border border-[#EDE9E9] rounded-lg text-sm outline-none focus:border-[#751639]"
                  >
                    <option value="EN">English (EN)</option>
                    <option value="HI">Hindi (HI)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full h-10 px-3 border border-[#EDE9E9] rounded-lg text-sm outline-none focus:border-[#751639]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Photo Image URL / Asset</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/..."
                  className="w-full h-10 px-3 border border-[#EDE9E9] rounded-lg text-sm outline-none focus:border-[#751639]"
                />
              </div>

              <div className="pt-4 border-t border-[#F5F3F4] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#751639] to-[#5C1130] rounded-lg shadow-sm hover:opacity-95 transition-opacity"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
