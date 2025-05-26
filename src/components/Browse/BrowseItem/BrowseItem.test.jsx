import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BrowseItem from "./BrowseItem";
import { useCart } from "../../../contexts/CartContext";
import * as checkoutApi from "../../../api/checkout";

vi.mock("../../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("../../../api/checkout", () => ({
  addToCartApi: vi.fn(),
}));

vi.mock("../../3D-View/STLViewer/STLViewer", () => ({
  __esModule: true,
  default: ({ stlUrl }) => <div data-testid="stl-viewer">{stlUrl}</div>,
}));

vi.mock("../SizeSelector/SizeSelector", () => ({
  __esModule: true,
  default: ({ size, setSize }) => (
    <select
      data-testid="size-selector"
      value={size}
      onChange={(e) => setSize(e.target.value)}
    >
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </select>
  ),
}));

describe("BrowseItem", () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    useCart.mockReturnValue({ addToCart: mockAddToCart });
    checkoutApi.addToCartApi.mockClear();
    mockAddToCart.mockClear();
  });

  it("renders STLViewer and size selector", () => {
    render(<BrowseItem url="/models/medium-demo.stl" />);
    expect(screen.getByTestId("stl-viewer")).toBeInTheDocument();
    expect(screen.getByTestId("size-selector")).toBeInTheDocument();
  });

  it("calls addToCart when add button is clicked", async () => {
    render(<BrowseItem url="/models/medium-demo.stl" />);
    fireEvent.click(screen.getByText("Add to Cart"));

    await waitFor(() => {
      expect(checkoutApi.addToCartApi).toHaveBeenCalled();
      expect(mockAddToCart).toHaveBeenCalled();
    });

    expect(screen.getByText("Item added!")).toBeInTheDocument();
  });

  it("updates the model URL when size is changed", () => {
    render(<BrowseItem url="/models/medium-demo.stl" />);
    fireEvent.change(screen.getByTestId("size-selector"), {
      target: { value: "large" },
    });
    expect(screen.getByTestId("stl-viewer").textContent).toContain("large");
  });

  it("disables the add button after adding", async () => {
    render(<BrowseItem url="/models/medium-demo.stl" />);
    const button = screen.getByText("Add to Cart");
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});
