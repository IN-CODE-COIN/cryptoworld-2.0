import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarMenu } from "./SideBarMenu";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { Props as ButtonCollapseSiderProps } from "../global/ButtonCollapseSider";

interface User {
  name: string;
}

interface AuthReturn {
  isAuthenticated: boolean;
  user: User | null;
}

// --- Mock hooks ---
const mockUseTheme = vi.fn(() => ({ theme: "light" }));
vi.mock("../../hooks/useTheme", () => ({
  useTheme: () => mockUseTheme(),
}));

const mockUseAuth = vi.fn<() => AuthReturn>(() => ({
  isAuthenticated: false,
  user: null,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../global/ButtonCollapseSider", () => ({
  ButtonCollapseSider: (props: ButtonCollapseSiderProps) => (
    <div data-testid="button-collapse-sider">{JSON.stringify(props)}</div>
  ),
}));

vi.mock("../global/AuthButton", () => ({
  AuthButton: () => <div data-testid="auth-button">AuthButton</div>,
}));

vi.mock("../global/SearchCrypto", () => ({
  SearchCrypto: ({ searchModalVisible }: { searchModalVisible: boolean }) => (
    <div data-testid="search-crypto">
      {searchModalVisible ? "Visible" : "Hidden"}
    </div>
  ),
}));

vi.mock("../../config/navigationConfig", () => ({
  navItems: [
    { key: "1", label: "Home", path: "/" },
    { key: "2", label: "Pricing", path: "/pricing" },
    { key: "3", label: "Cartera", path: "/cartera", protected: true },
    { key: "4", label: "Search", action: "searchModal" }, // 🔥 key duplicado arreglado
  ],
}));

describe("SidebarMenu component", () => {
  const onCollapseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente y muestra el logo y collapse button", () => {
    render(
      <MemoryRouter>
        <SidebarMenu collapsed={false} onCollapse={onCollapseMock} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("button-collapse-sider")).toBeInTheDocument();
    expect(screen.getByAltText("Logo CryptoWorld")).toBeInTheDocument();
  });

  it("muestra AuthButton y nombre del usuario si está autenticado", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: "Alice" },
    });

    render(
      <MemoryRouter>
        <SidebarMenu collapsed={false} onCollapse={onCollapseMock} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("auth-button")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("abre modal de búsqueda al hacer click en item de acción searchModal", () => {
    render(
      <MemoryRouter>
        <SidebarMenu collapsed={false} onCollapse={onCollapseMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Search"));
    expect(screen.getByTestId("search-crypto")).toHaveTextContent("Visible");
  });

  it("colapsa el sidebar al hacer click en item en mobile", () => {
    render(
      <MemoryRouter>
        <SidebarMenu collapsed={false} onCollapse={onCollapseMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Home"));
    expect(onCollapseMock).not.toHaveBeenCalled();
  });
});
