'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

export default function AdminOverview() {
  const [stats, setStats] = useState({ reports: 0, news: 0, offices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      const reports = dataManager.getReports().length;
      const news = dataManager.getNews().length;
      const offices = dataManager.getStateOffices().length;

      setStats({ reports, news, offices });
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-zinc-500 text-xs text-center py-12">
        Aggregating database statistics...
      </div>
    );
  }

  const statCards = [
    { name: 'Audit Reports & Accounts', count: stats.reports, label: 'Published Reports Cards', icon: '📁' },
    { name: 'News & Press Releases', count: stats.news, label: 'Active Announcements', icon: '📰' },
    { name: 'State Level Office Cards', count: stats.offices, label: 'Registered Locations', icon: '🏛️' },
  ];

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* Welcome Banner */}
      <div className="bg-[#751639]/5 border border-[#751639]/20 p-5 rounded-none">
        <h2 className="text-sm font-bold text-[#751639]">Admin Control Suite Overview</h2>
        <p className="text-[11px] text-zinc-650 mt-1 max-w-2xl leading-relaxed">
          Welcome to the CAG administrative management desk. Select any section from the left navigation sidebar to manage website cards, hero banners, reports, and press releases.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-sm hover:border-zinc-350 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-lg">{card.icon}</span>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-none border border-[#751639] text-[#751639] font-bold text-xs">
                {card.count}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-800">{card.name}</h3>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accounts Reports Subtopics Quick Access Console */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
          <div>
            <h3 className="text-xs font-bold text-zinc-850 flex items-center gap-2">
              <span>🏛️</span>
              <span>Accounts Reports Subtopics &amp; Elements Hub</span>
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Direct access to manage each element, state statement, and subtopic of the CAG Accounts portal.
            </p>
          </div>
          <Link
            href="/admin/accounts"
            className="px-3 py-1.5 bg-[#751639] hover:bg-[#5f122d] text-white font-bold text-[11px] rounded-none shadow-xs transition-colors"
          >
            Open All Accounts Hub →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { id: 'finance', label: 'Finance Accounts', desc: 'Vol I & II state statements', icon: '🏛️' },
            { id: 'glance', label: 'Accounts at a Glance', desc: 'Annual executive digests', icon: '📊' },
            { id: 'appropriation', label: 'Appropriation Accounts', desc: 'Grants & expenditure', icon: '⚖️' },
            { id: 'monthly', label: 'Monthly Key Indicators', desc: 'Month-wise trends', icon: '📅' },
            { id: 'faaa', label: 'FA&AA Data', desc: 'Supplementary data sets', icon: '📂' },
            { id: 'ut', label: 'UT Accounts', desc: 'Union Territories', icon: '🇮🇳' },
            { id: 'combined', label: 'Combined Accounts', desc: 'Union & States accounts', icon: '🌐' },
            { id: 'conference', label: 'State Finance Conf.', desc: 'Annual conferences', icon: '🤝' },
          ].map((sub) => (
            <Link
              key={sub.id}
              href={`/admin/accounts?subtopic=${sub.id}`}
              className="p-3 bg-zinc-50 border border-zinc-200 hover:border-[#751639] hover:bg-pink-50/40 transition-all rounded-none group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{sub.icon}</span>
                <span className="font-bold text-zinc-800 text-[11px] group-hover:text-[#751639] transition-colors">
                  {sub.label}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1.5 line-clamp-1">{sub.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* System Settings Table panel */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-850 mb-4 flex items-center gap-2">
          <span>⚙️</span>
          <span>System Coordinates</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Database &amp; Schema</span>
            <span className="font-mono text-zinc-800 font-bold">cag_db_final (cag_revamp)</span>
          </div>
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Database User</span>
            <span className="font-mono text-zinc-800 font-bold">test</span>
          </div>
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">DB Host &amp; Port</span>
            <span className="font-mono text-zinc-800 font-bold">10.10.183.69:5434</span>
          </div>
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Session Inactivity Timeout</span>
            <span className="font-mono text-zinc-800 font-bold">5 Minutes</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
