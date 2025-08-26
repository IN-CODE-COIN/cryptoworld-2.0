import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  InputNumber,
  Select,
  Input,
  Button,
  message,
  Tag,
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
        `/crypto/autocomplete?query=${encodeURIComponent(query)}`
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
      const timestamp = Math.floor(new Date(dateStr).getTime() / 1000); // Unix timestamp
      const response = await api.get(`/coin/price`, {
        params: { uuid: cryptoUuid, timestamp },
      });

      if (response.data?.status === "success" && response.data?.data?.price) {
        const price = parseFloat(response.data.data.price).toFixed(2);
        form.setFieldsValue({ price_usd: parseFloat(price) });
      } else {
        form.setFieldsValue({ price_usd: undefined });
      }
    } catch {
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
    if (!isNaN(amount) && amount > 0 && !isNaN(price) && price > 0) {
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
    <section className="container md:w-5xl flex flex-col mx-auto">
      {loading && (
        <Spin
          fullscreen={true}
          tip="Cargando..."
          size="large"
          className="fixed inset-0 flex items-center justify-center bg-white/50 z-50"
        />
      )}

      <div className="text-left max-w-xl mb-10">
        <Tag bordered color="purple" className="max-w-max font-semibold">
          <span className="uppercase"> Criptomonedas </span>
        </Tag>
        <h2 className="text-4xl font-bold mt-4 text-gray-900 dark:text-gray-100">
          Comprar / Vender
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 font-medium">
          Registra tus operaciones de compra o venta de criptomonedas.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-2xl text-gray-800 dark:text-gray-100 mb-2">
          Nueva transacción
        </h3>
        <Button
          size="small"
          onClick={() => navigate("/cartera")}
          title="Volver a la cartera"
        >
          Volver
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ type: "buy", date: dayjs() }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    //ref={inputRef}
                    value={form.getFieldValue("crypto_name")}
                    options={cryptoOptions.map((c) => ({
                      value: `${c.name} (${c.symbol})`,
                    }))}
                    onSearch={fetchCryptoSuggestions}
                    onSelect={(value) => {
                      const selected = cryptoOptions.find(
                        (c) => `${c.name} (${c.symbol})` === value
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
                            date.format("YYYY-MM-DD")
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
                      (c) => c.uuid === uuid
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
                          date.format("YYYY-MM-DD")
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
                      date.format("YYYY-MM-DD")
                    );
                }}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Form.Item label="Comisiones (USD)" name="fees">
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="small" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};
