import React from "react";
import { PricingCards } from "../components/pricing/PricingCards";
import { TablePlans } from "../components/pricing/TablePlans";
import { Faqs } from "../components/pricing/Faqs";
import { HeaderContain } from "../components/global/HeaderContain";
import { plans, sections } from "../config/plansDictionary";

export const Pricing: React.FC = () => {
  const [billingFrequency] = React.useState<"mensual" | "anual">("anual");

  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="pricing" />
      <PricingCards />
      <TablePlans
        plans={plans}
        sections={sections}
        billingFrequency={billingFrequency}
      />
      <Faqs />
    </section>
  );
};
