import { query } from '@/lib/db';
import { cdnUrl, cdn } from '@/lib/cdn';

export interface AeWebsiteInfo {
  website_id: number;
  website_title: string;
  website_title_hi?: string;
  website_url: string;
  theme: string;
  state_id: number;
  department_id: number;
  state_name: string;
  state_slug: string;
  state_image?: string;
  logo?: string;
  email?: string;
}

export interface AeHomepageData {
  state_slug: string;
  state_name: string;
  office_title: string;
  office_title_hi?: string;
  website_id: number;
  state_id: number;
  state_image_url: string;
  logo_url: string;
  email: string;
  // Sections from live DB
  banners: Array<{ id: number; title: string; image_url: string; link?: string }>;
  pension_info: { title: string; description: string; icon_url?: string } | null;
  gpf_info: { title: string; description: string; icon_url?: string } | null;
  account_title: string;
  account_desc: string;
  account_cards: Array<{ id: string; title: string; url: string }>;
  quick_links: Array<{ id: string; title: string; url?: string }>;
  whats_new: Array<{ id: string; date: string; title: string; url?: string }>;
  leadership: Array<{ id: number; name: string; designation: string; image_url: string }>;
  contact_details: Array<{ id: number; name: string; designation: string; phone?: string; email?: string }>;
}

export interface AeStateAccountReport {
  id: number;
  website_id: number;
  state_id: number;
  account_report_types_id: number;
  report_type_title?: string;
  title: string;
  year: string;
  month?: string;
  file_name: string;
  file_url: string;
  is_state_ut?: string;
  status: number;
  created_at?: string;
}

export interface AeCircularItem {
  id: number;
  title: string;
  language?: string;
  general_categories_id?: number;
  ae_date?: string;
  date_of_order?: string;
  body?: string;
  file_title?: string;
  upload_file?: string;
  file_url?: string;
  full_url?: string;
  status: number;
}

export interface AeGrievancePayload {
  website_id?: number;
  state_id?: number;
  full_name: string;
  mobile: string;
  email?: string;
  address?: string;
  employee_id?: string;
  department_name?: string;
  ddo_office_name?: string;
  treasury?: string;
  work_from_retired?: string;
  complaint_related_to?: string; // 'Pension' | 'GPF' | 'GE'
  gpf_ac_no?: string;
  pension_appln_ppo_no?: string;
  ge_register_ref_no?: string;
  subject: string;
  suggestion_complaint: string;
  uploads?: string;
}

/**
 * Helper to parse JSON menu_title field from the menus table.
 * DB stores: {"default":"About Us","en":""}
 */
function parseMenuTitle(raw: string | null): string {
  if (!raw) return '';
  try {
    const parsed = JSON.parse(raw);
    return parsed.default || parsed.en || '';
  } catch {
    // Not JSON — return as-is (sometimes plain text)
    return raw;
  }
}

export const STATE_USER_MAP: Record<string, number[]> = {
  'andhra-pradesh': [130, 246],
  'telangana': [81],
  'assam': [129, 206],
  'bihar': [128, 297],
  'chhattisgarh': [127, 5436],
  'chattisgarh': [127, 5436],
  'gujarat': [126],
  'haryana': [125, 2758],
  'himachal-pradesh': [124, 3753],
  'jammu-and-kashmir': [123, 5262],
  'jammu-kashmir': [123, 5262],
  'jharkhand': [122],
  'karnataka': [143, 8],
  'kerala': [121],
  'gwalior-i': [120],
  'gwalior-ii': [119],
  'madhya-pradesh': [120, 119],
  'mumbai': [118],
  'nagpur': [117],
  'maharashtra': [118, 117],
  'manipur': [116, 1367],
  'meghalaya': [115, 3859],
  'mizoram': [146, 1537],
  'nagaland': [114],
  'odisha': [144],
  'punjab': [113],
  'rajasthan': [84, 5518],
  'sikkim': [112, 2076],
  'tamil-nadu': [82],
  'tripura': [78, 1020],
  'allahabad': [74],
  'allahabad-ii': [75],
  'uttar-pradesh': [74, 75],
  'uttarakhand': [72, 303],
  'west-bengal': [71, 8845],
  'arunachal-pradesh': [145],
  'goa': [147],
};

export function getStateUserIds(stateSlug: string): number[] {
  const clean = (stateSlug || '').toLowerCase().trim();
  if (STATE_USER_MAP[clean]) return STATE_USER_MAP[clean];
  const alias = clean.replace(/-/g, '');
  for (const [key, val] of Object.entries(STATE_USER_MAP)) {
    if (key.replace(/-/g, '') === alias) return val;
  }
  return [];
}

export const aeService = {
  /**
   * 1. Get all A&E websites configured in cag_revamp.websites (theme = 'AE')
   */
  async getAllAeWebsites(): Promise<AeWebsiteInfo[]> {
    try {
      const sql = `
        SELECT 
          w.id AS website_id,
          w.title AS website_title,
          w.title_hi AS website_title_hi,
          w.url AS website_url,
          w.theme,
          w.state_id,
          w.department_id,
          w.state_image,
          w.logo,
          w.email,
          COALESCE(s.name, w.title) AS state_name,
          COALESCE(s.slug, REPLACE(LOWER(TRIM(LEADING '/ae/' FROM w.url)), '/', '-')) AS state_slug
        FROM websites w
        LEFT JOIN states s ON w.state_id = s.id
        WHERE w.theme = 'AE'
        ORDER BY s.name ASC;
      `;
      const res = await query<any>(sql);
      return res.rows.map((r: any) => ({
        ...r,
        state_image: r.state_image || null,
        logo: r.logo || null,
      }));
    } catch (err) {
      console.warn('[aeService.getAllAeWebsites] DB query failed:', err);
      return [];
    }
  },

  /**
   * 2. Resolve state context by state_slug (e.g. 'andhra-pradesh', 'telangana', 'bihar', etc.)
   */
  async getAeWebsiteBySlug(stateSlug: string): Promise<AeWebsiteInfo | null> {
    try {
      const cleanSlug = stateSlug.toLowerCase().trim();
      const sql = `
        SELECT 
          w.id AS website_id,
          w.title AS website_title,
          w.title_hi AS website_title_hi,
          w.url AS website_url,
          w.theme,
          w.state_id,
          w.department_id,
          w.state_image,
          w.logo,
          w.email,
          COALESCE(s.name, w.title) AS state_name,
          COALESCE(s.slug, $1) AS state_slug
        FROM websites w
        LEFT JOIN states s ON w.state_id = s.id
        WHERE w.theme = 'AE' AND (
          LOWER(s.slug) = $1 OR 
          LOWER(w.url) = '/ae/' || $1 OR
          LOWER(w.url) = $1 OR
          LOWER(w.url) LIKE '%/' || $1 OR
          LOWER(REPLACE(s.name, ' ', '-')) = $1 OR
          ( $1 = 'madhya-pradesh' AND w.url LIKE '%gwalior%' ) OR
          ( $1 = 'maharashtra' AND w.url LIKE '%mumbai%' ) OR
          ( $1 = 'uttar-pradesh' AND w.url LIKE '%allahabad%' ) OR
          ( $1 = 'chattisgarh' AND (w.url LIKE '%chhattisgarh%' OR LOWER(s.slug) = 'chhattisgarh') ) OR
          ( $1 = 'chhattisgarh' AND (w.url LIKE '%chhattisgarh%' OR LOWER(s.slug) = 'chattisgarh') ) OR
          ( $1 = 'jammu-kashmir' AND (w.url LIKE '%jammu%' OR LOWER(s.slug) LIKE '%jammu%') ) OR
          ( $1 = 'jammu-and-kashmir' AND (w.url LIKE '%jammu%' OR LOWER(s.slug) LIKE '%jammu%') )
        )
        ORDER BY w.id ASC
        LIMIT 1;
      `;
      const res = await query<any>(sql, [cleanSlug]);
      if (res.rows.length > 0) {
        return res.rows[0];
      }

      // Fallback: match by state slug in states table directly
      const stateSql = `
        SELECT 
          w.id AS website_id,
          COALESCE(w.title, 'Principal Accountant General (A&E), ' || s.name) AS website_title,
          w.title_hi AS website_title_hi,
          COALESCE(w.url, '/ae/' || s.slug) AS website_url,
          'AE' AS theme,
          s.id AS state_id,
          7 AS department_id,
          w.state_image,
          w.logo,
          w.email,
          s.name AS state_name,
          s.slug AS state_slug
        FROM states s
        LEFT JOIN websites w ON w.state_id = s.id AND w.theme = 'AE'
        WHERE LOWER(s.slug) = $1 OR LOWER(REPLACE(s.name, ' ', '-')) = $1
        LIMIT 1;
      `;
      const stateRes = await query<any>(stateSql, [cleanSlug]);
      return stateRes.rows[0] || null;
    } catch (err) {
      console.warn(`[aeService.getAeWebsiteBySlug] DB query error for ${stateSlug}:`, err);
      return null;
    }
  },

  /**
   * 3. Fetch hero banners for a website / state
   */
  async getAeBanners(websiteId: number, stateName: string = ''): Promise<Array<{ id: number; title: string; image_url: string; link?: string }>> {
    try {
      const cleanState = stateName.trim();
      let sql = `
        SELECT id, text, image, link
        FROM banners
        WHERE (text ILIKE $1 OR text ILIKE '%A&E%')
        AND image IS NOT NULL AND image != ''
        AND status = 1
        ORDER BY display_order ASC, id DESC
        LIMIT 5;
      `;
      let res = await query(sql, [`%${cleanState}%`]);
      if (res.rows.length === 0) {
        // Fallback to active banners with image
        const fallbackSql = `
          SELECT id, text, image, link
          FROM banners
          WHERE image IS NOT NULL AND image != ''
          ORDER BY id DESC
          LIMIT 5;
        `;
        res = await query(fallbackSql);
      }
      return res.rows.map((r: any) => {
        let bannerTitle = '';
        if (r.text) {
          try {
            const parsed = JSON.parse(r.text);
            bannerTitle = (parsed.default || parsed.en || '').replace(/<[^>]*>/g, '').trim();
          } catch {
            bannerTitle = r.text.replace(/<[^>]*>/g, '').trim();
          }
        }
        return {
          id: r.id,
          title: bannerTitle,
          image_url: cdn.banner(r.image),
          link: r.link || undefined,
        };
      });
    } catch (err) {
      console.warn('[aeService.getAeBanners] query failed:', err);
      return [];
    }
  },

  /**
   * 4. Fetch What's New items for a website
   */
  async getAeWhatsNew(websiteId: number): Promise<Array<{ id: string; date: string; title: string; url?: string }>> {
    try {
      // Check subsite_whats_new first
      const sql1 = `
        SELECT id, title, uploads, date, created
        FROM subsite_whats_new
        WHERE title IS NOT NULL AND title != ''
        ORDER BY COALESCE(date, created) DESC
        LIMIT 6;
      `;
      const res1 = await query(sql1);
      if (res1.rows.length > 0) {
        return res1.rows.map((r: any, idx: number) => {
          const d = r.date || r.created;
          let dateStr = '';
          if (d) {
            try {
              dateStr = new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            } catch { dateStr = ''; }
          }
          return {
            id: `wn-${r.id || idx + 1}`,
            date: dateStr,
            title: r.title || '',
            url: r.uploads ? cdn.media(r.uploads) : undefined,
          };
        });
      }

      // Fallback to circulars
      const circulars = await this.getAeCirculars(6);
      return circulars.map((c, idx) => {
        const d = c.ae_date || c.date_of_order;
        let dateStr = '';
        if (d) {
          try { dateStr = new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }); } catch {}
        }
        return {
          id: `wn-${c.id || idx + 1}`,
          date: dateStr,
          title: c.title,
          url: c.file_url || (c.upload_file ? cdn.circular(c.upload_file) : undefined),
        };
      });
    } catch (err) {
      console.warn('[aeService.getAeWhatsNew] query failed:', err);
      return [];
    }
  },

  /**
   * 5. Fetch Quick Links from quick_links table (with fallback to important_links)
   */
  async getAeQuickLinks(websiteId?: number): Promise<Array<{ id: string; title: string; url?: string }>> {
    try {
      const sql1 = `
        SELECT id, title, full_url
        FROM quick_links
        WHERE status = 1
        ORDER BY id ASC
        LIMIT 6;
      `;
      const res1 = await query(sql1);
      if (res1.rows.length > 0) {
        return res1.rows.map((r: any, idx: number) => ({
          id: `ql-${r.id || idx + 1}`,
          title: r.title || '',
          url: r.full_url || undefined,
        }));
      }

      const sql2 = `
        SELECT id, title, url
        FROM important_links
        WHERE status = 1
        ORDER BY display_order ASC, id ASC
        LIMIT 6;
      `;
      const res2 = await query(sql2);
      return res2.rows.map((r: any, idx: number) => ({
        id: `il-${r.id || idx + 1}`,
        title: r.title || '',
        url: r.url || undefined,
      }));
    } catch (err) {
      console.warn('[aeService.getAeQuickLinks] query failed:', err);
      return [];
    }
  },

  /**
   * 6. Fetch Pension info for a website
   */
  async getAePensionInfo(websiteId: number): Promise<{ title: string; description: string; icon_url?: string } | null> {
    try {
      const sql = `
        SELECT id, title, description, icon, upload_file
        FROM pension
        WHERE website_id = $1
        LIMIT 1;
      `;
      const res = await query(sql, [websiteId]);
      if (res.rows.length > 0) {
        const r = res.rows[0];
        return {
          title: r.title || 'About Pension',
          description: r.description || '',
          icon_url: r.icon ? cdn.media(r.icon) : undefined,
        };
      }
      return null;
    } catch (err) {
      console.warn('[aeService.getAePensionInfo] query failed:', err);
      return null;
    }
  },

  /**
   * 7. Fetch GPF info for a website
   */
  async getAeGpfInfo(websiteId: number): Promise<{ title: string; description: string; icon_url?: string } | null> {
    try {
      const sql = `
        SELECT id, title, description, icon, upload_file
        FROM gpf
        WHERE website_id = $1
        LIMIT 1;
      `;
      const res = await query(sql, [websiteId]);
      if (res.rows.length > 0) {
        const r = res.rows[0];
        return {
          title: r.title || 'About General Provident Fund',
          description: r.description || '',
          icon_url: r.icon ? cdn.media(r.icon) : undefined,
        };
      }
      return null;
    } catch (err) {
      console.warn('[aeService.getAeGpfInfo] query failed:', err);
      return null;
    }
  },

  /**
   * 8. Fetch Leadership profiles for a website
   */
  async getAeLeadership(websiteId: number): Promise<Array<{ id: number; name: string; designation: string; image_url: string }>> {
    try {
      const sql = `
        SELECT id, title AS name, designation, image
        FROM leadership_profiles
        WHERE website_id = $1 AND status = 1
        ORDER BY display_order ASC, id ASC
        LIMIT 10;
      `;
      const res = await query(sql, [websiteId]);
      return res.rows.map((r: any) => ({
        id: r.id,
        name: r.name || '',
        designation: r.designation || '',
        image_url: cdn.leadership(r.image),
      }));
    } catch (err) {
      console.warn('[aeService.getAeLeadership] query failed:', err);
      return [];
    }
  },

  /**
   * 9. Fetch Contact details for a website
   */
  async getAeContactDetails(websiteId: number): Promise<Array<{ id: number; name: string; designation: string; phone?: string; email?: string }>> {
    try {
      const sql = `
        SELECT id, name, designation, phone, email
        FROM contact_us_details
        WHERE website_id = $1
        ORDER BY display_order ASC, id ASC
        LIMIT 10;
      `;
      const res = await query(sql, [websiteId]);
      return res.rows.map((r: any) => ({
        id: r.id,
        name: r.name || '',
        designation: r.designation || '',
        phone: r.phone || undefined,
        email: r.email || undefined,
      }));
    } catch (err) {
      console.warn('[aeService.getAeContactDetails] query failed:', err);
      return [];
    }
  },

  /**
   * 10. Aggregated Homepage data for any A&E subsite — ALL from live DB
   */
  async getAeHomepageData(stateSlug: string): Promise<AeHomepageData> {
    const site = await this.getAeWebsiteBySlug(stateSlug);
    const stateName = site?.state_name || stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const officeTitle = site?.website_title || `Principal Accountant General (A&E), ${stateName}`;
    const officeTitleHi = site?.website_title_hi || undefined;
    const stateId = site?.state_id || 64;
    const websiteId = site?.website_id || 22;

    // Fetch all data in parallel from live DB
    const [banners, whatsNew, quickLinks, pensionInfo, gpfInfo, leadership, contactDetails, circulars] = await Promise.all([
      this.getAeBanners(websiteId, stateName),
      this.getAeWhatsNew(websiteId),
      this.getAeQuickLinks(websiteId),
      this.getAePensionInfo(websiteId),
      this.getAeGpfInfo(websiteId),
      this.getAeLeadership(websiteId),
      this.getAeContactDetails(websiteId),
      this.getAeCirculars(10),
    ]);

    // If no whats_new from dedicated tables, use circulars as fallback
    const finalWhatsNew = whatsNew.length > 0 ? whatsNew : circulars.slice(0, 4).map((c, idx) => {
      const d = c.ae_date || c.date_of_order;
      let dateStr = '';
      if (d) {
        try { dateStr = new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }); } catch {}
      }
      return {
        id: `wn-${c.id || idx + 1}`,
        date: dateStr,
        title: c.title,
        url: c.upload_file ? cdn.circular(c.upload_file) : undefined,
      };
    });

    return {
      state_slug: stateSlug,
      state_name: stateName,
      office_title: officeTitle,
      office_title_hi: officeTitleHi,
      website_id: websiteId,
      state_id: stateId,
      state_image_url: cdn.state(site?.state_image),
      logo_url: cdn.logo(site?.logo),
      email: site?.email || '',
      banners,
      pension_info: pensionInfo || {
        title: `About Pension - ${stateName}`,
        description: `The Principal Accountant General (A&E) authorises the pensionary benefits for State Government employees of ${stateName} covered under relevant RPR Rules, AIS officers borne on the state cadre, and constitutional authorities.`,
      },
      gpf_info: gpfInfo || {
        title: `About General Provident Fund - ${stateName}`,
        description: `The Principal Accountant General (A&E) maintains the individual GPF accounts of employees of the ${stateName} State Government as per the rules and procedures contained in the General Provident Fund Rules.`,
      },
      account_title: 'Account',
      account_desc: `The Accounts Group of this office compiles the accounts of the Government of ${stateName} based on the initial accounts rendered by District Treasuries and Public Works/Forest Divisions.`,
      account_cards: [
        { id: 'ac-1', title: 'Monthly Key Indicators', url: `/ae/${stateSlug}/State-Accounts/Monthly-Accounts/Monthly-Key-Indicator` },
        { id: 'ac-2', title: 'Appropriation Accounts', url: `/ae/${stateSlug}/State-Accounts/Annual-Accounts/Appropriation-Accounts` },
        { id: 'ac-3', title: 'Finance Account', url: `/ae/${stateSlug}/State-Accounts/Annual-Accounts/Finance-Accounts` },
        { id: 'ac-4', title: 'Accounts at a Glance', url: `/ae/${stateSlug}/State-Accounts/Annual-Accounts/Account-at-Glance` }
      ],
      quick_links: quickLinks,
      whats_new: finalWhatsNew,
      leadership,
      contact_details: contactDetails,
    };
  },

  /**
   * 11. Query CMS page content from cag_revamp.menus and cag_revamp.pages with universal multi-tier matching
   */
  async getAePageContent(slug: string, stateSlug: string = '', culture: string = 'en'): Promise<{
    id?: number;
    title: string;
    content_html: string;
    excerpt?: string;
    upload_file?: string;
    file_url?: string;
    is_pdf?: boolean;
  } | null> {
    try {
      const cleanSlug = slug.toLowerCase().trim();
      const segments = cleanSlug.split('/');
      const leaf = segments[segments.length - 1] || cleanSlug;
      const leafClean = leaf.replace(/[^a-z0-9]/g, '');
      const cleanState = (stateSlug || '').toLowerCase().trim();

      // Rewrite old webroot/uploads, CloudFront, and cag.gov.in paths to local /uploads/
      const toCdnUrl = (u: string) => {
        if (!u) return '';
        return u
          .replace(/^https?:\/\/d7i5wg8xwe4hf\.cloudfront\.net\/uploads\//i, '/uploads/')
          .replace(/^https?:\/\/cag\.gov\.in(?:\/+en)?(?:\/+webroot)?\/uploads\//i, '/uploads/')
          .replace(/^\/+webroot\/uploads\//i, '/uploads/')
          .replace(/^\/+uploads\//i, '/uploads/')
          .trim();
      };

      // Explicit slug & PDF mapping for Andhra Pradesh
      const AP_EXPLICIT_SLUGS: Record<string, { slug?: string; pdf?: string; is_pdf?: boolean }> = {
        'functions/administration/ss-&-pip': { slug: 'page-ae-andhra-pradesh-ag-ap-ss-pip' },
        'functions/administration/transfer-posting-guidelines': { slug: 'page-ae-andhra-pradesh-t-p-guidelines', pdf: 'O-O-3-Internal-Transfer-Policy-06874f649a88b55-29287294.pdf' },
        'functions/administration/internal-complaints-committee': { slug: 'page-ae-andhra-pradesh-ap-board-commitee' },
        'functions/administration/training': { slug: 'page-ae-andhra-pradesh-training' },
        'functions/administration/rajbhasha': { slug: 'page-ae-andhra-pradesh-rajbasha' },
        'functions/accounts-vlc': { slug: 'page-ae-andhra-pradesh-ap-accounts' },
        'functions/pension': { slug: 'page-ae-andhra-pradesh-ap-pension' },
        'functions/gpf': { slug: 'page-ae-andhra-pradesh-ap-gpf' },
        'functions/treasury-inspection': { slug: 'page-ae-andhra-pradesh-try-inspection' },
        'functions/treasury-inspection/about-treasury-functions': { slug: 'page-ae-andhra-pradesh-try-inspection' },
        'functions/welfare': { slug: 'page-ae-andhra-pradesh-welfare' },
        'state-accounts/accounting-system/structure-of-accounts': { slug: 'page-ae-andhra-pradesh-ap-structure-of-account' },
        'state-accounts/accounting-system/treasury-inspection': { slug: 'page-ae-andhra-pradesh-ap-try-inspection' },
        'page-ae-andhra-pradesh-try-inspection': { slug: 'page-ae-andhra-pradesh-try-inspection' },
        'page-ae-andhra-pradesh-ap-try-inspection': { slug: 'page-ae-andhra-pradesh-ap-try-inspection' },
        'state-accounts/accounting-system/list-of-pao-apaos': { pdf: 'List-of-PAO-06493eaf996a882-49771885.pdf', is_pdf: true },
        'state-accounts/accounting-system/list-of-treasuries-sub-treasuries': { pdf: 'List-of-DTAOs-Div-STOs-STOs-with-code-0649416e7b63852-43596934.pdf', is_pdf: true },
        'state-accounts/accounting-system/other-accounting-functions': { slug: 'page-ae-andhra-pradesh-other-accounting-functions' },
        'state-accounts/annual-accounts/finance-accounts': { slug: 'page-ae-andhra-pradesh-finaccons' },
        'state-accounts/other-reports/brochure-on-accounting': { slug: 'page-ae-andhra-pradesh-brochure-on-ac-dc-bills' },
        'state-accounts/reconciliation-of-accounts/quarterly-reconciliation-reports': { slug: 'page-ae-andhra-pradesh-quarterly-reconcilation-reports' },
        'state-accounts/dos-donts-paos-treasury-officers': { pdf: 'DO-s-AND-DON-Ts-20200605124152.pdf', is_pdf: true },
        'state-accounts/loan-account': { slug: 'page-ae-andhra-pradesh-loanintroduction' },
        'state-accounts/loan-account/introduction': { slug: 'page-ae-andhra-pradesh-loanintroduction' },
        'state-accounts/loan-account/guidelines': { slug: 'page-ae-andhra-pradesh-loanguidelines' },
        'state-accounts/loan-account/problems': { slug: 'page-ae-andhra-pradesh-loanproblem' },
        'state-accounts/loan-account/procedure': { slug: 'page-ae-andhra-pradesh-loanprocedure' },
        'state-accounts/loan-account/dos-donts': { slug: 'page-ae-andhra-pradesh-loan-do-s-dont-s' },
        'state-accounts/loan-account/do-s-dont-s': { slug: 'page-ae-andhra-pradesh-loan-do-s-dont-s' },
        'state-accounts/loan-account/dos-and-donts': { slug: 'page-ae-andhra-pradesh-loan-do-s-dont-s' },
        'state-accounts/loan-account/grievance': { slug: 'page-ae-andhra-pradesh-loangrievance' },
        'state-accounts/loan-account/faq': { slug: 'page-ae-andhra-pradesh-loan-faq-s' },
        'state-accounts/loan-account/faqs': { slug: 'page-ae-andhra-pradesh-loan-faq-s' },
        'state-accounts/loan-account/loan-faq-s': { slug: 'page-ae-andhra-pradesh-loan-faq-s' },
        'state-accounts/natural-resource-accounting/mineral-energy-resources': { slug: 'page-ae-andhra-pradesh-nra-of-andhra-pradesh-minerals-energy' },
        'gpf/about-gpf': { slug: 'page-ae-andhra-pradesh-about-gpf' },
        'gpf/gpf-information/eligibility-to-join-the-fund': { slug: 'page-ae-andhra-pradesh-eligibility-to-join-the-fund' },
        'gpf/gpf-information/gpf-subscription': { slug: 'page-ae-andhra-pradesh-gpf-subscrptn-smenu' },
        'gpf/gpf-information/advances': { slug: 'page-ae-andhra-pradesh-gpf-advance' },
        'gpf/gpf-information/withdrawals': { slug: 'page-ae-andhra-pradesh-gpf-withdrawals' },
        'gpf/gpf-information/final-closure': { slug: 'page-ae-andhra-pradesh-final-closure' },
        'gpf/gpf-information/gpf-calculation': { slug: 'page-ae-andhra-pradesh-gpf-calculation' },
        'gpf/gpf-guidelines': { slug: 'page-ae-andhra-pradesh-gpf-guidelines' },
        'gpf/gpf-manual': { pdf: 'MANUAL-OF-THE-PROVIDENT-FUND-DEPATMENT-20200611170818.pdf', is_pdf: true },
        'gpf/maintenance-of-gpf-account': { slug: 'page-ae-andhra-pradesh-maintenanace-of-gpf-accounts' },
        'gpf/gpf-account-opening-form': { slug: 'page-ae-andhra-pradesh-gpf-ac-form', pdf: 'GPF-Ac-Form-05ed71f13a880a1-42537301.pdf' },
        'gpf/downloads-gpf-forms': { slug: 'page-ae-andhra-pradesh-downloads-gpf-forms' },
        'pension/pension-information/about-pension-functions': { slug: 'page-ae-andhra-pradesh-about-pension-fnctn' },
        'pension/pension-information/kinds-of-pension': { slug: 'page-ae-andhra-pradesh-pension-types' },
        'pension/pension-information/family-pension': { slug: 'page-ae-andhra-pradesh-family-pnsn' },
        'pension/pension-information/authority-responsible': { slug: 'page-ae-andhra-pradesh-authority-responsible' },
        'pension/pension-information/model-guidelines-for-processing-pension-papers': { slug: 'page-ae-andhra-pradesh-model-guidelines-for-processing-pension' },
        'pension/pension-information/model-guidelines': { slug: 'page-ae-andhra-pradesh-model-guidelines-for-processing-pension' },
        'pension/pension-information/dos-donts': { slug: 'page-ae-andhra-pradesh-do-s-and-dont-s-for-pension' },
        'pension/pension-information/dos-and-donts': { slug: 'page-ae-andhra-pradesh-do-s-and-dont-s-for-pension' },
        'pension/pension-information/do-s-and-dont-s-for-pension': { slug: 'page-ae-andhra-pradesh-do-s-and-dont-s-for-pension' },
        'pension/pension-information/authorisation-of-pension': { slug: 'page-ae-andhra-pradesh-authorisation-of-pension' },
        'pension/pension-information/authorization-of-pension': { slug: 'page-ae-andhra-pradesh-authorisation-of-pension' },
        'pension/pension-information/pension-check-list': { slug: 'page-ae-andhra-pradesh-pension-check-list' },
        'pension/pension-information/pension-brochure': { slug: 'page-ae-andhra-pradesh-pension-brochure' },
        'pension/download/government-orders-other-states': { slug: 'page-ae-andhra-pradesh-government-orders-other-states' },
        'pension/download/government-orders-andhra-pradesh': { slug: 'page-ae-andhra-pradesh-andhra-pradesh-go-s' },
        'employee-corner/forms-for-iaad-staff': { slug: 'page-ae-andhra-pradesh-forms-for-iaad-staff' },
        'employee-corner/forms-for-ia&ad-staff': { slug: 'page-ae-andhra-pradesh-forms-for-iaad-staff' },
        'employee-corner/forms-for-ia-ad-staff': { slug: 'page-ae-andhra-pradesh-forms-for-iaad-staff' },
        'employee-corner/forms-for-iaad-staffs': { slug: 'page-ae-andhra-pradesh-forms-for-iaad-staff' },
        'rti/public-information-officer': { slug: 'page-ae-andhra-pradesh-public-information-officer-p-i-o' },
        'rti/appellate-authority': { slug: 'page-ae-andhra-pradesh-appellate-authority' },
        'rti/rti-disclosure-ap': { pdf: 'RTI-disclosure-AP-0643fc224386475-92952692.pdf', is_pdf: true },
        'citizens-charter': { pdf: 'Citizen-Charter-english-updated-0643e81853c6471-79510511.pdf', is_pdf: true },
        'contact-us/contact-us/contact-details': { slug: 'page-ae-andhra-pradesh-contact-us' },
        'contact-us/contact-us/office-address': { slug: 'page-ae-andhra-pradesh-office-address' },
        'contact-us/contact-us/office-location': { slug: 'page-ae-andhra-pradesh-location' },
        'contact-us/contact-us/working-hours': { slug: 'page-ae-andhra-pradesh-working-hours' },
        'contact-us/contact-us/holiday-list': { pdf: 'Circular-List-of-Holidays-for-2026-0697203e391f278-31182167.pdf', is_pdf: true },
        'state-accounts/other-reports/accounts-not-received': { slug: '' },
        'state-accounts/other-reports/accounts-received-late': { slug: '' },
        'gpf/faq': { slug: '' },
        'pension/pensioners-corner/faq': { slug: '' },
        'contact-us/media-centre/hindi-magazine-pratibha': { slug: 'page-ae-andhra-pradesh-joint-hindi-magazine-pratibha' },
      };

      // Check explicit mapping first
      const explicitMapping = AP_EXPLICIT_SLUGS[cleanSlug];
      if (explicitMapping) {
        if (explicitMapping.slug === '') {
          return null;
        }

        if (explicitMapping.is_pdf && explicitMapping.pdf) {
          const pdfUrl = toCdnUrl(`/uploads/media/${explicitMapping.pdf}`);
          return {
            title: leaf.replace(/-/g, ' '),
            content_html: '',
            upload_file: pdfUrl,
            file_url: pdfUrl,
            is_pdf: true
          };
        }

        if (explicitMapping.slug) {
          const pageRes = await query<any>(
            `SELECT id, title, slug, content, excerpt, upload_file FROM pages WHERE slug = $1 LIMIT 1`,
            [explicitMapping.slug]
          );
          if (pageRes.rows.length > 0) {
            const row = pageRes.rows[0];
            let processedHtml = row.content || '';
            processedHtml = processedHtml
              .replace(/https?:\/\/cag\.gov\.in(?:\/+en)?(?:\/+webroot)?\/uploads\//gi, '/uploads/')
              .replace(/https?:\/\/d7i5wg8xwe4hf\.cloudfront\.net\/uploads\//gi, '/uploads/')
              .replace(/\/+webroot\/uploads\//gi, '/uploads/');

            const fileTarget = row.upload_file || explicitMapping.pdf;
            const fileUrl = fileTarget
              ? (fileTarget.startsWith('http') || fileTarget.startsWith('/') ? fileTarget : `/uploads/media/${fileTarget}`)
              : undefined;

            return {
              id: parseInt(row.id),
              title: row.title,
              content_html: processedHtml,
              excerpt: row.excerpt,
              upload_file: fileTarget,
              file_url: fileUrl,
              is_pdf: false
            };
          }
        }
      }

      const site = await this.getAeWebsiteBySlug(cleanState);

      // Search words for multi-word stemming
      const searchWords = leaf
        .replace(/-/g, ' ')
        .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .map((w) => w.toLowerCase().replace(/s$/, '')); // singularize

      const exactPhrase = leaf.replace(/-/g, ' ');

      // Special: Check cag_revamp.deputation table if leaf is deputation
      if (leafClean === 'deputation') {
        const depSql = `
          SELECT id, title, pdf_file
          FROM deputation
          WHERE status = 1 AND pdf_file IS NOT NULL AND pdf_file != ''
          ORDER BY CASE WHEN id = 998 OR pdf_file ILIKE '%list-of-candidates%' THEN 1 ELSE 2 END ASC, id DESC
          LIMIT 1;
        `;
        const depRes = await query<any>(depSql);
        if (depRes.rows.length > 0) {
          const dep = depRes.rows[0];
          const pdfUrl = toCdnUrl(dep.pdf_file.startsWith('http') || dep.pdf_file.startsWith('/') ? dep.pdf_file : `/uploads/deputation/${dep.pdf_file}`);
          return {
            id: dep.id,
            title: dep.title || 'Deputation',
            content_html: '',
            upload_file: pdfUrl,
            file_url: pdfUrl,
            is_pdf: true
          };
        }
      }

      // Skip gradation list pages from generic page query (handled by getAeGradationList)
      if (leafClean.includes('gradation')) {
        return null;
      }

      // Skip circulars & office orders from generic page query (handled by getAeCirculars)
      if (leafClean.includes('circular') || leafClean.includes('order')) {
        return null;
      }

      // Skip tenders, notifications, and recruitment notices from generic page query (handled by dedicated services)
      if (leafClean.includes('tender') || leafClean.includes('notification') || leafClean.includes('recruitment')) {
        return null;
      }

      // Skip Media Centre pages (handled by dedicated subsite page components)
      if (
        leafClean === 'photogallery' ||
        leafClean === 'videogallery' ||
        leafClean === 'speeches' ||
        leafClean === 'speech' ||
        leafClean === 'pressrelease' ||
        leafClean === 'pressreleases' ||
        leafClean === 'pressclipping' ||
        leafClean === 'pressclippings' ||
        leafClean === 'notices' ||
        leafClean === 'notice'
      ) {
        return null;
      }

      // Tier A: Check menus for this website in cag_revamp.menus
      if (site?.website_id) {
        const menuParams: any[] = [site.website_id, exactPhrase, leafClean];
        let wordConditions = '';

        searchWords.forEach((word) => {
          menuParams.push(`%${word}%`);
          const idx = menuParams.length;
          if (wordConditions === '') {
            wordConditions += `(m.menu_title ILIKE $${idx} OR p.slug ILIKE $${idx} OR p.title ILIKE $${idx})`;
          } else {
            wordConditions += ` AND (m.menu_title ILIKE $${idx} OR p.slug ILIKE $${idx} OR p.title ILIKE $${idx})`;
          }
        });

        const menuSql = `
          SELECT m.id, m.menu_title, m.menu_type, m.custom_link, m.object_id,
                 p.id as page_id, p.title as page_title, p.slug as page_slug, p.content as page_content, p.excerpt, p.upload_file
          FROM menus m
          JOIN menu_regions mr ON m.menu_region_id = mr.id
          LEFT JOIN pages p ON m.object_id = p.id
          WHERE mr.website_id = $1 AND (${wordConditions || '1=1'})
          ORDER BY 
            CASE
              WHEN m.menu_title ILIKE '%"' || $2 || '"%' OR p.title ILIKE $2 OR p.slug ILIKE '%' || $3 || '%' THEN 1
              WHEN m.custom_link ILIKE '%.pdf%' THEN 2
              WHEN p.content IS NOT NULL THEN 3
              ELSE 4
            END ASC, m.id ASC
          LIMIT 1;
        `;
        const menuRes = await query<any>(menuSql, menuParams);

        if (menuRes.rows.length > 0) {
          const m = menuRes.rows[0];

          // If menu points to PDF/custom link
          if (m.custom_link && (m.custom_link.includes('.pdf') || m.custom_link.includes('uploads'))) {
            const match = m.custom_link.match(/(\/?uploads[^\s",}\\]+)/i);
            const pdfUrl = toCdnUrl(match ? match[1] : m.custom_link);
            return {
              id: m.page_id ? parseInt(m.page_id) : undefined,
              title: parseMenuTitle(m.menu_title) || exactPhrase,
              content_html: m.page_content ? toCdnUrl(m.page_content) : '',
              excerpt: m.excerpt,
              upload_file: pdfUrl,
              file_url: pdfUrl,
              is_pdf: true
            };
          }

          // If menu references a page
          if (m.page_content || m.page_title) {
            let processedHtml = m.page_content || '';
            processedHtml = processedHtml
              .replace(/https?:\/\/cag\.gov\.in(?:\/+webroot)?\/uploads\//gi, 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/')
              .replace(/\/+webroot\/uploads\//gi, 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/');

            return {
              id: m.page_id ? parseInt(m.page_id) : undefined,
              title: m.page_title || parseMenuTitle(m.menu_title),
              content_html: processedHtml,
              excerpt: m.excerpt,
              upload_file: m.upload_file,
              file_url: m.upload_file ? (m.upload_file.startsWith('http') ? m.upload_file : cdn.media(m.upload_file)) : undefined,
            };
          }
        }
      }

      // Tier B: Query cag_revamp.pages with STRICT state scoping
      const pageSql = `
        SELECT id, title, slug, content, excerpt, upload_file
        FROM pages
        WHERE status = 1 AND (
          slug ILIKE 'page-ae-' || $1 || '-%' OR
          slug ILIKE 'page-' || $1 || '-%' OR
          slug ILIKE '%-' || $1 || '-%' OR
          slug ILIKE '%-' || $1
        ) AND (
          slug ILIKE '%' || $2 || '%' OR
          title ILIKE '%' || $3 || '%'
        )
        ORDER BY 
          CASE 
            WHEN slug ILIKE 'page-ae-' || $1 || '-' || $2 || '%' THEN 1
            WHEN slug ILIKE 'page-ae-' || $1 || '%' AND slug ILIKE '%' || $2 || '%' THEN 2
            WHEN slug ILIKE '%' || $1 || '%' AND title ILIKE '%' || $3 || '%' THEN 3
            ELSE 4
          END ASC, id DESC
        LIMIT 1;
      `;
      const pageRes = await query<any>(pageSql, [
        cleanState,
        leafClean.slice(0, 8),
        exactPhrase
      ]);

      if (pageRes.rows.length > 0) {
        const row = pageRes.rows[0];
        let processedHtml = row.content || '';
        processedHtml = processedHtml
          .replace(/https?:\/\/cag\.gov\.in(?:\/+webroot)?\/uploads\//gi, 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/')
          .replace(/\/+webroot\/uploads\//gi, 'http://d7i5wg8xwe4hf.cloudfront.net/uploads/');

        return {
          id: row.id,
          title: row.title,
          content_html: processedHtml,
          excerpt: row.excerpt,
          upload_file: row.upload_file,
          file_url: row.upload_file ? (row.upload_file.startsWith('http') ? row.upload_file : cdn.media(row.upload_file)) : undefined,
        };
      }

      return null;
    } catch (err) {
      console.warn(`[aeService.getAePageContent] query failed for ${slug}:`, err);
      return null;
    }
  },

  /**
   * 11b. Query state-specific Citizens Charter from menus/pages in cag_revamp
   */
  async getAeStateCitizenCharter(stateSlug: string): Promise<{
    type: 'pdf' | 'html_page' | 'pdf_and_page';
    title: string;
    pdfUrl?: string;
    contentHtml?: string;
    fileSize?: string;
  } | null> {
    try {
      const site = await this.getAeWebsiteBySlug(stateSlug);
      const stateDisplayName = site?.state_name || stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Helper to rewrite old paths to local /uploads/
      const toCdnUrl = (u: string) => {
        if (!u) return '';
        return u
          .replace(/^https?:\/\/d7i5wg8xwe4hf\.cloudfront\.net\/uploads\//i, '/uploads/')
          .replace(/^https?:\/\/cag\.gov\.in(?:\/+en)?(?:\/+webroot)?\/uploads\//i, '/uploads/')
          .replace(/^\/+webroot\/uploads\//i, '/uploads/')
          .replace(/^\/+uploads\//i, '/uploads/')
          .trim();
      };

      if (site?.website_id) {
        // Query menus for Citizen Charter
        const menuSql = `
          SELECT m.id, m.menu_title, m.menu_type, m.custom_link, m.object_id
          FROM menus m
          JOIN menu_regions mr ON m.menu_region_id = mr.id
          WHERE mr.website_id = $1
            AND (m.menu_title ILIKE '%Citizen%' OR m.menu_title ILIKE '%Charter%' OR m.custom_link ILIKE '%Citizen%')
          ORDER BY m.id DESC
          LIMIT 1;
        `;
        const menuRes = await query<any>(menuSql, [site.website_id]);
        if (menuRes.rows.length > 0) {
          const m = menuRes.rows[0];

          // Check if custom link has PDF or JSON
          if (m.custom_link) {
            const match = m.custom_link.match(/(\/?uploads[^\s",}\\]+)/i);
            if (match) {
              return {
                type: 'pdf',
                title: `Citizens Charter - ${stateDisplayName}`,
                pdfUrl: toCdnUrl(match[1]),
                fileSize: '3.45 MB'
              };
            }
            if (m.custom_link.includes('.pdf')) {
              return {
                type: 'pdf',
                title: `Citizens Charter - ${stateDisplayName}`,
                pdfUrl: toCdnUrl(m.custom_link),
                fileSize: '3.45 MB'
              };
            }
          }

          // Check if page object reference
          if (m.object_id && m.object_id !== '0') {
            const pageSql = `
              SELECT id, title, content, upload_file
              FROM pages
              WHERE id = $1;
            `;
            const pageRes = await query<any>(pageSql, [parseInt(m.object_id)]);
            if (pageRes.rows.length > 0) {
              const p = pageRes.rows[0];
              const pdfUrl = p.upload_file ? toCdnUrl('/uploads/media/' + p.upload_file) : undefined;
              return {
                type: pdfUrl ? 'pdf_and_page' : 'html_page',
                title: p.title || `Citizens Charter - ${stateDisplayName}`,
                pdfUrl,
                contentHtml: p.content,
                fileSize: pdfUrl ? '2.80 MB' : undefined
              };
            }
          }
        }
      }

      // Check fallback to general page query
      const dbPage = await this.getAePageContent('Citizens-Charter', stateSlug);
      if (dbPage) {
        return {
          type: dbPage.file_url ? 'pdf_and_page' : 'html_page',
          title: dbPage.title || `Citizens Charter - ${stateDisplayName}`,
          pdfUrl: dbPage.file_url,
          contentHtml: dbPage.content_html,
          fileSize: '3.45 MB'
        };
      }

      return null;
    } catch (err) {
      console.warn(`[aeService.getAeStateCitizenCharter] failed for ${stateSlug}:`, err);
      return null;
    }
  },

  /**
   * 12. Query State Accounts Reports from cag_revamp.state_accounts_report
   */
  async getAeStateAccounts(stateId: number, categoryId?: number): Promise<AeStateAccountReport[]> {
    try {
      let sql = `
        SELECT 
          sar.id,
          sar.account_state AS state_id,
          sar.general_category_id AS account_report_types_id,
          sar.title,
          sar.year,
          sar.month,
          sar.uploads AS file_name,
          sar.is_state_ut,
          sar.status,
          sar.created AS created_at
        FROM state_accounts_report sar
        WHERE sar.status = 1 
          AND sar.account_state = $1
          AND (sar.title NOT ILIKE '%test%' OR sar.title IS NULL)
          AND sar.uploads IS NOT NULL 
          AND sar.uploads != ''
      `;
      const params: any[] = [stateId];

      if (categoryId) {
        params.push(categoryId);
        sql += ` AND sar.general_category_id = $${params.length}`;
      }

      sql += `
        ORDER BY 
          CASE 
            WHEN sar.year ~ '^[0-9]{4}' THEN SUBSTRING(sar.year FROM 1 FOR 4)::int
            ELSE COALESCE(sar.ac_year, 0)
          END DESC, 
          sar.id DESC 
        LIMIT 50;
      `;

      const res = await query<any>(sql, params);
      return res.rows.map((r: any) => ({
        ...r,
        file_url: r.file_name ? (r.file_name.startsWith('http') || r.file_name.startsWith('/') ? r.file_name : `/uploads/state_accounts_report/${r.file_name}`) : '',
      }));
    } catch (err) {
      console.warn(`[aeService.getAeStateAccounts] query failed for stateId ${stateId}:`, err);
      return [];
    }
  },

  /**
   * 12b. Query State Accounts by Category from cag_revamp.ae_state_accounts
   */
  async getAeStateAccountsByCategory(stateSlug: string = 'andhra-pradesh', categoryId: number, limit: number = 50, prefix: string = 'ae'): Promise<any[]> {
    try {
      let userIds = getStateUserIds(stateSlug);
      
      if (userIds.length === 0) {
        const stateClean = stateSlug.replace(/-/g, '').toLowerCase();
        const userPattern = prefix === 'ae' ? `AE_%` : `AG_%`;
        const userRes = await query(`
          SELECT id, username FROM users 
          WHERE username ILIKE $1 AND (
            REPLACE(LOWER(username), '_', '') ILIKE $2 OR
            REPLACE(LOWER(full_name), ' ', '') ILIKE $2
          )
        `, [userPattern, `%${stateClean}%`]);
        userIds = userRes.rows.map((u: any) => parseInt(u.id)).filter((id: number) => !isNaN(id));
      }

      if (userIds.length === 0) {
        userIds = [130];
      }

      const res = await query(`
        SELECT 
          id, 
          title, 
          language, 
          general_parent_categories_id,
          general_categories_id,
          year,
          report_type,
          month,
          file_title,
          upload_file,
          status,
          created,
          created_by
        FROM ae_state_accounts
        WHERE general_categories_id = $1 
          AND (created_by = ANY($2) OR created_by = 0 OR created_by IS NULL)
          AND status = 1 
          AND (language = 'en' OR language IS NULL)
        ORDER BY 
          CASE 
            WHEN year ILIKE '%2026%' THEN 2026
            WHEN year ILIKE '%2025%' THEN 2025
            WHEN year ILIKE '%2024%' THEN 2024
            WHEN year ILIKE '%2023%' THEN 2023
            WHEN year ILIKE '%2022%' THEN 2022
            WHEN year ILIKE '%2021%' THEN 2021
            WHEN year ILIKE '%2020%' THEN 2020
            ELSE 2000
          END DESC,
          id DESC
        LIMIT $3;
      `, [categoryId, userIds, limit]);

      return res.rows.map((r: any) => ({
        ...r,
        file_url: r.upload_file ? (r.upload_file.startsWith('http') || r.upload_file.startsWith('/') ? r.upload_file : `/uploads/ae_state_accounts/${r.upload_file}`) : undefined,
      }));
    } catch (err) {
      console.warn(`[aeService.getAeStateAccountsByCategory] query error for cat ${categoryId}:`, err);
      return [];
    }
  },

  /**
   * 13. Query Circulars from cag_revamp.ae_circulars_office_orders
   */
  async getAeCirculars(stateSlugOrLimit: string | number = 'andhra-pradesh', limit: number = 50, prefix: string = 'ae'): Promise<any[]> {
    if (typeof stateSlugOrLimit === 'number') {
      try {
        const sql = `
          SELECT 
            id,
            title,
            language,
            general_categories_id,
            ae_date,
            date_of_order,
            body,
            file_title,
            upload_file,
            full_url,
            status
          FROM ae_circulars_office_orders
          WHERE status = 1
          ORDER BY COALESCE(ae_date, created_at) DESC
          LIMIT $1;
        `;
        const res = await query<any>(sql, [stateSlugOrLimit]);
        return res.rows.map((r: any) => ({
          ...r,
          file_url: r.upload_file ? cdn.circular(r.upload_file) : undefined,
        }));
      } catch (err) {
        console.warn('[aeService.getAeCirculars] query failed:', err);
        return [];
      }
    }

    try {
      const stateSlug = String(stateSlugOrLimit);
      let userIds = getStateUserIds(stateSlug);

      if (userIds.length === 0) {
        const stateClean = stateSlug.replace(/-/g, '').toLowerCase();
        const userPattern = prefix === 'ae' ? `AE_%` : `AG_%`;
        const userRes = await query(`
          SELECT id, username FROM users 
          WHERE username ILIKE $1 AND (
            REPLACE(LOWER(username), '_', '') ILIKE $2 OR
            REPLACE(LOWER(full_name), ' ', '') ILIKE $2
          )
        `, [userPattern, `%${stateClean}%`]);
        userIds = userRes.rows.map((u: any) => parseInt(u.id)).filter((id: number) => !isNaN(id));
      }

      if (userIds.length === 0) {
        userIds = [130];
      }

      const res = await query(`
        SELECT 
          id, 
          title, 
          language, 
          general_categories_id, 
          ae_date, 
          date_of_order, 
          body, 
          file_title, 
          upload_file, 
          full_url, 
          status, 
          display_order,
          created_at
        FROM ae_circulars_office_orders
        WHERE (created_by = ANY($1) OR created_by = 0 OR created_by IS NULL) AND status = 1 AND (language = 'en' OR language IS NULL)
        ORDER BY display_order DESC, ae_date DESC NULLS LAST, id DESC
        LIMIT $2;
      `, [userIds, limit]);

      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeCirculars] query error:', err);
      return [];
    }
  },

  /**
   * 14. Submit Grievance into cag_revamp.ae_complaint_suggestion
   */
  async submitAeGrievance(payload: AeGrievancePayload): Promise<{ success: boolean; id?: number; message?: string }> {
    try {
      const sql = `
        INSERT INTO ae_complaint_suggestion (
          website_id,
          state_id,
          full_name,
          mobile,
          email,
          address,
          employee_id,
          department_name,
          ddo_office_name,
          treasury,
          work_from_retired,
          complaint_related_to,
          gpf_ac_no,
          pension_appln_ppo_no,
          ge_register_ref_no,
          subject,
          suggestion_complaint,
          attachment,
          uploads,
          status,
          created
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 1, NOW()
        ) RETURNING id;
      `;
      const params = [
        payload.website_id || 0,
        payload.state_id || null,
        payload.full_name,
        payload.mobile,
        payload.email || '',
        payload.address || '',
        payload.employee_id || '',
        payload.department_name || '',
        payload.ddo_office_name || '',
        payload.treasury || '',
        payload.work_from_retired || '',
        payload.complaint_related_to || 'Pension',
        payload.gpf_ac_no || '',
        payload.pension_appln_ppo_no || '',
        payload.ge_register_ref_no || '',
        payload.subject,
        payload.suggestion_complaint,
        payload.uploads ? 1 : 0,
        payload.uploads || ''
      ];

      const res = await query<{ id: number }>(sql, params);
      return { success: true, id: res.rows[0]?.id, message: 'Grievance registered successfully.' };
    } catch (err: any) {
      console.error('[aeService.submitAeGrievance] DB insert error:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * 15. Query Pension authorization from cag_revamp.bihar_pensions
   */
  async queryPension(ppo: string, dor?: string, phase?: string): Promise<any[]> {
    try {
      let sql = `
        SELECT id, serial, ppo, treasury, cname, dor, scale, rpension, rfp, phase
        FROM bihar_pensions
        WHERE LOWER(ppo) = LOWER($1) OR ppo ILIKE '%' || $1 || '%'
      `;
      const params: any[] = [ppo.trim()];

      if (phase) {
        params.push(phase.trim());
        sql += ` AND phase = $${params.length}`;
      }

      sql += ` ORDER BY id ASC LIMIT 50;`;
      const res = await query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[aeService.queryPension] query error:', err);
      return [];
    }
  },

  /**
   * 15b. Search Bihar pensions with advanced filters and pagination
   */
  async getBiharPensions(filters: {
    ppo?: string;
    cname?: string;
    treasury?: string;
    phase?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: any[]; total: number }> {
    try {
      const page = Math.max(1, filters.page || 1);
      const limit = Math.min(100, Math.max(10, filters.limit || 25));
      const offset = (page - 1) * limit;

      let whereClause = '1=1';
      const params: any[] = [];

      if (filters.ppo && filters.ppo.trim()) {
        params.push(`%${filters.ppo.trim()}%`);
        whereClause += ` AND ppo ILIKE $${params.length}`;
      }
      if (filters.cname && filters.cname.trim()) {
        params.push(`%${filters.cname.trim()}%`);
        whereClause += ` AND cname ILIKE $${params.length}`;
      }
      if (filters.treasury && filters.treasury.trim()) {
        params.push(`%${filters.treasury.trim()}%`);
        whereClause += ` AND treasury ILIKE $${params.length}`;
      }
      if (filters.phase && filters.phase.trim()) {
        params.push(filters.phase.trim());
        whereClause += ` AND phase = $${params.length}`;
      }

      const countSql = `SELECT count(*) as total FROM bihar_pensions WHERE ${whereClause};`;
      const countRes = await query<{ total: string }>(countSql, params);
      const total = parseInt(countRes.rows[0]?.total || '0');

      const dataSql = `
        SELECT id, serial, ppo, treasury, cname, dor, scale, rpension, rfp, phase
        FROM bihar_pensions
        WHERE ${whereClause}
        ORDER BY id ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2};
      `;
      const dataRes = await query(dataSql, [...params, limit, offset]);

      return {
        items: dataRes.rows,
        total
      };
    } catch (err) {
      console.warn('[aeService.getBiharPensions] query error:', err);
      return { items: [], total: 0 };
    }
  },

  /**
   * 17. Fetch dynamic menu tree from DB for a website
   */
  async getAeMenuTree(websiteId: number): Promise<any[]> {
    try {
      // First get the main menu region for this website
      const regionSql = `
        SELECT id FROM menu_regions 
        WHERE website_id = $1 AND slug = 'main-menu' AND status = 1
        LIMIT 1;
      `;
      const regionRes = await query(regionSql, [websiteId]);
      if (regionRes.rows.length === 0) return [];
      
      const regionId = regionRes.rows[0].id;
      
      // Get all menus in this region
      const menuSql = `
        SELECT id, menu_title, parent_id, menu_type, custom_link, object_id, sort_order
        FROM menus
        WHERE menu_region_id = $1 AND status = 1
        ORDER BY sort_order ASC;
      `;
      const menuRes = await query(menuSql, [regionId]);
      
      // Build tree structure
      const allMenus = menuRes.rows.map((r: any) => ({
        id: r.id,
        title: parseMenuTitle(r.menu_title),
        parent_id: r.parent_id || 0,
        menu_type: r.menu_type,
        link: r.custom_link,
        page_id: r.object_id ? parseInt(r.object_id) : null,
        sort_order: r.sort_order,
        children: [] as any[],
      }));

      // Build parent-child relationships
      const menuMap = new Map<number, any>();
      allMenus.forEach(m => menuMap.set(m.id, m));
      
      const topLevel: any[] = [];
      allMenus.forEach(m => {
        if (m.parent_id === 0 || !menuMap.has(m.parent_id)) {
          topLevel.push(m);
        } else {
          const parent = menuMap.get(m.parent_id);
          if (parent) parent.children.push(m);
        }
      });

      return topLevel;
    } catch (err) {
      console.warn('[aeService.getAeMenuTree] query failed:', err);
      return [];
    }
  },

  /**
   * 18. Query Gradation List from cag_revamp.gradation_list
   */
  async getAeGradationList(stateSlug: string, prefix: string = 'ae'): Promise<any[]> {
    try {
      let userIds = getStateUserIds(stateSlug);

      if (userIds.length === 0) {
        const stateClean = stateSlug.replace(/-/g, '').toLowerCase();
        const userPattern = prefix === 'ae' ? `AE_%` : `AG_%`;
        const userRes = await query(`
          SELECT id, username FROM users 
          WHERE username ILIKE $1 AND (
            REPLACE(LOWER(username), '_', '') ILIKE $2 OR
            REPLACE(LOWER(full_name), ' ', '') ILIKE $2
          )
        `, [userPattern, `%${stateClean}%`]);
        userIds = userRes.rows.map((u: any) => parseInt(u.id)).filter((id: number) => !isNaN(id));
      }

      if (userIds.length === 0) {
        userIds = [130];
      }

      const res = await query(`
        SELECT id, title, pdf_file, general_categories_id, status, display_order, created
        FROM gradation_list
        WHERE (created_by = ANY($1) OR created_by = 0 OR created_by IS NULL) AND status = 1 AND (language = 'en' OR language IS NULL)
        ORDER BY 
          CASE 
            WHEN title ILIKE '%2026%' THEN 2026
            WHEN title ILIKE '%2025%' THEN 2025
            WHEN title ILIKE '%2024%' THEN 2024
            WHEN title ILIKE '%2023%' THEN 2023
            WHEN title ILIKE '%2022%' THEN 2022
            WHEN title ILIKE '%2021%' THEN 2021
            WHEN title ILIKE '%2020%' THEN 2020
            WHEN title ILIKE '%2019%' THEN 2019
            ELSE 2000
          END DESC,
          id DESC
      `, [userIds]);

      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeGradationList] query error:', err);
      return [];
    }
  },

  /**
   * 19. Fetch state-scoped FAQs from cag_revamp.faqs (Loans=766, GPF=763, Pension=765)
   */
  async getAeFaqs(category?: string, stateSlug: string = 'andhra-pradesh'): Promise<Array<{ id: number; question: string; answer: string; display_order?: number }>> {
    try {
      let catId: number | null = null;
      if (category === 'loans' || category === 'loan') catId = 766;
      else if (category === 'gpf') catId = 763;
      else if (category === 'pension') catId = 765;

      let userIds = getStateUserIds(stateSlug);
      if (userIds.length === 0 && stateSlug.toLowerCase().includes('andhra')) {
        userIds = [130];
      }

      let sql = `
        SELECT id, question, answer, display_order
        FROM faqs
        WHERE (status = 1 OR status = 0)
      `;
      const params: any[] = [];
      if (catId) {
        params.push(catId);
        sql += ` AND general_categories_id = $${params.length}`;
      }
      if (userIds.length > 0) {
        params.push(userIds);
        sql += ` AND (created_by = ANY($${params.length}) OR created_by = 0 OR created_by IS NULL)`;
      }
      sql += ` ORDER BY display_order ASC, id DESC LIMIT 50;`;
      const res = await query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeFaqs] query error:', err);
      return [];
    }
  },

  /**
   * 20. Query Tenders for a state
   */
  async getAeTenders(stateSlug: string = 'andhra-pradesh', limit: number = 50): Promise<any[]> {
    try {
      let userIds = getStateUserIds(stateSlug);
      if (userIds.length === 0 && stateSlug.toLowerCase().includes('andhra')) {
        userIds = [130];
      }

      let sql = `
        SELECT id, tender_title, tender_refrence_no, file_title, uploads, issue_date, submission_date, created_by, status
        FROM tenders
        WHERE status = 1 AND tender_title NOT ILIKE '%testing%' AND tender_title NOT ILIKE '%test%'
      `;
      const params: any[] = [];
      if (userIds.length > 0) {
        params.push(userIds);
        sql += ` AND (created_by = ANY($${params.length}) OR created_by = 0 OR created_by IS NULL)`;
      }
      params.push(limit);
      sql += ` ORDER BY COALESCE(issue_date, created) DESC, id DESC LIMIT $${params.length};`;
      const res = await query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeTenders] query error:', err);
      return [];
    }
  },

  /**
   * 21. Query Notifications for a state
   */
  async getAeNotifications(stateSlug: string = 'andhra-pradesh', limit: number = 50): Promise<any[]> {
    try {
      let userIds = getStateUserIds(stateSlug);
      if (userIds.length === 0 && stateSlug.toLowerCase().includes('andhra')) {
        userIds = [130];
      }

      let sql = `
        SELECT id, title, uploads, external_link, created, created_by, status
        FROM notification
        WHERE status = 1 AND title NOT ILIKE '%TestNotification%' AND title NOT ILIKE '%test%'
      `;
      const params: any[] = [];
      if (userIds.length > 0) {
        params.push(userIds);
        sql += ` AND (created_by = ANY($${params.length}) OR created_by = 0 OR created_by IS NULL)`;
      }
      params.push(limit);
      sql += ` ORDER BY COALESCE(created, modified) DESC, id DESC LIMIT $${params.length};`;
      const res = await query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeNotifications] query error:', err);
      return [];
    }
  },

  /**
   * 22. Query Recruitment Notices for a state
   */
  async getAeRecruitments(stateSlug: string = 'andhra-pradesh', limit: number = 50): Promise<any[]> {
    try {
      let userIds = getStateUserIds(stateSlug);
      if (userIds.length === 0 && stateSlug.toLowerCase().includes('andhra')) {
        userIds = [130];
      }

      let sql = `
        SELECT id, title, document_uploaded, recruitment_notice_date, close_date, created_by, status
        FROM recruitment_notices
        WHERE status = 1 AND title NOT ILIKE '%test%'
      `;
      const params: any[] = [];
      if (userIds.length > 0) {
        params.push(userIds);
        sql += ` AND (created_by = ANY($${params.length}) OR created_by = 0 OR created_by IS NULL)`;
      }
      params.push(limit);
      sql += ` ORDER BY COALESCE(recruitment_notice_date, created_at) DESC, id DESC LIMIT $${params.length};`;
      const res = await query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeRecruitments] query error:', err);
      return [];
    }
  },

  /**
   * 23. Query Media Centre Notices (ae_notices) for a state
   */
  async getAeNotices(stateSlug: string = 'andhra-pradesh', limit: number = 50): Promise<any[]> {
    try {
      let userIds = getStateUserIds(stateSlug);
      if (userIds.length === 0 && stateSlug.toLowerCase().includes('andhra')) {
        userIds = [130];
      }

      let sql = `
        SELECT id, title, language, description, file_title, upload_file, full_url, notice_date, created_by, status
        FROM ae_notices
        WHERE (status = 1 OR status = 0)
      `;
      const params: any[] = [];
      if (userIds.length > 0) {
        params.push(userIds);
        sql += ` AND (created_by = ANY($${params.length}) OR created_by = 0 OR created_by IS NULL)`;
      }
      params.push(limit);
      sql += ` ORDER BY COALESCE(notice_date, created_at) DESC, id DESC LIMIT $${params.length};`;
      const res = await query(sql, params);
      return res.rows;
    } catch (err) {
      console.warn('[aeService.getAeNotices] query error:', err);
      return [];
    }
  },
};


