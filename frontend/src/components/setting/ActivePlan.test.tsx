import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { ActivePlan } from "./ActivePlan";
import { useAuth } from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("ActivePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    });

    render(<ActivePlan />);

    expect(screen.getByText("Plan Actual")).toBeInTheDocument();
    expect(
      screen.getByText("Este es el plan que estás usando actualmente.")
    ).toBeInTheDocument();
  });

  it("muestra el plan Gratuito cuando user.rol no es 'pro'", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { rol: "normal", trial_ends_at: null },
    });

    render(<ActivePlan />);

    expect(screen.getByText("Gratuito")).toBeInTheDocument();
    expect(screen.queryByText(/Version de Prueba/)).not.toBeInTheDocument();
  });

  it("muestra el plan Profesional cuando user.rol es 'pro'", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { rol: "pro", trial_ends_at: null },
    });

    render(<ActivePlan />);

    expect(screen.getByText("Profesional")).toBeInTheDocument();
    expect(screen.queryByText(/Version de Prueba/)).not.toBeInTheDocument();
  });

  it("muestra la indicación de versión de prueba si trial_ends_at no es null", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { rol: "pro", trial_ends_at: "2025-09-01T00:00:00Z" },
    });

    render(<ActivePlan />);

    expect(
      screen.getByText(/Profesional - Version de Prueba/)
    ).toBeInTheDocument();
  });
});
