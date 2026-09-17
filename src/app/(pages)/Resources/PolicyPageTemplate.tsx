'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ResourcesLayout from './ResourcesLayout';
import { api } from '@/lib/api';

export interface ResourceDocumentItem {
  id: string | number;
  titleEn: string;
  titleHi?: string;
  groupEn?: string;
  groupHi?: string;
  size?: string;
  date?: string;
  fileUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  isArchived?: boolean;
}

interface PolicyPageTemplateProps {
  categoryTitleEn?: string;
  categoryTitleHi?: string;
  pageTitleEn: string;
  pageTitleHi?: string;
  subtitleEn?: string;
  subtitleHi?: string;
  apiSlug?: string;
  items?: ResourceDocumentItem[];
  customTopContent?: React.ReactNode;
}

export default function PolicyPageTemplate({
  categoryTitleEn = 'Resources',
  categoryTitleHi = 'संसाधन',
  pageTitleEn,
  pageTitleHi,
  subtitleEn,
  subtitleHi,
  apiSlug,
  items: initialItems = [],
  customTopContent
}: PolicyPageTemplateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [showArchived, setShowArchived] = useState(false);
  const [isArchiveActive, setIsArchiveActive] = useState(false);
  const [liveItems, setLiveItems] = useState<ResourceDocumentItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(apiSlug));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(initialItems.length);

  useEffect(() => {
    if (!apiSlug) {
      setLiveItems(initialItems);
      setTotalCount(initialItems.length);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const sortMap: Record<string, string> = {
      newest: 'newest',
      oldest: 'oldest',
      title: 'title_asc'
    };

    api.getResources(apiSlug, {
      query: searchQuery.trim() || undefined,
      sort_by: sortMap[sortOrder] || 'newest',
      page: currentPage,
      page_size: 50
    })
      .then((res) => {
        if (!isMounted) return;
        if (res && res.items && res.items.length > 0) {
          const mapped: ResourceDocumentItem[] = res.items.map((it: any) => ({
            id: it.id,
            titleEn: it.title || it.titleEn || 'Document',
            titleHi: it.titleHi,
            groupEn: it.category || it.groupEn,
            groupHi: it.groupHi,
            size: it.fileSize || it.size || '1.2 MB',
            date: it.date || it.year || '',
            fileUrl: it.fileUrl,
            imageUrl: it.imageUrl,
            videoUrl: it.videoUrl,
            isArchived: it.isArchived || false,
          }));
          setLiveItems(mapped);
          setTotalCount(res.total || mapped.length);
        } else if (res && res.items && res.items.length === 0 && searchQuery.trim()) {
          setLiveItems([]);
          setTotalCount(0);
        } else {
          // Fallback to initial items if API returned empty
          setLiveItems(initialItems);
          setTotalCount(initialItems.length);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLiveItems(initialItems);
        setTotalCount(initialItems.length);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [apiSlug, searchQuery, sortOrder, currentPage, initialItems]);

  const displayedItems = useMemo(() => {
    // If apiSlug is present, sorting/filtering is already applied server-side; we just filter archived if needed
    if (apiSlug) {
      return liveItems.filter((item) => {
        if (!showArchived && item.isArchived) return false;
        if (showArchived && !item.isArchived) return false;
        return true;
      });
    }

    return liveItems
      .filter((item) => {
        if (!showArchived && item.isArchived) return false;
        if (showArchived && !item.isArchived) return false;
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        const titleEn = (item.titleEn || '').toLowerCase();
        const titleHi = (item.titleHi || '').toLowerCase();
        const groupEn = (item.groupEn || '').toLowerCase();
        const groupHi = (item.groupHi || '').toLowerCase();

        return (
          titleEn.includes(q) ||
          titleHi.includes(q) ||
          groupEn.includes(q) ||
          groupHi.includes(q)
        );
      })
      .sort((a, b) => {
        if (sortOrder === 'title') {
          return a.titleEn.localeCompare(b.titleEn);
        }
        if (sortOrder === 'oldest') {
          return (a.date || '').localeCompare(b.date || '');
        }
        return (b.date || '').localeCompare(a.date || '');
      });
  }, [liveItems, apiSlug, searchQuery, sortOrder, showArchived]);

  return (
    <ResourcesLayout
      categoryTitle={categoryTitleEn}
      categoryTitleHi={categoryTitleHi}
      pageTitle={pageTitleEn}
      pageTitleHi={pageTitleHi}
    >
      <div className="w-full flex flex-col gap-6">
        
        {/* Hero Header Banner (972px × 142px in Figma) */}
        <div 
          className="relative w-full h-[142px] rounded-[8px] overflow-hidden flex items-center px-8 shadow-sm"
          style={{
            background: 'linear-gradient(108deg, #751639 0%, #8b1e46 55%, #59102b 100%)'
          }}
        >
          {/* Subtle Background Pattern Geometry */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pattern)" />
            </svg>
          </div>

          {/* Right White Diagonal Shape (Figma Vector 633) */}
          <div 
            className="absolute -right-16 top-0 bottom-0 w-[300px] bg-white/10 skew-x-[-24deg] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h1 className="text-[24px] md:text-[28px] font-bold leading-[38px] text-[#FFFFFF] tracking-tight">
              {pageTitleEn}
            </h1>
            {pageTitleHi && (
              <p className="text-[14px] font-medium text-white/80 mt-1">
                {pageTitleHi}
              </p>
            )}
          </div>
        </div>

        {/* Custom Top Content (e.g. Subtitles or Info) */}
        {subtitleEn && (
          <div className="text-[14px] font-medium leading-[24px] text-[#751639] -mt-2">
            {subtitleEn}
          </div>
        )}

        {customTopContent}

        {/* Action Bar (Archive, Search, Sort By) */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-2 border-b border-[#EAEAEA]">
          
          {/* Left: Archive Button + Vertical Divider */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setShowArchived(!showArchived);
                setIsArchiveActive(!isArchiveActive);
              }}
              className={`h-[36px] px-3.5 flex items-center gap-2 rounded-[4px] text-[12px] font-medium transition-all ${
                isArchiveActive
                  ? 'bg-[#520f27] text-white ring-2 ring-[#751639]'
                  : 'bg-[#751639] text-white hover:bg-[#8b1e46]'
              }`}
              title={showArchived ? 'View Active Documents' : 'View Archived Documents'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V5H2V3.5Z" stroke="#FFFFFF" strokeWidth="1.2"/>
                <path d="M3 5V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V5" stroke="#FFFFFF" strokeWidth="1.2"/>
                <path d="M6.5 8H9.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>{showArchived ? 'Active Files' : 'Archive'}</span>
            </button>

            <div className="hidden sm:block h-[28px] w-0 border-r border-[#8E8E93]" aria-hidden="true" />
          </div>

          {/* Right: Search Input + Sort By Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[280px] md:w-[350px]">
              <input
                type="search"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[40px] pl-4 pr-10 bg-white border border-[#4D4D4D] rounded-[8px] text-[14px] text-[#2A2A2A] placeholder-[#717171] focus:outline-none focus:ring-1 focus:ring-[#751639] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#4D4D4D]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7" cy="7" r="5" stroke="#4D4D4D" strokeWidth="1.3"/>
                  <path d="M10.5 10.5L14 14" stroke="#4D4D4D" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#717171] whitespace-nowrap">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="h-[36px] px-3 bg-white border border-[#E5E5EA] rounded-[4px] text-[13px] text-[#2A2A2A] font-medium focus:outline-none focus:border-[#751639]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

        </div>

        {/* Results Count & Active Filter Indicator */}
        <div className="flex items-center justify-between text-[12px] text-zinc-500">
          <span>
            Showing <strong className="text-[#751639]">{displayedItems.length}</strong> of{' '}
            <strong className="text-[#751639]">{totalCount}</strong> {totalCount === 1 ? 'document' : 'documents'}
            {showArchived && ' (Archived)'}
          </span>
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-[#751639] hover:underline font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="w-full py-8 flex items-center justify-center gap-3 text-[#751639]">
            <div className="w-5 h-5 border-2 border-[#751639] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Fetching documents...</span>
          </div>
        )}

        {/* Document Cards List (Figma 930px × 56px Card) */}
        {!isLoading && (
          <div className="w-full flex flex-col gap-3">
            {displayedItems.length === 0 ? (
              <div className="w-full py-12 px-6 text-center bg-[#FAFAFA] border border-dashed border-zinc-300 rounded-[8px]">
                <p className="text-[15px] font-semibold text-[#2A2A2A]">No documents found</p>
                <p className="text-[13px] text-zinc-500 mt-1">
                  {searchQuery ? 'Try adjusting your search terms.' : 'No policy records currently in this section.'}
                </p>
              </div>
            ) : (
              displayedItems.map((doc) => (
                <div
                  key={doc.id}
                  className="w-full min-h-[56px] py-2.5 px-4 bg-[#FAFAFA] border-l-[3px] border-[#751639] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:bg-[#F2F2F2] transition-colors"
                >
                  {/* Left Title & Group/Meta */}
                  <div className="flex flex-col gap-0.5 flex-1 pr-4">
                    <h3 className="text-[14px] font-semibold leading-[19px] text-[#000000]">
                      {doc.titleEn}
                    </h3>
                    {doc.titleHi && (
                      <p className="text-[12px] font-normal text-zinc-600">
                        {doc.titleHi}
                      </p>
                    )}
                    {doc.groupEn && (
                      <p className="text-[12px] font-normal leading-[16px] text-[#565656]">
                        {doc.groupEn} {doc.date ? `• ${doc.date}` : ''}
                      </p>
                    )}
                  </div>

                  {/* Right Actions (PDF / Video / Image) */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {doc.videoUrl ? (
                      <a
                        href={doc.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#751639] text-white text-xs font-semibold rounded hover:bg-[#8b1e46] transition-colors"
                      >
                        Watch Video
                      </a>
                    ) : doc.imageUrl && !doc.fileUrl?.endsWith('.pdf') ? (
                      <a
                        href={doc.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#751639] text-white text-xs font-semibold rounded hover:bg-[#8b1e46] transition-colors"
                      >
                        View Photo
                      </a>
                    ) : (
                      <>
                        <div className="w-[27px] h-[32px] flex items-center justify-center shrink-0">
                          <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="26" height="30" rx="3" fill="#D92D20"/>
                            <path d="M17 0L26 9H17V0Z" fill="#B42318"/>
                            <text x="3" y="21" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
                          </svg>
                        </div>
                        <div className="flex flex-col items-start leading-tight">
                          <span className="text-[10px] font-normal text-[#565656]">
                            {doc.size || '1.20 MB'}
                          </span>
                          <a
                            href={doc.fileUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] font-medium text-[#0D61AE] hover:underline"
                          >
                            View PDF
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </ResourcesLayout>
  );
}
