import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import EmailInput from "./EmailInput";

describe("EmailInput", () => {
  it("renders label and input", () => {
    render(<EmailInput value="" setValue={vi.fn()} setComplete={vi.fn()} />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls setValue and setComplete correctly on valid email input", async () => {
    const mockSetValue = vi.fn();
    const mockSetComplete = vi.fn();

    render(
      <EmailInput
        value=""
        setValue={mockSetValue}
        setComplete={mockSetComplete}
      />
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "test@example.com");

    expect(mockSetValue).toHaveBeenCalled();
    expect(mockSetComplete).toHaveBeenCalled();
  });

  it("calls setComplete with false on invalid email input", async () => {
    const mockSetValue = vi.fn();
    const mockSetComplete = vi.fn();

    render(
      <EmailInput
        value=""
        setValue={mockSetValue}
        setComplete={mockSetComplete}
      />
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "invalid-email");

    expect(mockSetComplete).toHaveBeenLastCalledWith(false);
  });
});
