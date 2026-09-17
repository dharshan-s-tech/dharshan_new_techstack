'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';
import NamesDetailsCard from '@/Reusable components/Cards/Names & Details Cards/NamesDetailsCard';

const ENGLISH_STREAMS = [
  {
    title: 'Indian Audit & Accounts Service (IA&AS)',
    content: 'Recruited through Union Public Service Commission (UPSC) Civil Services Examination. Officers manage supreme audits of government ministries.'
  },
  {
    title: 'Direct Recruitment via Staff Selection Commission (SSC)',
    content: 'Audit officers, senior auditors, and clerical executives recruited through the Combined Graduate Level (CGL) examination conducted by SSC.'
  },
  {
    title: 'Young Professional and Internship Programs',
    content: 'We offer contract positions and internships for graduates in statistics, economics, and computer applications.'
  }
];

const HINDI_STREAMS = [
  {
    title: 'भारतीय लेखा परीक्षा और लेखा सेवा (IA&AS)',
    content: 'संघ लोक सेवा आयोग (UPSC) सिविल सेवा परीक्षा के माध्यम से भर्ती। अधिकारी सरकारी मंत्रालयों के सर्वोच्च ऑडिट का प्रबंधन करते हैं।'
  },
  {
    title: 'कर्मचारी चयन आयोग (SSC) के माध्यम से सीधी भर्ती',
    content: 'एसएससी द्वारा आयोजित संयुक्त स्नातक स्तरीय (CGL) परीक्षा के माध्यम से भर्ती किए गए लेखा परीक्षा अधिकारी, वरिष्ठ लेखा परीक्षक और लिपिकीय कार्यकारी।'
  },
  {
    title: 'युवा पेशेवर और इंटर्नशिप कार्यक्रम',
    content: 'हम सांख्यिकी, अर्थशास्त्र और कंप्यूटर अनुप्रयोगों में स्नातकों के लिए अनुबंध पदों और इंटर्नशिप की पेशकश करते हैं।'
  }
];

export default function CareerEngagementPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [activeTab, setActiveTab] = useState<'rules' | 'notices' | 'deputation' | 'internships'>('rules');
  const [careerDocs, setCareerDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const slugMap = {
      rules: 'recruitment-rules',
      notices: 'recruitment-notices',
      deputation: 'deputation',
      internships: 'young-professional-programme'
    };

    api.getResources(slugMap[activeTab], { query: searchQuery, page, page_size: 10 })
      .then((res) => {
        if (!isMounted) return;
        if (res && Array.isArray(res.items)) {
          setCareerDocs(res.items);
          setTotalCount(res.total || res.items.length);
        } else {
          setCareerDocs([]);
          setTotalCount(0);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setCareerDocs([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab, searchQuery, page]);

  const isHindi = lang === 'हिन्दी';
  const streams = isHindi ? HINDI_STREAMS : ENGLISH_STREAMS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-[#e6e6e6] pb-4">
        <h2 className="text-3xl font-extrabold text-[#2a2a2a] tracking-tight font-['Noto_Sans',sans-serif]">
          {isHindi ? 'करियर और जुड़ाव' : 'Careers & Engagement'}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {isHindi ? 'शासन में पारदर्शिता लाने के लिए भारत के नियंत्रक एवं महालेखा परीक्षक के साथ जुड़ें।' : 'Join the Comptroller & Auditor General of India to build transparency and accountability in public administration.'}
        </p>
      </div>

      {/* Recruitment Pathways */}
      <section className="space-y-6">
        <div className="border-l-4 border-[#751639] pl-4">
          <h3 className="text-xl font-bold text-[#2a2a2a] font-['Noto_Sans',sans-serif]">
            {isHindi ? 'भर्ती मार्ग' : 'Recruitment Pathways'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streams.map((stream, idx) => (
            <NamesDetailsCard
              key={idx}
              title={stream.title}
              content={stream.content}
            />
          ))}
        </div>
      </section>

      {/* Live Career Documents & Notices Section */}
      <section className="space-y-6 bg-white border border-[#ced4da] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#e6e6e6] pb-4">
          <div className="border-l-4 border-[#751639] pl-4">
            <h3 className="text-xl font-bold text-[#751639] font-['Noto_Sans',sans-serif]">
              {isHindi ? 'नवीनतम करियर सूचनाएं और परिपत्र' : 'Live Career Notices & Regulations'}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isHindi ? 'भारत के सीएजी के डेटाबेस से सीधे आधिकारिक दस्तावेज और अधिसूचनाएं।' : 'Directly connected to PostgreSQL CAG database for official rules, notifications and opportunities.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder={isHindi ? 'सूचनाएं खोजें...' : 'Search notices & rules...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs px-3 py-2 border border-zinc-300 focus:outline-none focus:border-[#751639]"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
          {[
            { id: 'rules', labelEn: 'Recruitment Rules', labelHi: 'भर्ती नियम' },
            { id: 'notices', labelEn: 'Recruitment Notices', labelHi: 'भर्ती सूचनाएं' },
            { id: 'deputation', labelEn: 'Deputation Circulars', labelHi: 'प्रतिनियुक्ति परिपत्र' },
            { id: 'internships', labelEn: 'Young Professionals & Internships', labelHi: 'युवा पेशेवर और इंटर्नशिप' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#751639] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {isHindi ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Dynamic Table / Listing */}
        {loading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#751639] mb-2"></div>
            <p>{isHindi ? 'डेटाबेस से लोड हो रहा है...' : 'Loading official records from database...'}</p>
          </div>
        ) : careerDocs.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs bg-zinc-50 border border-dashed border-zinc-200">
            {isHindi ? 'कोई रिकॉर्ड नहीं मिला।' : 'No records found for the selected category.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f2f4f7] border-b border-[#ced4da] text-zinc-700 font-bold">
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">{isHindi ? 'शीर्षक / विषय' : 'Title / Subject'}</th>
                  <th className="py-2.5 px-4 w-32">{isHindi ? 'तिथि' : 'Date'}</th>
                  <th className="py-2.5 px-4 w-32 text-center">{isHindi ? 'दस्तावेज' : 'Document'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {careerDocs.map((doc, idx) => {
                  const docTitle = isHindi && doc.title_hi ? doc.title_hi : (doc.title || doc.title_en || 'Official Notice');
                  const docDate = doc.date || doc.published_date || doc.created_at || 'Recent';
                  const docUrl = doc.file_url || doc.pdf_url || '#';

                  return (
                    <tr key={doc.id || idx} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4 text-center text-zinc-400">{(page - 1) * 10 + idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-800">{docTitle}</div>
                        {doc.reference_no && (
                          <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Ref: {doc.reference_no}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">{docDate}</td>
                      <td className="py-3 px-4 text-center">
                        {docUrl && docUrl !== '#' ? (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#751639] hover:underline"
                          >
                            <span>📥 Download PDF</span>
                          </a>
                        ) : (
                          <span className="text-zinc-400 text-[11px]">Notice</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalCount > 10 && (
          <div className="flex justify-between items-center pt-4 border-t border-zinc-200 text-xs text-zinc-600">
            <span>
              {isHindi ? `कुल ${totalCount} में से ${(page - 1) * 10 + 1}-${Math.min(page * 10, totalCount)}` : `Showing ${(page - 1) * 10 + 1}-${Math.min(page * 10, totalCount)} of ${totalCount} records`}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border border-zinc-300 disabled:opacity-40 hover:bg-zinc-100 cursor-pointer"
              >
                &larr; Prev
              </button>
              <button
                disabled={page * 10 >= totalCount}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border border-zinc-300 disabled:opacity-40 hover:bg-zinc-100 cursor-pointer"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
