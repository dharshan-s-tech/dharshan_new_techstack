'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';
import { Plus, Trash2, Camera } from 'lucide-react';

const DEFAULT_BIO_EN = [
  'Shri K. Sanjay Murthy was sworn in as the Comptroller and Auditor General of India on 21st November 2024 by the Hon’ble President of India and he assumed office on the same day.',
  'Before his appointment as CAG, Shri K. Sanjay Murthy, an IAS Officer of 1989 batch, served as the Secretary in the Department of Higher Education, Ministry of Education, a position he held from 1st October, 2021 to 20th November, 2024. In this role, he played a pivotal role in implementation of the transformational National Education Policy 2020.',
  'Previously, he held the position of Chief Executive Officer and Managing Director of the National Industrial Corridor Development Corporation Limited under the Ministry of Commerce and Industry. He also held senior positions as Additional Secretary and Joint Secretary in the Ministry of Housing and Urban Affairs and Ministry of Information and Broadcasting, overseeing development of urban transport and broadcast regulations and licensing. In the State Government, he worked as Secretary in the Education, Technical Education, Power and Transport sectors. During his service, he has also served in the National Institute of Smart Government (NISG), assisting State and Central Government Ministries/Departments with their e-governance adoption.',
  'Shri Murthy likes to read, listen to music, capturing moments through photography and spending time with nature in his spare time.'
];

const DEFAULT_BIO_HI = [
  'श्री के. संजय मूर्ति ने 21 नवंबर 2024 को भारत के माननीय राष्ट्रपति द्वारा भारत के नियंत्रक और महालेखापरीक्षक के रूप में शपथ ली और उसी दिन पदभार ग्रहण किया।',
  'सीएजी के रूप में अपनी नियुक्ति से पहले, 1989 बैच के आईएएस अधिकारी श्री के. संजय मूर्ति ने उच्च शिक्षा विभाग, शिक्षा मंत्रालय में सचिव के रूप में कार्य किया, यह पद उन्होंने 1 अक्टूबर, 2021 से 20 नवंबर, 2024 तक संभाला। इस भूमिका में, उन्होंने परिवर्तनकारी राष्ट्रीय शिक्षा नीति 2020 के कार्यान्वयन में महत्वपूर्ण भूमिका निभाई।',
  'इससे पहले, उन्होंने वाणिज्य और उद्योग मंत्रालय के तहत नेशनल इंडस्ट्रियल कॉरिडोर डेवलपमेंट कॉर्पोरेशन लिमिटेड के मुख्य कार्यकारी अधिकारी और प्रबंध निदेशक का पद संभाला था। उन्होंने आवास और शहरी मामलों के मंत्रालय तथा सूचना और प्रसारण मंत्रालय में अतिरिक्त सचिव और संयुक्त सचिव के रूप में वरिष्ठ पदों पर भी कार्य किया, शहरी परिवहन तथा प्रसारण नियमों एवं लाइसेंसिंग के विकास की देखरेख की। राज्य सरकार में, उन्होंने शिक्षा, तकनीकी शिक्षा, बिजली और परिवहन क्षेत्रों में सचिव के रूप में कार्य किया। अपनी सेवा के दौरान, उन्होंने नेशनल इंस्टीट्यूट फॉर स्मार्ट गवर्नमेंट (एनआईएसजी) में भी कार्य किया, राज्य और केंद्र सरकार के मंत्रालयों/विभागों को उनके ई-गवर्नेंस अपनाने में सहायता की।',
  'श्री मूर्ति अपने खाली समय में पढ़ना, संगीत सुनना, फोटोग्राफी के माध्यम से क्षणों को कैद करना और प्रकृति के साथ समय बिताना पसंद करते हैं।'
];

function cleanBioContent(html: string): string {
  if (!html) return '';
  return html
    .replace(/<div class="rightFunctionality"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="holderIndiaImg"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<h2[^>]*>.*?<\/h2>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '')
    .trim();
}

function CagOfIndiaContent() {
  const searchParams = useSearchParams();
  const isAdminEdit = searchParams.get('admin_edit') === 'true';
  const langParam = searchParams.get('lang');

  const [lang, setLang] = useState<'English' | 'हिन्दी'>(langParam === 'HI' ? 'हिन्दी' : 'English');
  const [pageData, setPageData] = useState<any>(null);

  // Local Editable States
  const [cagNameEn, setCagNameEn] = useState('Shri K Sanjay Murthy');
  const [cagNameHi, setCagNameHi] = useState('श्री के. संजय मूर्ति');
  const [cagDesigEn, setCagDesigEn] = useState('Comptroller and Auditor General of India');
  const [cagDesigHi, setCagDesigHi] = useState('भारत के नियंत्रक और महालेखापरीक्षक');
  const [cagPhoto, setCagPhoto] = useState('/assets/cag-desk-photo.png');
  const [bioParagraphsEn, setBioParagraphsEn] = useState<string[]>(DEFAULT_BIO_EN);
  const [bioParagraphsHi, setBioParagraphsHi] = useState<string[]>(DEFAULT_BIO_HI);

  // Synchronized Refs to ensure message handlers always have the latest edited values
  const stateRef = React.useRef({
    cagNameEn,
    cagNameHi,
    cagDesigEn,
    cagDesigHi,
    cagPhoto,
    bioParagraphsEn,
    bioParagraphsHi
  });

  useEffect(() => {
    stateRef.current = {
      cagNameEn,
      cagNameHi,
      cagDesigEn,
      cagDesigHi,
      cagPhoto,
      bioParagraphsEn,
      bioParagraphsHi
    };
  }, [cagNameEn, cagNameHi, cagDesigEn, cagDesigHi, cagPhoto, bioParagraphsEn, bioParagraphsHi]);

  useEffect(() => {
    let isMounted = true;
    const initialLang = langParam === 'HI' ? 'हिन्दी' : dataManager.getLanguage();
    setLang(initialLang);

    const parseBioParagraphs = (html: string): string[] => {
      if (!html || typeof html !== 'string') return [];
      const cleaned = html.trim();
      const matches = cleaned.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (matches && matches.length > 0) {
        return matches
          .map(m => m.replace(/<\/?p[^>]*>/gi, '').trim())
          .filter(p => p.length > 0 && !p.includes('rightFunctionality') && !p.includes('holderIndiaImg'));
      }
      if (!cleaned.startsWith('<')) {
        return cleaned.split('\n\n').map(p => p.trim()).filter(Boolean);
      }
      return [];
    };

    const fetchAll = async () => {
      const activeLang = dataManager.getLanguage();
      setLang(activeLang);

      // Fetch EN
      const resEn = await dataManager.fetchPageData('page-cag-of-india', 'en');
      if (isMounted && resEn) {
        setPageData(resEn);
        if (resEn.title) setCagNameEn(resEn.title);
        if (resEn.excerpt) setCagDesigEn(resEn.excerpt);
        if (resEn.upload_file) {
          const f = resEn.upload_file;
          setCagPhoto(f.startsWith('http') || f.startsWith('/') ? f : `/assets/${f}`);
        }
        const parasEn = parseBioParagraphs(resEn.content);
        if (parasEn.length > 0) setBioParagraphsEn(parasEn);
      }

      // Fetch HI
      const resHi = await dataManager.fetchPageData('page-cag-of-india', 'hi');
      if (isMounted && resHi) {
        if (resHi.title && resHi.title !== resEn?.title) setCagNameHi(resHi.title);
        if (resHi.excerpt) setCagDesigHi(resHi.excerpt);
        const parasHi = parseBioParagraphs(resHi.content);
        if (parasHi.length > 0) setBioParagraphsHi(parasHi);
      }
    };

    fetchAll();

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
    };

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('aboutDataChange', fetchAll);
    window.addEventListener('pageDataChange', fetchAll);

    // Cross-frame messaging for Admin Live Editor
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'SET_LANG') {
        const targetLang = e.data.lang === 'HI' ? 'हिन्दी' : 'English';
        dataManager.setLanguage(targetLang);
        setLang(targetLang);
      } else if (e.data.type === 'SET_PHOTO') {
        setCagPhoto(e.data.url);
      } else if (e.data.type === 'REQUEST_DATA') {
        const cur = stateRef.current;
        const bioHtmlEn = cur.bioParagraphsEn.map(p => `<p>${p}</p>`).join('');
        const bioHtmlHi = cur.bioParagraphsHi.map(p => `<p>${p}</p>`).join('');
        window.parent.postMessage({
          type: 'DATA_REPLY',
          payload: {
            title_en: cur.cagNameEn,
            title_hi: cur.cagNameHi,
            title: cur.cagNameEn,
            desc: cur.cagDesigEn,
            excerpt: cur.cagDesigEn,
            desc_hi: cur.cagDesigHi,
            excerpt_hi: cur.cagDesigHi,
            thumb_image: cur.cagPhoto,
            file_url: cur.cagPhoto,
            upload_file: cur.cagPhoto,
            content: bioHtmlEn,
            content_val: bioHtmlEn,
            content_hi: bioHtmlHi,
            content_hi_val: bioHtmlHi,
          }
        }, '*');
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      isMounted = false;
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('aboutDataChange', fetchAll);
      window.removeEventListener('pageDataChange', fetchAll);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';
  const pageTitle = pageData?.title || (isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'CAG of India');

  // Edit outline helper
  const editFieldClass = isAdminEdit
    ? 'hover:ring-2 hover:ring-[#751639] hover:ring-dashed focus:ring-2 focus:ring-[#751639] focus:outline-none transition-all rounded p-0.5 cursor-text'
    : '';

  return (
    <AboutLayout title={pageTitle}>
      <div className="w-full flex flex-col items-start">
        
        {/* Main Section Title matching Figma CSS */}
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

        {/* Profile Card Banner matching exact Figma specs */}
        <div 
          className="relative w-full max-w-[978px] h-[200px] bg-white rounded-lg border border-[#EAEAEA] shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden flex items-center px-6 gap-6 mb-8 shrink-0"
          style={{ fontFamily: 'Noto Sans, sans-serif' }}
          data-name="CAG Profile Card"
        >
          {/* Right Side Background Geometric Pattern (Group 1000005440 & Ellipse 775) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-0">
            <div 
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '398px',
                height: '379px',
                right: '-100px',
                top: '-50px',
                background: 'rgba(222, 222, 222, 0.7)',
                filter: 'blur(35px)',
                border: '1px solid rgba(215, 215, 215, 0.5)'
              }}
            />

            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ transform: 'skewX(-25deg)', transformOrigin: 'top left' }}
            >
              <div style={{ boxSizing: 'border-box', position: 'absolute', width: '220.84px', height: '300px', left: '674.09px', top: '-50px', background: '#D9D9D9', opacity: 0.2, border: '1px solid rgba(215, 215, 215, 0.5)' }} />
              <div style={{ boxSizing: 'border-box', position: 'absolute', width: '220.84px', height: '300px', left: '726.66px', top: '-50px', background: '#FFFFFF', opacity: 1.0, border: '1px solid rgba(215, 215, 215, 0.5)' }} />
              <div style={{ boxSizing: 'border-box', position: 'absolute', width: '220.84px', height: '300px', left: '779.24px', top: '-50px', background: '#D9D9D9', opacity: 0.4, border: '1px solid rgba(215, 215, 215, 0.5)' }} />
              <div style={{ boxSizing: 'border-box', position: 'absolute', width: '220.84px', height: '300px', left: '831.83px', top: '-50px', background: '#FFFFFF', opacity: 1.0, border: '1px solid rgba(215, 215, 215, 0.5)' }} />
              <div style={{ boxSizing: 'border-box', position: 'absolute', width: '220.84px', height: '300px', left: '884.41px', top: '-50px', background: '#D9D9D9', opacity: 0.6, border: '1px solid rgba(215, 215, 215, 0.5)' }} />
            </div>
          </div>

          {/* Left Photo Frame */}
          <div className="relative z-10 w-[210px] h-[150px] rounded-md overflow-hidden shrink-0 border border-[#EAEAEA] shadow-sm bg-gray-100 group">
            <img 
              src={cagPhoto} 
              alt={isHindi ? cagNameHi : cagNameEn}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/cag-desk-photo.png';
              }}
              className="w-full h-full object-cover"
            />
            {isAdminEdit && (
              <button
                type="button"
                onClick={() => {
                  const newUrl = prompt('Enter new photo URL or asset path:', cagPhoto);
                  if (newUrl) setCagPhoto(newUrl.trim());
                }}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>Change Photo</span>
              </button>
            )}
          </div>

          {/* Info Content */}
          <div className="relative z-10 flex flex-col justify-center gap-1 text-left flex-1">
            <h2 
              className={`text-[32px] font-bold leading-[40px] text-[#751639] ${editFieldClass}`}
              style={{ fontFamily: 'Noto Sans, sans-serif', color: '#751639' }}
              contentEditable={isAdminEdit}
              suppressContentEditableWarning
              onBlur={(e) => {
                const val = e.currentTarget.textContent || '';
                if (isHindi) setCagNameHi(val);
                else setCagNameEn(val);
              }}
            >
              {isHindi ? cagNameHi : cagNameEn}
            </h2>
            <p 
              className={`text-[16px] font-normal leading-[24px] text-[#333333] ${editFieldClass}`}
              style={{ fontFamily: 'Noto Sans, sans-serif', color: '#333333' }}
              contentEditable={isAdminEdit}
              suppressContentEditableWarning
              onBlur={(e) => {
                const val = e.currentTarget.textContent || '';
                if (isHindi) setCagDesigHi(val);
                else setCagDesigEn(val);
              }}
            >
              {isHindi ? cagDesigHi : cagDesigEn}
            </p>
          </div>
        </div>

        {/* Biography Paragraphs */}
        <div 
          className="cag-bio w-full max-w-[978px] text-left flex flex-col gap-5 text-[#2E2E31] text-[16px] leading-[24px]" 
          style={{ fontFamily: 'Noto Sans, sans-serif' }}
        >
          {(isHindi ? bioParagraphsHi : bioParagraphsEn).map((paragraph, pIdx) => (
            <div key={pIdx} className="relative group">
              <p
                className={`m-0 ${editFieldClass}`}
                contentEditable={isAdminEdit}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const val = e.currentTarget.textContent || '';
                  if (isHindi) {
                    const next = [...bioParagraphsHi];
                    next[pIdx] = val;
                    setBioParagraphsHi(next);
                  } else {
                    const next = [...bioParagraphsEn];
                    next[pIdx] = val;
                    setBioParagraphsEn(next);
                  }
                }}
              >
                {paragraph}
              </p>
              {isAdminEdit && (
                <button
                  type="button"
                  onClick={() => {
                    if (isHindi) setBioParagraphsHi(bioParagraphsHi.filter((_, i) => i !== pIdx));
                    else setBioParagraphsEn(bioParagraphsEn.filter((_, i) => i !== pIdx));
                  }}
                  className="absolute -right-7 top-0 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                  title="Remove paragraph"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {isAdminEdit && (
            <button
              type="button"
              onClick={() => {
                if (isHindi) setBioParagraphsHi([...bioParagraphsHi, 'नया जीवनी अनुच्छेद यहाँ दर्ज करें...']);
                else setBioParagraphsEn([...bioParagraphsEn, 'Enter new biography paragraph here...']);
              }}
              className="self-start mt-2 px-3 py-1.5 border border-dashed border-[#751639] text-[#751639] hover:bg-pink-50 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Biography Paragraph</span>
            </button>
          )}
        </div>
      </div>
    </AboutLayout>
  );
}

export default function CagOfIndiaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639]">Loading CAG of India Profile...</div>}>
      <CagOfIndiaContent />
    </Suspense>
  );
}
