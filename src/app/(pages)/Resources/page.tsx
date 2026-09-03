'use client';

import React, { useState, useEffect } from 'react';
import NamesDetailsCard from '@/Reusable components/Cards/Names & Details Cards/NamesDetailsCard';
import { dataManager } from '@/lib/dataManager';

const ENGLISH_CATEGORIES = [
  {
    title: 'Audit Manuals & Technical Guides',
    content: 'Access official audit manuals including the Regulations on Audit & Accounts, MSO (Audit), IT Audit Manual, and Revenue Audit guides.',
    href: '#manuals'
  },
  {
    title: 'Guidance Notes & Accounting Standards',
    content: 'Explore guidance papers, accounting frameworks, and policy manuals issued by the GASAB (Government Accounting Standards Advisory Board).',
    href: '#standards'
  },
  {
    title: 'Gazette Notifications & Regulations',
    content: 'View historical gazette notifications, constitutional provisions (Articles 148-151), and official CAG mandates.',
    href: '#regulations'
  },
  {
    title: 'Departmental Circulars & Rules',
    content: 'Read internal IAAD circulars, recruitments regulations, staff orders, and administrative instructions.',
    href: '#circulars'
  }
];

const HINDI_CATEGORIES = [
  {
    title: 'लेखा परीक्षा नियमावली और तकनीकी गाइड',
    content: 'लेखा परीक्षा और खातों पर विनियम, एमएसओ (लेखा परीक्षा), आईटी लेखा परीक्षा नियमावली, और राजस्व लेखा परीक्षा गाइड सहित आधिकारिक लेखा परीक्षा नियमावली तक पहुंचें।',
    href: '#manuals'
  },
  {
    title: 'मार्गदर्शन नोट और लेखा मानक',
    content: 'GASAB (सरकारी लेखा मानक सलाहकार बोर्ड) द्वारा जारी मार्गदर्शन पत्रों, लेखांकन ढाँचे और नीति नियमावलियों का अन्वेषण करें।',
    href: '#standards'
  },
  {
    title: 'राजपत्र अधिसूचनाएं और विनियम',
    content: 'ऐतिहासिक राजपत्र अधिसूचनाएं, संवैधानिक प्रावधान (अनुच्छेद 148-151), और आधिकारिक सीएजी जनादेश देखें।',
    href: '#regulations'
  },
  {
    title: 'विभागीय परिपत्र और नियम',
    content: 'आंतरिक आईएएडी परिपत्र, भर्ती नियम, स्टाफ आदेश और प्रशासनिक निर्देश पढ़ें।',
    href: '#circulars'
  }
];

export default function ResourcesPage() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';
  const categories = isHindi ? HINDI_CATEGORIES : ENGLISH_CATEGORIES;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-[#e6e6e6] pb-4">
        <h2 className="text-3xl font-extrabold text-[#2a2a2a] tracking-tight">
          {isHindi ? 'संसाधन और पुस्तकालय' : 'Resources & Library'}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {isHindi ? 'आधिकारिक नियमावली निर्देश, लेखा प्रकाशन, और परिपत्र दस्तावेज पुस्तकालय।' : 'Official manual guides, accounting publications, and circular documents library.'}
        </p>
      </div>

      <section className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <NamesDetailsCard
              key={idx}
              title={cat.title}
              content={cat.content}
              href={cat.href}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
