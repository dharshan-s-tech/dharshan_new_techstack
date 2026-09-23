'use client';

import { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';

export const ADMIN_TRANSLATIONS = {
  English: {
    // Header & User
    admin: 'Admin',
    superAdmin: 'Super Administrator',
    logout: 'Logout / Sign Out',
    
    // Search & Filter Card
    searchAndFilter: 'Search & Filter',
    searchFor: 'Search For',
    enterKeywords: 'Enter keywords…',
    status: 'Status',
    allStatuses: 'All Statuses',
    allStatus: 'All Status',
    active: 'Active',
    inactive: 'Inactive',
    search: 'Search',
    reset: 'Reset',
    clear: 'Clear',
    filter: 'Filter',
    all: 'All',
    websites: 'Websites',
    mainCagWebsite: 'Main CAG Website',
    stateAeOffices: 'State A&E Offices',
    stateAuditOffices: 'State Audit Offices',
    centralAuditOffices: 'Central Audit Offices',

    // Table Actions & Buttons
    addNew: 'Add New',
    addNewBanner: 'Add New Banner',
    addNewNews: 'Add News',
    addNewReport: 'Add Report',
    addNewCircular: 'Add Circular',
    addNewTender: 'Add Tender',
    addNewUser: 'Add User',
    addNewRole: 'Add Role',
    addNewOffice: 'Add Office',
    addNewState: 'Add State Office',
    actions: 'Actions',
    action: 'Action',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    submit: 'Submit',
    confirm: 'Confirm',
    update: 'Update',
    download: 'Download',

    // Table Headers
    sNo: 'S.No',
    image: 'Image',
    title: 'Title',
    bannerTitle: 'Banner Title',
    subtitle: 'Subtitle',
    displayOrder: 'Display Order',
    order: 'Order',
    category: 'Category',
    reportType: 'Report Type',
    sector: 'Sector',
    year: 'Year',
    level: 'Level',
    state: 'State',
    publishDate: 'Publish Date',
    date: 'Date',
    tenderNo: 'Tender No',
    openingDate: 'Opening Date',
    closingDate: 'Closing Date',
    role: 'Role',
    email: 'Email',
    phone: 'Phone',
    officeName: 'Office Name',
    description: 'Description',
    file: 'File / PDF',

    // Pagination
    showing: 'Showing',
    to: 'to',
    of: 'of',
    entries: 'entries',
    records: 'records',
    previous: 'Previous',
    next: 'Next',
    rowsPerPage: 'Rows per page',

    // Messages
    noData: 'No records found',
    loading: 'Loading...',
    processing: 'Processing...',
  },
  'हिन्दी': {
    // Header & User
    admin: 'प्रशासक',
    superAdmin: 'मुख्य व्यवस्थापक',
    logout: 'लॉग आउट',

    // Search & Filter Card
    searchAndFilter: 'खोज और फ़िल्टर',
    searchFor: 'खोजें',
    enterKeywords: 'कीवर्ड दर्ज करें…',
    status: 'स्थिति',
    allStatuses: 'सभी स्थितियाँ',
    allStatus: 'सभी स्थितियाँ',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    search: 'खोजें',
    reset: 'रीसेट',
    clear: 'साफ़ करें',
    filter: 'फ़िल्टर',
    all: 'सभी',
    websites: 'वेबसाइटें',
    mainCagWebsite: 'मुख्य सीएजी वेबसाइट',
    stateAeOffices: 'राज्य ए एंड ई कार्यालय',
    stateAuditOffices: 'राज्य लेखापरीक्षा कार्यालय',
    centralAuditOffices: 'केंद्रीय लेखापरीक्षा कार्यालय',

    // Table Actions & Buttons
    addNew: 'नया जोड़ें',
    addNewBanner: 'नया बैनर जोड़ें',
    addNewNews: 'नया समाचार जोड़ें',
    addNewReport: 'नई रिपोर्ट जोड़ें',
    addNewCircular: 'नया परिपत्र जोड़ें',
    addNewTender: 'नई निविदा जोड़ें',
    addNewUser: 'नया उपयोगकर्ता जोड़ें',
    addNewRole: 'नया रोल जोड़ें',
    addNewOffice: 'नया कार्यालय जोड़ें',
    addNewState: 'नया राज्य कार्यालय जोड़ें',
    actions: 'कार्रवाइयाँ',
    action: 'कार्रवाई',
    edit: 'संपादित करें',
    delete: 'हटाएँ',
    view: 'देखें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    back: 'वापस',
    submit: 'जमा करें',
    confirm: 'पुष्टि करें',
    update: 'अद्यतन करें',
    download: 'डाउनलोड करें',

    // Table Headers
    sNo: 'क्र.सं.',
    image: 'चित्र',
    title: 'शीर्षक',
    bannerTitle: 'बैनर शीर्षक',
    subtitle: 'उपशीर्षक',
    displayOrder: 'प्रदर्शन क्रम',
    order: 'क्रम',
    category: 'श्रेणी',
    reportType: 'रिपोर्ट प्रकार',
    sector: 'क्षेत्र',
    year: 'वर्ष',
    level: 'स्तर',
    state: 'राज्य',
    publishDate: 'प्रकाशन तिथि',
    date: 'तिथि',
    tenderNo: 'निविदा संख्या',
    openingDate: 'प्रारंभ तिथि',
    closingDate: 'अंतिम तिथि',
    role: 'भूमिका',
    email: 'ईमेल',
    phone: 'फ़ोन',
    officeName: 'कार्यालय का नाम',
    description: 'विवरण',
    file: 'फ़ाइल / पीडीएफ़',

    // Pagination
    showing: 'प्रदर्शित',
    to: 'से',
    of: 'कुल',
    entries: 'प्रविष्टियाँ',
    records: 'रिकॉर्ड',
    previous: 'पिछला',
    next: 'अगला',
    rowsPerPage: 'पंक्तियाँ प्रति पृष्ठ',

    // Messages
    noData: 'कोई रिकॉर्ड नहीं मिला',
    loading: 'लोड हो रहा है...',
    processing: 'प्रक्रिया जारी है...',
  }
};

export function useAdminLanguage() {
  const [language, setLanguage] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    setLanguage(dataManager.getLanguage());
    const handleLangChange = () => setLanguage(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = language === 'हिन्दी';
  const t = isHindi ? ADMIN_TRANSLATIONS['हिन्दी'] : ADMIN_TRANSLATIONS.English;

  const getText = (enText?: string, hiText?: string) => {
    if (isHindi && hiText && hiText.trim()) return hiText;
    return enText || '';
  };

  return { language, isHindi, t, getText };
}
