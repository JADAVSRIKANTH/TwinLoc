import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import WSNGenerator from "../pages/WSNGenerator/WSNGenerator";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generator" element={<WSNGenerator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;