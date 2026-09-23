'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OurPresenceLayout from '../../OurPresenceLayout';
import NamesDetailsCard from '@/Reusable components/Cards/Names & Details Cards/NamesDetailsCard';
import { Office } from '@/types';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

interface OverseasOffice {
  id: string;
  name: string;
  nameHi: string;
  localUrl: string;
  externalUrl: string;
}

const OVERSEAS_OFFICES: OverseasOffice[] = [
  {
    id: 'overseas-wdc',
    name: 'Principal Director of Audit, Washington DC',
    nameHi: 'प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी',
    localUrl: '/states/overseas-washington',
    externalUrl: 'https://cag.gov.in/pda-washington/en'
  },
  {
    id: 'overseas-ldn',
    name: 'Principal Director of Audit, London',
    nameHi: 'प्रधान निदेशक लेखा परीक्षा, लंदन',
    localUrl: '/states/overseas-london',
    externalUrl: 'https://cag.gov.in/pda-london/en'
  },
  {
    id: 'overseas-kul',
    name: 'Principal Director of Audit, Kuala Lumpur',
    nameHi: 'प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर',
    localUrl: '/states/overseas-kualalumpur',
    externalUrl: 'https://cag.gov.in/pda-kualalumpur/en'
  },
  {
    id: 'overseas-rom',
    name: 'Director of External Audit, Rome',
    nameHi: 'बाह्य लेखा परीक्षा निदेशक, रोम',
    localUrl: '/states/overseas-rome',
    externalUrl: 'https://cag.gov.in/en/external-audit-rome'
  },
  {
    id: 'overseas-gva',
    name: 'Director of External Audit, Geneva',
    nameHi: 'बाह्य लेखा परीक्षा निदेशक, जिनेवा',
    localUrl: '/states/overseas-geneva',
    externalUrl: 'https://cag.gov.in/en/external-audit-geneva'
  }
];

const HINDI_OFFICE_TRANSLATIONS: Record<string, { name: string; address: string }> = {
  'c-def': {
    name: 'निदेशक महानिदेशक लेखा परीक्षा (रक्षा सेवाएं) का कार्यालय, नई दिल्ली',
    address: 'एल-II ब्लॉक, ब्रासी एवेन्यू, नई दिल्ली - 110001'
  },
  'c-rail': {
    name: 'निदेशक महानिदेशक लेखा परीक्षा (रेलवे) का कार्यालय, नई दिल्ली',
    address: 'रेल भवन, रायसीना रोड, नई दिल्ली - 110001'
  },
  'c-over': {
    name: 'निदेशक महानिदेशक लेखा परीक्षा का कार्यालय, लंदन (विदेशी कार्यालय)',
    address: 'भारत का उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA'
  },
  'c-1': {
    name: 'निदेशक महानिदेशक लेखा परीक्षा (डाक एवं दूरसंचार)',
    address: 'शाम नाथ मार्ग, सिविल लाइंस मेट्रो स्टेशन के पास, दिल्ली - 110054'
  }
};

function CentralOfficesPageContent() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'overseas';

  useEffect(() => {
    api.getPresence()
      .then((data) => {
        if (data) {
          const list: Office[] = Array.isArray(data) ? data : ((data as any).offices || []);
          setOffices(list.filter((x: Office) => x.type === 'central'));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const filteredOffices = offices.filter(off => {
    const name = off.name.toLowerCase();
    if (filter === 'defense') return name.includes('defense') || name.includes('defence');
    if (filter === 'railway') return name.includes('railway');
    if (filter === 'overseas') return name.includes('overseas') || name.includes('london') || name.includes('washington');
    if (filter === 'other') {
      return (
        !name.includes('defense') &&
        !name.includes('defence') &&
        !name.includes('railway') &&
        !name.includes('overseas') &&
        !name.includes('london') &&
        !name.includes('washington')
      );
    }
    return true;
  });

  const displayTitle = isHindi 
    ? (filter === 'defense' ? 'रक्षा लेखा परीक्षा कार्यालय' : filter === 'railway' ? 'रेलवे लेखा परीक्षा कार्यालय' : filter === 'overseas' ? 'विदेशी लेखा परीक्षा कार्यालय' : 'अन्य मंत्रालय लेखा परीक्षा कार्यालय')
    : (filter === 'overseas' ? 'Overseas Audit Offices' : filter === 'other' ? 'Other Ministries Audit Offices' : (filter.charAt(0).toUpperCase() + filter.slice(1) + ' Audit Offices'));

  return (
    <OurPresenceLayout title={displayTitle} activeTab={filter}>
      {filter === 'overseas' ? (
        /* Overseas Audit Offices Cards List matching Figma design */
        <div className="flex flex-col gap-4 w-full max-w-[240px]">
          {OVERSEAS_OFFICES.map((item) => (
            <Link
              key={item.id}
              href={item.localUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[240px] min-h-[62px] bg-[#FAFAFA] rounded-[4px] px-4 py-2 flex flex-row items-center justify-between gap-2 hover:bg-[#F2F2F2] hover:border-[#D7D7D7] transition-all cursor-pointer group shadow-none"
            >
              <span className="font-['Noto_Sans'] font-medium text-[14px] leading-[23px] text-[#2A2A2A] text-left flex-1">
                {isHindi ? item.nameHi : item.name}
              </span>
              <span className="w-4 h-4 shrink-0 text-[#2E2E31] group-hover:text-[#751639] transition-colors flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.6667 8.66667V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.0261 13.8595 11.687 14 11.3333 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V4.66667C2 4.31304 2.14048 3.97391 2.39052 3.72386C2.64057 3.47381 2.97971 3.33333 3.33333 3.33333H7.33333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 2H14V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.66666 9.33333L14 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      ) : loading ? (
        <div className="text-center py-10 text-[#751639] font-medium font-['Noto_Sans']">
          {isHindi ? 'केंद्रीय लेखा परीक्षा कार्यालय लोड हो रहे हैं...' : 'Loading Central Audit Offices...'}
        </div>
      ) : filteredOffices.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 font-['Noto_Sans']">
          {isHindi ? 'इस श्रेणी के लिए कोई कार्यालय नहीं मिला।' : 'No offices found for this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffices.map((office) => {
            const details = isHindi && HINDI_OFFICE_TRANSLATIONS[office.id] ? HINDI_OFFICE_TRANSLATIONS[office.id] : {
              name: office.name,
              address: office.address
            };

            return (
              <NamesDetailsCard
                key={office.id}
                title={details.name}
                content={`${isHindi ? 'पता' : 'Address'}: ${details.address}\n${isHindi ? 'फोन' : 'Phone'}: ${office.phone}\n${isHindi ? 'ईमेल' : 'Email'}: ${office.email}`}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.name + ' ' + office.address)}`}
                linkText={isHindi ? 'मानचित्र पर देखें' : 'View on Map'}
              />
            );
          })}
        </div>
      )}
    </OurPresenceLayout>
  );
}

export default function CentralOfficesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#751639] font-medium">Loading Central Offices...</div>}>
      <CentralOfficesPageContent />
    </Suspense>
  );
}
