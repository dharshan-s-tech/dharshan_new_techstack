'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import imageBannerMain from '@/app/Assets/Images/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png';
import imagePortrait from '@/app/Assets/Images/28f782be18b6cfdf23aa0c90ec681e3916b8d6c7.png';

interface SubpageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReportDetailPage({ params }: SubpageProps) {
  const resolvedParams = React.use(params);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const rawReport = dataManager.getReports().find(r => r.id === resolvedParams.id);
  
  // Exactly matching Figma design specification (Image 2)
  const reportDetails = {
    title: resolvedParams.id === 'rep-1' || !rawReport?.title ? 'Lorem Ipsum Sit Dolor' : (rawReport?.title || 'Lorem Ipsum Sit Dolor'),
    tag: resolvedParams.id === 'rep-1' || !rawReport?.tag ? 'Finance' : rawReport.tag,
    date: resolvedParams.id === 'rep-1' || !rawReport?.date ? 'Jun 4, 2026' : rawReport.date,
    sector: resolvedParams.id === 'rep-1' || !rawReport?.sector ? 'Finance | Information and Communication' : rawReport.sector
  };

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 font-sans">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-2 text-[12px] text-[#565656] mb-3" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#0a3d30] transition-colors">Home</Link>
          <span className="text-[#888888] font-normal">&gt;</span>
          <Link href="/Reports" className="hover:text-[#0a3d30] transition-colors">Reports</Link>
          <span className="text-[#888888] font-normal">&gt;</span>
          <span className="font-semibold text-[#2a2a2a]">Reports Details Page</span>
        </nav>

        {/* Back to Reports Link */}
        <div className="mb-6">
          <Link 
            href="/Reports" 
            className="inline-flex items-center gap-1.5 text-[12px] text-[#565656] hover:text-[#0a3d30] transition-colors"
          >
            <svg className="w-2.5 h-2.5 rotate-90" viewBox="0 0 10 10" fill="none">
              <path d="M9.375 3.125L5 7.5L0.625 3.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Reports</span>
          </Link>
        </div>

        {/* Report Heading and Metadata Row */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h1 className="text-[20px] md:text-[22px] font-bold text-[#2a2a2a] m-0 leading-tight">
              {reportDetails.title}
            </h1>
            <span className="text-[12px] text-[#7a7a7a] whitespace-nowrap">
              {reportDetails.date}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#c7e3fc] text-[#0d61ae] whitespace-nowrap">
              {reportDetails.tag}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[13.5px] md:text-[14px] text-[#2a2a2a] m-0">
              Sector: {reportDetails.sector}
            </p>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading full audit report PDF...');
              }}
              className="inline-flex items-center gap-2 text-[12px] text-[#0d61ae] hover:underline font-medium ml-auto"
            >
              <img src="/assets/e48d21d03bf5d85f98dd2bf1b2a8c03db29e05e0.svg" alt="" className="w-4 h-4" />
              <span>Download Full Report</span>
            </a>
          </div>
        </div>

        {/* Section 1: Hero Banner Image */}
        <div className="w-full mb-6">
          <div className="w-full h-[320px] sm:h-[400px] md:h-[480px] lg:h-[500px] rounded-[8px] overflow-hidden bg-zinc-100 relative shadow-xs">
            <img 
              src={imageBannerMain.src} 
              alt="Report Banner" 
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-[12px] text-[#565656] mt-2 mb-6">Image</p>

          {/* Top 3 Paragraphs */}
          <div className="space-y-4">
            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate, lorem eu pellentesque tincidunt, ex quam commodo sapien, at porttitor ante elit eu justo. Vivamus sit amet dapibus enim. Maecenas id odio tempus, eleifend urna at, fringilla nisl. Vivamus interdum, sem a vestibulum tincidunt, ante mi lacinia augue, sed lobortis mauris justo at sapien. Vivamus accumsan, mi eu rutrum accumsan, lorem ligula tempus justo, vel dapibus leo sem eget leo. Quisque sed nulla auctor libero feugiat congue. Quisque mattis lectus a enim congue dapibus. Fusce id neque interdum, lobortis massa vel, varius purus. In tristique libero non eros facilisis gravida. Sed non molestie quam. Sed ornare sapien a est luctus posuere.
            </p>

            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] m-0">
              Phasellus enim nulla, sollicitudin hendrerit ullamcorper quis, tincidunt sit amet tortor. In nulla erat, rhoncus et luctus non, malesuada sit amet sem. Morbi consectetur tempus dignissim. Praesent leo enim, convallis eget ultrices id, lacinia et dolor. Ut nec urna tellus. Proin finibus egestas sapien, quis pharetra lacus porta ut.{' '}
              <span className="font-bold text-[#751639]">Phasellus semper sapien a rhoncus consequat.</span>
            </p>

            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] m-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate, lorem eu pellentesque tincidunt, ex quam commodo sapien, at porttitor ante elit eu justo. Vivamus sit amet dapibus enim. Maecenas id odio tempus, eleifend urna at, fringilla nisl. Vivamus interdum, sem a vestibulum tincidunt, ante mi lacinia augue, sed lobortis mauris justo at sapien. Vivamus accumsan, mi eu rutrum accumsan, lorem ligula tempus justo, vel dapibus leo sem eget leo. Quisque sed nulla auctor libero feugiat congue. Quisque mattis lectus a enim congue dapibus. Fusce id neque interdum, lobortis massa vel, varius purus. In tristique libero non eros facilisis gravida. Sed non molestie quam. Sed ornare sapien a est luctus posuere.
            </p>
          </div>
        </div>

        {/* Section 2: Two Columns (Quote & Text on Left, Charminar Image on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-stretch">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <blockquote className="text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#751639] leading-[1.25] mb-5 tracking-tight">
              &ldquo;Phasellus enim nulla, sollicitudin hendrerit ullamcorper quis, tincidunt sit amet tortor. Ut nec urna tellus. Phasellus semper sapien a rhoncus consequat.&rdquo;
            </blockquote>

            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] mb-4">
              Donec ante massa, fringilla quis leo eu, fringilla ultrices eros. Nullam aliquam lacinia ligula sed laoreet. Nullam eu augue euismod urna ultricies sollicitudin. Pellentesque lorem ante, viverra ut posuere eget, rutrum ut arcu. Aenean pulvinar congue erat, aliquam gravida nisi laoreet sit amet. Donec eget purus cursus, ornare dui in, consequat augue. Maecenas consequat, nulla at venenatis pretium, nisl nisi porttitor leo, vel vulputate tellus sapien ut magna. Morbi erat nibh, condimentum non venenatis eu, laoreet ac augue. Nulla facilisi. Fusce ut nulla vel justo ultrices placerat. Fusce aliquet sed lacus in efficitur.
            </p>

            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] mb-4">
              <span className="font-bold text-[#751639]">Sed non felis a ante aliquam lobortis.</span> In suscipit dolor orci, tristique eleifend ipsum hendrerit quis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam a felis imperdiet, tempus ipsum nec, eleifend mi. Donec rhoncus at tortor a vulputate. Nulla efficitur cursus diam, a ornare ligula molestie eu. Ut sed elementum sapien. Ut posuere imperdiet nibh, eu commodo felis gravida vestibulum. Aliquam vel est justo. Nulla facilisi. Morbi vulputate arcu quis tempor elementum. Maecenas aliquam dolor nec egestas tempor. Duis sit amet pellentesque odio. Sed laoreet odio eget turpis cursus, in lobortis tortor vulputate. Fusce eget tincidunt mi. In tellus libero, tempus ac viverra eu, pellentesque sed nibh.
            </p>

            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vulputate, lorem eu pellentesque tincidunt, ex quam commodo sapien, at porttitor ante elit eu justo. Vivamus sit amet dapibus enim. Maecenas id odio tempus, eleifend urna at, fringilla nisl. Vivamus interdum, sem a vestibulum tincidunt, ante mi lacinia augue, sed lobortis mauris justo at sapien. Vivamus accumsan, mi eu rutrum accumsan, lorem ligula tempus justo, vel dapibus leo sem eget leo. Quisque sed nulla auctor libero feugiat congue. Quisque mattis lectus a enim congue dapibus. Fusce id neque interdum, lobortis massa vel, varius purus. In tristique libero non eros facilisis gravida. Sed non molestie quam.{' '}
              <span className="font-bold text-[#751639]">Sed ornare sapien a est luctus posuere.</span>
            </p>

            <p className="text-[13.5px] md:text-[14px] leading-[1.8] text-[#2a2a2a] m-0">
              Phasellus enim nulla, sollicitudin hendrerit ullamcorper quis, tincidunt sit amet tortor. In nulla erat, rhoncus et luctus non, malesuada sit amet sem. Morbi consectetur tempus dignissim. Praesent leo enim, convallis eget ultrices id, lacinia et dolor. Ut nec urna tellus. Proin finibus egestas sapien, quis pharetra lacus porta ut. Phasellus semper sapien a rhoncus consequat.
            </p>
          </div>

          {/* Right Column: Charminar Image */}
          <div className="lg:col-span-5 h-full min-h-[480px]">
            <div className="w-full h-full rounded-[8px] overflow-hidden relative shadow-xs">
              <img 
                src={imagePortrait.src} 
                alt="Charminar" 
                className="w-full h-full object-cover rounded-[8px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Two Video Player Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div 
            onClick={() => setActiveVideoModal('Report Overview & Highlights - Video 1')}
            className="bg-[#2D3139] hover:bg-[#25282f] transition-all rounded-[8px] h-[260px] md:h-[310px] flex items-center justify-center cursor-pointer group shadow-xs relative overflow-hidden"
            role="button"
            aria-label="Play video 1"
          >
            <div className="w-14 h-14 rounded-full border border-white/70 group-hover:border-white group-hover:scale-110 transition-transform flex items-center justify-center bg-black/20">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div 
            onClick={() => setActiveVideoModal('Field Observations & Audit Summary - Video 2')}
            className="bg-[#2D3139] hover:bg-[#25282f] transition-all rounded-[8px] h-[260px] md:h-[310px] flex items-center justify-center cursor-pointer group shadow-xs relative overflow-hidden"
            role="button"
            aria-label="Play video 2"
          >
            <div className="w-14 h-14 rounded-full border border-white/70 group-hover:border-white group-hover:scale-110 transition-transform flex items-center justify-center bg-black/20">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
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
              <div className="aspect-video bg-black/60 rounded-lg my-4 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center bg-white/10">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-300">Previewing CAG Media Stream: {activeVideoModal}</p>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => setActiveVideoModal(null)}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded text-sm font-medium transition-colors"
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
