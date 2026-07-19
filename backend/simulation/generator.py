import random
import math


def generate_random_network(request):
    random.seed(request.seed)

    sensor_nodes = []
    anchor_nodes = []

    # Generate Anchor Nodes
    for i in range(request.anchor_nodes):
        anchor_nodes.append({
            "id": f"A{i+1}",
            "x": round(random.uniform(0, request.network_width), 2),
            "y": round(random.uniform(0, request.network_height), 2)
        })

    # Generate Sensor Nodes
    for i in range(request.sensor_nodes):
        sensor_nodes.append({
            "id": i + 1,
            "x": round(random.uniform(0, request.network_width), 2),
            "y": round(random.uniform(0, request.network_height), 2)
        })

    # Generate measured distances from each sensor to nearby anchors
    measured_distances = {}

    for sensor in sensor_nodes:

        sensor_measurements = {}

        for anchor in anchor_nodes:

            distance = math.sqrt(
                (sensor["x"] - anchor["x"]) ** 2 +
                (sensor["y"] - anchor["y"]) ** 2
            )

            # Store only anchors within communication range
            if distance <= request.communication_range:
                sensor_measurements[anchor["id"]] = round(distance, 2)

        measured_distances[sensor["id"]] = sensor_measurements

    return {
        "network_width": request.network_width,
        "network_height": request.network_height,
        "communication_range": request.communication_range,

        "sensor_nodes": sensor_nodes,
        "anchor_nodes": anchor_nodes,

        # NEW
        "measured_distances": measured_distances,

        "statistics": {
            "sensor_nodes": request.sensor_nodes,
            "anchor_nodes": request.anchor_nodes,
            "total_nodes": request.sensor_nodes + request.anchor_nodes
        }
    }