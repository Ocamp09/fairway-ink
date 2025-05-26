import { screen, render, fireEvent } from "@testing-library/react";
import { describe } from "vitest";
import ImageDesigner from "./ImageDesigner";
import { useSession } from "../../contexts/DesignContext";

vi.mock("../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("./ModeExamples/ModeExamples", () => ({
  default: () => <div data-testid="mode-examples">Mode Examples</div>,
}));

vi.mock("./TypeSelector/TypeSelector", () => ({
  default: () => <div data-testid="type-selector">Type Selector</div>,
}));

vi.mock("../CanvasEditor/CanvasEditor", () => ({
  default: () => <div data-testid="canvas-editor">Canvas Editor</div>,
}));

describe("ImageDesigner", () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      updateImage: "test",
    });
  });

  it("renders the component correctly", () => {
    render(<ImageDesigner />);

    expect(screen.getByTestId("designer"));
    expect(screen.getByTestId("desc"));
    expect(screen.getAllByTestId("mode-examples")).toHaveLength(2);
    expect(screen.getByTestId("type-selector"));
    expect(screen.getByTestId("canvas-editor"));
    expect(screen.getByTestId("btn-submit"));
  });

  it("displays with text info ", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "text",
    });
    render(<ImageDesigner />);

    expect(
      screen.getByText(
        "Click inside the editor and type a message to get started"
      )
    ).toBeInTheDocument();
  });

  it("displays with solid info ", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "solid",
    });
    render(<ImageDesigner />);

    expect(
      screen.getByText(
        "Upload an image (button or drag and drop), or draw with your mouse to get started"
      )
    ).toBeInTheDocument();
  });

  it("displays with custom info ", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "custom",
    });
    render(<ImageDesigner />);

    expect(
      screen.getByText(
        "Upload an image (button or drag and drop), or select an editor mode to get started"
      )
    ).toBeInTheDocument();
  });
});
