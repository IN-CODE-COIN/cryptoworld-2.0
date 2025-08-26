import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Form, Input, Button, message } from "antd";
import api from "../../lib/axios";
import axios from "axios";

type LoginFormProps = {
  onClose?: () => void;
  onSwitch?: () => void;
};

export const LoginForm = ({ onClose, onSwitch }: LoginFormProps) => {
  const [form] = Form.useForm<{ email: string; password: string }>();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Correo"
          name="email"
          rules={[
            { required: true, type: "email", message: "Correo inválido" },
          ]}
        >
          <Input placeholder="user@email.com" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Por favor ingresa la contraseña" },
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Form.Item>

        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={onSwitch}
          >
            Crear cuenta
          </span>
        </p>
      </Form>
    </>
  );
};
