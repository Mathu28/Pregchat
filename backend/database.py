from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL Database URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create PostgreSQL engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()