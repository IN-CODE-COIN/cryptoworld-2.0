import { describe, it, expect } from "vitest";
import { plans, sections } from "./plansDictionary";

describe("Planes", () => {
  it("debe tener 3 planes", () => {
    expect(plans).toHaveLength(3);
  });

  it("cada plan debe tener las propiedades requeridas", () => {
    plans.forEach((plan) => {
      expect(plan).toHaveProperty("name");
      expect(plan).toHaveProperty("price");
      expect(plan).toHaveProperty("buttonText");
      expect(plan).toHaveProperty("buttonLink");
      expect(plan).toHaveProperty("isFree");
    });
  });

  it("el plan 'Gratuito' debe tener las propiedades correctas", () => {
    const gratuito = plans.find((plan) => plan.name === "Gratuito");
    expect(gratuito).toBeDefined();
    expect(gratuito!.price).toBe("€0");
    expect(gratuito!.buttonText).toBe("Comenzar");
    expect(gratuito!.buttonLink).toBe("/");
    expect(gratuito!.isFree).toBe(true);
  });

  it("el plan 'Profesional' debe tener las propiedades correctas", () => {
    const profesional = plans.find((plan) => plan.name === "Profesional");
    expect(profesional).toBeDefined();
    expect(profesional!.price).toEqual({ mensual: "€50", anual: "€490" });
    expect(profesional!.buttonText).toBe("Comenzar");
    expect(profesional!.buttonLink).toBe("/pricing");
    expect(profesional!.isFree).toBe(false);
  });

  it("el plan 'Empresa' debe tener las propiedades correctas", () => {
    const empresa = plans.find((plan) => plan.name === "Empresa");
    expect(empresa).toBeDefined();
    expect(empresa!.price).toBe("Personalizado");
    expect(empresa!.buttonText).toBe("Contactanos");
    expect(empresa!.buttonLink).toBe("/contact");
    expect(empresa!.isFree).toBe(false);
  });
});

describe("Secciones y Características", () => {
  it("debe tener 4 secciones", () => {
    expect(sections).toHaveLength(4);
  });

  it("cada sección debe tener las propiedades requeridas", () => {
    sections.forEach((section) => {
      expect(section).toHaveProperty("name");
      expect(section).toHaveProperty("features");
      expect(Array.isArray(section.features)).toBe(true);
    });
  });

  it("cada característica debe tener las propiedades requeridas", () => {
    sections.forEach((section) => {
      section.features.forEach((feature) => {
        expect(feature).toHaveProperty("name");
        expect(feature).toHaveProperty("plans");
      });
    });
  });

  it("la sección 'Gestión de cartera' debe tener las características correctas", () => {
    const gestionCartera = sections.find(
      (section) => section.name === "Gestión de cartera:"
    );
    expect(gestionCartera).toBeDefined();
    expect(gestionCartera!.features).toHaveLength(3);
    expect(
      gestionCartera!.features.find(
        (feature) => feature.name === "Dashboard de cartera"
      )
    ).toBeDefined();
  });

  it("la característica 'Número de criptomonedas en listas' debe tener los valores correctos", () => {
    const feature = sections
      .find((section) => section.name === "Listas de seguimiento:")
      ?.features.find(
        (feature) => feature.name === "Número de criptomonedas en listas"
      );
    expect(feature).toBeDefined();
    expect(feature!.plans).toEqual({
      Gratuito: "10",
      Profesional: "Ilimitado",
      Empresa: "Ilimitado",
    });
  });

  it("la característica 'Soporte por email' debe tener los valores correctos", () => {
    const feature = sections
      .find((section) => section.name === "Soporte:")
      ?.features.find((feature) => feature.name === "Soporte por email");
    expect(feature).toBeDefined();
    expect(feature!.plans).toEqual({
      Gratuito: "48-72h",
      Profesional: "24h",
      Empresa: "Directo",
    });
  });
});
