import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Checkout from "./Checkout";
import { useCart } from "../../../contexts/CartContext";
import * as checkoutApi from "../../../api/checkout";

vi.mock("../../../contexts/CartContext");
vi.mock("../CheckoutForm/CheckoutForm", () => ({
  __esModule: true,
  default: () => <div data-testid="checkout-form">Checkout Form</div>,
}));

describe("Checkout component", () => {
  const mockSetIsCheckout = vi.fn();

  beforeEach(() => {
    useCart.mockReturnValue({
      getTotal: () => 20.0,
    });
  });

  it("renders loading state before clientSecret is fetched", async () => {
    vi.spyOn(checkoutApi, "getPaymentIntent").mockResolvedValueOnce({
      client_secret: "test_secret",
      payment_intent: "test_intent_id",
    });

    render(<Checkout setIsCheckout={mockSetIsCheckout} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("checkout-form")).toBeInTheDocument();
    });
  });

  it("does not call getPaymentIntent if total is 0", async () => {
    useCart.mockReturnValueOnce({
      getTotal: () => 0,
    });

    const spy = vi.spyOn(checkoutApi, "getPaymentIntent");
    render(<Checkout setIsCheckout={mockSetIsCheckout} />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(spy).not.toHaveBeenCalled();
    });
  });

  it("renders back button and total when clientSecret is ready", async () => {
    vi.spyOn(checkoutApi, "getPaymentIntent").mockResolvedValueOnce({
      client_secret: "test_secret",
      payment_intent: "test_intent_id",
    });

    render(<Checkout setIsCheckout={mockSetIsCheckout} />);
    await waitFor(() => {
      expect(screen.getByTestId("checkout-form")).toBeInTheDocument();
      expect(screen.getByTestId("back-button")).toBeInTheDocument();
      expect(screen.getByText("Cart Total: $20.00")).toBeInTheDocument();
    });
  });
});
