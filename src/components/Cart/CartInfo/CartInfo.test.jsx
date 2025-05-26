import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CartInfo from "./CartInfo";
import { useCart } from "../../../contexts/CartContext";

vi.mock("../../../contexts/CartContext");

describe("CartInfo", () => {
  const mockSetIsCheckout = vi.fn();

  const mockCartItem = {
    stlUrl: "http://example.com/stencil.stl",
    templateType: "solid",
    quantity: 2,
  };

  beforeEach(() => {
    useCart.mockReturnValue({
      cartItems: [mockCartItem],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getTotal: () => 10.0,
      getPrice: () => 5.0,
    });
  });

  it("renders cart content when items exist", () => {
    render(<CartInfo setIsCheckout={mockSetIsCheckout} />);

    expect(screen.getByTestId("cart-info")).toBeInTheDocument();
    expect(screen.getByText("Your Cart")).toBeInTheDocument();
    expect(screen.getByText("Quantity:")).toBeInTheDocument();
    expect(screen.getByText("Template Type:")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getByTestId("checkout-button")).toBeEnabled();
  });

  it("calls setIsCheckout when checkout is clicked", () => {
    render(<CartInfo setIsCheckout={mockSetIsCheckout} />);
    fireEvent.click(screen.getByTestId("checkout-button"));
    expect(mockSetIsCheckout).toHaveBeenCalledWith(true);
  });

  it("disables checkout button when cart is empty", () => {
    useCart.mockReturnValue({
      cartItems: [],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      getTotal: () => 0,
      getPrice: () => 0,
    });

    render(<CartInfo setIsCheckout={mockSetIsCheckout} />);
    expect(screen.getByTestId("checkout-button")).toBeDisabled();
    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
  });
});
