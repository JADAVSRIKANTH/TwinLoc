import {
  FaHome,
  FaProjectDiagram,
  FaPlayCircle,
  FaChartBar,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">TwinLoc</h2>

      <ul>
  <li>
    <Link to="/">
      <FaHome /> Dashboard
    </Link>
  </li>

  <li>
    <Link to="/generator">
      <FaProjectDiagram /> WSN Generator
    </Link>
  </li>

  <li>
    <Link to="/simulation">
      <FaPlayCircle /> Simulation
    </Link>
  </li>

  <li>
    <Link to="/analytics">
      <FaChartBar /> Analytics
    </Link>
  </li>

  <li>
    <Link to="/reports">
      <FaFileAlt /> Reports
    </Link>
  </li>

  <li>
    <Link to="/settings">
      <FaCog /> Settings
    </Link>
  </li>
</ul>
    </aside>
  );
}

export default Sidebar;