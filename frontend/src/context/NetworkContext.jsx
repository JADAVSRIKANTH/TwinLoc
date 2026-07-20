import { createContext, useContext, useState } from "react";

const NetworkContext = createContext();

export function NetworkProvider({ children }) {

    const [network, setNetwork] = useState(null);

    const [simulationResult, setSimulationResult] = useState(null);

    const [comparisonResults, setComparisonResults] = useState([]);

    return (
        <NetworkContext.Provider
            value={{
                network,
                setNetwork,

                simulationResult,
                setSimulationResult,

                comparisonResults,
                setComparisonResults,
            }}
        >
            {children}
        </NetworkContext.Provider>
    );
}

export function useNetwork() {
    return useContext(NetworkContext);
}