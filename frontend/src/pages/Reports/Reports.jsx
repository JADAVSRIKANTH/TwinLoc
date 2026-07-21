/* ============================================================
   PART 1 - Imports, Context & Helper Functions
============================================================ */

import React from "react";

import "./Reports.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

import { useNetwork } from "../../context/NetworkContext";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const Reports = () => {

    /* ============================================================
       Context
    ============================================================ */

    const currentDate = new Date().toLocaleString();

    const {
        network,
        simulationResult,
        comparisonResults,
    } = useNetwork();

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
                return algorithm
                    ? algorithm.replaceAll("_", " ").toUpperCase()
                    : "--";

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

        return Number(value).toFixed(4);

    };

    const formatPercent = (value) => {

        if (value === undefined || value === null)
            return "--";

        return `${Number(value).toFixed(2)} %`;

    };

    const formatTime = (value) => {

        if (value === undefined || value === null)
            return "--";

        return `${Number(value).toFixed(4)} sec`;

    };

    /* ============================================================
       Best Performing Algorithm
    ============================================================ */

    const bestAlgorithm =
        comparisonResults.length > 0
            ? comparisonResults.reduce((best, current) =>
                  current.rmse < best.rmse
                      ? current
                      : best
              )
            : null;

    /* ============================================================
       Export Functions
       (Implementation will be added later)
    ============================================================ */

    const handleGeneratePDF = () => {

        console.log("Generate PDF");

    };

    const handleExportCSV = () => {

        console.log("Export CSV");

    };

    const handlePrintReport = () => {

        window.print();

    };

    /* ---------- PART 2 STARTS FROM THE NEXT LINE ---------- */

    return (
                <div className="reports-page">

            <Sidebar />

            <div className="reports-content">

                <Navbar />

                <div className="report-paper">

                    {/* =====================================================
                        Report Header
                    ===================================================== */}

                    <div className="report-header">

                        <h1>TwinLoc Simulation Report</h1>

                        <p>
                            Digital Twin Based Wireless Sensor Network
                            Localization
                        </p>

                        <span>
                            Generated On : {currentDate}
                        </span>

                    </div>

                    <hr />

                    {/* =====================================================
                        Network Configuration
                    ===================================================== */}

                    <section className="report-section">

                        <h2>1. Network Configuration</h2>

                        <div className="report-table">

                            <div className="report-row">
                                <span>Network Width</span>
                                <span>{network?.network_width ?? "--"} m</span>
                            </div>

                            <div className="report-row">
                                <span>Network Height</span>
                                <span>{network?.network_height ?? "--"} m</span>
                            </div>

                            <div className="report-row">
                                <span>Communication Range</span>
                                <span>{network?.communication_range ?? "--"} m</span>
                            </div>

                            <div className="report-row">
                                <span>Deployment Strategy</span>
                                <span>
                                    {getDeploymentName(network?.deployment)}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Localization Algorithm</span>
                                <span>
                                    {getAlgorithmName(network?.algorithm)}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Sensor Nodes</span>
                                <span>
                                    {network?.sensor_nodes?.length ?? "--"}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Anchor Nodes</span>
                                <span>
                                    {network?.anchor_nodes?.length ?? "--"}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Total Nodes</span>
                                <span>

                                    {network
                                        ? (network.sensor_nodes?.length ?? 0) +
                                          (network.anchor_nodes?.length ?? 0)
                                        : "--"}

                                </span>
                            </div>

                            <div className="report-row">
                                <span>Random Seed</span>
                                <span>{network?.seed ?? "--"}</span>
                            </div>

                        </div>

                    </section>

                    {/* =====================================================
                        Simulation Summary
                    ===================================================== */}

                    <section className="report-section">

                        <h2>2. Simulation Summary</h2>

                        <div className="report-summary">

                            {simulationResult ? (

                                <>

                                    <p>

                                        <strong>
                                            Simulation Status :
                                        </strong>{" "}

                                        Successfully Completed

                                    </p>

                                    <p>

                                        <strong>
                                            Algorithm Used :
                                        </strong>{" "}

                                        {getAlgorithmName(
                                            network?.algorithm
                                        )}

                                    </p>

                                    <p>

                                        <strong>
                                            Network Size :
                                        </strong>{" "}

                                        {network?.network_width} ×{" "}
                                        {network?.network_height} m

                                    </p>

                                    <p>

                                        <strong>
                                            Total Nodes :
                                        </strong>{" "}

                                        {(network?.sensor_nodes?.length ?? 0) +
                                            (network?.anchor_nodes?.length ?? 0)}

                                    </p>

                                    <p>

                                        <strong>
                                            Localization Success Rate :
                                        </strong>{" "}

                                        {formatPercent(
                                            simulationResult.analytics
                                                .localization_success_rate
                                        )}

                                    </p>

                                    <p>

                                        <strong>
                                            Execution Time :
                                        </strong>{" "}

                                        {formatTime(
                                            simulationResult
                                                .localization_result
                                                .execution_time
                                        )}

                                    </p>

                                </>

                            ) : (

                                <p>

                                    Run a localization simulation to
                                    generate the report.

                                </p>

                            )}

                        </div>

                    </section>

                    {/* ---------- PART 3 STARTS FROM THE NEXT LINE ---------- */}
                                        {/* =====================================================
                        Performance Metrics
                    ===================================================== */}

                    <section className="report-section">

                        <h2>3. Performance Metrics</h2>

                        <div className="report-table">

                            <div className="report-row">
                                <span>Root Mean Square Error (RMSE)</span>
                                <span>
                                    {simulationResult
                                        ? formatNumber(
                                              simulationResult.analytics.rmse
                                          )
                                        : "--"}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Mean Localization Error (MLE)</span>
                                <span>
                                    {simulationResult
                                        ? formatNumber(
                                              simulationResult.analytics
                                                  .mean_localization_error
                                          )
                                        : "--"}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Normalized Localization Error (NLE)</span>
                                <span>
                                    {simulationResult
                                        ? formatNumber(
                                              simulationResult.analytics
                                                  .normalized_localization_error
                                          )
                                        : "--"}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Localization Success Rate</span>
                                <span>
                                    {simulationResult
                                        ? formatPercent(
                                              simulationResult.analytics
                                                  .localization_success_rate
                                          )
                                        : "--"}
                                </span>
                            </div>

                            <div className="report-row">
                                <span>Execution Time</span>
                                <span>
                                    {simulationResult
                                        ? formatTime(
                                              simulationResult
                                                  .localization_result
                                                  .execution_time
                                          )
                                        : "--"}
                                </span>
                            </div>

                        </div>

                    </section>

                    {/* =====================================================
                        Algorithm Comparison
                    ===================================================== */}

                    <section className="report-section">

                        <h2>4. Algorithm Comparison</h2>

                        {comparisonResults.length > 0 ? (

                            <table className="comparison-table">

                                <thead>

                                    <tr>

                                        <th>Algorithm</th>
                                        <th>RMSE</th>
                                        <th>MLE</th>
                                        <th>NLE</th>
                                        <th>Success Rate</th>
                                        <th>Execution Time</th>
                                        <th>Status</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {comparisonResults.map((item, index) => {

                                        const isBest =
                                            bestAlgorithm &&
                                            item.algorithm ===
                                                bestAlgorithm.algorithm;

                                        return (

                                            <tr key={index}>

                                                <td>
                                                    {getAlgorithmName(
                                                        item.algorithm
                                                    )}
                                                </td>

                                                <td>
                                                    {formatNumber(item.rmse)}
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

                                                <td>

                                                    {isBest
                                                        ? "🏆 Best"
                                                        : "-"}

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        ) : (

                            <div className="report-placeholder">

                                Run the Analytics comparison to
                                generate algorithm comparison
                                results.

                            </div>

                        )}

                    </section>

                    {/* ---------- PART 4 STARTS FROM THE NEXT LINE ---------- */}
                                        {/* =====================================================
                        Performance Charts
                    ===================================================== */}

                    <section className="report-section">

                        <h2>5. Performance Charts</h2>

                        {comparisonResults.length > 0 ? (

                            <>

                                {/* RMSE Chart */}

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
                                                labelFormatter={
                                                    getAlgorithmName
                                                }
                                            />

                                            <Bar
                                                dataKey="rmse"
                                                name="RMSE"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                                {/* Success Rate Chart */}

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
                                                labelFormatter={
                                                    getAlgorithmName
                                                }
                                            />

                                            <Bar
                                                dataKey="success_rate"
                                                name="Success Rate (%)"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                                {/* Execution Time Chart */}

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
                                                labelFormatter={
                                                    getAlgorithmName
                                                }
                                            />

                                            <Bar
                                                dataKey="execution_time"
                                                name="Execution Time (sec)"
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                            </>

                        ) : (

                            <div className="report-placeholder">

                                Run the Analytics comparison to
                                generate performance charts.

                            </div>

                        )}

                    </section>

                    {/* ---------- PART 5 STARTS FROM THE NEXT LINE ---------- */}
                                        {/* =====================================================
                        Best Performing Algorithm
                    ===================================================== */}

                    <section className="report-section">

                        <h2>6. Best Performing Algorithm</h2>

                        {bestAlgorithm ? (

                            <div className="recommendation-card">

                                <h3>
                                    🏆 {getAlgorithmName(bestAlgorithm.algorithm)}
                                </h3>

                                <div className="recommendation-grid">

                                    <div className="recommendation-item">

                                        <span>RMSE</span>

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

                                        <span>Normalized Localization Error</span>

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

                        ) : (

                            <div className="report-placeholder">

                                Run the Analytics comparison to determine
                                the best performing localization algorithm.

                            </div>

                        )}

                    </section>

                    {/* =====================================================
                        Report Summary
                    ===================================================== */}

                    <section className="report-section">

                        <h2>7. Report Summary</h2>

                        <div className="summary-box">

                            {bestAlgorithm ? (

                                <p>

                                    The comparative analysis indicates that{" "}

                                    <strong>
                                        {getAlgorithmName(
                                            bestAlgorithm.algorithm
                                        )}
                                    </strong>

                                    {" "}achieved the best localization
                                    performance by producing the lowest
                                    Root Mean Square Error (RMSE) of{" "}

                                    <strong>
                                        {formatNumber(bestAlgorithm.rmse)}
                                    </strong>

                                    . It also maintained a localization
                                    success rate of{" "}

                                    <strong>
                                        {formatPercent(
                                            bestAlgorithm.success_rate
                                        )}
                                    </strong>

                                    {" "}while completing execution in{" "}

                                    <strong>
                                        {formatTime(
                                            bestAlgorithm.execution_time
                                        )}
                                    </strong>

                                    . Based on these evaluation metrics,
                                    this algorithm provides the best balance
                                    between localization accuracy,
                                    computational efficiency, and overall
                                    network performance for the current
                                    Wireless Sensor Network deployment.

                                </p>

                            ) : (

                                <p>

                                    Complete an algorithm comparison to
                                    generate the automatic report summary.

                                </p>

                            )}

                        </div>

                    </section>

                    {/* =====================================================
                        Research Recommendation
                    ===================================================== */}

                    <section className="report-section">

                        <h2>8. Research Recommendation</h2>

                        <div className="recommendation-card">

                            {bestAlgorithm ? (

                                <>

                                    <p>

                                        Based on the comparative evaluation,
                                        the recommended localization algorithm
                                        for this network is

                                        <strong>
                                            {" "}
                                            {getAlgorithmName(
                                                bestAlgorithm.algorithm
                                            )}
                                        </strong>

                                        .

                                    </p>

                                    <ul>

                                        <li>
                                            ✔ Lowest localization error
                                            among all evaluated algorithms.
                                        </li>

                                        <li>
                                            ✔ High localization success
                                            rate.
                                        </li>

                                        <li>
                                            ✔ Stable execution time for
                                            practical deployment.
                                        </li>

                                        <li>
                                            ✔ Suitable for Digital Twin
                                            based Wireless Sensor Network
                                            localization.
                                        </li>

                                    </ul>

                                </>

                            ) : (

                                <p>

                                    Recommendation will be generated after
                                    running algorithm comparison.

                                </p>

                            )}

                        </div>

                    </section>

                    {/* ---------- PART 6 STARTS FROM THE NEXT LINE ---------- */}
                                        {/* =====================================================
                        Report Actions
                    ===================================================== */}

                    <div className="report-buttons">

                        <button
                            className="pdf-btn"
                            onClick={handleGeneratePDF}
                        >
                            📄 Generate PDF
                        </button>

                        <button
                            className="csv-btn"
                            onClick={handleExportCSV}
                        >
                            📊 Export CSV
                        </button>

                        <button
                            className="print-btn"
                            onClick={handlePrintReport}
                        >
                            🖨️ Print Report
                        </button>

                    </div>

                    {/* =====================================================
                        Footer
                    ===================================================== */}

                    <footer className="report-footer">

                        <hr />

                        <p>

                            <strong>TwinLoc</strong> —
                            Digital Twin Based Wireless Sensor
                            Network Localization Platform

                        </p>

                        <p>

                            Generated automatically using the
                            TwinLoc Analytics & Reporting Module.

                        </p>

                        <p>

                            © {new Date().getFullYear()} TwinLoc.
                            All Rights Reserved.

                        </p>

                    </footer>

                </div>

            </div>

        </div>

    );

};

export default Reports;