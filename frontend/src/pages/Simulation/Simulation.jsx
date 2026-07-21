import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNetwork } from "../../context/NetworkContext";
import { runLocalization } from "../../services/localizationService";
import "./Simulation.css";

function Simulation() {
  const {
    network,
    simulationResult,
    setSimulationResult,
  } = useNetwork();

  // Algorithm comes from WSN Generator
  const algorithm = network?.algorithm || "hybrid_mfo_ga";

  const [iterations, setIterations] = useState(100);
  const [population, setPopulation] = useState(30);
  const [loading, setLoading] = useState(false);

  const getAlgorithmName = (algo) => {
    switch (algo) {
      case "mfo":
        return "MFO";

      case "ga":
        return "GA";

      case "hybrid_mfo_ga":
        return "Hybrid MFO-GA";

      default:
        return algo;
    }
  };

  const handleRunSimulation = async () => {
    if (!network) {
      alert("Please generate a network first.");
      return;
    }

    try {
      setLoading(true);

      const response = await runLocalization({
        network_width: network.network_width,
        network_height: network.network_height,
        sensor_nodes: network.sensor_nodes.length,
        anchor_nodes: network.anchor_nodes.length,
        communication_range: network.communication_range,
        deployment: network.deployment,
        algorithm: algorithm,
        seed: network.seed,
        max_iterations: iterations,
        population_size: population,
      });

      setSimulationResult(response);
      console.log("Simulation Response:", response);
      console.log("Analytics:", response.analytics);
      console.log("Localization:", response.localization_result);

      console.log("Simulation Result:", response);

      alert("Simulation completed successfully!");
    } catch (error) {
      console.error("Simulation Error:", error);
      alert("Failed to run simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulation-page">

      <Sidebar />

      <main className="simulation-content">

        <h1>Simulation</h1>

        <p>
          Execute localization algorithms on the generated
          Wireless Sensor Network.
        </p>
                {/* ================= Network Summary ================= */}

        {network ? (
          <div className="network-summary">

            <h2>Selected Network</h2>

            <div className="summary-grid">

              <div className="summary-item">
                <strong>Network Size</strong>
                <p>
                  {network.network_width} × {network.network_height} m
                </p>
              </div>

              <div className="summary-item">
                <strong>Sensor Nodes</strong>
                <p>{network.sensor_nodes.length}</p>
              </div>

              <div className="summary-item">
                <strong>Anchor Nodes</strong>
                <p>{network.anchor_nodes.length}</p>
              </div>

              <div className="summary-item">
                <strong>Communication Range</strong>
                <p>{network.communication_range} m</p>
              </div>

              <div className="summary-item">
                <strong>Deployment</strong>
                <p>{network.deployment}</p>
              </div>

              <div className="summary-item">
                <strong>Localization Algorithm</strong>
                <p>{getAlgorithmName(algorithm)}</p>
              </div>

            </div>

          </div>
        ) : (
          <div className="network-summary warning">

            <h2>No Network Generated</h2>

            <p>
              Please generate a Wireless Sensor Network before
              running the simulation.
            </p>

          </div>
        )}

        {/* ================= Simulation Parameters ================= */}

        <div className="simulation-grid">

          {/* Left Panel */}

          <div className="simulation-card">

            <h2>Simulation Parameters</h2>

            <label>Localization Algorithm</label>

            <div className="readonly-field">
              {getAlgorithmName(algorithm)}
            </div>

            <label>Maximum Iterations</label>

            <input
              type="number"
              min="1"
              value={iterations}
              onChange={(e) =>
                setIterations(Number(e.target.value))
              }
            />

            <label>Population Size</label>

            <input
              type="number"
              min="1"
              value={population}
              onChange={(e) =>
                setPopulation(Number(e.target.value))
              }
            />

            <button
              onClick={handleRunSimulation}
              disabled={!network || loading}
            >
              {loading
                ? "Running Simulation..."
                : "Run Simulation"}
            </button>

          </div>

          {/* Right Panel Starts Here */}
                    {/* ================= Right Panel ================= */}

          <div className="simulation-card">

            <h2>Simulation Status</h2>

            <p
              className={`status ${
                loading
                  ? "running"
                  : simulationResult
                  ? "completed"
                  : "ready"
              }`}
            >
              {loading
                ? "Running..."
                : simulationResult
                ? "Completed"
                : "Ready"}
            </p>

            <h2>Performance Metrics</h2>

            <div className="metrics">

              <div className="metric">
                <span>RMSE</span>
                <strong>
                  {simulationResult
                    ? Number(
                        simulationResult.analytics.rmse
                      ).toFixed(2)
                    : "--"}
                </strong>
              </div>

              <div className="metric">
                <span>Mean Localization Error</span>
                <strong>
                  {simulationResult
                    ? Number(
                        simulationResult.analytics
                          .mean_localization_error
                      ).toFixed(2)
                    : "--"}
                </strong>
              </div>

              <div className="metric">
                <span>Normalized Localization Error</span>
                <strong>
                  {simulationResult
                    ? Number(
                        simulationResult.analytics
                          .normalized_localization_error
                      ).toFixed(2)
                    : "--"}
                </strong>
              </div>

              <div className="metric">
                <span>Localization Success Rate</span>
                <strong>
                  {simulationResult
                    ? `${Number(
                        simulationResult.analytics
                          .localization_success_rate
                      ).toFixed(2)} %`
                    : "--"}
                </strong>
              </div>

              <div className="metric">
                <span>Localized Nodes</span>
                <strong>
                  {simulationResult
                    ? simulationResult.analytics
                        .localized_nodes
                    : "--"}
                </strong>
              </div>

              <div className="metric">
                <span>Unlocalized Nodes</span>
                <strong>
                  {simulationResult
                    ? simulationResult.analytics
                        .unlocalized_nodes
                    : "--"}
                </strong>
              </div>

              <div className="metric">
                <span>Execution Time</span>
                <strong>
                  {simulationResult
                    ? `${Number(
                        simulationResult
                          .localization_result
                          .execution_time
                      ).toFixed(2)} sec`
                    : "--"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Simulation;