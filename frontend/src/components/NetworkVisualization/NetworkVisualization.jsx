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

  const WIDTH = 900;
  const HEIGHT = 550;

  const networkWidth = network.network_width;
  const networkHeight = network.network_height;
  const communicationRange = network.communication_range;

  const sensorNodes = network.sensor_nodes;
  const anchorNodesList = network.anchor_nodes;

  const allNodes = [...sensorNodes, ...anchorNodesList];

  // -----------------------------
  // Calculate Communication Links
  // -----------------------------
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

  // -----------------------------
  // Statistics
  // -----------------------------
  const totalNodes = network.statistics.total_nodes;
  const anchorNodes = network.statistics.anchor_nodes;
  const unknownNodes = totalNodes - anchorNodes;

  return (
    <div className="network-container">

      <h2>Network Visualization</h2>

      {/* ================= Legend ================= */}

      <div className="network-legend">

        <div className="legend-item">
          <span className="legend sensor"></span>
          Sensor Node
        </div>

        <div className="legend-item">
          <span className="legend anchor"></span>
          Anchor Node
        </div>

        <div className="legend-item">
          <span className="legend link"></span>
          Communication Link
        </div>

      </div>

      {/* ================= SVG ================= */}

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="auto"
        className="network-canvas"
        style={{
          background: "#f8fafc",
          borderRadius: "12px",
        }}
      >
        {/* Communication Links */}

        {connections.map((connection, index) => (

          <line
            key={index}
            x1={connection.from.x * (WIDTH / networkWidth)}
            y1={HEIGHT - connection.from.y * (HEIGHT / networkHeight)}
            x2={connection.to.x * (WIDTH / networkWidth)}
            y2={HEIGHT - connection.to.y * (HEIGHT / networkHeight)}
            stroke="#94a3b8"
            strokeOpacity="0.55"
            strokeWidth="1"
          />

        ))}

        {/* Sensor Nodes */}

        {sensorNodes.map((node) => (

          <circle
            key={`S-${node.id}`}
            cx={node.x * (WIDTH / networkWidth)}
            cy={HEIGHT - node.y * (HEIGHT / networkHeight)}
            r="5"
            fill="#2563eb"
          >
            <title>
              {`Sensor Node

ID : ${node.id}

X : ${node.x.toFixed(2)}

Y : ${node.y.toFixed(2)}`}
            </title>
          </circle>

        ))}

        {/* Anchor Nodes */}

        {anchorNodesList.map((node) => (

          <polygon
            key={`A-${node.id}`}
            points={`
              ${node.x * (WIDTH / networkWidth)},${HEIGHT - node.y * (HEIGHT / networkHeight) - 7}
              ${node.x * (WIDTH / networkWidth) - 7},${HEIGHT - node.y * (HEIGHT / networkHeight) + 7}
              ${node.x * (WIDTH / networkWidth) + 7},${HEIGHT - node.y * (HEIGHT / networkHeight) + 7}
            `}
            fill="#dc2626"
          >
            <title>
              {`Anchor Node

ID : ${node.id}

X : ${node.x.toFixed(2)}

Y : ${node.y.toFixed(2)}`}
            </title>
          </polygon>

        ))}

      </svg>

      {/* ================= Statistics ================= */}

      <div className="network-stats">

        <div className="stat-box">
          <h4>Total Nodes</h4>
          <h2>{totalNodes}</h2>
        </div>

        <div className="stat-box">
          <h4>Anchor Nodes</h4>
          <h2>{anchorNodes}</h2>
        </div>

        <div className="stat-box">
          <h4>Unknown Nodes</h4>
          <h2>{unknownNodes}</h2>
        </div>

        <div className="stat-box">
          <h4>Communication Range</h4>
          <h2>{communicationRange} m</h2>
        </div>

        <div className="stat-box">
          <h4>Communication Links</h4>
          <h2>{connections.length}</h2>
        </div>

      </div>

    </div>
  );
}

export default NetworkVisualization;