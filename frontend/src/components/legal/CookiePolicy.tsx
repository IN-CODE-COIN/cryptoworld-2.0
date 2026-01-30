import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { CheckCircleOutlined } from "@ant-design/icons";

export const CookiePolicy: React.FC = () => {
  const { theme } = useTheme();

  const cookieTypes = [
    {
      title: "Cookies Técnicas",
      color: "blue",
      description:
        "Son necesarias para el funcionamiento básico de la plataforma. Sin ellas, algunos servicios solicitados pueden no funcionar correctamente.",
      items: [
        "Identificación de sesión",
        "Preferencias de usuario",
        "Datos de autenticación",
        "Configuración de idioma",
      ],
    },
    {
      title: "Cookies de Análisis",
      color: "purple",
      description:
        "Nos ayudan a entender cómo los usuarios interactúan con la plataforma para mejorar funcionalidades y rendimiento. Usamos Google Analytics.",
      items: [
        "Páginas visitadas",
        "Tiempo en la plataforma",
        "Interacciones de usuario",
        "Datos de rendimiento",
      ],
    },
    {
      title: "Cookies de Preferencias",
      color: "emerald",
      description:
        "Recuerdan tus preferencias y configuraciones como tema oscuro, idioma o notificaciones para personalizar tu experiencia.",
      items: [
        "Tema seleccionado",
        "Preferencias de notificación",
        "Historial de búsqueda",
        "Configuración de privacidad",
      ],
    },
    {
      title: "Cookies de Publicidad",
      color: "orange",
      description:
        "Se utilizan para mostrar anuncios relevantes y medir la efectividad de campañas publicitarias. Pueden compartirse con socios publicitarios.",
      items: [
        "Anuncios personalizados",
        "Rastreo de conversiones",
        "Historial de visualización",
        "Preferencias de publicidad",
      ],
    },
  ];

  const sections = [
    {
      title: "¿Qué son las Cookies?",
      content:
        "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas una web. Se utilizan para recordar información sobre ti y tu interacción con la plataforma.",
      items: [
        "Archivos de texto pequeños",
        "Almacenados en el navegador",
        "Persisten entre sesiones",
        "Pueden tener expiraciones",
      ],
    },
    {
      title: "¿Cómo Usamos las Cookies?",
      content:
        "Utilizamos cookies para múltiples propósitos: autenticación, seguridad, análisis de uso, preferencias de usuario y publicidad personalizada. Todas estas funciones mejoran tu experiencia.",
      items: [
        "Autenticación de usuarios",
        "Seguridad de cuenta",
        "Análisis de comportamiento",
        "Personalización de contenido",
      ],
    },
    {
      title: "Consentimiento de Cookies",
      content:
        "Al acceder a CryptoWorld, aceptas el uso de cookies según se describe en esta política. Puedes retirar tu consentimiento en cualquier momento a través de la configuración de tu navegador.",
      items: [
        "Consentimiento implícito",
        "Opción de rechazar",
        "Retiro en cualquier momento",
        "Control del usuario",
      ],
    },
    {
      title: "Gestión de Cookies",
      content:
        "La mayoría de navegadores te permiten controlar las cookies. Puedes eliminar cookies existentes o bloquear nuevas cookies. Te recomendamos mantener las cookies técnicas habilitadas.",
      items: [
        "Navegador Chrome",
        "Navegador Firefox",
        "Navegador Safari",
        "Navegador Edge",
      ],
    },
    {
      title: "Cookies de Terceros",
      content:
        "Algunos servicios en nuestra plataforma utilizan cookies de terceros (Google Analytics, proveedores de publicidad). Estos terceros siguen sus propias políticas de privacidad.",
      items: [
        "Google Analytics",
        "Redes sociales",
        "Proveedores publicitarios",
        "Servicios de análisis",
      ],
    },
    {
      title: "Cambios en la Política",
      content:
        "Nos reservamos el derecho de actualizar esta política de cookies. Los cambios significativos se notificarán con anticipación. Tu uso continuado implica aceptación de los cambios.",
      items: [
        "Notificación de cambios",
        "Período de gracia",
        "Aceptación automática",
        "Historial disponible",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cookie Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cookieTypes.map((type, index) => {
          const colorMap = {
            blue: {
              gradient: "from-blue-600 to-blue-400",
              icon: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-900/20",
              border: "border-blue-200 dark:border-blue-700",
              text: "text-blue-600 dark:text-blue-400",
            },
            purple: {
              gradient: "from-purple-600 to-purple-400",
              icon: "text-purple-500",
              bg: "bg-purple-50 dark:bg-purple-900/20",
              border: "border-purple-200 dark:border-purple-700",
              text: "text-purple-600 dark:text-purple-400",
            },
            emerald: {
              gradient: "from-emerald-600 to-emerald-400",
              icon: "text-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-900/20",
              border: "border-emerald-200 dark:border-emerald-700",
              text: "text-emerald-600 dark:text-emerald-400",
            },
            orange: {
              gradient: "from-orange-600 to-orange-400",
              icon: "text-orange-500",
              bg: "bg-orange-50 dark:bg-orange-900/20",
              border: "border-orange-200 dark:border-orange-700",
              text: "text-orange-600 dark:text-orange-400",
            },
          };

          const color = colorMap[type.color as keyof typeof colorMap];

          return (
            <div
              key={index}
              className={`rounded-xl border p-6 ${color.bg} ${color.border}`}
            >
              <h3
                className={`text-lg font-semibold bg-clip-text text-transparent bg-linear-to-r ${color.gradient} mb-2`}
              >
                {type.title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {type.description}
              </p>
              <div className="space-y-1">
                {type.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircleOutlined
                      className={`${color.icon} flex-shrink-0 mt-0.5`}
                    />
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`rounded-xl border p-6 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:border-amber-600"
                : "bg-white border-gray-200 hover:border-amber-400"
            }`}
          >
            <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-amber-600 to-amber-400 mb-3">
              {section.title}
            </h2>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {section.content}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircleOutlined className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div
        className={`rounded-xl border-2 border-dashed p-6 ${
          theme === "dark"
            ? "bg-amber-900/20 border-amber-700"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
          Preguntas sobre Cookies
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Si tienes preguntas sobre cómo usamos cookies, contáctanos en{" "}
          <a
            href="mailto:contacto@cryptoworld.com"
            className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
          >
            contacto@cryptoworld.com
          </a>
        </p>
      </div>
    </div>
  );
};
