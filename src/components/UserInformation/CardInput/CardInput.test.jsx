import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Mock the CardElement from Stripe
vi.mock("@stripe/react-stripe-js", () => ({
  CardElement: ({ onChange }) => {
    // Simulate onChange being called when user types
    const handleInput = () => {
      onChange({ complete: true });
    };

    return (
      <input
        data-testid="card-element"
        onChange={handleInput}
        placeholder="Card Element"
      />
    );
  },
}));

import CardInput from "./CardInput";

describe("CardInput", () => {
  it("renders label and CardElement", () => {
    const mockSetComplete = vi.fn();
    render(<CardInput setComplete={mockSetComplete} />);

    expect(screen.getByText("Card Information")).toBeInTheDocument();
    expect(screen.getByTestId("card-element")).toBeInTheDocument();
  });

  it("calls setComplete with true when card input is complete", async () => {
    const mockSetComplete = vi.fn();
    render(<CardInput setComplete={mockSetComplete} />);

    const input = screen.getByTestId("card-element");
    await userEvent.type(input, "4242");

    expect(mockSetComplete).toHaveBeenCalledWith(true);
  });
});
