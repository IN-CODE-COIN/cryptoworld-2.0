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
    <section className="mt-20 flex flex-col xl:flex-row justify-between lg:gap-4 gap-8 mx-auto">
      <div className="w-full xl:w-1/2 lg:pr-10">
        <h2 className="tracking-tight text-2xl font-semibold text-gray-900 dark:text-white">
          Preguntas frecuentes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          ¿No encuentras la respuesta que buscas? No dudes en ponerte en
          contacto con nuestro{" "}
          <Link
            to="/contact"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            equipo de soporte
          </Link>
          .
        </p>
      </div>
      <div className="w-full xl:w-1/2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <button
              className="flex justify-between items-center w-full py-4 text-left font-medium text-gray-900 dark:text-white"
              onClick={() => toggleItem(index)}
            >
              <span className="flex items-center">{faq.question}</span>
              <DownOutlined
                className={`transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="pb-4">
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
