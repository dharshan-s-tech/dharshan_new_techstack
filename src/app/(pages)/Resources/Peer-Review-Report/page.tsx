'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const PEER_REVIEW_DOCS: ResourceDocumentItem[] = [
  {
    id: 'pr-1',
    titleEn: 'International Peer Review Report on the SAI India by SAI Canada & SAI South Africa',
    titleHi: 'साई कनाडा और साई दक्षिण अफ्रीका द्वारा साई भारत पर अंतर्राष्ट्रीय पीयर रिव्यू रिपोर्ट',
    groupEn: 'Global Peer Review Evaluations',
    groupHi: 'वैश्विक पीयर समीक्षा मूल्यांकन',
    size: '8.60 MB',
    date: '2023-11-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pr-2',
    titleEn: 'Executive Summary and Implementation Action Matrix for Peer Review Findings',
    titleHi: 'पीयर समीक्षा निष्कर्षों के लिए कार्यकारी सारांश और कार्यान्वयन कार्य मैट्रिक्स',
    groupEn: 'Action Matrix',
    groupHi: 'कार्य योजना मैट्रिक्स',
    size: '3.20 MB',
    date: '2023-12-05',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pr-3',
    titleEn: 'Previous International Peer Review Report of SAI India (Historical Evaluation)',
    titleHi: 'साई भारत की पूर्व अंतर्राष्ट्रीय पीयर रिव्यू रिपोर्ट (ऐतिहासिक मूल्यांकन)',
    groupEn: 'Archived Reviews',
    groupHi: 'पुरालेख समीक्षाएं',
    size: '7.40 MB',
    date: '2019-08-10',
    fileUrl: '/assets/sample.pdf',
    isArchived: true
  }
];

export default function PeerReviewReportPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Peer Review Report"
      pageTitleHi="पीयर रिव्यू रिपोर्ट"
      apiSlug="peer-review-report"
      items={PEER_REVIEW_DOCS}
    />
  );
}
