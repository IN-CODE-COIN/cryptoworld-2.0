import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { RegisterForm } from "./RegisterForm";

// Mock de api
vi.mock("../../lib/axios", () => ({
  default: { post: vi.fn() },
}));

// Mock de useAuth
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

// Mock de message de antd
vi.mock("antd", async (importOriginal) => {
  const antd = await importOriginal<typeof import("antd")>();
  return {
    ...antd,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

import api from "../../lib/axios";
import { message } from "antd";

describe("RegisterForm", () => {
  test("muestra errores de validación si el formulario está vacío", async () => {
    render(<RegisterForm />);

    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(await screen.findAllByText(/Por favor ingresa/)).toHaveLength(2);
    expect(await screen.findByText(/Correo inválido/)).toBeInTheDocument();
  });

  test("envía el formulario correctamente", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockResolvedValueOnce({
      data: { token: "123", user: { name: "Juan" } },
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText(/User/), {
      target: { value: "Juan" },
    });
    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith("/register", {
        name: "Juan",
        email: "juan@test.com",
        password: "123456",
      })
    );

    expect(message.success).toHaveBeenCalledWith("¡Bienvenid@ Juan!");
  });

  test("muestra error si la API devuelve 422", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockRejectedValueOnce({
      response: { status: 422, data: { message: "Datos inválidos." } },
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText(/User/), {
      target: { value: "Juan" },
    });
    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "123456" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() =>
      expect(message.error).toHaveBeenCalledWith("Datos inválidos.")
    );
  });
});
