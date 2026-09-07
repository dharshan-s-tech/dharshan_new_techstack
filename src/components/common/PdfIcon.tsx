import React from 'react';

interface PdfIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function PdfIcon({ className = 'w-6 h-7', width = 24, height = 30 }: PdfIconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 26 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path 
        d="M3 1C1.89543 1 1 1.89543 1 3V29C1 30.1046 1.89543 31 3 31H23C24.1046 31 25 30.1046 25 29V9L17 1H3Z" 
        fill="#FFFFFF" 
        stroke="#E02424" 
        strokeWidth="1.8" 
        strokeLinejoin="round"
      />
      <path 
        d="M17 1V7C17 8.10457 17.8954 9 19 9H25" 
        fill="#FDE8E8" 
        stroke="#E02424" 
        strokeWidth="1.8" 
        strokeLinejoin="round"
      />
      <rect x="0.5" y="14" width="20" height="11" rx="2.5" fill="#E02424" />
      <text 
        x="10.5" 
        y="22.5" 
        fill="#FFFFFF" 
        fontSize="7.5" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="bold" 
        textAnchor="middle" 
        letterSpacing="0.4"
      >
        PDF
      </text>
    </svg>
  );
}
