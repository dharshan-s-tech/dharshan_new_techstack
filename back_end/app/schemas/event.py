from pydantic import BaseModel
from typing import Optional

class EventBase(BaseModel):
    title: str
    location: str
    date: str
    description: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: str

    class Config:
        from_attributes = True
