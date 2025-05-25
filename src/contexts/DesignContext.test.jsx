import { renderHook, act } from "@testing-library/react";
import { FileProvider, useSession } from "./DesignContext";

const wrapper = ({ children }) => <FileProvider>{children}</FileProvider>;

describe("DesignContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("initializes default state from sessionStorage or fallback values", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    expect(result.current.stage).toBe("design");
    expect(result.current.adjustStage).toBe("scale");
    expect(result.current.imageUrl).toBe("");
    expect(result.current.imageType).toBe("");
    expect(result.current.uploadedPaths).toEqual([]);
    expect(result.current.svgData).toBe("");
    expect(result.current.prevSvgData).toBe("");
    expect(result.current.stlUrl).toBe("designer/default.stl");
    expect(result.current.stlKey).toBe(0);
    expect(result.current.templateType).toBe("solid");
    expect(result.current.editorMode).toBe("draw");
  });

  it("updates and persists simple string states", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.updateStage("preview");
      result.current.updateImageUrl("http://example.com");
      result.current.updateImageType("jpeg");
      result.current.updateEditorMode("erase");
      result.current.updateTemplateType("text");
    });

    expect(result.current.stage).toBe("preview");
    expect(result.current.imageUrl).toBe("http://example.com");
    expect(result.current.imageType).toBe("jpeg");
    expect(result.current.editorMode).toBe("erase");
    expect(result.current.templateType).toBe("text");

    expect(sessionStorage.getItem("stage")).toBe("preview");
    expect(sessionStorage.getItem("imageUrl")).toBe("http://example.com");
    expect(sessionStorage.getItem("imageType")).toBe("jpeg");
    expect(sessionStorage.getItem("editorMode")).toBe("erase");
    expect(sessionStorage.getItem("templateType")).toBe("text");
  });

  it("updates and persists uploadedPaths array", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    const paths = ["path/one.svg", "path/two.svg"];
    act(() => {
      result.current.updateUploadedPaths(paths);
    });

    expect(result.current.uploadedPaths).toEqual(paths);
    expect(JSON.parse(sessionStorage.getItem("uploadedPaths"))).toEqual(paths);
  });

  it("updates stlKey and persists to sessionStorage", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.updateStlKey(); // 1
    });

    expect(result.current.stlKey).toBe(1);
    expect(sessionStorage.getItem("stlKey")).toBe("1");
  });

  it("updates and persists SVG-related data", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.updateSvgData("<svg>...</svg>");
      result.current.updatePrevSvgData("<svg>previous</svg>");
    });

    expect(result.current.svgData).toBe("<svg>...</svg>");
    expect(result.current.prevSvgData).toBe("<svg>previous</svg>");
    expect(sessionStorage.getItem("svgData")).toBe("<svg>...</svg>");
    expect(sessionStorage.getItem("prevSvg")).toBe("<svg>previous</svg>");
  });

  it("updates stlUrl correctly", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.updateStl("designer/custom.stl");
    });

    expect(result.current.stlUrl).toBe("designer/custom.stl");
    expect(sessionStorage.getItem("stlUrl")).toBe("designer/custom.stl");
  });
});
