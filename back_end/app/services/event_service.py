from sqlalchemy.orm import Session
from app.repositories.event_repository import EventRepository

class EventService:
    def __init__(self, db: Session):
        self.repo = EventRepository(db)

    def get_events(self):
        return self.repo.get_all()
