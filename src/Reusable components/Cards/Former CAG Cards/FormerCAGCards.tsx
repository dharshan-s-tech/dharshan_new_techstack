'use client';

import React, { useState, useEffect } from 'react';
import { dataManager, FormerCAGItem } from '@/lib/dataManager';

export default function FormerCAGCards() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [list, setList] = useState<FormerCAGItem[]>([]);

  const loadData = () => {
    setList(dataManager.getFormerCags());
    setLang(dataManager.getLanguage());
  };

  useEffect(() => {
    loadData();
    const handleLangChange = () => setLang(dataManager.getLanguage());
    const handleCagsChange = () => loadData();

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('formerCagsChange', handleCagsChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('formerCagsChange', handleCagsChange);
    };
  }, []);

  return (
    <div className="former-generals-grid" data-name="Former Generals">
      {list.map((cag, idx) => (
        <div key={`${cag.id}-${idx}`} className="former-cag-card" data-name="Former CAG Card">
          <div className="former-cag-card__content" data-name="Frame 1000005458">
            <div className="former-cag-card__photo-placeholder overflow-hidden flex items-center justify-center bg-zinc-100" data-name="Mask group">
              {cag.image_url ? (
                <img src={cag.image_url} alt={cag.name} className="w-full h-full object-cover" />
              ) : (
                <svg 
                  className="w-16 h-16 text-zinc-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
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
