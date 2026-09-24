from fastapi import APIRouter
from app.api.v1 import home, news, events, accounts, reports, pages, states, subsites, organisation_chart, former_cag, tenders_circulars, resources, subscribers
from app.api.v1.admin import auth as admin_auth
from app.api.v1.admin import crud as admin_crud
from app.api.v1.admin import options as admin_options
from app.api.v1.admin import upload as admin_upload
from app.api.v1.admin import global_relations as admin_global_relations

api_router = APIRouter()

# Public V1 Routes
api_router.include_router(home.router, prefix="/home", tags=["home"])
api_router.include_router(home.banners_router, prefix="/banners", tags=["banners"])
api_router.include_router(home.presence_router, prefix="/presence", tags=["presence"])
api_router.include_router(home.officers_router, prefix="/officers", tags=["officers"])
api_router.include_router(home.gov_types_router, prefix="/government-types", tags=["government-types"])
api_router.include_router(home.about_router, prefix="/about", tags=["about"])
api_router.include_router(news.router, prefix="/news", tags=["news"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(accounts.state_router, prefix="/state-accounts", tags=["state-accounts"])
api_router.include_router(accounts.combined_router, prefix="/combined-accounts", tags=["combined-accounts"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(pages.router, prefix="/pages", tags=["pages"])
api_router.include_router(pages.router, prefix="/page-content", tags=["page-content"])
api_router.include_router(states.router, prefix="/states", tags=["states"])
api_router.include_router(subsites.router, prefix="/subsites", tags=["subsites"])
api_router.include_router(organisation_chart.router, prefix="/organisation-chart", tags=["organisation-chart"])
api_router.include_router(former_cag.router, prefix="/former-cag", tags=["former-cag"])
api_router.include_router(former_cag.router, prefix="/former-cags", tags=["former-cags"])
api_router.include_router(tenders_circulars.tenders_router, prefix="/tenders", tags=["tenders"])
api_router.include_router(tenders_circulars.circulars_router, prefix="/circulars", tags=["circulars"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])
api_router.include_router(subscribers.router, prefix="/subscribers", tags=["subscribers"])

# Admin V1 Routes
api_router.include_router(admin_auth.router, prefix="/admin/auth", tags=["admin-auth"])
api_router.include_router(admin_crud.router, prefix="/admin/crud", tags=["admin-crud"])
api_router.include_router(news.admin_router, prefix="/admin/news", tags=["admin-news"])
api_router.include_router(tenders_circulars.admin_tenders_router, prefix="/admin/tenders", tags=["admin-tenders"])
api_router.include_router(tenders_circulars.admin_circulars_router, prefix="/admin/circulars", tags=["admin-circulars"])
api_router.include_router(admin_options.router, prefix="/admin/options", tags=["admin-options"])
api_router.include_router(admin_upload.router, prefix="/admin/upload", tags=["admin-upload"])
api_router.include_router(admin_global_relations.router, prefix="/admin/global-relations", tags=["admin-global-relations"])

