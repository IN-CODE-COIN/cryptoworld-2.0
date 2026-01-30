import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { GithubOutlined, LinkedinOutlined, GlobalOutlined } from "@ant-design/icons";

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
        { label: "Contacto", href: "#contact" },
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
         {/* Footer First Section */}
         <div className="mb-8 grid md:grid-cols-2 gap-8 text-center md:text-left">
           {/* Logo & Description */}
           <div>
             <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
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

           {/* Links */}
           <div className="flex gap-6 justify-center md:justify-end flex-wrap">
             {footerLinks[0].links.map((link, index) => (
               <button
                 key={index}
                 onClick={() => handleScroll(link.href)}
                 className={`text-sm transition-colors hover:text-blue-500 ${
                   theme === "dark"
                     ? "text-gray-400 hover:text-blue-400"
                     : "text-gray-600 hover:text-blue-600"
                 }`}
               >
                 {link.label}
               </button>
             ))}
           </div>
         </div>

         {/* Divider */}
         <div
           className={`${
             theme === "dark" ? "border-gray-800" : "border-gray-200"
           } border-t my-8`}
         />

         {/* Footer Second Section */}
         <div className="grid md:grid-cols-2 gap-8 items-center">
           {/* Copyright */}
           <div className="text-center md:text-left">
             <p
               className={`text-sm ${
                 theme === "dark" ? "text-gray-400" : "text-gray-600"
               }`}
             >
               © {currentYear} CryptoWorld
             </p>
           </div>

           {/* Social Icons */}
           <div className="flex gap-4 justify-center md:justify-end">
             <a
               href="https://github.com/monsieurlopez"
               target="_blank"
               rel="noopener noreferrer"
               className={`transition-all duration-300 transform hover:scale-125 ${
                 theme === "dark"
                   ? "text-gray-400 hover:text-blue-400"
                   : "text-gray-500 hover:text-blue-600"
               }`}
               aria-label="GitHub"
             >
               <GithubOutlined style={{ fontSize: "1.5rem", color: "inherit" }} />
             </a>
             <a
               href="https://www.linkedin.com/in/lopez-ruiz-sergio/"
               target="_blank"
               rel="noopener noreferrer"
               className={`transition-all duration-300 transform hover:scale-125 ${
                 theme === "dark"
                   ? "text-gray-400 hover:text-blue-400"
                   : "text-gray-500 hover:text-blue-600"
               }`}
               aria-label="LinkedIn"
             >
               <LinkedinOutlined style={{ fontSize: "1.5rem", color: "inherit" }} />
             </a>
             <a
               href="https://serlopez.com/"
               target="_blank"
               rel="noopener noreferrer"
               className={`transition-all duration-300 transform hover:scale-125 ${
                 theme === "dark"
                   ? "text-gray-400 hover:text-blue-400"
                   : "text-gray-500 hover:text-blue-600"
               }`}
               aria-label="Sitio web"
             >
               <GlobalOutlined style={{ fontSize: "1.5rem", color: "inherit" }} />
             </a>
           </div>
         </div>
      </div>
    </footer>
  );
};
