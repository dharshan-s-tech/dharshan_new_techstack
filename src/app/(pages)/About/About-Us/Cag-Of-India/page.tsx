'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

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

export default function CagOfIndiaPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    dataManager.fetchPageData('page-cag-of-india', currentLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
      if (isMounted && res) setPageData(res);
    });

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
      dataManager.fetchPageData('page-cag-of-india', newLang === 'हिन्दी' ? 'hi' : 'en').then((res) => {
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
  const pageTitle = pageData?.title || (isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'CAG of India');

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
            {/* Ellipse 775 Blur Glow */}
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

            {/* Group 1000005440: Slanted Parallel Rectangles matching Figma CSS */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ transform: 'skewX(-25deg)', transformOrigin: 'top left' }}
            >
              {/* Rectangle 34625704 */}
              <div 
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '220.84px',
                  height: '300px',
                  left: '674.09px',
                  top: '-50px',
                  background: '#D9D9D9',
                  opacity: 0.2,
                  border: '1px solid rgba(215, 215, 215, 0.5)'
                }}
              />
              {/* Rectangle 34625703 */}
              <div 
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '220.84px',
                  height: '300px',
                  left: '726.66px',
                  top: '-50px',
                  background: '#FFFFFF',
                  opacity: 1.0,
                  border: '1px solid rgba(215, 215, 215, 0.5)'
                }}
              />
              {/* Rectangle 34625702 */}
              <div 
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '220.84px',
                  height: '300px',
                  left: '779.24px',
                  top: '-50px',
                  background: '#D9D9D9',
                  opacity: 0.4,
                  border: '1px solid rgba(215, 215, 215, 0.5)'
                }}
              />
              {/* Rectangle 34625701 */}
              <div 
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '220.84px',
                  height: '300px',
                  left: '831.83px',
                  top: '-50px',
                  background: '#FFFFFF',
                  opacity: 1.0,
                  border: '1px solid rgba(215, 215, 215, 0.5)'
                }}
              />
              {/* Rectangle 34625700 */}
              <div 
                style={{
                  boxSizing: 'border-box',
                  position: 'absolute',
                  width: '220.84px',
                  height: '300px',
                  left: '884.41px',
                  top: '-50px',
                  background: '#D9D9D9',
                  opacity: 0.6,
                  border: '1px solid rgba(215, 215, 215, 0.5)'
                }}
              />
            </div>
          </div>

          {/* Left Photo Frame */}
          <div className="relative z-10 w-[210px] h-[150px] rounded-md overflow-hidden shrink-0 border border-[#EAEAEA] shadow-sm">
            <img 
              src={pageData?.upload_file_url || (pageData?.upload_file ? (pageData.upload_file.startsWith('http') ? pageData.upload_file : `/uploads/cms_pages_files/${pageData.upload_file}`) : "/assets/cag-desk-photo.png")} 
              alt={pageData?.title || (isHindi ? "श्री के संजय मूर्ति, भारत के नियंत्रक और महालेखापरीक्षक" : "Shri K. Sanjay Murthy, Comptroller and Auditor General of India")} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info Content */}
          <div className="relative z-10 flex flex-col justify-center gap-1 text-left">
            <h2 
              className="text-[32px] font-bold leading-[40px] text-[#751639]"
              style={{ fontFamily: 'Noto Sans, sans-serif', color: '#751639' }}
            >
              {pageData?.title || (isHindi ? 'श्री के संजय मूर्ति' : 'Shri K Sanjay Murthy')}
            </h2>
            <p 
              className="text-[16px] font-normal leading-[24px] text-[#333333]"
              style={{ fontFamily: 'Noto Sans, sans-serif', color: '#333333' }}
            >
              {pageData?.excerpt || (isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'Comptroller and Auditor General of India')}
            </p>
          </div>
        </div>

        {/* Biography Paragraphs */}
        {pageData?.content && cleanBioContent(pageData.content).length > 30 ? (
          <div 
            className="cag-bio w-full max-w-[978px] text-left flex flex-col gap-5 text-[#2E2E31] text-[16px] leading-[24px]" 
            style={{ fontFamily: 'Noto Sans, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: cleanBioContent(pageData.content) }}
          />
        ) : (
          <div 
            className="cag-bio w-full max-w-[978px] text-left flex flex-col gap-5 text-[#2E2E31] text-[16px] leading-[24px]" 
            style={{ fontFamily: 'Noto Sans, sans-serif' }}
          >
            {isHindi ? (
              <>
                <p><strong>श्री के. संजय मूर्ति</strong> ने 21 नवंबर 2024 को भारत के माननीय राष्ट्रपति द्वारा भारत के नियंत्रक और महालेखापरीक्षक के रूप में शपथ ली और उसी दिन पदभार ग्रहण किया।</p>
                <p>सीएजी के रूप में अपनी नियुक्ति से पहले, 1989 बैच के आईएएस अधिकारी श्री के. संजय मूर्ति ने उच्च शिक्षा विभाग, शिक्षा मंत्रालय में सचिव के रूप में कार्य किया, यह पद उन्होंने 1 अक्टूबर, 2021 से 20 नवंबर, 2024 तक संभाला। इस भूमिका में, उन्होंने परिवर्तनकारी राष्ट्रीय शिक्षा नीति 2020 के कार्यान्वयन में महत्वपूर्ण भूमिका निभाई।</p>
                <p>इससे पहले, उन्होंने वाणिज्य और उद्योग मंत्रालय के तहत नेशनल इंडस्ट्रियल कॉरिडोर डेवलपमेंट कॉर्पोरेशन लिमिटेड के मुख्य कार्यकारी अधिकारी और प्रबंध निदेशक का पद संभाला था। उन्होंने आवास और शहरी मामलों के मंत्रालय तथा सूचना और प्रसारण मंत्रालय में अतिरिक्त सचिव और संयुक्त सचिव के रूप में वरिष्ठ पदों पर भी कार्य किया, शहरी परिवहन तथा प्रसारण नियमों एवं लाइसेंसिंग के विकास की देखरेख की। राज्य सरकार में, उन्होंने शिक्षा, तकनीकी शिक्षा, बिजली और परिवहन क्षेत्रों में सचिव के रूप में कार्य किया। अपनी सेवा के दौरान, उन्होंने नेशनल इंस्टीट्यूट फॉर स्मार्ट गवर्नमेंट (एनआईएसजी) में भी कार्य किया, राज्य और केंद्र सरकार के मंत्रालयों/विभागों को उनके ई-गवर्नेंस अपनाने में सहायता की।</p>
                <p>श्री मूर्ति अपने खाली समय में पढ़ना, संगीत सुनना, फोटोग्राफी के माध्यम से क्षणों को कैद करना और प्रकृति के साथ समय बिताना पसंद करते हैं।</p>
              </>
            ) : (
              <>
                <p><strong>Shri K. Sanjay Murthy</strong> was sworn in as the Comptroller and Auditor General of India on 21st November 2024 by the Hon’ble President of India and he assumed office on the same day.</p>
                <p>Before his appointment as CAG, Shri K. Sanjay Murthy, an IAS Officer of 1989 batch, served as the Secretary in the Department of Higher Education, Ministry of Education, a position he held from 1st October, 2021 to 20th November, 2024. In this role, he played a pivotal role in implementation of the transformational National Education Policy 2020.</p>
                <p>Previously, he held the position of Chief Executive Officer and Managing Director of the National Industrial Corridor Development Corporation Limited under the Ministry of Commerce and Industry. He also held senior positions as Additional Secretary and Joint Secretary in the Ministry of Housing and Urban Affairs and Ministry of Information and Broadcasting, overseeing development of urban transport and broadcast regulations and licensing. In the State Government, he worked as Secretary in the Education, Technical Education, Power and Transport sectors. During his service, he has also served in the National Institute of Smart Government (NISG), assisting State and Central Government Ministries/Departments with their e-governance adoption.</p>
                <p>Shri Murthy likes to read, listen to music, capturing moments through photography and spending time with nature in his spare time.</p>
              </>
            )}
          </div>
        )}
      </div>
    </AboutLayout>
  );
}
