import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { uploadImage, generateStl } from "./designer";

vi.mock("axios");
vi.mock("../utils/getSsid", () => ({
  get_ssid: () => "mocked-ssid",
}));
vi.mock("../constants", () => ({
  API_URL: "http://localhost:3000",
}));

describe("uploadImage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads file and returns success response", async () => {
    const mockFile = new File(["dummy content"], "drawing.png", {
      type: "image/png",
    });

    const mockResponse = { data: { success: true, data: { url: "mock.svg" } } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await uploadImage(mockFile, "svg");

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/upload",
      expect.any(FormData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    expect(result).toEqual(mockResponse.data);
  });

  it("throws error when upload fails on server", async () => {
    const mockFile = new File(["dummy content"], "drawing.png", {
      type: "image/png",
    });

    const failResponse = { data: { success: false, message: "Invalid file" } };
    axios.post.mockResolvedValueOnce(failResponse);

    await expect(uploadImage(mockFile, "svg")).rejects.toThrow(
      "Upload failed: Invalid file"
    );
  });

  it("throws error on request error", async () => {
    const mockFile = new File(["x"], "file.png", { type: "image/png" });
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    await expect(uploadImage(mockFile, "svg")).rejects.toThrow("Network error");
  });
});

describe("generateStl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates STL and returns success data", async () => {
    const mockResponse = {
      data: { success: true, data: { stlUrl: "mock.stl" } },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await generateStl("<svg></svg>", 2, "ball123", "image");

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/generate",
      expect.any(FormData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    expect(result).toEqual(mockResponse.data);
  });

  it("uses correct scale for 'text' templateType", async () => {
    const mockResponse = {
      data: { success: true, data: { stlUrl: "mock.stl" } },
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    await generateStl("<svg></svg>", 2, "ball-text", "text");

    const formDataArg = axios.post.mock.calls[0][1];
    expect(formDataArg.get("scale")).toBe("5");
  });

  it("throws on request failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("STL generation error"));

    await expect(
      generateStl("<svg></svg>", 1, "fail123", "image")
    ).rejects.toThrow("STL generation error");
  });
});
