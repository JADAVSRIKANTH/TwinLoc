import random
import math

from algorithms.base_algorithm import BaseLocalizationAlgorithm
from algorithms.localization_problem import LocalizationProblem
from algorithms.population import Population


class MFO(BaseLocalizationAlgorithm):
    """
    Moth-Flame Optimization (MFO)
    for Wireless Sensor Network Localization.
    """

    def __init__(
        self,
        sensor_nodes,
        anchor_nodes,
        communication_range,
        network_width,
        network_height,
        max_iterations=100,
        population_size=30,
    ):
        super().__init__(
            sensor_nodes,
            anchor_nodes,
            communication_range,
            network_width,
            network_height,
            max_iterations,
        )

        self.population_size = population_size

        self.problem = LocalizationProblem(
            sensor_nodes,
            anchor_nodes,
            communication_range,
        )

    def sort_flames(self, evaluated_population):
        """
        Sort moths according to fitness.
        Lower fitness is better.
        """

        return sorted(
            evaluated_population,
            key=lambda moth: moth["fitness"]
        )

    def calculate_flame_count(self, iteration):
        """
        Number of flames decreases gradually.
        """

        flame_count = round(
            self.population_size -
            iteration * (
                (self.population_size - 1)
                / self.max_iterations
            )
        )

        return max(1, flame_count)

    def update_positions(self, population, flames, flame_count, a):
        """
        Update moth positions using the spiral equation.
        """

        b = 1
        new_population = []

        for i, moth in enumerate(population):

            flame = flames[min(i, flame_count - 1)]["position"]

            new_moth = {}

            for sensor in self.sensor_nodes:

                sensor_id = sensor["id"]

                current = moth[sensor_id]
                target = flame[sensor_id]

                t = random.uniform(a, 1)

                dx = abs(target["x"] - current["x"])
                dy = abs(target["y"] - current["y"])

                new_x = (
                    dx *
                    math.exp(b * t) *
                    math.cos(2 * math.pi * t)
                    + target["x"]
                )

                new_y = (
                    dy *
                    math.exp(b * t) *
                    math.cos(2 * math.pi * t)
                    + target["y"]
                )

                new_moth[sensor_id] = {
                    "x": new_x,
                    "y": new_y,
                }

            new_population.append(new_moth)

        return new_population

    def calculate_a(self, iteration):
        """
        Adaptive parameter that decreases linearly from -1 to -2.
        """

        return -1 - (iteration / self.max_iterations)

    def run(self):
        """
        Execute the MFO algorithm.
        """

        # Initialize population
        population = Population.initialize(
            sensor_nodes=self.sensor_nodes,
            population_size=self.population_size,
            network_width=self.network_width,
            network_height=self.network_height,
        )

        best_flame = None
        convergence_curve = []

        for iteration in range(self.max_iterations):

            # Adaptive parameter
            a = self.calculate_a(iteration)

            # Evaluate current population
            evaluated_population = Population.evaluate(
                population,
                self.problem,
            )

            # Sort flames
            flames = self.sort_flames(evaluated_population)

            # Update global best
            if (
                best_flame is None or
                flames[0]["fitness"] < best_flame["fitness"]
            ):
                best_flame = flames[0]

            # Store convergence
            convergence_curve.append(flames[0]["fitness"])

            # Calculate current flame count
            flame_count = self.calculate_flame_count(iteration)

            # Update moth positions
            population = self.update_positions(
                population,
                flames,
                flame_count,
                a,
            )

            # Keep moths inside search space
            population = Population.boundary_check(
                population,
                self.network_width,
                self.network_height,
            )

            # Evaluate updated population
            evaluated_population = Population.evaluate(
                population,
                self.problem,
            )

            # Sort updated population
            evaluated_population = self.sort_flames(
                evaluated_population
            )

            # Elitism
            if best_flame["fitness"] < evaluated_population[-1]["fitness"]:
                evaluated_population[-1] = best_flame

            # Prepare population for next iteration
            population = [
                moth["position"]
                for moth in evaluated_population
            ]

        return {
            "algorithm": "MFO",
            "best_fitness": best_flame["fitness"],
            "best_position": best_flame["position"],
            "localized_nodes": len(best_flame["position"]),
            "population_size": self.population_size,
            "iterations": self.max_iterations,
            "convergence_curve": convergence_curve,
            "status": "success",
        }