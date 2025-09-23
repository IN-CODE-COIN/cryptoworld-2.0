import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contact } from "./Contact";

// Mock de HeaderContain
vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

// Mock de FormContact
vi.mock("../components/contact/FormContact", () => ({
  FormContact: () => <form data-testid="form-contact"></form>,
}));

describe("Contact Component", () => {
  it("debe renderizar el componente Contact con HeaderContain y FormContact", () => {
    render(<Contact />);

    // Usar getByTestId en lugar de getByRole('region')
    const container = screen.getByTestId("contact-container");
    expect(container).toHaveClass("container");
    expect(container).toHaveClass("md:w-5xl");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("flex-col");
    expect(container).toHaveClass("mx-auto");

    // Verificar que HeaderContain está presente
    const header = screen.getByTestId("header-contain");
    expect(header).toBeInTheDocument();

    // Verificar que FormContact está presente
    const form = screen.getByTestId("form-contact");
    expect(form).toBeInTheDocument();
  });
});
