import {
  FaHome,
  FaProjectDiagram,
  FaPlayCircle,
  FaChartBar,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">TwinLoc</h2>

      <ul>
        <li><FaHome /> Dashboard</li>
        <li><FaProjectDiagram /> WSN Generator</li>
        <li><FaPlayCircle /> Simulation</li>
        <li><FaChartBar /> Analytics</li>
        <li><FaFileAlt /> Reports</li>
        <li><FaCog /> Settings</li>
      </ul>
    </aside>
  );
}

export default Sidebar;