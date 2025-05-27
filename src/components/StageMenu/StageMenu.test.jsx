import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import StageMenu from "./StageMenu";
import { useSession } from "../../contexts/DesignContext";

// Mock the context
vi.mock("../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

describe("StageMenu", () => {
  let mockStage = "design";
  const mockUpdateStage = vi.fn((newStage) => {
    mockStage = newStage;
  });

  beforeEach(() => {
    vi.resetAllMocks();

    // Wrap render with reactive state simulation
    useSession.mockImplementation(() => ({
      get stage() {
        return mockStage;
      },
      updateStage: mockUpdateStage,
    }));
  });

  it("renders all stage titles with corresponding icons", () => {
    render(<StageMenu />);

    expect(screen.getByTestId("stage-design")).toBeInTheDocument();
    expect(screen.getByTestId("stage-adjust")).toBeInTheDocument();
    expect(screen.getByTestId("stage-preview")).toBeInTheDocument();

    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText("Adjust")).toBeInTheDocument();
    expect(screen.getByText("Preview")).toBeInTheDocument();
  });

  it("applies the active class to the selected stage", () => {
    const { rerender } = render(<StageMenu />);
    const designTab = screen.getByTestId("stage-design");
    const adjustTab = screen.getByTestId("stage-adjust");
    const previewTab = screen.getByTestId("stage-preview");

    // Initial state
    expect(designTab.className).not.toBe("");
    expect(adjustTab.className).toContain("stage");
    expect(previewTab.className).toContain("stage");

    // Simulate user clicking "Adjust"
    fireEvent.click(screen.getByText("Adjust"));
    rerender(<StageMenu />);
    expect(screen.getByTestId("stage-design").className).toContain("stage");
    expect(screen.getByTestId("stage-adjust").className).not.toBe("");
    expect(screen.getByTestId("stage-preview").className).toContain("stage");

    // Simulate user clicking "Preview"
    fireEvent.click(screen.getByText("Preview"));
    rerender(<StageMenu />);
    expect(screen.getByTestId("stage-design").className).toContain("stage");
    expect(screen.getByTestId("stage-adjust").className).toContain("stage");
    expect(screen.getByTestId("stage-preview").className).not.toBe("");
  });

  it("calls updateStage with correct value on tab click", () => {
    render(<StageMenu />);

    fireEvent.click(screen.getByText("Adjust"));
    expect(mockUpdateStage).toHaveBeenCalledWith("adjust");

    fireEvent.click(screen.getByText("Preview"));
    expect(mockUpdateStage).toHaveBeenCalledWith("preview");

    fireEvent.click(screen.getByText("Design"));
    expect(mockUpdateStage).toHaveBeenCalledWith("design");
  });
});
