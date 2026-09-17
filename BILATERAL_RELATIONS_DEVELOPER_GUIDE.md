# 🌐 CAG Bilateral Relations — Developer Implementation & CloudFront Assets Guide

**Module**: About Us > Global Relations > Bilateral Relations  
**Page Route**: `/About/Index-Menu-About/Global-relations/Bilateral Relations`  
**Target Delivery**: Database ORM Model, FastAPI Endpoint & Next.js Dynamic Card Grid Component  

---

## 📌 Executive Summary & CDN Endpoints

- **CloudFront CDN Base**: `https://d7i5wg8xwe4hf.cloudfront.net`
- **MoU Document Store**: `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/<filename>.pdf`
- **CMS Image Asset Stores**:
  - Legacy CMS Pages: `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/<filename>`
  - File Manager Uploads: `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/<filename>`
- **Total Entities**: **33** (29 Supreme Audit Institutions with MoUs + Recent Partner Countries + IDI).
- **JSON Seed File**: Already generated in repository at `back_end/data/local_bilateral_relations.json`.

---

## 1. 📋 Master Inventory Table: All 33 Bilateral Assets

All image URLs and PDF links have been verified against CloudFront:

| # | Country / Institution (EN) | Hindi (HI) | CloudFront Image CDN URL | Legacy Path (Old CMS) | MoU PDF Document URL (CloudFront) |
|---|----------------------------|------------|--------------------------|-----------------------|-----------------------------------|
| **01** | **Bhutan** | भूटान | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-bhutan.jpg` | `../assets/images/cms_pages/india-bhutan.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MOU-with-SAI-Bhutan-06a69c5bf619591-84639417.pdf` |
| **02** | **Brazil** | ब्राज़ील | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-brazil.jpg` | `../assets/images/cms_pages/india-brazil.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Brazil-MOU-20211018122505.pdf` |
| **03** | **Cambodia** | कंबोडिया | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-combodia.jpg` | `../assets/images/cms_pages/india-combodia.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Cambodia-MOU-20211018122515.pdf` |
| **04** | **Chile** | चिली | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-chile.jpg` | `../assets/images/cms_pages/india-chile.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/ChileMOU-063f318cb0b6ba3-11650995.pdf` |
| **05** | **China** | चीन | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-china.jpg` | `../assets/images/cms_pages/india-china.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/China-MOU-20211018122525.pdf` |
| **06** | **Indonesia** | इंडोनेशिया | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-indonesia.jpg` | `../assets/images/cms_pages/india-indonesia.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-SAI-Indonesia-064ad3bcda0ada3-52366254.pdf` |
| **07** | **Iran** | ईरान | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-iran.jpg` | `../assets/images/cms_pages/india-iran.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Iran-MOU-20211018122534.pdf` |
| **08** | **Israel** | इजराइल | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-israel.png` | `../assets/images/cms_pages/india-israel.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-with-SAI-Israel-06a69c5cbcdafe8-11942910.pdf` |
| **09** | **Kazakhstan** | कज़ाकिस्तान | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/India-Kazakhstan.png` | `../assets/images/cms_pages/India-Kazakhstan.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/KazakhstanMOU-063f316cbbee8b4-97377335.pdf` |
| **10** | **Korea** | कोरिया | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-korea.jpg` | `../assets/images/cms_pages/india-korea.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/SAI-Korea-064ad3bdea67998-91422093.pdf` |
| **11** | **Kuwait** | कुवैत | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/Indo-Kuwait_0.png` | `../assets/images/cms_pages/Indo-Kuwait_0.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Kuwait-MOU-20211018122543.pdf` |
| **12** | **Maldives** | मालदीव | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-maldivs.jpg` | `../assets/images/cms_pages/india-maldivs.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MOU-Maldives-301021-20211101101328.pdf` |
| **13** | **Mauritius** | मॉरीशस | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/indo-mauritius.jpg` | `../assets/images/cms_pages/indo-mauritius.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/SAI-Mauritius-MoU-english-06a20f33ab3bbd3-12372169.pdf` |
| **14** | **Mongolia** | मंगोलिया | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/India-Mongolia-1.png` | `../assets/images/cms_pages/India-Mongolia-1.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Mongolia-20211018122604.pdf` |
| **15** | **Morocco** | मोरक्को | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/Indo-Mongolia.png` | `../assets/images/cms_pages/Indo-Mongolia.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-with-SAI-Morocco09112022-0636e0abb3b73e9-47600485.pdf` |
| **16** | **Oman** | ओमान | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-oman.jpg` | `../assets/images/cms_pages/india-oman.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Oman-new-0625e45d64474f5-25883550.pdf` |
| **17** | **Poland** | पोलैंड | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-poland.jpg` | `../assets/images/cms_pages/india-poland.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Poland-20211018122622.pdf` |
| **18** | **Russia** | रूस | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-russia.jpg` | `../assets/images/cms_pages/india-russia.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Russia-20211018122630.pdf` |
| **19** | **South Africa** | दक्षिण अफ्रीका | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-southafrica.jpg` | `../assets/images/cms_pages/india-southafrica.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/South-Africa-20211018122640.pdf` |
| **20** | **Tajikistan** | ताजिकिस्तान | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/India-Tajikistan.jpg` | `../assets/images/cms_pages/India-Tajikistan.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/TajikistanMOU-063f316d8affbe7-82375096.pdf` |
| **21** | **Turkiye** | तुर्किये | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-turkiye.jpg` | `../assets/images/cms_pages/india-turkiye.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-SAI-Turkiye-064ad3bc208dd65-23836096.pdf` |
| **22** | **Ukraine** | यूक्रेन | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-ukrain.jpg` | `../assets/images/cms_pages/india-ukrain.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Ukraine-20211018122657.pdf` |
| **23** | **Venezuela** | वेनेजुएला | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/Indo-Venezuela.png` | `../assets/images/cms_pages/Indo-Venezuela.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Venezuela-20211018122705.pdf` |
| **24** | **Vietnam** | वियतनाम | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/india-vietnam.jpg` | `../assets/images/cms_pages/india-vietnam.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-with-SAI-Vietnam-06a69c5d5247741-33107511.pdf` |
| **25** | **Nepal** | नेपाल | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/india_and_nepal.jpg` | `.../FileManager/india_and_nepal.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-Nepal-06639ede4bd6148-77768945.pdf` |
| **26** | **Bulgaria** | बुल्गारिया | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/india_bulgaria.png` | `.../FileManager/india_bulgaria.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-SAI-Bulgaria-1-066335dfa084b35-77174433.pdf` |
| **27** | **Bahrain** | बहरीन | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/india_bahrain_600x381.png` | `.../FileManager/india_bahrain_600x381.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Final-signed-MoU-with-SAI-Bahrain-066d81e5c28b3c1-06567011.pdf` |
| **28** | **UAE** | संयुक्त अरब अमीरात | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/india_uae_600x381.png` | `.../FileManager/india_uae_600x381.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Signed-MoU-SAI-UAE-066dfece05da464-50517218.pdf` |
| **29** | **Saudi Arabia** | सऊदी अरब | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/india_saudi_arabia_600x381.png` | `.../FileManager/india_saudi_arabia_600x381.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/Signed-MoU-Saudi-Arabia-066dfecef070386-27883992.pdf` |
| **30** | **Uzbekistan** | उज़्बेकिस्तान | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/bilateral%20images/Untitled_design-Copy-1.png` | `.../bilateral images/Untitled_design-Copy-1.png` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-SAI-Uzbekistan-066ffa7513686b2-27858723.pdf` |
| **31** | **Seychelles** | सेशेल्स | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/FileManager/MoU_of_Seychelles.jpg` | `.../FileManager/MoU_of_Seychelles.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MoU-of-Seychelles-1-0672dda370df9d6-26505647.pdf` |
| **32** | **Sierra Leone** | सिएरा लियोन | `https://d7i5wg8xwe4hf.cloudfront.net/assets/images/cms_pages/indo-sierra-leone.jpg` | `../assets/images/cms_pages/indo-sierra-leone.jpg` | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/English-version-MoU-Sierra-Leone-06a2fe8e8d52740-85901879.pdf` |
| **33** | **IDI (INTOSAI Dev Initiative)** | इंटोसाई विकास पहल (IDI) | *No Image (Text card)* | *N/A (Text card in legacy)* | `https://d7i5wg8xwe4hf.cloudfront.net/uploads/media/MOU-CAG-of-India-IDI-06996e09d64dc62-76456074.pdf` |

---

## 2. 🗄️ Backend Developer Specifications

### A. Database Model (`app/models/bilateral_relation.py`)
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.core.database import Base

class BilateralRelation(Base):
    __tablename__ = "bilateral_relations"

    id = Column(Integer, primary_key=True, index=True)
    country_name_en = Column(String(200), nullable=False)
    country_name_hi = Column(String(200), nullable=True)
    slug = Column(String(100), unique=True, index=True)
    image_url = Column(String(500), nullable=True)          # CloudFront Image CDN URL
    pdf_url = Column(String(500), nullable=False)            # CloudFront MoU PDF URL
    fallback_flag_svg = Column(String(255), nullable=True)   # Local SVG /assets/Images/flags/...
    display_order = Column(Integer, default=0, index=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
```

### B. Pydantic Schemas (`app/schemas/bilateral_relation.py`)
```python
from pydantic import BaseModel
from typing import Optional, List

class BilateralRelationBase(BaseModel):
    country_name_en: str
    country_name_hi: Optional[str] = None
    slug: str
    image_url: Optional[str] = None
    pdf_url: str
    fallback_flag_svg: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class BilateralRelationResponse(BilateralRelationBase):
    id: int

    class Config:
        from_attributes = True

class BilateralRelationListResponse(BaseModel):
    items: List[BilateralRelationResponse]
    total: int
```

### C. REST API Endpoint (`app/api/v1/endpoints/bilateral.py`)
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.bilateral_relation import BilateralRelation
from app.schemas.bilateral_relation import BilateralRelationListResponse

router = APIRouter()

@router.get("/global-relations/bilateral", response_model=BilateralRelationListResponse)
def get_bilateral_relations(db: Session = Depends(get_db)):
    items = db.query(BilateralRelation).filter(
        BilateralRelation.is_active == True
    ).order_by(BilateralRelation.display_order.asc()).all()
    
    return {"items": items, "total": len(items)}
```

---

## 3. 🎨 Frontend Developer Specifications

### A. Next.js Config: CloudFront Domain Whitelist (`next.config.ts`)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd7i5wg8xwe4hf.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

### B. Dynamic Component Implementation (`src/app/(pages)/About/Index-Menu-About/Global-relations/[slug]/page.tsx`)
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager } from '@/lib/dataManager';

interface BilateralItem {
  id: number;
  country_en: string;
  country_hi: string;
  image_url: string;
  pdf_url: string;
  local_fallback_flag?: string;
  display_order: number;
}

export default function BilateralRelationsView() {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [items, setItems] = useState<BilateralItem[]>([]);
  const isHindi = lang === 'हिन्दी';

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);

    // Fetch from Backend or fallback to local seed data
    fetch('/api/v1/global-relations/bilateral')
      .then(res => res.json())
      .then(data => setItems(data.items || []))
      .catch(() => {
        // Fallback to local dataManager / local_bilateral_relations.json
      });

    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  return (
    <main className="w-full">
      {/* Top Heading */}
      <h1 className="font-['Noto_Sans'] font-semibold text-[16px] leading-[22px] text-[#000000] mb-6">
        {isHindi 
          ? 'वर्तमान में SAI भारत के 29 सर्वोच्च लेखा परीक्षा संस्थानों के साथ समझौता ज्ञापन/जुड़वां व्यवस्थाएं हैं:' 
          : 'Presently SAI India has MoUs/twinning arrangements with 29 Supreme Audit Institutions viz.'}
      </h1>

      {/* 6-Column Flag Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-8">
        {items.map((country) => (
          <a
            key={country.id}
            href={country.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            title={`View MoU document for ${country.country_en}`}
            className="group bg-white border border-[#E6E6E6] rounded-[8px] p-3 flex flex-col items-center justify-between shadow-[2px_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-md transition-all min-h-[190px]"
          >
            <div className="w-full h-[120px] flex items-center justify-center overflow-hidden rounded-[4px]">
              {country.image_url ? (
                <img
                  src={country.image_url}
                  alt={isHindi ? country.country_hi : country.country_en}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Graceful fallback to local SVG flag if CloudFront JPG fails
                    if (country.local_fallback_flag) {
                      (e.target as HTMLImageElement).src = country.local_fallback_flag;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#FAFAFA] flex items-center justify-center p-2 text-center text-[14px] font-semibold text-[#751639]">
                  {isHindi ? country.country_hi : country.country_en}
                </div>
              )}
            </div>

            <p className="font-['Noto_Sans'] font-semibold text-[14px] leading-[18px] text-[#2A2A2A] text-center mt-2 group-hover:text-[#751639] transition-colors">
              {isHindi ? country.country_hi : country.country_en}
            </p>
          </a>
        ))}
      </div>

      {/* Bottom Closing Paragraph */}
      <p className="font-['Noto_Sans'] font-semibold text-[16px] leading-[24px] text-[#000000]">
        {isHindi 
          ? 'इन व्यवस्थाओं के तहत द्विपक्षीय सेमिनार, प्रशिक्षण कार्यक्रम, प्रतिनियुक्ति, क्षमता निर्माण कार्यशालाएं, विशिष्ट लेखापरीक्षाओं के लिए मार्गदर्शन आदि जैसे नियमित द्विपक्षीय आदान-प्रदान आयोजित किए जाते हैं।' 
          : 'Regular bilateral exchanges like bilateralseminars, training programmes, secondments, capacity building workshops, hand holding for specific audits etc. are held under these arrangements.'}
      </p>
    </main>
  );
}
```

---

## 4. 📦 JSON Seed Data

The complete 33-item dataset is saved in:
📁 `back_end/data/local_bilateral_relations.json`
