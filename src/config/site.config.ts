import { MenuItem } from '@/types';

// Static image imports from Assets
import report1Pic from '@/app/Assets/Images/d14889fd29ae93bd23d9b51c4dad883e07f826bf.png';
import report2Pic from '@/app/Assets/Images/56272e2a85b8227dfa00af6d4065211e9ac5de8f.png';
import report3Pic from '@/app/Assets/Images/28f782be18b6cfdf23aa0c90ec681e3916b8d6c7.png';

export const siteConfig = {
  name: 'Comptroller and Auditor General of India',
  shortName: 'CAG of India',
  tagline: 'Supreme Audit Institution of India - Transparency, Integrity & Accountability',
  contact: {
    address: 'Pocket-9, Deen Dayal Upadhyaya Marg, New Delhi - 110124',
    email: 'cagoffice@cag.gov.in',
    phone: '+91-11-23235790',
  },
  externalLinks: [
    { name: 'National Portal of India', url: 'https://india.gov.in' },
    { name: 'INTOSAI', url: 'https://intosai.org' },
    { name: 'ASOSAI', url: 'https://asosai.org' },
  ],
};

export const mainNavigation: MenuItem[] = [
  {
    name: 'About Us',
    slug: 'about',
    subcategories: [
      { name: 'CAG of India Profile', slug: 'cag-profile' },
      { name: 'Vision, Mission & Values', slug: 'vision-mission' },
      { name: 'Organisation-Chart', slug: 'organisation-chart' },
      { name: 'History of IAAD', slug: 'history' },
      { name: 'Former CAGs Gallery', slug: 'former-cags' },
      { name: 'International Relations', slug: 'international-relations' },
      { name: 'Audit-Advisory-Board', slug: 'audit-advisory-board' },
      { name: 'Overview', slug: 'overview' },
      { name: 'Governance-&-Mandate', slug: 'governance-mandate' },
      { name: 'Leadership & Legacy', slug: 'leadership-legacy' },
      { name: 'Global Relations', slug: 'global-relations' },
    ],
  },
  {
    name: 'Our Presence',
    slug: 'our-presence',
    subcategories: [
      { name: 'State Offices Pin-Map', slug: '' },
      { name: 'Central-Audit-Offices', slug: 'central-audit-offices' },
      { name: 'State-Level-Offices', slug: 'state-level-offices' },
      { name: 'Training Institutes', slug: 'training-institutes' },
    ],
  },
  {
    name: 'Reports',
    slug: 'reports',
  },
  {
    name: 'Careers',
    slug: 'career-engagement',
  },
  {
    name: 'Resources',
    slug: 'resources',
  },
];

export interface ReportCardData {
  id: string;
  image: any;
  tag: string;
  label: string;
  date: string;
  title: string;
  desc: string;
}

export const homeReportCards: ReportCardData[] = [
  {
    id: 'home-rep-1',
    image: report1Pic,
    tag: 'Text',
    label: 'Civic',
    date: 'Jun 4, 2026',
    title: 'Audit Report on Infrastructure Development and Municipal Solid Waste Management',
    desc: 'Comprehensive review of urban infrastructure planning, fund utilization, and waste treatment plants across municipal corporations.'
  },
  {
    id: 'home-rep-2',
    image: report2Pic,
    tag: 'Text',
    label: 'Tamil Nadu',
    date: 'Jun 4, 2026',
    title: 'Thematic Audit on Environmental Management in Coastal Districts of Tamil Nadu',
    desc: 'Assessment of measures taken to prevent marine pollution, coastal erosion, and implementation of CRZ notifications.'
  },
  {
    id: 'home-rep-3',
    image: report3Pic,
    tag: 'Text',
    label: 'Andhra Pradesh',
    date: 'Jun 4, 2026',
    title: 'Performance Audit on Irrigation Schemes and Canal Networks in Andhra Pradesh',
    desc: 'Evaluation of major and medium irrigation projects, command area development, and drinking water supply provisions.'
  }
];
