'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  const filter = searchParams.get('filter') || 'defense';

  useEffect(() => {
    api.getPresence()
      .then((data) => {
        if (data) {
          setOffices(data.filter(x => x.type === 'central'));
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
    ? (filter === 'defense' ? 'रक्षा लेखा परीक्षा कार्यालय' : filter === 'railway' ? 'रेलवे लेखा परीक्षा कार्यालय' : filter === 'overseas' ? 'विदेशी लेखा परीक्षा कार्यालय' : 'अन्य लेखा परीक्षा कार्यालय')
    : (filter.charAt(0).toUpperCase() + filter.slice(1) + ' Audit Offices');

  return (
    <OurPresenceLayout title={displayTitle} activeTab={filter}>
      {loading ? (
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
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading Central Offices...</div>}>
      <CentralOfficesPageContent />
    </Suspense>
  );
}
