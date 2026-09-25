'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import OurPresenceLayout from '../../OurPresenceLayout';
import NamesDetailsCard from '@/Reusable components/Cards/Names & Details Cards/NamesDetailsCard';
import { Office } from '@/types';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

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
    name: 'महानिदेशक लेखापरीक्षा का कार्यालय, लंदन (विदेशी कार्यालय)',
    address: 'भारत का उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA'
  },
  'c-over-ldn': {
    name: 'महानिदेशक लेखापरीक्षा का कार्यालय, लंदन (विदेशी कार्यालय)',
    address: 'भारत का उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA, यूनाइटेड किंगडम'
  },
  'c-over-kul': {
    name: 'प्रधान निदेशक लेखापरीक्षा का कार्यालय, कुआलालंपुर (विदेशी कार्यालय)',
    address: 'लेवल 28, मेनारा 1 मॉन्ट कियारा, नंबर 1, जालान कियारा, मॉन्ट कियारा, 50480 कुआलालंपुर, मलेशिया'
  },
  'c-over-wdc': {
    name: 'प्रधान निदेशक लेखापरीक्षा का कार्यालय, वाशिंगटन डीसी (विदेशी कार्यालय)',
    address: 'भारतीय दूतावास, 2107 मैसाचुसेट्स एवेन्यू एनडब्ल्यू, वाशिंगटन, डीसी 20008, संयुक्त राज्य अमेरिका'
  },
  'c-1': {
    name: 'निदेशक महानिदेशक लेखा परीक्षा (डाक एवं दूरसंचार)',
    address: 'शाम नाथ मार्ग, सिविल लाइंस मेट्रो स्टेशन के पास, दिल्ली - 110054'
  }
};

const OVERSEAS_OFFICES_LIST = [
  {
    id: 'pda-wdc',
    name: 'Principal Director of Audit, Washington DC',
    nameHi: 'प्रधान निदेशक लेखापरीक्षा, वाशिंगटन डीसी',
    href: (langCode: string) => `/pda/wdc/${langCode}`,
    isExternal: false,
    isPdf: false,
  },
  {
    id: 'pda-ldn',
    name: 'Principal Director of Audit, London',
    nameHi: 'प्रधान निदेशक लेखापरीक्षा, लंदन',
    href: (langCode: string) => `/pda/ldn/${langCode}`,
    isExternal: false,
    isPdf: false,
  },
  {
    id: 'pda-kul',
    name: 'Principal Director of Audit, Kuala Lumpur',
    nameHi: 'प्रधान निदेशक लेखापरीक्षा, कुआलालंपुर',
    href: (langCode: string) => `/pda/kul/${langCode}`,
    isExternal: false,
    isPdf: false,
  },
  {
    id: 'dea-rome',
    name: 'Director of External Audit, Rome',
    nameHi: 'विदेशी लेखापरीक्षा निदेशक, रोम',
    href: () => '/assets/Director_of_External_Audit_Rome.pdf',
    isExternal: true,
    isPdf: true,
  },
  {
    id: 'dea-geneva',
    name: 'Director of External Audit, Geneva',
    nameHi: 'विदेशी लेखापरीक्षा निदेशक, जिनेवा',
    href: () => '/assets/Director_of_External_Audit_Geneva.pdf',
    isExternal: true,
    isPdf: true,
  },
];

function CentralOfficesPageContent() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'defense';

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
    if (filter === 'overseas') {
      return (
        name.includes('overseas') ||
        name.includes('london') ||
        name.includes('washington') ||
        name.includes('kuala')
      );
    }
    if (filter === 'other') {
      return (
        !name.includes('defense') &&
        !name.includes('defence') &&
        !name.includes('railway') &&
        !name.includes('overseas') &&
        !name.includes('london') &&
        !name.includes('washington') &&
        !name.includes('kuala')
      );
    }
    return true;
  });

  const displayTitle = isHindi 
    ? (filter === 'defense' ? 'रक्षा लेखा परीक्षा कार्यालय' : filter === 'railway' ? 'रेलवे लेखा परीक्षा कार्यालय' : filter === 'overseas' ? 'विदेशी लेखा परीक्षा कार्यालय' : 'अन्य लेखा परीक्षा कार्यालय')
    : (filter === 'overseas' ? 'Overseas Audit Offices' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Audit Offices');

  return (
    <OurPresenceLayout title={displayTitle} activeTab={filter}>
      {filter === 'overseas' ? (
        <div className="flex flex-col gap-4 w-[240px]">
          {OVERSEAS_OFFICES_LIST.map((item) => {
            const langCode = isHindi ? 'hi' : 'en';
            const targetUrl = item.href(langCode);
            const titleText = isHindi ? item.nameHi : item.name;

            const CardContent = (
              <div className="w-[240px] min-h-[62px] bg-[#FAFAFA] rounded-[4px] px-4 py-2 flex items-center justify-between border border-transparent hover:border-[#D7D7D7] hover:bg-[#F2F2F2] transition-colors cursor-pointer group shadow-sm">
                <span className="text-[14px] leading-[23px] font-medium text-[#2A2A2A] font-['Noto_Sans',sans-serif] group-hover:text-[#751639] transition-colors pr-2">
                  {titleText}
                </span>
                <svg
                  className="w-3.5 h-3.5 text-[#2E2E31] shrink-0 group-hover:text-[#751639] transition-colors"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 2H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8M9 2h3m0 0v3m0-3L6 8"
                  />
                </svg>
              </div>
            );

            return (
              <a
                key={item.id}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none"
              >
                {CardContent}
              </a>
            );
          })}
        </div>
      ) : loading ? (
        <div className="text-center py-10 text-[#0a3d30] font-medium">
          {isHindi ? 'केंद्रीय लेखा परीक्षा कार्यालय लोड हो रहे हैं...' : 'Loading Central-Audit-Offices...'}
        </div>
      ) : filteredOffices.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">
          {isHindi ? 'इस श्रेणी के लिए कोई कार्यालय नहीं मिला।' : 'No offices found for this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffices.map((office) => {
            const details = isHindi && HINDI_OFFICE_TRANSLATIONS[office.id] ? HINDI_OFFICE_TRANSLATIONS[office.id] : {
              name: office.name,
              address: office.address
            };

            const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.name + ' ' + office.address)}`;
            const targetHref = office.subsite_url || mapHref;
            const linkText = office.subsite_url
              ? (isHindi ? 'विदेशी उप-साइट पोर्टल खोलें' : 'Visit Directorate Subsite')
              : (isHindi ? 'मानचित्र पर देखें' : 'View on Map');

            return (
              <NamesDetailsCard
                key={office.id}
                title={details.name}
                content={`${isHindi ? 'पता' : 'Address'}: ${details.address}\n${isHindi ? 'फोन' : 'Phone'}: ${office.phone}\n${isHindi ? 'ईमेल' : 'Email'}: ${office.email}`}
                href={targetHref}
                linkText={linkText}
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
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading Central Offices...</div>}>
      <CentralOfficesPageContent />
    </Suspense>
  );
}
