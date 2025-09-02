import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Watchlist } from "./Watchlist";

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

vi.mock("../components/watchlist/ListIndex", () => ({
  ListIndex: () => <div data-testid="list-index">ListIndex</div>,
}));

describe("Watchlist Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Watchlist />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("list-index")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='watchlist'", () => {
    render(<Watchlist />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("watchlist");
  });
});
