// PlanSelectorForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { PlanSelectorForm } from "./PlanSelectorForm";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import { message } from "antd";

vi.mock("../../lib/axios", () => ({
  default: { post: vi.fn() },
}));
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));
vi.mock("antd", async () => {
  const antd = await vi.importActual<typeof import("antd")>("antd");
  return {
    ...antd,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("PlanSelectorForm", () => {
  const onClose = vi.fn();
  const onStartTrial = vi.fn();
  const onSubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("renderiza el modal y el select de plan", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { has_used_trial: false },
    });

    render(
      <PlanSelectorForm
        open={true}
        onClose={onClose}
        planName="normal"
        onStartTrial={onStartTrial}
        onSubscribe={onSubscribe}
      />
    );

    expect(screen.getByText("Selecciona tu plan")).toBeInTheDocument();

    expect(screen.getByText(/gratuito/i)).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: /profesional/i })
    ).toBeInTheDocument();
  });

  it("muestra aviso si el usuario ya usó el trial", () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { has_used_trial: true },
    });

    render(
      <PlanSelectorForm open={true} onClose={onClose} planName="normal" />
    );

    expect(
      screen.getByText("Ya has utilizado tú periodo de prueba gratuito.")
    ).toBeInTheDocument();
  });

  it("envía el formulario para activar trial", async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { has_used_trial: false },
    });
    (api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

    render(
      <PlanSelectorForm
        open={true}
        onClose={onClose}
        planName="normal"
        onStartTrial={onStartTrial}
      />
    );

    fireEvent.click(screen.getByLabelText(/activar prueba gratis/i));
    fireEvent.click(screen.getByRole("button", { name: /guardar plan/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/start-trial");
      expect(message.success).toHaveBeenCalledWith("Trial activado");
      expect(onStartTrial).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("envía el formulario para suscribirse a plan PRO", async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { has_used_trial: false },
    });
    (api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

    render(
      <PlanSelectorForm
        open={true}
        onClose={onClose}
        planName="pro"
        onSubscribe={onSubscribe}
      />
    );

    fireEvent.click(screen.getByLabelText(/mensual/i));
    fireEvent.click(screen.getByRole("button", { name: /guardar plan/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/change-plan", {
        rol: "pro",
        frequency: "mensual",
      });
      expect(message.success).toHaveBeenCalledWith(
        "Plan actualizado correctamente a pro"
      );
      expect(onSubscribe).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("maneja errores de API mostrando mensaje de error", async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { has_used_trial: false },
    });
    (api.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Fallo en API")
    );

    render(
      <PlanSelectorForm open={true} onClose={onClose} planName="normal" />
    );

    fireEvent.click(screen.getByRole("button", { name: /guardar plan/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Fallo en API");
    });
  });
});
