'use client';

import React, { useState, useEffect } from 'react';
import NamesDetailsCard from '@/Reusable components/Cards/Names & Details Cards/NamesDetailsCard';
import { dataManager } from '@/lib/dataManager';

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

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';
  const streams = isHindi ? HINDI_STREAMS : ENGLISH_STREAMS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-[#e6e6e6] pb-4">
        <h2 className="text-3xl font-extrabold text-[#2a2a2a] tracking-tight">
          {isHindi ? 'करियर और जुड़ाव' : 'Careers & Engagement'}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {isHindi ? 'शासन में पारदर्शिता लाने के लिए भारत के नियंत्रक एवं महालेखा परीक्षक के साथ जुड़ें।' : 'Join the Comptroller & Auditor General of India to build transparency in governance.'}
        </p>
      </div>

      <section className="space-y-6">
        <div className="border-l-4 border-[#0a3d30] pl-4">
          <h3 className="text-xl font-bold text-[#2a2a2a]">
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
    </div>
  );
}
