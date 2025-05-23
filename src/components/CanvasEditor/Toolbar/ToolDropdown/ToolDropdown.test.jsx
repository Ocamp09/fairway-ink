import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import ToolDropdown from "./ToolDropdown";

describe("ToolDropdown", () => {
  const mockSetQuantity = vi.fn();

  beforeEach(() => {
    mockSetQuantity.mockClear();
  });

  it("renders toggle button with label and quantity", () => {
    render(<ToolDropdown setQuantity={mockSetQuantity} quantity={5} />);
    expect(screen.getByTestId("dropdown-toggle")).toHaveTextContent(
      "Quantity: 5"
    );
  });

  it("opens dropdown on toggle click", () => {
    render(<ToolDropdown setQuantity={mockSetQuantity} quantity={5} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));
    expect(screen.getByTestId("dropdown-list")).toBeInTheDocument();
  });

  it("selects a predefined quantity", () => {
    render(<ToolDropdown setQuantity={mockSetQuantity} quantity={5} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));
    fireEvent.click(screen.getByTestId("option-3"));
    expect(mockSetQuantity).toHaveBeenCalledWith(3);
  });

  it("accepts and sets a custom quantity", () => {
    render(<ToolDropdown setQuantity={mockSetQuantity} quantity={5} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));
    const input = screen.getByTestId("custom-input");
    fireEvent.change(input, { target: { value: "17" } });
    expect(mockSetQuantity).toHaveBeenCalledWith(17);
  });

  it("ignores invalid custom input", () => {
    render(<ToolDropdown setQuantity={mockSetQuantity} quantity={5} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));
    const input = screen.getByTestId("custom-input");
    fireEvent.change(input, { target: { value: "-2" } });
    expect(mockSetQuantity).not.toHaveBeenCalled();
  });

  it("closes dropdown when clicking outside", () => {
    render(<ToolDropdown setQuantity={mockSetQuantity} quantity={5} />);
    fireEvent.click(screen.getByTestId("dropdown-toggle"));

    fireEvent.mouseDown(document.body); // simulate outside click

    expect(screen.queryByTestId("dropdown-list")).not.toBeInTheDocument();
  });
});
