import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { CheckCircleOutlined } from "@ant-design/icons";

export const PrivacyPolicy: React.FC = () => {
  const { theme } = useTheme();

  const sections = [
    {
      title: "Responsable del Tratamiento",
      content:
        "CryptoWorld es el responsable del tratamiento de tus datos personales. Nos comprometemos a proteger tu privacidad y a cumplir con todas las leyes aplicables de protección de datos.",
      items: [
        "Responsable: CryptoWorld",
        "Ubicación: España",
        "Tipo: Plataforma digital",
        "Actividad: Información sobre criptomonedas",
      ],
    },
    {
      title: "Datos que Recopilamos",
      content:
        "Recopilamos información que proporcionas directamente (como tu nombre y correo electrónico al registrarte) e información que se genera automáticamente al usar nuestra plataforma (como datos de navegación, dirección IP y cookies).",
      items: [
        "Datos de identificación",
        "Datos de contacto",
        "Datos de cuenta",
        "Datos de navegación",
      ],
    },
    {
      title: "Finalidad del Tratamiento",
      content:
        "Utilizamos tus datos para proporcionarte nuestros servicios, mejorar tu experiencia, enviar actualizaciones y comunicaciones relacionadas con la plataforma, y cumplir con obligaciones legales.",
      items: [
        "Prestación de servicios",
        "Mejora de plataforma",
        "Comunicaciones",
        "Cumplimiento legal",
      ],
    },
    {
      title: "Base Legal",
      content:
        "El tratamiento de tus datos se basa en tu consentimiento (que puedes retirar en cualquier momento), en la ejecución de un contrato, en el cumplimiento de obligaciones legales, y en nuestros intereses legítimos.",
      items: [
        "Consentimiento del usuario",
        "Ejecución de contrato",
        "Obligaciones legales",
        "Intereses legítimos",
      ],
    },
    {
      title: "Seguridad de Datos",
      content:
        "Implementamos medidas técnicas y organizativas para proteger tus datos contra acceso no autorizado, alteración, divulgación o destrucción. Utilizamos encriptación SSL, firewalls y auditorías de seguridad.",
      items: [
        "Encriptación SSL/TLS",
        "Firewalls de protección",
        "Auditorías de seguridad",
        "Acceso restringido",
      ],
    },
    {
      title: "Tus Derechos",
      content:
        "Tienes derecho a acceder, rectificar, suprimir tus datos, a solicitar la limitación del tratamiento, a oponerte y a la portabilidad de datos. Para ejercer estos derechos, contáctanos.",
      items: [
        "Derecho de acceso",
        "Derecho de rectificación",
        "Derecho al olvido",
        "Derecho a la portabilidad",
      ],
    },
    {
      title: "Cookies y Tecnologías Similares",
      content:
        "Utilizamos cookies y otras tecnologías de seguimiento para mejorar tu experiencia, analizar el uso de la plataforma y personalizar contenido. Puedes controlar las cookies a través de la configuración de tu navegador.",
      items: [
        "Cookies de sesión",
        "Cookies de análisis",
        "Cookies de preferencias",
        "Control del usuario",
      ],
    },
    {
      title: "Retención de Datos",
      content:
        "Conservamos tus datos personales solo el tiempo necesario para cumplir los propósitos para los cuales se recopilaron o lo que requiere la ley. Los datos inactivos se eliminarán después de 24 meses.",
      items: [
        "Retención según ley",
        "Eliminación después de inactividad",
        "Cumplimiento RGPD",
        "Acceso a historial",
      ],
    },
    {
      title: "Cambios en la Política",
      content:
        "Nos reservamos el derecho de actualizar esta política en cualquier momento. Te notificaremos sobre cambios significativos. Tu uso continuado de la plataforma después de las actualizaciones constituye tu aceptación.",
      items: [
        "Notificación de cambios",
        "Aceptación implícita",
        "Fecha de actualización",
        "Historial de versiones",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`rounded-xl border p-6 transition-all duration-300 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 hover:border-green-600"
              : "bg-white border-gray-200 hover:border-green-400"
          }`}
        >
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-green-400 mb-3">
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
                <CheckCircleOutlined className="text-green-500 shrink-0 mt-0.5" />
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

      {/* Contact Section */}
      <div
        className={`rounded-xl border-2 border-dashed p-6 ${
          theme === "dark"
            ? "bg-green-900/20 border-green-700"
            : "bg-green-50 border-green-200"
        }`}
      >
        <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
          Delegado de Protección de Datos
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Si tienes preguntas sobre cómo procesamos tus datos, puedes contactar
          con nuestro Delegado de Protección de Datos en{" "}
          <a
            href="mailto:privacidad@cryptoworld.com"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            privacidad@cryptoworld.com
          </a>
        </p>
      </div>
    </div>
  );
};
