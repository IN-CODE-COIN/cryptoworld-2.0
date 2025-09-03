import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { BillingPlan } from "./BillingPlan";
import { useAuth } from "../../hooks/useAuth";
import dayjs from "dayjs";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("BillingPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el título y la descripción", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    });

    render(
      <MemoryRouter>
        <BillingPlan />
      </MemoryRouter>
    );

    expect(screen.getByText("Facturación")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Actualiza tu información de pago o cambia de planes de acuerdo a tus necesidades."
      )
    ).toBeInTheDocument();
  });

  it("muestra plan gratuito cuando no hay usuario", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
    });

    render(
      <MemoryRouter>
        <BillingPlan />
      </MemoryRouter>
    );

    const planName = screen.getByTestId("plan-name");
    const planFrequency = screen.getByTestId("plan-frequency");
    const planInfo = screen.getByTestId("plan-info");
    const billingPeriod = screen.getByTestId("billing-period");

    expect(planName).toHaveTextContent("Gratuito");
    expect(planFrequency).toHaveTextContent("Ilimitado");
    expect(planInfo).toHaveTextContent("0");
    expect(planInfo).toHaveTextContent("(incl. IVA)");
    expect(billingPeriod).toHaveTextContent("No hay renovación");
  });

  it("muestra plan Trial si el usuario está en periodo de prueba", () => {
    const trialEnd = dayjs().add(5, "day").toISOString();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { trial_ends_at: trialEnd },
    });

    render(
      <MemoryRouter>
        <BillingPlan />
      </MemoryRouter>
    );

    const planName = screen.getByTestId("plan-name");
    const planFrequency = screen.getByTestId("plan-frequency");
    const planInfo = screen.getByTestId("plan-info");
    const billingPeriod = screen.getByTestId("billing-period");

    expect(planName).toHaveTextContent("Trial");
    expect(planFrequency).toHaveTextContent("Prueba gratuita");
    expect(planInfo).toHaveTextContent("0");
    expect(planInfo).toHaveTextContent("(incl. IVA)");
    expect(billingPeriod).toHaveTextContent(
      `Finaliza el ${dayjs(trialEnd).format("DD/MM/YYYY")}`
    );
  });

  it("muestra plan Profesional con monto y frecuencia correctos", () => {
    const proStartedAt = dayjs().subtract(1, "month").toISOString();

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        rol: "pro",
        frequency: "mensual",
        pro_started_at: proStartedAt,
      },
    });

    render(
      <MemoryRouter>
        <BillingPlan />
      </MemoryRouter>
    );

    const planName = screen.getByTestId("plan-name");
    const planFrequency = screen.getByTestId("plan-frequency");
    const planInfo = screen.getByTestId("plan-info");
    const billingPeriod = screen.getByTestId("billing-period");

    expect(planName).toHaveTextContent("Profesional");
    expect(planFrequency).toHaveTextContent("mensual");
    expect(planInfo).toHaveTextContent("50");
    expect(planInfo).toHaveTextContent("(incl. IVA)");
    expect(billingPeriod).toHaveTextContent(
      dayjs(proStartedAt).add(1, "month").format("DD/MM/YYYY")
    );
  });
});
