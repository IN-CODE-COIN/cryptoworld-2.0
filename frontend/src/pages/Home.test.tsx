import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

vi.mock("../components/home/BannerHome", () => ({
  BannerHome: () => <div data-testid="banner-home">BannerHome</div>,
}));

vi.mock("../components/home/Features", () => ({
  Features: () => <div data-testid="features">Features</div>,
}));

vi.mock("../components/home/TopCryptos", () => ({
  TopCryptos: () => <div data-testid="top-cryptos">TopCryptos</div>,
}));

describe("Home Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Home />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("banner-home")).toBeInTheDocument();
    expect(screen.getByTestId("features")).toBeInTheDocument();
    expect(screen.getByTestId("top-cryptos")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='home'", () => {
    render(<Home />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("home");
  });
});
