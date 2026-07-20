import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NetworkProvider } from "../context/NetworkContext";

import Dashboard from "../pages/Dashboard/Dashboard";
import WSNGenerator from "../pages/WSNGenerator/WSNGenerator";
import Simulation from "../pages/Simulation/Simulation";
import Analytics from "../pages/Analytics/Analytics";

function AppRoutes() {
  return (
    <NetworkProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/generator" element={<WSNGenerator />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </BrowserRouter>
    </NetworkProvider>
  );
}

export default AppRoutes;