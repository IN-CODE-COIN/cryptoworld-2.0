import React from "react";
import { Divider } from "antd";
import { DarkModeToggle } from "./DarkModeToogle";
import { BillingPlan } from "./BillingPlan";
import { ActivePlan } from "./ActivePlan";

export const SettingsAccount: React.FC = () => {
  return (
    <>
      <section className="container flex flex-wrap gap-10 md:gap-6 md:justify-start justify-center mx-auto">
        <ActivePlan />
        <Divider />
        <DarkModeToggle />
        <Divider />
        <BillingPlan />
      </section>
    </>
  );
};
