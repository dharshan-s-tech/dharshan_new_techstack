'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReportDownloadIcon from './ReportDownloadIcon';

export interface ReportCardData {
  id: string;
  title: string;
  image?: string;
  tag?: string;
  date?: string;
  year?: string;
  sector?: string;
  pdfUrl?: string;
  pdf_url?: string;
  label?: string;
  desc?: string;
}

interface ReportCardProps {
  report: ReportCardData;
  isHindi?: boolean;
  className?: string;
  fallbackImageIndex?: number;
}

export default function ReportCard({
  report,
  isHindi = false,
  className = '',
  fallbackImageIndex = 0
}: ReportCardProps) {
  const router = useRouter();

  // Curated fallback assets verified on CloudFront from Figma design:
  // 0: Women group in colorful saris (Education / Health / Civil)
  // 1: Defence missile parade with crowd and flag
  // 2: Red locomotive train on tracks
  const FIGMA_SAMPLE_IMAGES = [
    'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/education_health_and_family_welfare.png',
    'https://d7i5wg8xwe4hf.cloudfront.net/assets/images/sector_wise_images/Defence_and_national_security.png',
    'https://d7i5wg8xwe4hf.cloudfront.net/uploads/union_department/railway.jpg',
  ];
  const SCREENSHOT_IMG_SEQ = [0, 1, 2, 1, 2, 0, 2, 0, 1];
  const fallbackImg = FIGMA_SAMPLE_IMAGES[SCREENSHOT_IMG_SEQ[fallbackImageIndex % 9]];

  const cardImage = report.image && !report.image.includes('01-recent-report-logo.jpg') && !report.image.includes('noimage.jpg')
    ? report.image
    : fallbackImg;

  const tagLabel = report.tag || report.sector || (isHindi ? 'ऑडिट' : 'Audit');
  const dateLabel = report.date || report.year || '2026';
  const downloadPdfUrl = report.pdfUrl || report.pdf_url;

  let sectorText = '';
  if (report.sector) {
    sectorText = report.sector.toLowerCase().startsWith('sector:')
      ? report.sector
      : `${isHindi ? 'क्षेत्र: ' : 'Sector: '}${report.sector}`;
  } else {
    sectorText = isHindi ? 'क्षेत्र: सामान्य' : 'Sector: General';
  }

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
      className={`report-card cursor-pointer group ${className}`}
      data-node-id={report.id}
      onClick={() => router.push(`/Reports/${report.id}`)}
    >
      {/* Order 0: Banner Image (160px height, 4px top radius) */}
      <div className="report-card__banner">
        <img
          src={cardImage}
          alt={report.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImg;
          }}
          className="report-card__photo"
        />
      </div>

      {/* Order 1: Tag Row (22px height, 0 16px padding) */}
      <div className="report-card__tag-row">
        <span className="report-card__tag truncate max-w-[170px]">{tagLabel}</span>
        <span className="report-card__date">{dateLabel}</span>
      </div>

      {/* Order 2: Body (16px gap, 0 16px padding) */}
      <div className="report-card__body">
        <h3 className="report-card__title" title={report.title}>
          {report.title}
        </h3>

        {/* CTA Button: 24px height, gap 8px, 24x24 SVG, 12px #0D61AE */}
        <div
          className="report-card__cta"
          onClick={handleCtaClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCtaClick(e as any);
            }
          }}
        >
          <ReportDownloadIcon className="report-card__download-icon" />
          <span className="report-card__label">
            {isHindi ? 'पूरी रिपोर्ट डाउनलोड करें' : 'Download Full Report'}
          </span>
        </div>

        {/* Sector Metadata Row */}
        <div className="report-card__sector">
          <span className="report-card__sector-val" title={sectorText}>
            {sectorText}
          </span>
        </div>
      </div>
    </article>
  );
}
