from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.services.subscribers_service import SubscribersService

router = APIRouter()

class SubscribeRequest(BaseModel):
    email: EmailStr
    ip_address: Optional[str] = None

@router.post("/subscribe")
def subscribe(req: SubscribeRequest, request: Request):
    client_ip = req.ip_address or request.client.host if request.client else "127.0.0.1"
    result = SubscribersService.subscribe(email=req.email, ip_address=client_ip)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@router.get("/verify/{token}")
def verify_token(token: str):
    result = SubscribersService.verify_token(token=token)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@router.get("/list")
@router.get("")
def list_subscribers(
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    status: Optional[str] = None
):
    return SubscribersService.get_subscribers(page=page, page_size=limit, query=search, status=status)

@router.post("/toggle/{sub_id}")
def toggle_status(sub_id: int, verified: bool = True):
    success = SubscribersService.toggle_subscriber_status(sub_id=sub_id, verified=verified)
    return {"success": success}

@router.delete("/{sub_id}")
def delete_subscriber(sub_id: int):
    success = SubscribersService.delete_subscriber(sub_id=sub_id)
    return {"success": success}
