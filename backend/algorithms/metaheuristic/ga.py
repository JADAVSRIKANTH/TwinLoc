import random
import copy

from algorithms.base_algorithm import BaseLocalizationAlgorithm
from algorithms.localization_problem import LocalizationProblem
from algorithms.population import Population


class GA(BaseLocalizationAlgorithm):
    """
    Genetic Algorithm (GA)
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
        crossover_rate=0.8,
        mutation_rate=0.1,
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
        self.crossover_rate = crossover_rate
        self.mutation_rate = mutation_rate

        self.problem = LocalizationProblem(
            sensor_nodes,
            anchor_nodes,
            communication_range,
        )

    def tournament_selection(
        self,
        evaluated_population,
        tournament_size=3,
    ):
        """
        Select one parent using Tournament Selection.
        Lower fitness is better.
        """

        contestants = random.sample(
            evaluated_population,
            tournament_size,
        )

        winner = min(
            contestants,
            key=lambda individual: individual["fitness"],
        )

        return copy.deepcopy(winner["position"])

    def crossover(
        self,
        parent1,
        parent2,
    ):
        """
        Perform Uniform Crossover between two parents.
        """

        # No crossover
        if random.random() > self.crossover_rate:
            return (
                copy.deepcopy(parent1),
                copy.deepcopy(parent2),
            )

        child1 = {}
        child2 = {}

        for sensor in self.sensor_nodes:

            sensor_id = sensor["id"]

            if random.random() < 0.5:

                child1[sensor_id] = {
                    "x": parent1[sensor_id]["x"],
                    "y": parent1[sensor_id]["y"],
                }

                child2[sensor_id] = {
                    "x": parent2[sensor_id]["x"],
                    "y": parent2[sensor_id]["y"],
                }

            else:

                child1[sensor_id] = {
                    "x": parent2[sensor_id]["x"],
                    "y": parent2[sensor_id]["y"],
                }

                child2[sensor_id] = {
                    "x": parent1[sensor_id]["x"],
                    "y": parent1[sensor_id]["y"],
                }

        return child1, child2

    def mutation(
        self,
        chromosome,
    ):
        """
        Perform random mutation on a chromosome.
        """

        for sensor in self.sensor_nodes:

            sensor_id = sensor["id"]

            if random.random() < self.mutation_rate:

                chromosome[sensor_id]["x"] += random.uniform(-20, 20)
                chromosome[sensor_id]["y"] += random.uniform(-20, 20)

                chromosome[sensor_id]["x"] = max(
                    0,
                    min(self.network_width, chromosome[sensor_id]["x"]),
                )

                chromosome[sensor_id]["y"] = max(
                    0,
                    min(self.network_height, chromosome[sensor_id]["y"]),
                )

        return chromosome

    def run(self):
        """
        Execute the Genetic Algorithm.
        """

        # Initialize population
        population = Population.initialize(
            sensor_nodes=self.sensor_nodes,
            population_size=self.population_size,
            network_width=self.network_width,
            network_height=self.network_height,
        )

        best_solution = None
        convergence_curve = []

        for iteration in range(self.max_iterations):

            # Evaluate population
            evaluated_population = Population.evaluate(
                population,
                self.problem,
            )

            evaluated_population.sort(
                key=lambda individual: individual["fitness"]
            )

            # Update global best
            if (
                best_solution is None
                or evaluated_population[0]["fitness"] < best_solution["fitness"]
            ):
                best_solution = copy.deepcopy(
                    evaluated_population[0]
                )

            convergence_curve.append(
                best_solution["fitness"]
            )

            # ---------- Elitism ----------
            new_population = [
                copy.deepcopy(best_solution["position"])
            ]

            # ---------- Generate New Population ----------
            while len(new_population) < self.population_size:

                parent1 = self.tournament_selection(
                    evaluated_population
                )

                parent2 = self.tournament_selection(
                    evaluated_population
                )

                child1, child2 = self.crossover(
                    parent1,
                    parent2,
                )

                child1 = self.mutation(child1)
                child2 = self.mutation(child2)

                new_population.append(child1)

                if len(new_population) < self.population_size:
                    new_population.append(child2)

            population = Population.boundary_check(
                new_population,
                self.network_width,
                self.network_height,
            )

        return {
            "algorithm": "GA",
            "best_fitness": best_solution["fitness"],
            "best_position": best_solution["position"],
            "localized_nodes": len(best_solution["position"]),
            "population_size": self.population_size,
            "iterations": self.max_iterations,
            "convergence_curve": convergence_curve,
            "status": "success",
        }