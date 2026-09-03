from pydantic import BaseModel
from typing import Optional

class NewsBase(BaseModel):
    title: str
    description: Optional[str] = None
    published_date: str
    image_url: Optional[str] = None
    url: Optional[str] = None
    news_type: str = "trending"

class NewsCreate(NewsBase):
    pass

class NewsResponse(NewsBase):
    id: str

    class Config:
        from_attributes = True
