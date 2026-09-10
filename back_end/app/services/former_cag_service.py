import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import engine

logger = logging.getLogger("uvicorn")

SEED_FORMER_CAGS = [
    {
        "id": 14,
        "name_en": "Shri Girish Chandra Murmu",
        "name_hi": "श्री गिरीश चंद्र मुर्मू",
        "tenure_from": "2020",
        "tenure_to": "2024",
        "image": "/assets/former-cags/cag-14.png"
    },
    {
        "id": 13,
        "name_en": "Shri Rajiv Mehrishi",
        "name_hi": "श्री राजीव महर्षि",
        "tenure_from": "2017",
        "tenure_to": "2020",
        "image": "/assets/former-cags/cag-13.png"
    },
    {
        "id": 12,
        "name_en": "Shri Shashi Kant Sharma",
        "name_hi": "श्री शशिकांत शर्मा",
        "tenure_from": "2013",
        "tenure_to": "2017",
        "image": "/assets/former-cags/cag-12.png"
    },
    {
        "id": 11,
        "name_en": "Shri Vinod Rai",
        "name_hi": "श्री विनोद राय",
        "tenure_from": "2008",
        "tenure_to": "2013",
        "image": "/assets/former-cags/cag-11.png"
    },
    {
        "id": 10,
        "name_en": "Shri V. N. Kaul",
        "name_hi": "श्री वी. एन. कौल",
        "tenure_from": "2002",
        "tenure_to": "2008",
        "image": "/assets/former-cags/cag-10.png"
    },
    {
        "id": 9,
        "name_en": "Shri V. K. Shunglu",
        "name_hi": "श्री वी. के. शुंगलू",
        "tenure_from": "1996",
        "tenure_to": "2002",
        "image": "/assets/former-cags/cag-9.png"
    },
    {
        "id": 8,
        "name_en": "Shri C. G. Somiah",
        "name_hi": "श्री सी. जी. सोमैया",
        "tenure_from": "1990",
        "tenure_to": "1996",
        "image": "/assets/former-cags/cag-8.png"
    },
    {
        "id": 7,
        "name_en": "Shri T. N. Chaturvedi",
        "name_hi": "श्री टी. एन. चतुर्वेदी",
        "tenure_from": "1984",
        "tenure_to": "1989",
        "image": "/assets/former-cags/cag-7.png"
    },
    {
        "id": 6,
        "name_en": "Shri Gian Prakash",
        "name_hi": "श्री ज्ञान प्रकाश",
        "tenure_from": "1978",
        "tenure_to": "1984",
        "image": "/assets/former-cags/cag-6.png"
    },
    {
        "id": 5,
        "name_en": "Shri A. Baksi",
        "name_hi": "श्री ए. बक्सी",
        "tenure_from": "1972",
        "tenure_to": "1978",
        "image": "/assets/former-cags/cag-5.png"
    },
    {
        "id": 4,
        "name_en": "Shri S. Ranganathan",
        "name_hi": "श्री एस. रंगनाथन",
        "tenure_from": "1966",
        "tenure_to": "1972",
        "image": "/assets/former-cags/cag-4.png"
    },
    {
        "id": 3,
        "name_en": "Shri A. K. Roy",
        "name_hi": "श्री ए. के. रॉय",
        "tenure_from": "1960",
        "tenure_to": "1966",
        "image": "/assets/former-cags/cag-3.png"
    },
    {
        "id": 2,
        "name_en": "Shri A. K. Chanda",
        "name_hi": "श्री ए. के. चंदा",
        "tenure_from": "1954",
        "tenure_to": "1960",
        "image": "/assets/former-cags/cag-2.png"
    },
    {
        "id": 1,
        "name_en": "Shri V. Narahari Rao",
        "name_hi": "श्री वी. नरहरि राव",
        "tenure_from": "1948",
        "tenure_to": "1954",
        "image": "/assets/former-cags/cag-1.png"
    }
]


class FormerCagService:
    @staticmethod
    def get_former_cags(culture: str = "en", db: Optional[Session] = None) -> List[Dict[str, Any]]:
        is_hi = culture == "hi"

        # 1. Attempt PostgreSQL Query
        if db and engine.dialect.name == "postgresql":
            try:
                query = text("""
                    SELECT
                        id,
                        title,
                        tenure AS officer_name,
                        tenure_from,
                        tenure_to,
                        image,
                        language
                    FROM cag_revamp.former_cag
                    WHERE status = 1
                    AND (language = :lang OR language = 'en')
                    ORDER BY CAST(REGEXP_REPLACE(tenure_from, '[^0-9]', '', 'g') AS INTEGER) DESC;
                """)
                rows = db.execute(query, {"lang": "hi" if is_hi else "en"}).mappings().fetchall()

                if rows:
                    items = []
                    for r in rows:
                        img = r.get("image") or ""
                        if img and not img.startswith("/"):
                            img = f"/uploads/former_cag/{img}"

                        items.append({
                            "id": r.get("id"),
                            "name": r.get("officer_name"),
                            "tenure_from": r.get("tenure_from"),
                            "tenure_to": r.get("tenure_to"),
                            "image": img,
                            "title": r.get("title") or "Former CAG"
                        })
                    return items
            except Exception as e:
                logger.warning(f"[FormerCagService] DB query failed ({e}). Falling back to seed.")

        # 2. Resilient Fallback Data
        return [
            {
                "id": c["id"],
                "name": c["name_hi"] if is_hi else c["name_en"],
                "name_en": c["name_en"],
                "name_hi": c["name_hi"],
                "tenure_from": c["tenure_from"],
                "tenure_to": c["tenure_to"],
                "image": c["image"],
                "title": "पूर्व सीएजी" if is_hi else "Former CAG"
            }
            for c in SEED_FORMER_CAGS
        ]
