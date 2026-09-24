'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SubsiteSidebarItem } from '@/data/stateSubsites/andhraPradeshPages';

interface StateSubsiteSidebarProps {
  heading: string;
  headingHi?: string;
  items: SubsiteSidebarItem[];
  isHindi?: boolean;
}

export default function StateSubsiteSidebar({
  heading,
  headingHi,
  items,
  isHindi = false
}: StateSubsiteSidebarProps) {
  const pathname = usePathname();
  const decodedPathname = decodeURIComponent(pathname || '').replace(/\/$/, '').toLowerCase();

  return (
    <aside className="w-full lg:w-[280px] shrink-0 font-['Noto_Sans',sans-serif]">
      <div className="bg-white rounded-[8px] border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] p-[20px] flex flex-col gap-[16px]">
        {/* Sidebar Heading */}
        <h2 className="text-[20px] leading-[28px] font-bold text-[#2A2A2A] border-b border-[#F0F0F0] pb-[12px]">
          {isHindi && headingHi ? headingHi : heading}
        </h2>

        {/* Sidebar Nav Items */}
        <nav className="flex flex-col gap-[6px]">
          {items.map((item) => {
            const decodedItemHref = decodeURIComponent(item.href || '').replace(/\/$/, '').toLowerCase();
            const isActive =
              pathname === item.href ||
              (decodedItemHref !== '' && decodedItemHref !== '#' && decodedPathname === decodedItemHref);
            const label = isHindi && item.titleHi ? item.titleHi : item.title;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`text-[14px] leading-[22px] px-[14px] py-[10px] rounded-[6px] transition-all block ${
                  isActive
                    ? 'bg-[#FDF2F4] text-[#751639] font-semibold border-l-4 border-[#751639]'
                    : 'text-[#4D4D4D] hover:bg-[#F9FAFB] hover:text-[#751639] font-normal'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
