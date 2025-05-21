import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { useCart } from "../../contexts/CartContext";

// Mocks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock("../../contexts/CartContext", () => ({
  useCart: vi.fn(),
}));

describe("Header component", () => {
  const mockNavigate = vi.fn();
  const mockSetCartPopup = vi.fn();
  const mockGetItemCount = vi.fn(() => 3);

  beforeEach(() => {
    vi.resetAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ pathname: "/design" });
    useCart.mockReturnValue({ getItemCount: mockGetItemCount });
  });

  function renderHeader(props = {}) {
    return render(
      <MemoryRouter>
        <Header cartPopup={false} setCartPopup={mockSetCartPopup} {...props} />
      </MemoryRouter>
    );
  }

  it("renders logo, nav buttons, hamburger, and cart icon", () => {
    renderHeader();

    expect(screen.getByAltText("Fairway Ink")).toBeInTheDocument();
    expect(screen.getByTestId("nav-design")).toBeInTheDocument();
    expect(screen.getByTestId("nav-browse")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
    expect(screen.getByTestId("cart-button")).toHaveTextContent("(3)");
  });

  it("navigates when nav buttons are clicked", () => {
    renderHeader();

    fireEvent.click(screen.getByTestId("nav-browse"));
    expect(mockNavigate).toHaveBeenCalledWith("/browse");

    fireEvent.click(screen.getByTestId("nav-design"));
    expect(mockNavigate).toHaveBeenCalledWith("/design");
  });

  it("toggles cartPopup when cart button is clicked", () => {
    renderHeader({ cartPopup: false });

    fireEvent.click(screen.getByTestId("cart-button"));
    expect(mockSetCartPopup).toHaveBeenCalledWith(true);
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    renderHeader();

    // menu should not be visible initially
    expect(
      screen.queryByText("Browse", { selector: "button" })
    ).toBeInTheDocument();
    expect(screen.queryAllByText("Browse")).toHaveLength(1); // desktop only

    fireEvent.click(screen.getByLabelText("Toggle menu"));

    // After toggle, mobile nav should appear
    expect(screen.queryAllByText("Browse")).toHaveLength(2); // desktop + mobile
  });

  it("navigates and closes menu on mobile nav click", () => {
    renderHeader();

    fireEvent.click(screen.getByLabelText("Toggle menu")); // open menu
    const mobileBrowseButton = screen.getAllByText("Browse")[1];
    fireEvent.click(mobileBrowseButton);

    expect(mockNavigate).toHaveBeenCalledWith("/browse");
  });
});
