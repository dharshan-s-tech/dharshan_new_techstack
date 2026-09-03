import { Report, Office, Officer, PageContent } from '@/types';
import { dataManager } from '@/lib/dataManager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getMockData(path: string): any {
  if (path.startsWith('/api/presence')) {
    return dataManager.getOffices();
  }
  if (path.startsWith('/api/home')) {
    return {
      hero_title: 'Comptroller and Auditor General of India',
      hero_subtitle: 'Supreme Audit Institution of India',
      stats: [
        { label: 'Years of Excellence', value: '150+' },
        { label: 'Reports Tabled Annually', value: '700+' }
      ],
      cag_message: {
        name: 'Shri K. Sanjay Murthy',
        title: 'Comptroller and Auditor General of India',
        message: 'Welcome to the official portal of the Comptroller and Auditor General of India...'
      }
    };
  }
  if (path.startsWith('/api/reports')) {
    return {
      items: [
        {
          id: 'rep-1',
          title: 'Audit Report on Health Services and Polio Vaccination Administrations in Rural Districts',
          sector: 'Social Welfare',
          admin_level: 'States',
          report_type: 'Performance',
          published_date: '2026-06-04',
          file_url: '#'
        },
        {
          id: 'rep-2',
          title: 'Defence Audit Report on Border Security Procurement and Modernization Schemes',
          sector: 'Finance',
          admin_level: 'Union',
          report_type: 'Compliance',
          published_date: '2026-07-15',
          file_url: '#'
        }
      ],
      total: 2
    };
  }
  if (path.startsWith('/api/officers')) {
    return {
      id: '1',
      name: 'Shri K. Sanjay Murthy',
      designation: 'Comptroller & Auditor General of India',
      email: 'cagindia@cag.gov.in',
      phone: '+91-11-23235790',
      tier: 1,
      children: [
        {
          id: '2',
          name: 'Shri Vishvanath Singh Jadon',
          designation: 'Secretary to CAG',
          email: 'sec-cag@cag.gov.in',
          phone: '+91-11-23239843',
          tier: 2,
          children: []
        }
      ]
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
  return null;
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
      console.error(`API Error: ${res.status} ${res.statusText} on ${path}`);
      return getMockData(path) as T;
    }
    return await res.json() as T;
  } catch (error) {
    console.error(`Fetch error on ${path}:`, error);
    return getMockData(path) as T;
  }
}

export const api = {
  getHomeData: async () => {
    return fetchJson<{
      hero_title: string;
      hero_subtitle: string;
      stats: { label: string; value: string }[];
      cag_message: { name: string; title: string; message: string };
    }>('/api/home');
  },

  getReports: async (params: {
    page: number;
    level: string;
    sector: string;
    type: string;
    query: string;
  }) => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      level: params.level,
      sector: params.sector,
      type: params.type,
      query: params.query,
    });
    return fetchJson<{ items: Report[]; total: number }>(`/api/reports?${queryParams.toString()}`);
  },

  getPresence: async () => {
    return fetchJson<Office[]>('/api/presence');
  },

  getPageContent: async (slug: string) => {
    return fetchJson<PageContent>(`/api/pages/${slug}`);
  },

  getOfficers: async () => {
    return fetchJson<Officer>('/api/officers');
  },
};
