from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_accounts():
    return {
        "title": "Union Government Accounts",
        "fiscal_year": "2025-26"
    }
