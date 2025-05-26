import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import {
  addToCartApi,
  getPaymentIntent,
  verifySuccessfulCheckout,
} from "./checkout";

// Mock dependencies
vi.mock("axios");
vi.mock("../utils/getSsid", () => ({
  get_ssid: () => "mocked-ssid",
}));

vi.mock("../constants", () => ({
  API_URL: "http://localhost:3000",
}));

describe("Cart API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addToCartApi", () => {
    it("sends correct POST request to /cart", () => {
      addToCartApi("https://example.com/test.stl", 2, "circle");

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/cart",
        {
          ssid: "mocked-ssid",
          stlUrl: "https://example.com/test.stl",
          quantity: 2,
          templateType: "circle",
        },
        {
          headers: {
            "Content-Type": "application/sjon", // note: this is misspelled in your API file
          },
        }
      );
    });

    it("throws error if axios throws", () => {
      axios.post.mockImplementation(() => {
        throw new Error("Axios failed");
      });

      expect(() =>
        addToCartApi("https://example.com/test.stl", 1, "square")
      ).toThrow("Axios failed");
    });
  });

  describe("getPaymentIntent", () => {
    it("returns data on successful request", async () => {
      const mockCart = [{ item: "foo" }];
      sessionStorage.setItem("cart", JSON.stringify(mockCart));

      const mockResponse = { data: { clientSecret: "secret_123" } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await getPaymentIntent();

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/create-payment-intent",
        { cart: mockCart },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toEqual(mockResponse.data);
    });

    it("throws error on failure", async () => {
      sessionStorage.setItem("cart", JSON.stringify([]));
      axios.post.mockRejectedValueOnce(new Error("Request failed"));

      await expect(getPaymentIntent()).rejects.toThrow("Request failed");
    });
  });

  describe("verifySuccessfulCheckout", () => {
    it("returns response on success", async () => {
      const mockResponse = { status: 200 };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await verifySuccessfulCheckout(
        "pi_123",
        "John Doe",
        "john@example.com",
        { city: "New York" }
      );

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/handle-order",
        {
          intent_id: "pi_123",
          browser_ssid: "mocked-ssid",
          name: "John Doe",
          email: "john@example.com",
          address: { city: "New York" },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("handles error and does not throw", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      axios.post.mockRejectedValueOnce(new Error("fail"));

      const result = await verifySuccessfulCheckout(
        "pi_fail",
        "Jane Doe",
        "jane@example.com",
        { city: "LA" }
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error verifying payment:",
        expect.any(Error)
      );

      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });
  });
});
