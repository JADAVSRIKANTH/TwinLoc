import api from "./api";

export const generateNetwork = async (networkData) => {
  const response = await api.post("/generate-network", networkData);
  return response.data;
};