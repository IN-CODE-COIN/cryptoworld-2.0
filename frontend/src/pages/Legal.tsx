import type React from "react";
import { LegalNotice } from "../components/legal/LegalNotice";
import { PrivacyPolicy } from "../components/legal/PrivacyPolicy";
import { CookiePolicy } from "../components/legal/CookiePolicy";
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";
import {
  FileTextOutlined,
  SafetyOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

export const Legal: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"legal" | "privacy" | "cookies">(
    "legal",
  );

  const tabs = [
    {
      id: "legal",
      label: "Aviso Legal",
      icon: <FileTextOutlined className="text-lg" />,
    },
    {
      id: "privacy",
      label: "Política de Privacidad",
      icon: <SafetyOutlined className="text-lg" />,
    },
    {
      id: "cookies",
      label: "Política de Cookies",
      icon: <DatabaseOutlined className="text-lg" />,
    },
  ];

  return (
    <section className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2">
          Términos y Políticas
        </h1>
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Información legal, privacidad y políticas de uso de CryptoWorld
        </p>
      </div>

      {/* Tabs */}
      <div
        className={`rounded-xl border p-1 inline-flex gap-1 ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                : theme === "dark"
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {activeTab === "legal" && <LegalNotice />}
        {activeTab === "privacy" && <PrivacyPolicy />}
        {activeTab === "cookies" && <CookiePolicy />}
      </div>
    </section>
  );
};
