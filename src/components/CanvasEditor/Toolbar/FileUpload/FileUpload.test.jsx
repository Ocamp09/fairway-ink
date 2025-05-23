import { render, screen, fireEvent } from "@testing-library/react";
import FileUpload from "./FileUpload";
import { vi } from "vitest";
import { useSession } from "../../../../contexts/DesignContext";

// Mock useSession context
vi.mock("../../../../contexts/DesignContext", () => ({
  useSession: vi.fn(),
}));

describe("FileUpload", () => {
  const mockUpdateImageUrl = vi.fn();

  beforeEach(() => {
    useSession.mockReturnValue({
      updateImageUrl: mockUpdateImageUrl,
    });
    global.URL.createObjectURL = vi.fn(() => "mock-url");
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL.mockRestore?.();
  });

  const createFile = (name, type, size) => {
    const file = new File(["A".repeat(size)], name, { type });
    Object.defineProperty(file, "size", { value: size });
    return file;
  };

  it("triggers file input click on button click", () => {
    render(<FileUpload />);
    const fileInput = screen.getByTestId("file-input");
    const clickSpy = vi.spyOn(fileInput, "click");

    fireEvent.click(screen.getByTestId("upload-button"));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("accepts a valid file and calls updateImageUrl", () => {
    render(<FileUpload />);
    const file = createFile("image.png", "image/png", 1024);

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(mockUpdateImageUrl).toHaveBeenCalled();
    expect(screen.queryByText(/Invalid file type/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/File size is too large/)
    ).not.toBeInTheDocument();
  });

  it("shows error for invalid file type", () => {
    render(<FileUpload />);
    const invalidFile = createFile("file.txt", "text/plain", 1024);

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: { files: [invalidFile] },
    });

    expect(mockUpdateImageUrl).not.toHaveBeenCalled();
    expect(screen.getByText(/Invalid file type/)).toBeInTheDocument();
  });

  it("shows error for file exceeding max size", () => {
    render(<FileUpload />);
    const largeFile = createFile("image.jpg", "image/jpeg", 6 * 1024 * 1024); // 6MB

    const input = screen.getByTestId("file-input");
    fireEvent.change(input, {
      target: { files: [largeFile] },
    });

    expect(mockUpdateImageUrl).not.toHaveBeenCalled();
    expect(screen.getByText(/File size is too large/)).toBeInTheDocument();
  });
});
