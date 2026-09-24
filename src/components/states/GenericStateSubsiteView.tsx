'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import StateSubsiteHeader from '@/components/states/StateSubsiteHeader';
import StateSubsiteFooter from '@/components/states/StateSubsiteFooter';

interface GenericStateSubsiteViewProps {
  prefix?: 'ae' | 'ag';
  initialSlug?: string;
}

export default function GenericStateSubsiteView({
  prefix = 'ae',
  initialSlug
}: GenericStateSubsiteViewProps) {
  const params = useParams();
  const rawStateSlug = initialSlug || (typeof params?.state === 'string' ? params.state : Array.isArray(params?.state) ? params.state[0] : 'andhra-pradesh');
  const stateSlug = decodeURIComponent(rawStateSlug || 'andhra-pradesh').toLowerCase();

  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [subsiteData, setSubsiteData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'whatsNew' | 'tenders'>('whatsNew');
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    api.getStateSubsite(stateSlug).then((data) => {
      if (data) setSubsiteData(data);
    });
  }, [stateSlug]);

  const isHindi = lang === 'हिन्दी';

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'English' ? 'हिन्दी' : 'English'));
  };

  const stateDisplayName = subsiteData?.state_name || stateSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Authentic Banners for AP / State Subsite
  const defaultApBanners = [
    { id: 1, title: 'Principal Accountant General (A&E), Andhra Pradesh', image_url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1740395947.jpg' },
    { id: 2, title: 'State Accounts & Entitlements', image_url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1740476857.jpg' },
    { id: 3, title: 'General Provident Fund & Pension Services', image_url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1740477242.jpg' },
    { id: 4, title: 'CAG Andhra Pradesh State Portal', image_url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/banner/banner-1740477718.jpg' }
  ];

  const bannersList = Array.isArray(subsiteData?.banners) && subsiteData.banners.length > 0
    ? subsiteData.banners
    : stateSlug === 'andhra-pradesh'
      ? defaultApBanners
      : subsiteData?.state_image_url
        ? [{ id: 1, title: stateDisplayName, image_url: subsiteData.state_image_url }]
        : defaultApBanners;

  useEffect(() => {
    if (bannersList.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % bannersList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannersList.length]);

  const isAudit = prefix === 'ag';
  const defaultOfficePrefixEn = isAudit ? 'Principal Accountant General (Audit),' : 'Principal Accountant General (A&E),';
  const defaultOfficePrefixHi = isAudit ? 'प्रधान महालेखाकार (लेखापरीक्षा),' : 'प्रधान महालेखाकार (लेखा एवं हकदारी),';

  // Live AP Portal Content Texts
  const t = {
    officePrefix: isHindi ? defaultOfficePrefixHi : defaultOfficePrefixEn,
    officeLocation: isHindi ? (subsiteData?.office_title_hi || stateDisplayName) : (subsiteData?.office_title || stateDisplayName),
    heroEnsuring: isHindi ? 'सुनिश्चित करना' : 'Ensuring',
    heroTitleLine1: isHindi ? 'पारदर्शिता, सत्यनिष्ठा एवं' : 'Transparency, Integrity &',
    heroTitleLine2: isHindi ? 'जवाबदेही' : 'Accountability',
    heroSubtitle: isHindi
      ? 'भारत की सर्वोच्च लेखापरीक्षा संस्था से लेखापरीक्षा रिपोर्ट, खाते और संस्थागत संसाधन प्राप्त करें।'
      : "Access audit reports, accounts, and institutional resources from India's Supreme Audit Institution.",
    heroBtn1: isHindi ? 'रिपोर्ट देखें' : 'Explore Reports',
    heroBtn2: isHindi ? 'सीएजी के बारे में जानें' : 'Learn about CAG',
    
    // 1. Pension
    pensionTitle: isHindi ? `पेंशन के बारे में` : `About Pension`,
    pensionDesc: isHindi
      ? `प्रधान महालेखाकार (लेखा एवं हकदारी) निम्नलिखित श्रेणियों के लिए पेंशनरी लाभों को अधिकृत करता है:\n1. एपी आरपीआर नियम, 1980 के तहत आने वाले राज्य सरकार के कर्मचारी\n2. आंध्र प्रदेश कैडर के एआईएस अधिकारी\n3. संवैधानिक प्राधिकारी जैसे माननीय उच्च न्यायालय के न्यायाधीश, लोकायुक्त\n4. स्वतंत्रता सेनानी पेंशन`
      : `The PAG (A&E) authorises the pensionary benefits for the following categories:\n1. State Government employees covered under the AP RPR Rules, 1980\n2. AIS officers borne on the Andhra Pradesh cadre (excepting those who have opted to receive their pensions from the Central Pension Payment Authority).\n3. Constitutional authorities such as Hon'ble Judges of the AP High Court, Lok Ayukta and AP Administrative Tribunal, Members of AP Public Service Commission\n4. Political (Freedom Fighters) Pensions`,
    pensionCardTitle: isHindi ? 'अपनी पेंशन मामले की स्थिति जानें' : 'Know your Pension Case Status',
    pensionCardLink: 'https://agaeap.cag.gov.in/Pension/Home',
    readMore: isHindi ? 'और पढ़ें' : 'Read More',
    
    // 2. GPF
    gpfTitle: isHindi ? `सामान्य भविष्य निधि के बारे में` : `About General Provident Fund`,
    gpfDesc: isHindi
      ? `प्रधान महालेखाकार (लेखा एवं हकदारी) जीपीएफ (एपी) नियम 1935 और एआईएस (पीएफ) नियम 1955 में निहित नियमों और प्रक्रियाओं के अनुसार एपी राज्य सरकार के लगभग 2.29 लाख कर्मचारियों के व्यक्तिगत जीपीएफ खातों का रखरखाव करता है। कार्यालय में भविष्य निधि समूह का नेतृत्व उप महालेखाकार रैंक के आईए एवं एएस अधिकारी द्वारा किया जाता है।`
      : `The Principal Accountant General (A&E) maintains the individual GPF accounts of nearly 2.29 lakh employees of the AP State Governments as per the rules and procedures contained in the GPF (AP) Rules 1935 and AIS (PF) Rules 1955 respectively.\nThe Provident Fund Group in the Office is headed by an IA & AS Officer in the rank of Deputy Accountant General who is assisted by Accounts Officers.`,
    gpfCardTitle: isHindi ? 'जीपीएफ वार्षिक खाता विवरण' : 'GPF Annual Account Statements',
    gpfCardLink: 'https://ag.ap.nic.in/slipsgpf.aspx',
    
    // 3. Account
    accountTitle: isHindi ? 'लेखा (खाता)' : 'About Account',
    accountDesc: isHindi
      ? `इस कार्यालय के लेखा समूह का नेतृत्व उप महालेखाकार (डीआईजी/वरिष्ठ डीएजी) रैंक के आईए एवं एएस अधिकारी द्वारा किया जाता है। आंध्र प्रदेश सरकार के खाते 13 जिलों के जिला कोषागारों द्वारा प्रस्तुत शुरुआती खातों के आधार पर संकलित किए जाते हैं...`
      : `The Accounts Group of this office is headed by an IA & AS officer of the rank of Deputy Accountant General (DAG/Sr.DAG). The accounts of the Government of Andhra Pradesh are compiled based on the initial accounts rendered by 13 District Treasuries and Public Works/Forest Divisions...`,
    accountCards: [
      { id: 'ac-1', title: isHindi ? 'मासिक मुख्य संकेतक' : 'Monthly Key Indicators', url: `/${prefix}/${stateSlug}/State-Accounts/Monthly-Accounts/Monthly-Key-Indicator` },
      { id: 'ac-2', title: isHindi ? 'विनियोग लेखा' : 'Appropriation Accounts', url: `/${prefix}/${stateSlug}/State-Accounts/Annual-Accounts/Appropriation-Accounts` },
      { id: 'ac-3', title: isHindi ? 'वित्त लेखा' : 'Finance Account', url: `/${prefix}/${stateSlug}/State-Accounts/Annual-Accounts/Finance-Accounts` },
      { id: 'ac-4', title: isHindi ? 'एक नजर में खाते' : 'Accounts at a Glance', url: `/${prefix}/${stateSlug}/State-Accounts/Annual-Accounts/Account-at-Glance` }
    ],

    // 4. Quick Links
    quickLinksTitle: isHindi ? 'त्वरित लिंक' : 'Quick Links',
    quickLinksItems: [
      {
        id: 'ql-1',
        title: 'CAG - ICSSR Research Article Competition',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/CAG-ICSSR-Research-Article-Competition-3-jpg-06a2faaa4ce6276-55016433.jpeg'
      },
      {
        id: 'ql-2',
        title: 'Deputation Notification for filling up of various Posts in Regional Capacity Building and Knowledge Institute (RCB and KI) ,Nagpur- Reg',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/notification/Deputation-Circular-RCBKI-Nagpur-069005b1154a9e2-09056541.pdf'
      },
      {
        id: 'ql-3',
        title: 'Filling up the post of Welfare Assistant on deputation basis in the O/o PAG (A&E), Andhra Pradesh, Vijayawada-reg.',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Welfare-Assistant-068dcbee394eb95-65888123.pdf'
      },
      {
        id: 'ql-4',
        title: 'Filling up the post of Legal Assistant on deputation basis in the O/o PAG (A&E), Andhra Pradesh, Vijayawada-reg.',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/notification/Notification-Legal-Assistant-PAG-AE-AP-068491c2b036bf9-72611093.pdf'
      }
    ],

    // 5. Tabs: What's New & Tender & Contracts
    whatsNewTitle: isHindi ? 'नया क्या है?' : "What's New?",
    tendersTitle: isHindi ? 'निविदाएं एवं अनुबंध' : 'Tender & Contracts',
    whatsNewItems: [
      {
        id: 'wn-1',
        date: '17 Aug',
        title: 'Notice for extension of Outsourced canteen services bid submission time',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-Canteen-tender-extension-06a82f45f254a86-49612320.pdf'
      },
      {
        id: 'wn-2',
        date: '06 Aug',
        title: 'Notice inviting tenders for OUTSOURCED CANTEEN SERVICES',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-Re-tender-notice-latest-06a747a2ed30867-03917780.pdf'
      },
      {
        id: 'wn-3',
        date: '15 Jun',
        title: 'CAG - ICSSR Research Article Competition',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_whats_new/CAG-ICSSR-Research-Article-Competition-3-jpg-1-06a2fd3e75c0802-42224269.pdf'
      },
      {
        id: 'wn-4',
        date: '03 Dec',
        title: 'Publication of Bid for Procurement of 4 no. of AIO Desktops. -Reg.',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-GeM-Bidding-8658081-5-0692fcc96eb3751-22509783.pdf'
      }
    ],
    tendersItems: [
      {
        id: 'td-1',
        date: '17 Aug',
        title: 'Notice for extension of Outsourced canteen services bid submission time (PDF, 217.55 KB)',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-Canteen-tender-extension-06a82f45f254a86-49612320.pdf'
      },
      {
        id: 'td-2',
        date: '06 Aug',
        title: 'Notice inviting tenders for OUTSOURCED CANTEEN SERVICES (PDF, 187.95 KB)',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-Re-tender-notice-latest-06a747a2ed30867-03917780.pdf'
      },
      {
        id: 'td-3',
        date: '03 Dec',
        title: 'Publication of Bid for Procurement of 4 no. of AIO Desktops. -Reg. (PDF, 126.88 KB)',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-GeM-Bidding-8658081-5-0692fcc96eb3751-22509783.pdf'
      },
      {
        id: 'td-4',
        date: '01 Sep',
        title: 'Notice inviting bids for the Supply of Printed Envelopes. -Reg. (PDF, 158.34 KB)',
        url: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/tenders/tenders-Tender-Supply-of-Printed-Envelopes-0691da0e6ea1104-31305108.pdf'
      }
    ],
    viewAll: isHindi ? 'सभी देखें' : 'View All'
  };

  return (
    <div className="w-full min-h-screen bg-white font-['Noto_Sans',sans-serif] text-[#2A2A2A] antialiased overflow-x-hidden flex flex-col">
      {/* 1. Universal State Subsite Header */}
      <StateSubsiteHeader
        lang={lang}
        onToggleLanguage={toggleLanguage}
        stateSlug={stateSlug}
        prefix={prefix}
        officePrefix={t.officePrefix}
        officePrefixHi={defaultOfficePrefixHi}
        officeLocation={stateDisplayName}
        officeLocationHi={subsiteData?.office_title_hi || stateDisplayName}
        logoUrl={subsiteData?.logo_url}
      />

      {/* 2. Hero Banner Section */}
      <section className="relative w-full h-[480px] md:h-[540px] flex items-center justify-start bg-[#090C1E] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bannersList.map((b: any, idx: number) => (
            <div
              key={b.id || idx}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url('${b.image_url}')`,
                opacity: slideIndex === idx ? 1 : 0
              }}
            />
          ))}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.4) 30%, rgba(9, 12, 30, 0.85) 65%, #090C1E 100%)'
            }}
          />
        </div>

        <div className="relative z-20 pl-6 md:pl-[120px] pr-6 flex flex-col items-start gap-[28px] max-w-[680px]">
          <div className="flex flex-col items-start gap-[14px]">
            <div className="w-[90px] h-[0px] border-b-2 border-[#FFCE7B]" />
            <p className="text-[20px] md:text-[24px] leading-[32px] md:leading-[36px] tracking-[1px] font-normal text-white">
              {t.heroEnsuring}
            </p>
            <h1 className="text-[34px] md:text-[44px] font-bold leading-[44px] md:leading-[54px] text-white">
              {t.heroTitleLine1} <br />
              <span className="text-[#FFCE7B]">{t.heroTitleLine2}</span>
            </h1>
            <p className="text-[16px] md:text-[19px] leading-[26px] md:leading-[30px] font-normal text-white/95 mt-1">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-[16px] md:gap-[24px]">
            <Link
              href="/Reports"
              className="px-6 h-[48px] bg-white text-[#0A3D30] text-[15px] md:text-[16px] leading-[22px] font-semibold rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-md shrink-0"
            >
              {t.heroBtn1}
            </Link>
            <Link
              href="/About/Index-Menu-About/Global-relations/International%20Relations%20Wing"
              className="px-6 h-[48px] border border-white bg-black/40 text-white text-[15px] md:text-[16px] leading-[22px] font-medium rounded-[8px] flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md shrink-0"
            >
              <span className="text-white font-medium drop-shadow">{t.heroBtn2}</span>
            </Link>
          </div>
        </div>

        {bannersList.length > 1 && (
          <div className="absolute left-6 md:left-[120px] bottom-[28px] z-20 flex items-center gap-[8px]">
            {bannersList.map((_: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlideIndex(idx)}
                className={`transition-all ${
                  slideIndex === idx
                    ? 'w-[45px] border-b-[5px] border-[#FFCE7B]'
                    : 'w-[45px] border-b-[3px] border-white/60 hover:border-white'
                } rounded-full cursor-pointer`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. About Pension Section */}
      <section className="w-full bg-[#F7FFF8] py-[56px] px-6 lg:px-[80px] flex flex-col items-center border-b border-emerald-50">
        <div className="max-w-[1280px] w-full flex flex-col items-center gap-[36px]">
          <div className="flex flex-col items-center text-center gap-[14px] max-w-[1000px]">
            <h2 className="font-bold text-[30px] md:text-[34px] leading-[42px] text-[#0A3D30]">
              {t.pensionTitle}
            </h2>
            <div className="w-[60px] h-[3px] bg-[#0A3D30] rounded-full" />
            <p className="font-normal text-[15px] md:text-[16px] leading-[28px] text-[#444444] whitespace-pre-line text-left md:text-center mt-2">
              {t.pensionDesc}
            </p>
          </div>

          <div className="flex flex-row flex-wrap items-center justify-center gap-6 w-full max-w-[720px]">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
                  ₹
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-[#2A2A2A] hover:text-[#0A3D30] transition-colors">
                    <a href={t.pensionCardLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <span>{t.pensionCardTitle}</span>
                      <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Online</span>
                    </a>
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 mt-1">
                    Track PPO status, pension authorities & service entitlements
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={t.pensionCardLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0A3D30] text-white text-sm font-semibold rounded-md hover:bg-[#072a21] transition-colors shadow-sm"
                >
                  Track Now ↗
                </a>
                <Link
                  href={`/${prefix}/${stateSlug}/Pension/Pension-Information/About-Pension-Functions`}
                  className="text-xs font-semibold text-[#0A3D30] hover:underline"
                >
                  {t.readMore}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. About GPF Section */}
      <section className="w-full bg-white py-[56px] px-6 lg:px-[80px] flex flex-col items-center border-b border-zinc-100">
        <div className="max-w-[1280px] w-full flex flex-col items-center gap-[36px]">
          <div className="flex flex-col items-center text-center gap-[14px] max-w-[1000px]">
            <h2 className="font-bold text-[30px] md:text-[34px] leading-[42px] text-[#0A3D30]">
              {t.gpfTitle}
            </h2>
            <div className="w-[60px] h-[3px] bg-[#0A3D30] rounded-full" />
            <p className="font-normal text-[15px] md:text-[16px] leading-[28px] text-[#444444] whitespace-pre-line text-left md:text-center mt-2">
              {t.gpfDesc}
            </p>
          </div>

          <div className="flex flex-row flex-wrap items-center justify-center gap-6 w-full max-w-[720px]">
            <div className="bg-[#F8FAFC] p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
                  📜
                </div>
                <div>
                  <h3 className="font-bold text-lg md:text-xl text-[#2A2A2A] hover:text-[#0A3D30] transition-colors">
                    <a href={t.gpfCardLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <span>{t.gpfCardTitle}</span>
                      <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Portal</span>
                    </a>
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-500 mt-1">
                    Download annual account slips, subscription & withdrawal balances
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={t.gpfCardLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0A3D30] text-white text-sm font-semibold rounded-md hover:bg-[#072a21] transition-colors shadow-sm"
                >
                  View Slip ↗
                </a>
                <Link
                  href={`/${prefix}/${stateSlug}/GPF/About-GPF`}
                  className="text-xs font-semibold text-[#0A3D30] hover:underline"
                >
                  {t.readMore}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. About Account Section */}
      <section className="w-full bg-[#FAFAFA] py-[56px] px-6 lg:px-[80px] flex flex-col items-center border-b border-zinc-200">
        <div className="max-w-[1280px] w-full flex flex-col items-center gap-[36px]">
          <div className="flex flex-col items-center text-center gap-[14px] max-w-[1000px]">
            <h2 className="font-bold text-[30px] md:text-[34px] leading-[42px] text-[#0A3D30]">
              {t.accountTitle}
            </h2>
            <div className="w-[60px] h-[3px] bg-[#0A3D30] rounded-full" />
            <p className="font-normal text-[15px] md:text-[16px] leading-[28px] text-[#444444] text-left md:text-center mt-2">
              {t.accountDesc}
            </p>
            <Link
              href={`/${prefix}/${stateSlug}/State-Accounts/Accounting-System/Structure-of-Accounts`}
              className="text-sm font-bold text-[#0A3D30] hover:underline flex items-center gap-1 mt-1"
            >
              <span>{t.readMore}</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4 Report Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {t.accountCards.map((card) => (
              <Link
                key={card.id}
                href={card.url}
                className="group bg-white p-6 rounded-xl shadow-sm border border-zinc-200 hover:shadow-lg hover:border-[#0A3D30] transition-all flex flex-col justify-between min-h-[150px]"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0A3D30] flex items-center justify-center font-bold text-sm group-hover:bg-[#0A3D30] group-hover:text-white transition-colors">
                    📊
                  </div>
                  <h4 className="font-bold text-[16px] leading-[22px] text-[#2A2A2A] group-hover:text-[#0A3D30] transition-colors">
                    {card.title}
                  </h4>
                </div>
                <span className="text-[#0A3D30] text-xs font-bold flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                  View Reports →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Quick Links & What's New / Tenders (Tabbed) Section */}
      <section className="w-full bg-white py-[56px] px-6 lg:px-[80px] flex justify-center">
        <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Quick Links Column */}
          <div className="flex flex-col bg-[#FDFEFE] p-6 rounded-xl border border-zinc-200 shadow-sm justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#0A3D30] pb-3 mb-4">
                <h3 className="font-bold text-[22px] text-[#2A2A2A]">
                  {t.quickLinksTitle}
                </h3>
                <span className="text-xs bg-emerald-50 text-[#0A3D30] font-semibold px-2.5 py-1 rounded">
                  Important
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {t.quickLinksItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-lg border border-zinc-100 bg-[#FAFAFA] hover:bg-emerald-50/50 hover:border-emerald-200 transition-all flex items-start justify-between gap-3 group"
                  >
                    <span className="text-sm font-medium text-zinc-800 group-hover:text-[#0A3D30] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-emerald-700 font-bold text-xs shrink-0 mt-0.5">↗</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-end">
              <Link
                href={`/${prefix}/${stateSlug}/Contact-Us/Working-With-US/Notification`}
                className="text-xs font-bold text-[#0A3D30] hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Tabbed What's New & Tenders Column */}
          <div className="flex flex-col bg-[#FDFEFE] p-6 rounded-xl border border-zinc-200 shadow-sm justify-between">
            <div>
              {/* Tabs Switcher */}
              <div className="flex items-center gap-2 border-b-2 border-zinc-200 pb-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('whatsNew')}
                  className={`pb-2 px-3 text-[17px] font-bold transition-all relative ${
                    activeTab === 'whatsNew'
                      ? 'text-[#0A3D30] border-b-2 border-[#0A3D30] -mb-[10px]'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {t.whatsNewTitle}
                </button>
                <span className="text-zinc-300">|</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('tenders')}
                  className={`pb-2 px-3 text-[17px] font-bold transition-all relative ${
                    activeTab === 'tenders'
                      ? 'text-[#0A3D30] border-b-2 border-[#0A3D30] -mb-[10px]'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {t.tendersTitle}
                </button>
              </div>

              {/* Tab 1: What's New */}
              {activeTab === 'whatsNew' && (
                <div className="flex flex-col gap-3">
                  {t.whatsNewItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-zinc-100 bg-[#FAFAFA] hover:bg-emerald-50/50 hover:border-emerald-200 transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-[#0A3D30] text-white px-2.5 py-1 rounded shrink-0 shadow-sm">
                          {item.date}
                        </span>
                        <span className="text-sm font-medium text-zinc-800 group-hover:text-[#0A3D30] transition-colors line-clamp-1">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-bold text-xs shrink-0">↗</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Tab 2: Tenders & Contracts */}
              {activeTab === 'tenders' && (
                <div className="flex flex-col gap-3">
                  {t.tendersItems.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border border-zinc-100 bg-[#FAFAFA] hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-[#1E3A8A] text-white px-2.5 py-1 rounded shrink-0 shadow-sm">
                          {item.date}
                        </span>
                        <span className="text-sm font-medium text-zinc-800 group-hover:text-[#1E3A8A] transition-colors line-clamp-1">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-blue-700 font-bold text-xs shrink-0">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-100 flex justify-end">
              <Link
                href={
                  activeTab === 'whatsNew'
                    ? `/${prefix}/${stateSlug}/Contact-Us/Media-Centre/Notices`
                    : `/${prefix}/${stateSlug}/Contact-Us/Working-With-US/Tender-Notices`
                }
                className="text-xs font-bold text-[#0A3D30] hover:underline flex items-center gap-1"
              >
                <span>{t.viewAll}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Universal State Subsite Footer */}
      <StateSubsiteFooter
        isHindi={isHindi}
        officeTitle={subsiteData?.office_title || 'Principal Accountant General (A&E), Andhra Pradesh, Vijayawada'}
        officeTitleHi={subsiteData?.office_title_hi}
      />
    </div>
  );
}
