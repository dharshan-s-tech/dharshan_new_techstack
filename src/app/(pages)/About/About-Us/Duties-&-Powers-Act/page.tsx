'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';

const TABLE_DATA = [
  {
    chapterEn: 'Chapter-I Preliminary',
    chapterHi: 'अध्याय-I प्रारंभिक',
    itemsEn: [
      'Short Title',
      'Definitions'
    ],
    itemsHi: [
      'संक्षिप्त नाम',
      'परिभाषाएं'
    ]
  },
  {
    chapterEn: 'Chapter-II Salary and Other Conditions of Service of the Comptroller and Auditor-General',
    chapterHi: 'अध्याय-II नियंत्रक और महालेखापरीक्षक का वेतन और सेवा की अन्य शर्तें',
    itemsEn: [
      'Salary',
      'Term of Office',
      'Explanation',
      'Leave',
      'Pension',
      'Commutation of pension',
      'Right to subscribe to General Provident Fund',
      'Other conditions of service'
    ],
    itemsHi: [
      'वेतन',
      'पदावधि',
      'स्पष्टीकरण',
      'छुट्टी',
      'पेंशन',
      'पेंशन का रूपांतरण',
      'सामान्य भविष्य निधि में अंशदान करने का अधिकार',
      'सेवा की अन्य शर्तें'
    ]
  },
  {
    chapterEn: 'Chapter-III Duties and powers of the comptroller and auditor general',
    chapterHi: 'अध्याय-III नियंत्रक और महालेखापरीक्षक के कर्तव्य और शक्तियां',
    itemsEn: [
      'Comptroller and Auditor General to compile accounts of Union and States',
      'Comptroller and Auditor General to prepare and submit accounts to the President Governors of States and Administrators of Union territories having Legislative Assemblies',
      'Comptroller and Auditor General to give information and render assistance to the Union and States',
      'General provisions relating to audit',
      'Audit of receipts and expenditure of bodies or authorities substantially financed from Union or State Revenues',
      'Functions of Comptroller and Auditor General in the case of grants or loans given to other authorities or bodies',
      'Audit of receipts of Union or of States',
      'Audit of accounts of stores and stock',
      'Powers of Comptroller and Auditor General in connection with audit of accounts',
      'Audit of Government companies and corporations',
      'Laying of reports in relation to accounts of Government companies and corporations',
      'Audit of accounts of certain authorities or bodies'
    ],
    itemsHi: [
      'संघ और राज्यों के खातों का संकलन करने के लिए नियंत्रक और महालेखापरीक्षक',
      'राष्ट्रपति, राज्यों के राज्यपालों और विधान सभा वाले केंद्र शासित प्रदेशों के प्रशासकों को खाते तैयार करने और प्रस्तुत करने के लिए नियंत्रक और महालेखापरीक्षक',
      'संघ और राज्यों को जानकारी देने और सहायता प्रदान करने के लिए नियंत्रक और महालेखापरीक्षक',
      'लेखापरीक्षा से संबंधित सामान्य प्रावधान',
      'संघ या राज्य के राजस्व से पर्याप्त रूप से वित्तपोषित निकायों या प्राधिकरणों की प्राप्तियों और व्यय की लेखापरीक्षा',
      'अन्य प्राधिकरणों या निकायों को दिए गए अनुदान या ऋण के मामले में नियंत्रक और महालेखापरीक्षक के कार्य',
      'संघ या राज्यों की प्राप्तियों की लेखापरीक्षा',
      'भंडार और स्टॉक के खातों की लेखापरीक्षा',
      'खातों की लेखापरीक्षा के संबंध में नियंत्रक और महालेखापरीक्षक की शक्तियां',
      'सरकारी कंपनियों और निगमों की लेखापरीक्षा',
      'सरकारी कंपनियों और निगमों के खातों के संबंध में रिपोर्ट प्रस्तुत करना',
      'कुछ प्राधिकरणों या निकायों के खातों की लेखापरीक्षा'
    ]
  },
  {
    chapterEn: 'Chapter-IV Miscellaneous',
    chapterHi: 'अध्याय-IV विविध',
    itemsEn: [
      'Delegation of power of Comptroller and Auditor General',
      'Power to make rules',
      'Power to make regulations',
      'Power to dispense with detailed audit',
      'Repeal',
      'Removal of doubts'
    ],
    itemsHi: [
      'नियंत्रक और महालेखापरीक्षक की शक्ति का प्रत्यायोजन',
      'नियम बनाने की शक्ति',
      'विनियम बनाने की शक्ति',
      'विस्तृत लेखापरीक्षा से छूट देने की शक्ति',
      'निरसन',
      'संदेहों का निवारण'
    ]
  }
];

function DutiesPowersActContent() {
  const searchParams = useSearchParams();
  const isAdminEdit = searchParams.get('admin_edit') === 'true';
  const langParam = searchParams.get('lang');

  const [lang, setLang] = useState<'English' | 'हिन्दी'>(langParam === 'HI' ? 'हिन्दी' : 'English');
  const isHindi = lang === 'हिन्दी';
  const [pageTitleEn, setPageTitleEn] = useState("DPC Act - CAG's Duties Powers and Conditions of Service");
  const [pageTitleHi, setPageTitleHi] = useState('डीपीसी अधिनियम - सीएजी के कर्तव्य, शक्तियां और सेवा की शर्तें');
  const [subTitleEn, setSubTitleEn] = useState("DPC ACT, 1971 The comptroller and auditor general's (Duties, Powers and Conditions of Service) Amendment ACT, 1971 Comptroller and Auditor General of India Contents");
  const [subTitleHi, setSubTitleHi] = useState('डीपीसी अधिनियम, 1971 भारत के नियंत्रक और महालेखापरीक्षक (कर्तव्य, शक्तियां और सेवा की शर्तें) संशोधन अधिनियम, 1971 भारत के नियंत्रक और महालेखापरीक्षक विषय-सूची');
  const [tableData, setTableData] = useState(TABLE_DATA);

  // Synchronized Ref for live message handling
  const stateRef = React.useRef({ pageTitleEn, pageTitleHi, subTitleEn, subTitleHi, tableData, lang });
  useEffect(() => {
    stateRef.current = { pageTitleEn, pageTitleHi, subTitleEn, subTitleHi, tableData, lang };
  }, [pageTitleEn, pageTitleHi, subTitleEn, subTitleHi, tableData, lang]);

  useEffect(() => {
    let isMounted = true;
    const initialLang = langParam === 'HI' ? 'हिन्दी' : dataManager.getLanguage();
    setLang(initialLang);

    const fetchAll = () => {
      dataManager.fetchPageData('page-duties-power-and-conditions-of-services-act', 'en').then((res) => {
        if (isMounted && res) {
          if (res.title) setPageTitleEn(res.title);
          if (res.content && typeof res.content === 'string') {
            const trimmed = res.content.trim();
            if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.includes('chapter'))) {
              try {
                const parsed = JSON.parse(trimmed);
                const arr = Array.isArray(parsed) ? parsed : parsed.chapters;
                if (Array.isArray(arr) && arr.length > 0) setTableData(arr);
              } catch (e) { }
            }
          }
        }
      });

      dataManager.fetchPageData('page-duties-power-and-conditions-of-services-act', 'hi').then((res) => {
        if (isMounted && res) {
          if (res.title) setPageTitleHi(res.title);
        }
      });
    };

    fetchAll();

    const handleLangChange = () => {
      const newLang = dataManager.getLanguage();
      setLang(newLang);
    };

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('aboutDataChange', fetchAll);
    window.addEventListener('pageDataChange', fetchAll);

    // Cross-frame messaging for Admin Live Editor
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'SET_LANG') {
        const targetLang = e.data.lang === 'HI' ? 'हिन्दी' : 'English';
        dataManager.setLanguage(targetLang);
        setLang(targetLang);
      } else if (e.data.type === 'REQUEST_DATA') {
        const cur = stateRef.current;
        window.parent.postMessage({
          type: 'DATA_REPLY',
          payload: {
            title_en: cur.pageTitleEn,
            title_hi: cur.pageTitleHi,
            desc: cur.lang === 'हिन्दी' ? cur.subTitleHi : cur.subTitleEn,
            content_val: JSON.stringify(cur.tableData),
            content_hi_val: JSON.stringify(cur.tableData)
          }
        }, '*');
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      isMounted = false;
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('aboutDataChange', fetchAll);
      window.removeEventListener('pageDataChange', fetchAll);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const pageTitle = isHindi ? pageTitleHi : pageTitleEn;
  const subTitle = isHindi ? subTitleHi : subTitleEn;

  const editFieldClass = isAdminEdit
    ? 'hover:ring-2 hover:ring-[#751639] hover:ring-dashed focus:ring-2 focus:ring-[#751639] focus:outline-none transition-all rounded p-1 cursor-text'
    : '';

  return (
    <AboutLayout title={isHindi ? 'कर्तव्य और शक्तियां अधिनियम' : 'Duties & Powers Act'}>
      <div className="flex flex-col items-start w-full max-w-[958px] gap-6 text-left">
        {/* Main Heading */}
        <h1
          className={`text-left ${editFieldClass}`}
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '160%',
            color: '#751639',
            margin: 0
          }}
          contentEditable={isAdminEdit}
          suppressContentEditableWarning
          onBlur={(e) => {
            const val = e.currentTarget.textContent || '';
            if (isHindi) setPageTitleHi(val);
            else setPageTitleEn(val);
          }}
        >
          {pageTitle}
        </h1>

        {/* Subheading */}
        <h2
          className={`text-left ${editFieldClass}`}
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '28px',
            color: '#751639',
            margin: 0
          }}
          contentEditable={isAdminEdit}
          suppressContentEditableWarning
          onBlur={(e) => {
            const val = e.currentTarget.textContent || '';
            if (isHindi) setSubTitleHi(val);
            else setSubTitleEn(val);
          }}
        >
          {subTitle}
        </h2>

        {/* Contents Table (Group 1000005515) */}
        <div
          className="w-full max-w-[958px] bg-white border rounded-none overflow-hidden"
          style={{
            borderColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          {tableData.map((row, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row ${
                index !== tableData.length - 1 ? 'border-b' : ''
              }`}
              style={{
                borderBottomColor: index !== tableData.length - 1 ? 'rgba(0, 0, 0, 0.2)' : undefined
              }}
            >
              {/* Left Column (Chapter Title - width 316px) */}
              <div
                className="w-full md:w-[316px] shrink-0 p-6 flex items-start border-b md:border-b-0 md:border-r"
                style={{
                  borderRightColor: 'rgba(0, 0, 0, 0.2)',
                  borderBottomColor: 'rgba(0, 0, 0, 0.2)'
                }}
              >
                <span
                  className={editFieldClass}
                  style={{
                    fontFamily: 'Noto Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '28px',
                    color: '#751639'
                  }}
                  contentEditable={isAdminEdit}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const val = e.currentTarget.textContent || '';
                    const updated = [...tableData];
                    if (isHindi) updated[index].chapterHi = val;
                    else updated[index].chapterEn = val;
                    setTableData(updated);
                  }}
                >
                  {isHindi ? (row.chapterHi || row.chapterEn) : (row.chapterEn || row.chapterHi)}
                </span>
              </div>

              {/* Right Column (List of Topics) */}
              <div className="flex-1 p-6">
                <ul className="space-y-1 text-left list-none p-0 m-0">
                  {(isHindi ? (row.itemsHi || row.itemsEn || []) : (row.itemsEn || row.itemsHi || [])).map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5"
                      style={{
                        fontFamily: 'Noto Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '28px',
                        color: '#2A2A2A'
                      }}
                    >
                      <span className="text-[#2A2A2A] select-none text-[16px] leading-[28px] shrink-0">•</span>
                      <span
                        className={editFieldClass}
                        contentEditable={isAdminEdit}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const val = e.currentTarget.textContent || '';
                          const updated = [...tableData];
                          if (isHindi) {
                            const items = [...(updated[index].itemsHi || [])];
                            items[i] = val;
                            updated[index].itemsHi = items;
                          } else {
                            const items = [...(updated[index].itemsEn || [])];
                            items[i] = val;
                            updated[index].itemsEn = items;
                          }
                          setTableData(updated);
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>


        {/* Detailed Act Sections (Frame 2147227449) */}
        <div
          className="flex flex-col items-start w-full max-w-[958px]"
          style={{
            gap: '21px',
            fontFamily: 'Noto Sans, sans-serif',
            fontSize: '14px',
            lineHeight: '24px',
            color: '#2A2A2A',
            opacity: 1
          }}
        >
          {/* ==================== CHAPTER 1 ==================== */}
          <section className="flex flex-col gap-3 w-full">
            <h3
              style={{
                fontFamily: 'Noto Sans, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '28px',
                color: '#751639',
                margin: 0
              }}
            >
              Ch 1 - Preliminary
            </h3>

            <p className="m-0">
              An Act to determine the conditions of service of the Comptroller and Auditor-General of India and to prescribe his duties and powers and for that matters connected therewith or incidental thereto.
            </p>
            <p className="m-0">
              Be it enacted by Parliament in the Twenty-second year of the Republic of India as follows:-
            </p>

            <div className="flex flex-col gap-1 mt-1">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '24px',
                  color: '#2A2A2A',
                  margin: 0
                }}
              >
                1. Short Title
              </h4>
              <p className="m-0">
                This Act may be called the Comptroller and Auditor-General's (Duties, Powers and Conditions of Service) Act, 1971.
              </p>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '24px',
                  color: '#2A2A2A',
                  margin: 0
                }}
              >
                2. Definitions
              </h4>
              <p className="m-0">
                In this Act, unless the context otherwise requires,
              </p>
              <div className="flex flex-col gap-1 pl-1">
                <p className="m-0">
                  a. &ldquo;Accounts&rdquo;, in relation to commercial undertakings of a Government, includes trading, manufacturing and profit and loss accounts and balance-sheets and other subsidiary accounts;
                </p>
                <p className="m-0">
                  b. &ldquo;Appropriation accounts&rdquo; means accounts which relate the expenditure brought to account during a financial year, to the several items specified in the law made in accordance with the provisions of the Constitution or of the Government of Union Territories Act, 1963, (20 of 1963) for the appropriation of moneys out of the Consolidated Fund of India or of a State, or of a Union territory having a Legislative Assembly, as the case may be;
                </p>
                <p className="m-0">
                  c. &ldquo;Comptroller and Auditor-General&rdquo; means the Comptroller and Auditor-General of India appointed under article 148 of the Constitution;
                </p>
                <p className="m-0">
                  d. &ldquo;State&rdquo; means a State specified in the First Schedule to the Constitution;
                </p>
                <p className="m-0">
                  e. &ldquo;Union&rdquo; includes a Union territory, whether having a Legislative Assembly or not.
                </p>
              </div>
            </div>
          </section>

          {/* ==================== CHAPTER 2 ==================== */}
          <section className="flex flex-col gap-3 w-full">
            <h3
              style={{
                fontFamily: 'Noto Sans, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '28px',
                color: '#751639',
                margin: 0
              }}
            >
              Ch 2 - Salary and Other Conditions of Service of the CAG
            </h3>

            <div className="flex flex-col gap-2">
              <p className="m-0">
                3. There shall be paid to the Comptroller and Auditor-General a salary which is equal to the salary of the Judge of the Supreme Court:
              </p>
              <p className="m-0">
                Provided that if a person who immediately before the date of assuming office as the Comptroller and Auditor-General, was in receipt of, or, being eligible so to do, had elected to draw, a pension (other than a disability or wound pension) in respect of any previous service under the Government of the Union or any of its predecessor Governments, or under the Government of a State or any of its predecessor Governments, his salary in respect of service as Comptroller and Auditor-General shall be reduced:
              </p>
              <div className="flex flex-col gap-1 pl-4">
                <p className="m-0">
                  1. By the amount of that pension; and
                </p>
                <p className="m-0">
                  2. If he had, before assuming office, received, in lieu of a portion of the pension due to him in respect of such previous service, the commuted value thereof, by the amount of that portion of the pension.
                </p>
              </div>
            </div>

            {/* Term of Office */}
            <div className="flex flex-col gap-2 mt-2">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#751639',
                  margin: 0
                }}
              >
                Term of Office
              </h4>
              <p className="m-0">
                4. The Comptroller and Auditor-General shall hold office for a term of six years from the date on which he assumes such office:
              </p>
              <p className="m-0">
                Provided that where he attains the age of sixty-five years before the expiry of the said term of six years, he shall vacate such office on the date on which he attains the said
              </p>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-2 mt-2">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#751639',
                  margin: 0
                }}
              >
                Age
              </h4>
              <p className="m-0">
                Provided further that he may, at any time, by writing under his hand addressed to the President, resign his office.
              </p>
              <p className="m-0">
                Explanation : For the purpose of this section, the term of six years in respect of the Comptroller and Auditor-General holding office immediately before the commencement of this Act, shall be computed from the date on which he had assumed office.
              </p>
            </div>

            {/* Leave */}
            <div className="flex flex-col gap-2 mt-2">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#751639',
                  margin: 0
                }}
              >
                Leave
              </h4>
              <div className="flex flex-col gap-2">
                <p className="m-0">
                  1. A person who, immediately before the date of assuming office as the Comptroller and Auditor-General, was in the service of Government may be granted during his tenure of office but not thereafter, leave in accordance with the rules for the time being applicable to the Service to which he belonged before such date and he shall be entitled to carry forward the amount of leave standing at his credit on such date, notwithstanding anything contained in section 6.
                </p>
                <p className="m-0">
                  2. Any other person who is appointed as the Comptroller and Auditor-General may be granted leave in accordance with such rules as are for the time being applicable to a member of the Indian Administrative Service.
                </p>
                <p className="m-0">
                  3. The power to grant or refuse leave to the Comptroller and Auditor-General and to revoke or curtail leave granted to him, shall vest in the President.
                </p>
              </div>
            </div>

            {/* Pension */}
            <div className="flex flex-col gap-2 mt-2">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#751639',
                  margin: 0
                }}
              >
                Pension
              </h4>
              <div className="flex flex-col gap-2.5">
                <p className="m-0">
                  1. A person who, immediately before the date of assuming office as the Comptroller and Auditor-General, was in the service of Government shall be deemed to have retired from service on the date on which he enters upon office as the Comptroller and Auditor-General but his service as Comptroller and Auditor-General shall be reckoned as continuing approved service counting for pension in the Service to which he belonged.
                </p>
                <p className="m-0">
                  2. Every person who enters upon office as the Comptroller and Auditor-General shall, on demitting the said office, be eligible to a pension of a sum of fifteen thousand rupees per annum which sum shall include the aggregate of all pensions payable to him and the commuted portion, if any, of his pension, and the pension equivalent of the retirement gratuity, if any, which may have been admissible to him under the rules for the time being applicable to the Service to which he belonged:
                </p>
                <p className="m-0 pl-4">
                  Provided that if such a person is or becomes eligible, at any time, under the rules for the time being governing the Service to which he belonged, to a pension higher than the said sum of fifteen thousand rupees, he shall be eligible to draw, as pension, the said higher amount.
                </p>
                <p className="m-0">
                  3. A person who, immediately before the date of assuming office as the Comptroller and Auditor-General, was in receipt of, or, had become eligible for receiving, a pension in respect of any previous service under Government, shall, on demitting office as the Comptroller and Auditor-General, be eligible to a pension of fifteen thousand rupees per annum which sum shall include the aggregate of all pensions payable to him and the commuted portion, if any, of his pension, and the pension equivalent of the retirement gratuity, if any, which may have been admissible to him under the rules for the time being applicable to the Service to which he belonged:
                </p>
                <p className="m-0 pl-4">
                  Provided that if such a person is or becomes eligible, at any time, under the rules for the time being governing the service to which he belonged, to a pension higher than the said sum of fifteen thousand rupees, he shall be eligible to draw, as pension, the said higher amount.
                </p>
                <p className="m-0">
                  4. Any other person who is appointed as the Comptroller and Auditor-General shall, on demitting the said office, be eligible to a pension of fifteen thousand rupees per annum.
                </p>
                <p className="m-0">
                  5. The person holding office immediately before the commencement of this Act as the Comptroller and Auditor-General shall be eligible to draw, at his option, pension at the rate at which it would be admissible to him if this Act had not come into force or at the rate specified in this section.
                </p>
                <p className="m-0">
                  6. A person who demits office as the Comptroller and Auditor-General by resignation shall, on such demission, be eligible to a pension at the rate of two thousand rupees per annum for each completed year of his service as the Comptroller and Auditor General:
                </p>
                <p className="m-0 pl-4">
                  Provided that in the case of a person referred to in sub-section (1) or sub-section (3), the aggregate amount of pension admissible under this sub-section together with the amount of pension including the commuted portion, if any, of his pension, and the pension equivalent of the retirement gratuity if any which may have been admissible to him under the rules for the time being applicable to the Service to which he belonged immediately before he assumed office as the Comptroller and Auditor-General, shall not exceed fifteen thousand rupees per annum or the higher pension referred to in proviso to sub-section (2) or sub-section (3), as the case may be.
                </p>
                <p className="m-0">
                  (6A) Notwithstanding, anything contained in the foregoing provisions of this section a person referred to in sub-section (1) who demits office (whether in any manner specified in sub-section (8) or by resignation) as the Comptroller and Auditor-General after the commencement of the Comptroller and Auditor-General's (Duties, Powers and Conditions of Service) Amendment Act, 1984, shall, on such demission, be entitled to:
                </p>
                <div className="flex flex-col gap-1 pl-4">
                  <p className="m-0">
                    a. the pension to which he would have been entitled under the rules of the Service to which he belonged by reckoning his service as the Comptroller and Auditor-General as continuing approved service counting for pension in such Service; and
                  </p>
                  <p className="m-0">
                    b. a special pension of seven hundred rupees per annum in respect of each completed year of service as the Comptroller and Auditor-General;
                  </p>
                </div>
                <p className="m-0">
                  (6B) Notwithstanding anything contained in the foregoing provisions of this section, a person referred to in sub-section (3) who demits office (whether in any manner specified in sub-section (8) or by resignation) as the Comptroller and Auditor-General after the commencement of the Comptroller and Auditor-General's (Duties, Powers and Conditions of Service) Amendment Act, 1984, shall, on such demission be entitled to:
                </p>
                <div className="flex flex-col gap-1 pl-4">
                  <p className="m-0">
                    a. the pension payable to him in respect of any previous service under Government; and
                  </p>
                  <p className="m-0">
                    b. a special pension of seven hundred rupees per annum in respect of each completed year of service as the Comptroller and Auditor-General.
                  </p>
                </div>
                <p className="m-0">
                  (6C) Notwithstanding anything contained in the foregoing provisions of this section, a person who demits office (whether in any manner specified in sub-section 8 (or by resignation) as the Comptroller and Auditor-General after the commencement of the Comptroller and Auditor-General's (Duties, Powers and Conditions of Service) Amendment Act, 1987 shall, on such-demission, be entitled to-
                </p>
                <div className="flex flex-col gap-1 pl-4">
                  <p className="m-0">
                    1. a pension which is equal to the pension payable to a Judge of the Supreme Court,-
                  </p>
                  <div className="flex flex-col gap-1 pl-4">
                    <p className="m-0">
                      I. if such person is a person referred to in sub-section (1) or sub-section (3), in accordance with the provisions of part III of the Schedule to the Supreme Court Judges (Conditions of Services) Act, 1958 (41 of 1958) (hereafter in this Act referred to as the Supreme Court Judges Act), as amended from time to time.
                    </p>
                    <p className="m-0">
                      II. If such person is a person referred to in subsection (4), in accordance with the provisions of Part I of the Schedule to the Supreme Court Judges Act, as amended from time to time.
                    </p>
                  </div>
                  <p className="m-0">
                    2. Such pension (including commutation of pension), family pension and gratuity as are admissible to a Judge of Supreme Court under the Supreme Court Judges Act and the rules made thereunder, as amended from time to time.
                  </p>
                </div>
                <p className="m-0">
                  (6D) Notwithstanding anything contained in the foregoing provisions of this section, a person who demitted office (whether in any manner specified in sub section (8) or by resignation) as the Comptroller and Auditor-General, at any time before the 16th day of December, 1987, shall be entitled to the pension specified in sub section (6C) on and from that date.
                </p>
                <p className="m-0">
                  7. If a person who demits office as the Comptroller and Auditor-General is not eligible to any pension under this section but is eligible to a pension under the rules for the time being applicable to the Service to which he belonged immediately before he assumed office as the Comptroller and Auditor-General he shall, notwithstanding anything contained in this section, be eligible to draw such pension as is admissible to him under the said rules.
                </p>
                <p className="m-0">
                  8. Except where he demits office by resignation, a person holding office of the Comptroller and Auditor-General shall be deemed, for the purposes of this Act, to have demitted such office as such if, and only if-
                </p>
                <div className="flex flex-col gap-1 pl-4">
                  <p className="m-0">1. he has completed the term of office specified in section 4, or</p>
                  <p className="m-0">2. he has attained the age of sixty-five years, or</p>
                  <p className="m-0">3. his demission of office is medically certified to be necessitated by ill-health.</p>
                </div>
              </div>
            </div>

            {/* Omitted */}
            <div className="flex flex-col gap-3 mt-2">
              <h4
                style={{
                  fontFamily: 'Noto Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: '#751639',
                  margin: 0
                }}
              >
                Omitted
              </h4>
              <p className="m-0">
                Right to Subscribe to General Provident Fund
              </p>
              <p className="m-0">
                Every person holding office as the Comptroller and Auditor-General shall be entitled to subscribe to the General Provident Fund (Central Services).
              </p>
              <p className="m-0">
                Other Conditions of Service
              </p>
              <p className="m-0">
                9. Save as otherwise provided in this Act, the conditions of service relating to travelling allowance, provision of rent free residence and exemption from payment of income-tax on the value of such rent-free residence, conveyance facilities, sumptuary allowance, medical facilities and such other conditions of service as are for the time being applicable to a Judge of the Supreme Court under Chapter IV of the Supreme Court Judges Act, and the rules are made thereunder, shall, so far as may be, apply to a serving or retired Comptroller and Auditor-General as the case may be.
              </p>
              <p className="m-0">
                Provided that nothing in this section shall have effect so as to give a person, who immediately before the date of assuming office as the Comptroller and Auditor-General, was in the service of Government less favourable terms in respect of any of the matters aforesaid than those to which he would be entitled as a member of the Service to which he belonged, his service as Comptroller and Auditor-General being treated for the purpose of this proviso as continuing service in the Service to which he belonged.
              </p>
            </div>
          </section>

          {/* ==================== CHAPTER 3 ==================== */}
          <section className="flex flex-col gap-3 w-full">
            <h3
              style={{
                fontFamily: 'Noto Sans, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '28px',
                color: '#751639',
                margin: 0
              }}
            >
              Ch 3-Duties and powers of the Comptroller and Auditor General
            </h3>

            {/* Section 10 */}
            <div className="flex flex-col gap-2">
              <p className="m-0">
                Comptroller and Auditor-General to compile accounts of Union and States
              </p>
              <p className="m-0">
                1. The Comptroller and Auditor-General shall be responsible-
              </p>
              <div className="flex flex-col gap-1 pl-4">
                <p className="m-0">
                  a. for compiling the accounts of the Union and of each State from the initial and subsidiary accounts rendered to the audit and accounts offices under his control by treasuries, offices or departments responsible for the keeping of such accounts; and
                </p>
                <p className="m-0">
                  b. for keeping such accounts in relation to any of the matters specified in clause (a) as may be necessary:
                </p>
              </div>
              <p className="m-0 pl-4">
                Provided that the President may, after consultation with the Comptroller and Auditor-General, by order relieve him from the responsibility for compiling-
              </p>
              <div className="flex flex-col gap-1 pl-8">
                <p className="m-0">I. the said accounts of the Union (either at once or gradually by the issue of several orders); or</p>
                <p className="m-0">II. the accounts of any particular services or departments of the Union:</p>
              </div>
              <p className="m-0 pl-4">
                Provided further that the Governor of a State may with the previous approval of the President and after consultation with the Comptroller and Auditor-General, by order, relieve him from the responsibility for compiling-
              </p>
              <div className="flex flex-col gap-1 pl-8">
                <p className="m-0">I. the said accounts of the State (either at once or gradually by the issue of several orders); or</p>
                <p className="m-0">II. the accounts of any particular services or departments of the State:</p>
              </div>
              <p className="m-0 pl-4">
                Provided also that the President may, after consultation with the Comptroller and Auditor-General, by order, relieve him from the responsibility for keeping the accounts of any particular class or character.
              </p>
              <p className="m-0">
                2. Where, under any arrangement, a person other than the Comptroller and Auditor-General has, before the commencement of this Act, been responsible-
              </p>
              <div className="flex flex-col gap-1 pl-4">
                <p className="m-0">I. for compiling the accounts of any particular service or department of the Union or of a State, or</p>
                <p className="m-0">II. for keeping the accounts of any particular class or character, such arrangement shall, notwithstanding anything contained in sub-section (1), continue to be in force unless, after consultation with the Comptroller and Auditor-General, it is revoked in the case referred to in clause (i), by an order of the President or the Governor of the State, as the case may be, and in the case referred to in clause (ii) by an order of the President.</p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="m-0">
                Comptroller and Auditor-General to prepare and submit accounts to the President, Governors of States and Administrators of Union Territories having Legislative Assemblies
              </p>
              <p className="m-0">
                11. The Comptroller and Auditor-General shall from the accounts compiled by him or by the Government or any other person responsible on that behalf prepare in each year accounts (including, in the case of accounts compiled by him, appropriation accounts) showing under the respective heads the annual receipts and disbursements for the purpose of the Union, of each State and of each Union territory having a Legislative Assembly, and shall submit those accounts to the President or the Governor of a State or Administrator of the Union territory having a Legislative Assembly, as the case may be on or before such dates as he may, with the concurrence of the Government concerned, determine:
              </p>
              <p className="m-0 pl-4">
                Provided that the President may, after consultation with the Comptroller and Auditor-General, by order, relieve him from the responsibility for the preparation and submission of the accounts relating to annual receipts and disbursements for the purpose of the Union or of a Union territory having a Legislative Assembly;
              </p>
              <p className="m-0 pl-4">
                Provided further that the Governor of a State may, with the previous approval of the President and after consultation with the Comptroller and Auditor-General, by order, relieve him from the responsibility for the preparation and submission of the accounts relating to annual receipts and disbursements for the purpose of the State.
              </p>
            </div>

            {/* Section 12 */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="m-0">
                Comptroller and Auditor-General to give information and render assistance to the Union and States
              </p>
              <p className="m-0">
                12. The Comptroller and Auditor-General shall, in so far as the accounts, for the compilation or keeping of which he is responsible, enable him so to do, give to the Union government, to the State Governments or to the Governments of Union Territories having Legislative Assemblies, as the case may be, such information as they may, from time to time, require, and render such assistance in the preparation of their annual financial statements as they may reasonably ask for.
              </p>
            </div>

            {/* General Provisions Relating to Audit */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="m-0">
                General Provisions Relating to Audit
              </p>
            </div>

            {/* Section 13 */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="m-0">
                13. It shall be the duty of the CAG
              </p>
              <div className="flex flex-col gap-1.5 pl-4">
                <p className="m-0">
                  1. to audit all expenditure from the Consolidated Fund of India and of each State and of each Union territory having a Legislative Assembly and to ascertain whether the moneys shown in the accounts as having been disbursed were legally available for and applicable to the service or purpose to which they have been applied or charged and whether the expenditure conforms to the authority which governs it;
                </p>
                <p className="m-0">
                  2. to audit all transactions of the Union and of the States relating to Contingency Funds and Public Accounts;
                </p>
                <p className="m-0">
                  3. to audit all trading, manufacturing, profit and loss accounts and balance-sheets and other subsidiary accounts kept in any department of the Union or of a State; and in each case to report on the expenditure, transactions or accounts so audited by him.
                </p>
              </div>
            </div>

            {/* Section 14 */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Audit of receipts and expenditure of bodies or authorities substantially financed from Union or State Revenues
              </p>
              <div className="flex flex-col gap-2">
                <p className="m-0">
                  1. Where any body or authority is substantially financed by grants or loans from the Consolidated Fund of India or of any State or of any Union territory having a Legislative Assembly, the Comptroller and Auditor-General shall, subject to the provisions of any law for the time being in, force applicable to the body or authority, as the case may be, audit all receipts and expenditure of that body or authority and to report on the receipts and expenditure audited by him.
                </p>
                <p className="m-0">
                  2. Explanation: Where the grant or loan to a body or authority from the Consolidated Fund of India or of any State or of any Union territory having a Legislative Assembly in a financial year is not less than rupees twenty-five lakhs and the amount of such grant or loan is not less than seventy-five percent of the total expenditure of that body or authority, such body or authority shall be deemed, for the purposes of this sub-section, to be substantially financed by such grants or loans as the case may be.
                </p>
                <p className="m-0">
                  3. Notwithstanding anything contained in sub-section (1) the Comptroller and Auditor-General may with the previous approval of the President or the Governor of a State or the Administrator of a Union territory having a Legislative Assembly, as the case may be, audit all receipts and expenditure of any body or authority where the grants or loans to such body or authority from the Consolidated Fund of India or of any State or of any Union territory having a Legislative Assembly, as the case may be in a financial year is not less than rupees one crore.
                </p>
                <p className="m-0">
                  4. Where the receipts and expenditure of any body or authority are by virtue of the fulfilment of the conditions specified in sub-section (1) or sub-section (2) audited by the Comptroller and Auditor-General in a financial year, he shall continue to audit the receipts and expenditure of that body or authority for a further period of two years notwithstanding that the conditions specified in sub-section (1) or sub-section (2) are not fulfilled during any of the two subsequent years.
                </p>
              </div>
            </div>

            {/* Section 15 */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Functions of Comptroller and Auditor-General in the Case of Grants or Loans given to other Authorities or Bodies
              </p>
              <p className="m-0">
                Where any grant or loan is given for any specific purpose from the Consolidated Fund of India or of any State or of any Union territory having a Legislative Assembly to any authority or body, not being a foreign State or international organisation, the Comptroller and Auditor-General shall scrutinise the procedures by which the sanctioning authority satisfies itself as to the fulfilment of the conditions subject to which such grants or loans were given and shall for this purpose have right of access, after giving reasonable previous notice, to the books and accounts of that authority or body:
              </p>
              <p className="m-0 pl-4">
                Provided that the President, the Governor of a State or the Administrator of a Union territory having a Legislative Assembly, as the case may be, may, where he is of opinion that it is necessary so to do in the public interest, by order, relieve the Comptroller and Auditor-General, after consultation with him, from making any such scrutiny in respect of any body or authority receiving such grant or loan.
              </p>
              <p className="m-0">
                Except where he is authorised so to do by the President, the Governor of a State or the Administrator of Union territory having a Legislative Assembly, as the case may be, the Comptroller and Auditor-General shall not have, while exercising the powers conferred on him by sub-section (1), right of access to the books and accounts of any corporation to which any such grant or loan as is referred to in subsection (1) is given if the law by or under which such corporation has been established provides for the audit of the accounts of such corporation by an agency other than the Comptroller and Auditor-General:
              </p>
              <p className="m-0 pl-4">
                Provided that no such authorisation shall be made except after consultation with the Comptroller and Auditor-General and except after giving the concerned corporation a reasonable opportunity of making representations with regard to the proposal to give to the Comptroller and Auditor-General right of access to its books and accounts.
              </p>
            </div>

            {/* Section 16 */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Audit of Receipts of Union or of States
              </p>
              <p className="m-0">
                It shall be the duty of the Comptroller and Auditor-General to audit all receipts which are payable into the Consolidated Fund of India and of each State and of each Union territory having a Legislative Assembly and to satisfy himself that the rules and procedures in that behalf are designed to secure an effective check on the assessment, collection and proper allocation of revenue and are being duly observed and to make for this purpose such examination of the accounts as he thinks fit and report thereon.
              </p>
            </div>

            {/* Section 17 */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="m-0">
                Audit of accounts of stores and stock
              </p>
              <p className="m-0">
                17. The Comptroller and Auditor-General shall have authority to audit and report on the accounts of stores and stock kept in any office or department of the Union or of a State.
              </p>
            </div>

            {/* Section 18 */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Powers of Comptroller and Auditor-General in connection with audit of accounts
              </p>
              <p className="m-0">
                1. The Comptroller and Auditor-General shall in connection with the performance of his duties under this Act, have authority-
              </p>
              <div className="flex flex-col gap-1.5 pl-4">
                <p className="m-0">
                  a. to inspect any office of accounts under the control of the union or of a State, including treasuries, and such offices responsible for the keeping of initial or subsidiary accounts, as submit accounts to him;
                </p>
                <p className="m-0">
                  b. to require that any accounts, books, papers and other documents which deal with or form the basis of or are otherwise relevant to the transactions to which his duties in respect of audit extend, shall be sent to such place as he may appoint for his inspection;
                </p>
                <p className="m-0">
                  c. to put such questions or make such observations as he may consider necessary, to the person in charge of the office and to call for such information as he may require for the preparation of any account or report which it is his duty to prepare.
                </p>
              </div>
              <p className="m-0">
                2. The person in charge of any office or department, the accounts of which have to be inspected and audited by the Comptroller and Auditor-General, shall afford all facilities for such inspection and comply with requests for information in as complete a form as possible and with all reasonable expedition.
              </p>
            </div>

            {/* Section 19 */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Audit of Government companies and corporations
              </p>
              <p className="m-0">
                1. The duties and powers of the Comptroller and Auditor-General in relation to the audit of the accounts of Government companies shall be performed and exercised by him in accordance with the provisions of the Companies Act, 1956 (1 of 1956).
              </p>
              <p className="m-0">
                2. The duties and powers of the Comptroller and Auditor-General in relation to the audit of the accounts of corporations (not being companies) established by or under law made by Parliament shall be performed and exercised by him in accordance with the provisions of the respective legislations.
              </p>
              <p className="m-0">
                3. The Governor of a State or the Administrator of a Union territory having a Legislative Assembly may, where he is of opinion that it is necessary in the public interest so to do, request the Comptroller and Auditor-General to audit the accounts of a corporation established by law made by the Legislature of the State or of the Union territory, as the case may be, and where such request has been made, the Comptroller and Auditor-General shall audit the accounts of such corporation and shall have, for the purposes of such audit, right of access to the books and accounts of such corporation:
              </p>
              <p className="m-0 pl-4">
                Provided that no such request shall be made except after consultation with the Comptroller and Auditor-General and except after giving reasonable opportunity to the corporation to make representations with regard to the proposal for such audit.
              </p>
            </div>

            {/* Section 20 */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Laying of reports in relation to accounts of Government companies and corporation
              </p>
              <p className="m-0">
                1. The reports of the Comptroller and Auditor-General, in relation to audit of accounts of a Government company or a corporation referred to in section 19, shall be submitted to the Government or Governments concerned.
              </p>
              <p className="m-0">
                2. The Central Government shall cause every report received by it under sub-section (1) to be laid, as soon as may be after it is received, before each House of Parliament
              </p>
              <p className="m-0">
                3. The State Government shall cause every report received by it under sub-section (1) to be laid, as soon as may be after it is received, before the Legislature of the State.
              </p>
              <p className="m-0">
                Explanation : For the purposes of this section &ldquo;Government&rdquo; or &ldquo;State Government&rdquo; in relation to a Union Territory having a Legislative Assembly, means the Administrator of the Union territory.
              </p>
            </div>

            {/* Audit of accounts of certain authorities */}
            <div className="flex flex-col gap-2 mt-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Audit of accounts of certain authorities or bodies
              </p>
              <p className="m-0">
                1. Save as otherwise provided in section 19, where the audit of the accounts of any body or authority has not been entrusted to the Comptroller and Auditor-General by or under any law made by Parliament, he shall, if requested so to do by the President or the Governor of a State or the Administrator of a Union territory having a Legislative Assembly, as the case may be, undertake the audit of the accounts of such body or authority on such terms and conditions as may be agreed upon between him and the concerned Government and shall have, for the purposes of such audit, right of access to the books and accounts of that body or authority:
              </p>
              <p className="m-0 pl-4">
                Provided that no such request shall be made except after consultation with the Comptroller and Auditor-General.
              </p>
              <p className="m-0">
                2. The Comptroller and Auditor-General may propose to the President or the Governor of a State or the Administrator of a Union territory having a Legislative Assembly, as the case may be, that he may authorised to undertake the audit of accounts of any body or authority, the audit of the account of which has not been entrusted to him by law, if he is of opinion that such audit is necessary because a substantial amount has been invested in, or advanced to, such body or authority by the Central or State Government or by the Government of a Union territory having a Legislative Assembly, and on such request being made, the President or the Governor or the Administrator, as the case may be, may empower the Comptroller and Auditor-General to undertake the audit of the accounts of such body or authority.
              </p>
              <p className="m-0">
                3. The audit referred to in sub-section (1) or sub-section (2) shall not be entrusted to the Comptroller and Auditor-General except where the President or the Governor of a State or the Administrator of a Union territory having a Legislative Assembly, as the case may be, is satisfied that it is expedient so to do in the public interest and except after giving a reasonable opportunity to the concerned body or authority to make representations with regard to the proposal for such audit.
              </p>
            </div>
          </section>

          {/* ==================== CHAPTER 4 ==================== */}
          <section className="flex flex-col gap-3 w-full">
            <h3
              style={{
                fontFamily: 'Noto Sans, sans-serif',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '28px',
                color: '#751639',
                margin: 0
              }}
            >
              Ch 4 - Miscellaneous
            </h3>

            {/* Section 21 */}
            <div className="flex flex-col gap-2">
              <p
                className="m-0"
                style={{
                  fontWeight: 500
                }}
              >
                Delegation of Power of Comptroller and Auditor-General
              </p>
              <p className="m-0">
                21. Any power exercisable by the Comptroller and Auditor-General under the provisions of this Act, or any other law may be exercised by such officer of his department as may be authorised by him in this behalf by general or special order.
              </p>
              <p className="m-0 pl-4">
                Provided that except during the absence of the Comptroller and Auditor-General on leave or otherwise, no officer shall be authorised to submit on behalf of the Comptroller and Auditor-General any report which the Comptroller and Auditor-General is required by the Constitution or the Government of Union Territories Act, 1963 (20 of 1963) to submit to the President or the Governor of a State or the Administrator of a Union territory having a Legislative Assembly, as the case may be.
              </p>
            </div>

            {/* Section 22 */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="m-0">
                22
              </p>
              <p className="m-0">
                1. The Central Government may, after consultation with the Comptroller and Auditor-General, by notification in the official Gazette, make rules for carrying out the provisions of this Act in so far as they relate to the maintenance of accounts.
              </p>
              <p className="m-0">
                2. In particular, and without prejudice to the generality of the foregoing power, such rules may provide for all or any of the following matters, namely:-
              </p>
              <div className="flex flex-col gap-1 pl-4">
                <p className="m-0">
                  a. the manner in which initial and subsidiary accounts shall be kept by the treasuries, offices and departments rendering accounts to audit and accounts offices;
                </p>
                <p className="m-0">
                  b. the manner in which the accounts of the Union or of a State or of any particular service or department or of any particular class or character, in respect of which the Comptroller and Auditor-General has been relieved from the responsibility of compiling or keeping the accounts, shall be compiled or kept;
                </p>
                <p className="m-0">
                  c. the manner in which the accounts of stores and stock shall be kept in any office or department of the Union or of a State, as the case may be;
                </p>
                <p className="m-0">
                  d. any other matter which is required to be. or may be, prescribed by rules
                </p>
              </div>
              <div className="flex flex-col">
                <p className="m-0">
                  3. Every rule made under this section shall be laid, as soon as may be after it is made, before each House of Parliament, while it is in session, for a total period of thirty day&apos;s which may be comprised in one Session or in two or more successive sessions, and if, before the expiry of the session immediately following the session or the successive sessions aforesaid both Houses agree in making any modification in the rule or both Houses agree that the rules should not be made, the rule shall thereafter have effect only in such modified form or be of no effect, as the case may be; so, however, that any such modification or annulment shall be without prejudice to the validity of anything previously done under that rule.
                </p>
                <p
                  className="m-0"
                  style={{
                    fontWeight: 500
                  }}
                >
                  Power to make regulations
                </p>
                <p className="m-0">
                  23. The Comptroller and Auditor-General is hereby authorised to make regulations for carrying into effect the provisions of this Act in so far as they related to the scope and extent of audit, including laying down for the guidance of the Government Departments the general principles of Government accounting and the broad principles in regard to audit of receipts and expenditure.
                </p>
                <p className="m-0">
                  Power to dispense with detailed audit
                </p>
                <p className="m-0">
                  24. The Comptroller and Auditor-General is hereby authorised to dispense with, when circumstances so warrant, any part of detailed audit of any accounts or class of transactions and to apply such limited check in relation to such accounts or transactions as he may determine.
                </p>
                <p className="m-0">
                  Repeal
                </p>
                <p className="m-0">
                  25. The Comptroller and Auditor-General (Conditions of Service) Act 1953,(21 of 1953) is hereby repealed.
                </p>
                <p className="m-0">
                  Removal of doubts
                </p>
                <p className="m-0">
                  26. For removal of doubts, it is hereby declared that on the commencement of this Act the Government of India (Audit and Accounts) Order, 1936, as adapted by the India (Provisional Constitution) Order, 1947, shall cease to be in force except as respects anything done or any action taken thereunder.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AboutLayout>
  );
}

export default function DutiesPowersActPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639]">Loading Duties &amp; Powers Act...</div>}>
      <DutiesPowersActContent />
    </Suspense>
  );
}

