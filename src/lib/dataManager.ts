import { Office } from '@/types';

export interface ReportItem {
  id: string;
  title: string;
  title_hi?: string;
  image: string;
  tag: string;
  date: string;
  year: string;
  sector: string;
  level: string; // 'Union' | 'States' | 'Local Bodies'
  type: string;  // 'Performance' | 'Compliance' | 'Financial' | 'ADC Reports'
  state?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  label?: string;
  desc?: string;
  pdfUrl?: string;
  fileSize?: string;
  ministry?: string;
  tabledDate?: string;
  executiveSummary?: string;
  keyFindings?: string[];
  recommendations?: string[];
  videoUrl?: string;
}

export interface CombinedAccountItem {
  id: number;
  title_en: string;
  title_hi?: string;
  category: 'combined' | 'conference';
  account_year: string;
  volume?: string;
  size: string;
  file_url: string;
  is_active: boolean;
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

export interface AccountItem {
  id: string | number;
  title_en: string;
  title_hi?: string;
  title?: string;
  state_name_en?: string;
  state_name_hi?: string;
  category: string;
  financial_year?: string;
  date_of_upload?: string;
  pdf_url?: string;
  is_active?: boolean;
  [key: string]: any;
}

export interface StateAccountItem extends AccountItem {}

export interface TenderItem {
  id: number;
  title_en?: string;
  title_hi?: string;
  title?: string;
  reference_no?: string;
  tenderNo?: string;
  closing_date?: string;
  closingDate?: string;
  status?: string;
  tender_file_url?: string;
  docUrl?: string;
  is_active: boolean;
  [key: string]: any;
}

export interface CircularItem {
  id: number;
  title_en?: string;
  title_hi?: string;
  title?: string;
  circular_no?: string;
  refNo?: string;
  category?: string;
  issue_date?: string;
  date?: string;
  file_url?: string;
  docUrl?: string;
  is_active: boolean;
  [key: string]: any;
}

export interface CagProfileItem {
  name_en: string;
  name_hi?: string;
  designation_en: string;
  designation_hi?: string;
  photo_url?: string;
  bio_paragraphs_en: string[];
  bio_paragraphs_hi?: string[];
}

export interface VisionMissionItem {
  vision_title_en: string;
  vision_title_hi?: string;
  vision_sub_en: string;
  vision_sub_hi?: string;
  vision_desc_en: string;
  vision_desc_hi?: string;
  mission_title_en: string;
  mission_title_hi?: string;
  mission_sub_en: string;
  mission_sub_hi?: string;
  mission_desc_en: string;
  mission_desc_hi?: string;
  values_title_en: string;
  values_title_hi?: string;
  values_sub_en: string;
  values_sub_hi?: string;
  values_desc_en: string;
  values_desc_hi?: string;
}

export interface OrgOfficerItem {
  id: string;
  nameEn: string;
  nameHi: string;
  desigEn: string;
  desigHi: string;
  subEn: string;
  subHi: string;
  email: string;
  phone: string;
  reportingEn: string;
  reportingHi: string;
  roleLevel?: 'cag' | 'secretary' | 'left_dai' | 'right_dai';
  displayOrder?: number;
  isActive?: boolean;
}

export interface HistoryDocumentItem {
  id: string;
  title: string;
  title_hi?: string;
  category: 'analytical' | 'thematic-1' | 'thematic-2';
  size?: string;
  pdf_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface DutiesPowersChapterItem {
  id: string;
  chapterNo: string;
  titleEn: string;
  titleHi: string;
  sectionsEn: string[];
  sectionsHi: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface AuditRegulationItem {
  id: string;
  titleEn?: string;
  titleHi?: string;
  title_en?: string;
  title_hi?: string;
  descEn?: string;
  descHi?: string;
  desc_en?: string;
  desc_hi?: string;
  pdfUrl?: string;
  file_url?: string;
  size?: string;
  file_size?: string;
  file_format?: string;
  icon_type?: string;
  displayOrder?: number;
  isActive?: boolean;
  is_active?: boolean;
}

export interface ConstitutionalProvisionItem {
  id: string;
  articleNo: string;
  articleTitleEn: string;
  articleTitleHi: string;
  clausesEn: string[];
  clausesHi: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface AuditAdvisoryMemberItem {
  id: string;
  nameEn: string;
  nameHi: string;
  desigEn: string;
  desigHi: string;
  category: 'Chairman' | 'External Members' | 'Internal Members';
  displayOrder?: number;
  isActive?: boolean;
}

export const DEFAULT_CAG_PROFILE: CagProfileItem = {
  name_en: 'Shri K. Sanjay Murthy',
  name_hi: 'श्री के. संजय मूर्ति',
  designation_en: 'Comptroller and Auditor General of India',
  designation_hi: 'भारत के नियंत्रक और महालेखापरीक्षक',
  photo_url: '/assets/cag-desk-photo.png',
  bio_paragraphs_en: [
    'Shri K. Sanjay Murthy assumed the office of Comptroller and Auditor General of India on November 21, 2024.'
  ],
  bio_paragraphs_hi: [
    'श्री के. संजय मूर्ति ने 21 नवंबर, 2024 को भारत के नियंत्रक और महालेखापरीक्षक का पदभार संभाला।'
  ]
};

export const DEFAULT_VISION_MISSION: VisionMissionItem = {
  vision_title_en: 'Vision',
  vision_title_hi: 'दृष्टिकोण',
  vision_sub_en: 'Supreme Audit Institution of India',
  vision_sub_hi: 'भारत का सर्वोच्च लेखापरीक्षा संस्थान',
  vision_desc_en: 'We strive to be a global leader and catalyst for improved public sector accountability.',
  vision_desc_hi: 'हम बेहतर सार्वजनिक क्षेत्र की जवाबदेही के लिए एक वैश्विक नेता और उत्प्रेरक बनने का प्रयास करते हैं।',
  mission_title_en: 'Mission',
  mission_title_hi: 'ध्येय',
  mission_sub_en: 'Accountability and Governance',
  mission_sub_hi: 'जवाबदेही और शासन',
  mission_desc_en: 'Mandated by the Constitution of India, we promote accountability, transparency and good governance.',
  mission_desc_hi: 'भारत के संविधान द्वारा प्रदत्त, हम जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देते हैं।',
  values_title_en: 'Core Values',
  values_title_hi: 'मूल मूल्य',
  values_sub_en: 'Integrity and Professionalism',
  values_sub_hi: 'सत्यनिष्ठा और व्यावसायिकता',
  values_desc_en: 'Independence, Objectivity, Integrity, Reliability, Professional Excellence, Transparency, Positive Approach.',
  values_desc_hi: 'स्वतंत्रता, निष्पक्षता, सत्यनिष्ठा, विश्वसनीयता, व्यावसायिक उत्कृष्टता, पारदर्शिता, सकारात्मक दृष्टिकोण।'
};

export const DEFAULT_ORG_OFFICERS: OrgOfficerItem[] = [];
export const DEFAULT_HISTORY_DOCUMENTS: HistoryDocumentItem[] = [];
export const DEFAULT_DUTIES_POWERS_CHAPTERS: DutiesPowersChapterItem[] = [];
export const DEFAULT_AUDIT_REGULATIONS: AuditRegulationItem[] = [
  {
    id: 'reg-1',
    title_en: 'Gazette publication-Regulations on Audit & Accounts -2020',
    title_hi: 'लेखापरीक्षा एवं लेखा विनियम - 2020 का राजपत्र प्रकाशन',
    file_format: 'PDF',
    file_size: '34.7 MB',
    file_url: 'https://cag.gov.in/uploads/media/Regulations-on-Audit-and-Accounts-2020-Gazette-60b73c4d7d91e8-78235251.pdf',
    icon_type: 'gazette',
    is_active: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 'reg-2',
    title_en: 'Book - Regulations on Audit & Accounts -2020',
    title_hi: 'पुस्तक - लेखापरीक्षा एवं लेखा विनियम - 2020',
    file_format: 'PDF',
    file_size: '34.7 MB',
    file_url: 'https://cag.gov.in/uploads/media/Regulations-on-Audit-and-Accounts-2020-60b73b5f00e954-46908386.pdf',
    icon_type: 'book',
    is_active: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 'reg-3',
    title_en: 'Earlier Version on Regulation on Audit & Accounts - 2007',
    title_hi: 'लेखापरीक्षा एवं लेखा विनियम का पूर्व संस्करण - 2007',
    file_format: 'PDF',
    file_size: '34.7 MB',
    file_url: 'https://cag.gov.in/uploads/media/Regulations-on-Audit-and-Accounts-2007-5f7560da1d0347-15102559.pdf',
    icon_type: 'archive',
    is_active: true,
    isActive: true,
    displayOrder: 3,
  },
];
export const DEFAULT_CONSTITUTIONAL_PROVISIONS: ConstitutionalProvisionItem[] = [];
export const DEFAULT_AUDIT_ADVISORY_MEMBERS: AuditAdvisoryMemberItem[] = [];

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

// CloudFront Union Department Assets (verified live CDN)
export const CDN_UNION_DEPARTMENTS = {
  civil: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
  railway: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg',
  commercial: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/commercial.jpg',
  tax: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/tax.jpg',
  indirect_tax: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/indirect-tax.jpg',
  defence: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/defence.jpg',
  scientific: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/scientific.jpg',
  it: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/it-communication.jpg',
};

// Live verified sector-wise images from http://d7i5wg8xwe4hf.cloudfront.net/en/home
export const SECTOR_WISE_IMAGES: Record<string, string> = {
  "24": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Local_Bodies.jpg",
  "26": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Environment_and_Sustainable_Development.png",
  "27": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Finance.png",
  "28": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Science_and_Technology.png",
  "29": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Industry_and_commerce.png",
  "30": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Agriculture_and_Rural_Development.jfif",
  "31": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Art_Culture_and_Sports.png",
  "32": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/social_welfare.jpeg",
  "34": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Social_infrastructure.jfif",
  "35": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png",
  "36": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/general_sector_ministry_and_constitutional_bodies.jfif",
  "41": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png",
  "42": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/information_and_communication.jfif",
  "43": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/power_and_energy.jpg",
  "44": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Transport_and_Infrastructure.jfif",
  "45": "https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Taxes_and_duties.png",
};

export const REPORT_CDN_ASSETS = {
  recentReportBadge: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/01-recent-report-logo.jpg',
  digitalReportHero: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/digital_report.png',
  comptrollerBgLogo: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/comptroller-bg-logo.png',
  noImageFallback: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/noimage.jpg',
  extlinkIcon: 'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/extlink-icon.png',
  sectorWiseImages: SECTOR_WISE_IMAGES,
  getStateCrestUrl: (stateName: string) => 
    `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/states_images/${encodeURIComponent(stateName)}.png`,
  departments: {
    civil: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    railway: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg',
    commercial: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/commercial.jpg',
    tax: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/tax.jpg',
    indirect_tax: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/indirect-tax.jpg',
    defence: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/defence.jpg',
    scientific: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/scientific.jpg',
    it: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/it-communication.jpg',
  }
};

export function resolveReportCdnAsset(sector = '', title = ''): string {
  const s = `${sector} ${title}`.toLowerCase();
  if (s.includes('health') || s.includes('medic') || s.includes('vaccin') || s.includes('polio') || s.includes('family welfare') || s.includes('education')) {
    return SECTOR_WISE_IMAGES['35'];
  }
  if (s.includes('defence') || s.includes('defense') || s.includes('military') || s.includes('border') || s.includes('security') || s.includes('army')) {
    return SECTOR_WISE_IMAGES['41'];
  }
  if (s.includes('railway') || s.includes('train') || s.includes('transport') || s.includes('highway') || s.includes('road') || s.includes('toll')) {
    return SECTOR_WISE_IMAGES['44'];
  }
  if (s.includes('tax') || s.includes('duties') || s.includes('duty') || s.includes('gst') || s.includes('excise') || s.includes('customs') || s.includes('revenue')) {
    return SECTOR_WISE_IMAGES['45'];
  }
  if (s.includes('power') || s.includes('energy') || s.includes('solar') || s.includes('electricity') || s.includes('grid') || s.includes('renewable')) {
    return SECTOR_WISE_IMAGES['43'];
  }
  if (s.includes('local bodies') || s.includes('municipal') || s.includes('civic') || s.includes('panchayat') || s.includes('urban') || s.includes('waste')) {
    return SECTOR_WISE_IMAGES['24'];
  }
  if (s.includes('environment') || s.includes('sustainable') || s.includes('pollution') || s.includes('coastal') || s.includes('climate')) {
    return SECTOR_WISE_IMAGES['26'];
  }
  if (s.includes('it') || s.includes('cyber') || s.includes('telecom') || s.includes('communication') || s.includes('technology') || s.includes('software') || s.includes('digital')) {
    return SECTOR_WISE_IMAGES['42'];
  }
  if (s.includes('commercial') || s.includes('psu') || s.includes('trade') || s.includes('enterprise') || s.includes('industry') || s.includes('commerce') || s.includes('mineral') || s.includes('mining')) {
    return SECTOR_WISE_IMAGES['29'];
  }
  if (s.includes('agriculture') || s.includes('rural') || s.includes('irrigation') || s.includes('canal') || s.includes('farming')) {
    return SECTOR_WISE_IMAGES['30'];
  }
  if (s.includes('art') || s.includes('culture') || s.includes('sport')) {
    return SECTOR_WISE_IMAGES['31'];
  }
  if (s.includes('social infrastructure')) {
    return SECTOR_WISE_IMAGES['34'];
  }
  if (s.includes('social') || s.includes('welfare')) {
    return SECTOR_WISE_IMAGES['32'];
  }
  if (s.includes('science') || s.includes('scientific') || s.includes('atomic') || s.includes('space')) {
    return SECTOR_WISE_IMAGES['28'];
  }
  if (s.includes('adc') || s.includes('autonomous district') || s.includes('constitutional') || s.includes('general sector')) {
    return SECTOR_WISE_IMAGES['36'];
  }
  if (s.includes('finance') || s.includes('treasury') || s.includes('accounts') || s.includes('financial')) {
    return SECTOR_WISE_IMAGES['27'];
  }
  return REPORT_CDN_ASSETS.recentReportBadge;
}

export const resolveDepartmentAsset = resolveReportCdnAsset;

// Default initial data matching site contents (12 featured reports + home reports)
export const DEFAULT_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    title_hi: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    image: SECTOR_WISE_IMAGES['35'],
    tag: 'Finance',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: '',
    level: 'States',
    type: 'Performance',
    label: 'Download Full Report',
    desc: 'Review of vaccine distribution logistics, primary health center infrastructure, and public health fund implementation across district health societies.',
    ministry: 'Ministry of Health & Family Welfare / State Health Departments',
    tabledDate: '24 February 2026',
    fileSize: '12.8 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'This Performance Audit was conducted pursuant to Article 151 of the Constitution of India to examine whether rural health infrastructure, cold chain equipment, and pharmaceutical inventories were maintained in accordance with national public health standards.',
    keyFindings: [
      'Cold chain equipment in 34% of Primary Health Centres (PHCs) operated beyond recommended replacement cycles.',
      'Unspent vaccination grants totaling ₹428 Crore remained parked in non-interest-bearing bank accounts for over 24 months.',
      'Staff shortages in rural pediatric centers resulted in an 18% variance in booster dose delivery schedules.'
    ],
    recommendations: [
      'Establish real-time IoT temperature monitoring across all district vaccine storage hubs.',
      'Streamline treasury drawdowns directly to frontline accredited social health activists (ASHA).',
      'Institute mandatory quarterly stock reconciliation between state medical supply corporations and regional clinics.'
    ]
  },
  {
    id: 'rep-2',
    title: 'Annual Marketing Strategy Overview with insights into trends and projections',
    title_hi: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    image: SECTOR_WISE_IMAGES['41'],
    tag: 'Marketing',
    date: 'Jul 15, 2026',
    year: '2026',
    sector: 'Finance | Information and Communication',
    level: 'Union',
    type: 'Compliance',
    label: 'Access Full Strategy Document',
    desc: 'Detailed compliance assessment of security hardware acquisitions, border fence structures, surveillance towers, and modern tactical systems procurement.',
    ministry: 'Ministry of Defence',
    tabledDate: '18 March 2026',
    fileSize: '15.4 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'The compliance audit evaluated procurement contracts valued at ₹18,400 Crore executed between 2021 and 2025, assessing adherence to Defence Acquisition Procedure (DAP) guidelines and delivery milestones.',
    keyFindings: [
      'Delays in site readiness led to prolonged storage of specialized sensor systems at forward depots.',
      'Liquidated damages amounting to ₹112 Crore were not levied on non-compliant vendors in three procurement tranches.',
      'Maintenance support contracts were concluded 14 months after warranty expiration.'
    ],
    recommendations: [
      'Incorporate integrated lifecycle cost and milestone tracking in all capital acquisition contracts.',
      'Enforce automated penalty calculation within the defence procurement portal.'
    ]
  },
  {
    id: 'rep-3',
    title: 'Emerging Tech Innovations and their Impact on the Industry Landscape',
    title_hi: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    image: CDN_UNION_DEPARTMENTS.railway,
    tag: 'Technology',
    date: 'Aug 30, 2026',
    year: '2026',
    sector: 'Finance',
    level: 'Union',
    type: 'Performance',
    label: 'View Complete Analysis',
    desc: 'Signaling upgrade projects review evaluating budget allocations, Kavach electronic interlocking installations, and system integration reliability benchmarks.',
    ministry: 'Ministry of Railways',
    tabledDate: '12 April 2026',
    fileSize: '19.2 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'This audit examined the roll-out of electronic interlocking, automatic block signaling, and indigenous train collision avoidance systems across high-density railway corridors.',
    keyFindings: [
      'Kavach train protection system deployment covered only 1,465 route kilometers against the target of 5,000 route km.',
      'Signal failure incident response protocols were updated irregularly across six zonal railway divisions.',
      'Expenditure of ₹890 Crore on track-circuit modernization suffered delays due to non-availability of power blocks.'
    ],
    recommendations: [
      'Accelerate unified vendor empanelment for high-density safety networks.',
      'Deploy automated fault-detection telemetry to predict track circuit failures before service disruption.'
    ]
  },
  {
    id: 'rep-4',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    title_hi: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    image: SECTOR_WISE_IMAGES['41'],
    tag: 'Finance',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Finance',
    level: 'Union',
    type: 'Compliance',
    label: 'Download Full Report',
    desc: 'Audit evaluating compliance of corporate tax exemptions, transfer pricing assessments, and direct receipt accounts clearance under the Income Tax Act.',
    ministry: 'Ministry of Finance / Central Board of Direct Taxes',
    tabledDate: '08 December 2025',
    fileSize: '14.1 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'Compliance verification of 4,200 corporate scrutiny assessments conducted across Mumbai, Delhi, Bengaluru, and Chennai assessing correct computational treatment of depreciation and cross-border transactions.',
    keyFindings: [
      'Under-assessment of tax amounting to ₹640 Crore was observed in 82 corporate assessment orders.',
      'Allowances of unverified R&D write-offs resulted in revenue leakage of ₹184 Crore.'
    ],
    recommendations: [
      'Incorporate AI-based risk screening in the faceless assessment system to cross-reference claimed exemptions with GSTN return data.'
    ]
  },
  {
    id: 'rep-5',
    title: 'Annual Marketing Strategy Overview with insights into trends and projections',
    title_hi: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    image: CDN_UNION_DEPARTMENTS.railway,
    tag: 'Marketing',
    date: 'Jul 15, 2026',
    year: '2026',
    sector: 'Finance',
    level: 'Local Bodies',
    type: 'Compliance',
    label: 'Access Full Strategy Document',
    desc: 'Review of local property assessments, GIS survey implementation, tax collection efficiency, and municipal development fund distributions.',
    ministry: 'Ministry of Housing and Urban Affairs / State Urban Development',
    tabledDate: '15 January 2026',
    fileSize: '11.3 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'Assessment of property tax collections and GIS-based property mapping across 14 Grade-A Municipal Corporations.',
    keyFindings: [
      'Unassessed commercial properties in newly expanded urban corridors resulted in ₹310 Crore foregone annual property tax revenue.',
      'Discrepancies in GIS boundary surveys were unresolved for over three fiscal cycles.'
    ],
    recommendations: [
      'Integrate state electricity billing meter identifiers with municipal property registry records.'
    ]
  },
  {
    id: 'rep-6',
    title: 'Emerging Tech Innovations and their Impact on the Industry Landscape',
    title_hi: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    image: SECTOR_WISE_IMAGES['35'],
    tag: 'Technology',
    date: 'Aug 30, 2026',
    year: '2026',
    sector: 'Tax and Duties',
    level: 'Union',
    type: 'Performance',
    label: 'View Complete Analysis',
    desc: 'Audit reviewing custom software deployments, server security frameworks, automated reconciliation routines, and processing performance benchmarks.',
    ministry: 'Ministry of Finance / CBIC',
    tabledDate: '02 March 2026',
    fileSize: '16.7 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'Comprehensive technical and procedural audit of customs and excise processing engines handling ₹4.8 Lakh Crore in customs declarations annually.',
    keyFindings: [
      'Database access control audits revealed shared privileged credentials in 6 field commissionerates.',
      'Disaster recovery site switchover drills were not conducted during the 2024-25 reporting year.'
    ],
    recommendations: [
      'Enforce role-based single sign-on (SSO) with multi-factor authentication across all customs gateways.'
    ]
  },
  {
    id: 'rep-7',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    title_hi: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    image: CDN_UNION_DEPARTMENTS.railway,
    tag: 'Finance',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Environment and Sustainable Development',
    level: 'Union',
    type: 'Performance',
    label: 'Download Full Report',
    desc: 'Evaluation of transmission corridor development, battery energy storage system pilot projects, and feed-in tariff management for solar parks.',
    ministry: 'Ministry of New and Renewable Energy',
    tabledDate: '19 November 2025',
    fileSize: '21.5 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'Audit of the Green Energy Corridors initiative examining inter-state transmission lines designed to evacuate 40 GW of renewable energy capacity.',
    keyFindings: [
      'Transmission line construction lagged solar park commissioning by up to 18 months, leading to generation curtailment of 840 GWh.',
      'Subsidies of ₹560 Crore remained undisbursed due to delay in certification of local module manufacturing.'
    ],
    recommendations: [
      'Synchronize transmission network commissioning schedules with renewable power purchase agreements.'
    ]
  },
  {
    id: 'rep-8',
    title: 'Annual Marketing Strategy Overview with insights into trends and projections',
    title_hi: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    image: SECTOR_WISE_IMAGES['35'],
    tag: 'Marketing',
    date: 'Jul 15, 2026',
    year: '2026',
    sector: 'Finance',
    level: 'States',
    type: 'Performance',
    label: 'Access Full Strategy Document',
    desc: 'Review of toll concession agreements, electronic toll collection (FASTag) audit trails, road surface quality indices, and user fee calculations.',
    ministry: 'Ministry of Road Transport and Highways / NHAI',
    tabledDate: '14 December 2025',
    fileSize: '18.9 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'Scrutiny of 24 Build-Operate-Transfer (BOT) and Hybrid Annuity Model (HAM) highway projects assessing contract execution and revenue sharing compliance.',
    keyFindings: [
      'FASTag toll collection reconciliation differences totaled ₹76 Crore across 11 high-volume toll plazas.',
      'Pavement quality index surveys were overdue on 1,200 km of national highway stretches.'
    ],
    recommendations: [
      'Mandate automated weigh-in-motion (WIM) sensors linked to concessionaire toll payment ledgers.'
    ]
  },
  {
    id: 'rep-9',
    title: 'Emerging Tech Innovations and their Impact on the Industry Landscape',
    title_hi: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    image: SECTOR_WISE_IMAGES['41'],
    tag: 'Technology',
    date: 'Aug 30, 2026',
    year: '2026',
    sector: 'Finance',
    level: 'Union',
    type: 'Compliance',
    label: 'View Complete Analysis',
    desc: 'Financial position, capital investments, dividend yields, accumulated losses, and operational viability of state government owned enterprises.',
    ministry: 'State Finance Departments / State Public Sector Undertakings',
    tabledDate: '06 February 2024',
    fileSize: '23.4 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: true,
    executiveSummary: 'Analysis of 180 state government enterprises covering paid-up equity, loan guarantees, and financial restructuring packages.',
    keyFindings: [
      'Accumulated losses of 42 non-operating enterprises exceeded their combined net worth by 320%.',
      'Timely accounts submission had a backlog of 3 years in 28 statutory boards.'
    ],
    recommendations: [
      'Initiate closure or disinvestment proceedings for chronically loss-making non-operational state undertakings.'
    ]
  },
  {
    id: 'rep-10',
    title: 'Compliance Audit on Cyber Security Architecture and Cloud Adoption in Digital India Initiatives',
    title_hi: 'डिजिटल इंडिया पहलों में साइबर सुरक्षा वास्तुकला और क्लाउड अपनाने पर अनुपालन लेखापरीक्षा',
    image: SECTOR_WISE_IMAGES['42'],
    tag: 'Technology',
    date: 'Feb 15, 2024',
    year: '2024',
    sector: 'Information and Communication',
    level: 'Union',
    type: 'Compliance',
    label: 'Cyber Audit',
    desc: 'Auditing data sovereignty, security operations centre monitoring, incident response compliance, and third-party vendor audits across central digital public platforms.',
    ministry: 'Ministry of Electronics and Information Technology (MeitY)',
    tabledDate: '20 March 2024',
    fileSize: '17.1 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: false,
    executiveSummary: 'Audit assessing cloud data residency, end-to-end encryption standards, and threat mitigation policies across 12 national mission-mode e-governance systems.',
    keyFindings: [
      'Third-party cloud security audits were incomplete in 5 government cloud host environments.',
      'Vulnerability assessments were not conducted following major software updates in 3 citizen services portals.'
    ],
    recommendations: [
      'Institute mandatory continuous security monitoring certifications by CERT-In empaneled auditors.'
    ]
  },
  {
    id: 'rep-11',
    title: 'Financial and Compliance Audit of District Mineral Foundation Trust Funds',
    title_hi: 'जिला खनिज फाउंडेशन ट्रस्ट फंड की वित्तीय और अनुपालन लेखापरीक्षा',
    image: SECTOR_WISE_IMAGES['32'],
    tag: 'Social Welfare',
    date: 'Apr 10, 2024',
    year: '2024',
    sector: 'Social Welfare',
    level: 'Local Bodies',
    type: 'Financial',
    label: 'Mining Trust Audit',
    desc: 'Verification of mining royalties contributions, trust fund allocations for clean drinking water, education, and healthcare in mining affected areas.',
    ministry: 'Ministry of Mines / State Mining Departments',
    tabledDate: '28 April 2024',
    fileSize: '13.6 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: false,
    executiveSummary: 'Scrutiny of ₹8,200 Crore accrued in District Mineral Foundation (DMF) Trusts across 48 mining districts.',
    keyFindings: [
      '42% of trust funds were deployed for general administrative civil works rather than high-priority drinking water and health interventions.',
      'Beneficiary community councils were not consulted in project sanctioning in 18 districts.'
    ],
    recommendations: [
      'Enforce strict adherence to the 60% high-priority expenditure mandate under Pradhan Mantri Khanij Kshetra Kalyan Yojana.'
    ]
  },
  {
    id: 'rep-12',
    title: 'Financial and Accounts Audit of Autonomous District Councils in North Eastern States',
    title_hi: 'पूर्वोत्तर राज्यों में स्वायत्त जिला परिषदों का वित्तीय और लेखा लेखापरीक्षा',
    image: SECTOR_WISE_IMAGES['27'],
    tag: 'Finance',
    date: 'May 14, 2023',
    year: '2023',
    sector: 'Finance',
    level: 'Local Bodies',
    type: 'ADC Reports',
    label: 'ADC Audit',
    desc: 'Audit of grants-in-aid, tax devolution, customary court expenditures, and developmental schemes administered by Sixth Schedule Autonomous District Councils.',
    ministry: 'Ministry of Development of North Eastern Region / State Home Departments',
    tabledDate: '19 June 2023',
    fileSize: '15.9 MB',
    pdfUrl: '/assets/sample-cag-audit-report.pdf',
    isActive: true,
    isFeatured: false,
    executiveSummary: 'Constitutional audit under the Sixth Schedule of the Constitution evaluating financial management in 10 Autonomous District Councils.',
    keyFindings: [
      'Absence of double-entry accounting led to unverified advances of ₹84 Crore.',
      'Utilization certificates for tribal development grants were pending for over 3 years.'
    ],
    recommendations: [
      'Adopt standardized computerized accounting software developed by iCAL for all Autonomous District Councils.'
    ]
  },
  {
    id: 'home-rep-1',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    image: '/assets/Images/reportcard/card1.png',
    tag: 'Text',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Local Bodies',
    level: 'States',
    type: 'Performance',
    isFeatured: true,
    label: 'Civic',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
  },
  {
    id: 'home-rep-2',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    image: '/assets/Images/reportcard/card2.png',
    tag: 'Text',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Environment and Sustainable Development',
    level: 'States',
    type: 'Performance',
    isFeatured: true,
    label: 'Tamil Nadu',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
  },
  {
    id: 'home-rep-3',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    image: '/assets/Images/reportcard/card3.png',
    tag: 'Text',
    date: 'Jun 4, 2026',
    year: '2026',
    sector: 'Agriculture and Rural Development',
    level: 'States',
    type: 'Performance',
    isFeatured: true,
    label: 'Andhra Pradesh',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
  }
];

export const DEFAULT_COMBINED_ACCOUNTS: CombinedAccountItem[] = [
  {
    id: 1,
    title_en: 'Combined Finance and Revenue Accounts of Union and State Governments in India (2024 - 25)',
    title_hi: 'भारत में संघ और राज्य सरकारों के संयुक्त वित्त और राजस्व खाते (2024 - 25)',
    category: 'combined',
    account_year: '2024 - 25',
    volume: 'Full Comprehensive Volume',
    size: '18.5 MB',
    file_url: '#',
    is_active: true
  },
  {
    id: 2,
    title_en: 'Combined Finance and Revenue Accounts of Union and State Governments in India (2023 - 24)',
    title_hi: 'भारत में संघ और राज्य सरकारों के संयुक्त वित्त और राजस्व खाते (2023 - 24)',
    category: 'combined',
    account_year: '2023 - 24',
    volume: 'Full Comprehensive Volume',
    size: '17.2 MB',
    file_url: '#',
    is_active: true
  },
  {
    id: 3,
    title_en: 'Combined Finance and Revenue Accounts of Union and State Governments in India (2022 - 23)',
    title_hi: 'भारत में संघ और राज्य सरकारों के संयुक्त वित्त और राजस्व खाते (2022 - 23)',
    category: 'combined',
    account_year: '2022 - 23',
    volume: 'Full Comprehensive Volume',
    size: '16.8 MB',
    file_url: '#',
    is_active: true
  },
  {
    id: 4,
    title_en: 'Proceedings and Compendium of 34th Annual Conference of State Finance Secretaries (2024)',
    title_hi: 'राज्य वित्त सचिवों के 34वें वार्षिक सम्मेलन की कार्यवाही (2024)',
    category: 'conference',
    account_year: '2024',
    volume: 'Proceedings & Action Points',
    size: '4.5 MB',
    file_url: '#',
    is_active: true
  },
  {
    id: 5,
    title_en: 'Proceedings and Compendium of 33rd Annual Conference of State Finance Secretaries (2023)',
    title_hi: 'राज्य वित्त सचिवों के 33वें वार्षिक सम्मेलन की कार्यवाही (2023)',
    category: 'conference',
    account_year: '2023',
    volume: 'Proceedings & Action Points',
    size: '3.8 MB',
    file_url: '#',
    is_active: true
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
  // --- Live Backend API Connectors for About Us & Governance ---
  async fetchPageData(slugOrId: string, culture = 'en') {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/pages/${encodeURIComponent(slugOrId)}?culture=${culture}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Graceful fallback
    }
    return null;
  },

  async fetchOrganisationChart(culture = 'en') {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/organisation-chart?culture=${culture}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Graceful fallback
    }
    return { officers: [] };
  },

  async fetchFormerCags(culture = 'en') {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/former-cag?culture=${culture}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Graceful fallback
    }
    return this.getFormerCags();
  },

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
      if (!Array.isArray(parsed)) {
        localStorage.setItem('cag_reports', JSON.stringify(DEFAULT_REPORTS));
        return DEFAULT_REPORTS;
      }


      // Auto-migrate & sanitize: actively purge any stale local asset paths (/assets/..., placeholder hashes)
      // and map to authentic CloudFront sector images from http://d7i5wg8xwe4hf.cloudfront.net/en/home
      let hasLocalAssets = false;
      const sanitized = parsed.map((r: ReportItem) => {
        const isLocalOrBroken = !r.image || 
          r.image.startsWith('/assets') || 
          r.image.includes('17a8a6edf') || 
          r.image.includes('56272e2a') || 
          r.image.includes('28f782be') || 
          r.image.includes('d14889fd') || 
          r.image.includes('e2c5a3b8') ||
          r.image.includes('c4913da1') ||
          !r.image.startsWith('http');
        
        if (isLocalOrBroken) {
          hasLocalAssets = true;
          const defMatch = DEFAULT_REPORTS.find(d => d.id === r.id);
          return {
            ...r,
            image: defMatch ? defMatch.image : resolveReportCdnAsset(r.sector, r.title)
          };
        }
        return r;
      });

      if (hasLocalAssets) {
        localStorage.setItem('cag_reports', JSON.stringify(sanitized));
        return sanitized;
      }

      return parsed;
    } catch (e) {
      console.error('Error reading reports from localStorage:', e);
      return DEFAULT_REPORTS;
    }
  },

  saveReport(report: ReportItem) {
    if (typeof window === 'undefined') return;
    // Ensure image is a valid CDN URL if empty or local
    if (!report.image || report.image.startsWith('/assets') || !report.image.startsWith('http')) {
      report.image = resolveReportCdnAsset(report.sector, report.title);
    }
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

  getCombinedAccounts(): CombinedAccountItem[] {
    if (typeof window === 'undefined') return DEFAULT_COMBINED_ACCOUNTS;
    try {
      const stored = localStorage.getItem('cag_combined_accounts');
      if (!stored || stored === 'undefined' || stored === 'null') {
        localStorage.setItem('cag_combined_accounts', JSON.stringify(DEFAULT_COMBINED_ACCOUNTS));
        return DEFAULT_COMBINED_ACCOUNTS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_COMBINED_ACCOUNTS;
    } catch (e) {
      console.error('Error reading combined accounts from localStorage:', e);
      return DEFAULT_COMBINED_ACCOUNTS;
    }
  },

  saveCombinedAccount(item: CombinedAccountItem) {
    if (typeof window === 'undefined') return;
    const items = this.getCombinedAccounts();
    const idx = items.findIndex(c => c.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem('cag_combined_accounts', JSON.stringify(items));
    window.dispatchEvent(new Event('combinedAccountsChange'));
  },

  deleteCombinedAccount(id: number) {
    if (typeof window === 'undefined') return;
    const items = this.getCombinedAccounts();
    const filtered = items.filter(c => c.id !== id);
    localStorage.setItem('cag_combined_accounts', JSON.stringify(filtered));
    window.dispatchEvent(new Event('combinedAccountsChange'));
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
      let items: FormerCAGItem[];
      if (!stored) {
        localStorage.setItem('cag_former_cags', JSON.stringify(DEFAULT_FORMER_CAGS));
        items = DEFAULT_FORMER_CAGS;
      } else {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          items = DEFAULT_FORMER_CAGS.map(def => {
            const found = parsed.find(p => p.id === def.id);
            return found ? { ...found, image_url: def.image_url || found.image_url } : def;
          });
        } else {
          items = DEFAULT_FORMER_CAGS;
        }
      }
      return items.map(item => ({
        ...item,
        tenure: item.tenure ? item.tenure.replace(/\((\d{4})\s*-\s*(\d{4})\)/, '($1 - $2)') : item.tenure
      }));
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
  },

  getCagProfile(): CagProfileItem {
    if (typeof window === 'undefined') return DEFAULT_CAG_PROFILE;
    try {
      const stored = localStorage.getItem('cag_profile_data');
      if (!stored) {
        localStorage.setItem('cag_profile_data', JSON.stringify(DEFAULT_CAG_PROFILE));
        return DEFAULT_CAG_PROFILE;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_CAG_PROFILE;
    }
  },

  saveCagProfile(item: CagProfileItem) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cag_profile_data', JSON.stringify(item));
    window.dispatchEvent(new Event('cagProfileChange'));
  },

  getVisionMission(): VisionMissionItem {
    if (typeof window === 'undefined') return DEFAULT_VISION_MISSION;
    try {
      const stored = localStorage.getItem('cag_vision_mission');
      if (!stored) {
        localStorage.setItem('cag_vision_mission', JSON.stringify(DEFAULT_VISION_MISSION));
        return DEFAULT_VISION_MISSION;
      }
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_VISION_MISSION;
    }
  },

  saveVisionMission(item: VisionMissionItem) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cag_vision_mission', JSON.stringify(item));
    window.dispatchEvent(new Event('visionMissionChange'));
  },

  getOrganisationOfficers(): OrgOfficerItem[] {
    if (typeof window === 'undefined') return DEFAULT_ORG_OFFICERS;
    try {
      const stored = localStorage.getItem('cag_org_officers');
      if (!stored) {
        localStorage.setItem('cag_org_officers', JSON.stringify(DEFAULT_ORG_OFFICERS));
        return DEFAULT_ORG_OFFICERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ORG_OFFICERS;
    } catch (e) {
      return DEFAULT_ORG_OFFICERS;
    }
  },

  saveOrganisationOfficer(item: OrgOfficerItem) {
    if (typeof window === 'undefined') return;
    const list = this.getOrganisationOfficers();
    const idx = list.findIndex(o => o.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_org_officers', JSON.stringify(list));
    window.dispatchEvent(new Event('organisationOfficersChange'));
  },

  deleteOrganisationOfficer(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getOrganisationOfficers().filter(o => o.id !== id);
    localStorage.setItem('cag_org_officers', JSON.stringify(list));
    window.dispatchEvent(new Event('organisationOfficersChange'));
  },

  getHistoryDocuments(): HistoryDocumentItem[] {
    if (typeof window === 'undefined') return DEFAULT_HISTORY_DOCUMENTS;
    try {
      const stored = localStorage.getItem('cag_history_documents');
      if (!stored) {
        localStorage.setItem('cag_history_documents', JSON.stringify(DEFAULT_HISTORY_DOCUMENTS));
        return DEFAULT_HISTORY_DOCUMENTS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HISTORY_DOCUMENTS;
    } catch (e) {
      return DEFAULT_HISTORY_DOCUMENTS;
    }
  },

  saveHistoryDocument(item: HistoryDocumentItem) {
    if (typeof window === 'undefined') return;
    const list = this.getHistoryDocuments();
    const idx = list.findIndex(h => h.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_history_documents', JSON.stringify(list));
    window.dispatchEvent(new Event('historyDocumentsChange'));
  },

  deleteHistoryDocument(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getHistoryDocuments().filter(h => h.id !== id);
    localStorage.setItem('cag_history_documents', JSON.stringify(list));
    window.dispatchEvent(new Event('historyDocumentsChange'));
  },

  getDutiesPowersChapters(): DutiesPowersChapterItem[] {
    if (typeof window === 'undefined') return DEFAULT_DUTIES_POWERS_CHAPTERS;
    try {
      const stored = localStorage.getItem('cag_duties_powers');
      if (!stored) {
        localStorage.setItem('cag_duties_powers', JSON.stringify(DEFAULT_DUTIES_POWERS_CHAPTERS));
        return DEFAULT_DUTIES_POWERS_CHAPTERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DUTIES_POWERS_CHAPTERS;
    } catch (e) {
      return DEFAULT_DUTIES_POWERS_CHAPTERS;
    }
  },

  saveDutiesPowersChapter(item: DutiesPowersChapterItem) {
    if (typeof window === 'undefined') return;
    const list = this.getDutiesPowersChapters();
    const idx = list.findIndex(d => d.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_duties_powers', JSON.stringify(list));
    window.dispatchEvent(new Event('dutiesPowersChange'));
  },

  deleteDutiesPowersChapter(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getDutiesPowersChapters().filter(d => d.id !== id);
    localStorage.setItem('cag_duties_powers', JSON.stringify(list));
    window.dispatchEvent(new Event('dutiesPowersChange'));
  },

  getAuditRegulations(): AuditRegulationItem[] {
    if (typeof window === 'undefined') return DEFAULT_AUDIT_REGULATIONS;
    try {
      const stored = localStorage.getItem('cag_audit_regulations');
      if (!stored) {
        localStorage.setItem('cag_audit_regulations', JSON.stringify(DEFAULT_AUDIT_REGULATIONS));
        return DEFAULT_AUDIT_REGULATIONS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_AUDIT_REGULATIONS;
    } catch (e) {
      return DEFAULT_AUDIT_REGULATIONS;
    }
  },

  saveAuditRegulation(item: AuditRegulationItem) {
    if (typeof window === 'undefined') return;
    const list = this.getAuditRegulations();
    const idx = list.findIndex(r => r.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_audit_regulations', JSON.stringify(list));
    window.dispatchEvent(new Event('auditRegulationsChange'));
  },

  deleteAuditRegulation(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getAuditRegulations().filter(r => r.id !== id);
    localStorage.setItem('cag_audit_regulations', JSON.stringify(list));
    window.dispatchEvent(new Event('auditRegulationsChange'));
  },

  getConstitutionalProvisions(): ConstitutionalProvisionItem[] {
    if (typeof window === 'undefined') return DEFAULT_CONSTITUTIONAL_PROVISIONS;
    try {
      const stored = localStorage.getItem('cag_constitutional_provisions');
      if (!stored) {
        localStorage.setItem('cag_constitutional_provisions', JSON.stringify(DEFAULT_CONSTITUTIONAL_PROVISIONS));
        return DEFAULT_CONSTITUTIONAL_PROVISIONS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CONSTITUTIONAL_PROVISIONS;
    } catch (e) {
      return DEFAULT_CONSTITUTIONAL_PROVISIONS;
    }
  },

  saveConstitutionalProvision(item: ConstitutionalProvisionItem) {
    if (typeof window === 'undefined') return;
    const list = this.getConstitutionalProvisions();
    const idx = list.findIndex(c => c.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_constitutional_provisions', JSON.stringify(list));
    window.dispatchEvent(new Event('constitutionalProvisionsChange'));
  },

  deleteConstitutionalProvision(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getConstitutionalProvisions().filter(c => c.id !== id);
    localStorage.setItem('cag_constitutional_provisions', JSON.stringify(list));
    window.dispatchEvent(new Event('constitutionalProvisionsChange'));
  },

  getAuditAdvisoryMembers(): AuditAdvisoryMemberItem[] {
    if (typeof window === 'undefined') return DEFAULT_AUDIT_ADVISORY_MEMBERS;
    try {
      const stored = localStorage.getItem('cag_audit_advisory_members');
      if (!stored) {
        localStorage.setItem('cag_audit_advisory_members', JSON.stringify(DEFAULT_AUDIT_ADVISORY_MEMBERS));
        return DEFAULT_AUDIT_ADVISORY_MEMBERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_AUDIT_ADVISORY_MEMBERS;
    } catch (e) {
      return DEFAULT_AUDIT_ADVISORY_MEMBERS;
    }
  },

  saveAuditAdvisoryMember(item: AuditAdvisoryMemberItem) {
    if (typeof window === 'undefined') return;
    const list = this.getAuditAdvisoryMembers();
    const idx = list.findIndex(m => m.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_audit_advisory_members', JSON.stringify(list));
    window.dispatchEvent(new Event('auditAdvisoryMembersChange'));
  },

  deleteAuditAdvisoryMember(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getAuditAdvisoryMembers().filter(m => m.id !== id);
    localStorage.setItem('cag_audit_advisory_members', JSON.stringify(list));
    window.dispatchEvent(new Event('auditAdvisoryMembersChange'));
  },

  getStateAccounts(): any[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('cag_state_accounts');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  saveStateAccount(item: any) {
    if (typeof window === 'undefined') return;
    const list = this.getStateAccounts();
    const idx = list.findIndex(a => (a.rawId && a.rawId === item.rawId) || a.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    localStorage.setItem('cag_state_accounts', JSON.stringify(list));
    window.dispatchEvent(new Event('stateAccountsChange'));
  },

  deleteStateAccount(id: string) {
    if (typeof window === 'undefined') return;
    const list = this.getStateAccounts().filter(a => a.rawId !== id && a.id !== id);
    localStorage.setItem('cag_state_accounts', JSON.stringify(list));
    window.dispatchEvent(new Event('stateAccountsChange'));
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
  { id: 'fc-1', name: 'Girish Chandra Murmu', tenure: '(2020 - 2024)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-FG-Girish-0673ead2d5dcc41-56012319.jpg' },
  { id: 'fc-2', name: 'Rajiv Mehrishi', tenure: '(2017 - 2020)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-Rajiv-05f3c0e1acaff31-44023461.jpg' },
  { id: 'fc-3', name: 'Shashi Kant Sharma', tenure: '(2013 - 2017)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-shashi-05de4f20e412159-43528983.jpg' },
  { id: 'fc-4', name: 'Vinod Rai', tenure: '(2008 - 2013)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-20-05de4f26d189092-01819458.jpg' },
  { id: 'fc-5', name: 'V.N. Kaul', tenure: '(2002 - 2008)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-19-05de4f2a89a6655-77279258.jpg' },
  { id: 'fc-6', name: 'V.K. Shunglu', tenure: '(1996 - 2002)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-18-05de4f2ea4f3913-35294852.jpg' },
  { id: 'fc-7', name: 'C.G. Somiah', tenure: '(1990 - 1996)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-17-05de4f32fd82f40-71710021.jpg' },
  { id: 'fc-8', name: 'T.N. Chaturvedi', tenure: '(1984 - 1990)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-16-05e69dc63495a63-58455972.jpg' },
  { id: 'fc-9', name: 'Gian Prakash', tenure: '(1978 - 1984)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-15-05de4f3b6139fc4-77603869.jpg' },
  { id: 'fc-10', name: 'A. Baksi', tenure: '(1972 - 1978)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-14-05de4f3e9a23e92-06148388.jpg' },
  { id: 'fc-11', name: 'S. Ranganathan', tenure: '(1966 - 1972)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-13-05de4f42bc9fc33-07074595.jpg' },
  { id: 'fc-12', name: 'A.K. Roy', tenure: '(1960 - 1966)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-12-05de4f456be6206-12327052.jpg' },
  { id: 'fc-13', name: 'A.K. Chanda', tenure: '(1954 - 1960)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-11-05de4f481501010-16235001.jpg' },
  { id: 'fc-14', name: 'V. Narahari Rao', tenure: '(1948 - 1954)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-10-05de4f4cc261e13-47267885.jpg' },
  { id: 'fc-15', name: 'Sir Bertie Staig', tenure: '(1945 - 1948)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-9-05de4f54b1fabd5-53902094.jpg' },
  { id: 'fc-16', name: 'Sir. Alexander Cameron Badenoch', tenure: '(1940 - 1945)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-8-05de4f57627dea2-22232732.jpg' },
  { id: 'fc-17', name: 'Sir. Ernest Burdon', tenure: '(1929 - 1940)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-7-05de4f5c7f10c05-58162084.jpg' },
  { id: 'fc-18', name: 'Sir Frederic Gauntlett', tenure: '(1918 - 1929)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-6-05de4f5ed7bb875-61566010.jpg' },
  { id: 'fc-19', name: 'Sir R.A. Gamble', tenure: '(1914 - 1918)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-5-05de4f6428c41d0-49017641.jpg' },
  { id: 'fc-20', name: 'R.W. Gillan', tenure: '(1910 - 1912)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-3-05de4f69b3c4846-44641253.jpg' },
  { id: 'fc-21', name: 'O. J. Barrow', tenure: '(1906 - 1910)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-2-05de4f6ce250c79-14412728.jpg' },
  { id: 'fc-22', name: 'A.F. Cox', tenure: '(1898 - 1906)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-1-05de4f813876643-53936215.jpg' },
  { id: 'fc-23', name: 'S. Jacob', tenure: '(1891 - 1898)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de5246ef3fab3-06278788.jpg' },
  { id: 'fc-24', name: 'E. Gay', tenure: '(1889 - 1891)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de52426934276-79982112.jpg' },
  { id: 'fc-25', name: 'James Westland', tenure: '(1881 - 1889)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de523eb3ac268-09337961.jpg' },
  { id: 'fc-26', name: 'W. Waterfield', tenure: '(1879 - 1881)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de523a2db4837-09057348.jpg' },
  { id: 'fc-27', name: 'E. F. Harrison', tenure: '(1867 - 1879)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de52354106ab6-42880017.jpg' },
  { id: 'fc-28', name: 'R. P. Harrison', tenure: '(1862 - 1867)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de5230322b459-45273489.jpg' },
  { id: 'fc-29', name: 'Hon. Edmund Drummond', tenure: '(1860 - 1862)', image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-NO-IMAGE-05de522a9e3f6e3-85634168.jpg' }
];

export const DEFAULT_GLOBAL_RELATIONS: GlobalRelationItem[] = [
  {
    id: 'gr-1',
    title: 'INTOSAI (International Organization of Supreme Audit Institutions)',
    category: 'Multilateral',
    desc: 'CAG of India actively participates in INTOSAI governing board and committees on public audit standards.',
    image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/civil.jpg',
    link_url: '#'
  },
  {
    id: 'gr-2',
    title: 'United Nations Panel of External Auditors',
    category: 'UN Audit',
    desc: 'Audit of United Nations Secretariat, specialized agencies, and peacekeeping operations worldwide.',
    image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/commercial.jpg',
    link_url: '#'
  },
  {
    id: 'gr-3',
    title: 'ASOSAI (Asian Organization of Supreme Audit Institutions)',
    category: 'Regional',
    desc: 'Promoting regional cooperation, joint audits, and capacity development across Asian audit institutions.',
    image_url: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/scientific.jpg',
    link_url: '#'
  }
];
