'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import { dataManager } from '@/lib/dataManager';
import { Plus, Trash2 } from 'lucide-react';

interface ArticleItem {
  id: string;
  titleEn: string;
  titleHi: string;
  subEn?: string;
  subHi?: string;
  clausesEn: string[];
  clausesHi: string[];
  listType?: 'disc' | 'decimal';
  footnotes?: string[];
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-148',
    titleEn: 'Article 148 - Comptroller and Auditor-General of India',
    titleHi: 'अनुच्छेद 148 - भारत के नियंत्रक और महालेखापरीक्षक',
    listType: 'disc',
    clausesEn: [
      'There shall be a Comptroller and Auditor-General of India who shall be appointed by the President by warrant under his hand and seal and shall only be removed from office in like manner and on like grounds as a Judge of the Supreme Court.',
      'Every person appointed to be the Comptroller and Auditor-General of India shall, before he enters upon his office, make and subscribe before the President or some person appointed in that behalf by him, an oath or affirmation according to the form set out for the purpose in the Third Schedule.',
      'The salary and other conditions of service of the Comptroller and Auditor-General shall be such as may be determined by Parliament by law and, until they are so determined, shall be as specified in the Second Schedule: Provided that neither the salary of a Comptroller and Auditor-General nor his rights in respect of leave of absence, pension or age of retirement shall be varied to his disadvantage after his appointment.',
      'The Comptroller and Auditor-General shall not be eligible for further office either under the Government of India or under the Government of any State after he has ceased to hold his office.',
      'Subject to the provisions of this Constitution and of any law made by parliament, the conditions of service of persons serving in the Indian Audit and Accounts Department and the administrative powers of the Comptroller and Auditor-General shall be such as may be prescribed by rules made by the President after consultation with the Comptroller and Auditor-General.',
      'The administrative expenses of the office of the Comptroller and Auditor-General including all salaries, allowances and pensions payable to or in respect of persons serving in that office, shall be charged upon the Consolidated Fund of India.'
    ],
    clausesHi: [
      'भारत का एक नियंत्रक और महालेखापरीक्षक होगा जिसे राष्ट्रपति द्वारा अपने हस्ताक्षर और मुद्रा सहित अधिपत्र द्वारा नियुक्त किया जाएगा और उसे केवल उसी रीति से और उन्हीं आधारों पर हटाया जाएगा जिस रीति से और जिन आधारों पर उच्चतम न्यायालय के न्यायाधीश को हटाया जाता है।',
      'भारत के नियंत्रक और महालेखापरीक्षक के रूप में नियुक्त प्रत्येक व्यक्ति अपना पद ग्रहण करने से पहले राष्ट्रपति या उसके द्वारा इस निमित्त नियुक्त व्यक्ति के समक्ष तीसरी अनुसूची में इस प्रयोजन के लिए दिए गए प्रपत्र के अनुसार शपथ लेगा या प्रतिज्ञान करेगा और उस पर हस्ताक्षर करेगा।',
      'नियंत्रक और महालेखापरीक्षक का वेतन और सेवा की अन्य शर्तें ऐसी होंगी जो संसद द्वारा विधि द्वारा अवधारित की जाएं और, जब तक वे इस प्रकार अवधारित नहीं की जाती हैं, तब तक वैसी होंगी जैसी दूसरी अनुसूची में विनिर्दिष्ट हैं: परन्तु नियंत्रक और महालेखापरीक्षक के वेतन में तथा अनुपस्थिति की छुट्टी, पेंशन या सेवानिवृत्ति की आयु के संबंध में उसके अधिकारों में उसकी नियुक्ति के पश्चात उसके लिए अलाभकारी परिवर्तन नहीं किया जाएगा।',
      'नियंत्रक और महालेखापरीक्षक अपने पद पर न रहने के पश्चात भारत सरकार के या किसी राज्य की सरकार के अधीन किसी और पद का पात्र नहीं होगा।',
      'इस संविधान के और संसद द्वारा बनाई गई किसी विधि के उपबंधों के अधीन रहते हुए, भारतीय लेखापरीक्षा और लेखा विभाग में सेवा करने वाले व्यक्तियों की सेवा की शर्तें और नियंत्रक और महालेखापरीक्षक की प्रशासनिक शक्तियां ऐसी होंगी जो नियंत्रक और महालेखापरीक्षक से परामर्श करने के पश्चात राष्ट्रपति द्वारा बनाए गए नियमों द्वारा विहित की जाएं।',
      'नियंत्रक और महालेखापरीक्षक के कार्यालय के प्रशासनिक व्यय, जिनके अंतर्गत उस कार्यालय में सेवा करने वाले व्यक्तियों को या उनके संबंध में संदेह सभी वेतन, भत्ते और पेंशन हैं, भारत की संचित निधि पर भारित होंगे।'
    ]
  },
  {
    id: 'art-149',
    titleEn: 'Article 149 - Duties and Powers of the Comptroller and Auditor-General',
    titleHi: 'अनुच्छेद 149 - नियंत्रक और महालेखापरीक्षक के कर्तव्य और शक्तियां',
    listType: 'disc',
    clausesEn: [
      'The Comptroller and Auditor-General shall perform such duties and exercise such powers in relation to the accounts of the Union and of the States and of any other authority or body as may be prescribed by or under any law made by Parliament and, until provision in that behalf is so made, shall perform such duties and exercise such powers in relation to the accounts of the Union and of the States as were conferred on or exercisable by the Auditor-General of India immediately before the commencement of this Constitution in relation to the accounts of the Dominion of India and of the provinces respectively.'
    ],
    clausesHi: [
      'नियंत्रक और महालेखापरीक्षक संघ के और राज्यों के तथा किसी अन्य प्राधिकारी या निकाय के लेखाओं के संबंध में ऐसे कर्तव्यों का पालन और ऐसी शक्तियों का प्रयोग करेगा जो संसद द्वारा बनाई गई किसी विधि द्वारा या उसके अधीन विहित किए जाएं और, जब तक इस निमित्त उपबंध इस प्रकार नहीं किया जाता है तब तक, संघ के और राज्यों के लेखाओं के संबंध में ऐसे कर्तव्यों का पालन और ऐसी शक्तियों का प्रयोग करेगा जो इस संविधान के प्रारंभ से ठीक पहले क्रमशः भारत डोमिनियन के और प्रांतों के लेखाओं के संबंध में भारत के महालेखापरीक्षक को प्रदत्त थीं या उसके द्वारा प्रयोक्तव्य थीं।'
    ]
  },
  {
    id: 'art-150',
    titleEn: 'Article 150 - Form of Accounts of The Union and of The States',
    titleHi: 'अनुच्छेद 150 - संघ के और राज्यों के लेखाओं का प्ररूप',
    listType: 'disc',
    clausesEn: [
      'The accounts of the Union and of the States shall be kept in such form as the President may, on the advice of the Comptroller and Auditor-General of India, prescribe.'
    ],
    clausesHi: [
      'संघ के और राज्यों के लेखाओं को ऐसे प्ररूप में रखा जाएगा जो राष्ट्रपति, भारत के नियंत्रक और महालेखापरीक्षक की सलाह पर विहित करे।'
    ]
  },
  {
    id: 'art-151',
    titleEn: 'Article 151 - Audit Reports',
    titleHi: 'अनुच्छेद 151 - लेखापरीक्षा प्रतिवेदन',
    listType: 'disc',
    clausesEn: [
      'The reports of the Comptroller and Auditor-General of India relating to the accounts of the Union shall be submitted to the president, who shall cause them to be laid before each House of Parliament.',
      'The reports of the Comptroller and Auditor-General of India relating to the accounts of a State shall be submitted to the Governor of the State, who shall cause them to be laid before the Legislature of the State.'
    ],
    clausesHi: [
      'भारत के नियंत्रक और महालेखापरीक्षक के संघ के लेखाओं से संबंधित प्रतिवेदनों को राष्ट्रपति के समक्ष प्रस्तुत किया जाएगा, जो उनको संसद के प्रत्येक सदन के समक्ष रखवाएगा।',
      'भारत के नियंत्रक और महालेखापरीक्षक के किसी राज्य के लेखाओं से संबंधित प्रतिवेदनों को राज्य के राज्यपाल के समक्ष प्रस्तुत किया जाएगा, जो उनको राज्य के विधान-मंडल के समक्ष रखवाएगा।'
    ]
  },
  {
    id: 'art-279',
    titleEn: 'Article 279 - Calculation of "net proceeds", etc.',
    titleHi: 'अनुच्छेद 279 - "शुद्ध आगम" आदि की गणना',
    listType: 'decimal',
    clausesEn: [
      'In the foregoing provisions of this Chapter, "net proceeds" means in relation to any tax or duty the proceeds thereof reduced by the cost of collection, and for the purposes of those provisions the net proceeds of any tax or duty, or of any part of any tax or duty, in or attributable to any area shall be ascertained and certified by the Comptroller and Auditor-General of India, whose certificate shall be final.',
      'Subject as aforesaid, and to any other express provision of this Chapter, a law made by Parliament or an order of the President may, in any case where under this Part the proceeds of any duty or tax are, or may be, assigned to any State, provide for the manner in which the proceeds are to be calculated, for the time from or at which and the manner in which any payments are to be made, for the making of adjustments between one financial year and another, and for any other incidental or ancillary matters.'
    ],
    clausesHi: [
      'इस अध्याय के पूर्वगामी उपबंधों में "शुद्ध आगम" से किसी कर या शुल्क के संबंध में उसका वह आगम अभिप्रेत है जो उसके संग्रहण के खर्चों को घटाकर आए और उन उपबंधों के प्रयोजनों के लिए किसी क्षेत्र में या उससे अंतर्भूत किसी कर या शुल्क का अथवा उसके किसी भाग का शुद्ध आगम भारत के नियंत्रक और महालेखापरीक्षक द्वारा अवधारित और प्रमाणित किया जाएगा और उसका प्रमाण-पत्र अंतिम होगा।',
      'जैसा कि ऊपर कहा गया है उसके और इस अध्याय के किसी अन्य स्पष्ट उपबंध के अधीन रहते हुए, संसद द्वारा बनाई गई किसी विधि द्वारा या राष्ट्रपति के किसी आदेश द्वारा, ऐसे किसी भी मामले में जहां इस भाग के अधीन किसी शुल्क या कर का आगम किसी राज्य को सौंपा गया है या सौंपा जा सकता है, उस रीति का उपबंध किया जा सकता है जिसमें आगम की गणना की जानी है, उस समय का उपबंध किया जा सकता है जिससे या जिस पर तथा उस रीति का उपबंध किया जा सकता है जिसमें कोई संदाय किए जाने हैं, एक वित्तीय वर्ष और दूसरे वित्तीय वर्ष के बीच समायोजन करने का और किसी अन्य प्रासंगिक या आनुषंगिक विषय का उपबंध किया जा सकता है।'
    ]
  },
  {
    id: 'sch-3',
    titleEn: 'Third Schedule',
    titleHi: 'तीसरी अनुसूची',
    subEn: 'Section IV of the Third Schedule of the Constitution of India prescribes the following form of oath or affirmation to be made by the Judges of the Supreme Court and the Comptroller and Auditor-General of India at the time of assumption of office:',
    subHi: 'भारत के संविधान की तीसरी अनुसूची का खंड IV उच्चतम न्यायालय के न्यायाधीशों और भारत के नियंत्रक और महालेखापरीक्षक द्वारा पद ग्रहण के समय ली जाने वाली शपथ या प्रतिज्ञान का निम्नलिखित प्रपत्र विहित करता है:',
    listType: 'disc',
    clausesEn: [
      '“I, A.B., having been appointed Chief Justice (or a Judge) of the Supreme Court of India (or Comptroller and Auditor-General of India) do swear in the name of God (or solemnly affirm) that I will bear true faith and allegiance to the Constitution of India as by law established, that I will uphold the sovereignty and integrity of India, that I will duly and faithfully and to the best of my ability, knowledge and judgment perform the duties of my office without fear or favour, affection or ill-will and that I will uphold the Constitution and the laws.”'
    ],
    clausesHi: [
      '“मैं, अ.ब., जो भारत के उच्चतम न्यायालय का मुख्य न्यायाधीश (या न्यायाधीश) (या भारत का नियंत्रक और महालेखापरीक्षक) नियुक्त हुआ हूँ, ईश्वर की शपथ लेता हूँ (या सत्यनिष्ठा से प्रतिज्ञान करता हूँ) कि मैं विधि द्वारा स्थापित भारत के संविधान के प्रति सच्ची श्रद्धा और निष्ठा रखूँगा, मैं भारत की प्रभुता और अखंडता को अक्षुण्ण रखूँगा तथा मैं भय या पक्षपात, अनुराग या द्वेष के बिना, अपनी पूरी योग्यता, ज्ञान और विवेक से अपने पद के कर्तव्यों का श्रद्धापूर्वक और शुद्ध अंतःकरण से पालन करूँगा तथा मैं संविधान और विधियों की मर्यादा बनाए रखूँगा।”'
    ]
  },
  {
    id: 'sch-6',
    titleEn: 'Sixth Schedule',
    titleHi: 'छठी अनुसूची',
    subEn: '[Articles 244(2) and 275(1)]Provisions as to the Administration of Tribal Areas in [1][ the States of Assam, Meghalaya, Tripura and Mizoram\n7.District and Regional Funds.',
    subHi: '[अनुच्छेद 244(2) और 275(1)] असम, मेघालय, त्रिपुरा और मिजोरम राज्यों के जनजातीय क्षेत्रों के प्रशासन के बारे में उपबंध\n7. जिला और क्षेत्रीय निधियां।',
    listType: 'decimal',
    clausesEn: [
      'There shall be constituted for each autonomous district, a District Fund and for each autonomous region, a Regional Fund to which shall be credited all moneys received respectively by the District Council for that district and the Regional Council for that region in the course of the administration of such district or region, as the case may be, in accordance with the provisions of this Constitution.',
      'The Governor may make rules for the management of the District Fund, or, as the case may be, the Regional Fund and for the procedure to be followed in respect of payment of money into the said Fund, the withdrawal of moneys therefrom, the custody of moneys therein and any other matter connected with or ancillary to the matters aforesaid.',
      'The accounts of the District Council or, as the case may be, the Regional Council shall be kept in such form as the Comptroller and Auditor General of India may, with the approval of the President, prescribe.',
      'The Comptroller and Auditor-General shall cause the accounts of the District and Regional Councils to be audited in such manner as he may think fit, and the reports of the Comptroller and Auditor-General relating to such accounts shall be submitted to the Governor who shall cause them to be laid before the Council.'
    ],
    clausesHi: [
      'प्रत्येक स्वायत्त जिले के लिए एक जिला निधि और प्रत्येक स्वायत्त क्षेत्र के लिए एक क्षेत्रीय निधि गठित की जाएगी, जिसमें यथास्थिति उस जिले की जिला परिषद या उस क्षेत्र की क्षेत्रीय परिषद द्वारा उस जिले या क्षेत्र के प्रशासन के दौरान इस संविधान के उपबंधों के अनुसार प्राप्त सभी धन जमा किए जाएंगे।',
      'राज्यपाल, यथास्थिति, जिला निधि या क्षेत्रीय निधि के प्रबंध के लिए और उक्त निधि में धन के संदाय के संबंध में, उससे धन निकालने, उसमें रखे धन की अभिरक्षा और पूर्वोक्त विषयों से संबंधित या आनुषंगिक किसी अन्य विषय के संबंध में अनुसरण की जाने वाली प्रक्रिया के लिए नियम बना सकेगा।',
      'यथास्थिति, जिला परिषद या क्षेत्रीय परिषद के लेखा ऐसे प्ररूप में रखे जाएंगे जो भारत का नियंत्रक और महालेखापरीक्षक, राष्ट्रपति के अनुमोदन से, विहित करे।',
      'नियंत्रक और महालेखापरीक्षक जिला और क्षेत्रीय परिषदों के लेखाओं की लेखापरीक्षा ऐसी रीति से करवाएगा जो वह ठीक समझे, और ऐसे लेखाओं से संबंधित नियंत्रक और महालेखापरीक्षक के प्रतिवेदनों को राज्यपाल के समक्ष प्रस्तुत किया जाएगा जो उनको परिषद के समक्ष रखवाएगा।'
    ],
    footnotes: [
      '1. Subs. by the State of Mizoram Act, 1986 (34 of 1986), s. 39, for certain words (w.e.f. 20-2-1987).',
      '2. Subs. by the Assam Reorganisation (Meghalaya) Act, 1969 (55 of 1969), s. 74 and Fourth Sch., for sub-paragraph',
      '3. (w.e.f. 2-4-1970).'
    ]
  }
];

function ConstitutionalProvisionsContent() {
  const searchParams = useSearchParams();
  const isAdminEdit = searchParams.get('admin_edit') === 'true';

  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [pageTitleEn, setPageTitleEn] = useState('Constitutional Provisions');
  const [pageTitleHi, setPageTitleHi] = useState('संवैधानिक प्रावधान');
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);

  // Synchronized Ref for live message handling
  const stateRef = React.useRef({ pageTitleEn, pageTitleHi, articles });
  useEffect(() => {
    stateRef.current = { pageTitleEn, pageTitleHi, articles };
  }, [pageTitleEn, pageTitleHi, articles]);

  useEffect(() => {
    let isMounted = true;
    const currentLang = dataManager.getLanguage();
    setLang(currentLang);

    const fetchAll = () => {
      dataManager.fetchPageData('page-constitutional-provisions', 'en').then((res) => {
        if (isMounted && res) {
          if (res.title) setPageTitleEn(res.title);
          if (res.content && typeof res.content === 'string') {
            const trimmed = res.content.trim();
            if (trimmed.startsWith('[') || (trimmed.startsWith('{') && trimmed.includes('title'))) {
              try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed) && parsed.length > 0) setArticles(parsed);
              } catch (e) { }
            }
          }
        }
      });

      dataManager.fetchPageData('page-constitutional-provisions', 'hi').then((res) => {
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
            desc: 'Articles 148 to 151, 279, Third and Sixth Schedules of the Constitution of India',
            content_val: JSON.stringify(cur.articles),
            content_hi_val: JSON.stringify(cur.articles)
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

  const isHindi = lang === 'हिन्दी';
  const pageTitle = isHindi ? pageTitleHi : pageTitleEn;

  const updateArticle = (index: number, field: keyof ArticleItem, val: any) => {
    const updated = [...articles];
    updated[index] = { ...updated[index], [field]: val };
    setArticles(updated);
  };

  const updateClause = (artIdx: number, clauseIdx: number, val: string) => {
    const updated = [...articles];
    const targetKey = isHindi ? 'clausesHi' : 'clausesEn';
    const clauses = [...(updated[artIdx][targetKey] || [])];
    clauses[clauseIdx] = val;
    updated[artIdx] = { ...updated[artIdx], [targetKey]: clauses };
    setArticles(updated);
  };

  const addClause = (artIdx: number) => {
    const updated = [...articles];
    if (isHindi) {
      updated[artIdx].clausesHi = [...(updated[artIdx].clausesHi || []), 'नया संवैधानिक खंड यहाँ जोड़ें...'];
    } else {
      updated[artIdx].clausesEn = [...(updated[artIdx].clausesEn || []), 'Enter new constitutional clause here...'];
    }
    setArticles(updated);
  };

  const removeClause = (artIdx: number, clauseIdx: number) => {
    const updated = [...articles];
    if (isHindi) {
      updated[artIdx].clausesHi = updated[artIdx].clausesHi.filter((_, i) => i !== clauseIdx);
    } else {
      updated[artIdx].clausesEn = updated[artIdx].clausesEn.filter((_, i) => i !== clauseIdx);
    }
    setArticles(updated);
  };

  const editFieldClass = isAdminEdit
    ? 'hover:ring-2 hover:ring-[#751639] hover:ring-dashed focus:ring-2 focus:ring-[#751639] focus:outline-none transition-all rounded p-1 cursor-text'
    : '';

  return (
    <AboutLayout title={pageTitle}>
      <div className="flex flex-col items-start w-full max-w-[978px]">
        {/* Page Title */}
        <h1 
          className={`text-2xl font-bold mb-6 text-left self-start ${editFieldClass}`}
          style={{
            fontFamily: 'Noto Sans, sans-serif',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '160%',
            color: '#751639'
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

        {/* Content Container */}
        <div className="flex flex-col gap-8 w-full text-left">
          {articles.map((art, aIdx) => {
            const artTitle = isHindi ? art.titleHi : art.titleEn;
            const artSub = isHindi ? art.subHi : art.subEn;
            const clauses = isHindi ? (art.clausesHi || art.clausesEn) : art.clausesEn;

            return (
              <section key={art.id || aIdx} className="flex flex-col gap-3">
                {/* Article Header */}
                <h2 
                  className={editFieldClass}
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
                  onBlur={(e) => updateArticle(aIdx, isHindi ? 'titleHi' : 'titleEn', e.currentTarget.textContent || '')}
                >
                  {artTitle}
                </h2>

                {/* Optional Subtitle */}
                {artSub && (
                  <p 
                    className={`m-0 ${editFieldClass}`}
                    style={{
                      fontFamily: 'Noto Sans, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '24px',
                      color: '#751639'
                    }}
                    contentEditable={isAdminEdit}
                    suppressContentEditableWarning
                    onBlur={(e) => updateArticle(aIdx, isHindi ? 'subHi' : 'subEn', e.currentTarget.textContent || '')}
                  >
                    {artSub}
                  </p>
                )}

                {/* Clauses List */}
                <ul 
                  className="space-y-3 m-0"
                  style={{
                    fontFamily: 'Noto Sans, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '28px',
                    color: '#2A2A2A',
                    listStyleType: art.listType === 'decimal' ? 'decimal' : 'disc',
                    paddingLeft: '24px'
                  }}
                >
                  {clauses.map((clause, cIdx) => (
                    <li key={cIdx} className="relative group" style={{ display: 'list-item', listStyleType: art.listType === 'decimal' ? 'decimal' : 'disc' }}>
                      <span
                        className={editFieldClass}
                        contentEditable={isAdminEdit}
                        suppressContentEditableWarning
                        onBlur={(e) => updateClause(aIdx, cIdx, e.currentTarget.textContent || '')}
                      >
                        {clause}
                      </span>
                      {isAdminEdit && (
                        <button
                          type="button"
                          onClick={() => removeClause(aIdx, cIdx)}
                          className="absolute -right-7 top-0 text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                          title="Remove clause"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {isAdminEdit && (
                  <button
                    type="button"
                    onClick={() => addClause(aIdx)}
                    className="self-start mt-1 px-2.5 py-1 border border-dashed border-[#751639] text-[#751639] hover:bg-pink-50 text-[11px] font-semibold rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Clause to {artTitle.split('-')[0]}</span>
                  </button>
                )}

                {/* Footnotes */}
                {art.footnotes && art.footnotes.length > 0 && (
                  <div 
                    className="mt-4 flex flex-col gap-2"
                    style={{
                      fontFamily: 'Noto Sans, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '24px',
                      color: '#2A2A2A'
                    }}
                  >
                    {art.footnotes.map((fn, fIdx) => (
                      <p key={fIdx} className={`m-0 ${editFieldClass}`} contentEditable={isAdminEdit} suppressContentEditableWarning>
                        {fn}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </AboutLayout>
  );
}

export default function ConstitutionalProvisionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#751639]">Loading Constitutional Provisions...</div>}>
      <ConstitutionalProvisionsContent />
    </Suspense>
  );
}


