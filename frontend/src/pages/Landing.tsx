import { LandingLayout } from "../components/landing/LandingLayout";
import { HeroLanding } from "../components/landing/HeroLanding";
import { ServicesLanding } from "../components/landing/ServicesLanding";
import { TopCryptosTable } from "../components/landing/TopCryptosTable";
import { Pricing } from "./Pricing";
import { Contact } from "./Contact";

export const Landing = () => {
  return (
    <LandingLayout>
      <HeroLanding />
      <ServicesLanding />
      <section id="top-cryptos" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TopCryptosTable limit={5} showViewMore={true} />
        </div>
      </section>
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Pricing />
        </div>
      </section>
      <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Contact />
        </div>
      </section>
    </LandingLayout>
  );
};
