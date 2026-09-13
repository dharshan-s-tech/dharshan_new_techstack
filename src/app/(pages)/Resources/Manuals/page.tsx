'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const MANUALS_DOCS: ResourceDocumentItem[] = [
  {
    id: 'man-1',
    titleEn: 'Manual of Standing Orders (Audit) - Regulations on Audit & Accounts (MSO Audit Vol I & II)',
    titleHi: 'स्थायी आदेश नियमावली (लेखापरीक्षा) - लेखापरीक्षा एवं लेखा विनियम (एमएसओ ऑडिट भाग I एवं II)',
    groupEn: 'Core IAAD Manuals',
    groupHi: 'मुख्य आईएएडी नियमावली',
    size: '18.50 MB',
    date: '2024-02-10',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'man-2',
    titleEn: 'Manual of Standing Orders (Administrative) - Personnel & Establishment Rules',
    titleHi: 'स्थायी आदेश नियमावली (प्रशासनिक) - कार्मिक एवं स्थापना नियम',
    groupEn: 'Administration Manuals',
    groupHi: 'प्रशासन नियमावली',
    size: '14.20 MB',
    date: '2023-11-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'man-3',
    titleEn: 'Information Technology Audit Manual (ITAM) for Indian Audit & Accounts Department',
    titleHi: 'भारतीय लेखापरीक्षा और लेखा विभाग के लिए सूचना प्रौद्योगिकी लेखापरीक्षा नियमावली (आईटीएएम)',
    groupEn: 'Technical Manuals',
    groupHi: 'तकनीकी नियमावली',
    size: '12.60 MB',
    date: '2023-08-22',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'man-4',
    titleEn: 'Receipt Audit Manual (Direct & Indirect Taxes and Customs Audits)',
    titleHi: 'प्राप्ति लेखापरीक्षा नियमावली (प्रत्यक्ष और अप्रत्यक्ष कर तथा सीमा शुल्क लेखापरीक्षा)',
    groupEn: 'Receipt Audit Wing',
    groupHi: 'प्राप्ति लेखापरीक्षा विंग',
    size: '11.80 MB',
    date: '2023-04-18',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'man-5',
    titleEn: 'Commercial Audit Manual for Central and State Public Sector Undertakings',
    titleHi: 'केंद्रीय और राज्य सार्वजनिक क्षेत्र के उपक्रमों के लिए वाणिज्यिक लेखापरीक्षा नियमावली',
    groupEn: 'Commercial Audit Wing',
    groupHi: 'वाणिज्यिक लेखापरीक्षा विंग',
    size: '15.40 MB',
    date: '2022-12-05',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function ManualsPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Manuals"
      pageTitleHi="नियमावली (मैनुअल)"
      items={MANUALS_DOCS}
    />
  );
}
