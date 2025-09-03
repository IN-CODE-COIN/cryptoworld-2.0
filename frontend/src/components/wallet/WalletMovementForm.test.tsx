import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { WalletMovementForm } from "./WalletMovementForm";
import api from "../../lib/axios";
import { message } from "antd";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock de antd message
vi.mock("antd", async () => {
  const antd = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...antd,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("WalletMovementForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el saldo inicial cargado desde la API", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>) = vi
      .fn()
      .mockResolvedValue({ data: { balance: 1500 } });

    render(
      <MemoryRouter>
        <WalletMovementForm />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/\$1,500\.00/)).toBeInTheDocument()
    );
  });

  it("envía un nuevo movimiento correctamente", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>) = vi
      .fn()
      .mockResolvedValue({ data: { balance: 2000 } });

    (api.post as unknown as ReturnType<typeof vi.fn>) = vi
      .fn()
      .mockResolvedValue({
        data: { message: "Movimiento registrado correctamente" },
      });

    render(
      <MemoryRouter>
        <WalletMovementForm />
      </MemoryRouter>
    );

    await screen.findByText(/\$2,000\.00/);

    const cantidadInput = screen.getByPlaceholderText("0.00");
    fireEvent.change(cantidadInput, { target: { value: "100" } });

    const metodoSelect = screen.getByLabelText("Método");
    fireEvent.mouseDown(metodoSelect);
    const opcionPaypal = await screen.findByText("PayPal");
    fireEvent.click(opcionPaypal);

    const submitBtn = screen.getByRole("button", { name: /guardar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/cartera", expect.any(Object));
    });

    expect(message.success).toHaveBeenCalledWith(
      "Movimiento registrado correctamente"
    );
  });

  it("muestra error si falla la API al cargar saldo", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>) = vi
      .fn()
      .mockRejectedValue(new Error("Error de red"));

    render(
      <MemoryRouter>
        <WalletMovementForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Error al cargar el saldo");
    });
  });
});
