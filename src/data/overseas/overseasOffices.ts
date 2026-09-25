export interface OverseasOffice {
  id: 'kul' | 'ldn' | 'wdc';
  websiteId: number;
  departmentId: number;
  theme: 'KUL' | 'LDN' | 'WDC';
  title: string;
  titleHi: string;
  shortTitle: string;
  shortTitleHi: string;
  headRole: string;
  headRoleHi: string;
  currentHead: string;
  currentHeadHi: string;
  address: string;
  addressHi: string;
  hostCity: string;
  hostCountry: string;
  phone: string;
  email: string;
  jurisdiction: string;
  jurisdictionHi: string;
  accreditedCountries: string[];
  chanceryPropertyStatus: string;
  stats: {
    missionsCount: number;
    countriesCount: number;
    inspectionCycle: string;
    specializedOversight: string;
  };
  specializedDomains: {
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
  }[];
  mapCoordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
}

export const OVERSEAS_OFFICES: Record<'kul' | 'ldn' | 'wdc', OverseasOffice> = {
  kul: {
    id: 'kul',
    websiteId: 144,
    departmentId: 13,
    theme: 'KUL',
    title: 'Principal Director of Audit, Kuala Lumpur',
    titleHi: 'प्रधान निदेशक लेखापरीक्षा, कुआलालंपुर',
    shortTitle: 'PDA Kuala Lumpur',
    shortTitleHi: 'प्र.नि.ले. कुआलालंपुर',
    headRole: 'Principal Director of Audit',
    headRoleHi: 'प्रधान निदेशक लेखापरीक्षा',
    currentHead: 'Shri A. K. Verma, IA&AS',
    currentHeadHi: 'श्री ए. के. वर्मा, भा.ले.एवं ले.से.',
    address: "Level 28, Menara 1 Mon't Kiara, No. 1, Jalan Kiara, Mont Kiara, 50480 Kuala Lumpur, Malaysia",
    addressHi: 'लेवल 28, मेनारा 1 मॉन्ट कियारा, नंबर 1, जालान कियारा, मॉन्ट कियारा, 50480 कुआलालंपुर, मलेशिया',
    hostCity: 'Kuala Lumpur',
    hostCountry: 'Malaysia',
    phone: '+60-3-6205 2340 / 2341',
    email: 'pdakul@cag.gov.in',
    jurisdiction: '54 Indian Diplomatic Missions, Consulates General, and Assistant High Commissions across Southeast Asia, East Asia, Australasia, and Oceania.',
    jurisdictionHi: 'दक्षिण-पूर्व एशिया, पूर्व एशिया, ऑस्ट्रेलेशिया और ओशिनिया में 54 भारतीय राजनयिक मिशन, महावाणिज्य दूतावास और सहायक उच्चायोग।',
    accreditedCountries: [
      'Malaysia', 'Singapore', 'Indonesia', 'Thailand', 'Vietnam',
      'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Brunei',
      'Japan', 'South Korea', 'China', 'Australia', 'New Zealand',
      'Fiji', 'Papua New Guinea'
    ],
    chanceryPropertyStatus: 'Chancery at High Commission of India, Mont Kiara',
    stats: {
      missionsCount: 54,
      countriesCount: 17,
      inspectionCycle: 'Annual / Biennial',
      specializedOversight: 'Act East Grants & ICWF Oversight'
    },
    specializedDomains: [
      {
        title: 'Indian Community Welfare Fund (ICWF)',
        titleHi: 'भारतीय समुदाय कल्याण कोष (आईसीडब्ल्यूएफ)',
        description: 'Statutory scrutiny of emergency distress welfare funds, medical aid, and repatriation of Indian nationals.',
        descriptionHi: 'आपातकालीन संकट कल्याण निधि, चिकित्सा सहायता और भारतीय नागरिकों के प्रत्यावर्तन की सांविधिक जांच।'
      },
      {
        title: 'Act East Bilateral Grants & Aid',
        titleHi: 'एक्ट ईस्ट द्विपक्षीय अनुदान एवं सहायता',
        description: 'Audit verification of developmental assistance, Mekong-Ganga projects, and ASEAN cooperation grants.',
        descriptionHi: 'विकासात्मक सहायता, मेकांग-गंगा परियोजनाओं और आसियान सहयोग अनुदानों का लेखापरीक्षा सत्यापन।'
      },
      {
        title: 'High-Volume Consular Revenue Controls',
        titleHi: 'उच्च मात्रा कांसुलर राजस्व नियंत्रण',
        description: 'Reconciliation of visa, passport, and OCI fee remittances from key hubs like Singapore, Sydney, and Tokyo.',
        descriptionHi: 'सिंगापुर, सिडनी और टोक्यो जैसे प्रमुख केंद्रों से वीज़ा, पासपोर्ट और ओसीआई शुल्क प्रेषण का समाधान।'
      },
      {
        title: 'Chancery Real Estate Appraisals',
        titleHi: 'चांसरी अचल संपत्ति मूल्यांकन',
        description: 'Economic assessment of lease vs. acquisition and capital works across Asia-Pacific capitals.',
        descriptionHi: 'एशिया-प्रशांत की राजधानियों में पट्टे बनाम खरीद और पूंजीगत कार्यों का आर्थिक मूल्यांकन।'
      }
    ],
    mapCoordinates: {
      lat: 3.1678,
      lng: 101.6525,
      zoom: 15
    }
  },

  ldn: {
    id: 'ldn',
    websiteId: 143,
    departmentId: 12,
    theme: 'LDN',
    title: 'Office of the Director General of Audit, London',
    titleHi: 'महानिदेशक लेखापरीक्षा का कार्यालय, लंदन',
    shortTitle: 'DGA London',
    shortTitleHi: 'म.नि.ले. लंदन',
    headRole: 'Director General of Audit',
    headRoleHi: 'महानिदेशक लेखापरीक्षा',
    currentHead: 'Ms. Meenakshi Sharma, IA&AS',
    currentHeadHi: 'सुश्री मीनाक्षी शर्मा, भा.ले.एवं ले.से.',
    address: 'High Commission of India, India House, Aldwych, London WC2B 4NA, United Kingdom',
    addressHi: 'भारतीय उच्चायोग, इंडिया हाउस, एल्डविच, लंदन WC2B 4NA, यूनाइटेड किंगडम',
    hostCity: 'London',
    hostCountry: 'United Kingdom',
    phone: '+44 20 7836 0680',
    email: 'pdalondon@cag.gov.in',
    jurisdiction: '98 Indian High Commissions, Embassies, Consulates General, and Military/Naval/Air Attaches across the United Kingdom, Europe, Africa, and Middle East.',
    jurisdictionHi: 'यूनाइटेड किंगडम, यूरोप, अफ्रीका और मध्य पूर्व में 98 भारतीय उच्चायोग, दूतावास, महावाणिज्य दूतावास और रक्षा/नौसेना/वायु अताशे।',
    accreditedCountries: [
      'United Kingdom', 'France', 'Germany', 'Italy', 'Spain',
      'Russia', 'Switzerland', 'Belgium', 'Netherlands', 'Sweden',
      'Norway', 'South Africa', 'Kenya', 'Egypt', 'Nigeria',
      'Saudi Arabia', 'United Arab Emirates'
    ],
    chanceryPropertyStatus: 'Historic India House (Heritage Estate, Aldwych)',
    stats: {
      missionsCount: 98,
      countriesCount: 45,
      inspectionCycle: 'Annual / Biennial',
      specializedOversight: 'Defence Procurement & India House Heritage'
    },
    specializedDomains: [
      {
        title: 'Historic India House Heritage Stewardship',
        titleHi: 'ऐतिहासिक इंडिया हाउस विरासत प्रबंधन',
        description: 'Audit of conservation, refurbishment, and structural capital outlays for the historic 1930 Aldwych estate.',
        descriptionHi: 'ऐतिहासिक 1930 एल्डविच संपदा के संरक्षण, नवीनीकरण और संरचनात्मक पूंजीगत परिव्यय का लेखापरीक्षा।'
      },
      {
        title: 'Ministry of Defence Procurement Cell',
        titleHi: 'रक्षा मंत्रालय खरीद प्रकोष्ठ',
        description: 'Inspection of military equipment spare parts supply chains, European aerospace contracts, and Attache accounts.',
        descriptionHi: 'सैन्य उपकरण स्पेयर पार्ट्स आपूर्ति श्रृंखला, यूरोपीय एयरोस्पेस अनुबंध और अताशे खातों का निरीक्षण।'
      },
      {
        title: 'European & African Mission Audits',
        titleHi: 'यूरोपीय एवं अफ्रीकी मिशन लेखापरीक्षा',
        description: 'Comprehensive financial oversight of bilateral grants, Lines of Credit in Africa, and multilateral missions.',
        descriptionHi: 'द्विपक्षीय अनुदान, अफ्रीका में ऋण रेखा (एलओसी) और बहुपक्षीय मिशनों की व्यापक वित्तीय निगरानी।'
      },
      {
        title: 'Nehru Centre & ICCR Cultural Wings',
        titleHi: 'नेहरू केंद्र एवं आईसीसीआर सांस्कृतिक विंग',
        description: 'Scrutiny of premier international cultural representations, academic chairs, and diaspora cultural festivals.',
        descriptionHi: 'प्रमुख अंतरराष्ट्रीय सांस्कृतिक प्रतिनिधित्व, शैक्षणिक पीठों और प्रवासी सांस्कृतिक उत्सवों की जांच।'
      }
    ],
    mapCoordinates: {
      lat: 51.5126,
      lng: -0.1182,
      zoom: 16
    }
  },

  wdc: {
    id: 'wdc',
    websiteId: 148,
    departmentId: 13,
    theme: 'WDC',
    title: 'Principal Director of Audit, Washington DC',
    titleHi: 'प्रधान निदेशक लेखापरीक्षा, वाशिंगटन डीसी',
    shortTitle: 'PDA Washington DC',
    shortTitleHi: 'प्र.नि.ले. वाशिंगटन डीसी',
    headRole: 'Principal Director of Audit',
    headRoleHi: 'प्रधान निदेशक लेखापरीक्षा',
    currentHead: 'Shri Rajesh Kumar, IA&AS',
    currentHeadHi: 'श्री राजेश कुमार, भा.ले.एवं ले.से.',
    address: 'Chancery-II, Embassy of India, 2536 Massachusetts Avenue, NW Washington DC 20008, USA.',
    addressHi: 'चांसरी-II, भारतीय दूतावास, 2536 मैसाचुसेट्स एवेन्यू, एनडब्ल्यू वाशिंगटन डीसी 20008, यूएसए।',
    hostCity: 'Washington, DC',
    hostCountry: 'United States',
    phone: '+1 202-939-9857',
    email: 'pdawashington@cag.gov.in',
    jurisdiction: '68 Indian Diplomatic Missions, Consulates General, and Specialized Permanent Missions across North America, Central America, South America, and the Caribbean.',
    jurisdictionHi: 'उत्तरी अमेरिका, मध्य अमेरिका, दक्षिण अमेरिका और कैरिबियन में 68 भारतीय राजनयिक मिशन, महावाणिज्य दूतावास और विशेष स्थायी मिशन।',
    accreditedCountries: [
      'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina',
      'Chile', 'Colombia', 'Peru', 'Guyana', 'Trinidad & Tobago',
      'Jamaica', 'Permanent Mission of India to the UN (New York)'
    ],
    chanceryPropertyStatus: 'Chancery on Embassy Row (Massachusetts Ave NW)',
    stats: {
      missionsCount: 68,
      countriesCount: 22,
      inspectionCycle: 'Annual / Biennial',
      specializedOversight: 'UN Missions, FMS Escrows & World Bank / IMF'
    },
    specializedDomains: [
      {
        title: 'Permanent Mission to the UN (PMI New York)',
        titleHi: 'संयुक्त राष्ट्र में भारत का स्थायी मिशन (पीएमआई न्यूयॉर्क)',
        description: 'Audit of UN Peacekeeping reimbursement claims, contingent owned equipment, and assessed subscriptions.',
        descriptionHi: 'संयुक्त राष्ट्र शांति सेना प्रतिपूर्ति दावों, सैन्य उपकरणों और आकलित अंशदानों का लेखापरीक्षा।'
      },
      {
        title: 'Foreign Military Sales (FMS) Escrow Tracking',
        titleHi: 'विदेशी सैन्य बिक्री (एफएमएस) एस्क्रो ट्रैकिंग',
        description: 'Verification of US Department of Defense government-to-government procurement accounts and advance deposits.',
        descriptionHi: 'अमेरिकी रक्षा विभाग के सरकार-से-सरकार खरीद खातों और अग्रिम जमा का सत्यापन।'
      },
      {
        title: 'World Bank & IMF Indian Executive Offices',
        titleHi: 'विश्व बैंक एवं आईएमएफ भारतीय कार्यकारी कार्यालय',
        description: 'Statutory examination of expenditure in Indian Executive Directorates at the Bretton Woods institutions.',
        descriptionHi: 'ब्रेटन वुड्स संस्थानों में भारतीय कार्यकारी निदेशालयों के खर्च की सांविधिक जांच।'
      },
      {
        title: 'High-Volume Diaspora Consular Audits',
        titleHi: 'उच्च मात्रा प्रवासी कांसुलर लेखापरीक्षा',
        description: 'Oversight of consular collections across New York, San Francisco, Chicago, Houston, Atlanta, and Toronto.',
        descriptionHi: 'न्यूयॉर्क, सैन फ्रांसिस्को, शिकागो, ह्यूस्टन, अटलांटा और टोरंटो में कांसुलर संग्रह की निगरानी।'
      }
    ],
    mapCoordinates: {
      lat: 38.9136,
      lng: -77.0471,
      zoom: 16
    }
  }
};
