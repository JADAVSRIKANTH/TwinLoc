import sys
import os
import statistics
import csv

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


def calculate_statistics(values):
    """
    Calculate mean and standard deviation.
    """

    if len(values) == 1:
        return statistics.mean(values), 0.0

    return (
        statistics.mean(values),
        statistics.stdev(values),
    )


def main():

    # Change to 30 after testing
    NUM_RUNS = 30

    # ----------------------------------------
    # Reports Directory
    # ----------------------------------------

    reports_dir = os.path.join(
        os.path.dirname(__file__),
        "..",
        "reports",
    )

    os.makedirs(reports_dir, exist_ok=True)

    # ----------------------------------------
    # Algorithms
    # ----------------------------------------

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

    # ----------------------------------------
    # Store Metrics
    # ----------------------------------------

    metrics = {
        algo: {
            "mle": [],
            "rmse": [],
            "nle": [],
            "success": [],
        }
        for algo in algorithms
    }

    # ----------------------------------------
    # Run Experiments
    # ----------------------------------------

    for run in range(NUM_RUNS):

        print(f"\nRun {run + 1}/{NUM_RUNS}")

        request = NetworkRequest(
            network_width=500,
            network_height=500,
            sensor_nodes=50,
            anchor_nodes=10,
            communication_range=100,
            deployment="random",
            algorithm="MFO",
            seed=run + 1,
            max_iterations=100,
        )

        network = generate_random_network(request)

        for algo in algorithms:

            result, analytics = run_algorithm(
                network,
                request,
                algo,
            )

            metrics[algo]["mle"].append(
                analytics["mean_localization_error"]
            )

            metrics[algo]["rmse"].append(
                analytics["rmse"]
            )

            metrics[algo]["nle"].append(
                analytics["normalized_localization_error"]
            )

            metrics[algo]["success"].append(
                analytics["localization_success_rate"]
            )

    # ----------------------------------------
    # Statistical Summary
    # ----------------------------------------

    print("\n" + "=" * 80)
    print("Statistical Summary")
    print("=" * 80)

    print(
        f"{'Algorithm':<18}"
        f"{'Avg MLE':>12}"
        f"{'Std MLE':>12}"
        f"{'Avg RMSE':>12}"
        f"{'Std RMSE':>12}"
        f"{'Avg NLE':>12}"
        f"{'Avg Success':>15}"
    )

    print("-" * 93)

    # ----------------------------------------
    # CSV Export
    # ----------------------------------------

    csv_path = os.path.join(
        reports_dir,
        "statistical_results.csv",
    )

    with open(csv_path, "w", newline="") as file:

        writer = csv.writer(file)

        writer.writerow([
            "Algorithm",
            "Avg MLE",
            "Std MLE",
            "Avg RMSE",
            "Std RMSE",
            "Avg NLE",
            "Avg Success Rate",
        ])

        for algo in algorithms:

            avg_mle, std_mle = calculate_statistics(metrics[algo]["mle"])
            avg_rmse, std_rmse = calculate_statistics(metrics[algo]["rmse"])
            avg_nle, _ = calculate_statistics(metrics[algo]["nle"])
            avg_success, _ = calculate_statistics(metrics[algo]["success"])

            print(
                f"{display_names[algo]:<18}"
                f"{avg_mle:>12.2f}"
                f"{std_mle:>12.2f}"
                f"{avg_rmse:>12.2f}"
                f"{std_rmse:>12.2f}"
                f"{avg_nle:>12.2f}"
                f"{avg_success:>15.2f}"
            )

            writer.writerow([
                display_names[algo],
                round(avg_mle, 4),
                round(std_mle, 4),
                round(avg_rmse, 4),
                round(std_rmse, 4),
                round(avg_nle, 4),
                round(avg_success, 2),
            ])

    print("\n" + "=" * 80)
    print("Experiment Completed Successfully!")
    print("=" * 80)

    print(f"\n✓ Statistical results saved to:\n{csv_path}")


if __name__ == "__main__":
    main()