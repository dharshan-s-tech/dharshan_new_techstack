'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, StateOfficeCard, StateOfficeSubDetail } from '@/lib/dataManager';

export default function AdminStateOffices() {
  const [offices, setOffices] = useState<StateOfficeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [auditDetails, setAuditDetails] = useState<StateOfficeSubDetail[]>([]);
  const [aeDetails, setAeDetails] = useState<StateOfficeSubDetail[]>([]);

  const loadData = () => {
    setLoading(true);
    const data = dataManager.getStateOffices();
    setOffices(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleOfficesChange = () => {
      loadData();
    };
    window.addEventListener('stateOfficesChange', handleOfficesChange);
    return () => window.removeEventListener('stateOfficesChange', handleOfficesChange);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setNameEn('');
    setNameHi('');
    setAuditDetails([{ label: '', url: '' }]);
    setAeDetails([{ label: '', url: '' }]);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: StateOfficeCard) => {
    setEditingId(item.id);
    setNameEn(item.name || '');
    setNameHi(item.nameHindi || '');
    setAuditDetails(item.auditDetails && item.auditDetails.length > 0 ? item.auditDetails.map(x => ({ ...x })) : [{ label: '', url: '' }]);
    setAeDetails(item.aeDetails && item.aeDetails.length > 0 ? item.aeDetails.map(x => ({ ...x })) : [{ label: '', url: '' }]);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" state office card?`)) return;
    dataManager.deleteStateOffice(id);
    loadData();
  };

  const handleResetDefaults = () => {
    if (!confirm('Are you sure you want to reset all State Offices back to the default 28 states dataset?')) return;
    dataManager.resetStateOfficesToDefault();
    loadData();
  };

  // Helper methods to manage sub-office arrays in state
  const handleAddAuditSub = () => {
    setAuditDetails([...auditDetails, { label: '', url: '' }]);
  };

  const handleRemoveAuditSub = (index: number) => {
    setAuditDetails(auditDetails.filter((_, idx) => idx !== index));
  };

  const handleAuditSubChange = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...auditDetails];
    updated[index][field] = value;
    setAuditDetails(updated);
  };

  const handleAddAeSub = () => {
    setAeDetails([...aeDetails, { label: '', url: '' }]);
  };

  const handleRemoveAeSub = (index: number) => {
    setAeDetails(aeDetails.filter((_, idx) => idx !== index));
  };

  const handleAeSubChange = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...aeDetails];
    updated[index][field] = value;
    setAeDetails(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) {
      alert('Please enter a State Name');
      return;
    }

    const newId = editingId || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Clean up empty sub-offices
    const cleanedAudit = auditDetails.filter(s => s.label.trim() !== '');
    const cleanedAe = aeDetails.filter(s => s.label.trim() !== '');

    const record: StateOfficeCard = {
      id: newId,
      name: nameEn.trim(),
      nameHindi: nameHi.trim(),
      auditDetails: cleanedAudit.length > 0 ? cleanedAudit : [{ label: `PAG (Audit), ${nameEn}`, url: '#' }],
      aeDetails: cleanedAe.length > 0 ? cleanedAe : [{ label: `PAG (A&E), ${nameEn}`, url: '#' }]
    };

    dataManager.saveStateOffice(record);
    setIsFormOpen(false);
    loadData();
  };

  const filteredOffices = offices.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.nameHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.auditDetails.some(sub => sub.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* 1. HEADER & SEARCH ACTIONS PANEL */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">State Level Offices Management (Audit & A&E Cards)</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">
              Edit each State Card, State Title, Hindi translation, and dynamic sub-offices / external URLs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="text-white px-4 py-2 font-semibold transition-all shadow-xs rounded-none"
              style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
            >
              + Add New State Card
            </button>
            <button
              onClick={handleResetDefaults}
              className="border border-amber-600 text-amber-700 hover:bg-amber-50 px-3 py-2 font-medium bg-white transition-colors"
            >
              ↺ Reset to Defaults
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="pt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search state name or sub-office label..."
            className="w-full sm:w-96 bg-white border border-zinc-300 px-3 py-2 text-zinc-800 focus:outline-none focus:border-[#751639]"
          />
        </div>
      </div>

      {/* 2. STATE CARDS MANAGEMENT TABLE */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] shadow-xs overflow-hidden mb-12">
        <div className="px-5 py-3.5 border-b border-[#e2e5e7] flex justify-between items-center bg-[#fafbfc]">
          <h3 className="font-semibold text-zinc-800">
            Registered State Offices [ Showing {filteredOffices.length} of {offices.length} ]
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="text-white border-b border-[#5c102c] font-bold"
                style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
              >
                <th className="px-4 py-3.5 border-r border-white/20 w-12 text-center">#</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-48">State Name (English)</th>
                <th className="px-4 py-3.5 border-r border-white/20 w-48">State Name (Hindi)</th>
                <th className="px-4 py-3.5 border-r border-white/20">Audit Offices Details</th>
                <th className="px-4 py-3.5 border-r border-white/20">A&E Offices Details</th>
                <th className="px-4 py-3.5 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e5e7]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    Loading registered state office cards...
                  </td>
                </tr>
              ) : filteredOffices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                    No state office cards found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredOffices.map((office, idx) => (
                  <tr key={office.id} className="hover:bg-zinc-50/60 transition-colors text-zinc-800">
                    <td className="px-4 py-3 border-r border-[#e2e5e7] text-center font-mono text-zinc-400">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-bold text-[#751639]">{office.name}</td>
                    <td className="px-4 py-3 border-r border-[#e2e5e7] font-medium text-zinc-700">{office.nameHindi || '-'}</td>
                    
                    {/* Audit Details Column */}
                    <td className="px-4 py-3 border-r border-[#e2e5e7]">
                      <div className="space-y-1">
                        {office.auditDetails.map((sub, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-zinc-800">• {sub.label}</span>
                            {sub.url && (
                              <a href={sub.url} target="_self" rel="noreferrer" className="text-[#751639] hover:underline text-[10px]">
                                [ Link ↗ ]
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* A&E Details Column */}
                    <td className="px-4 py-3 border-r border-[#e2e5e7]">
                      <div className="space-y-1">
                        {office.aeDetails.map((sub, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-zinc-800">• {sub.label}</span>
                            {sub.url && (
                              <a href={sub.url} target="_self" rel="noreferrer" className="text-[#751639] hover:underline text-[10px]">
                                [ Link ↗ ]
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-3 text-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(office)}
                        className="p-1 border border-zinc-300 hover:bg-zinc-100 text-[#751639] inline-flex items-center justify-center w-7 h-7"
                        title="Edit State Card"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(office.id, office.name)}
                        className="p-1 border border-red-200 hover:bg-red-50 text-red-600 inline-flex items-center justify-center w-7 h-7"
                        title="Delete Card"
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

      {/* 3. SLIDE-OVER EDIT / CREATE FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-base font-bold"
            >
              ✕
            </button>

            <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-200 pb-3 mb-5">
              {editingId ? `Edit State Card: ${nameEn}` : 'Add New State Office Card'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">State Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Gujarat"
                    className="w-full border border-zinc-300 px-3 py-1.5 focus:outline-none focus:border-[#751639]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">State Name (Hindi)</label>
                  <input
                    type="text"
                    value={nameHi}
                    onChange={(e) => setNameHi(e.target.value)}
                    placeholder="e.g. गुजरात"
                    className="w-full border border-zinc-300 px-3 py-1.5 focus:outline-none focus:border-[#751639]"
                  />
                </div>
              </div>

              {/* AUDIT SUB-OFFICES SECTION */}
              <div className="bg-[#fcfdfe] border border-zinc-200 p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                  <h4 className="font-bold text-[#751639] text-xs">State Audit Offices Sub-Items (Shown when filter=audit)</h4>
                  <button
                    type="button"
                    onClick={handleAddAuditSub}
                    className="text-[11px] bg-[#751639] hover:bg-[#5a112b] text-white px-2.5 py-1 font-semibold"
                  >
                    + Add Audit Sub-Office
                  </button>
                </div>

                {auditDetails.map((sub, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2.5 border border-zinc-200">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={sub.label}
                        onChange={(e) => handleAuditSubChange(idx, 'label', e.target.value)}
                        placeholder="e.g. PAG (Audit), Rajkot"
                        className="w-full border border-zinc-300 px-2.5 py-1 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={sub.url || ''}
                        onChange={(e) => handleAuditSubChange(idx, 'url', e.target.value)}
                        placeholder="URL e.g. https://cag.gov.in/ag2/gujarat/en"
                        className="w-full border border-zinc-300 px-2.5 py-1 text-xs focus:outline-none"
                      />
                    </div>
                    {auditDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAuditSub(idx)}
                        className="text-red-600 hover:text-red-800 font-bold px-2 text-sm"
                        title="Remove Sub-Office"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* A&E SUB-OFFICES SECTION */}
              <div className="bg-[#fcfdfe] border border-zinc-200 p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                  <h4 className="font-bold text-[#751639] text-xs">State A&E Offices Sub-Items (Shown when filter=ae)</h4>
                  <button
                    type="button"
                    onClick={handleAddAeSub}
                    className="text-[11px] bg-[#751639] hover:bg-[#5a112b] text-white px-2.5 py-1 font-semibold"
                  >
                    + Add A&E Sub-Office
                  </button>
                </div>

                {aeDetails.map((sub, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2.5 border border-zinc-200">
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={sub.label}
                        onChange={(e) => handleAeSubChange(idx, 'label', e.target.value)}
                        placeholder="e.g. PAG (A&E), Rajkot"
                        className="w-full border border-zinc-300 px-2.5 py-1 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={sub.url || ''}
                        onChange={(e) => handleAeSubChange(idx, 'url', e.target.value)}
                        placeholder="URL e.g. https://cag.gov.in/ag1/gujarat/en"
                        className="w-full border border-zinc-300 px-2.5 py-1 text-xs focus:outline-none"
                      />
                    </div>
                    {aeDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAeSub(idx)}
                        className="text-red-600 hover:text-red-800 font-bold px-2 text-sm"
                        title="Remove Sub-Office"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-zinc-200">
                <button
                  type="submit"
                  className="flex-grow py-2.5 text-white font-bold transition-all shadow-xs"
                  style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
                >
                  Save State Office Card Record
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 border border-zinc-350 text-zinc-700 font-medium hover:bg-zinc-100 transition-colors bg-white"
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
