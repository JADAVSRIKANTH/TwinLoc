from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TwinLoc API",
    description="Digital Twin Platform for WSN Localization",
    version="1.0.0"
)

# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to TwinLoc 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "backend": "running"
    }