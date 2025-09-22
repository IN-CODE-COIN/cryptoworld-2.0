import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { ThemeProvider } from "../context/ThemeProvider";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  it("lanza error si se usa fuera del ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
  });

  it("retorna valores y funciones del contexto", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(
      result.current.theme === "light" || result.current.theme === "dark"
    ).toBe(true);
    expect(typeof result.current.toggleTheme).toBe("function");
  });
});
