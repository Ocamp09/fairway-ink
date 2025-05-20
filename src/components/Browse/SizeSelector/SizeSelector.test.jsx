import { render, screen, fireEvent } from "@testing-library/react";
import SizeSelector from "./SizeSelector";

describe("SizeSelector", () => {
  it("renders all size buttons", () => {
    render(<SizeSelector size="medium" setSize={() => {}} />);

    expect(screen.getByTestId("size-small")).toBeInTheDocument();
    expect(screen.getByTestId("size-medium")).toBeInTheDocument();
    expect(screen.getByTestId("size-large")).toBeInTheDocument();
  });

  it("highlights the active size", () => {
    render(<SizeSelector size="large" setSize={() => {}} />);

    const largeButton = screen.getByTestId("size-large");
    expect(largeButton.className).not.toBe("");
  });

  it("calls setSize with correct value when a button is clicked", () => {
    const mockSetSize = vi.fn();
    render(<SizeSelector size="small" setSize={mockSetSize} />);

    fireEvent.click(screen.getByTestId("size-medium"));
    expect(mockSetSize).toHaveBeenCalledWith("medium");

    fireEvent.click(screen.getByTestId("size-large"));
    expect(mockSetSize).toHaveBeenCalledWith("large");
  });

  it("sets aria-pressed true on the selected size", () => {
    render(<SizeSelector size="medium" setSize={() => {}} />);

    expect(screen.getByTestId("size-medium")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByTestId("size-small")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });
});
