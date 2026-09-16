from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from app.core.config import settings
from app.core.database import get_psycopg2_connection

router = APIRouter()

GLOBAL_RELATIONS_SLUGS = {
    "page-involvement-with-intosai": "Association with INTOSAI",
    "page-involvement-with-asosai": "Association with ASOSAI",
    "page-global-audit-leadership-forum-and-other-multilateral-bodies": "Multilateral Engagement",
    "page-bilateral-relations-of-sai-india": "Bilateral Relations",
    "page-un-panel-of-external-auditors": "UN Panel of External Auditors",
    "page-present-international-audits": "Present International Audits",
    "page-past-international-audits": "Past International Audits",
}

class PageUpdateSchema(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

def get_db_connection():
    return get_psycopg2_connection()

@router.get("/pages")
async def list_global_relations_pages():
    """List all 7 DB records for Global Relations."""
    pages = []
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        slug_list = tuple(GLOBAL_RELATIONS_SLUGS.keys())
        query = f"""
            SELECT id, title, slug, status, created_at, modified_at 
            FROM {settings.DB_SCHEMA}.pages 
            WHERE slug IN %s
            ORDER BY id ASC;
        """
        cur.execute(query, (slug_list,))
        db_rows = cur.fetchall()
        
        for row in db_rows:
            pages.append({
                "id": row["id"],
                "title": row["title"],
                "slug": row["slug"],
                "status": row.get("status", 1),
                "is_dummy": False
            })
        cur.close()
    except Exception as e:
        print(f"[Global Relations API Error] {e}")
    finally:
        if conn:
            conn.close()

    return {"status": "success", "data": pages}

@router.get("/pages/{slug}")
async def get_global_relations_page(slug: str):
    """Fetch page content by slug from cag_revamp.pages."""
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(f"SELECT id, title, slug, content, status FROM {settings.DB_SCHEMA}.pages WHERE slug = %s LIMIT 1;", (slug,))
        row = cur.fetchone()
        cur.close()
        
        if not row:
            raise HTTPException(status_code=404, detail=f"Page with slug '{slug}' not found in database")
            
        return {
            "status": "success",
            "data": {
                "id": row["id"],
                "title": row["title"],
                "slug": row["slug"],
                "content": row["content"] or "",
                "status": row["status"],
                "is_dummy": False
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()

@router.put("/pages/{slug}")
async def update_global_relations_page(slug: str, payload: PageUpdateSchema):
    """Update title and content of a page in cag_revamp.pages."""
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute(f"SELECT id FROM {settings.DB_SCHEMA}.pages WHERE slug = %s LIMIT 1;", (slug,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Page with slug '{slug}' not found in database")
            
        update_fields = []
        params = []
        if payload.title is not None:
            update_fields.append("title = %s")
            params.append(payload.title)
        if payload.content is not None:
            update_fields.append("content = %s")
            params.append(payload.content)
            
        if not update_fields:
            return {"status": "success", "message": "Nothing to update"}
            
        params.append(slug)
        query = f"UPDATE {settings.DB_SCHEMA}.pages SET {', '.join(update_fields)} WHERE slug = %s RETURNING id, title, slug, content;"
        cur.execute(query, tuple(params))
        updated_row = cur.fetchone()
        conn.commit()
        cur.close()
        
        return {
            "status": "success",
            "message": "Page updated successfully in database",
            "data": {
                "id": updated_row["id"],
                "title": updated_row["title"],
                "slug": updated_row["slug"],
                "content": updated_row["content"],
                "is_dummy": False
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()
