import { render, screen, fireEvent } from "@testing-library/react";
import Toolbar from "./Toolbar";
import { useSession } from "../../../contexts/DesignContext";
import { saveCanvas } from "../../../utils/canvasUtils";

vi.mock("../../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("./ToolSelector/ToolSelector", () => ({
  default: () => <div data-testid="tool-selector">ToolSelector</div>,
}));

vi.mock("./FileUpload/FileUpload", () => ({
  default: () => <div data-testid="file-upload">FileUpload</div>,
}));

vi.mock("./UndoRedoDel/UndoRedoDel", () => ({
  default: () => <div data-testid="undo-redo-del">UndoRedoDel</div>,
}));

vi.mock("./DrawTools/DrawTools", () => ({
  default: () => <div data-testid="draw-tools">DrawTools</div>,
}));

vi.mock("./TextTools/TextTools", () => ({
  default: () => <div data-testid="text-tools">TextTools</div>,
}));

vi.mock("../../../utils/canvasUtils", () => ({
  saveCanvas: vi.fn(),
}));

describe("Toolbar", () => {
  const mockUpdateImageUrl = vi.fn();
  const mockSetReloadPaths = vi.fn();

  beforeEach(() => {
    useSession.mockReturnValue({
      updateImage: "test",
      updateImageUrl: mockUpdateImageUrl,
      templateType: "solid",
      editorMode: "draw",
    });
  });

  it("renders items w/ draw tools", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "solid",
      editorMode: "draw",
    });

    render(<Toolbar />);

    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-main")).toBeInTheDocument();
    expect(screen.getByTestId("btn-remove-image")).toBeInTheDocument();
    expect(screen.getByTestId("btn-download")).toBeInTheDocument();
    expect(screen.getByTestId("tool-selector")).toBeInTheDocument();
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
    expect(screen.getByTestId("undo-redo-del")).toBeInTheDocument();
    expect(screen.getByTestId("draw-tools")).toBeInTheDocument();
  });

  it("renders items w/ text tools", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "text",
      editorMode: "type",
    });

    render(<Toolbar />);

    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-main")).toBeInTheDocument();
    expect(screen.getByTestId("btn-download")).toBeInTheDocument();
    expect(screen.getByTestId("tool-selector")).toBeInTheDocument();
    expect(screen.getByTestId("undo-redo-del")).toBeInTheDocument();
    expect(screen.getByTestId("text-tools")).toBeInTheDocument();
  });

  it("renders items w/ text tools for custom template", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "custom",
      editorMode: "type",
    });

    render(<Toolbar />);

    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-main")).toBeInTheDocument();
    expect(screen.getByTestId("btn-download")).toBeInTheDocument();
    expect(screen.getByTestId("tool-selector")).toBeInTheDocument();
    expect(screen.getByTestId("undo-redo-del")).toBeInTheDocument();
    expect(screen.getByTestId("text-tools")).toBeInTheDocument();
  });

  it("renders items w/ draw tools for custom template", () => {
    useSession.mockReturnValue({
      updateImage: "test",
      templateType: "custom",
      editorMode: "draw",
    });

    render(<Toolbar />);

    expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("toolbar-main")).toBeInTheDocument();
    expect(screen.getByTestId("btn-remove-image")).toBeInTheDocument();
    expect(screen.getByTestId("btn-download")).toBeInTheDocument();
    expect(screen.getByTestId("tool-selector")).toBeInTheDocument();
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
    expect(screen.getByTestId("undo-redo-del")).toBeInTheDocument();
    expect(screen.getByTestId("draw-tools")).toBeInTheDocument();
  });

  it("calls remove image on button click", () => {
    render(<Toolbar setReloadPaths={mockSetReloadPaths} />);

    const removeBut = screen.getByTestId("btn-remove-image");
    fireEvent.click(removeBut);
    expect(mockUpdateImageUrl).toHaveBeenCalledWith("");
    expect(mockSetReloadPaths).toHaveBeenCalledWith(true);
  });

  it("calls download image on button click", () => {
    const mockCanvas = document.createElement("canvas");
    const mockImgCanvas = document.createElement("canvas");

    render(
      <Toolbar
        setReloadPaths={mockSetReloadPaths}
        canvasRef={{ current: mockCanvas }}
        imgCanvasRef={{ current: mockImgCanvas }}
      />
    );

    const downloadBut = screen.getByTestId("btn-download");
    fireEvent.click(downloadBut);

    expect(saveCanvas).toHaveBeenCalled();
    // Or to verify it was called with specific refs:
    expect(saveCanvas).toHaveBeenCalledWith(mockCanvas, mockImgCanvas);
  });
});
