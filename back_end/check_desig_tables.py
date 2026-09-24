import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Check all tables with 'desig' or 'hierarchy'
tables = db.execute(text("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'cag_revamp' 
      AND (table_name LIKE '%desig%' OR table_name LIKE '%hierarchy%')
""")).scalars().all()

print("Tables:", tables)

for t in tables:
    try:
        rows = db.execute(text(f"SELECT * FROM cag_revamp.\"{t}\" LIMIT 20;")).mappings().all()
        print(f"\n--- Table: {t} ({len(rows)} rows) ---")
        for r in rows:
            print(dict(r))
    except Exception as e:
        print(f"Error {t}: {e}")
        db.rollback()

db.close()
