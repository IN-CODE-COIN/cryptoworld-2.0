import { useState } from "react";
import { Button, Grid } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthModal } from "../auth/AuthModal";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const { useBreakpoint } = Grid;

export const AuthButton = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isMobile = useBreakpoint().xs;

  const sizeIcon = isAuthenticated ? undefined : isMobile ? "small" : undefined;
  return (
    <>
      <Button
        type={theme === "dark" ? "primary" : "default"}
        shape={isAuthenticated ? "circle" : "default"}
        icon={isAuthenticated ? <UserOutlined /> : undefined}
        title={
          isAuthenticated ? "Cerrar sesión" : "Iniciar sesión o registrarse"
        }
        size={sizeIcon}
        onClick={() => setOpen(true)}
      >
        {isAuthenticated ? "" : "Iniciar sesión"}
      </Button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
