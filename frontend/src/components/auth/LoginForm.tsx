import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../lib/axios";
import axios from "axios";

type LoginFormProps = {
  onClose?: () => void;
  onSwitch?: () => void;
};

export const LoginForm = ({ onClose, onSwitch }: LoginFormProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<{ email: string; password: string }>();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await api.post("/login", {
        email: values.email,
        password: values.password,
      });

      const { token, user } = response.data;
      login(token, user);

      message.success(`¡Bienvenid@ ${user.name}!`);
      form.resetFields();
      onClose?.();
      setTimeout(() => navigate("/home"), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError?.(error)) {
        const response = error.response;
        if (response?.status === 401) {
          message.error("Credenciales inválidas");
        } else {
          message.error("Error inesperado.");
        }
      } else {
        message.error("Error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-xl overflow-hidden ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div
        className={`px-6 py-8 border-b ${
          theme === "dark"
            ? "bg-linear-to-r from-blue-900/20 to-indigo-900/20 border-gray-700"
            : "bg-linear-to-r from-blue-50 to-indigo-50 border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Iniciar sesión
        </h2>
        <p
          className={`text-center text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Accede a tu cuenta de CryptoWorld
        </p>
      </div>
      <div className="px-6 py-6">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label={
              <span className="text-sm font-medium">Correo electrónico</span>
            }
            name="email"
            rules={[
              { required: true, type: "email", message: "Correo inválido" },
            ]}
          >
            <Input
              size="large"
              placeholder="user@email.com"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium">Contraseña</span>}
            name="password"
            rules={[
              { required: true, message: "Por favor ingresa la contraseña" },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-linear-to-r from-blue-600 to-blue-500"
              loading={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </Form.Item>
        </Form>

        <div
          className={`text-center text-sm py-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            ¿No tienes cuenta?{" "}
          </span>
          <button
            onClick={onSwitch}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
};
