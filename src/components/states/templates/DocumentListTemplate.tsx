'use client';

import React, { useState } from 'react';
import { SubsitePageData } from '@/data/stateSubsites/andhraPradeshPages';

interface DocumentListTemplateProps {
  page: SubsitePageData;
  isHindi?: boolean;
  primaryColor?: string;
}

export default function DocumentListTemplate({ page, isHindi = false, primaryColor }: DocumentListTemplateProps) {
  const isNavy = primaryColor === '#1D2E6B';
  const [showArchive, setShowArchive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const title = isHindi && page.titleHi ? page.titleHi : page.title;
  const documents = page.documents || [];
  const isTableMode = page.displayMode === 'table' || page.slug?.toLowerCase().includes('circular');

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentDocs = isTableMode ? documents.slice(startIndex, startIndex + pageSize) : documents;

  const isNotice = page.slug?.toLowerCase().includes('notice') || title.toLowerCase().includes('notice');
  const thBorderClass = isNavy ? 'border-[#2A3F88]' : 'border-[#8C1E47]';

  return (
    <div className="w-full bg-white rounded-[8px] p-6 lg:p-8 border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] font-['Noto_Sans',sans-serif]">
      {/* Header with Title & Archive Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F0F0F0] pb-5 mb-6">
        <h1 className={`text-[26px] md:text-[30px] leading-[36px] font-bold ${isNavy ? 'text-[#1D2E6B]' : 'text-[#751639]'}`}>
          {title}
        </h1>

        {/* Archive Button matching Image 2 */}
        {!page.hideArchiveButton && !page.slug?.toLowerCase().includes('gradation') && (
          <button
            onClick={() => setShowArchive(!showArchive)}
            className={`${isNavy ? 'bg-[#1D2E6B] hover:bg-[#152250]' : 'bg-[#751639] hover:bg-[#5E112E]'} text-white text-[13px] font-medium px-4 py-1.5 rounded-[4px] flex items-center gap-2 transition-colors cursor-pointer shadow-sm shrink-0`}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>{isHindi ? (showArchive ? 'सक्रिय सूची' : 'संग्रह (Archive)') : (showArchive ? 'Active List' : 'Archive')}</span>
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="p-8 text-center text-[#6B7280] bg-[#F9FAFB] rounded-[6px] border border-dashed border-[#D1D5DB]">
          ${isHindi ? 'वर्तमान में कोई दस्तावेज़ उपलब्ध नहीं है।' : 'No documents currently available in this section.'}
        </div>
      ) : isTableMode ? (
        /* Tabular Column Format matching live CAG portal */
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto w-full border border-[#E5E7EB] rounded-[4px]">
            <table className="w-full text-left border-collapse text-[13px] md:text-[14px]">
              <thead>
                <tr className={`${isNavy ? 'bg-[#1D2E6B]' : 'bg-[#751639]'} text-white font-semibold text-[13px] tracking-wide`}>
                  <th className={`py-3 px-3.5 border ${thBorderClass} w-[60px] text-center`}>{isNotice ? 'S. No.' : 'S.No.'}</th>
                  <th className={`py-3 px-4 border ${thBorderClass} min-w-[300px]`}>Title</th>
                  {isNotice ? (
                    <>
                      <th className={`py-3 px-4 border ${thBorderClass} w-[220px] text-center`}>Document</th>
                      <th className={`py-3 px-3 border ${thBorderClass} w-[90px] text-center`}>Link</th>
                      <th className={`py-3 px-3.5 border ${thBorderClass} w-[130px] text-center`}>Notice Date</th>
                    </>
                  ) : (
                    <>
                      <th className={`py-3 px-3.5 border ${thBorderClass} w-[130px] text-center`}>Date of Order</th>
                      <th className={`py-3 px-4 border ${thBorderClass} w-[200px] text-center`}>Document</th>
                      <th className={`py-3 px-3 border ${thBorderClass} w-[90px] text-center`}>Full Url</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {currentDocs.map((doc, idx) => {
                  const docTitle = isHindi && doc.titleHi ? doc.titleHi : doc.title;
                  const itemIndex = startIndex + idx + 1;
                  return (
                    <tr
                      key={doc.id || idx}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-[#F9FAFB]' : 'bg-[#FAFAFA] hover:bg-[#F3F4F6]'}
                    >
                      <td className="py-3 px-3.5 border border-[#E5E7EB] text-center font-medium text-[#4B5563]">
                        {itemIndex}
                      </td>
                      <td className="py-3 px-4 border border-[#E5E7EB] text-[#1F2937] font-medium leading-[20px]">
                        {docTitle}
                      </td>
                      {isNotice ? (
                        <>
                          <td className="py-3 px-4 border border-[#E5E7EB] text-center">
                            {doc.downloadUrl && doc.downloadUrl !== '#' ? (
                              <div className="flex items-center justify-center gap-1.5 text-[12px] flex-wrap">
                                <a
                                  href={doc.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0D61AE] font-bold hover:underline"
                                >
                                  View PDF
                                </a>
                                <span className="text-[#6B7280]">({doc.fileSize || '0.16 MB'})</span>
                                <a
                                  href={doc.downloadUrl}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0D61AE] font-bold hover:underline"
                                >
                                  Download
                                </a>
                              </div>
                            ) : (
                              <span className="text-[#9CA3AF]">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 border border-[#E5E7EB] text-center text-[#6B7280]">
                            {doc.fullUrl && doc.fullUrl !== '-' && doc.fullUrl !== '' ? (
                              <a href={doc.fullUrl} target="_blank" rel="noopener noreferrer" className="text-[#0D61AE] hover:underline font-medium">
                                Link
                              </a>
                            ) : (
                              ''
                            )}
                          </td>
                          <td className="py-3 px-3.5 border border-[#E5E7EB] text-center text-[#4B5563] whitespace-nowrap">
                            {doc.date || '-'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-3.5 border border-[#E5E7EB] text-center text-[#4B5563] whitespace-nowrap">
                            {doc.date || '-'}
                          </td>
                          <td className="py-3 px-4 border border-[#E5E7EB] text-center">
                            {doc.downloadUrl && doc.downloadUrl !== '#' ? (
                              <div className="flex items-center justify-center gap-1.5 text-[12px] flex-wrap">
                                <a
                                  href={doc.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0D61AE] font-bold hover:underline"
                                >
                                  View PDF
                                </a>
                                <span className="text-[#6B7280]">({doc.fileSize || '0.50 MB'})</span>
                                <a
                                  href={doc.downloadUrl}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0D61AE] font-bold hover:underline"
                                >
                                  Download
                                </a>
                              </div>
                            ) : (
                              <span className="text-[#9CA3AF]">-</span>
                            )}
                          </td>
                          <td className="py-3 px-3 border border-[#E5E7EB] text-center text-[#6B7280]">
                            {doc.fullUrl && doc.fullUrl !== '-' ? (
                              <a href={doc.fullUrl} target="_blank" rel="noopener noreferrer" className="text-[#0D61AE] hover:underline">
                                Link
                              </a>
                            ) : (
                              '-'
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-[13px] border border-[#D1D5DB] rounded-[4px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3F4F6]"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-[13px] rounded-[4px] border ${
                    currentPage === pageNum
                      ? isNavy
                        ? 'bg-[#1D2E6B] text-white border-[#1D2E6B] font-semibold'
                        : 'bg-[#751639] text-white border-[#751639] font-semibold'
                      : 'border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-[13px] border border-[#D1D5DB] rounded-[4px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F3F4F6]"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Card Items List */
        <div className="flex flex-col gap-4">
          {documents.map((doc) => {
            const docTitle = isHindi && doc.titleHi ? doc.titleHi : doc.title;

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-[6px] p-5 border border-[#E5E7EB] border-l-[4px] ${isNavy ? 'border-l-[#1D2E6B]' : 'border-l-[#751639]'} shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow`}
              >
                {/* Left: Title & Meta */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-[16px] leading-[24px] font-semibold text-[#1F2937]">
                    {docTitle}
                  </h3>
                  {doc.date && (
                    <span className="text-[12px] leading-[16px] text-[#6B7280]">
                      {isHindi ? 'जारी दिनांक: ' : 'Date of Issue: '} {doc.date}
                    </span>
                  )}
                </div>

                {/* Right: PDF Icon, File Size & View PDF Action */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 text-red-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5c0 .83-.67 1.5-1.5 1.5H7v2H5.5V9H8c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V9H13c.83 0 1.5.67 1.5 1.5v3zm4-3H17v1h1.5v1.5H17v2h-1.5V9h3v1.5zm-10 0H7v1h1.5v-1zm4.5 2h-1v-2h1v2z"/>
                    </svg>
                  </div>

                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-[11px] font-medium text-[#6B7280]">
                      {doc.fileSize}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.downloadUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] leading-[18px] font-semibold text-[#0D61AE] hover:underline flex items-center gap-1"
                      >
                        <span>{isHindi ? 'पीडीएफ देखें' : 'View PDF'}</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                      <span className="text-[#D1D5DB]">|</span>
                      <a
                        href={doc.downloadUrl || '#'}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] leading-[18px] font-semibold text-[#0D61AE] hover:underline flex items-center gap-1"
                      >
                        <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
                        <span className="text-[10px]">↓</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
