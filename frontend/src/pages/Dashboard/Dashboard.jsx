import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="content">
        <h1>Welcome to TwinLoc</h1>

        <h2>Digital Twin Platform for WSN Localization</h2>

        <p>
          This dashboard will allow you to generate Wireless Sensor Networks,
          execute localization algorithms, compare their performance, visualize
          results and generate reports.
        </p>
      </main>
    </div>
  );
}

export default Dashboard;