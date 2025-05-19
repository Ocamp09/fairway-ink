import axios from "axios";

import { API_URL } from "../constants";
import { get_ssid } from "../utils/getSsid";

export const uploadImage = async (file, method) => {
  const session_id = get_ssid();

  const formData = new FormData();
  formData.append("ssid", session_id);
  formData.append("file", file, "fairway_ink_drawing.png");
  formData.append("method", method);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data; // Return the response data
    } else {
      throw new Error("Upload failed: " + response.data.message);
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const generateStl = async (svgData, scale, stlKey, templateType) => {
  const session_id = get_ssid();

  const formData = new FormData();
  formData.append(
    "svg",
    new Blob([svgData], { type: "image/svg+xml" }),
    stlKey + "golfball" + ".svg"
  );

  if (templateType === "text") {
    formData.append("scale", scale * 2.5);
  } else {
    formData.append("scale", scale);
  }

  formData.append("stlKey", stlKey);
  formData.append("ssid", session_id);

  try {
    const response = await axios.post(`${API_URL}/generate`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
