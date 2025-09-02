import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Crypto } from "./Crypto";

vi.mock("../components/detailsCrypto/CryptoDetail", () => ({
  CryptoDetail: () => <div data-testid="crypto-detail">CryptoDetail</div>,
}));

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

describe("Crypto Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Crypto />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("crypto-detail")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='crypto'", () => {
    render(<Crypto />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("crypto");
  });
});
