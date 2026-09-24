import { SubsiteOrgStructItem, RecruitmentRuleItem, OverseasOfficeData } from '@/types';

export const OVERSEAS_PORTALS_DATA: Record<string, OverseasOfficeData> = {
  'overseas-london': {
    slug: 'overseas-london',
    theme: 'LDN',
    officeNameEn: 'Principal Director of Audit, London',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा, लंदन',
    locationEn: 'London, United Kingdom',
    locationHi: 'लंदन, यूनाइटेड किंगडम',
    addressEn: 'High Commission of India, India House, Aldwych, London WC2B 4NA, UK',
    addressHi: 'भारत का उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA, यूनाइटेड किंगडम',
    officeHoursEn: '09:00 AM - 05:30 PM (Monday - Friday)',
    officeHoursHi: 'प्रातः 09:00 - सायं 05:30 (सोमवार - शुक्रवार)',
    phone: '(00-44) 20 7836 4333',
    email: 'pda.london@mea.gov.in',
    obfuscatedEmail: 'pdalondon[at]cag[dot]gov[dot]in',
    gmapEmbedUrl: 'https://maps.google.com/maps?width=700&height=400&hl=en&q=india%20house%20Aldwych%2C%20London%20WC2B4NA%20london&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    gmapQuery: 'India House Aldwych London WC2B4NA',
    externalOfficialUrl: 'https://cag.gov.in/pda-london/en',
    themeColor: '#1D2E6B',
    mandateEn: 'Auditing Indian Foreign Missions, Embassies, High Commissions, Consulates, and Defense Attaché establishments across the United Kingdom, Western and Northern Europe under Section 13 & 14 of the CAG\'s (DPC) Act, 1971.',
    mandateHi: 'सीएजी (डीपीसी) अधिनियम, 1971 की धारा 13 एवं 14 के तहत यूनाइटेड किंगडम, पश्चिमी एवं उत्तरी यूरोप में भारतीय विदेशी मिशनों, दूतावासों, उच्चायोगों, वाणिज्य दूतावासों और रक्षा अताशे प्रतिष्ठानों की लेखापरीक्षा।',
    auditScopes: [
      {
        titleEn: 'Foreign Mission Expenditure Audit',
        titleHi: 'विदेशी मिशन व्यय लेखापरीक्षा',
        descEn: 'Comprehensive compliance and proprietary audit of establishment expenditures, consular revenues, developmental cooperation funds, and commercial wing operations across Europe.',
        descHi: 'यूरोप भर में स्थापना व्यय, कांसुलर राजस्व, विकासात्मक सहयोग निधियों और वाणिज्यिक विंग संचालन की व्यापक अनुपालन और औचित्य लेखापरीक्षा।'
      },
      {
        titleEn: 'Defense Attaché & Diplomatic Accounts Audit',
        titleHi: 'रक्षा अताशे एवं राजनयिक लेखा परीक्षा',
        descEn: 'Audit of defense advisor offices, military equipment procurement liaison cells, security grants, and diplomatic mission operational accounts.',
        descHi: 'रक्षा सलाहकार कार्यालयों, सैन्य उपकरण खरीद संपर्क प्रकोष्ठों, सुरक्षा अनुदानों और राजनयिक मिशन परिचालन खातों की लेखापरीक्षा।'
      },
      {
        titleEn: 'Public Sector Undertakings (PSU) Overseas Branches',
        titleHi: 'सार्वजनिक क्षेत्र के उपक्रमों (पीएसयू) की विदेशी शाखाएं',
        descEn: 'Inspection and financial compliance review of overseas branches of Indian Public Sector Banks, insurance companies, and state-owned commercial corporations.',
        descHi: 'भारतीय सार्वजनिक क्षेत्र के बैंकों, बीमा कंपनियों और राज्य के स्वामित्व वाले वाणिज्यिक निगमों की विदेशी शाखाओं की वित्तीय अनुपालन समीक्षा।'
      }
    ],
    faqs: [
      {
        qEn: 'What is the operational jurisdiction of the India Audit Office in London?',
        qHi: 'लंदन स्थित भारत लेखा परीक्षा कार्यालय का परिचालन क्षेत्राधिकार क्या है?',
        aEn: 'The London office holds statutory audit jurisdiction over the High Commission of India in London and Indian diplomatic missions/embassies across Western, Northern, and Southern Europe.',
        aHi: 'लंदन कार्यालय लंदन में भारत के उच्चायोग और पश्चिमी, उत्तरी तथा दक्षिणी यूरोप में भारतीय राजनयिक मिशनों/दूतावासों पर वैधानिक लेखापरीक्षा क्षेत्राधिकार रखता है।'
      },
      {
        qEn: 'How are foreign mission audit reports processed and submitted?',
        qHi: 'विदेशी मिशन लेखापरीक्षा रिपोर्ट कैसे संसाधित और प्रस्तुत की जाती हैं?',
        aEn: 'Inspection Reports (IRs) are compiled upon completion of overseas audit cycles and submitted directly to the Comptroller & Auditor General of India and the Ministry of External Affairs (MEA).',
        aHi: 'विदेशी लेखापरीक्षा चक्र पूरा होने पर निरीक्षण रिपोर्ट (आईआर) संकलित की जाती हैं और सीधे भारत के नियंत्रक एवं महालेखापरीक्षक तथा विदेश मंत्रालय (एमईए) को सौंपी जाती हैं।'
      }
    ],
    historyEn: 'The Office of the Director General of Audit, London was established in 1955 to ensure comprehensive statutory audit of the High Commission of India, Indian diplomatic missions, embassies, and defense liaison establishments across the United Kingdom and Europe.',
    historyHi: 'लेखापरीक्षा महानिदेशक, लंदन के कार्यालय की स्थापना 1955 में यूनाइटेड किंगडम और यूरोप में भारत के उच्चायोग, भारतीय राजनयिक मिशनों, दूतावासों और रक्षा संपर्क प्रतिष्ठानों की व्यापक वैधानिक लेखापरीक्षा सुनिश्चित करने के लिए की गई थी।',
    pdsList: [
      { nameEn: 'Shri S. Sunil Raj, IA&AS', nameHi: 'श्री एस. सुनील राज, आईएएंडएएस', tenure: '2024 - Present', roleEn: 'Director General', roleHi: 'महानिदेशक लेखा परीक्षा' },
      { nameEn: 'Ms. Vinita Mishra, IA&AS', nameHi: 'सुश्री विनीता मिश्रा, आईएएंडएएस', tenure: '2021 - 2024', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Saurabh Narain, IA&AS', nameHi: 'श्री सौरभ नारायण, आईएएंडएएस', tenure: '2019 - 2021', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Deepak Narain, IA&AS', nameHi: 'श्री दीपक नारायण, आईएएंडएएस', tenure: '2017 - 2019', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Pravindra Yadav, IA&AS', nameHi: 'श्री प्रवींद्र यादव, आईएएंडएएस', tenure: '2015 - 2017', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Ms. Amandeep Chatha, IA&AS', nameHi: 'सुश्री अमनदीप चट्ठा, आईएएंडएएस', tenure: '2013 - 2015', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Rajesh Singh, IA&AS', nameHi: 'श्री राजेश सिंह, आईएएंडएएस', tenure: '2011 - 2013', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Deepak Anurag, IA&AS', nameHi: 'श्री दीपक अनुराग, आईएएंडएएस', tenure: '2009 - 2011', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Jayant Sinha, IA&AS', nameHi: 'श्री जयंत सिन्हा, आईएएंडएएस', tenure: '2007 - 2009', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Ms. K. Ganga, IA&AS', nameHi: 'सुश्री के. गंगा, आईएएंडएएस', tenure: '2005 - 2007', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Ms. Revathy Iyer, IA&AS', nameHi: 'सुश्री रेवती अय्यर, आईएएंडएएस', tenure: '2003 - 2005', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. A.K. Thakur, IA&AS', nameHi: 'श्री ए.के. ठाकुर, आईएएंडएएस', tenure: '2000 - 2003', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. S.K.F. Kujur, IA&AS', nameHi: 'श्री एस.के.एफ. कुजूर, आईएएंडएएस', tenure: '1998 - 2000', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. A.K. Banerjee, IA&AS', nameHi: 'श्री ए.के. बनर्जी, आईएएंडएएस', tenure: '1996 - 1998', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Bharti Prasad, IA&AS', nameHi: 'श्री भारती प्रसाद, आईएएंडएएस', tenure: '1994 - 1996', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. B.M. Oza, IA&AS', nameHi: 'श्री बी.एम. ओझा, आईएएंडएएस', tenure: '1992 - 1994', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Mr. Ravi Saxena, IA&AS', nameHi: 'श्री रवि सक्सेना, आईएएंडएएस', tenure: '1989 - 1992', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' }
    ],
    directorsList: [
      { nameEn: 'Mr. Deepak Raghu, IA&AS', nameHi: 'श्रीमान दीपक रघु, आईएएंडएएस', tenure: '2025 - Present', roleEn: 'Director of Audit', roleHi: 'निदेशक लेखा परीक्षा' },
      { nameEn: 'Shri Vishal Desai, IA&AS', nameHi: 'श्रीमान विशाल देसाई, आईएएंडएएस', tenure: '2024 - 2024', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Anubhav Kumar Singh, IA&AS', nameHi: 'श्री अनुभव कुमार सिंह, आईएएंडएएस', tenure: '2022 - 2024', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Sameer Mehta, IA&AS', nameHi: 'श्री समीर मेहता, आईएएंडएएस', tenure: '2020 - 2022', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Ms. Smriti, IA&AS', nameHi: 'सुश्री स्मृति, आईएएंडएएस', tenure: '2018 - 2020', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Vishwanath Singh Jadon, IA&AS', nameHi: 'श्री विश्वनाथ सिंह जादोन, आईएएंडएएस', tenure: '2016 - 2018', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Kulwant Singh, IA&AS', nameHi: 'श्री कुलवंत सिंह, आईएएंडएएस', tenure: '2014 - 2016', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Amitabh Prasad, IA&AS', nameHi: 'श्री अमिताभ प्रसाद, आईएएंडएएस', tenure: '2012 - 2014', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. R. Naresh, IA&AS', nameHi: 'श्री आर. नरेश, आईएएंडएएस', tenure: '2010 - 2012', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Ms. Gurveen Sidhu Chophy, IA&AS', nameHi: 'सुश्री गुरवीन सिद्धू चोफी, आईएएंडएएस', tenure: '2009 - 2010', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. R. Ambalavanan, IA&AS', nameHi: 'श्री आर. अंबालावनन, आईएएंडएएस', tenure: '2007 - 2009', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Manoj Sahay, IA&AS', nameHi: 'श्री मनोज सहाय, आईएएंडएएस', tenure: '2005 - 2007', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. S. Ramann, IA&AS', nameHi: 'श्री एस. रमन, आईएएंडएएस', tenure: '2003 - 2005', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. P.R. Acharya, IA&AS', nameHi: 'श्री पी.आर. आचार्य, आईएएंडएएस', tenure: '2001 - 2003', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Raj Vishwanathan, IA&AS', nameHi: 'श्री राज विश्वनाथन, आईएएंडएएस', tenure: '1999 - 2001', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Naveen Kumar, IA&AS', nameHi: 'श्री नवीन कुमार, आईएएंडएएस', tenure: '1997 - 1999', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. Roy Mathrani, IA&AS', nameHi: 'श्री रॉय मथरानी, आईएएंडएएस', tenure: '1995 - 1997', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Mr. P. Seshkumar, IA&AS', nameHi: 'श्री पी. शेषकुमार, आईएएंडएएस', tenure: '1993 - 1995', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' }
    ],
    unitsList: [
      // 29 Embassies
      { nameEn: 'Embassy of India, Athens', nameHi: 'भारत का दूतावास, एथेंस', category: 'Embassy', city: 'Athens', country: 'Greece' },
      { nameEn: 'Embassy of India, Belgrade', nameHi: 'भारत का दूतावास, बेलग्रेड', category: 'Embassy', city: 'Belgrade', country: 'Serbia' },
      { nameEn: 'Embassy of India, Berlin', nameHi: 'भारत का दूतावास, बर्लिन', category: 'Embassy', city: 'Berlin', country: 'Germany' },
      { nameEn: 'Embassy of India, Berne', nameHi: 'भारत का दूतावास, बर्न', category: 'Embassy', city: 'Berne', country: 'Switzerland' },
      { nameEn: 'Embassy of India, Bratislava', nameHi: 'भारत का दूतावास, ब्रातिस्लावा', category: 'Embassy', city: 'Bratislava', country: 'Slovakia' },
      { nameEn: 'Embassy of India, Brussels', nameHi: 'भारत का दूतावास, ब्रुसेल्स', category: 'Embassy', city: 'Brussels', country: 'Belgium' },
      { nameEn: 'Embassy of India, Bucharest', nameHi: 'भारत का दूतावास, बुखारेस्ट', category: 'Embassy', city: 'Bucharest', country: 'Romania' },
      { nameEn: 'Embassy of India, Budapest', nameHi: 'भारत का दूतावास, बुडापेस्ट', category: 'Embassy', city: 'Budapest', country: 'Hungary' },
      { nameEn: 'Embassy of India, Copenhagen', nameHi: 'भारत का दूतावास, कोपेनहेगन', category: 'Embassy', city: 'Copenhagen', country: 'Denmark' },
      { nameEn: 'Embassy of India, Dublin', nameHi: 'भारत का दूतावास, डबलिन', category: 'Embassy', city: 'Dublin', country: 'Ireland' },
      { nameEn: 'Embassy of India, Helsinki', nameHi: 'भारत का दूतावास, हेलसिंकी', category: 'Embassy', city: 'Helsinki', country: 'Finland' },
      { nameEn: 'Embassy of India, Kyiv', nameHi: 'भारत का दूतावास, कीव', category: 'Embassy', city: 'Kyiv', country: 'Ukraine' },
      { nameEn: 'Embassy of India, Lisbon', nameHi: 'भारत का दूतावास, लिस्बन', category: 'Embassy', city: 'Lisbon', country: 'Portugal' },
      { nameEn: 'Embassy of India, Ljubljana', nameHi: 'भारत का दूतावास, लजुब्लजाना', category: 'Embassy', city: 'Ljubljana', country: 'Slovenia' },
      { nameEn: 'Embassy of India, Madrid', nameHi: 'भारत का दूतावास, मैड्रिड', category: 'Embassy', city: 'Madrid', country: 'Spain' },
      { nameEn: 'Embassy of India, Minsk', nameHi: 'भारत का दूतावास, मिन्स्क', category: 'Embassy', city: 'Minsk', country: 'Belarus' },
      { nameEn: 'Embassy of India, Moscow', nameHi: 'भारत का दूतावास, मॉस्को', category: 'Embassy', city: 'Moscow', country: 'Russia' },
      { nameEn: 'Embassy of India, Oslo', nameHi: 'भारत का दूतावास, ओस्लो', category: 'Embassy', city: 'Oslo', country: 'Norway' },
      { nameEn: 'Embassy of India, Paris', nameHi: 'भारत का दूतावास, पेरिस', category: 'Embassy', city: 'Paris', country: 'France' },
      { nameEn: 'Embassy of India, Prague', nameHi: 'भारत का दूतावास, प्राग', category: 'Embassy', city: 'Prague', country: 'Czech Republic' },
      { nameEn: 'Embassy of India, Reykjavik', nameHi: 'भारत का दूतावास, रेकजाविक', category: 'Embassy', city: 'Reykjavik', country: 'Iceland' },
      { nameEn: 'Embassy of India, Rome', nameHi: 'भारत का दूतावास, रोम', category: 'Embassy', city: 'Rome', country: 'Italy' },
      { nameEn: 'Embassy of India, Sofia', nameHi: 'भारत का दूतावास, सोफिया', category: 'Embassy', city: 'Sofia', country: 'Bulgaria' },
      { nameEn: 'Embassy of India, Stockholm', nameHi: 'भारत का दूतावास, स्टॉकहोम', category: 'Embassy', city: 'Stockholm', country: 'Sweden' },
      { nameEn: 'Embassy of India, The Hague', nameHi: 'भारत का दूतावास, द हेग', category: 'Embassy', city: 'The Hague', country: 'Netherlands' },
      { nameEn: 'Embassy of India, Valletta', nameHi: 'भारत का दूतावास, वालेटा', category: 'Embassy', city: 'Valletta', country: 'Malta' },
      { nameEn: 'Embassy of India, Vienna', nameHi: 'भारत का दूतावास, वियना', category: 'Embassy', city: 'Vienna', country: 'Austria' },
      { nameEn: 'Embassy of India, Warsaw', nameHi: 'भारत का दूतावास, वारसॉ', category: 'Embassy', city: 'Warsaw', country: 'Poland' },
      { nameEn: 'Embassy of India, Zagreb', nameHi: 'भारत का दूतावास, ज़गरेब', category: 'Embassy', city: 'Zagreb', country: 'Croatia' },
      // 2 High Commissions
      { nameEn: 'High Commission of India, London (HCI)', nameHi: 'भारत का उच्चायोग, लंदन (एचसीआई)', category: 'High Commission', city: 'London', country: 'United Kingdom' },
      { nameEn: 'High Commission of India, Nicosia', nameHi: 'भारत का उच्चायोग, निकोसिया', category: 'High Commission', city: 'Nicosia', country: 'Cyprus' },
      // 7 Consulates General
      { nameEn: 'Consulate General of India, Birmingham', nameHi: 'भारत का महावाणिज्य दूतावास, बर्मिंघम', category: 'Consulate General', city: 'Birmingham', country: 'United Kingdom' },
      { nameEn: 'Consulate General of India, Edinburgh', nameHi: 'भारत का महावाणिज्य दूतावास, एडिनबर्ग', category: 'Consulate General', city: 'Edinburgh', country: 'United Kingdom' },
      { nameEn: 'Consulate General of India, Frankfurt', nameHi: 'भारत का महावाणिज्य दूतावास, फ्रैंकफर्ट', category: 'Consulate General', city: 'Frankfurt', country: 'Germany' },
      { nameEn: 'Consulate General of India, Hamburg', nameHi: 'भारत का महावाणिज्य दूतावास, हैम्बर्ग', category: 'Consulate General', city: 'Hamburg', country: 'Germany' },
      { nameEn: 'Consulate General of India, Milan', nameHi: 'भारत का महावाणिज्य दूतावास, मिलान', category: 'Consulate General', city: 'Milan', country: 'Italy' },
      { nameEn: 'Consulate General of India, Munich', nameHi: 'भारत का महावाणिज्य दूतावास, म्यूनिख', category: 'Consulate General', city: 'Munich', country: 'Germany' },
      { nameEn: 'Consulate General of India, St. Petersburg', nameHi: 'भारत का महावाणिज्य दूतावास, सेंट पीटर्सबर्ग', category: 'Consulate General', city: 'St. Petersburg', country: 'Russia' },
      // 1 Permanent Mission
      { nameEn: 'Permanent Mission of India to UN (PMI), Geneva', nameHi: 'संयुक्त राष्ट्र में भारत का स्थायी मिशन (पीएमआई), जिनेवा', category: 'Permanent Mission', city: 'Geneva', country: 'Switzerland' },
      // 3 Tourist Offices
      { nameEn: 'India Tourism Office, Frankfurt', nameHi: 'भारत पर्यटन कार्यालय, फ्रैंकफर्ट', category: 'Tourist Office', city: 'Frankfurt', country: 'Germany' },
      { nameEn: 'India Tourism Office, London', nameHi: 'भारत पर्यटन कार्यालय, लंदन', category: 'Tourist Office', city: 'London', country: 'United Kingdom' },
      { nameEn: 'India Tourism Office, Paris', nameHi: 'भारत पर्यटन कार्यालय, पेरिस', category: 'Tourist Office', city: 'Paris', country: 'France' },
      // 1 Autonomous Body
      { nameEn: 'India House Library & Cultural Resource Center', nameHi: 'इंडिया हाउस पुस्तकालय एवं सांस्कृतिक संसाधन केंद्र', category: 'Autonomous Body', city: 'London', country: 'United Kingdom' },
      // 13 PSU Overseas Branches
      { nameEn: 'State Bank of India (UK Branches & Subsidiary)', nameHi: 'भारतीय स्टेट बैंक (यूके शाखाएं)', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'State Bank of India, Frankfurt Branch', nameHi: 'भारतीय स्टेट बैंक, फ्रैंकफर्ट शाखा', category: 'PSU Branch', city: 'Frankfurt', country: 'Germany' },
      { nameEn: 'State Bank of India, Paris Branch', nameHi: 'भारतीय स्टेट बैंक, पेरिस शाखा', category: 'PSU Branch', city: 'Paris', country: 'France' },
      { nameEn: 'Bank of Baroda, UK Operations', nameHi: 'बैंक ऑफ बड़ौदा, यूके शाखाएं', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'Bank of Baroda, Brussels Branch', nameHi: 'बैंक ऑफ बड़ौदा, ब्रुसेल्स शाखा', category: 'PSU Branch', city: 'Brussels', country: 'Belgium' },
      { nameEn: 'Bank of India, London Branch', nameHi: 'बैंक ऑफ इंडिया, लंदन शाखा', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'New India Assurance Co. Ltd., London & Ipswich', nameHi: 'द न्यू इंडिया एश्योरेंस कंपनी लिमिटेड, लंदन', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'General Insurance Corporation of India (GIC Re), London', nameHi: 'जनरल इंश्योरेंस कॉर्पोरेशन ऑफ इंडिया, लंदन', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'Shipping Corporation of India (SCI), London Liaison Cell', nameHi: 'भारतीय नौवहन निगम (एससीआई), लंदन संपर्क सेल', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'Engineers India Limited (EIL), London & Milan', nameHi: 'इंजीनियर्स इंडिया लिमिटेड (ईआईएल), लंदन एवं मिलान', category: 'PSU Branch', city: 'London / Milan', country: 'UK / Italy' },
      { nameEn: 'Hindustan Aeronautics Limited (HAL), London & Moscow Liaison', nameHi: 'हिंदुस्तान एयरोनॉटिक्स लिमिटेड (एचएएल), संपर्क प्रकोष्ठ', category: 'PSU Branch', city: 'London / Moscow', country: 'UK / Russia' },
      { nameEn: 'Mazagon Dock Shipbuilders Limited (MDL), Paris & Moscow', nameHi: 'मझगांव डॉक शिपबिल्डर्स लिमिटेड, पेरिस एवं मॉस्को', category: 'PSU Branch', city: 'Paris / Moscow', country: 'France / Russia' },
      { nameEn: 'Nuclear Power Corporation of India Ltd. (NPCIL) Moscow Cell', nameHi: 'न्यूक्लियर पावर कॉर्पोरेशन ऑफ इंडिया लिमिटेड, मॉस्को', category: 'PSU Branch', city: 'Moscow', country: 'Russia' },
      { nameEn: 'Energy Efficiency Services Limited (EESL), UK Operations', nameHi: 'एनर्जी एफिशिएंसी सर्विसेज लिमिटेड (ईईएसएल), यूके', category: 'PSU Branch', city: 'London', country: 'United Kingdom' },
      { nameEn: 'Tea Board of India, Moscow Liaison Office', nameHi: 'भारतीय चाय बोर्ड, मॉस्को संपर्क कार्यालय', category: 'PSU Branch', city: 'Moscow', country: 'Russia' }
    ],
    holidaysList: [
      { date: '01 Jan 2026', dayEn: 'Thursday', dayHi: 'गुरुवार', nameEn: "New Year's Day", nameHi: 'नव वर्ष दिवस', type: 'Bank Holiday' },
      { date: '26 Jan 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Republic Day of India', nameHi: 'भारत का गणतंत्र दिवस', type: 'Closed Holiday' },
      { date: '03 Apr 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Good Friday', nameHi: 'गुड फ्राइडे', type: 'Closed Holiday' },
      { date: '06 Apr 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Easter Monday', nameHi: 'ईस्टर सोमवार', type: 'Bank Holiday' },
      { date: '04 May 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Early May Bank Holiday', nameHi: 'मई बैंक अवकाश', type: 'Bank Holiday' },
      { date: '25 May 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Spring Bank Holiday', nameHi: 'वसंत बैंक अवकाश', type: 'Bank Holiday' },
      { date: '15 Aug 2026', dayEn: 'Saturday', dayHi: 'शनिवार', nameEn: 'Independence Day of India', nameHi: 'स्वतंत्रता दिवस (भारत)', type: 'Closed Holiday' },
      { date: '31 Aug 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Summer Bank Holiday', nameHi: 'ग्रीष्मकालीन बैंक अवकाश', type: 'Bank Holiday' },
      { date: '02 Oct 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: "Mahatma Gandhi's Birthday", nameHi: 'महात्मा गांधी जयंती', type: 'Closed Holiday' },
      { date: '09 Nov 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Diwali (Deepavali)', nameHi: 'दीपावली', type: 'Closed Holiday' },
      { date: '25 Dec 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Christmas Day', nameHi: 'क्रिसमस डे', type: 'Closed Holiday' },
      { date: '26 Dec 2026', dayEn: 'Saturday', dayHi: 'शनिवार', nameEn: 'Boxing Day', nameHi: 'बॉक्सिंग डे', type: 'Bank Holiday' }
    ]
  },
  'overseas-kualalumpur': {
    slug: 'overseas-kualalumpur',
    theme: 'KUL',
    officeNameEn: 'Principal Director of Audit, Kuala Lumpur',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर',
    locationEn: 'Kuala Lumpur, Malaysia',
    locationHi: 'कुआलालंपुर, मलेशिया',
    addressEn: 'Suite 9.02, Level 9, Wisma E&C, # 2 Lorong Dungun Kiri, Damansara Heights, 50490 Kuala Lumpur, Malaysia',
    addressHi: 'सूट 9.02, स्तर 9, विस्मा ईएंडसी, # 2 लोरॉन्ग डुंगुन किरी, दमनसारा हाइट्स, 50490 कुआलालंपुर, मलेशिया',
    officeHoursEn: '09:00 AM - 05:30 PM (Monday - Friday)',
    officeHoursHi: 'प्रातः 09:00 - सायं 05:30 (सोमवार - शुक्रवार)',
    phone: '(00-603) 2092 1058',
    email: 'pdakualalumpur@cag.gov.in',
    obfuscatedEmail: 'pdakualalumpur[at]cag[dot]gov[dot]in',
    gmapEmbedUrl: 'https://maps.google.com/maps?width=700&height=400&hl=en&q=Wisma+E%26C+Lorong+Dungun+Kiri+Damansara+Heights+50490+Kuala+Lumpur+Malaysia&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    gmapQuery: 'Wisma E&C Lorong Dungun Kiri Damansara Heights 50490 Kuala Lumpur Malaysia',
    externalOfficialUrl: 'https://cag.gov.in/pda/kul/en',
    themeColor: '#1D2E6B',
    mandateEn: 'Serving as the Southeast Asian regional audit headquarters responsible for the audit of Indian diplomatic missions, PSUs, and multilateral representation across East Asia, Southeast Asia, and Australasia.',
    mandateHi: 'दक्षिण पूर्व एशियाई क्षेत्रीय लेखापरीक्षा मुख्यालय के रूप में पूर्व एशिया, दक्षिण पूर्व एशिया और ओशिनिया में भारतीय राजनयिक मिशनों, सार्वजनिक उपक्रमों एवं बहुपक्षीय संस्थाओं की लेखापरीक्षा हेतु उत्तरदायी।',
    historyEn: 'Before establishment of the office of the Principal Director of Audit, Kuala Lumpur, the diplomatic missions, offices of Indian PSUs and other Government of India establishments in East Asia, South East Asia and Oceania were audited by the Principal Director of Audit, London. To improve the efficacy of audit and for strategic management, the new audit office at Kuala Lumpur was established in December 2011.',
    historyHi: 'प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर के कार्यालय की स्थापना से पहले, पूर्वी एशिया, दक्षिण पूर्व एशिया और ओशिनिया में राजनयिक मिशनों, भारतीय सार्वजनिक क्षेत्र के उपक्रमों के कार्यालयों और भारत सरकार के अन्य प्रतिष्ठानों की लेखापरीक्षा प्रधान निदेशक लेखा परीक्षा, लंदन द्वारा की जाती थी। लेखापरीक्षा की दक्षता में सुधार और रणनीतिक प्रबंधन के लिए, दिसंबर 2011 में कुआलालंपुर में नए लेखापरीक्षा कार्यालय की स्थापना की गई।',
    holidaysList: [
      { date: '01 Jan 2026', dayEn: 'Thursday', dayHi: 'गुरुवार', nameEn: "New Year's Day", nameHi: 'नव वर्ष दिवस', type: 'Federal Holiday' },
      { date: '26 Jan 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Republic Day of India', nameHi: 'भारत का गणतंत्र दिवस', type: 'Closed Holiday' },
      { date: '29 Jan 2026', dayEn: 'Thursday', dayHi: 'गुरुवार', nameEn: 'Chinese New Year', nameHi: 'चीनी नव वर्ष', type: 'Federal Holiday' },
      { date: '01 Feb 2026', dayEn: 'Sunday', dayHi: 'रविवार', nameEn: 'Federal Territory Day', nameHi: 'फेडरल टेरिटरी डे', type: 'Federal Holiday' },
      { date: '20 Mar 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Hari Raya Aidilfitri', nameHi: 'हरि राया ऐदिलफित्री', type: 'Federal Holiday' },
      { date: '01 May 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Labour Day', nameHi: 'मजदूर दिवस', type: 'Federal Holiday' },
      { date: '31 May 2026', dayEn: 'Sunday', dayHi: 'रविवार', nameEn: 'Wesak Day', nameHi: 'वेसाक दिवस', type: 'Federal Holiday' },
      { date: '01 Jun 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: "King's Birthday", nameHi: 'राजा का जन्मदिन', type: 'Federal Holiday' },
      { date: '15 Aug 2026', dayEn: 'Saturday', dayHi: 'शनिवार', nameEn: 'Independence Day of India', nameHi: 'स्वतंत्रता दिवस (भारत)', type: 'Closed Holiday' },
      { date: '31 Aug 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Malaysia National Day', nameHi: 'मलेशिया राष्ट्रीय दिवस', type: 'Federal Holiday' },
      { date: '16 Sep 2026', dayEn: 'Wednesday', dayHi: 'बुधवार', nameEn: 'Malaysia Day', nameHi: 'मलेशिया दिवस', type: 'Federal Holiday' },
      { date: '02 Oct 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: "Mahatma Gandhi's Birthday", nameHi: 'महात्मा गांधी जयंती', type: 'Closed Holiday' },
      { date: '08 Nov 2026', dayEn: 'Sunday', dayHi: 'रविवार', nameEn: 'Deepavali', nameHi: 'दीपावली', type: 'Closed Holiday' },
      { date: '25 Dec 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Christmas Day', nameHi: 'क्रिसमस डे', type: 'Closed Holiday' }
    ],
    auditScopes: [
      {
        titleEn: 'Southeast Asia Mission & Embassy Audits',
        titleHi: 'दक्षिण पूर्व एशिया मिशन एवं दूतावास लेखापरीक्षा',
        descEn: 'Statutory financial and compliance audit of Indian Embassies, Consulates, and ASEAN Mission delegations in Southeast Asia and Oceania.',
        descHi: 'दक्षिण पूर्व एशिया और ओशिनिया में भारतीय दूतावासों, वाणिज्य दूतावासों और आसियान मिशन प्रतिनिधिमंडलों की वैधानिक वित्तीय और अनुपालन लेखापरीक्षा।'
      },
      {
        titleEn: 'Indian PSUs & Overseas Entities Scrutiny',
        titleHi: 'भारतीय सार्वजनिक उपक्रम एवं विदेशी संस्थाएं जांच',
        descEn: 'Audit of overseas branches of Indian Public Sector Undertakings (PSUs), banks, trade promotion bodies, and technical cooperation projects.',
        descHi: 'भारतीय सार्वजनिक क्षेत्र के उपक्रमों (पीएसयू), बैंकों, व्यापार संवर्धन निकायों और तकनीकी सहयोग परियोजनाओं की विदेशी शाखाओं की लेखापरीक्षा।'
      }
    ],
    faqs: [
      {
        qEn: 'Which territories fall under the Kuala Lumpur Overseas Audit jurisdiction?',
        qHi: 'कुआलालंपुर विदेशी लेखापरीक्षा क्षेत्राधिकार के अंतर्गत कौन से क्षेत्र आते हैं?',
        aEn: 'The office covers Malaysia, Singapore, Indonesia, Thailand, Vietnam, Philippines, Australia, New Zealand, Japan, South Korea, China, and other East Asian & ASEAN member nations.',
        aHi: 'यह कार्यालय मलेशिया, सिंगापुर, इंडोनेशिया, थाईलैंड, वियतनाम, फिलीपींस, ऑस्ट्रेलिया, न्यूजीलैंड, जापान, दक्षिण कोरिया, चीन और अन्य पूर्वी एशियाई व आसियान सदस्य देशों को कवर करता है।'
      }
    ],
    pdsList: [
      { nameEn: 'Shri P. V. Hari Krishna, IA&AS', nameHi: 'श्री पी. वी. हरि कृष्णा, आईएएंडएएस', tenure: '2023 - Present', roleEn: 'Principal Director of Audit', roleHi: 'प्रधान निदेशक लेखा परीक्षा' },
      { nameEn: 'Shri K. Subramanian, IA&AS', nameHi: 'श्री के. सुब्रमण्यन, आईएएंडएएस', tenure: '2019 - 2023', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Ms. Reena Saha, IA&AS', nameHi: 'सुश्री रीना साहा, आईएएंडएएस', tenure: '2015 - 2019', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Shri S. A. Bathew, IA&AS', nameHi: 'श्री एस. ए. बाथ्यू, आईएएंडएएस', tenure: '2011 - 2015', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' }
    ],
    directorsList: [
      { nameEn: 'Mr. Gaurav Rai, IA&AS', nameHi: 'श्री गौरव राय, आईएएंडएएस', tenure: '2025 - Present', roleEn: 'Director of Audit', roleHi: 'निदेशक लेखा परीक्षा' },
      { nameEn: 'Mr. Hautinlal Suantak, IA&AS', nameHi: 'श्री हौतिनलाल सुआन्तक, आईएएंडएएस', tenure: '2023 - 2025', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Ms. Nishi Sharma, IA&AS', nameHi: 'सुश्री निशी शर्मा, आईएएंडएएस', tenure: '2020 - 2023', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Shri Vikram D. Murugaraj, IA&AS', nameHi: 'श्री विक्रम डी. मुरुगराज, आईएएंडएएस', tenure: '2017 - 2020', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' }
    ],
    unitsList: [
      { nameEn: 'High Commission of India, Kuala Lumpur', nameHi: 'भारत का उच्चायोग, कुआलालंपुर', category: 'High Commission', city: 'Kuala Lumpur', country: 'Malaysia' },
      { nameEn: 'High Commission of India, Singapore', nameHi: 'भारत का उच्चायोग, सिंगापुर', category: 'High Commission', city: 'Singapore', country: 'Singapore' },
      { nameEn: 'Embassy of India, Jakarta', nameHi: 'भारत का दूतावास, जकार्ता', category: 'Embassy', city: 'Jakarta', country: 'Indonesia' },
      { nameEn: 'Consulate General of India, Medan', nameHi: 'भारत का महावाणिज्य दूतावास, मेदान', category: 'Consulate General', city: 'Medan', country: 'Indonesia' },
      { nameEn: 'Consulate General of India, Bali', nameHi: 'भारत का महावाणिज्य दूतावास, बाली', category: 'Consulate General', city: 'Bali', country: 'Indonesia' },
      { nameEn: 'Embassy of India, Bangkok', nameHi: 'भारत का दूतावास, बैंकॉक', category: 'Embassy', city: 'Bangkok', country: 'Thailand' },
      { nameEn: 'Consulate of India, Chiang Mai', nameHi: 'भारत का वाणिज्य दूतावास, चियांग माई', category: 'Consulate General', city: 'Chiang Mai', country: 'Thailand' },
      { nameEn: 'Embassy of India, Manila', nameHi: 'भारत का दूतावास, मनीला', category: 'Embassy', city: 'Manila', country: 'Philippines' },
      { nameEn: 'Embassy of India, Hanoi', nameHi: 'भारत का दूतावास, हनोई', category: 'Embassy', city: 'Hanoi', country: 'Vietnam' },
      { nameEn: 'Consulate General of India, Ho Chi Minh City', nameHi: 'भारत का महावाणिज्य दूतावास, हो ची मिन्ह सिटी', category: 'Consulate General', city: 'Ho Chi Minh City', country: 'Vietnam' },
      { nameEn: 'High Commission of India, Canberra', nameHi: 'भारत का उच्चायोग, कैनबरा', category: 'High Commission', city: 'Canberra', country: 'Australia' },
      { nameEn: 'Consulate General of India, Sydney', nameHi: 'भारत का महावाणिज्य दूतावास, सिडनी', category: 'Consulate General', city: 'Sydney', country: 'Australia' },
      { nameEn: 'Consulate General of India, Melbourne', nameHi: 'भारत का महावाणिज्य दूतावास, मेलबर्न', category: 'Consulate General', city: 'Melbourne', country: 'Australia' },
      { nameEn: 'Consulate General of India, Perth', nameHi: 'भारत का महावाणिज्य दूतावास, पर्थ', category: 'Consulate General', city: 'Perth', country: 'Australia' },
      { nameEn: 'Consulate General of India, Brisbane', nameHi: 'भारत का महावाणिज्य दूतावास, ब्रिस्बेन', category: 'Consulate General', city: 'Brisbane', country: 'Australia' },
      { nameEn: 'High Commission of India, Wellington', nameHi: 'भारत का उच्चायोग, वेलिंगटन', category: 'High Commission', city: 'Wellington', country: 'New Zealand' },
      { nameEn: 'Embassy of India, Tokyo', nameHi: 'भारत का दूतावास, टोक्यो', category: 'Embassy', city: 'Tokyo', country: 'Japan' },
      { nameEn: 'Consulate General of India, Osaka-Kobe', nameHi: 'भारत का महावाणिज्य दूतावास, ओसाका-कोबे', category: 'Consulate General', city: 'Osaka', country: 'Japan' },
      { nameEn: 'Embassy of India, Seoul', nameHi: 'भारत का दूतावास, सियोल', category: 'Embassy', city: 'Seoul', country: 'South Korea' },
      { nameEn: 'Embassy of India, Beijing', nameHi: 'भारत का दूतावास, बीजिंग', category: 'Embassy', city: 'Beijing', country: 'China' },
      { nameEn: 'Consulate General of India, Shanghai', nameHi: 'भारत का महावाणिज्य दूतावास, शंघाई', category: 'Consulate General', city: 'Shanghai', country: 'China' },
      { nameEn: 'Consulate General of India, Guangzhou', nameHi: 'भारत का महावाणिज्य दूतावास, गुआंगझू', category: 'Consulate General', city: 'Guangzhou', country: 'China' },
      { nameEn: 'Consulate General of India, Hong Kong', nameHi: 'भारत का महावाणिज्य दूतावास, हांगकांग', category: 'Consulate General', city: 'Hong Kong', country: 'China' },
      { nameEn: 'State Bank of India, Singapore Branch', nameHi: 'भारतीय स्टेट बैंक, सिंगापुर शाखा', category: 'PSU Overseas Branch', city: 'Singapore', country: 'Singapore' },
      { nameEn: 'Indian Overseas Bank, Bangkok Branch', nameHi: 'इंडियन ओवरसीज बैंक, बैंकॉक शाखा', category: 'PSU Overseas Branch', city: 'Bangkok', country: 'Thailand' },
      { nameEn: 'Bank of India, Singapore Branch', nameHi: 'बैंक ऑफ इंडिया, सिंगापुर शाखा', category: 'PSU Overseas Branch', city: 'Singapore', country: 'Singapore' },
      { nameEn: 'Bank of Baroda, Sydney Branch', nameHi: 'बैंक ऑफ बड़ौदा, सिडनी शाखा', category: 'PSU Overseas Branch', city: 'Sydney', country: 'Australia' }
    ]
  },
  'overseas-washington': {
    slug: 'overseas-washington',
    theme: 'WDC',
    officeNameEn: 'Principal Director of Audit, Washington DC',
    officeNameHi: 'प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी',
    locationEn: 'Washington D.C., USA',
    locationHi: 'वाशिंगटन डीसी, यूएसए',
    addressEn: 'Chancery-II, Embassy of India, 2536 Massachusetts Avenue, NW Washington DC 20008, USA.',
    addressHi: 'चांसरी-II, भारत का दूतावास, 2536 मैसाचुसेट्स एवेन्यू, एनडब्ल्यू वाशिंगटन डीसी 20008, यूएसए।',
    officeHoursEn: '09:30 AM - 6:00 PM (Monday-Friday)',
    officeHoursHi: 'प्रातः 09:30 - सायं 06:00 (सोमवार - शुक्रवार)',
    phone: '+1 202-939-9857',
    email: 'pdawashington@cag.gov.in',
    obfuscatedEmail: 'pdawashington[at]cag[dot]gov[dot]in',
    gmapEmbedUrl: 'https://maps.google.com/maps?width=700&height=400&hl=en&q=2536%20Massachusetts%20Avenue%2C%20NW%20Washington%20DC%2020008&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    gmapQuery: '2536 Massachusetts Avenue NW Washington DC 20008',
    externalOfficialUrl: 'https://cag.gov.in/pda-washington/en',
    themeColor: '#1D2E6B',
    mandateEn: 'Auditing Indian diplomatic missions across North and South America, Permanent Mission to the United Nations (New York), and World Bank / IMF liaison accounts.',
    mandateHi: 'उत्तर और दक्षिण अमेरिका में भारतीय राजनयिक मिशनों, संयुक्त राष्ट्र (न्यूयॉर्क) में स्थायी मिशन, तथा विश्व बैंक/आईएमएफ संपर्क खातों की लेखापरीक्षा।',
    auditScopes: [
      {
        titleEn: 'Americas Diplomatic & Consular Audit',
        titleHi: 'अमेरिका राजनयिक एवं कांसुलर लेखापरीक्षा',
        descEn: 'Comprehensive financial and propriety audit of Embassy of India Washington, UN Permanent Mission NY, and Consulates in New York, San Francisco, Chicago, Houston, Atlanta, and Seattle.',
        descHi: 'वाशिंगटन स्थित भारतीय दूतावास, संयुक्त राष्ट्र स्थायी मिशन न्यूयॉर्क, तथा न्यूयॉर्क, सैन फ्रांसिस्को, शिकागो, ह्यूस्टन, अटलांटा और सिएटल स्थित वाणिज्य दूतावासों की लेखापरीक्षा।'
      },
      {
        titleEn: 'Multilateral Financial Institutions Audit',
        titleHi: 'बहुपक्षीय वित्तीय संस्थान लेखापरीक्षा',
        descEn: 'Verification of India\'s subscriptions, capital contributions, and trust fund allocations with the World Bank, IMF, and Inter-American Development Bank.',
        descHi: 'विश्व बैंक, आईएमएफ और इंटर-अमेरिकन डेवलपमेंट बैंक के साथ भारत के अंशदान, पूंजी योगदान और ट्रस्ट फंड आवंटन का सत्यापन।'
      }
    ],
    faqs: [
      {
        qEn: 'Does Washington DC office audit the Permanent Mission to the UN in New York?',
        qHi: 'क्या वाशिंगटन डीसी कार्यालय न्यूयॉर्क में संयुक्त राष्ट्र में स्थायी मिशन की लेखापरीक्षा करता है?',
        aEn: 'Yes, the Permanent Mission of India to the United Nations (PMI NY) is audited under the jurisdiction of PDA Washington DC.',
        aHi: 'हाँ, संयुक्त राष्ट्र में भारत के स्थायी मिशन (पीएमआई न्यूयॉर्क) की लेखापरीक्षा पीडीए वाशिंगटन डीसी के क्षेत्राधिकार में की जाती है।'
      }
    ],
    // PDA – WDC Menu Data
    historyEn: 'The Office of the Principal Director of Audit, Washington D.C., was established to ensure comprehensive statutory audit of Indian diplomatic missions, consulates, defense advisor establishments, and trade representations across the United States, Canada, and Latin America, as well as the Permanent Mission of India to the United Nations in New York.',
    historyHi: 'प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी के कार्यालय की स्थापना संयुक्त राज्य अमेरिका, कनाडा और लैटिन अमेरिका में भारतीय राजनयिक मिशनों, वाणिज्य दूतावासों, रक्षा सलाहकार प्रतिष्ठानों, व्यापार अभ्यावेदनों तथा न्यूयॉर्क में संयुक्त राष्ट्र में भारत के स्थायी मिशन की व्यापक वैधानिक लेखापरीक्षा सुनिश्चित करने के लिए की गई थी।',
    directorsList: [
      { nameEn: 'Ms. S. Meenakshi, IA&AS', nameHi: 'सुश्री एस. मीनाक्षी, आईएएंडएएस', tenure: '2023 - Present', roleEn: 'Director of Audit', roleHi: 'लेखा परीक्षा निदेशक' },
      { nameEn: 'Shri Amitabh Ray, IA&AS', nameHi: 'श्री अमिताभ राय, आईएएंडएएस', tenure: '2020 - 2023', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' },
      { nameEn: 'Ms. Geeta Menon, IA&AS', nameHi: 'सुश्री गीता मेनन, आईएएंडएएस', tenure: '2017 - 2020', roleEn: 'Former Director of Audit', roleHi: 'पूर्व लेखा परीक्षा निदेशक' }
    ],
    pdsList: [
      { nameEn: 'Shri Rajesh Kumar, IA&AS', nameHi: 'श्री राजेश कुमार, आईएएंडएएस', tenure: '2023 - Present', roleEn: 'Principal Director of Audit', roleHi: 'प्रधान निदेशक लेखा परीक्षा' },
      { nameEn: 'Shri R. P. Singh, IA&AS', nameHi: 'श्री आर. पी. सिंह, आईएएंडएएस', tenure: '2020 - 2023', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' },
      { nameEn: 'Dr. A. K. Banerjee, IA&AS', nameHi: 'डॉ. ए. के. बनर्जी, आईएएंडएएस', tenure: '2016 - 2020', roleEn: 'Former Principal Director', roleHi: 'पूर्व प्रधान निदेशक' }
    ],
    orgStructureEn: 'The Office operates under the leadership of the Principal Director of Audit (IA&AS), supported by the Director of Audit, Senior Audit Officers (SAOs), Assistant Audit Officers (AAOs), and administrative support personnel responsible for field audit planning, diplomatic accounts scrutiny, and reporting.',
    orgStructureHi: 'कार्यालय प्रधान निदेशक लेखा परीक्षा (आईएएंडएएस) के नेतृत्व में संचालित होता है, जिन्हें लेखा परीक्षा निदेशक, वरिष्ठ लेखा परीक्षा अधिकारी (एसएओ), सहायक लेखा परीक्षा अधिकारी (एएओ) और प्रशासनिक सहायता कर्मियों द्वारा सहयोग प्रदान किया जाता है।',
    staffDetailsPdfUrl: 'https://cag.gov.in/uploads/media/Staff-Details-pdf-page-069e8e2d9289ed9-76223953.pdf',
    administrativeFunctionEn: 'The administrative wing oversees resource allocation, annual audit calendar finalization, human resource management, embassy protocol coordination, IT infrastructure, and statutory reporting to the Comptroller & Auditor General of India in New Delhi.',
    administrativeFunctionHi: 'प्रशासनिक विंग संसाधन आवंटन, वार्षिक लेखापरीक्षा कैलेंडर को अंतिम रूप देने, मानव संसाधन प्रबंधन, दूतावास प्रोटोकॉल समन्वय, आईटी अवसंरचना और नई दिल्ली स्थित भारत के नियंत्रक एवं महालेखापरीक्षक को वैधानिक रिपोर्टिंग की निगरानी करता है।',
    auditJurisdictionEn: 'Jurisdiction encompasses Embassy of India Washington D.C., Permanent Mission of India to UN (New York), Consulates General in New York, San Francisco, Chicago, Houston, Atlanta, and Seattle, Embassy in Ottawa (Canada), Embassy in Brasilia, and international financial liaison cells.',
    auditJurisdictionHi: 'क्षेत्राधिकार में भारत का दूतावास वाशिंगटन डीसी, संयुक्त राष्ट्र में भारत का स्थायी मिशन (न्यूयॉर्क), न्यूयॉर्क, सैन फ्रांसिस्को, शिकागो, ह्यूस्टन, अटलांटा और सिएटल स्थित वाणिज्य दूतावास, ओटावा (कनाडा) स्थित दूतावास, ब्रासीलिया स्थित दूतावास और अंतर्राष्ट्रीय वित्तीय संपर्क प्रकोष्ठ शामिल हैं।',
    auditProcessEn: '1. Annual Audit Plan Formulation & HQ Clearance\n2. Issue of Audit Intimation & Entry Conference with Head of Mission\n3. On-site Field Audit, Vouching of Accounts & Compliance Scrutiny\n4. Issue of Audit Queries & Preliminary Observations\n5. Exit Conference with Diplomatic Officers\n6. Compilation and Dispatch of Final Inspection Report (IR) to MEA and CAG HQ.',
    auditProcessHi: '1. वार्षिक लेखापरीक्षा योजना का निर्धारण एवं मुख्यालय अनुमोदन\n2. लेखापरीक्षा सूचना जारी करना एवं मिशन प्रमुख के साथ प्रवेश सम्मेलन\n3. ऑन-साइट फील्ड ऑडिट, खातों की जांच एवं अनुपालन समीक्षा\n4. लेखापरीक्षा प्रश्न एवं प्रारंभिक टिप्पणियां जारी करना\n5. राजनयिक अधिकारियों के साथ निकास सम्मेलन\n6. अंतिम निरीक्षण रिपोर्ट (आईआर) का संकलन एवं विदेश मंत्रालय तथा सीएजी मुख्यालय को प्रेषण।',
    photoGallery: [
      { id: 'g1', titleEn: 'Annual Audit Entry Conference with Indian Diplomatic Mission', titleHi: 'भारतीय राजनयिक मिशन के साथ वार्षिक लेखापरीक्षा प्रवेश सम्मेलन', imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80', date: '15 Jan 2026' },
      { id: 'g2', titleEn: 'Permanent Mission of India to UN (New York) Audit Review Meeting', titleHi: 'संयुक्त राष्ट्र (न्यूयॉर्क) में भारत के स्थायी मिशन की लेखापरीक्षा समीक्षा बैठक', imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80', date: '22 Feb 2026' },
      { id: 'g3', titleEn: 'Bilateral External Audit Interaction at World Bank Headquarters', titleHi: 'विश्व बैंक मुख्यालय में द्विपक्षीय बाह्य लेखापरीक्षा संवाद', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', date: '10 Mar 2026' }
    ],
    holidaysList: [
      { date: '26 Jan 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Republic Day of India', nameHi: 'भारत का गणतंत्र दिवस', type: 'Closed Holiday' },
      { date: '16 Feb 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: "Washington's Birthday / Presidents' Day", nameHi: 'वाशिंगटन जन्मदिन / प्रेसिडेंट्स डे', type: 'Federal Holiday' },
      { date: '03 Apr 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Good Friday', nameHi: 'गुड फ्राइडे', type: 'Closed Holiday' },
      { date: '25 May 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Memorial Day', nameHi: 'मेमोरियल डे', type: 'Federal Holiday' },
      { date: '04 Jul 2026', dayEn: 'Saturday', dayHi: 'शनिवार', nameEn: 'Independence Day (USA)', nameHi: 'स्वतंत्रता दिवस (यूएसए)', type: 'Federal Holiday' },
      { date: '15 Aug 2026', dayEn: 'Saturday', dayHi: 'शनिवार', nameEn: 'Independence Day (India)', nameHi: 'स्वतंत्रता दिवस (भारत)', type: 'Closed Holiday' },
      { date: '07 Sep 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Labor Day', nameHi: 'लेबर डे', type: 'Federal Holiday' },
      { date: '02 Oct 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: "Mahatma Gandhi's Birthday", nameHi: 'महात्मा गांधी जयंती', type: 'Closed Holiday' },
      { date: '09 Nov 2026', dayEn: 'Monday', dayHi: 'सोमवार', nameEn: 'Diwali (Deepavali)', nameHi: 'दीपावली', type: 'Closed Holiday' },
      { date: '26 Nov 2026', dayEn: 'Thursday', dayHi: 'गुरुवार', nameEn: 'Thanksgiving Day', nameHi: 'थैंक्सगिविंग डे', type: 'Federal Holiday' },
      { date: '25 Dec 2026', dayEn: 'Friday', dayHi: 'शुक्रवार', nameEn: 'Christmas Day', nameHi: 'क्रिसमस डे', type: 'Closed Holiday' }
    ],
    unitsList: [
      { nameEn: 'Embassy of India, Washington D.C.', nameHi: 'भारत का दूतावास, वाशिंगटन डीसी', category: 'Embassy', city: 'Washington D.C.', country: 'United States' },
      { nameEn: 'Permanent Mission of India to the UN, New York (PMI)', nameHi: 'संयुक्त राष्ट्र में भारत का स्थायी मिशन, न्यूयॉर्क', category: 'Permanent Mission', city: 'New York', country: 'United States' },
      { nameEn: 'Consulate General of India, New York', nameHi: 'भारत का महावाणिज्य दूतावास, न्यूयॉर्क', category: 'Consulate General', city: 'New York', country: 'United States' },
      { nameEn: 'Consulate General of India, San Francisco', nameHi: 'भारत का महावाणिज्य दूतावास, सैन फ्रांसिस्को', category: 'Consulate General', city: 'San Francisco', country: 'United States' },
      { nameEn: 'Consulate General of India, Chicago', nameHi: 'भारत का महावाणिज्य दूतावास, शिकागो', category: 'Consulate General', city: 'Chicago', country: 'United States' },
      { nameEn: 'Consulate General of India, Houston', nameHi: 'भारत का महावाणिज्य दूतावास, ह्यूस्टन', category: 'Consulate General', city: 'Houston', country: 'United States' },
      { nameEn: 'Consulate General of India, Atlanta', nameHi: 'भारत का महावाणिज्य दूतावास, अटलांटा', category: 'Consulate General', city: 'Atlanta', country: 'United States' },
      { nameEn: 'Consulate General of India, Seattle', nameHi: 'भारत का महावाणिज्य दूतावास, सिएटल', category: 'Consulate General', city: 'Seattle', country: 'United States' },
      { nameEn: 'High Commission of India, Ottawa', nameHi: 'भारत का उच्चायोग, ओटावा', category: 'High Commission', city: 'Ottawa', country: 'Canada' },
      { nameEn: 'Consulate General of India, Toronto', nameHi: 'भारत का महावाणिज्य दूतावास, टोरंटो', category: 'Consulate General', city: 'Toronto', country: 'Canada' },
      { nameEn: 'Consulate General of India, Vancouver', nameHi: 'भारत का महावाणिज्य दूतावास, वैंकूवर', category: 'Consulate General', city: 'Vancouver', country: 'Canada' },
      { nameEn: 'Embassy of India, Brasilia', nameHi: 'भारत का दूतावास, ब्रासीलिया', category: 'Embassy', city: 'Brasilia', country: 'Brazil' },
      { nameEn: 'Consulate General of India, Sao Paulo', nameHi: 'भारत का महावाणिज्य दूतावास, साओ पाउलो', category: 'Consulate General', city: 'Sao Paulo', country: 'Brazil' },
      { nameEn: 'Embassy of India, Buenos Aires', nameHi: 'भारत का दूतावास, ब्यूनस आयर्स', category: 'Embassy', city: 'Buenos Aires', country: 'Argentina' },
      { nameEn: 'Embassy of India, Santiago', nameHi: 'भारत का दूतावास, सैंटियागो', category: 'Embassy', city: 'Santiago', country: 'Chile' },
      { nameEn: 'Embassy of India, Bogota', nameHi: 'भारत का दूतावास, बोगोटा', category: 'Embassy', city: 'Bogota', country: 'Colombia' },
      { nameEn: 'Embassy of India, Mexico City', nameHi: 'भारत का दूतावास, मैक्सिको सिटी', category: 'Embassy', city: 'Mexico City', country: 'Mexico' },
      { nameEn: 'Embassy of India, Lima', nameHi: 'भारत का दूतावास, लीमा', category: 'Embassy', city: 'Lima', country: 'Peru' },
      { nameEn: 'World Bank Liaison & Indian Subscription Accounts, Washington D.C.', nameHi: 'विश्व बैंक संपर्क एवं भारतीय अंशदान खाते, वाशिंगटन डीसी', category: 'Multilateral Financial Institution', city: 'Washington D.C.', country: 'United States' },
      { nameEn: 'IMF Liaison & Trust Fund Accounts, Washington D.C.', nameHi: 'आईएमएफ संपर्क एवं ट्रस्ट फंड खाते, वाशिंगटन डीसी', category: 'Multilateral Financial Institution', city: 'Washington D.C.', country: 'United States' },
      { nameEn: 'Inter-American Development Bank Liaison Cell', nameHi: 'इंटर-अमेरिकन डेवलपमेंट बैंक संपर्क प्रकोष्ठ', category: 'Multilateral Financial Institution', city: 'Washington D.C.', country: 'United States' },
      { nameEn: 'State Bank of India, New York Branch', nameHi: 'भारतीय स्टेट बैंक, न्यूयॉर्क शाखा', category: 'PSU Overseas Branch', city: 'New York', country: 'United States' },
      { nameEn: 'State Bank of India, Chicago Branch', nameHi: 'भारतीय स्टेट बैंक, शिकागो शाखा', category: 'PSU Overseas Branch', city: 'Chicago', country: 'United States' },
      { nameEn: 'Bank of Baroda, New York Branch', nameHi: 'बैंक ऑफ बड़ौदा, न्यूयॉर्क शाखा', category: 'PSU Overseas Branch', city: 'New York', country: 'United States' }
    ]
  },
  'overseas-rome': {
    slug: 'overseas-rome',
    theme: 'ROM',
    officeNameEn: 'Director of External Audit, Rome',
    officeNameHi: 'बाह्य लेखा परीक्षा निदेशक, रोम',
    locationEn: 'Rome, Italy',
    locationHi: 'रोम, इटली',
    addressEn: 'Embassy of India, Via XX Settembre, 5, 00187 Roma RM, Italy',
    addressHi: 'भारत का दूतावास, वाया एक्सएक्स सेटेम्ब्रे, 5, 00187 रोम, इटली',
    officeHoursEn: '09:00 AM - 05:30 PM (Monday - Friday)',
    officeHoursHi: 'प्रातः 09:00 - सायं 05:30 (सोमवार - शुक्रवार)',
    phone: '+39 06 488 4642 / +39 06 488 4643',
    email: 'audit.rome@mea.gov.in',
    obfuscatedEmail: 'audit[dot]rome[at]mea[dot]gov[dot]in',
    gmapEmbedUrl: 'https://maps.google.com/maps?width=700&height=400&hl=en&q=Via%20XX%20Settembre%2C%205%2C%2000187%20Roma%20RM%2C%20Italy&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    gmapQuery: 'Via XX Settembre 5 00187 Roma RM Italy',
    externalOfficialUrl: 'https://cag.gov.in/en/external-audit-rome',
    themeColor: '#1D2E6B',
    mandateEn: 'External audit of UN Specialized Agencies based in Rome (FAO, WFP, IFAD) and diplomatic mission audit in Southern Europe.',
    mandateHi: 'रोम स्थित संयुक्त राष्ट्र विशिष्ट एजेंसियों (एफएओ, डब्ल्यूएफपी, आईएफएडी) का बाह्य लेखापरीक्षण और दक्षिणी यूरोप में राजनयिक मिशन लेखापरीक्षा।',
    auditScopes: [
      {
        titleEn: 'UN Agencies External Audit (FAO / WFP / IFAD)',
        titleHi: 'संयुक्त राष्ट्र एजेंसियों का बाह्य लेखापरीक्षण (एफएओ/डब्ल्यूएफपी/आईएफएडी)',
        descEn: 'External financial statement audit and performance evaluations of the Food and Agriculture Organization and World Food Programme.',
        descHi: 'खाद्य एवं कृषि संगठन तथा विश्व खाद्य कार्यक्रम के वित्तीय विवरणों का बाह्य लेखापरीक्षण और प्रदर्शन मूल्यांकन।'
      }
    ],
    faqs: [
      {
        qEn: 'What is the role of the External Audit office in Rome?',
        qHi: 'रोम में बाह्य लेखा परीक्षा कार्यालय की क्या भूमिका है?',
        aEn: 'The office conducts independent external audits of Rome-based UN organizations and audits Indian embassies in Southern Europe.',
        aHi: 'यह कार्यालय रोम स्थित संयुक्त राष्ट्र संगठनों का स्वतंत्र बाह्य लेखापरीक्षण करता है और दक्षिणी यूरोप में भारतीय दूतावासों की लेखापरीक्षा करता है।'
      }
    ]
  },
  'overseas-geneva': {
    slug: 'overseas-geneva',
    theme: 'GVA',
    officeNameEn: 'Director of External Audit, Geneva',
    officeNameHi: 'बाह्य लेखा परीक्षा निदेशक, जिनेवा',
    locationEn: 'Geneva, Switzerland',
    locationHi: 'जिनेवा, स्विट्जरलैंड',
    addressEn: 'Permanent Mission of India, 9 Rue du Valais, 1202 Genève, Switzerland',
    addressHi: 'भारत का स्थायी मिशन, 9 रु डु वैले, 1202 जिनेवा, स्विट्जरलैंड',
    officeHoursEn: '09:00 AM - 05:30 PM (Monday - Friday)',
    officeHoursHi: 'प्रातः 09:00 - सायं 05:30 (सोमवार - शुक्रवार)',
    phone: '+41 22 906 8686 / +41 22 906 8677',
    email: 'audit.geneva@mea.gov.in',
    obfuscatedEmail: 'audit[dot]geneva[at]mea[dot]gov[dot]in',
    gmapEmbedUrl: 'https://maps.google.com/maps?width=700&height=400&hl=en&q=9%20Rue%20du%20Valais%2C%201202%20Gen%C3%A8ve%2C%20Switzerland&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    gmapQuery: '9 Rue du Valais 1202 Geneve Switzerland',
    externalOfficialUrl: 'https://cag.gov.in/en/external-audit-geneva',
    themeColor: '#1D2E6B',
    mandateEn: 'External audit of UN Specialized Agencies in Geneva (WHO, ILO, WTO, WIPO, ITU, IPU) and multilateral environmental agreements.',
    mandateHi: 'जिनेवा में संयुक्त राष्ट्र विशिष्ट एजेंसियों (डब्ल्यूएचओ, आईएलओ, डब्ल्यूटीओ, डब्ल्यूआईपीओ, आईटीयू, आईपीयू) का बाह्य लेखापरीक्षण।',
    auditScopes: [
      {
        titleEn: 'WHO & Global Health Audit',
        titleHi: 'डब्ल्यूएचओ एवं वैश्विक स्वास्थ्य लेखापरीक्षा',
        descEn: 'Comprehensive external financial and compliance audit of the World Health Organization headquarters and regional offices.',
        descHi: 'विश्व स्वास्थ्य संगठन मुख्यालय और क्षेत्रीय कार्यालयों की व्यापक बाह्य वित्तीय और अनुपालन लेखापरीक्षा।'
      },
      {
        titleEn: 'International Labour & Intellectual Property Audits',
        titleHi: 'अंतर्राष्ट्रीय श्रम एवं बौद्धिक संपदा लेखापरीक्षा',
        descEn: 'External audit oversight of ILO, WIPO, and UN Geneva humanitarian funds.',
        descHi: 'आईएलओ, डब्ल्यूआईपीओ और संयुक्त राष्ट्र जिनेवा मानवीय निधियों की बाह्य लेखापरीक्षा निगरानी।'
      }
    ],
    faqs: [
      {
        qEn: 'Which UN agencies are audited by the Geneva External Audit office?',
        qHi: 'जिनेवा बाह्य लेखा परीक्षा कार्यालय द्वारा किन संयुक्त राष्ट्र एजेंसियों की लेखापरीक्षा की जाती है?',
        aEn: 'The office audits WHO, ILO, WTO, WIPO, ITU, and the Inter-Parliamentary Union (IPU).',
        aHi: 'कार्यालय डब्ल्यूएचओ, आईएलओ, डब्ल्यूटीओ, डब्ल्यूआईपीओ, आईटीयू और अंतर-संसदीय संघ (आईपीयू) की लेखापरीक्षा करता है।'
      }
    ]
  },
  'andhra-pradesh': {
    slug: 'andhra-pradesh',
    theme: 'GSSA',
    officeNameEn: 'Principal Accountant General (A&E)',
    officeNameHi: 'प्रधान महालेखाकार (लेखा एवं हकदारी)',
    locationEn: 'Andhra Pradesh, Vijayawada',
    locationHi: 'आंध्र प्रदेश, विजयवाड़ा',
    addressEn: 'Office of the Principal Accountant General (A&E), Andhra Pradesh, Vijayawada - 520002',
    addressHi: 'प्रधान महालेखाकार (लेखा एवं हकदारी) का कार्यालय, आंध्र प्रदेश, विजयवाड़ा - 520002',
    officeHoursEn: '09:30 AM - 06:00 PM (Monday - Friday)',
    officeHoursHi: 'प्रातः 09:30 - सायं 06:00 (सोमवार - शुक्रवार)',
    phone: '+91 866 242 1200 / +91 866 242 1201',
    email: 'agaeandhrapradesh@cag.gov.in',
    obfuscatedEmail: 'agaeandhrapradesh[at]cag[dot]gov[dot]in',
    gmapEmbedUrl: 'https://maps.google.com/maps?width=700&height=400&hl=en&q=Principal%20Accountant%20General%20Vijayawada%20Andhra%20Pradesh&t=&z=14&ie=UTF8&iwloc=B&output=embed',
    gmapQuery: 'Principal Accountant General Vijayawada Andhra Pradesh',
    externalOfficialUrl: 'https://cag.gov.in/ae/andhra-pradesh/en',
    themeColor: '#0A3D30',
    mandateEn: 'Maintenance of accounts of the Government of Andhra Pradesh, compilation of monthly accounts and Annual Finance and Appropriation Accounts, authorization of Pension and GPF entitlements for state government employees.',
    mandateHi: 'आंध्र प्रदेश सरकार के खातों का रखरखाव, मासिक खातों और वार्षिक वित्त एवं विनियोग खातों का संकलन, राज्य सरकार के कर्मचारियों के लिए पेंशन और जीपीएफ हकदारी का प्राधिकरण।',
    auditScopes: [
      {
        titleEn: 'State Financial Accounts & VLC',
        titleHi: 'राज्य वित्तीय खाते एवं वीएलसी',
        descEn: 'Voucher Level Computerization (VLC) system managing all treasury transactions, revenue receipts, and public debt accounts of the State Government.',
        descHi: 'वाउचर लेवल कम्प्यूटरीकरण (वीएलसी) प्रणाली राज्य सरकार के सभी खजाना लेनदेन, राजस्व प्राप्तियों और सार्वजनिक ऋण खातों का प्रबंधन करती है।'
      },
      {
        titleEn: 'Pension & GPF Administration',
        titleHi: 'पेंशन एवं जीपीएफ प्रशासन',
        descEn: 'Timely issuance of Pension Payment Orders (PPOs), gratuity authorizations, and annual General Provident Fund statement maintenance for state cadres.',
        descHi: 'राज्य संवर्गों के लिए पेंशन भुगतान आदेश (पीपीओ), ग्रेच्युटी प्राधिकरण, और वार्षिक सामान्य भविष्य निधि विवरण का समय पर जारी करना।'
      }
    ],
    faqs: [
      {
        qEn: 'How can state government employees check their GPF account statement online?',
        qHi: 'राज्य सरकार के कर्मचारी अपने जीपीएफ खाते का विवरण ऑनलाइन कैसे देख सकते हैं?',
        aEn: 'Employees can access their GPF balance and annual credit slip using their GPF Series and Account Number through the Employee Corner portal.',
        aHi: 'कर्मचारी कर्मचारी कोना पोर्टल के माध्यम से अपनी जीपीएफ श्रृंखला और खाता संख्या का उपयोग करके अपने जीपीएफ शेष और वार्षिक क्रेडिट पर्ची तक पहुंच सकते हैं।'
      }
    ]
  }
};

export const DEFAULT_SUBSITE_ORG_STRUCTS: SubsiteOrgStructItem[] = [
  // ── London Office (LDN Theme) ──
  {
    id: '52',
    website_id: 'overseas-london',
    officer_name: 'Shri Sunilraj Somarajan',
    officer_name_hi: 'श्री सुनीलराज सोमराजन',
    designation: 'Director General',
    designation_hi: 'महानिदेशक लेखा परीक्षा',
    email: 'sunilraj@cag.gov.in',
    phone: '+44 20 7632 3051',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Photograph-066d9509b216e23-34697767.jpeg',
    bio: 'Shri S. Sunil Raj, IAAS belongs to the 1996 batch of the Civil Services. He has done his Masters in Economics from Mahatma Gandhi University, Kerala and also Masters in Defence and Strategic studies from Madras University. Head of Department overseeing Indian Foreign Missions audit operations across the UK and Europe.',
    bio_hi: 'श्री एस. सुनील राज, आईएएएस 1996 बैच के सिविल सेवा अधिकारी हैं। उन्होंने महात्मा गांधी विश्वविद्यालय, केरल से अर्थशास्त्र में स्नातकोत्तर और मद्रास विश्वविद्यालय से रक्षा एवं रणनीतिक अध्ययन में स्नातकोत्तर किया है।',
    seniority_order: 1,
    display_order: 1,
    status: 1
  },
  {
    id: '59',
    website_id: 'overseas-london',
    officer_name: 'Mr. Deepak Raghu',
    officer_name_hi: 'श्रीमान दीपक रघु',
    designation: 'Director of Audit',
    designation_hi: 'निदेशक लेखा परीक्षा',
    email: 'raghud@cag.gov.in',
    phone: '+44 20 7632 3052',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Director-06817b33f8a08c3-65723745.jpeg',
    bio: 'Director of Audit at the Office of the Director General of Audit, London supervising diplomatic missions accounts and financial compliance audits.',
    bio_hi: 'लेखापरीक्षा महानिदेशक कार्यालय, लंदन में निदेशक लेखा परीक्षा।',
    seniority_order: 2,
    display_order: 2,
    status: 1
  },
  {
    id: '88',
    website_id: 'overseas-london',
    officer_name: 'Mr. Sachin Bansal',
    officer_name_hi: 'श्रीमान सचिन बंसल',
    designation: 'Senior Audit Officer (SAO)',
    designation_hi: 'वरिष्ठ लेखा परीक्षा अधिकारी',
    email: 'bansals.comm@cag.gov.in',
    phone: '+44 20 7632 3053',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Sachin-Bansal-06a4e39a2dcbe21-18410489.png',
    bio: 'Senior Audit Officer in charge of field inspection teams and embassy voucher testing.',
    bio_hi: 'फील्ड निरीक्षण टीमों के प्रभारी वरिष्ठ लेखा परीक्षा अधिकारी।',
    seniority_order: 3,
    display_order: 3,
    status: 1
  },

  // ── Washington DC Office (WDC Theme) ──
  {
    id: '77',
    website_id: 'overseas-washington',
    officer_name: 'Mr. Srinivasa',
    officer_name_hi: 'श्रीमान श्रीनिवास',
    designation: 'Principal Director of Audit',
    designation_hi: 'प्रधान निदेशक लेखा परीक्षा',
    email: 'audit.washington@mea.gov.in',
    phone: '+1 202 939 7061',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-PDAL-PD-sir-067b4931cca3006-07312847-06895c524ad0387-06546721.jpg',
    bio: 'Shri Srinivasa Venkatanathan belongs to the 2005 batch of the Indian Audit & Accounts Service. Prior to his posting at Washington, he has served as Principal Director (Reports Central) at CAG HQ.',
    bio_hi: 'श्री श्रीनिवास वेंकटनाथन 2005 बैच के भारतीय लेखापरीक्षा एवं लेखा सेवा अधिकारी हैं।',
    seniority_order: 1,
    display_order: 1,
    status: 1
  },
  {
    id: '83',
    website_id: 'overseas-washington',
    officer_name: 'Mr. Mehul Grover',
    officer_name_hi: 'श्रीमान मेहुल ग्रोवर',
    designation: 'Director of Audit',
    designation_hi: 'निदेशक लेखा परीक्षा',
    email: 'groverm@cag.gov.in',
    phone: '+1 202 939 7062',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Director-Photo-069e8fa6d96f8f7-58429347.jpeg',
    bio: 'Mr. Mehul Grover is an officer of the Indian Audit and Accounts Service (IA&AS), belonging to the 2014 batch, currently serving as Director at the Office of the Principal Director of Audit, Washington.',
    bio_hi: 'श्री मेहुल ग्रोवर भारतीय लेखापरीक्षा एवं लेखा सेवा (आईएएंडएएस) के 2014 बैच के अधिकारी हैं।',
    seniority_order: 2,
    display_order: 2,
    status: 1
  },

  // ── Kuala Lumpur Office (KUL Theme) ──
  {
    id: '49',
    website_id: 'overseas-kualalumpur',
    officer_name: 'Mr. P. V. Hari Krishna',
    officer_name_hi: 'श्रीमान पी.वी. हरि कृष्णा',
    designation: 'Principal Director of Audit',
    designation_hi: 'प्रधान निदेशक लेखा परीक्षा',
    email: 'pdakualalumpur@cag.gov.in',
    phone: '(00-603) 2092 1058',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-PD-KP-0652ccc3bc70932-63837639-0656489de87ec43-45261207.jpg',
    bio: 'Shri P. V. Hari Krishna belongs to the 2000 batch of the Indian Audit and Accounts Service (IA&AS) and took charge as Principal Director/Minister (Audit), India Audit Office, Kuala Lumpur, Malaysia on 05.09.2023.',
    bio_hi: 'श्री पी.वी. हरि कृष्णा भारतीय लेखापरीक्षा एवं लेखा सेवा (आईएएंडएएस) के 2000 बैच के अधिकारी हैं और उन्होंने 05.09.2023 को प्रधान निदेशक, भारत लेखा परीक्षा कार्यालय, कुआलालंपुर का कार्यभार संभाला।',
    seniority_order: 1,
    display_order: 1,
    status: 1
  },
  {
    id: '79',
    website_id: 'overseas-kualalumpur',
    officer_name: 'Mr. Gaurav Rai',
    officer_name_hi: 'श्रीमान गौरव राय',
    designation: 'Director of Audit',
    designation_hi: 'निदेशक लेखा परीक्षा',
    email: 'dirkp@cag.gov.in',
    phone: '(00-603) 2092 1058',
    photo: 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Mr-Gaurav-Rai-0699d44d41d8106-11260703.jpeg',
    bio: 'Shri Gaurav Rai is a 2014 batch officer of the IA&AS. He has served as Director (Information Systems) and Director (Analytics) at CAG Headquarters.',
    bio_hi: 'श्री गौरव राय आईएएंडएएस के 2014 बैच के अधिकारी हैं। उन्होंने सीएजी मुख्यालय में निदेशक (सूचना प्रणाली) और निदेशक (एनालिटिक्स) के रूप में कार्य किया है।',
    seniority_order: 2,
    display_order: 2,
    status: 1
  },

  // ── Rome Office (ROM Theme) ──
  {
    id: 'rom-1',
    website_id: 'overseas-rome',
    officer_name: 'Shri Deepak Chandra, IA&AS',
    officer_name_hi: 'श्री दीपक चंद्र, आईएएंडएएस',
    designation: 'Director of External Audit (Rome)',
    designation_hi: 'बाह्य लेखा परीक्षा निदेशक (रोम)',
    email: 'dir.rome@cag.gov.in',
    phone: '+39 06 488 4641',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    bio: 'Lead external auditor for UN Food and Agriculture Organization (FAO) and WFP.',
    bio_hi: 'संयुक्त राष्ट्र खाद्य एवं कृषि संगठन (एफएओ) और डब्ल्यूएफपी के लिए प्रमुख बाह्य लेखा परीक्षक।',
    seniority_order: 1,
    display_order: 1,
    status: 1
  },

  // ── Geneva Office (GVA Theme) ──
  {
    id: 'gva-1',
    website_id: 'overseas-geneva',
    officer_name: 'Smt. Sunita Rao, IA&AS',
    officer_name_hi: 'श्रीमती सुनीता राव, आईएएंडएएस',
    designation: 'Director of External Audit (Geneva)',
    designation_hi: 'बाह्य लेखा परीक्षा निदेशक (जिनेवा)',
    email: 'dir.geneva@cag.gov.in',
    phone: '+41 22 906 8681',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Lead external auditor for WHO, ILO, WTO, and UN Geneva specialized agencies.',
    bio_hi: 'डब्ल्यूएचओ, आईएलओ, डब्ल्यूटीओ और संयुक्त राष्ट्र जिनेवा विशेष एजेंसियों के प्रमुख बाह्य लेखा परीक्षक।',
    seniority_order: 1,
    display_order: 1,
    status: 1
  },

  // ── Andhra Pradesh State Office (GSSA / ERSA Theme) ──
  {
    id: 'ap-1',
    website_id: 'andhra-pradesh',
    officer_name: 'Shri K. S. Reddy, IA&AS',
    officer_name_hi: 'श्री के. एस. रेड्डी, आईएएंडएएस',
    designation: 'Principal Accountant General (A&E)',
    designation_hi: 'प्रधान महालेखाकार (लेखा एवं हकदारी)',
    email: 'agaeandhrapradesh@cag.gov.in',
    phone: '+91 866 242 1201',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    bio: 'Head of Department responsible for State Accounts compilation and employee entitlements.',
    bio_hi: 'राज्य लेखा संकलन और कर्मचारी हकदारी के लिए जिम्मेदार विभागाध्यक्ष।',
    seniority_order: 1,
    display_order: 1,
    status: 1
  },
  {
    id: 'ap-2',
    website_id: 'andhra-pradesh',
    officer_name: 'Smt. M. V. Lakshmi, IA&AS',
    officer_name_hi: 'श्रीमती एम. वी. लक्ष्मी, आईएएंडएएस',
    designation: 'Senior Deputy Accountant General (Accounts & VLC)',
    designation_hi: 'वरिष्ठ उप महालेखाकार (लेखा एवं वीएलसी)',
    email: 'dagaccounts.ap@cag.gov.in',
    phone: '+91 866 242 1202',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80',
    bio: 'Managing monthly state accounts compilation and treasury reconciliation.',
    bio_hi: 'मासिक राज्य लेखा संकलन और खजाना समाधान का प्रबंधन।',
    seniority_order: 2,
    display_order: 2,
    status: 1
  },
  {
    id: 'ap-3',
    website_id: 'andhra-pradesh',
    officer_name: 'Shri T. Ramesh Kumar, IA&AS',
    officer_name_hi: 'श्री टी. रमेश कुमार, आईएएंडएएस',
    designation: 'Deputy Accountant General (Pension & Funds)',
    designation_hi: 'उप महालेखाकार (पेंशन एवं निधि)',
    email: 'dagpension.ap@cag.gov.in',
    phone: '+91 866 242 1203',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    bio: 'Supervising state pension authorizations and GPF ledger maintenance.',
    bio_hi: 'राज्य पेंशन प्राधिकरण और जीपीएफ खाता बही रखरखाव का पर्यवेक्षण।',
    seniority_order: 3,
    display_order: 3,
    status: 1
  }
];

export const DEFAULT_RECRUITMENT_RULES: RecruitmentRuleItem[] = [
  {
    id: 'rr-1',
    website_id: 'andhra-pradesh',
    post_name: 'Assistant Audit Officer (AAO) - Cadre Recruitment Rules',
    post_name_hi: 'सहायक लेखा परीक्षा अधिकारी (एएओ) - संवर्ग भर्ती नियम',
    qualification: 'Bachelor\'s Degree from a recognized University with Subordinate Audit/Accounts Service (SAS) Examination clearance.',
    qualification_hi: 'मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री के साथ अधीनस्थ लेखापरीक्षा/लेखा सेवा (एसएएस) परीक्षा उत्तीर्ण।',
    pdf_file: '/assets/sample.pdf',
    file_size: '1.24 MB',
    status: 1
  },
  {
    id: 'rr-2',
    website_id: 'andhra-pradesh',
    post_name: 'Senior Auditor / Senior Accountant - Recruitment Rules',
    post_name_hi: 'वरिष्ठ लेखा परीक्षक / वरिष्ठ लेखाकार - भर्ती नियम',
    qualification: 'Degree of a recognized University or equivalent with 3 years regular service as Auditor/Accountant.',
    qualification_hi: 'मान्यता प्राप्त विश्वविद्यालय की डिग्री या समकक्ष तथा लेखा परीक्षक/लेखाकार के रूप में 3 वर्ष की नियमित सेवा।',
    pdf_file: '/assets/sample.pdf',
    file_size: '980 KB',
    status: 1
  },
  {
    id: 'rr-3',
    website_id: 'andhra-pradesh',
    post_name: 'Auditor / Accountant - Direct Recruitment Regulations',
    post_name_hi: 'लेखा परीक्षक / लेखाकार - सीधी भर्ती विनियम',
    qualification: 'Bachelor\'s Degree in Commerce, Economics, Statistics, or Mathematics from a recognized University.',
    qualification_hi: 'मान्यता प्राप्त विश्वविद्यालय से वाणिज्य, अर्थशास्त्र, सांख्यिकी या गणित में स्नातक डिग्री।',
    pdf_file: '/assets/sample.pdf',
    file_size: '860 KB',
    status: 1
  },
  {
    id: 'rr-4',
    website_id: 'andhra-pradesh',
    post_name: 'Data Entry Operator (DEO Grade-A) - Recruitment Rules',
    post_name_hi: 'डेटा एंट्री ऑपरेटर (डीईओ ग्रेड-ए) - भर्ती नियम',
    qualification: '12th Standard in Science stream with Mathematics from a recognized Board with minimum typing speed criteria.',
    qualification_hi: 'मान्यता प्राप्त बोर्ड से गणित के साथ विज्ञान संकाय में 12वीं कक्षा उत्तीर्ण तथा निर्धारित न्यूनतम टंकण गति।',
    pdf_file: '/assets/sample.pdf',
    file_size: '740 KB',
    status: 1
  },
  {
    id: 'rr-5',
    website_id: 'andhra-pradesh',
    post_name: 'Clerk / Multi-Tasking Staff (MTS) - Service Regulations',
    post_name_hi: 'लिपिक / मल्टी-टास्किंग स्टाफ (एमटीएस) - सेवा विनियम',
    qualification: '10th Standard (Matriculation) or equivalent from a recognized Board.',
    qualification_hi: 'मान्यता प्राप्त बोर्ड से 10वीं कक्षा (मैट्रिक) या समकक्ष।',
    pdf_file: '/assets/sample.pdf',
    file_size: '620 KB',
    status: 1
  }
];

export function getSubsiteOfficeData(slug: string): OverseasOfficeData {
  const normalizedSlug = slug.toLowerCase();
  
  if (OVERSEAS_PORTALS_DATA[normalizedSlug]) {
    return OVERSEAS_PORTALS_DATA[normalizedSlug];
  }

  // Alias maps
  if (normalizedSlug === 'overseas-ldn') return OVERSEAS_PORTALS_DATA['overseas-london'];
  if (normalizedSlug === 'overseas-wdc') return OVERSEAS_PORTALS_DATA['overseas-washington'];
  if (normalizedSlug === 'overseas-kul') return OVERSEAS_PORTALS_DATA['overseas-kualalumpur'];
  if (normalizedSlug === 'overseas-rom') return OVERSEAS_PORTALS_DATA['overseas-rome'];
  if (normalizedSlug === 'overseas-gva') return OVERSEAS_PORTALS_DATA['overseas-geneva'];

  // Default fallback for any state slug
  const title = normalizedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    slug: normalizedSlug,
    theme: normalizedSlug.startsWith('overseas-') ? 'LDN' : 'GSSA',
    officeNameEn: `Office of the Principal Accountant General, ${title}`,
    officeNameHi: `प्रधान महालेखाकार का कार्यालय, ${title}`,
    locationEn: title,
    locationHi: title,
    addressEn: `Office of the Principal Accountant General, ${title}`,
    addressHi: `प्रधान महालेखाकार का कार्यालय, ${title}`,
    officeHoursEn: '09:30 AM - 06:00 PM (Monday - Friday)',
    officeHoursHi: 'प्रातः 09:30 - सायं 06:00 (सोमवार - शुक्रवार)',
    phone: '+91 11 2323 9300',
    email: `ag.${normalizedSlug}@cag.gov.in`,
    obfuscatedEmail: `ag[dot]${normalizedSlug}[at]cag[dot]gov[dot]in`,
    gmapEmbedUrl: `https://maps.google.com/maps?width=700&height=400&hl=en&q=Accountant%20General%20${encodeURIComponent(title)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`,
    gmapQuery: `Accountant General ${title}`,
    externalOfficialUrl: `https://cag.gov.in/ag/${normalizedSlug}/en`,
    themeColor: normalizedSlug.startsWith('overseas-') ? '#1D2E6B' : '#0A3D30',
    mandateEn: `Statutory audit and accounting oversight for public funds and government revenues in ${title}.`,
    mandateHi: `${title} में सार्वजनिक धन और सरकारी राजस्व के लिए वैधानिक लेखापरीक्षा और लेखा निगरानी।`,
    auditScopes: [
      {
        titleEn: 'State Accounts & Financial Compliance',
        titleHi: 'राज्य खाते एवं वित्तीय अनुपालन',
        descEn: 'Compilation of monthly civil accounts and annual audit of state departments.',
        descHi: 'मासिक नागरिक खातों का संकलन और राज्य विभागों की वार्षिक लेखापरीक्षा।'
      }
    ],
    faqs: [
      {
        qEn: `What is the jurisdiction of the ${title} office?`,
        qHi: `${title} कार्यालय का क्षेत्राधिकार क्या है?`,
        aEn: `The office exercises statutory audit and entitlement jurisdiction across the state of ${title}.`,
        aHi: `यह कार्यालय ${title} राज्य में वैधानिक लेखापरीक्षा और हकदारी क्षेत्राधिकार का प्रयोग करता है।`
      }
    ]
  };
}

export function getSubsiteOrgStruct(slug: string): SubsiteOrgStructItem[] {
  const normalizedSlug = slug.toLowerCase();
  const matched = DEFAULT_SUBSITE_ORG_STRUCTS.filter(x => 
    x.website_id === normalizedSlug || 
    (normalizedSlug === 'overseas-ldn' && x.website_id === 'overseas-london') ||
    (normalizedSlug === 'overseas-wdc' && x.website_id === 'overseas-washington') ||
    (normalizedSlug === 'overseas-kul' && x.website_id === 'overseas-kualalumpur') ||
    (normalizedSlug === 'overseas-rom' && x.website_id === 'overseas-rome') ||
    (normalizedSlug === 'overseas-gva' && x.website_id === 'overseas-geneva')
  );

  if (matched.length > 0) {
    return matched.sort((a, b) => (a.seniority_order || 0) - (b.seniority_order || 0));
  }

  // Fallback generic leadership
  const title = normalizedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return [
    {
      id: `${normalizedSlug}-1`,
      website_id: normalizedSlug,
      officer_name: `Principal Accountant General, ${title}`,
      officer_name_hi: `प्रधान महालेखाकार, ${title}`,
      designation: 'Head of Department',
      designation_hi: 'विभागाध्यक्ष',
      email: `ag.${normalizedSlug}@cag.gov.in`,
      phone: '+91 11 2323 9300',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: `Overseeing statutory operations and administration in ${title}.`,
      bio_hi: `${title} में वैधानिक संचालन और प्रशासन की निगरानी।`,
      seniority_order: 1,
      display_order: 1,
      status: 1
    }
  ];
}

export function getSubsiteRecruitmentRules(slug: string): RecruitmentRuleItem[] {
  return DEFAULT_RECRUITMENT_RULES.filter(x => x.status === 1);
}
