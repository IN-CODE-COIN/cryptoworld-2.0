import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { AxiosError } from "axios";

type RegisterFormProps = {
  onClose?: () => void;
  onSwitch?: () => void;
};

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = ({ onClose, onSwitch }: RegisterFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const [form] = Form.useForm<RegisterFormValues>();

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await api.post("/register", values);

      const { token, user } = response.data;
      login(token, user);

      message.success(`¡Bienvenid@ ${user.name}!`);
      form.resetFields();
      onClose?.();
      setTimeout(() => navigate("/home"), 500);
    } catch (error: unknown) {
      const err = error as AxiosError<{ email?: string; message?: string }>;

      if (err.response?.status === 422 && err.response.data?.email) {
        message.error(err.response.data.email[0]);
      } else if (err.response?.status === 422) {
        message.error("Datos inválidos.");
      } else {
        message.error(err.response?.data?.message || "Error inesperado.");
      }

      console.error("Error en registro:", err);
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
            ? "bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-gray-700"
            : "bg-gradient-to-r from-green-50 to-emerald-50 border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Crear cuenta
        </h2>
        <p
          className={`text-center text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Únete a la comunidad de CryptoWorld
        </p>
      </div>
      <div className="px-6 py-6">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label={<span className="text-sm font-medium">Nombre</span>}
            name="name"
            rules={[{ required: true, message: "Por favor ingresa un nombre" }]}
          >
            <Input
              size="large"
              placeholder="Tu nombre completo"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium">Correo electrónico</span>}
            name="email"
            rules={[
              {
                type: "email",
                message: "Por favor ingresa un correo válido",
              },
              {
                required: true,
                message: "Por favor ingresa un correo",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="user@email.com"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-sm font-medium">Contraseña</span>}
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor ingresa una contraseña",
              },
              {
                min: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
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
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500"
              loading={loading}
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
          </Form.Item>
        </Form>

        <div
          className={`text-center text-sm py-4 border-t ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            ¿Ya tienes cuenta?{" "}
          </span>
          <button
            onClick={onSwitch}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-semibold transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
