from pydantic import BaseModel
from typing import Optional

class PageBase(BaseModel):
    slug: str
    title: str
    content_html: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class PageCreate(PageBase):
    pass

class PageResponse(PageBase):
    id: str

    class Config:
        from_attributes = True
