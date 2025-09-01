import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { SettingsAccount } from "./SettingsAccount";

vi.mock("./BillingPlan", () => ({
  BillingPlan: vi.fn(() => <div data-testid="billing-plan" />),
}));

vi.mock("./DarkModeToogle", () => ({
  DarkModeToggle: vi.fn(() => <div data-testid="dark-mode-toggle" />),
}));

vi.mock("./ActivePlan", () => ({
  ActivePlan: vi.fn(() => <div data-testid="active-plan" />),
}));

describe("SettingsAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los componentes hijos y los Divider", () => {
    render(<SettingsAccount />);

    expect(screen.getByTestId("billing-plan")).toBeInTheDocument();
    expect(screen.getByTestId("dark-mode-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("active-plan")).toBeInTheDocument();

    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });
});
