from fastapi import APIRouter
from app.api.v1 import home, news, events, accounts, reports, pages, states
from app.api.v1.admin import auth as admin_auth
from app.api.v1.admin import crud as admin_crud
from app.api.v1.admin import options as admin_options
from app.api.v1.admin import upload as admin_upload

api_router = APIRouter()

# Public V1 Routes
api_router.include_router(home.router, prefix="/home", tags=["home"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(states.router, prefix="/states", tags=["states"])

# Admin V1 Routes
api_router.include_router(admin_auth.router, prefix="/admin/auth", tags=["admin-auth"])
api_router.include_router(admin_crud.router, prefix="/admin/crud", tags=["admin-crud"])
api_router.include_router(admin_options.router, prefix="/admin/options", tags=["admin-options"])
api_router.include_router(admin_upload.router, prefix="/admin/upload", tags=["admin-upload"])
