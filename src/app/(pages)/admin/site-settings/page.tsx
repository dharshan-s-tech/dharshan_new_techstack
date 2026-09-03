'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, SiteSettings } from '@/lib/dataManager';

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(dataManager.getSiteSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(dataManager.getSiteSettings());
    const handleSettingsChange = () => setSettings(dataManager.getSiteSettings());
    window.addEventListener('siteSettingsChange', handleSettingsChange);
    return () => window.removeEventListener('siteSettingsChange', handleSettingsChange);
  }, []);

  const handleChange = (field: keyof SiteSettings, val: string) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataManager.saveSiteSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-xs text-zinc-700">
      
      {/* HEADER BAR */}
      <div className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-[#751639]">Global Site Content & Page Text Settings</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">Edit site titles, Who We Are paragraphs, Vision & Mission statements, and footer contact details.</p>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 px-4 py-1.5 font-bold text-xs animate-fadeIn">
              ✓ All Site Settings Updated Successfully!
            </div>
          )}
        </div>
      </div>

      {/* FORM SECTION */}
      <form onSubmit={handleSubmit} className="bg-white border-t-[3px] border-t-[#751639] border-l border-r border-b border-[#ced4da] rounded-none p-6 shadow-xs space-y-6 mb-12">
        
        {/* 1. BRANDING & HEADER TITLES */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-200 pb-2 flex items-center gap-2">
            <span>🏛️</span>
            <span>Site Header & Branding Titles</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Main Site Title *</label>
              <input
                type="text"
                required
                value={settings.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Site Subtitle / Institution Tagline</label>
              <input
                type="text"
                value={settings.siteSubtitle}
                onChange={(e) => handleChange('siteSubtitle', e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>
          </div>
        </div>

        {/* 2. WHO WE ARE SECTION */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-200 pb-2 flex items-center gap-2">
            <span>📝</span>
            <span>Home Page "Who We Are" Section</span>
          </h3>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Section Headline Title *</label>
            <input
              type="text"
              required
              value={settings.whoWeAreTitle}
              onChange={(e) => handleChange('whoWeAreTitle', e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Description Paragraph *</label>
            <textarea
              rows={4}
              required
              value={settings.whoWeAreDesc}
              onChange={(e) => handleChange('whoWeAreDesc', e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
            />
          </div>
        </div>

        {/* 3. VISION & MISSION */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-200 pb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Vision & Mission Statements</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Vision Statement *</label>
              <textarea
                rows={3}
                required
                value={settings.visionText}
                onChange={(e) => handleChange('visionText', e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Mission Statement *</label>
              <textarea
                rows={3}
                required
                value={settings.missionText}
                onChange={(e) => handleChange('missionText', e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>
          </div>
        </div>

        {/* 4. FOOTER & CONTACT DETAILS */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <h3 className="text-xs font-bold text-zinc-900 border-b border-zinc-200 pb-2 flex items-center gap-2">
            <span>📞</span>
            <span>Contact Information & Footer Copyright</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Footer Copyright Notice *</label>
            <input
              type="text"
              required
              value={settings.copyrightText}
              onChange={(e) => handleChange('copyrightText', e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-zinc-900 focus:outline-none focus:border-[#751639]"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-6 border-t border-zinc-200">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 text-white font-bold transition-all shadow-md text-xs uppercase tracking-wider"
            style={{ background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #000 172%)' }}
          >
            Save All Global Site Settings
          </button>
        </div>

      </form>
    </div>
  );
}
