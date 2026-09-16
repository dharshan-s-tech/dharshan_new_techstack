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
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-FG-Girish-0673ead2d5dcc41-56012319.jpg"
    },
    {
        "id": 13,
        "name_en": "Shri Rajiv Mehrishi",
        "name_hi": "श्री राजीव महर्षि",
        "tenure_from": "2017",
        "tenure_to": "2020",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-Rajiv-05f3c0e1acaff31-44023461.jpg"
    },
    {
        "id": 12,
        "name_en": "Shri Shashi Kant Sharma",
        "name_hi": "श्री शशिकांत शर्मा",
        "tenure_from": "2013",
        "tenure_to": "2017",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-shashi-05de4f20e412159-43528983.jpg"
    },
    {
        "id": 11,
        "name_en": "Shri Vinod Rai",
        "name_hi": "श्री विनोद राय",
        "tenure_from": "2008",
        "tenure_to": "2013",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-20-05de4f26d189092-01819458.jpg"
    },
    {
        "id": 10,
        "name_en": "Shri V. N. Kaul",
        "name_hi": "श्री वी. एन. कौल",
        "tenure_from": "2002",
        "tenure_to": "2008",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-19-05de4f2a89a6655-77279258.jpg"
    },
    {
        "id": 9,
        "name_en": "Shri V. K. Shunglu",
        "name_hi": "श्री वी. के. शुंगलू",
        "tenure_from": "1996",
        "tenure_to": "2002",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-18-05de4f2ea4f3913-35294852.jpg"
    },
    {
        "id": 8,
        "name_en": "Shri C. G. Somiah",
        "name_hi": "श्री सी. जी. सोमैया",
        "tenure_from": "1990",
        "tenure_to": "1996",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-17-05de4f32fd82f40-71710021.jpg"
    },
    {
        "id": 7,
        "name_en": "Shri T. N. Chaturvedi",
        "name_hi": "श्री टी. एन. चतुर्वेदी",
        "tenure_from": "1984",
        "tenure_to": "1989",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-16-05e69dc63495a63-58455972.jpg"
    },
    {
        "id": 6,
        "name_en": "Shri Gian Prakash",
        "name_hi": "श्री ज्ञान प्रकाश",
        "tenure_from": "1978",
        "tenure_to": "1984",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-15-05de4f3b6139fc4-77603869.jpg"
    },
    {
        "id": 5,
        "name_en": "Shri A. Baksi",
        "name_hi": "श्री ए. बक्सी",
        "tenure_from": "1972",
        "tenure_to": "1978",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-14-05de4f3e9a23e92-06148388.jpg"
    },
    {
        "id": 4,
        "name_en": "Shri S. Ranganathan",
        "name_hi": "श्री एस. रंगनाथन",
        "tenure_from": "1966",
        "tenure_to": "1972",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-13-05de4f42bc9fc33-07074595.jpg"
    },
    {
        "id": 3,
        "name_en": "Shri A. K. Roy",
        "name_hi": "श्री ए. के. रॉय",
        "tenure_from": "1960",
        "tenure_to": "1966",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-12-05de4f456be6206-12327052.jpg"
    },
    {
        "id": 2,
        "name_en": "Shri A. K. Chanda",
        "name_hi": "श्री ए. के. चंदा",
        "tenure_from": "1954",
        "tenure_to": "1960",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-11-05de4f481501010-16235001.jpg"
    },
    {
        "id": 1,
        "name_en": "Shri V. Narahari Rao",
        "name_hi": "श्री वी. नरहरि राव",
        "tenure_from": "1948",
        "tenure_to": "1954",
        "image": "https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/FG-10-05de4f4cc261e13-47267885.jpg"
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
                    ORDER BY NULLIF(REGEXP_REPLACE(COALESCE(tenure_from, '0'), '[^0-9]', '', 'g'), '')::INTEGER DESC NULLS LAST, id DESC;
                """)
                rows = db.execute(query, {"lang": "hi" if is_hi else "en"}).mappings().fetchall()

                if rows:
                    items = []
                    for r in rows:
                        img = r.get("image") or ""
                        if img:
                            if img.startswith("http://") or img.startswith("https://"):
                                pass
                            elif img.startswith("/uploads/"):
                                img = f"https://d7i5wg8xwe4hf.cloudfront.net{img}"
                            elif img.startswith("uploads/"):
                                img = f"https://d7i5wg8xwe4hf.cloudfront.net/{img}"
                            elif img.startswith("/assets/"):
                                pass
                            else:
                                img = f"https://d7i5wg8xwe4hf.cloudfront.net/uploads/former_cag/{img}"

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
