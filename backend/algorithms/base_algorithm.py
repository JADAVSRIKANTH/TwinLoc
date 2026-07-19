from abc import ABC, abstractmethod


class BaseLocalizationAlgorithm(ABC):
    """
    Abstract base class for all localization algorithms.
    """

    def __init__(
        self,
        sensor_nodes,
        anchor_nodes,
        communication_range,
        network_width,
        network_height,
        max_iterations=100,
    ):
        self.sensor_nodes = sensor_nodes
        self.anchor_nodes = anchor_nodes
        self.communication_range = communication_range
        self.network_width = network_width
        self.network_height = network_height
        self.max_iterations = max_iterations

    @abstractmethod
    def run(self):
        """
        Execute the localization algorithm.

        Returns:
            dict
        """
        pass