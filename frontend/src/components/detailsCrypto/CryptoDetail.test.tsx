import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import type { Mock } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CryptoDetail } from "./CryptoDetail";
import api from "../../lib/axios";

// Mock de axios y message
vi.mock("../../lib/axios");
vi.mock("antd", async () => {
  const antd = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...antd,
    message: {
      loading: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

const mockCoin = {
  uuid: "btc",
  name: "Bitcoin",
  symbol: "BTC",
  iconUrl: "http://image.com/btc.png",
  price: 50000,
  change: 2.5,
  marketCap: 900000000,
  description: "Crypto",
  rank: 1,
  "24hVolume": 100000,
  allTimeHigh: { price: 69000 },
  supply: { circulating: 18000000, total: 21000000 },
  websiteUrl: "https://bitcoin.org",
  links: [{ type: "Twitter", url: "https://twitter.com/bitcoin" }],
};

const renderWithRouter = (uuid = "btc") =>
  render(
    <MemoryRouter initialEntries={[`/crypto/${uuid}`]}>
      <Routes>
        <Route path="/crypto/:uuid" element={<CryptoDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe("CryptoDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("muestra loading inicialmente", async () => {
    (api.get as Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { coin: mockCoin } }), 100)
        )
    );
    await act(async () => {
      renderWithRouter();
    });
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  test("renderiza los detalles de la cripto", async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: { coin: mockCoin } });
    (api.get as Mock).mockResolvedValueOnce({ data: { watchlistUuids: [] } });

    await act(async () => {
      renderWithRouter();
    });

    await waitFor(() => {
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Bitcoin/)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("BTC"))
    ).toBeInTheDocument();
    expect(screen.getByText(/Cap. de mercado:/)).toBeInTheDocument();
  });
});
