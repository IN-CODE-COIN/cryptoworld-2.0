import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Account } from "./Account";

vi.mock("../components/setting/SettingsAccount", () => ({
  SettingsAccount: () => (
    <div data-testid="settings-account">SettingsAccount</div>
  ),
}));

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

describe("Account Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Account />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("settings-account")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='account'", () => {
    render(<Account />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("account");
  });
});
