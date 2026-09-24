'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OurPresenceLayout from '../../OurPresenceLayout';
import { dataManager, StateOfficeCard, DEFAULT_STATE_OFFICES } from '@/lib/dataManager';

const STATE_ICONS: Record<string, string> = {
  'andhra-pradesh': '/assets/Images/statelogo/andhrapradesh.svg',
  'arunachal-pradesh': '/assets/Images/statelogo/arunachalpradesh.svg',
  'assam': '/assets/Images/statelogo/assam.svg',
  'bihar': '/assets/Images/statelogo/bihar.svg',
  'chhattisgarh': '/assets/Images/statelogo/chattisgarh.svg',
  'chattisgarh': '/assets/Images/statelogo/chattisgarh.svg',
  'gujarat': '/assets/Images/statelogo/gujarat.svg',
  'haryana': '/assets/Images/statelogo/haryana.svg',
  'himachal-pradesh': '/assets/Images/statelogo/himachalpradesh.svg',
  'jammu-and-kashmir': '/assets/Images/statelogo/jammuankashmir.svg',
  'jammu-kashmir': '/assets/Images/statelogo/jammuankashmir.svg',
  'jharkhand': '/assets/Images/statelogo/jharkhand.svg',
  'karnataka': '/assets/Images/statelogo/karnataka.svg',
  'kerala': '/assets/Images/statelogo/kerala.svg',
  'madhya-pradesh': '/assets/Images/statelogo/madhyapradesh.svg',
  'maharashtra': '/assets/Images/statelogo/maharastra.svg',
  'maharastra': '/assets/Images/statelogo/maharastra.svg',
  'manipur': '/assets/Images/statelogo/manipur.svg',
  'meghalaya': '/assets/Images/statelogo/meghalaya.svg',
  'mizoram': '/assets/Images/statelogo/mizoram.svg',
  'nagaland': '/assets/Images/statelogo/nagaland.svg',
  'odisha': '/assets/Images/statelogo/odisha.svg',
  'punjab': '/assets/Images/statelogo/punjab.svg',
  'rajasthan': '/assets/Images/statelogo/rajasthan.svg',
  'sikkim': '/assets/Images/statelogo/sikkin.svg',
  'sikkin': '/assets/Images/statelogo/sikkin.svg',
  'tamil-nadu': '/assets/Images/statelogo/tamilnadu.svg',
  'telangana': '/assets/Images/statelogo/telangana.svg',
  'tripura': '/assets/Images/statelogo/tripura.svg',
  'uttar-pradesh': '/assets/Images/statelogo/uttarpradesh.svg',
  'uttarakhand': '/assets/Images/statelogo/uttarakhand.svg',
  'west-bengal': '/assets/Images/statelogo/westbengal.svg',
};

function StateOfficesPageContent() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [stateOffices, setStateOffices] = useState<StateOfficeCard[]>(DEFAULT_STATE_OFFICES);
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'audit';

  useEffect(() => {
    // Synchronize client storage after mount to prevent SSR hydration mismatch
    setLang(dataManager.getLanguage());
    setStateOffices(dataManager.getStateOffices());

    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };

    const handleOfficesChange = () => {
      setStateOffices(dataManager.getStateOffices());
    };

    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('stateOfficesChange', handleOfficesChange);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('stateOfficesChange', handleOfficesChange);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const displayTitle = isHindi 
    ? (filter === 'ae' ? 'राज्य लेखा एवं हकदारी कार्यालय' : 'राज्य लेखा परीक्षा कार्यालय')
    : (filter === 'ae' ? 'State Account & Entitlement Offices' : 'State Audit Offices');

  // Dynamically divide current offices into 4 balanced vertical columns
  const itemsPerCol = Math.ceil(stateOffices.length / 4) || 1;
  const col1 = stateOffices.slice(0, itemsPerCol);
  const col2 = stateOffices.slice(itemsPerCol, itemsPerCol * 2);
  const col3 = stateOffices.slice(itemsPerCol * 2, itemsPerCol * 3);
  const col4 = stateOffices.slice(itemsPerCol * 3);

  const columns = [col1, col2, col3, col4];

  return (
    <OurPresenceLayout title={displayTitle} activeTab={filter}>
      {/* 4 vertical columns layout matching Figma design spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4 w-full">
            {col.map((item) => {
              const detailsList = filter === 'ae' ? (item.aeDetails || []) : (item.auditDetails || []);
              const iconSrc = STATE_ICONS[item.id] || '/assets/Images/statelogo/Icons.svg';

              return (
                <div 
                  key={item.id} 
                  className="bg-[#FAFAFA] rounded p-3 flex flex-row items-start gap-2.5 hover:bg-[#F2F2F2] transition-colors border border-transparent hover:border-[#E5E5E5] w-full min-h-[62px]"
                >
                  {/* State Logo Icon */}
                  <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <img 
                      src={iconSrc} 
                      alt={`${item.name} Logo`} 
                      className="w-6 h-6 object-contain" 
                    />
                  </div>

                  {/* State Details */}
                  <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                    <h3 className="font-medium text-[14px] leading-[23px] text-[#2A2A2A] truncate w-full text-left">
                      {isHindi ? (item.nameHindi || item.name) : item.name}
                    </h3>

                    {detailsList.map((sub, idx) => {
                      let targetUrl = sub.url || '';
                      
                      if (filter === 'ae') {
                        if (!targetUrl || targetUrl === '#' || targetUrl.includes('cag.gov.in') || targetUrl.startsWith('/states/')) {
                          targetUrl = targetUrl.startsWith('/states/') 
                            ? targetUrl.replace('/states/', '/ae/')
                            : `/ae/${item.id}`;
                        } else if (!targetUrl.startsWith('/ae/') && !targetUrl.startsWith('http')) {
                          targetUrl = `/ae/${item.id}`;
                        }
                      } else {
                        // Audit offices
                        if (!targetUrl || targetUrl === '#' || targetUrl.includes('cag.gov.in') || targetUrl.startsWith('/states/')) {
                          targetUrl = targetUrl.startsWith('/states/') 
                            ? targetUrl.replace('/states/', '/ag/')
                            : `/ag/${item.id}`;
                        } else if (!targetUrl.startsWith('/ag/') && !targetUrl.startsWith('http')) {
                          targetUrl = `/ag/${item.id}`;
                        }
                      }

                      const isExternal = targetUrl.startsWith('http');

                      if (isExternal) {
                        return (
                          <a
                            key={idx}
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-row items-center justify-between gap-3 w-full group text-decoration-none cursor-pointer"
                          >
                            <span className="font-normal text-[14px] leading-[19px] text-[#565656] group-hover:text-[#751639] transition-colors text-left flex-1 min-w-0">
                              {sub.label}
                            </span>
                            <svg className="w-3.5 h-3.5 text-[#565656] group-hover:text-[#751639] shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          href={targetUrl}
                          className="flex flex-row items-center justify-between gap-3 w-full group text-decoration-none cursor-pointer"
                        >
                          <span className="font-normal text-[14px] leading-[19px] text-[#565656] group-hover:text-[#751639] transition-colors text-left flex-1 min-w-0">
                            {sub.label}
                          </span>
                          <svg className="w-3.5 h-3.5 text-[#565656] group-hover:text-[#751639] shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </OurPresenceLayout>
  );
}

export default function StateOfficesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading State Audit Offices...</div>}>
      <StateOfficesPageContent />
    </Suspense>
  );
}
