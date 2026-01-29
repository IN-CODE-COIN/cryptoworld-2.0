import { useState, useRef, useEffect } from "react";
import { Modal, Input, message, Spin } from "antd";
import { SearchOutlined, CloseOutlined, ArrowRightOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

type Coin = {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
};

type SearchCryptoProps = {
  searchModalVisible: boolean;
  setSearchModalVisible: (visible: boolean) => void;
  onMobileNavigate?: () => void;
};

export const SearchCrypto = ({
  searchModalVisible,
  setSearchModalVisible,
  onMobileNavigate,
}: SearchCryptoProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Coin[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(
        `/crypto/autocomplete?query=${encodeURIComponent(query)}`
      );
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error al buscar sugerencias:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (coin: Coin) => {
    setSearchValue(`${coin.name} (${coin.symbol})`);
    setShowSuggestions(false);
    setSearchModalVisible(false);
    if (onMobileNavigate) {
      onMobileNavigate();
    }
    navigate(`/crypto/${coin.uuid}`);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) {
      message.warning("Por favor, introduce un término de búsqueda.");
      return;
    }

    const found = suggestions.find(
      (c) =>
        `${c.name} (${c.symbol})`.toLowerCase() === searchValue.toLowerCase()
    );

    if (found) {
      setSearchModalVisible(false);
      navigate(`/crypto/${found.uuid}`);
    } else {
      message.error("No se encontró ninguna criptomoneda con ese nombre.");
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!searchModalVisible) {
      setSearchValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchModalVisible]);

  return (
    <Modal
      open={searchModalVisible}
      onCancel={() => setSearchModalVisible(false)}
      footer={null}
      centered
      width={500}
      styles={{
        content: {
          padding: 0,
          borderRadius: "12px",
        },
      }}
      closeIcon={<CloseOutlined />}
    >
      <div
        className={`rounded-xl overflow-hidden ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`px-6 py-6 border-b ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Buscar Criptomoneda
          </h2>
          <div className="relative">
            <Input.Search
              ref={inputRef}
              placeholder="Bitcoin, Ethereum, Solana..."
              enterButton={<SearchOutlined />}
              size="large"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              onSearch={handleSearch}
              onFocus={() => {
                if (searchValue.length >= 2) {
                  setShowSuggestions(true);
                }
              }}
              autoFocus
              className="search-input"
            />
          </div>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <Spin tip="Buscando..." size="small" />
          ) : showSuggestions && suggestions.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {suggestions.map((coin) => (
                <button
                  key={coin.uuid}
                  onClick={() => handleSuggestionClick(coin)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group ${
                    theme === "dark"
                      ? "hover:bg-gray-700 bg-gray-800"
                      : "hover:bg-blue-50 bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.iconUrl}
                      alt={coin.name}
                      className="w-6 h-6 object-contain rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {coin.name}
                      </p>
                      <p
                        className={`text-xs ${
                          theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <ArrowRightOutlined
                    className={`text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                </button>
              ))}
            </div>
          ) : searchValue.length >= 2 && !loading ? (
            <div
              className={`text-center py-8 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700/50"
                  : "bg-gray-100"
              }`}
            >
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                No se encontraron criptomonedas
              </p>
            </div>
          ) : (
            <div
              className={`text-center py-8 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700/50"
                  : "bg-gray-100"
              }`}
            >
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Escribe al menos 2 caracteres para buscar
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
