'use client';

import React, { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';

export interface FormerCAG {
  id: string;
  name: string;
  tenure: string;
}

export default function FormerCAGCards() {
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

  const legacyListEnglish: FormerCAG[] = [
    { id: 'fc-1', name: 'Girish Chandra Murmu', tenure: '(2020-2024)' },
    { id: 'fc-2', name: 'Rajiv Mehrishi', tenure: '(2017-2020)' },
    { id: 'fc-3', name: 'Shashi Kant Sharma', tenure: '(2013-2017)' },
    { id: 'fc-4', name: 'Rajiv Mehrishi', tenure: '(2017-2020)' },
    { id: 'fc-5', name: 'Shashi Kant Sharma', tenure: '(2013-2017)' },
    { id: 'fc-6', name: 'Girish Chandra Murmu', tenure: '(2020-2024)' },
    { id: 'fc-7', name: 'Shashi Kant Sharma', tenure: '(2013-2017)' },
    { id: 'fc-8', name: 'Girish Chandra Murmu', tenure: '(2020-2024)' },
    { id: 'fc-9', name: 'Rajiv Mehrishi', tenure: '(2017-2020)' }
  ];

  const legacyListHindi: FormerCAG[] = [
    { id: 'fc-1', name: 'गिरीश चंद्र मुर्मू', tenure: '(2020-2024)' },
    { id: 'fc-2', name: 'राजीव महर्षि', tenure: '(2017-2020)' },
    { id: 'fc-3', name: 'शशिकांत शर्मा', tenure: '(2013-2017)' },
    { id: 'fc-4', name: 'राजीव महर्षि', tenure: '(2017-2020)' },
    { id: 'fc-5', name: 'शशिकांत शर्मा', tenure: '(2013-2017)' },
    { id: 'fc-6', name: 'गिरीश चंद्र मुर्मू', tenure: '(2020-2024)' },
    { id: 'fc-7', name: 'शशिकांत शर्मा', tenure: '(2013-2017)' },
    { id: 'fc-8', name: 'गिरीश चंद्र मुर्मू', tenure: '(2020-2024)' },
    { id: 'fc-9', name: 'राजीव महर्षि', tenure: '(2017-2020)' }
  ];

  const legacyList = isHindi ? legacyListHindi : legacyListEnglish;

  return (
    <div className="former-generals-grid" data-name="Former Generals">
      {legacyList.map((cag, idx) => (
        <div key={`${cag.id}-${idx}`} className="former-cag-card" data-name="Former CAG Card">
          <div className="former-cag-card__content" data-name="Frame 1000005458">
            <div className="former-cag-card__photo-placeholder" data-name="Mask group" aria-label="Photo placeholder">
              <svg 
                className="w-16 h-16 text-zinc-300" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            
            <div className="former-cag-card__footer" data-name="Frame 1000005457">
              <div className="former-cag-card__text-wrapper" data-name="Frame 1000005456">
                <span className="former-cag-card__name">{cag.name}</span>
                <span className="former-cag-card__tenure">{cag.tenure}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
