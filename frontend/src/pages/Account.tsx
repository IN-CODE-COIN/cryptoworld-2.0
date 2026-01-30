import type React from "react";
import { SettingsAccount } from "../components/setting/SettingsAccount";
import { useTheme } from "../hooks/useTheme";

export const Account: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="w-full space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2">
          Configuración
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Gestiona tu perfil y preferencias
        </p>
      </div>
      <SettingsAccount />
    </section>
  );
};
