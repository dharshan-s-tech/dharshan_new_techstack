'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

const POPUPS_DATA_HINDI: Record<string, string> = {
  'Audit Portal': 'ऑडिट पोर्टल अधिकृत सार्वजनिक क्षेत्र के अधिकारियों, केंद्रीय मंत्रालयों, राज्य विभाग के अधिकारियों और आईएएडी लेखा परीक्षकों को लेखा परीक्षा फाइलों को संकलित करने, जमा करने और मान्य करने के लिए सीमित पहुंच प्रदान करता है। कृपया अपने सरकारी स्मार्ट कार्ड टोकन कुंजी का उपयोग करके प्रमाणित करें।',
  'Statistics': 'सांख्यिकी विवरण और इंटरैक्टिव डैशबोर्ड पिछले वित्तीय दशक में सार्वजनिक व्यय, प्रस्तुत लेखा परीक्षा रिपोर्ट, सीए फर्मों के लेखा परीक्षा आवंटन और विभागीय भर्ती जनसांख्यिकी का संकलन करते हैं।',
  'Contacts': 'भारत के नियंत्रक और महालेखापरीक्षक का कार्यालय\nपता: पॉकेट-9, दीन दयाल उपाध्याय मार्ग, नई दिल्ली - 110124\nसहायता हॉटलाइन: +91-11-23235790\nसामान्य ईमेल: cagoffice@cag.gov.in\nकार्यालय समय: सुबह 9:00 बजे से शाम 5:30 बजे तक (सोमवार से शुक्रवार)'
};

const POPUPS_DATA_ENGLISH: Record<string, string> = {
  'Audit Portal': 'The Audit Portal provides restricted access to authorized public sector officials, central ministries, state department officers, and IA&AD auditors for compiling, submitting, and validating audit files. Please authenticate using your government smart card token key.',
  'Statistics': 'Statistical overview and interactive dashboards compiling public expenditure, audit reports tabled, CA firms audit allocations, and departmental recruitment demographics over the past financial decade.',
  'Contacts': 'Office of the Comptroller and Auditor General of India\nAddress: Pocket-9, Deen Dayal Upadhyaya Marg, New Delhi - 110124\nSupport Hotline: +91-11-23235790\nGeneral Email: cagoffice@cag.gov.in\nOffice Hours: 9:00 AM - 5:30 PM (Monday to Friday)'
};

export default function WhoWeAre() {
  const [activePopup, setActivePopup] = useState<{ title: string; text: string } | null>(null);
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

  const handleLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    const popupTitle = isHindi ? (title === 'Audit Portal' ? 'लेखा परीक्षा पोर्टल' : title === 'Statistics' ? 'सांख्यिकी' : title === 'Contacts' ? 'संपर्क विवरण' : title) : title;
    const text = isHindi ? (POPUPS_DATA_HINDI[title] || 'विवरण वर्तमान में अनुपलब्ध है।') : (POPUPS_DATA_ENGLISH[title] || 'This is a mock description.');
    setActivePopup({ title: popupTitle, text });
  };

  return (
    <>
      <section className="most-viewed" data-node-id="356:17074" aria-labelledby="most-viewed-heading">
        <h2 id="most-viewed-heading" className="section-heading" data-node-id="356:17075">
          {isHindi ? 'सर्वाधिक देखे गए' : 'Most Viewed'}
        </h2>
        <div className="quick-links" data-node-id="356:17076">
          <Link href="/Reports" className="quick-link" data-node-id="356:17083">
            <div className="quick-link__icon-wrap">
              <img src="/assets/59d09d67fc097dcb3fe6785027400d737b662e4c.svg" alt="Latest Reports icon" className="quick-link__icon quick-link__icon--white-base" />
            </div>
            <p className="quick-link__label" data-node-id="356:17095">
              {isHindi ? 'नवीनतम रिपोर्ट' : 'Latest Reports'}
            </p>
          </Link>
          <a href="#" className="quick-link" onClick={(e) => handleLinkClick(e, 'Audit Portal')} data-node-id="356:17096">
            <div className="quick-link__icon-wrap">
              <img src="/assets/audit-portal.svg" alt="Audit Portal icon" className="quick-link__icon quick-link__icon--audit" />
            </div>
            <p className="quick-link__label" data-node-id="356:17113">
              {isHindi ? 'लेखा परीक्षा पोर्टल' : 'Audit Portal'}
            </p>
          </a>
          <Link href="/Reports/accounts" className="quick-link" data-node-id="356:17114">
            <div className="quick-link__icon-wrap">
              <img src="/assets/accounts-report.png" alt="Accounts icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17118">
              {isHindi ? 'लेखा' : 'Accounts'}
            </p>
          </Link>
          <a href="#" className="quick-link" onClick={(e) => handleLinkClick(e, 'Statistics')} data-node-id="356:17119">
            <div className="quick-link__icon-wrap">
              <img src="/assets/a34af813ad6761ed67820237129e6e411ff04a5a.svg" alt="Statistics icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17123">
              {isHindi ? 'सांख्यिकी' : 'Statistics'}
            </p>
          </a>
          <Link href="/Resources" className="quick-link" data-node-id="356:17124">
            <div className="quick-link__icon-wrap">
              <img src="/assets/3ab96faf3d3790b7f5862061b13bb6914a1bfa1b.svg" alt="Publications icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17131">
              {isHindi ? 'प्रकाशन' : 'Publications'}
            </p>
          </Link>
          <a href="#" className="quick-link" onClick={(e) => handleLinkClick(e, 'Contacts')} data-node-id="356:17132">
            <div className="quick-link__icon-wrap">
              <img src="/assets/ceb241f04f51cb67fb186ff34019423212969457.svg" alt="Contacts icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17136">
              {isHindi ? 'संपर्क' : 'Contacts'}
            </p>
          </a>
        </div>
      </section>

      {/* Horizontal Divider between Most Viewed and Who We Are (Line 1576) */}
      <div className="home-section-divider" data-node-id="356:17137"></div>

      <section className="who-we-are" data-node-id="356:17138" aria-labelledby="who-we-are-heading">
        <div className="who-we-are__intro" data-node-id="356:17140">
          <h2 id="who-we-are-heading" className="section-heading" data-node-id="356:17141">
            {isHindi ? 'हम कौन हैं' : 'Who We Are'}
          </h2>
          <p className="section-subtext" data-node-id="356:17142">
            {isHindi 
              ? 'भारत के नियंत्रक और महालेखापरीक्षक सभी सरकारी राजस्व और व्यय के ऑडिट के लिए जिम्मेदार एक स्वतंत्र सर्वोच्च लेखा परीक्षा संस्थान हैं।'
              : 'The Comptroller and Auditor General of India is an independent supreme audit institution responsible for auditing all government revenues and expenditures.'}
          </p>
        </div>
        <div className="who-we-are__details" data-node-id="356:17143">
          <div className="cag-cards" data-node-id="356:17144">
            <Link href="/About/About-Us/Constitutional-Provisions" className="cag-card cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block" data-node-id="356:17148">
              <div className="cag-card__icon">
                <img src="/assets/6482d2822bc16f1e27c743aba1a1d5efe9974975.svg" alt="Constitutional Role icon" />
              </div>
              <div className="cag-card__divider"></div>
              <div className="cag-card__details">
                <h3 className="cag-card__title">{isHindi ? 'संवैधानिक भूमिका' : 'Constitutional Role'}</h3>
                <p className="cag-card__desc">
                  {isHindi 
                    ? 'सार्वजनिक वित्त के संरक्षक के रूप में भारतीय संविधान के अनुच्छेद 148 के तहत नियुक्त किया गया।'
                    : 'Appointed under Article 148 of the Indian Constitution as guardian of public finances.'}
                </p>
              </div>
            </Link>
            <Link href="/About/About-Us/Our-Vision,-Mission-&-Core-Values" className="cag-card cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block" data-node-id="356:17152">
              <div className="cag-card__icon">
                <img src="/assets/d296a6454ef5b1d6927204433862eee4294545d4.svg" alt="Our Mission icon" />
              </div>
              <div className="cag-card__divider"></div>
              <div className="cag-card__details">
                <h3 className="cag-card__title">{isHindi ? 'हमारा मिशन' : 'Our Mission'}</h3>
                <p className="cag-card__desc">
                  {isHindi 
                    ? 'पारदर्शिता, जवाबदेही और दक्षता सुनिश्चित करने वाले व्यापक ऑडिट आयोजित करना।'
                    : 'To conduct comprehensive audits ensuring transparency, accountability, and efficiency.'}
                </p>
              </div>
            </Link>
            <Link href="/About/Index-Menu-About/Global-relations/Association%20with%20INTOSAI" className="cag-card cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block" data-node-id="356:17156">
              <div className="cag-card__icon">
                <img src="/assets/d8fd77ee881f90073f924df1844719ec722ec892.svg" alt="Global Standards icon" />
              </div>
              <div className="cag-card__divider"></div>
              <div className="cag-card__details">
                <h3 className="cag-card__title">{isHindi ? 'वैश्विक मानक' : 'Global Standards'}</h3>
                <p className="cag-card__desc">
                  {isHindi 
                    ? 'सर्वोच्च लेखा परीक्षा संस्थानों के अंतर्राष्ट्रीय मानकों और सर्वोत्तम प्रथाओं का पालन करना।'
                    : 'Following International Standards of Supreme Audit Institutions and best practices.'}
                </p>
              </div>
            </Link>
            <Link href="/About/About-Us/Cag-Of-India" className="cag-card cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block" data-node-id="356:17161">
              <div className="cag-card__icon">
                <img src="/assets/c432a5b68483c46d01761b0880d7551cd6d812f2.svg" alt="Performance Audits icon" />
              </div>
              <div className="cag-card__divider"></div>
              <div className="cag-card__details">
                <h3 className="cag-card__title">{isHindi ? 'निष्पादन लेखा परीक्षा' : 'Performance Audits'}</h3>
                <p className="cag-card__desc">
                  {isHindi 
                    ? 'वित्तीय अनुपालन से परे, हम अर्थव्यवस्था, दक्षता और प्रभावशीलता के लिए कार्यक्रमों का ऑडिट करते हैं।'
                    : 'Beyond financial compliance, we audit programs for economy, efficiency, and effectiveness.'}
                </p>
              </div>
            </Link>
          </div>
          <Link href="/About/About-Us/Our-Vision,-Mission-&-Core-Values" className="btn btn--outline-dark" data-node-id="356:17162">
            {isHindi ? 'अधिक जानें' : 'Learn More'}
          </Link>
        </div>
      </section>

      <section className="stats" data-node-id="356:17163" aria-label="Key statistics">
        <div className="stats__inner" data-node-id="356:17165">
          <div className="stat" data-node-id="356:17166">
            <img src="/assets/eebeff0eb4acf32e821992e39ae1a96ca7d9bf95.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17173">150+</p>
            <p className="stat__caption" data-node-id="356:17175">
              {isHindi ? <>उत्कृष्टता के वर्ष<br />स्थापना 1858</> : <>Years of excellence<br />Founded in 1858</>}
            </p>
          </div>
          <div className="stat" data-node-id="356:17176">
            <img src="/assets/4ac162869e8195d293791744857e765655519102.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17182">700+</p>
            <p className="stat__caption" data-node-id="356:17184">
              {isHindi ? 'संसद में सालाना पेश की जाने वाली रिपोर्ट' : <>Reports tabled In<br />Parliament annually</>}
            </p>
          </div>
          <div className="stat" data-node-id="356:17185">
            <img src="/assets/966e437fa2336aee29c529b12cc4d949d9cfae00.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17190">28+</p>
            <p className="stat__caption" data-node-id="356:17192">
              {isHindi ? <>राज्य लेखा परीक्षा कार्यालय<br />अखिल भारतीय उपस्थिति</> : <>State audit offices<br />Pan-India average</>}
            </p>
          </div>
          <div className="stat" data-node-id="356:17193">
            <img src="/assets/1f82b2a28cc40a20776e4b740699bded23f2f91c.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17204">700+</p>
            <p className="stat__caption" data-node-id="356:17206">
              {isHindi ? 'अधिकारी एवं कर्मचारी आईएएडी कार्यबल' : <>Officers &amp; Staff IAAD<br />workforce</>}
            </p>
          </div>
        </div>
      </section>

      {activePopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-xl w-full shadow-2xl relative border border-zinc-200">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#0a3d30]">
              <h3 className="font-bold text-white text-sm">{activePopup.title}</h3>
              <button 
                onClick={() => setActivePopup(null)}
                className="text-white hover:text-zinc-300 font-bold text-sm cursor-pointer bg-transparent border-none"
              >
                ✕ {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
            <div className="p-6 text-sm text-zinc-700 leading-relaxed whitespace-pre-line bg-[#fbfbfb]">
              {activePopup.text}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
