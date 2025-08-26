import type React from "react";
import { SettingsAccount } from "../components/setting/SettingsAccount";
import { HeaderContain } from "../components/global/HeaderContain";

export const Account: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="account" />
      <SettingsAccount />
    </section>
  );
};
