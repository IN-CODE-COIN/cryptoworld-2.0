import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Card } from "antd";

type BannerData = {
  title: string;
  description: string;
  linkText: string;
  href: string;
};

const data: BannerData[] = [
  {
    title: "Regístrate",
    description: "Nombre, correo electrónico y contraseña.",
    linkText: "Al registro",
    href: "#",
  },
  {
    title: "Nuestros planes",
    description: "Tenemos planes para cualquier presupuesto.",
    linkText: "Descubrir planes",
    href: "#",
  },
  {
    title: "Buscador de criptomonedas",
    description:
      "No te hace falta estar registrado. Busca y compara criptomonedas.",
    linkText: "Buscar criptomonedas",
    href: "#",
  },
];

export const BannerHome: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(() => {
    if (isAuthenticated) return false;
    return localStorage.getItem("bannerClosed") !== "true";
  });

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("bannerClosed", "true");
  };

  return !isAuthenticated && isOpen ? (
    <Card
      className="mx-auto w-full max-w-6xl relative"
      style={{ marginBottom: "1rem", border: "1px solid #e3e3e0" }}
    >
      <div className="absolute top-0 right-0 p-3">
        <button
          type="button"
          title="Cerrar"
          className="p-2 text-gray-500"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          <CloseOutlined className="text-base" aria-hidden={true} />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        Regístrate o inicia sesión
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Para disfrutar de una experiencia completa de nuestra plataforma de
        criptomonedas regístrate o inicia sesión. Lo tienes al alcance de un
        clic.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-start justify-between border-l-2 border-blue-100 py-1 pl-4"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </div>
            <a
              href={item.href}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {item.linkText} &#8594;
            </a>
          </div>
        ))}
      </div>
    </Card>
  ) : null;
};
