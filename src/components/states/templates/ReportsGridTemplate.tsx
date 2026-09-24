'use client';

import React, { useState } from 'react';
import { SubsitePageData, SubsiteReportCardItem } from '@/data/stateSubsites/andhraPradeshPages';

interface ReportsGridTemplateProps {
  page: SubsitePageData;
  isHindi?: boolean;
}

export default function ReportsGridTemplate({ page, isHindi = false }: ReportsGridTemplateProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'accounts'>('accounts');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['States']);

  const title = isHindi && page.titleHi ? page.titleHi : page.title;
  const initialReports = page.reports || [];

  const filteredReports = initialReports.filter((item) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSector = item.sector.toLowerCase().includes(q);
      if (!matchTitle && !matchSector) return false;
    }
    return true;
  });

  return (
    <div className="w-full font-['Noto_Sans',sans-serif] flex flex-col xl:flex-row gap-6 items-start">
      {/* ==========================================
          LEFT FILTERS SIDEBAR (Matching Image 3)
         ========================================== */}
      <div className="w-full xl:w-[280px] shrink-0 bg-white rounded-[8px] border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
        <h2 className="text-[18px] font-bold text-[#2A2A2A] border-b border-[#F0F0F0] pb-3">
          {isHindi ? 'फिल्टर (Filters)' : 'Filters'}
        </h2>

        {/* Tab Toggle: Reports | Accounts */}
        <div className="flex rounded-[6px] overflow-hidden border border-[#E5E7EB] p-1 bg-[#F9FAFB]">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors cursor-pointer ${
              activeTab === 'reports' ? 'bg-[#751639] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#751639]'
            }`}
          >
            {isHindi ? 'रिपोर्ट्स' : 'Reports'}
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors cursor-pointer ${
              activeTab === 'accounts' ? 'bg-[#751639] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#751639]'
            }`}
          >
            {isHindi ? 'लेखे' : 'Accounts'}
          </button>
        </div>

        {/* Select Year Dropdown */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[12px] font-medium text-[#4B5563]">
            <span>{isHindi ? 'वर्ष चुनें' : 'Select Year'}</span>
            <button
              onClick={() => {
                setSelectedYear('All');
                setSearchTerm('');
              }}
              className="text-[#0D61AE] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>✕</span> {isHindi ? 'रीसेट करें' : 'Clear All'}
            </button>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-[6px] px-3 py-2 text-[13px] text-[#374151] bg-white outline-none focus:border-[#751639]"
          >
            <option value="All">{isHindi ? 'सभी वर्ष (All Years)' : 'All Years'}</option>
            <option value="2025">2025 - 2026</option>
            <option value="2024">2024 - 2025</option>
            <option value="2023">2023 - 2024</option>
            <option value="2022">2022 - 2023</option>
          </select>
        </div>

        {/* Administrative Level Filter */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#F0F0F0]">
          <span className="text-[13px] font-bold text-[#2A2A2A]">
            {isHindi ? 'प्रशासनिक स्तर' : 'Administrative Level'}
          </span>
          {['All', 'Union', 'States', 'Local Bodies'].map((lvl) => (
            <label key={lvl} className="flex items-center gap-2.5 text-[13px] text-[#4B5563] cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLevels.includes(lvl)}
                onChange={() => {
                  setSelectedLevels((prev) =>
                    prev.includes(lvl) ? prev.filter((x) => x !== lvl) : [...prev, lvl]
                  );
                }}
                className="rounded text-[#751639] focus:ring-[#751639] accent-[#751639] w-4 h-4 cursor-pointer"
              />
              <span>{lvl}</span>
            </label>
          ))}
        </div>

        {/* Sector Filter */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#F0F0F0]">
          <span className="text-[13px] font-bold text-[#2A2A2A]">
            {isHindi ? 'क्षेत्र (Sector)' : 'Sector'}
          </span>
          {['All Sectors', 'State Accounts', 'Finance', 'Public Debt', 'Capital Outlay'].map((sec) => (
            <label key={sec} className="flex items-center gap-2.5 text-[13px] text-[#4B5563] cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={sec === 'All Sectors' || sec === 'State Accounts'}
                className="rounded text-[#751639] focus:ring-[#751639] accent-[#751639] w-4 h-4 cursor-pointer"
              />
              <span>{sec}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ==========================================
          RIGHT CONTENT & REPORT CARDS GRID
         ========================================== */}
      <div className="flex-1 w-full flex flex-col gap-5">
        {/* Header with Results Count & Search Box */}
        <div className="bg-white rounded-[8px] border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-[22px] md:text-[26px] font-bold text-[#2A2A2A]">{title}</h1>
            <p className="text-[12px] text-[#6B7280] mt-0.5">
              {filteredReports.length} {isHindi ? 'परिणाम उपलब्ध हैं' : 'results found'}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-[360px] flex items-center border border-[#D1D5DB] rounded-[6px] px-3 py-2 bg-[#F9FAFB] focus-within:bg-white focus-within:border-[#751639] transition-colors">
            <input
              type="text"
              placeholder={isHindi ? 'कीवर्ड या विषय से खोजें...' : 'Search by keyword, title, sector...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[13px] text-[#374151] placeholder:text-[#9CA3AF] outline-none"
            />
            <svg className="w-4 h-4 text-[#6B7280] shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 3-Column Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-[8px] border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="w-full h-[140px] bg-[#E5E7EB] overflow-hidden relative">
                  <img
                    src={report.thumbnailUrl || '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png'}
                    alt={report.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#EBF5FF] text-[#1E40AF] font-semibold">
                      {report.category}
                    </span>
                    <span className="text-[#6B7280]">{report.date}</span>
                  </div>

                  <h3 className="text-[14px] leading-[20px] font-bold text-[#1F2937] line-clamp-2">
                    {isHindi && report.titleHi ? report.titleHi : report.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 flex flex-col gap-2 border-t border-[#F3F4F6] mt-2">
                <a
                  href={report.downloadUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-semibold text-[#0D61AE] hover:underline flex items-center gap-1.5 pt-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{isHindi ? 'पूरी रिपोर्ट डाउनलोड करें' : 'Download Full Report'}</span>
                </a>

                <span className="text-[11px] text-[#6B7280] truncate">
                  <span className="font-medium text-[#4B5563]">{isHindi ? 'क्षेत्र: ' : 'Sector: '}</span>
                  {report.sector}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
