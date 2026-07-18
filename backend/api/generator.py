from fastapi import APIRouter
from models.network import NetworkRequest
from simulation.generator import generate_random_network

router = APIRouter()


@router.post("/generate-network")
def generate_network(request: NetworkRequest):
    network = generate_random_network(request)
    return network