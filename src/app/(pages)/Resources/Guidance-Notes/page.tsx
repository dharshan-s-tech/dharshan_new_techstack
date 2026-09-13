'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const GUIDANCE_NOTES_DOCS: ResourceDocumentItem[] = [
  {
    id: 'gn-1',
    titleEn: 'Guidance Notes, Practice Guides & Concept Notes on Data Analytics in Public Audit',
    titleHi: 'सार्वजनिक लेखापरीक्षा में डेटा एनालिटिक्स पर मार्गदर्शन नोट, अभ्यास गाइड और अवधारणा नोट',
    groupEn: 'Data Analytics Wing',
    groupHi: 'डेटा एनालिटिक्स विंग',
    size: '6.70 MB',
    date: '2024-04-05',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gn-2',
    titleEn: 'Practice Guide on Auditing Public-Private Partnerships (PPP) Projects and Concessions',
    titleHi: 'सार्वजनिक-निजी भागीदारी (पीपीपी) परियोजनाओं और रियायतों के लेखापरीक्षा पर अभ्यास गाइड',
    groupEn: 'Commercial & Infrastructure Audit',
    groupHi: 'वाणिज्यिक एवं अवसंरचना लेखापरीक्षा',
    size: '5.40 MB',
    date: '2023-12-12',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gn-3',
    titleEn: 'Concept Note on Auditing Artificial Intelligence (AI) Systems and Algorithms in Governance',
    titleHi: 'शासन में कृत्रिम बुद्धिमत्ता (एआई) प्रणालियों और एल्गोरिदम के लेखापरीक्षा पर अवधारणा नोट',
    groupEn: 'Emerging Technologies',
    groupHi: 'उभरती प्रौद्योगिकियां',
    size: '4.85 MB',
    date: '2023-09-28',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gn-4',
    titleEn: 'Guidance Note on Audit of Direct Benefit Transfer (DBT) and Welfare Schemes',
    titleHi: 'प्रत्यक्ष लाभ अंतरण (डीबीटी) और कल्याणकारी योजनाओं की लेखापरीक्षा पर मार्गदर्शन नोट',
    groupEn: 'Social Sector Audits',
    groupHi: 'सामाजिक क्षेत्र लेखापरीक्षा',
    size: '4.10 MB',
    date: '2023-05-16',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function GuidanceNotesPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Guidance Notes, Practice Guides & Concept Notes"
      pageTitleHi="मार्गदर्शन नोट, अभ्यास गाइड और अवधारणा नोट"
      items={GUIDANCE_NOTES_DOCS}
    />
  );
}
