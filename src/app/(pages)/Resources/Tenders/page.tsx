'use client';

import React, { useState, useEffect } from 'react';
import ResourcesLayout from '../ResourcesLayout';
import { dataManager, TenderItem } from '@/lib/dataManager';

export default function TendersPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [tenders, setTenders] = useState<TenderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTenders(dataManager.getTenders());
    setLang(dataManager.getLanguage());

    const handleLangChange = () => setLang(dataManager.getLanguage());
    const handleTendersChange = () => setTenders(dataManager.getTenders());

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('tendersChange', handleTendersChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('tendersChange', handleTendersChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const filteredTenders = tenders.filter(item => {
    if (!searchQuery) return true;
    const title = (item as any).title || (item as any).title_en || '';
    const tenderNo = (item as any).tenderNo || (item as any).reference_no || '';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenderNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ResourcesLayout
      categoryTitle="Resources"
      categoryTitleHi="संसाधन"
      pageTitle="Tenders & Procurement"
      pageTitleHi="निविदाएं और खरीद"
    >
      <div className="w-full flex flex-col gap-6 font-['Noto_Sans',sans-serif]">
        
        {/* Hero Header Banner */}
        <div 
          className="relative w-full h-[142px] rounded-[8px] overflow-hidden flex items-center px-8 shadow-sm"
          style={{
            background: 'linear-gradient(108deg, #751639 0%, #8b1e46 55%, #59102b 100%)'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-[24px] md:text-[28px] font-bold leading-[38px] text-[#FFFFFF] tracking-tight">
              {isHindi ? 'निविदाएं और खरीद' : 'Tenders & Procurement Notices'}
            </h1>
            <p className="text-[14px] font-medium text-white/80 mt-1">
              {isHindi ? 'आधिकारिक सीएजी निविदाएं, अनुबंध और खरीद दस्तावेज।' : 'Official CAG tenders, empanelments, and procurement documentation.'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-[#EAEAEA]">
          <div className="relative w-full sm:w-[350px]">
            <input
              type="search"
              placeholder={isHindi ? 'निविदा खोजें...' : 'Search tenders...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[40px] pl-4 pr-10 bg-white border border-[#4D4D4D] rounded-[8px] text-[14px] text-[#2A2A2A] placeholder-[#717171] focus:outline-none focus:ring-1 focus:ring-[#751639]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4D4D4D]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5" stroke="#4D4D4D" strokeWidth="1.3"/>
                <path d="M10.5 10.5L14 14" stroke="#4D4D4D" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <span className="text-[12px] text-zinc-500 font-medium">
            Showing <strong className="text-[#751639]">{filteredTenders.length}</strong> notices
          </span>
        </div>

        {/* Tenders List Cards */}
        <div className="w-full flex flex-col gap-3">
          {filteredTenders.length === 0 ? (
            <div className="w-full py-12 px-6 text-center bg-[#FAFAFA] border border-dashed border-zinc-300 rounded-[8px]">
              <p className="text-[15px] font-semibold text-[#2A2A2A]">No tenders found</p>
              <p className="text-[13px] text-zinc-500 mt-1">
                {searchQuery ? 'Try adjusting your search terms.' : 'No active tender notices at this time.'}
              </p>
            </div>
          ) : (
            filteredTenders.map((item) => (
              <div
                key={item.id}
                className="w-full min-h-[56px] py-2.5 px-4 bg-[#FAFAFA] border-l-[3px] border-[#751639] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:bg-[#F2F2F2] transition-colors"
              >
                <div className="flex flex-col gap-0.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono font-bold text-[#751639]">
                      {(item as any).tenderNo || (item as any).reference_no || `#${item.id}`}
                    </span>
                    <span className={`inline-block px-2 py-0.2 rounded text-[10px] font-bold ${
                      item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                    }`}>
                      {item.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold leading-[19px] text-[#000000]">
                    {(item as any).title || (item as any).title_en || 'Tender Notice'}
                  </h3>
                  <p className="text-[12px] text-[#565656]">
                    Closing Date: {(item as any).closingDate || (item as any).closing_date || 'N/A'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="w-[27px] h-[32px] flex items-center justify-center shrink-0">
                    <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="26" height="30" rx="3" fill="#D92D20"/>
                      <path d="M17 0L26 9H17V0Z" fill="#B42318"/>
                      <text x="3" y="21" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-[#565656]">Document</span>
                    <a
                      href={(item as any).docUrl || (item as any).tender_file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-medium text-[#0D61AE] hover:underline"
                    >
                      Download Notice
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </ResourcesLayout>
  );
}
