'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const STUDY_REPORTS_DOCS: ResourceDocumentItem[] = [
  {
    id: 'sr-1',
    titleEn: 'Study Reports & Compendia: Compendium on Audit of the Education Sector in India',
    titleHi: 'अध्ययन रिपोर्ट एवं संग्रह: भारत में शिक्षा क्षेत्र की लेखापरीक्षा पर संग्रह',
    groupEn: 'Sectoral Compendia',
    groupHi: 'क्षेत्रीय संग्रह',
    size: '14.20 MB',
    date: '2024-02-28',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'sr-2',
    titleEn: 'Compendium on Audit of Public Health Infrastructure and Medical Supplies',
    titleHi: 'सार्वजनिक स्वास्थ्य अवसंरचना और चिकित्सा आपूर्ति के लेखापरीक्षा पर संग्रह',
    groupEn: 'Sectoral Compendia',
    groupHi: 'क्षेत्रीय संग्रह',
    size: '11.50 MB',
    date: '2023-11-18',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'sr-3',
    titleEn: 'Study on Environmental Audits and Sustainable Development Goals (SDG) Alignment',
    titleHi: 'पर्यावरण लेखापरीक्षा और सतत विकास लक्ष्य (एसडीजी) संरेखण पर अध्ययन',
    groupEn: 'Environmental Audit Wing',
    groupHi: 'पर्यावरण लेखापरीक्षा विंग',
    size: '8.90 MB',
    date: '2023-08-04',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'sr-4',
    titleEn: 'Compendium on Local Body Grants and Panchayati Raj Institutional Audits',
    titleHi: 'स्थानीय निकाय अनुदान और पंचायती राज संस्थागत लेखापरीक्षा पर संग्रह',
    groupEn: 'Local Bodies Wing',
    groupHi: 'स्थानीय निकाय विंग',
    size: '7.60 MB',
    date: '2023-03-12',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function StudyReportsAndCompendiaPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Study Reports & Compendia"
      pageTitleHi="अध्ययन रिपोर्ट एवं संग्रह"
      apiSlug="study-reports"
      items={STUDY_REPORTS_DOCS}
    />
  );
}
