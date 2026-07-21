import { createContext, useContext, useEffect, useState } from "react";

const NetworkContext = createContext();

export function NetworkProvider({ children }) {

    // ---------------- Network ----------------

    const [network, setNetwork] = useState(() => {
        const saved = localStorage.getItem("network");
        return saved ? JSON.parse(saved) : null;
    });

    // ---------------- Simulation ----------------

    const [simulationResult, setSimulationResult] = useState(() => {
        const saved = localStorage.getItem("simulationResult");
        return saved ? JSON.parse(saved) : null;
    });

    // ---------------- Analytics ----------------

    const [comparisonResults, setComparisonResults] = useState(() => {
        const saved = localStorage.getItem("comparisonResults");
        return saved ? JSON.parse(saved) : [];
    });

    // ---------------- Save Network ----------------

    useEffect(() => {

        if (network) {
            localStorage.setItem(
                "network",
                JSON.stringify(network)
            );
        }

    }, [network]);

    // ---------------- Save Simulation ----------------

    useEffect(() => {

        if (simulationResult) {
            localStorage.setItem(
                "simulationResult",
                JSON.stringify(simulationResult)
            );
        }

    }, [simulationResult]);

    // ---------------- Save Comparison ----------------

    useEffect(() => {

        localStorage.setItem(
            "comparisonResults",
            JSON.stringify(comparisonResults)
        );

    }, [comparisonResults]);

    // ---------------- Clear All ----------------

    const clearProjectData = () => {

        setNetwork(null);

        setSimulationResult(null);

        setComparisonResults([]);

        localStorage.removeItem("network");

        localStorage.removeItem("simulationResult");

        localStorage.removeItem("comparisonResults");
    };

    return (

        <NetworkContext.Provider
            value={{

                network,
                setNetwork,

                simulationResult,
                setSimulationResult,

                comparisonResults,
                setComparisonResults,

                clearProjectData,

            }}
        >

            {children}

        </NetworkContext.Provider>

    );
}

export function useNetwork() {
    return useContext(NetworkContext);
}