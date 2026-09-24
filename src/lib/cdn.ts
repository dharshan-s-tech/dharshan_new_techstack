/**
 * CloudFront CDN URL builder for all uploaded assets.
 * All database records store relative filenames (e.g., "andhrapradesh.png", "a-and-e.png").
 * This helper prefixes them with the CloudFront distribution URL.
 */

export const CDN_BASE = '/uploads';

/**
 * Build a full CDN URL from a relative path stored in the database.
 * @param path - Relative path or filename from the DB (e.g., "media/image.png" or "andhrapradesh.png")
 * @param subfolder - Optional subfolder to prepend (e.g., "states", "banners", "media")
 * @returns Full CDN URL or empty string if path is falsy
 */
export function cdnUrl(path: string | null | undefined, subfolder?: string): string {
  if (!path) return '';
  // If already starts with /uploads/ or /assets/ or /api/
  if (path.startsWith('/uploads/') || path.startsWith('/assets/') || path.startsWith('/api/')) return path;
  
  // If absolute URL pointing to cloudfront or cag.gov.in uploads, convert to local /uploads/
  if (path.includes('cloudfront.net/uploads/') || path.includes('cag.gov.in/uploads/') || path.includes('cag.gov.in/en/uploads/')) {
    const relative = path.replace(/^https?:\/\/[^\/]+\/(?:en\/)?(?:webroot\/)?uploads\//i, '');
    return `/uploads/${relative.replace(/^\/+/, '')}`;
  }

  // If other external http/https URL (e.g. external government portals), keep as is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Strip leading slashes
  const cleanPath = path.replace(/^\/+/, '');
  if (subfolder) {
    return `/uploads/${subfolder}/${cleanPath}`;
  }
  return `/uploads/${cleanPath}`;
}

/**
 * Convenience builders for common upload categories
 */
export const cdn = {
  media: (filename: string | null | undefined) => cdnUrl(filename, 'media'),
  banner: (filename: string | null | undefined) => cdnUrl(filename, 'banners'),
  state: (filename: string | null | undefined) => cdnUrl(filename, 'states'),
  stateAccounts: (filename: string | null | undefined) => cdnUrl(filename, 'state_accounts'),
  accountReport: (filename: string | null | undefined) => cdnUrl(filename, 'account_report'),
  aeStateAccounts: (filename: string | null | undefined) => cdnUrl(filename, 'ae_state_accounts'),
  circular: (filename: string | null | undefined) => cdnUrl(filename, 'circulars'),
  complaint: (filename: string | null | undefined) => cdnUrl(filename, 'complaint_suggestion'),
  leadership: (filename: string | null | undefined) => cdnUrl(filename, 'leadership'),
  logo: (filename: string | null | undefined) => cdnUrl(filename, 'logos'),
  gradationList: (filename: string | null | undefined) => cdnUrl(filename, 'gradation_list'),
  aeCirculars: (filename: string | null | undefined) => cdnUrl(filename, 'ae_circulars_office_orders'),
  deputation: (filename: string | null | undefined) => cdnUrl(filename, 'deputation'),
  tenders: (filename: string | null | undefined) => cdnUrl(filename, 'tenders'),
  notification: (filename: string | null | undefined) => cdnUrl(filename, 'notification'),
  aeNotices: (filename: string | null | undefined) => cdnUrl(filename, 'ae_notices'),
  /** Generic — auto-detects if path already includes subfolder */
  auto: (filename: string | null | undefined) => cdnUrl(filename),
};

