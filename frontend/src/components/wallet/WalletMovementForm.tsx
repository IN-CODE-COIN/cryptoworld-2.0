import React, { useEffect, useState } from "react";
import { Form, InputNumber, Select, Input, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../../lib/axios";
import { useTheme } from "../../hooks/useTheme";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

interface WalletCreateResponse {
  balance: number;
}

interface MovementForm {
  type: "deposito" | "retirada";
  amount: number;
  method: "transfer" | "card" | "paypal";
  description?: string;
}

export const WalletMovementForm: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [form] = Form.useForm();

  useEffect(() => {
    api
      .get<WalletCreateResponse>("/cartera/create")
      .then((res) => setBalance(res.data.balance))
      .catch(() => message.error("Error al cargar el saldo"))
      .finally(() => setLoading(false));
  }, []);

  const onFinish = async (values: MovementForm) => {
    try {
      const res = await api.post("/cartera", values);
      message.success(
        res.data.message || "Movimiento registrado correctamente",
      );
      navigate("/cartera");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMsg =
        err.response?.data?.message || "Error al guardar el movimiento";
      message.error(errorMsg);
    }
  };

  if (loading) return <Spin tip="Cargando..." fullscreen={true} size="large" />;

  return (
    <section className="w-full space-y-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-emerald-600 mb-2">
            Ingresar / Retirar
          </h1>
          <p
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Gestiona tus movimientos de efectivo
          </p>
        </div>
        <Button
          type="text"
          onClick={() => navigate("/cartera")}
          className="ml-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          ← Volver
        </Button>
      </div>

      {/* Balance Card */}
      <div
        className={`rounded-xl border p-6 lg:p-8 ${
          theme === "dark"
            ? "bg-linear-to-r from-green-900/20 to-emerald-900/20 border-green-700/50"
            : "bg-linear-to-r from-green-50 to-emerald-50 border-green-200"
        }`}
      >
        <p
          className={`text-sm font-medium mb-2 ${
            theme === "dark" ? "text-green-300" : "text-green-700"
          }`}
        >
          Saldo disponible
        </p>
        <h3 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-600 to-emerald-600">
          $
          {balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h3>
      </div>

      {/* Form */}
      <div
        className={`rounded-xl border p-6 lg:p-8 ${
          theme === "dark"
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: "deposito", method: "transfer" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="deposito">Ingreso</Select.Option>
                <Select.Option value="retirada">Retirada</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Cantidad ($)"
              name="amount"
              rules={[{ required: true, message: "Ingrese una cantidad" }]}
            >
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.00"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              label="Método"
              name="method"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="transfer">Transferencia</Select.Option>
                <Select.Option value="card">Tarjeta</Select.Option>
                <Select.Option value="paypal">PayPal</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Descripción (opcional)" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Escribe una nota opcional..."
            />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-3">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 border-none h-10"
              >
                Guardar movimiento
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/cartera")}
                className="h-10"
              >
                Cancelar
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};
