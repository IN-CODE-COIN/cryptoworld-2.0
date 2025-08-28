import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Usar vi.hoisted para definir el mock antes de las importaciones
const mockUseTheme = vi.hoisted(() => {
  return vi.fn(() => ({ theme: "light" }));
});

vi.mock("../../hooks/useTheme", () => ({
  useTheme: mockUseTheme,
}));

// Importar el componente después de los mocks
import { FormContact } from "./FormContact";

describe("FormContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: "light" });
  });

  // 1. Renderiza correctamente el formulario
  test("renderiza correctamente el formulario", () => {
    render(<FormContact />);
    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByText("Mensaje")).toBeInTheDocument();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  // 2. Muestra errores de validación si el formulario está vacío
  test("muestra errores de validación si el formulario está vacío", async () => {
    render(<FormContact />);

    // Enviar el formulario sin completar los campos
    fireEvent.submit(screen.getByText("Enviar"));

    // Esperar a que aparezcan los mensajes de error
    await waitFor(() => {
      expect(
        screen.getByText("¡El nombre es obligatorio!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("¡El correo electrónico es obligatorio!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("¡El mensaje es obligatorio!")
      ).toBeInTheDocument();
    });
  });

  // 3. Muestra error si el correo electrónico no es válido
  test("muestra error si el correo electrónico no es válido", async () => {
    render(<FormContact />);

    // Completar el nombre y mensaje, pero dejar el correo inválido
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "correo-invalido" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Este es un mensaje de prueba" },
    });

    // Enviar el formulario
    fireEvent.submit(screen.getByText("Enviar"));

    // Esperar a que aparezca el mensaje de error
    await waitFor(() => {
      expect(
        screen.getByText("¡El correo electrónico no es válido!")
      ).toBeInTheDocument();
    });
  });

  // 4. Llama a onFinish con los valores correctos cuando el formulario es válido
  test("envía los valores correctos cuando el formulario es válido", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    render(<FormContact />);

    // Completar todos los campos con valores válidos
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "Este es un mensaje de prueba" },
    });

    // Enviar el formulario
    fireEvent.submit(screen.getByText("Enviar"));

    // Esperar a que se llame a console.log con los valores correctos
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        user: {
          name: "Juan Pérez",
          email: "juan@example.com",
          Message: "Este es un mensaje de prueba",
        },
        agreement: undefined,
      });
    });
  });

  // 5. El formulario funciona correctamente en tema oscuro
  test("funciona correctamente en tema oscuro", async () => {
    mockUseTheme.mockReturnValue({ theme: "dark" });

    render(<FormContact />);

    const nameInput = screen.getByLabelText("Nombre");
    const emailInput = screen.getByLabelText("Correo electrónico");
    const messageInput = screen.getByLabelText("Mensaje");

    // Los campos deben estar presentes y editables
    fireEvent.change(nameInput, { target: { value: "Carlos" } });
    fireEvent.change(emailInput, { target: { value: "carlos@example.com" } });
    fireEvent.change(messageInput, {
      target: { value: "Mensaje en tema oscuro" },
    });

    expect(nameInput).toHaveValue("Carlos");
    expect(emailInput).toHaveValue("carlos@example.com");
    expect(messageInput).toHaveValue("Mensaje en tema oscuro");

    // Enviar y comprobar que no hay errores
    fireEvent.submit(screen.getByText("Enviar"));
    await waitFor(() => {
      expect(
        screen.queryByText("¡El nombre es obligatorio!")
      ).not.toBeInTheDocument();
    });
  });

  // 6. El formulario funciona correctamente en tema claro
  test("funciona correctamente en tema claro", async () => {
    mockUseTheme.mockReturnValue({ theme: "light" });

    render(<FormContact />);

    const nameInput = screen.getByLabelText("Nombre");
    const emailInput = screen.getByLabelText("Correo electrónico");
    const messageInput = screen.getByLabelText("Mensaje");

    fireEvent.change(nameInput, { target: { value: "Ana" } });
    fireEvent.change(emailInput, { target: { value: "ana@example.com" } });
    fireEvent.change(messageInput, {
      target: { value: "Mensaje en tema claro" },
    });

    expect(nameInput).toHaveValue("Ana");
    expect(emailInput).toHaveValue("ana@example.com");
    expect(messageInput).toHaveValue("Mensaje en tema claro");

    fireEvent.submit(screen.getByText("Enviar"));
    await waitFor(() => {
      expect(
        screen.queryByText("¡El correo electrónico es obligatorio!")
      ).not.toBeInTheDocument();
    });
  });
});
