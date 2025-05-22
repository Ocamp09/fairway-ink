import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UndoRedo from "./UndoRedo";

// Mock the context
vi.mock("../../../../contexts/DesignContext", () => ({
  useSession: () => ({ templateType: "default" }),
}));

describe("UndoRedo", () => {
  let props;

  beforeEach(() => {
    props = {
      paths: ["path1", "path2"],
      setPaths: vi.fn(),
      iconSize: 24,
      setReloadPaths: vi.fn(),
      undoStack: [],
      setUndoStack: vi.fn(),
      redoStack: [],
      setRedoStack: vi.fn(),
    };
  });

  it("disables undo if no paths", () => {
    render(<UndoRedo {...props} paths={[]} />);
    const undoButton = document.querySelector('[data-testid="undo-button"]');
    expect(undoButton).toBeDisabled();
  });

  it("disables redo if redo stack is empty", () => {
    render(<UndoRedo {...props} />);
    const redoButton = document.querySelector('[data-testid="redo-button"]');
    expect(redoButton).toBeDisabled();
  });

  it("triggers undo logic", () => {
    render(<UndoRedo {...props} />);
    const undoButton = document.querySelector('[data-testid="undo-button"]');
    fireEvent.click(undoButton);

    expect(props.setPaths).toHaveBeenCalledWith(["path1"]);
    expect(props.setUndoStack).toHaveBeenCalledWith(["path2"]);
    expect(props.setRedoStack).toHaveBeenCalledWith(["path2"]);
    expect(props.setReloadPaths).toHaveBeenCalledWith(true);
  });

  it("triggers redo logic", () => {
    props.redoStack = ["redo1"];
    render(<UndoRedo {...props} />);
    const redoButton = document.querySelector('[data-testid="redo-button"]');
    fireEvent.click(redoButton);

    expect(props.setPaths).toHaveBeenCalledWith(["path1", "path2", "redo1"]);
    expect(props.setUndoStack).toHaveBeenCalledWith(["redo1"]);
    expect(props.setRedoStack).toHaveBeenCalledWith([]);
    expect(props.setReloadPaths).toHaveBeenCalledWith(true);
  });
});
