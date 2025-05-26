import WelcomePopup from "./WelcomePopup";
import { fireEvent, render, screen } from "@testing-library/react";

describe("WelcomePopup", () => {
  it("renders successfully", () => {
    render(
      <WelcomePopup>
        <div>Welcome Popup</div>
      </WelcomePopup>
    );

    expect(screen.queryByTestId("welcome-overlay"));
  });

  it("calls setWelcome(false) when close button is clicked", () => {
    const mockSetWelcome = vi.fn();

    render(
      <WelcomePopup setWelcome={mockSetWelcome}>
        <div>Welcome Popup</div>
      </WelcomePopup>
    );

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockSetWelcome).toHaveBeenCalledWith(false);
  });
});
