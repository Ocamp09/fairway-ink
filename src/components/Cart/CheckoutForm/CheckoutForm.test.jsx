import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach } from "vitest";
import CheckoutForm from "./CheckoutForm";
import {
  useStripe,
  useElements,
  CardElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { verifySuccessfulCheckout } from "../../../api/checkout";

vi.mock("@stripe/react-stripe-js", () => ({
  useStripe: vi.fn(),
  useElements: vi.fn(),
  CardElement: vi.fn(() => <div data-testid="card-element" />),
  AddressElement: vi.fn((props) => {
    // simulate onChange call immediately
    setTimeout(
      () =>
        props.onChange({
          complete: true,
          value: { address: {}, name: "Test User" },
        }),
      0
    );
    return <div data-testid="address-element" />;
  }),
}));

vi.mock("../../../api/checkout", () => ({
  verifySuccessfulCheckout: vi.fn(),
}));

vi.mock("../../UserInformation/EmailInput/EmailInput", () => ({
  default: ({ value, setValue, setComplete }) => {
    setComplete(true);
    return (
      <input
        data-testid="email-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
}));

vi.mock("../../UserInformation/CardInput/CardInput", () => ({
  default: ({ setComplete }) => {
    setComplete(true);
    return <div data-testid="card-input" />;
  },
}));

vi.mock("../SuccessfulCheckout/SuccessfulCheckout", () => ({
  default: ({ orderInfo }) => (
    <div data-testid="success-checkout">{JSON.stringify(orderInfo)}</div>
  ),
}));

const mockStripe = {
  confirmCardPayment: vi.fn(),
};

const mockElements = {
  getElement: vi.fn((elementType) => {
    if (elementType === CardElement) return { dummy: "card" };
    if (elementType === AddressElement) {
      return {
        getValue: async () => ({
          complete: true,
          value: {
            name: "John Doe",
            address: {
              line1: "123 Street",
              line2: "Apt 1",
              city: "Testville",
              state: "TS",
              postal_code: "12345",
              country: "US",
            },
          },
        }),
      };
    }
    return null;
  }),
};

describe("CheckoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStripe.mockReturnValue(mockStripe);
    useElements.mockReturnValue(mockElements);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all form elements", () => {
    render(<CheckoutForm clientSecret="abc" intentId="id123" />);
    expect(screen.getByTestId("address-element")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("card-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /pay now/i })
    ).toBeInTheDocument();
  });

  it("disables button when stripe is missing", () => {
    useStripe.mockReturnValueOnce(null);
    render(<CheckoutForm clientSecret="abc" intentId="id123" />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  //   it("shows error if address is incomplete", async () => {
  //     useElements.mockReturnValueOnce({
  //       ...mockElements,
  //       getElement: () => ({
  //         getValue: async () => ({
  //           complete: false,
  //           value: { address: {}, name: "" },
  //         }),
  //       }),
  //     });

  //     render(<CheckoutForm clientSecret="abc" intentId="id123" />);
  //     fireEvent.click(screen.getByRole("button"));
  //     await waitFor(() => {
  //       expect(
  //         screen.getByText("Please fill in all required address fields.")
  //       ).toBeInTheDocument();
  //     });
  //   });

  //   it("handles successful payment and sets order info", async () => {
  //     mockStripe.confirmCardPayment.mockResolvedValueOnce({}); // no error
  //     verifySuccessfulCheckout.mockResolvedValueOnce({
  //       data: {
  //         success: true,
  //         order: { id: "order123", total: 42 },
  //       },
  //     });

  //     render(<CheckoutForm clientSecret="abc" intentId="id123" />);
  //     fireEvent.click(screen.getByRole("button"));

  //     await waitFor(() => {
  //       expect(verifySuccessfulCheckout).toHaveBeenCalled();
  //       expect(screen.getByTestId("success-checkout")).toBeInTheDocument();
  //     });
  //   });

  //   it("handles failed payment and shows alert", async () => {
  //     window.alert = vi.fn();
  //     mockStripe.confirmCardPayment.mockResolvedValueOnce({}); // no error
  //     verifySuccessfulCheckout.mockResolvedValueOnce({
  //       data: { success: false },
  //     });

  //     render(
  //       <CheckoutForm
  //         clientSecret="abc"
  //         intentId="id123"
  //         successfulOrder={null}
  //         setSuccessfulOrder={() => {}}
  //       />
  //     );

  //     fireEvent.click(screen.getByRole("button"));
  //     await waitFor(() => {
  //       expect(window.alert).toHaveBeenCalledWith(
  //         "checkout failed, you were not charged"
  //       );
  //     });
  //   });

  //   it("displays stripe error message if payment fails", async () => {
  //     mockStripe.confirmCardPayment.mockResolvedValueOnce({
  //       error: { message: "Card declined" },
  //     });
  //     verifySuccessfulCheckout.mockResolvedValueOnce({
  //       data: { success: false },
  //     });

  //     render(<CheckoutForm clientSecret="abc" intentId="id123" />);
  //     fireEvent.click(screen.getByRole("button"));

  //     await waitFor(() => {
  //       expect(screen.getByText("Card declined")).toBeInTheDocument();
  //     });
  //   });
});
