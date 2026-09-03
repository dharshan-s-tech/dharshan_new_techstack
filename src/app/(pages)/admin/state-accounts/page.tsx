'use client';

import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api';

interface StateLookup {
  id: number;
  name_en: string;
}

interface StateAccountItem {
  id: number;
  title_en: string;
  title_hi?: string;
  state_id?: number;
  account_year?: number;
  month?: string;
  volume?: string;
  file_url?: string;
  external_link?: string;
  is_active: boolean;
  state?: { name_en: string };
}

export default function AdminStateAccounts() {
  const API_URL = getApiBaseUrl();
  const [accounts, setAccounts] = useState<StateAccountItem[]>([]);
  const [states, setStates] = useState<StateLookup[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Filters
  const [searchFor, setSearchFor] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [stateId, setStateId] = useState('');
  const [accountYear, setAccountYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('January');
  const [volume, setVolume] = useState('Volume I');
  const [fileUrl, setFileUrl] = useState('#');
  const [externalLink, setExternalLink] = useState('');
  const [isActive, setIsActive] = useState(true);

const MOCK_ACCOUNTS: AccountItem[] = [
  {
    id: 1,
    title_en: 'Accounts at a Glance - Annual Finance Accounts of State Government',
    account_year: 2026,
    month: 'Annual',
    volume: 'Vol I',
    is_active: true,
    state: { name_en: 'Gujarat' }
  },
  {
    id: 2,
    title_en: 'Monthly Key Indicators - Revenue and Expenditure Statements',
    account_year: 2026,
    month: 'July',
    volume: 'Vol II',
    is_active: true,
    state: { name_en: 'Maharashtra' }
  }
];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/state-accounts`);
      const data = await res.json();
      
      let list = Array.isArray(data) && data.length > 0 ? data : MOCK_ACCOUNTS;
      let filtered = list;
      if (appliedSearch) {
        filtered = filtered.filter((item: any) => 
          item.title_en?.toLowerCase().includes(appliedSearch.toLowerCase())
        );
      }
      if (stateFilter !== 'All') {
        filtered = filtered.filter((item: any) => item.state_id?.toString() === stateFilter);
      }
      if (yearFilter !== 'All') {
        filtered = filtered.filter((item: any) => item.account_year?.toString() === yearFilter);
      }

      setAccounts(filtered);
    } catch (err) {
      console.error('Failed to load state accounts:', err);
      setAccounts(MOCK_ACCOUNTS);
    } finally {
      setLoading(false);
    }
  };

const MOCK_STATES: StateLookup[] = [
  { id: 1, name_en: 'Andhra Pradesh' },
  { id: 2, name_en: 'Arunachal Pradesh' },
  { id: 3, name_en: 'Assam' },
  { id: 4, name_en: 'Bihar' },
  { id: 5, name_en: 'Chattisgarh' },
  { id: 6, name_en: 'Gujarat' },
  { id: 7, name_en: 'Haryana' },
  { id: 8, name_en: 'Himachal Pradesh' },
  { id: 9, name_en: 'Jammu & Kashmir' },
  { id: 10, name_en: 'Jharkhand' },
  { id: 11, name_en: 'Karnataka' },
  { id: 12, name_en: 'Kerala' },
  { id: 13, name_en: 'Madhya Pradesh' },
  { id: 14, name_en: 'Maharashtra' },
  { id: 15, name_en: 'Manipur' },
  { id: 16, name_en: 'Meghalaya' },
  { id: 17, name_en: 'Mizoram' },
  { id: 18, name_en: 'Nagaland' },
  { id: 19, name_en: 'Odisha' },
  { id: 20, name_en: 'Punjab' },
  { id: 21, name_en: 'Rajasthan' },
  { id: 22, name_en: 'Sikkim' },
  { id: 23, name_en: 'Tamil Nadu' },
  { id: 24, name_en: 'Telangana' },
  { id: 25, name_en: 'Tripura' },
  { id: 26, name_en: 'Uttar Pradesh' },
  { id: 27, name_en: 'Uttarakhand' },
  { id: 28, name_en: 'West Bengal' }
];

  useEffect(() => {
    loadData();
    const fetchStates = async () => {
      try {
        const stateRes = await fetch(`${API_URL}/api/states`);
        const stateData = await stateRes.json();
        setStates(Array.isArray(stateData) && stateData.length > 0 ? stateData : MOCK_STATES);
      } catch (err) {
        console.error('Failed to load states lookups:', err);
        setStates(MOCK_STATES);
      }
    };
    fetchStates();
  }, [appliedSearch, stateFilter, yearFilter]);

  const handleSearchGo = () => {
    setAppliedSearch(searchFor);
  };

  const handleSearchReset = () => {
    setSearchFor('');
    setAppliedSearch('');
    setStateFilter('All');
    setYearFilter('All');
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitleEn('');
    setTitleHi('');
    setStateId('');
    setAccountYear(new Date().getFullYear());
    setMonth('January');
    setVolume('Volume I');
    setFileUrl('#');
    setExternalLink('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/state-accounts`);
      const data: StateAccountItem[] = await res.json();
      const item = data.find((a) => a.id === id);
      if (!item) throw new Error('Account entry not found');

      setEditingId(id);
      setTitleEn(item.title_en || '');
      setTitleHi(item.title_hi || '');
      setStateId(item.state_id?.toString() || '');
      setAccountYear(item.account_year || new Date().getFullYear());
      setMonth(item.month || 'January');
      setVolume(item.volume || 'Volume I');
      setFileUrl(item.file_url || '#');
      setExternalLink(item.external_link || '');
      setIsActive(item.is_active);
      setIsFormOpen(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this state account entry?')) return;
    try {
      const token = localStorage.getItem('cag_admin_token');
      const res = await fetch(`${API_URL}/api/admin/state-accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Deletion failed.');
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('cag_admin_token');
      const url = editingId
        ? `${API_URL}/api/admin/state-accounts/${editingId}`
        : `${API_URL}/api/admin/state-accounts`;
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        title_en: titleEn,
        title_hi: titleHi || null,
        state_id: stateId ? parseInt(stateId) : null,
        account_year: accountYear,
        month: month,
        volume: volume,
        file_url: fileUrl,
        external_link: externalLink || null,
        is_active: isActive
      };

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save operations failed.');

      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. TOP FILTERS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#013468] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-zinc-555 font-bold mb-1">Search By:</label>
            <select className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none">
              <option>Title</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-555 font-bold mb-1">Search For:</label>
            <input
              type="text"
              value={searchFor}
              onChange={(e) => setSearchFor(e.target.value)}
              placeholder="Enter Keywords"
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none placeholder-zinc-400"
            />
          </div>

          <div>
            <label className="block text-zinc-555 font-bold mb-1">Jurisdiction State:</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none"
            >
              <option value="All">All States</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name_en}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-555 font-bold mb-1">Account Year:</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-750 focus:outline-none"
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 md:col-span-4 justify-end">
            <button
              onClick={handleSearchGo}
              className="border border-[#007bff] text-[#007bff] hover:bg-[#007bff] hover:text-white px-5 py-1.5 rounded-none transition-colors font-medium bg-white"
            >
              GO
            </button>
            <button
              onClick={handleSearchReset}
              className="border border-[#007bff] text-[#007bff] hover:bg-[#007bff] hover:text-white px-5 py-1.5 rounded-none transition-colors font-medium bg-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABLE GRID PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#013468] border-l border-r border-b border-[#ced4da] rounded-none shadow-sm overflow-hidden mb-12">
        
        {/* Table Title & Add button */}
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex justify-between items-center bg-[#fafbfc]">
          <h3 className="font-semibold text-zinc-800">
            AeStateAccounts [ Displaying 1 to {accounts.length} of {accounts.length} ]
          </h3>
          
          <button
            onClick={handleOpenCreate}
            className="border border-zinc-400 text-zinc-800 hover:bg-zinc-50 px-4 py-1 rounded-none transition-colors font-medium bg-white text-[11px]"
          >
            Add New AeStateAccounts
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eef2f5] text-zinc-700 border-b border-[#d1d7dc] font-bold">
                <th className="px-4 py-3.5 border-r border-[#d1d7dc] w-12 text-center">Id</th>
                <th className="px-4 py-3.5 border-r border-[#d1d7dc]">Account Title</th>
                <th className="px-4 py-3.5 border-r border-[#d1d7dc]">State</th>
                <th className="px-4 py-3.5 border-r border-[#d1d7dc] w-24 text-center">Year</th>
                <th className="px-4 py-3.5 border-r border-[#d1d7dc] w-24 text-center">Month</th>
                <th className="px-4 py-3.5 border-r border-[#d1d7dc] w-24 text-center">Volume</th>
                <th className="px-4 py-3.5 border-r border-[#d1d7dc] w-20 text-center">Status</th>
                <th className="px-4 py-3.5 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    Retrieving account entries...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                    No active account entries found.
                  </td>
                </tr>
              ) : (
                (Array.isArray(accounts) ? accounts : MOCK_ACCOUNTS).map((acct) => (
                  <tr key={acct.id} className="hover:bg-zinc-50/50 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono">{acct.id}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-semibold max-w-sm truncate">{acct.title_en}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7]">{acct.state?.name_en || '-'}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono">{acct.account_year}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center capitalize">{acct.month}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center text-zinc-500 font-mono text-[10px]">{acct.volume}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center">
                      <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold ${
                        acct.is_active 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-zinc-100 text-zinc-650'
                      }`}>
                        {acct.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    {/* Small square actions */}
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(acct.id)}
                        className="p-1 border border-zinc-300 rounded-none hover:bg-zinc-100 text-[#0c4a8a] inline-flex items-center justify-center w-7 h-7"
                        title="Edit Record"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(acct.id)}
                        className="p-1 border border-red-200 rounded-none hover:bg-red-50 text-red-600 inline-flex items-center justify-center w-7 h-7"
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Slide Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#013468] border-l border-r border-b border-[#ced4da] rounded-none max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-sm"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-4">
              {editingId ? 'Edit State Accounts Entry' : 'Register New State Accounts Entry'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Account Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-zinc-400"
                    placeholder="Enter English Title"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Account Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none"
                    placeholder="हिंदी शीर्षक"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Jurisdiction State
                  </label>
                  <select
                    value={stateId}
                    onChange={(e) => setStateId(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-800 focus:outline-none"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>{s.name_en}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Account Year
                  </label>
                  <input
                    type="number"
                    value={accountYear}
                    onChange={(e) => setAccountYear(parseInt(e.target.value))}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-800 focus:outline-none"
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none"
                    placeholder="e.g. Volume I"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Active Status
                  </label>
                  <select
                    value={isActive ? 'true' : 'false'}
                    onChange={(e) => setIsActive(e.target.value === 'true')}
                    className="w-full bg-white border border-zinc-300 rounded-none px-2.5 py-1.5 text-zinc-800 focus:outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  File Download URL (PDF Link)
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  External Reference Link
                </label>
                <input
                  type="text"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-200 mt-6">
                <button
                  type="submit"
                  className="flex-grow py-2 border border-[#007bff] text-[#007bff] hover:bg-[#007bff] hover:text-white rounded-none transition-colors font-medium bg-white"
                >
                  Save Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 border border-zinc-350 text-zinc-700 font-medium rounded-none hover:bg-zinc-100 transition-colors bg-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
