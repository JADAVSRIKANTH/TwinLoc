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

def execute_algorithm(request: NetworkRequest,algorithm_name: str,network=None,):
    if network is None:
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
        algorithm_name=algorithm_name,
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
@router.post("/run")
def run_localization(request: NetworkRequest):
    return execute_algorithm(request, request.algorithm)
@router.post("/compare")
def compare_algorithms(request: NetworkRequest):

    # Generate one common network
    network = generate_random_network(request)

    algorithms = [
        ("MFO", "mfo"),
        ("GA", "ga"),
        ("Hybrid MFO-GA", "hybrid_mfo_ga"),
    ]

    results = []

    for display_name, algorithm_name in algorithms:

        result = execute_algorithm(
            request=request,
            algorithm_name=algorithm_name,
            network=network,
        )

        results.append({
            "algorithm": display_name,
            "rmse": result["analytics"]["rmse"],
            "mean_localization_error": result["analytics"]["mean_localization_error"],
            "normalized_localization_error": result["analytics"]["normalized_localization_error"],
            "execution_time": result["localization_result"]["execution_time"],
            "success_rate": result["analytics"]["localization_success_rate"],
            "localized_nodes": result["analytics"]["localized_nodes"],
            "unlocalized_nodes": result["analytics"]["unlocalized_nodes"],
        })

    return {
        "network": network,
        "results": results,
    }