import React from "react";
import {
  HomeOutlined,
  SettingOutlined,
  DollarOutlined,
  FileTextOutlined,
  MailOutlined,
  UnorderedListOutlined,
  SearchOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const routeMap: Record<
  string,
  { i18nKey: string; icon?: React.ReactNode; path?: string }
> = {
  "/": { i18nKey: "Inicio", icon: <HomeOutlined /> },
  "/cartera": { i18nKey: "Cartera", icon: <BarChartOutlined /> },
  "/watchlist": {
    i18nKey: "Lista de Seguimiento",
    icon: <UnorderedListOutlined />,
  },
  "/contact": { i18nKey: "Contacto", icon: <MailOutlined /> },
  "/pricing": { i18nKey: "Planes", icon: <DollarOutlined /> },
  "/settings": { i18nKey: "Configuración", icon: <SettingOutlined /> },
  "/legal": { i18nKey: "Aviso Legal", icon: <FileTextOutlined /> },
  "/crypto": { i18nKey: "Crypto", icon: <SearchOutlined /> },
};

type BreadcrumbProps = {
  style?: React.CSSProperties;
  separator?: boolean;
};

export const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ style }) => {
  const location = useLocation();

  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbPaths =
    pathSnippets.length === 0
      ? ["/"]
      : pathSnippets.map((_, index) => {
          return "/" + pathSnippets.slice(0, index + 1).join("/");
        });

  const items = breadcrumbPaths
    .map((path) => {
      const route = routeMap[path];
      if (!route) return null;
      return { path, route };
    })
    .filter((item) => item !== null);

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[items.length - 1];

  return (
    <div style={style} className="flex justify-center">
      <span className="inline-block px-3 py-1 rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold">
        {currentItem?.route.i18nKey}
      </span>
    </div>
  );
};
