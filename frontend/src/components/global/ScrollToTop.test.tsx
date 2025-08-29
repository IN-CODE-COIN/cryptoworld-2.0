import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { ScrollToTop } from "./ScrollToTop";

vi.mock("../../hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("ScrollToTop", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    Object.defineProperty(window, "pageYOffset", { value: 0, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("no muestra el botón si scroll < 150", () => {
    render(<ScrollToTop />);
    expect(screen.queryByTitle("Ir arriba")).not.toBeInTheDocument();
  });

  it("muestra el botón cuando scroll > 150", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "pageYOffset", { value: 200 });
      window.dispatchEvent(new Event("scroll"));
    });

    expect(screen.getByTitle("Ir arriba")).toBeInTheDocument();
  });

  it("hace scrollTo top al clickear el botón", () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, "pageYOffset", { value: 200 });
      window.dispatchEvent(new Event("scroll"));
    });

    const button = screen.getByTitle("Ir arriba");
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
