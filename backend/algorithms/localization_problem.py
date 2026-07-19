import math


class LocalizationProblem:
    """
    Represents the WSN localization problem.
    Provides common utility functions used by all localization algorithms.
    """

    def __init__(
        self,
        sensor_nodes,
        anchor_nodes,
        communication_range,
    ):
        self.sensor_nodes = sensor_nodes
        self.anchor_nodes = anchor_nodes
        self.communication_range = communication_range

    def euclidean_distance(self, p1, p2):
        """
        Compute Euclidean distance between two nodes.
        """

        return math.sqrt(
            (p1["x"] - p2["x"]) ** 2 +
            (p1["y"] - p2["y"]) ** 2
        )

    def get_neighbors(self):
        """
        Find all anchor nodes within the communication range
        of each sensor node.

        Returns:
            dict
        """

        neighbors = {}

        for sensor in self.sensor_nodes:

            sensor_neighbors = []

            for anchor in self.anchor_nodes:

                distance = self.euclidean_distance(sensor, anchor)

                if distance <= self.communication_range:

                    sensor_neighbors.append({
                        "anchor_id": anchor["id"],
                        "distance": distance
                    })

            neighbors[sensor["id"]] = sensor_neighbors

        return neighbors

    def compute_distance_matrix(self):
        """
        Compute the distance between every sensor node
        and every anchor node.

        Returns:
            dict
        """

        distance_matrix = {}

        for sensor in self.sensor_nodes:

            sensor_distances = {}

            for anchor in self.anchor_nodes:

                sensor_distances[anchor["id"]] = self.euclidean_distance(
                    sensor,
                    anchor
                )

            distance_matrix[sensor["id"]] = sensor_distances

        return distance_matrix

    def fitness(self, estimated_positions):
        """
        Compute the localization error of a candidate solution.

        The fitness is calculated using only neighboring anchors
        (anchors inside the communication range).

        Lower fitness indicates a better localization solution.

        Parameters
        ----------
        estimated_positions : dict
            {
                sensor_id: {
                    "x": value,
                    "y": value
                }
            }

        Returns
        -------
        float
            Total localization error.
        """

        neighbors = self.get_neighbors()

        # Fast lookup for anchors
        anchor_lookup = {
            anchor["id"]: anchor
            for anchor in self.anchor_nodes
        }

        total_error = 0.0

        for sensor in self.sensor_nodes:

            sensor_id = sensor["id"]

            if sensor_id not in estimated_positions:
                continue

            estimated_sensor = estimated_positions[sensor_id]

            for neighbor in neighbors[sensor_id]:

                anchor = anchor_lookup[neighbor["anchor_id"]]

                measured_distance = neighbor["distance"]

                estimated_distance = self.euclidean_distance(
                    estimated_sensor,
                    anchor
                )

                total_error += (
                    measured_distance - estimated_distance
                ) ** 2

        return total_error