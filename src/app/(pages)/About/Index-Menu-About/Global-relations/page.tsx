'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

export default function GlobalRelationsLandingPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    api.getPageContent('page-international-relations', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      api.getPageContent('page-international-relations', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
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
    <AboutLayout title={isHindi ? 'वैश्विक संबंध' : 'Global Relations'}>
      <div className="space-y-6 text-left max-w-[958px]">
        <h1 className="text-2xl font-bold text-[#751639] font-['Noto_Sans',sans-serif]">
          {isHindi ? 'अंतर्राष्ट्रीय संबंध और वैश्विक सहयोग' : 'International Relations & Global Engagements'}
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
                ? 'भारत के सीएजी अंतर्राष्ट्रीय लेखापरीक्षा समुदाय में एक प्रमुख भूमिका निभाते हैं। सीएजी INTOSAI, ASOSAI, और संयुक्त राष्ट्र बाह्य लेखा परीक्षकों के पैनल में सक्रिय रूप से भाग लेते हैं।'
                : 'The Comptroller and Auditor General of India plays a prominent leadership role in the international supreme audit community. CAG actively leads working groups in INTOSAI, ASOSAI, and the United Nations Panel of External Auditors.'}
            </p>
          </div>
        )}

        {/* Global Relations Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-zinc-200">
          {[
            { slug: 'Association with INTOSAI', titleEn: 'Association with INTOSAI', titleHi: 'INTOSAI के साथ जुड़ाव', desc: 'Global leadership and working group standards' },
            { slug: 'Association with ASOSAI', titleEn: 'Association with ASOSAI', titleHi: 'ASOSAI के साथ जुड़ाव', desc: 'Asian Regional organization leadership' },
            { slug: 'UN Panel of External Auditors', titleEn: 'UN Panel of External Auditors', titleHi: 'संयुक्त राष्ट्र बाह्य लेखा परीक्षक पैनल', desc: 'External audits of UN Secretariat and agencies' },
            { slug: 'Bilateral Relations', titleEn: 'Bilateral Relations', titleHi: 'द्विपक्षीय संबंध', desc: 'Partnerships with SAIs across the globe' },
            { slug: 'Overseas Audit Offices', titleEn: 'Overseas Audit Offices', titleHi: 'विदेशी लेखा परीक्षा कार्यालय', desc: 'Offices in London, Washington, and Kuala Lumpur' },
            { slug: 'International Relations Wing', titleEn: 'International Relations Wing', titleHi: 'अंतर्राष्ट्रीय संबंध विंग', desc: 'Contact and international secretariat' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/About/Index-Menu-About/Global-relations/${encodeURIComponent(item.slug)}`}
              className="p-4 bg-zinc-50 hover:bg-[#751639]/5 border border-zinc-200 hover:border-[#751639] transition-all"
            >
              <h4 className="font-bold text-sm text-[#751639] mb-1">
                {isHindi ? item.titleHi : item.titleEn} &rarr;
              </h4>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}
