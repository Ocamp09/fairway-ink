import axios from "axios";

import { API_URL } from "../constants";

export const getDesigns = async () => {
  try {
    const response = await axios.get(`${API_URL}/designs`);
    console.log("Fetched designs:", response.data);
    return response.data.designs;
  } catch (error) {
    console.error("Error fetching designs:", error);
    return [];
  }
};
