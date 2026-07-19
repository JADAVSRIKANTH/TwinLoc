import sys
import os

# Add backend to Python path
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "backend")
    )
)

from simulation.generator import generate_random_network
from algorithms.factory import AlgorithmFactory
from analytics.evaluator import evaluate_localization
from models.network import NetworkRequest
from visualization.plots import PlotGenerator


def run_algorithm(network, request, algorithm_name):
    """
    Runs a localization algorithm on an existing network.
    """

    sensor_nodes = network["sensor_nodes"]
    anchor_nodes = network["anchor_nodes"]

    # Ground truth positions
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

    result = algorithm.run()

    analytics = evaluate_localization(
        true_positions=true_positions,
        estimated_positions=result["best_position"],
        communication_range=request.communication_range,
    )

    return result, analytics


def main():

    print("\n" + "=" * 60)
    print(" TwinLoc Experiment Runner ")
    print("=" * 60)

    request = NetworkRequest(
        network_width=500,
        network_height=500,
        sensor_nodes=50,
        anchor_nodes=10,
        communication_range=100,
        deployment="random",
        algorithm="MFO",
        seed=42,
        max_iterations=100,
    )

    # ---------------------------------------------------
    # Generate ONE Wireless Sensor Network
    # ---------------------------------------------------

    network = generate_random_network(request)

    algorithms = [
        "MFO",
        "GA",
        "Hybrid_MFO_GA",
    ]

    display_names = {
        "MFO": "MFO",
        "GA": "GA",
        "Hybrid_MFO_GA": "Hybrid MFO-GA",
    }

    results = {}

    # ---------------------------------------------------
    # Run all algorithms on the SAME network
    # ---------------------------------------------------

    for algo in algorithms:

        print("\n" + "-" * 60)
        print(f"Running {display_names[algo]}")
        print("-" * 60)

        result, analytics = run_algorithm(
            network,
            request,
            algo,
        )

        results[algo] = {
            "result": result,
            "analytics": analytics,
        }

        print(f"Best Fitness : {result['best_fitness']:.4f}")
        print(f"MLE          : {analytics['mean_localization_error']:.4f}")
        print(f"RMSE         : {analytics['rmse']:.4f}")
        print(f"NLE          : {analytics['normalized_localization_error']:.4f}")
        print(f"Success Rate : {analytics['localization_success_rate']:.2f}%")

    # ---------------------------------------------------
    # Convergence Comparison
    # ---------------------------------------------------

    curves = {
        display_names[algo]:
        results[algo]["result"]["convergence_curve"]
        for algo in algorithms
    }
    # ---------------------------------------------------
    # Collect Metrics
    # ---------------------------------------------------

    mle = {
        display_names[algo]:
        results[algo]["analytics"]["mean_localization_error"]
        for algo in algorithms
    }

    rmse = {
        display_names[algo]:
        results[algo]["analytics"]["rmse"]
        for algo in algorithms
    }

    nle = {
        display_names[algo]:
        results[algo]["analytics"]["normalized_localization_error"]
        for algo in algorithms
    }

    success = {
        display_names[algo]:
        results[algo]["analytics"]["localization_success_rate"]
        for algo in algorithms
    }

    reports_dir = os.path.join(
        os.path.dirname(__file__),
        "..",
        "reports"
    )

    os.makedirs(reports_dir, exist_ok=True)

    convergence_path = os.path.join(
        reports_dir,
        "convergence_comparison.png"
    )

    PlotGenerator.compare_convergence(
        curves,
        save_path=convergence_path
    )
    # ---------------------------------------------------
    # Metric Comparison Charts
    # ---------------------------------------------------

    PlotGenerator.compare_metric(
        mle,
        "Mean Localization Error",
        save_path=os.path.join(
            reports_dir,
            "mle_comparison.png",
        ),
    )

    PlotGenerator.compare_metric(
        rmse,
        "RMSE",
        save_path=os.path.join(
            reports_dir,
            "rmse_comparison.png",
        ),
    )

    PlotGenerator.compare_metric(
        nle,
        "Normalized Localization Error",
        save_path=os.path.join(
            reports_dir,
            "nle_comparison.png",
        ),
    )

    PlotGenerator.compare_metric(
        success,
        "Localization Success Rate (%)",
        save_path=os.path.join(
            reports_dir,
            "success_rate_comparison.png",
        ),
    )

    print("\n" + "=" * 60)
    print("Experiment Completed Successfully!")
    print("=" * 60)

    print(f"\nConvergence graph saved to:\n{convergence_path}")


if __name__ == "__main__":
    main()