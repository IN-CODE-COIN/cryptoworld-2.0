import {
  HomeOutlined,
  FileTextOutlined,
  MailOutlined,
  DollarOutlined,
  ToolOutlined,
  BarChartOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

export type NavItem = {
  key: string;
  path?: string;
  label: string;
  icon?: React.ReactNode;
  i18nKey?: string;
  children?: NavItem[];
  protected?: boolean;
  action?: string;
};

export const navItems: NavItem[] = [
  {
    key: "1",
    path: "/home",
    label: "Home",
    icon: <HomeOutlined />,
    i18nKey: "Inicio",
  },
  {
    key: "2",
    path: "/watchlist",
    label: "Lista de Seguimiento",
    icon: <UnorderedListOutlined />,
    i18nKey: "Lista de Seguimiento",
    protected: true,
  },
  {
    key: "3",
    path: "/cartera",
    label: "Cartera",
    icon: <BarChartOutlined />,
    i18nKey: "Cartera",
    protected: true,
  },
  {
    key: "4",
    path: "/pricing",
    label: "Planes",
    icon: <DollarOutlined />,
    i18nKey: "Planes",
  },
  {
    key: "5",
    path: "/settings",
    label: "Configuración",
    icon: <ToolOutlined />,
    i18nKey: "Configuración",
    protected: true,
  },
  {
    key: "6",
    path: "/contact",
    label: "Contacto",
    icon: <MailOutlined />,
    i18nKey: "Contacto",
  },
  {
    key: "7",
    path: "/legal",
    label: "Aviso Legal",
    icon: <FileTextOutlined />,
    i18nKey: "Aviso Legal",
  },
  {
    key: "8",
    label: "Buscar",
    icon: <SearchOutlined />,
    i18nKey: "Buscar",
    action: "searchModal",
  },
];
