'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

interface GlobalCardItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  link: string;
}

const GLOBAL_RELATIONS_CARDS: GlobalCardItem[] = [
  {
    id: 'intosai',
    titleEn: 'Association with INTOSAI',
    titleHi: 'INTOSAI के साथ जुड़ाव',
    descEn: 'SAI India plays a prominent leadership role in INTOSAI governing boards, committees, and global auditing standards.',
    descHi: 'साई इंडिया इंटोसाई शासी बोर्डों, समितियों और वैश्विक लेखापरीक्षा मानकों में एक प्रमुख नेतृत्वकारी भूमिका निभाता है।',
    link: '/About/Index-Menu-About/Global-relations/Association with INTOSAI'
  },
  {
    id: 'asosai',
    titleEn: 'Association with ASOSAI',
    titleHi: 'ASOSAI के साथ जुड़ाव',
    descEn: 'Promoting regional cooperation, mutual capacity building, and knowledge sharing among Asian Supreme Audit Institutions.',
    descHi: 'एशियाई सर्वोच्च लेखापरीक्षा संस्थानों के बीच क्षेत्रीय सहयोग, क्षमता निर्माण और ज्ञान साझाकरण को बढ़ावा देना।',
    link: '/About/Index-Menu-About/Global-relations/Association with ASOSAI'
  },
  {
    id: 'multilateral',
    titleEn: 'Engagement with Multilateral Forums',
    titleHi: 'बहुपक्षीय मंचों के साथ सहभागिता',
    descEn: 'Active participation in Global Audit Leadership Forum (GALF), BRICS SAI leaders summits, and international audit colloquiums.',
    descHi: 'ग्लोबल ऑडिट लीडरशिप फोरम (GALF), ब्रिक्स साई लीडर्स शिखर सम्मेलन और अंतर्राष्ट्रीय मंचों में सक्रिय भागीदारी।',
    link: '/About/Index-Menu-About/Global-relations/Multilateral Engagement'
  },
  {
    id: 'un-panel',
    titleEn: 'UN Panel of External Auditors',
    titleHi: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल',
    descEn: 'Conducting high-impact financial and compliance audits of United Nations bodies, WHO, WFP, and international organizations.',
    descHi: 'संयुक्त राष्ट्र निकायों, डब्ल्यूएचओ, डब्ल्यूएफपी और अंतर्राष्ट्रीय संगठनों के उच्च-प्रभाव वाले वित्तीय और अनुपालन ऑडिट का संचालन।',
    link: '/About/Index-Menu-About/Global-relations/UN Panel of External Auditors'
  }
];

export default function InternationalRelationsPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    dataManager.fetchPageData('page-international-relations', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      dataManager.fetchPageData('page-international-relations', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
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
  const pageTitle = pageData?.title || (isHindi ? 'अंतर्राष्ट्रीय संबंध' : 'International Relations');

  return (
    <AboutLayout title={pageTitle}>
      <div className="flex flex-col items-start w-full max-w-[978px]">
        {/* Main Title */}
        <h1 
          className="text-2xl font-bold mb-6 text-left self-start"
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '160%',
            color: '#751639'
          }}
        >
          {pageTitle}
        </h1>

        {/* Lead Narrative */}
        <div 
          className="flex flex-col gap-4 text-left w-full mb-8 text-[#2A2A2A]"
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '15px',
            lineHeight: '28px'
          }}
        >
          <p>
            {isHindi
              ? 'भारत के नियंत्रक और महालेखापरीक्षक वैश्विक सार्वजनिक लेखापरीक्षा मानकों के विकास में महत्वपूर्ण योगदान देते हुए अंतर्राष्ट्रीय लेखापरीक्षा संगठनों में एक सक्रिय और सम्मानित भूमिका निभाते हैं।'
              : 'The Comptroller and Auditor General of India plays an active, esteemed role in international audit organizations, contributing decisively to the development of supreme public sector auditing standards globally.'}
          </p>
          <p>
            {isHindi
              ? 'साई इंडिया सर्वोच्च लेखापरीक्षा संस्थानों के अंतर्राष्ट्रीय संगठन (INTOSAI) और एशियाई संगठन (ASOSAI) का एक प्रमुख स्तंभ है, जो वैश्विक स्तर पर पारदर्शिता, सत्यनिष्ठा और जवाबदेही को बढ़ावा देता है।'
              : 'SAI India is a key pillar of the International Organisation of Supreme Audit Institutions (INTOSAI) and the Asian Organisation of Supreme Audit Institutions (ASOSAI), championing transparency, integrity, and fiscal accountability across nations.'}
          </p>
        </div>

        {/* Dynamic Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {GLOBAL_RELATIONS_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className="flex flex-col justify-between p-6 bg-white border border-[#E0E0E0] rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-[#751639] group text-left"
            >
              <div>
                <h2 
                  className="font-bold text-lg text-[#751639] group-hover:text-[#8E1B45] mb-2 flex items-center justify-between"
                  style={{ fontFamily: 'Noto Sans, sans-serif' }}
                >
                  {isHindi ? card.titleHi : card.titleEn}
                  <svg className="w-5 h-5 text-[#751639] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h2>
                <p 
                  className="text-sm text-[#555555] leading-relaxed"
                  style={{ fontFamily: 'Noto Sans, sans-serif' }}
                >
                  {isHindi ? card.descHi : card.descEn}
                </p>
              </div>
              <span 
                className="text-xs font-semibold text-[#751639] mt-4 inline-block underline group-hover:text-[#000]"
                style={{ fontFamily: 'Noto Sans, sans-serif' }}
              >
                {isHindi ? 'विस्तार से पढ़ें →' : 'Read more →'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}

