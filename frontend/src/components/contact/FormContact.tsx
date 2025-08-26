import React from "react";
import { Button, Form, Input } from "antd";
import { useTheme } from "../../hooks/useTheme";

type ContactFormValues = {
  user: {
    name: string;
    email: string;
    Message: string;
  };
  agreement: boolean;
};

export const FormContact: React.FC = () => {
  const { theme } = useTheme();

  const onFinish = (values: ContactFormValues) => {
    console.log(values);
  };

  return (
    <div className="w-full flex justify-start">
      <Form
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
          rules={[
            {
              required: true,
              message: "¡El nombre es obligatorio!",
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
          name={["user", "email"]}
          label={
            <span className="text-gray-900 dark:text-gray-100">
              Correo electrónico
            </span>
          }
          rules={[
            {
              type: "email",
              message: "¡El correo electrónico no es válido!",
            },
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
          name={["user", "Message"]}
          label={
            <span className="text-gray-900 dark:text-gray-100">Mensaje</span>
          }
          rules={[
            {
              required: true,
              message: "¡El mensaje es obligatorio!",
            },
          ]}
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
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
