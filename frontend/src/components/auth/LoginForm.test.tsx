import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

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
import axios from "axios";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock de axios.isAxiosError después de importar axios
    vi.spyOn(axios, "isAxiosError").mockImplementation(
      (error) => !!error?.response
    );
  });

  // 1. Formulario vacío
  test("muestra errores de validación si el formulario está vacío", async () => {
    render(<LoginForm />);
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Correo inválido")).toBeInTheDocument();
      expect(
        screen.getByText("Por favor ingresa la contraseña")
      ).toBeInTheDocument();
    });
  });

  // 2. Correo inválido
  test("muestra error si el correo no es válido", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Correo inválido")).toBeInTheDocument();
    });
  });

  // 3. Formulario no se envía si hay errores
  test("no envía el formulario si hay errores de validación", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText("Correo"), {
      target: { value: "usuario" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockedPost).not.toHaveBeenCalled();
    });
  });

  // 4. Envío exitoso
  test("envía el formulario correctamente y muestra mensaje de éxito", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockResolvedValueOnce({
      data: { token: "123", user: { name: "Juan" } },
    });
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith("/login", {
        email: "juan@test.com",
        password: "123456",
      });
      expect(message.success).toHaveBeenCalledWith("¡Bienvenid@ Juan!");
    });
  });

  // 5. Credenciales inválidas (401)
  test("muestra error si las credenciales son inválidas", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockRejectedValueOnce({
      response: { status: 401, data: {} },
    });
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "contraseña_incorrecta" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Credenciales inválidas");
    });
  });

  // 6. Error inesperado de la API
  test("muestra error si ocurre un error inesperado en la API", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Error inesperado.");
    });
  });

  // 7. Error desconocido (no es AxiosError)
  test("muestra error si ocurre un error desconocido", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    mockedPost.mockRejectedValueOnce(new Error("Error desconocido"));
    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Error desconocido.");
    });
  });

  // 8. Verifica que se llame a onClose después de un login exitoso
  test("llama a onClose después de un login exitoso", async () => {
    const mockedPost = api.post as unknown as ReturnType<typeof vi.fn>;
    const mockOnClose = vi.fn();
    mockedPost.mockResolvedValueOnce({
      data: { token: "123", user: { name: "Juan" } },
    });
    render(<LoginForm onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText(/user@email.com/), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "123456" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // 9. Verifica que se llame a onSwitch al hacer clic en 'Crear cuenta'
  test("llama a onSwitch al hacer clic en 'Crear cuenta'", () => {
    const mockOnSwitch = vi.fn();
    render(<LoginForm onSwitch={mockOnSwitch} />);

    fireEvent.click(screen.getByText(/crear cuenta/i));

    expect(mockOnSwitch).toHaveBeenCalled();
  });
});
