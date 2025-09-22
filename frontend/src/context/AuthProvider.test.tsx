import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // ✅ importar router
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "../hooks/useAuth";
import type { UserType } from "./AuthContext";

describe("AuthProvider", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  );

  it("permite login y logout correctamente", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const user: UserType = {
      id: 1,
      name: "Test",
      email: "t@test.com",
      rol: "normal",
      balance: 0,
      has_used_trial: false,
    };

    act(() => {
      result.current.login("token123", user);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(user);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});
