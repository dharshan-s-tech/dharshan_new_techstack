export interface NavItem {
  id: string;
  title: string;
  titleHi: string;
  href: string;
  children?: NavItem[];
}

/**
 * Returns subsite-specific navigation structure matching both `oversea.md`
 * and verified PostgreSQL database menu hierarchies (Websites 144, 143, 148).
 *
 * Distinct differences per office:
 * - KUL (Website 144):
 *    - About Us includes: Vision & Mission, Brief History, List of PDs, List of Directors
 *    - Organizational Structure ('z'): Structure, Staff Details
 *    - Audit Functions: Audit jurisdiction, Administrative functions, Audit Process
 *    - Gallery: Photo Gallery & Video Gallery
 *    - List Of Holidays, Contact Us
 *
 * - LDN (Website 143):
 *    - About Us: NO Vision & Mission; starts with Brief History of the Office,
 *      followed by List of DGAs / Heads of Department, List of Directors
 *    - Organisational Structure (UK spelling 's'): Staff details
 *    - Audit Functions: Audit jurisdiction, Administrative functions, Audit Process
 *    - Gallery: Photo Gallery ONLY (NO Video Gallery)
 *    - List of Holidays (lowercase 'of'), Contact us (lowercase 'us')
 *
 * - WDC (Website 148):
 *    - About Us: NO Vision & Mission; starts with Brief History of Office (no 'the'),
 *      followed by List Of Directors (FIRST!), then List Of PDs (SECOND!)
 *    - Organisational Structure (Parent 's'): Organizational Structure ('z'), Staff details
 *    - Audit Functions: Administrative Function (FIRST & SINGULAR!), Audit Jurisdiction, Audit Process
 *    - Gallery: Photo Gallery & Video Gallery
 *    - List Of Holidays, Contact Us
 */
export function getOverseasNav(officeId: 'kul' | 'ldn' | 'wdc', lang: string = 'en'): NavItem[] {
  const isHi = lang === 'hi';
  const prefix = `/pda/${officeId}/${lang}`;

  if (officeId === 'ldn') {
    return [
      {
        id: 'home',
        title: isHi ? 'मुख्य पृष्ठ' : 'Home',
        titleHi: 'मुख्य पृष्ठ',
        href: prefix,
      },
      {
        id: 'about-us',
        title: isHi ? 'हमारे बारे में' : 'About Us',
        titleHi: 'हमारे बारे में',
        href: `${prefix}/page-pda-ldn-about-us`,
        children: [
          {
            id: 'brief-history',
            title: isHi ? 'कार्यालय का संक्षिप्त इतिहास' : 'Brief History of the Office',
            titleHi: 'कार्यालय का संक्षिप्त इतिहास',
            href: `${prefix}/page-pda-ldn-about-us`,
          },
          {
            id: 'list-of-pds',
            title: isHi ? 'महानिदेशकों की सूची' : 'List of DGAs / Heads of Department',
            titleHi: 'महानिदेशकों की सूची',
            href: `${prefix}/page-pda-ldn-list-of-pds`,
          },
          {
            id: 'list-of-directors',
            title: isHi ? 'निदेशकों की सूची' : 'List of Directors',
            titleHi: 'निदेशकों की सूची',
            href: `${prefix}/page-pda-ldn-list-of-directors`,
          },
        ],
      },
      {
        id: 'org-structure',
        title: isHi ? 'संगठन ढांचा' : 'Organisational Structure',
        titleHi: 'संगठन ढांचा',
        href: `${prefix}/page-pda-ldn-organization-structure-and-sanctioned-strength`,
        children: [
          {
            id: 'structure-strength',
            title: isHi ? 'संगठनात्मक संरचना' : 'Organisational Structure',
            titleHi: 'संगठनात्मक संरचना',
            href: `${prefix}/page-pda-ldn-organization-structure-and-sanctioned-strength`,
          },
          {
            id: 'staff-details',
            title: isHi ? 'स्टाफ विवरण' : 'Staff details',
            titleHi: 'स्टाफ विवरण',
            href: `${prefix}/page-pda-ldn-staff-details`,
          },
        ],
      },
      {
        id: 'audit-functions',
        title: isHi ? 'लेखापरीक्षा कार्य' : 'Audit Functions',
        titleHi: 'लेखापरीक्षा कार्य',
        href: `${prefix}/page-pda-ldn-audit-jurisdiction`,
        children: [
          {
            id: 'audit-jurisdiction',
            title: isHi ? 'लेखापरीक्षा क्षेत्राधिकार' : 'Audit jurisdiction',
            titleHi: 'लेखापरीक्षा क्षेत्राधिकार',
            href: `${prefix}/page-pda-ldn-audit-jurisdiction`,
          },
          {
            id: 'administrative-functions',
            title: isHi ? 'प्रशासनिक कार्य' : 'Administrative functions',
            titleHi: 'प्रशासनिक कार्य',
            href: `${prefix}/page-pda-ldn-administrative-functions`,
          },
          {
            id: 'audit-process',
            title: isHi ? 'लेखापरीक्षा प्रक्रिया' : 'Audit Process',
            titleHi: 'लेखापरीक्षा प्रक्रिया',
            href: `${prefix}/page-pda-ldn-audit-process`,
          },
        ],
      },
      {
        id: 'gallery',
        title: isHi ? 'गैलरी' : 'Gallery',
        titleHi: 'गैलरी',
        href: `${prefix}/photo-gallery`,
        children: [
          {
            id: 'photo-gallery',
            title: isHi ? 'फोटो गैलरी' : 'Photo Gallery',
            titleHi: 'फोटो गैलरी',
            href: `${prefix}/photo-gallery`,
          },
        ],
      },
      {
        id: 'holidays',
        title: isHi ? 'छुट्टियों की सूची' : 'List of Holidays',
        titleHi: 'छुट्टियों की सूची',
        href: `${prefix}/page-pda-ldn-list-of-holidays`,
      },
      {
        id: 'contact-us',
        title: isHi ? 'संपर्क करें' : 'Contact us',
        titleHi: 'संपर्क करें',
        href: `${prefix}/page-pda-ldn-contact-us`,
      },
    ];
  }

  if (officeId === 'wdc') {
    return [
      {
        id: 'home',
        title: isHi ? 'मुख्य पृष्ठ' : 'Home',
        titleHi: 'मुख्य पृष्ठ',
        href: prefix,
      },
      {
        id: 'about-us',
        title: isHi ? 'हमारे बारे में' : 'About Us',
        titleHi: 'हमारे बारे में',
        href: `${prefix}/page-pda-wdc-about-us`,
        children: [
          {
            id: 'brief-history',
            title: isHi ? 'कार्यालय का संक्षिप्त इतिहास' : 'Brief History of Office',
            titleHi: 'कार्यालय का संक्षिप्त इतिहास',
            href: `${prefix}/page-pda-wdc-about-us`,
          },
          {
            id: 'list-of-directors',
            title: isHi ? 'निदेशकों की सूची' : 'List Of Directors',
            titleHi: 'निदेशकों की सूची',
            href: `${prefix}/page-pda-wdc-list-of-directors`,
          },
          {
            id: 'list-of-pds',
            title: isHi ? 'पीडी की सूची' : 'List Of PDs',
            titleHi: 'पीडी की सूची',
            href: `${prefix}/page-pda-wdc-list-of-pds`,
          },
        ],
      },
      {
        id: 'org-structure',
        title: isHi ? 'संगठनात्मक संरचना' : 'Organisational Structure',
        titleHi: 'संगठनात्मक संरचना',
        href: `${prefix}/page-pda-wdc-organization-structure-and-sanctioned-strength`,
        children: [
          {
            id: 'structure-strength',
            title: isHi ? 'संगठनात्मक संरचना' : 'Organizational Structure',
            titleHi: 'संगठनात्मक संरचना',
            href: `${prefix}/page-pda-wdc-organization-structure-and-sanctioned-strength`,
          },
          {
            id: 'staff-details',
            title: isHi ? 'स्टाफ विवरण' : 'Staff details',
            titleHi: 'स्टाफ विवरण',
            href: `${prefix}/page-pda-wdc-staff-details`,
          },
        ],
      },
      {
        id: 'audit-functions',
        title: isHi ? 'लेखापरीक्षा कार्य' : 'Audit Functions',
        titleHi: 'लेखापरीक्षा कार्य',
        href: `${prefix}/page-pda-wdc-audit-jurisdiction`,
        children: [
          {
            id: 'administrative-functions',
            title: isHi ? 'प्रशासनिक कार्य' : 'Administrative Function',
            titleHi: 'प्रशासनिक कार्य',
            href: `${prefix}/page-pda-wdc-administrative-functions`,
          },
          {
            id: 'audit-jurisdiction',
            title: isHi ? 'लेखापरीक्षा क्षेत्राधिकार' : 'Audit Jurisdiction',
            titleHi: 'लेखापरीक्षा क्षेत्राधिकार',
            href: `${prefix}/page-pda-wdc-audit-jurisdiction`,
          },
          {
            id: 'audit-process',
            title: isHi ? 'लेखापरीक्षा प्रक्रिया' : 'Audit Process',
            titleHi: 'लेखापरीक्षा प्रक्रिया',
            href: `${prefix}/page-pda-wdc-audit-process`,
          },
        ],
      },
      {
        id: 'gallery',
        title: isHi ? 'गैलरी' : 'Gallery',
        titleHi: 'गैलरी',
        href: `${prefix}/photo-gallery`,
        children: [
          {
            id: 'photo-gallery',
            title: isHi ? 'फोटो गैलरी' : 'Photo Gallery',
            titleHi: 'फोटो गैलरी',
            href: `${prefix}/photo-gallery`,
          },
          {
            id: 'video-gallery',
            title: isHi ? 'वीडियो गैलरी' : 'Video Gallery',
            titleHi: 'वीडियो गैलरी',
            href: `${prefix}/video-gallery`,
          },
        ],
      },
      {
        id: 'holidays',
        title: isHi ? 'छुट्टियों की सूची' : 'List Of Holidays',
        titleHi: 'छुट्टियों की सूची',
        href: `${prefix}/page-pda-wdc-list-of-holidays`,
      },
      {
        id: 'contact-us',
        title: isHi ? 'संपर्क करें' : 'Contact Us',
        titleHi: 'संपर्क करें',
        href: `${prefix}/page-pda-wdc-contact-us`,
      },
    ];
  }

  // Default: KUL (Website 144)
  return [
    {
      id: 'home',
      title: isHi ? 'मुख्य पृष्ठ' : 'Home',
      titleHi: 'मुख्य पृष्ठ',
      href: prefix,
    },
    {
      id: 'about-us',
      title: isHi ? 'हमारे बारे में' : 'About Us',
      titleHi: 'हमारे बारे में',
      href: `${prefix}/page-pda-kul-about-us`,
      children: [
        {
          id: 'vision-mission',
          title: isHi ? 'हमारा विज़न, मिशन एवं मूल मूल्य' : 'Our Vision, Mission and Core Values',
          titleHi: 'हमारा विज़न, मिशन एवं मूल मूल्य',
          href: `${prefix}/page-pda-kul-our-vision-mission-and-core-values`,
        },
        {
          id: 'brief-history',
          title: isHi ? 'कार्यालय का संक्षिप्त इतिहास' : 'Brief History of the Office',
          titleHi: 'कार्यालय का संक्षिप्त इतिहास',
          href: `${prefix}/page-pda-kul-about-us`,
        },
        {
          id: 'list-of-pds',
          title: isHi ? 'प्रधान निदेशकों की सूची' : 'List of PDs',
          titleHi: 'प्रधान निदेशकों की सूची',
          href: `${prefix}/page-pda-kul-list-of-pds`,
        },
        {
          id: 'list-of-directors',
          title: isHi ? 'निदेशकों की सूची' : 'List of Directors',
          titleHi: 'निदेशकों की सूची',
          href: `${prefix}/page-pda-kul-list-of-directors`,
        },
      ],
    },
    {
      id: 'org-structure',
      title: isHi ? 'संगठनात्मक संरचना' : 'Organizational Structure',
      titleHi: 'संगठनात्मक संरचना',
      href: `${prefix}/page-pda-kul-organization-structure-and-sanctioned-strength`,
      children: [
        {
          id: 'structure-strength',
          title: isHi ? 'संगठनात्मक संरचना' : 'Organizational Structure',
          titleHi: 'संगठनात्मक संरचना',
          href: `${prefix}/page-pda-kul-organization-structure-and-sanctioned-strength`,
        },
        {
          id: 'staff-details',
          title: isHi ? 'स्टाफ सदस्यों का विवरण' : 'Staff Details',
          titleHi: 'स्टाफ सदस्यों का विवरण',
          href: `${prefix}/page-pda-kul-staff-details`,
        },
      ],
    },
    {
      id: 'audit-functions',
      title: isHi ? 'लेखापरीक्षा कार्य' : 'Audit Functions',
      titleHi: 'लेखापरीक्षा कार्य',
      href: `${prefix}/page-pda-kul-audit-jurisdiction`,
      children: [
        {
          id: 'audit-jurisdiction',
          title: isHi ? 'लेखापरीक्षा क्षेत्राधिकार' : 'Audit jurisdiction',
          titleHi: 'लेखापरीक्षा क्षेत्राधिकार',
          href: `${prefix}/page-pda-kul-audit-jurisdiction`,
        },
        {
          id: 'administrative-functions',
          title: isHi ? 'प्रशासनिक कार्य' : 'Administrative functions',
          titleHi: 'प्रशासनिक कार्य',
          href: `${prefix}/page-pda-kul-administrative-functions`,
        },
        {
          id: 'audit-process',
          title: isHi ? 'लेखापरीक्षा पद्धति' : 'Audit Process',
          titleHi: 'लेखापरीक्षा पद्धति',
          href: `${prefix}/page-pda-kul-audit-process`,
        },
      ],
    },
    {
      id: 'gallery',
      title: isHi ? 'गैलरी' : 'Gallery',
      titleHi: 'गैलरी',
      href: `${prefix}/photo-gallery`,
      children: [
        {
          id: 'photo-gallery',
          title: isHi ? 'फ़ोटो गैलरी' : 'Photo Gallery',
          titleHi: 'फ़ोटो गैलरी',
          href: `${prefix}/photo-gallery`,
        },
        {
          id: 'video-gallery',
          title: isHi ? 'वीडियो गैलरी' : 'Video Gallery',
          titleHi: 'वीडियो गैलरी',
          href: `${prefix}/video-gallery`,
        },
      ],
    },
    {
      id: 'holidays',
      title: isHi ? 'छुट्टियों की सूची' : 'List Of Holidays',
      titleHi: 'छुट्टियों की सूची',
      href: `${prefix}/page-pda-kul-list-of-holidays`,
    },
    {
      id: 'contact-us',
      title: isHi ? 'संपर्क करें' : 'Contact Us',
      titleHi: 'संपर्क करें',
      href: `${prefix}/page-pda-kul-contact-us`,
    },
  ];
}
