'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const RAJBHASHA_DOCS: ResourceDocumentItem[] = [
  {
    id: 'rb-2024-1',
    titleEn: 'Rajbhasha e-Patrika - Issue 24 (January - June 2024)',
    titleHi: 'राजभाषा ई-पत्रिका - अंक 24 (जनवरी - जून 2024)',
    groupEn: 'Official Language Publications',
    groupHi: 'राजभाषा प्रकाशन',
    size: '6.80 MB',
    date: '2024-06-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rb-2023-2',
    titleEn: 'Rajbhasha e-Patrika - Issue 23 (July - December 2023)',
    titleHi: 'राजभाषा ई-पत्रिका - अंक 23 (जुलाई - दिसंबर 2023)',
    groupEn: 'Official Language Publications',
    groupHi: 'राजभाषा प्रकाशन',
    size: '6.20 MB',
    date: '2023-12-20',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rb-2023-1',
    titleEn: 'Rajbhasha e-Patrika - Issue 22 (January - June 2023)',
    titleHi: 'राजभाषा ई-पत्रिका - अंक 22 (जनवरी - जून 2023)',
    groupEn: 'Official Language Publications',
    groupHi: 'राजभाषा प्रकाशन',
    size: '5.90 MB',
    date: '2023-06-10',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rb-special',
    titleEn: 'Special Hindi Fortnight Commemorative Edition - IAAD Literatures & Articles',
    titleHi: 'विशेष हिन्दी पखवाड़ा स्मारक संस्करण - आईएएडी साहित्य एवं आलेख',
    groupEn: 'Special Editions',
    groupHi: 'विशेष संस्करण',
    size: '7.50 MB',
    date: '2023-09-30',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function RajbhashaEPatrikaPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Rajbhasha e-Patrika"
      pageTitleHi="राजभाषा ई-पत्रिका"
      items={RAJBHASHA_DOCS}
    />
  );
}
