import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { LogoutModal } from "./LogoutForm";

// Mock de useAuth
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("LogoutModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. No renderiza si no está autenticado
  test("no renderiza si no está autenticado", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      logout: vi.fn(),
      user: null,
      login: vi.fn(),
    });

    const { container } = render(
      <LogoutModal open={true} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  // 2. Renderiza si está autenticado y open es true
  test("renderiza si está autenticado y open es true", () => {
    const useAuthMock = {
      isAuthenticated: true,
      logout: vi.fn(),
      user: {
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        rol: "normal" as const,
        balance: 0,
        has_used_trial: false,
      },
      login: vi.fn(),
    };

    vi.mocked(useAuth).mockReturnValue(useAuthMock);

    render(<LogoutModal open={true} onClose={() => {}} />);
    expect(screen.getByText("¿Cerrar sesión?")).toBeInTheDocument();
  });

  // 3. No renderiza si open es false
  test("no renderiza si open es false", () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn(),
      user: null,
      login: vi.fn(),
    });

    const { container } = render(
      <LogoutModal open={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  // 4. Llama a logout y onClose al hacer clic en 'Cerrar sesión'
  test("llama a logout y onClose al hacer clic en 'Cerrar sesión'", () => {
    const mockLogout = vi.fn();
    const mockOnClose = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      user: null,
      login: vi.fn(),
    });

    render(<LogoutModal open={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Cerrar sesión"));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  // 5. Llama a onClose al hacer clic en 'Cancelar'
  test("llama a onClose al hacer clic en 'Cancelar'", () => {
    const mockOnClose = vi.fn();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn(),
      user: null,
      login: vi.fn(),
    });

    render(<LogoutModal open={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

// Importar useAuth después de los mocks
import { useAuth } from "../../hooks/useAuth";
