import { Tag } from "antd";
import { useLocation } from "react-router-dom";

type DescriptionsType = {
  [key: string]: {
    title: string;
    description: string;
  };
};

const descriptions: DescriptionsType = {
  home: {
    title: "Descubre nuestro sitio",
    description:
      "Bienvenido a tú nueva plataforma de consulta y gestión de carteras de criptomonedas.",
  },
  cartera: {
    title: "Gestión de Cartera",
    description:
      "Visualiza, analiza y administra tus activos en un solo lugar con claridad y control total.",
  },
  watchlist: {
    title: "Ordena tú lista como quieras",
    description:
      "Visualiza y administra tu lista de seguimiento de criptomonedas.",
  },
  pricing: {
    title: "Nuestros planes crecen contigo",
    description:
      "Planes que empoderan a tu equipo para lanzar sin fricciones. Nuestros modelos flexibles se adaptan a tu presupuesto.",
  },
  contact: {
    title: "¡Hablemos!",
    description:
      "Ya sea que tengas una pregunta, necesites soporte o quieras explorar cómo podemos ayudarte, estamos aquí para ti.",
  },
  legal: {
    title: "Aviso Legal y Política de Privacidad",
    description:
      "Estamos comprometidos con la transparencia y la seguridad de nuestros usuarios. A continuación, te proporcionamos un aviso legal para la plataforma de desarrollo de criptomonedas.",
  },
  account: {
    title: "Gestión de cuenta",
    description:
      "Controla la configuración de tu cuenta y gestiona tus preferencias — todo desde un solo lugar. Te lo ponemos fácil para que esté organizado y seguro.",
  },
  crypto: {
    title: "Detalles",
    description:
      "Búsqueda ilimiatada de información sobre cualquier cryptomoneda.",
  },
};

type HeaderContainProps = {
  pageKey: keyof typeof descriptions;
};

export const HeaderContain: React.FC<HeaderContainProps> = ({ pageKey }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "home";

  const readablePaths: Record<string, string> = {
    home: "Inicio",
    cartera: "Cartera",
    pricing: "Planes",
    settings: "Configuración",
    contact: "Contacto",
    legal: "Aviso Legal",
    watchlist: "Lista de Seguimiento",
  };

  const { title, description } = descriptions[pageKey] || {
    title: "Título no encontrado",
    description: "Descripción no disponible.",
  };

  return (
    <div className="text-left max-w-xl mb-10">
      <Tag bordered color="blue" className="max-w-max font-semibold">
        <span className="uppercase">{readablePaths[path] ?? path}</span>
      </Tag>
      <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium text-wrap">
        {description}
      </p>
    </div>
  );
};
