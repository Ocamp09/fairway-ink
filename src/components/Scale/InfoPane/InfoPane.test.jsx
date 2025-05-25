import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InfoPane from "./InfoPane";

describe("InfoPane", () => {
  it("does not render when both warnText and redText are empty", () => {
    const { container } = render(<InfoPane warnText="" redText="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders only warnText section and note if redText is missing", () => {
    render(<InfoPane warnText="Warning!" redText="" />);
    expect(screen.getByTestId("warn-section")).toHaveTextContent("Warning!");
    expect(screen.getByTestId("note-section")).toHaveTextContent(
      /tabs that are too small/
    );
  });

  it("renders only redText section if warnText is missing", () => {
    render(<InfoPane warnText="" redText="Remove this!" />);
    expect(screen.getByTestId("red-section")).toHaveTextContent("Remove this!");
  });

  it("renders both sections but no note if both texts are present", () => {
    render(<InfoPane warnText="Warning!" redText="Remove this!" />);
    expect(screen.getByTestId("warn-section")).toBeInTheDocument();
    expect(screen.getByTestId("red-section")).toBeInTheDocument();
    expect(screen.queryByTestId("note-section")).not.toBeInTheDocument();
  });
});
