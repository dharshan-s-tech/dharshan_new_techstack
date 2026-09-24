import { dataManager } from './dataManager';

/**
 * Browser must not call http://localhost when the page is opened via a public IP
 * (Private Network Access blocks that). Prefer an explicit env URL, otherwise:
 * - in the browser: same hostname on :8000 (or same-origin if unset and relative)
 * - on the server: loopback for Next → FastAPI
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    // Same-origin relative path, transparently proxied by Next.js rewrites to FastAPI backend
    return '';
  }

  return (
    process.env.API_INTERNAL_URL ||
    'http://127.0.0.1:8000'
  ).replace(/\/$/, '');
}

export function getMockData(path: string): any {
  if (path.startsWith('/api/reports')) {
    return {
      items: dataManager.getReports(),
      total: dataManager.getReports().length
    };
  }
  if (path.startsWith('/api/news')) {
    return dataManager.getNews();
  }
  if (path.startsWith('/api/banners')) {
    return dataManager.getBanners();
  }
  if (path.startsWith('/api/tenders')) {
    return dataManager.getTenders();
  }
  if (path.startsWith('/api/circulars')) {
    return dataManager.getCirculars();
  }
  if (path.startsWith('/api/presence')) {
    return {
      offices: dataManager.getOffices(),
      states: dataManager.getStateOffices()
    };
  }
  if (path.startsWith('/api/states')) {
    return dataManager.getStateOffices();
  }
  if (path.startsWith('/api/government-types')) {
    return [
      { id: 1, name_en: 'Union Government', name_hi: 'संघ सरकार' },
      { id: 2, name_en: 'State Government', name_hi: 'राज्य सरकार' },
      { id: 3, name_en: 'Union Territory', name_hi: 'केंद्र शासित प्रदेश' }
    ];
  }
  if (path.startsWith('/api/officers')) {
    return {
      id: '1',
      name: 'Shri K. Sanjay Murthy',
      designation: 'Comptroller & Auditor General of India',
      email: 'cagindia@cag.gov.in',
      phone: '+91-11-23235790',
      tier: 1,
      children: []
    };
  }
  if (path.startsWith('/api/pages/')) {
    const slug = path.split('/').pop() || '';
    return {
      id: 'page-' + slug,
      slug: slug,
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      content_html: `<p>Detailed content for ${slug} is rendered here dynamically.</p>`
    };
  }
  return [];
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      ...options,
    });
    if (res.ok) {
      return await res.json() as T;
    }
    console.warn(`[API Fallback] ${res.status} on ${path}, using fallback data.`);
  } catch (error) {
    console.warn(`[API Fallback] ${path} network error, using fallback data:`, error);
  }

  const mock = getMockData(path);
  if (mock !== null && mock !== undefined) {
    return mock as T;
  }
  return null;
}

export const api = {
  getHomeData: async () => {
    return fetchJson<{
      hero_title: string;
      hero_subtitle: string;
      stats: { label: string; value: string }[];
    }>('/api/home');
  },
  getReports: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ items: any[]; total: number; total_pages?: number; page?: number }>(`/api/reports${query ? `?${query}` : ''}`);
  },
  getReportById: async (id: string) => {
    return fetchJson<any>(`/api/reports/${id}`);
  },
  getReportFilters: async () => {
    return fetchJson<{ levels: string[]; sectors: string[]; report_types: string[]; years: string[]; states: any[] }>('/api/reports/filters');
  },
  getStateAccounts: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ items: any[]; total: number; total_pages?: number; page?: number }>(`/api/state-accounts${query ? `?${query}` : ''}`);
  },
  getCombinedAccounts: async (params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ items: any[]; total: number; total_pages?: number; page?: number }>(`/api/combined-accounts${query ? `?${query}` : ''}`);
  },
  getNews: async () => {
    return fetchJson<any[]>('/api/news');
  },
  getPresence: async () => {
    return fetchJson<{ offices: any[]; states: any[] }>('/api/presence');
  },
  getOfficers: async () => {
    return fetchJson<any>('/api/officers');
  },
  getPageContent: async (slug: string, culture = 'en') => {
    return fetchJson<{ id?: number; title: string; excerpt?: string; content_html: string; upload_file?: string; file_title?: string }>(`/api/pages/${slug}?culture=${culture}`);
  },
  getOrganisationChart: async (culture = 'en') => {
    return fetchJson<{ officers: any[]; levels?: any[]; charges?: any[] }>(`/api/organisation-chart?culture=${culture}`);
  },
  getFormerCags: async (culture = 'en') => {
    return fetchJson<any[]>(`/api/former-cag?culture=${culture}`);
  },
  getStateSubsite: async (slug: string) => {
    return fetchJson<any>(`/api/states/${slug}`);
  },
  getSubsites: async () => {
    return fetchJson<{ status: string; total: number; data: any[] }>('/api/subsites');
  },
  getSubsite: async (slug: string) => {
    return fetchJson<{ status: string; data: any }>(`/api/subsites/${slug}`);
  },
  getResources: async (slug: string, params?: Record<string, any>) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ items: any[]; total: number; page?: number; page_size?: number }>(
      `/api/resources/${slug}${query ? `?${query}` : ''}`
    );
  }
};

