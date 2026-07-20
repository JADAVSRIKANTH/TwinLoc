from fastapi import APIRouter
import time

from algorithms.factory import AlgorithmFactory
from analytics.evaluator import evaluate_localization
from models.network import NetworkRequest
from simulation.generator import generate_random_network

router = APIRouter(
    prefix="/localization",
    tags=["Localization"]
)


@router.post("/run")
def run_localization(request: NetworkRequest):

    network = generate_random_network(request)

    sensor_nodes = network["sensor_nodes"]
    anchor_nodes = network["anchor_nodes"]

    true_positions = {
        node["id"]: {
            "x": node["x"],
            "y": node["y"],
        }
        for node in sensor_nodes
    }

    algorithm = AlgorithmFactory.create_algorithm(
        algorithm_name=request.algorithm,
        sensor_nodes=sensor_nodes,
        anchor_nodes=anchor_nodes,
        communication_range=request.communication_range,
        network_width=request.network_width,
        network_height=request.network_height,
        max_iterations=request.max_iterations,
    )

    start_time = time.perf_counter()

    result = algorithm.run()

    execution_time = time.perf_counter() - start_time

    estimated_positions = result["best_position"]

    analytics = evaluate_localization(
        true_positions=true_positions,
        estimated_positions=estimated_positions,
        communication_range=request.communication_range,
    )

    result["execution_time"] = round(execution_time, 4)

    return {
        "network": network,
        "localization_result": result,
        "analytics": analytics,
    }