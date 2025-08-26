import type React from "react";
import { HeaderContain } from "../components/global/HeaderContain";
import { ListIndex } from "../components/watchlist/ListIndex";

export const Watchlist: React.FC = () => {
  return (
    <section className="container md:w-5xl flex flex-col mx-auto">
      <HeaderContain pageKey="watchlist" />
      <ListIndex />
    </section>
  );
};
