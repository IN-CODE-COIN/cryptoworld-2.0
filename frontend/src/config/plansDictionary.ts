export interface Plan {
  name: string;
  price: string | { mensual: string; anual: string };
  buttonText: string;
  buttonLink: string;
  isFree: boolean;
  isStarter?: boolean;
  isRecommended?: boolean;
}

export interface Feature {
  name: string;
  plans: Record<string, boolean | string>;
}

export interface Section {
  name: string;
  features: Feature[];
}

export const plans: Plan[] = [
  {
    name: "Gratuito",
    price: "€0",
    buttonText: "Empezar",
    buttonLink: "/settings",
    isStarter: false,
    isFree: true,
  },
  {
    name: "Profesional",
    price: { mensual: "€50", anual: "€490" },
    buttonText: "Empezar",
    buttonLink: "/pricing",
    isFree: false,
    isStarter: false,
  },
  {
    name: "Empresa",
    price: "Personalizado",
    buttonText: "Contacto",
    buttonLink: "/contact",
    isFree: false,
    isStarter: false,
  },
];

export const sections: Section[] = [
  {
    name: "Gestión de cartera:",
    features: [
      {
        name: "Dashboard de cartera",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
      {
        name: "Actualización en tiempo real",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
      {
        name: "Rentabilidad de la cartera",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
    ],
  },
  {
    name: "Listas de seguimiento:",
    features: [
      {
        name: "Número de criptomonedas en listas",
        plans: {
          Gratuito: "5",
          Profesional: "Ilimitado",
          Empresa: "Ilimitado",
        },
      },
      {
        name: "Lista personalizada y editable",
        plans: { Gratuito: true, Profesional: true, Empresa: true },
      },
      {
        name: "Precios en tiempo real",
        plans: { Gratuito: true, Profesional: true, Empresa: true },
      },
    ],
  },
  {
    name: "Análisis y reportes:",
    features: [
      {
        name: "Historial de movimientos",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
      {
        name: "Exportación CSV de cartera",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
      {
        name: "Gráficos",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
    ],
  },
  {
    name: "Soporte:",
    features: [
      {
        name: "Soporte por email",
        plans: { Gratuito: "48-72h", Profesional: "24h", Empresa: "Directo" },
      },
      {
        name: "Soporte personalizado",
        plans: { Gratuito: false, Profesional: true, Empresa: true },
      },
    ],
  },
];
