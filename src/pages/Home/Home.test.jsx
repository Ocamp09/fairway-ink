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
        name: /custom golf ball marking templates/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Elevate your style with a custom design on your golf ball!/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Create your own design, or select pre-generated design from our library!/i
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
