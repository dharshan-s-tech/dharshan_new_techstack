'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

const LOCAL_DICTS = {
  English: {
    pageTitle: 'Our Vision, Mission & Core Values',
    visionTitle: 'Vision',
    visionSub: '(Our vision represents what we aspire to become)',
    visionDesc: 'Continue to provide independent and credible assurance on public resources and be a global leader in public sector auditing.',
    
    missionTitle: 'Mission',
    missionSub: '(Our mission enunciates our current role and describes what we are doing today)',
    missionDesc: 'Mandated by the Constitution of India, we promote accountability, transparency and good governance through high quality auditing and accounting and provide independent and timely assurance to the Legislature, the Public and the Executive, that public funds are being collected and used effectively and efficiently.',
    
    valuesTitle: 'Core Values',
    valuesSub: '(Our core values are the fundamental beliefs that guide our institution and our people)',
    valuesDescInst: 'Institutional Values: ',
    valuesDescInstText: 'Maintaining professional standards, objective and balanced approach, independence and transparency.',
    valuesDescPeople: 'People Values: ',
    valuesDescPeopleText: 'Ethical behaviour, integrity, professional competence, fairness and social awareness.'
  },
  'हिन्दी': {
    pageTitle: 'हमारा दृष्टिकोण, ध्येय और मूल मूल्य',
    visionTitle: 'दृष्टिकोण (Vision)',
    visionSub: '(हमारा दृष्टिकोण इस बात का प्रतिनिधित्व करता है कि हम क्या बनना चाहते हैं)',
    visionDesc: 'सार्वजनिक संसाधनों पर स्वतंत्र और विश्वसनीय आश्वासन प्रदान करना जारी रखना और सार्वजनिक क्षेत्र की लेखापरीक्षा में एक वैश्विक नेता बनना।',
    
    missionTitle: 'ध्येय (Mission)',
    missionSub: '(हमारा ध्येय हमारी वर्तमान भूमिका को व्यक्त करता है और बताता है कि हम आज क्या कर रहे हैं)',
    missionDesc: 'भारत के संविधान द्वारा अधिदेशित, हम उच्च गुणवत्ता वाले लेखा परीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देते हैं और विधायिका, जनता और कार्यपालिका को स्वतंत्र और समय पर आश्वासन प्रदान करते हैं कि सार्वजनिक धन प्रभावी ढंग से और कुशलता से एकत्र और उपयोग किया जा रहा है।',
    
    valuesTitle: 'मूल मूल्य (Core Values)',
    valuesSub: '(हमारे मूल मूल्य वे मूलभूत विश्वास हैं जो हमारे संस्थान और हमारे लोगों का मार्गदर्शन करते हैं)',
    valuesDescInst: 'संस्थागत मूल्य: ',
    valuesDescInstText: 'व्यावसायिक मानकों को बनाए रखना, निष्पक्ष और संतुलित दृष्टिकोण, स्वतंत्रता और पारदर्शिता।',
    valuesDescPeople: 'व्यक्तिगत मूल्य: ',
    valuesDescPeopleText: 'नैतिक व्यवहार, सत्यनिष्ठा, व्यावसायिक क्षमता, निष्पक्षता और समाज जागरूकता।'
  }
};

function VisionMissionContent() {
  const searchParams = useSearchParams();
  const isAdminEdit = searchParams.get('admin_edit') === 'true';

  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [dataEn, setDataEn] = useState(LOCAL_DICTS.English);
  const [dataHi, setDataHi] = useState(LOCAL_DICTS['हिन्दी']);
  const [pageTitleEn, setPageTitleEn] = useState(LOCAL_DICTS.English.pageTitle);
  const [pageTitleHi, setPageTitleHi] = useState(LOCAL_DICTS['हिन्दी'].pageTitle);

  // Synchronized Ref for live message handling
  const stateRef = React.useRef({ pageTitleEn, pageTitleHi, dataEn, dataHi });
  useEffect(() => {
    stateRef.current = { pageTitleEn, pageTitleHi, dataEn, dataHi };
  }, [pageTitleEn, pageTitleHi, dataEn, dataHi]);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    const fetchAll = () => {
      // Fetch English Data
      dataManager.fetchPageData('page-our-vision-mission-values', 'en').then((res) => {
        if (isMounted && res) {
          if (res.title) setPageTitleEn(res.title);
          if (res.content && typeof res.content === 'string') {
            if (res.content.trim().startsWith('{')) {
              try {
                const parsed = JSON.parse(res.content);
                setDataEn(prev => ({ ...prev, ...parsed }));
              } catch (e) { }
            }
          }
        }
      });

      // Fetch Hindi Data
      dataManager.fetchPageData('page-our-vision-mission-values', 'hi').then((res) => {
        if (isMounted && res) {
          if (res.title) setPageTitleHi(res.title);
          if (res.content && typeof res.content === 'string') {
            if (res.content.trim().startsWith('{')) {
              try {
                const parsed = JSON.parse(res.content);
                setDataHi(prev => ({ ...prev, ...parsed }));
              } catch (e) { }
            }
          }
        }
      });
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
      } else if (e.data.type === 'REQUEST_DATA') {
        const cur = stateRef.current;
        const fullPayload = {
          title_en: cur.pageTitleEn,
          title_hi: cur.pageTitleHi,
          desc: cur.dataEn.visionDesc,
          content_val: JSON.stringify(cur.dataEn),
          content_hi_val: JSON.stringify(cur.dataHi)
        };
        window.parent.postMessage({
          type: 'DATA_REPLY',
          payload: fullPayload
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
  const current = isHindi ? dataHi : dataEn;
  const pageTitle = isHindi ? pageTitleHi : pageTitleEn;

  const updateCurrent = (fields: Partial<typeof LOCAL_DICTS.English>) => {
    if (isHindi) {
      setDataHi(prev => ({ ...prev, ...fields }));
    } else {
      setDataEn(prev => ({ ...prev, ...fields }));
    }
  };

  const editFieldClass = isAdminEdit
    ? 'hover:ring-2 hover:ring-[#751639] hover:ring-dashed focus:ring-2 focus:ring-[#751639] focus:outline-none transition-all rounded p-1 cursor-text'
    : '';

  return (
    <AboutLayout title={pageTitle}>
      <h1 
        className={`cag-heading-title ${editFieldClass}`}
        contentEditable={isAdminEdit}
        suppressContentEditableWarning
        onBlur={(e) => {
          const val = e.currentTarget.textContent || '';
          if (isHindi) setPageTitleHi(val);
          else setPageTitleEn(val);
        }}
      >
        {pageTitle}
      </h1>

      <div className="flex flex-col gap-6 w-full max-w-[978px]">
        {/* Vision Card */}
        <div className="w-full max-w-[978px] min-h-[224px] bg-white border border-[#D9D9D9] rounded-[16px] p-6 flex flex-col md:flex-row items-center gap-8 md:gap-[48px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="w-[100px] h-[100px] shrink-0">
            <img 
              src="/assets/vision-icon-circle.png" 
              alt="Vision Icon" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-3 max-w-[557px] text-left flex-1">
            <h2 
              className={`text-[28px] leading-[48px] font-normal text-[#751639] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
              contentEditable={isAdminEdit}
              suppressContentEditableWarning
              onBlur={(e) => updateCurrent({ visionTitle: e.currentTarget.textContent || '' })}
            >
              {current.visionTitle}
            </h2>
            <div className="flex flex-col gap-[8px] w-full">
              <p 
                className={`text-[16px] leading-[30px] text-[#2E2E31] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
                contentEditable={isAdminEdit}
                suppressContentEditableWarning
                onBlur={(e) => updateCurrent({ visionSub: e.currentTarget.textContent || '' })}
              >
                {current.visionSub}
              </p>
              <p 
                className={`text-[16px] leading-[30px] text-[#2E2E31] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
                contentEditable={isAdminEdit}
                suppressContentEditableWarning
                onBlur={(e) => updateCurrent({ visionDesc: e.currentTarget.textContent || '' })}
              >
                {current.visionDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className="w-full max-w-[978px] min-h-[224px] bg-white border border-[#D9D9D9] rounded-[16px] p-6 flex flex-col md:flex-row items-center gap-8 md:gap-[48px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="w-[100px] h-[100px] shrink-0">
            <img 
              src="/assets/mission-icon-circle.png" 
              alt="Mission Icon" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-3 max-w-[557px] text-left flex-1">
            <h2 
              className={`text-[28px] leading-[48px] font-normal text-[#751639] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
              contentEditable={isAdminEdit}
              suppressContentEditableWarning
              onBlur={(e) => updateCurrent({ missionTitle: e.currentTarget.textContent || '' })}
            >
              {current.missionTitle}
            </h2>
            <div className="flex flex-col gap-[8px] w-full">
              <p 
                className={`text-[16px] leading-[30px] text-[#2E2E31] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
                contentEditable={isAdminEdit}
                suppressContentEditableWarning
                onBlur={(e) => updateCurrent({ missionSub: e.currentTarget.textContent || '' })}
              >
                {current.missionSub}
              </p>
              <p 
                className={`text-[16px] leading-[30px] text-[#2E2E31] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
                contentEditable={isAdminEdit}
                suppressContentEditableWarning
                onBlur={(e) => updateCurrent({ missionDesc: e.currentTarget.textContent || '' })}
              >
                {current.missionDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Card */}
        <div className="w-full max-w-[978px] min-h-[224px] bg-white border border-[#D9D9D9] rounded-[16px] p-6 flex flex-col md:flex-row items-center gap-8 md:gap-[48px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="w-[100px] h-[100px] shrink-0">
            <img 
              src="/assets/values-icon-circle.png" 
              alt="Core Values Icon" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-3 max-w-[557px] text-left flex-1">
            <h2 
              className={`text-[28px] leading-[48px] font-normal text-[#751639] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
              contentEditable={isAdminEdit}
              suppressContentEditableWarning
              onBlur={(e) => updateCurrent({ valuesTitle: e.currentTarget.textContent || '' })}
            >
              {current.valuesTitle}
            </h2>
            <div className="flex flex-col gap-[8px] w-full">
              <p 
                className={`text-[16px] leading-[30px] text-[#2E2E31] font-['Noto_Sans',sans-serif] m-0 ${editFieldClass}`}
                contentEditable={isAdminEdit}
                suppressContentEditableWarning
                onBlur={(e) => updateCurrent({ valuesSub: e.currentTarget.textContent || '' })}
              >
                {current.valuesSub}
              </p>
              <div className="text-[16px] leading-[30px] text-[#2E2E31] font-['Noto_Sans',sans-serif] m-0 space-y-1">
                <p className="m-0">
                  <strong>{current.valuesDescInst}</strong>
                  <span
                    className={editFieldClass}
                    contentEditable={isAdminEdit}
                    suppressContentEditableWarning
                    onBlur={(e) => updateCurrent({ valuesDescInstText: e.currentTarget.textContent || '' })}
                  >
                    {current.valuesDescInstText}
                  </span>
                </p>
                <p className="m-0">
                  <strong>{current.valuesDescPeople}</strong>
                  <span
                    className={editFieldClass}
                    contentEditable={isAdminEdit}
                    suppressContentEditableWarning
                    onBlur={(e) => updateCurrent({ valuesDescPeopleText: e.currentTarget.textContent || '' })}
                  >
                    {current.valuesDescPeopleText}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AboutLayout>
  );
}

export default function VisionMissionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639]">Loading Vision & Mission...</div>}>
      <VisionMissionContent />
    </Suspense>
  );
}

