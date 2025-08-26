import { Modal } from "antd";
import { useAuth } from "../../hooks/useAuth";

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
};

export const LogoutModal = ({ open, onClose }: LogoutModalProps) => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isAuthenticated) return null;
  return (
    <Modal
      title="¿Cerrar sesión?"
      open={open}
      onCancel={onClose}
      onOk={handleLogout}
      okText="Cerrar sesión"
      cancelText="Cancelar"
      centered
    ></Modal>
  );
};
