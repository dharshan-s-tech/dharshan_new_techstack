import React from 'react';

interface PdfIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function PdfIcon({ className = 'w-[27px] h-[32px]', width = 27, height = 32 }: PdfIconProps) {
  return (
    <img 
      src="/assets/pdf-red-icon.png" 
      alt="PDF" 
      width={width} 
      height={height} 
      className={`object-contain flex-shrink-0 ${className}`} 
    />
  );
}

