'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import { getApiBaseUrl } from '@/lib/api';
import imageBannerMain from '@/app/Assets/Images/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png';
import imagePortrait from '@/app/Assets/Images/28f782be18b6cfdf23aa0c90ec681e3916b8d6c7.png';
import ReportDownloadIcon from '@/components/common/ReportDownloadIcon';

interface SubpageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReportDetailPage({ params }: SubpageProps) {
  const resolvedParams = React.use(params);
  const API_URL = getApiBaseUrl();
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadReport = async () => {
      // 1. Check backend API
      try {
        const res = await fetch(`${API_URL}/api/reports/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setReport(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend detail fetch failed, checking local store:', err);
      }

      // 2. Check local dataManager
      const local = dataManager.getReports().find(r => r.id === resolvedParams.id);
      if (isMounted) {
        setReport(local || {
          id: resolvedParams.id,
          title: 'State Finances Audit Report of the Government for the year ended March 2025',
          tag: 'Finance',
          sector: 'Finance | Information & Communication',
          date: 'Jun 4, 2026',
          overview: 'Audit examination of government revenue, capital expenditure, public debt and financial liabilities pursuant to constitutional mandate under Article 149-151 of the Constitution of India.',
          pdf_url: '#'
        });
        setLoading(false);
      }
    };

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [API_URL, resolvedParams.id]);

  const reportDetails = {
    title: report?.title || 'Audit Report Details',
    tag: report?.tag || report?.sector || 'Finance',
    date: report?.tabled_date || report?.date || report?.year || 'Jun 4, 2026',
    sector: (report?.sector && report.sector.trim() !== '') ? report.sector : 'Finance | Information and Communication',
    pdfUrl: report?.pdf_url || report?.pdfUrl || '#',
    overview: report?.overview || report?.desc || '',
    videoUrl: report?.video_url || report?.videoUrl || '',
    image: report?.image || imageBannerMain.src
  };

  return (
    <div className="w-full bg-white min-h-screen py-6">
      <div className="report-detail-layout px-4 sm:px-8 lg:px-16">
        {/* Breadcrumb Trail */}
        <nav className="report-detail-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="text-[#888888] font-normal">&gt;</span>
          <Link href="/Reports">Reports</Link>
          <span className="text-[#888888] font-normal">&gt;</span>
          <span className="report-detail-breadcrumbs__current truncate max-w-md">Reports Details Page</span>
        </nav>

        {/* Back to Reports Link */}
        <div>
          <Link href="/Reports" className="report-detail-back-btn">
            <svg className="w-2.5 h-2.5 rotate-90" viewBox="0 0 10 10" fill="none">
              <path d="M9.375 3.125L5 7.5L0.625 3.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to Reports</span>
          </Link>
        </div>

        {/* Report Heading and Metadata Row */}
        <div className="report-detail-heading">
          <div className="report-detail-heading__top">
            <h1 className="report-detail-heading__title">
              {reportDetails.title}
            </h1>
            <span className="report-detail-heading__date">
              {reportDetails.date}
            </span>
            <span className="report-detail-heading__tag">
              {reportDetails.tag}
            </span>
          </div>

          <div className="report-detail-heading__desc">
            <p className="report-detail-heading__sector">
              <span className="font-semibold text-gray-800">Sector:</span> {reportDetails.sector.replace(/^Sector:\s*/i, '')}
            </p>

            <div className="flex items-center ml-auto">
              {reportDetails.pdfUrl && reportDetails.pdfUrl !== '#' ? (
                <a
                  href={reportDetails.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="report-detail-cta"
                >
                  <ReportDownloadIcon className="report-detail-cta__icon text-[#0D61AE]" />
                  <span className="report-detail-cta__text">Download Full Report</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => alert('Official digital report copy is registered in national archives.')}
                  className="report-detail-cta cursor-pointer"
                >
                  <ReportDownloadIcon className="report-detail-cta__icon text-[#0D61AE]" />
                  <span className="report-detail-cta__text">Download Full Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: 1312px, border 1px solid #E6E6E6, radius 8px, gap 24px */}
        <div className="report-detail-card">
          {/* Banner Image: 440px height, radius 4px 4px 0px 0px */}
          <div className="report-detail-card__banner">
            <img
              src={reportDetails.image}
              alt={reportDetails.title}
            />
          </div>

          {/* Card Body */}
          <div className="report-detail-card__body">
            {reportDetails.overview ? (
              <div className="w-full bg-[#fafbfc] border-l-4 border-[#751639] p-5 rounded-r-lg shadow-2xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#751639] mb-2">Executive Summary & Audit Scope</h3>
                <p className="report-detail-card__paragraph whitespace-pre-line">
                  {reportDetails.overview}
                </p>
              </div>
            ) : null}

            <p className="report-detail-card__paragraph">
              The Comptroller and Auditor General of India conducts constitutional audits of departments and entities in accordance with the Regulations on Audit and Accounts. This report assesses compliance with statutory authorities, budget execution, internal control mechanisms, and public value realization.
            </p>

            <p className="report-detail-card__paragraph">
              Audit findings and systemic recommendations contained in this volume have been communicated to executive ministries and tabled before the Legislature for scrutiny by Parliamentary/Legislative Committees.{' '}
              <span className="font-bold text-[#751639]">Public accountability and financial transparency remain central to institutional governance.</span>
            </p>

            {/* 2-Column Split: 799px left, 481px right */}
            <div className="report-detail-card__two-col my-4">
              <div className="report-detail-card__col-text">
                <blockquote className="text-[20px] sm:text-[24px] font-bold text-[#751639] leading-[1.3] mb-4 tracking-tight">
                  &ldquo;Independent constitutional audit empowers democratic governance through rigorous accountability and evidence-based reporting.&rdquo;
                </blockquote>

                <p className="report-detail-card__paragraph mb-3">
                  Audit examination follows standardized methodologies comprising risk assessment, sampling of field formations, vouching of sanctions, physical verification where applicable, and reconciliation with primary accounting records.
                </p>

                <p className="report-detail-card__paragraph mb-3">
                  <span className="font-bold text-[#751639]">Recommendations and Remedial Actions:</span> The report underscores key corrective measures including automated ledger reconciliation, adherence to public procurement benchmarks, timely submission of utilization certificates, and robust internal audit oversight.
                </p>

                <p className="report-detail-card__paragraph">
                  The recommendations are aimed at preventing recurrence of irregularities, optimizing resource deployment, and safeguarding public revenue.
                </p>
              </div>

              <div className="report-detail-card__col-img">
                <img
                  src={imagePortrait.src}
                  alt="CAG Heritage Monument"
                />
              </div>
            </div>

            <p className="report-detail-card__paragraph">
              The Comptroller and Auditor General of India presents these findings in pursuance of Article 151 of the Constitution. Reports tabled in Parliament and State Legislatures stand referred to the Public Accounts Committee (PAC) and Committee on Public Undertakings (COPU) for detailed executive accountability hearings.
            </p>
          </div>
        </div>

        {/* Section: Report Chapters & Multi-Part Volumes (if available) */}
        {((report?.chapters && report.chapters.length > 0) || (report?.files && report.files.length > 0)) && (
          <section className="w-full bg-[#fafbfc] border border-gray-200 rounded-lg p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-[#2a2a2a] flex items-center gap-2 m-0">
                <svg className="w-5 h-5 text-[#751639]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Report Volumes, Chapters & Annexures ({(report.chapters?.length || 0) + (report.files?.length || 0)})</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">Official individual volume downloads</span>
            </div>

            <div className="divide-y divide-gray-100">
              {(report.chapters || []).map((ch: any, idx: number) => (
                <div key={ch.id || idx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-semibold text-gray-400 mt-0.5 min-w-[24px]">
                      #{idx + 1}
                    </span>
                    <p className="text-[13.5px] font-medium text-gray-800 m-0 leading-snug">
                      {ch.title}
                    </p>
                  </div>
                  {ch.pdf_url && ch.pdf_url !== '#' ? (
                    <a
                      href={ch.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d61ae] hover:text-[#094780] bg-[#eef6fc] hover:bg-[#dbeafe] px-3 py-1.5 rounded transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download PDF</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Available in national archives</span>
                  )}
                </div>
              ))}

              {(report.files || []).map((f: any, idx: number) => (
                <div key={f.id || idx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-semibold text-amber-600 mt-0.5 min-w-[24px]">
                      Att.
                    </span>
                    <p className="text-[13.5px] font-medium text-gray-800 m-0 leading-snug">
                      {f.title}
                    </p>
                  </div>
                  {f.pdf_url && f.pdf_url !== '#' ? (
                    <a
                      href={f.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d61ae] hover:text-[#094780] bg-[#eef6fc] hover:bg-[#dbeafe] px-3 py-1.5 rounded transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download Attachment</span>
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Two Video Player Cards (651px x 272px, bg #2E2E31, radius 8px) */}
        <div className="report-detail-videos">
          <div
            onClick={() => setActiveVideoModal('Report Overview & Key Highlights')}
            className="report-detail-video-card"
            role="button"
            aria-label="Play video 1"
          >
            <div className="report-detail-play-icon">
              <div className="w-3 h-3 bg-white rounded-xs"></div>
            </div>
            <span className="text-white text-xs font-semibold px-4 text-center">Watch Audit Presentation Video</span>
          </div>

          <div
            onClick={() => setActiveVideoModal('Field Observations & Implementation Summary')}
            className="report-detail-video-card"
            role="button"
            aria-label="Play video 2"
          >
            <div className="report-detail-play-icon">
              <div className="w-3 h-3 bg-white rounded-xs"></div>
            </div>
            <span className="text-white text-xs font-semibold px-4 text-center">Watch Recommendations Briefing</span>
          </div>
        </div>

        {/* Interactive Video Modal */}
        {activeVideoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
            onClick={() => setActiveVideoModal(null)}
          >
            <div
              className="bg-zinc-900 text-white rounded-xl overflow-hidden max-w-2xl w-full p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="font-bold text-base text-white">{activeVideoModal}</h3>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="text-zinc-400 hover:text-white p-1 rounded transition-colors text-lg"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-video bg-black/80 rounded-lg my-4 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-white/10">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-300">CAG Multimedia Stream: {activeVideoModal}</p>
                {reportDetails.videoUrl && (
                  <a
                    href={reportDetails.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Open Official External Video Link ↗
                  </a>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
