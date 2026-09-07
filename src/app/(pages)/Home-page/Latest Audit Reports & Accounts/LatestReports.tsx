'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

const HINDI_TRANSLATIONS: Record<string, { title: string; label: string; desc: string }> = {
  'rep-1': {
    title: 'ग्रामीण जिलों में स्वास्थ्य सेवाओं और पोलियो टीकाकरण प्रशासन पर लेखा परीक्षा रिपोर्ट',
    label: 'स्वास्थ्य लेखा परीक्षा',
    desc: 'टीका वितरण लॉजिस्टिक्स, प्राथमिक स्वास्थ्य केंद्र बुनियादी ढांचे और सार्वजनिक स्वास्थ्य कोष कार्यान्वयन की समीक्षा।'
  },
  'rep-2': {
    title: 'सीमा सुरक्षा खरीद और आधुनिकीकरण योजनाओं पर रक्षा लेखा परीक्षा रिपोर्ट',
    label: 'रक्षा लेखा परीक्षा',
    desc: 'सुरक्षा हार्डवेयर अधिग्रहण, सीमा बाड़ संरचनाओं और आधुनिक प्रणाली खरीद का विस्तृत अनुपालन मूल्यांकन।'
  },
  'rep-3': {
    title: 'भारतीय रेलवे सिग्नलिंग सिस्टम और आधुनिकीकरण योजनाओं पर निष्पादन लेखा परीक्षा',
    label: 'रेलवे लेखा परीक्षा',
    desc: 'बजट आवंटन, स्थापना समयसीमा और सिस्टम एकीकरण विश्वसनीयता जांच का मूल्यांकन करने वाले सिग्नलिंग आधुनिकीकरण परियोजनाओं की समीक्षा।'
  },
  'rep-4': {
    title: 'मेट्रो क्षेत्रों में प्रत्यक्ष कर प्राप्तियों और कॉर्पोरेट कर निर्धारण का अनुपालन ऑडिट',
    label: 'प्रत्यक्ष कर ऑडिट',
    desc: 'कॉर्पोरेट कर छूट, कर निर्धारण समयसीमा और प्रत्यक्ष प्राप्ति खातों की निकासी के अनुपालन का मूल्यांकन करने वाला ऑडिट।'
  },
  'rep-5': {
    title: 'नगर निगम राजस्व और संपत्ति कर निर्धारण पर लेखा परीक्षा रिपोर्ट',
    label: 'राजस्व ऑडिट',
    desc: 'स्थानीय संपत्ति कर निर्धारण, कर संग्रहकर्ताओं की दक्षता और नगर निगम विकास निधि वितरण की समीक्षा।'
  },
  'rep-6': {
    title: 'केंद्रीय उत्पाद शुल्क विभाग में सूचना प्रौद्योगिकी प्रणालियों का निष्पादन मूल्यांकन',
    label: 'उत्पाद शुल्क आईटी ऑडिट',
    desc: 'कस्टम सॉफ्टवेयर तैनाती, सर्वर सुरक्षा ढांचे और प्रसंस्करण प्रदर्शन मानदंडों की समीक्षा करने वाला ऑडिट।'
  },
  'home-rep-1': {
    title: 'बुनियादी ढांचा विकास और नगरपालिका ठोस कचरा प्रबंधन पर लेखा परीक्षा रिपोर्ट',
    label: 'नागरिक विकास',
    desc: 'नगर निगमों में शहरी बुनियादी ढांचा योजना, निधि उपयोग और अपशिष्ट उपचार संयंत्रों की व्यापक समीक्षा।'
  },
  'home-rep-2': {
    title: 'तमिलनाडु के तटीय जिलों में पर्यावरण प्रबंधन पर विषयगत लेखा परीक्षा',
    label: 'तमिलनाडु',
    desc: 'समुद्री प्रदूषण को रोकने, तटीय कटाव और सीआरजेड अधिसूचनाओं के कार्यान्वयन के लिए किए गए उपायों का आकलन।'
  },
  'home-rep-3': {
    title: 'आंध्र प्रदेश में सिंचाई योजनाओं और नहर नेटवर्क पर निष्पादन लेखा परीक्षा',
    label: 'आंध्र प्रदेश',
    desc: 'प्रमुख और मध्यम सिंचाई परियोजनाओं, कमान क्षेत्र विकास और पेयजल आपूर्ति प्रावधानों का मूल्यांकन।'
  }
};

export default function LatestReports() {
  const router = useRouter();

  const [allReports, setAllReports] = useState<any[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    const loadReportsData = () => {
      const reports = dataManager.getReports().filter(r => r.isFeatured);
      setAllReports(reports);
    };

    loadReportsData();
    setLang(dataManager.getLanguage());

    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('reportsChange', loadReportsData);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('reportsChange', loadReportsData);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const handlePrev = () => {
    setStartIndex((prev) => {
      if (allReports.length <= 3) return 0;
      return prev === 0 ? allReports.length - 3 : Math.max(0, prev - 1);
    });
  };

  const handleNext = () => {
    setStartIndex((prev) => {
      if (allReports.length <= 3) return 0;
      return prev + 3 >= allReports.length ? 0 : prev + 1;
    });
  };

  const visibleReports = allReports.slice(startIndex, startIndex + 3);
  const displayReports = visibleReports.length === 3 
    ? visibleReports 
    : (allReports.length > 3 
        ? [...visibleReports, ...allReports.slice(0, 3 - visibleReports.length)]
        : allReports);

  return (
    <section className="reports" data-node-id="356:17046" aria-labelledby="reports-heading">
      <div className="reports__inner" data-node-id="356:17048">
        <div className="reports__description" data-node-id="356:17049">
          <div>
            <h2 id="reports-heading" className="reports__heading" data-node-id="356:17051">
              {isHindi ? 'नवीनतम लेखा परीक्षा रिपोर्ट और खाते' : 'Latest Audit Reports & Accounts'}
            </h2>
            <p className="reports__text" data-node-id="356:17052">
              {isHindi 
                ? 'भारत के नियंत्रक और महालेखापरीक्षक द्वारा हाल ही में प्रकाशित लेखा परीक्षा रिपोर्टों, वित्तीय विवरणों और जवाबदेही समीक्षाओं का पता लगाएं।' 
                : 'Explore recently published audit reports, financial statements, and accountability reviews from the Comptroller and Auditor General of India.'}
            </p>
          </div>
          <Link href="/Reports" className="btn btn--outline-white reports__view-all" data-node-id="356:17053">
            {isHindi ? 'सभी देखें' : 'View All'}
          </Link>
        </div>

        <div className="reports__cards" data-node-id="356:17054">
          {displayReports.map((report) => {
            const details = isHindi && HINDI_TRANSLATIONS[report.id] ? HINDI_TRANSLATIONS[report.id] : {
              title: report.title,
              label: report.label || report.sector,
              desc: report.desc
            };

            return (
              <article 
                key={report.id} 
                className="report-card cursor-pointer" 
                data-node-id={report.id}
                onClick={() => router.push(`/Reports/${report.id}`)}
              >
                {/* 1. Card image: 50% */}
                <div className="report-card__banner" data-node-id="I356:17059;907:255">
                  <img 
                    src={typeof report.image === 'string' ? report.image : report.image.src} 
                    alt={details.title} 
                    className="report-card__photo" 
                  />
                  <span className="report-card__tag" data-node-id="I356:17059;907:256">
                    {report.tag || 'Text'}
                  </span>
                </div>

                {/* 2. Card body: 50% */}
                <div className="report-card__body" data-node-id="I356:17059;906:237">
                  {/* Meta row: 5% (Arrow + Category/State + Date) */}
                  <div className="report-card__meta" data-node-id="I356:17059;906:215">
                    <div className="report-card__meta-left">
                      <svg 
                        className="report-card__arrow-svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                      <span className="report-card__label" data-node-id="I356:17059;906:221">
                        {details.label}
                      </span>
                    </div>
                    <span className="report-card__date" data-node-id="I356:17059;1217:10557">
                      {report.date}
                    </span>
                  </div>

                  {/* Header: 30% (Title in bold) */}
                  <h3 className="report-card__title" data-node-id="I356:17059;906:234">
                    <Link href={`/Reports/${report.id}`} onClick={(e) => e.stopPropagation()}>
                      {details.title}
                    </Link>
                  </h3>

                  {/* Sub heading: 15% (Description) */}
                  <p className="report-card__desc" data-node-id="I356:17059;906:235">
                    {details.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Carousel controls matching Image 2 bottom-right */}
        <div className="reports__nav-controls">
          <button 
            type="button" 
            className="reports__nav-btn" 
            onClick={handlePrev} 
            aria-label={isHindi ? 'पिछली रिपोर्ट' : 'Previous reports'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <button 
            type="button" 
            className="reports__nav-btn" 
            onClick={handleNext} 
            aria-label={isHindi ? 'अगली रिपोर्ट' : 'Next reports'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
