'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import FiltersSidemenu from '@/Reusable components/Side Menu/Filters_sidemenu/FiltersSidemenu';
import { dataManager, ReportItem, DEFAULT_REPORTS } from '@/lib/dataManager';
import { getApiBaseUrl } from '@/lib/api';
import ReportCard from '@/components/common/ReportCard';

const HINDI_TRANSLATIONS: Record<string, { title: string; tag: string; sector: string }> = {
  'rep-1': {
    title: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    tag: 'वित्त',
    sector: ''
  },
  'rep-2': {
    title: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    tag: 'विपणन',
    sector: 'वित्त | सूचना एवं संचार'
  },
  'rep-3': {
    title: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    tag: 'प्रौद्योगिकी',
    sector: 'वित्त'
  },
  'rep-4': {
    title: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    tag: 'वित्त',
    sector: 'वित्त'
  },
  'rep-5': {
    title: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    tag: 'विपणन',
    sector: 'वित्त'
  },
  'rep-6': {
    title: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    tag: 'प्रौद्योगिकी',
    sector: 'कर और शुल्क'
  },
  'rep-7': {
    title: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    tag: 'वित्त',
    sector: 'पर्यावरण और सतत विकास'
  },
  'rep-8': {
    title: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    tag: 'विपणन',
    sector: 'वित्त'
  },
  'rep-9': {
    title: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    tag: 'प्रौद्योगिकी',
    sector: 'वित्त'
  }
};

function formatReportDate(d?: string): string {
  if (!d) return 'Jun 4, 2026';
  if (/^[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/.test(d)) return d;
  try {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {
    // fallback
  }
  return d;
}

function formatTag(t?: string, index: number = 0): string {
  if (!t || t.toLowerCase() === 'audit') {
    return index % 3 === 1 ? 'Marketing' : index % 3 === 2 ? 'Technology' : 'Finance';
  }
  const clean = t.trim();
  if (clean.toLowerCase().includes('environment')) return 'Environment';
  if (clean.toLowerCase().includes('transport')) return 'Transport';
  if (clean.toLowerCase().includes('defence') || clean.toLowerCase().includes('defense')) return 'Defence';
  if (clean.toLowerCase().includes('tax')) return 'Tax';
  if (clean.toLowerCase().includes('tech') || clean.toLowerCase().includes('it ') || clean.toLowerCase().includes('information')) return 'Technology';
  if (clean.toLowerCase().includes('health')) return 'Health';
  if (clean.toLowerCase().includes('education')) return 'Education';
  if (clean.toLowerCase().includes('finance')) return 'Finance';
  if (clean.toLowerCase().includes('market')) return 'Marketing';
  if (clean.toLowerCase().includes('power') || clean.toLowerCase().includes('energy')) return 'Energy';
  if (clean.toLowerCase().includes('local')) return 'Local Bodies';
  if (clean.toLowerCase().includes('agri')) return 'Agriculture';
  if (clean.toLowerCase().includes('commerce') || clean.toLowerCase().includes('industry')) return 'Commerce';
  return clean.length > 14 ? clean.slice(0, 12) + '...' : clean;
}

function ReportsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query');
  const API_URL = getApiBaseUrl();

  const [segment, setSegment] = useState<'reports' | 'accounts'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'year_desc' | 'year_asc' | 'oldest' | 'title_asc' | 'title_desc'>('newest');

  // Sidebar criteria states
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['All']);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Pagination (3 columns x 3 rows = 9 cards per page per Figma)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Remote data state
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic filter taxonomy from CMS/DB
  const [filterSectors, setFilterSectors] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);

  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    if (urlQuery !== null) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  // Fetch filter options from backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reports/filters`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.sectors) && data.sectors.length > 0) {
            setFilterSectors(data.sectors);
          }
          if (Array.isArray(data.report_types) && data.report_types.length > 0) {
            setFilterTypes(data.report_types);
          }
        }
      } catch (err) {
        console.warn('Using local filter options fallback:', err);
      }
    };
    fetchFilters();
  }, [API_URL]);

  // Fetch reports from backend (with fallback)
  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      setLoading(true);

      // Live DB query
      try {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('pageSize', pageSize.toString());
        if (searchQuery) params.set('query', searchQuery);
        if (selectedYear) params.set('year', selectedYear);

        const levelParam = selectedLevels.filter(l => l !== 'All').join(',');
        if (levelParam) params.set('level', levelParam);

        const sectorParam = selectedSectors.filter(s => s !== 'All Sectors').join(',');
        if (sectorParam) params.set('sector', sectorParam);

        const typeParam = selectedTypes.filter(t => t !== 'All').join(',');
        if (typeParam) params.set('type', typeParam);

        params.set('language', lang === 'हिन्दी' ? 'hi' : 'en');
        params.set('sort', sortOrder);

        const res = await fetch(`${API_URL}/api/reports?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setReports(data.items || []);
            setTotalCount(data.total || 0);
            setTotalPages(data.total_pages || 1);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch from /api/reports, using local fallback:', err);
      }

      // Fallback
      if (isMounted) {
        const local = dataManager.getReports().filter(r => !r.id.startsWith('home-rep-'));
        let filtered = local;
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(r => 
            (r.title || '').toLowerCase().includes(q) ||
            (r.desc || '').toLowerCase().includes(q) ||
            (r.ministry || '').toLowerCase().includes(q) ||
            (r.sector || '').toLowerCase().includes(q) ||
            (r.tag || '').toLowerCase().includes(q)
          );
        }
        if (selectedYear) {
          filtered = filtered.filter(r => r.year === selectedYear || (r.date && r.date.includes(selectedYear)));
        }
        if (selectedLevels.length > 0 && !selectedLevels.includes('All')) {
          filtered = filtered.filter(r => 
            selectedLevels.some(l => (r.level || '').toLowerCase() === l.toLowerCase() || (r.level || '').toLowerCase().includes(l.toLowerCase()))
          );
        }
        if (selectedSectors.length > 0 && !selectedSectors.includes('All Sectors')) {
          filtered = filtered.filter(r => 
            selectedSectors.some(s => 
              (r.sector || '').toLowerCase().includes(s.toLowerCase()) ||
              (r.tag || '').toLowerCase().includes(s.toLowerCase())
            )
          );
        }
        if (selectedTypes.length > 0 && !selectedTypes.includes('All')) {
          filtered = filtered.filter(r => 
            selectedTypes.some(t => 
              (r.type || '').toLowerCase().includes(t.toLowerCase()) ||
              (r.type || '').toLowerCase() === t.toLowerCase()
            )
          );
        }

        const parseId = (val: any) => {
          const match = String(val || '').match(/\d+/g);
          return match ? parseInt(match.join(''), 10) : 0;
        };
        const parseYear = (val: any) => {
          const match = String(val || '').match(/\d{4}/);
          return match ? parseInt(match[0], 10) : 0;
        };

        if (sortOrder === 'newest') {
          filtered.sort((a, b) => parseId(b.id) - parseId(a.id));
        } else if (sortOrder === 'oldest') {
          filtered.sort((a, b) => parseId(a.id) - parseId(b.id));
        } else if (sortOrder === 'year_desc') {
          filtered.sort((a, b) => (parseYear(b.year || b.date) - parseYear(a.year || a.date)) || (parseId(b.id) - parseId(a.id)));
        } else if (sortOrder === 'year_asc') {
          filtered.sort((a, b) => (parseYear(a.year || a.date) - parseYear(b.year || b.date)) || (parseId(a.id) - parseId(b.id)));
        } else if (sortOrder === 'title_asc') {
          filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        } else if (sortOrder === 'title_desc') {
          filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        } else {
          filtered.sort((a, b) => parseId(b.id) - parseId(a.id));
        }

        setReports(filtered);
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
        setLoading(false);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
  }, [API_URL, currentPage, pageSize, searchQuery, selectedYear, selectedLevels, selectedSectors, selectedTypes, lang, sortOrder]);

  const isHindi = lang === 'हिन्दी';

  const toggleLevel = (lvl: string) => {
    setCurrentPage(1);
    if (lvl === 'All') {
      setSelectedLevels(prev => prev.includes('All') ? [] : ['All']);
      return;
    }
    setSelectedLevels(prev => {
      const next = prev.filter(item => item !== 'All');
      return next.includes(lvl) ? next.filter(item => item !== lvl) : [...next, lvl];
    });
  };

  const toggleSector = (sec: string) => {
    setCurrentPage(1);
    if (sec === 'All Sectors') {
      setSelectedSectors(prev => prev.includes('All Sectors') ? [] : ['All Sectors']);
      return;
    }
    setSelectedSectors(prev => {
      const next = prev.filter(item => item !== 'All Sectors');
      return next.includes(sec) ? next.filter(item => item !== sec) : [...next, sec];
    });
  };

  const toggleType = (tp: string) => {
    setCurrentPage(1);
    if (tp === 'All') {
      setSelectedTypes(prev => prev.includes('All') ? [] : ['All']);
      return;
    }
    setSelectedTypes(prev => {
      const next = prev.filter(item => item !== 'All');
      return next.includes(tp) ? next.filter(item => item !== tp) : [...next, tp];
    });
  };

  const clearAllFilters = () => {
    setSelectedLevels(['All']);
    setSelectedSectors([]);
    setSelectedTypes([]);
    setSelectedYear('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div
      className="reports-page"
      data-node-id="364:18601"
      data-name="Reports"
      style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        paddingTop: '48px',
        paddingBottom: '64px',
        paddingLeft: '64px',
        paddingRight: '64px',
        boxSizing: 'border-box'
      }}
    >
      <div className="reports-layout">
        {/* Left Column: Sidebar Card (FiltersSidemenu) */}
        <aside className="filters-panel">
          <FiltersSidemenu
            segment={segment}
            setSegment={setSegment}
            selectedYear={selectedYear}
            setSelectedYear={(y) => {
              setSelectedYear(y);
              setCurrentPage(1);
            }}
            clearAllFilters={clearAllFilters}
            selectedLevels={selectedLevels}
            toggleLevel={toggleLevel}
            selectedSectors={selectedSectors}
            toggleSector={toggleSector}
            selectedTypes={selectedTypes}
            toggleType={toggleType}
            isHindi={isHindi}
            sectorsList={filterSectors}
            typesList={filterTypes}
          />
        </aside>

        {/* Right Column: Main Content */}
        <div className="reports-main-content">
          {/* Top Title & Search Bar Row */}
          <div
            className="page-title-row"
            data-node-id="364:18645"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0px',
              width: '968px',
              height: '44px',
              top: '168px',
              left: '408px',
              boxSizing: 'border-box',
              flex: 'none',
              alignSelf: 'stretch',
              flexGrow: 0,
              opacity: 1,
              transform: 'rotate(0deg)'
            }}
          >
            {/* Reports */}
            <div
              className="page-title"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '6px',
                width: '99px',
                height: '44px',
                flex: 'none',
                order: 0,
                flexGrow: 0
              }}
            >
              <h1
                className="page-title__heading"
                style={{
                  margin: 0,
                  width: '61px',
                  height: '22px',
                  fontFamily: "'Noto Sans', sans-serif",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '22px',
                  color: '#000000',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {isHindi ? 'रिपोर्ट' : 'Reports'}
              </h1>
              <p
                className="page-title__count"
                style={{
                  margin: 0,
                  width: '99px',
                  height: '16px',
                  fontFamily: "'Noto Sans', sans-serif",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '16px',
                  color: '#7A7A7A',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                {loading
                  ? (isHindi ? 'खोज रहे हैं...' : 'Loading records...')
                  : (isHindi ? `${totalCount.toLocaleString()} परिणाम मिले` : `${totalCount.toLocaleString()} results found`)
                }
              </p>
            </div>

            {/* Search */}
            <div
              className="page-search"
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 24px',
                gap: '8px',
                width: '464px',
                height: '43px',
                background: '#FFFFFF',
                border: '1px solid #D7D7D7',
                borderRadius: '8px',
                flex: 'none',
                order: 1,
                flexGrow: 0
              }}
            >
              <label
                className="page-search__inner"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '10px',
                  width: '416px',
                  height: '19px',
                  boxSizing: 'border-box',
                  flex: 'none',
                  order: 0,
                  flexGrow: 1,
                  cursor: 'text'
                }}
              >
                <input
                  type="search"
                  className="page-search__input"
                  placeholder={isHindi ? 'कीवर्ड, रिपोर्ट संख्या, मंत्रालय द्वारा खोजें' : 'Search by keyword, report number, ministry'}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    width: '390px',
                    height: '19px',
                    fontFamily: "'Noto Sans', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '19px',
                    color: '#717171',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    padding: '0px',
                    margin: '0px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1
                  }}
                />
                <span
                  className="page-search__icon-wrap"
                  style={{
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    color: '#4D4D4D'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.815" cy="6.86" r="4.815" stroke="#4D4D4D" strokeWidth="1.2" />
                    <line x1="10.25" y1="10.45" x2="14.5" y2="14.5" stroke="#4D4D4D" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </span>
              </label>
            </div>
          </div>

          {/* 3-Column Reports Card Grid */}
          <section className="card-grid min-h-[400px]" aria-label="Report results">
            {loading ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                <div className="w-8 h-8 border-3 border-[#751639] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Fetching reports registry...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 font-medium col-span-3 bg-white rounded-xl border border-gray-200">
                <p className="text-base mb-2 font-bold text-gray-800">
                  {isHindi ? 'कोई रिपोर्ट फ़िल्टर से मेल नहीं खाती।' : 'No reports matching current search filters.'}
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-2 text-xs font-semibold px-4 py-2 bg-[#751639] text-white rounded hover:bg-[#5f122d] transition-colors"
                >
                  {isHindi ? 'सभी फ़िल्टर साफ़ करें' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              reports.map((report, index) => {
                const details = isHindi && HINDI_TRANSLATIONS[report.id] ? HINDI_TRANSLATIONS[report.id] : {
                  title: report.title,
                  tag: report.tag || report.sector || '',
                  sector: report.sector || ''
                };

                return (
                  <ReportCard
                    key={report.id || `rep-${index}`}
                    report={{
                      id: report.id,
                      title: details.title,
                      image: report.image,
                      tag: formatTag(details.tag, index),
                      date: formatReportDate(report.date || report.year),
                      sector: details.sector,
                      pdfUrl: report.pdfUrl || (report as any).pdf_url
                    }}
                    isHindi={isHindi}
                    fallbackImageIndex={index}
                  />
                );
              })
            )}
          </section>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 font-medium">
                Page <span className="font-bold text-gray-800">{currentPage}</span> of <span className="font-bold text-gray-800">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed bg-white text-gray-700 transition-colors"
                >
                  ← Previous
                </button>

                {/* Numbered Pill Quick Access */}
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-xs font-semibold rounded border transition-colors ${isCurrent
                          ? 'bg-[#751639] text-white border-[#751639]'
                          : 'border-gray-300 hover:bg-gray-50 bg-white text-gray-700'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 text-xs font-semibold rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed bg-white text-gray-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading Reports Portal...</div>}>
      <ReportsPageContent />
    </Suspense>
  );
}
