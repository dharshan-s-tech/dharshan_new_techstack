from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from app.services.resources_service import ResourcesService

router = APIRouter()

@router.get("")
@router.get("/")
def get_resource_documents_query(
    category: Optional[str] = Query("all", description="Category slug"),
    slug: Optional[str] = Query(None, description="Category slug alias"),
    query: Optional[str] = Query(None, description="Search query keyword"),
    culture: str = Query("en", description="Language culture: 'en' or 'hi'"),
    sort_by: str = Query("newest", description="Sorting criteria: 'newest', 'oldest', 'title_asc'"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    limit: Optional[int] = Query(None, ge=1, le=100)
) -> Dict[str, Any]:
    cat_slug = slug or category or "all"
    effective_limit = limit or page_size
    return ResourcesService.get_resource_items(
        slug=cat_slug,
        query=query,
        culture=culture,
        sort_by=sort_by,
        page=page,
        page_size=effective_limit
    )

@router.get("/{category_slug}")
def get_resource_documents(
    category_slug: str,
    query: Optional[str] = Query(None, description="Search query keyword"),
    culture: str = Query("en", description="Language culture: 'en' or 'hi'"),
    sort_by: str = Query("newest", description="Sorting criteria: 'newest', 'oldest', 'title_asc'"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    limit: Optional[int] = Query(None, ge=1, le=100)
) -> Dict[str, Any]:
    """
    Fetch documents for any specific resource category (e.g. recruitment-policy, citizen-charter,
    guidelines, manuals, press-releases, speeches, photo-gallery, etc.)
    """
    effective_limit = limit or page_size
    return ResourcesService.get_resource_items(
        slug=category_slug,
        query=query,
        culture=culture,
        sort_by=sort_by,
        page=page,
        page_size=effective_limit
    )

