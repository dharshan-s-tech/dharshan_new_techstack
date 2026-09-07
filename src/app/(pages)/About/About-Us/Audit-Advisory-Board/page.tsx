'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

interface MemberItem {
  id: string;
  avatarLetter: string;
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
        avatarLetter: 'S',
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
        avatarLetter: 'A',
        nameEn: 'Shri Ashok Gulati',
        nameHi: 'श्री अशोक गुलाटी',
        desigEn: 'Agricultural Economist',
        desigHi: 'कृषि अर्थशास्त्री'
      },
      {
        id: 'ex-2',
        avatarLetter: 'M',
        nameEn: 'Shri Manish Sabharwal',
        nameHi: 'श्री मनीष सबरवाल',
        desigEn: 'Chairman, Team Lease Service',
        desigHi: 'अध्यक्ष, टीमलीज सर्विसेज'
      },
      {
        id: 'ex-3',
        avatarLetter: 'R',
        nameEn: 'Dr. Rajeev Lochan Bishnoi',
        nameHi: 'डॉ. राजीव लोचन बिश्नोई',
        desigEn: 'Credit and Financial Specialist',
        desigHi: 'क्रेडिट और वित्तीय विशेषज्ञ'
      },
      {
        id: 'ex-4',
        avatarLetter: 'V',
        nameEn: 'Shri S. M. Vijayanand',
        nameHi: 'श्री एस. एम. विजयानंद',
        desigEn: 'Retired IAS Officer',
        desigHi: 'सेवानिवृत्त आईएएस अधिकारी'
      },
      {
        id: 'ex-5',
        avatarLetter: 'S',
        nameEn: 'Prof. Sudhir K Jain',
        nameHi: 'प्रो. सुधीर के जैन',
        desigEn: 'Academician',
        desigHi: 'शिक्षाविद'
      },
      {
        id: 'ex-6',
        avatarLetter: 'R',
        nameEn: 'Dr. R.S. Sharma',
        nameHi: 'डॉ. आर.एस. शर्मा',
        desigEn: 'Retired IAS Officer',
        desigHi: 'सेवानिवृत्त आईएएस अधिकारी'
      },
      {
        id: 'ex-7',
        avatarLetter: 'A',
        nameEn: 'Shri Anurag Behar',
        nameHi: 'श्री अनुराग बेहर',
        desigEn: 'CEO, Azim Premji Foundation',
        desigHi: 'सीईओ, अज़ीम प्रेमजी फाउंडेशन'
      },
      {
        id: 'ex-8',
        avatarLetter: 'R',
        nameEn: 'Dr. Randeep Guleria',
        nameHi: 'डॉ. रणदीप गुलेरिया',
        desigEn: 'Health and Medical Administration',
        desigHi: 'स्वास्थ्य और चिकित्सा प्रशासन'
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
        avatarLetter: 'R',
        nameEn: 'Ms. Rebecca Mathai',
        nameHi: 'सुश्री रेबेका मथाई',
        desigEn: 'Deputy Comptroller & Auditor General (Southern Region & Synchronization)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (दक्षिणी क्षेत्र एवं तुल्यकालन)'
      },
      {
        id: 'in-2',
        avatarLetter: 'S',
        nameEn: 'Shri Subir Mallick',
        nameHi: 'श्री सुबीर मल्लिक',
        desigEn: 'Deputy Comptroller & Auditor General (Defence)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (रक्षा)'
      },
      {
        id: 'in-3',
        avatarLetter: 'K',
        nameEn: 'Shri K. S. Subramanian',
        nameHi: 'श्री के. एस. सुब्रमण्यम',
        desigEn: 'Deputy Comptroller & Auditor General (Human Resources, International Relations, Coordination & Local)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (मानव संसाधन, अंतर्राष्ट्रीय संबंध, समन्वय और स्थानीय)'
      },
      {
        id: 'in-4',
        avatarLetter: 'A',
        nameEn: 'Shri Anand Mohan Bajaj',
        nameHi: 'श्री आनंद मोहन बजाज',
        desigEn: 'Deputy Comptroller & Auditor General (Commercial & Reports Central)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (वाणिज्यिक और रिपोर्ट केंद्रीय)'
      },
      {
        id: 'in-5',
        avatarLetter: 'S',
        nameEn: 'Ms. Sandhya Shukla',
        nameHi: 'सुश्री संध्या शुक्ला',
        desigEn: 'Deputy Comptroller & Auditor General (Central Revenue Audit)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (केंद्रीय राजस्व लेखा परीक्षा)'
      },
      {
        id: 'in-6',
        avatarLetter: 'M',
        nameEn: 'Shri Manish Kumar (I)',
        nameHi: 'श्री मनीष कुमार (I)',
        desigEn: 'Deputy Comptroller & Auditor General (Local Governance Audit)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (स्थानीय शासन लेखा परीक्षा)'
      },
      {
        id: 'in-7',
        avatarLetter: 'R',
        nameEn: 'Ms. Reena Prakash',
        nameHi: 'सुश्री रीना प्रकाश',
        desigEn: 'Deputy Comptroller & Auditor General (Central Region)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (मध्य क्षेत्र)'
      },
      {
        id: 'in-8',
        avatarLetter: 'G',
        nameEn: 'Ms. Geeta Menon',
        nameHi: 'सुश्री गीता मेनन',
        desigEn: 'Deputy Comptroller & Auditor General (Government Accounts & Chairperson of GASAB)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (सरकारी खाते और जीएएसएबी की अध्यक्ष)'
      },
      {
        id: 'in-9',
        avatarLetter: 'K',
        nameEn: 'Ms. Keerti Tewari',
        nameHi: 'सुश्री कीर्ति तिवारी',
        desigEn: 'Deputy Comptroller & Auditor General (Eastern Region)',
        desigHi: 'उप नियंत्रक एवं महालेखा परीक्षक (पूर्वी क्षेत्र)'
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
        avatarLetter: 'S',
        nameEn: 'Ms. Swathi Pandey',
        nameHi: 'सुश्री स्वाति पांडे',
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
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  return (
    <AboutLayout title={isHindi ? 'लेखापरीक्षा सलाहकार बोर्ड' : 'Audit Advisory Board'}>
      <div className="flex flex-col items-start w-full max-w-[978px]">
        {/* Main Title matching Figma CSS */}
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
          {isHindi ? 'लेखापरीक्षा सलाहकार बोर्ड' : 'Audit Advisory Board'}
        </h1>

        {/* Intro Paragraph matching Figma CSS */}
        <div 
          className="text-sm font-normal text-[#2A2A2A] mb-8 text-left space-y-4 w-full"
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '28px',
            color: '#2A2A2A'
          }}
        >
          <p className="m-0">
            {isHindi
              ? 'लेखापरीक्षा सलाहकार बोर्ड लेखापरीक्षा से संबंधित मामलों पर सुझाव प्रदान करता है, जिसमें लेखापरीक्षा के कवरेज, दायरे और प्राथमिकता के साथ-साथ भारत के नियंत्रक और महालेखापरीक्षक के संवैधानिक और वैधानिक जनादेश के ढांचे के भीतर लेखापरीक्षा दृष्टिकोण और तकनीकों के संबंध में सुझाव शामिल हैं। लेखापरीक्षा सलाहकार बोर्ड के सदस्य मानद क्षमता में कार्य करेंगे।'
              : 'The Audit Advisory Board provides suggestions on matters relating to audit, including coverage, scope and prioritization of audits together with suggestions regarding audit approaches and techniques within the framework of the Constitution and statutory mandate of the Comptroller & Auditor General of India. The members of the Audit Advisory Board will function in an honorary capacity.'}
          </p>
          <p className="m-0">
            {isHindi
              ? 'भारत के नियंत्रक और महालेखापरीक्षक 16-07-2025 से दो वर्ष की अवधि के लिए बारहवें लेखापरीक्षा सलाहकार बोर्ड का गठन करते हुए प्रसन्न हैं। बारहवें लेखापरीक्षा सलाहकार बोर्ड की संरचना इस प्रकार होगी:'
              : 'Comptroller & Auditor General of India is pleased to constitute the Twelfth Audit Advisory Board for a period of two years from 16-07-2025. The composition of the Twelfth Audit Advisory Board would be as under'}
          </p>
        </div>

        {/* Board Sections Containers */}
        <div className="flex flex-col gap-6 w-full">
          {BOARD_SECTIONS.map(section => {
            const sectionTitle = isHindi ? section.titleHi : section.titleEn;
            const isSingle = section.members.length === 1;

            return (
              <section 
                key={section.id}
                className="w-full bg-white border border-[#E6E6E6] rounded-lg p-6 shadow-[4px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-6 text-left"
                aria-labelledby={`sec-title-${section.id}`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4">
                  {/* Heading Icon 32px diameter */}
                  <img 
                    src="/assets/board_heading_icon.png" 
                    alt="Section Icon" 
                    className="w-[32px] h-[32px] rounded-full object-cover shrink-0"
                  />

                  <h2 
                    id={`sec-title-${section.id}`} 
                    className="text-xl font-semibold text-[#2E2E31] m-0"
                    style={{
                      fontFamily: 'Noto Sans, sans-serif',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '27px',
                      color: '#2E2E31'
                    }}
                  >
                    {sectionTitle}
                  </h2>
                </div>

                {/* Horizontal Line Divider */}
                <div className="w-full h-[1px] bg-[#D7D7D7] m-0" aria-hidden="true" />

                {/* Member Cards Grid */}
                <div className={isSingle ? "w-full max-w-[320px]" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"}>
                  {section.members.map(member => {
                    const memberName = isHindi ? member.nameHi : member.nameEn;
                    const memberDesig = isHindi ? member.desigHi : member.desigEn;

                    return (
                      <div 
                        key={member.id}
                        className="bg-[#FAFAFA] p-[8px_16px] flex flex-col justify-center items-start gap-1 w-full min-h-[115px]"
                        style={{
                          backgroundColor: '#FAFAFA',
                          borderLeft: '2px solid transparent',
                          borderImageSource: 'linear-gradient(180deg, #FFFFFF 0%, rgba(117, 22, 57, 0.5) 60.1%, #FFFFFF 100%)',
                          borderImageSlice: 1,
                          boxSizing: 'border-box',
                          padding: '8px 16px',
                        }}
                      >
                        {/* Unit Container */}
                        <div className="flex flex-col justify-center items-start gap-2.5 w-full">
                          {/* Profile Avatar Circle 40px #F0CFDB */}
                          <div 
                            className="w-[40px] h-[40px] rounded-full bg-[#F0CFDB] flex items-center justify-center shrink-0"
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#F0CFDB',
                              borderRadius: '50px',
                            }}
                          >
                            <span 
                              style={{
                                fontFamily: 'Noto Sans, sans-serif',
                                fontWeight: 700,
                                fontSize: '24px',
                                lineHeight: '33px',
                                color: '#751639'
                              }}
                            >
                              {member.avatarLetter}
                            </span>
                          </div>

                          {/* Line 1609 Divider */}
                          <div 
                            className="w-full my-0"
                            style={{
                              width: '100%',
                              height: '0px',
                              borderTop: '1px solid #D7D7D7',
                            }}
                            aria-hidden="true" 
                          />

                          {/* Name & Subtitle Text Block */}
                          <div className="flex flex-col items-start gap-1 w-full text-left">
                            <span 
                              style={{
                                fontFamily: 'Noto Sans, sans-serif',
                                fontWeight: 600,
                                fontSize: '14px',
                                lineHeight: '19px',
                                color: '#000000',
                                display: 'block'
                              }}
                            >
                              {memberName}
                            </span>
                            <span 
                              style={{
                                fontFamily: 'Noto Sans, sans-serif',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '16px',
                                color: '#565656',
                                display: 'block'
                              }}
                            >
                              {memberDesig}
                            </span>
                          </div>
                        </div>
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

