import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import Home from "./Home";

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Home component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders welcome text and buttons", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Welcome to Fairway Ink!"
    );

    expect(
      screen.getByRole("img", { name: /golf balls with stencil designs/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /custom golf ball templates/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/elevate your style with a custom designed logo!/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /design your own logo in our designer, or select a logo from our daily updating library!/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /start designing/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /browse designs/i })
    ).toBeInTheDocument();
  });

  it("navigates to /design when Start designing button is clicked", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /start designing/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/design");
  });

  it("navigates to /browse when Browse designs button is clicked", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /browse designs/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/browse");
  });
});
