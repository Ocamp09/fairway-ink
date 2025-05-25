import { render, screen } from "@testing-library/react";
import RemoveImage from "./RemoveImage";
import { describe, it, expect } from "vitest";

describe("RemoveImage", () => {
  it("renders image icons with correct structure", () => {
    render(<RemoveImage />);
    const container = screen.getByTestId("remove-image");

    expect(container).toBeInTheDocument();

    // SVGs present (icons render as inline SVGs)
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
  });
});
