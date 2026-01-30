import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, message, Spin } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../lib/axios";
import axios, { AxiosError } from "axios";
import { useTheme } from "../../hooks/useTheme";

type Coin = {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: number;
  change: number;
  marketCap: number;
  description?: string;
  rank: number;
  ["24hVolume"]: number;
  allTimeHigh: { price: number };
  supply: { circulating: number; total: number };
  websiteUrl?: string;
  links?: { type: string; url: string }[];
};

const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    ...options,
  }).format(value);
};

export const CryptoDetail: React.FC = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCoin = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/crypto/${uuid}`);
        setCoin(response.data.coin);
      } catch (error) {
        console.error("Error al obtener detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [uuid]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get<{ watchlistUuids: string[] }>("/home", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchlist(res.data.watchlistUuids || []);
      } catch (error) {
        console.error("Error al cargar la watchlist:", error);
      }
    };
    fetchWatchlist();
  }, []);

  const handleAddToWatchlist = useCallback(async () => {
    if (!coin) return;
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Necesitas iniciar sesión para añadir a tu watchlist.");
      return;
    }

    try {
      message.loading({ content: "Añadiendo...", key: "add_watchlist" });

      const response = await api.post(
        "/watchlist",
        {
          uuid: coin.uuid,
          name: coin.name,
          symbol: coin.symbol,
          iconUrl: coin.iconUrl,
          price: coin.price,
          change: coin.change,
          marketCap: coin.marketCap,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success({
        content: response.data.message,
        key: "add_watchlist",
        duration: 2,
      });

      setWatchlist((prev) => [...prev, coin.uuid]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response?.status === 409) {
          message.warning("Esta criptomoneda ya está en tu lista.");
        } else if (err.response?.status === 403) {
          message.warning("Has alcanzado el límite de criptos en tu lista.");
        } else if (err.response?.status === 401) {
          message.error("Sesión expirada, inicia sesión de nuevo.");
          localStorage.removeItem("token");
        } else {
          message.error(err.response?.data?.message || "Error al añadir.");
        }
      }
    }
  }, [coin]);

  const handleRemoveFromWatchlist = useCallback(async () => {
    if (!coin) return;
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Necesitas iniciar sesión.");
      return;
    }

    try {
      message.loading({ content: "Removiendo...", key: "remove_watchlist" });

      // Encontrar el ID de la watchlist entry por UUID
      const watchlistEntry = await api.get<{ data: { id: number; uuid: string }[] }>("/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const entryToDelete = watchlistEntry.data.data.find((item: any) => item.uuid === coin.uuid);
      
      if (!entryToDelete) {
        message.error("No se encontró la entrada en tu lista.");
        return;
      }

      await api.delete(`/watchlist/${entryToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success({
        content: "Removido de tu lista de seguimiento",
        key: "remove_watchlist",
        duration: 2,
      });

      setWatchlist((prev) => prev.filter((uuid) => uuid !== coin.uuid));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response?.status === 401) {
          message.error("Sesión expirada, inicia sesión de nuevo.");
          localStorage.removeItem("token");
        } else {
          message.error(err.response?.data?.message || "Error al remover.");
        }
      }
    }
  }, [coin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!coin)
    return (
      <p className={`text-center mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        No se encontró la criptomoneda
      </p>
    );

  const isInWatchlist = watchlist.includes(coin.uuid);
  const isPositive = coin.change >= 0;

  return (
    <div className="w-full space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
      >
        <ArrowLeftOutlined /> Volver al Dashboard
      </button>

      {/* Header */}
      <div
        className={`rounded-xl border p-8 ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={coin.iconUrl}
              alt={coin.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full"
            />
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                {coin.name}
              </h1>
              <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {coin.symbol.toUpperCase()} · Ranking #{coin.rank}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isInWatchlist ? (
              <>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-green-900/20 border border-green-700"
                    : "bg-green-50 border border-green-300"
                }`}>
                  <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                  <span className="font-medium text-green-700 dark:text-green-300">En tu lista</span>
                </div>
                <Button
                  size="small"
                  type="text"
                  danger
                  onClick={handleRemoveFromWatchlist}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Remover de tu lista de seguimiento"
                >
                  Remover
                </Button>
              </>
            ) : (
              <Button
                size="large"
                type="primary"
                onClick={handleAddToWatchlist}
                className="bg-gradient-to-r from-blue-600 to-blue-400 border-0 text-white"
                title="Añadir a tu lista de seguimiento"
              >
                Añadir a tu lista
              </Button>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-3">
          <div>
            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Precio Actual
            </p>
            <p className="text-5xl font-bold dark:text-white">
              ${formatNumber(coin.price, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isPositive
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpOutlined className="text-lg" />
            ) : (
              <ArrowDownOutlined className="text-lg" />
            )}
            <span className="font-semibold">
              {isPositive ? "+" : ""}{formatNumber(coin.change)}% últimas 24h
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Capitalización de Mercado", value: `$${formatNumber(coin.marketCap)}` },
          { label: "Volumen 24h", value: `$${formatNumber(coin["24hVolume"])}` },
          { label: "Máximo Histórico", value: `$${formatNumber(coin.allTimeHigh.price, { minimumFractionDigits: 2 })}` },
          { label: "Suministro Circulante", value: formatNumber(coin.supply.circulating) },
          { label: "Suministro Total", value: formatNumber(coin.supply.total) },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-lg border p-4 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {stat.label}
            </p>
            <p className="text-xl font-bold dark:text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="space-y-4">
        {coin.websiteUrl && (
          <a
            href={coin.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            🌐 Sitio web oficial
          </a>
        )}

        {coin.links && coin.links.length > 0 && (
          <div className={`rounded-lg border p-6 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}>
            <h3 className="text-lg font-semibold dark:text-white mb-4">
              Redes y Enlaces
            </h3>
            <div className="flex flex-wrap gap-3">
              {coin.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  🔗 {link.type}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
