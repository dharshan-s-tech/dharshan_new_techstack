'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const STANDING_ORDERS_DOCS: ResourceDocumentItem[] = [
  {
    id: 'so-1',
    titleEn: 'Standing Order on Preparation and Finalization of Audit Reports',
    titleHi: 'लेखापरीक्षा रिपोर्टों की तैयारी और अंतिम रूप देने पर स्थायी आदेश',
    groupEn: 'Audit Practice Directives',
    groupHi: 'लेखापरीक्षा अभ्यास निर्देश',
    size: '4.10 MB',
    date: '2024-01-10',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'so-2',
    titleEn: 'Standing Order on Quality Control and Assurance Framework across Field Offices',
    titleHi: 'क्षेत्रीय कार्यालयों में गुणवत्ता नियंत्रण और आश्वासन ढांचे पर स्थायी आदेश',
    groupEn: 'Quality Management',
    groupHi: 'गुणवत्ता प्रबंधन',
    size: '3.65 MB',
    date: '2023-11-25',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'so-3',
    titleEn: 'Standing Order on Digital Audit Workflows and One IAAD One System (OIOS) Mandates',
    titleHi: 'डिजिटल लेखापरीक्षा कार्यप्रवाह और वन आईएएडी वन सिस्टम (ओआईओएस) जनादेश पर स्थायी आदेश',
    groupEn: 'IT & Digital Transformation',
    groupHi: 'आईटी और डिजिटल परिवर्तन',
    size: '5.20 MB',
    date: '2023-08-14',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'so-4',
    titleEn: 'Standing Order on Documentation, Working Papers, and Evidence Retention in Audits',
    titleHi: 'लेखापरीक्षा में प्रलेखन, कार्य पत्र और साक्ष्य प्रतिधारण पर स्थायी आदेश',
    groupEn: 'Compliance Guidelines',
    groupHi: 'अनुपालन दिशानिर्देश',
    size: '2.90 MB',
    date: '2023-04-02',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function StandingOrdersPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Standing Orders"
      pageTitleHi="स्थायी आदेश"
      items={STANDING_ORDERS_DOCS}
    />
  );
}
