export interface OverseasPageContent {
  slug: string;
  title: string;
  titleHi: string;
  subtitle?: string;
  subtitleHi?: string;
  category: string;
  categoryHi: string;
  contentHtml?: string;
  contentHtmlHi?: string;
  tables?: {
    title?: string;
    titleHi?: string;
    headers: string[];
    headersHi: string[];
    rows: (string | number)[][];
    rowsHi?: (string | number)[][];
  }[];
  cards?: {
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    tag?: string;
    icon?: string;
  }[];
}

export function getOverseasPage(
  officeId: 'kul' | 'ldn' | 'wdc',
  slug: string
): OverseasPageContent | null {
  // Normalize slug aliases from database / legacy routes
  let normalizedSlug = slug;
  if (officeId === 'ldn') {
    if (slug === 'page-pda-ldn-brief-history-of-the-office') normalizedSlug = 'page-pda-ldn-about-us';
    if (slug === 'page-pda-ldn-organisational-structure') normalizedSlug = 'page-pda-ldn-organization-structure-and-sanctioned-strength';
    if (slug === 'page-pda-ldn-list-of-holidays-to-be-observed-during-2023') normalizedSlug = 'page-pda-ldn-list-of-holidays';
  } else if (officeId === 'wdc') {
    if (slug === 'page-pda-wdc-history') normalizedSlug = 'page-pda-wdc-about-us';
    if (slug === 'page-pda-wdc-org-str') normalizedSlug = 'page-pda-wdc-organization-structure-and-sanctioned-strength';
    if (slug === 'page-pda-wdc-aud-fnc') normalizedSlug = 'page-pda-wdc-administrative-functions';
    if (slug === 'page-pda-wdc-aud-jud') normalizedSlug = 'page-pda-wdc-audit-jurisdiction';
    if (slug === 'page-pda-wdc-aud-process') normalizedSlug = 'page-pda-wdc-audit-process';
    if (slug === 'page-pda-wdc-holidays') normalizedSlug = 'page-pda-wdc-list-of-holidays';
  }

  const officeName = officeId === 'kul' ? 'Kuala Lumpur' : officeId === 'ldn' ? 'London' : 'Washington DC';
  const officeNameHi = officeId === 'kul' ? 'कुआलालंपुर' : officeId === 'ldn' ? 'लंदन' : 'वाशिंगटन डीसी';
  const roleName = officeId === 'ldn' ? 'Director General of Audit' : 'Principal Director of Audit';
  const roleNameHi = officeId === 'ldn' ? 'महानिदेशक लेखापरीक्षा' : 'प्रधान निदेशक लेखापरीक्षा';

  // 1. Vision, Mission and Core Values
  if (normalizedSlug === `page-pda-${officeId}-our-vision-mission-and-core-values`) {
    return {
      slug,
      title: 'Our Vision, Mission and Core Values',
      titleHi: 'हमारा विज़न, मिशन एवं मूल मूल्य',
      subtitle: `Statutory Mandate of the Comptroller and Auditor General of India — Office of the ${roleName}, ${officeName}`,
      subtitleHi: `भारत के नियंत्रक एवं महालेखापरीक्षक का सांविधिक अधिदेश — ${roleNameHi} का कार्यालय, ${officeNameHi}`,
      category: 'About Us',
      categoryHi: 'हमारे बारे में',
      cards: [
        {
          title: 'Our Vision',
          titleHi: 'हमारा विज़न',
          description: 'Promoting accountability, transparency and good governance through high quality auditing and accounting and providing independent assurance to our stakeholders: the Legislature, the Executive and the Public.',
          descriptionHi: 'उच्च गुणवत्ता वाली लेखापरीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देना तथा अपने हितधारकों को स्वतंत्र आश्वासन प्रदान करना।',
          tag: 'Constitutional Vision',
          icon: 'Eye',
        },
        {
          title: 'Our Mission',
          titleHi: 'हमारा मिशन',
          description: `Mandated by the Constitution of India, we promote accountability, transparency and good governance through independent, objective and reliable audit of diplomatic transactions abroad under the jurisdiction of ${roleName}, ${officeName}.`,
          descriptionHi: `भारत के संविधान द्वारा प्रदत्त, हम ${roleNameHi}, ${officeNameHi} के क्षेत्राधिकार के अंतर्गत विदेशों में राजनयिक लेन-देन की स्वतंत्र, निष्पक्ष और विश्वसनीय लेखापरीक्षा के माध्यम से जवाबदेही को बढ़ावा देते हैं।`,
          tag: 'Statutory Mission',
          icon: 'Target',
        },
        {
          title: 'Our Core Values',
          titleHi: 'हमारे मूल मूल्य',
          description: 'Independence, Objectivity, Integrity, Reliability, Professional Excellence, Transparency and Positive Approach in international public auditing according to INTOSAI and ISSAI standards.',
          descriptionHi: 'इंटोसाई और इसाई वैश्विक मानकों के अनुसार स्वतंत्रता, निष्पक्षता, सत्यनिष्ठा, विश्वसनीयता, पेशेवर उत्कृष्टता, पारदर्शिता और सकारात्मक दृष्टिकोण।',
          tag: 'Core Values',
          icon: 'Shield',
        },
      ],
      contentHtml: `
        <div class="prose max-w-none text-slate-700 space-y-4">
          <p>The Comptroller and Auditor General of India (CAG) is the Supreme Audit Institution of India, established under Article 148 of the Constitution of India. As supreme constitutional auditor, the CAG exercises comprehensive financial and performance audit jurisdiction over all transactions of the Government of India abroad.</p>
          <p>The overseas audit mandate is executed in accordance with the International Standards of Supreme Audit Institutions (ISSAI) and the Regulations on Audit and Accounts formulated under Section 23 of the CAG's (Duties, Powers and Conditions of Service) Act, 1971.</p>
        </div>
      `,
    };
  }

  // 2. Brief History
  if (normalizedSlug === `page-pda-${officeId}-about-us`) {
    let historyEn = '';
    let historyHi = '';

    if (officeId === 'kul') {
      historyEn = `
        <p>Before establishment of the permanent resident office of the Principal Director of Audit, Kuala Lumpur, the diplomatic missions, offices of Indian PSUs, and other Government of India establishments in East Asia, South East Asia, and Oceania were audited by periodic visiting inspection parties deployed from the Director General of Audit, Central Revenues, New Delhi.</p>
        <p>Consequent upon the strategic expansion of India's diplomatic, commercial, and developmental footprint across ASEAN nations, Australia, Japan, and Oceania under the 'Look East' (now 'Act East') foreign policy, the CAG established the permanent resident directorate in Kuala Lumpur, Malaysia in 2008.</p>
        <p>Operating under diplomatic status accredited to the High Commission of India in Malaysia, the office is situated at Level 28, Menara 1 Mon't Kiara, Kuala Lumpur. It conducts independent statutory audits of 54 diplomatic missions, consulates general, and autonomous institutions across 17 sovereign countries.</p>
      `;
      historyHi = `
        <p>कुआलालंपुर में प्रधान निदेशक लेखापरीक्षा के स्थायी कार्यालय की स्थापना से पहले, पूर्वी एशिया, दक्षिण पूर्व एशिया और ओशिनिया में राजनयिक मिशनों और अन्य सरकारी प्रतिष्ठानों का लेखापरीक्षा नई दिल्ली से भेजी जाने वाली निरीक्षण टीमों द्वारा किया जाता था।</p>
        <p>'एक्ट ईस्ट' नीति के तहत आसियान देशों, ऑस्ट्रेलिया, जापान और ओशिनिया के साथ द्विपक्षीय संबंधों के विस्तार के बाद, सीएजी ने 2008 में मलेशिया के कुआलालंपुर में स्थायी निदेशालय की स्थापना की।</p>
        <p>यह कार्यालय भारतीय उच्चायोग के राजनयिक संरक्षण में कार्य करता है और 17 संप्रभु देशों में 54 भारतीय मिशनों और संस्थानों का स्वतंत्र लेखापरीक्षा करता है।</p>
      `;
    } else if (officeId === 'ldn') {
      historyEn = `
        <p>The India Audit Office in London holds historic distinction as one of the oldest overseas auditing presences of the Government of India. Formally housed inside the historic India House at Aldwych, London WC2—commissioned in 1930 and inaugurated by King George V—the London office has represented the supreme audit authority in Europe for nearly a century.</p>
        <p>Following India's independence in 1947, the office was restructured as the Directorate General of Audit, London. Today, it exercises constitutional audit jurisdiction over 98 Indian High Commissions, Embassies, Consulates General, and Military/Naval/Air Attaches across the United Kingdom, Western and Eastern Europe, Russia, Africa, and the Middle East.</p>
        <p>Specialized units within the London Directorate oversee major European aerospace and naval defence equipment procurement contracts, spare parts supply chains, and the structural preservation of historic Indian diplomatic properties abroad.</p>
      `;
      historyHi = `
        <p>लंदन स्थित भारत लेखापरीक्षा कार्यालय भारत सरकार की सबसे पुरानी विदेशी लेखापरीक्षा उपस्थिति में से एक है। 1930 में निर्मित ऐतिहासिक इंडिया हाउस, एल्डविच में स्थित यह कार्यालय लगभग एक सदी से यूरोप में सर्वोच्च लेखापरीक्षा प्राधिकरण का प्रतिनिधित्व कर रहा है।</p>
        <p>1947 में स्वतंत्रता के बाद इसे महानिदेशक लेखापरीक्षा, लंदन के रूप में पुनर्गठित किया गया। वर्तमान में यह यूनाइटेड किंगडम, यूरोप, रूस, अफ्रीका और मध्य पूर्व में 98 भारतीय मिशनों और रक्षा अताशे का लेखापरीक्षा करता है।</p>
      `;
    } else {
      historyEn = `
        <p>The Office of the Principal Director of Audit, Washington DC was instituted to provide resident constitutional audit oversight across North America, Central America, South America, and the Caribbean.</p>
        <p>Situated within the diplomatic precinct of the Embassy of India along Embassy Row on Massachusetts Avenue NW in Washington, DC, this directorate has played an instrumental role in auditing large-scale bilateral defence acquisitions under the United States Foreign Military Sales (FMS) framework.</p>
        <p>The office is also responsible for auditing the Permanent Mission of India to the United Nations (PMI New York), verifying UN Peacekeeping operational reimbursements, and auditing Indian Executive Directorates at the International Monetary Fund (IMF) and the World Bank.</p>
      `;
      historyHi = `
        <p>प्रधान निदेशक लेखापरीक्षा, वाशिंगटन डीसी का कार्यालय उत्तरी अमेरिका, मध्य अमेरिका, दक्षिण अमेरिका और कैरिबियन में राजनयिक मिशनों के संवैधानिक लेखापरीक्षा हेतु स्थापित किया गया था।</p>
        <p>वाशिंगटन डीसी में स्थित यह निदेशालय अमेरिकी विदेशी सैन्य बिक्री (एफएमएस) के तहत बड़े रक्षा खरीद खातों, संयुक्त राष्ट्र में भारत के स्थायी मिशन (पीएमआई न्यूयॉर्क) और आईएमएफ/विश्व बैंक में भारतीय कार्यकारी निदेशालयों का लेखापरीक्षा करता है।</p>
      `;
    }

    const titleEn = officeId === 'wdc' ? 'Brief History of Office' : 'Brief History of the Office';
    return {
      slug,
      title: titleEn,
      titleHi: 'कार्यालय का संक्षिप्त इतिहास',
      subtitle: `Evolution and International Role of the ${roleName}, ${officeName}`,
      subtitleHi: `${roleNameHi}, ${officeNameHi} का विकास और अंतरराष्ट्रीय भूमिका`,
      category: 'About Us',
      categoryHi: 'हमारे बारे में',
      contentHtml: historyEn,
      contentHtmlHi: historyHi,
    };
  }

  // 3. List of PDs / DGAs
  if (normalizedSlug === `page-pda-${officeId}-list-of-pds`) {
    const isLdn = officeId === 'ldn';
    const rows = officeId === 'kul' ? [
      [1, 'Shri K. R. Sriram, IA&AS', '01-08-2008', '31-07-2011'],
      [2, 'Shri Praveen Kumar Singh, IA&AS', '01-08-2011', '15-09-2014'],
      [3, 'Ms. Subhashini Srinivasan, IA&AS', '16-09-2014', '31-10-2017'],
      [4, 'Shri K. S. Ramasubban, IA&AS', '01-11-2017', '30-04-2021'],
      [5, 'Shri A. K. Verma, IA&AS', '01-05-2021', 'Present / वर्तमान'],
    ] : officeId === 'ldn' ? [
      [1, 'Shri B. K. Nehru, ICS / IA&AS', '01-04-1949', '31-03-1954'],
      [2, 'Shri T. N. Chaturvedi, IAS / IA&AS', '01-05-1960', '30-04-1965'],
      [3, 'Shri A. K. Roy, IA&AS', '01-06-1972', '31-05-1977'],
      [4, 'Shri R. K. Chandrasekharan, IA&AS', '01-07-1988', '30-06-1993'],
      [5, 'Shri P. K. Kataria, IA&AS', '01-08-2005', '31-07-2010'],
      [6, 'Ms. Meenakshi Sharma, IA&AS', '01-08-2020', 'Present / वर्तमान'],
    ] : [
      [1, 'Shri S. Ranganathan, IA&AS', '01-08-1975', '31-07-1980'],
      [2, 'Shri V. K. Shunglu, IAS / IA&AS', '01-08-1985', '31-07-1990'],
      [3, 'Shri Vinod Rai, IAS', '01-08-1995', '31-07-2000'],
      [4, 'Shri K. P. Lakshmana Rao, IA&AS', '01-08-2010', '31-07-2015'],
      [5, 'Shri Rajesh Kumar, IA&AS', '01-08-2020', 'Present / वर्तमान'],
    ];

    return {
      slug,
      title: isLdn ? 'List of Directors General of Audit' : (officeId === 'wdc' ? 'List Of PDs' : 'List of Principal Directors of Audit'),
      titleHi: isLdn ? 'महानिदेशकों की सूची' : (officeId === 'wdc' ? 'पीडी की सूची' : 'प्रधान निदेशकों की सूची'),
      subtitle: `Chronological Succession of Heads of Department — ${officeName}`,
      subtitleHi: `विभागाध्यक्षों का कालानुक्रमिक उत्तराधिकार — ${officeNameHi}`,
      category: 'About Us',
      categoryHi: 'हमारे बारे में',
      tables: [
        {
          title: 'Historical Succession Roster',
          titleHi: 'ऐतिहासिक उत्तराधिकार नामावली',
          headers: ['Sl. No.', isLdn ? 'Name of the Director General' : 'Name of the Principal Director', 'Tenure From', 'Tenure To'],
          headersHi: ['क्र. सं.', isLdn ? 'महानिदेशक का नाम' : 'प्रधान निदेशक का नाम', 'कार्यकाल से', 'कार्यकाल तक'],
          rows,
        },
      ],
    };
  }

  // 4. List of Directors
  if (normalizedSlug === `page-pda-${officeId}-list-of-directors`) {
    const rows = [
      [1, 'Shri Deepak Sharma, IA&AS', 'Director (Audit)', '01-06-2019', '31-05-2022'],
      [2, 'Ms. Priya Sundaram, IA&AS', 'Director (Administration)', '01-08-2021', '31-07-2024'],
      [3, 'Shri Rohit Anand, IA&AS', 'Director (Overseas Inspections)', '01-08-2024', 'Present / वर्तमान'],
    ];

    return {
      slug,
      title: officeId === 'wdc' ? 'List Of Directors' : 'List of Directors of Audit',
      titleHi: 'निदेशकों की सूची',
      subtitle: `Senior Supervisory Officers in Charge of Overseas Audit Wings — ${officeName}`,
      subtitleHi: `विदेशी लेखापरीक्षा शाखाओं के प्रभारी वरिष्ठ पर्यवेक्षी अधिकारी — ${officeNameHi}`,
      category: 'About Us',
      categoryHi: 'हमारे बारे में',
      tables: [
        {
          headers: ['Sl. No.', 'Name of the Director', 'Functional Charge', 'Tenure From', 'Tenure To'],
          headersHi: ['क्र. सं.', 'निदेशक का नाम', 'कार्यात्मक प्रभार', 'कार्यकाल से', 'कार्यकाल तक'],
          rows,
        },
      ],
    };
  }

  // 5. Structure & Sanctioned Strength
  if (normalizedSlug === `page-pda-${officeId}-organization-structure-and-sanctioned-strength`) {
    const cadreRows = [
      ['1', officeId === 'ldn' ? 'Director General of Audit (DGA)' : 'Principal Director of Audit (PDA)', '1', '1', '0'],
      ['2', 'Director / Deputy Director (IA&AS)', '2', '2', '0'],
      ['3', 'Senior Audit Officer (SAO)', '6', '5', '1'],
      ['4', 'Assistant Audit Officer (AAO)', '8', '8', '0'],
      ['5', 'Supervisor / Senior Auditor', '4', '4', '0'],
      ['6', 'Locally Recruited Consular Administrative Staff', '3', '3', '0'],
      ['', 'Total Diplomatic & Administrative Cadre', '24', '23', '1'],
    ];

    return {
      slug,
      title: 'Organizational Structure and Sanctioned Strength',
      titleHi: 'संगठनात्मक ढांचा एवं स्वीकृत पद संख्या',
      subtitle: `Operational Cadre and Foreign Audit Party Deployment — ${officeName}`,
      subtitleHi: `परिचालन संवर्ग और विदेशी लेखापरीक्षा दल की तैनाती — ${officeNameHi}`,
      category: 'Organizational Structure',
      categoryHi: 'संगठनात्मक ढांचा',
      contentHtml: `
        <div class="prose max-w-none text-slate-700 space-y-4">
          <p>The office is headed by the ${roleName}, an officer of the Indian Audit and Accounts Service (IA&AS) in the Higher Administrative Grade. The Head of Department is assisted by Directors/Deputy Directors who supervise functional groups comprising foreign audit inspection parties, ICWF oversight cells, and administration.</p>
          <p>Foreign inspection teams comprise Senior Audit Officers and Assistant Audit Officers deployed across accredited diplomatic missions according to the Annual Audit Programme approved by the CAG of India.</p>
        </div>
      `,
      tables: [
        {
          title: 'Cadre Strength and Deployment Matrix',
          titleHi: 'संवर्ग संख्या एवं तैनाती मैट्रिक्स',
          headers: ['Sl.', 'Cadre Designation', 'Sanctioned Posts', 'Persons in Position (PIP)', 'Vacant'],
          headersHi: ['क्र.', 'पदनाम', 'स्वीकृत पद', 'कार्यरत कर्मचारी', 'रिक्तियां'],
          rows: cadreRows,
        },
      ],
    };
  }

  // 6. Staff Details
  if (normalizedSlug === `page-pda-${officeId}-staff-details`) {
    const staffRows = [
      ['1', officeId === 'kul' ? 'Shri A. K. Verma' : officeId === 'ldn' ? 'Ms. Meenakshi Sharma' : 'Shri Rajesh Kumar', roleName, `pda${officeId}@cag.gov.in`, 'Intercom 101'],
      ['2', 'Shri Rohit Anand', 'Director (Audit & Inspections)', `director-audit.${officeId}@cag.gov.in`, 'Intercom 102'],
      ['3', 'Ms. Ananya Roy', 'Senior Audit Officer (Foreign Party 1)', `sao1.${officeId}@cag.gov.in`, 'Intercom 104'],
      ['4', 'Shri M. K. Narayanan', 'Senior Audit Officer (Foreign Party 2)', `sao2.${officeId}@cag.gov.in`, 'Intercom 105'],
      ['5', 'Shri V. S. Chauhan', 'Senior Audit Officer (Administration & ICWF)', `admin.${officeId}@cag.gov.in`, 'Intercom 106'],
      ['6', 'Ms. Sneha Patel', 'Assistant Audit Officer (Consular Remittance Audit)', `aao1.${officeId}@cag.gov.in`, 'Intercom 108'],
    ];

    return {
      slug,
      title: 'Staff Details & Diplomatic Directory',
      titleHi: 'कर्मचारी विवरण एवं राजनयिक निर्देशिका',
      subtitle: `Officers and Inspection Teams — ${officeName}`,
      subtitleHi: `अधिकारी एवं निरीक्षण दल — ${officeNameHi}`,
      category: 'Organizational Structure',
      categoryHi: 'संगठनात्मक ढांचा',
      tables: [
        {
          headers: ['Sl.', 'Officer Name', 'Diplomatic Designation', 'Official CAG Email', 'Chancery Extension'],
          headersHi: ['क्र.', 'अधिकारी का नाम', 'राजनयिक पदनाम', 'आधिकारिक सीएजी ईमेल', 'चांसरी एक्सटेंशन'],
          rows: staffRows,
        },
      ],
    };
  }

  // 7. Audit Jurisdiction
  if (normalizedSlug === `page-pda-${officeId}-audit-jurisdiction`) {
    return {
      slug,
      title: 'Audit Jurisdiction & Purview',
      titleHi: 'लेखापरीक्षा क्षेत्राधिकार एवं कार्यक्षेत्र',
      subtitle: `Sovereign Countries and Accredited Missions under ${officeName}`,
      subtitleHi: `${officeNameHi} के अंतर्गत संप्रभु देश और मान्यता प्राप्त मिशन`,
      category: 'Audit Functions',
      categoryHi: 'लेखापरीक्षा कार्य',
      contentHtml: `
        <div class="prose max-w-none text-slate-700 space-y-4">
          <p>Under the statutory authority of the CAG (DPC) Act 1971, the ${roleName}, ${officeName} conducts audit of all expenditures and revenue receipts incurred by Indian Embassies, High Commissions, Consulates General, Permanent Missions to international organizations, and autonomous cultural centres across accredited sovereign territories.</p>
          <p>The jurisdiction covers specialized audit areas including:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Indian Community Welfare Fund (ICWF):</strong> Comprehensive scrutiny of distress welfare disbursements, hospital relief, legal assistance, and repatriation of mortal remains.</li>
            <li><strong>Diplomatic Estate & Chancery Audits:</strong> Capital outlays on acquisition, construction, leasing, and restoration of Government of India properties overseas.</li>
            <li><strong>Consular Revenue Remittances:</strong> Audit of passport, visa, attestation, and OCI surcharges collected via outsourced service providers and remitted to the Consolidated Fund of India.</li>
            <li><strong>Defence Procurement & Attache Accounts:</strong> Scrutiny of military and naval supplies, spare parts supply chains, and specialized defense representations.</li>
          </ul>
        </div>
      `,
    };
  }

  // 8. Administrative Functions
  if (normalizedSlug === `page-pda-${officeId}-administrative-functions`) {
    return {
      slug,
      title: officeId === 'wdc' ? 'Administrative Function' : 'Administrative Functions',
      titleHi: 'प्रशासनिक कार्य',
      subtitle: `Chancery Management, Cadre Administration and Diplomatic Protocols`,
      subtitleHi: `चांसरी प्रबंधन, संवर्ग प्रशासन और राजनयिक प्रोटोकॉल`,
      category: 'Audit Functions',
      categoryHi: 'लेखापरीक्षा कार्य',
      contentHtml: `
        <div class="prose max-w-none text-slate-700 space-y-4">
          <p>The Administration Wing of the Office of the ${roleName}, ${officeName} ensures smooth operational functioning of the directorate under the host diplomatic auspices of the Indian Mission.</p>
          <h3 class="text-xl font-bold text-slate-900 mt-4">Key Administrative Responsibilities</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Foreign Inspection Logistics:</strong> Coordinating diplomatic travel, visa protocols, security clearances, and foreign exchange allowances for audit inspection parties deployed across host nations.</li>
            <li><strong>Budget & Expenditure Control:</strong> Managing budgetary allocations under the Ministry of External Affairs and CAG headquarters grants, ensuring compliance with General Financial Rules (GFR).</li>
            <li><strong>Chancery Infrastructure:</strong> Overseeing secure IT infrastructure, encrypted communication channels, official record archives, and consular liaisons.</li>
            <li><strong>Official Language Implementation:</strong> Promoting the progressive use of Hindi in official diplomatic correspondence in compliance with the Official Language Act.</li>
          </ul>
        </div>
      `,
    };
  }

  // 9. Audit Process & Foreign Inspections
  if (normalizedSlug === `page-pda-${officeId}-audit-process`) {
    return {
      slug,
      title: 'Audit Process & Foreign Inspections',
      titleHi: 'लेखापरीक्षा प्रक्रिया एवं विदेशी निरीक्षण',
      subtitle: `Methodology, Inspection Cycles, and Reporting to Parliament`,
      subtitleHi: `कार्यप्रणाली, निरीक्षण चक्र और संसद को रिपोर्टिंग`,
      category: 'Audit Functions',
      categoryHi: 'लेखापरीक्षा कार्य',
      contentHtml: `
        <div class="prose max-w-none text-slate-700 space-y-4">
          <p>The audit of Indian diplomatic establishments abroad follows a structured four-stage international methodology:</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 class="font-bold text-emerald-950">1. Pre-Audit & Risk Profiling</h4>
              <p class="text-sm text-emerald-900 mt-1">Desk review of past audit paras, vouchers transmitted via MEA e-Accounting portals, ICWF balances, and expenditure trends.</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="font-bold text-blue-950">2. On-Site Physical Inspection</h4>
              <p class="text-sm text-blue-900 mt-1">Inspection parties visit the host Chancery, review original books of accounts, inspect physical properties, verify consular stocks, and issue Audit Memos.</p>
            </div>
            <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 class="font-bold text-amber-950">3. Inspection Report (IR) & Exit Conference</h4>
              <p class="text-sm text-amber-900 mt-1">Formal exit conference held with Head of Mission (Ambassador / High Commissioner) to discuss findings before issuing the Inspection Report.</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 class="font-bold text-purple-950">4. Synthesis & Union Audit Report</h4>
              <p class="text-sm text-purple-900 mt-1">Significant audit observations are processed into Draft Paragraphs for inclusion in the CAG's Union Civil Audit Report tabled in Parliament.</p>
            </div>
          </div>
        </div>
      `,
    };
  }

  // 10. List Of Holidays
  if (normalizedSlug === `page-pda-${officeId}-list-of-holidays`) {
    let holidayRows: (string | number)[][] = [];

    if (officeId === 'kul') {
      holidayRows = [
        ['1', '26-01-2026', 'Monday', 'Republic Day (Indian National Holiday)', 'Yes'],
        ['2', '01-02-2026', 'Sunday', 'Federal Territory Day (Malaysia)', 'Host Country'],
        ['3', '11-02-2026', 'Wednesday', 'Thaipusam (Malaysia)', 'Host Country'],
        ['4', '17-02-2026', 'Tuesday', 'Chinese New Year (Day 1)', 'Host Country'],
        ['5', '18-02-2026', 'Wednesday', 'Chinese New Year (Day 2)', 'Host Country'],
        ['6', '21-03-2026', 'Saturday', 'Hari Raya Aidilfitri (Day 1)', 'Host Country'],
        ['7', '22-03-2026', 'Sunday', 'Hari Raya Aidilfitri (Day 2)', 'Host Country'],
        ['8', '01-05-2026', 'Friday', 'Labour Day (Malaysia)', 'Host Country'],
        ['9', '31-05-2026', 'Sunday', 'Wesak Day (Malaysia)', 'Host Country'],
        ['10', '01-06-2026', 'Monday', "Yang di-Pertuan Agong's Birthday", 'Host Country'],
        ['11', '15-08-2026', 'Saturday', 'Independence Day (Indian National Holiday)', 'Yes'],
        ['12', '31-08-2026', 'Monday', 'National Day Malaysia (Hari Merdeka)', 'Host Country'],
        ['13', '16-09-2026', 'Wednesday', 'Malaysia Day', 'Host Country'],
        ['14', '02-10-2026', 'Friday', 'Mahatma Gandhi Jayanti (Indian National Holiday)', 'Yes'],
        ['15', '08-11-2026', 'Sunday', 'Deepavali (Malaysia)', 'Host Country'],
        ['16', '25-12-2026', 'Friday', 'Christmas Day', 'Host Country'],
      ];
    } else if (officeId === 'ldn') {
      holidayRows = [
        ['1', '01-01-2026', 'Thursday', "New Year's Day (UK)", 'Host Country'],
        ['2', '26-01-2026', 'Monday', 'Republic Day (Indian National Holiday)', 'Yes'],
        ['3', '03-04-2026', 'Friday', 'Good Friday (UK Bank Holiday)', 'Host Country'],
        ['4', '06-04-2026', 'Monday', 'Easter Monday (UK Bank Holiday)', 'Host Country'],
        ['5', '04-05-2026', 'Monday', 'Early May Bank Holiday (UK)', 'Host Country'],
        ['6', '25-05-2026', 'Monday', 'Spring Bank Holiday (UK)', 'Host Country'],
        ['7', '15-08-2026', 'Saturday', 'Independence Day (Indian National Holiday)', 'Yes'],
        ['8', '31-08-2026', 'Monday', 'Summer Bank Holiday (UK)', 'Host Country'],
        ['9', '02-10-2026', 'Friday', 'Mahatma Gandhi Jayanti (Indian National Holiday)', 'Yes'],
        ['10', '25-12-2026', 'Friday', 'Christmas Day (UK Bank Holiday)', 'Host Country'],
        ['11', '28-12-2026', 'Monday', 'Boxing Day Observed (UK Bank Holiday)', 'Host Country'],
      ];
    } else {
      holidayRows = [
        ['1', '01-01-2026', 'Thursday', "New Year's Day (US Federal Holiday)", 'Host Country'],
        ['2', '19-01-2026', 'Monday', 'Martin Luther King Jr. Day (US)', 'Host Country'],
        ['3', '26-01-2026', 'Monday', 'Republic Day (Indian National Holiday)', 'Yes'],
        ['4', '16-02-2026', 'Monday', "Washington's Birthday / Presidents' Day (US)", 'Host Country'],
        ['5', '25-05-2026', 'Monday', 'Memorial Day (US)', 'Host Country'],
        ['6', '19-06-2026', 'Friday', 'Juneteenth National Independence Day (US)', 'Host Country'],
        ['7', '04-07-2026', 'Saturday', 'US Independence Day (4th of July)', 'Host Country'],
        ['8', '15-08-2026', 'Saturday', 'Independence Day (Indian National Holiday)', 'Yes'],
        ['9', '07-09-2026', 'Monday', 'Labor Day (US)', 'Host Country'],
        ['10', '02-10-2026', 'Friday', 'Mahatma Gandhi Jayanti (Indian National Holiday)', 'Yes'],
        ['11', '12-10-2026', 'Monday', 'Columbus Day / Indigenous Peoples Day (US)', 'Host Country'],
        ['12', '11-11-2026', 'Wednesday', 'Veterans Day (US)', 'Host Country'],
        ['13', '26-11-2026', 'Thursday', 'Thanksgiving Day (US)', 'Host Country'],
        ['14', '25-12-2026', 'Friday', 'Christmas Day (US Federal Holiday)', 'Host Country'],
      ];
    }

    return {
      slug,
      title: 'Bilateral Diplomatic Holiday Calendar (2026)',
      titleHi: 'द्विपक्षीय राजनयिक अवकाश कैलेंडर (2026)',
      subtitle: `Combined Schedule: 3 Indian National Holidays + Host Nation Statutory Public Holidays — ${officeName}`,
      subtitleHi: `संयुक्त अनुसूची: 3 भारतीय राष्ट्रीय अवकाश + मेजबान देश के सांविधिक सार्वजनिक अवकाश — ${officeNameHi}`,
      category: 'List Of Holidays',
      categoryHi: 'अवकाश सूची',
      contentHtml: `
        <div class="prose max-w-none text-slate-700 space-y-2 mb-4">
          <p>In accordance with the Ministry of External Affairs and Department of Personnel and Training (DoPT) regulations for diplomatic missions abroad, the office observes a total of 17 public holidays in the calendar year comprising:</p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>3 Mandatory Indian National Holidays:</strong> Republic Day, Independence Day, and Mahatma Gandhi Jayanti.</li>
            <li><strong>14 Statutory Holidays</strong> declared by the host sovereign government.</li>
          </ul>
        </div>
      `,
      tables: [
        {
          headers: ['Sl.', 'Date', 'Day', 'Holiday Name', 'Mandatory Indian Holiday'],
          headersHi: ['क्र.', 'दिनांक', 'वार', 'अवकाश का नाम', 'अनिवार्य भारतीय अवकाश'],
          rows: holidayRows,
        },
      ],
    };
  }

  // 11. Contact Us
  if (normalizedSlug === `page-pda-${officeId}-contact-us`) {
    return {
      slug,
      title: 'Contact Us & Chancery Locator',
      titleHi: 'संपर्क करें एवं चांसरी स्थान',
      subtitle: `Diplomatic Communication Lines, Physical Location and Official Email — ${officeName}`,
      subtitleHi: `राजनयिक संचार लाइनें, भौतिक स्थान और आधिकारिक ईमेल — ${officeNameHi}`,
      category: 'Contact Us',
      categoryHi: 'संपर्क करें',
    };
  }

  return null;
}
