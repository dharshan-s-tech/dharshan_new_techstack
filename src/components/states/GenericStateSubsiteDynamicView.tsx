import React from 'react';
import fs from 'fs';
import path from 'path';
import StateSubsiteLayout from '@/components/states/StateSubsiteLayout';
import { ANDHRA_PRADESH_PAGES, SubsitePageData, getSidebarForPath } from '@/data/stateSubsites/andhraPradeshPages';
import { STATE_CITIZEN_CHARTER_PDFS } from '@/data/stateSubsites/andhraPradeshNav';
import { aeService } from '@/lib/services/aeService';
import { cdn } from '@/lib/cdn';
import BiharPensionsSearchEngine from '@/components/states/BiharPensionsSearchEngine';

interface DynamicViewProps {
  state: string;
  slug: string[];
  prefix?: 'ae' | 'ag';
}

// 1. Mapping for ae_state_accounts general_categories_id
const AE_STATE_ACCOUNTS_CATEGORIES: Record<string, number> = {
  'state-accounts/monthly-accounts/monthly-civil-accounts': 792,
  'state-accounts/reviews-reports/treasury-review': 795,
  'state-accounts/other-reports/8443-civil-deposits': 799,
  'state-accounts/other-reports/accounts-kept-in-8443-civil-deposits': 799,
  'state-accounts/other-reports/accounts-not-received': 800,
  'state-accounts/other-reports/accounts-received-late': 801,
  'state-accounts/other-reports/pl-accounts-not-closed': 802,
  'state-accounts/other-reports/pl-accounts-not-closed-by-ddo': 802,
  'state-accounts/other-reports/list-of-pl-accounts-not-closed-by-ddo': 802,
  'state-accounts/other-reports/dc-bills-awaited': 804,
  'state-accounts/other-reports/dc-bills-and-suspense': 804,
  'state-accounts/other-reports/dc-bills-awaited-and-cleared': 804,
  'state-accounts/other-reports/dc-bills-awaited-cleared-and-suspense-added-clered': 804,
  'state-accounts/other-reports/outstanding-treasury-inspection-report': 805,
  'state-accounts/reconciliation/rbd-discrepancies': 810,
  'state-accounts/reconciliation-of-accounts/outstanding-rbd-discrepancies': 810,
  'state-accounts/reconciliation/loanee-statement': 814,
  'state-accounts/reconciliation-of-accounts/status-of-loanee-statement': 814,
  'state-accounts/reconciliation/unit-wise-details': 816,
  'state-accounts/reconciliation-of-accounts/unit-wise-reconciliation': 816,
};

// 2. Mapping for state_accounts_report general_category_id
const STATE_ACCOUNTS_REPORT_TYPES: Record<string, number> = {
  'state-accounts/annual-accounts/account-at-glance': 357,
  'state-accounts/annual-accounts/appropriation-accounts': 358,
  'state-accounts/monthly-accounts/monthly-key-indicator': 360,
};

// 3. Direct PDF Mappings
const DIRECT_PDF_MAP: Record<string, { file: string; size?: string }> = {
  'state-accounts/accounting-system/list-of-pao-apaos': { file: 'List-of-PAO-06493eaf996a882-49771885.pdf', size: '1.20 MB' },
  'state-accounts/accounting-system/list-of-treasuries-sub-treasuries': { file: 'List-of-DTAOs-Div-STOs-STOs-with-code-0649416e7b63852-43596934.pdf', size: '1.45 MB' },
  'state-accounts/dos-donts-paos-treasury-officers': { file: 'DO-s-AND-DON-Ts-20200605124152.pdf', size: '0.85 MB' },
  'gpf/gpf-manual': { file: 'MANUAL-OF-THE-PROVIDENT-FUND-DEPATMENT-20200611170818.pdf', size: '4.10 MB' },
  'rti/rti-disclosure-ap': { file: 'RTI-disclosure-AP-0643fc224386475-92952692.pdf', size: '2.15 MB' },
  'citizens-charter': { file: 'Citizen-Charter-english-updated-0643e81853c6471-79510511.pdf', size: '3.45 MB' },
  'contact-us/contact-us/holiday-list': { file: 'Circular-List-of-Holidays-for-2026-0697203e391f278-31182167.pdf', size: '0.45 MB' },
};

// 4. External Links Mapping
const EXTERNAL_LINKS_MAP: Record<string, { url: string; title: string; description?: string }> = {
  'state-accounts/monthly-accounts/mki-visualization': {
    url: 'http://www.agaeapts.gov.in/MKIV/mkiV_Jul20.html',
    title: 'Monthly Key Indicators (MKI) Data Visualization Portal',
    description: 'Interactive graphical visualization of monthly key fiscal and expenditure indicators of the State Government.'
  },
  'gpf/gpf-information/annual-statement-of-accounts': {
    url: 'https://agaeap.cag.gov.in/gpf/',
    title: 'GPF Annual Statement of Accounts',
    description: 'View and download annual GPF account statements for Andhra Pradesh state government employees.'
  },
  'gpf/gpf-information/grievance-feedback-complaint': {
    url: 'http://cagofindia.delhi.nic.in/cmis/main.asp',
    title: 'CAG Central Grievance / Feedback Portal',
    description: 'Register and monitor GPF related complaints and grievances directly on the central CAG portal.'
  },
  'gpf/gpf-information/status-of-cag-complaint-cases': {
    url: 'http://cagofindia.delhi.nic.in/cmis/main.asp',
    title: 'Status of CAG Complaint Cases',
    description: 'Track the status of registered GPF complaint cases online.'
  },
  'gpf/online-services/gpf-annual-account-statement': {
    url: 'https://agaeap.cag.gov.in/gpf/',
    title: 'GPF Online Annual Account Statement',
    description: 'Direct portal for subscribers to access electronic GPF passbook and slip.'
  },
  'gpf/dos-donts': {
    url: 'http://www.agaeapts.gov.in/Dos_Donts.pdf',
    title: "GPF Do's & Don'ts Guidelines",
    description: 'Important guidelines, instructions, and precautions for GPF subscribers and DDOs.'
  },
  'pension/pensioners-corner/pension-tracking': {
    url: 'https://ag.ap.nic.in//psmis_web/status_pension_case.aspx',
    title: 'Online Pension Tracking System',
    description: 'Track real-time status of receipt, verification, and authorization of state pension cases.'
  },
  'pension/pensioners-corner/grievance-feedback-complaint': {
    url: 'http://cagofindia.delhi.nic.in/cmis/main.asp',
    title: 'Pensioner Grievance Redressal System',
    description: 'Lodge and monitor pension authorization grievances on the central system.'
  },
  'pension/pensioners-corner/gpo-ppo-cpo-status': {
    url: 'https://ag.ap.nic.in//psmis_web/status_pension_case.aspx',
    title: 'GPO / PPO / CPO Verification Status',
    description: 'Verify Gratuity Payment Order, Pension Payment Order, and Commuted Pension Order status.'
  },
  'pension/download/government-orders-old-website': {
    url: 'https://ag.ap.nic.in/ae-pension-other-states.html',
    title: 'Government Orders (Archive / Other States)',
    description: 'Repository of government orders pertaining to pension revisions and interstate authorizations.'
  },
  'pension/online-services/know-your-pension-status': {
    url: 'https://agaeap.cag.gov.in/Pension/Home',
    title: 'Know Your Pension Status',
    description: 'Search pension authorization status by Employee ID, HRMS Code, or PPO number.'
  },
  'pension/online-services/status-of-pension-cases': {
    url: 'https://agaeap.cag.gov.in/Pension/Home',
    title: 'Comprehensive Pension Cases Status',
    description: 'Online portal for state pensioners to view case processing milestones.'
  },
  'pension/online-services/pension-authorities-intimation': {
    url: 'https://agaeap.cag.gov.in/Pension/Home',
    title: 'Pension Authorities Intimation',
    description: 'Intimation and dispatch details for issued pension authorization slips.'
  },
  'employee-corner/iaad-mail': {
    url: 'https://email.gov.in/',
    title: 'IA&AD Official Webmail (email.gov.in)',
    description: 'Secure government email portal for officers and staff of Indian Audit & Accounts Department.'
  },
  'employee-corner/iaad-kms': {
    url: 'https://cag.gov.in/member',
    title: 'Knowledge Management System (KMS)',
    description: 'Internal knowledge repository and learning resources portal for IA&AD personnel.'
  },
  'employee-corner/e-office': {
    url: 'https://cag.eoffice.gov.in',
    title: 'CAG e-Office Electronic File Portal',
    description: 'Centralized paperless file management and digital governance system.'
  },
  'employee-corner/pfms': {
    url: 'https://pfms.nic.in/NewDefaultHome.aspx',
    title: 'Public Financial Management System (PFMS)',
    description: 'Central portal for payment processing, direct benefit transfers, and financial tracking.'
  },
  'contact-us/working-with-us/ddo-login': {
    url: 'https://cag.gov.in',
    title: 'DDO Login Portal',
    description: 'Drawing & Disbursing Officer (DDO) and Treasury Officer online login and reconciliation portal.'
  },
  'contact-us/working-with-u-s/ddo-login': {
    url: 'https://cag.gov.in',
    title: 'DDO Login Portal',
    description: 'Drawing & Disbursing Officer (DDO) and Treasury Officer online login and reconciliation portal.'
  },
};

function parseJsonField(val: string | null | undefined): string {
  if (!val) return '';
  try {
    const p = JSON.parse(val);
    return p.default || p.en || '';
  } catch {
    return val;
  }
}

export default async function GenericStateSubsiteDynamicView({
  state,
  slug,
  prefix = 'ae'
}: DynamicViewProps) {
  const stateSlug = decodeURIComponent(state || 'andhra-pradesh').toLowerCase();
  const decodedSegments = slug.map((s) => decodeURIComponent(s));
  const slugPath = decodedSegments.join('/');
  const normalizedPath = slugPath.toLowerCase().replace(/^\/+|\/+$/g, '');

  const basePath = `/${prefix}/${stateSlug}`;

  // 1. Resolve State Context from DB
  const siteInfo = await aeService.getAeWebsiteBySlug(stateSlug);
  const stateDisplayName = siteInfo?.state_name || stateSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const stateId = siteInfo?.state_id || 64;

  // 2. Check if this is an external link route
  const externalLinkInfo = EXTERNAL_LINKS_MAP[normalizedPath];

  // 3. Query universal multi-tier DB CMS content (Menus -> Pages -> CloudFront assets) if not external link
  const dbPage = externalLinkInfo ? null : await aeService.getAePageContent(slugPath, stateSlug);

  // 4. Check preconfigured page data or case-insensitive match
  let pageData: SubsitePageData | undefined =
    ANDHRA_PRADESH_PAGES[slugPath] ||
    ANDHRA_PRADESH_PAGES[slug.join('/')];

  if (!pageData) {
    const matchKey = Object.keys(ANDHRA_PRADESH_PAGES).find(
      (k) =>
        k.toLowerCase() === slugPath.toLowerCase() ||
        k.toLowerCase() === slug.join('/').toLowerCase()
    );
    if (matchKey) {
      pageData = ANDHRA_PRADESH_PAGES[matchKey];
    }
  }

  // 4. Resolve Contextual Category Sidebar
  const rawCategorySidebar = getSidebarForPath(slugPath, stateSlug, prefix);
  const categorySidebar = rawCategorySidebar
    ? {
        ...rawCategorySidebar,
        items: rawCategorySidebar.items.map((item) => ({
          ...item,
          href: item.href.startsWith('http') || item.href.endsWith('.pdf')
            ? item.href
            : item.href
                .replace('/states/andhra-pradesh', basePath)
                .replace(`/states/${stateSlug}`, basePath)
                .replace('/ae/andhra-pradesh', basePath)
                .replace('/ag/andhra-pradesh', basePath)
        }))
      }
    : null;

  // 5. If this is Citizens Charter, resolve state-specific PDF / DB page
  const isCharterSlug = normalizedPath.includes('citizen') || normalizedPath.includes('charter');
  let stateCharterData: any = null;
  if (isCharterSlug) {
    stateCharterData = await aeService.getAeStateCitizenCharter(stateSlug);
    if (!stateCharterData?.pdfUrl && STATE_CITIZEN_CHARTER_PDFS[stateSlug]) {
      stateCharterData = {
        type: 'pdf',
        title: `Citizens Charter - ${stateDisplayName}`,
        pdfUrl: STATE_CITIZEN_CHARTER_PDFS[stateSlug],
        fileSize: '3.45 MB'
      };
    }
  }

  // 6. If this route is backed by ae_state_accounts general_categories_id
  let liveCategoryDocs: any[] | undefined = undefined;
  const accountsCategoryId = AE_STATE_ACCOUNTS_CATEGORIES[normalizedPath];
  if (accountsCategoryId) {
    const dbCatRows = await aeService.getAeStateAccountsByCategory(stateSlug, accountsCategoryId, 50, prefix);
    if (dbCatRows.length > 0) {
      liveCategoryDocs = dbCatRows.map((item, idx) => {
        let size = '0.35 MB';
        if (item.upload_file) {
          if (item.upload_file.includes('2023-status-as-on-30-09-2023')) size = '0.70 MB';
          else if (item.upload_file.includes('2024-0668b9156043e80')) size = '0.53 MB';
          else if (item.upload_file.includes('Treasuries-as-on-31-12-2023')) size = '0.47 MB';
          else if (item.upload_file.includes('Treasuries-as-on-31-03-2024')) size = '0.31 MB';
          else if (item.upload_file.includes('30-06-2026')) size = '0.31 MB';
          else if (item.upload_file.includes('30-09-2025')) size = '0.31 MB';
          else if (item.upload_file.includes('Works')) size = '0.18 MB';
          else size = '0.32 MB';
        }
        return {
          id: `cat-${item.id || idx + 1}`,
          title: item.title,
          titleHi: item.title,
          year: item.year || '',
          month: item.month || '',
          date: item.year || undefined,
          fileSize: size,
          downloadUrl: item.file_url || '#'
        };
      });
    }
  }

  // 7. If this route is backed by state_accounts_report
  let liveReportDocs: any[] | undefined = undefined;
  const reportTypeId = STATE_ACCOUNTS_REPORT_TYPES[normalizedPath];
  if (reportTypeId) {
    const dbReports = await aeService.getAeStateAccounts(stateId, reportTypeId);
    if (dbReports.length > 0) {
      liveReportDocs = dbReports.map((acc, idx) => {
        let displayTitle = acc.title || (reportTypeId === 358 ? 'Appropriation Accounts' : 'Accounts at a Glance');
        if (acc.year && !displayTitle.includes(acc.year.trim())) {
          displayTitle = `${displayTitle} (${acc.year})`;
        }
        let fileSize = '3.50 MB';
        if (acc.year) {
          if (reportTypeId === 358) {
            if (acc.year.includes('2024')) fileSize = '6.27 MB';
            else if (acc.year.includes('2023')) fileSize = '10.75 MB';
            else if (acc.year.includes('2022')) fileSize = '4.90 MB';
            else if (acc.year.includes('2021')) fileSize = '4.31 MB';
          } else {
            if (acc.year.includes('2024')) fileSize = '5.97 MB';
            else if (acc.year.includes('2023')) fileSize = '1.33 MB';
            else if (acc.year.includes('2022')) fileSize = '4.99 MB';
            else if (acc.year.includes('2021')) fileSize = '4.86 MB';
          }
        }

        return {
          id: `rep-${acc.id || idx + 1}`,
          title: displayTitle,
          titleHi: displayTitle,
          year: acc.year || '',
          month: acc.month || '',
          date: acc.year || undefined,
          fileSize: fileSize,
          downloadUrl: acc.file_url || '#'
        };
      });
    }
  }

  // 8. If this is a Circulars / Office Orders page, query live ae_circulars_office_orders
  let liveCircularsDocs: any[] | undefined = undefined;
  if (normalizedPath.includes('circular') || normalizedPath.includes('order')) {
    const dbCircs = await aeService.getAeCirculars(stateSlug, 50, prefix);
    if (dbCircs.length > 0) {
      liveCircularsDocs = dbCircs.map((circ, idx) => ({
        id: `circ-${circ.id || idx + 1}`,
        title: circ.title,
        titleHi: circ.title,
        date: circ.ae_date ? new Date(circ.ae_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s+/g, '-') : '-',
        fileSize: circ.upload_file ? (circ.title.includes('2024') ? '0.51 MB' : circ.title.includes('2023') ? '0.60 MB' : circ.title.includes('Nomination') || circ.title.includes('Conduct') || circ.title.includes('property') || circ.title.includes('gifts') ? '0.19 MB' : circ.title.includes('Deputation') ? '0.56 MB' : circ.title.includes('Outside') ? '0.45 MB' : circ.title.includes('advance') ? '0.25 MB' : '0.43 MB') : '',
        downloadUrl: circ.upload_file ? cdn.aeCirculars(circ.upload_file) : '#',
        fullUrl: circ.full_url || '-'
      }));
    }
  }

  // 9. If this is a Gradation List page, query live gradation_list from DB
  let liveGradationDocs: any[] | undefined = undefined;
  if (normalizedPath.includes('gradation')) {
    const dbGradation = await aeService.getAeGradationList(stateSlug, prefix);
    if (dbGradation.length > 0) {
      liveGradationDocs = dbGradation.slice(0, 5).map((item, idx) => ({
        id: `grad-${item.id || idx + 1}`,
        title: item.title,
        titleHi: item.title,
        fileSize: item.title.includes('2025') ? '1.82 MB' : item.title.includes('2024') || item.title.includes('2023') ? '2.01 MB' : item.title.includes('2022') ? '0.94 MB' : item.title.includes('2021') ? '0.78 MB' : '1.50 MB',
        downloadUrl: item.pdf_file ? cdn.gradationList(item.pdf_file) : '#'
      }));
    }
  }

  // 10a. If this is a Tenders page, query live tenders from DB
  let liveTendersDocs: any[] | undefined = undefined;
  if (normalizedPath.includes('tender')) {
    const dbTenders = await aeService.getAeTenders(stateSlug, 50);
    if (dbTenders.length > 0) {
      liveTendersDocs = dbTenders
        .filter((t) => {
          if (!t.uploads) return false;
          const cleanUpload = t.uploads.trim();
          const p = path.join(process.cwd(), 'public', 'uploads', 'tenders', cleanUpload);
          return fs.existsSync(p);
        })
        .map((t, idx) => {
          let size = '0.22 MB';
          if (t.uploads) {
            if (t.uploads.includes('Digitization')) size = '1.37 MB';
            else if (t.uploads.includes('Tender-Notice-latest')) size = '0.54 MB';
            else if (t.uploads.includes('Canteen-tender-extension')) size = '0.22 MB';
            else if (t.uploads.includes('Re-tender-notice-latest')) size = '0.19 MB';
            else if (t.uploads.includes('Printed-Envelopes')) size = '0.16 MB';
            else if (t.uploads.includes('GeM-Bidding')) size = '0.13 MB';
          }
          const dateStr = t.issue_date
            ? new Date(t.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s+/g, '-')
            : '-';
          return {
            id: `tender-${t.id || idx + 1}`,
            title: t.tender_title,
            titleHi: t.tender_title,
            date: dateStr,
            year: dateStr.split('-').pop() || '2026',
            fileSize: size,
            downloadUrl: t.uploads ? cdn.tenders(t.uploads) : '#',
          };
        });
    }
  }

  // 10b. If this is a Notifications page, query live notifications from DB
  let liveNotificationDocs: any[] | undefined = undefined;
  if (normalizedPath.includes('notification')) {
    const dbNotifs = await aeService.getAeNotifications(stateSlug, 50);
    if (dbNotifs.length > 0) {
      liveNotificationDocs = dbNotifs
        .filter((n) => {
          if (!n.uploads) return false;
          const cleanUpload = n.uploads.trim();
          const p = path.join(process.cwd(), 'public', 'uploads', 'notification', cleanUpload);
          return fs.existsSync(p);
        })
        .map((n, idx) => {
          let size = '0.36 MB';
          if (n.uploads) {
            if (n.uploads.includes('Nagpur')) size = '2.46 MB';
            else if (n.uploads.includes('Legal-Cell-New')) size = '0.94 MB';
            else if (n.uploads.includes('Deputation-notification-2025')) size = '0.56 MB';
            else if (n.uploads.includes('Legal-Assistant-PAG-AE-AP')) size = '0.37 MB';
            else if (n.uploads.includes('Welfare-Assistant')) size = '0.36 MB';
            else if (n.uploads.includes('Hiring-of-Consultant')) size = '0.13 MB';
            else if (n.uploads.includes('Legal-Officer-1614')) size = '0.12 MB';
          }
          const dateStr = n.created
            ? new Date(n.created).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s+/g, '-')
            : '-';
          return {
            id: `notif-${n.id || idx + 1}`,
            title: n.title,
            titleHi: n.title,
            date: dateStr,
            year: dateStr.split('-').pop() || '2026',
            fileSize: size,
            downloadUrl: n.uploads ? cdn.notification(n.uploads) : '#',
          };
        });
    }
  }

  // 10c. If this is a Recruitment Notice page, query live recruitment_notices from DB
  let liveRecruitmentDocs: any[] | undefined = undefined;
  if (normalizedPath.includes('recruitment')) {
    const dbRecruits = await aeService.getAeRecruitments(stateSlug, 50);
    if (dbRecruits.length > 0) {
      liveRecruitmentDocs = dbRecruits
        .map((r, idx) => {
          const dateStr = r.recruitment_notice_date
            ? new Date(r.recruitment_notice_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s+/g, '-')
            : '-';
          return {
            id: `rec-${r.id || idx + 1}`,
            title: r.title,
            titleHi: r.title,
            date: dateStr,
            year: dateStr.split('-').pop() || '2026',
            fileSize: '0.45 MB',
            downloadUrl: r.document_uploaded ? cdn.auto(r.document_uploaded) : '#',
          };
        });
    }
  }

  // 10d. If this is a Media Centre Notices page (ae_notices)
  let liveNoticesDocs: any[] | undefined = undefined;
  if (
    normalizedPath.includes('media-centre/notices') ||
    normalizedPath.endsWith('/notices') ||
    normalizedPath === 'notices' ||
    normalizedPath === 'ae-notices'
  ) {
    const dbNotices = await aeService.getAeNotices(stateSlug, 50);
    if (dbNotices.length > 0) {
      liveNoticesDocs = dbNotices
        .filter((n) => {
          if (!n.upload_file) return true;
          const cleanUpload = n.upload_file.trim();
          const p = path.join(process.cwd(), 'public', 'uploads', 'ae_notices', cleanUpload);
          return fs.existsSync(p);
        })
        .map((n, idx) => {
          let size = '0.16 MB';
          if (n.upload_file) {
            const p = path.join(process.cwd(), 'public', 'uploads', 'ae_notices', n.upload_file.trim());
            if (fs.existsSync(p)) {
              const bytes = fs.statSync(p).size;
              size = (bytes / (1024 * 1024)).toFixed(2) + ' MB';
            }
          }
          const dateStr = n.notice_date
            ? new Date(n.notice_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
            : '-';
          return {
            id: `notice-${n.id || idx + 1}`,
            title: n.title,
            titleHi: n.title,
            date: dateStr,
            year: dateStr.split('-').pop() || '2022',
            fileSize: size,
            downloadUrl: n.upload_file ? cdn.aeNotices(n.upload_file) : '#',
            fullUrl: n.full_url || '',
          };
        });
    }
  }

  // 11. Check if this is a direct PDF document route
  const directPdfInfo = DIRECT_PDF_MAP[normalizedPath];
  const directPdfUrl = directPdfInfo ? cdn.media(directPdfInfo.file) : undefined;

  // 12. Check if this is an FAQ route
  let faqContentHtml: string | undefined = undefined;
  if (normalizedPath.endsWith('/faq') || normalizedPath === 'faq' || normalizedPath.endsWith('/faqs')) {
    const faqCat = normalizedPath.includes('loan') ? 'loans' : normalizedPath.includes('pension') ? 'pension' : normalizedPath.includes('gpf') ? 'gpf' : undefined;
    const dbFaqs = await aeService.getAeFaqs(faqCat, stateSlug);
    if (dbFaqs.length > 0) {
      faqContentHtml = `
        <div class="accordionMain faq">
          <div class="accordion">
            ${dbFaqs.map((f, i) => `
              <div class="accTrigger">
                <span>${parseJsonField(f.question)}</span>
              </div>
              <div class="accordDetail">${parseJsonField(f.answer).replace(/\r\n|\n/g, '<br />')}</div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // 13. Assemble Page Data
  const isDirectPdf = Boolean(directPdfUrl) || Boolean(stateCharterData?.pdfUrl) || Boolean(dbPage?.is_pdf);
  const pdfDownloadUrl = directPdfUrl || stateCharterData?.pdfUrl || (dbPage?.is_pdf ? dbPage.file_url : dbPage?.file_url);

  const parentFolder = decodedSegments[0] || 'About Us';
  const leafName = decodedSegments[decodedSegments.length - 1] || 'Page';
  const formattedTitle = leafName.replace(/-/g, ' ');
  const formattedParent = parentFolder.replace(/-/g, ' ');

  const isDocumentPage =
    Boolean(liveNoticesDocs) ||
    Boolean(liveRecruitmentDocs) ||
    Boolean(liveCategoryDocs) ||
    Boolean(liveReportDocs) ||
    Boolean(liveCircularsDocs) ||
    Boolean(liveGradationDocs) ||
    Boolean(liveTendersDocs) ||
    Boolean(liveNotificationDocs) ||
    Boolean(isDirectPdf);

  const isGrievanceForm = normalizedPath === 'contact-us/grievance' || normalizedPath === 'contact-us/online-grievance' || normalizedPath === 'contact-us/feedback-complaint';

  // If page has external link, build a clean interactive redirection block
  let externalContentHtml: string | undefined = undefined;
  if (externalLinkInfo) {
    externalContentHtml = `
      <div class="bg-white rounded-[8px] p-8 border border-[#E5E7EB] shadow-sm space-y-6">
        <div class="p-4 rounded-[6px] bg-[#FAF5ED] border-l-4 border-[#751639] text-[#751639] font-medium text-[15px]">
          You are accessing an official external service portal of the Comptroller and Auditor General of India / Government of ${stateDisplayName}.
        </div>
        <p class="text-[15px] leading-[26px] text-[#374151]">
          ${externalLinkInfo.description || `Click the button below to open ${externalLinkInfo.title} in a new secure window.`}
        </p>
        <div class="pt-2">
          <a
            href="${externalLinkInfo.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 bg-[#751639] hover:bg-[#5E112E] text-white font-semibold text-[14px] rounded-[4px] shadow-sm transition-colors"
          >
            <span>Proceed to ${externalLinkInfo.title}</span>
            <span class="text-[16px]">↗</span>
          </a>
        </div>
      </div>
    `;
  }

  // Prepare final HTML content
  let finalHtmlContent: string | undefined = undefined;
  if (externalContentHtml) {
    finalHtmlContent = externalContentHtml;
  } else if (faqContentHtml) {
    finalHtmlContent = faqContentHtml;
  } else if (stateCharterData?.contentHtml) {
    finalHtmlContent = stateCharterData.contentHtml;
  } else if (dbPage?.content_html && !liveReportDocs && !liveCategoryDocs && !liveTendersDocs && !liveNotificationDocs && !liveNoticesDocs) {
    finalHtmlContent = dbPage.content_html;
    // If DB page has an associated PDF upload, append download card
    if (dbPage.upload_file && dbPage.file_url && !dbPage.content_html.includes(dbPage.upload_file)) {
      finalHtmlContent += `
        <div class="mt-8 p-5 rounded-[6px] bg-[#FAF5ED] border border-[#F5E6D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-[#751639] text-[15px]">${dbPage.title} (PDF Document)</h4>
            <p class="text-[12px] text-[#6B7280]">Official attachment from the Office of the Principal Accountant General</p>
          </div>
          <a href="${dbPage.file_url}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 bg-[#751639] text-white text-[13px] font-semibold rounded-[4px] hover:bg-[#5E112E] transition-colors flex items-center gap-2 shrink-0">
            <span>View / Download PDF</span>
            <span>↓</span>
          </a>
        </div>
      `;
    }
  }

  const activeDocuments =
    (isDirectPdf && pdfDownloadUrl)
      ? [
          {
            id: 'pdf-doc',
            title: `${dbPage?.title || formattedTitle} - Office of the Principal Accountant General, ${stateDisplayName}`,
            titleHi: `${dbPage?.title || formattedTitle} - प्रधान महालेखाकार, ${stateDisplayName}`,
            fileSize: directPdfInfo?.size || stateCharterData?.fileSize || '3.45 MB',
            downloadUrl: pdfDownloadUrl,
            date: 'Updated 2026',
            year: '2026'
          }
        ]
      : liveNoticesDocs || liveRecruitmentDocs || liveGradationDocs || liveCircularsDocs || liveCategoryDocs || liveReportDocs || liveTendersDocs || liveNotificationDocs;

  const isTablePage = normalizedPath.includes('circular') || normalizedPath.includes('notice');

  if (!pageData) {
    pageData = {
      slug: slugPath,
      title: stateCharterData?.title || externalLinkInfo?.title || dbPage?.title || formattedTitle,
      titleHi: stateCharterData?.title || externalLinkInfo?.title || dbPage?.title || formattedTitle,
      templateType: isGrievanceForm
        ? 'form'
        : (isDocumentPage && !finalHtmlContent)
        ? 'document-list'
        : 'photo-content',
      breadcrumbs: [
        { label: 'Home', labelHi: 'होम', href: basePath },
        { label: formattedParent, labelHi: formattedParent, href: `${basePath}/${parentFolder}` },
        { label: stateCharterData?.title || externalLinkInfo?.title || dbPage?.title || formattedTitle, labelHi: stateCharterData?.title || externalLinkInfo?.title || dbPage?.title || formattedTitle }
      ],
      sidebar: categorySidebar || {
        heading: isCharterSlug ? 'Citizens Charter' : formattedParent,
        headingHi: isCharterSlug ? 'नागरिक चार्टर' : formattedParent,
        items: isDirectPdf && pdfDownloadUrl
          ? [
              { id: 'doc-view', title: `${formattedTitle} (PDF)`, titleHi: `${formattedTitle} (पीडीएफ)`, href: pdfDownloadUrl },
              { id: 'grievance', title: 'Grievance Redressal', titleHi: 'शिकायत निवारण', href: `${basePath}/Contact-Us/Grievance` },
              { id: 'contact', title: 'Contact Details', titleHi: 'संपर्क विवरण', href: `${basePath}/Contact-Us/Contact-Us/Contact-details` }
            ]
          : [
              { id: 'item-1', title: formattedTitle, titleHi: formattedTitle, href: `${basePath}/${slugPath}` }
            ]
      },
      content: {
        contentHtml: finalHtmlContent,
        introParagraphs: finalHtmlContent
          ? [finalHtmlContent.replace(/<[^>]*>?/gm, '').slice(0, 300)]
          : [
              `Welcome to the ${formattedTitle} section of the Office of the Principal Accountant General, ${stateDisplayName}.`,
              `This department maintains statutory accounts, audit records, employee entitlements, and public records for the Government of ${stateDisplayName}.`
            ],
        accentHighlight: `Committed to supreme standards of public transparency and accountability for ${stateDisplayName}.`,
        bodyParagraphs: [
          'For further assistance, circulars, or specific clarifications regarding this subject, please contact our administrative desk or refer to the downloadable manuals.'
        ]
      },
      documents: activeDocuments,
      hideArchiveButton: normalizedPath.includes('gradation'),
      displayMode: isTablePage ? 'table' : 'list'
    };
  } else {
    // Adapt state name in existing templates
    const stateAdaptedTitle = pageData.title.replace('Andhra Pradesh', stateDisplayName);
    const hasHtmlContent = Boolean(finalHtmlContent);

    pageData = {
      ...pageData,
      title: stateCharterData?.title || externalLinkInfo?.title || dbPage?.title || stateAdaptedTitle,
      templateType: isGrievanceForm
        ? 'form'
        : hasHtmlContent
        ? 'photo-content'
        : (isDocumentPage || pageData.templateType === 'document-list')
        ? 'document-list'
        : pageData.templateType,
      breadcrumbs: pageData.breadcrumbs.map((b) => ({
        ...b,
        href: b.href
          ? b.href
              .replace('/states/andhra-pradesh', basePath)
              .replace(`/states/${stateSlug}`, basePath)
              .replace('/ae/andhra-pradesh', basePath)
              .replace('/ag/andhra-pradesh', basePath)
          : undefined
      })),
      sidebar: categorySidebar || pageData.sidebar,
      content: {
        ...pageData.content,
        contentHtml: finalHtmlContent || pageData.content?.contentHtml,
        introParagraphs: finalHtmlContent
          ? [finalHtmlContent.replace(/<[^>]*>?/gm, '').slice(0, 300)]
          : pageData.content?.introParagraphs || []
      },
      documents: activeDocuments || pageData.documents,
      hideArchiveButton: normalizedPath.includes('gradation') || pageData.hideArchiveButton,
      displayMode: isTablePage ? 'table' : pageData.displayMode
    };
  }

  const isBiharPension = stateSlug === 'bihar' && (
    normalizedPath.includes('bihar-pension') ||
    normalizedPath.includes('pension-search') ||
    normalizedPath === 'biharpensions' ||
    normalizedPath === 'pension/pensioners-corner/pension-tracking'
  );

  return (
    <StateSubsiteLayout
      pageData={pageData}
      stateSlug={stateSlug}
      prefix={prefix}
      officeLocation={stateDisplayName}
      officeLocationHi={siteInfo?.website_title_hi}
      logoUrl={siteInfo?.logo ? cdn.logo(siteInfo.logo) : undefined}
    >
      {isBiharPension ? <BiharPensionsSearchEngine /> : undefined}
    </StateSubsiteLayout>
  );
}

