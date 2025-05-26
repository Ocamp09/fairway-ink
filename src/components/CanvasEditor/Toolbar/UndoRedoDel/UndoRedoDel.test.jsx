import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UndoRedoDel from "./UndoRedoDel";

// Mock the context
vi.mock("../../../../contexts/DesignContext", () => ({
  useSession: () => ({ templateType: "default" }),
}));

describe("UndoRedoDel", () => {
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
    render(<UndoRedoDel {...props} paths={[]} />);
    const undoButton = document.querySelector('[data-testid="undo-button"]');
    expect(undoButton).toBeDisabled();
  });

  it("disables redo if redo stack is empty", () => {
    render(<UndoRedoDel {...props} />);
    const redoButton = document.querySelector('[data-testid="redo-button"]');
    expect(redoButton).toBeDisabled();
  });

  it("triggers undo logic", () => {
    render(<UndoRedoDel {...props} />);
    const undoButton = document.querySelector('[data-testid="undo-button"]');
    fireEvent.click(undoButton);

    expect(props.setPaths).toHaveBeenCalledWith(["path1"]);
    expect(props.setUndoStack).toHaveBeenCalledWith(["path2"]);
    expect(props.setRedoStack).toHaveBeenCalledWith(["path2"]);
    expect(props.setReloadPaths).toHaveBeenCalledWith(true);
  });

  it("triggers redo logic", () => {
    props.redoStack = ["redo1"];
    render(<UndoRedoDel {...props} />);
    const redoButton = document.querySelector('[data-testid="redo-button"]');
    fireEvent.click(redoButton);

    expect(props.setPaths).toHaveBeenCalledWith(["path1", "path2", "redo1"]);
    expect(props.setUndoStack).toHaveBeenCalledWith(["redo1"]);
    expect(props.setRedoStack).toHaveBeenCalledWith([]);
    expect(props.setReloadPaths).toHaveBeenCalledWith(true);
  });

  it("triggers clear/delete drawings logic", () => {
    render(<UndoRedoDel {...props} />);
    const deleteButton = document.querySelector(
      '[data-testid="btn-delete-drawings"]'
    );
    fireEvent.click(deleteButton);

    expect(props.setUndoStack).toHaveBeenCalledWith([
      ...props.undoStack,
      ...props.paths,
    ]);
    expect(props.setRedoStack).toHaveBeenCalledWith([]);
    expect(props.setPaths).toHaveBeenCalledWith([]);
    expect(props.setReloadPaths).toHaveBeenCalledWith(true);
  });
});
