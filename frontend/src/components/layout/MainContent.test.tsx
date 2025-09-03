import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MainContent } from "./MainContent";
import { vi } from "vitest";

const mockUseTheme = vi.fn(() => ({ theme: "light" }));
vi.mock("../../hooks/useTheme.ts", () => ({
  useTheme: () => mockUseTheme(),
}));

vi.mock("../../pages/pages", () => ({
  Home: () => <div data-testid="home">Home</div>,
  Cartera: () => <div data-testid="cartera">Cartera</div>,
  Watchlist: () => <div data-testid="watchlist">Watchlist</div>,
  Pricing: () => <div data-testid="pricing">Pricing</div>,
  Account: () => <div data-testid="account">Account</div>,
  Contact: () => <div data-testid="contact">Contact</div>,
  Legal: () => <div data-testid="legal">Legal</div>,
  Crypto: () => <div data-testid="crypto">Crypto</div>,
}));

vi.mock("../auth/ProtectedRoute.tsx", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected">{children}</div>
  ),
}));

vi.mock("../wallet/WalletMovementForm.tsx", () => ({
  WalletMovementForm: () => <div data-testid="wallet-movement-form" />,
}));
vi.mock("../wallet/ShowMovementsList.tsx", () => ({
  ShowMovementsList: () => <div data-testid="show-movements-list" />,
}));
vi.mock("../wallet/WalletTransactionForm.tsx", () => ({
  WalletTransactionForm: () => <div data-testid="wallet-transaction-form" />,
}));

describe("MainContent component", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  it("renderiza correctamente y aplica tema light", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MainContent />
      </MemoryRouter>
    );

    const home = screen.getByTestId("home");
    expect(home).toBeInTheDocument();

    const content = screen.getByTestId("main-content");
    expect(content).toHaveStyle("background-color: #fff");
  });

  it("llama scrollTo al cambiar ruta", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <MainContent />
      </MemoryRouter>
    );

    rerender(
      <MemoryRouter initialEntries={["/pricing"]}>
        <MainContent />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("renderiza rutas protegidas correctamente", () => {
    render(
      <MemoryRouter initialEntries={["/cartera"]}>
        <MainContent />
      </MemoryRouter>
    );

    expect(screen.getByTestId("protected")).toBeInTheDocument();
    expect(screen.getByTestId("cartera")).toBeInTheDocument();
  });
});
