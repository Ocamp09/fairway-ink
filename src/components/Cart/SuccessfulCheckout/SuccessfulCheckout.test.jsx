import { render, screen } from "@testing-library/react";
import SuccessfulCheckout from "./SuccessfulCheckout";

describe("SuccessfulCheckout", () => {
  const mockOrder = {
    email: "test@example.com",
    amount: 2000,
    shipping_info: {
      carrier: "UPS",
      tracking_id: "1Z12345",
      expected_delivery: 5,
    },
  };

  it("does not render when orderInfo is null", () => {
    const { container } = render(<SuccessfulCheckout orderInfo={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders all order and shipping details correctly", () => {
    render(<SuccessfulCheckout orderInfo={mockOrder} />);
    expect(screen.getByTestId("successful-checkout")).toBeInTheDocument();
    expect(
      screen.getByText(/Your order has been submitted/)
    ).toBeInTheDocument();
    expect(screen.getByText("Email: test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Amount paid: $20.00")).toBeInTheDocument();
    expect(screen.getByText("Carrier: UPS")).toBeInTheDocument();
    expect(screen.getByText("Tracking Number: 1Z12345")).toBeInTheDocument();
    expect(
      screen.getByText("Estimated Delivery: 8–10 days")
    ).toBeInTheDocument();
  });

  it("handles missing shipping info gracefully", () => {
    const incompleteOrder = {
      email: "no-ship@example.com",
      amount: 1500,
      shipping_info: {},
    };

    render(<SuccessfulCheckout orderInfo={incompleteOrder} />);
    expect(screen.getByText("Carrier: N/A")).toBeInTheDocument();
    expect(screen.getByText("Tracking Number: N/A")).toBeInTheDocument();
    expect(
      screen.getByText("Estimated Delivery: 3–5 days")
    ).toBeInTheDocument();
  });
});
