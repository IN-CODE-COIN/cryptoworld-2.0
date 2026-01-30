import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { isAuthenticated } from "../../hooks/AuthHelpers";
import { AuthModal } from "../auth/AuthModal";
import { motion } from "framer-motion";
import {
  badgeVariants,
  headingVariants,
  paragraphVariants,
  ctaButtonVariants,
  statsVariants,
} from "../../config/animationVariants";

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
          ? "bg-linear-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-linear-to-br from-white via-blue-50 to-white"
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
        <div className="absolute inset-0 bg-linear-to-t from-transparent via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500 border-opacity-20 bg-blue-500 bg-opacity-10"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-blue-500 font-medium">
            Plataforma de Análisis de Criptomonedas
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
        >
          <span className={theme === "dark" ? "text-white" : "text-gray-900"}>
            Monitorea tu
            <br />
          </span>
          <span className="bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            Portafolio Cripto
          </span>
        </motion.h1>

        {/* Subheading */}
         <motion.p
           variants={paragraphVariants}
           initial="hidden"
           animate="visible"
           className={`text-xl md:text-2xl mb-8 ${
             theme === "dark" ? "text-gray-400" : "text-gray-600"
           } max-w-2xl mx-auto`}
         >
           Análisis en tiempo real, listas de seguimiento personalizadas y gráficos detallados de tu cartera, todo en un solo lugar.
         </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={ctaButtonVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.button
            variants={ctaButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              if (isAuth) {
                navigate("/home");
              } else {
                setAuthModalOpen(true);
              }
            }}
            className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            {isAuth ? "Ir al Dashboard" : "Comenzar Ahora"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <motion.div
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              14.000+
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Criptos Disponibles
            </p>
          </motion.div>
          <motion.div
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Plan Gratuito
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Muy Completo
            </p>
          </motion.div>
          <motion.div
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              99.9%
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Uptime
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </section>
  );
};
