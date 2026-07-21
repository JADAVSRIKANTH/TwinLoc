/* ============================================================
   PART 1 - Imports, Context & Helper Functions
============================================================ */

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

    /* ============================================================
       Context
    ============================================================ */

    const {
        network,
        simulationResult,
        comparisonResults,
        setComparisonResults,
    } = useNetwork();

    /* ============================================================
       State
    ============================================================ */

    const [loadingComparison, setLoadingComparison] =
        useState(false);

    /* ============================================================
       Helper Functions
    ============================================================ */

    const getAlgorithmName = (algorithm) => {

        switch (algorithm) {

            case "mfo":
                return "MFO";

            case "ga":
                return "GA";

            case "hybrid_mfo_ga":
                return "Hybrid MFO-GA";

            default:
                return algorithm || "--";

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
                return deployment || "--";

        }

    };

    const formatNumber = (value) => {

        if (value === undefined || value === null)
            return "--";

        return Number(value).toFixed(2);

    };

    const formatPercent = (value) => {

        if (value === undefined || value === null)
            return "--";

        return `${Number(value).toFixed(2)} %`;

    };

    const formatTime = (value) => {

        if (value === undefined || value === null)
            return "--";

        return `${Number(value).toFixed(2)} sec`;

    };

    /* ============================================================
       Compare Algorithms
    ============================================================ */

    const handleCompareAlgorithms = async () => {

        if (!network) {

            alert("Generate a network first.");

            return;

        }

        setLoadingComparison(true);

        try {

            const response =
                await compareAlgorithms({

                    network_width:
                        network.network_width,

                    network_height:
                        network.network_height,

                    sensor_nodes:
                        network.sensor_nodes.length,

                    anchor_nodes:
                        network.anchor_nodes.length,

                    communication_range:
                        network.communication_range,

                    deployment:
                        network.deployment,

                    algorithm:
                        "hybrid_mfo_ga",

                    seed:
                        network.seed || 12345,

                    max_iterations: 100,

                    population_size: 30,

                });

            setComparisonResults(
                response.results
            );

        } catch (error) {

            console.error(
                "Comparison failed:",
                error
            );

            alert(
                "Comparison failed. Please try again."
            );

        } finally {

            setLoadingComparison(false);

        }

    };

/* ============================================================
   PART 2 STARTS HERE
   No Simulation Data
   Analytics Calculations
   Performance Summary
   Network Configuration
============================================================ */
/* ============================================================
   PART 2 - No Simulation Data, Analytics Calculations,
            Performance Summary & Network Configuration
============================================================ */

    /* ============================================================
       No Simulation Data
    ============================================================ */

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
                            localization simulation before
                            viewing analytics.
                        </p>

                    </div>

                </main>

            </div>

        );

    }

    /* ============================================================
       Analytics Calculations
    ============================================================ */

    const bestAlgorithm =
        comparisonResults.length > 0
            ? comparisonResults.reduce((best, current) =>
                  current.rmse < best.rmse
                      ? current
                      : best
              )
            : null;

    const fastestAlgorithm =
        comparisonResults.length > 0
            ? comparisonResults.reduce((best, current) =>
                  current.execution_time <
                  best.execution_time
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
                    Analyze, compare and evaluate the
                    performance of Wireless Sensor Network
                    localization algorithms.
                </p>

                {/* =====================================================
                    Performance Summary
                ===================================================== */}

                <section className="analytics-section">

                    <h2>📊 Performance Summary</h2>

                    <div className="summary-cards">

                        <div className="summary-card">

                            <h3>RMSE</h3>

                            <p>
                                {formatNumber(
                                    simulationResult.analytics.rmse
                                )}
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
                                    simulationResult
                                        .localization_result
                                        .execution_time
                                )}
                            </p>

                        </div>

                    </div>

                </section>

                {/* =====================================================
                    Current Network Configuration
                ===================================================== */}

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

                {/* ---------- PART 3 STARTS FROM THE NEXT LINE ---------- */}
                                {/* =====================================================
                    Algorithm Comparison
                ===================================================== */}

                <section className="analytics-section">

                    <div className="section-header">

                        <h2>⚖️ Algorithm Comparison</h2>

                        <button
                            className="compare-btn"
                            onClick={handleCompareAlgorithms}
                            disabled={loadingComparison}
                        >

                            {loadingComparison
                                ? "Comparing..."
                                : "Compare Algorithms"}

                        </button>

                    </div>

                    {comparisonResults.length === 0 ? (

                        <div className="analytics-warning">

                            <p>

                                Click <strong>Compare Algorithms</strong> to
                                evaluate MFO, GA and Hybrid MFO-GA on the
                                current network.

                            </p>

                        </div>

                    ) : (

                        <div className="comparison-table-container">

                            <table className="comparison-table">

                                <thead>

                                    <tr>

                                        <th>Algorithm</th>

                                        <th>RMSE</th>

                                        <th>Mean Error</th>

                                        <th>Normalized Error</th>

                                        <th>Success Rate</th>

                                        <th>Execution Time</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {comparisonResults.map(
                                        (item, index) => (

                                            <tr key={index}>

                                                <td>

                                                    {getAlgorithmName(
                                                        item.algorithm
                                                    )}

                                                </td>

                                                <td>

                                                    {formatNumber(
                                                        item.rmse
                                                    )}

                                                </td>

                                                <td>

                                                    {formatNumber(
                                                        item.mean_localization_error
                                                    )}

                                                </td>

                                                <td>

                                                    {formatNumber(
                                                        item.normalized_localization_error
                                                    )}

                                                </td>

                                                <td>

                                                    {formatPercent(
                                                        item.success_rate
                                                    )}

                                                </td>

                                                <td>

                                                    {formatTime(
                                                        item.execution_time
                                                    )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

                {/* ---------- PART 4 STARTS FROM THE NEXT LINE ---------- */}
                                {/* =====================================================
                    Performance Charts
                ===================================================== */}

                {comparisonResults.length > 0 && (

                    <section className="analytics-section">

                        <h2>📈 Performance Charts</h2>

                        {/* RMSE Comparison */}

                        <div className="chart-card">

                            <h3>RMSE Comparison</h3>

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <BarChart
                                    data={comparisonResults}
                                >

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="algorithm"
                                        tickFormatter={getAlgorithmName}
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(value) =>
                                            formatNumber(value)
                                        }
                                        labelFormatter={getAlgorithmName}
                                    />

                                    <Bar
                                        dataKey="rmse"
                                        name="RMSE"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                        {/* Localization Success Rate */}

                        <div className="chart-card">

                            <h3>Localization Success Rate</h3>

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <BarChart
                                    data={comparisonResults}
                                >

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="algorithm"
                                        tickFormatter={getAlgorithmName}
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(value) =>
                                            formatPercent(value)
                                        }
                                        labelFormatter={getAlgorithmName}
                                    />

                                    <Bar
                                        dataKey="success_rate"
                                        name="Success Rate (%)"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                        {/* Execution Time */}

                        <div className="chart-card">

                            <h3>Execution Time</h3>

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <BarChart
                                    data={comparisonResults}
                                >

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="algorithm"
                                        tickFormatter={getAlgorithmName}
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(value) =>
                                            formatTime(value)
                                        }
                                        labelFormatter={getAlgorithmName}
                                    />

                                    <Bar
                                        dataKey="execution_time"
                                        name="Execution Time (sec)"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </section>

                )}

                {/* ---------- PART 5 STARTS FROM THE NEXT LINE ---------- */}
                                {/* =====================================================
                    Best Performing Algorithm
                ===================================================== */}

                {comparisonResults.length > 0 && bestAlgorithm && (

                    <section className="analytics-section">

                        <h2>🏆 Best Performing Algorithm</h2>

                        <div className="recommendation-card">

                            <h3>
                                {getAlgorithmName(bestAlgorithm.algorithm)}
                            </h3>

                            <div className="recommendation-grid">

                                <div className="recommendation-item">

                                    <span>Lowest RMSE</span>

                                    <strong>
                                        {formatNumber(bestAlgorithm.rmse)}
                                    </strong>

                                </div>

                                <div className="recommendation-item">

                                    <span>Mean Localization Error</span>

                                    <strong>
                                        {formatNumber(
                                            bestAlgorithm.mean_localization_error
                                        )}
                                    </strong>

                                </div>

                                <div className="recommendation-item">

                                    <span>Normalized Error</span>

                                    <strong>
                                        {formatNumber(
                                            bestAlgorithm.normalized_localization_error
                                        )}
                                    </strong>

                                </div>

                                <div className="recommendation-item">

                                    <span>Success Rate</span>

                                    <strong>
                                        {formatPercent(
                                            bestAlgorithm.success_rate
                                        )}
                                    </strong>

                                </div>

                                <div className="recommendation-item">

                                    <span>Execution Time</span>

                                    <strong>
                                        {formatTime(
                                            bestAlgorithm.execution_time
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>

                )}

                {/* =====================================================
                    Research Insights
                ===================================================== */}

                {comparisonResults.length > 0 && (

                    <section className="analytics-section">

                        <h2>📑 Research Insights</h2>

                        <div className="insights-card">

                            <ul>

                                <li>

                                    <strong>
                                        Best Localization Accuracy:
                                    </strong>{" "}
                                    {getAlgorithmName(
                                        bestAlgorithm.algorithm
                                    )} achieved the
                                    lowest RMSE of{" "}
                                    <strong>
                                        {formatNumber(
                                            bestAlgorithm.rmse
                                        )}
                                    </strong>.

                                </li>

                                <li>

                                    <strong>
                                        Fastest Algorithm:
                                    </strong>{" "}
                                    {getAlgorithmName(
                                        fastestAlgorithm.algorithm
                                    )} completed localization in{" "}
                                    <strong>
                                        {formatTime(
                                            fastestAlgorithm.execution_time
                                        )}
                                    </strong>.

                                </li>

                                <li>

                                    <strong>
                                        Highest Localization Error:
                                    </strong>{" "}
                                    {getAlgorithmName(
                                        highestErrorAlgorithm.algorithm
                                    )} produced the largest RMSE of{" "}
                                    <strong>
                                        {formatNumber(
                                            highestErrorAlgorithm.rmse
                                        )}
                                    </strong>.

                                </li>

                                <li>

                                    <strong>
                                        Highest Success Rate:
                                    </strong>{" "}
                                    {highestSuccessAlgorithms
                                        .map(item =>
                                            getAlgorithmName(
                                                item.algorithm
                                            )
                                        )
                                        .join(", ")}
                                    {" "}achieved{" "}
                                    <strong>
                                        {formatPercent(
                                            highestSuccessAlgorithms[0]
                                                .success_rate
                                        )}
                                    </strong>.

                                </li>

                            </ul>

                        </div>

                    </section>

                )}

                {/* ---------- PART 6 STARTS FROM THE NEXT LINE ---------- */}
                                {/* =====================================================
                    Simulation Summary
                ===================================================== */}

                <section className="analytics-section">

                    <h2>📝 Simulation Summary</h2>

                    <div className="summary-box">

                        <p>

                            The current Wireless Sensor Network simulation
                            was executed using the{" "}

                            <strong>
                                {getAlgorithmName(network.algorithm)}
                            </strong>

                            {" "}algorithm over a network consisting of{" "}

                            <strong>
                                {network.sensor_nodes.length}
                            </strong>

                            {" "}sensor nodes and{" "}

                            <strong>
                                {network.anchor_nodes.length}
                            </strong>

                            {" "}anchor nodes deployed in a{" "}

                            <strong>
                                {network.network_width} × {network.network_height} m
                            </strong>

                            {" "}area.

                        </p>

                        <p>

                            The simulation achieved an RMSE of{" "}

                            <strong>
                                {formatNumber(
                                    simulationResult.analytics.rmse
                                )}
                            </strong>

                            , with a localization success rate of{" "}

                            <strong>
                                {formatPercent(
                                    simulationResult.analytics
                                        .localization_success_rate
                                )}
                            </strong>

                            .

                        </p>

                    </div>

                </section>

                {/* =====================================================
                    Final Recommendation
                ===================================================== */}

                {comparisonResults.length > 0 && bestAlgorithm && (

                    <section className="analytics-section">

                        <h2>🎯 Final Recommendation</h2>

                        <div className="recommendation-card">

                            <p>

                                Based on the comparative analysis of all
                                localization algorithms,{" "}

                                <strong>
                                    {getAlgorithmName(
                                        bestAlgorithm.algorithm
                                    )}
                                </strong>

                                {" "}is recommended for this deployment
                                because it achieved the lowest localization
                                error while maintaining excellent
                                localization success and competitive
                                execution time.

                            </p>

                        </div>

                    </section>

                )}

            </main>

        </div>

    );

}

export default Analytics;