from algorithms.metaheuristic.mfo import MFO
from algorithms.metaheuristic.ga import GA
from algorithms.metaheuristic.hybrid_mfo_ga import HybridMFOGA


class AlgorithmFactory:

    @staticmethod
    def create_algorithm(
        algorithm_name,
        sensor_nodes,
        anchor_nodes,
        communication_range,
        network_width,
        network_height,
        max_iterations=100,
    ):

        algorithm_name = algorithm_name.lower()

        if algorithm_name == "mfo":
            return MFO(
                sensor_nodes=sensor_nodes,
                anchor_nodes=anchor_nodes,
                communication_range=communication_range,
                network_width=network_width,
                network_height=network_height,
                max_iterations=max_iterations,
            )

        elif algorithm_name == "ga":
            return GA(
                sensor_nodes=sensor_nodes,
                anchor_nodes=anchor_nodes,
                communication_range=communication_range,
                network_width=network_width,
                network_height=network_height,
                max_iterations=max_iterations,
            )

        elif algorithm_name == "hybrid_mfo_ga":
            return HybridMFOGA(
                sensor_nodes=sensor_nodes,
                anchor_nodes=anchor_nodes,
                communication_range=communication_range,
                network_width=network_width,
                network_height=network_height,
                max_iterations=max_iterations,
            )

        else:
            raise ValueError(f"Unknown algorithm: {algorithm_name}")