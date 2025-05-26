import { renderHook, act } from "@testing-library/react";
import { useCanvasEvents } from "./useCanvasEvents";
import { useSession } from "../contexts/DesignContext";
import { vi } from "vitest";

// Mock useSession from DesignContext
vi.mock("../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

describe("useCanvasEvents", () => {
  let canvas;

  beforeEach(() => {
    // Mock canvas element with add/removeEventListener
    canvas = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const mockUpdateImageUrl = vi.fn();
    useSession.mockReturnValue({
      updateImageUrl: mockUpdateImageUrl,
    });
  });

  it("adds all event listeners on mount", () => {
    const canvasRef = { current: canvas };
    const start = vi.fn();
    const move = vi.fn();
    const stop = vi.fn();

    renderHook(() => useCanvasEvents(canvasRef, start, move, stop));

    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "dragenter",
      expect.any(Function)
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "dragover",
      expect.any(Function)
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "dragleave",
      expect.any(Function)
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "drop",
      expect.any(Function)
    );

    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function),
      { passive: false }
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function),
      { passive: false }
    );
    expect(canvas.addEventListener).toHaveBeenCalledWith(
      "touchend",
      expect.any(Function),
      { passive: false }
    );
  });

  it("removes all event listeners on unmount", () => {
    const canvasRef = { current: canvas };
    const start = vi.fn();
    const move = vi.fn();
    const stop = vi.fn();

    const { unmount } = renderHook(() =>
      useCanvasEvents(canvasRef, start, move, stop)
    );

    unmount();

    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "dragenter",
      expect.any(Function)
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "dragover",
      expect.any(Function)
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "dragleave",
      expect.any(Function)
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "drop",
      expect.any(Function)
    );

    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function)
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function)
    );
    expect(canvas.removeEventListener).toHaveBeenCalledWith(
      "touchend",
      expect.any(Function)
    );
  });

  it("handles drop event and calls updateImageUrl and sessionStorage", () => {
    const canvasRef = { current: document.createElement("div") };

    // We need real DOM element to add event listeners
    const start = vi.fn();
    const move = vi.fn();
    const stop = vi.fn();

    // Render the hook
    renderHook(() => useCanvasEvents(canvasRef, start, move, stop));

    // Mock File and FileReader
    const file = new File(["dummy content"], "test.png", { type: "image/png" });

    const dataTransfer = {
      files: [file],
    };

    global.FileReader = vi.fn(function () {
      this.onload = null;
      this.result = "data:image/png;base64,dummydata";

      this.readAsDataURL = vi.fn(() => {
        // Simulate async load by calling onload callback immediately
        if (typeof this.onload === "function") {
          this.onload({ target: { result: this.result } });
        }
      });
    });

    // Spy on sessionStorage.setItem
    const setItemSpy = vi.spyOn(window.sessionStorage.__proto__, "setItem");

    // Dispatch drop event on canvasRef.current
    const dropEvent = new Event("drop", { bubbles: true, cancelable: true });
    Object.defineProperty(dropEvent, "dataTransfer", { value: dataTransfer });

    act(() => {
      canvasRef.current.dispatchEvent(dropEvent);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      "imageUrl",
      "data:image/png;base64,dummydata"
    );

    setItemSpy.mockRestore();
  });
});
