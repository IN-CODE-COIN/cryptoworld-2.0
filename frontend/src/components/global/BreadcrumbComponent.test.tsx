import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MockedFunction } from "vitest";
import { render, screen } from "@testing-library/react";
import { BreadcrumbComponent } from "./BreadcrumbComponent";
import type { Location } from "react-router-dom";

// Mock de react-router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

import { useLocation } from "react-router-dom";

describe("BreadcrumbComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente breadcrumb en la ruta raíz", () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      pathname: "/",
    } as Location);

    render(<BreadcrumbComponent />);

    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
  });

  it("renderiza breadcrumb para rutas simples", () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      pathname: "/cartera",
    } as Location);

    render(<BreadcrumbComponent />);

    expect(screen.getByText(/Cartera/i)).toBeInTheDocument();
  });

  it("renderiza breadcrumb para rutas anidadas solo con las que existen en routeMap", () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      pathname: "/crypto/details",
    } as Location);

    render(<BreadcrumbComponent />);

    expect(screen.getByText(/Crypto/i)).toBeInTheDocument();
    expect(screen.queryByText(/details/i)).not.toBeInTheDocument();
  });

  it("usa iconos correctos junto al texto", () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      pathname: "/watchlist",
    } as Location);

    render(<BreadcrumbComponent />);

    const watchlist = screen.getByText(/Lista de Seguimiento/i);
    expect(watchlist.querySelector("svg")).toBeInTheDocument();
  });

  it("aplica estilo customizado si se pasa la prop style", () => {
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
      pathname: "/",
    } as Location);

    render(<BreadcrumbComponent style={{ color: "red" }} />);
    const breadcrumb = screen.getByText(/Inicio/i);

    expect(breadcrumb.closest("nav")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });
});
