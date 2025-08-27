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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Formulario vacío
  test("muestra errores de validación si el formulario está vacío", async () => {
    render(<RegisterForm />);
    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      await screen.findByText("Por favor ingresa un nombre")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Por favor ingresa un correo")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Por favor ingresa una contraseña")
    ).toBeInTheDocument();
  });

  // 2. Correo inválido
  test("muestra error si el correo no es válido", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Por favor ingresa un correo válido")
      ).toBeInTheDocument();
    });
  });

  // 3. Contraseña corta
  test("muestra error si la contraseña tiene menos de 6 caracteres", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(
        screen.getByText("La contraseña debe tener al menos 6 caracteres")
      ).toBeInTheDocument();
    });
  });

  // 4. Correo inválido + contraseña corta
  test("muestra errores si el correo es inválido y la contraseña es corta", async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Por favor ingresa un correo válido")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La contraseña debe tener al menos 6 caracteres")
      ).toBeInTheDocument();
    });
  });

  // 5. Formulario no se envía si hay errores
  test("no envía el formulario si hay errores de validación", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(mockedPost).not.toHaveBeenCalled();
    });
  });

  // 6. Envío exitoso
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

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/register", {
        name: "Juan",
        email: "juan@test.com",
        password: "123456",
      });
      expect(message.success).toHaveBeenCalledWith("¡Bienvenid@ Juan!");
    });
  });

  // 7. Error de la API (422)
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

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Datos inválidos.");
    });
  });

  // 8. Error de correo específico (422 con mensaje de email)
  test("muestra error específico si el correo ya está registrado", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockRejectedValueOnce({
      response: {
        status: 422,
        data: { email: ["El correo ya está registrado."] },
      },
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

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "El correo ya está registrado."
      );
    });
  });
});
