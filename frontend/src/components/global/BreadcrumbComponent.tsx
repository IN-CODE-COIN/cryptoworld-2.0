import React from "react";
import { Breadcrumb } from "antd";
import type { BreadcrumbProps } from "antd";
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

type BreadcrumbItem = { title: React.ReactNode };

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
    .map((path): BreadcrumbItem | null => {
      const route = routeMap[path];
      if (!route) return null;

      return {
        title: (
          <span className="flex items-center gap-1 dark:text-gray-100 text-gray-600">
            {route.icon} {route.i18nKey}
          </span>
        ),
      };
    })
    .filter((item): item is BreadcrumbItem => item !== null);

  const customSeparator = (
    <span className="text-gray-600 dark:text-gray-100 font-semibold">
      {">"}
    </span>
  );

  return <Breadcrumb items={items} style={style} separator={customSeparator} />;
};
