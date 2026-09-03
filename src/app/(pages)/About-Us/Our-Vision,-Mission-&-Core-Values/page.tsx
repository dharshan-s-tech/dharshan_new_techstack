'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import { dataManager } from '@/lib/dataManager';

const LOCAL_DICTS = {
  English: {
    visionTitle: 'Vision',
    visionSub: '(Our vision represents what we aspire to become)',
    visionDesc: 'Continue to provide independent and credible assurance on public resources and be a global leader in public sector auditing.',
    visionSvgTitle: 'Vision Illustration',
    visionSvgDesc: 'A graphical compass needle indicating strategic direction and leadership.',
    
    missionTitle: 'Mission',
    missionSub: '(Our mission enunciates our current role and describes what we are doing today)',
    missionDesc: 'Mandated by the Constitution of India, we promote accountability, transparency and good governance through high quality auditing and accounting and provide independent and timely assurance to the Legislature, the Public and the Executive, that public funds are being collected and used effectively and efficiently.',
    missionSvgTitle: 'Mission Illustration',
    missionSvgDesc: 'A target dartboard showing an arrow hitting the center bullseye representing goals.',
    
    valuesTitle: 'Core Values',
    valuesSub: '(Our core values are the fundamental beliefs that guide our institution and our people)',
    valuesDescInst: 'Institutional Values:',
    valuesDescInstText: ' Maintaining professional standards, objective and balanced approach, independence and transparency.',
    valuesDescPeople: 'People Values:',
    valuesDescPeopleText: ' Ethical behaviour, integrity, professional competence, fairness and social awareness.',
    valuesSvgTitle: 'Core Values Illustration',
    valuesSvgDesc: 'A stylized hand cradling a multifaceted shining diamond representing integrity and standards.'
  },
  'हिन्दी': {
    visionTitle: 'दृष्टिकोण (Vision)',
    visionSub: '(हमारा दृष्टिकोण इस बात का प्रतिनिधित्व करता है कि हम क्या बनना चाहते हैं)',
    visionDesc: 'सार्वजनिक संसाधनों पर स्वतंत्र और विश्वसनीय आश्वासन प्रदान करना जारी रखना और सार्वजनिक क्षेत्र की लेखापरीक्षा में एक वैश्विक नेता बनना।',
    visionSvgTitle: 'दृष्टिकोण चित्रण',
    visionSvgDesc: 'रणनीतिक दिशा और नेतृत्व को दर्शाने वाली एक रेखाचित्र कम्पास सुई।',
    
    missionTitle: 'ध्येय (Mission)',
    missionSub: '(हमारा ध्येय हमारी वर्तमान भूमिका को व्यक्त करता है और बताता है कि हम आज क्या कर रहे हैं)',
    missionDesc: 'भारत के संविधान द्वारा अधिदेशित, हम उच्च गुणवत्ता वाले लेखा परीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देते हैं और विधायिका, जनता और कार्यपालिका को स्वतंत्र और समय पर आश्वासन प्रदान करते हैं कि सार्वजनिक धन प्रभावी ढंग से और कुशलता से एकत्र और उपयोग किया जा रहा है।',
    missionSvgTitle: 'ध्येय चित्रण',
    missionSvgDesc: 'लक्ष्यों का प्रतिनिधित्व करने वाले केंद्र को भेदने वाले तीर के साथ एक लक्ष्य बोर्ड।',
    
    valuesTitle: 'मूल मूल्य (Core Values)',
    valuesSub: '(हमारे मूल मूल्य वे मूलभूत विश्वास हैं जो हमारे संस्थान और हमारे लोगों का मार्गदर्शन करते हैं)',
    valuesDescInst: 'संस्थागत मूल्य:',
    valuesDescInstText: ' व्यावसायिक मानकों को बनाए रखना, निष्पक्ष और संतुलित दृष्टिकोण, स्वतंत्रता और पारदर्शिता।',
    valuesDescPeople: 'व्यक्तिगत मूल्य:',
    valuesDescPeopleText: ' नैतिक व्यवहार, सत्यनिष्ठा, व्यावसायिक क्षमता, निष्पक्षता और समाज जागरूकता।',
    valuesSvgTitle: 'मूल मूल्य चित्रण',
    valuesSvgDesc: 'सत्यनिष्ठा और मानकों का प्रतिनिधित्व करने वाले एक बहुआयामी चमकते हीरे को सहारा देता हाथ।'
  }
};

export default function VisionMissionPage() {
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
  const text = LOCAL_DICTS[lang] || LOCAL_DICTS.English;

  return (
    <AboutLayout title={isHindi ? 'हमारा दृष्टिकोण, ध्येय और मूल मूल्य' : 'Our Vision, Mission & Core Values'}>
      <div className="flex flex-col gap-6 w-full mt-2">
        
        {/* Vision Card */}
        <section 
          className="relative group flex flex-col md:flex-row gap-10 md:gap-16 p-6 items-center justify-between border bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.02)] border-[#D7D7D7] transition-all duration-300 hover:-translate-y-1 hover:border-[#E0EAFC] hover:shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden"
          aria-labelledby="vision-card-title"
        >
          {/* Smooth Gradient Overlay background */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(212.12deg, rgba(0, 64, 35, 0) 43.81%, rgba(0, 64, 35, 0.05) 101.12%)'
            }}
          />

          <div className="relative z-10 flex-grow flex flex-col gap-5 text-left md:max-w-[70%]">
            <div className="flex flex-row items-center gap-6">
              <h3 id="vision-card-title" className="text-xl md:text-2xl font-semibold m-0 transition-colors duration-300 text-zinc-800 group-hover:text-[#004023]" style={{ fontFamily: 'Noto Sans' }}>
                {text.visionTitle}
              </h3>
              <div style={{ width: '165px', height: '1px', backgroundColor: '#E3E3E3' }} className="transition-colors duration-300 group-hover:bg-[#004023]/25" aria-hidden="true" />
            </div>
            <p className="text-[11px] md:text-xs text-zinc-500 italic m-0 transition-colors duration-300 group-hover:text-zinc-600">
              {text.visionSub}
            </p>
            <p className="text-sm leading-relaxed m-0 transition-colors duration-300 text-zinc-600 group-hover:text-[#4B4B4B]" style={{ fontFamily: 'Noto Sans' }}>
              {text.visionDesc}
            </p>
          </div>
          
          <div className="relative z-10 w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center p-2">
            {/* Compass Accessible Inline SVG */}
            <svg 
              width="180" 
              height="180" 
              viewBox="0 0 180 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="vision-svg-title vision-svg-desc"
              className="text-[#E3E3E3] group-hover:text-[#004023] transition-colors duration-300"
            >
              <title id="vision-svg-title">{text.visionSvgTitle}</title>
              <desc id="vision-svg-desc">{text.visionSvgDesc}</desc>
              
              <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <circle cx="90" cy="90" r="12" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              {/* Dial ticks */}
              <line x1="90" y1="4" x2="90" y2="16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="transition-colors duration-300" />
              <line x1="90" y1="164" x2="90" y2="176" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="transition-colors duration-300" />
              <line x1="4" y1="90" x2="16" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="transition-colors duration-300" />
              <line x1="164" y1="90" x2="176" y2="90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="transition-colors duration-300" />
              {/* Needle rotated 45 deg */}
              <path 
                d="M90 28 L102 90 L90 152 L78 90 Z" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinejoin="round"
                transform="rotate(45 90 90)" 
                className="transition-colors duration-300"
              />
            </svg>
          </div>
        </section>

        {/* Mission Card */}
        <section 
          className="relative group flex flex-col md:flex-row gap-10 md:gap-16 p-6 items-center justify-between border bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.02)] border-[#D7D7D7] transition-all duration-300 hover:-translate-y-1 hover:border-[#E0EAFC] hover:shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden"
          aria-labelledby="mission-card-title"
        >
          {/* Smooth Gradient Overlay background */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(212.12deg, rgba(0, 64, 35, 0) 43.81%, rgba(0, 64, 35, 0.05) 101.12%)'
            }}
          />

          <div className="relative z-10 flex-grow flex flex-col gap-5 text-left md:max-w-[70%]">
            <div className="flex flex-row items-center gap-6">
              <h3 id="mission-card-title" className="text-xl md:text-2xl font-semibold m-0 transition-colors duration-300 text-zinc-800 group-hover:text-[#004023]" style={{ fontFamily: 'Noto Sans' }}>
                {text.missionTitle}
              </h3>
              <div style={{ width: '165px', height: '1px', backgroundColor: '#E3E3E3' }} className="transition-colors duration-300 group-hover:bg-[#004023]/25" aria-hidden="true" />
            </div>
            <p className="text-[11px] md:text-xs text-zinc-500 italic m-0 transition-colors duration-300 group-hover:text-zinc-600">
              {text.missionSub}
            </p>
            <p className="text-sm leading-relaxed m-0 transition-colors duration-300 text-zinc-600 group-hover:text-[#4B4B4B]" style={{ fontFamily: 'Noto Sans' }}>
              {text.missionDesc}
            </p>
          </div>
          
          <div className="relative z-10 w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center p-2">
            {/* Target Accessible Inline SVG */}
            <svg 
              width="180" 
              height="180" 
              viewBox="0 0 180 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="mission-svg-title mission-svg-desc"
              className="text-[#E3E3E3] group-hover:text-[#004023] transition-colors duration-300"
            >
              <title id="mission-svg-title">{text.missionSvgTitle}</title>
              <desc id="mission-svg-desc">{text.missionSvgDesc}</desc>
              
              <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <circle cx="90" cy="90" r="50" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <circle cx="90" cy="90" r="20" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              {/* Arrow hitting bullseye */}
              <line x1="145" y1="35" x2="104" y2="76" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="transition-colors duration-300" />
              <path d="M96 70 L96 84 L110 84" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-colors duration-300" />
              {/* Arrow Feathers */}
              <line x1="130" y1="40" x2="140" y2="30" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <line x1="136" y1="46" x2="146" y2="36" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <line x1="142" y1="52" x2="152" y2="42" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
            </svg>
          </div>
        </section>

        {/* Core Values Card */}
        <section 
          className="relative group flex flex-col md:flex-row gap-10 md:gap-16 p-6 items-center justify-between border bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.02)] border-[#D7D7D7] transition-all duration-300 hover:-translate-y-1 hover:border-[#E0EAFC] hover:shadow-[0px_0px_10px_10px_rgba(102,138,227,0.05)] overflow-hidden"
          aria-labelledby="values-card-title"
        >
          {/* Smooth Gradient Overlay background */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(212.12deg, rgba(0, 64, 35, 0) 43.81%, rgba(0, 64, 35, 0.05) 101.12%)'
            }}
          />

          <div className="relative z-10 flex-grow flex flex-col gap-5 text-left md:max-w-[70%]">
            <div className="flex flex-row items-center gap-6">
              <h3 id="values-card-title" className="text-xl md:text-2xl font-semibold m-0 transition-colors duration-300 text-zinc-800 group-hover:text-[#004023]" style={{ fontFamily: 'Noto Sans' }}>
                {text.valuesTitle}
              </h3>
              <div style={{ width: '165px', height: '1px', backgroundColor: '#E3E3E3' }} className="transition-colors duration-300 group-hover:bg-[#004023]/25" aria-hidden="true" />
            </div>
            <p className="text-[11px] md:text-xs text-zinc-500 italic m-0 transition-colors duration-300 group-hover:text-zinc-600">
              {text.valuesSub}
            </p>
            <div className="text-sm leading-relaxed m-0 space-y-3 transition-colors duration-300 text-zinc-600 group-hover:text-[#4B4B4B]" style={{ fontFamily: 'Noto Sans' }}>
              <p className="m-0">
                <strong className="text-zinc-800 transition-colors duration-300 group-hover:text-zinc-900">{text.valuesDescInst}</strong>
                {text.valuesDescInstText}
              </p>
              <p className="m-0">
                <strong className="text-zinc-800 transition-colors duration-300 group-hover:text-zinc-900">{text.valuesDescPeople}</strong>
                {text.valuesDescPeopleText}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center p-2">
            {/* Diamond/Hand Accessible Inline SVG */}
            <svg 
              width="180" 
              height="180" 
              viewBox="0 0 180 180" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="values-svg-title values-svg-desc"
              className="text-[#E3E3E3] group-hover:text-[#004023] transition-colors duration-300"
            >
              <title id="values-svg-title">{text.valuesSvgTitle}</title>
              <desc id="values-svg-desc">{text.valuesSvgDesc}</desc>
              
              {/* Diamond */}
              <path d="M60 55 L90 25 L120 55 L90 95 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" className="transition-colors duration-300" />
              <line x1="60" y1="55" x2="120" y2="55" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <line x1="90" y1="25" x2="90" y2="95" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <line x1="75" y1="40" x2="90" y2="95" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              <line x1="105" y1="40" x2="90" y2="95" stroke="currentColor" strokeWidth="4" className="transition-colors duration-300" />
              
              {/* Cradling Hand */}
              <path 
                d="M40 125 C55 125, 70 145, 95 145 C115 145, 135 130, 150 120 C155 116, 155 110, 148 106 C141 102, 135 106, 128 110 L105 125" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="transition-colors duration-300"
              />
              <path 
                d="M60 120 C68 108, 76 102, 84 106 C92 110, 88 118, 78 123" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                className="transition-colors duration-300"
              />
              {/* Sleeve/Wrist Cuff */}
              <path d="M25 110 L45 135 L30 145 L10 120 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" className="transition-colors duration-300" />
            </svg>
          </div>
        </section>

      </div>
    </AboutLayout>
  );
}
