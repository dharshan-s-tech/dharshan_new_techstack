'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const GUIDELINES_DOCS: ResourceDocumentItem[] = [
  {
    id: 'gl-1',
    titleEn: 'Performance Audit Guidelines (Third Revised Edition)',
    titleHi: 'निष्पादन लेखापरीक्षा दिशानिर्देश (तृतीय संशोधित संस्करण)',
    groupEn: 'Methodology & Standards',
    groupHi: 'पद्धति एवं मानक',
    size: '8.40 MB',
    date: '2024-03-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gl-2',
    titleEn: 'Compliance Audit Guidelines with Focus on Public Procurement and Contracts',
    titleHi: 'सार्वजनिक खरीद और अनुबंधों पर ध्यान केंद्रित करते हुए अनुपालन लेखापरीक्षा दिशानिर्देश',
    groupEn: 'Methodology & Standards',
    groupHi: 'पद्धति एवं मानक',
    size: '7.15 MB',
    date: '2023-10-20',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gl-3',
    titleEn: 'Financial Attest Audit Guidelines for Union and State Government Accounts',
    titleHi: 'संघ और राज्य सरकार के खातों के लिए वित्तीय सत्यापन लेखापरीक्षा दिशानिर्देश',
    groupEn: 'Accounting Standards',
    groupHi: 'लेखांकन मानक',
    size: '9.30 MB',
    date: '2023-07-08',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gl-4',
    titleEn: 'Guidelines on Information Technology (IT) Audits and Cyber Security Evaluation',
    titleHi: 'सूचना प्रौद्योगिकी (आईटी) लेखापरीक्षा और साइबर सुरक्षा मूल्यांकन पर दिशानिर्देश',
    groupEn: 'IT Audit Wing',
    groupHi: 'आईटी लेखापरीक्षा विंग',
    size: '6.90 MB',
    date: '2023-02-14',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'gl-5',
    titleEn: 'Environmental & Climate Change Audit Guidelines for SAI India Field Formations',
    titleHi: 'साई भारत क्षेत्रीय संरचनाओं के लिए पर्यावरण और जलवायु परिवर्तन लेखापरीक्षा दिशानिर्देश',
    groupEn: 'Specialized Audits',
    groupHi: 'विशेष लेखापरीक्षा',
    size: '5.85 MB',
    date: '2022-11-10',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function GuidelinesPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Guidelines"
      pageTitleHi="दिशा-निर्देश"
      items={GUIDELINES_DOCS}
    />
  );
}
