import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TypeSelector from "./TypeSelector";
import { useSession } from "../../../contexts/DesignContext";

vi.mock("../../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

describe("TypeSelector", () => {
  const mockUpdateTemplateType = vi.fn();
  const mockUpdateEditorMode = vi.fn();
  const mockUpdateUploadedPaths = vi.fn();

  const pathsMock = [{ d: "M10 10H90V90H10Z" }];

  beforeEach(() => {
    useSession.mockReturnValue({
      templateType: "",
      updateTemplateType: mockUpdateTemplateType,
      updateEditorMode: mockUpdateEditorMode,
      updateUploadedPaths: mockUpdateUploadedPaths,
    });

    vi.clearAllMocks();
  });

  it("renders both visible buttons", () => {
    render(<TypeSelector paths={pathsMock} />);
    expect(screen.getByText("Solid")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("calls correct functions when 'Solid' is clicked", () => {
    render(<TypeSelector paths={pathsMock} />);
    fireEvent.click(screen.getByText("Solid"));

    expect(mockUpdateTemplateType).toHaveBeenCalledWith("solid");
    expect(mockUpdateEditorMode).toHaveBeenCalledWith("draw");
    expect(mockUpdateUploadedPaths).toHaveBeenCalledWith(pathsMock);
  });

  it("calls correct functions when 'Custom' is clicked", () => {
    render(<TypeSelector paths={pathsMock} />);
    fireEvent.click(screen.getByText("Custom"));

    expect(mockUpdateTemplateType).toHaveBeenCalledWith("custom");
    expect(mockUpdateEditorMode).toHaveBeenCalledWith("draw");
    expect(mockUpdateUploadedPaths).toHaveBeenCalledWith(pathsMock);
  });

  it("applies active class when templateType matches", () => {
    useSession.mockReturnValue({
      templateType: "solid",
      updateTemplateType: mockUpdateTemplateType,
      updateEditorMode: mockUpdateEditorMode,
      updateUploadedPaths: mockUpdateUploadedPaths,
    });

    render(<TypeSelector paths={pathsMock} />);
    const solidButton = screen.getByText("Solid");
    expect(solidButton.className).toContain("active");
  });
});
