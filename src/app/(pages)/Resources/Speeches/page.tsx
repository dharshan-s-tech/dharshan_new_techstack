'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const SPEECHES_DOCS: ResourceDocumentItem[] = [
  {
    id: 'sp-1',
    titleEn: 'Address by the Comptroller and Auditor General of India at the 16th ASOSAI Assembly',
    titleHi: '16वीं एएसओएसएआई असेंबली में भारत के नियंत्रक एवं महालेखापरीक्षक का संबोधन',
    groupEn: 'International Addresses',
    groupHi: 'अंतर्राष्ट्रीय संबोधन',
    size: '2.40 MB',
    date: '2024-05-18',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'sp-2',
    titleEn: 'Keynote Speech at the National Conference of Accountants General on Digital Transformation',
    titleHi: 'डिजिटल परिवर्तन पर महालेखाकारों के राष्ट्रीय सम्मेलन में मुख्य भाषण',
    groupEn: 'Keynote Addresses',
    groupHi: 'मुख्य भाषण',
    size: '1.95 MB',
    date: '2024-03-08',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'sp-3',
    titleEn: 'Inaugural Address at the National Academy of Audit and Accounts (NAAA) Convocation',
    titleHi: 'राष्ट्रीय लेखापरीक्षा एवं लेखा अकादमी (एनएएए) दीक्षांत समारोह में उद्घाटन भाषण',
    groupEn: 'Academic & Training Addresses',
    groupHi: 'अकादमिक एवं प्रशिक्षण संबोधन',
    size: '2.15 MB',
    date: '2023-12-14',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'sp-4',
    titleEn: 'Address on Public Accountability and Good Governance at the Indian Institute of Public Administration',
    titleHi: 'भारतीय लोक प्रशासन संस्थान में सार्वजनिक जवाबदेही और सुशासन पर संबोधन',
    groupEn: 'Public Lectures',
    groupHi: 'सार्वजनिक व्याख्यान',
    size: '1.80 MB',
    date: '2023-09-22',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function SpeechesPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Speeches"
      pageTitleHi="भाषण एवं वक्तव्य"
      apiSlug="speeches"
      items={SPEECHES_DOCS}
    />
  );
}
