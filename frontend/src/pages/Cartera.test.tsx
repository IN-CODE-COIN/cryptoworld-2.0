import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Cartera } from "./Cartera";

vi.mock("../components/wallet/Wallet", () => ({
  Wallet: () => <div data-testid="wallet">Wallet</div>,
}));

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

describe("Cartera Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Cartera />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("wallet")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='cartera'", () => {
    render(<Cartera />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("cartera");
  });
});
