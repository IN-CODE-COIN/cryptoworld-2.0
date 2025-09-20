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
    <div className="w-full flex justify-start">
      <Form
        form={form}
        layout="vertical"
        name="contact-form"
        onFinish={onFinish}
        className="w-full max-w-lg xl:max-w-2xl"
      >
        <Form.Item
          name={["user", "name"]}
          label={
            <span className="text-gray-900 dark:text-gray-100">Nombre</span>
          }
          rules={[{ required: true, message: "¡El nombre es obligatorio!" }]}
        >
          <Input
            size="middle"
            className="dark:placeholder-gray-400"
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              color: theme === "dark" ? "#fff" : "#000",
              borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
            }}
          />
        </Form.Item>

        <Form.Item
          name={["user", "email"]}
          label={
            <span className="text-gray-900 dark:text-gray-100">
              Correo electrónico
            </span>
          }
          rules={[
            { type: "email", message: "¡El correo electrónico no es válido!" },
            {
              required: true,
              message: "¡El correo electrónico es obligatorio!",
            },
          ]}
        >
          <Input
            size="middle"
            className="dark:placeholder-gray-400"
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              color: theme === "dark" ? "#fff" : "#000",
              borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
            }}
          />
        </Form.Item>

        <Form.Item
          name={["user", "message"]}
          label={
            <span className="text-gray-900 dark:text-gray-100">Mensaje</span>
          }
          rules={[{ required: true, message: "¡El mensaje es obligatorio!" }]}
        >
          <Input.TextArea
            rows={5}
            className="dark:placeholder-gray-400"
            style={{
              backgroundColor: theme === "dark" ? "#374151" : "white",
              color: theme === "dark" ? "#fff" : "#000",
              borderColor: theme === "dark" ? "#4b5563" : "#d1d5db",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="flex max-w-max"
            loading={loading}
            disabled={loading || hasErrors() || isEmpty}
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
