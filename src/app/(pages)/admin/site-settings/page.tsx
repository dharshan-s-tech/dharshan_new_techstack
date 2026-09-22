'use client';

import React, { useEffect, useState } from 'react';
import { dataManager, SiteSettings } from '@/lib/dataManager';
import { useAdminLanguage } from '@/lib/useAdminLanguage';
import { SlidersHorizontal, CheckCircle2, Globe, FileText, Target, PhoneCall } from 'lucide-react';

export default function AdminSiteSettings() {
  const { isHindi, t } = useAdminLanguage();
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
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 font-sans pb-16">
      
      {/* ── TOP PAGE TITLE ── */}
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
            {isHindi ? 'साइट सेटिंग्स और वैश्विक सामग्री' : 'Site Settings & Global Content'}
          </h1>
          <p className="text-[13px] text-[#62748E] mt-1">
            {isHindi 
              ? 'वैश्विक वेबसाइट ब्रांडिंग, संस्थागत टैगलाइन, होमपेज परिचय, दृष्टिकोण एवं लक्ष्य, और फुटर संपर्क विवरण कॉन्फ़िगर करें।'
              : 'Configure global website branding, institutional taglines, home page introduction, vision & mission, and footer contact credentials.'}
          </p>
        </div>

        {savedSuccess && (
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] px-4 py-2 rounded-[8px] text-[13px] font-medium flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            <span>{isHindi ? 'सभी साइट सेटिंग्स सफलतापूर्वक अद्यतन की गईं!' : 'All Site Settings Updated Successfully!'}</span>
          </div>
        )}
      </div>

      {/* ── SETTINGS FORM CARD ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Site Header & Branding Titles */}
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-[#751639]" />
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
                1. {isHindi ? 'साइट हेडर और ब्रांडिंग शीर्षक' : 'Site Header & Branding Titles'}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {isHindi ? 'मुख्य साइट शीर्षक *' : 'Main Site Title *'}
              </label>
              <input
                type="text"
                required
                value={settings.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                placeholder="Comptroller and Auditor General of India"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
              />
            </div>

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
                {isHindi ? 'साइट उपशीर्षक / संस्थागत टैगलाइन' : 'Site Subtitle / Institution Tagline'}
              </label>
              <input
                type="text"
                value={settings.siteSubtitle}
                onChange={(e) => handleChange('siteSubtitle', e.target.value)}
                placeholder="Supreme Audit Institution of India"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Who We Are Section */}
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#751639]" />
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
                2. {isHindi ? 'होमपेज "हम कौन हैं" अनुभाग' : 'Home Page "Who We Are" Section'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
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
                {isHindi ? 'अनुभाग मुख्य शीर्षक *' : 'Section Headline Title *'}
              </label>
              <input
                type="text"
                required
                value={settings.whoWeAreTitle}
                onChange={(e) => handleChange('whoWeAreTitle', e.target.value)}
                placeholder="Supreme Audit Institution of India"
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
              />
            </div>

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
                {isHindi ? 'विवरण पैराग्राफ *' : 'Description Paragraph *'}
              </label>
              <textarea
                rows={4}
                required
                value={settings.whoWeAreDesc}
                onChange={(e) => handleChange('whoWeAreDesc', e.target.value)}
                placeholder="The Comptroller and Auditor General of India is the Supreme Audit Institution of India..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Vision & Mission */}
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-[#751639]" />
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
                3. {isHindi ? 'दृष्टिकोण और लक्ष्य विवरण' : 'Vision & Mission Statements'}
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                {isHindi ? 'दृष्टिकोण विवरण (Vision) *' : 'Vision Statement *'}
              </label>
              <textarea
                rows={3}
                required
                value={settings.visionText}
                onChange={(e) => handleChange('visionText', e.target.value)}
                placeholder="We strive to be a global leader and catalyst for improved public sector accountability..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all resize-y"
              />
            </div>

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
                {isHindi ? 'लक्ष्य विवरण (Mission) *' : 'Mission Statement *'}
              </label>
              <textarea
                rows={3}
                required
                value={settings.missionText}
                onChange={(e) => handleChange('missionText', e.target.value)}
                placeholder="Mandated by the Constitution of India, we promote accountability, transparency..."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] p-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Contact Information & Footer Copyright */}
        <div 
          className="bg-white border border-[#EDE9E9] rounded-[8px] overflow-hidden"
          style={{
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <div className="px-5 py-4 h-[60px] flex items-center justify-between border-b border-[#F5F3F4]">
            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-[#FDF2F5] flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4 text-[#751639]" />
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
                4. {isHindi ? 'संपर्क जानकारी और फुटर कॉपीराइट' : 'Contact Information & Footer Copyright'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {isHindi ? 'आधिकारिक संपर्क ईमेल' : 'Official Contact Email'}
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="cagoffice@cag.gov.in"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                />
              </div>

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
                  {isHindi ? 'आधिकारिक संपर्क फोन' : 'Official Contact Phone'}
                </label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+91-11-23239300"
                  className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
                />
              </div>
            </div>

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
                {isHindi ? 'फुटर कॉपीराइट सूचना *' : 'Footer Copyright Notice *'}
              </label>
              <input
                type="text"
                required
                value={settings.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                placeholder="© 2026 Comptroller and Auditor General of India. All rights reserved."
                className="w-full bg-[#F8F7F7] border border-[#EDE9E9] rounded-[8px] h-[38.6px] px-4 text-[14px] text-[#314158] placeholder-[#90A1B9] focus:outline-none focus:border-[#751639] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="h-[42px] px-8 rounded-[8px] text-[14px] font-medium text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:opacity-95"
            style={{
              background: 'linear-gradient(232deg, #9f385e 1.4%, #751639 59.7%, #5c1130 172%)'
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHindi ? 'सभी वैश्विक साइट सेटिंग्स सहेजें' : 'Save All Global Site Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}

