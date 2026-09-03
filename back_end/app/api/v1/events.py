from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_events():
    return [
        {
            "id": "ev-1",
            "title": "International Seminar on Environmental Auditing",
            "location": "iCED Jaipur",
            "date": "2026-10-15"
        }
    ]
