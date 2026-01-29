import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Qué incluye el plan gratuito?",
      answer:
        "El plan gratuito te da acceso básico a la plataforma, con un número limitado de funcionalidades y sin coste mensual.",
    },
    {
      question: "¿Puedo activar un periodo de prueba del plan Profesional?",
      answer:
        "Sí, puedes activar un periodo de prueba de 7 días del plan Profesional. Este periodo solo puede usarse una vez por cuenta.",
    },
    {
      question: "¿Qué diferencia hay entre el plan el pago mensual y anual?",
      answer:
        "El plan mensual cuesta 50€/mes y el anual 490€/año, lo que supone un ahorro de más de 100€ al año. Ambos incluyen todas las funcionalidades premium.",
    },
    {
      question:
        "¿Cómo funciona la facturación y cuándo se realizan los cobros?",
      answer:
        "La facturación depende de la frecuencia que elijas (mensual o anual). El primer cobro se realiza al activar el plan, y después en cada renovación automática.",
    },
    {
      question: "¿Puedo cambiar de plan o cancelarlo en cualquier momento?",
      answer:
        "Sí, puedes cambiar tu plan en cualquier momento desde la sección de facturación. Si cancelas tu suscripción, conservarás el acceso hasta el final del periodo ya pagado.",
    },
  ];

  return (
    <section className="w-full flex flex-col items-center">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Preguntas Frecuentes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ¿No encuentras la respuesta? Contacta con nuestro{" "}
          <Link
            to="#contact"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            equipo de soporte
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4 max-w-3xl w-full">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-lg border transition-all duration-300 p-6 cursor-pointer ${
              openIndex === index
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
            }`}
            onClick={() => toggleItem(index)}
          >
            <button className="flex justify-between items-center w-full text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {faq.question}
              </h3>
              <DownOutlined
                className={`ml-4 flex-shrink-0 transition-transform duration-300 text-blue-600 dark:text-blue-400 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
