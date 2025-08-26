import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button, message } from "antd";
import api from "../../lib/axios";
import axios, { AxiosError } from "axios";

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [coin, setCoin] = useState<Coin | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await api.get(`/crypto/${uuid}`);
        setCoin(response.data.coin);
      } catch (error) {
        console.error("Error al obtener detalles:", error);
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
        `${API_BASE_URL}/watchlist`,
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

  if (!coin) return <p className="text-center mt-10">Cargando...</p>;
  const isInWatchlist = watchlist.includes(coin.uuid);

  return (
    <div className="max-w-xl lg:max-w-6xl mx-auto p-6 bg-white shadow rounded-xl dark:bg-gray-800">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-3xl flex items-center gap-4 dark:text-white">
          <img
            src={coin.iconUrl}
            alt={coin.name}
            className="w-10 h-10 md:w-14 md:h-14 object-contain"
          />
          {coin.name} ({coin.symbol})
        </h2>
        <Button
          size="small"
          title={
            isInWatchlist
              ? "Ya en tú lista de seguimiento"
              : "Añadir a tu lista de seguimiento"
          }
          type={isInWatchlist ? "default" : "primary"}
          disabled={isInWatchlist}
          onClick={!isInWatchlist ? handleAddToWatchlist : undefined}
        >
          {isInWatchlist ? "✓ En tu lista" : "Añadir"}
        </Button>
      </div>

      <div className="text-center my-8">
        <p className="text-4xl font-bold dark:text-white">
          ${formatNumber(coin.price, { minimumFractionDigits: 2 })}
        </p>
        <p
          className={`text-lg ${
            coin.change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {coin.change >= 0 ? "▲" : "▼"} {formatNumber(coin.change)}% en las
          últimas 24h
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm dark:text-white">
        <p>
          <strong>Cap. de mercado:</strong> ${formatNumber(coin.marketCap)}
        </p>
        <p>
          <strong>Volumen 24h:</strong> ${formatNumber(coin["24hVolume"])}
        </p>
        <p>
          <strong>Máximo histórico:</strong> $
          {formatNumber(coin.allTimeHigh.price, { minimumFractionDigits: 2 })}
        </p>
        <p>
          <strong>Ranking:</strong> #{formatNumber(coin.rank)}
        </p>
        <p>
          <strong>Circulación:</strong> {formatNumber(coin.supply.circulating)}
        </p>
        <p>
          <strong>Suministro total:</strong> {formatNumber(coin.supply.total)}
        </p>
      </div>

      {coin.websiteUrl && (
        <a
          href={coin.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 text-blue-600 hover:underline font-medium"
        >
          🌐 Sitio web oficial
        </a>
      )}

      {coin.links && coin.links.length > 0 && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-2">Redes y enlaces</h4>
          <ul className="flex flex-wrap gap-4 text-sm">
            {coin.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  🔗 {link.type}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
