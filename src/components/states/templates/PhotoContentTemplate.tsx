'use client';

import React, { useEffect, useRef } from 'react';
import { SubsitePageData } from '@/data/stateSubsites/andhraPradeshPages';

interface PhotoContentTemplateProps {
  page: SubsitePageData;
  isHindi?: boolean;
  primaryColor?: string;
}

export default function PhotoContentTemplate({ page, isHindi = false, primaryColor }: PhotoContentTemplateProps) {
  const isNavy = primaryColor === '#1D2E6B';
  const content = page.content;
  const title = isHindi && page.titleHi ? page.titleHi : page.title;
  const introParagraphs = isHindi && content?.introParagraphsHi ? content.introParagraphsHi : content?.introParagraphs || [];
  const bodyParagraphs = isHindi && content?.bodyParagraphsHi ? content.bodyParagraphsHi : content?.bodyParagraphs || [];
  const accentHighlight = isHindi && content?.accentHighlightHi ? content.accentHighlightHi : content?.accentHighlight;
  const bulletPoints = isHindi && content?.bulletPointsHi ? content.bulletPointsHi : content?.bulletPoints;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // 1. Interactive Tabs handling
    const tabAnchors = root.querySelectorAll<HTMLAnchorElement>('.r-tabs-anchor, .tabNav a');
    const tabPanels = root.querySelectorAll<HTMLElement>('.r-tabs-panel, .tabContent');
    const tabItems = root.querySelectorAll<HTMLElement>('.r-tabs-tab, .tabNav li');

    if (tabAnchors.length > 0 && tabPanels.length > 0) {
      // Find initial active tab or default to tab-7 or first tab
      let activeTabId = '';
      tabItems.forEach((item) => {
        if (item.classList.contains('r-tabs-state-active')) {
          const a = item.querySelector('a');
          if (a?.hash) activeTabId = a.hash.replace('#', '');
        }
      });
      if (!activeTabId && tabAnchors[0]?.hash) {
        activeTabId = tabAnchors[0].hash.replace('#', '');
      }

      const showTab = (tabId: string) => {
        tabPanels.forEach((panel) => {
          if (panel.id === tabId) {
            panel.style.display = 'block';
            panel.classList.add('r-tabs-state-active');
            panel.classList.remove('r-tabs-state-default');
          } else {
            panel.style.display = 'none';
            panel.classList.remove('r-tabs-state-active');
            panel.classList.add('r-tabs-state-default');
          }
        });

        tabItems.forEach((item) => {
          const a = item.querySelector('a');
          if (a?.hash === `#${tabId}`) {
            item.classList.add('r-tabs-state-active');
            item.classList.remove('r-tabs-state-default');
          } else {
            item.classList.remove('r-tabs-state-active');
            item.classList.add('r-tabs-state-default');
          }
        });
      };

      if (activeTabId) {
        showTab(activeTabId);
      }

      tabAnchors.forEach((a) => {
        a.onclick = (e) => {
          e.preventDefault();
          const targetId = a.hash.replace('#', '');
          if (targetId) {
            showTab(targetId);
          }
        };
      });
    }

    // 2. Interactive Accordion handling (.accTrigger / .accordDetail)
    const accTriggers = root.querySelectorAll<HTMLElement>('.accTrigger');
    accTriggers.forEach((trigger, idx) => {
      const nextDetail = trigger.nextElementSibling as HTMLElement | null;
      if (nextDetail && nextDetail.classList.contains('accordDetail')) {
        // Open the first trigger in active tab by default
        if (idx === 0) {
          nextDetail.style.display = 'block';
          trigger.classList.add('active');
        }

        trigger.onclick = () => {
          const isCurrentlyOpen = nextDetail.style.display === 'block';
          if (isCurrentlyOpen) {
            nextDetail.style.display = 'none';
            trigger.classList.remove('active');
          } else {
            nextDetail.style.display = 'block';
            trigger.classList.add('active');
          }
        };
      }
    });
  }, [content?.contentHtml, content?.contentHtmlHi]);

  return (
    <article className="w-full bg-white rounded-[8px] p-6 lg:p-8 border border-[#E5E7EB] shadow-[0px_2px_12px_rgba(0,0,0,0.04)] font-['Noto_Sans',sans-serif]">
      {/* Page Title */}
      <h1 className="text-[28px] md:text-[32px] leading-[38px] md:leading-[42px] font-bold text-[#2A2A2A] mb-6 border-b border-[#F0F0F0] pb-4">
        {title}
      </h1>

      {/* Main Content Layout */}
      <div className="space-y-6 text-[#374151] text-[15px] md:text-[16px] leading-[28px] md:leading-[30px]">
        {/* Render Live DB HTML if available */}
        {(isHindi && content?.contentHtmlHi) || content?.contentHtml ? (
          <div
            ref={containerRef}
            className={`prose max-w-none text-[#374151] space-y-4 overflow-x-auto 
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 
              [&_th]:border [&_th]:border-[#D1D5DB] [&_th]:p-2.5 [&_th]:bg-[#F3F4F6] [&_th]:text-left 
              [&_td]:border [&_td]:border-[#E5E7EB] [&_td]:p-2 [&_td]:text-sm 
              [&_tr:hover]:bg-[#F9FAFB] [&_p]:leading-[28px] [&_p]:text-justify 
              [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 
              [&_a]:text-[#0D61AE] [&_a]:underline
              [&_.r-tabs-accordion-title]:hidden
              [&_.r-tabs-nav]:flex [&_.r-tabs-nav]:flex-wrap [&_.r-tabs-nav]:gap-2 [&_.r-tabs-nav]:border-b-2 [&_.r-tabs-nav]:border-[#E5E7EB] [&_.r-tabs-nav]:pb-3 [&_.r-tabs-nav]:mb-6 [&_.r-tabs-nav]:list-none [&_.r-tabs-nav]:pl-0
              [&_.r-tabs-tab]:list-none [&_.r-tabs-tab]:m-0
              [&_.r-tabs-anchor]:inline-block [&_.r-tabs-anchor]:px-4 [&_.r-tabs-anchor]:py-2 [&_.r-tabs-anchor]:rounded-[6px] [&_.r-tabs-anchor]:font-semibold [&_.r-tabs-anchor]:text-[14px] [&_.r-tabs-anchor]:no-underline [&_.r-tabs-anchor]:text-[#4B5563] [&_.r-tabs-anchor]:bg-[#F3F4F6] [&_.r-tabs-anchor]:transition-all [&_.r-tabs-anchor]:cursor-pointer [&_.r-tabs-anchor:hover]:bg-[#E5E7EB]
              ${
                isNavy
                  ? `[&_.r-tabs-state-active_.r-tabs-anchor]:bg-[#1D2E6B] [&_.r-tabs-state-active_.r-tabs-anchor]:text-white [&_.r-tabs-state-active_.r-tabs-anchor]:shadow-sm
                     [&_.accTrigger]:bg-[#EDF2FE] [&_.accTrigger]:border [&_.accTrigger]:border-[#E5E7EB] [&_.accTrigger]:border-l-4 [&_.accTrigger]:border-l-[#1D2E6B] [&_.accTrigger]:rounded-[6px] [&_.accTrigger]:p-3.5 [&_.accTrigger]:my-2 [&_.accTrigger]:font-bold [&_.accTrigger]:text-[15px] [&_.accTrigger]:text-[#1D2E6B] [&_.accTrigger]:cursor-pointer [&_.accTrigger]:flex [&_.accTrigger]:justify-between [&_.accTrigger]:items-center [&_.accTrigger]:transition-all [&_.accTrigger:hover]:bg-[#E2EBFC]
                     [&_.accTrigger::after]:content-['+'] [&_.accTrigger::after]:text-[20px] [&_.accTrigger::after]:font-bold [&_.accTrigger::after]:text-[#1D2E6B]
                     [&_.accTrigger.active::after]:content-['−'] [&_.accTrigger.active::after]:text-[20px] [&_.accTrigger.active::after]:font-bold [&_.accTrigger.active::after]:text-[#1D2E6B]
                     [&_.guidelinesPdfIcons_a]:inline-flex [&_.guidelinesPdfIcons_a]:items-center [&_.guidelinesPdfIcons_a]:gap-1.5 [&_.guidelinesPdfIcons_a]:px-3 [&_.guidelinesPdfIcons_a]:py-1.5 [&_.guidelinesPdfIcons_a]:rounded-[4px] [&_.guidelinesPdfIcons_a]:text-[12px] [&_.guidelinesPdfIcons_a]:font-semibold [&_.guidelinesPdfIcons_a]:no-underline [&_.guidelinesPdfIcons_a]:text-white [&_.guidelinesPdfIcons_a]:bg-[#1D2E6B] [&_.guidelinesPdfIcons_a:hover]:bg-[#152250] [&_.guidelinesPdfIcons_a]:transition-colors`
                  : `[&_.r-tabs-state-active_.r-tabs-anchor]:bg-[#751639] [&_.r-tabs-state-active_.r-tabs-anchor]:text-white [&_.r-tabs-state-active_.r-tabs-anchor]:shadow-sm
                     [&_.accTrigger]:bg-[#FAF5ED] [&_.accTrigger]:border [&_.accTrigger]:border-[#E5E7EB] [&_.accTrigger]:border-l-4 [&_.accTrigger]:border-l-[#751639] [&_.accTrigger]:rounded-[6px] [&_.accTrigger]:p-3.5 [&_.accTrigger]:my-2 [&_.accTrigger]:font-bold [&_.accTrigger]:text-[15px] [&_.accTrigger]:text-[#751639] [&_.accTrigger]:cursor-pointer [&_.accTrigger]:flex [&_.accTrigger]:justify-between [&_.accTrigger]:items-center [&_.accTrigger]:transition-all [&_.accTrigger:hover]:bg-[#F5EADB]
                     [&_.accTrigger::after]:content-['+'] [&_.accTrigger::after]:text-[20px] [&_.accTrigger::after]:font-bold [&_.accTrigger::after]:text-[#751639]
                     [&_.accTrigger.active::after]:content-['−'] [&_.accTrigger.active::after]:text-[20px] [&_.accTrigger.active::after]:font-bold [&_.accTrigger.active::after]:text-[#751639]
                     [&_.guidelinesPdfIcons_a]:inline-flex [&_.guidelinesPdfIcons_a]:items-center [&_.guidelinesPdfIcons_a]:gap-1.5 [&_.guidelinesPdfIcons_a]:px-3 [&_.guidelinesPdfIcons_a]:py-1.5 [&_.guidelinesPdfIcons_a]:rounded-[4px] [&_.guidelinesPdfIcons_a]:text-[12px] [&_.guidelinesPdfIcons_a]:font-semibold [&_.guidelinesPdfIcons_a]:no-underline [&_.guidelinesPdfIcons_a]:text-white [&_.guidelinesPdfIcons_a]:bg-[#751639] [&_.guidelinesPdfIcons_a:hover]:bg-[#5E112E] [&_.guidelinesPdfIcons_a]:transition-colors`
              }
              [&_.accordDetail]:p-4 [&_.accordDetail]:bg-white [&_.accordDetail]:border [&_.accordDetail]:border-[#E5E7EB] [&_.accordDetail]:border-t-0 [&_.accordDetail]:rounded-b-[6px] [&_.accordDetail]:mb-3
              [&_.guidelinesList]:list-none [&_.guidelinesList]:p-0 [&_.guidelinesList]:m-0
              [&_.guidelinesList_li]:flex [&_.guidelinesList_li]:flex-wrap [&_.guidelinesList_li]:justify-between [&_.guidelinesList_li]:items-center [&_.guidelinesList_li]:p-3 [&_.guidelinesList_li]:border-b [&_.guidelinesList_li]:border-[#F3F4F6] [&_.guidelinesList_li]:gap-3
              [&_.guidelinesList_li:last-child]:border-b-0
              [&_.guidelinesList_li_h5]:text-[14px] [&_.guidelinesList_li_h5]:font-semibold [&_.guidelinesList_li_h5]:text-[#1F2937] [&_.guidelinesList_li_h5]:m-0
              [&_.guidelinesPdfIcons]:flex [&_.guidelinesPdfIcons]:items-center [&_.guidelinesPdfIcons]:gap-2 [&_.guidelinesPdfIcons]:shrink-0
              [&_.guidelinesPdfIcons_sub]:flex [&_.guidelinesPdfIcons_sub]:items-center [&_.guidelinesPdfIcons_sub]:gap-2`}
            dangerouslySetInnerHTML={{ __html: (isHindi && content?.contentHtmlHi) || content?.contentHtml || '' }}
          />
        ) : (
          <>
            {/* Top Section with optional featured image */}
            {content?.featuredImage ? (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Officer Portrait / Featured Image */}
                <div className="w-full md:w-[340px] shrink-0">
                  <div className="rounded-[8px] overflow-hidden border border-[#E5E7EB] shadow-sm bg-[#F9FAFB]">
                    <img
                      src={content.featuredImage}
                      alt={title}
                      className="w-full h-auto object-cover max-h-[360px]"
                    />
                    {content.imageCaption && (
                      <p className="text-[12px] leading-[18px] text-[#6B7280] p-2 text-center bg-[#F9FAFB] border-t border-[#E5E7EB]">
                        {content.imageCaption}
                      </p>
                    )}
                  </div>

                  {/* Officer Details Card if present */}
                  {content.officerDetails && (
                    <div className={`mt-4 p-4 rounded-[6px] ${isNavy ? 'bg-[#EDF2FE] border border-[#C5D5F5]' : 'bg-[#FDF2F4] border border-[#F9D8DE]'} text-[13px] leading-[20px] text-[#2A2A2A]`}>
                      <p className={`font-bold ${isNavy ? 'text-[#1D2E6B]' : 'text-[#751639]'} text-[14px] mb-1`}>{content.officerDetails.name}</p>
                      <p className="font-medium text-[#4B5563]">{content.officerDetails.designation}</p>
                      <p className="text-[#6B7280]">{content.officerDetails.cadre}</p>
                      <div className={`mt-2 pt-2 border-t ${isNavy ? 'border-[#C5D5F5]' : 'border-[#F5C2CB]'} space-y-1 text-[#374151]`}>
                        <p><span className="font-semibold">Email:</span> {content.officerDetails.email}</p>
                        <p><span className="font-semibold">Phone:</span> {content.officerDetails.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Intro Paragraphs */}
                <div className="flex-1 space-y-4">
                  {introParagraphs.map((para, idx) => (
                    <p key={idx} className="text-justify">
                      {para}
                    </p>
                  ))}

                  {accentHighlight && (
                    <div className={`p-4 rounded-[6px] ${isNavy ? 'bg-[#EDF2FE] border-l-4 border-[#1D2E6B] text-[#1D2E6B]' : 'bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639]'} font-semibold italic text-[15px] leading-[26px]`}>
                      {accentHighlight}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {introParagraphs.map((para, idx) => (
                  <p key={idx} className="text-justify">
                    {para}
                  </p>
                ))}

                {accentHighlight && (
                  <div className={`p-4 rounded-[6px] ${isNavy ? 'bg-[#EDF2FE] border-l-4 border-[#1D2E6B] text-[#1D2E6B]' : 'bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639]'} font-semibold italic text-[15px] leading-[26px]`}>
                    {accentHighlight}
                  </div>
                )}
              </div>
            )}

            {/* Body Paragraphs */}
            {bodyParagraphs.length > 0 && (
              <div className="space-y-4 pt-2">
                {bodyParagraphs.map((para, idx) => (
                  <p key={idx} className="text-justify">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        {/* Bullet Points */}
        {bulletPoints && bulletPoints.length > 0 && (
          <ul className="list-disc list-inside space-y-2 pl-2 text-[#4B5563]">
            {bulletPoints.map((point, idx) => (
              <li key={idx} className="leading-[26px]">
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
