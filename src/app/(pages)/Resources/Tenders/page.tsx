'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tenderNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Breadcrumb & Title */}
      <div className="border-b border-[#e6e6e6] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:underline">Home</Link>
            <span>›</span>
            <Link href="/Resources" className="hover:underline">Resources</Link>
            <span>›</span>
            <span className="text-[#751639] font-bold">Tenders & Procurement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2a2a2a] tracking-tight">
            {isHindi ? 'निविदाएं और खरीद' : 'Tenders & Procurement Notices'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isHindi ? 'आधिकारिक सीएजी निविदाएं, अनुबंध और खरीद दस्तावेज।' : 'Official CAG tenders, empanelments, and procurement documentation.'}
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-72">
          <input
            type="search"
            placeholder={isHindi ? 'निविदा खोजें...' : 'Search tenders...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-300 rounded px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-[#751639]"
          />
        </div>
      </div>

      {/* Tenders Table List */}
      <div className="bg-white border border-[#ced4da] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#751639] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Tender Ref No</th>
                <th className="py-3 px-4">Tender Subject Title</th>
                <th className="py-3 px-4">Closing Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Tender Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredTenders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs">
                    {isHindi ? 'कोई निविदा नहीं मिली।' : 'No tenders found matching search query.'}
                  </td>
                </tr>
              ) : (
                filteredTenders.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#751639]">
                      {item.tenderNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-800">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 font-medium">
                      {item.closingDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <a
                        href={item.docUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#751639] font-bold hover:underline"
                      >
                        <span>📄 Download</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
