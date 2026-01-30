import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  InputNumber,
  Select,
  Input,
  Button,
  message,
  DatePicker,
  AutoComplete,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../../lib/axios";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { InputRef } from "antd";
import { useTheme } from "../../hooks/useTheme";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";

interface WalletTransactionFormValues {
  crypto_id: string;
  crypto_name: string;
  type: "buy" | "sell";
  date: Dayjs;
  amount_usd: number;
  price_usd: number;
  quantity: number;
  fees?: number;
}

interface WalletTransactionPayload {
  crypto_id: string;
  crypto_name: string;
  type: "buy" | "sell";
  date: string;
  amount_usd: number;
  price_usd: number;
  quantity: number;
  fees?: number;
}

type Coin = {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  amount: number;
};

export const WalletTransactionForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cryptoOptions, setCryptoOptions] = useState<Coin[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<Coin | null>(null);
  const [, setShowSuggestions] = useState(false);
  const [cryptosInWallet, setCryptosInWallet] = useState<Coin[]>([]);
  const { theme } = useTheme();

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const fetchCryptoSuggestions = async (query: string) => {
    if (query.length < 2) {
      setCryptoOptions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get(
        `/crypto/autocomplete?query=${encodeURIComponent(query)}`,
      );
      setCryptoOptions(res.data);
      setShowSuggestions(true);
    } catch {
      setCryptoOptions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriceAtDate = async (cryptoUuid: string, dateStr: string) => {
    if (!cryptoUuid || !dateStr) return;

    try {
      // Validar que el UUID no sea vacío
      if (!cryptoUuid || cryptoUuid.trim() === "") {
        console.warn("UUID inválido:", cryptoUuid);
        return;
      }

      const date = new Date(dateStr);
      const timestamp = Math.floor(date.getTime() / 1000); // Unix timestamp

      console.log("Fetching price for:", { cryptoUuid, dateStr, timestamp });

      const response = await api.get(`/coin/price`, {
        params: { uuid: cryptoUuid, timestamp },
      });

      console.log("Price response:", response.data);

      if (response.data?.status === "success" && response.data?.data?.price) {
        const price = parseFloat(response.data.data.price).toFixed(2);
        form.setFieldsValue({ price_usd: parseFloat(price) });
      } else if (response.data?.data?.price) {
        // Si hay precio pero sin "success" status
        const price = parseFloat(response.data.data.price).toFixed(2);
        form.setFieldsValue({ price_usd: parseFloat(price) });
      } else {
        form.setFieldsValue({ price_usd: undefined });
      }
    } catch (error) {
      // En caso de error, simplemente limpiar el campo
      console.error("Error fetching historical price:", error);
      form.setFieldsValue({ price_usd: undefined });
    }
  };

  const onFinish = async (values: WalletTransactionFormValues) => {
    try {
      const payload: WalletTransactionPayload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };
      const res = await api.post("/cartera/transaction", payload);
      message.success(res.data.message || "Transacción registrada");
      navigate("/cartera");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMsg =
        err.response?.data?.message || "Error al guardar la transacción";
      message.error(errorMsg);
    }
  };

  const updateQuantity = () => {
    const amount = form.getFieldValue("amount_usd");
    const price = form.getFieldValue("price_usd");
    if (
      amount &&
      price &&
      !isNaN(amount) &&
      amount > 0 &&
      !isNaN(price) &&
      price > 0
    ) {
      form.setFieldsValue({
        quantity: parseFloat((amount / price).toFixed(8)),
      });
    } else {
      form.setFieldsValue({ quantity: undefined });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current?.input &&
        !inputRef.current.input.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWalletCoins = async () => {
      try {
        const res = await api.get("/cartera");
        setCryptosInWallet(res.data.positions);
      } catch {
        setCryptosInWallet([]);
      }
    };
    fetchWalletCoins();
  }, []);

  return (
    <section className="w-full space-y-6 max-w-4xl mx-auto">
      {loading && (
        <Spin
          fullscreen={true}
          tip="Cargando..."
          size="large"
          className="fixed inset-0 flex items-center justify-center bg-white/50 z-50"
        />
      )}

      {/* Header with Back Button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            Registrar Transacción
          </h1>
          <p
            className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Compra o venta de criptomonedas
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
          initialValues={{ type: "buy", date: dayjs() }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item label="Tipo" name="type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="buy">Compra</Select.Option>
                <Select.Option value="sell">Venta</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Criptomoneda"
              name="crypto_name"
              rules={[
                { required: true, message: "Selecciona una criptomoneda" },
              ]}
            >
              {form.getFieldValue("type") === "buy" ? (
                <div className="relative">
                  <AutoComplete
                    aria-label="Criptomoneda"
                    value={form.getFieldValue("crypto_name")}
                    options={cryptoOptions.map((c) => {
                      return {
                        value: `${c.name} (${c.symbol})`,
                        label: (
                          <div
                            data-testid={`crypto-option-${c.symbol}`}
                            className="flex items-center gap-2"
                          >
                            <img src={c.iconUrl} alt={c.name} width={20} />{" "}
                            {c.name} ({c.symbol})
                          </div>
                        ),
                      };
                    })}
                    onSearch={fetchCryptoSuggestions}
                    onSelect={(value) => {
                      const selected = cryptoOptions.find(
                        (c) => `${c.name} (${c.symbol})` === value,
                      );
                      if (selected) {
                        setSelectedCrypto(selected);
                        form.setFieldsValue({
                          crypto_id: selected.uuid,
                          crypto_name: `${selected.name} (${selected.symbol})`,
                        });
                        const date = form.getFieldValue("date");
                        if (date)
                          fetchPriceAtDate(
                            selected.uuid,
                            date.format("YYYY-MM-DD"),
                          );
                      }
                      setShowSuggestions(false);
                    }}
                    placeholder="Busca una criptomoneda"
                    onFocus={() => {
                      if (form.getFieldValue("crypto_name")?.length >= 2)
                        setShowSuggestions(true);
                    }}
                  />
                </div>
              ) : (
                <Select
                  placeholder="Selecciona una criptomoneda de tu cartera"
                  onChange={(uuid) => {
                    const selected = cryptosInWallet.find(
                      (c) => c.uuid === uuid,
                    );
                    if (selected) {
                      setSelectedCrypto(selected);
                      form.setFieldsValue({
                        crypto_id: selected.uuid,
                        crypto_name: `${selected.symbol} - Nº de tokens: ${selected.amount}`,
                      });
                      const date = form.getFieldValue("date");
                      if (date)
                        fetchPriceAtDate(
                          selected.uuid,
                          date.format("YYYY-MM-DD"),
                        );
                    }
                  }}
                >
                  {cryptosInWallet.map((c) => (
                    <Select.Option key={c.uuid} value={c.uuid}>
                      {c.symbol} - Nº de tokens: {c.amount}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item name="crypto_id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              label="Fecha"
              name="date"
              rules={[{ required: true, message: "Selecciona una fecha" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                onChange={(date) => {
                  if (selectedCrypto && date)
                    fetchPriceAtDate(
                      selectedCrypto.uuid,
                      date.format("YYYY-MM-DD"),
                    );
                }}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              label="Cantidad (USD)"
              name="amount_usd"
              rules={[{ required: true, message: "Ingrese cantidad en USD" }]}
            >
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.00"
                onChange={updateQuantity}
              />
            </Form.Item>

            <Form.Item
              label="Precio por unidad (USD)"
              name="price_usd"
              rules={[{ required: true, message: "Ingrese el precio" }]}
              help="Se intenta autocompletar según la fecha. Si no aparece, ingresa manualmente."
            >
              <InputNumber
                min={0.01}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.00"
                onChange={updateQuantity}
              />
            </Form.Item>

            <Form.Item
              label="Cantidad (tokens)"
              name="quantity"
              rules={[{ required: true, message: "Ingrese la cantidad" }]}
            >
              <InputNumber
                min={0.00000001}
                step={0.00000001}
                style={{ width: "100%" }}
                placeholder="0.00000000"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item label="Comisiones (USD)" name="fees">
              <InputNumber
                min={0}
                step={0.01}
                style={{ width: "100%" }}
                placeholder="0.00"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <div className="flex gap-3">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 border-none h-10"
              >
                Guardar transacción
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
