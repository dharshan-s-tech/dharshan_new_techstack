export interface Report {
  id: string;
  title: string;
  sector: string;
  admin_level: string;
  report_type: string;
  published_date: string;
  file_url: string;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  published_date: string;
  image_url?: string;
  url?: string;
}

export interface MenuItem {
  name: string;
  slug: string;
  subcategories?: MenuItem[];
}

export interface Office {
  id: string;
  state: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  type: 'central' | 'state' | 'training';
}

export interface Officer {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  tier: number;
  children: Officer[];
}

export interface FormerCAG {
  id: string;
  name: string;
  tenure: string;
  description: string;
  image_url?: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content_html: string;
  meta_title?: string;
  meta_description?: string;
}

export interface AdvisoryBoardMember {
  id: string;
  name: string;
  designation: string;
  affiliation: string;
  role: 'internal' | 'external';
}

export interface SubsiteOrgStructItem {
  id: string;
  website_id: string; // e.g. 'overseas-london', 'overseas-washington', etc.
  officer_name: string;
  officer_name_hi?: string;
  designation: string;
  designation_hi?: string;
  email?: string;
  phone?: string;
  photo?: string;
  bio?: string;
  bio_hi?: string;
  display_order?: number;
  seniority_order?: number;
  status?: number;
}

export interface RecruitmentRuleItem {
  id: string;
  website_id: string;
  post_name: string;
  post_name_hi?: string;
  qualification: string;
  qualification_hi?: string;
  pdf_file: string;
  file_size?: string;
  status?: number;
}

export interface OverseasOfficeData {
  slug: string;
  theme: 'LDN' | 'KUL' | 'WDC' | 'ROM' | 'GVA' | 'ERSA' | 'GSSA';
  officeNameEn: string;
  officeNameHi: string;
  locationEn: string;
  locationHi: string;
  addressEn: string;
  addressHi: string;
  officeHoursEn: string;
  officeHoursHi: string;
  phone: string;
  email: string;
  obfuscatedEmail: string;
  gmapEmbedUrl: string;
  gmapQuery: string;
  externalOfficialUrl: string;
  themeColor: string;
  mandateEn: string;
  mandateHi: string;
  auditScopes: Array<{ titleEn: string; titleHi: string; descEn: string; descHi: string }>;
  faqs: Array<{ qEn: string; qHi: string; aEn: string; aHi: string }>;
  // PDA - WDC Overseas Specific Menu Fields
  historyEn?: string;
  historyHi?: string;
  directorsList?: Array<{ nameEn: string; nameHi: string; tenure: string; roleEn: string; roleHi: string }>;
  pdsList?: Array<{ nameEn: string; nameHi: string; tenure: string; roleEn: string; roleHi: string }>;
  orgStructureEn?: string;
  orgStructureHi?: string;
  staffDetailsPdfUrl?: string;
  administrativeFunctionEn?: string;
  administrativeFunctionHi?: string;
  auditJurisdictionEn?: string;
  auditJurisdictionHi?: string;
  auditProcessEn?: string;
  auditProcessHi?: string;
  photoGallery?: Array<{ id: string; titleEn: string; titleHi: string; imageUrl: string; date: string }>;
  holidaysList?: Array<{ date: string; dayEn: string; dayHi: string; nameEn: string; nameHi: string; type?: string }>;
  unitsList?: Array<{ nameEn: string; nameHi: string; category: string; city: string; country: string }>;
}

