import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { CheckCircleOutlined } from "@ant-design/icons";

export const LegalNotice: React.FC = () => {
  const { theme } = useTheme();

  const sections = [
    {
      title: "Identificación del Responsable",
      content:
        "En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa que el titular de esta plataforma es CryptoWorld, con domicilio en el territorio español. Puedes ponerte en contacto a través del correo electrónico contacto@cryptoworld.com.",
      items: [
        "Responsable: CryptoWorld",
        "Email: contacto@cryptoworld.com",
        "Jurisdicción: España",
      ],
    },
    {
      title: "Términos de Uso",
      content:
        "El acceso y uso de CryptoWorld está condicionado a la aceptación de estos términos y condiciones. El usuario se compromete a usar la plataforma de forma lícita y sin violar las leyes aplicables.",
      items: [
        "Uso lícito y responsable",
        "Cumplimiento de leyes vigentes",
        "Prohibición de actividades fraudulentas",
        "Respeto a derechos de terceros",
      ],
    },
    {
      title: "Protección de Datos",
      content:
        "Los datos personales facilitados por los usuarios se tratan de acuerdo con lo establecido en el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). El responsable garantiza la confidencialidad y seguridad de los datos.",
      items: [
        "Cumplimiento RGPD",
        "Cumplimiento LOPDGDD",
        "Encriptación de datos sensibles",
        "Auditorías de seguridad",
      ],
    },
    {
      title: "Finalidad del Tratamiento",
      content:
        "Los datos se utilizarán para la prestación de servicios, gestión de la cuenta de usuario, facturación y envío de comunicaciones relacionadas con el servicio. No se cederán a terceros sin consentimiento expreso del usuario.",
      items: [
        "Prestación de servicios",
        "Gestión de cuenta",
        "Facturación",
        "Soporte técnico",
      ],
    },
    {
      title: "Derechos del Usuario",
      content:
        "Los usuarios tienen derecho a acceder, rectificar, suprimir y portar sus datos, así como a oponerse o limitar su tratamiento. Para ejercer estos derechos, pueden enviar una solicitud al correo contacto@cryptoworld.com.",
      items: [
        "Derecho de acceso",
        "Derecho de rectificación",
        "Derecho al olvido",
        "Derecho a la portabilidad",
      ],
    },
    {
      title: "Propiedad Intelectual",
      content:
        "Todos los contenidos de esta plataforma, incluyendo textos, imágenes, logotipos y software, están protegidos por derechos de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.",
      items: [
        "Protección de marca registrada",
        "Protección de contenido",
        "Protección de código",
        "Derechos de autor",
      ],
    },
    {
      title: "Limitación de Responsabilidad",
      content:
        "CryptoWorld no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso de la plataforma. El usuario asume toda responsabilidad por el uso de la plataforma.",
      items: [
        "Uso bajo riesgo del usuario",
        "Sin garantía explícita",
        "Datos informativos",
        "Volatilidad de mercado",
      ],
    },
    {
      title: "Aviso de Riesgos",
      content:
        "La inversión en criptomonedas es de alto riesgo. Los precios pueden fluctuar significativamente y pueden resultar en pérdidas totales. Esta plataforma es solo informativa y no constituye asesoramiento financiero.",
      items: [
        "Mercado volátil",
        "Sin garantías de rendimiento",
        "Información solo referencial",
        "Consulta a expertos",
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
              ? "bg-gray-800 border-gray-700 hover:border-blue-600"
              : "bg-white border-gray-200 hover:border-blue-400"
          }`}
        >
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-3">
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
                <CheckCircleOutlined className="text-blue-500 flex-shrink-0 mt-0.5" />
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
            ? "bg-blue-900/20 border-blue-700"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
          Contacto para Consultas Legales
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Si tienes preguntas sobre estos términos, puedes contactarnos en{" "}
          <a
            href="mailto:contacto@cryptoworld.com"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            contacto@cryptoworld.com
          </a>
        </p>
      </div>
    </div>
  );
};
