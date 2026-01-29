import React from "react";
import { DarkModeToggle } from "./DarkModeToogle";
import { BillingPlan } from "./BillingPlan";
import { ActivePlan } from "./ActivePlan";

export const SettingsAccount: React.FC = () => {
  return (
    <section className="space-y-6">
      <ActivePlan />
      <DarkModeToggle />
      <BillingPlan />
    </section>
  );
};
