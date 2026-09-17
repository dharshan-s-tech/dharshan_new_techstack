'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const SOCIAL_MEDIA_DOCS: ResourceDocumentItem[] = [
  {
    id: 'smp-1',
    titleEn: 'Official Social Media Policy for Indian Audit and Accounts Department (IAAD)',
    titleHi: 'भारतीय लेखापरीक्षा और लेखा विभाग (आईएएडी) के लिए आधिकारिक सोशल मीडिया नीति',
    groupEn: 'Digital Engagement Guidelines',
    groupHi: 'डिजिटल सहभागिता दिशानिर्देश',
    size: '2.40 MB',
    date: '2024-02-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'smp-2',
    titleEn: 'Code of Conduct for Personnel Using Social Media Platforms',
    titleHi: 'सोशल मीडिया प्लेटफॉर्म का उपयोग करने वाले कर्मियों के लिए आचार संहिता',
    groupEn: 'Staff Ethics & Conduct',
    groupHi: 'कर्मचारी आचार संहिता',
    size: '1.95 MB',
    date: '2023-11-05',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'smp-3',
    titleEn: 'Guidelines on Brand Representation, Media Statements & Official Handles',
    titleHi: 'ब्रांड प्रतिनिधित्व, मीडिया वक्तव्य और आधिकारिक हैंडल पर दिशानिर्देश',
    groupEn: 'Public Relations',
    groupHi: 'जनसंपर्क',
    size: '3.10 MB',
    date: '2023-05-18',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function SocialMediaPolicyPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Social Media Policy"
      pageTitleHi="सोशल मीडिया नीति"
      apiSlug="social-media-policy"
      items={SOCIAL_MEDIA_DOCS}
    />
  );
}
