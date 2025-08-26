import { Modal, Button } from "antd";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "../../hooks/useAuth";

type AuthMode = "login" | "register" | "logout";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const { isAuthenticated, logout } = useAuth();

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
    >
      {isAuthenticated ? (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">¿Cerrar sesión?</h2>
          <p>¿Estás seguro de que quieres cerrar sesión?</p>
          <Button type="primary" danger onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      ) : mode === "login" ? (
        <LoginForm onClose={onClose} onSwitch={toggleMode} />
      ) : (
        <RegisterForm onClose={onClose} onSwitch={toggleMode} />
      )}
    </Modal>
  );
};
