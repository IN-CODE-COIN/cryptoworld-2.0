import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";
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
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Crear cuenta</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Por favor ingresa un nombre" }]}
        >
          <Input placeholder="User" />
        </Form.Item>

        <Form.Item
          label="Correo"
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
          <Input placeholder="user@email.com" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Por favor ingresa una contraseña" },
            {
              min: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
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
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
        </Form.Item>

        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={onSwitch}
          >
            Iniciar sesión
          </span>
        </p>
      </Form>
    </>
  );
};
