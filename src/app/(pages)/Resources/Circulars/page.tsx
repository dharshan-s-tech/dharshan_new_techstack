'use client';

import React, { useState, useEffect } from 'react';
import ResourcesLayout from '../ResourcesLayout';
import { dataManager, CircularItem } from '@/lib/dataManager';
import { api } from '@/lib/api';

export default function CircularsPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCirculars(dataManager.getCirculars());
    setLang(dataManager.getLanguage());

    const handleLangChange = () => setLang(dataManager.getLanguage());
    const handleCircularsChange = () => setCirculars(dataManager.getCirculars());

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('circularsChange', handleCircularsChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('circularsChange', handleCircularsChange);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.getResources('circulars', { query: searchQuery.trim() || undefined, page_size: 50 })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items && res.items.length > 0) {
          const mapped: CircularItem[] = res.items.map((it: any) => ({
            id: it.id,
            title: it.title || 'Official Circular',
            title_en: it.title || 'Official Circular',
            title_hi: it.titleHi || 'आधिकारिक परिपत्र',
            refNo: it.category || 'Circular',
            circular_no: it.category || 'Circular',
            category: it.category || 'General Circular',
            date: it.date || it.year || '2025',
            issue_date: it.date || it.year || '2025',
            docUrl: it.fileUrl || '/assets/sample.pdf',
            file_url: it.fileUrl || '/assets/sample.pdf',
            is_active: true
          }));
          setCirculars(mapped);
        } else if (res && res.items && res.items.length === 0 && searchQuery.trim()) {
          setCirculars([]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  const isHindi = lang === 'हिन्दी';

  const filteredCirculars = circulars.filter(item => {
    if (!searchQuery) return true;
    const title = (item as any).title || (item as any).title_en || '';
    const refNo = (item as any).refNo || (item as any).circular_no || '';
    const category = (item as any).category || 'General';
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <ResourcesLayout
      categoryTitle="Resources"
      categoryTitleHi="संसाधन"
      pageTitle="Circulars & Office Orders"
      pageTitleHi="विभागीय परिपत्र एवं कार्यालय आदेश"
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
              {isHindi ? 'विभागीय परिपत्र एवं कार्यालय आदेश' : 'Circulars & Office Orders'}
            </h1>
            <p className="text-[14px] font-medium text-white/80 mt-1">
              {isHindi ? 'आधिकारिक सीएजी नियम, भर्ती परिपत्र, और प्रशासनिक कार्यालय आदेश।' : 'Official CAG regulations, recruitment circulars, and administrative office orders.'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-[#EAEAEA]">
          <div className="relative w-full sm:w-[350px]">
            <input
              type="search"
              placeholder={isHindi ? 'परिपत्र खोजें...' : 'Search circulars by keyword...'}
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
            Showing <strong className="text-[#751639]">{filteredCirculars.length}</strong> circulars
          </span>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="w-full py-8 flex items-center justify-center gap-3 text-[#751639]">
            <div className="w-5 h-5 border-2 border-[#751639] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading circulars...</span>
          </div>
        )}

        {/* Circulars List Cards */}
        {!isLoading && (
          <div className="w-full flex flex-col gap-3">
            {filteredCirculars.length === 0 ? (
              <div className="w-full py-12 px-6 text-center bg-[#FAFAFA] border border-dashed border-zinc-300 rounded-[8px]">
                <p className="text-[15px] font-semibold text-[#2A2A2A]">No circulars found</p>
                <p className="text-[13px] text-zinc-500 mt-1">
                  {searchQuery ? 'Try adjusting your search terms.' : 'No circular records available.'}
                </p>
              </div>
            ) : (
              filteredCirculars.map((item) => (
                <div
                  key={item.id}
                  className="w-full min-h-[56px] py-2.5 px-4 bg-[#FAFAFA] border-l-[3px] border-[#751639] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:bg-[#F2F2F2] transition-colors"
                >
                  <div className="flex flex-col gap-0.5 flex-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-mono font-bold text-[#751639]">
                        {(item as any).refNo || (item as any).circular_no || `#${item.id}`}
                      </span>
                      <span className="inline-block bg-zinc-200 text-zinc-700 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                        {(item as any).category || 'Circular'}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-semibold leading-[19px] text-[#000000]">
                      {(item as any).title || (item as any).title_en || 'Circular Item'}
                    </h3>
                    <p className="text-[12px] text-[#565656]">
                      Date / Ref: {(item as any).date || (item as any).issue_date || 'N/A'}
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
                      <span className="text-[10px] text-[#565656]">PDF Doc</span>
                      <a
                        href={(item as any).docUrl || (item as any).file_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-medium text-[#0D61AE] hover:underline"
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </ResourcesLayout>
  );
}
