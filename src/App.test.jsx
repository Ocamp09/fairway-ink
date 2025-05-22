import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

// Mock components
vi.mock("./components/Header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("./components/Popups/CartPopup/CartPopup", () => ({
  default: ({ children }) => <div data-testid="cart-popup">{children}</div>,
}));
vi.mock("./components/Cart/CartInfo/CartInfo", () => ({
  default: ({ setIsCheckout }) => (
    <div data-testid="cart-info" onClick={() => setIsCheckout(true)}>
      CartInfo
    </div>
  ),
}));
vi.mock("./components/Cart/Checkout/Checkout", () => ({
  default: ({ setIsCheckout }) => (
    <div data-testid="checkout" onClick={() => setIsCheckout(false)}>
      Checkout
    </div>
  ),
}));
vi.mock("./components/Popups/WelcomePopup/WelcomePopup", () => ({
  default: ({ setWelcome }) => (
    <div data-testid="welcome-popup" onClick={() => setWelcome(false)}>
      WelcomePopup
    </div>
  ),
}));
vi.mock("./pages/Home/Home", () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));
vi.mock("./pages/Browse/Browse", () => ({
  default: () => <div data-testid="browse-page">Browse Page</div>,
}));
vi.mock("./pages/StencilDesigner/StencilDesigner", () => ({
  default: () => <div data-testid="stencil-page">Stencil Page</div>,
}));

// Reset sessionStorage before each test
beforeEach(() => {
  sessionStorage.clear();
});

describe("App", () => {
  it("renders header and home page by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("shows welcome popup on first visit", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("welcome-popup")).toBeInTheDocument();
  });

  it("does not show welcome popup if sessionStorage already has flag", () => {
    sessionStorage.setItem("showedWelcome", "true");

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("welcome-popup")).not.toBeInTheDocument();
  });

  it("renders stencil designer page on /design", () => {
    render(
      <MemoryRouter initialEntries={["/design"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("stencil-page")).toBeInTheDocument();
  });

  it("renders browse page on /browse", () => {
    render(
      <MemoryRouter initialEntries={["/browse"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("browse-page")).toBeInTheDocument();
  });

  it("toggles between CartInfo and Checkout in CartPopup", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const cartInfo = screen.getByTestId("cart-info");
    fireEvent.click(cartInfo); // triggers setIsCheckout(true)

    const checkout = screen.getByTestId("checkout");
    expect(checkout).toBeInTheDocument();

    fireEvent.click(checkout); // triggers setIsCheckout(false)
    expect(screen.getByTestId("cart-info")).toBeInTheDocument();
  });
});
