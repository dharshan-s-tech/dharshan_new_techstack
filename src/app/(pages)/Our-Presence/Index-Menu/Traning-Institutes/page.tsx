'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OurPresenceLayout from '../../OurPresenceLayout';
import NamesDetailsCard from '@/Reusable components/Cards/Names & Details Cards/NamesDetailsCard';
import { Office } from '@/types';
import { api } from '@/lib/api';
import { dataManager } from '@/lib/dataManager';

const HINDI_OFFICE_TRANSLATIONS: Record<string, { name: string; address: string; state: string }> = {
  'tr-reg-1': {
    name: 'क्षेत्रीय प्रशिक्षण संस्थान (RTI), बेंगलुरु',
    address: 'बसवा समिति भवन, बेंगलुरु, कर्नाटक - 560001',
    state: 'कर्नाटक'
  },
  'tr-reg-2': {
    name: 'क्षेत्रीय प्रशिक्षण केंद्र (RTC), मुंबई',
    address: 'प्रतिष्ठा भवन, मरीन लाइन्स, मुंबई - 400020',
    state: 'महाराष्ट्र'
  },
  'tr-1': {
    name: 'पर्यावरण लेखा परीक्षा और सतत विकास के लिए अंतर्राष्ट्रीय केंद्र (iCED)',
    address: 'कांत कलवार, रीको औद्योगिक क्षेत्र, एनएच-11सी, जयपुर, राजस्थान - 303002',
    state: 'राजस्थान'
  },
  'tr-2': {
    name: 'सूचना प्रणाली और लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCISA)',
    address: 'सेक्टर 25, नोएडा, उत्तर प्रदेश - 201301',
    state: 'उत्तर प्रदेश'
  },
  'tr-naaa': {
    name: 'राष्ट्रीय लेखा परीक्षा और लेखा अकादमी (NAAA), शिमला',
    address: 'चौरा मैदान, शिमला, हिमाचल प्रदेश - 171004',
    state: 'हिमाचल प्रदेश'
  },
  'tr-ical': {
    name: 'स्थानीय शासन के लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCAL), कोझिकोड',
    address: 'कोझिकोड, केरल - 673001',
    state: 'केरल'
  }
};

function TrainingInstitutesPageContent() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'regional';

  useEffect(() => {
    api.getPresence()
      .then((data) => {
        if (data) {
          setOffices(data.filter(x => x.type === 'training'));
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
    if (filter === 'regional') return name.includes('regional') || name.includes('capacity');
    if (filter === 'iced') return name.includes('iced') || name.includes('environment');
    if (filter === 'icisa') return name.includes('icisa') || name.includes('information');
    if (filter === 'naaa') return name.includes('naaa') || name.includes('academy');
    if (filter === 'ical') return name.includes('ical') || name.includes('local');
    return true;
  });

  const displayTitle = isHindi 
    ? (filter === 'naaa' 
        ? 'राष्ट्रीय लेखा परीक्षा और लेखा अकादमी (NAAA)' 
        : filter === 'iced' 
          ? 'पर्यावरण लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCED)' 
          : filter === 'icisa' 
            ? 'सूचना प्रणाली और लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCISA)' 
            : filter === 'ical' 
              ? 'स्थानीय शासन के लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCAL)' 
              : 'क्षेत्रीय क्षमता निर्माण संस्थान')
    : (filter === 'naaa' 
        ? 'National Academy of Audit & Accounts' 
        : filter === 'iced' 
          ? 'International Centre for Environment Audit' 
          : filter === 'icisa' 
            ? 'International Centre for Information Systems' 
            : filter === 'ical' 
              ? 'International Centre for Audit of Local Governance' 
              : 'Regional Capacity Building Institutes');

  return (
    <OurPresenceLayout title={displayTitle} activeTab={filter}>
      {loading ? (
        <div className="text-center py-10 text-[#0a3d30] font-medium">
          {isHindi ? 'प्रशिक्षण संस्थान लोड हो रहे हैं...' : 'Loading Training Institutes...'}
        </div>
      ) : filteredOffices.length === 0 ? (
        <div className="text-center py-10 text-zinc-500">
          {isHindi ? 'इस श्रेणी के लिए कोई प्रशिक्षण संस्थान नहीं मिला।' : 'No training institutes found for this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffices.map((office) => {
            const details = isHindi && HINDI_OFFICE_TRANSLATIONS[office.id] ? HINDI_OFFICE_TRANSLATIONS[office.id] : {
              name: office.name,
              address: office.address,
              state: office.state
            };

            return (
              <NamesDetailsCard
                key={office.id}
                title={details.name}
                content={`${isHindi ? 'राज्य' : 'State'}: ${details.state}\n${isHindi ? 'पता' : 'Address'}: ${details.address}\n${isHindi ? 'फोन' : 'Phone'}: ${office.phone}\n${isHindi ? 'ईमेल' : 'Email'}: ${office.email}`}
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

export default function TrainingInstitutesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-[#0a3d30] font-medium">Loading Training Institutes...</div>}>
      <TrainingInstitutesPageContent />
    </Suspense>
  );
}
