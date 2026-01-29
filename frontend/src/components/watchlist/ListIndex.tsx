import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Empty, Button, Modal, message } from "antd";
import { DeleteOutlined, ExclamationCircleFilled, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import api from "../../lib/axios";

const CRYPTO_LIMIT = 10;

type Coin = {
  id: number;
  name: string;
  symbol: string;
  icon_url?: string;
  price: number;
  change: number;
  market_cap: number;
};

type ListIndexProps = {
  onOpenSearch?: () => void;
};

const formatMarketCap = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
};

export const ListIndex = ({ onOpenSearch }: ListIndexProps) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isNormalPlan = user?.rol === "normal";
  const coinsCount = coins.length;
  const canAddMore = coinsCount < CRYPTO_LIMIT;
  const hasReachedLimit = isNormalPlan && coinsCount === CRYPTO_LIMIT;

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<{ data: Coin[] }>("/watchlist");
      setCoins(data.data || []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          message.error("Tu sesión ha expirado. Inicia sesión de nuevo.");
          localStorage.removeItem("token");
        } else {
          message.error("Error al cargar tu lista de seguimiento.");
        }
      } else {
        console.error("Error inesperado:", error);
        message.error("Ocurrió un error inesperado.");
      }
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCoin = useCallback(async (id: number) => {
    setIsDeleting(id);
    try {
      await api.delete(`/watchlist/${id}`);
      message.success("Criptomoneda eliminada de la lista de seguimiento.");
      setCoins((prev) => prev.filter((coin) => coin.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          message.error("Tu sesión ha expirado. Inicia sesión de nuevo.");
          localStorage.removeItem("token");
        } else {
          message.error("No se pudo eliminar la criptomoneda.");
        }
      } else {
        console.error("Error inesperado:", error);
        message.error("Ocurrió un error inesperado.");
      }
    } finally {
      setIsDeleting(null);
    }
  }, []);

  const showDeleteConfirm = useCallback(
    (coin: Coin) => {
      Modal.confirm({
        title: `¿Estás seguro de eliminar ${coin.name}?`,
        icon: <ExclamationCircleFilled />,
        content: "Esta acción no se puede deshacer.",
        okText: "Sí, eliminar",
        okType: "danger",
        cancelText: "No, cancelar",
        onOk() {
          removeCoin(coin.id);
        },
      });
    },
    [removeCoin]
  );

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return (
    <Spin
      spinning={loading}
      tip="Cargando lista de seguimiento..."
      size="large"
    >
      <div className="space-y-4">
        {isNormalPlan && canAddMore && (
          <button
            onClick={onOpenSearch}
            className={`w-full rounded-xl border-2 border-dashed p-4 transition-all ${
              theme === "dark"
                ? "bg-blue-900/20 border-blue-700 hover:bg-blue-900/30 hover:border-blue-600"
                : "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <PlusOutlined className="text-blue-600 dark:text-blue-400 text-lg" />
              <span className={`font-semibold ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`}>
                Añadir criptomonedas a tu lista ({coinsCount}/{CRYPTO_LIMIT})
              </span>
            </div>
          </button>
        )}

        {hasReachedLimit && (
          <div
            className={`rounded-xl border-2 border-dashed p-4 ${
              theme === "dark"
                ? "bg-amber-900/20 border-amber-700"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <p className={`text-sm text-center ${theme === "dark" ? "text-amber-300" : "text-amber-700"}`}>
              ¡Has alcanzado el límite de {CRYPTO_LIMIT} criptomonedas en tu lista!{" "}
              <button
                onClick={() => navigate("/pricing")}
                className="font-semibold hover:underline"
              >
                Mejora tu plan
              </button>
              {" "}para añadir más.
            </p>
          </div>
        )}

        {coins.length === 0 ? (
          <div
            className={`rounded-xl border p-12 text-center ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <Empty description="No tienes criptomonedas en tu lista de seguimiento todavía." />
          </div>
        ) : (
          <div
            className={`rounded-xl border overflow-hidden ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className={`border-b ${
                      theme === "dark"
                        ? "bg-gray-900 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                      24h
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Cap. Mercado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  theme === "dark"
                    ? "divide-gray-700"
                    : "divide-gray-200"
                }`}>
                  {coins.map((coin, idx) => (
                    <tr
                      key={coin.id}
                      className={`transition-colors ${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.icon_url}
                            alt={coin.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/24";
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {coin.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {coin.symbol}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                        ${coin.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-medium ${
                            coin.change >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {coin.change >= 0 ? "+" : ""}
                          {coin.change.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                        {formatMarketCap(coin.market_cap)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/crypto/${coin.id}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title={`Ver detalles de ${coin.name}`}
                          >
                            <EyeOutlined />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                          <button
                            onClick={() => showDeleteConfirm(coin)}
                            disabled={isDeleting === coin.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                              isDeleting === coin.id
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            }`}
                            title={`Eliminar ${coin.name} de la lista`}
                          >
                            <DeleteOutlined />
                            <span className="hidden sm:inline">
                              {isDeleting === coin.id ? "..." : "Eliminar"}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Spin>
  );
};
