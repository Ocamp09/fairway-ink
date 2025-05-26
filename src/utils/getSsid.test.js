import { describe, it, expect, vi, beforeEach } from "vitest";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { get_ssid } from "./getSsid";

// Mock dependencies
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

describe("get_ssid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns existing session_id from cookies", () => {
    Cookies.get.mockReturnValue("existing-session-id");

    const ssid = get_ssid();

    expect(ssid).toBe("existing-session-id");
    expect(Cookies.get).toHaveBeenCalledWith("session_id");
    expect(Cookies.set).not.toHaveBeenCalled();
  });

  it("generates and sets a new session_id if none exists", () => {
    Cookies.get.mockReturnValue(undefined);
    uuidv4.mockReturnValue("generated-uuid");

    const ssid = get_ssid();

    expect(uuidv4).toHaveBeenCalled();
    expect(Cookies.set).toHaveBeenCalledWith("session_id", "generated-uuid", {
      expires: 2,
    });
    expect(ssid).toBe("generated-uuid");
  });
});
