'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';
import { api } from '@/lib/api';
import { getSubsiteOfficeData, getSubsiteOrgStruct, getSubsiteRecruitmentRules } from '@/lib/subsitesData';
import { SubsiteOrgStructItem, RecruitmentRuleItem, OverseasOfficeData } from '@/types';
import NamesDetailsCard from '@/components/cards/NamesDetailsCard';

export interface OfficePortalProps {
  slug?: string;
  officeNameEn?: string;
  officeNameHi?: string;
  locationEn?: string;
  locationHi?: string;
  themeColor?: string; // Default: #1D2E6B (Central/Overseas) or #0A3D30 (State Audit)
  externalOfficialUrl?: string; // Link to official cag.gov.in external portal
  showBottomDeepSection?: boolean;
}

type ActiveModalType = 
  | null 
  | 'about' 
  | 'history' 
  | 'directors' 
  | 'pds' 
  | 'org_structure' 
  | 'staff' 
  | 'audit_admin_fn' 
  | 'audit_jurisdiction' 
  | 'audit_process' 
  | 'audit_scope' 
  | 'gallery' 
  | 'holidays' 
  | 'contact' 
  | 'quick_links' 
  | 'recruitment' 
  | 'faqs' 
  | 'rti'
  | 'terms_conditions'
  | 'privacy_policy'
  | 'copyright_policy'
  | 'hyperlinking_policy'
  | 'accessibility_statement'
  | 'disclaimer'
  | 'archive'
  | 'screen_reader'
  | 'kms'
  | 'sitemap';

export default function OfficePortalTemplate({
  slug = 'andhra-pradesh',
  officeNameEn = 'Principal Accountant General (A&E)',
  officeNameHi = 'प्रधान महालेखाकार (लेखा एवं हकदारी)',
  locationEn = 'Andhra Pradesh, Vijayawada',
  locationHi = 'आंध्र प्रदेश, विजयवाड़ा',
  themeColor = '#0A3D30',
  externalOfficialUrl,
  showBottomDeepSection
}: OfficePortalProps) {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [copyEmailSuccess, setCopyEmailSuccess] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [gallerySelectedImg, setGallerySelectedImg] = useState<string | null>(null);
  const [holidayFilter, setHolidayFilter] = useState<string>('all');
  const [holidayViewTab, setHolidayViewTab] = useState<'calendar' | 'table'>('calendar');
  const [dbData, setDbData] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState<number>(0);
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  
  // Modal Sub-tabs & Search States
  const [historyTab, setHistoryTab] = useState<'history' | 'chancery' | 'vision'>('history');
  const [jurisdictionTab, setJurisdictionTab] = useState<'structured' | 'maps' | 'db_table'>('structured');
  const [jurisdictionCategory, setJurisdictionCategory] = useState<string>('all');
  const [jurisdictionSearch, setJurisdictionSearch] = useState<string>('');
  const [pdsSearch, setPdsSearch] = useState<string>('');
  const [directorsSearch, setDirectorsSearch] = useState<string>('');
  const [staffSearch, setStaffSearch] = useState<string>('');
  const [staffCategory, setStaffCategory] = useState<string>('all');
  const [processTab, setProcessTab] = useState<'lifecycle' | 'statutory'>('lifecycle');
  const [galleryTab, setGalleryTab] = useState<'photos' | 'videos'>('photos');
  const [faqSearch, setFaqSearch] = useState<string>('');

  // Accessibility States
  const [fontScale, setFontScale] = useState<'small' | 'normal' | 'large'>('normal');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  
  // Dropdown hover/open states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    api.getSubsite(slug)
      .then((res) => {
        if (res && res.data) {
          setDbData(res.data);
        }
      })
      .catch((err) => console.warn('Error fetching live subsite data:', err));
  }, [slug]);

  // Auto-rotate subsite hero banners
  useEffect(() => {
    if (dbData?.banners && dbData.banners.length > 1) {
      const timer = setInterval(() => {
        setBannerIndex((prev) => (prev + 1) % dbData.banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [dbData?.banners]);

  // Dynamic Office Data loaded from subsitesData & merged with DB data
  const baseOfficeData: OverseasOfficeData = getSubsiteOfficeData(slug);
  const isSilvertouchOrTest = (str?: string) => !str || str.toLowerCase().includes('silvertouch') || str.toLowerCase().includes('test');
  
  const rawDbEmail = dbData?.email || dbData?.contact?.email;
  const verifiedEmail = (!isSilvertouchOrTest(rawDbEmail) ? rawDbEmail : baseOfficeData.email);

  const officeData: OverseasOfficeData = {
    ...baseOfficeData,
    officeNameEn: dbData?.officeNameEn || baseOfficeData.officeNameEn || officeNameEn,
    officeNameHi: dbData?.officeNameHi || baseOfficeData.officeNameHi || officeNameHi,
    locationEn: dbData?.locationEn || baseOfficeData.locationEn || locationEn,
    locationHi: dbData?.locationHi || baseOfficeData.locationHi || locationHi,
    email: verifiedEmail,
    obfuscatedEmail: (!isSilvertouchOrTest(rawDbEmail) ? rawDbEmail.replace(/@/g, '[at]').replace(/\./g, '[dot]') : baseOfficeData.obfuscatedEmail)
  };

  const staffList: SubsiteOrgStructItem[] = (dbData?.staff && dbData.staff.length > 0)
    ? dbData.staff
    : getSubsiteOrgStruct(slug);

  const recruitmentRules: RecruitmentRuleItem[] = (dbData?.recruitmentRules && dbData.recruitmentRules.length > 0)
    ? dbData.recruitmentRules
    : getSubsiteRecruitmentRules(slug);

  const bannersList: any[] = dbData?.banners || [];
  
  // Rank and prioritize officers: Director General / Principal Director first, then Director, etc.
  const homeOfficers = staffList
    .filter((s: any) => !s.officer_name?.toLowerCase().includes('test'))
    .filter((s: any) => s.display_home === 1 || s.display_home === '1' || s.designation_id === 1 || s.designation_id === 2 || s.id === 52 || s.id === 59 || s.id === 49 || s.id === 79 || s.id === 77 || s.id === 83);

  const getOfficerRank = (officer: any) => {
    const desig = (officer.designation || '').toLowerCase();
    const id = Number(officer.id);
    if (id === 52 || desig.includes('director general') || desig.includes('dg')) return 1;
    if (id === 49 || id === 77 || desig.includes('principal director') || officer.designation_id === 1) return 2;
    if (id === 59 || id === 79 || id === 83 || desig.includes('director') || officer.designation_id === 2) return 3;
    if (desig.includes('deputy director') || officer.designation_id === 3) return 4;
    return 5 + (officer.display_order || 0);
  };

  const sortedHomeOfficers = [...(homeOfficers.length > 0 ? homeOfficers : staffList.filter((s: any) => !s.officer_name?.toLowerCase().includes('test')))]
    .sort((a, b) => getOfficerRank(a) - getOfficerRank(b));

  const activeOfficers = sortedHomeOfficers.slice(0, 2);

  // Dynamic Overseas Cards based on subsite slug
  const getOverseasCards = () => {
    const isLondon = slug.includes('london') || slug.includes('ldn');
    const isWashington = slug.includes('washington') || slug.includes('wdc');

    if (reportsTab === 'sectors') {
      // ── AUDIT SCOPE TAB CARDS ──
      if (isLondon) {
        return [
          {
            id: 1,
            image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
            tag: isHindi ? 'मिशन ऑडिट' : 'Diplomatic Audit',
            category: isHindi ? 'राजनयिक मिशन' : 'Embassies & High Commissions',
            date: isHindi ? 'यूके व यूरोप' : 'UK & Europe',
            title: isHindi 
              ? 'यूनाइटेड किंगडम एवं यूरोप में विदेशी मिशनों एवं उच्चायोगों की वित्तीय व अनुपालन लेखापरीक्षा' 
              : 'Foreign Missions & High Commission Compliance & Financial Propriety Audit',
            desc: isHindi
              ? 'लंदन स्थित भारत के उच्चायोग, पेरिस, बर्लिन, रोम, मैड्रिड आदि दूतावासों के स्थापना व्यय, वीज़ा राजस्व और परिसंपत्तियों की जांच...'
              : 'Comprehensive compliance and proprietary audit of establishment expenditures, consular revenues, developmental cooperation funds, and commercial wing operations across Europe...',
            action: () => setActiveModal('audit_jurisdiction')
          },
          {
            id: 2,
            image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
            tag: isHindi ? 'रक्षा एवं पीएसयू' : 'Defense & PSUs',
            category: isHindi ? 'रक्षा अताशे व बैंक' : 'Defense Advisor & PSU Branches',
            date: isHindi ? 'रणनीतिक इकाइयां' : 'Strategic Liaison Units',
            title: isHindi 
              ? 'रक्षा सलाहकार प्रकोष्ठों, सैन्य उपकरण खरीद एवं विदेशी पीएसयू शाखाओं की जांच' 
              : 'Defense Attaché Liaison Cells, Procurement & Overseas PSU Entities Scrutiny',
            desc: isHindi
              ? 'रक्षा सलाहकार कार्यालयों, सैन्य उपकरण खरीद संपर्क प्रकोष्ठों, सुरक्षा अनुदानों तथा भारतीय सार्वजनिक क्षेत्र के बैंकों की शाखाओं की लेखापरीक्षा...'
              : 'Audit of defense advisor offices, military equipment procurement liaison cells, security grants, and overseas branches of Indian Public Sector Banks...',
            action: () => setActiveModal('audit_jurisdiction')
          },
          {
            id: 3,
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
            tag: isHindi ? 'प्रक्रिया' : 'Audit Process',
            category: isHindi ? 'लेखापरीक्षा कार्यप्रणाली' : 'Methodology & Reporting',
            date: isHindi ? 'वैधानिक निरीक्षण' : 'Statutory Inspection',
            title: isHindi 
              ? 'वार्षिक लेखापरीक्षा योजना, ऑन-साइट निरीक्षण एवं सीएजी रिपोर्टिंग प्रक्रिया' 
              : 'Audit Planning, On-site Inspection & Statutory Reporting to CAG HQ',
            desc: isHindi
              ? 'वार्षिक लेखापरीक्षा योजना, प्रवेश सम्मेलन, ऑन-साइट फील्ड सत्यापन, लेखापरीक्षा प्रश्न और अंतिम निरीक्षण रिपोर्ट (आईआर) प्रेषण प्रक्रिया...'
              : 'Risk-based audit planning, entry conference, on-site field testing, audit memos, exit conference, and statutory IR compilation dispatched to CAG...',
            action: () => setActiveModal('audit_process')
          }
        ];
      }

      if (isWashington) {
        return [
          {
            id: 1,
            image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
            tag: isHindi ? 'मिशन ऑडिट' : 'Diplomatic Audit',
            category: isHindi ? 'राजनयिक मिशन' : 'Embassies & Consulates',
            date: isHindi ? 'अमेरिका एवं संयुक्त राष्ट्र' : 'Americas & UN',
            title: isHindi 
              ? 'अमेरिका भर में राजनयिक मिशनों, वाणिज्य दूतावासों एवं संयुक्त राष्ट्र स्थायी मिशन की लेखापरीक्षा' 
              : 'Americas Diplomatic Missions, Consulates & UN Permanent Mission Audit',
            desc: isHindi
              ? 'वाशिंगटन स्थित भारतीय दूतावास, संयुक्त राष्ट्र स्थायी मिशन न्यूयॉर्क, तथा न्यूयॉर्क, सैन फ्रांसिस्को, शिकागो, ह्यूस्टन वाणिज्य दूतावासों की लेखापरीक्षा...'
              : 'Comprehensive financial and propriety audit of Embassy of India Washington, UN Permanent Mission NY, and Consulates in New York, San Francisco, Chicago, Houston...',
            action: () => setActiveModal('audit_jurisdiction')
          },
          {
            id: 2,
            image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
            tag: isHindi ? 'बहुपक्षीय संस्थाएं' : 'Multilateral Audit',
            category: isHindi ? 'विश्व बैंक एवं आईएमएफ' : 'World Bank & IMF Liaison',
            date: isHindi ? 'अंतर्राष्ट्रीय वित्त' : 'International Finance',
            title: isHindi 
              ? 'बहुपक्षीय वित्तीय संस्थानों एवं अंतर्राष्ट्रीय विकास बैंक संपर्क खातों की लेखापरीक्षा' 
              : 'Multilateral Financial Institutions & World Bank/IMF Liaison Accounts Scrutiny',
            desc: isHindi
              ? 'विश्व बैंक, आईएमएफ और इंटर-अमेरिकन डेवलपमेंट बैंक के साथ भारत के अंशदान, पूंजी योगदान और ट्रस्ट फंड आवंटन का सत्यापन...'
              : 'Verification of India\'s subscriptions, capital contributions, and trust fund allocations with the World Bank, IMF, and Inter-American Development Bank...',
            action: () => setActiveModal('audit_jurisdiction')
          },
          {
            id: 3,
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
            tag: isHindi ? 'प्रक्रिया' : 'Audit Process',
            category: isHindi ? 'लेखापरीक्षा कार्यप्रणाली' : 'Methodology & Reporting',
            date: isHindi ? 'वैधानिक निरीक्षण' : 'Statutory Inspection',
            title: isHindi 
              ? 'वार्षिक लेखापरीक्षा योजना, ऑन-साइट निरीक्षण एवं सीएजी रिपोर्टिंग प्रक्रिया' 
              : 'Audit Process, On-site Inspection & Statutory Reporting to CAG HQ',
            desc: isHindi
              ? 'वार्षिक लेखापरीक्षा योजना, प्रवेश सम्मेलन, ऑन-साइट फील्ड सत्यापन, लेखापरीक्षा प्रश्न और अंतिम निरीक्षण रिपोर्ट (आईआर) प्रेषण प्रक्रिया...'
              : 'Risk-based audit planning, entry conference, on-site field testing, audit memos, exit conference, and statutory IR compilation dispatched to CAG...',
            action: () => setActiveModal('audit_process')
          }
        ];
      }

      // Default: Kuala Lumpur (KUL)
      return [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
          tag: isHindi ? 'मिशन ऑडिट' : 'Diplomatic Audit',
          category: isHindi ? 'राजनयिक मिशन' : 'Embassies & High Commissions',
          date: isHindi ? 'आसियान व पूर्व एशिया' : 'ASEAN & East Asia',
          title: isHindi 
            ? 'दक्षिण पूर्व एशिया में दूतावासों एवं उच्चायोगों की वित्तीय व अनुपालन लेखापरीक्षा' 
            : 'Southeast Asia Diplomatic Missions & Consular Establishments Audit',
          desc: isHindi
            ? 'विदेश मंत्रालय के अधीन कुआलालंपुर, सिंगापुर, जकार्ता, बैंकॉक, मनीला, कैनबरा, टोक्यो आदि मिशनों के व्यय, वीज़ा राजस्व और परिसंपत्तियों की जांच...'
            : 'Comprehensive financial propriety, establishment expenses, and revenue voucher audit of Indian Missions in Kuala Lumpur, Singapore, Jakarta...',
          action: () => setActiveModal('audit_jurisdiction')
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
          tag: isHindi ? 'सार्वजनिक उपक्रम' : 'PSU Audit',
          category: isHindi ? 'पीएसयू एवं बैंक' : 'PSUs & Financial Institutions',
          date: isHindi ? 'क्षेत्रीय शाखाएं' : 'Regional Branches',
          title: isHindi 
            ? 'भारतीय सार्वजनिक क्षेत्र के उपक्रमों (PSUs) एवं वित्तीय संस्थाओं की विदेशी लेखापरीक्षा' 
            : 'Indian Public Sector Undertakings (PSUs) & Overseas Financial Entities Scrutiny',
          desc: isHindi
            ? 'पूर्वी एशिया एवं दक्षिण पूर्व एशिया में कार्यरत भारतीय पीएसयू, बैंक शाखाओं, व्यापार संवर्धन कार्यालयों और तकनीकी सहयोग परियोजनाओं की लेखापरीक्षा...'
            : 'Audit of overseas establishments of Indian PSUs, banks, commercial trade promotion offices, and bilateral developmental joint ventures...',
          action: () => setActiveModal('audit_jurisdiction')
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
          tag: isHindi ? 'प्रक्रिया' : 'Audit Process',
          category: isHindi ? 'लेखापरीक्षा कार्यप्रणाली' : 'Methodology & Reporting',
          date: isHindi ? 'वैधानिक निरीक्षण' : 'Statutory Inspection',
          title: isHindi 
            ? 'वार्षिक लेखापरीक्षा योजना, ऑन-साइट निरीक्षण एवं सीएजी रिपोर्टिंग प्रक्रिया' 
            : 'Audit Process, On-site Inspection & Statutory Reporting to CAG HQ',
          desc: isHindi
            ? 'वार्षिक लेखापरीक्षा योजना, प्रवेश सम्मेलन, ऑन-साइट फील्ड सत्यापन, लेखापरीक्षा प्रश्न और अंतिम निरीक्षण रिपोर्ट (आईआर) प्रेषण प्रक्रिया...'
            : 'Risk-based audit planning, entry conference, on-site field testing, audit memos, exit conference, and statutory IR compilation dispatched to CAG...',
          action: () => setActiveModal('audit_process')
        }
      ];
    }

    // ── OFFICE OVERVIEW TAB CARDS (Officers & Holidays) ──
    const off1 = activeOfficers[0] || sortedHomeOfficers[0];
    const off2 = activeOfficers[1] || sortedHomeOfficers[1];

    if (isLondon) {
      return [
        {
          id: 1,
          isOfficer: true,
          officer: off1,
          image: off1?.photo || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-DG-sir-profile-06788af95cf4c13-79010037.jpeg',
          tag: isHindi ? 'महानिदेशक' : 'Director General',
          category: isHindi ? 'कार्यालय नेतृत्व' : 'Office Leadership',
          date: isHindi ? 'लंदन, यूके' : 'London, UK',
          title: isHindi ? (off1?.officer_name_hi || 'श्री सुनीलराज सोमराजन') : (off1?.officer_name || 'Shri Sunilraj Somarajan'),
          desc: isHindi 
            ? 'महानिदेशक लेखा परीक्षा, लंदन कार्यालय। यूनाइटेड किंगडम एवं यूरोप भर में भारतीय राजनयिक मिशनों, रक्षा सलाहकार प्रकोष्ठों एवं सार्वजनिक उपक्रमों की वैधानिक लेखापरीक्षा का नेतृत्व...'
            : 'Director General of Audit, London. Heading the statutory compliance, financial propriety, and performance audit of Indian diplomatic missions and PSUs across Europe.',
          action: () => setSelectedOfficer(off1)
        },
        {
          id: 2,
          isOfficer: true,
          officer: off2,
          image: off2?.photo || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Director-Sir-Profile-Photo-066f272a818cbb1-78957860.jpg',
          tag: isHindi ? 'निदेशक लेखा परीक्षा' : 'Director of Audit',
          category: isHindi ? 'कार्यकारी नेतृत्व' : 'Executive Leadership',
          date: isHindi ? 'लंदन, यूके' : 'London, UK',
          title: isHindi ? (off2?.officer_name_hi || 'श्री दीपक रघु') : (off2?.officer_name || 'Mr. Deepak Raghu'),
          desc: isHindi 
            ? 'निदेशक लेखा परीक्षा, लंदन कार्यालय। ऑन-साइट निरीक्षणों, दूतावासों एवं वाणिज्य दूतावासों की अनुपालन लेखापरीक्षा और रक्षा खरीद संपर्क खातों का पर्यवेक्षण...'
            : 'Director of Audit, London. Superintending on-site inspections, diplomatic mission audits, commercial wings, and defense attaché liaison accounts.',
          action: () => setSelectedOfficer(off2)
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
          tag: isHindi ? 'अवकाश' : 'Holidays',
          category: isHindi ? 'अवकाश कैलेंडर' : 'Holiday Schedule',
          date: isHindi ? 'वर्ष 2026' : 'Year 2026',
          title: isHindi 
            ? 'लंदन कार्यालय हेतु वर्ष 2026 के लिए आधिकारिक अवकाशों की सूची' 
            : 'Official List of Holidays to be Observed during 2026 at London',
          desc: isHindi 
            ? 'भारत लेखा परीक्षा कार्यालय, लंदन द्वारा वर्ष 2026 के दौरान मनाए जाने वाले राजपत्रित एवं स्थानीय यूके बैंक अवकाशों की आधिकारिक सूची...' 
            : 'Official schedule of closed gazetted holidays and UK bank holidays observed by Office of the Director General of Audit, London...',
          action: () => setActiveModal('holidays')
        }
      ];
    }

    if (isWashington) {
      return [
        {
          id: 1,
          isOfficer: true,
          officer: off1,
          image: off1?.photo || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-PDAL-PD-sir-067b4931cca3006-07312847-06895c524ad0387-06546721.jpg',
          tag: isHindi ? 'प्रधान निदेशक' : 'Principal Director',
          category: isHindi ? 'कार्यालय नेतृत्व' : 'Office Leadership',
          date: isHindi ? 'वाशिंगटन डीसी' : 'Washington DC',
          title: isHindi ? (off1?.officer_name_hi || 'श्री श्रीनिवासा') : (off1?.officer_name || 'Mr. Srinivasa'),
          desc: isHindi 
            ? 'प्रधान निदेशक लेखा परीक्षा, वाशिंगटन डीसी। अमेरिका, कनाडा और लैटिन अमेरिका में भारतीय राजनयिक मिशनों, वाणिज्य दूतावासों और संयुक्त राष्ट्र स्थायी मिशन की लेखापरीक्षा का नेतृत्व...'
            : 'Principal Director of Audit, Washington DC. Heading statutory audit operations of Indian diplomatic missions, consulates, and UN Permanent Mission across the Americas.',
          action: () => setSelectedOfficer(off1)
        },
        {
          id: 2,
          isOfficer: true,
          officer: off2,
          image: off2?.photo || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Director-Photo-069e8fa6d96f8f7-58429347.jpeg',
          tag: isHindi ? 'निदेशक लेखा परीक्षा' : 'Director of Audit',
          category: isHindi ? 'कार्यकारी नेतृत्व' : 'Executive Leadership',
          date: isHindi ? 'वाशिंगटन डीसी' : 'Washington DC',
          title: isHindi ? (off2?.officer_name_hi || 'श्री मेहुल ग्रोवर') : (off2?.officer_name || 'Mr. Mehul Grover'),
          desc: isHindi 
            ? 'निदेशक लेखा परीक्षा, वाशिंगटन डीसी। उत्तर और दक्षिण अमेरिका में दूतावासों, वाणिज्य दूतावासों और बहुपक्षीय वित्तीय खातों के वित्तीय निरीक्षण का पर्यवेक्षण...'
            : 'Director of Audit, Washington DC. Overseeing risk assessment, financial inspection, and audit reporting of North & South America consular establishments.',
          action: () => setSelectedOfficer(off2)
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
          tag: isHindi ? 'अवकाश' : 'Holidays',
          category: isHindi ? 'अवकाश कैलेंडर' : 'Holiday Schedule',
          date: isHindi ? 'वर्ष 2026' : 'Year 2026',
          title: isHindi 
            ? 'वाशिंगटन डीसी कार्यालय हेतु वर्ष 2026 के लिए आधिकारिक अवकाशों की सूची' 
            : 'Official List of Holidays to be Observed during 2026 at Washington DC',
          desc: isHindi 
            ? 'भारत लेखा परीक्षा कार्यालय, वाशिंगटन डीसी द्वारा वर्ष 2026 के दौरान मनाए जाने वाले राजपत्रित एवं यूएस संघीय अवकाशों की आधिकारिक सूची...' 
            : 'Official schedule of closed gazetted holidays and US federal holidays observed by India Audit Office Washington DC...',
          action: () => setActiveModal('holidays')
        }
      ];
    }

    // Default: Kuala Lumpur (KUL)
    return [
      {
        id: 1,
        isOfficer: true,
        officer: off1,
        image: off1?.photo || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-PD-KP-0652ccc3bc70932-63837639-0656489de87ec43-45261207.jpg',
        tag: isHindi ? 'प्रधान निदेशक' : 'Principal Director',
        category: isHindi ? 'कार्यालय नेतृत्व' : 'Office Leadership',
        date: isHindi ? 'कुआलालंपुर' : 'Kuala Lumpur',
        title: isHindi ? (off1?.officer_name_hi || 'श्री पी. वी. हरि कृष्णा') : (off1?.officer_name || 'Mr. P. V. Hari Krishna'),
        desc: isHindi 
          ? 'प्रधान निदेशक लेखा परीक्षा, कुआलालंपुर। पूर्वी एशिया, दक्षिण पूर्व एशिया और ओशिनिया में भारतीय राजनयिक मिशनों, वाणिज्य दूतावासों और सार्वजनिक उपक्रमों की लेखापरीक्षा का नेतृत्व...'
          : 'Principal Director of Audit, Kuala Lumpur. Heading the statutory compliance, financial propriety, and performance audit of Indian diplomatic missions and PSUs across ASEAN, East Asia & Oceania.',
        action: () => setSelectedOfficer(off1)
      },
      {
        id: 2,
        isOfficer: true,
        officer: off2,
        image: off2?.photo || 'https://d7i5wg8xwe4hf.cloudfront.net/uploads/subsite_org_profile_pic/PDAL-Director-sir-photo-066e133742461be-94073860.jpg',
        tag: isHindi ? 'निदेशक लेखा परीक्षा' : 'Director of Audit',
        category: isHindi ? 'कार्यकारी नेतृत्व' : 'Executive Leadership',
        date: isHindi ? 'कुआलालंपुर' : 'Kuala Lumpur',
        title: isHindi ? (off2?.officer_name_hi || 'श्री गौरव राय') : (off2?.officer_name || 'Mr. Gaurav Rai'),
        desc: isHindi 
          ? 'निदेशक लेखा परीक्षा, कुआलालंपुर। जोखिम-आधारित लेखापरीक्षा योजना, ऑन-साइट निरीक्षण और आसियान व पूर्वी एशिया में भारतीय मिशनों के फील्ड सत्यापन का निर्देशन...'
          : 'Director of Audit, Kuala Lumpur. Directing statutory inspections, risk-based audit planning, and field inspections of Indian missions and commercial establishments across Southeast Asia.',
        action: () => setSelectedOfficer(off2)
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
        tag: isHindi ? 'अवकाश' : 'Holidays',
        category: isHindi ? 'अवकाश कैलेंडर' : 'Holiday Schedule',
        date: isHindi ? 'वर्ष 2026' : 'Year 2026',
        title: isHindi 
          ? 'कुआलालंपुर कार्यालय हेतु वर्ष 2026 के लिए आधिकारिक अवकाशों की सूची' 
          : 'Official List of Holidays to be Observed during 2026 at Kuala Lumpur',
        desc: isHindi 
          ? 'भारत लेखा परीक्षा कार्यालय, कुआलालंपुर द्वारा वर्ष 2026 के दौरान मनाए जाने वाले राजपत्रित एवं स्थानीय फेडरल अवकाशों की आधिकारिक सूची...' 
          : 'Official schedule of closed gazetted holidays and local Malaysian federal holidays observed by India Audit Office Kuala Lumpur...',
        action: () => setActiveModal('holidays')
      }
    ];
  };


  // Helper to find a matching page from dbData.pages or dbData.subsitePages by keyword or slug
  const findDbPage = (keyword: string) => {
    if (!dbData) return null;
    const kw = keyword.toLowerCase();
    if (dbData.subsitePages && dbData.subsitePages[kw]) {
      return dbData.subsitePages[kw];
    }
    if (dbData.subsitePages) {
      for (const k in dbData.subsitePages) {
        if (k.toLowerCase().includes(kw) || dbData.subsitePages[k]?.slug?.toLowerCase().includes(kw)) {
          return dbData.subsitePages[k];
        }
      }
    }
    const pages = dbData.pages || {};
    for (const k in pages) {
      if (k.toLowerCase().includes(kw) || pages[k]?.slug?.toLowerCase().includes(kw)) {
        return pages[k];
      }
    }
    for (const k in pages) {
      if (pages[k]?.title?.toLowerCase().includes(kw) || pages[k]?.title_hi?.toLowerCase().includes(kw)) {
        return pages[k];
      }
    }
    return null;
  };

  // Merge live DB lists with static fallbacks
  const effectivePdsList = (dbData?.pdsList && dbData.pdsList.length > 0)
    ? dbData.pdsList
    : (officeData.pdsList || []);

  const effectiveDirectorsList = (dbData?.directorsList && dbData.directorsList.length > 0)
    ? dbData.directorsList
    : (officeData.directorsList || []);

  const effectiveUnitsList = (dbData?.unitsList && dbData.unitsList.length > 0)
    ? dbData.unitsList
    : (officeData.unitsList || []);

  // Theme styling helpers
  const isGreenTheme = themeColor === '#0A3D30' || themeColor === '#1D6B57' || themeColor === '#024023';
  const primaryThemeColor = isGreenTheme ? '#0A3D30' : '#1D2E6B';
  const activeIndicatorColor = isGreenTheme ? '#1D6B57' : '#1D2E6B';
  const segmentActiveColor = isGreenTheme ? '#024023' : '#1D2E6B';
  const upperFooterColor = isGreenTheme ? 'rgba(10, 61, 48, 0.9)' : 'rgba(29, 46, 107, 0.9)';
  const isOverseas = slug.startsWith('overseas-') || officeData.theme !== 'GSSA';
  
  // By default, bottom section is always rendered (matching Figma 14-4148 and 14-4407)
  const shouldRenderBottomSection = showBottomDeepSection !== false;
  
  // Section 1: Audit Reports / Sectors Tab
  const [reportsTab, setReportsTab] = useState<'reports' | 'sectors'>('reports');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Section 2: What's new? / Press release Tab
  const [newsTab, setNewsTab] = useState<'whats_new' | 'press_release'>('whats_new');

  // Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState(8);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const isHindi = lang === 'हिन्दी';

  const toggleLanguage = () => {
    const nextLang = lang === 'English' ? 'हिन्दी' : 'English';
    dataManager.setLanguage(nextLang);
    setLang(nextLang);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopyEmailSuccess(true);
    setTimeout(() => setCopyEmailSuccess(false), 2500);
  };

  // 3 Feature Cards Data matching Figma Node 14-4407
  const reportCards = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80',
      tag: isHindi ? 'नागरिक' : 'Civil',
      category: isHindi ? 'नागरिक' : 'Civic',
      date: isHindi ? '4 जून, 2026' : 'Jun 4, 2026',
      title: isHindi 
        ? 'लेखापरीक्षा रिपोर्ट का शीर्षक यह दो पंक्तियों में हो सकता है' 
        : 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
      desc: isHindi
        ? 'संबंधित विभागों और वित्तीय दायित्वों के संबंध में विस्तृत रिपोर्ट का सार यहाँ दिया गया है...'
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
      tag: isHindi ? 'तमिलनाडु' : 'Tamil Nadu',
      category: isHindi ? 'तमिलनाडु' : 'Tamil Nadu',
      date: isHindi ? '4 जून, 2026' : 'Jun 4, 2026',
      title: isHindi 
        ? 'राज्य अनुपालन एवं वित्तीय प्रदर्शन पर विस्तृत रिपोर्ट' 
        : 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
      desc: isHindi
        ? 'राज्य सरकार के वित्तीय लेखा-जोखा और विनियोग मदों का विस्तृत विश्लेषण...'
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800&auto=format&fit=crop&q=80',
      tag: isHindi ? 'आंध्र प्रदेश' : 'Andhra Pradesh',
      category: isHindi ? 'आंध्र प्रदेश' : 'Andhra Pradesh',
      date: isHindi ? '4 जून, 2026' : 'Jun 4, 2026',
      title: isHindi 
        ? 'आंध्र प्रदेश राजस्व एवं व्यय प्रबंधन विश्लेषण रिपोर्ट' 
        : 'Title of the Report this could be in two lines it amet, consectetur adipiscing elit, sed do',
      desc: isHindi
        ? 'राज्य संचित निधि और सार्वजनिक उपक्रमों के निष्पादन की समीक्षा...'
        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ...'
    }
  ];

  // What's New items
  const whatsNewItems = [
    { id: 1, date: isHindi ? '24 जून' : '24 Jun', title: isHindi ? '25 स्प्लिट एयर कंडीशनर टेंडर' : '25 Split Air Conditioner' },
    { id: 2, date: isHindi ? '24 जून' : '24 Jun', title: isHindi ? 'सीसीटीवी कैमरों की खरीद और स्थापना' : 'Purchase & Installation of CCTV Camera' },
    { id: 3, date: isHindi ? '03 अक्तूबर' : '03 Oct', title: isHindi ? 'मोबाइल स्टोरेज कॉम्पैक्टर (Q3) की बोली' : 'Bid for Mobile Storage Compactors (Q3)' },
    { id: 4, date: isHindi ? '14 मई' : '14 May', title: isHindi ? 'पेंशन अदालत के संबंध में सार्वजनिक सूचना' : 'Public Notice regarding Pension Adalat' },
  ];

  const pressReleaseItems = [
    { id: 1, date: isHindi ? '18 जुलाई' : '18 Jul', title: isHindi ? 'वार्षिक वित्त लेखा रिपोर्ट जारी' : 'Release of Annual Finance Accounts Report' },
    { id: 2, date: isHindi ? '12 जून' : '12 Jun', title: isHindi ? 'राज्य स्तरीय लेखा परीक्षा सेमिनार का आयोजन' : 'State Level Audit Conference Inauguration' },
    { id: 3, date: isHindi ? '05 मई' : '05 May', title: isHindi ? 'डिजिटल पेंशन प्रबंधन प्रणाली का शुभारंभ' : 'Launch of Digital Pension Processing System' },
    { id: 4, date: isHindi ? '20 अप्रैल' : '20 Apr', title: isHindi ? 'सार्वजनिक खरीद दिशानिर्देश अधिसूचना' : 'Public Procurement Compliance Notification' },
  ];

  // Calendar Helpers (August 2026)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesHi = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const currentMonthLabel = isHindi ? `${monthNamesHi[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}` : `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`;

  const changeMonth = (offset: number) => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const effectiveOfficeName = isHindi ? (officeNameHi || officeData.officeNameHi) : (officeNameEn || officeData.officeNameEn);
  const effectiveLocation = isHindi ? (locationHi || officeData.locationHi) : (locationEn || officeData.locationEn);
  const effectiveExternalUrl = externalOfficialUrl || officeData.externalOfficialUrl;

  const contactInfo = dbData?.contact;
  const addressDisplay = isHindi ? (contactInfo?.address_hi || officeData.addressHi) : (contactInfo?.address_en || officeData.addressEn);
  const phoneDisplay = contactInfo?.phone || officeData.phone;
  const emailDisplay = contactInfo?.email || officeData.email;
  const officeHoursDisplay = isHindi ? (contactInfo?.working_hours || officeData.officeHoursHi) : (contactInfo?.working_hours || officeData.officeHoursEn);

  const filteredHolidays = (officeData.holidaysList || []).filter(h => {
    if (holidayFilter === 'all') return true;
    if (holidayFilter === 'closed') return h.type === 'Closed Holiday';
    if (holidayFilter === 'federal') return h.type === 'Federal Holiday';
    return true;
  });

  return (
    <div 
      className={`w-full min-h-screen font-['Noto_Sans',sans-serif] antialiased overflow-x-hidden selection:bg-[#1D2E6B] selection:text-white transition-colors duration-200 ${
        isHighContrast ? 'bg-black text-[#FFFF00]' : 'bg-white text-[#2A2A2A]'
      }`}
      style={{
        fontSize: fontScale === 'small' ? '92%' : fontScale === 'large' ? '108%' : '100%'
      }}
    >
      
      {/* =========================================================================
          1. TOP HEADER BAR (Figma Spec: #1D2E6B, 40px height, padding 8px 64px 8px 180px)
         ========================================================================= */}
      <header className="w-full relative z-30 shadow-sm">
        <div 
          className="w-full text-white h-[40px] px-4 md:pl-[180px] md:pr-[64px] flex justify-between items-center text-xs relative"
          style={{ background: isHighContrast ? '#000000' : '#1D2E6B', borderBottom: isHighContrast ? '1px solid #FFFF00' : 'none' }}
        >
          {/* Left: Office Title */}
          <div className="flex items-center gap-2 truncate max-w-[45%]">
            <span className="font-normal text-[11px] leading-[24px] text-white/90 truncate font-['Noto_Sans']">
              {effectiveOfficeName},
            </span>
            <span className="font-bold text-[11px] leading-[24px] text-white truncate font-['Noto_Sans']">
              {effectiveLocation}
            </span>
          </div>

          {/* Right: Comprehensive Utility Links (Matching Figma Spec & Screenshot) */}
          <div className="flex items-center gap-4 text-[10px] leading-[14px] font-normal text-white shrink-0 font-['Noto_Sans']">
            {/* Knowledge Hub */}
            <button 
              onClick={() => setActiveModal('kms')}
              className="hover:underline transition-colors cursor-pointer bg-transparent border-none text-white text-[10px] leading-[14px] p-0 font-['Noto_Sans']"
              title={isHindi ? 'ज्ञान केंद्र' : 'Knowledge Hub'}
            >
              {isHindi ? 'ज्ञान केंद्र' : 'Knowledge Hub'}
            </button>

            {/* Employee Portal */}
            <button 
              onClick={() => setActiveModal('staff')}
              className="hover:underline transition-colors cursor-pointer bg-transparent border-none text-white text-[10px] leading-[14px] p-0 font-['Noto_Sans']"
              title={isHindi ? 'कर्मचारी पोर्टल' : 'Employee Portal'}
            >
              {isHindi ? 'कर्मचारी पोर्टल' : 'Employee Portal'}
            </button>

            {/* News & Events */}
            <button 
              onClick={() => {
                setNewsTab('press_release');
                const el = document.getElementById('whats-new-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setActiveModal('about');
              }}
              className="hover:underline transition-colors cursor-pointer bg-transparent border-none text-white text-[10px] leading-[14px] p-0 font-['Noto_Sans']"
              title={isHindi ? 'समाचार एवं कार्यक्रम' : 'News & Events'}
            >
              {isHindi ? 'समाचार एवं कार्यक्रम' : 'News & Events'}
            </button>

            {/* Contact */}
            <button 
              onClick={() => setActiveModal('contact')}
              className="hover:underline transition-colors cursor-pointer bg-transparent border-none text-white text-[10px] leading-[14px] p-0 font-['Noto_Sans']"
              title={isHindi ? 'संपर्क' : 'Contact'}
            >
              {isHindi ? 'संपर्क' : 'Contact'}
            </button>

            {/* Accessibility Box (Figma Spec: 24px x 24px, border-radius 2px, opacity 0.1 bg) */}
            <button
              onClick={() => {
                if (fontScale === 'normal') setFontScale('large');
                else if (fontScale === 'large') setFontScale('small');
                else setFontScale('normal');
              }}
              className="w-[24px] h-[24px] border border-white rounded-[2px] bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-0.5 cursor-pointer text-white"
              title={`Accessibility Options (Font scale: ${fontScale})`}
            >
              <span className="text-[12px] leading-[16px] font-normal font-['Noto_Sans']">A</span>
              <span className="text-[7px] leading-[7px] text-white">▼</span>
            </button>

            {/* Language Selector (Figma Spec: English v with arrow) */}
            <button
              onClick={toggleLanguage}
              className="bg-transparent border-none text-white cursor-pointer hover:underline text-[12px] leading-[16px] flex items-center gap-1 font-normal font-['Noto_Sans'] transition-colors p-0"
            >
              <span>{lang}</span>
              <span className="text-[7px] leading-[7px]">▼</span>
            </button>
          </div>
        </div>

        {/* Main White Navigation Menu Bar (Height: 80px, Figma Spec: padding 4px 64px 4px 180px, gap 40px) */}
        <div className="w-full bg-white border-b border-[#D7D7D7] h-[80px] px-4 md:pl-[180px] md:pr-[64px] flex justify-between items-center relative">
          {/* Overlapping Official CAG Crest Emblem Logo (Figma Spec: height: 104px, left: 4.44%, top: 8px) */}
          <Link href="/" className="absolute left-[4.44%] top-[-32px] z-40 block">
            <img
              src="/assets/12e6d254adf33bbd46537f45eb8f9ecd50a15e55.png"
              alt="Comptroller and Auditor General of India Crest"
              className="h-[104px] w-auto object-contain drop-shadow-md"
            />
          </Link>

          {/* Navigation Dropdowns & Menus (Figma Spec: 8 items matching Screenshot exactly) */}
          <nav className="hidden xl:flex items-center gap-[16px] 2xl:gap-[28px] text-[14px] leading-[19px] font-normal text-[#4D4D4D]">
            
            {/* 1. About Us (Dropdown: History, Directors, PDs, Org Structure) */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('about_us')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setActiveModal('about')}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'हमारे बारे में' : 'About Us'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[220px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setActiveModal('history'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>📜</span>
                  <span>{isHindi ? 'कार्यालय का संक्षिप्त इतिहास' : 'Brief History of Office'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('directors'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>👔</span>
                  <span>{isHindi ? 'निदेशकों की सूची' : 'List Of Directors'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('pds'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>🎖️</span>
                  <span>{isHindi ? 'प्रधान निदेशकों की सूची (PDs)' : 'List Of PDs'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('about'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>ℹ️</span>
                  <span>{isHindi ? 'कार्यालय का अवलोकन' : 'Overview & Mandate'}</span>
                </button>
              </div>
            </div>

            {/* 2. State Accounts (Dropdown / Quick Action) */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('state_accounts')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => {
                  setReportsTab('reports');
                  const el = document.getElementById('audit-reports-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setActiveModal('audit_jurisdiction');
                }}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'राज्य के खाते' : 'State Accounts'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[220px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setReportsTab('reports'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>📊</span>
                  <span>{isHindi ? 'लेखापरीक्षा रिपोर्ट' : 'Audit Reports'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('audit_jurisdiction'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>🌐</span>
                  <span>{isHindi ? 'लेखापरीक्षा क्षेत्राधिकार' : 'Audit Jurisdiction'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('audit_process'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>📑</span>
                  <span>{isHindi ? 'लेखापरीक्षा प्रक्रिया' : 'Audit Process'}</span>
                </button>
              </div>
            </div>

            {/* 3. GPF */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('gpf')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setActiveModal('about')}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'जीपीएफ' : 'GPF'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[200px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setActiveModal('about'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>💳</span>
                  <span>{isHindi ? 'जीपीएफ दिशानिर्देश' : 'GPF Guidelines'}</span>
                </button>
              </div>
            </div>

            {/* 4. Pension */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('pension')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setActiveModal('about')}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'पेंशन' : 'Pension'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[200px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setActiveModal('about'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>🏛️</span>
                  <span>{isHindi ? 'पेंशन सेवाएं एवं अदालत' : 'Pension Services'}</span>
                </button>
              </div>
            </div>

            {/* 5. Employee Corner */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('emp_corner')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setActiveModal('staff')}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'कर्मचारी कोना' : 'Employee Corner'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[220px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setActiveModal('org_structure'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>🌳</span>
                  <span>{isHindi ? 'संगठनात्मक संरचना' : 'Organizational Structure'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('staff'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>👥</span>
                  <span>{isHindi ? 'कर्मचारी विवरण (Staff Details)' : 'Staff Details'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('holidays'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>📅</span>
                  <span>{isHindi ? 'अवकाश सूची' : 'List Of Holidays'}</span>
                </button>
              </div>
            </div>

            {/* 6. RTI */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('rti')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setActiveModal('rti')}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'आरटीआई' : 'RTI'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[200px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setActiveModal('rti'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>⚖️</span>
                  <span>{isHindi ? 'सूचना का अधिकार (RTI)' : 'Right to Information'}</span>
                </button>
              </div>
            </div>

            {/* 7. Citizen Charter (Figma: No arrow) */}
            <button
              onClick={() => setActiveModal('about')}
              className="cursor-pointer py-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
            >
              <span>{isHindi ? 'सिटिजन चार्टर' : 'Citizen Charter'}</span>
            </button>

            {/* 8. Contact Us */}
            <div 
              className="relative group py-4"
              onMouseEnter={() => setOpenDropdown('contact_menu')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                onClick={() => setActiveModal('contact')}
                className="cursor-pointer py-1 flex items-center gap-1 hover:text-[#1D2E6B] transition-colors bg-transparent border-none text-[14px] leading-[19px] font-normal text-[#4D4D4D]"
              >
                <span>{isHindi ? 'संपर्क करें' : 'Contact Us'}</span>
                <span className="text-[8px] text-[#4D4D4D]">▼</span>
              </button>
              <div className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-slate-200 shadow-xl rounded-lg py-2 min-w-[220px] z-50 animate-fadeIn">
                <button
                  onClick={() => { setActiveModal('contact'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-slate-100 flex items-center gap-2"
                >
                  <span>📍</span>
                  <span>{isHindi ? 'कार्यालय संपर्क एवं मानचित्र' : 'Office Contact & Map'}</span>
                </button>
                <button
                  onClick={() => { setActiveModal('faqs'); setOpenDropdown(null); }}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-900 transition-colors flex items-center gap-2"
                >
                  <span>❓</span>
                  <span>{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Search Box (Figma Spec: 220px x 32px, border #D7D7D7, radius 4px) */}
          <div className="flex items-center border border-[#D7D7D7] rounded-[4px] px-2 py-1 bg-white w-[220px] h-[32px] focus-within:border-[#1D2E6B] transition-colors shrink-0 ml-auto xl:ml-0">
            <input
              type="text"
              placeholder={isHindi ? 'खोजें...' : 'Search'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[178px] bg-transparent border-none outline-none text-[14px] leading-[19px] text-[#717171] placeholder:text-[#717171] font-['Noto_Sans']"
            />
            <svg className="w-[14px] h-[14px] text-[#4D4D4D] shrink-0 cursor-pointer hover:text-[#1D2E6B] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
              <path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO BANNER SECTION (Figma Specs: 1440px x 560px, drop-shadow 40px rgba(0,0,0,0.1))
         ========================================================================= */}
      <section className="relative w-full h-[560px] min-h-[560px] flex items-center justify-start overflow-hidden bg-[#090C1E] filter drop-shadow-[0px_0px_40px_rgba(0,0,0,0.1)]">
        {/* Active Banner Image from DB or Default */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${(bannersList.length > 0 && bannersList[bannerIndex % bannersList.length]?.image) ? bannersList[bannerIndex % bannersList.length].image : '/assets/17a8a6edf588630a0c7494a054fb34e604c4f41c.png'}')`
          }}
        />

        {/* Dark Gradient Overlay (Figma Spec: 270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.01) 20%, rgba(9, 12, 30, 0.7) 50%, #090C1E 100%, opacity 0.9) */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(270deg, rgba(9, 12, 30, 0) 0%, rgba(9, 12, 30, 0.01) 20%, rgba(9, 12, 30, 0.7) 50%, #090C1E 100%)',
            opacity: 0.9
          }}
        />

        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-16 lg:px-[120px] flex items-center justify-between">
          {/* Banner Info (Figma Spec: width: 581px, left: 120px, gap: 40px) */}
          <div className="flex flex-col items-start gap-[40px] max-w-[581px]">
            <div className="flex flex-col items-start gap-[16px]">
              {/* Gold Accent Bar (Figma Spec: Line 1602: width: 93px, border: 2px solid #FFCE7B) */}
              <div className="w-[93px] h-[0px] border-b-2 border-[#FFCE7B]" />

              {/* Headline Line 1 (Figma Spec: 24px, line-height 56px, letter-spacing 2px, #FEFEFE) */}
              <p className="text-[24px] leading-[56px] tracking-[2px] font-normal text-[#FEFEFE] font-['Noto_Sans']">
                {isHindi ? 'सुनिश्चित करना' : 'Ensuring'}
              </p>

              {/* Headline Line 2 & 3 */}
              <h1 className="text-[36px] sm:text-[42px] font-bold leading-[44px] sm:leading-[52px] text-white font-['Noto_Sans']">
                {isHindi ? 'पारदर्शिता, सत्यनिष्ठा एवं' : 'Transparency, Integrity &'}{' '}
                <span className="text-[#FFCE7B]">
                  {isHindi ? 'जवाबदेही' : 'Accountability'}
                </span>
              </h1>

              {/* Subtitle (Figma Spec: 20px, line-height 32px, #FEFEFE) */}
              <p className="text-[18px] sm:text-[20px] leading-[32px] font-normal text-[#FEFEFE] font-['Noto_Sans']">
                {bannersList.length > 0 && bannersList[bannerIndex % bannersList.length]?.caption
                  ? (isHindi
                      ? (bannersList[bannerIndex % bannersList.length].caption_hi || bannersList[bannerIndex % bannersList.length].caption)
                      : bannersList[bannerIndex % bannersList.length].caption)
                  : (isHindi
                      ? (officeData.mandateHi || 'भारत की सर्वोच्च लेखापरीक्षा संस्था से लेखापरीक्षा रिपोर्ट, खाते और संस्थागत संसाधन प्राप्त करें।')
                      : (officeData.mandateEn || "Access audit reports, accounts, and institutional resources from India's Supreme Audit Institution."))}
              </p>
            </div>

            {/* CTAs (Figma Spec: gap: 24px) */}
            <div className="flex flex-wrap items-center gap-[24px]">
              {/* Button 1 (Figma Spec: 152px x 48px, bg #FFFFFF, text #0A3D30, radius 8px) */}
              <Link
                href="/Reports"
                className="w-[152px] h-[48px] bg-white text-[#0A3D30] text-[16px] leading-[22px] font-semibold rounded-[8px] flex items-center justify-center hover:bg-zinc-100 transition-all shadow-md shrink-0 cursor-pointer font-['Noto_Sans']"
              >
                {isHindi ? 'रिपोर्ट देखें' : 'Explore Reports'}
              </Link>

              {/* Button 2 (Figma Spec: 160px x 48px, border 1px #FFFFFF, text #FFFFFF, radius 8px) */}
              <Link
                href="/About/About-Us/Organisation-Chart"
                className="w-[160px] h-[48px] border border-white bg-black/20 text-white text-[16px] leading-[22px] font-medium rounded-[8px] flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-md shrink-0 cursor-pointer font-['Noto_Sans']"
              >
                <span className="text-white font-medium drop-shadow">
                  {isHindi ? 'सीएजी के बारे में जानें' : 'Learn about CAG'}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicator Bars (Figma Spec: Left 120px, Bottom 24px, gap 8px, 4 lines 50px wide) */}
        <div className="absolute left-6 sm:left-16 lg:left-[120px] bottom-[24px] z-20 flex items-center gap-[8px]">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBannerIndex(idx)}
              className="cursor-pointer bg-transparent p-0 border-none transition-all"
              title={`Slide ${idx + 1}`}
            >
              <div 
                className={`w-[50px] transition-all ${
                  (bannerIndex % (bannersList.length || 4)) === idx
                    ? 'border-b-[6px] border-[#1D6B57]'
                    : idx === 1
                    ? 'border-b-[3px] border-[#B1B1B1]'
                    : 'border-b-[3px] border-white'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Floating Grey Bar & Quick Link Button (Figma Spec: Rectangle 34625654: 432px x 52px #5B5C5F & Gold circular button #FFCE7B) */}
        <div className="absolute right-0 lg:right-[60px] bottom-0 z-30 flex items-end">
          <div className="w-[432px] h-[52px] bg-[#5B5C5F] backdrop-blur-md rounded-t-[10px] hidden lg:block" />
          <button
            onClick={() => setActiveModal('quick_links')}
            aria-label="Quick links"
            className="w-[80px] h-[80px] bg-[#FFCE7B] hover:bg-[#FDBA5A] border border-[#797979] rounded-full shadow-[4px_4px_20px_10px_rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer hover:scale-105 transition-all translate-y-[28px] ml-[-40px] z-40"
            title={isHindi ? 'त्वरित लिंक मेनू' : 'Quick Actions Menu'}
          >
            <svg className="w-[34px] h-[34px] text-[#1B1B1B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. LATEST AUDIT REPORTS & ACCOUNTS SECTION (Figma: Top 704px - 1309px)
         ========================================================================= */}
      <section id="audit-reports-section" className="w-full max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 pt-[48px] pb-[64px] flex flex-col items-start gap-[32px]">
            
            {/* Segment Control Tab Pill (Width: 272px, Height: 32px) */}
            <div className="w-[272px] h-[32px] bg-[#F5F4F7] border border-[#EDEDED] rounded-[8px] p-[2px] flex items-center relative">
              <button
                type="button"
                onClick={() => setReportsTab('reports')}
                className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                  reportsTab === 'reports'
                    ? 'text-white font-semibold shadow-xs'
                    : 'text-[#565656] hover:text-[#2A2A2A]'
                }`}
                style={reportsTab === 'reports' ? { background: segmentActiveColor } : {}}
              >
                {isHindi ? 'लेखापरीक्षा रिपोर्ट' : 'Audit reports'}
              </button>
              <button
                type="button"
                onClick={() => setReportsTab('sectors')}
                className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                  reportsTab === 'sectors'
                    ? 'text-white font-semibold shadow-xs'
                    : 'text-[#565656] hover:text-[#2A2A2A]'
                }`}
                style={reportsTab === 'sectors' ? { background: segmentActiveColor } : {}}
              >
                {isHindi ? 'क्षेत्र (Sectors)' : 'sectors'}
              </button>
            </div>

            {/* 3 Cards Grid using Figma Component (Node 87-3817) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full items-stretch">
              {reportCards.map((card: any) => (
                <NamesDetailsCard
                  key={card.id}
                  image={card.image}
                  tag={card.tag}
                  category={card.category}
                  date={card.date}
                  title={card.title}
                  subtitle={card.isOfficer ? (isHindi ? (card.officer?.designation_hi || card.tag) : (card.officer?.designation || card.tag)) : undefined}
                  desc={card.desc}
                  isOfficer={card.isOfficer}
                  linkText={card.isOfficer ? (isHindi ? 'प्रोफाइल' : 'Profile') : (isHindi ? 'विवरण देखें' : 'Read details')}
                  onClick={() => {
                    if (card.action) card.action();
                  }}
                  themeColor={primaryThemeColor}
                />
              ))}
            </div>

            {/* Navigation Arrows (Bottom Right) */}
            <div className="w-full flex justify-end items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setCarouselIndex(p => Math.max(0, p - 1))}
                className="w-[48px] h-[48px] bg-[#F5F5F5] rounded-[8px] flex items-center justify-center text-[#C0C0C0] hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex(p => p + 1)}
                className="w-[48px] h-[48px] bg-white border border-[#2E2E31] rounded-[8px] flex items-center justify-center text-[#2E2E31] hover:bg-zinc-50 transition-colors cursor-pointer"
                title="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </section>

          {/* Regular State Data Section */}
          {shouldRenderBottomSection && (
            <section
              id="whats-new-section"
              className="w-full py-[64px] px-4 sm:px-10 lg:px-16 flex flex-col items-center"
              style={{ background: primaryThemeColor }}
            >
              <div className="w-full max-w-[1280px] flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-start">
                  
                  {/* ── COLUMN 1: WHAT'S NEW? / ANNOUNCEMENTS (4 Cols) ── */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <div className="w-[272px] h-[32px] bg-[#F5F4F7] border border-[#EDEDED] rounded-[8px] p-[2px] flex items-center">
                      <button
                        type="button"
                        onClick={() => setNewsTab('whats_new')}
                        className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                          newsTab === 'whats_new'
                            ? 'text-white font-semibold shadow-xs'
                            : 'text-[#565656]'
                        }`}
                        style={newsTab === 'whats_new' ? { background: segmentActiveColor } : {}}
                      >
                        {isHindi ? 'नया क्या है?' : "What's new?"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsTab('press_release')}
                        className={`flex-1 h-full rounded-[6px] text-[14px] leading-[19px] font-medium transition-all cursor-pointer flex items-center justify-center ${
                          newsTab === 'press_release'
                            ? 'text-white font-semibold shadow-xs'
                            : 'text-[#565656]'
                        }`}
                        style={newsTab === 'press_release' ? { background: segmentActiveColor } : {}}
                      >
                        {isHindi ? 'प्रेस विज्ञप्ति' : 'Announcements'}
                      </button>
                    </div>

                    <div className="w-full bg-white border border-[#D7D7D7] rounded-[8px] py-[24px] px-0 shadow-sm flex flex-col justify-between min-h-[340px]">
                      <div className="w-full border-b border-[#B1B1B1] pb-2 px-6">
                        <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider">
                          {newsTab === 'whats_new' ? (isHindi ? 'नवीनतम सूचनाएँ' : 'Recent Announcements') : (isHindi ? 'प्रेस अपडेट' : 'Media Releases')}
                        </span>
                      </div>

                      <div className="px-6 py-4 flex flex-col gap-[18px] flex-1">
                        {(dbData?.whatsNew && dbData.whatsNew.length > 0
                          ? dbData.whatsNew.slice(0, 4)
                          : (newsTab === 'whats_new' ? whatsNewItems : pressReleaseItems)
                        ).map((item: any) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <span className="px-2.5 py-0.5 bg-[#EAF7EE] text-[#094E3D] font-bold text-[13px] leading-[22px] rounded-[4px] shrink-0">
                              {item.date || (isHindi ? 'नवीनतम' : 'New')}
                            </span>
                            <span className="text-[14px] leading-[22px] font-normal text-[#2A2A2A] truncate">
                              {isHindi ? (item.title_hi || item.title) : item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── COLUMN 2: DATE OF TABLING OF REPORTS (4 Cols) ── */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <h3 className="text-white text-[20px] font-bold leading-[27px] font-['Noto_Sans']">
                      {isHindi ? 'रिपोर्टों के पटल पर रखने की तिथि' : 'Date of Tabling of Reports'}
                    </h3>

                    <div className="w-full bg-white rounded-[8px] p-5 shadow-sm min-h-[340px] flex flex-col justify-between">
                      <div className="flex justify-between items-center pb-3 border-b border-[#F0F0F0]">
                        <button
                          type="button"
                          onClick={() => changeMonth(-1)}
                          className="w-9 h-9 border border-[#E5E5EA] rounded-[8px] flex items-center justify-center text-[#2E2E31] hover:bg-zinc-50 cursor-pointer"
                          title="Previous Month"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <span className="font-bold text-[16px] text-[#2E2E31]">
                          {currentMonthLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeMonth(1)}
                          className="w-9 h-9 border border-[#E5E5EA] rounded-[8px] flex items-center justify-center text-[#2E2E31] hover:bg-zinc-50 cursor-pointer"
                          title="Next Month"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-7 text-center pt-2 text-[13px] font-semibold">
                        <span className="text-[#751639]">Su</span>
                        <span className="text-[#8A8A8F]">Mo</span>
                        <span className="text-[#8A8A8F]">Tu</span>
                        <span className="text-[#8A8A8F]">We</span>
                        <span className="text-[#8A8A8F]">Th</span>
                        <span className="text-[#8A8A8F]">Fr</span>
                        <span className="text-[#751639]">Sa</span>
                      </div>

                      <div className="grid grid-cols-7 gap-y-1 text-center text-[14px] pt-1 items-center">
                        <span className="text-[#8E8E93] text-xs">26</span>
                        <span className="text-[#8E8E93] text-xs">27</span>
                        <span className="text-[#8E8E93] text-xs">28</span>
                        <span className="text-[#8E8E93] text-xs">29</span>
                        <span className="text-[#8E8E93] text-xs">30</span>
                        <span className="text-[#8E8E93] text-xs">31</span>
                        <span className="text-[#2E2E31] font-medium">1</span>

                        <span className="text-[#2E2E31] font-medium">2</span>
                        <span className="text-[#2E2E31] font-medium">3</span>
                        <span className="text-[#2E2E31] font-medium">4</span>
                        <span className="text-[#2E2E31] font-medium">5</span>
                        <span className="text-[#2E2E31] font-medium">6</span>
                        <span className="text-[#2E2E31] font-medium">7</span>
                        <div className="flex justify-center items-center">
                          <span 
                            className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
                            style={{ background: primaryThemeColor }}
                          >
                            8
                          </span>
                        </div>

                        <span className="text-[#2E2E31] font-medium">9</span>
                        <span className="text-[#2E2E31] font-medium">10</span>
                        <span className="text-[#2E2E31] font-medium">11</span>
                        <span className="text-[#2E2E31] font-medium">12</span>
                        <span className="text-[#2E2E31] font-medium">13</span>
                        <span className="text-[#2E2E31] font-medium">14</span>
                        <span className="text-[#2E2E31] font-medium">15</span>

                        <span className="text-[#2E2E31] font-medium">16</span>
                        <span className="text-[#2E2E31] font-medium">17</span>
                        <span className="text-[#2E2E31] font-medium">18</span>
                        <span className="text-[#2E2E31] font-medium">19</span>
                        <span className="text-[#2E2E31] font-medium">20</span>
                        <span className="text-[#2E2E31] font-medium">21</span>
                        <span className="text-[#2E2E31] font-medium">22</span>
                      </div>
                    </div>
                  </div>

                  {/* ── COLUMN 3: STATE TENDERS & CONTRACTS (4 Cols) ── */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    <h3 className="text-white text-[20px] font-bold leading-[27px] font-['Noto_Sans']">
                      {isHindi ? 'निविदाएं एवं अनुबंध' : 'Tenders & Contracts'}
                    </h3>

                    <div className="w-full bg-white rounded-[8px] p-6 shadow-sm min-h-[340px] flex flex-col justify-between">
                      <div className="flex flex-col gap-3">
                        <p className="text-[17px] leading-[26px] text-[#000000] font-normal font-['Noto_Sans']">
                          {isHindi
                            ? `कार्यालय ${effectiveOfficeName} के लिए वर्ष 2026-27 की अवधि हेतु मुद्रण, डिजाइनिंग, लेखापरीक्षा रिपोर्टों और तकनीकी प्रकाशनों की एजेंसी को नियुक्त करने की निविदा...`
                            : `Hiring of Printing Agency from region for designing, formatting and printing of Audit Reports, booklet/brochure along with (CD-ROM) for the period 2026-27 for ${effectiveOfficeName}`}
                        </p>
                        <p className="text-[14px] text-zinc-500 font-medium">
                          09 Jan 2026 (PDF, 887.85 KB)
                        </p>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-[#F0F0F0]">
                        <Link
                          href="/Resources/Tenders"
                          className="font-bold text-[15px] hover:underline flex items-center gap-1.5"
                          style={{ color: primaryThemeColor }}
                        >
                          <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          )}

      {/* =========================================================================
          5. FOOTER (Matching Figma Double Bar: #1D2E6B & #2A2A2A)
         ========================================================================= */}
      <footer className="w-full flex flex-col">
        {/* Upper Footer Row (#1D2E6B / upperFooterColor) */}
        <div 
          className="w-full min-h-[72px] px-6 sm:px-16 flex justify-center items-center py-4"
          style={{ background: upperFooterColor }}
        >
          <div className="flex flex-wrap justify-center items-center gap-6 text-[15px] sm:text-[16px] leading-[22px] font-normal text-white">
            <button 
              onClick={() => setActiveModal('copyright_policy')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'कॉपीराइट नीति' : 'Copyright Policy'}
            </button>
            <button 
              onClick={() => setActiveModal('faqs')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'सहायता / एफएक्यू' : 'Help / FAQs'}
            </button>
            <button 
              onClick={() => setActiveModal('hyperlinking_policy')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy'}
            </button>
            <button 
              onClick={() => setActiveModal('privacy_policy')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </button>
            <button 
              onClick={() => setActiveModal('terms_conditions')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'नियम एवं शर्तें' : 'Terms & Conditions'}
            </button>
            <button 
              onClick={() => setActiveModal('accessibility_statement')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'पहुंच विवरण' : 'Accessibility Statement'}
            </button>
            <button 
              onClick={() => setActiveModal('archive')} 
              className="hover:underline text-white text-[15px] sm:text-[16px] leading-[22px] bg-transparent border-none cursor-pointer"
            >
              {isHindi ? 'अभिलेखागार' : 'Archive'}
            </button>
          </div>
        </div>

        {/* Lower Copyright Row (#2A2A2A) */}
        <div className="w-full bg-[#2A2A2A] min-h-[40px] px-6 sm:px-16 py-2 flex flex-col sm:flex-row justify-between items-center text-[13px] sm:text-[14px] leading-[19px] font-normal text-white gap-2">
          <span className="text-center sm:text-left">
            {isHindi
              ? `© कॉपीराइट 2026 - सामग्री का स्वामित्व ${effectiveOfficeName}, ${effectiveLocation} के पास है। सर्वाधिकार सुरक्षित।`
              : `© Copyright 2026 - Content Owned by ${effectiveOfficeName}, ${effectiveLocation}. All rights reserved.`}
          </span>
          <span className="text-center sm:text-right shrink-0">
            {isHindi ? 'पृष्ठ अंतिम बार अपडेट किया गया: 27 जुलाई 2026' : 'Page last updated: 27 Jul 2026'}
          </span>
        </div>
      </footer>

      {/* =========================================================================
          6. INTERACTIVE MODALS & VIEWS (PDA - WDC SPECIFICATION)
         ========================================================================= */}

      {/* ── 1. BRIEF HISTORY OF OFFICE MODAL ── */}
      {activeModal === 'history' && (() => {
        const historyPage = findDbPage('history');
        const chanceryPage = findDbPage('india_house') || findDbPage('chancery');
        const visionPage = findDbPage('vision_mission') || findDbPage('vision') || findDbPage('core-values');
        const isLondon = slug.includes('london') || slug.includes('ldn');
        const isKL = slug.includes('kualalumpur') || slug.includes('kul');

        const currentContent = () => {
          if (historyTab === 'chancery' && chanceryPage) {
            return isHindi ? (chanceryPage.content_hi || chanceryPage.content) : chanceryPage.content;
          }
          if (historyTab === 'vision' && visionPage) {
            return isHindi ? (visionPage.content_hi || visionPage.content) : visionPage.content;
          }
          if (historyPage) {
            return isHindi ? (historyPage.content_hi || historyPage.content) : historyPage.content;
          }
          return null;
        };

        const activeHtml = currentContent();

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📜</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'कार्यालय का संक्षिप्त इतिहास' : 'Brief History of Office'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - {effectiveLocation}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 bg-slate-50">
                <button
                  onClick={() => setHistoryTab('history')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    historyTab === 'history' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'कार्यालय इतिहास' : 'Brief History'}
                </button>
                {isLondon && (
                  <button
                    onClick={() => setHistoryTab('chancery')}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                      historyTab === 'chancery' 
                        ? 'border-blue-900 text-blue-900 bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isHindi ? 'इंडिया हाउस चांसरी' : 'India House Chancery'}
                  </button>
                )}
                {isKL && (
                  <button
                    onClick={() => setHistoryTab('vision')}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                      historyTab === 'vision' 
                        ? 'border-blue-900 text-blue-900 bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isHindi ? 'दृष्टिकोण एवं मूल्य' : 'Vision, Mission & Core Values'}
                  </button>
                )}
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm text-slate-700 leading-relaxed">
                {activeHtml ? (
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: activeHtml }}
                  />
                ) : (
                  <>
                    <div className="p-4 bg-blue-50/70 border-l-4 border-blue-800 rounded-r-lg">
                      <p className="font-medium text-slate-800">
                        {isHindi ? officeData.historyHi : officeData.historyEn}
                      </p>
                    </div>
                    <p>
                      {isHindi 
                        ? 'यह कार्यालय भारत के संविधान के अनुच्छेद 148 से 151 के तहत भारत के नियंत्रक एवं महालेखापरीक्षक के संवैधानिक अधिदेश को अंतरराष्ट्रीय स्तर पर लागू करता है। यह मिशनों में वित्तीय अनुशासन, लोक धन के सदुपयोग और विदेशों में भारत सरकार की परिसंपत्तियों की सुरक्षा सुनिश्चित करता है।'
                        : "Operating under Articles 148–151 of the Constitution of India and the CAG's (DPC) Act 1971, this overseas establishment guarantees rigorous scrutiny of public expenditure across diplomatic missions, defense procurements, commercial interactions, and multilateral trust funds."}
                    </p>
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-xs font-bold text-blue-900 uppercase">{isHindi ? 'स्थापना उद्देश्य' : 'Key Objective'}</span>
                    <p className="text-xs text-slate-600 mt-1">
                      {isHindi ? 'राजनयिक और वाणिज्यिक लेखापरीक्षा में वित्तीय पारदर्शिता और जवाबदेही।' : 'Ensure supreme financial accountability in foreign missions and international allocations.'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-xs font-bold text-blue-900 uppercase">{isHindi ? 'संवैधानिक अधिदेश' : 'Constitutional Mandate'}</span>
                    <p className="text-xs text-slate-600 mt-1">
                      {isHindi ? 'सीएजी (कर्तव्य, शक्तियां एवं सेवा शर्तें) अधिनियम, 1971 की धारा 13 एवं 14।' : "Sections 13 & 14 of the CAG's (Duties, Powers & Conditions of Service) Act, 1971."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 2. LIST OF DIRECTORS MODAL ── */}
      {activeModal === 'directors' && (() => {
        const filteredDirectors = effectiveDirectorsList.filter((dir: any) => {
          if (!directorsSearch.trim()) return true;
          const q = directorsSearch.toLowerCase();
          const name = (dir.nameEn || dir.nameHi || dir.name || '').toLowerCase();
          const role = (dir.roleEn || dir.roleHi || dir.role || dir.designation || '').toLowerCase();
          const tenure = (dir.tenure || '').toLowerCase();
          return name.includes(q) || role.includes(q) || tenure.includes(q);
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👔</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'निदेशकों की सूची' : 'List Of Directors of Audit'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} ({effectiveDirectorsList.length} {isHindi ? 'कुल निदेशक' : 'Total Directors Recorded'})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <input
                  type="text"
                  placeholder={isHindi ? 'निदेशक का नाम या वर्ष खोजें...' : 'Search Director by name or year...'}
                  value={directorsSearch}
                  onChange={(e) => setDirectorsSearch(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="p-6 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-[13px] font-bold text-slate-700">
                      <th className="py-3 px-4 w-12">#</th>
                      <th className="py-3 px-4">{isHindi ? 'अधिकारी का नाम' : 'Officer Name'}</th>
                      <th className="py-3 px-4">{isHindi ? 'संवर्ग' : 'Cadre'}</th>
                      <th className="py-3 px-4">{isHindi ? 'पदनाम / भूमिका' : 'Role / Designation'}</th>
                      <th className="py-3 px-4">{isHindi ? 'कार्यकाल' : 'Tenure'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                    {filteredDirectors.length > 0 ? (
                      filteredDirectors.map((dir: any, idx: number) => {
                        const nameEn = dir.nameEn || dir.name || dir.officer_name;
                        const nameHi = dir.nameHi || dir.officer_name_hi || nameEn;
                        const roleEn = dir.roleEn || dir.role || dir.designation || 'Director of Audit';
                        const roleHi = dir.roleHi || dir.designation_hi || roleEn;
                        const isCurrent = (dir.tenure || '').toLowerCase().includes('present');

                        return (
                          <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isCurrent ? 'bg-blue-50/40 font-semibold' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <span>{isHindi ? nameHi : nameEn}</span>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-semibold">
                                    {isHindi ? 'वर्तमान' : 'Current'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[11px] font-mono rounded font-medium">
                                IA&AS
                              </span>
                            </td>
                            <td className="py-3 px-4 text-emerald-800 font-medium">
                              {isHindi ? roleHi : roleEn}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                              {dir.tenure || '—'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          {isHindi ? 'कोई निदेशक रिकॉर्ड नहीं मिला।' : 'No directors found matching query.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 3. LIST OF PDS (PRINCIPAL DIRECTORS) MODAL ── */}
      {activeModal === 'pds' && (() => {
        const filteredPds = effectivePdsList.filter((pd: any) => {
          if (!pdsSearch.trim()) return true;
          const q = pdsSearch.toLowerCase();
          const name = (pd.nameEn || pd.nameHi || pd.name || '').toLowerCase();
          const role = (pd.roleEn || pd.roleHi || pd.role || pd.designation || '').toLowerCase();
          const tenure = (pd.tenure || '').toLowerCase();
          return name.includes(q) || role.includes(q) || tenure.includes(q);
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎖️</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'प्रधान निदेशकों की सूची (List Of PDs)' : 'List Of Principal Directors of Audit / Director Generals'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} ({effectivePdsList.length} {isHindi ? 'कुल प्रधान निदेशक' : 'Total Heads of Office Recorded'})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <input
                  type="text"
                  placeholder={isHindi ? 'प्रधान निदेशक का नाम या वर्ष खोजें...' : 'Search Principal Director by name or year...'}
                  value={pdsSearch}
                  onChange={(e) => setPdsSearch(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="p-6 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-[13px] font-bold text-slate-700">
                      <th className="py-3 px-4 w-12">#</th>
                      <th className="py-3 px-4">{isHindi ? 'प्रधान निदेशक / महानिदेशक का नाम' : 'Principal Director / Director General'}</th>
                      <th className="py-3 px-4">{isHindi ? 'संवर्ग' : 'Cadre'}</th>
                      <th className="py-3 px-4">{isHindi ? 'पदनाम' : 'Designation'}</th>
                      <th className="py-3 px-4">{isHindi ? 'कार्यकाल' : 'Tenure'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                    {filteredPds.length > 0 ? (
                      filteredPds.map((pd: any, idx: number) => {
                        const nameEn = pd.nameEn || pd.name || pd.officer_name;
                        const nameHi = pd.nameHi || pd.officer_name_hi || nameEn;
                        const roleEn = pd.roleEn || pd.role || pd.designation || 'Principal Director of Audit';
                        const roleHi = pd.roleHi || pd.designation_hi || roleEn;
                        const isCurrent = (pd.tenure || '').toLowerCase().includes('present');

                        return (
                          <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isCurrent ? 'bg-blue-50/40 font-semibold' : ''}`}>
                            <td className="py-3 px-4 font-semibold text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <span>{isHindi ? nameHi : nameEn}</span>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-semibold">
                                    {isHindi ? 'वर्तमान' : 'Current'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[11px] font-mono rounded font-medium">
                                IA&AS
                              </span>
                            </td>
                            <td className="py-3 px-4 text-blue-900 font-semibold">
                              {isHindi ? roleHi : roleEn}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                              {pd.tenure || '—'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          {isHindi ? 'कोई प्रधान निदेशक रिकॉर्ड नहीं मिला।' : 'No Principal Directors found matching query.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 4. ORGANIZATIONAL STRUCTURE MODAL ── */}
      {activeModal === 'org_structure' && (() => {
        const orgPage = findDbPage('org-str') || findDbPage('organization') || findDbPage('structure');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌳</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'संगठनात्मक संरचना' : 'Organizational Structure'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-6">
                {orgPage?.content ? (
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: orgPage.content }}
                  />
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{isHindi ? 'संरचनात्मक विवरण' : 'Structural Hierarchy & Functions'}</h4>
                    <p className="text-sm text-slate-800 mt-1 leading-relaxed">
                      {isHindi ? officeData.orgStructureHi : officeData.orgStructureEn}
                    </p>
                  </div>
                )}

                {/* Hierarchy Tree Diagram */}
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="bg-blue-950 text-white font-bold px-6 py-3 rounded-lg shadow-md text-center border-2 border-blue-800">
                    <div className="text-sm">{isHindi ? 'प्रधान निदेशक लेखा परीक्षा' : 'Principal Director of Audit (PDA)'}</div>
                    <div className="text-xs text-blue-200 font-normal">Head of Department (IA&AS)</div>
                  </div>

                  <div className="w-0.5 h-6 bg-slate-400"></div>

                  <div className="bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow text-center">
                    <div className="text-xs">{isHindi ? 'लेखा परीक्षा निदेशक' : 'Director of Audit'}</div>
                    <div className="text-[11px] text-blue-100 font-normal">Audit Planning & Field Supervision</div>
                  </div>

                  <div className="w-0.5 h-6 bg-slate-400"></div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-center">
                      <div className="text-xs font-bold text-emerald-900">{isHindi ? 'राजनयिक लेखापरीक्षा विंग' : 'Diplomatic Audit Wing'}</div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">Embassies & Consulates Audit</div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-center">
                      <div className="text-xs font-bold text-amber-900">{isHindi ? 'रक्षा एवं बहुपक्षीय विंग' : 'Defense & Multilateral Wing'}</div>
                      <div className="text-[11px] text-amber-700 mt-0.5">UN PMI, World Bank & Defense Accounts</div>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-300 rounded-lg text-center">
                      <div className="text-xs font-bold text-purple-900">{isHindi ? 'प्रशासन एवं समन्वय विंग' : 'Administration & HR Wing'}</div>
                      <div className="text-[11px] text-purple-700 mt-0.5">HQ Reporting & Establishment</div>
                    </div>
                  </div>
                </div>

                {/* Staff Details Action */}
                <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{isHindi ? 'कर्मचारी विवरण दस्तावेज' : 'Official Staff Details Document'}</span>
                    <span className="text-xs text-slate-500">{isHindi ? 'विस्तृत कर्मचारी पदानुक्रम और पदभार' : 'Comprehensive staff cadre deployment and designations'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveModal('staff')}
                      className="px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded hover:bg-blue-950 transition-colors cursor-pointer"
                    >
                      {isHindi ? 'रोस्टर देखें' : 'View Roster'}
                    </button>
                    {officeData.staffDetailsPdfUrl && (
                      <a
                        href={officeData.staffDetailsPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded hover:bg-emerald-800 transition-colors flex items-center gap-1"
                      >
                        <span>PDF ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 5. ADMINISTRATIVE FUNCTION MODAL ── */}
      {activeModal === 'audit_admin_fn' && (() => {
        const adminPage = findDbPage('aud-fnc') || findDbPage('administrative');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'प्रशासनिक कार्य' : 'Administrative Function'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm text-slate-700 leading-relaxed">
                {adminPage?.content ? (
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: adminPage.content }}
                  />
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-slate-800 font-medium">
                      {isHindi ? officeData.administrativeFunctionHi : officeData.administrativeFunctionEn}
                    </p>
                  </div>
                )}
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{isHindi ? 'प्रमुख प्रशासनिक जिम्मेदारियाँ' : 'Core Administrative Functions'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-1">
                    <span className="text-xs font-bold text-blue-900">1. {isHindi ? 'वार्षिक लेखापरीक्षा योजना' : 'Annual Audit Planning'}</span>
                    <p className="text-xs text-slate-600">{isHindi ? 'मुख्यालय से अनुमोदन के साथ क्षेत्रीय लेखापरीक्षा चक्रों का निर्धारण।' : 'Formulating annual inspection schedules with New Delhi HQ clearance.'}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-1">
                    <span className="text-xs font-bold text-blue-900">2. {isHindi ? 'दूतावास प्रोटोकॉल समन्वय' : 'Embassy Protocol & Liaison'}</span>
                    <p className="text-xs text-slate-600">{isHindi ? 'विदेशी मिशनों और कांसुलर अधिकारियों के साथ समन्वय।' : 'Direct liaison with Heads of Mission, Consuls General, and MEA.'}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-1">
                    <span className="text-xs font-bold text-blue-900">3. {isHindi ? 'वित्तीय निगरानी' : 'Budget & Financial Scrutiny'}</span>
                    <p className="text-xs text-slate-600">{isHindi ? 'कार्यालय के बजट आवंटन और स्थापना व्यय की निगरानी।' : 'Oversight of operational budgets, audit travel allowances, and contingency.'}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col gap-1">
                    <span className="text-xs font-bold text-blue-900">4. {isHindi ? 'मुख्यालय रिपोर्टिंग' : 'Statutory Reporting'}</span>
                    <p className="text-xs text-slate-600">{isHindi ? 'सीएजी मुख्यालय को त्रैमासिक और वार्षिक निरीक्षण रिपोर्ट प्रेषित करना।' : 'Dispatch of inspection reports (IRs) and annual performance reviews.'}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 6. AUDIT JURISDICTION MODAL ── */}
      {activeModal === 'audit_jurisdiction' && (() => {
        const judPage = findDbPage('aud-jud') || findDbPage('jurisdiction');
        const mapsPage = findDbPage('audit_jurisdiction_maps') || findDbPage('maps');

        // Filter units by category and search
        const filteredUnits = effectiveUnitsList.filter((unit: any) => {
          // Category filter
          if (jurisdictionCategory === 'embassy' && !unit.category?.toLowerCase().includes('embassy')) return false;
          if (jurisdictionCategory === 'consulate' && !unit.category?.toLowerCase().includes('consulate') && !unit.category?.toLowerCase().includes('commission')) return false;
          if (jurisdictionCategory === 'psu' && !unit.category?.toLowerCase().includes('psu') && !unit.category?.toLowerCase().includes('bank')) return false;
          if (jurisdictionCategory === 'tourist' && !unit.category?.toLowerCase().includes('tourist') && !unit.category?.toLowerCase().includes('institution') && !unit.category?.toLowerCase().includes('cultural')) return false;

          // Text search filter
          if (jurisdictionSearch.trim()) {
            const q = jurisdictionSearch.toLowerCase();
            const nEn = (unit.nameEn || '').toLowerCase();
            const nHi = (unit.nameHi || '').toLowerCase();
            const city = (unit.city || '').toLowerCase();
            const country = (unit.country || '').toLowerCase();
            return nEn.includes(q) || nHi.includes(q) || city.includes(q) || country.includes(q);
          }
          return true;
        });

        const embassyCount = effectiveUnitsList.filter((u: any) => u.category?.toLowerCase().includes('embassy')).length;
        const consulateCount = effectiveUnitsList.filter((u: any) => u.category?.toLowerCase().includes('consulate') || u.category?.toLowerCase().includes('commission')).length;
        const psuCount = effectiveUnitsList.filter((u: any) => u.category?.toLowerCase().includes('psu') || u.category?.toLowerCase().includes('bank')).length;
        const touristCount = effectiveUnitsList.filter((u: any) => u.category?.toLowerCase().includes('tourist') || u.category?.toLowerCase().includes('institution') || u.category?.toLowerCase().includes('cultural')).length;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'लेखापरीक्षा क्षेत्राधिकार निर्देशिका' : 'Statutory Audit Jurisdiction Directory'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} ({effectiveUnitsList.length} {isHindi ? 'कुल संस्थाएं एवं मिशन' : 'Diplomatic & PSU Entities Under Audit'})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Sub-Tabs */}
              <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 bg-slate-50">
                <button
                  onClick={() => setJurisdictionTab('structured')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    jurisdictionTab === 'structured' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'संरचित निर्देशिका' : 'Structured Directory'} ({effectiveUnitsList.length})
                </button>
                <button
                  onClick={() => setJurisdictionTab('maps')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    jurisdictionTab === 'maps' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'मानचित्र अनुसार क्षेत्राधिकार' : 'Map-wise Audit Jurisdiction'}
                </button>
                <button
                  onClick={() => setJurisdictionTab('db_table')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    jurisdictionTab === 'db_table' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'आधिकारिक परिपत्र / तालिका' : 'Official Circular Table'}
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-sm text-slate-700 leading-relaxed">
                {jurisdictionTab === 'structured' && (
                  <>
                    {/* Category Filter Pills & Search */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setJurisdictionCategory('all')}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            jurisdictionCategory === 'all' 
                              ? 'bg-blue-900 text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isHindi ? 'सभी इकाइयां' : 'All Units'} ({effectiveUnitsList.length})
                        </button>
                        <button
                          onClick={() => setJurisdictionCategory('embassy')}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            jurisdictionCategory === 'embassy' 
                              ? 'bg-blue-900 text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isHindi ? 'दूतावास' : 'Embassies'} ({embassyCount})
                        </button>
                        <button
                          onClick={() => setJurisdictionCategory('consulate')}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            jurisdictionCategory === 'consulate' 
                              ? 'bg-blue-900 text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isHindi ? 'उच्चायोग व वाणिज्य दूतावास' : 'Consulates & High Commissions'} ({consulateCount})
                        </button>
                        <button
                          onClick={() => setJurisdictionCategory('psu')}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            jurisdictionCategory === 'psu' 
                              ? 'bg-blue-900 text-white' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isHindi ? 'विदेशी पीएसयू शाखाएं' : 'PSU Overseas Branches'} ({psuCount})
                        </button>
                        {touristCount > 0 && (
                          <button
                            onClick={() => setJurisdictionCategory('tourist')}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              jurisdictionCategory === 'tourist' 
                                ? 'bg-blue-900 text-white' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isHindi ? 'पर्यटन एवं सांस्कृतिक' : 'Tourist & Cultural'} ({touristCount})
                          </button>
                        )}
                      </div>

                      <div className="w-full sm:w-64 shrink-0">
                        <input
                          type="text"
                          placeholder={isHindi ? 'देश, शहर या इकाई खोजें...' : 'Filter by country, city or name...'}
                          value={jurisdictionSearch}
                          onChange={(e) => setJurisdictionSearch(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                        />
                      </div>
                    </div>

                    {/* Units Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {filteredUnits.length > 0 ? (
                        filteredUnits.map((unit: any, idx: number) => (
                          <div 
                            key={idx} 
                            className="p-3.5 bg-slate-50/80 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition-all flex flex-col justify-between gap-2"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase tracking-wider">
                                  {unit.category || 'Unit'}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                  📍 {unit.country}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 leading-snug mt-1">
                                {isHindi ? (unit.nameHi || unit.nameEn) : unit.nameEn}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {unit.city}, {unit.country}
                              </p>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 text-[10px]">
                              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                                {isHindi ? 'सक्रिय लेखापरीक्षा' : 'Active Audit'}
                              </span>
                              <span className="text-slate-400">CAG Act 1971</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center text-slate-500">
                          {isHindi ? 'कोई मेल खाती इकाई नहीं मिली।' : 'No audit units found matching the selected filter.'}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {jurisdictionTab === 'maps' && (
                  <div className="flex flex-col gap-4">
                    {mapsPage?.content ? (
                      <div 
                        className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: isHindi ? (mapsPage.content_hi || mapsPage.content) : mapsPage.content }}
                      />
                    ) : (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center flex flex-col items-center gap-3">
                        <span className="text-4xl">🗺️</span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {isHindi ? 'भौगोलिक क्षेत्राधिकार मानचित्र' : 'Geographic Audit Jurisdiction Map'}
                        </h4>
                        <p className="text-xs text-slate-600 max-w-lg">
                          {isHindi 
                            ? 'इस कार्यालय का लेखापरीक्षा क्षेत्राधिकार यूरोप, ब्रिटेन और आस-पास के क्षेत्रों में स्थित सभी भारतीय राजनयिक और कांसुलर मिशनों को कवर करता है।'
                            : 'Statutory audit oversight covers all diplomatic, consular, commercial, and PSU operations across the assigned international geographic directorate.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {jurisdictionTab === 'db_table' && (
                  <div className="flex flex-col gap-4">
                    {judPage?.content ? (
                      <div 
                        className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: isHindi ? (judPage.content_hi || judPage.content) : judPage.content }}
                      />
                    ) : (
                      <p className="text-xs text-slate-600 italic">
                        {isHindi ? 'आधिकारिक परिपत्र डेटा उपलब्ध नहीं है।' : 'Official circular table data not available.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 7. AUDIT PROCESS MODAL ── */}
      {activeModal === 'audit_process' && (() => {
        const procPage = findDbPage('aud-process') || findDbPage('process');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'लेखापरीक्षा प्रक्रिया एवं कार्यप्रणाली' : 'Audit Process & Methodology'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - 6-Stage Statutory Lifecycle</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 bg-slate-50">
                <button
                  onClick={() => setProcessTab('lifecycle')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    processTab === 'lifecycle' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? '6-चरणीय लेखापरीक्षा चक्र' : '6-Stage Lifecycle Flowchart'}
                </button>
                <button
                  onClick={() => setProcessTab('statutory')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    processTab === 'statutory' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'वैधानिक प्रक्रिया एवं नियम' : 'Statutory Procedure & Rules'}
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4">
                {processTab === 'lifecycle' && (
                  <div className="flex flex-col gap-3">
                    {[
                      { 
                        step: 1, 
                        icon: '📋',
                        titleEn: 'Annual Audit Planning & HQ Clearance', 
                        titleHi: 'वार्षिक लेखापरीक्षा योजना एवं मुख्यालय अनुमोदन', 
                        descEn: 'Formulation of risk-based inspection schedules approved annually by Deputy CAG (Report Central) at CAG Headquarters, New Delhi.',
                        descHi: 'सीएजी मुख्यालय, नई दिल्ली में उप नियंत्रक एवं महालेखापरीक्षक द्वारा प्रतिवर्ष अनुमोदित जोखिम-आधारित निरीक्षण कार्यक्रम का निर्माण।'
                      },
                      { 
                        step: 2, 
                        icon: '🤝',
                        titleEn: 'Audit Intimation & Entry Conference', 
                        titleHi: 'लेखापरीक्षा सूचना एवं प्रवेश सम्मेलन', 
                        descEn: 'Formal notification to the Head of Mission (Ambassador / High Commissioner) and convening the entry conference to outline scope and documentation requirements.',
                        descHi: 'मिशन प्रमुख (राजदूत / उच्चायुक्त) को औपचारिक सूचना और कार्यक्षेत्र तथा दस्तावेज़ीकरण आवश्यकताओं को रेखांकित करने हेतु प्रवेश सम्मेलन।'
                      },
                      { 
                        step: 3, 
                        icon: '🔍',
                        titleEn: 'On-Site Field Audit & Financial Scrutiny', 
                        titleHi: 'ऑन-साइट फील्ड ऑडिट एवं वित्तीय जांच', 
                        descEn: 'On-site verification of consular fee collections, establishment expenditure, defense procurement liaison funds, and commercial wing operations.',
                        descHi: 'कांसुलर शुल्क वसूली, स्थापना व्यय, रक्षा खरीद संपर्क कोष और वाणिज्यिक विंग संचालन का ऑन-साइट सत्यापन।'
                      },
                      { 
                        step: 4, 
                        icon: '📝',
                        titleEn: 'Audit Queries & Preliminary Observations', 
                        titleHi: 'लेखापरीक्षा प्रश्न एवं प्रारंभिक टिप्पणियां', 
                        descEn: 'Issuing formal audit queries and observation memos to mission authorities for factual verification, explanations, and supporting evidence.',
                        descHi: 'तथ्यात्मक सत्यापन, स्पष्टीकरण और सहायक साक्ष्यों के लिए मिशन अधिकारियों को औपचारिक लेखापरीक्षा प्रश्न जारी करना।'
                      },
                      { 
                        step: 5, 
                        icon: '🏛️',
                        titleEn: 'Exit Conference with Diplomatic Officers', 
                        titleHi: 'राजनयिक अधिकारियों के साथ निकास सम्मेलन', 
                        descEn: 'Detailed briefing with the Ambassador / Consul General discussing key audit findings, compliance lapses, and corrective recommendations.',
                        descHi: 'राजदूत / महावाणिज्यदूत के साथ प्रमुख निष्कर्षों, अनुपालन कमियों और सुधारात्मक सिफारिशों पर विस्तृत समीक्षा।'
                      },
                      { 
                        step: 6, 
                        icon: '📤',
                        titleEn: 'Inspection Report (IR) Dispatch & Tabling', 
                        titleHi: 'अंतिम निरीक्षण रिपोर्ट (आईआर) प्रेषण एवं संसद में प्रस्तुति', 
                        descEn: 'Compilation of the final Inspection Report (IR) and simultaneous dispatch to the Ministry of External Affairs (MEA) and CAG HQ for Union Audit Report tabling in Parliament.',
                        descHi: 'अंतिम निरीक्षण रिपोर्ट (आईआर) का संकलन और संसद में केंद्रीय लेखापरीक्षा रिपोर्ट प्रस्तुत करने हेतु विदेश मंत्रालय और सीएजी मुख्यालय को प्रेषण।'
                      }
                    ].map((st) => (
                      <div key={st.step} className="flex gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl items-start hover:border-blue-400 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                          {st.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{st.icon}</span>
                            <h5 className="text-xs font-bold text-slate-900">
                              {isHindi ? st.titleHi : st.titleEn}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {isHindi ? st.descHi : st.descEn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {processTab === 'statutory' && (
                  <div className="flex flex-col gap-4">
                    {procPage?.content ? (
                      <div 
                        className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: isHindi ? (procPage.content_hi || procPage.content) : procPage.content }}
                      />
                    ) : (
                      <p className="text-xs text-slate-600">
                        {isHindi ? 'वैधानिक प्रक्रिया दस्तावेज उपलब्ध है।' : 'Statutory procedural guidelines documented under CAG Regulations on Audit and Accounts 2020.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 8. GALLERY MODAL (Photo & Video Gallery) ── */}
      {activeModal === 'gallery' && (() => {
        const galleryItems = (dbData?.photoGallery && dbData.photoGallery.length > 0)
          ? dbData.photoGallery
          : (officeData.photoGallery || []);

        const videoItems = (dbData?.videoGallery && dbData.videoGallery.length > 0)
          ? dbData.videoGallery
          : [
              {
                id: 1,
                titleEn: 'Address by CAG of India at UN Panel of External Auditors',
                titleHi: 'संयुक्त राष्ट्र बाह्य लेखापरीक्षक पैनल में भारत के सीएजी का संबोधन',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                date: '2025'
              },
              {
                id: 2,
                titleEn: 'International Workshop on Environmental & Public Debt Audit',
                titleHi: 'पर्यावरण एवं लोक ऋण लेखापरीक्षा पर अंतर्राष्ट्रीय कार्यशाला',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                date: '2025'
              }
            ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{galleryTab === 'photos' ? '🖼️' : '🎥'}</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'मीडिया गैलरी' : 'Media Gallery'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 bg-slate-50">
                <button
                  onClick={() => setGalleryTab('photos')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    galleryTab === 'photos' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'फोटो गैलरी' : 'Photo Gallery'} ({galleryItems.length})
                </button>
                <button
                  onClick={() => setGalleryTab('videos')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    galleryTab === 'videos' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'वीडियो गैलरी' : 'Video Gallery'} ({videoItems.length})
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {galleryTab === 'photos' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryItems.map((photo: any) => {
                      const imgUrl = photo.image || photo.imageUrl || (photo.images && photo.images[0]) || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80';
                      const displayTitle = isHindi ? (photo.title_hi || photo.titleHi || photo.title || photo.titleEn) : (photo.title || photo.titleEn);
                      return (
                        <div 
                          key={photo.id} 
                          className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col group cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => setGallerySelectedImg(imgUrl)}
                        >
                          <div className="h-44 w-full overflow-hidden bg-zinc-800 relative">
                            <img 
                              src={imgUrl} 
                              alt={displayTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded font-semibold">
                              {photo.date || 'Event'}
                            </span>
                          </div>
                          <div className="p-3">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-2">
                              {displayTitle}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoItems.map((video: any) => {
                      const title = isHindi ? (video.title_hi || video.titleHi || video.title || video.titleEn) : (video.title || video.titleEn);
                      const embedUrl = video.embedUrl || video.url;
                      return (
                        <div key={video.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                          <div className="aspect-video w-full bg-slate-900">
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                title={title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                Video Stream
                              </div>
                            )}
                          </div>
                          <div className="p-3.5">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {title}
                            </h4>
                            {video.date && (
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                {video.date}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 9. LIST OF HOLIDAYS MODAL ── */}
      {activeModal === 'holidays' && (() => {
        const holPage = findDbPage('holiday');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'आधिकारिक अवकाश सूची 2026' : 'Official List Of Holidays 2026'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - Dual Holiday Calendar</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 bg-slate-50">
                <button
                  onClick={() => setHolidayViewTab('calendar')}
                  className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    holidayViewTab === 'calendar' 
                      ? 'border-blue-900 text-blue-900 bg-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHindi ? 'तालिका दृश्य' : 'Structured Calendar'}
                </button>
                {holPage?.content && (
                  <button
                    onClick={() => setHolidayViewTab('table')}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                      holidayViewTab === 'table' 
                        ? 'border-blue-900 text-blue-900 bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isHindi ? 'आधिकारिक परिपत्र' : 'Official Circular'}
                  </button>
                )}
              </div>

              <div className="p-6 overflow-y-auto">
                {holidayViewTab === 'table' && holPage?.content ? (
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: isHindi ? (holPage.content_hi || holPage.content) : holPage.content }}
                  />
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setHolidayFilter('all')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${holidayFilter === 'all' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'}`}
                      >
                        {isHindi ? 'सभी अवकाश' : 'All Holidays'}
                      </button>
                      <button
                        onClick={() => setHolidayFilter('closed')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${holidayFilter === 'closed' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'}`}
                      >
                        {isHindi ? 'बंद अवकाश (Closed Holidays)' : 'Closed Holidays (India)'}
                      </button>
                      <button
                        onClick={() => setHolidayFilter('federal')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${holidayFilter === 'federal' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'}`}
                      >
                        {isHindi ? 'मेजबान राष्ट्र बैंक / संघीय अवकाश' : 'Host Nation Bank / Federal Holidays'}
                      </button>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 bg-slate-100 text-[13px] font-bold text-slate-700">
                          <th className="py-3 px-4 w-12">#</th>
                          <th className="py-3 px-4">{isHindi ? 'अवकाश का नाम' : 'Holiday Name'}</th>
                          <th className="py-3 px-4">{isHindi ? 'तिथि' : 'Date'}</th>
                          <th className="py-3 px-4">{isHindi ? 'दिन' : 'Day'}</th>
                          <th className="py-3 px-4">{isHindi ? 'प्रकार' : 'Category'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                        {filteredHolidays.map((hol, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {isHindi ? hol.nameHi : hol.nameEn}
                            </td>
                            <td className="py-3 px-4 font-semibold text-blue-900 whitespace-nowrap">
                              {hol.date}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {isHindi ? hol.dayHi : hol.dayEn}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${hol.type === 'Closed Holiday' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {isHindi ? (hol.type === 'Closed Holiday' ? 'राजपत्रित बंद अवकाश' : 'स्थानीय बैंक अवकाश') : hol.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 10. CONTACT US & GOOGLE MAPS MODAL ── */}
      {activeModal === 'contact' && (() => {
        const contactPage = findDbPage('contact');
        const contactInfo = dbData?.contact;
        const addressDisplay = isHindi ? (contactInfo?.address_hi || officeData.addressHi) : (contactInfo?.address_en || officeData.addressEn);
        const phoneDisplay = contactInfo?.phone || officeData.phone;
        const emailDisplay = contactInfo?.email || officeData.email;
        const officeHoursDisplay = isHindi ? (contactInfo?.working_hours || officeData.officeHoursHi) : (contactInfo?.working_hours || officeData.officeHoursEn);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'कार्यालय संपर्क एवं मानचित्र' : 'Office Contact & Interactive Map'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - {effectiveLocation}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-6">
                {contactPage?.content && (
                  <div 
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: isHindi ? (contactPage.content_hi || contactPage.content) : contactPage.content }}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{isHindi ? 'कार्यालय का समय' : 'Office Hours'}</span>
                      <p className="text-sm font-semibold text-slate-800 flex items-center gap-2 mt-0.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        {officeHoursDisplay}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{isHindi ? 'पता' : 'Address'}</span>
                      <p className="text-sm text-slate-700 mt-0.5">
                        {addressDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{isHindi ? 'दूरभाष / टेलीफोन' : 'Telephone'}</span>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">
                        <a href={`tel:${phoneDisplay.split('/')[0].trim()}`} className="hover:underline text-blue-900">
                          {phoneDisplay}
                        </a>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{isHindi ? 'आधिकारिक ईमेल (स्पैम सुरक्षा)' : 'Official Email (Anti-Spam)'}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-800 font-mono select-all">
                          {emailDisplay.replace(/@/g, '[at]').replace(/\./g, '[dot]')}
                        </code>
                        <button
                          onClick={() => handleCopyEmail(emailDisplay)}
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded font-medium transition-colors cursor-pointer"
                        >
                          {copyEmailSuccess ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'कॉपी करें' : 'Copy')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="w-full h-[320px] rounded-lg overflow-hidden border border-slate-300 shadow-inner relative">
                  <iframe
                    title="Google Maps Location"
                    className="w-full h-full border-0"
                    src={officeData.gmapEmbedUrl}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
                {effectiveExternalUrl && (
                  <a 
                    href={effectiveExternalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-800 hover:underline flex items-center gap-1"
                  >
                    <span>{isHindi ? 'आधिकारिक पोर्टल लिंक' : 'Visit Official Portal Page'}</span>
                    <span>↗</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 11. STAFF DIRECTORY MODAL ── */}
      {activeModal === 'staff' && (() => {
        const filteredStaff = staffList.filter((officer: any) => {
          // Category filter
          if (staffCategory === 'leadership') {
            const desig = (officer.designation || '').toLowerCase();
            if (!desig.includes('director') && officer.designation_id !== 1 && officer.designation_id !== 2) return false;
          }
          if (staffCategory === 'audit') {
            const desig = (officer.designation || '').toLowerCase();
            if (!desig.includes('audit officer') && !desig.includes('sao') && !desig.includes('aao')) return false;
          }
          if (staffCategory === 'admin') {
            const desig = (officer.designation || '').toLowerCase();
            if (desig.includes('director') || desig.includes('audit officer')) return false;
          }

          // Search query filter
          if (staffSearch.trim()) {
            const q = staffSearch.toLowerCase();
            const nEn = (officer.officer_name || '').toLowerCase();
            const nHi = (officer.officer_name_hi || '').toLowerCase();
            const desig = (officer.designation || '').toLowerCase();
            const email = (officer.email || '').toLowerCase();
            return nEn.includes(q) || nHi.includes(q) || desig.includes(q) || email.includes(q);
          }
          return true;
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'अधिकारी एवं कर्मचारी निर्देशिका' : 'Staff Directory & Officer Roster'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} ({staffList.length} {isHindi ? 'कुल पदस्थापित कर्मी' : 'Deployed Personnel'})</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setStaffCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      staffCategory === 'all' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    {isHindi ? 'सभी कर्मचारी' : 'All Staff'} ({staffList.length})
                  </button>
                  <button
                    onClick={() => setStaffCategory('leadership')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      staffCategory === 'leadership' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    {isHindi ? 'नेतृत्व (PD/Director)' : 'Leadership'}
                  </button>
                  <button
                    onClick={() => setStaffCategory('audit')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      staffCategory === 'audit' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    {isHindi ? 'लेखापरीक्षा संवर्ग (SAO/AAO)' : 'Audit Cadre'}
                  </button>
                  <button
                    onClick={() => setStaffCategory('admin')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      staffCategory === 'admin' ? 'bg-blue-900 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    {isHindi ? 'प्रशासन एवं अन्य' : 'Administration'}
                  </button>
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder={isHindi ? 'कर्मचारी का नाम या पद खोजें...' : 'Search staff by name or role...'}
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((officer) => {
                      const name = isHindi ? (officer.officer_name_hi || officer.officer_name) : officer.officer_name;
                      const desig = isHindi ? (officer.designation_hi || officer.designation) : officer.designation;
                      const obfuscatedEmail = officer.email ? officer.email.replace(/@/g, '[at]').replace(/\./g, '[dot]') : '';

                      return (
                        <div 
                          key={officer.id}
                          className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all items-start"
                        >
                          <img 
                            src={officer.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'} 
                            alt={officer.officer_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm shrink-0 bg-slate-100"
                          />
                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-bold">
                                #{officer.seniority_order || officer.id}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {name}
                              </h4>
                            </div>
                            <p className="text-xs font-semibold text-emerald-800">
                              {desig}
                            </p>
                            {officer.bio && (
                              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                                {isHindi ? (officer.bio_hi || officer.bio) : officer.bio}
                              </p>
                            )}

                            <div className="flex flex-col gap-1 text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                              {officer.phone && <span>📞 {officer.phone}</span>}
                              {officer.email && (
                                <div className="flex items-center gap-1.5">
                                  <code className="text-[11px] font-mono text-blue-800 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {obfuscatedEmail}
                                  </code>
                                  <button
                                    onClick={() => handleCopyEmail(officer.email || '')}
                                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Copy
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => setSelectedOfficer(officer)}
                              className="mt-2 text-xs font-semibold text-blue-900 hover:underline text-left cursor-pointer flex items-center gap-1"
                            >
                              <span>{isHindi ? 'विस्तृत परिचय देखें' : 'View Officer Profile'}</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-8 text-center text-slate-500">
                      {isHindi ? 'कोई कर्मचारी रिकॉर्ड नहीं मिला।' : 'No staff members found matching query.'}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
                {officeData.staffDetailsPdfUrl && (
                  <a
                    href={officeData.staffDetailsPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                  >
                    <span>📄 {isHindi ? 'स्टाफ विवरण पीडीएफ डाउनलोड करें' : 'Download Staff Details PDF'}</span>
                    <span>↗</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer ml-auto"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 12. QUICK LINKS FLOATING ACTION MENU ── */}
      {activeModal === 'quick_links' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <h3 className="text-base font-bold">{isHindi ? 'त्वरित कार्य एवं नेविगेशन' : 'Quick Actions & Portal Links'}</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveModal('history')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">📜</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'संक्षिप्त इतिहास' : 'Brief History'}</span>
              </button>
              <button
                onClick={() => setActiveModal('directors')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">👔</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'निदेशक सूची' : 'Directors'}</span>
              </button>
              <button
                onClick={() => setActiveModal('pds')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">🎖️</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'प्रधान निदेशक' : 'List Of PDs'}</span>
              </button>
              <button
                onClick={() => setActiveModal('org_structure')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">🌳</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'संगठन ढांचा' : 'Org Structure'}</span>
              </button>
              <button
                onClick={() => setActiveModal('audit_jurisdiction')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">🌐</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'क्षेत्राधिकार' : 'Jurisdiction'}</span>
              </button>
              <button
                onClick={() => setActiveModal('audit_process')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">📊</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'ऑडिट प्रक्रिया' : 'Audit Process'}</span>
              </button>
              <button
                onClick={() => setActiveModal('gallery')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">🖼️</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'फोटो गैलरी' : 'Gallery'}</span>
              </button>
              <button
                onClick={() => setActiveModal('holidays')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">📅</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'अवकाश सूची' : 'Holidays'}</span>
              </button>
              <button
                onClick={() => setActiveModal('contact')}
                className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="text-2xl">📍</span>
                <span className="text-xs font-bold text-slate-800">{isHindi ? 'स्थान एवं मानचित्र' : 'Contact & Map'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 13. FULLSCREEN IMAGE LIGHTBOX ── */}
      {gallerySelectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-pointer"
          onClick={() => setGallerySelectedImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={gallerySelectedImg} alt="Enlarged gallery view" className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl" />
            <button 
              onClick={() => setGallerySelectedImg(null)}
              className="absolute top-[-40px] right-0 text-white text-2xl font-bold bg-white/20 hover:bg-white/30 rounded-full w-9 h-9 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── 14. OFFICER PROFILE MODAL (Live DB Bio & Picture) ── */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <h2 className="text-lg font-bold">
                    {isHindi ? (selectedOfficer.officer_name_hi || selectedOfficer.officer_name) : selectedOfficer.officer_name}
                  </h2>
                  <p className="text-xs text-white/80">
                    {isHindi ? (selectedOfficer.designation_hi || selectedOfficer.designation) : selectedOfficer.designation} - {effectiveOfficeName}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOfficer(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-36 h-44 rounded-xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 shrink-0 mx-auto sm:mx-0">
                  <img
                    src={selectedOfficer.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={selectedOfficer.officer_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 font-['Noto_Sans']">
                    {isHindi ? (selectedOfficer.officer_name_hi || selectedOfficer.officer_name) : selectedOfficer.officer_name}
                  </h3>
                  <p className="text-sm font-semibold text-[#0A3D30]">
                    {isHindi ? (selectedOfficer.designation_hi || selectedOfficer.designation) : selectedOfficer.designation}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {effectiveOfficeName}, {effectiveLocation}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
                    {selectedOfficer.email && (
                      <span className="font-mono text-blue-800">✉ {selectedOfficer.email}</span>
                    )}
                    {selectedOfficer.phone && (
                      <span>📞 {selectedOfficer.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Biography Details */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  {isHindi ? 'अधिकारी परिचय एवं विवरण' : 'Officer Biography & Profile Details'}
                </h4>
                {selectedOfficer.bio_html || selectedOfficer.bio ? (
                  <div
                    className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                    dangerouslySetInnerHTML={{ __html: selectedOfficer.bio_html || selectedOfficer.bio }}
                  />
                ) : (
                  <p className="text-sm text-slate-600 italic">
                    {isHindi ? 'विस्तृत जीवनी विवरण कार्यालय रिकॉर्ड में उपलब्ध है।' : 'Detailed biographical record available on official office records.'}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 15. STANDARD POLICY & LEGAL CMS MODALS ── */}
      {activeModal && ['terms_conditions', 'privacy_policy', 'copyright_policy', 'hyperlinking_policy', 'accessibility_statement', 'disclaimer', 'archive'].includes(activeModal) && (() => {
        const policySlugMap: Record<string, string> = {
          terms_conditions: 'terms_conditions',
          privacy_policy: 'privacy_policy',
          copyright_policy: 'copyright_policy',
          hyperlinking_policy: 'hyperlinking_policy',
          accessibility_statement: 'accessibility_statement',
          disclaimer: 'disclaimer',
          archive: 'archive'
        };

        const policyMeta: Record<string, { icon: string; titleEn: string; titleHi: string; defaultContentEn: string; defaultContentHi: string }> = {
          terms_conditions: {
            icon: '📜',
            titleEn: 'Terms & Conditions',
            titleHi: 'नियम और शर्तें',
            defaultContentEn: `<p>This website is designed, developed and maintained by the Office of the Comptroller and Auditor General of India (CAG). Though all efforts have been made to ensure the accuracy and currency of the content on this website, the same should not be construed as a statement of law or used for any legal purposes.</p><p>In case of any ambiguity or doubts, users are advised to verify/check with the Directorate of Overseas Audit and/or other source(s), and to obtain appropriate professional advice.</p><p>Under no circumstances will the CAG of India be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this website.</p><p>These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any dispute arising under these terms and conditions shall be subject to the exclusive jurisdiction of the courts of India.</p>`,
            defaultContentHi: `<p>यह वेबसाइट भारत के नियंत्रक एवं महालेखापरीक्षक (सीएजी) के कार्यालय द्वारा परिकल्पित, विकसित और अनुरक्षित है। यद्यपि इस वेबसाइट पर सामग्री की सटीकता और प्रासंगिकता सुनिश्चित करने के लिए सभी प्रयास किए गए हैं, फिर भी इसे कानून का बयान नहीं माना जाना चाहिए और न ही किसी कानूनी उद्देश्य के लिए उपयोग किया जाना चाहिए।</p><p>किसी भी अस्पष्टता या संदेह की स्थिति में, उपयोगकर्ताओं को सलाह दी जाती है कि वे विदेशी लेखापरीक्षा निदेशालय और/या अन्य स्रोतों से सत्यापन/जांच करें और उचित पेशेवर सलाह प्राप्त करें।</p><p>किसी भी परिस्थिति में भारत के नियंत्रक-महालेखापरीक्षक किसी भी खर्च, हानि या क्षति के लिए उत्तरदायी नहीं होंगे, जिसमें बिना किसी सीमा के अप्रत्यक्ष या परिणामी नुकसान शामिल है।</p><p>ये नियम और शर्तें भारतीय कानूनों के अनुसार शासित और मानी जाएंगी।</p>`
          },
          privacy_policy: {
            icon: '🔒',
            titleEn: 'Privacy Policy',
            titleHi: 'गोपनीयता नीति',
            defaultContentEn: `<p>As a general rule, this website does not automatically capture any specific personal information from you (like name, phone number or e-mail address) that allows us to identify you individually.</p><p>If the website requests you to provide personal information, you will be informed for the particular purposes for which information is gathered and adequate security measures will be taken to protect your personal information.</p><p>We do not sell or share any personally identifiable information volunteered on this site to any third party (public/private). Any information provided to this website will be protected from loss, misuse, unauthorized access or disclosure, alteration, or destruction.</p><p>We gather certain information about the User, such as Internet protocol (IP) addresses, domain name, browser type, operating system, the date and time of the visit and the pages visited. We make no attempt to link these addresses with the identity of individuals visiting our site unless an attempt to damage the site has been detected.</p>`,
            defaultContentHi: `<p>सामान्य नियम के रूप में, यह वेबसाइट आपसे कोई विशिष्ट व्यक्तिगत जानकारी (जैसे नाम, फोन नंबर या ई-मेल पता) स्वचालित रूप से प्राप्त नहीं करती है, जिससे कि आपकी व्यक्तिगत पहचान हो सके।</p><p>यदि वेबसाइट आपसे व्यक्तिगत जानकारी प्रदान करने का अनुरोध करती है, तो आपको उन विशिष्ट उद्देश्यों के बारे में सूचित किया जाएगा जिनके लिए जानकारी एकत्र की जाती है और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए पर्याप्त सुरक्षा उपाय किए जाएंगे।</p><p>हम इस साइट पर स्वेच्छा से दी गई किसी भी व्यक्तिगत पहचान योग्य जानकारी को किसी तीसरे पक्ष (सार्वजनिक/निजी) को नहीं बेचते या साझा नहीं करते हैं।</p>`
          },
          copyright_policy: {
            icon: '⚖️',
            titleEn: 'Copyright Policy',
            titleHi: 'कॉपीराइट नीति',
            defaultContentEn: `<p>Material featured on this website may be reproduced free of charge in any format or media without requiring specific permission, subject to the material being reproduced accurately and not being used in a derogatory manner or in a misleading context.</p><p>Where the material is being published or issued to others, the source must be prominently acknowledged to the <strong>Comptroller and Auditor General of India</strong>.</p><p>However, the permission to reproduce this material shall not extend to any material on this site which is identified as being the copyright of a third party. Authorisation to reproduce such material must be obtained from the copyright holders concerned.</p>`,
            defaultContentHi: `<p>इस वेबसाइट पर प्रदर्शित सामग्री को किसी भी प्रारूप या मीडिया में बिना किसी विशिष्ट अनुमति के नि:शुल्क पुन: प्रस्तुत किया जा सकता है, बशर्ते कि सामग्री को सटीक रूप से पुन: प्रस्तुत किया जाए और इसका उपयोग अपमानजनक तरीके से या भ्रामक संदर्भ में न किया जाए।</p><p>जहां सामग्री दूसरों को प्रकाशित या जारी की जा रही है, वहां स्रोत को <strong>भारत के नियंत्रक एवं महालेखापरीक्षक</strong> के रूप में प्रमुखता से स्वीकार किया जाना चाहिए।</p><p>हालांकि, इस सामग्री को पुन: प्रस्तुत करने की अनुमति इस साइट की किसी भी ऐसी सामग्री पर लागू नहीं होगी जिसे तीसरे पक्ष के कॉपीराइट के रूप में पहचाना गया है।</p>`
          },
          hyperlinking_policy: {
            icon: '🔗',
            titleEn: 'Hyperlinking Policy',
            titleHi: 'हाइपरलिंकिंग नीति',
            defaultContentEn: `<p><strong>Links to External Websites/Portals:</strong> At many places in this website, you shall find links to other websites/portals. These links have been placed for your convenience. The CAG of India is not responsible for the contents and reliability of the linked websites and does not necessarily endorse the views expressed into them. Mere presence of the link or its listing on this website should not be assumed as endorsement of any kind. We cannot guarantee that these links will work all the time and we have no control over availability of linked pages.</p><p><strong>Links to this Website by other Websites:</strong> Prior permission is required before hyperlinks are directed from any website to this site. Permission for the same, stating the nature of the content on the pages from where the link has to be given and the exact language of the Hyperlink should be obtained by sending a request to the Directorate of Overseas Audit.</p>`,
            defaultContentHi: `<p><strong>बाहरी वेबसाइटों/पोर्टल के लिंक:</strong> इस वेबसाइट में कई स्थानों पर आपको अन्य वेबसाइटों/पोर्टल के लिंक मिलेंगे। ये लिंक आपकी सुविधा के लिए रखे गए हैं। भारत के सीएजी लिंक की गई वेबसाइटों की सामग्री और विश्वसनीयता के लिए ज़िम्मेदार नहीं हैं और जरूरी नहीं कि वे उनमें व्यक्त विचारों का समर्थन करते हों।</p><p><strong>अन्य वेबसाइटों द्वारा इस वेबसाइट के लिंक:</strong> किसी भी वेबसाइट से इस साइट पर हाइपरलिंक निर्देशित करने से पहले पूर्व अनुमति आवश्यक है।</p>`
          },
          accessibility_statement: {
            icon: '♿',
            titleEn: 'Accessibility Statement',
            titleHi: 'अभिगम्यता वक्तव्य',
            defaultContentEn: `<p>We are committed to ensuring that the CAG Overseas Audit Portal is accessible to all users, regardless of device, technology or ability. It has been built with an aim to comply with the <strong>Guidelines for Indian Government Websites (GIGW 3.0)</strong> and adheres to Level AA of the Web Content Accessibility Guidelines (WCAG 2.1).</p><p>Using this portal, visitors with visual impairments can access information using assistive technologies, such as screen readers and screen magnifiers. The website is designed to be usable across mobile devices, tablets, and desktop workstations with standard keyboard shortcuts.</p><p>If you have any problem or suggestion regarding the accessibility of this website, please use the Contact Us page to provide feedback.</p>`,
            defaultContentHi: `<p>हम यह सुनिश्चित करने के लिए प्रतिबद्ध हैं कि सीएजी विदेशी लेखापरीक्षा पोर्टल उपकरण, प्रौद्योगिकी या क्षमता की परवाह किए बिना सभी उपयोगकर्ताओं के लिए सुलभ हो। इसे <strong>भारतीय सरकारी वेबसाइटों के लिए दिशा-निर्देश (GIGW 3.0)</strong> का अनुपालन करने और वेब सामग्री अभिगम्यता दिशा-निर्देश (WCAG 2.1) के स्तर AA का पालन करने के उद्देश्य से बनाया गया है।</p><p>इस पोर्टल का उपयोग करके, दृष्टिबाधित आगंतुक स्क्रीन रीडर और स्क्रीन मैग्निफायर जैसी सहायक तकनीकों का उपयोग करके जानकारी तक पहुंच सकते हैं।</p>`
          },
          disclaimer: {
            icon: 'ℹ️',
            titleEn: 'Disclaimer',
            titleHi: 'अस्वीकरण',
            defaultContentEn: `<p>The information contained in this website is for general guidance and information purposes only. While every care has been taken in preparing the information, the Office of the Comptroller and Auditor General of India accepts no responsibility or liability for any errors, omissions, or misleading statements.</p><p>For official audit reports, constitutional tabling in Parliament, and statutory notifications, reference should always be made to the printed editions laid on the table of the Houses of Parliament or published in the Gazette of India.</p>`,
            defaultContentHi: `<p>इस वेबसाइट में निहित जानकारी केवल सामान्य मार्गदर्शन और सूचना के उद्देश्यों के लिए है। जानकारी तैयार करने में पूरी सावधानी बरती गई है, फिर भी भारत के नियंत्रक एवं महालेखापरीक्षक का कार्यालय किसी भी त्रुटि, चूक या भ्रामक बयान के लिए कोई दायित्व स्वीकार नहीं करता है।</p>`
          },
          archive: {
            icon: '🏛️',
            titleEn: 'Archive & Historical Records',
            titleHi: 'अभिलेखागार एवं ऐतिहासिक अभिलेख',
            defaultContentEn: `<p>The Archive repository maintains historical records, retired statutory circulars, superseded audit guidelines, and previous annual audit workplans of the Directorate of Overseas Audit in accordance with the Public Records Act, 1993 and the CAG's Record Retention Policy.</p><p>For access to archived audit records, researchers and institutional applicants may direct formal inquiries to the Director (Audit) or apply through the Right to Information portal.</p>`,
            defaultContentHi: `<p>अभिलेखागार रिपॉजिटरी लोक रिकॉर्ड अधिनियम, 1993 और सीएजी की रिकॉर्ड प्रतिधारण नीति के अनुसार विदेशी लेखापरीक्षा निदेशालय के ऐतिहासिक रिकॉर्ड, पूर्व सांविधिक परिपत्रों और पिछले वार्षिक लेखापरीक्षा कार्ययोजनाओं का अनुरक्षण करती है।</p>`
          }
        };

        const pageKey = policySlugMap[activeModal];
        const dbPage = findDbPage(pageKey);
        const meta = policyMeta[activeModal] || {
          icon: '📄',
          titleEn: 'Policy Information',
          titleHi: 'नीति विवरण',
          defaultContentEn: '<p>Content for this section is currently being updated in accordance with official guidelines.</p>',
          defaultContentHi: '<p>इस अनुभाग की सामग्री आधिकारिक दिशा-निर्देशों के अनुसार अद्यतन की जा रही है।</p>'
        };

        const title = isHindi 
          ? (dbPage?.title_hi || dbPage?.title || meta.titleHi)
          : (dbPage?.title || meta.titleEn);

        const contentHtml = isHindi 
          ? (dbPage?.content_hi || dbPage?.content || meta.defaultContentHi)
          : (dbPage?.content || meta.defaultContentEn);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - GIGW 3.0 Compliance</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-800 text-sm leading-relaxed">
                <div 
                  className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:text-xs [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5 [&_td]:text-xs [&_td]:text-slate-800 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:font-bold [&_strong]:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-500">
                  {isHindi ? 'अंतिम अद्यतन: 2026 | भारत का नियंत्रक एवं महालेखापरीक्षक' : 'Last Updated: 2026 | Comptroller and Auditor General of India'}
                </span>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 16. SCREEN READER ACCESS MODAL ── */}
      {activeModal === 'screen_reader' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👁️</span>
                <div>
                  <h2 className="text-lg font-bold">{isHindi ? 'स्क्रीन रीडर अभिगम्यता एवं सहायता' : 'Screen Reader Access & Assistance'}</h2>
                  <p className="text-xs text-white/80">{effectiveOfficeName} - GIGW 3.0 / WCAG 2.1 AA Compliance</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-slate-800 text-sm">
              <div>
                <p className="leading-relaxed mb-3">
                  {isHindi
                    ? 'भारत के नियंत्रक एवं महालेखापरीक्षक का विदेशी पोर्टल विभिन्न स्क्रीन रीडर तकनीकों के साथ पूरी तरह संगत है ताकि दृष्टिबाधित आगंतुक भी आसानी से सामग्री तक पहुंच सकें।'
                    : 'The CAG Overseas Portal complies with World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. Visitors with visual impairments can access information using assistive technologies such as screen readers and screen magnifiers.'}
                </p>
              </div>

              {/* Supported Screen Readers Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-700 uppercase tracking-wider">
                  {isHindi ? 'समर्थित स्क्रीन रीडर सॉफ्टवेयर' : 'Compatible Screen Reader Assistive Technologies'}
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-4">{isHindi ? 'स्क्रीन रीडर' : 'Screen Reader'}</th>
                      <th className="py-2.5 px-4">{isHindi ? 'वेबसाइट / डेवलपर' : 'Developer / Source'}</th>
                      <th className="py-2.5 px-4">{isHindi ? 'प्रकार' : 'License'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-blue-950">Non Visual Desktop Access (NVDA)</td>
                      <td className="py-2.5 px-4">NV Access (Open Source)</td>
                      <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{isHindi ? 'नि:शुल्क' : 'Free'}</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-blue-950">Job Access With Speech (JAWS)</td>
                      <td className="py-2.5 px-4">Freedom Scientific</td>
                      <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{isHindi ? 'व्यावसायिक' : 'Commercial'}</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-blue-950">Windows Narrator</td>
                      <td className="py-2.5 px-4">Microsoft Corporation (Built-in Windows OS)</td>
                      <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{isHindi ? 'नि:शुल्क (इनबिल्ट)' : 'Free (Built-in)'}</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-blue-950">Apple VoiceOver</td>
                      <td className="py-2.5 px-4">Apple Inc. (macOS / iOS)</td>
                      <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{isHindi ? 'नि:शुल्क (इनबिल्ट)' : 'Free (Built-in)'}</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-blue-950">Google TalkBack</td>
                      <td className="py-2.5 px-4">Google LLC (Android OS)</td>
                      <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{isHindi ? 'नि:शुल्क (इनबिल्ट)' : 'Free (Built-in)'}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Access Shortcuts */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2">
                  {isHindi ? 'त्वरित एक्सेस कुंजियाँ एवं कीबोर्ड नेविगेशन' : 'Key Accessibility Keyboard Shortcuts'}
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                  <li><span className="font-semibold text-slate-900">Tab / Shift + Tab:</span> {isHindi ? 'इंटरैक्टिव तत्वों और मेनू के बीच आगे/पीछे जाएँ।' : 'Navigate forwards and backwards across interactive portal elements.'}</li>
                  <li><span className="font-semibold text-slate-900">Enter / Space:</span> {isHindi ? 'चयनित बटन या मोडल को खोलें या सक्रिय करें।' : 'Activate highlighted navigation item, dialog or button.'}</li>
                  <li><span className="font-semibold text-slate-900">Esc:</span> {isHindi ? 'सक्रिय मोडल विंडो को तुरंत बंद करें।' : 'Immediately dismiss any open modal window.'}</li>
                  <li><span className="font-semibold text-slate-900">Top Header Controls:</span> {isHindi ? 'फ़ॉन्ट आकार (A- / A / A+) और उच्च कंट्रास्ट (WOB / Std) को किसी भी समय शीर्ष पट्टी से बदला जा सकता है।' : 'Font scale (A- / A / A+) and High Contrast mode toggles are accessible at all times in the top utility bar.'}</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 17. IAAD KNOWLEDGE MANAGEMENT SYSTEM (KMS) MODAL ── */}
      {activeModal === 'kms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h2 className="text-lg font-bold">{isHindi ? 'आईएएडी ज्ञान प्रबंधन प्रणाली (KMS)' : 'IAAD Knowledge Management System (KMS)'}</h2>
                  <p className="text-xs text-white/80">Indian Audit and Accounts Department Institutional Knowledge Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-slate-800 text-sm">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm mb-1">
                    {isHindi ? 'केन्द्रीय ज्ञान भंडार एवं ऑडिट दिशानिर्देश' : 'Central Knowledge Repository & Audit Guidance'}
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    {isHindi
                      ? 'भारतीय लेखापरीक्षा एवं लेखा विभाग (IA&AD) का ज्ञान प्रबंधन प्रणाली पोर्टल विभाग के पेशेवरों के लिए लेखापरीक्षा मानकों, केस स्टडीज, विषय-वार ऑडिट मैनुअल, और अंतर्राष्ट्रीय (INTOSAI/ASOSAI) सर्वोत्तम प्रथाओं का एक व्यवस्थित संग्रह उपलब्ध कराता है।'
                      : 'The Knowledge Management System (KMS) serves as the institutional repository for the Indian Audit & Accounts Department. It aggregates auditing standards (ISSAI/INTOSAI), sector-specific inspection manuals, subject-matter practice notes, case law digests, and digital audit training modules.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                    {isHindi ? 'विदेशी लेखापरीक्षा के लिए विशेष सामग्री' : 'Overseas Audit Knowledge Modules'}
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                    <li>Diplomatic Mission Audit Guidelines</li>
                    <li>Foreign Exchange & Remittance Verification Rules</li>
                    <li>Chancery Property Valuation & Maintenance Norms</li>
                    <li>Public Sector Undertaking (PSU) Overseas Branch Audits</li>
                  </ul>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                    {isHindi ? 'प्रणाली पहुंच एवं सुरक्षा' : 'System Access & Authentication'}
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                    <li>Single Sign-On (SSO) via Departmental Credentials</li>
                    <li>Role-Based Document Access Levels</li>
                    <li>Continuous Real-Time Knowledge Updating</li>
                    <li>Encrypted Intra-Departmental Transmission</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                <span>
                  {isHindi
                    ? 'आधिकारिक केन्द्रीय आईएएडी केएमएस पोर्टल देखने के लिए नीचे दिए गए बटन पर क्लिक करें:'
                    : 'To access the central IAAD Knowledge Management System repository on cag.gov.in, use the external portal link:'}
                </span>
                <a
                  href="https://cag.gov.in/en/iaad-kms-content"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0 ml-3"
                >
                  <span>{isHindi ? 'केएमएस पोर्टल खोलें' : 'Launch IAAD KMS'}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 18. INTERACTIVE SUBSITE MAP MODAL ── */}
      {activeModal === 'sitemap' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h2 className="text-lg font-bold">{isHindi ? 'वेबसाइट रूपरेखा (साइटमैप)' : 'Subsite Map & Navigation Directory'}</h2>
                  <p className="text-xs text-white/80">{effectiveOfficeName} - Complete Hierarchical Directory</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-800">
              {/* Section 1: Home & Overview */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>🏠</span>
                  <span>{isHindi ? '1. मुख्य पृष्ठ (Home)' : '1. Home'}</span>
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => setActiveModal(null)} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'मुख्य पोर्टल पृष्ठ' : 'Portal Landing Page'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveModal('quick_links')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'त्वरित नेविगेशन मेनू' : 'Quick Actions & Portal Links'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 2: About Us */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>📜</span>
                  <span>{isHindi ? '2. हमारे बारे में (About Us)' : '2. About Us'}</span>
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => { setActiveModal('history'); setHistoryTab('history'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'कार्यालय का संक्षिप्त इतिहास' : 'Brief History of Office'}
                    </button>
                  </li>
                  {slug.includes('london') && (
                    <li>
                      <button onClick={() => { setActiveModal('history'); setHistoryTab('chancery'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                        • {isHindi ? 'इंडिया हाउस चैंसरी इतिहास' : 'India House Chancery History'}
                      </button>
                    </li>
                  )}
                  {slug.includes('kualalumpur') && (
                    <li>
                      <button onClick={() => { setActiveModal('history'); setHistoryTab('vision'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                        • {isHindi ? 'दृष्टिकोण, ध्येय एवं मूल मूल्य' : 'Vision, Mission & Core Values'}
                      </button>
                    </li>
                  )}
                  <li>
                    <button onClick={() => setActiveModal('directors')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'निदेशकों की सूची (List Of Directors)' : 'List Of Directors'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveModal('pds')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'प्रधान निदेशकों की सूची (List Of PDs)' : 'List Of Principal Directors'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 3: Organisational Structure */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>🌳</span>
                  <span>{isHindi ? '3. संगठनात्मक संरचना' : '3. Organisational Structure'}</span>
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => setActiveModal('org_structure')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'संगठनात्मक पदानुक्रम चार्ट' : 'Organizational Hierarchy Chart'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveModal('staff')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'कर्मचारी विवरण एवं निर्देशिका' : 'Staff Details & Officer Roster'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 4: Audit Functions */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>⚖️</span>
                  <span>{isHindi ? '4. लेखापरीक्षा कार्य (Audit Functions)' : '4. Audit Functions'}</span>
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => setActiveModal('audit_admin_fn')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'प्रशासनिक कार्य (Administrative Function)' : 'Administrative Function'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveModal('audit_jurisdiction'); setJurisdictionTab('structured'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'लेखापरीक्षा क्षेत्राधिकार (Audit Jurisdiction)' : 'Audit Jurisdiction'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveModal('audit_jurisdiction'); setJurisdictionTab('maps'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'मानचित्र आधारित क्षेत्राधिकार' : 'Map-wise Audit Jurisdiction'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveModal('audit_process')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'लेखापरीक्षा प्रक्रिया (Audit Process)' : 'Audit Process (6-Stage Lifecycle)'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 5: Gallery & Media */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>🖼️</span>
                  <span>{isHindi ? '5. दीर्घा (Gallery)' : '5. Gallery'}</span>
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => { setActiveModal('gallery'); setGalleryTab('photos'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'फोटो गैलरी (Photo Gallery)' : 'Photo Gallery'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setActiveModal('gallery'); setGalleryTab('videos'); }} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'वीडियो गैलरी (Video Gallery)' : 'Video Gallery'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 6: Holidays & Contact */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>📅</span>
                  <span>{isHindi ? '6. अवकाश एवं संपर्क' : '6. Holidays & Contact'}</span>
                </h4>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => setActiveModal('holidays')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'अवकाश सूची (List Of Holidays)' : 'List Of Holidays'}
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveModal('contact')} className="text-blue-900 hover:underline font-semibold cursor-pointer text-left">
                      • {isHindi ? 'संपर्क करें एवं मानचित्र (Contact Us & Map)' : 'Contact Us & Map'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Section 7: Policies & Standards */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 lg:col-span-3">
                <h4 className="font-bold text-sm text-blue-950 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>{isHindi ? '7. नीतियां, अभिगम्यता एवं सहायता (Policies & Utilities)' : '7. Policies, Accessibility & Utilities'}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => setActiveModal('terms_conditions')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'नियम और शर्तें' : 'Terms & Conditions'}
                  </button>
                  <button onClick={() => setActiveModal('privacy_policy')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'गोपनीयता नीति' : 'Privacy Policy'}
                  </button>
                  <button onClick={() => setActiveModal('copyright_policy')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'कॉपीराइट नीति' : 'Copyright Policy'}
                  </button>
                  <button onClick={() => setActiveModal('hyperlinking_policy')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'हाइपरलिंकिंग नीति' : 'Hyperlinking Policy'}
                  </button>
                  <button onClick={() => setActiveModal('accessibility_statement')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'अभिगम्यता वक्तव्य' : 'Accessibility Statement'}
                  </button>
                  <button onClick={() => setActiveModal('disclaimer')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'अस्वीकरण' : 'Disclaimer'}
                  </button>
                  <button onClick={() => setActiveModal('archive')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'अभिलेखागार' : 'Archive'}
                  </button>
                  <button onClick={() => setActiveModal('faqs')} className="text-left text-blue-900 hover:underline font-semibold cursor-pointer">
                    • {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQs'}
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 19. FREQUENTLY ASKED QUESTIONS (FAQS) MODAL ── */}
      {activeModal === 'faqs' && (() => {
        const defaultOverseasFaqs = [
          {
            qEn: 'What is the constitutional mandate of the Overseas Audit Directorate?',
            qHi: 'विदेशी लेखापरीक्षा निदेशालय का संवैधानिक अधिदेश क्या है?',
            aEn: 'Under Article 149 of the Constitution of India and Section 13 of the CAG (DPC) Act, 1971, the Comptroller and Auditor General of India audits all expenditure incurred from the Consolidated Fund of India by Indian Diplomatic Missions, Consulates, trade offices, and public sector units situated abroad.',
            aHi: 'भारत के संविधान के अनुच्छेद 149 और सीएजी (डीपीसी) अधिनियम, 1971 की धारा 13 के तहत, भारत के नियंत्रक और महालेखापरीक्षक विदेशों में स्थित भारतीय राजनयिक मिशनों, वाणिज्य दूतावासों, व्यापार कार्यालयों और सार्वजनिक क्षेत्र के उपक्रमों द्वारा भारत की संचित निधि से किए गए सभी व्यय का लेखापरीक्षा करते हैं।'
          },
          {
            qEn: 'Which entities fall under the jurisdiction of the London, Washington, and Kuala Lumpur directorates?',
            qHi: 'लंदन, वाशिंगटन और कुआलालंपुर निदेशालयों के क्षेत्राधिकार में कौन सी संस्थाएं आती हैं?',
            aEn: 'London directorate oversees Indian Missions and Consulates across Europe (UK, France, Germany, etc.) and overseas branches of PSUs. Washington DC oversees North and South America (USA, Canada, Brazil, etc.). Kuala Lumpur oversees Southeast Asia, East Asia, and Australasia (Malaysia, Singapore, Japan, Australia, etc.).',
            aHi: 'लंदन निदेशालय पूरे यूरोप में भारतीय मिशनों और वाणिज्य दूतावासों और पीएसयू की विदेशी शाखाओं की देखरेख करता है। वाशिंगटन डीसी उत्तर और दक्षिण अमेरिका की देखरेख करता है। कुआलालंपुर दक्षिण पूर्व एशिया, पूर्व एशिया और ऑस्ट्रेलिया की देखरेख करता है।'
          },
          {
            qEn: 'How are overseas audit findings reported and made public?',
            qHi: 'विदेशी लेखापरीक्षा निष्कर्षों की रिपोर्टिंग कैसे की जाती है और उन्हें सार्वजनिक कैसे किया जाता है?',
            aEn: 'Overseas audit findings are initially issued as Inspection Reports (IRs) to the Head of Chancery/Mission. Significant audit paras are incorporated into the CAG\'s Union Compliance Audit Report (Civil/External Affairs) and tabled before both Houses of Parliament under Article 151(1) of the Constitution.',
            aHi: 'लेखापरीक्षा निष्कर्ष शुरू में चांसरी/मिशन प्रमुख को निरीक्षण रिपोर्ट (आईआर) के रूप में जारी किए जाते हैं। महत्वपूर्ण निष्कर्षों को सीएजी की संघ अनुपालन लेखापरीक्षा रिपोर्ट में शामिल किया जाता है और संविधान के अनुच्छेद 151(1) के तहत संसद के दोनों सदनों के समक्ष प्रस्तुत किया जाता है।'
          },
          {
            qEn: 'Can Right to Information (RTI) applications be filed with overseas audit directorates?',
            qHi: 'क्या विदेशी लेखापरीक्षा निदेशालयों में सूचना का अधिकार (आरटीआई) आवेदन दायर किए जा सकते हैं?',
            aEn: 'Yes. Citizens may file RTI applications seeking information under the Right to Information Act, 2005. Applications may be submitted online via the national RTI portal (https://rtionline.gov.in) addressed to the Comptroller and Auditor General of India.',
            aHi: 'हाँ। नागरिक सूचना का अधिकार अधिनियम, 2005 के तहत जानकारी प्राप्त करने के लिए आरटीआई आवेदन दायर कर सकते हैं। आवेदन राष्ट्रीय आरटीआई पोर्टल (https://rtionline.gov.in) के माध्यम से ऑनलाइन प्रस्तुत किए जा सकते हैं।'
          }
        ];

        const rawFaqs = (dbData?.faqs && dbData.faqs.length > 0)
          ? dbData.faqs
          : (officeData.faqs && officeData.faqs.length > 0)
            ? officeData.faqs
            : defaultOverseasFaqs;

        const filteredFaqs = rawFaqs.filter((item: any) => {
          if (!faqSearch.trim()) return true;
          const q = faqSearch.toLowerCase();
          const qText = (item.question || item.qEn || item.qHi || '').toLowerCase();
          const aText = (item.answer || item.aEn || item.aHi || '').toLowerCase();
          return qText.includes(q) || aText.includes(q);
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❓</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' : 'Frequently Asked Questions (FAQs)'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - Public Information & Helpdesk</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <input
                  type="text"
                  placeholder={isHindi ? 'प्रश्नों या विषयों में खोजें...' : 'Search questions or topics...'}
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq: any, idx: number) => {
                    const qTitle = isHindi 
                      ? (faq.question_hi || faq.qHi || faq.question || faq.qEn)
                      : (faq.question || faq.qEn);
                    const aBody = isHindi 
                      ? (faq.answer_hi || faq.aHi || faq.answer || faq.aEn)
                      : (faq.answer || faq.aEn);
                    const isOpen = activeFaqIndex === idx;

                    return (
                      <div 
                        key={idx} 
                        className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 bg-white"
                      >
                        <button
                          onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                          className="w-full px-4 py-3.5 text-left flex justify-between items-center gap-3 bg-slate-50/70 hover:bg-blue-50/50 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span className="text-blue-900 font-extrabold">Q{idx + 1}.</span>
                            {qTitle}
                          </span>
                          <span className="text-slate-400 font-bold text-sm shrink-0">
                            {isOpen ? '▲' : '▼'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 py-3.5 border-t border-slate-200 text-xs text-slate-700 leading-relaxed bg-white">
                            <div 
                              className="prose prose-slate max-w-none text-xs"
                              dangerouslySetInnerHTML={{ __html: aBody }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    {isHindi ? 'कोई प्रश्न नहीं मिला।' : 'No FAQs found matching your search.'}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 20. ABOUT OVERVIEW MODAL ── */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <h2 className="text-lg font-bold">{isHindi ? 'हमारे बारे में' : 'About This Directorate'}</h2>
                  <p className="text-xs text-white/80">{effectiveOfficeName} - {effectiveLocation}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-slate-800 text-sm leading-relaxed">
              <p>
                {isHindi
                  ? `${effectiveOfficeName}, ${effectiveLocation} भारत के नियंत्रक और महालेखापरीक्षक के अधिकार क्षेत्र में कार्य करने वाला एक प्रमुख विदेशी लेखापरीक्षा कार्यालय है। यह भारतीय दूतावासों, उच्चायोगों, वाणिज्य दूतावासों तथा विदेशी सार्वजनिक क्षेत्र के उपक्रमों के वित्तीय और निष्पादन लेखापरीक्षा के लिए उत्तरदायी है।`
                  : `The ${effectiveOfficeName}, situated in ${effectiveLocation}, operates as a premier overseas audit directorate under the Comptroller and Auditor General of India. It exercises statutory audit jurisdiction over Indian diplomatic missions, consulates, trade commissions, and public sector undertakings abroad.`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveModal('history')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-2 transition-all cursor-pointer"
                >
                  <span className="text-3xl">📜</span>
                  <span className="text-xs font-bold text-slate-900">{isHindi ? 'संक्षिप्त इतिहास' : 'Brief History'}</span>
                  <span className="text-[11px] text-slate-500">{isHindi ? 'कार्यालय की स्थापना एवं इतिहास' : 'Origin & milestones'}</span>
                </button>
                <button
                  onClick={() => setActiveModal('directors')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-2 transition-all cursor-pointer"
                >
                  <span className="text-3xl">👔</span>
                  <span className="text-xs font-bold text-slate-900">{isHindi ? 'निदेशक सूची' : 'List Of Directors'}</span>
                  <span className="text-[11px] text-slate-500">{effectiveDirectorsList.length} {isHindi ? 'निदेशक दर्ज' : 'Directors recorded'}</span>
                </button>
                <button
                  onClick={() => setActiveModal('pds')}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center gap-2 transition-all cursor-pointer"
                >
                  <span className="text-3xl">🎖️</span>
                  <span className="text-xs font-bold text-slate-900">{isHindi ? 'प्रधान निदेशक' : 'List Of PDs'}</span>
                  <span className="text-[11px] text-slate-500">{effectivePdsList.length} {isHindi ? 'प्रधान निदेशक दर्ज' : 'PDs recorded'}</span>
                </button>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 21. RECRUITMENT & DEPUTATION MODAL ── */}
      {activeModal === 'recruitment' && (() => {
        const rules: RecruitmentRuleItem[] = (dbData?.recruitmentRules && dbData.recruitmentRules.length > 0)
          ? dbData.recruitmentRules
          : getSubsiteRecruitmentRules(slug);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h2 className="text-lg font-bold">{isHindi ? 'भर्ती नियम एवं विदेशी प्रतिनियुक्ति' : 'Recruitment Rules & Overseas Deputation'}</h2>
                    <p className="text-xs text-white/80">{effectiveOfficeName} - IA&AD Cadre Guidelines</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs text-slate-800">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg text-xs leading-relaxed text-blue-950">
                  {isHindi
                    ? 'विदेशी लेखापरीक्षा कार्यालयों में पदस्थापन भारतीय लेखापरीक्षा एवं लेखा विभाग (IA&AD) के नियमित अधिकारियों में से योग्यता, वरिष्ठता और विदेश सेवा नियमों के आधार पर प्रतिनियुक्ति द्वारा किया जाता है।'
                    : 'Postings to overseas audit directorates are filled through deputation of serving personnel from the Indian Audit & Accounts Department (IA&AD) based on cadre merit, seniority, performance appraisals, and foreign allowance guidelines.'}
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">{isHindi ? 'पद / संवर्ग' : 'Cadre / Post Title'}</th>
                        <th className="py-2.5 px-3">{isHindi ? 'पात्रता / विवरण' : 'Qualification & Criteria'}</th>
                        <th className="py-2.5 px-3">{isHindi ? 'दस्तावेज़' : 'File Size'}</th>
                        <th className="py-2.5 px-3">{isHindi ? 'परिपत्र / गजट' : 'Official Circular'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rules.map((rule, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{isHindi ? (rule.post_name_hi || rule.post_name) : rule.post_name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{isHindi ? (rule.qualification_hi || rule.qualification) : rule.qualification}</td>
                          <td className="py-2.5 px-3 font-semibold text-blue-900">{rule.file_size || 'PDF'}</td>
                          <td className="py-2.5 px-3">
                            <a
                              href={rule.pdf_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>📄 PDF</span>
                              <span>↗</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 22. RIGHT TO INFORMATION (RTI) MODAL ── */}
      {activeModal === 'rti' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 flex justify-between items-center text-white" style={{ background: primaryThemeColor }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h2 className="text-lg font-bold">{isHindi ? 'सूचना का अधिकार (RTI)' : 'Right to Information (RTI)'}</h2>
                  <p className="text-xs text-white/80">{effectiveOfficeName} - Statutory Disclosures</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold border-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs text-slate-800 leading-relaxed">
              <p>
                {isHindi
                  ? 'सूचना का अधिकार अधिनियम, 2005 के प्रावधानों के तहत, नागरिक भारत के नियंत्रक और महालेखापरीक्षक के विदेशी लेखापरीक्षा निदेशालयों से संबंधित सार्वजनिक जानकारी प्राप्त करने के लिए आवेदन कर सकते हैं।'
                  : 'Under the provisions of the Right to Information Act, 2005, Indian citizens may file requests to obtain information pertaining to the functioning and administrative operations of the Overseas Audit Directorate.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {isHindi ? 'केन्द्रीय लोक सूचना अधिकारी (CPIO)' : 'Central Public Information Officer (CPIO)'}
                  </h5>
                  <p className="text-slate-700">Senior Audit Officer (Administration)</p>
                  <p className="text-slate-500 mt-1">{effectiveOfficeName}</p>
                  <p className="text-blue-900 font-mono mt-1">{officeData.email}</p>
                </div>

                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                    {isHindi ? 'प्रथम अपीलीय प्राधिकारी (FAA)' : 'First Appellate Authority (FAA)'}
                  </h5>
                  <p className="text-slate-700">Director / Principal Director of Audit</p>
                  <p className="text-slate-500 mt-1">{effectiveOfficeName}</p>
                  <p className="text-blue-900 font-mono mt-1">{officeData.email}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <span>
                  {isHindi
                    ? 'ऑनलाइन आरटीआई आवेदन दाखिल करने के लिए केन्द्रीय पोर्टल:'
                    : 'File RTI Request online via Government of India RTI Portal:'}
                </span>
                <a
                  href="https://rtionline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded transition-colors inline-flex items-center gap-1 shrink-0 ml-3"
                >
                  <span>rtionline.gov.in</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-md transition-colors cursor-pointer border-none"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
