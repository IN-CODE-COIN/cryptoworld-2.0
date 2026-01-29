import { useState } from "react";
import { Button, Grid, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined, CreditCardOutlined } from "@ant-design/icons";
import { AuthModal } from "../auth/AuthModal";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";

const { useBreakpoint } = Grid;

type AuthButtonProps = {
  collapsed?: boolean;
};

export const AuthButton = ({ collapsed = false }: AuthButtonProps) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const isMobile = useBreakpoint().xs;
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
          <p className="text-xs mt-1">
            <span className={`inline-block px-2 py-0.5 rounded-full text-white font-semibold ${
              user?.rol === "pro" 
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500" 
                : "bg-gradient-to-r from-blue-600 to-blue-500"
            }`}>
              {user?.rol === "pro" ? "Plan Profesional" : "Plan Gratuito"}
            </span>
          </p>
        </div>
      ),
      selectable: false,
    },
    { type: "divider" },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configuración",
      onClick: () => navigate("/settings"),
    },
    {
      key: "pricing",
      icon: <CreditCardOutlined />,
      label: "Planes",
      onClick: () => navigate("/pricing"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: () => setOpen(true),
      danger: true,
    },
  ];

  if (isAuthenticated) {
    return (
      <>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div className="cursor-pointer">
            <div
              className={`flex items-center justify-center rounded-lg transition-all ${
                isMobile ? "p-1.5" : collapsed ? "p-2" : "gap-2 px-3 py-2"
              } ${
                theme === "dark"
                  ? "hover:bg-gray-700 bg-gray-800 border border-gray-700"
                  : "hover:bg-gray-100 bg-white border border-gray-200"
              }`}
            >
              <div className={`flex items-center ${!isMobile && !collapsed && "gap-2"}`}>
                <div className={`rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                }`}>
                  <UserOutlined className={`text-white ${isMobile ? "text-xs" : "text-sm"}`} />
                </div>
                {!isMobile && !collapsed && (
                  <span className={`text-sm font-medium truncate max-w-32 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-900"
                  }`}>
                    {user?.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Dropdown>
        <AuthModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Button
        type="primary"
        size={isMobile ? "small" : "middle"}
        className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 font-semibold shadow-lg hover:shadow-xl transition-all"
        icon={<UserOutlined />}
        onClick={() => setOpen(true)}
      >
        {isMobile ? "" : "Iniciar sesión"}
      </Button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
