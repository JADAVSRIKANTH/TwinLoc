import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function runComparison(data) {
    const response = await axios.post(
        `${API}/localization/compare`,
        data
    );

    return response.data;
}