import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Legal } from "./Legal";

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

vi.mock("../components/legal/LegalNotice", () => ({
  LegalNotice: () => <div data-testid="legal-notice">LegalNotice</div>,
}));

describe("Legal Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Legal />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("legal-notice")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='legal'", () => {
    render(<Legal />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("legal");
  });
});
