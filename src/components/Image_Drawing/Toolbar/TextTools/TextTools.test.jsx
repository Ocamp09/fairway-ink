import { render, screen } from "@testing-library/react";
import TextTools from "./TextTools";
import { describe, it, expect, vi } from "vitest";

// Mock ToolDropdown to verify props
vi.mock("../ToolDropdown", () => ({
  default: ({ maxQuantity, labelText, step, quantity, setQuantity, title }) => (
    <div data-testid="tool-dropdown">
      <span data-testid="title">{title}</span>
      <span data-testid="quantity">{quantity}</span>
      {labelText}
    </div>
  ),
}));

describe("TextTools", () => {
  it("renders ToolDropdown with correct props", () => {
    const mockSetLineWidth = vi.fn();

    render(
      <TextTools lineWidth={4} setLineWidth={mockSetLineWidth} iconSize={24} />
    );

    expect(screen.getByTestId("tool-dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toHaveTextContent("Adjust font size");
    expect(screen.getByTestId("quantity")).toHaveTextContent("");
    expect(screen.getByTestId("tool-dropdown").innerHTML).toContain("svg"); // ensures icon rendered
  });
});
