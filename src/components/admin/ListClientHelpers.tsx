'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
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

export function PaginationLinks({
  page,
  totalPages,
  totalCount,
  pageSize = 10,
  noun = 'entries',
}: {
  page: number;
  totalPages: number;
  totalCount?: number;
  pageSize?: number;
  noun?: string;
}) {
  const searchParams = useSearchParams();
  const pages = Math.max(1, totalPages || 1);
  const count = typeof totalCount === 'number' ? totalCount : 0;
  const start = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);

  const getPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    return `?${params.toString()}`;
  };

  const nums: number[] = [];
  const windowSize = 3;
  let from = Math.max(1, page - 1);
  let to = Math.min(pages, from + windowSize - 1);
  from = Math.max(1, to - windowSize + 1);
  for (let i = from; i <= to; i++) nums.push(i);

  return (
    <div className="admin-pagination w-full px-5 py-3.5 border-t border-[#e8e8e8] bg-white flex items-center justify-between gap-3 flex-wrap">
      <p className="text-[13px] text-[#888] m-0">
        Showing {start} to {end} of {count.toLocaleString()} {noun}
      </p>
      <div className="flex items-center gap-1.5">
        <Link
          href={getPageUrl(Math.max(1, page - 1))}
          className={`w-8 h-8 flex items-center justify-center rounded border border-[#e5e5e5] bg-white text-sm ${
            page <= 1 ? 'pointer-events-none opacity-40 text-[#b0b0b0]' : 'text-[#888] hover:bg-zinc-50'
          }`}
          aria-label="Previous page"
        >
          ‹
        </Link>
        {nums.map((n) => (
          <Link
            key={n}
            href={getPageUrl(n)}
            className={`min-w-8 h-8 px-2 flex items-center justify-center rounded text-[13px] font-semibold ${
              n === page
                ? 'bg-[#751639] text-white border border-[#751639]'
                : 'bg-white text-[#666] border border-[#e5e5e5] hover:bg-zinc-50'
            }`}
          >
            {n}
          </Link>
        ))}
        <Link
          href={getPageUrl(Math.min(pages, page + 1))}
          className={`w-8 h-8 flex items-center justify-center rounded border border-[#e5e5e5] bg-white text-sm ${
            page >= pages ? 'pointer-events-none opacity-40 text-[#b0b0b0]' : 'text-[#888] hover:bg-zinc-50'
          }`}
          aria-label="Next page"
        >
          ›
        </Link>
      </div>
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

import { File, Eye, X, Download } from 'lucide-react';

export function FilePreviewAction({ url, type }: { url: string; type: 'image' | 'file' | 'link' }) {
  const [isOpen, setIsOpen] = useState(false);
  if (!url) return <span className="text-gray-300">—</span>;

  const isImage = type === 'image';
  const isPdf = url.toLowerCase().endsWith('.pdf') || type === 'file' || type === 'link';

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-[#751639] hover:text-[#5f0f2d] text-xs font-semibold rounded transition-colors cursor-pointer border-none"
          title="Preview File"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <a
          href={url}
          download
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center p-1 bg-[#751639] hover:bg-[#5f0f2d] text-white rounded transition-colors cursor-pointer"
          title="Download"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm truncate">{url.split('/').pop()}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  download
                  className="px-3 py-1 bg-[#751639] hover:bg-[#5f0f2d] text-white text-xs font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer decoration-none"
                >
                  Download
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-100 overflow-auto flex items-center justify-center min-h-[300px]">
              {isImage ? (
                <img src={url} alt="Preview" className="max-h-[60vh] object-contain rounded-lg shadow bg-white" />
              ) : isPdf ? (
                <iframe src={url} className="w-full h-[60vh] rounded border-0 bg-white" title="PDF Preview" />
              ) : (
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border w-full max-w-md mx-auto">
                  <File className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Preview not available for this file type.</p>
                  <p className="text-xs text-gray-400 mt-1">Please download the file to view its contents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
