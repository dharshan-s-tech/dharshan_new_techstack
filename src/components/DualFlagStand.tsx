'use client';

import React from 'react';

interface DualFlagStandProps {
  country: string;
}

export default function DualFlagStand({ country }: DualFlagStandProps) {
  // Render exact flag design on right pole matching Figma artwork
  const renderRightFlagContent = (c: string) => {
    switch (c.toLowerCase()) {
      case 'bhutan':
        return (
          <g>
            <path d="M0 0 L54 0 L0 36 Z" fill="#FFB800" />
            <path d="M54 0 L54 36 L0 36 Z" fill="#FF4E00" />
            <path d="M15 25 Q27 18 38 12 Q32 20 22 28 Z" fill="#FFFFFF" stroke="#333333" strokeWidth="0.6" />
            <circle cx="20" cy="22" r="1.5" fill="#FFFFFF" />
            <circle cx="34" cy="14" r="1.5" fill="#FFFFFF" />
          </g>
        );
      case 'brazil':
        return (
          <g>
            <rect width="54" height="36" rx="1" fill="#009B3A" />
            <polygon points="27,4 49,18 27,32 5,18" fill="#FED100" />
            <circle cx="27" cy="18" r="8" fill="#002776" />
            <path d="M20 18.5 Q27 15 34 18.5" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          </g>
        );
      case 'cambodia':
        return (
          <g>
            <rect width="54" height="9" fill="#003580" />
            <rect y="9" width="54" height="18" fill="#E60012" />
            <rect y="27" width="54" height="9" fill="#003580" />
            {/* Angkor Wat Silhouette */}
            <path d="M21 23 H33 V15 H21 Z M24 15 V11 H30 V15 M27 11 V8 H27.1" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="0.8" />
          </g>
        );
      case 'chile':
        return (
          <g>
            <rect width="54" height="18" fill="#FFFFFF" />
            <rect y="18" width="54" height="18" fill="#D52B1E" />
            <rect width="18" height="18" fill="#0039A6" />
            <polygon points="9,3 11,8 16,8 12,11 14,16 9,13 4,16 6,11 2,8 7,8" fill="#FFFFFF" />
          </g>
        );
      case 'china':
        return (
          <g>
            <rect width="54" height="36" fill="#DE2910" />
            {/* Big Star */}
            <polygon points="9,4 11,10 17,10 12,13 14,19 9,15 4,19 6,13 1,10 7,10" fill="#FFDE00" />
            {/* Small Stars */}
            <circle cx="19" cy="5" r="1.2" fill="#FFDE00" />
            <circle cx="22" cy="9" r="1.2" fill="#FFDE00" />
            <circle cx="22" cy="14" r="1.2" fill="#FFDE00" />
            <circle cx="19" cy="18" r="1.2" fill="#FFDE00" />
          </g>
        );
      case 'indonesia':
        return (
          <g>
            <rect width="54" height="18" fill="#FF0000" />
            <rect y="18" width="54" height="18" fill="#FFFFFF" />
          </g>
        );
      case 'israel':
        return (
          <g>
            <rect width="54" height="36" fill="#FFFFFF" />
            <rect y="3" width="54" height="5" fill="#0038B8" />
            <rect y="28" width="54" height="5" fill="#0038B8" />
            {/* Star of David */}
            <polygon points="27,11 33,21 21,21" fill="none" stroke="#0038B8" strokeWidth="1.5" />
            <polygon points="27,25 33,15 21,15" fill="none" stroke="#0038B8" strokeWidth="1.5" />
          </g>
        );
      case 'kazakhstan':
        return (
          <g>
            <rect width="54" height="36" fill="#00AFCA" />
            <circle cx="27" cy="17" r="5" fill="#FEC50C" />
            <path d="M18 22 Q27 19 36 22" stroke="#FEC50C" strokeWidth="1.5" fill="none" />
            <rect width="4" height="36" fill="#FEC50C" />
          </g>
        );
      case 'korea':
        return (
          <g>
            <rect width="54" height="36" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.5" />
            {/* Taegeuk Circle */}
            <path d="M27 10 A8 8 0 0 1 27 26 A4 4 0 0 1 27 18 A4 4 0 0 0 27 10" fill="#CD2E3A" />
            <path d="M27 26 A8 8 0 0 1 27 10 A4 4 0 0 1 27 18 A4 4 0 0 0 27 26" fill="#0047A0" />
            {/* Trigrams */}
            <line x1="14" y1="10" x2="18" y2="14" stroke="#000000" strokeWidth="1.5" />
            <line x1="36" y1="22" x2="40" y2="26" stroke="#000000" strokeWidth="1.5" />
            <line x1="36" y1="10" x2="40" y2="14" stroke="#000000" strokeWidth="1.5" />
            <line x1="14" y1="22" x2="18" y2="26" stroke="#000000" strokeWidth="1.5" />
          </g>
        );
      case 'kuwait':
        return (
          <g>
            <rect width="54" height="12" fill="#007A3D" />
            <rect y="12" width="54" height="12" fill="#FFFFFF" />
            <rect y="24" width="54" height="12" fill="#CE1126" />
            <polygon points="0,0 15,12 15,24 0,36" fill="#000000" />
          </g>
        );
      case 'maldives':
        return (
          <g>
            <rect width="54" height="36" fill="#D21034" />
            <rect x="10" y="7" width="34" height="22" fill="#007E3A" />
            <circle cx="29" cy="18" r="6" fill="#FFFFFF" />
            <circle cx="31" cy="18" r="6" fill="#007E3A" />
          </g>
        );
      case 'iran':
        return (
          <g>
            <rect width="54" height="12" fill="#239F40" />
            <rect y="12" width="54" height="12" fill="#FFFFFF" />
            <rect y="24" width="54" height="12" fill="#DA0000" />
            {/* Emblem */}
            <circle cx="27" cy="18" r="3.5" fill="#DA0000" />
          </g>
        );
      case 'russia':
        return (
          <g>
            <rect width="54" height="12" fill="#FFFFFF" />
            <rect y="12" width="54" height="12" fill="#0039A6" />
            <rect y="24" width="54" height="12" fill="#D52B1E" />
          </g>
        );
      case 'bahrain':
        return (
          <g>
            <rect width="54" height="36" fill="#CE1126" />
            <polygon points="0,0 13,0 20,3.6 13,7.2 20,10.8 13,14.4 20,18 13,21.6 20,25.2 13,28.8 20,32.4 13,36 0,36" fill="#FFFFFF" />
          </g>
        );
      case 'malaysia':
        return (
          <g>
            <rect width="54" height="36" fill="#CC0000" />
            <rect y="2.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect y="7.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect y="12.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect y="17.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect y="22.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect y="27.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect y="32.5" width="54" height="2.5" fill="#FFFFFF" />
            <rect width="27" height="20" fill="#000066" />
            <circle cx="10" cy="10" r="5" fill="#FFCC00" />
            <circle cx="12" cy="10" r="5" fill="#000066" />
          </g>
        );
      case 'mongolia':
        return (
          <g>
            <rect width="18" height="36" fill="#E4002B" />
            <rect x="18" width="18" height="36" fill="#0033A0" />
            <rect x="36" width="18" height="36" fill="#E4002B" />
            <circle cx="9" cy="12" r="3.5" fill="#FFD100" />
          </g>
        );
      case 'morocco':
        return (
          <g>
            <rect width="54" height="36" fill="#C1272D" />
            <polygon points="27,10 29.5,18 36.5,18 30.5,22 33,30 27,25 21,30 23.5,22 17.5,18 24.5,18" fill="none" stroke="#006233" strokeWidth="1.6" />
          </g>
        );
      case 'myanmar':
        return (
          <g>
            <rect width="54" height="12" fill="#FECB00" />
            <rect y="12" width="54" height="12" fill="#34B233" />
            <rect y="24" width="54" height="12" fill="#EA2839" />
            <polygon points="27,7 29.5,15 37.5,15 31,19.5 33.5,27.5 27,23 20.5,27.5 23,19.5 16.5,15 24.5,15" fill="#FFFFFF" />
          </g>
        );
      case 'nepal':
        return (
          <g>
            <rect width="54" height="36" fill="#FFFFFF" />
            <path d="M4 2 L32 16 L14 16 L35 34 L4 34 Z" fill="#DC143C" stroke="#003896" strokeWidth="1.5" />
            <circle cx="12" cy="10" r="2.5" fill="#FFFFFF" />
            <circle cx="14" cy="24" r="3" fill="#FFFFFF" />
          </g>
        );
      case 'oman':
        return (
          <g>
            <rect width="54" height="12" fill="#FFFFFF" />
            <rect y="12" width="54" height="12" fill="#008000" />
            <rect y="24" width="54" height="12" fill="#DB161B" />
            <rect width="16" height="36" fill="#DB161B" />
          </g>
        );
      case 'philippines':
        return (
          <g>
            <rect width="54" height="18" fill="#0038A8" />
            <rect y="18" width="54" height="18" fill="#CE1126" />
            <polygon points="0,0 23,18 0,36" fill="#FFFFFF" />
            <circle cx="7" cy="18" r="3" fill="#FCD116" />
          </g>
        );
      case 'poland':
        return (
          <g>
            <rect width="54" height="18" fill="#FFFFFF" />
            <rect y="18" width="54" height="18" fill="#DC143C" />
          </g>
        );
      case 'saudi arabia':
        return (
          <g>
            <rect width="54" height="36" fill="#006C35" />
            <path d="M12 25 H42" stroke="#FFFFFF" strokeWidth="1.8" />
            <text x="27" y="17" font-family="sans-serif" font-size="7" fill="#FFFFFF" textAnchor="middle" font-weight="bold">الـلـه</text>
          </g>
        );
      case 'south africa':
        return (
          <g>
            <rect width="54" height="18" fill="#E03C31" />
            <rect y="18" width="54" height="18" fill="#001489" />
            <path d="M0 0 L22 18 L0 36 Z" fill="#000000" stroke="#FFB81C" strokeWidth="1.8" />
            <path d="M22 18 H54" stroke="#FFFFFF" strokeWidth="3.5" />
            <path d="M22 18 H54" stroke="#007A3D" strokeWidth="1.8" />
          </g>
        );
      default:
        return (
          <g>
            <rect width="54" height="18" fill="#0038A8" />
            <rect y="18" width="54" height="18" fill="#CE1126" />
          </g>
        );
    }
  };

  return (
    <div className="w-[100px] h-[100px] flex items-center justify-center relative select-none">
      <svg viewBox="0 0 160 140" className="w-full h-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]">
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="goldPole" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B38728" />
            <stop offset="30%" stopColor="#FBF5B7" />
            <stop offset="70%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#AA771C" />
          </linearGradient>

          <linearGradient id="goldBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="85%" stopColor="#AA771C" />
            <stop offset="100%" stopColor="#664400" />
          </linearGradient>

          <radialGradient id="goldSphere" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFE066" />
            <stop offset="75%" stopColor="#C59B27" />
            <stop offset="100%" stopColor="#7A5600" />
          </radialGradient>

          {/* Soft Shadow Filter under Flags & Stand */}
          <filter id="standShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 3D Circular Metallic Gold Pedestal Base */}
        <g id="BasePedestal">
          {/* Bottom Drop Shadow Oval */}
          <ellipse cx="80" cy="126" rx="42" ry="8" fill="#000000" opacity="0.18" />
          {/* Outer Base Ring */}
          <ellipse cx="80" cy="122" rx="38" ry="9" fill="url(#goldBase)" stroke="#8A640F" strokeWidth="0.8" />
          <ellipse cx="80" cy="120" rx="30" ry="6.5" fill="#FFE885" opacity="0.7" />
          {/* Center Raised Pedestal Mound */}
          <ellipse cx="80" cy="118" rx="20" ry="4.5" fill="url(#goldBase)" />
          <ellipse cx="80" cy="116" rx="12" ry="2.8" fill="#FFF4BD" />
        </g>

        {/* CROSSED GOLDEN POLES ('X' Shape Arrangement) */}
        <g id="Poles" filter="url(#standShadow)">
          {/* Pole 1: Left-to-Right diagonal pole (behind) */}
          <line x1="38" y1="22" x2="122" y2="118" stroke="url(#goldPole)" strokeWidth="4" strokeLinecap="round" />
          {/* Pole 2: Right-to-Left diagonal pole (in front) */}
          <line x1="122" y1="22" x2="38" y2="118" stroke="url(#goldPole)" strokeWidth="4" strokeLinecap="round" />

          {/* Center Golden Crossing Joint Ring */}
          <circle cx="80" cy="70" r="5" fill="url(#goldSphere)" stroke="#8A640F" strokeWidth="0.8" />

          {/* Top Sphere Finials */}
          <circle cx="38" cy="22" r="5.5" fill="url(#goldSphere)" stroke="#996515" strokeWidth="0.6" />
          <circle cx="122" cy="22" r="5.5" fill="url(#goldSphere)" stroke="#996515" strokeWidth="0.6" />
        </g>

        {/* LEFT FLAG: INDIA TRICOLOR (Waving Leftwards attached to Pole 1) */}
        <g transform="translate(38, 25) rotate(-22) scale(0.72)" filter="url(#standShadow)">
          {/* Waving Flag Background Clip */}
          <g>
            <rect width="54" height="12" fill="#FF9933" />
            <rect y="12" width="54" height="12" fill="#FFFFFF" />
            <rect y="24" width="54" height="12" fill="#128807" />
            {/* Ashoka Chakra */}
            <circle cx="27" cy="18" r="4.5" fill="none" stroke="#000080" strokeWidth="1" />
            <path d="M27 13.5 V22.5 M22.5 18 H31.5 M23.8 14.8 L30.2 21.2 M23.8 21.2 L30.2 14.8" stroke="#000080" strokeWidth="0.7" />
          </g>
          {/* Realistic Flag Wave Overlay (Shading/Highlights) */}
          <path d="M0 0 Q13.5 4 27 0 Q40.5 -4 54 0 V36 Q40.5 32 27 36 Q13.5 40 0 36 Z" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        </g>

        {/* RIGHT FLAG: PARTNER COUNTRY (Waving Rightwards attached to Pole 2) */}
        <g transform="translate(68, 25) rotate(22) scale(0.72)" filter="url(#standShadow)">
          {renderRightFlagContent(country)}
          {/* Realistic Flag Wave Overlay (Shading/Highlights) */}
          <path d="M0 0 Q13.5 4 27 0 Q40.5 -4 54 0 V36 Q40.5 32 27 36 Q13.5 40 0 36 Z" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
