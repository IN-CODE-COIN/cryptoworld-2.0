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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-2"
        >
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2"
          >
            Comparativa Detallada
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto`}
          >
            Revisa todas las características y diferencias entre nuestros planes
          </motion.p>
        </motion.div>
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
