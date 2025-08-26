import type React from "react";
import { HeaderContain } from "../components/global/HeaderContain";
import { Wallet } from "../components/wallet/Wallet";

export const Cartera: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="cartera" />
      <Wallet />
    </section>
  );
};
