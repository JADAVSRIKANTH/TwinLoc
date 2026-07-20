import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function runLocalization(data) {
  const response = await axios.post(
    `${API}/localization/run`,
    data
  );

  return response.data;
}