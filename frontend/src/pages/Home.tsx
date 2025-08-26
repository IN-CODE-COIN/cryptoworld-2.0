import type React from "react";
import { HeaderContain } from "../components/global/HeaderContain";
import { TopCryptos } from "../components/home/TopCryptos";
import { Features } from "../components/home/Features";
import { BannerHome } from "../components/home/BannerHome";

export const Home: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto gap-8">
      <HeaderContain pageKey="home" />
      <BannerHome />
      <Features />
      <TopCryptos />
    </section>
  );
};
