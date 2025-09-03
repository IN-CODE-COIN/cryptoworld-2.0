import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TopCryptos } from "./TopCryptos";
import { BrowserRouter } from "react-router-dom";
import api from "../../lib/axios";
import { vi } from "vitest";
import type { Mocked } from "vitest";
import { message } from "antd";

// Mock de axios
vi.mock("../../lib/axios");
const mockedApi = api as Mocked<typeof api>;

// Mock de antd.message
vi.mock("antd", async () => {
  const actual: typeof import("antd") = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      ...actual.message,
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
    },
  };
});

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Datos de prueba
const mockData = {
  topCryptos: [
    {
      uuid: "1",
      name: "Bitcoin",
      symbol: "BTC",
      price: "50000",
      iconUrl: "/btc.png",
      change: 5,
      marketCap: "900000000",
    },
    {
      uuid: "2",
      name: "Ethereum",
      symbol: "ETH",
      price: "3000",
      iconUrl: "/eth.png",
      change: -2,
      marketCap: "400000000",
    },
  ],
  watchlistUuids: ["1"],
};

// Función para renderizar el componente
const renderComponent = () =>
  render(
    <BrowserRouter>
      <TopCryptos />
    </BrowserRouter>
  );

describe("TopCryptos component", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedApi.get.mockReset();
    mockedApi.post?.mockReset?.();
    vi.clearAllMocks();
  });

  it("muestra loading inicialmente", () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockData });
    renderComponent();
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it("renderiza las criptomonedas cuando la API responde", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockData });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
      expect(screen.getByText("Ethereum")).toBeInTheDocument();
    });

    expect(screen.getByText("✓ Añadido")).toBeInTheDocument(); // Ya en watchlist
    expect(screen.getByText("Añadir")).toBeInTheDocument(); // No en watchlist
  });

  it("muestra Empty si no hay datos", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: null });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Top 10/)).toBeInTheDocument();
      expect(
        screen.getByText(/Lista de las principales criptomonedas/i)
      ).toBeInTheDocument();
    });
  });

  it("añade a watchlist correctamente", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockData });
    mockedApi.post = vi
      .fn()
      .mockResolvedValue({ data: { message: "Añadido" } });

    localStorage.setItem("token", "fake-token");
    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("Ethereum")).toBeInTheDocument()
    );

    const addButton = screen.getByText("Añadir");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith(
        expect.objectContaining({ content: "Añadido" })
      );
    });
  });

  it("navega a detalles al hacer click", async () => {
    mockedApi.get.mockResolvedValueOnce({ data: mockData });
    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("Bitcoin")).toBeInTheDocument()
    );

    const detallesButton = screen.getAllByText("Detalles")[0];
    fireEvent.click(detallesButton);

    expect(mockNavigate).toHaveBeenCalledWith("/crypto/1");
  });
});
