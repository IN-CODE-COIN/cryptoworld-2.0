import { render, screen, fireEvent } from "@testing-library/react";
import { BannerHome } from "./BannerHome";

beforeEach(() => {
  localStorage.clear();
});

describe("BannerHome component", () => {
  it("muestra el banner si no hay token y bannerClosed no es 'true'", () => {
    render(<BannerHome />);

    expect(screen.getByText("Regístrate o inicia sesión")).toBeInTheDocument();
    // Revisar que los títulos del data estén presentes
    expect(screen.getByText("Regístrate")).toBeInTheDocument();
    expect(screen.getByText("Nuestros planes")).toBeInTheDocument();
    expect(screen.getByText("Buscador de criptomonedas")).toBeInTheDocument();
  });

  it("no muestra el banner si hay token", () => {
    localStorage.setItem("token", "123");
    render(<BannerHome />);
    expect(screen.queryByText("Regístrate o inicia sesión")).toBeNull();
  });

  it("no muestra el banner si bannerClosed es 'true'", () => {
    localStorage.setItem("bannerClosed", "true");
    render(<BannerHome />);
    expect(screen.queryByText("Regístrate o inicia sesión")).toBeNull();
  });

  it("cierra el banner al hacer click y guarda bannerClosed en localStorage", () => {
    render(<BannerHome />);
    const closeButton = screen.getByRole("button", { name: /Cerrar/i });

    fireEvent.click(closeButton);

    expect(screen.queryByText("Regístrate o inicia sesión")).toBeNull();
    expect(localStorage.getItem("bannerClosed")).toBe("true");
  });
});
