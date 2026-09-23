'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getApiBaseUrl } from '@/lib/api';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { 
  ShieldCheck, 
  Menu as MenuIcon, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  Search,
  X
} from 'lucide-react';

interface StateItem {
  id: number;
  code?: string;
  name_en: string;
  name_hi?: string;
  is_active: boolean;
}

interface GovLevelItem {
  id: number;
  name_en: string;
  name_hi?: string;
  is_active: boolean;
}

interface WebsiteMenuItem {
  id: string;
  title_en: string;
  title_hi?: string;
  url: string;
  parent_id: string | null;
  parent_title?: string;
  display_order: number;
  target_blank: boolean;
  is_active: boolean;
}

const DEFAULT_MASTERS_STATES: StateItem[] = [
  { id: 1, code: 'AP', name_en: 'Andhra Pradesh', name_hi: 'आंध्र प्रदेश', is_active: true },
  { id: 2, code: 'AR', name_en: 'Arunachal Pradesh', name_hi: 'अरुणाचल प्रदेश', is_active: true },
  { id: 3, code: 'AS', name_en: 'Assam', name_hi: 'असम', is_active: true },
  { id: 4, code: 'BR', name_en: 'Bihar', name_hi: 'बिहार', is_active: true },
  { id: 5, code: 'CG', name_en: 'Chattisgarh', name_hi: 'छत्तीसगढ़', is_active: true },
  { id: 6, code: 'GJ', name_en: 'Gujarat', name_hi: 'गुजरात', is_active: true },
  { id: 7, code: 'HR', name_en: 'Haryana', name_hi: 'हरियाणा', is_active: true },
  { id: 8, code: 'HP', name_en: 'Himachal Pradesh', name_hi: 'हिमाचल प्रदेश', is_active: true },
  { id: 9, code: 'JK', name_en: 'Jammu & Kashmir', name_hi: 'जम्मू एवं कश्मीर', is_active: true },
  { id: 10, code: 'JH', name_en: 'Jharkhand', name_hi: 'झारखंड', is_active: true },
  { id: 11, code: 'KA', name_en: 'Karnataka', name_hi: 'कर्नाटक', is_active: true },
  { id: 12, code: 'KL', name_en: 'Kerala', name_hi: 'केरल', is_active: true },
  { id: 13, code: 'MP', name_en: 'Madhya Pradesh', name_hi: 'मध्य प्रदेश', is_active: true },
  { id: 14, code: 'MH', name_en: 'Maharashtra', name_hi: 'महाराष्ट्र', is_active: true },
  { id: 15, code: 'MN', name_en: 'Manipur', name_hi: 'मणिपुर', is_active: true },
  { id: 16, code: 'ML', name_en: 'Meghalaya', name_hi: 'मेघालय', is_active: true },
  { id: 17, code: 'MZ', name_en: 'Mizoram', name_hi: 'मिजोरम', is_active: true },
  { id: 18, code: 'NL', name_en: 'Nagaland', name_hi: 'नागालैंड', is_active: true },
  { id: 19, code: 'OD', name_en: 'Odisha', name_hi: 'ओडिशा', is_active: true },
  { id: 20, code: 'PB', name_en: 'Punjab', name_hi: 'पंजाब', is_active: true },
  { id: 21, code: 'RJ', name_en: 'Rajasthan', name_hi: 'राजस्थान', is_active: true },
  { id: 22, code: 'SK', name_en: 'Sikkim', name_hi: 'सिक्किम', is_active: true },
  { id: 23, code: 'TN', name_en: 'Tamil Nadu', name_hi: 'तमिलनाडु', is_active: true },
  { id: 24, code: 'TS', name_en: 'Telangana', name_hi: 'तेलंगाना', is_active: true },
  { id: 25, code: 'TR', name_en: 'Tripura', name_hi: 'त्रिपुरा', is_active: true },
  { id: 26, code: 'UP', name_en: 'Uttar Pradesh', name_hi: 'उत्तर प्रदेश', is_active: true },
  { id: 27, code: 'UK', name_en: 'Uttarakhand', name_hi: 'उत्तराखंड', is_active: true },
  { id: 28, code: 'WB', name_en: 'West Bengal', name_hi: 'पश्चिम बंगाल', is_active: true }
];

const DEFAULT_GOV_LEVELS: GovLevelItem[] = [
  { id: 1, name_en: 'Union Government', name_hi: 'संघ सरकार', is_active: true },
  { id: 2, name_en: 'State Government', name_hi: 'राज्य सरकार', is_active: true },
  { id: 3, name_en: 'Union Territory', name_hi: 'केंद्र शासित प्रदेश', is_active: true }
];

const DEFAULT_WEBSITE_MENUS: WebsiteMenuItem[] = [
  { id: 'wm-1', title_en: 'Home', title_hi: 'मुख्य पृष्ठ', url: '/', parent_id: null, display_order: 1, target_blank: false, is_active: true },
  { id: 'wm-2', title_en: 'About Us', title_hi: 'हमारे बारे में', url: '/About/About-Us/Cag-Of-India', parent_id: null, display_order: 2, target_blank: false, is_active: true },
  { id: 'wm-3', title_en: 'Reports', title_hi: 'लेखापरीक्षा रिपोर्ट', url: '/Reports', parent_id: null, display_order: 3, target_blank: false, is_active: true },
  { id: 'wm-4', title_en: 'Accounts', title_hi: 'राज्य खाते', url: '/Reports/state-accounts', parent_id: null, display_order: 4, target_blank: false, is_active: true },
  { id: 'wm-5', title_en: 'Our Presence', title_hi: 'हमारी उपस्थिति', url: '/Our-Presence/Index-Menu/State-Level-Offices', parent_id: null, display_order: 5, target_blank: false, is_active: true },
  { id: 'wm-6', title_en: 'Training Institutes', title_hi: 'प्रशिक्षण संस्थान', url: '/Training-Institutes', parent_id: null, display_order: 6, target_blank: false, is_active: true },
  { id: 'wm-7', title_en: 'Global Relations', title_hi: 'वैश्विक संबंध', url: '/Global-Relations/Index-Menu/Involvement-with-INTOSAI', parent_id: null, display_order: 7, target_blank: false, is_active: true },
  { id: 'wm-8', title_en: 'Resources', title_hi: 'संसाधन', url: '/Resources/Circulars', parent_id: null, display_order: 8, target_blank: false, is_active: true },
  { id: 'wm-9', title_en: 'News & Media', title_hi: 'समाचार एवं मीडिया', url: '/Home-page/News-&-Events', parent_id: null, display_order: 9, target_blank: false, is_active: true },
  { id: 'wm-10', title_en: 'Contact Us', title_hi: 'संपर्क करें', url: '/Contact', parent_id: null, display_order: 10, target_blank: false, is_active: true },
];

function AdminMastersInner() {
  const { isHindi, t, getText } = useAdminLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = getApiBaseUrl();

  // Active Tab: 'super-admin' | 'website-menu'
  const tabParam = searchParams.get('tab') || 'super-admin';
  const [activeTab, setActiveTab] = useState<'super-admin' | 'website-menu'>(
    tabParam === 'website-menu' ? 'website-menu' : 'super-admin'
  );

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'website-menu') {
      setActiveTab('website-menu');
    } else {
      setActiveTab('super-admin');
    }
  }, [searchParams]);

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Filter State
  const [searchFor, setSearchFor] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [appliedSearch, setAppliedSearch] = useState('');

  // ── States Master ──
  const [states, setStates] = useState<StateItem[]>([]);
  const [govLevels, setGovLevels] = useState<GovLevelItem[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingGov, setLoadingGov] = useState(true);

  // States Modal
  const [isStateFormOpen, setIsStateFormOpen] = useState(false);
  const [editingStateId, setEditingStateId] = useState<number | null>(null);
  const [stateCode, setStateCode] = useState('');
  const [stateNameEn, setStateNameEn] = useState('');
  const [stateNameHi, setStateNameHi] = useState('');

  // Gov Level Modal
  const [isGovFormOpen, setIsGovFormOpen] = useState(false);
  const [editingGovId, setEditingGovId] = useState<number | null>(null);
  const [govNameEn, setGovNameEn] = useState('');
  const [govNameHi, setGovNameHi] = useState('');

  // ── Website Menu State ──
  const [menuItems, setMenuItems] = useState<WebsiteMenuItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cag_website_menu_items');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return DEFAULT_WEBSITE_MENUS;
  });
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuTitleEn, setMenuTitleEn] = useState('');
  const [menuTitleHi, setMenuTitleHi] = useState('');
  const [menuUrl, setMenuUrl] = useState('/');
  const [menuParentId, setMenuParentId] = useState<string>('');
  const [menuOrder, setMenuOrder] = useState<number>(1);
  const [menuTargetBlank, setMenuTargetBlank] = useState<boolean>(false);
  const [menuIsActive, setMenuIsActive] = useState<boolean>(true);

  const loadStates = async () => {
    setLoadingStates(true);
    try {
      const res = await fetch(`${API_URL}/api/states`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      setStates(Array.isArray(data) && data.length > 0 ? data : DEFAULT_MASTERS_STATES);
    } catch (err) {
      setStates(DEFAULT_MASTERS_STATES);
    } finally {
      setLoadingStates(false);
    }
  };

  const loadGovLevels = async () => {
    setLoadingGov(true);
    try {
      const res = await fetch(`${API_URL}/api/government-types`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      setGovLevels(Array.isArray(data) && data.length > 0 ? data : DEFAULT_GOV_LEVELS);
    } catch (err) {
      setGovLevels(DEFAULT_GOV_LEVELS);
    } finally {
      setLoadingGov(false);
    }
  };

  useEffect(() => {
    loadStates();
    loadGovLevels();
  }, []);

  // Filtered States
  const filteredStates = useMemo(() => {
    return states.filter(s => {
      const matchesSearch = !appliedSearch || 
        s.name_en.toLowerCase().includes(appliedSearch.toLowerCase()) || 
        (s.code && s.code.toLowerCase().includes(appliedSearch.toLowerCase())) ||
        (s.name_hi && s.name_hi.includes(appliedSearch));
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? s.is_active : !s.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [states, appliedSearch, statusFilter]);

  // Filtered Gov Levels
  const filteredGovLevels = useMemo(() => {
    return govLevels.filter(g => {
      const matchesSearch = !appliedSearch || 
        g.name_en.toLowerCase().includes(appliedSearch.toLowerCase()) || 
        (g.name_hi && g.name_hi.includes(appliedSearch));
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? g.is_active : !g.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [govLevels, appliedSearch, statusFilter]);

  // Filtered Menus
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(m => {
      const matchesSearch = !appliedSearch || 
        m.title_en.toLowerCase().includes(appliedSearch.toLowerCase()) || 
        m.url.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        (m.title_hi && m.title_hi.includes(appliedSearch));
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? m.is_active : !m.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [menuItems, appliedSearch, statusFilter]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStatusFilter('All');
  };

  // State CRUD
  const handleOpenStateCreate = () => {
    setEditingStateId(null);
    setStateCode('');
    setStateNameEn('');
    setStateNameHi('');
    setIsStateFormOpen(true);
  };

  const handleOpenStateEdit = (item: StateItem) => {
    setEditingStateId(item.id);
    setStateCode(item.code || '');
    setStateNameEn(item.name_en);
    setStateNameHi(item.name_hi || '');
    setIsStateFormOpen(true);
  };

  const handleStateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: StateItem = {
      id: editingStateId || Date.now(),
      code: stateCode,
      name_en: stateNameEn,
      name_hi: stateNameHi,
      is_active: true
    };

    if (editingStateId) {
      setStates(states.map(s => s.id === editingStateId ? newRecord : s));
    } else {
      setStates([...states, newRecord]);
    }
    setIsStateFormOpen(false);
    setToast({ type: 'success', text: 'State master record saved successfully.' });
  };

  const handleStateDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this State jurisdiction?')) return;
    setStates(states.filter(s => s.id !== id));
    setToast({ type: 'success', text: 'State removed from lookup.' });
  };

  // Gov Level CRUD
  const handleOpenGovCreate = () => {
    setEditingGovId(null);
    setGovNameEn('');
    setGovNameHi('');
    setIsGovFormOpen(true);
  };

  const handleOpenGovEdit = (item: GovLevelItem) => {
    setEditingGovId(item.id);
    setGovNameEn(item.name_en);
    setGovNameHi(item.name_hi || '');
    setIsGovFormOpen(true);
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: GovLevelItem = {
      id: editingGovId || Date.now(),
      name_en: govNameEn,
      name_hi: govNameHi,
      is_active: true
    };

    if (editingGovId) {
      setGovLevels(govLevels.map(g => g.id === editingGovId ? newRecord : g));
    } else {
      setGovLevels([...govLevels, newRecord]);
    }
    setIsGovFormOpen(false);
    setToast({ type: 'success', text: 'Government level classification saved.' });
  };

  const handleGovDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this Government Level?')) return;
    setGovLevels(govLevels.filter(g => g.id !== id));
    setToast({ type: 'success', text: 'Government level removed.' });
  };

  // Website Menu CRUD
  const handleOpenMenuCreate = () => {
    setEditingMenuId(null);
    setMenuTitleEn('');
    setMenuTitleHi('');
    setMenuUrl('/');
    setMenuParentId('');
    setMenuOrder(menuItems.length + 1);
    setMenuTargetBlank(false);
    setMenuIsActive(true);
    setIsMenuFormOpen(true);
  };

  const handleOpenMenuEdit = (item: WebsiteMenuItem) => {
    setEditingMenuId(item.id);
    setMenuTitleEn(item.title_en);
    setMenuTitleHi(item.title_hi || '');
    setMenuUrl(item.url);
    setMenuParentId(item.parent_id || '');
    setMenuOrder(item.display_order);
    setMenuTargetBlank(item.target_blank);
    setMenuIsActive(item.is_active);
    setIsMenuFormOpen(true);
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parent = menuItems.find(m => m.id === menuParentId);
    const newRecord: WebsiteMenuItem = {
      id: editingMenuId || `wm-${Date.now()}`,
      title_en: menuTitleEn,
      title_hi: menuTitleHi,
      url: menuUrl,
      parent_id: menuParentId || null,
      parent_title: parent ? parent.title_en : undefined,
      display_order: menuOrder,
      target_blank: menuTargetBlank,
      is_active: menuIsActive
    };

    let updated: WebsiteMenuItem[];
    if (editingMenuId) {
      updated = menuItems.map(m => m.id === editingMenuId ? newRecord : m);
    } else {
      updated = [...menuItems, newRecord];
    }
    setMenuItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_website_menu_items', JSON.stringify(updated));
    }
    setIsMenuFormOpen(false);
    setToast({ type: 'success', text: editingMenuId ? 'Menu link updated successfully.' : 'New menu item added to website navigation.' });
  };

  const handleMenuDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation link?')) return;
    const updated = menuItems.filter(m => m.id !== id);
    setMenuItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cag_website_menu_items', JSON.stringify(updated));
    }
    setToast({ type: 'success', text: 'Navigation item removed.' });
  };

  if (isStateFormOpen) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white rounded-[10px] border border-[#EDE9E9] p-6 flex flex-col justify-start animate-fadeIn">
        <div className="w-full max-w-[1526.2px] bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] overflow-hidden">
          <div 
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsStateFormOpen(false)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← {isHindi ? 'पीछे' : 'Back'}</span>
              </button>
              <h3 className="text-[16px] font-bold">
                {editingStateId ? (isHindi ? 'राज्य मास्टर संपादित करें' : 'Edit State Master') : (isHindi ? 'नया राज्य मास्टर जोड़ें' : 'Add New State Master')}
              </h3>
            </div>
            <button onClick={() => setIsStateFormOpen(false)} className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer">✕</button>
          </div>
          <form onSubmit={handleStateSubmit} className="p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'राज्य कोड' : 'State Code'}</label>
              <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="e.g. GJ" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'राज्य का नाम (अंग्रेज़ी) *' : 'State Name (English) *'}</label>
              <input type="text" required value={stateNameEn} onChange={(e) => setStateNameEn(e.target.value)} placeholder="e.g. Gujarat" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'राज्य का नाम (हिन्दी)' : 'State Name (हिन्दी)'}</label>
              <input type="text" value={stateNameHi} onChange={(e) => setStateNameHi(e.target.value)} placeholder="उदा. गुजरात" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="pt-4 flex gap-3 border-t border-[#F5F3F4] justify-end">
              <button type="button" onClick={() => setIsStateFormOpen(false)} className="px-5 h-[38.6px] rounded-[8px] border border-[#EDE9E9] text-[#62748E] hover:bg-[#F8F7F7] cursor-pointer font-medium text-[14px]">
                {t.cancel}
              </button>
              <button type="submit" className="px-6 h-[38.6px] rounded-[8px] text-white font-medium text-[14px] cursor-pointer shadow-md" style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)' }}>
                {isHindi ? 'सहेजें' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (isGovFormOpen) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white rounded-[10px] border border-[#EDE9E9] p-6 flex flex-col justify-start animate-fadeIn">
        <div className="w-full max-w-[1526.2px] bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] overflow-hidden">
          <div 
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsGovFormOpen(false)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← {isHindi ? 'पीछे' : 'Back'}</span>
              </button>
              <h3 className="text-[16px] font-bold">
                {editingGovId ? (isHindi ? 'सरकारी स्तर संपादित करें' : 'Edit Government Level') : (isHindi ? 'नया सरकारी स्तर जोड़ें' : 'Add Government Level')}
              </h3>
            </div>
            <button onClick={() => setIsGovFormOpen(false)} className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer">✕</button>
          </div>
          <form onSubmit={handleGovSubmit} className="p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'स्तर का नाम (अंग्रेज़ी) *' : 'Level Name (English) *'}</label>
              <input type="text" required value={govNameEn} onChange={(e) => setGovNameEn(e.target.value)} placeholder="e.g. State Government" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'स्तर का नाम (हिन्दी)' : 'Level Name (हिन्दी)'}</label>
              <input type="text" value={govNameHi} onChange={(e) => setGovNameHi(e.target.value)} placeholder="उदा. राज्य सरकार" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="pt-4 flex gap-3 border-t border-[#F5F3F4] justify-end">
              <button type="button" onClick={() => setIsGovFormOpen(false)} className="px-5 h-[38.6px] rounded-[8px] border border-[#EDE9E9] text-[#62748E] hover:bg-[#F8F7F7] cursor-pointer font-medium text-[14px]">
                {t.cancel}
              </button>
              <button type="submit" className="px-6 h-[38.6px] rounded-[8px] text-white font-medium text-[14px] cursor-pointer shadow-md" style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)' }}>
                {isHindi ? 'सहेजें' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (isMenuFormOpen) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-white rounded-[10px] border border-[#EDE9E9] p-6 flex flex-col justify-start animate-fadeIn">
        <div className="w-full max-w-[1526.2px] bg-white rounded-[8px] shadow-sm border border-[#EDE9E9] overflow-hidden">
          <div 
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMenuFormOpen(false)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← {isHindi ? 'पीछे' : 'Back'}</span>
              </button>
              <h3 className="text-[16px] font-bold">
                {editingMenuId ? (isHindi ? 'मेनू लिंक संपादित करें' : 'Edit Menu Link') : (isHindi ? 'वेबसाइट मेनू लिंक जोड़ें' : 'Add Website Menu Link')}
              </h3>
            </div>
            <button onClick={() => setIsMenuFormOpen(false)} className="text-white/80 hover:text-white text-xl font-bold p-1 cursor-pointer">✕</button>
          </div>
          <form onSubmit={handleMenuSubmit} className="p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'मेनू शीर्षक (अंग्रेज़ी) *' : 'Menu Label (English) *'}</label>
              <input type="text" required value={menuTitleEn} onChange={(e) => setMenuTitleEn(e.target.value)} placeholder="e.g. Audit Reports" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'मेनू शीर्षक (हिन्दी)' : 'Menu Label (हिन्दी)'}</label>
              <input type="text" value={menuTitleHi} onChange={(e) => setMenuTitleHi(e.target.value)} placeholder="उदा. लेखापरीक्षा रिपोर्ट" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'रीडायरेक्ट URL *' : 'Redirect Route URL *'}</label>
              <input type="text" required value={menuUrl} onChange={(e) => setMenuUrl(e.target.value)} placeholder="e.g. /Reports" className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] font-mono text-[#314158] focus:border-[#751639] outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#62748E]">{isHindi ? 'प्रदर्शन क्रम' : 'Display Order'}</label>
                <input type="number" value={menuOrder} onChange={(e) => setMenuOrder(Number(e.target.value))} className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-3 text-[14px] font-mono text-[#314158] focus:border-[#751639] outline-none" />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[13px] text-[#0F172B]">
                  <input type="checkbox" checked={menuIsActive} onChange={(e) => setMenuIsActive(e.target.checked)} className="w-4 h-4 text-[#751639] accent-[#751639] rounded" />
                  <span>{isHindi ? 'सक्रिय लिंक' : 'Active Link'}</span>
                </label>
              </div>
            </div>
            <div className="pt-4 flex gap-3 border-t border-[#F5F3F4] justify-end">
              <button type="button" onClick={() => setIsMenuFormOpen(false)} className="px-5 h-[38.6px] rounded-[8px] border border-[#EDE9E9] text-[#62748E] hover:bg-[#F8F7F7] cursor-pointer font-medium text-[14px]">
                {t.cancel}
              </button>
              <button type="submit" className="px-6 h-[38.6px] rounded-[8px] text-white font-medium text-[14px] cursor-pointer shadow-md" style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)' }}>
                {isHindi ? 'सहेजें' : 'Save Menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-[8px] shadow-lg border text-[13px] font-semibold ${
            toast.type === 'success' ? 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> : <AlertCircle className="w-4 h-4 text-[#DC2626]" />}
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-3 text-zinc-400 hover:text-zinc-600 font-bold">&times;</button>
          </div>
        </div>
      )}

      {/* ── TOP PAGE TITLE & TABS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '20px',
              color: '#751639'
            }}
          >
            {isHindi ? 'मेनू प्रबंधन और मास्टर डेटा' : 'Menu Management & Master Data'}
          </h1>
          <p className="text-[13px] text-[#62748E] mt-1">
            {isHindi 
              ? 'प्राथमिक वेबसाइट नेविगेशन मेनू, पोर्टल हेडर, राज्य अधिकार क्षेत्र लुकअप, और सरकार स्तर वर्गीकरण प्रबंधित करें।' 
              : 'Administer primary website navigation menus, portal headers, state jurisdiction lookups, and government level classifications.'}
          </p>
        </div>

        {/* Submodule Tab Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('super-admin'); router.push('/admin/masters?tab=super-admin'); }}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'super-admin'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-[#314158] border-[#EDE9E9] hover:bg-[#F8F7F7]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isHindi ? 'सुपर एडमिन मास्टर्स' : 'Super Admin Masters'}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'super-admin' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#314158]'
            }`}>
              {states.length + govLevels.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('website-menu'); router.push('/admin/masters?tab=website-menu'); }}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === 'website-menu'
                ? 'bg-[#751639] text-white border-[#751639] shadow-xs'
                : 'bg-white text-[#314158] border-[#EDE9E9] hover:bg-[#F8F7F7]'
            }`}
          >
            <MenuIcon className="w-4 h-4" />
            <span>{isHindi ? 'वेबसाइट मेनू' : 'Website Menu'}</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === 'website-menu' ? 'bg-white/20 text-white' : 'bg-[#EDE9E9] text-[#314158]'
            }`}>
              {menuItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── 1. CARD: SEARCH & FILTER ── */}
      <div 
        className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
        style={{
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        <div className="px-5 py-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#751639]" />
            </div>
            <span 
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#0F172B'
              }}
            >
              {t.searchAndFilter}
            </span>
          </div>
        </div>

        <div className="p-5 border-t border-[#F5F3F4] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search For */}
            <div className="flex flex-col gap-1.5">
              <label 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#62748E'
                }}
              >
                {t.searchFor}
              </label>
              <input
                type="text"
                value={searchFor}
                onChange={(e) => setSearchFor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchGo()}
                placeholder={activeTab === 'super-admin' 
                  ? (isHindi ? 'राज्य का नाम या कोड खोजें...' : 'Search state name or code...') 
                  : (isHindi ? 'मेनू शीर्षक या URL खोजें...' : 'Search menu title or route URL...')}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#62748E'
                }}
              >
                {t.status}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] focus:outline-none focus:border-[#751639] focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">{t.allStatus}</option>
                <option value="Active">{t.active}</option>
                <option value="Inactive">{t.inactive}</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSearchReset}
              className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-[#751639] bg-[rgba(108,20,54,0.05)] hover:bg-[rgba(108,20,54,0.1)] transition-all cursor-pointer"
            >
              {t.reset}
            </button>
            <button
              type="button"
              onClick={handleSearchGo}
              className="h-[38.6px] px-6 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer hover:opacity-95"
              style={{
                background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
              }}
            >
              <Search className="w-4 h-4" />
              <span>{t.search}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. CARD: DATA REGISTRY TABLES ── */}
      {activeTab === 'super-admin' && (
        <div className="space-y-6">
          
          {/* Table 1: States Master */}
          <div 
            className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
            style={{
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box'
            }}
          >
            <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
              <div className="flex items-center gap-3">
                <span 
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#0F172B'
                  }}
                >
                  {isHindi ? `राज्य अधिकार क्षेत्र मास्टर डेटा (${filteredStates.length})` : `State Jurisdictions Master Data (${filteredStates.length})`}
                </span>
              </div>
              <button
                onClick={handleOpenStateCreate}
                className="h-[38.6px] px-5 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
                style={{
                  background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? 'नया राज्य जोड़ें' : 'Add State Master'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-16 text-center">{t.sNo}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-32">{isHindi ? 'राज्य कोड' : 'State Code'}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'राज्य का नाम (अंग्रेज़ी)' : 'State Name (English)'}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'राज्य का नाम (हिन्दी)' : 'State Name (हिन्दी)'}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-center">{t.status}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F3F4]">
                  {loadingStates ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">{t.loading}</td></tr>
                  ) : filteredStates.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">{t.noData}</td></tr>
                  ) : filteredStates.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5 text-center text-[13px] font-bold text-[#751639]">#{item.id}</td>
                      <td className="px-5 py-3.5 text-[13px] font-mono font-bold text-[#314158]">{item.code || '-'}</td>
                      <td className="px-5 py-3.5 text-[14px] font-semibold text-[#0F172B]">{item.name_en}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#62748E]">{item.name_hi || '-'}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                          {t.active}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenStateEdit(item)} 
                            className="p-1.5 text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'संपादित करें' : 'Edit State'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStateDelete(item.id)} 
                            className="p-1.5 text-[#62748E] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'हटाएँ' : 'Delete State'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Government Levels */}
          <div 
            className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
            style={{
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
              boxSizing: 'border-box'
            }}
          >
            <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
              <div className="flex items-center gap-3">
                <span 
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#0F172B'
                  }}
                >
                  {isHindi ? `सरकारी स्तर वर्गीकरण (${filteredGovLevels.length})` : `Government Level Categories (${filteredGovLevels.length})`}
                </span>
              </div>
              <button
                onClick={handleOpenGovCreate}
                className="h-[38.6px] px-5 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
                style={{
                  background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
                }}
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? 'नया सरकारी स्तर जोड़ें' : 'Add Gov Level'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-16 text-center">{t.sNo}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'श्रेणी का नाम (अंग्रेज़ी)' : 'Category Name (English)'}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'श्रेणी का नाम (हिन्दी)' : 'Category Name (हिन्दी)'}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-center">{t.status}</th>
                    <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F3F4]">
                  {loadingGov ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">{t.loading}</td></tr>
                  ) : filteredGovLevels.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#90A1B9]">{t.noData}</td></tr>
                  ) : filteredGovLevels.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3.5 text-center text-[13px] font-bold text-[#751639]">#{item.id}</td>
                      <td className="px-5 py-3.5 text-[14px] font-semibold text-[#0F172B]">{item.name_en}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#62748E]">{item.name_hi || '-'}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                          {t.active}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenGovEdit(item)} 
                            className="p-1.5 text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'संपादित करें' : 'Edit Category'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleGovDelete(item.id)} 
                            className="p-1.5 text-[#62748E] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors cursor-pointer"
                            title={isHindi ? 'हटाएँ' : 'Delete Category'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: WEBSITE MENU REGISTRY ── */}
      {activeTab === 'website-menu' && (
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <span 
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#0F172B'
                }}
              >
                {isHindi ? `वेबसाइट मुख्य नेविगेशन मेनू (${filteredMenuItems.length})` : `Website Main Navigation Menus (${filteredMenuItems.length})`}
              </span>
            </div>
            <button
              onClick={handleOpenMenuCreate}
              className="h-[38.6px] px-5 rounded-[8px] text-[14px] font-medium text-white shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
              style={{
                background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
              }}
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? 'नया मेनू आइटम जोड़ें' : 'Add Menu Item'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(117,22,57,0.04)] border-b border-[#EDE9E9]">
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-16 text-center">{t.sNo}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'मेनू शीर्षक (अंग्रेज़ी एवं हिन्दी)' : 'Menu Label (English & Hindi)'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider">{isHindi ? 'रीडायरेक्ट लिंक (URL)' : 'Redirect Link Route (URL)'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-24 text-center">{isHindi ? 'क्रम' : 'Order'}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-center">{t.status}</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-[#90A1B9] uppercase tracking-wider w-28 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3F4]">
                {filteredMenuItems.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3.5 text-center text-[13px] font-bold text-[#751639]">#{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[14px] text-[#0F172B]">{getText(m.title_en, m.title_hi)}</div>
                      {isHindi ? (
                        m.title_en && m.title_hi && <div className="text-[12px] text-[#62748E]">{m.title_en}</div>
                      ) : (
                        m.title_hi && <div className="text-[12px] text-[#62748E]">{m.title_hi}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[13px] text-[#751639]">{m.url}</td>
                    <td className="px-5 py-3.5 text-center font-mono text-[13px] text-[#314158]">{m.display_order}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1.5 ${
                        m.is_active 
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' 
                          : 'bg-[#FDF4F0] text-[#EA580C] border border-[#FFEDD5]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.is_active ? 'bg-[#16A34A]' : 'bg-[#EA580C]'}`}></span>
                        {m.is_active ? t.active : t.inactive}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenMenuEdit(m)} 
                          className="p-1.5 text-[#62748E] hover:text-[#751639] hover:bg-[#FDF2F5] rounded-[6px] transition-colors cursor-pointer"
                          title={isHindi ? 'संपादित करें' : 'Edit Menu'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMenuDelete(m.id)} 
                          className="p-1.5 text-[#62748E] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors cursor-pointer"
                          title={isHindi ? 'हटाएँ' : 'Delete Menu'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

          </div>
  );
}

export default function AdminMasters() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[13px] text-[#90A1B9]">Loading Menu Management Suite...</div>}>
      <AdminMastersInner />
    </Suspense>
  );
}
