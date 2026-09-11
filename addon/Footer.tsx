'use client';

import React, { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<{ title: string; text: string } | null>(null);
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

  const policiesDataEnglish: Record<string, string> = {
    'Terms & Conditions': 'These terms govern the use of the official portal of the Comptroller and Auditor General of India. All contents provided on this website are for informational purposes only. The department reserves the right to make modifications to the site contents at any time without notice.',
    'Privacy Policy': 'We respect your privacy. This portal does not collect personal identifiers from visitors. Any information provided voluntarily via query logs or contact forms is kept confidential and processed solely for administrative responses.',
    'Copyright Policy': 'Material featured on this portal may be reproduced free of charge in any format or media without requiring specific permission. This is subject to the material being reproduced accurately and not being used in a derogatory manner or in a misleading context.',
    'Hyperlinking Policy': 'Prior permission is required before hyperlinks are directed from any website to this portal. To obtain permission, please submit a query stating the nature of content on the destination site and the URL of links.',
    'Accessibility Statement': 'We are committed to ensuring that the CAG India portal is accessible to all users, regardless of device, technology, or ability. It has been built with guidelines for web content accessibility (WCAG 2.0 AA compliance).',
    'Archive': 'The Archive section stores historical audit publications, union account reviews, and circular manuals dating back over the past decade. Use the search index filters to view archived files.',
    'Sitemap': 'The Sitemap lists the structural tree hierarchy of the portal, indexing home sliders, about us subpages, reports search, and careers recruitment streams.',
    'Help': 'For any technical assistance, download instructions, or website navigation help, please contact our web support team or refer to the FAQs section.',
    'FAQs': 'Frequently Asked Questions (FAQs) cover reports tabling schedules, CAs empanelment timelines, recruitments exam syllabi, and administrative procedures.',
    'Contact Us': 'Office of the Comptroller and Auditor General of India\nAddress: Pocket-9, Deen Dayal Upadhyaya Marg, New Delhi - 110124\nPhone: +91-11-23235790\nEmail: cagoffice@cag.gov.in',
    'Web Information Manager': 'The Web Information Manager manages all portal publications, asset revisions, and accessibility feedback. Contact: webmanager-cag@cag.gov.in'
  };

  const policiesDataHindi: Record<string, string> = {
    'Terms & Conditions': 'ये शर्तें भारत के नियंत्रक और महालेखा परीक्षक के आधिकारिक पोर्टल के उपयोग को नियंत्रित करती हैं। इस वेबसाइट पर प्रदान की गई सभी सामग्री केवल सूचनात्मक उद्देश्यों के लिए है। विभाग बिना किसी सूचना के किसी भी समय साइट की सामग्री में संशोधन करने का अधिकार सुरक्षित रखता है।',
    'Privacy Policy': 'हम आपकी गोपनीयता का सम्मान करते हैं। यह पोर्टल आगंतुकों से व्यक्तिगत पहचानकर्ता एकत्र नहीं करता है। क्वेरी लॉग या संपर्क फ़ॉर्म के माध्यम से स्वेच्छा से प्रदान की गई कोई भी जानकारी गोपनीय रखी जाती है और केवल प्रशासनिक प्रतिक्रियाओं के लिए संसाधित की जाती है।',
    'Copyright Policy': 'इस पोर्टल पर प्रदर्शित सामग्री को बिना किसी विशिष्ट अनुमति के किसी भी प्रारूप या मीडिया में निःशुल्क पुनरुत्पादित किया जा सकता है। यह सामग्री के सटीक रूप से पुनरुत्पादित होने और अपमानजनक तरीके से या भ्रामक संदर्भ में उपयोग न किए जाने के अधीन है।',
    'Hyperlinking Policy': 'इस पोर्टल पर किसी भी वेबसाइट से हाइपरलिंक निर्देशित करने से पहले पूर्व अनुमति आवश्यक है। अनुमति प्राप्त करने के लिए, कृपया गंतव्य साइट पर सामग्री की प्रकृति और लिंक के यूआरएल को बताते हुए एक प्रश्न सबमिट करें।',
    'Accessibility Statement': 'हम यह सुनिश्चित करने के लिए प्रतिबद्ध हैं कि सीएजी इंडिया पोर्टल सभी उपयोगकर्ताओं के लिए सुलभ हो, चाहे उनका डिवाइस, तकनीक या क्षमता कुछ भी हो। इसे वेब सामग्री पहुंच दिशानिर्देशों (WCAG 2.0 AA अनुपालन) के साथ बनाया गया है।',
    'Archive': 'अभिलेखागार अनुभाग पिछले एक दशक के ऐतिहासिक लेखा परीक्षा प्रकाशनों, संघ खाता समीक्षाओं और परिपत्र पुस्तिकाओं को संग्रहीत करता है। संग्रहीत फ़ाइलें देखने के लिए खोज अनुक्रमणिका फ़िल्टर का उपयोग करें।',
    'Sitemap': 'साइटमैप पोर्टल के संरचनात्मक पदानुक्रम को सूचीबद्ध करता है, जिसमें होम स्लाइडर्स, हमारे बारे में उप-पृष्ठ, रिपोर्ट खोज और करियर भर्ती शामिल हैं।',
    'Help': 'किसी भी तकनीकी सहायता, डाउनलोड निर्देश, या वेबसाइट नेविगेशन सहायता के लिए, कृपया हमारी वेब सहायता टीम से संपर्क करें या अक्सर पूछे जाने वाले प्रश्न (FAQs) अनुभाग देखें।',
    'FAQs': 'अक्सर पूछे जाने वाले प्रश्न (FAQs) रिपोर्ट पेश करने के कार्यक्रम, सीए पैनलमेंट समयसीमा, भर्ती परीक्षा पाठ्यक्रम और प्रशासनिक प्रक्रियाओं को कवर करते हैं।',
    'Contact Us': 'भारत के नियंत्रक एवं महालेखा परीक्षक का कार्यालय\nपता: पॉकेट-9, दीन दयाल उपाध्याय मार्ग, नई दिल्ली - 110124\nफोन: +91-11-23235790\nईमेल: cagoffice@cag.gov.in',
    'Web Information Manager': 'वेब सूचना प्रबंधक सभी पोर्टल प्रकाशनों, परिसंपत्ति संशोधनों और पहुंच प्रतिक्रिया का प्रबंधन करता है। संपर्क करें: webmanager-cag@cag.gov.in'
  };

  const handlePolicyClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    const policiesData = isHindi ? policiesDataHindi : policiesDataEnglish;
    const text = policiesData[title] || 'This is a mock description detailing institutional guidelines and policies for the Comptroller and Auditor General of India portal.';
    setActivePolicy({ title, text });
  };

  return (
    <>
      <footer className="site-footer" data-node-id="0_5" data-name="Footer">
        <div className="site-footer__row">
          <div className="site-footer__logo">
            <img 
              src="/assets/a72ec713c358ecb4dbb439440d7b3ccd8e29e8ca.png" 
              alt="Comptroller and Auditor General of India crest" 
              className="site-footer__crest" 
            />
            <div className="site-footer__logo-text">
              <p>{isHindi ? 'भारत के नियंत्रक एवं महालेखा परीक्षक' : 'Comptroller and Auditor General of india'}</p>
              <p>{isHindi ? 'भारत के सर्वोच्च लेखा परीक्षा संस्थान' : 'Supreme Audit Institution of india'}</p>
            </div>
          </div>
          <div className="site-footer__divider" aria-hidden="true"></div>
          <nav className="site-footer__links" aria-label="Policies">
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Terms & Conditions')}>
              {isHindi ? 'नियम और शर्तें' : 'Terms & Conditions'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Privacy Policy')}>
              {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Copyright Policy')}>
              {isHindi ? 'कॉपीराइट नीति' : 'Copyright Policy'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Hyperlinking Policy')}>
              {isHindi ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Accessibility Statement')}>
              {isHindi ? 'पहुंच विवरण' : 'Accessibility Statement'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Archive')}>
              {isHindi ? 'अभिलेखागार' : 'Archive'}
            </a>
          </nav>
          <div className="site-footer__divider" aria-hidden="true"></div>
          <nav className="site-footer__links" aria-label="Site resources">
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Sitemap')}>
              {isHindi ? 'साइटमैप' : 'Sitemap'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Help')}>
              {isHindi ? 'सहायता' : 'Help'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'FAQs')}>
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' : 'FAQs'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Contact Us')}>
              {isHindi ? 'संपर्क करें' : 'Contact Us'}
            </a>
            <a href="#" onClick={(e) => handlePolicyClick(e, 'Web Information Manager')}>
              {isHindi ? 'वेब सूचना प्रबंधक' : 'Web Information Manager'}
            </a>
            <a href="/login" className="font-semibold text-[#751639] hover:underline">
              {isHindi ? 'एडमिन लॉगिन' : 'Admin Login'}
            </a>
          </nav>
          <div className="site-footer__divider" aria-hidden="true"></div>
          <div className="site-footer__updated">
            <p className="site-footer__updated-label">
              {isHindi ? 'अंतिम अद्यतन: 06/07/2026' : 'Last Updated: 06/07/2026'}
            </p>
            <img 
              src="/assets/f679b6981977fe76b3284bb41dc2d56cb8022644.png" 
              alt="india.gov.in — The National Portal of India" 
              className="site-footer__badge" 
            />
          </div>
        </div>
        <p className="site-footer__social">
          <a href="#">
            {isHindi ? 'सीएजी के सोशल मीडिया अकाउंट के लिए यहां क्लिक करें' : 'Click here for Social Media Account of the CAG'}
          </a>
        </p>
        <p className="site-footer__copyright">
          {isHindi 
            ? `कॉपीराइट © ${new Date().getFullYear()}. भारत के नियंत्रक एवं महालेखा परीक्षक। सर्वाधिकार सुरक्षित।`
            : `Copyright © ${new Date().getFullYear()}. Comptroller and Auditor General of India. All rights reserved.`
          }
        </p>
      </footer>

      {/* Policy Overlay Modal */}
      {activePolicy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-xl w-full shadow-2xl relative">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#751639]">
              <h3 className="font-bold text-white text-sm">
                {isHindi && activePolicy.title === 'Terms & Conditions' ? 'नियम और शर्तें' :
                 isHindi && activePolicy.title === 'Privacy Policy' ? 'गोपनीयता नीति' :
                 isHindi && activePolicy.title === 'Copyright Policy' ? 'कॉपीराइट नीति' :
                 isHindi && activePolicy.title === 'Hyperlinking Policy' ? 'हाइपरलिंकिंग नीति' :
                 isHindi && activePolicy.title === 'Accessibility Statement' ? 'पहुंच विवरण' :
                 isHindi && activePolicy.title === 'Archive' ? 'अभिलेखागार' :
                 isHindi && activePolicy.title === 'Sitemap' ? 'साइटमैप' :
                 isHindi && activePolicy.title === 'Help' ? 'सहायता' :
                 isHindi && activePolicy.title === 'FAQs' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' :
                 isHindi && activePolicy.title === 'Contact Us' ? 'संपर्क करें' :
                 isHindi && activePolicy.title === 'Web Information Manager' ? 'वेब सूचना प्रबंधक' :
                 activePolicy.title}
              </h3>
              <button 
                onClick={() => setActivePolicy(null)}
                className="text-white hover:text-zinc-300 font-bold text-sm cursor-pointer bg-transparent border-none"
              >
                {isHindi ? '✕ बंद करें' : '✕ Close'}
              </button>
            </div>
            <div className="p-6 text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
              {activePolicy.text}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
