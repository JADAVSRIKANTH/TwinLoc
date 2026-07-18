from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {
        "message": "Welcome to TwinLoc 🚀"
    }

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "backend": "running"
    }