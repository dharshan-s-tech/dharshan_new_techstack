'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const RECRUITMENT_POLICY_DOCS: ResourceDocumentItem[] = [
  {
    id: 'rp-1',
    titleEn: 'Assistant Supervisor',
    titleHi: 'सहायक पर्यवेक्षक',
    groupEn: 'Group B & C',
    groupHi: 'समूह ख एवं ग',
    size: '5.97 MB',
    date: '2024-05-10',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-2',
    titleEn: 'Halwai-cum-Cook (Type-D Canteens)',
    titleHi: 'हलवाई-सह-रसोइया (टाइप-डी कैंटीन)',
    groupEn: 'Group B & C',
    groupHi: 'समूह ख एवं ग',
    size: '5.97 MB',
    date: '2024-04-18',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-3',
    titleEn: 'General Manager, Manager Grade-II & Manager-cum-Accountant',
    titleHi: 'महाप्रबंधक, प्रबंधक ग्रेड-II एवं प्रबंधक-सह-लेखाकार',
    groupEn: 'Group B & C',
    groupHi: 'समूह ख एवं ग',
    size: '5.97 MB',
    date: '2024-03-25',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-4',
    titleEn: 'Deputy General Manager (Departmental Canteen)',
    titleHi: 'उप महाप्रबंधक (विभागीय कैंटीन)',
    groupEn: 'Group B & C',
    groupHi: 'समूह ख एवं ग',
    size: '5.97 MB',
    date: '2024-02-14',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-5',
    titleEn: 'Senior Audit Officer / Senior Accounts Officer Recruitment Rules',
    titleHi: 'वरिष्ठ लेखापरीक्षा अधिकारी / वरिष्ठ लेखा अधिकारी भर्ती नियम',
    groupEn: 'Group A & B Gazetted',
    groupHi: 'समूह क एवं ख राजपत्रित',
    size: '4.20 MB',
    date: '2023-11-20',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-6',
    titleEn: 'Assistant Audit Officer (AAO) Recruitment Regulations',
    titleHi: 'सहायक लेखापरीक्षा अधिकारी (एएओ) भर्ती विनियम',
    groupEn: 'Group B Gazetted',
    groupHi: 'समूह ख राजपत्रित',
    size: '3.80 MB',
    date: '2023-09-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-7',
    titleEn: 'Auditor & Accountant Cadre Rules',
    titleHi: 'लेखापरीक्षक एवं लेखाकार संवर्ग नियम',
    groupEn: 'Group C Ministerial',
    groupHi: 'समूह ग मंत्रालयिक',
    size: '2.95 MB',
    date: '2023-06-10',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rp-8',
    titleEn: 'Clerk / Data Entry Operator / Multi-Tasking Staff (MTS) Framework',
    titleHi: 'लिपिक / डाटा एंट्री ऑपरेटर / मल्टी-टास्किंग स्टाफ (एमटीएस) रूपरेखा',
    groupEn: 'Group C Non-Technical',
    groupHi: 'समूह ग गैर-तकनीकी',
    size: '3.15 MB',
    date: '2023-04-05',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function RecruitmentPolicyPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Recruitment Policy"
      pageTitleHi="भर्ती नीति"
      items={RECRUITMENT_POLICY_DOCS}
    />
  );
}
