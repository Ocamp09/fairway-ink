import { vi, describe, it, expect } from "vitest";
import axios from "axios";
import { getDesigns } from "./browse";

// Mock axios
vi.mock("axios");

vi.mock("../constants", () => ({
  API_URL: "http://localhost:3000",
}));

describe("getDesigns", () => {
  it("returns designs when API call is successful", async () => {
    const mockDesigns = [
      { id: 1, name: "Design A" },
      { id: 2, name: "Design B" },
    ];

    axios.get.mockResolvedValueOnce({
      data: { designs: mockDesigns },
    });

    const result = await getDesigns();

    expect(result).toEqual(mockDesigns);
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3000/designs"); // assuming API_URL
  });

  it("returns an empty array when API call fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    const result = await getDesigns();

    expect(result).toEqual([]);
  });
});
