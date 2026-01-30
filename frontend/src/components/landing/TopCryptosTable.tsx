import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { Empty, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { SkeletonRow } from "./SkeletonRow";

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

type Props = {
  limit?: number;
  showViewMore?: boolean;
};

export const TopCryptosTable = ({ limit, showViewMore = false }: Props) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const displayedCryptos = !expanded && limit ? data?.topCryptos.slice(0, limit) : data?.topCryptos;

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
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToWatchlist = useCallback(async (coin: Coin) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Necesitas iniciar sesión para añadir a tu watchlist.");
      return;
    }

    try {
      message.loading({ content: "Añadiendo...", key: "add_watchlist" });

      await api.post(
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
        content: "Añadido a tu watchlist",
        key: "add_watchlist",
        duration: 2,
      });
      setWatchlist((prev) => [...prev, coin.uuid]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response?.status === 409) {
          message.warning({
            content: "Esta criptomoneda ya está en tu lista.",
            key: "add_watchlist",
            duration: 2,
          });
        } else if (err.response?.status === 403) {
          message.warning({
            content:
              err.response.data?.message ||
              "Has alcanzado el límite de criptomonedas en tu lista.",
            key: "add_watchlist",
            duration: 2,
          });
        } else {
          message.error({
            content:
              err.response?.data?.message || "Error al añadir la criptomoneda.",
            key: "add_watchlist",
            duration: 2,
          });
        }
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2">
              Top Criptomonedas
             </h2>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Ordenadas por capitalización de mercado
            </p>
          </div>
        <div
          className={`overflow-x-auto rounded-lg border ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                className={`border-b ${
                  theme === "dark"
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 dark:text-white">
                  #
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 dark:text-white">
                  Nombre
                </th>
                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 dark:text-white">
                  Símbolo
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-white">
                  Precio
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-white">
                  24h
                </th>
                <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-white">
                  Market Cap
                </th>
                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-900 dark:text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 10 }).map((_, idx) => (
                <SkeletonRow key={idx} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!data || data.topCryptos.length === 0) {
     return (
       <div className="space-y-4 max-w-5xl mx-auto">
         <div className="text-center mb-8">
           <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2">
             Top Criptomonedas
           </h2>
           <p
             className={`text-sm ${
               theme === "dark" ? "text-gray-400" : "text-gray-600"
             }`}
           >
             Ordenadas por capitalización de mercado
           </p>
         </div>
        <div className="flex justify-center">
          <Empty description="Sin datos" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-blue-400 mb-2">
          Top Criptomonedas
        </h2>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Ordenadas por capitalización de mercado
        </p>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-lg border ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className={`border-b ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 dark:text-white">
                #
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 dark:text-white">
                Nombre
              </th>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 dark:text-white">
                Símbolo
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-white">
                Precio
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-white">
                24h
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold text-gray-900 dark:text-white">
                Market Cap
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-900 dark:text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {displayedCryptos?.map((coin, idx) => {
              const isInWatchlist = watchlist.includes(coin.uuid);
              const changeColor =
                coin.change >= 0 ? "text-green-500" : "text-red-500";

              return (
                <tr
                  key={coin.uuid}
                  className={`transition-colors text-xs ${
                    theme === "dark"
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-2 py-2 font-medium text-gray-500 dark:text-gray-400">
                    {idx + 1}
                  </td>
                  <td className="px-2 py-2 font-medium">
                    <div className="flex items-center gap-2">
                      <img
                        src={coin.iconUrl}
                        alt={coin.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-gray-900 dark:text-white">
                        {coin.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-300">
                    {coin.symbol.toUpperCase()}
                  </td>
                  <td className="px-2 py-2 text-right font-medium text-gray-900 dark:text-white">
                    ${parseFloat(coin.price).toFixed(2)}
                  </td>
                  <td className={`px-2 py-2 text-right font-medium ${changeColor}`}>
                    {coin.change >= 0 ? "+" : ""}
                    {coin.change}%
                  </td>
                  <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300">
                    ${(parseFloat(coin.marketCap) / 1e9).toFixed(2)}B
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => !isInWatchlist && handleAddToWatchlist(coin)}
                        className={`text-xs font-medium px-2 py-1 rounded transition-colors whitespace-nowrap ${
                          isInWatchlist
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-blue-400"
                        }`}
                      >
                        {isInWatchlist ? "✓" : "+"}
                      </button>
                      <button
                        onClick={() => navigate(`/crypto/${coin.uuid}`)}
                        className="text-xs font-medium px-2 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expand Button */}
      {showViewMore && limit && data && data.topCryptos.length > limit && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) {
                message.info("Regístrate o inicia sesión para ver todas las criptomonedas");
              } else {
                setExpanded(!expanded);
              }
            }}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              localStorage.getItem("token")
                ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg"
                : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            }`}
          >
            <DownOutlined
              className={`transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
            {expanded ? "Mostrar menos" : "Ver todas las cryptos"}
          </button>
        </div>
      )}
    </div>
  );
};
