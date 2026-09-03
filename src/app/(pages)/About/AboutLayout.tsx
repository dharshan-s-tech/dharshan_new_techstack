'use client';

import React, { useState, useEffect, useRef } from 'react';
import AboutusSidemenu from '@/Reusable components/Side Menu/Aboutus_sidemenu/AboutusSidemenu';
import { dataManager } from '@/lib/dataManager';

const DICTIONARY: Record<string, string> = {
  // Page Titles (rendered inside AboutLayout h2)
  'Comptroller & Auditor General of India Profile': 'भारत के नियंत्रक एवं महालेखा परीक्षक की प्रोफाइल',
  'CAG of India': 'भारत के नियंत्रक और महालेखापरीक्षक',
  'Our Vision, Mission & Core Values': 'हमारा दृष्टिकोण, ध्येय और मूल मूल्य',
  'Organisation-Chart': 'संगठन चार्ट',
  'Former-Comptroller-and-Auditors-General': 'पूर्व सीएजी गैलरी',
  'History-of-Indian-Audit-ans-Accounts-Department': 'आईएएडी का इतिहास',
  'Audit-Advisory-Board': 'लेखा परीक्षा सलाहकार बोर्ड',
  'Constitutional-Provisions': 'संवैधानिक प्रावधान',
  'Duties-&-Powers-Act': 'कर्तव्य और शक्तियां अधिनियम',
  'Audit-Regulation': 'लेखा परीक्षा विनियम',
  'International-Relations': 'अंतर्राष्ट्रीय संबंध',

  // Constitutional Provisions Headings
  'Article 148 — Comptroller and Auditor-General of India': 'अनुच्छेद 148 — भारत के नियंत्रक और महालेखा परीक्षक',
  'Article 149 — Duties and Powers of the Comptroller and Auditor-General': 'अनुच्छेद 149 — नियंत्रक और महालेखा परीक्षक के कर्तव्य और शक्तियां',
  'Article 150 — Form of Accounts of The Union and of The States': 'अनुच्छेद 150 — संघ और राज्यों के खातों का प्रारूप',
  'Article 151 — Audit Reports': 'अनुच्छेद 151 — लेखा परीक्षा रिपोर्ट',
  'Article 279 — Calculation of "net proceeds", etc.': 'अनुच्छेद 279 — "शुद्ध आय" की गणना आदि।',

  // Duties & Powers Act Headings
  'Section 10 — Compilation of accounts of Union and States': 'धारा 10 — संघ और राज्यों के खातों का संकलन',
  'Section 13 — Audit of expenditure from Consolidated Fund': 'धारा 13 — संचित निधि से व्यय की लेखा परीक्षा',
  'Section 14 — Audit of receipts and expenditure of bodies financed by Govt': 'धारा 14 — सरकार द्वारा वित्तपोषित निकायों की प्राप्तियों और व्यय की लेखा परीक्षा',
  'Section 19 — Audit of Government Companies and Corporations': 'धारा 19 — सरकारी कंपनियों और निगमों की लेखा परीक्षा',

  // Audit Regulation Headings
  'Scope of Audit Regulations': 'लेखा परीक्षा विनियमों का दायरा',
  'Types of Audits conducted': 'आयोजित लेखा परीक्षा के प्रकार',
  'Reporting procedures and follow-up': 'रिपोर्टिंग प्रक्रियाएं और अनुवर्ती कार्रवाई',

  // History of IAAD Headings
  'Establishment of the Department (1858)': 'विभाग की स्थापना (1858)',
  'Constitutional Status (1950)': 'संवैधानिक स्थिति (1950)',
  'Modernization & Digitalization': 'आधुनिकीकरण और डिजिटलीकरण',

  // Audit Advisory Board Headings
  'Objective & Role': 'उद्देश्य और भूमिका',
  'Board Structure & Composition': 'बोर्ड संरचना और संगठन',
  'Advisory Scope & Influence': 'सलाहकार क्षेत्र और प्रभाव',

  // Organisation Chart Inside Content
  'The Comptroller and Auditor General of India leads the department. The organization functions through a hierarchy of senior executives overseeing audit fields:': 'भारत के नियंत्रक एवं महालेखा परीक्षक विभाग का नेतृत्व करते हैं। संगठन लेखा परीक्षा क्षेत्रों की देखरेख करने वाले वरिष्ठ अधिकारियों के पदानुक्रम के माध्यम से कार्य करता है:',
  'Deputy CAG (Reports & Central)': 'उप सीएजी (रिपोर्ट और केंद्रीय)',
  'Deputy CAG (State Accounts)': 'उप सीएजी (राज्य खाते)',
  'Accountants General (State Audits)': 'महालेखाकार (राज्य लेखा परीक्षा)',
  'Directors General (Central Audits)': 'महानिदेशक (केंद्रीय लेखा परीक्षा)',
  'Principal Directors (IT & Training)': 'प्रधान निदेशक (आईटी और प्रशिक्षण)',

  // Our Vision, Mission and Values Inside Content
  'Our Vision': 'हमारा दृष्टिकोण',
  'Promoting accountability, transparency and good governance through high quality auditing and accounting and provide independent assurance to our stakeholders, the Legislature, the Executive and the Public, that public funds are being used efficiently and for the intended purposes.': 'उच्च गुणवत्ता वाली लेखा परीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देना और हमारे हितधारकों, विधायिका, कार्यपालिका और जनता को स्वतंत्र आश्वासन प्रदान करना कि सार्वजनिक धन का कुशलतापूर्वक और इच्छित उद्देश्यों के लिए उपयोग किया जा रहा है।',
  'Our Mission': 'हमारा ध्येय',
  'We dedicate ourselves to promoting accountability, transparency and good governance through high quality auditing and accounting.': 'हम उच्च गुणवत्ता वाली लेखा परीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देने के लिए खुद को समर्पित करते हैं।',
  'Our Core Values': 'हमारे मूल मूल्य',
  'Independence, Objectivity, Integrity, Professional Excellence, Transparency, Positive Approach.': 'स्वतंत्रता, निष्पक्षता, सत्यनिष्ठा, व्यावसायिक उत्कृष्टता, पारदर्शिता, सकारात्मक दृष्टिकोण।'
};

export default function AboutLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());

    const translateDOM = () => {
      const currentLang = dataManager.getLanguage();
      setLang(currentLang);
      const isHindi = currentLang === 'हिन्दी';

      if (!containerRef.current) return;

      // Walk text nodes inside the container and replace matching English keys
      const walk = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walk.nextNode())) {
        const text = node.nodeValue || '';
        const trimmed = text.trim();
        
        // Find if this exact text exists in our dictionary
        if (trimmed && DICTIONARY[trimmed]) {
          const original = node.parentElement?.getAttribute('data-original-text') || text;
          if (node.parentElement && !node.parentElement.getAttribute('data-original-text')) {
            node.parentElement.setAttribute('data-original-text', original);
          }
          node.nodeValue = isHindi ? DICTIONARY[trimmed] : original;
        }
      }
    };

    translateDOM();
    window.addEventListener('languageChange', translateDOM);
    return () => window.removeEventListener('languageChange', translateDOM);
  }, [children]); // Re-run when layout children change

  const isHindi = lang === 'हिन्दी';
  const displayTitle = isHindi && DICTIONARY[title] ? DICTIONARY[title] : title;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" ref={containerRef}>
      <div className="about-layout flex flex-col lg:flex-row gap-10 items-start">
        <aside className="w-full lg:w-[310px] shrink-0">
          <AboutusSidemenu />
        </aside>
        <main className="about-content flex-grow w-full">
          <h2 className="text-[24px] font-bold text-[#751639] leading-[1.6] border-b border-[#e6e6e6] pb-4 mb-6 text-left">
            {displayTitle}
          </h2>
          <div className="text-zinc-700 leading-relaxed space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
