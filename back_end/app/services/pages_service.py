import logging
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine

logger = logging.getLogger("uvicorn")

BASE_URL = getattr(settings, "BASE_URL", "https://cag.gov.in")

# Comprehensive mapping of topic slugs / aliases to their richest PostgreSQL candidate IDs
SLUG_CANDIDATE_IDS: Dict[str, Tuple[int, ...]] = {
    # CAG of India Profile
    "page-cag-of-india": (1014, 6306, 17, 632),
    "cag-of-india": (1014, 6306, 17, 632),
    "17": (1014, 6306, 17, 632),
    "1014": (1014, 6306, 17, 632),
    "6306": (1014, 6306, 17, 632),
    "632": (1014, 6306, 17, 632),
    "leadership-&-legacy": (1014, 6306, 17, 632),
    "leadership-and-legacy": (1014, 6306, 17, 632),

    # Vision, Mission & Core Values
    "page-our-vision-mission-values": (576, 486, 487, 490, 10),
    "our-vision-mission-values": (576, 486, 487, 490, 10),
    "our-vision,-mission-&-core-values": (576, 486, 487, 490, 10),
    "vision-mission": (576, 486, 487, 490, 10),
    "10": (576, 486, 487, 490, 10),
    "576": (576, 486, 487, 490, 10),
    "486": (486, 487, 490, 576, 10),
    "487": (487, 486, 490, 576, 10),

    # History of IAAD
    "page-history-of-indian-audit-and-accounts-department": (41, 7569, 2714, 3152, 3300),
    "history-of-indian-audit-and-accounts-department": (41, 7569, 2714, 3152, 3300),
    "history-of-indian-audit-ans-accounts-department": (41, 7569, 2714, 3152, 3300),
    "history-of-iaad": (41, 7569, 2714, 3152, 3300),
    "41": (41, 7569, 2714, 3152, 3300),

    # Audit Advisory Board
    "page-audit-advisory-board": (40, 7351, 5794, 9228, 7006),
    "audit-advisory-board": (40, 7351, 5794, 9228, 7006),
    "40": (40, 7351, 5794, 9228, 7006),

    # Constitutional Provisions
    "page-constitutional-provisions": (2, 5102, 7334, 9575, 5160, 3180),
    "constitutional-provisions": (2, 5102, 7334, 9575, 5160, 3180),
    "governance-&-mandate": (2, 5102, 7334, 9575, 5160, 3180),
    "governance-and-mandate": (2, 5102, 7334, 9575, 5160, 3180),
    "2": (2, 5102, 7334, 9575, 5160, 3180),

    # Duties, Powers and Conditions of Services Act (DPC Act)
    "page-duties-power-and-conditions-of-services-act": (2608, 1277, 5433, 7220, 3),
    "duties-power-and-conditions-of-services-act": (2608, 1277, 5433, 7220, 3),
    "duties-&-powers-act": (2608, 1277, 5433, 7220, 3),
    "duties-powers-act": (2608, 1277, 5433, 7220, 3),
    "3": (2608, 1277, 5433, 7220, 3),
    "2608": (2608, 1277, 5433, 7220, 3),

    # Audit Regulations
    "page-cag-audit-regulations": (6315, 4537, 6688, 6685),
    "cag-audit-regulations": (6315, 4537, 6688, 6685),
    "audit-regulation": (6315, 4537, 6688, 6685),
    "audit-regulations": (6315, 4537, 6688, 6685),
    "6685": (6315, 4537, 6688, 6685),
    "6315": (6315, 4537, 6688, 6685),

    # Auditing Standards 2017
    "page-cag-s-auditing-standards-2017": (11, 8770, 7445, 1879, 4548),
    "cag-s-auditing-standards-2017": (11, 8770, 7445, 1879, 4548),
    "auditing-standards": (11, 8770, 7445, 1879, 4548),
    "11": (11, 8770, 7445, 1879, 4548),

    # Citizen's Charter
    "page-citizen-s-charter": (16, 3983, 1588, 5984, 2084),
    "citizen-s-charter": (16, 3983, 1588, 5984, 2084),
    "citizen-charter": (16, 3983, 1588, 5984, 2084),
    "16": (16, 3983, 1588, 5984, 2084),

    # International Relations
    "page-international-relations": (4, 9219),
    "international-relations": (4, 9219),
    "global-relations": (4, 9219),
    "4": (4, 9219),

    # Involvement with INTOSAI
    "page-involvement-with-intosai": (6,),
    "involvement-with-intosai": (6,),
    "association-with-intosai": (6,),
    "association with intosai": (6,),
    "6": (6,),

    # Involvement with ASOSAI
    "page-involvement-with-asosai": (7,),
    "involvement-with-asosai": (7,),
    "association-with-asosai": (7,),
    "association with asosai": (7,),
    "7": (7,),

    # GALF & Multilateral Bodies
    "page-global-audit-leadership-forum-and-other-multilateral-bodies": (8,),
    "global-audit-leadership-forum-and-other-multilateral-bodies": (8,),
    "multilateral-engagement": (8,),
    "multilateral engagement": (8,),
    "8": (8,),

    # Bilateral Relations
    "page-bilateral-relations-of-sai-india": (5, 9220, 9536),
    "bilateral-relations-of-sai-india": (5, 9220, 9536),
    "bilateral-relations": (5, 9220, 9536),
    "bilateral relations": (5, 9220, 9536),
    "5": (5, 9220, 9536),

    # International Audit Assignments
    "page-international-audit-assignments": (9, 6678, 257),
    "international-audit-assignments": (9, 6678, 257),
    "un-panel-of-external-auditors": (9, 6678, 257),
    "un panel of external auditors": (9, 6678, 257),
    "present-international-audits": (6678, 9, 257),
    "present international audits": (6678, 9, 257),
    "past-international-audits": (257, 9, 6678),
    "past international audits": (257, 9, 6678),
    "9": (9, 6678, 257),

    # Accounts / Accounts Overview
    "page-accounts": (6277, 822, 730, 4939),
    "accounts": (6277, 822, 730, 4939),
    "structure-of-accounts": (6277, 822, 730, 4939),

    # Overview
    "page-overview": (1, 7166, 3063, 10741),
    "overview": (1, 7166, 3063, 10741),
    "1": (1, 7166, 3063, 10741),

    # Overseas audit offices / institutes
    "overseas-audit-offices": (4,),
    "overseas audit offices": (4,),
    "iced": (9536, 4),
    "icisa": (9219, 4),
    "naaa": (9931, 4),
    "ical": (4,)
}

# Resilient fallback seed data
SEED_PAGES: Dict[str, Dict[str, Any]] = {
    "17": {
        "id": 17,
        "slug": "page-cag-of-india",
        "title_en": "Shri K. Sanjay Murthy",
        "title_hi": "श्री के. संजय मूर्ति",
        "excerpt_en": "Comptroller and Auditor General of India",
        "excerpt_hi": "भारत के नियंत्रक और महालेखापरीक्षक",
        "content_en": "<div class=\"holderIndiaImg\"><img alt=\"\" src=\"https://cag.gov.in/uploads/media/CAG-photo-0689b666f5145a8-92245726.png\" style=\"height:276px; width:300px\" /></div><div class=\"holderIndiaContent\"><h2>Shri K Sanjay Murthy</h2><p><span style=\"font-size:14px\"><strong>Comptroller and Auditor General of India</strong></span></p><p><span style=\"font-size:14px\">Shri K. Sanjay Murthy was sworn in as the Comptroller and Auditor General of India on 21st November 2024 by the Hon’ble President of India and he assumed office on the same day.</span></p><p><span style=\"font-size:14px\">Before his appointment as CAG, Shri K. Sanjay Murthy, an IAS Officer of 1989 batch, served as the Secretary in the Department of Higher Education, Ministry of Education, a position he held from 1st October, 2021 to 20th November, 2024. In this role, he played a pivotal role in implementation of the transformational National Education Policy 2020.</span></p><p><span style=\"font-size:14px\">Previously, he held the position of Chief Executive Officer and Managing Director of the National Industrial Corridor Development Corporation Limited under the Ministry of Commerce and Industry. He also held senior positions as Additional Secretary and Joint Secretary in the Ministry of Housing and Urban Affairs and Ministry of Information and Broadcasting, overseeing development of urban transport and broadcast regulations and licensing. In the State Government, he worked as Secretary in the Education, Technical Education, Power and Transport sectors. During his service, he has also served in the National Institute of Smart Government (NISG), assisting State and Central Government Ministries/Departments with their e-governance adoption.</span></p><p><span style=\"font-size:14px\">Shri Murthy likes to read, listen to music, capturing moments through photography and spending time with nature in his spare time.</span></p></div>",
        "content_hi": "<div class=\"holderIndiaImg\"><h2><img alt=\"\" src=\"https://cag.gov.in/uploads/media/CAG-photo-0689b666f5145a8-92245726.png\" style=\"height:276px; width:300px\" /></h2></div><div class=\"holderIndiaContent\"><h2>श्री के. संजय मूर्ति</h2><p><strong>भारत के नियंत्रक और महालेखापरीक्षक</strong></p><p>श्री के. संजय मूर्ति ने 21 नवंबर 2024 को भारत के माननीय राष्ट्रपति द्वारा भारत के नियंत्रक और महालेखापरीक्षक के रूप में शपथ ली और उसी दिन पदभार ग्रहण किया।</p><p>सीएजी के रूप में अपनी नियुक्ति से पहले, 1989 बैच के आईएएस अधिकारी श्री के. संजय मूर्ति ने उच्च शिक्षा विभाग, शिक्षा मंत्रालय में सचिव के रूप में कार्य किया, यह पद उन्होंने 1 अक्टूबर, 2021 से 20 नवंबर, 2024 तक संभाला। इस भूमिका में, उन्होंने परिवर्तनकारी राष्ट्रीय शिक्षा नीति 2020 के कार्यान्वयन में महत्वपूर्ण भूमिका निभाई।</p><p>इससे पहले, उन्होंने वाणिज्य और उद्योग मंत्रालय के तहत नेशनल इंडस्ट्रियल कॉरिडोर डेवलपमेंट कॉर्पोरेशन लिमिटेड के मुख्य कार्यकारी अधिकारी और प्रबंध निदेशक का पद संभाला था। उन्होंने आवास और शहरी मामलों के मंत्रालय तथा सूचना और प्रसारण मंत्रालय में अतिरिक्त सचिव और संयुक्त सचिव के रूप में वरिष्ठ पदों पर भी कार्य किया, शहरी परिवहन तथा प्रसारण नियमों एवं लाइसेंसिंग के विकास की देखरेख की। राज्य सरकार में, उन्होंने शिक्षा, तकनीकी शिक्षा, बिजली और परिवहन क्षेत्रों में सचिव के रूप में कार्य किया। अपनी सेवा के दौरान, उन्होंने नेशनल इंस्टीट्यूट फॉर स्मार्ट गवर्नमेंट (एनआईएसजी) में भी कार्य किया, राज्य और केंद्र सरकार के मंत्रालयों/विभागों को उनके ई-गवर्नेंस अपनाने में सहायता की।</p><p>श्री मूर्ति अपने खाली समय में पढ़ना, संगीत सुनना, फोटोग्राफी के माध्यम से क्षणों को कैद करना और प्रकृति के साथ समय बिताना पसंद करते हैं।</p></div>",
        "file_title": "CAG Profile",
        "upload_file": "https://cag.gov.in/uploads/media/CAG-photo-0689b666f5145a8-92245726.png",
        "status": 1
    },
    "10": {
        "id": 10,
        "slug": "page-our-vision-mission-values",
        "title_en": "Our Vision, Mission and Core Values",
        "title_hi": "हमारा दृष्टिकोण, मिशन और आधारभूत मूल्य",
        "excerpt_en": "Vision, Mission and Core Values of SAI India",
        "excerpt_hi": "साई इंडिया का विजन, मिशन और कोर वैल्यूज",
        "content_en": "<h3>Vision</h3><p>The vision of SAI India represents what we aspire to become: We strive to be a global leader and initiator of national and international best practices in public sector auditing and accounting and recognized for independent, credible, balanced and timely reporting on public finance and governance.</p><h3>Mission</h3><p>Mandated by the Constitution of India, we promote accountability, transparency and good governance through high quality auditing and accounting and provide independent assurance to our stakeholders, the Legislature, the Public and the Executive, that public funds are being used efficiently and for the intended purposes.</p><h3>Core Values</h3><p>Our core values are the guiding principles that determine our actions and behaviors: Independence, Objectivity, Integrity, Reliability, Professional Excellence, Transparency, Positive Approach.</p>",
        "content_hi": "<h3>हमारा दृष्टिकोण (Vision)</h3><p>साई इंडिया का दृष्टिकोण इस बात का प्रतिनिधित्व करता है कि हम क्या बनना चाहते हैं: हम सार्वजनिक क्षेत्र के लेखापरीक्षा और लेखांकन में राष्ट्रीय और अंतर्राष्ट्रीय सर्वोत्तम प्रथाओं के प्रवर्तक और वैश्विक नेता बनने का प्रयास करते हैं और सार्वजनिक वित्त और शासन पर स्वतंत्र, विश्वसनीय, संतुलित और समय पर रिपोर्टिंग के लिए पहचाने जाते हैं।</p><h3>हमारा मिशन (Mission)</h3><p>भारत के संविधान द्वारा अनिवार्य, हम उच्च गुणवत्ता वाली लेखापरीक्षा और लेखांकन के माध्यम से जवाबदेही, पारदर्शिता और सुशासन को बढ़ावा देते हैं और अपने हितधारकों, विधायिका, जनता और कार्यपालिका को स्वतंत्र आश्वासन प्रदान करते हैं कि सार्वजनिक धन का कुशलतापूर्वक और इच्छित उद्देश्यों के लिए उपयोग किया जा रहा है।</p><h3>मूल मूल्य (Core Values)</h3><p>हमारे मूल मूल्य वे मार्गदर्शक सिद्धांत हैं जो हमारे कार्यों और व्यवहार को निर्धारित करते हैं: स्वतंत्रता, निष्पक्षता, सत्यनिष्ठा, विश्वसनीयता, व्यावसायिक उत्कृष्टता, पारदर्शिता, सकारात्मक दृष्टिकोण।</p>",
        "file_title": "Vision Mission",
        "upload_file": "",
        "status": 1
    }
}


class PagesService:
    @staticmethod
    def get_page_by_slug_or_id(slug_or_id: str, culture: str = "en", db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
        clean_key = slug_or_id.strip().lower()
        candidate_ids = SLUG_CANDIDATE_IDS.get(clean_key)

        # 1. Attempt PostgreSQL Query
        if db and engine.dialect.name == "postgresql":
            try:
                if candidate_ids:
                    id_tuple_str = ",".join(str(cid) for cid in candidate_ids)
                    query = text(f"""
                        SELECT
                            p.id,
                            p.slug,
                            COALESCE(NULLIF(pt.title, ''), p.title) AS title,
                            COALESCE(NULLIF(pt.excerpt, ''), p.excerpt) AS excerpt,
                            COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), NULLIF(pt.excerpt, ''), p.excerpt) AS content,
                            COALESCE(NULLIF(pt.file_title, ''), p.file_title) AS file_title,
                            COALESCE(NULLIF(pt.upload_file, ''), p.upload_file) AS upload_file,
                            p.created_at,
                            p.modified_at
                        FROM cag_revamp.pages p
                        LEFT JOIN cag_revamp.page_translations pt
                            ON pt.page_id = p.id AND pt.culture = :culture
                        WHERE (p.status = 1 OR p.status IS NULL)
                        AND p.id IN ({id_tuple_str})
                        ORDER BY LENGTH(COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), '')) DESC
                        LIMIT 1;
                    """)
                    row = db.execute(query, {
                        "culture": culture
                    }).mappings().fetchone()
                else:
                    query = text("""
                        SELECT
                            p.id,
                            p.slug,
                            COALESCE(NULLIF(pt.title, ''), p.title) AS title,
                            COALESCE(NULLIF(pt.excerpt, ''), p.excerpt) AS excerpt,
                            COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), NULLIF(pt.excerpt, ''), p.excerpt) AS content,
                            COALESCE(NULLIF(pt.file_title, ''), p.file_title) AS file_title,
                            COALESCE(NULLIF(pt.upload_file, ''), p.upload_file) AS upload_file,
                            p.created_at,
                            p.modified_at
                        FROM cag_revamp.pages p
                        LEFT JOIN cag_revamp.page_translations pt
                            ON pt.page_id = p.id AND pt.culture = :culture
                        WHERE (p.status = 1 OR p.status IS NULL)
                        AND (
                            p.slug = :raw_key 
                            OR p.slug = 'page-' || :raw_key 
                            OR p.slug LIKE :raw_key || '-%'
                            OR p.slug LIKE 'page-' || :raw_key || '-%'
                            OR CAST(p.id AS VARCHAR) = :raw_key
                        )
                        ORDER BY 
                            (CASE 
                                WHEN CAST(p.id AS VARCHAR) = :raw_key THEN 1
                                WHEN p.slug = :raw_key OR p.slug = 'page-' || :raw_key THEN 2
                                ELSE 3 
                             END), 
                            LENGTH(COALESCE(NULLIF(pt.content, ''), NULLIF(p.content, ''), '')) DESC,
                            p.id ASC
                        LIMIT 1;
                    """)
                    row = db.execute(query, {
                        "culture": culture,
                        "raw_key": clean_key
                    }).mappings().fetchone()

                if row:
                    data = dict(row)
                    # Post-processing steps
                    if data.get("content"):
                        data["content"] = data["content"].replace("[SITE-URL]/", f"{BASE_URL}/").replace("[SITE-URL]", BASE_URL)
                    if data.get("upload_file"):
                        if data["upload_file"].startswith("http"):
                            data["upload_file_url"] = data["upload_file"]
                        else:
                            data["upload_file_url"] = f"{BASE_URL}/uploads/cms_pages_files/{data['upload_file']}"
                    return data
            except Exception as e:
                logger.warning(f"[PagesService] DB query failed ({e}). Falling back to resilient seed data.")

        # 2. Resilient Fallback Resolution
        seed = None
        if clean_key in SEED_PAGES:
            seed = SEED_PAGES[clean_key]
        else:
            for s_id, pdata in SEED_PAGES.items():
                if pdata["slug"] == clean_key or pdata["slug"] == f"page-{clean_key}":
                    seed = pdata
                    break

        if seed:
            is_hi = culture == "hi"
            title = seed.get("title_hi") if is_hi else seed.get("title_en")
            excerpt = seed.get("excerpt_hi") if is_hi else seed.get("excerpt_en")
            upload_file = seed.get("upload_file", "")
            content = seed.get("content_hi") if is_hi else seed.get("content_en")
            if not content:
                content = f"<p>{title}</p>"
            return {
                "id": seed["id"],
                "slug": seed["slug"],
                "title": title or seed.get("title_en"),
                "excerpt": excerpt or seed.get("excerpt_en"),
                "content": content,
                "file_title": seed.get("file_title"),
                "upload_file": upload_file,
                "upload_file_url": upload_file if upload_file.startswith("http") else (f"{BASE_URL}/uploads/cms_pages_files/{upload_file}" if upload_file else ""),
                "status": seed.get("status", 1)
            }

        return None
