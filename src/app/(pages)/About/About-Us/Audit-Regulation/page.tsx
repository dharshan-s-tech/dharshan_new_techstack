'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager, AuditRegulationItem, DEFAULT_AUDIT_REGULATIONS } from '@/lib/dataManager';

// Local exported SVG icon path helper
const getSvgIconPath = (iconType: string | undefined, index: number) => {
  if (iconType === 'gazette' || index === 0) {
    return '/assets/Images/auditregulation/auditregulation1.svg';
  }
  if (iconType === 'book' || index === 1) {
    return '/assets/Images/auditregulation/auditregulation2.svg';
  }
  return '/assets/Images/auditregulation/auditregulation3.svg';
};

// PDF Document Icon Badge
function PdfBadgeIcon() {
  return (
    <img 
      src="/assets/pdf-red-icon.png" 
      alt="PDF" 
      width={27} 
      height={32} 
      className="w-[27px] h-[32px] object-contain shrink-0" 
    />
  );
}

export default function AuditRegulationPage() {
  const [regulations, setRegulations] = useState<AuditRegulationItem[]>(DEFAULT_AUDIT_REGULATIONS);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [previewDoc, setPreviewDoc] = useState<AuditRegulationItem | null>(null);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const initialList = dataManager.getAuditRegulations().filter((r) => r.is_active || r.isActive);
    setRegulations(initialList.length > 0 ? initialList : DEFAULT_AUDIT_REGULATIONS);

    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };

    const handleRegulationsChange = () => {
      const updatedList = dataManager.getAuditRegulations().filter((r) => r.is_active || r.isActive);
      setRegulations(updatedList.length > 0 ? updatedList : DEFAULT_AUDIT_REGULATIONS);
    };

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('auditRegulationsChange', handleRegulationsChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('auditRegulationsChange', handleRegulationsChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';



  return (
    <AboutLayout title="Audit Regulation" hideTitleBorder={true}>
      <div className="w-full max-w-[978px] flex flex-col font-['Noto_Sans',sans-serif]">
        {/* Page Title */}
        <h1
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '160%',
            color: '#751639',
          }}
          className="text-left mb-6"
        >
          {isHindi ? 'लेखा परीक्षा विनियम' : 'Audit Regulation'}
        </h1>

        {/* Accordion / Regulation Sections Container */}
        <div className="flex flex-col gap-6 w-full">
          {regulations.map((item, index) => {
            const displayTitle = isHindi ? item.title_hi || item.title_en : item.title_en;
            const pdfFormat = item.file_format || 'PDF';
            const pdfSize = item.file_size || item.size || '34.7 MB';
            const viewPdfText = isHindi ? 'पीडीएफ देखें' : 'View PDF';

            return (
              <section key={item.id || index} className="w-full flex flex-col gap-2">
                {/* Accordion Header Row */}
                <div className="flex items-center gap-4 w-full">
                  {/* Round Circle Badge: exported local SVG asset */}
                  <img 
                    src={getSvgIconPath(item.icon_type, index)} 
                    alt="" 
                    width={32} 
                    height={32} 
                    className="w-[32px] h-[32px] rounded-full shrink-0 object-contain shadow-sm" 
                  />

                  {/* Title Box with bottom divider line */}
                  <div className="flex-1 py-2 border-b border-[#D7D7D7] flex items-center justify-between">
                    <h2
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '22px',
                        color: '#2E2E31',
                      }}
                      className="text-left m-0"
                    >
                      {displayTitle}
                    </h2>
                  </div>
                </div>

                {/* PDF Details Card Box: background: #FAFAFA, height: 56px */}
                <div
                  style={{
                    backgroundColor: '#FAFAFA',
                    borderLeft: '2px solid #FAFAFA',
                    minHeight: '56px',
                  }}
                  className="ml-12 w-[calc(100%-48px)] p-2 px-4 flex flex-row items-center justify-between gap-4"
                >
                  {/* Left Column: Title & PDF type */}
                  <div className="flex flex-col justify-center gap-1 text-left">
                    <span
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '19px',
                        color: '#000000',
                      }}
                      className="block truncate max-w-[600px]"
                    >
                      {displayTitle}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: '#565656',
                      }}
                      className="block"
                    >
                      {pdfFormat}
                    </span>
                  </div>

                  {/* Right Column: PDF Action Container: width: 87px, height: 40px, gap: 8px */}
                  <div
                    style={{
                      width: '87px',
                      height: '40px',
                    }}
                    className="flex flex-row items-center gap-2 shrink-0"
                  >
                    {/* PDF Badge Icon (click to preview) */}
                    <button
                      onClick={() => setPreviewDoc(item)}
                      className="flex items-center justify-center shrink-0 bg-transparent border-none p-0 cursor-pointer hover:scale-105 transition-transform focus:outline-none"
                      style={{ width: '27px', height: '32px' }}
                      aria-label={isHindi ? `${displayTitle} पीडीएफ देखें` : `View PDF for ${displayTitle}`}
                    >
                      <PdfBadgeIcon />
                    </button>

                    {/* PDF Details Text: File Size & View PDF Link */}
                    <div className="flex flex-col items-start justify-center text-left shrink-0">
                      <span
                        style={{
                          fontFamily: "'Noto Sans', sans-serif",
                          fontWeight: 400,
                          fontSize: '10px',
                          lineHeight: '160%',
                          color: '#565656',
                        }}
                        className="block whitespace-nowrap"
                      >
                        {pdfSize}
                      </span>
                      <button
                        onClick={() => setPreviewDoc(item)}
                        style={{
                          fontFamily: "'Noto Sans', sans-serif",
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '160%',
                          color: '#0D61AE',
                          textDecoration: 'underline',
                        }}
                        className="bg-transparent border-none p-0 cursor-pointer hover:text-[#751639] transition-colors focus:outline-none whitespace-nowrap text-left"
                      >
                        {viewPdfText}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Interactive PDF Document Viewer Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 animate-fadeIn"
          onClick={() => setPreviewDoc(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 relative flex flex-col gap-4 border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b pb-3">
              <div className="text-left">
                <span className="text-[11px] font-semibold tracking-wider text-[#751639] uppercase font-['Noto_Sans',sans-serif]">
                  {isHindi ? 'भारत का नियंत्रक एवं महालेखापरीक्षक' : 'CAG Official Document'}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 mt-1 font-['Noto_Sans',sans-serif]">
                  {isHindi ? previewDoc.title_hi || previewDoc.title_en : previewDoc.title_en}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-['Noto_Sans',sans-serif]">
                  {previewDoc.file_format || 'PDF'} • {previewDoc.file_size || previewDoc.size || '34.7 MB'}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-zinc-400 hover:text-zinc-700 text-2xl leading-none font-bold p-1 cursor-pointer focus:outline-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Simulated PDF Preview Canvas */}
            <div className="bg-zinc-50 border border-zinc-200 rounded p-8 flex flex-col items-center justify-center min-h-[240px] text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-zinc-800 font-['Noto_Sans',sans-serif]">
                {isHindi ? previewDoc.title_hi || previewDoc.title_en : previewDoc.title_en}
              </p>
              <p className="text-xs text-zinc-500 max-w-md font-['Noto_Sans',sans-serif]">
                {isHindi
                  ? 'यह दस्तावेज आधिकारिक सीएजी पोर्टल से सार्वजनिक उपयोग एवं लेखापरीक्षा विनियमों के अनुपालन के लिए उपलब्ध है।'
                  : 'This document is published by the Comptroller and Auditor General of India under statutory audit regulations and standards.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 transition-colors font-['Noto_Sans',sans-serif] cursor-pointer"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
              <a
                href={previewDoc.file_url === '#' || !previewDoc.file_url ? `/${previewDoc.title_en}.pdf` : previewDoc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#751639] hover:bg-[#5a102b] text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-2 font-['Noto_Sans',sans-serif] cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'} ({previewDoc.file_size || previewDoc.size || '34.7 MB'})
              </a>
            </div>
          </div>
        </div>
      )}
    </AboutLayout>
  );
}
