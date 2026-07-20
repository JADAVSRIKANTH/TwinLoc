import { createContext, useContext, useState } from "react";

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        simulationResult,
        setSimulationResult,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}