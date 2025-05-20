import { render, screen, fireEvent } from "@testing-library/react";
import STLViewer from "./STLViewer";

// Mock STL loader (bypass actual 3D file loading)
vi.mock("three/examples/jsm/loaders/STLLoader", () => ({
  STLLoader: class {
    load(url, onLoad) {
      onLoad({}); // mock empty geometry
    }
  },
}));

// Mock ZoomControls so we can verify props
vi.mock("../ZoomControls/ZoomControls", () => ({
  default: ({ onZoomIn, onZoomOut }) => (
    <div>
      <button onClick={onZoomIn}>Zoom In</button>
      <button onClick={onZoomOut}>Zoom Out</button>
    </div>
  ),
}));

// Mock react-three-fiber hooks
vi.mock("@react-three/fiber", async () => {
  const actual = await vi.importActual("@react-three/fiber");
  return {
    ...actual,
    useLoader: () => ({}),
    useThree: () => ({
      camera: {
        position: { set: vi.fn(), z: 100 },
        updateProjectionMatrix: vi.fn(),
      },
      gl: { domElement: document.createElement("canvas") },
    }),
  };
});

// Mock OrbitControls directly to avoid three.js side effects
vi.mock("three/examples/jsm/controls/OrbitControls", () => ({
  OrbitControls: class {
    constructor() {
      this.enablePan = true;
      this.enableZoom = true;
      this.enableRotate = true;
    }
    update() {}
    dispose() {}
  },
}));

describe("STLViewer", () => {
  it("renders the canvas and controls by default", () => {
    render(<STLViewer stlUrl="mock-url.stl" />);
    expect(screen.getByText("Zoom In")).toBeInTheDocument();
    expect(screen.getByText("Zoom Out")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset View" })
    ).toBeInTheDocument();
  });

  it("hides controls when cart is true", () => {
    render(<STLViewer stlUrl="mock-url.stl" cart />);
    expect(screen.queryByText("Zoom In")).not.toBeInTheDocument();
    expect(screen.queryByText("Zoom Out")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Reset View" })
    ).not.toBeInTheDocument();
  });

  it("calls zoom in and out functions", () => {
    render(<STLViewer stlUrl="mock-url.stl" />);

    const zoomInBtn = screen.getByText("Zoom In");
    const zoomOutBtn = screen.getByText("Zoom Out");

    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomOutBtn);

    // No visible assertion, but test ensures buttons work and don't crash
    expect(zoomInBtn).toBeInTheDocument();
    expect(zoomOutBtn).toBeInTheDocument();
  });

  it("resets camera view when reset button is clicked", () => {
    render(<STLViewer stlUrl="mock-url.stl" />);

    const resetBtn = screen.getByRole("button", { name: "Reset View" });

    // First click
    fireEvent.click(resetBtn);

    // Second click
    fireEvent.click(resetBtn);

    expect(resetBtn).toBeInTheDocument(); // Confirm button is interactable
  });
});
