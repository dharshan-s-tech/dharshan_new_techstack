from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_reports(page: int = 1, level: str = "All", sector: str = "All", type: str = "All", query: str = ""):
    return {
        "items": [],
        "total": 0
    }
