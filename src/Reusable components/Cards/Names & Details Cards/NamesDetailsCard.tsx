import React from 'react';

export interface NamesDetailsCardProps {
  image?: string;
  title: string;
  subtitle?: string;
  designation?: string;
  category?: string;
  tag?: string;
  date?: string;
  location?: string;
  content?: string;
  desc?: string;
  href?: string;
  linkText?: string;
  onClick?: (e: React.MouseEvent) => void;
  isOfficer?: boolean;
  themeColor?: string;
  className?: string;
}

export default function NamesDetailsCard({
  image,
  title,
  subtitle,
  designation,
  category,
  tag,
  date,
  location,
  content,
  desc,
  href,
  linkText,
  onClick,
  isOfficer,
  themeColor = '#1D2E6B',
  className = '',
}: NamesDetailsCardProps) {
  const displayContent = desc || content;
  const displaySubtitle = subtitle || designation;
  const displayDate = date || location;
  const CardWrapper = href ? 'a' : 'div';
  const isExternal = href?.startsWith('http');

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      if (!href) e.preventDefault();
      onClick(e);
    }
  };

  return (
    <CardWrapper
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={onClick ? handleClick : undefined}
      className={`bg-white border border-[#EDE9E9] rounded-[12px] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] hover:border-[#1D2E6B]/30 flex flex-col justify-between transition-all duration-300 group cursor-pointer ${
        href ? 'cag-card-hover block' : ''
      } ${className}`}
      data-node-id="87:3817"
    >
      <div>
        {/* Top Image Banner with Framing and Zoom */}
        {image ? (
          <div className="relative w-full h-[240px] sm:h-[250px] bg-[#F8F9FA] overflow-hidden flex items-center justify-center border-b border-[#F0F0F0]">
            <img
              src={image}
              alt={title}
              className={`w-full h-full ${
                isOfficer ? 'object-cover object-top' : 'object-cover'
              } group-hover:scale-105 transition-transform duration-500`}
              loading="lazy"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Tag Badge (Top Right) */}
            {tag && (
              <div className="absolute top-3.5 right-3.5 z-10">
                <span 
                  className="px-3 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold rounded-[4px] uppercase tracking-wider shadow-xs"
                >
                  {tag}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 w-full bg-[#1D2E6B]/10 flex items-center justify-center text-[#1D2E6B] font-bold tracking-wider">
            CAG INDIA
          </div>
        )}

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-3">
          {/* Category & Date Row */}
          {(category || displayDate) && (
            <div className="flex items-center justify-between gap-2">
              {category && (
                <div className="flex items-center gap-1.5 text-[#2A2A2A] font-semibold text-[14px]">
                  <span className="text-[#1D2E6B] font-bold">→</span>
                  <span className="line-clamp-1">{category}</span>
                </div>
              )}
              {displayDate && (
                <div className="px-2.5 py-0.5 bg-[#F3F4F6] text-[#4B5563] text-[12px] font-semibold rounded-[4px] shrink-0">
                  {displayDate}
                </div>
              )}
            </div>
          )}

          {/* Title / Name */}
          <div className="flex flex-col gap-0.5">
            <h3 className="font-bold text-[18px] sm:text-[20px] text-[#2A2A2A] leading-snug group-hover:text-[#1D2E6B] transition-colors line-clamp-2 font-['Noto_Sans']">
              {title}
            </h3>
            {displaySubtitle && (
              <p className="text-[13px] font-semibold text-[#1D2E6B] leading-tight font-['Noto_Sans']">
                {displaySubtitle}
              </p>
            )}
          </div>

          {/* Excerpt / Bio Body */}
          {displayContent && (
            <p className="text-[13.5px] sm:text-[14px] leading-[22px] font-normal text-[#565656] line-clamp-2 font-['Noto_Sans']">
              {displayContent}
            </p>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      {(href || onClick || linkText || isOfficer) && (
        <div className="px-5 sm:px-6 pb-5 pt-1 flex items-center justify-between border-t border-[#F3F4F6]/80 mt-2">
          <button
            type="button"
            onClick={onClick ? handleClick : undefined}
            className="px-3.5 py-1.5 bg-[#1D2E6B] hover:bg-[#152250] text-white text-[12px] font-semibold rounded-[4px] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer border-none"
            style={{ backgroundColor: themeColor }}
          >
            <span>{linkText || (isOfficer ? 'Profile' : 'Read details')}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </CardWrapper>
  );
}

