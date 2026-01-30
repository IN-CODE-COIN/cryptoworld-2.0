import type React from "react";
import { useState } from "react";
import { ListIndex } from "../components/watchlist/ListIndex";
import { SearchCrypto } from "../components/global/SearchCrypto";
import { useTheme } from "../hooks/useTheme";

export const Watchlist: React.FC = () => {
  const { theme } = useTheme();
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2">
          Lista de Seguimiento
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Tus criptomonedas guardadas
        </p>
      </div>
      <ListIndex onOpenSearch={() => setSearchModalVisible(true)} />
      <SearchCrypto
        searchModalVisible={searchModalVisible}
        setSearchModalVisible={setSearchModalVisible}
      />
    </section>
  );
};
