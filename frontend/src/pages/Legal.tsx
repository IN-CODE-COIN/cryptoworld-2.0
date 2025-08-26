import type React from "react";
import { HeaderContain } from "../components/global/HeaderContain";
import { LegalNotice } from "../components/legal/LegalNotice";

export const Legal: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="legal" />
      <LegalNotice />
    </section>
  );
};
