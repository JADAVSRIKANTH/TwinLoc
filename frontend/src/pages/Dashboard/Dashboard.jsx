import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import StatCard from "../../components/Card/StatCard";
import api from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("Checking Backend...");

  useEffect(() => {
    api
      .get("/health")
      .then((response) => {
        if (response.data.status === "healthy") {
          setBackendStatus("🟢 Backend Connected");
        } else {
          setBackendStatus("🔴 Backend Offline");
        }
      })
      .catch(() => {
        setBackendStatus("🔴 Backend Offline");
      });
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="content">
        <h1>TwinLoc Dashboard</h1>

        <p className="subtitle">
          Digital Twin Platform for Wireless Sensor Network Localization
        </p>

        <h3>{backendStatus}</h3>

        <div className="card-container">
          <StatCard title="Total Nodes" value="0" />
          <StatCard title="Anchor Nodes" value="0" />
          <StatCard title="Unknown Nodes" value="0" />
          <StatCard title="Algorithm" value="Hybrid MFO-GA" />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;