import { render, screen, waitFor } from "@testing-library/react";

import Browse from "./Browse";
import * as api from "../../api/browse";

// Mock component
vi.mock("../../components/Browse/BrowseItem/BrowseItem", () => ({
  default: ({ url }) => <div>Mocked Design: {url}</div>,
}));

describe("Browse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state initially", async () => {
    vi.spyOn(api, "getDesigns").mockResolvedValue([]);
    render(<Browse />);
    expect(screen.getByText("Loading designs...")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Loading designs...")).not.toBeInTheDocument()
    );
  });

  it("renders fetched designs", async () => {
    const mockDesigns = ["design1.svg", "design2.svg"];
    vi.spyOn(api, "getDesigns").mockResolvedValue(mockDesigns);

    render(<Browse />);

    await waitFor(() => {
      mockDesigns.forEach((url) =>
        expect(screen.getByText(`Mocked Design: ${url}`)).toBeInTheDocument()
      );
    });
  });

  it("shows empty message if no designs are returned", async () => {
    vi.spyOn(api, "getDesigns").mockResolvedValue([]);

    render(<Browse />);

    await waitFor(() => {
      expect(
        screen.getByText("No designs found. Check back soon!")
      ).toBeInTheDocument();
    });
  });

  it("displays an error if fetching designs fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error

    vi.spyOn(api, "getDesigns").mockRejectedValue(new Error("Fetch error"));

    render(<Browse />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load designs"
      );
    });

    consoleSpy.mockRestore(); // Restore console after test
  });
});
