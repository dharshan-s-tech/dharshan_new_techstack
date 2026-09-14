'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const PRESS_RELEASES_DOCS: ResourceDocumentItem[] = [
  {
    id: 'pr-1',
    titleEn: 'Press Release: CAG of India chairs ASOSAI Governing Board Meeting on Environmental Accountability',
    titleHi: 'प्रेस विज्ञप्ति: भारत के सीएजी ने पर्यावरणीय जवाबदेही पर एएसओएसएआई गवर्निंग बोर्ड की बैठक की अध्यक्षता की',
    groupEn: 'Official Press Statements',
    groupHi: 'आधिकारिक प्रेस वक्तव्य',
    size: '1.45 MB',
    date: '2024-06-12',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pr-2',
    titleEn: 'Press Release: Tabling of Union Audit Reports on Railway Infrastructure & Ministry of Defence in Parliament',
    titleHi: 'प्रेस विज्ञप्ति: संसद में रेलवे अवसंरचना और रक्षा मंत्रालय पर केंद्रीय लेखापरीक्षा रिपोर्ट पेश',
    groupEn: 'Report Announcements',
    groupHi: 'रिपोर्ट घोषणाएं',
    size: '1.80 MB',
    date: '2024-04-05',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pr-3',
    titleEn: 'Press Release: SAI India signs bilateral MoU with SAI Brazil on AI Audit Collaboration',
    titleHi: 'प्रेस विज्ञप्ति: साई भारत ने एआई लेखापरीक्षा सहयोग पर साई ब्राजील के साथ द्विपक्षीय समझौता ज्ञापन पर हस्ताक्षर किए',
    groupEn: 'International Engagements',
    groupHi: 'अंतर्राष्ट्रीय सहभागिता',
    size: '1.20 MB',
    date: '2024-02-18',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pr-4',
    titleEn: 'Press Release: National Audit Day Commemoration and Presentation of Merit Awards to Officers',
    titleHi: 'प्रेस विज्ञप्ति: राष्ट्रीय लेखापरीक्षा दिवस समारोह और अधिकारियों को मेरिट पुरस्कार प्रदान',
    groupEn: 'Institutional Events',
    groupHi: 'संस्थागत कार्यक्रम',
    size: '2.10 MB',
    date: '2023-11-16',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function PressReleasesPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Press Releases"
      pageTitleHi="प्रेस विज्ञप्तियां"
      apiSlug="press-releases"
      items={PRESS_RELEASES_DOCS}
    />
  );
}
