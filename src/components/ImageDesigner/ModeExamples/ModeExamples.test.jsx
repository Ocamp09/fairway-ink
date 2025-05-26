import { render, screen } from "@testing-library/react";
import ModeExamples from "./ModeExamples";
import { CUSTOM_PRICE, SOLID_PRICE } from "../../../constants";

describe("ModeExamples", () => {
  it("renders solid and custom templates with default sizes", () => {
    render(<ModeExamples small={false} />);

    expect(screen.getByText("Solid template:")).toBeInTheDocument();
    expect(screen.getByText(`$${SOLID_PRICE} ea`)).toBeInTheDocument();
    expect(screen.getByAltText("Solid template").getAttribute("src")).toBe(
      "/designer/solid.svg"
    );

    expect(screen.getByText("Custom template:")).toBeInTheDocument();
    expect(screen.getByText(`$${CUSTOM_PRICE} ea`)).toBeInTheDocument();
    expect(screen.getByAltText("Custom template").getAttribute("src")).toBe(
      "/designer/custom.svg"
    );
  });

  it("applies smaller widths when small is true", () => {
    render(<ModeExamples small={true} />);

    const solid_img = screen.getByAltText("Solid template");
    const custom_img = screen.getByAltText("Custom template");
    expect(solid_img).toHaveStyle({ width: "40px" }); // Solid
    expect(custom_img).toHaveStyle({ width: "75px" }); // Custom
  });

  // Uncomment when Text template is re-enabled
  // it("renders the text template when uncommented", () => {
  //   render(<ModeExamples small={false} />);
  //   expect(screen.getByText("Text template:")).toBeInTheDocument();
  // });
});
