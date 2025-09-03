import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Select,
  Input,
  Button,
  message,
  Spin,
  Tag,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../../lib/axios";

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
        res.data.message || "Movimiento registrado correctamente"
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
    <section className="container md:w-5xl flex flex-col mx-auto">
      <div className="text-left max-w-xl mb-10">
        <Tag bordered color="blue" className="max-w-max font-semibold">
          <span className="uppercase"> Efectivo </span>
        </Tag>
        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100">
          Ingresar / Retirar
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium text-wrap">
          Añade tus movimientos de efectivo y obten un control para las compras
          y ventas de cryptomonedas.
        </p>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-2xl text-gray-800 flex items-center gap-4 dark:text-gray-100 mb-2">
          Nuevo movimiento
        </h3>
        <Button
          size="small"
          title="Volver a la cartera"
          onClick={() => navigate("/cartera")}
        >
          Volver
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
        <p className="text-sm text-gray-500 mb-4">
          Saldo disponible:{" "}
          <strong>
            $
            {balance.toLocaleString("es-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            })}
          </strong>
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: "deposito", method: "transfer" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Form.Item label="Método" name="method" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="transfer">Transferencia</Select.Option>
              <Select.Option value="card">Tarjeta</Select.Option>
              <Select.Option value="paypal">PayPal</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Descripción (opcional)" name="description">
            <Input.TextArea
              rows={3}
              placeholder="Escribe una nota opcional..."
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="small"
              title="Guardar"
              htmlType="submit"
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};
