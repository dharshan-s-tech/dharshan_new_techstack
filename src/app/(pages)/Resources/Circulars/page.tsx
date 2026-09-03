'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager, CircularItem } from '@/lib/dataManager';

export default function CircularsPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [circulars, setCirculars] = useState<CircularItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const isHindi = lang === 'हिन्दी';

  const filteredCirculars = circulars.filter(item => {
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-[#751639] font-bold">Circulars & Office Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2a2a2a] tracking-tight">
            {isHindi ? 'विभागीय परिपत्र एवं कार्यालय आदेश' : 'Departmental Circulars & Office Orders'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isHindi ? 'आधिकारिक सीएजी नियम, भर्ती परिपत्र, और प्रशासनिक कार्यालय आदेश।' : 'Official CAG regulations, recruitment circulars, and administrative office orders.'}
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-72">
          <input
            type="search"
            placeholder={isHindi ? 'परिपत्र खोजें...' : 'Search circulars by ref no or keyword...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-zinc-300 rounded px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-[#751639]"
          />
        </div>
      </div>

      {/* Circulars Table List */}
      <div className="bg-white border border-[#ced4da] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#751639] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Subject / Circular Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Release Date</th>
                <th className="py-3 px-4 text-center">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredCirculars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs">
                    {isHindi ? 'कोई परिपत्र नहीं मिला।' : 'No circulars found matching search query.'}
                  </td>
                </tr>
              ) : (
                filteredCirculars.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#751639]">
                      {item.refNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-800">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-zinc-100 border border-zinc-300 text-zinc-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 font-medium">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <a
                        href={item.docUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#751639] font-bold hover:underline"
                      >
                        <span>📄 PDF</span>
                        <span className="text-[10px]">↘</span>
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
