'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

export default function LeadershipLegacyPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    api.getPageContent('page-leadership-and-legacy', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      api.getPageContent('page-leadership-and-legacy', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
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
    <AboutLayout title={isHindi ? 'नेतृत्व और विरासत' : 'Leadership & Legacy'}>
      <div className="space-y-6 text-left max-w-[958px]">
        <h1 className="text-2xl font-bold text-[#751639] font-['Noto_Sans',sans-serif]">
          {isHindi ? 'संस्थागत नेतृत्व और ऐतिहासिक विरासत' : 'Institutional Leadership & Historical Legacy'}
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
                ? 'भारतीय लेखापरीक्षा और लेखा विभाग की नेतृत्व विरासत 160 से अधिक वर्षों के वित्तीय निरीक्षण और लेखापरीक्षा उत्कृष्टता पर आधारित है। 1860 में सर एडमंड ड्रमंड से लेकर वर्तमान सीएजी तक, विभाग ने निष्ठा और स्वतंत्रता के उच्चतम मानकों को बरकरार रखा है।'
                : 'The leadership legacy of the Indian Audit and Accounts Department spans more than 160 years of public auditing and fiscal stewardship. From Sir Edmund Drummond in 1860 to the current CAG, the department has maintained the highest standards of independence, integrity, and professional objectivity.'}
            </p>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
          <Link
            href="/About/About-Us/Former-Comptroller-and-Auditors-General"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'पूर्व सीएजी गैलरी' : 'Former CAGs Gallery'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? '1860 से अब तक के सभी पूर्व सीएजी' : 'Chronology of all Comptroller & Auditors General'}
            </p>
          </Link>

          <Link
            href="/About/About-Us/History-of-Indian-Audit-ans-Accounts-Department"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'आईएएडी का इतिहास' : 'History of IAAD'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'विभाग की ऐतिहासिक यात्रा' : 'Evolution from 1860 to modern digital audit'}
            </p>
          </Link>

          <Link
            href="/About/About-Us/Audit-Advisory-Board"
            className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
          >
            <h4 className="font-bold text-sm text-[#751639] mb-1">
              {isHindi ? 'लेखा परीक्षा सलाहकार बोर्ड' : 'Audit Advisory Board'} &rarr;
            </h4>
            <p className="text-xs text-zinc-500">
              {isHindi ? 'प्रतिष्ठित बाहरी और आंतरिक विशेषज्ञ' : 'Eminent external experts advising the CAG'}
            </p>
          </Link>
        </div>
      </div>
    </AboutLayout>
  );
}
