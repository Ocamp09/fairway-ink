// __tests__/PreviewTab.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSession } from "../../../contexts/DesignContext";
import { useCart } from "../../../contexts/CartContext";
import { addToCartApi } from "../../../api/checkout";

// Mock contexts and components before importing PreviewTab
vi.mock("../../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

vi.mock("../../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

vi.mock("../../../api/checkout", () => ({
  addToCartApi: vi.fn(),
}));

// Mock QuantityDropdown component
vi.mock("../QuantityDropdown", () => ({
  default: ({ setQuantity, quantity }) => (
    <button data-testid="quantity-mock" onClick={() => setQuantity(5)}>
      Qty: {quantity}
    </button>
  ),
}));

// Import PreviewTab after all mocks are set up
import PreviewTab from "./PreviewTab";

describe("PreviewTab", () => {
  const mockAddToCart = vi.fn();
  const mockUpdateStage = vi.fn();
  const mockUpdateAdjustStage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useCart.mockReturnValue({
      addToCart: mockAddToCart,
    });

    useSession.mockReturnValue({
      updateStage: mockUpdateStage,
      updateAdjustStage: mockUpdateAdjustStage,
      stlUrl: "designer/custom-design.stl",
      stlKey: 123,
      templateType: "solid",
    });
  });

  it("renders correctly with initial state", () => {
    render(<PreviewTab />);
    expect(screen.getByTestId("preview-tab")).toBeInTheDocument();
    expect(screen.getByText("3-D Render Preview")).toBeInTheDocument();
    expect(screen.getByTestId("add-to-cart-button")).toBeEnabled();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("calls updateStage and updateAdjustStage when Back button clicked", () => {
    render(<PreviewTab />);
    const backBtn = screen.getByTestId("back-button");
    fireEvent.click(backBtn);
    expect(mockUpdateStage).toHaveBeenCalledWith("adjust");
    expect(mockUpdateAdjustStage).toHaveBeenCalledWith("scale");
  });

  it("shows error when adding default STL URL", () => {
    useSession.mockReturnValue({
      updateStage: mockUpdateStage,
      updateAdjustStage: mockUpdateAdjustStage,
      stlUrl: "designer/default.stl",
      stlKey: 123,
      templateType: "solid",
    });

    render(<PreviewTab />);

    const addBtn = screen.getByTestId("add-to-cart-button");
    fireEvent.click(addBtn);

    expect(addToCartApi).not.toHaveBeenCalled();
    expect(mockAddToCart).not.toHaveBeenCalled();
    expect(screen.getByTestId("error-message")).toHaveTextContent(
      "No custom design uploaded"
    );
  });

  it("adds item to cart and disables Add to Cart button", () => {
    render(<PreviewTab />);

    const addBtn = screen.getByTestId("add-to-cart-button");
    fireEvent.click(addBtn);

    expect(addToCartApi).toHaveBeenCalledWith(
      "designer/custom-design.stl",
      1,
      "solid"
    );
    expect(mockAddToCart).toHaveBeenCalledWith(
      123,
      "designer/custom-design.stl",
      1,
      "solid"
    );

    // Button text and disabled state after adding
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveTextContent("Item added!");
  });

  it("updates quantity state when QuantityDropdown calls setQuantity", () => {
    render(<PreviewTab />);

    const qtyMockBtn = screen.getByTestId("quantity-mock");
    fireEvent.click(qtyMockBtn);

    const addBtn = screen.getByTestId("add-to-cart-button");
    fireEvent.click(addBtn);

    expect(addToCartApi).toHaveBeenCalledWith(
      "designer/custom-design.stl",
      5,
      "solid"
    );
    expect(mockAddToCart).toHaveBeenCalledWith(
      123,
      "designer/custom-design.stl",
      5,
      "solid"
    );
  });
});
