import React from "react";

type FeaturesType = {
  title: string;
  subtitle: string;
  description: string;
};

const features: FeaturesType[] = [
  {
    title: "1. Búsqueda",
    subtitle: "Rápida y gratuita",
    description:
      "Busca información de más de 2000 criptomonedas en un solo lugar.",
  },
  {
    title: "2. Lista de Seguimiento",
    subtitle: "No pierdas detalle",
    description: "Organiza y monitorea tus criptomonedas de manera eficiente.",
  },
  {
    title: "3. Cartera",
    subtitle: "Control total",
    description:
      "Apunta todos los movimientos de tú cartera y controla el rendimiento.",
  },
  {
    title: "4. Gráficos",
    subtitle: "Visualización clara y detallada",
    description:
      "Información en un solo vistazo, con gráficos modernos e interactivos.",
  },
];

export const Features: React.FC = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl py-7">
        <dl className="grid grid-cols-4 gap-10">
          {features.map((item) => (
            <div
              key={item.title}
              className="col-span-full sm:col-span-2 lg:col-span-1"
            >
              <span className="rounded-lg bg-blue-50/50 px-3 py-1.5 font-semibold leading-4 tracking-tighter shadow-sm shadow-blue-500/20 ring-1 ring-blue-200/20 dark:bg-blue-900/20 dark:ring-blue-800/30 sm:text-sm">
                <span className="bg-gradient-to-b from-blue-400 to-blue-600 bg-clip-text text-transparent dark:from-blue-200 dark:to-blue-400">
                  {item.title}
                </span>
              </span>
              <dt className="mt-6 font-semibold text-gray-900 dark:text-gray-50">
                {item.subtitle}
              </dt>
              <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
};
