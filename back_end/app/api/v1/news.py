from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_news():
    return [
        {
            "id": "news-1",
            "title": "Release of Union Government Finance Accounts for 2025-26",
            "description": "Official publication of audited finance and appropriation accounts details.",
            "published_date": "June 4, 2026",
            "type": "trending"
        }
    ]
