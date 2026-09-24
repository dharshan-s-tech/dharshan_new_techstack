import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface GeneratePdfOptions {
  title: string;
  subtitle?: string;
  refNo?: string;
  date?: string;
  category?: string;
  state?: string;
  paragraphs?: string[];
}

export async function generateOfficialCagPdf(options: GeneratePdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 size
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const primaryColor = rgb(0.459, 0.086, 0.224); // #751639 (CAG Maroon)
  const textColor = rgb(0.165, 0.165, 0.165); // #2A2A2A
  const mutedColor = rgb(0.42, 0.45, 0.50); // #6B7280

  const stateName = (options.state || 'Andhra Pradesh').toUpperCase();

  // Top header border line
  page.drawLine({
    start: { x: 40, y: height - 40 },
    end: { x: width - 40, y: height - 40 },
    thickness: 3,
    color: primaryColor,
  });

  // Header Titles
  const headerOrg = 'INDIAN AUDIT AND ACCOUNTS DEPARTMENT';
  const headerOrgWidth = fontBold.widthOfTextAtSize(headerOrg, 13);
  page.drawText(headerOrg, {
    x: (width - headerOrgWidth) / 2,
    y: height - 62,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });

  const headerOffice = `OFFICE OF THE PRINCIPAL ACCOUNTANT GENERAL (A&E)`;
  const headerOfficeWidth = fontBold.widthOfTextAtSize(headerOffice, 11);
  page.drawText(headerOffice, {
    x: (width - headerOfficeWidth) / 2,
    y: height - 78,
    size: 11,
    font: fontBold,
    color: primaryColor,
  });

  const headerState = `${stateName} :: VIJAYAWADA`;
  const headerStateWidth = fontBold.widthOfTextAtSize(headerState, 10);
  page.drawText(headerState, {
    x: (width - headerStateWidth) / 2,
    y: height - 93,
    size: 10,
    font: fontBold,
    color: mutedColor,
  });

  // Divider Line
  page.drawLine({
    start: { x: 40, y: height - 105 },
    end: { x: width - 40, y: height - 105 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  // Document Title Banner Box
  page.drawRectangle({
    x: 40,
    y: height - 165,
    width: width - 80,
    height: 46,
    color: rgb(0.98, 0.96, 0.93), // #FAF5ED
    borderColor: rgb(0.96, 0.90, 0.83),
    borderWidth: 1,
  });

  // Left Accent Bar on Title Box
  page.drawRectangle({
    x: 40,
    y: height - 165,
    width: 5,
    height: 46,
    color: primaryColor,
  });

  const rawTitle = options.title || 'Official Document';
  const cleanTitle = rawTitle.length > 58 ? rawTitle.slice(0, 55) + '...' : rawTitle;
  page.drawText(cleanTitle, {
    x: 55,
    y: height - 138,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });

  page.drawText(options.category || 'Official Statutory & Administrative Document Record', {
    x: 55,
    y: height - 154,
    size: 9,
    font: fontRegular,
    color: mutedColor,
  });

  // Meta Section: Ref No & Date
  const refNo = options.refNo || `No. PAG(A&E)/AP/ADMIN/DOC-${Math.floor(1000 + Math.random() * 9000)}/2026`;
  page.drawText(`Reference No: ${refNo}`, {
    x: 40,
    y: height - 185,
    size: 9,
    font: fontRegular,
    color: textColor,
  });

  const dateStr = options.date || `Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  const dateWidth = fontRegular.widthOfTextAtSize(dateStr, 9);
  page.drawText(dateStr, {
    x: width - 40 - dateWidth,
    y: height - 185,
    size: 9,
    font: fontRegular,
    color: textColor,
  });

  // Body content paragraphs
  let yPos = height - 220;
  const defaultParagraphs = [
    `1. This official document is published and released under the authority of the Principal`,
    `   Accountant General (A&E), ${options.state || 'Andhra Pradesh'}, Comptroller and Auditor General of India.`,
    ``,
    `2. Subject Matter: ${options.title}`,
    ``,
    `3. The contents, statutory schedules, and records documented herein are maintained as part`,
    `   of the official archives of the Indian Audit and Accounts Department (IA&AD).`,
    ``,
    `4. All concerned officers, Drawing and Disbursing Officers (DDOs), Treasury Officers, and`,
    `   subscribers are requested to take note of the guidelines and notifications issued herein.`,
    ``,
    `5. For further administrative inquiries or specific clarifications regarding this subject,`,
    `   communications may be addressed to the Office of the Principal Accountant General (A&E),`,
    `   ${options.state || 'Andhra Pradesh'}, Vijayawada.`,
  ];

  const linesToDraw = options.paragraphs && options.paragraphs.length > 0 ? options.paragraphs : defaultParagraphs;

  linesToDraw.forEach(line => {
    if (yPos > 180) {
      page.drawText(line, {
        x: 40,
        y: yPos,
        size: 10,
        font: fontRegular,
        color: textColor,
        lineHeight: 16,
      });
      yPos -= 17;
    }
  });

  // Watermark Seal Box
  page.drawRectangle({
    x: (width - 260) / 2,
    y: 110,
    width: 260,
    height: 52,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: primaryColor,
    borderWidth: 1.5,
  });

  const sealLine1 = 'COMPTROLLER & AUDITOR GENERAL OF INDIA';
  const sealWidth1 = fontBold.widthOfTextAtSize(sealLine1, 8.5);
  page.drawText(sealLine1, {
    x: (width - sealWidth1) / 2,
    y: 144,
    size: 8.5,
    font: fontBold,
    color: primaryColor,
  });

  const sealLine2 = 'AUTHENTICATED DIGITAL ARCHIVE COPY';
  const sealWidth2 = fontBold.widthOfTextAtSize(sealLine2, 8);
  page.drawText(sealLine2, {
    x: (width - sealWidth2) / 2,
    y: 130,
    size: 8,
    font: fontBold,
    color: rgb(0.1, 0.5, 0.2), // Green
  });

  const sealLine3 = `PAG (A&E) ${stateName}`;
  const sealWidth3 = fontRegular.widthOfTextAtSize(sealLine3, 7.5);
  page.drawText(sealLine3, {
    x: (width - sealWidth3) / 2,
    y: 118,
    size: 7.5,
    font: fontRegular,
    color: mutedColor,
  });

  // Footer Divider Line
  page.drawLine({
    start: { x: 40, y: 50 },
    end: { x: width - 40, y: 50 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  // Footer text
  page.drawText('Comptroller and Auditor General of India - Official Portal Release', {
    x: 40,
    y: 35,
    size: 8,
    font: fontRegular,
    color: mutedColor,
  });

  const pageNum = 'Page 1 of 1';
  const pageNumWidth = fontRegular.widthOfTextAtSize(pageNum, 8);
  page.drawText(pageNum, {
    x: width - 40 - pageNumWidth,
    y: 35,
    size: 8,
    font: fontRegular,
    color: mutedColor,
  });

  return await doc.save();
}
