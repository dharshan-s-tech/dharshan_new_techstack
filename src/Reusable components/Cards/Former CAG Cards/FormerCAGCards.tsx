'use client';

import React, { useState, useEffect } from 'react';
import { dataManager, FormerCAGItem } from '@/lib/dataManager';

export default function FormerCAGCards() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [list, setList] = useState<FormerCAGItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const resolveImageUrl = (img?: string, idx: number = 0): string => {
    if (!img) return `/assets/former-cags/fc-${(idx % 29) + 1}.png`;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/assets/')) return img;
    if (img.startsWith('/uploads/')) return `https://d7i5wg8xwe4hf.cloudfront.net${img}`;
    if (img.startsWith('uploads/')) return `https://d7i5wg8xwe4hf.cloudfront.net/${img}`;
    return `https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/${img}`;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const currentLang = dataManager.getLanguage();
      setLang(currentLang);
      const culture = currentLang === 'हिन्दी' ? 'hi' : 'en';
      const remoteData = await dataManager.fetchFormerCags(culture);
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        setList(remoteData);
      } else {
        setList(dataManager.getFormerCags());
      }
    } catch (e) {
      console.warn('Failed to load remote former CAGs:', e);
      setList(dataManager.getFormerCags());
    } finally {
      setLoading(false);
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

  if (loading && list.length === 0) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[978px]"
        data-name="Former Generals Skeleton"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={`skel-${i}`} 
            className="w-full max-w-[310px] h-[404px] bg-white border border-[#EFEFEF] shadow-[0px_1px_14px_rgba(0,0,0,0.08)] rounded-lg p-[20px] flex flex-col justify-between items-center shrink-0 mx-auto animate-pulse"
          >
            <div className="w-full h-[276px] rounded-lg bg-gray-200" />
            <div className="w-full h-[68px] bg-[#EFEFEF] rounded-lg p-[12px] flex flex-col items-center justify-center gap-2">
              <div className="w-3/4 h-3 bg-gray-300 rounded" />
              <div className="w-1/2 h-2 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[978px]" 
      data-name="Former Generals"
    >
      {list.map((cag, idx) => {
        const primaryImg = resolveImageUrl(cag.image_url, idx);
        const localFallback = `/assets/former-cags/fc-${(idx % 29) + 1}.png`;

        return (
          <div 
            key={`${cag.id}-${idx}`} 
            className="w-full max-w-[310px] h-[404px] bg-white border border-[#EFEFEF] shadow-[0px_1px_14px_rgba(0,0,0,0.08)] rounded-lg p-[20px] flex flex-col justify-between items-center shrink-0 mx-auto transition-all duration-200 hover:shadow-md" 
            data-name="Former CAG Card"
          >
            {/* Photo Frame 270px x 276px */}
            <div 
              className="w-full h-[276px] rounded-lg overflow-hidden bg-[#F8F9FA] border border-[#EAEAEA] relative flex items-center justify-center shrink-0" 
              data-name="Mask group"
            >
              <img 
                src={primaryImg} 
                alt={cag.name} 
                className="w-full h-full object-cover object-top rounded-lg"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== localFallback && !target.src.endsWith(localFallback)) {
                    target.src = localFallback;
                  } else if (target.src !== '/assets/former-cags/placeholder-avatar.svg') {
                    target.src = '/assets/former-cags/placeholder-avatar.svg';
                  }
                }}
              />
            </div>
            
            {/* Bottom Info Banner 270px x 68px */}
            <div 
              className="w-full h-[68px] bg-[#EFEFEF] rounded-lg p-[12px] flex flex-col items-center justify-center gap-[4px] shrink-0" 
              data-name="Frame 1000005457"
            >
              <span 
                className="text-xs font-semibold text-black text-center block line-clamp-1"
                style={{ fontFamily: 'Noto Sans, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: 600, color: '#000000' }}
                title={cag.name}
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
        );
      })}
    </div>
  );
}


