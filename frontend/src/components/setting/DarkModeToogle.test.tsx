import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { DarkModeToggle } from "./DarkModeToogle";
import { useTheme } from "../../hooks/useTheme";

vi.mock("../../hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

describe("DarkModeToggle", () => {
  const toggleThemeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza título y descripción", () => {
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      toggleTheme: toggleThemeMock,
    });

    render(<DarkModeToggle />);

    expect(screen.getByText("Modos")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Elige entre claro y oscuro para adaptarte a tus preferencias."
      )
    ).toBeInTheDocument();
  });

  it("muestra ambas opciones de tema", () => {
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      toggleTheme: toggleThemeMock,
    });

    render(<DarkModeToggle />);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Cambia a modo claro para una mejor visibilidad en entornos con luminosidad alta."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Cambia a modo oscuro para una mejor visibilidad en entornos con luminosidad baja."
      )
    ).toBeInTheDocument();
  });

  it("cambia de tema al hacer clic en la opción no seleccionada", () => {
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      toggleTheme: toggleThemeMock,
    });

    render(<DarkModeToggle />);

    fireEvent.click(screen.getByText("Dark"));
    expect(toggleThemeMock).toHaveBeenCalled();
  });

  it("no cambia el tema si se hace clic en la opción ya seleccionada", () => {
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
      toggleTheme: toggleThemeMock,
    });

    render(<DarkModeToggle />);

    fireEvent.click(screen.getByText("Light"));
    expect(toggleThemeMock).not.toHaveBeenCalled();
  });
});
