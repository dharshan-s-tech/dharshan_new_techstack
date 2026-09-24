export interface SubmenuItem {
  title: string;
  titleHi?: string;
  href?: string;
}

export interface SubmenuColumn {
  heading?: string;
  headingHi?: string;
  items?: SubmenuItem[];
}

export interface TopNavItem {
  id: string;
  title: string;
  titleHi: string;
  href?: string;
  columns?: SubmenuColumn[];
}

/**
 * State-specific Citizens Charter PDF documents mapped from CloudFront CDN
 */
export const STATE_CITIZEN_CHARTER_PDFS: Record<string, string> = {
  'andhra-pradesh': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0643e81853c6471-79510511.pdf',
  'bihar': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-Appd-20200812133247.pdf',
  'gujarat': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-charter-draft-20200604163433.pdf',
  'gwalior-ii': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0670f5f2ca08657-22520009.pdf',
  'madhya-pradesh': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0670f5f2ca08657-22520009.pdf',
  'mumbai': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-English-20200914135753.pdf',
  'maharashtra': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-English-20200914135753.pdf',
  'punjab': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-065c5ce6d10ce03-85669313.pdf',
  'tamil-nadu': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/citizen-charter-pdf-069d6432a6bde45-29448626.pdf',
  'telangana': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0643e81853c6471-79510511-065af673f958e56-69735414.pdf',
  'allahabad-ii': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/charter-english-064be54d1637303-15810192-06666afd287ffb4-35134378-0684c131e8027d9-68245729.pdf',
  'uttar-pradesh': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/charter-english-064be54d1637303-15810192-06666afd287ffb4-35134378-0684c131e8027d9-68245729.pdf',
  'arunachal-pradesh': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-charter-draft-20200625152654.pdf',
  'uttarakhand': 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/citizen-charter-063fc49b24c74e2-64144570.pdf'
};

export const ANDHRA_PRADESH_NAV_ITEMS: TopNavItem[] = [
  {
    id: 'about',
    title: 'About Us',
    titleHi: 'हमारे बारे में',
    columns: [
      {
        heading: 'About Us',
        headingHi: 'हमारे बारे में',
        items: [
          { title: 'Profile of PAG', titleHi: 'पीएजी का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
          { title: 'Profile of Group Officers', titleHi: 'समूह अधिकारियों का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-Group-Officers' },
          { title: 'Mandate', titleHi: 'अधिदेश', href: '/states/andhra-pradesh/About-Us/Mandate' },
          { title: 'Our Vision, Mission & Core Values', titleHi: 'हमारा विजन, मिशन और मूल मूल्य', href: '/states/andhra-pradesh/About-Us/Our-Vision,-Mission-&-Core-Values' },
        ]
      },
      {
        heading: 'Organisation Chart',
        headingHi: 'संगठन संरचना',
        items: [
          { title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
          { title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
        ]
      }
    ]
  },
  {
    id: 'functions',
    title: 'Functions',
    titleHi: 'कार्य प्रणाली',
    columns: [
      {
        heading: 'Administration',
        headingHi: 'प्रशासन',
        items: [
          { title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
          { title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
          { title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Allotment-and-Exp-for-3-FYs-1-068761dfd13b719-12844361.pdf' },
          { title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
          { title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
          { title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
          { title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/mgp-20200623172228.pdf' },
          { title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण एवं पदस्थापन दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
          { title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति (आईसीसी)', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
          { title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
          { title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
        ]
      },
      {
        heading: 'Core Operations',
        headingHi: 'मुख्य कार्य',
        items: [
          { title: 'Accounts & VLC', titleHi: 'लेखा एवं वीएलसी', href: '/states/andhra-pradesh/Functions/Accounts-VLC' },
          { title: 'Pension', titleHi: 'पेंशन', href: '/states/andhra-pradesh/Functions/Pension' },
          { title: 'GPF', titleHi: 'जीपीएफ', href: '/states/andhra-pradesh/Functions/GPF' },
          { title: 'Welfare', titleHi: 'कल्याण', href: '/states/andhra-pradesh/Functions/Welfare' }
        ]
      },
      {
        heading: 'Treasury Inspection',
        headingHi: 'कोषागार निरीक्षण',
        items: [
          { title: 'About Treasury Functions', titleHi: 'कोषागार कार्यों के बारे में', href: '/states/andhra-pradesh/Functions/Treasury-Inspection' }
        ]
      }
    ]
  },
  {
    id: 'state-accounts',
    title: 'State Accounts',
    titleHi: 'राज्य के खाते',
    columns: [
      {
        heading: 'Accounting System',
        headingHi: 'लेखा प्रणाली',
        items: [
          { title: 'Structure of Accounts', titleHi: 'लेखा संरचना', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
          { title: 'Treasury Inspection', titleHi: 'कोषागार निरीक्षण', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Treasury-Inspection' },
          { title: 'List of PAO/APAOs', titleHi: 'पीएओ/एपीएओ की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-PAO-APAOs' },
          { title: 'List of Treasuries / Sub Treasuries with Code', titleHi: 'कोड सहित कोषागारों/उप-कोषागारों की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-Treasuries' },
          { title: 'Other Accounting Functions', titleHi: 'अन्य लेखा कार्य', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Other-Accounting-Functions' }
        ]
      },
      {
        heading: 'Annual Accounts',
        headingHi: 'वार्षिक लेखे',
        items: [
          { title: 'Account at Glance', titleHi: 'एक नजर में खाते', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
          { title: 'Appropriation Accounts', titleHi: 'विनियोग लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Appropriation-Accounts' },
          { title: 'Finance Accounts', titleHi: 'वित्त लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Finance-Accounts' }
        ]
      },
      {
        heading: 'Monthly Accounts',
        headingHi: 'मासिक लेखे',
        items: [
          { title: 'Monthly Civil Accounts', titleHi: 'मासिक सिविल लेखे', href: '/states/andhra-pradesh/State-Accounts/Monthly-Accounts/Monthly-Civil-Accounts' },
          { title: 'Monthly Key Indicator', titleHi: 'मासिक मुख्य संकेतक', href: '/states/andhra-pradesh/State-Accounts/Monthly-Accounts/Monthly-Key-Indicator' },
          { title: 'MKI Visualization', titleHi: 'एमकेआई विज़ुअलाइज़ेशन', href: 'https://cag.gov.in' }
        ]
      },
      {
        heading: 'Reviews & Other Reports',
        headingHi: 'समीक्षा एवं अन्य रिपोर्ट',
        items: [
          { title: 'Treasury Review', titleHi: 'कोषागार समीक्षा', href: '/states/andhra-pradesh/State-Accounts/Reviews-Reports/Treasury-Review' },
          { title: 'Brochure on Accounting', titleHi: 'लेखांकन पर विवरणिका', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Brochure-on-Accounting' },
          { title: 'Accounts Kept in 8443-Civil Deposits', titleHi: '8443-सिविल जमा में रखे गए खाते', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/8443-Civil-Deposits' },
          { title: 'Accounts not received', titleHi: 'प्राप्त नहीं हुए खाते', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Accounts-not-received' },
          { title: 'Accounts received late', titleHi: 'विलंब से प्राप्त खाते', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Accounts-received-late' },
          { title: 'List of PL accounts not closed by DDO', titleHi: 'डीडीओ द्वारा बंद न किए गए पीएल खातों की सूची', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/PL-accounts-not-closed' },
          { title: 'DC bills awaited & Cleared', titleHi: 'डीसी बिल प्रतीक्षित/समाशोधित', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/DC-bills-awaited' },
          { title: 'Outstanding Treasury Inspection report', titleHi: 'बकाया कोषागार निरीक्षण रिपोर्ट', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Outstanding-Treasury-Inspection-report' }
        ]
      },
      {
        heading: 'Loan Account',
        headingHi: 'ऋण खाता',
        items: [
          { title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
          { title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
          { title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
          { title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
          { title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
          { title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
          { title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' },
          { title: 'Natural Resource Accounting', titleHi: 'प्राकृतिक संसाधन लेखांकन', href: '/states/andhra-pradesh/State-Accounts/Natural-Resource-Accounting' }
        ]
      }
    ]
  },
  {
    id: 'gpf',
    title: 'GPF',
    titleHi: 'जीपीएफ',
    columns: [
      {
        heading: 'GPF Information',
        headingHi: 'जीपीएफ जानकारी',
        items: [
          { title: 'About GPF', titleHi: 'जीपीएफ के बारे में', href: '/states/andhra-pradesh/GPF/About-GPF' },
          { title: 'Eligibility to join the fund', titleHi: 'निधि में शामिल होने की पात्रता', href: '/states/andhra-pradesh/GPF/Eligibility-to-join-the-fund' },
          { title: 'GPF Subscription', titleHi: 'जीपीएफ अंशदान', href: '/states/andhra-pradesh/GPF/GPF-Subscription' },
          { title: 'Annual Statement of Accounts', titleHi: 'वार्षिक लेखा विवरण', href: '/states/andhra-pradesh/GPF/Annual-Statement-of-Accounts' },
          { title: 'Grievance / Feedback / Complaint', titleHi: 'शिकायत / प्रतिपुष्टि', href: '/states/andhra-pradesh/Contact-Us/Grievance' },
          { title: 'Advances', titleHi: 'अग्रिम', href: '/states/andhra-pradesh/GPF/Advances' },
          { title: 'Withdrawals', titleHi: 'निकासी', href: '/states/andhra-pradesh/GPF/Withdrawals' },
          { title: 'Final Closure', titleHi: 'अंतिम बंदोबस्त', href: '/states/andhra-pradesh/GPF/Final-Closure' },
          { title: 'GPF Calculation', titleHi: 'जीपीएफ गणना', href: '/states/andhra-pradesh/GPF/GPF-Calculation' }
        ]
      },
      {
        heading: 'Rules & Forms',
        headingHi: 'नियम एवं फॉर्म',
        items: [
          { title: 'GPF Guidelines', titleHi: 'जीपीएफ दिशानिर्देश', href: '/states/andhra-pradesh/GPF/GPF-Guidelines' },
          { title: 'GPF Manual', titleHi: 'जीपीएफ नियमावली', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MANUAL-OF-THE-PROVIDENT-FUND-DEPATMENT-20200611170818.pdf' },
          { title: 'Maintenance of GPF Account', titleHi: 'जीपीएफ खाते का रखरखाव', href: '/states/andhra-pradesh/GPF/Maintenance-of-GPF-Account' },
          { title: 'GPF Account Opening Form', titleHi: 'जीपीएफ खाता खोलने का फॉर्म', href: '/states/andhra-pradesh/GPF/GPF-Account-Opening-Form' },
          { title: "Do's & Don'ts for GPF", titleHi: 'जीपीएफ के लिए क्या करें और क्या न करें', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Dos_Donts.pdf' },
          { title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/GPF/FAQ' },
          { title: 'Downloads - GPF Forms', titleHi: 'डाउनलोड - जीपीएफ फॉर्म', href: '/states/andhra-pradesh/GPF/Downloads-GPF-Forms' }
        ]
      }
    ]
  },
  {
    id: 'pension',
    title: 'Pension',
    titleHi: 'पेंशन',
    columns: [
      {
        heading: 'Pension Information',
        headingHi: 'पेंशन जानकारी',
        items: [
          { title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
          { title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
          { title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
          { title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
          { title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
          { title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
          { title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
          { title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
          { title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
        ]
      },
      {
        heading: "Pensioners Corner & Orders",
        headingHi: 'पेंशनभोगी कॉर्नर एवं आदेश',
        items: [
          { title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/Pension/Pensioners-Corner/FAQ' },
          { title: 'Pension Tracking', titleHi: 'पेंशन ट्रैकिंग', href: '/states/andhra-pradesh/Pension/Pensioners-Corner/Pension-Tracking' },
          { title: 'Grievance / Feedback / Complaint', titleHi: 'शिकायत / प्रतिपुष्टि', href: '/states/andhra-pradesh/Contact-Us/Grievance' },
          { title: 'GPO/PPO/CPO Status', titleHi: 'जीपीओ/पीपीओ/सीपीओ स्थिति', href: '/states/andhra-pradesh/Pension/Pensioners-Corner/GPO-PPO-CPO-Status' },
          { title: 'Returned Cases', titleHi: 'वापस किए गए मामले', href: '/states/andhra-pradesh/Pension/Pension-Orders/Returned-Cases' },
          { title: 'List of employees retired but pension applications not received', titleHi: 'सेवानिवृत्त कर्मचारियों की सूची जिनके पेंशन आवेदन प्राप्त नहीं हुए', href: '/states/andhra-pradesh/Pension/Pension-Orders/List-of-retired-employees' }
        ]
      },
      {
        heading: 'Downloads & Online Services',
        headingHi: 'डाउनलोड एवं ऑनलाइन सेवाएं',
        items: [
          { title: 'Government Orders - Old website', titleHi: 'सरकारी आदेश - पुरानी वेबसाइट', href: '/states/andhra-pradesh/Pension/Download/Government-Orders-Old-website' },
          { title: 'Government Orders (Other States)', titleHi: 'सरकारी आदेश (अन्य राज्य)', href: '/states/andhra-pradesh/Pension/Download/Government-Orders-Other-States' },
          { title: 'Government Orders - Andhra Pradesh', titleHi: 'सरकारी आदेश - आंध्र प्रदेश', href: '/states/andhra-pradesh/Pension/Download/Government-Orders-Andhra-Pradesh' },
          { title: 'Instructions regarding revision of Pension', titleHi: 'पेंशन संशोधन संबंधी निर्देश', href: '/states/andhra-pradesh/Pension/Download/Instructions-revision-of-Pension' }
        ]
      }
    ]
  },
  {
    id: 'employee',
    title: 'Employee Corner',
    titleHi: 'कर्मचारी कोना',
    columns: [
      {
        heading: 'Employee Corner',
        headingHi: 'कर्मचारी सेवाएं',
        items: [
          { title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
          { title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
          { title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
          { title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
          { title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
        ]
      }
    ]
  },
  {
    id: 'rti',
    title: 'RTI',
    titleHi: 'सूचना का अधिकार',
    columns: [
      {
        heading: 'Right to Information',
        headingHi: 'सूचना का अधिकार',
        items: [
          { title: 'Public Information Officer (P.I.O)', titleHi: 'लोक सूचना अधिकारी (पी.आई.ओ)', href: '/states/andhra-pradesh/RTI/Public-Information-Officer' },
          { title: 'Appellate Authority', titleHi: 'अपीलीय प्राधिकारी', href: '/states/andhra-pradesh/RTI/Appellate-Authority' },
          { title: 'RTI-disclosure-AP', titleHi: 'आरटीआई प्रकटीकरण (एपी)', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/RTI-disclosure-AP-0643fc224386475-92952692.pdf' }
        ]
      }
    ]
  },
  {
    id: 'charter',
    title: 'Citizens Charter',
    titleHi: 'नागरिक चार्टर',
    href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0643e81853c6471-79510511.pdf'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    titleHi: 'हमसे संपर्क करें',
    columns: [
      {
        heading: 'Contact Details',
        headingHi: 'संपर्क विवरण',
        items: [
          { title: 'Contact details', titleHi: 'संपर्क विवरण', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
          { title: 'Office Address', titleHi: 'कार्यालय का पता', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Office-Address' },
          { title: 'Office Location', titleHi: 'कार्यालय की स्थिति', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Office-Location' },
          { title: 'Working Hours', titleHi: 'कार्य के घंटे', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Working-Hours' },
          { title: 'Holiday List', titleHi: 'अवकाश सूची', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Circular-List-of-Holidays-for-2026-0697203e391f278-31182167.pdf' },
          { title: 'Feedback / Complaint / Grievances', titleHi: 'प्रतिपुष्टि / शिकायत', href: '/states/andhra-pradesh/Contact-Us/Grievance' }
        ]
      },
      {
        heading: 'Working With US',
        headingHi: 'हमारे साथ कार्य करें',
        items: [
          { title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
          { title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
          { title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
          { title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
        ]
      },
      {
        heading: 'Media Centre',
        headingHi: 'मीडिया केंद्र',
        items: [
          { title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
          { title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
          { title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
          { title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
          { title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
          { title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
          { title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
        ]
      },
      {
        heading: 'Grievance',
        headingHi: 'शिकायत निवारण',
        items: [
          { title: 'Grievance Redressal', titleHi: 'शिकायत निवारण पोर्टल', href: '/states/andhra-pradesh/Contact-Us/Grievance' }
        ]
      }
    ]
  }
];

export function getStateNavItems(stateSlug: string = 'andhra-pradesh', prefix: 'ae' | 'ag' = 'ae'): TopNavItem[] {
  const base = `/${prefix}/${stateSlug}`;
  const cleanSlug = stateSlug.toLowerCase();
  const customCharterUrl = STATE_CITIZEN_CHARTER_PDFS[cleanSlug];

  return ANDHRA_PRADESH_NAV_ITEMS.map((item) => {
    let resolvedHref = item.href;

    if (item.id === 'charter') {
      resolvedHref = customCharterUrl || (item.href?.startsWith('http') ? item.href : `${base}/Citizens-Charter`);
    } else if (resolvedHref) {
      if (!resolvedHref.startsWith('http') && !resolvedHref.endsWith('.pdf')) {
        resolvedHref = resolvedHref
          .replace('/states/andhra-pradesh', base)
          .replace(`/states/${stateSlug}`, base)
          .replace('/ae/andhra-pradesh', base)
          .replace('/ag/andhra-pradesh', base);
      }
    }

    return {
      ...item,
      href: resolvedHref,
      columns: item.columns?.map((col) => ({
        ...col,
        items: col.items?.map((sub) => {
          let subHref = sub.href;
          if (subHref && !subHref.startsWith('http') && !subHref.endsWith('.pdf')) {
            subHref = subHref
              .replace('/states/andhra-pradesh', base)
              .replace(`/states/${stateSlug}`, base)
              .replace('/ae/andhra-pradesh', base)
              .replace('/ag/andhra-pradesh', base);
          }
          return {
            ...sub,
            href: subHref
          };
        })
      }))
    };
  });
}
