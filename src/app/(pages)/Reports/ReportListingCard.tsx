'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReportDownloadIcon from '@/components/common/ReportDownloadIcon';

export interface ReportListingCardData {
  id: string;
  title: string;
  image?: string;
  tag?: string;
  date?: string;
  year?: string;
  sector?: string;
  pdfUrl?: string;
  pdf_url?: string;
  cta?: string;
  label?: string;
}

interface ReportListingCardProps {
  report: ReportListingCardData;
  isHindi?: boolean;
  className?: string;
  index?: number;
}

// 0: Women group in colorful saris (Education / Health / Civil)
// 1: Defence missile parade with crowd and flag
// 2: Red locomotive train on tracks
const FIGMA_SAMPLE_IMAGES = [
  'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png',
  'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png',
  'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg',
];
const SCREENSHOT_IMG_SEQ = [0, 1, 2, 1, 2, 0, 2, 0, 1];

const FIGMA_CARDS_PATTERN = [
  {
    tag: 'Finance',
    tagHi: 'वित्त',
    date: 'Jun 4, 2026',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    titleHi: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    cta: 'Download Full Report',
    ctaHi: 'पूरी रिपोर्ट डाउनलोड करें',
    sector: 'Sector: Finance',
    sectorHi: 'क्षेत्र: वित्त'
  },
  {
    tag: 'Marketing',
    tagHi: 'विपणन',
    date: 'Jul 15, 2026',
    title: 'Annual Marketing Strategy Overview with insights into trends and projections',
    titleHi: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    cta: 'Access Full Strategy Document',
    ctaHi: 'रणनीति दस्तावेज़ देखें',
    sector: 'Sector: Finance | Information and Communication',
    sectorHi: 'क्षेत्र: वित्त | सूचना एवं संचार'
  },
  {
    tag: 'Technology',
    tagHi: 'प्रौद्योगिकी',
    date: 'Aug 30, 2026',
    title: 'Emerging Tech Innovations and their Impact on the Industry Landscape',
    titleHi: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    cta: 'View Complete Analysis',
    ctaHi: 'पूर्ण विश्लेषण देखें',
    sector: 'Sector: Finance',
    sectorHi: 'क्षेत्र: वित्त'
  },
  {
    tag: 'Finance',
    tagHi: 'वित्त',
    date: 'Jun 4, 2026',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    titleHi: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    cta: 'Download Full Report',
    ctaHi: 'पूरी रिपोर्ट डाउनलोड करें',
    sector: 'Sector: Finance',
    sectorHi: 'क्षेत्र: वित्त'
  },
  {
    tag: 'Marketing',
    tagHi: 'विपणन',
    date: 'Jul 15, 2026',
    title: 'Annual Marketing Strategy Overview with insights into trends and projections',
    titleHi: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    cta: 'Access Full Strategy Document',
    ctaHi: 'रणनीति दस्तावेज़ देखें',
    sector: 'Sector: Finance',
    sectorHi: 'क्षेत्र: वित्त'
  },
  {
    tag: 'Technology',
    tagHi: 'प्रौद्योगिकी',
    date: 'Aug 30, 2026',
    title: 'Emerging Tech Innovations and their Impact on the Industry Landscape',
    titleHi: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    cta: 'View Complete Analysis',
    ctaHi: 'पूर्ण विश्लेषण देखें',
    sector: 'Sector: Tax and Duties',
    sectorHi: 'क्षेत्र: कर और शुल्क'
  },
  {
    tag: 'Finance',
    tagHi: 'वित्त',
    date: 'Jun 4, 2026',
    title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    titleHi: 'रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है, संक्षिप्त विवरण और मुख्य बिंदु',
    cta: 'Download Full Report',
    ctaHi: 'पूरी रिपोर्ट डाउनलोड करें',
    sector: 'Sector: Environment and Sustainable Development',
    sectorHi: 'क्षेत्र: पर्यावरण और सतत विकास'
  },
  {
    tag: 'Marketing',
    tagHi: 'विपणन',
    date: 'Jul 15, 2026',
    title: 'Annual Marketing Strategy Overview with insights into trends and projections',
    titleHi: 'रुझानों और अनुमानों में अंतर्दृष्टि के साथ वार्षिक विपणन रणनीति का अवलोकन',
    cta: 'Access Full Strategy Document',
    ctaHi: 'रणनीति दस्तावेज़ देखें',
    sector: 'Sector: Finance',
    sectorHi: 'क्षेत्र: वित्त'
  },
  {
    tag: 'Technology',
    tagHi: 'प्रौद्योगिकी',
    date: 'Aug 30, 2026',
    title: 'Emerging Tech Innovations and their Impact on the Industry Landscape',
    titleHi: 'उभरते तकनीकी नवाचार और उद्योग परिदृश्य पर उनका प्रभाव',
    cta: 'View Complete Analysis',
    ctaHi: 'पूर्ण विश्लेषण देखें',
    sector: 'Sector: Finance',
    sectorHi: 'क्षेत्र: वित्त'
  }
];

export default function ReportListingCard({
  report,
  isHindi = false,
  className = '',
  index = 0
}: ReportListingCardProps) {
  const router = useRouter();

  const pattern = FIGMA_CARDS_PATTERN[index % FIGMA_CARDS_PATTERN.length];
  const fallbackImg = FIGMA_SAMPLE_IMAGES[SCREENSHOT_IMG_SEQ[index % SCREENSHOT_IMG_SEQ.length]];

  const cardImage = report.image && !report.image.includes('01-recent-report-logo.jpg') && !report.image.includes('noimage.jpg')
    ? report.image
    : fallbackImg;

  const tagText = report.tag || (isHindi ? pattern.tagHi : pattern.tag);
  const dateText = report.date || report.year || pattern.date;
  const titleText = report.title || (isHindi ? pattern.titleHi : pattern.title);
  const ctaText = report.cta || report.label || (isHindi ? pattern.ctaHi : pattern.cta);
  
  let sectorDisplay = '';
  if (report.sector) {
    sectorDisplay = report.sector.toLowerCase().startsWith('sector:')
      ? report.sector
      : `${isHindi ? 'क्षेत्र: ' : 'Sector: '}${report.sector}`;
  } else {
    sectorDisplay = isHindi ? pattern.sectorHi : pattern.sector;
  }

  const downloadPdfUrl = report.pdfUrl || report.pdf_url;

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadPdfUrl && downloadPdfUrl !== '#' && !downloadPdfUrl.includes('placeholder')) {
      window.open(downloadPdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      router.push(`/Reports/${report.id}`);
    }
  };

  return (
    <article
      className={`report-listing-card cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${className}`}
      data-node-id={report.id}
      onClick={() => router.push(`/Reports/${report.id}`)}
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px 0px 16px',
        gap: '16px',
        width: '100%',
        maxWidth: '307px',
        minHeight: '352px',
        background: '#FFFFFF',
        border: '1px solid #E6E6E6',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {/* 1. Image Banner (160px height) */}
      <div 
        className="report-listing-card__banner"
        style={{
          width: '100%',
          height: '160px',
          minHeight: '160px',
          maxHeight: '160px',
          position: 'relative',
          overflow: 'hidden',
          background: '#D9D9D9',
          borderRadius: '8px 8px 0px 0px'
        }}
      >
        <img
          src={cardImage}
          alt={titleText}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImg;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      {/* 2. Tag & Date Row (22px height) */}
      <div 
        className="report-listing-card__tag-row"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0px 16px',
          width: '100%',
          height: '22px',
          boxSizing: 'border-box'
        }}
      >
        {/* Tag Pill */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 8px',
            background: '#C7E3FC',
            borderRadius: '4px',
            height: '22px',
            boxSizing: 'border-box'
          }}
        >
          <span 
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '10px',
              lineHeight: '14px',
              color: '#212121',
              whiteSpace: 'nowrap'
            }}
          >
            {tagText}
          </span>
        </div>

        {/* Date */}
        <span 
          style={{
            fontFamily: "'Noto Sans', sans-serif",
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '16px',
            color: '#7A7A7A',
            whiteSpace: 'nowrap'
          }}
        >
          {dateText}
        </span>
      </div>

      {/* 3. Body (Title, CTA, Sector) */}
      <div 
        className="report-listing-card__body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0px 16px',
          gap: '16px',
          width: '100%',
          boxSizing: 'border-box',
          flex: '1 0 auto'
        }}
      >
        {/* Title (2 lines max, 32px height) */}
        <h3 
          title={titleText}
          style={{
            width: '100%',
            height: '32px',
            fontFamily: "'Noto Sans', sans-serif",
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '16px',
            color: '#2A2A2A',
            margin: '0px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {titleText}
        </h3>

        {/* CTA (Download Icon + Action text) */}
        <div 
          onClick={handleCtaClick}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '8px',
            width: '100%',
            height: '24px',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          <ReportDownloadIcon className="w-6 h-6 flex-shrink-0" />
          <span 
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '16px',
              color: '#0D61AE',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {ctaText}
          </span>
        </div>

        {/* Sector */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '4px',
            width: '100%'
          }}
        >
          <span 
            style={{
              fontFamily: "'Noto Sans', sans-serif",
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '120%',
              color: '#2A2A2A'
            }}
          >
            {sectorDisplay}
          </span>
        </div>
      </div>
    </article>
  );
}
