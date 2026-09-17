'use client';

import React from 'react';
import PolicyPageTemplate, { ResourceDocumentItem } from '../PolicyPageTemplate';

const RTI_DOCS: ResourceDocumentItem[] = [
  {
    id: 'rti-1',
    titleEn: 'Right to Information (RTI) Act Proactive Disclosures under Section 4(1)(b)',
    titleHi: 'धारा 4(1)(ख) के अंतर्गत सूचना का अधिकार (आरटीआई) अधिनियम सक्रिय प्रकटीकरण',
    groupEn: 'Policy & Mandate',
    groupHi: 'नीति एवं अधिदेश',
    size: '4.80 MB',
    date: '2024-01-15',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rti-2',
    titleEn: 'List of Central Public Information Officers (CPIOs) and First Appellate Authorities (FAAs)',
    titleHi: 'केंद्रीय लोक सूचना अधिकारियों (सीपीआईओ) और प्रथम अपीलीय प्राधिकारियों (एफएए) की सूची',
    groupEn: 'Directory',
    groupHi: 'निर्देशिका',
    size: '2.10 MB',
    date: '2024-02-01',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rti-3',
    titleEn: 'Guidelines on Processing and Timely Disposal of RTI Applications and Appeals',
    titleHi: 'आरटीआई आवेदनों और अपीलों के प्रसंस्करण और समय पर निपटान पर दिशानिर्देश',
    groupEn: 'Operational Guidelines',
    groupHi: 'परिचालन दिशानिर्देश',
    size: '1.75 MB',
    date: '2023-10-12',
    fileUrl: '/assets/sample.pdf'
  },
  {
    id: 'rti-4',
    titleEn: 'Quarterly RTI Statistical Return and Disposal Summary (Latest Financial Year)',
    titleHi: 'त्रैमासिक आरटीआई सांख्यिकीय विवरण और निपटान सारांश',
    groupEn: 'Compliance Reports',
    groupHi: 'अनुपालन रिपोर्ट',
    size: '3.40 MB',
    date: '2023-08-20',
    fileUrl: '/assets/sample.pdf'
  }
];

export default function RightToInformationPolicyPage() {
  return (
    <PolicyPageTemplate
      categoryTitleEn="Resources"
      categoryTitleHi="संसाधन"
      pageTitleEn="Right to Information Policy"
      pageTitleHi="सूचना का अधिकार नीति"
      apiSlug="right-to-information-policy"
      items={RTI_DOCS}
    />
  );
}
