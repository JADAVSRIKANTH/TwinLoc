from fastapi import FastAPI

app = FastAPI(
    title="TwinLoc API",
    description="Digital Twin Platform for WSN Localization",
    version="1.0.0"
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