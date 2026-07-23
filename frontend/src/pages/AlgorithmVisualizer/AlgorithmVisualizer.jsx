import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNetwork } from "../../context/NetworkContext";
import "./AlgorithmVisualizer.css";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

function AlgorithmVisualizer() {

    const { network } = useNetwork();

    /* ==========================================
       Control States
    ========================================== */

    const [algorithm, setAlgorithm] =
        useState("hybrid_mfo_ga");

    const [speed, setSpeed] =
        useState("Normal");

    const [running, setRunning] =
        useState(false);

    const [iteration, setIteration] =
        useState(0);

    const maxIterations = 100;

    /* ==========================================
       Digital Twin States
    ========================================== */

    const [animatedSensors, setAnimatedSensors] =
        useState([]);

    /* ==========================================
       Live Metrics
    ========================================== */

    const [fitness, setFitness] =
        useState(1.000);

    const [rmse, setRmse] =
        useState(30);

    const [localizationRate, setLocalizationRate] =
        useState(70);

    const [executionTime, setExecutionTime] =
        useState(0);

    const [graphData, setGraphData] =
        useState([]);

    /* ==========================================
       Initialize Digital Twin
    ========================================== */

    useEffect(() => {

        if (!network) return;

        setAnimatedSensors(
            network.sensor_nodes.map(node => ({
                ...node
            }))
        );

    }, [network]);

    /* ==========================================
       Animation Loop
    ========================================== */

    useEffect(() => {

        if (!running) return;

        const timer = setInterval(() => {

            setIteration(prev => {

                if (prev >= maxIterations) {

                    setRunning(false);

                    return maxIterations;

                }

                return prev + 1;

            });

        }, 150);

        return () => clearInterval(timer);

    }, [running,maxIterations]);
        /* ==========================================
       Animate Digital Twin
    ========================================== */

    useEffect(() => {

        if (!running) return;

        if (!network) return;

        if (animatedSensors.length === 0) return;

        setAnimatedSensors(previous =>

            previous.map(node => {

                let dx = 0;
                let dy = 0;

                switch (algorithm) {

                    case "mfo":

                        dx = Math.sin(iteration * 0.15) * 0.20;
                        dy = Math.cos(iteration * 0.15) * 0.20;
                        break;

                    case "ga":

                        dx = (Math.random() - 0.5) * 0.50;
                        dy = (Math.random() - 0.5) * 0.50;
                        break;

                    case "hybrid_mfo_ga":

                        dx =
                            Math.sin(iteration * 0.10) * 0.15 +
                            (Math.random() - 0.5) * 0.20;

                        dy =
                            Math.cos(iteration * 0.10) * 0.15 +
                            (Math.random() - 0.5) * 0.20;
                        break;

                    case "tlbo":

                        dx = (50 - node.x) * 0.01;
                        dy = (50 - node.y) * 0.01;
                        break;

                    case "bh":

                        dx = (50 - node.x) * 0.02;
                        dy = (50 - node.y) * 0.02;
                        break;

                    default:

                        break;

                }

                return {

                    ...node,

                    x: Math.max(
                        0,
                        Math.min(
                            network.network_width,
                            node.x + dx
                        )
                    ),

                    y: Math.max(
                        0,
                        Math.min(
                            network.network_height,
                            node.y + dy
                        )
                    )

                };

            })

        );

    }, [iteration, running, algorithm, network, animatedSensors.length]);
        /* ==========================================
       Live Metrics
    ========================================== */

    useEffect(() => {

        if (!running) return;

        setFitness(prev =>
            Math.max(0.05, prev - 0.005)
        );

        setRmse(prev =>
            Math.max(2, prev - 0.15)
        );

        setLocalizationRate(prev =>
            Math.min(100, prev + 0.30)
        );

        setExecutionTime(
            Number((iteration * 0.02).toFixed(2))
        );

    }, [iteration, running]);



    /* ==========================================
       Convergence Graph
    ========================================== */

    useEffect(() => {

        if (!running) return;

        setGraphData(previous => [

            ...previous,

            {

                iteration,

                fitness: Number(
                    fitness.toFixed(3)
                )

            }

        ]);

    }, [fitness, iteration, running]);



    /* ==========================================
       Animation Speed
    ========================================== */

    const getAnimationSpeed = () => {

        switch (speed) {

            case "Slow":
                return 300;

            case "Fast":
                return 70;

            default:
                return 150;

        }

    };



    /* ==========================================
       Play Simulation
    ========================================== */

    const handlePlay = () => {

        setRunning(true);

    };



    /* ==========================================
       Pause Simulation
    ========================================== */

    const handlePause = () => {

        setRunning(false);

    };



    /* ==========================================
       Reset Simulation
    ========================================== */

    const handleReset = () => {

        setRunning(false);

        setIteration(0);

        setFitness(1.000);

        setRmse(30);

        setLocalizationRate(70);

        setExecutionTime(0);

        setGraphData([]);

        if (network) {

            setAnimatedSensors(

                network.sensor_nodes.map(node => ({

                    ...node

                }))

            );

        }

    };
        /* ==========================================
       JSX
    ========================================== */

    return (

        <div className="dashboard-container">

            <Sidebar />

            <main className="dashboard-content">

                {/* ======================================
                    Page Header
                ======================================= */}

                <div className="page-header">

                    <h1>Algorithm Visualizer</h1>

                    <p>
                        Observe how different localization
                        algorithms estimate unknown sensor
                        positions using a Digital Twin.
                    </p>

                </div>


                {/* ======================================
                    Control Panel
                ======================================= */}

                <div className="visualizer-card">

                    <div className="control-panel">

                        {/* Algorithm */}

                        <div className="control-group">

                            <label>

                                Algorithm

                            </label>

                            <select
                                value={algorithm}
                                onChange={(e) =>
                                    setAlgorithm(e.target.value)
                                }
                            >

                                <option value="mfo">
                                    MFO
                                </option>

                                <option value="ga">
                                    GA
                                </option>

                                <option value="hybrid_mfo_ga">
                                    Hybrid MFO-GA
                                </option>

                                <option value="tlbo">
                                    TLBO
                                </option>

                                <option value="bh">
                                    Black Hole
                                </option>

                            </select>

                        </div>



                        {/* Speed */}

                        <div className="control-group">

                            <label>

                                Animation Speed

                            </label>

                            <select
                                value={speed}
                                onChange={(e) =>
                                    setSpeed(e.target.value)
                                }
                            >

                                <option>

                                    Slow

                                </option>

                                <option>

                                    Normal

                                </option>

                                <option>

                                    Fast

                                </option>

                            </select>

                        </div>



                        {/* Buttons */}

                        <div className="button-group">

                            <button
                                onClick={handlePlay}
                            >

                                ▶ Play

                            </button>

                            <button
                                onClick={handlePause}
                            >

                                ⏸ Pause

                            </button>

                            <button
                                onClick={handleReset}
                            >

                                ↺ Reset

                            </button>

                        </div>



                        {/* Iteration */}

                        <div className="iteration-box">

                            <strong>

                                Iteration

                            </strong>

                            <span>

                                {iteration} / {maxIterations}

                            </span>

                        </div>

                    </div>

                </div>
                                {/* ======================================
                    Physical Network
                ======================================= */}

                <div className="visualizer-container">

                    {/* Physical Network */}

                    <div className="visualizer-card">

                        <h2>Physical Network</h2>

                        <svg
                            width="100%"
                            height="420"
                            viewBox={`0 0 ${network?.network_width || 100} ${network?.network_height || 100}`}
                        >

                            {/* Communication Range */}

                            {network?.anchor_nodes?.map((anchor) => (

                                <circle
                                    key={`range-${anchor.id}`}
                                    cx={anchor.x}
                                    cy={anchor.y}
                                    r={network.communication_range}
                                    fill="rgba(59,130,246,0.08)"
                                    stroke="none"
                                />

                            ))}

                            {/* Anchors */}

                            {network?.anchor_nodes?.map((anchor) => (

                                <circle
                                    key={`anchor-${anchor.id}`}
                                    cx={anchor.x}
                                    cy={anchor.y}
                                    r="2"
                                    fill="#2563eb"
                                />

                            ))}

                            {/* Unknown Sensors */}

                            {network?.sensor_nodes?.map((sensor) => (

                                <circle
                                    key={`sensor-${sensor.id}`}
                                    cx={sensor.x}
                                    cy={sensor.y}
                                    r="1.8"
                                    fill="#9ca3af"
                                />

                            ))}

                        </svg>

                    </div>



                    {/* Digital Twin */}

                    <div className="visualizer-card">

                        <h2>Digital Twin</h2>

                        <svg
                            width="100%"
                            height="420"
                            viewBox={`0 0 ${network?.network_width || 100} ${network?.network_height || 100}`}
                        >

                            {/* Anchors */}

                            {network?.anchor_nodes?.map(anchor => (

                                <circle
                                    key={`dt-anchor-${anchor.id}`}
                                    cx={anchor.x}
                                    cy={anchor.y}
                                    r="2"
                                    fill="#2563eb"
                                />

                            ))}

                            {/* Estimated Sensors */}

                            {animatedSensors.map(sensor => (

                                <circle
                                    key={`dt-${sensor.id}`}
                                    cx={sensor.x}
                                    cy={sensor.y}
                                    r="2"
                                    fill="#22c55e"
                                />

                            ))}

                        </svg>

                    </div>

                </div>



                {/* ======================================
                    Live Metrics
                ======================================= */}

                <div className="metrics-grid">

                    <div className="metric-card">

                        <h3>Fitness</h3>

                        <h2>{fitness.toFixed(3)}</h2>

                    </div>

                    <div className="metric-card">

                        <h3>RMSE</h3>

                        <h2>{rmse.toFixed(2)}</h2>

                    </div>

                    <div className="metric-card">

                        <h3>Localization Rate</h3>

                        <h2>{localizationRate.toFixed(1)}%</h2>

                    </div>

                    <div className="metric-card">

                        <h3>Execution Time</h3>

                        <h2>{executionTime.toFixed(2)} s</h2>

                    </div>

                </div>



                {/* ======================================
                    Convergence Graph
                ======================================= */}

                <div className="visualizer-card">

                    <h2>Convergence Graph</h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <LineChart data={graphData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="iteration" />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="fitness"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </main>

        </div>

    );

}

export default AlgorithmVisualizer;
