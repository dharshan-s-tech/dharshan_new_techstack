'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export {
  ANDHRA_PRADESH_NAV_ITEMS,
  getStateNavItems,
  type SubmenuItem,
  type SubmenuColumn,
  type TopNavItem
} from '@/data/stateSubsites/andhraPradeshNav';
import { getStateNavItems } from '@/data/stateSubsites/andhraPradeshNav';

interface StateSubsiteHeaderProps {
  lang?: 'English' | 'हिन्दी';
  onToggleLanguage?: () => void;
  stateSlug?: string;
  prefix?: 'ae' | 'ag';
  officePrefix?: string;
  officePrefixHi?: string;
  officeLocation?: string;
  officeLocationHi?: string;
  logoUrl?: string;
}

export default function StateSubsiteHeader({
  lang = 'English',
  onToggleLanguage,
  stateSlug = 'andhra-pradesh',
  prefix = 'ae',
  officePrefix,
  officePrefixHi,
  officeLocation,
  officeLocationHi,
  logoUrl
}: StateSubsiteHeaderProps) {
  const [currentLang, setCurrentLang] = useState<'English' | 'हिन्दी'>(lang);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);
  const [activeSubSubIndex, setActiveSubSubIndex] = useState<number | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = getStateNavItems(stateSlug, prefix);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.state-nav-container')) {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        setActiveMenu(null);
        setActiveSubIndex(null);
        setActiveSubSubIndex(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
        setActiveMenu(null);
        setActiveSubIndex(null);
        setActiveSubSubIndex(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavEnter = (id: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveMenu(id);
  };

  const handleNavLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubIndex(null);
      setActiveSubSubIndex(null);
    }, 200);
  };

  const isHindi = currentLang === 'हिन्दी';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'English' ? 'हिन्दी' : 'English';
    setCurrentLang(nextLang);
    if (onToggleLanguage) onToggleLanguage();
  };

  return (
    <header className="site-header w-full relative z-40 shadow-sm state-nav-container font-['Noto_Sans',sans-serif]">
      {/* Emblem Logo */}
      <Link
        href={`/${prefix}/${stateSlug}`}
        className="cag-logo"
        aria-label="CAG Subsite Home"
      >
        <img
          src="/assets/Images/CAG Logo.svg"
          alt="Comptroller and Auditor General of India crest logo"
        />
      </Link>

      {/* Top Dark Green Sub-Header Bar */}
      <div className="w-full bg-[#0A3D30]">
        <div
          className="max-w-[1440px] mx-auto h-[40px] flex items-center justify-between text-xs box-border px-4 lg:px-6"
          style={{ paddingLeft: '180px', paddingRight: '64px' }}
        >
          {/* Left Title */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-normal text-[11px] text-white/90 truncate">
              {isHindi ? (officePrefixHi || 'प्रधान महालेखाकार (लेखा एवं हकदारी),') : (officePrefix || 'Principal Accountant General (A&E),')}
            </span>
            <span className="font-bold text-[11px] text-white truncate">
              {isHindi ? (officeLocationHi || officeLocation || stateSlug.replace(/-/g, ' ').toUpperCase()) : (officeLocation || stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))}
            </span>
          </div>

          {/* Right Utility Links matching live portal */}
          <div className="flex items-center gap-3 xl:gap-4 text-[11px] font-normal text-white shrink-0">
            <a href="https://cag.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-white flex items-center gap-1">
              <span>{isHindi ? 'मुख्य साइट' : 'Main Site'}</span>
              <span className="text-[9px]">↗</span>
            </a>
            <a href="https://mail.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:underline text-white flex items-center gap-1">
              <span>{isHindi ? 'मेल' : 'Mail'}</span>
              <span className="text-[9px]">↗</span>
            </a>
            <a href="https://cag.eoffice.gov.in" target="_blank" rel="noopener noreferrer" className="hover:underline text-white flex items-center gap-1">
              <span>{isHindi ? 'ई-ऑफिस' : 'e-Office'}</span>
              <span className="text-[9px]">↗</span>
            </a>
            <a href="https://pgportal.gov.in/Home/LodgeGrievance" target="_blank" rel="noopener noreferrer" className="hover:underline text-white flex items-center gap-1">
              <span>CPGRAMS</span>
              <span className="text-[9px]">↗</span>
            </a>
            <a href="https://e-hrms.gov.in/login" target="_blank" rel="noopener noreferrer" className="hover:underline text-white flex items-center gap-1">
              <span>e-HRMS</span>
              <span className="text-[9px]">↗</span>
            </a>
            <a href="http://d7i5wg8xwe4hf.cloudfront.net/uploads/media/CAG-ICSSR-Research-Article-Competition-3-jpg-06a2faaa4ce6276-55016433.jpeg" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#FFCE7B] font-medium hidden md:inline-flex">
              {isHindi ? 'सीएजी-आईसीएसएसआर प्रतियोगिता' : 'CAG-ICSSR Competition'}
            </a>

            {/* Accessibility Font Scaler */}
            <div className="hidden lg:flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white">
              <button type="button" className="hover:text-[#FFCE7B] px-0.5 font-bold" onClick={() => {}} title="Decrease font">A-</button>
              <button type="button" className="hover:text-[#FFCE7B] px-0.5 font-bold" onClick={() => {}} title="Normal font">A</button>
              <button type="button" className="hover:text-[#FFCE7B] px-0.5 font-bold" onClick={() => {}} title="Increase font">A+</button>
            </div>

            {/* Language Selector */}
            <button
              onClick={toggleLanguage}
              className="bg-transparent border border-white/30 rounded px-2 py-0.5 text-white cursor-pointer hover:bg-white/10 text-[11px] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>{currentLang}</span>
              <span className="text-[8px]">▼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full bg-white border-b border-[#D7D7D7] relative">
        <div
          className="max-w-[1440px] mx-auto h-[80px] flex items-center justify-between gap-3 xl:gap-4 box-border px-4 lg:px-6"
          style={{ paddingLeft: '180px', paddingRight: '64px' }}
        >
          {/* Menu Items */}
          <nav
            className="flex items-center text-[12.5px] xl:text-[13px] 2xl:text-[13.5px] leading-[19px] font-normal text-[#4D4D4D] overflow-visible flex-1 max-w-[980px] gap-1 xl:gap-2 2xl:gap-3"
            style={{ height: '36px', opacity: 1 }}
          >
            {navItems.map((item) => {
              const label = isHindi ? item.titleHi : item.title;
              const hasHierarchicalItems = Boolean(item.items && item.items.length > 0);
              const hasColumns = Boolean(item.columns && item.columns.length > 0);
              const hasDropdown = hasHierarchicalItems || hasColumns;
              const isOpen = activeMenu === item.id;
              const isRightSide = ['contact', 'employee-corner', 'online-services', 'da-cadre'].includes(item.id);

              if (!hasDropdown && item.href) {
                const isExternalOrPdf = item.href.startsWith('http') || item.href.endsWith('.pdf');
                return (
                  <div key={item.id} className="nav-item shrink-0 flex items-center h-[36px] px-2 rounded">
                    {isExternalOrPdf ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4D4D4D] font-normal hover:text-[#751639] transition-colors whitespace-nowrap"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-[#4D4D4D] font-normal hover:text-[#751639] transition-colors whitespace-nowrap"
                      >
                        {label}
                      </Link>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`nav-item shrink-0 cursor-pointer flex items-center gap-1 h-[36px] px-2 relative select-none rounded-t ${
                    isOpen ? 'bg-white text-[#1a1a1a] shadow-sm z-50' : 'hover:bg-black/5'
                  }`}
                  onMouseEnter={() => handleNavEnter(item.id)}
                  onMouseLeave={handleNavLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(isOpen ? null : item.id);
                  }}
                >
                  <span
                    className={
                      isOpen
                        ? "text-[#1a1a1a] font-medium tracking-normal whitespace-nowrap"
                        : "text-[#4D4D4D] font-normal tracking-normal hover:text-[#751639] transition-colors whitespace-nowrap"
                    }
                    aria-expanded={isOpen}
                  >
                    {label}
                  </span>
                  <img
                    src="/assets/32d6d59de0cd297086b7b32eb17e03e23b4ac03d.svg"
                    alt=""
                    className={`chevron w-2.5 h-2.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    style={isOpen ? { filter: 'brightness(0) saturate(100%)' } : {}}
                  />

                  {/* 1. Multi-Level Flyout Dropdown (Matches Original CAG Portal Image) */}
                  {isOpen && hasHierarchicalItems && item.items && (
                    <div
                      className="cag-flyout-menu absolute top-full left-0 bg-white border border-[#D7D7D7] shadow-xl py-1 z-50 min-w-[220px] rounded-b-sm"
                      style={{
                        left: isRightSide ? 'auto' : '0',
                        right: isRightSide ? '0' : 'auto'
                      }}
                      onMouseEnter={() => handleNavEnter(item.id)}
                      onMouseLeave={handleNavLeave}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.items.map((subItem, sIdx) => {
                        const hasChildren = Boolean(subItem.children && subItem.children.length > 0);
                        const isSubActive = activeSubIndex === sIdx;
                        const isSubExtOrPdf = subItem.href?.startsWith('http') || subItem.href?.endsWith('.pdf');

                        return (
                          <div
                            key={sIdx}
                            className={`relative group/sub px-4 py-2.5 text-[13.5px] cursor-pointer flex items-center justify-between border-b border-[#F0F0F0] last:border-b-0 transition-colors ${
                              isSubActive ? 'bg-[#F4F4F4] text-[#751639] font-medium' : 'text-[#333333] hover:bg-[#F8F8F8] hover:text-[#751639]'
                            }`}
                            onMouseEnter={() => {
                              setActiveSubIndex(sIdx);
                              setActiveSubSubIndex(null);
                            }}
                          >
                            {hasChildren ? (
                              <span className="flex-1 text-left select-none pr-2">
                                {isHindi ? subItem.titleHi || subItem.title : subItem.title}
                              </span>
                            ) : isSubExtOrPdf ? (
                              <a
                                href={subItem.href || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 text-left block"
                                onClick={() => setActiveMenu(null)}
                              >
                                {isHindi ? subItem.titleHi || subItem.title : subItem.title}
                              </a>
                            ) : (
                              <Link
                                href={subItem.href || '#'}
                                className="flex-1 text-left block"
                                onClick={() => setActiveMenu(null)}
                              >
                                {isHindi ? subItem.titleHi || subItem.title : subItem.title}
                              </Link>
                            )}

                            {hasChildren && (
                              <span className="text-[#888888] text-[13px] font-semibold select-none ml-2">›</span>
                            )}

                            {/* Level 2 Flyout Panel */}
                            {hasChildren && isSubActive && subItem.children && (
                              <div
                                className="cag-flyout-sub absolute top-0 bg-white border border-[#D7D7D7] shadow-xl py-1 z-50 min-w-[260px] max-w-[340px] max-h-[80vh] overflow-y-auto rounded-sm"
                                style={{
                                  left: isRightSide ? 'auto' : '100%',
                                  right: isRightSide ? '100%' : 'auto'
                                }}
                              >
                                {subItem.children.map((child, cIdx) => {
                                  const hasSubChildren = Boolean(child.children && child.children.length > 0);
                                  const isChildActive = activeSubSubIndex === cIdx;
                                  const isChildExtOrPdf = child.href?.startsWith('http') || child.href?.endsWith('.pdf');

                                  return (
                                    <div
                                      key={cIdx}
                                      className={`relative group/subsub px-4 py-2 text-[13px] cursor-pointer flex items-center justify-between border-b border-[#F0F0F0] last:border-b-0 transition-colors ${
                                        isChildActive ? 'bg-[#F4F4F4] text-[#751639] font-medium' : 'text-[#333333] hover:bg-[#F8F8F8] hover:text-[#751639]'
                                      }`}
                                      onMouseEnter={() => setActiveSubSubIndex(cIdx)}
                                    >
                                      {hasSubChildren ? (
                                        <span className="flex-1 text-left select-none pr-2">
                                          {isHindi ? child.titleHi || child.title : child.title}
                                        </span>
                                      ) : isChildExtOrPdf ? (
                                        <a
                                          href={child.href || '#'}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 text-left block"
                                          onClick={() => setActiveMenu(null)}
                                        >
                                          {isHindi ? child.titleHi || child.title : child.title}
                                        </a>
                                      ) : (
                                        <Link
                                          href={child.href || '#'}
                                          className="flex-1 text-left block"
                                          onClick={() => setActiveMenu(null)}
                                        >
                                          {isHindi ? child.titleHi || child.title : child.title}
                                        </Link>
                                      )}

                                      {hasSubChildren && (
                                        <span className="text-[#888888] text-[13px] font-semibold select-none ml-2">›</span>
                                      )}

                                      {/* Level 3 Flyout Panel */}
                                      {hasSubChildren && isChildActive && child.children && (
                                        <div
                                          className="cag-flyout-subsub absolute top-0 bg-white border border-[#D7D7D7] shadow-xl py-1 z-50 min-w-[260px] max-w-[340px] max-h-[80vh] overflow-y-auto rounded-sm"
                                          style={{
                                            left: isRightSide ? 'auto' : '100%',
                                            right: isRightSide ? '100%' : 'auto'
                                          }}
                                        >
                                          {child.children.map((subChild, scIdx) => {
                                            const isSubChildExtOrPdf = subChild.href?.startsWith('http') || subChild.href?.endsWith('.pdf');
                                            return (
                                              <div
                                                key={scIdx}
                                                className="px-4 py-2 text-[13px] text-[#333333] hover:bg-[#F8F8F8] hover:text-[#751639] cursor-pointer transition-colors border-b border-[#F0F0F0] last:border-b-0"
                                              >
                                                {isSubChildExtOrPdf ? (
                                                  <a
                                                    href={subChild.href || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-left"
                                                    onClick={() => setActiveMenu(null)}
                                                  >
                                                    {isHindi ? subChild.titleHi || subChild.title : subChild.title}
                                                  </a>
                                                ) : (
                                                  <Link
                                                    href={subChild.href || '#'}
                                                    className="block text-left"
                                                    onClick={() => setActiveMenu(null)}
                                                  >
                                                    {isHindi ? subChild.titleHi || subChild.title : subChild.title}
                                                  </Link>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. Mega Menu Grid Fallback (When item has columns and no hierarchical items) */}
                  {isOpen && !hasHierarchicalItems && hasColumns && item.columns && (
                    <div
                      className="global-relations-menu"
                      role="menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 24px)',
                        left: isRightSide ? 'auto' : '0',
                        right: isRightSide ? '0' : 'auto',
                        transform: 'none',
                        width:
                          item.columns.length === 1
                            ? '340px'
                            : item.columns.length === 2
                            ? '560px'
                            : item.columns.length === 3
                            ? '780px'
                            : item.columns.length === 4
                            ? '960px'
                            : '1120px',
                        maxWidth: 'calc(100vw - 32px)',
                        background: '#fff',
                        borderRadius: '4px',
                        boxShadow: '4px 4px 20px rgba(0, 0, 0, 0.15)',
                        padding: '24px 32px',
                        boxSizing: 'border-box',
                        zIndex: 50
                      }}
                      onMouseEnter={() => handleNavEnter(item.id)}
                      onMouseLeave={handleNavLeave}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="grm-title text-left">{label}</h2>
                      <div className="grm-divider" aria-hidden="true"></div>
                      <div
                        className="grm-columns"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${item.columns.length}, minmax(0, 1fr))`,
                          gap: '16px',
                          alignItems: 'stretch'
                        }}
                      >
                        {item.columns.map((col, colIdx) => (
                          <div key={colIdx} className="grm-column" style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minWidth: 0 }}>
                            {col.heading && (
                              <p className="grm-column__heading text-left">
                                {isHindi ? col.headingHi || col.heading : col.heading}
                              </p>
                            )}
                            <div className="grm-link-group">
                              {col.items?.map((subItem, sIdx) => {
                                const isSubExtOrPdf = subItem.href?.startsWith('http') || subItem.href?.endsWith('.pdf');
                                if (isSubExtOrPdf) {
                                  return (
                                    <a
                                      key={sIdx}
                                      href={subItem.href || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="grm-link-box"
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      {isHindi ? subItem.titleHi || subItem.title : subItem.title}
                                    </a>
                                  );
                                }
                                return (
                                  <Link
                                    key={sIdx}
                                    href={subItem.href || '#'}
                                    className="grm-link-box"
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    {isHindi ? subItem.titleHi || subItem.title : subItem.title}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search Box */}
          <div
            className="hidden lg:flex items-center shrink-0 bg-white transition-colors"
            style={{
              width: '190px',
              height: '32px',
              gap: '8px',
              opacity: 1,
              padding: '4px 8px',
              borderRadius: '4px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: '#D7D7D7',
              boxSizing: 'border-box'
            }}
          >
            <input
              type="text"
              placeholder={isHindi ? 'खोजें...' : 'Search'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-[13px] leading-[19px] text-[#717171] placeholder:text-[#717171]"
            />
            <img
              src="/assets/ef7eb7134dafeda4c8183619dad425b62c132784.svg"
              alt="Search"
              style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
