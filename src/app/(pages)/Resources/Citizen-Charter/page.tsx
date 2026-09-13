'use client';

import React, { useState, useEffect } from 'react';
import ResourcesLayout from '../ResourcesLayout';
import { dataManager } from '@/lib/dataManager';

export default function CitizenCharterPage() {
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

  return (
    <ResourcesLayout
      categoryTitle="Resources"
      categoryTitleHi="संसाधन"
      pageTitle="Citizen Charter"
      pageTitleHi="नागरिक अधिकार पत्र (सिटिज़न चार्टर)"
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Hero Header Banner (972px × 142px) */}
        <div 
          className="relative w-full h-[142px] rounded-[8px] overflow-hidden flex items-center px-8 shadow-sm"
          style={{
            background: 'linear-gradient(108deg, #751639 0%, #8b1e46 55%, #59102b 100%)'
          }}
        >
          {/* Subtle Background Pattern Geometry */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="citizen-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#citizen-pattern)" />
            </svg>
          </div>

          <div 
            className="absolute -right-16 top-0 bottom-0 w-[300px] bg-white/10 skew-x-[-24deg] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h1 className="text-[24px] md:text-[28px] font-bold leading-[38px] text-[#FFFFFF] tracking-tight">
              {isHindi ? 'नागरिक अधिकार पत्र' : 'Citizen Charter'}
            </h1>
            <p className="text-[14px] font-medium text-white/80 mt-1">
              {isHindi ? 'सिटिज़न चार्टर - भारत के नियंत्रक एवं महालेखापरीक्षक' : 'Office of the Comptroller and Auditor General of India'}
            </p>
          </div>
        </div>

        {/* Subtitle / Department Address */}
        <div className="text-[14px] font-medium leading-[24px] text-[#751639]">
          {isHindi 
            ? 'भारत के नियंत्रक एवं महालेखापरीक्षक का कार्यालय 9, दीन दयाल उपाध्याय मार्ग, नई दिल्ली-110124'
            : 'Office of the Comptroller and Auditor General of India 9, Deen Dayal Upadhyaya Marg, New Delhi-110124'}
        </div>

        {/* 3 Vision, Mission & Core Values Cards (978px × 224px each) */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* 1. Vision Card */}
          <div className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-xs transition-shadow hover:shadow-sm">
            {/* 100px Circle Badge */}
            <div className="w-[100px] h-[100px] rounded-full border border-[#751639] bg-white flex items-center justify-center shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="14" stroke="#751639" strokeWidth="2.5" />
                <circle cx="24" cy="24" r="6" fill="#751639" />
                <path d="M24 4V10M24 38V44M4 24H10M38 24H44" stroke="#751639" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-[28px] font-normal leading-[36px] text-[#751639]">
                {isHindi ? 'हमारा दृष्टिकोण (Vision)' : 'Vision'}
              </h2>
              <p className="text-[16px] font-normal leading-[28px] text-[#2E2E31]">
                {isHindi 
                  ? '(हमारा दृष्टिकोण यह दर्शाता है कि हम क्या बनना चाहते हैं) सार्वजनिक संसाधनों पर स्वतंत्र और विश्वसनीय आश्वासन प्रदान करना जारी रखें और सार्वजनिक क्षेत्र की लेखापरीक्षा में एक वैश्विक नेता बनें।'
                  : '(Our vision represents what we aspire to become) Continue to provide independent and credible assurance on public resources and be a global leader in public sector auditing.'}
              </p>
            </div>
          </div>

          {/* 2. Mission Card */}
          <div className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-xs transition-shadow hover:shadow-sm">
            {/* 100px Circle Badge */}
            <div className="w-[100px] h-[100px] rounded-full border border-[#751639] bg-white flex items-center justify-center shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 36L24 12L36 36L24 30L12 36Z" stroke="#751639" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="24" cy="22" r="3" fill="#751639" />
              </svg>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-[28px] font-normal leading-[36px] text-[#751639]">
                {isHindi ? 'हमारा ध्येय (Mission)' : 'Mission'}
              </h2>
              <p className="text-[16px] font-normal leading-[28px] text-[#2E2E31]">
                {isHindi 
                  ? '(हमारा ध्येय हमारे मूल उद्देश्य का प्रतिनिधित्व करता है) भारत के संविधान द्वारा अनिवार्य, हम उच्च गुणवत्ता वाली लेखा परीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देते हैं और हमारे हितधारकों - विधायिका, कार्यपालिका और जनता को स्वतंत्र आश्वासन प्रदान करते हैं कि सार्वजनिक धन का कुशलतापूर्वक और इच्छित उद्देश्यों के लिए उपयोग किया जा रहा है।'
                  : '(Our mission represents our core purpose) Mandated by the Constitution of India, we promote accountability, transparency and good governance through high quality auditing and accounting and provide independent assurance to our stakeholders - the Legislature, the Executive and the Public - that public funds are being used efficiently and for the intended purposes.'}
              </p>
            </div>
          </div>

          {/* 3. Core Values Card */}
          <div className="w-full bg-[#FFFFFF] border border-[#D9D9D9] rounded-[16px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-xs transition-shadow hover:shadow-sm">
            {/* 100px Circle Badge */}
            <div className="w-[100px] h-[100px] rounded-full border border-[#751639] bg-white flex items-center justify-center shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="24,6 30,18 43,19 33,28 36,41 24,34 12,41 15,28 5,19 18,18" stroke="#751639" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            {/* Content */}
            <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-[28px] font-normal leading-[36px] text-[#751639]">
                {isHindi ? 'मूल मूल्य (Core Values)' : 'Core Values'}
              </h2>
              <p className="text-[16px] font-normal leading-[28px] text-[#2E2E31]">
                {isHindi 
                  ? 'हमारे मूल मूल्य वे मार्गदर्शक सिद्धांत हैं जो हमारी संगठनात्मक संस्कृति को परिभाषित करते हैं: व्यावसायिक उत्कृष्टता, निष्पक्षता एवं तटस्थता, पारदर्शिता, जवाबदेही और सत्यनिष्ठा।'
                  : 'Our core values are the guiding principles that define our institutional culture: Professional Excellence, Objectivity & Fairness, Transparency, Accountability, and Integrity.'}
              </p>
            </div>
          </div>

        </div>

        {/* Table Section: Table 2 from Figma */}
        <div className="w-full flex flex-col gap-3 mt-4">
          <h3 className="text-[14px] font-semibold leading-[20px] text-[#751639]">
            {isHindi 
              ? 'तालिका 2: सीएजी की वेबसाइट पर वार्षिक वित्त एवं विनियोग लेखों और सीएजी की लेखापरीक्षा रिपोर्टों का प्रकाशन' 
              : 'Table 2: Placing of the Annual Finance and Appropriation Accounts and the Audit Reports of the CAG on the website of the CAG'}
          </h3>

          <div className="w-full border border-[#DADADA] rounded-[8px] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#751639] text-[#FFFFFF] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">S.No</th>
                    <th className="py-3 px-4">Subject / Activity Description</th>
                    <th className="py-3 px-4">Standard Delivery Timeframe</th>
                    <th className="py-3 px-4">Responsible Wing / Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DADADA] bg-white text-[#2E2E31]">
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-[#751639]">1</td>
                    <td className="py-3 px-4 font-medium">
                      {isHindi 
                        ? 'संसद / राज्य विधानसभाओं में पेश किए जाने के बाद लेखापरीक्षा रिपोर्टों को वेबसाइट पर अपलोड करना' 
                        : 'Uploading of Audit Reports on the CAG website after tabling in Parliament / State Legislatures'}
                    </td>
                    <td className="py-3 px-4">
                      {isHindi ? 'संसद / विधानसभा में पेश किए जाने के 24 घंटे के भीतर' : 'Within 24 hours of tabling in Parliament/Legislature'}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-700">
                      Report Wing & IT Wing
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors bg-[#FAFAFA]">
                    <td className="py-3 px-4 text-center font-medium text-[#751639]">2</td>
                    <td className="py-3 px-4 font-medium">
                      {isHindi 
                        ? 'संघ एवं राज्य सरकारों के वित्त एवं विनियोग खातों को उपलब्ध कराना' 
                        : 'Availability of Annual Finance and Appropriation Accounts of Union and State Governments'}
                    </td>
                    <td className="py-3 px-4">
                      {isHindi ? 'संसद / विधानसभा द्वारा स्वीकार किए जाने के 48 घंटे के भीतर' : 'Within 48 hours of acceptance and presentation'}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-700">
                      GASAB & State Accounts Wing
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4 text-center font-medium text-[#751639]">3</td>
                    <td className="py-3 px-4 font-medium">
                      {isHindi 
                        ? 'नागरिकों और हितधारकों से आरटीआई आवेदनों और प्रतिक्रिया का निपटान' 
                        : 'Disposal of Right to Information (RTI) applications and public queries'}
                    </td>
                    <td className="py-3 px-4">
                      {isHindi ? 'प्राप्ति की तिथि से 30 दिनों के भीतर' : 'Within 30 days from date of receipt'}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-700">
                      Central Public Information Officer (CPIO)
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50 transition-colors bg-[#FAFAFA]">
                    <td className="py-3 px-4 text-center font-medium text-[#751639]">4</td>
                    <td className="py-3 px-4 font-medium">
                      {isHindi 
                        ? 'पेंशनभोगियों और जीपीएफ ग्राहकों की शिकायतों का निवारण' 
                        : 'Redressal of grievances of Pensioners and GPF subscribers in State A&E Offices'}
                    </td>
                    <td className="py-3 px-4">
                      {isHindi ? '15 कार्य दिवसों के भीतर' : 'Within 15 working days'}
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-700">
                      Accountants General (A&E)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </ResourcesLayout>
  );
}
