import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import engine
from models import Base
from dotenv import load_dotenv
from routers import pregchat
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()


Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(pregchat.router)


app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000",
    #                "http://172.16.2.152:3000"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

