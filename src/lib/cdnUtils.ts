/**
 * CloudFront CDN Configuration & URL Resolution Utility
 * Maps legacy CMS image paths and upload file paths from database records
 * to official CloudFront CDN endpoints without modifying the database.
 */

export const CLOUDFRONT_BASE_URL = "https://d7i5wg8xwe4hf.cloudfront.net";

/**
 * Resolves a single asset, document, or image URL/filename to its official CloudFront CDN endpoint.
 */
export const getCloudFrontUrl = (url?: string | null): string => {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  // 1. If already an absolute CloudFront URL, return as-is
  if (trimmed.startsWith("https://d7i5wg8xwe4hf.cloudfront.net")) {
    return trimmed;
  }

  // 2. Handle legacy cag.gov.in absolute URLs
  // e.g. http://cag.gov.in/webroot/uploads/FileManager/india_and_nepal.jpg
  // e.g. https://cag.gov.in/uploads/former_cag/FG-shashi-...
  if (trimmed.includes("cag.gov.in")) {
    const cleanPath = trimmed
      .replace(/^https?:\/\/(www\.)?cag\.gov\.in(\/webroot)?/, "")
      .replace(/^\/+/, "");
    return `${CLOUDFRONT_BASE_URL}/${cleanPath}`;
  }

  // 3. Handle raw former CAG filenames (stored as FG-*)
  if (/^FG-/i.test(trimmed)) {
    return `${CLOUDFRONT_BASE_URL}/uploads/former_cag/${trimmed}`;
  }

  // 4. Handle raw banner filenames (stored as banner-*)
  if (/^banner-/i.test(trimmed)) {
    return `${CLOUDFRONT_BASE_URL}/uploads/banner/${trimmed}`;
  }

  // 5. Handle relative CMS page images
  if (trimmed.includes("assets/images/cms_pages/")) {
    const filename = trimmed.split("assets/images/cms_pages/").pop();
    return `${CLOUDFRONT_BASE_URL}/assets/images/cms_pages/${filename}`;
  }

  // 6. Handle sector-wise images
  if (trimmed.includes("assets/images/sector_wise_images/")) {
    const filename = trimmed.split("assets/images/sector_wise_images/").pop();
    return `${CLOUDFRONT_BASE_URL}/assets/images/sector_wise_images/${filename}`;
  }

  // 7. Handle specific uploads subdirectories
  if (trimmed.includes("uploads/former_cag/")) {
    const filename = trimmed.split("uploads/former_cag/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/former_cag/${filename}`;
  }

  if (trimmed.includes("uploads/banner/")) {
    const filename = trimmed.split("uploads/banner/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/banner/${filename}`;
  }

  if (trimmed.includes("uploads/cag_emp_profile_pic/")) {
    const filename = trimmed.split("uploads/cag_emp_profile_pic/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/cag_emp_profile_pic/${filename}`;
  }

  if (trimmed.includes("uploads/union_department/")) {
    const filename = trimmed.split("uploads/union_department/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/union_department/${filename}`;
  }

  if (trimmed.includes("uploads/media/")) {
    const filename = trimmed.split("uploads/media/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/media/${filename}`;
  }

  if (trimmed.includes("uploads/FileManager/")) {
    const pathAfter = trimmed.split("uploads/FileManager/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/FileManager/${pathAfter}`;
  }

  if (trimmed.includes("uploads/download_audit_report/")) {
    const clean = trimmed.replace(/^.*?uploads\/download_audit_report\//, "");
    return `${CLOUDFRONT_BASE_URL}/uploads/download_audit_report/${clean}`;
  }

  if (trimmed.includes("uploads/board_committees/")) {
    const filename = trimmed.split("uploads/board_committees/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/board_committees/${filename}`;
  }

  if (trimmed.includes("uploads/cag_pdf/")) {
    const pathAfter = trimmed.split("uploads/cag_pdf/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/cag_pdf/${pathAfter}`;
  }

  if (trimmed.includes("uploads/cms_pages_files/")) {
    const filename = trimmed.split("uploads/cms_pages_files/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/cms_pages_files/${filename}`;
  }

  // 8. General relative uploads paths
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/")) {
    const clean = trimmed.replace(/^\/?uploads\//, "");
    return `${CLOUDFRONT_BASE_URL}/uploads/${clean}`;
  }

  // 9. If raw image filename without slash (e.g. "r-g-vishwanathan-05f24204c3d7904-20703816.jpg")
  if (!trimmed.includes("/") && /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(trimmed)) {
    return `${CLOUDFRONT_BASE_URL}/uploads/cag_emp_profile_pic/${trimmed}`;
  }

  // 10. Generic relative path fallback starting with leading slash (e.g. /assets/...)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return trimmed;
};

/**
 * Transforms an HTML string fetched from the database by dynamically rewriting
 * legacy/relative image & PDF URLs to point to CloudFront CDN endpoints.
 */
export const transformHtmlAssetUrls = (html?: string | null): string => {
  if (!html) return "";
  return html
    .replace(/src=["'](?:\.\.\/|\/)?assets\/images\/cms_pages\/([^"']+)["']/g, `src="${CLOUDFRONT_BASE_URL}/assets/images/cms_pages/$1"`)
    .replace(/src=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/FileManager\/([^"']+)["']/g, `src="${CLOUDFRONT_BASE_URL}/uploads/FileManager/$1"`)
    .replace(/src=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/former_cag\/([^"']+)["']/g, `src="${CLOUDFRONT_BASE_URL}/uploads/former_cag/$1"`)
    .replace(/src=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/cag_emp_profile_pic\/([^"']+)["']/g, `src="${CLOUDFRONT_BASE_URL}/uploads/cag_emp_profile_pic/$1"`)
    .replace(/src=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/banner\/([^"']+)["']/g, `src="${CLOUDFRONT_BASE_URL}/uploads/banner/$1"`)
    .replace(/href=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/media\/([^"']+)["']/g, `href="${CLOUDFRONT_BASE_URL}/uploads/media/$1"`)
    .replace(/href=["'](?:\.\.\/|\/)?uploads\/media\/([^"']+)["']/g, `href="${CLOUDFRONT_BASE_URL}/uploads/media/$1"`)
    .replace(/href=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/cag_pdf\/([^"']+)["']/g, `href="${CLOUDFRONT_BASE_URL}/uploads/cag_pdf/$1"`)
    .replace(/href=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/download_audit_report\/([^"']+)["']/g, `href="${CLOUDFRONT_BASE_URL}/uploads/download_audit_report/$1"`);
};
