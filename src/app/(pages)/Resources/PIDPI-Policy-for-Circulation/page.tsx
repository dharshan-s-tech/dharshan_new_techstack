'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const PIDPI_DOCS: ResourceDocumentItem[] = [
  {
    id: 'pidpi-1',
    titleEn: 'Public Interest Disclosure and Protection of Informers (PIDPI) Resolution Guidelines',
    titleHi: 'जनहित प्रकटीकरण एवं मुखबिर संरक्षण (पीआईडीपीआई) संकल्प दिशानिर्देश',
    groupEn: 'Vigilance & Integrity',
    groupHi: 'सतर्कता एवं सत्यनिष्ठा',
    size: '3.70 MB',
    date: '2024-01-20',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pidpi-2',
    titleEn: 'Procedure for Lodging Complaints under PIDPI Resolution and Confidentiality Protocols',
    titleHi: 'पीआईडीपीआई संकल्प के तहत शिकायत दर्ज करने की प्रक्रिया और गोपनीयता प्रोटोकॉल',
    groupEn: 'Complaint Protocols',
    groupHi: 'शिकायत प्रोटोकॉल',
    size: '2.15 MB',
    date: '2023-09-14',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'pidpi-3',
    titleEn: 'Circular on Protection of Whistleblowers and Prevention of Victimization',
    titleHi: 'व्हिसलब्लोअर संरक्षण और प्रताड़ना की रोकथाम पर परिपत्र',
    groupEn: 'Administrative Directives',
    groupHi: 'प्रशासनिक निर्देश',
    size: '1.85 MB',
    date: '2023-04-10',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function PidpiPolicyPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="PIDPI Policy for Circulation"
      pageTitleHi="प्रसार के लिए पीआईडीपीआई नीति"
      apiSlug="pidpi-policy-for-circulation"
      items={PIDPI_DOCS}
    />
  );
}
