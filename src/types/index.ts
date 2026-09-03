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
