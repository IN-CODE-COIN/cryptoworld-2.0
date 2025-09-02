import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pricing } from "./Pricing";
import { plans, sections } from "../config/plansDictionary";

vi.mock("../components/global/HeaderContain", () => ({
  HeaderContain: ({ pageKey }: { pageKey: string }) => (
    <div data-testid="header-contain">{pageKey}</div>
  ),
}));

vi.mock("../components/pricing/PricingCards", () => ({
  PricingCards: () => <div data-testid="pricing-cards">PricingCards</div>,
}));

vi.mock("../components/pricing/TablePlans", () => ({
  TablePlans: ({
    plans,
    sections,
    billingFrequency,
  }: {
    plans: [];
    sections: [];
    billingFrequency: string;
  }) => (
    <div data-testid="table-plans">
      {billingFrequency} {plans.length} {Object.keys(sections).length}
    </div>
  ),
}));

vi.mock("../components/pricing/Faqs", () => ({
  Faqs: () => <div data-testid="faqs">Faqs</div>,
}));

describe("Pricing Component", () => {
  it("debe renderizarse sin errores", () => {
    render(<Pricing />);
    expect(screen.getByTestId("header-contain")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-cards")).toBeInTheDocument();
    expect(screen.getByTestId("table-plans")).toBeInTheDocument();
    expect(screen.getByTestId("faqs")).toBeInTheDocument();
  });

  it("debe contener HeaderContain con pageKey='pricing'", () => {
    render(<Pricing />);
    const headerContain = screen.getByTestId("header-contain");
    expect(headerContain).toHaveTextContent("pricing");
  });

  it("debe pasar las props correctas a TablePlans", () => {
    render(<Pricing />);
    const tablePlans = screen.getByTestId("table-plans");
    expect(tablePlans).toHaveTextContent("anual");
    expect(tablePlans).toHaveTextContent(plans.length.toString());
    expect(tablePlans).toHaveTextContent(
      Object.keys(sections).length.toString()
    );
  });
});
