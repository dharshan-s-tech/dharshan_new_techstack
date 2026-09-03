'use client';

import React, { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';
import cagPhoto from '@/app/Assets/Images/cc8a1a5614f48c98f397dcafcf38e8f22843dc2a.png';

export default function Details() {
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

  return (
    <section className="message-cag" data-node-id="356:17207" aria-label="Message from the Comptroller and Auditor General of India">
      <div className="message-cag__photo" data-node-id="356:17222">
        <img src={cagPhoto.src} alt="Shri K. Sanjay Murthy, Comptroller and Auditor General of India, signing documents" />
      </div>
      <div className="message-cag__card" data-node-id="356:17208">
        <div className="message-cag__divider" data-node-id="356:17209"></div>
        <h2 className="message-cag__heading" data-node-id="356:17218">
          {isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक का संदेश' : 'Message from the Comptroller and Auditor General of India'}
        </h2>
        <p className="message-cag__subheading" data-node-id="356:17219">
          {isHindi ? 'जवाबदेही को मजबूत करना। बेहतर शासन को सक्षम बनाना।' : 'Strengthening Accountability. Enabling Better Governance.'}
        </p>
        <p className="message-cag__body" data-node-id="356:17220">
          {isHindi 
            ? 'भारत के सर्वोच्च लेखापरीक्षा संस्थान के रूप में, हम सार्वजनिक प्रशासन में पारदर्शिता, सत्यनिष्ठा और जवाबदेही बनाए रखते हैं, संस्थानों में विश्वास को बढ़ावा देते हैं और राष्ट्र के लिए प्रभावी शासन में योगदान देते हैं।'
            : 'As India’s Supreme Audit Institution, we uphold transparency, integrity, and accountability in public administration, fostering trust in institutions and contributing to effective governance for the nation.'}
        </p>
        <p className="message-cag__name" data-node-id="356:17221">
          <strong>{isHindi ? 'श्री के. संजय मूर्ति' : 'Shri K. Sanjay Murthy'}</strong>
          <br />
          {isHindi ? 'भारत के नियंत्रक और महालेखापरीक्षक' : 'Comptroller and Auditor General of India'}
        </p>
      </div>
    </section>
  );
}
