'use client';

import React, { useState, useEffect } from 'react';
import ResourcesLayout from '../ResourcesLayout';
import { dataManager } from '@/lib/dataManager';
import { api } from '@/lib/api';

interface GalleryImage {
  id: string;
  titleEn: string;
  titleHi: string;
  categoryEn: string;
  categoryHi: string;
  date: string;
  imageUrl: string;
}

const PHOTO_GALLERY_DATA: GalleryImage[] = [
  {
    id: 'pg-1',
    titleEn: 'CAG of India holding bilateral discussions with INTOSAI leadership delegation at New Delhi Headquarters',
    titleHi: 'नई दिल्ली मुख्यालय में इंटोसाई नेतृत्व प्रतिनिधिमंडल के साथ द्विपक्षीय चर्चा करते भारत के सीएजी',
    categoryEn: 'International Engagements',
    categoryHi: 'अंतर्राष्ट्रीय सहभागिता',
    date: '12 May 2024',
    imageUrl: '/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png'
  },
  {
    id: 'pg-2',
    titleEn: 'National Audit Day Commemoration Ceremony at the Comptroller & Auditor General Auditorium',
    titleHi: 'नियंत्रक एवं महालेखापरीक्षक सभागार में राष्ट्रीय लेखापरीक्षा दिवस समारोह',
    categoryEn: 'Institutional Events',
    categoryHi: 'संस्थागत कार्यक्रम',
    date: '16 Nov 2023',
    imageUrl: '/assets/9e9d6d62858888b5ecf0a28f41e57c6b546d16f8.png'
  },
  {
    id: 'pg-3',
    titleEn: 'Convocation of Indian Audit and Accounts Service (IA&AS) Officer Trainees at NAAA Shimla',
    titleHi: 'एनएएए शिमला में भारतीय लेखापरीक्षा और लेखा सेवा (आईएएंडएएस) अधिकारी प्रशिक्षुओं का दीक्षांत समारोह',
    categoryEn: 'Training & Academics',
    categoryHi: 'प्रशिक्षण एवं शिक्षा',
    date: '08 Mar 2024',
    imageUrl: '/assets/557f9ea1496a79ee82b683efb1c0eb7040fd8522.png'
  },
  {
    id: 'pg-4',
    titleEn: 'Global Symposium on Data Analytics and Artificial Intelligence in Public Sector Auditing',
    titleHi: 'सार्वजनिक क्षेत्र लेखापरीक्षा में डेटा एनालिटिक्स और आर्टिफिशियल इंटेलिजेंस पर वैश्विक संगोष्ठी',
    categoryEn: 'Conferences & Seminars',
    categoryHi: 'सम्मेलन एवं सेमिनार',
    date: '20 Jan 2024',
    imageUrl: '/assets/c5aee22d7d8f5cb4eb5f78ee9d1a3c7ddac67cf6.png'
  }
];

export default function PhotoGalleryPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [items, setItems] = useState<GalleryImage[]>(PHOTO_GALLERY_DATA);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.getResources('photo-gallery', { page_size: 20 })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items && res.items.length > 0) {
          const mapped: GalleryImage[] = res.items.map((it: any, idx: number) => ({
            id: String(it.id || idx),
            titleEn: it.title || it.titleEn || 'Photo Event',
            titleHi: it.titleHi || it.title || 'फोटो कार्यक्रम',
            categoryEn: it.category || 'Photo Gallery',
            categoryHi: 'फोटो गैलरी',
            date: it.date || it.year || '2024',
            imageUrl: it.imageUrl || it.fileUrl || '/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png'
          }));
          setItems(mapped);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <ResourcesLayout
      categoryTitle="Resources"
      categoryTitleHi="संसाधन"
      pageTitle="Photo Gallery"
      pageTitleHi="फोटो गैलरी"
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
              {isHindi ? 'फोटो गैलरी' : 'Photo Gallery'}
            </h1>
            <p className="text-[14px] font-medium text-white/80 mt-1">
              {isHindi ? 'सीएजी संस्थागत कार्यक्रम, राष्ट्रीय सम्मेलन और वैश्विक सहभागिता' : 'CAG Institutional Events, National Conferences & Global Engagements'}
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="w-full py-8 flex items-center justify-center gap-3 text-[#751639]">
            <div className="w-5 h-5 border-2 border-[#751639] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading photos...</span>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer bg-white border border-[#E6E6E6] rounded-[8px] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative w-full h-48 bg-zinc-100 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={isHindi ? item.titleHi : item.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/61f2249e917d5c5faeb50b4ec748367aa419f85c.png';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#751639]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-[4px] backdrop-blur-xs">
                  {isHindi ? item.categoryHi : item.categoryEn}
                </div>
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

        {/* Modal for viewing photo full-screen */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[60vh] bg-black flex items-center justify-center">
                <img 
                  src={selectedImage.imageUrl} 
                  alt="" 
                  className="max-h-[60vh] w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                >
                  ✕
                </button>
              </div>
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs font-bold text-[#751639]">
                  {isHindi ? selectedImage.categoryHi : selectedImage.categoryEn} • {selectedImage.date}
                </span>
                <h2 className="text-base font-semibold text-zinc-900">
                  {isHindi ? selectedImage.titleHi : selectedImage.titleEn}
                </h2>
              </div>
            </div>
          </div>
        )}

      </div>
    </ResourcesLayout>
  );
}
