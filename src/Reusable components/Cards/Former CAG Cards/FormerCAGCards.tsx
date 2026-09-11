'use client';

import React, { useState, useEffect } from 'react';
import { dataManager, FormerCAGItem } from '@/lib/dataManager';

export default function FormerCAGCards() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [list, setList] = useState<FormerCAGItem[]>([]);

  const loadData = async () => {
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);
    const culture = currentLang === 'हिन्दी' ? 'hi' : 'en';
    const remoteData = await dataManager.fetchFormerCags(culture);
    if (Array.isArray(remoteData) && remoteData.length > 0) {
      setList(remoteData);
    } else {
      setList(dataManager.getFormerCags());
    }
  };

  useEffect(() => {
    loadData();
    const handleLangChange = () => loadData();
    const handleCagsChange = () => loadData();

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('formerCagsChange', handleCagsChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('formerCagsChange', handleCagsChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[978px]" 
      data-name="Former Generals"
    >
      {list.map((cag, idx) => (
        <div 
          key={`${cag.id}-${idx}`} 
          className="w-full max-w-[310px] h-[404px] bg-white border border-[#EFEFEF] shadow-[0px_1px_14px_rgba(0,0,0,0.08)] rounded-lg p-[20px] flex flex-col justify-between items-center shrink-0 mx-auto" 
          data-name="Former CAG Card"
        >
          {/* Photo Frame 270px x 276px */}
          <div 
            className="w-full h-[276px] rounded-lg overflow-hidden bg-white border border-[#EAEAEA] relative flex items-center justify-center shrink-0" 
            data-name="Mask group"
          >
            {cag.image_url ? (
              <img 
                src={cag.image_url} 
                alt={cag.name} 
                className="w-full h-full object-cover object-top rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/former-cags/placeholder-avatar.svg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-white flex items-center justify-center rounded-lg">
                <img 
                  src="/assets/former-cags/placeholder-avatar.svg" 
                  alt={cag.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          
          {/* Bottom Info Banner 270px x 68px */}
          <div 
            className="w-full h-[68px] bg-[#EFEFEF] rounded-lg p-[12px] flex flex-col items-center justify-center gap-[4px] shrink-0" 
            data-name="Frame 1000005457"
          >
            <span 
              className="text-xs font-semibold text-black text-center block"
              style={{ fontFamily: 'Noto Sans, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: 600, color: '#000000' }}
            >
              {cag.name}
            </span>
            <span 
              className="text-[10px] font-normal text-center block"
              style={{ fontFamily: 'Noto Sans, sans-serif', fontSize: '10px', lineHeight: '18px', fontWeight: 400, color: '#696868' }}
            >
              {cag.tenure}
            </span>
          </div>

        </div>
      ))}
    </div>
  );
}


