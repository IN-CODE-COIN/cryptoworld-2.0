import { TopCryptosTable } from "../components/landing/TopCryptosTable";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  UnorderedListOutlined,
  BarChartOutlined,
  ToolOutlined,
  MailOutlined,
} from "@ant-design/icons";

export const Home = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const shortcuts = [
    {
      icon: <UnorderedListOutlined className="text-2xl" />,
      title: "Lista de Seguimiento",
      desc: "Criptos guardadas",
      path: "/watchlist",
      color: "from-blue-600 to-blue-400",
    },
    {
      icon: <BarChartOutlined className="text-2xl" />,
      title: "Mi Cartera",
      desc: "Tus inversiones",
      path: "/cartera",
      color: "from-purple-600 to-purple-400",
    },
    {
      icon: <ToolOutlined className="text-2xl" />,
      title: "Configuración",
      desc: "Preferencias",
      path: "/settings",
      color: "from-emerald-600 to-emerald-400",
    },
    {
      icon: <MailOutlined className="text-2xl" />,
      title: "Contacto",
      desc: "¿Preguntas?",
      path: "/contact",
      color: "from-orange-600 to-orange-400",
    },
  ];

  return (
    <section className="w-full space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-2">
          Bienvenido, {user?.name}
        </h1>
        <p
          className={`${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Accesos rápidos y monitoreo de criptomonedas en tiempo real
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shortcuts.map((shortcut, idx) => (
          <button
            key={idx}
            onClick={() => navigate(shortcut.path)}
            className={`rounded-xl border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-left group flex items-center gap-4 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                : "bg-white border-gray-200 hover:border-blue-500"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${shortcut.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform`}
            >
              {shortcut.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold dark:text-white text-gray-900 text-sm">
                {shortcut.title}
              </h3>
              <p
                className={`text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {shortcut.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Top Cryptos Table */}
      <div className="w-full">
        <TopCryptosTable />
      </div>
    </section>
  );
};
