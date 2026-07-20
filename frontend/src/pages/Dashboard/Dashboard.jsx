import { useEffect, useState } from "react";
import {
  FaProjectDiagram,
  FaFlask,
  FaBroadcastTower,
  FaMapMarkerAlt,
  FaBullseye,
  FaChartLine,
  FaPercentage,
} from "react-icons/fa";

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
        <div className="backend-status">
           {backendStatus}
          </div>
        <div className="card-container">
          <StatCard
            title="Algorithms"
            value="3"
            icon={<FaProjectDiagram />}
          />

          <StatCard
            title="Experimental Runs"
            value="30"
            icon={<FaFlask />}
          />

          <StatCard
            title="Sensor Nodes"
            value="50"
            icon={<FaBroadcastTower />}
          />

          <StatCard
            title="Anchor Nodes"
            value="10"
            icon={<FaMapMarkerAlt />}
          />

          <StatCard
            title="Best RMSE"
            value="185.30"
            icon={<FaBullseye />}
          />

          <StatCard
            title="Best MLE"
            value="142.77"
            icon={<FaChartLine />}
          />

          <StatCard
            title="Best NLE"
            value="1.43"
            icon={<FaChartLine />}
          />

          <StatCard
            title="Success Rate"
            value="100%"
            icon={<FaPercentage />}
          />
        </div>
      </main>

    </div>
    
  );
}

export default Dashboard;