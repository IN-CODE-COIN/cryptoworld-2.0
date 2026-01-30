import React from "react";
import { motion } from "framer-motion";
import { PricingCards } from "../components/pricing/PricingCards";
import { TablePlans } from "../components/pricing/TablePlans";
import { Faqs } from "../components/pricing/Faqs";
import { plans, sections } from "../config/plansDictionary";
import { useTheme } from "../hooks/useTheme";

export const Pricing: React.FC = () => {
  const [billingFrequency] = React.useState<"mensual" | "anual">("anual");
  const { theme } = useTheme();

  return (
    <div className="w-full space-y-24">
      <div>
        <PricingCards />
      </div>
      <div>
        <TablePlans
          plans={plans}
          sections={sections}
          billingFrequency={billingFrequency}
        />
      </div>
      <div>
        <Faqs />
      </div>
    </div>
  );
};
