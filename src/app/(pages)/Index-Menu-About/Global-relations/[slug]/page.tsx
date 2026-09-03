'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

interface PageData {
  title: string;
  group: string;
  logo: string;
  description: string;
}

const GLOBAL_RELATIONS_DATA: Record<string, PageData> = {
  'association with intosai': {
    title: 'Association with INTOSAI',
    group: 'International Bodies',
    logo: 'intosai-logo.svg',
    description: 'SAI India is a prominent member of the International Organization of Supreme Audit Institutions (INTOSAI), contributing actively to its governing board and technical committees.'
  },
  'association with asosai': {
    title: 'Association with ASOSAI',
    group: 'International Bodies',
    logo: 'asosai-logo.png',
    description: 'SAI India actively engages with the Asian Organization of Supreme Audit Institutions (ASOSAI), promoting knowledge sharing and professional capacity building among Asian SAIs.'
  },
  'multilateral engagement': {
    title: 'Multilateral Engagement',
    group: 'International Bodies',
    logo: 'multilateral-logo.png',
    description: 'Engaging in international forums and cooperative audits to address global audit challenges and share innovative methodologies.'
  },
  'bilateral relations': {
    title: 'Bilateral Relations',
    group: 'Bilateral Relations',
    logo: 'bilateral-logo.png',
    description: 'SAI India maintains bilateral ties and memoranda of understanding (MoUs) with numerous audit institutions worldwide for mutual exchange programs.'
  },
  'un panel of external auditors': {
    title: 'UN Panel of External Auditors',
    group: 'Audit Engagements',
    logo: 'un-logo.png',
    description: 'SAI India is an active member of the United Nations Panel of External Auditors, playing a key role in setting audit standards for international organizations.'
  },
  'present international audits': {
    title: 'Present International Audits',
    group: 'Audit Engagements',
    logo: 'present-logo.png',
    description: 'Ongoing audit assignments of global organizations, international tribunals, and UN agencies conducted by the officers of SAI India.'
  },
  'past international audits': {
    title: 'Past International Audits',
    group: 'Audit Engagements',
    logo: 'past-logo.png',
    description: 'A summary gallery of historical audit engagements conducted by SAI India for the World Health Organization, Food and Agriculture Organization, and other bodies.'
  },
  'overseas audit offices': {
    title: 'Overseas Audit Offices',
    group: 'Audit Engagements',
    logo: 'overseas-logo.png',
    description: 'SAI India operates dedicated overseas audit offices (including London and Washington) to coordinate audits of diplomatic missions and state entities abroad.'
  },
  'iced': {
    title: 'International Centre for Environment Audit and Sustainable Development (iCED)',
    group: 'Training Institutes',
    logo: 'iced-logo.png',
    description: 'Located in Jaipur, iCED is a global hub for training in environmental auditing and sustainable development under the auspices of INTOSAI.'
  },
  'icisa': {
    title: 'International Centre for Information Systems and Audit (iCISA)',
    group: 'Training Institutes',
    logo: 'icisa-logo.png',
    description: 'iCISA is a premier institute offering international training programs in information systems audit and data analytics for global auditors.'
  },
  'naaa': {
    title: 'National Academy of Audit & Accounts (NAAA)',
    group: 'Training Institutes',
    logo: 'naaa-logo.png',
    description: 'Located in Shimla, NAAA is the apex training institution for the officers of the Indian Audit & Accounts Service (IA&AS).'
  },
  'ical': {
    title: 'International Centre for Audit of Local Governance (iCAL)',
    group: 'Training Institutes',
    logo: 'ical-logo.png',
    description: 'iCAL focuses on capacity building, research, and audit methodologies for local self-government institutions (panchayats and municipalities).'
  },
  'international relations wing': {
    title: 'International Relations Wing',
    group: 'Contact',
    logo: 'contact-logo.png',
    description: 'Get in touch with the International Relations Wing of the CAG of India for partnership proposals, training inquiries, or global delegations.'
  }
};

const HINDI_GLOBAL_RELATIONS_DATA: Record<string, PageData> = {
  'association with intosai': {
    title: 'INTOSAI के साथ जुड़ाव',
    group: 'अंतर्राष्ट्रीय निकाय',
    logo: 'intosai-logo.svg',
    description: 'SAI भारत सुप्रीम ऑडिट संस्थानों के अंतर्राष्ट्रीय संगठन (INTOSAI) का एक प्रमुख सदस्य है, जो इसके शासी बोर्ड और तकनीकी समितियों में सक्रिय रूप से योगदान देता है।'
  },
  'association with asosai': {
    title: 'ASOSAI के साथ जुड़ाव',
    group: 'अंतर्राष्ट्रीय निकाय',
    logo: 'asosai-logo.png',
    description: 'SAI भारत एशियाई सर्वोच्च लेखा परीक्षा संस्थानों के संगठन (ASOSAI) के साथ सक्रिय रूप से जुड़ता है, और एशियाई लेखा परीक्षा संस्थानों के बीच ज्ञान साझा करने और पेशेवर क्षमता निर्माण को बढ़ावा देता है।'
  },
  'multilateral engagement': {
    title: 'बहुपक्षीय सहभागिता',
    group: 'अंतर्राष्ट्रीय निकाय',
    logo: 'multilateral-logo.png',
    description: 'वैश्विक लेखा परीक्षा चुनौतियों का समाधान करने और नवीन पद्धतियों को साझा करने के लिए अंतर्राष्ट्रीय मंचों और सहकारी लेखा परीक्षाओं में भाग लेना।'
  },
  'bilateral relations': {
    title: 'द्विपक्षीय संबंध',
    group: 'द्विपक्षीय संबंध',
    logo: 'bilateral-logo.png',
    description: 'SAI भारत आपसी विनिमय कार्यक्रमों के लिए दुनिया भर में कई लेखा परीक्षा संस्थानों के साथ द्विपक्षीय संबंध और समझौता ज्ञापन (MoUs) बनाए रखता है।'
  },
  'un panel of external auditors': {
    title: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल',
    group: 'लेखा परीक्षा सहभागिता',
    logo: 'un-logo.png',
    description: 'SAI भारत बाह्य लेखा परीक्षकों के संयुक्त राष्ट्र पैनल का एक सक्रिय सदस्य है, जो अंतर्राष्ट्रीय संगठनों के लिए लेखा परीक्षा मानकों को स्थापित करने में महत्वपूर्ण भूमिका निभाता है।'
  },
  'present international audits': {
    title: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा',
    group: 'लेखा परीक्षा सहभागिता',
    logo: 'present-logo.png',
    description: 'वैश्विक संगठनों, अंतर्राष्ट्रीय न्यायाधिकरणों और संयुक्त राष्ट्र एजेंसियों के चल रहे लेखा परीक्षा कार्य, जो SAI भारत के अधिकारियों द्वारा किए जाते हैं।'
  },
  'past international audits': {
    title: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा',
    group: 'लेखा परीक्षा सहभागिता',
    logo: 'past-logo.png',
    description: 'विश्व स्वास्थ्य संगठन, खाद्य एवं कृषि संगठन और अन्य निकायों के लिए SAI भारत द्वारा आयोजित ऐतिहासिक लेखा परीक्षा कार्यों की एक संक्षिप्त गैलरी।'
  },
  'overseas audit offices': {
    title: 'विदेशी लेखा परीक्षा कार्यालय',
    group: 'लेखा परीक्षा सहभागिता',
    logo: 'overseas-logo.png',
    description: 'विदेशों में राजनयिक मिशनों और राज्य संस्थाओं के लेखा परीक्षा समन्वय के लिए SAI भारत समर्पित विदेशी लेखा परीक्षा कार्यालय (लंदन और वाशिंगटन सहित) संचालित करता है।'
  },
  'iced': {
    title: 'पर्यावरण लेखा परीक्षा और सतत विकास के लिए अंतर्राष्ट्रीय केंद्र (iCED)',
    group: 'प्रशिक्षण संस्थान',
    logo: 'iced-logo.png',
    description: 'जयपुर में स्थित, iCED पर्यावरण लेखा परीक्षा और सतत विकास में प्रशिक्षण के लिए INTOSAI के तत्वावधान में एक वैश्विक केंद्र है।'
  },
  'icisa': {
    title: 'सूचना प्रणाली और लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCISA)',
    group: 'प्रशिक्षण संस्थान',
    logo: 'icisa-logo.png',
    description: 'iCISA वैश्विक लेखा परीक्षकों के लिए सूचना प्रणाली लेखा परीक्षा और डेटा एनालिटिक्स में अंतर्राष्ट्रीय प्रशिक्षण कार्यक्रम प्रदान करने वाला एक प्रमुख संस्थान है।'
  },
  'naaa': {
    title: 'राष्ट्रीय लेखा परीक्षा और लेखा अकादमी (NAAA)',
    group: 'प्रशिक्षण संस्थान',
    logo: 'naaa-logo.png',
    description: 'शिमला में स्थित, NAAA भारतीय लेखा परीक्षा और लेखा सेवा (IA&AS) के अधिकारियों के लिए सर्वोच्च प्रशिक्षण संस्थान है।'
  },
  'ical': {
    title: 'स्थानीय शासन के लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCAL)',
    group: 'प्रशिक्षण संस्थान',
    logo: 'ical-logo.png',
    description: 'iCAL स्थानीय स्वशासन संस्थानों (पंचायतों और नगर पालिकाओं) के लिए क्षमता निर्माण, अनुसंधान और लेखा परीक्षा पद्धतियों पर केंद्रित है।'
  },
  'international relations wing': {
    title: 'अंतर्राष्ट्रीय संबंध विंग',
    group: 'संपर्क',
    logo: 'contact-logo.png',
    description: 'साझेदारी प्रस्तावों, प्रशिक्षण पूछताछ या वैश्विक प्रतिनिधिमंडलों के लिए भारत के सीएजी के अंतर्राष्ट्रीय संबंध विंग से संपर्क करें।'
  }
};

interface SidebarGroup {
  heading: string;
  hindiHeading: string;
  links: { name: string; hindiName: string; slug: string }[];
}

export default function GlobalRelationsDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slugDecoded = decodeURIComponent(resolvedParams.slug).toLowerCase();
  
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
  const pageData = isHindi ? HINDI_GLOBAL_RELATIONS_DATA[slugDecoded] : GLOBAL_RELATIONS_DATA[slugDecoded];

  if (!pageData) {
    notFound();
  }

  const groups: SidebarGroup[] = [
    {
      heading: 'International Bodies',
      hindiHeading: 'अंतर्राष्ट्रीय निकाय',
      links: [
        { name: 'Association with INTOSAI', hindiName: 'INTOSAI के साथ जुड़ाव', slug: 'association with intosai' },
        { name: 'Association with ASOSAI', hindiName: 'ASOSAI के साथ जुड़ाव', slug: 'association with asosai' },
        { name: 'Multilateral Engagement', hindiName: 'बहुपक्षीय सहभागिता', slug: 'multilateral engagement' }
      ]
    },
    {
      heading: 'Bilateral Relations',
      hindiHeading: 'द्विपक्षीय संबंध',
      links: [
        { name: 'Bilateral Relations', hindiName: 'द्विपक्षीय संबंध', slug: 'bilateral relations' }
      ]
    },
    {
      heading: 'Audit Engagements',
      hindiHeading: 'लेखा परीक्षा सहभागिता',
      links: [
        { name: 'UN Panel of External Auditors', hindiName: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल', slug: 'un panel of external auditors' },
        { name: 'Present International Audits', hindiName: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा', slug: 'present international audits' },
        { name: 'Past International Audits', hindiName: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा', slug: 'past international audits' },
        { name: 'Overseas Audit Offices', hindiName: 'विदेशी लेखा परीक्षा कार्यालय', slug: 'overseas audit offices' }
      ]
    },
    {
      heading: 'Training Institutes',
      hindiHeading: 'प्रशिक्षण संस्थान',
      links: [
        { name: 'iCED', hindiName: 'iCED', slug: 'iced' },
        { name: 'iCISA', hindiName: 'iCISA', slug: 'icisa' },
        { name: 'NAAA', hindiName: 'NAAA', slug: 'naaa' },
        { name: 'iCAL', hindiName: 'iCAL', slug: 'ical' }
      ]
    },
    {
      heading: 'Contact',
      hindiHeading: 'संपर्क',
      links: [
        { name: 'International Relations Wing', hindiName: 'अंतर्राष्ट्रीय संबंध विंग', slug: 'international relations wing' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs mb-8" aria-label="Breadcrumb">
        <ol className="breadcrumbs__trail flex items-center gap-2 text-xs text-zinc-500">
          <li><Link href="/">{isHindi ? 'गृह' : 'Home'}</Link></li>
          <li className="breadcrumbs__sep" aria-hidden="true">&gt;</li>
          <li><span>{isHindi ? 'वैश्विक संबंध' : 'Global Relations'}</span></li>
          <li className="breadcrumbs__sep" aria-hidden="true">&gt;</li>
          <li className="breadcrumbs__current text-[#751639] font-semibold">{pageData.title}</li>
        </ol>
      </nav>

      {/* Hero Banner */}
      <div className="gr-hero">
        <div className="gr-hero__swoosh" aria-hidden="true"></div>
        <h1 className="gr-hero__title text-left">{pageData.title}</h1>
        <div className="gr-hero__logo-box">
          <span className="text-white text-xs font-bold uppercase">{pageData.group.substring(0, 3)}</span>
        </div>
      </div>

      <div className="about-layout flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="about-sidebar w-full lg:w-80 shrink-0">
          <h2 className="about-sidebar__heading text-left text-lg font-bold border-b border-[#e6e6e6] pb-2 mb-4">
            {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
          </h2>
          <div className="about-sidebar__menus">
            {groups.map((grp, idx) => (
              <div key={idx}>
                <p className="about-sidebar__group-heading text-left">
                  {isHindi ? grp.hindiHeading : grp.heading}
                </p>
                <div className="about-sidebar__sublist">
                  {grp.links.map((link) => {
                    const isActive = slugDecoded === link.slug;
                    return (
                      <Link
                        key={link.slug}
                        href={`/About/Index-Menu-About/Global-relations/${encodeURIComponent(link.name)}`}
                        className={`about-sidebar__link ${isActive ? 'about-sidebar__link--active' : ''}`}
                      >
                        {isHindi ? link.hindiName : link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="about-content flex-grow w-full bg-white border border-[#e6e6e6] rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-zinc-800 border-b border-zinc-200 pb-3 mb-6 text-left">
            {isHindi ? 'विवरण' : 'Overview'}
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed text-left">
            {pageData.description}
          </p>
        </main>
      </div>
    </div>
  );
}
