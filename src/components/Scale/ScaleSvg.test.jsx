import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import ScaleSvg from "./ScaleSvg";
import { useSession } from "../../contexts/DesignContext";
import { generateStl } from "../../api/designer";

vi.mock("../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("../../api/designer", () => ({
  generateStl: vi.fn(),
}));

vi.mock("./SelectPreview/SelectPreview", () => ({
  default: () => <div data-testid="select-preview">SelectPreview</div>,
}));

vi.mock("./TabEditor", () => ({
  default: () => <div data-testid="tab-editor">TabEditor</div>,
}));

vi.mock("./ScaleSlider/ScaleSlider", () => ({
  default: ({ scale, setScale }) => (
    <div data-testid="scale-slider" onClick={() => setScale(scale + 0.1)}>
      ScaleSlider
    </div>
  ),
}));

vi.mock("./SvgPreview/SvgPreview", () => ({
  default: ({ svgUrl }) => (
    <div data-testid="svg-preview">SvgPreview: {svgUrl}</div>
  ),
}));

const baseMockSession = {
  adjustStage: "scale",
  updateStage: vi.fn(),
  updateAdjustStage: vi.fn(),
  svgData: "<svg></svg>",
  prevSvgData: "<svg>prev</svg>",
  updateSvgData: vi.fn(),
  updateStl: vi.fn(),
  stlKey: "initial-key",
  updateStlKey: vi.fn(),
  templateType: "custom",
};

describe("ScaleSvg", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSession.mockReturnValue({ ...baseMockSession });
    global.URL.createObjectURL = vi.fn(() => "mock-url");
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL.mockRestore?.();
  });

  it("renders scale stage with required elements", () => {
    render(<ScaleSvg />);
    expect(
      screen.getByText("Scale the image to the desired size")
    ).toBeInTheDocument();
    expect(screen.getByTestId("svg-preview")).toBeInTheDocument();
    expect(screen.getByTestId("scale-slider")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /3-D Preview/i })
    ).toBeInTheDocument();
  });

  it("renders SelectPreview if adjustStage is 'remove'", () => {
    useSession.mockReturnValue({ ...baseMockSession, adjustStage: "remove" });
    render(<ScaleSvg />);
    expect(screen.getByTestId("select-preview")).toBeInTheDocument();
  });

  it("renders TabEditor if adjustStage is 'tab'", () => {
    useSession.mockReturnValue({ ...baseMockSession, adjustStage: "tab" });
    render(<ScaleSvg />);
    expect(screen.getByTestId("tab-editor")).toBeInTheDocument();
  });

  it("calls updateStage and updateStlKey on submit", async () => {
    generateStl.mockResolvedValueOnce({ stlUrl: "mock-url" });

    render(<ScaleSvg />);
    fireEvent.submit(screen.getByTestId("scale-form"));

    await waitFor(() => {
      expect(generateStl).toHaveBeenCalled();
      expect(baseMockSession.updateStl).toHaveBeenCalledWith("mock-url");
      expect(baseMockSession.updateStlKey).toHaveBeenCalled();
      expect(baseMockSession.updateStage).toHaveBeenCalledWith("preview");
    });
  });

  it("shows error message if no svgData", async () => {
    useSession.mockReturnValue({ ...baseMockSession, svgData: "" });
    render(<ScaleSvg />);
    fireEvent.submit(screen.getByTestId("scale-form"));
    expect(
      await screen.findByText("Please draw an image and convert it")
    ).toBeInTheDocument();
  });

  it("shows error on generateStl failure", async () => {
    generateStl.mockRejectedValue(new Error("Upload failed"));

    render(<ScaleSvg />);
    fireEvent.submit(screen.getByTestId("scale-form"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "An error occurred while uploading the file, try again later"
        )
      ).toBeInTheDocument();
    });
  });

  it("back button goes to 'tab' for custom type", () => {
    render(<ScaleSvg />);
    fireEvent.click(screen.getByText("Back"));
    expect(baseMockSession.updateAdjustStage).toHaveBeenCalledWith("tab");
    expect(baseMockSession.updateSvgData).toHaveBeenCalledWith(
      baseMockSession.prevSvgData
    );
  });

  it("back button goes to 'design' for non-custom types", () => {
    useSession.mockReturnValue({ ...baseMockSession, templateType: "solid" });
    render(<ScaleSvg />);
    fireEvent.click(screen.getByText("Back"));
    expect(baseMockSession.updateStage).toHaveBeenCalledWith("design");
  });
});
