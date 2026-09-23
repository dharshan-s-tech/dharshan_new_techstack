'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import OfficePortalTemplate from '@/components/office/OfficePortalTemplate';

const OFFICE_METADATA_MAP: Record<string, {
  officeNameEn: string;
  officeNameHi: string;
  locationEn: string;
  locationHi: string;
  themeColor?: string;
  externalOfficialUrl?: string;
}> = {
  'overseas-london': {
    officeNameEn: 'Principal Director of Audit',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा',
    locationEn: 'London, United Kingdom',
    locationHi: 'लंदन, यूनाइटेड किंगडम',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/pda-london/en'
  },
  'overseas-ldn': {
    officeNameEn: 'Principal Director of Audit',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा',
    locationEn: 'London, United Kingdom',
    locationHi: 'लंदन, यूनाइटेड किंगडम',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/pda-london/en'
  },
  'overseas-washington': {
    officeNameEn: 'Principal Director of Audit',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा',
    locationEn: 'Washington D.C., USA',
    locationHi: 'वाशिंगटन डीसी, यूएसए',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/pda-washington/en'
  },
  'overseas-wdc': {
    officeNameEn: 'Principal Director of Audit',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा',
    locationEn: 'Washington D.C., USA',
    locationHi: 'वाशिंगटन डीसी, यूएसए',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/pda-washington/en'
  },
  'overseas-kualalumpur': {
    officeNameEn: 'Principal Director of Audit',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा',
    locationEn: 'Kuala Lumpur, Malaysia',
    locationHi: 'कुआलालंपुर, मलेशिया',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/pda-kualalumpur/en'
  },
  'overseas-kul': {
    officeNameEn: 'Principal Director of Audit',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा',
    locationEn: 'Kuala Lumpur, Malaysia',
    locationHi: 'कुआलालंपुर, मलेशिया',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/pda-kualalumpur/en'
  },
  'overseas-rome': {
    officeNameEn: 'Director of External Audit',
    officeNameHi: 'बाह्य लेखा परीक्षा निदेशक',
    locationEn: 'Rome, Italy',
    locationHi: 'रोम, इटली',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/en/external-audit-rome'
  },
  'overseas-rom': {
    officeNameEn: 'Director of External Audit',
    officeNameHi: 'बाह्य लेखा परीक्षा निदेशक',
    locationEn: 'Rome, Italy',
    locationHi: 'रोम, इटली',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/en/external-audit-rome'
  },
  'overseas-geneva': {
    officeNameEn: 'Director of External Audit',
    officeNameHi: 'बाह्य लेखा परीक्षा निदेशक',
    locationEn: 'Geneva, Switzerland',
    locationHi: 'जिनेवा, स्विट्जरलैंड',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/en/external-audit-geneva'
  },
  'overseas-gva': {
    officeNameEn: 'Director of External Audit',
    officeNameHi: 'बाह्य लेखा परीक्षा निदेशक',
    locationEn: 'Geneva, Switzerland',
    locationHi: 'जिनेवा, स्विट्जरलैंड',
    themeColor: '#1D2E6B',
    externalOfficialUrl: 'https://cag.gov.in/en/external-audit-geneva'
  },
  'andhra-pradesh': {
    officeNameEn: 'Principal Accountant General (A&E)',
    officeNameHi: 'प्रधान महालेखाकार (लेखा एवं हकदारी)',
    locationEn: 'Andhra Pradesh, Vijayawada',
    locationHi: 'आंध्र प्रदेश, विजयवाड़ा',
    themeColor: '#0A3D30',
    externalOfficialUrl: 'https://cag.gov.in/ae/andhra-pradesh/en'
  }
};

export default function DynamicOfficePortalPage() {
  const params = useParams();
  const slug = String(params?.slug || 'andhra-pradesh').toLowerCase();
  const defaultTheme = slug.startsWith('overseas-') ? '#1D2E6B' : '#0A3D30';

  const metadata = OFFICE_METADATA_MAP[slug] || {
    officeNameEn: 'Office of the Principal Accountant General',
    officeNameHi: 'प्रधान महालेखाकार का कार्यालय',
    locationEn: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    locationHi: slug.replace(/-/g, ' '),
    themeColor: defaultTheme
  };

  return (
    <OfficePortalTemplate
      officeNameEn={metadata.officeNameEn}
      officeNameHi={metadata.officeNameHi}
      locationEn={metadata.locationEn}
      locationHi={metadata.locationHi}
      themeColor={metadata.themeColor || defaultTheme}
      externalOfficialUrl={metadata.externalOfficialUrl}
    />
  );
}
