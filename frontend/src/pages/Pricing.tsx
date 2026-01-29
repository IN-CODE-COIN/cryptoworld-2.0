import React from "react";
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
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
          Planes y Precios
        </h1>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Elige el plan perfecto para ti
        </p>
      </div>
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
