from fastapi import APIRouter

router = APIRouter()

@router.get("/{slug}")
async def get_page(slug: str):
    return {
        "id": f"page-{slug}",
        "slug": slug,
        "title": slug.replace("-", " ").title(),
        "content_html": f"<p>Content for {slug}</p>"
    }
