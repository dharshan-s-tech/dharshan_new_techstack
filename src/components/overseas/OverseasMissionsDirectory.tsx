'use client';

import React, { useState, useMemo } from 'react';
import { OverseasMission, getMissionsForOffice } from '@/data/overseas/overseasMissions';

interface OverseasMissionsDirectoryProps {
  officeId: 'kul' | 'ldn' | 'wdc';
  lang?: string;
}

export default function OverseasMissionsDirectory({ officeId, lang = 'en' }: OverseasMissionsDirectoryProps) {
  const isHi = lang === 'hi';
  const allMissions = useMemo(() => getMissionsForOffice(officeId), [officeId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Extract unique regions
  const regions = useMemo(() => {
    const list = Array.from(new Set(allMissions.map((m) => m.region)));
    return ['All', ...list];
  }, [allMissions]);

  // Filter missions
  const filteredMissions = useMemo(() => {
    return allMissions.filter((m) => {
      const matchesRegion = selectedRegion === 'All' || m.region === selectedRegion;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        m.missionName.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.focusAreas.toLowerCase().includes(q);

      return matchesRegion && matchesSearch;
    });
  }, [allMissions, selectedRegion, searchTerm]);

  return (
    <section className="w-full bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden my-8">
      {/* Header & Search Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isHi ? 'राजनयिक मिशन एवं पद लेखापरीक्षा क्षेत्राधिकार' : 'Diplomatic Missions & Posts Audit Purview'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isHi
                ? `कुल ${allMissions.length} राजनयिक प्रतिष्ठानों एवं विशेष विदेशी कार्यालयों की सूची`
                : `Comprehensive inventory of ${allMissions.length} accredited diplomatic establishments and specialized overseas representations.`}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder={isHi ? 'मिशन या देश खोजें...' : 'Search mission or country...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200">
          <span className="text-xs font-semibold text-slate-500 mr-1">
            {isHi ? 'क्षेत्र चुनें:' : 'Filter Region:'}
          </span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedRegion === reg
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {reg === 'All' ? (isHi ? 'सभी क्षेत्र' : 'All Regions') : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-slate-700 font-bold">
            <tr>
              <th className="px-4 py-3.5 w-12 text-center">#</th>
              <th className="px-4 py-3.5">{isHi ? 'मिशन / कार्यालय का नाम' : 'Diplomatic Mission / Office Name'}</th>
              <th className="px-4 py-3.5">{isHi ? 'देश एवं शहर' : 'Country & City'}</th>
              <th className="px-4 py-3.5">{isHi ? 'मिशन का प्रकार' : 'Mission Type'}</th>
              <th className="px-4 py-3.5">{isHi ? 'संपत्ति का प्रकार' : 'Chancery Property'}</th>
              <th className="px-4 py-3.5 text-center">{isHi ? 'लेखापरीक्षा चक्र' : 'Audit Cycle'}</th>
              <th className="px-4 py-3.5 text-center">{isHi ? 'अंतिम लेखापरीक्षा' : 'Last Audited'}</th>
              <th className="px-4 py-3.5">{isHi ? 'मुख्य लेखापरीक्षा बिंदु' : 'Key Focus Areas'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredMissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  {isHi ? 'कोई मेल खाता मिशन नहीं मिला।' : 'No missions match your search query.'}
                </td>
              </tr>
            ) : (
              filteredMissions.map((m, index) => {
                const isGovOwned = m.propertyStatus.toLowerCase().includes('owned') || m.propertyStatus.toLowerCase().includes('historic');

                return (
                  <tr key={m.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500 font-mono text-xs">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {isHi ? m.missionNameHi : m.missionName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{isHi ? m.countryHi : m.country}</div>
                      <div className="text-[11px] text-slate-500">{m.city} • {m.region}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {m.missionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isGovOwned
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {m.propertyStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="text-xs font-mono font-medium text-slate-600">{m.auditFrequency}</span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {m.lastAudited}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-xs">
                      {isHi ? m.focusAreasHi : m.focusAreas}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div>
          {isHi
            ? `प्रदर्शित: ${filteredMissions.length} / ${allMissions.length} मिशन`
            : `Showing ${filteredMissions.length} of ${allMissions.length} diplomatic missions`}
        </div>
        <div className="text-[11px]">
          {isHi
            ? 'विदेश मंत्रालय एवं भारत के नियंत्रक-महालेखापरीक्षक के वार्षिक निरीक्षण कार्यक्रम के अनुसार अद्यतन।'
            : 'Synchronized with Ministry of External Affairs Foreign Service Audit Cadre.'}
        </div>
      </div>
    </section>
  );
}
