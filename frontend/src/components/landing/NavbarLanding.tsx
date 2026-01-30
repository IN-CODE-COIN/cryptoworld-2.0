import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { isAuthenticated } from "../../hooks/AuthHelpers";
import { AuthModal } from "../auth/AuthModal";

export const NavbarLanding = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isAuth = isAuthenticated();

  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Servicios", href: "#services" },
    { label: "Precios", href: "#pricing" },
    { label: "Contacto", href: "#contact" },
  ];

  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`${
        theme === "dark"
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      } border-b sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CryptoWorld
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScroll(link.href)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuth ? (
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 space-y-2`}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScroll(link.href)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              {isAuth ? (
                <button
                  onClick={() => navigate("/home")}
                  className="w-full px-4 py-2 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full px-4 py-2 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  );
};
