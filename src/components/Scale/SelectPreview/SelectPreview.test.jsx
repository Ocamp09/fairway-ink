import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SelectPreview from "./SelectPreview";
import { useSession } from "../../../contexts/DesignContext";

vi.mock("../../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("react-svg", () => ({
  ReactSVG: ({ onClick }) => (
    <svg data-testid="svg" onClick={onClick}>
      <path d="M10 10H90V90H10Z" fill="black" />
    </svg>
  ),
}));

describe("SelectPreview", () => {
  const mockContext = {
    updateStage: vi.fn(),
    adjustStage: "remove",
    updateAdjustStage: vi.fn(),
    svgData:
      '<svg width="100" height="100"><path d="M10 10H90V90H10Z" fill="black"/></svg>',
    updateSvgData: vi.fn(),
    updatePrevSvgData: vi.fn(),
  };

  beforeEach(() => {
    useSession.mockReturnValue(mockContext);
  });

  it("renders header and buttons", () => {
    render(<SelectPreview />);
    expect(
      screen.getByText("Select any curves to remove from design")
    ).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Remove selected items")).toBeInTheDocument();
  });

  it("calls updateStage when Back button is clicked", () => {
    render(<SelectPreview />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockContext.updateStage).toHaveBeenCalledWith("design");
  });

  it("selects and removes paths on submit", () => {
    render(<SelectPreview />);

    const path = screen.getByTestId("svg").querySelector("path");
    fireEvent.click(path);

    fireEvent.click(screen.getByText("Remove selected items"));

    expect(mockContext.updatePrevSvgData).toHaveBeenCalledWith(
      mockContext.svgData
    );
    expect(mockContext.updateSvgData).toHaveBeenCalled();
    expect(mockContext.updateAdjustStage).toHaveBeenCalledWith("tab");
  });
});
