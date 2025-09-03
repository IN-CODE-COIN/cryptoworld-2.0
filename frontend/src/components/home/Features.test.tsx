import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Features } from "./Features";

describe("Features component", () => {
  it("renderiza todos los features con título, subtítulo y descripción", () => {
    render(<Features />);

    const titles = [
      "1. Búsqueda",
      "2. Lista de Seguimiento",
      "3. Cartera",
      "4. Gráficos",
    ];

    const subtitles = [
      "Rápida y gratuita",
      "No pierdas detalle",
      "Control total",
      "Visualización clara y detallada",
    ];

    const descriptions = [
      "Busca información de más de 2000 criptomonedas en un solo lugar.",
      "Organiza y monitorea tus criptomonedas de manera eficiente.",
      "Apunta todos los movimientos de tú cartera y controla el rendimiento.",
      "Información en un solo vistazo, con gráficos modernos e interactivos.",
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    subtitles.forEach((subtitle) => {
      expect(screen.getByText(subtitle)).toBeInTheDocument();
    });

    descriptions.forEach((desc) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });

    const grid = screen.getByTestId("features-grid");
    expect(grid).toBeInTheDocument();
  });
});
