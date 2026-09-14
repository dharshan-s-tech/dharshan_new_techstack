'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';
import { getApiBaseUrl } from '@/lib/api';
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

interface VolumeItem {
  title: string;
  size: string;
  href: string;
}

interface AccordionYearItem {
  year: string;
  numericYear: number;
  volumes: VolumeItem[];
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
    loading: 'Loading accounts data...',
    noDocuments: 'No account documents found for the selected criteria.',
    disclaimer: 'The data contained in the PDF version of the Finance Accounts and Appropriation Accounts shall be treated as final in case of any discrepancy in the data.',
    disclaimerLabel: 'Disclaimer:',
    close: 'Close',
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
    loading: 'खाता डेटा लोड हो रहा है...',
    noDocuments: 'चयनित मानदंडों के लिए कोई खाता दस्तावेज़ नहीं मिला।',
    disclaimer: 'डेटा में किसी भी विसंगति के मामले में वित्त लेखे और विनियोग लेखे के पीडीएफ संस्करण में निहित डेटा को अंतिम माना जाएगा।',
    disclaimerLabel: 'अस्वीकरण:',
    close: 'बंद करें',
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

// Curated template fallbacks matching Figma
const FALLBACK_FINANCE_YEARS: AccordionYearItem[] = [
  {
    year: '2024 - 25',
    numericYear: 2024,
    volumes: [
      { title: 'Finance Accounts Vol I', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'Finance Accounts Vol II', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  },
  {
    year: '2023 - 24',
    numericYear: 2023,
    volumes: [
      { title: 'Finance Accounts Vol I', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'Finance Accounts Vol II', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  },
  {
    year: '2022 - 23',
    numericYear: 2022,
    volumes: [
      { title: 'Finance Accounts Vol I', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'Finance Accounts Vol II', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  },
  {
    year: '2021 - 22',
    numericYear: 2021,
    volumes: [
      { title: 'Finance Accounts Vol I', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'Finance Accounts Vol II', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  }
];

const FALLBACK_ARCHIVED_FINANCE: AccordionYearItem[] = [
  {
    year: '2020-21',
    numericYear: 2020,
    volumes: [
      { title: 'Finance Accounts Vol I', size: '28.4 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'Finance Accounts Vol II', size: '27.9 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  },
  {
    year: '2019-20',
    numericYear: 2019,
    volumes: [
      { title: 'Finance Accounts Vol I', size: '26.1 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'Finance Accounts Vol II', size: '25.8 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  }
];

const FALLBACK_MONTHLY_YEARS: AccordionYearItem[] = [
  {
    year: '2026-27',
    numericYear: 2026,
    volumes: [
      { title: 'July, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'June, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'May, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'April, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  },
  {
    year: '2025-26',
    numericYear: 2025,
    volumes: [
      { title: 'March, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'February, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'January, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'December, 2025', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  },
  {
    year: '2024-25',
    numericYear: 2024,
    volumes: [
      { title: 'March, 2025', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'February, 2025', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'January, 2025', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: 'December, 2024', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ]
  }
];

function AccountsPageContent() {
  const API_URL = getApiBaseUrl();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string>('state-accounts');
  const [activeTab, setActiveTab] = useState<string>('finance');
  const [stateSearch, setStateSearch] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('Andhra Pradesh');
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [loading, setLoading] = useState<boolean>(false);

  // Live accounts state from DB / API
  const [rawStateAccounts, setRawStateAccounts] = useState<any[]>([]);
  const [rawCombinedAccounts, setRawCombinedAccounts] = useState<any[]>([]);

  // Accordion state
  const [expandedFinanceYears, setExpandedFinanceYears] = useState<string[]>(['2024 - 25', '2024-25']);
  const [expandedMonthlyYears, setExpandedMonthlyYears] = useState<string[]>(['2026-27', '2026 - 27']);
  const [expandedFaaaYears, setExpandedFaaaYears] = useState<string[]>([]);

  // Handle URL params initialization
  useEffect(() => {
    const cat = searchParams.get('category');
    const st = searchParams.get('state');
    const tab = searchParams.get('tab');
    if (cat) setCategory(cat);
    if (st) setSelectedState(st);
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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
      setExpandedFinanceYears(['2020 - 21', '2020-21']);
      setExpandedMonthlyYears(['2020-21', '2020 - 21']);
      setExpandedFaaaYears([]);
    } else {
      setExpandedFinanceYears(['2024 - 25', '2024-25']);
      setExpandedMonthlyYears(['2026-27', '2026 - 27']);
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

  // List of states and territories
  const statesList: StateOption[] = useMemo(() => [
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
  ], []);

  const territoriesList: StateOption[] = useMemo(() => [
    { name: 'Puducherry', slug: 'puducherry' },
    { name: 'Jammu & Kashmir', slug: 'jammu-kashmir' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Ladakh', slug: 'ladakh' },
    { name: 'Chandigarh', slug: 'chandigarh' }
  ], []);

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

  // Helper function to extract 4-digit start year
  const parseYearNumber = (yearStr: string): number => {
    const match = String(yearStr || '').match(/\d{4}/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Fetch Live State Accounts for selectedState
  const loadStateAccounts = useCallback(async () => {
    if (category !== 'state-accounts' && category !== 'territories-accounts') return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        state: selectedState,
        pageSize: '100',
        sort: 'year_desc'
      });
      const res = await fetch(`${API_URL}/api/state-accounts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.items || []);
        setRawStateAccounts(items);
      }
    } catch (err) {
      console.warn('Could not fetch state accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, category, selectedState]);

  // Fetch Live Combined Accounts
  const loadCombinedAccounts = useCallback(async () => {
    if (category !== 'combined-finance-revenue' && category !== 'annual-conference') return;
    setLoading(true);
    try {
      const catQuery = category === 'annual-conference' ? 'conference' : 'combined';
      const params = new URLSearchParams({
        category: catQuery,
        pageSize: '100',
        sort: 'year_desc'
      });
      const res = await fetch(`${API_URL}/api/combined-accounts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.items || []);
        setRawCombinedAccounts(items);
      }
    } catch (err) {
      console.warn('Could not fetch combined accounts:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, category]);

  useEffect(() => {
    loadStateAccounts();
  }, [loadStateAccounts]);

  useEffect(() => {
    loadCombinedAccounts();
  }, [loadCombinedAccounts]);

  // Listen for admin changes (stateAccountsChange, combinedAccountsChange, storage)
  useEffect(() => {
    const handleUpdate = () => {
      loadStateAccounts();
      loadCombinedAccounts();
    };
    window.addEventListener('stateAccountsChange', handleUpdate);
    window.addEventListener('combinedAccountsChange', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('stateAccountsChange', handleUpdate);
      window.removeEventListener('combinedAccountsChange', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadStateAccounts, loadCombinedAccounts]);

  // ==========================================
  // DYNAMIC GROUPING OF LIVE DATA
  // ==========================================

  // 1. Finance Accounts (Multi-volume Accordion Grouped by Year)
  const { activeFinanceData, archivedFinanceData } = useMemo(() => {
    const financeItems = rawStateAccounts.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const title = (item.title || item.title_en || '').toLowerCase();
      return cat.includes('finance') || title.includes('finance');
    });

    if (financeItems.length === 0) {
      return {
        activeFinanceData: FALLBACK_FINANCE_YEARS,
        archivedFinanceData: FALLBACK_ARCHIVED_FINANCE
      };
    }

    const yearMap = new Map<string, { year: string; numericYear: number; volumes: VolumeItem[] }>();

    financeItems.forEach(item => {
      const yr = (item.year || item.account_year || '2024 - 25').trim();
      const numYear = parseYearNumber(yr);
      const volTitle = item.title_en || item.title || 'Finance Accounts';
      const volSize = item.size || '34.7 MB';
      const volHref = item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf';

      if (!yearMap.has(yr)) {
        yearMap.set(yr, {
          year: yr,
          numericYear: numYear,
          volumes: []
        });
      }
      yearMap.get(yr)!.volumes.push({
        title: volTitle,
        size: volSize,
        href: volHref
      });
    });

    const allGrouped = Array.from(yearMap.values()).sort((a, b) => b.numericYear - a.numericYear);
    const active = allGrouped.filter(g => g.numericYear >= 2021);
    const archived = allGrouped.filter(g => g.numericYear < 2021);

    return {
      activeFinanceData: active.length > 0 ? active : allGrouped,
      archivedFinanceData: archived.length > 0 ? archived : FALLBACK_ARCHIVED_FINANCE
    };
  }, [rawStateAccounts]);

  // 2. Monthly Key Indicators (Multi-year Accordion Grouped by Year and Month)
  const { activeMonthlyData, archivedMonthlyData } = useMemo(() => {
    const monthlyItems = rawStateAccounts.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const title = (item.title || item.title_en || '').toLowerCase();
      return cat.includes('monthly') || title.includes('monthly') || cat.includes('mki');
    });

    if (monthlyItems.length === 0) {
      return {
        activeMonthlyData: FALLBACK_MONTHLY_YEARS,
        archivedMonthlyData: []
      };
    }

    const yearMap = new Map<string, { year: string; numericYear: number; volumes: VolumeItem[] }>();

    monthlyItems.forEach(item => {
      const yr = (item.year || item.account_year || '2026 - 27').trim();
      const numYear = parseYearNumber(yr);
      let volTitle = item.title_en || item.title || (item.month ? `${item.month}, ${yr}` : 'Monthly Key Indicators');
      const volSize = item.size || '34.7 MB';
      const volHref = item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf';

      if (!yearMap.has(yr)) {
        yearMap.set(yr, {
          year: yr,
          numericYear: numYear,
          volumes: []
        });
      }
      yearMap.get(yr)!.volumes.push({
        title: volTitle,
        size: volSize,
        href: volHref
      });
    });

    const allGrouped = Array.from(yearMap.values()).sort((a, b) => b.numericYear - a.numericYear);
    const active = allGrouped.filter(g => g.numericYear >= 2021);
    const archived = allGrouped.filter(g => g.numericYear < 2021);

    return {
      activeMonthlyData: active.length > 0 ? active : allGrouped,
      archivedMonthlyData: archived.length > 0 ? archived : []
    };
  }, [rawStateAccounts]);

  // 3. Flat Tab Documents: Glance, Appropriation, FA&AA, Combined, Conference
  const documentsByTab: Record<string, AccountDocument[]> = useMemo(() => {
    // Accounts at a Glance
    const glanceItems = rawStateAccounts.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const title = (item.title || item.title_en || '').toLowerCase();
      return cat.includes('glance') || title.includes('glance');
    }).map(item => ({
      year: item.year || item.account_year || item.title || '2024 - 25',
      size: item.size || '5.97 MB',
      href: item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf'
    }));

    // Appropriation Accounts
    const approxItems = rawStateAccounts.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const title = (item.title || item.title_en || '').toLowerCase();
      return cat.includes('appropriation') || title.includes('appropriation');
    }).map(item => ({
      year: item.year || item.account_year || item.title || '2024 - 25',
      size: item.size || '5.97 MB',
      href: item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf'
    }));

    // FA&AA Data
    const faaaItems = rawStateAccounts.filter(item => {
      const cat = (item.category_name || '').toLowerCase();
      const title = (item.title || item.title_en || '').toLowerCase();
      return cat.includes('fa') || cat.includes('fa&aa') || title.includes('fa&aa');
    }).map(item => ({
      year: item.year || item.account_year || item.title || '2024 - 25 FA&AA Report',
      size: item.size || '1.45 MB',
      href: item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf'
    }));

    // Combined Accounts
    const combinedDocs = rawCombinedAccounts.filter(item => {
      const title = (item.title || item.title_en || '').toLowerCase();
      return !title.includes('conference') && !title.includes('secretar');
    }).map(item => ({
      year: item.account_year ? `${item.title_en || item.title} (${item.account_year})` : (item.title_en || item.title || 'Combined Finance and Revenue Accounts'),
      size: item.size || '18.5 MB',
      href: item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf'
    }));

    // Conference Materials
    const confDocs = rawCombinedAccounts.filter(item => {
      const title = (item.title || item.title_en || '').toLowerCase();
      return title.includes('conference') || title.includes('secretar');
    }).map(item => ({
      year: item.account_year ? `${item.title_en || item.title} (${item.account_year})` : (item.title_en || item.title || 'Conference Material'),
      size: item.size || '4.5 MB',
      href: item.pdf_url || item.file_url || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf'
    }));

    return {
      glance: glanceItems.length > 0 ? glanceItems : [
        { year: '2024 - 25', size: '5.97 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2023 - 24', size: '1.33 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2022 - 23', size: '4.99 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2021 - 22', size: '4.86 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
      ],
      appropriation: approxItems.length > 0 ? approxItems : [
        { year: '2024 - 25', size: '5.97 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2023 - 24', size: '1.33 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2022 - 23', size: '4.99 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2021 - 22', size: '4.86 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
      ],
      'monthly-key-indicators': [],
      'faaa-data': faaaItems.length > 0 ? faaaItems : [
        { year: '2024 - 25 FA&AA Report', size: '1.45 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: '2023 - 24 FA&AA Report', size: '1.20 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
      ],
      combined: combinedDocs.length > 0 ? combinedDocs : [
        { year: 'Combined Finance and Revenue Accounts (2024 - 25)', size: '18.5 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: 'Combined Finance and Revenue Accounts (2023 - 24)', size: '17.2 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: 'Combined Finance and Revenue Accounts (2022 - 23)', size: '16.8 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
      ],
      conference: confDocs.length > 0 ? confDocs : [
        { year: 'Proceedings of 34th Conference of State Finance Secretaries (2024)', size: '4.5 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: 'Proceedings of 33rd Conference of State Finance Secretaries (2023)', size: '3.8 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
        { year: 'Proceedings of 32nd Conference of State Finance Secretaries (2022)', size: '4.1 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
      ]
    };
  }, [rawStateAccounts, rawCombinedAccounts]);

  const activeDocuments = useMemo(() => {
    const list = documentsByTab[activeTab] || [];
    if (!showArchive) {
      return list.filter(d => parseYearNumber(d.year) >= 2021 || parseYearNumber(d.year) === 0);
    }
    return list.filter(d => parseYearNumber(d.year) < 2021 && parseYearNumber(d.year) > 0);
  }, [activeTab, documentsByTab, showArchive]);

  // Current finance dataset considering archive mode & Hindi translation
  const currentFinanceData = useMemo(() => {
    const data = showArchive ? archivedFinanceData : activeFinanceData;
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
  }, [showArchive, activeFinanceData, archivedFinanceData, isHindi]);

  // Current monthly dataset considering archive mode & Hindi translation
  const currentMonthlyData = useMemo(() => {
    const data = showArchive ? archivedMonthlyData : activeMonthlyData;
    if (isHindi) {
      const monthMap: Record<string, string> = {
        January: 'जनवरी', February: 'फ़रवरी', March: 'मार्च', April: 'अप्रैल',
        May: 'मई', June: 'जून', July: 'जुलाई', August: 'अगस्त',
        September: 'सितंबर', October: 'अक्टूबर', November: 'नवंबर', December: 'दिसंबर'
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
  }, [showArchive, activeMonthlyData, archivedMonthlyData, isHindi]);

  const isAccordionTab = activeTab === 'finance' || activeTab === 'monthly-key-indicators';
  const accordionData = activeTab === 'monthly-key-indicators' ? currentMonthlyData : currentFinanceData;
  const expandedYears = activeTab === 'monthly-key-indicators' ? expandedMonthlyYears : expandedFinanceYears;
  const toggleAccordionYear = activeTab === 'monthly-key-indicators' ? toggleMonthlyYear : toggleFinanceYear;

  // FA&AA Data past years
  const faaaPastYears = useMemo(() => {
    const items = documentsByTab['faaa-data'] || [];
    if (items.length <= 1) {
      return [
        {
          year: '2023-24',
          volumes: [
            { title: '2023 - 2024 FA&AA Report', size: '1.20 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
          ]
        }
      ];
    }
    return items.slice(1).map(it => ({
      year: it.year,
      volumes: [{ title: it.year, size: it.size, href: it.href }]
    }));
  }, [documentsByTab]);

  // Drawer items for archive slide-over
  const archiveDrawerItems = useMemo(() => {
    if (rawCombinedAccounts.length > 0) {
      return rawCombinedAccounts.slice(0, 10).map(item => ({
        title: item.title_en || item.title || 'Archived Combined Account',
        size: item.size || '18.5 MB',
        href: item.pdf_url || item.file_url || '#'
      }));
    }
    return [
      { title: isHindi ? 'अप्रैल, 2026' : 'April, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: isHindi ? 'मई, 2026' : 'May, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: isHindi ? 'जून, 2026' : 'June, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' },
      { title: isHindi ? 'जुलाई, 2026' : 'July, 2026', size: '34.7 MB', href: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/download_audit_report/2026/CA-Report_23-24_Full-Book-06a6733a1bb3691.97966215.pdf' }
    ];
  }, [rawCombinedAccounts, isHindi]);

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

  // Handle PDF Download / Direct View
  const handlePdfClick = (e: React.MouseEvent, href: string, title: string) => {
    e.preventDefault();
    if (href && href !== '#' && href !== '') {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    alert(`Opening PDF document for ${title}...`);
  };

  return (
    <div className="w-full bg-white min-h-[600px]">
      <div
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '40px',
          paddingBottom: '64px',
          paddingLeft: '64px',
          paddingRight: '64px',
          boxSizing: 'border-box'
        }}
      >
        
        {/* Breadcrumbs: Home > Reports > Accounts > State Accounts (width: 297px, height: 16px, left: 64px, top: 160px, gap: 8px) */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '8px',
            height: '16px',
            marginBottom: '24px',
            fontFamily: "'Noto Sans', sans-serif"
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 400,
              color: '#565656',
              textDecoration: 'none'
            }}
            className="hover:underline"
          >
            {isHindi ? 'होम' : 'Home'}
          </Link>

          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <Link
            href="/Reports"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 400,
              color: '#565656',
              textDecoration: 'none'
            }}
            className="hover:underline"
          >
            {isHindi ? 'रिपोर्ट्स' : 'Reports'}
          </Link>

          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <Link
            href="/Reports/accounts"
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 400,
              color: '#565656',
              textDecoration: 'none'
            }}
            className="hover:underline"
          >
            {isHindi ? 'सरकारी खाते' : 'Accounts'}
          </Link>

          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <span
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: 600,
              color: '#2E2E31',
              whiteSpace: 'nowrap'
            }}
          >
            {category === 'state-accounts' ? text.stateAccounts :
              category === 'territories-accounts' ? text.territoriesAccounts :
                category === 'combined-finance-revenue' ? text.combinedFinance : text.annualConference}
          </span>
        </nav>

        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          
          {/* Left Column: Filters Sidebar (320px width, 24px padding) */}
          <aside
            style={{
              width: '320px',
              minWidth: '320px',
              maxWidth: '320px',
              background: '#FFFFFF',
              border: '1px solid #E6E6E6',
              borderRadius: '8px',
              padding: '24px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            {/* Heading: Filters */}
            <h2
              style={{
                fontFamily: "'Noto Sans', sans-serif",
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '27px',
                color: '#000000',
                margin: 0
              }}
            >
              {text.filters}
            </h2>

            {/* Line 1586: Width 272px, Height 0px, 1px solid #D7D7D7 */}
            <div
              data-name="Line 1586"
              style={{
                width: '272px',
                height: '0px',
                borderTop: '1px solid #D7D7D7',
                marginTop: '24px',
                marginBottom: '24px',
                boxSizing: 'border-box',
                flex: 'none',
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            />

            {/* Segmented Control [ Reports | Accounts ] */}
            <div
              data-name="Segment Control"
              style={{
                width: '272px',
                height: '32px',
                background: '#F5F4F7',
                border: '1px solid #EDEDED',
                borderRadius: '8px',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                marginBottom: '16px'
              }}
            >
              <Link
                href="/Reports"
                style={{
                  width: '134px',
                  height: '28px',
                  fontSize: '14px',
                  lineHeight: '19px',
                  fontWeight: 400,
                  color: '#565656',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontFamily: "'Noto Sans', sans-serif",
                  boxSizing: 'border-box'
                }}
                className="hover:text-black transition-all"
              >
                {text.reports}
              </Link>
              <button
                type="button"
                style={{
                  width: '134px',
                  height: '28px',
                  fontSize: '14px',
                  lineHeight: '19px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  background: '#751639',
                  borderRadius: '8px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 1px 10px 1px rgba(0, 0, 0, 0.03)',
                  cursor: 'default',
                  fontFamily: "'Noto Sans', sans-serif",
                  boxSizing: 'border-box'
                }}
              >
                {text.accounts}
              </button>
            </div>

            {/* Side Menu / Menus: Width 262px, Gap 16px */}
            <div
              data-name="Side Menu"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                width: '262px',
                boxSizing: 'border-box',
                marginBottom: '24px'
              }}
            >
              {[
                { id: 'state-accounts', label: text.stateAccounts },
                { id: 'territories-accounts', label: text.territoriesAccounts },
                { id: 'combined-finance-revenue', label: text.combinedFinance },
                { id: 'annual-conference', label: text.annualConference }
              ].map(item => {
                const isActive = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCategoryChange(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '8px 16px',
                      gap: '8px',
                      width: '100%',
                      background: isActive ? 'rgba(117, 22, 57, 0.08)' : '#FFFFFF',
                      borderRadius: '4px',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      transition: 'all 0.15s ease'
                    }}
                    className={isActive ? '' : 'hover:bg-gray-50'}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: isActive ? 700 : 600,
                        fontSize: isActive ? '16px' : '14px',
                        lineHeight: isActive ? '22px' : '19px',
                        color: isActive ? '#751639' : '#2A2A2A'
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* States / UTs Section: Width 262px, Gap 16px */}
            {showGeoList && (
              <div
                data-name="Side Menu - States"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '16px',
                  width: '262px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Heading: States / Union Territories */}
                <h3
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '22px',
                    color: '#000000',
                    margin: 0,
                    width: '262px'
                  }}
                >
                  {category === 'territories-accounts' ? text.territoriesLabel : text.statesLabel}
                </h3>

                {/* Line 1586: Width 262px, Height 0px, 1px solid #D7D7D7 */}
                <div
                  data-name="Line 1586"
                  style={{
                    width: '262px',
                    height: '0px',
                    borderTop: '1px solid #D7D7D7',
                    boxSizing: 'border-box',
                    flex: 'none',
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                />

                {/* Menus / Search & Items Container */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '16px',
                    width: '262px',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Search Input Box: Width 262px, Height 32px, Border #D7D7D7, Radius 4px */}
                  <div
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '4px 8px',
                      gap: '8px',
                      width: '262px',
                      height: '32px',
                      border: '1px solid #D7D7D7',
                      borderRadius: '4px',
                      background: '#FFFFFF'
                    }}
                  >
                    <input
                      type="text"
                      placeholder={text.searchPlaceholder}
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Noto Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '19px',
                        color: '#2A2A2A',
                        background: 'transparent',
                        padding: 0
                      }}
                    />
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                      <circle cx="6.5" cy="6.5" r="5" stroke="#4D4D4D" strokeWidth="1.2" />
                      <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="#4D4D4D" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Scrollable States / UTs List: Width 262px, Height 341px, Gap 16px */}
                  <div
                    className="states-list-scrollbar"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '16px',
                      width: '262px',
                      maxHeight: '341px',
                      overflowY: 'auto',
                      paddingRight: '6px',
                      boxSizing: 'border-box'
                    }}
                  >
                    {filteredGeo.map(geo => {
                      const isActive = selectedState === geo.name;
                      return (
                        <button
                          key={geo.slug}
                          type="button"
                          onClick={() => setSelectedState(geo.name)}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '8px 16px',
                            gap: '8px',
                            width: '100%',
                            minHeight: isActive ? '38px' : '35px',
                            background: isActive ? 'rgba(117, 22, 57, 0.08)' : '#FFFFFF',
                            borderRadius: '4px',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                            transition: 'all 0.15s ease'
                          }}
                          className={isActive ? '' : 'hover:bg-gray-50'}
                        >
                          <span
                            style={{
                              fontFamily: "'Noto Sans', sans-serif",
                              fontStyle: 'normal',
                              fontWeight: isActive ? 700 : 600,
                              fontSize: isActive ? '16px' : '14px',
                              lineHeight: isActive ? '22px' : '19px',
                              color: isActive ? '#751639' : '#2A2A2A'
                            }}
                          >
                            {geo.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Main Content Details Panel */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            
            {/* Dynamic Page Header */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-[22px] md:text-[24px] font-bold text-[#751639] m-0 leading-tight">
                {pageTitle}
              </h1>
              {loading && (
                <div className="text-xs text-gray-500 flex items-center gap-1.5 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-[#751639]"></div>
                  <span>{text.loading}</span>
                </div>
              )}
            </div>

            {/* Tabs & Archive Row */}
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e5e7eb] pt-1">
              <div className="flex flex-wrap items-center gap-1">
                {category === 'state-accounts' || category === 'territories-accounts' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('glance')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'glance' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.glance}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('appropriation')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'appropriation' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.appropriation}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('finance')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'finance' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.finance}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('monthly-key-indicators')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'monthly-key-indicators' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.monthly}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('faaa-data')}
                      className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'faaa-data' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {text.tabs.faaa}
                    </button>
                  </>
                ) : category === 'combined-finance-revenue' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('combined')}
                    className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'combined' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                  >
                    {text.tabs.combined}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('conference')}
                    className={`px-4 py-2 text-[12px] md:text-[13px] rounded-t-[6px] font-medium transition-all cursor-pointer ${activeTab === 'conference' ? 'bg-[#751639] text-white shadow-xs' : 'bg-transparent text-[#6b7280] hover:text-[#111827]'}`}
                  >
                    {text.tabs.conference}
                  </button>
                )}
              </div>

              {/* Single Archive Button on Right (width: 82px, height: 32px, padding: 8px, gap: 8px, bg: #751639, radius: 4px) */}
              <button
                type="button"
                onClick={() => setIsArchiveOpen(true)}
                data-name="Archive"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  gap: '8px',
                  width: '82px',
                  height: '32px',
                  background: '#751639',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  marginBottom: '4px',
                  transition: 'background 0.15s ease'
                }}
                className="hover:bg-[#60122e]"
                title={isHindi ? 'पुरालेख' : 'Archive'}
              >
                <img
                  src="/assets/4e13abbcaf959461c9a14f6751f87fdb1d16a88e.svg"
                  alt=""
                  style={{
                    width: '16px',
                    height: '16px',
                    flexShrink: 0,
                    display: 'block'
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isHindi ? 'पुरालेख' : 'Archive'}
                </span>
              </button>
            </div>

            {/* Documents Section */}
            {activeTab === 'faaa-data' ? (
              <div className="flex flex-col gap-3.5">
                {/* Card 1: Disclaimer & Current Year */}
                <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-6 shadow-xs">
                  <p className="text-[13px] md:text-[13.5px] text-[#4b5563] leading-relaxed m-0">
                    <strong className="font-bold text-[#111827]">{text.disclaimerLabel}</strong>{' '}
                    {text.disclaimer}
                  </p>
                  <div className="border-t border-[#e5e7eb] my-5"></div>
                  <div className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors">
                    <span className="font-bold text-[14px] text-[#111827]">
                      {documentsByTab['faaa-data']?.[0]?.year || (showArchive ? '2022 - 2023' : '2024 - 2025')}
                    </span>
                    <div className="flex items-center gap-3">
                      <PdfIcon className="w-6 h-7.5" />
                      <div className="flex flex-col text-right leading-tight">
                        <span className="text-[10px] text-[#6b7280]">
                          {documentsByTab['faaa-data']?.[0]?.size || '34.7 MB'}
                        </span>
                        <a
                          href={documentsByTab['faaa-data']?.[0]?.href || '#'}
                          onClick={(e) => handlePdfClick(e, documentsByTab['faaa-data']?.[0]?.href || '#', 'FA&AA Report')}
                          className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a] cursor-pointer"
                          style={{ color: '#0d61ae', textDecoration: 'underline' }}
                        >
                          {text.viewPdf}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 & Collapsed Past Years */}
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
                                    onClick={(e) => handlePdfClick(e, vol.href, vol.title)}
                                    className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a] cursor-pointer"
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
                {accordionData.length > 0 ? (
                  accordionData.map((item) => {
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
                                      onClick={(e) => handlePdfClick(e, vol.href, vol.title)}
                                      className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a] cursor-pointer"
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
                  })
                ) : (
                  <div className="bg-white border border-[#e6e6e6] rounded-[8px] p-8 text-center text-zinc-400 text-sm shadow-xs">
                    {text.noDocuments}
                  </div>
                )}
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
                            onClick={(e) => handlePdfClick(e, doc.href, doc.year)}
                            className="pdf-view-link text-[12px] text-[#0d61ae] underline font-medium hover:text-[#08437a] cursor-pointer"
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
                    {text.noDocuments}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Archive Slide-over Pop-up Drawer (Figma Frame 2147227411: width 600px, height 1081px, gap 616px, padding 24px) */}
      {isArchiveOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="archive-popup-title"
        >
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setIsArchiveOpen(false)}
          />

          {/* Pop-up Frame (Figma Frame 2147227411: width 600px, height 1081px, gap 616px, padding 24px, opacity 1, angle 0deg) */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              width: '600px',
              height: '1081px',
              background: '#FFFFFF',
              padding: '24px',
              gap: '616px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              opacity: 1,
              transform: 'rotate(0deg)',
              boxSizing: 'border-box',
              boxShadow: '-4px 0px 24px rgba(0, 0, 0, 0.15)',
              flexShrink: 0
            }}
          >
            {/* Top Section: Heading + Divider + PDFs (Archive: width 552px, height 358px, gap 24px) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '552px',
                height: '358px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                boxSizing: 'border-box'
              }}
            >
              {/* Heading Row */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px',
                  width: '552px',
                  height: '38px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  boxSizing: 'border-box'
                }}
              >
                {/* Archive Title */}
                <h2
                  id="archive-popup-title"
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '38px',
                    color: '#000000',
                    margin: 0
                  }}
                >
                  {isHindi ? 'पुरालेख' : 'Archive'}
                </h2>

                {/* Close Icon Button (Top Right) */}
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    gap: '8px',
                    width: '32px',
                    height: '32px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0
                  }}
                  className="hover:bg-gray-100 transition-colors"
                  aria-label="Close Archive Popup"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2L14 14M2 14L14 2" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Line 1614: Width 552px, Height 0px, 1px solid #D7D7D7 */}
              <div
                style={{
                  width: '552px',
                  height: '0px',
                  borderTop: '1px solid #D7D7D7',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  boxSizing: 'border-box'
                }}
              />

              {/* PDFs List: Width 552px, Height 272px, Gap 16px */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '16px',
                  width: '552px',
                  height: '272px',
                  flex: 'none',
                  order: 2,
                  flexGrow: 0,
                  boxSizing: 'border-box'
                }}
              >
                {archiveDrawerItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 16px',
                      gap: '4px',
                      width: '552px',
                      height: '56px',
                      minHeight: '56px',
                      background: '#FAFAFA',
                      borderLeft: '2px solid #751639',
                      borderRadius: '0px 4px 4px 0px',
                      flex: 'none',
                      order: idx,
                      flexGrow: 0
                    }}
                    className="hover:bg-[#F2F2F2] transition-colors"
                  >
                    {/* Document / Month Title */}
                    <span
                      style={{
                        fontFamily: "'Noto Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '19px',
                        color: '#000000',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '380px'
                      }}
                    >
                      {item.title}
                    </span>

                    {/* Right PDF Block (width: 87px, height: 40px) */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '8px',
                        width: '87px',
                        height: '40px',
                        flexShrink: 0
                      }}
                    >
                      {/* PDF Icon from assets */}
                      <img
                        src="/assets/Images/pdficon.svg"
                        alt="PDF"
                        style={{
                          width: '27px',
                          height: '32px',
                          flexShrink: 0,
                          display: 'block'
                        }}
                      />

                      {/* PDF Details (Size & View Link) */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '4px',
                          width: '52px',
                          height: '39px',
                          flexShrink: 0
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Noto Sans', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '10px',
                            lineHeight: '16px',
                            color: '#565656',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.size || '34.7 MB'}
                        </span>
                        <a
                          href={item.href || '#'}
                          onClick={(e) => handlePdfClick(e, item.href || '#', item.title)}
                          style={{
                            fontFamily: "'Noto Sans', sans-serif",
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '12px',
                            lineHeight: '19px',
                            textDecorationLine: 'underline',
                            color: '#0D61AE',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                          className="hover:text-[#08437a]"
                        >
                          {text.viewPdf}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Section: Divider + Close Button (Footer: width 552px, height 58px, gap 24px) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                padding: '0px',
                gap: '24px',
                width: '552px',
                height: '58px',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0,
                boxSizing: 'border-box'
              }}
            >
              {/* Line 1615: Width 552px, Height 0px, 1px solid #D7D7D7 */}
              <div
                style={{
                  width: '552px',
                  height: '0px',
                  borderTop: '1px solid #D7D7D7',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  boxSizing: 'border-box'
                }}
              />

              {/* Bottom Close Button (width: 49px, height: 34px, border: 1px solid #2A2A2A, radius: 4px) */}
              <button
                type="button"
                onClick={() => setIsArchiveOpen(false)}
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  gap: '8px',
                  width: '49px',
                  height: '34px',
                  border: '1px solid #2A2A2A',
                  borderRadius: '4px',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <span
                  style={{
                    fontFamily: "'Noto Sans', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#2A2A2A'
                  }}
                >
                  {text.close}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading Accounts Portal...</div>}>
      <AccountsPageContent />
    </Suspense>
  );
}
