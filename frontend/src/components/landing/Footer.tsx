import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

export const Footer = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Producto",
      links: [
        { label: "Características", href: "#services" },
        { label: "Precios", href: "#pricing" },
        { label: "Seguridad", href: "/" },
      ],
    },
    {
      title: "Empresa",
      links: [
        { label: "Acerca de", href: "/" },
        { label: "Blog", href: "/" },
        { label: "Contacto", href: "#contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacidad", href: "/legal" },
        { label: "Términos", href: "/legal" },
        { label: "Cookies", href: "/legal" },
      ],
    },
  ];

  const handleScroll = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer
      className={`${
        theme === "dark"
          ? "bg-gray-900 border-t border-gray-800"
          : "bg-white border-t border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo Column */}
          <div>
            <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
              CryptoWorld
            </div>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Tu plataforma de análisis y gestión de criptomonedas, confiable y
              segura.
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h4
                className={`font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleScroll(link.href)}
                      className={`text-sm transition-colors hover:text-blue-500 ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-blue-400"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className={`${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          } border-t my-8`}
        />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © {currentYear} CryptoWorld. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="#"
              className={`text-sm transition-colors hover:text-blue-500 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-blue-400"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Twitter
            </a>
            <a
              href="#"
              className={`text-sm transition-colors hover:text-blue-500 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-blue-400"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Discord
            </a>
            <a
              href="#"
              className={`text-sm transition-colors hover:text-blue-500 ${
                theme === "dark"
                  ? "text-gray-400 hover:text-blue-400"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
