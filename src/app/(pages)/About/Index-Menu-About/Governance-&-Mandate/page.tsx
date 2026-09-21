'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

export default function GovernanceMandatePage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    api.getPageContent('page-governance-and-mandate', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      api.getPageContent('page-governance-and-mandate', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
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
    <AboutLayout title={isHindi ? 'शासन और अधिदेश' : 'Governance & Mandate'}>
      <div className="space-y-6 text-left max-w-[958px]">
        <h1 className="text-2xl font-bold text-[#751639] font-['Noto_Sans',sans-serif]">
          {isHindi ? 'संवैधानिक और कानूनी अधिदेश' : 'Constitutional and Statutory Mandate'}
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
                ? 'सीएजी का अधिदेश भारत के संविधान के अनुच्छेद 148 से 151 से प्राप्त होता है। संविधान स्वतंत्र लेखापरीक्षा के माध्यम से लोकतांत्रिक जवाबदेही सुनिश्चित करने के लिए सीएजी को स्वायत्त दर्जा प्रदान करता है।'
                : 'The supreme audit mandate of the CAG is anchored in Articles 148 to 151 of the Constitution of India. The constitutional framework secures the independence of the CAG to enforce public financial accountability.'}
            </p>
            <p>
              {isHindi
                ? 'नियंत्रक और महालेखापरीक्षक (कर्तव्य, शक्तियां और सेवा की शर्तें) अधिनियम, 1971 संघ, राज्यों और स्थानीय निकायों की प्राप्तियों और व्यय की लेखापरीक्षा के दायरे को विस्तार से परिभाषित करता है।'
                : 'The Comptroller and Auditor General’s (Duties, Powers and Conditions of Service) Act, 1971 governs the statutory functions and empowers the CAG to audit all receipts and expenditure of the Union, States, and public bodies.'}
            </p>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
          <Link
            href="/About/About-Us/Constitutional-Provisions"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'संवैधानिक प्रावधान' : 'Constitutional Provisions'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'अनुच्छेद 148-151 और अनुसूचियां' : 'Articles 148 to 151 and Schedules'}
            </p>
          </Link>

          <Link
            href="/About/About-Us/Duties-&-Powers-Act"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'डीपीसी अधिनियम (DPC Act)' : 'Duties & Powers Act'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'अधिनियम 1971 के अध्याय और धाराएं' : 'Act of 1971 chapters and provisions'}
            </p>
          </Link>

          <Link
            href="/About/About-Us/Audit-Regulation"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'लेखा परीक्षा विनियम' : 'Audit Regulations'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'सीएजी लेखापरीक्षा और लेखा विनियम 2020' : 'Regulations on Audit and Accounts 2020'}
            </p>
          </Link>
        </div>
      </div>
    </AboutLayout>
  );
}
