from pydantic import BaseModel
from typing import Generic, TypeVar, List, Optional

T = TypeVar("T")

class ResponseWrapper(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
