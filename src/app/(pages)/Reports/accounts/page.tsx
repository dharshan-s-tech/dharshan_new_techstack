'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import PdfIcon from '@/components/common/PdfIcon';

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
  const [activeTab, setActiveTab] = useState<string>('finance');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('Andhra Pradesh');
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [expandedFinanceYears, setExpandedFinanceYears] = useState<string[]>(['2024 - 25']);
  const [expandedMonthlyYears, setExpandedMonthlyYears] = useState<string[]>(['2026-27']);
  const [expandedFaaaYears, setExpandedFaaaYears] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsArchiveOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFinanceYear = (year: string) => {
    setExpandedFinanceYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleMonthlyYear = (year: string) => {
    setExpandedMonthlyYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleFaaaYear = (year: string) => {
    setExpandedFaaaYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  useEffect(() => {
    if (showArchive) {
      setExpandedFinanceYears(['2020 - 21']);
      setExpandedMonthlyYears(['2020-21']);
      setExpandedFaaaYears([]);
    } else {
      setExpandedFinanceYears(['2024 - 25']);
      setExpandedMonthlyYears(['2026-27']);
      setExpandedFaaaYears([]);
    }
  }, [showArchive]);

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

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    setStateSearch('');
    if (newCat === 'state-accounts') {
      setSelectedState('Andhra Pradesh');
      setActiveTab('finance');
    } else if (newCat === 'territories-accounts') {
      setSelectedState('Puducherry');
      setActiveTab('finance');
    } else if (newCat === 'combined-finance-revenue') {
      setActiveTab('combined');
    } else if (newCat === 'annual-conference') {
      setActiveTab('conference');
    }
  };

  // Exactly matching documents and file sizes from Figma references
  const documentsByTab: Record<string, AccountDocument[]> = {
    'glance': [
      { year: '2024 - 25', size: '5.97 MB', href: '#' },
      { year: '2023 - 24', size: '1.33 MB', href: '#' },
      { year: '2022 - 23', size: '4.99 MB', href: '#' },
      { year: '2021 - 22', size: '4.86 MB', href: '#' }
    ],
    'appropriation': [
      { year: '2024 - 25', size: '5.97 MB', href: '#' },
      { year: '2023 - 24', size: '1.33 MB', href: '#' },
      { year: '2022 - 23', size: '4.99 MB', href: '#' },
      { year: '2021 - 22', size: '4.86 MB', href: '#' }
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

  // Multi-volume Accordion structure for Finance Accounts matching Figma
  const financeYearsData = [
    {
      year: '2024 - 25',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '34.7 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2023 - 24',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '34.7 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2022 - 23',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '34.7 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2021 - 22',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '34.7 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '34.7 MB', href: '#' }
      ]
    }
  ];

  const archivedFinanceYearsData = [
    {
      year: '2020-21',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '28.4 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '27.9 MB', href: '#' }
      ]
    },
    {
      year: '2019-20',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '26.1 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '25.8 MB', href: '#' }
      ]
    },
    {
      year: '2018-19',
      volumes: [
        { title: 'Finance Accounts Vol I', size: '24.5 MB', href: '#' },
        { title: 'Finance Accounts Vol II', size: '24.1 MB', href: '#' }
      ]
    }
  ];

  // Multi-year Accordion structure for Monthly Key Indicators matching Figma
  const monthlyYearsData = [
    {
      year: '2026-27',
      volumes: [
        { title: 'April, 2026', size: '34.7 MB', href: '#' },
        { title: 'May, 2026', size: '34.7 MB', href: '#' },
        { title: 'June, 2026', size: '34.7 MB', href: '#' },
        { title: 'July, 2026', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2025-26',
      volumes: [
        { title: 'March, 2026', size: '34.7 MB', href: '#' },
        { title: 'February, 2026', size: '34.7 MB', href: '#' },
        { title: 'January, 2026', size: '34.7 MB', href: '#' },
        { title: 'December, 2025', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2024-25',
      volumes: [
        { title: 'March, 2025', size: '34.7 MB', href: '#' },
        { title: 'February, 2025', size: '34.7 MB', href: '#' },
        { title: 'January, 2025', size: '34.7 MB', href: '#' },
        { title: 'December, 2024', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2023-24',
      volumes: [
        { title: 'March, 2024', size: '34.7 MB', href: '#' },
        { title: 'February, 2024', size: '34.7 MB', href: '#' },
        { title: 'January, 2024', size: '34.7 MB', href: '#' },
        { title: 'December, 2023', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2022-23',
      volumes: [
        { title: 'March, 2023', size: '34.7 MB', href: '#' },
        { title: 'February, 2023', size: '34.7 MB', href: '#' },
        { title: 'January, 2023', size: '34.7 MB', href: '#' },
        { title: 'December, 2022', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2021-22',
      volumes: [
        { title: 'March, 2022', size: '34.7 MB', href: '#' },
        { title: 'February, 2022', size: '34.7 MB', href: '#' },
        { title: 'January, 2022', size: '34.7 MB', href: '#' },
        { title: 'December, 2021', size: '34.7 MB', href: '#' }
      ]
    }
  ];

  const archivedMonthlyYearsData = [
    {
      year: '2020-21',
      volumes: [
        { title: 'March, 2021', size: '34.7 MB', href: '#' },
        { title: 'February, 2021', size: '34.7 MB', href: '#' },
        { title: 'January, 2021', size: '34.7 MB', href: '#' },
        { title: 'December, 2020', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2019-20',
      volumes: [
        { title: 'March, 2020', size: '34.7 MB', href: '#' },
        { title: 'February, 2020', size: '34.7 MB', href: '#' },
        { title: 'January, 2020', size: '34.7 MB', href: '#' },
        { title: 'December, 2019', size: '34.7 MB', href: '#' }
      ]
    },
    {
      year: '2018-19',
      volumes: [
        { title: 'March, 2019', size: '34.7 MB', href: '#' },
        { title: 'February, 2019', size: '34.7 MB', href: '#' },
        { title: 'January, 2019', size: '34.7 MB', href: '#' },
        { title: 'December, 2018', size: '34.7 MB', href: '#' }
      ]
    }
  ];

  const archivedDocumentsByTab: Record<string, AccountDocument[]> = {
    'glance': [
      { year: '2020 - 21', size: '4.80 MB', href: '#' },
      { year: '2019 - 20', size: '5.12 MB', href: '#' },
      { year: '2018 - 19', size: '4.60 MB', href: '#' }
    ],
    'appropriation': [
      { year: '2020 - 21', size: '5.20 MB', href: '#' },
      { year: '2019 - 20', size: '4.95 MB', href: '#' },
      { year: '2018 - 19', size: '4.70 MB', href: '#' }
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

  const currentFinanceData = useMemo(() => {
    const data = showArchive ? archivedFinanceYearsData : financeYearsData;
    if (isHindi) {
      return data.map(item => ({
        ...item,
        volumes: item.volumes.map(v => ({
          ...v,
          title: v.title.replace('Finance Accounts', 'वित्त खाते')
        }))
      }));
    }
    return data;
  }, [showArchive, isHindi]);

  const currentMonthlyData = useMemo(() => {
    const data = showArchive ? archivedMonthlyYearsData : monthlyYearsData;
    if (isHindi) {
      const monthMap: Record<string, string> = {
        'January': 'जनवरी', 'February': 'फ़रवरी', 'March': 'मार्च', 'April': 'अप्रैल',
        'May': 'मई', 'June': 'जून', 'July': 'जुलाई', 'August': 'अगस्त',
        'September': 'सितंबर', 'October': 'अक्टूबर', 'November': 'नवंबर', 'December': 'दिसंबर'
      };
      return data.map(item => ({
        ...item,
        volumes: item.volumes.map(v => {
          let title = v.title;
          Object.entries(monthMap).forEach(([en, hi]) => {
            title = title.replace(en, hi);
          });
          return { ...v, title };
        })
      }));
    }
    return data;
  }, [showArchive, isHindi]);

  const isAccordionTab = activeTab === 'finance' || activeTab === 'monthly-key-indicators';
  const accordionData = activeTab === 'monthly-key-indicators' ? currentMonthlyData : currentFinanceData;
  const expandedYears = activeTab === 'monthly-key-indicators' ? expandedMonthlyYears : expandedFinanceYears;
  const toggleAccordionYear = activeTab === 'monthly-key-indicators' ? toggleMonthlyYear : toggleFinanceYear;

  const faaaPastYears = useMemo(() => {
    return showArchive ? [
      {
        year: '2021-22',
        volumes: [
          { title: '2021 - 2022', size: '34.7 MB', href: '#' }
        ]
      },
      {
        year: '2020-21',
        volumes: [
          { title: '2020 - 2021', size: '34.7 MB', href: '#' }
        ]
      }
    ] : [
      {
        year: '2023-24',
        volumes: [
          { title: '2023 - 2024', size: '34.7 MB', href: '#' }
        ]
      }
    ];
  }, [showArchive]);

  const archiveDrawerItems = useMemo(() => {
    return [
      { title: isHindi ? 'अप्रैल, 2026' : 'April, 2026', size: '34.7 MB', href: '#' },
      { title: isHindi ? 'मई, 2026' : 'May, 2026', size: '34.7 MB', href: '#' },
      { title: isHindi ? 'जून, 2026' : 'June, 2026', size: '34.7 MB', href: '#' },
      { title: isHindi ? 'जुलाई, 2026' : 'July, 2026', size: '34.7 MB', href: '#' }
    ];
  }, [isHindi]);

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

  const showGeoList = category === 'state-accounts' || category === 'territories-accounts';

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 font-sans">
        {/* Breadcrumb Trail matching Figma */}
        <nav className="flex items-center gap-2 text-[12px] text-[#565656] mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0a3d30] transition-colors">{isHindi ? 'होम' : 'Home'}</Link>
          <span className="text-[#888888] font-normal">&gt;</span>
          <Link href="/Reports" className="hover:text-[#0a3d30] transition-colors">{isHindi ? 'रिपोर्ट्स' : 'Reports'}</Link>
          <span className="text-[#888888] font-normal">&gt;</span>
          <span className="text-[#565656]">{isHindi ? 'सरकारी खाते' : 'Accounts'}</span>
          <span className="text-[#888888] font-normal">&gt;</span>
          <span className="font-semibold text-[#2a2a2a]">
            {category === 'state-accounts' ? text.stateAccounts : 
             category === 'territories-accounts' ? text.territoriesAccounts :
             category === 'combined-finance-revenue' ? text.combinedFinance : text.annualConference}
          </span>
        </nav>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          {/* Left Column: Filters Sidebar */}
          <aside className="w-full lg:w-[280px] xl:w-[290px] flex-shrink-0 bg-white border border-[#e6e6e6] rounded-[8px] p-5 shadow-xs">
            <h2 className="text-[18px] font-bold text-[#111827] m-0 mb-3">{text.filters}</h2>
            <div className="border-t border-[#e5e7eb] mb-4"></div>

            {/* Segmented Control */}
            <div className="flex bg-[#f5f4f7] border border-[#ededed] rounded-[8px] p-[3px] mb-4">
              <Link 
                href="/Reports" 
                className="flex-1 py-1.5 text-center text-[12px] font-medium text-[#565656] hover:text-black rounded-[6px] transition-colors"
              >
                {text.reports}
              </Link>
              <button 
                type="button" 
                className="flex-1 py-1.5 text-center text-[12px] font-semibold text-white bg-[#751639] rounded-[6px] shadow-xs cursor-default"
              >
                {text.accounts}
              </button>
            </div>

            {/* Category List */}
            <div className="flex flex-col gap-1 mb-5">
              <button 
                type="button"
                onClick={() => handleCategoryChange('state-accounts')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors ${category === 'state-accounts' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.stateAccounts}
              </button>
              <button 
                type="button"
                onClick={() => handleCategoryChange('territories-accounts')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors ${category === 'territories-accounts' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.territoriesAccounts}
              </button>
              <button 
                type="button"
                onClick={() => handleCategoryChange('combined-finance-revenue')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors ${category === 'combined-finance-revenue' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.combinedFinance}
              </button>
              <button 
                type="button"
                onClick={() => handleCategoryChange('annual-conference')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors ${category === 'annual-conference' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.annualConference}
              </button>
            </div>

            {/* States Section */}
            {showGeoList && (
              <div className="border-t border-[#e5e7eb] pt-4">
                <h3 className="text-[14px] font-bold text-[#111827] mb-2.5">
                  {category === 'territories-accounts' ? text.territoriesLabel : text.statesLabel}
                </h3>
                <div className="relative mb-3">
                  <input 
                    type="search"
                    placeholder={text.searchPlaceholder}
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    className="w-full text-[13px] border border-[#d1d5db] rounded-[4px] px-3 py-1.5 pr-8 focus:outline-none focus:border-[#751639]"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <div className="flex flex-col gap-0.5 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredGeo.map(geo => (
                    <button 
                      key={geo.slug}
                      type="button"
                      onClick={() => setSelectedState(geo.name)}
                      className={`w-full text-left px-3 py-1.5 text-[13px] rounded-[4px] transition-colors ${selectedState === geo.name ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
                    >
                      {geo.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Main Content Details Panel */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Title placed directly inside Right Column matching Figma! */}
            <h1 className="text-[22px] md:text-[24px] font-bold text-[#751639] m-0 leading-tight">
              {pageTitle}
            </h1>

            {/* Tabs & Archive Row */}
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e5e7eb] pt-1">
              <div className="flex flex-wrap items-center gap-1">
                {category === 'state-accounts' || category === 'territories-accounts' ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('glance')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'glance' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.glance}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('appropriation')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'appropriation' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.appropriation}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('finance')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'finance' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.finance}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('monthly-key-indicators')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'monthly-key-indicators' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.monthly}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('faaa-data')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'faaa-data' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.faaa}
                    </button>
                  </>
                ) : category === 'combined-finance-revenue' ? (
                  <button 
                    type="button"
                    onClick={() => setActiveTab('combined')}
                    className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'combined' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                  >
                    {text.tabs.combined}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setActiveTab('conference')}
                    className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all ${activeTab === 'conference' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                  >
                    {text.tabs.conference}
                  </button>
                )}
              </div>

              {/* Archive Button */}
              <button 
                type="button"
                onClick={() => setIsArchiveOpen(prev => !prev)}
                className="mb-1.5 flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-medium text-white bg-[#751639] hover:bg-[#60122e] transition-all"
              >
                <img src="/assets/4e13abbcaf959461c9a14f6751f87fdb1d16a88e.svg" alt="" className="w-3.5 h-3.5" />
                <span>{text.archive}</span>
              </button>
            </div>

            {/* Documents Section: FA&AA Data, Multi-volume Accordion, or Flat list */}
            {activeTab === 'faaa-data' ? (
              <div className="flex flex-col gap-3.5">
                {/* Card 1: Disclaimer & Current Year (2024 - 2025) matching Figma */}
                <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-6 shadow-xs">
                  <p className="text-[13px] md:text-[13.5px] text-[#4b5563] leading-relaxed m-0">
                    <strong className="font-bold text-[#111827]">{isHindi ? 'अस्वीकरण:' : 'Disclaimer:'}</strong>{' '}
                    {isHindi 
                      ? 'डेटा में किसी भी विसंगति के मामले में वित्त लेखे और विनियोग लेखे के पीडीएफ संस्करण में निहित डेटा को अंतिम माना जाएगा।'
                      : 'The data contained in the PDF version of the Finance Accounts and Appropriation Accounts shall be treated as final in case of any discrepancy in the data.'}
                  </p>
                  <div className="border-t border-[#e5e7eb] my-5"></div>
                  <div className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors">
                    <span className="font-bold text-[14px] text-[#111827]">
                      {showArchive ? '2022 - 2023' : '2024 - 2025'}
                    </span>
                    <div className="flex items-center gap-3">
                      <PdfIcon className="w-6 h-7.5" />
                      <div className="flex flex-col text-right leading-tight">
                        <span className="text-[10px] text-[#6b7280]">34.7 MB</span>
                        <a 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Opening PDF for ${showArchive ? '2022 - 2023' : '2024 - 2025'} FA&AA Data...`);
                          }}
                          className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a]"
                          style={{ color: '#0d61ae', textDecoration: 'underline' }}
                        >
                          {text.viewPdf}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 & Collapsed Past Years: e.g. 2023-24 */}
                {faaaPastYears.map((item) => {
                  const isExpanded = expandedFaaaYears.includes(item.year);
                  return (
                    <div 
                      key={item.year}
                      className="bg-white border border-[#e6e6e6] rounded-[8px] shadow-xs overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaaaYear(item.year)}
                        className={`w-full flex items-center justify-between px-6 text-left cursor-pointer hover:bg-gray-50/50 transition-colors select-none ${isExpanded ? 'pt-5 pb-3.5' : 'py-4.5'}`}
                        aria-expanded={isExpanded}
                      >
                        <span className="text-[15px] md:text-[16px] font-bold text-[#111827]">
                          {item.year}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-[#555555] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="1.75"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-1 flex flex-col gap-3">
                          {item.volumes.map((vol, vIdx) => (
                            <div 
                              key={vIdx}
                              className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors"
                            >
                              <span className="font-bold text-[14px] text-[#111827]">
                                {vol.title}
                              </span>
                              <div className="flex items-center gap-3">
                                <PdfIcon className="w-6 h-7.5" />
                                <div className="flex flex-col text-right leading-tight">
                                  <span className="text-[10px] text-[#6b7280]">{vol.size}</span>
                                  <a 
                                    href={vol.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      alert(`Opening PDF for ${vol.title}...`);
                                    }}
                                    className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a]"
                                    style={{ color: '#0d61ae', textDecoration: 'underline' }}
                                  >
                                    {text.viewPdf}
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : isAccordionTab ? (
              <div className="flex flex-col gap-3.5">
                {accordionData.map((item) => {
                  const isExpanded = expandedYears.includes(item.year);
                  return (
                    <div 
                      key={item.year}
                      className="bg-white border border-[#e6e6e6] rounded-[8px] shadow-xs overflow-hidden"
                    >
                      {/* Accordion Year Header */}
                      <button
                        type="button"
                        onClick={() => toggleAccordionYear(item.year)}
                        className={`w-full flex items-center justify-between px-6 text-left cursor-pointer hover:bg-gray-50/50 transition-colors select-none ${isExpanded ? 'pt-5 pb-3.5' : 'py-4.5'}`}
                        aria-expanded={isExpanded}
                      >
                        <span className="text-[15px] md:text-[16px] font-bold text-[#111827]">
                          {item.year}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-[#555555] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="1.75"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Accordion Content Volumes */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-1 flex flex-col gap-3">
                          {item.volumes.map((vol, vIdx) => (
                            <div 
                              key={vIdx}
                              className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors"
                            >
                              <span className="font-bold text-[14px] text-[#111827]">
                                {vol.title}
                              </span>
                              <div className="flex items-center gap-3">
                                <PdfIcon className="w-6 h-7.5" />
                                <div className="flex flex-col text-right leading-tight">
                                  <span className="text-[10px] text-[#6b7280]">{vol.size}</span>
                                  <a 
                                    href={vol.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      alert(`Opening PDF for ${vol.title}...`);
                                    }}
                                    className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a]"
                                    style={{ color: '#0d61ae', textDecoration: 'underline' }}
                                  >
                                    {text.viewPdf}
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-6 shadow-xs flex flex-col gap-3">
                {activeDocuments.length > 0 ? (
                  activeDocuments.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors"
                    >
                      <span className="font-bold text-[14px] text-[#111827]">
                        {doc.year}
                      </span>
                      <div className="flex items-center gap-3">
                        <PdfIcon className="w-6 h-7.5" />
                        <div className="flex flex-col text-right leading-tight">
                          <span className="text-[10px] text-[#6b7280]">{doc.size}</span>
                          <a 
                            href={doc.href}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Opening PDF for ${doc.year}...`);
                            }}
                            className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a]"
                            style={{ color: '#0d61ae', textDecoration: 'underline' }}
                          >
                            {text.viewPdf}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-zinc-400 text-sm">
                    No documents found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Archive Slide-over Drawer Modal matching Figma */}
      {isArchiveOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsArchiveOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-[430px] md:max-w-[450px] bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="px-7 pt-6 pb-4 flex items-center justify-between">
                <h2 className="text-[22px] font-bold text-[#111827] m-0">
                  {text.archive}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-1 transition-colors"
                  aria-label="Close archive drawer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content Documents List */}
              <div className="px-7 flex-1 overflow-y-auto flex flex-col gap-3.5 py-2 custom-scrollbar">
                {archiveDrawerItems.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors flex-shrink-0"
                  >
                    <span className="font-bold text-[14px] text-[#111827]">
                      {doc.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <PdfIcon className="w-6 h-7.5" />
                      <div className="flex flex-col text-right leading-tight">
                        <span className="text-[10px] text-[#6b7280]">{doc.size}</span>
                        <a 
                          href={doc.href}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Opening PDF for ${doc.title}...`);
                          }}
                          className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a]"
                          style={{ color: '#0d61ae', textDecoration: 'underline' }}
                        >
                          {text.viewPdf}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer with Divider and Close button */}
              <div className="px-7 py-5 border-t border-[#e5e7eb] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  className="px-3.5 py-1 text-[12px] font-normal text-[#333333] border border-[#777777] rounded-[4px] hover:bg-gray-50 transition-colors"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
