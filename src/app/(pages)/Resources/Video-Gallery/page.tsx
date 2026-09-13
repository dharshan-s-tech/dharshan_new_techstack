'use client';

import React, { useState, useEffect } from 'react';
import ResourcesLayout from '../ResourcesLayout';
import { dataManager } from '@/lib/dataManager';

interface VideoItem {
  id: string;
  titleEn: string;
  titleHi: string;
  duration: string;
  date: string;
  thumbnail: string;
  videoUrl?: string;
}

const VIDEO_GALLERY_DATA: VideoItem[] = [
  {
    id: 'vg-1',
    titleEn: 'Documentary on 160+ Years Journey of Indian Audit and Accounts Department (IAAD)',
    titleHi: 'भारतीय लेखापरीक्षा और लेखा विभाग (आईएएडी) की 160+ वर्षों की यात्रा पर वृत्तचित्र',
    duration: '18:45',
    date: '16 Nov 2023',
    thumbnail: '/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png'
  },
  {
    id: 'vg-2',
    titleEn: 'Digital Auditing Paradigm: Implementation of One IAAD One System (OIOS)',
    titleHi: 'डिजिटल लेखापरीक्षा प्रतिमान: वन आईएएडी वन सिस्टम (ओआईओएस) का कार्यान्वयन',
    duration: '12:20',
    date: '10 Feb 2024',
    thumbnail: '/assets/9e9d6d62858888b5ecf0a28f41e57c6b546d16f8.png'
  },
  {
    id: 'vg-3',
    titleEn: 'Environmental Auditing & Sustainable Development Goals - SAI India at INTOSAI WGEA',
    titleHi: 'पर्यावरण लेखापरीक्षा और सतत विकास लक्ष्य - इंटोसाई डब्ल्यूजीईए में साई भारत',
    duration: '15:10',
    date: '24 Apr 2024',
    thumbnail: '/assets/557f9ea1496a79ee82b683efb1c0eb7040fd8522.png'
  },
  {
    id: 'vg-4',
    titleEn: 'Public Financial Management & The Role of Supreme Audit Institutions',
    titleHi: 'सार्वजनिक वित्तीय प्रबंधन और सर्वोच्च लेखापरीक्षा संस्थानों की भूमिका',
    duration: '22:05',
    date: '15 Dec 2023',
    thumbnail: '/assets/c5aee22d7d8f5cb4eb5f78ee9d1a3c7ddac67cf6.png'
  }
];

export default function VideoGalleryPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <ResourcesLayout
      categoryTitle="Resources"
      categoryTitleHi="संसाधन"
      pageTitle="Video Gallery"
      pageTitleHi="वीडियो गैलरी"
    >
      <div className="w-full flex flex-col gap-6 font-['Noto_Sans',sans-serif]">
        
        {/* Hero Header Banner */}
        <div 
          className="relative w-full h-[142px] rounded-[8px] overflow-hidden flex items-center px-8 shadow-sm"
          style={{
            background: 'linear-gradient(108deg, #751639 0%, #8b1e46 55%, #59102b 100%)'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-[24px] md:text-[28px] font-bold leading-[38px] text-[#FFFFFF] tracking-tight">
              {isHindi ? 'वीडियो गैलरी' : 'Video Gallery'}
            </h1>
            <p className="text-[14px] font-medium text-white/80 mt-1">
              {isHindi ? 'सीएजी वृत्तचित्र, संगोष्ठी व्याख्यान एवं डिजिटल लेखापरीक्षा प्रस्तुतिकरण' : 'CAG Documentaries, Symposium Lectures & Digital Audit Presentations'}
            </p>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {VIDEO_GALLERY_DATA.map((item) => (
            <div 
              key={item.id}
              className="group bg-white border border-[#E6E6E6] rounded-[8px] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative w-full h-48 bg-zinc-900 overflow-hidden flex items-center justify-center">
                <img 
                  src={item.thumbnail} 
                  alt="" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute w-14 h-14 rounded-full bg-[#751639]/90 group-hover:bg-[#751639] group-hover:scale-110 text-white flex items-center justify-center transition-all shadow-lg">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {item.duration}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <h3 className="text-[14px] font-semibold text-[#2A2A2A] group-hover:text-[#751639] transition-colors line-clamp-2">
                  {isHindi ? item.titleHi : item.titleEn}
                </h3>
                <span className="text-[12px] text-zinc-500 font-medium">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ResourcesLayout>
  );
}
