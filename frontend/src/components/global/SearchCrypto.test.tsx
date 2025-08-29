import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { SearchCrypto } from "./SearchCrypto";
import api from "../../lib/axios";
import { message } from "antd";
import { useNavigate, BrowserRouter } from "react-router-dom";

Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
});

vi.mock("../../lib/axios");
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    useNavigate: vi.fn(),
  });
});

vi.spyOn(message, "warning").mockImplementation(vi.fn());
vi.spyOn(message, "error").mockImplementation(vi.fn());

describe("SearchCrypto", () => {
  const setSearchModalVisible = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  it("muestra el modal cuando searchModalVisible es true", () => {
    render(
      <SearchCrypto
        searchModalVisible={true}
        setSearchModalVisible={setSearchModalVisible}
      />
    );
    expect(screen.getByText("Buscar Criptomoneda")).toBeInTheDocument();
  });

  it("no muestra el modal cuando searchModalVisible es false", () => {
    render(
      <SearchCrypto
        searchModalVisible={false}
        setSearchModalVisible={setSearchModalVisible}
      />
    );
    expect(screen.queryByText("Buscar Criptomoneda")).not.toBeInTheDocument();
  });

  it("muestra sugerencias cuando el input tiene >=2 caracteres", async () => {
    const suggestionsMock = [
      { uuid: "1", name: "Bitcoin", symbol: "BTC", iconUrl: "btc.png" },
      { uuid: "2", name: "Ethereum", symbol: "ETH", iconUrl: "eth.png" },
    ];

    (vi.mocked(api.get) as Mock).mockResolvedValue({ data: suggestionsMock });

    render(
      <SearchCrypto
        searchModalVisible={true}
        setSearchModalVisible={setSearchModalVisible}
      />
    );

    const input = screen.getByPlaceholderText(
      /Introduce el nombre o símbolo de la criptomoneda/i
    );

    fireEvent.change(input, { target: { value: "Bi" } });

    await waitFor(() => {
      const items = screen.getAllByRole("listitem");

      expect(
        items.some(
          (item) =>
            item.textContent?.includes("Bitcoin") &&
            item.textContent?.includes("BTC")
        )
      ).toBe(true);
      expect(
        items.some(
          (item) =>
            item.textContent?.includes("Ethereum") &&
            item.textContent?.includes("ETH")
        )
      ).toBe(true);
    });
  });

  it("navega al hacer click en una sugerencia", async () => {
    render(
      <BrowserRouter>
        <SearchCrypto
          searchModalVisible={true}
          setSearchModalVisible={vi.fn()}
        />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(
      /Introduce el nombre o símbolo de la criptomoneda/i
    ) as HTMLInputElement;

    // Simula escribir "Bi" para mostrar sugerencias
    await act(async () => {
      fireEvent.change(input, { target: { value: "Bi" } });
    });

    const suggestion = await screen.findByText((_, element) => {
      return (
        element?.tagName.toLowerCase() === "li" &&
        element.textContent?.includes("Bitcoin") &&
        element.textContent?.includes("BTC")
      );
    });

    await act(async () => {
      fireEvent.click(suggestion);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/crypto/1");
  });

  it("muestra mensaje de advertencia si el input está vacío al buscar", () => {
    render(
      <SearchCrypto
        searchModalVisible={true}
        setSearchModalVisible={setSearchModalVisible}
      />
    );

    const input = screen.getByPlaceholderText(/Introduce el nombre o símbolo/i);
    fireEvent.change(input, { target: { value: " " } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(message.warning).toHaveBeenCalledWith(
      "Por favor, introduce un término de búsqueda."
    );
  });

  it("muestra mensaje de error si el valor no coincide con sugerencias", async () => {
    const suggestionsMock = [
      { uuid: "1", name: "Bitcoin", symbol: "BTC", iconUrl: "btc.png" },
    ];
    (vi.mocked(api.get) as Mock).mockResolvedValue({ data: suggestionsMock });

    render(
      <SearchCrypto
        searchModalVisible={true}
        setSearchModalVisible={setSearchModalVisible}
      />
    );

    const input = screen.getByPlaceholderText(/Introduce el nombre o símbolo/i);
    fireEvent.change(input, { target: { value: "Ethereum (ETH)" } });

    // Simula búsqueda
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() =>
      expect(message.error).toHaveBeenCalledWith(
        "No se encontró ninguna criptomoneda con ese nombre."
      )
    );
  });
});
