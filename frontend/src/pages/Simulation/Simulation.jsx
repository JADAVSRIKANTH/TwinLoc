import { useState } from "react";

import Sidebar from "../../components/Sidebar/Sidebar";
import NetworkVisualization from "../../components/NetworkVisualization/NetworkVisualization";

import { useNetwork } from "../../context/NetworkContext";

import { runLocalization } from "../../services/localizationService";

import "./Simulation.css";

function Simulation() {

    /* ===========================================================
       Context
    =========================================================== */

    const {
        network,
        simulationResult,
        setSimulationResult,
    } = useNetwork();

    /* ===========================================================
       Simulation Configuration
    =========================================================== */

    const algorithm =
        network?.algorithm || "hybrid_mfo_ga";

    /* ===========================================================
       State Variables
    =========================================================== */

    const [iterations, setIterations] =
        useState(100);

    const [population, setPopulation] =
        useState(30);

    const [loading, setLoading] =
        useState(false);

    /* ===========================================================
       Progress Tracking
    =========================================================== */

    const [progress, setProgress] =
        useState(0);

    const [currentStep, setCurrentStep] =
        useState(0);

    const [currentIteration, setCurrentIteration] =
        useState(0);

    /* ===========================================================
       Simulation Log
    =========================================================== */

    const [simulationLogs, setSimulationLogs] =
        useState([]);

    /* ===========================================================
       Simulation Timeline
    =========================================================== */

    const simulationSteps = [

        "Generate Network",

        "Initialize Population",

        "Run Hybrid MFO-GA",

        "Compute Fitness",

        "Estimate Positions",

        "Generate Analytics",

        "Completed",

    ];

    /* ===========================================================
       Helper Functions
    =========================================================== */

    const getAlgorithmName = (algo) => {

        switch (algo) {

            case "mfo":
                return "MFO";

            case "ga":
                return "Genetic Algorithm";

            case "hybrid_mfo_ga":
                return "Hybrid MFO-GA";

            default:
                return algo;
        }

    };

    const getDeploymentName = (deployment) => {

        switch (deployment) {

            case "random":
                return "Random";

            case "grid":
                return "Grid";

            case "circular":
                return "Circular";

            default:
                return deployment;
        }

    };

    /* ===========================================================
       Simulation Logger
    =========================================================== */

    const addLog = (message) => {

        const time =
            new Date().toLocaleTimeString();

        setSimulationLogs((previousLogs) => [

            ...previousLogs,

            `[${time}] ${message}`,

        ]);

    };

    /* ===========================================================
   Simulation Function
=========================================================== */

const handleRunSimulation = async () => {

    if (!network) {

        alert("Please generate a network first.");

        return;

    }

    try {

        setLoading(true);

        setProgress(0);

        setCurrentIteration(0);

        setCurrentStep(0);

        setSimulationLogs([]);

        addLog("Simulation started.");

        /* -------------------------------
           Step 1
        ------------------------------- */

        setCurrentStep(1);

        setProgress(10);

        addLog("Initializing population.");

        /* -------------------------------
           Backend API
        ------------------------------- */

        const response = await runLocalization({

            network_width: network.network_width,

            network_height: network.network_height,

            sensor_nodes: network.sensor_nodes.length,

            anchor_nodes: network.anchor_nodes.length,

            communication_range:
                network.communication_range,

            deployment: network.deployment,

            algorithm: algorithm,

            seed: network.seed,

            max_iterations: iterations,

            population_size: population,

        });

        /* -------------------------------
           Step 2
        ------------------------------- */

        setCurrentStep(2);

        setProgress(35);

        addLog("Localization algorithm executed.");

        /* -------------------------------
           Step 3
        ------------------------------- */

        setCurrentStep(3);

        setProgress(55);

        addLog("Computing fitness values.");

        /* -------------------------------
           Step 4
        ------------------------------- */

        setCurrentStep(4);

        setProgress(75);

        addLog("Estimating node locations.");

        /* -------------------------------
           Save Result
        ------------------------------- */

        setSimulationResult(response);

        /* -------------------------------
           Step 5
        ------------------------------- */

        setCurrentStep(5);

        setProgress(90);

        addLog("Generating analytics.");

        /* -------------------------------
           Completed
        ------------------------------- */

        setCurrentStep(6);

        setProgress(100);

        setCurrentIteration(iterations);

        addLog("Simulation completed successfully.");

        console.log("Simulation Response :", response);

        console.log("Analytics :", response.analytics);

        console.log(
            "Localization :",
            response.localization_result
        );

    }

    catch (error) {

        console.error(error);

        addLog("Simulation failed.");

        alert("Failed to run simulation.");

    }

    finally {

        setLoading(false);

    }

};

/* ===========================================================
   JSX Starts Here
=========================================================== */

return (

    <div className="simulation-page">

        <Sidebar />

        <main className="simulation-content">
                      {/* ===========================================================
                Page Header
            =========================================================== */}

            <div className="page-header">

                <h1>Simulation</h1>

                <p>
                    Execute Wireless Sensor Network localization
                    algorithms and evaluate their performance using
                    the Digital Twin environment.
                </p>

            </div>

            {/* ===========================================================
                Network Summary
            =========================================================== */}

            {network ? (

                <div className="network-summary">

                    <h2>Selected Network Configuration</h2>

                    <div className="summary-grid">

                        <div className="summary-item">

                            <strong>Network Size</strong>

                            <p>

                                {network.network_width} ×{" "}
                                {network.network_height} m

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Sensor Nodes</strong>

                            <p>

                                {network.sensor_nodes.length}

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Anchor Nodes</strong>

                            <p>

                                {network.anchor_nodes.length}

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Communication Range</strong>

                            <p>

                                {network.communication_range} m

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Deployment</strong>

                            <p>

                                {getDeploymentName(
                                    network.deployment
                                )}

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Localization Algorithm</strong>

                            <p>

                                {getAlgorithmName(
                                    algorithm
                                )}

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Maximum Iterations</strong>

                            <p>

                                {iterations}

                            </p>

                        </div>

                        <div className="summary-item">

                            <strong>Population Size</strong>

                            <p>

                                {population}

                            </p>

                        </div>

                    </div>

                </div>

            ) : (

                <div className="network-summary warning">

                    <h2>No Network Generated</h2>

                    <p>

                        Please generate a Wireless Sensor
                        Network before running the
                        localization simulation.

                    </p>

                </div>

            )}

            {/* ===========================================================
                Simulation Grid
            =========================================================== */}

            <div className="simulation-grid">
                              {/* ===========================================================
                    Left Panel - Simulation Control Panel
                =========================================================== */}

                <div className="simulation-card">

                    <h2>Simulation Control Panel</h2>

                    {/* ================= Algorithm ================= */}

                    <div className="control-section">

                        <label>Localization Algorithm</label>

                        <div className="readonly-field">

                            {getAlgorithmName(algorithm)}

                        </div>

                    </div>

                    {/* ================= Iterations ================= */}

                    <div className="control-section">

                        <label>Maximum Iterations</label>

                        <input
                            type="number"
                            min="10"
                            max="1000"
                            value={iterations}
                            onChange={(e) =>
                                setIterations(Number(e.target.value))
                            }
                        />

                    </div>

                    {/* ================= Population ================= */}

                    <div className="control-section">

                        <label>Population Size</label>

                        <input
                            type="number"
                            min="10"
                            max="500"
                            value={population}
                            onChange={(e) =>
                                setPopulation(Number(e.target.value))
                            }
                        />

                    </div>

                    {/* ================= Progress ================= */}

                    <div className="progress-card">

                        <div className="progress-header">

                            <span>Simulation Progress</span>

                            <span>{progress}%</span>

                        </div>

                        <div className="progress-bar">

                            <div
                                className={`progress-fill ${
                                    loading
                                        ? "progress-running"
                                        : progress === 100
                                        ? "progress-complete"
                                        : ""
                                }`}
                                style={{
                                    width: `${progress}%`,
                                }}
                            ></div>

                        </div>

                    </div>

                    {/* ================= Information ================= */}

                    <div className="simulation-info">

                        <div className="info-row">

                            <span>Status</span>

                            <strong>

                                {loading
                                    ? "Running"
                                    : simulationResult
                                    ? "Completed"
                                    : "Ready"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Current Step</span>

                            <strong>

                                {simulationSteps[currentStep] ||
                                    "Waiting"}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Iterations</span>

                            <strong>

                                {currentIteration} / {iterations}

                            </strong>

                        </div>

                        <div className="info-row">

                            <span>Deployment</span>

                            <strong>

                                {network
                                    ? getDeploymentName(
                                          network.deployment
                                      )
                                    : "--"}

                            </strong>

                        </div>

                    </div>

                    {/* ================= Run Button ================= */}

                    <button
                        className="run-btn"
                        onClick={handleRunSimulation}
                        disabled={!network || loading}
                    >

                        {loading
                            ? "Running Simulation..."
                            : "Run Simulation"}

                    </button>

                </div>

                {/* ===========================================================
                    Right Panel Starts Here
                              {/* ===========================================================
                    Right Panel - Live Statistics
                =========================================================== */}

                <div className="simulation-card">

                    <h2>Live Statistics Dashboard</h2>

                    <div className="live-stats-grid">

                        {/* ================= Status ================= */}

                        <div className="live-card">

                            <h4>Simulation Status</h4>

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
                                    ? "Running"
                                    : simulationResult
                                    ? "Completed"
                                    : "Ready"}

                            </p>

                        </div>

                        {/* ================= RMSE ================= */}

                        <div className="live-card">

                            <h4>RMSE</h4>

                            <h2>

                                {simulationResult
                                    ? Number(
                                          simulationResult.analytics.rmse
                                      ).toFixed(2)
                                    : "--"}

                            </h2>

                        </div>

                        {/* ================= Mean Localization Error ================= */}

                        <div className="live-card">

                            <h4>Mean Localization Error</h4>

                            <h2>

                                {simulationResult
                                    ? Number(
                                          simulationResult.analytics
                                              .mean_localization_error
                                      ).toFixed(2)
                                    : "--"}

                            </h2>

                        </div>

                        {/* ================= Normalized Error ================= */}

                        <div className="live-card">

                            <h4>Normalized Error</h4>

                            <h2>

                                {simulationResult
                                    ? Number(
                                          simulationResult.analytics
                                              .normalized_localization_error
                                      ).toFixed(2)
                                    : "--"}

                            </h2>

                        </div>

                        {/* ================= Success Rate ================= */}

                        <div className="live-card">

                            <h4>Success Rate</h4>

                            <h2>

                                {simulationResult
                                    ? `${Number(
                                          simulationResult.analytics
                                              .localization_success_rate
                                      ).toFixed(2)} %`
                                    : "--"}

                            </h2>

                        </div>

                        {/* ================= Localized Nodes ================= */}

                        <div className="live-card">

                            <h4>Localized Nodes</h4>

                            <h2>

                                {simulationResult
                                    ? simulationResult.analytics
                                          .localized_nodes
                                    : "--"}

                            </h2>

                        </div>

                        {/* ================= Unlocalized Nodes ================= */}

                        <div className="live-card">

                            <h4>Unlocalized Nodes</h4>

                            <h2>

                                {simulationResult
                                    ? simulationResult.analytics
                                          .unlocalized_nodes
                                    : "--"}

                            </h2>

                        </div>

                        {/* ================= Execution Time ================= */}

                        <div className="live-card">

                            <h4>Execution Time</h4>

                            <h2>

                                {simulationResult
                                    ? `${Number(
                                          simulationResult
                                              .localization_result
                                              .execution_time
                                      ).toFixed(2)} s`
                                    : "--"}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* ===========================================================
                Network Visualization Starts Here
                (PART 6)
            =========================================================== */}
                        {/* ===========================================================
                Network Visualization
            =========================================================== */}

            {network && (

                <div className="simulation-card">

                    <h2>Wireless Sensor Network Visualization</h2>

                    <p className="section-description">
                        Visual representation of the generated
                        Wireless Sensor Network showing anchor
                        nodes, sensor nodes, and communication
                        links.
                    </p>

                    <NetworkVisualization
                        network={network}
                    />

                </div>

            )}

            {/* ===========================================================
                Simulation Timeline
            =========================================================== */}

            <div className="simulation-card">

                <h2>Simulation Timeline</h2>

                <p className="section-description">
                    Current progress of the localization process.
                </p>

                <div className="timeline">

                    {simulationSteps.map((step, index) => (

                        <div
                            key={step}
                            className={`timeline-step ${
                                index < currentStep
                                    ? "completed"
                                    : index === currentStep
                                    ? "active"
                                    : ""
                            }`}
                        >

                            <div className="timeline-circle">

                                {index < currentStep
                                    ? "✓"
                                    : index + 1}

                            </div>

                            <div className="timeline-content">

                                <h4>{step}</h4>

                                <p>

                                    {index < currentStep
                                        ? "Completed"
                                        : index === currentStep
                                        ? "In Progress"
                                        : "Waiting"}

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* ===========================================================
                Simulation Log Starts Here
                (PART 7)
            =========================================================== */}
                        {/* ===========================================================
                Simulation Log
            =========================================================== */}

            <div className="simulation-card">

                <h2>Simulation Log</h2>

                <p className="section-description">
                    Real-time events generated during the localization
                    process.
                </p>

                <div className="simulation-log">

                    {simulationLogs.length > 0 ? (

                        simulationLogs.map((log, index) => (

                            <div
                                key={index}
                                className="log-entry"
                            >
                                {log}
                            </div>

                        ))

                    ) : (

                        <div className="log-placeholder">

                            No simulation has been executed yet.

                        </div>

                    )}

                </div>

            </div>

            {/* ===========================================================
                Research Notes
            =========================================================== */}

            <div className="simulation-card">

                <h2>Research Notes</h2>

                <div className="research-notes">

                    <div className="note-item">

                        <strong>Algorithm</strong>

                        <p>

                            {getAlgorithmName(algorithm)}

                        </p>

                    </div>

                    <div className="note-item">

                        <strong>Deployment</strong>

                        <p>

                            {network
                                ? getDeploymentName(
                                      network.deployment
                                  )
                                : "--"}

                        </p>

                    </div>

                    <div className="note-item">

                        <strong>Simulation Status</strong>

                        <p>

                            {loading
                                ? "Running"
                                : simulationResult
                                ? "Completed"
                                : "Waiting"}

                        </p>

                    </div>

                    <div className="note-item">

                        <strong>Generated By</strong>

                        <p>

                            TwinLoc Digital Twin Platform

                        </p>

                    </div>

                </div>

            </div>

            {/* ===========================================================
                Footer
            =========================================================== */}

            <footer className="simulation-footer">

                <p>

                    TwinLoc • Digital Twin Based Wireless Sensor
                    Network Localization Platform

                </p>

            </footer>

        </main>

    </div>

);

}

export default Simulation;