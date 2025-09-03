import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { Faqs } from "./Faqs";

describe("Faqs component", () => {
  it("renderiza el título y las preguntas frecuentes", () => {
    render(
      <MemoryRouter>
        <Faqs />
      </MemoryRouter>
    );

    expect(screen.getByText("Preguntas frecuentes")).toBeInTheDocument();

    expect(
      screen.getByText("¿Qué incluye el plan gratuito?")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "¿Puedo activar un periodo de prueba del plan Profesional?"
      )
    ).toBeInTheDocument();
  });

  it("muestra y oculta la respuesta al hacer clic en la pregunta", () => {
    render(
      <MemoryRouter>
        <Faqs />
      </MemoryRouter>
    );

    const question = screen.getByText("¿Qué incluye el plan gratuito?");
    fireEvent.click(question);

    expect(
      screen.getByText(
        "El plan gratuito te da acceso básico a la plataforma, con un número limitado de funcionalidades y sin coste mensual."
      )
    ).toBeInTheDocument();

    // vuelve a hacer clic → debería desaparecer
    fireEvent.click(question);

    expect(
      screen.queryByText(
        "El plan gratuito te da acceso básico a la plataforma, con un número limitado de funcionalidades y sin coste mensual."
      )
    ).not.toBeInTheDocument();
  });

  it("solo muestra una respuesta a la vez", () => {
    render(
      <MemoryRouter>
        <Faqs />
      </MemoryRouter>
    );

    const firstQuestion = screen.getByText("¿Qué incluye el plan gratuito?");
    const secondQuestion = screen.getByText(
      "¿Puedo activar un periodo de prueba del plan Profesional?"
    );

    fireEvent.click(firstQuestion);
    expect(
      screen.getByText(
        "El plan gratuito te da acceso básico a la plataforma, con un número limitado de funcionalidades y sin coste mensual."
      )
    ).toBeInTheDocument();

    fireEvent.click(secondQuestion);
    expect(
      screen.getByText(
        "Sí, puedes activar un periodo de prueba de 7 días del plan Profesional. Este periodo solo puede usarse una vez por cuenta."
      )
    ).toBeInTheDocument();

    // la primera respuesta ya no debería estar
    expect(
      screen.queryByText(
        "El plan gratuito te da acceso básico a la plataforma, con un número limitado de funcionalidades y sin coste mensual."
      )
    ).not.toBeInTheDocument();
  });

  it("contiene un enlace al equipo de soporte", () => {
    render(
      <MemoryRouter>
        <Faqs />
      </MemoryRouter>
    );

    const supportLink = screen.getByRole("link", {
      name: /equipo de soporte/i,
    });
    expect(supportLink).toHaveAttribute("href", "/contact");
  });
});
