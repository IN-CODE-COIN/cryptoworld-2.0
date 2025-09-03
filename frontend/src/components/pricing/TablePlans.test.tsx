import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TablePlans } from "./TablePlans";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

vi.mock("../auth/AuthModal", () => ({
  AuthModal: ({ open }: { open: boolean }) =>
    open ? <div>AuthModal abierto</div> : null,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("TablePlans", () => {
  const samplePlans = [
    {
      name: "Gratuito",
      price: "€0",
      buttonText: "Comenzar",
      buttonLink: "/signup",
      isStarter: true,
      isFree: true,
    },
    {
      name: "Profesional",
      price: { mensual: "€50", anual: "€490" },
      buttonText: "Actualizar",
      buttonLink: "/upgrade",
      isStarter: false,
      isFree: false,
    },
  ];

  const sampleSections = [
    {
      name: "General",
      features: [
        {
          name: "Soporte",
          plans: {
            Gratuito: "Básico",
            Profesional: true,
          },
        },
        {
          name: "Usuarios ilimitados",
          plans: {
            Gratuito: false,
            Profesional: true,
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      theme: "light",
    });
  });

  it("renderiza los encabezados de los planes y precios", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <TablePlans
          plans={samplePlans}
          sections={sampleSections}
          billingFrequency="mensual"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Gratuito")).toBeInTheDocument();
    expect(screen.getByText("Profesional")).toBeInTheDocument();
    expect(screen.getByText("€0")).toBeInTheDocument();
    expect(screen.getByText("€50")).toBeInTheDocument();
  });

  it("renderiza features con texto, check y minus", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <TablePlans
          plans={samplePlans}
          sections={sampleSections}
          billingFrequency="mensual"
        />
      </MemoryRouter>
    );

    // Texto
    expect(screen.getByText("Básico")).toBeInTheDocument();
    // Íconos (se renderizan por role="img")
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("muestra AuthModal al hacer clic en un botón si no está autenticado", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <TablePlans
          plans={samplePlans}
          sections={sampleSections}
          billingFrequency="mensual"
        />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button", { name: "Comenzar" });
    fireEvent.click(btn);

    expect(screen.getByText("AuthModal abierto")).toBeInTheDocument();
  });

  it("muestra 'Activo' en el plan actual del usuario", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { rol: "normal" }, // usuario gratuito
    });

    render(
      <MemoryRouter>
        <TablePlans
          plans={samplePlans}
          sections={sampleSections}
          billingFrequency="mensual"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Activo" })).toBeDisabled();
  });

  it("muestra 'Mejorar plan' si usuario gratuito ve Profesional", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { rol: "normal" },
    });

    render(
      <MemoryRouter>
        <TablePlans
          plans={samplePlans}
          sections={sampleSections}
          billingFrequency="mensual"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: "Mejorar plan" })
    ).toBeInTheDocument();
  });

  it("hace navigate al link del plan si usuario autenticado hace clic en otro plan", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { rol: "normal" },
    });

    render(
      <MemoryRouter>
        <TablePlans
          plans={samplePlans}
          sections={sampleSections}
          billingFrequency="mensual"
        />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button", { name: "Mejorar plan" });
    fireEvent.click(btn);

    expect(mockNavigate).toHaveBeenCalledWith("/upgrade");
  });
});
