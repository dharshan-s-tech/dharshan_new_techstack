'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Menu from '@/components/Menu/Menu';
import { dataManager } from '@/lib/dataManager';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [language, setLanguage] = useState<'English' | 'हिन्दी'>('English');
  const router = useRouter();

  useEffect(() => {
    setLanguage(dataManager.getLanguage());
    const handleLangChange = () => {
      setLanguage(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleHighContrast = () => {
    const isHigh = !highContrast;
    setHighContrast(isHigh);
    if (typeof document !== 'undefined') {
      if (isHigh) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  };

  const executeSearch = () => {
    if (searchVal.trim()) {
      router.push(`/Reports?query=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'हिन्दी' ? 'पहुंच स्वीकृत! आईएएडी इंट्रानेट डैशबोर्ड पर पुनर्निर्देशित किया जा रहा है...' : 'Access Granted! Redirecting to IAAD intranet workflow dashboard...');
    setEmployeeModalOpen(false);
  };

  const toggleLanguage = () => {
    dataManager.setLanguage(language === 'English' ? 'हिन्दी' : 'English');
  };

  const isHindi = language === 'हिन्दी';

  return (
    <header className="site-header" data-node-id="115:2138" data-name="Menu">
      <Link className="cag-logo" href="/">
        <img src="/assets/CAG Logo.svg" alt="Comptroller and Auditor General of India crest logo" />
      </Link>

      {/* Utility Bar */}
      <div className="utility-bar" data-node-id="115:2156">
        <nav className="utility-links" aria-label="Utility links">
          <Link href="/Resources" className="utility-link">{isHindi ? 'ज्ञान केंद्र' : 'Knowledge Hub'}</Link>
          <a 
            href="/admin" 
            target="_blank"
            rel="noopener noreferrer"
            className="utility-link hover:underline"
            onClick={(e) => {
              e.preventDefault();
              window.open('/admin', '_blank');
            }}
          >
            {isHindi ? 'कर्मचारी पोर्टल (Admin)' : 'Employee Portal'}
          </a>
          <Link href="/#news-events-heading" className="utility-link">{isHindi ? 'समाचार एवं घटनाएँ' : 'News & Events'}</Link>
          <Link href="/About/Index-Menu-About/Global-relations/International%20Relations%20Wing" className="utility-link">{isHindi ? 'संपर्क' : 'Contact'}</Link>
        </nav>
        <div className="accessibility">
          <button 
            type="button" 
            className={`a11y-toggle ${highContrast ? 'a11y-toggle--active' : ''}`} 
            aria-label="Toggle accessibility options"
            onClick={toggleHighContrast}
          >
            <span className="a11y-toggle__bg"></span>
            <span className="a11y-toggle__label">A</span>
          </button>
          <img src="/assets/375873ae673ed89a10f1c4f0795d68cf55801045.svg" alt="" className="chevron chevron--small" />
          <button 
            type="button"
            className="lang-select cursor-pointer flex items-center gap-1 bg-transparent border-none text-[10px] text-zinc-600 hover:underline" 
            onClick={toggleLanguage}
            style={{ position: 'relative', zIndex: 50, cursor: 'pointer' }}
          >
            <span>{language}</span>
            <img src="/assets/375873ae673ed89a10f1c4f0795d68cf55801045.svg" alt="" className="chevron chevron--small" />
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="main-nav">
        {/* Render Menu Component */}
        <Menu mobileMenuOpen={mobileMenuOpen} language={language} />

        <button 
          type="button" 
          className="nav-toggle" 
          id="nav-toggle" 
          aria-label="Toggle navigation menu" 
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
          onClick={toggleMobileMenu}
        >
          <span></span><span></span><span></span>
        </button>
        <div className="search-box">
          <input 
            type="text" 
            aria-label="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={isHindi ? 'खोजें...' : 'Search...'}
          />
          <img 
            src="/assets/ef7eb7134dafeda4c8183619dad425b62c132784.svg" 
            alt="Search" 
            className="search-box__icon" 
            onClick={executeSearch}
          />
        </div>
      </div>

      {/* Employee Login Modal */}
      {employeeModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-sm w-full shadow-2xl relative border border-zinc-200">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#0a3d30]">
              <h3 className="font-bold text-white text-xs">{isHindi ? 'कर्मचारी पोर्टल - साइन इन' : 'Employee Portal - Sign In'}</h3>
              <button 
                onClick={() => setEmployeeModalOpen(false)}
                className="text-white hover:text-zinc-300 font-bold text-xs cursor-pointer bg-transparent border-none"
              >
                {isHindi ? '✕ बंद करें' : '✕ Close'}
              </button>
            </div>
            <form onSubmit={handleEmployeeLogin} className="p-6 space-y-4 bg-[#fbfbfb]" autoComplete="off">
              {/* Dummy credentials to hijack browser autofill */}
              <input style={{ display: 'none' }} type="text" name="fakeusername" />
              <input style={{ display: 'none' }} type="password" name="fakepassword" />

              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-1" htmlFor="emp-id">
                  {isHindi ? 'कर्मचारी आईडी / जीपीएफ नंबर' : 'Employee ID / GPF No.'}
                </label>
                <input 
                  id="emp-id"
                  type="text" 
                  required 
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs outline-none focus:border-[#0a3d30] text-zinc-700"
                  placeholder={isHindi ? 'कर्मचारी आईडी दर्ज करें...' : 'Enter employee ID...'}
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-500 mb-1" htmlFor="emp-pass">
                  {isHindi ? 'पासवर्ड' : 'Password'}
                </label>
                <input 
                  id="emp-pass"
                  type="password" 
                  required 
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border border-zinc-300 rounded text-xs outline-none focus:border-[#0a3d30] text-zinc-700"
                  placeholder={isHindi ? 'पासवर्ड दर्ज करें...' : 'Enter password...'}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#0a3d30] hover:bg-[#082f25] text-white text-xs font-bold py-2 rounded transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'पोर्टल खोलें' : 'Access Portal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
