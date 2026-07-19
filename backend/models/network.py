from pydantic import BaseModel


class NetworkRequest(BaseModel):
    network_width: int
    network_height: int
    sensor_nodes: int
    anchor_nodes: int
    communication_range: int
    deployment: str
    algorithm: str
    seed: int
    max_iterations: int = 100