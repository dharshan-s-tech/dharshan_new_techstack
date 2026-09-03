'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

interface MemberItem {
  id: string;
  nameEn: string;
  nameHi: string;
  desigEn: string;
  desigHi: string;
}

interface BoardSection {
  id: string;
  titleEn: string;
  titleHi: string;
  members: MemberItem[];
}

const BOARD_SECTIONS: BoardSection[] = [
  {
    id: 'chairman',
    titleEn: 'Chairman',
    titleHi: 'अध्यक्ष',
    members: [
      {
        id: 'c-1',
        nameEn: 'Shri K. Sanjay Murthy',
        nameHi: 'श्री के. संजय मूर्ति',
        desigEn: 'Comptroller and Auditor General of India',
        desigHi: 'भारत के नियंत्रक और महालेखापरीक्षक'
      }
    ]
  },
  {
    id: 'external',
    titleEn: 'External Members',
    titleHi: 'बाहरी सदस्य',
    members: [
      {
        id: 'ex-1',
        nameEn: 'Shri Ashok Gulati',
        nameHi: 'श्री अशोक गुलाटी',
        desigEn: 'Agricultural Economist',
        desigHi: 'कृषि अर्थशास्त्री'
      },
      {
        id: 'ex-2',
        nameEn: 'Shri Manish Sabharwal',
        nameHi: 'श्री मनीष सबरवाल',
        desigEn: 'Chairman, Team Lease Service',
        desigHi: 'अध्यक्ष, टीमलीज सर्विसेज'
      },
      {
        id: 'ex-3',
        nameEn: 'Dr. Rajeev Lochan Bishnoi',
        nameHi: 'डॉ. राजीव लोचन बिश्नोई',
        desigEn: 'Credit and Financial Specialist',
        desigHi: 'क्रेडिट और वित्तीय विशेषज्ञ'
      },
      {
        id: 'ex-4',
        nameEn: 'Shri S. M. Vijayanand',
        nameHi: 'श्री एस. एम. विजयानंद',
        desigEn: 'Retired IAS Officer',
        desigHi: 'सेवानिवृत्त आईएएस अधिकारी'
      }
    ]
  },
  {
    id: 'internal',
    titleEn: 'Internal Members (Ex. Officio)',
    titleHi: 'आंतरिक सदस्य (पदेन)',
    members: [
      {
        id: 'in-1',
        nameEn: 'Shri Ashok Gulati',
        nameHi: 'श्री अशोक गुलाटी',
        desigEn: 'Agricultural Economist',
        desigHi: 'कृषि अर्थशास्त्री'
      },
      {
        id: 'in-2',
        nameEn: 'Shri Manish Sabharwal',
        nameHi: 'श्री मनीष सबरवाल',
        desigEn: 'Chairman, Team Lease Service',
        desigHi: 'अध्यक्ष, टीमलीज सर्विसेज'
      },
      {
        id: 'in-3',
        nameEn: 'Dr. Rajeev Lochan Bishnoi',
        nameHi: 'डॉ. राजीव लोचन बिश्नोई',
        desigEn: 'Credit and Financial Specialist',
        desigHi: 'क्रेडिट और वित्तीय विशेषज्ञ'
      },
      {
        id: 'in-4',
        nameEn: 'Shri S. M. Vijayanand',
        nameHi: 'श्री एस. एम. विजयानंद',
        desigEn: 'Retired IAS Officer',
        desigHi: 'सेवानिवृत्त आईएएस अधिकारी'
      }
    ]
  },
  {
    id: 'secretary',
    titleEn: 'Secretary to the Board',
    titleHi: 'बोर्ड के सचिव',
    members: [
      {
        id: 's-1',
        nameEn: 'Ms. Swathi Pandey',
        nameHi: 'श्रीमती स्वाति पांडे',
        desigEn: 'Principal Director (Personnel, SMU & Coordination)',
        desigHi: 'प्रधान निदेशक (कार्मिक, एसएमयू और समन्वय)'
      }
    ]
  }
];

export default function AuditAdvisoryBoardPage() {
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
    <AboutLayout title={isHindi ? 'लेखापरीक्षा सलाहकार बोर्ड' : 'Audit Advisory Board'}>
      <div className="flex flex-col gap-6 w-full text-left">
        
        {/* Intro Paragraph */}
        <p className="text-sm leading-relaxed text-zinc-800 m-0" style={{ fontFamily: 'Noto Sans' }}>
          {isHindi
            ? 'लेखापरीक्षा सलाहकार बोर्ड लेखापरीक्षा से संबंधित मामलों पर सुझाव प्रदान करता है, जिसमें लेखापरीक्षा के कवरेज, दायरे और प्राथमिकता के साथ-साथ भारत के नियंत्रक और महालेखापरीक्षक के संवैधानिक और वैधानिक जनादेश के ढांचे के भीतर लेखापरीक्षा दृष्टिकोण और तकनीकों के संबंध में सुझाव शामिल हैं। लेखापरीक्षा सलाहकार बोर्ड के सदस्य मानद क्षमता में कार्य करेंगे। भारत के नियंत्रक और महालेखापरीक्षक १६-०७-२०२५ से दो वर्ष की अवधि के लिए बारहवें लेखापरीक्षा सलाहकार बोर्ड का गठन करते हुए प्रसन्न हैं। बारहवें लेखापरीक्षा सलाहकार बोर्ड की संरचना इस प्रकार होगी:'
            : 'The Audit Advisory Board provides suggestions on matters relating to audit, including coverage, scope and prioritization of audits together with suggestions regarding audit approaches and techniques within the framework of the Constitution and statutory mandate of the Comptroller & Auditor General of India. The members of the Audit Advisory Board will function in an honorary capacity. Comptroller & Auditor General of India is pleased to constitute the Twelfth Audit Advisory Board for a period of two years from 16-07-2025. The composition of the Twelfth Audit Advisory Board would be as under:'}
        </p>

        {/* Board Sections Container */}
        <div className="flex flex-col gap-6 w-full">
          {BOARD_SECTIONS.map(section => {
            const sectionTitle = isHindi ? section.titleHi : section.titleEn;
            
            return (
              <section 
                key={section.id}
                className="w-full bg-white border border-[#E6E6E6] rounded-lg p-6 shadow-[4px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-5 text-left"
                aria-labelledby={`sec-title-${section.id}`}
              >
                
                {/* Section Header */}
                <div className="flex items-center gap-4">
                  {/* Styled Circle with white outline Board representation SVG */}
                  <div className="w-8 h-8 rounded-full bg-[#751639] flex items-center justify-center text-white flex-shrink-0" aria-hidden="true">
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10 C4 7, 7 6, 10 6 C13 6, 16 7, 16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="10" cy="3" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M1 11 C1 9, 3 8.5, 4.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="3" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M19 11 C19 9, 17 8.5, 15.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="17" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <h3 id={`sec-title-${section.id}`} className="text-lg md:text-xl font-bold text-[#2E2E31] m-0" style={{ fontFamily: 'Noto Sans' }}>
                    {sectionTitle}
                  </h3>
                </div>

                {/* Horizontal Line Divider */}
                <div className="w-full h-[1px] bg-[#D7D7D7] m-0" aria-hidden="true" />

                {/* Board Members list */}
                <div className="flex flex-col gap-4 w-full">
                  {section.members.map(member => {
                    const memberName = isHindi ? member.nameHi : member.nameEn;
                    const memberDesig = isHindi ? member.desigHi : member.desigEn;
                    
                    return (
                      <div 
                        key={member.id}
                        className="w-full p-3 px-4 bg-[#FAFAFA] border-l-2 border-[#751639] flex flex-col gap-1 rounded-r-lg transition-all duration-200 hover:bg-white hover:shadow-[4px_4px_15px_rgba(117,22,57,0.06)] hover:border-l-[4px] hover:-translate-y-0.5 group cursor-pointer"
                      >
                        <strong className="text-sm font-semibold text-black m-0 leading-tight transition-colors duration-200 group-hover:text-[#751639]" style={{ fontFamily: 'Noto Sans' }}>
                          {memberName}
                        </strong>
                        <span className="text-xs text-[#565656] m-0 transition-colors duration-200 group-hover:text-zinc-700">
                          {memberDesig}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </section>
            );
          })}
        </div>

      </div>
    </AboutLayout>
  );
}
