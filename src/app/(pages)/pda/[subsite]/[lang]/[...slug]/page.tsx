import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StateSubsiteLayout from '@/components/states/StateSubsiteLayout';
import { SubsitePageData } from '@/data/stateSubsites/andhraPradeshPages';
import { TopNavItem } from '@/components/states/StateSubsiteHeader';
import { api } from '@/lib/api';

const OVERSEAS_OFFICE_META: Record<
  string,
  {
    prefixEn: string;
    prefixHi: string;
    locationEn: string;
    locationHi: string;
    titleEn: string;
    titleHi: string;
  }
> = {
  ldn: {
    prefixEn: 'Office of the Director General of Audit,',
    prefixHi: 'लेखापरीक्षा महानिदेशक का कार्यालय,',
    locationEn: 'London',
    locationHi: 'लंदन',
    titleEn: 'Office of the Director General of Audit, London',
    titleHi: 'लेखापरीक्षा महानिदेशक का कार्यालय, लंदन',
  },
  kul: {
    prefixEn: 'Principal Director of Audit,',
    prefixHi: 'प्रधान लेखापरीक्षा निदेशक,',
    locationEn: 'Kuala Lumpur',
    locationHi: 'कुआलालंपुर',
    titleEn: 'Principal Director of Audit, Kuala Lumpur',
    titleHi: 'प्रधान लेखापरीक्षा निदेशक, कुआलालंपुर',
  },
  wdc: {
    prefixEn: 'Principal Director of Audit,',
    prefixHi: 'प्रधान निदेशक लेखापरीक्षा,',
    locationEn: 'Washington DC',
    locationHi: 'वाशिंगटन डी.सी',
    titleEn: 'Principal Director of Audit, Washington DC',
    titleHi: 'प्रधान निदेशक लेखापरीक्षा , वाशिंगटन डी.सी',
  },
};

function mapDbMenusToNavItems(menus: any[], basePath: string): TopNavItem[] {
  if (!menus || !Array.isArray(menus)) return [];
  return menus.map((m) => {
    let resolvedHref = m.href;
    if (resolvedHref && !resolvedHref.startsWith('http') && !resolvedHref.startsWith('#')) {
      if (!resolvedHref.startsWith('/pda/')) {
        resolvedHref = `${basePath}/${resolvedHref.replace(/^\/+/, '')}`;
      }
    }
    return {
      id: `menu-${m.id}`,
      title: m.title_en || m.title || '',
      titleHi: m.title_hi || m.title || '',
      href: resolvedHref,
      items: m.children?.map((c: any) => {
        let childHref = c.href;
        if (childHref && !childHref.startsWith('http') && !childHref.startsWith('#')) {
          if (!childHref.startsWith('/pda/')) {
            childHref = `${basePath}/${childHref.replace(/^\/+/, '')}`;
          }
        }
        return {
          title: c.title_en || c.title || '',
          titleHi: c.title_hi || c.title || '',
          href: childHref,
          children: c.children?.map((sub: any) => ({
            title: sub.title_en || sub.title || '',
            titleHi: sub.title_hi || sub.title || '',
            href: sub.href,
          })),
        };
      }),
    };
  });
}

function resolveOverseasSidebar(menus: any[], currentSlug: string, basePath: string) {
  let matchedGroup: any = null;

  for (const m of menus) {
    if (m.children && Array.isArray(m.children)) {
      for (const c of m.children) {
        if (c.href && c.href.includes(currentSlug)) {
          matchedGroup = m;
          break;
        }
      }
    }
    if (matchedGroup) break;
  }

  if (matchedGroup) {
    return {
      heading: matchedGroup.title_en || matchedGroup.title || 'Navigation',
      headingHi: matchedGroup.title_hi || matchedGroup.title || 'नेविगेशन',
      items: (matchedGroup.children || []).map((c: any) => {
        let childHref = c.href || '#';
        if (childHref && !childHref.startsWith('http') && !childHref.startsWith('#')) {
          if (!childHref.startsWith('/pda/')) {
            childHref = `${basePath}/${childHref.replace(/^\/+/, '')}`;
          }
        }
        return {
          id: `side-${c.id}`,
          title: c.title_en || c.title || '',
          titleHi: c.title_hi || c.title || '',
          href: childHref,
        };
      }),
    };
  }

  // Fallback: list top-level main menus
  return {
    heading: 'Quick Navigation',
    headingHi: 'त्वरित नेविगेशन',
    items: menus.slice(0, 6).map((m: any) => {
      let menuHref = m.href || '#';
      if (menuHref && !menuHref.startsWith('http') && !menuHref.startsWith('#')) {
        if (!menuHref.startsWith('/pda/')) {
          menuHref = `${basePath}/${menuHref.replace(/^\/+/, '')}`;
        }
      }
      return {
        id: `side-${m.id}`,
        title: m.title_en || m.title || '',
        titleHi: m.title_hi || m.title || '',
        href: menuHref,
      };
    }),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subsite: string; lang: string; slug: string[] }>;
}): Promise<Metadata> {
  const { subsite, lang, slug } = await params;
  const currentSlug = slug[slug.length - 1];
  const officeKey = subsite.toLowerCase().trim();
  const meta = OVERSEAS_OFFICE_META[officeKey] || OVERSEAS_OFFICE_META.ldn;

  const dbPage = await api.getOverseasPage(officeKey, currentSlug, lang).catch(() => null);
  const officeTitle = lang === 'hi' ? meta.titleHi : meta.titleEn;

  if (dbPage && dbPage.title) {
    return {
      title: `${dbPage.title} | ${officeTitle}`,
      description: dbPage.excerpt || `${dbPage.title} - ${officeTitle}`,
    };
  }

  return {
    title: `${currentSlug.replace(/-/g, ' ').replace(/\\b\\w/g, (l) => l.toUpperCase())} | ${officeTitle}`,
    description: `Official page of ${officeTitle}`,
  };
}

export default async function PdaDynamicPage({
  params,
}: {
  params: Promise<{ subsite: string; lang: string; slug: string[] }>;
}) {
  const { subsite, lang, slug } = await params;
  const officeKey = subsite.toLowerCase().trim();

  if (!(officeKey in OVERSEAS_OFFICE_META)) {
    notFound();
  }

  const isHi = lang === 'hi';
  const meta = OVERSEAS_OFFICE_META[officeKey];
  const currentSlug = slug[slug.length - 1];
  const basePath = `/pda/${officeKey}/${lang}`;

  // 1. Fetch subsite metadata & live page from DB
  const [subsiteData, dbPage] = await Promise.all([
    api.getOverseasSubsite(officeKey, lang).catch(() => null),
    api.getOverseasPage(officeKey, currentSlug, lang).catch(() => null),
  ]);

  const officeTitle = isHi ? (subsiteData?.title_hi || meta.titleHi) : (subsiteData?.title || meta.titleEn);
  const mainMenus = subsiteData?.menus?.main || [];
  const navItems = mapDbMenusToNavItems(mainMenus, basePath);
  const sidebar = resolveOverseasSidebar(mainMenus, currentSlug, basePath);

  // 2. Handle Photo Gallery route
  const isGallery = currentSlug === 'photo-gallery' || currentSlug === 'video-gallery';
  let photosData: { items: any[]; total: number } = { items: [], total: 0 };
  if (isGallery) {
    const res = await api.getOverseasPhotos(officeKey, lang).catch(() => null);
    if (res && res.items) {
      photosData = res;
    }
  }

  if (!dbPage && !isGallery) {
    notFound();
  }

  const pageTitle = isGallery
    ? (isHi ? 'फोटो गैलरी' : 'Photo Gallery')
    : (dbPage?.title || currentSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));

  const breadcrumbs = [
    { label: 'Home', labelHi: 'होम', href: basePath },
    ...(sidebar.heading && sidebar.heading !== 'Quick Navigation'
      ? [{ label: sidebar.heading, labelHi: sidebar.headingHi, href: basePath }]
      : []),
    { label: pageTitle, labelHi: pageTitle },
  ];

  // 3. Prepare HTML body content for PhotoContentTemplate (the authentic A&E template)
  let finalHtmlContent = '';

  if (isGallery) {
    if (photosData.items.length > 0) {
      finalHtmlContent = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
          ${photosData.items
            .map(
              (item) => `
            <div class="bg-white rounded-[8px] overflow-hidden border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
              <div class="h-48 bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center">
                <img
                  src="${item.image_url}"
                  alt="${item.title || ''}"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                ${item.date ? `<span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[11px]">${item.date}</span>` : ''}
              </div>
              <div class="p-3.5">
                <h4 class="font-bold text-[#1F2937] text-[14px] line-clamp-2">${item.title || ''}</h4>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    } else {
      finalHtmlContent = `
        <div class="p-8 text-center text-[#6B7280] bg-[#F9FAFB] rounded-[6px] border border-dashed border-[#D1D5DB]">
          ${isHi ? 'वर्तमान में कोई फ़ोटो उपलब्ध नहीं है।' : 'No photos currently available in this section.'}
        </div>
      `;
    }
  } else if (dbPage?.content) {
    finalHtmlContent = dbPage.content;

    // Append official PDF download card if page has attached document (matching GenericStateSubsiteDynamicView)
    if (dbPage.upload_file_url && !dbPage.content.includes(dbPage.upload_file_url)) {
      finalHtmlContent += `
        <div class="mt-8 p-5 rounded-[6px] bg-[#EDF2FE] border border-[#D5E1F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-[#1D2E6B] text-[15px]">${dbPage.file_title || dbPage.upload_file || pageTitle} (PDF Document)</h4>
            <p class="text-[12px] text-[#6B7280]">Official attachment from ${officeTitle}</p>
          </div>
          <a href="${dbPage.upload_file_url}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 bg-[#1D2E6B] text-white text-[13px] font-semibold rounded-[4px] hover:bg-[#152250] transition-colors flex items-center gap-2 shrink-0 no-underline">
            <span class="text-white">${isHi ? 'डाउनलोड करें' : 'View / Download PDF'}</span>
            <span class="text-white">↓</span>
          </a>
        </div>
      `;
    }
  }

  const pageData: SubsitePageData = {
    slug: currentSlug,
    title: pageTitle,
    titleHi: pageTitle,
    templateType: 'photo-content',
    breadcrumbs,
    sidebar,
    content: {
      contentHtml: finalHtmlContent,
      contentHtmlHi: isHi ? finalHtmlContent : undefined,
      introParagraphs: [],
    },
  };

  return (
    <StateSubsiteLayout
      pageData={pageData}
      stateSlug={officeKey}
      prefix="pda"
      officePrefix={meta.prefixEn}
      officePrefixHi={meta.prefixHi}
      officeLocation={meta.locationEn}
      officeLocationHi={meta.locationHi}
      officeTitle={officeTitle}
      officeTitleHi={meta.titleHi}
      navItemsOverride={navItems}
      homeUrl={basePath}
      initialLang={isHi ? 'हिन्दी' : 'English'}
      primaryColor="#1D2E6B"
    />
  );
}
