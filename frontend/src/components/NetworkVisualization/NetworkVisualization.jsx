import "./NetworkVisualization.css";

function NetworkVisualization({ network }) {
  if (!network) {
    return (
      <div className="network-container">
        <h2>Network Visualization</h2>
        <p>Generate a network to visualize it.</p>
      </div>
    );
  }

  const width = 700;
  const height = 500;

  // Network dimensions received from backend
  const networkWidth = network.network_width;
  const networkHeight = network.network_height;
  const communicationRange = network.communication_range;

  // Combine all nodes
  const allNodes = [
    ...network.sensor_nodes,
    ...network.anchor_nodes,
  ];

  // Calculate communication links
  const connections = [];

  for (let i = 0; i < allNodes.length; i++) {
    for (let j = i + 1; j < allNodes.length; j++) {
      const dx = allNodes[i].x - allNodes[j].x;
      const dy = allNodes[i].y - allNodes[j].y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= communicationRange) {
        connections.push({
          from: allNodes[i],
          to: allNodes[j],
        });
      }
    }
  }

  console.log("Connections:", connections.length);

  return (
    <div className="network-container">
      <h2>Network Visualization</h2>

      <svg
        width={width}
        height={height}
        className="network-canvas"
      >
        {/* Communication Links */}
        {connections.map((connection, index) => (
          <line
            key={index}
            x1={connection.from.x * (width / networkWidth)}
            y1={height - connection.from.y * (height / networkHeight)}
            x2={connection.to.x * (width / networkWidth)}
            y2={height - connection.to.y * (height / networkHeight)}
            stroke="#9ca3af"
            strokeWidth="1"
          />
        ))}

        {/* Sensor Nodes */}
        {network.sensor_nodes.map((node) => (
          <circle
            key={`S-${node.id}`}
            cx={node.x * (width / networkWidth)}
            cy={height - node.y * (height / networkHeight)}
            r="4"
            fill="#2563eb"
          />
        ))}

        {/* Anchor Nodes */}
        {network.anchor_nodes.map((node) => (
          <polygon
            key={`A-${node.id}`}
            points={`
              ${node.x * (width / networkWidth)},${height - node.y * (height / networkHeight) - 6}
              ${node.x * (width / networkWidth) - 6},${height - node.y * (height / networkHeight) + 6}
              ${node.x * (width / networkWidth) + 6},${height - node.y * (height / networkHeight) + 6}
            `}
            fill="#dc2626"
          />
        ))}
      </svg>

      <div className="network-info">
        <p><strong>Total Nodes:</strong> {network.statistics.total_nodes}</p>
        <p><strong>Anchor Nodes:</strong> {network.statistics.anchor_nodes}</p>
        <p><strong>Unknown Nodes:</strong> {network.statistics.unknown_nodes}</p>
        <p><strong>Communication Range:</strong> {communicationRange} m</p>
        <p><strong>Communication Links:</strong> {connections.length}</p>
      </div>
    </div>
  );
}

export default NetworkVisualization;