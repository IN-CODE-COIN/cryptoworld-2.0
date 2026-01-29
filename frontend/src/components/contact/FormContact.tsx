import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useTheme } from "../../hooks/useTheme";
import emailjs from "@emailjs/browser";

type ContactFormValues = {
  user: {
    name: string;
    email: string;
    message: string;
  };
};

export const FormContact: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); //instancia del formulario

  const onFinish = (values: ContactFormValues) => {
    setLoading(true);

    const service_id = import.meta.env.VITE_SERVICE_ID;
    const template_id = import.meta.env.VITE_TEMPLATE_ID;
    const public_id = import.meta.env.VITE_PUBLIC_ID;

    const templateParams = {
      from_name: values.user.name,
      user_email: values.user.email,
      message: values.user.message,
    };

    emailjs
      .send(service_id, template_id, templateParams, public_id)
      .then(() => {
        message.success("¡Correo enviado correctamente!");
        form.resetFields();
      })
      .catch(() => {
        message.error("Error al enviar el correo. Intenta nuevamente.");
      })
      .finally(() => setLoading(false));
  };

  const values = Form.useWatch("user", form);

  const hasErrors = () => {
    return form.getFieldsError().some(({ errors }) => errors.length > 0);
  };

  const isEmpty =
    !values?.name?.trim() || !values?.email?.trim() || !values?.message?.trim();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-12 text-center max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Contacta con Nosotros
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ¿Tienes alguna pregunta? Nos encantaría saber de ti. Envía un mensaje y nos pondremos en contacto lo antes posible.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        name="contact-form"
        onFinish={onFinish}
        className="w-full max-w-2xl"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Form.Item
            name={["user", "name"]}
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </span>
            }
            rules={[{ required: true, message: "¡El nombre es obligatorio!" }]}
            className="mb-0"
          >
            <Input
              size="large"
              placeholder="Tu nombre"
              className={`rounded-lg ${
                theme === "dark"
                  ? "dark:bg-gray-700 dark:border-gray-600"
                  : "bg-gray-50 border-gray-300"
              }`}
              style={{
                backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
                color: theme === "dark" ? "#fff" : "#000",
                borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
              }}
            />
          </Form.Item>

          <Form.Item
            name={["user", "email"]}
            label={
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico
              </span>
            }
            rules={[
              { type: "email", message: "¡El correo electrónico no es válido!" },
              {
                required: true,
                message: "¡El correo electrónico es obligatorio!",
              },
            ]}
            className="mb-0"
          >
            <Input
              size="large"
              placeholder="tu@email.com"
              className={`rounded-lg ${
                theme === "dark"
                  ? "dark:bg-gray-700 dark:border-gray-600"
                  : "bg-gray-50 border-gray-300"
              }`}
              style={{
                backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
                color: theme === "dark" ? "#fff" : "#000",
                borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
              }}
            />
          </Form.Item>
        </div>

        <Form.Item
          name={["user", "message"]}
          label={
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mensaje
            </span>
          }
          rules={[{ required: true, message: "¡El mensaje es obligatorio!" }]}
          className="mt-4"
        >
          <Input.TextArea
            rows={6}
            placeholder="Cuéntanos qué necesitas..."
            className={`rounded-lg ${
              theme === "dark"
                ? "dark:bg-gray-700 dark:border-gray-600"
                : "bg-gray-50 border-gray-300"
            }`}
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "#f9fafb",
              color: theme === "dark" ? "#fff" : "#000",
              borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
            }}
          />
        </Form.Item>

        <Form.Item className="mt-6 mb-0">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-400 border-0 rounded-lg font-semibold"
            loading={loading}
            disabled={loading || hasErrors() || isEmpty}
          >
            Enviar Mensaje
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
