import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Wallet } from "./Wallet";
import api from "../../lib/axios";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ user: { rol: mockRole } }),
}));

vi.mock("../../lib/axios", () => ({
  default: { get: vi.fn() },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

let mockRole: "normal" | "pro";

describe("Wallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra mensaje de upgrade si el usuario es normal", async () => {
    mockRole = "normal";

    render(
      <MemoryRouter>
        <Wallet />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/esta funcionalidad solo esta disponible/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mejorar plan/i })
    ).toBeInTheDocument();
  });

  it("muestra el loader mientras carga", async () => {
    mockRole = "pro";
    (api.get as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}) // nunca resuelve
    );

    render(
      <MemoryRouter>
        <Wallet />
      </MemoryRouter>
    );

    expect(await screen.findByText(/cargando cartera/i)).toBeInTheDocument();
  });

  it("muestra datos si el usuario es pro y la API responde", async () => {
    mockRole = "pro";
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        balance: 1500,
        movements: [
          { id: 1, type: "deposito", amount: 500, date: "2023-09-01" },
        ],
        positions: [
          {
            symbol: "BTC",
            amount: 0.5,
            quantity: 10000,
            average_price: 20000,
            current_price: 21000,
            profit: 1000,
            total_change: 10,
            totalValue: 10500,
          },
        ],
        totalValue: 10500,
        totalProfit: 1000,
        totalChange: 10,
      },
    });

    render(
      <MemoryRouter>
        <Wallet />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/\$1,500/)).toBeInTheDocument()
    );
    expect(screen.getByText(/depósito/i)).toBeInTheDocument();
    expect(screen.getByText(/BTC/)).toBeInTheDocument();
  });

  it("muestra error si la API falla", async () => {
    mockRole = "pro";
    (api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Error")
    );

    render(
      <MemoryRouter>
        <Wallet />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/no se pudo cargar la cartera/i)
      ).toBeInTheDocument()
    );
  });
});
