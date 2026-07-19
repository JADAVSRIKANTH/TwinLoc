import random


class Population:
    """
    Utility class for population initialization,
    evaluation, and boundary handling.
    """

    @staticmethod
    def initialize(
        sensor_nodes,
        population_size,
        network_width,
        network_height,
    ):
        """
        Generate the initial population.
        """

        population = []

        for _ in range(population_size):

            individual = {}

            for sensor in sensor_nodes:

                individual[sensor["id"]] = {
                    "x": random.uniform(0, network_width),
                    "y": random.uniform(0, network_height),
                }

            population.append(individual)

        return population

    @staticmethod
    def evaluate(
        population,
        problem,
    ):
        """
        Evaluate the fitness of every individual.
        """

        evaluated_population = []

        for individual in population:

            fitness = problem.fitness(individual)

            evaluated_population.append({
                "position": individual,
                "fitness": fitness,
            })

        return evaluated_population

    @staticmethod
    def boundary_check(
        population,
        network_width,
        network_height,
    ):
        """
        Keep every individual inside the search space.
        """

        for individual in population:

            for sensor_id in individual:

                individual[sensor_id]["x"] = max(
                    0,
                    min(network_width, individual[sensor_id]["x"]),
                )

                individual[sensor_id]["y"] = max(
                    0,
                    min(network_height, individual[sensor_id]["y"]),
                )

        return population