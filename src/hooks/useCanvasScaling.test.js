import { renderHook, act } from "@testing-library/react";
import { useCanvasScaling } from "./useCanvasScaling";

describe("useCanvasScaling", () => {
  let canvas;
  let setCanvasScale;

  beforeEach(() => {
    // Mock the canvas element with offsetWidth
    canvas = {
      offsetWidth: 1000,
    };

    setCanvasScale = vi.fn();
  });

  it("calculates initial scale on mount", () => {
    const canvasRef = { current: canvas };

    renderHook(() => useCanvasScaling(canvasRef, setCanvasScale));

    // Expect scale = offsetWidth / initialWidth = 1000 / 500 = 2
    expect(setCanvasScale).toHaveBeenCalledWith(2);
  });

  it("updates scale on window resize", () => {
    const canvasRef = { current: canvas };

    // Render hook
    renderHook(() => useCanvasScaling(canvasRef, setCanvasScale));

    // Reset mock calls after initial call
    setCanvasScale.mockClear();

    // Change offsetWidth and trigger resize event
    canvas.offsetWidth = 750;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Expect scale recalculated based on new offsetWidth
    expect(setCanvasScale).toHaveBeenCalledWith(750 / 500);
  });

  it("removes resize listener on unmount", () => {
    const canvasRef = { current: canvas };
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useCanvasScaling(canvasRef, setCanvasScale)
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
