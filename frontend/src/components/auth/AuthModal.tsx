import { Modal, Button } from "antd";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { LogoutOutlined } from "@ant-design/icons";

type AuthMode = "login" | "register" | "logout";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const { isAuthenticated, logout, user } = useAuth();
  const { theme } = useTheme();

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      centered
      width={420}
      styles={{
        content: {
          padding: 0,
          borderRadius: "12px",
        },
      }}
    >
      {isAuthenticated ? (
        <div
          className={`rounded-xl overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div
            className={`px-6 py-8 border-b ${
              theme === "dark"
                ? "bg-linear-to-r from-red-900/20 to-orange-900/20 border-gray-700"
                : "bg-linear-to-r from-red-50 to-orange-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 mx-auto mb-3">
              <LogoutOutlined className="text-2xl text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
              Cerrar sesión
            </h2>
            <p
              className={`text-center text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ¿Estás seguro de que quieres cerrar sesión, {user?.name}?
            </p>
          </div>
          <div className="px-6 py-4 space-y-3">
            <Button
              type="primary"
              danger
              size="large"
              className="w-full"
              onClick={handleLogout}
            >
              Sí, cerrar sesión
            </Button>
            <Button size="large" className="w-full" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : mode === "login" ? (
        <LoginForm onClose={onClose} onSwitch={toggleMode} />
      ) : (
        <RegisterForm onClose={onClose} onSwitch={toggleMode} />
      )}
    </Modal>
  );
};
