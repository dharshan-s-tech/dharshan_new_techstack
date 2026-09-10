'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { dataManager } from '@/lib/dataManager';

// Interface definitions
interface OfficeItem {
  id: string;
  title: string;
  hindiTitle: string;
  city: string;
  hindiCity: string;
  country: string;
  hasPdf: boolean;
  pdfSize?: string;
  pdfTitle?: string;
  hindiPdfTitle?: string;
  designation: string;
  hindiDesignation: string;
  location: string;
  hindiLocation: string;
  jurisdiction: string;
  hindiJurisdiction: string;
  mandate: string;
  hindiMandate: string;
  keyEntities: string[];
  hindiKeyEntities: string[];
}

interface SidebarLink {
  name: string;
  hindiName: string;
  slug: string;
}

interface SidebarGroup {
  heading: string;
  hindiHeading: string;
  links: SidebarLink[];
}

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    heading: 'Audit Engagements',
    hindiHeading: 'लेखा परीक्षा सहभागिता',
    links: [
      {
        name: 'UN Panel of External Auditors',
        hindiName: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल',
        slug: 'un panel of external auditors',
      },
      {
        name: 'Present International Audits',
        hindiName: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा',
        slug: 'present international audits',
      },
      {
        name: 'Past International Audits',
        hindiName: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा',
        slug: 'past international audits',
      },
      {
        name: 'Overseas Audit Offices',
        hindiName: 'विदेशी लेखा परीक्षा कार्यालय',
        slug: 'overseas audit offices',
      },
    ],
  },
  {
    heading: 'International Bodies',
    hindiHeading: 'अंतर्राष्ट्रीय निकाय',
    links: [
      {
        name: 'Association with INTOSAI',
        hindiName: 'INTOSAI के साथ जुड़ाव',
        slug: 'association with intosai',
      },
      {
        name: 'Association with ASOSAI',
        hindiName: 'ASOSAI के साथ जुड़ाव',
        slug: 'association with asosai',
      },
      {
        name: 'Multilateral Engagement',
        hindiName: 'बहुपक्षीय सहभागिता',
        slug: 'multilateral engagement',
      },
    ],
  },
  {
    heading: 'Bilateral Relations',
    hindiHeading: 'द्विपक्षीय संबंध',
    links: [
      {
        name: 'Bilateral Relations',
        hindiName: 'द्विपक्षीय संबंध',
        slug: 'bilateral relations',
      },
    ],
  },
  {
    heading: 'Training Institutes',
    hindiHeading: 'प्रशिक्षण संस्थान',
    links: [
      { name: 'iCED', hindiName: 'iCED', slug: 'iced' },
      { name: 'iCISA', hindiName: 'iCISA', slug: 'icisa' },
      { name: 'NAAA', hindiName: 'NAAA', slug: 'naaa' },
      { name: 'iCAL', hindiName: 'iCAL', slug: 'ical' },
    ],
  },
  {
    heading: 'Contact',
    hindiHeading: 'संपर्क',
    links: [
      {
        name: 'International relation wing',
        hindiName: 'अंतर्राष्ट्रीय संबंध विंग',
        slug: 'international relations wing',
      },
    ],
  },
];

interface OfficerProfile {
  id: string;
  name: string;
  hindiName: string;
  designation: string;
  hindiDesignation: string;
  email: string;
  image: string;
}

const IR_OFFICERS: OfficerProfile[] = [
  {
    id: 'subramanian',
    name: 'Mr. K. S. Subramanian',
    hindiName: 'श्री के. एस. सुब्रमण्यन',
    designation: 'Deputy Comptroller & Auditor General (Human Resources,\nInternational Relations, Coordination and Legal)',
    hindiDesignation: 'उप नियंत्रक एवं महालेखापरीक्षक (मानव संसाधन,\nअंतर्राष्ट्रीय संबंध, समन्वय और कानूनी)',
    email: 'subramanianks@cag.gov.in',
    image: '/assets/officers/subramanian.jpg',
  },
  {
    id: 'patwardhan',
    name: 'Mr. Vimalendra Anand Patwardhan',
    hindiName: 'श्री विमलेंद्र आनंद पटवर्धन',
    designation: 'Director General (International Relations)',
    hindiDesignation: 'महानिदेशक (अंतर्राष्ट्रीय संबंध)',
    email: 'patwardhanva@cag.gov.in',
    image: '/assets/officers/patwardhan.jpg',
  },
  {
    id: 'patil',
    name: 'Mr. Nilesh Patil',
    hindiName: 'श्री नीलेश पाटिल',
    designation: 'Director (International Relations)',
    hindiDesignation: 'निदेशक (अंतर्राष्ट्रीय संबंध)',
    email: 'patilnp@cag.gov.in',
    image: '/assets/officers/patil.jpg',
  },
  {
    id: 'choudhary',
    name: 'Mr. Abhinav Choudhary',
    hindiName: 'श्री अभिनव चौधरी',
    designation: 'Dy. Director (International Relations)',
    hindiDesignation: 'उप निदेशक (अंतर्राष्ट्रीय संबंध)',
    email: 'abhinavc@cag.gov.in',
    image: '/assets/officers/choudhary.jpg',
  },
];

const OVERSEAS_OFFICES: OfficeItem[] = [
  {
    id: 'washington',
    title: 'Principal Director of Audit, Washington DC',
    hindiTitle: 'प्रधान लेखा परीक्षा निदेशक, वाशिंगटन डीसी',
    city: 'Washington DC',
    hindiCity: 'वाशिंगटन डीसी',
    country: 'United States',
    hasPdf: false,
    designation: 'Principal Director of Audit (PDA)',
    hindiDesignation: 'प्रधान लेखा परीक्षा निदेशक (पीडीए)',
    location: 'Embassy of India, 2107 Massachusetts Ave NW, Washington, DC 20008, USA',
    hindiLocation: 'भारतीय दूतावास, 2107 मैसाचुसेट्स एवेन्यू एनडब्ल्यू, वाशिंगटन, डीसी 20008, यूएसए',
    jurisdiction: 'North America, Central America & South America',
    hindiJurisdiction: 'उत्तरी अमेरिका, मध्य अमेरिका और दक्षिण अमेरिका',
    mandate:
      'Responsible for external audit of the Embassy of India in Washington DC, Consulates General across North and South America, Permanent Mission of India to the UN (New York), defense supply missions, and commercial wings of public sector undertakings in the region.',
    hindiMandate:
      'वाशिंगटन डीसी में भारतीय दूतावास, उत्तर और दक्षिण अमेरिका में महावाणिज्य दूतावासों, संयुक्त राष्ट्र (न्यूयॉर्क) में भारत के स्थायी मिशन, रक्षा आपूर्ति मिशनों और इस क्षेत्र में सार्वजनिक क्षेत्र के उपक्रमों के वाणिज्यिक विंगों के बाह्य लेखा परीक्षा के लिए जिम्मेदार।',
    keyEntities: [
      'Embassy of India, Washington DC',
      'Permanent Mission of India to the UN, New York',
      'Consulates General: New York, San Francisco, Chicago, Houston, Atlanta, Seattle',
      'Indian Missions across Canada, Mexico, Brazil, Argentina, Chile',
      'Air India & PSU Overseas Liaison Offices in the Americas',
    ],
    hindiKeyEntities: [
      'भारतीय दूतावास, वाशिंगटन डीसी',
      'संयुक्त राष्ट्र में भारत का स्थायी मिशन, न्यूयॉर्क',
      'महावाणिज्य दूतावास: न्यूयॉर्क, सैन फ्रांसिस्को, शिकागो, ह्यूस्टन, अटलांटा, सिएटल',
      'कनाडा, मैक्सिको, ब्राजील, अर्जेंटीना, चिली में भारतीय मिशन',
      'अमेरिका में एयर इंडिया और पीएसयू विदेशी संपर्क कार्यालय',
    ],
  },
  {
    id: 'london',
    title: 'Principal Director of Audit, London',
    hindiTitle: 'प्रधान लेखा परीक्षा निदेशक, लंदन',
    city: 'London',
    hindiCity: 'लंदन',
    country: 'United Kingdom',
    hasPdf: false,
    designation: 'Principal Director of Audit (PDA)',
    hindiDesignation: 'प्रधान लेखा परीक्षा निदेशक (पीडीए)',
    location: 'High Commission of India, India House, Aldwych, London WC2B 4NA, UK',
    hindiLocation: 'भारतीय उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA, यूके',
    jurisdiction: 'United Kingdom and Western European Nations',
    hindiJurisdiction: 'यूनाइटेड किंगडम और पश्चिमी यूरोपीय देश',
    mandate:
      'Oversees comprehensive audit of the High Commission of India in London, diplomatic posts in the UK and Western Europe, defense procurement offices, Tourist Offices, and overseas branches of state enterprises.',
    hindiMandate:
      'लंदन में भारतीय उच्चायोग, ब्रिटेन और पश्चिमी यूरोप में राजनयिक पदों, रक्षा खरीद कार्यालयों, पर्यटक कार्यालयों और राज्य उद्यमों की विदेशी शाखाओं के व्यापक लेखा परीक्षा की देखरेख करता है।',
    keyEntities: [
      'High Commission of India, London',
      'Consulates General in Birmingham, Edinburgh',
      'Indian Embassies in France, Germany, Netherlands, Belgium, Spain, Portugal',
      'Ministry of Defence & Technical Liaison Offices in the UK',
      'Public Sector Banks and Insurance entities operating in Europe',
    ],
    hindiKeyEntities: [
      'भारतीय उच्चायोग, लंदन',
      'बर्मिंघम, एडिनबर्ग में महावाणिज्य दूतावास',
      'फ्रांस, जर्मनी, नीदरलैंड, बेल्जियम, स्पेन, पुर्तगाल में भारतीय दूतावास',
      'यूके में रक्षा मंत्रालय और तकनीकी संपर्क कार्यालय',
      'यूरोप में कार्यरत सार्वजनिक क्षेत्र के बैंक और बीमा संस्थाएं',
    ],
  },
  {
    id: 'kuala-lumpur',
    title: 'Principal Director of Audit, Kuala Lumpur',
    hindiTitle: 'प्रधान लेखा परीक्षा निदेशक, कुआलालंपुर',
    city: 'Kuala Lumpur',
    hindiCity: 'कुआलालंपुर',
    country: 'Malaysia',
    hasPdf: false,
    designation: 'Principal Director of Audit (PDA)',
    hindiDesignation: 'प्रधान लेखा परीक्षा निदेशक (पीडीए)',
    location: 'High Commission of India, Menara 1 Mon’t Kiara, Kuala Lumpur, Malaysia',
    hindiLocation: 'भारतीय उच्चायोग, मेनारा 1 मॉन्ट कियारा, कुआलालंपुर, मलेशिया',
    jurisdiction: 'Southeast Asia, East Asia & Australasia / Pacific',
    hindiJurisdiction: 'दक्षिण पूर्व एशिया, पूर्वी एशिया और ऑस्ट्रेलेशिया / प्रशांत',
    mandate:
      'Conducts audit of Indian High Commissions, Embassies, and Consulates across ASEAN nations, Japan, South Korea, Australia, New Zealand, and Pacific Island countries.',
    hindiMandate:
      'आसियान देशों, जापान, दक्षिण कोरिया, ऑस्ट्रेलिया, न्यूजीलैंड और प्रशांत द्वीप देशों में भारतीय उच्चायोगों, दूतावासों और वाणिज्य दूतावासों का लेखा परीक्षण आयोजित करता है।',
    keyEntities: [
      'High Commission of India, Kuala Lumpur & Singapore',
      'Embassy of India in Tokyo, Seoul, Beijing, Jakarta, Bangkok, Hanoi',
      'High Commission in Canberra, Wellington, Suva (Fiji), Port Moresby',
      'Consulates General in Sydney, Melbourne, Osaka, Shanghai, Guangzhou',
      'Indian PSU Joint Ventures and Trade Promotion Centers in the Asia-Pacific',
    ],
    hindiKeyEntities: [
      'भारतीय उच्चायोग, कुआलालंपुर और सिंगापुर',
      'टोक्यो, सियोल, बीजिंग, जकार्ता, बैंकॉक, हनोई में भारतीय दूतावास',
      'कैनबरा, वेलिंगटन, सुवा (फिजी), पोर्ट मोरेस्बी में उच्चायोग',
      'सिडनी, मेलबर्न, ओसाका, शंघाई, ग्वांगझू में महावाणिज्य दूतावास',
      'एशिया-प्रशांत में भारतीय पीएसयू संयुक्त उद्यम और व्यापार संवर्धन केंद्र',
    ],
  },
  {
    id: 'rome',
    title: 'Director of External Audit, Rome',
    hindiTitle: 'बाह्य लेखा परीक्षा निदेशक, रोम',
    city: 'Rome',
    hindiCity: 'रोम',
    country: 'Italy',
    hasPdf: true,
    pdfSize: '34.7 MB',
    pdfTitle: 'External Audit of UN Rome-Based Agencies Mandate & Governance',
    hindiPdfTitle: 'संयुक्त राष्ट्र रोम स्थित एजेंसियों का बाह्य लेखा परीक्षा अधिदेश और शासन',
    designation: 'Director of External Audit (DEA)',
    hindiDesignation: 'बाह्य लेखा परीक्षा निदेशक (डीईए)',
    location: 'Food and Agriculture Organization (FAO) Headquarters, Viale delle Terme di Caracalla, Rome, Italy',
    hindiLocation: 'खाद्य एवं कृषि संगठन (एफएओ) मुख्यालय, वियाले डेले टर्मे डि कराकल्ला, रोम, इटली',
    jurisdiction: 'UN Specialized Agencies Headquartered in Rome',
    hindiJurisdiction: 'रोम में मुख्यालय वाली संयुक्त राष्ट्र विशेष एजेंसियां',
    mandate:
      'Directly responsible for conducting independent statutory external financial audits, compliance verifications, and performance audits for United Nations Rome-based organizations.',
    hindiMandate:
      'संयुक्त राष्ट्र रोम स्थित संगठनों के लिए स्वतंत्र वैधानिक बाह्य वित्तीय लेखा परीक्षा, अनुपालन सत्यापन और प्रदर्शन लेखा परीक्षा आयोजित करने के लिए प्रत्यक्ष रूप से जिम्मेदार।',
    keyEntities: [
      'Food and Agriculture Organization (FAO)',
      'World Food Programme (WFP)',
      'International Fund for Agricultural Development (IFAD)',
      'International Centre for the Study of the Preservation and Restoration of Cultural Property (ICCROM)',
    ],
    hindiKeyEntities: [
      'खाद्य एवं कृषि संगठन (FAO)',
      'विश्व खाद्य कार्यक्रम (WFP)',
      'कृषि विकास के लिए अंतर्राष्ट्रीय कोष (IFAD)',
      'सांस्कृतिक संपत्ति के संरक्षण और जीर्णोद्धार के अध्ययन के लिए अंतर्राष्ट्रीय केंद्र (ICCROM)',
    ],
  },
  {
    id: 'geneva',
    title: 'Director of External Audit, Geneva',
    hindiTitle: 'बाह्य लेखा परीक्षा निदेशक, जिनेवा',
    city: 'Geneva',
    hindiCity: 'जिनेवा',
    country: 'Switzerland',
    hasPdf: true,
    pdfSize: '34.7 MB',
    pdfTitle: 'External Audit Report of Specialized UN Agencies — Geneva Office',
    hindiPdfTitle: 'विशेषज्ञ संयुक्त राष्ट्र एजेंसियों की बाह्य लेखा परीक्षा रिपोर्ट — जिनेवा कार्यालय',
    designation: 'Director of External Audit (DEA)',
    hindiDesignation: 'बाह्य लेखा परीक्षा निदेशक (डीईए)',
    location: 'World Health Organization (WHO) Headquarters / UNOG, Geneva, Switzerland',
    hindiLocation: 'विश्व स्वास्थ्य संगठन (डब्ल्यूएचओ) मुख्यालय / यूएनओजी, जिनेवा, स्विट्जरलैंड',
    jurisdiction: 'UN Global Health & Specialized Organizations in Geneva',
    hindiJurisdiction: 'जिनेवा में संयुक्त राष्ट्र वैश्विक स्वास्थ्य और विशेष संगठन',
    mandate:
      'Performs external audit mandates as appointed External Auditor by the World Health Assembly and governing boards of international organizations, providing audit certificates and value-for-money evaluations.',
    hindiMandate:
      'विश्व स्वास्थ्य सभा और अंतर्राष्ट्रीय संगठनों के शासी बोर्डों द्वारा नियुक्त बाह्य लेखा परीक्षक के रूप में बाह्य लेखा परीक्षा अधिदेशों का निष्पादन करता है, लेखा परीक्षा प्रमाणपत्र और प्रदर्शन मूल्यांकन प्रदान करता है।',
    keyEntities: [
      'World Health Organization (WHO)',
      'International Labour Organization (ILO)',
      'International Telecommunication Union (ITU)',
      'World Intellectual Property Organization (WIPO)',
      'UNITAID (Global Health Partnership)',
      'Inter-Parliamentary Union (IPU)',
    ],
    hindiKeyEntities: [
      'विश्व स्वास्थ्य संगठन (WHO)',
      'अंतर्राष्ट्रीय श्रम संगठन (ILO)',
      'अंतर्राष्ट्रीय दूरसंचार संघ (ITU)',
      'विश्व बौद्धिक संपदा संगठन (WIPO)',
      'यूनिटैड (वैश्विक स्वास्थ्य भागीदारी)',
      'अंतर-संसदीय संघ (IPU)',
    ],
  },
];

// Fallback data for other Global Relations pages
const OTHER_PAGES_DATA: Record<
  string,
  {
    title: string;
    hindiTitle: string;
    group: string;
    hindiGroup: string;
    description: string;
    hindiDescription: string;
  }
> = {
  'un panel of external auditors': {
    title: 'UN Panel of External Auditors',
    hindiTitle: 'बाह्य लेखा परीक्षकों का संयुक्त राष्ट्र पैनल',
    group: 'Audit Engagements',
    hindiGroup: 'लेखा परीक्षा सहभागिता',
    description:
      'The Comptroller and Auditor General of India is a prominent member of the United Nations Panel of External Auditors. The Panel contributes to the supreme quality and consistency of auditing standards across all UN system organizations and peacekeeping missions.',
    hindiDescription:
      'भारत के नियंत्रक एवं महालेखा परीक्षक संयुक्त राष्ट्र के बाह्य लेखा परीक्षकों के पैनल के एक प्रमुख सदस्य हैं। यह पैनल सभी संयुक्त राष्ट्र प्रणाली संगठनों और शांति स्थापना मिशनों में लेखा परीक्षा मानकों की सर्वोच्च गुणवत्ता और निरंतरता में योगदान देता है।',
  },
  'present international audits': {
    title: 'Present International Audits',
    hindiTitle: 'वर्तमान अंतर्राष्ट्रीय लेखा परीक्षा',
    group: 'Audit Engagements',
    hindiGroup: 'लेखा परीक्षा सहभागिता',
    description:
      'SAI India currently holds prestigious external audit mandates for premier international bodies, including the World Health Organization (WHO), Food and Agriculture Organization (FAO), International Labour Organization (ILO), and the Organization for the Prohibition of Chemical Weapons (OPCW).',
    hindiDescription:
      'SAI भारत के पास वर्तमान में विश्व स्वास्थ्य संगठन (WHO), खाद्य एवं कृषि संगठन (FAO), अंतर्राष्ट्रीय श्रम संगठन (ILO), और रासायनिक हथियार निषेध संगठन (OPCW) सहित प्रमुख अंतर्राष्ट्रीय निकायों के लिए प्रतिष्ठित बाह्य लेखा परीक्षा अधिदेश हैं।',
  },
  'past international audits': {
    title: 'Past International Audits',
    hindiTitle: 'विगत अंतर्राष्ट्रीय लेखा परीक्षा',
    group: 'Audit Engagements',
    hindiGroup: 'लेखा परीक्षा सहभागिता',
    description:
      'Over the decades, SAI India has successfully served as External Auditor to numerous multilateral institutions such as the World Meteorological Organization (WMO), International Atomic Energy Agency (IAEA), and UN peacekeeping missions.',
    hindiDescription:
      'दशकों से, SAI भारत ने विश्व मौसम विज्ञान संगठन (WMO), अंतर्राष्ट्रीय परमाणु ऊर्जा एजेंसी (IAEA), और संयुक्त राष्ट्र शांति स्थापना मिशनों जैसे कई बहुपक्षीय संस्थानों के बाह्य लेखा परीक्षक के रूप में सफलतापूर्वक कार्य किया है।',
  },
  'association with intosai': {
    title: 'Association with INTOSAI',
    hindiTitle: 'INTOSAI के साथ जुड़ाव',
    group: 'International Bodies',
    hindiGroup: 'अंतर्राष्ट्रीय निकाय',
    description:
      'SAI India is a key constituent of the International Organization of Supreme Audit Institutions (INTOSAI), chairing several strategic working groups including the Working Group on IT Audit (WGITA) and compliance auditing initiatives.',
    hindiDescription:
      'SAI भारत सर्वोच्च लेखा परीक्षा संस्थानों के अंतर्राष्ट्रीय संगठन (INTOSAI) का एक प्रमुख घटक है, जो आईटी ऑडिट (WGITA) और अनुपालन लेखा परीक्षा पहलों पर कार्य समूह सहित कई रणनीतिक कार्य समूहों की अध्यक्षता करता है।',
  },
  'association with asosai': {
    title: 'Association with ASOSAI',
    hindiTitle: 'ASOSAI के साथ जुड़ाव',
    group: 'International Bodies',
    hindiGroup: 'अंतर्राष्ट्रीय निकाय',
    description:
      'As a founding and active member of the Asian Organization of Supreme Audit Institutions (ASOSAI), SAI India fosters regional collaboration, joint capacity building, and innovative audit research throughout the Asian continent.',
    hindiDescription:
      'एशियाई सर्वोच्च लेखा परीक्षा संस्थानों के संगठन (ASOSAI) के संस्थापक और सक्रिय सदस्य के रूप में, SAI भारत पूरे एशियाई महाद्वीप में क्षेत्रीय सहयोग, संयुक्त क्षमता निर्माण और नवीन लेखा परीक्षा अनुसंधान को बढ़ावा देता है।',
  },
  'multilateral engagement': {
    title: 'Multilateral Engagement',
    hindiTitle: 'बहुपक्षीय सहभागिता',
    group: 'International Bodies',
    hindiGroup: 'अंतर्राष्ट्रीय निकाय',
    description:
      'Engagement in global multilateral platforms including SAI20 (G20 Engagement Group of Supreme Audit Institutions), BRICS SAIs, and Commonwealth Auditors General forums.',
    hindiDescription:
      'SAI20 (सुप्रीम ऑडिट संस्थानों का G20 एंगेजमेंट ग्रुप), ब्रिक्स SAI, और कॉमनवेल्थ ऑडिटर्स जनरल मंचों सहित वैश्विक बहुपक्षीय मंचों में सहभागिता।',
  },
  'bilateral relations': {
    title: 'Bilateral Relations',
    hindiTitle: 'द्विपक्षीय संबंध',
    group: 'Bilateral Relations',
    hindiGroup: 'द्विपक्षीय संबंध',
    description:
      'SAI India maintains bilateral Memoranda of Understanding (MoUs) and mutual cooperation agreements with over 30 Supreme Audit Institutions across the globe to facilitate joint training and peer reviews.',
    hindiDescription:
      'SAI भारत संयुक्त प्रशिक्षण और सहकर्मी समीक्षाओं को सुविधाजनक बनाने के लिए दुनिया भर के 30 से अधिक सर्वोच्च लेखा परीक्षा संस्थानों के साथ द्विपक्षीय समझौता ज्ञापनों (MoUs) और पारस्परिक सहयोग समझौतों को बनाए रखता है।',
  },
  'iced': {
    title: 'International Centre for Environment Audit and Sustainable Development (iCED)',
    hindiTitle: 'पर्यावरण लेखा परीक्षा और सतत विकास के लिए अंतर्राष्ट्रीय केंद्र (iCED)',
    group: 'Training Institutes',
    hindiGroup: 'प्रशिक्षण संस्थान',
    description:
      'Located in Jaipur, iCED is a global state-of-the-art center for international training and research in environmental auditing, climate finance, and sustainable development goals (SDGs).',
    hindiDescription:
      'जयपुर में स्थित, iCED पर्यावरण लेखा परीक्षा, जलवायु वित्त और सतत विकास लक्ष्यों (SDGs) में अंतर्राष्ट्रीय प्रशिक्षण और अनुसंधान के लिए एक वैश्विक अत्याधुनिक केंद्र है।',
  },
  'icisa': {
    title: 'International Centre for Information Systems and Audit (iCISA)',
    hindiTitle: 'सूचना प्रणाली और लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCISA)',
    group: 'Training Institutes',
    hindiGroup: 'प्रशिक्षण संस्थान',
    description:
      'Based in Noida, iCISA is an internationally acclaimed academy providing specialized training in Information Systems audit, Big Data analytics, AI-assisted auditing, and cybersecurity auditing for auditors worldwide.',
    hindiDescription:
      'नोएडा में स्थित, iCISA एक अंतरराष्ट्रीय स्तर पर प्रशंसित अकादमी है जो दुनिया भर के लेखा परीक्षकों के लिए सूचना प्रणाली लेखा परीक्षा, बिग डेटा एनालिटिक्स, एआई-सहायता प्राप्त लेखा परीक्षा और साइबर सुरक्षा लेखा परीक्षा में विशेष प्रशिक्षण प्रदान करती है।',
  },
  'naaa': {
    title: 'National Academy of Audit & Accounts (NAAA)',
    hindiTitle: 'राष्ट्रीय लेखा परीक्षा और लेखा अकादमी (NAAA)',
    group: 'Training Institutes',
    hindiGroup: 'प्रशिक्षण संस्थान',
    description:
      'Located in Shimla, NAAA is the apex induction and continuous professional learning academy for officers of the Indian Audit & Accounts Service (IA&AS).',
    hindiDescription:
      'शिमला में स्थित, NAAA भारतीय लेखा परीक्षा और लेखा सेवा (IA&AS) के अधिकारियों के लिए सर्वोच्च प्रेरण और निरंतर व्यावसायिक शिक्षण अकादमी है।',
  },
  'ical': {
    title: 'International Centre for Audit of Local Governance (iCAL)',
    hindiTitle: 'स्थानीय शासन के लेखा परीक्षा के लिए अंतर्राष्ट्रीय केंद्र (iCAL)',
    group: 'Training Institutes',
    hindiGroup: 'प्रशिक्षण संस्थान',
    description:
      'iCAL in Rajkot focuses on capacity building, standard operating frameworks, and research for municipal and panchayat local government auditing.',
    hindiDescription:
      'राजकोट में iCAL नगर निगम और पंचायत स्थानीय सरकारी लेखा परीक्षा के लिए क्षमता निर्माण, मानक संचालन ढांचे और अनुसंधान पर केंद्रित है।',
  },
  'international relations wing': {
    title: 'International Relations Wing',
    hindiTitle: 'अंतर्राष्ट्रीय संबंध विंग',
    group: 'Contact',
    hindiGroup: 'संपर्क',
    description:
      'The International Relations (IR) Wing at the CAG Headquarters in New Delhi coordinates all international engagements, UN audits, multilateral conferences, and overseas audit offices.',
    hindiDescription:
      'नई दिल्ली में सीएजी मुख्यालय में अंतर्राष्ट्रीय संबंध (आईआर) विंग सभी अंतर्राष्ट्रीय गतिविधियों, संयुक्त राष्ट्र लेखा परीक्षाओं, बहुपक्षीय सम्मेलनों और विदेशी लेखा परीक्षा कार्यालयों का समन्वय करता है।',
  },
};

export default function GlobalRelationsDynamicPage({
  params,
}: {
  params?: Promise<{ slug: string }> | { slug: string };
}) {
  const routeParams = useParams();
  let rawSlug = '';
  if (routeParams?.slug) {
    rawSlug = Array.isArray(routeParams.slug) ? routeParams.slug[0] : (routeParams.slug as string);
  } else if (params) {
    if (typeof (params as any).then === 'function') {
      try {
        const unwrapped = React.use(params as Promise<{ slug: string }>);
        rawSlug = unwrapped?.slug || '';
      } catch {
        rawSlug = '';
      }
    } else {
      rawSlug = (params as { slug: string }).slug || '';
    }
  }

  const slugDecoded = decodeURIComponent(rawSlug || '').toLowerCase().trim();

  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [selectedOffice, setSelectedOffice] = useState<OfficeItem | null>(null);
  const [activePdfModal, setActivePdfModal] = useState<{
    title: string;
    hindiTitle: string;
    pdfSize: string;
    pdfTitle: string;
    hindiPdfTitle: string;
    mandate?: string;
    hindiMandate?: string;
    keyEntities?: string[];
    hindiKeyEntities?: string[];
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';
  const isOverseasOffices =
    slugDecoded === 'overseas audit offices' ||
    slugDecoded === 'overseas-audit-offices';
  const isIced = slugDecoded === 'iced' || slugDecoded === '';
  const isIcisa = slugDecoded === 'icisa';
  const isNaaa = slugDecoded === 'naaa';
  const isIcal = slugDecoded === 'ical';
  const isIrWing =
    slugDecoded === 'international relations wing' ||
    slugDecoded === 'international-relations-wing' ||
    slugDecoded === 'international relation wing' ||
    slugDecoded === 'international-relation-wing';
  const isBilateral = slugDecoded === 'bilateral relations';

  // Compute active sidebar group dynamically
  const currentSidebarGroup = useMemo(() => {
    const norm = (s: string) => (s || '').toLowerCase().replace(/[-_]/g, ' ').trim();
    const current = norm(slugDecoded);

    const found = SIDEBAR_GROUPS.find((group) =>
      group.links.some(
        (l) =>
          norm(l.slug) === current ||
          norm(l.name) === current ||
          (isOverseasOffices && norm(l.slug).includes('overseas')) ||
          (isIrWing && (norm(l.slug).includes('international') && norm(l.slug).includes('wing')))
      )
    );
    return found || SIDEBAR_GROUPS[3]; // Default to Training Institutes if iCED
  }, [slugDecoded, isOverseasOffices, isIrWing]);

  // Find active data for other pages if not Overseas Audit Offices or iCED or iCISA or NAAA or iCAL or IR Wing
  const fallbackPageData = OTHER_PAGES_DATA[slugDecoded];

  if (slugDecoded && !isOverseasOffices && !fallbackPageData && !isIced && !isIcisa && !isNaaa && !isIcal && !isIrWing) {
    notFound();
  }

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[64px] pt-1 pb-16 font-['Noto_Sans',sans-serif]"
      style={{ maxWidth: '1440px', opacity: 1 }}
    >
      {/* Two-Column Layout with exact 21px gap */}
      <div className="flex flex-col lg:flex-row gap-[21px] items-start">
        {/* Left Side Menu (width: 310px, height: 184px, padding: 24px, gap: 10px, border-radius: 8px, border-width: 1px) */}
        <aside
          className="w-full lg:w-[310px] shrink-0"
          aria-label="Global Relations Menu"
          style={{ width: '310px', opacity: 1, transform: 'rotate(0deg)' }}
        >
          <div
            className="bg-white border border-[#E6E6E6] rounded-[8px] p-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col gap-[10px]"
            style={{
              width: '310px',
              minHeight: '184px',
              borderRadius: '8px',
              borderWidth: '1px',
              padding: '24px',
              opacity: 1,
            }}
          >
            {/* Global Relations Title */}
            <h2 className="text-[20px] font-bold text-[#000000] leading-[100%] tracking-[0%] pb-[10px] border-b border-[#E6E6E6] text-left">
              {isHindi ? 'वैश्विक संबंध' : 'Global Relations'}
            </h2>

            {/* Menus / Group Category Container */}
            <div className="flex flex-col gap-[10px]">
              {/* Group Heading */}
              <div className="text-[15px] font-bold text-[#1A1A1A] leading-[120%] tracking-[0%] px-1 text-left">
                {isHindi ? currentSidebarGroup.hindiHeading : currentSidebarGroup.heading}
              </div>

              {/* Sub Menus List with continuous left border line */}
              <nav className="flex flex-col w-full pl-0 ml-1 border-l border-[#E5E5E5] gap-[2px]" aria-label="Current category links">
                {currentSidebarGroup.links.map((link) => {
                  const norm = (s: string) => (s || '').toLowerCase().replace(/[-_]/g, ' ').trim();
                  const current = norm(slugDecoded);
                  const isItemActive =
                    current === norm(link.slug) ||
                    current === norm(link.name) ||
                    (isOverseasOffices && norm(link.slug).includes('overseas')) ||
                    (isIced && norm(link.slug) === 'iced') ||
                    (isIcisa && norm(link.slug) === 'icisa') ||
                    (isNaaa && norm(link.slug) === 'naaa') ||
                    (isIcal && norm(link.slug) === 'ical') ||
                    (isIrWing && norm(link.slug).includes('international') && norm(link.slug).includes('wing'));

                  return (
                    <Link
                      key={link.slug}
                      href={`/About/Index-Menu-About/Global-relations/${encodeURIComponent(
                        link.name
                      )}`}
                      className={`block px-3.5 py-2 text-[14px] leading-[135%] tracking-[0%] transition-all text-left ${
                        isItemActive
                          ? 'bg-[#F6EDF0] text-[#751639] !text-[#751639] font-bold'
                          : 'text-[#2A2A2A] font-normal hover:text-[#751639] hover:bg-zinc-50'
                      }`}
                      style={
                        isItemActive
                          ? {
                              color: '#751639',
                              backgroundColor: '#F6EDF0',
                              fontWeight: 700,
                            }
                          : { color: '#2A2A2A' }
                      }
                    >
                      <span className="block">{isHindi ? link.hindiName : link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area (978px width) */}
        <main
          className="w-full lg:w-[978px] max-w-[978px] min-w-0"
          style={{ width: '100%', maxWidth: '978px', opacity: 1 }}
        >
          {/* Hero Banner (Width: 978px, Height: 141.33px, Margin bottom: 31px) */}
          {isOverseasOffices || isIced || isIcisa || isNaaa || isIcal || isIrWing ? (
            <div
              className="w-full max-w-[978px] relative overflow-hidden border border-[#D7D7D7] bg-white rounded-[2px] mb-[31px]"
              style={{
                width: '100%',
                maxWidth: '978px',
                height: '141.33px',
                opacity: 1,
                transform: 'rotate(0deg)',
              }}
            >
              {/* Hero Banner SVG with exact gradient, halftone arch and gold rim */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 929 142"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%' }}
              >
                <defs>
                  {/* Deep Rich Maroon Gradient */}
                  <linearGradient id="maroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5A0C22" />
                    <stop offset="45%" stopColor="#751639" />
                    <stop offset="100%" stopColor="#4A081A" />
                  </linearGradient>

                  {/* Dark Burgundy Rim Gradient */}
                  <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#460718" />
                    <stop offset="100%" stopColor="#2D030E" />
                  </linearGradient>

                  {/* Subtle Dot Grid */}
                  <pattern id="dotGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.75" fill="#FFFFFF" opacity="0.08" />
                  </pattern>
                </defs>

                {/* White Background Canvas */}
                <rect x="0" y="0" width="929" height="142" fill="#FFFFFF" />

                {/* 1. Dark Burgundy Outer Layer Shadow */}
                <path
                  d="M 0,0 L 760,0 C 800,28 812,74 766,142 L 0,142 Z"
                  fill="url(#rimGrad)"
                />

                {/* Gold / Tan Edge Accent Rim */}
                <path
                  d="M 760,0 C 800,28 812,74 766,142"
                  fill="none"
                  stroke="#D2A679"
                  strokeWidth="1.2"
                  opacity="0.85"
                />

                {/* 2. Main Rich Maroon Curved Body */}
                <path
                  d="M 0,0 L 752,0 C 792,28 804,74 758,142 L 0,142 Z"
                  fill="url(#maroonGrad)"
                />

                {/* Left Subtle Geometric Diamond Grid Lines */}
                <g stroke="#FFFFFF" strokeWidth="0.8" opacity="0.10">
                  <line x1="-50" y1="0" x2="250" y2="300" />
                  <line x1="0" y1="-50" x2="300" y2="250" />
                  <line x1="50" y1="-50" x2="350" y2="250" />
                  <line x1="-50" y1="142" x2="250" y2="-158" />
                  <line x1="0" y1="192" x2="300" y2="-108" />
                  <line x1="50" y1="192" x2="350" y2="-108" />
                </g>

                {/* Subtle Dot Grid */}
                <rect x="0" y="0" width="600" height="142" fill="url(#dotGrid)" />

                {/* 3. Halftone Matrix Flowing in an Arch */}
                <g fill="#FFFFFF">
                  <circle cx="661.4" cy="10" r="0.8" opacity="0.1" />
                  <circle cx="671.2" cy="19" r="0.8" opacity="0.1" />
                  <circle cx="680.2" cy="28" r="0.8" opacity="0.1" />
                  <circle cx="688" cy="37" r="0.8" opacity="0.1" />
                  <circle cx="694.2" cy="46" r="0.8" opacity="0.1" />
                  <circle cx="698.8" cy="55" r="0.8" opacity="0.1" />
                  <circle cx="701.4" cy="64" r="0.8" opacity="0.1" />
                  <circle cx="701.9" cy="73" r="0.8" opacity="0.1" />
                  <circle cx="700.5" cy="82" r="0.8" opacity="0.1" />
                  <circle cx="697" cy="91" r="0.8" opacity="0.1" />
                  <circle cx="691.7" cy="100" r="0.8" opacity="0.1" />
                  <circle cx="684.7" cy="109" r="0.8" opacity="0.1" />
                  <circle cx="676.3" cy="118" r="0.8" opacity="0.1" />
                  <circle cx="666.9" cy="127" r="0.8" opacity="0.1" />
                  <circle cx="673.4" cy="10" r="0.8" opacity="0.16" />
                  <circle cx="683.2" cy="19" r="0.8" opacity="0.16" />
                  <circle cx="692.2" cy="28" r="0.8" opacity="0.16" />
                  <circle cx="700" cy="37" r="0.8" opacity="0.16" />
                  <circle cx="706.2" cy="46" r="0.8" opacity="0.16" />
                  <circle cx="710.8" cy="55" r="0.8" opacity="0.16" />
                  <circle cx="713.4" cy="64" r="0.8" opacity="0.16" />
                  <circle cx="713.9" cy="73" r="0.8" opacity="0.16" />
                  <circle cx="712.5" cy="82" r="0.8" opacity="0.16" />
                  <circle cx="709" cy="91" r="0.8" opacity="0.16" />
                  <circle cx="703.7" cy="100" r="0.8" opacity="0.16" />
                  <circle cx="696.7" cy="109" r="0.8" opacity="0.16" />
                  <circle cx="688.3" cy="118" r="0.8" opacity="0.16" />
                  <circle cx="678.9" cy="127" r="0.8" opacity="0.16" />
                  <circle cx="685.4" cy="10" r="0.9" opacity="0.23" />
                  <circle cx="695.2" cy="19" r="0.9" opacity="0.23" />
                  <circle cx="704.2" cy="28" r="0.9" opacity="0.23" />
                  <circle cx="712" cy="37" r="0.9" opacity="0.23" />
                  <circle cx="718.2" cy="46" r="0.9" opacity="0.23" />
                  <circle cx="722.8" cy="55" r="0.9" opacity="0.23" />
                  <circle cx="725.4" cy="64" r="0.9" opacity="0.23" />
                  <circle cx="725.9" cy="73" r="0.9" opacity="0.23" />
                  <circle cx="724.5" cy="82" r="0.9" opacity="0.23" />
                  <circle cx="721" cy="91" r="0.9" opacity="0.23" />
                  <circle cx="715.7" cy="100" r="0.9" opacity="0.23" />
                  <circle cx="708.7" cy="109" r="0.9" opacity="0.23" />
                  <circle cx="700.3" cy="118" r="0.9" opacity="0.23" />
                  <circle cx="690.9" cy="127" r="0.9" opacity="0.23" />
                  <circle cx="697.4" cy="10" r="1" opacity="0.29" />
                  <circle cx="707.2" cy="19" r="1" opacity="0.29" />
                  <circle cx="716.2" cy="28" r="1" opacity="0.29" />
                  <circle cx="724" cy="37" r="1" opacity="0.29" />
                  <circle cx="730.2" cy="46" r="1" opacity="0.29" />
                  <circle cx="734.8" cy="55" r="1" opacity="0.29" />
                  <circle cx="737.4" cy="64" r="1" opacity="0.29" />
                  <circle cx="737.9" cy="73" r="1" opacity="0.29" />
                  <circle cx="736.5" cy="82" r="1" opacity="0.29" />
                  <circle cx="733" cy="91" r="1" opacity="0.29" />
                  <circle cx="727.7" cy="100" r="1" opacity="0.29" />
                  <circle cx="720.7" cy="109" r="1" opacity="0.29" />
                  <circle cx="712.3" cy="118" r="1" opacity="0.29" />
                  <circle cx="702.9" cy="127" r="1" opacity="0.29" />
                  <circle cx="709.4" cy="10" r="1.1" opacity="0.36" />
                  <circle cx="719.2" cy="19" r="1.1" opacity="0.36" />
                  <circle cx="728.2" cy="28" r="1.1" opacity="0.36" />
                  <circle cx="736" cy="37" r="1.1" opacity="0.36" />
                  <circle cx="742.2" cy="46" r="1.1" opacity="0.36" />
                  <circle cx="746.8" cy="55" r="1.1" opacity="0.36" />
                  <circle cx="749.4" cy="64" r="1.1" opacity="0.36" />
                  <circle cx="749.9" cy="73" r="1.1" opacity="0.36" />
                  <circle cx="748.5" cy="82" r="1.1" opacity="0.36" />
                  <circle cx="745" cy="91" r="1.1" opacity="0.36" />
                  <circle cx="739.7" cy="100" r="1.1" opacity="0.36" />
                  <circle cx="732.7" cy="109" r="1.1" opacity="0.36" />
                  <circle cx="724.3" cy="118" r="1.1" opacity="0.36" />
                  <circle cx="714.9" cy="127" r="1.1" opacity="0.36" />
                  <circle cx="721.4" cy="10" r="1.2" opacity="0.42" />
                  <circle cx="731.2" cy="19" r="1.2" opacity="0.42" />
                  <circle cx="740.2" cy="28" r="1.2" opacity="0.42" />
                  <circle cx="748" cy="37" r="1.2" opacity="0.42" />
                  <circle cx="754.2" cy="46" r="1.2" opacity="0.42" />
                  <circle cx="757" cy="91" r="1.2" opacity="0.42" />
                  <circle cx="751.7" cy="100" r="1.2" opacity="0.42" />
                  <circle cx="744.7" cy="109" r="1.2" opacity="0.42" />
                  <circle cx="736.3" cy="118" r="1.2" opacity="0.42" />
                  <circle cx="726.9" cy="127" r="1.2" opacity="0.42" />
                  <circle cx="733.4" cy="10" r="1.3" opacity="0.49" />
                  <circle cx="743.2" cy="19" r="1.3" opacity="0.49" />
                  <circle cx="752.2" cy="28" r="1.3" opacity="0.49" />
                  <circle cx="756.7" cy="109" r="1.3" opacity="0.49" />
                  <circle cx="748.3" cy="118" r="1.3" opacity="0.49" />
                  <circle cx="738.9" cy="127" r="1.3" opacity="0.49" />
                  <circle cx="745.4" cy="10" r="1.4" opacity="0.55" />
                  <circle cx="755.2" cy="19" r="1.4" opacity="0.55" />
                  <circle cx="750.9" cy="127" r="1.4" opacity="0.55" />
                </g>
              </svg>

              {/* Title Text (left: 37.48px, top: 32.83px, font-size: 24px, font-weight: 700, line-height: 38px, color: #FFFFFF) */}
              <div
                className="absolute z-10 select-none text-left"
                style={{
                  left: '37.48px',
                  top: isIced || isIcisa ? '32.83px' : '51.67px',
                }}
              >
                {isOverseasOffices ? (
                  <h1 className="text-[24px] font-bold text-white tracking-normal leading-[38px] font-['Noto_Sans',sans-serif]">
                    {isHindi ? 'विदेशी लेखा परीक्षा कार्यालय' : 'Overseas Audit Offices'}
                  </h1>
                ) : isIced ? (
                  <h1 className="text-[22px] sm:text-[24px] font-bold text-white tracking-normal leading-[38px] font-['Noto_Sans',sans-serif]">
                    {isHindi ? (
                      <>
                        पर्यावरण लेखा परीक्षा और
                        <br />
                        सतत विकास के लिए अंतर्राष्ट्रीय केंद्र (iCED)
                      </>
                    ) : (
                      <>
                        International Centre for Environment Audit and
                        <br />
                        Sustainable Development (iCED)
                      </>
                    )}
                  </h1>
                ) : isIcisa ? (
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-normal leading-[1.3] font-['Noto_Sans',sans-serif]">
                    {isHindi ? (
                      <>
                        सूचना प्रणाली और लेखा परीक्षा के लिए
                        <br />
                        अंतर्राष्ट्रीय केंद्र (iCISA)
                      </>
                    ) : (
                      <>
                        The International Centre for Information Systems and
                        <br />
                        Audit (iCISA)
                      </>
                    )}
                  </h1>
                ) : isNaaa ? (
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-normal leading-[1.3] font-['Noto_Sans',sans-serif]">
                    {isHindi ? (
                      <>
                        राष्ट्रीय लेखा परीक्षा और लेखा अकादमी (NAAA)
                      </>
                    ) : (
                      <>
                        National Academy of Audit and Accounts (NAAA)
                      </>
                    )}
                  </h1>
                ) : isIcal ? (
                  <h1 className="text-[20px] sm:text-[22px] font-bold text-white tracking-normal leading-[1.3] font-['Noto_Sans',sans-serif]">
                    {isHindi ? (
                      <>
                        स्थानीय शासन के लेखा परीक्षा के लिए
                        <br />
                        अंतर्राष्ट्रीय केंद्र (iCAL)
                      </>
                    ) : (
                      <>
                        International Centre for Audit of Local Governance
                        <br />
                        (iCAL)
                      </>
                    )}
                  </h1>
                ) : isIrWing ? (
                  <h1 className="text-[20px] sm:text-[24px] font-bold text-white tracking-normal leading-[38px] font-['Noto_Sans',sans-serif]">
                    {isHindi ? 'अंतर्राष्ट्रीय संबंध विंग' : 'International relation wing'}
                  </h1>
                ) : null}
              </div>

              {/* Right Emblem / Logo */}
              {!isIcal && !isIrWing && (
                <div
                  className="absolute z-10 flex items-center justify-center pointer-events-none"
                  style={{
                    width: isIced
                      ? '124.43px'
                      : isOverseasOffices
                      ? '155px'
                      : isNaaa
                      ? '75px'
                      : '107.67px',
                    height: isIced
                      ? '68.94px'
                      : isOverseasOffices
                      ? '111px'
                      : isNaaa
                      ? '90px'
                      : '100px',
                    left: isIced
                      ? '816.94px'
                      : isIcisa
                      ? '807.34px'
                      : isOverseasOffices
                      ? '816px'
                      : isNaaa
                      ? '827.14px'
                      : '788.14px',
                    top: isIced
                      ? '36.36px'
                      : isOverseasOffices
                      ? '15px'
                      : '20.83px',
                    opacity: 1,
                    transform: 'rotate(0deg)',
                  }}
                >
                  <div className="w-full h-full relative flex items-center justify-center">
                    <Image
                      src={
                        isIced
                          ? '/assets/iced-logo.png'
                          : isIcisa
                          ? '/assets/icisa-logo.png'
                          : isNaaa
                          ? '/assets/naaa-logo.png'
                          : '/assets/un-logo.png'
                      }
                      alt={
                        isIced
                          ? 'iCED Logo'
                          : isIcisa
                          ? 'iCISA Logo'
                          : isNaaa
                          ? 'NAAA Logo'
                          : 'UN Emblem Logo'
                      }
                      width={
                        isIced
                          ? 124.43
                          : isOverseasOffices
                          ? 155
                          : isNaaa
                          ? 75
                          : 107.67
                      }
                      height={
                        isIced
                          ? 68.94
                          : isOverseasOffices
                          ? 111
                          : isNaaa
                          ? 90
                          : 100
                      }
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Clean Heading for other subpages */
            <h2 className="text-[22px] md:text-[24px] font-bold text-[#751639] border-b border-[#e6e6e6] pb-4 mb-6 text-left">
              {isHindi ? fallbackPageData?.hindiTitle : fallbackPageData?.title}
            </h2>
          )}

          {/* Main Body Content */}
          {isOverseasOffices ? (
            /* Overseas Audit Offices Boxes (width: 100%, max-w-[978px] aligned flush with banner above) */
            <div className="w-full max-w-[978px] flex flex-col gap-[12px]">
              {OVERSEAS_OFFICES.map((office) => (
                <article
                  key={office.id}
                  className="w-full bg-[#FAFAFA] border-l-2 border-[#FAFAFA] hover:border-[#751639] hover:bg-[#F4F4F4] px-[20px] py-[12px] transition-all flex items-center justify-between gap-[12px] rounded-[0px] box-border"
                >
                  {/* Left Column: Office Title (Underlined 14px, font-weight 600, color #000000) & Optional PDF Subtitle (12px, #565656) */}
                  <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedOffice(office)}
                      className="text-left group/btn focus:outline-none block cursor-pointer bg-transparent border-none p-0"
                      title={
                        isHindi
                          ? `${office.hindiTitle} का विवरण देखें`
                          : `View details for ${office.title}`
                      }
                    >
                      <h2 className="text-[14px] font-semibold text-[#000000] underline leading-[19px] group-hover/btn:text-[#751639] transition-colors font-['Noto_Sans',sans-serif]">
                        {isHindi ? office.hindiTitle : office.title}
                      </h2>
                    </button>

                    {/* Subtitle for items with PDF: "PDF" in 12px #565656 */}
                    {office.hasPdf && (
                      <span className="text-[12px] font-normal text-[#565656] leading-[16px] block mt-0.5">
                        PDF
                      </span>
                    )}
                  </div>

                  {/* Right Column: PDF Badge (width: 87px, height: 40px, red icon 27x32, 34.7 MB, View PDF) */}
                  {office.hasPdf && (
                    <div className="flex items-center gap-[8px] shrink-0" style={{ width: '87px', height: '40px' }}>
                      {/* Red PDF Icon (width: 27px, height: 32px) */}
                      <button
                        type="button"
                        onClick={() =>
                          setActivePdfModal({
                            title: office.title,
                            hindiTitle: office.hindiTitle,
                            pdfSize: office.pdfSize || '34.7 MB',
                            pdfTitle: office.pdfTitle || office.title,
                            hindiPdfTitle: office.hindiPdfTitle || office.hindiTitle,
                            mandate: office.mandate,
                            hindiMandate: office.hindiMandate,
                            keyEntities: office.keyEntities,
                            hindiKeyEntities: office.hindiKeyEntities,
                          })
                        }
                        className="hover:scale-105 transition-transform focus:outline-none flex items-center justify-center shrink-0 bg-transparent border-none p-0 cursor-pointer"
                        aria-label={
                          isHindi
                            ? `${office.hindiTitle} पीडीएफ देखें`
                            : `View PDF for ${office.title}`
                        }
                      >
                        <Image
                          src="/assets/pdf-icon.png"
                          alt="PDF"
                          width={27}
                          height={32}
                          className="w-[27px] h-[32px] object-contain shrink-0"
                          unoptimized
                        />
                      </button>

                      {/* File Size (10px, #565656) & View PDF link (12px, #0D61AE, underline) */}
                      <div className="flex flex-col text-left justify-center gap-[1px]" style={{ width: '52px' }}>
                        <span className="text-[10px] text-[#565656] font-normal leading-[16px]">
                          {office.pdfSize || '34.7 MB'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setActivePdfModal({
                              title: office.title,
                              hindiTitle: office.hindiTitle,
                              pdfSize: office.pdfSize || '34.7 MB',
                              pdfTitle: office.pdfTitle || office.title,
                              hindiPdfTitle: office.hindiPdfTitle || office.hindiTitle,
                              mandate: office.mandate,
                              hindiMandate: office.hindiMandate,
                              keyEntities: office.keyEntities,
                              hindiKeyEntities: office.hindiKeyEntities,
                            })
                          }
                          className="text-[12px] text-[#0D61AE] hover:text-[#751639] font-normal underline leading-[16px] transition-colors cursor-pointer focus:outline-none bg-transparent border-none p-0 text-left"
                        >
                          {isHindi ? 'पीडीएफ देखें' : 'View PDF'}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : isIced ? (
            /* iCED Content (width: 978px, font-family: 'Noto Sans', font-size: 14px, line-height: 28px) */
            <div
              className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif] text-[14px] leading-[28px] tracking-normal"
              style={{ width: '100%', maxWidth: '978px', opacity: 1, transform: 'rotate(0deg)' }}
            >
              <p className="font-medium text-[#751639] mb-[24px]">
                {isHindi
                  ? 'पर्यावरण लेखा परीक्षा और सतत विकास के लिए एक उत्कृष्टता केंद्र।'
                  : 'A Centre of Excellence for Environment Audit and Sustainable Development.'}
              </p>
              <p className="font-normal text-[#2A2A2A] mb-[24px]">
                {isHindi
                  ? 'iCED पर्यावरण लेखा परीक्षा, सतत विकास, पेशेवर क्षमता और ज्ञान साझाकरण को मजबूत करने पर केंद्रित एक विशेष केंद्र है। यह पर्यावरण लेखा परीक्षा के क्षेत्र में प्रशिक्षण, अनुसंधान, सहयोग और ज्ञान के आदान-प्रदान के माध्यम से विशेषज्ञता के विकास का समर्थन करता है।'
                  : 'iCED is a specialised centre focused on strengthening environment auditing, sustainable development, professional capacity and knowledge sharing. It supports the development of expertise through training, research, collaboration and the exchange of knowledge in the field of environment audit.'}
              </p>
              <div className="mb-[24px] text-[#2A2A2A]">
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi ? 'iCED का अन्वेषण करें' : 'Explore iCED'}
                </div>
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi
                    ? 'केंद्र के कार्यक्रमों, पहलों, प्रशिक्षण, अनुसंधान, संसाधनों और विस्तृत जानकारी की खोज करें।'
                    : "Discover the centre's programmes, initiatives, training, research, resources and detailed information."}
                </div>
              </div>
              <p>
                <a
                  href="https://iced.cag.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors font-normal cursor-pointer"
                  style={{ color: '#0D61AE' }}
                >
                  {isHindi ? '[ iCED वेबसाइट पर जाएँ → ]' : '[ Visit the iCED Website → ]'}
                </a>
              </p>
            </div>
          ) : isIcisa ? (
            /* iCISA Content (width: 978px, font-family: 'Noto Sans', font-size: 14px, line-height: 28px) */
            <div
              className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif] text-[14px] leading-[28px] tracking-normal"
              style={{
                width: '100%',
                maxWidth: '978px',
                opacity: 1,
                transform: 'rotate(0deg)',
              }}
            >
              <p className="font-medium text-[#751639] mb-[24px]">
                {isHindi
                  ? 'सूचना प्रणाली लेखा परीक्षा और क्षमता निर्माण के लिए एक उत्कृष्टता केंद्र।'
                  : 'A Centre of Excellence for Information Systems Audit and Capacity Building.'}
              </p>
              <p className="font-normal text-[#2A2A2A] mb-[24px]">
                {isHindi
                  ? 'iCISA सूचना प्रणाली लेखा परीक्षा, उभरती प्रौद्योगिकियों, डेटा एनालिटिक्स और क्षमता निर्माण पर केंद्रित एक विशेष केंद्र है। यह नवोन्मेष, अनुसंधान, व्यावसायिक विकास और वैश्विक सहयोग का समर्थन करते हुए लेखा परीक्षकों और हितधारकों के लिए एक ज्ञान और प्रशिक्षण केंद्र के रूप में कार्य करता है।'
                  : 'iCISA is a specialised centre focused on Information Systems Audit, emerging technologies, data analytics and capacity building. It serves as a knowledge and training hub for auditors and stakeholders, supporting innovation, research, professional development and global collaboration.'}
              </p>
              <div className="mb-[24px] text-[#2A2A2A]">
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi ? 'iCISA का अन्वेषण करें' : 'Explore iCISA'}
                </div>
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi
                    ? 'iCISA के प्रशिक्षण कार्यक्रमों, अनुसंधान, लेखा परीक्षा संसाधनों, प्रकाशनों, पहलों और अन्य सूचनाओं की खोज करें।'
                    : "Discover iCISA's training programmes, research, audit resources, publications, initiatives and other information."}
                </div>
              </div>
              <p>
                <a
                  href="https://icisa.cag.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors font-normal cursor-pointer"
                  style={{ color: '#0D61AE' }}
                >
                  {isHindi ? '[ iCISA वेबसाइट पर जाएँ → ]' : '[ Visit the iCISA Website → ]'}
                </a>
              </p>
            </div>
          ) : isNaaa ? (
            /* NAAA Content (width: 978px, font-family: 'Noto Sans', font-size: 14px, line-height: 28px) */
            <div
              className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif] text-[14px] leading-[28px] tracking-normal"
              style={{
                width: '100%',
                maxWidth: '978px',
                opacity: 1,
                transform: 'rotate(0deg)',
              }}
            >
              <p className="font-medium text-[#751639] mb-[24px]">
                {isHindi
                  ? 'भारतीय लेखा परीक्षा और लेखा विभाग का सर्वोच्च प्रशिक्षण संस्थान'
                  : 'The Apex Training Institute of the Indian Audit & Accounts Department'}
              </p>
              <p className="font-normal text-[#2A2A2A] mb-[24px]">
                {isHindi
                  ? 'NAAA भारतीय लेखा परीक्षा और लेखा विभाग (IA&AD) का सर्वोच्च प्रशिक्षण संस्थान है, जो प्रेरण प्रशिक्षण, निरंतर व्यावसायिक शिक्षा, अनुसंधान और ज्ञान विकास के माध्यम से अत्यधिक पेशेवर और सक्षम अधिकारियों को विकसित करने पर केंद्रित है। यह IA&AD की क्षमताओं को मजबूत करने और भारत के नियंत्रक एवं महालेखा परीक्षक के मार्गदर्शन में इसके संवैधानिक जनादेश का समर्थन करने में महत्वपूर्ण भूमिका निभाता है।'
                  : 'NAAA is the apex training institute of the Indian Audit & Accounts Department (IA&AD), focused on developing highly professional and competent officers through induction training, continuing professional education, research and knowledge development. It plays a vital role in strengthening the capabilities of IA&AD and supporting its constitutional mandate under the guidance of the Comptroller & Auditor General of India.'}
              </p>
              <div className="mb-[24px] text-[#2A2A2A]">
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi ? 'NAAA का अन्वेषण करें' : 'Explore NAAA'}
                </div>
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi
                    ? 'NAAA के प्रशिक्षण कार्यक्रमों, व्यावसायिक विकास पहलों, अनुसंधान, संसाधनों और संस्थागत गतिविधियों की खोज करें।'
                    : "Discover NAAA's training programmes, professional development initiatives, research, resources and institutional activities."}
                </div>
              </div>
              <p>
                <a
                  href="https://naaa.cag.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors font-normal cursor-pointer"
                  style={{ color: '#0D61AE' }}
                >
                  {isHindi ? '[ NAAA वेबसाइट पर जाएँ → ]' : '[ Visit the NAAA Website → ]'}
                </a>
              </p>
            </div>
          ) : isIcal ? (
            /* iCAL Content (width: 978px, font-family: 'Noto Sans', font-size: 14px, line-height: 28px) */
            <div
              className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif] text-[14px] leading-[28px] tracking-normal"
              style={{
                width: '100%',
                maxWidth: '978px',
                opacity: 1,
                transform: 'rotate(0deg)',
              }}
            >
              <p className="font-medium text-[#751639] mb-[24px]">
                {isHindi
                  ? 'स्थानीय शासन लेखा परीक्षा और क्षमता निर्माण के लिए एक उत्कृष्टता केंद्र'
                  : 'A Centre of Excellence for Local Governance Audit and Capacity Building'}
              </p>
              <p className="font-normal text-[#2A2A2A] mb-[24px]">
                {isHindi
                  ? 'iCAL स्थानीय शासन लेखा परीक्षा, क्षमता निर्माण, ज्ञान साझाकरण और अंतर्राष्ट्रीय सहयोग को मजबूत करने पर केंद्रित एक विशेष केंद्र है। यह प्रशिक्षण, अनुसंधान और सर्वोत्तम प्रथाओं के आदान-प्रदान के माध्यम से जवाबदेही, वित्तीय प्रदर्शन और सेवा वितरण में सुधार के लिए लेखा परीक्षकों, नीति निर्माताओं और स्थानीय सरकारी संस्थानों के लिए एक मंच के रूप में कार्य करता है।'
                  : 'iCAL is a specialised centre focused on strengthening local governance audit, capacity building, knowledge sharing and international collaboration. It serves as a platform for auditors, policymakers and local government institutions to improve accountability, financial performance and service delivery through training, research and the exchange of best practices.'}
              </p>
              <div className="mb-[24px] text-[#2A2A2A]">
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi ? 'iCAL का अन्वेषण करें' : 'Explore iCAL'}
                </div>
                <div className="font-normal text-[#2A2A2A]">
                  {isHindi
                    ? 'स्थानीय शासन और लेखा परीक्षा पर iCAL के प्रशिक्षण कार्यक्रमों, अनुसंधान, प्रकाशनों, पहलों और संसाधनों की खोज करें।'
                    : 'Discover iCAL’s training programmes, research, publications, initiatives and resources on local governance and audit.'}
                </div>
              </div>
              <p>
                <a
                  href="https://ical.cag.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors font-normal cursor-pointer"
                  style={{ color: '#0D61AE' }}
                >
                  {isHindi ? '[ iCAL वेबसाइट पर जाएँ → ]' : '[ Visit the iCAL Website → ]'}
                </a>
              </p>
            </div>
          ) : isIrWing ? (
            /* International Relations Wing Content */
            <div className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif]">
              {/* Headings (width: 958px, height: 72px, top: 331px, left: 394px, angle: 0 deg, opacity: 1) */}
              <div
                className="w-full max-w-[958px] text-left flex flex-col justify-between mb-[24px]"
                style={{
                  width: '100%',
                  maxWidth: '958px',
                  height: '72px',
                  opacity: 1,
                  transform: 'rotate(0deg)',
                }}
              >
                <p className="text-[14px] md:text-[15px] font-bold text-[#751639] leading-[22px] m-0">
                  {isHindi
                    ? 'भारत के नियंत्रक एवं महालेखापरीक्षक भारत का सर्वोच्च लेखापरीक्षा संस्थान'
                    : 'Comptroller and Auditor General of India Supreme Audit Institution of India'}
                </p>
                <p className="text-[14px] font-medium text-[#751639] leading-[22px] m-0">
                  {isHindi ? 'अंतर्राष्ट्रीय संबंध प्रभाग' : 'International Relations Division'}
                </p>
              </div>

              <div className="flex flex-col gap-[16px]">
                {IR_OFFICERS.map((officer) => (
                  <div
                    key={officer.id}
                    className="w-full max-w-[929px] bg-white border border-[#E5E5E5] rounded-[2px] overflow-hidden flex flex-col sm:flex-row shadow-[0px_2px_8px_rgba(0,0,0,0.04)]"
                    style={{
                      width: '100%',
                      maxWidth: '929px',
                      minHeight: '183px',
                      height: '183px',
                      opacity: 1,
                      borderWidth: '1px',
                      transform: 'rotate(0deg)',
                    }}
                  >
                    <div className="w-full sm:w-[155px] md:w-[160px] h-full shrink-0 relative bg-[#F5F5F5]">
                      <Image
                        src={officer.image}
                        alt={isHindi ? officer.hindiName : officer.name}
                        fill
                        className="object-cover object-top"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 px-[20px] md:px-[24px] pt-[18px] pb-[13px] flex flex-col justify-between text-left">
                      <div>
                        <h3 className="text-[16px] md:text-[17px] font-bold text-[#1A1A1A] leading-[24px] mb-[4px]">
                          {isHindi ? officer.hindiName : officer.name}
                        </h3>
                        <p className="text-[13px] md:text-[14px] text-[#4A4A4A] leading-[20px] m-0 whitespace-pre-line">
                          {isHindi ? officer.hindiDesignation : officer.designation}
                        </p>
                      </div>
                      
                      {/* Email Info Line (width: 240px, height: 24px, angle: 0 deg, opacity: 1) */}
                      <div
                        className="flex items-center text-[13px] md:text-[14px] font-medium text-[#751639] leading-[24px] mt-auto"
                        style={{
                          minWidth: '240px',
                          height: '24px',
                          opacity: 1,
                          transform: 'rotate(0deg)',
                        }}
                      >
                        <span className="font-semibold">{isHindi ? 'ईमेल: ' : 'Email: '}</span>
                        <a
                          href={`mailto:${officer.email}`}
                          className="text-[#751639] hover:underline focus:outline-none ml-1"
                        >
                          {officer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isBilateral ? (
            /* Bilateral Relations */
            <div className="space-y-6 text-left">
              <div className="border-b border-[#e5e5e5] pb-4">
                <p className="text-[14.5px] text-zinc-700 leading-relaxed">
                  {isHindi
                    ? 'SAI भारत ने लेखा परीक्षा पद्धतियों, संयुक्त प्रशिक्षण, सहकर्मी समीक्षा और डिजिटल शासन के आदान-प्रदान को मजबूत करने के लिए दुनिया भर के 30 से अधिक सर्वोच्च लेखा परीक्षा संस्थानों के साथ द्विपक्षीय समझौता ज्ञापनों पर हस्ताक्षर किए हैं।'
                    : 'SAI India actively collaborates with partner Supreme Audit Institutions across the world to share audit expertise, conduct joint capacity-building seminars, and pioneer digital audit frameworks.'}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {[
                  'SAI Oman', 'SAI UAE', 'SAI Russia', 'SAI Vietnam',
                  'SAI Egypt', 'SAI Maldives', 'SAI Bangladesh', 'SAI Indonesia',
                  'SAI South Africa', 'SAI Brazil', 'SAI Malaysia', 'SAI Saudi Arabia'
                ].map((partner, idx) => (
                  <div key={idx} className="p-3 bg-[#fafafa] border border-[#e5e5e5] rounded text-center text-xs font-semibold text-[#751639] shadow-xs">
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          ) : slugDecoded === 'association with intosai' ? (
            /* Association with INTOSAI Content (Matching screenshot 2) */
            <div
              className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif] text-[14px] leading-[28px] tracking-normal"
              style={{ width: '100%', maxWidth: '978px', opacity: 1, transform: 'rotate(0deg)' }}
            >
              <p className="font-medium text-[#751639] mb-[24px]">
                {isHindi
                  ? 'भारत के नियंत्रक एवं महालेखापरीक्षक सर्वोच्च लेखा परीक्षा संस्थानों के अंतर्राष्ट्रीय संगठन (INTOSAI) के शासी बोर्ड के सदस्य हैं।'
                  : 'The Comptroller and Auditor General of India is a member of the Governing Board of the International Organization of Supreme Audit Institutions (INTOSAI).'}
              </p>
              <p className="font-normal text-[#2A2A2A] mb-[24px]">
                {isHindi
                  ? 'सर्वोच्च लेखा परीक्षा संस्थानों का अंतर्राष्ट्रीय संगठन (INTOSAI) बाहरी सरकारी लेखा परीक्षा समुदाय के लिए एक छत्र संगठन के रूप में कार्य करता है। INTOSAI एक स्वायत्त, स्वतंत्र और गैर-राजनीतिक संगठन है। यह संयुक्त राष्ट्र की आर्थिक और सामाजिक परिषद (ECOSOC) के साथ विशेष परामर्शी दर्जा प्राप्त एक गैर-सरकारी संगठन है। INTOSAI गवर्निंग बोर्ड सर्वोच्च लेखा परीक्षा संस्थानों के अंतर्राष्ट्रीय सम्मेलनों (INCOSAI) के बीच रणनीतिक नेतृत्व, प्रबंधन और निरंतरता प्रदान करने के लिए प्रतिवर्ष मिलता है। INTOSAI कांग्रेस (INCOSAI) INTOSAI का सर्वोच्च अंग है और यह सभी सदस्यों से बना है। त्रिवार्षिक आधार पर, यह नियमित बैठकें आयोजित करता है, जिसकी अध्यक्षता मेजबान SAI द्वारा की जाती है। प्रतिभागियों में सदस्य SAI के प्रतिनिधिमंडलों के साथ-साथ संयुक्त राष्ट्र, विश्व बैंक और अन्य अंतर्राष्ट्रीय और व्यावसायिक संगठनों के प्रतिनिधि शामिल होते हैं। INTOSAI के पास चार मुख्य समितियां हैं जो इसके चार रणनीतिक लक्ष्यों की प्राप्ति के लिए साधन हैं। ये समितियां हैं:'
                  : 'The International Organization of Supreme Audit Institutions (INTOSAI) operates as an umbrella organization for the external government audit community. INTOSAI is an autonomous, independent and non-political organization. It is a non-governmental organization with special consultative status with the Economic and Social Council (ECOSOC) of the United Nations. The INTOSAI Governing Board meets annually to provide strategic leadership, stewardship, and continuity of INTOSAI activities between International Congresses of Supreme Audit Institutions (INCOSAI). The INTOSAI Congress (INCOSAI) is the supreme organ of INTOSAI and is composed of all the members. On a triennial basis, it holds regular meetings, which is chaired by the hosting SAI. Participants include delegations of member SAIs as well as representatives of the United Nations, the World Bank and other international and professional organizations. INTOSAI has four main Committees which are the vehicles for the achievement of its four strategic goals. These Committees are:'}
              </p>
              <ul className="space-y-[8px] mb-[24px] text-[#2A2A2A] list-none pl-0">
                <li>
                  • Professional Standards Committee (PSC) (Goal 1) (
                  <a
                    href="https://www.psc-intosai.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D61AE] hover:text-[#751639] underline cursor-pointer"
                  >
                    https://www.psc-intosai.org/
                  </a>
                  )
                </li>
                <li>
                  • Capacity Building Committee (CBC) (Goal 2) (
                  <a
                    href="https://www.intosaicbc.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D61AE] hover:text-[#751639] underline cursor-pointer"
                  >
                    https://www.intosaicbc.org/
                  </a>
                  )
                </li>
                <li>
                  • Knowledge Sharing and Knowledge Services Committee (KSC) (Goal 3) (
                  <a
                    href="https://www.intosaicommunity.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D61AE] hover:text-[#751639] underline cursor-pointer"
                  >
                    https://www.intosaicommunity.net
                  </a>
                  )
                </li>
                <li>
                  • Policy, Finance and Administrative Committee (PFAC) (Goal 4) (
                  <a
                    href="http://www.intosaipfac.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D61AE] hover:text-[#751639] underline cursor-pointer"
                  >
                    http://www.intosaipfac.org/
                  </a>
                  )
                </li>
              </ul>
              <p className="font-normal text-[#2A2A2A]">
                {isHindi
                  ? 'SAI भारत विभिन्न INTOSAI निकायों में नेतृत्व और प्रतिनिधित्व के पदों के माध्यम से INTOSAI की मानक निर्धारण, क्षमता निर्माण और ज्ञान साझाकरण गतिविधियों में एक सक्रिय भागीदार है।'
                  : 'SAI India is an active member in the standard setting, capacity building and knowledge sharing activities of INTOSAI through positions of leadership and representation in various INTOSAI bodies.'}
              </p>
            </div>
          ) : (
            /* Clean Page Content for other pages */
            <div
              className="w-full max-w-[978px] text-left font-['Noto_Sans',sans-serif] text-[14px] leading-[28px] tracking-normal"
              style={{ width: '100%', maxWidth: '978px', opacity: 1, transform: 'rotate(0deg)' }}
            >
              <p className="font-medium text-[#751639] mb-4">
                {isHindi
                  ? fallbackPageData?.hindiTitle
                  : fallbackPageData?.title}
              </p>
              <p className="font-normal text-[#2A2A2A] leading-relaxed">
                {isHindi
                  ? fallbackPageData?.hindiDescription
                  : fallbackPageData?.description}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Office Detail Modal */}
      {selectedOffice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#751639] to-[#5A0E2A] px-6 py-5 rounded-t-xl text-white flex items-start justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-white/20 text-white text-[11px] font-semibold uppercase rounded mb-1.5 tracking-wider">
                  {isHindi
                    ? selectedOffice.hindiDesignation
                    : selectedOffice.designation}
                </span>
                <h3 className="text-xl font-bold leading-tight text-white text-left">
                  {isHindi ? selectedOffice.hindiTitle : selectedOffice.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOffice(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none cursor-pointer border-none"
                aria-label={isHindi ? 'बंद करें' : 'Close modal'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-left text-zinc-700">
              {/* Location & Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
                  <span className="text-[11px] font-bold text-[#751639] uppercase tracking-wider block mb-1">
                    {isHindi ? 'स्थान / पता' : 'Location / Address'}
                  </span>
                  <p className="text-[13px] text-zinc-800 leading-snug">
                    {isHindi ? selectedOffice.hindiLocation : selectedOffice.location}
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
                  <span className="text-[11px] font-bold text-[#751639] uppercase tracking-wider block mb-1">
                    {isHindi ? 'लेखा परीक्षा क्षेत्राधिकार' : 'Audit Jurisdiction'}
                  </span>
                  <p className="text-[13px] text-zinc-800 leading-snug">
                    {isHindi
                      ? selectedOffice.hindiJurisdiction
                      : selectedOffice.jurisdiction}
                  </p>
                </div>
              </div>

              {/* Mandate */}
              <div>
                <h4 className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#751639]"></span>
                  {isHindi ? 'संवैधानिक अधिदेश और दायरा' : 'Mandate & Audit Scope'}
                </h4>
                <p className="text-[13.5px] text-zinc-600 leading-relaxed bg-[#FFF8FA] p-3.5 rounded-lg border border-[#F2D7E0]">
                  {isHindi ? selectedOffice.hindiMandate : selectedOffice.mandate}
                </p>
              </div>

              {/* Key Audited Entities */}
              <div>
                <h4 className="text-[14px] font-bold text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#751639]"></span>
                  {isHindi ? 'प्रमुख लेखा परीक्षित निकाय' : 'Key Audited Entities & Missions'}
                </h4>
                <ul className="grid grid-cols-1 gap-1.5 pl-2">
                  {(isHindi
                    ? selectedOffice.hindiKeyEntities
                    : selectedOffice.keyEntities
                  ).map((entity, idx) => (
                    <li
                      key={idx}
                      className="text-[13px] text-zinc-700 flex items-start gap-2"
                    >
                      <span className="text-[#751639] font-bold">•</span>
                      <span>{entity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${selectedOffice.title}\n${selectedOffice.location}\nJurisdiction: ${selectedOffice.jurisdiction}`
                    )
                  }
                  className="px-4 py-2 text-[13px] border border-zinc-300 rounded-md text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {isCopied
                    ? isHindi
                      ? 'कॉपी किया गया!'
                      : 'Copied Details!'
                    : isHindi
                    ? 'विवरण कॉपी करें'
                    : 'Copy Office Details'}
                </button>

                <div className="flex items-center gap-2">
                  {officeHasPdf(selectedOffice) && (
                    <button
                      type="button"
                      onClick={() => {
                        const off = selectedOffice;
                        setSelectedOffice(null);
                        setActivePdfModal({
                          title: off.title,
                          hindiTitle: off.hindiTitle,
                          pdfSize: off.pdfSize || '34.7 MB',
                          pdfTitle: off.pdfTitle || off.title,
                          hindiPdfTitle: off.hindiPdfTitle || off.hindiTitle,
                          mandate: off.mandate,
                          hindiMandate: off.hindiMandate,
                          keyEntities: off.keyEntities,
                          hindiKeyEntities: off.hindiKeyEntities,
                        });
                      }}
                      className="px-4 py-2 bg-[#751639] hover:bg-[#5E122E] text-white text-[13px] font-medium rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer border-none"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
                      </svg>
                      {isHindi ? 'पीडीएफ खोलें' : 'Open PDF Report'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedOffice(null)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[13px] font-medium rounded-md transition-colors cursor-pointer border-none"
                  >
                    {isHindi ? 'बंद करें' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive PDF Viewer Modal */}
      {activePdfModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col border border-zinc-200 overflow-hidden">
            {/* Top Toolbar */}
            <div className="bg-[#2B2D42] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <Image
                    src="/assets/pdf-icon.png"
                    alt="PDF"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-[14px] font-bold truncate text-white">
                    {isHindi
                      ? activePdfModal.hindiPdfTitle || activePdfModal.hindiTitle
                      : activePdfModal.pdfTitle || activePdfModal.title}
                  </h3>
                  <p className="text-[11px] text-zinc-300">
                    {activePdfModal.pdfSize || '34.7 MB'} •{' '}
                    {isHindi
                      ? 'भारत के नियंत्रक एवं महालेखापरीक्षक'
                      : 'Comptroller and Auditor General of India'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(isHindi ? 'पीडीएफ डाउनलोड शुरू हो रहा है...' : 'Downloading document...')}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded text-white text-[12px] font-medium transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer border-none"
                  title={isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span className="hidden sm:inline">{isHindi ? 'डाउनलोड' : 'Download'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded text-white text-[12px] font-medium transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer border-none"
                  title={isHindi ? 'प्रिंट करें' : 'Print PDF'}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  <span className="hidden sm:inline">{isHindi ? 'प्रिंट' : 'Print'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePdfModal(null)}
                  className="p-1.5 bg-white/15 hover:bg-[#E53935] rounded-full text-white transition-colors focus:outline-none ml-2 cursor-pointer border-none flex items-center justify-center"
                  aria-label={isHindi ? 'बंद करें' : 'Close viewer'}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Document Canvas Preview */}
            <div className="flex-1 bg-zinc-800 p-4 sm:p-8 overflow-y-auto flex flex-col items-center">
              <div className="bg-white shadow-2xl rounded-sm max-w-2xl w-full p-8 sm:p-12 text-zinc-800 text-left min-h-[600px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b-2 border-[#751639] pb-4 mb-6">
                    <div>
                      <h4 className="text-[11px] font-bold tracking-widest text-[#751639] uppercase">
                        {isHindi
                          ? 'भारत का सर्वोच्च लेखापरीक्षा संस्थान'
                          : 'Supreme Audit Institution of India'}
                      </h4>
                      <h2 className="text-[18px] font-bold text-zinc-900 mt-1">
                        {isHindi
                          ? activePdfModal.hindiTitle
                          : activePdfModal.title}
                      </h2>
                    </div>
                    <div className="w-12 h-12 relative shrink-0">
                      <Image
                        src="/assets/un-logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>

                  <div className="space-y-4 text-[13.5px] leading-relaxed text-zinc-700">
                    <p className="font-semibold text-zinc-900">
                      {isHindi
                        ? 'अधिदेश एवं आधिकारिक प्रकाशन विवरण'
                        : 'Executive Publication & Research Overview'}
                    </p>
                    <p>
                      {isHindi ? activePdfModal.hindiMandate : activePdfModal.mandate}
                    </p>

                    {activePdfModal.keyEntities && activePdfModal.keyEntities.length > 0 && (
                      <div className="bg-zinc-50 border border-zinc-200 rounded p-4 my-4">
                        <h5 className="font-bold text-[12.5px] text-[#751639] uppercase mb-2">
                          {isHindi ? 'लेखा परीक्षित प्रमुख संस्थाएं' : 'Governing Entities Audited:'}
                        </h5>
                        <ul className="list-disc pl-5 space-y-1 text-[13px]">
                          {(isHindi
                            ? activePdfModal.hindiKeyEntities || activePdfModal.keyEntities
                            : activePdfModal.keyEntities
                          ).map((ent, idx) => (
                            <li key={idx}>{ent}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-zinc-600 text-[12.5px]">
                      {isHindi
                        ? 'यह दस्तावेज़ भारत के नियंत्रक और महालेखापरीक्षक के अंतर्राष्ट्रीय संबंध प्रभाग द्वारा अधिकृत वैधानिक बाह्य लेखा परीक्षा रिपोर्ट/दिशानिर्देश का प्रतिनिधित्व करता है।'
                        : 'This official publication represents the statutory external audit charter and research document published under the authority of the Comptroller and Auditor General of India.'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-zinc-200 pt-4 mt-8 flex justify-between text-[11px] text-zinc-400">
                  <span>CAG India — Global Relations</span>
                  <span>Document Reference: OA-2026/V2</span>
                  <span>Page 1 of 24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function officeHasPdf(office: OfficeItem | null): boolean {
  return Boolean(office && office.hasPdf);
}
