'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

import image1 from '@/app/Assets/Images/17a8a6edf588630a0c7494a054fb34e604c4f41c.png';
import image2 from '@/app/Assets/Images/e2c5a3b888a0623426c634ce2f2bee016b8fb5ab.png';
import image3 from '@/app/Assets/Images/c4913da1b882a52fb7cb973a9d334b9abf2e253e.png';
import image4 from '@/app/Assets/Images/d14889fd29ae93bd23d9b51c4dad883e07f826bf.png';

interface Slide {
  image: string;
  engLine1: string;
  engLine2: string;
  engLine3: string;
  hinLine1: string;
  hinLine2: string;
  hinLine3: string;
  engSub: string;
  hinSub: string;
}

const SLIDES: Slide[] = [
  {
    image: image1.src,
    engLine1: 'Ensuring',
    engLine2: 'Transparency, Integrity & ',
    engLine3: 'Accountability',
    hinLine1: 'सुनिश्चित करना',
    hinLine2: 'पारदर्शिता, सत्यनिष्ठा और ',
    hinLine3: 'जवाबदेही',
    engSub: 'Access audit reports, accounts, and institutional resources from India’s Supreme Audit Institution.',
    hinSub: 'भारत के सर्वोच्च लेखापरीक्षा संस्थान से ऑडिट रिपोर्ट, खाते और संस्थागत संसाधन प्राप्त करें।'
  },
  {
    image: image2.src,
    engLine1: 'Empowering',
    engLine2: 'Good Governance & ',
    engLine3: 'Public Trust',
    hinLine1: 'सशक्त बनाना',
    hinLine2: 'सुशासन और ',
    hinLine3: 'जन विश्वास को',
    engSub: 'Providing independent assurance to all stakeholders that public funds are utilized efficiently.',
    hinSub: 'सभी हितधारकों को स्वतंत्र आश्वासन प्रदान करना कि सार्वजनिक धन का कुशलतापूर्वक उपयोग किया जा रहा है।'
  },
  {
    image: image3.src,
    engLine1: 'Leading',
    engLine2: 'Global Relations & ',
    engLine3: 'Audit Standards',
    hinLine1: 'नेतृत्व करना',
    hinLine2: 'वैश्विक संबंधों और ',
    hinLine3: 'लेखा परीक्षा मानकों का',
    engSub: 'Representing India at Supreme Audit Forums globally to shape modern public audit methodologies.',
    hinSub: 'आधुनिक सार्वजनिक लेखा परीक्षा पद्धतियों को आकार देने के लिए वैश्विक स्तर पर सर्वोच्च लेखा परीक्षा मंचों पर भारत का प्रतिनिधित्व करना।'
  },
  {
    image: image4.src,
    engLine1: 'Fostering',
    engLine2: 'Digital Auditing & ',
    engLine3: 'Data Analytics',
    hinLine1: 'बढ़ावा देना',
    hinLine2: 'डिजिटल ऑडिटिंग और ',
    hinLine3: 'डेटा एनालिटिक्स को',
    engSub: 'Leveraging artificial intelligence and big data tools to streamline auditing and fiscal oversight.',
    hinSub: 'लेखा परीक्षा और वित्तीय निरीक्षण को सुव्यवस्थित करने के लिए कृत्रिम बुद्धिमत्ता और बिग डेटा टूल का लाभ उठाना।'
  }
];

export default function HomeBanner() {
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [activePromo, setActivePromo] = useState<{ title: string; text: string } | null>(null);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const handlePromoClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    setActivePromo({
      title,
      text: isHindi
        ? `${title} के लिए आधिकारिक दिशा-निर्देश और जमा विवरण। प्रविष्टियां पात्र अकादमिक विद्वानों, शोधकर्ताओं और सार्वजनिक नीति के छात्रों के लिए खुली हैं। पंजीकरण और सारांश अपलोड करने की अंतिम तिथि 15 अक्टूबर, 2026 है। विवरण के लिए कृपया research-contest@cag.gov.in पर ईमेल करें।`
        : `Official guidelines and submission details for the ${title}. Submissions are open to eligible academic scholars, researchers, and public policy students. The deadline for registration and abstract upload is October 15, 2026. Please email research-contest@cag.gov.in for details.`
    });
  };

  const activeSlide = SLIDES[slideIndex];

  return (
    <>
      <section className="hero" data-node-id="356:17253" aria-label="Hero banner" style={{ position: 'relative' }}>
        {SLIDES.map((slide, idx) => (
          <img
            key={idx}
            src={slide.image}
            alt="Comptroller and Auditor General portal hero slide background"
            className="hero__bg"
            style={{
              opacity: slideIndex === idx ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1
            }}
          />
        ))}

        <div className="hero__overlay" style={{ zIndex: 2 }}></div>

        <div className="hero__content" data-node-id="356:17259" style={{ zIndex: 3 }}>
          <div className="hero__text-block" data-node-id="356:17260">
            <span className="hero__accent-line" data-node-id="356:17261"></span>
            <h1 className="hero__heading" data-node-id="356:17262" style={{ transition: 'all 0.5s ease-in-out' }}>
              <span className="hero__heading-line1">{isHindi ? activeSlide.hinLine1 : activeSlide.engLine1}</span>
              <span className="hero__heading-line2">{isHindi ? activeSlide.hinLine2 : activeSlide.engLine2}</span>
              <span className="hero__heading-line2 hero__heading-accent">{isHindi ? activeSlide.hinLine3 : activeSlide.engLine3}</span>
            </h1>
            <p className="hero__subtext" data-node-id="356:17263" style={{ transition: 'all 0.5s ease-in-out' }}>
              {isHindi ? activeSlide.hinSub : activeSlide.engSub}
            </p>
          </div>
          <div className="hero__ctas" data-node-id="356:17264">
            <Link href="/Reports" className="btn btn--white" data-node-id="356:17265">
              {isHindi ? 'रिपोर्ट देखें' : 'Explore Reports'}
            </Link>
            <Link href="/About/About-Us/Cag-Of-India" className="btn btn--outline-white" data-node-id="356:17266">
              {isHindi ? 'सीएजी के बारे में जानें' : 'Learn about CAG'}
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="hero__quick-link"
          aria-label="Quick links"
          aria-expanded={quickLinksOpen ? 'true' : 'false'}
          aria-controls="quick-links-popover"
          id="quick-links-trigger"
          data-node-id="356:17267"
          onClick={() => setQuickLinksOpen(!quickLinksOpen)}
          style={{ zIndex: 4 }}
        >
          <img src="/assets/15127c48fb77285b1afc7e3ee3fa785964fd244e.svg" alt="" />
        </button>

        {quickLinksOpen && (
          <div
            className="quick-links-popover"
            id="quick-links-popover"
            role="dialog"
            aria-label="Quick Links"
            data-node-id="177:18398"
            data-name="Quick Links"
            style={{ zIndex: 5 }}
          >
            <div className="quick-links-popover__header" data-node-id="177:18399">
              <p className="quick-links-popover__title" data-node-id="177:18400">
                {isHindi ? 'त्वरित लिंक' : 'Quick Links'}
              </p>
              <button
                type="button"
                className="quick-links-popover__close"
                id="quick-links-close"
                aria-label="Close"
                data-node-id="177:18401"
                onClick={() => setQuickLinksOpen(false)}
              >
                <img src="/assets/e9a1045ccbcca4a2eddc203691c9fb9e235abcaa.svg" alt="" />
              </button>
            </div>
            <Link href="/Reports/accounts" className="quick-links-popover__item quick-links-popover__item--featured" data-node-id="177:18405">
              <span>{isHindi ? 'राज्य वित्त' : 'State Finances'}</span>
              <img src="/assets/517691af6f71975297c0dea90934ffd1b080ef9f.svg" alt="" className="quick-links-popover__item-icon" />
            </Link>
            <a href="#" className="quick-links-popover__item" onClick={(e) => handlePromoClick(e, isHindi ? 'सीएजी - आईसीएसएसआर शोध लेख प्रतियोगिता (राष्ट्रीय स्तर)' : 'CAG - ICSSR Research Article Competition (National Level)')} data-node-id="177:18411">
              <span>{isHindi ? 'सीएजी - आईसीएसएसआर शोध लेख प्रतियोगिता (राष्ट्रीय स्तर)' : 'CAG - ICSSR Research Article Competition (National Level)'}</span>
            </a>
            <a href="#" className="quick-links-popover__item" onClick={(e) => handlePromoClick(e, isHindi ? 'सीएजी - आईसीएसएसआर शोध लेख प्रतियोगिता (राज्य/केंद्र शासित प्रदेश स्तर)' : 'CAG - ICSSR Research Article Competition (State/UT Level)')} data-node-id="177:18413">
              <span>{isHindi ? 'सीएजी - आईसीएसएसआर शोध लेख प्रतियोगिता (राज्य/केंद्र शासित प्रदेश स्तर)' : 'CAG - ICSSR Research Article Competition (State/UT Level)'}</span>
            </a>
          </div>
        )}

        <div className="hero__carousel" role="tablist" aria-label="Hero image carousel" data-node-id="356:17272" style={{ zIndex: 4 }}>
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={`hero__carousel-dot ${slideIndex === idx ? 'hero__carousel-dot--active' : ''} cursor-pointer`}
              role="tab"
              aria-selected={slideIndex === idx ? 'true' : 'false'}
              onClick={() => setSlideIndex(idx)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>
      </section>

      {activePromo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-xl w-full shadow-2xl relative">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#0a3d30]">
              <h3 className="font-bold text-white text-sm">{activePromo.title}</h3>
              <button
                onClick={() => setActivePromo(null)}
                className="text-white hover:text-zinc-300 font-bold text-sm cursor-pointer bg-transparent border-none"
              >
                ✕ {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
            <div className="p-6 text-sm text-zinc-700 leading-relaxed bg-[#fbfbfb]">
              {activePromo.text}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
