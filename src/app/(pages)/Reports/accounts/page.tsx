'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import pdfDocIcon from '@/app/Assets/Images/c4913da1b882a52fb7cb973a9d334b9abf2e253e.png';

interface StateOption {
  name: string;
  slug: string;
}

interface AccountDocument {
  year: string;
  size: string;
  href: string;
}

const LOCAL_DICTS = {
  English: {
    filters: 'Filters',
    reports: 'Reports',
    accounts: 'Accounts',
    stateAccounts: 'State Accounts',
    territoriesAccounts: 'Territories Accounts',
    combinedFinance: 'Combined Finance and Revenue Accounts',
    annualConference: 'Annual Conference of State Finance Secretaries',
    statesLabel: 'States',
    territoriesLabel: 'Union Territories',
    searchPlaceholder: 'Search',
    archive: 'Archive',
    viewPdf: 'View PDF',
    tabs: {
      glance: 'Accounts at a Glance',
      appropriation: 'Appropriation Accounts',
      finance: 'Finance Accounts',
      monthly: 'Monthly Key Indicators',
      faaa: 'FA&AA Data',
      combined: 'Combined Accounts',
      conference: 'Conference Materials'
    }
  },
  'हिन्दी': {
    filters: 'फ़िल्टर',
    reports: 'ऑडिट रिपोर्ट',
    accounts: 'सरकारी खाते',
    stateAccounts: 'राज्य के सरकारी खाते',
    territoriesAccounts: 'संघ राज्य क्षेत्रों के खाते',
    combinedFinance: 'संयुक्त वित्त और राजस्व खाते',
    annualConference: 'राज्य वित्त सचिवों का वार्षिक सम्मेलन',
    statesLabel: 'राज्य',
    territoriesLabel: 'संघ राज्य क्षेत्र',
    searchPlaceholder: 'खोजें',
    archive: 'पुरालेख',
    viewPdf: 'पीडीएफ देखें',
    tabs: {
      glance: 'एक नज़र में खाते',
      appropriation: 'विनियोग खाते',
      finance: 'वित्त खाते',
      monthly: 'मासिक मुख्य संकेतक',
      faaa: 'एफए और एए डेटा',
      combined: 'संयुक्त खाते',
      conference: 'सम्मेलन सामग्री'
    }
  }
};

export default function AccountsPage() {
  const [segment, setSegment] = useState<'reports' | 'accounts'>('accounts');
  const [category, setCategory] = useState<string>('state-accounts');
  const [activeTab, setActiveTab] = useState<string>('glance');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('Andhra Pradesh');
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';
  const text = LOCAL_DICTS[lang] || LOCAL_DICTS.English;

  const statesList: StateOption[] = [
    { name: 'Andhra Pradesh', slug: 'andhra-pradesh' },
    { name: 'Arunachal Pradesh', slug: 'arunachal-pradesh' },
    { name: 'Assam', slug: 'assam' },
    { name: 'Bihar', slug: 'bihar' },
    { name: 'Chhattisgarh', slug: 'chhattisgarh' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Goa', slug: 'goa' },
    { name: 'Gujarat', slug: 'gujarat' },
    { name: 'Haryana', slug: 'haryana' },
    { name: 'Himachal Pradesh', slug: 'himachal-pradesh' },
    { name: 'Jharkhand', slug: 'jharkhand' },
    { name: 'Karnataka', slug: 'karnataka' },
    { name: 'Kerala', slug: 'kerala' },
    { name: 'Madhya Pradesh', slug: 'madhya-pradesh' },
    { name: 'Maharashtra', slug: 'maharashtra' },
    { name: 'Manipur', slug: 'manipur' },
    { name: 'Meghalaya', slug: 'meghalaya' },
    { name: 'Mizoram', slug: 'mizoram' },
    { name: 'Nagaland', slug: 'nagaland' },
    { name: 'Odisha', slug: 'odisha' },
    { name: 'Punjab', slug: 'punjab' },
    { name: 'Rajasthan', slug: 'rajasthan' },
    { name: 'Sikkim', slug: 'sikkim' },
    { name: 'Tamil Nadu', slug: 'tamil-nadu' },
    { name: 'Telangana', slug: 'telangana' },
    { name: 'Tripura', slug: 'tripura' },
    { name: 'Uttar Pradesh', slug: 'uttar-pradesh' },
    { name: 'Uttarakhand', slug: 'uttarakhand' },
    { name: 'West Bengal', slug: 'west-bengal' }
  ];

  const territoriesList: StateOption[] = [
    { name: 'Puducherry', slug: 'puducherry' },
    { name: 'Jammu & Kashmir', slug: 'jammu-kashmir' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Ladakh', slug: 'ladakh' },
    { name: 'Chandigarh', slug: 'chandigarh' }
  ];

  const activeGeoList = category === 'territories-accounts' ? territoriesList : statesList;

  // Handle category change states cleanly
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setStateSearch('');
    if (newCat === 'state-accounts') {
      setSelectedState('Andhra Pradesh');
      setActiveTab('glance');
    } else if (newCat === 'territories-accounts') {
      setSelectedState('Puducherry');
      setActiveTab('glance');
    } else if (newCat === 'combined-finance-revenue') {
      setActiveTab('combined');
    } else if (newCat === 'annual-conference') {
      setActiveTab('conference');
    }
  };

  // Mock documents mapping based on selected tabs and category
  const documentsByTab: Record<string, AccountDocument[]> = {
    'glance': [
      { year: '2024 - 25', size: '5.97 MB', href: '#' },
      { year: '2023 - 24', size: '1.33 MB', href: '#' },
      { year: '2022 - 23', size: '4.99 MB', href: '#' },
      { year: '2021 - 22', size: '4.86 MB', href: '#' }
    ],
    'appropriation': [
      { year: '2024 - 25', size: '12.4 MB', href: '#' },
      { year: '2023 - 24', size: '11.8 MB', href: '#' },
      { year: '2022 - 23', size: '10.2 MB', href: '#' },
      { year: '2021 - 22', size: '9.85 MB', href: '#' }
    ],
    'finance': [
      { year: '2024 - 25', size: '24.1 MB', href: '#' },
      { year: '2023 - 24', size: '22.9 MB', href: '#' },
      { year: '2022 - 23', size: '21.0 MB', href: '#' },
      { year: '2021 - 22', size: '19.4 MB', href: '#' }
    ],
    'monthly-key-indicators': [
      { year: 'June 2026', size: '412 KB', href: '#' },
      { year: 'May 2026', size: '380 KB', href: '#' },
      { year: 'April 2026', size: '425 KB', href: '#' },
      { year: 'March 2026', size: '920 KB', href: '#' }
    ],
    'faaa-data': [
      { year: '2024 - 25 FA&AA Report', size: '1.45 MB', href: '#' },
      { year: '2023 - 24 FA&AA Report', size: '1.20 MB', href: '#' }
    ],
    'combined': [
      { year: 'Combined Finance and Revenue Accounts (2024 - 25)', size: '18.5 MB', href: '#' },
      { year: 'Combined Finance and Revenue Accounts (2023 - 24)', size: '17.2 MB', href: '#' },
      { year: 'Combined Finance and Revenue Accounts (2022 - 23)', size: '16.8 MB', href: '#' }
    ],
    'conference': [
      { year: 'Proceedings of 34th Conference of State Finance Secretaries (2024)', size: '4.5 MB', href: '#' },
      { year: 'Proceedings of 33rd Conference of State Finance Secretaries (2023)', size: '3.8 MB', href: '#' },
      { year: 'Proceedings of 32nd Conference of State Finance Secretaries (2022)', size: '4.1 MB', href: '#' }
    ]
  };

  // Mock archived documents mapping
  const archivedDocumentsByTab: Record<string, AccountDocument[]> = {
    'glance': [
      { year: '2020 - 21', size: '4.80 MB', href: '#' },
      { year: '2019 - 20', size: '5.12 MB', href: '#' },
      { year: '2018 - 19', size: '4.60 MB', href: '#' }
    ],
    'appropriation': [
      { year: '2020 - 21', size: '8.90 MB', href: '#' },
      { year: '2019 - 20', size: '9.15 MB', href: '#' },
      { year: '2018 - 19', size: '8.50 MB', href: '#' }
    ],
    'finance': [
      { year: '2020 - 21', size: '18.2 MB', href: '#' },
      { year: '2019 - 20', size: '17.5 MB', href: '#' },
      { year: '2018 - 19', size: '16.9 MB', href: '#' }
    ],
    'monthly-key-indicators': [
      { year: 'December 2025', size: '410 KB', href: '#' },
      { year: 'November 2025', size: '390 KB', href: '#' },
      { year: 'October 2025', size: '420 KB', href: '#' }
    ],
    'faaa-data': [
      { year: '2022 - 23 FA&AA Report', size: '1.15 MB', href: '#' },
      { year: '2021 - 22 FA&AA Report', size: '1.10 MB', href: '#' }
    ],
    'combined': [
      { year: 'Combined Finance and Revenue Accounts (2021 - 22)', size: '15.4 MB', href: '#' },
      { year: 'Combined Finance and Revenue Accounts (2020 - 21)', size: '14.8 MB', href: '#' }
    ],
    'conference': [
      { year: 'Proceedings of 31st Conference of State Finance Secretaries (2021)', size: '3.9 MB', href: '#' },
      { year: 'Proceedings of 30th Conference of State Finance Secretaries (2020)', size: '3.5 MB', href: '#' }
    ]
  };

  const activeDocuments = useMemo(() => {
    const targetSet = showArchive ? archivedDocumentsByTab : documentsByTab;
    return targetSet[activeTab] || [];
  }, [activeTab, showArchive]);

  const filteredGeo = useMemo(() => {
    return activeGeoList.filter(geo => 
      geo.name.toLowerCase().includes(stateSearch.toLowerCase())
    );
  }, [stateSearch, activeGeoList]);

  // Compute dynamic page title
  const pageTitle = useMemo(() => {
    if (category === 'state-accounts') {
      return `${text.stateAccounts} - ${selectedState}`;
    } else if (category === 'territories-accounts') {
      return `${text.territoriesAccounts} - ${selectedState}`;
    } else if (category === 'combined-finance-revenue') {
      return text.combinedFinance;
    } else if (category === 'annual-conference') {
      return text.annualConference;
    }
    return text.stateAccounts;
  }, [category, selectedState, text]);

  // Helper to construct dynamic state-specific document names based on activeTab
  const getDocLabel = (docYear: string) => {
    if (category === 'state-accounts' || category === 'territories-accounts') {
      if (activeTab === 'glance') return `${isHindi ? 'एक नज़र में खाते' : 'Accounts at a Glance'} (${selectedState}) ${docYear}`;
      if (activeTab === 'appropriation') return `${isHindi ? 'विनियोग खाते' : 'Appropriation Accounts'} (${selectedState}) ${docYear}`;
      if (activeTab === 'finance') return `${isHindi ? 'वित्त खाते' : 'Finance Accounts'} (${selectedState}) ${docYear}`;
      if (activeTab === 'monthly-key-indicators') return `${isHindi ? 'मासिक मुख्य संकेतक' : 'Monthly Key Indicators'} (${selectedState}) ${docYear}`;
      if (activeTab === 'faaa-data') return `${isHindi ? 'एफए और एए डेटा' : 'FA&AA Report'} (${selectedState}) ${docYear}`;
    }
    return docYear;
  };

  // Check if current category requires displaying the states/UT sidebar panel
  const showGeoList = category === 'state-accounts' || category === 'territories-accounts';

  return (
    <div className="accounts-page" data-node-id="127:10564" data-name="Accounts - State Accounts">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Breadcrumb" data-node-id="127:10976">
        <ol className="breadcrumbs__trail">
          <li>
            <Link href="/">{isHindi ? 'होम' : 'Home'}</Link>
          </li>
          <li className="breadcrumbs__sep" aria-hidden="true">
            <img src="/assets/41f2dfbdd898e5bcb3c45bf6f39d42c82e1d2286.svg" alt="" className="breadcrumbs__chevron" />
          </li>
          <li>
            <Link href="/Reports">{isHindi ? 'रिपोर्ट्स' : 'Reports'}</Link>
          </li>
          <li className="breadcrumbs__sep" aria-hidden="true">
            <img src="/assets/41f2dfbdd898e5bcb3c45bf6f39d42c82e1d2286.svg" alt="" className="breadcrumbs__chevron" />
          </li>
          <li>
            <span className="breadcrumbs__muted">{isHindi ? 'सरकारी खाते' : 'Accounts'}</span>
          </li>
          <li className="breadcrumbs__sep" aria-hidden="true">
            <img src="/assets/41f2dfbdd898e5bcb3c45bf6f39d42c82e1d2286.svg" alt="" className="breadcrumbs__chevron" />
          </li>
          <li className="breadcrumbs__current" aria-current="page">
            {category === 'state-accounts' ? text.stateAccounts : 
             category === 'territories-accounts' ? text.territoriesAccounts :
             category === 'combined-finance-revenue' ? text.combinedFinance : text.annualConference}
          </li>
        </ol>
      </nav>

      {/* Dynamic Page Header Title */}
      <h1 className="page-heading">{pageTitle}</h1>

      <div className="accounts-layout">
        {/* Sidebar Filters */}
        <aside className="filters-panel" data-node-id="269:25502" data-name="Side Menu">
          <div className="filters-panel__inner" data-node-id="269:25503">
            <h2 className="filters-panel__heading">{text.filters}</h2>
            <div className="filters-panel__divider"></div>

            {/* Reports/Accounts toggle segment */}
            <div className="segmented-control" role="group" aria-label="Reports or Accounts">
              <button 
                type="button" 
                className={`segmented-control__btn ${segment === 'reports' ? 'segmented-control__btn--active' : ''}`}
                onClick={() => {
                  setSegment('reports');
                  window.location.href = '/Reports';
                }}
                aria-pressed={segment === 'reports' ? 'true' : 'false'}
              >
                {text.reports}
              </button>
              <button 
                type="button" 
                className={`segmented-control__btn ${segment === 'accounts' ? 'segmented-control__btn--active' : ''}`}
                onClick={() => setSegment('accounts')}
                aria-pressed={segment === 'accounts' ? 'true' : 'false'}
              >
                {text.accounts}
              </button>
            </div>

            {/* Category list buttons changing layout state */}
            <div className="category-list" role="group" aria-label="Account category">
              <button 
                type="button" 
                className={`category-list__item ${category === 'state-accounts' ? 'category-list__item--active' : ''}`}
                onClick={() => handleCategoryChange('state-accounts')}
              >
                {text.stateAccounts}
              </button>
              <button 
                type="button" 
                className={`category-list__item ${category === 'territories-accounts' ? 'category-list__item--active' : ''}`}
                onClick={() => handleCategoryChange('territories-accounts')}
              >
                {text.territoriesAccounts}
              </button>
              <button 
                type="button" 
                className={`category-list__item ${category === 'combined-finance-revenue' ? 'category-list__item--active' : ''}`}
                onClick={() => handleCategoryChange('combined-finance-revenue')}
              >
                {text.combinedFinance}
              </button>
              <button 
                type="button" 
                className={`category-list__item ${category === 'annual-conference' ? 'category-list__item--active' : ''}`}
                onClick={() => handleCategoryChange('annual-conference')}
              >
                {text.annualConference}
              </button>
            </div>

            {/* Render Scrollable Geo-List dynamic search section only when applicable */}
            {showGeoList && (
              <div className="states-section">
                <h3 className="filters-panel__heading filters-panel__heading--sub">
                  {category === 'territories-accounts' ? text.territoriesLabel : text.statesLabel}
                </h3>
                <div className="filters-panel__divider filters-panel__divider--narrow"></div>

                <label className="states-search">
                  <input 
                    type="search" 
                    className="states-search__input" 
                    placeholder={text.searchPlaceholder} 
                    aria-label="Search items" 
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                  />
                  <img src="/assets/ef7eb7134dafeda4c8183619dad425b62c132784.svg" alt="" className="states-search__icon" />
                </label>

                <div className="states-list" id="states-list" role="group" aria-label="Geographical list items selector">
                  {filteredGeo.map((geo) => (
                    <button 
                      key={geo.slug}
                      type="button" 
                      className={`states-list__item ${selectedState === geo.name ? 'states-list__item--active' : ''}`}
                      onClick={() => setSelectedState(geo.name)}
                    >
                      {geo.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Content Details Panel */}
        <div className="accounts-content">
          <div className="content-header" data-node-id="127:10991">
            <div className="tab-row-wrap">
              <div className="tab-row" role="tablist" aria-label="Account document tabs">
                {category === 'state-accounts' || category === 'territories-accounts' ? (
                  <>
                    <button 
                      type="button" 
                      className={`tab ${activeTab === 'glance' ? 'tab--active' : ''}`}
                      onClick={() => setActiveTab('glance')}
                      role="tab"
                      aria-selected={activeTab === 'glance' ? 'true' : 'false'}
                    >
                      {text.tabs.glance}
                    </button>
                    <button 
                      type="button" 
                      className={`tab ${activeTab === 'appropriation' ? 'tab--active' : ''}`}
                      onClick={() => setActiveTab('appropriation')}
                      role="tab"
                      aria-selected={activeTab === 'appropriation' ? 'true' : 'false'}
                    >
                      {text.tabs.appropriation}
                    </button>
                    <button 
                      type="button" 
                      className={`tab ${activeTab === 'finance' ? 'tab--active' : ''}`}
                      onClick={() => setActiveTab('finance')}
                      role="tab"
                      aria-selected={activeTab === 'finance' ? 'true' : 'false'}
                    >
                      {text.tabs.finance}
                    </button>
                    <button 
                      type="button" 
                      className={`tab ${activeTab === 'monthly-key-indicators' ? 'tab--active' : ''}`}
                      onClick={() => setActiveTab('monthly-key-indicators')}
                      role="tab"
                      aria-selected={activeTab === 'monthly-key-indicators' ? 'true' : 'false'}
                    >
                      {text.tabs.monthly}
                    </button>
                    <button 
                      type="button" 
                      className={`tab ${activeTab === 'faaa-data' ? 'tab--active' : ''}`}
                      onClick={() => setActiveTab('faaa-data')}
                      role="tab"
                      aria-selected={activeTab === 'faaa-data' ? 'true' : 'false'}
                    >
                      {text.tabs.faaa}
                    </button>
                  </>
                ) : category === 'combined-finance-revenue' ? (
                  <button 
                    type="button" 
                    className={`tab ${activeTab === 'combined' ? 'tab--active' : ''}`}
                    onClick={() => setActiveTab('combined')}
                    role="tab"
                    aria-selected={activeTab === 'combined' ? 'true' : 'false'}
                  >
                    {text.tabs.combined}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className={`tab ${activeTab === 'conference' ? 'tab--active' : ''}`}
                    onClick={() => setActiveTab('conference')}
                    role="tab"
                    aria-selected={activeTab === 'conference' ? 'true' : 'false'}
                  >
                    {text.tabs.conference}
                  </button>
                )}
              </div>
            </div>

            <button 
              type="button" 
              className={`archive-btn ${showArchive ? 'archive-btn--active bg-[#5f122d]' : ''}`} 
              onClick={() => setShowArchive(!showArchive)}
              data-node-id="127:11004"
              aria-pressed={showArchive ? 'true' : 'false'}
            >
              <img src="/assets/4e13abbcaf959461c9a14f6751f87fdb1d16a88e.svg" alt="" className="archive-btn__icon" />
              <span>{isHindi ? (showArchive ? 'वर्तमान देखें' : 'पुरालेख देखें') : (showArchive ? 'Show Current' : 'Archive')}</span>
            </button>
          </div>

          {/* Years list card */}
          <div className="years-card" data-node-id="127:10623">
            {activeDocuments.length > 0 ? (
              <ul className="years-list">
                {activeDocuments.map((doc, idx) => (
                  <li key={idx} className="year-row">
                    <span className="year-row__label">{getDocLabel(doc.year)}</span>
                    <div className="year-row__meta">
                      <img src={pdfDocIcon.src} alt="PDF document icon" className="year-row__icon" />
                      <div className="year-row__file">
                        <span className="year-row__size">{doc.size}</span>
                        <a className="year-row__link" href={doc.href}>{text.viewPdf}</a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-zinc-400 text-sm">
                No documents found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
