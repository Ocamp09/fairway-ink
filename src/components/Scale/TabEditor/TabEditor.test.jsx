import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TabEditor from "./TabEditor";
import { useSession } from "../../../contexts/DesignContext";
import { uploadImage } from "../../../api/designer";
import { vi } from "vitest";

// Mock modules
vi.mock("../../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("../../../api/designer", () => ({
  uploadImage: vi.fn(),
}));

vi.mock("../../CanvasEditor/CanvasEditor", () => ({
  default: () => <div data-testid="canvas-editor">Canvas Editor</div>,
}));

// Mock canvas methods globally
beforeEach(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: () => ({
      fillStyle: "",
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    }),
  });

  Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
    value: () => "data:image/png;base64,fakeData",
  });

  global.fetch = vi.fn(() =>
    Promise.resolve({
      blob: () => new Blob(["fake blob"]),
    })
  );
});

describe("TabEditor", () => {
  const mockUpdateAdjustStage = vi.fn();
  const mockUpdateSvgData = vi.fn();
  const mockUpdatePrevSvgData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useSession.mockReturnValue({
      updateAdjustStage: mockUpdateAdjustStage,
      svgData: "svg-data",
      prevSvgData: "prev-svg-data",
      updatePrevSvgData: mockUpdatePrevSvgData,
      updateSvgData: mockUpdateSvgData,
      templateType: "tab-template",
    });
  });

  it("renders and calls back button logic", () => {
    render(<TabEditor />);
    const backButton = screen.getByText("Back");

    fireEvent.click(backButton);

    expect(mockUpdateAdjustStage).toHaveBeenCalledWith("remove");
    expect(mockUpdateSvgData).toHaveBeenCalledWith("prev-svg-data");
  });

  it("calls submitTabs and uploads image successfully", async () => {
    uploadImage.mockResolvedValue({ svgData: "new-svg" });

    render(<TabEditor />);
    const submitButton = screen.getByText("Add tabs");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(uploadImage).toHaveBeenCalled();
      expect(mockUpdateSvgData).toHaveBeenCalledWith("new-svg");
      expect(mockUpdateAdjustStage).toHaveBeenCalledWith("scale");
    });
  });

  it("shows error if upload fails", async () => {
    uploadImage.mockRejectedValue(new Error("Upload failed"));

    render(<TabEditor />);
    const submitButton = screen.getByText("Add tabs");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Unable to connect to the server, try again later")
      ).toBeInTheDocument();
    });
  });
});
