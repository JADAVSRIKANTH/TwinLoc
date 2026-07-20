import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { generateNetwork } from "../../services/networkService";
import NetworkVisualization from "../../components/NetworkVisualization/NetworkVisualization";
import { useNetwork } from "../../context/NetworkContext";
import "./WSNGenerator.css";

function WSNGenerator() {
  const [formData, setFormData] = useState({
    width: 100,
    height: 100,
    sensorNodes: 100,
    anchorNodes: 20,
    radius: 25,
    deployment: "Random",
    algorithm: "hybrid_mfo_ga",
    seed: 12345,
  });

  const { network, setNetwork } = useNetwork();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async () => {
      try {
        const response = await generateNetwork({
          network_width: Number(formData.width),
          network_height: Number(formData.height),
          sensor_nodes: Number(formData.sensorNodes),
          anchor_nodes: Number(formData.anchorNodes),
          communication_range: Number(formData.radius),
          deployment: formData.deployment,
          algorithm: formData.algorithm,
          seed: Number(formData.seed),
        });

        const networkData = {
          ...response,
          deployment: formData.deployment,
          algorithm: formData.algorithm,
          seed: Number(formData.seed),
        };

        setNetwork(networkData);

        console.log("Network saved:", networkData);

        alert("Network Generated Successfully!");
      } catch (error) {
        console.error("Error generating network:", error);
        alert("Failed to generate network.");
      }
    };

  return (
    <div className="generator-page">
      <Sidebar />

      <main className="generator-content">
        <h1>WSN Generator</h1>

        <p>
          Generate Wireless Sensor Networks for Localization Experiments
        </p>

        <div className="generator-card">
          <h2>Network Parameters</h2>

          <label>Network Width (m)</label>
          <input
            type="number"
            name="width"
            value={formData.width}
            onChange={handleChange}
          />

          <label>Network Height (m)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />

          <label>Number of Sensor Nodes</label>
          <input
            type="number"
            name="sensorNodes"
            value={formData.sensorNodes}
            onChange={handleChange}
          />

          <label>Number of Anchor Nodes</label>
          <input
            type="number"
            name="anchorNodes"
            value={formData.anchorNodes}
            onChange={handleChange}
          />

          <label>Communication Range (m)</label>
          <input
            type="number"
            name="radius"
            value={formData.radius}
            onChange={handleChange}
          />

          <label>Deployment Type</label>
          <select
            name="deployment"
            value={formData.deployment}
            onChange={handleChange}
          >
            <option value="Random">Random</option>
            <option value="Grid">Grid</option>
            <option value="Clustered">Clustered</option>
          </select>

          <label>Localization Algorithm</label>
          <select
            name="algorithm"
            value={formData.algorithm}
            onChange={handleChange}
          >
            <option value="mfo">MFO</option>
            <option value="ga">GA</option>
            <option value="hybrid_mfo_ga">Hybrid MFO-GA</option>
          </select>

          <label>Random Seed</label>
          <input
            type="number"
            name="seed"
            value={formData.seed}
            onChange={handleChange}
          />

          <button onClick={handleGenerate}>
            Generate Network
          </button>
        </div>

        <NetworkVisualization network={network} />
      </main>
    </div>
  );
}

export default WSNGenerator;