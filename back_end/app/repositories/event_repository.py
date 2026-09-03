from sqlalchemy.orm import Session
from app.models.event import Event

class EventRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Event]:
        return self.db.query(Event).all()
