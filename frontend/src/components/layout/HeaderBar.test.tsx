import { render, screen } from "@testing-library/react";
import { HeaderBar } from "./HeaderBar";
import { vi } from "vitest";
import type { Props as ButtonCollapseSiderProps } from "../global/ButtonCollapseSider";

const mockUseTheme = vi.fn(() => ({ theme: "light" }));
vi.mock("../../hooks/useTheme", () => ({
  useTheme: () => mockUseTheme(),
}));

const mockUseAuth = vi.fn(() => ({ isAuthenticated: false }));
vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseBreakpoint = vi.fn(() => ({ xs: true, sm: false }));
vi.mock("antd", async () => {
  const actual: typeof import("antd") = await vi.importActual("antd");
  return {
    ...actual,
    Grid: {
      ...actual.Grid,
      useBreakpoint: () => mockUseBreakpoint(),
    } as typeof actual.Grid,
  };
});

vi.mock("../global/ButtonCollapseSider", () => ({
  ButtonCollapseSider: (props: ButtonCollapseSiderProps) => (
    <div data-testid="button-collapse-sider">{JSON.stringify(props)}</div>
  ),
}));

vi.mock("../global/BreadcrumbComponent", () => ({
  BreadcrumbComponent: (props: ButtonCollapseSiderProps) => (
    <div data-testid="breadcrumb-component">{JSON.stringify(props)}</div>
  ),
}));

vi.mock("../global/AuthButton", () => ({
  AuthButton: () => <div data-testid="auth-button">AuthButton</div>,
}));

describe("HeaderBar component", () => {
  it("renderiza correctamente en mobile con tema light y usuario no autenticado", () => {
    const toggleCollapsed = vi.fn();
    render(<HeaderBar collapsed={false} toggleCollapsed={toggleCollapsed} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    expect(screen.getByTestId("button-collapse-sider")).toBeInTheDocument();

    expect(screen.getByTestId("breadcrumb-component")).toBeInTheDocument();

    expect(screen.getByTestId("auth-button")).toBeInTheDocument();
  });

  it("no muestra AuthButton si el usuario está autenticado en desktop", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });
    mockUseBreakpoint.mockReturnValue({ xs: false, sm: true });

    const toggleCollapsed = vi.fn();
    render(<HeaderBar collapsed={false} toggleCollapsed={toggleCollapsed} />);

    const authButtonWrapper = screen.getByTestId("auth-button-wrapper");
    expect(authButtonWrapper).toHaveClass("hidden");
  });

  it("aplica estilos correctos según el tema dark", () => {
    mockUseTheme.mockReturnValue({ theme: "dark" });

    const toggleCollapsed = vi.fn();
    render(<HeaderBar collapsed={true} toggleCollapsed={toggleCollapsed} />);

    const header = screen.getByRole("banner");
    expect(header).toHaveStyle("background-color: #001529");
  });
});
