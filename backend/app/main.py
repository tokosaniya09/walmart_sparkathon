from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from app.routes import upload, search  

app = FastAPI()

# CORS settings (allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(search.router)

@app.get("/")
def root():
    return {"message": "Walmart Hackathon backend is running!"}
