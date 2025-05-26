import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScaleSlider from "./ScaleSlider";

describe("ScaleSlider", () => {
  it("renders the scale label and current value", () => {
    render(<ScaleSlider scale={1.5} setScale={vi.fn()} />);
    expect(screen.getByLabelText("Scale:")).toBeInTheDocument();
    expect(screen.getByText("1.5x")).toBeInTheDocument();
  });

  it("calls setScale when slider is moved", () => {
    const mockSetScale = vi.fn();
    render(<ScaleSlider scale={1.0} setScale={mockSetScale} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "2.3" } });

    expect(mockSetScale).toHaveBeenCalledWith(2.3);
  });

  it("displays the correct value rounded to 1 decimal", () => {
    render(<ScaleSlider scale={2.345} setScale={vi.fn()} />);
    expect(screen.getByText("2.3x")).toBeInTheDocument();
  });
});
