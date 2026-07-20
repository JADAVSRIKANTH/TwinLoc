import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNetwork } from "../../context/NetworkContext";
import { compareAlgorithms } from "../../services/api";
import "./Analytics.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function Analytics() {

  const {
    network,
    simulationResult,
    comparisonResults,
    setComparisonResults,
  } = useNetwork();

  const [loadingComparison, setLoadingComparison] = useState(false);

  /* =====================================================
      Helper Functions
  ====================================================== */

  const getAlgorithmName = (algo) => {
    switch (algo) {
      case "mfo":
        return "MFO";

      case "ga":
        return "GA";

      case "hybrid_mfo_ga":
        return "Hybrid MFO-GA";

      default:
        return algo || "--";
    }
  };

  const getDeploymentName = (deployment) => {
    switch (deployment) {
      case "random":
        return "Random";

      case "grid":
        return "Grid";

      case "hexagonal":
        return "Hexagonal";

      default:
        return deployment;
    }
  };

  const formatNumber = (value) =>
    Number(value).toFixed(2);

  const formatPercent = (value) =>
    `${Number(value).toFixed(2)}%`;

  const formatTime = (value) =>
    `${Number(value).toFixed(2)} sec`;

  /* =====================================================
      Compare Algorithms
  ====================================================== */

  const handleCompareAlgorithms = async () => {

    if (!network) return;

    setLoadingComparison(true);

    try {

      const response = await compareAlgorithms({

        network_width: network.network_width,
        network_height: network.network_height,

        sensor_nodes: network.sensor_nodes.length,
        anchor_nodes: network.anchor_nodes.length,

        communication_range: network.communication_range,

        deployment: network.deployment,

        algorithm: "hybrid_mfo_ga",

        seed: network.seed || 12345,

        max_iterations: 100,

        population_size: 30,

      });

      setComparisonResults(response.results);

    } catch (error) {

      console.error("Comparison failed:", error);

    } finally {

      setLoadingComparison(false);

    }

  };

  /* =====================================================
      No Simulation Data
  ====================================================== */

  if (!network || !simulationResult) {

    return (

      <div className="analytics-page">

        <Sidebar />

        <main className="analytics-content">

          <h1>📊 Analytics Dashboard</h1>

          <div className="analytics-warning">

            <h2>No Simulation Data Available</h2>

            <p>
              Please generate a network and run a
              localization simulation before viewing
              analytics.
            </p>

          </div>

        </main>

      </div>

    );

  }

  /* =====================================================
      Analytics Calculations
  ====================================================== */

  const bestAlgorithm =
    comparisonResults.length > 0
      ? comparisonResults.reduce((best, current) =>
          current.rmse < best.rmse ? current : best
        )
      : null;

  const fastestAlgorithm =
    comparisonResults.length > 0
      ? comparisonResults.reduce((best, current) =>
          current.execution_time < best.execution_time
            ? current
            : best
        )
      : null;

  const highestErrorAlgorithm =
    comparisonResults.length > 0
      ? comparisonResults.reduce((worst, current) =>
          current.rmse > worst.rmse
            ? current
            : worst
        )
      : null;

  const highestSuccessAlgorithms =
    comparisonResults.length > 0
      ? comparisonResults.filter(
          algo =>
            algo.success_rate ===
            Math.max(
              ...comparisonResults.map(
                item => item.success_rate
              )
            )
        )
      : [];

  return (

    <div className="analytics-page">

      <Sidebar />

      <main className="analytics-content">

        <h1>📊 Analytics Dashboard</h1>

        <p>
          Analyze, compare, and evaluate the
          performance of wireless sensor network
          localization algorithms.
        </p>

        {/* Part 2 starts here */}
                {/* =====================================================
            Performance Summary
        ====================================================== */}

        <section className="analytics-section">

          <h2>📊 Performance Summary</h2>

          <div className="summary-cards">

            <div className="summary-card">

              <h3>RMSE</h3>

              <p>
                {formatNumber(simulationResult.analytics.rmse)}
              </p>

            </div>

            <div className="summary-card">

              <h3>Mean Localization Error</h3>

              <p>
                {formatNumber(
                  simulationResult.analytics
                    .mean_localization_error
                )}
              </p>

            </div>

            <div className="summary-card">

              <h3>Normalized Localization Error</h3>

              <p>
                {formatNumber(
                  simulationResult.analytics
                    .normalized_localization_error
                )}
              </p>

            </div>

            <div className="summary-card">

              <h3>Localization Success Rate</h3>

              <p>
                {formatPercent(
                  simulationResult.analytics
                    .localization_success_rate
                )}
              </p>

            </div>

            <div className="summary-card">

              <h3>Execution Time</h3>

              <p>
                {formatTime(
                  simulationResult.localization_result
                    .execution_time
                )}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            Current Network Configuration
        ====================================================== */}

        <section className="analytics-section">

          <h2>🌐 Current Network Configuration</h2>

          <div className="network-info">

            <div className="info-card">

              <span>📐 Network Size</span>

              <strong>
                {network.network_width} ×{" "}
                {network.network_height} m
              </strong>

            </div>

            <div className="info-card">

              <span>📡 Sensor Nodes</span>

              <strong>
                {network.sensor_nodes.length}
              </strong>

            </div>

            <div className="info-card">

              <span>📍 Anchor Nodes</span>

              <strong>
                {network.anchor_nodes.length}
              </strong>

            </div>

            <div className="info-card">

              <span>📶 Communication Range</span>

              <strong>
                {network.communication_range} m
              </strong>

            </div>

            <div className="info-card">

              <span>🌍 Deployment</span>

              <strong>
                {getDeploymentName(
                  network.deployment
                )}
              </strong>

            </div>

            <div className="info-card">

              <span>⚙️ Selected Algorithm</span>

              <strong>
                {getAlgorithmName(
                  network.algorithm
                )}
              </strong>

            </div>

          </div>

        </section>

        {/* Part 3 starts here */}
                {/* =====================================================
            Algorithm Comparison
        ====================================================== */}

        <section className="analytics-section">

          <div className="section-header">

            <h2>⚖️ Algorithm Comparison</h2>

            <button
              className="compare-btn"
              onClick={handleCompareAlgorithms}
              disabled={loadingComparison}
            >
              {loadingComparison
                ? "🔄 Comparing Algorithms..."
                : "⚖️ Compare Algorithms"}
            </button>

          </div>

          {comparisonResults.length > 0 ? (

            <div className="comparison-table-container">

              <table className="comparison-table">

                <thead>

                  <tr>

                    <th>Algorithm</th>

                    <th>RMSE</th>

                    <th>Mean Error</th>

                    <th>NLE</th>

                    <th>Execution Time</th>

                    <th>Success Rate</th>

                  </tr>

                </thead>

                <tbody>

                  {comparisonResults.map((result) => {

                    const isBest =
                      bestAlgorithm &&
                      result.algorithm ===
                        bestAlgorithm.algorithm;

                    return (

                      <tr
                        key={result.algorithm}
                        className={
                          isBest ? "best-row" : ""
                        }
                      >

                        <td>

                          <strong>
                            {getAlgorithmName(
                              result.algorithm
                            )}
                          </strong>

                          {isBest && (
                            <span className="winner-badge">
                              🏆 Best
                            </span>
                          )}

                        </td>

                        <td>
                          {formatNumber(result.rmse)}
                        </td>

                        <td>
                          {formatNumber(
                            result.mean_localization_error
                          )}
                        </td>

                        <td>
                          {formatNumber(
                            result.normalized_localization_error
                          )}
                        </td>

                        <td>
                          {formatTime(
                            result.execution_time
                          )}
                        </td>

                        <td>
                          {formatPercent(
                            result.success_rate
                          )}
                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="comparison-placeholder">

              <h3>
                No Comparison Results Available
              </h3>

              <p>

                Click the
                <strong>
                  {" "}Compare Algorithms{" "}
                </strong>
                button to evaluate MFO, GA,
                and Hybrid MFO-GA using the
                current wireless sensor network.

              </p>

            </div>

          )}

        </section>

        {/* Part 4 starts here */}
                {/* =====================================================
            Performance Charts
        ====================================================== */}

        {comparisonResults.length > 0 && (

          <section className="analytics-section">

            <h2>📊 Performance Charts</h2>

            <div className="charts-grid">

              {/* ================= RMSE Chart ================= */}

              <div className="chart-container">

                <h3>RMSE Comparison</h3>

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart data={comparisonResults}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="algorithm"
                      interval={0}
                      tick={{ fontSize: 12 }}
                      tickFormatter={
                        getAlgorithmName
                      }
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        formatNumber(value),
                        "RMSE",
                      ]}
                      labelFormatter={(label) =>
                        getAlgorithmName(label)
                      }
                    />

                    <Bar
                      dataKey="rmse"
                      fill="#2563EB"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* ============ Execution Time Chart ============ */}

              <div className="chart-container">

                <h3>Execution Time Comparison</h3>

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart data={comparisonResults}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="algorithm"
                      interval={0}
                      tick={{ fontSize: 12 }}
                      tickFormatter={
                        getAlgorithmName
                      }
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        formatTime(value),
                        "Execution Time",
                      ]}
                      labelFormatter={(label) =>
                        getAlgorithmName(label)
                      }
                    />

                    <Bar
                      dataKey="execution_time"
                      fill="#10B981"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* ================= Mean Error Chart ================= */}

              <div className="chart-container">

                <h3>Mean Localization Error</h3>

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart data={comparisonResults}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="algorithm"
                      interval={0}
                      tick={{ fontSize: 12 }}
                      tickFormatter={
                        getAlgorithmName
                      }
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        formatNumber(value),
                        "Mean Error",
                      ]}
                      labelFormatter={(label) =>
                        getAlgorithmName(label)
                      }
                    />

                    <Bar
                      dataKey="mean_localization_error"
                      fill="#F59E0B"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* ================= Success Rate Chart ================= */}

              <div className="chart-container">

                <h3>Localization Success Rate</h3>

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart data={comparisonResults}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="algorithm"
                      interval={0}
                      tick={{ fontSize: 12 }}
                      tickFormatter={
                        getAlgorithmName
                      }
                    />

                    <YAxis />

                    <Tooltip
                      formatter={(value) => [
                        formatPercent(value),
                        "Success Rate",
                      ]}
                      labelFormatter={(label) =>
                        getAlgorithmName(label)
                      }
                    />

                    <Bar
                      dataKey="success_rate"
                      fill="#8B5CF6"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </section>

        )}

        {/* Part 5 starts here */}
                {/* =====================================================
            Best Performing Algorithm
        ====================================================== */}

        {bestAlgorithm && (

          <section className="analytics-section">

            <h2>🏆 Best Performing Algorithm</h2>

            <div className="best-algorithm-card">

              <div className="best-header">

                <div>

                  <h3>
                    {getAlgorithmName(
                      bestAlgorithm.algorithm
                    )}
                  </h3>

                  <p>
                    This algorithm achieved the
                    lowest Root Mean Square Error
                    (RMSE) among all evaluated
                    localization algorithms while
                    maintaining excellent overall
                    performance.
                  </p>

                </div>

                <div className="winner-icon">
                  🏆
                </div>

              </div>

              <div className="best-grid">

                <div className="metric-box">

                  <span>RMSE</span>

                  <strong>
                    {formatNumber(
                      bestAlgorithm.rmse
                    )}
                  </strong>

                </div>

                <div className="metric-box">

                  <span>Mean Error</span>

                  <strong>
                    {formatNumber(
                      bestAlgorithm
                        .mean_localization_error
                    )}
                  </strong>

                </div>

                <div className="metric-box">

                  <span>Normalized Error</span>

                  <strong>
                    {formatNumber(
                      bestAlgorithm
                        .normalized_localization_error
                    )}
                  </strong>

                </div>

                <div className="metric-box">

                  <span>Execution Time</span>

                  <strong>
                    {formatTime(
                      bestAlgorithm
                        .execution_time
                    )}
                  </strong>

                </div>

                <div className="metric-box">

                  <span>Success Rate</span>

                  <strong>
                    {formatPercent(
                      bestAlgorithm
                        .success_rate
                    )}
                  </strong>

                </div>

                <div className="metric-box">

                  <span>Algorithm Rank</span>

                  <strong>#1</strong>

                </div>

              </div>

              <div className="recommendation">

                <h4>
                  📌 Research Recommendation
                </h4>

                <p>

                  Based on the comparative
                  evaluation of localization
                  algorithms,

                  <strong>
                    {" "}
                    {getAlgorithmName(
                      bestAlgorithm.algorithm
                    )}
                  </strong>

                  {" "}is recommended for the
                  current wireless sensor network
                  because it provides the best
                  trade-off between localization
                  accuracy, execution time,
                  normalized localization error,
                  and localization success rate.

                </p>

              </div>

            </div>

          </section>

        )}

        {/* Part 6 starts here */}
                {/* =====================================================
            Simulation Insights
        ====================================================== */}

        {comparisonResults.length > 0 && (

          <section className="analytics-section">

            <h2>📈 Simulation Insights</h2>

            <div className="insights-card">

              <div className="insight-item">

                <span>🏆 Lowest RMSE</span>

                <strong>
                  {getAlgorithmName(bestAlgorithm.algorithm)}
                </strong>

              </div>

              <div className="insight-item">

                <span>⚡ Fastest Algorithm</span>

                <strong>
                  {getAlgorithmName(fastestAlgorithm.algorithm)}
                </strong>

              </div>

              <div className="insight-item">

                <span>🎯 Highest Success Rate</span>

                <strong>

                  {highestSuccessAlgorithms
                    .map(algo =>
                      getAlgorithmName(algo.algorithm)
                    )
                    .join(", ")}

                </strong>

              </div>

              <div className="insight-item">

                <span>📉 Highest Localization Error</span>

                <strong>
                  {getAlgorithmName(
                    highestErrorAlgorithm.algorithm
                  )}
                </strong>

              </div>

              <div className="recommendation-box">

                <h3>📌 Final Recommendation</h3>

                <p>

                  Based on the comprehensive
                  comparative analysis,

                  <strong>
                    {" "}
                    {getAlgorithmName(
                      bestAlgorithm.algorithm
                    )}
                  </strong>

                  {" "}demonstrated the best overall
                  localization performance for the
                  current wireless sensor network.

                </p>

                <ul>

                  <li>
                    ✔ Lowest Root Mean Square Error
                    (RMSE)
                  </li>

                  <li>
                    ✔ High localization accuracy
                  </li>

                  <li>
                    ✔ Excellent localization success
                    rate
                  </li>

                  <li>
                    ✔ Reliable performance for the
                    current deployment
                  </li>

                  <li>
                    ✔ Recommended for practical
                    Wireless Sensor Network
                    localization
                  </li>

                </ul>

              </div>

            </div>

          </section>

        )}

        {/* =====================================================
            Dashboard Footer
        ====================================================== */}

        <footer className="analytics-footer">

          <p>

            <strong>TwinLoc</strong> • Digital Twin
            Based Wireless Sensor Network
            Localization Platform

          </p>

          <p>

            Department of Information Technology

          </p>

          <p>

            Performance Analytics Dashboard

          </p>

        </footer>

      </main>

    </div>

  );

}

export default Analytics;