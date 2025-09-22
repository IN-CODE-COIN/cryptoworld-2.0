import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isAuthenticated } from "./AuthHelpers";

describe("isAuthenticated", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("devuelve false si no hay token en localStorage", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("devuelve true si hay token en localStorage", () => {
    localStorage.setItem("token", "123");
    expect(isAuthenticated()).toBe(true);
  });
});
