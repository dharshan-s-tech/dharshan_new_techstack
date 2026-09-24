import { ANDHRA_PRADESH_NAV_ITEMS } from './andhraPradeshNav';

export interface SubsiteBreadcrumb {
  label: string;
  labelHi?: string;
  href?: string;
}

export function getSidebarForPath(pathnameOrSlug: string): { heading: string; headingHi?: string; items: SubsiteSidebarItem[] } | null {
  const normalized = pathnameOrSlug
    .replace(/^\/(?:states|ae|ag)\/[^/]+\//, '')
    .replace(/^\/states\/andhra-pradesh\//, '')
    .replace(/\/$/, '');
  const decoded = decodeURIComponent(normalized).toLowerCase();

  // Section-scoped priority
  const topSegment = decoded.split('/')[0];
  const SECTION_MAP: Record<string, string> = {
    'about-us': 'about',
    'about': 'about',
    'functions': 'functions',
    'state-accounts': 'state-accounts',
    'gpf': 'gpf',
    'pension': 'pension',
    'employee-corner': 'employee',
    'employee': 'employee',
    'rti': 'rti',
    'contact-us': 'contact',
    'contact': 'contact'
  };
  const targetNavId = SECTION_MAP[topSegment];

  const prioritizedNavItems = targetNavId
    ? [
        ...ANDHRA_PRADESH_NAV_ITEMS.filter((n) => n.id === targetNavId),
        ...ANDHRA_PRADESH_NAV_ITEMS.filter((n) => n.id !== targetNavId)
      ]
    : ANDHRA_PRADESH_NAV_ITEMS;

  // PASS 1: Exact Match (Highest Priority)
  for (const navItem of prioritizedNavItems) {
    if (navItem.columns) {
      for (const col of navItem.columns) {
        if (col.items && col.items.length > 0) {
          const exactMatch = col.items.some((item) => {
            if (!item.href || item.href === '#') return false;
            const itemPath = item.href
              .replace(/^\/(?:states|ae|ag)\/[^/]+\//, '')
              .replace(/^\/states\/andhra-pradesh\//, '')
              .replace(/\/$/, '');
            const decodedItem = decodeURIComponent(itemPath).toLowerCase();
            return decoded === decodedItem;
          });

          if (exactMatch) {
            return {
              heading: col.heading || navItem.title,
              headingHi: col.headingHi || navItem.titleHi,
              items: col.items.map((item, idx) => ({
                id: `side-${idx}`,
                title: item.title,
                titleHi: item.titleHi,
                href: item.href || '#'
              }))
            };
          }
        }
      }
    }
  }

  // PASS 2: Path Hierarchy / Prefix Match
  for (const navItem of prioritizedNavItems) {
    if (navItem.columns) {
      for (const col of navItem.columns) {
        if (col.items && col.items.length > 0) {
          const match = col.items.some((item) => {
            if (!item.href || item.href === '#') return false;
            const itemPath = item.href
              .replace(/^\/(?:states|ae|ag)\/[^/]+\//, '')
              .replace(/^\/states\/andhra-pradesh\//, '')
              .replace(/\/$/, '');
            const decodedItem = decodeURIComponent(itemPath).toLowerCase();
            return decoded.endsWith(decodedItem) || decodedItem.endsWith(decoded);
          });

          if (match) {
            return {
              heading: col.heading || navItem.title,
              headingHi: col.headingHi || navItem.titleHi,
              items: col.items.map((item, idx) => ({
                id: `side-${idx}`,
                title: item.title,
                titleHi: item.titleHi,
                href: item.href || '#'
              }))
            };
          }
        }
      }
    }
  }

  // PASS 3: Leaf name match (Fallback within prioritized section)
  for (const navItem of prioritizedNavItems) {
    if (navItem.columns) {
      for (const col of navItem.columns) {
        if (col.items && col.items.length > 0) {
          const match = col.items.some((item) => {
            if (!item.href || item.href === '#') return false;
            const itemPath = item.href
              .replace(/^\/(?:states|ae|ag)\/[^/]+\//, '')
              .replace(/^\/states\/andhra-pradesh\//, '')
              .replace(/\/$/, '');
            const decodedItem = decodeURIComponent(itemPath).toLowerCase();
            return decoded.split('/').pop() === decodedItem.split('/').pop();
          });

          if (match) {
            return {
              heading: col.heading || navItem.title,
              headingHi: col.headingHi || navItem.titleHi,
              items: col.items.map((item, idx) => ({
                id: `side-${idx}`,
                title: item.title,
                titleHi: item.titleHi,
                href: item.href || '#'
              }))
            };
          }
        }
      }
    }
  }

  return null;
}

export interface SubsiteSidebarItem {
  id: string;
  title: string;
  titleHi?: string;
  href: string;
}

export interface SubsiteDocumentItem {
  id: string;
  title: string;
  titleHi?: string;
  year?: string;
  date?: string;
  fileSize: string;
  downloadUrl: string;
  category?: string;
  fullUrl?: string;
}

export interface SubsiteReportCardItem {
  id: string;
  title: string;
  titleHi?: string;
  category: string;
  categoryHi?: string;
  date: string;
  sector: string;
  sectorHi?: string;
  thumbnailUrl?: string;
  downloadUrl: string;
  reportType?: string;
}

export interface SubsiteMediaItem {
  id: string;
  title: string;
  titleHi?: string;
  date: string;
  type: 'photo' | 'video';
  thumbnailUrl: string;
  mediaUrl?: string;
}

export type SubsiteTemplateType =
  | 'photo-content'
  | 'document-list'
  | 'reports-grid'
  | 'form'
  | 'media-gallery';

export interface SubsitePageData {
  slug: string; // e.g. 'About-Us/Profile-of-PAG'
  title: string;
  titleHi: string;
  templateType: SubsiteTemplateType;
  breadcrumbs: SubsiteBreadcrumb[];
  sidebar: {
    heading: string;
    headingHi?: string;
    items: SubsiteSidebarItem[];
  };
  content?: {
    contentHtml?: string;
    contentHtmlHi?: string;
    featuredImage?: string;
    imageCaption?: string;
    introParagraphs: string[];
    introParagraphsHi?: string[];
    accentHighlight?: string;
    accentHighlightHi?: string;
    bodyParagraphs?: string[];
    bodyParagraphsHi?: string[];
    bulletPoints?: string[];
    bulletPointsHi?: string[];
    officerDetails?: {
      name: string;
      designation: string;
      cadre: string;
      email: string;
      phone: string;
    };
  };
  documents?: SubsiteDocumentItem[];
  reports?: SubsiteReportCardItem[];
  media?: SubsiteMediaItem[];
  hideArchiveButton?: boolean;
  displayMode?: 'list' | 'table';
}

export const ANDHRA_PRADESH_PAGES: Record<string, SubsitePageData> = {
  // =========================================================================
  // 1. ABOUT US
  // =========================================================================
  'About-Us/Profile-of-PAG': {
    slug: 'About-Us/Profile-of-PAG',
    title: 'Profile of Principal Accountant General',
    titleHi: 'प्रधान महालेखाकार का जीवनवृत्त',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
      { label: 'Profile of PAG', labelHi: 'पीएजी का जीवनवृत्त' }
    ],
    sidebar: {
      heading: 'About Us',
      headingHi: 'हमारे बारे में',
      items: [
        { id: 'pag-profile', title: 'Profile of PAG', titleHi: 'पीएजी का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
        { id: 'group-officers', title: 'Profile of Group Officers', titleHi: 'समूह अधिकारियों का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-Group-Officers' },
        { id: 'mandate', title: 'Mandate', titleHi: 'अधिदेश', href: '/states/andhra-pradesh/About-Us/Mandate' },
        { id: 'vision', title: 'Our Vision, Mission & Core Values', titleHi: 'विजन, मिशन एवं मूल मूल्य', href: '/states/andhra-pradesh/About-Us/Our-Vision,-Mission-&-Core-Values' },
        { id: 'org-structure', title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
        { id: 'org-chart', title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
      ]
    },
    content: {
      featuredImage: '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png',
      imageCaption: 'Principal Accountant General (A&E), Andhra Pradesh',
      officerDetails: {
        name: 'Shri K. Satyanarayana, IA&AS',
        designation: 'Principal Accountant General (A&E)',
        cadre: 'IA&AS (1998 Batch)',
        email: 'agaepandhrapradesh@cag.gov.in',
        phone: '+91-866-2421240'
      },
      introParagraphs: [
        'The Principal Accountant General (A&E), Andhra Pradesh, Vijayawada heads the State Accounts and Entitlement functions of Andhra Pradesh under the Comptroller and Auditor General of India.',
        'The office is entrusted with the vital statutory responsibility of compiling monthly and annual civil accounts of the Government of Andhra Pradesh, maintaining General Provident Fund (GPF) accounts for over 2.29 lakh state government employees, and authorizing pensionary benefits.'
      ],
      accentHighlight: 'Committed to upholding supreme constitutional values of Transparency, Accountability, and Impeccable Public Financial Management.',
      bodyParagraphs: [
        'Under the administrative leadership of the Principal Accountant General, this office has pioneered digital transformation through Voucher Level Computerization (VLC), paperless electronic pension authorization, and real-time citizen-centric portals.',
        'The Principal Accountant General works in close coordination with the State Finance Department, treasuries, and public drawing and disbursing officers to foster financial transparency and accuracy across government expenditure.'
      ]
    }
  },

  'About-Us/Profile-of-Group-Officers': {
    slug: 'About-Us/Profile-of-Group-Officers',
    title: 'Profile of Group Officers',
    titleHi: 'समूह अधिकारियों का जीवनवृत्त',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
      { label: 'Profile of Group Officers', labelHi: 'समूह अधिकारियों का जीवनवृत्त' }
    ],
    sidebar: {
      heading: 'About Us',
      headingHi: 'हमारे बारे में',
      items: [
        { id: 'pag-profile', title: 'Profile of PAG', titleHi: 'पीएजी का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
        { id: 'group-officers', title: 'Profile of Group Officers', titleHi: 'समूह अधिकारियों का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-Group-Officers' },
        { id: 'mandate', title: 'Mandate', titleHi: 'अधिदेश', href: '/states/andhra-pradesh/About-Us/Mandate' },
        { id: 'vision', title: 'Our Vision, Mission & Core Values', titleHi: 'विजन, मिशन एवं मूल मूल्य', href: '/states/andhra-pradesh/About-Us/Our-Vision,-Mission-&-Core-Values' },
        { id: 'org-structure', title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
        { id: 'org-chart', title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
      ]
    },
    content: {
      featuredImage: '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png',
      introParagraphs: [
        'The Group Officers of the Indian Audit and Accounts Department assist the Principal Accountant General in supervising the Administration, Accounts & VLC, Pension, and General Provident Fund groups.',
        'Each group is headed by an officer of the rank of Deputy Accountant General (DAG) / Senior Deputy Accountant General (Sr. DAG).'
      ],
      accentHighlight: 'Ensuring efficient execution of statutory duties and seamless citizen services across all branches.',
      bodyParagraphs: [
        '1. Deputy Accountant General (Administration): Oversees personnel management, vigilance, budget, estate, and general administration.',
        '2. Deputy Accountant General (Accounts & VLC): Heads the compilation of State Accounts, monthly civil accounts, treasury inspections, and appropriation accounts.',
        '3. Deputy Accountant General (Pension & GPF): Oversees verification, maintenance of GPF ledger accounts, and authorization of state pension cases.'
      ]
    }
  },

  'About-Us/Mandate': {
    slug: 'About-Us/Mandate',
    title: 'Mandate of the Office',
    titleHi: 'कार्यालय का अधिदेश',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
      { label: 'Mandate', labelHi: 'अधिदेश' }
    ],
    sidebar: {
      heading: 'About Us',
      headingHi: 'हमारे बारे में',
      items: [
        { id: 'pag-profile', title: 'Profile of PAG', titleHi: 'पीएजी का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
        { id: 'group-officers', title: 'Profile of Group Officers', titleHi: 'समूह अधिकारियों का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-Group-Officers' },
        { id: 'mandate', title: 'Mandate', titleHi: 'अधिदेश', href: '/states/andhra-pradesh/About-Us/Mandate' },
        { id: 'vision', title: 'Our Vision, Mission & Core Values', titleHi: 'विजन, मिशन एवं मूल मूल्य', href: '/states/andhra-pradesh/About-Us/Our-Vision,-Mission-&-Core-Values' },
        { id: 'org-structure', title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
        { id: 'org-chart', title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
      ]
    },
    content: {
      introParagraphs: [
        "The mandate of the Principal Accountant General (A&E) originates from Articles 149, 150, and 151 of the Constitution of India, read with the Comptroller and Auditor General's (Duties, Powers and Conditions of Service) Act, 1971 (DPC Act).",
        'Under Section 10 of the Act, the C&AG is responsible for compiling the accounts of each State from the initial and subsidiary accounts rendered to the audit and accounts offices.'
      ],
      accentHighlight: 'Statutory authority under Section 10 & 11 of the C&AG (DPC) Act 1971 for state accounting and entitlement governance.',
      bodyParagraphs: [
        'Key statutory functions include:',
        '• Compilation of Monthly Civil Accounts and submission to State Government.',
        '• Preparation of Annual Finance Accounts and Appropriation Accounts.',
        '• Maintenance of individual GPF accounts for state government employees.',
        '• Verification and authorization of pension and gratuity benefits.'
      ]
    }
  },

  'About-Us/Our-Vision,-Mission-&-Core-Values': {
    slug: 'About-Us/Our-Vision,-Mission-&-Core-Values',
    title: 'Our Vision, Mission & Core Values',
    titleHi: 'हमारा विजन, मिशन और मूल मूल्य',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
      { label: 'Vision & Mission', labelHi: 'विजन एवं मिशन' }
    ],
    sidebar: {
      heading: 'About Us',
      headingHi: 'हमारे बारे में',
      items: [
        { id: 'pag-profile', title: 'Profile of PAG', titleHi: 'पीएजी का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
        { id: 'group-officers', title: 'Profile of Group Officers', titleHi: 'समूह अधिकारियों का जीवनवृत्त', href: '/states/andhra-pradesh/About-Us/Profile-of-Group-Officers' },
        { id: 'mandate', title: 'Mandate', titleHi: 'अधिदेश', href: '/states/andhra-pradesh/About-Us/Mandate' },
        { id: 'vision', title: 'Our Vision, Mission & Core Values', titleHi: 'विजन, मिशन एवं मूल मूल्य', href: '/states/andhra-pradesh/About-Us/Our-Vision,-Mission-&-Core-Values' },
        { id: 'org-structure', title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
        { id: 'org-chart', title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
      ]
    },
    content: {
      introParagraphs: [
        'VISION: We strive to be a global leader and catalyst for improved public sector accountability and governance, conducting independent audits and accounting services with excellence.',
        'MISSION: Mandated by the Constitution, we promote accountability, transparency, and good governance through high quality accounting and entitlement services to our stakeholders.'
      ],
      accentHighlight: 'Core Values: Independence, Objectivity, Integrity, Reliability, Professional Excellence, Transparency, Positive Approach.',
      bodyParagraphs: [
        'We adhere to rigorous standards of integrity, continuous professional development, and technological empowerment to deliver accurate and timely financial insights for public welfare.'
      ]
    }
  },

  'About-Us/Organisation-Chart/Organization-Structure': {
    slug: 'About-Us/Organisation-Chart/Organization-Structure',
    title: 'Organization Structure',
    titleHi: 'संगठनात्मक संरचना',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
      { label: 'Organization Structure', labelHi: 'संगठनात्मक संरचना' }
    ],
    sidebar: {
      heading: 'Organisation Chart',
      headingHi: 'संगठन संरचना',
      items: [
        { id: 'org-structure', title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
        { id: 'org-chart', title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
      ]
    },
    content: {
      featuredImage: '/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png',
      introParagraphs: [
        'The Office of the Principal Accountant General (A&E), Andhra Pradesh is structured into dedicated operational wings to ensure specialized focus on public accounts and entitlements.',
        'The functional wings include Administration, Accounts & VLC, Pension & Provident Fund, and Welfare.'
      ],
      accentHighlight: 'Structured for operational agility, rigorous checks and balances, and seamless citizen service delivery.',
      bodyParagraphs: [
        '• Administration Wing: Coordinates internal administration, personnel matters, IT systems, and training.',
        '• Accounts & VLC Group: Compiles state government accounts from 13 district treasuries and public works divisions.',
        '• Pension Group: Authorizes superannuation, family pension, gratuity, and commutation for state government retirees.',
        '• GPF Group: Maintains provident fund accounts, handles advances, and settles final payment claims.'
      ]
    }
  },

  'About-Us/Organisation-Chart/Organization-Chart': {
    slug: 'About-Us/Organisation-Chart/Organization-Chart',
    title: 'Organization Chart',
    titleHi: 'संगठन चार्ट',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Profile-of-PAG' },
      { label: 'Organization Chart', labelHi: 'संगठन चार्ट' }
    ],
    sidebar: {
      heading: 'Organisation Chart',
      headingHi: 'संगठन संरचना',
      items: [
        { id: 'org-structure', title: 'Organization Structure', titleHi: 'संगठनात्मक संरचना', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Structure' },
        { id: 'org-chart', title: 'Organization Chart', titleHi: 'संगठन चार्ट', href: '/states/andhra-pradesh/About-Us/Organisation-Chart/Organization-Chart' }
      ]
    },
    content: {
      featuredImage: '/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png',
      introParagraphs: [
        'The hierarchical chain of command in the office flows from the Principal Accountant General (A&E) to Deputy Accountants General, Senior Accounts Officers (SAO), Assistant Accounts Officers (AAO), and operational staff.',
        'Regular internal reviews and supervisory checkpoints maintain high precision across all financial compilation workflows.'
      ],
      accentHighlight: 'Hierarchical governance ensuring strict compliance with CAG Auditing and Accounting Standards.',
      bodyParagraphs: [
        'Senior Accounts Officers oversee individual branches and sections, ensuring prompt response to treasury receipts, pensioner queries, and state legislative requisitions.'
      ]
    }
  },

  // =========================================================================
  // 2. FUNCTIONS & ADMINISTRATION
  // =========================================================================
  'Functions/Administration/Introduction': {
    slug: 'Functions/Administration/Introduction',
    title: 'Administration - Introduction',
    titleHi: 'प्रशासन - परिचय',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Introduction', labelHi: 'परिचय' }
    ],
    sidebar: {
      heading: 'Administration',
      headingHi: 'प्रशासन',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'ss-pip', title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
        { id: 'budget', title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: '/states/andhra-pradesh/Functions/Administration/Budget-&-Expenditure' },
        { id: 'deputation', title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
        { id: 'gradation', title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
        { id: 'circulars', title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
        { id: 'manual', title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: '/states/andhra-pradesh/Functions/Administration/Office-Manual' },
        { id: 'transfer', title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
        { id: 'icc', title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
        { id: 'training', title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
        { id: 'rajbhasha', title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
      ]
    },
    content: {
      introParagraphs: [
        'The Administration Wing is the backbone of the Office of the Principal Accountant General (A&E), Andhra Pradesh. It is responsible for human resource management, cadre control, establishment matters, training, and operational logistics.',
        'Headed by a Deputy Accountant General (Administration), the wing ensures smooth administrative governance adhering to central government service rules and IA&AD guidelines.'
      ],
      accentHighlight: 'Empowering departmental excellence through efficient human resource administration and staff welfare.',
      bodyParagraphs: [
        'Key responsibilities of Administration include staff recruitment, promotions, performance appraisals (APAR), vigilance, training programs at Regional Training Institutes (RTIs), and implementation of Official Language policies.'
      ]
    }
  },

  'Functions/Administration/Gradation-List': {
    slug: 'Functions/Administration/Gradation-List',
    title: 'Gradation List',
    titleHi: 'वरीयता सूची',
    templateType: 'document-list',
    hideArchiveButton: true,
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Gradation List', labelHi: 'वरीयता सूची' }
    ],
    sidebar: {
      heading: 'Administration',
      headingHi: 'प्रशासन',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'ss-pip', title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
        { id: 'budget', title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: '/states/andhra-pradesh/Functions/Administration/Budget-&-Expenditure' },
        { id: 'deputation', title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
        { id: 'gradation', title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
        { id: 'circulars', title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
        { id: 'manual', title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: '/states/andhra-pradesh/Functions/Administration/Office-Manual' },
        { id: 'transfer', title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
        { id: 'icc', title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
        { id: 'training', title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
        { id: 'rajbhasha', title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
      ]
    },
    documents: [
      {
        id: 'gl-1',
        title: 'Gradation list as on 01.03.2025',
        titleHi: 'वरीयता सूची 01.03.2025 के अनुसार',
        year: '2025',
        fileSize: '1.82 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/gradation_list/Gradation-list-as-on-01032025-06943af6d587ce8-95010083.pdf'
      },
      {
        id: 'gl-2',
        title: 'Gradation list as on 01.03.2024',
        titleHi: 'वरीयता सूची 01.03.2024 के अनुसार',
        year: '2024',
        fileSize: '2.01 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/gradation_list/Gradation-list-as-on-01-03-2024-06874f5cc8ab1b5-17312087.pdf'
      },
      {
        id: 'gl-3',
        title: 'Gradation list as on 01.03.2023',
        titleHi: 'वरीयता सूची 01.03.2023 के अनुसार',
        year: '2023',
        fileSize: '2.01 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/gradation_list/Gradation-list-as-on-01-03-2023-0654ca9818a5758-37883664.pdf'
      },
      {
        id: 'gl-4',
        title: 'Gradation List as on 01-03-2022',
        titleHi: 'वरीयता सूची 01.03.2022 के अनुसार',
        year: '2022',
        fileSize: '0.94 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/gradation_list/AP-gradation-list-as-on-01-03-2022-final-06321a408310e35-39986240.pdf'
      },
      {
        id: 'gl-5',
        title: 'Gradation list as on 01.03.2021',
        titleHi: 'वरीयता सूची 01.03.2021 के अनुसार',
        year: '2021',
        fileSize: '0.78 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/gradation_list/AP-gradation-list-as-on-01-03-2021-0687644bb20c223-00923787.pdf'
      }
    ]
  },

  'Functions/Administration/Circulars-Office-Orders': {
    slug: 'Functions/Administration/Circulars-Office-Orders',
    title: 'Circulars / Office Orders',
    titleHi: 'परिपत्र / कार्यालय आदेश',
    templateType: 'document-list',
    displayMode: 'table',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Circulars / Office Orders', labelHi: 'परिपत्र / कार्यालय आदेश' }
    ],
    sidebar: {
      heading: 'Administration',
      headingHi: 'प्रशासन',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'ss-pip', title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
        { id: 'budget', title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: '/states/andhra-pradesh/Functions/Administration/Budget-&-Expenditure' },
        { id: 'deputation', title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
        { id: 'gradation', title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
        { id: 'circulars', title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
        { id: 'manual', title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: '/states/andhra-pradesh/Functions/Administration/Office-Manual' },
        { id: 'transfer', title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
        { id: 'icc', title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
        { id: 'training', title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
        { id: 'rajbhasha', title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
      ]
    },
    documents: [
      {
        id: 'circ-1',
        title: 'Submission of IPR for the year 2024- Reg.',
        titleHi: 'वर्ष 2024 के लिए आईपीआर प्रस्तुत करना',
        date: '26-Dec-2024',
        fileSize: '0.51 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-06774ff2f435829-60156433.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-2',
        title: 'Submission of IPRs for the year 2023  - Reg',
        titleHi: 'वर्ष 2023 के लिए आईपीआर प्रस्तुत करना',
        date: '28-Dec-2023',
        fileSize: '0.60 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-0658d42659ceeb3-17230806.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-3',
        title: 'Submission of common Nomination form for Gratuity and CGEGIS under CCS Rules 2021',
        titleHi: 'सीसीएस नियम 2021 के तहत ग्रेच्युटी और सीजीईजीआईएस के लिए सामान्य नामांकन फॉर्म',
        date: '27-Apr-2023',
        fileSize: '0.19 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-0644f9458ab8b70-43783356.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-4',
        title: 'Permission for acquisition of movable/immovable property ',
        titleHi: 'चल/अचल संपत्ति के अधिग्रहण की अनुमति',
        date: '14-Jul-2022',
        fileSize: '0.19 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-062d0071ab10312-22895197.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-5',
        title: 'Deputation Notification for Filling Vacant Posts in the Office of the Principal Accountant General (A&E), Andhra Pradesh, Vijayawada - Reg.',
        titleHi: 'प्रधान महालेखाकार (लेखा एवं हकदारी), आंध्र प्रदेश में रिक्त पदों को भरने हेतु प्रतिनियुक्ति अधिसूचना',
        date: '22-Apr-2025',
        fileSize: '0.56 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-06847d9b0757027-97888576.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-6',
        title: 'Permission for Outside posts- reg',
        titleHi: 'बाहरी पदों के लिए अनुमति',
        date: '17-Aug-2022',
        fileSize: '0.45 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-062fdfe3c6002f4-99958243.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-7',
        title: 'Permission/intimation for acceptance of gifts in compliance with the provisions of CCS (CONDUCT) Rules - 1964',
        titleHi: 'उपहार स्वीकार करने की अनुमति/सूचना (सीसीएस आचरण नियम 1964)',
        date: '14-Jul-2022',
        fileSize: '0.19 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-062d0075d5fc4a2-91641946.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-8',
        title: 'Adherence to provisions of CCS (Conduct) rules - 1964',
        titleHi: 'सीसीएस (आचरण) नियम 1964 के प्रावधानों का पालन',
        date: '14-Jul-2022',
        fileSize: '0.19 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-062d006eabc20a5-56700072.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-9',
        title: 'Inviting applications for advance for purchase of personal computer- Reg',
        titleHi: 'पर्सनल कंप्यूटर खरीदने के लिए अग्रिम आवेदन',
        date: '19-Apr-2022',
        fileSize: '0.25 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-0625e8803bddd95-89808520.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-10',
        title: 'Immovable Property Returns for the year 2022',
        titleHi: 'वर्ष 2022 के लिए अचल संपत्ति विवरण',
        date: '28-Dec-2022',
        fileSize: '0.43 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-063ad2bbbd3f0b8-14656014.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-11',
        title: 'Covid-19 Booster dose Vaccination camp',
        titleHi: 'कोविड-19 बूस्टर खुराक टीकाकरण शिविर',
        date: '28-Dec-2022',
        fileSize: '0.35 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/CircularsOfficeOrders-063ad4162b15450-09016490.pdf',
        fullUrl: '-'
      },
      {
        id: 'circ-12',
        title: 'Precautionary measures to contain Covid-19(OO-14)',
        titleHi: 'कोविड-19 को रोकने के लिए एहतियाती उपाय (कार्यालय आदेश 14)',
        date: '22-Jun-2020',
        fileSize: '0.40 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/ae_circulars_office_orders/AeCircularsOfficeOrders-05ef098d600b646-96259658.pdf',
        fullUrl: '-'
      }
    ]
  },

  'Functions/Administration/SS-&-PIP': {
    slug: 'Functions/Administration/SS-&-PIP',
    title: 'SS & PIP',
    titleHi: 'एसएस एवं पीआईपी',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'SS & PIP', labelHi: 'एसएस एवं पीआईपी' }
    ],
    sidebar: {
      heading: 'Administration',
      headingHi: 'प्रशासन',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'ss-pip', title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
        { id: 'budget', title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: '/states/andhra-pradesh/Functions/Administration/Budget-&-Expenditure' },
        { id: 'deputation', title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
        { id: 'gradation', title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
        { id: 'circulars', title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
        { id: 'manual', title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: '/states/andhra-pradesh/Functions/Administration/Office-Manual' },
        { id: 'transfer', title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
        { id: 'icc', title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
        { id: 'training', title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
        { id: 'rajbhasha', title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
      ]
    },
    content: {
      introParagraphs: [
        'Sanctioned Strength (SS) and Persons in Position (PIP) of the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ],
      contentHtml: `<table border="0" cellpadding="0" cellspacing="0" style="width:100%; max-width:600px; margin: 0 auto;" class="cag-data-table">
	<tbody>
		<tr height="25" style="background-color: #0A3D30; color: #ffffff;">
			<td colspan="4" height="25" style="padding: 10px; font-weight: bold; font-size: 16px; text-align: center;"><strong>SS &amp; MIP as on 01.07.2025</strong></td>
		</tr>
		<tr height="25" style="background-color: #f3f4f6; font-weight: bold;">
			<td height="25" style="padding: 8px 12px; border: 1px solid #e5e7eb; width: 60px;"><strong>Sl No.</strong></td>
			<td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><strong>Category of posts</strong></td>
			<td style="padding: 8px 12px; border: 1px solid #e5e7eb; width: 80px; text-align: right;"><strong>SS</strong></td>
			<td style="padding: 8px 12px; border: 1px solid #e5e7eb; width: 80px; text-align: right;"><strong>PIP</strong></td>
		</tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SR.A.O</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">20</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">14</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">2</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SR.A.O (Ex-Cadre)</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">3</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">A.A.O</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">74</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">73</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">4</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">A.A.O(Ex-Cadre)</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">5</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SUPERVISOR</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">12</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">11</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">6</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ASST SUPERVISOR</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">36</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">28</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">7</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">WEL.ASST.(Ex-Cadre)</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">8</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SR. AR./ACCT.</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">72</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">36</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">9</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">AUDITOR/ACCT.</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">120</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">110</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">10</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">PS</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">11</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SG I</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">3</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">12</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SG II</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">4</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">2</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">13</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">CLERK/TYPIST</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">30</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">6</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">14</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ASST DIRECTOR (OL)</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">15</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">SR.TLTR.</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">16</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">JR.TLTR.</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">17</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">S.G.REC.KEEPER</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">3</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">18</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">LEGAL ASSISTANT</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">19</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ADMN ASST (AA)</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">21</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">20</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ACCOUNTS ASST GR-II</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">5</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">21</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ACCOUNTS ASST GR-I</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">3</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">22</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">DATA MANAGER (DEO-G)</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">23</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">D.E.O GRADE-B</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">3</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">24</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">D.E.O GRADE-A</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">5</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">2</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">25</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ISM GRADE-II</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">26</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">ISM GRADE-I</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">1</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">27</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">MTS</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">90</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">0</td></tr>
		<tr style="background-color: #f3f4f6; font-weight: bold;"><td style="padding: 8px 12px; border: 1px solid #e5e7eb;">&nbsp;</td><td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><strong>Grand Total</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;"><strong>512</strong></td><td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;"><strong>285</strong></td></tr>
	</tbody>
</table>`
    }
  },

  'Functions/Administration/Budget-&-Expenditure': {
    slug: 'Functions/Administration/Budget-&-Expenditure',
    title: 'Budget & Expenditure',
    titleHi: 'बजट एवं व्यय',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Budget & Expenditure', labelHi: 'बजट एवं व्यय' }
    ],
    sidebar: {
      heading: 'Administration',
      headingHi: 'प्रशासन',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'ss-pip', title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
        { id: 'budget', title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: '/states/andhra-pradesh/Functions/Administration/Budget-&-Expenditure' },
        { id: 'deputation', title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
        { id: 'gradation', title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
        { id: 'circulars', title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
        { id: 'manual', title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: '/states/andhra-pradesh/Functions/Administration/Office-Manual' },
        { id: 'transfer', title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
        { id: 'icc', title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
        { id: 'training', title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
        { id: 'rajbhasha', title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
      ]
    },
    documents: [
      { id: 'be-1', title: 'Budget Allocation & Expenditure Report FY 2025-26', titleHi: 'बजट आवंटन एवं व्यय रिपोर्ट वित्तीय वर्ष 2025-26', year: '2025 - 26', fileSize: '2.14 MB', downloadUrl: '#' },
      { id: 'be-2', title: 'Budget Allocation & Expenditure Report FY 2024-25', titleHi: 'बजट आवंटन एवं व्यय रिपोर्ट वित्तीय वर्ष 2024-25', year: '2024 - 25', fileSize: '2.08 MB', downloadUrl: '#' }
    ]
  },

  'Functions/Administration/Deputation': {
    slug: 'Functions/Administration/Deputation',
    title: 'Deputation',
    titleHi: 'प्रतिनियुक्ति',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Administration', labelHi: 'प्रशासन', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Deputation', labelHi: 'प्रतिनियुक्ति' }
    ],
    sidebar: {
      heading: 'Administration',
      headingHi: 'प्रशासन',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'ss-pip', title: 'SS & PIP', titleHi: 'एसएस एवं पीआईपी', href: '/states/andhra-pradesh/Functions/Administration/SS-&-PIP' },
        { id: 'budget', title: 'Budget & Expenditure', titleHi: 'बजट एवं व्यय', href: '/states/andhra-pradesh/Functions/Administration/Budget-&-Expenditure' },
        { id: 'deputation', title: 'Deputation', titleHi: 'प्रतिनियुक्ति', href: '/states/andhra-pradesh/Functions/Administration/Deputation' },
        { id: 'gradation', title: 'Gradation List', titleHi: 'वरीयता सूची', href: '/states/andhra-pradesh/Functions/Administration/Gradation-List' },
        { id: 'circulars', title: 'Circulars / Office Orders', titleHi: 'परिपत्र / कार्यालय आदेश', href: '/states/andhra-pradesh/Functions/Administration/Circulars-Office-Orders' },
        { id: 'manual', title: 'Office Manual', titleHi: 'कार्यालय नियमावली', href: '/states/andhra-pradesh/Functions/Administration/Office-Manual' },
        { id: 'transfer', title: 'Transfer & Posting Guidelines', titleHi: 'स्थानांतरण दिशानिर्देश', href: '/states/andhra-pradesh/Functions/Administration/Transfer-&-Posting-Guidelines' },
        { id: 'icc', title: 'Internal Complaints Committee (ICC)', titleHi: 'आंतरिक शिकायत समिति', href: '/states/andhra-pradesh/Functions/Administration/Internal-Complaints-Committee-(ICC)' },
        { id: 'training', title: 'Training', titleHi: 'प्रशिक्षण', href: '/states/andhra-pradesh/Functions/Administration/Training' },
        { id: 'rajbhasha', title: 'Rajbhasha', titleHi: 'राजभाषा', href: '/states/andhra-pradesh/Functions/Administration/Rajbhasha' }
      ]
    },
    documents: [
      {
        id: 'dep-1',
        title: 'Deputation',
        titleHi: 'प्रतिनियुक्ति',
        fileSize: '0.05 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/deputation/list-of-candidates-on-deputation-Copy-06875e3898543e7-69339236.pdf'
      }
    ]
  },

  // =========================================================================
  // 3. STATE ACCOUNTS
  // =========================================================================
  'State-Accounts/Accounting-System/Structure-of-Accounts': {
    slug: 'State-Accounts/Accounting-System/Structure-of-Accounts',
    title: 'Structure of Accounts',
    titleHi: 'लेखा संरचना',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Structure of Accounts', labelHi: 'लेखा संरचना' }
    ],
    sidebar: {
      heading: 'Accounting System',
      headingHi: 'लेखा प्रणाली',
      items: [
        { id: 'struct', title: 'Structure of Accounts', titleHi: 'लेखा संरचना', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
        { id: 'treasury', title: 'Treasury Inspection', titleHi: 'कोषागार निरीक्षण', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Treasury-Inspection' },
        { id: 'pao', title: 'List of PAO/APAOs', titleHi: 'पीएओ/एपीएओ की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-PAO-APAOs' },
        { id: 'treasuries-code', title: 'List of Treasuries / Sub Treasuries with Code', titleHi: 'कोड सहित कोषागारों की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-Treasuries' },
        { id: 'other-func', title: 'Other Accounting Functions', titleHi: 'अन्य लेखा कार्य', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Other-Accounting-Functions' }
      ]
    },
    content: {
      introParagraphs: [
        'Government accounts are maintained in three distinct parts: Consolidated Fund of the State, Contingency Fund of the State, and Public Account of the State.',
        'The classification structure follows a uniform six-tier budget classification code system prescribed by the Comptroller and Auditor General of India under Article 150 of the Constitution.'
      ],
      accentHighlight: 'Unified accounting architecture ensuring fiscal discipline and legislative accountability across all government departments.',
      bodyParagraphs: [
        '1. Consolidated Fund: Comprises revenue receipts, capital receipts, loans raised, and recoveries of loans.',
        '2. Contingency Fund: An imprest placed at disposal of the Governor for meeting unforeseen emergency expenditures pending legislative authorization.',
        '3. Public Account: Transactions where the Government acts as a banker or trustee (GPF, small savings, reserve funds, deposits, and remittances).'
      ]
    }
  },

  'State-Accounts/Accounting-System/Treasury-Inspection': {
    slug: 'State-Accounts/Accounting-System/Treasury-Inspection',
    title: 'Treasury Inspection',
    titleHi: 'कोषागार निरीक्षण',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Treasury Inspection', labelHi: 'कोषागार निरीक्षण' }
    ],
    sidebar: {
      heading: 'Accounting System',
      headingHi: 'लेखा प्रणाली',
      items: [
        { id: 'struct', title: 'Structure of Accounts', titleHi: 'लेखा संरचना', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
        { id: 'treasury', title: 'Treasury Inspection', titleHi: 'कोषागार निरीक्षण', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Treasury-Inspection' },
        { id: 'pao', title: 'List of PAO/APAOs', titleHi: 'पीएओ/एपीएओ की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-PAO-APAOs' },
        { id: 'treasuries-code', title: 'List of Treasuries / Sub Treasuries with Code', titleHi: 'कोड सहित कोषागारों की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-Treasuries' },
        { id: 'other-func', title: 'Other Accounting Functions', titleHi: 'अन्य लेखा कार्य', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Other-Accounting-Functions' }
      ]
    },
    content: {
      featuredImage: '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png',
      imageCaption: 'Treasury compilation review session',
      introParagraphs: [
        'The PAG (A&E) would conduct periodical inspection of Treasuries to test check transactions, verify maintenance of accounts and other records as prescribed in the rules and regulations. These inspections were followed up by inspection reports incorporating the irregularities detected during the inspection.All Inspection Reports were issued to the respective Sub Treasuries with copies marked to the concerned District Treasury and Director of Treasuries and Accounts for compliance.As per instructions under TR 31 of Treasury Code Vol-1, the Treasury Officer shall dispose off post audit objections within a fortnight of its receipt and shall maintain a post audit register to watch clearance of paras periodically.Treasuries and Sub-treasuries in Andhra Pradesh State function under the administrative control of the Directorate of Treasuries and Accounts (DTA) which inturn is controlled by the Finance Department of the State Government. There are 28 DTOs, 196 Div.STO/STOs in Andhra Pradesh State for which inspection is conducted every year including DTA.'
      ],
      accentHighlight: 'Unified treasury inspection and accounting oversight across Andhra Pradesh State.',
      bodyParagraphs: [
        'Inspection reports highlighting procedural discrepancies are forwarded to the Director of Treasuries and Accounts and respective District Treasuries for compliance.'
      ]
    }
  },

  'Functions/Treasury-Inspection': {
    slug: 'Functions/Treasury-Inspection',
    title: 'Treasury Inspection',
    titleHi: 'कोषागार निरीक्षण',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'About Us', labelHi: 'हमारे बारे में', href: '/states/andhra-pradesh/About-Us/Introduction' },
      { label: 'Functions', labelHi: 'कार्य प्रणाली', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
      { label: 'Treasury Inspection', labelHi: 'कोषागार निरीक्षण', href: '/states/andhra-pradesh/Functions/Treasury-Inspection' },
      { label: 'About Treasury Functions', labelHi: 'कोषागार कार्यों के बारे में' }
    ],
    sidebar: {
      heading: 'Functions',
      headingHi: 'कार्य प्रणाली',
      items: [
        { id: 'admn', title: 'Administration', titleHi: 'प्रशासन', href: '/states/andhra-pradesh/Functions/Administration/Introduction' },
        { id: 'accounts', title: 'Accounts & VLC', titleHi: 'लेखा एवं वीएलसी', href: '/states/andhra-pradesh/Functions/Accounts-VLC' },
        { id: 'pension', title: 'Pension', titleHi: 'पेंशन', href: '/states/andhra-pradesh/Functions/Pension' },
        { id: 'gpf', title: 'GPF', titleHi: 'जीपीएफ', href: '/states/andhra-pradesh/Functions/GPF' },
        { id: 'try-inspect', title: 'Treasury Inspection', titleHi: 'कोषागार निरीक्षण', href: '/states/andhra-pradesh/Functions/Treasury-Inspection' },
        { id: 'welfare', title: 'Welfare', titleHi: 'कल्याण', href: '/states/andhra-pradesh/Functions/Welfare' }
      ]
    },
    content: {
      featuredImage: '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png',
      imageCaption: 'Treasury inspection & review',
      introParagraphs: [
        'The PAG (A&E) would conduct periodical inspection of Treasuries to test check transactions, verify maintenance of accounts and other records as prescribed in the rules and regulations. These inspections are followed up by inspection reports incorporating the irregularities noticed during the inspection. All Inspection Reports would be issued to the respective Sub Treasuries duly marking copies to the concerned District Treasury and Director of Treasuries and Accounts for compliance. The Treasury Officer shall dispose off post audit objections within a fortnight of its receipt and shall maintain a post audit register to watch clearance of paras periodically.',
        'Treasuries and Sub-treasuries in Andhra Pradesh State function under the administrative control of the Directorate of Treasuries and Accounts (DTA) which inturn is controlled by the Finance Department of the State Government. There are 28 DTOs, 43 Div.STOs and 153 STOs in Andhra Pradesh State for which inspection is conducted annually/biennially including DTA (1 DTA + 223 = 224).'
      ],
      accentHighlight: 'Annual Review on Working of treasuries: A consolidated report i.e., Annual Review Report on working of treasuries is prepared every year to highlight the irregularities and defects noticed during the course of inspection.',
      bodyParagraphs: [
        'The report is published and made available online at the official AG office web repository (http://www.agaeapts.gov.in/Admin/AGReports.aspx).'
      ]
    }
  },

  'State-Accounts/Accounting-System/List-of-PAO-APAOs': {
    slug: 'State-Accounts/Accounting-System/List-of-PAO-APAOs',
    title: 'List of Pay and Accounts Officers (PAO/APAOs)',
    titleHi: 'वेतन एवं लेखा अधिकारियों की सूची (पीएओ/एपीएओ)',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'List of PAO/APAOs', labelHi: 'पीएओ/एपीएओ सूची' }
    ],
    sidebar: {
      heading: 'Accounting System',
      headingHi: 'लेखा प्रणाली',
      items: [
        { id: 'struct', title: 'Structure of Accounts', titleHi: 'लेखा संरचना', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
        { id: 'treasury', title: 'Treasury Inspection', titleHi: 'कोषागार निरीक्षण', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Treasury-Inspection' },
        { id: 'pao', title: 'List of PAO/APAOs', titleHi: 'पीएओ/एपीएओ की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-PAO-APAOs' },
        { id: 'treasuries-code', title: 'List of Treasuries / Sub Treasuries with Code', titleHi: 'कोड सहित कोषागारों की सूची', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/List-of-Treasuries' },
        { id: 'other-func', title: 'Other Accounting Functions', titleHi: 'अन्य लेखा कार्य', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Other-Accounting-Functions' }
      ]
    },
    documents: [
      { id: 'pao-1', title: 'Comprehensive Directory of PAOs and APAOs in Andhra Pradesh (2025-26)', titleHi: 'आंध्र प्रदेश में पीएओ और एपीएओ की विस्तृत निर्देशिका (2025-26)', year: '2025 - 26', fileSize: '1.45 MB', downloadUrl: '#' },
      { id: 'pao-2', title: 'Contact Information and Banking Codes of State PAO Units', titleHi: 'राज्य पीएओ इकाइयों की संपर्क जानकारी एवं बैंकिंग कोड', year: '2024 - 25', fileSize: '980 KB', downloadUrl: '#' }
    ]
  },

  'State-Accounts/Annual-Accounts/Finance-Accounts': {
    slug: 'State-Accounts/Annual-Accounts/Finance-Accounts',
    title: 'Finance Accounts',
    titleHi: 'वित्त लेखे',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Annual Accounts', labelHi: 'वार्षिक लेखे', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
      { label: 'Finance Accounts', labelHi: 'वित्त लेखे' }
    ],
    sidebar: {
      heading: 'Annual Accounts',
      headingHi: 'वार्षिक लेखे',
      items: [
        { id: 'at-glance', title: 'Account at Glance', titleHi: 'एक नजर में खाते', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
        { id: 'approp', title: 'Appropriation Accounts', titleHi: 'विनियोग लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Appropriation-Accounts' },
        { id: 'finance', title: 'Finance Accounts', titleHi: 'वित्त लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Finance-Accounts' }
      ]
    },
    content: {
      introParagraphs: [
        'The Finance Accounts of the Government of Andhra Pradesh present the accounts of receipts and disbursements of the Government for the financial year together with financial statements on debt position and other liabilities.'
      ]
    }
  },

  'State-Accounts/Annual-Accounts/Appropriation-Accounts': {
    slug: 'State-Accounts/Annual-Accounts/Appropriation-Accounts',
    title: 'Appropriation Accounts',
    titleHi: 'विनियोग लेखे',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Annual Accounts', labelHi: 'वार्षिक लेखे', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
      { label: 'Appropriation Accounts', labelHi: 'विनियोग लेखा' }
    ],
    sidebar: {
      heading: 'Annual Accounts',
      headingHi: 'वार्षिक लेखे',
      items: [
        { id: 'at-glance', title: 'Account at Glance', titleHi: 'एक नजर में खाते', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
        { id: 'approp', title: 'Appropriation Accounts', titleHi: 'विनियोग लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Appropriation-Accounts' },
        { id: 'finance', title: 'Finance Accounts', titleHi: 'वित्त लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Finance-Accounts' }
      ]
    },
    documents: [
      {
        id: 'aa-2024',
        title: 'Appropriation Accounts (2024 - 25)',
        titleHi: 'विनियोग लेखे (2024 - 25)',
        date: '2024 - 25',
        year: '2024 - 25',
        fileSize: '6.27 MB',
        downloadUrl: '/uploads/state_accounts_report/account-report-Appropriation-Accounts-2024-25-069aadb2aa51e12-42366863.pdf'
      },
      {
        id: 'aa-2023',
        title: 'Appropriation accounts (2023 - 24)',
        titleHi: 'विनियोग लेखे (2023 - 24)',
        date: '2023 - 24',
        year: '2023 - 24',
        fileSize: '10.75 MB',
        downloadUrl: '/uploads/state_accounts_report/account-report-Appropriation-accounts-2023-24-06734a2d242ea69-40544853.pdf'
      },
      {
        id: 'aa-2022',
        title: 'Appropriation Accounts (2022 - 23)',
        titleHi: 'विनियोग लेखे (2022 - 23)',
        date: '2022 - 23',
        year: '2022 - 23',
        fileSize: '4.90 MB',
        downloadUrl: '/uploads/state_accounts_report/account-report-Appropriation-Accounts-2022-23-065c4cd689fba81-67734359.pdf'
      },
      {
        id: 'aa-2021',
        title: 'Appropriation Accounts 2021 - 22',
        titleHi: 'विनियोग लेखे 2021 - 22',
        date: '2021 - 22',
        year: '2021 - 22',
        fileSize: '4.31 MB',
        downloadUrl: '/uploads/state_accounts_report/account-report-Appropriation-Accounts-2021-22-0641db220000320-07132641.pdf'
      }
    ]
  },

  'State-Accounts/Annual-Accounts/Account-at-Glance': {
    slug: 'State-Accounts/Annual-Accounts/Account-at-Glance',
    title: 'Accounts at a Glance',
    titleHi: 'एक नजर में खाते',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Annual Accounts', labelHi: 'वार्षिक लेखे', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
      { label: 'Accounts at a Glance', labelHi: 'एक नजर में खाते' }
    ],
    sidebar: {
      heading: 'Annual Accounts',
      headingHi: 'वार्षिक लेखे',
      items: [
        { id: 'at-glance', title: 'Account at Glance', titleHi: 'एक नजर में खाते', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Account-at-Glance' },
        { id: 'approp', title: 'Appropriation Accounts', titleHi: 'विनियोग लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Appropriation-Accounts' },
        { id: 'finance', title: 'Finance Accounts', titleHi: 'वित्त लेखा', href: '/states/andhra-pradesh/State-Accounts/Annual-Accounts/Finance-Accounts' }
      ]
    },
    documents: [
      {
        id: 'aag-2024',
        title: 'Accounts at a Glance (2024 - 25)',
        titleHi: 'एक नजर में खाते (2024 - 25)',
        date: '2024 - 25',
        fileSize: '5.97 MB',
        downloadUrl: '/uploads/account_report/account-report-Accounts-at-a-Glance-2024-25-069aadac6722241-00178073.pdf'
      },
      {
        id: 'aag-2023',
        title: 'Accounts at Glance (2023 - 24)',
        titleHi: 'एक नजर में खाते (2023 - 24)',
        date: '2023 - 24',
        fileSize: '1.33 MB',
        downloadUrl: '/uploads/account_report/account-report-Accounts-at-a-Glance-2023-24-06734a23ba49e57-35271158.pdf'
      },
      {
        id: 'aag-2022',
        title: 'Accounts at a Glance (2022 - 23)',
        titleHi: 'एक नजर में खाते (2022 - 23)',
        date: '2022 - 23',
        fileSize: '4.99 MB',
        downloadUrl: '/uploads/account_report/account-report-Accounts-at-a-Glance-2022-23-065c4cd2642de21-31271010.pdf'
      },
      {
        id: 'aag-2021',
        title: 'Accounts at a Glance 2021-22',
        titleHi: 'एक नजर में खाते 2021-22',
        date: '2021 - 22',
        fileSize: '4.86 MB',
        downloadUrl: '/uploads/account_report/account-report-Accounts-at-a-Glance-2021-22-0641db818374782-15688967.pdf'
      }
    ]
  },

  'State-Accounts/Other-Reports/DC-bills-awaited': {
    slug: 'State-Accounts/Other-Reports/DC-bills-awaited',
    title: 'DC bills awaited & Cleared and Suspense Added/Cleared',
    titleHi: 'डीसी बिल प्रतीक्षित एवं समाशोधित और उचंत जोड़े गए/समाशोधित',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Other Reports', labelHi: 'अन्य रिपोर्ट', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/DC-bills-awaited' },
      { label: 'DC bills awaited & Cleared and Suspense Added/Cleared', labelHi: 'डीसी बिल प्रतीक्षित एवं समाशोधित' }
    ],
    sidebar: {
      heading: 'Other Reports',
      headingHi: 'अन्य रिपोर्ट',
      items: [
        { id: 'brochure', title: 'Brochure on Accounting', titleHi: 'लेखांकन पर विवरणिका', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Brochure-on-Accounting' },
        { id: 'civil-dep', title: 'Accounts Kept in 8443-Civil Deposits', titleHi: '8443-सिविल जमा में रखे गए खाते', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/8443-Civil-Deposits' },
        { id: 'not-rec', title: 'Accounts not received', titleHi: 'प्राप्त नहीं हुए खाते', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Accounts-not-received' },
        { id: 'rec-late', title: 'Accounts received late', titleHi: 'विलंब से प्राप्त खाते', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Accounts-received-late' },
        { id: 'pl-not-closed', title: 'List of PL accounts not closed by DDO', titleHi: 'डीडीओ द्वारा बंद न किए गए पीएल खातों की सूची', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/PL-accounts-not-closed' },
        { id: 'dc-bills', title: 'DC bills awaited & Cleared and Suspense Added/Cleared', titleHi: 'डीसी बिल प्रतीक्षित एवं समाशोधित', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/DC-bills-awaited' },
        { id: 'try-insp-rep', title: 'Outstanding Treasury Inspection report', titleHi: 'बकाया कोषागार निरीक्षण रिपोर्ट', href: '/states/andhra-pradesh/State-Accounts/Other-Reports/Outstanding-Treasury-Inspection-report' }
      ]
    },
    documents: [
      {
        id: 'dc-2026-03',
        title: 'Outstanding AC-DC Bills (Treasuries) to the end of March 2026 - status as on 30.06.2026',
        titleHi: 'मार्च 2026 के अंत तक बकाया एसी-डीसी बिल (कोषागार) - स्थिति 30.06.2026',
        year: '2025 - 26',
        date: '2025 - 26',
        fileSize: '0.31 MB',
        downloadUrl: '/uploads/ae_state_accounts/Outstanding-AC-DC-Bills-Treasuries-to-the-end-of-March-2026-status-as-on-30-06-2026-06a4debbf66d308-13210640.pdf'
      },
      {
        id: 'dc-2025-12',
        title: 'Outstanding AC-DC Bills (Treasuries) to the end of Dec 2025 - status as on 31.03.2026',
        titleHi: 'दिसंबर 2025 के अंत तक बकाया एसी-डीसी बिल (कोषागार) - स्थिति 31.03.2026',
        year: '2025 - 26',
        date: '2025 - 26',
        fileSize: '0.23 MB',
        downloadUrl: '/uploads/ae_state_accounts/Outstanding-AC-DC-Bills-Treasuries-to-the-end-of-December-2025-status-as-on-31-03-2026-069d7955009eb23-07965013.pdf'
      },
      {
        id: 'dc-2025-09',
        title: 'Outstanding AC-DC Bills (Treasuries) to the end of September 2025 - status as on 31.12.2025',
        titleHi: 'सितंबर 2025 के अंत तक बकाया एसी-डीसी बिल (कोषागार) - स्थिति 31.12.2025',
        year: '2025 - 26',
        date: '2025 - 26',
        fileSize: '0.31 MB',
        downloadUrl: '/uploads/ae_state_accounts/Outstanding-AC-DC-Bills-Treasuries-to-the-end-of-September-2025-status-as-on-31-12-2025-0695cb15acc43b8-41191627.pdf'
      },
      {
        id: 'dc-2025-06',
        title: 'Outstanding AC-DC Bills (Treasuries) to the end of June 2025 - on 30.09.2025',
        titleHi: 'जून 2025 के अंत तक बकाया एसी-डीसी बिल (कोषागार) - 30.09.2025 को',
        year: '2025 - 26',
        date: '2025 - 26',
        fileSize: '0.31 MB',
        downloadUrl: '/uploads/ae_state_accounts/Outstanding-AC-DC-Bills-Treasuries-to-the-end-of-June-2025-on-30-09-2025-068f096b4104345-88606551.pdf'
      },
      {
        id: 'dc-2025-03-tr',
        title: 'Outstanding AC-DC Bills (Treasuries) to the end of March 2025 - status as on 30.06.2025',
        titleHi: 'मार्च 2025 के अंत तक बकाया एसी-डीसी बिल (कोषागार) - स्थिति 30.06.2025',
        year: '2025 - 26',
        date: '2025 - 26',
        fileSize: '0.32 MB',
        downloadUrl: '/uploads/ae_state_accounts/Outstanding-AC-DC-Bills-Treasuries-to-the-end-of-March-2025-status-as-on-30-06-2025-068f09146591311-61787436.pdf'
      }
    ]
  },

  'State-Accounts/Loan-Account': {
    slug: 'State-Accounts/Loan-Account',
    title: 'Loan Account - Introduction',
    titleHi: 'ऋण खाता - परिचय',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: 'Introduction', labelHi: 'परिचय' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      contentHtml: `<ul class="bulletText">
\t<li>Loans to Institutions</li>
\t<li>Loans to Government Servants i.e. Housing Building Advance All India Services & Other Officers, Motor Car Advance Ministers, MLA’s, MLC’s & Govt. servants, Motor Cycle Advance & Personal Computer Advance Ministers, MLA’s, MLC’s & Govt. servants.</li>
</ul>`,
      introParagraphs: [
        'Loans to Institutions and Loans to Government Servants including House Building Advance (HBA), Motor Car Advance, Motor Cycle Advance, and Personal Computer Advance.'
      ]
    }
  },

  'State-Accounts/Loan-Account/Guidelines': {
    slug: 'State-Accounts/Loan-Account/Guidelines',
    title: 'Loan Guidelines',
    titleHi: 'ऋण दिशा-निर्देश',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: 'Guidelines', labelHi: 'दिशा-निर्देश' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      contentHtml: '<p>As per the Rules for GRANT OF LOANS by Finance Department of Govt.of Andhra Pradesh.</p>',
      introParagraphs: [
        'As per the Rules for GRANT OF LOANS by Finance Department of Govt. of Andhra Pradesh.'
      ]
    }
  },

  'State-Accounts/Loan-Account/Problems': {
    slug: 'State-Accounts/Loan-Account/Problems',
    title: 'Loan Problems',
    titleHi: 'ऋण समस्याएं',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: 'Problems', labelHi: 'समस्याएं' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      contentHtml: `<ol>
\t<li>Misclassification of Loan Recoveries by DDO’s & DTO’s.</li>
\t<li>Non – confirmation of communication of outstanding balances by individuals as well as DDO’s.</li>
\t<li>Excess /Short recovery of interest by the DDO’s.</li>
\t<li>Poor watching of mortgage of property, insurance & delayed recovery of loan (beyond Moratorium) Which attracts penal interest.</li>
\t<li>The terms and conditions of Institution Loans like Period of loan, moratorium period if any, number of installments and amount of each installment, date of commencement of repayment, rate of interest/penal interest , utilization certificate/Non-drawal certificate & advance stamp certificate and special conditions if any.</li>
\t<li>Confirmation of balances of institution loans.</li>
</ol>`,
      introParagraphs: [
        'Common issues identified in the maintenance, recovery, and reconciliation of loan accounts.'
      ]
    }
  },

  'State-Accounts/Loan-Account/Procedure': {
    slug: 'State-Accounts/Loan-Account/Procedure',
    title: 'Loan Procedure',
    titleHi: 'ऋण प्रक्रिया',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: 'Procedure', labelHi: 'प्रक्रिया' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      contentHtml: `<p>After implementation of CFMS package, the payment vouchers are downloaded and checked through the LOP. Subsequently, after downloading the sanction order (through notes and documents) of each voucher, the same is captured in the VLC Loans package and generating the index number, after which the payment voucher is posted with the INDX No. of the person concerned. Subsequently the recoveries also captured to the same number. . &nbsp;The Fulfillment of Formalities of the loan should be furnished Under the Seal and Signature of the Loan Sanctioning Authority to this office. &nbsp;At the end of the financial year Communication of Outstanding Balances will be hosted in DTA website. &nbsp; After the completion of principal amount the DDO should recover the interest and intimate the same to this office as the interest account of the individual loan accounts are not maintained in this office. &nbsp; &nbsp;On receipt of proposal from the DDO by certifying the recovery of Interest in full, Clearance Certificate will be issued by this Office. After downloading the sanction (Payments of Institutional Loans) the same is captured in the VLC Loans package and a Subsidiary Loan Recovery (SLR) number is generated.</p>`,
      introParagraphs: [
        'Standard operating procedure for capture, indexing, recovery monitoring, and clearance certificate issuance for loan accounts under CFMS and VLC.'
      ]
    }
  },

  'State-Accounts/Loan-Account/Dos-and-Donts': {
    slug: 'State-Accounts/Loan-Account/Dos-and-Donts',
    title: "Loan Account - Do's & Don'ts",
    titleHi: 'ऋण खाता - क्या करें और क्या न करें',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: "Do's & Don'ts", labelHi: 'क्या करें और क्या न करें' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      contentHtml: `<h3>DO’s</h3>
<ul class="bulletText">
\t<li>The treasury office should thoroughly check the classification before passing the concerned bills.</li>
\t<li>The DDO should clearly mention category of the loan and loanee employee ID on the bill.</li>
\t<li>The individuals should send the confirmation of outstanding balances.</li>
\t<li>Reconciliation of individual loans by DDO’s and institutional loans by CCO should be done periodically and a certificate to that effect is to be furnished to this office.</li>
\t<li>The sanctioning authority should send the certificate of fulfillment of formalities to this office at the time of releasing the second installment of HBA. For all other loans along with the First recovery.</li>
\t<li>The DDO should furnish the Loan recovery particulars along with service Major Head / Voucher No./Challan No. etc. after completion of the recovery.</li>
</ul>
<h3>DON’ts</h3>
<ul class="bulletText">
\t<li>The proposals for Clearance Certificate should not be delayed beyond the retirement date.</li>
\t<li>The sanctioning authority should not wait till the completion of the loan for which formalities not completed. The entire amount should be recovered in lump sum in such cases.</li>
\t<li>Don’t book misclassification items.</li>
\t<li>Don’t delay the recovery beyond the moratorium period.</li>
</ul>`,
      introParagraphs: [
        'Essential instructions and precautions for Treasuries, DDOs, sanctioning authorities, and loanees.'
      ]
    }
  },

  'State-Accounts/Loan-Account/Grievance': {
    slug: 'State-Accounts/Loan-Account/Grievance',
    title: 'Loan Grievance',
    titleHi: 'ऋण शिकायत निवारण',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: 'Grievance', labelHi: 'शिकायत' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      contentHtml: `<ul class="bulletText">
\t<li>Wanting schedules/vouchers from Treasuries and PAO’s.</li>
\t<li>DDO’s/DTO’s were not responding immediately to the correspondence sent by this office.</li>
\t<li>Reconciliation certificates and acceptance of balances not furnished by Loanee / DDO/CCO’s.</li>
\t<li>Furnishing irrelevant details of the missing credits which are not helpful for clearance of UC.</li>
</ul>`,
      introParagraphs: [
        'Points of attention and grievance redressal matters regarding loan schedules, missing vouchers, and clearance delays.'
      ]
    }
  },

  'State-Accounts/Loan-Account/FAQ': {
    slug: 'State-Accounts/Loan-Account/FAQ',
    title: 'Loan Account - FAQ',
    titleHi: 'ऋण खाता - अक्सर पूछे जाने वाले प्रश्न',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'State Accounts', labelHi: 'राज्य के खाते', href: '/states/andhra-pradesh/State-Accounts/Accounting-System/Structure-of-Accounts' },
      { label: 'Loan Account', labelHi: 'ऋण खाता', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
      { label: 'FAQ', labelHi: 'अक्सर पूछे जाने वाले प्रश्न' }
    ],
    sidebar: {
      heading: 'Loan Account',
      headingHi: 'ऋण खाता',
      items: [
        { id: 'intro', title: 'Introduction', titleHi: 'परिचय', href: '/states/andhra-pradesh/State-Accounts/Loan-Account' },
        { id: 'guidelines', title: 'Guidelines', titleHi: 'दिशा-निर्देश', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Guidelines' },
        { id: 'problems', title: 'Problems', titleHi: 'समस्याएं', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Problems' },
        { id: 'procedure', title: 'Procedure', titleHi: 'प्रक्रिया', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Procedure' },
        { id: 'dos-donts', title: "Do's & Dont's", titleHi: 'क्या करें और क्या न करें', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Dos-and-Donts' },
        { id: 'grievance', title: 'Grievance', titleHi: 'शिकायत', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/Grievance' },
        { id: 'faq', title: 'FAQ', titleHi: 'अक्सर पूछे जाने वाले प्रश्न', href: '/states/andhra-pradesh/State-Accounts/Loan-Account/FAQ' }
      ]
    },
    content: {
      introParagraphs: [
        'Find answers to frequently asked questions regarding Loan accounts, interest calculations, clearance certificates, and missing credits under the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  // =========================================================================
  // 4. GPF & PENSION
  // =========================================================================
  'GPF/About-GPF': {
    slug: 'GPF/About-GPF',
    title: 'General Provident Fund (GPF)',
    titleHi: 'सामान्य भविष्य निधि (जीपीएफ)',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'GPF', labelHi: 'जीपीएफ', href: '/states/andhra-pradesh/GPF/About-GPF' },
      { label: 'About GPF', labelHi: 'जीपीएफ के बारे में' }
    ],
    sidebar: {
      heading: 'GPF Information',
      headingHi: 'जीपीएफ जानकारी',
      items: [
        { id: 'about-gpf', title: 'About GPF', titleHi: 'जीपीएफ के बारे में', href: '/states/andhra-pradesh/GPF/About-GPF' },
        { id: 'eligibility', title: 'Eligibility to join the fund', titleHi: 'निधि में शामिल होने की पात्रता', href: '/states/andhra-pradesh/GPF/Eligibility-to-join-the-fund' },
        { id: 'subscription', title: 'GPF Subscription', titleHi: 'जीपीएफ अंशदान', href: '/states/andhra-pradesh/GPF/GPF-Subscription' },
        { id: 'advances', title: 'Advances & Withdrawals', titleHi: 'अग्रिम एवं निकासी', href: '/states/andhra-pradesh/GPF/Advances' },
        { id: 'forms', title: 'Downloads - GPF Forms', titleHi: 'डाउनलोड - जीपीएफ फॉर्म', href: '/states/andhra-pradesh/GPF/Downloads-GPF-Forms' }
      ]
    },
    content: {
      introParagraphs: [
        'The Principal Accountant General (A&E) maintains individual GPF accounts for nearly 2.29 lakh employees of the Andhra Pradesh State Government under the GPF (AP) Rules, 1935 and AIS (PF) Rules, 1955.',
        'The Provident Fund group is responsible for posting monthly subscriptions, computing annual compound interest, processing temporary advances, and settling final closure claims upon retirement.'
      ],
      accentHighlight: 'Ensuring transparent, interest-credited, and timely retirement savings administration.',
      bodyParagraphs: [
        'Subscribers can download annual account slips, verify balance accumulations, and log grievance complaints online through our integrated subscriber web portal.'
      ]
    }
  },

  'GPF/Downloads-GPF-Forms': {
    slug: 'GPF/Downloads-GPF-Forms',
    title: 'Downloads - GPF Application Forms',
    titleHi: 'डाउनलोड - जीपीएफ आवेदन फॉर्म',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'GPF', labelHi: 'जीपीएफ', href: '/states/andhra-pradesh/GPF/About-GPF' },
      { label: 'Downloads - GPF Forms', labelHi: 'डाउनलोड फॉर्म' }
    ],
    sidebar: {
      heading: 'GPF Information',
      headingHi: 'जीपीएफ जानकारी',
      items: [
        { id: 'about-gpf', title: 'About GPF', titleHi: 'जीपीएफ के बारे में', href: '/states/andhra-pradesh/GPF/About-GPF' },
        { id: 'eligibility', title: 'Eligibility to join the fund', titleHi: 'निधि में शामिल होने की पात्रता', href: '/states/andhra-pradesh/GPF/Eligibility-to-join-the-fund' },
        { id: 'subscription', title: 'GPF Subscription', titleHi: 'जीपीएफ अंशदान', href: '/states/andhra-pradesh/GPF/GPF-Subscription' },
        { id: 'advances', title: 'Advances & Withdrawals', titleHi: 'अग्रिम एवं निकासी', href: '/states/andhra-pradesh/GPF/Advances' },
        { id: 'forms', title: 'Downloads - GPF Forms', titleHi: 'डाउनलोड - जीपीएफ फॉर्म', href: '/states/andhra-pradesh/GPF/Downloads-GPF-Forms' }
      ]
    },
    documents: [
      { id: 'gpf-f1', title: 'Form 10A: Application for Final Withdrawal / Closure of GPF', titleHi: 'फॉर्म 10ए: जीपीएफ की अंतिम निकासी / समापन के लिए आवेदन', fileSize: '420 KB', downloadUrl: '#' },
      { id: 'gpf-f2', title: 'Form 10B: Application for Temporary Advance from GPF', titleHi: 'फॉर्म 10बी: जीपीएफ से अस्थायी अग्रिम के लिए आवेदन', fileSize: '380 KB', downloadUrl: '#' },
      { id: 'gpf-f3', title: 'GPF Nomination Form (First Schedule)', titleHi: 'जीपीएफ नामांकन फॉर्म', fileSize: '290 KB', downloadUrl: '#' },
      { id: 'gpf-f4', title: 'Missing Credit Adjustment Proforma', titleHi: 'लापता क्रेडिट समायोजन प्रोफार्मा', fileSize: '310 KB', downloadUrl: '#' }
    ]
  },

  'Pension/Pension-Information/About-Pension-Functions': {
    slug: 'Pension/Pension-Information/About-Pension-Functions',
    title: 'About Pension Functions',
    titleHi: 'पेंशन कार्यों के बारे में',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'About Pension Functions', labelHi: 'पेंशन कार्यों के बारे में' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'The Pension Group in the Office of the Principal Accountant General (A&E) authorizes pensionary benefits for State Government employees covered under the AP RPR Rules, 1980 and All India Service (AIS) officers borne on the Andhra Pradesh cadre.'
      ]
    }
  },

  'Pension/Pension-Information/Kinds-of-Pension': {
    slug: 'Pension/Pension-Information/Kinds-of-Pension',
    title: 'Kinds of Pension',
    titleHi: 'पेंशन के प्रकार',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Kinds of Pension', labelHi: 'पेंशन के प्रकार' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Statutory classes of pension admissible under the Andhra Pradesh Revised Pension Rules 1980.'
      ]
    }
  },

  'Pension/Pension-Information/Family-Pension': {
    slug: 'Pension/Pension-Information/Family-Pension',
    title: 'Family Pension',
    titleHi: 'पारिवारिक पेंशन',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Family Pension', labelHi: 'पारिवारिक पेंशन' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Provisions, categories, eligibility, and authorization guidelines for Family Pension under Rule 50 of the AP RPR Rules 1980.'
      ]
    }
  },

  'Pension/Pension-Information/Authority-Responsible': {
    slug: 'Pension/Pension-Information/Authority-Responsible',
    title: 'Authority Responsible',
    titleHi: 'जिम्मेदार प्राधिकारी',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Authority Responsible', labelHi: 'जिम्मेदार प्राधिकारी' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Pension Sanctioning Authorities (PSA) across departmental hierarchies and office levels.'
      ]
    }
  },

  'Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers': {
    slug: 'Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers',
    title: 'Model Guidelines for Processing Pension Papers',
    titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Model Guidelines for Processing Pension Papers', labelHi: 'मॉडल दिशानिर्देश' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Guidelines for Pension Sanctioning Authorities (PSA), serving employees, and retiring personnel.'
      ]
    }
  },

  'Pension/Pension-Information/Dos-Donts': {
    slug: 'Pension/Pension-Information/Dos-Donts',
    title: "Do's and Don'ts for Pension",
    titleHi: "पेंशन के लिए क्या करें और क्या न करें",
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: "Do's and Don'ts for Pension", labelHi: "क्या करें और क्या न करें" }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        "Important instructions, checks, and precautions for retiring employees and sanctioning authorities."
      ]
    }
  },

  'Pension/Pension-Information/Authorisation-of-Pension': {
    slug: 'Pension/Pension-Information/Authorisation-of-Pension',
    title: 'Authorisation of Pension',
    titleHi: 'पेंशन का प्राधिकरण',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Authorisation of Pension', labelHi: 'पेंशन का प्राधिकरण' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Workflow of pension case receipt, verification against Service Register, Accounts Officer approval, and PPO/GPO generation.'
      ]
    }
  },

  'Pension/Pension-Information/Pension-Check-List': {
    slug: 'Pension/Pension-Information/Pension-Check-List',
    title: 'Pension Check list',
    titleHi: 'पेंशन-जांच सूची',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Check list', labelHi: 'पेंशन-जांच सूची' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Document checklists for retiring government servants, families of deceased employees, and sanctioning authorities.'
      ]
    }
  },

  'Pension/Pension-Information/Pension-Brochure': {
    slug: 'Pension/Pension-Information/Pension-Brochure',
    title: 'Pension Brochure',
    titleHi: 'पेंशन विवरणिका',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Pension', labelHi: 'पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Information', labelHi: 'पेंशन जानकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
      { label: 'Pension Brochure', labelHi: 'पेंशन विवरणिका' }
    ],
    sidebar: {
      heading: 'Pension Information',
      headingHi: 'पेंशन जानकारी',
      items: [
        { id: 'p-func', title: 'About Pension Functions', titleHi: 'पेंशन कार्यों के बारे में', href: '/states/andhra-pradesh/Pension/Pension-Information/About-Pension-Functions' },
        { id: 'p-kinds', title: 'Kinds of Pension', titleHi: 'पेंशन के प्रकार', href: '/states/andhra-pradesh/Pension/Pension-Information/Kinds-of-Pension' },
        { id: 'p-family', title: 'Family Pension', titleHi: 'पारिवारिक पेंशन', href: '/states/andhra-pradesh/Pension/Pension-Information/Family-Pension' },
        { id: 'p-auth-resp', title: 'Authority Responsible', titleHi: 'जिम्मेदार प्राधिकारी', href: '/states/andhra-pradesh/Pension/Pension-Information/Authority-Responsible' },
        { id: 'p-guide', title: 'Model Guidelines for Processing Pension Papers', titleHi: 'पेंशन कागजात के प्रसंस्करण के लिए मॉडल दिशानिर्देश', href: '/states/andhra-pradesh/Pension/Pension-Information/Model-Guidelines-for-Processing-Pension-Papers' },
        { id: 'p-dos-donts', title: "Do's and Don'ts for Pension", titleHi: 'पेंशन के लिए क्या करें और क्या न करें', href: '/states/andhra-pradesh/Pension/Pension-Information/Dos-Donts' },
        { id: 'p-auth', title: 'Authorisation of Pension', titleHi: 'पेंशन का प्राधिकरण', href: '/states/andhra-pradesh/Pension/Pension-Information/Authorisation-of-Pension' },
        { id: 'p-check', title: 'Pension-check list', titleHi: 'पेंशन-जांच सूची', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Check-List' },
        { id: 'p-brochure', title: 'Pension Brochure', titleHi: 'पेंशन विवरणिका', href: '/states/andhra-pradesh/Pension/Pension-Information/Pension-Brochure' }
      ]
    },
    content: {
      introParagraphs: [
        'Official Pension Brochure booklet and sample pension proposal documentation issued by the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  // =========================================================================
  // 5. CONTACT US & GRIEVANCE
  // =========================================================================
  'Contact-Us/Contact-Us/Contact-details': {
    slug: 'Contact-Us/Contact-Us/Contact-details',
    title: 'Contact Details & Office Location',
    titleHi: 'संपर्क विवरण एवं कार्यालय स्थान',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Contact Details', labelHi: 'संपर्क विवरण' }
    ],
    sidebar: {
      heading: 'Contact Us',
      headingHi: 'संपर्क विवरण',
      items: [
        { id: 'details', title: 'Contact details', titleHi: 'संपर्क विवरण', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
        { id: 'holiday', title: 'Holiday List', titleHi: 'अवकाश सूची', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Holiday-List' },
        { id: 'tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'grievance', title: 'Feedback / Grievances', titleHi: 'प्रतिपुष्टि / शिकायत', href: '/states/andhra-pradesh/Contact-Us/Grievance' }
      ]
    },
    content: {
      introParagraphs: [
        'Office of the Principal Accountant General (A&E), Andhra Pradesh',
        'Address: Saushtava Bhavan, Old CGO Complex, MG Road, Vijayawada - 520002, Andhra Pradesh, India.'
      ],
      accentHighlight: 'Helpline Timings: 10:00 AM to 5:30 PM (Monday to Friday, excluding Gazetted Holidays).',
      bodyParagraphs: [
        '• General EPABX: +91-866-2421240 / 2421241',
        '• Pension Helpline Desk: +91-866-2421245 | Email: pensionhelpdesk-ap@cag.gov.in',
        '• GPF Helpline Desk: +91-866-2421248 | Email: gpfhelpdesk-ap@cag.gov.in',
        '• Official Email: agaepandhrapradesh@cag.gov.in'
      ]
    }
  },

  'Contact-Us/Grievance': {
    slug: 'Contact-Us/Grievance',
    title: 'Citizen Grievance & Feedback Portal',
    titleHi: 'नागरिक शिकायत एवं प्रतिपुष्टि पोर्टल',
    templateType: 'form',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Grievance', labelHi: 'शिकायत निवारण' }
    ],
    sidebar: {
      heading: 'Contact Us',
      headingHi: 'संपर्क विवरण',
      items: [
        { id: 'details', title: 'Contact details', titleHi: 'संपर्क विवरण', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
        { id: 'holiday', title: 'Holiday List', titleHi: 'अवकाश सूची', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Holiday-List' },
        { id: 'tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'grievance', title: 'Feedback / Grievances', titleHi: 'प्रतिपुष्टि / शिकायत', href: '/states/andhra-pradesh/Contact-Us/Grievance' }
      ]
    }
  },

  'Citizens-Charter': {
    slug: 'Citizens-Charter',
    title: 'Citizens Charter',
    titleHi: 'नागरिक चार्टर',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Citizens Charter', labelHi: 'नागरिक चार्टर' }
    ],
    sidebar: {
      heading: 'Citizens Charter',
      headingHi: 'नागरिक चार्टर',
      items: [
        { id: 'charter-main', title: 'Citizens Charter Document', titleHi: 'नागरिक चार्टर दस्तावेज़', href: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0643e81853c6471-79510511.pdf' },
        { id: 'grievance', title: 'Grievance Redressal', titleHi: 'शिकायत निवारण', href: '/states/andhra-pradesh/Contact-Us/Grievance' },
        { id: 'contact', title: 'Contact Details', titleHi: 'संपर्क विवरण', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' }
      ]
    },
    content: {
      introParagraphs: [
        'Recognizing the right of pensioners and government employees to receive prompt settlement of claims and transparent accounting services, the Citizens Charter sets out the standards of services provided by the Office of the Principal Accountant General (A&E), Andhra Pradesh.',
        'The charter commits to time-bound disposal of pension authorizations, GPF final payment settlements, annual statement dispatches, and public grievance resolution.'
      ],
      accentHighlight: 'Committed to supreme standards of public transparency, responsiveness, and prompt service delivery.'
    },
    documents: [
      {
        id: 'citizen-charter-doc',
        title: 'Citizens Charter - Office of the Principal Accountant General (A&E), Andhra Pradesh (Updated)',
        titleHi: 'नागरिक चार्टर - प्रधान महालेखाकार (लेखा एवं हकदारी), आंध्र प्रदेश (अद्यतन)',
        date: 'Updated 2026',
        year: '2026',
        fileSize: '3.45 MB',
        downloadUrl: 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Citizen-Charter-english-updated-0643e81853c6471-79510511.pdf'
      }
    ]
  },

  // =========================================================================
  // 6. EMPLOYEE CORNER
  // =========================================================================
  'Employee-Corner/Forms-for-IAAD-Staff': {
    slug: 'Employee-Corner/Forms-for-IAAD-Staff',
    title: 'Forms for IA&AD staff',
    titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Employee Corner', labelHi: 'कर्मचारी कोना', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
      { label: 'Forms for IA&AD staff', labelHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म' }
    ],
    sidebar: {
      heading: 'Employee Corner',
      headingHi: 'कर्मचारी सेवाएं',
      items: [
        { id: 'emp-forms', title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
        { id: 'emp-mail', title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
        { id: 'emp-kms', title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
        { id: 'emp-eoffice', title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
        { id: 'emp-pfms', title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
      ]
    },
    content: {
      contentHtml: `
        <ul>
          <li><a href="/uploads/media/Office-Order-26-IPR-0677247993b1781-28452081.pdf" target="_blank" rel="noopener noreferrer"><strong><span style="font-size:14px"><span style="font-family:Trebuchet MS,Helvetica,sans-serif">Submission of IPRs for the year 2024 as on 31st December 2024 - Reg</span></span></strong></a></li>
        </ul>
      `,
      introParagraphs: [
        'Important forms, office orders, and circulars for the officers and staff of Indian Audit & Accounts Department, Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    },
    documents: [
      {
        id: 'ipr-2024',
        title: 'Submission of IPRs for the year 2024 as on 31st December 2024 - Reg (Office Order 26)',
        titleHi: '31 दिसंबर 2024 तक वर्ष 2024 के लिए आईपीआर प्रस्तुत करना - कार्यालय आदेश 26',
        date: '31 Dec 2024',
        year: '2024',
        fileSize: '1.67 MB',
        downloadUrl: '/uploads/media/Office-Order-26-IPR-0677247993b1781-28452081.pdf'
      }
    ]
  },
  'Employee-Corner/Forms-for-IA&AD-staff': {
    slug: 'Employee-Corner/Forms-for-IA&AD-staff',
    title: 'Forms for IA&AD staff',
    titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Employee Corner', labelHi: 'कर्मचारी कोना', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
      { label: 'Forms for IA&AD staff', labelHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म' }
    ],
    sidebar: {
      heading: 'Employee Corner',
      headingHi: 'कर्मचारी सेवाएं',
      items: [
        { id: 'emp-forms', title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
        { id: 'emp-mail', title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
        { id: 'emp-kms', title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
        { id: 'emp-eoffice', title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
        { id: 'emp-pfms', title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
      ]
    },
    content: {
      contentHtml: `
        <ul>
          <li><a href="/uploads/media/Office-Order-26-IPR-0677247993b1781-28452081.pdf" target="_blank" rel="noopener noreferrer"><strong><span style="font-size:14px"><span style="font-family:Trebuchet MS,Helvetica,sans-serif">Submission of IPRs for the year 2024 as on 31st December 2024 - Reg</span></span></strong></a></li>
        </ul>
      `,
      introParagraphs: [
        'Important forms, office orders, and circulars for the officers and staff of Indian Audit & Accounts Department, Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    },
    documents: [
      {
        id: 'ipr-2024',
        title: 'Submission of IPRs for the year 2024 as on 31st December 2024 - Reg (Office Order 26)',
        titleHi: '31 दिसंबर 2024 तक वर्ष 2024 के लिए आईपीआर प्रस्तुत करना - कार्यालय आदेश 26',
        date: '31 Dec 2024',
        year: '2024',
        fileSize: '1.67 MB',
        downloadUrl: '/uploads/media/Office-Order-26-IPR-0677247993b1781-28452081.pdf'
      }
    ]
  },
  'Employee-Corner/IAAD-Mail': {
    slug: 'Employee-Corner/IAAD-Mail',
    title: 'IAAD Mail',
    titleHi: 'आईएएडी मेल',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Employee Corner', labelHi: 'कर्मचारी कोना', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
      { label: 'IAAD Mail', labelHi: 'आईएएडी मेल' }
    ],
    sidebar: {
      heading: 'Employee Corner',
      headingHi: 'कर्मचारी सेवाएं',
      items: [
        { id: 'emp-forms', title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
        { id: 'emp-mail', title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
        { id: 'emp-kms', title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
        { id: 'emp-eoffice', title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
        { id: 'emp-pfms', title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
      ]
    },
    content: {
      contentHtml: `
        <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
            You are accessing the official IA&AD Government Webmail portal (email.gov.in).
          </div>
          <p class="text-[15px] leading-[26px] text-[#374151]">
            Secure official webmail portal (email.gov.in) for officers and staff of Indian Audit & Accounts Department. Click the button below to proceed to the secure portal.
          </p>
          <div class="pt-2">
            <a
              href="https://email.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
            >
              <span>Proceed to IA&AD Official Webmail (email.gov.in)</span>
              <span class="text-[16px]">↗</span>
            </a>
          </div>
        </div>
      `,
      introParagraphs: [
        'Secure official webmail portal for officers and staff of Indian Audit & Accounts Department.'
      ]
    }
  },
  'Employee-Corner/IAAD-KMS': {
    slug: 'Employee-Corner/IAAD-KMS',
    title: 'IAAD KMS',
    titleHi: 'आईएएडी केएमएस',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Employee Corner', labelHi: 'कर्मचारी कोना', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
      { label: 'IAAD KMS', labelHi: 'आईएएडी केएमएस' }
    ],
    sidebar: {
      heading: 'Employee Corner',
      headingHi: 'कर्मचारी सेवाएं',
      items: [
        { id: 'emp-forms', title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
        { id: 'emp-mail', title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
        { id: 'emp-kms', title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
        { id: 'emp-eoffice', title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
        { id: 'emp-pfms', title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
      ]
    },
    content: {
      contentHtml: `
        <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
            You are accessing the CAG Knowledge Management System (KMS) Member Portal.
          </div>
          <p class="text-[15px] leading-[26px] text-[#374151]">
            Internal knowledge repository and learning resources portal for IA&AD personnel. Click the button below to access the KMS Member login.
          </p>
          <div class="pt-2">
            <a
              href="https://cag.gov.in/member"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
            >
              <span>Proceed to Knowledge Management System (KMS)</span>
              <span class="text-[16px]">↗</span>
            </a>
          </div>
        </div>
      `,
      introParagraphs: [
        'Knowledge Management System (KMS) - internal knowledge repository and learning resources portal for IA&AD personnel.'
      ]
    }
  },
  'Employee-Corner/E-Office': {
    slug: 'Employee-Corner/E-Office',
    title: 'E-Office',
    titleHi: 'ई-ऑफिस',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Employee Corner', labelHi: 'कर्मचारी कोना', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
      { label: 'E-Office', labelHi: 'ई-ऑफिस' }
    ],
    sidebar: {
      heading: 'Employee Corner',
      headingHi: 'कर्मचारी सेवाएं',
      items: [
        { id: 'emp-forms', title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
        { id: 'emp-mail', title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
        { id: 'emp-kms', title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
        { id: 'emp-eoffice', title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
        { id: 'emp-pfms', title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
      ]
    },
    content: {
      contentHtml: `
        <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
            You are accessing the CAG e-Office Electronic File Portal.
          </div>
          <p class="text-[15px] leading-[26px] text-[#374151]">
            Centralized paperless file management and digital governance system for the Comptroller and Auditor General of India. Click the button below to proceed to the e-Office login.
          </p>
          <div class="pt-2">
            <a
              href="https://cag.eoffice.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
            >
              <span>Proceed to CAG e-Office Portal (cag.eoffice.gov.in)</span>
              <span class="text-[16px]">↗</span>
            </a>
          </div>
        </div>
      `,
      introParagraphs: [
        'Centralized paperless file management and digital governance system for the Comptroller and Auditor General of India.'
      ]
    }
  },
  'Employee-Corner/PFMS': {
    slug: 'Employee-Corner/PFMS',
    title: 'PFMS',
    titleHi: 'पीएफएमएस',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Employee Corner', labelHi: 'कर्मचारी कोना', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
      { label: 'PFMS', labelHi: 'पीएफएमएस' }
    ],
    sidebar: {
      heading: 'Employee Corner',
      headingHi: 'कर्मचारी सेवाएं',
      items: [
        { id: 'emp-forms', title: 'Forms for IA&AD Staff', titleHi: 'आईएएंडएडी कर्मचारियों के लिए फॉर्म', href: '/states/andhra-pradesh/Employee-Corner/Forms-for-IAAD-Staff' },
        { id: 'emp-mail', title: 'IAAD Mail', titleHi: 'आईएएडी मेल', href: '/states/andhra-pradesh/Employee-Corner/IAAD-Mail' },
        { id: 'emp-kms', title: 'IAAD KMS', titleHi: 'आईएएडी केएमएस', href: '/states/andhra-pradesh/Employee-Corner/IAAD-KMS' },
        { id: 'emp-eoffice', title: 'E-Office', titleHi: 'ई-ऑफिस', href: '/states/andhra-pradesh/Employee-Corner/E-Office' },
        { id: 'emp-pfms', title: 'PFMS', titleHi: 'पीएफएमएस', href: '/states/andhra-pradesh/Employee-Corner/PFMS' }
      ]
    },
    content: {
      contentHtml: `
        <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
            You are accessing the Public Financial Management System (PFMS) Portal.
          </div>
          <p class="text-[15px] leading-[26px] text-[#374151]">
            Central portal for payment processing, direct benefit transfers, and financial tracking administered by the Controller General of Accounts (CGA). Click the button below to proceed to PFMS.
          </p>
          <div class="pt-2">
            <a
              href="https://pfms.nic.in/NewDefaultHome.aspx"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
            >
              <span>Proceed to PFMS Portal (pfms.nic.in)</span>
              <span class="text-[16px]">↗</span>
            </a>
          </div>
        </div>
      `,
      introParagraphs: [
        'Central portal for payment processing, direct benefit transfers, and financial tracking.'
      ]
    }
  },

  // =========================================================================
  // 7. WORKING WITH US
  // =========================================================================
  'Contact-Us/Working-With-US/Tender-Notices': {
    slug: 'Contact-Us/Working-With-US/Tender-Notices',
    title: 'Tenders And Contracts',
    titleHi: 'निविदाएं एवं अनुबंध',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'Tender Notices', labelHi: 'निविदा सूचनाएं' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      introParagraphs: [
        'Official procurement notices, GeM bids, expressions of interest, and tender documents issued by the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    },
    documents: [
      {
        id: 'tender-1',
        title: 'Notice for extension of Outsourced canteen services bid submission time',
        titleHi: 'आउटसोर्स कैंटीन सेवाओं की बोली जमा करने के समय के विस्तार की सूचना',
        date: '17 Aug 2026',
        year: '2026',
        fileSize: '0.22 MB',
        downloadUrl: '/uploads/tenders/tenders-Canteen-tender-extension-06a82f45f254a86-49612320.pdf'
      },
      {
        id: 'tender-2',
        title: 'Notice inviting tenders for OUTSOURCED CANTEEN SERVICES',
        titleHi: 'आउटसोर्स कैंटीन सेवाओं के लिए निविदा आमंत्रण सूचना',
        date: '06 Aug 2026',
        year: '2026',
        fileSize: '0.19 MB',
        downloadUrl: '/uploads/tenders/tenders-Re-tender-notice-latest-06a747a2ed30867-03917780.pdf'
      },
      {
        id: 'tender-3',
        title: 'Publication of Bid for Procurement of 4 no. of AIO Desktops. -Reg.',
        titleHi: '4 संख्या में एआईओ डेस्कटॉप की खरीद के लिए बोली का प्रकाशन',
        date: '03 Dec 2025',
        year: '2025',
        fileSize: '0.13 MB',
        downloadUrl: '/uploads/tenders/tenders-GeM-Bidding-8658081-5-0692fcc96eb3751-22509783.pdf'
      },
      {
        id: 'tender-4',
        title: 'Notice inviting bids for the Supply of Printed Envelopes. -Reg.',
        titleHi: 'मुद्रित लिफाफों की आपूर्ति के लिए बोली आमंत्रण सूचना',
        date: '19 Nov 2025',
        year: '2025',
        fileSize: '0.16 MB',
        downloadUrl: '/uploads/tenders/tenders-Tender-Supply-of-Printed-Envelopes-0691da0e6ea1104-31305108.pdf'
      },
      {
        id: 'tender-5',
        title: 'Notice Inviting Tender for “Digitization of Old Records and Provide Document Management System (Open-Source Software) integrating with PEN-MAN & DMS for Accessing Digitized Records',
        titleHi: 'पुराने अभिलेखों के डिजिटलीकरण और दस्तावेज़ प्रबंधन प्रणाली प्रदान करने के लिए निविदा सूचना',
        date: '30 Sep 2025',
        year: '2025',
        fileSize: '1.37 MB',
        downloadUrl: '/uploads/tenders/tenders-Digitization-of-Old-records-of-GPF-and-Pension-068dbac982fd356-18710175.pdf'
      },
      {
        id: 'tender-6',
        title: 'TENDER NOTICE FOR OUTSOURCED CANTEEN SERVICES - Reg.',
        titleHi: 'आउटसोर्स कैंटीन सेवाओं के लिए निविदा सूचना',
        date: '30 Sep 2025',
        year: '2025',
        fileSize: '0.54 MB',
        downloadUrl: '/uploads/tenders/tenders-Tender-Notice-latest-068dcf7440521c1-76226984.pdf'
      }
    ]
  },
  'Contact-Us/Working-With-Us/Tender-Notices': {
    slug: 'Contact-Us/Working-With-Us/Tender-Notices',
    title: 'Tenders And Contracts',
    titleHi: 'निविदाएं एवं अनुबंध',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'Tender Notices', labelHi: 'निविदा सूचनाएं' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      introParagraphs: [
        'Official procurement notices, GeM bids, expressions of interest, and tender documents issued by the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    },
    documents: [
      {
        id: 'tender-1',
        title: 'Notice for extension of Outsourced canteen services bid submission time',
        titleHi: 'आउटसोर्स कैंटीन सेवाओं की बोली जमा करने के समय के विस्तार की सूचना',
        date: '17 Aug 2026',
        year: '2026',
        fileSize: '0.22 MB',
        downloadUrl: '/uploads/tenders/tenders-Canteen-tender-extension-06a82f45f254a86-49612320.pdf'
      },
      {
        id: 'tender-2',
        title: 'Notice inviting tenders for OUTSOURCED CANTEEN SERVICES',
        titleHi: 'आउटसोर्स कैंटीन सेवाओं के लिए निविदा आमंत्रण सूचना',
        date: '06 Aug 2026',
        year: '2026',
        fileSize: '0.19 MB',
        downloadUrl: '/uploads/tenders/tenders-Re-tender-notice-latest-06a747a2ed30867-03917780.pdf'
      },
      {
        id: 'tender-3',
        title: 'Publication of Bid for Procurement of 4 no. of AIO Desktops. -Reg.',
        titleHi: '4 संख्या में एआईओ डेस्कटॉप की खरीद के लिए बोली का प्रकाशन',
        date: '03 Dec 2025',
        year: '2025',
        fileSize: '0.13 MB',
        downloadUrl: '/uploads/tenders/tenders-GeM-Bidding-8658081-5-0692fcc96eb3751-22509783.pdf'
      },
      {
        id: 'tender-4',
        title: 'Notice inviting bids for the Supply of Printed Envelopes. -Reg.',
        titleHi: 'मुद्रित लिफाफों की आपूर्ति के लिए बोली आमंत्रण सूचना',
        date: '19 Nov 2025',
        year: '2025',
        fileSize: '0.16 MB',
        downloadUrl: '/uploads/tenders/tenders-Tender-Supply-of-Printed-Envelopes-0691da0e6ea1104-31305108.pdf'
      },
      {
        id: 'tender-5',
        title: 'Notice Inviting Tender for “Digitization of Old Records and Provide Document Management System (Open-Source Software) integrating with PEN-MAN & DMS for Accessing Digitized Records',
        titleHi: 'पुराने अभिलेखों के डिजिटलीकरण और दस्तावेज़ प्रबंधन प्रणाली प्रदान करने के लिए निविदा सूचना',
        date: '30 Sep 2025',
        year: '2025',
        fileSize: '1.37 MB',
        downloadUrl: '/uploads/tenders/tenders-Digitization-of-Old-records-of-GPF-and-Pension-068dbac982fd356-18710175.pdf'
      },
      {
        id: 'tender-6',
        title: 'TENDER NOTICE FOR OUTSOURCED CANTEEN SERVICES - Reg.',
        titleHi: 'आउटसोर्स कैंटीन सेवाओं के लिए निविदा सूचना',
        date: '30 Sep 2025',
        year: '2025',
        fileSize: '0.54 MB',
        downloadUrl: '/uploads/tenders/tenders-Tender-Notice-latest-068dcf7440521c1-76226984.pdf'
      }
    ]
  },

  'Contact-Us/Working-With-US/Recruitment-Notice': {
    slug: 'Contact-Us/Working-With-US/Recruitment-Notice',
    title: 'Recruitment Notices',
    titleHi: 'भर्ती सूचनाएं',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'Recruitment Notice', labelHi: 'भर्ती सूचना' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">ℹ</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Record Found</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no active recruitment notices for the Office of the Principal Accountant General (A&E), Andhra Pradesh.</p>
        </div>
      `,
      introParagraphs: [
        'Official recruitment notices, advertisements, and selection results for the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },
  'Contact-Us/Working-With-Us/Recruitment-Notice': {
    slug: 'Contact-Us/Working-With-Us/Recruitment-Notice',
    title: 'Recruitment Notices',
    titleHi: 'भर्ती सूचनाएं',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'Recruitment Notice', labelHi: 'भर्ती सूचना' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">ℹ</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Record Found</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no active recruitment notices for the Office of the Principal Accountant General (A&E), Andhra Pradesh.</p>
        </div>
      `,
      introParagraphs: [
        'Official recruitment notices, advertisements, and selection results for the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  'Contact-Us/Working-With-US/DDO-Login': {
    slug: 'Contact-Us/Working-With-US/DDO-Login',
    title: 'DDO Login',
    titleHi: 'डीडीओ लॉगिन',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'DDO Login', labelHi: 'डीडीओ लॉगिन' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      contentHtml: `
        <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
            You are accessing the Drawing & Disbursing Officer (DDO) and Treasury Officer Portal.
          </div>
          <p class="text-[15px] leading-[26px] text-[#374151]">
            Authorized departmental DDOs and Treasury Officers can access reconciliation statements, schedule submissions, and account status reports through the central CAG / A&E authentication system.
          </p>
          <div class="pt-2">
            <a
              href="https://cag.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
            >
              <span>Proceed to DDO Login Portal</span>
              <span class="text-[16px]">↗</span>
            </a>
          </div>
        </div>
      `,
      introParagraphs: [
        'Online portal for Drawing & Disbursing Officers (DDOs) for monthly account reconciliation, e-voucher submission, and loanee statements.'
      ]
    }
  },
  'Contact-Us/Working-With-Us/DDO-Login': {
    slug: 'Contact-Us/Working-With-Us/DDO-Login',
    title: 'DDO Login',
    titleHi: 'डीडीओ लॉगिन',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'DDO Login', labelHi: 'डीडीओ लॉगिन' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      contentHtml: `
        <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
            You are accessing the Drawing & Disbursing Officer (DDO) and Treasury Officer Portal.
          </div>
          <p class="text-[15px] leading-[26px] text-[#374151]">
            Authorized departmental DDOs and Treasury Officers can access reconciliation statements, schedule submissions, and account status reports through the central CAG / A&E authentication system.
          </p>
          <div class="pt-2">
            <a
              href="https://cag.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
            >
              <span>Proceed to DDO Login Portal</span>
              <span class="text-[16px]">↗</span>
            </a>
          </div>
        </div>
      `,
      introParagraphs: [
        'Online portal for Drawing & Disbursing Officers (DDOs) for monthly account reconciliation, e-voucher submission, and loanee statements.'
      ]
    }
  },

  'Contact-Us/Working-With-US/Notification': {
    slug: 'Contact-Us/Working-With-US/Notification',
    title: 'Notifications',
    titleHi: 'अधिसूचनाएं',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'Notification', labelHi: 'अधिसूचना' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      introParagraphs: [
        'Official deputation notifications, empanelment notices, and statutory circulars issued by the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    },
    documents: [
      {
        id: 'notif-1',
        title: 'Deputation Notification for filling up of various Posts in Regional Capacity Building and Knowledge Institute (RCB and KI) ,Nagpur- Reg.',
        titleHi: 'क्षेत्रीय क्षमता निर्माण और ज्ञान संस्थान (आरसीबी और केआई), नागपुर में विभिन्न पदों को भरने के लिए प्रतिनियुक्ति अधिसूचना',
        date: '2026',
        year: '2026',
        fileSize: '2.46 MB',
        downloadUrl: '/uploads/notification/Deputation-Circular-RCBKI-Nagpur-069005b1154a9e2-09056541.pdf'
      },
      {
        id: 'notif-2',
        title: 'Filling up the post of Welfare Assistant on deputation basis in the O/o PAG (A&E), Andhra Pradesh, Vijayawada-reg.',
        titleHi: 'प्रधान महालेखाकार कार्यालय (लेखा एवं हकदारी), आंध्र प्रदेश में प्रतिनियुक्ति आधार पर कल्याण सहायक के पद को भरना',
        date: '2025',
        year: '2025',
        fileSize: '0.36 MB',
        downloadUrl: '/uploads/notification/Welfare-Assistant-068dcbeb4d54767-20493623.pdf'
      },
      {
        id: 'notif-3',
        title: 'Filling up the post of Legal Assistant on deputation basis in the O/o PAG (A&E), Andhra Pradesh, Vijayawada-reg.',
        titleHi: 'प्रधान महालेखाकार कार्यालय (लेखा एवं हकदारी), आंध्र प्रदेश में प्रतिनियुक्ति आधार पर विधि सहायक के पद को भरना',
        date: '2025',
        year: '2025',
        fileSize: '0.37 MB',
        downloadUrl: '/uploads/notification/Notification-Legal-Assistant-PAG-AE-AP-068491c2b036bf9-72611093.pdf'
      },
      {
        id: 'notif-4',
        title: 'Deputation Notification for Filling Vacant Posts in the Office of the Principal Accountant General (A&E), Andhra Pradesh, Vijayawada - Reg.',
        titleHi: 'प्रधान महालेखाकार कार्यालय (लेखा एवं हकदारी), आंध्र प्रदेश में रिक्त पदों को भरने के लिए प्रतिनियुक्ति अधिसूचना',
        date: '2025',
        year: '2025',
        fileSize: '0.56 MB',
        downloadUrl: '/uploads/notification/Deputation-notification-2025-06847db7cad7cc3-41962901.pdf'
      },
      {
        id: 'notif-5',
        title: 'Filling up the Ex-Cadre Posts of Senior Accounts Officer (Legal), Asst. Accounts Officer (Legal)-reg.',
        titleHi: 'वरिष्ठ लेखा अधिकारी (विधि) एवं सहायक लेखा अधिकारी (विधि) के भूतपूर्व कैडर पदों को भरना',
        date: '2025',
        year: '2025',
        fileSize: '0.12 MB',
        downloadUrl: '/uploads/notification/Notification-Legal-Officer-1614-0680779bd40ac71-32653942.pdf'
      },
      {
        id: 'notif-6',
        title: 'Hiring of Consultant for taking up the work of finalizing the pension and GPF cases in Entitlement Group of Office of the Principal Accountant General (A&E), Andhra Pradesh, Vijayawada.',
        titleHi: 'हकदारी समूह में पेंशन और जीपीएफ मामलों को अंतिम रूप देने के कार्य के लिए सलाहकार की नियुक्ति',
        date: '2024',
        year: '2024',
        fileSize: '0.13 MB',
        downloadUrl: '/uploads/notification/Hiring-of-Consultant-064a25c852596f3-34517909.pdf'
      },
      {
        id: 'notif-7',
        title: "Applications are invited for empanelment as Standing Counsels for defending cases of IA&AD office in Hon'ble High Court situated at Amaravathi and Central Administration Tribunal at Hyderabad.",
        titleHi: 'अमरावती स्थित माननीय उच्च न्यायालय और हैदराबाद में केंद्रीय प्रशासनिक न्यायाधिकरण में मामलों के बचाव के लिए स्टैंडिंग काउंसल के रूप में पैनल में शामिल करने के लिए आवेदन',
        date: '2020',
        year: '2020',
        fileSize: '0.94 MB',
        downloadUrl: '/uploads/notification/Notification-Legal-Cell-New-0600aa540df74f6-61903559.pdf'
      }
    ]
  },
  'Contact-Us/Working-With-Us/Notification': {
    slug: 'Contact-Us/Working-With-Us/Notification',
    title: 'Notifications',
    titleHi: 'अधिसूचनाएं',
    templateType: 'document-list',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Working With US', labelHi: 'हमारे साथ कार्य करें', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
      { label: 'Notification', labelHi: 'अधिसूचना' }
    ],
    sidebar: {
      heading: 'Working With US',
      headingHi: 'हमारे साथ कार्य करें',
      items: [
        { id: 'wwu-tenders', title: 'Tender Notices', titleHi: 'निविदा सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Tender-Notices' },
        { id: 'wwu-recruitment', title: 'Recruitment Notice', titleHi: 'भर्ती सूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Recruitment-Notice' },
        { id: 'wwu-ddo', title: 'DDO Login', titleHi: 'डीडीओ लॉगिन', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/DDO-Login' },
        { id: 'wwu-notification', title: 'Notification', titleHi: 'अधिसूचना', href: '/states/andhra-pradesh/Contact-Us/Working-With-US/Notification' }
      ]
    },
    content: {
      introParagraphs: [
        'Official deputation notifications, empanelment notices, and statutory circulars issued by the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    },
    documents: [
      {
        id: 'notif-1',
        title: 'Deputation Notification for filling up of various Posts in Regional Capacity Building and Knowledge Institute (RCB and KI) ,Nagpur- Reg.',
        titleHi: 'क्षेत्रीय क्षमता निर्माण और ज्ञान संस्थान (आरसीबी और केआई), नागपुर में विभिन्न पदों को भरने के लिए प्रतिनियुक्ति अधिसूचना',
        date: '2026',
        year: '2026',
        fileSize: '2.46 MB',
        downloadUrl: '/uploads/notification/Deputation-Circular-RCBKI-Nagpur-069005b1154a9e2-09056541.pdf'
      },
      {
        id: 'notif-2',
        title: 'Filling up the post of Welfare Assistant on deputation basis in the O/o PAG (A&E), Andhra Pradesh, Vijayawada-reg.',
        titleHi: 'प्रधान महालेखाकार कार्यालय (लेखा एवं हकदारी), आंध्र प्रदेश में प्रतिनियुक्ति आधार पर कल्याण सहायक के पद को भरना',
        date: '2025',
        year: '2025',
        fileSize: '0.36 MB',
        downloadUrl: '/uploads/notification/Welfare-Assistant-068dcbeb4d54767-20493623.pdf'
      },
      {
        id: 'notif-3',
        title: 'Filling up the post of Legal Assistant on deputation basis in the O/o PAG (A&E), Andhra Pradesh, Vijayawada-reg.',
        titleHi: 'प्रधान महालेखाकार कार्यालय (लेखा एवं हकदारी), आंध्र प्रदेश में प्रतिनियुक्ति आधार पर विधि सहायक के पद को भरना',
        date: '2025',
        year: '2025',
        fileSize: '0.37 MB',
        downloadUrl: '/uploads/notification/Notification-Legal-Assistant-PAG-AE-AP-068491c2b036bf9-72611093.pdf'
      },
      {
        id: 'notif-4',
        title: 'Deputation Notification for Filling Vacant Posts in the Office of the Principal Accountant General (A&E), Andhra Pradesh, Vijayawada - Reg.',
        titleHi: 'प्रधान महालेखाकार कार्यालय (लेखा एवं हकदारी), आंध्र प्रदेश में रिक्त पदों को भरने के लिए प्रतिनियुक्ति अधिसूचना',
        date: '2025',
        year: '2025',
        fileSize: '0.56 MB',
        downloadUrl: '/uploads/notification/Deputation-notification-2025-06847db7cad7cc3-41962901.pdf'
      },
      {
        id: 'notif-5',
        title: 'Filling up the Ex-Cadre Posts of Senior Accounts Officer (Legal), Asst. Accounts Officer (Legal)-reg.',
        titleHi: 'वरिष्ठ लेखा अधिकारी (विधि) एवं सहायक लेखा अधिकारी (विधि) के भूतपूर्व कैडर पदों को भरना',
        date: '2025',
        year: '2025',
        fileSize: '0.12 MB',
        downloadUrl: '/uploads/notification/Notification-Legal-Officer-1614-0680779bd40ac71-32653942.pdf'
      },
      {
        id: 'notif-6',
        title: 'Hiring of Consultant for taking up the work of finalizing the pension and GPF cases in Entitlement Group of Office of the Principal Accountant General (A&E), Andhra Pradesh, Vijayawada.',
        titleHi: 'हकदारी समूह में पेंशन और जीपीएफ मामलों को अंतिम रूप देने के कार्य के लिए सलाहकार की नियुक्ति',
        date: '2024',
        year: '2024',
        fileSize: '0.13 MB',
        downloadUrl: '/uploads/notification/Hiring-of-Consultant-064a25c852596f3-34517909.pdf'
      },
      {
        id: 'notif-7',
        title: "Applications are invited for empanelment as Standing Counsels for defending cases of IA&AD office in Hon'ble High Court situated at Amaravathi and Central Administration Tribunal at Hyderabad.",
        titleHi: 'अमरावती स्थित माननीय उच्च न्यायालय और हैदराबाद में केंद्रीय प्रशासनिक न्यायाधिकरण में मामलों के बचाव के लिए स्टैंडिंग काउंसल के रूप में पैनल में शामिल करने के लिए आवेदन',
        date: '2020',
        year: '2020',
        fileSize: '0.94 MB',
        downloadUrl: '/uploads/notification/Notification-Legal-Cell-New-0600aa540df74f6-61903559.pdf'
      }
    ]
  },

  // =========================================================================
  // 6. MEDIA CENTRE
  // =========================================================================
  'Contact-Us/Media-Centre/Photo-Gallery': {
    slug: 'Contact-Us/Media-Centre/Photo-Gallery',
    title: 'Photo Gallery',
    titleHi: 'फोटो गैलरी',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Photo Gallery', labelHi: 'फोटो गैलरी' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">📷</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Records Exists!</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no active photo gallery albums for the Office of the Principal Accountant General (A&E), Andhra Pradesh.</p>
        </div>
      `,
      introParagraphs: [
        'Photographic archives, official ceremonies, commemorative events, and workshop galleries of the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  'Contact-Us/Media-Centre/Video-Gallery': {
    slug: 'Contact-Us/Media-Centre/Video-Gallery',
    title: 'Video Gallery',
    titleHi: 'वीडियो गैलरी',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Video Gallery', labelHi: 'वीडियो गैलरी' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">🎬</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Records Exists!</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no active video recordings for the Office of the Principal Accountant General (A&E), Andhra Pradesh.</p>
        </div>
      `,
      introParagraphs: [
        'Official video documentations, educational briefings, and institutional messages from the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  'Contact-Us/Media-Centre/Speeches': {
    slug: 'Contact-Us/Media-Centre/Speeches',
    title: 'Speeches',
    titleHi: 'भाषण',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Speeches', labelHi: 'भाषण' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">🎙</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Record Found</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no speeches published for this office.</p>
        </div>
      `,
      introParagraphs: [
        'Transcripts and records of addresses delivered by leadership and dignitaries at the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  'Contact-Us/Media-Centre/Press-Release': {
    slug: 'Contact-Us/Media-Centre/Press-Release',
    title: 'Press Releases',
    titleHi: 'प्रेस विज्ञप्ति',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Press Release', labelHi: 'प्रेस विज्ञप्ति' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">📰</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Record Found</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no press releases published for this office.</p>
        </div>
      `,
      introParagraphs: [
        'Official press releases and media statements issued by the Office of the Principal Accountant General (A&E), Andhra Pradesh.'
      ]
    }
  },

  'Contact-Us/Media-Centre/Press-Clipping': {
    slug: 'Contact-Us/Media-Centre/Press-Clipping',
    title: 'Press Clippings',
    titleHi: 'प्रेस कतरनें',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Press Clipping', labelHi: 'प्रेस कतरनें' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    content: {
      contentHtml: `
        <div class="py-12 text-center text-[#6B7280]">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF5ED] text-[#751639] mb-3 text-xl font-bold">✂</div>
          <p class="text-[17px] font-semibold text-[#374151]">No Record Found</p>
          <p class="text-[14px] text-[#6B7280] mt-1">There are currently no press clippings available.</p>
        </div>
      `,
      introParagraphs: [
        'Curated newspaper coverage and media reportage on audits and accounts concerning the Government of Andhra Pradesh.'
      ]
    }
  },

  'Contact-Us/Media-Centre/Notices': {
    slug: 'Contact-Us/Media-Centre/Notices',
    title: 'Ae Notices',
    titleHi: 'ए एंड ई सूचनाएं',
    templateType: 'document-list',
    displayMode: 'table',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Notices', labelHi: 'सूचनाएं' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    documents: [
      {
        id: 'notice-55',
        title: 'TEST',
        titleHi: 'TEST',
        date: '08-09-2022',
        year: '2022',
        fileSize: '0.17 MB',
        downloadUrl: '/uploads/ae_notices/AeNotices-0631971b47077e5-04037560.pdf'
      },
      {
        id: 'notice-4',
        title: 'Tesing A&E Notices -AP',
        titleHi: 'Tesing A&E Notices -AP',
        date: '25-05-2020',
        year: '2020',
        fileSize: '0.16 MB',
        downloadUrl: '/uploads/ae_notices/AeNotices-05ecbb2951a85e4-30902675.pdf'
      },
      {
        id: 'notice-5',
        title: 'Tesing A&E Notices -Principal Accountant General (A&E), Andhra Pradesh, Amaravati',
        titleHi: 'Tesing A&E Notices -Principal Accountant General (A&E), Andhra Pradesh, Amaravati',
        date: '25-05-2020',
        year: '2020',
        fileSize: '0.16 MB',
        downloadUrl: '/uploads/ae_notices/AeNotices-05ecbb2b67f57e1-11913075.pdf'
      }
    ]
  },

  'Contact-Us/Media-Centre/Hindi-Magazine-Pratibha': {
    slug: 'Contact-Us/Media-Centre/Hindi-Magazine-Pratibha',
    title: 'Joint Hindi Magazine Pratibha',
    titleHi: 'संयुक्त हिंदी पत्रिका प्रतिभा',
    templateType: 'photo-content',
    breadcrumbs: [
      { label: 'Home', labelHi: 'होम', href: '/states/andhra-pradesh' },
      { label: 'Contact Us', labelHi: 'हमसे संपर्क करें', href: '/states/andhra-pradesh/Contact-Us/Contact-Us/Contact-details' },
      { label: 'Media Centre', labelHi: 'मीडिया केंद्र', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
      { label: 'Hindi Magazine Pratibha', labelHi: 'हिंदी पत्रिका प्रतिभा' }
    ],
    sidebar: {
      heading: 'Media Centre',
      headingHi: 'मीडिया केंद्र',
      items: [
        { id: 'mc-photo', title: 'Photo Gallery', titleHi: 'फोटो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Photo-Gallery' },
        { id: 'mc-video', title: 'Video Gallery', titleHi: 'वीडियो गैलरी', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Video-Gallery' },
        { id: 'mc-speeches', title: 'Speeches', titleHi: 'भाषण', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Speeches' },
        { id: 'mc-press-rel', title: 'Press Release', titleHi: 'प्रेस विज्ञप्ति', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Release' },
        { id: 'mc-press-clip', title: 'Press Clipping', titleHi: 'प्रेस कतरनें', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Press-Clipping' },
        { id: 'mc-notices', title: 'Notices', titleHi: 'सूचनाएं', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Notices' },
        { id: 'mc-pratibha', title: 'Hindi Magazine Pratibha', titleHi: 'हिंदी पत्रिका प्रतिभा', href: '/states/andhra-pradesh/Contact-Us/Media-Centre/Hindi-Magazine-Pratibha' }
      ]
    },
    content: {
      contentHtml: `
        <div class="overflow-x-auto my-6 border border-[#E5E7EB] rounded-[8px] shadow-sm bg-white">
          <table class="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr class="bg-[#FAF5ED] text-[#751639] border-b border-[#E5E7EB]">
                <th class="p-4 border-r border-[#E5E7EB] font-bold text-center w-1/3 text-[16px]">Magazine</th>
                <th class="p-4 border-r border-[#E5E7EB] font-bold text-center w-1/3 text-[16px]">Publication</th>
                <th class="p-4 font-bold text-center w-1/3 text-[16px]">FlipBook</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E5E7EB]">
              <tr>
                <td rowspan="5" class="p-6 border-r border-[#E5E7EB] font-bold text-center text-[#751639] text-[18px] bg-[#FAF5ED]/40 align-middle">
                  <div class="space-y-1">
                    <p class="text-[19px] font-bold text-[#751639]">Joint Hindi Magazine</p>
                    <p class="text-[17px] font-semibold text-[#5E112E]">"Pratibha" (प्रतिभा)</p>
                    <p class="text-[12px] text-[#6B7280] font-normal">Official Hindi In-house Journal</p>
                  </div>
                </td>
                <td class="p-4 border-r border-[#E5E7EB] text-center">
                  <a href="/uploads/media/Hindi-Patribha-2021-c-06a167b0437b2f2-23750241.pdf" target="_blank" rel="noopener noreferrer" class="text-[#0056B3] hover:underline font-semibold text-[15px] inline-flex items-center gap-1.5">
                    <span>Pratibha 1st Issue</span>
                    <span class="text-xs text-[#6B7280] font-normal">(8.06 MB)</span>
                  </a>
                </td>
                <td class="p-4 text-center">
                  <a href="/uploads/media/Hindi-Patribha-2021-c-06a167b0437b2f2-23750241.pdf" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center p-1.5 hover:opacity-80 transition-opacity" title="Open Magazine">
                    <img src="/uploads/FileManager/open_book_260489.png" alt="FlipBook" class="w-7 h-7 inline-block border border-[#CBD5E1] rounded p-0.5 shadow-sm" />
                  </a>
                </td>
              </tr>
              <tr>
                <td class="p-4 border-r border-[#E5E7EB] text-center">
                  <a href="/uploads/media/Pratibha-2nd-Issue-0632c4725b75bb0-17450362.pdf" target="_blank" rel="noopener noreferrer" class="text-[#0056B3] hover:underline font-semibold text-[15px] inline-flex items-center gap-1.5">
                    <span>Pratibha 2nd Issue</span>
                    <span class="text-xs text-[#6B7280] font-normal">(29.5 MB)</span>
                  </a>
                </td>
                <td class="p-4 text-center">
                  <a href="https://heyzine.com/flip-book/05c2f43600.html" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center p-1.5 hover:opacity-80 transition-opacity" title="Open Heyzine FlipBook">
                    <img src="/uploads/FileManager/open_book_260489.png" alt="FlipBook" class="w-7 h-7 inline-block border border-[#CBD5E1] rounded p-0.5 shadow-sm" />
                  </a>
                </td>
              </tr>
              <tr>
                <td class="p-4 border-r border-[#E5E7EB] text-center">
                  <a href="/uploads/media/hindi-patrika-pratibha-varsa-2023-0651eb07475fc28-53745421.pdf" target="_blank" rel="noopener noreferrer" class="text-[#0056B3] hover:underline font-semibold text-[15px] inline-flex items-center gap-1.5">
                    <span>Pratibha 3rd Issue</span>
                    <span class="text-xs text-[#6B7280] font-normal">(78.6 MB)</span>
                  </a>
                </td>
                <td class="p-4 text-center">
                  <a href="https://heyzine.com/flip-book/0ffe215682.html" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center p-1.5 hover:opacity-80 transition-opacity" title="Open Heyzine FlipBook">
                    <img src="/uploads/FileManager/open_book_260489.png" alt="FlipBook" class="w-7 h-7 inline-block border border-[#CBD5E1] rounded p-0.5 shadow-sm" />
                  </a>
                </td>
              </tr>
              <tr>
                <td class="p-4 border-r border-[#E5E7EB] text-center">
                  <a href="/uploads/media/hindi-patrika-pratibha-2024-0673dca59ebc250-47245716.pdf" target="_blank" rel="noopener noreferrer" class="text-[#0056B3] hover:underline font-semibold text-[15px] inline-flex items-center gap-1.5">
                    <span>Pratibha 4th Issue</span>
                    <span class="text-xs text-[#6B7280] font-normal">(90.9 MB)</span>
                  </a>
                </td>
                <td class="p-4 text-center">
                  <a href="https://heyzine.com/flip-book/a9cd9323f9.html" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center p-1.5 hover:opacity-80 transition-opacity" title="Open Heyzine FlipBook">
                    <img src="/uploads/FileManager/open_book_260489.png" alt="FlipBook" class="w-7 h-7 inline-block border border-[#CBD5E1] rounded p-0.5 shadow-sm" />
                  </a>
                </td>
              </tr>
              <tr>
                <td class="p-4 border-r border-[#E5E7EB] text-center">
                  <a href="/uploads/media/Pratibha-Hindi-E-magazine-2025-068dfab10f29fd9-78304449.pdf" target="_blank" rel="noopener noreferrer" class="text-[#0056B3] hover:underline font-semibold text-[15px] inline-flex items-center gap-1.5">
                    <span>Pratibha 5th Issue</span>
                    <span class="text-xs text-[#6B7280] font-normal">(112.6 MB)</span>
                  </a>
                </td>
                <td class="p-4 text-center">
                  <a href="https://heyzine.com/flip-book/24cf67d483.html" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center p-1.5 hover:opacity-80 transition-opacity" title="Open Heyzine FlipBook">
                    <img src="/uploads/FileManager/open_book_260489.png" alt="FlipBook" class="w-7 h-7 inline-block border border-[#CBD5E1] rounded p-0.5 shadow-sm" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      introParagraphs: [
        'Official Joint Hindi Magazine "Pratibha" published by the Office of the Principal Accountant General (A&E), Andhra Pradesh promoting official language implementation and creative literature.'
      ]
    }
  }
};
