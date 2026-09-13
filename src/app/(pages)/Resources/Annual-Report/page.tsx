'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const ANNUAL_REPORT_DOCS: ResourceDocumentItem[] = [
  {
    id: 'ar-2024',
    titleEn: 'Annual Report of the Comptroller and Auditor General of India 2023-24',
    titleHi: 'भारत के नियंत्रक एवं महालेखापरीक्षक का वार्षिक प्रतिवेदन 2023-24',
    groupEn: 'Institutional Publications',
    groupHi: 'संस्थागत प्रकाशन',
    size: '12.45 MB',
    date: '2024-06-30',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'ar-2023',
    titleEn: 'Annual Report of the Comptroller and Auditor General of India 2022-23',
    titleHi: 'भारत के नियंत्रक एवं महालेखापरीक्षक का वार्षिक प्रतिवेदन 2022-23',
    groupEn: 'Institutional Publications',
    groupHi: 'संस्थागत प्रकाशन',
    size: '11.80 MB',
    date: '2023-06-25',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'ar-2022',
    titleEn: 'Annual Report of the Comptroller and Auditor General of India 2021-22',
    titleHi: 'भारत के नियंत्रक एवं महालेखापरीक्षक का वार्षिक प्रतिवेदन 2021-22',
    groupEn: 'Institutional Publications',
    groupHi: 'संस्थागत प्रकाशन',
    size: '10.90 MB',
    date: '2022-06-20',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'ar-2021',
    titleEn: 'Annual Report of the Comptroller and Auditor General of India 2020-21',
    titleHi: 'भारत के नियंत्रक एवं महालेखापरीक्षक का वार्षिक प्रतिवेदन 2020-21',
    groupEn: 'Institutional Publications (Archived)',
    groupHi: 'संस्थागत प्रकाशन (पुरालेख)',
    size: '9.75 MB',
    date: '2021-06-15',
    fileUrl: '/assets/sample.pdf',
    isArchived: true
  }
];

export default function AnnualReportPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Annual Report"
      pageTitleHi="वार्षिक प्रतिवेदन"
      items={ANNUAL_REPORT_DOCS}
    />
  );
}
