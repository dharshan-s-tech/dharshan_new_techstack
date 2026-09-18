'use client';

import React from 'react';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  noun?: string;
  alwaysShow?: boolean;
}

/** Dashboard Admin.png footer: "Showing 1 to 10 of 13 entries" + < 1 2 3 > */
export function AdminPagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
  pageSize = 10,
  noun = 'entries',
  alwaysShow = true,
}: AdminPaginationProps) {
  if (!alwaysShow && totalPages <= 1 && totalCount === 0) return null;

  const pages = Math.max(1, totalPages || 1);
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  const nums: number[] = [];
  const windowSize = 3;
  let from = Math.max(1, page - 1);
  let to = Math.min(pages, from + windowSize - 1);
  from = Math.max(1, to - windowSize + 1);
  for (let i = from; i <= to; i++) nums.push(i);

  return (
    <div className="admin-pagination px-5 py-3.5 border-t border-[#e8e8e8] bg-white flex items-center justify-between gap-3 flex-wrap">
      <p className="text-[13px] text-[#888] m-0">
        Showing {start} to {end} of {totalCount.toLocaleString()} {noun}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#e5e5e5] bg-white text-[#888] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          aria-label="Previous page"
        >
          ‹
        </button>
        {nums.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={`min-w-8 h-8 px-2 flex items-center justify-center rounded text-[13px] font-semibold transition-colors ${
              n === page
                ? 'bg-[#751639] text-white border border-[#751639]'
                : 'bg-white text-[#666] border border-[#e5e5e5] hover:bg-zinc-50'
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#e5e5e5] bg-white text-[#888] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default AdminPagination;
