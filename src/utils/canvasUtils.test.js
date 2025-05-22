import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getSvgPathFromStroke,
  getCoordinates,
  centerCanvasDrawing,
  drawLine,
  calculateBbox,
} from "./canvasUtils";

// getSvgPathFromStroke

describe("getSvgPathFromStroke", () => {
  it("should return empty string for empty stroke", () => {
    expect(getSvgPathFromStroke([])).toBe("");
  });

  it("should return valid path string for stroke", () => {
    const stroke = [
      [10, 10],
      [20, 20],
      [30, 10],
    ];
    const path = getSvgPathFromStroke(stroke);
    expect(path).toMatch(/^M 10 10 Q .+ Z$/);
  });
});

// getCoordinates

describe("getCoordinates", () => {
  let canvasRef;

  beforeEach(() => {
    canvasRef = {
      current: {
        getBoundingClientRect: () => ({ left: 0, top: 0 }),
      },
    };
  });

  it("should extract coordinates from mouse event", () => {
    const e = { clientX: 100, clientY: 200, pressure: 0.5 };
    const coords = getCoordinates(e, canvasRef, 2);
    expect(coords).toEqual({ x: 50, y: 100, pressure: 0.5 });
  });

  it("should extract coordinates from touch event", () => {
    const e = {
      touches: [{ clientX: 100, clientY: 200 }],
      pressure: 1,
    };
    const coords = getCoordinates(e, canvasRef, 2);
    expect(coords).toEqual({ x: 50, y: 100, pressure: 1 });
  });

  it("should return null for invalid event", () => {
    const e = {}; // no clientX or touches
    const coords = getCoordinates(e, canvasRef, 2);
    expect(coords).toBeNull();
  });
});

// centerCanvasDrawing

describe("centerCanvasDrawing", () => {
  let originalCreateElement;

  beforeEach(() => {
    originalCreateElement = document.createElement;
    global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4 * 10 * 10) })),
      fillRect: vi.fn(),
      translate: vi.fn(),
    }));
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it("should return a canvas element", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 10;
    canvas.height = 10;
    const result = centerCanvasDrawing(canvas);
    expect(result).toBeInstanceOf(HTMLCanvasElement);
  });
});

// drawLine

describe("drawLine", () => {
  it("should call canvas draw methods", () => {
    const beginPath = vi.fn();
    const moveTo = vi.fn();
    const lineTo = vi.fn();
    const stroke = vi.fn();

    const canvasRef = {
      current: {
        getContext: () => ({
          beginPath,
          moveTo,
          lineTo,
          stroke,
        }),
      },
    };

    drawLine(canvasRef, 0, 0, 100, 100);
    expect(beginPath).toHaveBeenCalled();
    expect(moveTo).toHaveBeenCalledWith(0, 0);
    expect(lineTo).toHaveBeenCalledWith(100, 100);
    expect(stroke).toHaveBeenCalled();
  });
});

// calculateBbox

describe("calculateBbox", () => {
  it("should calculate bounding box correctly", () => {
    const x = 100;
    const y = 50;
    const metrics = {
      width: 40,
      actualBoundingBoxAscent: 15,
      actualBoundingBoxDescent: 5,
    };

    const bbox = calculateBbox(x, y, metrics);
    expect(bbox).toEqual({
      x1: 80,
      y1: 45,
      x2: 120,
      y2: 30,
    });
  });
});
