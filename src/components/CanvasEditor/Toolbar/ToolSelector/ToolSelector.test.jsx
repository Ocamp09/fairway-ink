import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ToolSelector from "./ToolSelector";

// Mock DesignContext
const updateEditorMode = vi.fn();
vi.mock("../../../../contexts/DesignContext", () => ({
  useSession: () => ({
    editorMode: "draw",
    updateEditorMode,
  }),
}));

describe("ToolSelector", () => {
  const resizeWindow = (width) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event("resize"));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resizeWindow(800); // Ensure default screen width is wide enough
  });

  it("renders draw, text, and select buttons when conditions allow", () => {
    const { getByTestId } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={false}
        isCustomTemplate={false}
      />
    );

    expect(getByTestId("btn-draw")).toBeInTheDocument();
    expect(getByTestId("btn-text")).toBeInTheDocument();
    expect(getByTestId("btn-select")).toBeInTheDocument();
  });

  it("hides tool selector if solid or text template on small screen", () => {
    resizeWindow(700);
    const { queryByTestId } = render(
      <ToolSelector
        isSolidTemplate={true}
        isTextTemplate={false}
        isCustomTemplate={false}
      />
    );
    expect(queryByTestId("tool-top")).toBeNull();

    const { queryByTestId: queryText } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={true}
        isCustomTemplate={false}
      />
    );
    expect(queryText("tool-top")).toBeNull();
  });

  it("calls updateEditorMode with 'draw' on draw button click", () => {
    const { getByTestId } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={false}
        isCustomTemplate={false}
      />
    );

    fireEvent.click(getByTestId("btn-draw"));
    expect(updateEditorMode).toHaveBeenCalledWith("draw");
  });

  it("calls updateEditorMode with 'type' on text button click", () => {
    const { getByTestId } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={false}
        isCustomTemplate={false}
      />
    );

    fireEvent.click(getByTestId("btn-text"));
    expect(updateEditorMode).toHaveBeenCalledWith("type");
  });

  it("calls updateEditorMode with 'select' on select button click", () => {
    const { getByTestId } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={false}
        isCustomTemplate={false}
      />
    );

    fireEvent.click(getByTestId("btn-select"));
    expect(updateEditorMode).toHaveBeenCalledWith("select");
  });

  it("hides text and select buttons when isSolidTemplate is true", () => {
    const { queryByTestId } = render(
      <ToolSelector
        isSolidTemplate={true}
        isTextTemplate={false}
        isCustomTemplate={false}
      />
    );

    expect(queryByTestId("btn-text")).not.toBeVisible();
    expect(queryByTestId("btn-select")).not.toBeVisible();
  });

  it("hides text and select buttons when isCustomTemplate is true", () => {
    const { queryByTestId } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={false}
        isCustomTemplate={true}
      />
    );

    expect(queryByTestId("btn-text")).not.toBeVisible();
    expect(queryByTestId("btn-select")).not.toBeVisible();
  });

  it("hides draw button when isTextTemplate is true", () => {
    const { queryByTestId } = render(
      <ToolSelector
        isSolidTemplate={false}
        isTextTemplate={true}
        isCustomTemplate={false}
      />
    );

    expect(queryByTestId("btn-draw")).not.toBeVisible();
  });
});
