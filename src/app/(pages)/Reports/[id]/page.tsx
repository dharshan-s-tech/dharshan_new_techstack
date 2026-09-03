'use client';

import React from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import imageBannerBg from '@/app/Assets/Images/28a53e7e7ea5da34ea37ebe754346af05af08abf.png';
import imageBannerMain from '@/app/Assets/Images/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png';
import imagePortrait from '@/app/Assets/Images/28f782be18b6cfdf23aa0c90ec681e3916b8d6c7.png';

interface SubpageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReportDetailPage({ params }: SubpageProps) {
  const resolvedParams = React.use(params);

  const reportDetails = dataManager.getReports().find(r => r.id === resolvedParams.id) || {
    title: 'Audit Report on Government Operations and Public Accountability Frameworks',
    tag: 'Finance',
    date: 'Jun 4, 2026',
    sector: 'Finance | Information and Communication'
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <Link className="breadcrumbs__back" href="/Reports">
          <span className="breadcrumbs__sep inline-flex mr-1" aria-hidden="true">
            <img src="/assets/9db73410b9c2c31c7addefc52c4b372008b23c70.svg" alt="" className="breadcrumbs__back-chevron" />
          </span>
          <span>Back to Reports</span>
        </Link>
      </div>

      <div className="report">
        <div className="report-heading">
          <div className="report-heading__top">
            <h1 className="report-heading__title">{reportDetails.title}</h1>
            <span className="report-heading__date">{reportDetails.date}</span>
            <span className="tag">
              <span>{reportDetails.tag}</span>
            </span>
          </div>
          <div className="report-heading__desc">
            <p className="report-heading__sector">Sector: {reportDetails.sector}</p>
            <a className="download-cta" href="#">
              <span className="download-cta__icon-wrap">
                <img src="/assets/e48d21d03bf5d85f98dd2bf1b2a8c03db29e05e0.svg" alt="" className="download-cta__icon" />
              </span>
              <span>Download Full Report</span>
            </a>
          </div>
        </div>

        <div className="report-body-wrap" style={{ width: '100%' }}>
          <article className="report-card" style={{ width: '100%', maxWidth: 'none' }}>
            <div className="report-card__banner">
              <img src={imageBannerBg.src} alt="" className="report-card__banner-img report-card__banner-img--bg" />
              <img src={imageBannerMain.src} alt="Group of women" className="report-card__banner-img report-card__banner-img--main" />
            </div>

            <p className="report-card__caption">Report Documentation Panel Overview</p>

            <div className="report-card__body">
              <div className="report-card__paragraphs">
                <p>
                  This audit report presents findings from our field investigations, compliance checks, and transaction testing. We examined administrative systems, procurement records, and project schedules to verify whether expenditures align with budgetary approvals.
                </p>
              </div>

              <div className="report-card__columns">
                <div className="report-card__text">
                  <p>
                    Strategic implementation plans must address supply chain bottlenecks. During our reviews, it was observed that central storage depots maintained inventory levels below standard reserve thresholds.
                  </p>
                  <p>&nbsp;</p>
                  <p className="pull-quote">
                    &ldquo;Ensuring transparency in public spending requires robust monitoring protocols and public dissemination of annual performance metrics.&rdquo;
                  </p>
                </div>

                <div className="report-card__portrait">
                  <div className="report-card__portrait-mask">
                    <img src={imagePortrait.src} alt="" className="report-card__portrait-img" />
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
