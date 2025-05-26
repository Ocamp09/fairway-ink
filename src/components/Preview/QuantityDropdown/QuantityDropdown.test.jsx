import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantityDropdown from "./QuantityDropdown";
import { RiArrowDropDownLine } from "react-icons/ri";

// Mock RiArrowDropDownLine to simplify tests
vi.mock("react-icons/ri", () => ({
  RiArrowDropDownLine: () => <span>▼</span>,
}));

describe("QuantityDropdown", () => {
  const mockSetQuantity = vi.fn();
  const defaultProps = {
    setQuantity: mockSetQuantity,
    quantity: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<QuantityDropdown {...defaultProps} />);

    expect(screen.getByTestId("quantity-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-toggle")).toHaveTextContent(
      "Quantity: 1 ▼"
    );
    expect(screen.queryByTestId("dropdown-list")).not.toBeInTheDocument();
  });

  it("shows dropdown list when clicked", () => {
    render(<QuantityDropdown {...defaultProps} />);

    fireEvent.click(screen.getByTestId("dropdown-toggle"));

    expect(screen.getByTestId("dropdown-list")).toBeInTheDocument();
    expect(screen.getAllByTestId(/quantity-option-/)).toHaveLength(15);
    expect(screen.getByTestId("custom-quantity-option")).toBeInTheDocument();
  });

  it("calls setQuantity when an option is selected", () => {
    render(<QuantityDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));

    fireEvent.click(screen.getByTestId("quantity-option-5"));

    expect(mockSetQuantity).toHaveBeenCalledWith(5);
    expect(screen.queryByTestId("dropdown-list")).not.toBeInTheDocument();
  });

  it("handles custom quantity input", () => {
    render(<QuantityDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));

    const customInput = screen.getByTestId("custom-quantity-input");
    fireEvent.change(customInput, { target: { value: "20" } });

    expect(mockSetQuantity).toHaveBeenCalledWith(20);
    expect(customInput.value).toBe("20");
  });

  it("ignores invalid custom quantity input", () => {
    render(<QuantityDropdown {...defaultProps} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));

    const customInput = screen.getByTestId("custom-quantity-input");
    fireEvent.change(customInput, { target: { value: "abc" } });

    expect(mockSetQuantity).not.toHaveBeenCalled();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <QuantityDropdown {...defaultProps} />
      </div>
    );

    // Open dropdown
    fireEvent.click(screen.getByTestId("dropdown-toggle"));
    expect(screen.getByTestId("dropdown-list")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside-element"));
    expect(screen.queryByTestId("dropdown-list")).not.toBeInTheDocument();
  });

  it("respects minQuantity, maxQuantity, and step props", () => {
    render(
      <QuantityDropdown
        {...defaultProps}
        minQuantity={5}
        maxQuantity={25}
        step={5}
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-toggle"));
    const options = screen.getAllByTestId(/quantity-option-/);

    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent("5");
    expect(options[4]).toHaveTextContent("25");
  });

  it("doesn't render when hidden prop is true", () => {
    const { container } = render(
      <QuantityDropdown {...defaultProps} hidden={true} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("shows custom label text", () => {
    render(<QuantityDropdown {...defaultProps} labelText="Items: " />);

    expect(screen.getByTestId("dropdown-toggle")).toHaveTextContent(
      "Items: 1 ▼"
    );
  });
});
