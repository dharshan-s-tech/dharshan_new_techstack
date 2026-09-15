'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import { getApiBaseUrl } from '@/lib/api';

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
          title: 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
          tag: 'Finance',
          sector: 'Finance | Information and Communication',
          date: 'Jun 4, 2026',
          year: '2026',
          overview: 'Review of vaccine distribution logistics, primary health center infrastructure, and public health fund implementation across district health societies.',
          pdf_url: '/assets/sample-cag-audit-report.pdf',
          image: '/assets/7997faf6dec5f05fce3ccef2b5c1d1d3b1dfedb8.png',
          executiveSummary: 'This Performance Audit was conducted pursuant to Article 151 of the Constitution of India to examine whether public sector infrastructure, financial management, and departmental allocations adhered to established statutory benchmarks.',
          keyFindings: [
            'Cold chain equipment in 34% of Primary Health Centres (PHCs) operated beyond recommended replacement cycles.',
            'Unspent vaccination grants totaling ₹428 Crore remained parked in non-interest-bearing bank accounts for over 24 months.',
            'Staff shortages in rural pediatric centers resulted in an 18% variance in booster dose delivery schedules.'
          ],
          recommendations: [
            'Establish real-time IoT temperature monitoring across all district vaccine storage hubs.',
            'Streamline treasury drawdowns directly to frontline accredited social health activists (ASHA).',
            'Institute mandatory quarterly stock reconciliation between state medical supply corporations and regional clinics.'
          ]
        });
        setLoading(false);
      }
    };

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [API_URL, resolvedParams.id]);

  const fallbackBanner = '/assets/7997faf6dec5f05fce3ccef2b5c1d1d3b1dfedb8.png';
  const fallbackPortrait = '/assets/28f782be18b6cfdf23aa0c90ec681e3916b8d6c7.png';

  const reportDetails = {
    title: report?.title || 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
    tag: report?.tag || report?.sector || 'Finance',
    date: report?.tabled_date || report?.date || (report?.year ? `Jun 4, ${report.year}` : 'Jun 4, 2026'),
    sector: (report?.sector && report.sector.trim() !== '') ? report.sector : 'Finance | Information and Communication',
    pdfUrl: report?.pdf_url || report?.pdfUrl || '/assets/sample-cag-audit-report.pdf',
    overview: report?.overview || report?.desc || report?.executiveSummary || '',
    videoUrl: report?.video_url || report?.videoUrl || '',
    image: report?.image || fallbackBanner,
    keyFindings: report?.keyFindings || [],
    recommendations: report?.recommendations || []
  };

  const cleanSector = reportDetails.sector.replace(/^Sector:\s*/i, '');

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="report-detail-page">
        {/* Breadcrumb Trail: Home > Reports > Reports Details Page */}
        <nav className="report-detail-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className="report-detail-breadcrumbs__chevron" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <Link href="/Reports">Reports</Link>
          <span className="report-detail-breadcrumbs__chevron" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 1.5L7 5L3.5 8.5" stroke="#565656" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="report-detail-breadcrumbs__current">Reports Details Page</span>
        </nav>

        {/* Back to Reports Link */}
        <div className="report-detail-back-container">
          <Link href="/Reports" className="report-detail-back-btn">
            <svg className="report-detail-back-btn__icon" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1.5L2.5 5L7 8.5" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to Reports</span>
          </Link>
        </div>

        {/* Report Heading and Metadata Row */}
        <div className="report-detail-heading">
          {/* Top Row: Title + Date + Tag */}
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

          {/* Description Row: Sector (Left) + Download Full Report CTA (Right) */}
          <div className="report-detail-heading__desc">
            <p className="report-detail-heading__sector">
              Sector: {cleanSector}
            </p>

            <div className="report-detail-heading__cta-wrap">
              {reportDetails.pdfUrl && reportDetails.pdfUrl !== '#' ? (
                <a
                  href={reportDetails.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="report-detail-cta"
                  download
                >
                  <svg className="report-detail-cta__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" stroke="#0D61AE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="report-detail-cta__text">Download Full Report</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => alert('Official digital report copy is registered in national archives.')}
                  className="report-detail-cta cursor-pointer"
                >
                  <svg className="report-detail-cta__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" stroke="#0D61AE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="report-detail-cta__text">Download Full Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: 1312px, border 1px solid #E6E6E6, radius 8px, gap 24px */}
        <article className="report-detail-card">
          {/* Banner Image: 1312px x 440px, radius 4px 4px 0px 0px */}
          <div className="report-detail-card__banner">
            <img
              src={reportDetails.image}
              alt={reportDetails.title}
            />
          </div>

          {/* Card Body */}
          <div className="report-detail-card__body">
            {/* Image Label below Banner */}
            <span className="report-detail-card__image-caption">Image</span>

            {/* Introductory Paragraph 1 */}
            <p className="report-detail-card__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate, lorem eu pellentesque tincidunt, ex quam commodo sapien, at porttitor ante elit eu justo. Vivamus sit amet dapibus enim. Maecenas id odio tempus, eleifend urna at, fringilla nisl. Vivamus interdum, sem a vestibulum tincidunt, ante mi lacinia augue, sed lobortis mauris justo at sapien. Vivamus accumsan, mi eu rutrum accumsan, lorem ligula tempus justo, vel dapibus leo sem eget leo. Quisque sed nulla auctor libero feugiat congue. Quisque mattis lectus a enim congue dapibus. Fusce id neque interdum, lobortis massa vel, varius purus. In tristique libero non eros facilisis gravida. Sed non molestie quam. Sed ornare sapien a est luctus posuere.
            </p>

            {/* Introductory Paragraph 2 with Maroon highlight */}
            <p className="report-detail-card__paragraph">
              Phasellus enim nulla, sollicitudin hendrerit ullamcorper quis, tincidunt sit amet tortor. In nulla erat, rhoncus et luctus non, malesuada sit amet sem. Morbi consectetur tempus dignissim. Praesent leo enim, convallis eget ultrices id, lacinia et dolor. Ut nec urna tellus. Proin finibus egestas sapien, quis pharetra lacus porta ut.{' '}
              <span className="text-[#751639] font-medium">Phasellus semper sapien a rhoncus consequat.</span>
            </p>

            {/* Introductory Paragraph 3 - Full width (extended across full card width) */}
            <p className="report-detail-card__paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate, lorem eu pellentesque tincidunt, ex quam commodo sapien, at porttitor ante elit eu justo. Vivamus sit amet dapibus enim. Maecenas id odio tempus, eleifend urna at, fringilla nisl. Vivamus interdum, sem a vestibulum tincidunt, ante mi lacinia augue, sed lobortis mauris justo at sapien. Vivamus accumsan, mi eu rutrum accumsan, lorem ligula tempus justo, vel dapibus leo sem eget leo. Quisque sed nulla auctor libero feugiat congue. Quisque mattis lectus a enim congue dapibus. Fusce id neque interdum, lobortis massa vel, varius purus. In tristique libero non eros facilisis gravida. Sed non molestie quam. Sed ornare sapien a est luctus posuere.
            </p>

            {/* 2-Column Split: 799px Left Text, 481px Right Image */}
            <div className="report-detail-card__two-col">
              {/* Left Column (799px) */}
              <div className="report-detail-card__col-text">
                {/* Prominent Bold Maroon Quote */}
                <blockquote className="report-detail-card__quote">
                  &ldquo;Phasellus enim nulla, sollicitudin hendrerit ullamcorper quis, tincidunt sit amet tortor. Ut nec urna tellus. Phasellus semper sapien a rhoncus consequat.&rdquo;
                </blockquote>

                <p className="report-detail-card__paragraph">
                  Donec ante massa, fringilla quis leo eu, fringilla ultrices eros. Nullam aliquam lacinia ligula sed laoreet. Nullam eu augue euismod urna ultricies sollicitudin. Pellentesque lorem ante, viverra ut posuere eget, rutrum ut arcu. Aenean pulvinar congue erat, aliquam gravida nisi laoreet sit amet. Donec eget purus cursus, ornare dui in, consequat augue. Maecenas consequat, nulla at venenatis pretium, nisl nisi porttitor leo, vel vulputate tellus sapien ut magna. Morbi erat nibh, condimentum non venenatis eu, laoreet ac augue. Nulla facilisi. Fusce ut nulla vel justo ultrices placerat. Fusce aliquet sed lacus in efficitur.
                </p>

                <p className="report-detail-card__paragraph">
                  <span className="text-[#751639] font-medium">Recommendations and Remedial Actions:</span> The report underscores key corrective measures including automated ledger reconciliation, adherence to public procurement benchmarks, timely submission of utilization certificates, and robust internal audit oversight. The recommendations are aimed at preventing recurrence of irregularities, optimizing resource deployment, and safeguarding public revenue.
                </p>

                {/* Concluding Constitutional Scrutiny Paragraph */}
                <p className="report-detail-card__paragraph">
                  The Comptroller and Auditor General of India presents these findings in pursuance of Article 151 of the Constitution. Reports tabled in Parliament and State Legislatures stand referred to the Public Accounts Committee (PAC) and Committee on Public Undertakings (COPU) for detailed executive accountability hearings.
                </p>

                <p className="report-detail-card__paragraph">
                  Aliquam vel est justo. Nulla facilisi. Morbi vulputate arcu quis tempor elementum. Maecenas aliquam dolor nec egestas tempor. Duis sit amet pellentesque odio. Sed laoreet odio eget turpis cursus, in lobortis tortor vulputate. Fusce eget tincidunt mi. In tellus libero, tempus ac viverra eu, pellentesque sed nibh.{' '}
                  <span className="text-[#751639] font-medium">Sed ornare sapien a est luctus posuere.</span>
                </p>
              </div>

              {/* Right Column (481px x 672px) */}
              <div className="report-detail-card__col-img">
                <img
                  src={fallbackPortrait}
                  alt="Report Illustration"
                />
              </div>
            </div>
          </div>
        </article>

        {/* Section: Two Video Player Cards (651px x 272px, bg #2E2E31, radius 8px) */}
        <section className="report-detail-videos" aria-label="Multimedia presentations">
          <div
            onClick={() => setActiveVideoModal('Report Overview & Key Highlights')}
            className="report-detail-video-card"
            role="button"
            tabIndex={0}
            aria-label="Play video 1"
          >
            <div className="report-detail-play-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '2px' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div
            onClick={() => setActiveVideoModal('Field Observations & Implementation Summary')}
            className="report-detail-video-card"
            role="button"
            tabIndex={0}
            aria-label="Play video 2"
          >
            <div className="report-detail-play-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '2px' }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </section>

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
                  className="text-zinc-400 hover:text-white p-1 rounded transition-colors text-lg cursor-pointer"
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
