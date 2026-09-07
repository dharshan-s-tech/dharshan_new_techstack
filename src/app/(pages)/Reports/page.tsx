'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import FiltersSidemenu from '@/Reusable components/Side Menu/Filters_sidemenu/FiltersSidemenu';
import { dataManager, ReportItem, DEFAULT_REPORTS } from '@/lib/dataManager';

const HINDI_TRANSLATIONS: Record<string, { title: string; tag: string; sector: string }> = {
  'rep-1': {
    title: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    tag: 'वित्त',
    sector: 'वित्त'
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
    sector: 'कर एवं शुल्क'
  },
  'rep-7': {
    title: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    tag: 'वित्त',
    sector: 'पर्यावरण एवं सतत विकास'
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

function ReportsPageContent() {
  const [segment, setSegment] = useState<'reports' | 'accounts'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // Sidebar criteria states matching Figma defaults
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['All', 'Union', 'States', 'Local Bodies']);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Transport & Infrastructure']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get('query');

  const [allReports, setAllReports] = useState<ReportItem[]>(DEFAULT_REPORTS);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    if (urlQuery !== null) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cag_reports');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length < 12 || parsed.find(r => r.id === 'rep-1')?.image !== '/assets/7997faf6dec5f05fce3ccef2b5c1d1d3b1dfedb8.png' || !parsed.find((r: any) => r.id === 'rep-1')?.sector) {
          localStorage.removeItem('cag_reports');
        }
      }
    } catch {}

    const loadReports = () => setAllReports(dataManager.getReports());
    loadReports();
    setLang(dataManager.getLanguage());

    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('reportsChange', loadReports);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('reportsChange', loadReports);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const toggleLevel = (lvl: string) => {
    if (lvl === 'All') {
      if (selectedLevels.includes('All')) {
        setSelectedLevels([]);
      } else {
        setSelectedLevels(['All', 'Union', 'States', 'Local Bodies']);
      }
      return;
    }
    setSelectedLevels(prev => 
      prev.includes(lvl) ? prev.filter(item => item !== lvl && item !== 'All') : [...prev, lvl]
    );
  };

  const toggleSector = (sec: string) => {
    if (sec === 'All Sectors') {
      if (selectedSectors.includes('All Sectors')) {
        setSelectedSectors([]);
      } else {
        setSelectedSectors(['All Sectors', 'IT Audit', 'Finance', 'Tax and Duties', 'Transport & Infrastructure']);
      }
      return;
    }
    setSelectedSectors(prev =>
      prev.includes(sec) ? prev.filter(item => item !== sec && item !== 'All Sectors') : [...prev, sec]
    );
  };

  const toggleType = (tp: string) => {
    if (tp === 'All') {
      if (selectedTypes.includes('All')) {
        setSelectedTypes([]);
      } else {
        setSelectedTypes(['All', 'ADC Reports', 'Compliance', 'Financial']);
      }
      return;
    }
    setSelectedTypes(prev =>
      prev.includes(tp) ? prev.filter(item => item !== tp && item !== 'All') : [...prev, tp]
    );
  };

  const clearAllFilters = () => {
    setSelectedLevels([]);
    setSelectedSectors([]);
    setSelectedTypes([]);
    setSelectedYear('');
    setSearchQuery('');
  };

  // Always use the 9 Figma reference reports for the Reports listing
  const reportsOnly = useMemo(() => {
    return DEFAULT_REPORTS.filter(r => !r.id.startsWith('home-rep-'));
  }, []);

  const filteredReports = useMemo(() => {
    return reportsOnly.filter(report => {
      if (segment === 'accounts') return false;
      if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedYear && report.year !== selectedYear) return false;
      return true;
    });
  }, [reportsOnly, segment, searchQuery, selectedYear]);

  return (
    <div className="reports-page" data-node-id="364:18601" data-name="Reports">
      <div className="reports-layout">
        {/* Left Column: Sidebar Card (Flush top aligned) */}
        <aside className="filters-panel">
          <FiltersSidemenu
            segment={segment}
            setSegment={setSegment}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            clearAllFilters={clearAllFilters}
            selectedLevels={selectedLevels}
            toggleLevel={toggleLevel}
            selectedSectors={selectedSectors}
            toggleSector={toggleSector}
            selectedTypes={selectedTypes}
            toggleType={toggleType}
            isHindi={isHindi}
          />
        </aside>

        {/* Right Column: Main Content (Top Header Row + 3-Col Card Grid) */}
        <div className="reports-main-content">
          {/* Top Title & Search Bar Row */}
          <div className="page-title-row" data-node-id="364:18645">
            <div className="page-title">
              <h1 className="page-title__heading">{isHindi ? 'रिपोर्ट' : 'Reports'}</h1>
              <p className="page-title__count">
                {isHindi ? '430 परिणाम मिले' : '430 results found'}
              </p>
            </div>
            <div className="page-search">
              <label className="page-search__inner">
                <input 
                  type="search" 
                  className="page-search__input" 
                  placeholder={isHindi ? 'रिपोर्ट खोजें...' : 'Search by keyword, report number, ministry'} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="page-search__icon-wrap">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </label>
            </div>
          </div>

          {/* 3-Column Reports Card Grid */}
          <section className="card-grid" aria-label="Report results">
            {filteredReports.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 font-medium col-span-3">
                {isHindi ? 'कोई रिपोर्ट फ़िल्टर से मेल नहीं खाती।' : 'No reports matching search filters.'}
              </div>
            ) : (
              filteredReports.map((report) => {
                const details = isHindi && HINDI_TRANSLATIONS[report.id] ? HINDI_TRANSLATIONS[report.id] : {
                  title: report.title,
                  tag: report.tag,
                  sector: report.sector
                };

                return (
                  <article 
                    key={report.id} 
                    className="report-card cursor-pointer" 
                    data-node-id={report.id}
                    onClick={() => router.push(`/Reports/${report.id}`)}
                  >
                    <div className="report-card__banner">
                      <img src={report.image} alt={details.title} className="report-card__photo" />
                    </div>
                    <div className="report-card__body">
                      <div className="report-card__tag-row">
                        <span className="report-card__tag">{details.tag}</span>
                        <span className="report-card__date">{report.date}</span>
                      </div>
                      
                      <h3 className="report-card__title">
                        {details.title}
                      </h3>

                      <div className="report-card__cta" onClick={(e) => e.stopPropagation()}>
                        <img src="/assets/e48d21d03bf5d85f98dd2bf1b2a8c03db29e05e0.svg" alt="" className="report-card__download-icon" />
                        <span className="report-card__label">
                          {report.label || (isHindi ? 'पूरी रिपोर्ट डाउनलोड करें' : 'Download Full Report')}
                        </span>
                      </div>

                      <p className="report-card__sector">
                        <span className="report-card__sector-label">{isHindi ? 'क्षेत्र: ' : 'Sector: '}</span>
                        <span className="report-card__sector-val">{details.sector || report.sector || (isHindi ? 'वित्त' : 'Finance')}</span>
                      </p>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading Reports...</div>}>
      <ReportsPageContent />
    </Suspense>
  );
}
