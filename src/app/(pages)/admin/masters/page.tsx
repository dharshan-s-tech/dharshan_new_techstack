'use client';

import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api';

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

export default function AdminMasters() {
  const API_URL = getApiBaseUrl();
  const [states, setStates] = useState<StateItem[]>([]);
  const [govLevels, setGovLevels] = useState<GovLevelItem[]>([]);
  
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingGov, setLoadingGov] = useState(true);

  // States Form State
  const [isStateFormOpen, setIsStateFormOpen] = useState(false);
  const [editingStateId, setEditingStateId] = useState<number | null>(null);
  const [stateCode, setStateCode] = useState('');
  const [stateNameEn, setStateNameEn] = useState('');
  const [stateNameHi, setStateNameHi] = useState('');
  const [stateIsActive, setStateIsActive] = useState(true);

  // Gov Levels Form State
  const [isGovFormOpen, setIsGovFormOpen] = useState(false);
  const [editingGovId, setEditingGovId] = useState<number | null>(null);
  const [govNameEn, setGovNameEn] = useState('');
  const [govNameHi, setGovNameHi] = useState('');
  const [govIsActive, setGovIsActive] = useState(true);

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

  const handleOpenStateCreate = () => {
    setEditingStateId(null);
    setStateCode('');
    setStateNameEn('');
    setStateNameHi('');
    setStateIsActive(true);
    setIsStateFormOpen(true);
  };

  const handleOpenStateEdit = (item: StateItem) => {
    setEditingStateId(item.id);
    setStateCode(item.code || '');
    setStateNameEn(item.name_en);
    setStateNameHi(item.name_hi || '');
    setStateIsActive(item.is_active);
    setIsStateFormOpen(true);
  };

  const handleStateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: StateItem = {
      id: editingStateId || Date.now(),
      code: stateCode,
      name_en: stateNameEn,
      name_hi: stateNameHi,
      is_active: stateIsActive
    };

    if (editingStateId) {
      setStates(states.map(s => s.id === editingStateId ? newRecord : s));
    } else {
      setStates([...states, newRecord]);
    }
    setIsStateFormOpen(false);
  };

  const handleStateDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this State directory?')) return;
    setStates(states.filter(s => s.id !== id));
  };

  const handleOpenGovCreate = () => {
    setEditingGovId(null);
    setGovNameEn('');
    setGovNameHi('');
    setGovIsActive(true);
    setIsGovFormOpen(true);
  };

  const handleOpenGovEdit = (item: GovLevelItem) => {
    setEditingGovId(item.id);
    setGovNameEn(item.name_en);
    setGovNameHi(item.name_hi || '');
    setGovIsActive(item.is_active);
    setIsGovFormOpen(true);
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: GovLevelItem = {
      id: editingGovId || Date.now(),
      name_en: govNameEn,
      name_hi: govNameHi,
      is_active: govIsActive
    };

    if (editingGovId) {
      setGovLevels(govLevels.map(g => g.id === editingGovId ? newRecord : g));
    } else {
      setGovLevels([...govLevels, newRecord]);
    }
    setIsGovFormOpen(false);
  };

  const handleGovDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this Government Level?')) return;
    setGovLevels(govLevels.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. SECTION: STATES MASTER DATA */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex justify-between items-center bg-[#fafbfc]">
          <div>
            <h3 className="font-bold text-[#751639] text-sm">State Jurisdictions Master Data</h3>
            <p className="text-zinc-500 text-[11px]">System-wide state lookup dictionary used across reports and office filings.</p>
          </div>
          <button
            onClick={handleOpenStateCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add State Master
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-4 py-3 border-r border-white/20 w-12 text-center">Id</th>
                <th className="px-4 py-3 border-r border-white/20 w-24">State Code</th>
                <th className="px-4 py-3 border-r border-white/20">Name (English)</th>
                <th className="px-4 py-3 border-r border-white/20">Name (Hindi)</th>
                <th className="px-4 py-3 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-4 py-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loadingStates ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">Loading states master table...</td>
                </tr>
              ) : states.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{item.id}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] font-mono font-bold text-zinc-700">{item.code || '-'}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] font-bold text-[#751639]">{item.name_en}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] font-medium text-zinc-700">{item.name_hi || '-'}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                  </td>
                  <td className="px-4 py-2.5 text-center space-x-1">
                    <button onClick={() => handleOpenStateEdit(item)} className="p-1 border border-zinc-300 text-[#751639] hover:bg-zinc-100">📝</button>
                    <button onClick={() => handleStateDelete(item.id)} className="p-1 border border-red-200 text-red-600 hover:bg-red-50">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. SECTION: GOVERNMENT LEVELS MASTER DATA */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex justify-between items-center bg-[#fafbfc]">
          <div>
            <h3 className="font-bold text-[#751639] text-sm">Government Level Categories</h3>
            <p className="text-zinc-500 text-[11px]">Audit level classifications (Union, State, Union Territory).</p>
          </div>
          <button
            onClick={handleOpenGovCreate}
            className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            + Add Gov Level
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-4 py-3 border-r border-white/20 w-12 text-center">Id</th>
                <th className="px-4 py-3 border-r border-white/20">Category Name (English)</th>
                <th className="px-4 py-3 border-r border-white/20">Category Name (Hindi)</th>
                <th className="px-4 py-3 border-r border-white/20 w-20 text-center">Status</th>
                <th className="px-4 py-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loadingGov ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">Loading government levels...</td>
                </tr>
              ) : govLevels.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{item.id}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] font-bold text-[#751639]">{item.name_en}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] font-medium text-zinc-700">{item.name_hi || '-'}</td>
                  <td className="px-4 py-2.5 border-r border-[#e2e5e7] text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold">Active</span>
                  </td>
                  <td className="px-4 py-2.5 text-center space-x-1">
                    <button onClick={() => handleOpenGovEdit(item)} className="p-1 border border-zinc-300 text-[#751639] hover:bg-zinc-100">📝</button>
                    <button onClick={() => handleGovDelete(item.id)} className="p-1 border border-red-200 text-red-600 hover:bg-red-50">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATE MODAL */}
      {isStateFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border border-[#ced4da] max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsStateFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 text-base font-bold">✕</button>
            <h3 className="text-sm font-bold text-zinc-900 border-b pb-3 mb-4">{editingStateId ? 'Edit State Master' : 'Add New State Master'}</h3>
            <form onSubmit={handleStateSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">State Code</label>
                <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="e.g. GJ" className="w-full border px-3 py-1.5 focus:border-[#751639] outline-none" />
              </div>
              <div>
                <label className="block font-bold mb-1">State Name (English) *</label>
                <input type="text" required value={stateNameEn} onChange={(e) => setStateNameEn(e.target.value)} placeholder="e.g. Gujarat" className="w-full border px-3 py-1.5 focus:border-[#751639] outline-none" />
              </div>
              <div>
                <label className="block font-bold mb-1">State Name (Hindi)</label>
                <input type="text" value={stateNameHi} onChange={(e) => setStateNameHi(e.target.value)} placeholder="e.g. गुजरात" className="w-full border px-3 py-1.5 focus:border-[#751639] outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2 text-white font-bold" style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}>Save Record</button>
                <button type="button" onClick={() => setIsStateFormOpen(false)} className="px-4 py-2 border">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GOV LEVEL MODAL */}
      {isGovFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border border-[#ced4da] max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsGovFormOpen(false)} className="absolute top-4 right-4 text-zinc-400 text-base font-bold">✕</button>
            <h3 className="text-sm font-bold text-zinc-900 border-b pb-3 mb-4">{editingGovId ? 'Edit Government Level' : 'Add Government Level'}</h3>
            <form onSubmit={handleGovSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Level Name (English) *</label>
                <input type="text" required value={govNameEn} onChange={(e) => setGovNameEn(e.target.value)} placeholder="e.g. State Government" className="w-full border px-3 py-1.5 focus:border-[#751639] outline-none" />
              </div>
              <div>
                <label className="block font-bold mb-1">Level Name (Hindi)</label>
                <input type="text" value={govNameHi} onChange={(e) => setGovNameHi(e.target.value)} placeholder="e.g. राज्य सरकार" className="w-full border px-3 py-1.5 focus:border-[#751639] outline-none" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2 text-white font-bold" style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}>Save Record</button>
                <button type="button" onClick={() => setIsGovFormOpen(false)} className="px-4 py-2 border">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
