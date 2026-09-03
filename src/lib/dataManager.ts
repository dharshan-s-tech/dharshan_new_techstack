import { Office } from '@/types';

export interface ReportItem {
  id: string;
  title: string;
  image: string;
  tag: string;
  date: string;
  year: string;
  sector: string;
  level: string;
  type: string;
  isFeatured?: boolean;
  label?: string;
  desc?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  type: 'trending' | 'featured';
  tag?: string;
  image?: string;
}

export interface StateOfficeSubDetail {
  label: string;
  url?: string;
}

export interface StateOfficeCard {
  id: string;
  name: string;
  nameHindi: string;
  auditDetails: StateOfficeSubDetail[];
  aeDetails: StateOfficeSubDetail[];
}

export interface BannerItem {
  id: number;
  title_en: string;
  title_hi?: string;
  subtitle_en?: string;
  subtitle_hi?: string;
  image_url?: string;
  link_url?: string;
  display_order?: number;
  is_active: boolean;
}

export interface TenderItem {
  id: number;
  title_en: string;
  title_hi?: string;
  reference_no?: string;
  closing_date?: string;
  tender_file_url?: string;
  is_active: boolean;
}

export interface CircularItem {
  id: number;
  title_en: string;
  title_hi?: string;
  circular_no?: string;
  issue_date?: string;
  file_url?: string;
  is_active: boolean;
}

export const DEFAULT_STATE_OFFICES: StateOfficeCard[] = [
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    nameHindi: 'आंध्र प्रदेश',
    auditDetails: [{ label: 'PAG (Audit), Vijayawada', url: '/states/andhra-pradesh' }],
    aeDetails: [{ label: 'PAG (A&E), Vijayawada', url: '/states/andhra-pradesh' }]
  },
  {
    id: 'arunachal-pradesh',
    name: 'Arunachal Pradesh',
    nameHindi: 'अरुणाचल प्रदेश',
    auditDetails: [{ label: 'AG (Audit), Itanagar', url: '/states/andhra-pradesh' }],
    aeDetails: [{ label: 'AG (A&E), Itanagar', url: '/states/andhra-pradesh' }]
  },
  {
    id: 'assam',
    name: 'Assam',
    nameHindi: 'असम',
    auditDetails: [{ label: 'PAG (Audit), Guwahati', url: 'https://cag.gov.in/ag/assam/en' }],
    aeDetails: [{ label: 'PAG (A&E), Guwahati', url: 'https://cag.gov.in/ag/assam/en' }]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    nameHindi: 'बिहार',
    auditDetails: [{ label: 'PAG (Audit), Patna', url: 'https://cag.gov.in/ag/bihar/en' }],
    aeDetails: [{ label: 'PAG (A&E), Patna', url: 'https://cag.gov.in/ag/bihar/en' }]
  },
  {
    id: 'chattisgarh',
    name: 'Chattisgarh',
    nameHindi: 'छत्तीसगढ़',
    auditDetails: [{ label: 'PAG (Audit), Raipur', url: 'https://cag.gov.in/ag/chhattisgarh/en' }],
    aeDetails: [{ label: 'PAG (A&E), Raipur', url: 'https://cag.gov.in/ag/chhattisgarh/en' }]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    nameHindi: 'गुजरात',
    auditDetails: [{ label: 'PAG (Audit), Rajkot', url: 'https://cag.gov.in/ag2/gujarat/en' }],
    aeDetails: [{ label: 'PAG (A&E), Rajkot', url: 'https://cag.gov.in/ag1/gujarat/en' }]
  },
  {
    id: 'haryana',
    name: 'Haryana',
    nameHindi: 'हरियाणा',
    auditDetails: [{ label: 'PAG (Audit), Chandigarh', url: 'https://cag.gov.in/ag/haryana/en' }],
    aeDetails: [{ label: 'PAG (A&E), Chandigarh', url: 'https://cag.gov.in/ag/haryana/en' }]
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    nameHindi: 'हिमाचल प्रदेश',
    auditDetails: [{ label: 'PAG (Audit), Shimla', url: 'https://cag.gov.in/ag/himachal-pradesh/en' }],
    aeDetails: [{ label: 'PAG (A&E), Shimla', url: 'https://cag.gov.in/ag/himachal-pradesh/en' }]
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir State (...)',
    nameHindi: 'जम्मू एवं कश्मीर राज्य',
    auditDetails: [{ label: 'PAG (Audit), Jammu & Kashmir', url: 'https://cag.gov.in/ag/jammu-and-kashmir/en' }],
    aeDetails: [{ label: 'PAG (A&E), Srinagar & Jammu', url: 'https://cag.gov.in/ag/jammu-and-kashmir/en' }]
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    nameHindi: 'झारखंड',
    auditDetails: [{ label: 'PAG (Audit), Ranchi', url: 'https://cag.gov.in/ag/jharkhand/en' }],
    aeDetails: [{ label: 'PAG (A&E), Ranchi', url: 'https://cag.gov.in/ag/jharkhand/en' }]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    nameHindi: 'कर्नाटक',
    auditDetails: [{ label: 'PAG (Audit), Bengaluru', url: 'https://cag.gov.in/ag/karnataka/en' }],
    aeDetails: [{ label: 'PAG (A&E), Bengaluru', url: 'https://cag.gov.in/ag/karnataka/en' }]
  },
  {
    id: 'kerala',
    name: 'Kerala',
    nameHindi: 'केरल',
    auditDetails: [{ label: 'PAG (Audit), Thiruvananthapuram', url: 'https://cag.gov.in/ag/kerala/en' }],
    aeDetails: [{ label: 'PAG (A&E), Thiruvananthapuram', url: 'https://cag.gov.in/ag/kerala/en' }]
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    nameHindi: 'मध्य प्रदेश',
    auditDetails: [
      { label: 'PAG (Audit), Gwalior', url: 'https://cag.gov.in/ag1/madhya-pradesh/en' },
      { label: 'PAG (Audit) - II, Gwalior', url: 'https://cag.gov.in/ag2/madhya-pradesh/en' }
    ],
    aeDetails: [
      { label: 'PAG (A&E) - I, Gwalior', url: 'https://cag.gov.in/ag1/madhya-pradesh/en' },
      { label: 'PAG (A&E) - II, Bhopal', url: 'https://cag.gov.in/ag2/madhya-pradesh/en' }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    nameHindi: 'महाराष्ट्र',
    auditDetails: [
      { label: 'AG (Audit) - II, Nagpur', url: 'https://cag.gov.in/ag2/maharashtra/en' },
      { label: 'PAG (Audit) - I, Mumbai', url: 'https://cag.gov.in/ag1/maharashtra/en' }
    ],
    aeDetails: [
      { label: 'AG (A&E) - II, Nagpur', url: 'https://cag.gov.in/ag2/maharashtra/en' },
      { label: 'PAG (A&E) - I, Mumbai', url: 'https://cag.gov.in/ag1/maharashtra/en' }
    ]
  },
  {
    id: 'manipur',
    name: 'Manipur',
    nameHindi: 'मणिपुर',
    auditDetails: [{ label: 'PAG (Audit), Imphal', url: 'https://cag.gov.in/ag/manipur/en' }],
    aeDetails: [{ label: 'PAG (A&E), Imphal', url: 'https://cag.gov.in/ag/manipur/en' }]
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    nameHindi: 'मेघालय',
    auditDetails: [{ label: 'PAG (Audit), Shillong', url: 'https://cag.gov.in/ag/meghalaya/en' }],
    aeDetails: [{ label: 'PAG (A&E), Shillong', url: 'https://cag.gov.in/ag/meghalaya/en' }]
  },
  {
    id: 'mizoram',
    name: 'Mizoram',
    nameHindi: 'मिजोरम',
    auditDetails: [{ label: 'PAG (Audit), Shillong', url: 'https://cag.gov.in/ag/mizoram/en' }],
    aeDetails: [{ label: 'PAG (A&E), Aizawl', url: 'https://cag.gov.in/ag/mizoram/en' }]
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    nameHindi: 'नागालैंड',
    auditDetails: [{ label: 'PAG (Audit), Kohima', url: 'https://cag.gov.in/ag/nagaland/en' }],
    aeDetails: [{ label: 'PAG (A&E), Kohima', url: 'https://cag.gov.in/ag/nagaland/en' }]
  },
  {
    id: 'odisha',
    name: 'Odisha',
    nameHindi: 'ओडिशा',
    auditDetails: [{ label: 'PAG (Audit), Bhubaneswar', url: 'https://cag.gov.in/ag/odisha/en' }],
    aeDetails: [{ label: 'PAG (A&E), Bhubaneswar', url: 'https://cag.gov.in/ag/odisha/en' }]
  },
  {
    id: 'punjab',
    name: 'Punjab',
    nameHindi: 'पंजाब',
    auditDetails: [{ label: 'AG (Audit) & U.T., Chandigarh', url: 'https://cag.gov.in/ag/punjab/en' }],
    aeDetails: [{ label: 'AG (A&E) & U.T., Chandigarh', url: 'https://cag.gov.in/ag/punjab/en' }]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    nameHindi: 'राजस्थान',
    auditDetails: [{ label: 'PAG (Audit), Jaipur', url: 'https://cag.gov.in/ag/rajasthan/en' }],
    aeDetails: [{ label: 'PAG (A&E), Jaipur', url: 'https://cag.gov.in/ag/rajasthan/en' }]
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    nameHindi: 'सिक्किम',
    auditDetails: [{ label: 'Sr. DAG (Audit), Gangtok', url: 'https://cag.gov.in/ag/sikkim/en' }],
    aeDetails: [{ label: 'Sr. DAG (A&E), Gangtok', url: 'https://cag.gov.in/ag/sikkim/en' }]
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    nameHindi: 'तमिलनाडु',
    auditDetails: [{ label: 'PAG (Audit), Chennai', url: 'https://cag.gov.in/ag/tamil-nadu/en' }],
    aeDetails: [{ label: 'PAG (A&E), Chennai', url: 'https://cag.gov.in/ag/tamil-nadu/en' }]
  },
  {
    id: 'telangana',
    name: 'Telangana',
    nameHindi: 'तेलंगाना',
    auditDetails: [{ label: 'PAG (Audit), Hyderabad', url: 'https://cag.gov.in/ag/telangana/en' }],
    aeDetails: [{ label: 'PAG (A&E), Hyderabad', url: 'https://cag.gov.in/ag/telangana/en' }]
  },
  {
    id: 'tripura',
    name: 'Tripura',
    nameHindi: 'त्रिपुरा',
    auditDetails: [{ label: 'AG (Audit), Agartala', url: 'https://cag.gov.in/ag/tripura/en' }],
    aeDetails: [{ label: 'AG (A&E), Agartala', url: 'https://cag.gov.in/ag/tripura/en' }]
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    nameHindi: 'उत्तर प्रदेश',
    auditDetails: [
      { label: 'AG (Audit) - II, Prayagraj', url: 'https://cag.gov.in/ag2/uttar-pradesh/en' },
      { label: 'PAG (Audit) - I, Prayagraj', url: 'https://cag.gov.in/ag1/uttar-pradesh/en' }
    ],
    aeDetails: [
      { label: 'AG (A&E) - II, Prayagraj', url: 'https://cag.gov.in/ag2/uttar-pradesh/en' },
      { label: 'PAG (A&E) - I, Prayagraj', url: 'https://cag.gov.in/ag1/uttar-pradesh/en' }
    ]
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    nameHindi: 'उत्तराखंड',
    auditDetails: [{ label: 'AG (Audit), Dehradun', url: 'https://cag.gov.in/ag/uttarakhand/en' }],
    aeDetails: [{ label: 'AG (A&E), Dehradun', url: 'https://cag.gov.in/ag/uttarakhand/en' }]
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    nameHindi: 'पश्चिम बंगाल',
    auditDetails: [{ label: 'PAG (Audit), Kolkata', url: 'https://cag.gov.in/ag/west-bengal/en' }],
    aeDetails: [{ label: 'PAG (A&E), Kolkata', url: 'https://cag.gov.in/ag/west-bengal/en' }]
  }
];

export const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: 1,
    title_en: 'Ensuring Transparency, Integrity & Accountability',
    title_hi: 'पारदर्शिता, सत्यनिष्ठा और जवाबदेही सुनिश्चित करना',
    subtitle_en: 'Access audit reports, accounts, and institutional resources from India’s Supreme Audit Institution.',
    subtitle_hi: 'भारत के सर्वोच्च लेखापरीक्षा संस्थान से ऑडिट रिपोर्ट, खाते और संस्थागत संसाधन प्राप्त करें।',
    image_url: '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png',
    link_url: '/Reports',
    display_order: 1,
    is_active: true
  },
  {
    id: 2,
    title_en: 'Empowering Good Governance & Public Trust',
    title_hi: 'सुशासन और जन विश्वास को सशक्त बनाना',
    subtitle_en: 'Providing independent assurance to all stakeholders that public funds are utilized efficiently.',
    subtitle_hi: 'सभी हितधारकों को स्वतंत्र आश्वासन प्रदान करना कि सार्वजनिक धन का कुशलतापूर्वक उपयोग किया जा रहा है।',
    image_url: '/assets/e2c5a3b888a0623426c634ce2f2bee016b8fb5ab.png',
    link_url: '/About/About-Us/Cag-Of-India',
    display_order: 2,
    is_active: true
  },
  {
    id: 3,
    title_en: 'Leading Global Relations & Audit Standards',
    title_hi: 'वैश्विक संबंधों और लेखा परीक्षा मानकों का नेतृत्व करना',
    subtitle_en: 'Representing India at Supreme Audit Forums globally to shape modern public audit methodologies.',
    subtitle_hi: 'आधुनिक सार्वजनिक लेखा परीक्षा पद्धतियों को आकार देने के लिए वैश्विक स्तर पर सर्वोच्च लेखा परीक्षा मंचों पर भारत का प्रतिनिधित्व करना।',
    image_url: '/assets/c4913da1b882a52fb7cb973a9d334b9abf2e253e.png',
    link_url: '/About/Index-Menu-About/Global-relations',
    display_order: 3,
    is_active: true
  },
  {
    id: 4,
    title_en: 'Fostering Digital Auditing & Data Analytics',
    title_hi: 'डिजिटल ऑडिटिंग और डेटा एनालिटिक्स को बढ़ावा देना',
    subtitle_en: 'Leveraging artificial intelligence and big data tools to streamline auditing and fiscal oversight.',
    subtitle_hi: 'लेखा परीक्षा और वित्तीय निरीक्षण को सुव्यवस्थित करने के लिए कृत्रिम बुद्धिमत्ता और बिग डेटा टूल का लाभ उठाना।',
    image_url: '/assets/d14889fd29ae93bd23d9b51c4dad883e07f826bf.png',
    link_url: '/Resources',
    display_order: 4,
    is_active: true
  }
];

export const DEFAULT_TENDERS: TenderItem[] = [
  {
    id: 1,
    title_en: 'Notice Inviting Tender for Annual Maintenance Contract of IT Infrastructure',
    title_hi: 'आईटी अवसंरचना के वार्षिक रखरखाव अनुबंध के लिए निविदा आमंत्रण सूचना',
    reference_no: 'CAG/IT/2026/AMC-01',
    closing_date: '2026-09-25',
    tender_file_url: '#',
    is_active: true
  },
  {
    id: 2,
    title_en: 'Empanelment of Chartered Accountant Firms for PSU Audits',
    title_hi: 'पीएसयू लेखा परीक्षा के लिए सीए फर्मों का नामिकाकरण',
    reference_no: 'CAG/CA-EMP/2026-27',
    closing_date: '2026-10-15',
    tender_file_url: '#',
    is_active: true
  }
];

export const DEFAULT_CIRCULARS: CircularItem[] = [
  {
    id: 1,
    title_en: 'Instructions regarding Transfer and Postings in IA&AD for FY 2026-27',
    title_hi: 'वित्तीय वर्ष 2026-27 के लिए स्थानांतरण और पदस्थापना निर्देश',
    circular_no: 'Cir-12/IAAD/2026',
    issue_date: '2026-08-01',
    file_url: '#',
    is_active: true
  },
  {
    id: 2,
    title_en: 'Revised Guidelines for Preparation of State Finance Accounts',
    title_hi: 'राज्य वित्त लेखा तैयार करने के लिए संशोधित दिशा-निर्देश',
    circular_no: 'Cir-15/A&E/2026',
    issue_date: '2026-08-15',
    file_url: '#',
    is_active: true
  }
];

// Default initial data matching site contents (9 featured reports in total)
const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    title: 'Audit Report on Health Services and Polio Vaccination Administrations in Rural Districts',
    image: '/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png',
    tag: 'Finance',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Social Welfare',
    level: 'States',
    type: 'Performance',
    label: 'Health Audit',
    desc: 'Review of vaccine distribution logistics, primary health center infrastructure, and public health fund implementation.',
    isFeatured: true
  },
  {
    id: 'rep-2',
    title: 'Defence Audit Report on Border Security Procurement and Modernization Schemes',
    image: '/assets/269d11ffce72c4343f0fa24955e0dc48a33d8255.png',
    tag: 'Marketing',
    date: 'Jul 15, 2026',
    year: '2026',
    sector: 'Finance',
    level: 'Union',
    type: 'Compliance',
    label: 'Defence Audit',
    desc: 'Detailed compliance assessment of security hardware acquisitions, border fence structures, and modern systems procurement.',
    isFeatured: true
  },
  {
    id: 'rep-3',
    title: 'Performance Audit on Indian Railways Signaling Systems and Modernization Schemes',
    image: '/assets/6574e2c9289333c9bdf86fe596a04b3f1c0238c3.png',
    tag: 'Technology',
    date: 'Aug 30, 2026',
    year: '2026',
    sector: 'Transport',
    level: 'Union',
    type: 'Performance',
    label: 'Railways Audit',
    desc: 'Signaling upgrade projects review evaluating budget allocations, installation timelines, and system integration reliability checks.',
    isFeatured: true
  },
  {
    id: 'rep-4',
    title: 'Compliance Audit of Direct Tax Receipts and Corporate Assessments in Metro Regions',
    image: '/assets/269d11ffce72c4343f0fa24955e0dc48a33d8255.png',
    tag: 'Finance',
    date: 'Jun 4, 2026',
    year: '2025',
    sector: 'Finance',
    level: 'Union',
    type: 'Compliance',
    label: 'Direct Tax Audit',
    desc: 'Audit evaluating compliance of corporate tax exemptions, assessment timelines, and direct receipt accounts clearance.',
    isFeatured: true
  },
  {
    id: 'rep-5',
    title: 'Audit Report on Municipal Corporation Revenue and Property Tax Assessments',
    image: '/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png',
    tag: 'Finance',
    date: 'Sep 10, 2026',
    year: '2026',
    sector: 'Social Welfare',
    level: 'States',
    type: 'Compliance',
    label: 'Revenue Audit',
    desc: 'Review of local property assessments, tax collectors efficiency, and municipal development fund distributions.',
    isFeatured: true
  },
  {
    id: 'rep-6',
    title: 'Performance Evaluation of Information Technology Systems in Central Excise Department',
    image: '/assets/cc8a1a5614f48c98f397dcafcf38e8f22843dc2a.png',
    tag: 'Technology',
    date: 'Oct 05, 2026',
    year: '2026',
    sector: 'Transport',
    level: 'Union',
    type: 'Performance',
    label: 'Excise IT Audit',
    desc: 'Audit reviewing custom software deployments, server security frameworks, and processing performance benchmarks.',
    isFeatured: true
  },
  {
    id: 'home-rep-1',
    title: 'Audit Report on Infrastructure Development and Municipal Solid Waste Management',
    image: '/assets/d14889fd29ae93bd23d9b51c4dad883e07f826bf.png',
    tag: 'Text',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Civic / Urban Development',
    level: 'States',
    type: 'Performance',
    isFeatured: true,
    label: 'Civic',
    desc: 'Comprehensive review of urban infrastructure planning, fund utilization, and waste treatment plants across municipal corporations.'
  },
  {
    id: 'home-rep-2',
    title: 'Thematic Audit on Environmental Management in Coastal Districts of Tamil Nadu',
    image: '/assets/56272e2a85b8227dfa00af6d4065211e9ac5de8f.png',
    tag: 'Text',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Tamil Nadu / Environmental Management',
    level: 'States',
    type: 'Performance',
    isFeatured: true,
    label: 'Tamil Nadu',
    desc: 'Assessment of measures taken to prevent marine pollution, coastal erosion, and implementation of CRZ notifications.'
  },
  {
    id: 'home-rep-3',
    title: 'Performance Audit on Irrigation Schemes and Canal Networks in Andhra Pradesh',
    image: '/assets/28f782be18b6cfdf23aa0c90ec681e3916b8d6c7.png',
    tag: 'Text',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Andhra Pradesh / Irrigation Schemes',
    level: 'States',
    type: 'Performance',
    isFeatured: true,
    label: 'Andhra Pradesh',
    desc: 'Evaluation of major and medium irrigation projects, command area development, and drinking water supply provisions.'
  }
];

const DEFAULT_OFFICES: Office[] = [
  // State Offices
  {
    id: 'st-1',
    state: 'Tamil Nadu',
    name: 'Office of the Principal Accountant General (A&E), Tamil Nadu',
    address: '361, Anna Salai, Teynampet, Chennai - 600018',
    phone: '+91-44-24324500',
    email: 'agaeTamilnadu@cag.gov.in',
    lat: 13.0405,
    lng: 80.2504,
    type: 'state'
  },
  {
    id: 'st-2',
    state: 'Maharashtra',
    name: 'Office of the Principal Accountant General (Audit)-I, Maharashtra',
    address: '101, Maharshi Karve Road, Churchgate, Mumbai - 400020',
    phone: '+91-22-22039680',
    email: 'agaemumbai@cag.gov.in',
    lat: 18.9322,
    lng: 72.8264,
    type: 'state'
  },
  
  // Central Audit Offices
  {
    id: 'c-def',
    state: 'Delhi',
    name: 'Office of the Director General of Audit (Defense Services), New Delhi',
    address: 'L-II Block, Brassey Avenue, New Delhi - 110001',
    phone: '+91-11-23092528',
    email: 'pdaDefense@cag.gov.in',
    lat: 28.6139,
    lng: 77.2090,
    type: 'central'
  },
  {
    id: 'c-rail',
    state: 'Delhi',
    name: 'Office of the Director General of Audit (Railways), New Delhi',
    address: 'Rail Bhavan, Raisina Road, New Delhi - 110001',
    phone: '+91-11-23383568',
    email: 'pdarailways@cag.gov.in',
    lat: 28.6180,
    lng: 77.2140,
    type: 'central'
  },
  {
    id: 'c-over',
    state: 'London',
    name: 'Office of the Director General of Audit, London (Overseas Office)',
    address: 'High Commission of India, India House, Aldwych, London WC2B 4NA',
    phone: '+44-20-76323000',
    email: 'london-audit@cag.gov.in',
    lat: 51.5126,
    lng: -0.1182,
    type: 'central'
  },
  {
    id: 'c-1',
    state: 'Delhi',
    name: 'Office of the Director General of Audit (Postal & Telecommunication), Delhi',
    address: 'Sham Nath Marg, Near Civil Lines Metro Station, Delhi - 110054',
    phone: '+91-11-23812852',
    email: 'pda.p&t@cag.gov.in',
    lat: 28.6780,
    lng: 77.2250,
    type: 'central'
  },

  // Training Institutes
  {
    id: 'tr-reg-1',
    state: 'Karnataka',
    name: 'Regional Training Institute (RTI), Regional Capacity Building Centre, Bengaluru',
    address: 'Basava Samithi Bhavan, Sri Basaveshwara Road, Bengaluru, Karnataka - 560001',
    phone: '+91-80-22262509',
    email: 'rtibengaluru@cag.gov.in',
    lat: 12.9716,
    lng: 77.5946,
    type: 'training'
  },
  {
    id: 'tr-reg-2',
    state: 'Maharashtra',
    name: 'Regional Training Centre (RTC), Regional Capacity Building Centre, Mumbai',
    address: 'Pratishtha Bhavan, 101 M.K. Road, Marine Lines, Mumbai - 400020',
    phone: '+91-22-22031940',
    email: 'rtcmumbai@cag.gov.in',
    lat: 18.9430,
    lng: 72.8240,
    type: 'training'
  },
  {
    id: 'tr-1',
    state: 'Rajasthan',
    name: 'International Centre for Environment Audit and Sustainable Development (iCED), Jaipur',
    address: 'Kant Kalwar, RIICO Industrial Area, NH-11C, Jaipur, Rajasthan - 303002',
    phone: '+91-141-2586700',
    email: 'iced@cag.gov.in',
    lat: 26.9124,
    lng: 75.7873,
    type: 'training'
  },
  {
    id: 'tr-2',
    state: 'Uttar Pradesh',
    name: 'International Centre for Information Systems and Audit (iCISA), Noida',
    address: 'A-52, Sector 62, Institutional Area, Noida, Uttar Pradesh - 201309',
    phone: '+91-120-2400050',
    email: 'icisa@cag.gov.in',
    lat: 28.6273,
    lng: 77.3725,
    type: 'training'
  },
  {
    id: 'tr-naaa',
    state: 'Himachal Pradesh',
    name: 'National Academy of Audit & Accounts (NAAA), Shimla',
    address: 'Chaura Maidan, Shimla, Himachal Pradesh - 171004',
    phone: '+91-177-2803206',
    email: 'naaa@cag.gov.in',
    lat: 31.1048,
    lng: 77.1734,
    type: 'training'
  },
  {
    id: 'tr-cdma',
    state: 'Delhi',
    name: 'Centre for Data Management and Analytics (CDMA), New Delhi',
    address: 'CAG Annex Building, 10 Bahadur Shah Zafar Marg, New Delhi - 110002',
    phone: '+91-11-23235790',
    email: 'cdma@cag.gov.in',
    lat: 28.6310,
    lng: 77.2410,
    type: 'training'
  },
  {
    id: 'tr-ical',
    state: 'Kerala',
    name: 'International Centre for Audit of Local Governance (iCAL), Kozhikode',
    address: 'Kozhikode, Kerala - 673001',
    phone: '+91-495-2300120',
    email: 'ical@cag.gov.in',
    lat: 11.2588,
    lng: 75.7804,
    type: 'training'
  }
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Release of Union Government Finance Accounts for 2025-26',
    desc: 'Official publication of audited finance and appropriation accounts details for central ministries.',
    date: 'June 4, 2026',
    type: 'trending'
  },
  {
    id: 'news-2',
    title: 'International Training Program on Environmental Audit Commences',
    desc: 'iCISA hosts delegates from 32 countries for specialized training in auditing ecological policies.',
    date: 'June 4, 2026',
    type: 'trending'
  },
  {
    id: 'news-3',
    title: 'Empanelment Open for Chartered Accountant Firms for FY 2026-27',
    desc: 'Eligible CA firms can submit online applications for audit allocations in public sector units.',
    date: 'June 4, 2026',
    type: 'trending'
  },
  {
    id: 'news-featured',
    title: 'CAG tables performance audit report on Indian Railways modernization schemes',
    desc: 'Featured headline story detailing the signaling systems audit report tabled in Parliament.',
    date: '03 June 2026',
    type: 'featured',
    image: '/assets/e2c5a3b888a0623426c634ce2f2bee016b8fb5ab.png',
    tag: 'News'
  }
];

export const dataManager = {
  getLanguage(): 'English' | 'हिन्दी' {
    if (typeof window === 'undefined') return 'English';
    return (localStorage.getItem('cag_language') as any) || 'English';
  },

  setLanguage(lang: 'English' | 'हिन्दी') {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cag_language', lang);
    window.dispatchEvent(new Event('languageChange'));
  },

  getStateOffices(): StateOfficeCard[] {
    if (typeof window === 'undefined') return DEFAULT_STATE_OFFICES;
    try {
      const stored = localStorage.getItem('cag_state_offices');
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.setItem('cag_state_offices', JSON.stringify(DEFAULT_STATE_OFFICES));
        return DEFAULT_STATE_OFFICES;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem('cag_state_offices', JSON.stringify(DEFAULT_STATE_OFFICES));
        return DEFAULT_STATE_OFFICES;
      }
      return parsed;
    } catch (e) {
      console.error('Error reading state offices from localStorage:', e);
      return DEFAULT_STATE_OFFICES;
    }
  },

  saveStateOffice(item: StateOfficeCard) {
    if (typeof window === 'undefined') return;
    const items = this.getStateOffices();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem('cag_state_offices', JSON.stringify(items));
    window.dispatchEvent(new Event('stateOfficesChange'));
  },

  deleteStateOffice(id: string) {
    if (typeof window === 'undefined') return;
    const items = this.getStateOffices();
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem('cag_state_offices', JSON.stringify(filtered));
    window.dispatchEvent(new Event('stateOfficesChange'));
  },

  resetStateOfficesToDefault() {
    if (typeof window === 'undefined') return DEFAULT_STATE_OFFICES;
    localStorage.setItem('cag_state_offices', JSON.stringify(DEFAULT_STATE_OFFICES));
    window.dispatchEvent(new Event('stateOfficesChange'));
    return DEFAULT_STATE_OFFICES;
  },

  getBanners(): BannerItem[] {
    if (typeof window === 'undefined') return DEFAULT_BANNERS;
    try {
      const stored = localStorage.getItem('cag_banners');
      if (!stored || stored === 'null' || stored === 'undefined') {
        localStorage.setItem('cag_banners', JSON.stringify(DEFAULT_BANNERS));
        return DEFAULT_BANNERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_BANNERS;
    } catch (e) {
      return DEFAULT_BANNERS;
    }
  },

  saveBanner(item: BannerItem) {
    if (typeof window === 'undefined') return;
    const banners = this.getBanners();
    const idx = banners.findIndex(b => b.id === item.id);
    if (idx >= 0) banners[idx] = item;
    else banners.push(item);
    localStorage.setItem('cag_banners', JSON.stringify(banners));
    window.dispatchEvent(new Event('bannersChange'));
  },

  deleteBanner(id: number) {
    if (typeof window === 'undefined') return;
    const banners = this.getBanners().filter(b => b.id !== id);
    localStorage.setItem('cag_banners', JSON.stringify(banners));
    window.dispatchEvent(new Event('bannersChange'));
  },

  getTenders(): TenderItem[] {
    if (typeof window === 'undefined') return DEFAULT_TENDERS;
    try {
      const stored = localStorage.getItem('cag_tenders');
      if (!stored) {
        localStorage.setItem('cag_tenders', JSON.stringify(DEFAULT_TENDERS));
        return DEFAULT_TENDERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_TENDERS;
    } catch (e) {
      return DEFAULT_TENDERS;
    }
  },

  saveTender(item: TenderItem) {
    if (typeof window === 'undefined') return;
    const tenders = this.getTenders();
    const idx = tenders.findIndex(t => t.id === item.id);
    if (idx >= 0) tenders[idx] = item;
    else tenders.push(item);
    localStorage.setItem('cag_tenders', JSON.stringify(tenders));
    window.dispatchEvent(new Event('tendersChange'));
  },

  deleteTender(id: number) {
    if (typeof window === 'undefined') return;
    const tenders = this.getTenders().filter(t => t.id !== id);
    localStorage.setItem('cag_tenders', JSON.stringify(tenders));
    window.dispatchEvent(new Event('tendersChange'));
  },

  getCirculars(): CircularItem[] {
    if (typeof window === 'undefined') return DEFAULT_CIRCULARS;
    try {
      const stored = localStorage.getItem('cag_circulars');
      if (!stored) {
        localStorage.setItem('cag_circulars', JSON.stringify(DEFAULT_CIRCULARS));
        return DEFAULT_CIRCULARS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_CIRCULARS;
    } catch (e) {
      return DEFAULT_CIRCULARS;
    }
  },

  saveCircular(item: CircularItem) {
    if (typeof window === 'undefined') return;
    const circulars = this.getCirculars();
    const idx = circulars.findIndex(c => c.id === item.id);
    if (idx >= 0) circulars[idx] = item;
    else circulars.push(item);
    localStorage.setItem('cag_circulars', JSON.stringify(circulars));
    window.dispatchEvent(new Event('circularsChange'));
  },

  deleteCircular(id: number) {
    if (typeof window === 'undefined') return;
    const circulars = this.getCirculars().filter(c => c.id !== id);
    localStorage.setItem('cag_circulars', JSON.stringify(circulars));
    window.dispatchEvent(new Event('circularsChange'));
  },

  getReports(): ReportItem[] {
    if (typeof window === 'undefined') return DEFAULT_REPORTS;
    try {
      const stored = localStorage.getItem('cag_reports');
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.setItem('cag_reports', JSON.stringify(DEFAULT_REPORTS));
        return DEFAULT_REPORTS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_REPORTS;
    } catch (e) {
      console.error('Error reading reports from localStorage:', e);
      return DEFAULT_REPORTS;
    }
  },

  saveReport(report: ReportItem) {
    if (typeof window === 'undefined') return;
    const reports = this.getReports();
    const idx = reports.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      reports[idx] = report;
    } else {
      reports.push(report);
    }
    localStorage.setItem('cag_reports', JSON.stringify(reports));
    window.dispatchEvent(new Event('reportsChange'));
  },

  deleteReport(id: string) {
    if (typeof window === 'undefined') return;
    const reports = this.getReports();
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem('cag_reports', JSON.stringify(filtered));
    window.dispatchEvent(new Event('reportsChange'));
  },

  getOffices(): Office[] {
    if (typeof window === 'undefined') return DEFAULT_OFFICES;
    try {
      const stored = localStorage.getItem('cag_offices');
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.setItem('cag_offices', JSON.stringify(DEFAULT_OFFICES));
        return DEFAULT_OFFICES;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_OFFICES;
    } catch (e) {
      console.error('Error reading offices from localStorage:', e);
      return DEFAULT_OFFICES;
    }
  },

  saveOffice(office: Office) {
    if (typeof window === 'undefined') return;
    const offices = this.getOffices();
    const idx = offices.findIndex(o => o.id === office.id);
    if (idx >= 0) {
      offices[idx] = office;
    } else {
      offices.push(office);
    }
    localStorage.setItem('cag_offices', JSON.stringify(offices));
    window.dispatchEvent(new Event('officesChange'));
  },

  deleteOffice(id: string) {
    if (typeof window === 'undefined') return;
    const offices = this.getOffices();
    const filtered = offices.filter(o => o.id !== id);
    localStorage.setItem('cag_offices', JSON.stringify(filtered));
    window.dispatchEvent(new Event('officesChange'));
  },

  getNews(): NewsItem[] {
    if (typeof window === 'undefined') return DEFAULT_NEWS;
    try {
      const stored = localStorage.getItem('cag_news');
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.setItem('cag_news', JSON.stringify(DEFAULT_NEWS));
        return DEFAULT_NEWS;
      }
      const parsed = JSON.parse(stored);
      return parsed;
    } catch (e) {
      console.error('Error reading news from localStorage:', e);
      return DEFAULT_NEWS;
    }
  },

  saveNews(item: NewsItem) {
    if (typeof window === 'undefined') return;
    const news = this.getNews();
    const idx = news.findIndex(n => n.id === item.id);
    if (idx >= 0) {
      news[idx] = item;
    } else {
      news.push(item);
    }
    localStorage.setItem('cag_news', JSON.stringify(news));
    window.dispatchEvent(new Event('newsChange'));
  },

  deleteNews(id: string) {
    if (typeof window === 'undefined') return;
    const news = this.getNews();
    const filtered = news.filter(n => n.id !== id);
    localStorage.setItem('cag_news', JSON.stringify(filtered));
    window.dispatchEvent(new Event('newsChange'));
  },

  getFormerCags(): FormerCAGItem[] {
    if (typeof window === 'undefined') return DEFAULT_FORMER_CAGS;
    try {
      const stored = localStorage.getItem('cag_former_cags');
      if (!stored) {
        localStorage.setItem('cag_former_cags', JSON.stringify(DEFAULT_FORMER_CAGS));
        return DEFAULT_FORMER_CAGS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_FORMER_CAGS;
    } catch (e) {
      return DEFAULT_FORMER_CAGS;
    }
  },

  saveFormerCag(item: FormerCAGItem) {
    if (typeof window === 'undefined') return;
    const list = this.getFormerCags();
    const idx = list.findIndex(c => c.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_former_cags', JSON.stringify(list));
    window.dispatchEvent(new Event('formerCagsChange'));
  },

  deleteFormerCag(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getFormerCags().filter(c => c.id !== id);
    localStorage.setItem('cag_former_cags', JSON.stringify(list));
    window.dispatchEvent(new Event('formerCagsChange'));
  },

  getGlobalRelations(): GlobalRelationItem[] {
    if (typeof window === 'undefined') return DEFAULT_GLOBAL_RELATIONS;
    try {
      const stored = localStorage.getItem('cag_global_relations');
      if (!stored) {
        localStorage.setItem('cag_global_relations', JSON.stringify(DEFAULT_GLOBAL_RELATIONS));
        return DEFAULT_GLOBAL_RELATIONS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_GLOBAL_RELATIONS;
    } catch (e) {
      return DEFAULT_GLOBAL_RELATIONS;
    }
  },

  saveGlobalRelation(item: GlobalRelationItem) {
    if (typeof window === 'undefined') return;
    const list = this.getGlobalRelations();
    const idx = list.findIndex(g => g.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_global_relations', JSON.stringify(list));
    window.dispatchEvent(new Event('globalRelationsChange'));
  },

  deleteGlobalRelation(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getGlobalRelations().filter(g => g.id !== id);
    localStorage.setItem('cag_global_relations', JSON.stringify(list));
    window.dispatchEvent(new Event('globalRelationsChange'));
  },

  getSiteSettings(): SiteSettings {
    if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
    try {
      const stored = localStorage.getItem('cag_site_settings');
      if (!stored) {
        localStorage.setItem('cag_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
        return DEFAULT_SITE_SETTINGS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_SITE_SETTINGS;
    }
  },

  saveSiteSettings(settings: SiteSettings) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cag_site_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('siteSettingsChange'));
  }
};

export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  whoWeAreTitle: string;
  whoWeAreDesc: string;
  visionText: string;
  missionText: string;
  contactEmail: string;
  contactPhone: string;
  copyrightText: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'Comptroller & Auditor General of India',
  siteSubtitle: 'Supreme Audit Institution of India',
  whoWeAreTitle: 'Promoting Accountability, Transparency & Good Governance',
  whoWeAreDesc: 'The Comptroller and Auditor General of India is the Supreme Audit Institution of India, mandated by the Constitution of India to audit all receipts and expenditure of the Government of India and state governments.',
  visionText: 'To be a globally recognized Supreme Audit Institution committed to excellence in public auditing and reporting.',
  missionText: 'To uphold accountability, transparency and good governance through independent, objective and reliable audit reports.',
  contactEmail: 'cagindia@cag.gov.in',
  contactPhone: '+91-11-23235790',
  copyrightText: 'Copyright © 2026 Comptroller and Auditor General of India. All Rights Reserved.'
};

export interface FormerCAGItem {
  id: string;
  name: string;
  tenure: string;
  image_url?: string;
}

export interface GlobalRelationItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  image_url?: string;
  link_url?: string;
}

export const DEFAULT_FORMER_CAGS: FormerCAGItem[] = [
  { id: 'fc-1', name: 'Girish Chandra Murmu', tenure: '(2020-2024)', image_url: '/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png' },
  { id: 'fc-2', name: 'Rajiv Mehrishi', tenure: '(2017-2020)', image_url: '/assets/269d11ffce72c4343f0fa24955e0dc48a33d8255.png' },
  { id: 'fc-3', name: 'Shashi Kant Sharma', tenure: '(2013-2017)', image_url: '/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png' },
  { id: 'fc-4', name: 'Vinod Rai', tenure: '(2008-2013)', image_url: '/assets/6574e2c9289333c9bdf86fe596a04b3f1c0238c3.png' },
  { id: 'fc-5', name: 'Vijayendra N. Kaul', tenure: '(2002-2008)', image_url: '/assets/cc8a1a5614f48c98f397dcafcf38e8f22843dc2a.png' },
  { id: 'fc-6', name: 'V.K. Shunglu', tenure: '(1996-2002)', image_url: '/assets/d14889fd29ae93bd23d9b51c4dad883e07f826bf.png' }
];

export const DEFAULT_GLOBAL_RELATIONS: GlobalRelationItem[] = [
  {
    id: 'gr-1',
    title: 'INTOSAI (International Organization of Supreme Audit Institutions)',
    category: 'Multilateral',
    desc: 'CAG of India actively participates in INTOSAI governing board and committees on public audit standards.',
    image_url: '/assets/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png',
    link_url: '#'
  },
  {
    id: 'gr-2',
    title: 'United Nations Panel of External Auditors',
    category: 'UN Audit',
    desc: 'Audit of United Nations Secretariat, specialized agencies, and peacekeeping operations worldwide.',
    image_url: '/assets/269d11ffce72c4343f0fa24955e0dc48a33d8255.png',
    link_url: '#'
  },
  {
    id: 'gr-3',
    title: 'ASOSAI (Asian Organization of Supreme Audit Institutions)',
    category: 'Regional',
    desc: 'Promoting regional cooperation, joint audits, and capacity development across Asian audit institutions.',
    image_url: '/assets/6574e2c9289333c9bdf86fe596a04b3f1c0238c3.png',
    link_url: '#'
  }
];
