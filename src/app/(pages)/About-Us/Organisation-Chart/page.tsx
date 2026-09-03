'use client';

import React, { useState, useEffect } from 'react';
import AboutLayout from '@/components/layout/AboutLayout';
import { dataManager } from '@/lib/dataManager';

interface OfficerData {
  id: string;
  nameEn: string;
  nameHi: string;
  desigEn: string;
  desigHi: string;
  subEn: string;
  subHi: string;
  email: string;
  phone: string;
  reportingEn: string;
  reportingHi: string;
}

const OFFICERS_DATA: {
  cag: OfficerData;
  secretary: OfficerData;
  rows: { left: OfficerData | null; right: OfficerData | null }[];
} = {
  cag: {
    id: 'cag-1',
    nameEn: 'Shri K. Sanjay Murthy',
    nameHi: 'श्री के. संजय मूर्ति',
    desigEn: 'Comptroller and Auditor General of India',
    desigHi: 'भारत के नियंत्रक और महालेखापरीक्षक',
    subEn: 'Comptroller and Auditor General of India',
    subHi: 'भारत के नियंत्रक और महालेखापरीक्षक',
    email: 'cagindia@cag.gov.in',
    phone: '011-23235790',
    reportingEn: 'All departments, state audit offices, and central audit divisions within the Indian Audit and Accounts Department.',
    reportingHi: 'भारतीय लेखापरीक्षा और लेखा विभाग के भीतर सभी विभाग, राज्य लेखापरीक्षा कार्यालय और केंद्रीय लेखापरीक्षा प्रभाग।'
  },
  secretary: {
    id: 'sec-1',
    nameEn: 'Shri Vishwanath Singh Jadon',
    nameHi: 'श्री विश्वनाथ सिंह जादौन',
    desigEn: 'Secretary to CAG',
    desigHi: 'नियंत्रक एवं महालेखापरीक्षक के सचिव',
    subEn: 'Comptroller and Auditor General of India Office',
    subHi: 'भारत के नियंत्रक और महालेखापरीक्षक कार्यालय',
    email: 'sec-cag@cag.gov.in',
    phone: '011-23239843',
    reportingEn: 'Administrative secretariat, public relations, executive coordination, and direct support to the CAG.',
    reportingHi: 'प्रशासनिक सचिवालय, जनसंपर्क, समन्वय और सीएजी को प्रत्यक्ष सहायता।'
  },
  rows: [
    {
      left: {
        id: 'l-1',
        nameEn: 'Shri Subir Mallick',
        nameHi: 'श्री सुबीर मल्लिक',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Defence',
        subHi: 'रक्षा',
        email: 'mallicks@cag.gov.in',
        phone: '011-23239821',
        reportingEn: 'Defence procurement audits, logistics support, ordnances factories audits, and armed forces commands audits.',
        reportingHi: 'रक्षा खरीद लेखापरीक्षा, रसद सहायता, आयुध निर्माणियों की लेखापरीक्षा, और सशस्त्र बलों के कमांडों की लेखापरीक्षा।'
      },
      right: {
        id: 'r-1',
        nameEn: 'Shri Krishnan Sangaran Subramanian',
        nameHi: 'श्री कृष्णन संगरण सुब्रमण्यन',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Human Resources, International Relations, Coordination & Legal',
        subHi: 'मानव संसाधन, अंतर्राष्ट्रीय संबंध, समन्वय और कानूनी',
        email: 'subramanianks@cag.gov.in',
        phone: '011-23234091',
        reportingEn: 'Personnel management, legal cells, coordination with central ministries, and international audit arrangements.',
        reportingHi: 'कार्मिक प्रबंधन, कानूनी सेल, केंद्रीय मंत्रालयों के साथ समन्वय, और अंतर्राष्ट्रीय लेखापरीक्षा व्यवस्था।'
      }
    },
    {
      left: {
        id: 'l-2',
        nameEn: 'Shri Anand Mohan Bajaj',
        nameHi: 'श्री आनंद मोहन बजाज',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Commercial & Report Central',
        subHi: 'वाणिज्यिक और केंद्रीय रिपोर्ट',
        email: 'bajajam@cag.gov.in',
        phone: '011-23216504',
        reportingEn: 'ADAI (State Commercial), ADAI (Parliamentary Committees), DG (Power), DG-I (Comm), DG-II (Comm), PDA (Industry & Corporate Affairs) Delhi, DGA (Infrastructure) Delhi, DGA (Mines and Coal) Kolkata, DGA (Financial Services) Mumbai, PDA (Steel) Ranchi, DGA (Oil and Gas) Mumbai, PDA (MSME) Hyderabad, PDA Shipping Chennai, DG (RC), PD(AB), PDA (Health, Welfare and Rural Development) Delhi, PDA (Home, Education Skill Development) Delhi, PDA (Environment & Scientific Departments) Delhi, PDA (Agriculture, Food and Water Resources) Delhi, PD (Parliamentary Committees), Overseas offices of PDA at London, Washington and Kuala Lumpur.',
        reportingHi: 'एडीएआई (राज्य वाणिज्यिक), एडीएआई (संसदीय समितियां), डीजी (बिजली), डीजी-I (वाणिज्य), डीजी-II (वाणिज्य), पीडीए (उद्योग और कॉर्पोरेट मामले) दिल्ली, डीजीए (बुनियादी ढांचा) दिल्ली, डीजीए (खान और कोयला) कोलकाता, डीजीए (वित्तीय सेवाएं) मुंबई, पीडीए (स्टील) रांची, डीजीए (तेल और गैस) मुंबई, पीडीए (एमएसएमई) हैदराबाद, पीडीए शिपिंग चेन्नई, डीजी (आरसी), पीडी (एबी), पीडीए (स्वास्थ्य, कल्याण और ग्रामीण विकास) दिल्ली, पीडीए (गृह, शिक्षा कौशल विकास) दिल्ली, पीडीए (पर्यावरण और वैज्ञानिक विभाग) दिल्ली, पीडीए (कृषि, खाद्य और जल संसाधन) दिल्ली, पीडी (संसदीय समितियां), लंदन, वाशिंगटन और कुआलालंपुर में पीडीए के विदेशी कार्यालय।'
      },
      right: {
        id: 'r-2',
        nameEn: 'Ms. Sandhya Shukla',
        nameHi: 'श्रीमती संध्या शुक्ला',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Central Revenue Audit',
        subHi: 'केंद्रीय राजस्व लेखापरीक्षा',
        email: 'shuklas@cag.gov.in',
        phone: '011-23231234',
        reportingEn: 'Direct tax audit (Income Tax, Corporate Tax) and Indirect tax audit (GST, Customs and Excise duties).',
        reportingHi: 'प्रत्यक्ष कर लेखापरीक्षा (आयकर, कॉर्पोरेट कर) और अप्रत्यक्ष कर लेखापरीक्षा (जीएसटी, सीमा शुल्क और उत्पाद शुल्क)।'
      }
    },
    {
      left: {
        id: 'l-3',
        nameEn: 'Shri Manish Kumar (1)',
        nameHi: 'श्री मनीष कुमार (१)',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Local Governance Audit',
        subHi: 'स्थानीय शासन लेखापरीक्षा',
        email: 'manishk@cag.gov.in',
        phone: '011-23235541',
        reportingEn: 'Panchayati Raj institutions, local municipal corporations, urban development bodies, and rural welfare scheme audits.',
        reportingHi: 'पंचायती राज संस्थाएं, स्थानीय नगर निगम, शहरी विकास निकाय, और ग्रामीण कल्याण योजना लेखापरीक्षा।'
      },
      right: {
        id: 'r-3',
        nameEn: 'Ms. Geeta Menon',
        nameHi: 'श्रीमती गीता मेनन',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Government Accounts & Chairperson (GASAB)',
        subHi: 'सरकारी खाते और अध्यक्ष (गैसेब)',
        email: 'menong@cag.gov.in',
        phone: '011-23238910',
        reportingEn: 'State financial reporting compliance, Union account reviews, and GASAB standards formulation.',
        reportingHi: 'राज्य वित्तीय रिपोर्टिंग अनुपालन, संघ खाता समीक्षा, और गैसेब मानकों का निर्माण।'
      }
    },
    {
      left: {
        id: 'l-4',
        nameEn: 'Ms. Keerti Tewari',
        nameHi: 'श्रीमती कीर्ति तिवारी',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Eastern Region',
        subHi: 'पूर्वी क्षेत्र',
        email: 'tewarik@cag.gov.in',
        phone: '011-23239401',
        reportingEn: 'State Audit offices in Eastern States including West Bengal, Bihar, Jharkhand, and Odisha.',
        reportingHi: 'पश्चिम बंगाल, बिहार, झारखंड और ओडिशा सहित पूर्वी राज्यों में राज्य लेखापरीक्षा कार्यालय।'
      },
      right: {
        id: 'r-4',
        nameEn: 'Shri Calvin Harris Kharshiing',
        nameHi: 'श्री केल्विन हैरिस खार्शींग',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'ADAI (NER) O/o CAG, Guwahati',
        subHi: 'एडीएआई (एनईआर) सीएजी कार्यालय, गुवाहाटी',
        email: 'kharshiingch@cag.gov.in',
        phone: '011-23237722',
        reportingEn: 'State audit directorates in North Eastern States (Assam, Meghalaya, Tripura, Mizoram, Nagaland, Manipur, Arunachal Pradesh).',
        reportingHi: 'उत्तर पूर्वी राज्यों (असम, मेघालय, त्रिपुरा, मिजोरम, नागालैंड, मणिपुर, अरुणाचल प्रदेश) में राज्य लेखापरीक्षा निदेशालय।'
      }
    },
    {
      left: {
        id: 'l-5',
        nameEn: 'Ms. Geetali Tare',
        nameHi: 'श्रीमती गीताली तारे',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Western Region',
        subHi: 'पश्चिमी क्षेत्र',
        email: 'tareg@cag.gov.in',
        phone: '011-23236712',
        reportingEn: 'State Audit offices in Western States including Maharashtra, Gujarat, Goa, and Madhya Pradesh.',
        reportingHi: 'महाराष्ट्र, गुजरात, गोवा और मध्य प्रदेश सहित पश्चिमी राज्यों में राज्य लेखापरीक्षा कार्यालय।'
      },
      right: {
        id: 'r-5',
        nameEn: 'Shri Abhishek Gupta',
        nameHi: 'श्री अभिषेक गुप्ता',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Central Region',
        subHi: 'केंद्रीय क्षेत्र',
        email: 'guptaa@cag.gov.in',
        phone: '011-23236021',
        reportingEn: 'Central ministries audits, direct tax audits, and compliance audits in the Central Zone.',
        reportingHi: 'केंद्रीय क्षेत्र में केंद्रीय मंत्रालयों की लेखापरीक्षा, प्रत्यक्ष कर लेखापरीक्षा, और अनुपालन लेखापरीक्षा।'
      }
    },
    {
      left: {
        id: 'l-6',
        nameEn: 'Shri Pramod Kumar',
        nameHi: 'श्री प्रमोद कुमार',
        desigEn: 'Deputy Comptroller & Auditor General',
        desigHi: 'उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Eastern Region',
        subHi: 'पूर्वी क्षेत्र',
        email: 'pramodk@cag.gov.in',
        phone: '011-23237121',
        reportingEn: 'Regional training centers, state audit liaison operations, and regional administrative structures.',
        reportingHi: 'क्षेत्रीय प्रशिक्षण केंद्र, राज्य लेखापरीक्षा संपर्क संचालन, और क्षेत्रीय प्रशासनिक संरचनाएं।'
      },
      right: {
        id: 'r-6',
        nameEn: 'Ms. Lata Mallikarjuna',
        nameHi: 'श्रीमती लता मल्लिकार्जुन',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Inspection',
        subHi: 'निरीक्षण',
        email: 'mallikarjunal@cag.gov.in',
        phone: '011-23233145',
        reportingEn: 'Internal inspections of all IAAD offices, quality assurance, peer review coordination.',
        reportingHi: 'सभी आईएएडी कार्यालयों का आंतरिक निरीक्षण, गुणवत्ता आश्वासन, सहकर्मी समीक्षा समन्वय।'
      }
    },
    {
      left: {
        id: 'l-7',
        nameEn: 'Shri Guljari Lal',
        nameHi: 'श्री गुलजारी लाल',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'State Commercial',
        subHi: 'राज्य वाणिज्यिक',
        email: 'guljaril@cag.gov.in',
        phone: '011-23234509',
        reportingEn: 'State public sector undertakings (PSUs), state electricity boards, and commercial tax revenue audits.',
        reportingHi: 'राज्य सार्वजनिक क्षेत्र के उपक्रम (पीएसयू), राज्य बिजली बोर्ड, और वाणिज्यिक कर राजस्व लेखापरीक्षा।'
      },
      right: {
        id: 'r-7',
        nameEn: 'Ms. Aman Deep Chatha',
        nameHi: 'श्रीमती अमन दीप चड्ढा',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Central Receipt, New Delhi',
        subHi: 'केंद्रीय प्राप्ति, नई दिल्ली',
        email: 'chathaad@cag.gov.in',
        phone: '011-23235678',
        reportingEn: 'Director General of Audit, Central Receipt, New Delhi (ADAI Level) operations.',
        reportingHi: 'महानिदेशक लेखापरीक्षा, केंद्रीय प्राप्ति, नई दिल्ली (एडीएआई स्तर) संचालन।'
      }
    },
    {
      left: {
        id: 'l-8',
        nameEn: 'Shri Nilotpal Goswami',
        nameHi: 'श्री नीलोत्पल गोस्वामी',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Rajbhasha',
        subHi: 'राजभाषा',
        email: 'goswamin@cag.gov.in',
        phone: '011-23239012',
        reportingEn: 'Official language policy implementation, translation cells, and department publications in Hindi.',
        reportingHi: 'आधिकारिक भाषा नीति कार्यान्वयन, अनुवाद सेल, और हिंदी में विभाग प्रकाशन।'
      },
      right: {
        id: 'r-8',
        nameEn: 'Shri Saurav Kumar Jaipuriyar',
        nameHi: 'श्री सौरव कुमार जयपुरियार',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Central Expenditure, New Delhi',
        subHi: 'केंद्रीय व्यय, नई दिल्ली',
        email: 'jaipuriyarsk@cag.gov.in',
        phone: '011-23234901',
        reportingEn: 'Director General of Audit, Central Expenditure, New Delhi (ADAI Level) operations.',
        reportingHi: 'महानिदेशक लेखापरीक्षा, केंद्रीय व्यय, नई दिल्ली (एडीएआई स्तर) संचालन।'
      }
    },
    {
      left: {
        id: 'l-9',
        nameEn: 'Shri Pravir Pandey',
        nameHi: 'श्री प्रवीर पांडे',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Railways',
        subHi: 'रेलवे',
        email: 'pandeyp@cag.gov.in',
        phone: '011-23238876',
        reportingEn: 'Railway zones audit offices, production units audits, and urban metro transport corporation audits.',
        reportingHi: 'रेलवे जोन लेखापरीक्षा कार्यालय, उत्पादन इकाइयों की लेखापरीक्षा, और शहरी मेट्रो परिवहन निगम लेखापरीक्षा।'
      },
      right: {
        id: 'r-9',
        nameEn: 'Shri Inder Deep Singh Dhariwal',
        nameHi: 'श्री इंदर दीप सिंह धारीवाल',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Accountability',
        subHi: 'जवाबदेही',
        email: 'dhariwalids@cag.gov.in',
        phone: '011-23238812',
        reportingEn: 'Monitoring accountability rules, audit report presentations, and public finance review cells.',
        reportingHi: 'निगरानी जवाबदेही नियम, लेखापरीक्षा रिपोर्ट प्रस्तुतियाँ, और सार्वजनिक वित्त समीक्षा सेल।'
      }
    },
    {
      left: {
        id: 'l-10',
        nameEn: 'Ms. Alka Rehani Bhardwaj',
        nameHi: 'श्रीमती अलका रेहानी भारद्वाज',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Government Accounts & GASAB',
        subHi: 'सरकारी खाते और गैसेब',
        email: 'bhardwajal@cag.gov.in',
        phone: '011-23231145',
        reportingEn: 'Government Accounting Standards Advisory Board (GASAB) affairs, central accounts coordination, and state accounts compilation reviews.',
        reportingHi: 'सरकारी लेखा मानक सलाहकार बोर्ड (गैसेब) के मामले, केंद्रीय खातों का समन्वय, और राज्य खातों के संकलन की समीक्षा।'
      },
      right: {
        id: 'r-10',
        nameEn: 'Shri Vishal Bansal',
        nameHi: 'श्री विशाल बंसल',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Professional Practice',
        subHi: 'व्यावसायिक अभ्यास',
        email: 'bansalv@cag.gov.in',
        phone: '011-23234056',
        reportingEn: 'Auditing standards cell, professional practice development, Sustainable Development Goals (SDG) coordination.',
        reportingHi: 'लेखापरीक्षा मानक सेल, व्यावसायिक अभ्यास विकास, सतत विकास लक्ष्य (एसडीजी) समन्वय।'
      }
    },
    {
      left: {
        id: 'l-11',
        nameEn: 'Shri Ravindra Pattar',
        nameHi: 'श्री रवीन्द्र पत्तार',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Northern Region & Southern Region',
        subHi: 'उत्तरी क्षेत्र और दक्षिणी क्षेत्र',
        email: 'pattarr@cag.gov.in',
        phone: '011-23235612',
        reportingEn: 'State audit offices in Northern and Southern states, overseeing performance and compliance reviews.',
        reportingHi: 'उत्तरी और दक्षिणी राज्यों में राज्य लेखापरीक्षा कार्यालय, प्रदर्शन और अनुपालन समीक्षाओं की देखरेख।'
      },
      right: {
        id: 'r-11',
        nameEn: 'Shri Biren Dineshchandra Parmar',
        nameHi: 'श्री बिरेन दिनेशचंद्र परमार',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Director General Audit, Mines & Coal, Kolkata',
        subHi: 'महानिदेशक लेखापरीक्षा, खान और कोयला, कोलकाता',
        email: 'parmarbd@cag.gov.in',
        phone: '011-23237190',
        reportingEn: 'Mines and minerals audit, public coal sector companies audits, based in Kolkata (ADAI Level).',
        reportingHi: 'खान और खनिज लेखापरीक्षा, सार्वजनिक कोयला क्षेत्र की कंपनियों की लेखापरीक्षा, कोलकाता में स्थित (एडीएआई स्तर)।'
      }
    },
    {
      left: {
        id: 'l-12',
        nameEn: 'Shri Samar Kant Thakur',
        nameHi: 'श्री समर कांत ठाकुर',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Parliamentary Committees',
        subHi: 'संसदीय समितियां',
        email: 'thakursk@cag.gov.in',
        phone: '011-23237890',
        reportingEn: 'Liaison with Public Accounts Committee (PAC), Committee on Public Undertakings (COPU), and parliament question responses.',
        reportingHi: 'लोक लेखा समिति (पीएसी), सार्वजनिक उपक्रमों संबंधी समिति (कोपू) के साथ संपर्क, और संसद के प्रश्नों के उत्तर।'
      },
      right: null
    },
    {
      left: {
        id: 'l-13',
        nameEn: 'Shri Bijay Kumar Mohanty',
        nameHi: 'श्री बिजय कुमार मोहंती',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Director General (IDSA), Noida',
        subHi: 'महानिदेशक (आईडीएसए), नोएडा',
        email: 'mohantybk@cag.gov.in',
        phone: '011-23230987',
        reportingEn: 'International auditing standards, training academies coordination, and foreign audit relations.',
        reportingHi: 'अंतरराष्ट्रीय लेखापरीक्षा मानक, प्रशिक्षण अकादमियों का समन्वय, और विदेशी लेखापरीक्षा संबंध।'
      },
      right: null
    },
    {
      left: {
        id: 'l-14',
        nameEn: 'Shri Rajiv Kumar Pandey',
        nameHi: 'श्री राजीव कुमार पांडे',
        desigEn: 'Additional Deputy Comptroller & Auditor General',
        desigHi: 'अपर उप नियंत्रक एवं महालेखापरीक्षक',
        subEn: 'Capacity Building & Urban Development',
        subHi: 'क्षमता निर्माण और शहरी विकास',
        email: 'pandeyrk@cag.gov.in',
        phone: '011-23234561',
        reportingEn: 'Capacity building initiatives, urban development, housing & procurement audits, DG-iCD Jaipur (ADAI Level/Addl. Charge).',
        reportingHi: 'क्षमता निर्माण पहल, शहरी विकास, आवास और खरीद लेखापरीक्षा, डीजी-आईसीडी जयपुर (एडीएआई स्तर/अतिरिक्त प्रभार)।'
      },
      right: null
    }
  ]
};

export default function OrganisationChartPage() {
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

  const renderOfficerCardWithDetails = (officer: OfficerData, side: 'left' | 'right' | 'center') => {
    const name = isHindi ? officer.nameHi : officer.nameEn;
    const desig = isHindi ? officer.desigHi : officer.desigEn;
    const sub = isHindi ? officer.subHi : officer.subEn;

    // Define positions of absolute popup boxes
    const detailsPopupPosition = side === 'left' || side === 'center'
      ? 'left-[calc(100%+24px)]'
      : 'right-[calc(100%+24px)]';

    return (
      <div className="relative group w-full md:w-[356px] z-10 hover:z-50">
        
        {/* Officer Card Trigger */}
        <div
          className="w-full md:w-[356px] text-left p-4 rounded-lg border bg-white shadow-[4px_4px_15px_rgba(0,0,0,0.05)] border-[#D7D7D7] transition-all duration-200 hover:border-[#751639] hover:shadow-[4px_4px_20px_rgba(117,22,57,0.1)] flex items-start gap-4 cursor-pointer"
          style={{
            background: 'linear-gradient(85.72deg, #FFFFFF 1.04%, #FFFFFF 99.26%)',
          }}
        >
          {/* Vector User Avatar Icon */}
          <div className="w-8 h-8 rounded-full border border-[#D7D7D7] bg-white flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#686868" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          
          {/* Name and titles */}
          <div className="flex flex-col gap-1 flex-grow">
            <span 
              className="text-base font-bold m-0 block underline hover:text-[#500c25]" 
              style={{ color: '#751639', fontFamily: 'Noto Sans' }}
            >
              {name}
            </span>
            <span className="text-sm font-semibold block" style={{ color: '#686868', fontFamily: 'Noto Sans' }}>
              {desig}
            </span>
            <span className="text-xs font-normal block mt-0.5" style={{ color: '#7A7A7A', fontFamily: 'Noto Sans' }}>
              {sub}
            </span>
          </div>
        </div>

        {/* Hover details popover card */}
        <div 
          className={`absolute ${detailsPopupPosition} top-0 z-30 hidden group-hover:flex flex-col w-[440px] max-h-[300px] bg-white border border-[#D7D7D7] rounded-lg p-5 shadow-[2px_2px_14px_rgba(0,0,0,0.08)]`}
          style={{ cursor: 'default' }}
          role="tooltip"
        >
          {/* Custom border matching pointer triangle */}
          {side === 'left' || side === 'center' ? (
            <div className="absolute right-full top-6 w-3 h-6 overflow-hidden mr-[-1px]" aria-hidden="true">
              <div className="w-3 h-3 bg-white border-l border-b border-[#D7D7D7] rotate-45 translate-x-1.5 translate-y-1.5" />
            </div>
          ) : (
            <div className="absolute left-full top-6 w-3 h-6 overflow-hidden ml-[-1px]" aria-hidden="true">
              <div className="w-3 h-3 bg-white border-r border-t border-[#D7D7D7] rotate-45 -translate-x-1.5 translate-y-1.5" />
            </div>
          )}

          {/* Contact Details */}
          <div className="flex flex-col gap-2.5 text-left text-sm">
            <div className="flex flex-row items-center gap-2">
              <strong className="text-zinc-800 font-semibold" style={{ width: '90px', minWidth: '90px' }}>
                {isHindi ? 'ईमेल:' : 'Email:'}
              </strong>
              <span className="text-zinc-600 break-all select-all font-sans">{officer.email}</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <strong className="text-zinc-800 font-semibold" style={{ width: '90px', minWidth: '90px' }}>
                {isHindi ? 'संपर्क नंबर:' : 'Contact No.:'}
              </strong>
              <span className="text-zinc-600 select-all font-sans">{officer.phone}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-[#D7D7D7] my-3.5" aria-hidden="true" />

          {/* Reporting Offices (Scrollable) */}
          <div className="flex flex-col gap-1.5 text-left flex-grow overflow-y-auto pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
              {isHindi ? 'रिपोर्टिंग कार्यालय/अधिकारी:' : 'Offices/Officers Reporting:'}
            </span>
            <p className="text-xs leading-relaxed text-zinc-600 m-0 whitespace-pre-line" style={{ fontFamily: 'Noto Sans' }}>
              {isHindi ? officer.reportingHi : officer.reportingEn}
            </p>
          </div>

        </div>

      </div>
    );
  };

  return (
    <AboutLayout title={isHindi ? 'संगठन चार्ट' : 'Organisation Chart'}>
      <div className="relative w-full flex flex-col items-center">
        <p className="text-sm text-zinc-600 self-start mb-8 text-left leading-relaxed">
          {isHindi 
            ? 'भारत के नियंत्रक और महालेखापरीक्षक विभाग का नेतृत्व करते हैं। संगठन लेखापरीक्षा क्षेत्रों की देखरेख करने वाले वरिष्ठ अधिकारियों के पदानुक्रम के माध्यम से कार्य करता है:'
            : 'The Comptroller and Auditor General of India leads the department. The organization functions through a hierarchy of senior executives overseeing audit fields:'}
        </p>

        {/* Horizontal scroll wrap container to guarantee center-line math alignment on all viewports */}
        <div className="w-full overflow-x-auto pb-6 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          
          <div className="min-w-[800px] flex flex-col items-center gap-0 relative px-4">
            
            {/* Tier 1: CAG (Centered, hover lifts z-index stack context) */}
            <div className="w-full md:w-[356px] relative z-20 flex justify-center hover:z-50">
              {renderOfficerCardWithDetails(OFFICERS_DATA.cag, 'center')}
            </div>

            {/* Connect Trunk segment between CAG and Secretary */}
            <div className="hidden md:block w-[2px] h-[32px] bg-[#D7D7D7]" aria-hidden="true" />

            {/* Tier 2: Secretary to CAG (Row-formatted, hover lifts z-index) */}
            <div className="flex flex-col md:flex-row items-center justify-center relative w-full gap-4 md:gap-0 z-10 hover:z-50">
              {/* Left Spacer */}
              <div className="hidden md:block w-[356px] h-1" aria-hidden="true" />
              
              {/* Trunk Line Segment with right branch and right-pointing arrowhead */}
              <div className="hidden md:flex items-center justify-center relative w-[80px] self-stretch" aria-hidden="true">
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#D7D7D7] -translate-x-1/2" />
                <div className="absolute left-1/2 w-[40px] h-[2px] bg-[#D7D7D7] ml-[1px] top-1/2 -translate-y-1/2" />
                
                {/* Arrowhead pointing to Secretary card */}
                <svg width="8" height="12" viewBox="0 0 8 12" className="absolute right-0 top-1/2 -translate-y-1/2" fill="none">
                  <path d="M2 2 L6 6 L2 10" stroke="#D7D7D7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Secretary Card */}
              <div className="w-full md:w-[356px] flex justify-start">
                {renderOfficerCardWithDetails(OFFICERS_DATA.secretary, 'right')}
              </div>
            </div>

            {/* Connect Trunk segment between Secretary and Grid */}
            <div className="hidden md:block w-[2px] h-[32px] bg-[#D7D7D7]" aria-hidden="true" />

            {/* Tier 3: Dual Column Grid of Rows (Rows 1 to 14, hover lifts z-index stack context) */}
            {OFFICERS_DATA.rows.map((row, index) => (
              <div 
                key={index} 
                className="flex flex-col md:flex-row items-center justify-center relative w-full gap-4 md:gap-0 z-10 hover:z-50"
              >
                
                {/* Left Side: Card (shifted up using pb-12 on desktop) */}
                <div className="w-full md:w-[356px] flex justify-end md:pb-12">
                  {row.left ? renderOfficerCardWithDetails(row.left, 'left') : <div className="hidden md:block w-[356px] h-1" aria-hidden="true" />}
                </div>

                {/* Central Trunk connector with staggered branches and arrowheads */}
                <div className="hidden md:flex items-center justify-center relative w-[80px] self-stretch" aria-hidden="true">
                  {/* Vertical center trunk */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#D7D7D7] -translate-x-1/2" />
                  
                  {/* Left Staggered Connection Branch (Higher, top-[calc(50%-24px)]) */}
                  {row.left && (
                    <>
                      <div className="absolute right-1/2 w-[40px] h-[2px] bg-[#D7D7D7] mr-[1px] top-[calc(50%-24px)] -translate-y-1/2" />
                      <svg width="8" height="12" viewBox="0 0 8 12" className="absolute left-0 top-[calc(50%-24px)] -translate-y-1/2" fill="none">
                        <path d="M6 2 L2 6 L6 10" stroke="#D7D7D7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                  
                  {/* Right Staggered Connection Branch (Lower, top-[calc(50%+24px)]) */}
                  {row.right && (
                    <>
                      <div className="absolute left-1/2 w-[40px] h-[2px] bg-[#D7D7D7] ml-[1px] top-[calc(50%+24px)] -translate-y-1/2" />
                      <svg width="8" height="12" viewBox="0 0 8 12" className="absolute right-0 top-[calc(50%+24px)] -translate-y-1/2" fill="none">
                        <path d="M2 2 L6 6 L2 10" stroke="#D7D7D7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </div>

                {/* Right Side: Card (shifted down using pt-12 on desktop) */}
                <div className="w-full md:w-[356px] flex justify-start md:pt-12">
                  {row.right ? renderOfficerCardWithDetails(row.right, 'right') : <div className="hidden md:block w-[356px] h-1" aria-hidden="true" />}
                </div>

              </div>
            ))}

          </div>
          
        </div>
      </div>
    </AboutLayout>
  );
}
