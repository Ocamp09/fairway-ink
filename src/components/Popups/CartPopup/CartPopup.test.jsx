import { render, screen, fireEvent } from "@testing-library/react";
import CartPopup from "./CartPopup";

describe("CartPopup", () => {
  it("does not render when isOpen is false", () => {
    render(
      <CartPopup isOpen={false} setIsOpen={() => {}}>
        <div>Cart Content</div>
      </CartPopup>
    );

    expect(screen.queryByTestId("view-cart-overlay")).not.toBeInTheDocument();
  });

  it("renders children when isOpen is true", () => {
    render(
      <CartPopup isOpen={true} setIsOpen={() => {}}>
        <div data-testid="cart-content">Cart Content</div>
      </CartPopup>
    );

    expect(screen.getByTestId("view-cart-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("cart-content")).toHaveTextContent(
      "Cart Content"
    );
  });

  it("calls setIsOpen(false) when close button is clicked", () => {
    const mockSetIsOpen = vi.fn();

    render(
      <CartPopup isOpen={true} setIsOpen={mockSetIsOpen}>
        <div>Cart Content</div>
      </CartPopup>
    );

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });
});
