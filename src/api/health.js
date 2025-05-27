import axios from "axios";
import { API_URL } from "../constants";

export const apiHealthCheck = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    if (response.data.success) {
      return false;
    }
    return true;
  } catch {
    return true;
  }
};
