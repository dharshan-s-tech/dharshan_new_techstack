from pydantic import BaseModel
from typing import List, Optional

class QuickLinkItem(BaseModel):
    id: Optional[str] = None
    title: str
    url: Optional[str] = None

class WhatsNewItem(BaseModel):
    id: Optional[str] = None
    date: str
    title: str
    url: Optional[str] = None

class AccountCardItem(BaseModel):
    id: Optional[str] = None
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

class StateSubsiteBase(BaseModel):
    slug: str
    state_name: str
    office_title: str
    pension_title: Optional[str] = "About Pension"
    pension_desc: Optional[str] = None
    pension_case_status_date: Optional[str] = "10/06/2026"
    gpf_title: Optional[str] = "About General Provident Fund"
    gpf_desc: Optional[str] = None
    account_title: Optional[str] = "Account"
    account_desc: Optional[str] = None
    account_cards: Optional[List[AccountCardItem]] = []
    quick_links: Optional[List[QuickLinkItem]] = []
    whats_new: Optional[List[WhatsNewItem]] = []

class StateSubsiteCreate(StateSubsiteBase):
    pass

class StateSubsiteResponse(StateSubsiteBase):
    id: str

    class Config:
        from_attributes = True
