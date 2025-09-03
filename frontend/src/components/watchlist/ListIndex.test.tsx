import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ListIndex } from "./ListIndex";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../lib/axios");
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const setup = () => {
  return render(
    <MemoryRouter>
      <ListIndex />
    </MemoryRouter>
  );
};

describe("ListIndex", () => {
  let mockedUseAuth: ReturnType<typeof vi.fn>;
  let mockedApiGet: ReturnType<typeof vi.fn>;
  let mockedApiDelete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Tipar correctamente los mocks
    mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;
    mockedUseAuth.mockReturnValue({ user: { rol: "normal" } });

    mockedApiGet = api.get as unknown as ReturnType<typeof vi.fn>;
    mockedApiGet.mockResolvedValue({ data: { data: [] } });

    mockedApiDelete = api.delete as unknown as ReturnType<typeof vi.fn>;
    mockedApiDelete.mockResolvedValue({});
  });

  it("muestra el loader al iniciar", () => {
    setup();
    expect(
      screen.getByText(/Cargando lista de seguimiento/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje vacío si no hay monedas", async () => {
    setup();
    await waitFor(() => {
      expect(
        screen.getByText(
          /No tienes criptomonedas en tu lista de seguimiento todavía/i
        )
      ).toBeInTheDocument();
    });
  });

  it("muestra monedas en la tabla", async () => {
    mockedApiGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            name: "Bitcoin",
            symbol: "BTC",
            icon_url: "btc.png",
            price: 30000,
            change: 2.5,
            market_cap: 1000000000,
          },
        ],
      },
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("BTC")).toBeInTheDocument();
      expect(screen.getByText("$30,000.00")).toBeInTheDocument();
      expect(screen.getByText("2.50%")).toBeInTheDocument();
      expect(screen.getByText("$1.00B")).toBeInTheDocument();
    });
  });

  it("muestra botón 'Añadir más criptomonedas' si el rol es normal", async () => {
    setup();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Añadir más criptomonedas/i })
      ).toBeInTheDocument();
    });
  });

  it("no muestra botón 'Añadir más criptomonedas' si el rol es admin", async () => {
    mockedUseAuth.mockReturnValue({ user: { rol: "admin" } });

    setup();

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Añadir más criptomonedas/i })
      ).not.toBeInTheDocument();
    });
  });

  it("lanza confirmación al eliminar", async () => {
    mockedApiGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 2,
            name: "Ethereum",
            symbol: "ETH",
            price: 2000,
            change: -1,
            market_cap: 500000000,
          },
        ],
      },
    });

    setup();

    await waitFor(() => {
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole("button", { name: /eliminar/i });
    await userEvent.click(deleteBtn);

    expect(
      screen.getByText(/¿Estás seguro de eliminar Ethereum/i)
    ).toBeInTheDocument();
  });
});
