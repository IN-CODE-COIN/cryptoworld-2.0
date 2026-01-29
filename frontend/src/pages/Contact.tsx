import type React from "react";
import { FormContact } from "../components/contact/FormContact";

export const Contact: React.FC = () => {
  return (
    <section className="w-full" data-testid="contact-container">
      <FormContact />
    </section>
  );
};
