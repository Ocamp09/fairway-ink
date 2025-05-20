import { render, screen, fireEvent } from "@testing-library/react";
import ZoomControls from "./ZoomControls";

describe("ZoomControls", () => {
  it("renders zoom in and zoom out buttons", () => {
    render(<ZoomControls onZoomIn={() => {}} onZoomOut={() => {}} />);
    expect(screen.getByLabelText("Zoom in")).toBeInTheDocument();
    expect(screen.getByLabelText("Zoom out")).toBeInTheDocument();
  });

  it("calls onZoomIn when zoom in button is clicked", () => {
    const handleZoomIn = vi.fn();
    render(<ZoomControls onZoomIn={handleZoomIn} onZoomOut={() => {}} />);
    fireEvent.click(screen.getByLabelText("Zoom in"));
    expect(handleZoomIn).toHaveBeenCalledTimes(1);
  });

  it("calls onZoomOut when zoom out button is clicked", () => {
    const handleZoomOut = vi.fn();
    render(<ZoomControls onZoomIn={() => {}} onZoomOut={handleZoomOut} />);
    fireEvent.click(screen.getByLabelText("Zoom out"));
    expect(handleZoomOut).toHaveBeenCalledTimes(1);
  });
});
