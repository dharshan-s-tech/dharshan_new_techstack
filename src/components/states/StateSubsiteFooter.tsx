'use client';

import React from 'react';
import Link from 'next/link';

interface StateSubsiteFooterProps {
  isHindi?: boolean;
  officeTitle?: string;
  officeTitleHi?: string;
}

export default function StateSubsiteFooter({ isHindi = false, officeTitle, officeTitleHi }: StateSubsiteFooterProps) {
  const t = {
    copyrightPolicy: isHindi ? 'कॉपीराइट नीति' : 'Copyright Policy',
    disclaimer: isHindi ? 'अस्वीकरण' : 'Disclaimer',
    help: isHindi ? 'सहायता' : 'Help',
    hyperlinkingPolicy: isHindi ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy',
    privacyPolicy: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy',
    screenReader: isHindi ? 'स्क्रीन रीडर एक्सेस' : 'Screen Reader Access',
    termsConditions: isHindi ? 'नियम एवं शर्तें' : 'Terms & Conditions',
    archive: isHindi ? 'संग्रह' : 'Archive',
    copyrightFooter: isHindi
      ? (officeTitleHi ? `© कॉपीराइट 2026 - सामग्री ${officeTitleHi} के पास है। सर्व अधिकार सुरक्षित।` : '© कॉपीराइट 2026 - सामग्री प्रधान महालेखाकार (लेखा एवं हकदारी), आंध्र प्रदेश, विजयवाड़ा के पास है। सर्व अधिकार सुरक्षित।')
      : (officeTitle ? `© Copyright 2026 - Content Owned by ${officeTitle}. All Rights Reserved.` : '© Copyright 2026 - Content Owned by Principal Accountant General (A&E), Andhra Pradesh, Vijayawada. All Rights Reserved.'),
    lastUpdated: isHindi ? 'पृष्ठ अंतिम बार अपडेट किया गया : 23 सितम्बर 2026' : 'Page last updated : 23 Sep 2026'
  };

  return (
    <footer className="w-full flex flex-col font-['Noto_Sans',sans-serif] mt-auto">
      {/* Top Footer Bar */}
      <div className="w-full bg-[#0A3D30] py-[20px] px-4 md:px-[64px] flex justify-center items-center box-border">
        <div className="max-w-[1312px] w-full flex flex-wrap justify-center items-center gap-[16px] md:gap-[24px] text-[14px] md:text-[15px] font-normal text-white">
          <Link href="/" className="hover:underline">{t.copyrightPolicy}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.disclaimer}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.help}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.hyperlinkingPolicy}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.privacyPolicy}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.screenReader}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.termsConditions}</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="hover:underline">{t.archive}</Link>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="w-full bg-[#2A2A2A] min-h-[44px] px-4 md:px-[64px] py-[10px] flex flex-col md:flex-row justify-between items-center text-[13px] md:text-[14px] font-normal text-white box-border gap-2">
        <span className="text-center md:text-left">{t.copyrightFooter}</span>
        <span className="shrink-0 text-white/80">{t.lastUpdated}</span>
      </div>
    </footer>
  );
}

