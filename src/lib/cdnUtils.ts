/**
 * CloudFront CDN Configuration & URL Resolution Utility
 * Maps legacy CMS image paths and upload file paths from database records
 * to official CloudFront CDN endpoints without modifying the database.
 */

export const CLOUDFRONT_BASE_URL = "https://d7i5wg8xwe4hf.cloudfront.net";

/**
 * Resolves a single asset or document URL to its official CloudFront CDN endpoint.
 */
export const getCloudFrontUrl = (url?: string | null): string => {
  if (!url) return "";

  // 1. If already an absolute CloudFront URL, return as-is
  if (url.startsWith("https://d7i5wg8xwe4hf.cloudfront.net")) {
    return url;
  }

  // 2. Handle legacy cag.gov.in absolute URLs
  // e.g. http://cag.gov.in/webroot/uploads/FileManager/india_and_nepal.jpg
  if (url.includes("cag.gov.in/webroot/uploads/") || url.includes("cag.gov.in/uploads/")) {
    const cleanPath = url
      .replace(/^https?:\/\/(www\.)?cag\.gov\.in(\/webroot)?/, "")
      .replace(/^\/+/, "");
    return `${CLOUDFRONT_BASE_URL}/${cleanPath}`;
  }

  // 3. Handle legacy relative CMS image paths
  // e.g. ../assets/images/cms_pages/india-chile.jpg or /assets/images/cms_pages/...
  if (url.includes("assets/images/cms_pages/")) {
    const filename = url.split("assets/images/cms_pages/").pop();
    return `${CLOUDFRONT_BASE_URL}/assets/images/cms_pages/${filename}`;
  }

  // 4. Handle relative MoU media PDFs
  // e.g. /uploads/media/ChileMOU-063f318cb0b6ba3-11650995.pdf
  if (url.includes("uploads/media/")) {
    const filename = url.split("uploads/media/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/media/${filename}`;
  }

  // 5. Handle relative FileManager uploads
  // e.g. /uploads/FileManager/india_and_nepal.jpg
  if (url.includes("uploads/FileManager/")) {
    const pathAfter = url.split("uploads/FileManager/").pop();
    return `${CLOUDFRONT_BASE_URL}/uploads/FileManager/${pathAfter}`;
  }

  // 6. Generic relative path fallback
  if (url.startsWith("/")) {
    return `${CLOUDFRONT_BASE_URL}${url}`;
  }

  return url;
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
    .replace(/href=["'](?:https?:\/\/(?:www\.)?cag\.gov\.in(?:\/webroot)?)?\/uploads\/media\/([^"']+)["']/g, `href="${CLOUDFRONT_BASE_URL}/uploads/media/$1"`)
    .replace(/href=["'](?:\.\.\/|\/)?uploads\/media\/([^"']+)["']/g, `href="${CLOUDFRONT_BASE_URL}/uploads/media/$1"`);
};
