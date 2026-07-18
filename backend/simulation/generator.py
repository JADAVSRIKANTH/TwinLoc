import random


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

    return {
        "network_width": request.network_width,
        "network_height": request.network_height,
        "communication_range": request.communication_range,

        "sensor_nodes": sensor_nodes,
        "anchor_nodes": anchor_nodes,

        "statistics": {
            "total_nodes": request.sensor_nodes,
            "anchor_nodes": request.anchor_nodes,
            "unknown_nodes": request.sensor_nodes - request.anchor_nodes
        }
    }