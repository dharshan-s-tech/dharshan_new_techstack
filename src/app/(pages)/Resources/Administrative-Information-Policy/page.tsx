'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const ADMIN_INFO_DOCS: ResourceDocumentItem[] = [
  {
    id: 'aip-1',
    titleEn: 'Policy on Administrative Information Sharing and Institutional Transparency',
    titleHi: 'प्रशासनिक सूचना साझाकरण एवं संस्थागत पारदर्शिता पर नीति',
    groupEn: 'Administrative Instructions',
    groupHi: 'प्रशासनिक निर्देश',
    size: '3.60 MB',
    date: '2024-03-01',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'aip-2',
    titleEn: 'Framework for Classification and Handling of Official Records in IAAD',
    titleHi: 'आईएएडी में आधिकारिक अभिलेखों के वर्गीकरण एवं प्रबंधन के लिए रूपरेखा',
    groupEn: 'Record Management',
    groupHi: 'अभिलेख प्रबंधन',
    size: '4.15 MB',
    date: '2023-12-10',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'aip-3',
    titleEn: 'Standard Operating Procedure (SOP) for Inter-Departmental Information Requests',
    titleHi: 'अंतर-विभागीय सूचना अनुरोधों के लिए मानक संचालन प्रक्रिया (एसओपी)',
    groupEn: 'Standard Operating Procedures',
    groupHi: 'मानक संचालन प्रक्रिया',
    size: '2.80 MB',
    date: '2023-07-15',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function AdministrativeInformationPolicyPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Administrative Information Policy"
      pageTitleHi="प्रशासनिक सूचना नीति"
      apiSlug="administrative-information-policy"
      items={ADMIN_INFO_DOCS}
    />
  );
}
