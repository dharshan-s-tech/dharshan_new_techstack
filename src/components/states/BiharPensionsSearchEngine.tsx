'use client';

import React, { useState, useEffect } from 'react';

interface PensionItem {
  id: number;
  serial: string;
  ppo: string;
  treasury: string;
  cname: string;
  dor: string;
  scale: string;
  rpension: string;
  rfp: string;
  phase: string;
}

export default function BiharPensionsSearchEngine() {
  const [ppo, setPpo] = useState('');
  const [cname, setCname] = useState('');
  const [treasury, setTreasury] = useState('');
  const [phase, setPhase] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PensionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);

  const fetchPensions = async (pageToFetch: number = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (ppo.trim()) params.append('ppo', ppo.trim());
      if (cname.trim()) params.append('cname', cname.trim());
      if (treasury.trim()) params.append('treasury', treasury.trim());
      if (phase.trim()) params.append('phase', phase.trim());
      params.append('page', pageToFetch.toString());
      params.append('limit', '20');

      const res = await fetch(`/api/states/bihar/pension?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setResults(json.items || []);
        setTotal(json.total || 0);
        setPage(pageToFetch);
      } else {
        setResults([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Bihar pension search error:', err);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPensions(1);
  };

  const handleReset = () => {
    setPpo('');
    setCname('');
    setTreasury('');
    setPhase('');
    setResults([]);
    setTotal(0);
    setSearched(false);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-[#FAF5ED] border border-[#E9D7C3] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#751639] text-white flex items-center justify-center font-bold text-sm">
            BP
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#751639]">Bihar Pensions Interactive Query Engine</h3>
            <p className="text-xs text-[#555]">
              Authorised Pension Payment Orders (PPO) & 7th CPC Revision Registry — Principal Accountant General (A&E), Bihar, Patna
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">PPO Number</label>
            <input
              type="text"
              placeholder="e.g. 015117"
              value={ppo}
              onChange={(e) => setPpo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#751639] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">Pensioner Name</label>
            <input
              type="text"
              placeholder="e.g. SAHDEO SINGH"
              value={cname}
              onChange={(e) => setCname(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#751639] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">Treasury Name</label>
            <input
              type="text"
              placeholder="e.g. Patna, Siwan, Hazipur"
              value={treasury}
              onChange={(e) => setTreasury(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#751639] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1">Revision Phase</label>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#ccc] rounded focus:outline-none focus:border-[#751639] bg-white"
            >
              <option value="">All Phases</option>
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
            </select>
          </div>

          <div className="col-span-full flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-[#666] border border-[#ccc] rounded hover:bg-gray-100 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-xs font-semibold text-white bg-[#751639] hover:bg-[#5E112E] rounded shadow-sm transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search Pension Records</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="text-sm font-bold text-[#111827]">
              Search Results <span className="font-normal text-[#6B7280]">({total} records found)</span>
            </div>
            {total > 0 && (
              <div className="text-xs text-[#6B7280]">
                Showing page {page} of {totalPages}
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#666]">
              <div className="inline-block w-6 h-6 border-2 border-[#751639] border-t-transparent rounded-full animate-spin mb-2"></div>
              <div>Retrieving state pension database records...</div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#666]">
              No pension records matching your search query were found in Bihar State records. Please check the PPO Number or spelling.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#751639] text-white uppercase text-[11px] tracking-wider">
                    <th className="px-4 py-3">Sl No</th>
                    <th className="px-4 py-3">PPO Number</th>
                    <th className="px-4 py-3">Pensioner Name</th>
                    <th className="px-4 py-3">Treasury</th>
                    <th className="px-4 py-3">Date of Retirement</th>
                    <th className="px-4 py-3">Pay Scale</th>
                    <th className="px-4 py-3">Revised Pension (₹)</th>
                    <th className="px-4 py-3">Family Pension (₹)</th>
                    <th className="px-4 py-3">Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-[#FFF9F2] transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-500">{(page - 1) * 20 + i + 1}</td>
                      <td className="px-4 py-3 font-bold text-[#751639]">{r.ppo}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{r.cname}</td>
                      <td className="px-4 py-3 text-gray-700">{r.treasury || '-'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.dor ? new Date(r.dor).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-[11px]">{r.scale || '-'}</td>
                      <td className="px-4 py-3 font-bold text-[#0A3D30]">
                        {r.rpension ? `₹ ${parseInt(r.rpension).toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {r.rfp && parseInt(r.rfp) > 0 ? `₹ ${parseInt(r.rfp).toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF5ED] text-[#751639] border border-[#E9D7C3]">
                          Phase {r.phase || '1'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
              <button
                disabled={page <= 1 || loading}
                onClick={() => fetchPensions(page - 1)}
                className="px-3 py-1.5 text-xs font-semibold text-[#751639] bg-white border border-[#ccc] rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                ← Previous
              </button>
              <div className="text-xs text-gray-600">
                Page {page} of {totalPages}
              </div>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => fetchPensions(page + 1)}
                className="px-3 py-1.5 text-xs font-semibold text-[#751639] bg-white border border-[#ccc] rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
