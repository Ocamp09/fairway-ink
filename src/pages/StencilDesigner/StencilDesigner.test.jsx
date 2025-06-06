import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { useSession } from "../../contexts/DesignContext";
import StencilDesigner from "./StencilDesigner";

// Mock the useSession context
vi.mock("../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

// Mock child components
vi.mock("../../components/StageMenu/StageMenu", () => ({
  default: () => <div>Stage Menu</div>,
}));
vi.mock("../../components/ImageDesigner/ImageDesigner", () => ({
  default: () => <div>Image Editor</div>,
}));
vi.mock("../../components/Scale/ScaleSvg", () => ({
  default: () => <div>Scale SVG</div>,
}));
vi.mock("../../components/Preview/PreviewTab/PreviewTab", () => ({
  default: () => <div>Preview Tab</div>,
}));

describe("StencilDesigner", () => {
  it("renders StageMenu and ImageDesigner when stage is 'design'", () => {
    useSession.mockReturnValue({ stage: "design" });
    render(<StencilDesigner />);

    expect(screen.getByText("Stage Menu")).toBeInTheDocument();
    expect(screen.getByText("Image Editor")).toBeInTheDocument();
  });

  it("renders ScaleSvg when stage is 'adjust'", () => {
    useSession.mockReturnValue({ stage: "adjust" });
    render(<StencilDesigner />);

    expect(screen.getByText("Scale SVG")).toBeInTheDocument();
  });

  it("renders PreviewTab when stage is 'preview'", () => {
    useSession.mockReturnValue({ stage: "preview" });
    render(<StencilDesigner />);

    expect(screen.getByText("Preview Tab")).toBeInTheDocument();
  });

  it("renders nothing for unknown stage", () => {
    useSession.mockReturnValue({ stage: "unknown" });
    render(<StencilDesigner />);

    // Still renders StageMenu
    expect(screen.getByText("Stage Menu")).toBeInTheDocument();
    expect(screen.queryByText("Image Editor")).not.toBeInTheDocument();
    expect(screen.queryByText("Scale SVG")).not.toBeInTheDocument();
    expect(screen.queryByText("Preview Tab")).not.toBeInTheDocument();
  });
});
