import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { PricingCards } from "./PricingCards";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../lib/axios", () => ({
  default: { get: vi.fn() },
}));

vi.mock("antd", async (importOriginal) => {
  const antd = await importOriginal<typeof import("antd")>();
  return {
    ...antd,
    message: { info: vi.fn(), success: vi.fn() },
  };
});

vi.mock("../auth/AuthModal", () => ({
  AuthModal: ({ open }: { open: boolean }) =>
    open ? <div>AuthModal abierto</div> : null,
}));

vi.mock("./PlanSelectorForm", () => ({
  PlanSelectorForm: ({ open }: { open: boolean }) =>
    open ? <div>PlanSelectorForm abierto</div> : null,
}));

describe("PricingCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los planes con sus nombres y precios", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
    });

    render(<PricingCards />);

    expect(screen.getByText("Gratuito")).toBeInTheDocument();
    expect(screen.getByText("Profesional")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();

    expect(screen.getByText("€0")).toBeInTheDocument();
    expect(screen.getByText("€50")).toBeInTheDocument();
    expect(screen.getByText("Personalizado")).toBeInTheDocument();
  });

  it("permite cambiar la frecuencia en el plan Profesional", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
    });

    render(<PricingCards />);

    expect(screen.getByText("€50")).toBeInTheDocument();
    expect(screen.getByText("/mes")).toBeInTheDocument();

    const anualOption = screen.getByLabelText("anual");
    fireEvent.click(anualOption);

    expect(screen.getByText("€490")).toBeInTheDocument();
    expect(screen.getByText("/año")).toBeInTheDocument();
  });

  it("abre el AuthModal si el usuario no está autenticado y selecciona el plan Gratuito", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
    });

    render(<PricingCards />);

    // El primer botón "Comenzar" pertenece al plan Gratuito
    const startButtons = screen.getAllByRole("button", { name: "Comenzar" });
    fireEvent.click(startButtons[0]);

    expect(screen.getByText("AuthModal abierto")).toBeInTheDocument();
  });

  it("abre el PlanSelectorForm si el usuario está autenticado (rol pro) y selecciona el plan Gratuito", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", rol: "pro", has_used_trial: false },
      login: vi.fn(),
    });

    render(<PricingCards />);

    // En este caso, el botón de Gratuito debería ser "Cambiar"
    const changeButton = screen.getByRole("button", { name: "Cambiar" });
    fireEvent.click(changeButton);

    expect(screen.getByText("PlanSelectorForm abierto")).toBeInTheDocument();
  });

  it("el plan Empresa muestra un botón deshabilitado con el texto 'Próximamente'", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      login: vi.fn(),
    });

    render(<PricingCards />);

    const enterpriseButton = screen.getByRole("button", {
      name: "Próximamente",
    });
    expect(enterpriseButton).toBeDisabled();
  });
});
