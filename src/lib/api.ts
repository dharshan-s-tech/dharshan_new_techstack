import { dataManager } from './dataManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getApiBaseUrl(): string {
  return API_BASE_URL;
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
  const useMock = !process.env.NEXT_PUBLIC_API_URL;
  if (useMock) {
    const mock = getMockData(path);
    if (mock !== null) {
      return mock as T;
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
      ...options,
    });
    if (!res.ok) {
      console.warn(`[API Fallback] ${res.status} on ${path}, using mock data.`);
      return (getMockData(path) || {}) as T;
    }
    return await res.json() as T;
  } catch (error) {
    console.warn(`[API Fallback] ${path} unavailable, using mock data.`);
    return (getMockData(path) || {}) as T;
  }
}

export const api = {
  getHomeData: async () => {
    return fetchJson<{
      hero_title: string;
      hero_subtitle: string;
      stats: { label: string; value: string }[];
    }>('/api/home');
  },
  getReports: async (params?: { page?: number; page_size?: number; query?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ items: any[]; total: number }>(`/api/reports?${query}`);
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
  getPageContent: async (slug: string) => {
    return fetchJson<{ title: string; content_html: string }>(`/api/pages/${slug}`);
  },
  getStateSubsite: async (slug: string) => {
    return fetchJson<any>(`/api/states/${slug}`);
  }
};
