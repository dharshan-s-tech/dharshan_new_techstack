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
      { title: isHindi ? 'अप्रैल, 2020' : 'April, 2020', size: '34.7 MB', href: '#' },
      { title: isHindi ? 'मई, 2020' : 'May, 2020', size: '34.7 MB', href: '#' },
      { title: isHindi ? 'जून, 2020' : 'June, 2020', size: '34.7 MB', href: '#' },
      { title: isHindi ? 'जुलाई, 2020' : 'July, 2020', size: '34.7 MB', href: '#' }
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 font-sans">

        {/* Breadcrumb Trail */}
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
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors cursor-pointer ${category === 'state-accounts' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.stateAccounts}
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('territories-accounts')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors cursor-pointer ${category === 'territories-accounts' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.territoriesAccounts}
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('combined-finance-revenue')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors cursor-pointer ${category === 'combined-finance-revenue' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.combinedFinance}
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('annual-conference')}
                className={`w-full text-left px-3.5 py-2 text-[13px] rounded-[6px] font-medium transition-colors cursor-pointer ${category === 'annual-conference' ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
              >
                {text.annualConference}
              </button>
            </div>

            {/* States / UTs List */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex flex-col gap-0.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredGeo.map(geo => (
                    <button
                      key={geo.slug}
                      type="button"
                      onClick={() => setSelectedState(geo.name)}
                      className={`w-full text-left px-3 py-1.5 text-[13px] rounded-[4px] transition-colors cursor-pointer ${selectedState === geo.name ? 'bg-[#fdf2f4] text-[#751639] font-bold' : 'text-[#374151] hover:bg-gray-50'}`}
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

              {/* Archive Toggle Button */}
              <div className="flex items-center gap-2 mb-1.5">
                <button
                  type="button"
                  onClick={() => setShowArchive(prev => !prev)}
                  className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-all border cursor-pointer ${showArchive ? 'bg-[#751639] text-white border-[#751639]' : 'bg-white text-[#751639] border-[#751639] hover:bg-[#fdf2f4]'}`}
                >
                  {showArchive ? '← Active Accounts' : text.archive}
                </button>
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[12px] font-medium text-white bg-[#751639] hover:bg-[#60122e] transition-all cursor-pointer"
                  title="Open Archive Drawer"
                >
                  <img src="/assets/4e13abbcaf959461c9a14f6751f87fdb1d16a88e.svg" alt="" className="w-3.5 h-3.5" />
                  <span>Drawer</span>
                </button>
              </div>
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

      {/* Archive Slide-over Drawer Modal */}
      {isArchiveOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsArchiveOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-[430px] md:max-w-[450px] bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="px-7 pt-6 pb-4 flex items-center justify-between border-b border-[#e5e7eb]">
                <h2 className="text-[20px] font-bold text-[#751639] m-0">
                  {text.archive}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-1 transition-colors cursor-pointer"
                  aria-label="Close archive drawer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content Documents List */}
              <div className="px-7 flex-1 overflow-y-auto flex flex-col gap-3 py-4 custom-scrollbar">
                {archiveDrawerItems.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#fafafa] border-l-[3px] border-[#751639] px-5 py-3.5 h-[58px] rounded-r-[4px] hover:bg-[#f5f5f5] transition-colors flex-shrink-0"
                  >
                    <span className="font-bold text-[13px] text-[#111827] truncate max-w-[200px]" title={doc.title}>
                      {doc.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <PdfIcon className="w-6 h-7.5" />
                      <div className="flex flex-col text-right leading-tight">
                        <span className="text-[10px] text-[#6b7280]">{doc.size}</span>
                        <a
                          href={doc.href}
                          onClick={(e) => handlePdfClick(e, doc.href, doc.title)}
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

              {/* Drawer Footer with Divider and Close button */}
              <div className="px-7 py-5 border-t border-[#e5e7eb] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsArchiveOpen(false)}
                  className="px-4 py-1.5 text-[12px] font-medium text-white bg-[#751639] rounded-[4px] hover:bg-[#60122e] transition-colors cursor-pointer"
                >
                  {text.close}
                </button>
              </div>
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
