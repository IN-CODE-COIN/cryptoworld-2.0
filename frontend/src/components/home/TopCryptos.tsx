import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { Card, Empty, Spin, message } from "antd";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

type Coin = {
  uuid: string;
  name: string;
  symbol: string;
  price: string;
  iconUrl: string;
  change: number;
  marketCap: string;
};

type ApiResponse = {
  topCryptos: Coin[];
  watchlistUuids: string[];
};

const contentStyle: React.CSSProperties = {
  padding: 50,
  borderRadius: 4,
};

const content = <div style={contentStyle} />;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const TopCryptos = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await api.get<ApiResponse>("/home");
      setData(res.data);
      setWatchlist(res.data.watchlistUuids || []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error al obtener datos del backend", error);
        message.error(
          error.response?.data?.message || "Error al cargar las criptomonedas."
        );
      } else {
        console.error("Error inesperado:", error);
        message.error(
          "Ocurrió un error inesperado al cargar las criptomonedas."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNavigateDetails = (coin: Coin) => {
    navigate(`/crypto/${coin.uuid}`);
  };

  const handleAddToWatchlist = useCallback(async (coin: Coin) => {
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
          price: parseFloat(coin.price),
          change: coin.change,
          marketCap: parseFloat(coin.marketCap),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          message.warning({
            content:
              err.response.data.message ||
              "Esta criptomoneda ya está en tu lista.",
            key: "add_watchlist",
            duration: 2,
          });
        } else if (err.response?.status === 403) {
          message.warning({
            content:
              err.response.data.message ||
              "Has alcanzado el límite de criptomonedas en tu lista.",
            key: "add_watchlist",
            duration: 2,
          });
        } else if (err.response?.status === 401) {
          message.error({
            content:
              "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
            key: "add_watchlist",
            duration: 2,
          });
          localStorage.removeItem("token");
        } else {
          message.error({
            content:
              err.response?.data?.message || "Error al añadir la criptomoneda.",
            key: "add_watchlist",
            duration: 2,
          });
          console.error("Error en handleAddToWatchlist", err);
        }
      } else {
        console.error("Error inesperado en handleAddToWatchlist:", error);
        message.error({
          content: "Ocurrió un error inesperado al añadir la criptomoneda.",
          key: "add_watchlist",
          duration: 2,
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading)
    return (
      <>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Top 10
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Lista de las principales criptomonedas ordenadas por capitalización de
          mercado
        </p>
        <Spin tip="Cargando..." size="large">
          {content}
        </Spin>
      </>
    );

  if (!data)
    return (
      <>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Top 10
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Lista de las principales criptomonedas ordenadas por capitalización de
          mercado
        </p>
        <Empty style={contentStyle} />
      </>
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Top 10
      </h2>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Lista de las principales criptomonedas ordenadas por capitalización de
        mercado
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-5">
        {data.topCryptos.map((coin) => {
          const isInWatchlist = watchlist.includes(coin.uuid);
          return (
            <Card
              key={coin.uuid}
              size="small"
              hoverable
              className="max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg text-center"
              cover={
                <img
                  src={coin.iconUrl}
                  alt={coin.name}
                  className="h-15 w-15 object-contain pt-2"
                />
              }
              actions={[
                <div
                  key="añadir"
                  onClick={() => !isInWatchlist && handleAddToWatchlist(coin)}
                  className={
                    isInWatchlist
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-500 hover:text-blue-700 cursor-pointer"
                  }
                >
                  {isInWatchlist ? "✓ Añadido" : "Añadir"}
                </div>,
                <div
                  key="detalles"
                  onClick={() => handleNavigateDetails(coin)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  Detalles
                </div>,
              ]}
            >
              <Meta
                title={coin.name}
                description={`💰 Precio: ${parseFloat(coin.price).toFixed(2)}$`}
              />
              <p
                className={`text-sm mt-3 ${
                  coin.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                📈 Cambio 24h: {coin.change}%
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
