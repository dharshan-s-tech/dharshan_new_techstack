'use client';

import React, { useEffect, useState } from 'react';
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

      {/* System Settings Table panel */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-850 mb-4 flex items-center gap-2">
          <span>⚙️</span>
          <span>System Coordinates</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Database Schema</span>
            <span className="font-mono text-zinc-800 font-bold">cag_new</span>
          </div>
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Database User</span>
            <span className="font-mono text-zinc-800 font-bold">dhar</span>
          </div>
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Session Inactivity Timeout</span>
            <span className="font-mono text-zinc-800 font-bold">5 Minutes</span>
          </div>
          <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block mb-1">Network Host Server</span>
            <span className="font-mono text-zinc-800 font-bold">http://10.10.183.228:3000</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
