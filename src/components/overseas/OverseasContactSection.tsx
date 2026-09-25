'use client';

import React from 'react';
import { OVERSEAS_OFFICES } from '@/data/overseas/overseasOffices';

interface OverseasContactSectionProps {
  officeId: 'kul' | 'ldn' | 'wdc';
  lang?: string;
  subsiteData?: any;
}

export default function OverseasContactSection({ officeId, lang = 'en', subsiteData }: OverseasContactSectionProps) {
  const isHi = lang === 'hi';
  const office = subsiteData || OVERSEAS_OFFICES[officeId] || OVERSEAS_OFFICES.kul;
  const title = isHi ? (office.title_hi || office.titleHi) : office.title;
  const address = isHi ? (office.address_hi || office.addressHi) : office.address;
  const workingHours = isHi ? (office.working_hours_hi || '09:00 AM – 17:30 PM (सोमवार-शुक्रवार)') : (office.working_hours || 'Monday – Friday: 09:00 – 17:30');

  return (
    <div className="w-full space-y-8 my-6">
      {/* 1. Header Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {isHi ? 'चांसरी संपर्क एवं स्थान विवरण' : 'Chancery Address & Diplomatic Liaison'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {isHi
            ? `${title} से आधिकारिक पत्राचार एवं संपर्क हेतु विवरण:`
            : `Official diplomatic lines, physical location, and electronic correspondence details for ${title}:`}
        </p>
      </div>

      {/* 2. Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Physical Address */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isHi ? 'चांसरी भौतिक पता' : 'Physical Chancery Location'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {address}
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            {office.chanceryPropertyStatus || (isHi ? 'आधिकारिक चांसरी परिसर' : 'Official Chancery Premises')}
          </div>
        </div>

        {/* Card 2: Telephony & Email */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isHi ? 'टेलीफोन एवं ईमेल' : 'Telephone & Secure Email'}
          </h3>
          <div className="space-y-1 text-xs">
            <div>
              <span className="font-semibold text-slate-700">Tel:</span>{' '}
              <a href={`tel:${office.phone}`} className="hover:text-emerald-700 font-mono">
                {office.phone}
              </a>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Email:</span>{' '}
              <a href={`mailto:${office.email}`} className="text-emerald-700 hover:underline">
                {office.email}
              </a>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-1">
            {isHi ? 'एनआईसी सुरक्षित मेल गेटवे द्वारा संचालित।' : 'Powered by official NIC secure mail gateway.'}
          </div>
        </div>

        {/* Card 3: Working Hours & Protocols */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isHi ? 'कार्यालय समय एवं कार्यप्रणाली' : 'Office Hours & Protocols'}
          </h3>
          <div className="text-xs text-slate-600 space-y-1">
            <div><strong>{workingHours}</strong></div>
            <div><strong>Saturday & Sunday:</strong> Closed / बंद</div>
            <div className="text-[11px] text-slate-500 pt-1">
              {isHi
                ? 'स्थानीय चांसरी समय एवं द्विपक्षीय अवकाश कैलेंडर के अनुसार।'
                : 'Follows local chancery time & gazetted diplomatic holiday calendar.'}
            </div>
          </div>
        </div>
      </div>


      {/* 3. Interactive Map Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 text-base">
            {isHi ? 'गूगल मानचित्र पर चांसरी देखें' : 'Locate Chancery on Interactive World Map'}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {isHi
              ? 'भारतीय मिशन एवं चांसरी परिसर का उपग्रह दृश्य एवं मार्ग दर्शन।'
              : 'Direct route navigation and diplomatic quarter location.'}
          </p>
        </div>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.title + ' ' + office.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow transition-colors"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>{isHi ? 'मानचित्र खोलें' : 'Open Google Maps'}</span>
        </a>
      </div>
    </div>
  );
}
