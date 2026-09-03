import React from 'react';

interface NamesDetailsCardProps {
  image?: string;
  title: string;
  content: string;
  href?: string;
  linkText?: string;
}

export default function NamesDetailsCard({ image, title, content, href, linkText }: NamesDetailsCardProps) {
  const CardWrapper = href ? 'a' : 'div';
  const isExternal = href?.startsWith('http');
  
  return (
    <CardWrapper 
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`bg-white border border-[#d7d7d7] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between ${
        href ? 'cag-card-hover cursor-pointer block' : ''
      }`}
    >
      <div>
        {image ? (
          <div className="h-48 w-full relative bg-zinc-200">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-48 w-full bg-[#0a3d30]/10 flex items-center justify-center text-[#0a3d30] font-bold">
            CAG INDIA
          </div>
        )}
        <div className="p-5 space-y-2">
          <h4 className="font-bold text-sm text-[#2a2a2a] leading-tight">{title}</h4>
          <div className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line">{content}</div>
        </div>
      </div>
      {href && (
        <div className="px-5 pb-5 pt-2">
          <span className="text-xs font-semibold text-[#0a3d30] flex items-center gap-1">
            {linkText || 'Read details'} ➔
          </span>
        </div>
      )}
    </CardWrapper>
  );
}
