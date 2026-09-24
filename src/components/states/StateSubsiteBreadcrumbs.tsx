'use client';

import React from 'react';
import Link from 'next/link';
import { SubsiteBreadcrumb } from '@/data/stateSubsites/andhraPradeshPages';

interface StateSubsiteBreadcrumbsProps {
  items: SubsiteBreadcrumb[];
  isHindi?: boolean;
}

export default function StateSubsiteBreadcrumbs({
  items,
  isHindi = false
}: StateSubsiteBreadcrumbsProps) {
  return (
    <div className="w-full bg-[#F4F6F8] border-b border-[#E5E7EB] py-[10px] px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto flex items-center gap-[8px] text-[13px] leading-[18px] text-[#6B7280] font-['Noto_Sans',sans-serif]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const label = isHindi && item.labelHi ? item.labelHi : item.label;

          if (isLast || !item.href) {
            return (
              <span key={idx} className="text-[#1F2937] font-medium truncate">
                {label}
              </span>
            );
          }

          return (
            <React.Fragment key={idx}>
              <Link href={item.href} className="hover:text-[#751639] hover:underline transition-colors">
                {label}
              </Link>
              <span className="text-[#9CA3AF] text-[11px]">/</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
