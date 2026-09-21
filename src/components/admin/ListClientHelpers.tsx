'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { deleteRecord } from './actions';

export function DeleteErrorAlert() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      setErrorMsg(err);
      // Clean up search param from URL without reloading
      const params = new URLSearchParams(searchParams.toString());
      params.delete('error');
      const newQuery = params.toString() ? `?${params.toString()}` : '';
      window.history.replaceState(null, '', window.location.pathname + newQuery);
    }
  }, [searchParams]);

  if (!errorMsg) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
      <span className="text-base">⚠️</span>
      <div className="flex-1 font-medium">{errorMsg}</div>
      <button 
        onClick={() => setErrorMsg(null)} 
        className="text-red-500 hover:text-red-700 font-bold ml-auto text-lg leading-none"
      >
        &times;
      </button>
    </div>
  );
}

export function PaginationLinks({ page, totalPages }: { page: number; totalPages: number }) {
  const searchParams = useSearchParams();

  const getPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    return `?${params.toString()}`;
  };

  return (
    <div className="flex gap-1">
      {page > 1 && (
        <Link href={getPageUrl(page - 1)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {page < totalPages && (
        <Link href={getPageUrl(page + 1)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

export function DeleteButton({ table, id, editBase }: { table: string; id: any; editBase: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    setDeleting(true);
    const res = await deleteRecord(table, id, editBase);
    setDeleting(false);
    if (res.error) {
      router.push(`${editBase}?error=${encodeURIComponent(res.error)}`);
    } else {
      router.refresh();
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleDelete} 
      disabled={deleting}
      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 flex items-center justify-center" 
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

import { File, Eye, X, Download, Image as ImageIcon, ZoomIn, ExternalLink } from 'lucide-react';
import { getCloudFrontUrl } from '@/lib/cdnUtils';

export function FilePreviewAction({ 
  url, 
  type, 
  showThumbnail = false,
  alt = 'Image preview' 
}: { 
  url: string; 
  type?: 'image' | 'file' | 'link';
  showThumbnail?: boolean;
  alt?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!url || url === '#' || url === '—' || url === 'null' || url === 'undefined') {
    return <span className="text-gray-300">—</span>;
  }

  const resolvedUrl = getCloudFrontUrl(url);
  const isImage = type === 'image' || 
    url.match(/\.(jpeg|jpg|gif|png|webp|svg|ico)($|\?)/i) !== null ||
    resolvedUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|ico)($|\?)/i) !== null ||
    resolvedUrl.includes('/former_cag/') ||
    resolvedUrl.includes('/union_department/') ||
    resolvedUrl.includes('/banners/') ||
    url.startsWith('FG-') ||
    url.startsWith('banner-');
  const isPdf = url.toLowerCase().endsWith('.pdf') || resolvedUrl.toLowerCase().endsWith('.pdf') || type === 'file' || type === 'link';
  const fileName = resolvedUrl.split('/').pop()?.split('?')[0] || 'file';

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {/* Inline Picture Thumbnail (if image or showThumbnail requested) */}
        {isImage && !imgError && (
          <div 
            onClick={() => setIsOpen(true)}
            className="relative group cursor-pointer w-9 h-9 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 shadow-xs hover:border-[#751639] transition-all"
            title="Click to view full picture"
          >
            <img 
              src={resolvedUrl} 
              alt={alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <ZoomIn className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          </div>
        )}

        {isImage && imgError && (
          <div className="w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
            <ImageIcon className="w-4 h-4" />
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[#751639] hover:text-[#5f0f2d] text-xs font-semibold rounded-md transition-colors cursor-pointer border-none shadow-2xs"
            title={isImage ? "View Picture Preview" : "Preview Document"}
          >
            {isImage ? <ImageIcon className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Preview
          </button>
          <a
            href={resolvedUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center p-1 bg-[#751639] hover:bg-[#5f0f2d] text-white rounded-md transition-colors cursor-pointer shadow-2xs"
            title="Download File"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Picture & Document Lightbox Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150" 
          onClick={() => { setIsOpen(false); setIsZoomed(false); }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                {isImage ? (
                  <div className="p-1.5 bg-[#751639]/10 text-[#751639] rounded-lg">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <File className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm truncate max-w-md">{fileName}</h3>
                  <p className="text-[11px] text-gray-400">{isImage ? 'Picture Preview' : 'Document Preview'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isImage && (
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    {isZoomed ? 'Fit to Screen' : 'Zoom In'}
                  </button>
                )}
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Tab
                </a>
                <a
                  href={resolvedUrl}
                  download
                  className="px-3 py-1 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); setIsZoomed(false); }}
                  className="p-1.5 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Image Viewer */}
            <div className="flex-1 p-6 bg-gray-950/5 overflow-auto flex items-center justify-center min-h-[360px] max-h-[75vh]">
              {isImage ? (
                <div className="relative flex items-center justify-center w-full h-full">
                  <img 
                    src={resolvedUrl} 
                    alt={fileName} 
                    className={`rounded-xl shadow-md transition-all duration-200 ${
                      isZoomed 
                        ? 'max-h-none max-w-none cursor-zoom-out' 
                        : 'max-h-[65vh] max-w-full object-contain cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />
                </div>
              ) : isPdf ? (
                <iframe src={resolvedUrl} className="w-full h-[65vh] rounded-xl border-0 bg-white shadow-sm" title="PDF Document Preview" />
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-xs border border-gray-200 w-full max-w-md mx-auto">
                  <File className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-700 font-semibold">Preview not available for this file format.</p>
                  <p className="text-xs text-gray-400 mt-1">Please download the file to inspect its content.</p>
                </div>
              )}
            </div>

            {/* Modal Footer with URL & Info */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="truncate max-w-lg font-mono text-[11px] text-gray-400">{resolvedUrl}</span>
              <span className="text-gray-400 shrink-0">Click outside or ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
