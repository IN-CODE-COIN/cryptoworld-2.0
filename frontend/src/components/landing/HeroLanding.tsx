import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { isAuthenticated } from "../../hooks/AuthHelpers";
import { AuthModal } from "../auth/AuthModal";

export const HeroLanding = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <section
      id="hero"
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-white via-blue-50 to-white"
      }`}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-grid-dark" : "bg-grid-light"
          }`}
          style={{
            backgroundImage:
              theme === "dark"
                ? `radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`
                : `radial-gradient(circle, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 border-opacity-20 bg-blue-500 bg-opacity-10">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-blue-500 font-medium">
            Plataforma de Análisis de Criptomonedas
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          <span
            className={
              theme === "dark" ? "text-white" : "text-gray-900"
            }
          >
            Monitorea tu
            <br />
          </span>
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            Portafolio Cripto
          </span>
        </h1>

        {/* Subheading */}
        <p
          className={`text-xl md:text-2xl mb-8 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-600"
          } max-w-2xl mx-auto`}
        >
          Análisis en tiempo real, seguimiento de tus inversiones y las últimas noticias del mercado cripto, todo en un solo lugar.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => {
              if (isAuth) {
                navigate("/home");
              } else {
                setAuthModalOpen(true);
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 transform hover:scale-105"
          >
            {isAuth ? "Ir al Dashboard" : "Comenzar Ahora"}
          </button>
          <button
            onClick={() => {
              const element = document.querySelector("#pricing");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`px-8 py-4 rounded-lg font-semibold border-2 transition-all duration-300 ${
              theme === "dark"
                ? "border-gray-700 text-white hover:bg-gray-800"
                : "border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            Ver Planes
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              1000+
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Criptos Monitoreadas
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              10000+
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Usuarios Activos
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              99.9%
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Uptime
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </section>
  );
};
