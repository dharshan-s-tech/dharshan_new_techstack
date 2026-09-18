import sys
import codecs
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
import psycopg2
from app.core.config import settings

def main():
    conn = psycopg2.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        dbname=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD
    )
    cur = conn.cursor()
    tables = [
        'former_cag', 'organisation_chart', 'speeches', 'young_professional_programme',
        'student_internship_programme', 'rajbhasha_cadre', 'board_committees',
        'collaborations', 'welfare', 'administrative_information', 'pages', 'page_translations'
    ]
    for t in tables:
        cur.execute(f"""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'cag_revamp' AND table_name = '{t}'
            ORDER BY ordinal_position;
        """)
        cols = [f"{r[0]} ({r[1]})" for r in cur.fetchall()]
        print(f"=== {t} ===")
        print(", ".join(cols))
        print()

if __name__ == '__main__':
    main()
