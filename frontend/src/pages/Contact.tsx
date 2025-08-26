import type React from "react";
import { FormContact } from "../components/contact/FormContact";
import { HeaderContain } from "../components/global/HeaderContain";

export const Contact: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="contact" />
      <FormContact />
    </section>
  );
};
