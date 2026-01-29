import type React from "react";
import { CryptoDetail } from "../components/detailsCrypto/CryptoDetail";

export const Crypto: React.FC = () => {
  return (
    <section className="w-full">
      <CryptoDetail />
    </section>
  );
};
