from sqlalchemy.orm import Session

class ReportService:
    def __init__(self, db: Session):
        self.db = db

    def get_reports(self, level: str = "All", sector: str = "All", type_: str = "All", query: str = ""):
        return []
