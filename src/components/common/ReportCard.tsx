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
      {/* Banner (394px x 248px) */}
      <div className="report-card__banner">
        <div className="report-card__mask">
          <img
            src={cardImage}
            alt={report.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
            className="report-card__photo"
          />
        </div>
        <div className="report-card__overlay"></div>
        <div className="report-card__tag-container">
          <div className="report-card__tag">
            <span className="report-card__tag-text">{tagLabel}</span>
          </div>
        </div>
      </div>

      {/* Body (394px x 244px) */}
      <div className="report-card__body">
        {/* CTA / Header Row (346px x 35px) */}
        <div className="report-card__meta">
          <div className="report-card__meta-left">
            <svg 
              className="report-card__arrow-svg" 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.66669 16H25.3334" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.3334 8L25.3334 16L17.3334 24" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="report-card__label">{report.label || report.sector || 'Civic'}</span>
          </div>
          <div className="report-card__date">
            <span>{dateLabel}</span>
          </div>
        </div>

        {/* Title (346px x 120px) */}
        <h3 className="report-card__title" title={report.title}>
          {report.title}
        </h3>

        {/* Subtitle / Description (346px x 57px) */}
        <p className="report-card__desc">
          {report.desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'}
        </p>
      </div>
    </article>
  );
}
