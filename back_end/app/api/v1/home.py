from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_home_data():
    return {
        "hero_title": "Comptroller and Auditor General of India",
        "hero_subtitle": "Supreme Audit Institution of India",
        "stats": [
            {"label": "Years of Excellence", "value": "150+"},
            {"label": "Reports Tabled Annually", "value": "700+"}
        ],
        "cag_message": {
            "name": "Shri K. Sanjay Murthy",
            "title": "Comptroller and Auditor General of India",
            "message": "Welcome to the official portal of the Comptroller and Auditor General of India..."
        }
    }
