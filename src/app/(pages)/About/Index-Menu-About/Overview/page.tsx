'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

export default function AboutOverviewPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    api.getPageContent('page-overview', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      api.getPageContent('page-overview', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
        if (isMounted && res) setPageData(res);
      });
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => {
      isMounted = false;
      window.removeEventListener('languageChange', handleLangChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <AboutLayout title={isHindi ? 'अवलोकन' : 'Overview'}>
      <div className="space-y-6 text-left max-w-[958px]">
        <h1 className="text-2xl font-bold text-[#751639] font-['Noto_Sans',sans-serif]">
          {isHindi ? 'भारत के सीएजी: एक अवलोकन' : 'Comptroller & Auditor General of India: Overview'}
        </h1>

        {pageData?.content_html ? (
          <div
            className="prose max-w-none text-zinc-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: pageData.content_html }}
          />
        ) : (
          <div className="space-y-4 text-zinc-700 text-sm leading-relaxed">
            <p>
              {isHindi
                ? 'भारत के नियंत्रक और महालेखापरीक्षक (सीएजी) भारत के संविधान के अनुच्छेद 148 के तहत नियुक्त एक सर्वोच्च संवैधानिक प्राधिकरण हैं। सीएजी भारतीय लेखापरीक्षा और लेखा विभाग (आईएएंडएडी) के प्रमुख हैं।'
                : 'The Comptroller and Auditor General (CAG) of India is a supreme constitutional authority appointed under Article 148 of the Constitution of India. The CAG is the head of the Indian Audit and Accounts Department (IA&AD).'}
            </p>
            <p>
              {isHindi
                ? 'हमारा संगठन भारत में सभी प्रशासनिक स्तरों पर पारदर्शिता, जवाबदेही और वित्तीय अनुशासन को बढ़ावा देने के लिए समर्पित है।'
                : 'Our organization is dedicated to promoting transparency, accountability, and fiscal integrity across all administrative channels in the Union and State governments.'}
            </p>
          </div>
        )}

        {/* Quick Links to Domain Subpages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
          <Link
            href="/About/About-Us/Cag-Of-India"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'सीएजी प्रोफाइल' : 'CAG of India Profile'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'वर्तमान सीएजी की जीवनी और अधिदेश' : 'Profile, biography, and executive mandate'}
            </p>
          </Link>

          <Link
            href="/About/About-Us/Our-Vision,-Mission-&-Core-Values"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'दृष्टिकोण और ध्येय' : 'Vision & Mission'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'संस्थागत मार्गदर्शक सिद्धांत और मूल्य' : 'Core values and strategic objectives'}
            </p>
          </Link>

          <Link
            href="/About/About-Us/Organisation-Chart"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'संगठन चार्ट' : 'Organisation Chart'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'विभाग की पदानुक्रमित संरचना' : 'Hierarchy and reporting framework'}
            </p>
          </Link>
        </div>
      </div>
    </AboutLayout>
  );
}
