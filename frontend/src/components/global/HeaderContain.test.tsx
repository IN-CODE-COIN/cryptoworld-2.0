import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeaderContain } from "./HeaderContain";
import type { Location } from "react-router-dom";
import type { Mock } from "vitest";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

import { useLocation } from "react-router-dom";

describe("HeaderContain", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUseLocation = (pathname: string) => {
    (useLocation as Mock).mockReturnValue({ pathname } as Partial<Location>);
  };

  it("muestra correctamente el título y descripción de 'cartera'", () => {
    mockUseLocation("/cartera");
    render(<HeaderContain pageKey="cartera" />);

    expect(screen.getByText("Cartera")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Gestión de Cartera" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Visualiza, analiza y administra tus activos/i)
    ).toBeInTheDocument();
  });

  it("muestra 'Inicio' en el Tag cuando la ruta es /home", () => {
    mockUseLocation("/home");
    render(<HeaderContain pageKey="home" />);

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Descubre nuestro sitio" })
    ).toBeInTheDocument();
  });

  it("usa el fallback cuando la pageKey no existe", () => {
    mockUseLocation("/unknown");
    render(<HeaderContain pageKey="doesNotExist" />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Título no encontrado" })
    ).toBeInTheDocument();
    expect(screen.getByText("Descripción no disponible.")).toBeInTheDocument();
  });

  it("muestra el nombre legible correcto para /watchlist", () => {
    mockUseLocation("/watchlist");
    render(<HeaderContain pageKey="watchlist" />);

    expect(screen.getByText("Lista de Seguimiento")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Ordena tú lista como quieras" })
    ).toBeInTheDocument();
  });
});
