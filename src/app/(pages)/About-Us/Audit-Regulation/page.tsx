'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager, AuditRegulationItem, DEFAULT_AUDIT_REGULATIONS } from '@/lib/dataManager';

export default function AuditRegulationPage() {
  const [regulations, setRegulations] = useState<AuditRegulationItem[]>(DEFAULT_AUDIT_REGULATIONS);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [previewDoc, setPreviewDoc] = useState<AuditRegulationItem | null>(null);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    setRegulations(dataManager.getAuditRegulations().filter((r) => r.is_active));

    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };

    const handleRegulationsChange = () => {
      setRegulations(dataManager.getAuditRegulations().filter((r) => r.is_active));
    };

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('auditRegulationsChange', handleRegulationsChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('auditRegulationsChange', handleRegulationsChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'gazette':
        return (
          <img
            src="/assets/gazette-icon.png"
            alt="Regulations on Audit and Accounts"
            className="w-[32px] h-[32px] object-contain"
            width={32}
            height={32}
          />
        );
      case 'book':
        return (
          <img
            src="/assets/book-icon.png"
            alt="Audit Regulations"
            className="w-[32px] h-[32px] object-contain"
            width={32}
            height={32}
          />
        );
      case 'archive':
      default:
        return (
          <img
            src="/assets/archive-icon.png"
            alt="Historical Regulations"
            className="w-[32px] h-[32px] object-contain"
            width={32}
            height={32}
          />
        );
    }
  };

  return (
    <AboutLayout title="Audit Regulation" hideTitleBorder={true}>
      <div className="w-full flex flex-col font-['Noto_Sans']">
        <div className="flex flex-col gap-6">
          {regulations.map((item) => {
            const displayTitle = isHindi ? item.title_hi || item.title_en : item.title_en;

            return (
              <section key={item.id} className="w-full">
                {/* Section Header */}
                <div className="flex items-center gap-3.5 w-full">
                  <div
                    className="w-[32px] h-[32px] rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
                    style={{
                      width: '32px',
                      height: '32px',
                      transform: 'rotate(0deg)',
                      opacity: 1,
                    }}
                  >
                    {renderIcon(item.icon_type || '')}
                  </div>
                  <div className="flex-1 pb-2 border-b border-[#E5E5E5]">
                    <h3 className="text-[15px] md:text-[16px] font-bold text-[#2E2E31] leading-[100%] tracking-[0%] font-['Noto_Sans',sans-serif] text-left">
                      {displayTitle}
                    </h3>
                  </div>
                </div>

                {/* PDF Details Card Box */}
                <div className="ml-[46px] w-[calc(100%-46px)] bg-[#FAFAFA] p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 rounded-[2px]">
                  <div className="flex flex-col gap-1 text-left">
                    <h4 className="text-[14px] font-semibold text-[#000000] leading-[100%] tracking-[0%] font-['Noto_Sans',sans-serif]">
                      {displayTitle}
                    </h4>
                    <span className="text-[12px] font-normal text-[#565656] leading-[100%] tracking-[0%] font-['Noto_Sans',sans-serif]">
                      {item.file_format || 'PDF'}
                    </span>
                  </div>

                  {/* PDF Action Trigger Block (width: 87px, height: 40px, gap: 8px) */}
                  <div
                    className="flex items-center gap-[8px] shrink-0 self-start sm:self-auto"
                    style={{
                      width: '87px',
                      height: '40px',
                      transform: 'rotate(0deg)',
                      opacity: 1,
                    }}
                  >
                    {/* PDF Icon Layout */}
                    <button
                      onClick={() => setPreviewDoc(item)}
                      className="flex items-center justify-center shrink-0 bg-transparent border-none p-0 cursor-pointer hover:scale-105 transition-transform focus:outline-none"
                      style={{
                        width: '27px',
                        height: '32px',
                        transform: 'rotate(0deg)',
                        opacity: 1,
                      }}
                      aria-label={isHindi ? `${displayTitle} पीडीएफ देखें` : `View PDF for ${displayTitle}`}
                    >
                      <img
                        src="/assets/pdf-icon.png"
                        alt="PDF"
                        width={27}
                        height={32}
                        className="w-[27px] h-[32px] object-contain shrink-0 block"
                        style={{
                          width: '27px',
                          height: '32px',
                          transform: 'rotate(0deg)',
                          opacity: 1,
                        }}
                      />
                    </button>

                    <div className="flex flex-col items-start justify-center gap-0 text-left shrink-0">
                      <span className="font-['Noto_Sans',sans-serif] font-normal text-[10px] leading-[16px] tracking-[0%] text-[#565656]">
                        {item.file_size || '34.7 MB'}
                      </span>
                      <button
                        onClick={() => setPreviewDoc(item)}
                        style={{ fontFamily: "'Noto Sans', sans-serif" }}
                        className="text-[12px] font-normal font-['Noto_Sans',sans-serif] leading-[16px] tracking-[0%] text-[#0D61AE] underline decoration-solid hover:text-[#751639] cursor-pointer bg-transparent border-none p-0 focus:outline-none transition-colors text-left whitespace-nowrap"
                      >
                        {isHindi ? 'पीडीएफ देखें' : 'View PDF'}
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
                <span className="text-[11px] font-semibold tracking-wider text-[#751639] uppercase font-['Noto_Sans']">
                  {isHindi ? 'भारत का नियंत्रक एवं महालेखापरीक्षक' : 'CAG Official Document'}
                </span>
                <h3 className="text-lg font-bold text-zinc-900 mt-1 font-['Noto_Sans']">
                  {isHindi ? previewDoc.title_hi || previewDoc.title_en : previewDoc.title_en}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-['Noto_Sans']">
                  {previewDoc.file_format || 'PDF'} • {previewDoc.file_size || '34.7 MB'}
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
              <p className="text-sm font-semibold text-zinc-800 font-['Noto_Sans']">
                {isHindi ? previewDoc.title_hi || previewDoc.title_en : previewDoc.title_en}
              </p>
              <p className="text-xs text-zinc-500 max-w-md font-['Noto_Sans']">
                {isHindi
                  ? 'यह दस्तावेज आधिकारिक सीएजी पोर्टल से सार्वजनिक उपयोग एवं लेखापरीक्षा विनियमों के अनुपालन के लिए उपलब्ध है।'
                  : 'This document is published by the Comptroller and Auditor General of India under statutory audit regulations and standards.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 transition-colors font-['Noto_Sans'] cursor-pointer"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
              <a
                href={previewDoc.file_url === '#' ? `/${previewDoc.title_en}.pdf` : previewDoc.file_url}
                download
                onClick={(e) => {
                  e.preventDefault();
                  alert(isHindi ? 'दस्तावेज डाउनलोड शुरू हो रहा है...' : 'Downloading document...');
                }}
                className="px-5 py-2.5 bg-[#751639] hover:bg-[#5a102b] text-white text-xs font-semibold rounded shadow transition-colors flex items-center gap-2 font-['Noto_Sans'] cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'} ({previewDoc.file_size || '34.7 MB'})
              </a>
            </div>
          </div>
        </div>
      )}
    </AboutLayout>
  );
}
