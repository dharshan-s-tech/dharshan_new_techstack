'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const STATE_PSU_DOCS: ResourceDocumentItem[] = [
  {
    id: 'psu-1',
    titleEn: 'Status of Financial Accounts and Audit of State Public Sector Undertakings (PSUs) - All States Summary',
    titleHi: 'राज्य सार्वजनिक क्षेत्र के उपक्रमों (पीएसयू) के वित्तीय खातों एवं लेखापरीक्षा की स्थिति - सभी राज्यों का सारांश',
    groupEn: 'State Accounts Compendium',
    groupHi: 'राज्य लेखा संग्रह',
    size: '9.80 MB',
    date: '2024-04-12',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'psu-2',
    titleEn: 'Overview of Functioning, Return on Investment, and Arrears in Accounts of State Government Companies',
    titleHi: 'राज्य सरकार की कंपनियों के खातों में कार्यप्रणाली, निवेश पर लाभ और बकाये का अवलोकन',
    groupEn: 'Commercial Audit Wing',
    groupHi: 'वाणिज्यिक लेखापरीक्षा विंग',
    size: '6.40 MB',
    date: '2023-10-30',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'psu-3',
    titleEn: 'Arrears in Finalization of Annual Accounts by State PSUs and Restructuring Recommendations',
    titleHi: 'राज्य सार्वजनिक उपक्रमों द्वारा वार्षिक खातों को अंतिम रूप देने में बकाया और पुनर्गठन सिफारिशें',
    groupEn: 'Analytical Studies',
    groupHi: 'विश्लेषणात्मक अध्ययन',
    size: '5.15 MB',
    date: '2023-05-22',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function StatusOfAccountsOfStatePSUsPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Status of Accounts of State PSUs"
      pageTitleHi="राज्य सार्वजनिक उपक्रमों के खातों की स्थिति"
      items={STATE_PSU_DOCS}
    />
  );
}
