'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import FormerCAGCards from '@/components/cards/FormerCAGCards';
import { dataManager } from '@/lib/dataManager';

export default function FormerCAGPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <AboutLayout title={isHindi ? 'पूर्व सीएजी गैलरी' : 'Former Comptroller and Auditors General'}>
      <div className="w-full flex flex-col items-start">
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
          {isHindi ? 'पूर्व नियंत्रक और महालेखापरीक्षक' : 'Former Comptroller and Auditors General'}
        </h1>
        <FormerCAGCards />
      </div>
    </AboutLayout>
  );
}
