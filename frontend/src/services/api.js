import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});
export const compareAlgorithms = async (networkData) => {
    const response = await api.post(
        "/localization/compare",
        networkData
    );

    return response.data;
};

export default api;