import type React from "react";
import { HeaderContain } from "../components/global/HeaderContain";
import { CryptoDetail } from "../components/detailsCrypto/CryptoDetail";

export const Crypto: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="crypto" />
      <CryptoDetail />
    </section>
  );
};
