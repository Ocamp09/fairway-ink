import { render, screen } from "@testing-library/react";
import SvgPreview from "./SvgPreview";

describe("SvgPreview", () => {
  const mockSvgUrl = "http://localhost/mock.svg";

  it("renders correctly with templateType 'text'", () => {
    const scale = 2; // 110 * 2 * 2.5 = 550
    const expectedScaledWidth = `${110 * scale * 2.5}px`;
    const expectedLifeSizeWidth = `${(110 * scale * 2.5 * 210) / 500}px`;

    render(
      <SvgPreview svgUrl={mockSvgUrl} scale={scale} templateType="text" />
    );

    const scaledImg = screen.getByTestId("preview-scaled");
    const lifeSizeImg = screen.getByTestId("preview-life-size");

    expect(scaledImg).toBeInTheDocument();
    expect(lifeSizeImg).toBeInTheDocument();
    expect(scaledImg).toHaveAttribute("src", mockSvgUrl);
    expect(lifeSizeImg).toHaveAttribute("src", mockSvgUrl);
    expect(scaledImg.style.width).toBe(expectedScaledWidth);
    expect(lifeSizeImg.style.width).toBe(expectedLifeSizeWidth);
  });

  it("renders correctly with templateType 'custom'", () => {
    const scale = 1.5; // 110 * 1.5 = 165
    const expectedScaledWidth = `${110 * scale}px`;
    const expectedLifeSizeWidth = `${(110 * scale * 210) / 500}px`;

    render(
      <SvgPreview svgUrl={mockSvgUrl} scale={scale} templateType="custom" />
    );

    const scaledImg = screen.getByTestId("preview-scaled");
    const lifeSizeImg = screen.getByTestId("preview-life-size");

    expect(scaledImg.style.width).toBe(expectedScaledWidth);
    expect(lifeSizeImg.style.width).toBe(expectedLifeSizeWidth);
  });
});
