'use client';

import React, { useState, useMemo } from 'react';

interface OverseasTableRendererProps {
  title?: string;
  titleHi?: string;
  headers: string[];
  headersHi?: string[];
  rows: (string | number)[][];
  rowsHi?: (string | number)[][];
  lang?: string;
  searchable?: boolean;
}

export default function OverseasTableRenderer({
  title,
  titleHi,
  headers,
  headersHi,
  rows,
  rowsHi,
  lang = 'en',
  searchable = true,
}: OverseasTableRendererProps) {
  const isHi = lang === 'hi';
  const effectiveHeaders = isHi && headersHi && headersHi.length === headers.length ? headersHi : headers;
  const effectiveRows = isHi && rowsHi && rowsHi.length === rows.length ? rowsHi : rows;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return effectiveRows;
    const q = searchQuery.toLowerCase();
    return effectiveRows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(q))
    );
  }, [effectiveRows, searchQuery]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-6">
      {(title || searchable) && (
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {title && (
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              {isHi && titleHi ? titleHi : title}
            </h3>
          )}

          {searchable && effectiveRows.length > 5 && (
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'तालिका में खोजें...' : 'Search records...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-slate-700 font-bold">
            <tr>
              {effectiveHeaders.map((head, idx) => (
                <th key={idx} className="px-4 py-3 whitespace-nowrap">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={effectiveHeaders.length} className="px-4 py-6 text-center text-slate-500">
                  {isHi ? 'कोई रिकॉर्ड नहीं मिला।' : 'No matching records found.'}
                </td>
              </tr>
            ) : (
              filteredRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors">
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="px-4 py-2.5">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-[11px] text-slate-500 text-right">
        {isHi ? `कुल रिकॉर्ड: ${filteredRows.length}` : `Total Records: ${filteredRows.length}`}
      </div>
    </div>
  );
}
