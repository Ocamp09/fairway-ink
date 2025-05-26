import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render } from "@testing-library/react";
import { useFontLoader } from "./useFontLoader";
import React from "react";

function TestComponent() {
  useFontLoader();
  return React.createElement("div", null, "Test");
}

describe("useFontLoader", () => {
  let addMock;
  let loadMock;
  let originalFontFace;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock document.fonts.add
    addMock = vi.fn();
    global.document.fonts = { add: addMock };

    // Mock FontFace constructor and load method
    loadMock = vi.fn().mockResolvedValue("mockedFont");
    originalFontFace = global.FontFace;
    global.FontFace = vi.fn().mockImplementation(() => ({
      load: loadMock,
    }));

    // Spy on console.error
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.FontFace = originalFontFace;
  });

  it("loads and adds the font on mount", async () => {
    render(React.createElement(TestComponent));

    expect(global.FontFace).toHaveBeenCalledWith(
      "stencil",
      "url(/designer/gunplay.otf)"
    );

    // Wait for the effect to complete
    await Promise.resolve();

    expect(loadMock).toHaveBeenCalled();
  });

  it("logs an error if font loading fails", async () => {
    const error = new Error("Font failed");
    loadMock.mockRejectedValueOnce(error);
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(React.createElement(TestComponent));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error loading font:", error);
    consoleErrorSpy.mockRestore();
  });
});
